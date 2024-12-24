# [cf-chat] CloudFlare Chat

A chat webapp using websockets and CloudFlare's workers with durable objects,
in TypeScript.  Includes a few examples of non-chat actions (e.g., useful in a
multi-player game or other realtime simulation with streaming updates).

## Dependencies

- a **CloudFlare** account (and a paid account for Durable Objects)

  - D1 may be used instead of Durable Objects; there are tradeoffs, however,
  with respect to when D1 pricing kicks in vs Free quota for D.O. and the 20:1
  request ratio of websocket requests.  The advantages of Durable Objects are
  why it is used in this Workers implementation.

- **Node** (for local dev of workers) and **npm**, **npx**.

- **wrangler** for interacting with CloudFlare (installed via **npx**).

- 


## Setup

1. [ ] authenticate against CF with Wrangler

```console
cf-chat$ npx wrangler login
```

2. [ ] deploy this repo's workers code to your application

```console
cf-chat$ npx wrangler deploy
```

The project ID and other details are found in `wrangler.toml`:

- project ID in `name` and the main entry point in `main` at top-level scope
- durable objects binding
- view HTML in [[rules]]
- associate classes with durable objects in [[migrations]]

3. [ ] Visit `*.workers.dev` subdomain, optional: connect a custom domain.

 - if connecting a custom domain with subdomain, add to routes in `wrangler.toml`

 - [ ] Ensure TLS is turned on, and HSTS, for the domain/subdomain used.

4. [ ] Test the chat interaction (open with multiple browser tabs)


## Adding an action to the chat

<!-- TODO -->
