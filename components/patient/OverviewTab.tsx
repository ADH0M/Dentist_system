

export function OverviewTab() {
  return (
    <div className="grid gap-4 md:grid-cols-2">

      <div className="bg-card border border-border rounded-lg p-4">
        Recent Visits
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        Upcoming Appointments
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        Recent Invoices
      </div>

    </div>
  )
}