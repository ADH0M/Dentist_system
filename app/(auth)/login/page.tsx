"use client";
import { Input } from "@/components/ui/input";
import { loginUpAction } from "@/lib/actions/auth-action";
import { RegistarToast } from "@/lib/utils/toasts";
import { loginSchema } from "@/lib/validations/schema";
import { EyeIcon, EyeOff } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChangeEvent, useActionState, useEffect, useState } from "react";

const initialState: {
  message: string;
  errors?: [];
} = { message: "" };

export default function Signup() {
  const [state, formAction, isPending] = useActionState(
    loginUpAction,
    initialState,
  );
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [changPassword, setChangePassword] = useState(false);
  const loginValidation = loginSchema.safeParse(formData);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const handleTogaleEye = () => {
    setChangePassword((prev) => !prev);
  };

  const handleError = (faild: string) => {
    switch (faild) {
      case "email": {
        return !loginValidation.success
          ? loginValidation.error.issues.find((e) => e.path[0] === "email")
              ?.message
          : "";
      }
      case "password": {
        return !loginValidation.success
          ? loginValidation.error.issues.find((e) => e.path[0] === "password")
              ?.message
          : "";
      }

      default: {
        return "";
      }
    }
  };

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (state.errors) {
      RegistarToast({ errors: state.errors });
    }

    if (state.path && state.message) {
      console.log(state.path, state.message);

      RegistarToast({ error: { path: state.path, message: state.message } });
    }

    if (state.success) {
      RegistarToast({
        success: {
          path: " successfully",
          message: "login successfully",
        },
      });

      timeout = setTimeout(() => {
        redirect("/");
      }, 1000);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [state]);


  return (
    <div className="w-full flex flex-col items-center justify-center max-h-screen gap-10 p-4    ">
      <div className="w-full flex justify-center items-center   ">
        <div className="bg-card w-full sm:w-3/4 md:w-1/2 lg:w-1/3 rounded-2xl shadow-xl  overflow-hidden ">
          <div className="bg-linear-to-r from-accent to-accent-foreground p-4 text-card-foreground text-center">
            <h2 className="text-2xl font-bold">Login</h2>
            <p className="mt-2">Enter your credentials to sign in</p>
          </div>

          <div className="h-16 flex justify-center items-center">
            {state.path && (
              <div className="bg-accent border-l-4   border-destructive p-4 mx-6 w-full my-4 text-accent-foreground text-sm">
                {state.message}
              </div>
            )}
          </div>

          <form
            action={formAction}
            className="p-6 h-96  flex justify-center flex-col items-center border border-border"
          >
            {/* Email */}
            <div className="md:w-[90%] w-full">
              <label htmlFor="email" className="auth-label ">
                Email Address
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="py-5"
                placeholder="example@email.com"
              />
              <p className={`text-xs  h-5  mt-1 flex items-center`}>
                <span
                  className={`flex-1 ${
                    loginValidation.success
                      ? "text-green-500"
                      : "text-destructive"
                  }`}
                >
                  {formData.email.length <= 0 ? "" : handleError("email")}
                </span>
              </p>
            </div>
            {/* Password */}
            <div className="md:w-[90%] w-full">
              <label htmlFor="password" className="auth-label">
                Password
              </label>
              <span className="block relative ">
                <Input
                  type={changPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="min-h-full block  py-5 "
                  placeholder="********"
                  autoComplete="new-password"
                />
                {changPassword ? (
                  <EyeIcon
                    onClick={handleTogaleEye}
                    size={16}
                    className="absolute text-gray-400 top-1/2 right-3 -translate-y-1/2"
                  />
                ) : (
                  <EyeOff
                    onClick={handleTogaleEye}
                    size={16}
                    className="absolute text-gray-400 top-1/2 right-3 -translate-y-1/2"
                  />
                )}
              </span>
              <p className={`text-xs  h-5  mt-1 flex items-center`}>
                <span
                  className={`flex-1 ${
                    loginValidation.success
                      ? "text-green-500"
                      : "text-destructive"
                  }`}
                >
                  {formData.password.length <= 0 ? "" : handleError("password")}
                </span>
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full md:w-[90%] text-sm  bg-linear-to-t from-accent to-accent-foreground 
              text-white rounded-lg py-3 px-4 font-normal hover:bg-accent transition duration-300"
            >
              {isPending ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="mx-2 block">loading</span>
                </span>
              ) : (
                "Sign In"
              )}
            </button>

            <p className="text-sm text-center text-gray-600">
              Create new account?{" "}
              <Link
                href="/register"
                className="text-accent-foreground hover:underline font-medium"
              >
                register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
