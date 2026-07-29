import { Navbar } from "@/modules/landing/components/navbar";
import { Hero } from "@/modules/landing/components/hero";
import { TrustedBy } from "@/modules/landing/components/trusted-by";
import { CoreFeatures } from "@/modules/landing/components/core-features";
import { ProductPreview } from "@/modules/landing/components/product-preview";
import { KanbanWorkflow } from "@/modules/landing/components/kanban-workflow";
import { CollaborationProgress } from "@/modules/landing/components/collaboration-progress";
import { RoleBasedAccess } from "@/modules/landing/components/role-based-access";
import { HowItWorks } from "@/modules/landing/components/how-it-works";
import { WhyChoose } from "@/modules/landing/components/why-choose";
import { Pricing } from "@/modules/landing/components/pricing";
import { Faq } from "@/modules/landing/components/faq";
import { Cta } from "@/modules/landing/components/cta";
import { Footer } from "@/modules/landing/components/footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustedBy />
        <CoreFeatures />
        <ProductPreview />
        <KanbanWorkflow />
        <CollaborationProgress />
        <RoleBasedAccess />
        <HowItWorks />
        <WhyChoose />
        <Pricing />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
