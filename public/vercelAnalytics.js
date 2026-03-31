// @ts-check

window.va =
  window.va ||
  function () {
    (window.vaq = window.vaq || []).push(arguments);
  };

if (!["localhost", "127.0.0.1"].includes(window.location.hostname)) {
  const analyticsScript = document.createElement("script");
  analyticsScript.defer = true;
  analyticsScript.src = "/_vercel/insights/script.js";
  document.head.appendChild(analyticsScript);
}
