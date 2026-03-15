import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Linkedin, Instagram, Youtube, ArrowUp, Video, ChevronRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useState } from "react";
import { StructuredData } from "@/components/StructuredData";
import { HeroSection } from "@/components/HeroSection";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import tutorialStep2 from "@/assets/tutorial-step-2.png";
import appStoreBadges from "@/assets/app-store-badges.png";
import playForPlanetScreen from "@/assets/play-for-planet-screen.png";
import valueProp1 from "@/assets/value-prop-1.png";
import valueProp2 from "@/assets/value-prop-2.png";
import valueProp3 from "@/assets/value-prop-3.png";
import appMapScreen from "@/assets/app-map-screen-new.png";

const emailSchema = z.string().email();

/* ─── Corner bolts decoration ─── */
const CornerBolts = () => (
  <>
    {/* Top-left */}
    <div className="absolute top-2 left-2 w-3 h-3 rounded-full z-10"
      style={{ background: 'radial-gradient(circle at 40% 35%, hsl(35, 15%, 58%), hsl(35, 20%, 38%))', border: '1px solid hsl(30, 10%, 28%)', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.25), 0 1px 2px rgba(0,0,0,0.4)' }} />
    {/* Top-right */}
    <div className="absolute top-2 right-2 w-3 h-3 rounded-full z-10"
      style={{ background: 'radial-gradient(circle at 40% 35%, hsl(35, 15%, 58%), hsl(35, 20%, 38%))', border: '1px solid hsl(30, 10%, 28%)', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.25), 0 1px 2px rgba(0,0,0,0.4)' }} />
    {/* Bottom-left */}
    <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full z-10"
      style={{ background: 'radial-gradient(circle at 40% 35%, hsl(35, 15%, 58%), hsl(35, 20%, 38%))', border: '1px solid hsl(30, 10%, 28%)', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.25), 0 1px 2px rgba(0,0,0,0.4)' }} />
    {/* Bottom-right */}
    <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full z-10"
      style={{ background: 'radial-gradient(circle at 40% 35%, hsl(35, 15%, 58%), hsl(35, 20%, 38%))', border: '1px solid hsl(30, 10%, 28%)', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.25), 0 1px 2px rgba(0,0,0,0.4)' }} />
  </>
);

/* ─── Wooden sign title ─── */
const WoodenSign = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`wooden-sign ${className}`}>
    {children}
  </div>
);

/* ─── Section with wooden frame ─── */
const FramedSection = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`wooden-frame relative p-6 md:p-10 ${className}`}>
    <CornerBolts />
    {children}
  </div>
);

export default function LandingPage() {
  const { t, language, setLanguage } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      toast.error(t('landing.beta.invalidEmail'));
      return;
    }
    setLoading(true);
    try {
      // @ts-ignore - beta_testers table exists but types may not be updated
      const { error } = await supabase
      // @ts-ignore
      .from('beta_testers')
      // @ts-ignore
      .insert([{ email: email.toLowerCase().trim() }]);
      if (error) {
        if (error.code === '23505') {
          toast.error(t('landing.beta.emailExists'));
        } else {
          toast.error(t('landing.beta.error'));
        }
      } else {
        const userEmail = email.toLowerCase().trim();
        toast.success(t('landing.beta.success'));
        setEmail("");
        try {
          const { data, error: emailError } = await supabase.functions.invoke('send-welcome-email', {
            body: { email: userEmail }
          });
          console.log('Welcome email response:', data, emailError);
        } catch (emailError) {
          console.error('Error sending welcome email:', emailError);
        }
      }
    } catch (error) {
      console.error('Error adding to waitlist:', error);
      toast.error(t('landing.beta.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden relative" style={{ background: 'linear-gradient(180deg, hsl(25, 15%, 10%) 0%, hsl(30, 12%, 8%) 50%, hsl(25, 15%, 10%) 100%)' }}>
      {/* Subtle noise texture overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")` }} />

      <div className="relative z-10">
        <div className="mx-4 md:mx-12 lg:mx-24 xl:mx-32 min-h-screen">
          <StructuredData />
          
          {/* Hero Section */}
          <HeroSection className="my-0 py-[80px]" />

          {/* ═══════════════ App Promo & CTA ═══════════════ */}
          <section className="px-4 py-16 relative">
            <FramedSection>
              <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center justify-between">
                {/* Left */}
                <div className="flex-1 text-center lg:text-left">
                  <WoodenSign className="mb-6">
                    <h2 className="font-permanent-marker text-2xl md:text-3xl lg:text-4xl" style={{ color: 'hsl(38, 35%, 78%)' }}>
                      {t('landing.app.title')}
                    </h2>
                  </WoodenSign>
                  <div className="rusty-divider w-16 mx-auto lg:mx-0 mb-5" />
                  <p className="font-sedgwick-ave text-subtitle-styled text-xl md:text-2xl max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed whitespace-pre-line">
                    {t('landing.app.subtitle')}
                  </p>
                  
                  {/* CTA Buttons */}
                  <div className="flex flex-row gap-4 items-center justify-center lg:justify-start mt-4">
                    <button
                      onClick={() => setWaitlistOpen(true)}
                      className="game-button font-permanent-marker text-xl px-8 py-3 flex items-center gap-2 cursor-pointer">
                      {language === 'en' ? 'GET BETA' : 'OBTÉN BETA'}
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    
                    <button
                      onClick={() => setTrailerOpen(true)}
                      className="game-button-outline font-permanent-marker text-sm px-6 py-3 flex items-center gap-2 cursor-pointer">
                      <Video className="h-5 w-5" />
                      <span className="tracking-wider">TRAILER</span>
                    </button>
                  </div>
                  
                  {/* App Store Badges */}
                  <div className="flex flex-col items-center lg:items-start mt-10">
                    <img src={appStoreBadges} alt="Available on App Store and Google Play" className="w-[280px] md:w-[320px] h-auto opacity-80" style={{ mixBlendMode: 'screen' }} />
                    <p className="font-sedgwick-ave text-2xl md:text-3xl mt-2 opacity-70" style={{ color: 'hsl(80, 40%, 50%)' }}>
                      coming soon
                    </p>
                  </div>
                </div>
                
                {/* Right - Phone */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="worn-photo-frame">
                    <img
                      alt="GreenHunt App Screenshot"
                      className="relative h-80 md:h-[500px] lg:h-[600px] w-auto object-contain rounded"
                      loading="lazy"
                      src={appMapScreen}
                    />
                  </div>
                </div>
              </div>
            </FramedSection>
          </section>

          {/* Waitlist Dialog */}
          <Dialog open={waitlistOpen} onOpenChange={setWaitlistOpen}>
            <DialogContent className="sm:max-w-md border-2" style={{ background: 'linear-gradient(145deg, hsl(30, 20%, 14%), hsl(25, 18%, 10%))', borderColor: 'hsl(25, 35%, 22%)' }}>
              <div className="text-center">
                <WoodenSign className="mb-4">
                  <h3 className="font-permanent-marker text-2xl" style={{ color: 'hsl(38, 35%, 78%)' }}>
                    {language === 'en' ? 'Get the Beta' : 'Obtén la Beta'}
                  </h3>
                </WoodenSign>
                <p className="font-sedgwick-ave text-subtitle-styled text-sm mb-4">
                  {t('landing.beta.description')}
                </p>
              </div>
              <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder={language === 'en' ? 'Enter your email' : 'Ingresa tu email'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="font-sedgwick-ave border-2 text-white placeholder:text-white/30 rounded-md"
                  style={{ background: 'hsl(30, 15%, 15%)', borderColor: 'hsl(30, 20%, 25%)' }} />
                
                <button
                  type="submit" disabled={loading}
                  className="game-button w-full font-permanent-marker text-lg px-8 py-3 cursor-pointer disabled:opacity-50">
                  {loading ? language === 'en' ? 'Sending...' : 'Enviando...' : language === 'en' ? 'GET BETA' : 'OBTÉN BETA'}
                </button>
              </form>
            </DialogContent>
          </Dialog>

          {/* Trailer Dialog */}
          <Dialog open={trailerOpen} onOpenChange={setTrailerOpen}>
            <DialogContent className="sm:max-w-4xl p-0 bg-black border-2" style={{ borderColor: 'hsl(25, 35%, 22%)' }}>
              <div className="aspect-video">
                <iframe width="100%" height="100%" src={trailerOpen ? "https://www.youtube.com/embed/RHj_lCvC9xw?autoplay=1" : ""} title="GreenHunt Trailer" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="rounded-lg" />
              </div>
            </DialogContent>
          </Dialog>

          {/* ═══════════════ Value Propositions ═══════════════ */}
          
          {/* --- Value Prop 1: Snap & Save --- */}
          <section className="py-16 md:py-24 px-4">
            <FramedSection>
              <div className="text-center mb-10">
                <WoodenSign>
                  <h2 className="text-2xl md:text-4xl font-permanent-marker" style={{ color: 'hsl(38, 35%, 78%)' }}>
                    {t('landing.tutorial.title')}
                  </h2>
                </WoodenSign>
                <div className="rusty-divider w-20 mx-auto mt-4" />
              </div>

              <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                <div className="flex-1 order-2 md:order-1">
                  <div className="parchment-card p-6 md:p-8">
                    <h3 className="text-2xl md:text-4xl font-permanent-marker mb-4" style={{ color: 'hsl(25, 35%, 20%)' }}>
                      {t('landing.valueProp1.title')}
                    </h3>
                    <p className="font-sedgwick-ave text-xl md:text-2xl leading-relaxed" style={{ color: 'hsl(25, 25%, 30%)' }}>
                      {t('landing.valueProp1.text')}
                    </p>
                  </div>
                </div>
                <div className="flex-1 order-1 md:order-2 max-w-sm md:max-w-md">
                  <div className="worn-photo-frame">
                    <img src={valueProp1} alt="Save the planet by snapping photos" className="w-full rounded object-cover" />
                  </div>
                </div>
              </div>
            </FramedSection>
          </section>

          {/* --- Value Prop 2: Grab & Rescue --- */}
          <section className="py-16 md:py-24 px-4">
            <FramedSection>
              <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                <div className="flex-1 max-w-xs md:max-w-sm">
                  <div className="worn-photo-frame">
                    <img src={valueProp2} alt="Get free stuff in your city" className="w-full rounded object-cover" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="parchment-card p-6 md:p-8">
                    <h3 className="text-2xl md:text-4xl font-permanent-marker mb-4" style={{ color: 'hsl(25, 35%, 20%)' }}>
                      {t('landing.valueProp2.title')}
                    </h3>
                    <p className="font-sedgwick-ave text-xl md:text-2xl leading-relaxed" style={{ color: 'hsl(25, 25%, 30%)' }}>
                      {t('landing.valueProp2.text')}
                    </p>
                  </div>
                </div>
              </div>
            </FramedSection>
          </section>

          {/* --- Value Prop 3: Track & Compete --- */}
          <section className="py-16 md:py-24 px-4">
            <FramedSection>
              <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                <div className="flex-1 order-2 md:order-1">
                  <div className="parchment-card p-6 md:p-8">
                    <h3 className="text-2xl md:text-4xl font-permanent-marker mb-4" style={{ color: 'hsl(25, 35%, 20%)' }}>
                      {t('landing.valueProp3.title')}
                    </h3>
                    <p className="font-sedgwick-ave text-xl md:text-2xl leading-relaxed" style={{ color: 'hsl(25, 25%, 30%)' }}>
                      {t('landing.valueProp3.text')}
                    </p>
                  </div>
                </div>
                <div className="flex-1 order-1 md:order-2 max-w-xs md:max-w-sm">
                  <div className="worn-photo-frame">
                    <img src={valueProp3} alt="Track your impact and compete" className="w-full rounded object-cover" />
                  </div>
                </div>
              </div>
            </FramedSection>
          </section>

          {/* ═══════════════ Play for the Planet ═══════════════ */}
          <section className="py-20 md:py-28 px-4">
            <FramedSection>
              <div className="text-center mb-12">
                <WoodenSign>
                  <h2 className="text-2xl md:text-4xl font-permanent-marker" style={{ color: 'hsl(38, 35%, 78%)' }}>
                    {t('landing.playPlanet.title')}
                  </h2>
                </WoodenSign>
                <div className="rusty-divider w-20 mx-auto mt-4" />
              </div>
              
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="parchment-card p-6 md:p-8">
                    <p className="font-sedgwick-ave text-xl md:text-2xl leading-relaxed" style={{ color: 'hsl(25, 25%, 30%)' }}>
                      {t('landing.playPlanet.subtitle')}
                    </p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="worn-photo-frame">
                    <img src={playForPlanetScreen} alt="Play for the Planet - GreenHunt App" className="w-full max-w-xs lg:max-w-sm h-auto rounded" loading="lazy" />
                  </div>
                </div>
              </div>
            </FramedSection>
          </section>

          {/* ═══════════════ Final Beta CTA ═══════════════ */}
          <section id="waitlist" className="relative py-20 px-4">
            <FramedSection className="text-center">
              <WoodenSign className="mb-6">
                <h2 className="text-2xl md:text-3xl font-permanent-marker" style={{ color: 'hsl(38, 35%, 78%)' }}>
                  {t('landing.beta.title')}
                </h2>
              </WoodenSign>
              <p className="text-subtitle-styled font-sedgwick-ave mb-8 text-lg">
                {t('landing.beta.description')}
              </p>
              <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder={t('landing.beta.placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required disabled={loading}
                  className="flex-1 font-sedgwick-ave text-lg text-white placeholder:text-white/30 border-2 rounded-md"
                  style={{ background: 'hsl(30, 15%, 15%)', borderColor: 'hsl(30, 20%, 25%)' }} />
                
                <button
                  type="submit" disabled={loading}
                  className="game-button font-permanent-marker px-8 py-3 text-lg cursor-pointer disabled:opacity-50">
                  {loading ? t('landing.beta.loading') : t('landing.beta.cta')}
                </button>
              </form>
            </FramedSection>
          </section>

          {/* Footer */}
          <footer className="relative py-14 px-4" style={{ borderTop: '3px solid hsl(25, 35%, 22%)' }}>
            <div className="container mx-auto max-w-5xl">
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-8">
                {[
                { to: "/legal", label: t('landing.footer.legal') },
                { to: "/privacy", label: t('landing.footer.privacy') },
                { to: "/cookies", label: t('landing.footer.cookies') }].
                map((link, i) =>
                <Link
                  key={i}
                  to={link.to}
                  className="transition-colors font-permanent-marker text-base"
                  style={{ color: 'hsl(40, 25%, 50%)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'hsl(38, 35%, 78%)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'hsl(40, 25%, 50%)')}>
                    {link.label}
                  </Link>
                )}
              </div>

              {/* Redes sociales */}
              <div className="flex items-center justify-center gap-6 sm:gap-8 mb-8">
                {[
                { href: "https://www.instagram.com/greenhuntstoopingapp/", icon: <Instagram className="h-8 w-8 sm:h-9 sm:w-9" /> },
                { href: "https://www.tiktok.com/@greenhuntstoopingapp", icon:
                  <svg className="h-8 w-8 sm:h-9 sm:w-9" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                    </svg>
                },
                { href: "https://www.youtube.com/@GreenHuntStoopingApp", icon: <Youtube className="h-8 w-8 sm:h-9 sm:w-9" /> },
                { href: "https://x.com/StoopingApp", icon:
                  <svg className="h-8 w-8 sm:h-9 sm:w-9" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                },
                { href: "https://www.linkedin.com/company/greenhunt", icon: <Linkedin className="h-8 w-8 sm:h-9 sm:w-9" /> }].
                map((social, i) =>
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-125 transition-all duration-300"
                  style={{ color: 'hsl(80, 40%, 50%)' }}>
                    {social.icon}
                  </a>
                )}
              </div>

              {/* Línea divisora */}
              <div className="rusty-divider w-full mb-6" />

              {/* Eslogan y email */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <span className="font-sedgwick-ave text-lg" style={{ color: 'hsl(80, 40%, 50%)' }}>{t('landing.footer.madeWith')}</span>
                  <span className="text-xl">💚</span>
                  <span className="font-sedgwick-ave text-lg" style={{ color: 'hsl(80, 40%, 50%)' }}>{t('landing.footer.forPlanet')}</span>
                  <span className="text-xl">🌍</span>
                </div>
                <a href="mailto:hello@greenhunt.net" className="font-sedgwick-ave text-lg hover:scale-105 transition-all" style={{ color: 'hsl(80, 35%, 45%)' }}>
                  hello@greenhunt.net
                </a>
              </div>
            </div>
          </footer>

          {/* Bottom Right Buttons */}
          <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="game-button px-4 py-3 rounded-md cursor-pointer"
              aria-label={language === 'en' ? 'Go to top' : 'Ir al principio'}>
              <ArrowUp className="h-5 w-5" />
            </button>
            
            <button
              onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
              className="game-button-outline font-permanent-marker px-4 py-3 rounded-md cursor-pointer tracking-wider text-sm">
              {language === 'en' ? 'ES' : 'EN'}
            </button>
          </div>
        </div>
      </div>
    </div>);
}
