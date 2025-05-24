import Header from "../components/header";
import { Textarea } from "@/components/ui/textarea";
import { Bold, Image, Play, Code, Underline, Italic, Strikethrough, List, ListOrdered, Link, Pen } from "lucide-react";
import InputWithIcon from "@/components/design-system/input-with-icon";

function BlogWriting() {
  return (
    <div>
      <Header />
      <div className="p-4 flex flex-col gap-4 w-[70%] mx-auto">
        <span className="text-3xl font-semibold">Blog Writing</span>
        <div className="flex flex-col gap-3">
          <InputWithIcon placeholder="Title" className="!text-2xl font-semibold !py-8 " icon={<Pen size={20} className="text-black"/>} />
          <Textarea placeholder="Content" />
          <div className="flex flex-row gap-2">
            <Image />
            <Play />
            <Code /> 
            <Bold />
            <Underline />
            <Italic />
            <Strikethrough />
            <List />
            <ListOrdered />
            <Link /> 
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogWriting;
