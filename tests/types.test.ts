import { describe, expect, it } from "vitest";
import { blank, toApiParams } from "../src/types.js";

describe("toApiParams", () => {
	it("converts camelCase keys to snake_case", () => {
		const result = toApiParams({
			firstName: "John",
			lastName: "Doe",
			phoneNumber: "5551234567",
		});
		expect(result).toEqual({
			first_name: "John",
			last_name: "Doe",
			phone_number: "5551234567",
		});
	});

	it("omits undefined and null values", () => {
		const result = toApiParams({
			firstName: "John",
			lastName: undefined,
			email: null,
		});
		expect(result).toEqual({ first_name: "John" });
	});

	it("converts numbers to strings", () => {
		const result = toApiParams({ listId: 101, rank: 5 });
		expect(result).toEqual({ list_id: "101", rank: "5" });
	});

	it("handles single-word keys", () => {
		const result = toApiParams({ status: "NEW", email: "test@test.com" });
		expect(result).toEqual({ status: "NEW", email: "test@test.com" });
	});

	it("handles empty object", () => {
		expect(toApiParams({})).toEqual({});
	});

	it("handles consecutive uppercase letters", () => {
		const result = toApiParams({ dncCheck: "Y", usacanPrefixCheck: "N" });
		expect(result).toEqual({
			dnc_check: "Y",
			usacan_prefix_check: "N",
		});
	});
});

describe("blank", () => {
	it("returns the ViciDial blank sentinel", () => {
		expect(blank()).toBe("--BLANK--");
	});
});
