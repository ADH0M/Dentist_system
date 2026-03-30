import prisma from "@/lib/db/db-connection";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { deleteUser, updateUserRole } from "@/lib/actions/admin-action";
import Sidebar from "@/components/Aside";

const AdminDashboard = async () => {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;
  const currentUserId = cookieStore.get("userId")?.value;
  const username = cookieStore.get("username")?.value;
  const email = cookieStore.get("email")?.value;

  if (role !== "admin") {
    redirect("/user");
  }

  const currentUser = {
    id: currentUserId || "",
    username: username || "",
    email: email || "",
    role: role || "",
    isActive: true,
  };

  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive).length;
  const adminUsers = users.filter((u) => u.role === "admin").length;
  const customerUsers = users.filter((u) => u.role === "assistant").length;

  return (
    <div className="flex min-h-screen ">
      <Sidebar user={currentUser} />
      <div className="p-6 flex-1 mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-accent-foreground">
          Admin Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
            <h3 className="text-muted-foreground text-sm font-medium">
              Total Users
            </h3>
            <p className="text-3xl font-bold mt-2">{totalUsers}</p>
          </div>
          <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
            <h3 className="text-muted-foreground text-sm font-medium">
              Active Users
            </h3>
            <p className="text-3xl font-bold mt-2">{activeUsers}</p>
          </div>
          <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
            <h3 className="text-muted-foreground text-sm font-medium">
              Admins
            </h3>
            <p className="text-3xl font-bold mt-2 text-purple-600">
              {adminUsers}
            </p>
          </div>
          <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
            <h3 className="text-muted-foreground text-sm font-medium">
              Customers
            </h3>
            <p className="text-3xl font-bold mt-2 text-blue-600">
              {customerUsers}
            </p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold">User Management</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">Username</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium">{user.username}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      {user.id !== currentUserId && (
                        <>
                          <form
                            action={updateUserRole.bind(
                              null,
                              user.id,
                              user.role === "admin" ? "assistant" : "admin",
                            )}
                          >
                            <button
                              type="submit"
                              className="text-xs px-3 py-1 rounded border border-border hover:bg-accent hover:text-white transition-colors"
                            >
                              {user.role === "admin"
                                ? "Make Customer"
                                : "Make Admin"}
                            </button>
                          </form>
                          <form action={deleteUser.bind(null, user.id)}>
                            <button
                              type="submit"
                              className="text-xs px-3 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                            >
                              Delete
                            </button>
                          </form>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Patiant Table */}
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden mt-6">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold">Patiant Management</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">Username</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium">{user.username}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      {user.id !== currentUserId && (
                        <>
                          <form
                            action={updateUserRole.bind(
                              null,
                              user.id,
                              user.role === "admin" ? "assistant" : "admin",
                            )}
                          >
                            <button
                              type="submit"
                              className="text-xs px-3 py-1 rounded border border-border hover:bg-accent hover:text-white transition-colors"
                            >
                              {user.role === "admin"
                                ? "Make Customer"
                                : "Make Admin"}
                            </button>
                          </form>
                          <form action={deleteUser.bind(null, user.id)}>
                            <button
                              type="submit"
                              className="text-xs px-3 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                            >
                              Delete
                            </button>
                          </form>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
