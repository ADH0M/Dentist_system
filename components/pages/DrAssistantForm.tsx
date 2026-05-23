/* eslint-disable @typescript-eslint/no-explicit-any */
// components/doctor/DrAssistantFormModal.tsx
'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel } from "@/components/ui/field";
import { CldUploadWidget } from "next-cloudinary";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useDispatchHook } from "@/hooks/useSelector";
import { TodayPatient } from "@/store/reducers/doctorSlice";

interface RadiologyImage {
  url: string;
  description: string;
}

interface DrAssistantFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: TodayPatient | null;  // ← تستقبل patient data كاملة
  onUpdateSuccess?: () => void;   // callback بعد التحديث
}

interface FormData {
  diagnosis: string;
  procedures: string;
  treatment: string;
  radiologyImages: RadiologyImage[];
}

export default function DrAssistantFormModal({ 
  isOpen, 
  onClose, 
  patient,
  onUpdateSuccess 
}: DrAssistantFormModalProps) {
  const dispatch = useDispatchHook();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    diagnosis: "",
    procedures: "",
    treatment: "",
    radiologyImages: [],
  });
  
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UploadPreset;
  const [hasChanges, setHasChanges] = useState(false);

  // Load patient data when modal opens
  useEffect(() => {
    if (isOpen && patient) {
      // Get the latest visit data
      const latestVisit = patient.todayVisits?.[0] || {};
      
      setFormData({
        diagnosis: latestVisit.diagnosis || "",
        procedures: latestVisit.proceduresDone || "",
        treatment: latestVisit.treatmentPlan || "",
        radiologyImages: [], // You can load existing images from somewhere
      });
      setHasChanges(false);
    }
  }, [isOpen, patient]);

  const handleAddImage = (url?: string) => {
    if (!url) return;
    setFormData((prev) => ({
      ...prev,
      radiologyImages: [...prev.radiologyImages, { url, description: "" }],
    }));
    setHasChanges(true);
  };

  const handleUpdateDescription = (index: number, description: string) => {
    const images = [...formData.radiologyImages];
    images[index].description = description;
    setFormData((prev) => ({ ...prev, radiologyImages: images }));
    setHasChanges(true);
  };

  const handleRemoveImage = (index: number) => {
    const images = formData.radiologyImages.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, radiologyImages: images }));
    setHasChanges(true);
  };

  const handleFieldChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patient) {
      toast.error("No patient selected");
      return;
    }
    
    if (!hasChanges) {
      toast.info("No changes to save");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Update the latest visit for this patient
      const latestVisitId = patient.todayVisits?.[0]?.id;
      
      if (!latestVisitId) {
        toast.error("No visit found for this patient");
        return;
      }
      
      const response = await fetch(`/api/doctor/visits/${latestVisitId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          diagnosis: formData.diagnosis,
          proceduresDone: formData.procedures,
          treatmentPlan: formData.treatment,
          // radiologyImages: formData.radiologyImages, // if you have images model
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update patient data');
      }
      
      const result = await response.json();
      
      toast.success(result.message || "Patient data updated successfully");
      
      // Call success callback to refresh data
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
      
      // Close modal
      onClose();
      
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(error.message || "Failed to update patient data");
    } finally {
      setIsLoading(false);
    }
  };

  if (!patient) return null;

  const patientName = patient.user?.username || 'Unknown Patient';
  const visitCount = patient.todayVisits?.length || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Edit Medical Data
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            Patient: <span className="font-medium">{patientName}</span>
            {visitCount > 0 && (
              <span className="ml-2 text-xs">
                (Visit #{visitCount} today)
              </span>
            )}
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
                value={formData.diagnosis}
                onChange={(e) => handleFieldChange('diagnosis', e.target.value)}
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
                value={formData.procedures}
                onChange={(e) => handleFieldChange('procedures', e.target.value)}
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
                value={formData.treatment}
                onChange={(e) => handleFieldChange('treatment', e.target.value)}
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

            {formData.radiologyImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {formData.radiologyImages.map((img, idx) => (
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
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !hasChanges}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}