import type * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";

interface Props {
	text: string;
	collapseAt: number;
	withPopover?: boolean;
	popupText?: string;
	style?: object;
}

const CollapseString: React.FC<Props> = (props: Props) => {
	const collapsedText =
		props.text.length > props.collapseAt * 2
			? props.text.slice(0, props.collapseAt) +
				"..." +
				props.text.slice(props.text.length - props.collapseAt)
			: props.text;

	return (
		<Popover>
			<PopoverTrigger asChild>
				<span className="cursor-pointer" style={props.style}>
					{collapsedText}
				</span>
			</PopoverTrigger>
			<PopoverContent className="w-auto max-w-md break-all">
				{props.popupText ? props.popupText : props.text}
			</PopoverContent>
		</Popover>
	);
};

export default CollapseString;
