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
  return {
    id: String(question.id || ""),
    session: Number(question.session),
    type: String(question.type || ""),
    prompt: String(question.prompt || ""),
    code: String(question.code || ""),
    options: Array.isArray(question.options) ? question.options.map(String) : undefined,
    points: Number(question.points || 1),
    difficulty: String(question.difficulty || ""),
  };
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
  const shaped = publicQuestionShape(question);
  if (!shaped.options) delete shaped.options;
  return shaped;
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
  if (!["single", "multi", "text"].includes(question.type)) return false;
  if (typeof question.prompt !== "string" || !question.prompt.trim()) return false;
  if (typeof question.code !== "string") return false;
  if (!Number.isFinite(Number(question.points)) || Number(question.points) <= 0) return false;
  if (!["基礎", "標準", "発展"].includes(question.difficulty)) return false;
  if (["single", "multi"].includes(question.type)) {
    if (!Array.isArray(question.options) || question.options.length < 2) return false;
    if (!question.options.every((option) => typeof option === "string" && option.length > 0)) return false;
  }
  return !Object.hasOwn(question, "answer")
    && !Object.hasOwn(question, "accepted")
    && !Object.hasOwn(question, "explanation")
    && !Object.hasOwn(question, "answerDisplay");
}

export function parseQuizPayload(hash = location.hash) {
  const payload = decodeQuizPayload(hash);
  if (!payload || payload.format !== "lavi-spica-quiz-link-v1") return null;
  if (typeof payload.appVersion !== "string" || !payload.appVersion) return null;
  if (!payload.config || typeof payload.config !== "object") return null;
  if (!Array.isArray(payload.questions) || payload.questions.length < 3 || payload.questions.length > 30) return null;
  if (!payload.questions.every(validQuizQuestion)) return null;

  const scope = normalizeScope(payload.config.scope);
  const id = String(payload.config.id || "").trim().slice(0, 80);
  const title = String(payload.config.title || "Python確認テスト").trim().slice(0, 80);
  const minutes = clamp(Number(payload.config.minutes) || 20, 5, 60);
  const seed = String(payload.config.seed || "").trim().slice(0, 120);
  if (!id || !seed) return null;

  const questions = payload.questions.map(publicQuizQuestion);
  const fingerprint = quizQuestionFingerprint(questions);
  if (String(payload.fingerprint || "") !== fingerprint) return null;

  return {
    format: payload.format,
    appVersion: payload.appVersion,
    fingerprint,
    config: {
      id,
      title,
      scope,
      minutes,
      count: questions.length,
      seed,
    },
    questions,
  };
}

export function validResponse(value) {
  return Boolean(
    value
    && value.format === "lavi-spica-quiz-response-v3"
    && value.config
    && typeof value.config.id === "string"
    && typeof value.config.seed === "string"
    && typeof value.quizFingerprint === "string"
    && /^[0-9a-f]{8}$/.test(value.quizFingerprint)
    && Array.isArray(value.questionIds)
    && value.answers
    && typeof value.answers === "object"
    && value.profile
    && typeof value.profile.studentId === "string"
    && typeof value.profile.name === "string",
  );
}
