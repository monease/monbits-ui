import type { ReactNode } from "react";

interface DetailRowProps {
	label: string;
	value: ReactNode;
}

const DetailRow = ({ label, value }: DetailRowProps) => (
	<div className="flex items-start justify-between gap-4 text-sm">
		<span className="text-muted-foreground">{label}:</span>
		<div className="flex items-center gap-2 text-right font-medium">
			{value}
		</div>
	</div>
);

export default DetailRow;
