import { describe, expect, it, vi } from "vitest";
import { ViciWebhookRouter } from "../../src/webhooks/router.js";
import type {
	AgentEventPayload,
	DispoCallbackPayload,
} from "../../src/webhooks/types.js";

describe("ViciWebhookRouter", () => {
	describe("constructor", () => {
		it("creates with default typeParam", () => {
			const router = new ViciWebhookRouter();
			expect(router).toBeInstanceOf(ViciWebhookRouter);
		});

		it("accepts custom typeParam", () => {
			const router = new ViciWebhookRouter({ typeParam: "webhook_type" });
			expect(router).toBeInstanceOf(ViciWebhookRouter);
		});
	});

	describe("on() / handler registration", () => {
		it("registers handler and returns this for chaining", () => {
			const router = new ViciWebhookRouter();
			const result = router
				.on("dispo_callback", () => {})
				.on("agent_event", () => {});
			expect(result).toBe(router);
		});

		it("allows multiple handlers for same type", async () => {
			const router = new ViciWebhookRouter();
			const calls: string[] = [];
			router.on("dispo_callback", () => {
				calls.push("first");
			});
			router.on("dispo_callback", () => {
				calls.push("second");
			});
			await router.handleAs("dispo_callback", "dispo=SALE&lead_id=1");
			expect(calls).toEqual(["first", "second"]);
		});
	});

	describe("onEvent()", () => {
		it("registers handler for specific agent event", async () => {
			const router = new ViciWebhookRouter();
			const handler = vi.fn();
			router.onEvent("call_answered", handler);
			await router.handleAs(
				"agent_event",
				"user=agent1&event=call_answered&lead_id=99",
			);
			expect(handler).toHaveBeenCalledOnce();
			expect(handler.mock.calls[0][0].event).toBe("call_answered");
		});

		it("does not fire for non-matching events", async () => {
			const router = new ViciWebhookRouter();
			const handler = vi.fn();
			router.onEvent("call_answered", handler);
			await router.handleAs("agent_event", "user=agent1&event=dispo_set");
			expect(handler).not.toHaveBeenCalled();
		});

		it("returns this for chaining", () => {
			const router = new ViciWebhookRouter();
			const result = router.onEvent("call_answered", () => {});
			expect(result).toBe(router);
		});
	});

	describe("off() / offEvent()", () => {
		it("removes handlers for a type", async () => {
			const router = new ViciWebhookRouter();
			const handler = vi.fn();
			router.on("dispo_callback", handler);
			router.off("dispo_callback");
			await router.handleAs("dispo_callback", "dispo=SALE");
			expect(handler).not.toHaveBeenCalled();
		});

		it("removes handlers for an event", async () => {
			const router = new ViciWebhookRouter();
			const handler = vi.fn();
			router.onEvent("call_answered", handler);
			router.offEvent("call_answered");
			await router.handleAs("agent_event", "user=agent1&event=call_answered");
			expect(handler).not.toHaveBeenCalled();
		});
	});

	describe("handle()", () => {
		it("routes dispo_callback to correct handler with parsed payload", async () => {
			const router = new ViciWebhookRouter();
			let received: DispoCallbackPayload | null = null;
			router.on("dispo_callback", (p) => {
				received = p;
			});
			await router.handle(
				"https://example.com/webhook?type=dispo_callback&dispo=SALE&lead_id=42&talk_time=300",
			);
			expect(received).not.toBeNull();
			expect(received?.dispo).toBe("SALE");
			expect(received?.lead_id).toBe("42");
			expect(received?.talk_time).toBe("300");
		});

		it("routes agent_event to both type handler and event-specific handler", async () => {
			const router = new ViciWebhookRouter();
			const typeHandler = vi.fn();
			const eventHandler = vi.fn();
			router.on("agent_event", typeHandler);
			router.onEvent("dispo_set", eventHandler);
			await router.handle(
				"type=agent_event&user=agent1&event=dispo_set&message=SALE",
			);
			expect(typeHandler).toHaveBeenCalledOnce();
			expect(eventHandler).toHaveBeenCalledOnce();
		});

		it("returns parsed payload", async () => {
			const router = new ViciWebhookRouter();
			const payload = await router.handle(
				"type=agent_event&user=agent1&event=logged_in",
			);
			expect((payload as AgentEventPayload).user).toBe("agent1");
			expect((payload as AgentEventPayload).event).toBe("logged_in");
		});

		it("throws on missing type param", async () => {
			const router = new ViciWebhookRouter();
			await expect(
				router.handle("user=agent1&event=logged_in"),
			).rejects.toThrow('Missing webhook type parameter "type"');
		});

		it("throws on unrecognized type", async () => {
			const router = new ViciWebhookRouter();
			await expect(
				router.handle("type=unknown_type&user=agent1"),
			).rejects.toThrow("Unrecognized webhook type: unknown_type");
		});

		it("uses custom typeParam", async () => {
			const router = new ViciWebhookRouter({ typeParam: "hook" });
			const handler = vi.fn();
			router.on("dispo_callback", handler);
			await router.handle("hook=dispo_callback&dispo=SALE");
			expect(handler).toHaveBeenCalledOnce();
		});

		it("handles async handlers", async () => {
			const router = new ViciWebhookRouter();
			const order: number[] = [];
			router.on("dispo_callback", async () => {
				await new Promise((r) => setTimeout(r, 10));
				order.push(1);
			});
			router.on("dispo_callback", () => {
				order.push(2);
			});
			await router.handle("type=dispo_callback&dispo=SALE");
			expect(order).toEqual([1, 2]);
		});
	});

	describe("handleAs()", () => {
		it("parses with explicit type — no type param in URL needed", async () => {
			const router = new ViciWebhookRouter();
			const payload = await router.handleAs(
				"dispo_callback",
				"dispo=DNC&lead_id=500",
			);
			expect(payload.dispo).toBe("DNC");
			expect(payload.lead_id).toBe("500");
		});

		it("dispatches to registered handlers", async () => {
			const router = new ViciWebhookRouter();
			const handler = vi.fn();
			router.on("add_lead", handler);
			await router.handleAs("add_lead", "lead_id=999&phone_number=5551234567");
			expect(handler).toHaveBeenCalledOnce();
			expect(handler.mock.calls[0][0].lead_id).toBe("999");
		});
	});

	describe("handle() with URLSearchParams", () => {
		it("accepts URLSearchParams directly", async () => {
			const router = new ViciWebhookRouter();
			const handler = vi.fn();
			router.on("dispo_callback", handler);
			const params = new URLSearchParams(
				"type=dispo_callback&dispo=SALE&lead_id=1",
			);
			await router.handle(params);
			expect(handler).toHaveBeenCalledOnce();
		});
	});

	describe("error propagation", () => {
		it("propagates handler errors to caller", async () => {
			const router = new ViciWebhookRouter();
			router.on("dispo_callback", () => {
				throw new Error("handler failed");
			});
			await expect(
				router.handleAs("dispo_callback", "dispo=SALE"),
			).rejects.toThrow("handler failed");
		});

		it("propagates async handler errors", async () => {
			const router = new ViciWebhookRouter();
			router.on("dispo_callback", async () => {
				throw new Error("async handler failed");
			});
			await expect(
				router.handleAs("dispo_callback", "dispo=SALE"),
			).rejects.toThrow("async handler failed");
		});
	});

	describe("integration", () => {
		it("full flow: build URL, simulate ViciDial substitution, handle", async () => {
			const router = new ViciWebhookRouter();
			const dispos: string[] = [];
			const events: string[] = [];

			router.on("dispo_callback", (p) => {
				dispos.push(p.dispo);
			});
			router.onEvent("call_answered", (p) => {
				events.push(p.user);
			});

			// Simulate ViciDial calling back with substituted values
			await router.handleAs(
				"dispo_callback",
				"dispo=SALE&lead_id=100&phone_number=5551234567&talk_time=45",
			);
			await router.handleAs(
				"agent_event",
				"user=agent42&event=call_answered&lead_id=200",
			);

			expect(dispos).toEqual(["SALE"]);
			expect(events).toEqual(["agent42"]);
		});
	});
});
