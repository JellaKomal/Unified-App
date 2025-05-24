import BreadCrumbPath from "@/components/design-system/bread-crumb-path";
import BloggingLayout from "../components/blogging-layout";
import { WhiteBackgroundWrapper } from "../components/white-background-wrapper";
import { ScrollWrapper } from "@/components/design-system/scroll-wrapper";

export default function BlogPage() {
  return (
    <BloggingLayout showBackground className="flex flex-row">
      <div className="w-[80%]">
        <WhiteBackgroundWrapper className="pl-1 pr-10 py-1">
          <BreadCrumbPath path={["Home"]} activePath="Tech" />
        </WhiteBackgroundWrapper>
        <WhiteBackgroundWrapper fullWidth>
          <ScrollWrapper className="h-[calc(100vh-130px)]" childrenClassName="flex flex-col gap-2">
            <span className="text-3xl font-bold">
              The Future of Quantum Computing: A Deep Dive
            </span>
            <div className="flex gap-2 text-primary/50 text-sm">
              <span>By Alex Turner</span>
              <span>Published on January 1, 2024</span>
            </div>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJsvQjcd92-2FpzNo7GnJFr9zDyrunHPp8kr6oHZNbDthEb6RUpUWEynN_t7LZK0paedJn_GegHaCJVENDeAcQathKyJU28fltgbc3Txtkz8y7ksgJlblmrmn8DahYiM31RHFwME8YAfF6eaBIs-QFYvN3N82TfY1M0ouZeuWca6Ci-T-H1upLMa_3Fi4nZz6rh2VEmziw7BjTPG2tV1-cTGGGmznTCQe41nRcIlDs-tYFYAbSvGunmMkN49xBMWuza7mo4YHSqFM"
              alt=""
              className="w-full h-[500px] object-cover"
            />
            <p className="text-[#121416]  font-normal leading-normal pb-3 pt-1 px-4">
              Quantum computing represents a paradigm shift in computational
              power, moving beyond the limitations of classical computers.
              Unlike classical bits that store information as 0s or 1s, quantum
              bits, or qubits, can exist in a superposition of both states
              simultaneously. This allows quantum computers to explore multiple
              possibilities at once, leading to exponential speedups for certain
              types of problems.
            </p>
            <p className="text-[#121416] text-base font-normal leading-normal pb-3 pt-1 px-4 bg-white">
              One of the most promising applications of quantum computing is in
              cryptography. Current encryption methods, such as RSA, rely on the
              difficulty of factoring large numbers. However, quantum computers,
              using algorithms like Shor's algorithm, could potentially break
              these encryption schemes in a matter of hours, posing a
              significant threat to data security. This has spurred research
              into quantum-resistant cryptography, aiming to develop encryption
              methods that are secure even against quantum attacks.
            </p>
            <p className="text-[#121416] text-base font-normal leading-normal pb-3 pt-1 px-4">
              Another area where quantum computing could have a profound impact
              is drug discovery and materials science. Simulating molecular
              interactions at the quantum level is computationally intractable
              for classical computers. Quantum computers, however, could
              accurately model these interactions, enabling the design of new
              drugs and materials with unprecedented properties. This could lead
              to breakthroughs in areas such as personalized medicine, energy
              storage, and advanced manufacturing.
            </p>
            <p className="text-[#121416] text-base font-normal leading-normal pb-3 pt-1 px-4">
              Despite the immense potential, quantum computing is still in its
              early stages of development. Building and maintaining qubits is a
              significant engineering challenge, as they are extremely sensitive
              to environmental noise. Furthermore, developing quantum algorithms
              and software is a complex task that requires a new way of thinking
              about computation. However, with ongoing research and investment,
              quantum computing is poised to revolutionize various fields and
              reshape our technological landscape.
            </p>
          </ScrollWrapper>
        </WhiteBackgroundWrapper>
      </div>
      <div className="w-[20%] flex flex-col gap-3 p-2 ">
        <WhiteBackgroundWrapper>
          <span className="text-2xl font-bold">Related Posts</span>
        </WhiteBackgroundWrapper>
        <div className="flex flex-col gap-2">
          <RelatedPost />
          <RelatedPost />
          <RelatedPost />
          <RelatedPost />
          <RelatedPost />
        </div>
      </div>
    </BloggingLayout>
  );
}

const RelatedPost = () => {
  return (
    <WhiteBackgroundWrapper className="flex flex-row gap-2">
      <div className="min-w-[24px] min-h-[24px]">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJsvQjcd92-2FpzNo7GnJFr9zDyrunHPp8kr6oHZNbDthEb6RUpUWEynN_t7LZK0paedJn_GegHaCJVENDeAcQathKyJU28fltgbc3Txtkz8y7ksgJlblmrmn8DahYiM31RHFwME8YAfF6eaBIs-QFYvN3N82TfY1M0ouZeuWca6Ci-T-H1upLMa_3Fi4nZz6rh2VEmziw7BjTPG2tV1-cTGGGmznTCQe41nRcIlDs-tYFYAbSvGunmMkN49xBMWuza7mo4YHSqFM"
          alt="Fixed size image"
          className="rounded-xl !h-20 !w-50 object-cover"
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-xs">The Future of Quantum Computing: A Deep Dive</p>
        <p className="text-xs text-primary/50">Tech</p>
      </div>
    </WhiteBackgroundWrapper>
  );
};
