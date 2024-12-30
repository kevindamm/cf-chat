interface Env {
	ROOMS: DurableObjectNamespace<import("./src/chat").ChatRoom>;
	DEBOUNCE: DurableObjectNamespace<import("./src/chat").RateLimiter>;
}