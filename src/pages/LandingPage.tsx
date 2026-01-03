import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Linkedin, Instagram, Youtube, ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useState } from "react";
import { StructuredData } from "@/components/StructuredData";
import { HeroSection } from "@/components/HeroSection";
import greenhuntLogoNew from "@/assets/greenhunt-logo-new.svg";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import tutorialStep1 from "@/assets/tutorial-step-1.png";
import tutorialStep2 from "@/assets/tutorial-step-2.png";
import tutorialStep3 from "@/assets/tutorial-step-3.png";
import thriftingStep1 from "@/assets/thrifting-step-1.png";
import thriftingStep2 from "@/assets/thrifting-step-2.png";
import thriftingStep3 from "@/assets/thrifting-step-3.png";
const emailSchema = z.string().email();
export default function LandingPage() {
  const {
    t,
    language,
    setLanguage
  } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      toast.error(t('landing.beta.invalidEmail'));
      return;
    }
    setLoading(true);
    try {
      // @ts-ignore - waitlist table exists but types may not be updated
      const {
        error
      } = await supabase
      // @ts-ignore
      .from('waitlist')
      // @ts-ignore
      .insert([{
        email: email.toLowerCase().trim()
      }]);
      if (error) {
        if (error.code === '23505') {
          toast.error(t('landing.beta.emailExists'));
        } else {
          toast.error(t('landing.beta.error'));
        }
      } else {
        toast.success(t('landing.beta.success'));
        setEmail("");
      }
    } catch (error) {
      console.error('Error adding to waitlist:', error);
      toast.error(t('landing.beta.error'));
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <StructuredData />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Tutorial Section */}
      <section className="py-16 md:py-20 px-4 bg-black relative bg-cover bg-center" style={{
      backgroundImage: 'url(/lovable-uploads/brick-wall-background.png)'
    }}>
        <div className="container mx-auto max-w-6xl relative z-10">
          <h2 style={{
          color: '#699e4b'
        }} className="text-3xl font-permanent-marker mb-12 text-center md:text-7xl">
            {t('landing.tutorial.title')}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <span className="absolute -top-4 -left-4 text-6xl font-permanent-marker" style={{
                color: '#699e4b'
              }}>1</span>
                <img src={tutorialStep1} alt="Take photos of street finds" className="w-full max-w-xs rounded-2xl shadow-lg object-cover aspect-[9/16]" loading="lazy" />
              </div>
              <p className="font-sedgwick-ave text-subtitle-styled text-3xl">
                {t('landing.tutorial.step1')}
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <span className="absolute -top-4 -left-4 text-6xl font-permanent-marker" style={{
                color: '#699e4b'
              }}>2</span>
                <img src={tutorialStep2} alt="Make money when someone unlocks coordinates" className="w-full max-w-xs rounded-2xl shadow-lg object-cover aspect-[9/16]" loading="lazy" />
              </div>
              <p className="font-sedgwick-ave text-subtitle-styled text-3xl">
                {t('landing.tutorial.step2')}
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <span className="absolute -top-4 -left-4 text-6xl font-permanent-marker" style={{
                color: '#699e4b'
              }}>3</span>
                <img alt="Buy coordinates and get valuable items" className="w-full max-w-xs rounded-2xl shadow-lg object-cover aspect-[9/16]" loading="lazy" src="/lovable-uploads/82dc7a70-9bf3-4e78-ba9f-ad642d7988f4.png" />
              </div>
              <p className="font-sedgwick-ave text-subtitle-styled text-3xl">
                {t('landing.tutorial.step3')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Local Phygital Thrifting Section */}
      <section className="py-16 md:py-20 px-4 bg-black relative bg-cover bg-center" style={{
      backgroundImage: 'url(/lovable-uploads/brick-wall-background.png)'
    }}>
        <div className="container mx-auto max-w-6xl relative z-10">
          <h2 className="text-3xl md:text-5xl font-permanent-marker mb-12 text-center" style={{
          color: '#699e4b'
        }}>
            {t('landing.thrifting.title')}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <span className="absolute -top-4 -left-4 text-6xl font-permanent-marker" style={{
                color: '#699e4b'
              }}>1</span>
                <img alt="Explore thrift store catalogs" className="w-full max-w-xs rounded-2xl shadow-lg" loading="lazy" src="/lovable-uploads/7385e5d0-3dff-4261-aaeb-fd0b991b89be.png" />
              </div>
              <p className="font-sedgwick-ave text-subtitle-styled text-3xl">
                {t('landing.thrifting.step1')}
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <span className="absolute -top-4 -left-4 text-6xl font-permanent-marker" style={{
                color: '#699e4b'
              }}>2</span>
                <img src={thriftingStep2} alt="Request pickup for donations" className="w-full max-w-xs rounded-2xl shadow-lg" loading="lazy" />
              </div>
              <p className="font-sedgwick-ave text-subtitle-styled text-3xl">
                {t('landing.thrifting.step2')}
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <span className="absolute -top-4 -left-4 text-6xl font-permanent-marker" style={{
                color: '#699e4b'
              }}>3</span>
                <img src={thriftingStep3} alt="Create your own garage sale" className="w-full max-w-xs rounded-2xl shadow-lg" loading="lazy" />
              </div>
              <p className="font-sedgwick-ave text-subtitle-styled text-3xl">
                {t('landing.thrifting.step3')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ambassador Program Section */}
      <section className="py-20 px-4 bg-black relative bg-cover bg-center" style={{
      backgroundImage: 'url(/lovable-uploads/brick-wall-background.png)'
    }}>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-5xl font-permanent-marker mb-6 leading-tight" style={{
              color: '#699e4b'
            }}>
                {t('landing.ambassador.title')}
              </h2>
              <p className="text-lg text-subtitle-styled font-sedgwick-ave mb-8">
                {t('landing.ambassador.description')}
              </p>
              <Link to="/ambassador-program">
                <Button className="bg-accent hover:bg-accent/90 font-permanent-marker text-lg px-8 py-6" style={{
                color: '#611a5a'
              }}>
                  {t('landing.ambassador.button')}
                </Button>
              </Link>
            </div>
            <div className="order-1 lg:order-2">
              <img src="/lovable-uploads/ambassador-program.png" alt="GreenHunt Ambassador Program" className="w-full max-w-md mx-auto lg:ml-auto h-auto rounded-lg" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Join Beta Section */}
      <section id="waitlist" className="relative py-20 px-4 bg-black bg-cover bg-center" style={{
      backgroundImage: 'url(/lovable-uploads/brick-wall-dark.png)'
    }}>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="max-w-md mx-auto bg-black/60 backdrop-blur-sm p-8 rounded-lg border border-white/20">
            <h2 className="text-2xl font-permanent-marker mb-2" style={{
            color: '#699e4b'
          }}>
              {t('landing.beta.title')}
            </h2>
            <p className="text-white font-sedgwick-ave mb-6">
              {t('landing.beta.description')}
            </p>
            <form onSubmit={handleWaitlistSubmit} className="space-y-4">
              <Input type="email" placeholder={t('landing.beta.placeholder')} value={email} onChange={e => setEmail(e.target.value)} required disabled={loading} className="w-full bg-white/90" />
              <Button type="submit" disabled={loading} className="w-full bg-accent hover:bg-accent/90 font-permanent-marker" style={{
              color: '#611a5a'
            }}>
                {loading ? t('landing.beta.joining') : t('landing.beta.button')}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-center mb-8">
            <img src={greenhuntLogoNew} alt="GreenHunt" className="h-32 sm:h-40 lg:h-48 w-auto mb-4" loading="lazy" />
            <p className="font-sedgwick-ave text-lg text-center text-yellow-200">
              {t('landing.footer.tagline')}
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 mb-8">
            <Link to="/privacy" className="hover:text-accent transition-colors font-permanent-marker text-white text-lg">
              {t('landing.footer.privacy')}
            </Link>
            <Link to="/legal" className="hover:text-accent transition-colors font-permanent-marker text-white text-lg">
              {t('landing.footer.terms')}
            </Link>
            <Link to="/cookies" className="hover:text-accent transition-colors font-permanent-marker text-white text-lg">
              {t('landing.footer.cookies')}
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 mb-8">
            <a href="https://www.linkedin.com/company/greenhunt" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 transition-colors">
              <Linkedin className="h-8 w-8" />
            </a>
            <a href="https://www.instagram.com/greenhuntstoopingapp/" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 transition-colors">
              <Instagram className="h-8 w-8" />
            </a>
            <a href="https://x.com/StoopingApp" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 transition-colors">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="https://www.youtube.com/@GreenHuntStoopingApp" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 transition-colors">
              <Youtube className="h-8 w-8" />
            </a>
            <a href="https://www.tiktok.com/@greenhuntstoopingapp" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 transition-colors">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
              </svg>
            </a>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-white font-sedgwick-ave text-sm">{t('landing.footer.madeWith')}</span>
              <span className="text-lg">💚</span>
              <span className="text-white font-sedgwick-ave text-sm">{t('landing.footer.forPlanet')}</span>
              <span className="text-lg">🌍</span>
            </div>
            <a href="mailto:hello@greenhunt.net" className="text-white font-sedgwick-ave text-sm hover:text-accent transition-colors">hello@greenhunt.net</a>
          </div>
        </div>
      </footer>

      {/* Bottom Right Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <Button onClick={() => window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })} className="bg-accent hover:bg-accent/90 font-permanent-marker shadow-rebel px-3 py-2 h-auto text-lg" style={{
        color: '#611a5a'
      }} aria-label={language === 'en' ? 'Go to top' : 'Ir al principio'}>
          <ArrowUp className="h-5 w-5" />
        </Button>
        
        <Button onClick={() => setLanguage(language === 'en' ? 'es' : 'en')} className="bg-accent hover:bg-accent/90 font-permanent-marker shadow-rebel px-3 py-2 h-auto text-lg" style={{
        color: '#611a5a'
      }}>
          {language === 'en' ? 'ES' : 'EN'}
        </Button>
      </div>
    </div>;
}