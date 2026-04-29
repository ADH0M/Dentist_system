"use client";

import { toast } from "sonner";

interface Error {
  path: string | undefined;
  message: string | undefined;
}

export function RegistarToast({
  errors,
  success,
  pending,
  error,
}: {
  errors?: Error[];
  success?: Error;
  pending?: Error;
  error?: Error;
}) {
  if (errors && errors.length > 0) {
    errors.map((msg) => toast.error(msg.message, { position: "top-left" }));
  }

  if (error) {
    toast.error(error.message, { position: "top-left" });
  }

  if (success && success.path) {
    toast.success(success.message, { position: "top-right" });
  }

  if (pending && pending.path) {
    toast.promise<{ name: string }>(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ name: "Event" }), 2000),
        ),
      {
        loading: "Loading...",
        success: (data) => `${data.name} has been created`,
        error: "Error",
        position: "top-center",
      },
    );
  }
};

export function RejectedToast (msg:string){
  return toast.error(`${msg}` , {position:'top-left'})
}

export function SuccessToast (msg:string){
  return toast.success(`${msg}` , {position:'top-left'})
}
