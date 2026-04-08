import { describe, expect, it } from "vitest";
import {
	mapFields,
	parseDelimitedData,
	parseMultiLine,
	parseResponse,
	splitFields,
} from "../src/parser.js";

describe("parseResponse", () => {
	it("parses a SUCCESS response", () => {
		const raw = "SUCCESS: external_hangup function set - 1|agent1";
		const result = parseResponse(raw);
		expect(result.type).toBe("SUCCESS");
		expect(result.function).toBe("external_hangup");
		expect(result.message).toBe("function set");
		expect(result.rawData).toBe("1|agent1");
	});

	it("parses an ERROR response", () => {
		const raw = "ERROR: external_dial not valid - 5551234|1|YES|agent1";
		const result = parseResponse(raw);
		expect(result.type).toBe("ERROR");
		expect(result.function).toBe("external_dial");
		expect(result.message).toBe("not valid");
		expect(result.rawData).toBe("5551234|1|YES|agent1");
	});

	it("parses a NOTICE response", () => {
		const raw =
			"NOTICE: recording active - agent1|12345|rec001|server1|2025-01-01|server2|sess1|RECORDING";
		const result = parseResponse(raw);
		expect(result.type).toBe("NOTICE");
		expect(result.function).toBe("recording");
		expect(result.message).toBe("active");
	});

	it("parses VERSION response into typed data", () => {
		const raw =
			"VERSION: 2.0.5-2|BUILD: 90116-1229|DATE: 2009-01-15 14:59:33|EPOCH: 1222020803";
		const result = parseResponse(raw);
		expect(result.type).toBe("SUCCESS");
		expect(result.function).toBe("version");
		expect(result.data).toEqual({
			version: "2.0.5-2",
			build: "90116-1229",
			date: "2009-01-15 14:59:33",
			epoch: "1222020803",
		});
	});

	it("parses Non-Agent API VERSION with extra fields", () => {
		const raw =
			"VERSION: 2.4-34|BUILD: 110424-0854|DATE: 2025-01-15 14:59:33|EPOCH: 1222020803|DST: 0|TZ: -5.00|TZNOW: -5.00|";
		const result = parseResponse(raw);
		expect(result.type).toBe("SUCCESS");
		expect(result.function).toBe("version");
		expect(result.data.version).toBe("2.4-34");
		expect(result.data.build).toBe("110424-0854");
	});

	it("handles response with no data section", () => {
		const raw = "SUCCESS: logout function set";
		const result = parseResponse(raw);
		expect(result.type).toBe("SUCCESS");
		expect(result.function).toBe("logout");
		expect(result.rawData).toBe("");
	});

	it("handles leading/trailing whitespace", () => {
		const raw = "  SUCCESS: test DATA - a|b  \n";
		const result = parseResponse(raw);
		expect(result.type).toBe("SUCCESS");
		expect(result.function).toBe("test");
	});

	it("handles long multi-word messages", () => {
		const raw =
			"ERROR: add_lead USER DOES NOT HAVE PERMISSION TO ADD LEADS TO THE SYSTEM - apiuser|3";
		const result = parseResponse(raw);
		expect(result.type).toBe("ERROR");
		expect(result.function).toBe("add_lead");
		expect(result.message).toBe(
			"USER DOES NOT HAVE PERMISSION TO ADD LEADS TO THE SYSTEM",
		);
		expect(result.rawData).toBe("apiuser|3");
	});

	it("falls back gracefully for unknown formats", () => {
		const raw = "totally unexpected response";
		const result = parseResponse(raw);
		expect(result.type).toBe("SUCCESS");
		expect(result.raw).toBe(raw);
	});
});

describe("splitFields", () => {
	it("splits pipe-delimited data", () => {
		expect(splitFields("a|b|c")).toEqual(["a", "b", "c"]);
	});

	it("handles trailing pipe", () => {
		expect(splitFields("a|b|c|")).toEqual(["a", "b", "c"]);
	});

	it("handles empty fields", () => {
		expect(splitFields("a||c")).toEqual(["a", "", "c"]);
	});

	it("returns empty array for empty string", () => {
		expect(splitFields("")).toEqual([]);
	});

	it("handles single field", () => {
		expect(splitFields("onlyone")).toEqual(["onlyone"]);
	});

	it("handles multiple trailing pipes", () => {
		expect(splitFields("a|b|")).toEqual(["a", "b"]);
	});
});

describe("mapFields", () => {
	it("maps positional fields to named properties", () => {
		const result = mapFields("agent1|12345|2025-01-01", [
			"user",
			"recording_id",
			"date",
		]);
		expect(result).toEqual({
			user: "agent1",
			recording_id: "12345",
			date: "2025-01-01",
		});
	});

	it("handles fewer fields than schema", () => {
		const result = mapFields("a|b", ["x", "y", "z"]);
		expect(result).toEqual({ x: "a", y: "b" });
	});

	it("handles more fields than schema", () => {
		const result = mapFields("a|b|c|d", ["x", "y"]);
		expect(result).toEqual({ x: "a", y: "b" });
	});

	it("skips empty schema keys (placeholder positions)", () => {
		const result = mapFields("a|skip_me|c", ["first", "", "third"]);
		expect(result).toEqual({ first: "a", third: "c" });
		expect("" in result).toBe(false);
	});

	it("handles empty data string", () => {
		const result = mapFields("", ["x", "y"]);
		expect(result).toEqual({});
	});
});

describe("parseMultiLine", () => {
	it("parses multiple lines into separate responses", () => {
		const raw = [
			"SUCCESS: recording_lookup RESULTS - data1|data2",
			"SUCCESS: recording_lookup RESULTS - data3|data4",
		].join("\n");
		const results = parseMultiLine(raw);
		expect(results).toHaveLength(2);
		expect(results[0].rawData).toBe("data1|data2");
		expect(results[1].rawData).toBe("data3|data4");
	});

	it("skips empty lines", () => {
		const raw = "SUCCESS: test DATA - a|b\n\nSUCCESS: test DATA - c|d\n";
		const results = parseMultiLine(raw);
		expect(results).toHaveLength(2);
	});

	it("handles single line", () => {
		const results = parseMultiLine("SUCCESS: test DATA - a|b");
		expect(results).toHaveLength(1);
	});
});

describe("parseDelimitedData", () => {
	it("parses pipe-delimited data without header", () => {
		const data = "a|b|c\nd|e|f";
		const result = parseDelimitedData(data, "pipe", false);
		expect(result.headers).toBeUndefined();
		expect(result.rows).toEqual([
			["a", "b", "c"],
			["d", "e", "f"],
		]);
	});

	it("parses csv data with header", () => {
		const data = "name,age,city\nJohn,30,NYC\nJane,25,LA";
		const result = parseDelimitedData(data, "csv", true);
		expect(result.headers).toEqual(["name", "age", "city"]);
		expect(result.rows).toEqual([
			["John", "30", "NYC"],
			["Jane", "25", "LA"],
		]);
	});

	it("parses tab-delimited data", () => {
		const data = "a\tb\tc";
		const result = parseDelimitedData(data, "tab");
		expect(result.rows).toEqual([["a", "b", "c"]]);
	});

	it("defaults to pipe format", () => {
		const data = "a|b|c";
		const result = parseDelimitedData(data);
		expect(result.rows).toEqual([["a", "b", "c"]]);
	});
});
