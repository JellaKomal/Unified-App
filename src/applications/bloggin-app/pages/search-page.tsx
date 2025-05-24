import { Badge } from "@/components/ui/badge";
import InputWithIcon from "@/components/design-system/input-with-icon";
import { Search } from "lucide-react";
import Pagination from "../components/pagination";
import { ScrollWrapper } from "@/components/design-system/scroll-wrapper";
import BloggingLayout from "../components/blogging-layout";
import { WhiteBackgroundWrapper } from "../components/white-background-wrapper";
import { useNavigate } from "react-router-dom";

function SearchPage() {
  return (
    <BloggingLayout showBackground={true}>
      <WhiteBackgroundWrapper fullWidth>
        <InputWithIcon icon={<Search size={16} />} placeholder="Search Query" />
      </WhiteBackgroundWrapper>
      <WhiteBackgroundWrapper fullWidth>
        <span className="text-3xl font-semibold">Search Results</span>
      </WhiteBackgroundWrapper>
      <WhiteBackgroundWrapper fullWidth className="flex gap-3">
        <Badge>Relevance</Badge>
        <Badge>Date</Badge>
      </WhiteBackgroundWrapper>

      <ScrollWrapper
        className="h-[calc(100vh-300px)]"
        childrenClassName="flex flex-col gap-3"
      >
        <WhiteBackgroundWrapper fullWidth>
          <SearchResult />
        </WhiteBackgroundWrapper>
        <WhiteBackgroundWrapper fullWidth>
          <SearchResult />
        </WhiteBackgroundWrapper>
        <WhiteBackgroundWrapper fullWidth>
          <SearchResult />
        </WhiteBackgroundWrapper>
        <WhiteBackgroundWrapper fullWidth>
          <SearchResult />
        </WhiteBackgroundWrapper>
        <WhiteBackgroundWrapper fullWidth>
          <SearchResult />
        </WhiteBackgroundWrapper>
      </ScrollWrapper>
      <div className="flex justify-center">
        <Pagination />
      </div>
    </BloggingLayout>
  );
}

const SearchResult = () => {
  const navigate = useNavigate();
  return (
    <div className="flex gap-3">
      <img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsqnOoDU1jZEuEr5YTV45cXfSpRb6-tdFadhDUTRecDWwzulAyiOKeawk8DtiT7JdY3q1qYFiP4YlhH6U6JYgpuo-WoiqaY3yjJcQWYPjo5I06VHDz2CNDVUN2xfkY65WWLrb-qXcCV-hgHZPxKhjKILlBlezIYbmQttMN5hUiEyDOmhoAhhWlh0XG3MGGV0zMwj2V6b3B0zQII3TmG_hyhe7UWv2IWH80nP_flzBziQBXfqNbFeWrlev2Xir1MRLAK90t9RF_-VU"
        alt=""
        className="w-30 h-30 rounded-xl cursor-pointer"
        onClick={() => navigate("/blogging-app/blog")}
      />
      <div className="flex flex-col gap-0.5">
        <span
          className="text-xl font-semibold cursor-pointer"
          onClick={() => navigate("/blogging-app/blog")}
        >
          The Future of Artificial Intelligence
        </span>
        <span className="text-gray-500">
          Published on January 1, 2024 by Alex Turner
        </span>
        <span className="text-gray-500">
          A comprehensive guide to the latest advancements in artificial
          intelligence, covering machine learning, neural networks, and their
          applications in various industries.
        </span>
      </div>
    </div>
  );
};

export default SearchPage;
