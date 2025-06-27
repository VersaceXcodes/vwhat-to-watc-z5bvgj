import React, { useEffect, Suspense } from '"'"'react'"'"';
import { BrowserRouter, Route, Routes } from '"'"'react-router-dom'"'"';
import { QueryClient, QueryClientProvider } from '"'"'@tanstack/react-query'"'"';
import { ReactQueryDevtools } from '"'"'@tanstack/react-query-devtools'"'"';

// Views
import UV_001 from '"'"'@/components/views/UV_001'"'"';
import UV_002 from '"'"'@/components/views/UV_002'"'"';
import UV_003 from '"'"'@/components/views/UV_003'"'"';
import UV_004 from '"'"'@/components/views/UV_004'"'"';
import UV_005 from '"'"'@/components/views/UV_005'"'"';

// Zustand store
import { useAppStore } from '"'"'@/store/main'"'"';

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
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('"'"'Uncaught error:'"'"', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '"'"'20px'"'"', color: '"'"'red'"'"' }}>
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
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error('"'"'Global Query Error:'"'"', error);
      },
    },
    mutations: {
      onError: (error) => {
        console.error('"'"'Global Mutation Error:'"'"', error);
      },
    },
  },
});

// --- App Component ---
const App: React.FC = () => {
  useEffect(() => {
    console.log('"'"'App component mounted, potentially performing initial setup.'"'"');
  }, []);

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {process.env.NODE_ENV === '"'"'development'"'"' && <ReactQueryDevtools initialIsOpen={false} />}
        <ErrorBoundary>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<UV_001 />} />
              <Route path="/profile" element={<UV_005 />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
