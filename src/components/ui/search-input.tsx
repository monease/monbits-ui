import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchIcon, XIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { Input } from "./input";
import { Button } from "./button";

interface SearchInputProps {
	placeholder?: string;
	paramName?: string;
	className?: string;
	debounceMs?: number;
}

export function SearchInput({
	placeholder = "Search...",
	paramName = "search",
	className,
	debounceMs = 300,
}: SearchInputProps) {
	const [searchParams, setSearchParams] = useSearchParams();
	const [value, setValue] = useState(() => searchParams.get(paramName) || "");
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const isInitialMount = useRef(true);

	// Sync local state with URL params (for external changes like browser back/forward)
	useEffect(() => {
		const currentValue = searchParams.get(paramName) || "";
		if (currentValue !== value) {
			setValue(currentValue);
		}
	}, [searchParams, paramName]);

	// Debounced search update
	useEffect(() => {
		// Skip on initial mount to avoid triggering search on page load
		if (isInitialMount.current) {
			isInitialMount.current = false;
			return;
		}

		// Clear any existing timeout
		if (debounceRef.current) {
			clearTimeout(debounceRef.current);
		}

		// Set new timeout for debounced update
		debounceRef.current = setTimeout(() => {
			setSearchParams((params) => {
				const trimmedValue = value.trim();
				const currentParam = params.get(paramName);

				// Only update if value actually changed
				if (trimmedValue === (currentParam || "")) {
					return params;
				}

				if (trimmedValue) {
					params.set(paramName, trimmedValue);
				} else {
					params.delete(paramName);
				}
				// Reset pagination when search changes
				params.delete("page");
				return params;
			});
		}, debounceMs);

		// Cleanup timeout on unmount or value change
		return () => {
			if (debounceRef.current) {
				clearTimeout(debounceRef.current);
			}
		};
	}, [value, setSearchParams, paramName, debounceMs]);

	const handleClear = useCallback(() => {
		setValue("");
		// Clear immediately without debounce
		if (debounceRef.current) {
			clearTimeout(debounceRef.current);
		}
		setSearchParams((params) => {
			params.delete(paramName);
			params.delete("page");
			return params;
		});
	}, [setSearchParams, paramName]);

	return (
		<div className={cn("relative", className)}>
			<SearchIcon className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
			<Input
				type="text"
				placeholder={placeholder}
				value={value}
				onChange={(e) => setValue(e.target.value)}
				className={cn("pl-9", value ? "pr-9" : "pr-3")}
			/>
			{value && (
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={handleClear}
					className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
					aria-label="Clear search"
				>
					<XIcon className="size-4" />
				</Button>
			)}
		</div>
	);
}
