import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LibraryBig } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 w-full items-center justify-between bg-background px-4 md:px-6">
      {/* Left: Logo */}
      <Link
        to="/blogging-app"
        className="flex items-center gap-2 text-lg font-semibold sm:text-base"
      >
        <LibraryBig className="h-6 w-6" />
        <span className="sr-only">Acme Inc</span>
      </Link>

      {/* Center: Nav links (absolutely centered) */}
      <nav className="absolute left-1/2 transform -translate-x-1/2 hidden sm:flex font-medium flex-row items-center gap-5 text-sm lg:gap-6">
        <Link to="/blogging-app/search" className="text-muted-foreground">
          Search
        </Link>
        <Link to="/blogging-app/blog-writing" className="text-muted-foreground">
          Writing
        </Link>
        <Link to="/blogging-app/course" className="text-muted-foreground">
          Course
        </Link>
        <Link to="/" className="text-muted-foreground">
          Company
        </Link>
      </nav>

      {/* Right: Auth buttons */}
      <div className="hidden items-center gap-2 lg:flex">
        {/* <Button variant="ghost">Sign In</Button> */}
        {/* <Button>Sign Up</Button> */}
        <Avatar
          onClick={() => navigate("/blogging-app/profile")}
          className="cursor-pointer"
        >
          <AvatarImage
            src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png"
            alt="@shadcn"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

export default Header;
