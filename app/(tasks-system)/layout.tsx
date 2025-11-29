import UserSidebar from "@/components/ui/User-Sidebar";
import { cookies } from "next/headers";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;
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

  return (
    <div className="min-h-screen bg-background text-secondary">
      <main className="flex h-full w-full">
        
        <aside className="sticky left-0 bottom-0 top-0 h-screen z-50">
          <UserSidebar user={currentUser} />
        </aside>

        <section className="flex-1 overflow-y-auto min-h-screen z-40">
          {children}
        </section>

      </main>
    </div>
  );
};

export default layout;
