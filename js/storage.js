const STORAGE_KEY = "lavi-spica:v1:state";
const ACTIVE_QUIZ_KEY = "lavi-spica:v1:active-quiz";
const SCHEMA_VERSION = 1;

function initialState() {
  return {
    schemaVersion: SCHEMA_VERSION,
    profile: { studentId: "", name: "" },
    completedLessons: [],
    lessonDrafts: {},
    lessonPredictions: {},
    lessonNotes: {},
    exitTickets: {},
    practiceAttempts: {},
    quizHistory: [],
    settings: { theme: "dark", fontScale: 1, reduceMotion: false },
    updatedAt: new Date().toISOString(),
  };
}

function mergeState(value) {
  const base = initialState();
  if (!value || typeof value !== "object") return base;
  return {
    ...base,
    ...value,
    profile: { ...base.profile, ...(value.profile || {}) },
    settings: { ...base.settings, ...(value.settings || {}) },
    completedLessons: Array.isArray(value.completedLessons) ? [...new Set(value.completedLessons)] : [],
    lessonDrafts: value.lessonDrafts && typeof value.lessonDrafts === "object" ? value.lessonDrafts : {},
    lessonPredictions: value.lessonPredictions && typeof value.lessonPredictions === "object" ? value.lessonPredictions : {},
    lessonNotes: value.lessonNotes && typeof value.lessonNotes === "object" ? value.lessonNotes : {},
    exitTickets: value.exitTickets && typeof value.exitTickets === "object" ? value.exitTickets : {},
    practiceAttempts: value.practiceAttempts && typeof value.practiceAttempts === "object" ? value.practiceAttempts : {},
    quizHistory: Array.isArray(value.quizHistory) ? value.quizHistory.slice(-100) : [],
    schemaVersion: SCHEMA_VERSION,
  };
}

export class CourseStore extends EventTarget {
  constructor() {
    super();
    this.state = this.#load();
  }

  #load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? mergeState(JSON.parse(raw)) : initialState();
    } catch (error) {
      console.warn("進捗データを読み込めませんでした", error);
      return initialState();
    }
  }

  #persist() {
    this.state.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (error) {
      console.warn("進捗データを保存できませんでした", error);
    }
    this.dispatchEvent(new CustomEvent("change", { detail: this.snapshot() }));
  }

  snapshot() {
    return structuredClone(this.state);
  }

  update(mutator) {
    const draft = this.snapshot();
    mutator(draft);
    this.state = mergeState(draft);
    this.#persist();
    return this.snapshot();
  }

  setProfile(profile) {
    this.update((state) => { state.profile = { ...state.profile, ...profile }; });
  }

  setSetting(name, value) {
    this.update((state) => { state.settings[name] = value; });
  }

  setDraft(lessonId, code) {
    this.update((state) => { state.lessonDrafts[lessonId] = String(code); });
  }

  setPrediction(lessonId, text) {
    this.update((state) => { state.lessonPredictions[lessonId] = String(text); });
  }

  setLessonNote(lessonId, text) {
    this.update((state) => { state.lessonNotes[lessonId] = String(text); });
  }

  setExitTicket(sessionId, text) {
    this.update((state) => {
      state.exitTickets[String(sessionId)] = { text: String(text), updatedAt: new Date().toISOString() };
    });
  }

  markLesson(lessonId, completed = true) {
    this.update((state) => {
      const set = new Set(state.completedLessons);
      if (completed) set.add(lessonId); else set.delete(lessonId);
      state.completedLessons = [...set];
    });
  }

  recordPractice(practiceId, record) {
    this.update((state) => {
      const previous = state.practiceAttempts[practiceId] || { attempts: 0, passed: false, history: [] };
      const history = [...(previous.history || []), record].slice(-20);
      state.practiceAttempts[practiceId] = {
        attempts: (previous.attempts || 0) + 1,
        passed: Boolean(previous.passed || record.passed),
        bestAt: record.passed ? record.at : previous.bestAt,
        history,
      };
    });
  }

  addQuizRecord(record) {
    this.update((state) => { state.quizHistory = [...state.quizHistory, record].slice(-100); });
  }

  replace(importedState) {
    this.state = mergeState(importedState);
    this.#persist();
  }

  reset() {
    this.state = initialState();
    this.#persist();
    sessionStorage.removeItem(ACTIVE_QUIZ_KEY);
  }

  getActiveQuiz() {
    try {
      const raw = sessionStorage.getItem(ACTIVE_QUIZ_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  setActiveQuiz(data) {
    if (!data) sessionStorage.removeItem(ACTIVE_QUIZ_KEY);
    else sessionStorage.setItem(ACTIVE_QUIZ_KEY, JSON.stringify(data));
  }
}

export { STORAGE_KEY, ACTIVE_QUIZ_KEY, SCHEMA_VERSION };
