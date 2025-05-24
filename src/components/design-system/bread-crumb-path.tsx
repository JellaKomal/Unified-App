import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { BreadcrumbSeparator } from "@/components/ui/breadcrumb";

function BreadCrumbPath({
  path,
  activePath,
}: {
  path: string[];
  activePath: string;
}) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {path.map((item) => (
          <>
            <BreadcrumbItem key={item}>
              <BreadcrumbLink>{item}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
          </>
        ))}
        <BreadcrumbItem>
          <BreadcrumbPage>{activePath}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default BreadCrumbPath;
