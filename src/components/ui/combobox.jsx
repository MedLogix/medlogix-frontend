import { Check, ChevronDown, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const Combobox = ({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  searchPlaceholder = "Search options...",
  emptyText = "No options found.",
  className = "w-full",
  multiple = false,
}) => {
  const buttonRef = useRef(null);
  const [buttonWidth, setButtonWidth] = useState(0);
  const [open, setOpen] = useState(false);

  const selectedOptions = multiple
    ? options?.filter((option) => Array.isArray(value) && value.includes(option.value))
    : options?.find((option) => option.value === value);

  const handleSelect = (label) => {
    const option = options?.find((option) => option.label === label);
    if (!option) return;
    if (multiple) {
      if (Array.isArray(value) && value.includes(option.value)) {
        onChange(value.filter((v) => v !== option.value));
      } else {
        onChange([...(Array.isArray(value) ? value : []), option.value]);
      }
    } else {
      onChange(option.value);
      setOpen(false);
    }
  };

  const handleRemoveChip = (optionValue, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (multiple && Array.isArray(value)) {
      onChange(value.filter((v) => v !== optionValue));
    }
  };

  const calculateButtonWidth = useCallback(() => {
    if (buttonRef.current) {
      setButtonWidth(buttonRef.current.offsetWidth);
    }
  }, []);

  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen) {
          calculateButtonWidth();
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          ref={buttonRef}
          variant="outline"
          role="combobox"
          aria-label={placeholder}
          className={cn(
            "justify-between",
            (!value || (Array.isArray(value) && value.length === 0)) && "text-muted-foreground",
            multiple ? "h-auto min-h-9" : "",
            className
          )}
        >
          <div className="flex min-h-[1.5rem] flex-wrap items-center gap-2">
            {multiple ? (
              Array.isArray(selectedOptions) && selectedOptions.length > 0 ? (
                selectedOptions.map((option) => (
                  <Badge key={option.value} className="flex items-center gap-1 pr-1">
                    {option.label}
                    <div
                      role="button"
                      tabIndex={-1}
                      className="ml-1 flex size-3 cursor-pointer items-center justify-center border-0 bg-transparent p-0 hover:opacity-70"
                      onClick={(e) => handleRemoveChip(option.value, e)}
                    >
                      <X />
                    </div>
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )
            ) : (
              <span>{selectedOptions?.label || placeholder}</span>
            )}
          </div>
          <ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" style={{ width: buttonWidth > 0 ? `${buttonWidth}px` : undefined }}>
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options?.map((option) => (
                <CommandItem value={option.label} key={option.value} onSelect={handleSelect}>
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      multiple
                        ? Array.isArray(value) && value.includes(option.value)
                          ? "opacity-100"
                          : "opacity-0"
                        : option.value === value
                          ? "opacity-100"
                          : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Combobox;
