import { ThemeProvider } from "@/providers/theme-provider";
import { store } from "@/store";
import { Provider } from "react-redux";
import { Toaster } from "./ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Providers = ({ children }) => {
  const queryClient = new QueryClient();

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          {children}
          <Toaster position="top-center" />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default Providers;
