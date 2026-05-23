import {
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  DollarSign,
  Calendar,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const visitsData = [
  { month: "Jan", visits: 4 },
  { month: "Feb", visits: 6 },
  { month: "Mar", visits: 5 },
  { month: "Apr", visits: 8 },
  { month: "May", visits: 7 },
  { month: "Jun", visits: 9 },
];

const paymentsData = [
  { month: "Jan", amount: 2400 },
  { month: "Feb", amount: 3200 },
  { month: "Mar", amount: 2800 },
  { month: "Apr", amount: 3600 },
  { month: "May", amount: 3200 },
  { month: "Jun", amount: 4200 },
];

export function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Patient Profile Card */}
      <div className="bg-card rounded-radius p-6 shadow-shadow-sm">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-radius bg-linear-to-br from-primary to-primary/85 flex items-center justify-center text-primary-foreground text-3xl font-semibold">
            JD
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-semibold mb-1 text-card-foreground">
                  John Doe
                </h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Male • 42 years</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary/15 text-primary font-medium">
                    Active
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-card-foreground">
                  +1 (555) 123-4567
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-card-foreground">
                  john.doe@email.com
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-card-foreground">
                  123 Main St, City, State
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Medical Summary */}
      <div className="bg-card rounded-radius p-6 shadow-shadow-sm">
        <h3 className="font-semibold mb-4 text-card-foreground">
          Medical Summary
        </h3>

        <div className="space-y-4">
          <div>
            <div className="text-sm text-muted-foreground mb-2">
              Allergies
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-destructive/10 text-destructive rounded-full text-sm font-medium">
                Penicillin
              </span>
              <span className="px-3 py-1 bg-destructive/10 text-destructive rounded-full text-sm font-medium">
                Peanuts
              </span>
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-2">
              Current Medications
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                Lisinopril 10mg
              </span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                Metformin 500mg
              </span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                Atorvastatin 20mg
              </span>
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-2">
              Notes
            </div>
            <p className="text-sm text-card-foreground">
              Patient has a history of hypertension and type 2 diabetes. Regular
              monitoring required. Last checkup showed improved glucose levels.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-card rounded-radius p-6 shadow-shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Total Visits
            </span>
            <div className="w-10 h-10 rounded-radius bg-accent flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="font-semibold mb-1 text-card-foreground">
            39
          </div>
          <div className="flex items-center gap-1 text-sm text-primary">
            <TrendingUp className="w-4 h-4" />
            <span>+12% from last year</span>
          </div>
        </div>

        <div className="bg-card rounded-radius p-6 shadow-shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Total Invoices
            </span>
            <div className="w-10 h-10 rounded-radius bg-accent flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="font-semibold mb-1 text-card-foreground">
            $18,450
          </div>
          <div className="text-sm text-muted-foreground">
            Lifetime value
          </div>
        </div>

        <div className="bg-card rounded-radius p-6 shadow-shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Outstanding
            </span>
            <div className="w-10 h-10 rounded-radius bg-destructive/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-destructive" />
            </div>
          </div>
          <div className="font-semibold mb-1 text-card-foreground">
            $1,250
          </div>
          <div className="text-sm text-destructive">
            2 pending invoices
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold mb-4 text-card-foreground">
            Visits Over Time
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={visitsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="month"
                stroke="var(--muted-foreground)"
                fontSize={12}
              />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--popover)",
                  borderColor: "var(--border)",
                  color: "var(--popover-foreground)",
                  borderRadius: "var(--radius)",
                }}
              />
              <Line
                type="monotone"
                dataKey="visits"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={{ fill: "var(--primary)", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold mb-4 text-card-foreground">
            Payment Summary
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={paymentsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="month"
                stroke="var(--muted-foreground)"
                fontSize={12}
              />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--popover)",
                  borderColor: "var(--border)",
                  color: "var(--popover-foreground)",
                  borderRadius: "var(--radius)",
                }}
              />
              <Bar
                dataKey="amount"
                fill="var(--primary)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
