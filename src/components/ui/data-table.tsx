import { ChevronRight } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { DataTablePagination, type DataTablePaginationProps } from "./data-table-pagination";
import { Skeleton } from "./skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./table";

export interface ColumnDef<T> {
	/**
	 * Unique identifier for the column
	 */
	id: string;
	/**
	 * Header content - string or ReactNode
	 */
	header: React.ReactNode;
	/**
	 * Cell renderer function
	 */
	cell: (row: T) => React.ReactNode;
	/**
	 * Optional className for the column (applied to th and td)
	 */
	className?: string;
}

export interface DataTableProps<T> {
	/**
	 * Column definitions
	 */
	columns: ColumnDef<T>[];
	/**
	 * Data rows
	 */
	data: T[];
	/**
	 * Pagination configuration (controlled)
	 */
	pagination?: Omit<DataTablePaginationProps, "className">;
	/**
	 * Show loading skeleton
	 */
	isLoading?: boolean;
	/**
	 * Number of skeleton rows to show when loading
	 * @default 5
	 */
	loadingRowCount?: number;
	/**
	 * Message to show when data is empty
	 * @default "No results found"
	 */
	emptyMessage?: string;
	/**
	 * Custom empty state component (overrides emptyMessage)
	 */
	emptyComponent?: React.ReactNode;
	/**
	 * Row click handler
	 */
	onRowClick?: (row: T) => void;
	/**
	 * Function to get unique row ID
	 * @default Uses index
	 */
	getRowId?: (row: T, index: number) => string;
	/**
	 * Show chevron indicator on clickable rows
	 * @default true when onRowClick is provided
	 */
	showRowChevron?: boolean;
	/**
	 * Additional className for the container
	 */
	className?: string;
}

function DataTableSkeleton<T>({
	columns,
	rowCount,
}: {
	columns: ColumnDef<T>[];
	rowCount: number;
}) {
	return (
		<TableBody>
			{Array.from({ length: rowCount }).map((_, rowIndex) => (
				<TableRow key={rowIndex}>
					{columns.map((column) => (
						<TableCell key={column.id} className={column.className}>
							<Skeleton className="h-5 w-full max-w-[200px]" />
						</TableCell>
					))}
				</TableRow>
			))}
		</TableBody>
	);
}

function DataTableEmpty({
	colSpan,
	message,
	component,
}: {
	colSpan: number;
	message: string;
	component?: React.ReactNode;
}) {
	return (
		<TableBody>
			<TableRow>
				<TableCell colSpan={colSpan} className="h-48">
					{component || (
						<div className="flex flex-col items-center justify-center text-center">
							<p className="text-muted-foreground">{message}</p>
						</div>
					)}
				</TableCell>
			</TableRow>
		</TableBody>
	);
}

export function DataTable<T>({
	columns,
	data,
	pagination,
	isLoading = false,
	loadingRowCount = 5,
	emptyMessage = "No results found",
	emptyComponent,
	onRowClick,
	getRowId,
	showRowChevron,
	className,
}: DataTableProps<T>) {
	const hasChevron = showRowChevron ?? !!onRowClick;
	const effectiveColumns = hasChevron
		? [
				...columns,
				{
					id: "__chevron__",
					header: "",
					cell: () => (
						<ChevronRight className="h-4 w-4 text-muted-foreground" />
					),
					className: "w-10",
				} as ColumnDef<T>,
			]
		: columns;

	return (
		<div className={cn("space-y-4", className)}>
			<Table>
				<TableHeader>
					<TableRow>
						{effectiveColumns.map((column) => (
							<TableHead key={column.id} className={column.className}>
								{column.header}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>

				{isLoading ? (
					<DataTableSkeleton columns={effectiveColumns} rowCount={loadingRowCount} />
				) : data.length === 0 ? (
					<DataTableEmpty
						colSpan={effectiveColumns.length}
						message={emptyMessage}
						component={emptyComponent}
					/>
				) : (
					<TableBody>
						{data.map((row, index) => {
							const rowId = getRowId ? getRowId(row, index) : String(index);
							return (
								<TableRow
									key={rowId}
									onClick={onRowClick ? () => onRowClick(row) : undefined}
									className={cn(onRowClick && "cursor-pointer")}
								>
									{effectiveColumns.map((column) => (
										<TableCell key={column.id} className={column.className}>
											{column.id === "__chevron__" ? (
												<ChevronRight className="h-4 w-4 text-muted-foreground" />
											) : (
												column.cell(row)
											)}
										</TableCell>
									))}
								</TableRow>
							);
						})}
					</TableBody>
				)}
			</Table>

			{pagination && !isLoading && data.length > 0 && (
				<DataTablePagination {...pagination} />
			)}
		</div>
	);
}

export type { DataTablePaginationProps };
