"use client";

import {
	endOfMonth,
	endOfWeek,
	format,
	startOfMonth,
	startOfWeek,
	subDays,
	subMonths,
	subWeeks,
} from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";

import { cn } from "../../lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface DateRangePickerProps {
	value?: DateRange;
	onChange?: (range: DateRange | undefined) => void;
	className?: string;
	placeholder?: string;
	align?: "start" | "center" | "end";
}

const presets = [
	{
		label: "Last 7 days",
		getValue: () => ({
			from: subDays(new Date(), 6),
			to: new Date(),
		}),
	},
	{
		label: "Last 30 days",
		getValue: () => ({
			from: subDays(new Date(), 29),
			to: new Date(),
		}),
	},
	{
		label: "Last week",
		getValue: () => {
			const lastWeek = subWeeks(new Date(), 1);
			return {
				from: startOfWeek(lastWeek, { weekStartsOn: 1 }),
				to: endOfWeek(lastWeek, { weekStartsOn: 1 }),
			};
		},
	},
	{
		label: "Last month",
		getValue: () => {
			const lastMonth = subMonths(new Date(), 1);
			return {
				from: startOfMonth(lastMonth),
				to: endOfMonth(lastMonth),
			};
		},
	},
];

function DateRangePicker({
	value,
	onChange,
	className,
	placeholder = "Select date range",
	align = "end",
}: DateRangePickerProps) {
	const [open, setOpen] = React.useState(false);

	const handleSelect = (range: DateRange | undefined) => {
		onChange?.(range);
	};

	const handlePresetClick = (preset: (typeof presets)[number]) => {
		const range = preset.getValue();
		onChange?.(range);
		setOpen(false);
	};

	const formatDateRange = (range: DateRange | undefined) => {
		if (!range?.from) return placeholder;
		if (!range.to) return format(range.from, "MMM d, yyyy");

		const fromYear = range.from.getFullYear();
		const toYear = range.to.getFullYear();

		if (fromYear === toYear) {
			return `${format(range.from, "MMM d")} - ${format(range.to, "MMM d, yyyy")}`;
		}
		return `${format(range.from, "MMM d, yyyy")} - ${format(range.to, "MMM d, yyyy")}`;
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						"w-[280px] justify-start text-left font-normal",
						!value?.from && "text-muted-foreground",
						className,
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{formatDateRange(value)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align={align}>
				<div className="flex">
					<div className="flex flex-col gap-1 border-r p-3">
						{presets.map((preset) => (
							<Button
								key={preset.label}
								variant="ghost"
								size="sm"
								className="justify-start font-normal"
								onClick={() => handlePresetClick(preset)}
							>
								{preset.label}
							</Button>
						))}
					</div>
					<div className="p-3">
						<Calendar
							mode="range"
							selected={value}
							onSelect={handleSelect}
							numberOfMonths={2}
							defaultMonth={value?.from}
						/>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}

export { DateRangePicker };
export type { DateRangePickerProps, DateRange };
