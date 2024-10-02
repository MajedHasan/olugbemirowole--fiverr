"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Validation schema using Zod, allowing either email, policyNo, or phoneNumber
const signInSchema = z.object({
  loginIdentifier: z.string().nonempty({
    message: "Please provide email, policy number, or phone number",
  }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInSchema),
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");

    // Create a payload for login
    const payload = {
      password: data.password,
    };

    // Check if the loginIdentifier is an email, policyNo, or phoneNumber
    let loginIdentifier = data.loginIdentifier;
    if (data.loginIdentifier.includes("@")) {
      // It's an email
      loginIdentifier = data.loginIdentifier;
    } else if (/^SH\/[\w\/]+$/.test(data.loginIdentifier)) {
      // It's a policy number based on "SH/..." format
      loginIdentifier = data.loginIdentifier;
    } else if (/^\d+$/.test(data.loginIdentifier)) {
      // It's a phone number if it only contains digits
      loginIdentifier = data.loginIdentifier;
    } else {
      // Fallback for any unrecognized format
      setErrorMessage("Invalid login identifier format.");
      setLoading(false);
      return;
    }

    payload.loginIdentifier = loginIdentifier;

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const uData = await res.json();
        const userData = uData.data;

        localStorage.setItem("dcPortal-user", JSON.stringify(userData));

        switch (userData.role) {
          case "ENROLLEES":
            router.push("/enrollees");
            break;
          case "HOSPITAL":
            router.push("/hospital");
            break;
          case "ORGANISATION":
            router.push("/organisation");
            break;
          case "HMO":
            router.push("/hmo");
            break;
          default:
            router.push("/");
            break;
        }
      } else {
        const errorData = await res.json();
        setErrorMessage(errorData.message || "Login failed");
      }
    } catch (error) {
      setErrorMessage("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <CardHeader>
          <Image
            src="/img/logo.jpeg"
            alt="Logo"
            width={500}
            height={500}
            className="w-full h-full max-w-[500px] mx-auto"
          />
          <h2 className="text-2xl font-bold text-center">Sign In</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="mb-4">
              <Label htmlFor="loginIdentifier">
                Email, Policy No, or Phone Number
              </Label>
              <Input
                id="loginIdentifier"
                type="text"
                {...register("loginIdentifier")}
                className="mt-1 block w-full border rounded-md p-2"
                placeholder="Enter email, policy number, or phone number"
              />
              {errors.loginIdentifier && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.loginIdentifier.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                className="mt-1 block w-full border rounded-md p-2"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {errorMessage && (
              <p className="mb-4 text-sm text-red-600 text-center">
                {errorMessage}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
