"use client";
import { useDebounce } from "@/hooks/useDebounce";
import {
  isExistEmail,
  isExistPhone,
  registerAction,
  SignupFormState,
} from "@/lib/actions/auth-action";
import { RegistarToast } from "@/lib/utils/toasts";
import {
  emailValid,
  phoneValid,
  registrationSchema,
  userCheckPassword,
  usernameValid,
} from "@/lib/validations/schema";
import { InfoIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ChangeEvent,
  useActionState,
  useEffect,
  useMemo,
  useState,
} from "react";

const initialState: SignupFormState = { message: "" };

export default function Signup() {
  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState,
  );

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    phone: "",
  });

  const [touched, setTouched] = useState({
    username: false,
    email: false,
    phone: false,
    password: false,
    confirmPassword: false,
  });

  const [emailIsExist, setEmailIsExists] = useState(false);
  const [phoneIsExist, setPhoneIsExists] = useState(false);

  // Individual field validation
  const usernameValidation = useMemo(
    () => usernameValid.safeParse(formData.username),
    [formData.username],
  );

  const emailValidation = useMemo(
    () => emailValid.safeParse(formData.email),
    [formData.email],
  );

  const phoneValidation = useMemo(
    () => phoneValid.safeParse(formData.phone),
    [formData.phone],
  );

  const passwordValidation = useMemo(
    () =>
      userCheckPassword.safeParse({
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      }),
    [formData.password, formData.confirmPassword],
  );

  // Check if form is valid for submission
  const isFormValid = useMemo(() => {
    const result = registrationSchema.safeParse({
      ...formData,
      terms: true, // Assuming terms is checked
    });

    return result.success;
  }, [formData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Mark field as touched on change
    if (!touched[name as keyof typeof touched]) {
      setTouched((prev) => ({ ...prev, [name]: true }));
    }
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // Helper to get error message
  const getFieldError = (field: string): string => {
    if (!touched[field as keyof typeof touched]) return "";

    switch (field) {
      case "username":
        if (!usernameValidation.success)
          return usernameValidation.error.issues[0].message;
        return formData.username ? "✓ Valid" : "";
      case "email":
        if (!emailValidation.success)
          return emailValidation.error.issues[0].message;
        return formData.email ? "✓ Valid" : "";
      case "phone":
        if (!phoneValidation.success)
          return phoneValidation.error.issues[0].message;
        return formData.phone ? "✓ Valid" : "";
      case "password":
        if (!passwordValidation.success) {
          const passwordError = passwordValidation.error.issues.find(
            (i) => i.path[0] === "password",
          );
          if (passwordError) return passwordError.message;
        }
        return formData.password ? "✓ Valid" : "";
      case "confirmPassword":
        if (!passwordValidation.success) {
          const confirmError = passwordValidation.error.issues.find(
            (i) => i.path[0] === "confirmPassword",
          );
          if (confirmError) return confirmError.message;
        }
        return formData.confirmPassword ? "✓ Valid" : "";
      default:
        return "";
    }
  };

  const emailDebounce = useDebounce(formData.email);
  const phoneDebounce = useDebounce(formData.phone);

  useEffect(() => {
    if (emailValidation.success) {
      const emailFun = async () => {
        const email = await isExistEmail(emailDebounce);
        if (email) setEmailIsExists(true);
        else setEmailIsExists(false);
      };
      emailFun();
    }
  }, [emailValidation.success, emailDebounce]);

  useEffect(() => {
    if (phoneValidation.success) {
      const phoneFun = async () => {
        const phone = await isExistPhone(phoneDebounce);
        if (phone) setPhoneIsExists(true);
        else setPhoneIsExists(false);
      };
      phoneFun();
    }
  }, [phoneValidation.success, phoneDebounce]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (state.errors) {
      RegistarToast({ errors: state.errors });
    }

    if (state.path && state.message) {
      RegistarToast({ error: { path: state.path, message: state.message } });
    }

    if (state.success) {
      RegistarToast({
        success: {
          path: "create new user successfully",
          message: "create new user successfully",
        },
      });

      timeout = setTimeout(() => {
        redirect("/login");
      }, 1000);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [state]);
  return (
    <div className="w-full flex flex-col items-center justify-center max-h-screen gap-10 p-4 ">
      <div className="w-full flex justify-center   h-full ">
        <div className="bg-card w-full sm:w-1/2 md:w-1/3 rounded-2xl shadow-xl  overflow-hidden ">
          <div className="bg-linear-to-r from-accent to-accent-foreground p-4 text-card-foreground text-center">
            <h2 className="text-2xl font-bold">Create New Account</h2>
            <p className="mt-2">Fill in the details to create a new account</p>
          </div>

          {state.path && (
            <div className="bg-destructive-foreground border-l-4 border-destructive p-4 mx-6 mt-4 text-red-700 text-sm">
              {state.path}
            </div>
          )}

          <form
            action={formAction}
            className="p-4  flex justify-center flex-col items-center border border-border"
          >
            {/* Username */}
            <div className="md:w-[90%] w-full">
              <label htmlFor="username" className="auth-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`auth-input ${
                  touched.username &&
                  !usernameValidation.success &&
                  formData.username
                    ? "border-destructive"
                    : touched.username &&
                        usernameValidation.success &&
                        formData.username
                      ? "border-green-500"
                      : ""
                }`}
                placeholder="Username"
                autoComplete="off"
              />
              <p
                className={`text-xs  h-5  mt-1 ${
                  getFieldError("username").includes("Valid")
                    ? "text-green-500"
                    : "text-destructive"
                }`}
              >
                {getFieldError("username")}
              </p>
            </div>

            {/* Email */}
            <div className="md:w-[90%] w-full ">
              <label htmlFor="email" className="auth-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`auth-input ${
                  touched.email && !emailValidation.success && formData.email
                    ? "border-destructive"
                    : touched.email && emailValidation.success && formData.email
                      ? "border-green-500"
                      : ""
                }`}
                placeholder="example@email.com"
              />
              <p className={`text-xs  h-5  mt-1 flex items-center`}>
                <span
                  className={`flex-1 ${
                    getFieldError("email").includes("Valid")
                      ? "text-green-500"
                      : "text-destructive"
                  }`}
                >
                  {getFieldError("email")}
                </span>

                {emailIsExist && (
                  <span className="text-xs text-destructive inline-flex gap-2 items-center">
                    <span className="block text-[10px]">Your emil exist</span>
                    <InfoIcon size={15} />
                  </span>
                )}
              </p>
            </div>

            {/* Phone */}
            <div className="md:w-[90%] w-full ">
              <label htmlFor="phone" className="auth-label">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`auth-input ${
                  touched.phone && !phoneValidation.success && formData.phone
                    ? "border-destructive"
                    : touched.phone && phoneValidation.success && formData.phone
                      ? "border-green-500"
                      : ""
                }`}
                placeholder="+20110144044"
                maxLength={15}
              />
              <p className={`text-xs  h-5  mt-1 flex items-center`}>
                <span
                  className={`flex-1 ${
                    getFieldError("phone").includes("Valid")
                      ? "text-green-500"
                      : "text-destructive"
                  }`}
                >
                  {getFieldError("phone")}
                </span>

                {phoneIsExist && (
                  <span className="text-xs text-destructive inline-flex gap-2 items-center">
                    <span className="block text-[10px]">Your phone exist</span>
                    <InfoIcon size={15} />
                  </span>
                )}
              </p>
            </div>

            {/* Password */}
            <div className="md:w-[90%] w-full ">
              <label htmlFor="password" className="auth-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`auth-input ${
                  touched.password &&
                  !passwordValidation.success &&
                  formData.password
                    ? "border-destructive"
                    : touched.password &&
                        passwordValidation.success &&
                        formData.password
                      ? "border-green-500"
                      : ""
                }`}
                placeholder="********"
                autoComplete="new-password"
              />
              <ul className="text-xs mt-1 space-y-1 flex justify-start">
                <div className="flex-1">
                  <li
                    className={
                      formData.password.length >= 8
                        ? "text-green-500"
                        : "text-gray-400"
                    }
                  >
                    ✓ At least 8 characters
                  </li>
                  <li
                    className={
                      /[A-Z]/.test(formData.password)
                        ? "text-green-500"
                        : "text-gray-400"
                    }
                  >
                    ✓ Uppercase letter
                  </li>
                  <li
                    className={
                      /[a-z]/.test(formData.password)
                        ? "text-green-500"
                        : "text-gray-400"
                    }
                  >
                    ✓ Lowercase letter
                  </li>
                </div>

                <div className="flex-1">
                  <li
                    className={
                      /[0-9]/.test(formData.password)
                        ? "text-green-500"
                        : "text-gray-400"
                    }
                  >
                    ✓ Number
                  </li>
                  <li
                    className={
                      /[^A-Za-z0-9]/.test(formData.password)
                        ? "text-green-500"
                        : "text-gray-400"
                    }
                  >
                    ✓ Special character
                  </li>
                </div>
              </ul>
            </div>

            {/* Confirm Password */}
            <div className="md:w-[90%] w-full mt-1">
              <label htmlFor="confirmPassword" className="auth-label">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`auth-input ${
                  touched.confirmPassword &&
                  !passwordValidation.success &&
                  formData.confirmPassword
                    ? "border-destructive"
                    : touched.confirmPassword &&
                        passwordValidation.success &&
                        formData.confirmPassword
                      ? "border-green-500"
                      : ""
                }`}
                placeholder="********"
                autoComplete="new-password"
              />
              <p
                className={`h-5 text-xs mt-1 ${
                  getFieldError("confirmPassword").includes("Valid")
                    ? "text-green-500"
                    : "text-destructive"
                }`}
              >
                {getFieldError("confirmPassword")}
              </p>
            </div>

            {/* Terms */}
            <div className="flex items-start mb-1 mt-3">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                onChange={handleChange}
                className="m-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="terms"
                className="mr-2 text-sm text-gray-600 ml-2"
              >
                I agree to the{" "}
                <a href="#" className="text-accent-foreground hover:underline">
                  Terms and Conditions
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full md:w-[90%] text-sm bg-linear-to-t from-accent to-accent-foreground 
          text-white rounded-lg py-3 px-4 font-normal hover:bg-accent transition duration-300
          ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
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
                "Create Account"
              )}
            </button>

            <p className="text-sm text-center text-gray-600 mt-3">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-accent-foreground hover:underline font-medium"
              >
                Log In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
