import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";
import { COURSE_CONTENT } from "../js/content.js";
import { QUIZ_DATA } from "../js/quiz-bank.js";

const here = dirname(fileURLToPath(import.meta.url));
const root = dirname(here);
const failures = [];
const notes = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

const requiredFiles = [
  "index.html",
  "css/styles.css",
  "js/app.js",
  "js/content.js",
  "js/quiz-bank.js",
  "js/runtime.js",
  "js/storage.js",
  "js/utils.js",
  "workers/python-worker.mjs",
  "sw.js",
  "manifest.webmanifest",
  "assets/logo.svg",
  "assets/lavi-spica-hero.png",
  "data/experiment.csv",
  "data/experiment_missing.csv",
  "data/projectile.csv",
  "README.md",
  "RELEASE_VALIDATION.txt",
  "RELEASE_MANIFEST.txt",
  "VERSION",
  "LICENSE",
  ".gitattributes",
  "publish-github-https.command",
  ".nojekyll",
  "docs/STUDENT_GUIDE.md",
  "docs/INSTRUCTOR_GUIDE.md",
  "docs/SOURCE_COVERAGE.md",
  "docs/QUIZ_OPERATION.md",
  "docs/DEPLOYMENT.md",
  "docs/GITHUB_HTTPS.md",
  "docs/VALIDATION.md",
  "scripts/validate-solutions.mjs",
  "scripts/validate-quiz.mjs",
  ".github/workflows/deploy-pages.yml",
];
for (const path of requiredFiles) assert(existsSync(join(root, path)), `必須ファイルがありません: ${path}`);

const packageData = JSON.parse(read("package.json"));
const manifest = JSON.parse(read("manifest.webmanifest"));
assert(packageData.name === "lavi-spica", "package nameがlavi-spicaではありません");
assert(packageData.version === COURSE_CONTENT.meta.version, "package.jsonと教材バージョンが一致しません");
assert(read("VERSION").trim() === COURSE_CONTENT.meta.version, "VERSIONと教材バージョンが一致しません");
assert(COURSE_CONTENT.meta.title === "LAVi-SPICA", "教材titleがLAVi-SPICAではありません");
assert(COURSE_CONTENT.meta.subtitle === "Structured Python Interactive Course and Activities", "SPICAの正式名称が教材metadataにありません");
assert(read("index.html").includes(`v${COURSE_CONTENT.meta.version}`), "index.htmlにバージョン表記がありません");
assert(read("index.html").includes("Structured Python Interactive Course and Activities"), "index.htmlにSPICAの正式名称がありません");
assert(read("README.md").includes("assets/lavi-spica-hero.png"), "README先頭にhero imageがありません");
assert(read("README.md").includes("Structured Python Interactive Course and Activities"), "READMEにSPICAの正式名称がありません");
assert(read("sw.js").includes(`lavi-spica-v${COURSE_CONTENT.meta.version}`), "Service Workerのcache versionが一致しません");
assert(manifest.start_url === "./#dashboard", "manifestのstart_urlが想定と異なります");
assert(COURSE_CONTENT.meta.pyodide === "314.0.3", "教材メタデータのPyodide versionが想定と異なります");
assert(read("workers/python-worker.mjs").includes(`PYODIDE_VERSION = "${COURSE_CONTENT.meta.pyodide}"`), "Workerと教材メタデータのPyodide versionが一致しません");

assert(COURSE_CONTENT.sessions.length === 7, "session数は7である必要があります");
assert(COURSE_CONTENT.lessons.length === 23, "lesson数は23である必要があります");
assert(COURSE_CONTENT.sessions.map((s) => s.id).join(",") === "1,2,3,4,5,6,7", "session IDが1〜7の連番ではありません");
for (const session of COURSE_CONTENT.sessions) {
  assert(typeof session.title === "string" && session.title.length > 0, `session titleがありません: ${session.id}`);
  assert(Array.isArray(session.goals) && session.goals.length >= 3, `session到達目標が不足しています: ${session.id}`);
  assert(Array.isArray(session.plan) && session.plan.length >= 5, `session進行表が不足しています: ${session.id}`);
  if (Array.isArray(session.plan) && session.plan.length) {
    assert(Number(session.plan[0][0]) === 0, `session進行表が0分から始まりません: ${session.id}`);
    assert(Number(session.plan.at(-1)[1]) === 100, `session進行表が100分で終わりません: ${session.id}`);
    session.plan.forEach((row, index) => {
      assert(Array.isArray(row) && row.length === 3, `session進行表の行が不正です: ${session.id}:${index}`);
      assert(Number(row[1]) > Number(row[0]), `session進行表の時間幅が不正です: ${session.id}:${index}`);
      assert(typeof row[2] === "string" && row[2].length > 0, `session進行表の活動がありません: ${session.id}:${index}`);
      if (index > 0) assert(Number(row[0]) === Number(session.plan[index - 1][1]), `session進行表が連続していません: ${session.id}:${index}`);
    });
  }
}

const lessonIds = new Set();
const practiceIds = new Set();
const allSnippets = [];
const expectedInvalidSnippets = [];
let practiceCount = 0;
let afterClassCount = 0;

for (const lesson of COURSE_CONTENT.lessons) {
  assert(!lessonIds.has(lesson.id), `lesson IDが重複しています: ${lesson.id}`);
  lessonIds.add(lesson.id);
  assert(lesson.session >= 1 && lesson.session <= 7, `lessonのsessionが範囲外です: ${lesson.id}`);
  assert(["core", "advanced"].includes(lesson.track), `trackが不正です: ${lesson.id}`);
  assert(Array.isArray(lesson.objectives) && lesson.objectives.length >= 3, `到達目標が不足しています: ${lesson.id}`);
  assert(Array.isArray(lesson.concepts) && lesson.concepts.length >= 2, `解説項目が不足しています: ${lesson.id}`);
  assert(Array.isArray(lesson.liveCoding) && lesson.liveCoding.length >= 1, `一斉入力例が不足しています: ${lesson.id}`);
  assert(Array.isArray(lesson.practices) && lesson.practices.length >= 2, `練習問題が不足しています: ${lesson.id}`);
  assert(Array.isArray(lesson.afterClass) && lesson.afterClass.length >= 2, `事後学習が不足しています: ${lesson.id}`);
  assert(Array.isArray(lesson.commonErrors) && lesson.commonErrors.length >= 1, `エラー解説が不足しています: ${lesson.id}`);
  assert(Number(lesson.minutes) > 0, `lesson時間が不正です: ${lesson.id}`);
  assert(typeof lesson.starterCode === "string" && lesson.starterCode.length > 0, `開始コードがありません: ${lesson.id}`);

  lesson.concepts.forEach((concept, index) => {
    assert(typeof concept.title === "string" && concept.title.length > 0, `concept titleがありません: ${lesson.id}:${index}`);
    assert(typeof concept.body === "string" && concept.body.length > 0, `concept本文がありません: ${lesson.id}:${index}`);
    if (concept.code) allSnippets.push({ name: `${lesson.id}:concept:${index}`, code: concept.code });
  });
  lesson.liveCoding.forEach((step, index) => {
    assert(typeof step.title === "string" && step.title.length > 0, `一斉入力titleがありません: ${lesson.id}:${index}`);
    assert(typeof step.instruction === "string" && step.instruction.length > 0, `一斉入力説明がありません: ${lesson.id}:${index}`);
    assert(typeof step.predict === "string" && step.predict.length > 0, `一斉入力の予想問いがありません: ${lesson.id}:${index}`);
    assert(typeof step.code === "string" && step.code.length > 0, `一斉入力codeがありません: ${lesson.id}:${index}`);
    if (step.code) allSnippets.push({ name: `${lesson.id}:live:${index}`, code: step.code });
  });
  lesson.afterClass.forEach((item, index) => {
    assert(typeof item.question === "string" && item.question.length > 0, `事後学習の問いがありません: ${lesson.id}:${index}`);
    assert(typeof item.model === "string" && item.model.length > 0, `事後学習の解答例がありません: ${lesson.id}:${index}`);
  });
  lesson.commonErrors.forEach((item, index) => {
    assert(typeof item.symptom === "string" && item.symptom.length > 0, `エラー症状がありません: ${lesson.id}:${index}`);
    assert(typeof item.cause === "string" && item.cause.length > 0, `エラー原因がありません: ${lesson.id}:${index}`);
    assert(typeof item.fix === "string" && item.fix.length > 0, `エラー修正がありません: ${lesson.id}:${index}`);
  });
  allSnippets.push({ name: `${lesson.id}:starter`, code: lesson.starterCode });

  for (const practice of lesson.practices) {
    practiceCount += 1;
    assert(!practiceIds.has(practice.id), `practice IDが重複しています: ${practice.id}`);
    practiceIds.add(practice.id);
    assert(typeof practice.title === "string" && practice.title.length > 0, `練習問題titleがありません: ${practice.id}`);
    assert(typeof practice.prompt === "string" && practice.prompt.length > 0, `問題文がありません: ${practice.id}`);
    assert(typeof practice.starterCode === "string" && practice.starterCode.length > 0, `開始コードがありません: ${practice.id}`);
    assert(["基礎", "標準", "発展"].includes(practice.difficulty), `練習問題の難度が不正です: ${practice.id}`);
    assert(Array.isArray(practice.hints) && practice.hints.length >= 1, `ヒントがありません: ${practice.id}`);
    assert(typeof practice.solution === "string" && practice.solution.length > 0, `解答例がありません: ${practice.id}`);
    assert(practice.check && typeof practice.check === "object", `自動判定条件がありません: ${practice.id}`);
    allSnippets.push({ name: `${practice.id}:starter`, code: practice.starterCode });
    allSnippets.push({ name: `${practice.id}:solution`, code: practice.solution });
  }
  afterClassCount += lesson.afterClass.length;
}

const lessonNumbers = COURSE_CONTENT.lessons.map((lesson) => Number.parseInt(lesson.id.split("-")[0], 10));
assert(lessonNumbers.join(",") === Array.from({ length: 23 }, (_, index) => index + 1).join(","), "lesson IDの数値prefixが01〜23の連番ではありません");
for (const session of COURSE_CONTENT.sessions) {
  const orders = COURSE_CONTENT.lessons.filter((lesson) => lesson.session === session.id).map((lesson) => lesson.order);
  assert(orders.join(",") === Array.from({ length: orders.length }, (_, index) => index + 1).join(","), `第${session.id}回内のlesson orderが1からの連番ではありません`);
}
assert(practiceCount === 46, `practice数が46ではありません: ${practiceCount}`);
assert(afterClassCount >= 46, `事後学習問題が不足しています: ${afterClassCount}`);

const expectedEarlyOrder = [
  "01-variables", "02-print", "03-fstrings", "04-list", "05-dict", "06-tuple", "07-methods",
  "08-math", "09-range", "10-for", "11-conditions", "12-if", "13-for-if", "14-def",
];
assert(COURSE_CONTENT.lessons.slice(0, expectedEarlyOrder.length).map((lesson) => lesson.id).join(",") === expectedEarlyOrder.join(","), "ユーザー指定の基礎文法順序と一致しません");

const coveredLessons = new Set();
for (const source of COURSE_CONTENT.sourceCoverage) {
  assert(source.coverage.length >= 3, `資料網羅表の項目が不足しています: ${source.source}`);
  for (const lessonId of source.lessons) {
    assert(lessonIds.has(lessonId), `資料網羅表が存在しないlessonを参照しています: ${lessonId}`);
    coveredLessons.add(lessonId);
  }
}
for (const lessonId of lessonIds) assert(coveredLessons.has(lessonId), `資料網羅表に含まれないlessonがあります: ${lessonId}`);
assert(COURSE_CONTENT.sourceCoverage.some((item) => item.source.includes("オブジェクト指向")), "OOP資料の網羅表がありません");
assert(COURSE_CONTENT.sourceCoverage.some((item) => item.source.includes("NumPyの基本")), "NumPy基礎資料の網羅表がありません");
assert(COURSE_CONTENT.sourceCoverage.some((item) => item.source.includes("データ解析")), "NumPyデータ解析資料の網羅表がありません");
assert(COURSE_CONTENT.sourceCoverage.some((item) => item.source.includes("Matplotlib")), "可視化資料の網羅表がありません");

assert(QUIZ_DATA.questions.length === 98, `小テスト問題数が98ではありません: ${QUIZ_DATA.questions.length}`);
const questionIds = new Set();
for (const question of QUIZ_DATA.questions) {
  assert(!questionIds.has(question.id), `question IDが重複しています: ${question.id}`);
  questionIds.add(question.id);
  assert(question.session >= 1 && question.session <= 7, `questionのsessionが範囲外です: ${question.id}`);
  assert(typeof question.prompt === "string" && question.prompt.length > 0, `question promptがありません: ${question.id}`);
  assert(["基礎", "標準", "発展"].includes(question.difficulty), `question difficultyが不正です: ${question.id}`);
  assert(Array.isArray(question.tags) && question.tags.length >= 1, `question tagがありません: ${question.id}`);
  assert(["single", "multi", "text"].includes(question.type), `question typeが不正です: ${question.id}`);
  assert(Number(question.points) > 0, `配点が不正です: ${question.id}`);
  assert(typeof question.explanation === "string" && question.explanation.length > 0, `解説がありません: ${question.id}`);
  if (question.code) {
    const target = { name: `${question.id}:quiz`, code: question.code };
    if (question.expectsSyntaxError) expectedInvalidSnippets.push(target);
    else allSnippets.push(target);
  }
  if (question.type === "single") {
    assert(Array.isArray(question.options) && question.options.length >= 2, `単一選択肢が不足しています: ${question.id}`);
    assert(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < question.options.length, `単一選択の正答indexが不正です: ${question.id}`);
  } else if (question.type === "multi") {
    assert(Array.isArray(question.options) && question.options.length >= 2, `複数選択肢が不足しています: ${question.id}`);
    assert(Array.isArray(question.answer) && question.answer.length >= 1, `複数選択の正答がありません: ${question.id}`);
    question.answer.forEach((answer) => assert(Number.isInteger(answer) && answer >= 0 && answer < question.options.length, `複数選択の正答indexが不正です: ${question.id}`));
  } else {
    assert(Array.isArray(question.accepted) && question.accepted.length >= 1, `記述式のacceptedがありません: ${question.id}`);
  }
}
for (let session = 1; session <= 7; session += 1) {
  const count = QUIZ_DATA.questions.filter((question) => question.session === session).length;
  assert(count === 14, `第${session}回の小テスト問題が14問ではありません: ${count}`);
}

const parseScript = `
import ast, json, sys
items = json.load(sys.stdin)
errors = []
for item in items:
    try:
        ast.parse(item["code"], filename=item["name"])
    except SyntaxError as exc:
        errors.append({"name": item["name"], "message": exc.msg, "line": exc.lineno, "offset": exc.offset})
print(json.dumps(errors, ensure_ascii=False))
`;
const pythonParse = spawnSync("python3", ["-c", parseScript], { input: JSON.stringify(allSnippets), encoding: "utf8" });
assert(pythonParse.status === 0, `Python構文検査を実行できません: ${pythonParse.stderr}`);
if (pythonParse.status === 0) {
  const syntaxErrors = JSON.parse(pythonParse.stdout || "[]");
  for (const error of syntaxErrors) failures.push(`Python構文エラー ${error.name}:${error.line}: ${error.message}`);
}

const invalidParse = spawnSync("python3", ["-c", parseScript], { input: JSON.stringify(expectedInvalidSnippets), encoding: "utf8" });
assert(invalidParse.status === 0, `意図的なPython構文エラー検査を実行できません: ${invalidParse.stderr}`);
if (invalidParse.status === 0) {
  const syntaxErrors = JSON.parse(invalidParse.stdout || "[]");
  const failedNames = new Set(syntaxErrors.map((error) => error.name));
  for (const item of expectedInvalidSnippets) assert(failedNames.has(item.name), `構文エラーを問うコードが有効なPythonになっています: ${item.name}`);
}

const jsFiles = ["js/app.js", "js/content.js", "js/quiz-bank.js", "js/runtime.js", "js/storage.js", "js/utils.js", "workers/python-worker.mjs", "sw.js"];
for (const file of jsFiles) {
  const result = spawnSync(process.execPath, ["--check", join(root, file)], { encoding: "utf8" });
  assert(result.status === 0, `JavaScript構文エラー ${file}: ${result.stderr}`);
}

const shellCheck = spawnSync("bash", ["-n", join(root, "publish-github-https.command")], { encoding: "utf8" });
assert(shellCheck.status === 0, `HTTPS公開scriptのshell構文エラー: ${shellCheck.stderr}`);

const index = read("index.html");
for (const id of ["appView", "runtimePill", "runtimeStatus", "mainNav", "sidebar", "globalDialog", "toastRegion"]) {
  assert(index.includes(`id="${id}"`), `index.htmlに必須IDがありません: ${id}`);
}
assert(index.includes('type="module" src="./js/app.js"'), "app.jsのmodule読込がありません");

function walkFiles(directory) {
  return readdirSync(directory).flatMap((name) => {
    const absolute = join(directory, name);
    return statSync(absolute).isDirectory() ? walkFiles(absolute) : [absolute];
  });
}

const textExtensions = new Set([".html", ".css", ".js", ".mjs", ".json", ".md", ".txt", ".yml", ".yaml", ".webmanifest", ".gitignore", ".gitattributes", ".nojekyll", ".command", ".sh"]);
const allTextFiles = walkFiles(root)
  .map((absolute) => relative(root, absolute))
  .filter((path) => {
    const filename = path.split("/").at(-1);
    const extension = filename.includes(".") ? `.${filename.split(".").at(-1)}` : `.${filename}`;
    return textExtensions.has(extension) || ["LICENSE", "VERSION", "CHANGELOG.md", "package-lock.json"].includes(filename);
  });
for (const file of allTextFiles) {
  const text = read(file);
  assert(!/\/Users\/[A-Za-z0-9._-]+/.test(text), `個人の絶対PATHが含まれています: ${file}`);
  assert(!/[A-Z]:\\Users\\/i.test(text), `Windowsの個人絶対PATHが含まれています: ${file}`);
  const legacyNames = ["Py" + "Core Lab", "py" + "core-lab"];
  assert(!legacyNames.some((name) => text.toLowerCase().includes(name.toLowerCase())), `旧app名が残っています: ${file}`);
  const unfinishedMarkers = ["TO" + "DO", "FIX" + "ME"];
  assert(!unfinishedMarkers.some((marker) => new RegExp(`\\b${marker}\\b`).test(text)), `未処理マーカーが含まれています: ${file}`);
}

// HTML・Markdownに書かれた相対リンクがrelease内で解決できることを確認する。
function assertRelativeTarget(sourceFile, rawTarget) {
  const target = String(rawTarget || "").trim().replace(/^<|>$/g, "");
  if (!target || target.startsWith("#") || /^(https?:|mailto:|data:|javascript:)/i.test(target)) return;
  const clean = decodeURIComponent(target.split("#")[0].split("?")[0]);
  if (!clean) return;
  const absolute = join(root, dirname(sourceFile), clean);
  assert(existsSync(absolute), `相対リンク先がありません: ${sourceFile} -> ${target}`);
}

for (const match of index.matchAll(/(?:href|src)=["']([^"']+)["']/g)) assertRelativeTarget("index.html", match[1]);
for (const file of allTextFiles.filter((path) => path.endsWith(".md"))) {
  for (const match of read(file).matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) assertRelativeTarget(file, match[1]);
}

const worker = read("workers/python-worker.mjs");
assert(worker.includes("new URL(`../data/${filename}`, self.location.href)"), "同梱データの相対URL読込がありません");
assert(worker.includes("loadPackagesFromImports"), "importに応じたPyodide package読込がありません");
assert(worker.includes("newly generated small files") || worker.includes("Return newly generated small files"), "生成ファイル回収処理がありません");

notes.push(`session ${COURSE_CONTENT.sessions.length}`);
notes.push(`lesson ${COURSE_CONTENT.lessons.length}`);
notes.push(`practice ${practiceCount}`);
notes.push(`after-class ${afterClassCount}`);
notes.push(`quiz ${QUIZ_DATA.questions.length}`);
notes.push(`Python snippets ${allSnippets.length + expectedInvalidSnippets.length}`);
notes.push(`intentional syntax-error snippets ${expectedInvalidSnippets.length}`);

if (failures.length) {
  console.error(`\nLAVi-SPICA validation failed (${failures.length})`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`LAVi-SPICA static validation passed: ${notes.join(" / ")}`);
console.log(`Root: ${relative(process.cwd(), root) || "."}`);
