import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Linkedin, Instagram, Youtube, ArrowUp, Video, ChevronRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useState } from "react";
import { StructuredData } from "@/components/StructuredData";
import { HeroSection } from "@/components/HeroSection";
import greenhuntLogoNew from "@/assets/greenhunt-logo-new.svg";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import tutorialStep2 from "@/assets/tutorial-step-2.png";
import thriftingStep2 from "@/assets/thrifting-step-2.png";
import thriftingStep3 from "@/assets/thrifting-step-3.png";
import junkStep3 from "@/assets/junk-step-3.png";
import junkRemovalFlow from "@/assets/junk-removal-flow.png";
import appStoreBadges from "@/assets/app-store-badges.png";
import playForPlanetScreen from "@/assets/play-for-planet-screen.png";
import { MarginBackgrounds } from "@/components/MarginBackgrounds";

const emailSchema = z.string().email();

/* ─── Floating particles background ─── */
const FloatingParticles = ({ count = 6, color = '#b4fa74' }: { count?: number; color?: string }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full"
        style={{
          width: `${3 + (i % 4) * 2}px`,
          height: `${3 + (i % 4) * 2}px`,
          backgroundColor: color,
          opacity: 0.08 + (i % 3) * 0.06,
          left: `${10 + (i * 17) % 80}%`,
          top: `${5 + (i * 23) % 90}%`,
          animation: `float-particle-${i % 3} ${8 + i * 2}s ease-in-out infinite`,
        }}
      />
    ))}
  </div>
);

/* ─── Pulsing orb accent ─── */
const PulsingOrb = ({ size = 120, top, left, right, bottom, delay = 0 }: { size?: number; top?: string; left?: string; right?: string; bottom?: string; delay?: number }) => (
  <div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      backgroundColor: '#b4fa74',
      opacity: 0.06,
      filter: `blur(${size / 2}px)`,
      top, left, right, bottom,
      animation: `pulse-glow 4s ease-in-out ${delay}s infinite alternate`,
    }}
  />
);

/* ─── Reusable section divider ─── */
const SectionDivider = () => (
  <div className="flex items-center justify-center py-4">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    <div className="mx-4 w-2 h-2 rounded-full animate-[pulse_3s_ease-in-out_infinite]" style={{ backgroundColor: '#b4fa74' }} />
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  </div>
);

/* ─── Step card component ─── */
const StepCard = ({ number, image, alt, text }: { number: number; image: string; alt: string; text: string }) => (
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
        src={image} 
      />
    </div>
    <p className="font-sedgwick-ave text-subtitle-styled text-xl md:text-2xl mt-5 leading-relaxed px-2">
      {text}
    </p>
  </div>
);

/* ─── Feature row (alternating layout) ─── */
const FeatureRow = ({ title, subtitle, image, alt, reverse = false }: { 
  title: string; subtitle: string; image: string; alt: string; reverse?: boolean 
}) => (
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
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden relative">
      
      
      <div className="relative z-10">
        <div className="mx-4 md:mx-12 lg:mx-24 xl:mx-32 bg-[#0a0a0a] min-h-screen">
          <StructuredData />
          
          {/* Hero Section */}
          <HeroSection className="my-0 py-[80px]" />

          <SectionDivider />

          {/* ═══════════════ App Promo & CTA ═══════════════ */}
          <section className="px-4 py-16 relative overflow-hidden">
            {/* Circular economy animated background - collaboration network */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Large SVG animated network representing local collaboration */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
                {/* Rotating outer ring */}
                <g style={{ transformOrigin: '600px 400px', animation: 'spin-slow 60s linear infinite' }}>
                  <circle cx="600" cy="400" r="340" fill="none" stroke="#b4fa74" strokeWidth="1" opacity="0.08" strokeDasharray="20 10" />
                  <circle cx="600" cy="400" r="280" fill="none" stroke="#b4fa74" strokeWidth="0.8" opacity="0.06" strokeDasharray="8 16" />
                </g>
                <g style={{ transformOrigin: '600px 400px', animation: 'spin-slow 45s linear infinite reverse' }}>
                  <circle cx="600" cy="400" r="220" fill="none" stroke="#b4fa74" strokeWidth="1.2" opacity="0.1" strokeDasharray="12 8" />
                </g>

                {/* Animated connection paths between "actors" */}
                {/* Path 1: Hunter → Store */}
                <path d="M200,200 Q400,100 600,180" fill="none" stroke="#b4fa74" strokeWidth="1.5" opacity="0.15" strokeDasharray="6 4">
                  <animate attributeName="stroke-dashoffset" from="0" to="-100" dur="4s" repeatCount="indefinite" />
                </path>
                {/* Path 2: Store → Recycler */}
                <path d="M600,180 Q800,250 950,400" fill="none" stroke="#b4fa74" strokeWidth="1.5" opacity="0.12" strokeDasharray="6 4">
                  <animate attributeName="stroke-dashoffset" from="0" to="-100" dur="5s" repeatCount="indefinite" />
                </path>
                {/* Path 3: Recycler → Community */}
                <path d="M950,400 Q850,600 600,650" fill="none" stroke="#b4fa74" strokeWidth="1.5" opacity="0.12" strokeDasharray="6 4">
                  <animate attributeName="stroke-dashoffset" from="0" to="-100" dur="4.5s" repeatCount="indefinite" />
                </path>
                {/* Path 4: Community → Hunter (closing the circle) */}
                <path d="M600,650 Q350,600 200,200" fill="none" stroke="#b4fa74" strokeWidth="1.5" opacity="0.15" strokeDasharray="6 4">
                  <animate attributeName="stroke-dashoffset" from="0" to="-100" dur="5.5s" repeatCount="indefinite" />
                </path>
                {/* Cross paths - inner collaboration */}
                <path d="M200,200 Q500,400 950,400" fill="none" stroke="#b4fa74" strokeWidth="0.8" opacity="0.06" strokeDasharray="4 8">
                  <animate attributeName="stroke-dashoffset" from="0" to="-80" dur="6s" repeatCount="indefinite" />
                </path>
                <path d="M600,180 Q500,450 600,650" fill="none" stroke="#b4fa74" strokeWidth="0.8" opacity="0.06" strokeDasharray="4 8">
                  <animate attributeName="stroke-dashoffset" from="0" to="-80" dur="7s" repeatCount="indefinite" />
                </path>

                {/* Node hubs - represent different actors */}
                {/* Hunter node */}
                <g>
                  <circle cx="200" cy="200" r="18" fill="#b4fa74" opacity="0.08">
                    <animate attributeName="r" values="16;22;16" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.06;0.15;0.06" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="200" cy="200" r="6" fill="#b4fa74" opacity="0.3" />
                  <circle cx="200" cy="200" r="30" fill="none" stroke="#b4fa74" opacity="0.08" strokeWidth="0.5">
                    <animate attributeName="r" values="28;38;28" dur="4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.08;0.02;0.08" dur="4s" repeatCount="indefinite" />
                  </circle>
                </g>
                {/* Store node */}
                <g>
                  <circle cx="600" cy="180" r="18" fill="#b4fa74" opacity="0.08">
                    <animate attributeName="r" values="16;22;16" dur="3.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.06;0.15;0.06" dur="3.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="600" cy="180" r="6" fill="#b4fa74" opacity="0.3" />
                  <circle cx="600" cy="180" r="30" fill="none" stroke="#b4fa74" opacity="0.08" strokeWidth="0.5">
                    <animate attributeName="r" values="28;38;28" dur="4.5s" repeatCount="indefinite" />
                  </circle>
                </g>
                {/* Recycler node */}
                <g>
                  <circle cx="950" cy="400" r="18" fill="#b4fa74" opacity="0.08">
                    <animate attributeName="r" values="16;24;16" dur="4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.06;0.15;0.06" dur="4s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="950" cy="400" r="7" fill="#b4fa74" opacity="0.25" />
                  <circle cx="950" cy="400" r="32" fill="none" stroke="#b4fa74" opacity="0.06" strokeWidth="0.5">
                    <animate attributeName="r" values="30;42;30" dur="5s" repeatCount="indefinite" />
                  </circle>
                </g>
                {/* Community node */}
                <g>
                  <circle cx="600" cy="650" r="20" fill="#b4fa74" opacity="0.08">
                    <animate attributeName="r" values="18;26;18" dur="3.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.06;0.14;0.06" dur="3.8s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="600" cy="650" r="7" fill="#b4fa74" opacity="0.25" />
                  <circle cx="600" cy="650" r="34" fill="none" stroke="#b4fa74" opacity="0.06" strokeWidth="0.5">
                    <animate attributeName="r" values="32;44;32" dur="4.2s" repeatCount="indefinite" />
                  </circle>
                </g>

                {/* Traveling particles along paths - represent exchanges */}
                <circle r="3" fill="#b4fa74" opacity="0.5">
                  <animateMotion dur="4s" repeatCount="indefinite" path="M200,200 Q400,100 600,180" />
                  <animate attributeName="opacity" values="0.1;0.6;0.1" dur="4s" repeatCount="indefinite" />
                </circle>
                <circle r="3" fill="#b4fa74" opacity="0.5">
                  <animateMotion dur="5s" repeatCount="indefinite" path="M600,180 Q800,250 950,400" />
                  <animate attributeName="opacity" values="0.1;0.6;0.1" dur="5s" repeatCount="indefinite" />
                </circle>
                <circle r="3" fill="#b4fa74" opacity="0.5">
                  <animateMotion dur="4.5s" repeatCount="indefinite" path="M950,400 Q850,600 600,650" />
                  <animate attributeName="opacity" values="0.1;0.6;0.1" dur="4.5s" repeatCount="indefinite" />
                </circle>
                <circle r="3" fill="#b4fa74" opacity="0.5">
                  <animateMotion dur="5.5s" repeatCount="indefinite" path="M600,650 Q350,600 200,200" />
                  <animate attributeName="opacity" values="0.1;0.6;0.1" dur="5.5s" repeatCount="indefinite" />
                </circle>
                {/* Extra traveling particles for density */}
                <circle r="2" fill="#b4fa74" opacity="0.3">
                  <animateMotion dur="6s" repeatCount="indefinite" path="M200,200 Q500,400 950,400" />
                  <animate attributeName="opacity" values="0.05;0.4;0.05" dur="6s" repeatCount="indefinite" />
                </circle>
                <circle r="2" fill="#b4fa74" opacity="0.3">
                  <animateMotion dur="7s" repeatCount="indefinite" path="M600,180 Q500,450 600,650" />
                  <animate attributeName="opacity" values="0.05;0.4;0.05" dur="7s" repeatCount="indefinite" />
                </circle>

                {/* Small scattered dots - represent activity */}
                {[
                  [150, 350], [300, 500], [450, 300], [750, 550], [850, 250], [400, 150], [700, 700], [100, 500], [900, 600], [500, 550],
                  [350, 250], [800, 350], [250, 600], [650, 450], [1000, 300]
                ].map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r={1 + (i % 3)} fill="#b4fa74" opacity={0.05 + (i % 5) * 0.03}>
                    <animate attributeName="opacity" values={`${0.03 + (i % 4) * 0.02};${0.15 + (i % 3) * 0.05};${0.03 + (i % 4) * 0.02}`} dur={`${3 + i * 0.3}s`} repeatCount="indefinite" />
                  </circle>
                ))}
              </svg>

              {/* Radial glow behind center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[800px] md:h-[800px] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #b4fa74 0%, transparent 70%)' }} />
            </div>
            <FloatingParticles count={10} />
            <PulsingOrb size={220} top="-80px" left="-100px" delay={0} />
            <PulsingOrb size={160} bottom="-60px" right="-80px" delay={1.5} />
            <div className="container mx-auto max-w-6xl relative z-10">
              <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center justify-between">
                {/* Left */}
                <div className="flex-1 text-center lg:text-left">
                  <h2 className="font-permanent-marker text-3xl md:text-4xl lg:text-5xl mb-4" style={{ color: '#b4fa74' }}>
                    {t('landing.app.title')}
                  </h2>
                  <div className="w-16 h-1 rounded-full mx-auto lg:mx-0 mb-5" style={{ backgroundColor: '#b4fa74', opacity: 0.5 }} />
                  <p className="font-sedgwick-ave text-subtitle-styled text-xl md:text-2xl max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                    {t('landing.app.subtitle')}
                  </p>
                  
                  {/* CTA Buttons */}
                  <div className="flex flex-row gap-4 items-center justify-center lg:justify-start">
                    <Button 
                      onClick={() => setWaitlistOpen(true)} 
                      className="bg-[#b4fa74] hover:bg-[#a2e866] font-permanent-marker text-xl px-8 py-6 rounded-xl transition-all shadow-[0_0_25px_rgba(180,250,116,0.25)] hover:shadow-[0_0_40px_rgba(180,250,116,0.35)]"
                      style={{ color: '#0a0a0a' }}
                    >
                      {language === 'en' ? 'GET BETA' : 'OBTÉN BETA'}
                      <ChevronRight className="ml-1 h-5 w-5" style={{ color: '#0a0a0a', stroke: '#0a0a0a' }} />
                    </Button>
                    
                    <Button 
                      onClick={() => setTrailerOpen(true)} 
                      variant="outline" 
                      className="font-permanent-marker text-sm px-5 py-3 h-auto rounded-xl border-white/20 hover:border-white/40 hover:bg-white/5"
                      style={{ color: '#fff' }}
                    >
                      <Video className="mr-1 h-4 w-4" style={{ color: '#fff', stroke: '#fff' }} />
                      <span style={{ color: '#fff' }}>Trailer</span>
                    </Button>
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
                      src="/lovable-uploads/8759250d-dd73-492b-977a-129c0e98d572.png" 
                      style={{ mixBlendMode: 'screen' }}
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
                  className="font-sedgwick-ave bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:border-[#b4fa74]/50 rounded-xl" 
                />
                <Button 
                  type="submit" disabled={loading} 
                  className="w-full bg-[#b4fa74] hover:bg-[#a2e866] font-permanent-marker text-lg rounded-xl shadow-[0_0_20px_rgba(180,250,116,0.2)]"
                  style={{ color: '#0a0a0a' }}
                >
                  {loading ? (language === 'en' ? 'Sending...' : 'Enviando...') : (language === 'en' ? 'GET BETA' : 'OBTÉN BETA')}
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

          <SectionDivider />

          {/* ═══════════════ Beta CTA Strip ═══════════════ */}
          <section className="py-10 px-4 relative">
            <FloatingParticles count={4} />
            <div className="container mx-auto max-w-3xl">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-[#141414] to-[#1a1a1a] p-8 md:p-10">
                {/* Glow accent */}
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: '#b4fa74' }} />
                
                <div className="relative z-10 text-center">
                  <h2 className="text-2xl md:text-3xl font-permanent-marker mb-2" style={{ color: '#b4fa74' }}>
                    {t('landing.beta.title')}
                  </h2>
                  <p className="text-white/60 font-sedgwick-ave mb-6 text-lg">
                    {t('landing.beta.description')}
                  </p>
                  <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <Input 
                      type="email" 
                      placeholder={t('landing.beta.placeholder')} 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required disabled={loading} 
                      className="flex-1 bg-white/5 border-white/15 text-white placeholder:text-white/30 rounded-xl font-sedgwick-ave" 
                    />
                    <Button 
                      type="submit" disabled={loading} 
                      className="bg-[#b4fa74] hover:bg-[#a2e866] font-permanent-marker rounded-xl px-6 whitespace-nowrap"
                      style={{ color: '#0a0a0a' }}
                    >
                      {loading ? t('landing.beta.joining') : t('landing.beta.button')}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </section>

          <SectionDivider />

          {/* ═══════════════ Tutorial / Stooping ═══════════════ */}
          <section className="py-16 md:py-24 px-4 relative">
            <FloatingParticles count={8} />
            <PulsingOrb size={160} top="-40px" right="-60px" delay={0} />
            <div className="container mx-auto max-w-6xl relative z-10">
              <div className="text-center mb-14">
                <h2 style={{ color: '#b4fa74' }} className="text-3xl md:text-5xl font-permanent-marker mb-3">
                  {t('landing.tutorial.title')}
                </h2>
                <div className="w-20 h-1 rounded-full mx-auto" style={{ backgroundColor: '#b4fa74', opacity: 0.4 }} />
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 md:gap-10">
                <StepCard 
                  number={1} 
                  image="/lovable-uploads/b2d445b9-fc2c-40d6-8b6f-4947539b949f.png" 
                  alt="Take photos of street finds" 
                  text={t('landing.tutorial.step1')} 
                />
                <StepCard 
                  number={2} 
                  image={tutorialStep2} 
                  alt="Make money when someone unlocks coordinates" 
                  text={t('landing.tutorial.step2')} 
                />
                <StepCard 
                  number={3} 
                  image="/lovable-uploads/c1d89d6c-343e-495a-8f4a-58d9ff2876f5.png" 
                  alt="Buy coordinates and get valuable items" 
                  text={t('landing.tutorial.disclaimer')} 
                />
              </div>
            </div>
          </section>

          <SectionDivider />

          {/* ═══════════════ Local Phygital Thrifting ═══════════════ */}
          <section className="py-16 md:py-24 px-4 relative">
            <FloatingParticles count={5} />
            <PulsingOrb size={140} bottom="-30px" left="-50px" delay={1.5} />
            <div className="container mx-auto max-w-6xl relative z-10">
              <div className="text-center mb-14">
                <h2 className="text-3xl md:text-5xl font-permanent-marker mb-3" style={{ color: '#b4fa74' }}>
                  {t('landing.thrifting.title')}
                </h2>
                <div className="w-20 h-1 rounded-full mx-auto" style={{ backgroundColor: '#b4fa74', opacity: 0.4 }} />
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 md:gap-10">
                <StepCard 
                  number={1} 
                  image="/lovable-uploads/199aa279-e2d7-4396-99dc-312cdf60c3d6.png" 
                  alt="Explore thrift store catalogs" 
                  text={t('landing.thrifting.step1')} 
                />
                <StepCard 
                  number={2} 
                  image={thriftingStep2} 
                  alt="Request pickup for donations" 
                  text={t('landing.thrifting.step2')} 
                />
                <StepCard 
                  number={3} 
                  image={thriftingStep3} 
                  alt="Create your own garage sale" 
                  text={t('landing.thrifting.step3')} 
                />
              </div>
            </div>
          </section>

          <SectionDivider />

          {/* ═══════════════ Waste Management ═══════════════ */}
          <section className="py-16 md:py-24 px-4 relative">
            <PulsingOrb size={180} top="20%" right="-80px" delay={0.5} />
            <FloatingParticles count={7} />
            <div className="container mx-auto max-w-6xl relative z-10">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-5xl font-permanent-marker mb-3" style={{ color: '#b4fa74' }}>
                  {t('landing.waste.title')}
                </h2>
                <div className="w-20 h-1 rounded-full mx-auto" style={{ backgroundColor: '#b4fa74', opacity: 0.4 }} />
              </div>
              
              {/* Flow Diagram */}
              <div className="mb-14 flex justify-center">
                <div className="relative rounded-2xl overflow-hidden border border-white/10 p-1 bg-gradient-to-b from-white/[0.03] to-transparent">
                  <img alt="Waste Management Flow" className="w-full max-w-4xl rounded-xl" loading="lazy" src="/lovable-uploads/a1848cb5-8abc-4f8a-bf63-c40c183e6fde.png" />
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 md:gap-10">
                <StepCard 
                  number={1} 
                  image="/lovable-uploads/746cc348-3ec5-4283-8ede-3caa2807ada7.png" 
                  alt="Share coordinates with team" 
                  text={t('landing.waste.step1')} 
                />
                <StepCard 
                  number={2} 
                  image="/lovable-uploads/4d4b3cc6-477f-46d2-b66e-1849b04e2072.png" 
                  alt="Optimized route navigation" 
                  text={t('landing.waste.step2')} 
                />
                <StepCard 
                  number={3} 
                  image="/lovable-uploads/318700f9-052e-424f-bb23-94c7e893031c.png" 
                  alt="Donate to local stores" 
                  text={t('landing.waste.step3')} 
                />
              </div>
            </div>
          </section>

          <SectionDivider />

          {/* ═══════════════ Junk Removal ═══════════════ */}
          <section className="py-16 md:py-24 px-4 relative">
            <FloatingParticles count={6} />
            <PulsingOrb size={150} bottom="10%" left="-40px" delay={2} />
            <div className="container mx-auto max-w-6xl relative z-10">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-5xl font-permanent-marker mb-3" style={{ color: '#b4fa74' }}>
                  {t('landing.junk.title')}
                </h2>
                <div className="w-20 h-1 rounded-full mx-auto" style={{ backgroundColor: '#b4fa74', opacity: 0.4 }} />
              </div>
              
              {/* Flow Diagram */}
              <div className="mb-14 flex justify-center">
                <div className="relative rounded-2xl overflow-hidden border border-white/10 p-1 bg-gradient-to-b from-white/[0.03] to-transparent">
                  <img src={junkRemovalFlow} alt="Junk Removal Flow" className="w-full max-w-4xl rounded-xl" loading="lazy" />
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 md:gap-10">
                <StepCard 
                  number={1} 
                  image="/lovable-uploads/ddb40b3c-aada-427a-ae3c-992bf6263692.png" 
                  alt="Take photos of junk" 
                  text={t('landing.junk.step1')} 
                />
                <StepCard 
                  number={2} 
                  image="/lovable-uploads/7af001b6-bb85-47b6-bc77-636a2a117ade.png" 
                  alt="Users bid for removal" 
                  text={t('landing.junk.step2')} 
                />
                <StepCard 
                  number={3} 
                  image={junkStep3} 
                  alt="Accept bid and schedule" 
                  text={t('landing.junk.step3')} 
                />
              </div>
            </div>
          </section>

          <SectionDivider />

          {/* ═══════════════ Play for the Planet ═══════════════ */}
          <section className="py-20 md:py-28 px-4 relative">
            <FloatingParticles count={4} />
            <PulsingOrb size={130} top="-20px" left="30%" delay={1} />
            <div className="container mx-auto max-w-6xl relative z-10">
              <FeatureRow 
                title={t('landing.playPlanet.title')} 
                subtitle={t('landing.playPlanet.subtitle')} 
                image={playForPlanetScreen} 
                alt="Play for the Planet - GreenHunt App" 
              />
            </div>
          </section>

          <SectionDivider />

          {/* ═══════════════ Strategic Partners ═══════════════ */}
          <section className="py-20 md:py-28 px-4 relative">
            <FloatingParticles count={8} />
            <PulsingOrb size={200} top="10%" left="-60px" delay={0} />
            <PulsingOrb size={120} bottom="20%" right="-40px" delay={2} />
            <div className="container mx-auto max-w-6xl relative z-10">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                  <h2 className="text-3xl md:text-5xl font-permanent-marker mb-5 leading-tight" style={{ color: '#b4fa74' }}>
                    {t('landing.strategic.title')}
                  </h2>
                  <div className="w-16 h-1 rounded-full mb-6" style={{ backgroundColor: '#b4fa74', opacity: 0.5 }} />
                  <p className="text-lg md:text-xl text-subtitle-styled font-sedgwick-ave leading-relaxed">
                    {t('landing.strategic.subtitle')}
                  </p>
                </div>
                <div className="order-1 lg:order-2 flex justify-center">
                  {/* Partnership network visual */}
                  <div className="relative w-72 h-72 md:w-96 md:h-96">
                    {/* Glow */}
                    <div className="absolute inset-0 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: '#b4fa74' }} />
                    {/* Outer rotating ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/10 animate-[spin_30s_linear_infinite]" />
                    {/* Middle counter-rotating ring */}
                    <div className="absolute inset-8 rounded-full border border-white/5 animate-[spin_20s_linear_infinite_reverse]" />
                    {/* Inner ring */}
                    <div className="absolute inset-16 rounded-full border border-white/[0.03]" />
                    
                    {/* Network nodes orbiting */}
                    {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                      <div key={i} className="absolute inset-0 animate-[spin_25s_linear_infinite]" style={{ animationDelay: `${-i * 4.17}s` }}>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 rounded-full border border-white/20 flex items-center justify-center"
                          style={{ animation: `pulse-glow 3s ease-in-out ${i * 0.5}s infinite alternate` }}>
                          <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full" style={{ backgroundColor: '#b4fa74', opacity: 0.6 + (i % 3) * 0.15 }} />
                        </div>
                      </div>
                    ))}

                    {/* Center icon - Network/Partnership */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent flex items-center justify-center shadow-[0_0_50px_rgba(180,250,116,0.12)]" style={{ transform: 'rotate(-3deg)' }}>
                          <svg viewBox="0 0 80 80" className="w-20 h-20 md:w-24 md:h-24" fill="none" stroke="#b4fa74" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            {/* Central hub */}
                            <circle cx="40" cy="40" r="8" fill="#b4fa74" opacity="0.15" stroke="#b4fa74" strokeWidth="1.5" />
                            <circle cx="40" cy="40" r="3" fill="#b4fa74" opacity="0.5" />
                            
                            {/* Partner nodes */}
                            <circle cx="18" cy="18" r="6" fill="#b4fa74" opacity="0.08" stroke="#b4fa74" />
                            <circle cx="62" cy="18" r="6" fill="#b4fa74" opacity="0.08" stroke="#b4fa74" />
                            <circle cx="18" cy="62" r="6" fill="#b4fa74" opacity="0.08" stroke="#b4fa74" />
                            <circle cx="62" cy="62" r="6" fill="#b4fa74" opacity="0.08" stroke="#b4fa74" />
                            <circle cx="40" cy="12" r="5" fill="#b4fa74" opacity="0.08" stroke="#b4fa74" />
                            <circle cx="40" cy="68" r="5" fill="#b4fa74" opacity="0.08" stroke="#b4fa74" />
                            
                            {/* Connection lines from center to nodes */}
                            <line x1="40" y1="40" x2="18" y2="18" stroke="#b4fa74" opacity="0.3" strokeDasharray="3 3" />
                            <line x1="40" y1="40" x2="62" y2="18" stroke="#b4fa74" opacity="0.3" strokeDasharray="3 3" />
                            <line x1="40" y1="40" x2="18" y2="62" stroke="#b4fa74" opacity="0.3" strokeDasharray="3 3" />
                            <line x1="40" y1="40" x2="62" y2="62" stroke="#b4fa74" opacity="0.3" strokeDasharray="3 3" />
                            <line x1="40" y1="40" x2="40" y2="12" stroke="#b4fa74" opacity="0.3" strokeDasharray="3 3" />
                            <line x1="40" y1="40" x2="40" y2="68" stroke="#b4fa74" opacity="0.3" strokeDasharray="3 3" />
                            
                            {/* Cross-connections between nodes */}
                            <line x1="18" y1="18" x2="62" y2="18" stroke="#b4fa74" opacity="0.12" />
                            <line x1="18" y1="62" x2="62" y2="62" stroke="#b4fa74" opacity="0.12" />
                            <line x1="18" y1="18" x2="18" y2="62" stroke="#b4fa74" opacity="0.12" />
                            <line x1="62" y1="18" x2="62" y2="62" stroke="#b4fa74" opacity="0.12" />
                            
                            {/* Small dots on nodes */}
                            <circle cx="18" cy="18" r="2.5" fill="#b4fa74" opacity="0.5" />
                            <circle cx="62" cy="18" r="2.5" fill="#b4fa74" opacity="0.5" />
                            <circle cx="18" cy="62" r="2.5" fill="#b4fa74" opacity="0.5" />
                            <circle cx="62" cy="62" r="2.5" fill="#b4fa74" opacity="0.5" />
                            <circle cx="40" cy="12" r="2" fill="#b4fa74" opacity="0.5" />
                            <circle cx="40" cy="68" r="2" fill="#b4fa74" opacity="0.5" />
                          </svg>
                        </div>
                        {/* Floating accent elements */}
                        <div className="absolute -top-6 -right-6 w-8 h-8 rounded-full border border-white/20 flex items-center justify-center" style={{ animation: 'pulse-glow 3s ease-in-out infinite alternate' }}>
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#b4fa74' }} />
                        </div>
                        <div className="absolute -bottom-5 -left-7 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center" style={{ animation: 'pulse-glow 3s ease-in-out 1.5s infinite alternate' }}>
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#b4fa74', opacity: 0.4 }} />
                        </div>
                        <div className="absolute top-1/2 -right-10 w-6 h-6 rounded-full border border-white/15 flex items-center justify-center" style={{ animation: 'pulse-glow 3s ease-in-out 0.8s infinite alternate' }}>
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#b4fa74', opacity: 0.6 }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <SectionDivider />

          {/* ═══════════════ Final Beta CTA ═══════════════ */}
          <section id="waitlist" className="relative py-20 px-4">
            <FloatingParticles count={6} />
            <PulsingOrb size={150} top="10%" right="-50px" delay={0.8} />
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
                      className="flex-1 bg-white/5 border-white/15 text-white placeholder:text-white/30 rounded-xl font-sedgwick-ave text-lg" 
                    />
                    <Button 
                      type="submit" disabled={loading} 
                      className="bg-[#b4fa74] hover:bg-[#a2e866] font-permanent-marker rounded-xl px-8 text-lg shadow-[0_0_25px_rgba(180,250,116,0.2)]"
                      style={{ color: '#0a0a0a' }}
                    >
                      {loading ? t('landing.beta.joining') : t('landing.beta.button')}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════════ Footer ═══════════════ */}
          <footer className="py-16 px-4 border-t border-white/5 relative">
            <FloatingParticles count={3} />
            <div className="container mx-auto max-w-6xl">
              <div className="flex flex-col items-center justify-center mb-10">
                <img src={greenhuntLogoNew} alt="GreenHunt" className="h-28 sm:h-36 lg:h-44 w-auto mb-4 opacity-90" loading="lazy" />
                <p className="font-sedgwick-ave text-xl text-center" style={{ color: '#b4fa74', opacity: 0.9 }}>
                  {t('landing.footer.tagline')}
                </p>
              </div>

              <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 mb-10">
                {[
                  { to: '/privacy', label: t('landing.footer.privacy') },
                  { to: '/legal', label: t('landing.footer.terms') },
                  { to: '/cookies', label: t('landing.footer.cookies') },
                ].map(link => (
                  <Link 
                    key={link.to} 
                    to={link.to} 
                    className="text-white/40 hover:text-white/80 transition-colors font-permanent-marker text-base"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="flex items-center justify-center gap-5 mb-10">
                {[
                  { href: "https://www.linkedin.com/company/greenhunt", icon: <Linkedin className="h-6 w-6" /> },
                  { href: "https://www.instagram.com/greenhuntstoopingapp/", icon: <Instagram className="h-6 w-6" /> },
                  { href: "https://x.com/StoopingApp", icon: (
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  )},
                  { href: "https://www.youtube.com/@GreenHuntStoopingApp", icon: <Youtube className="h-6 w-6" /> },
                  { href: "https://www.tiktok.com/@greenhuntstoopingapp", icon: (
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                    </svg>
                  )},
                ].map((social, i) => (
                  <a 
                    key={i} 
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:scale-110 transition-all duration-300"
                    style={{ color: '#b4fa74' }}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-white/40 font-sedgwick-ave text-base">{t('landing.footer.madeWith')}</span>
                  <span className="text-lg">💚</span>
                  <span className="text-white/40 font-sedgwick-ave text-base">{t('landing.footer.forPlanet')}</span>
                  <span className="text-lg">🌍</span>
                </div>
                <a href="mailto:hello@greenhunt.net" className="text-white/40 font-sedgwick-ave text-base hover:text-[#b4fa74] transition-colors">
                  hello@greenhunt.net
                </a>
              </div>
            </div>
          </footer>

          {/* Bottom Right Buttons */}
          <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
            <Button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
              className="bg-[#1a1a1a] hover:bg-[#222] border border-white/10 font-permanent-marker shadow-lg px-3 py-2 h-auto text-lg rounded-xl"
              style={{ color: '#b4fa74' }}
              aria-label={language === 'en' ? 'Go to top' : 'Ir al principio'}
            >
              <ArrowUp className="h-5 w-5" style={{ color: '#b4fa74', stroke: '#b4fa74' }} />
            </Button>
            
            <Button 
              onClick={() => setLanguage(language === 'en' ? 'es' : 'en')} 
              className="bg-[#1a1a1a] hover:bg-[#222] border border-white/10 font-permanent-marker shadow-lg px-3 py-2 h-auto text-lg rounded-xl"
              style={{ color: '#b4fa74' }}
            >
              <span style={{ color: '#b4fa74', WebkitTextFillColor: '#b4fa74' }}>{language === 'en' ? 'ES' : 'EN'}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
