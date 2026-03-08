import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Linkedin, Instagram, Youtube, ArrowUp, Video } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useState } from "react";
import { StructuredData } from "@/components/StructuredData";
import { HeroSection } from "@/components/HeroSection";
import greenhuntLogoNew from "@/assets/greenhunt-logo-new.svg";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import tutorialStep1 from "@/assets/tutorial-step-1.png";
import tutorialStep2 from "@/assets/tutorial-step-2.png";
import tutorialStep3 from "@/assets/tutorial-step-3.png";
import thriftingStep1 from "@/assets/thrifting-step-1.png";
import thriftingStep2 from "@/assets/thrifting-step-2.png";
import thriftingStep3 from "@/assets/thrifting-step-3.png";
import wasteStep1 from "@/assets/waste-step-1-new.png";
import wasteStep2 from "@/assets/waste-step-2-new.png";
import wasteStep3 from "@/assets/circular-market-delivery.png";
import junkStep1 from "@/assets/junk-step-1.jpg";
import junkStep2 from "@/assets/junk-step-2.png";
import junkStep3 from "@/assets/junk-step-3.png";
import junkRemovalFlow from "@/assets/junk-removal-flow.png";
import appStoreBadges from "@/assets/app-store-badges.png";
import wasteManagementFlow from "@/assets/waste-management-flow.png";
import playForPlanetScreen from "@/assets/play-for-planet-screen.png";
import appHeroPhone from "@/assets/app-hero-phone.png";
import strategicPartner from "@/assets/strategic-partner.png";
import ambassadorCharacter from "@/assets/ambassador-character.png";
import { MarginBackgrounds } from "@/components/MarginBackgrounds";
const emailSchema = z.string().email();
export default function LandingPage() {
  const {
    t,
    language,
    setLanguage
  } = useLanguage();
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
      const {
        error
      } = await supabase
      // @ts-ignore
      .from('beta_testers')
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
        const userEmail = email.toLowerCase().trim();
        toast.success(t('landing.beta.success'));
        setEmail("");

        // Send welcome email
        try {
          const {
            data,
            error: emailError
          } = await supabase.functions.invoke('send-welcome-email', {
            body: {
              email: userEmail
            }
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
  return <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      <MarginBackgrounds />
      
      {/* Content container with black center and transparent margins */}
      <div className="relative z-10">
        {/* Black background only for content area */}
        <div className="mx-4 md:mx-12 lg:mx-24 xl:mx-32 bg-black min-h-screen">
          <StructuredData />
          
          {/* Hero Section */}
          <HeroSection className="my-0 py-[80px]" />

      {/* App Promo & CTA Section */}
      <section className="px-4 py-0">
        <div className="container mx-auto max-w-6xl">
          {/* Title Row with Phone Image */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-center justify-between">
            
            {/* Left Side - App Info with Buttons */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="font-permanent-marker text-3xl md:text-4xl lg:text-5xl mb-4" style={{
                  color: '#6ea151'
                }}>
                {t('landing.app.title')}
              </h2>
              <p className="font-sedgwick-ave text-subtitle-styled text-xl md:text-2xl max-w-xl mx-auto lg:mx-0 mb-6">
                {t('landing.app.subtitle')}
              </p>
              
              {/* CTA Buttons - Below Description */}
              <div className="flex flex-row gap-4 items-center justify-center lg:justify-start">
                <Button onClick={() => setWaitlistOpen(true)} className="bg-[#a2c041] hover:bg-[#8da836] btn-purple-text font-permanent-marker text-xl px-8 py-6 rounded-xl transform rotate-1 hover:rotate-0 transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
                  {language === 'en' ? 'GET BETA' : 'OBTÉN BETA'}
                </Button>
                
                <Button onClick={() => setTrailerOpen(true)} variant="outline" className="font-permanent-marker text-sm px-4 py-2 h-auto border border-white text-white hover:bg-white hover:text-black">
                  <Video className="mr-1 h-4 w-4" />
                  Trailer
                </Button>
              </div>
              
              {/* App Store Badges - Centered below buttons */}
              <div className="flex flex-col items-center lg:items-center mt-10">
                <img src={appStoreBadges} alt="Available on App Store and Google Play" className="w-[280px] md:w-[320px] h-auto" />
                <p style={{
                    color: '#97c26c'
                  }} className="font-sedgwick-ave text-2xl md:text-3xl mt-2">
                  coming soon
                </p>
              </div>
            </div>
            
            {/* Right Side - Phone Image */}
            <div className="flex-1 flex items-center justify-center">
              <img alt="GreenHunt App Screenshot" className="h-96 md:h-[550px] lg:h-[700px] w-auto object-contain" loading="lazy" src="/lovable-uploads/8759250d-dd73-492b-977a-129c0e98d572.png" />
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Dialog */}
      <Dialog open={waitlistOpen} onOpenChange={setWaitlistOpen}>
        <DialogContent className="sm:max-w-md bg-black border-accent/20">
          <div className="text-center">
            <h3 className="font-permanent-marker text-2xl mb-4" style={{
                color: '#b4fa74'
              }}>
              {language === 'en' ? 'Get the Beta' : 'Obtén la Beta'}
            </h3>
          </div>
          <form onSubmit={handleWaitlistSubmit} className="space-y-4">
            <Input type="email" placeholder={language === 'en' ? 'Enter your email' : 'Ingresa tu email'} value={email} onChange={(e) => setEmail(e.target.value)} required className="font-sedgwick-ave bg-black/50 border-accent/30 text-white" />
            <Button type="submit" disabled={loading} className="w-full bg-[#a2c041] hover:bg-[#8da836] font-permanent-marker text-lg btn-purple-text">
              {loading ? language === 'en' ? 'Sending...' : 'Enviando...' : language === 'en' ? 'GET BETA' : 'OBTÉN BETA'}
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

      {/* Beta Form Before Stooping */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="max-w-md mx-auto bg-black/60 backdrop-blur-sm p-8 rounded-lg border border-white/20">
            <h2 className="text-2xl font-permanent-marker mb-2" style={{
                color: '#699e4b'
              }}>
              {t('landing.beta.title')}
            </h2>
            <p className="text-white font-sedgwick-ave mb-6">
              {t('landing.beta.description')}
            </p>
            <form onSubmit={handleWaitlistSubmit} className="space-y-4">
              <Input type="email" placeholder={t('landing.beta.placeholder')} value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} className="w-full bg-white/90 font-permanent-marker text-xl" style={{
                  color: '#6ea151'
                }} />
              <Button type="submit" disabled={loading} className="w-full bg-accent hover:bg-accent/90 font-permanent-marker btn-purple-text">
                {loading ? t('landing.beta.joining') : t('landing.beta.button')}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Tutorial Section */}
      <section className="py-16 md:py-20 px-4 relative">
        <div className="container mx-auto max-w-6xl relative z-10">
          <h2 style={{
              color: '#699e4b'
            }} className="text-3xl font-permanent-marker mb-12 text-center md:text-5xl">
            {t('landing.tutorial.title')}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-6">
                <img alt="Take photos of street finds" className="w-full max-w-md rounded-2xl shadow-lg object-cover" loading="lazy" src="/lovable-uploads/b2d445b9-fc2c-40d6-8b6f-4947539b949f.png" />
              </div>
              <p className="font-sedgwick-ave text-subtitle-styled text-3xl">
                {t('landing.tutorial.step1')}
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-6">
                <img src={tutorialStep2} alt="Make money when someone unlocks coordinates" className="w-full max-w-md rounded-2xl shadow-lg" loading="lazy" />
              </div>
              <p className="font-sedgwick-ave text-subtitle-styled text-3xl">
                {t('landing.tutorial.step2')}
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-6">
                <img alt="Buy coordinates and get valuable items" className="w-full max-w-md rounded-2xl shadow-lg" loading="lazy" src="/lovable-uploads/c1d89d6c-343e-495a-8f4a-58d9ff2876f5.png" />
              </div>
              <p className="font-sedgwick-ave text-subtitle-styled text-3xl">
                {t('landing.tutorial.disclaimer')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Local Phygital Thrifting Section */}
      <section className="py-16 md:py-20 px-4 relative">
        <div className="container mx-auto max-w-6xl relative z-10">
          <h2 className="text-3xl md:text-5xl font-permanent-marker mb-12 text-center" style={{
              color: '#699e4b'
            }}>
            {t('landing.thrifting.title')}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-6">
                <img alt="Explore thrift store catalogs" className="w-full max-w-xs rounded-2xl shadow-lg" loading="lazy" src="/lovable-uploads/199aa279-e2d7-4396-99dc-312cdf60c3d6.png" />
              </div>
              <p className="font-sedgwick-ave text-subtitle-styled text-3xl">
                {t('landing.thrifting.step1')}
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-6">
                <img src={thriftingStep2} alt="Request pickup for donations" className="w-full max-w-xs rounded-2xl shadow-lg" loading="lazy" />
              </div>
              <p className="font-sedgwick-ave text-subtitle-styled text-3xl">
                {t('landing.thrifting.step2')}
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-6">
                <img src={thriftingStep3} alt="Create your own garage sale" className="w-full max-w-xs rounded-2xl shadow-lg" loading="lazy" />
              </div>
              <p className="font-sedgwick-ave text-subtitle-styled text-3xl">
                {t('landing.thrifting.step3')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Waste Management Section */}
      <section className="py-16 md:py-20 px-4 relative">
        <div className="container mx-auto max-w-6xl relative z-10">
          <h2 className="text-3xl md:text-5xl font-permanent-marker mb-8 text-center" style={{
              color: '#699e4b'
            }}>
            {t('landing.waste.title')}
          </h2>
          
          {/* Waste Management Flow Diagram */}
          <div className="mb-12 flex justify-center">
            <img alt="Waste Management Flow" className="w-full max-w-4xl rounded-lg" loading="lazy" src="/lovable-uploads/a1848cb5-8abc-4f8a-bf63-c40c183e6fde.png" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-6">
                <img alt="Share coordinates with team" className="w-full max-w-xs rounded-2xl shadow-lg" loading="lazy" src="/lovable-uploads/746cc348-3ec5-4283-8ede-3caa2807ada7.png" />
              </div>
              <p className="font-sedgwick-ave text-subtitle-styled text-3xl">
                {t('landing.waste.step1')}
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-6">
                <img alt="Optimized route navigation" className="w-full max-w-xs rounded-2xl shadow-lg" loading="lazy" src="/lovable-uploads/4d4b3cc6-477f-46d2-b66e-1849b04e2072.png" />
              </div>
              <p className="font-sedgwick-ave text-subtitle-styled text-3xl">
                {t('landing.waste.step2')}
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-6">
                <img alt="Donate to local stores" className="w-full max-w-xs rounded-2xl shadow-lg" loading="lazy" src="/lovable-uploads/318700f9-052e-424f-bb23-94c7e893031c.png" />
              </div>
              <p className="font-sedgwick-ave text-subtitle-styled text-3xl">
                {t('landing.waste.step3')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Junk Removal Section */}
      <section className="py-16 md:py-20 px-4 relative">
        <div className="container mx-auto max-w-6xl relative z-10">
          <h2 className="text-3xl md:text-5xl font-permanent-marker mb-8 text-center" style={{
              color: '#699e4b'
            }}>
            {t('landing.junk.title')}
          </h2>
          
          {/* Junk Removal Flow Diagram */}
          <div className="mb-12 flex justify-center">
            <img src={junkRemovalFlow} alt="Junk Removal Flow" className="w-full max-w-4xl rounded-lg" loading="lazy" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-6">
                <img alt="Take photos of junk" className="w-full max-w-xs rounded-2xl shadow-lg" loading="lazy" src="/lovable-uploads/ddb40b3c-aada-427a-ae3c-992bf6263692.png" />
              </div>
              <p className="font-sedgwick-ave text-subtitle-styled text-3xl">
                {t('landing.junk.step1')}
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-6">
                <img alt="Users bid for removal" className="w-full max-w-xs rounded-2xl shadow-lg" loading="lazy" src="/lovable-uploads/7af001b6-bb85-47b6-bc77-636a2a117ade.png" />
              </div>
              <p className="font-sedgwick-ave text-subtitle-styled text-3xl">
                {t('landing.junk.step2')}
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-6">
                <img src={junkStep3} alt="Accept bid and schedule" className="w-full max-w-xs rounded-2xl shadow-lg" loading="lazy" />
              </div>
              <p className="font-sedgwick-ave text-subtitle-styled text-3xl">
                {t('landing.junk.step3')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Play for the Planet Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-permanent-marker mb-6 leading-tight" style={{
                  color: '#699e4b'
                }}>
                {t('landing.playPlanet.title')}
              </h2>
              <p className="text-xl md:text-2xl text-subtitle-styled font-sedgwick-ave">
                {t('landing.playPlanet.subtitle')}
              </p>
            </div>
            <div>
              <img src={playForPlanetScreen} alt="Play for the Planet - GreenHunt App" className="w-full max-w-md mx-auto lg:ml-auto h-auto rounded-lg" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Partners Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-5xl font-permanent-marker mb-6 leading-tight" style={{
                  color: '#699e4b'
                }}>
                {t('landing.strategic.title')}
              </h2>
              <p className="text-lg md:text-xl text-subtitle-styled font-sedgwick-ave">
                {t('landing.strategic.subtitle')}
              </p>
            </div>
            <div className="order-1 lg:order-2 flex justify-center">
              <img src={strategicPartner} alt="Strategic Partner" className="w-full max-w-xs lg:max-w-sm h-auto" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Ambassador Program Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-5xl font-permanent-marker mb-6 leading-tight" style={{
                  color: '#699e4b'
                }}>
                {t('landing.ambassador.title')}
              </h2>
              <p className="text-lg text-subtitle-styled font-sedgwick-ave mb-8">
                {t('landing.ambassador.description')}
              </p>
              {/* Ambassador button temporarily hidden
                                       <Link to="/ambassador-program">
                                        <Button className="bg-accent hover:bg-accent/90 font-permanent-marker text-lg px-8 py-6" style={{
                                          color: '#611a5a'
                                        }}>
                                          {t('landing.ambassador.button')}
                                        </Button>
                                       </Link>
                                       */}
            </div>
            <div className="order-1 lg:order-2 flex justify-center">
              <img src={ambassadorCharacter} alt="GreenHunt Ambassador Program" className="w-full max-w-xs lg:max-w-sm h-auto" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Join Beta Section */}
      <section id="waitlist" className="relative py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="max-w-md mx-auto bg-black/60 backdrop-blur-sm p-8 rounded-lg border border-white/20">
            <h2 className="text-2xl font-permanent-marker mb-2" style={{
                color: '#699e4b'
              }}>
              {t('landing.beta.title')}
            </h2>
            <p className="text-white font-sedgwick-ave mb-6">
              {t('landing.beta.description')}
            </p>
            <form onSubmit={handleWaitlistSubmit} className="space-y-4">
              <Input type="email" placeholder={t('landing.beta.placeholder')} value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} className="w-full bg-white/90 font-permanent-marker text-xl" style={{
                  color: '#6ea151'
                }} />
              <Button type="submit" disabled={loading} className="w-full bg-accent hover:bg-accent/90 font-permanent-marker btn-purple-text">
                {loading ? t('landing.beta.joining') : t('landing.beta.button')}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Separator Line */}
      <div className="w-full flex justify-center py-8">
        <div className="w-[95%] h-px" style={{
            backgroundColor: '#b4fa74'
          }} />
      </div>

      {/* Footer */}
      <footer className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-center mb-8">
            <img src={greenhuntLogoNew} alt="GreenHunt" className="h-32 sm:h-40 lg:h-48 w-auto mb-4" loading="lazy" />
            <p className="font-sedgwick-ave text-lg text-center text-yellow-200">
              {t('landing.footer.tagline')}
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 mb-8">
            <Link to="/privacy" className="hover:text-accent transition-colors font-permanent-marker text-white text-lg">
              {t('landing.footer.privacy')}
            </Link>
            <Link to="/legal" className="hover:text-accent transition-colors font-permanent-marker text-white text-lg">
              {t('landing.footer.terms')}
            </Link>
            <Link to="/cookies" className="hover:text-accent transition-colors font-permanent-marker text-white text-lg">
              {t('landing.footer.cookies')}
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 mb-8">
            <a href="https://www.linkedin.com/company/greenhunt" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 transition-colors">
              <Linkedin className="h-8 w-8" />
            </a>
            <a href="https://www.instagram.com/greenhuntstoopingapp/" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 transition-colors">
              <Instagram className="h-8 w-8" />
            </a>
            <a href="https://x.com/StoopingApp" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 transition-colors">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="https://www.youtube.com/@GreenHuntStoopingApp" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 transition-colors">
              <Youtube className="h-8 w-8" />
            </a>
            <a href="https://www.tiktok.com/@greenhuntstoopingapp" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 transition-colors">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
              </svg>
            </a>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-white font-sedgwick-ave text-lg">{t('landing.footer.madeWith')}</span>
              <span className="text-xl">💚</span>
              <span className="text-white font-sedgwick-ave text-lg">{t('landing.footer.forPlanet')}</span>
              <span className="text-xl">🌍</span>
            </div>
            <a href="mailto:hello@greenhunt.net" className="text-white font-sedgwick-ave text-lg hover:text-accent transition-colors">hello@greenhunt.net</a>
          </div>
        </div>
      </footer>

      {/* Bottom Right Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <Button onClick={() => window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })} className="bg-accent hover:bg-accent/90 font-permanent-marker shadow-rebel px-3 py-2 h-auto text-lg btn-purple-text" style={{ color: 'hsl(var(--button-green-foreground))', WebkitTextFillColor: 'hsl(var(--button-green-foreground))' }} aria-label={language === 'en' ? 'Go to top' : 'Ir al principio'}>
          <ArrowUp className="h-5 w-5" style={{ color: 'hsl(var(--button-green-foreground))', stroke: 'hsl(var(--button-green-foreground))' }} />
        </Button>
        
        <Button onClick={() => setLanguage(language === 'en' ? 'es' : 'en')} className="bg-accent hover:bg-accent/90 font-permanent-marker shadow-rebel px-3 py-2 h-auto text-lg btn-purple-text" style={{ color: 'hsl(var(--button-green-foreground))', WebkitTextFillColor: 'hsl(var(--button-green-foreground))' }}>
          <span style={{ color: 'hsl(var(--button-green-foreground))', WebkitTextFillColor: 'hsl(var(--button-green-foreground))' }}>{language === 'en' ? 'ES' : 'EN'}</span>
        </Button>
      </div>
        </div>
      </div>
      
    </div>;
}