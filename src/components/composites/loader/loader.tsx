import type { FC } from "react";
import { cn } from "../../../lib/utils";
import { Spinner } from "../../ui/spinner";

interface LoaderProps {
	size?: "sm" | "md" | "lg";
	className?: string;
	fullScreen?: boolean;
}

const sizeClasses = {
	sm: "size-4",
	md: "size-8",
	lg: "size-12",
};

export const Loader: FC<LoaderProps> = ({
	size = "md",
	className,
	fullScreen = false,
}) => {
	const spinner = <Spinner className={cn(sizeClasses[size], className)} />;

	if (fullScreen) {
		return (
			<div className="flex justify-center items-center py-12">{spinner}</div>
		);
	}

	return spinner;
};
