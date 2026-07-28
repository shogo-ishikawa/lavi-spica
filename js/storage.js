const STORAGE_KEY = "lavi-spica:v2:student-state";
const LEGACY_STORAGE_KEYS = ["lavi-spica:v1:state", "pycore-lab:v1:state"];
const SCHEMA_VERSION = 2;

function initialState() {
  return {
    schemaVersion: SCHEMA_VERSION,
    completedLessons: [],
    lessonDrafts: {},
    lessonPredictions: {},
    lessonNotes: {},
    exitTickets: {},
    practiceAttempts: {},
    settings: { theme: "dark", fontScale: 1, reduceMotion: false },
    updatedAt: new Date().toISOString(),
  };
}

function objectOrEmpty(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function mergeState(value) {
  const base = initialState();
  if (!value || typeof value !== "object") return base;
  return {
    ...base,
    completedLessons: Array.isArray(value.completedLessons) ? [...new Set(value.completedLessons)] : [],
    lessonDrafts: objectOrEmpty(value.lessonDrafts),
    lessonPredictions: objectOrEmpty(value.lessonPredictions),
    lessonNotes: objectOrEmpty(value.lessonNotes),
    exitTickets: objectOrEmpty(value.exitTickets),
    practiceAttempts: objectOrEmpty(value.practiceAttempts),
    settings: { ...base.settings, ...objectOrEmpty(value.settings) },
    updatedAt: value.updatedAt || base.updatedAt,
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
      const current = localStorage.getItem(STORAGE_KEY);
      if (current) return mergeState(JSON.parse(current));
      for (const key of LEGACY_STORAGE_KEYS) {
        const legacy = localStorage.getItem(key);
        if (!legacy) continue;
        const migrated = mergeState(JSON.parse(legacy));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        return migrated;
      }
      return initialState();
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
      const ids = new Set(state.completedLessons);
      if (completed) ids.add(lessonId); else ids.delete(lessonId);
      state.completedLessons = [...ids];
    });
  }

  recordPractice(practiceId, record) {
    this.update((state) => {
      const previous = state.practiceAttempts[practiceId] || { attempts: 0, passed: false, history: [] };
      state.practiceAttempts[practiceId] = {
        attempts: (previous.attempts || 0) + 1,
        passed: Boolean(previous.passed || record.passed),
        bestAt: record.passed ? record.at : previous.bestAt,
        history: [...(previous.history || []), record].slice(-20),
      };
    });
  }

  replace(importedState) {
    this.state = mergeState(importedState);
    this.#persist();
  }

  reset() {
    this.state = initialState();
    this.#persist();
  }
}

export { STORAGE_KEY, SCHEMA_VERSION };
