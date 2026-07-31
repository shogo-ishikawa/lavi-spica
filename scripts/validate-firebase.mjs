import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const read = (path) => readFileSync(join(root, path), "utf8");

const required = [
  "firebase/firebase.json",
  "firebase/firestore.rules",
  "firebase/firestore.indexes.json",
  "firebase/hosting/index.html",
  "firebase/hosting/teacher.html",
  "firebase/hosting/student.html",
  "firebase/hosting/js/firebase-config.js",
  "firebase/hosting/js/cloud-core.js",
  "firebase/hosting/js/teacher.js",
  "firebase/hosting/js/student.js",
  "firebase/private/question-bank-v1.5.0.json",
  "firebase/configure-firebase.command",
  "firebase/deploy-cloud.command",
  "firebase/SETUP_GUIDE.md",
  "firebase/OPERATIONS_GUIDE.md",
];
required.forEach((path) => assert(existsSync(join(root, path)), `Firebase必須ファイルがありません: ${path}`));

if (existsSync(join(root, "firebase/firestore.rules"))) {
  const rules = read("firebase/firestore.rules");
  for (const phrase of [
    "g\\\\.nihon-u\\\\.ac\\\\.jp",
    "email_verified",
    "firebase.sign_in_provider",
    "sessionSecrets",
    "assistanceRequests",
    "no-smartphone",
    "hasRequiredBeforeCheckins",
    "quizIsOpen",
    "existsAfter",
    "getAfter",
  ]) assert(rules.includes(phrase), `Firestore Rulesに必要な実装がありません: ${phrase}`);
  assert(!rules.includes("allow read, write: if true"), "Firestore Rulesに全許可があります");
}

if (existsSync(join(root, "firebase/hosting/js/teacher.js"))) {
  const teacher = read("firebase/hosting/js/teacher.js");
  const student = read("firebase/hosting/js/student.js");
  const config = read("firebase/hosting/js/firebase-config.js");
  const core = read("firebase/hosting/js/cloud-core.js");
  const quiz = read("quiz/quiz.js");
  assert(teacher.includes("LAVi-SPICA 教員用管理コンソール"), "教員用タイトルが一致しません");
  assert(teacher.includes("requestAnimationFrame"), "教員画面の描画デバウンスがありません");
  assert(student.includes("request-assistance") && student.includes("no-smartphone"), "スマートフォンなしの個別救済がありません");
  assert(student.includes("isStudentEmail") && config.includes("g.nihon-u.ac.jp"), "学生NUメール制限がありません");
  assert(student.includes("signInWithGoogle") && student.includes("submitCloudResponse"), "Google認証またはクラウド提出がありません");
  assert(core.includes('prompt: "select_account"') && core.indexOf("signInWithPopup") < core.indexOf("signInWithRedirect(auth, provider)"), "アカウント選択付きpopup優先認証がありません");
  assert(quiz.includes('.web.app') && quiz.includes('.firebaseapp.com'), "Firebase Hostingからのquiz bridgeが許可されていません");
}

if (existsSync(join(root, "firebase/private/question-bank-v1.5.0.json"))) {
  const bank = JSON.parse(read("firebase/private/question-bank-v1.5.0.json"));
  assert(bank.appVersion === "1.5.0", "Firebase問題バンクversionが一致しません");
  assert(Array.isArray(bank.records) && bank.records.length === 56, "Firebase問題バンクが56問ではありません");
  assert(bank.records.every((item) => item.id && item.public && item.answer), "Firebase問題バンクの構造が不正です");
}

if (failures.length) {
  console.error(`Firebase validation failed (${failures.length})`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Firebase validation passed: private Google-owned cloud, exact student domain, real-time console, QR and teacher-approved fallback.");
