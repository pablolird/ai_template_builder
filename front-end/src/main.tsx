import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { Toaster } from "@/components/ui/sonner";
import ProtectedRoute from "@/routes/ProtectedRoute";
import Home from "@/routes/Home";
import Login from "@/routes/Login";
import Landing from "@/routes/Landing";
import Templates from "@/routes/Templates";
import Profile from "@/routes/Profile";
import Settings from "@/routes/Settings";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <Toaster richColors position="bottom-right" />
    <LanguageProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/chat" element={<Home />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Routes>
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </LanguageProvider>
  </ThemeProvider>
);
