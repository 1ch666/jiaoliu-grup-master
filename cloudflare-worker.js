import openNextWorker from "./.open-next/worker.js";

async function tryStaticPage(request, env, pathname) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return null;
  }

  const assetUrl = new URL(request.url);
  assetUrl.pathname = pathname;

  const response = await env.ASSETS.fetch(new Request(assetUrl, request));
  return response.status === 404 ? null : response;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/" || url.pathname === "/index.html") {
      const response = await tryStaticPage(request, env, "/index.html");
      if (response) {
        return response;
      }
    }

    return openNextWorker.fetch(request, env, ctx);
  },

  async scheduled(controller, env, ctx) {
    if (typeof openNextWorker.scheduled === "function") {
      return openNextWorker.scheduled(controller, env, ctx);
    }
  },
};
