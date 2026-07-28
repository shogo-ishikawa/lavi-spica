import { mkdtempSync, cpSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { COURSE_CONTENT } from "../js/content.js";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const practices = COURSE_CONTENT.lessons.flatMap((lesson) => lesson.practices.map((practice) => ({ ...practice, lessonId: lesson.id })));
const failures = [];

function canonical(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .trim()
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\s*([,\[\]\(\)])\s*/g, "$1")
    .toLowerCase();
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

for (const practice of practices) {
  const work = mkdtempSync(join(tmpdir(), `spica-${practice.id}-`));
  try {
    for (const filename of ["experiment.csv", "experiment_missing.csv", "projectile.csv"]) cpSync(join(root, "data", filename), join(work, filename));
    const result = spawnSync("python3", ["-c", practice.solution], {
      cwd: work,
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
      encoding: "utf8",
      timeout: 20_000,
      maxBuffer: 4 * 1024 * 1024,
    });
    if (result.error) failures.push(`${practice.id}: ${result.error.message}`);
    else if (result.status !== 0) failures.push(`${practice.id}: Python exit ${result.status}\n${result.stderr}`);
    else {
      const reasons = evaluate(practice, result.stdout);
      if (reasons.length) failures.push(`${practice.id}: ${reasons.join("; ")}`);
    }
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

if (failures.length) {
  console.error(`Solution validation failed (${failures.length})`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`All ${practices.length} practice solutions executed and passed their checks.`);
