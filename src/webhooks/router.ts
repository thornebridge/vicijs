import type { AgentEvent } from "../enums/agent-events.js";
import {
	parseAddLeadCallback,
	parseAgentEvent,
	parseDeadCallCallback,
	parseDispoCallback,
	parseNoAgentCallback,
	parsePauseMaxCallback,
	parseStartCallback,
} from "./parsers.js";
import type {
	AgentEventHandler,
	AgentEventPayload,
	WebhookHandler,
	WebhookHandlerMap,
} from "./types.js";

/** Options for creating a ViciWebhookRouter */
export interface WebhookRouterOptions {
	/**
	 * Query parameter name used to discriminate webhook type when using handle().
	 * Add a static param (e.g., "type=dispo_callback") when configuring callback URLs
	 * in ViciDial to enable auto-detection.
	 * @default "type"
	 */
	typeParam?: string;
}

const PARSERS: Record<string, (input: string | URLSearchParams) => unknown> = {
	agent_event: parseAgentEvent,
	dispo_callback: parseDispoCallback,
	start_call: parseStartCallback,
	no_agent: parseNoAgentCallback,
	add_lead: parseAddLeadCallback,
	dead_call: parseDeadCallCallback,
	pause_max: parsePauseMaxCallback,
};

/**
 * Event-driven webhook router for ViciDial callbacks.
 *
 * Register typed handlers for each webhook type, then call `handle()` or
 * `handleAs()` with incoming URLs/query strings to parse and dispatch.
 *
 * @example
 * ```ts
 * const router = new ViciWebhookRouter();
 *
 * router.on("dispo_callback", (payload) => {
 *   console.log(`Call dispositioned as ${payload.dispo}`);
 * });
 *
 * router.onEvent("call_answered", (payload) => {
 *   console.log(`Agent ${payload.user} answered call`);
 * });
 *
 * // Express: separate routes with handleAs()
 * app.get("/vici/dispo", (req, res) => {
 *   router.handleAs("dispo_callback", req.url);
 *   res.send("OK");
 * });
 *
 * // Or single route with type auto-detection
 * app.get("/vici/webhook", (req, res) => {
 *   router.handle(req.url); // reads ?type= param
 *   res.send("OK");
 * });
 * ```
 */
export class ViciWebhookRouter {
	private readonly typeParam: string;
	private readonly handlers = new Map<string, WebhookHandler<unknown>[]>();
	private readonly eventHandlers = new Map<string, AgentEventHandler[]>();

	constructor(options?: WebhookRouterOptions) {
		this.typeParam = options?.typeParam ?? "type";
	}

	/**
	 * Register a handler for a specific webhook type.
	 * Multiple handlers can be registered per type.
	 */
	on<K extends keyof WebhookHandlerMap>(
		type: K,
		handler: WebhookHandler<WebhookHandlerMap[K]>,
	): this {
		const key = type as string;
		const list = this.handlers.get(key) ?? [];
		list.push(handler as WebhookHandler<unknown>);
		this.handlers.set(key, list);
		return this;
	}

	/**
	 * Register a handler for a specific agent event.
	 * Only fires when the webhook type is "agent_event" AND the event
	 * field matches the specified event name.
	 */
	onEvent(event: AgentEvent, handler: AgentEventHandler): this {
		const list = this.eventHandlers.get(event) ?? [];
		list.push(handler);
		this.eventHandlers.set(event, list);
		return this;
	}

	/** Remove all handlers for a specific webhook type. */
	off<K extends keyof WebhookHandlerMap>(type: K): this {
		this.handlers.delete(type as string);
		return this;
	}

	/** Remove all handlers for a specific agent event. */
	offEvent(event: AgentEvent): this {
		this.eventHandlers.delete(event);
		return this;
	}

	/**
	 * Parse an incoming webhook request and dispatch to registered handlers.
	 *
	 * Determines the webhook type from the configured type query parameter,
	 * parses the payload, and calls all matching handlers.
	 *
	 * @param input - Full URL string, query string, or URLSearchParams
	 * @returns The parsed payload
	 * @throws If the type parameter is missing or unrecognized
	 */
	async handle(input: string | URLSearchParams): Promise<unknown> {
		const params =
			input instanceof URLSearchParams
				? input
				: (() => {
						try {
							return new URL(input).searchParams;
						} catch {
							return new URLSearchParams(input);
						}
					})();

		const type = params.get(this.typeParam);
		if (!type) {
			throw new Error(
				`Missing webhook type parameter "${this.typeParam}" in request`,
			);
		}
		if (!(type in PARSERS)) {
			throw new Error(`Unrecognized webhook type: ${type}`);
		}

		return this.dispatch(type, input);
	}

	/**
	 * Parse and handle with an explicit type override (no type param needed in URL).
	 *
	 * Use this when the webhook type is determined by the HTTP route path
	 * rather than a query parameter.
	 *
	 * @param type - The webhook type
	 * @param input - Full URL string, query string, or URLSearchParams
	 * @returns The parsed payload
	 */
	async handleAs<K extends keyof WebhookHandlerMap>(
		type: K,
		input: string | URLSearchParams,
	): Promise<WebhookHandlerMap[K]> {
		return this.dispatch(type as string, input) as Promise<
			WebhookHandlerMap[K]
		>;
	}

	/** Internal: parse, dispatch type handlers, dispatch event handlers */
	private async dispatch(
		type: string,
		input: string | URLSearchParams,
	): Promise<unknown> {
		const parser = PARSERS[type];
		if (!parser) {
			throw new Error(`Unrecognized webhook type: ${type}`);
		}

		const payload = parser(input);

		const typeHandlers = this.handlers.get(type);
		if (typeHandlers) {
			for (const handler of typeHandlers) {
				await handler(payload);
			}
		}

		if (type === "agent_event") {
			const eventPayload = payload as AgentEventPayload;
			const eventHandlers = this.eventHandlers.get(eventPayload.event);
			if (eventHandlers) {
				for (const handler of eventHandlers) {
					await handler(eventPayload);
				}
			}
		}

		return payload;
	}
}
