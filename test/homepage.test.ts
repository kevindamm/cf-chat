import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
} from "cloudflare:test";
import { describe, it, expect } from "vitest";
// Could import any other source file/function here
import api_worker from "../src/api";

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe("Hello World worker", () => {
  it("responds with Hello World!", async () => {
    const request = new IncomingRequest("http://example.com");
    const ctx = createExecutionContext();
    var response;

    if (api_worker && api_worker.fetch) {
      response = await api_worker.fetch(request, env, ctx);
    }

    await waitOnExecutionContext(ctx);
    expect(response !== undefined && await response.text()).toContain("id=\"name-form\"");
  });
});
