import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre Nós" },
  { href: "/programas", label: "Programas" },
  { href: "/galeria", label: "Galeria" },
  { href: "/apoie", label: "Apoie" },
  { href: "/noticias", label: "Notícias" },
  { href: "/contato", label: "Contato" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const isHome = location === "/";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled || !isHome
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border/40"
          : "bg-transparent"
      )}
    >
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
              scrolled || !isHome ? "bg-forest" : "bg-white/20 border border-white/40"
            )}>
              <Leaf className={cn(
                "w-5 h-5 transition-colors",
                scrolled || !isHome ? "text-white" : "text-white"
              )} />
            </div>
            <div className="leading-tight">
              <span className={cn(
                "block font-serif font-semibold text-base tracking-tight transition-colors",
                scrolled || !isHome ? "text-forest-dark" : "text-white"
              )}>
                Instituto Ubatuba
              </span>
              <span className={cn(
                "block text-xs tracking-[0.12em] uppercase transition-colors",
                scrolled || !isHome ? "text-earth" : "text-white/70"
              )}>
                Santuário Ecológico
              </span>
            </div>
          </Link>

          {/* Nav Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium tracking-wide rounded-sm transition-all duration-200",
                  location === link.href
                    ? scrolled || !isHome
                      ? "text-forest bg-accent"
                      : "text-white bg-white/15"
                    : scrolled || !isHome
                    ? "text-foreground/70 hover:text-forest hover:bg-accent/60"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/apoie"
              className={cn(
                "px-6 py-2.5 text-sm font-semibold rounded-sm tracking-wide transition-all duration-200",
                scrolled || !isHome
                  ? "bg-forest text-white hover:bg-forest-dark shadow-sm hover:shadow-md hover:shadow-forest/20"
                  : "bg-white text-forest hover:bg-white/90"
              )}
            >
              Apoie o Instituto
            </Link>
          </div>

          {/* Menu Mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={cn(
              "lg:hidden p-2 rounded-sm transition-colors",
              scrolled || !isHome ? "text-foreground hover:bg-accent" : "text-white hover:bg-white/10"
            )}
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile Dropdown */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 ease-out bg-white border-t border-border/40",
          menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="container py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-3 text-sm font-medium rounded-sm transition-colors",
                location === link.href
                  ? "text-forest bg-accent font-semibold"
                  : "text-foreground/70 hover:text-forest hover:bg-accent/60"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/apoie"
            className="mt-2 px-4 py-3 bg-forest text-white text-sm font-semibold rounded-sm text-center hover:bg-forest-dark transition-colors"
          >
            Apoie o Instituto
          </Link>
        </nav>
      </div>
    </header>
  );
}
