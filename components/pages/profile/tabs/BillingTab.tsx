import { DollarSign, Download, Filter } from 'lucide-react';

interface Invoice {
  id: string;
  number: string;
  date: string;
  totalAmount: number;
  paidAmount: number;
  status: 'paid' | 'pending' | 'overdue';
  items: string;
}

const invoices: Invoice[] = [
  {
    id: '1',
    number: 'INV-2026-041',
    date: 'April 15, 2026',
    totalAmount: 350,
    paidAmount: 350,
    status: 'paid',
    items: 'General Consultation, Blood Pressure Monitoring',
  },
  {
    id: '2',
    number: 'INV-2026-032',
    date: 'March 8, 2026',
    totalAmount: 480,
    paidAmount: 480,
    status: 'paid',
    items: 'Blood Tests, HbA1c Test, Consultation',
  },
  {
    id: '3',
    number: 'INV-2026-019',
    date: 'January 20, 2026',
    totalAmount: 650,
    paidAmount: 0,
    status: 'pending',
    items: 'Annual Physical, Blood Panel, EKG',
  },
  {
    id: '4',
    number: 'INV-2025-124',
    date: 'December 5, 2025',
    totalAmount: 600,
    paidAmount: 0,
    status: 'overdue',
    items: 'EKG, Chest X-Ray, Consultation',
  },
  {
    id: '5',
    number: 'INV-2025-098',
    date: 'October 12, 2025',
    totalAmount: 420,
    paidAmount: 420,
    status: 'paid',
    items: 'Follow-up Consultation, Prescription Renewal',
  },
];

const statusConfig = {
  paid: {
    label: 'Paid',
    bg: 'bg-green-50',
    text: 'text-green-700',
    badge: 'bg-green-500',
  },
  pending: {
    label: 'Pending',
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    badge: 'bg-yellow-500',
  },
  overdue: {
    label: 'Overdue',
    bg: 'bg-red-50',
    text: 'text-[oklch(0.6861_0.2061_14.9941',
    badge: 'bg-[oklch(0.6861_0.2061_14.9941',
  },
};

export function BillingTab() {
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const totalUnpaid = invoices.reduce((sum, inv) => sum + (inv.totalAmount - inv.paidAmount), 0);
  const totalInvoices = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const paidPercentage = (totalRevenue / totalInvoices) * 100;

  return (
<div className="space-y-6">
  {/* Summary Cards */}
  <div className="grid grid-cols-3 gap-6">
    <div className="bg-card rounded-radius p-6 shadow-shadow-sm border border-border">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">Total Revenue</span>
        <div className="w-10 h-10 rounded-radius bg-primary/10 flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-primary" />
        </div>
      </div>
      <div className="font-semibold mb-1 text-card-foreground">${totalRevenue.toLocaleString()}</div>
      <div className="text-sm text-primary">From {invoices.filter(i => i.status === 'paid').length} paid invoices</div>
    </div>

    <div className="bg-card rounded-radius p-6 shadow-shadow-sm border border-border">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">Unpaid Amount</span>
        <div className="w-10 h-10 rounded-radius bg-destructive/10 flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-destructive" />
        </div>
      </div>
      <div className="font-semibold mb-1 text-card-foreground">${totalUnpaid.toLocaleString()}</div>
      <div className="text-sm text-destructive">{invoices.filter(i => i.status !== 'paid').length} pending invoices</div>
    </div>

    <div className="bg-card rounded-radius p-6 shadow-shadow-sm border border-border">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">Payment Rate</span>
        <div className="w-10 h-10 rounded-radius bg-accent flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-primary" />
        </div>
      </div>
      <div className="font-semibold mb-2 text-card-foreground">{paidPercentage.toFixed(0)}%</div>
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all"
          style={{ width: `${paidPercentage}%` }}
        ></div>
      </div>
    </div>
  </div>

  {/* Invoices Table */}
  <div className="bg-card rounded-radius shadow-shadow-sm overflow-hidden border border-border">
    <div className="p-6 border-b border-border flex items-center justify-between">
      <h3 className="font-semibold text-card-foreground">Invoices</h3>
      <div className="flex items-center gap-2">
        <button className="px-4 py-2 border border-border rounded-radius text-sm font-medium text-card-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Invoice #</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Items</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Total</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Paid</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {invoices.map((invoice) => {
            const config = statusConfig[invoice.status];
            return (
              <tr key={invoice.id} className="hover:bg-accent hover:text-accent-foreground transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-card-foreground">{invoice.number}</td>
                <td className="px-6 py-4 text-sm text-card-foreground">{invoice.date}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">
                  {invoice.items}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-card-foreground">${invoice.totalAmount}</td>
                <td className="px-6 py-4 text-sm text-card-foreground">${invoice.paidAmount}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
                    {config.label}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="p-2 hover:bg-muted rounded-radius transition-colors">
                    <Download className="w-4 h-4 text-muted-foreground" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
</div>
  );
}
