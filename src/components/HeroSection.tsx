import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import heroBanner from "@/assets/hero-banner.png";
import heroMobile from "@/assets/hero-mobile.png";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { useLanguage } from "@/hooks/useLanguage";

const emailSchema = z.string().email();

interface HeroSectionProps {
  className?: string;
}

/* ─── Rivet dot component ─── */
const Rivet = ({ className }: { className?: string }) => (
  <div className={`rivet ${className || ''}`} />
);

export const HeroSection = ({ className }: HeroSectionProps) => {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { t, language } = useLanguage();

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      toast.error(t('landing.beta.invalidEmail'));
      return;
    }
    setLoading(true);
    try {
      // @ts-ignore - waitlist table exists
      const { error } = await supabase
        // @ts-ignore
        .from('waitlist')
        // @ts-ignore
        .insert([{ email: email.toLowerCase().trim() }]);
      if (error) {
        if (error.code === '23505') {
          toast.error(t('landing.beta.emailExists'));
        } else {
          toast.error(t('landing.beta.error'));
        }
      } else {
        toast.success(t('landing.beta.success'));
        setEmail("");
        setWaitlistOpen(false);
      }
    } catch (error) {
      console.error('Error adding to waitlist:', error);
      toast.error(t('landing.beta.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero Section with weathered wood frame */}
      <section className={`relative w-full overflow-hidden ${className || ''}`}>
        {/* Outer metal frame */}
        <div className="relative panel-metal rounded-none">
          {/* Corner rivets */}
          <Rivet className="top-3 left-3 z-10" />
          <Rivet className="top-3 right-3 z-10" />
          <Rivet className="bottom-3 left-3 z-10" />
          <Rivet className="bottom-3 right-3 z-10" />

          {/* Inner wood border frame */}
          <div className="relative border-4 border-wood-dark" style={{
            borderImage: 'linear-gradient(180deg, hsl(25 40% 20%), hsl(30 35% 30%), hsl(25 40% 18%)) 1',
          }}>
            {/* Desktop background */}
            <img 
              src={heroBanner} 
              alt="GreenHunt - Stooping Real World Game" 
              className="hidden md:block w-full h-auto"
            />
            {/* Mobile background */}
            <img 
              src={heroMobile} 
              alt="GreenHunt - Stooping Real World Game" 
              className="block md:hidden w-full h-auto"
            />

            {/* Bottom weathered wood plank bar */}
            <div className="absolute bottom-0 left-0 right-0 panel-wood py-2 md:py-3 flex justify-center items-center gap-2 md:gap-4">
              <Rivet className="relative" />
              <div className="divider-chain flex-1 max-w-[100px] md:max-w-[200px]" />
              <span className="font-permanent-marker text-xs md:text-sm tracking-widest uppercase" style={{ color: 'hsl(40 35% 75%)', textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}>
                {language === 'en' ? 'Stooping Real World Game' : 'Stooping Real World Game'}
              </span>
              <div className="divider-chain flex-1 max-w-[100px] md:max-w-[200px]" />
              <Rivet className="relative" />
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Dialog - weathered parchment style */}
      <Dialog open={waitlistOpen} onOpenChange={setWaitlistOpen}>
        <DialogContent className="sm:max-w-md panel-wood rounded-xl border-2 border-wood-dark texture-noise">
          <DialogHeader>
            <DialogTitle className="font-permanent-marker text-2xl text-gold">
              {language === 'en' ? 'Get the Beta' : 'Obtén la Beta'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleWaitlistSubmit} className="space-y-4">
            <Input 
              type="email" 
              placeholder={language === 'en' ? 'Enter your email' : 'Ingresa tu email'} 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              className="font-sedgwick-ave bg-wood-dark/50 border-wood-light/30 text-parchment placeholder:text-parchment/40 rounded-lg" 
            />
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full btn-metal font-permanent-marker text-lg px-8 py-3 rounded-lg uppercase tracking-wider"
            >
              {loading 
                ? (language === 'en' ? 'Sending...' : 'Enviando...') 
                : (language === 'en' ? 'GET BETA' : 'OBTÉN BETA')}
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Trailer Dialog */}
      <Dialog open={trailerOpen} onOpenChange={setTrailerOpen}>
        <DialogContent className="sm:max-w-4xl p-0 panel-metal border-2 border-rust-dark rounded-lg overflow-hidden">
          <div className="aspect-video">
            <iframe 
              width="100%" height="100%" 
              src={trailerOpen ? "https://www.youtube.com/embed/RHj_lCvC9xw?autoplay=1" : ""} 
              title="GreenHunt Trailer" frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
