import prisma from "@/lib/db/db-connection";
import { cookies } from "next/headers";
import { UserType } from "@/generated/prisma";
import GenericAdminTable, { Action } from "@/components/layout/admin/UserTabel";
import { Columns } from "@/components/layout/admin/GenericTable";
import { deletePatient } from "@/lib/actions/patientActions";
import StafTable from "@/components/layout/admin/StafTable";

const AdminDashboard = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  const patients = await prisma.patient.findMany({
    select: { name: true, phone: true, gender: true, id: true },
  });

  type PatientType = (typeof patients)[number];

  const pationtActions: Action[] = [
    {
      label: "delete",
      actionFn: deletePatient,
      className:
        "text-xs px-3 py-1 rounded border border-border hover:bg-red-500/40 cursor-pointer hover:text-white transition-colors ",
    },
  ];

  const patientUsers = patients.length;
  const receptionist = users.filter((u) => u.role === "receptionist");
  const assistant = users.filter((u) => u.role === "assistant");
  const totalUsers = users.length + patientUsers;

  const staf = (Object.keys(users[0]) as (keyof (typeof users)[number])[]).map(
    (u) => {
      if (u === "isActive") {
        return {
          key: u,
          label: u,
          render: (value: (typeof users)[number][typeof u]) => {
            if (typeof value === "boolean") {
              return value ? "active" : "non";
            }
          },
        };
      } else {
        return {
          key: u,
          label: u,
          render: (value: (typeof users)[number][typeof u]) => {
            if (typeof value === "string") {
              return value.toUpperCase();
            }
            return value;
          },
        };
      }
    },
  ) as Columns<(typeof users)[number]>[];

  //add srotable , render ,aviod id
  const patientColumns = patients.length
    ? (Object.keys(patients[0]) as (keyof (typeof patients)[number])[]).map(
        (pro) => {
          if (pro === "name") {
            return {
              key: pro,
              label: pro,
              sortable: true,
            };
          } else {
            return {
              key: pro,
              label: pro,
            };
          }
        },
      )
    : [];

  return (
    <div className="p-6 flex-1 mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-accent-foreground">
        Admin Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-4 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <h3 className="text-muted-foreground text-sm font-medium">
            Total Users
          </h3>
          <p className="text-3xl font-bold mt-2">{totalUsers}</p>
        </div>
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <h3 className="text-muted-foreground text-sm font-medium">
            Patients
          </h3>
          <p className="text-3xl font-bold mt-2">{patientUsers}</p>
        </div>
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <h3 className="text-muted-foreground text-sm font-medium">
            Receptionist
          </h3>
          <p className="text-3xl font-bold mt-2 text-purple-600">
            {receptionist.length}
          </p>
        </div>
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <h3 className="text-muted-foreground text-sm font-medium">
            assistant
          </h3>
          <p className="text-3xl font-bold mt-2 text-blue-600">
            {assistant.length}
          </p>
        </div>
      </div>

      {/* staf Table */}
      <StafTable users={users} />
      {/* Patiant Table */}

      {patients.length >= 0 && (
        <GenericAdminTable
          title="Patients"
          columns={patientColumns}
          data={patients}
          actions={pationtActions}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
