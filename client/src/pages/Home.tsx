import { Link } from "wouter";
import { ArrowRight, Leaf, Users, Heart, BookOpen, Fish, TreePine, Waves, ChevronDown } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";

const HERO_IMAGE = "/manus-storage/ubatuba-hero_110ea313.jpg";
const PRAIA_IMAGE = "/manus-storage/ubatuba-praia_8ed0b366.jpg";
const NATUREZA_IMAGE = "/manus-storage/ubatuba-natureza_083c332c.png";

const impactNumbers = [
  { value: "160", label: "Crianças na Escolinha de Surfe", icon: Waves },
  { value: "120", label: "Crianças na Escolinha de Futebol", icon: Users },
  { value: "80", label: "Crianças no Futevôlei", icon: Heart },
  { value: "781", label: "Exames e Consultas Realizados", icon: BookOpen },
  { value: "3", label: "Bolsas de Estudo para Jovens", icon: Leaf },
];

const valores = [
  { icon: Users, title: "Colaboração", desc: "Construímos pontes entre comunidades, ciência e poder público para gerar impacto real e duradouro." },
  { icon: Leaf, title: "Responsabilidade Socioambiental", desc: "Cada ação é guiada pelo compromisso com a preservação dos ecossistemas e o bem-estar das pessoas." },
  { icon: Heart, title: "Inclusão e Equidade", desc: "Acreditamos que o acesso à natureza, à saúde e à educação é um direito de todos." },
  { icon: TreePine, title: "Inovação Compartilhada", desc: "Cocriamos soluções com a comunidade, integrando conhecimento científico e saberes locais." },
];

const programasDestaque = [
  {
    icon: Waves,
    title: "Escolinhas Esportivas",
    desc: "Surfe, futebol e futevôlei para crianças e jovens da comunidade, promovendo saúde, disciplina e conexão com o oceano.",
    href: "/programas",
    color: "text-ocean",
    bg: "bg-ocean/10",
  },
  {
    icon: Fish,
    title: "Projeto Itaguá Azul",
    desc: "Parceria para a conservação dos ecossistemas marinhos de Ubatuba, com limpeza de praias e educação ambiental.",
    href: "/programas",
    color: "text-forest",
    bg: "bg-forest/10",
  },
  {
    icon: Heart,
    title: "Ações de Saúde",
    desc: "Em parceria com a Total Quality Medicina Diagnóstica, oferecemos exames e consultas gratuitas para a comunidade.",
    href: "/programas",
    color: "text-earth",
    bg: "bg-earth/10",
  },
  {
    icon: BookOpen,
    title: "Educação e Cultura",
    desc: "Apoio à Feira Literária, Festival de Pipas e Festival de Escultura na Areia, fortalecendo a identidade cultural de Ubatuba.",
    href: "/programas",
    color: "text-forest-light",
    bg: "bg-forest-light/10",
  },
];

export default function Home() {
  const { data: posts } = trpc.posts.list.useQuery({ limit: 3, offset: 0 });

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Imagem de fundo */}
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Ubatuba — Santuário Ecológico"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 gradient-hero" />
          {/* Textura sutil */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-forest-dark/60" />
        </div>

        {/* Conteúdo */}
        <div className="relative container text-center text-white pt-20">
          <div className="max-w-4xl mx-auto">
            {/* Label */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-8 animate-fade-in">
              <Leaf className="w-3.5 h-3.5 text-white/80" />
              <span className="text-xs font-medium tracking-[0.15em] uppercase text-white/80">
                Ubatuba, São Paulo · ODS 18
              </span>
            </div>

            {/* Título principal */}
            <h1 className="font-serif text-5xl md:text-7xl font-medium leading-[1.1] mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Preservar a natureza<br />
              <em className="italic font-light">é preservar a vida</em>
            </h1>

            {/* Subtítulo */}
            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              O Instituto Ubatuba Santuário Ecológico promove a conservação socioambiental por meio de parcerias, educação e inclusão social — construindo um futuro sustentável para Ubatuba e região.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <Link
                href="/programas"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-forest font-semibold rounded-sm hover:bg-white/90 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98]"
              >
                Conheça nossos programas
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/apoie"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/60 text-white font-semibold rounded-sm hover:bg-white/10 hover:border-white transition-all duration-200 active:scale-[0.98]"
              >
                Apoie o Instituto
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>

      {/* ── Números de Impacto ── */}
      <section className="bg-forest py-16">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {impactNumbers.map((item, i) => (
              <div key={i} className="text-center text-white">
                <item.icon className="w-6 h-6 text-white/50 mx-auto mb-3" />
                <div className="font-serif text-4xl font-semibold text-white mb-1">{item.value}</div>
                <div className="text-xs text-white/60 leading-snug">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Missão ── */}
      <section className="section-padding bg-cream">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="section-label block mb-4">Nossa Missão</span>
              <h2 className="section-title mb-6">
                Conservação que transforma comunidades
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Promovemos a conservação socioambiental de Ubatuba e região por meio de parcerias multissetoriais que mobilizam conhecimentos científicos, recursos financeiros, tecnologia e participação comunitária.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Alinhados à Agenda 2030 e à <strong className="text-forest font-semibold">ODS 18 — Bem-estar Animal e Conservação Ecológica</strong>, asseguramos desenvolvimento sustentável e inclusão social para as gerações presentes e futuras.
              </p>
              <Link href="/sobre" className="btn-outline">
                Conheça nossa história
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative">
              <div className="rounded-lg overflow-hidden shadow-2xl">
                <img
                  src={PRAIA_IMAGE}
                  alt="Praia de Ubatuba"
                  className="w-full h-[420px] object-cover"
                />
              </div>
              {/* Badge flutuante */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-xl p-5 max-w-[200px]">
                <div className="text-forest font-serif text-2xl font-semibold mb-1">Desde 2020</div>
                <div className="text-xs text-muted-foreground">Transformando vidas em Ubatuba</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Valores ── */}
      <section className="section-padding bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <span className="section-label block mb-4">Nossos Valores</span>
            <h2 className="section-title mx-auto">O que nos guia</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {valores.map((v, i) => (
              <div key={i} className="card-elegant p-8 text-center group">
                <div className="w-14 h-14 rounded-full bg-accent mx-auto mb-5 flex items-center justify-center group-hover:bg-forest/10 transition-colors">
                  <v.icon className="w-6 h-6 text-forest" />
                </div>
                <h3 className="font-serif text-xl font-medium text-foreground mb-3">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Programas em Destaque ── */}
      <section className="section-padding bg-sand">
        <div className="container">
          <div className="text-center mb-16">
            <span className="section-label block mb-4">Programas e Projetos</span>
            <h2 className="section-title mx-auto mb-4">Ações que transformam</h2>
            <p className="section-subtitle mx-auto">
              Iniciativas integradas que unem conservação ambiental, esporte, saúde e cultura para o desenvolvimento sustentável de Ubatuba.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {programasDestaque.map((p, i) => (
              <Link key={i} href={p.href} className="card-elegant p-7 group cursor-pointer block">
                <div className={cn("w-12 h-12 rounded-lg mb-5 flex items-center justify-center", p.bg)}>
                  <p.icon className={cn("w-5 h-5", p.color)} />
                </div>
                <h3 className="font-serif text-lg font-medium text-foreground mb-3">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{p.desc}</p>
                <span className={cn("text-sm font-medium inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all", p.color)}>
                  Saiba mais <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/programas" className="btn-outline">
              Ver todos os programas
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Banner Apoie ── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={NATUREZA_IMAGE} alt="Natureza" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-forest-dark/85" />
        </div>
        <div className="relative container text-center text-white">
          <span className="section-label block mb-4 text-white/60">Faça parte</span>
          <h2 className="font-serif text-4xl md:text-5xl font-medium mb-6 text-white">
            Juntos, preservamos mais
          </h2>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Seja como voluntário, doador ou parceiro institucional — sua contribuição é fundamental para ampliar nosso impacto em Ubatuba e região.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/apoie#doacoes" className="inline-flex items-center gap-2 px-8 py-4 bg-earth text-white font-semibold rounded-sm hover:bg-earth/90 transition-all active:scale-[0.98]">
              Fazer uma doação
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/apoie#voluntariado" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/40 text-white font-semibold rounded-sm hover:bg-white/10 hover:border-white/70 transition-all active:scale-[0.98]">
              Ser voluntário
            </Link>
          </div>
        </div>
      </section>

      {/* ── Últimas Notícias ── */}
      <section className="section-padding bg-background">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="section-label block mb-3">Blog e Notícias</span>
              <h2 className="section-title">Últimas novidades</h2>
            </div>
            <Link href="/noticias" className="hidden md:inline-flex items-center gap-2 text-forest font-medium hover:gap-3 transition-all">
              Ver todas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {posts && posts.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link key={post.id} href={`/noticias/${post.slug}`} className="card-elegant overflow-hidden group block">
                  {post.coverImage && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {post.category && (
                      <span className="text-xs font-semibold tracking-widest uppercase text-earth mb-2 block">{post.category}</span>
                    )}
                    <h3 className="font-serif text-xl font-medium text-foreground mb-3 group-hover:text-forest transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{post.excerpt}</p>
                    )}
                    <div className="mt-4 flex items-center gap-1.5 text-forest text-sm font-medium group-hover:gap-2.5 transition-all">
                      Ler mais <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-serif">Em breve, novidades do instituto</p>
              <p className="text-sm mt-2">Acompanhe nossas ações e conquistas</p>
            </div>
          )}

          <div className="text-center mt-10 md:hidden">
            <Link href="/noticias" className="btn-outline">
              Ver todas as notícias <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
