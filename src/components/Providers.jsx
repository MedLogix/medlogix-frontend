import { ThemeProvider } from "@/providers/theme-provider";
import { store } from "@/store";
import { Provider } from "react-redux";
import { Toaster } from "./ui/sonner";

const Providers = ({ children }) => {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        {children}
        <Toaster position="top-center" />
      </ThemeProvider>
    </Provider>
  );
};

export default Providers;
