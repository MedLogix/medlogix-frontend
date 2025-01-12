import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { roles } from "@/lib/constants";
import UserService from "@/services/userService";
import { setUser } from "@/store/user/slice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().min(3).max(50),
  password: z.string().min(1).max(50),
});

const Login = () => {
  const [activeTab, setActiveTab] = useState(roles.HOSPITAL);
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState();
  const dispatch = useDispatch();
  const { handleSubmit, register } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const login = useCallback(
    async (payload) => {
      try {
        setIsPending(true);
        const { data } = await UserService.login(payload);
        const dataObj = data.data;
        const user = dataObj.user;
        const accessToken = dataObj.accessToken;
        const refreshToken = dataObj.refreshToken;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        dispatch(setUser(user));
        navigate(`/`);
      } catch (error) {
        const errObj = error?.response?.data;
        toast.error(errObj.message);
      } finally {
        setIsPending(false);
      }
    },
    [dispatch, navigate]
  );

  const onSubmit = useCallback(
    (values) => {
      console.log(values);
      login(values);
    },
    [login]
  );

  //   const handleGoogleLogin = useCallback(async () => {
  //     window.location.href = `${import.meta.env.VITE_API_URL}/api/v1/user/google`;
  //   }, []);

  return (
    <>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>Login into your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <div className="grid gap-6">
                {/* <div className="flex flex-col gap-4">
                  <Button
                    onClick={handleGoogleLogin}
                    variant="outline"
                    className="w-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    Login with Google
                  </Button>
                </div>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div> */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full">
                    <TabsTrigger value={roles.HOSPITAL} className="w-1/2">
                      Hospital
                    </TabsTrigger>
                    <TabsTrigger value={roles.WAREHOUSE} className="w-1/2">
                      Warehouse
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      {...register("email")}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        to="/forgot-password"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      {...register("password")}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    isLoading={isPending}
                  >
                    Login
                  </Button>
                </form>
                <div className="text-center text-sm flex flex-col gap-0.5">
                  <span>Don&apos;t have an account?</span>
                  <Link to="/signup" className="underline underline-offset-4">
                    Sign up as hospital
                  </Link>
                  <Link to="/signup" className="underline underline-offset-4">
                    Sign up as warehouse
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </>
  );
};

export default Login;
