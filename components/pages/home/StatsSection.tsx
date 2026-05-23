import { Card } from "@/components/ui/card";
import { Award, Users, Star, CheckCircle } from "lucide-react";

const stats = [
  { icon: Award, label: "Years Experience", value: "15+" },
  { icon: Users, label: "Satisfied Patients", value: "10,000+" },
  { icon: Star, label: "Patient Rating", value: "4.9 / 5" },
  { icon: CheckCircle, label: "Success Rate", value: "98%" },
];

export function StatsSection() {
  return (
    <section className="py-16 sm:px-8 md:px-16  bg-muted/30 mt-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 border-border bg-card"
            >
              <div className="mx-auto w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <stat.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">{stat.value}</h3>
              <p className="mt-1 text-muted-foreground font-medium">{stat.label}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}