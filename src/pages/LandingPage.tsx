import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Linkedin, Instagram, Youtube, ArrowUp, Video, ChevronRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useState } from "react";
import { StructuredData } from "@/components/StructuredData";
import { HeroSection } from "@/components/HeroSection";
import { ApocalypticBackground } from "@/components/ApocalypticBackground";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import stoneTagline from "@/assets/stone-tagline-new.png";
import rescueMap from "@/assets/rescue-map.png";

const emailSchema = z.string().email();

/* ─── Step card component ─── */
const StepCard = ({ number, image, alt, text }: {number: number;image: string;alt: string;text: string;}) =>
<div className="group relative flex flex-col items-center text-center">
    {/* Step number badge */}
    <div className="absolute -top-4 -left-2 z-20 w-10 h-10 rounded-full flex items-center justify-center font-permanent-marker text-lg border-2"
  style={{ backgroundColor: '#1a1a1a', borderColor: '#c8a46e', color: '#c8a46e' }}>
      {number}
    </div>
    {/* Card */}
    <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-1 transition-all duration-300 group-hover:border-white/20 group-hover:shadow-[0_0_30px_rgba(200,164,110,0.08)]">
      <img
      alt={alt}
      className="w-full rounded-xl object-contain"
      loading="lazy"
      src={image} />
    
    </div>
    <p className="font-sedgwick-ave text-subtitle-styled text-xl md:text-2xl mt-5 leading-relaxed px-2">
      {text}
    </p>
  </div>;


/* ─── Feature row (alternating layout) ─── */
const FeatureRow = ({ title, subtitle, image, alt, reverse = false

}: {title: string;subtitle: string;image: string;alt: string;reverse?: boolean;}) =>
<div className="grid lg:grid-cols-2 gap-12 items-center">
    <div className={reverse ? 'order-2 lg:order-1' : ''}>
      <h2 className="text-3xl md:text-5xl font-permanent-marker mb-5 leading-tight" style={{ color: '#c8a46e' }}>
        {title}
      </h2>
      <div className="w-16 h-1 rounded-full mb-6" style={{ backgroundColor: '#c8a46e', opacity: 0.5 }} />
      <p className="text-lg md:text-xl text-subtitle-styled font-sedgwick-ave leading-relaxed">
        {subtitle}
      </p>
    </div>
    <div className={`${reverse ? 'order-1 lg:order-2' : ''} flex justify-center`}>
      <img src={image} alt={alt} className="w-full max-w-xs lg:max-w-sm h-auto drop-shadow-2xl" loading="lazy" />
    </div>
  </div>;


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
    <div className="min-h-screen text-white overflow-x-hidden relative">
      <ApocalypticBackground />
      
      <div className="relative z-10">
        <div className="mx-4 md:mx-12 lg:mx-24 xl:mx-32 min-h-screen">
          <StructuredData />
          
          {/* Hero Section */}
          <div className="-mx-4 md:-mx-12 lg:-mx-24 xl:-mx-32">
            <HeroSection className="my-0" />
          </div>

          {/* Tagline + Rescue Map */}
          <div className="-mx-4 md:-mx-12 lg:-mx-24 xl:-mx-32 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 py-8 md:py-12 px-4">
            <img 
              src={stoneTagline} 
              alt="Your city is like a board game where valuable free finds suddenly appear!" 
              className="w-[90%] sm:w-[70%] md:w-[45%] lg:w-[38%] xl:w-[32%] h-auto drop-shadow-lg"
              loading="lazy"
            />
            <img 
              src={rescueMap} 
              alt="Rescue Map - Mission: Save the Planet!" 
              className="w-[75%] sm:w-[55%] md:w-[35%] lg:w-[28%] xl:w-[24%] h-auto drop-shadow-lg"
              loading="lazy"
            />
          </div>

          {/* ═══════════════ App Promo & CTA ═══════════════ */}
          <section className="px-4 py-16 relative overflow-hidden">
            <div className="container mx-auto max-w-6xl relative z-10">
              <div className="flex flex-col items-center justify-center text-center">
                  {/* CTA Buttons */}
                  <div className="flex flex-row gap-4 items-center justify-center">
                    <Button
                      onClick={() => setWaitlistOpen(true)}
                      className="bg-[#c8a46e] hover:bg-[#b8956a] font-permanent-marker text-xl px-8 py-6 rounded-xl transition-all shadow-[0_0_25px_rgba(200,164,110,0.25)] hover:shadow-[0_0_40px_rgba(200,164,110,0.35)]"
                      style={{ color: '#1a1a1a' }}>
                      
                      {language === 'en' ? 'GET BETA' : 'OBTÉN BETA'}
                      <ChevronRight className="ml-1 h-5 w-5" style={{ color: '#1a1a1a', stroke: '#1a1a1a' }} />
                    </Button>
                    
                    <button
                      onClick={() => setTrailerOpen(true)}
                      className="font-permanent-marker text-sm px-6 py-3 h-auto rounded-xl border-2 bg-transparent hover:bg-[#c8a46e]/10 transition-all duration-300 flex items-center gap-2 cursor-pointer"
                      style={{
                        borderColor: '#c8a46e',
                        boxShadow: '0 0 15px rgba(200, 164, 110, 0.25), inset 0 0 15px rgba(200, 164, 110, 0.05)'
                      }}>
                      
                      <Video className="h-5 w-5" style={{ color: '#1a1a1a', fill: '#1a1a1a', stroke: '#1a1a1a' }} />
                      <span className="tracking-wider" style={{ color: '#c8a46e' }}>TRAILER</span>
                    </button>
                  </div>
              </div>
            </div>
          </section>

          {/* Waitlist Dialog */}
          <Dialog open={waitlistOpen} onOpenChange={setWaitlistOpen}>
            <DialogContent className="sm:max-w-md bg-[#141414] border border-[#c8a46e]/20 shadow-[0_0_60px_rgba(200,164,110,0.08)]">
              <div className="text-center">
                <h3 className="font-permanent-marker text-2xl mb-1" style={{ color: '#c8a46e' }}>
                  {language === 'en' ? 'Get the Beta' : 'Obtén la Beta'}
                </h3>
                <p className="font-sedgwick-ave text-[#b8956a]/50 text-sm mb-4">
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
                  className="font-sedgwick-ave bg-white/5 border-[#c8a46e]/20 text-[#d4b896] placeholder:text-[#b8956a]/30 focus:border-[#c8a46e]/50 rounded-xl" />
                
                <Button
                  type="submit" disabled={loading}
                  className="w-full bg-[#c8a46e] hover:bg-[#b8956a] font-permanent-marker text-lg rounded-xl shadow-[0_0_20px_rgba(200,164,110,0.2)]"
                  style={{ color: '#1a1a1a' }}>
                  
                  {loading ? language === 'en' ? 'Sending...' : 'Enviando...' : language === 'en' ? 'GET BETA' : 'OBTÉN BETA'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          {/* Trailer Dialog */}
          <Dialog open={trailerOpen} onOpenChange={setTrailerOpen}>
            <DialogContent className="sm:max-w-4xl p-0 bg-black border-[#c8a46e]/10">
              <div className="aspect-video">
                <iframe width="100%" height="100%" src={trailerOpen ? "https://www.youtube.com/embed/RHj_lCvC9xw?autoplay=1" : ""} title="GreenHunt Trailer" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="rounded-lg" />
              </div>
            </DialogContent>
          </Dialog>


          {/* ═══════════════ Final Beta CTA ═══════════════ */}
          <section id="waitlist" className="relative py-20 px-4">
            <div className="container mx-auto max-w-3xl text-center relative z-10">
              <div className="relative overflow-hidden rounded-3xl border border-[#c8a46e]/15 bg-gradient-to-br from-[#141414] via-[#111] to-[#0d0d0d] p-10 md:p-14">
                {/* Decorative glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-60 h-40 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: '#c8a46e' }} />
                <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full opacity-5 blur-2xl" style={{ backgroundColor: '#c8a46e' }} />
                
                <div className="relative z-10">
                  <h2 className="text-3xl md:text-4xl font-permanent-marker mb-3" style={{ color: '#c8a46e' }}>
                    {t('landing.beta.title')}
                  </h2>
                  <p className="text-[#b8956a]/50 font-sedgwick-ave mb-8 text-lg">
                    {t('landing.beta.description')}
                  </p>
                  <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <Input
                      type="email"
                      placeholder={t('landing.beta.placeholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required disabled={loading}
                      className="flex-1 bg-white/5 border-[#c8a46e]/15 text-[#d4b896] placeholder:text-[#b8956a]/30 rounded-xl font-sedgwick-ave text-lg" />
                    
                    <Button
                      type="submit" disabled={loading}
                      className="bg-[#c8a46e] hover:bg-[#b8956a] font-permanent-marker rounded-xl px-8 text-lg shadow-[0_0_25px_rgba(200,164,110,0.2)]"
                      style={{ color: '#1a1a1a' }}>
                      {loading ? t('landing.beta.loading') : t('landing.beta.cta')}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="relative py-14 px-4 border-t border-[#c8a46e]/10">
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
                  className="hover:opacity-80 transition-colors font-permanent-marker text-base"
                  style={{ color: '#b8956a' }}>
                  
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
                  className="hover:scale-125 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(200,164,110,0.6)]"
                  style={{ color: '#c8a46e' }}>
                  
                    {social.icon}
                  </a>
                )}
              </div>

              {/* Línea divisora */}
              <div className="w-full h-px mb-6" style={{ background: 'linear-gradient(90deg, transparent, #b8956a, #c8a46e, #b8956a, transparent)' }} />

              {/* Eslogan y email */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <span className="font-sedgwick-ave text-lg" style={{ color: '#c8a46e' }}>{t('landing.footer.madeWith')}</span>
                  <span className="text-xl">💚</span>
                  <span className="font-sedgwick-ave text-lg" style={{ color: '#c8a46e' }}>{t('landing.footer.forPlanet')}</span>
                  <span className="text-xl">🌍</span>
                </div>
                <a href="mailto:hello@greenhunt.net" className="font-sedgwick-ave text-lg hover:scale-105 transition-all" style={{ color: '#b8956a' }}>
                  hello@greenhunt.net
                </a>
              </div>
            </div>
          </footer>

          {/* Bottom Right Buttons */}
          <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
            {/* Scroll to top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="font-permanent-marker px-4 py-3 rounded-xl hover:scale-105 transition-all"
              style={{
                backgroundColor: '#c8a46e',
                color: '#1a1a1a',
                boxShadow: '0 0 15px rgba(200, 164, 110, 0.3)'
              }}
              aria-label={language === 'en' ? 'Go to top' : 'Ir al principio'}>
              <ArrowUp className="h-5 w-5" style={{ color: '#1a1a1a', stroke: '#1a1a1a' }} />
            </button>
            
            {/* Language toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
              className="font-permanent-marker px-4 py-3 rounded-xl hover:scale-105 transition-all tracking-wider text-sm"
              style={{
                backgroundColor: 'transparent',
                color: '#c8a46e',
                border: '2px solid #c8a46e',
                boxShadow: '0 0 15px rgba(200, 164, 110, 0.15), inset 0 0 15px rgba(200, 164, 110, 0.05)'
              }}>
              {language === 'en' ? 'ES' : 'EN'}
            </button>
          </div>
        </div>
      </div>
    </div>);

}