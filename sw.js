const CACHE_NAME = "lavi-spica-v1.7.0-r1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./css/portal.css",
  "./js/app.js",
  "./js/lecture-plan.js",
  "./js/materials.js",
  "./js/example-activities.js",
  "./js/content.js",
  "./js/self-study.js",
  "./js/lesson-extensions.js",
  "./js/runtime.js",
  "./js/storage.js",
  "./js/utils.js",
  "./quiz/index.html",
  "./quiz/quiz.js",
  "./quiz/quiz-core.js",
  "./workers/python-worker.mjs",
  "./assets/logo.svg",
  "./assets/lavi-spica-hero.png",
  "./manifest.webmanifest",
  "./data/experiment.csv",
  "./data/experiment_missing.csv",
  "./data/projectile.csv"
];

async function cacheShellIndividually() {
  const cache = await caches.open(CACHE_NAME);
  await Promise.allSettled(APP_SHELL.map(async (path) => {
    const request = new Request(new URL(path, self.location.href), { cache: "reload" });
    const response = await fetch(request);
    if (response.ok) await cache.put(request, response.clone());
  }));
}

async function putIfUsable(request, response) {
  if (response && response.ok) {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request, fallbackPath = "") {
  try {
    const response = await fetch(request, { cache: "no-store" });
    return await putIfUsable(request, response);
  } catch {
    const cached = await caches.match(request, { ignoreSearch: true });
    if (cached) return cached;
    if (fallbackPath) {
      const fallback = await caches.match(new URL(fallbackPath, self.location.href), { ignoreSearch: true });
      if (fallback) return fallback;
    }
    return new Response("LAVi-SPICAを読み込めません。ネットワーク接続を確認して再読み込みしてください。", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  }
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request, { ignoreSearch: true });
  const network = fetch(request)
    .then((response) => putIfUsable(request, response))
    .catch(() => null);
  return cached || (await network) || new Response("", { status: 504 });
}

self.addEventListener("install", (event) => {
  event.waitUntil(cacheShellIndividually().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith("lavi-spica-") && key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    const fallback = url.pathname.includes("/quiz/") ? "./quiz/index.html" : "./index.html";
    event.respondWith(networkFirst(request, fallback));
    return;
  }

  const mutableAsset = /\.(?:js|mjs|css|json|webmanifest)$/i.test(url.pathname)
    || url.pathname.endsWith("/sw.js")
    || url.pathname.includes("/workers/");
  if (mutableAsset) {
    event.respondWith(networkFirst(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});
