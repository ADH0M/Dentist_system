"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createUser } from "@/lib/actions/users";
import { useActionState, useState } from "react";
// Adjust path to your action

const ROLES = ["admin", "assistant", "dentist", "receptionist"] as const;
type Role = (typeof ROLES)[number];
export type AddAssistantState = {
  success: boolean;
  error?: string;
  message?: string;
};

export function AddAssistant() {
  const initialState: AddAssistantState = {
    success: false,
    error: "",
    message: "",
  };
  const [open, setOpen] = useState(false);
  const [data, formAction, isPending] = useActionState(
    createUser,
    initialState,
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full cursor-pointer hover:text-primary"
        >
          Create Assistant
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Create New Assistant</DialogTitle>
            <DialogDescription>
              Fill in the details below and click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          {/* Feedback Message */}
          {data.success && (
            <div
              className={`p-3 rounded-md text-sm ${"bg-sidebar-primary text-green-700 border border-green-200"}`}
            >
              {data.message}
            </div>
          )}

          {data.error && (
            <div
              className={`p-3 rounded-md text-sm ${"bg-sidebar-primary text-red-500 border border-green-200"}`}
            >
              {data.error}
            </div>
          )}

          <FieldGroup className="mt-4">
            {/* Username */}
            <Field>
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                name="username"
                placeholder="johndoe"
                required
                minLength={3}
                maxLength={30}
                disabled={isPending}
              />
            </Field>

            {/* Email */}
            <Field>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                required
                disabled={isPending}
              />
            </Field>

            {/* Password */}
            <Field>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
                disabled={isPending}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Min 6 chars, include letters & numbers
              </p>
            </Field>

            {/* Phone (Optional) */}
            <Field>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                disabled={isPending}
                max={11}
                required
                min={11}
              />
            </Field>

            {/* Role Select */}
            <Field>
              <Label htmlFor="type">Role *</Label>
              <Select
                name="type"
                defaultValue="assistant"
                required
                disabled={isPending}
              >
                <SelectTrigger id="type" className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem
                      key={role}
                      value={role}
                      className="cursor-pointer"
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
