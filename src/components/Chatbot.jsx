import { Bot } from "lucide-react";

const Chatbot = () => {
  return (
    <a
      href="https://medbotinventory.streamlit.app/"
      target="_blank"
      className="fixed bottom-4 right-4 z-50 cursor-pointer rounded-full bg-primary p-4 text-primary-foreground hover:bg-primary/80"
    >
      <Bot className="h-6 w-6" />
    </a>
  );
};

export default Chatbot;
