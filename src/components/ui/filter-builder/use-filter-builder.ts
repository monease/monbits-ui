import { useCallback, useEffect, useMemo, useState } from "react";
import { parseFilters, serializeFilters } from "./filter-utils";
import type {
	FilterValue,
	UseFilterBuilderOptions,
	UseFilterBuilderReturn,
} from "./types";

/**
 * Hook for managing filter state with optional URL sync.
 *
 * Basic usage (local state only):
 * ```tsx
 * const { filters, setFilters } = useFilterBuilder();
 * ```
 *
 * With URL sync:
 * ```tsx
 * const [searchParams, setSearchParams] = useSearchParams();
 * const { filters, setFilters } = useFilterBuilder({
 *   fields: FILTER_FIELDS,
 *   searchParams,
 *   setSearchParams,
 * });
 * ```
 */
export function useFilterBuilder({
	initialFilters = [],
	fields,
	paramName = "filters",
	searchParams,
	setSearchParams,
}: UseFilterBuilderOptions = {}): UseFilterBuilderReturn {
	const urlSyncEnabled = !!(fields && searchParams && setSearchParams);

	// Parse initial filters from URL if URL sync is enabled
	// biome-ignore lint/correctness/useExhaustiveDependencies: Intentionally run once on mount
	const initialFromUrl = useMemo(() => {
		if (!urlSyncEnabled || !fields) return initialFilters;
		const urlValue = searchParams.get(paramName);
		if (urlValue) {
			return parseFilters(urlValue, fields);
		}
		return initialFilters;
	}, []);

	const [filters, setFiltersState] = useState<FilterValue[]>(initialFromUrl);

	// Sync filters from URL when searchParams change (for back/forward navigation)
	// biome-ignore lint/correctness/useExhaustiveDependencies: filters excluded to avoid infinite loop
	useEffect(() => {
		if (!urlSyncEnabled || !fields) return;

		const urlValue = searchParams.get(paramName);
		const urlFilters = urlValue ? parseFilters(urlValue, fields) : [];

		// Only update if different to avoid infinite loops
		const currentSerialized = serializeFilters(filters);
		const urlSerialized = serializeFilters(urlFilters);

		if (currentSerialized !== urlSerialized) {
			setFiltersState(urlFilters);
		}
	}, [searchParams, paramName, fields, urlSyncEnabled]);

	const setFilters = useCallback(
		(newFilters: FilterValue[]) => {
			setFiltersState(newFilters);

			// Update URL if sync is enabled
			if (urlSyncEnabled && setSearchParams) {
				setSearchParams((prev) => {
					const next = new URLSearchParams(prev);
					const serialized = serializeFilters(newFilters);
					if (serialized) {
						next.set(paramName, serialized);
					} else {
						next.delete(paramName);
					}
					return next;
				});
			}
		},
		[urlSyncEnabled, setSearchParams, paramName],
	);

	const addFilter = useCallback(
		(filter: FilterValue) => {
			const newFilters = [...filters, filter];
			setFilters(newFilters);
		},
		[filters, setFilters],
	);

	const removeFilter = useCallback(
		(index: number) => {
			const newFilters = filters.filter((_, i) => i !== index);
			setFilters(newFilters);
		},
		[filters, setFilters],
	);

	const updateFilter = useCallback(
		(index: number, filter: FilterValue) => {
			const newFilters = filters.map((f, i) => (i === index ? filter : f));
			setFilters(newFilters);
		},
		[filters, setFilters],
	);

	const clearFilters = useCallback(() => {
		setFilters([]);
	}, [setFilters]);

	return {
		filters,
		setFilters,
		addFilter,
		removeFilter,
		updateFilter,
		clearFilters,
	};
}
