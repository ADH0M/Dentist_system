import { Search, Bell } from "lucide-react";

export default function PatientTopbar({
  username,
  type,
  id
}: {
  username: string | undefined;
  type: string | undefined;
  id?:string |undefined
}) {
  return (
    <header className="h-16 bg-background border-b border-sidebar-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
          <input
            type="text"
            placeholder="Search patients, appointments..."
            className="w-full pl-10 pr-4 py-2 bg-background rounded-lg border border-sidebar-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-background rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-chart-5 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="font-medium">{username || "__"}</div>
            <div className="text-sm text-muted-foreground">{type || "__"}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
