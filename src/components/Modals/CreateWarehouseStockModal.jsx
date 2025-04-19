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
// Assume this service exists and has an addStock method
// import WarehouseStockService from "@/services/warehouseStockService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Trash2 } from "lucide-react";
import WarehouseStockService from "@/services/warehouseStock";
import { useSelector } from "react-redux";
import Combobox from "../ui/combobox";
import { ScrollArea } from "@radix-ui/react-scroll-area";

// Schema for a single batch
const batchSchema = z.object({
  batchName: z.string().min(1, { message: "Batch Name is required." }),
  quantity: z.coerce.number().min(1, { message: "Quantity must be at least 1." }), // Use coerce for input type="number"
  expiryDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format." }), // Basic validation, consider a date picker
  purchasePrice: z.coerce.number().min(0, { message: "Purchase Price cannot be negative." }),
  sellingPrice: z.coerce.number().min(0, { message: "Selling Price cannot be negative." }),
  mrp: z.coerce.number().min(0, { message: "MRP cannot be negative." }),
  receivedDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format." }), // Basic validation, consider a date picker
  // Optional fields based on schema (add if needed):
  mfgDate: z.string().optional(),
  packetSize: z
    .object({
      strips: z.coerce.number().optional(),
      tabletsPerStrip: z.coerce.number().optional(),
    })
    .optional(),
});

// Main form schema
const formSchema = z.object({
  medicineId: z.string({ required_error: "Please select a medicine." }).min(1, "Please select a medicine."),
  batches: z.array(batchSchema).min(1, { message: "At least one batch is required." }),
});

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
    defaultValues: {
      medicineId: "",
      batches: [
        {
          batchName: "",
          quantity: 0,
          expiryDate: "",
          purchasePrice: 0,
          sellingPrice: 0,
          mrp: 0,
          receivedDate: "",
          mfgDate: "",
          packetSize: { strips: 0, tabletsPerStrip: 0 },
        },
      ],
    },
    mode: "onSubmit",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "batches",
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      form.reset({
        medicineId: "",
        batches: [
          {
            batchName: "",
            quantity: 0,
            expiryDate: "",
            purchasePrice: 0,
            sellingPrice: 0,
            mrp: 0,
            receivedDate: "",
            mfgDate: "",
            packetSize: { strips: 0, tabletsPerStrip: 0 },
          },
        ],
      });
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
      toast.success(`Stock added successfully for ${submittedMedicineName}`);
    },
    onError: (error) => {
      toast.error(`Failed to add stock: ${error?.response?.data?.message || error.message}`);
      console.error("Failed to add stock:", error);
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
      stocks: values.batches, // The backend expects 'stocks' array
    };
    mutate(payload);
  };

  const addNewBatch = () => {
    append({
      batchName: "",
      quantity: 0,
      expiryDate: "",
      purchasePrice: 0,
      sellingPrice: 0,
      mrp: 0,
      receivedDate: "",
      mfgDate: "",
      packetSize: { strips: 0, tabletsPerStrip: 0 },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Add New Medicine Stock</DialogTitle>
              <DialogDescription>Select a medicine and enter the details for the new stock batches.</DialogDescription>
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

            <ScrollArea className="h-[400px] overflow-y-auto">
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="relative space-y-3 rounded-md border p-4">
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 h-6 w-6 text-destructive hover:text-destructive"
                        onClick={() => remove(index)}
                        disabled={isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove batch</span>
                      </Button>
                    )}
                    <h4 className="mb-2 text-sm font-semibold">Batch {index + 1}</h4>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name={`batches.${index}.batchName`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Batch Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., BATCH123" {...field} disabled={isPending} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`batches.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity (Units/Strips)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="e.g., 100" {...field} disabled={isPending} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`batches.${index}.expiryDate`}
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
                        name={`batches.${index}.receivedDate`}
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
                        name={`batches.${index}.purchasePrice`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Purchase Price (per unit)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="e.g., 50.50"
                                {...field}
                                disabled={isPending}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`batches.${index}.sellingPrice`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Selling Price (per unit)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="e.g., 65.00"
                                {...field}
                                disabled={isPending}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`batches.${index}.mrp`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>MRP (per unit)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="e.g., 70.00"
                                {...field}
                                disabled={isPending}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`batches.${index}.mfgDate`}
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
                        name={`batches.${index}.packetSize.strips`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Strips</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} disabled={isPending} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`batches.${index}.packetSize.tabletsPerStrip`}
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
                ))}
              </div>
            </ScrollArea>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={addNewBatch}
              disabled={isPending}
            >
              Add Another Batch
            </Button>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isPending}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending} isLoading={isPending}>
                {isPending ? "Adding..." : "Add Stock"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWarehouseStockModal;
