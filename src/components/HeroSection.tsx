import { useState } from "react";
import { Button } from "@/components/ui/button";
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
export const HeroSection = ({
  className
}: HeroSectionProps) => {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    t,
    language
  } = useLanguage();
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
        setWaitlistOpen(false);
      }
    } catch (error) {
      console.error('Error adding to waitlist:', error);
      toast.error(t('landing.beta.error'));
    } finally {
      setLoading(false);
    }
  };
  return <>
      <section className={`relative w-full min-h-[70vh] md:min-h-[80vh] flex items-start overflow-hidden pt-6 pb-12 px-4 md:px-8 ${className || ''}`}>
        {/* Main Content Container */}
        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Logo - Top Left */}
          <div className="mb-8 md:mb-12">
            <img src={greenhuntLogoNew} alt="GreenHunt Logo" className="h-32 sm:h-40 lg:h-48 w-auto" />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            
            {/* Left Side - Title and CTA */}
            <div className="flex flex-col">
              {/* Title */}
              <h1 style={{
              color: '#6ea151'
            }} className="font-permanent-marker text-xl md:text-2xl lg:text-3xl leading-tight max-w-lg mt-8">
                {language === 'en' ? 'This is what waste managers do with hundreds of tons of high valuable dumped stuff daily' : 'Esto es lo que hacen los gestores de residuos con cientos de toneladas de cosas valiosas tiradas a diario'}
              </h1>
            </div>

            {/* Right Side - Video */}
            <div className="flex justify-center lg:justify-end">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full max-w-md lg:max-w-lg rounded-2xl shadow-2xl"
              >
                <source src={heroVideo} type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Dialog */}
      <Dialog open={waitlistOpen} onOpenChange={setWaitlistOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-permanent-marker text-2xl">
              {language === 'en' ? 'Get the Beta' : 'Obtén la Beta'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleWaitlistSubmit} className="space-y-4">
            <Input type="email" placeholder={language === 'en' ? 'Enter your email' : 'Ingresa tu email'} value={email} onChange={e => setEmail(e.target.value)} required className="font-sedgwick-ave" />
            <Button type="submit" disabled={loading} className="w-full bg-accent hover:bg-accent/90 font-permanent-marker btn-purple-text">
              {loading ? language === 'en' ? 'Sending...' : 'Enviando...' : language === 'en' ? 'Get Beta' : 'Obtén Beta'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Trailer Dialog */}
      <Dialog open={trailerOpen} onOpenChange={setTrailerOpen}>
        <DialogContent className="sm:max-w-4xl p-0">
          <div className="aspect-video">
            <iframe width="100%" height="100%" src={trailerOpen ? "https://www.youtube.com/embed/RHj_lCvC9xw?autoplay=1" : ""} title="GreenHunt Trailer" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="rounded-lg" />
          </div>
        </DialogContent>
      </Dialog>
    </>;
};