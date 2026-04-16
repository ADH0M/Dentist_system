import React from "react";
import Sidebar from "@/components/Aside";
import { cookies } from "next/headers";
import { UserType } from "@/generated/prisma";
import { redirect } from "next/navigation";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value as UserType;
  const currentUserId = cookieStore.get("userId")?.value;
  const username = cookieStore.get("username")?.value;
  const email = cookieStore.get("email")?.value;
  const currentUser = {
    id: currentUserId || "",
    username: username || "",
    email: email || "",
    role: role || "",
    isActive: true,
  };

  if (role === "patient" && role) {
    redirect("/patient");
  }

  if (role !== "admin" && role != "assistant") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen ">
      {role === "admin" && <Sidebar user={currentUser} />}
      <div className="flex-1 overflow-x-hidden overflow-y-scroll">
        {children}
      </div>
    </div>
  );
};

export default layout;
