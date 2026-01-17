import type { FilterField, FilterOperator, FilterValue } from "./types";

const VALID_OPERATORS: FilterOperator[] = ["is", "isNot", "before", "after"];

export function serializeFilters(filters: FilterValue[]): string {
	if (filters.length === 0) return "";
	// Only store field:operator:value - label is derived from field options
	return filters.map((f) => `${f.field}:${f.operator}:${f.value}`).join(",");
}

export function parseFilters(
	str: string,
	fields: FilterField[],
): FilterValue[] {
	if (!str) return [];

	const fieldMap = new Map(fields.map((f) => [f.id, f]));
	const results: FilterValue[] = [];

	for (const part of str.split(",")) {
		const segments = part.split(":");
		if (segments.length < 3) continue;

		const [field, operator, value] = segments;

		if (!field || !operator || !value) continue;
		const fieldDef = fieldMap.get(field);
		if (!fieldDef) continue;
		if (!VALID_OPERATORS.includes(operator as FilterOperator)) continue;

		// Derive label from field options
		const option = fieldDef.options?.find((o) => o.value === value);
		const label = option?.label;

		const filter: FilterValue = {
			field,
			operator: operator as FilterOperator,
			value,
		};
		if (label) {
			filter.label = label;
		}
		results.push(filter);
	}

	return results;
}

export function getOperatorsForFieldType(
	type: FilterField["type"],
): { value: FilterOperator; label: string }[] {
	switch (type) {
		case "date":
			return [
				{ value: "before", label: "before" },
				{ value: "after", label: "after" },
			];
		default:
			return [
				{ value: "is", label: "is" },
				{ value: "isNot", label: "is not" },
			];
	}
}

export function getDefaultOperator(type: FilterField["type"]): FilterOperator {
	return type === "date" ? "after" : "is";
}

export function formatDateValue(value: string): string {
	if (!value) return "";

	// Handle relative dates
	if (value.startsWith("relative:")) {
		const relative = value.replace("relative:", "");
		switch (relative) {
			case "today":
				return "Today";
			case "7d":
				return "Last 7 days";
			case "30d":
				return "Last 30 days";
			case "thisMonth":
				return "This month";
			default:
				return relative;
		}
	}

	// Handle absolute dates
	try {
		const date = new Date(value);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	} catch {
		return value;
	}
}

export function getRelativeDateValue(relative: string): string {
	const now = new Date();
	switch (relative) {
		case "today":
			return now.toISOString().split("T")[0];
		case "7d": {
			const d = new Date(now);
			d.setDate(d.getDate() - 7);
			return d.toISOString().split("T")[0];
		}
		case "30d": {
			const d = new Date(now);
			d.setDate(d.getDate() - 30);
			return d.toISOString().split("T")[0];
		}
		case "thisMonth": {
			return new Date(now.getFullYear(), now.getMonth(), 1)
				.toISOString()
				.split("T")[0];
		}
		default:
			return relative;
	}
}
