import { Copy } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "../../ui/button";

interface CopyButtonProps {
	value?: string | null;
	label?: string;
}

const CopyButton = ({ value, label }: CopyButtonProps) => {
	const handleCopy = React.useCallback(
		async (event: React.MouseEvent<HTMLButtonElement>) => {
			event.stopPropagation();
			if (!value) {
				return;
			}
			try {
				await navigator.clipboard?.writeText(value);
				toast.success(`${label ?? "Value"} copied to clipboard`);
			} catch (error) {
				console.error("Failed to copy", error);
				toast.error("Could not copy value");
			}
		},
		[value, label],
	);

	if (!value) {
		return null;
	}

	return (
		<Button
			type="button"
			variant="ghost"
			size="icon"
			className="h-6 w-6 text-muted-foreground"
			onClick={handleCopy}
			aria-label={`Copy ${label ?? "value"}`}
		>
			<Copy className="h-3 w-3" />
		</Button>
	);
};

export default CopyButton;
