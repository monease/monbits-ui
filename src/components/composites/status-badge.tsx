import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

export type StatusType =
	| "success"
	| "warning"
	| "error"
	| "info"
	| "default"
	| "danger"
	| "purple"
	| "cyan"
	| "pink";

interface StatusBadgeProps {
	children: ReactNode;
	type?: StatusType;
	className?: string;
	icon?: LucideIcon;
}

const statusStyles: Record<StatusType, string> = {
	success:
		"border-green-500/30 bg-green-50/50 text-green-700 dark:border-green-500/40 dark:bg-green-950/30 dark:text-green-400",
	warning:
		"border-yellow-500/30 bg-yellow-50/50 text-yellow-700 dark:border-yellow-500/40 dark:bg-yellow-950/30 dark:text-yellow-400",
	error:
		"border-red-500/30 bg-red-50/50 text-red-700 dark:border-red-500/40 dark:bg-red-950/30 dark:text-red-400",
	info: "border-blue-500/30 bg-blue-50/50 text-blue-700 dark:border-blue-500/40 dark:bg-blue-950/30 dark:text-blue-400",
	default:
		"border-gray-300 bg-gray-50/50 text-gray-700 dark:border-gray-600 dark:bg-gray-800/30 dark:text-gray-300",
	danger:
		"border-red-500/30 bg-red-50/50 text-red-700 dark:border-red-500/40 dark:bg-red-950/30 dark:text-red-400",
	purple:
		"border-purple-500/30 bg-purple-50/50 text-purple-700 dark:border-purple-500/40 dark:bg-purple-950/30 dark:text-purple-400",
	cyan: "border-cyan-500/30 bg-cyan-50/50 text-cyan-700 dark:border-cyan-500/40 dark:bg-cyan-950/30 dark:text-cyan-400",
	pink: "border-pink-500/30 bg-pink-50/50 text-pink-700 dark:border-pink-500/40 dark:bg-pink-950/30 dark:text-pink-400",
};

export function StatusBadge({
	children,
	type = "default",
	className,
	icon: Icon,
}: StatusBadgeProps) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 rounded border px-2.5 py-0.5 text-xs font-medium transition-colors",
				statusStyles[type],
				className,
			)}
		>
			{Icon && <Icon className="h-3.5 w-3.5" />}
			{children}
		</span>
	);
}
