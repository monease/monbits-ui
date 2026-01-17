import * as React from "react";
import { cn } from "../../lib/utils";

interface DescriptionsProps {
	children: React.ReactNode;
	column?: number;
	className?: string;
}

interface DescriptionsItemProps {
	label: React.ReactNode;
	children: React.ReactNode;
	className?: string;
	span?: number;
}

const Descriptions = React.forwardRef<HTMLDivElement, DescriptionsProps>(
	({ children, column = 1, className }, ref) => {
		return (
			<div
				ref={ref}
				className={cn("space-y-3", className)}
				style={{
					display: "grid",
					gridTemplateColumns: `repeat(${column}, 1fr)`,
					gap: column > 1 ? "1rem" : undefined,
				}}
			>
				{children}
			</div>
		);
	},
);
Descriptions.displayName = "Descriptions";

const DescriptionsItem = React.forwardRef<
	HTMLDivElement,
	DescriptionsItemProps
>(({ label, children, className, span = 1 }, ref) => {
	return (
		<div
			ref={ref}
			className={cn("flex flex-col gap-1", className)}
			style={{ gridColumn: span > 1 ? `span ${span}` : undefined }}
		>
			<div className="text-sm text-muted-foreground">{label}</div>
			<div className="text-sm font-medium">{children}</div>
		</div>
	);
});
DescriptionsItem.displayName = "DescriptionsItem";

export { Descriptions, DescriptionsItem };
