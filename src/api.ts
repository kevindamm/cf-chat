import HOME_HTML from "./home.html";
import FAVICON_BYTES from "./favicon.ico";

// API worker handles publicly-routable URLs; may fetch other workers' routes.
//
// The root URL responds with static HTML that is imported at build time
// (contents of `home.html`).  All other routes are handled by sub-routers
// if the top-most path is known; otherwise the client is forwarded to "/".
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url?.pathname || "/";
    const path = pathname.slice(1).split('/');

    if (!path[0]) {
      return new Response(HOME_HTML, {
        headers: { "Content-Type": "text/html;charset=UTF-8" }});
    }

    if (path.length == 1 && path[0] === "favicon.ico") {
      return new Response(FAVICON_BYTES, {
        headers: { "Content-Type": "image/x-icon" }});
    }

    // otherwise redirect (with GET method) to the root path.
    return Response.redirect("/", 303);
  }

} as ExportedHandler<Env>;