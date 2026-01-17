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
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

interface DeleteConfirmationDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	title: string;
	description: string;
	itemName?: string;
	confirmText?: string;
}

export function DeleteConfirmationDialog({
	open,
	onOpenChange,
	onConfirm,
	title,
	description,
	itemName,
	confirmText = "delete",
}: DeleteConfirmationDialogProps) {
	const inputId = React.useId();
	const [inputValue, setInputValue] = React.useState("");
	const [isDeleting, setIsDeleting] = React.useState(false);

	const isConfirmDisabled =
		inputValue.toLowerCase() !== confirmText.toLowerCase();

	React.useEffect(() => {
		if (!open) {
			setInputValue("");
			setIsDeleting(false);
		}
	}, [open]);

	const handleConfirm = async () => {
		if (isConfirmDisabled) return;

		try {
			setIsDeleting(true);
			await onConfirm();
			onOpenChange(false);
		} catch (error) {
			console.error("Delete failed:", error);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader className="space-y-2">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
							<AlertTriangle className="h-5 w-5 text-destructive" />
						</div>
						<DialogTitle className="text-lg">{title}</DialogTitle>
					</div>
					<DialogDescription className="text-left">
						{description}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 pt-1">
					{itemName && (
						<div className="rounded-md bg-muted px-3 py-2.5 border">
							<p className="text-sm font-medium">{itemName}</p>
						</div>
					)}

					<div className="space-y-2">
						<Label htmlFor={inputId} className="text-sm">
							Type{" "}
							<span className="font-mono font-semibold uppercase">
								{confirmText}
							</span>{" "}
							to delete the merchant
						</Label>
						<Input
							id={inputId}
							value={inputValue}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
							placeholder={confirmText}
							autoComplete="off"
							disabled={isDeleting}
						/>
					</div>
				</div>

				<DialogFooter className="mt-6">
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isDeleting}
					>
						Cancel
					</Button>
					<Button
						variant="destructive"
						onClick={handleConfirm}
						disabled={isConfirmDisabled || isDeleting}
					>
						{isDeleting ? (
							<span className="flex items-center gap-2">
								<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
								Deleting...
							</span>
						) : (
							"Delete"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
