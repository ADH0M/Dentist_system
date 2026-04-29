/* eslint-disable @typescript-eslint/no-explicit-any */
// app/doctor/patients/[id]/components/PatientVisitsHistory.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, FileText, Activity, Stethoscope } from 'lucide-react';

// تعريف الـ types
interface ToothChartData {
  status?: string;
  surfaces?: string[];
  [key: string]: any;
}

interface Visit {
  id: string;
  visitDate: Date;
  type: string;
  chiefComplaint: string | null;
  diagnosis: string | null;
  treatmentPlan: string | null;
  proceduresDone: string | null;
  toothChart: any; // JSON from Prisma
  createdBy: {
    username: string;
  } | null;
}

interface PatientVisitsHistoryProps {
  visits: Visit[];
}

export default function PatientVisitsHistory({ visits }: PatientVisitsHistoryProps) {
  if (!visits || visits.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-gray-500">
          <Activity className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No visit history found for this patient</p>
        </CardContent>
      </Card>
    );
  }

  // Helper function to render tooth chart
  const renderToothChart = (toothChart: any) => {
    if (!toothChart || typeof toothChart !== 'object') return null;
    
    const entries = Object.entries(toothChart);
    if (entries.length === 0) return null;
    
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Activity className="h-4 w-4" />
          Tooth Chart
        </div>
        <div className="pl-6 flex flex-wrap gap-2">
          {entries.map(([tooth, data]: [string, any]) => (
            <Badge key={tooth} variant="secondary" className="text-xs">
              Tooth {tooth}: {typeof data === 'string' ? data : data?.status || 'Checked'}
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {visits.map((visit) => (
        <Card key={visit.id} className="overflow-hidden">
          <CardHeader className="bg-gray-50 border-b">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  {new Date(visit.visitDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </CardTitle>
                <div className="flex gap-2 mt-2">
                  <Badge variant="default">{visit.type}</Badge>
                  {visit.createdBy && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Dr. {visit.createdBy.username}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6 space-y-4">
            {/* Chief Complaint */}
            {visit.chiefComplaint && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Stethoscope className="h-4 w-4" />
                  Chief Complaint
                </div>
                <p className="text-gray-600 pl-6 whitespace-pre-wrap">{visit.chiefComplaint}</p>
              </div>
            )}

            {/* Diagnosis */}
            {visit.diagnosis && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FileText className="h-4 w-4" />
                  Diagnosis
                </div>
                <p className="text-gray-600 pl-6 whitespace-pre-wrap">{visit.diagnosis}</p>
              </div>
            )}

            {/* Procedures Done */}
            {visit.proceduresDone && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Activity className="h-4 w-4" />
                  Procedures Performed
                </div>
                <p className="text-gray-600 pl-6 whitespace-pre-wrap">{visit.proceduresDone}</p>
              </div>
            )}

            {/* Treatment Plan */}
            {visit.treatmentPlan && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Calendar className="h-4 w-4" />
                  Treatment Plan
                </div>
                <p className="text-gray-600 pl-6 whitespace-pre-wrap">{visit.treatmentPlan}</p>
              </div>
            )}

            {/* Tooth Chart */}
            {renderToothChart(visit.toothChart)}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}