import Header from "../components/header";
import Dropdown from "../components/dropdown";
import { DatePicker } from "@/components/design-system/datepicker";
import { ScrollWrapper } from "@/components/design-system/scroll-wrapper";
import Pagination from "../components/pagination";

export default function CategoriesPage() {
  const categories = [
    {
      name: "Programming",
      count: 10,
    },
    {
      name: "Web Development",
      count: 12,
    },
    {
      name: "AI",
      count: 15,
    },
    {
      name: "Machine Learning",
      count: 18,
    },
    {},
  ];
  const posts = [
    {
      heading: "Featured",
      title: "Mastering Python: A Comprehensive Guide",
      description:
        "Explore the fundamentals of Python programming, from basic syntax to advanced concepts like object-oriented programming and data structures.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAbCp1pwuZi43WtO5vJBPtqrEVSiypucT12XHP_4bheMuBcD4qQ9-7ut5YC5eCE43GHRgboE0JM1JkT85JEbk77zB1hDoBBCaztZOGAKQWQ4C9kOLyIQ5NTKObpMhFkMuVjHBJFMgT0hWV9bYCnnhTCKcN-jUbQz3fTdE6WT5pXagp1uOu9g2RaOFIfmjVIXaOV0f-fKvWhskFd6loHeqhShpTl_uJeb0B_SftKVXfvfWEgq5c8RM-n6DyRvKHG5hif46nuLbH0STg",
    },
    {
      heading: "Recent Posts",
      title: " Building Scalable Web Applications with Django",
      description:
        "Learn how to leverage the Django framework to create robust and scalable web applications, covering topics like database integration, user authentication, and deployment strategies.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBeaAdLrqJ7kjWD-69kP-jbEBtcEDbMtMz_riW6Yvy2ei3Kb6A6hSSiivd0ltH_5-Blw84h7BuiR9j2BbJXlwDL2Qz3vbT4NTZU6Eao3jggQ0tL3iGxfMMQ4Y3OUz6FGRDNyFsWmM0NTs2WxjwIPYWIWJEALbvKyaMmkg30WaOjONJoAr4bU5tKEqecPH7eUREXGCsm1oaWoAhNo_UMrDkJt2BmwE79dVL9buS_JF_Y1RoKowvACIBt7Si-IMEP8dsTbW9Rcr0zR5o",
    },
    {
      title: "Introduction to Data Science with R",
      description:
        "Get started with data science using the R programming language, including data manipulation, visualization, and statistical analysis techniques.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA08LJHdYZZ-CCJ8qdAwv90eiZ2DNRREH4yUnWFUslYJMMJIl1OgMcvp5luXmEZOXMUbG1bZEWZx5hp4fJgKw_OzdNTQOtnB_WgROpBwju_2qol4nF3pp0MJg6MnkCJyGHw7mdAr-TJcT5NlhQO1dmfc8qmLAXbBRRyNqYMNYBHNS561Ehjd7bQJiHcyVu6mRsVpj-I_khq-EW5yNp8BCCtOs0Bm7TT5QMuMCCRtXebrKDpClXaARbCjrZA_DBZx5GjLbi0hXuPf4g",
    },
    {
      title: "JavaScript Frameworks: React vs. Vue.js",
      description:
        "Compare and contrast two popular JavaScript frameworks, React and Vue.js, to help you choose the right tool for your next front-end development project.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAfrfXpmPAdmyIwSl5ZEkYm2FfFF_q4it_c1T2P0kS4zQ-4DxuEU7QmuFpovgF6uPvi45C6aUPdPnLcIVo6c4BAKo9pHeuhFk1RpJSHm53cxH1lAlKBJT9sWZHntWARYfhTBmXthcoNI13RhWsNp8agz-V60nNquuu7XMAxt6glZ2H58JAKTkSql940pqjaoYwysdT3FyAbE1jZ78HQovhtOfAU1nW9Brx5IDmvwPW3xweOpcbj7OMrrwiG43tb8zKKn1dtI_SOZCY",
    },
    {
      title: "Database Design Principles for Modern Applications",
      description:
        "Understand the key principles of database design, including normalization, indexing, and query optimization, to build efficient and reliable data storage solutions.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBjpvUTCI38guB2EpG615ZG8zUZGV7hDw69mJSUdy3isKSY8jrrFLe_Fn81ETR8g7a8ZFlIdN5Ot9c9C6ph9Nbsar-Wi-f8ls4wqOxVJFyk6bRlZhakICrrux7kClUv80Jrm6seWbfVS6LNkA6stSxLzAhiMbvHbiR-bLRg9WY8_NA0ltLGaHtquQTRBUhlCIHpZv2A3KT85-3OX4xOCQ4ypVOjMCvRcuP8FHswfhgSbfZOkEBPZ2zxGAIQ95IoqTLKjjydCNwxHnE",
    },
  ];
  return (
    <div>
      <Header />
      <div className="py-4 px-10 flex gap-10 mx-auto mt-[64px]">
        <div className="w-[20%] flex flex-col gap-4">
          <ScrollWrapper childrenClassName="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-lg font-semibold">Categories</span>
              <div className="flex flex-col gap-2">
                {categories.map((category) => (
                  <div className="flex flex-row justify-between text-sm">
                    <span>{category.name}</span>
                    <span>{category.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-lg font-semibold">Filters</span>
              <div className="flex flex-col gap-2">
                <span className="text-sm">Sort by</span>
                <Dropdown />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm">Date</span>
                <DatePicker />
              </div>
            </div>
          </ScrollWrapper>
        </div>
        <div className="w-full">
          <div className="px-2 pb-5">
            <span className="text-2xl font-semibold">Programming</span>
          </div>
          <ScrollWrapper className="h-[calc(100vh-13rem)] p-2">
            <div className="flex flex-col gap-4   ">
              {posts.map((post) => (
                <Post
                  heading={post.heading || ""}
                  title={post.title}
                  description={post.description}
                  image={post.image}
                />
              ))}
            </div>
          </ScrollWrapper>
          <div>
            <Pagination />
          </div>
        </div>
      </div>
    </div>
  );
}

const Post = ({
  heading,
  title,
  description,
  image,
}: {
  heading: string;
  title: string;
  description: string;
  image: string;
}) => {
  return (
    <div className="flex items-stretch justify-between gap-4 rounded-xl ">
      <div className="flex flex-col gap-1">
        <div className="flex flex-col">
          <p className="text-primary/60 text-sm font-normal leading-normal">
            {heading}
          </p>
          <p className=" text-base font-bold ">{title}</p>
        </div>
        <p className="text-primary/50 text-sm font-normal leading-normal">
          {description}
        </p>
      </div>
      <div className="min-w-[240px] min-h-[160px]">
        <img
          src={image}
          alt="Fixed size image"
          className="rounded-xl !h-40 !w-60 object-cover"
        />
      </div>
    </div>
  );
};
