import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react"; 

export default function HeroSection() {
  return (
    <>
      <div>
        <div className="container mx-auto flex flex-col gap-10 px-4 py-24 md:px-6 lg:py-32 2xl:max-w-[1400px]">
          <div className="mx-auto mt-5 max-w-2xl text-center">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Track All Products Prices in Real-Time
            </h1>
            <div className="mx-auto mt-2 max-w-3xl text-center">
              <p className="text-muted-foreground text-xl">
                "Never miss a deal again. Get notified when prices drop."
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center w-full">
            <div className="flex w-full max-w-3xl items-center gap-4 px-6 py-4 ">
              <div className="relative flex-1">
                <Input
                  placeholder="Enter product name or paste link"
                  className="peer pl-9 text-sm"
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground peer-disabled:opacity-50">
                  <Search size={16} aria-hidden="true" className="text-black" />
                </div>
              </div>
              <Button className="whitespace-nowrap">Track Price</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
