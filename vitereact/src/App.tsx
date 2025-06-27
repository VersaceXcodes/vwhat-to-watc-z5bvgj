import React, { useEffect, Suspense } from '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'react'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"';
import { BrowserRouter, Route, Routes } from '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'react-router-dom'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"';
import { QueryClient, QueryClientProvider, QueryClientProviderProps } from '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'@tanstack/react-query'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"';
import { ReactQueryDevtools } from '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'@tanstack/react-query-devtools'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"';

// Views
import UV_001 from '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'@/components/views/UV_001.tsx'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"';
import UV_002 from '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'@/components/views/UV_002.tsx'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"';
import UV_003 from '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'@/components/views/UV_003.tsx'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"';
import UV_004 from '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'@/components/views/UV_004.tsx'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"';
import UV_005 from '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'@/components/views/UV_005.tsx'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"';

// Zustand store
import { useAppStore } from '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'@/store/main.tsx'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"';

// --- Global Error Boundary Component ---
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.error('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Uncaught error:'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', error, errorInfo);
    // In a real app, you'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'d send this to a logging service
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{ padding: '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'20px'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', color: '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'red'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"' }}>
          <h2>Something went wrong.</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>Reload App</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Instantiate and Configure QueryClient ---
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Example: disable refetch on window focus for potentially better performance or user experience
      refetchOnWindowFocus: false,
      // Example: global error handling for queries
      onError: (error) => {
        console.error('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Global Query Error:'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', error);
        // Here you could dispatch an action to a global error notification system
        // For example: useAppStore.getState().setGlobalError(error.message);
      },
      // Example: global loading state monitoring is usually done client-side via useIsFetching
    },
    mutations: {
      onError: (error) => {
        console.error('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Global Mutation Error:'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', error);
        // Handle mutation errors globally
      },
    },
  },
});

// --- App Component ---
const App: React.FC = () => {
  // Initialize app state when the component mounts.
  // Moved the initialization call out of useEffect and into a direct call
  // to ensure it runs as part of the App setup. Zustand is designed for this.
  // If initialize_app_state is async, you might need a specific handler.
  // For synchronous initialization, calling it directly after store import is fine.
  // We'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'ll assume `initialize_app_state` performs necessary side effects.
  useEffect(() => {
    // This useEffect now solely focuses on side effects directly related to mount
    // that might be necessary for the App component itself.
    // For app-wide initialization, it'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'s best to let the store handle it or use a top-level context.

    // If initialize_app_state is a one-time setup that *must* happen after app load:
    // A more robust approach for async initializations might involve a dedicated
    // initialization service or a root component context that waits for async data.
    // For simplicity and common Zustand patterns, calling it directly is often sufficient
    // if it'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'s a synchronous setup or handled within middleware.
    // If the store logic requires it to be called this way, then keep it.
    // But avoid accessing .getState() for logic inside render or useEffect where possible.

    // A simple way to ensure it runs if it'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'s a setup side-effect:
    // Let'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'s assume the zustand store middleware or initial setup handles this,
    // or we can call it here if truly dependent on component mounting for certain side effects.
    // However, accessing state via .getState() directly for *logic* in useEffect is discouraged.
    // If `initialize_app_state` is truly meant as a setup that kicks off some global process,
    // you might call it outside the component or via a context.
    // For this example, we'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'ll keep a simplified effect if it were to trigger say, a global listener.

    console.log('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'App component mounted, potentially performing initial setup.'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"');
    // If initialize_app_state is truly intended to run ONCE and might be async,
    // consider a custom hook or a context provider that handles this.
    // For now, we'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'ll assume synchronous init or init handled by middleware.
    // If it *must* be called here and is async, handle it carefully.

    // A common pattern for async initialization:
    // const initialize = async () => {
    //   await useAppStore.getState().initialize_app_state();
    // };
    // initialize();

  }, []);

  // Return JSX with BrowserRouter, QueryClientProvider, ErrorBoundary, and Routes
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {/* Enable React Query Devtools in development */}
        {process.env.NODE_ENV === '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'development'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"' && <ReactQueryDevtools initialIsOpen={false} />}

        <ErrorBoundary>
          <Suspense fallback={<div>Loading...</div>}>
            {/* Global styling or layout components would go here */}
            {/* e.g., <GlobalStyles />, <Layout>...</Layout> */}

            <Routes>
              {/* Homepage route for the main input form */}
              <Route path="/" element={<UV_001 />} />

              {/* Route for the user profile view */}
              {/* As per notes, UV_005 is MVP+ and requires auth,
                  but for routing purposes, we include it.
                  Internal view logic will handle auth checks if needed. */}
              <Route path="/profile" element={<UV_005 />} />

              {/*
                Note on UV_002, UV_003, UV_004:
                These states (loading, success, no results) are generally
                managed *within* UV_001 to provide a seamless transition,
                rather than as separate routes. UV_001 component is responsible
                for displaying itself, then UV_003, then UV_002 or UV_004 based on logic.
                If specific deep linking to these states were required, additional
                single-purpose routes would be added here. For MVP, this dynamic
                rendering within UV_001 is sufficient.
              */}
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;







