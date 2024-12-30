import HOME_HTML from "./home.html";

// API worker handles publicly-routable URLs; may fetch other workers' routes.
//
// The root URL responds with static HTML that is imported at build time
// (contents of `home.html`).  All other routes are handled by sub-routers
// if the top-most path is known; otherwise the client is forwarded to "/".
export default <ExportedHandler<Env>>{
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url?.pathname || "/";
    const path = pathname.slice(1).split('/');

    if (!path[0]) {
      return new Response(HOME_HTML, {
        headers: { "Content-Type": "text/html;charset=UTF-8" }})
    }

    switch (path[0]) {
      case "chat":
        //...
        return new Response("/chat routes not wired up yet");

      case "auth":
        //...
        return new Response("/auth routes not wired up yet");

      case "play":
        //...
        return new Response("/play routes not wired up yet");
    }

    // otherwise redirect (with GET method) to the root path.
    return Response.redirect("/", 303)
  }
}