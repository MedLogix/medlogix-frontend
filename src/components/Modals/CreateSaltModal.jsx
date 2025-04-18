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
import SaltService from "@/services/saltService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  useCase: z.string().min(2, { message: "Use case must be at least 2 characters." }),
});

const CreateSaltModal = ({ isOpen, setIsOpen, mode = "create", initialValues = {} }) => {
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues.name || "",
      useCase: initialValues.useCase || "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const isEdit = useMemo(() => {
    return mode === "edit";
  }, [mode]);

  // If in edit mode, update form values when initialValues change
  useEffect(() => {
    if (isEdit && isOpen) {
      form.reset({
        name: initialValues.name || "",
        useCase: initialValues.useCase || "",
      });
    }
  }, [isEdit, isOpen, initialValues, form]);

  useEffect(() => {
    if (isOpen && !isEdit) {
      form.reset({ name: "", useCase: "" });
    }
  }, [isOpen, form, isEdit]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => {
      if (isEdit) {
        return SaltService.updateSalt(initialValues._id, data);
      }
      return SaltService.createSalt(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salts"] });
      setIsOpen(false);
      form.reset();
      toast.success(isEdit ? "Salt updated successfully" : "Salt created successfully");
    },
    onError: (error) => {
      toast.error(isEdit ? "Failed to update salt" : "Failed to create salt");
      console.error(isEdit ? "Failed to update salt:" : "Failed to create salt:", error);
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
      useCase: values.useCase,
    };
    mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>{isEdit ? "Edit Salt" : "Create New Salt"}</DialogTitle>
              <DialogDescription>
                {isEdit ? "Update the details for the salt below" : "Enter the details for the new salt below"}
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter salt name" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="useCase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Use Case</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter use case" {...field} disabled={isPending} />
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

export default CreateSaltModal;
