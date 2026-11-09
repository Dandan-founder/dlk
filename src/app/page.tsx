import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";
import { Showcase } from "@/components/sections/Showcase";
import { Process } from "@/components/sections/Process";
import { Differentials } from "@/components/sections/Differentials";
import { Plans } from "@/components/sections/Plans";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";

export default function Home() {
  return (
    <>
      {/* O hero fica preso e a seção Sobre sobe por cima, como uma folha */}
      <div className="relative">
        <Hero />
        <About />
      </div>
      <Services />
      <Work />
      <Showcase />
      <Process />
      <Differentials />
      <Plans />
      <Faq />
      <FinalCta />
    </>
  );
}
