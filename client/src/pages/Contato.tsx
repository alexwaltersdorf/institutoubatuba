import { useState } from "react";
import { MapPin, Mail, Phone, Clock, Send, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { MapView } from "@/components/Map";

const HERO_IMAGE = "/manus-storage/santuario-mata_c008072f.jpg";

const tiposContato = [
  { value: "geral", label: "Informações Gerais" },
  { value: "voluntariado", label: "Voluntariado" },
  { value: "doacao", label: "Doações" },
  { value: "parceria", label: "Parcerias" },
  { value: "imprensa", label: "Imprensa" },
] as const;

type TipoContato = typeof tiposContato[number]["value"];

export default function Contato() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    type: "geral" as TipoContato,
  });
  const [enviado, setEnviado] = useState(false);

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setEnviado(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "", type: "geral" });
      toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
    },
    onError: (err) => {
      toast.error("Erro ao enviar mensagem. Tente novamente.");
      console.error(err);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    submitMutation.mutate(form);
  };

  return (
    <div className="pt-20">
      {/* ── Hero ── */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Contato" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-forest-dark/80" />
        </div>
        <div className="relative container text-center text-white">
          <span className="section-label block mb-4 text-white/60">Fale Conosco</span>
          <h1 className="font-serif text-5xl md:text-6xl font-medium text-white mb-6">
            Contato
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Estamos em Ubatuba e prontos para conversar. Entre em contato para saber mais sobre nossos programas, voluntariado, doações ou parcerias.
          </p>
        </div>
      </section>

      {/* ── Informações + Formulário ── */}
      <section className="section-padding bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-5 gap-16">
            {/* Coluna de informações */}
            <div className="lg:col-span-2">
              <span className="section-label block mb-4">Onde estamos</span>
              <h2 className="font-serif text-3xl font-medium text-foreground mb-8">
                Instituto Ubatuba<br />Santuário Ecológico
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-forest" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-1">Localização</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Ubatuba, São Paulo — Brasil<br />
                      Litoral Norte do Estado de São Paulo
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-forest" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-1">E-mail</h4>
                    <a href="mailto:ubatuba@institutoubatuba.org" className="text-sm text-forest hover:underline">
                      ubatuba@institutoubatuba.org
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-forest" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-1">Telefone</h4>
                    <p className="text-sm text-muted-foreground">(12) 99999-0000</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-forest" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-1">Horário de Atendimento</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Segunda a Sexta: 9h às 18h<br />
                      Sábado: 9h às 13h
                    </p>
                  </div>
                </div>
              </div>

              {/* Badge ODS */}
              <div className="mt-10 p-5 rounded-lg bg-forest/5 border border-forest/20">
                <p className="text-xs font-semibold tracking-widest uppercase text-forest mb-2">Alinhamento</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Instituto Ubatuba Santuário Ecológico — alinhado à <strong className="text-forest">ODS 18</strong> e à <strong className="text-forest">Agenda 2030</strong>.
                </p>
              </div>
            </div>

            {/* Formulário */}
            <div className="lg:col-span-3">
              {enviado ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-forest" />
                  </div>
                  <h3 className="font-serif text-2xl font-medium text-foreground mb-3">Mensagem enviada!</h3>
                  <p className="text-muted-foreground mb-6">Obrigado pelo contato. Retornaremos em breve.</p>
                  <button
                    onClick={() => setEnviado(false)}
                    className="btn-outline"
                  >
                    Enviar outra mensagem
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl font-medium text-foreground mb-2">Envie uma mensagem</h3>
                    <p className="text-sm text-muted-foreground">Campos marcados com * são obrigatórios.</p>
                  </div>

                  {/* Tipo de contato */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Assunto</label>
                    <div className="flex flex-wrap gap-2">
                      {tiposContato.map((tipo) => (
                        <button
                          key={tipo.value}
                          type="button"
                          onClick={() => setForm({ ...form, type: tipo.value })}
                          className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                            form.type === tipo.value
                              ? "bg-forest text-white border-forest"
                              : "border-border text-muted-foreground hover:border-forest/40 hover:text-forest"
                          }`}
                        >
                          {tipo.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Nome *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Seu nome completo"
                        className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">E-mail *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="seu@email.com"
                        className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Telefone</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="(12) 99999-0000"
                        className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Organização</label>
                      <input
                        type="text"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        placeholder="Empresa ou organização (opcional)"
                        className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Mensagem *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Como podemos ajudar? Descreva sua mensagem..."
                      className="w-full px-4 py-3 rounded-sm border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitMutation.isPending ? (
                      "Enviando..."
                    ) : (
                      <>
                        Enviar mensagem
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Mapa ── */}
      <section className="bg-cream">
        <div className="container py-16">
          <div className="text-center mb-10">
            <span className="section-label block mb-3">Localização</span>
            <h2 className="font-serif text-3xl font-medium text-foreground">
              Estamos em Ubatuba, SP
            </h2>
          </div>
          <div className="rounded-xl overflow-hidden shadow-xl border border-border/40 h-[480px]">
            <MapView
              onMapReady={(map) => {
                // Centraliza o mapa em Ubatuba, SP
                const ubatuba = { lat: -23.4336, lng: -45.0838 };
                map.setCenter(ubatuba);
                map.setZoom(13);

                // Adiciona marcador
                const marker = new google.maps.Marker({
                  position: ubatuba,
                  map,
                  title: "Instituto Ubatuba Santuário Ecológico",
                  animation: google.maps.Animation.DROP,
                });

                // InfoWindow
                const infoWindow = new google.maps.InfoWindow({
                  content: `
                    <div style="padding: 8px; font-family: Inter, sans-serif;">
                      <strong style="color: #315832; font-size: 14px;">Instituto Ubatuba</strong><br/>
                      <span style="color: #666; font-size: 12px;">Santuário Ecológico</span><br/>
                      <span style="color: #888; font-size: 11px;">Ubatuba, São Paulo — Brasil</span>
                    </div>
                  `,
                });

                marker.addListener("click", () => {
                  infoWindow.open(map, marker);
                });

                infoWindow.open(map, marker);
              }}
            />
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Ubatuba, São Paulo — Litoral Norte do Estado de São Paulo, Brasil
          </p>
        </div>
      </section>
    </div>
  );
}
