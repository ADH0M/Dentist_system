// app/doctor/patients/[id]/components/PatientMedicalForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface PatientMedicalFormProps {
  visitId?: string;
  initialData: InitialData;
}

interface InitialData {
  diagnosis: string;
  proceduresDone: string;
  treatmentPlan: string;
  chiefComplaint: string;
}

export default function PatientMedicalForm({
  visitId,
  initialData,
}: PatientMedicalFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<InitialData>(initialData);

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!visitId) {
      toast.error("No active visit found for this patient");
      return;
    }

    setIsLoading(true);

    try {
      // Update the visit with medical data
      const response = await fetch(`/api/doctor/visits/${visitId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diagnosis: formData.diagnosis, //done2
          proceduresDone: formData.proceduresDone, //done3
          treatmentPlan: formData.treatmentPlan, //done4
          chiefComplaint: formData.chiefComplaint, //done1
        }),
      });

      if (!response.ok) throw new Error("Failed to update medical data");

      toast.success("Medical data updated successfully");
      router.refresh(); // Refresh the page to show updated data
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update medical data");
    } finally {
      setIsLoading(false);
    }
  };

  const cardData = [
    {
      label: "chiefComplaint",
      name: "Chief Complaint",
      placeholder: "Patient's main complaint...",
      rows: 3,
    },
    {
      label: "diagnosis",
      name: "Diagnosis",
      placeholder: "Medical diagnosis...",
      rows: 4,
    },
    {
      label: "proceduresDone",
      name: "Performed Procedures",
      placeholder: "Medical diagnosis...",
      rows: 4,
    },
    {
      label: "treatmentPlan",
      name: "Treatment Plan",
      placeholder: "Medical diagnosis...",
      rows: 4,
    },
  ];
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 flex justify-center flex-col gap-4 items-center w-full "
    >
      {/* Chief Complaint */}
      {cardData.map((card) => (
        <Card
          className="border-chart-1 border w-full sm:max-w-[85%] gap-1  m-0"
          key={card.label}
        >
          <CardHeader>
            <CardTitle className="text-muted-foreground  ">
              {card.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              name="chiefComplaint"
              placeholder={`${card.placeholder}`}
              value={formData[card.label as keyof InitialData]}
              onChange={(e) => handleFieldChange(card.label, e.target.value)}
              rows={card.rows}
            />
          </CardContent>
        </Card>
      ))}

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Next
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
