import { BrainCircuit, LoaderCircle } from "lucide-react";
import { Card, CardHeader, CardTitle } from "./ui/card";

const FullScreenLoader = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>
              <div className="flex flex-col items-center gap-2">
                <div className="flex size-20 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <BrainCircuit className="size-14" />
                </div>
                <span className="text-2xl">MockVerse</span>

                <span className="mt-2 flex items-center gap-1.5">
                  <LoaderCircle className="size-5 animate-spin" /> Loading...
                </span>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default FullScreenLoader;
