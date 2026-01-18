import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
	"cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] hover:brightness-105 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),inset_0_-1px_0_0_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.06)] active:brightness-[0.98] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]",
				destructive:
					"bg-destructive text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),inset_0_-1px_0_0_rgba(0,0,0,0.15),0_1px_3px_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.08)] hover:brightness-110 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),inset_0_-1px_0_0_rgba(0,0,0,0.15),0_2px_6px_rgba(0,0,0,0.15),0_4px_12px_rgba(0,0,0,0.1)] active:brightness-95 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]",
				outline:
					"bg-background text-foreground border border-input shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.05)] hover:bg-accent/50 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.08)] active:bg-accent active:shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)] dark:bg-muted/30 dark:hover:bg-muted/50 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_1px_3px_rgba(0,0,0,0.3)]",
				secondary:
					"bg-secondary text-secondary-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),inset_0_-1px_0_0_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.06)] hover:brightness-105 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_2px_4px_rgba(0,0,0,0.08)] active:brightness-95 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)]",
				ghost:
					"hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-9 px-4 py-2 has-[>svg]:px-3",
				sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
				lg: "h-10 px-6 has-[>svg]:px-4",
				icon: "size-9",
				"icon-sm": "size-8",
				"icon-lg": "size-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
