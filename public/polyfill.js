(function f() {
  // Keep the original polyfill entry point, but do not redirect away from
  // alternate hosts like Vercel preview or production domains.
})();

if (typeof window.queueMicrotask !== "function") {
  window.queueMicrotask = function queueMicrotask(callback) {
    Promise.resolve()
      .then(callback)
      .catch((e) =>
        setTimeout(() => {
          throw e;
        })
      );
  };
}
