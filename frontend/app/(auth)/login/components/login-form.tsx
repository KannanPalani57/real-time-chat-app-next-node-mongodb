"use client"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useLoginUser } from "@/app/hooks/apis/auth/login-user";
import { IApiError } from "@/app/hooks/apis/axios-config";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';

import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });
  const { isPending, mutate: loginUser } = useLoginUser({
    onError: (err: IApiError) => {
      toast.error(err.message ?? err.error ?? "Something went wrong");
      //   router.push("/strategy");
    },
    onSuccess(data) {
      console.log({ data })
      if (data.success) {
        console.log({ token: data.accessToken })

        localStorage.setItem("token", data.accessToken)
        router.push("/")

      }
      //   toast.success("Strategy added successfully");
      //   router.push("/strategy");
    },
  });

  const onSubmit = (data) => {
    console.log(data); // This will contain your email and password
    // Handle login logic here, e.g., send to an API
    loginUser(data)
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field >
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...register("email")}

                />
              </Field>
              <Field >
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required {...register("password")} />
              </Field>
              <Field>
                <Button type="submit">Login</Button>
                <Button variant="outline" type="button">
                  Login with Google
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="#">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

