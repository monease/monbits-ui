import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "./button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { cn } from "../../lib/utils";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export interface DataTablePaginationProps {
	page: number;
	pageSize: number;
	totalCount: number;
	onPageChange: (page: number) => void;
	onPageSizeChange?: (pageSize: number) => void;
	pageSizeOptions?: number[];
	className?: string;
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
		pages.push("ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
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
				"flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
				className,
			)}
		>
			{/* Left side: page size selector + showing text */}
			<div className="flex items-center gap-4">
				{onPageSizeChange && (
					<Select
						value={String(pageSize)}
						onValueChange={(value) => onPageSizeChange(Number(value))}
					>
						<SelectTrigger className="w-[130px] h-9">
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
				<span className="text-sm text-muted-foreground whitespace-nowrap">
					Showing {startItem}-{endItem} of {totalCount}
				</span>
			</div>

			{/* Right side: pagination controls */}
			<div className="flex items-center gap-1">
				{/* Previous button */}
				<Button
					variant="outline"
					size="icon"
					className="h-9 w-9"
					onClick={() => onPageChange(page - 1)}
					disabled={!canGoPrevious}
					aria-label="Go to previous page"
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>

				{/* Page numbers - hidden on mobile */}
				<div className="hidden sm:flex items-center gap-1">
					{pageNumbers.map((pageNum, index) =>
						pageNum === "ellipsis" ? (
							<span
								key={`ellipsis-${index}`}
								className="flex h-9 w-9 items-center justify-center"
							>
								<MoreHorizontal className="h-4 w-4 text-muted-foreground" />
							</span>
						) : (
							<Button
								key={pageNum}
								variant={pageNum === page ? "default" : "outline"}
								size="icon"
								className="h-9 w-9"
								onClick={() => onPageChange(pageNum)}
								aria-label={`Go to page ${pageNum}`}
								aria-current={pageNum === page ? "page" : undefined}
							>
								{pageNum}
							</Button>
						),
					)}
				</div>

				{/* Mobile: show current page */}
				<span className="sm:hidden text-sm px-2 whitespace-nowrap">
					{page} / {totalPages}
				</span>

				{/* Next button */}
				<Button
					variant="outline"
					size="icon"
					className="h-9 w-9"
					onClick={() => onPageChange(page + 1)}
					disabled={!canGoNext}
					aria-label="Go to next page"
				>
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
