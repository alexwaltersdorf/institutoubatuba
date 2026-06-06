import { ArrowRight, BookOpen, Calendar, Tag } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

const HERO_IMAGE = "/manus-storage/ubatuba-praia_8ed0b366.jpg";

// Matérias baseadas no conteúdo real das redes sociais do instituto
const postsDemo = [
  {
    id: 1,
    slug: "instituto-ubatuba-realiza-capacitacao-com-parceiros-em-dezembro-2025",
    title: "Instituto Ubatuba realiza grande capacitação com parceiros em dezembro de 2025",
    excerpt: "O Instituto Ubatuba reuniu sua equipe e parceiros estratégicos em um evento de capacitação realizado em dezembro de 2025. A iniciativa reforça o compromisso do instituto com a transparência, a governança e a construção coletiva de soluções socioambientais para Ubatuba.",
    coverImage: "/manus-storage/ig_foto3_24660931.jpg",
    category: "Institucional",
    publishedAt: new Date("2025-12-10"),
    published: true,
    content: "",
    tags: null,
    authorId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    slug: "instituto-ubatuba-publicado-no-diario-oficial-da-uniao",
    title: "Instituto Ubatuba é reconhecido com publicação no Diário Oficial da União",
    excerpt: "O Instituto Ubatuba Santuário Ecológico teve suas ações reconhecidas com publicação no Diário Oficial da União, consolidando seu papel como referência em conservação socioambiental e bem-estar animal no litoral norte de São Paulo.",
    coverImage: "/manus-storage/ig_foto5_aaa5e221.jpg",
    category: "Institucional",
    publishedAt: new Date("2025-10-15"),
    published: true,
    content: "",
    tags: null,
    authorId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    slug: "capacitacao-em-saude-fortalece-parceria-com-o-sus",
    title: "Capacitação em saúde fortalece parceria do instituto com o SUS",
    excerpt: "O Instituto Ubatuba participou de capacitação sobre certificação de entidades de saúde e integração com o Sistema Único de Saúde (SUS). A iniciativa reforça a parceria com a Total Quality Medicina Diagnóstica, que já realizou 781 exames e consultas gratuitas para a comunidade.",
    coverImage: "/manus-storage/ig_foto1_2593cca7.jpg",
    category: "Saúde",
    publishedAt: new Date("2025-09-20"),
    published: true,
    content: "",
    tags: null,
    authorId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    slug: "transparencia-e-governanca-pilares-do-instituto-ubatuba",
    title: "Transparência e governança: os pilares do Instituto Ubatuba",
    excerpt: "Em apresentação realizada para parceiros e colaboradores, o Instituto Ubatuba destacou seus mecanismos de transparência e prestação de contas. A iniciativa reflete os valores centrais da organização: ética, integridade e responsabilidade socioambiental.",
    coverImage: "/manus-storage/ig_foto2_d635a26f.jpg",
    category: "Governança",
    publishedAt: new Date("2025-08-05"),
    published: true,
    content: "",
    tags: null,
    authorId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 5,
    slug: "escolinhas-esportivas-atingem-360-criancas-atendidas",
    title: "Escolinhas esportivas atingem 360 crianças atendidas em Ubatuba",
    excerpt: "As escolinhas de surfe (160 crianças), futebol (120 crianças) e futevôlei (80 crianças) do instituto alcançaram a marca de 360 crianças atendidas, consolidando o programa como referência em inclusão social pelo esporte no litoral norte paulista.",
    coverImage: "/manus-storage/ubatuba-praia_8ed0b366.jpg",
    category: "Programas",
    publishedAt: new Date("2025-07-10"),
    published: true,
    content: "",
    tags: null,
    authorId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 6,
    slug: "bituqueira-ecologica-e-projeto-itaguaa-azul-em-acao",
    title: "Bituqueira Ecológica e Projeto Itaguá Azul avançam na conservação das praias",
    excerpt: "O Instituto Ubatuba intensifica as ações da Bituqueira Ecológica e do Projeto Itaguá Azul, iniciativas que combatem a poluição nas praias de Ubatuba e promovem a conservação dos ecossistemas costeiros, alinhadas à ODS 18 de bem-estar animal e conservação ecológica.",
    coverImage: "/manus-storage/ubatuba-natureza_083c332c.png",
    category: "Meio Ambiente",
    publishedAt: new Date("2025-05-22"),
    published: true,
    content: "",
    tags: null,
    authorId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

function formatDate(date: Date | null | undefined) {
  if (!date) return "";
  return new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(date));
}

export default function Noticias() {
  const { data: posts, isLoading } = trpc.posts.list.useQuery({ limit: 20, offset: 0 });
  const itens = posts && posts.length > 0 ? posts : postsDemo;

  return (
    <div className="pt-20">
      {/* ── Hero ── */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Notícias" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-forest-dark/80" />
        </div>
        <div className="relative container text-center text-white">
          <span className="section-label block mb-4 text-white/60">Blog e Notícias</span>
          <h1 className="font-serif text-5xl md:text-6xl font-medium text-white mb-6">
            Notícias
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Acompanhe as ações, conquistas e novidades do Instituto Ubatuba Santuário Ecológico.
          </p>
        </div>
      </section>

      {/* ── Posts ── */}
      <section className="section-padding bg-background">
        <div className="container">
          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card-elegant overflow-hidden animate-pulse">
                  <div className="h-48 bg-muted" />
                  <div className="p-6 space-y-3">
                    <div className="h-3 bg-muted rounded w-1/3" />
                    <div className="h-5 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : itens.length > 0 ? (
            <>
              {/* Post em destaque */}
              <div className="mb-12">
                <Link href={`/noticias/${itens[0].slug}`} className="card-elegant overflow-hidden group block md:grid md:grid-cols-2">
                  <div className="h-64 md:h-auto overflow-hidden">
                    {itens[0].coverImage ? (
                      <img
                        src={itens[0].coverImage}
                        alt={itens[0].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-forest/10 flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-forest/30" />
                      </div>
                    )}
                  </div>
                  <div className="p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      {itens[0].category && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-earth">
                          <Tag className="w-3 h-3" />
                          {itens[0].category}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">Destaque</span>
                    </div>
                    <h2 className="font-serif text-3xl font-medium text-foreground mb-4 group-hover:text-forest transition-colors leading-snug">
                      {itens[0].title}
                    </h2>
                    {itens[0].excerpt && (
                      <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-3">{itens[0].excerpt}</p>
                    )}
                    <div className="flex items-center justify-between">
                      {itens[0].publishedAt && (
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(itens[0].publishedAt)}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5 text-forest text-sm font-medium group-hover:gap-2.5 transition-all">
                        Ler mais <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Grid de posts */}
              <div className="grid md:grid-cols-3 gap-8">
                {itens.slice(1).map((post) => (
                  <Link key={post.id} href={`/noticias/${post.slug}`} className="card-elegant overflow-hidden group block">
                    <div className="h-48 overflow-hidden">
                      {post.coverImage ? (
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-forest/10 flex items-center justify-center">
                          <BookOpen className="w-10 h-10 text-forest/30" />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        {post.category && (
                          <span className="text-xs font-semibold tracking-widest uppercase text-earth">{post.category}</span>
                        )}
                      </div>
                      <h3 className="font-serif text-xl font-medium text-foreground mb-3 group-hover:text-forest transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">{post.excerpt}</p>
                      )}
                      <div className="flex items-center justify-between pt-3 border-t border-border/40">
                        {post.publishedAt && (
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {formatDate(post.publishedAt)}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-forest text-xs font-medium group-hover:gap-2 transition-all">
                          Ler <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="font-serif text-xl">Nenhuma notícia publicada ainda</p>
              <p className="text-sm mt-2">Em breve, novidades do instituto</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
