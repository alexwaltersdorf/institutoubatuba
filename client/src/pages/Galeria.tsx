import { useState } from "react";
import { X, ZoomIn, Leaf } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";

const HERO_IMAGE = "/manus-storage/ubatuba-natureza_083c332c.png";

// Galeria com fotos reais do instituto (Instagram e Facebook)
const galeriaDemo = [
  {
    id: 1,
    imageUrl: "/manus-storage/ig_foto3_24660931.jpg",
    title: "Capacitação com Parceiros",
    category: "Eventos",
    description: "Equipe do Instituto Ubatuba reunida com parceiros em evento de capacitação — Dezembro 2025",
  },
  {
    id: 2,
    imageUrl: "/manus-storage/ig_foto2_d635a26f.jpg",
    title: "Transparência em Ação",
    category: "Eventos",
    description: "Apresentação sobre transparência e governança do instituto para parceiros e colaboradores",
  },
  {
    id: 3,
    imageUrl: "/manus-storage/ig_foto1_2593cca7.jpg",
    title: "Certificação de Saúde",
    category: "Saúde",
    description: "Capacitação sobre certificação de entidades de saúde e parceria com o SUS",
  },
  {
    id: 4,
    imageUrl: "/manus-storage/ig_foto4_6643d6c8.jpg",
    title: "Ações de Saúde",
    category: "Saúde",
    description: "Projeto de saúde comunitária com 781 exames e consultas realizados",
  },
  {
    id: 5,
    imageUrl: "/manus-storage/ig_foto5_aaa5e221.jpg",
    title: "Reconhecimento Oficial",
    category: "Institucional",
    description: "Publicação no Diário Oficial da União — reconhecimento das ações do Instituto Ubatuba",
  },
  {
    id: 6,
    imageUrl: "/manus-storage/ubatuba-hero_110ea313.jpg",
    title: "Litoral de Ubatuba",
    category: "Natureza",
    description: "Beleza natural do litoral norte paulista, lar do Instituto Ubatuba Santuário Ecológico",
  },
  {
    id: 7,
    imageUrl: "/manus-storage/ubatuba-praia_8ed0b366.jpg",
    title: "Escolinha de Surfe",
    category: "Programas",
    description: "160 crianças atendidas pela Escolinha de Surfe Social do instituto",
  },
  {
    id: 8,
    imageUrl: "/manus-storage/ubatuba-natureza_083c332c.png",
    title: "Mata Atlântica",
    category: "Natureza",
    description: "Conservação da Mata Atlântica — um dos biomas mais ameaçados do planeta",
  },
];

const categorias = ["Todos", "Eventos", "Saúde", "Institucional", "Natureza", "Programas"];

export default function Galeria() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  type LightboxItem = { id: number; imageUrl: string; title?: string | null; category?: string | null; description?: string | null };
  const [lightboxItem, setLightboxItem] = useState<LightboxItem | null>(null);

  const { data: galleryData } = trpc.gallery.list.useQuery({ category: categoriaAtiva === "Todos" ? undefined : categoriaAtiva });

  type GalleryItem = { id: number; imageUrl: string; title?: string | null; category?: string | null; description?: string | null };
  const itens: GalleryItem[] = galleryData && galleryData.length > 0 ? galleryData : galeriaDemo;
  const itensFiltrados = categoriaAtiva === "Todos" ? itens : itens.filter(item => item.category === categoriaAtiva);

  return (
    <div className="pt-20">
      {/* ── Hero ── */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Galeria" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-forest-dark/80" />
        </div>
        <div className="relative container text-center text-white">
          <span className="section-label block mb-4 text-white/60">Memórias e Registros</span>
          <h1 className="font-serif text-5xl md:text-6xl font-medium text-white mb-6">
            Galeria
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Registros do santuário, das atividades e das pessoas que fazem parte da história do Instituto Ubatuba.
          </p>
        </div>
      </section>

      {/* ── Filtros ── */}
      <section className="py-10 bg-cream border-b border-border/40">
        <div className="container">
          <div className="flex flex-wrap gap-3 justify-center">
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaAtiva(cat)}
                className={cn(
                  "px-6 py-2.5 rounded-full text-sm font-medium border transition-all duration-200",
                  categoriaAtiva === cat
                    ? "bg-forest text-white border-forest shadow-sm"
                    : "border-border text-muted-foreground hover:border-forest/40 hover:text-forest bg-white"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Grid de Fotos ── */}
      <section className="section-padding bg-background">
        <div className="container">
          {itensFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {itensFiltrados.map((item, i) => (
                <div
                  key={item.id}
                  className={cn(
                    "group relative overflow-hidden rounded-lg cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500",
                    i === 0 ? "sm:col-span-2 sm:row-span-2" : ""
                  )}
                  onClick={() => setLightboxItem(item)}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title || "Galeria"}
                    className={cn(
                      "w-full object-cover transition-transform duration-700 group-hover:scale-110",
                      i === 0 ? "h-[500px]" : "h-64"
                    )}
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Ícone de zoom */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                    <ZoomIn className="w-4 h-4 text-white" />
                  </div>
                  {/* Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    {item.category && (
                      <span className="text-xs font-semibold tracking-widest uppercase text-white/70 block mb-1">{item.category}</span>
                    )}
                    {item.title && (
                      <h3 className="font-serif text-lg font-medium text-white">{item.title}</h3>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <Leaf className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="font-serif text-xl">Galeria em construção</p>
              <p className="text-sm mt-2">Em breve, registros do santuário e das atividades do instituto</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Lightbox ── */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightboxItem(null)}
        >
          <button
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            onClick={() => setLightboxItem(null)}
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div
            className="max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxItem.imageUrl}
              alt={lightboxItem.title || ""}
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
            {(lightboxItem.title || lightboxItem.description) && (
              <div className="mt-4 text-center">
                {lightboxItem.title && (
                  <h3 className="font-serif text-xl text-white mb-1">{lightboxItem.title}</h3>
                )}
                {lightboxItem.description && (
                  <p className="text-white/60 text-sm">{lightboxItem.description}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
