import { Skeleton } from "../../../components/ui/skeleton";
import { Button } from "../../../components/ui/button";
import { PriceChart } from "./price-chart";

function TrackProduct() {
  return (
    <div className="w-full flex flex-col gap-6 p-10">
      <span className="text-3xl font-semibold">Sneaker off-white</span>
      <div className="flex gap-5">
        <Skeleton className="w-[50%] h-[220px]" />
        <div className="flex flex-col gap-2">
          <span>Description</span>
          <span>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente
            vel, rem, esse totam sit magnam sint quo obcaecati numquam illum
            facilis delectus debitis 
          </span>
          <span>Lowest price</span>
          <span>Highest price</span>
          <span>Current price</span>
          <div>
            <Button>Track Item</Button>
          </div>
        </div>
      </div>
      <div>
        <PriceChart />
      </div>
    </div>
  );
}

export default TrackProduct;
