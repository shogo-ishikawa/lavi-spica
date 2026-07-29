import { clamp } from "../js/utils.js";

export const SESSION_NAMES = new Map([
  [1, "変数・print・f-string"],
  [2, "list・dict・tupleとメソッド"],
  [3, "math・range・for"],
  [4, "比較・if・論理演算"],
  [5, "def・return・デバッグ"],
  [6, "オブジェクトとNumPy基礎"],
  [7, "データ解析とMatplotlib"],
]);

// 学籍番号は自動的に全角から半角へ変換しません。
// 誤入力を見逃さないため、入力された文字列そのものを次の2形式で判定します。
export const NEW_STUDENT_ID_PATTERN = /^2[1-9]B[1-9]1(?:00[1-9]|0[1-9]\d|[12]\d{2})$/;
export const OLD_STUDENT_ID_PATTERN = /^0[1-9](?:00[1-9]|0[1-9]\d|[12]\d{2})$/;
export const TEST_PARTICIPANT_ID_PATTERN = /^TEST-[0-9A-F]{8}$/;

export function normalizeScope(scope) {
  const value = String(scope ?? "1");
  if (value === "all" || value === "diagnostic") return value;
  return SESSION_NAMES.has(Number(value)) ? value : "1";
}

export function scopeName(scope) {
  const normalized = normalizeScope(scope);
  if (normalized === "all") return "全範囲";
  if (normalized === "diagnostic") return "基礎診断";
  return `第${normalized}回範囲：${SESSION_NAMES.get(Number(normalized))}`;
}

export function validateStudentId(value) {
  const raw = String(value ?? "");
  const studentId = raw.trim();
  if (!studentId) return { valid: false, value: "", message: "学籍番号を入力してください。" };
  if (NEW_STUDENT_ID_PATTERN.test(studentId)) return { valid: true, value: studentId, pattern: "new", message: "" };
  if (OLD_STUDENT_ID_PATTERN.test(studentId)) return { valid: true, value: studentId, pattern: "old", message: "" };
  return {
    valid: false,
    value: studentId,
    message: "学籍番号の形式が一致しません。英数字を半角で入力してください（例：21B11001 または 01001）。",
  };
}

export function validateParticipantProfile(profile) {
  if (!profile || typeof profile !== "object") return false;
  const studentId = String(profile.studentId ?? "").trim();
  const idValid = validateStudentId(studentId).valid || TEST_PARTICIPANT_ID_PATTERN.test(studentId);
  return idValid && validateStudentName(profile.name).valid;
}

export function validateStudentName(value) {
  const raw = String(value ?? "");
  const name = raw.trim().replace(/\s+/gu, " ");
  if (!name) return { valid: false, value: "", message: "氏名を入力してください。" };
  if (/[\u0000-\u001f\u007f]/u.test(name)) return { valid: false, value: name, message: "氏名に使用できない制御文字が含まれています。" };
  const visibleLength = Array.from(name.replace(/\s/gu, "")).length;
  if (visibleLength < 2) return { valid: false, value: name, message: "氏名は空白を除いて2文字以上入力してください。" };
  if (Array.from(name).length > 60) return { valid: false, value: name, message: "氏名は60文字以内で入力してください。" };
  return { valid: true, value: name, message: "" };
}

function base64UrlEncode(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value) {
  const normalized = String(value || "").replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function publicQuestionShape(question) {
  const type = String(question.type || "");
  const shaped = {
    id: String(question.id || ""),
    session: Number(question.session),
    type,
    prompt: String(question.prompt || ""),
    code: String(question.code || ""),
    points: Number(question.points || 1),
    difficulty: String(question.difficulty || ""),
  };
  if (Array.isArray(question.options)) shaped.options = question.options.map(String);
  if (type === "code") shaped.starterCode = String(question.starterCode || "");
  return shaped;
}

export function quizQuestionFingerprint(questions) {
  const compact = questions.map(publicQuestionShape);
  const text = JSON.stringify(compact);
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

export function publicQuizQuestion(question) {
  return publicQuestionShape(question);
}

export function encodeQuizPayload(payload) {
  return base64UrlEncode(JSON.stringify(payload));
}

export function decodeQuizPayload(hash = location.hash) {
  const raw = String(hash || "").replace(/^#/, "");
  const encoded = raw.startsWith("q=") ? raw.slice(2) : "";
  if (!encoded) return null;
  try {
    return JSON.parse(base64UrlDecode(encoded));
  } catch {
    return null;
  }
}

export function validQuizQuestion(question) {
  if (!question || typeof question !== "object") return false;
  if (typeof question.id !== "string" || !/^s[1-7]-q\d{2}$/.test(question.id)) return false;
  if (!SESSION_NAMES.has(Number(question.session))) return false;
  if (!["single", "multi", "text", "code"].includes(question.type)) return false;
  if (typeof question.prompt !== "string" || !question.prompt.trim()) return false;
  if (typeof question.code !== "string") return false;
  if (!Number.isFinite(Number(question.points)) || Number(question.points) <= 0 || Number(question.points) > 10) return false;
  if (!["基礎", "標準", "発展"].includes(question.difficulty)) return false;
  if (["single", "multi"].includes(question.type)) {
    if (!Array.isArray(question.options) || question.options.length < 2) return false;
    if (!question.options.every((option) => typeof option === "string" && option.trim().length > 0)) return false;
  }
  if (question.type === "code" && (typeof question.starterCode !== "string" || !question.starterCode.trim())) return false;

  const privateFields = ["answer", "accepted", "explanation", "answerDisplay", "modelCode", "hiddenCode", "tests"];
  return privateFields.every((field) => !Object.hasOwn(question, field));
}

export function normalizeQuizPayload(value) {
  const payload = value;
  if (!payload || payload.format !== "lavi-spica-quiz-link-v2") return null;
  if (typeof payload.appVersion !== "string" || !payload.appVersion) return null;
  if (!payload.config || typeof payload.config !== "object") return null;
  if (!Array.isArray(payload.questions) || payload.questions.length < 3 || payload.questions.length > 8) return null;
  if (!payload.questions.every(validQuizQuestion)) return null;
  if (!payload.questions.some((question) => question.type === "code")) return null;

  const scope = normalizeScope(payload.config.scope);
  const id = String(payload.config.id || "").trim().slice(0, 80);
  const title = String(payload.config.title || "Python確認テスト").trim().slice(0, 80);
  const minutes = clamp(Number(payload.config.minutes) || 8, 3, 20);
  const seed = String(payload.config.seed || "").trim().slice(0, 120);
  if (!id || !seed) return null;

  const questions = payload.questions.map(publicQuizQuestion);
  const fingerprint = quizQuestionFingerprint(questions);
  if (String(payload.fingerprint || "") !== fingerprint) return null;

  return {
    format: payload.format,
    appVersion: payload.appVersion,
    fingerprint,
    config: { id, title, scope, minutes, count: questions.length, seed },
    questions,
  };
}

export function parseQuizPayload(hash = location.hash) {
  return normalizeQuizPayload(decodeQuizPayload(hash));
}

export function validResponse(value) {
  if (!value || value.format !== "lavi-spica-quiz-response-v4") return false;
  if (!value.config || typeof value.config.id !== "string" || typeof value.config.seed !== "string") return false;
  if (typeof value.quizFingerprint !== "string" || !/^[0-9a-f]{8}$/.test(value.quizFingerprint)) return false;
  if (!Array.isArray(value.questionIds) || value.questionIds.length < 3 || value.questionIds.length > 8) return false;
  if (new Set(value.questionIds).size !== value.questionIds.length) return false;
  if (!value.answers || typeof value.answers !== "object" || Array.isArray(value.answers)) return false;
  if (!validateParticipantProfile(value.profile)) return false;
  if (typeof value.startedAt !== "string" || typeof value.submittedAt !== "string") return false;
  if (!Number.isFinite(Number(value.durationSeconds)) || Number(value.durationSeconds) < 0) return false;
  return true;
}
