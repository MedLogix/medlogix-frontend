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
import MedicineService from "@/services/medicineService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { z } from "zod";
import Combobox from "../ui/combobox";
import { Switch } from "../ui/switch";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  medicineType: z.string().min(2, { message: "Medicine type must be at least 2 characters." }),
  manufacturer: z.string().min(2, { message: "Manufacturer must be at least 2 characters." }),
  isTablets: z.boolean(),
  salts: z.array(z.string()).min(1, { message: "At least one salt is required." }),
});

const CreateMedicineModal = ({ isOpen, setIsOpen, mode = "create", initialValues = {} }) => {
  const queryClient = useQueryClient();
  const { salts } = useSelector((state) => state.salt);
  const { manufacturers } = useSelector((state) => state.manufacturer);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues?.name || "",
      medicineType: initialValues?.medicineType || "",
      manufacturer: initialValues?.manufacturer?._id || "",
      isTablets: initialValues?.isTablets || false,
      salts: initialValues?.salts?.map((salt) => salt?._id) || [],
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const saltOptions = useMemo(() => salts.map((salt) => ({ label: salt.name, value: salt._id })), [salts]);
  const manufacturerOptions = useMemo(
    () => manufacturers.map((manufacturer) => ({ label: manufacturer.name, value: manufacturer._id })),
    [manufacturers]
  );

  const isEdit = useMemo(() => {
    return mode === "edit";
  }, [mode]);

  // If in edit mode, update form values when initialValues change
  useEffect(() => {
    if (isEdit && isOpen) {
      form.reset({
        name: initialValues?.name || "",
        medicineType: initialValues?.medicineType || "",
        manufacturer: initialValues?.manufacturer?._id || "",
        isTablets: initialValues?.isTablets || false,
        salts: initialValues?.salts?.map((salt) => salt?._id) || [],
      });
    }
  }, [isEdit, isOpen, initialValues, form]);

  useEffect(() => {
    if (isOpen && !isEdit) {
      form.reset({ name: "", medicineType: "", manufacturer: "", isTablets: false, salts: [] });
    }
  }, [isOpen, form, isEdit]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => {
      if (isEdit) {
        return MedicineService.updateMedicine(initialValues._id, data);
      }
      return MedicineService.createMedicine(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      setIsOpen(false);
      form.reset();
      toast.success(isEdit ? "Medicine updated successfully" : "Medicine created successfully");
    },
    onError: (error) => {
      toast.error(isEdit ? "Failed to update medicine" : "Failed to create medicine");
      console.error(isEdit ? "Failed to update medicine:" : "Failed to create medicine:", error);
    },
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const handleOpenChange = (open) => {
    if (!open && !isPending) {
      form.reset();
    }
    setIsOpen(open);
  };

  const onSubmit = (values) => {
    const formData = {
      name: values.name,
      medicineType: values.medicineType,
      manufacturer: values.manufacturer,
      salts: values.salts,
      isTablets: values.isTablets,
    };
    mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>{isEdit ? "Edit Medicine" : "Create New Medicine"}</DialogTitle>
              <DialogDescription>
                {isEdit ? "Update the details for the medicine below" : "Enter the details for the new medicine below"}
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter medicine name" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="medicineType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medicine Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter medicine type" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="manufacturer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manufacturer</FormLabel>
                  <FormControl>
                    <Combobox
                      options={manufacturerOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select manufacturer"
                      searchPlaceholder="Search manufacturer..."
                      emptyText="No manufacturer found."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="salts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salts</FormLabel>
                  <FormControl>
                    <Combobox
                      options={saltOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select salt"
                      searchPlaceholder="Search salt..."
                      emptyText="No salt found."
                      multiple={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isTablets"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-row items-center gap-2">
                    <FormLabel>Is Tablets</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isPending}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending} isLoading={isPending}>
                {isEdit ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMedicineModal;
