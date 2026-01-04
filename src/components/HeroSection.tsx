import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import greenhuntLogoNew from "@/assets/greenhunt-logo-new.svg";
import wasteManagerVideo from "@/assets/waste-manager-video.mp4";
import stickerStooping from "@/assets/sticker-stooping.png";
import stickerRecycle from "@/assets/sticker-recycle.png";
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
      <section className="relative w-full min-h-screen bg-black flex items-center justify-center overflow-hidden py-12 px-4">
        {/* Logo - Top Left */}
        <div className="absolute top-6 left-6 z-20">
          <img 
            src={greenhuntLogoNew} 
            alt="GreenHunt Logo" 
            className="h-16 md:h-24 w-auto"
          />
        </div>

        {/* Main Content Container */}
        <div className="container mx-auto max-w-7xl relative z-10 pt-20 md:pt-24">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left Side - Title + Arrow */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left relative">
              {/* Stooping Sticker - Above title on desktop */}
              <div className="hidden lg:block absolute -top-16 left-1/2 lg:left-auto lg:right-0 transform -translate-x-1/2 lg:translate-x-0 -rotate-6 z-20">
                <img 
                  src={stickerStooping} 
                  alt="Notice: Stooping Not Allowed" 
                  className="w-20 lg:w-24 h-auto shadow-lg"
                />
              </div>

              <h1 className="font-permanent-marker text-xl md:text-2xl lg:text-3xl xl:text-4xl leading-tight"
                  style={{ color: '#b5ef77' }}>
                This is what waste managers do with hundreds of tons of high valuable dumped stuff daily
              </h1>
              
              {/* Arrow pointing to video - Desktop */}
              <div className="hidden lg:flex items-center justify-end w-full mt-6">
                <svg width="120" height="40" viewBox="0 0 120 40" fill="none" className="text-white">
                  <path 
                    d="M5 20 Q60 20 100 20" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path 
                    d="M90 12 L105 20 L90 28" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Mobile arrow pointing down */}
              <div className="lg:hidden mt-4">
                <svg width="30" height="40" viewBox="0 0 30 40" fill="none" className="text-white mx-auto">
                  <path 
                    d="M15 5 L15 30" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path 
                    d="M8 23 L15 33 L22 23" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Right Side - Video */}
            <div className="relative">
              {/* Stooping Sticker - Mobile only, above video */}
              <div className="lg:hidden absolute -top-12 right-4 transform rotate-6 z-20">
                <img 
                  src={stickerStooping} 
                  alt="Notice: Stooping Not Allowed" 
                  className="w-16 md:w-20 h-auto shadow-lg"
                />
              </div>

              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 max-w-md lg:max-w-lg mx-auto">
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-auto"
                >
                  <source src={wasteManagerVideo} type="video/mp4" />
                </video>
              </div>

              {/* Recycle Sticker - Bottom right of video */}
              <div className="absolute -bottom-6 -right-2 md:-right-4 transform rotate-6 z-20">
                <img 
                  src={stickerRecycle} 
                  alt="Recycle" 
                  className="w-12 md:w-16 lg:w-20 h-auto shadow-lg"
                />
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
