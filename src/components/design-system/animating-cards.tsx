import ProductCard from "../../applications/price-tracking-app/pages/product-card";

function AnimatingCards() {
  return (
    <div className="overflow-hidden relative group flex justify-center">
      {/* <div className="flex slide-left group-hover:paused-on-hover w-max"> */}
      <div className="flex items-center gap-5">
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </div>
    </div>
  );
}

export default AnimatingCards;
