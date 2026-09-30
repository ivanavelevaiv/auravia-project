import Hero from "@/components/Hero";
import ModelShowcase from "@/components/ModelShowcase";
import ColorShowcase from "@/components/ColorShowcase";
import ModelComparison from "@/components/ModelComparison";
import StandardEquipment from "@/components/StandardEquipment";
import Storyline from "@/components/Storyline";
import Founders from "@/components/Founders";
import FAQ from "@/components/FAQ";
import { getDictionary } from "@/lib/dictionaries";

export default async function Home({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <>
      <Hero dict={dict.hero} common={dict.common} />
      <ModelShowcase dict={dict.models} common={dict.common} />
      <ColorShowcase dict={dict.colors} />
      <ModelComparison dict={dict.compare} models={dict.models} common={dict.common} />
      <StandardEquipment dict={dict.equipment} />
      <Storyline dict={dict.story} common={dict.common} />
      <Founders dict={dict.founders} />
      <FAQ dict={dict.faq} common={dict.common} />
    </>
  );
}
