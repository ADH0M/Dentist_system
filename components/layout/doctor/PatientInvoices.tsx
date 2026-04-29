// app/doctor/patients/[id]/components/PatientInvoices.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Calendar, CreditCard, FileText } from 'lucide-react';

// تعريف الـ types
type PaymentStatus = 'pending' | 'paid' | 'partially_paid' | 'refunded' | 'cancelled' | 'insurance_pending';
type PaymentMethod = 'Cash' | 'Card' | 'Online' | 'Insurance' | 'Installment';

interface Invoice {
  id: string;
  invoiceNumber: string | null;
  totalAmount: number;
  paidAmount: number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod | null;
  notes: string | null;
  dueDate: string | null;
  createdAt: Date;
}

interface PatientInvoicesProps {
  invoices: Invoice[];
  totalInvoices: number;
}

export default function PatientInvoices({ invoices, totalInvoices }: PatientInvoicesProps) {
  const getStatusColor = (status: PaymentStatus): string => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'partially_paid':
        return 'bg-blue-100 text-blue-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'refunded':
        return 'bg-purple-100 text-purple-700';
      case 'insurance_pending':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: PaymentStatus): string => {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'pending':
        return 'Pending';
      case 'partially_paid':
        return 'Partially Paid';
      case 'cancelled':
        return 'Cancelled';
      case 'refunded':
        return 'Refunded';
      case 'insurance_pending':
        return 'Insurance Pending';
      default:
        return status;
    }
  };

  // حساب إجمالي المتبقي
  const totalBalance = invoices.reduce((sum, inv) => {
    if (inv.status !== 'cancelled' && inv.status !== 'refunded') {
      return sum + (inv.totalAmount - inv.paidAmount);
    }
    return sum;
  }, 0);

  // حساب إجمالي المدفوع
  const totalPaid = invoices.reduce((sum, inv) => {
    if (inv.status !== 'cancelled') {
      return sum + inv.paidAmount;
    }
    return sum;
  }, 0);

  // حساب إجمالي الفواتير
  const totalAmount = invoices.reduce((sum, inv) => {
    if (inv.status !== 'cancelled') {
      return sum + inv.totalAmount;
    }
    return sum;
  }, 0);

  if (!invoices || invoices.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-gray-500">
          <DollarSign className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No invoices found for this patient</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Total Invoices</p>
                <p className="text-2xl font-bold mt-1">{totalInvoices}</p>
              </div>
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-2xl font-bold mt-1">
                  ${totalAmount.toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Total Paid</p>
                <p className="text-2xl font-bold mt-1 text-green-600">
                  ${totalPaid.toFixed(2)}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Outstanding Balance</p>
                <p className="text-2xl font-bold mt-1 text-yellow-600">
                  ${totalBalance.toFixed(2)}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices List */}
      <div className="space-y-3">
        {invoices.map((invoice) => {
          const remaining = invoice.totalAmount - invoice.paidAmount;
          const isOverdue = invoice.dueDate && new Date(invoice.dueDate) < new Date() && invoice.status !== 'paid';
          
          return (
            <Card key={invoice.id}>
              <CardHeader>
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-lg">
                      {invoice.invoiceNumber || `INV-${invoice.id.slice(-6).toUpperCase()}`}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {new Date(invoice.createdAt).toLocaleDateString()}
                      </span>
                      {invoice.dueDate && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className={`text-sm ${isOverdue ? 'text-red-500' : 'text-gray-500'}`}>
                            Due: {new Date(invoice.dueDate).toLocaleDateString()}
                            {isOverdue && ' (Overdue)'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <Badge className={getStatusColor(invoice.status)}>
                    {getStatusText(invoice.status)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-semibold">${invoice.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Paid Amount:</span>
                    <span className="text-green-600">${invoice.paidAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Remaining:</span>
                    <span className={`font-semibold ${remaining > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                      ${remaining.toFixed(2)}
                    </span>
                  </div>
                  
                  {invoice.paymentMethod && (
                    <div className="flex justify-between py-2 border-t mt-2 pt-2">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="text-gray-700">{invoice.paymentMethod}</span>
                    </div>
                  )}
                  
                  {invoice.notes && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm text-gray-500">Notes:</p>
                      <p className="text-sm text-gray-600 mt-1">{invoice.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}