import { useMemo } from "react";
import { useUrlState } from "./use-url-state";

export interface UseUrlPaginationOptions {
	/**
	 * Total number of items across all pages
	 */
	totalCount: number;
	/**
	 * Default number of items per page
	 * @default 20
	 */
	defaultLimit?: number;
	/**
	 * Allowed limit values for validation
	 * @default [10, 20, 50, 100]
	 */
	allowedLimits?: number[];
}

export interface PaginationState {
	/**
	 * Current page number (1-indexed)
	 */
	page: number;
	/**
	 * Number of items per page
	 */
	limit: number;
	/**
	 * Computed offset for API queries: (page - 1) * limit
	 */
	offset: number;
}

export interface UseUrlPaginationReturn extends PaginationState {
	/**
	 * Set the current page number
	 */
	setPage: (page: number) => void;
	/**
	 * Set the items per page limit
	 */
	setLimit: (limit: number) => void;
	/**
	 * Total number of pages
	 */
	totalPages: number;
	/**
	 * Whether there is a next page
	 */
	hasNextPage: boolean;
	/**
	 * Whether there is a previous page
	 */
	hasPreviousPage: boolean;
	/**
	 * Go to the next page (if available)
	 */
	nextPage: () => void;
	/**
	 * Go to the previous page (if available)
	 */
	previousPage: () => void;
	/**
	 * Go to the first page
	 */
	firstPage: () => void;
	/**
	 * Go to the last page
	 */
	lastPage: () => void;
	/**
	 * Reset pagination to first page with default limit
	 */
	reset: () => void;
}

/**
 * A wrapper hook specifically for pagination that uses useUrlState.
 *
 * Features:
 * - Syncs page and limit with URL query parameters
 * - Computes offset for API queries: (page - 1) * limit
 * - Validates limit against allowed values
 * - Provides navigation helpers (nextPage, previousPage, etc.)
 * - Auto-corrects invalid page numbers
 *
 * @param options - Configuration options
 * @returns Pagination state and controls
 *
 * @example
 * ```typescript
 * const {
 *   page,
 *   limit,
 *   offset,
 *   totalPages,
 *   setPage,
 *   setLimit,
 *   nextPage,
 *   previousPage
 * } = useUrlPagination({
 *   totalCount: 150,
 *   defaultLimit: 20
 * });
 *
 * // Use offset in API calls
 * const { data } = useQuery({
 *   queryKey: ['items', offset, limit],
 *   queryFn: () => fetchItems({ offset, limit })
 * });
 * ```
 */
export function useUrlPagination(
	options: UseUrlPaginationOptions,
): UseUrlPaginationReturn {
	const {
		totalCount,
		defaultLimit = 20,
		allowedLimits = [10, 20, 50, 100],
	} = options;

	const [pagination, setPagination] = useUrlState({
		page: {
			type: "number",
			default: 1,
			validate: (value) => {
				const num = value as number;
				return Number.isInteger(num) && num >= 1;
			},
		},
		limit: {
			type: "number",
			default: defaultLimit,
			validate: (value) => {
				const num = value as number;
				return allowedLimits.includes(num);
			},
		},
	});

	// Compute derived values
	const totalPages = useMemo(
		() => Math.max(1, Math.ceil(totalCount / pagination.limit)),
		[totalCount, pagination.limit],
	);

	// Clamp page to valid range (derive, don't auto-correct with side effect)
	const page = useMemo(() => {
		if (totalPages > 0 && pagination.page > totalPages) {
			return totalPages;
		}
		return pagination.page;
	}, [pagination.page, totalPages]);

	// Navigation methods
	const setPage = (newPage: number) => {
		const clampedPage = Math.max(1, Math.min(newPage, totalPages));
		setPagination({ page: clampedPage });
	};

	const setLimit = (newLimit: number) => {
		if (!allowedLimits.includes(newLimit)) {
			console.warn(
				`Invalid limit value: ${newLimit}. Allowed values: ${allowedLimits.join(", ")}`,
			);
			return;
		}
		// Reset to page 1 when changing limit to avoid invalid page numbers
		setPagination({ limit: newLimit, page: 1 });
	};

	const nextPage = () => {
		if (page < totalPages) {
			setPagination({ page: page + 1 });
		}
	};

	const previousPage = () => {
		if (page > 1) {
			setPagination({ page: page - 1 });
		}
	};

	const firstPage = () => {
		if (page !== 1) {
			setPagination({ page: 1 });
		}
	};

	const lastPage = () => {
		if (page !== totalPages) {
			setPagination({ page: totalPages });
		}
	};

	const reset = () => {
		setPagination({ page: 1, limit: defaultLimit });
	};

	return {
		page,
		limit: pagination.limit,
		offset: (page - 1) * pagination.limit,
		totalPages,
		hasNextPage: page < totalPages,
		hasPreviousPage: page > 1,
		setPage,
		setLimit,
		nextPage,
		previousPage,
		firstPage,
		lastPage,
		reset,
	};
}
