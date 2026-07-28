import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { COURSE_CONTENT } from "../js/content.js";
import { SELF_STUDY } from "../js/self-study.js";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const failures = [];
const notes = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

const publicFiles = [
  "index.html",
  "css/styles.css",
  "css/portal.css",
  "js/app.js",
  "js/content.js",
  "js/self-study.js",
  "js/runtime.js",
  "js/storage.js",
  "js/utils.js",
  "quiz/index.html",
  "quiz/quiz.js",
  "quiz/quiz-core.js",
  "workers/python-worker.mjs",
  "sw.js",
  "manifest.webmanifest",
  "assets/logo.svg",
  "assets/lavi-spica-hero.png",
  "data/experiment.csv",
  "data/experiment_missing.csv",
  "data/projectile.csv",
  "README.md",
  "docs/STUDENT_GUIDE.md",
  "VERSION",
  "LICENSE",
  ".gitattributes",
  ".gitignore",
  ".nojekyll",
  "package.json",
  "package-lock.json",
  "publish-github-https.command",
  ".github/workflows/deploy-pages.yml",
];
for (const path of publicFiles) assert(existsSync(join(root, path)), `必須ファイルがありません: ${path}`);

const teacherFiles = ["teacher/index.html", "teacher/teacher.js", "teacher/question-bank.js", "teacher/answer-key.js", "teacher/GUIDE.md"];
const teacherPresent = teacherFiles.every((path) => existsSync(join(root, path)));
let QUESTION_DATA = null;
if (teacherPresent) {
  const questionModule = await import(`${pathToFileURL(join(root, "teacher/question-bank.js")).href}?check=${Date.now()}`);
  QUESTION_DATA = questionModule.QUESTION_DATA;
  notes.push("教員用ローカルツールと非公開問題バンクを検出しました。");
} else {
  notes.push("教員用ローカルツールと問題バンクはGit公開物に含まれません。");
}

const packageData = JSON.parse(read("package.json"));
const manifest = JSON.parse(read("manifest.webmanifest"));
const version = COURSE_CONTENT.meta.version;
assert(packageData.name === "lavi-spica", "package nameがlavi-spicaではありません");
assert(packageData.version === version, "package.jsonと教材versionが一致しません");
assert(read("VERSION").trim() === version, "VERSIONと教材versionが一致しません");
assert(version === "1.1.0", `想定versionは1.1.0です: ${version}`);
if (QUESTION_DATA) assert(QUESTION_DATA.meta.version === version, "問題バンクと教材versionが一致しません");
assert(COURSE_CONTENT.meta.title === "LAVi-SPICA", "教材titleがLAVi-SPICAではありません");
assert(COURSE_CONTENT.meta.subtitle === "Structured Python Interactive Course and Activities", "SPICAの正式名称がありません");
assert(read("README.md").includes("assets/lavi-spica-hero.png"), "READMEにhero imageがありません");
assert(read("README.md").includes("Structured Python Interactive Course and Activities"), "READMEにSPICAの正式名称がありません");
assert(read("index.html").includes("Structured Python Interactive Course and Activities"), "学生画面にSPICAの正式名称がありません");
assert(read("sw.js").includes(`lavi-spica-v${version}`), "Service Workerのcache versionが一致しません");
assert(manifest.start_url === "./#dashboard", "manifestのstart_urlが想定と異なります");
assert(manifest.scope === "./", "manifestのscopeが想定と異なります");
assert(read("workers/python-worker.mjs").includes(`PYODIDE_VERSION = "${COURSE_CONTENT.meta.pyodide}"`), "Workerと教材metadataのPyodide versionが一致しません");

assert(COURSE_CONTENT.sessions.length === 7, `session数が7ではありません: ${COURSE_CONTENT.sessions.length}`);
assert(COURSE_CONTENT.lessons.length === 23, `lesson数が23ではありません: ${COURSE_CONTENT.lessons.length}`);
assert(COURSE_CONTENT.sessions.map((session) => session.id).join(",") === "1,2,3,4,5,6,7", "session IDが1〜7の連番ではありません");

const lessonIds = new Set();
const practiceIds = new Set();
const snippets = [];
let practiceCount = 0;
let afterClassCount = 0;

for (const session of COURSE_CONTENT.sessions) {
  assert(typeof session.title === "string" && session.title.length > 0, `session titleがありません: ${session.id}`);
  assert(typeof session.subtitle === "string" && session.subtitle.length > 0, `session subtitleがありません: ${session.id}`);
  assert(Array.isArray(session.scope) && session.scope.length >= 3, `session scopeが不足しています: ${session.id}`);
}

for (const lesson of COURSE_CONTENT.lessons) {
  assert(!lessonIds.has(lesson.id), `lesson IDが重複しています: ${lesson.id}`);
  lessonIds.add(lesson.id);
  assert(lesson.session >= 1 && lesson.session <= 7, `lessonのsessionが範囲外です: ${lesson.id}`);
  assert(["core", "advanced"].includes(lesson.track), `trackが不正です: ${lesson.id}`);
  assert(Array.isArray(lesson.objectives) && lesson.objectives.length >= 3, `到達目標が不足しています: ${lesson.id}`);
  assert(Array.isArray(lesson.concepts) && lesson.concepts.length >= 2, `文法解説が不足しています: ${lesson.id}`);
  assert(Array.isArray(lesson.liveCoding) && lesson.liveCoding.length >= 1, `例題が不足しています: ${lesson.id}`);
  assert(Array.isArray(lesson.practices) && lesson.practices.length >= 2, `練習問題が不足しています: ${lesson.id}`);
  assert(Array.isArray(lesson.afterClass) && lesson.afterClass.length >= 2, `事後学習が不足しています: ${lesson.id}`);
  assert(Array.isArray(lesson.commonErrors) && lesson.commonErrors.length >= 1, `エラー解説が不足しています: ${lesson.id}`);
  assert(typeof lesson.starterCode === "string" && lesson.starterCode.trim(), `開始コードがありません: ${lesson.id}`);
  snippets.push({ name: `${lesson.id}:starter`, code: lesson.starterCode });

  for (const [index, concept] of lesson.concepts.entries()) {
    assert(typeof concept.title === "string" && concept.title.length > 0, `concept titleがありません: ${lesson.id}:${index}`);
    assert(typeof concept.body === "string" && concept.body.length >= 20, `conceptの説明が短すぎます: ${lesson.id}:${index}`);
    if (concept.code) snippets.push({ name: `${lesson.id}:concept:${index}`, code: concept.code });
  }
  for (const [index, step] of lesson.liveCoding.entries()) {
    assert(typeof step.instruction === "string" && step.instruction.length > 0, `例題説明がありません: ${lesson.id}:${index}`);
    assert(typeof step.predict === "string" && step.predict.length > 0, `予想問いがありません: ${lesson.id}:${index}`);
    assert(typeof step.code === "string" && step.code.trim(), `例題codeがありません: ${lesson.id}:${index}`);
    snippets.push({ name: `${lesson.id}:live:${index}`, code: step.code });
  }

  const study = SELF_STUDY[lesson.id];
  assert(Boolean(study), `自習用ガイドがありません: ${lesson.id}`);
  if (study) {
    assert(Array.isArray(study.lead) && study.lead.length >= 2, `自習用導入説明が不足しています: ${lesson.id}`);
    assert(study.lead.every((paragraph) => paragraph.length >= 35), `自習用導入説明が短すぎます: ${lesson.id}`);
    assert(Array.isArray(study.grammar) && study.grammar.length >= 3, `文法カードが不足しています: ${lesson.id}`);
    for (const [index, rule] of study.grammar.entries()) {
      assert(rule.title && rule.pattern && rule.body, `文法カードの項目が不足しています: ${lesson.id}:${index}`);
      assert(String(rule.body).length >= 25, `文法カードの説明が短すぎます: ${lesson.id}:${index}`);
      if (rule.code) snippets.push({ name: `${lesson.id}:study-rule:${index}`, code: rule.code });
    }
    assert(study.walkthrough?.title && study.walkthrough?.code, `一行ずつ読む例題がありません: ${lesson.id}`);
    assert(Array.isArray(study.walkthrough?.steps) && study.walkthrough.steps.length >= 3, `例題の手順説明が不足しています: ${lesson.id}`);
    assert(String(study.walkthrough?.try || "").length >= 10, `変更して試す指示がありません: ${lesson.id}`);
    snippets.push({ name: `${lesson.id}:walkthrough`, code: study.walkthrough.code });
    assert(Array.isArray(study.checkpoints) && study.checkpoints.length >= 2, `理解確認が不足しています: ${lesson.id}`);
  }

  for (const practice of lesson.practices) {
    practiceCount += 1;
    assert(!practiceIds.has(practice.id), `practice IDが重複しています: ${practice.id}`);
    practiceIds.add(practice.id);
    assert(practice.title && practice.prompt && practice.starterCode && practice.solution, `練習問題の項目が不足しています: ${practice.id}`);
    assert(["基礎", "標準", "発展"].includes(practice.difficulty), `練習問題の難度が不正です: ${practice.id}`);
    assert(Array.isArray(practice.hints) && practice.hints.length >= 1, `ヒントがありません: ${practice.id}`);
    assert(practice.check && typeof practice.check === "object", `自動判定条件がありません: ${practice.id}`);
    snippets.push({ name: `${practice.id}:starter`, code: practice.starterCode });
    snippets.push({ name: `${practice.id}:solution`, code: practice.solution });
  }
  afterClassCount += lesson.afterClass.length;
}

assert(practiceCount === 46, `practice数が46ではありません: ${practiceCount}`);
assert(afterClassCount >= 46, `事後学習問題が不足しています: ${afterClassCount}`);
assert(Object.keys(SELF_STUDY).length === COURSE_CONTENT.lessons.length, "自習用ガイドとlesson数が一致しません");

const expectedOrder = [
  "01-variables", "02-print", "03-fstrings", "04-list", "05-dict", "06-tuple", "07-methods",
  "08-math", "09-range", "10-for", "11-conditions", "12-if", "13-for-if", "14-def",
];
assert(COURSE_CONTENT.lessons.slice(0, expectedOrder.length).map((lesson) => lesson.id).join(",") === expectedOrder.join(","), "基礎文法の学習順序が想定と異なります");

const earlyPracticeText = COURSE_CONTENT.lessons.slice(0, 16)
  .flatMap((lesson) => lesson.practices)
  .map((practice) => `${practice.starterCode}\n${practice.solution}`)
  .join("\n");
const longIdentifiers = [...new Set(earlyPracticeText.match(/\b[A-Za-z_]\w{12,}\b/g) || [])]
  .filter((name) => !["matplotlib", "structuredClone"].includes(name));
assert(longIdentifiers.length === 0, `基礎練習に長すぎる識別子があります: ${longIdentifiers.join(", ")}`);

const studentIndex = read("index.html");
const studentApp = read("js/app.js");
assert(!/#quiz|#teacher|teacher\//i.test(studentIndex), "学生用indexに小テストまたは教員用リンクがあります");
assert(!/#quiz|#teacher|teacher\//i.test(studentApp), "学生用appに小テストまたは教員用リンクがあります");
assert(!/question-bank|answer-key|quiz-core/i.test(studentApp), "学生用appが小テスト問題を読み込んでいます");
assert(read("quiz/index.html").includes("noindex,nofollow,noarchive"), "小テスト画面にnoindex指定がありません");
assert(!/answer-key|QUIZ_ANSWER_KEY|correctAnswer|scoreResponse/.test(read("quiz/quiz.js")), "学生用小テストが採点キーまたは正答処理を含んでいます");
assert(!/answer-key|QUIZ_ANSWER_KEY/.test(read("quiz/quiz-core.js")), "学生用quiz coreが採点キーを参照しています");

assert(!existsSync(join(root, "quiz/question-bank.js")), "公開quiz directoryに問題バンクが残っています");
assert(!/question-bank|QUESTION_DATA/.test(read("quiz/quiz.js")), "学生用小テストが問題バンクを参照しています");
assert(!/question-bank|QUESTION_DATA/.test(read("quiz/quiz-core.js")), "学生用quiz coreが問題バンクを参照しています");
assert(read("quiz/quiz-core.js").includes("lavi-spica-quiz-link-v1"), "当日リンク用payload処理がありません");
assert(read("quiz/quiz-core.js").includes("decodeQuizPayload"), "当日リンクの読込処理がありません");

if (QUESTION_DATA) {
  assert(QUESTION_DATA.questions.length === 98, `小テスト問題数が98ではありません: ${QUESTION_DATA.questions.length}`);
  for (let session = 1; session <= 7; session += 1) {
    assert(QUESTION_DATA.questions.filter((question) => Number(question.session) === session).length === 14, `第${session}回の問題数が14ではありません`);
  }
  for (const question of QUESTION_DATA.questions) {
    assert(question.id && question.prompt && question.type, `問題の必須項目がありません: ${question.id || "unknown"}`);
    assert(["single", "multi", "text"].includes(question.type), `問題typeが不正です: ${question.id}`);
    assert(!Object.hasOwn(question, "answer"), `問題バンクにanswerがあります: ${question.id}`);
    assert(!Object.hasOwn(question, "accepted"), `問題バンクにacceptedがあります: ${question.id}`);
    assert(!Object.hasOwn(question, "answerDisplay"), `問題バンクにanswerDisplayがあります: ${question.id}`);
    assert(!Object.hasOwn(question, "explanation"), `問題バンクにexplanationがあります: ${question.id}`);
    if (question.options) assert(new Set(question.options).size === question.options.length, `選択肢が重複しています: ${question.id}`);
  }
}

const gitignore = read(".gitignore");
const workflow = read(".github/workflows/deploy-pages.yml");
assert(/^teacher\/\s*$/m.test(gitignore), ".gitignoreがteacher/を除外していません");
assert(!/cp\s+-R[^\n]*teacher/.test(workflow), "Pages workflowがteacher/を公開しようとしています");
assert(workflow.includes("public-site"), "Pages workflowに公開用directoryがありません");
assert(read("publish-github-https.command").includes('git check-ignore -q "$protected_file"'), "push scriptに教員用ファイルの保護確認がありません");

const readme = read("README.md");
for (const phrase of ["更新履歴", "検証結果", "アップロード済み講義資料", "GitHubへHTTPSで公開", "release directory", "v1.1.0"]) {
  assert(!readme.includes(phrase), `READMEに学生へ不要な文言があります: ${phrase}`);
}
for (const removed of ["CHANGELOG.md", "RELEASE_VALIDATION.txt", "RELEASE_MANIFEST.txt", "docs/SOURCE_COVERAGE.md", "docs/DEPLOYMENT.md"]) {
  assert(!existsSync(join(root, removed)), `不要な公開文書が残っています: ${removed}`);
}
assert(!read("js/content.js").includes("sourceCoverage"), "公開教材dataに内部向けsourceCoverageがあります");
assert(!read("js/content.js").includes("sourceRefs"), "公開教材dataに内部向けsourceRefsがあります");
assert(!read("js/content.js").includes('"updated"'), "公開教材dataに更新日metadataがあります");
assert(!read("js/content.js").includes("追加講義資料"), "公開教材dataに内部向け資料名があります");
assert(!read("js/content.js").includes("教員と一緒に入力"), "公開教材dataに教員運用文があります");

const personalPathPattern = /\/Users\/shogo|C:\\Users\\shogo/;
for (const path of publicFiles) {
  if (existsSync(join(root, path)) && !path.endsWith(".png")) {
    assert(!personalPathPattern.test(read(path)), `個人の絶対PATHがあります: ${path}`);
  }
}

const compileRunner = String.raw`
import json, sys
items = json.load(sys.stdin)
errors = []
for item in items:
    try:
        compile(item["code"], item["name"], "exec")
    except SyntaxError as exc:
        errors.append({"name": item["name"], "message": str(exc)})
print(json.dumps(errors, ensure_ascii=False))
`;
const compileResult = spawnSync("python3", ["-c", compileRunner], {
  input: JSON.stringify(snippets),
  encoding: "utf8",
  timeout: 60_000,
  maxBuffer: 8 * 1024 * 1024,
});
assert(!compileResult.error, `Python構文検査を実行できません: ${compileResult.error?.message || "unknown"}`);
assert(compileResult.status === 0, `Python構文検査が異常終了しました: ${compileResult.stderr}`);
if (!compileResult.error && compileResult.status === 0) {
  try {
    const errors = JSON.parse(compileResult.stdout || "[]");
    for (const error of errors) failures.push(`Python構文エラー: ${error.name}: ${error.message}`);
  } catch (error) {
    failures.push(`Python構文検査結果を読めません: ${error.message}`);
  }
}

const jsFiles = [
  "js/app.js", "js/content.js", "js/self-study.js", "js/runtime.js", "js/storage.js", "js/utils.js",
  "quiz/quiz.js", "quiz/quiz-core.js", "sw.js", "workers/python-worker.mjs",
];
if (teacherPresent) jsFiles.push("teacher/teacher.js", "teacher/question-bank.js", "teacher/answer-key.js");
for (const path of jsFiles) {
  const result = spawnSync(process.execPath, ["--check", join(root, path)], { encoding: "utf8" });
  assert(result.status === 0, `JavaScript構文エラー: ${path}: ${result.stderr.trim()}`);
}
const shellResult = spawnSync("bash", ["-n", join(root, "publish-github-https.command")], { encoding: "utf8" });
assert(shellResult.status === 0, `publish scriptの構文エラー: ${shellResult.stderr.trim()}`);

if (teacherPresent) {
  const teacherIndex = read("teacher/index.html");
  const teacherJs = read("teacher/teacher.js");
  const answerModule = await import(`${pathToFileURL(join(root, "teacher/answer-key.js")).href}?check=${Date.now()}`);
  const answerKey = answerModule.QUIZ_ANSWER_KEY;
  assert(teacherIndex.includes("noindex,nofollow,noarchive"), "教員画面にnoindex指定がありません");
  assert(teacherJs.includes("./question-bank.js"), "教員画面がローカル問題バンクを参照していません");
  assert(teacherJs.includes("./answer-key.js"), "教員画面が採点キーを参照していません");
  assert(answerKey.meta.version === version, "採点キーと教材versionが一致しません");
  assert(Object.keys(answerKey.answers).length === QUESTION_DATA.questions.length, "採点キー件数と問題数が一致しません");
  for (const question of QUESTION_DATA.questions) assert(Boolean(answerKey.answers[question.id]), `採点キーがありません: ${question.id}`);
}

if (failures.length) {
  console.error(`\nLAVi-SPICA validation failed (${failures.length})`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Validated ${COURSE_CONTENT.sessions.length} sessions, ${COURSE_CONTENT.lessons.length} lessons, ${practiceCount} practices, and ${afterClassCount} after-class questions.`);
console.log(`Validated detailed self-study guides for all ${Object.keys(SELF_STUDY).length} lessons.`);
if (QUESTION_DATA) console.log(`Validated ${QUESTION_DATA.questions.length} instructor-only quiz questions; no question bank or answer key is present in the public student bundle.`);
else console.log("Validated the public day-of quiz reader with no question bank or answer key in the Git checkout.");
notes.forEach((note) => console.log(note));
