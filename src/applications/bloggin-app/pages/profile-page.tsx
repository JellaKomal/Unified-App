import BloggingLayout from "../components/blogging-layout";
import { WhiteBackgroundWrapper } from "../components/white-background-wrapper";
import { AvatarImage, Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  return (
    <BloggingLayout
      showBackground={true}
      className="flex flex-col gap-7 items-center"
    >
      <div className="flex flex-col items-center justify-center mt-15">
        <Avatar className="w-50 h-40">
          <AvatarImage
            src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png"
            alt="@shadcn"
            className="w-50 h-40"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <WhiteBackgroundWrapper>
        <span className="text-2xl font-bold">Sophia Bennet</span>
      </WhiteBackgroundWrapper>
      <WhiteBackgroundWrapper className="flex flex-col gap-2 items-center">
        <span className="text-primary/50">
          Software Engineer | Passionate about building scalable and efficient
          systems | Shadcn
        </span>
        <span className="text-primary/50">Joined on January 1, 2024</span>
      </WhiteBackgroundWrapper>
      <Button>Edit Profile</Button>
      <div className="flex  gap-5">
        <ProfileCards title="Followers" value={1200} />
        <ProfileCards title="Following" value={1200} />
        <ProfileCards title="Posts" value={1200} />
      </div>
    </BloggingLayout>
  );
}

const ProfileCards = ({ title, value }: { title: string; value: number }) => {
  return (
    <WhiteBackgroundWrapper className="flex flex-col gap-2 items-center border rounded-xl">
      <div className="flex flex-col justify-center items-center w-50 h-30">
        <span className="text-2xl font-bold">{value}</span>
        <span className="text-primary/50">{title}</span>
      </div>
    </WhiteBackgroundWrapper>
  );
};
