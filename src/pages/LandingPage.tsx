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
import tutorialStep2 from "@/assets/tutorial-step-2.png";
import appStoreBadges from "@/assets/app-store-badges.png";
import playForPlanetScreen from "@/assets/play-for-planet-screen.png";
import valueProp1 from "@/assets/value-prop-1.png";
import valueProp2 from "@/assets/value-prop-2.png";
import valueProp3 from "@/assets/value-prop-3.png";
import appMapScreen from "@/assets/app-map-screen-new.png";
import stoneTagline from "@/assets/stone-tagline-new.png";
import rescueMap from "@/assets/rescue-map.png";

const emailSchema = z.string().email();




/* ─── Step card component ─── */
const StepCard = ({ number, image, alt, text }: {number: number;image: string;alt: string;text: string;}) =>
<div className="group relative flex flex-col items-center text-center">
    {/* Step number badge */}
    <div className="absolute -top-4 -left-2 z-20 w-10 h-10 rounded-full flex items-center justify-center font-permanent-marker text-lg border-2"
  style={{ backgroundColor: '#1a1a1a', borderColor: '#b4fa74', color: '#b4fa74' }}>
      {number}
    </div>
    {/* Card */}
    <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-1 transition-all duration-300 group-hover:border-white/20 group-hover:shadow-[0_0_30px_rgba(180,250,116,0.08)]">
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
      <h2 className="text-3xl md:text-5xl font-permanent-marker mb-5 leading-tight" style={{ color: '#b4fa74' }}>
        {title}
      </h2>
      <div className="w-16 h-1 rounded-full mb-6" style={{ backgroundColor: '#b4fa74', opacity: 0.5 }} />
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

          {/* Stone Tagline */}
          <div className="-mx-4 md:-mx-12 lg:-mx-24 xl:-mx-32 flex justify-center py-8 md:py-12">
            <img 
              src={stoneTagline} 
              alt="Your city is like a board game where valuable free finds suddenly appear!" 
              className="w-[85%] sm:w-[70%] md:w-[50%] lg:w-[40%] xl:w-[35%] h-auto"
              loading="lazy"
            />
          </div>

          {/* ═══════════════ App Promo & CTA ═══════════════ */}
          <section className="px-4 py-16 relative overflow-hidden">
            <div className="container mx-auto max-w-6xl relative z-10">
              <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center justify-between">
                {/* Left */}
                <div className="flex-1 text-center lg:text-left">
                  <h2 className="font-permanent-marker text-3xl md:text-4xl lg:text-5xl mb-4" style={{ color: '#b4fa74' }}>
                    {t('landing.app.title')}
                  </h2>
                  <div className="w-16 h-1 rounded-full mx-auto lg:mx-0 mb-5" style={{ backgroundColor: '#b4fa74', opacity: 0.5 }} />
                  <p className="font-sedgwick-ave text-subtitle-styled text-xl md:text-2xl max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed whitespace-pre-line">
                    {t('landing.app.subtitle')}
                  </p>
                  
                  {/* CTA Buttons */}
                  <div className="flex flex-row gap-4 items-center justify-center lg:justify-start mt-4">
                    <Button
                      onClick={() => setWaitlistOpen(true)}
                      className="bg-[#b4fa74] hover:bg-[#a2e866] font-permanent-marker text-xl px-8 py-6 rounded-xl transition-all shadow-[0_0_25px_rgba(180,250,116,0.25)] hover:shadow-[0_0_40px_rgba(180,250,116,0.35)]"
                      style={{ color: '#0a0a0a' }}>
                      
                      {language === 'en' ? 'GET BETA' : 'OBTÉN BETA'}
                      <ChevronRight className="ml-1 h-5 w-5" style={{ color: '#0a0a0a', stroke: '#0a0a0a' }} />
                    </Button>
                    
                    <button
                      onClick={() => setTrailerOpen(true)}
                      className="font-permanent-marker text-sm px-6 py-3 h-auto rounded-xl border-2 bg-transparent hover:bg-[#b4fa74]/10 transition-all duration-300 flex items-center gap-2 cursor-pointer"
                      style={{
                        borderColor: '#b4fa74',
                        boxShadow: '0 0 15px rgba(180, 250, 116, 0.25), inset 0 0 15px rgba(180, 250, 116, 0.05)'
                      }}>
                      
                      <Video className="h-5 w-5" style={{ color: '#611a5a', fill: '#611a5a', stroke: '#611a5a' }} />
                      <span className="tracking-wider" style={{ color: '#b4fa74' }}>TRAILER</span>
                    </button>
                  </div>
                  
                  {/* App Store Badges */}
                  <div className="flex flex-col items-center lg:items-start mt-10">
                    <img src={appStoreBadges} alt="Available on App Store and Google Play" className="w-[280px] md:w-[320px] h-auto opacity-80" style={{ mixBlendMode: 'screen' }} />
                    <p style={{ color: '#b4fa74' }} className="font-sedgwick-ave text-2xl md:text-3xl mt-2 opacity-70">
                      coming soon
                    </p>
                  </div>
                </div>
                
                {/* Right - Phone */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute -inset-8 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: '#b4fa74' }} />
                    <img
                      alt="GreenHunt App Screenshot"
                      className="relative h-96 md:h-[550px] lg:h-[700px] w-auto object-contain drop-shadow-2xl"
                      loading="lazy"
                      src={appMapScreen}
                    />
                    
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Waitlist Dialog */}
          <Dialog open={waitlistOpen} onOpenChange={setWaitlistOpen}>
            <DialogContent className="sm:max-w-md bg-[#141414] border border-white/10 shadow-[0_0_60px_rgba(180,250,116,0.08)]">
              <div className="text-center">
                <h3 className="font-permanent-marker text-2xl mb-1" style={{ color: '#b4fa74' }}>
                  {language === 'en' ? 'Get the Beta' : 'Obtén la Beta'}
                </h3>
                <p className="font-sedgwick-ave text-white/50 text-sm mb-4">
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
                  className="font-sedgwick-ave bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:border-[#b4fa74]/50 rounded-xl" />
                
                <Button
                  type="submit" disabled={loading}
                  className="w-full bg-[#b4fa74] hover:bg-[#a2e866] font-permanent-marker text-lg rounded-xl shadow-[0_0_20px_rgba(180,250,116,0.2)]"
                  style={{ color: '#0a0a0a' }}>
                  
                  {loading ? language === 'en' ? 'Sending...' : 'Enviando...' : language === 'en' ? 'GET BETA' : 'OBTÉN BETA'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          {/* Trailer Dialog */}
          <Dialog open={trailerOpen} onOpenChange={setTrailerOpen}>
            <DialogContent className="sm:max-w-4xl p-0 bg-black border-white/10">
              <div className="aspect-video">
                <iframe width="100%" height="100%" src={trailerOpen ? "https://www.youtube.com/embed/RHj_lCvC9xw?autoplay=1" : ""} title="GreenHunt Trailer" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="rounded-lg" />
              </div>
            </DialogContent>
          </Dialog>

          {/* ═══════════════ Value Propositions ═══════════════ */}
          {/* --- Value Prop 1: Snap & Save --- */}
          <section className="py-16 md:py-24 px-4 relative overflow-hidden">
            <div className="container mx-auto max-w-6xl relative z-10">
              <div className="text-center mb-14">
                <h2 style={{ color: '#b4fa74' }} className="text-3xl md:text-5xl font-permanent-marker mb-3">
                  {t('landing.tutorial.title')}
                </h2>
                <div className="w-20 h-1 rounded-full mx-auto" style={{ backgroundColor: '#b4fa74', opacity: 0.4 }} />
              </div>

              <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                <div className="flex-1 order-2 md:order-1">
                  <h3 className="text-2xl md:text-4xl font-permanent-marker mb-4" style={{ color: '#b4fa74' }}>
                    {t('landing.valueProp1.title')}
                  </h3>
                  <p className="text-subtitle-styled text-xl md:text-3xl leading-relaxed">
                    {t('landing.valueProp1.text')}
                  </p>
                </div>
                <div className="flex-1 order-1 md:order-2 max-w-sm md:max-w-md">
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-1 group hover:border-white/20 hover:shadow-[0_0_30px_rgba(180,250,116,0.08)] transition-all duration-300">
                    <img src={valueProp1} alt="Save the planet by snapping photos" className="w-full rounded-xl object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* --- Value Prop 2: Grab & Rescue --- */}
          <section className="py-16 md:py-24 px-4 relative overflow-hidden">
            <div className="container mx-auto max-w-6xl relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                <div className="flex-1 max-w-xs md:max-w-sm">
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-1 group hover:border-white/20 hover:shadow-[0_0_30px_rgba(180,250,116,0.08)] transition-all duration-300">
                    <img src={valueProp2} alt="Get free stuff in your city" className="w-full rounded-xl object-cover" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl md:text-4xl font-permanent-marker mb-4" style={{ color: '#b4fa74' }}>
                    {t('landing.valueProp2.title')}
                  </h3>
                  <p className="text-subtitle-styled text-xl md:text-3xl leading-relaxed">
                    {t('landing.valueProp2.text')}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* --- Value Prop 3: Track & Compete --- */}
          <section className="py-16 md:py-24 px-4 relative overflow-hidden">
            <div className="container mx-auto max-w-6xl relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                <div className="flex-1 order-2 md:order-1">
                  <h3 className="text-2xl md:text-4xl font-permanent-marker mb-4" style={{ color: '#b4fa74' }}>
                    {t('landing.valueProp3.title')}
                  </h3>
                  <p className="text-subtitle-styled text-xl md:text-3xl leading-relaxed">
                    {t('landing.valueProp3.text')}
                  </p>
                </div>
                <div className="flex-1 order-1 md:order-2 max-w-xs md:max-w-sm">
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-1 group hover:border-white/20 hover:shadow-[0_0_30px_rgba(180,250,116,0.08)] transition-all duration-300">
                    <img src={valueProp3} alt="Track your impact and compete" className="w-full rounded-xl object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════════ Play for the Planet ═══════════════ */}
          <section className="py-20 md:py-28 px-4 relative overflow-hidden">
            <div className="container mx-auto max-w-6xl relative z-10">
              <FeatureRow
                title={t('landing.playPlanet.title')}
                subtitle={t('landing.playPlanet.subtitle')}
                image={playForPlanetScreen}
                alt="Play for the Planet - GreenHunt App" />
            </div>
          </section>

          {/* ═══════════════ Final Beta CTA ═══════════════ */}
          <section id="waitlist" className="relative py-20 px-4">
            <div className="container mx-auto max-w-3xl text-center relative z-10">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#141414] via-[#111] to-[#0d1a0d] p-10 md:p-14">
                {/* Decorative glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-60 h-40 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: '#b4fa74' }} />
                <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full opacity-5 blur-2xl" style={{ backgroundColor: '#b4fa74' }} />
                
                <div className="relative z-10">
                  <h2 className="text-3xl md:text-4xl font-permanent-marker mb-3" style={{ color: '#b4fa74' }}>
                    {t('landing.beta.title')}
                  </h2>
                  <p className="text-white/50 font-sedgwick-ave mb-8 text-lg">
                    {t('landing.beta.description')}
                  </p>
                  <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <Input
                      type="email"
                      placeholder={t('landing.beta.placeholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required disabled={loading}
                      className="flex-1 bg-white/5 border-white/15 text-white placeholder:text-white/30 rounded-xl font-sedgwick-ave text-lg" />
                    
                    <Button
                      type="submit" disabled={loading}
                      className="bg-[#b4fa74] hover:bg-[#a2e866] font-permanent-marker rounded-xl px-8 text-lg shadow-[0_0_25px_rgba(180,250,116,0.2)]"
                      style={{ color: '#0a0a0a' }}>
                      {loading ? t('landing.beta.loading') : t('landing.beta.cta')}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="relative py-14 px-4 border-t border-white/5">
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
                  className="text-white/40 hover:text-white/80 transition-colors font-permanent-marker text-base">
                  
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
                  className="hover:scale-125 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(180,250,116,0.6)]"
                  style={{ color: '#b4fa74' }}>
                  
                    {social.icon}
                  </a>
                )}
              </div>

              {/* Línea divisora verde */}
              <div className="w-full h-px mb-6" style={{ background: 'linear-gradient(90deg, transparent, #a2c041, #b4fa74, #a2c041, transparent)' }} />

              {/* Eslogan y email */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <span className="font-sedgwick-ave text-lg" style={{ color: '#b4fa74' }}>{t('landing.footer.madeWith')}</span>
                  <span className="text-xl">💚</span>
                  <span className="font-sedgwick-ave text-lg" style={{ color: '#b4fa74' }}>{t('landing.footer.forPlanet')}</span>
                  <span className="text-xl">🌍</span>
                </div>
                <a href="mailto:hello@greenhunt.net" className="font-sedgwick-ave text-lg hover:scale-105 transition-all" style={{ color: '#a2c041' }}>
                  hello@greenhunt.net
                </a>
              </div>
            </div>
          </footer>

          {/* Bottom Right Buttons */}
          <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
            {/* Scroll to top - solid green fill style (like GET BETA) */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="font-permanent-marker px-4 py-3 rounded-xl hover:scale-105 transition-all"
              style={{
                backgroundColor: '#b4fa74',
                color: '#611a5a',
                boxShadow: '0 0 15px rgba(180, 250, 116, 0.3)'
              }}
              aria-label={language === 'en' ? 'Go to top' : 'Ir al principio'}>
              <ArrowUp className="h-5 w-5" style={{ color: '#611a5a', stroke: '#611a5a' }} />
            </button>
            
            {/* Language toggle - outlined style (like TRAILER) */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
              className="font-permanent-marker px-4 py-3 rounded-xl hover:scale-105 transition-all tracking-wider text-sm"
              style={{
                backgroundColor: 'transparent',
                color: '#b4fa74',
                border: '2px solid #b4fa74',
                boxShadow: '0 0 15px rgba(180, 250, 116, 0.15), inset 0 0 15px rgba(180, 250, 116, 0.05)'
              }}>
              {language === 'en' ? 'ES' : 'EN'}
            </button>
          </div>
        </div>
      </div>
    </div>);

}