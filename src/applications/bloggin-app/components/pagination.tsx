import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { WhiteBackgroundWrapper } from "./white-background-wrapper";

function Pagination() {
  return (
    <WhiteBackgroundWrapper>
      <PaginationComponent>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" className="text-xs" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href="#"
              className="bg-primary/5 rounded-full mx-1 text-xs hover:bg-primary/20"
            >
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href="#"
              className="bg-primary/5 rounded-full mx-1 text-xs hover:bg-primary/20"
            >
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href="#"
              className="bg-primary/5 rounded-full mx-1 text-xs hover:bg-primary/20"
            >
              3
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href="#"
              className="bg-primary/5 rounded-full mx-1 text-xs hover:bg-primary/20s"
            >
              4
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href="#"
              className="bg-primary/5 rounded-full mx-1 text-xs hover:bg-primary/20"
            >
              10
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" className="text-xs" />
          </PaginationItem>
        </PaginationContent>
      </PaginationComponent>
    </WhiteBackgroundWrapper>
  );
}

export default Pagination;
