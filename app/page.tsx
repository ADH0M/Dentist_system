import { Footer } from "@/components/CopyrightFooter";
import { ResultsSection } from "@/components/pages/home/ResultsSection";
import ServiceSection from "@/components/pages/home/ServiceSection";
import { StatsSection } from "@/components/pages/home/StatsSection";
import { TotalAnesthesiaSection } from "@/components/pages/home/TotalAnesthesiaSection";
import { WhyChooseUsSection } from "@/components/pages/home/WhyChooseUsSection";
import Link from "next/link";
export default function Home() {
  return (
    <div className="flex flex-col h-full max-h-screen overflow-y-scroll overflow-x-hidden ">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-20 px-4 text-center bg-linear-to-b from-background to-muted/20">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-linear-to-r from-primary to-accent bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
          DR App
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
          Welcome to Dr App Dental System Crafting Confident Smiles with
          Precision and Prestige. Advanced Dental Care, Perfectly Managed.
        </p>

        <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <Link
            href="/user"
            className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
          >
            Get Started
          </Link>
          <Link
            href="/about"
            className="px-8 py-3 rounded-lg border border-border bg-card hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Read More
          </Link>
        </div>
      </section>

      <StatsSection />
      {/* Features Section */}
      <WhyChooseUsSection />

      <ServiceSection />
      <TotalAnesthesiaSection />
      <ResultsSection />


      <Footer />
    </div>
  );
}
