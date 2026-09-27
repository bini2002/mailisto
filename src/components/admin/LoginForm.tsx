"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";
import { Button } from "../ui/Button";
import { ErrorState } from "../ui/States";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="grid gap-5">
      {state && !state.ok && <ErrorState title="Couldn't sign in">{state.message}</ErrorState>}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required className="field" />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="field" />
      </div>
      <Button type="submit" variant="dark" size="lg" loading={pending}>
        {pending ? "Signing in" : "Sign in"}
      </Button>
    </form>
  );
}
