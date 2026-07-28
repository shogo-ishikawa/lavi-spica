import { uniqueId } from "./utils.js";

export class PythonRuntime extends EventTarget {
  constructor({ timeoutMs = 30_000 } = {}) {
    super();
    this.timeoutMs = timeoutMs;
    this.worker = null;
    this.ready = false;
    this.pending = new Map();
    this.lastStatus = { message: "未初期化", detail: "" };
  }

  #emit(name, detail) {
    this.dispatchEvent(new CustomEvent(name, { detail }));
  }

  #createWorker() {
    if (this.worker) return;
    this.worker = new Worker(new URL("../workers/python-worker.mjs", import.meta.url), { type: "module" });
    this.worker.addEventListener("message", (event) => this.#handleMessage(event.data));
    this.worker.addEventListener("error", (event) => {
      const error = new Error(event.message || "Python Workerで不明なエラーが発生しました");
      this.#rejectAll(error);
      this.#emit("error", { message: error.message });
    });
  }

  #handleMessage(message) {
    if (message.type === "status") {
      this.lastStatus = { message: message.message || "処理中", detail: message.detail || "" };
      this.#emit("status", this.lastStatus);
      return;
    }
    if (message.type === "ready") {
      this.ready = true;
      this.#emit("ready", message);
      return;
    }
    if (message.type === "result" || message.type === "worker-error") {
      const pending = this.pending.get(message.requestId);
      if (!pending) return;
      clearTimeout(pending.timer);
      this.pending.delete(message.requestId);
      if (message.type === "result") pending.resolve(message.result);
      else pending.reject(new Error(message.message || "Python実行環境でエラーが発生しました"));
    }
  }

  #rejectAll(error) {
    for (const pending of this.pending.values()) {
      clearTimeout(pending.timer);
      pending.reject(error);
    }
    this.pending.clear();
  }

  init() {
    this.#createWorker();
    this.worker.postMessage({ type: "init" });
  }

  async run(code, { filename = "student.py", timeoutMs = this.timeoutMs } = {}) {
    this.#createWorker();
    const requestId = uniqueId("run");
    const promise = new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(requestId);
        this.cancel(`実行が${Math.round(timeoutMs / 1000)}秒を超えたため停止しました。反復回数やデータ量を減らしてください。`);
        reject(new Error(`実行時間が${Math.round(timeoutMs / 1000)}秒を超えました`));
      }, timeoutMs);
      this.pending.set(requestId, { resolve, reject, timer });
    });
    this.worker.postMessage({ type: "run", requestId, code, filename });
    return promise;
  }

  cancel(reason = "実行を停止しました") {
    if (this.worker) this.worker.terminate();
    this.worker = null;
    this.ready = false;
    this.#rejectAll(new Error(reason));
    this.lastStatus = { message: "停止済み", detail: "次の実行時に再初期化します" };
    this.#emit("status", this.lastStatus);
  }

  destroy() {
    this.cancel("実行環境を終了しました");
  }
}
