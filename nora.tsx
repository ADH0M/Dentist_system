"use client";
import { useState } from "react";
import { createUser } from "@/lib/actions/users";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel } from "@/components/ui/field";
import {  CldUploadWidget } from "next-cloudinary";

type UserType = "customer" | "admin";

interface User {
  id: string;
  username: string;
  email: string;
  phone: string | null;
  isActive: boolean;
  type: UserType;
  photo: string | null;
}

const emptyUser: Omit<User, "id" | "photo"> = {
  username: "",
  email: "",
  phone: "",
  isActive: false,
  type: "customer",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState(emptyUser);
  const [submitting, setSubmitting] = useState(false);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData();
    formData.append("username", newUser.username);
    formData.append("email", newUser.email);
    formData.append("password", "default123");
    if (newUser.phone) formData.append("phone", newUser.phone);
    formData.append("type", newUser.type);

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
  const [url, setUrl] = useState("");

  return (
    <div className="main-bg p-4 md:p-8 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-6">
          Manage Users
        </h1>

        <div className="bg-card rounded-xl p-6 border border-border mb-8">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">
            Add New Patiant
          </h2>
          <form
            onSubmit={handleCreateUser}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
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
                value={newUser.type}
                onChange={(e) =>
                  setNewUser({ ...newUser, type: e.target.value as UserType })
                }
                className="auth-input"
              >
                <option value="customer">New Case / Consultation </option>
                <option value="admin">Follow-up</option>
              </select>
            </div>

            <TextareaDemo message="Diagnosis" />
            <TextareaDemo message="Performed Procedures" />
            <TextareaDemo message="Treatment Provided" />

            <div className="md:col-span-2">
              <input type="file" hidden />

              <button type="submit" disabled={submitting} className="">
                Add image
              </button>

              <div>
                <p>patiant Radiology </p>
                <p>images</p>
              </div>
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
      </div>

      <div>
        <CldUploadWidget
          uploadPreset="dentist_dr_taha"
          onSuccess={(result) => {
            console.log(result.info);
            
          }}
        >
          {({ open }) => <button onClick={() => open()}>Upload</button>}
        </CldUploadWidget>

        {url && <img src={url} width="200" />}
      </div>
    </div>
  );
}

export const Input = ({
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

export function TextareaDemo({
  message,
  description,
}: {
  message: string;
  description?: string;
}) {
  return (
    <Field>
      <FieldLabel
        htmlFor={message}
        className=" text-[12px]  font-medium text-foreground mb-1"
      >
        {message}
      </FieldLabel>
      <Textarea
        id={message}
        placeholder={description ? description : "your text"}
        className="auth-input "
      />
    </Field>
  );
}
💡 لو حابب، أقدر كمان أحول الكود إلى RadiologyImages Component احترافي reusable يستخدم في أي مكان في المشروع، ويكون نفس اللي في Dental Clinic Management Systems الكبيرة.