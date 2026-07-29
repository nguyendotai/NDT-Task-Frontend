import { Navbar } from "@/modules/landing/components/navbar";
import { Hero } from "@/modules/landing/components/hero";
import { CoreFeatures } from "@/modules/landing/components/core-features";
import { HowItWorks } from "@/modules/landing/components/how-it-works";
import { ProductScreenshots } from "@/modules/landing/components/product-screenshots";
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
        <CoreFeatures />
        <HowItWorks />
        <ProductScreenshots />
        <WhyChoose />
        <Pricing />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
