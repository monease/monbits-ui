import { AlertTriangle } from "lucide-react";
import * as React from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";

interface Props {
	children: React.ReactNode;
	fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error("Error caught by boundary:", error, errorInfo);
	}

	reset = () => {
		this.setState({ hasError: false, error: null });
	};

	render() {
		if (this.state.hasError && this.state.error) {
			const FallbackComponent = this.props.fallback;

			if (FallbackComponent) {
				return (
					<FallbackComponent error={this.state.error} reset={this.reset} />
				);
			}

			return (
				<DefaultErrorFallback error={this.state.error} reset={this.reset} />
			);
		}

		return this.props.children;
	}
}

interface FallbackProps {
	error: Error;
	reset: () => void;
}

const DefaultErrorFallback: React.FC<FallbackProps> = ({ error, reset }) => {
	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				<Alert variant="destructive">
					<AlertTriangle className="h-4 w-4" />
					<AlertTitle>Something went wrong</AlertTitle>
					<AlertDescription className="mt-2 space-y-2">
						<p className="text-sm">{error.message}</p>
						<Button
							variant="outline"
							size="sm"
							onClick={reset}
							className="mt-4"
						>
							Try again
						</Button>
					</AlertDescription>
				</Alert>
			</div>
		</div>
	);
};
