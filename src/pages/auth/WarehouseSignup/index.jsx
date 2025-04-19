import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ManagersDetailsStep from "./ManagersDetailsStep";
import WarehouseDetailsStep from "./WarehouseDetailsStep";
import LocationDetailsStep from "./LocationDetailsStep";
import ReviewStep from "./ReviewStep";
import AuthService from "@/services/authService";
import { toast } from "sonner";
import { USER_ROLE } from "@/lib/constants";

const warehouseSignupSchema = z.object({
  warehouseCode: z.string().min(1, "Warehouse code is required"),
  name: z.string().min(1, "Warehouse name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  registrationNumber: z.string().min(1, "Registration number is required"),
  location: z.object({
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    district: z.string().min(1, "District is required"),
    state: z.string().min(1, "State is required"),
    pincode: z.string().min(1, "Pincode is required"),
    gpsCoordinates: z.object({
      lat: z.union([z.string(), z.number()]).optional(),
      lng: z.union([z.string(), z.number()]).optional(),
    }),
  }),
  managers: z
    .array(
      z.object({
        name: z.string().min(1, "Name is required"),
        contact: z.string().min(1, "Contact is required"),
        email: z.string().optional(),
      })
    )
    .min(1, "At least one incharge is required"),
});

const steps = [
  { label: "Warehouse Details", component: WarehouseDetailsStep },
  { label: "Location Details", component: LocationDetailsStep },
  { label: "Managers Details", component: ManagersDetailsStep },
  { label: "Review", component: ReviewStep },
];

const stepFields = [
  ["warehouseCode", "name", "registrationNumber", "email", "password"],
  [
    "location.address",
    "location.city",
    "location.district",
    "location.state",
    "location.pincode",
    // Optionally: "location.gpsCoordinates.lat", "location.gpsCoordinates.lng"
  ],
  [
    "warehouse.0.name",
    "warehouse.0.contact",
    // "incharge.0.email" is optional
  ],
  [], // Review step, no validation
];

const defaultValues = {
  warehouseCode: "WARE001",
  name: "Warehouse 1",
  email: "warehouse@example.com",
  password: "password",
  registrationNumber: "WARE001",
  location: {
    address: "123 Main St",
    city: "Lucknow",
    district: "Lucknow",
    state: "Uttar Pradesh",
    pincode: "226001",
    gpsCoordinates: {
      lat: 26.85,
      lng: 80.9499,
    },
  },
  managers: [{ name: "John Doe", contact: "9876543210", email: "john.doe@example.com" }],
};

export default function WarehouseSignupForm() {
  const [step, setStep] = useState(0);
  const form = useForm({
    resolver: zodResolver(warehouseSignupSchema),
    defaultValues,
    mode: "onTouched",
  });
  const { mutate, isPending } = useMutation({
    mutationFn: (data) => AuthService.register({ ...data, userType: USER_ROLE.WAREHOUSE }),
    onSuccess: (data) => {
      console.log(data);
      toast.success("Warehouse created successfully");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    },
  });

  const StepComponent = steps[step].component;

  const onSubmit = (data) => {
    // Only called when the submit button is clicked on the last step
    mutate(data);
  };

  const handleNext = async (e) => {
    // Prevent any form submission
    if (e) e.preventDefault();

    const valid = await form.trigger(stepFields[step]);
    if (valid) setStep((s) => s + 1);
  };

  const handleBack = (e) => {
    // Prevent any form submission
    if (e) e.preventDefault();
    setStep((s) => s - 1);
  };

  return (
    <div className="flex w-full items-center justify-center">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardContent className="pt-6">
          <div className="mb-8 flex justify-between">
            {steps.map((s, i) => (
              <div
                key={s.label}
                className={`relative mx-1 flex-1 px-1 py-2 text-center text-sm font-medium transition ${
                  i === step
                    ? "border-b-2 border-primary text-primary"
                    : i < step
                      ? "border-b-2 border-primary/40 text-primary"
                      : "border-b-2 border-muted text-muted-foreground"
                }`}
              >
                {s.label}
              </div>
            ))}
          </div>
          <Form {...form}>
            {step < steps.length - 1 ? (
              <div>
                <StepComponent form={form} />
                <div className="mt-8 flex gap-4">
                  {step > 0 && (
                    <Button type="button" variant="outline" className="w-1/2" onClick={handleBack}>
                      Back
                    </Button>
                  )}
                  <Button
                    type="button"
                    className={`${step > 0 ? "w-1/2" : "w-full"}`}
                    onClick={handleNext}
                    disabled={isPending}
                  >
                    Next
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <StepComponent form={form} />
                <div className="mt-8 flex gap-4">
                  <Button type="button" variant="outline" className="w-1/2" onClick={handleBack}>
                    Back
                  </Button>
                  <Button type="submit" className="w-1/2" isLoading={isPending} disabled={isPending}>
                    {isPending ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </form>
            )}
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
