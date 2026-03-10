"use client";
import { useState } from "react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel } from "@/components/ui/field";
import { CldUploadWidget } from "next-cloudinary";


interface RadiologyImage {
  url: string;
  description: string;
}

interface Patient {
  username: string;
  email: string;
  phone?: string;
  diagnosis: string;
  procedures: string;
  treatment: string;
  radiologyImages: RadiologyImage[];
}

const emptyPatient: Patient = {
  username: "",
  email: "",
  phone: "",
  diagnosis: "",
  procedures: "",
  treatment: "",
  radiologyImages: [],
};

export default function DrAssistantForm() {
  const [patient, setPatient] = useState<Patient>(emptyPatient);
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UploadPreset;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Patient Data:", patient);
    alert("Patient data submitted! Check console for details.");
  };

  return (
    <div className="p-4 md:p-8 min-h-screen ">
      <div className="max-w-6xl mx-auto">
        <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
          <h1 className="text-2xl font-bold text-foreground mb-6">
            Add Patient Record
          </h1>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Username */}
            <div>
              <label className="auth-label">Username</label>
              <input
                type="text"
                value={patient.username}
                onChange={(e) =>
                  setPatient({ ...patient, username: e.target.value })
                }
                className="auth-input"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="auth-label">Email</label>
              <input
                type="email"
                value={patient.email}
                onChange={(e) =>
                  setPatient({ ...patient, email: e.target.value })
                }
                className="auth-input"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="auth-label">Phone (optional)</label>
              <input
                type="text"
                value={patient.phone || ""}
                onChange={(e) =>
                  setPatient({ ...patient, phone: e.target.value || undefined })
                }
                className="auth-input"
              />
            </div>

            {/* Empty div for grid alignment */}
            <div></div>

            {/* Diagnosis */}
            <div className="md:col-span-2">
              <Field>
                <FieldLabel
                  htmlFor="diagnosis"
                  className="text-[12px] font-medium text-foreground mb-1"
                >
                  Diagnosis
                </FieldLabel>
                <Textarea
                  id="diagnosis"
                  placeholder="Diagnosis"
                  value={patient.diagnosis}
                  onChange={(e) =>
                    setPatient({ ...patient, diagnosis: e.target.value })
                  }
                  className="auth-input"
                />
              </Field>
            </div>

            {/* Performed Procedures */}
            <div className="md:col-span-2">
              <Field>
                <FieldLabel
                  htmlFor="procedures"
                  className="text-[12px] font-medium text-foreground mb-1"
                >
                  Performed Procedures
                </FieldLabel>
                <Textarea
                  id="procedures"
                  placeholder="Performed Procedures"
                  value={patient.procedures}
                  onChange={(e) =>
                    setPatient({ ...patient, procedures: e.target.value })
                  }
                  className="auth-input"
                />
              </Field>
            </div>

            {/* Treatment */}
            <div className="md:col-span-2">
              <Field>
                <FieldLabel
                  htmlFor="treatment"
                  className="text-[12px] font-medium text-foreground mb-1"
                >
                  Treatment Provided
                </FieldLabel>
                <Textarea
                  id="treatment"
                  placeholder="Treatment Provided"
                  value={patient.treatment}
                  onChange={(e) =>
                    setPatient({ ...patient, treatment: e.target.value })
                  }
                  className="auth-input"
                />
              </Field>
            </div>

            {/* Radiology Images */}
            <div className="md:col-span-2">
              <h2 className="font-semibold text-card-foreground mb-2">
                Radiology Images
              </h2>

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
                  <button
                    type="button"
                    onClick={() => open()}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded mb-4 hover:bg-primary/90"
                  >
                    Upload Image
                  </button>
                )}
              </CldUploadWidget>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {patient.radiologyImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="border border-border rounded-lg p-2 flex flex-col items-center "
                  >
                    <div className="relative w-full h-40 mb-2">
                      <Image
                        src={img.url}
                        alt={`Radiology ${idx + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Description"
                      value={img.description}
                      onChange={(e) =>
                        handleUpdateDescription(idx, e.target.value)
                      }
                      className="border border-border p-1 rounded w-full mb-2"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 w-full"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 w-full"
              >
                Save Patient
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

