import { Card } from "@/components/ui/card";
import { Shield, Clock, Heart, Zap } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure & Private",
    desc: `Your data is encrypted and secure. We prioritize your privacy
        above all else.`,
  },
  {
    icon: Shield,
    title: "Advanced Technology",
    desc: "Digital X-rays, 3D scanning, and laser dentistry for precise, comfortable treatments.",
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    desc: "Evening & weekend appointments available to fit your busy lifestyle.",
  },
  {
    icon: Shield,
    title: "Uncompromising Clinical Excellence",
    desc: `At Dr Taha Dental Clinic, we combine advanced dental technology with refined clinical expertise.`,
  },
  {
    icon: Heart,
    title: "Patient-First Care",
    desc: "Gentle, anxiety-free dentistry with personalized treatment plans.",
  },
  {
    icon: Zap,
    title: "Expert Dental Team",
    desc: "Board-certified specialists with decades of combined clinical experience.",
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Why Choose Us?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We combine cutting-edge dentistry with compassionate care to give
            you the smile you deserve.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300 bg-card"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-5">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
