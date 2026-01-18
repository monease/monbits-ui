import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

export type TintedBackgroundIconSize = "xs" | "sm" | "md" | "lg";

export interface TintedBackgroundIconProps {
	icon: LucideIcon;
	color: string;
	size?: TintedBackgroundIconSize;
	className?: string;
}

const sizeClasses: Record<
	TintedBackgroundIconSize,
	{ container: string; icon: string }
> = {
	xs: { container: "h-5 w-5", icon: "h-2.5 w-2.5" },
	sm: { container: "h-6 w-6", icon: "h-3.5 w-3.5" },
	md: { container: "h-7 w-7", icon: "h-4 w-4" },
	lg: { container: "h-8 w-8", icon: "h-4.5 w-4.5" },
};

export function TintedBackgroundIcon({
	icon: Icon,
	color,
	size = "sm",
	className,
}: TintedBackgroundIconProps) {
	const sizes = sizeClasses[size];

	return (
		<div
			className={cn(
				sizes.container,
				"rounded flex items-center justify-center flex-shrink-0",
				className,
			)}
			style={{
				backgroundColor: `${color}20`,
				color: color,
			}}
		>
			<Icon className={sizes.icon} />
		</div>
	);
}
