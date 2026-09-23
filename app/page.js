import Hero from "@/components/Hero";
import ModelShowcase from "@/components/ModelShowcase";
import ModelComparison from "@/components/ModelComparison";
import Storyline from "@/components/Storyline";
import Founders from "@/components/Founders";
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <>
      <Hero />
      <ModelShowcase />
      <ModelComparison />
      <Storyline />
      <Founders />
      <FAQ />
    </>
  );
}
