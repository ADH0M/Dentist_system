import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

const UserDashboard = async () => {
  const cookieStore = await cookies();
  const username = cookieStore.get("username")?.value;
  const email = cookieStore.get("email")?.value;
  const role = cookieStore.get("role")?.value;

  if (!username) {
    redirect("/login");
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-accent-foreground">Welcome back, {username}!</h1>
        <p className="text-muted-foreground mt-2">Manage your notes and account settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Username</span>
              <span className="font-medium">{username}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Account Type</span>
              <span className="capitalize font-medium">{role}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-4">
            <Link 
              href="/notes" 
              className="flex items-center justify-between p-4 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent text-white rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
                <div>
                  <h3 className="font-medium text-accent-foreground">My Notes</h3>
                  <p className="text-sm text-muted-foreground">Access your personal Kanban board</p>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground group-hover:translate-x-1 transition-transform"><path d="m9 18 6-6-6-6"/></svg>
            </Link>

            <Link 
              href="/add-task" 
              className="flex items-center justify-between p-4 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent text-white rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </div>
                <div>
                  <h3 className="font-medium text-accent-foreground">New Task</h3>
                  <p className="text-sm text-muted-foreground">Create a new task quickly</p>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground group-hover:translate-x-1 transition-transform"><path d="m9 18 6-6-6-6"/></svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;