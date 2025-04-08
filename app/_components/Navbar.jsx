"use client";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

const publicMenuList = [
  { id: 0, name: "Home", path: "/" },
  { id: 1, name: "Features", path: "#features" },
  { id: 2, name: "FAQ", path: "#faq" },
  { id: 3, name: "Testimonials", path: "#testimonials" },
];

const userMenuList = [
  { id: 0, name: "Home", path: "/" },
  { id: 1, name: "My Forms", path: "/my-forms" },
  { id: 2, name: "Responses", path: "/responses" },
  { id: 3, name: "Templates", path: "/templates" },
  // { id: 3, name: "Analytics", path: "/analytics" },
];

export const Navbar = () => {
  const { isSignedIn } = useUser();
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentTheme(theme === "system" ? systemTheme : theme);
  }, [theme, systemTheme]);

  if (!mounted) return null;

  return (
    !path.includes("aiform") && (
      <nav className="w-full fixed top-0 left-0 z-50 border-b bg-background h-18 ">
        <div className="max-w-[1376px] mx-auto w-full px-4 md:px-8 py-4 ">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <Image
                src={
                  currentTheme === "dark" ? "/logo-dark.svg" : "/logo-light.svg"
                }
                width={118}
                height={36}
                alt="logo"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {isSignedIn ? (
                <>
                  {userMenuList.map((menu) => (
                    <Link
                      key={menu.id}
                      href={menu.path}
                      className={`text-sm font-semibold text-muted-foreground hover:text-foreground ${
                        path === menu.path && "text-primary"
                      }`}
                    >
                      {menu.name}
                    </Link>
                  ))}
                  <Button variant="outline">Request a feature</Button>
                  <UserButton
                    appearance={{ elements: { avatarBox: "w-9 h-9" } }}
                  />
                </>
              ) : (
                <>
                  {publicMenuList.map((menu) => (
                    <Link
                      key={menu.id}
                      href={menu.path}
                      className="text-sm font-semibold text-muted-foreground hover:text-foreground"
                    >
                      {menu.name}
                    </Link>
                  ))}
                  <SignInButton>
                    <Button>Sign in</Button>
                  </SignInButton>
                  <SignUpButton>
                    <Button variant="outline">Sign up</Button>
                  </SignUpButton>
                </>
              )}

              {/* Theme Toggle (Desktop) */}
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setTheme(currentTheme === "dark" ? "light" : "dark")
                }
                className="rounded-full"
              >
                {currentTheme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-4">
              {/* Theme Toggle (Mobile) */}
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setTheme(currentTheme === "dark" ? "light" : "dark")
                }
                className="rounded-full"
              >
                {currentTheme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-full"
              >
                {isOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>

              {isSignedIn && (
                <UserButton
                  appearance={{ elements: { avatarBox: "w-9 h-9" } }}
                />
              )}
            </div>
          </div>

          {/* Mobile Navigation Drawer */}
          {isOpen && (
            <div className="fixed z-40" onClick={() => setIsOpen(false)}>
              <div className="fixed top-[69px] h-lvh left-1/2 -translate-x-1/2 w-full bg-background shadow-lg px-6 py-8 flex flex-col items-center gap-4 z-50">
                {isSignedIn ? (
                  <>
                    {userMenuList.map((menu) => (
                      <Link
                        key={menu.id}
                        href={menu.path}
                        className="text-lg font-semibold text-muted-foreground hover:text-foreground"
                        onClick={() => setIsOpen(false)}
                      >
                        {menu.name}
                      </Link>
                    ))}
                    <div className="w-full py-4">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setIsOpen(false)}
                      >
                        Request a feature
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {publicMenuList.map((menu) => (
                      <Link
                        key={menu.id}
                        href={menu.path}
                        className="text-sm font-semibold text-muted-foreground hover:text-foreground"
                        onClick={() => setIsOpen(false)}
                      >
                        {menu.name}
                      </Link>
                    ))}

                    <div className="flex flex-col gap-4 w-full">
                      <SignInButton>
                        <Button onClick={() => setIsOpen(false)}>
                          Sign in
                        </Button>
                      </SignInButton>
                      <SignUpButton>
                        <Button
                          variant="outline"
                          onClick={() => setIsOpen(false)}
                        >
                          Sign up
                        </Button>
                      </SignUpButton>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    )
  );
};
