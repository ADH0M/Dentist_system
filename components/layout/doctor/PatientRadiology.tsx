/* eslint-disable @typescript-eslint/no-explicit-any */
// app/doctor/patients/[id]/components/PatientRadiology.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CldUploadWidget } from "next-cloudinary";
import {
  Image as ImageIcon,
  Upload,
  Calendar,
  ZoomIn,
  X,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface RadiologyImage {
  id: string;
  url: string;
  type: string | null;
  description: string | null;
  toothNumber: string | null;
  createdAt: Date;
}

interface PatientRadiologyProps {
  images: RadiologyImage[];
  patientId: string;
  uploadedById: string | undefined;
}

export default function PatientRadiology({
  images: initialImages,
  patientId,
  uploadedById,
}: PatientRadiologyProps) {
  const [images, setImages] = useState<RadiologyImage[]>(initialImages);
  const [selectedImage, setSelectedImage] = useState<RadiologyImage | null>(
    null,
  );
  const [isUploading, setIsUploading] = useState(false);
  const [description, setDescription] = useState("");
  const [toothNumber, setToothNumber] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    description?: string;
    toothNumber?: string;
  }>({});
  const [successUpload, setSuccessUpload] = useState<string | undefined>("");
  const router = useRouter();

  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UploadPreset;

  const isFormValid =
    description.trim().length >= 3 &&
    Object.keys(validationErrors).length === 0;

  const refreshImages = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(`/api/doctor/patient/${patientId}/images`);
      if (response.ok) {
        const data = await response.json();
        setImages(data.images || []);
      }
    } catch (error) {
      console.error("Error refreshing images:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [patientId]);

  const onSuccess = useCallback(
    async (imageUrl: string | undefined) => {
      if (!imageUrl) {
        toast.error("Failed to get image URL", { position: "top-left" });
        return;
      }

      try {
        const requestBody = {
          url: imageUrl,
          type: "X-Ray",
          description: description.trim(),
          toothNumber: toothNumber,
          uploadedById: uploadedById,
          patientId,
        };

        const response = await fetch(
          `/api/doctor/patient/${patientId}/images`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
          },
        );

        const resultData = await response.json();

        if (!response.ok) {
          throw new Error(resultData.error || "Failed to save image");
        }
        toast.success("Image uploaded successfully", { position: "top-left" });
        
        // Reset form
        setDescription("");
        setToothNumber("");
        setValidationErrors({});
        
        // Refresh images
        await refreshImages();
        router.refresh();
      } catch (error: any) {
        console.error("Error:", error);
        toast.error(error.message || "Failed to save image", {
          position: "top-left",
        });
      } finally {
        setIsUploading(false);
        setSuccessUpload("");
      }
    },
    [patientId, description, refreshImages, toothNumber, uploadedById ,router],
  );

  const handleUploadSuccess = async (result: any) => {
    let imageUrl: string | undefined;

    setIsUploading(true);
    if (typeof result.info === "object" && result.info !== null) {
      imageUrl = result.info.secure_url;
      setSuccessUpload(imageUrl);
    } else if (typeof result.info === "string") {
      imageUrl = result.info;
      setSuccessUpload(imageUrl);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const response = await fetch(`/api/doctor/images/${imageId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete image");
      }

      toast.success("Image deleted successfully", { position: "top-left" });

      // Remove image from local state
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to delete image", {
        position: "top-left",
      });
    }
  };

  useEffect(() => {
    if (successUpload && isUploading) {
      onSuccess(successUpload);
    }
  }, [successUpload, onSuccess, isUploading]);
  // Update images when prop changes
  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  return (
    <div className="w-full flex justify-center items-center">
      <div className="space-y-6 sm:max-w-[85%] w-full ">
        {/* Upload Section */}
        <Card className="w-full border-primary">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload New Image
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshImages}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-muted-foreground">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Image description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`mt-2 ${validationErrors.description ? "border-red-500" : ""}`}
                />
                {validationErrors.description && (
                  <p className="text-xs text-red-500 mt-1">
                    {validationErrors.description}
                  </p>
                )}
                {description.length > 0 &&
                  description.length < 3 &&
                  !validationErrors.description && (
                    <p className="text-xs text-yellow-500 mt-1">
                      Minimum 3 characters required
                    </p>
                  )}
              </div>
              <div>
                <Label className="text-muted-foreground">
                  Tooth Number (optional)
                </Label>
                <Input
                  placeholder="e.g., 11, 24, 36..."
                  value={toothNumber}
                  onChange={(e) => setToothNumber(e.target.value)}
                  className={`mt-2 ${validationErrors.toothNumber ? "border-red-500" : ""}`}
                  type="number"
                  min="1"
                  max="48"
                />
                {validationErrors.toothNumber && (
                  <p className="text-xs text-red-500 mt-1">
                    {validationErrors.toothNumber}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Enter tooth number between 1-48
                </p>
              </div>
            </div>

            <CldUploadWidget
              uploadPreset={uploadPreset}
              onSuccess={handleUploadSuccess}
              onError={(error) => {
                console.error("Upload error:", error);
                toast.error("Upload failed. Please try again.", {
                  position: "top-left",
                });
              }}
              onClose={() => setIsUploading(false)}
              options={{
                maxFiles: 1,
                clientAllowedFormats: ["image", "jpg", "jpeg", "png", "webp"],
                maxFileSize: 5000000, // 5MB
              }}
            >
              {({ open, widget }) => {
                return (
                  <Button
                    type="button"
                    onClick={() => {
                      if (!isFormValid) {
                        toast.error(
                          "Please fix validation errors before uploading",
                          { position: "top-left" },
                        );
                        return;
                      }
                      if (!patientId) {
                        toast.error("Patient ID not found", {
                          position: "top-left",
                        });
                        return;
                      }
                      if (!uploadedById) {
                        toast.error("User not authenticated", {
                          position: "top-left",
                        });
                        return;
                      }
                      open();
                    }}
                    disabled={
                      isUploading || !isFormValid || !patientId || !uploadedById
                    }
                    className="w-full"
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Radiology Image
                      </>
                    )}
                  </Button>
                );
              }}
            </CldUploadWidget>

            <div className="mt-3 text-xs text-gray-400 text-center">
              Supported formats: JPG, PNG, WEBP (Max 5MB)
            </div>
          </CardContent>
        </Card>

        {/* Images Gallery */}
        {images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image) => (
              <Card key={image.id} className="overflow-hidden group border-border">
                <div className="relative h-48 bg-gray-100">
                  <Image
                    src={image.url}
                    alt={image.description || "Radiology image"}
                    fill
                    className="object-cover cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImage(image.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setSelectedImage(image)}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="pt-4">
                  {image.type && (
                    <p className="text-sm font-medium text-primary">
                      {image.type}
                    </p>
                  )}
                  {image.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {image.description}
                    </p>
                  )}
                  {image.toothNumber && (
                    <p className="text-xs text-gray-400 mt-2">
                      Tooth #{image.toothNumber}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(image.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-primary">
            <CardContent className="py-12 text-center">
              <ImageIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">No radiology images uploaded</p>
              <p className="text-sm text-gray-400 mt-1">
                Use the upload button above to add X-rays or scans
              </p>
            </CardContent>
          </Card>
        )}

        {/* Image Preview Dialog */}
        <Dialog
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(null)}
        >
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto border-border">
            <DialogHeader>
              <DialogTitle className="text-chart-3">
                {selectedImage?.type || "Radiology Image"}
                {selectedImage?.toothNumber &&
                  ` - Tooth ${selectedImage.toothNumber}`}
              </DialogTitle>
            </DialogHeader>
            {selectedImage && (
              <div className="space-y-4 ">
                <div className="relative w-full h-[500px]">
                  <Image
                    src={selectedImage.url}
                    alt={selectedImage.description || "Radiology image"}
                    fill
                    className="object-contain"
                  />
                </div>
                {selectedImage.description && (
                  <div className="p-4 rounded-lg text-chart-1">
                    <p className="font-medium mb-1">Description:</p>
                    <p className="text-primary">{selectedImage.description}</p>
                  </div>
                )}
                <div className="flex justify-between text-sm text-chart-1">
                  <span>
                    Uploaded:{" "}
                    {new Date(selectedImage.createdAt).toLocaleString()}
                  </span>
                  <span>ID: {selectedImage.id.slice(-8)}</span>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
