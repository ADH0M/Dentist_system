"use client";
import { UserType } from "@/generated/prisma";
import GenericAdminTable, { Action, Column } from "./UserTabel";
import { deleteUser } from "@/lib/actions/admin-action";

type Users = {
  isActive: boolean;
  username: string;
  id: string;
  email: string;
  role: UserType;
}[];

const StafTable = ({ users }: { users: Users }) => {
  const stafActions: Action[] = [
    {
      label: "Delete",
      actionFn: deleteUser,
      className:"text-xs px-3 py-1 rounded border border-border hover:bg-red-500/40 cursor-pointer hover:text-white transition-colors "
    },
    {
      label: "Edite",
      actionFn: deleteUser,
    },
  ];

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
      } else if (u === "username") {
        return {
          key: u,
          label: u,
          render: (value: (typeof users)[number][typeof u]) => {
            if (typeof value === "string") {
              return value.trim();
            }
          },
          srotable: true,
        };
      } else {
        return {
          key: u,
          label: u,
          render: (value: (typeof users)[number][typeof u]) => {
            if (typeof value === "string") {
              return value.trim();
            }
            return value;
          },
        };
      }
    },
  ) as Column<(typeof users)[number]>[];

  console.log(users, staf);

  return (
    <GenericAdminTable
      title="Staf"
      columns={staf}
      data={users}
      actions={stafActions}
    />
  );
};

export default StafTable;
