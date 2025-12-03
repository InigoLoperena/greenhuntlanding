import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/hooks/useLanguage";
import { ErrorBoundary } from "@/utils/errorBoundary";
import { lazy, Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

// Lazy load pages for better performance
const LandingPage = lazy(() => import("./pages/LandingPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CookiesPage = lazy(() => import("./pages/CookiesPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const LegalPage = lazy(() => import("./pages/LegalPage"));
const AmbassadorPage = lazy(() => import("./pages/AmbassadorPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const WasteManagerPage = lazy(() => import("./pages/WasteManagerPage"));
const TestPage = lazy(() => import("./pages/TestPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: false,
      networkMode: 'offlineFirst', // Better offline support
    },
    mutations: {
      retry: 1,
      networkMode: 'offlineFirst',
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center bg-black">
                <LoadingSpinner />
              </div>
            }>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/cookies" element={<CookiesPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/legal" element={<LegalPage />} />
                <Route path="/ambassador-program" element={<AmbassadorPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/waste-managers" element={<WasteManagerPage />} />
                <Route path="/test-page" element={<TestPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;