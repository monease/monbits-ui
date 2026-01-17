import { AlertCircle, AlertTriangle, Check, Info } from "lucide-react";
import { createElement } from "react";
import { toast } from "sonner";

interface NotificationOptions {
	message: string;
	description?: string;
	placement?:
		| "top-left"
		| "top-right"
		| "bottom-left"
		| "bottom-right"
		| "bottomRight";
	duration?: number;
	icon?: React.ReactNode;
}

export const showToast = {
	success: (options: NotificationOptions) => {
		toast.success(options.message, {
			description: options.description,
			duration: options.duration || 4000,
			icon: options.icon || createElement(Check, { className: "h-5 w-5" }),
			position:
				options.placement === "bottomRight" ||
				options.placement === "bottom-right"
					? "bottom-right"
					: "top-right",
		});
	},

	error: (options: NotificationOptions) => {
		toast.error(options.message, {
			description: options.description,
			duration: options.duration || 4000,
			icon:
				options.icon || createElement(AlertCircle, { className: "h-5 w-5" }),
			position:
				options.placement === "bottomRight" ||
				options.placement === "bottom-right"
					? "bottom-right"
					: "top-right",
		});
	},

	info: (options: NotificationOptions) => {
		toast.info(options.message, {
			description: options.description,
			duration: options.duration || 4000,
			icon: options.icon || createElement(Info, { className: "h-5 w-5" }),
			position:
				options.placement === "bottomRight" ||
				options.placement === "bottom-right"
					? "bottom-right"
					: "top-right",
		});
	},

	warning: (options: NotificationOptions) => {
		toast.warning(options.message, {
			description: options.description,
			duration: options.duration || 4000,
			icon:
				options.icon || createElement(AlertTriangle, { className: "h-5 w-5" }),
			position:
				options.placement === "bottomRight" ||
				options.placement === "bottom-right"
					? "bottom-right"
					: "top-right",
		});
	},
};

export const createNotificationApi = () => ({
	info: showToast.info,
	success: showToast.success,
	error: showToast.error,
	warning: showToast.warning,
});
