import {
  normalizeQuizPayload,
  parseQuizPayload,
  scopeName,
  validateStudentId,
  validateStudentName,
  validateParticipantProfile,
} from "./quiz-core.js";
import { PythonRuntime } from "../js/runtime.js";
import {
  downloadJSON,
  escapeAttribute,
  escapeHTML,
  formatDateTime,
  formatDuration,
  stripAnsi,
  uniqueId,
} from "../js/utils.js";

const view = document.querySelector("#quizView");
const toastRegion = document.querySelector("#toastRegion");
const bridgeRequested = new URLSearchParams(location.search).get("bridge") === "1";
const bridgeMode = bridgeRequested && window.parent !== window;
let payload = bridgeMode ? null : parseQuizPayload();
let config = payload?.config || null;
let questions = payload?.questions || [];
let questionById = new Map(questions.map((question) => [question.id, question]));
let storageSuffix = payload ? `${config.id}:${payload.fingerprint}` : "";
let activeKey = payload ? `lavi-spica:quiz-active:${storageSuffix}` : "";
let resultKey = payload ? `lavi-spica:quiz-result:${storageSuffix}` : "";
const runtime = new PythonRuntime({ timeoutMs: 25_000 });
const BRIDGE_CHANNEL = "lavi-spica-cloud-bridge-v1";
let bridgeOrigin = "";
let bridgeContext = null;
let pendingBridgeMessage = null;
let clockOffsetMs = 0;
let active = null;
let result = null;
let timer = null;
let runtimeReady = false;
let runtimeError = "";
let submissionBusy = false;
let lastLoadedFingerprint = payload?.fingerprint || "";

function toast(title, message = "", type = "info") {
  const item = document.createElement("div");
  item.className = `toast ${type}`;
  item.innerHTML = `<strong>${escapeHTML(title)}</strong>${message ? `<p>${escapeHTML(message)}</p>` : ""}`;
  toastRegion.append(item);
  setTimeout(() => item.remove(), 4500);
}

function readSession(key) {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeSession(key, value) {
  if (!key) return;
  try {
    if (value == null) sessionStorage.removeItem(key);
    else sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // The current attempt remains usable even when temporary storage is unavailable.
  }
}

function adjustedNow() {
  return Date.now() + clockOffsetMs;
}

function setClock(serverNow) {
  const server = Date.parse(String(serverNow || ""));
  if (Number.isFinite(server)) clockOffsetMs = server - Date.now();
}

function applyPayload(value) {
  const parsed = normalizeQuizPayload(value);
  if (!parsed) return false;
  const changed = !payload || parsed.fingerprint !== payload.fingerprint || parsed.config.id !== payload.config.id;
  payload = parsed;
  config = parsed.config;
  questions = parsed.questions;
  questionById = new Map(questions.map((question) => [question.id, question]));
  storageSuffix = `${config.id}:${payload.fingerprint}`;
  activeKey = `lavi-spica:quiz-active:${storageSuffix}`;
  resultKey = `lavi-spica:quiz-result:${storageSuffix}`;
  if (changed) {
    active = null;
    result = null;
    lastLoadedFingerprint = payload.fingerprint;
  }
  return true;
}

function pageIntro(title, text) {
  return `<header class="portal-title"><div class="eyebrow">LAVi-SPICA QUIZ</div><h1>${escapeHTML(title)}</h1><p>${escapeHTML(text)}</p></header>`;
}

function allowedBridgeOrigin(origin) {
  try {
    const url = new URL(origin);
    const host = url.hostname.toLowerCase();
    const secureCloudHost = (
      host.endsWith(".web.app")
      || host.endsWith(".firebaseapp.com")
      || host === "script.google.com"
      || host.endsWith(".script.google.com")
      || host === "script.googleusercontent.com"
      || host.endsWith(".script.googleusercontent.com")
    );
    const localDevelopment = (host === "localhost" || host === "127.0.0.1") && (url.protocol === "http:" || url.protocol === "https:");
    return (url.protocol === "https:" && secureCloudHost) || localDevelopment;
  } catch {
    return false;
  }
}

function postBridge(type, data = {}) {
  if (!bridgeMode || !bridgeOrigin) return;
  window.parent.postMessage({ channel: BRIDGE_CHANNEL, type, ...data }, bridgeOrigin);
}

function notifyBridgeReady() {
  if (!bridgeMode) return;
  const message = {
    channel: BRIDGE_CHANNEL,
    type: "ready",
    runtimeReady,
    runtimeError,
    fingerprint: payload?.fingerprint || "",
    active: Boolean(active),
    result: Boolean(result),
  };
  if (bridgeOrigin) window.parent.postMessage(message, bridgeOrigin);
  else window.parent.postMessage(message, "*"); // Initial handshake contains no personal or answer data.
}

function updateRuntimeNotice(message, state = "working") {
  const notice = document.querySelector("#pythonPrep");
  const button = document.querySelector("#startQuizButton");
  if (notice) {
    notice.dataset.state = state;
    notice.textContent = message;
  }
  if (button && !active && !result) {
    button.disabled = !runtimeReady;
    button.textContent = runtimeReady ? "小テストを開始する" : "Pythonを準備しています…";
  }
  if (bridgeMode) {
    const bridgeNotice = document.querySelector("#bridgeRuntime");
    if (bridgeNotice) {
      bridgeNotice.dataset.state = state;
      bridgeNotice.textContent = message;
    }
  }
}

runtime.addEventListener("status", (event) => {
  if (!runtimeReady) updateRuntimeNotice(event.detail.message || "Pythonを準備しています…", "working");
});
runtime.addEventListener("ready", () => {
  runtimeReady = true;
  runtimeError = "";
  updateRuntimeNotice("Python実行環境の準備ができました。", "ready");
  notifyBridgeReady();
  if (pendingBridgeMessage) {
    const message = pendingBridgeMessage;
    pendingBridgeMessage = null;
    applyBridgeStart(message);
  }
});
runtime.addEventListener("error", (event) => {
  runtimeReady = false;
  runtimeError = event.detail?.message || "Python実行環境を準備できませんでした。";
  updateRuntimeNotice(`準備エラー：${runtimeError}`, "error");
  notifyBridgeReady();
});

function renderInvalid() {
  view.innerHTML = `
    ${pageIntro("小テストのリンクを確認してください", "このページは、授業当日に教員から案内された入口から開きます。")}
    <section class="card portal-card"><div class="card-body">
      <h2>有効な小テストが見つかりません</h2>
      <p>URLを途中で省略せず、教員から案内された入口をもう一度開いてください。</p>
    </div></section>`;
}

function renderBridgeOnly() {
  view.innerHTML = `
    ${pageIntro("PC小テスト入口から開いてください", "クラウド小テストはNUメールと教室内QR認証を確認した後に表示されます。")}
    <section class="card portal-card"><div class="card-body">
      <h2>この問題画面だけを直接開くことはできません</h2>
      <p>Google Classroomなどで案内されたLAVi-SPICAのPC小テスト入口へ戻り、学生用NUメールで開いてください。</p>
    </div></section>`;
}

function renderBridgeWaiting(title = "小テストを準備しています", message = "教員がPCの小テストを開放するまで、この画面は自動的に待機します。") {
  view.innerHTML = `
    ${pageIntro(title, message)}
    <section class="card portal-card"><div class="card-body">
      <div class="runtime-prep" id="bridgeRuntime" data-state="${runtimeReady ? "ready" : runtimeError ? "error" : "working"}">${escapeHTML(runtimeReady ? "Python実行環境の準備ができました。" : runtimeError ? `準備エラー：${runtimeError}` : "Python実行環境を準備しています…")}</div>
      <p>学籍番号・氏名・出席認証はNUメール側で確認されます。このページに再入力する必要はありません。</p>
    </div></section>`;
}

function renderBridgeGraceClosed() {
  view.innerHTML = `
    ${pageIntro("回答時間は終了しました", "送信猶予は、回答時間内に作成済みの回答を通信送信するための時間です。")}
    <section class="card portal-card"><div class="card-body">
      <p>このブラウザには回答中のデータが見つからないため、新しく小テストを開始することはできません。</p>
    </div></section>`;
}

function renderStart() {
  view.innerHTML = `
    ${pageIntro(config.title, "氏名と学籍番号を確認してから開始してください。Pythonの準備完了後に開始すると、そこから制限時間が進みます。")}
    <section class="portal-summary card"><div class="card-body">
      <div class="metric-grid">
        <div class="metric"><strong>${config.minutes}分</strong><span>制限時間</span></div>
        <div class="metric"><strong>${questions.length}問</strong><span>問題数</span></div>
        <div class="metric"><strong>${escapeHTML(scopeName(config.scope))}</strong><span>出題範囲</span></div>
        <div class="metric"><strong>1問以上</strong><span>コード問題</span></div>
      </div>
    </div></section>
    <section class="card portal-card"><div class="card-body">
      <form id="startForm" class="form-grid" novalidate>
        <label class="form-field"><span>学籍番号</span>
          <input class="input" name="studentId" required maxlength="12" autocomplete="off" inputmode="text" autocapitalize="characters" placeholder="例：21B11001 / 01001" aria-describedby="studentIdHelp studentIdError">
          <small id="studentIdHelp">新形式または旧形式を、英数字すべて半角で入力します。</small>
          <small class="field-error" id="studentIdError" aria-live="polite"></small>
        </label>
        <label class="form-field"><span>氏名</span>
          <input class="input" name="name" required maxlength="60" autocomplete="name" placeholder="姓と名を入力" aria-describedby="nameHelp nameError">
          <small id="nameHelp">全角・半角のどちらも使えます。空白を除いて2文字以上必要です。</small>
          <small class="field-error" id="nameError" aria-live="polite"></small>
        </label>
        <div class="runtime-prep full" id="pythonPrep" data-state="working">Python実行環境を準備しています…</div>
        <label class="choice full"><input type="checkbox" name="ready" required><span>入力内容と制限時間を確認しました。開始後はこの画面を閉じません。</span></label>
        <div class="form-field full"><button class="button primary portal-primary" id="startQuizButton" type="submit" disabled>Pythonを準備しています…</button></div>
      </form>
    </div></section>
    <p class="portal-footnote">教員から別の指示がない限り、提出後に保存される回答JSONを指定された場所へ提出してください。</p>`;
  updateRuntimeNotice(runtimeReady ? "Python実行環境の準備ができました。開始しても制限時間を無駄にしません。" : (runtimeError ? `準備エラー：${runtimeError}` : "Python実行環境を準備しています…"), runtimeReady ? "ready" : runtimeError ? "error" : "working");
}

function questionInput(question, answer, index) {
  const name = `q-${question.id}`;
  if (question.type === "single") {
    return question.options.map((option, optionIndex) => `<label class="choice"><input type="radio" name="${escapeAttribute(name)}" value="${optionIndex}" data-question="${escapeAttribute(question.id)}" ${Number(answer) === optionIndex ? "checked" : ""}><span>${escapeHTML(option)}</span></label>`).join("");
  }
  if (question.type === "multi") {
    const selected = Array.isArray(answer) ? answer.map(Number) : [];
    return question.options.map((option, optionIndex) => `<label class="choice"><input type="checkbox" name="${escapeAttribute(name)}" value="${optionIndex}" data-question="${escapeAttribute(question.id)}" ${selected.includes(optionIndex) ? "checked" : ""}><span>${escapeHTML(option)}</span></label>`).join("");
  }
  if (question.type === "code") {
    const shown = answer === undefined ? question.starterCode : String(answer);
    return `<div class="quiz-code-shell">
      <div class="quiz-code-head"><span>Pythonコード</span><button class="button secondary small" type="button" data-action="run-code" data-question-id="${escapeAttribute(question.id)}">▶ 実行して確認</button></div>
      <textarea class="quiz-code-editor" data-question="${escapeAttribute(question.id)}" data-code-question="true" spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="問${index + 1}のPythonコード">${escapeHTML(shown)}</textarea>
      <pre class="quiz-code-output" id="code-output-${escapeAttribute(question.id)}" aria-live="polite">実行結果はここに表示されます。採点結果や正解は表示されません。</pre>
    </div>`;
  }
  return `<label class="form-field"><span class="sr-only">問${index + 1}の回答</span><input class="input" data-question="${escapeAttribute(question.id)}" value="${escapeAttribute(answer ?? "")}" placeholder="出力または短い回答を入力" autocomplete="off"></label>`;
}

function answerIsPresent(id) {
  const question = questionById.get(id);
  if (!question || !active) return false;
  const value = active.answers?.[id];
  if (question.type === "code") {
    return Boolean(active.codeTouched?.[id] && String(value ?? "").trim() && String(value).trim() !== String(question.starterCode || "").trim());
  }
  return Array.isArray(value) ? value.length > 0 : value !== undefined && String(value).trim() !== "";
}

function answeredCount() {
  return active ? active.questionIds.filter(answerIsPresent).length : 0;
}

function renderActive() {
  const selected = active.questionIds.map((id) => questionById.get(id)).filter(Boolean);
  view.innerHTML = `
    <section class="quiz-sticky-bar">
      <div><strong>${escapeHTML(config.title)}</strong><small><span id="answeredCount">${answeredCount()}</span> / ${selected.length}問回答</small></div>
      <div class="quiz-timer" id="quizTimer">${formatDuration((new Date(active.deadline).getTime() - adjustedNow()) / 1000)}</div>
    </section>
    <header class="portal-title compact"><div class="eyebrow">${escapeHTML(scopeName(config.scope))}</div><h1>回答画面</h1><p>${escapeHTML(active.profile.studentId)} · ${escapeHTML(active.profile.name)}</p></header>
    <section class="quiz-question-list">
      ${selected.map((question, index) => `
        <article class="card quiz-question-card" id="question-${escapeAttribute(question.id)}"><div class="card-body">
          <div class="question-heading"><span>問${index + 1}${question.type === "code" ? " · コード問題" : ""}</span><span>${escapeHTML(question.difficulty)} · ${question.points}点</span></div>
          <h2>${escapeHTML(question.prompt)}</h2>
          ${question.code ? `<pre class="code-block"><code>${escapeHTML(question.code)}</code></pre>` : ""}
          <div class="choice-list">${questionInput(question, active.answers?.[question.id], index)}</div>
        </div></article>
      `).join("")}
    </section>
    <section class="quiz-submit-panel card"><div class="card-body">
      <p>未回答があっても提出できます。提出後は回答を変更できません。</p>
      <button class="button primary portal-primary" type="button" data-action="submit" ${submissionBusy ? "disabled" : ""}>${submissionBusy ? "送信中…" : "回答を提出する"}</button>
    </div></section>`;
  startTimer();
}

function validateStartForm(form, showErrors = true) {
  const idInput = form.elements.studentId;
  const nameInput = form.elements.name;
  const idResult = validateStudentId(idInput.value);
  const nameResult = validateStudentName(nameInput.value);
  idInput.setCustomValidity(idResult.valid ? "" : idResult.message);
  nameInput.setCustomValidity(nameResult.valid ? "" : nameResult.message);
  if (showErrors) {
    const idError = form.querySelector("#studentIdError");
    const nameError = form.querySelector("#nameError");
    if (idError) idError.textContent = idResult.valid ? "" : idResult.message;
    if (nameError) nameError.textContent = nameResult.valid ? "" : nameResult.message;
  }
  return { valid: idResult.valid && nameResult.valid && form.elements.ready.checked && runtimeReady, idResult, nameResult };
}

function makeActive(profile, startedAt, deadline, responseId = uniqueId("response")) {
  return {
    format: "lavi-spica-active-quiz-v4",
    appVersion: payload.appVersion,
    responseId,
    quizFingerprint: payload.fingerprint,
    config,
    profile,
    questionIds: questions.map((question) => question.id),
    answers: {},
    codeTouched: {},
    startedAt,
    deadline,
  };
}

function startQuiz(profile) {
  const started = new Date();
  active = makeActive(profile, started.toISOString(), new Date(started.getTime() + config.minutes * 60_000).toISOString());
  writeSession(activeKey, active);
  renderActive();
  window.scrollTo({ top: 0, behavior: "auto" });
}

function startBridgeQuiz(message) {
  const profile = message.profile || {};
  if (!validateParticipantProfile(profile)) {
    renderBridgeWaiting("学生情報を確認できません", "NUメール側の学生登録を更新してから、PC小テスト入口を開き直してください。");
    return;
  }
  result = readSession(resultKey);
  if (result?.profile?.studentId !== profile.studentId || result?.quizFingerprint !== payload.fingerprint) {
    result = null;
    writeSession(resultKey, null);
  }
  active = readSession(activeKey);
  if (active?.profile?.studentId !== profile.studentId || active?.quizFingerprint !== payload.fingerprint) {
    active = null;
    writeSession(activeKey, null);
  }
  if (result) {
    renderResult();
    if (!result.cloudSubmission) sendBridgeResponse();
    return;
  }
  if (!active && message.graceOnly) {
    renderBridgeGraceClosed();
    return;
  }
  if (!active) {
    active = makeActive(profile, String(message.startedAt), String(message.deadline));
  } else {
    active.profile = profile;
    active.startedAt = String(message.startedAt || active.startedAt);
    active.deadline = String(message.deadline || active.deadline);
  }
  bridgeContext = { ...message };
  writeSession(activeKey, active);
  renderActive();
}

function saveAnswer(target) {
  const id = target.dataset.question;
  const question = questionById.get(id);
  if (!question || !active) return;
  if (question.type === "multi") {
    active.answers[id] = [...document.querySelectorAll(`input[data-question="${CSS.escape(id)}"]:checked`)].map((input) => Number(input.value));
  } else if (question.type === "single") {
    active.answers[id] = Number(target.value);
  } else {
    active.answers[id] = target.value;
    if (question.type === "code") active.codeTouched[id] = true;
  }
  writeSession(activeKey, active);
  const count = document.querySelector("#answeredCount");
  if (count) count.textContent = String(answeredCount());
}

async function runStudentCode(questionId, button) {
  const question = questionById.get(questionId);
  const editor = document.querySelector(`textarea[data-code-question][data-question="${CSS.escape(questionId)}"]`);
  const output = document.querySelector(`#code-output-${CSS.escape(questionId)}`);
  if (!question || !editor || !output || !active) return;
  saveAnswer(editor);
  button.disabled = true;
  button.textContent = "実行中…";
  output.classList.remove("error", "success");
  output.textContent = "Pythonで実行しています…";
  try {
    const execution = await runtime.run(editor.value, { filename: `${questionId}.py`, timeoutMs: 25_000 });
    const stdout = stripAnsi(execution.stdout || "").trimEnd();
    const stderr = stripAnsi(execution.stderr || "").trimEnd();
    const error = stripAnsi(execution.error || "").trimEnd();
    if (error) {
      output.classList.add("error");
      output.textContent = error;
    } else {
      output.classList.add("success");
      output.textContent = [stdout || "実行は完了しました（標準出力はありません）。", stderr].filter(Boolean).join("\n\n");
    }
  } catch (error) {
    output.classList.add("error");
    output.textContent = error.message || String(error);
  } finally {
    button.disabled = false;
    button.textContent = "▶ 実行して確認";
  }
}

function buildResponse(automatic) {
  const now = adjustedNow();
  return {
    format: "lavi-spica-quiz-response-v4",
    appVersion: payload.appVersion,
    responseId: active.responseId || uniqueId("response"),
    quizFingerprint: payload.fingerprint,
    config: { ...config },
    profile: { ...active.profile },
    questionIds: [...active.questionIds],
    answers: structuredClone(active.answers),
    startedAt: active.startedAt,
    submittedAt: new Date(now).toISOString(),
    durationSeconds: Math.max(0, Math.round((now - new Date(active.startedAt).getTime()) / 1000)),
    automatic: Boolean(automatic),
  };
}

function responseFilename(response) {
  const id = response.profile.studentId.replace(/[^0-9A-Za-z_-]/g, "_") || "student";
  const quizId = response.config.id.replace(/[^0-9A-Za-z_-]/g, "_") || "quiz";
  return `${id}_${quizId}.json`;
}

function renderResult() {
  const cloud = result.cloudSubmission;
  const pending = cloud?.eligibility === "pending_second";
  const failed = Boolean(result.cloudError && !cloud);
  const title = bridgeMode
    ? pending ? "回答を仮受け付けしました" : failed ? "送信を完了できませんでした" : cloud ? "提出が完了しました" : "回答を送信しています"
    : "提出が完了しました";
  const lead = bridgeMode
    ? pending ? "教員が表示する第2認証QRを読み取ると、評価対象として確定します。" : failed ? "通信状態を確認して、同じ回答を再送してください。" : cloud ? "回答はクラウドへ記録されました。" : "この画面を閉じずに待ってください。"
    : result.automatic ? "制限時間の終了により自動提出されました。" : "回答は確定しました。";
  view.innerHTML = `
    ${pageIntro(title, lead)}
    <section class="card portal-card result-card"><div class="card-body">
      <div class="result-mark">${failed ? "!" : "✓"}</div>
      <h2>${escapeHTML(result.profile.studentId)} ${escapeHTML(result.profile.name)} さん</h2>
      ${bridgeMode ? `
        ${pending ? `<p>回答は保存済みですが、出席条件の第2認証が未完了です。</p>` : cloud ? `<p>選択・短答問題は自動採点され、コード問題は教員が隠しテストと内容を確認します。</p>` : `<p id="cloudStatus">${escapeHTML(result.cloudError || "クラウドへ送信しています…")}</p>`}
        ${failed ? `<button class="button primary portal-primary" type="button" data-action="retry-cloud">同じ回答を再送する</button>` : ""}
      ` : `
        <p>得点は、選択・短答問題の自動採点とコード問題のテスト・確認を教員が行った後に確定します。</p>
        <button class="button primary portal-primary" type="button" data-action="download">回答JSONを保存する</button>
        <p class="portal-footnote">保存したJSONファイルを、教員が指定した提出先へ添付してください。</p>
      `}
      <p class="help-text">回答確定時刻：${escapeHTML(formatDateTime(result.submittedAt))}</p>
    </div></section>`;
}

function sendBridgeResponse() {
  if (!bridgeMode || !result || submissionBusy) return;
  submissionBusy = true;
  result.cloudError = "";
  writeSession(resultKey, result);
  renderResult();
  postBridge("submit", { response: result });
}

function submitQuiz({ automatic = false, download = false } = {}) {
  if (!active) return;
  clearInterval(timer);
  timer = null;
  result = buildResponse(automatic);
  writeSession(activeKey, null);
  writeSession(resultKey, result);
  active = null;
  renderResult();
  window.scrollTo({ top: 0, behavior: "auto" });
  if (bridgeMode) sendBridgeResponse();
  else if (download) downloadJSON(result, responseFilename(result));
}

function startTimer() {
  clearInterval(timer);
  const update = () => {
    if (!active) return;
    const remaining = Math.max(0, Math.ceil((new Date(active.deadline).getTime() - adjustedNow()) / 1000));
    const element = document.querySelector("#quizTimer");
    if (element) {
      element.textContent = formatDuration(remaining);
      element.classList.toggle("urgent", remaining <= 60);
    }
    if (remaining <= 0) submitQuiz({ automatic: true });
  };
  update();
  timer = setInterval(update, 500);
}

function applyBridgeStart(message) {
  if (!payload) {
    renderBridgeWaiting("問題を受信できませんでした", "PC小テスト入口を再読み込みしてください。");
    return;
  }
  if (!runtimeReady) {
    pendingBridgeMessage = message;
    renderBridgeWaiting("Pythonを準備しています", "実行環境の準備が完了すると、教員が指定した共通時刻からの小テストを表示します。");
    return;
  }
  setClock(message.serverNow);
  bridgeContext = { ...(bridgeContext || {}), ...message };
  startBridgeQuiz(bridgeContext);
}

function handleBridgeMessage(event) {
  if (!bridgeMode || event.source !== window.parent || !allowedBridgeOrigin(event.origin)) return;
  const message = event.data;
  if (!message || message.channel !== BRIDGE_CHANNEL) return;
  bridgeOrigin = event.origin;
  if (message.type === "preload") {
    setClock(message.serverNow);
    bridgeContext = { ...(bridgeContext || {}), ...message };
    renderBridgeWaiting();
    notifyBridgeReady();
    return;
  }
  if (message.type === "start") {
    if (!applyPayload(message.quizPayload)) {
      renderBridgeWaiting("問題構成を確認できませんでした", "PC小テスト入口を再読み込みし、教員へ知らせてください。");
      return;
    }
    notifyBridgeReady();
    applyBridgeStart(message);
    return;
  }
  if (message.type === "deadline") {
    setClock(message.serverNow);
    bridgeContext = { ...(bridgeContext || {}), ...message };
    if (active) {
      active.deadline = String(message.deadline || active.deadline);
      writeSession(activeKey, active);
      if (new Date(active.deadline).getTime() <= adjustedNow()) submitQuiz({ automatic: true });
    }
    return;
  }
  if (message.type === "submit-status") {
    const status = document.querySelector("#cloudStatus");
    if (status) status.textContent = message.message || "回答を送信しています…";
    return;
  }
  if (message.type === "submit-result" && result) {
    submissionBusy = false;
    if (message.ok) {
      result.cloudSubmission = message.result || {};
      result.cloudError = "";
    } else {
      result.cloudError = String(message.error || "クラウド送信に失敗しました。");
    }
    writeSession(resultKey, result);
    renderResult();
  }
}

view.addEventListener("submit", (event) => {
  if (event.target.id !== "startForm") return;
  event.preventDefault();
  const checked = validateStartForm(event.target, true);
  if (!checked.valid) {
    event.target.reportValidity();
    if (!runtimeReady) toast("Pythonの準備が完了していません", runtimeError || "数秒待ってからもう一度確認してください。", runtimeError ? "error" : "info");
    return;
  }
  startQuiz({ studentId: checked.idResult.value, name: checked.nameResult.value });
});

view.addEventListener("input", (event) => {
  if (event.target.dataset.question) saveAnswer(event.target);
  if (event.target.form?.id === "startForm" && ["studentId", "name"].includes(event.target.name)) validateStartForm(event.target.form, true);
});

view.addEventListener("change", (event) => {
  if (event.target.dataset.question) saveAnswer(event.target);
});

view.addEventListener("click", async (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  if (target.dataset.action === "run-code") {
    await runStudentCode(target.dataset.questionId, target);
  } else if (target.dataset.action === "submit") {
    const missing = active.questionIds.length - answeredCount();
    if (missing && !window.confirm(`未回答が${missing}問あります。このまま提出しますか。`)) return;
    submitQuiz({ download: !bridgeMode });
  } else if (target.dataset.action === "download" && result) {
    downloadJSON(result, responseFilename(result));
    toast("回答JSONを保存しました", responseFilename(result), "success");
  } else if (target.dataset.action === "retry-cloud") {
    sendBridgeResponse();
  }
});

window.addEventListener("message", handleBridgeMessage);

if (bridgeRequested && !bridgeMode) {
  renderBridgeOnly();
} else if (bridgeMode) {
  runtime.init();
  renderBridgeWaiting();
  notifyBridgeReady();
  // The authenticated cloud portal origin and quiz payload arrive in a later message.
} else if (!payload) {
  renderInvalid();
} else {
  runtime.init();
  result = readSession(resultKey);
  active = readSession(activeKey);
  if (result?.format === "lavi-spica-quiz-response-v4" && result.quizFingerprint === payload.fingerprint) {
    renderResult();
  } else if (active?.format === "lavi-spica-active-quiz-v4" && active?.config?.id === config.id && active?.quizFingerprint === payload.fingerprint) {
    if (new Date(active.deadline).getTime() <= Date.now()) submitQuiz({ automatic: true });
    else renderActive();
  } else {
    active = null;
    renderStart();
  }
}

window.addEventListener("beforeunload", (event) => {
  clearInterval(timer);
  if (active) {
    event.preventDefault();
    event.returnValue = "";
  }
});
