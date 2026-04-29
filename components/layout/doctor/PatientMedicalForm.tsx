// app/doctor/patients/[id]/components/PatientMedicalForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Plus, X } from "lucide-react";

interface PatientMedicalFormProps {
  patientId: string;
  visitId?: string;
  initialData: {
    diagnosis: string;
    proceduresDone: string;
    treatmentPlan: string;
    chiefComplaint: string;
    allergies: string[];
    medications: string[];
    notes: string | null;
  };
}

export default function PatientMedicalForm({
  patientId,
  visitId,
  initialData,
}: PatientMedicalFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialData);

  // For adding new allergies/medications
  const [newAllergy, setNewAllergy] = useState("");
  const [newMedication, setNewMedication] = useState("");

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddAllergy = () => {
    if (newAllergy.trim() && !formData.allergies.includes(newAllergy.trim())) {
      setFormData((prev) => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()],
      }));
      setNewAllergy("");
    }
  };

  const handleRemoveAllergy = (allergy: string) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((a) => a !== allergy),
    }));
  };

  const handleAddMedication = () => {
    if (
      newMedication.trim() &&
      !formData.medications.includes(newMedication.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        medications: [...prev.medications, newMedication.trim()],
      }));
      setNewMedication("");
    }
  };

  const handleRemoveMedication = (medication: string) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.filter((m) => m !== medication),
    }));
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
          diagnosis: formData.diagnosis,
          proceduresDone: formData.proceduresDone,
          treatmentPlan: formData.treatmentPlan,
          chiefComplaint: formData.chiefComplaint,
        }),
      });

      if (!response.ok) throw new Error("Failed to update medical data");

      // Update patient's medical history
      await fetch(`/api/doctor/patients/${patientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          allergies: formData.allergies,
          medications: formData.medications,
          notes: formData.notes,
        }),
      });

      toast.success("Medical data updated successfully");
      router.refresh(); // Refresh the page to show updated data
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update medical data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Chief Complaint */}
      <Card className="border-chart-1 border ">
        <CardHeader>
          <CardTitle>Chief Complaint</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Patient's main complaint..."
            value={formData.chiefComplaint}
            onChange={(e) =>
              handleFieldChange("chiefComplaint", e.target.value)
            }
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Diagnosis */}
      <Card className="border-chart-1 border">
        <CardHeader>
          <CardTitle>Diagnosis</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Medical diagnosis..."
            value={formData.diagnosis}
            onChange={(e) => handleFieldChange("diagnosis", e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Procedures Done */}
      <Card className="border-chart-1 border">
        <CardHeader>
          <CardTitle>Performed Procedures</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="List all procedures performed..."
            value={formData.proceduresDone}
            onChange={(e) =>
              handleFieldChange("proceduresDone", e.target.value)
            }
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Treatment Plan */}
      <Card className="border-chart-1 border">
        <CardHeader>
          <CardTitle>Treatment Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Proposed treatment plan..."
            value={formData.treatmentPlan}
            onChange={(e) => handleFieldChange("treatmentPlan", e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Allergies */}
      <Card className="border-chart-1 border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-2 w-2 bg-red-500 rounded-full" />
            Allergies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {formData.allergies.map((allergy) => (
              <Badge key={allergy} variant="destructive" className="gap-1">
                {allergy}
                <button
                  type="button"
                  onClick={() => handleRemoveAllergy(allergy)}
                  className="ml-1 hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Add allergy..."
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleAddAllergy())
              }
            />
            <Button type="button" variant="outline" onClick={handleAddAllergy}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Medications */}
      <Card className="border-chart-1 border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-2 w-2 bg-blue-500 rounded-full" />
            Current Medications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {formData.medications.map((medication) => (
              <Badge key={medication} variant="secondary" className="gap-1">
                {medication}
                <button
                  type="button"
                  onClick={() => handleRemoveMedication(medication)}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Add medication..."
              value={newMedication}
              onChange={(e) => setNewMedication(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleAddMedication())
              }
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddMedication}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card className="border-chart-1 border">
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Any additional notes about the patient..."
            value={formData.notes || ""}
            onChange={(e) => handleFieldChange("notes", e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
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
