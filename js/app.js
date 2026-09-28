import { COURSE_CONTENT } from "./content.js";
import { SELF_STUDY } from "./self-study.js";
import { LESSON_EXPLANATIONS, POST_STUDY } from "./lesson-extensions.js";
import { LECTURE_PLAN } from "./lecture-plan.js";
import { ENROLLED_NOTICE, MATERIALS } from "./materials.js";
import { exampleActivity } from "./example-activities.js";
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
  escapeAttribute,
  escapeHTML,
  formatBytes,
  formatDateTime,
  parseHashRoute,
  setHashRoute,
  stripAnsi,
} from "./utils.js";

const APP_VERSION = COURSE_CONTENT.meta.version;
const BUILD_ID = "20260928.1";
const LESSONS = [...COURSE_CONTENT.lessons].sort((a, b) => (a.session - b.session) || (a.order - b.order));
const LESSON_BY_ID = new Map(LESSONS.map((lesson) => [lesson.id, lesson]));
const SESSION_BY_ID = new Map(COURSE_CONTENT.sessions.map((session) => [Number(session.id), session]));
const REGULAR_PRACTICES = LESSONS.flatMap((lesson) => lesson.practices.map((practice) => ({ ...practice, lesson, source: "lesson" })));
const POST_STUDY_CODE_TASKS = LESSONS.flatMap((lesson) => (POST_STUDY[lesson.id] || [])
  .filter((task) => task.kind === "code")
  .map((task) => ({ ...task, lesson, source: "post-study" })));
const PRACTICES = [...REGULAR_PRACTICES, ...POST_STUDY_CODE_TASKS];
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
let practiceFilters = { session: "all", difficulty: "all", query: "" };
let currentPracticeId = PRACTICES[0]?.id ?? null;
let runtimeInitialized = false;

const saveDraftDebounced = debounce((lessonId, code) => store.setDraft(lessonId, code), 350);
const savePracticeDraftDebounced = debounce((practiceId, code) => store.setPracticeDraft(practiceId, code), 350);
const savePredictionDebounced = debounce((lessonId, text) => store.setPrediction(lessonId, text), 350);
const saveNoteDebounced = debounce((lessonId, text) => store.setLessonNote(lessonId, text), 350);
const savePostStudyAnswerDebounced = debounce((taskId, text) => store.setPostStudyAnswer(taskId, text), 350);
const saveExitDebounced = debounce((sessionId, text) => store.setExitTicket(sessionId, text), 350);
const saveExampleDebounced = debounce((activityId, patch) => store.setExampleActivity(activityId, patch), 350);

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
  if (lesson.track === "advanced") return '<span class="badge advanced">発展</span>';
  return '<span class="badge core">Python基礎</span>';
}

function practiceStatus(practiceId, snapshot = store.snapshot()) {
  const attempt = snapshot.practiceAttempts[practiceId];
  const draft = snapshot.practiceDrafts?.[practiceId];
  if (attempt?.passed && draft != null && attempt.currentCodeHash !== codeFingerprint(draft)) return { label: "過去に合格・再確認が必要", className: "advanced" };
  if (attempt?.currentPassed) return { label: "現在のコードは正解", className: "done" };
  if (attempt?.passed) return { label: "過去に合格", className: "advanced" };
  if (attempt?.attempts) return { label: "実行済み", className: "advanced" };
  return { label: "未着手", className: "warning" };
}

function lectureProgress(plan, snapshot = store.snapshot()) {
  const validIds = plan.topics.flatMap(({ id }) => LESSON_BY_ID.get(id)?.practices.map(({ id: practiceId }) => practiceId) || []).filter((id) => PRACTICE_BY_ID.has(id));
  const passed = validIds.filter((id) => snapshot.practiceAttempts[id]?.passed).length;
  const attempted = validIds.filter((id) => snapshot.practiceAttempts[id]?.attempts).length;
  return {
    passed, total: validIds.length,
    label: passed === validIds.length && validIds.length ? "完了" : attempted ? "一部完了" : "未着手",
    className: passed === validIds.length && validIds.length ? "done" : attempted ? "advanced" : "warning",
  };
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

  appView.innerHTML = `
    <figure class="brand-hero-banner" aria-label="LAVi-SPICA — Structured Python Interactive Course and Activities">
      <img src="./assets/lavi-spica-hero.png" alt="星空とSpicaをモチーフにしたLAVi-SPICAのイメージ画像" width="1672" height="941" fetchpriority="high">
    </figure>
    <section class="hero">
      <div class="hero-copy">
        <span class="hero-kicker">Structured Python Interactive Course and Activities</span>
        <h1>変数から、データ解析と可視化まで。</h1>
        <p>短い解説を読み、コードを入力し、実行前の予想と実行結果を比べながら進みます。変数から関数までの基礎文法に加え、NumPy、データ入出力、欠損値、Matplotlibまで自分のペースで学べます。</p>
        <div class="hero-actions">
          <a class="button primary" href="#learn/${escapeAttribute(nextLesson.id)}">${progress.count ? "続きから学ぶ" : "第1回から始める"} →</a>
          <a class="button secondary" href="#practice">練習問題を選ぶ</a>
        </div>
      </div>
      <aside class="hero-panel" aria-label="学習状況">
        <div class="eyebrow">この端末の学習状況</div>
        <div class="metric-grid">
          <div class="metric"><strong>${progress.percent}%</strong><span>lesson進捗</span></div>
          <div class="metric"><strong>${practicePassed}</strong><span>合格した練習</span></div>
          <div class="metric"><strong>${LESSONS.length}</strong><span>lesson</span></div>
          <div class="metric"><strong>${PRACTICES.length}</strong><span>練習問題</span></div>
        </div>
        <div class="progress-track"><span style="width:${progress.percent}%"></span></div>
        <small class="help-text">進捗、コードの下書き、予想、メモはこのブラウザに保存されます。</small>
      </aside>
    </section>

    <section class="section mode-chooser" aria-labelledby="modeChooserTitle">
      <div class="section-heading"><div><h2 id="modeChooserTitle">学び方を選ぶ</h2><p>これまでの自習コースはそのまま利用できます。授業後の復習には講義補助モードが便利です。</p></div></div>
      <div class="mode-grid">
        <article class="card mode-card"><div class="card-body"><div class="eyebrow">FULL COURSE</div><h3>通常学習モード</h3><p>詳しい解説、例題、予想、練習を順番に進めます。</p><a class="button secondary" href="#learn">通常モードを開く</a></div></article>
        <article class="card mode-card featured"><div class="card-body"><div class="eyebrow">LECTURE COMPANION</div><h3>講義補助モード</h3><p>今日のnotebook、短い振り返り、必修練習へすぐ進みます。</p><a class="button primary" href="#lecture">講義補助モードを開く</a></div></article>
      </div>
    </section>

    <section class="section">
      <div class="section-heading">
        <div><h2>7回でつなぐ学習経路</h2><p>各回は「詳しい解説 → 例題の入力 → 練習問題 → 事後学習」の順で進みます。</p></div>
        <a class="button ghost small" href="#learn">全lessonを見る</a>
      </div>
      <div class="card-grid">${COURSE_CONTENT.sessions.map((session) => renderSessionCard(session, snapshot)).join("")}</div>
    </section>

    <section class="section">
      <div class="section-heading"><div><h2>学びを進める6つのコツ</h2><p>丸暗記ではなく、コードを少しずつ変え、結果を比べ、自分の言葉で説明します。</p></div></div>
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

function renderLecturePractice(practiceId, snapshot) {
  const practice = PRACTICE_BY_ID.get(practiceId);
  if (!practice) return `<div class="info-strip danger"><span>!</span><div><strong>${escapeHTML(practiceId)}</strong> が見つかりません。lecture-plan.js のIDを確認してください。</div></div>`;
  const status = practiceStatus(practiceId, snapshot);
  const draft = snapshot.practiceDrafts?.[practice.id] ?? practice.starterCode;
  const editorId = `lecture-editor-${practice.id}`;
  return `<article class="lecture-practice-row">
    <div><span class="badge ${status.className}">${status.label}</span><h3>${escapeHTML(practice.title)}</h3><p>${escapeHTML(practice.prompt)}</p></div>
    <div class="button-row"><button class="button ghost small" type="button" data-action="show-hints" data-practice="${escapeAttribute(practice.id)}">段階的なヒント</button><button class="button ghost small" type="button" data-action="show-solution" data-practice="${escapeAttribute(practice.id)}">解答・解説</button><a class="button ghost small" href="#learn/${escapeAttribute(practice.lesson.id)}">関連する学習コース</a></div>
    ${registerEditor(editorId, draft, `${practice.id} · ${practice.title}`, { kind: "practice", practiceId: practice.id, lessonId: practice.lesson.id, defaultCode: practice.starterCode, filename: `${practice.id}.py` })}
    <div data-practice-feedback="${escapeAttribute(practice.id)}"></div>
  </article>`;
}

function renderMaterialRef(ref) {
  const material = MATERIALS[ref.materialId];
  if (!material) return `<div class="info-strip danger"><span>!</span><div>資料ID ${escapeHTML(ref.materialId)} が見つかりません。</div></div>`;
  const badge = material.access === "enrolled" ? "履修者限定" : "一般公開・PDF";
  return `<article class="card"><div class="card-body"><div class="tag-list"><span class="badge ${material.access === "enrolled" ? "warning" : "done"}">${badge}</span><span class="tag">${escapeHTML(material.type.toUpperCase())}</span></div><h3>${escapeHTML(material.title)}</h3><p>${escapeHTML(ref.coverage)}</p><p class="help-text">${escapeHTML(material.description)}</p>${material.access === "enrolled" ? `<div class="info-strip warning"><span>!</span><div>${escapeHTML(ENROLLED_NOTICE)}</div></div>` : ""}<a class="button secondary small" href="${escapeAttribute(material.url)}" target="_blank" rel="noopener noreferrer">講義資料を開く：${escapeHTML(material.title)} ↗</a></div></article>`;
}

function renderApplication(example, topicId) {
  if (!example) return "";
  return `<article class="card"><div class="card-body"><div class="eyebrow">任意の応用例 · ${escapeHTML(topicId)}</div><h3>${escapeHTML(example.app)}：${escapeHTML(example.lesson)}</h3><dl class="application-guide"><dt>学んだ文法との関係</dt><dd>${escapeHTML(example.relation)}</dd><dt>実行前の予想</dt><dd>${escapeHTML(example.prediction)}</dd><dt>変更する箇所</dt><dd>${escapeHTML(example.change)}</dd><dt>観察する結果</dt><dd>${escapeHTML(example.observe)}</dd><dt>開き方</dt><dd>${escapeHTML(example.steps)}</dd></dl><a class="button secondary small" href="${escapeAttribute(example.url)}" target="_blank" rel="noopener noreferrer">アプリを開く ↗</a><p class="help-text">外部アプリを開くことは必修問題の完了条件ではありません。アプリ固有の音声・描画機能はPython標準機能ではありません。</p></div></article>`;
}

function renderLectureIndex() {
  const snapshot = store.snapshot();
  appView.innerHTML = `
    ${pageHeader({ eyebrow: "LECTURE COMPANION", title: "講義補助モード", description: "Colabで学んだ直後に、その回の要点を振り返り、必修問題だけを練習します。詳しい自習用解説は通常モードに残っています。", actions: '<a class="button secondary" href="#learn">通常モードへ</a>' })}
    <div class="info-strip"><span aria-hidden="true">↗</span><div><strong>授業 → 振り返り → 練習</strong><br>各回のカードからnotebookを別タブで開くか、振り返りと必修練習をまとめた画面へ進んでください。</div></div>
    <section class="section"><div class="card-grid lecture-session-grid">
      ${LECTURE_PLAN.map((plan) => {
        const progress = lectureProgress(plan, snapshot);
        return `<article class="card lecture-session-card"><div class="card-body">
          <div class="session-card-header"><span class="session-number">${plan.sessionId}</span><span class="badge ${progress.className}">${progress.label}</span></div>
          <h2>${escapeHTML(plan.title)}</h2><p>${progress.passed} / ${progress.total} 問合格</p>
          <div class="progress-track"><span style="width:${Math.round(progress.passed / Math.max(1, progress.total) * 100)}%"></span></div>
          <p>${plan.topics.length}トピックから、今日扱った範囲だけを選べます。</p><div class="button-row"><a class="button primary small" href="#lecture/${plan.sessionId}">トピックを選ぶ</a></div>
        </div></article>`;
      }).join("")}
    </div></section>`;
}

function renderLectureSession(plan, route) {
  const snapshot = store.snapshot();
  const progress = lectureProgress(plan, snapshot);
  const requested = (route.params.get("topics") || "").split(",").filter(Boolean);
  const topicIds = new Set(plan.topics.map(({ id }) => id));
  const invalid = requested.filter((id) => !topicIds.has(id));
  const selected = requested.length ? plan.topics.filter(({ id }) => requested.includes(id)) : plan.topics;
  const shareHash = `#lecture/${plan.sessionId}?topics=${selected.map(({ id }) => encodeURIComponent(id)).join(",")}`;
  appView.innerHTML = `
    ${pageHeader({ eyebrow: `LECTURE COMPANION · 区分 ${plan.sessionId}`, title: plan.title, description: "区分番号は実際の授業日や全14回の回数とは別です。今日扱ったトピックだけを選んで復習できます。", breadcrumb: '<a href="#lecture">講義補助モード</a><span>›</span><span>今日の復習</span>', actions: `<button class="button secondary" type="button" data-action="copy-topic-url" data-url="${escapeAttribute(shareHash)}">選択範囲のURLをコピー</button>` })}
    ${invalid.length ? `<div class="info-strip danger"><span>!</span><div><strong>指定されたトピックが見つかりません。</strong><br>${invalid.map(escapeHTML).join("、")}。無関係な問題へは切り替えていません。下から有効なトピックを選んでください。</div></div>` : ""}
    <section class="card section"><div class="card-body"><h2>今日学んだトピックを選ぶ</h2><p>複数選択できます。選択状態を含むURLをClassroomなどで共有できます。</p><div class="topic-picker">${plan.topics.map(({ id }) => { const lesson = LESSON_BY_ID.get(id); return `<label><input type="checkbox" data-topic-choice value="${escapeAttribute(id)}" ${selected.some((item) => item.id === id) ? "checked" : ""}> ${escapeHTML(lesson?.title || id)}</label>`; }).join("")}</div><button class="button primary small" type="button" data-action="apply-topics" data-session="${plan.sessionId}">選んだ範囲を表示</button></div></section>
    <div class="lecture-status"><span class="badge ${progress.className}">${progress.label}</span><strong>${progress.passed} / ${progress.total} 問合格</strong><div class="progress-track"><span style="width:${Math.round(progress.passed / Math.max(1, progress.total) * 100)}%"></span></div></div>
    ${selected.map((topicConfig) => { const lesson = LESSON_BY_ID.get(topicConfig.id); const knowledge = (POST_STUDY[topicConfig.id] || []).filter(({ kind }) => kind === "knowledge").slice(0, 2); return lesson ? `<section class="section topic-review"><div class="eyebrow">TOPIC · ${escapeHTML(topicConfig.id)}</div><h2>${escapeHTML(lesson.title)}</h2><section class="card"><div class="card-body"><h3>① 今日のまとめ</h3><ul class="objective-list">${lesson.objectives.slice(0, 5).map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul></div></section><section><h3>② 思い出してみよう</h3><div class="reflection-grid">${knowledge.map((card) => `<article class="card reflection-card"><div class="card-body"><h4>${escapeHTML(card.title)}</h4><p>${escapeHTML(card.prompt)}</p><details><summary>ヒント</summary><p>${escapeHTML(card.hint)}</p></details><details><summary>自己確認用の解答例</summary><p>${escapeHTML(card.answer)}</p></details></div></article>`).join("")}</div></section><section><h3>③ 自分で書いて確かめよう</h3><p>入力、実行、答え合わせ、ヒント、解説をこの画面で利用できます。</p><div class="lecture-practice-list">${lesson.practices.map(({ id }) => renderLecturePractice(id, snapshot)).join("")}</div></section><section class="card"><div class="card-body"><h3>④ 最後の確認</h3><p>${escapeHTML(lesson.predictPrompt)}</p><p class="help-text">値や入力を1つ変え、結果を予想してから再実行してください。変更後のコードは再度答え合わせが必要です。</p></div></section><section><h3>⑤ 必要な人向けのリンク</h3><p><a class="button ghost small" href="#learn/${escapeAttribute(lesson.id)}">対応する学習コース</a></p><div class="card-grid">${topicConfig.materialRefs.map(renderMaterialRef).join("")}${renderApplication(topicConfig.application, topicConfig.id)}</div></section></section>` : ""; }).join("")}`;
}

function renderLecture(route) {
  const sessionId = Number(route.segments[1]);
  if (!sessionId) return renderLectureIndex();
  const plan = LECTURE_PLAN.find((item) => Number(item.sessionId) === sessionId);
  if (!plan) return renderNotFound();
  renderLectureSession(plan, route);
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
      description: `全${LESSONS.length} lesson。変数・出力から始め、データ構造、反復、分岐、関数を経て、オブジェクト、NumPy、データ解析、可視化へ進みます。`,
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
            ${selectedSession ? '<a class="button ghost small" href="#learn">全回を表示</a>' : `<a class="button ghost small" href="#practice?session=${session.id}">この回の練習へ</a>`}
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

function renderExampleActivity(activity, saved = {}) {
  const predictionChecked = saved.predictionChecked;
  const changeLabel = activity.changeCheck ? "指定された変更課題" : "自由に変更して試す活動";
  return `<section class="example-activity" data-example-activity="${escapeAttribute(activity.id)}">
    <div class="eyebrow">理解確認 · ${escapeHTML(activity.id)}</div>
    <ol class="activity-flow"><li><strong>① 予想する</strong><p>${escapeHTML(activity.question)}</p><input class="input" data-example-prediction="${escapeAttribute(activity.id)}" value="${escapeAttribute(saved.prediction || "")}" placeholder="実行前の予想"></li>
    <li><strong>② 実行する</strong><p>例題をエディタへ読み込み、実行してください。実行できたことと理解できたことは別々に記録されます。</p></li>
    <li><strong>③ 答えを確認する</strong><div class="button-row"><button class="button ghost small" type="button" data-action="check-example-prediction" data-activity="${escapeAttribute(activity.id)}">予想を答え合わせ</button></div>
      <div data-example-prediction-feedback>${predictionChecked ? `<div class="practice-feedback ${saved.predictionCorrect ? "pass" : "fail"}"><strong>${saved.predictionCorrect ? "予想が合っていました" : "予想を見直しましょう"}</strong></div>` : ""}</div>
      <details><summary>段階的なヒント 1</summary><p>${escapeHTML(activity.hints[0])}</p><details><summary>ヒント 2</summary><p>${escapeHTML(activity.hints[1] || activity.hints[0])}</p></details></details>
      <details><summary>期待される結果と解説</summary><p><strong>${escapeHTML(activity.expected)}</strong></p><p>${escapeHTML(activity.explanation)}</p></details>
      <label class="self-check"><input type="checkbox" data-example-reason="${escapeAttribute(activity.id)}" ${saved.reasonConfirmed ? "checked" : ""}> 解説の処理順を自分のコードと照合した</label></li>
    <li><strong>④ 少し変える（${changeLabel}）</strong><p>${escapeHTML(activity.changeTask)}</p><button class="button secondary small" type="button" data-action="start-example-change" data-activity="${escapeAttribute(activity.id)}">変更課題を始める</button></li>
    <li><strong>⑤ 変更後も確かめる</strong><div data-example-change-feedback>${saved.changeChecked ? `<div class="practice-feedback ${saved.changePassed ? "pass" : "fail"}"><strong>${saved.changePassed ? "変更課題を確認済み" : "変更課題を再確認"}</strong><br>${escapeHTML(saved.changeMessage || "")}</div>` : '<p class="help-text">変更したコードを実行すると、ここへ確認結果を表示します。</p>'}</div></li></ol>
    <div class="activity-status"><span>${saved.executed ? "✓ コード実行済み" : "○ コード未実行"}</span><span>${saved.reasonConfirmed ? "✓ 理由を自己確認済み" : "○ 理由は未確認"}</span></div>
  </section>`;
}

function renderLessonDetail(lesson) {
  const snapshot = store.snapshot();
  const done = snapshot.completedLessons.includes(lesson.id);
  const session = SESSION_BY_ID.get(Number(lesson.session));
  const study = SELF_STUDY[lesson.id];
  const explanation = LESSON_EXPLANATIONS[lesson.id];
  const postStudy = POST_STUDY[lesson.id] || [];
  const index = LESSONS.findIndex((item) => item.id === lesson.id);
  const previous = LESSONS[index - 1] ?? null;
  const next = LESSONS[index + 1] ?? null;
  const editorId = `lesson-editor-${lesson.id}`;
  const draft = snapshot.lessonDrafts[lesson.id] ?? lesson.starterCode;
  const prediction = snapshot.lessonPredictions[lesson.id] ?? "";
  const note = snapshot.lessonNotes[lesson.id] ?? "";
  const exit = snapshot.exitTickets[String(lesson.session)]?.text ?? "";
  const lessonView = snapshot.settings.lessonView === "compact" ? "compact" : "full";
  const walkthroughActivity = study ? exampleActivity(lesson, "walkthrough", 0, study.walkthrough) : null;

  appView.innerHTML = `
    ${pageHeader({
      eyebrow: `SESSION ${lesson.session} · LESSON ${String(lessonNumber(lesson)).padStart(2, "0")}`,
      title: lesson.title,
      description: lesson.subtitle,
      breadcrumb: `<a href="#learn">学習コース</a><span>›</span><a href="#learn?session=${lesson.session}">${escapeHTML(session.title)}</a><span>›</span><span>${escapeHTML(lesson.title)}</span>`,
      actions: `<div class="button-row"><button class="button secondary" type="button" data-action="toggle-lesson-view">${lessonView === "compact" ? "詳しい解説を表示" : "Compact View"}</button><button class="button ${done ? "success" : "primary"}" type="button" data-action="toggle-lesson" data-lesson="${escapeAttribute(lesson.id)}">${done ? "✓ 完了済み" : "lessonを完了にする"}</button></div>`,
    })}

    <div class="lesson-layout" data-lesson-view="${lessonView}">
      <article class="lesson-content">
        <div class="tag-list">${trackBadge(lesson)}<span class="tag">${lesson.minutes}分目安</span>${lesson.keywords.map((keyword) => `<span class="tag">${escapeHTML(keyword)}</span>`).join("")}</div>

        <section class="section">
          <div class="card study-start-card"><div class="card-body">
            <div class="eyebrow">このlessonのゴール</div>
            <ul class="objective-list">${lesson.objectives.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>
            <div class="study-route" aria-label="このlessonの進め方">
              <span>解説を読む</span><b>→</b><span>例題を入力</span><b>→</b><span>結果を予想</span><b>→</b><span>練習する</span><b>→</b><span>説明する</span>
            </div>
          </div></div>
        </section>

        ${study ? `
        <section class="section long-explanation">
          <div class="section-heading"><div><h2>1. 自習用ガイド</h2><p>授業を欠席したときや復習するときも、この順番で読み進められます。</p></div></div>
          <article class="study-intro">
            ${study.lead.map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join("")}
          </article>
          ${explanation ? `
          <article class="card deep-explanation-card"><div class="card-body">
            <div class="eyebrow">考え方をつかむ</div>
            ${explanation.overview.map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join("")}
            <div class="syntax-anatomy-grid">
              ${explanation.anatomy.map((item) => `<div class="syntax-anatomy-item"><code>${escapeHTML(item.part)}</code><p>${escapeHTML(item.meaning)}</p></div>`).join("")}
            </div>
          </div></article>
          <article class="card trace-card"><div class="card-body">
            <div class="eyebrow">処理を追跡する</div>
            <h3>${escapeHTML(explanation.trace.title)}</h3>
            ${codeBlock(explanation.trace.code)}
            <div class="table-wrap"><table class="data-table trace-table"><thead><tr><th>段階</th><th>状態・出力</th><th>何が起きたか</th></tr></thead><tbody>
              ${explanation.trace.rows.map((row) => `<tr><td>${escapeHTML(row[0])}</td><td><code>${escapeHTML(row[1])}</code></td><td>${escapeHTML(row[2])}</td></tr>`).join("")}
            </tbody></table></div>
            <div class="learning-checklist"><strong>実行前後に確認すること</strong><ul>${explanation.checklist.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul></div>
          </div></article>` : ""}
          <div class="study-rule-grid">
            ${study.grammar.map((rule, ruleIndex) => `
              <article class="card study-rule-card">
                <div class="card-body">
                  <div class="study-rule-number">${ruleIndex + 1}</div>
                  <h3>${escapeHTML(rule.title)}</h3>
                  <div class="study-pattern"><code>${escapeHTML(rule.pattern)}</code></div>
                  <p>${escapeHTML(rule.body)}</p>
                  ${rule.code ? codeBlock(rule.code) : ""}
                </div>
              </article>
            `).join("")}
          </div>
          <article class="card walkthrough-card">
            <div class="card-body">
              <div class="eyebrow">一行ずつ読む例題</div>
              <h3>${escapeHTML(study.walkthrough.title)}</h3>
              ${codeBlock(study.walkthrough.code)}
              <ol class="walkthrough-steps">${study.walkthrough.steps.map((step) => `<li>${escapeHTML(step)}</li>`).join("")}</ol>
              <div class="try-callout"><strong>少し変えて試す：</strong>${escapeHTML(study.walkthrough.try)}</div>
              <button class="button secondary small" type="button" data-action="load-study-code" data-lesson="${escapeAttribute(lesson.id)}" data-editor="${escapeAttribute(editorId)}">例題を右のエディタへ</button>
              ${renderExampleActivity(walkthroughActivity, snapshot.exampleActivities[walkthroughActivity.id])}
            </div>
          </article>
          <div class="checkpoint-list">
            ${study.checkpoints.map((item, itemIndex) => `
              <details class="card concept-card">
                <summary>理解確認 ${itemIndex + 1}. ${escapeHTML(item.q)}</summary>
                <div class="concept-content"><p><strong>答え：</strong>${escapeHTML(item.a)}</p></div>
              </details>
            `).join("")}
          </div>
        </section>` : ""}

        <section class="section long-explanation">
          <div class="section-heading"><div><h2>2. 文法のしくみ</h2><p>要点を開き、説明とコードを対応させて確認します。</p></div></div>
          ${lesson.concepts.map((concept, conceptIndex) => `
            <details class="card concept-card" ${conceptIndex === 0 ? "open" : ""}>
              <summary>${escapeHTML(concept.title)}</summary>
              <div class="concept-content"><p>${escapeHTML(concept.body)}</p>${concept.code ? codeBlock(concept.code) : ""}</div>
            </details>
          `).join("")}
        </section>

        <section class="section">
          <div class="section-heading"><div><h2>3. 例題を入力して試す</h2><p>授業では一緒に入力します。自習ではコードを読み、出力を予想してからエディタへ読み込みます。</p></div></div>
          ${lesson.liveCoding.map((step, stepIndex) => { const activity = exampleActivity(lesson, "live", stepIndex, step); return `
            <article class="live-step">
              <h3>${stepIndex + 1}. ${escapeHTML(step.title)}</h3>
              <p>${escapeHTML(step.instruction)}</p>
              <div class="predict-callout"><strong>実行前の予想：</strong> ${escapeHTML(step.predict)}</div>
              ${codeBlock(step.code)}
              <button class="button secondary small" type="button" data-action="load-live-code" data-lesson="${escapeAttribute(lesson.id)}" data-index="${stepIndex}" data-editor="${escapeAttribute(editorId)}">この例題を右のエディタへ</button>
              ${renderExampleActivity(activity, snapshot.exampleActivities[activity.id])}
            </article>
          `; }).join("")}
        </section>

        <section class="section">
          <div class="section-heading"><div><h2>4. 実行前に予想する</h2><p>${escapeHTML(lesson.predictPrompt)}</p></div></div>
          <textarea class="textarea" data-save="prediction" data-lesson="${escapeAttribute(lesson.id)}" placeholder="実行する前に、出力や変数の変化を予想し、その理由を書きます。">${escapeHTML(prediction)}</textarea>
        </section>

        <section class="section">
          <div class="section-heading"><div><h2>5. 練習問題</h2><p>短い変数名と小さな課題から始めます。開始コードを開き、まず自分で1〜3行を書き足してみましょう。</p></div></div>
          <div class="lesson-list">
            ${lesson.practices.map((practice) => {
              const attempt = snapshot.practiceAttempts[practice.id];
              return `
                <article class="card practice-card"><div class="card-body">
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

        <section class="section post-study-section">
          <div class="section-heading"><div><h2>6. 事後学習：問題を解いて定着させる</h2><p>最初に自力で答え、必要なときだけヒントを開きます。知識確認の後、実際にコードを書いて自動判定まで行います。</p></div></div>
          <div class="post-study-progress"><span>知識問題 ${postStudy.filter((task) => task.kind === "knowledge").length}問</span><span>コード問題 ${postStudy.filter((task) => task.kind === "code").length}問</span><span>ヒント・解答例あり</span></div>
          <div class="post-study-list">
            ${postStudy.map((task, taskIndex) => {
              if (task.kind === "knowledge") {
                const savedAnswer = snapshot.postStudyAnswers?.[task.id] ?? "";
                return `<article class="card post-study-card knowledge-task"><div class="card-body">
                  <div class="question-heading"><span>定着問題 ${taskIndex + 1}</span><span>知識・説明</span></div>
                  <h3>${escapeHTML(task.title)}</h3>
                  <p>${escapeHTML(task.prompt)}</p>
                  <label class="form-field"><span>自分の答え</span><textarea class="textarea compact-answer" data-save="post-study-answer" data-task="${escapeAttribute(task.id)}" placeholder="まず資料を閉じ、自分の言葉で答えます。">${escapeHTML(savedAnswer)}</textarea></label>
                  <div class="reveal-grid">
                    <details><summary>ヒントを見る</summary><p>${escapeHTML(task.hint)}</p></details>
                    <details><summary>解答例を見る</summary><p>${escapeHTML(task.answer)}</p></details>
                  </div>
                </div></article>`;
              }
              const attempt = snapshot.practiceAttempts[task.id];
              return `<article class="card post-study-card code-task"><div class="card-body">
                <div class="question-heading"><span>定着問題 ${taskIndex + 1}</span><span>コードを書く · ${attempt?.passed ? "合格済み" : "未合格"}</span></div>
                <h3>${escapeHTML(task.title)}</h3>
                <p>${escapeHTML(task.prompt)}</p>
                <div class="button-row">
                  <button class="button primary small" type="button" data-action="load-practice" data-practice="${escapeAttribute(task.id)}" data-editor="${escapeAttribute(editorId)}">開始コードを開く</button>
                  <button class="button ghost small" type="button" data-action="show-hints" data-practice="${escapeAttribute(task.id)}">ヒント</button>
                  <button class="button ghost small" type="button" data-action="show-solution" data-practice="${escapeAttribute(task.id)}">解答例</button>
                </div>
                <div data-practice-feedback="${escapeAttribute(task.id)}"></div>
              </div></article>`;
            }).join("")}
          </div>
          <details class="optional-note card"><summary>質問・振り返りメモ（任意）</summary><div class="card-body">
            <p>疑問点、試した変更、次回確認したいことがある場合だけ記録します。事後学習の中心は上の問題演習です。</p>
            <textarea class="textarea" data-save="lesson-note" data-lesson="${escapeAttribute(lesson.id)}" placeholder="例：append()が元のlistを変更する点は分かったが、sort()との違いを次回確認したい。">${escapeHTML(note)}</textarea>
          </div></details>
        </section>

        <section class="section">
          <div class="section-heading"><div><h2>よくあるエラー</h2><p>エラー名、行番号、原因候補の順に読み、1か所ずつ修正します。</p></div></div>
          <div class="table-wrap"><table class="data-table"><thead><tr><th>症状</th><th>主な原因</th><th>確認・修正</th></tr></thead><tbody>
            ${lesson.commonErrors.map((item) => `<tr><td><code>${escapeHTML(item.symptom)}</code></td><td>${escapeHTML(item.cause)}</td><td>${escapeHTML(item.fix)}</td></tr>`).join("")}
          </tbody></table></div>
        </section>

        <section class="section">
          <div class="card"><div class="card-body">
            <div class="eyebrow">学習メモ · 第${lesson.session}回</div>
            <p>自分で変更した値やコードと、その結果を一文で残しましょう。</p>
            <textarea class="textarea" data-save="exit" data-session="${lesson.session}" placeholder="例：rangeの刻み幅を2へ変えると、偶数だけが表示された。">${escapeHTML(exit)}</textarea>
          </div></div>
        </section>

        <nav class="section button-row" aria-label="lesson間の移動">
          ${previous ? `<a class="button secondary" href="#learn/${escapeAttribute(previous.id)}">← ${escapeHTML(previous.title)}</a>` : ""}
          <span style="flex:1"></span>
          ${next ? `<a class="button primary" href="#learn/${escapeAttribute(next.id)}">${escapeHTML(next.title)} →</a>` : `<a class="button primary" href="#practice">練習問題を選ぶ →</a>`}
        </nav>
      </article>

      <aside class="workspace-column">
        ${registerEditor(editorId, draft, "Python実習エディタ", { kind: "lesson", lessonId: lesson.id, filename: `${lesson.id}.py` })}
        <div class="info-strip warning" style="margin-top:12px"><span aria-hidden="true">?</span><div><strong>迷ったら、いったん小さく戻ります。</strong><br>①エラーの最後を読む　②行番号を見る　③途中の値をprintする　④1か所だけ変えて再実行します。</div></div>
        <div class="card" style="margin-top:12px"><div class="card-body"><div class="eyebrow">このlessonのキーワード</div><div class="tag-list" style="margin-top:8px">${lesson.keywords.map((word) => `<span class="tag">${escapeHTML(word)}</span>`).join("")}</div></div></div>
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
  const routedSession = route.params.get("session");
  if (routedSession && COURSE_CONTENT.sessions.some((session) => String(session.id) === routedSession)) {
    practiceFilters.session = routedSession;
  }
  const requested = route.params.get("item");
  if (requested && PRACTICE_BY_ID.has(requested)) currentPracticeId = requested;
  const items = filteredPractices();
  if (!items.some((item) => item.id === currentPracticeId)) currentPracticeId = items[0]?.id ?? null;
  const practice = currentPracticeId ? PRACTICE_BY_ID.get(currentPracticeId) : null;
  const snapshot = store.snapshot();
  const editorId = "practice-editor";
  const practiceDraft = practice ? snapshot.practiceDrafts?.[practice.id] : null;

  appView.innerHTML = `
    ${pageHeader({
      eyebrow: "PRACTICE",
      title: "練習問題",
      description: `全${PRACTICES.length}問から選び、コードを実行して自動判定します。合格判定は出力と必要な構文の最低条件を確認するもので、唯一の書き方を強制しません。`,
    })}
    <div class="filter-bar">
      <label class="form-field"><span>回</span><select class="select" id="practiceSessionFilter"><option value="all">すべて</option>${COURSE_CONTENT.sessions.map((session) => `<option value="${session.id}" ${practiceFilters.session === String(session.id) ? "selected" : ""}>第${session.id}回 ${escapeHTML(session.title)}</option>`).join("")}</select></label>
      <label class="form-field"><span>難度</span><select class="select" id="practiceDifficultyFilter"><option value="all">すべて</option>${["基礎", "標準", "定着", "発展"].map((value) => `<option value="${value}" ${practiceFilters.difficulty === value ? "selected" : ""}>${value}</option>`).join("")}</select></label>
      <label class="form-field"><span>検索</span><input class="input" id="practiceQuery" value="${escapeAttribute(practiceFilters.query)}" placeholder="例：range、欠損値"></label>
      <span class="help-text">${items.length}問表示</span>
    </div>

    ${practice ? `
      <div class="practice-grid section">
        <nav class="practice-nav" aria-label="練習問題一覧">
          ${items.map((item) => {
            const attempt = snapshot.practiceAttempts[item.id];
            return `<button type="button" class="${item.id === practice.id ? "active" : ""}" data-action="select-practice" data-practice="${escapeAttribute(item.id)}"><strong>${escapeHTML(item.title)}</strong><br><small>第${item.lesson.session}回 · ${item.source === "post-study" ? "事後学習 · " : ""}${escapeHTML(item.difficulty)} ${attempt?.passed ? "· ✓合格" : ""}</small></button>`;
          }).join("")}
        </nav>
        <section>
          <div class="card"><div class="card-body">
            <div class="lesson-meta"><span class="badge core">第${practice.lesson.session}回</span>${practice.source === "post-study" ? `<span class="badge advanced">事後学習</span>` : ""}<span class="badge ${snapshot.practiceAttempts[practice.id]?.passed ? "done" : "warning"}">${snapshot.practiceAttempts[practice.id]?.passed ? "合格済み" : escapeHTML(practice.difficulty)}</span><span>${snapshot.practiceAttempts[practice.id]?.attempts ?? 0}回実行</span></div>
            <h2>${escapeHTML(practice.title)}</h2>
            <p>${escapeHTML(practice.prompt)}</p>
            <div class="button-row" style="margin-top:12px"><button class="button ghost small" type="button" data-action="show-hints" data-practice="${escapeAttribute(practice.id)}">ヒント</button><button class="button ghost small" type="button" data-action="show-solution" data-practice="${escapeAttribute(practice.id)}">解答例</button><a class="button ghost small" href="#learn/${escapeAttribute(practice.lesson.id)}">対応lesson</a></div>
            <div data-practice-feedback="${escapeAttribute(practice.id)}"></div>
          </div></div>
          <div class="draft-notice">${practiceDraft == null ? "入力内容はこの問題ごとに自動保存されます。" : "この問題の保存済み下書きを復元しました。"}</div>
          <div style="margin-top:10px">${registerEditor(editorId, practiceDraft ?? practice.starterCode, `${practice.id} · ${practice.title}`, { kind: "practice", practiceId: practice.id, lessonId: practice.lesson.id, defaultCode: practice.starterCode, filename: `${practice.id}.py` })}</div>
        </section>
      </div>
    ` : `<div class="empty-state"><h2>条件に一致する練習問題がありません</h2><button class="button primary" type="button" data-action="reset-practice-filter">絞り込みを解除</button></div>`}
  `;
}

function renderLibrary() {
  const query = "";
  const groups = [
    { title: "Pythonの第一歩", note: "変数、出力、文字列、データ構造", ids: ["01-variables", "02-print", "03-fstrings", "04-list", "05-dict", "06-tuple", "07-methods"] },
    { title: "計算と処理の流れ", note: "数学関数、反復、条件分岐、関数", ids: ["08-math", "09-range", "10-for", "11-conditions", "12-if", "13-for-if", "14-def", "15-decompose-debug", "16-integrated"] },
    { title: "オブジェクトとclass", note: "参照、コピー、instance、method", ids: ["17-objects-memory", "18-class-oop"] },
    { title: "NumPyとデータ処理", note: "配列、ベクトル化、抽出、入出力、欠損値", ids: ["19-numpy-array", "20-numpy-index-ufunc", "21-data-io", "22-missing-save"] },
    { title: "可視化", note: "折れ線、散布図、ヒストグラム、軸と単位", ids: ["23-matplotlib"] },
  ];
  appView.innerHTML = `
    ${pageHeader({ eyebrow: "REFERENCE", title: "資料・用語集", description: "文法を忘れたときに、学習マップ、最小コード、用語から必要なlessonへ戻れます。" })}
    <section class="section">
      <div class="section-heading"><div><h2>テーマ別の学習マップ</h2><p>目的に近いテーマを選び、対応するlessonを開いてください。</p></div></div>
      <div class="card-grid">
        ${groups.map((group) => `<article class="card"><div class="card-body"><h3>${escapeHTML(group.title)}</h3><p>${escapeHTML(group.note)}</p><div class="learning-map-links">${group.ids.map((id) => { const lesson = LESSON_BY_ID.get(id); return `<a href="#learn/${escapeAttribute(id)}"><span>${String(lessonNumber(lesson)).padStart(2, "0")}</span>${escapeHTML(lesson.title)}</a>`; }).join("")}</div></div></article>`).join("")}
      </div>
    </section>
    <section class="section">
      <div class="section-heading"><div><h2>チートシート</h2><p>丸暗記せず、必要な形を見つけて自分の値へ書き換えます。</p></div></div>
      <div class="cheatsheet-grid">${COURSE_CONTENT.cheatsheet.map((item) => `<article class="card"><div class="card-body"><h3>${escapeHTML(item.title)}</h3>${codeBlock(item.code)}</div></article>`).join("")}</div>
    </section>
    <section class="section">
      <div class="section-heading"><div><h2>用語集</h2><p>Pythonの用語や英語のエラーメッセージを調べられます。</p></div><label class="form-field"><span class="sr-only">用語検索</span><input class="input" id="glossaryQuery" value="${escapeAttribute(query)}" placeholder="例：引数、slice、dtype"></label></div>
      <dl class="glossary-grid" id="glossaryGrid">${COURSE_CONTENT.glossary.map(([term, definition]) => `<div class="glossary-entry" data-glossary="${escapeAttribute(canonicalAnswer(`${term} ${definition}`))}"><dt>${escapeHTML(term)}</dt><dd>${escapeHTML(definition)}</dd></div>`).join("")}</dl>
    </section>
  `;
}

function renderProgress() {
  const snapshot = store.snapshot();
  const progress = overallProgress(snapshot);
  const passed = Object.values(snapshot.practiceAttempts).filter((item) => item?.passed).length;
  const drafts = Object.values(snapshot.lessonDrafts).filter((value) => String(value || "").trim()).length;

  appView.innerHTML = `
    ${pageHeader({ eyebrow: "PROGRESS", title: "進捗・保存", description: "lessonの完了、練習の合格、コード下書きを確認し、この端末の学習データをバックアップできます。" })}
    <section class="card"><div class="card-body">
      <div class="metric-grid">
        <div class="metric"><strong>${progress.count}/${progress.total}</strong><span>lesson完了</span></div>
        <div class="metric"><strong>${passed}/${PRACTICES.length}</strong><span>練習合格</span></div>
        <div class="metric"><strong>${drafts}</strong><span>コード下書き</span></div>
        <div class="metric"><strong>${escapeHTML(formatDateTime(snapshot.updatedAt))}</strong><span>最終保存</span></div>
      </div>
      <div class="progress-track" style="margin-top:14px"><span style="width:${progress.percent}%"></span></div>
    </div></section>

    <section class="section card"><div class="card-body">
      <div class="section-heading"><div><h2>表示設定</h2><p>読みやすい配色と文字サイズを選べます。</p></div></div>
      <form id="settingsForm" class="form-grid">
        <label class="form-field"><span>配色</span><select class="select" name="theme"><option value="dark" ${snapshot.settings.theme === "dark" ? "selected" : ""}>ダーク</option><option value="light" ${snapshot.settings.theme === "light" ? "selected" : ""}>ライト</option></select></label>
        <label class="form-field"><span>文字倍率</span><select class="select" name="fontScale">${[0.9, 1, 1.1, 1.2].map((value) => `<option value="${value}" ${Number(snapshot.settings.fontScale) === value ? "selected" : ""}>${Math.round(value * 100)}%</option>`).join("")}</select></label>
        <div class="form-field full"><button class="button primary" type="submit">設定を保存</button></div>
      </form>
    </div></section>

    <section class="section">
      <div class="section-heading"><div><h2>lesson完了一覧</h2><p>自分で説明できるようになったlessonへチェックを付けます。</p></div></div>
      <div class="completion-grid">${LESSONS.map((lesson) => `<label class="completion-item"><input type="checkbox" data-action="progress-lesson" data-lesson="${escapeAttribute(lesson.id)}" ${snapshot.completedLessons.includes(lesson.id) ? "checked" : ""}><span><strong>${String(lessonNumber(lesson)).padStart(2, "0")}. ${escapeHTML(lesson.title)}</strong><br><small class="help-text">第${lesson.session}回 · ${lesson.minutes}分</small></span></label>`).join("")}</div>
    </section>

    <section class="section card"><div class="card-body">
      <div class="section-heading"><div><h2>バックアップと初期化</h2><p>コード下書き、予想、メモ、練習履歴をJSONへ保存し、別の端末で読み込めます。</p></div></div>
      <div class="button-row"><button class="button primary" type="button" data-action="export-progress">進捗JSONを書き出す</button><label class="button secondary" for="progressImportFile">進捗JSONを読み込む</label><input class="sr-only" id="progressImportFile" type="file" accept="application/json,.json"><button class="button danger" type="button" data-action="reset-progress">この端末の進捗を初期化</button></div>
    </div></section>
  `;
}

function renderAbout() {
  appView.innerHTML = `
    ${pageHeader({ eyebrow: "ABOUT", title: "LAVi-SPICAについて", description: "Structured Python Interactive Course and Activities。コードを書き、動かし、結果を確かめながら学ぶPython基礎学習アプリです。" })}
    <div class="card-grid">
      <article class="card"><div class="card-body"><div class="eyebrow">LEARN</div><h3>${LESSONS.length} lesson</h3><p>変数、データ構造、for、if、関数から、NumPyとMatplotlibまで順に学びます。</p></div></article>
      <article class="card"><div class="card-body"><div class="eyebrow">PRACTICE</div><h3>${PRACTICES.length} exercises</h3><p>短い開始コード、段階的なヒント、解答例、自動確認を使って練習できます。</p></div></article>
      <article class="card"><div class="card-body"><div class="eyebrow">PYTHON</div><h3>ブラウザで実行</h3><p>Pythonを端末へインストールせず、WebAssembly版PythonのPyodideでコードを実行します。</p></div></article>
      <article class="card"><div class="card-body"><div class="eyebrow">SAVE</div><h3>端末内へ自動保存</h3><p>進捗、下書き、予想、メモ、練習履歴は、利用中のブラウザに保存されます。</p></div></article>
    </div>
    <section class="section">
      <div class="section-heading"><div><h2>学び方</h2></div></div>
      <div class="card"><div class="card-body"><ol class="walkthrough-steps">
        <li>自習用ガイドを読み、文法の形と意味を確認します。</li>
        <li>例題の出力を予想し、エディタへ読み込んで実行します。</li>
        <li>数値や文字列を1か所だけ変え、結果の違いを観察します。</li>
        <li>練習問題へ取り組み、必要なときだけヒントを開きます。</li>
        <li>最後に、コードが何をしているかを自分の言葉で説明します。</li>
      </ol></div></div>
    </section>
    <section class="section">
      <div class="section-heading"><div><h2>動作と保存</h2></div></div>
      <div class="card"><div class="card-body"><ul class="clean-list">
        <li>初回のPython実行時にはインターネット接続が必要です。NumPyやMatplotlibも必要になったときに準備されます。</li>
        <li>コードはブラウザの別スレッドで実行され、長時間停止しない処理は安全のため中断されます。</li>
        <li><code>input()</code>は使用せず、入力値はコード内の変数へ代入します。</li>
        <li>学習データはサーバーへ自動送信されません。ブラウザデータを削除すると消えるため、必要に応じて進捗JSONを書き出してください。</li>
      </ul></div></div>
    </section>
    <section class="section card"><div class="card-body"><div class="eyebrow">LICENSE</div><h2>MIT License</h2><p>ソースコードと教材はMIT Licenseの条件で利用できます。</p></div></section>
  `;
}

function renderNotFound() {
  appView.innerHTML = `<div class="empty-state"><h1>ページが見つかりません</h1><p>URLのハッシュ部分を確認してください。</p><a class="button primary" href="#dashboard">ホームへ戻る</a></div>`;
}

function renderRoute() {
  editorContexts = new Map();
  editorResults = new Map();
  currentRoute = parseHashRoute();
  setActiveNavigation(currentRoute);
  closeMobileMenu();

  switch (currentRoute.name) {
    case "dashboard": renderDashboard(); break;
    case "lecture": renderLecture(currentRoute); break;
    case "learn": renderLearn(currentRoute); break;
    case "practice": renderPractice(currentRoute); break;
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

function codeFingerprint(code) {
  let hash = 2166136261;
  for (const character of String(code)) { hash ^= character.charCodeAt(0); hash = Math.imul(hash, 16777619); }
  return (hash >>> 0).toString(16);
}

function findExampleActivity(activityId) {
  for (const lesson of LESSONS) {
    if (`${lesson.id}-walkthrough` === activityId && SELF_STUDY[lesson.id]?.walkthrough) return exampleActivity(lesson, "walkthrough", 0, SELF_STUDY[lesson.id].walkthrough);
    const prefix = `${lesson.id}-live-`;
    if (activityId.startsWith(prefix)) {
      const index = Number(activityId.slice(prefix.length));
      if (lesson.liveCoding[index]) return exampleActivity(lesson, "live", index, lesson.liveCoding[index]);
    }
  }
  return null;
}

function executableSource(code) {
  return String(code).replace(/#[^\n]*/g, "").replace(/(?:'''[\s\S]*?'''|\"\"\"[\s\S]*?\"\"\"|'(?:\\.|[^'\\])*'|\"(?:\\.|[^\"\\])*\")/g, "");
}

function evaluatePractice(practice, code, result) {
  if (result.error) return { passed: false, message: "Pythonエラーを解消してから、出力と条件を確認します。" };
  const check = practice.check || {};
  if (!Object.keys(check).length) return { passed: false, message: "この問題の採点条件が未設定のため、未判定です。解答例と確認観点で自己確認してください。", state: "unavailable" };
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
  const source = executableSource(code);
  for (const required of check.required || []) {
    const pattern = /^[A-Za-z_]\w*$/.test(required) ? new RegExp(`\\b${required}\\b`) : null;
    if (!(pattern ? pattern.test(source) : code.includes(required))) reasons.push(`実行するコードに必要な要素「${required}」が見つかりません（コメントや文字列に書くだけでは条件を満たしません）。`);
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
          codeHash: codeFingerprint(code),
          exerciseVersion: APP_VERSION,
        });
        updatePracticeFeedback(practice.id, evaluation);
      }
    }
    if (context.activityId) {
      const activity = findExampleActivity(context.activityId);
      const patch = { code, codeHash: codeFingerprint(code), executed: true, actualOutput: normalizeOutput(result.stdout), executionError: stripAnsi(result.error || "") };
      if (context.activityMode === "change" && activity) {
        const evaluation = activity.changeCheck
          ? evaluatePractice({ check: activity.changeCheck }, code, result)
          : { passed: true, message: "自由実験を実行しました。固定の模範出力とは比較せず、予想した変化と実際の結果を自分で比べてください。" };
        Object.assign(patch, { changeChecked: true, changePassed: evaluation.passed, changeMessage: evaluation.message });
        const feedback = document.querySelector(`[data-example-activity="${CSS.escape(activity.id)}"] [data-example-change-feedback]`);
        if (feedback) feedback.innerHTML = `<div class="practice-feedback ${evaluation.passed ? "pass" : "fail"}"><strong>${evaluation.passed ? "変更後を確認しました" : "変更課題を再確認"}</strong><br>${escapeHTML(evaluation.message)}</div>`;
      }
      store.setExampleActivity(context.activityId, patch);
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

async function loadCodeIntoEditor(editorId, code, contextPatch = {}, message = "コードを読み込みました") {
  const textarea = editorElement(editorId);
  const context = editorContexts.get(editorId);
  if (!textarea || !context) return;
  if (textarea.value !== context.defaultCode && textarea.value !== code) {
    const confirmed = await showConfirm({ title: "編集中のコードを置き換えますか", body: "<p>現在のコードには変更があります。下書きへ保存してから、別のコードでエディタを置き換えます。</p>", confirmLabel: "置き換える" });
    if (!confirmed) return;
  }
  if (context.practiceId) store.setPracticeDraft(context.practiceId, textarea.value);
  else if (context.kind === "lesson" && context.lessonId) store.setDraft(context.lessonId, textarea.value);
  textarea.value = code;
  editorContexts.set(editorId, { ...context, ...contextPatch, defaultCode: code });
  if (contextPatch.practiceId) store.setPracticeDraft(contextPatch.practiceId, code);
  else if (contextPatch.kind === "lesson" && contextPatch.lessonId) store.setDraft(contextPatch.lessonId, code);
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

async function handleClick(event) {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  if (action === "apply-topics") {
    const ids = [...document.querySelectorAll("[data-topic-choice]:checked")].map((input) => input.value);
    if (!ids.length) { toast("トピックを1つ以上選んでください", "未選択のまま全問題へ切り替えることはありません。", "error"); return; }
    location.hash = `lecture/${target.dataset.session}?topics=${ids.map(encodeURIComponent).join(",")}`;
    return;
  }
  if (action === "copy-topic-url") {
    await copyText(`${location.href.split("#")[0]}${target.dataset.url}`);
    toast("共有URLをコピーしました", "このURLでは同じトピック範囲が開きます。", "success");
    return;
  }
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
      if (context.practiceId) store.setPracticeDraft(context.practiceId, textarea.value);
      toast("開始コードへ戻しました", "", "info", 2200);
    }
    return;
  }
  if (action === "output-tab") {
    selectOutputTab(editorId, target.dataset.tab);
    return;
  }
  if (action === "load-study-code") {
    const lesson = LESSON_BY_ID.get(target.dataset.lesson);
    const code = SELF_STUDY[lesson?.id]?.walkthrough?.code;
    if (lesson && code) await loadCodeIntoEditor(editorId, code, { kind: "example", lessonId: lesson.id, practiceId: null, activityId: `${lesson.id}-walkthrough`, activityMode: "baseline", filename: `${lesson.id}-study.py` }, "一行ずつ読む例題を読み込みました");
    return;
  }
  if (action === "load-live-code") {
    const lesson = LESSON_BY_ID.get(target.dataset.lesson);
    const step = lesson?.liveCoding?.[Number(target.dataset.index)];
    if (step) await loadCodeIntoEditor(editorId, step.code, { kind: "example", lessonId: lesson.id, practiceId: null, activityId: `${lesson.id}-live-${Number(target.dataset.index)}`, activityMode: "baseline", filename: `${lesson.id}-live.py` }, `${step.title}を読み込みました`);
    return;
  }
  if (action === "check-example-prediction") {
    const activity = findExampleActivity(target.dataset.activity);
    const root = target.closest("[data-example-activity]");
    const prediction = root?.querySelector("[data-example-prediction]")?.value.trim() || "";
    if (!prediction) { toast("先に予想を入力してください", "同じ欄へ一度だけ入力すれば保存されます。", "error"); return; }
    const objective = activity && !activity.expected.startsWith("実行結果を");
    const correct = objective ? canonicalAnswer(prediction) === canonicalAnswer(activity.expected) : null;
    store.setExampleActivity(target.dataset.activity, { prediction, predictionChecked: true, predictionCorrect: correct });
    const feedback = root?.querySelector("[data-example-prediction-feedback]");
    if (feedback) feedback.innerHTML = objective
      ? `<div class="practice-feedback ${correct ? "pass" : "fail"}"><strong>${correct ? "予想が合っていました" : "予想を見直しましょう"}</strong><br>期待される答え：${escapeHTML(activity.expected)}</div>`
      : '<div class="practice-feedback"><strong>自己確認へ進みます</strong><br>実際の出力と解説を照合してください。この設問は自由記述のため自動採点しません。</div>';
    return;
  }
  if (action === "start-example-change") {
    const activity = findExampleActivity(target.dataset.activity);
    const lessonId = target.dataset.activity.split(/-(?=walkthrough|live)/)[0];
    const id = `lesson-editor-${lessonId}`;
    const textarea = editorElement(id);
    if (!activity || !textarea) return;
    const context = editorContexts.get(id) || {};
    editorContexts.set(id, { ...context, kind: "example", lessonId, practiceId: null, activityId: activity.id, activityMode: "change", defaultCode: activity.baselineCode });
    textarea.focus();
    toast("変更課題を開始しました", "コードを変更し、実行して確認してください。", "info");
    return;
  }
  if (action === "load-practice") {
    const practice = PRACTICE_BY_ID.get(target.dataset.practice);
    if (practice) {
      const savedCode = store.snapshot().practiceDrafts?.[practice.id];
      await loadCodeIntoEditor(editorId, savedCode ?? practice.starterCode, { kind: "practice", practiceId: practice.id, lessonId: practice.lesson.id, defaultCode: practice.starterCode, filename: `${practice.id}.py` }, savedCode == null ? `${practice.title}を読み込みました` : `${practice.title}の下書きを復元しました`);
    }
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
  if (action === "toggle-lesson-view") {
    const current = store.snapshot().settings.lessonView;
    store.setSetting("lessonView", current === "compact" ? "full" : "compact");
    renderRoute();
    return;
  }
  if (action === "select-practice") {
    const activeEditor = editorElement("practice-editor");
    const activeContext = editorContexts.get("practice-editor");
    if (activeEditor && activeContext?.practiceId) store.setPracticeDraft(activeContext.practiceId, activeEditor.value);
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
  if (action === "print-page") {
    window.print();
    return;
  }
  if (action === "export-progress") {
    const payload = { format: "lavi-spica-progress-v3", appVersion: APP_VERSION, exportedAt: new Date().toISOString(), state: store.snapshot() };
    downloadJSON(payload, `lavi-spica-progress-${new Date().toISOString().slice(0, 10)}.json`);
    return;
  }
  if (action === "reset-progress") {
    const confirmed = await showConfirm({ title: "進捗を初期化しますか", body: "<p>lesson完了、コード下書き、予想、メモ、練習履歴がこの端末から削除されます。元に戻せません。必要なら先に進捗JSONを書き出してください。</p>", confirmLabel: "初期化する", danger: true });
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

function handleInput(event) {
  const target = event.target;
  if (target.matches('textarea[data-editor]')) {
    const editorId = target.dataset.editor;
    const context = editorContexts.get(editorId);
    if (context?.kind === "lesson" && context.lessonId && !context.practiceId) saveDraftDebounced(context.lessonId, target.value);
    if (context?.practiceId) savePracticeDraftDebounced(context.practiceId, target.value);
    if (context?.practiceId) {
      document.querySelectorAll(`[data-practice-feedback="${CSS.escape(context.practiceId)}"]`).forEach((element) => { element.innerHTML = '<div class="practice-feedback"><strong>現在のコードは未判定です</strong><br>編集後のコードでもう一度実行してください。過去の合格履歴は保持されています。</div>'; });
    }
    if (context?.activityId) {
      saveExampleDebounced(context.activityId, { code: target.value, codeHash: codeFingerprint(target.value), changeChecked: false });
      const feedback = document.querySelector(`[data-example-activity="${CSS.escape(context.activityId)}"] [data-example-change-feedback]`);
      if (feedback && context.activityMode === "change") feedback.innerHTML = '<p class="help-text">現在のコードは未判定です。変更後のコードを実行してください。</p>';
    }
    return;
  }
  if (target.matches("[data-example-prediction]")) {
    saveExampleDebounced(target.dataset.examplePrediction, { prediction: target.value, predictionChecked: false });
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
  if (target.dataset.save === "post-study-answer") {
    savePostStudyAnswerDebounced(target.dataset.task, target.value);
    return;
  }
  if (target.dataset.save === "exit") {
    saveExitDebounced(target.dataset.session, target.value);
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
}

function handleChange(event) {
  const target = event.target;
  if (target.matches("[data-example-reason]")) {
    store.setExampleActivity(target.dataset.exampleReason, { reasonConfirmed: target.checked });
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

async function importProgressFile(file) {
  if (!file) return;
  try {
    const value = JSON.parse(await file.text());
    const importedState = ["lavi-spica-progress-v3", "lavi-spica-progress-v2", "lavi-spica-progress-v1", "pycore-lab-progress-v1"].includes(value?.format) ? value.state : value;
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
  if (event.target.id === "settingsForm") {
    event.preventDefault();
    const data = new FormData(event.target);
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

applySettings();
updateSidebarProgress();
if (!location.hash) location.hash = "dashboard";
else renderRoute();

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("./sw.js", { updateViaCache: "none" })
    .then((registration) => {
      registration.update();
      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        worker?.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) toast("アプリの更新があります", "編集中のコードは自動保存済みです。必要なときに再読み込みしてください。", "info", 10000);
        });
      });
    })
    .catch((error) => console.info("Service Worker registration skipped", error));
}

document.querySelector(".sidebar-version").textContent = `v${APP_VERSION} · build ${BUILD_ID} · 学習データはこの端末に保存`;
