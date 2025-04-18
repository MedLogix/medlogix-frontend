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
import ManufacturerService from "@/services/manufacturerService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  manufacturerName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  repName: z.string().min(2, { message: "Rep name must be at least 2 characters." }),
  repContact: z.number().min(1000000000).max(9999999999, { message: "Contact must be a 10-digit number." }),
});

const CreateManufacturerModal = ({
  isOpen,
  setIsOpen,
  mode = "create",
  initialValues = {},
  onSubmit: onSubmitProp,
}) => {
  const queryClient = useQueryClient();

  const isEdit = useMemo(() => mode === "edit", [mode]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      manufacturerName: initialValues.name || "",
      repName: initialValues.medicalRepresentator?.name || "",
      repContact: initialValues.medicalRepresentator?.contact?.toString() || "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  // If in edit mode, update form values when initialValues change
  useEffect(() => {
    if (isEdit && isOpen) {
      form.reset({
        manufacturerName: initialValues.manufacturerName || initialValues.name || "",
        repName: initialValues.repName || initialValues.medicalRepresentator?.name || "",
        repContact: initialValues.repContact || initialValues.medicalRepresentator?.contact || "",
      });
    }
    if (isOpen && !isEdit) {
      form.reset({
        manufacturerName: "",
        repName: "",
        repContact: "",
      });
    }
  }, [isEdit, isOpen, initialValues, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => {
      if (isEdit) {
        return ManufacturerService.updateManufacturer(initialValues._id, data);
      }
      return ManufacturerService.createManufacturer(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manufacturers"] });
      setIsOpen(false);
      form.reset();
      toast.success(isEdit ? "Manufacturer updated successfully" : "Manufacturer created successfully");
    },
    onError: (error) => {
      toast.error(isEdit ? "Failed to update manufacturer" : "Failed to create manufacturer");
      console.error(isEdit ? "Failed to update manufacturer:" : "Failed to create manufacturer:", error);
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
      name: values.manufacturerName,
      medicalRepresentator: {
        name: values.repName,
        contact: values.repContact,
      },
    };
    if (onSubmitProp) {
      onSubmitProp(formData, { reset: form.reset });
    } else {
      mutate(formData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>{isEdit ? "Edit Manufacturer" : "Create New Manufacturer"}</DialogTitle>
              <DialogDescription>
                {isEdit
                  ? "Update the details for the manufacturer below"
                  : "Enter the details for the new manufacturer below"}
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="manufacturerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc." {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="repName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rep Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="repContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rep Contact</FormLabel>
                  <FormControl>
                    <Input placeholder="9876543210" type="tel" maxLength={10} {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
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

export default CreateManufacturerModal;
