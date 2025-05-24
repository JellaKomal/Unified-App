import HeroSectionSimpleCentred from "./hero-section";
import AnimatingCards from "./animating-cards";

export default function Page() { 

  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      <HeroSectionSimpleCentred />
      <AnimatingCards />
    </div>
  );
}
