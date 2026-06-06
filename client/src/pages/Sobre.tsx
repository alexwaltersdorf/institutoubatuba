import { Leaf, Target, Eye, Heart, Users, Shield, Lightbulb, Scale, TreePine, Star } from "lucide-react";

const MATA_IMAGE = "/manus-storage/santuario-mata_c008072f.jpg";
const NATUREZA_IMAGE = "/manus-storage/ubatuba-natureza_083c332c.png";

const valores = [
  { icon: Users, title: "Colaboração", desc: "Construímos pontes entre comunidades, ciência e poder público para gerar impacto real e duradouro em Ubatuba." },
  { icon: Shield, title: "Transparência", desc: "Atuamos com prestação de contas clara e comunicação aberta com todos os nossos parceiros e apoiadores." },
  { icon: Lightbulb, title: "Inovação Compartilhada", desc: "Cocriamos soluções integrando conhecimento científico, tecnologia e saberes tradicionais da comunidade local." },
  { icon: Scale, title: "Inclusão e Equidade", desc: "Garantimos que o acesso à natureza, à saúde e à educação seja um direito de todos, sem distinção." },
  { icon: Leaf, title: "Responsabilidade Socioambiental", desc: "Cada ação é guiada pelo compromisso com a preservação dos ecossistemas e o bem-estar das pessoas e animais." },
  { icon: Heart, title: "Ética e Integridade", desc: "Agimos com honestidade e coerência entre nossos valores e práticas em todas as esferas de atuação." },
  { icon: TreePine, title: "Cocriação de Conhecimento", desc: "Valorizamos o diálogo entre saberes científicos e populares como base para soluções sustentáveis." },
];

const equipe = [
  { nome: "Diretoria Executiva", cargo: "Gestão Estratégica e Institucional", desc: "Responsável pela visão de longo prazo, parcerias estratégicas e representação institucional do instituto." },
  { nome: "Coordenação de Projetos", cargo: "Programas Socioambientais", desc: "Coordena os programas esportivos, educacionais e de conservação ambiental em campo." },
  { nome: "Equipe de Saúde", cargo: "Ações Comunitárias de Saúde", desc: "Parceria com a Total Quality Medicina Diagnóstica para atendimento à comunidade." },
  { nome: "Voluntários e Educadores", cargo: "Educação e Cultura", desc: "Profissionais e voluntários dedicados às escolinhas esportivas e ações culturais." },
];

export default function Sobre() {
  return (
    <div className="pt-20">
      {/* ── Hero da Página ── */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src={MATA_IMAGE} alt="Santuário Ecológico" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-forest-dark/80" />
        </div>
        <div className="relative container text-center text-white">
          <span className="section-label block mb-4 text-white/60">Quem Somos</span>
          <h1 className="font-serif text-5xl md:text-6xl font-medium text-white mb-6">
            Sobre o Instituto
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Conheça nossa história, nossa missão e as pessoas que dedicam seu trabalho à conservação socioambiental de Ubatuba.
          </p>
        </div>
      </section>

      {/* ── História ── */}
      <section className="section-padding bg-cream">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="section-label block mb-4">Nossa História</span>
              <h2 className="section-title mb-6">
                Uma semente plantada em Ubatuba
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-5">
                O Instituto Ubatuba Santuário Ecológico nasceu do reconhecimento de que Ubatuba — com sua exuberante Mata Atlântica, praias preservadas e rica biodiversidade marinha — merecia uma instituição dedicada exclusivamente à sua conservação e ao desenvolvimento sustentável de sua comunidade.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-5">
                Fundado com o propósito de articular diferentes setores da sociedade — poder público, iniciativa privada, academia e comunidade —, o instituto rapidamente se tornou um ponto de convergência para iniciativas socioambientais no litoral norte paulista.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Hoje, com programas que atendem centenas de crianças, jovens e famílias, o instituto consolida sua atuação como referência em conservação ecológica e inclusão social, sempre guiado pelos princípios da <strong className="text-forest">Agenda 2030</strong> e da <strong className="text-forest">ODS 18</strong>.
              </p>
            </div>
            <div className="relative">
              <img
                src={NATUREZA_IMAGE}
                alt="Natureza de Ubatuba"
                className="rounded-lg shadow-2xl w-full h-[450px] object-cover"
              />
              <div className="absolute -top-6 -right-6 bg-forest rounded-lg p-6 text-white shadow-xl">
                <div className="font-serif text-3xl font-semibold">2020</div>
                <div className="text-xs text-white/70 mt-1">Ano de fundação</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Missão, Visão e ODS 18 ── */}
      <section className="section-padding bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <span className="section-label block mb-4">Propósito e Direção</span>
            <h2 className="section-title mx-auto">Missão, Visão e ODS 18</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Missão */}
            <div className="card-elegant p-8">
              <div className="w-14 h-14 rounded-full bg-forest/10 flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-forest" />
              </div>
              <h3 className="font-serif text-2xl font-medium text-foreground mb-4">Missão</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Promover a conservação socioambiental de Ubatuba e região por meio de parcerias multissetoriais que mobilizem conhecimentos científicos, recursos financeiros, tecnologia e participação comunitária, assegurando desenvolvimento sustentável e inclusão social alinhados à Agenda 2030.
              </p>
            </div>

            {/* Visão */}
            <div className="card-elegant p-8">
              <div className="w-14 h-14 rounded-full bg-ocean/10 flex items-center justify-center mb-6">
                <Eye className="w-6 h-6 text-ocean" />
              </div>
              <h3 className="font-serif text-2xl font-medium text-foreground mb-4">Visão</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Até 2030, ser reconhecido na região em desenvolvimento sustentável, articulando redes locais e globais capazes de cocriar soluções inovadoras para preservar ecossistemas marinhos e terrestres, reduzir desigualdades sociais e inspirar políticas públicas fundamentadas na cooperação.
              </p>
            </div>

            {/* ODS 18 */}
            <div className="card-elegant p-8 border-forest/30 bg-forest/5">
              <div className="w-14 h-14 rounded-full bg-forest flex items-center justify-center mb-6">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-serif text-2xl font-medium text-forest mb-4">ODS 18</h3>
              <p className="text-muted-foreground leading-relaxed text-sm mb-4">
                O Instituto Ubatuba está explicitamente alinhado à <strong className="text-forest">ODS 18 — Bem-estar Animal e Conservação Ecológica</strong>, um objetivo complementar à Agenda 2030 que reconhece a interdependência entre o bem-estar dos animais, a saúde dos ecossistemas e o desenvolvimento humano sustentável.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Nossas ações de proteção da fauna marinha, conservação da Mata Atlântica e educação ambiental são expressões concretas desse compromisso.
              </p>
            </div>
          </div>

          {/* Linha divisória dourada */}
          <div className="divider-gold my-12" />

          {/* Valores */}
          <div className="text-center mb-12">
            <span className="section-label block mb-4">Nossos Valores</span>
            <h2 className="section-title mx-auto">O que nos guia</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valores.slice(0, 4).map((v, i) => (
              <div key={i} className="card-elegant p-6">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-forest" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">{v.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
          <div className="grid sm:grid-cols-3 gap-6 mt-6">
            {valores.slice(4).map((v, i) => (
              <div key={i} className="card-elegant p-6">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-forest" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">{v.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Equipe ── */}
      <section className="section-padding bg-sand">
        <div className="container">
          <div className="text-center mb-16">
            <span className="section-label block mb-4">Nossa Equipe</span>
            <h2 className="section-title mx-auto mb-4">Pessoas comprometidas</h2>
            <p className="section-subtitle mx-auto">
              O Instituto Ubatuba é movido por profissionais e voluntários apaixonados pela conservação socioambiental e pelo desenvolvimento de Ubatuba.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {equipe.map((membro, i) => (
              <div key={i} className="card-elegant p-7 text-center">
                <div className="w-16 h-16 rounded-full bg-forest/10 border-2 border-forest/20 flex items-center justify-center mx-auto mb-5">
                  <Users className="w-7 h-7 text-forest" />
                </div>
                <h3 className="font-serif text-lg font-medium text-foreground mb-1">{membro.nome}</h3>
                <span className="text-xs font-semibold tracking-wide uppercase text-earth block mb-3">{membro.cargo}</span>
                <p className="text-sm text-muted-foreground leading-relaxed">{membro.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Parcerias ── */}
      <section className="section-padding bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <span className="section-label block mb-4">Parcerias</span>
            <h2 className="section-title mx-auto mb-4">Quem caminha conosco</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { nome: "Projeto Itaguá Azul", desc: "Conservação dos ecossistemas marinhos de Ubatuba" },
              { nome: "Total Quality Medicina Diagnóstica", desc: "Ações de saúde para a comunidade" },
              { nome: "Escola Marina Nepomuceno do Amaral", desc: "Apoio à Feira Literária e educação" },
              { nome: "Associação de Moradores do Pereque-açu", desc: "Integração comunitária e ações locais" },
              { nome: "Festival de Pipas de Ubatuba", desc: "Cultura e identidade local" },
              { nome: "Festival de Escultura na Areia", desc: "Arte e expressão cultural" },
            ].map((p, i) => (
              <div key={i} className="flex items-start gap-4 p-5 rounded-lg border border-border/60 hover:border-forest/30 transition-colors">
                <div className="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Leaf className="w-4 h-4 text-forest" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm mb-1">{p.nome}</h4>
                  <p className="text-xs text-muted-foreground">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
