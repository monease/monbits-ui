import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	MoreHorizontal,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./select";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export interface DataTablePaginationProps {
	page: number;
	pageSize: number;
	totalCount: number;
	onPageChange: (page: number) => void;
	onPageSizeChange?: (pageSize: number) => void;
	pageSizeOptions?: number[];
	className?: string;
	/**
	 * Show compact version on mobile (just prev/next with page indicator)
	 * @default true
	 */
	compactOnMobile?: boolean;
	/**
	 * Show the "Showing X-Y of Z" text
	 * @default true
	 */
	showItemCount?: boolean;
}

function generatePageNumbers(
	currentPage: number,
	totalPages: number,
): (number | "ellipsis")[] {
	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	}

	const pages: (number | "ellipsis")[] = [];

	// Always show first page
	pages.push(1);

	if (currentPage <= 3) {
		// Near start: 1 2 3 4 ... last
		pages.push(2, 3, 4, "ellipsis", totalPages);
	} else if (currentPage >= totalPages - 2) {
		// Near end: 1 ... n-3 n-2 n-1 n
		pages.push(
			"ellipsis",
			totalPages - 3,
			totalPages - 2,
			totalPages - 1,
			totalPages,
		);
	} else {
		// Middle: 1 ... current-1 current current+1 ... last
		pages.push(
			"ellipsis",
			currentPage - 1,
			currentPage,
			currentPage + 1,
			"ellipsis",
			totalPages,
		);
	}

	return pages;
}

export function DataTablePagination({
	page,
	pageSize,
	totalCount,
	onPageChange,
	onPageSizeChange,
	pageSizeOptions = PAGE_SIZE_OPTIONS,
	className,
	compactOnMobile = true,
	showItemCount = true,
}: DataTablePaginationProps) {
	const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
	const startItem = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
	const endItem = Math.min(page * pageSize, totalCount);

	const pageNumbers = generatePageNumbers(page, totalPages);

	const canGoPrevious = page > 1;
	const canGoNext = page < totalPages;

	return (
		<div
			className={cn(
				"flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
				className,
			)}
		>
			{/* Left side: page size selector + showing text */}
			<div className="flex items-center gap-3 flex-wrap">
				{onPageSizeChange && (
					<Select
						value={String(pageSize)}
						onValueChange={(value) => onPageSizeChange(Number(value))}
					>
						<SelectTrigger className="w-[120px] h-8 text-sm">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{pageSizeOptions.map((size) => (
								<SelectItem key={size} value={String(size)}>
									{size} per page
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}
				{showItemCount && (
					<span className="text-sm text-muted-foreground whitespace-nowrap">
						{startItem}-{endItem} of {totalCount}
					</span>
				)}
			</div>

			{/* Right side: pagination controls */}
			<div className="flex items-center gap-1">
				{/* First page button - hidden on mobile */}
				<Button
					variant="outline"
					size="icon"
					className="hidden sm:flex h-8 w-8"
					onClick={() => onPageChange(1)}
					disabled={!canGoPrevious}
					aria-label="Go to first page"
				>
					<ChevronsLeft className="h-4 w-4" />
				</Button>

				{/* Previous button */}
				<Button
					variant="outline"
					size="icon"
					className="h-8 w-8"
					onClick={() => onPageChange(page - 1)}
					disabled={!canGoPrevious}
					aria-label="Go to previous page"
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>

				{/* Page numbers - hidden on mobile when compactOnMobile is true */}
				<div
					className={cn(
						"flex items-center gap-1",
						compactOnMobile && "hidden sm:flex",
					)}
				>
					{pageNumbers.map((pageNum, index) =>
						pageNum === "ellipsis" ? (
							<span
								key={`ellipsis-${index}`}
								className="flex h-8 w-8 items-center justify-center"
							>
								<MoreHorizontal className="h-4 w-4 text-muted-foreground" />
							</span>
						) : (
							<Button
								key={pageNum}
								variant={pageNum === page ? "default" : "outline"}
								size="icon"
								className="h-8 w-8 text-sm"
								onClick={() => onPageChange(pageNum)}
								aria-label={`Go to page ${pageNum}`}
								aria-current={pageNum === page ? "page" : undefined}
							>
								{pageNum}
							</Button>
						),
					)}
				</div>

				{/* Mobile: show current page when compactOnMobile is true */}
				{compactOnMobile && (
					<span className="sm:hidden text-sm px-3 whitespace-nowrap font-medium">
						{page} / {totalPages}
					</span>
				)}

				{/* Next button */}
				<Button
					variant="outline"
					size="icon"
					className="h-8 w-8"
					onClick={() => onPageChange(page + 1)}
					disabled={!canGoNext}
					aria-label="Go to next page"
				>
					<ChevronRight className="h-4 w-4" />
				</Button>

				{/* Last page button - hidden on mobile */}
				<Button
					variant="outline"
					size="icon"
					className="hidden sm:flex h-8 w-8"
					onClick={() => onPageChange(totalPages)}
					disabled={!canGoNext}
					aria-label="Go to last page"
				>
					<ChevronsRight className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
