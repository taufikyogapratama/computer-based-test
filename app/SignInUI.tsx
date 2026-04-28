"use client";
import { useRef } from "react";
import { signInWithEmail } from "./signInAction";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/modeToggle";
import { redirect } from "next/navigation";

type props = {
  user: boolean;
  changeUser: (newUser: boolean) => void;
};

const SignIn = (props: props) => {
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const valEmail = email.current?.value as string;
    const valPassword = password.current?.value as string;
    const result = await signInWithEmail(valEmail, valPassword);
    if (result.message === "success") {
      redirect("admin/dashboard");
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="absolute top-3 right-4">
        <ModeToggle />
      </div>
      <main>
        <form onSubmit={handleSubmit}>
          <FieldGroup className="w-80">
            <FieldLegend className="text-center">
              Login Sebagai Guru
            </FieldLegend>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>

              <Input
                type="email"
                ref={email}
                id="email"
                required
                className="border rounded px-1"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                type="password"
                ref={password}
                id="password"
                required
                className="border rounded px-1"
              />
            </Field>
            <Field orientation="horizontal" className="flex justify-between">
              <Button type="submit" className="rounded-md">
                Login
              </Button>
              <Button
                variant="outline"
                type="submit"
                onClick={() => props.changeUser(!props.user)}
                className="rounded-md"
              >
                Mengerjakan Ujian
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </main>
    </div>
  );
};

export default SignIn;
