"use client"

type PatientQuickStatsProps = {
  stats: {
    totalVisits: number
    upcomingAppointments: number
    outstandingInvoices: number
    totalPaid: number
  }
}

function QuickStatCard({
  title,
  value,
}: {
  title: string
  value: string | number
}) {
  return (
    <div className="bg-card border border-border rounded-lg shadow-sm p-4 flex flex-col gap-2">

      <p className="text-sm text-muted-foreground">
        {title}
      </p>

      <h3 className="text-2xl font-semibold text-foreground">
        {value}
      </h3>

    </div>
  )
}

export function PatientQuickStats({ stats }: PatientQuickStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

      <QuickStatCard
        title="Total Visits"
        value={stats.totalVisits}
      />

      <QuickStatCard
        title="Upcoming Appointments"
        value={stats.upcomingAppointments}
      />

      <QuickStatCard
        title="Outstanding Invoices"
        value={stats.outstandingInvoices}
      />

      <QuickStatCard
        title="Total Paid"
        value={`$${stats.totalPaid}`}
      />

    </div>
  )
}