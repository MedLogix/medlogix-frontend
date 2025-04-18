import * as React from "react";

import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

const Input = React.forwardRef(({ className, wrapperClassName, type, togglePassword = true, ...props }, ref) => {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  const toggleVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };
  return (
    <div className={cn("relative flex items-center", wrapperClassName)}>
      <input
        type={togglePassword && isPasswordVisible ? "text" : type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
      {type === "password" && togglePassword && (
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute right-3 text-muted-foreground hover:text-foreground focus:outline-none"
        >
          {isPasswordVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      )}
    </div>
  );
});
Input.displayName = "Input";

export { Input };
