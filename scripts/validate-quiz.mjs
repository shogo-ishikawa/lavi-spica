import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { canonicalAnswer } from "../js/utils.js";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const failures = [];
const questionPath = join(root, "teacher/question-bank.js");
const answerPath = join(root, "teacher/answer-key.js");

function publicQuizChecks() {
  const publicBankPath = join(root, "quiz/question-bank.js");
  assert(!existsSync(publicBankPath), "公開quiz directoryに問題バンクがあります");
  const quizJs = existsSync(join(root, "quiz/quiz.js")) ? (awaitRead("quiz/quiz.js")) : "";
  const coreJs = existsSync(join(root, "quiz/quiz-core.js")) ? (awaitRead("quiz/quiz-core.js")) : "";
  assert(!/QUIZ_ANSWER_KEY|answer-key|question-bank|QUESTION_DATA/.test(quizJs), "学生用quiz.jsが問題バンクまたは採点キーを参照しています");
  assert(!/QUIZ_ANSWER_KEY|answer-key|question-bank|QUESTION_DATA/.test(coreJs), "学生用quiz-core.jsが問題バンクまたは採点キーを参照しています");
  assert(coreJs.includes("lavi-spica-quiz-link-v1"), "当日リンクpayloadの形式がありません");
}

function awaitRead(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

publicQuizChecks();

if (!existsSync(questionPath) || !existsSync(answerPath)) {
  if (failures.length) {
    console.error(`\nLAVi-SPICA public quiz validation failed (${failures.length})`);
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
  }
  console.log("The public day-of quiz reader contains neither the question bank nor the answer key.");
  console.log("Instructor-only question and answer execution checks were skipped because teacher/ is absent from this Git checkout.");
  process.exit(0);
}

const { QUESTION_DATA } = await import(`${pathToFileURL(questionPath).href}?validation=${Date.now()}`);

for (const item of QUESTION_DATA.questions) {
  assert(["single", "multi", "text"].includes(item.type), `typeが不正です: ${item.id}`);
  assert(["基礎", "標準", "発展"].includes(item.difficulty), `難度が不正です: ${item.id}`);
  assert(Array.isArray(item.tags) && item.tags.length >= 1, `tagがありません: ${item.id}`);
  assert(!Object.hasOwn(item, "answer"), `問題バンクに正答indexがあります: ${item.id}`);
  assert(!Object.hasOwn(item, "accepted"), `問題バンクにacceptedがあります: ${item.id}`);
  assert(!Object.hasOwn(item, "explanation"), `問題バンクに解説があります: ${item.id}`);
  if (item.options) assert(new Set(item.options).size === item.options.length, `選択肢が重複しています: ${item.id}`);
}
assert(QUESTION_DATA.questions.length === 98, `問題数が98ではありません: ${QUESTION_DATA.questions.length}`);
for (let session = 1; session <= 7; session += 1) {
  assert(QUESTION_DATA.questions.filter((item) => Number(item.session) === session).length === 14, `第${session}回の問題数が14ではありません`);
}

const { QUIZ_ANSWER_KEY } = await import(`${pathToFileURL(answerPath).href}?validation=${Date.now()}`);
assert(QUIZ_ANSWER_KEY.meta.version === QUESTION_DATA.meta.version, "問題バンクと採点キーのversionが一致しません");
assert(Object.keys(QUIZ_ANSWER_KEY.answers).length === QUESTION_DATA.questions.length, "採点キー件数が問題数と一致しません");

const questions = QUESTION_DATA.questions.map((question) => ({ ...question, ...(QUIZ_ANSWER_KEY.answers[question.id] || {}) }));
const questionById = new Map(questions.map((question) => [question.id, question]));

function question(id) {
  const item = questionById.get(id);
  assert(Boolean(item), `小テスト問題が見つかりません: ${id}`);
  return item;
}

function acceptedMatches(item, value) {
  const actual = canonicalAnswer(value);
  return (item.accepted || []).some((candidate) => canonicalAnswer(candidate) === actual);
}

for (const item of questions) {
  assert(Boolean(QUIZ_ANSWER_KEY.answers[item.id]), `採点キーがありません: ${item.id}`);
  assert(typeof item.explanation === "string" && item.explanation.length > 0, `解説がありません: ${item.id}`);
  if (item.type === "single") {
    assert(Number.isInteger(item.answer), `単一選択の正答indexがありません: ${item.id}`);
    assert(item.answer >= 0 && item.answer < item.options.length, `単一選択の正答indexが範囲外です: ${item.id}`);
  }
  if (item.type === "multi") {
    assert(Array.isArray(item.answer) && item.answer.length >= 1, `複数選択の正答がありません: ${item.id}`);
    assert(new Set(item.answer).size === item.answer.length, `複数選択の正答indexが重複しています: ${item.id}`);
    assert(item.answer.every((index) => Number.isInteger(index) && index >= 0 && index < item.options.length), `複数選択の正答indexが範囲外です: ${item.id}`);
  }
  if (item.type === "text") {
    const normalized = (item.accepted || []).map(canonicalAnswer);
    assert(normalized.length >= 1, `記述式acceptedがありません: ${item.id}`);
    assert(normalized.every(Boolean), `記述式acceptedに空文字があります: ${item.id}`);
    assert(new Set(normalized).size === normalized.length, `記述式acceptedが正規化後に重複しています: ${item.id}`);
  }
}

const directTextOutputIds = [
  "s1-q05", "s1-q07", "s1-q11",
  "s2-q02", "s2-q06", "s2-q10",
  "s3-q02", "s3-q09", "s3-q11", "s3-q13",
  "s4-q02", "s4-q06", "s4-q08", "s4-q09", "s4-q11", "s4-q14",
  "s5-q03", "s5-q08", "s5-q14",
  "s6-q02", "s6-q07", "s6-q08", "s6-q12",
  "s7-q06",
];
const directSingleOutputIds = ["s1-q02", "s1-q13"];

const executionCases = new Map();
for (const id of [...directTextOutputIds, ...directSingleOutputIds, "s3-q08", "s1-q09", "s5-q06"]) {
  const item = question(id);
  if (item) executionCases.set(id, item.code);
}
const typeQuestion = question("s1-q14");
if (typeQuestion) executionCases.set("s1-q14:type", `${typeQuestion.code}\nprint(type(result).__name__)\n`);
const repairedQuestion = question("s5-q10");
if (repairedQuestion) executionCases.set("s5-q10:repaired", repairedQuestion.code.replace("len(value)", "len(values)"));
executionCases.set("s7-q03:shape", "import numpy as np\ndata = np.zeros((12, 3))\nprint(data[:, 1].shape)\n");

const batchRunner = String.raw`
import contextlib, io, json, sys
cases = json.load(sys.stdin)
results = {}
for case in cases:
    output = io.StringIO()
    error_output = io.StringIO()
    error_type = None
    error_message = None
    try:
        namespace = {"__name__": "__main__"}
        with contextlib.redirect_stdout(output), contextlib.redirect_stderr(error_output):
            exec(compile(case["code"], case["id"], "exec"), namespace, namespace)
    except BaseException as exc:
        error_type = type(exc).__name__
        error_message = str(exc)
    results[case["id"]] = {
        "stdout": output.getvalue().rstrip("\n"),
        "stderr": error_output.getvalue(),
        "errorType": error_type,
        "errorMessage": error_message,
    }
print(json.dumps(results, ensure_ascii=False))
`;

const batch = spawnSync("python3", ["-c", batchRunner], {
  input: JSON.stringify([...executionCases].map(([id, code]) => ({ id, code }))),
  encoding: "utf8",
  timeout: 60_000,
  maxBuffer: 8 * 1024 * 1024,
  env: {
    ...process.env,
    MPLBACKEND: "Agg",
    OPENBLAS_NUM_THREADS: "1",
    OMP_NUM_THREADS: "1",
    MKL_NUM_THREADS: "1",
    NUMEXPR_NUM_THREADS: "1",
    VECLIB_MAXIMUM_THREADS: "1",
    BLIS_NUM_THREADS: "1",
  },
});

assert(!batch.error, `小テスト検証用Pythonを実行できません: ${batch.error?.message || "unknown error"}`);
assert(batch.status === 0, `小テスト検証用Pythonが異常終了しました: ${batch.stderr}`);
let executionResults = {};
if (!batch.error && batch.status === 0) {
  try {
    executionResults = JSON.parse(batch.stdout || "{}");
  } catch (error) {
    failures.push(`小テスト検証用PythonのJSONを読めません: ${error.message}`);
  }
}

function execution(id) {
  const result = executionResults[id];
  assert(Boolean(result), `検証実行結果がありません: ${id}`);
  return result;
}

for (const id of directTextOutputIds) {
  const item = question(id);
  const result = execution(id);
  if (!item || !result) continue;
  assert(!result.errorType, `${id}のコードが${result.errorType}になりました: ${result.errorMessage}`);
  if (!result.errorType) assert(acceptedMatches(item, result.stdout), `${id}の実出力がacceptedと一致しません: ${JSON.stringify(result.stdout)}`);
}

for (const id of directSingleOutputIds) {
  const item = question(id);
  const result = execution(id);
  if (!item || !result) continue;
  assert(!result.errorType, `${id}のコードが${result.errorType}になりました: ${result.errorMessage}`);
  if (!result.errorType) {
    const selected = item.options[item.answer];
    assert(canonicalAnswer(selected) === canonicalAnswer(result.stdout), `${id}の正答選択肢と実出力が一致しません: ${JSON.stringify(result.stdout)}`);
  }
}

{
  const item = question("s3-q08");
  const result = execution("s3-q08");
  if (item && result) {
    const lineCount = result.stdout ? result.stdout.split(/\r?\n/).length : 0;
    assert(!result.errorType, `s3-q08のコードが${result.errorType}になりました: ${result.errorMessage}`);
    assert(lineCount === 4, `s3-q08の実出力行数が4ではありません: ${lineCount}`);
    assert((item.accepted || []).some((value) => canonicalAnswer(value).startsWith("4")), "s3-q08のacceptedに4行がありません");
  }
}

{
  const item = question("s1-q14");
  const result = execution("s1-q14:type");
  if (item && result) {
    assert(!result.errorType, `s1-q14のコードが${result.errorType}になりました: ${result.errorMessage}`);
    assert(canonicalAnswer(item.options[item.answer]) === canonicalAnswer(result.stdout), `s1-q14の正答型が実行結果と一致しません: ${result.stdout}`);
  }
}

{
  const syntax = execution("s1-q09");
  if (syntax) assert(syntax.errorType === "SyntaxError", `s1-q09がSyntaxErrorではありません: ${syntax.errorType}`);
  const nameError = execution("s5-q06");
  if (nameError) {
    assert(nameError.errorType === "NameError", `s5-q06がNameErrorではありません: ${nameError.errorType}`);
    assert(/time_hours/.test(nameError.errorMessage || ""), "s5-q06のNameErrorがtime_hoursを指していません");
  }
}

{
  const item = question("s5-q10");
  const result = execution("s5-q10:repaired");
  if (item && result) {
    assert(!result.errorType, `s5-q10の修正版が${result.errorType}になりました: ${result.errorMessage}`);
    assert(acceptedMatches(item, result.stdout), `s5-q10の修正版出力がacceptedと一致しません: ${result.stdout}`);
  }
}

{
  const item = question("s7-q03");
  const result = execution("s7-q03:shape");
  if (item && result) {
    assert(!result.errorType, `s7-q03の検証コードが${result.errorType}になりました: ${result.errorMessage}`);
    assert(acceptedMatches(item, result.stdout), `s7-q03のshapeがacceptedと一致しません: ${result.stdout}`);
  }
}

if (failures.length) {
  console.error(`\nLAVi-SPICA quiz validation failed (${failures.length})`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`All ${QUESTION_DATA.questions.length} instructor-only quiz records and answer keys passed structural checks.`);
console.log(`${directTextOutputIds.length + directSingleOutputIds.length} executable output questions matched their registered answers.`);
console.log("Intentional SyntaxError, NameError, repaired-code, line-count, type, and NumPy shape cases passed.");
