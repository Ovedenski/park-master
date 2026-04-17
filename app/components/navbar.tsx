"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import ThemeToggle from "./theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { categories } from "@/lib/categories";

const leftLinks = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

const rightLinks = [{ href: "/account", label: "Account" }];

export default function NavbarMenu() {
  const pathname = usePathname();
  const [hash, setHash] = React.useState("");

  React.useEffect(() => {
    const updateHash = () => {
      setHash(window.location.hash);
    };

    updateHash();
    window.addEventListener("hashchange", updateHash);

    return () => {
      window.removeEventListener("hashchange", updateHash);
    };
  }, []);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/" && hash === "";
    }

    if (href.startsWith("/#")) {
      return pathname === "/" && hash === href.replace("/", "");
    }

    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  // const isActive = (href: string) => {
  //   if (href === "/") return pathname === "/"
  //   if (href.startsWith("/#")) return pathname === "/"
  //   return pathname.startsWith(href)
  // }

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        {/* Mobile left */}
        <div className="flex md:hidden">
          <MobileMenu pathname={pathname} />
        </div>

        {/* Left desktop */}
        <div className="hidden min-w-0 flex-1 items-center gap-6 md:flex">
          {leftLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              active={false}
              //active={isActive(link.href)}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Center logo */}
        <div className="flex shrink-0 justify-center px-4">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight transition-colors hover:text-primary"
          >
            ParkMaster
          </Link>
        </div>

        {/* Right desktop */}
        <div className="hidden min-w-0 flex-1 items-center justify-end gap-4 md:flex">
          <BrowseDropdown />

          <Button asChild size="sm" className="rounded-full px-5">
            <Link href="/list-spot">List your spot</Link>
          </Button>

          {rightLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              active={isActive(link.href)}
            >
              {link.label}
            </NavLink>
          ))}

          <ThemeToggle />
        </div>

        {/* Mobile right */}
        <div className="flex md:hidden">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

function BrowseDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-1 px-2 text-sm font-medium">
          Browse
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link href="/listings">All listings</Link>
        </DropdownMenuItem>

        {categories.map((category) => (
          <DropdownMenuItem asChild key={category.slug}>
            <Link href={`/listings/${category.slug}`}>{category.label}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileMenu({ pathname }: { pathname: string }) {
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[280px] sm:w-[320px]">
        <SheetTitle className="sr-only">Navigation menu</SheetTitle>

        <div className="mt-8 flex flex-col gap-2">
          {leftLinks.map((link) => (
            <SheetClose asChild key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-muted hover:text-primary",
                  isActive(link.href) && "bg-muted text-primary",
                )}
              >
                {link.label}
              </Link>
            </SheetClose>
          ))}

          <SheetClose asChild>
            <Link
              href="/listings"
              className={cn(
                "rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-muted hover:text-primary",
                pathname.startsWith("/listings") && "bg-muted text-primary",
              )}
            >
              Browse
            </Link>
          </SheetClose>

          <div className="mt-2 space-y-1 pl-3">
            {categories.map((category) => (
              <SheetClose asChild key={category.slug}>
                <Link
                  href={`/listings/${category.slug}`}
                  className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                >
                  {category.label}
                </Link>
              </SheetClose>
            ))}
          </div>

          <SheetClose asChild>
            <Link
              href="/account"
              className={cn(
                "rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-muted hover:text-primary",
                pathname.startsWith("/account") && "bg-muted text-primary",
              )}
            >
              Account
            </Link>
          </SheetClose>
        </div>

        <div className="mt-6">
          <SheetClose asChild>
            <Button asChild className="w-full rounded-full">
              <Link href="/list-spot">List your spot</Link>
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
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
        "group relative text-sm font-medium transition-colors hover:text-primary",
        active && "text-primary",
      )}
    >
      {children}
      <span
        className={cn(
          "absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-primary transition-transform duration-300",
          active && "scale-x-100",
          "group-hover:scale-x-100",
        )}
      />
    </Link>
  );
}
