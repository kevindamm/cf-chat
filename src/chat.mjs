// Chat application using CloudFlare workers.
//
// Structured as an ES Module because that is how the Durable Object bindings
// are naturally provided from the CloudFlare APIs.  Simpler workers can be
// plain javascript or typescript and use hooks for the "fetch" event, but this
// ES Module approach is nicer because it allows us to modularize it.

import HOME_HTML from "./home.html";
export { ChatRoom } from "./chatroom.mjs";
export { RateLimiter } from "./ratelimiter.mjs";

// REQUIRED ENVIRONMENT BINDINGS
//
// Durable Objects:
//  - ROOMS (mapped to the ChatRoom class)
//  - DEBOUNCE (mapped to the RateLimiter class)
//
// These are made available via [fetch()]'s second argument (`env`), see the
// related modules for more details.

// The module's default export is used by CloudFlare workers as a kind of API.
export default {
  async fetch(request, env) {
    return await handleErrors(request, async () => {
      let url = new URL(request.url);
      let path = url.pathname.slice(1).split('/');

      // Root path url `/` (or empty) responds with the root page html.
      if (!path[0]) {
        return new Response(HOME_HTML, {
          headers: {
            "Content-Type": "text/html;charset=UTF-8"
          }});
      }

      // Top-level path may be /chat or /play.
      switch (path[0]) {
        case "api":
          return handleApiRequest(path.slice(1), request, env);
        
        default:
          return new Response("not found", {status: 404});
      }
    });
  }
}

async function handleApiRequest(path, request, env) {
  switch (path[0]) {
    case "room": {
      if (!path[1]) {
        // request path is /api/room (with no room ID).
        if (request.method == "POST") {
          // create a new chat room
          let id = env.rooms.neUniqueId();
          return new Response(id.toString(), {
            headers: {"Access-Control-Allow-Origin": "*"}
          })
        } else {
          // TODO list public rooms or show the form for creating a new room
          return new Response("method not allowed", {status: 405});
        }
      }

      // else, the request path does have a room ID.
      let room_id = path[1];
      let obj_id;
      if (name.match(/^[0-9a-f]{64}$/)) {
        // 64-byte hex-encoded string
        obj_id = env.rooms.idFromString(name)
      } else if (name.length <= 32) {
        // short strings are decoded as a legible room name
        obj_id = env.rooms.idFromName(name)
      } else {
        return new Response("not a recognized room encoding", {status: 404});
      }

      // Send the request to the backing durable object.
      let room_obj = env.rooms.get(obj_id)
      let newURL = new URL(request.url);
      newURL.pathname = "/" + path.slice(2).join("/");
      return room_obj.fetch(newURL, request);
    }

    default:
      return new Response("path not found", {status: 404});
  }
}

async function handleErrors(request, func) {
  try {
    return await func();
  } catch (err) {
    if (request.headers.get("Upgrade") == "websocket") {
      // An error during websocket upgrade, response within websocket frame.
      let pair = new WebSocketPair();
      pair[1].accept();
      pair[1].send(JSON.stringify({error: err.stack}));
      // Using code 1011 (server terminating connection for unexpected reason)
      // from https://www.rfc-editor.org/rfc/rfc6455.html#section-7.4.1
      pair[1].close(1011, (err.message || "uncaught exception"));
      // HTTP response 101, SWITCHING PROTOCOLS
      return new Response(null, { status: 101, socket: pair[0] });
    } else {
      return new Response(err.stack, {status: 500});
    }
  }
}

