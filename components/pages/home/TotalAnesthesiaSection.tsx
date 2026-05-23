/* eslint-disable @next/next/no-img-element */
import { CheckCircle2 } from "lucide-react";

const anesthesiaFeatures = [
  {
    title: "Comprehensive Pre-Op Evaluation",
    desc: "Thorough health assessment to ensure safe and effective anesthesia planning.",
  },
  {
    title: "Precise Monitoring During Sedation",
    desc: "Specialized team tracks vital signs in real-time for complete safety and peace of mind.",
  },
  {
    title: "Complete Patient Comfort",
    desc: "Advanced techniques minimize discomfort and keep you relaxed throughout the procedure.",
  },
  {
    title: "Dedicated Post-Op Care",
    desc: "Clear recovery guidelines and follow-up support to ensure a smooth, safe healing process.",
  },
  {
    title: "Ideal for Children & Special Needs",
    desc: "A calm, controlled environment tailored to make dental care accessible and stress-free.",
  },
];

export function TotalAnesthesiaSection() {
  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Total Anesthesia Operations
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Safe, advanced sedation solutions designed to keep you comfortable
            and stress-free during dental procedures.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Doctor Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-md aspect-4/3 lg:aspect-auto lg:h-[500px]">
            <img
              src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80"
              alt="Dental anesthesiologist monitoring patient comfort"
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent" />
          </div>

          {/* Content Side */}
          <div className="space-y-6">
            <ul className="space-y-5">
              {anesthesiaFeatures.map((item, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className="mt-1 shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
