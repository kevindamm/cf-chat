// CloudFlare worker as an ES module.

import HTML from "./chat.html";

// Module's default export is used by CloudFlare workers as a kind of API.
export default {
  async fetch(request, env) {
    return await handleErrors(request, async () => {
      let url = new URL(request.url);
      let path = url.pathname.slice(1).split('/');

      if (!path[0]) {
        return new Response(HTML, {
          headers: {"Content-Type": "text/html;charset=UTF-8"}
        })
      }

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

// The ChatRoom (a Durable Object class) coordinates all user interactions with
// a specific chat room.  The room broadcasts messages from each participant to
// all of the others via a Session object for each member in the chat.
export class ChatRoom {
  /* private */ sessions; // map[string]Session
  /* private */ env; // Env (environment bindings)
  /* private */ state; // DurableObjectState
  /* private */ storage; // DurableObjectStorage
  /* private */ lastUpdated; // number

  constructor(state /* DurableObjectState */, env /* Env */) {
    this.sessions = new Map();
    this.env = env;
    this.state = state;
    this.storage = state.storage;

    this.state.getWebSockets().forEach((socket) => {
      let meta = socket.deserializeAttachment();
      let limiterIdString = this.env.limiters.idFromString(meta.limiterId)
      let limiter = new RateLimitedClient(
        () => this.env.limiters.get(limiterIdString),
        // Using error code 1011 as above (server terminating, unexpected)
        // from https://www.rfc-editor.org/rfc/rfc6455.html#section-7.4.1
        err => socket.close(1011, err.stack));

      this.sessions.set(socket, { ...meta, limiter, blocked: [] });
    });

    this.lastUpdated = 0;
  }

  async fetch(request) {
    return await handleErrors(request, async () => {
      let url = new URL(request.url);

      switch (url.pathname) {
        // <room_url>/websocket -- client is trying to create a new ws: connection.
        case "/websocket": {
          if (request.headers.get("Upgrade") != "websocket") {
            return new Response("expected websocket", {status: 400});
          }

          let ip_addr = request.headers.get("CF-Connecting-IP");
          let pair = new WebSocketPair();
          await this.acceptSession(pair[1], ip_addr);

          return new Response(null, {
            status: 101,
            socket: pair[0] })
        }

        default:
          return new Response("not found", {status: 404});
      }
    });
  }

  // accepts the websocket-based connection
  async acceptSession(web_socket, ip_addr) {
    this.state.acceptWebSocket(web_socket);

    let limiter_id = this.env.limiters.idFromName(ip_addr);
    let limiter = new RateLimiterClient(
      () => this.env.limiters.get(limiter_id),
      err => web_socket.close(1011, err.stack));

    let session = { limiter_id, limiter, blocked: [] };
    web_socket.serializeAttachment({
      ...web_socket.deserializeAttachment(),
      limiter_id: limiter_id.toString() });
    this.sessions.set(web_socket, session);

    for (let other_session of this.sessions.values()) {
      if (other_session.name) {
        session.blocked.push(
          JSON.stringify({joined: other_session.name}));
      }
    }

    let storage = await this.storage.list({reverse: true, limit: 100});
    let backlog = [...storage.values()];
    backlog.reverse();
    backlog.forEach(value => {
      session.blocoked.push(value);
    });
  }

  async ws_message(socket, msg) {
    try {
      let session = this.sessions.get(socket);
      if (session.quit) {
        // TODO
      }
    } catch (err) {
      socket.send(JSON.stringify({error: err.stack, message: err.message}));
    }
  }

  async closeOrHandleError(socket) {
    let session = this.sessions.get(socket) || {};
    session.quit = true;
    this.sessions.delete(socket);
    if (session.name) {
      this.broadcast({quit: session.name});
    }
  }

  async webSocketClose(socket /*, code, reason, wasClean */) {
    this.closeOrHandleError(socket);
  }

  async webSocketError(socket /*, error */) {
    this.closeOrHandleError(socket);
  }

  broadcast(message) {
    // convert to JSON string if not already encoded as a string.
    if (typeof message !== "string") {
      message = JSON.stringify(message);
    }

    // safely send the message to all connected sessions
    let quitters = [];
    this.sessions.forEach((session, socket) => {
      if (session.name) {
        try {
          socket.send(message);
        } catch (err) {
          session.quit = true;
          quitters.push(session);
          this.sessions.delete(socket);
        }
      } else {
        session.blocked.push(message);
      }
    });

    quitters.forEach(quitter => {
      if (quitter.name) {
        this.broadcast({quit: quitter.name});
      }
    });
  }
}

