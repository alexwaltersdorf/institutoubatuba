import { Heart, Users, Handshake, ArrowRight, CheckCircle, Building2, Leaf } from "lucide-react";
import { Link } from "wouter";

const HERO_IMAGE = "/manus-storage/ubatuba-hero_110ea313.jpg";

const formasApoio = [
  {
    id: "voluntariado",
    icon: Users,
    titulo: "Voluntariado",
    subtitulo: "Doe seu tempo e talento",
    descricao: "Voluntários são o coração do Instituto Ubatuba. Seja como educador, monitor esportivo, profissional de saúde, comunicador ou apoio administrativo — sua contribuição é fundamental para ampliar nosso alcance e impacto.",
    beneficios: [
      "Certificado de voluntariado reconhecido",
      "Capacitações e treinamentos gratuitos",
      "Integração com uma rede de profissionais comprometidos",
      "Experiência transformadora em Ubatuba",
    ],
    cta: "Quero ser voluntário",
    color: "text-forest",
    bg: "bg-forest/10",
    border: "border-forest/20",
    iconBg: "bg-forest",
  },
  {
    id: "doacoes",
    icon: Heart,
    titulo: "Doações",
    subtitulo: "Transforme recursos em impacto",
    descricao: "Cada doação, independentemente do valor, contribui diretamente para manter e expandir nossos programas. Seus recursos financiam equipamentos esportivos, materiais educativos, exames de saúde e ações de conservação ambiental.",
    beneficios: [
      "Transparência total na aplicação dos recursos",
      "Relatórios periódicos de impacto",
      "Possibilidade de doação recorrente",
      "Reconhecimento como apoiador do instituto",
    ],
    cta: "Fazer uma doação",
    color: "text-earth",
    bg: "bg-earth/10",
    border: "border-earth/20",
    iconBg: "bg-earth",
  },
  {
    id: "parcerias",
    icon: Handshake,
    titulo: "Parcerias",
    subtitulo: "Construa pontes conosco",
    descricao: "Buscamos parcerias com organizações, empresas e instituições que compartilham nossos valores de conservação socioambiental. Juntos, podemos criar iniciativas de maior escala e impacto duradouro em Ubatuba e região.",
    beneficios: [
      "Visibilidade e associação à causa ambiental",
      "Projetos co-desenvolvidos e personalizados",
      "Relatórios de impacto para prestação de contas",
      "Alinhamento com ESG e responsabilidade social",
    ],
    cta: "Propor uma parceria",
    color: "text-ocean",
    bg: "bg-ocean/10",
    border: "border-ocean/20",
    iconBg: "bg-ocean",
  },
];

const empresasParceiras = [
  { nome: "Total Quality Medicina Diagnóstica", tipo: "Saúde", desc: "Parceria em ações de saúde comunitária" },
  { nome: "Projeto Itaguá Azul", tipo: "Conservação", desc: "Conservação dos ecossistemas marinhos" },
  { nome: "Associação de Moradores do Pereque-açu", tipo: "Comunidade", desc: "Integração e ações comunitárias" },
];

export default function Apoie() {
  return (
    <div className="pt-20">
      {/* ── Hero ── */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Apoie o Instituto" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-forest-dark/80" />
        </div>
        <div className="relative container text-center text-white">
          <span className="section-label block mb-4 text-white/60">Faça parte</span>
          <h1 className="font-serif text-5xl md:text-6xl font-medium text-white mb-6">
            Como Apoiar
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Existem muitas formas de contribuir para a missão do Instituto Ubatuba. Encontre a que melhor se encaixa no seu perfil.
          </p>
        </div>
      </section>

      {/* ── Formas de Apoio ── */}
      <section className="section-padding bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <span className="section-label block mb-4">Formas de Contribuição</span>
            <h2 className="section-title mx-auto mb-4">Escolha como apoiar</h2>
            <p className="section-subtitle mx-auto">
              Toda contribuição, grande ou pequena, fortalece nossa capacidade de preservar Ubatuba e transformar vidas.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {formasApoio.map((forma) => (
              <div key={forma.id} id={forma.id} className="card-elegant p-8 flex flex-col">
                <div className={`w-14 h-14 rounded-full ${forma.iconBg} flex items-center justify-center mb-6`}>
                  <forma.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-xs font-semibold tracking-widest uppercase mb-2 block ${forma.color}`}>
                  {forma.subtitulo}
                </span>
                <h3 className="font-serif text-2xl font-medium text-foreground mb-4">{forma.titulo}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm mb-6">{forma.descricao}</p>

                <ul className="space-y-3 mb-8 flex-1">
                  {forma.beneficios.map((b, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <CheckCircle className={`w-4 h-4 mt-0.5 shrink-0 ${forma.color}`} />
                      <span className="text-muted-foreground">{b}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contato"
                  className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-sm text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
                    forma.id === "doacoes"
                      ? "bg-earth text-white hover:bg-earth/90"
                      : forma.id === "voluntariado"
                      ? "bg-forest text-white hover:bg-forest-dark"
                      : "bg-ocean text-white hover:bg-ocean/90"
                  }`}
                >
                  {forma.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Por que apoiar ── */}
      <section className="section-padding bg-sand">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="section-label block mb-4">Por que apoiar</span>
              <h2 className="section-title mb-6">
                Seu apoio gera impacto real
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                O Instituto Ubatuba opera com total transparência e compromisso com resultados mensuráveis. Cada recurso recebido é aplicado diretamente nos programas que atendem crianças, jovens e famílias de Ubatuba.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                {[
                  { num: "360+", label: "Crianças atendidas" },
                  { num: "781", label: "Exames realizados" },
                  { num: "8+", label: "Projetos ativos" },
                  { num: "3", label: "Bolsas de estudo" },
                ].map((stat, i) => (
                  <div key={i} className="text-center p-5 bg-white rounded-lg border border-border/60">
                    <div className="font-serif text-3xl font-semibold text-forest mb-1">{stat.num}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
              <Link href="/programas" className="btn-outline">
                Ver nossos programas <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {[
                { titulo: "Transparência total", desc: "Publicamos relatórios periódicos com a aplicação de todos os recursos recebidos." },
                { titulo: "Impacto mensurável", desc: "Monitoramos e comunicamos os resultados de cada programa com dados concretos." },
                { titulo: "Alinhamento com ODS", desc: "Nossas ações estão alinhadas à Agenda 2030 e à ODS 18 — Bem-estar Animal." },
                { titulo: "Comunidade local", desc: "100% dos beneficiários são moradores de Ubatuba e região, gerando impacto local." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-5 bg-white rounded-lg border border-border/60">
                  <div className="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-forest" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-1">{item.titulo}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Parceiros ── */}
      <section id="empresas" className="section-padding bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <span className="section-label block mb-4">Parceiros Institucionais</span>
            <h2 className="section-title mx-auto mb-4">Quem já apoia o instituto</h2>
            <p className="section-subtitle mx-auto">
              Organizações e empresas que compartilham nossa visão de um futuro mais sustentável para Ubatuba.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
            {empresasParceiras.map((p, i) => (
              <div key={i} className="card-elegant p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-5 h-5 text-forest" />
                </div>
                <span className="text-xs font-semibold tracking-widest uppercase text-earth block mb-2">{p.tipo}</span>
                <h4 className="font-serif text-base font-medium text-foreground mb-2">{p.nome}</h4>
                <p className="text-xs text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA para novas parcerias */}
          <div className="text-center p-10 rounded-xl bg-forest/5 border border-forest/20 max-w-2xl mx-auto">
            <Leaf className="w-10 h-10 text-forest mx-auto mb-4" />
            <h3 className="font-serif text-2xl font-medium text-foreground mb-3">
              Seja um parceiro do Instituto Ubatuba
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Sua empresa pode fazer parte de uma iniciativa reconhecida de conservação socioambiental, com visibilidade, impacto e alinhamento aos critérios ESG.
            </p>
            <Link href="/contato" className="btn-primary">
              Fale conosco sobre parcerias
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
