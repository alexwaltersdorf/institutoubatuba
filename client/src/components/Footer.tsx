import { Link } from "wouter";
import { Leaf, Mail, MapPin, Phone, Instagram, Facebook, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-forest-dark text-white/80">
      {/* Linha dourada decorativa */}
      <div className="h-px bg-gradient-to-r from-transparent via-earth to-transparent opacity-60" />

      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Coluna 1 — Identidade */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-forest-light/30 border border-white/20 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="block font-serif font-semibold text-white text-base">Instituto Ubatuba</span>
                <span className="block text-xs tracking-[0.12em] uppercase text-white/50">Santuário Ecológico</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/60 mb-6">
              Promovendo a conservação socioambiental de Ubatuba por meio de parcerias, educação e inclusão social, alinhados à Agenda 2030.
            </p>
            {/* Redes sociais */}
            <div className="flex items-center gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-white/40 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-white/40 transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-white/40 transition-all">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Coluna 2 — Navegação */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-[0.12em] uppercase mb-5">Navegação</h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Início" },
                { href: "/sobre", label: "Sobre Nós" },
                { href: "/programas", label: "Programas e Projetos" },
                { href: "/galeria", label: "Galeria" },
                { href: "/noticias", label: "Notícias" },
                { href: "/contato", label: "Contato" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3 — Apoio */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-[0.12em] uppercase mb-5">Como Apoiar</h4>
            <ul className="space-y-3">
              {[
                { href: "/apoie#voluntariado", label: "Voluntariado" },
                { href: "/apoie#doacoes", label: "Doações" },
                { href: "/apoie#parcerias", label: "Parcerias" },
                { href: "/apoie#empresas", label: "Empresas Parceiras" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Link
                href="/apoie"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-earth/80 text-white text-sm font-semibold rounded-sm hover:bg-earth transition-colors"
              >
                Faça uma Doação
              </Link>
            </div>
          </div>

          {/* Coluna 4 — Contato */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-[0.12em] uppercase mb-5">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-earth mt-0.5 shrink-0" />
                <span className="text-sm text-white/60">
                  Ubatuba, São Paulo — Brasil<br />
                  Litoral Norte do Estado
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-earth shrink-0" />
                <a href="mailto:ubatuba@institutoubatuba.org" className="text-sm text-white/60 hover:text-white transition-colors">
                  ubatuba@institutoubatuba.org
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-earth shrink-0" />
                <span className="text-sm text-white/60">(12) 99999-0000</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Instituto Ubatuba Santuário Ecológico. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40">Alinhado à</span>
            <span className="text-xs font-semibold text-earth/80 tracking-wide">ODS 18 — Bem-estar Animal</span>
            <span className="text-xs text-white/40">·</span>
            <span className="text-xs text-white/40">Agenda 2030</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
