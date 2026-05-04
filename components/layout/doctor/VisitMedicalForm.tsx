// app/doctor/patients/[id]/components/PatientMedicalForm.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Plus, X } from "lucide-react";
import { RejectedToast, SuccessToast } from "@/lib/utils/toasts";

interface PatientMedicalFormProps {
  patientId: string;
  visitId?: string;
  initialData: {
    allergies: string[];
    medications: string[];
    notes: string | null;
  };
}

export default function VisitMedicalForm({
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
  const controllerRef = useRef<AbortController>(null);

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

    if (controllerRef.current?.abort) {
      controllerRef.current?.abort();
    }

    controllerRef.current = new AbortController();
    const signal = AbortSignal.any([
      controllerRef.current.signal,
      AbortSignal.timeout(5000),
    ]);

    setIsLoading(true);

    try {
      // Update patient's medical history
      const req = await fetch(`/api/doctor/patient/${patientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          allergies: formData.allergies,
          medications: formData.medications,
          notes: formData.notes,
        }),
        signal,
      });

      const data = await req.json();
      console.log(data);

      if (!req.ok) {
        throw new Error(data?.error);
      }

      setFormData({
        allergies: [],
        medications: [],
        notes: "",
      });
      SuccessToast("Patient data updated successfully");
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      RejectedToast("Failed to update Patient data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => controllerRef.current?.abort();
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 flex justify-center flex-col gap-4 items-center w-full "
    >
      {/* Allergies */}
      <Card className="border-chart-1 border w-full sm:max-w-[85%] gap-1  m-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 ">
            <div className="h-2 w-2 bg-destructive rounded-full" />
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
      <Card className="border-chart-1 border w-full sm:max-w-[85%] gap-1  m-0">
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
      <Card className="border-chart-1 border w-full sm:max-w-[85%] gap-1  m-0">
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
        <Button type="button" variant="outline" onClick={() => controllerRef.current?.abort()}>
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
