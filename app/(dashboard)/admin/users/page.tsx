/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createUser, deleteUser, toggleUserActive, updateUserType } from "@/lib/actions/users";
import { UserType } from "@/generated/prisma";

interface User {
  id: string;
  username: string;
  email: string;
  phone: string | null;
  isActive: boolean;
  role:UserType ;
  photo: string | null;
}

const emptyUser: Omit<User, "id" | "photo"> = {
  username: "",
  email: "",
  phone: "",
  isActive: false,
  role: "assistant",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState(emptyUser);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users"); 
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData();
    formData.append("username", newUser.username);
    formData.append("email", newUser.email);
    formData.append("password", "default123"); 
    if (newUser.phone) formData.append("phone", newUser.phone);
    formData.append("type", newUser.role);

    try {
      await createUser(formData);
      setNewUser(emptyUser);
      const res = await fetch("/api/admin/users");
      setUsers(await res.json());
    } catch (error) {
      alert("Failed to create user");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("isActive", String(isActive));
    await toggleUserActive(formData);
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isActive: !isActive } : u))
    );
  };

  const handleUpdateType = async (userId: string, type: UserType) => {
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("type", type);
    await updateUserType(formData);
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, type } : u))
    );
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const formData = new FormData();
    formData.append("userId", userId);
    await deleteUser(formData);
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  if (loading) return <div className="main-bg p-8">Loading...</div>;

  return (
    <div className="main-bg p-4 md:p-8 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-6">Manage Users</h1>

      
        <div className="bg-card rounded-xl p-6 border border-border mb-8">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Add New User</h2>
          <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Username"
              value={newUser.username}
              onChange={(v) => setNewUser({ ...newUser, username: v })}
              required
            />
            <Input
              label="Email"
              type="email"
              value={newUser.email}
              onChange={(v) => setNewUser({ ...newUser, email: v })}
              required
            />
            <Input
              label="Phone (optional)"
              value={newUser.phone || ""}
              onChange={(v) => setNewUser({ ...newUser, phone: v || null })}
            />
            <div>
              <label className="auth-label">Type</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserType })}
                className="auth-input"
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {submitting ? "Creating..." : "Add User"}
              </button>
            </div>
          </form>
        </div>

   
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-muted-foreground">User</th>
                <th className="text-left p-3 text-muted-foreground">Email</th>
                <th className="text-left p-3 text-muted-foreground">Phone</th>
                <th className="text-left p-3 text-muted-foreground">Status</th>
                <th className="text-left p-3 text-muted-foreground">Type</th>
                <th className="text-left p-3 text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-muted/30">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {user.photo ? (
                        <Image src={user.photo} alt={user.username} width={32} height={32} className="rounded-full" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-foreground">{user.username}</span>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">{user.email}</td>
                  <td className="p-3 text-muted-foreground">{user.phone || "—"} </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleToggleActive(user.id, user.isActive)}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="p-3">
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateType(user.id, e.target.value as UserType)}
                      className="text-xs bg-transparent border border-border rounded px-2 py-1"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-destructive hover:text-destructive/80 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const Input = ({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string | null;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) => (
  <div>
    <label className="auth-label">{label}</label>
    <input
      type={type}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="auth-input"
      required={required}
    />
  </div>
);