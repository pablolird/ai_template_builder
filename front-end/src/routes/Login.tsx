import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ModeToggle from "@/components/ModeToggle";

const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.email("Enter a valid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-destructive text-xs mt-1">{message}</p>;
}

export default function Login() {
  const { login, register, isAuthenticated, authLoading } = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  async function handleLogin(data: LoginData) {
    setLoginError(null);
    try {
      await login(data.email, data.password);
      navigate("/");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "";
      setLoginError(msg === "401" ? "Invalid credentials." : "Something went wrong.");
    }
  }

  async function handleRegister(data: RegisterData) {
    setRegisterError(null);
    try {
      await register(data.name, data.email, data.password);
      navigate("/");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "";
      setRegisterError(
        msg === "409" ? "An account with this email already exists." : "Something went wrong."
      );
    }
  }

  if (authLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-foreground" />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-background px-4">
      <div className="flex justify-end p-3">
        <ModeToggle />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          AI Invoice Template Generator
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Sign in to your account to continue
        </p>
      </div>

      <Tabs defaultValue="login" className="w-full max-w-sm">
        <TabsList className="grid grid-cols-2 w-full mb-4">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        {/* Login Tab */}
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>Enter your credentials to sign in.</CardDescription>
            </CardHeader>
            <form onSubmit={loginForm.handleSubmit(handleLogin)}>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    {...loginForm.register("email")}
                  />
                  <FieldError message={loginForm.formState.errors.email?.message} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    {...loginForm.register("password")}
                  />
                  <FieldError message={loginForm.formState.errors.password?.message} />
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-2 mt-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginForm.formState.isSubmitting}
                >
                  {loginForm.formState.isSubmitting ? "Signing in…" : "Sign in"}
                </Button>
                {loginError && (
                  <p className="text-destructive text-sm text-center">{loginError}</p>
                )}
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Register Tab */}
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Create an account</CardTitle>
              <CardDescription>Fill in your details to get started.</CardDescription>
            </CardHeader>
            <form onSubmit={registerForm.handleSubmit(handleRegister)}>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="reg-name">Name</Label>
                  <Input
                    id="reg-name"
                    type="text"
                    placeholder="John Doe"
                    {...registerForm.register("name")}
                  />
                  <FieldError message={registerForm.formState.errors.name?.message} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="you@example.com"
                    {...registerForm.register("email")}
                  />
                  <FieldError message={registerForm.formState.errors.email?.message} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="••••••••"
                    {...registerForm.register("password")}
                  />
                  <FieldError message={registerForm.formState.errors.password?.message} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reg-confirm">Confirm Password</Label>
                  <Input
                    id="reg-confirm"
                    type="password"
                    placeholder="••••••••"
                    {...registerForm.register("confirmPassword")}
                  />
                  <FieldError
                    message={registerForm.formState.errors.confirmPassword?.message}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-2 mt-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={registerForm.formState.isSubmitting}
                >
                  {registerForm.formState.isSubmitting ? "Creating account…" : "Create account"}
                </Button>
                {registerError && (
                  <p className="text-destructive text-sm text-center">{registerError}</p>
                )}
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
