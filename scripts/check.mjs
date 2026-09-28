import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { COURSE_CONTENT } from "../js/content.js";
import { SELF_STUDY } from "../js/self-study.js";
import { LESSON_EXPLANATIONS, POST_STUDY } from "../js/lesson-extensions.js";
import { LECTURE_PLAN } from "../js/lecture-plan.js";
import { validateParticipantProfile, validateStudentId, validateStudentName } from "../quiz/quiz-core.js";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const failures = [];
const notes = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const read = (path) => readFileSync(join(root, path), "utf8");

const publicFiles = [
  "index.html", "css/styles.css", "css/portal.css", "js/app.js", "js/content.js", "js/lecture-plan.js", "js/self-study.js",
  "js/lesson-extensions.js", "js/runtime.js", "js/storage.js", "js/utils.js", "quiz/index.html", "quiz/quiz.js",
  "quiz/quiz-core.js", "workers/python-worker.mjs", "sw.js", "manifest.webmanifest", "assets/logo.svg",
  "assets/lavi-spica-hero.png", "data/experiment.csv", "data/experiment_missing.csv", "data/projectile.csv",
  "README.md", "docs/STUDENT_GUIDE.md", "VERSION", "LICENSE", ".gitattributes", ".gitignore", ".nojekyll",
  "package.json", "package-lock.json", "publish-github-https.command", ".github/workflows/deploy-pages.yml",
  "scripts/check.mjs", "scripts/validate-solutions.mjs", "scripts/validate-quiz.mjs", "scripts/validate-firebase.mjs",
];
for (const path of publicFiles) assert(existsSync(join(root, path)), `必須ファイルがありません: ${path}`);

const version = read("VERSION").trim();
assert(version === "1.5.0", `想定versionは1.5.0です: ${version}`);
assert(COURSE_CONTENT.meta.version === version, "COURSE_CONTENTとVERSIONが一致しません");
assert(JSON.parse(read("package.json")).version === version, "package.jsonとVERSIONが一致しません");
assert(JSON.parse(read("package-lock.json")).version === version, "package-lock.jsonとVERSIONが一致しません");
assert(read("sw.js").includes(`lavi-spica-v${version}`), "Service Worker cache名にversionがありません");
assert(read("sw.js").includes("./js/lesson-extensions.js"), "Service Workerにlesson-extensions.jsがありません");

assert(COURSE_CONTENT.sessions.length === 7, `session数が7ではありません: ${COURSE_CONTENT.sessions.length}`);
assert(COURSE_CONTENT.lessons.length === 23, `lesson数が23ではありません: ${COURSE_CONTENT.lessons.length}`);
const lessonIds = COURSE_CONTENT.lessons.map((lesson) => lesson.id);
assert(new Set(lessonIds).size === lessonIds.length, "lesson IDが重複しています");
const regularPractices = COURSE_CONTENT.lessons.flatMap((lesson) => lesson.practices);
assert(regularPractices.length === 46, `通常練習問題が46問ではありません: ${regularPractices.length}`);
const allPracticeIds = new Set([...regularPractices.map((item) => item.id), ...Object.values(POST_STUDY).flat().filter((item) => item.kind === "code").map((item) => item.id)]);
assert(LECTURE_PLAN.length === COURSE_CONTENT.sessions.length, "講義プランの回数がsession数と一致しません");
for (const plan of LECTURE_PLAN) {
  assert(Boolean(plan.notebookUrl), `講義notebook URLがありません: ${plan.sessionId}`);
  assert(Array.isArray(plan.summaryBullets) && plan.summaryBullets.length >= 3, `講義の要点が不足しています: ${plan.sessionId}`);
  assert(Array.isArray(plan.reflectionCards) && plan.reflectionCards.length >= 2, `振り返りカードが不足しています: ${plan.sessionId}`);
  for (const id of plan.requiredLessonIds || []) assert(lessonIds.includes(id), `講義プランのlesson IDが不正です: ${id}`);
  for (const id of plan.requiredPracticeIds || []) assert(allPracticeIds.has(id), `講義プランのpractice IDが不正です: ${id}`);
}


for (const lesson of COURSE_CONTENT.lessons) {
  const study = SELF_STUDY[lesson.id];
  const explanation = LESSON_EXPLANATIONS[lesson.id];
  const post = POST_STUDY[lesson.id];
  assert(Boolean(study), `自習ガイドがありません: ${lesson.id}`);
  assert(Boolean(explanation), `詳細解説がありません: ${lesson.id}`);
  assert(Array.isArray(explanation?.overview) && explanation.overview.length >= 2, `詳細解説の段落が不足: ${lesson.id}`);
  assert(Array.isArray(explanation?.anatomy) && explanation.anatomy.length >= 3, `構文分解が不足: ${lesson.id}`);
  assert(Array.isArray(explanation?.trace?.rows) && explanation.trace.rows.length >= 3, `処理追跡が不足: ${lesson.id}`);
  assert(Array.isArray(explanation?.checklist) && explanation.checklist.length >= 3, `確認リストが不足: ${lesson.id}`);
  assert(Array.isArray(post) && post.length === 4, `事後学習が4問ではありません: ${lesson.id}`);
  assert(post?.filter((task) => task.kind === "knowledge").length === 2, `知識事後学習が2問ではありません: ${lesson.id}`);
  assert(post?.filter((task) => task.kind === "code").length === 2, `コード事後学習が2問ではありません: ${lesson.id}`);
  for (const task of post || []) {
    assert(Boolean(task.prompt), `事後学習の問題文がありません: ${task.id}`);
    if (task.kind === "knowledge") {
      assert(Boolean(task.hint) && Boolean(task.answer), `知識問題のヒント・解答がありません: ${task.id}`);
    } else {
      assert(Array.isArray(task.hints) && task.hints.length >= 1, `コード問題のヒントがありません: ${task.id}`);
      assert(Boolean(task.starterCode) && Boolean(task.solution) && Boolean(task.check), `コード問題の教材要素が不足: ${task.id}`);
    }
  }
}
const postTasks = Object.values(POST_STUDY).flat();
assert(postTasks.length === 92, `事後学習が92問ではありません: ${postTasks.length}`);
assert(postTasks.filter((task) => task.kind === "code").length === 46, "コード事後学習が46問ではありません");

const appJs = read("js/app.js");
for (const phrase of ["LESSON_EXPLANATIONS", "POST_STUDY", "事後学習：問題を解いて定着させる", "post-study-answer"]) {
  assert(appJs.includes(phrase), `学生用アプリに必要な実装がありません: ${phrase}`);
}
const storageJs = read("js/storage.js");
assert(storageJs.includes("postStudyAnswers"), "事後学習回答の保存領域がありません");
assert(storageJs.includes("lavi-spica:v3:student-state"), "学生進捗schema v3がありません");

const coreJs = read("quiz/quiz-core.js");
assert(coreJs.includes("lavi-spica-quiz-link-v2"), "小テストlink v2がありません");
assert(coreJs.includes("lavi-spica-quiz-response-v4"), "小テストresponse v4がありません");
assert(coreJs.includes("NEW_STUDENT_ID_PATTERN") && coreJs.includes("OLD_STUDENT_ID_PATTERN"), "学籍番号2形式の検査がありません");
assert(coreJs.includes("TEST_PARTICIPANT_ID_PATTERN") && coreJs.includes("validateParticipantProfile"), "教員テスト用プロフィール検査がありません");
assert(coreJs.includes("clamp(Number(payload.config.minutes) || 8, 3, 20)"), "小テスト時間が3〜20分へ制限されていません");
assert(coreJs.includes("export function normalizeQuizPayload"), "クラウドから受け取る小テストpayloadの正規化関数がありません");
const quizJs = read("quiz/quiz.js");
assert(quizJs.includes("bridgeRequested") && quizJs.includes("renderBridgeOnly"), "認証前のbridge直アクセスを拒否する実装がありません");
assert(quizJs.includes("quizPayload") && quizJs.includes("postMessage"), "認証後に小テストpayloadを受け取る実装がありません");
assert(quizJs.includes("data-code-question"), "小テストのコードエディタがありません");
assert(quizJs.includes("PythonRuntime"), "小テストのPython実行環境がありません");

for (const id of ["21B11001", "29B91009", "21B11299", "01001", "09299"]) assert(validateStudentId(id).valid, `有効な学籍番号を拒否します: ${id}`);
for (const id of ["20B11001", "21b11001", "２１Ｂ１１００１", "21B10001", "21B11000", "001", "01000", "10300"]) assert(!validateStudentId(id).valid, `無効な学籍番号を受理します: ${id}`);
for (const name of ["山田太郎", "A B", "AB", "李 明"]) assert(validateStudentName(name).valid, `有効な氏名を拒否します: ${name}`);
for (const name of ["", "A", "山", "   "]) assert(!validateStudentName(name).valid, `無効な氏名を受理します: ${JSON.stringify(name)}`);
assert(validateParticipantProfile({ studentId: "TEST-12AB34CD", name: "教員テスト" }), "教員テスト用プロフィールを拒否します");
assert(!validateParticipantProfile({ studentId: "TEST-invalid", name: "教員テスト" }), "不正な教員テストIDを受理します");

const gitignore = read(".gitignore");
assert(/(^|\n)teacher\/(\n|$)/.test(gitignore), "teacher/が.gitignoreにありません");
assert(/(^|\n)open-teacher\.command(\n|$)/.test(gitignore), "open-teacher.commandが.gitignoreにありません");
assert(/(^|\n)firebase\/(\n|$)/.test(gitignore), "firebase/が.gitignoreにありません");
assert(/(^|\n)\.spica-cloud-url(\n|$)/.test(gitignore), ".spica-cloud-urlが.gitignoreにありません");
if (existsSync(join(root, "teacher"))) {
  for (const path of ["teacher/index.html", "teacher/teacher.js", "teacher/question-bank.js", "teacher/answer-key.js", "teacher/GUIDE.md", "open-teacher.command"]) {
    assert(existsSync(join(root, path)), `教員用ローカルファイルがありません: ${path}`);
  }
  const { QUESTION_DATA } = await import(`${pathToFileURL(join(root, "teacher/question-bank.js")).href}?v=${Date.now()}`);
  const { QUIZ_ANSWER_KEY } = await import(`${pathToFileURL(join(root, "teacher/answer-key.js")).href}?v=${Date.now()}`);
  assert(QUESTION_DATA.meta.version === version, "問題バンクversionが一致しません");
  assert(QUIZ_ANSWER_KEY.meta.version === version, "採点キーversionが一致しません");
  assert(QUESTION_DATA.questions.length === 56, `問題バンクが56問ではありません: ${QUESTION_DATA.questions.length}`);
  assert(Object.keys(QUIZ_ANSWER_KEY.answers).length === 56, "採点キーが56件ではありません");
  const bashCheck = spawnSync("bash", ["-n", join(root, "open-teacher.command")], { encoding: "utf8" });
  assert(bashCheck.status === 0, `open-teacher.commandの構文エラー: ${bashCheck.stderr}`);
  const teacherSource = read("teacher/teacher.js");
  for (const phrase of ["isTestResponse", "responseClass", "class_code", "session_mode", ".filter((item) => !item.testMode)"]) {
    assert(teacherSource.includes(phrase), `教員採点ツールのクラス・テスト分離が不足しています: ${phrase}`);
  }
  notes.push("教員用ローカルツール、クラス別CSV、教員テスト除外、56問の問題バンクを検出しました。");
} else {
  notes.push("公開checkoutのため教員用ローカルツール検査を省略しました。");
}

const jsFiles = [];
function collectJs(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (!["node_modules", ".git"].includes(name)) collectJs(full);
    } else if (/\.(?:js|mjs)$/.test(name)) jsFiles.push(full);
  }
}
collectJs(root);
for (const file of jsFiles) {
  const check = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  assert(check.status === 0, `JavaScript構文エラー: ${relative(root, file)}\n${check.stderr}`);
}

const publicDocs = `${read("README.md")}\n${read("docs/STUDENT_GUIDE.md")}`;
const privateMacPath = ["/Users", "/shogo"].join("");
for (const phrase of ["更新履歴", "検証結果", "アップロード済み", "release directory", privateMacPath, "PyCore Lab"]) {
  assert(!publicDocs.includes(phrase), `公開文書に学生不要の文言があります: ${phrase}`);
}

for (const file of jsFiles.concat(publicFiles.filter((path) => /\.(?:html|md|json|command|yml|txt)$/.test(path)).map((path) => join(root, path)))) {
  if (!existsSync(file) || relative(root, file) === "scripts/check.mjs") continue;
  const text = readFileSync(file, "utf8");
  assert(!text.includes(privateMacPath), `個人の絶対PATHがあります: ${relative(root, file)}`);
}

if (failures.length) {
  console.error(`\nLAVi-SPICA static validation failed (${failures.length})`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Static validation passed: ${COURSE_CONTENT.sessions.length} sessions, ${COURSE_CONTENT.lessons.length} lessons, ${regularPractices.length} practices, ${postTasks.length} post-study tasks.`);
notes.forEach((note) => console.log(note));
