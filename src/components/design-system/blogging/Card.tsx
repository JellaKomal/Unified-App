import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Map, TreePalm, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
export function CardWithForm() {
  return (
    <Card className="w-[400px]">
      <CardHeader className="flex justify-between">
        <div className="flex flex-col gap-2">
          <div>
            <Badge className="">Badge</Badge>
          </div>
          <CardTitle>Create project</CardTitle>
          <CardDescription className="flex flex-row gap-2">
            <span className="flex flex-row gap-1 items-center">
              <TreePalm size={16} /> Camp
            </span>
            <span className="flex flex-row gap-1 items-center">
              <Map size={16} /> London
            </span>
            <span className="flex flex-row gap-1 items-center">
              <User size={16} /> Alex
            </span>
          </CardDescription>
        </div>
        <div className="flex -space-x-[0.6rem]">
          <img
            className="ring-background rounded-full ring-2"
            src="https://originui.com/avatar-80-03.jpg"
            width={32}
            height={32}
            alt="Avatar 01"
          />
          <img
            className="ring-background rounded-full ring-2"
            src="https://originui.com/avatar-80-04.jpg"
            width={32}
            height={32}
            alt="Avatar 02"
          />
          <img
            className="ring-background rounded-full ring-2"
            src="https://originui.com/avatar-80-05.jpg"
            width={32}
            height={32}
            alt="Avatar 03"
          />
          <img
            className="ring-background rounded-full ring-2"
            src="https://originui.com/avatar-80-06.jpg"
            width={32}
            height={32}
            alt="Avatar 04"
          />
        </div>
      </CardHeader>
      <Separator />
      <CardContent>Pre-Production (2/4) Updated 4h ago</CardContent>
    </Card>
  );
}
