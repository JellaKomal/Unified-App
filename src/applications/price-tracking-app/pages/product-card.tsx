import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";

function ProductCard() {
  return (
    <Card className="border-none">
      <CardContent className="flex gap-2">
        <Skeleton className="w-[150px] h-[150px] " />
        <div className="w-[150px] flex flex-col justify-between">
          <div className="flex flex-col">
            <div className="flex flex-col gap-0.5">
              <span className="text-nowrap">Snickers Off-white</span>
              <span>2024</span>
            </div>
          </div>
          <div className="flex justify-end items-end">
            <span className="text-xl font-semibold">$38.50</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductCard;
