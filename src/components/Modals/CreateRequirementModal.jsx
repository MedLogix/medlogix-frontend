import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";

import RequirementService from "@/services/requirementService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Combobox from "../ui/combobox";

// Schema for a single batch
const medicineSchema = z.object({
  medicineId: z.string(),
  requestedQuantity: z.coerce.number().min(1, { message: "Quantity must be at least 1." }),
});

// Main form schema
const formSchema = z.object({
  warehouseId: z.string(),
  medicines: z.array(medicineSchema).min(1, { message: "Please select at least one medicine." }),
});

const defaultValues = {
  warehouseId: "",
  medicines: [
    {
      medicineId: "",
      requestedQuantity: "",
    },
  ],
};

const CreateRequirementModal = ({ isOpen, setIsOpen, warehouses, medicines }) => {
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "medicines",
  });

  const medicineOptions = useMemo(() => {
    return medicines?.map((medicine) => ({
      label: medicine.name,
      value: medicine._id,
    }));
  }, [medicines]);

  const warehouseOptions = useMemo(() => {
    return warehouses?.map((warehouse) => ({
      label: warehouse.name,
      value: warehouse._id,
    }));
  }, [warehouses]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      form.reset(defaultValues);
    }
  }, [isOpen, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => RequirementService.createRequirement(data), // Use the actual service here
    onSuccess: (data, variables) => {
      const submittedWarehouseName =
        warehouseOptions.find((opt) => opt.value === variables.warehouseId)?.label || "Warehouse";
      queryClient.invalidateQueries({ queryKey: ["requirements", variables.warehouseId] });
      queryClient.invalidateQueries({ queryKey: ["requirements"] }); // General invalidation
      setIsOpen(false);
      toast.success(`Requirement added successfully for ${submittedWarehouseName}`);
    },
    onError: (error) => {
      toast.error(`Failed to add batch: ${error?.response?.data?.message || error.message}`);
      console.error("Failed to add batch:", error);
    },
  });

  const handleOpenChange = (open) => {
    if (!open && !isPending) {
      form.reset(); // Reset form when closing manually only if not pending
    }
    setIsOpen(open);
  };

  const onSubmit = (values) => {
    const payload = {
      warehouseId: values.warehouseId,
      medicines: values.medicines, // The backend expects 'stocks' array
    };
    mutate(payload);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Add New Medicine Batch</DialogTitle>
              <DialogDescription>Select a medicine and enter the details for the new batch.</DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="warehouseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warehouse</FormLabel>
                  <FormControl>
                    <Combobox
                      options={warehouseOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select warehouse"
                      searchPlaceholder="Search warehouse..."
                      emptyText="No warehouse found."
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="relative space-y-3 rounded-md border p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Medicine Details</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => append({ medicineId: "", quantity: "" })}
                  disabled={isPending}
                >
                  <Plus />
                </Button>
              </div>
              {fields.map((item, index) => (
                <div key={item.id} className="relative grid grid-cols-1 gap-4 rounded-md border p-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`medicines.${index}.medicineId`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medicine</FormLabel>
                        <FormControl>
                          <Combobox
                            options={medicineOptions}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select medicine"
                            searchPlaceholder="Search medicine..."
                            emptyText="No medicine found."
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`medicines.${index}.requestedQuantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity (in packs)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 100" {...field} disabled={isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => remove(index)}
                      disabled={isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isPending}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending} isLoading={isPending}>
                Create Requirement
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRequirementModal;
