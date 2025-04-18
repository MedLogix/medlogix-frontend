import { useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

export default function InchargeDetailsStep({ form }) {
  const { control } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "incharge" });

  return (
    <div className="space-y-6">
      {fields.map((field, idx) => (
        <div key={field.id} className="relative rounded-md border p-4">
          <div className="space-y-3">
            <FormField
              control={control}
              name={`incharge.${idx}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Dr. Alok Verma" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`incharge.${idx}.contact`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact</FormLabel>
                  <FormControl>
                    <Input placeholder="9876543211" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`incharge.${idx}.email`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="alok.verma@uphospital.in" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {fields.length > 1 && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute right-2 top-2"
              onClick={() => remove(idx)}
            >
              Remove
            </Button>
          )}
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => append({ name: "", contact: "", email: "" })}>
        Add Incharge
      </Button>
    </div>
  );
}
