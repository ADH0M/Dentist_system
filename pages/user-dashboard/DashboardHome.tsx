"use client";

import NewProjectBtn from "@/components/layout/NewProjectBtn";
import { useSelectorHook } from "@/hooks/useSelector";
import Link from "next/link";
import { FiFolder, FiList, FiUser } from "react-icons/fi";

type CardProps = {
  title: string;
  desc?: string;
  value?: string | number;
  icon?: React.ReactNode;
  color?: string;
  status?: string;
  tasks?: number;
  type?: "projectType" | "stat" | "recentProject";
};

function DashboardCard({
  title,
  desc,
  value,
  icon,
  color,
  status,
  tasks,
  type,
}: CardProps) {
  const statusColor =
    status === "In Progress"
      ? "text-primary"
      : status === "Planning"
      ? "text-secondary"
      : "text-muted-foreground";

  return (
    <div
      className={`p-5 rounded-lg border border-border bg-card text-card-foreground shadow-sm cursor-pointer transition-colors duration-200 ${
        type === "projectType"
          ? "group hover:bg-accent hover:text-accent-foreground"
          : ""
      }`}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">{title}</h3>
        {icon && (
          <span
            className="flex items-center justify-center w-6 h-6 rounded"
            style={{
              backgroundColor: color ? `var(--color-${color}15)` : undefined,
              color: color ? `var(--color-${color})` : undefined,
            }}
          >
            {icon}
          </span>
        )}
      </div>
      {desc && (
        <p className="mt-2 text-sm text-muted-foreground group-hover:text-accent-foreground">
          {desc}
        </p>
      )}
      {value && <p className="text-3xl font-bold mt-3">{value}</p>}
      {status && tasks !== undefined && (
        <p className="mt-2 text-sm text-muted-foreground">
          Status: <span className={statusColor}>{status}</span> • {tasks} tasks
        </p>
      )}
    </div>
  );
}

export default function DashboardHome() {
  const projectTypes = [
    {
      title: "Software Development",
      desc: "Web apps, mobile apps, backend systems.",
    },
    {
      title: "Marketing Campaign",
      desc: "Social media, ads, branding campaigns.",
    },
    { title: "Content Creation", desc: "Blogs, videos, courses, articles." },
    {
      title: "Research / Notes",
      desc: "Research notes, meeting notes, documents.",
    },
  ];

  const stats = [
    {
      title: "Total Projects",
      value: "6",
      icon: <FiFolder />,
      color: "primary",
    },
    { title: "Tasks", value: "42", icon: <FiList />, color: "chart-2" },
    { title: "Meeting Notes", value: "14", icon: <FiUser />, color: "chart-3" },
  ];

  const recentProjects = [
    { title: "Simple Note App", status: "In Progress", tasks: 12 },
    { title: "Marketing Website", status: "Planning", tasks: 3 },
  ];
  const { data } = useSelectorHook((state) => state.authReducer);
  const projects = useSelectorHook((state) => state.projectReducer);
  let order = 1000;
  if (projects.data && projects.data.length) {
    order = Number(projects.data[projects.data?.length - 1].order);
  }
  return (
    <div className="px-6 md:py-6 space-y-8 max-w-7xl mx-auto font-sans text-foreground bg-background">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between">
        <h1 className="text-3xl font-bold">Welcome back 👋</h1>
        <NewProjectBtn
          userId={data?.id}
          order={order}
          className="mt-4 md:mt-0 font-medium  text-secondary border border-primary shadow-sm hover:brightness-105
         transition "
        />
      </div>

      {/* Project Types */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Project Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {projectTypes.map((item, i) => (
            <DashboardCard
              key={i}
              title={item.title}
              desc={item.desc}
              type="projectType"
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Your Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {stats.map((stat, i) => (
            <DashboardCard
              key={i}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              type="stat"
            />
          ))}
        </div>
      </section>

      {/* Recent Projects */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {recentProjects.map((proj, i) => (
            <DashboardCard
              key={i}
              title={proj.title}
              status={proj.status}
              tasks={proj.tasks}
              type="recentProject"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
