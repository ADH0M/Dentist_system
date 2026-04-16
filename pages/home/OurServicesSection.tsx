/* eslint-disable @next/next/no-img-element */
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface Service {
  title: string;
  description: string;
  image: string;
}

const services: Service[] = [
  {
    title: "Pediatric Dentistry",
    description:
      "Gentle, child-friendly care designed to build healthy smiles from an early age.",
    image:
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Dental Implants",
    description:
      "Permanent, natural-looking tooth replacements for restored confidence and function.",
    image:
      "https://images.unsplash.com/photo-1606811971618-4486d14f3f72?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Orthodontics",
    description:
      "Modern braces and clear aligners to straighten teeth and correct bite alignment.",
    image:
      "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Fixed & Removable Prosthetics",
    description:
      "Custom crowns, bridges, and dentures crafted for comfort, durability, and aesthetics.",
    image:
      "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=600&q=80",
  },
];

export function OurServicesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Our Distinguished Services
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Comprehensive dental care tailored to your unique needs, from
            routine checkups to advanced treatments.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className="overflow-hidden group border-border bg-card shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative aspect-4/3 overflow-hidden bg-muted">
                <img
                  src={service.image}
                  alt={service.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {service.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Optional CTA */}
        <div className="text-center mt-12">
          <Link
            href="/#"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            View All Services →
          </Link>
        </div>
      </div>
    </section>
  );
}
