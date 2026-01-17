import { AlertTriangle } from "lucide-react";
import * as React from "react";
import { Button } from "../../ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../../ui/dialog";

interface ConfirmationDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void | Promise<void>;
	title: string;
	description: string;
	confirmText?: string;
	variant?: "default" | "destructive";
}

export function ConfirmationDialog({
	open,
	onOpenChange,
	onConfirm,
	title,
	description,
	confirmText = "Confirm",
	variant = "destructive",
}: ConfirmationDialogProps) {
	const [isConfirming, setIsConfirming] = React.useState(false);

	React.useEffect(() => {
		if (!open) {
			setIsConfirming(false);
		}
	}, [open]);

	const handleConfirm = async () => {
		try {
			setIsConfirming(true);
			await onConfirm();
			onOpenChange(false);
		} catch (error) {
			console.error("Confirmation action failed:", error);
		} finally {
			setIsConfirming(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader className="space-y-2">
					<div className="flex items-center gap-3">
						{variant === "destructive" && (
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
								<AlertTriangle className="h-5 w-5 text-destructive" />
							</div>
						)}
						<DialogTitle className="text-lg">{title}</DialogTitle>
					</div>
					<DialogDescription className="text-left">
						{description}
					</DialogDescription>
				</DialogHeader>

				<DialogFooter className="mt-6">
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isConfirming}
					>
						Cancel
					</Button>
					<Button
						variant={variant}
						onClick={handleConfirm}
						disabled={isConfirming}
					>
						{isConfirming ? (
							<span className="flex items-center gap-2">
								<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
								{confirmText}...
							</span>
						) : (
							confirmText
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
