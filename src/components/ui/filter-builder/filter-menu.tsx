import { Calendar, ChevronRight, Filter, Search } from "lucide-react";
import * as React from "react";
import { Calendar as CalendarPicker } from "../calendar";
import { Input } from "../input";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { getDefaultOperator } from "./filter-utils";
import type { FilterField, FilterOption, FilterValue } from "./types";

interface FilterMenuProps {
	fields: FilterField[];
	onAddFilter: (filter: FilterValue) => void;
}

type MenuState = { step: "fields" } | { step: "values"; field: FilterField };

const RELATIVE_DATE_OPTIONS = [
	{ value: "today", label: "Today" },
	{ value: "7d", label: "Last 7 days" },
	{ value: "30d", label: "Last 30 days" },
	{ value: "thisMonth", label: "This month" },
];

export function FilterMenu({ fields, onAddFilter }: FilterMenuProps) {
	const [open, setOpen] = React.useState(false);
	const [menuState, setMenuState] = React.useState<MenuState>({
		step: "fields",
	});
	const [fieldSearch, setFieldSearch] = React.useState("");
	const [valueSearch, setValueSearch] = React.useState("");
	const [asyncOptions, setAsyncOptions] = React.useState<FilterOption[]>([]);
	const [asyncLoading, setAsyncLoading] = React.useState(false);
	const [showDatePicker, setShowDatePicker] = React.useState(false);

	const filteredFields = React.useMemo(() => {
		if (!fieldSearch) return fields;
		const search = fieldSearch.toLowerCase();
		return fields.filter((f) => f.label.toLowerCase().includes(search));
	}, [fields, fieldSearch]);

	const resetMenu = React.useCallback(() => {
		setMenuState({ step: "fields" });
		setFieldSearch("");
		setValueSearch("");
		setAsyncOptions([]);
		setShowDatePicker(false);
	}, []);

	const handleOpenChange = React.useCallback(
		(newOpen: boolean) => {
			setOpen(newOpen);
			if (!newOpen) {
				resetMenu();
			}
		},
		[resetMenu],
	);

	const handleFieldSelect = React.useCallback((field: FilterField) => {
		setMenuState({ step: "values", field });
		setValueSearch("");
		setAsyncOptions([]);
		setShowDatePicker(false);
	}, []);

	const handleValueSelect = React.useCallback(
		(value: string, label?: string) => {
			if (menuState.step !== "values") return;

			onAddFilter({
				field: menuState.field.id,
				operator: getDefaultOperator(menuState.field.type),
				value,
				label,
			});
			handleOpenChange(false);
		},
		[menuState, onAddFilter, handleOpenChange],
	);

	const handleDateSelect = React.useCallback(
		(date: Date | undefined) => {
			if (!date || menuState.step !== "values") return;
			const value = date.toISOString().split("T")[0];
			handleValueSelect(value);
		},
		[menuState, handleValueSelect],
	);

	const handleRelativeDateSelect = React.useCallback(
		(relative: string, label: string) => {
			const value = `relative:${relative}`;
			handleValueSelect(value, label);
		},
		[handleValueSelect],
	);

	const handleBack = React.useCallback(() => {
		setMenuState({ step: "fields" });
		setValueSearch("");
		setShowDatePicker(false);
	}, []);

	// Async search for asyncSelect fields
	React.useEffect(() => {
		if (menuState.step !== "values") return;
		if (menuState.field.type !== "asyncSelect") return;
		if (!menuState.field.loadOptions) return;
		if (valueSearch.length < 2) {
			setAsyncOptions([]);
			return;
		}

		const controller = new AbortController();
		setAsyncLoading(true);

		const timeoutId = setTimeout(async () => {
			try {
				const options = await menuState.field.loadOptions?.(valueSearch);
				if (!controller.signal.aborted) {
					setAsyncOptions(options ?? []);
				}
			} catch {
				if (!controller.signal.aborted) {
					setAsyncOptions([]);
				}
			} finally {
				if (!controller.signal.aborted) {
					setAsyncLoading(false);
				}
			}
		}, 300);

		return () => {
			controller.abort();
			clearTimeout(timeoutId);
		};
	}, [menuState, valueSearch]);

	const filteredOptions = React.useMemo(() => {
		if (menuState.step !== "values") return [];
		const field = menuState.field;

		if (field.type === "asyncSelect") {
			return asyncOptions;
		}

		if (!field.options) return [];
		if (!valueSearch) return field.options;

		const search = valueSearch.toLowerCase();
		return field.options.filter((o) => o.label.toLowerCase().includes(search));
	}, [menuState, valueSearch, asyncOptions]);

	return (
		<Popover open={open} onOpenChange={handleOpenChange}>
			<PopoverTrigger asChild>
				<button
					type="button"
					className="inline-flex items-center gap-1.5 h-7 px-2.5 text-sm text-muted-foreground hover:text-foreground border hover:bg-muted/40 rounded-full transition-colors"
				>
					<Filter className="h-3.5 w-3.5" />
					<span>Filter</span>
				</button>
			</PopoverTrigger>
			<PopoverContent className="w-[220px] p-0" align="start" sideOffset={4}>
				{menuState.step === "fields" ? (
					<>
						{/* Search fields */}
						<div className="p-2 border-b">
							<div className="relative">
								<Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
								<Input
									placeholder="Filter..."
									value={fieldSearch}
									onChange={(e) => setFieldSearch(e.target.value)}
									className="pl-7 h-7 text-sm"
									autoFocus
								/>
							</div>
						</div>
						{/* Field list */}
						<div className="max-h-[300px] overflow-y-auto p-1">
							{filteredFields.map((field) => (
								<button
									key={field.id}
									type="button"
									onClick={() => handleFieldSelect(field)}
									className="w-full flex items-center gap-2 px-2 py-1.5 rounded-sm text-sm hover:bg-accent transition-colors text-left group"
								>
									{field.icon && (
										<span className="text-muted-foreground w-4 flex items-center justify-center">
											{field.icon}
										</span>
									)}
									<span className="flex-1">{field.label}</span>
									<ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
								</button>
							))}
							{filteredFields.length === 0 && (
								<div className="px-2 py-4 text-sm text-muted-foreground text-center">
									No fields found
								</div>
							)}
						</div>
					</>
				) : (
					<>
						{/* Header with back button */}
						<div className="p-2 border-b flex items-center gap-2">
							<button
								type="button"
								onClick={handleBack}
								className="p-0.5 rounded hover:bg-muted transition-colors"
							>
								<ChevronRight className="h-4 w-4 rotate-180" />
							</button>
							<span className="text-sm font-medium">
								{menuState.field.label}
							</span>
						</div>

						{/* Values */}
						{menuState.field.type === "date" ? (
							<div className="p-1">
								{!showDatePicker ? (
									<>
										{RELATIVE_DATE_OPTIONS.map((opt) => (
											<button
												key={opt.value}
												type="button"
												onClick={() =>
													handleRelativeDateSelect(opt.value, opt.label)
												}
												className="w-full flex items-center gap-2 px-2 py-1.5 rounded-sm text-sm hover:bg-accent transition-colors text-left"
											>
												{opt.label}
											</button>
										))}
										<button
											type="button"
											onClick={() => setShowDatePicker(true)}
											className="w-full flex items-center gap-2 px-2 py-1.5 rounded-sm text-sm hover:bg-accent transition-colors text-left text-muted-foreground"
										>
											<Calendar className="h-3.5 w-3.5" />
											Pick a date...
										</button>
									</>
								) : (
									<div className="p-2">
										<CalendarPicker
											mode="single"
											onSelect={handleDateSelect}
											className="rounded-md border"
										/>
									</div>
								)}
							</div>
						) : (
							<>
								{/* Search for values */}
								{(menuState.field.type === "asyncSelect" ||
									(menuState.field.options &&
										menuState.field.options.length > 6)) && (
									<div className="p-2 border-b">
										<div className="relative">
											<Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
											<Input
												placeholder="Filter..."
												value={valueSearch}
												onChange={(e) => setValueSearch(e.target.value)}
												className="pl-7 h-7 text-sm"
												autoFocus
											/>
										</div>
									</div>
								)}

								{/* Options list */}
								<div className="max-h-[250px] overflow-y-auto p-1">
									{asyncLoading ? (
										<div className="px-2 py-4 text-sm text-muted-foreground text-center">
											Loading...
										</div>
									) : filteredOptions.length > 0 ? (
										filteredOptions.map((option) => (
											<button
												key={option.value}
												type="button"
												onClick={() =>
													handleValueSelect(option.value, option.label)
												}
												className="w-full flex items-center gap-2 px-2 py-1.5 rounded-sm text-sm hover:bg-accent transition-colors text-left"
											>
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
												<span className="truncate">{option.label}</span>
											</button>
										))
									) : menuState.field.type === "asyncSelect" &&
										valueSearch.length < 2 ? (
										<div className="px-2 py-4 text-sm text-muted-foreground text-center">
											Type to search...
										</div>
									) : (
										<div className="px-2 py-4 text-sm text-muted-foreground text-center">
											No options found
										</div>
									)}
								</div>
							</>
						)}
					</>
				)}
			</PopoverContent>
		</Popover>
	);
}
