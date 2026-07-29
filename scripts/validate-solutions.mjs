import { spawnSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { COURSE_CONTENT } from "../js/content.js";
import { POST_STUDY } from "../js/lesson-extensions.js";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const regular = COURSE_CONTENT.lessons.flatMap((lesson) => lesson.practices.map((practice) => ({ ...practice, lessonId: lesson.id, source: "practice" })));
const post = COURSE_CONTENT.lessons.flatMap((lesson) => (POST_STUDY[lesson.id] || []).filter((task) => task.kind === "code").map((task) => ({ ...task, lessonId: lesson.id, source: "post-study" })));
const practices = [...regular, ...post];
const failures = [];

function canonical(value) {
  return String(value ?? "").normalize("NFKC").trim().replace(/\r\n/g, "\n").replace(/[ \t]+/g, " ").replace(/\s*([,\[\]\(\)])\s*/g, "$1").toLowerCase();
}
function evaluate(practice, stdout) {
  const check = practice.check || {};
  const output = String(stdout ?? "").replace(/\r\n/g, "\n").trim();
  const reasons = [];
  if (check.outputEquals != null && canonical(output) !== canonical(check.outputEquals)) reasons.push(`outputEquals: ${JSON.stringify(output)} != ${JSON.stringify(check.outputEquals)}`);
  for (const expected of check.outputContains || []) if (!canonical(output).includes(canonical(expected))) reasons.push(`outputContains: ${JSON.stringify(expected)}`);
  if (check.numericOutput != null) {
    const matches = output.match(/[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/g) || [];
    const actual = Number(matches.at(-1));
    const tolerance = Number(check.tolerance ?? 1e-9);
    if (!Number.isFinite(actual) || Math.abs(actual - Number(check.numericOutput)) > tolerance) reasons.push(`numericOutput: ${actual} != ${check.numericOutput}`);
  }
  for (const required of check.required || []) if (!practice.solution.includes(required)) reasons.push(`required: ${required}`);
  for (const forbidden of check.forbidden || []) if (practice.solution.includes(forbidden)) reasons.push(`forbidden: ${forbidden}`);
  return reasons;
}

const batchRunner = String.raw`
import contextlib, io, json, os, shutil, tempfile, traceback
os.environ.setdefault("MPLBACKEND", "Agg")
payload = json.load(__import__("sys").stdin)
root = payload["root"]
results = {}
for case in payload["cases"]:
    out = io.StringIO(); err = io.StringIO(); error = ""
    old = os.getcwd()
    with tempfile.TemporaryDirectory(prefix="spica-solution-") as work:
        for name in ("experiment.csv", "experiment_missing.csv", "projectile.csv"):
            shutil.copy(os.path.join(root, "data", name), os.path.join(work, name))
        os.chdir(work)
        try:
            namespace = {"__name__": "__main__"}
            with contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
                exec(compile(case["code"], case["id"], "exec"), namespace, namespace)
        except BaseException:
            error = traceback.format_exc()
        finally:
            try:
                import matplotlib.pyplot as plt
                plt.close("all")
            except Exception:
                pass
            os.chdir(old)
    results[case["id"]] = {"stdout": out.getvalue(), "stderr": err.getvalue(), "error": error}
print(json.dumps(results, ensure_ascii=False))
`;

const batch = spawnSync("python3", ["-c", batchRunner], {
  input: JSON.stringify({ root, cases: practices.map((practice) => ({ id: practice.id, code: practice.solution })) }),
  encoding: "utf8",
  timeout: 180_000,
  maxBuffer: 32 * 1024 * 1024,
  env: { ...process.env, MPLBACKEND: "Agg", OPENBLAS_NUM_THREADS: "1", OMP_NUM_THREADS: "1", MKL_NUM_THREADS: "1", NUMEXPR_NUM_THREADS: "1", VECLIB_MAXIMUM_THREADS: "1", BLIS_NUM_THREADS: "1" },
});
if (batch.error) failures.push(`Python一括検証を実行できません: ${batch.error.message}`);
if (batch.status !== 0) failures.push(`Python一括検証が異常終了しました: ${batch.stderr}`);
let results = {};
if (!batch.error && batch.status === 0) {
  try { results = JSON.parse(batch.stdout || "{}"); } catch (error) { failures.push(`Python一括検証結果を読めません: ${error.message}`); }
}
for (const practice of practices) {
  const result = results[practice.id];
  if (!result) { failures.push(`${practice.id}: 実行結果がありません`); continue; }
  if (result.error) failures.push(`${practice.id}: Python error\n${result.error}`);
  else {
    const reasons = evaluate(practice, result.stdout);
    if (reasons.length) failures.push(`${practice.id}: ${reasons.join("; ")}`);
  }
}

if (failures.length) {
  console.error(`Solution validation failed (${failures.length})`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`All ${regular.length} lesson practices and ${post.length} post-study coding solutions executed and passed their checks.`);
