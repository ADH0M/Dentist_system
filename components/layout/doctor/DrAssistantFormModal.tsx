/* eslint-disable @typescript-eslint/no-explicit-any */
// components/doctor/DrAssistantFormModal.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel } from "@/components/ui/field";
import { CldUploadWidget } from "next-cloudinary";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { RootState } from "@/store/store";

import { toast } from "sonner";

interface RadiologyImage {
  url: string;
  description: string;
}

interface PatientFormData {
  diagnosis: string;
  procedures: string;
  treatment: string;
  radiologyImages: RadiologyImage[];
}

interface DrAssistantFormModalProps {
  isOpen: boolean;
  onChangeOpen: () => void;
  patientId: string | null;
  initialData?: {
    diagnosis?: string;
    proceduresDone?: string;
    treatmentPlan?: string;
    radiologyImages?: RadiologyImage[];
  };
}

const emptyPatient: PatientFormData = {
  diagnosis: "",
  procedures: "",
  treatment: "",
  radiologyImages: [],
};

export default function DrAssistantFormModal({
  isOpen,
  onChangeOpen,
  patientId,
  initialData,
}: DrAssistantFormModalProps) {
  const [patient, setPatient] = useState<PatientFormData>(emptyPatient);
  const [isLoading, setIsLoading] = useState(false);

  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UploadPreset;

  // Load initial data when modal opens
  useEffect(() => {
    if (isOpen && initialData) {
      setPatient({
        diagnosis: initialData.diagnosis || "",
        procedures: initialData.proceduresDone || "",
        treatment: initialData.treatmentPlan || "",
        radiologyImages: initialData.radiologyImages || [],
      });
    } else if (isOpen) {
      // Reset form when opening without data
      setPatient(emptyPatient);
    }
  }, [isOpen, initialData]);

  const handleAddImage = (url?: string) => {
    if (!url) return;
    setPatient((prev) => ({
      ...prev,
      radiologyImages: [...prev.radiologyImages, { url, description: "" }],
    }));
  };

  const handleUpdateDescription = (index: number, description: string) => {
    const images = [...patient.radiologyImages];
    images[index].description = description;
    setPatient((prev) => ({ ...prev, radiologyImages: images }));
  };

  const handleRemoveImage = (index: number) => {
    const images = patient.radiologyImages.filter((_, i) => i !== index);
    setPatient((prev) => ({ ...prev, radiologyImages: images }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientId) {
      toast.error("No patient selected");
      return;
    }

    setIsLoading(true);

    try {
      toast.success("Patient data updated successfully");

      // Close modal after success
    } catch (error: any) {
      toast.error(error || "Failed to update patient data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChangeOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Edit Patient Medical Data
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            Update diagnosis, procedures, treatment, and radiology images
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Diagnosis */}
          <div className="space-y-2">
            <Field>
              <FieldLabel
                htmlFor="diagnosis"
                className="text-sm font-medium text-foreground"
              >
                Diagnosis
              </FieldLabel>
              <Textarea
                id="diagnosis"
                placeholder="Enter diagnosis..."
                value={patient.diagnosis}
                onChange={(e) =>
                  setPatient({ ...patient, diagnosis: e.target.value })
                }
                className="min-h-[100px]"
                rows={3}
              />
            </Field>
          </div>

          {/* Performed Procedures */}
          <div className="space-y-2">
            <Field>
              <FieldLabel
                htmlFor="procedures"
                className="text-sm font-medium text-foreground"
              >
                Performed Procedures
              </FieldLabel>
              <Textarea
                id="procedures"
                placeholder="List performed procedures..."
                value={patient.procedures}
                onChange={(e) =>
                  setPatient({ ...patient, procedures: e.target.value })
                }
                className="min-h-[100px]"
                rows={3}
              />
            </Field>
          </div>

          {/* Treatment Provided */}
          <div className="space-y-2">
            <Field>
              <FieldLabel
                htmlFor="treatment"
                className="text-sm font-medium text-foreground"
              >
                Treatment Provided
              </FieldLabel>
              <Textarea
                id="treatment"
                placeholder="Describe treatment provided..."
                value={patient.treatment}
                onChange={(e) =>
                  setPatient({ ...patient, treatment: e.target.value })
                }
                className="min-h-[100px]"
                rows={3}
              />
            </Field>
          </div>

          {/* Radiology Images */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <FieldLabel className="text-sm font-medium text-foreground">
                Radiology Images
              </FieldLabel>

              <CldUploadWidget
                uploadPreset={uploadPreset}
                onSuccess={(result) => {
                  const url =
                    typeof result.info === "object" && result.info !== null
                      ? result.info.secure_url
                      : undefined;
                  if (url) handleAddImage(url);
                }}
              >
                {({ open }) => (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => open()}
                  >
                    + Upload Image
                  </Button>
                )}
              </CldUploadWidget>
            </div>

            {patient.radiologyImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {patient.radiologyImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="border border-border rounded-lg p-3 space-y-2 bg-gray-50"
                  >
                    <div className="relative w-full h-40">
                      <Image
                        src={img.url}
                        alt={`Radiology ${idx + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Image description..."
                      value={img.description}
                      onChange={(e) =>
                        handleUpdateDescription(idx, e.target.value)
                      }
                      className="w-full px-2 py-1 text-sm border rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveImage(idx)}
                      className="w-full"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <p className="text-gray-500">No images uploaded</p>
                <p className="text-xs text-gray-400 mt-1">
                  Click the upload button to add radiology images
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" className="min-w-[120px]">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
