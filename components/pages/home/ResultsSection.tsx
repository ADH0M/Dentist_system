/* eslint-disable @next/next/no-img-element */
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface CaseResult {
  id: number;
  title: string;
  beforeImage: string;
  afterImage: string;
  category: string;
}

const caseResults: CaseResult[] = [
  {
    id: 1,
    title: "Complete Smile Makeover",
    category: "Cosmetic Dentistry",
    beforeImage:
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=400&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1606811879423-6fd644a30325?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    title: "Dental Implants",
    category: "Restorative",
    beforeImage:
      "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=400&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    title: "Orthodontic Treatment",
    category: "Orthodontics",
    beforeImage:
      "https://images.unsplash.com/photo-1606811971618-4486d14f3f72?auto=format&fit=crop&w=400&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80",
  },
];

export function ResultsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Our Results Speak for Themselves
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Real transformations, real smiles. Browse through our collection of
            successful dental treatments and see the difference we can make.
          </p>
        </div>

        {/* Before/After Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {caseResults.map((caseItem) => (
            <Card
              key={caseItem.id}
              className="overflow-hidden border-border bg-card shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Category Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                  {caseItem.category}
                </span>
              </div>

              {/* Images Container */}
              <div className="grid grid-cols-2 gap-0">
                {/* Before Image */}
                <div className="relative aspect-square">
                  <img
                    src={caseItem.beforeImage}
                    alt={`Before - ${caseItem.title}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs font-semibold bg-black/70 text-white rounded">
                    Before
                  </div>
                </div>

                {/* After Image */}
                <div className="relative aspect-square">
                  <img
                    src={caseItem.afterImage}
                    alt={`After - ${caseItem.title}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs font-semibold bg-primary/90 text-primary-foreground rounded">
                    After
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-foreground">
                  {caseItem.title}
                </h3>
              </div>
            </Card>
          ))}
        </div>

        {/* View All Cases Button */}
        <div className="text-center">
          <Link href="/#">
            <Button
              size="lg"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              View All Cases
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
