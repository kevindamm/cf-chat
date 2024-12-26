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


## Uninstalling

To remove the durable objects instances, remove the `[durable_objects]` bindings
and add a deleted_classes property to the `[[migrations]]` section with an
updated version, e.g.:

```toml
[durable_objects]
bindings = [
]

[[migrations]]
tag = "v1" # first version, already defined in repo
new_classes = ["ChatRoom", "RateLimiter"]

[[migrations]]
tag = "v2" # modified version, adding some game actions
new_classes = ["GameState"]

[[migrations]]
tag = "v3" # deletion migration
deleted_classes = ["ChatRoom", "GameState", "RateLimiter"]
```

## Acknowledgements

Special thanks to the contributors of [CloudFlare's demo](https://github.com/cloudflare/workers-chat-demo), on which this is based.
Thanks also to the [TypeScript annotations provided by smorimoto@github](https://github.com/smorimoto/workers-chat-demo/tree/typescript-port)


Both of these primary sources had to be modified significantly to bring their
dependencies and typing up to date, but their license is retained.

## License (BSD-3)

Copyright (c) 2024 Kevin Damm \
portions Copyright (c) 2020 Cloudflare \
All rights reserved.

This repository, and the original work it was partially forked from, are
provided under the BSD 3 Clause license.  Redistribution of either source code
or binaries must include the copyright notice, list of conditions and the
following disclaimer, and the authors may not be used to endorse derivative
works.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS “AS IS” AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

[LICENSE details](./LICENSE)
