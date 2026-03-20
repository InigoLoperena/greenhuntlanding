import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Linkedin, Instagram, Youtube, ArrowUp, Video, ChevronRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useState, useEffect, useRef } from "react";
import { StructuredData } from "@/components/StructuredData";
import { HeroSection } from "@/components/HeroSection";
import { ApocalypticBackground } from "@/components/ApocalypticBackground";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import tutorialStep2 from "@/assets/tutorial-step-2.png";
import getFreeStuffPromo from "@/assets/get-free-stuff-promo.webp";
import appStoreBadges from "@/assets/app-store-badges.png";
import playForPlanetScreen from "@/assets/play-for-planet-screen.webp";
import valueProp1 from "@/assets/value-prop-1.webp";
import valueProp2 from "@/assets/value-prop-2.png";
import valueProp3 from "@/assets/value-prop-3.png";
import appMapScreen from "@/assets/app-map-screen-new.png";
import stoneTagline from "@/assets/stone-tagline-new.webp";
import rescueMap from "@/assets/rescue-map.webp";
import rescueMapScene from "@/assets/rescue-map-scene.webp";
import savePlanetPhone from "@/assets/save-planet-phone.webp";
import darkWoodTexture from "@/assets/dark-wood-texture.webp";
import trackImpactPromo from "@/assets/track-impact-promo.webp";
import conquerApocalypsePromo from "@/assets/conquer-apocalypse-promo.webp";
import trackImpactMobile from "@/assets/track-impact-mobile.webp";
import rankingMobile from "@/assets/ranking-mobile.webp";
import seoBgWoodLeaves from "@/assets/seo-bg-wood-leaves.webp";
import seoBgParchment from "@/assets/seo-bg-parchment.webp";


const streetFindsImages = [
"/street-finds/find-1.jpeg",
"/street-finds/find-2.webp",
"/street-finds/find-3.webp",
"/street-finds/find-4.webp",
"/street-finds/find-5.webp",
"/street-finds/find-6.webp",
"/street-finds/find-7.webp",
"/street-finds/find-8.webp",
"/street-finds/find-9.webp",
"/street-finds/find-10.webp"];


const FrameCarouselSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % streetFindsImages.length);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="-mx-4 md:-mx-12 lg:-mx-24 xl:-mx-32 bg-black">
      <div className="flex flex-col lg:flex-row w-full">
        {/* Left: Phone image */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <img
            src={savePlanetPhone}
            alt="Save the planet by sharing photos and coordinates of discarded street finds"
            className="w-full h-auto block lg:h-full lg:object-cover"
            loading="lazy" />
          
        </div>

        {/* Right: Street finds carousel */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-black overflow-hidden">
          <div className="relative w-full aspect-square">
            {streetFindsImages.map((img, i) =>
            <img
              key={img}
              src={img}
              alt={`Hallazgo callejero ${i + 1}`}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
              style={{ opacity: i === currentIndex ? 1 : 0 }}
              loading="lazy" />

            )}
          </div>
        </div>
      </div>
    </section>);

};

/* ─── SEO Text Section component ─── */
const SeoTextSection = ({ heading, subheading, bg }: { heading: string; subheading: string; bg: string; isDark?: boolean }) => {
  return (
    <section className="-mx-4 md:-mx-12 lg:-mx-24 xl:-mx-32 relative">
      <div
        className="relative py-24 md:py-32 px-6 md:px-16 flex flex-col items-center justify-center text-center"
        style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-black/[0.25]" />
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col justify-between min-h-[200px] md:min-h-[240px]">
          <h2
            className="text-3xl md:text-5xl lg:text-6xl font-bold mb-auto leading-tight"
            style={{ color: '#E6C27A', fontFamily: "'Cinzel', serif", textShadow: '0 0 3px rgba(0,0,0,1), 1px 2px 6px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.5), -1px -1px 0 rgba(0,0,0,0.8), 1px -1px 0 rgba(0,0,0,0.8), -1px 1px 0 rgba(0,0,0,0.8), 1px 1px 0 rgba(0,0,0,0.8)' }}
          >
            {heading}
          </h2>
          <p
            className="text-lg md:text-2xl leading-relaxed max-w-3xl mx-auto mt-8 md:mt-12 font-medium"
            style={{ color: '#FFFFFF', fontFamily: "'Inter', sans-serif", textShadow: '0 0 3px rgba(0,0,0,1), 1px 2px 5px rgba(0,0,0,0.9), -1px -1px 0 rgba(0,0,0,0.6), 1px -1px 0 rgba(0,0,0,0.6), -1px 1px 0 rgba(0,0,0,0.6), 1px 1px 0 rgba(0,0,0,0.6)' }}
          >
            {subheading}
          </p>
        </div>
      </div>
    </section>
  );
};

const emailSchema = z.string().email();


/* ─── Step card component ─── */
const StepCard = ({ number, image, alt, text }: {number: number;image: string;alt: string;text: string;}) =>
<div className="group relative flex flex-col items-center text-center">
    {/* Step number badge */}
    <div className="absolute -top-4 -left-2 z-20 w-10 h-10 rounded-full flex items-center justify-center font-permanent-marker text-lg border-2"
  style={{ backgroundColor: '#1a1a1a', borderColor: '#b4fa74', color: '#b4fa74' }}>
      {number}
    </div>
    {/* Card */}
    <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-1 transition-all duration-300 group-hover:border-white/20 group-hover:shadow-[0_0_30px_rgba(180,250,116,0.08)]">
      <img
      alt={alt}
      className="w-full rounded-xl object-contain"
      loading="lazy"
      src={image} />
    
    </div>
    <p className="font-sedgwick-ave text-subtitle-styled text-xl md:text-2xl mt-5 leading-relaxed px-2">
      {text}
    </p>
  </div>;


/* ─── Feature row (alternating layout) ─── */
const FeatureRow = ({ title, subtitle, image, alt, reverse = false

}: {title: string;subtitle: string;image: string;alt: string;reverse?: boolean;}) =>
<div className="grid lg:grid-cols-2 gap-12 items-center">
    <div className={reverse ? 'order-2 lg:order-1' : ''}>
      <h2 className="text-3xl md:text-5xl font-permanent-marker mb-5 leading-tight" style={{ color: '#b4fa74' }}>
        {title}
      </h2>
      <div className="w-16 h-1 rounded-full mb-6" style={{ backgroundColor: '#b4fa74', opacity: 0.5 }} />
      <p className="text-lg md:text-xl text-subtitle-styled font-sedgwick-ave leading-relaxed">
        {subtitle}
      </p>
    </div>
    <div className={`${reverse ? 'order-1 lg:order-2' : ''} flex justify-center`}>
      <img src={image} alt={alt} className="w-full max-w-xs lg:max-w-sm h-auto drop-shadow-2xl" loading="lazy" />
    </div>
  </div>;


export default function LandingPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      toast.error(t('landing.beta.invalidEmail'));
      return;
    }
    setLoading(true);
    try {
      // @ts-ignore - beta_testers table exists but types may not be updated
      const { error } = await supabase
      // @ts-ignore
      .from('beta_testers')
      // @ts-ignore
      .insert([{ email: email.toLowerCase().trim() }]);
      if (error) {
        if (error.code === '23505') {
          toast.error(t('landing.beta.emailExists'));
        } else {
          toast.error(t('landing.beta.error'));
        }
      } else {
        const userEmail = email.toLowerCase().trim();
        toast.success(t('landing.beta.success'));
        setEmail("");
        try {
          const { data, error: emailError } = await supabase.functions.invoke('send-welcome-email', {
            body: { email: userEmail }
          });
          console.log('Welcome email response:', data, emailError);
        } catch (emailError) {
          console.error('Error sending welcome email:', emailError);
        }
      }
    } catch (error) {
      console.error('Error adding to waitlist:', error);
      toast.error(t('landing.beta.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white overflow-x-hidden relative">
      <ApocalypticBackground />
      
      <div className="relative z-10">
        <div className="mx-4 md:mx-12 lg:mx-24 xl:mx-32 min-h-screen">
          <StructuredData />
          
          {/* Hero Section */}
          <div className="-mx-4 md:-mx-12 lg:-mx-24 xl:-mx-32">
            <HeroSection className="my-0" />
          </div>

          {/* SEO Section 1 - H1 Stooping App */}
          <section className="-mx-4 md:-mx-12 lg:-mx-24 xl:-mx-32 relative">
            <div
              className="relative py-24 md:py-32 px-6 md:px-16 flex flex-col items-center justify-center text-center"
              style={{ backgroundImage: `url(${seoBgWoodLeaves})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              <div className="absolute inset-0 bg-black/[0.25]" />
              <div className="relative z-10 max-w-4xl mx-auto flex flex-col justify-between min-h-[200px] md:min-h-[240px]">
                <h1
                  className="text-3xl md:text-5xl lg:text-6xl font-bold mb-auto leading-tight"
                  style={{ color: '#E6C27A', fontFamily: "'Cinzel', serif", textShadow: '0 0 3px rgba(0,0,0,1), 1px 2px 6px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.5), -1px -1px 0 rgba(0,0,0,0.8), 1px -1px 0 rgba(0,0,0,0.8), -1px 1px 0 rgba(0,0,0,0.8), 1px 1px 0 rgba(0,0,0,0.8)' }}
                >
                  Stooping App and Game
                </h1>
                <p
                  className="text-lg md:text-2xl leading-relaxed max-w-3xl mx-auto mt-8 md:mt-12 font-medium"
                  style={{ color: '#FFFFFF', fontFamily: "'Inter', sans-serif", textShadow: '0 0 3px rgba(0,0,0,1), 1px 2px 5px rgba(0,0,0,0.9), -1px -1px 0 rgba(0,0,0,0.6), 1px -1px 0 rgba(0,0,0,0.6), -1px 1px 0 rgba(0,0,0,0.6), 1px 1px 0 rgba(0,0,0,0.6)' }}
                >
                  The easiest and most fun way to do Stooping in your city
                </p>
              </div>
            </div>
          </section>

          {/* Rescue Map Scene - Full width */}
          <div className="-mx-4 md:-mx-12 lg:-mx-24 xl:-mx-32">
            <img
              src={rescueMapScene}
              alt="Rescue Map - Your city is like a board game where valuable free finds suddenly appear!"
              className="w-full h-auto block"
              loading="lazy" />
            
          </div>

          {/* SEO Section 2 - What is Stooping */}
          <SeoTextSection
            bg={seoBgParchment}
            isDark={false}
            heading="What is Stooping?"
            subheading="Stooping is the act of finding and sharing discarded items left on the street for others to take. It's a growing urban practice to give objects a second life."
          />


          <FrameCarouselSection />

          {/* SEO Section 3 - Why Instagram doesn't work */}
          <SeoTextSection
            bg={seoBgWoodLeaves}
            isDark={true}
            heading="Why Instagram doesn't work good?"
            subheading="Stooping happens mostly on Instagram, where posts are hard to find and publish. It's manual, fragmented, and inefficient."
          />

          {/* Get Free Stuff Promo - Full width */}
          <div className="-mx-4 md:-mx-12 lg:-mx-24 xl:-mx-32">
            <img
              src={getFreeStuffPromo}
              alt="Get free stuff in your city - keep it out of the landfill"
              className="w-full h-auto block"
              loading="lazy" />
          </div>

          {/* SEO Section 4 - Find free street treasures */}
          <SeoTextSection
            bg={seoBgParchment}
            isDark={false}
            heading="Find free street treasures in real time"
            subheading="Greenhunt shows nearby stooping finds on a map and in a local feed, so you can discover useful items around you instantly."
          />


          {/* Waitlist Dialog */}
          <Dialog open={waitlistOpen} onOpenChange={setWaitlistOpen}>
            <DialogContent className="sm:max-w-md bg-[#141414] border shadow-[0_0_60px_rgba(210,180,140,0.08)]" style={{ borderColor: 'rgba(210,180,140,0.2)' }}>
              <div className="text-center">
                <h3 className="text-2xl mb-1" style={{ color: '#D2B48C', fontFamily: "'Cinzel', serif" }}>
                  Get the Beta
                </h3>
                <p className="text-sm mb-4" style={{ color: 'rgba(210,180,140,0.5)', fontFamily: "'Inter', sans-serif" }}>
                  {t('landing.beta.description')}
                </p>
              </div>
              <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/5 text-white placeholder:text-white/30 rounded-xl"
                  style={{ borderColor: 'rgba(210,180,140,0.2)', fontFamily: "'Inter', sans-serif" }} />
                
                <Button
                  type="submit" disabled={loading}
                  className="w-full text-lg rounded-xl shadow-[0_0_20px_rgba(210,180,140,0.2)]"
                  style={{ backgroundColor: '#D2B48C', color: '#1a1206', fontFamily: "'Cinzel', serif" }}>
                  
                  {loading ? 'Sending...' : 'GET BETA'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          {/* Trailer Dialog */}
          <Dialog open={trailerOpen} onOpenChange={setTrailerOpen}>
            <DialogContent className="sm:max-w-4xl p-0 bg-black border-white/10">
              <div className="aspect-video">
                <iframe width="100%" height="100%" src={trailerOpen ? "https://www.youtube.com/embed/RHj_lCvC9xw?autoplay=1" : ""} title="GreenHunt Trailer" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="rounded-lg" />
              </div>
            </DialogContent>
          </Dialog>





          {/* Track Impact Promo - Desktop only */}
          <div className="-mx-4 md:-mx-12 lg:-mx-24 xl:-mx-32 hidden md:block">
            <img
              src={trackImpactPromo}
              alt="Track your impact and compete with other local players"
              className="w-full h-auto block"
              loading="lazy" />
          </div>

          {/* Track Impact Mobile - Mobile only */}
          <div className="-mx-4 block md:hidden">
            <img
              src={trackImpactMobile}
              alt="Track your impact and compete with other local players"
              className="w-full h-auto block"
              loading="lazy" />
            <div className="relative" style={{ backgroundImage: `url(${darkWoodTexture})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div className="absolute inset-0 bg-black/20" />
              <img
                src={rankingMobile}
                alt="New York Ranking - Compete with local players"
                className="w-full h-auto block relative z-10 mx-auto"
                loading="lazy" />
            </div>
          </div>

          {/* SEO Section 5 - Share items in seconds */}
          <SeoTextSection
            bg={seoBgWoodLeaves}
            isDark={true}
            heading="Share items in seconds"
            subheading="Post a photo, add a location, and help others find what you leave behind. Simple, fast, and built for the streets."
          />

          {/* Conquer Apocalypse Promo - Full width */}
          <div className="-mx-4 md:-mx-12 lg:-mx-24 xl:-mx-32">
            <img
              src={conquerApocalypsePromo}
              alt="Conquer the Green Apocalypse"
              className="w-full h-auto block"
              loading="lazy" />
          </div>

          {/* ═══════════════ Final Beta CTA ═══════════════ */}
          <section id="waitlist" className="relative -mx-4 md:-mx-12 lg:-mx-24 xl:-mx-32">
            <div className="relative py-28 md:py-36 px-4" style={{ backgroundImage: `url(${darkWoodTexture})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div className="absolute inset-0 bg-black/45" />
              <div className="container mx-auto max-w-3xl text-center relative z-10">
                <div className="relative overflow-hidden rounded-3xl border-2 bg-black/40 backdrop-blur-sm p-10 md:p-14 shadow-[0_0_40px_rgba(210,180,140,0.15)]" style={{ borderColor: 'rgba(210,180,140,0.3)' }}>
                  <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl mb-3" style={{ color: '#E6C27A', fontFamily: "'Cinzel', serif", textShadow: '0 0 3px rgba(0,0,0,1), 1px 2px 6px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.5), -1px -1px 0 rgba(0,0,0,0.8), 1px -1px 0 rgba(0,0,0,0.8), -1px 1px 0 rgba(0,0,0,0.8), 1px 1px 0 rgba(0,0,0,0.8)' }}>
                      Get Beta & Project Updates
                    </h2>
                    <p className="mb-8 text-lg font-medium" style={{ color: '#FFFFFF', fontFamily: "'Inter', sans-serif", textShadow: '0 0 3px rgba(0,0,0,1), 1px 2px 5px rgba(0,0,0,0.9), -1px -1px 0 rgba(0,0,0,0.6), 1px -1px 0 rgba(0,0,0,0.6), -1px 1px 0 rgba(0,0,0,0.6), 1px 1px 0 rgba(0,0,0,0.6)' }}>
                      Be the first to know when we launch
                    </p>
                    <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required disabled={loading}
                        className="flex-1 bg-black/40 rounded-xl text-lg focus:border-[#D2B48C]"
                        style={{ borderColor: 'rgba(210,180,140,0.4)', color: '#D2B48C', fontFamily: "'Inter', sans-serif" }} />
                      
                      <Button
                        type="submit" disabled={loading}
                        className="rounded-xl px-8 text-lg"
                        style={{ backgroundColor: '#D2B48C', color: '#1a1206', fontFamily: "'Cinzel', serif", boxShadow: '0 0 25px rgba(210,180,140,0.3)' }}>
                        {loading ? 'Sending...' : 'GET BETA'}
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="relative -mx-4 md:-mx-12 lg:-mx-24 xl:-mx-32">
            <div className="relative py-20 md:py-24 px-4" style={{ backgroundImage: `url(${darkWoodTexture})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div className="absolute inset-0 bg-black/40" />
              <div className="container mx-auto max-w-5xl relative z-10">
                <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 mb-10">
                  {[
                  { to: "/legal", label: t('landing.footer.legal') },
                  { to: "/privacy", label: t('landing.footer.privacy') },
                  { to: "/cookies", label: t('landing.footer.cookies') }].
                  map((link, i) =>
                  <Link
                    key={i}
                    to={link.to}
                    className="hover:opacity-80 transition-colors text-xl md:text-2xl"
                    style={{ color: '#E6C27A', fontFamily: "'Cinzel', serif", textShadow: '0 0 3px rgba(0,0,0,1), 1px 2px 6px rgba(0,0,0,0.9), -1px -1px 0 rgba(0,0,0,0.8), 1px -1px 0 rgba(0,0,0,0.8), -1px 1px 0 rgba(0,0,0,0.8), 1px 1px 0 rgba(0,0,0,0.8)' }}>
                    
                      {link.label}
                    </Link>
                  )}
                </div>

                {/* Social media */}
                <div className="flex items-center justify-center gap-8 sm:gap-10 mb-10">
                  {[
                  { href: "https://www.instagram.com/greenhuntstoopingapp/", icon: <Instagram className="h-11 w-11 sm:h-14 sm:w-14" /> },
                  { href: "https://www.tiktok.com/@greenhuntstoopingapp", icon:
                    <svg className="h-11 w-11 sm:h-14 sm:w-14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                      </svg>
                  },
                  { href: "https://www.youtube.com/@GreenHuntStoopingApp", icon: <Youtube className="h-11 w-11 sm:h-14 sm:w-14" /> },
                  { href: "https://x.com/StoopingApp", icon:
                    <svg className="h-11 w-11 sm:h-14 sm:w-14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                  },
                  { href: "https://www.linkedin.com/company/greenhunt", icon: <Linkedin className="h-11 w-11 sm:h-14 sm:w-14" /> }].
                  map((social, i) =>
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-125 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(210,180,140,0.6)]"
                    style={{ color: '#D2B48C' }}>
                    
                      {social.icon}
                    </a>
                  )}
                </div>

                {/* Divider */}
                <div className="w-full h-px mb-6" style={{ background: 'linear-gradient(90deg, transparent, #D2B48C, #A0845C, #D2B48C, transparent)' }} />

                {/* Tagline & email */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-2 px-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl md:text-2xl font-bold" style={{ color: '#D2B48C', fontFamily: "'Inter', sans-serif" }}>Made to stop the linear economy apocalypse</span>
                    <span className="text-2xl">💀🌍</span>
                  </div>
                  <a href="mailto:hello@greenhunt.net" className="text-xl md:text-2xl font-bold hover:scale-105 transition-all" style={{ color: '#D2B48C', fontFamily: "'Inter', sans-serif" }}>
                    hello@greenhunt.net
                  </a>
                </div>
              </div>
            </div>
          </footer>

          {/* Bottom Right Buttons */}
          <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-4 py-3 rounded-xl hover:scale-105 transition-all"
              style={{
                backgroundColor: '#D2B48C',
                color: '#1a1206',
                boxShadow: '0 0 15px rgba(210, 180, 140, 0.3)'
              }}
              aria-label="Go to top">
              <ArrowUp className="h-5 w-5" style={{ color: '#1a1206', stroke: '#1a1206' }} />
            </button>
            
          </div>
        </div>
      </div>
    </div>);

}