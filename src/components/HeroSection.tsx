import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Video } from "lucide-react";
import greenhuntLogoNew from "@/assets/greenhunt-logo-new.svg";
import heroBackground from "@/assets/angry-chair-hero.png";
import heroMobileBackground from "@/assets/hero-mobile-background.png";
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
      <section 
        className="relative w-full min-h-screen flex items-end justify-start overflow-hidden pb-8"
      >
        {/* Desktop background */}
        <div 
          className="absolute inset-0 hidden md:block"
          style={{
            backgroundImage: `url(${heroBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat'
          }}
        />
        {/* Mobile background */}
        <div 
          className="absolute inset-0 md:hidden"
          style={{
            backgroundImage: `url(${heroMobileBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat'
          }}
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Logo - Top Left */}
        <div className="absolute top-8 left-8 z-10">
          <img 
            src={greenhuntLogoNew} 
            alt="GreenHunt Logo" 
            className="h-24 md:h-32 w-auto"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full px-8 md:px-12 lg:px-16">
          <h1 className="text-lg md:text-2xl lg:text-3xl font-permanent-marker mb-4 leading-relaxed text-accent">
            Real world <span style={{ color: '#000000' }}>game-marketplace</span> & Stooping-Thrifting App
            <br />
            Your city is a <span style={{ color: '#000000' }}>circular economy</span> game board
            <br />
            Play to Earn $ and Save the planet
          </h1>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 items-start mt-4">
            <Button
              onClick={() => setWaitlistOpen(true)}
              className="bg-accent hover:bg-accent/90 font-permanent-marker text-xs px-3 py-2 text-base h-auto"
              style={{ color: '#611a5a' }}
            >
              {language === 'en' ? 'Join Beta' : 'Únete a Beta'}
            </Button>
            
            <Button
              onClick={() => setTrailerOpen(true)}
              variant="outline"
              className="font-permanent-marker text-xs px-3 py-2 text-base h-auto border-2 border-white text-white hover:bg-white hover:text-black"
            >
              <Video className="mr-2 h-3 w-3" />
              Trailer
            </Button>
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
