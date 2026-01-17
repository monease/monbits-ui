import { useCallback, useMemo, useRef, useSyncExternalStore } from "react";

export interface UrlStateConfig<T = unknown> {
	type: "string" | "number" | "boolean" | "array";
	default: T;
	validate?: (value: T) => boolean;
}

export type UrlStateSchema = Record<string, UrlStateConfig>;

type InferStateType<T extends UrlStateSchema> = {
	[K in keyof T]: T[K]["default"];
};

/**
 * Subscribe to URL search params changes using the History API.
 * This allows us to sync state with URL without React Router.
 */
function subscribeToUrlChanges(callback: () => void): () => void {
	window.addEventListener("popstate", callback);
	return () => window.removeEventListener("popstate", callback);
}

/**
 * Get the current URL search params snapshot.
 */
function getUrlSearchParams(): URLSearchParams {
	return new URLSearchParams(window.location.search);
}

/**
 * Custom hook that syncs React state with URL query parameters.
 *
 * Features:
 * - Type-safe state management with generic TypeScript
 * - Supports string, number, boolean, and array types
 * - Omits default values from URL (keeps URLs clean)
 * - Derives state directly from URL (no separate state)
 * - Updates URL when setState is called
 * - Validates values against optional validator function
 * - Invalid values reset to defaults
 * - No React Router dependency (uses vanilla History API)
 *
 * @template T - The schema type
 * @param schema - Configuration object defining the state structure
 * @returns Tuple of [state, setState] similar to useState
 *
 * @example
 * ```typescript
 * const [filters, setFilters] = useUrlState({
 *   status: { type: 'string', default: '' },
 *   page: { type: 'number', default: 1 },
 *   limit: { type: 'number', default: 20, validate: (v) => [10, 20, 50, 100].includes(v as number) },
 *   tags: { type: 'array', default: [] }
 * });
 * ```
 */
export function useUrlState<T extends UrlStateSchema>(
	schema: T,
): [InferStateType<T>, (newState: Partial<InferStateType<T>>) => void] {
	const schemaRef = useRef(schema);

	// Use useSyncExternalStore to subscribe to URL changes
	const searchParams = useSyncExternalStore(
		subscribeToUrlChanges,
		getUrlSearchParams,
		getUrlSearchParams,
	);

	// Derive state directly from URL params - no separate useState needed
	const state = useMemo((): InferStateType<T> => {
		const currentSchema = schemaRef.current;
		const result = {} as InferStateType<T>;

		for (const [key, config] of Object.entries(currentSchema)) {
			const urlValue = searchParams.get(key);

			if (urlValue === null) {
				result[key as keyof InferStateType<T>] = config.default;
				continue;
			}

			let parsedValue: unknown;

			try {
				switch (config.type) {
					case "string":
						parsedValue = urlValue;
						break;

					case "number": {
						const num = Number(urlValue);
						parsedValue = Number.isNaN(num) ? config.default : num;
						break;
					}

					case "boolean":
						parsedValue = urlValue === "true" || urlValue === "1";
						break;

					case "array":
						parsedValue = urlValue
							? urlValue.split(",").filter((item) => item.length > 0)
							: [];
						break;

					default:
						parsedValue = config.default;
				}

				// Validate if validator exists
				if (config.validate && !config.validate(parsedValue)) {
					parsedValue = config.default;
				}
			} catch {
				parsedValue = config.default;
			}

			result[key as keyof InferStateType<T>] =
				parsedValue as InferStateType<T>[keyof InferStateType<T>];
		}

		return result;
	}, [searchParams]);

	// Update URL when state changes
	const updateState = useCallback(
		(newState: Partial<InferStateType<T>>) => {
			const currentSchema = schemaRef.current;
			const newParams = new URLSearchParams(window.location.search);

			for (const [key, value] of Object.entries(newState)) {
				const config = currentSchema[key];
				if (!config) continue;

				// Check if value is default (to omit from URL)
				const isDefault =
					config.type === "array"
						? Array.isArray(value) &&
							Array.isArray(config.default) &&
							value.length === 0 &&
							config.default.length === 0
						: value === config.default;

				if (isDefault) {
					newParams.delete(key);
				} else {
					let urlValue: string;

					switch (config.type) {
						case "string":
							urlValue = String(value);
							break;

						case "number":
							urlValue = String(value);
							break;

						case "boolean":
							urlValue = value ? "true" : "false";
							break;

						case "array":
							urlValue = Array.isArray(value) ? value.join(",") : "";
							break;

						default:
							urlValue = String(value);
					}

					if (urlValue) {
						newParams.set(key, urlValue);
					} else {
						newParams.delete(key);
					}
				}
			}

			// Update URL using History API
			const newUrl = `${window.location.pathname}?${newParams.toString()}`;
			window.history.pushState({}, "", newUrl);

			// Trigger popstate event to notify other listeners
			window.dispatchEvent(new PopStateEvent("popstate"));
		},
		[],
	);

	return [state, updateState];
}
