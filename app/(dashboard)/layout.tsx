import React from "react";
import Sidebar from "@/components/Aside";
import { cookies } from "next/headers";
import { UserType } from "@/generated/prisma";
import { redirect } from "next/navigation";
import PatientDetailsModal from "@/components/layout/doctor/PatientDetailsModal";

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

  // if (role === "patient" && role) {
  //   redirect("/patient");
  // }

  if (
    role !== "admin" &&
    role !== "assistant" &&
    role !== "receptionist" &&
    role !== "patient"
  ) {
    redirect("/");
  }

  return (
    <div className="flex h-full overflow-hidden ">
      <Sidebar user={currentUser} />
      <main className="flex-1 overflow-x-hidden overflow-y-scroll">
        {children}
      </main>
    </div>
  );
};

export default layout;
