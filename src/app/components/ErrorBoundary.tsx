import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return (
        <div
          dir="rtl"
          className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-6 text-center"
        >
          <div className="text-6xl">😵</div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">משהו השתבש</h1>
            <p className="text-gray-500">אירעה שגיאה בלתי צפויה. נסו לרענן את הדף.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={this.reset}
              className="rounded-2xl bg-gradient-to-l from-violet-600 to-indigo-600 px-6 py-3 font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
            >
              נסו שוב
            </button>
            <button
              onClick={() => window.location.assign("/")}
              className="rounded-2xl bg-gray-100 px-6 py-3 font-bold text-gray-700 transition-all duration-200 hover:bg-gray-200"
            >
              חזרה לדף הבית
            </button>
          </div>
          {import.meta.env.DEV && (
            <pre className="mt-4 max-w-lg overflow-auto rounded-xl bg-red-50 p-4 text-left text-xs text-red-700">
              {this.state.error.message}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
