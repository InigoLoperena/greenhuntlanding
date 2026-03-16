import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import heroBannerClean from "@/assets/hero-banner-clean.png";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { useLanguage } from "@/hooks/useLanguage";

const emailSchema = z.string().email();

interface HeroSectionProps {
  className?: string;
}

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
      <section className={`relative w-full min-h-[60vh] md:min-h-[80vh] lg:min-h-screen overflow-hidden ${className || ''}`}>
        {/* Full-screen background image */}
        <img 
          src={heroBannerClean} 
          alt="GreenHunt - Stooping Real World Game" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* H1 text positioned over the blank sign */}
        <h1 
          className="absolute font-permanent-marker text-center leading-tight"
          style={{
            top: '52%',
            left: '24%',
            transform: 'translate(-50%, -50%)',
            fontSize: 'clamp(0.9rem, 2.5vw, 2.2rem)',
            color: '#3a2a1a',
            textShadow: '1px 1px 2px rgba(0,0,0,0.15)',
            maxWidth: '30%',
            letterSpacing: '0.02em',
          }}
        >
          Stooping Real World Game
        </h1>
      </section>

      {/* Waitlist Dialog */}
      <Dialog open={waitlistOpen} onOpenChange={setWaitlistOpen}>
        <DialogContent className="sm:max-w-md bg-[#1a1a1a] border border-white/10">
          <DialogHeader>
            <DialogTitle className="font-permanent-marker text-2xl" style={{ color: '#b4fa74' }}>
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
              className="font-sedgwick-ave bg-white/5 border-white/20 text-white placeholder:text-white/40" 
            />
            <Button type="submit" disabled={loading} className="w-full bg-[#a2c041] hover:bg-[#8da836] font-permanent-marker btn-purple-text text-lg">
              {loading 
                ? (language === 'en' ? 'Sending...' : 'Enviando...') 
                : (language === 'en' ? 'GET BETA' : 'OBTÉN BETA')}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Trailer Dialog */}
      <Dialog open={trailerOpen} onOpenChange={setTrailerOpen}>
        <DialogContent className="sm:max-w-4xl p-0 bg-black border-white/10">
          <div className="aspect-video">
            <iframe 
              width="100%" height="100%" 
              src={trailerOpen ? "https://www.youtube.com/embed/RHj_lCvC9xw?autoplay=1" : ""} 
              title="GreenHunt Trailer" frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen className="rounded-lg" 
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
