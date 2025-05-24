import { Link, type RouteObject } from "react-router-dom";
import { cn } from "@/lib/utils"; // shadcn's utility for className
import {DottedBackground} from "@/components/backgrounds/dotted-background";
interface ApplicationsProps {
  routes: RouteObject[];
}

function Applications({ routes }: ApplicationsProps) {
  // Helper function to flatten routes and include children
  const getAllPaths = (
    route: RouteObject,
    parentPath = ""
  ): { path: string; display: string }[] => {
    const basePath = route.path
      ? `${parentPath}/${route.path}`.replace(/\/\/+/g, "/")
      : parentPath;
    const paths = [
      { path: basePath, display: basePath || "/price-tracking-app" },
    ];

    if (route.children) {
      return paths.concat(
        route.children.flatMap((child) => getAllPaths(child, basePath))
      );
    }
    return paths;
  };

  // Flatten all routes into a list of paths
  const allPaths = routes.flatMap((route) => getAllPaths(route));

  return (
    <div>
      <DottedBackground />
      <div className="flex flex-col gap-2 p-5">
        <span className="text-lg font-bold bg-white ">
          List of Applications Urls
        </span>
        <ul className="flex flex-col gap-1">
          {allPaths.map((item, index) => (
            <li key={index} className="inline-flex self-start">
              <span className="inline-block bg-white px-2 py-1 rounded-md ">
                <Link
                  to={item.path}
                  className={cn(
                    "inline-block text-[hsl(var(--foreground))] hover:bg-[hsl(var(--primary)/0.1)] hover:text-[hsl(var(--primary))] transition-colors duration-200"
                  )}
                >
                  {item.display}
                </Link>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Applications;
