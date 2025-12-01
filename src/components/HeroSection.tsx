import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Video } from "lucide-react";
import greenhuntLogoNew from "@/assets/greenhunt-logo-new.svg";
import heroBackground from "@/assets/angry-chair-hero.png";
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
        className="relative w-full min-h-screen flex items-end justify-start overflow-hidden pb-16"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
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
        <div className="relative z-10 px-8 text-left max-w-3xl">
          <h1 className="text-2xl md:text-4xl lg:text-6xl font-permanent-marker mb-8 leading-relaxed text-accent">
            Real world <span style={{ color: '#611a5a' }}>game-marketplace</span> & Stooping-Thrifting App
            <br />
            Your city is a <span style={{ color: '#611a5a' }}>circular economy</span> game board
            <br />
            Play to Earn $ and Save the planet
          </h1>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 items-start mt-6">
            <Button
              onClick={() => setWaitlistOpen(true)}
              className="bg-accent hover:bg-accent/90 font-permanent-marker text-sm px-4 py-3 text-lg h-auto"
              style={{ color: '#611a5a' }}
            >
              {language === 'en' ? 'Join Beta' : 'Únete a Beta'}
            </Button>
            
            <Button
              onClick={() => setTrailerOpen(true)}
              variant="outline"
              className="font-permanent-marker text-sm px-4 py-3 text-lg h-auto border-2 border-white text-white hover:bg-white hover:text-black"
            >
              <Video className="mr-2 h-4 w-4" />
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
              src="https://www.youtube.com/embed/AoEmQPU2gtg"
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
