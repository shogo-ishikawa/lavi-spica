import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createHash } from "node:crypto";
import vm from "node:vm";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const gasRoot = join(root, "gas");
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const read = (path) => readFileSync(join(root, path), "utf8");

if (!existsSync(gasRoot)) {
  console.log("Public checkout detected: private Google Apps Script validation was skipped.");
  process.exit(0);
}

const backendFiles = [
  "gas/backend/Config.gs", "gas/backend/Security.gs", "gas/backend/DataStore.gs",
  "gas/backend/QuizLogic.gs", "gas/backend/QuestionBank.gs", "gas/backend/BackendApi.gs",
  "gas/backend/TeacherApi.gs", "gas/backend/Code.gs", "gas/backend/appsscript.json",
];
const gatewayFiles = [
  "gas/gateway/Config.gs", "gas/gateway/GatewayApi.gs", "gas/gateway/Code.gs",
  "gas/gateway/Student.html", "gas/gateway/Teacher.html", "gas/gateway/QRCode.html",
  "gas/gateway/appsscript.json",
];
for (const path of [...backendFiles, ...gatewayFiles, "gas/SETUP_GUIDE.md", "gas/README.md", "gas/THIRD_PARTY_NOTICES.md"]) {
  assert(existsSync(join(root, path)), `GAS必須ファイルがありません: ${path}`);
}

function syntaxCheckScript(source, label) {
  try { new vm.Script(source, { filename: label }); }
  catch (error) { failures.push(`${label} のJavaScript構文エラー: ${error.message}`); }
}
for (const folder of ["gas/backend", "gas/gateway"]) {
  for (const name of readdirSync(join(root, folder)).filter((item) => item.endsWith(".gs"))) {
    syntaxCheckScript(read(`${folder}/${name}`), `${folder}/${name}`);
  }
}
function inlineScripts(path) {
  const html = read(path);
  const scripts = [];
  const pattern = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = pattern.exec(html))) {
    scripts.push(match[1]
      .replace(/<\?!=\s*JSON\.stringify\(boot\)\s*\?>/g, "{}")
      .replace(/<\?!=[\s\S]*?\?>/g, ""));
  }
  return scripts;
}
for (const path of ["gas/gateway/Student.html", "gas/gateway/Teacher.html", "gas/gateway/QRCode.html"]) {
  const scripts = inlineScripts(path);
  assert(scripts.length >= 1, `${path} にinline scriptがありません`);
  scripts.forEach((source, index) => syntaxCheckScript(source, `${path}#script${index + 1}`));
}

const backendManifest = JSON.parse(read("gas/backend/appsscript.json"));
const gatewayManifest = JSON.parse(read("gas/gateway/appsscript.json"));
assert(backendManifest.runtimeVersion === "V8", "Backend runtimeVersionがV8ではありません");
assert(backendManifest.webapp?.executeAs === "USER_DEPLOYING", "BackendはUSER_DEPLOYINGで実行する必要があります");
assert(backendManifest.webapp?.access === "ANYONE_ANONYMOUS", "Backendは署名付きserver-to-server通信用にANYONE_ANONYMOUSである必要があります");
assert(backendManifest.oauthScopes?.includes("https://www.googleapis.com/auth/spreadsheets"), "BackendにSheets scopeがありません");
assert(gatewayManifest.runtimeVersion === "V8", "Gateway runtimeVersionがV8ではありません");
assert(gatewayManifest.webapp?.executeAs === "USER_ACCESSING", "GatewayはUSER_ACCESSINGで実行する必要があります");
assert(gatewayManifest.webapp?.access === "ANYONE", "Gatewayはログイン済みGoogleユーザー向けANYONEである必要があります");
assert(gatewayManifest.oauthScopes?.includes("https://www.googleapis.com/auth/userinfo.email"), "Gatewayにuserinfo.email scopeがありません");
assert(gatewayManifest.oauthScopes?.includes("https://www.googleapis.com/auth/script.external_request"), "Gatewayにexternal_request scopeがありません");

const backendConfig = read("gas/backend/Config.gs");
const gatewayConfig = read("gas/gateway/Config.gs");
for (const source of [backendConfig, gatewayConfig]) {
  assert(source.includes("1.4.0"), "GAS versionが1.4.0ではありません");
  assert(source.includes("g.nihon-u.ac.jp"), "学生NUメールdomainの既定値がありません");
  assert(source.includes("nihon-u.ac.jp"), "教員NUメールdomainの既定値がありません");
}
for (const phrase of [
  "Classes: ['class_id','class_code','display_name'", "'class_id','session_mode'",
  "defaultClassId", "defaultClassCode: 'UNCLASSIFIED'", "function sessionMode_",
  "submissionGraceSec: 10",
]) assert(backendConfig.includes(phrase), `クラス・移行設定が不足しています: ${phrase}`);

try {
  const configContext = vm.createContext({ PropertiesService:{ getScriptProperties(){ return { getProperty(){return null;}, setProperty(){}, deleteProperty(){} }; } } });
  new vm.Script(backendConfig, { filename:"Config.gs" }).runInContext(configContext);
  assert(configContext.sessionMode_({ session_mode:"test" }) === "test", "sessionMode_がtestを認識しません");
  assert(configContext.sessionMode_({ session_mode:"" }) === "live", "sessionMode_が旧sessionをliveへ移行しません");
} catch (error) { failures.push(`Config helperの実行検査に失敗しました: ${error.message}`); }

const security = read("gas/backend/Security.gs");
for (const phrase of ["computeHmacSha256Signature", "constantTimeEqual_", "API request has expired", "api-nonce:", "NEW_STUDENT_ID_RE_", "OLD_STUDENT_ID_RE_"]) {
  assert(security.includes(phrase), `Backend security実装が不足しています: ${phrase}`);
}
const securityContext = vm.createContext({ Array, String, RegExp, Object });
new vm.Script(security, { filename:"Security.gs" }).runInContext(securityContext);
for (const id of ["21B11001", "29B91009", "21B11299", "01001", "09299"]) assert(securityContext.validateStudentId_(id).valid, `GASが有効な学籍番号を拒否します: ${id}`);
for (const id of ["20B11001", "21b11001", "２１Ｂ１１００１", "21B10001", "21B11000", "001", "01000", "10300"]) assert(!securityContext.validateStudentId_(id).valid, `GASが無効な学籍番号を受理します: ${id}`);
for (const name of ["山田太郎", "A B", "AB", "李 明"]) assert(securityContext.validateStudentName_(name).valid, `GASが有効な氏名を拒否します: ${name}`);
for (const name of ["", "A", "山", "   "]) assert(!securityContext.validateStudentName_(name).valid, `GASが無効な氏名を受理します: ${JSON.stringify(name)}`);

const dataStore = read("gas/backend/DataStore.gs");
for (const phrase of [
  "ensureDefaultClass_", "migrateSessionRows_", "exactPrefix", "classById_", "activeClasses_",
  "publicClass_", "testProfile_", "TEST-", "participantProfile_",
]) assert(dataStore.includes(phrase), `DataStoreのクラス・テスト移行が不足しています: ${phrase}`);
try {
  const util = {
    DigestAlgorithm:{ SHA_256:"SHA_256" }, Charset:{ UTF_8:"UTF_8" },
    computeDigest(_algorithm, text){ return [...createHash("sha256").update(String(text)).digest()].map((value)=>value>127?value-256:value); },
  };
  const context = vm.createContext({ Utilities:util, String, Array, Object, JSON, Date, Math });
  new vm.Script(dataStore, { filename:"DataStore.gs" }).runInContext(context);
  const p1 = context.testProfile_("teacher@nihon-u.ac.jp");
  const p2 = context.testProfile_("teacher@nihon-u.ac.jp");
  assert(/^TEST-[0-9A-F]{8}$/.test(p1.studentId), `教員テストID形式が不正です: ${p1.studentId}`);
  assert(p1.studentId === p2.studentId && p1.name === "教員テスト", "教員テストプロフィールが安定していません");
} catch (error) { failures.push(`教員テストプロフィールの実行検査に失敗しました: ${error.message}`); }

const questionContext = vm.createContext({});
new vm.Script(read("gas/backend/QuestionBank.gs"), { filename:"QuestionBank.gs" }).runInContext(questionContext);
const gasBank = JSON.parse(JSON.stringify(questionContext.SPICA_QUESTION_DATA));
const gasKey = JSON.parse(JSON.stringify(questionContext.SPICA_ANSWER_KEY));
assert(gasBank?.meta?.version === "1.4.0", "GAS問題バンクversionが1.4.0ではありません");
assert(gasKey?.meta?.version === "1.4.0", "GAS採点キーversionが1.4.0ではありません");
assert(gasBank?.questions?.length === 56, `GAS問題バンクが56問ではありません: ${gasBank?.questions?.length}`);
assert(Object.keys(gasKey?.answers || {}).length === 56, "GAS採点キーが56件ではありません");
if (existsSync(join(root,"teacher/question-bank.js")) && existsSync(join(root,"teacher/answer-key.js"))) {
  const { QUESTION_DATA } = await import(`${pathToFileURL(join(root,"teacher/question-bank.js")).href}?gas=${Date.now()}`);
  const { QUIZ_ANSWER_KEY } = await import(`${pathToFileURL(join(root,"teacher/answer-key.js")).href}?gas=${Date.now()}`);
  assert(JSON.stringify(gasBank) === JSON.stringify(QUESTION_DATA), "GAS問題バンクとローカル問題バンクが一致しません");
  assert(JSON.stringify(gasKey) === JSON.stringify(QUIZ_ANSWER_KEY), "GAS採点キーとローカル採点キーが一致しません");
}

const backendApi = read("gas/backend/BackendApi.gs");
const teacherApi = read("gas/backend/TeacherApi.gs");
const gatewayApi = read("gas/gateway/GatewayApi.gs");
const gatewayCode = read("gas/gateway/Code.gs");
const studentHtml = read("gas/gateway/Student.html");
const teacherHtml = read("gas/gateway/Teacher.html");
for (const phrase of [
  "testGetStudentState", "testRedeemQr", "testSubmitQuiz", "requestedSession_", "sessionMode_(session)",
  "participantProfile_", "studentEligibility_", "pending_second", "createOrRefreshTicket_",
  "ticket.status)!=='issued'", "すでに回答を提出", "LockService.getScriptLock",
  "quizPayloadForSession_", "/quiz/?bridge=1&sid=", "sessionMode:accessMode", "classCode",
]) assert(backendApi.includes(phrase), `Backendのクラス・教員テスト制御が不足しています: ${phrase}`);
assert(!backendApi.includes("#q="), "クラウド問題がURL fragmentへ埋め込まれています");
assert(backendApi.includes("quizPayload:quizPayloadForSession_(session)"), "問題データが認証後のstateへ渡されていません");

for (const action of [
  "teacherCreateClass", "teacherUpdateClass", "teacherArchiveClass", "teacherCreateSession",
  "teacherCloneSessionAsTest", "teacherOpenCheckpoint", "teacherAdjustCheckpoint", "teacherCloseCheckpoint",
  "teacherSetSecondAuth", "teacherStartQuiz", "teacherAdjustQuiz", "teacherSetGrace", "teacherEndQuiz",
  "teacherCloseSubmissions", "teacherExportBundle", "teacherResetStudent",
]) assert(teacherApi.includes(`function ${action}`), `Backend教員操作がありません: ${action}`);
for (const phrase of [
  "String(row.class_id) === String(classRow.class_id)", "session_mode:mode", "mode=", "test-checkin",
  "pcPortalUrl", "student-test", "test_session_cloned", "（教員テスト）", "response.cloud.classId",
  "response.cloud.sessionMode", "intClamp_(input.minutes,3,20", "intClamp_(input.qrPeriodSec,5,60",
  "intClamp_(input.qrWindowSec,15,300", "intClamp_(input.submissionGraceSec,0,120",
]) assert(teacherApi.includes(phrase), `教員APIのクラス・テスト操作が不足しています: ${phrase}`);

for (const phrase of [
  "Session.getActiveUser().getEmail()", "gatewayTestStudentState", "gatewayTestRedeemQr", "gatewayTestSubmitQuiz",
  "createClass:'teacherCreateClass'", "cloneAsTest:'teacherCloneSessionAsTest'",
]) assert(gatewayApi.includes(phrase), `Gateway APIが不足しています: ${phrase}`);
for (const phrase of ["student-test", "test-checkin", "identity.role!=='teacher'", "testMode:testMode"]) assert(gatewayCode.includes(phrase), `Gateway routeが不足しています: ${phrase}`);
for (const phrase of [
  "教員テスト環境", "TEST_MODE", "gatewayTestStudentState", "gatewayTestRedeemQr", "gatewayTestSubmitQuiz",
  "classLabel", "quizPayload:q.quizPayload", "submitted_pending_second",
]) assert(studentHtml.includes(phrase), `学生側テスト画面が不足しています: ${phrase}`);
assert(!studentHtml.includes("quizPayload:state.preload"), "開始前に問題payloadをpreloadしています");
for (const phrase of [
  "クラス管理", "3Q-Tue3Fri3", "3Q Tue3Fri3", "同じ設定で教員テスト", "教員テスト環境",
  "学生側テスト画面を開く", "テスト記録を初期化", "classFilter", "sessionMode",
  "第2認証を使う", "QR更新間隔（秒）", "送信猶予（秒）", "PCの小テストを開放",
]) assert(teacherHtml.includes(phrase), `教員Gateway画面が不足しています: ${phrase}`);

const setupGuide = read("gas/SETUP_GUIDE.md");
for (const phrase of [
  "5クラス", "3Q-Tue3Fri3", "@nihon-u.ac.jp", "@g.nihon-u.ac.jp", "教員テスト",
  "TEST-", "Classroom", "同時", "active",
]) assert(setupGuide.includes(phrase), `GAS設定ガイドの説明が不足しています: ${phrase}`);

const qrScript = inlineScripts("gas/gateway/QRCode.html")[0];
try {
  const context = vm.createContext({});
  new vm.Script(qrScript,{filename:"QRCode.html"}).runInContext(context);
  assert(typeof context.qrcode === "function", "内蔵QR generatorを初期化できません");
  if (typeof context.qrcode === "function") {
    const code=context.qrcode(0,"M");
    code.addData("https://script.google.com/macros/s/example/exec?mode=test-checkin&sid=test&cp=1");
    code.make();
    const svg=code.createSvgTag(4,4);
    assert(svg.includes("<svg")&&svg.includes("<path")&&svg.length>500,"内蔵QR generatorがSVGを生成できません");
  }
} catch (error) { failures.push(`内蔵QR generatorの実行検査に失敗しました: ${error.message}`); }

const gitignore = read(".gitignore");
for (const pattern of ["teacher/", "gas/", "open-teacher.command", ".spica-cloud-url"]) assert(gitignore.split(/\r?\n/).includes(pattern), `.gitignoreに非公開対象がありません: ${pattern}`);
const publish = read("publish-github-https.command");
for (const phrase of ["teacher/", "gas/", "open-teacher.command", ".spica-cloud-url"]) assert(publish.includes(phrase), `公開scriptが非公開対象を検査していません: ${phrase}`);

if (failures.length) {
  console.error(`\nLAVi-SPICA GAS validation failed (${failures.length})`);
  failures.forEach((failure)=>console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Private GAS validation passed: five-class records, live/test separation, teacher-account student simulation, NU domains, HMAC gateway, rotating QR, configurable one/two authentication, one-use tickets, cloud-only quiz delivery, and 56-question bank.");
