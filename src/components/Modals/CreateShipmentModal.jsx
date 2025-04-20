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
import { ScrollArea } from "@/components/ui/scroll-area";
import logisticsService from "@/services/logisticsService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, PlusCircle } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Schema for a single vehicle
const vehicleSchema = z.object({
  vehicleNumber: z.string().min(1, { message: "Vehicle Number is required." }),
  driverName: z.string().min(1, { message: "Driver Name is required." }),
  driverContact: z.string().min(1, { message: "Driver Contact is required." }), // Add more specific validation (e.g., regex) if needed
  loadedAt: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid Loaded At date." }),
  departedAt: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid Departed At date." }),
});

// Main form schema
const formSchema = z.object({
  shipmentId: z.string().optional(),
  vehicles: z.array(vehicleSchema).min(1, { message: "At least one vehicle is required." }),
});

const CreateShipmentModal = ({ isOpen, setIsOpen, requirementId }) => {
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shipmentId: "",
      vehicles: [{ vehicleNumber: "", driverName: "", driverContact: "", loadedAt: "", departedAt: "" }],
    },
    mode: "onSubmit",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "vehicles",
  });

  const { mutate: createShipment, isPending } = useMutation({
    mutationFn: (formData) => {
      const payload = {
        requirementId,
        vehicles: formData.vehicles.map((v) => ({
          ...v,
          // Ensure dates are in a format the backend expects (e.g., ISO string)
          // Assuming the date input type="datetime-local" provides a suitable string
          loadedAt: new Date(v.loadedAt).toISOString(),
          departedAt: new Date(v.departedAt).toISOString(),
        })),
        ...(formData.shipmentId && { shipmentId: formData.shipmentId }), // Include optional shipmentId
      };
      return logisticsService.createLogistics(payload);
    },
    onSuccess: (data) => {
      const newLogisticId = data?.data?.data?._id; // Adjust based on actual API response
      toast.success(
        `Shipment ${newLogisticId ? `(ID: ${newLogisticId.slice(-6).toUpperCase()}) ` : ""}created successfully!`
      );
      queryClient.invalidateQueries({ queryKey: ["warehouseRequirementDetail", requirementId] });
      queryClient.invalidateQueries({ queryKey: ["logistics"] }); // Invalidate general logistics list if exists
      handleClose();
    },
    onError: (error) => {
      toast.error(`Failed to create shipment: ${error?.response?.data?.message || error.message}`);
    },
  });

  const onSubmit = (values) => {
    createShipment(values);
  };

  const addNewVehicle = () => {
    append({ vehicleNumber: "", driverName: "", driverContact: "", loadedAt: "", departedAt: "" });
  };

  const handleClose = () => {
    if (isPending) return; // Prevent closing while submitting
    form.reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-3xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Create New Shipment</DialogTitle>
              <DialogDescription>
                Enter details for the vehicles handling requirement ID: {requirementId?.slice(-6).toUpperCase()}.
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="shipmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipment ID (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., SHIP-123" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <h4 className="text-md font-semibold">Vehicle Details</h4>
            <ScrollArea className="h-[300px] max-h-[50vh] overflow-y-auto pr-4">
              <div className="space-y-4">
                {" "}
                {/* Container for spacing */}
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
                        <span className="sr-only">Remove vehicle</span>
                      </Button>
                    )}
                    <h5 className="mb-2 text-sm font-semibold">Vehicle {index + 1}</h5>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name={`vehicles.${index}.vehicleNumber`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Vehicle Number</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., UP32 AA 1234" {...field} disabled={isPending} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`vehicles.${index}.driverName`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Driver Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., John Doe" {...field} disabled={isPending} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`vehicles.${index}.driverContact`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Driver Contact</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 9876543210" {...field} disabled={isPending} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name={`vehicles.${index}.loadedAt`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Loaded At</FormLabel>
                            <FormControl>
                              {/* Consider using a DateTime picker component */}
                              <Input type="datetime-local" {...field} disabled={isPending} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`vehicles.${index}.departedAt`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Departed At</FormLabel>
                            <FormControl>
                              {/* Consider using a DateTime picker component */}
                              <Input type="datetime-local" {...field} disabled={isPending} />
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
              onClick={addNewVehicle}
              disabled={isPending}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Another Vehicle
            </Button>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending} isLoading={isPending}>
                {isPending ? "Creating..." : "Create Shipment"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateShipmentModal;
