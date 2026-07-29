import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { publicQuizQuestion, quizQuestionFingerprint, validQuizQuestion } from "../quiz/quiz-core.js";
import { seededRandom, shuffled } from "../js/utils.js";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const bankPath = join(root, "teacher/question-bank.js");
const keyPath = join(root, "teacher/answer-key.js");

if (!existsSync(bankPath) || !existsSync(keyPath)) {
  console.log("Public checkout detected: instructor-only quiz bank validation was skipped.");
  process.exit(0);
}

const { QUESTION_DATA } = await import(`${pathToFileURL(bankPath).href}?v=${Date.now()}`);
const { QUIZ_ANSWER_KEY } = await import(`${pathToFileURL(keyPath).href}?v=${Date.now()}`);
const questions = QUESTION_DATA.questions;
const answers = QUIZ_ANSWER_KEY.answers;
const byId = new Map(questions.map((question) => [question.id, question]));

assert(QUESTION_DATA.meta.version === "1.4.0", "問題バンクversionが1.4.0ではありません");
assert(QUIZ_ANSWER_KEY.meta.version === "1.4.0", "採点キーversionが1.4.0ではありません");
assert(QUESTION_DATA.meta.defaultMinutes === 8, "既定時間が8分ではありません");
assert(QUESTION_DATA.meta.defaultCount === 5, "既定問題数が5問ではありません");
assert(questions.length === 56, `問題数が56ではありません: ${questions.length}`);
assert(new Set(questions.map((question) => question.id)).size === questions.length, "問題IDが重複しています");
assert(Object.keys(answers).length === questions.length, "問題数と採点キー数が一致しません");

for (let session = 1; session <= 7; session += 1) {
  const items = questions.filter((question) => question.session === session);
  assert(items.length === 8, `第${session}回が8問ではありません: ${items.length}`);
  assert(items.filter((question) => question.type === "code").length === 2, `第${session}回のコード問題が2問ではありません`);
  assert(items.some((question) => question.type === "code" && question.difficulty === "基礎"), `第${session}回に基礎コード問題がありません`);
}

for (const question of questions) {
  const publicQuestion = publicQuizQuestion(question);
  assert(validQuizQuestion(publicQuestion), `公開問題形式が不正です: ${question.id}`);
  assert(question.prompt.trim().length >= 12, `問題文が短すぎます: ${question.id}`);
  assert(Boolean(answers[question.id]), `採点キーがありません: ${question.id}`);
  const key = answers[question.id];
  assert(key.kind === question.type, `問題typeと採点キーkindが不一致: ${question.id}`);
  assert(typeof key.explanation === "string" && key.explanation.trim().length >= 8, `解説が不足: ${question.id}`);
  for (const privateField of ["answer", "accepted", "answerDisplay", "modelCode", "hiddenCode", "tests", "explanation"]) {
    assert(!Object.hasOwn(publicQuestion, privateField), `公開問題に採点情報があります: ${question.id} ${privateField}`);
  }
  if (question.type === "single") {
    assert(Number.isInteger(key.answer) && key.answer >= 0 && key.answer < question.options.length, `単一選択の正答indexが不正: ${question.id}`);
  } else if (question.type === "multi") {
    assert(Array.isArray(key.answer) && key.answer.length >= 1, `複数選択の正答がありません: ${question.id}`);
    assert(new Set(key.answer).size === key.answer.length, `複数選択の正答が重複: ${question.id}`);
    assert(key.answer.every((index) => Number.isInteger(index) && index >= 0 && index < question.options.length), `複数選択の正答indexが不正: ${question.id}`);
  } else if (question.type === "text") {
    assert(Array.isArray(key.accepted) && key.accepted.length >= 1 && key.accepted.every((value) => String(value).trim()), `短答のacceptedが不正: ${question.id}`);
  } else if (question.type === "code") {
    assert(question.points === 3, `コード問題が3点ではありません: ${question.id}`);
    assert(typeof question.starterCode === "string" && question.starterCode.trim(), `開始コードがありません: ${question.id}`);
    assert(typeof key.modelCode === "string" && key.modelCode.trim(), `解答例コードがありません: ${question.id}`);
    assert(Array.isArray(key.tests) && key.tests.length >= 2, `隠しテストが不足: ${question.id}`);
    const total = key.tests.reduce((sum, test) => sum + Number(test.points || 0), 0);
    assert(Math.abs(total - question.points) < 1e-9, `隠しテスト点が配点と不一致: ${question.id} ${total}/${question.points}`);
  }
}
for (const id of Object.keys(answers)) assert(byId.has(id), `採点キーだけに存在するID: ${id}`);

function quizPool(scope) {
  if (scope === "all") return [...questions];
  if (scope === "diagnostic") return questions.filter((question) => question.difficulty === "基礎");
  return questions.filter((question) => question.session === Number(scope));
}
const DIAGNOSTIC_TAGS = new Set(["エラー", "境界", "デバッグ", "indent", "戻り値", "copy", "reference", "NaN", "順序"]);
function selectQuestions({ scope, count, seed }) {
  const pool = quizPool(scope);
  const safeCount = Math.max(3, Math.min(Number(count) || 5, Math.min(8, pool.length)));
  const codePool = pool.filter((question) => question.type === "code");
  const otherPool = pool.filter((question) => question.type !== "code");
  const codeTarget = Math.min(codePool.length, safeCount >= 7 ? 2 : 1);
  const selected = shuffled(codePool, seededRandom(`${seed}:code`)).slice(0, codeTarget);
  const used = new Set(selected.map((question) => question.id));
  const takeOne = (items, salt) => {
    const available = items.filter((question) => !used.has(question.id));
    const picked = shuffled(available, seededRandom(`${seed}:${salt}`))[0];
    if (picked && selected.length < safeCount) {
      selected.push(picked);
      used.add(picked.id);
    }
  };
  takeOne(otherPool.filter((question) => question.type === "text"), "trace");
  takeOne(otherPool.filter((question) => (question.tags || []).some((tag) => DIAGNOSTIC_TAGS.has(tag))), "diagnostic");
  const remaining = shuffled(otherPool.filter((question) => !used.has(question.id)), seededRandom(`${seed}:objective`));
  selected.push(...remaining.slice(0, Math.max(0, safeCount - selected.length)));
  if (selected.length < safeCount) {
    selected.push(...shuffled(pool.filter((question) => !used.has(question.id)), seededRandom(`${seed}:fill`)).slice(0, safeCount - selected.length));
  }
  return shuffled(selected, seededRandom(`${seed}:order`));
}
for (const scope of ["diagnostic", "all", "1", "2", "3", "4", "5", "6", "7"]) {
  for (const count of [3, 5, 8]) {
    for (let seed = 0; seed < 20; seed += 1) {
      const selected = selectQuestions({ scope, count, seed: `test-${seed}` });
      const expectedCount = Math.min(count, quizPool(scope).length, 8);
      assert(selected.length === expectedCount, `選択数が不正: scope=${scope} count=${count}`);
      assert(new Set(selected.map((item) => item.id)).size === selected.length, `問題選択に重複: scope=${scope} seed=${seed}`);
      assert(selected.some((item) => item.type === "code"), `コード問題が含まれません: scope=${scope} seed=${seed}`);
      if (quizPool(scope).some((item) => item.type === "text")) assert(selected.some((item) => item.type === "text"), `出力追跡問題が含まれません: scope=${scope} seed=${seed}`);
      if (quizPool(scope).some((item) => (item.tags || []).some((tag) => DIAGNOSTIC_TAGS.has(tag)))) assert(selected.some((item) => (item.tags || []).some((tag) => DIAGNOSTIC_TAGS.has(tag))), `誤概念診断問題が含まれません: scope=${scope} seed=${seed}`);
      const publicItems = selected.map(publicQuizQuestion);
      assert(/^[0-9a-f]{8}$/.test(quizQuestionFingerprint(publicItems)), "fingerprint形式が不正です");
    }
  }
}

function canonical(value) {
  return String(value ?? "").normalize("NFKC").trim().replace(/\r\n/g, "\n").replace(/[ \t]+/g, " ").replace(/\s*([,\[\]\(\)])\s*/g, "$1").toLowerCase();
}
function valuesEqual(actual, expected, tolerance = 1e-9) {
  if (typeof expected === "number") return Number.isFinite(Number(actual)) && Math.abs(Number(actual) - expected) <= tolerance;
  if (Array.isArray(expected)) return Array.isArray(actual) && actual.length === expected.length && actual.every((value, index) => valuesEqual(value, expected[index], tolerance));
  if (expected && typeof expected === "object") {
    if (!actual || typeof actual !== "object" || Array.isArray(actual)) return false;
    const keys = Object.keys(expected);
    return keys.length === Object.keys(actual).length && keys.every((key) => valuesEqual(actual[key], expected[key], tolerance));
  }
  return canonical(actual) === canonical(expected);
}

const batchRunner = String.raw`
import contextlib, io, json, math, os, shutil, sys, tempfile, traceback
os.environ.setdefault("MPLBACKEND", "Agg")
payload = json.load(sys.stdin)
root = payload["root"]
results = {}

def clean(v):
    if v is None or isinstance(v, (bool, int, str)):
        return v
    if isinstance(v, float):
        return v if math.isfinite(v) else None
    if isinstance(v, (list, tuple)):
        return [clean(x) for x in v]
    if isinstance(v, dict):
        return {str(k): clean(x) for k, x in v.items()}
    try:
        import numpy as np
        if isinstance(v, np.ndarray): return clean(v.tolist())
        if isinstance(v, np.generic): return clean(v.item())
    except Exception:
        pass
    return None

for case in payload["cases"]:
    namespace = {"__name__": "__main__"}
    out = io.StringIO(); err = io.StringIO(); error = ""; figures = 0
    old = os.getcwd()
    with tempfile.TemporaryDirectory(prefix="spica-quiz-") as work:
        for name in ("experiment.csv", "experiment_missing.csv", "projectile.csv"):
            shutil.copy(os.path.join(root, "data", name), os.path.join(work, name))
        os.chdir(work)
        try:
            with contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
                exec(compile(case["code"], case["id"], "exec"), namespace, namespace)
        except BaseException:
            error = traceback.format_exc()
        try:
            if "matplotlib.pyplot" in sys.modules:
                import matplotlib.pyplot as plt
                figures = len(plt.get_fignums())
                plt.close("all")
        except Exception:
            pass
        os.chdir(old)
    variables = {}
    for k, v in namespace.items():
        if k.startswith("_"):
            continue
        value = clean(v)
        if value is not None:
            variables[k] = value
    results[case["id"]] = {"stdout": out.getvalue().strip(), "stderr": err.getvalue(), "error": error, "figures": figures, "variables": variables}
print(json.dumps(results, ensure_ascii=False, allow_nan=False))
`;

const executionCases = [];
for (const question of questions.filter((item) => item.type === "code")) {
  const key = answers[question.id];
  executionCases.push({ id: `code:${question.id}`, code: `${key.modelCode}\n${key.hiddenCode || ""}` });
}
for (const question of questions.filter((item) => item.type === "text" && item.code)) {
  executionCases.push({ id: `text:${question.id}`, code: question.code });
}
const batch = spawnSync("python3", ["-c", batchRunner], {
  input: JSON.stringify({ root, cases: executionCases }),
  encoding: "utf8",
  timeout: 120_000,
  maxBuffer: 32 * 1024 * 1024,
  env: { ...process.env, MPLBACKEND: "Agg", OPENBLAS_NUM_THREADS: "1", OMP_NUM_THREADS: "1", MKL_NUM_THREADS: "1", NUMEXPR_NUM_THREADS: "1" },
});
let executionResults = {};
if (batch.error || batch.status !== 0) {
  failures.push(`Python一括検証を実行できません: ${batch.error?.message || batch.stderr || `exit ${batch.status}`}`);
} else {
  try { executionResults = JSON.parse(batch.stdout || "{}"); } catch (error) { failures.push(`Python一括検証結果を読めません: ${error.message}`); }
}

function evaluateTest(test, source, execution) {
  const value = test.nameOfVariable ? execution.variables?.[test.nameOfVariable] : undefined;
  const tolerance = Number(test.tolerance ?? 1e-9);
  switch (test.type) {
    case "noError": return !execution.error;
    case "sourceContains": return (Array.isArray(test.expected) ? test.expected : [test.expected]).every((token) => source.includes(token));
    case "sourceNotContains": return (Array.isArray(test.expected) ? test.expected : [test.expected]).every((token) => !source.includes(token));
    case "stdoutEquals": return canonical(execution.stdout) === canonical(test.expected);
    case "stdoutContains": return canonical(execution.stdout).includes(canonical(test.expected));
    case "stdoutNumeric": {
      const values = String(execution.stdout).match(/[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/g) || [];
      return values.length && Math.abs(Number(values.at(-1)) - Number(test.expected)) <= tolerance;
    }
    case "variable": return valuesEqual(value, test.expected, tolerance);
    case "variableType": return test.expected === "dict" ? value && typeof value === "object" && !Array.isArray(value) : typeof value === test.expected;
    case "variableArray": return valuesEqual(value, test.expected, tolerance);
    case "variableArrayFinite": return Array.isArray(value) && value.length > 0 && value.every((item) => Number.isFinite(Number(item)));
    case "variableFinite": return Number.isFinite(Number(value));
    case "figureCount": return Number(execution.figures || 0) >= Number(test.minimum || 1);
    default: return false;
  }
}

let codeValidated = 0;
for (const question of questions.filter((item) => item.type === "code")) {
  const key = answers[question.id];
  const execution = executionResults[`code:${question.id}`];
  assert(Boolean(execution), `${question.id}のPython検証結果がありません`);
  if (!execution) continue;
  assert(!execution.error, `${question.id}の解答例がエラー: ${execution.error}`);
  for (const test of key.tests) assert(evaluateTest(test, key.modelCode, execution), `${question.id}の解答例が隠しテスト不合格: ${test.name}`);
  codeValidated += 1;
}

let textValidated = 0;
for (const question of questions.filter((item) => item.type === "text" && item.code)) {
  const execution = executionResults[`text:${question.id}`];
  assert(Boolean(execution) && !execution.error, `${question.id}の提示コードが実行できません`);
  if (execution && !execution.error) {
    assert(answers[question.id].accepted.some((value) => canonical(value) === canonical(execution.stdout)), `${question.id}の実出力がacceptedと一致しません: ${JSON.stringify(execution.stdout)}`);
    textValidated += 1;
  }
}

if (failures.length) {
  console.error(`\nLAVi-SPICA quiz validation failed (${failures.length})`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`All ${questions.length} curated quiz questions and answer keys passed structural checks.`);
console.log(`${codeValidated} coding model answers passed all hidden tests; ${textValidated} executable short-answer questions matched their answers.`);
console.log("Balanced selection always included coding, output-tracing, and misconception-diagnostic questions across all scopes and tested seeds.");
