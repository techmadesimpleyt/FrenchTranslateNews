import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/ks3", label: "KS3" },
    { href: "/gcse", label: "GCSE" },
    { href: "/as", label: "AS Level" },
  ];

  return (
    <nav className="bg-primary shadow-lg">
      <div className="container mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          <Link href="/">
            <a className="text-2xl font-bold text-white tracking-tight">
              News Translator
            </a>
          </Link>

          <div className="flex gap-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a
                  className={cn(
                    "text-base font-medium transition-colors hover:text-white/90",
                    location === item.href 
                      ? "text-white" 
                      : "text-white/70"
                  )}
                >
                  {item.label}
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}