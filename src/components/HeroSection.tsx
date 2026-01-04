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

export const HeroSection = () => {
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
      <section className="relative w-full min-h-[70vh] md:min-h-[80vh] bg-black flex items-start overflow-hidden pt-6 pb-12 px-4 md:px-8">
        {/* Main Content Container */}
        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Logo with text - Top Left */}
          <div className="flex items-center gap-3 mb-8 md:mb-12">
            <img 
              src={greenhuntLogoNew} 
              alt="GreenHunt Logo" 
              className="h-12 md:h-16 w-auto"
            />
            <span className="font-permanent-marker text-2xl md:text-3xl" style={{ color: '#6ea151' }}>
              GreenHunt
            </span>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            
            {/* Left Side - Arrow and Title */}
            <div className="flex flex-col">
              {/* Green Arrow */}
              <div className="mb-6 md:mb-8">
                <svg 
                  viewBox="0 0 200 80" 
                  className="w-48 md:w-64 h-auto"
                  fill="none"
                >
                  {/* Arrow body */}
                  <path 
                    d="M10 45 C 30 20, 80 15, 120 25 C 140 30, 155 35, 160 40" 
                    stroke="#6ea151" 
                    strokeWidth="20" 
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Arrow head */}
                  <polygon 
                    points="155,25 190,42 155,58" 
                    fill="#6ea151"
                  />
                  {/* Sketch lines for texture */}
                  <path 
                    d="M15 42 C 35 22, 85 18, 125 28" 
                    stroke="#4a7a3a" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.5"
                  />
                  <path 
                    d="M20 48 C 40 28, 90 23, 130 33" 
                    stroke="#8bc46a" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.4"
                  />
                </svg>
              </div>

              {/* Title */}
              <h1 className="font-permanent-marker text-xl md:text-2xl lg:text-3xl leading-tight max-w-lg"
                  style={{ color: '#6ea151' }}>
                This is what waste managers do with hundreds of tons of high valuable dumped stuff daily
              </h1>
            </div>

            {/* Right Side - Video */}
            <div className="flex justify-center lg:justify-end">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 max-w-sm md:max-w-md">
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-auto"
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-permanent-marker text-2xl">
              {language === 'en' ? 'Join the Beta' : 'Únete a la Beta'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleWaitlistSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder={language === 'en' ? 'Enter your email' : 'Ingresa tu email'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="font-sedgwick-ave"
            />
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90 font-permanent-marker"
              style={{ color: '#611a5a' }}
            >
              {loading ? (language === 'en' ? 'Joining...' : 'Uniéndose...') : (language === 'en' ? 'Join Waitlist' : 'Unirse a la Lista')}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Trailer Dialog */}
      <Dialog open={trailerOpen} onOpenChange={setTrailerOpen}>
        <DialogContent className="sm:max-w-4xl p-0">
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={trailerOpen ? "https://www.youtube.com/embed/RHj_lCvC9xw?autoplay=1" : ""}
              title="GreenHunt Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
