import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import greenhuntLogoNew from "@/assets/greenhunt-logo-new.svg";
import heroVideo from "@/assets/hero-video.mp4";
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
      <section className={`relative w-full min-h-[80vh] md:min-h-[90vh] flex items-center overflow-hidden px-4 md:px-8 ${className || ''}`}>
        {/* Subtle worn grid overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(rgba(200,180,140,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(200,180,140,.15) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Logo */}
          <div className="mb-6 md:mb-10">
            <img src={greenhuntLogoNew} alt="GreenHunt Logo" className="h-28 sm:h-36 lg:h-44 w-auto" />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left Side - Title */}
            <div className="flex flex-col gap-6">
              <div className="wooden-sign inline-block self-start">
                <h1 
                  style={{ color: 'hsl(38, 35%, 78%)' }} 
                  className="font-permanent-marker text-xl md:text-2xl lg:text-3xl leading-tight"
                >
                  {language === 'en' 
                    ? 'This is what waste managers do with hundreds of tons of high valuable dumped stuff daily' 
                    : 'Esto es lo que hacen los gestores de residuos con cientos de toneladas de cosas valiosas tiradas a diario'}
                </h1>
              </div>
              
              {/* Accent line - rusty divider */}
              <div className="rusty-divider w-24" />
            </div>

            {/* Right Side - Video */}
            <div className="flex justify-center lg:justify-end">
              <div className="worn-photo-frame">
                <video 
                  autoPlay loop muted playsInline
                  className="relative w-full max-w-md lg:max-w-lg rounded"
                >
                  <source src={heroVideo} type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Dialog */}
      <Dialog open={waitlistOpen} onOpenChange={setWaitlistOpen}>
        <DialogContent className="sm:max-w-md border-2" style={{ background: 'linear-gradient(145deg, hsl(30, 20%, 14%), hsl(25, 18%, 10%))', borderColor: 'hsl(25, 35%, 22%)' }}>
          <DialogHeader>
            <DialogTitle className="font-permanent-marker text-2xl" style={{ color: 'hsl(38, 35%, 78%)' }}>
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
              className="font-sedgwick-ave border-2 text-white placeholder:text-white/40"
              style={{ background: 'hsl(30, 15%, 15%)', borderColor: 'hsl(30, 20%, 25%)' }}
            />
            <button type="submit" disabled={loading} className="game-button w-full font-permanent-marker text-lg px-8 py-3 cursor-pointer disabled:opacity-50">
              {loading 
                ? (language === 'en' ? 'Sending...' : 'Enviando...') 
                : (language === 'en' ? 'GET BETA' : 'OBTÉN BETA')}
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Trailer Dialog */}
      <Dialog open={trailerOpen} onOpenChange={setTrailerOpen}>
        <DialogContent className="sm:max-w-4xl p-0 bg-black border-2" style={{ borderColor: 'hsl(25, 35%, 22%)' }}>
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
