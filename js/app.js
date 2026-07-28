import { COURSE_CONTENT } from "./content.js";
import { QUIZ_DATA } from "./quiz-bank.js";
import { CourseStore } from "./storage.js";
import { PythonRuntime } from "./runtime.js";
import {
  canonicalAnswer,
  clamp,
  codeBlock,
  copyText,
  debounce,
  downloadBlob,
  downloadJSON,
  downloadText,
  escapeAttribute,
  escapeHTML,
  formatBytes,
  formatDateTime,
  formatDuration,
  parseHashRoute,
  rowsToCSV,
  seededRandom,
  setHashRoute,
  shuffled,
  stripAnsi,
  uniqueId,
} from "./utils.js";

const APP_VERSION = COURSE_CONTENT.meta.version;
const LESSONS = [...COURSE_CONTENT.lessons].sort((a, b) => (a.session - b.session) || (a.order - b.order));
const LESSON_BY_ID = new Map(LESSONS.map((lesson) => [lesson.id, lesson]));
const SESSION_BY_ID = new Map(COURSE_CONTENT.sessions.map((session) => [Number(session.id), session]));
const QUESTIONS = QUIZ_DATA.questions;
const QUESTION_BY_ID = new Map(QUESTIONS.map((question) => [question.id, question]));
const PRACTICES = LESSONS.flatMap((lesson) => lesson.practices.map((practice) => ({ ...practice, lesson })));
const PRACTICE_BY_ID = new Map(PRACTICES.map((practice) => [practice.id, practice]));

const store = new CourseStore();
const runtime = new PythonRuntime({ timeoutMs: 40_000 });

const appView = document.querySelector("#appView");
const mainContent = document.querySelector("#mainContent");
const mainNav = document.querySelector("#mainNav");
const sidebar = document.querySelector("#sidebar");
const sidebarBackdrop = document.querySelector("#sidebarBackdrop");
const menuToggle = document.querySelector("#menuToggle");
const themeToggle = document.querySelector("#themeToggle");
const runtimePill = document.querySelector("#runtimePill");
const runtimeStatus = document.querySelector("#runtimeStatus");
const toastRegion = document.querySelector("#toastRegion");
const globalDialog = document.querySelector("#globalDialog");
const dialogTitle = document.querySelector("#dialogTitle");
const dialogBody = document.querySelector("#dialogBody");
const dialogActions = document.querySelector("#dialogActions");

let editorContexts = new Map();
let editorResults = new Map();
let currentRoute = null;
let quizTimer = null;
let recentQuizResult = null;
let importedQuizResults = [];
let practiceFilters = { session: "all", difficulty: "all", query: "" };
let currentPracticeId = PRACTICES[0]?.id ?? null;
let runtimeInitialized = false;

const saveDraftDebounced = debounce((lessonId, code) => store.setDraft(lessonId, code), 350);
const savePredictionDebounced = debounce((lessonId, text) => store.setPrediction(lessonId, text), 350);
const saveNoteDebounced = debounce((lessonId, text) => store.setLessonNote(lessonId, text), 350);
const saveExitDebounced = debounce((sessionId, text) => store.setExitTicket(sessionId, text), 350);

function lessonNumber(lesson) {
  const prefix = Number.parseInt(String(lesson?.id || "").split("-")[0], 10);
  return Number.isFinite(prefix) ? prefix : LESSONS.indexOf(lesson) + 1;
}

function sessionLessons(sessionId) {
  return LESSONS.filter((lesson) => Number(lesson.session) === Number(sessionId));
}

function completedCountForSession(sessionId, snapshot = store.snapshot()) {
  const completed = new Set(snapshot.completedLessons);
  return sessionLessons(sessionId).filter((lesson) => completed.has(lesson.id)).length;
}

function overallProgress(snapshot = store.snapshot()) {
  const completed = new Set(snapshot.completedLessons);
  const count = LESSONS.filter((lesson) => completed.has(lesson.id)).length;
  return { count, total: LESSONS.length, percent: Math.round((count / Math.max(1, LESSONS.length)) * 100) };
}

function nextIncompleteLesson(snapshot = store.snapshot()) {
  const completed = new Set(snapshot.completedLessons);
  return LESSONS.find((lesson) => !completed.has(lesson.id)) ?? LESSONS.at(-1);
}

function sessionLabel(sessionId) {
  const session = SESSION_BY_ID.get(Number(sessionId));
  return session ? `第${session.id}回 ${session.title}` : `第${sessionId}回`;
}

function trackBadge(lesson) {
  if (lesson.track === "advanced") return '<span class="badge advanced">講義資料発展</span>';
  return '<span class="badge core">Python基礎</span>';
}

function toast(title, message = "", type = "info", timeout = 4200) {
  const item = document.createElement("div");
  item.className = `toast ${type}`;
  item.innerHTML = `<strong>${escapeHTML(title)}</strong>${message ? `<p>${escapeHTML(message)}</p>` : ""}`;
  toastRegion.append(item);
  setTimeout(() => {
    item.style.opacity = "0";
    item.style.transform = "translateY(8px)";
    setTimeout(() => item.remove(), 220);
  }, timeout);
}

function showConfirm({ title, body, confirmLabel = "実行", danger = false }) {
  dialogTitle.textContent = title;
  dialogBody.innerHTML = body;
  dialogActions.innerHTML = `
    <button class="button secondary" value="cancel">キャンセル</button>
    <button class="button ${danger ? "danger" : "primary"}" value="confirm">${escapeHTML(confirmLabel)}</button>
  `;
  globalDialog.returnValue = "";
  globalDialog.showModal();
  return new Promise((resolve) => {
    globalDialog.addEventListener("close", () => resolve(globalDialog.returnValue === "confirm"), { once: true });
  });
}

function closeMobileMenu() {
  sidebar.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  sidebarBackdrop.hidden = true;
}

function applySettings(snapshot = store.snapshot()) {
  const { settings } = snapshot;
  document.documentElement.dataset.theme = settings.theme === "light" ? "light" : "dark";
  document.documentElement.style.setProperty("--font-scale", String(clamp(Number(settings.fontScale) || 1, 0.85, 1.3)));
  document.documentElement.toggleAttribute("data-reduce-motion", Boolean(settings.reduceMotion));
  themeToggle.textContent = settings.theme === "light" ? "☾" : "☀";
  themeToggle.title = settings.theme === "light" ? "ダーク配色へ" : "ライト配色へ";
}

function updateSidebarProgress(snapshot = store.snapshot()) {
  const progress = overallProgress(snapshot);
  document.querySelector("#sidebarProgressText").textContent = `${progress.count} / ${progress.total} lesson`;
  document.querySelector("#sidebarProgressPercent").textContent = `${progress.percent}%`;
  document.querySelector("#sidebarProgressBar").style.width = `${progress.percent}%`;
}

function setActiveNavigation(route) {
  const name = route?.name ?? "dashboard";
  mainNav.querySelectorAll("a[data-nav]").forEach((anchor) => {
    const active = anchor.dataset.nav === name;
    anchor.classList.toggle("active", active);
    if (active) anchor.setAttribute("aria-current", "page");
    else anchor.removeAttribute("aria-current");
  });
}

function setRuntimeState(state, text, detail = "") {
  runtimePill.dataset.state = state;
  runtimeStatus.textContent = text;
  runtimePill.title = detail ? `${text}\n${detail}` : text;
}

function initializeRuntime() {
  if (runtimeInitialized) return;
  runtimeInitialized = true;
  runtime.init();
}

runtime.addEventListener("status", (event) => {
  const { message, detail } = event.detail;
  const working = /初期化|確認|実行/.test(message);
  const stopped = /停止/.test(message);
  setRuntimeState(working ? "working" : stopped ? "error" : "ready", message, detail);
});

runtime.addEventListener("ready", (event) => {
  setRuntimeState("ready", `Python準備完了`, `Pyodide ${event.detail.pyodideVersion}`);
});

runtime.addEventListener("error", (event) => {
  setRuntimeState("error", "Python実行環境エラー", event.detail.message);
});

function pageHeader({ eyebrow, title, description, actions = "", breadcrumb = "" }) {
  return `
    <header class="page-header">
      ${breadcrumb ? `<div class="breadcrumb">${breadcrumb}</div>` : ""}
      <div class="page-header-row">
        <div>
          ${eyebrow ? `<div class="eyebrow">${escapeHTML(eyebrow)}</div>` : ""}
          <h1>${escapeHTML(title)}</h1>
          ${description ? `<p>${escapeHTML(description)}</p>` : ""}
        </div>
        ${actions ? `<div class="button-row">${actions}</div>` : ""}
      </div>
    </header>
  `;
}

function renderSessionCard(session, snapshot) {
  const lessons = sessionLessons(session.id);
  const completed = completedCountForSession(session.id, snapshot);
  const percent = Math.round((completed / Math.max(1, lessons.length)) * 100);
  return `
    <a class="card card-link session-card" href="#learn?session=${session.id}">
      <div class="session-card-header">
        <span class="session-number">${session.id}</span>
        <span class="badge ${completed === lessons.length ? "done" : "core"}">${completed}/${lessons.length} 完了</span>
      </div>
      <div>
        <h3>${escapeHTML(session.title)}</h3>
        <p>${escapeHTML(session.subtitle)}</p>
      </div>
      <div class="tag-list">${session.scope.slice(0, 6).map((tag) => `<span class="tag">${escapeHTML(tag)}</span>`).join("")}</div>
      <div>
        <div class="progress-row"><span>${lessons.length} lesson</span><strong>${percent}%</strong></div>
        <div class="progress-track"><span style="width:${percent}%"></span></div>
      </div>
    </a>
  `;
}

function renderDashboard() {
  const snapshot = store.snapshot();
  const progress = overallProgress(snapshot);
  const nextLesson = nextIncompleteLesson(snapshot);
  const practicePassed = Object.values(snapshot.practiceAttempts).filter((item) => item?.passed).length;
  const bestQuiz = snapshot.quizHistory.length
    ? Math.max(...snapshot.quizHistory.map((record) => Number(record.percent) || 0))
    : null;

  appView.innerHTML = `
    <figure class="brand-hero-banner" aria-label="LAVi-SPICA — Structured Python Interactive Course and Activities">
      <img src="./assets/lavi-spica-hero.png" alt="星空とSpicaをモチーフにしたLAVi-SPICAのイメージ画像" width="1672" height="941" fetchpriority="high">
    </figure>
    <section class="hero">
      <div class="hero-copy">
        <span class="hero-kicker">計算科学基礎 · ブラウザ完結型Python教材</span>
        <h1>変数から、データ解析と可視化まで。</h1>
        <p>教員と一緒に短いコードを入力し、予想・実行・比較・説明を繰り返します。基本文法だけで終わらず、NumPy、データ入出力、欠損値、Matplotlibまで一つの学習経路で扱います。</p>
        <div class="hero-actions">
          <a class="button primary" href="#learn/${escapeAttribute(nextLesson.id)}">${progress.count ? "続きから学ぶ" : "第1回から始める"} →</a>
          <a class="button secondary" href="#quiz">20分小テストを開く</a>
        </div>
      </div>
      <aside class="hero-panel" aria-label="学習状況">
        <div class="eyebrow">この端末の学習状況</div>
        <div class="metric-grid">
          <div class="metric"><strong>${progress.percent}%</strong><span>lesson進捗</span></div>
          <div class="metric"><strong>${practicePassed}</strong><span>合格した練習</span></div>
          <div class="metric"><strong>${snapshot.quizHistory.length}</strong><span>小テスト受験</span></div>
          <div class="metric"><strong>${bestQuiz == null ? "—" : `${bestQuiz}%`}</strong><span>小テスト最高点</span></div>
        </div>
        <div class="progress-track"><span style="width:${progress.percent}%"></span></div>
        <small class="help-text">進捗、下書き、小テスト履歴はこのブラウザのlocalStorageに保存されます。</small>
      </aside>
    </section>

    <section class="section">
      <div class="section-heading">
        <div><h2>7回でつなぐ学習経路</h2><p>各回は原則として「前回範囲の小テスト20分＋解説・一斉入力＋練習＋事後学習」で構成します。</p></div>
        <a class="button ghost small" href="#learn">全lessonを見る</a>
      </div>
      <div class="card-grid">${COURSE_CONTENT.sessions.map((session) => renderSessionCard(session, snapshot)).join("")}</div>
    </section>

    <section class="section">
      <div class="section-heading"><div><h2>授業で守る6つの原則</h2><p>文法暗記より、コードと結果の対応、比較、再現性、説明可能性を優先します。</p></div></div>
      <div class="card-grid">
        ${COURSE_CONTENT.classroomPrinciples.map((principle, index) => `
          <article class="card"><div class="card-body"><span class="session-number">${index + 1}</span><h3>${escapeHTML(principle)}</h3></div></article>
        `).join("")}
      </div>
    </section>

    <section class="section">
      <div class="info-strip">
        <span aria-hidden="true">ⓘ</span>
        <div><strong>Pythonは端末へインストール不要です。</strong><br>初回実行時だけPyodide本体や必要なパッケージをネットワークから読み込みます。コードはWeb Worker内で実行し、<code>input()</code>、任意の端末ファイル、ネットワーク資格情報にはアクセスしません。</div>
      </div>
    </section>
  `;
}

function lessonRow(lesson, snapshot) {
  const done = snapshot.completedLessons.includes(lesson.id);
  return `
    <a class="lesson-row" href="#learn/${escapeAttribute(lesson.id)}">
      <span class="lesson-index">${String(lessonNumber(lesson)).padStart(2, "0")}</span>
      <span>
        <h3>${escapeHTML(lesson.title)}</h3>
        <p>${escapeHTML(lesson.subtitle)}</p>
        <span class="lesson-meta"><span>${lesson.minutes}分目安</span>${trackBadge(lesson)}<span>${lesson.practices.length}練習</span></span>
      </span>
      <span class="badge ${done ? "done" : "warning"}">${done ? "完了" : "未完了"}</span>
    </a>
  `;
}

function renderLearnIndex(route) {
  const snapshot = store.snapshot();
  const selectedSession = Number(route.params.get("session")) || null;
  const sessions = selectedSession ? COURSE_CONTENT.sessions.filter((session) => Number(session.id) === selectedSession) : COURSE_CONTENT.sessions;
  const progress = overallProgress(snapshot);

  appView.innerHTML = `
    ${pageHeader({
      eyebrow: "COURSE",
      title: "学習コース",
      description: `全${LESSONS.length} lesson。変数・出力から始め、データ構造、反復、分岐、関数を経て、アップロード済み講義資料のオブジェクト、NumPy、データ解析、可視化へ進みます。`,
      actions: `<a class="button primary" href="#learn/${escapeAttribute(nextIncompleteLesson(snapshot).id)}">次のlessonへ</a>`,
    })}
    <div class="info-strip success"><span aria-hidden="true">✓</span><div><strong>${progress.count}/${progress.total} lesson完了（${progress.percent}%）</strong><br>lesson内の完了ボタンは理解確認の自己記録です。コード下書きや予想も端末内へ自動保存されます。</div></div>
    ${sessions.map((session) => {
      const lessons = sessionLessons(session.id);
      const completed = completedCountForSession(session.id, snapshot);
      return `
        <section class="section" id="session-${session.id}">
          <div class="section-heading">
            <div><div class="eyebrow">SESSION ${session.id}</div><h2>${escapeHTML(session.title)}</h2><p>${escapeHTML(session.subtitle)} · ${completed}/${lessons.length}完了</p></div>
            ${selectedSession ? '<a class="button ghost small" href="#learn">全回を表示</a>' : `<a class="button ghost small" href="#quiz?scope=${session.id}">この範囲で小テスト</a>`}
          </div>
          <div class="lesson-list">${lessons.map((lesson) => lessonRow(lesson, snapshot)).join("")}</div>
        </section>
      `;
    }).join("")}
  `;
}

function registerEditor(editorId, code, title, context = {}) {
  editorContexts.set(editorId, { editorId, defaultCode: code, ...context });
  return `
    <section class="editor-shell" data-editor-shell="${escapeAttribute(editorId)}" aria-label="${escapeAttribute(title)}">
      <header class="editor-header">
        <span class="editor-title">${escapeHTML(title)}</span>
        <span class="editor-shortcut">Ctrl / ⌘ + Enter で実行</span>
        <button class="button ghost small" type="button" data-action="copy-code" data-editor="${escapeAttribute(editorId)}">コピー</button>
        <button class="button ghost small" type="button" data-action="reset-code" data-editor="${escapeAttribute(editorId)}">初期化</button>
        <button class="button danger small" type="button" data-action="stop-code" data-editor="${escapeAttribute(editorId)}" disabled>停止</button>
        <button class="button primary small" type="button" data-action="run-code" data-editor="${escapeAttribute(editorId)}">▶ 実行</button>
      </header>
      <textarea class="code-editor" id="${escapeAttribute(editorId)}" data-editor="${escapeAttribute(editorId)}" spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="Pythonコードエディタ">${escapeHTML(code)}</textarea>
      <footer class="editor-footer">
        <div class="output-tabs" role="tablist" aria-label="実行結果">
          <button class="output-tab active" type="button" role="tab" aria-selected="true" data-action="output-tab" data-editor="${escapeAttribute(editorId)}" data-tab="console">コンソール</button>
          <button class="output-tab" type="button" role="tab" aria-selected="false" data-action="output-tab" data-editor="${escapeAttribute(editorId)}" data-tab="variables">変数</button>
          <button class="output-tab" type="button" role="tab" aria-selected="false" data-action="output-tab" data-editor="${escapeAttribute(editorId)}" data-tab="figures">図</button>
          <button class="output-tab" type="button" role="tab" aria-selected="false" data-action="output-tab" data-editor="${escapeAttribute(editorId)}" data-tab="files">生成ファイル</button>
        </div>
        <div class="output-panel" data-output="console"><p class="output-empty">ここに標準出力・エラー・練習問題の判定が表示されます。</p></div>
        <div class="output-panel hidden" data-output="variables"><p class="output-empty">実行後、主要な変数を表示します。</p></div>
        <div class="output-panel hidden" data-output="figures"><p class="output-empty">Matplotlibの図がある場合に表示します。</p></div>
        <div class="output-panel hidden" data-output="files"><p class="output-empty">コードが作成した小さなファイルをダウンロードできます。</p></div>
      </footer>
    </section>
  `;
}

function renderLessonDetail(lesson) {
  const snapshot = store.snapshot();
  const done = snapshot.completedLessons.includes(lesson.id);
  const session = SESSION_BY_ID.get(Number(lesson.session));
  const index = LESSONS.findIndex((item) => item.id === lesson.id);
  const previous = LESSONS[index - 1] ?? null;
  const next = LESSONS[index + 1] ?? null;
  const editorId = `lesson-editor-${lesson.id}`;
  const draft = snapshot.lessonDrafts[lesson.id] ?? lesson.starterCode;
  const prediction = snapshot.lessonPredictions[lesson.id] ?? "";
  const note = snapshot.lessonNotes[lesson.id] ?? "";
  const exit = snapshot.exitTickets[String(lesson.session)]?.text ?? "";

  appView.innerHTML = `
    ${pageHeader({
      eyebrow: `SESSION ${lesson.session} · LESSON ${String(lessonNumber(lesson)).padStart(2, "0")}`,
      title: lesson.title,
      description: lesson.subtitle,
      breadcrumb: `<a href="#learn">学習コース</a><span>›</span><a href="#learn?session=${lesson.session}">${escapeHTML(session.title)}</a><span>›</span><span>${escapeHTML(lesson.title)}</span>`,
      actions: `<button class="button ${done ? "success" : "primary"}" type="button" data-action="toggle-lesson" data-lesson="${escapeAttribute(lesson.id)}">${done ? "✓ 完了済み" : "lessonを完了にする"}</button>`,
    })}

    <div class="lesson-layout">
      <article class="lesson-content">
        <div class="tag-list">${trackBadge(lesson)}<span class="tag">${lesson.minutes}分目安</span>${lesson.keywords.map((keyword) => `<span class="tag">${escapeHTML(keyword)}</span>`).join("")}</div>

        <section class="section">
          <div class="card"><div class="card-body">
            <div class="eyebrow">到達目標</div>
            <ul class="objective-list">${lesson.objectives.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>
          </div></div>
        </section>

        <section class="section">
          <div class="section-heading"><div><h2>1. 解説</h2><p>見出しを開き、コードと説明を対応させます。</p></div></div>
          ${lesson.concepts.map((concept, conceptIndex) => `
            <details class="card concept-card" ${conceptIndex === 0 ? "open" : ""}>
              <summary>${escapeHTML(concept.title)}</summary>
              <div class="concept-content"><p>${escapeHTML(concept.body)}</p>${concept.code ? codeBlock(concept.code) : ""}</div>
            </details>
          `).join("")}
        </section>

        <section class="section">
          <div class="section-heading"><div><h2>2. 教員と一緒に入力</h2><p>まず予想し、コードをエディタへ読み込んでから一行ずつ確認します。</p></div></div>
          ${lesson.liveCoding.map((step, stepIndex) => `
            <article class="live-step">
              <h3>${stepIndex + 1}. ${escapeHTML(step.title)}</h3>
              <p>${escapeHTML(step.instruction)}</p>
              <div class="predict-callout"><strong>実行前の予想：</strong> ${escapeHTML(step.predict)}</div>
              ${codeBlock(step.code)}
              <button class="button secondary small" type="button" data-action="load-live-code" data-lesson="${escapeAttribute(lesson.id)}" data-index="${stepIndex}" data-editor="${escapeAttribute(editorId)}">このコードを右のエディタへ</button>
            </article>
          `).join("")}
        </section>

        <section class="section">
          <div class="section-heading"><div><h2>3. 実行前の予想</h2><p>${escapeHTML(lesson.predictPrompt)}</p></div></div>
          <textarea class="textarea" data-save="prediction" data-lesson="${escapeAttribute(lesson.id)}" placeholder="実行する前に、自分の予想と理由を書きます。">${escapeHTML(prediction)}</textarea>
        </section>

        <section class="section">
          <div class="section-heading"><div><h2>4. 練習問題</h2><p>問題を選ぶと、右のエディタへ開始コードが読み込まれます。実行後に自動判定します。</p></div></div>
          <div class="lesson-list">
            ${lesson.practices.map((practice) => {
              const attempt = snapshot.practiceAttempts[practice.id];
              return `
                <article class="card"><div class="card-body">
                  <div class="lesson-meta"><span class="badge ${attempt?.passed ? "done" : "warning"}">${attempt?.passed ? "合格済み" : practice.difficulty}</span><span>${attempt?.attempts ?? 0}回実行</span></div>
                  <h3>${escapeHTML(practice.title)}</h3>
                  <p>${escapeHTML(practice.prompt)}</p>
                  <div class="button-row" style="margin-top:12px">
                    <button class="button primary small" type="button" data-action="load-practice" data-practice="${escapeAttribute(practice.id)}" data-editor="${escapeAttribute(editorId)}">開始コードを開く</button>
                    <button class="button ghost small" type="button" data-action="show-hints" data-practice="${escapeAttribute(practice.id)}">ヒント</button>
                    <button class="button ghost small" type="button" data-action="show-solution" data-practice="${escapeAttribute(practice.id)}">解答例</button>
                  </div>
                  <div data-practice-feedback="${escapeAttribute(practice.id)}"></div>
                </div></article>
              `;
            }).join("")}
          </div>
        </section>

        <section class="section">
          <div class="section-heading"><div><h2>5. 事後学習</h2><p>文章で説明する問題です。解答例は自分の回答後に開いて比較します。</p></div></div>
          ${lesson.afterClass.map((item, itemIndex) => `
            <details class="card concept-card">
              <summary>問${itemIndex + 1}. ${escapeHTML(item.question)}</summary>
              <div class="concept-content"><p><strong>解答例：</strong>${escapeHTML(item.model)}</p></div>
            </details>
          `).join("")}
          <label class="form-field" style="margin-top:12px"><span>自分の説明・疑問メモ</span><textarea class="textarea" data-save="lesson-note" data-lesson="${escapeAttribute(lesson.id)}">${escapeHTML(note)}</textarea></label>
        </section>

        <section class="section">
          <div class="section-heading"><div><h2>よくあるエラー</h2><p>エラー名を怖がらず、「症状 → 原因候補 → 確認箇所」の順で読みます。</p></div></div>
          <div class="table-wrap"><table class="data-table"><thead><tr><th>症状</th><th>主な原因</th><th>確認・修正</th></tr></thead><tbody>
            ${lesson.commonErrors.map((item) => `<tr><td><code>${escapeHTML(item.symptom)}</code></td><td>${escapeHTML(item.cause)}</td><td>${escapeHTML(item.fix)}</td></tr>`).join("")}
          </tbody></table></div>
        </section>

        <section class="section">
          <div class="card"><div class="card-body">
            <div class="eyebrow">EXIT TICKET · 第${lesson.session}回</div>
            <p>今日、自分で変更した値またはコードと、その結果を一文で記録してください。</p>
            <textarea class="textarea" data-save="exit" data-session="${lesson.session}" placeholder="例：rangeの刻み幅を10から5へ変えると、出力行数が増えた。">${escapeHTML(exit)}</textarea>
          </div></div>
        </section>

        <nav class="section button-row" aria-label="lesson間の移動">
          ${previous ? `<a class="button secondary" href="#learn/${escapeAttribute(previous.id)}">← ${escapeHTML(previous.title)}</a>` : ""}
          <span style="flex:1"></span>
          ${next ? `<a class="button primary" href="#learn/${escapeAttribute(next.id)}">${escapeHTML(next.title)} →</a>` : `<a class="button primary" href="#quiz?scope=${lesson.session}">この範囲の小テストへ →</a>`}
        </nav>
      </article>

      <aside class="workspace-column">
        ${registerEditor(editorId, draft, "Python実習エディタ", { kind: "lesson", lessonId: lesson.id, filename: `${lesson.id}.py` })}
        <div class="info-strip warning" style="margin-top:12px"><span aria-hidden="true">!</span><div><strong>開始コードに未完成部分がある場合があります。</strong><br>エラーが出たら、最後の行だけでなく、最初に示されたエラー名と行番号を読みます。</div></div>
        <div class="card" style="margin-top:12px"><div class="card-body"><div class="eyebrow">資料との対応</div><div class="tag-list" style="margin-top:8px">${lesson.sourceRefs.map((ref) => `<span class="tag">${escapeHTML(ref)}</span>`).join("")}</div></div></div>
      </aside>
    </div>
  `;
}

function renderLearn(route) {
  const lessonId = route.segments[1];
  if (!lessonId) {
    renderLearnIndex(route);
    return;
  }
  const lesson = LESSON_BY_ID.get(lessonId);
  if (!lesson) {
    appView.innerHTML = `<div class="empty-state"><h2>lessonが見つかりません</h2><a class="button primary" href="#learn">学習コースへ戻る</a></div>`;
    return;
  }
  renderLessonDetail(lesson);
}

function filteredPractices() {
  const query = canonicalAnswer(practiceFilters.query);
  return PRACTICES.filter((practice) => {
    if (practiceFilters.session !== "all" && String(practice.lesson.session) !== practiceFilters.session) return false;
    if (practiceFilters.difficulty !== "all" && practice.difficulty !== practiceFilters.difficulty) return false;
    if (query) {
      const haystack = canonicalAnswer(`${practice.title} ${practice.prompt} ${practice.lesson.title} ${practice.lesson.keywords.join(" ")}`);
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

function renderPractice(route) {
  const requested = route.params.get("item");
  if (requested && PRACTICE_BY_ID.has(requested)) currentPracticeId = requested;
  const items = filteredPractices();
  if (!items.some((item) => item.id === currentPracticeId)) currentPracticeId = items[0]?.id ?? null;
  const practice = currentPracticeId ? PRACTICE_BY_ID.get(currentPracticeId) : null;
  const snapshot = store.snapshot();
  const editorId = "practice-editor";

  appView.innerHTML = `
    ${pageHeader({
      eyebrow: "PRACTICE",
      title: "練習問題",
      description: `全${PRACTICES.length}問から選び、コードを実行して自動判定します。合格判定は出力と必要な構文の最低条件を確認するもので、唯一の書き方を強制しません。`,
    })}
    <div class="filter-bar">
      <label class="form-field"><span>回</span><select class="select" id="practiceSessionFilter"><option value="all">すべて</option>${COURSE_CONTENT.sessions.map((session) => `<option value="${session.id}" ${practiceFilters.session === String(session.id) ? "selected" : ""}>第${session.id}回 ${escapeHTML(session.title)}</option>`).join("")}</select></label>
      <label class="form-field"><span>難度</span><select class="select" id="practiceDifficultyFilter"><option value="all">すべて</option>${["基礎", "標準", "発展"].map((value) => `<option value="${value}" ${practiceFilters.difficulty === value ? "selected" : ""}>${value}</option>`).join("")}</select></label>
      <label class="form-field"><span>検索</span><input class="input" id="practiceQuery" value="${escapeAttribute(practiceFilters.query)}" placeholder="例：range、欠損値"></label>
      <span class="help-text">${items.length}問表示</span>
    </div>

    ${practice ? `
      <div class="practice-grid section">
        <nav class="practice-nav" aria-label="練習問題一覧">
          ${items.map((item) => {
            const attempt = snapshot.practiceAttempts[item.id];
            return `<button type="button" class="${item.id === practice.id ? "active" : ""}" data-action="select-practice" data-practice="${escapeAttribute(item.id)}"><strong>${escapeHTML(item.title)}</strong><br><small>第${item.lesson.session}回 · ${escapeHTML(item.difficulty)} ${attempt?.passed ? "· ✓合格" : ""}</small></button>`;
          }).join("")}
        </nav>
        <section>
          <div class="card"><div class="card-body">
            <div class="lesson-meta"><span class="badge core">第${practice.lesson.session}回</span><span class="badge ${snapshot.practiceAttempts[practice.id]?.passed ? "done" : "warning"}">${snapshot.practiceAttempts[practice.id]?.passed ? "合格済み" : escapeHTML(practice.difficulty)}</span><span>${snapshot.practiceAttempts[practice.id]?.attempts ?? 0}回実行</span></div>
            <h2>${escapeHTML(practice.title)}</h2>
            <p>${escapeHTML(practice.prompt)}</p>
            <div class="button-row" style="margin-top:12px"><button class="button ghost small" type="button" data-action="show-hints" data-practice="${escapeAttribute(practice.id)}">ヒント</button><button class="button ghost small" type="button" data-action="show-solution" data-practice="${escapeAttribute(practice.id)}">解答例</button><a class="button ghost small" href="#learn/${escapeAttribute(practice.lesson.id)}">対応lesson</a></div>
            <div data-practice-feedback="${escapeAttribute(practice.id)}"></div>
          </div></div>
          <div style="margin-top:14px">${registerEditor(editorId, practice.starterCode, `${practice.id} · ${practice.title}`, { kind: "practice", practiceId: practice.id, lessonId: practice.lesson.id, filename: `${practice.id}.py` })}</div>
        </section>
      </div>
    ` : `<div class="empty-state"><h2>条件に一致する練習問題がありません</h2><button class="button primary" type="button" data-action="reset-practice-filter">絞り込みを解除</button></div>`}
  `;
}

function normalizeQuizScope(scope) {
  const value = String(scope ?? "1");
  if (value === "all" || value === "diagnostic") return value;
  return SESSION_BY_ID.has(Number(value)) ? value : "1";
}

function quizPool(scope) {
  const normalized = normalizeQuizScope(scope);
  if (normalized === "all") return [...QUESTIONS];
  if (normalized === "diagnostic") return QUESTIONS.filter((question) => question.difficulty === "基礎");
  const session = Number(normalized);
  return QUESTIONS.filter((question) => Number(question.session) === session);
}

function syncQuizCountLimit(form) {
  if (!form) return;
  const scopeControl = form.elements?.scope;
  const countControl = form.elements?.count;
  if (!scopeControl || !countControl) return;
  const maxCount = Math.max(3, Math.min(30, quizPool(scopeControl.value).length));
  countControl.max = String(maxCount);
  countControl.value = String(clamp(Number(countControl.value) || 10, 3, maxCount));
}

function quizScopeName(scope) {
  if (scope === "all") return "全範囲";
  if (scope === "diagnostic") return "初回診断（全範囲から基礎確認）";
  const session = SESSION_BY_ID.get(Number(scope));
  return session ? `第${session.id}回範囲：${session.title}` : `第${scope}回範囲`;
}

function createQuiz({ scope, minutes, count, seed, profile }) {
  const normalizedScope = normalizeQuizScope(scope);
  const pool = quizPool(normalizedScope);
  const random = seededRandom(seed);
  const selected = shuffled(pool, random).slice(0, Math.min(count, pool.length));
  const startedAt = new Date();
  return {
    format: "lavi-spica-active-quiz-v1",
    quizId: uniqueId("quiz"),
    appVersion: APP_VERSION,
    scope: normalizedScope,
    minutes,
    count: selected.length,
    seed,
    profile,
    questionIds: selected.map((question) => question.id),
    answers: {},
    startedAt: startedAt.toISOString(),
    deadline: new Date(startedAt.getTime() + minutes * 60_000).toISOString(),
  };
}

function renderQuizSetup(route) {
  const snapshot = store.snapshot();
  const scope = normalizeQuizScope(route.params.get("scope") || "1");
  const minutes = clamp(Number(route.params.get("minutes")) || QUIZ_DATA.meta.defaultMinutes, 5, 60);
  const maxCount = Math.max(3, Math.min(30, quizPool(scope).length));
  const count = clamp(Number(route.params.get("count")) || QUIZ_DATA.meta.defaultCount, 3, maxCount);
  const seed = route.params.get("seed") || `${new Date().toISOString().slice(0, 10)}-s${scope}`;

  appView.innerHTML = `
    ${pageHeader({ eyebrow: "QUIZ", title: "20分小テスト", description: "原則として次回講義の冒頭20分に、前回範囲から出題します。回答はこの端末へ自動保存され、時間切れ時は自動提出されます。" })}
    <div class="info-strip warning"><span aria-hidden="true">!</span><div><strong>理解確認用の小テストです。</strong><br>${escapeHTML(QUIZ_DATA.meta.securityNote)}</div></div>
    <section class="section card"><div class="card-body">
      <form id="quizSetupForm" class="form-grid">
        <label class="form-field"><span>学籍番号</span><input class="input" name="studentId" value="${escapeAttribute(snapshot.profile.studentId)}" autocomplete="off"></label>
        <label class="form-field"><span>氏名</span><input class="input" name="name" value="${escapeAttribute(snapshot.profile.name)}" autocomplete="name"></label>
        <label class="form-field"><span>出題範囲</span><select class="select" name="scope">
          <option value="diagnostic" ${scope === "diagnostic" ? "selected" : ""}>初回診断（全範囲の基礎問題）</option>
          ${COURSE_CONTENT.sessions.map((session) => `<option value="${session.id}" ${scope === String(session.id) ? "selected" : ""}>第${session.id}回：${escapeHTML(session.title)}</option>`).join("")}
          <option value="all" ${scope === "all" ? "selected" : ""}>全範囲</option>
        </select></label>
        <label class="form-field"><span>制限時間 [分]</span><input class="input" name="minutes" type="number" min="5" max="60" value="${minutes}"></label>
        <label class="form-field"><span>問題数</span><input class="input" name="count" type="number" min="3" max="${maxCount}" value="${count}"></label>
        <label class="form-field"><span>問題順Seed</span><input class="input" name="seed" value="${escapeAttribute(seed)}"><small class="help-text">同じ範囲・Seed・問題数なら同じ問題順になります。</small></label>
        <div class="form-field full"><div class="button-row"><button class="button primary" type="submit">小テストを開始</button><a class="button secondary" href="#teacher">教員用リンク生成へ</a></div></div>
      </form>
    </div></section>
    <section class="section">
      <div class="section-heading"><div><h2>直近の結果</h2><p>このブラウザに保存された受験履歴です。</p></div></div>
      ${snapshot.quizHistory.length ? quizHistoryTable(snapshot.quizHistory.slice(-8).reverse()) : '<div class="empty-state"><p>まだ受験履歴がありません。</p></div>'}
    </section>
  `;
}

function renderQuestionInput(question, answer, index) {
  const inputName = `question-${question.id}`;
  if (question.type === "single") {
    return `<div class="choice-list">${question.options.map((option, optionIndex) => `
      <label class="choice"><input type="radio" name="${escapeAttribute(inputName)}" value="${optionIndex}" data-quiz-question="${escapeAttribute(question.id)}" ${Number(answer) === optionIndex ? "checked" : ""}><span>${escapeHTML(option)}</span></label>
    `).join("")}</div>`;
  }
  if (question.type === "multi") {
    const selected = Array.isArray(answer) ? answer.map(Number) : [];
    return `<div class="choice-list">${question.options.map((option, optionIndex) => `
      <label class="choice"><input type="checkbox" name="${escapeAttribute(inputName)}" value="${optionIndex}" data-quiz-question="${escapeAttribute(question.id)}" ${selected.includes(optionIndex) ? "checked" : ""}><span>${escapeHTML(option)}</span></label>
    `).join("")}</div><p class="help-text">該当するものをすべて選択してください。</p>`;
  }
  return `<label class="form-field"><span class="sr-only">問${index + 1}の回答</span><input class="input" data-quiz-question="${escapeAttribute(question.id)}" value="${escapeAttribute(answer ?? "")}" placeholder="出力または短い回答を入力" autocomplete="off"></label>`;
}

function renderActiveQuiz(active) {
  const questions = active.questionIds.map((id) => QUESTION_BY_ID.get(id)).filter(Boolean);
  const answered = questions.filter((question) => {
    const value = active.answers?.[question.id];
    return Array.isArray(value) ? value.length > 0 : value !== undefined && String(value).trim() !== "";
  }).length;

  appView.innerHTML = `
    <section class="quiz-shell">
      <div class="quiz-topbar">
        <div><strong>${escapeHTML(quizScopeName(active.scope))}</strong><div class="quiz-progress"><span id="quizAnsweredCount">${answered}</span> / ${questions.length}問回答 · 回答は自動保存</div></div>
        <div class="quiz-timer" id="quizTimer">${formatDuration(Math.max(0, (new Date(active.deadline).getTime() - Date.now()) / 1000))}</div>
      </div>
      <div class="info-strip"><span aria-hidden="true">ⓘ</span><div>コード問題は、頭の中または紙で追跡します。ブラウザの戻る操作をしても受験状態はsessionStorageへ残ります。</div></div>
      ${questions.map((question, index) => `
        <article class="question-card" id="question-${escapeAttribute(question.id)}">
          <div class="question-number">QUESTION ${index + 1} / ${questions.length} · ${escapeHTML(question.difficulty)} · ${question.points}点</div>
          <h3>${escapeHTML(question.prompt)}</h3>
          ${question.code ? codeBlock(question.code) : ""}
          ${renderQuestionInput(question, active.answers?.[question.id], index)}
        </article>
      `).join("")}
      <div class="button-row" style="justify-content:flex-end">
        <button class="button danger" type="button" data-action="abandon-quiz">受験を破棄</button>
        <button class="button primary" type="button" data-action="submit-quiz">回答を提出</button>
      </div>
    </section>
  `;
  startQuizTimer(active);
}

function answerIsCorrect(question, answer) {
  if (question.type === "single") return Number(answer) === Number(question.answer);
  if (question.type === "multi") {
    const selected = Array.isArray(answer) ? [...new Set(answer.map(Number))].sort((a, b) => a - b) : [];
    const correct = [...question.answer].map(Number).sort((a, b) => a - b);
    return JSON.stringify(selected) === JSON.stringify(correct);
  }
  const normalized = canonicalAnswer(answer ?? "");
  return (question.accepted || []).some((accepted) => canonicalAnswer(accepted) === normalized);
}

function submitQuiz({ automatic = false } = {}) {
  const active = store.getActiveQuiz();
  if (!active) return;
  clearInterval(quizTimer);
  quizTimer = null;
  const questions = active.questionIds.map((id) => QUESTION_BY_ID.get(id)).filter(Boolean);
  const details = questions.map((question) => {
    const answer = active.answers?.[question.id];
    const correct = answerIsCorrect(question, answer);
    return {
      questionId: question.id,
      answer: answer ?? null,
      correct,
      pointsEarned: correct ? question.points : 0,
      maxPoints: question.points,
      session: question.session,
      tags: question.tags,
    };
  });
  const score = details.reduce((sum, item) => sum + item.pointsEarned, 0);
  const maxScore = details.reduce((sum, item) => sum + item.maxPoints, 0);
  const submittedAt = new Date();
  const durationSeconds = Math.max(0, Math.round((submittedAt.getTime() - new Date(active.startedAt).getTime()) / 1000));
  const record = {
    format: "lavi-spica-quiz-result-v1",
    appVersion: APP_VERSION,
    quizId: active.quizId,
    profile: active.profile,
    scope: active.scope,
    scopeName: quizScopeName(active.scope),
    minutes: active.minutes,
    count: questions.length,
    seed: active.seed,
    startedAt: active.startedAt,
    submittedAt: submittedAt.toISOString(),
    durationSeconds,
    automatic,
    score,
    maxScore,
    percent: Math.round((score / Math.max(1, maxScore)) * 100),
    details,
  };
  store.addQuizRecord(record);
  store.setActiveQuiz(null);
  recentQuizResult = record;
  renderQuizResult(record);
  window.scrollTo({ top: 0, behavior: "smooth" });
  toast(automatic ? "時間切れで提出しました" : "小テストを提出しました", `${score}/${maxScore}点`, score / Math.max(1, maxScore) >= 0.7 ? "success" : "info");
}

function answerDisplay(question, answer) {
  if (question.type === "single") return answer == null || answer === "" ? "未回答" : question.options?.[Number(answer)] ?? String(answer);
  if (question.type === "multi") return Array.isArray(answer) && answer.length ? answer.map((index) => question.options?.[Number(index)] ?? index).join(" / ") : "未回答";
  return answer == null || String(answer).trim() === "" ? "未回答" : String(answer);
}

function correctAnswerDisplay(question) {
  if (question.type === "single") return question.options?.[question.answer] ?? String(question.answer);
  if (question.type === "multi") return question.answer.map((index) => question.options?.[index] ?? index).join(" / ");
  return question.answerDisplay || (question.accepted || []).join(" / ");
}

function renderQuizResult(record) {
  const angle = Math.round((record.percent / 100) * 360);
  appView.innerHTML = `
    ${pageHeader({ eyebrow: "QUIZ RESULT", title: "小テスト結果", description: `${escapeHTML(record.scopeName)} · ${formatDateTime(record.submittedAt)}` })}
    <section class="score-hero">
      <div class="score-circle" style="--score-angle:${angle}deg"><strong>${record.percent}%</strong></div>
      <h2>${record.score} / ${record.maxScore}点</h2>
      <p>${record.automatic ? "制限時間終了により自動提出されました。" : `解答時間 ${formatDuration(record.durationSeconds)}`}</p>
      <div class="button-row"><button class="button primary" type="button" data-action="download-quiz-json">結果JSON</button><button class="button secondary" type="button" data-action="download-quiz-csv">結果CSV</button><button class="button ghost" type="button" data-action="new-quiz">別の小テスト</button></div>
    </section>
    <section class="section">
      <div class="section-heading"><div><h2>問題ごとの確認</h2><p>正誤だけでなく、誤答の原因と説明を確認します。</p></div></div>
      <div class="quiz-shell">
        ${record.details.map((detail, index) => {
          const question = QUESTION_BY_ID.get(detail.questionId);
          if (!question) return "";
          return `
            <article class="question-card">
              <div class="question-number">QUESTION ${index + 1} · ${detail.correct ? "正解" : "不正解"}</div>
              <h3>${escapeHTML(question.prompt)}</h3>
              ${question.code ? codeBlock(question.code) : ""}
              <p><strong>あなたの回答：</strong>${escapeHTML(answerDisplay(question, detail.answer))}</p>
              <p><strong>正答：</strong>${escapeHTML(correctAnswerDisplay(question))}</p>
              <div class="quiz-explanation">${escapeHTML(question.explanation)}</div>
            </article>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function startQuizTimer(active) {
  clearInterval(quizTimer);
  const update = () => {
    const remaining = Math.max(0, Math.ceil((new Date(active.deadline).getTime() - Date.now()) / 1000));
    const timerElement = document.querySelector("#quizTimer");
    if (timerElement) {
      timerElement.textContent = formatDuration(remaining);
      timerElement.classList.toggle("urgent", remaining <= 120);
    }
    if (remaining <= 0) submitQuiz({ automatic: true });
  };
  update();
  quizTimer = setInterval(update, 1000);
}

function renderQuiz(route) {
  clearInterval(quizTimer);
  quizTimer = null;
  const active = store.getActiveQuiz();
  if (active) {
    if (new Date(active.deadline).getTime() <= Date.now()) {
      submitQuiz({ automatic: true });
      return;
    }
    renderActiveQuiz(active);
    return;
  }
  if (recentQuizResult && route.params.get("result") === recentQuizResult.quizId) {
    renderQuizResult(recentQuizResult);
    return;
  }
  renderQuizSetup(route);
}

function quizHistoryTable(records) {
  return `<div class="table-wrap"><table class="data-table"><thead><tr><th>日時</th><th>範囲</th><th>得点</th><th>時間</th><th>Seed</th></tr></thead><tbody>${records.map((record) => `<tr><td>${escapeHTML(formatDateTime(record.submittedAt))}</td><td>${escapeHTML(record.scopeName || quizScopeName(record.scope))}</td><td><strong>${record.score}/${record.maxScore} (${record.percent}%)</strong></td><td>${escapeHTML(formatDuration(record.durationSeconds || 0))}</td><td><code>${escapeHTML(record.seed || "—")}</code></td></tr>`).join("")}</tbody></table></div>`;
}

function buildQuizLink({ scope, minutes, count, seed }) {
  const url = new URL(location.href);
  const params = new URLSearchParams({ scope, minutes: String(minutes), count: String(count), seed });
  url.hash = `quiz?${params.toString()}`;
  return url.toString();
}

function validQuizResult(value) {
  return value && value.format === "lavi-spica-quiz-result-v1" && Array.isArray(value.details) && Number.isFinite(Number(value.percent));
}

function combinedTeacherResults() {
  const local = store.snapshot().quizHistory;
  const byId = new Map();
  [...local, ...importedQuizResults].forEach((record) => {
    if (validQuizResult(record)) byId.set(record.quizId || uniqueId("import"), record);
  });
  return [...byId.values()].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
}

function teacherResultsTable(records) {
  if (!records.length) return '<div class="empty-state"><p>結果JSONを読み込むと、ここへ集計されます。この端末の受験履歴も自動的に含めます。</p></div>';
  return `<div class="table-wrap"><table class="data-table"><thead><tr><th>学籍番号</th><th>氏名</th><th>範囲</th><th>得点</th><th>提出</th><th>自動提出</th></tr></thead><tbody>${records.map((record) => `<tr><td>${escapeHTML(record.profile?.studentId || "—")}</td><td>${escapeHTML(record.profile?.name || "—")}</td><td>${escapeHTML(record.scopeName || quizScopeName(record.scope))}</td><td><strong>${record.score}/${record.maxScore} (${record.percent}%)</strong></td><td>${escapeHTML(formatDateTime(record.submittedAt))}</td><td>${record.automatic ? "はい" : "いいえ"}</td></tr>`).join("")}</tbody></table></div>`;
}

function renderTeacher() {
  const records = combinedTeacherResults();
  const average = records.length ? (records.reduce((sum, record) => sum + Number(record.percent || 0), 0) / records.length).toFixed(1) : "—";
  const seed = `${new Date().toISOString().slice(0, 10)}-session-1`;
  const initialLink = buildQuizLink({ scope: "1", minutes: 20, count: 10, seed });

  appView.innerHTML = `
    ${pageHeader({ eyebrow: "INSTRUCTOR", title: "教員モード", description: "100分授業の進行、次回20分小テストの配布URL生成、学生が書き出した結果JSONの集計を一画面で行います。サーバーへの自動送信は行いません。", actions: '<button class="button secondary" type="button" data-action="print-page">印刷</button>' })}
    <div class="info-strip"><span aria-hidden="true">ⓘ</span><div><strong>小テスト配布の標準運用</strong><br>講義終了時に次回用URLをLMSへ掲載し、次回冒頭で一斉開始します。提出後、学生は結果JSONをLMSへ提出できます。</div></div>

    <section class="section">
      <div class="section-heading"><div><h2>7回分の授業設計</h2><p>第1回は診断テスト、第2回以降は前回範囲の確認です。</p></div></div>
      ${COURSE_CONTENT.sessions.map((session) => `
        <details class="card concept-card" ${session.id === 1 ? "open" : ""}>
          <summary>第${session.id}回 ${escapeHTML(session.title)}</summary>
          <div class="concept-content">
            <p>${escapeHTML(session.subtitle)}</p>
            <ul class="clean-list">${session.goals.map((goal) => `<li>${escapeHTML(goal)}</li>`).join("")}</ul>
            <div class="timeline">${session.plan.map(([start, end, activity]) => `<div class="timeline-row"><span class="timeline-time">${start}–${end}分</span><span>${escapeHTML(activity)}</span></div>`).join("")}</div>
          </div>
        </details>
      `).join("")}
    </section>

    <section class="section card"><div class="card-body">
      <div class="section-heading"><div><h2>次回小テストURLを生成</h2><p>範囲、時間、問題数、SeedをURLへ埋め込みます。</p></div></div>
      <form id="teacherQuizLinkForm" class="form-grid">
        <label class="form-field"><span>出題範囲</span><select class="select" name="scope">${COURSE_CONTENT.sessions.map((session) => `<option value="${session.id}">第${session.id}回：${escapeHTML(session.title)}</option>`).join("")}<option value="diagnostic">初回診断（基礎問題）</option><option value="all">全範囲</option></select></label>
        <label class="form-field"><span>制限時間 [分]</span><input class="input" name="minutes" type="number" min="5" max="60" value="20"></label>
        <label class="form-field"><span>問題数</span><input class="input" name="count" type="number" min="3" max="14" value="10"></label>
        <label class="form-field"><span>問題順Seed</span><input class="input" name="seed" value="${escapeAttribute(seed)}"></label>
        <label class="form-field full"><span>配布URL</span><textarea class="textarea" id="teacherQuizLink" readonly>${escapeHTML(initialLink)}</textarea></label>
        <div class="form-field full"><div class="button-row"><button class="button primary" type="button" data-action="copy-quiz-link">URLをコピー</button><button class="button secondary" type="button" data-action="open-quiz-link">新しいタブで確認</button></div></div>
      </form>
    </div></section>

    <section class="section">
      <div class="section-heading"><div><h2>結果JSONの集計</h2><p>平均 ${average}% · ${records.length}件。ファイルはブラウザ内でのみ読み取ります。</p></div><div class="button-row"><label class="button primary" for="quizResultFiles">JSONを追加</label><input class="sr-only" id="quizResultFiles" type="file" accept="application/json,.json" multiple><button class="button secondary" type="button" data-action="export-teacher-csv" ${records.length ? "" : "disabled"}>集計CSV</button><button class="button ghost" type="button" data-action="clear-imported-results" ${importedQuizResults.length ? "" : "disabled"}>読込分を消去</button></div></div>
      ${teacherResultsTable(records)}
    </section>
  `;
}

function renderLibrary() {
  const query = "";
  appView.innerHTML = `
    ${pageHeader({ eyebrow: "REFERENCE", title: "資料・用語集", description: "講義資料の内容をlessonへ対応付け、アプリ単体で復習できるようにした参照ページです。" })}
    <section class="section">
      <div class="section-heading"><div><h2>アップロード済み講義資料の網羅表</h2><p>各資料の主要項目を、対応lessonへ明示的に割り当てています。</p></div></div>
      <div class="table-wrap"><table class="data-table"><thead><tr><th>資料</th><th>収録項目</th><th>対応lesson</th></tr></thead><tbody>
        ${COURSE_CONTENT.sourceCoverage.map((source) => `<tr><td><strong>${escapeHTML(source.source)}</strong></td><td>${source.coverage.map((item) => `<span class="tag">${escapeHTML(item)}</span>`).join(" ")}</td><td>${source.lessons.map((id) => { const lesson = LESSON_BY_ID.get(id); return lesson ? `<a href="#learn/${escapeAttribute(id)}">${String(lessonNumber(lesson)).padStart(2, "0")}</a>` : escapeHTML(id); }).join(" / ")}</td></tr>`).join("")}
      </tbody></table></div>
    </section>
    <section class="section">
      <div class="section-heading"><div><h2>チートシート</h2><p>丸暗記ではなく、必要なときに見返して改変するための最小例です。</p></div></div>
      <div class="cheatsheet-grid">${COURSE_CONTENT.cheatsheet.map((item) => `<article class="card"><div class="card-body"><h3>${escapeHTML(item.title)}</h3>${codeBlock(item.code)}</div></article>`).join("")}</div>
    </section>
    <section class="section">
      <div class="section-heading"><div><h2>用語集</h2><p>英語のエラーメッセージや公式ドキュメントを読むための対応表です。</p></div><label class="form-field"><span class="sr-only">用語検索</span><input class="input" id="glossaryQuery" value="${escapeAttribute(query)}" placeholder="用語を検索"></label></div>
      <dl class="glossary-grid" id="glossaryGrid">${COURSE_CONTENT.glossary.map(([term, definition]) => `<div class="glossary-entry" data-glossary="${escapeAttribute(canonicalAnswer(`${term} ${definition}`))}"><dt>${escapeHTML(term)}</dt><dd>${escapeHTML(definition)}</dd></div>`).join("")}</dl>
    </section>
  `;
}

function renderProgress() {
  const snapshot = store.snapshot();
  const progress = overallProgress(snapshot);
  const passed = Object.values(snapshot.practiceAttempts).filter((item) => item?.passed).length;

  appView.innerHTML = `
    ${pageHeader({ eyebrow: "PROGRESS", title: "進捗・保存", description: "学習状況、コード下書き、練習履歴、小テスト結果を確認し、JSONとしてバックアップまたは別端末へ移行できます。" })}
    <section class="card"><div class="card-body">
      <div class="metric-grid">
        <div class="metric"><strong>${progress.count}/${progress.total}</strong><span>lesson完了</span></div>
        <div class="metric"><strong>${passed}/${PRACTICES.length}</strong><span>練習合格</span></div>
        <div class="metric"><strong>${snapshot.quizHistory.length}</strong><span>小テスト履歴</span></div>
        <div class="metric"><strong>${escapeHTML(formatDateTime(snapshot.updatedAt))}</strong><span>最終保存</span></div>
      </div>
      <div class="progress-track" style="margin-top:14px"><span style="width:${progress.percent}%"></span></div>
    </div></section>

    <section class="section card"><div class="card-body">
      <div class="section-heading"><div><h2>受講者情報と表示設定</h2><p>受講者情報は小テスト結果JSONへ含まれます。</p></div></div>
      <form id="settingsForm" class="form-grid">
        <label class="form-field"><span>学籍番号</span><input class="input" name="studentId" value="${escapeAttribute(snapshot.profile.studentId)}"></label>
        <label class="form-field"><span>氏名</span><input class="input" name="name" value="${escapeAttribute(snapshot.profile.name)}"></label>
        <label class="form-field"><span>配色</span><select class="select" name="theme"><option value="dark" ${snapshot.settings.theme === "dark" ? "selected" : ""}>ダーク</option><option value="light" ${snapshot.settings.theme === "light" ? "selected" : ""}>ライト</option></select></label>
        <label class="form-field"><span>文字倍率</span><select class="select" name="fontScale">${[0.9, 1, 1.1, 1.2].map((value) => `<option value="${value}" ${Number(snapshot.settings.fontScale) === value ? "selected" : ""}>${Math.round(value * 100)}%</option>`).join("")}</select></label>
        <div class="form-field full"><button class="button primary" type="submit">設定を保存</button></div>
      </form>
    </div></section>

    <section class="section">
      <div class="section-heading"><div><h2>lesson完了一覧</h2><p>チェックは自己記録として自由に変更できます。</p></div></div>
      <div class="completion-grid">${LESSONS.map((lesson) => `<label class="completion-item"><input type="checkbox" data-action="progress-lesson" data-lesson="${escapeAttribute(lesson.id)}" ${snapshot.completedLessons.includes(lesson.id) ? "checked" : ""}><span><strong>${String(lessonNumber(lesson)).padStart(2, "0")}. ${escapeHTML(lesson.title)}</strong><br><small class="help-text">第${lesson.session}回 · ${lesson.minutes}分</small></span></label>`).join("")}</div>
    </section>

    <section class="section">
      <div class="section-heading"><div><h2>小テスト履歴</h2><p>最高100件まで端末内へ保存します。</p></div></div>
      ${snapshot.quizHistory.length ? quizHistoryTable([...snapshot.quizHistory].reverse()) : '<div class="empty-state"><p>まだ小テスト履歴がありません。</p></div>'}
    </section>

    <section class="section card"><div class="card-body">
      <div class="section-heading"><div><h2>バックアップと初期化</h2><p>進捗JSONにはコード下書きや小テスト履歴が含まれます。学籍番号・氏名を含む場合は取り扱いに注意してください。</p></div></div>
      <div class="button-row"><button class="button primary" type="button" data-action="export-progress">進捗JSONを書き出す</button><label class="button secondary" for="progressImportFile">進捗JSONを読み込む</label><input class="sr-only" id="progressImportFile" type="file" accept="application/json,.json"><button class="button danger" type="button" data-action="reset-progress">この端末の進捗を初期化</button></div>
    </div></section>
  `;
}

function renderAbout() {
  appView.innerHTML = `
    ${pageHeader({ eyebrow: "ABOUT", title: "アプリ情報", description: "LAVi-SPICA（Structured Python Interactive Course and Activities）は、計算科学基礎の講義内実習、自習、事後学習、次回冒頭小テストを一体化した静的Webアプリです。" })}
    <div class="card-grid">
      <article class="card"><div class="card-body"><div class="eyebrow">IDENTITY</div><h3>LAVi-SPICA</h3><p><strong>Structured Python Interactive Course and Activities</strong>。初学者がPythonを段階的に学ぶための講義・演習・復習環境です。</p></div></article>
      <article class="card"><div class="card-body"><div class="eyebrow">VERSION</div><h3>v${escapeHTML(APP_VERSION)}</h3><p>教材データ、問題バンク、UIを同じリリース番号で管理します。</p></div></article>
      <article class="card"><div class="card-body"><div class="eyebrow">PYTHON</div><h3>Pyodide ${escapeHTML(COURSE_CONTENT.meta.pyodide)}</h3><p>PythonをWeb Worker内で実行し、NumPy・Matplotlibをコードのimportに応じて準備します。</p></div></article>
      <article class="card"><div class="card-body"><div class="eyebrow">CONTENT</div><h3>${LESSONS.length} lesson / ${PRACTICES.length} practice / ${QUESTIONS.length} quiz</h3><p>4つのアップロード済み講義資料とPython基礎文法を統合しています。</p></div></article>
    </div>
    <section class="section">
      <div class="section-heading"><div><h2>動作とデータ保存</h2></div></div>
      <div class="card"><div class="card-body"><ul class="clean-list">
        <li>教材本文、問題バンク、CSV練習データはアプリへ同梱されています。</li>
        <li>Python実行時には、Pyodideと必要な科学計算パッケージをCDNから読み込みます。初回は通信と待ち時間が必要です。</li>
        <li>コードはブラウザの別スレッド（Web Worker）で実行し、40秒を超える処理は安全のため停止します。</li>
        <li><code>input()</code>は無効です。値はコード内の変数へ代入します。</li>
        <li>進捗、コード下書き、予想、小テスト履歴はlocalStorage、受験中の小テストはsessionStorageへ保存します。</li>
        <li>教員へ自動送信するバックエンドはありません。提出には結果JSONまたはLMSを使います。</li>
      </ul></div></div>
    </section>
    <section class="section">
      <div class="section-heading"><div><h2>教育上の位置付けと制約</h2></div></div>
      <div class="info-strip warning"><span aria-hidden="true">!</span><div><strong>小テストの正答情報は静的ファイル内にあります。</strong><br>日常的な理解確認や反転学習には適しますが、監督を要する高stakes試験にはLMSの問題バンク、出題順乱択、アクセス制御などを使用してください。</div></div>
      <div class="card" style="margin-top:12px"><div class="card-body"><ul class="clean-list">
        <li>自動判定は代表的な出力・必須構文を確認する補助機能であり、プログラムの品質を完全に評価しません。</li>
        <li>AIが生成したコードでも、主要変数、処理順、反復回数、条件、関数、結果を説明・変更・検証できることを学習成果とします。</li>
        <li>NumPyのベクトル化は重要ですが、初学段階ではfor文の意味を理解した後に比較します。</li>
        <li>ブラウザ実行環境は研究用HPCやローカルPython環境の完全な代替ではありません。</li>
      </ul></div></div>
    </section>
    <section class="section card"><div class="card-body"><div class="eyebrow">LICENSE</div><h2>MIT License</h2><p>教材とソースコードはMIT Licenseで再利用できます。授業で改変する際は、バージョンと変更点を記録してください。</p></div></section>
  `;
}

function renderNotFound() {
  appView.innerHTML = `<div class="empty-state"><h1>ページが見つかりません</h1><p>URLのハッシュ部分を確認してください。</p><a class="button primary" href="#dashboard">ホームへ戻る</a></div>`;
}

function renderRoute() {
  clearInterval(quizTimer);
  quizTimer = null;
  editorContexts = new Map();
  editorResults = new Map();
  currentRoute = parseHashRoute();
  setActiveNavigation(currentRoute);
  closeMobileMenu();

  switch (currentRoute.name) {
    case "dashboard": renderDashboard(); break;
    case "learn": renderLearn(currentRoute); break;
    case "practice": renderPractice(currentRoute); break;
    case "quiz": renderQuiz(currentRoute); break;
    case "teacher": renderTeacher(); break;
    case "library": renderLibrary(); break;
    case "progress": renderProgress(); break;
    case "about": renderAbout(); break;
    default: renderNotFound();
  }

  updateSidebarProgress();
  mainContent.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "auto" });
}

function editorElement(editorId) {
  return document.querySelector(`textarea[data-editor="${CSS.escape(editorId)}"]`);
}

function editorShell(editorId) {
  return document.querySelector(`[data-editor-shell="${CSS.escape(editorId)}"]`);
}

function setEditorBusy(editorId, busy) {
  const shell = editorShell(editorId);
  if (!shell) return;
  shell.querySelector('[data-action="run-code"]').disabled = busy;
  shell.querySelector('[data-action="stop-code"]').disabled = !busy;
  shell.querySelector(".code-editor").readOnly = busy;
}

function outputPanel(editorId, name) {
  return editorShell(editorId)?.querySelector(`[data-output="${CSS.escape(name)}"]`) ?? null;
}

function selectOutputTab(editorId, tabName) {
  const shell = editorShell(editorId);
  if (!shell) return;
  shell.querySelectorAll(".output-tab").forEach((tab) => {
    const active = tab.dataset.tab === tabName;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  shell.querySelectorAll(".output-panel").forEach((panel) => panel.classList.toggle("hidden", panel.dataset.output !== tabName));
}

function pythonErrorHint(errorText) {
  const text = String(errorText || "");
  const hints = [
    ["Failed to fetch dynamically imported module", "Pyodideを取得できませんでした。インターネット接続、学内ネットワークのCDN制限、広告ブロック設定を確認し、ページを再読み込みしてください。"],
    ["ERR_NAME_NOT_RESOLVED", "Pyodide配信先の名前解決に失敗しました。ネットワーク接続またはDNS設定を確認してください。"],
    ["IndentationError", "if・for・defの次の行を、同じ幅の半角スペースで字下げしてください。"],
    ["SyntaxError", "エラー行の直前も含め、引用符、括弧、コロン、全角記号を確認してください。"],
    ["NameError", "変数名の綴り、大文字・小文字、代入より前に使用していないかを確認してください。"],
    ["TypeError", "type()で値の型を確認し、その演算や関数がその型へ使えるかを確認してください。"],
    ["IndexError", "len()で要素数を確認し、最後の有効なindexがlen(...) - 1であることを確認してください。"],
    ["KeyError", "辞書のキーをprint(record.keys())で確認するか、未登録があり得る場合はget()を使います。"],
    ["ZeroDivisionError", "分母が0になる入力・条件・境界値を確認してください。"],
    ["ModuleNotFoundError", "ブラウザ教材で利用可能なパッケージか確認してください。標準教材ではmath、numpy、matplotlibを使います。"],
    ["FileNotFoundError", "同梱データはexperiment.csv、experiment_missing.csv、projectile.csvです。ファイル名と相対パスを確認してください。"],
  ];
  const found = hints.find(([name]) => text.includes(name));
  return found ? found[1] : "最後の行だけでなく、最初に表示されたエラー名、ファイル名、行番号から確認してください。";
}

function variablePreview(value) {
  if (!value || typeof value !== "object") return String(value ?? "");
  if (Object.prototype.hasOwnProperty.call(value, "value")) return String(value.value);
  if (value.shape) {
    const stats = [value.min != null ? `min=${value.min}` : "", value.max != null ? `max=${value.max}` : "", value.mean != null ? `mean=${value.mean}` : ""].filter(Boolean).join(", ");
    return `shape=${JSON.stringify(value.shape)}, dtype=${value.dtype}${stats ? `, ${stats}` : ""}, preview=${JSON.stringify(value.preview)}`;
  }
  if (value.preview != null) return typeof value.preview === "string" ? value.preview : JSON.stringify(value.preview);
  return JSON.stringify(value);
}

function base64ToBlob(base64, type = "application/octet-stream") {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return new Blob([bytes], { type });
}

function renderExecutionResult(editorId, result, practiceEvaluation = null) {
  editorResults.set(editorId, result);
  const consolePanel = outputPanel(editorId, "console");
  const variablePanel = outputPanel(editorId, "variables");
  const figurePanel = outputPanel(editorId, "figures");
  const filePanel = outputPanel(editorId, "files");
  if (!consolePanel || !variablePanel || !figurePanel || !filePanel) return;

  const stdout = stripAnsi(result.stdout || "");
  const stderr = stripAnsi(result.stderr || "");
  const error = stripAnsi(result.error || "");
  const hasError = Boolean(error);
  consolePanel.innerHTML = `
    <div class="execution-meta"><span>実行時間 ${Number(result.elapsedMs || 0).toFixed(1)} ms</span><span>${hasError ? "エラーあり" : "実行完了"}</span></div>
    ${stdout ? `<pre class="output-console">${escapeHTML(stdout)}</pre>` : '<p class="output-empty">標準出力はありません。</p>'}
    ${stderr ? `<pre class="output-console output-warning">${escapeHTML(stderr)}</pre>` : ""}
    ${error ? `<pre class="output-console output-error">${escapeHTML(error)}</pre><div class="info-strip danger" style="margin-top:10px"><span aria-hidden="true">?</span><div><strong>確認の手掛かり</strong><br>${escapeHTML(pythonErrorHint(error))}</div></div>` : ""}
    ${practiceEvaluation ? `<div class="practice-feedback ${practiceEvaluation.passed ? "pass" : "fail"}"><strong>${practiceEvaluation.passed ? "✓ 合格" : "もう一度確認"}</strong><br>${escapeHTML(practiceEvaluation.message)}</div>` : ""}
  `;

  const variables = Object.entries(result.variables || {});
  variablePanel.innerHTML = variables.length ? `<table class="variable-table"><thead><tr><th>名前</th><th>型</th><th>値・要約</th></tr></thead><tbody>${variables.map(([name, value]) => `<tr><td><code>${escapeHTML(name)}</code></td><td>${escapeHTML(value.type || "—")}</td><td class="variable-preview">${escapeHTML(variablePreview(value))}</td></tr>`).join("")}</tbody></table>` : '<p class="output-empty">表示対象の変数はありません。</p>';

  figurePanel.innerHTML = (result.figures || []).length ? `<div class="figure-grid">${result.figures.map((base64, index) => `<figure><img src="data:image/png;base64,${base64}" alt="Matplotlib出力図 ${index + 1}"><figcaption>Figure ${index + 1}</figcaption></figure>`).join("")}</div>` : '<p class="output-empty">Matplotlibの図は生成されませんでした。</p>';

  filePanel.innerHTML = (result.files || []).length ? `<div class="file-list">${result.files.map((file, index) => `<div class="file-row"><span><strong>${escapeHTML(file.name)}</strong><br><small>${formatBytes(file.size)}${file.tooLarge ? " · 2 MB超のため取得対象外" : ""}</small></span>${file.base64 ? `<button class="button secondary small" type="button" data-action="download-generated-file" data-editor="${escapeAttribute(editorId)}" data-file-index="${index}">ダウンロード</button>` : ""}</div>`).join("")}</div>` : '<p class="output-empty">新しく生成されたファイルはありません。</p>';

  selectOutputTab(editorId, hasError ? "console" : (result.figures || []).length ? "figures" : "console");
}

function normalizeOutput(value) {
  return String(value ?? "").replace(/\r\n/g, "\n").trim();
}

function evaluatePractice(practice, code, result) {
  if (result.error) return { passed: false, message: "Pythonエラーを解消してから、出力と条件を確認します。" };
  const check = practice.check || {};
  const stdout = normalizeOutput(result.stdout);
  const reasons = [];

  if (check.outputEquals != null && canonicalAnswer(stdout) !== canonicalAnswer(check.outputEquals)) {
    reasons.push(`出力が期待値「${check.outputEquals}」と一致していません。`);
  }
  if (Array.isArray(check.outputContains)) {
    for (const expected of check.outputContains) {
      if (!canonicalAnswer(stdout).includes(canonicalAnswer(expected))) reasons.push(`出力に「${expected}」が見つかりません。`);
    }
  }
  if (check.numericOutput != null) {
    const numbers = stdout.match(/[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/g) || [];
    const actual = Number(numbers.at(-1));
    const tolerance = Number(check.tolerance ?? 1e-9);
    if (!Number.isFinite(actual) || Math.abs(actual - Number(check.numericOutput)) > tolerance) {
      reasons.push(`最後の数値出力が期待値 ${check.numericOutput} と一致していません。`);
    }
  }
  for (const required of check.required || []) {
    if (!code.includes(required)) reasons.push(`コードに必要な要素「${required}」が見つかりません。`);
  }
  for (const forbidden of check.forbidden || []) {
    if (code.includes(forbidden)) reasons.push(`この問題では「${forbidden}」を使わずに修正してください。`);
  }
  const passed = reasons.length === 0;
  return { passed, message: passed ? "期待される出力と、この問題で確認する構文を満たしました。自分のコードを一行ずつ説明してみましょう。" : reasons.join(" ") };
}

async function runEditor(editorId) {
  const textarea = editorElement(editorId);
  const context = editorContexts.get(editorId);
  if (!textarea || !context) return;
  const code = textarea.value;
  setEditorBusy(editorId, true);
  setRuntimeState("working", "Pythonを準備しています", "初回は数十秒かかる場合があります");
  initializeRuntime();
  try {
    const result = await runtime.run(code, { filename: context.filename || "student.py" });
    let evaluation = null;
    if (context.practiceId) {
      const practice = PRACTICE_BY_ID.get(context.practiceId);
      if (practice) {
        evaluation = evaluatePractice(practice, code, result);
        store.recordPractice(practice.id, {
          at: new Date().toISOString(),
          passed: evaluation.passed,
          stdout: normalizeOutput(result.stdout).slice(0, 2000),
          error: result.error ? stripAnsi(result.error).slice(0, 2000) : "",
        });
        updatePracticeFeedback(practice.id, evaluation);
      }
    }
    renderExecutionResult(editorId, result, evaluation);
    setRuntimeState(result.error ? "error" : "ready", result.error ? "コードにエラーがあります" : "Python実行完了", `${Number(result.elapsedMs || 0).toFixed(1)} ms`);
  } catch (error) {
    const pseudoResult = { stdout: "", stderr: "", error: error.message || String(error), figures: [], variables: {}, files: [], elapsedMs: 0 };
    renderExecutionResult(editorId, pseudoResult, null);
    setRuntimeState("error", "実行を完了できませんでした", error.message || String(error));
    toast("Pythonを実行できませんでした", error.message || String(error), "error", 6500);
  } finally {
    setEditorBusy(editorId, false);
  }
}

function updatePracticeFeedback(practiceId, evaluation) {
  document.querySelectorAll(`[data-practice-feedback="${CSS.escape(practiceId)}"]`).forEach((element) => {
    element.innerHTML = `<div class="practice-feedback ${evaluation.passed ? "pass" : "fail"}"><strong>${evaluation.passed ? "✓ 合格" : "確認が必要"}</strong><br>${escapeHTML(evaluation.message)}</div>`;
  });
}

function loadCodeIntoEditor(editorId, code, contextPatch = {}, message = "コードを読み込みました") {
  const textarea = editorElement(editorId);
  const context = editorContexts.get(editorId);
  if (!textarea || !context) return;
  if (textarea.value.trim() && textarea.value !== context.defaultCode) {
    // The student can always undo in the textarea; keep the interaction immediate for a classroom setting.
  }
  textarea.value = code;
  editorContexts.set(editorId, { ...context, ...contextPatch, defaultCode: code });
  textarea.focus();
  textarea.setSelectionRange(0, 0);
  selectOutputTab(editorId, "console");
  const panel = outputPanel(editorId, "console");
  if (panel) panel.innerHTML = '<p class="output-empty">コードを読み込みました。実行前に結果を予想してください。</p>';
  toast(message, "Ctrl / ⌘ + Enterでも実行できます", "info", 2600);
}

async function showHints(practiceId) {
  const practice = PRACTICE_BY_ID.get(practiceId);
  if (!practice) return;
  dialogTitle.textContent = `${practice.title} · ヒント`;
  dialogBody.innerHTML = `<ol class="clean-list">${practice.hints.map((hint) => `<li>${escapeHTML(hint)}</li>`).join("")}</ol>`;
  dialogActions.innerHTML = '<button class="button primary" value="cancel">閉じる</button>';
  globalDialog.showModal();
}

async function showSolution(practiceId) {
  const practice = PRACTICE_BY_ID.get(practiceId);
  if (!practice) return;
  const attempts = store.snapshot().practiceAttempts[practiceId]?.attempts ?? 0;
  if (attempts === 0) {
    const proceed = await showConfirm({
      title: "まだ実行記録がありません",
      body: "<p>まず開始コードを一度実行し、エラーまたは出力を確認することを推奨します。それでも解答例を表示しますか。</p>",
      confirmLabel: "解答例を見る",
    });
    if (!proceed) return;
  }
  dialogTitle.textContent = `${practice.title} · 解答例`;
  dialogBody.innerHTML = `<p>これは一例です。同じ目的を満たす別の書き方もあります。</p>${codeBlock(practice.solution)}`;
  dialogActions.innerHTML = `<button class="button secondary" value="cancel">閉じる</button><button class="button primary" type="button" data-action="copy-solution-dialog" data-practice="${escapeAttribute(practiceId)}">コードをコピー</button>`;
  globalDialog.showModal();
}

function quizResultRows(record) {
  return [
    ["quiz_id", "student_id", "name", "scope", "score", "max_score", "percent", "submitted_at", "duration_seconds", "seed", "question_id", "correct", "points", "max_points", "answer"],
    ...record.details.map((detail) => [
      record.quizId,
      record.profile?.studentId || "",
      record.profile?.name || "",
      record.scopeName,
      record.score,
      record.maxScore,
      record.percent,
      record.submittedAt,
      record.durationSeconds,
      record.seed,
      detail.questionId,
      detail.correct,
      detail.pointsEarned,
      detail.maxPoints,
      Array.isArray(detail.answer) ? detail.answer.join("|") : detail.answer ?? "",
    ]),
  ];
}

function teacherCSVRows(records) {
  return [
    ["student_id", "name", "scope", "score", "max_score", "percent", "started_at", "submitted_at", "duration_seconds", "automatic", "seed", "quiz_id"],
    ...records.map((record) => [
      record.profile?.studentId || "",
      record.profile?.name || "",
      record.scopeName || quizScopeName(record.scope),
      record.score,
      record.maxScore,
      record.percent,
      record.startedAt,
      record.submittedAt,
      record.durationSeconds,
      record.automatic,
      record.seed,
      record.quizId,
    ]),
  ];
}

async function handleClick(event) {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  const editorId = target.dataset.editor;

  if (action === "run-code") {
    event.preventDefault();
    await runEditor(editorId);
    return;
  }
  if (action === "stop-code") {
    runtime.cancel("学生の操作で実行を停止しました");
    setEditorBusy(editorId, false);
    toast("実行を停止しました", "次の実行時にPython環境を再初期化します", "info");
    return;
  }
  if (action === "copy-code") {
    await copyText(editorElement(editorId)?.value ?? "");
    toast("コードをコピーしました", "", "success", 2200);
    return;
  }
  if (action === "reset-code") {
    const context = editorContexts.get(editorId);
    const textarea = editorElement(editorId);
    if (context && textarea) {
      textarea.value = context.defaultCode;
      if (context.kind === "lesson" && context.lessonId) store.setDraft(context.lessonId, textarea.value);
      toast("開始コードへ戻しました", "", "info", 2200);
    }
    return;
  }
  if (action === "output-tab") {
    selectOutputTab(editorId, target.dataset.tab);
    return;
  }
  if (action === "load-live-code") {
    const lesson = LESSON_BY_ID.get(target.dataset.lesson);
    const step = lesson?.liveCoding?.[Number(target.dataset.index)];
    if (step) loadCodeIntoEditor(editorId, step.code, { kind: "lesson", lessonId: lesson.id, practiceId: null, filename: `${lesson.id}-live.py` }, `${step.title}を読み込みました`);
    return;
  }
  if (action === "load-practice") {
    const practice = PRACTICE_BY_ID.get(target.dataset.practice);
    if (practice) loadCodeIntoEditor(editorId, practice.starterCode, { kind: "practice", practiceId: practice.id, lessonId: practice.lesson.id, filename: `${practice.id}.py` }, `${practice.title}を読み込みました`);
    return;
  }
  if (action === "show-hints") {
    await showHints(target.dataset.practice);
    return;
  }
  if (action === "show-solution") {
    await showSolution(target.dataset.practice);
    return;
  }
  if (action === "copy-solution-dialog") {
    const practice = PRACTICE_BY_ID.get(target.dataset.practice);
    if (practice) {
      await copyText(practice.solution);
      toast("解答例をコピーしました", "コピー後も一行ずつ意味を確認してください", "success");
    }
    return;
  }
  if (action === "toggle-lesson") {
    const lessonId = target.dataset.lesson;
    const completed = store.snapshot().completedLessons.includes(lessonId);
    store.markLesson(lessonId, !completed);
    renderRoute();
    toast(!completed ? "lessonを完了にしました" : "完了記録を解除しました", "", !completed ? "success" : "info");
    return;
  }
  if (action === "select-practice") {
    currentPracticeId = target.dataset.practice;
    const params = new URLSearchParams({ item: currentPracticeId });
    setHashRoute("practice", params);
    return;
  }
  if (action === "reset-practice-filter") {
    practiceFilters = { session: "all", difficulty: "all", query: "" };
    renderPractice(parseHashRoute());
    return;
  }
  if (action === "submit-quiz") {
    const active = store.getActiveQuiz();
    const unanswered = active?.questionIds.filter((id) => {
      const value = active.answers?.[id];
      return Array.isArray(value) ? value.length === 0 : value == null || String(value).trim() === "";
    }).length ?? 0;
    const confirmed = unanswered
      ? await showConfirm({ title: "未回答があります", body: `<p>${unanswered}問が未回答です。このまま提出しますか。</p>`, confirmLabel: "提出する" })
      : true;
    if (confirmed) submitQuiz();
    return;
  }
  if (action === "abandon-quiz") {
    const confirmed = await showConfirm({ title: "受験を破棄しますか", body: "<p>現在の回答と残り時間は失われます。</p>", confirmLabel: "破棄する", danger: true });
    if (confirmed) {
      store.setActiveQuiz(null);
      clearInterval(quizTimer);
      quizTimer = null;
      renderQuizSetup(parseHashRoute());
    }
    return;
  }
  if (action === "new-quiz") {
    recentQuizResult = null;
    renderQuizSetup(parseHashRoute());
    return;
  }
  if (action === "download-quiz-json") {
    if (recentQuizResult) downloadJSON(recentQuizResult, `${recentQuizResult.profile?.studentId || "student"}_${recentQuizResult.quizId}.json`);
    return;
  }
  if (action === "download-quiz-csv") {
    if (recentQuizResult) downloadText(rowsToCSV(quizResultRows(recentQuizResult)), `${recentQuizResult.profile?.studentId || "student"}_${recentQuizResult.quizId}.csv`, "text/csv;charset=utf-8");
    return;
  }
  if (action === "copy-quiz-link") {
    const link = document.querySelector("#teacherQuizLink")?.value ?? "";
    await copyText(link);
    toast("配布URLをコピーしました", "", "success");
    return;
  }
  if (action === "open-quiz-link") {
    const link = document.querySelector("#teacherQuizLink")?.value ?? "";
    if (link) window.open(link, "_blank", "noopener");
    return;
  }
  if (action === "export-teacher-csv") {
    const records = combinedTeacherResults();
    if (records.length) downloadText(rowsToCSV(teacherCSVRows(records)), `lavi-spica-quiz-summary-${new Date().toISOString().slice(0, 10)}.csv`, "text/csv;charset=utf-8");
    return;
  }
  if (action === "clear-imported-results") {
    importedQuizResults = [];
    renderTeacher();
    return;
  }
  if (action === "print-page") {
    window.print();
    return;
  }
  if (action === "export-progress") {
    const payload = { format: "lavi-spica-progress-v1", appVersion: APP_VERSION, exportedAt: new Date().toISOString(), state: store.snapshot() };
    downloadJSON(payload, `lavi-spica-progress-${new Date().toISOString().slice(0, 10)}.json`);
    return;
  }
  if (action === "reset-progress") {
    const confirmed = await showConfirm({ title: "進捗を初期化しますか", body: "<p>lesson完了、コード下書き、練習履歴、小テスト履歴がこの端末から削除されます。元に戻せません。必要なら先に進捗JSONを書き出してください。</p>", confirmLabel: "初期化する", danger: true });
    if (confirmed) {
      store.reset();
      renderRoute();
      toast("進捗を初期化しました", "", "info");
    }
    return;
  }
  if (action === "download-generated-file") {
    const result = editorResults.get(editorId);
    const file = result?.files?.[Number(target.dataset.fileIndex)];
    if (file?.base64) downloadBlob(base64ToBlob(file.base64), file.name);
  }
}

function updateQuizAnsweredCount(active) {
  const count = active.questionIds.filter((id) => {
    const value = active.answers?.[id];
    return Array.isArray(value) ? value.length > 0 : value !== undefined && String(value).trim() !== "";
  }).length;
  const element = document.querySelector("#quizAnsweredCount");
  if (element) element.textContent = String(count);
}

function handleInput(event) {
  const target = event.target;
  if (target.matches('textarea[data-editor]')) {
    const editorId = target.dataset.editor;
    const context = editorContexts.get(editorId);
    if (context?.kind === "lesson" && context.lessonId && !context.practiceId) saveDraftDebounced(context.lessonId, target.value);
    return;
  }
  if (target.dataset.save === "prediction") {
    savePredictionDebounced(target.dataset.lesson, target.value);
    return;
  }
  if (target.dataset.save === "lesson-note") {
    saveNoteDebounced(target.dataset.lesson, target.value);
    return;
  }
  if (target.dataset.save === "exit") {
    saveExitDebounced(target.dataset.session, target.value);
    return;
  }
  if (target.dataset.quizQuestion) {
    const active = store.getActiveQuiz();
    if (!active) return;
    const question = QUESTION_BY_ID.get(target.dataset.quizQuestion);
    if (!question) return;
    if (question.type === "multi") {
      const selected = [...document.querySelectorAll(`input[data-quiz-question="${CSS.escape(question.id)}"]:checked`)].map((input) => Number(input.value));
      active.answers[question.id] = selected;
    } else if (question.type === "single") {
      active.answers[question.id] = Number(target.value);
    } else {
      active.answers[question.id] = target.value;
    }
    store.setActiveQuiz(active);
    updateQuizAnsweredCount(active);
    return;
  }
  if (target.id === "practiceQuery") {
    practiceFilters.query = target.value;
    clearTimeout(target._filterTimer);
    target._filterTimer = setTimeout(() => renderPractice(parseHashRoute()), 250);
    return;
  }
  if (target.id === "glossaryQuery") {
    const query = canonicalAnswer(target.value);
    document.querySelectorAll("[data-glossary]").forEach((entry) => entry.classList.toggle("hidden", query && !entry.dataset.glossary.includes(query)));
    return;
  }
  if (target.closest("#teacherQuizLinkForm")) updateTeacherQuizLink();
}

function handleChange(event) {
  const target = event.target;
  const quizSetupForm = target.closest?.("#quizSetupForm");
  if (quizSetupForm && target.name === "scope") {
    syncQuizCountLimit(quizSetupForm);
    return;
  }
  const teacherQuizForm = target.closest?.("#teacherQuizLinkForm");
  if (teacherQuizForm && target.name === "scope") {
    syncQuizCountLimit(teacherQuizForm);
    updateTeacherQuizLink();
    return;
  }
  if (target.id === "practiceSessionFilter") {
    practiceFilters.session = target.value;
    renderPractice(parseHashRoute());
    return;
  }
  if (target.id === "practiceDifficultyFilter") {
    practiceFilters.difficulty = target.value;
    renderPractice(parseHashRoute());
    return;
  }
  if (target.matches('[data-action="progress-lesson"]')) {
    store.markLesson(target.dataset.lesson, target.checked);
    updateSidebarProgress();
    return;
  }
  if (target.id === "quizResultFiles") {
    importQuizResultFiles(target.files);
    return;
  }
  if (target.id === "progressImportFile") {
    importProgressFile(target.files?.[0]);
  }
}

function handleKeydown(event) {
  const target = event.target;
  if (!target.matches('textarea[data-editor]')) return;
  const editorId = target.dataset.editor;
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    event.preventDefault();
    runEditor(editorId);
    return;
  }
  if (event.key === "Tab") {
    event.preventDefault();
    const start = target.selectionStart;
    const end = target.selectionEnd;
    target.value = `${target.value.slice(0, start)}    ${target.value.slice(end)}`;
    target.selectionStart = target.selectionEnd = start + 4;
    target.dispatchEvent(new Event("input", { bubbles: true }));
  }
}

function updateTeacherQuizLink() {
  const form = document.querySelector("#teacherQuizLinkForm");
  const output = document.querySelector("#teacherQuizLink");
  if (!form || !output) return;
  syncQuizCountLimit(form);
  const data = new FormData(form);
  const scope = normalizeQuizScope(data.get("scope") || "1");
  const minutes = clamp(Number(data.get("minutes")) || 20, 5, 60);
  const count = clamp(Number(data.get("count")) || 10, 3, Math.min(30, quizPool(scope).length));
  const seed = String(data.get("seed") || `${new Date().toISOString().slice(0, 10)}-s${scope}`);
  output.value = buildQuizLink({ scope, minutes, count, seed });
}

async function importQuizResultFiles(fileList) {
  const files = [...(fileList || [])];
  let added = 0;
  const errors = [];
  for (const file of files) {
    try {
      const value = JSON.parse(await file.text());
      const candidates = validQuizResult(value) ? [value] : Array.isArray(value) ? value : value?.quizHistory || value?.state?.quizHistory || [];
      const valid = candidates.filter(validQuizResult);
      importedQuizResults.push(...valid);
      added += valid.length;
      if (!valid.length) errors.push(`${file.name}: 対応する小テスト結果がありません`);
    } catch (error) {
      errors.push(`${file.name}: ${error.message}`);
    }
  }
  const byId = new Map(importedQuizResults.map((record) => [record.quizId || uniqueId("import"), record]));
  importedQuizResults = [...byId.values()];
  renderTeacher();
  if (added) toast(`${added}件の結果を読み込みました`, errors.join(" / "), "success", 5000);
  else toast("結果を読み込めませんでした", errors.join(" / "), "error", 6500);
}

async function importProgressFile(file) {
  if (!file) return;
  try {
    const value = JSON.parse(await file.text());
    const importedState = value?.format === "lavi-spica-progress-v1" ? value.state : value;
    const confirmed = await showConfirm({ title: "進捗を読み込みますか", body: "<p>現在この端末にある進捗は、読み込んだ内容で置き換えられます。</p>", confirmLabel: "読み込む" });
    if (!confirmed) return;
    store.replace(importedState);
    applySettings();
    renderRoute();
    toast("進捗を読み込みました", file.name, "success");
  } catch (error) {
    toast("進捗JSONを読み込めませんでした", error.message, "error", 6500);
  }
}

function handleSubmit(event) {
  if (event.target.id === "quizSetupForm") {
    event.preventDefault();
    const data = new FormData(event.target);
    const profile = { studentId: String(data.get("studentId") || "").trim(), name: String(data.get("name") || "").trim() };
    const scope = normalizeQuizScope(data.get("scope") || "1");
    const minutes = clamp(Number(data.get("minutes")) || 20, 5, 60);
    const count = clamp(Number(data.get("count")) || 10, 3, Math.min(30, quizPool(scope).length));
    const seed = String(data.get("seed") || `${new Date().toISOString().slice(0, 10)}-s${scope}`).trim();
    store.setProfile(profile);
    const active = createQuiz({ scope, minutes, count, seed, profile });
    store.setActiveQuiz(active);
    renderActiveQuiz(active);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  if (event.target.id === "settingsForm") {
    event.preventDefault();
    const data = new FormData(event.target);
    store.setProfile({ studentId: String(data.get("studentId") || "").trim(), name: String(data.get("name") || "").trim() });
    store.setSetting("theme", String(data.get("theme") || "dark"));
    store.setSetting("fontScale", Number(data.get("fontScale")) || 1);
    applySettings();
    toast("設定を保存しました", "", "success");
  }
}

appView.addEventListener("click", handleClick);
appView.addEventListener("input", handleInput);
appView.addEventListener("change", handleChange);
appView.addEventListener("keydown", handleKeydown);
appView.addEventListener("submit", handleSubmit);

dialogActions.addEventListener("click", async (event) => {
  const target = event.target.closest('[data-action="copy-solution-dialog"]');
  if (!target) return;
  event.preventDefault();
  const practice = PRACTICE_BY_ID.get(target.dataset.practice);
  if (practice) {
    await copyText(practice.solution);
    toast("解答例をコピーしました", "", "success");
  }
});

menuToggle.addEventListener("click", () => {
  const open = !sidebar.classList.contains("open");
  sidebar.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  sidebarBackdrop.hidden = !open;
});
sidebarBackdrop.addEventListener("click", closeMobileMenu);

themeToggle.addEventListener("click", () => {
  const current = store.snapshot().settings.theme;
  store.setSetting("theme", current === "light" ? "dark" : "light");
  applySettings();
});

store.addEventListener("change", (event) => updateSidebarProgress(event.detail));
window.addEventListener("hashchange", renderRoute);
window.addEventListener("beforeunload", () => clearInterval(quizTimer));

applySettings();
updateSidebarProgress();
if (!location.hash) location.hash = "dashboard";
else renderRoute();

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("./sw.js").catch((error) => console.info("Service Worker registration skipped", error));
}
