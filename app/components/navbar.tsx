// import Link from "next/link";

// import {
//   NavigationMenu,
//   NavigationMenuList,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   navigationMenuTriggerStyle,
// } from "@/components/ui/navigation-menu";
// import ThemeToggle from "./theme-toggle";

// export default function NavbarMenu() {
//   return (
//     <NavigationMenu>
//       <NavigationMenuList>
//         <NavigationMenuItem>
//           <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
//             <Link href="/">Home</Link>
//           </NavigationMenuLink>
//           <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
//             <Link href="/about">About</Link>
//           </NavigationMenuLink>
//           <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
//             <ThemeToggle />
//           </NavigationMenuLink>
//         </NavigationMenuItem>
//       </NavigationMenuList>
//     </NavigationMenu>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./theme-toggle";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export default function NavbarMenu() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  const linkStyles = (href: string) =>
    cn(
      "relative text-sm font-medium transition-colors",
      "hover:text-primary",
      isActive(href) && "text-primary",
    );

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-around">
        {/* LEFT (Desktop) */}
        <div className="hidden md:flex gap-8">
          <NavLink href="/" active={isActive("/")}>
            Home
          </NavLink>
          <NavLink href="/about" active={isActive("/about")}>
            About
          </NavLink>
          <NavLink href="/contact" active={isActive("/contact")}>
            Contact
          </NavLink>
        </div>

        {/* CENTER LOGO */}
        <div className="absolute left-1/2 -translate-x-1/2 text-lg font-bold">
          <Link href="/">ParkingApp</Link>
        </div>

        {/* RIGHT (Desktop) */}
        <div className="hidden md:flex gap-8">
          <NavLink href="/garages" active={isActive("/garages")}>
            Гаражи
          </NavLink>
          <NavLink href="/parking-spots" active={isActive("/parking-spots")}>
            Паркоместа
          </NavLink>
        </div>

        {/* MOBILE */}
        <div className="md:hidden ml-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-black">
              <SheetTitle></SheetTitle>
              <SheetDescription></SheetDescription>
              <div className="flex flex-col gap-6 mt-10 ml-2 text-lg font-medium">
                <Link href="/">Home</Link>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/garages">Гаражи</Link>
                <Link href="/parking-spots">Паркоместа</Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative text-sm font-medium transition-colors hover:text-primary",
        active && "text-primary",
      )}
    >
      {children}

      {/* Hover + Active underline */}
      <span
        className={cn(
          "absolute -bottom-1 left-0 h-2px w-full origin-left scale-x-0 bg-primary transition-transform duration-300",
          active && "scale-x-100",
          "group-hover:scale-x-100",
        )}
      />
    </Link>
  );
}
