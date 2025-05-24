import React from "react";
import HeroSection from "../components/hero-section";
import AnimatingCards from "../components/animating-cards";

function HomePage() {
  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      <HeroSection />
      <AnimatingCards />
    </div>
  );
}

export default HomePage;
