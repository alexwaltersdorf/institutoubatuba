import { Waves, Users, Heart, BookOpen, Fish, Leaf, Trophy, Stethoscope, Music, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

const HERO_IMAGE = "/manus-storage/ubatuba-praia_8ed0b366.jpg";

const programas = [
  {
    id: "surfe",
    icon: Waves,
    categoria: "Esporte e Inclusão",
    titulo: "Escolinha de Surfe",
    descricao: "A Escolinha de Surfe do Instituto Ubatuba oferece aulas gratuitas para crianças e jovens da comunidade, promovendo o contato com o oceano, a prática esportiva e o desenvolvimento de valores como disciplina, respeito à natureza e trabalho em equipe.",
    impacto: "160 crianças atendidas",
    detalhes: [
      "Aulas semanais na praia de Ubatuba",
      "Equipamentos fornecidos pelo instituto",
      "Monitores certificados e experientes",
      "Integração com educação ambiental marinha",
    ],
    color: "text-ocean",
    bg: "bg-ocean/10",
    border: "border-ocean/20",
  },
  {
    id: "futebol",
    icon: Trophy,
    categoria: "Esporte e Inclusão",
    titulo: "Escolinha de Futebol",
    descricao: "A Escolinha de Futebol reúne crianças de diferentes bairros de Ubatuba em torno do esporte mais popular do Brasil, desenvolvendo habilidades técnicas, sociais e emocionais em um ambiente seguro e acolhedor.",
    impacto: "120 crianças atendidas",
    detalhes: [
      "Treinos regulares com metodologia pedagógica",
      "Participação em torneios regionais",
      "Parceria com a Associação de Moradores do Pereque-açu",
      "Foco em valores e cidadania",
    ],
    color: "text-earth",
    bg: "bg-earth/10",
    border: "border-earth/20",
  },
  {
    id: "futevolei",
    icon: Users,
    categoria: "Esporte e Inclusão",
    titulo: "Escolinha de Futevôlei",
    descricao: "O futevôlei combina a destreza do futebol com a dinâmica do vôlei de praia, sendo praticado diretamente na areia de Ubatuba. A escolinha oferece uma experiência única que une esporte, praia e comunidade.",
    impacto: "80 crianças atendidas",
    detalhes: [
      "Prática na praia com redes profissionais",
      "Desenvolvimento de coordenação motora",
      "Integração entre diferentes faixas etárias",
      "Conexão com o ambiente natural de Ubatuba",
    ],
    color: "text-forest",
    bg: "bg-forest/10",
    border: "border-forest/20",
  },
  {
    id: "ituaga-azul",
    icon: Fish,
    categoria: "Conservação Ambiental",
    titulo: "Projeto Itaguá Azul",
    descricao: "Em parceria com o Projeto Itaguá Azul, o instituto atua na conservação dos ecossistemas marinhos de Ubatuba, realizando limpezas de praia, monitoramento da fauna marinha e ações de educação ambiental com a comunidade.",
    impacto: "Praias e ecossistemas preservados",
    detalhes: [
      "Limpezas periódicas das praias de Ubatuba",
      "Monitoramento de espécies marinhas",
      "Educação ambiental nas escolas locais",
      "Coleta e destinação correta de resíduos",
    ],
    color: "text-ocean",
    bg: "bg-ocean/10",
    border: "border-ocean/20",
  },
  {
    id: "bituqueira",
    icon: Leaf,
    categoria: "Conservação Ambiental",
    titulo: "Bituqueira Ecológica",
    descricao: "A Bituqueira Ecológica é uma iniciativa inovadora para a coleta e destinação adequada de bitucas de cigarro nas praias de Ubatuba, um dos principais poluentes dos ecossistemas costeiros. O projeto combina tecnologia e conscientização ambiental.",
    impacto: "Redução da poluição nas praias",
    detalhes: [
      "Instalação de coletores especializados",
      "Destinação correta e reciclagem de bitucas",
      "Campanhas de conscientização",
      "Parceria com empresas e comércio local",
    ],
    color: "text-forest",
    bg: "bg-forest/10",
    border: "border-forest/20",
  },
  {
    id: "saude",
    icon: Stethoscope,
    categoria: "Saúde Comunitária",
    titulo: "Ações de Saúde",
    descricao: "Em parceria com a Total Quality Medicina Diagnóstica, o instituto oferece exames e consultas gratuitas para a comunidade de Ubatuba, com foco nas populações mais vulneráveis e nas crianças e jovens atendidos pelos programas esportivos.",
    impacto: "781 exames e consultas realizados · 3 bolsas de estudo",
    detalhes: [
      "Exames laboratoriais e de imagem gratuitos",
      "Consultas médicas especializadas",
      "3 bolsas de estudo para jovens de destaque",
      "Acompanhamento de saúde dos atletas",
    ],
    color: "text-earth",
    bg: "bg-earth/10",
    border: "border-earth/20",
  },
  {
    id: "educacao",
    icon: BookOpen,
    categoria: "Educação e Cultura",
    titulo: "Feira Literária",
    descricao: "O Instituto Ubatuba apoia a Feira Literária realizada em parceria com a Escola Marina Nepomuceno do Amaral, promovendo o acesso à literatura, a valorização da leitura e o fortalecimento da identidade cultural de Ubatuba.",
    impacto: "Centenas de estudantes alcançados",
    detalhes: [
      "Parceria com Escola Marina Nepomuceno do Amaral",
      "Doação de livros e materiais didáticos",
      "Oficinas literárias e contação de histórias",
      "Incentivo à leitura e à escrita criativa",
    ],
    color: "text-forest-light",
    bg: "bg-forest-light/10",
    border: "border-forest-light/20",
  },
  {
    id: "cultura",
    icon: Music,
    categoria: "Educação e Cultura",
    titulo: "Festivais Culturais",
    descricao: "O instituto apoia o Festival de Pipas e o Festival de Escultura na Areia de Ubatuba, eventos que celebram a cultura local, promovem o turismo sustentável e fortalecem o sentimento de pertencimento e identidade da comunidade.",
    impacto: "Milhares de visitantes e participantes",
    detalhes: [
      "Festival de Pipas — tradição cultural de Ubatuba",
      "Festival de Escultura na Areia — arte efêmera",
      "Integração entre moradores e turistas",
      "Promoção da cultura e do turismo sustentável",
    ],
    color: "text-earth",
    bg: "bg-earth/10",
    border: "border-earth/20",
  },
];

const categorias = ["Todos", "Esporte e Inclusão", "Conservação Ambiental", "Saúde Comunitária", "Educação e Cultura"];

export default function Programas() {
  return (
    <div className="pt-20">
      {/* ── Hero ── */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Programas" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-forest-dark/80" />
        </div>
        <div className="relative container text-center text-white">
          <span className="section-label block mb-4 text-white/60">O que fazemos</span>
          <h1 className="font-serif text-5xl md:text-6xl font-medium text-white mb-6">
            Programas e Projetos
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Iniciativas integradas que unem conservação ambiental, esporte, saúde e cultura para o desenvolvimento sustentável de Ubatuba e região.
          </p>
        </div>
      </section>

      {/* ── Números de Impacto ── */}
      <section className="bg-forest py-14">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="font-serif text-5xl font-semibold mb-2">360+</div>
              <div className="text-sm text-white/60">Crianças nas Escolinhas</div>
            </div>
            <div>
              <div className="font-serif text-5xl font-semibold mb-2">781</div>
              <div className="text-sm text-white/60">Exames e Consultas</div>
            </div>
            <div>
              <div className="font-serif text-5xl font-semibold mb-2">3</div>
              <div className="text-sm text-white/60">Bolsas de Estudo</div>
            </div>
            <div>
              <div className="font-serif text-5xl font-semibold mb-2">8+</div>
              <div className="text-sm text-white/60">Projetos Ativos</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Lista de Programas ── */}
      <section className="section-padding bg-background">
        <div className="container">
          {/* Categorias */}
          <div className="flex flex-wrap gap-3 mb-16 justify-center">
            {categorias.map((cat) => (
              <span
                key={cat}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-medium border transition-colors cursor-default",
                  cat === "Todos"
                    ? "bg-forest text-white border-forest"
                    : "border-border text-muted-foreground hover:border-forest/40 hover:text-forest"
                )}
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Grid de Programas */}
          <div className="space-y-16">
            {programas.map((prog, i) => (
              <div
                key={prog.id}
                className={cn(
                  "grid lg:grid-cols-2 gap-12 items-center",
                  i % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                )}
              >
                {/* Conteúdo */}
                <div className={i % 2 === 1 ? "lg:col-start-2" : ""}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", prog.bg)}>
                      <prog.icon className={cn("w-5 h-5", prog.color)} />
                    </div>
                    <span className={cn("text-xs font-semibold tracking-widest uppercase", prog.color)}>
                      {prog.categoria}
                    </span>
                  </div>
                  <h2 className="font-serif text-3xl font-medium text-foreground mb-4">{prog.titulo}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">{prog.descricao}</p>

                  {/* Detalhes */}
                  <ul className="space-y-2 mb-6">
                    {prog.detalhes.map((d, di) => (
                      <li key={di} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <div className={cn("w-1.5 h-1.5 rounded-full mt-2 shrink-0", prog.color.replace("text-", "bg-"))} />
                        {d}
                      </li>
                    ))}
                  </ul>

                  {/* Badge de impacto */}
                  <div className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium", prog.bg, prog.border, prog.color)}>
                    <Heart className="w-3.5 h-3.5" />
                    {prog.impacto}
                  </div>
                </div>

                {/* Card visual */}
                <div className={cn("card-elegant p-10 text-center", i % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : "")}>
                  <div className={cn("w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center", prog.bg)}>
                    <prog.icon className={cn("w-10 h-10", prog.color)} />
                  </div>
                  <h3 className="font-serif text-2xl font-medium text-foreground mb-3">{prog.titulo}</h3>
                  <p className={cn("text-3xl font-serif font-semibold mb-2", prog.color)}>
                    {prog.impacto.split("·")[0].trim()}
                  </p>
                  <p className="text-sm text-muted-foreground">{prog.categoria}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-forest text-white text-center">
        <div className="container">
          <h2 className="font-serif text-4xl font-medium mb-4">Quer apoiar nossos programas?</h2>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
            Cada contribuição, seja de tempo, recursos ou conhecimento, amplifica o impacto do instituto em Ubatuba.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/apoie" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-forest font-semibold rounded-sm hover:bg-white/90 transition-all active:scale-[0.98]">
              Apoie o Instituto <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contato" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/40 text-white font-semibold rounded-sm hover:bg-white/10 hover:border-white/70 transition-all active:scale-[0.98]">
              Entre em contato
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
