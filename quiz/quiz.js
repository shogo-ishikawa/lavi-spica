import {
  parseQuizPayload,
  scopeName,
} from "./quiz-core.js";
import {
  downloadJSON,
  escapeAttribute,
  escapeHTML,
  formatDateTime,
  formatDuration,
  uniqueId,
} from "../js/utils.js";

const view = document.querySelector("#quizView");
const toastRegion = document.querySelector("#toastRegion");
const payload = parseQuizPayload();
const config = payload?.config || null;
const questions = payload?.questions || [];
const questionById = new Map(questions.map((question) => [question.id, question]));
const storageSuffix = payload ? `${config.id}:${payload.fingerprint}` : "";
const activeKey = payload ? `lavi-spica:quiz-active:${storageSuffix}` : "";
const resultKey = payload ? `lavi-spica:quiz-result:${storageSuffix}` : "";
let active = null;
let result = null;
let timer = null;

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
    // The quiz can continue even when temporary browser storage is unavailable.
  }
}

function pageIntro(title, text) {
  return `<header class="portal-title"><div class="eyebrow">LAVi-SPICA QUIZ</div><h1>${escapeHTML(title)}</h1><p>${escapeHTML(text)}</p></header>`;
}

function renderInvalid() {
  view.innerHTML = `
    ${pageIntro("小テストのリンクを確認してください", "このページは、授業当日に配布された専用リンクから開きます。")}
    <section class="card portal-card"><div class="card-body">
      <h2>有効な小テストが見つかりません</h2>
      <p>URLを途中で省略せず、LMSや教員から配布されたリンクをもう一度開いてください。</p>
    </div></section>`;
}

function renderStart() {
  view.innerHTML = `
    ${pageIntro(config.title, "氏名と学籍番号を確認してから開始してください。開始後は制限時間が進みます。")}
    <section class="portal-summary card"><div class="card-body">
      <div class="metric-grid">
        <div class="metric"><strong>${config.minutes}分</strong><span>制限時間</span></div>
        <div class="metric"><strong>${questions.length}問</strong><span>問題数</span></div>
        <div class="metric"><strong>${escapeHTML(scopeName(config.scope))}</strong><span>出題範囲</span></div>
        <div class="metric"><strong>${escapeHTML(config.id)}</strong><span>テストID</span></div>
      </div>
    </div></section>
    <section class="card portal-card"><div class="card-body">
      <form id="startForm" class="form-grid">
        <label class="form-field"><span>学籍番号</span><input class="input" name="studentId" required maxlength="24" autocomplete="off" placeholder="例：24B00000"></label>
        <label class="form-field"><span>氏名</span><input class="input" name="name" required maxlength="60" autocomplete="name"></label>
        <label class="choice full"><input type="checkbox" name="ready" required><span>入力内容と制限時間を確認しました。開始後はこの画面を閉じません。</span></label>
        <div class="form-field full"><button class="button primary portal-primary" type="submit">小テストを開始する</button></div>
      </form>
    </div></section>
    <p class="portal-footnote">回答はこのブラウザへ一時保存されます。提出後、回答データをJSONファイルとして保存してください。</p>`;
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
  return `<label class="form-field"><span class="sr-only">問${index + 1}の回答</span><input class="input" data-question="${escapeAttribute(question.id)}" value="${escapeAttribute(answer ?? "")}" placeholder="出力または短い回答を入力" autocomplete="off"></label>`;
}

function answeredCount() {
  return active.questionIds.filter((id) => {
    const value = active.answers?.[id];
    return Array.isArray(value) ? value.length > 0 : value !== undefined && String(value).trim() !== "";
  }).length;
}

function renderActive() {
  const selected = active.questionIds.map((id) => questionById.get(id)).filter(Boolean);
  view.innerHTML = `
    <section class="quiz-sticky-bar">
      <div><strong>${escapeHTML(config.title)}</strong><small><span id="answeredCount">${answeredCount()}</span> / ${selected.length}問回答</small></div>
      <div class="quiz-timer" id="quizTimer">${formatDuration((new Date(active.deadline).getTime() - Date.now()) / 1000)}</div>
    </section>
    <header class="portal-title compact"><div class="eyebrow">${escapeHTML(scopeName(config.scope))}</div><h1>回答画面</h1><p>${escapeHTML(active.profile.studentId)} · ${escapeHTML(active.profile.name)}</p></header>
    <section class="quiz-question-list">
      ${selected.map((question, index) => `
        <article class="card quiz-question-card" id="question-${escapeAttribute(question.id)}"><div class="card-body">
          <div class="question-heading"><span>問${index + 1}</span><span>${escapeHTML(question.difficulty)} · ${question.points}点</span></div>
          <h2>${escapeHTML(question.prompt)}</h2>
          ${question.code ? `<pre class="code-block"><code>${escapeHTML(question.code)}</code></pre>` : ""}
          <div class="choice-list">${questionInput(question, active.answers?.[question.id], index)}</div>
        </div></article>
      `).join("")}
    </section>
    <section class="quiz-submit-panel card"><div class="card-body">
      <p>未回答があっても提出できます。提出後は回答を変更できません。</p>
      <button class="button primary portal-primary" type="button" data-action="submit">回答を提出する</button>
    </div></section>`;
  startTimer();
}

function startQuiz(profile) {
  const started = new Date();
  active = {
    format: "lavi-spica-active-quiz-v3",
    appVersion: payload.appVersion,
    quizFingerprint: payload.fingerprint,
    config,
    profile,
    questionIds: questions.map((question) => question.id),
    answers: {},
    startedAt: started.toISOString(),
    deadline: new Date(started.getTime() + config.minutes * 60_000).toISOString(),
  };
  writeSession(activeKey, active);
  renderActive();
  window.scrollTo({ top: 0, behavior: "auto" });
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
  }
  writeSession(activeKey, active);
  const count = document.querySelector("#answeredCount");
  if (count) count.textContent = String(answeredCount());
}

function buildResponse(automatic) {
  return {
    format: "lavi-spica-quiz-response-v3",
    appVersion: payload.appVersion,
    responseId: uniqueId("response"),
    quizFingerprint: payload.fingerprint,
    config: { ...config },
    profile: { ...active.profile },
    questionIds: [...active.questionIds],
    answers: structuredClone(active.answers),
    startedAt: active.startedAt,
    submittedAt: new Date().toISOString(),
    durationSeconds: Math.max(0, Math.round((Date.now() - new Date(active.startedAt).getTime()) / 1000)),
    automatic: Boolean(automatic),
  };
}

function responseFilename(response) {
  const id = response.profile.studentId.replace(/[^0-9A-Za-z_-]/g, "_") || "student";
  const quizId = response.config.id.replace(/[^0-9A-Za-z_-]/g, "_") || "quiz";
  return `${id}_${quizId}.json`;
}

function renderResult() {
  view.innerHTML = `
    ${pageIntro("提出が完了しました", result.automatic ? "制限時間の終了により自動提出されました。" : "回答は確定しました。")}
    <section class="card portal-card result-card"><div class="card-body">
      <div class="result-mark">✓</div>
      <h2>${escapeHTML(result.profile.studentId)} ${escapeHTML(result.profile.name)} さん</h2>
      <p>得点と正答は教員の案内に従って確認してください。</p>
      <p class="help-text">提出時刻：${escapeHTML(formatDateTime(result.submittedAt))}</p>
      <button class="button primary portal-primary" type="button" data-action="download">回答データを保存する</button>
      <p class="portal-footnote">保存したJSONファイルを、指定されたLMSや提出先へ送信してください。</p>
    </div></section>`;
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
  if (download) downloadJSON(result, responseFilename(result));
}

function startTimer() {
  clearInterval(timer);
  const update = () => {
    if (!active) return;
    const remaining = Math.max(0, Math.ceil((new Date(active.deadline).getTime() - Date.now()) / 1000));
    const element = document.querySelector("#quizTimer");
    if (element) {
      element.textContent = formatDuration(remaining);
      element.classList.toggle("urgent", remaining <= 120);
    }
    if (remaining <= 0) submitQuiz({ automatic: true });
  };
  update();
  timer = setInterval(update, 1000);
}

view.addEventListener("submit", (event) => {
  if (event.target.id !== "startForm") return;
  event.preventDefault();
  const data = new FormData(event.target);
  startQuiz({
    studentId: String(data.get("studentId") || "").trim(),
    name: String(data.get("name") || "").trim(),
  });
});

view.addEventListener("input", (event) => {
  if (event.target.dataset.question) saveAnswer(event.target);
});

view.addEventListener("change", (event) => {
  if (event.target.dataset.question) saveAnswer(event.target);
});

view.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  if (target.dataset.action === "submit") {
    const missing = active.questionIds.length - answeredCount();
    if (missing && !window.confirm(`未回答が${missing}問あります。このまま提出しますか。`)) return;
    submitQuiz({ download: true });
  }
  if (target.dataset.action === "download" && result) {
    downloadJSON(result, responseFilename(result));
    toast("回答データを保存しました", responseFilename(result), "success");
  }
});

if (!payload) {
  renderInvalid();
} else {
  result = readSession(resultKey);
  active = readSession(activeKey);
  if (result?.format === "lavi-spica-quiz-response-v3" && result.quizFingerprint === payload.fingerprint) {
    renderResult();
  } else if (active?.config?.id === config.id && active?.quizFingerprint === payload.fingerprint) {
    if (new Date(active.deadline).getTime() <= Date.now()) submitQuiz({ automatic: true });
    else renderActive();
  } else {
    active = null;
    renderStart();
  }
}

window.addEventListener("beforeunload", () => clearInterval(timer));
