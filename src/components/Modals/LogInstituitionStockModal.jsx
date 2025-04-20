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
import InstitutionStockService from "@/services/instituitionStock";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Combobox from "../ui/combobox";

const formSchema = z.object({
  stockId: z.string().min(2, { message: "Institution Stock ID must be at least 2 characters." }),
  quantityUsed: z.coerce.number().min(1, { message: "Consumed quantity must be at least 1." }),
});

const defaultValues = {
  stockId: "",
  quantityUsed: 0,
};

const LogInstituitionStockModal = ({ isOpen, setIsOpen, institutionStocks }) => {
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const stockId = form.watch("stockId");

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => {
      return InstitutionStockService.logInstitutionStockUsage(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institutionStock"] });
      setIsOpen(false);
      form.reset();
      toast.success("Institution Stock logged successfully");
    },
    onError: (error) => {
      toast.error("Failed to log institution stock");
      console.error("Failed to log institution stock:", error);
    },
  });

  const institutionStockOptions = useMemo(() => {
    return institutionStocks?.map((institutionStock) => ({
      label: institutionStock.medicineId.name,
      value: institutionStock._id,
    }));
  }, [institutionStocks]);

  const availableQuantity = useMemo(() => {
    const institutionStock = institutionStocks?.find((institutionStock) => institutionStock?._id === stockId);
    const totalQuantity = institutionStock?.stocks?.reduce((acc, stock) => acc + stock.currentQuantityInStrips, 0);

    return totalQuantity || 0;
  }, [institutionStocks, stockId]);

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
      stockId: values.stockId,
      quantityUsed: values.quantityUsed,
    };
    mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>Log Institution Stock</DialogTitle>
              <DialogDescription>Enter the details for the new institution stock below</DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="stockId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medicine</FormLabel>
                  <FormControl>
                    <Combobox
                      options={institutionStockOptions}
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
              name="quantityUsed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity Used ({availableQuantity} packets available)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter quantity used" {...field} type="number" disabled={isPending} />
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
                Log
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default LogInstituitionStockModal;
