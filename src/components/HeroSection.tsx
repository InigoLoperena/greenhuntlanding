import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import greenhuntLogoNew from "@/assets/greenhunt-logo-new.svg";
import wasteManagerVideo from "@/assets/waste-manager-video.mp4";
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
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left Side - Title + Arrow */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left relative">
              {/* Notice Sticker - Top */}
              <div className="absolute -top-4 right-0 lg:right-auto lg:left-full lg:-ml-8 transform rotate-6 z-20">
                <div className="bg-[#f5e6c3] border-2 border-black p-2 shadow-lg transform -rotate-2">
                  <div className="text-xs font-bold text-black border-b border-black pb-1 mb-1">NOTICE</div>
                  <div className="text-[10px] font-bold text-black leading-tight">
                    STOOPING<br/>NOT<br/>ALLOWED
                  </div>
                </div>
              </div>

              <h1 className="font-permanent-marker text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight mb-8"
                  style={{ color: '#b5ef77' }}>
                This is what waste managers do with hundreds of tons of high valuable dumped stuff daily
              </h1>
              
              {/* Arrow pointing to video */}
              <div className="hidden lg:block absolute right-0 top-1/2 transform translate-x-4">
                <svg width="120" height="60" viewBox="0 0 120 60" fill="none" className="text-white">
                  <path 
                    d="M10 30 Q60 30 95 30" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path 
                    d="M85 20 L100 30 L85 40" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Mobile arrow pointing down */}
              <div className="lg:hidden mb-4">
                <svg width="40" height="60" viewBox="0 0 40 60" fill="none" className="text-white mx-auto">
                  <path 
                    d="M20 5 L20 45" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path 
                    d="M10 35 L20 50 L30 35" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Right Side - Video */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
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

              {/* Recycle Sticker - Bottom Right */}
              <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 transform rotate-12 z-20">
                <div className="bg-[#e8e0d0] border-2 border-black p-3 shadow-lg rounded-sm">
                  <svg width="50" height="50" viewBox="0 0 50 50" className="text-[#8cb369]">
                    <path 
                      d="M25 5 L35 20 L30 20 L30 30 L20 30 L20 20 L15 20 Z" 
                      fill="currentColor"
                      transform="rotate(0 25 25)"
                    />
                    <path 
                      d="M25 5 L35 20 L30 20 L30 30 L20 30 L20 20 L15 20 Z" 
                      fill="currentColor"
                      transform="rotate(120 25 25)"
                    />
                    <path 
                      d="M25 5 L35 20 L30 20 L30 30 L20 30 L20 20 L15 20 Z" 
                      fill="currentColor"
                      transform="rotate(240 25 25)"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Warning Sticker - Bottom Left */}
          <div className="absolute bottom-8 left-4 md:left-8 transform -rotate-3 z-20">
            <div className="bg-[#f5d547] border-4 border-black p-3 shadow-xl">
              <div className="flex items-center gap-2 border-b-2 border-black pb-1 mb-1">
                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[14px] border-b-black"></div>
                <span className="font-bold text-black text-sm">WARNING</span>
              </div>
              <div className="text-black font-bold text-center">
                <div className="text-xs">DUMPSTER</div>
                <div className="text-xs">DIVING</div>
                <div className="text-[#c41e3a] font-bold text-sm mt-1">FINE 100 $</div>
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
