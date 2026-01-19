import type * as React from "react";

export type FilterOperator = "is" | "isNot" | "before" | "after";

export type FilterFieldType = "select" | "asyncSelect" | "date";

export interface FilterOption {
	value: string;
	label: string;
	color?: string; // Tailwind color class or hex color
	icon?: React.ReactNode;
}

export interface FilterField {
	id: string;
	label: string;
	type: FilterFieldType;
	icon?: React.ReactNode;
	options?: FilterOption[];
	loadOptions?: (query: string) => Promise<FilterOption[]>;
}

export interface FilterValue {
	field: string;
	operator: FilterOperator;
	value: string;
	label?: string; // Display label for the value
}

export interface FilterBuilderProps {
	fields: FilterField[];
	filters: FilterValue[];
	onFiltersChange: (filters: FilterValue[]) => void;
	className?: string;
	/**
	 * Show search input in the filter dropdown.
	 * Defaults to false. Enable for long lists of fields/options.
	 */
	showSearch?: boolean;
}

export interface UseFilterBuilderOptions {
	initialFilters?: FilterValue[];
	/**
	 * Filter fields - required for URL sync to validate filters
	 */
	fields?: FilterField[];
	/**
	 * URL parameter name for storing filters (default: "filters")
	 */
	paramName?: string;
	/**
	 * Function to get current search params - pass from useSearchParams()[0]
	 */
	searchParams?: URLSearchParams;
	/**
	 * Function to set search params - pass from useSearchParams()[1]
	 */
	setSearchParams?: (
		params: URLSearchParams | ((prev: URLSearchParams) => URLSearchParams),
	) => void;
}

export interface UseFilterBuilderReturn {
	filters: FilterValue[];
	setFilters: (filters: FilterValue[]) => void;
	addFilter: (filter: FilterValue) => void;
	removeFilter: (index: number) => void;
	updateFilter: (index: number, filter: FilterValue) => void;
	clearFilters: () => void;
}
