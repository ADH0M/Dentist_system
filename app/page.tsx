import { OurServicesSection } from "@/pages/home/OurServicesSection";
import { ResultsSection } from "@/pages/home/ResultsSection";
import { StatsSection } from "@/pages/home/StatsSection";
import { TotalAnesthesiaSection } from "@/pages/home/TotalAnesthesiaSection";
import { WhyChooseUsSection } from "@/pages/home/WhyChooseUsSection";
import Link from "next/link";
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-20 px-4 text-center bg-linear-to-b from-background to-muted/20">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-linear-to-r from-primary to-accent bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
          DR Taha App
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
          Welcome to Dr Taha Dental System Crafting Confident Smiles with
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

      <OurServicesSection/>
      <TotalAnesthesiaSection/>
      <ResultsSection/>
      {/* How It Works / About Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-6">How It Works</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Create an Account</h4>
                  <p className="text-muted-foreground">
                    Sign up in seconds and get your own personal workspace.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Create Columns</h4>
                  <p className="text-muted-foreground">
                    Organize your workflow by creating columns like &quot;To
                    Do&quot;, &quot;In Progress&quot;, etc.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Add Tasks</h4>
                  <p className="text-muted-foreground">
                    Add tasks to your columns and manage your daily activities
                    efficiently.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-card p-8 rounded-2xl shadow-xl border border-border rotate-2 hover:rotate-0 transition-transform duration-500">
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted/50 rounded w-full"></div>
              <div className="h-4 bg-muted/50 rounded w-5/6"></div>
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="h-32 bg-blue-50 rounded-lg border border-blue-100"></div>
                <div className="h-32 bg-green-50 rounded-lg border border-green-100"></div>
                <div className="h-32 bg-purple-50 rounded-lg border border-purple-100"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
