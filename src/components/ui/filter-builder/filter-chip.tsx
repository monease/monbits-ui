import { Check, ChevronDown, X } from "lucide-react";
import * as React from "react";
import { cn } from "../../../lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { formatDateValue } from "./filter-utils";
import type { FilterField, FilterOperator, FilterValue } from "./types";

interface FilterChipProps {
	filter: FilterValue;
	field: FilterField;
	onRemove: () => void;
	onUpdate: (filter: FilterValue) => void;
	className?: string;
}

const operatorLabels: Record<string, string> = {
	is: "is",
	isNot: "is not",
	before: "before",
	after: "after",
};

export function FilterChip({
	filter,
	field,
	onRemove,
	onUpdate,
	className,
}: FilterChipProps) {
	const [open, setOpen] = React.useState(false);

	const selectedOption = React.useMemo(() => {
		if (field.type === "date") {
			return { label: formatDateValue(filter.value), value: filter.value };
		}
		if (filter.label) {
			const opt = field.options?.find((o) => o.value === filter.value);
			return {
				label: filter.label,
				value: filter.value,
				color: opt?.color,
				icon: opt?.icon,
			};
		}
		const option = field.options?.find((o) => o.value === filter.value);
		return option || { label: filter.value, value: filter.value };
	}, [field, filter]);

	const handleValueSelect = React.useCallback(
		(value: string, label?: string) => {
			onUpdate({ ...filter, value, label });
			setOpen(false);
		},
		[filter, onUpdate],
	);

	const handleOperatorToggle = React.useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			const newOperator: FilterOperator =
				field.type === "date"
					? filter.operator === "before"
						? "after"
						: "before"
					: filter.operator === "is"
						? "isNot"
						: "is";
			onUpdate({ ...filter, operator: newOperator });
		},
		[field.type, filter, onUpdate],
	);

	return (
		<div
			className={cn(
				"inline-flex items-center gap-1.5 h-7 pl-2 pr-1 rounded-full border bg-muted/40 text-sm",
				className,
			)}
		>
			{/* Field icon + name */}
			<span className="inline-flex items-center gap-1 text-muted-foreground">
				{field.icon && (
					<span className="[&>svg]:h-3.5 [&>svg]:w-3.5">{field.icon}</span>
				)}
				<span>{field.label}</span>
			</span>

			{/* Operator */}
			<button
				type="button"
				onClick={handleOperatorToggle}
				className="px-1.5 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
			>
				{operatorLabels[filter.operator]}
			</button>

			{/* Value dropdown */}
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<button
						type="button"
						className="inline-flex items-center gap-1.5 text-foreground hover:text-foreground/80 transition-colors"
					>
						{selectedOption.color && (
							<span
								className="h-2 w-2 rounded-full shrink-0"
								style={{ backgroundColor: selectedOption.color }}
							/>
						)}
						{selectedOption.icon && (
							<span className="[&>svg]:h-3.5 [&>svg]:w-3.5 shrink-0">
								{selectedOption.icon}
							</span>
						)}
						<span className="font-medium">{selectedOption.label}</span>
						<ChevronDown className="h-3 w-3 text-muted-foreground" />
					</button>
				</PopoverTrigger>
				<PopoverContent className="w-[220px] p-1" align="start" sideOffset={4}>
					<div className="max-h-[300px] overflow-y-auto">
						{field.options?.map((option) => (
							<button
								key={option.value}
								type="button"
								onClick={() => handleValueSelect(option.value, option.label)}
								className={cn(
									"w-full flex items-center gap-2 px-2 py-1.5 rounded-sm text-sm hover:bg-accent transition-colors text-left",
									filter.value === option.value && "bg-accent/50",
								)}
							>
								<span className="w-4 flex items-center justify-center shrink-0">
									{filter.value === option.value && (
										<Check className="h-4 w-4 text-primary" />
									)}
								</span>
								{option.color && (
									<span
										className="h-2.5 w-2.5 rounded-full shrink-0"
										style={{ backgroundColor: option.color }}
									/>
								)}
								{option.icon && (
									<span className="[&>svg]:h-4 [&>svg]:w-4 shrink-0 text-muted-foreground">
										{option.icon}
									</span>
								)}
								<span className="flex-1 truncate">{option.label}</span>
							</button>
						))}
					</div>
				</PopoverContent>
			</Popover>

			{/* Remove button */}
			<button
				type="button"
				onClick={onRemove}
				className="p-0.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
			>
				<X className="h-3.5 w-3.5" />
			</button>
		</div>
	);
}
