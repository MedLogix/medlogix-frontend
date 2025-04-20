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

import WarehouseStockService from "@/services/warehouseStock";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { z } from "zod";
import Combobox from "../ui/combobox";

// Schema for a single batch
const batchSchema = z.object({
  quantity: z.coerce.number().min(1, { message: "Quantity must be at least 1." }), // Use coerce for input type="number"
  expiryDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format." }), // Basic validation, consider a date picker
  purchasePrice: z.coerce.number().min(0, { message: "Purchase Price cannot be negative." }),
  sellingPrice: z.coerce.number().min(0, { message: "Selling Price cannot be negative." }),
  mrp: z.coerce.number().min(0, { message: "MRP cannot be negative." }),
  receivedDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format." }), // Basic validation, consider a date picker
  // Optional fields based on schema (add if needed):
  mfgDate: z.string(),
  packetSize: z.object({
    strips: z.coerce.number(),
    tabletsPerStrip: z.coerce.number(),
  }),
});

// Main form schema
const formSchema = z.object({
  medicineId: z.string({ required_error: "Please select a medicine." }).min(1, "Please select a medicine."),
  batch: batchSchema,
});

const defaultValues = {
  medicineId: "",
  batch: {
    quantity: "",
    expiryDate: "",
    purchasePrice: "",
    sellingPrice: "",
    mrp: "",
    receivedDate: "",
    mfgDate: "",
    packetSize: { strips: "", tabletsPerStrip: "" },
  },
};

const CreateWarehouseStockModal = ({ isOpen, setIsOpen }) => {
  const queryClient = useQueryClient();
  const { medicines } = useSelector((state) => state.medicine);

  const medicineOptions = useMemo(() => {
    return medicines.map((medicine) => ({
      label: medicine.name,
      value: medicine._id,
    }));
  }, [medicines]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onSubmit",
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      form.reset(defaultValues);
    }
  }, [isOpen, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => WarehouseStockService.createWarehouseStock(data), // Use the actual service here
    onSuccess: (data, variables) => {
      const submittedMedicineName =
        medicineOptions.find((opt) => opt.value === variables.medicineId)?.label || "Medicine";
      queryClient.invalidateQueries({ queryKey: ["warehouseStock", variables.medicineId] });
      queryClient.invalidateQueries({ queryKey: ["warehouseStock"] }); // General invalidation
      setIsOpen(false);
      toast.success(`Batch added successfully for ${submittedMedicineName}`);
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
      medicineId: values.medicineId,
      batch: values.batch, // The backend expects 'stocks' array
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
              name="medicineId"
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

            <div className="relative space-y-3 rounded-md border p-4">
              <h4 className="mb-2 text-sm font-semibold">Batch Details</h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name={`batch.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity (Packets)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 100" {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`batch.expiryDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        {/* Replace with Date Picker component for better UX */}
                        <Input type="date" {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`batch.receivedDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Received Date</FormLabel>
                      <FormControl>
                        {/* Replace with Date Picker component for better UX */}
                        <Input type="date" {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`batch.purchasePrice`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purchase Price (per packet)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="e.g., 50.50" {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`batch.sellingPrice`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selling Price (per packet)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="e.g., 65.00" {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`batch.mrp`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MRP (per packet)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="e.g., 70.00" {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`batch.mfgDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MFG Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`batch.packetSize.strips`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Strips per packet</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`batch.packetSize.tabletsPerStrip`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tablets per strip</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isPending}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending} isLoading={isPending}>
                {isPending ? "Adding..." : "Add Batch"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWarehouseStockModal;
