import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { USER_ROLE } from "@/lib/constants";
import AuthService from "@/services/authService";
import { setUser } from "@/store/user/slice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
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
  const [activeTab, setActiveTab] = useState(USER_ROLE.INSTITUTION);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { handleSubmit, register } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: loginUser, isPending: isPending } = useMutation({
    mutationFn: async (payload) => {
      const _payload = {
        ...payload,
        userType: activeTab,
      };
      const { data } = await AuthService.login(_payload);
      return data?.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data?.accessToken);
      dispatch(setUser({ user: data?.user, userRole: data?.userRole }));
      navigate(`/`);
    },
    onError: (error) => {
      console.log(error);
      const errObj = error?.response?.data;
      toast.error(errObj?.message);
    },
  });

  const onSubmit = useCallback(
    (values) => {
      console.log(values);
      loginUser(values);
    },
    [loginUser]
  );

  return (
    <>
      <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>Login into your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <div className="grid gap-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full">
                    <TabsTrigger value={USER_ROLE.INSTITUTION} className="w-1/2">
                      Institution
                    </TabsTrigger>
                    <TabsTrigger value={USER_ROLE.WAREHOUSE} className="w-1/2">
                      Warehouse
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" {...register("email")} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" {...register("password")} required />
                  </div>
                  <Button type="submit" className="w-full" isLoading={isPending}>
                    Login
                  </Button>
                </form>
                <div className="flex flex-col gap-0.5 text-center text-sm">
                  <span>Don&apos;t have an account?</span>
                  <Link to="/institution-signup" className="underline underline-offset-4">
                    Sign up as institution
                  </Link>
                  <Link to="/warehouse-signup" className="underline underline-offset-4">
                    Sign up as warehouse
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
          By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </>
  );
};

export default Login;
