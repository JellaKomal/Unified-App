import BreadCrumbPath from "@/components/design-system/bread-crumb-path";
import BloggingLayout from "../components/blogging-layout";
import { Button } from "@/components/ui/button";
import { WhiteBackgroundWrapper } from "../components/white-background-wrapper";
import { ScrollWrapper } from "@/components/design-system/scroll-wrapper";

export default function CoursePage() {
  const courses = [
    {
      title: "Part 1: Building a SaaS Application",
      description:
        "Learn how to build a SaaS application using React, Next.js, and Tailwind CSS.",
    },
    {
      title: "Part 2: Building a SaaS Application",
      description:
        "Learn how to build a SaaS application using React, Next.js, and Tailwind CSS.",
    },
    {
      title: "Part 3: Building a SaaS Application",
      description:
        "Learn how to build a SaaS application using React, Next.js, and Tailwind CSS.",
    },
  ];
  return (
    <BloggingLayout showBackground>
      <div className="flex flex-col gap-4">
        <WhiteBackgroundWrapper fullWidth className="p-2">
          <BreadCrumbPath path={["Course"]} activePath="Course" />
        </WhiteBackgroundWrapper>
        <WhiteBackgroundWrapper fullWidth className="px-2">
          <div className="flex flex-col gap-4">
            <span className="text-3xl font-bold">
              Building a SaaS Application
            </span>
            <span className="text-sm text-muted-foreground">
              Learn how to build a SaaS application using React, Next.js, and
              Tailwind CSS.
            </span>
          </div>
        </WhiteBackgroundWrapper>

        <WhiteBackgroundWrapper fullWidth className="p-2">
          <ScrollWrapper className="h-[calc(100vh-250px)]">
            <div className="flex flex-col gap-4">
              {courses.map((course) => (
                <CourseCard key={course.title} {...course} />
              ))}
            </div>
          </ScrollWrapper>
        </WhiteBackgroundWrapper>
      </div>
    </BloggingLayout>
  );
}

const CourseCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-row gap-2 justify-between items-center">
      <div className="flex flex-col">
        <span className="font-bold">{title}</span>
        <span>{description}</span>
      </div>
      <Button variant="outline">Read</Button>
    </div>
  );
};
