"use client";

import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import * as React from "react";

import { cn } from "../../lib/utils";
import { Badge } from "./badge";
import { Checkbox } from "./checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface ComboboxOption {
	value: string;
	label: string;
	description?: string;
	icon?: React.ComponentType<{ className?: string }>;
}

interface ComboboxBaseProps {
	options: ComboboxOption[];
	placeholder?: string;
	emptyText?: string;
	className?: string;
	disabled?: boolean;
}

interface ComboboxSingleProps extends ComboboxBaseProps {
	multiple?: false;
	value?: string;
	onValueChange?: (value: string) => void;
}

interface ComboboxMultipleProps extends ComboboxBaseProps {
	multiple: true;
	value?: string[];
	onValueChange?: (value: string[]) => void;
}

type ComboboxProps = ComboboxSingleProps | ComboboxMultipleProps;

function Combobox({
	options,
	placeholder = "Select...",
	emptyText = "No options available",
	className,
	disabled = false,
	...props
}: ComboboxProps) {
	const [open, setOpen] = React.useState(false);

	const isMultiple = props.multiple === true;
	const selectedValues = isMultiple
		? props.value || []
		: props.value
			? [props.value]
			: [];

	const selectedOptions = options.filter((opt) =>
		selectedValues.includes(opt.value),
	);

	const handleSelect = (optionValue: string) => {
		if (isMultiple) {
			const currentValues = props.value || [];
			const newValues = currentValues.includes(optionValue)
				? currentValues.filter((v) => v !== optionValue)
				: [...currentValues, optionValue];
			props.onValueChange?.(newValues);
		} else {
			props.onValueChange?.(optionValue);
			setOpen(false);
		}
	};

	const handleRemove = (optionValue: string, e: React.MouseEvent) => {
		e.stopPropagation();
		if (isMultiple) {
			const currentValues = props.value || [];
			props.onValueChange?.(currentValues.filter((v) => v !== optionValue));
		}
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild disabled={disabled}>
				<button
					type="button"
					role="combobox"
					aria-expanded={open}
					data-slot="combobox"
					className={cn(
						"border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex min-h-9 w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
						className,
					)}
				>
					<div className="flex flex-1 flex-wrap gap-1">
						{selectedOptions.length === 0 ? (
							<span data-placeholder className="text-muted-foreground">
								{placeholder}
							</span>
						) : isMultiple ? (
							selectedOptions.map((opt) => (
								<Badge
									key={opt.value}
									variant="secondary"
									className="gap-1 pr-1"
								>
									{opt.icon && <opt.icon className="size-3" />}
									{opt.label}
									<span
										role="button"
										tabIndex={0}
										onClick={(e) => handleRemove(opt.value, e)}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												handleRemove(
													opt.value,
													e as unknown as React.MouseEvent,
												);
											}
										}}
										className="hover:bg-muted cursor-pointer rounded-sm"
										aria-label={`Remove ${opt.label}`}
									>
										<XIcon className="size-3" />
									</span>
								</Badge>
							))
						) : (
							<span className="flex items-center gap-2">
								{selectedOptions[0]?.icon &&
									React.createElement(selectedOptions[0].icon, {
										className: "size-4 text-muted-foreground",
									})}
								{selectedOptions[0]?.label}
							</span>
						)}
					</div>
					<ChevronDownIcon className="size-4 shrink-0 opacity-50" />
				</button>
			</PopoverTrigger>
			<PopoverContent
				data-slot="combobox-content"
				className="w-[var(--radix-popover-trigger-width)] p-1"
				align="start"
			>
				{options.length === 0 ? (
					<div className="text-muted-foreground py-6 text-center text-sm">
						{emptyText}
					</div>
				) : (
					<div className="max-h-64 overflow-y-auto">
						{options.map((option) => {
							const isSelected = selectedValues.includes(option.value);
							return (
								<div
									key={option.value}
									role="option"
									aria-selected={isSelected}
									data-slot="combobox-item"
									onClick={() => handleSelect(option.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											handleSelect(option.value);
										}
									}}
									tabIndex={0}
									className={cn(
										"focus:bg-accent focus:text-accent-foreground flex cursor-pointer items-start gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none transition-colors hover:bg-accent",
										isSelected && "bg-accent/50",
									)}
								>
									{isMultiple ? (
										<Checkbox
											checked={isSelected}
											className="mt-0.5 pointer-events-none"
											tabIndex={-1}
										/>
									) : (
										<span className="flex size-4 items-center justify-center">
											{isSelected && <CheckIcon className="size-4" />}
										</span>
									)}
									<div className="flex-1">
										<div className="flex items-center gap-2">
											{option.icon && (
												<option.icon className="size-4 text-muted-foreground" />
											)}
											<span>{option.label}</span>
										</div>
										{option.description && (
											<p className="text-muted-foreground text-xs">
												{option.description}
											</p>
										)}
									</div>
								</div>
							);
						})}
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
}

export { Combobox, type ComboboxOption, type ComboboxProps };
