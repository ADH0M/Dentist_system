import { Footer } from "@/components/CopyrightFooter";

export default function AboutPage() {
  
  return (
    <div className="main-bg min-h-screen h-full overflow-y-scroll ">
      {/* Hero Section */}
      <section className="py-12 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Craft Your Thoughts, Effortlessly
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Sample Note App is a minimalist, beautiful, and intuitive note-taking
            experience designed for focus, organization, and peace of mind.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <FeatureCard
              title="Drag & Drop Simplicity"
              description="Reorder notes with ease using our smooth drag-and-drop interface."
              icon="🪄"
            />
            {/* Feature Card 2 */}
            <FeatureCard
              title="Dark & Light Mode"
              description="Switch seamlessly between themes that respect your eyes and preferences."
              icon="🌙"
            />
            {/* Feature Card 3 */}
            <FeatureCard
              title="Local First, Always Private"
              description="Your notes stay on your device. No account needed. No tracking."
              icon="🔒"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to Simplify Your Notes?
          </h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of users who write, organize, and focus — without distractions.
          </p>
          <a
            href="/login"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try It Now — Free Forever
          </a>
        </div>
      </section>

      <Footer/>
    </div>
  );
}

const FeatureCard = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) => {
  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-card-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
};