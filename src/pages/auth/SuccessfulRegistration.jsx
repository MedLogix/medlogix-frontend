import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router";

const SuccessfulRegistration = () => {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-xl">Registration Successful</CardTitle>
          <CardDescription>Your account is pending approval</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-center">
            <p className="text-muted-foreground">
              Thank you for registering. Your data has been submitted and the approval process is now underway. You will
              be notified via email very soon once your account has been approved.
            </p>
            <Link to="/login">
              <Button className="mt-4 w-full">Return to Login</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        If you have any questions, please contact our <a href="#">support team</a>.
      </div>
    </div>
  );
};

export default SuccessfulRegistration;
