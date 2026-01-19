import { X } from "lucide-react";
import * as React from "react";
import { cn } from "../../../lib/utils";
import { FilterChip } from "./filter-chip";
import { FilterMenu } from "./filter-menu";
import type { FilterBuilderProps, FilterValue } from "./types";

export function FilterBuilder({
	fields,
	filters,
	onFiltersChange,
	className,
	showSearch = false,
}: FilterBuilderProps) {
	const fieldMap = React.useMemo(
		() => new Map(fields.map((f) => [f.id, f])),
		[fields],
	);

	const handleAddFilter = React.useCallback(
		(filter: FilterValue) => {
			onFiltersChange([...filters, filter]);
		},
		[filters, onFiltersChange],
	);

	const handleRemoveFilter = React.useCallback(
		(index: number) => {
			onFiltersChange(filters.filter((_, i) => i !== index));
		},
		[filters, onFiltersChange],
	);

	const handleUpdateFilter = React.useCallback(
		(index: number, filter: FilterValue) => {
			onFiltersChange(filters.map((f, i) => (i === index ? filter : f)));
		},
		[filters, onFiltersChange],
	);

	const handleClearAll = React.useCallback(() => {
		onFiltersChange([]);
	}, [onFiltersChange]);

	return (
		<div className={cn("flex flex-wrap items-center gap-2", className)}>
			{filters.map((filter, index) => {
				const field = fieldMap.get(filter.field);
				if (!field) return null;

				return (
					<FilterChip
						key={`${filter.field}-${index}`}
						filter={filter}
						field={field}
						onRemove={() => handleRemoveFilter(index)}
						onUpdate={(updated) => handleUpdateFilter(index, updated)}
					/>
				);
			})}

			<FilterMenu
				fields={fields}
				onAddFilter={handleAddFilter}
				showSearch={showSearch}
			/>

			{filters.length > 0 && (
				<button
					type="button"
					onClick={handleClearAll}
					className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-full transition-colors shrink-0"
					title="Clear all filters"
				>
					<X className="h-4 w-4" />
				</button>
			)}
		</div>
	);
}
