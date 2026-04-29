/* eslint-disable @typescript-eslint/no-explicit-any */
// app/doctor/patients/[id]/components/PatientRadiology.tsx
"use client";

import { useState } from "react";
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
import { Image as ImageIcon, Upload, Calendar, ZoomIn, X } from "lucide-react";
import { toast } from "sonner";

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
}

export default function PatientRadiology({
  images,
  patientId,
}: PatientRadiologyProps) {
  const [selectedImage, setSelectedImage] = useState<RadiologyImage | null>(
    null,
  );
  const [isUploading, setIsUploading] = useState(false);
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UploadPreset;
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadToothNumber, setUploadToothNumber] = useState("");

  const handleUploadSuccess = async (result: any) => {
    const url =
      typeof result.info === "object" && result.info !== null
        ? result.info.secure_url
        : undefined;

    if (!url) return;

    setIsUploading(true);

    try {
      const response = await fetch(`/api/doctor/patients/${patientId}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          type: "X-Ray",
          description: uploadDescription,
          toothNumber: uploadToothNumber,
        }),
      });

      if (!response.ok) throw new Error("Failed to save image");

      toast.success("Image uploaded successfully");
      setUploadDescription("");
      setUploadToothNumber("");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to save image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const response = await fetch(`/api/doctor/images/${imageId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete image");

      toast.success("Image deleted successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete image");
    }
  };

  if (!images || images.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <ImageIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">No radiology images uploaded</p>
          <p className="text-sm text-gray-400 mt-1">
            Use the upload button above to add X-rays or scans
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload New Image
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label>Description</Label>
              <Input
                placeholder="Image description..."
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
              />
            </div>
            <div>
              <Label>Tooth Number (optional)</Label>
              <Input
                placeholder="e.g., 11, 24, 36..."
                value={uploadToothNumber}
                onChange={(e) => setUploadToothNumber(e.target.value)}
              />
            </div>
          </div>

          <CldUploadWidget
            uploadPreset={uploadPreset}
            onSuccess={handleUploadSuccess}
            onClose={() => setIsUploading(false)}
          >
            {({ open }) => (
              <Button
                type="button"
                onClick={() => open()}
                disabled={isUploading}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? "Uploading..." : "Upload Radiology Image"}
              </Button>
            )}
          </CldUploadWidget>
        </CardContent>
      </Card>

      {/* Images Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden group">
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
                onClick={() => handleDeleteImage(image.id)}
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
                <p className="text-sm font-medium text-primary">{image.type}</p>
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

      {/* Image Preview Dialog */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedImage?.type || "Radiology Image"}
              {selectedImage?.toothNumber &&
                ` - Tooth ${selectedImage.toothNumber}`}
            </DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              <div className="relative w-full h-[500px]">
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.description || "Radiology image"}
                  fill
                  className="object-contain"
                />
              </div>
              {selectedImage.description && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium mb-1">Description:</p>
                  <p className="text-gray-600">{selectedImage.description}</p>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-500">
                <span>
                  Uploaded: {new Date(selectedImage.createdAt).toLocaleString()}
                </span>
                <span>Image ID: {selectedImage.id}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
