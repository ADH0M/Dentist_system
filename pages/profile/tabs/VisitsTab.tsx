import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface Visit {
  id: string;
  date: string;
  type: "Initial" | "Follow-up";
  complaint: string;
  diagnosis: string;
  treatment: string;
  procedures: string[];
}

const visits: Visit[] = [
  {
    id: "1",
    date: "April 15, 2026",
    type: "Follow-up",
    complaint: "Follow-up for hypertension management",
    diagnosis: "Hypertension, well-controlled",
    treatment:
      "Continue current medication regimen. Lifestyle modifications discussed.",
    procedures: ["Blood Pressure Monitoring", "General Consultation"],
  },
  {
    id: "2",
    date: "March 8, 2026",
    type: "Follow-up",
    complaint: "Routine diabetes check",
    diagnosis: "Type 2 Diabetes Mellitus",
    treatment: "HbA1c levels improved. Adjusted Metformin dosage.",
    procedures: ["Blood Glucose Test", "HbA1c Test", "General Consultation"],
  },
  {
    id: "3",
    date: "January 20, 2026",
    type: "Initial",
    complaint: "Annual physical examination",
    diagnosis: "General health assessment",
    treatment: "All vitals within normal range. Continue preventive care.",
    procedures: ["Physical Examination", "Blood Panel", "EKG"],
  },
  {
    id: "4",
    date: "December 5, 2025",
    type: "Follow-up",
    complaint: "Chest discomfort and shortness of breath",
    diagnosis: "Angina pectoris",
    treatment: "Started on Atorvastatin. Scheduled for stress test.",
    procedures: ["EKG", "Chest X-Ray", "General Consultation"],
  },
];

export function VisitsTab() {
  const [expandedVisit, setExpandedVisit] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {visits.map((visit) => {
        const isExpanded = expandedVisit === visit.id;

        return (
          <div
            key={visit.id}
            className="bg-card rounded-radius shadow-shadow-sm overflow-hidden border border-border"
          >
            <div
              className="p-6 cursor-pointer hover:bg-accent transition-colors"
              onClick={() => setExpandedVisit(isExpanded ? null : visit.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-card-foreground">
                      {visit.date}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-sm font-medium ${
                        visit.type === "Initial"
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary/15 text-secondary"
                      }`}
                    >
                      {visit.type}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm">
                      <span className="text-muted-foreground">
                        Chief Complaint:
                      </span>{" "}
                      <span className="text-card-foreground">
                        {visit.complaint}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">
                        Diagnosis:
                      </span>{" "}
                      <span className="text-card-foreground">
                        {visit.diagnosis}
                      </span>
                    </div>
                  </div>
                </div>

                <button className="ml-4 p-1 hover:bg-muted rounded-radius transition-colors">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            {isExpanded && (
              <div className="px-6 pb-6 border-t border-border pt-4 space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">
                    Treatment Plan
                  </div>
                  <p className="text-sm text-card-foreground">
                    {visit.treatment}
                  </p>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">
                    Procedures
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {visit.procedures.map((procedure, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full"
                      >
                        {procedure}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
