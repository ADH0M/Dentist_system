"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import prisma from "../db/db-connection";

type SignupFormState = {
  message?: string;
  errors?: {
    username?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    general?: string;
  };
};

export async function registerAction(
  prevState: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Validation
  const errors: {
    username?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    general?: string;
  } = {};

  let hasErrors = false;

  if (!username || username.length < 2) {
    errors.username = ["Username must be at least 2 characters long."];
    hasErrors = true;
  }

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = ["Please enter a valid email address."];
    hasErrors = true;
  }

  if (!password || password.length < 6) {
    errors.password = ["Password must be at least 6 characters long."];
    hasErrors = true;
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = ["Passwords do not match."];
    hasErrors = true;
  }

  if (hasErrors) {
    return { message: "Validation failed.", errors };
  }

  try {
    const cookieStore = await cookies();
    const existingUser = await prisma.user.findUnique({where:{
        email
    }});

    console.log(existingUser);
    
    if (existingUser) {
      return {
        message: "User already exists.",
        errors: {
          general: "An account with this email or phone already exists.",
        },
      };
    }

    const user = await prisma.user.create({data:{email , username , password , }});
    console.log(user);

    cookieStore.set("user-id", user.id);
    cookieStore.set("user-email", user.email);
    cookieStore.set("user-name", user.username);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Signup error:", error);
    return {
      message: "Something went wrong.",
      errors: {
        general: "Failed to create account. Please try again later.",
      },
    };
  }

  redirect("/login");
}

export async function loginUpAction(
  prevState: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  // Validation
  const errors: {
    email?: string[];
    password?: string[];
    general?: string;
  } = {};

  let hasErrors = false;

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = ["Please enter a valid email address."];
    hasErrors = true;
  }

  if (!password || password.length < 6) {
    errors.password = ["Password must be at least 6 characters long."];
    hasErrors = true;
  }

  if (hasErrors) {
    return { message: "Validation failed.", errors };
  }

  try {
    const cookieStore = await cookies();

    const user = await prisma .user.findUnique({ where:{email} })
    if (!user) {
      return { errors: { general: "Invalid credentials" } };
    }

    const isMatch = password === user.password;
    if (!isMatch) {
      return { errors: { general: "Invalid credentials" } };
    }

    const expireDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
    const userSession = JSON.stringify({
      userId: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.type,
      expireSesion: expireDate.toISOString(),
    });

    const sessionToken = Buffer.from(userSession).toString("base64");
    cookieStore.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: expireDate,
      sameSite: "strict",
      path: "/",
    });

    cookieStore.set("userId", user?.id);
    cookieStore.set("email", user?.email);
    cookieStore.set("username", user?.username);
    cookieStore.set("role", user?.type);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Signup error:", error);
    return {
      message: "Something went wrong.",
      errors: {
        general: "Failed to create account. Please try again later.",
      },
    };
  }

  redirect("/");
};

// export async function logoutAction() {
//   try {
//     const cookieStore = await cookies();
//     cookieStore.delete("session");
//     cookieStore.delete("user-id");
//     cookieStore.delete("user-email");
//     cookieStore.delete("user-name");
//     cookieStore.delete("user-role");

//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     console.error("Signup error:", error);
//     return {
//       message: "Something went wrong.",
//       errors: {
//         general: "Failed to logout account. Please try again later.",
//       },
//     };
//   }

//   redirect("/");
// };
