/* eslint-disable @next/next/no-img-element */
import { Download, ZoomIn, X } from "lucide-react";
import { useState } from "react";

interface MedicalImage {
  id: string;
  title: string;
  date: string;
  type: string;
  url: string;
}

const images: MedicalImage[] = [
  {
    id: "1",
    title: "Chest X-Ray",
    date: "December 5, 2025",
    type: "Radiology",
    url: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&h=600&fit=crop",
  },
  {
    id: "2",
    title: "EKG Results",
    date: "January 20, 2026",
    type: "Cardiology",
    url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop",
  },
  {
    id: "3",
    title: "Blood Test Report",
    date: "March 8, 2026",
    type: "Laboratory",
    url: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&h=600&fit=crop",
  },
  {
    id: "4",
    title: "CT Scan - Abdomen",
    date: "November 15, 2025",
    type: "Radiology",
    url: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=600&fit=crop",
  },
  {
    id: "5",
    title: "MRI Brain Scan",
    date: "October 2, 2025",
    type: "Radiology",
    url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=600&fit=crop",
  },
  {
    id: "6",
    title: "Ultrasound Report",
    date: "September 18, 2025",
    type: "Imaging",
    url: "https://images.unsplash.com/photo-1581595220975-119360b1a1b7?w=800&h=600&fit=crop",
  },
];

export function ImagesTab() {
  const [selectedImage, setSelectedImage] = useState<MedicalImage | null>(null);

  return (
    <>
      <div className="grid grid-cols-3 gap-6">
        {images.map((image) => (
          <div
            key={image.id}
            className="bg-card rounded-radius overflow-hidden shadow-shadow-md group cursor-pointer"
            onClick={() => setSelectedImage(image)}
          >
            <div className="relative aspect-4/3 overflow-hidden bg-muted">
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-background/0 group-hover:bg-background/60 transition-all flex items-center justify-center backdrop-blur-[2px]">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button className="p-2 bg-card rounded-radius hover:bg-accent hover:text-accent-foreground transition-colors shadow-shadow-sm">
                    <ZoomIn className="w-5 h-5 text-primary" />
                  </button>
                  <button className="p-2 bg-card rounded-radius hover:bg-accent hover:text-accent-foreground transition-colors shadow-shadow-sm">
                    <Download className="w-5 h-5 text-primary" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4">
              <h4 className="font-medium mb-1 text-card-foreground">
                {image.title}
              </h4>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{image.type}</span>
                <span>{image.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Viewer */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-background/90 z-50 flex items-center justify-center p-8 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full animate-in fade-in zoom-in-95 duration-200">
            <button
              className="absolute -top-12 right-0 p-2 bg-card text-card-foreground rounded-full hover:bg-accent hover:text-accent-foreground transition-colors shadow-shadow-md"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="bg-card rounded-radius overflow-hidden shadow-shadow-2xl">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="w-full max-h-[70vh] object-contain bg-muted"
              />
              <div className="p-6 border-t border-border bg-card">
                <h3 className="font-semibold mb-2 text-card-foreground">
                  {selectedImage.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{selectedImage.type}</span>
                  <span>•</span>
                  <span>{selectedImage.date}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
