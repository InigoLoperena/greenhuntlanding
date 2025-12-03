import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowRight, MapPin, Users, ShoppingBag, Gift, DollarSign, Camera, Eye, Store, Plus, Languages, Globe, Trash2, Linkedin, Instagram, Youtube, Mail, Video, Star, TrendingUp, ArrowUp } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useScrollThrottle } from "@/hooks/useScrollThrottle";
import { useState } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { StructuredData } from "@/components/StructuredData";
import { HeroSection } from "@/components/HeroSection";
import greenhuntLogoNew from "@/assets/greenhunt-logo-new.svg";
import furnitureStreet from "@/assets/furniture-street.png";
import hunterGirl from "@/assets/hunter-girl.png";
import hunterMan from "@/assets/hunter-man.png";
import entrepreneur from "@/assets/entrepreneur.png";
import evangelizer from "@/assets/evangelizer.png";
import scavenger from "@/assets/scavenger.png";
import ecoHeroStats from "@/assets/eco-hero-stats.png";
import appProfileScreen from "@/assets/app-profile-screen.png";
import appMapScreen from "@/assets/app-map-screen.png";
import buyLinearEconomy from "@/assets/buy-linear-economy.png";
import useLinearEconomy from "@/assets/use-linear-economy.png";
import dumpLinearEconomy from "@/assets/dump-linear-economy-new.png";
import coordinatesPhone from "@/assets/coordinates-phone.png";
import coordinatesPhoneNew from "@/assets/coordinates-phone-new.png";
import appFeatureScreenshot from "@/assets/app-feature-screenshot.png";
import circularFlow from "@/assets/circular-flow.png";
import circularFlowDiagram from "@/assets/circular-flow-diagram.png";
import coordinatesPromo from "@/assets/coordinates-promo.svg";
import treasureMap from "@/assets/treasure-map.jpg";
import garageSaleScene from "@/assets/garage-sale-scene.svg";
import wasteManagerFlow from "@/assets/waste-manager-flow.png";
import wasteStep1 from "@/assets/waste-step-1.png";
import wasteStep2 from "@/assets/waste-step-2.png";
import wasteStep3 from "@/assets/waste-step-3.png";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
const emailSchema = z.string().email();
export default function LandingPage() {
  const {
    t,
    language,
    setLanguage
  } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const showAmbassadorButton = useScrollThrottle(400);
  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      toast.error(t('landing.beta.invalidEmail'));
      return;
    }
    setLoading(true);
    try {
      // @ts-ignore - waitlist table exists but types may not be updated
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
      }
    } catch (error) {
      console.error('Error adding to waitlist:', error);
      toast.error(t('landing.beta.error'));
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <StructuredData />
      
      {/* Floating Ambassador Login Button */}
      {showAmbassadorButton && location.pathname === '/' && <button onClick={() => navigate('/ambassador-program')} className="fixed top-6 right-6 z-50 bg-accent hover:bg-accent/90 text-primary font-permanent-marker px-6 py-3 rounded-full shadow-lg transition-all hover:scale-105" style={{
      color: '#611a5a'
    }}>
          {language === 'en' ? 'Ambassadors Login' : 'Login Embajadores'}
        </button>}

      {/* Hero Section */}
      <HeroSection />

      {/* App Feature Screenshot - centered below hero */}
      <section className="w-full py-12 px-4 bg-cover bg-center" style={{
      backgroundImage: 'url(/lovable-uploads/brick-wall-background.png)'
    }}>
        {/* Desktop - side by side */}
        <div className="hidden md:flex justify-center items-center gap-8">
          <img src={appMapScreen} alt="GreenHunt app map screen" className="w-1/2 max-w-2xl h-auto object-contain" loading="lazy" />
          <img src={appProfileScreen} alt="GreenHunt app profile screen" className="w-1/2 max-w-2xl h-auto object-contain" loading="lazy" />
        </div>
        {/* Mobile - stacked full width */}
        <div className="flex flex-col gap-6 md:hidden px-2">
          <img src={appMapScreen} alt="GreenHunt app map screen" className="w-full h-auto object-contain" loading="lazy" />
          <img src={appProfileScreen} alt="GreenHunt app profile screen" className="w-full h-auto object-contain" loading="lazy" />
        </div>
      </section>

      {/* App Store Badges Section */}
      

      {/* Angry Chair Scene */}
      

      {/* Furniture Street Scene */}
      

      {/* Furniture Hunt Section */}
      <section className="w-full bg-black py-2 md:py-12 px-2 md:px-4 bg-cover bg-center" style={{
      backgroundImage: 'url(/lovable-uploads/brick-wall-background.png)'
    }}>
        <div className="container mx-auto max-w-6xl">
          
          <p className="text-xl text-center text-subtitle-styled font-sedgwick-ave max-w-4xl mx-auto md:text-3xl my-0">
            {t('landing.pokemon.text')}
          </p>
        </div>
      </section>

      {/* App Feature Screenshot */}
      <section className="w-full bg-black bg-cover bg-center" style={{
      backgroundImage: 'url(/lovable-uploads/brick-wall-background.png)'
    }}>
        
      </section>

      {/* Hunter Characters Section - Magic Card Style */}
      <AnimatedSection animation="fade-up">
        <section className="w-full bg-black py-16 px-4 bg-cover bg-center" style={{
        backgroundImage: 'url(/lovable-uploads/brick-wall-background.png)'
      }}>
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-4xl md:text-6xl font-permanent-marker text-center mb-12">
              <span style={{
              color: '#699e4b'
            }}>
                {language === 'en' ? 'SELECT YOUR CHARACTER AND ' : 'SELECCIONA TU PERSONAJE Y '}
              </span>
              <span style={{
              color: '#611a5a'
            }}>
                {language === 'en' ? 'PLAY TO EARN FOR THE PLANET' : 'JUEGA PARA GANAR POR EL PLANETA'}
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* HUNTER */}
              <AnimatedSection animation="scale-in" delay={100}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                  <div className="relative bg-gradient-to-b from-gray-900 to-black border-2 border-purple-600/50 rounded-2xl p-4 shadow-2xl hover:scale-105 transition-transform duration-300 hover:border-purple-400">
                    <div className="aspect-square mb-4 rounded-xl overflow-hidden bg-gradient-to-b from-purple-900/20 to-transparent">
                      <img src={hunterGirl} alt="Hunter character" className="w-full h-full object-contain" loading="lazy" />
                    </div>
                    <h3 className="text-xl font-permanent-marker mb-2 text-center" style={{
                    color: '#611a5a'
                  }}>
                      HUNTER
                    </h3>
                    <p className="text-sm text-subtitle-styled font-sedgwick-ave text-center leading-tight">
                      {t('landing.hunt.treasures')}
                    </p>
                  </div>
                </div>
              </AnimatedSection>

              {/* EXPLORER */}
              <AnimatedSection animation="scale-in" delay={200}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                  <div className="relative bg-gradient-to-b from-gray-900 to-black border-2 border-purple-600/50 rounded-2xl p-4 shadow-2xl hover:scale-105 transition-transform duration-300 hover:border-purple-400">
                    <div className="aspect-square mb-4 rounded-xl overflow-hidden bg-gradient-to-b from-purple-900/20 to-transparent">
                      <img src={hunterMan} alt="Explorer character" className="w-full h-full object-contain" loading="lazy" />
                    </div>
                    <h3 className="text-xl font-permanent-marker mb-2 text-center" style={{
                    color: '#611a5a'
                  }}>
                      EXPLORER
                    </h3>
                    <p className="text-sm text-subtitle-styled font-sedgwick-ave text-center leading-tight">
                      {t('landing.hunt.explore')}
                    </p>
                  </div>
                </div>
              </AnimatedSection>

              {/* ENTREPRENEUR */}
              <AnimatedSection animation="scale-in" delay={300}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                  <div className="relative bg-gradient-to-b from-gray-900 to-black border-2 border-purple-600/50 rounded-2xl p-4 shadow-2xl hover:scale-105 transition-transform duration-300 hover:border-purple-400">
                    <div className="aspect-square mb-4 rounded-xl overflow-hidden bg-gradient-to-b from-purple-900/20 to-transparent">
                      <img src={entrepreneur} alt="Entrepreneur character" className="w-full h-full object-contain" loading="lazy" />
                    </div>
                    <h3 className="text-xl font-permanent-marker mb-2 text-center" style={{
                    color: '#611a5a'
                  }}>
                      ENTREPRENEUR
                    </h3>
                    <p className="text-sm text-subtitle-styled font-sedgwick-ave text-center leading-tight">
                      {language === 'en' ? 'Start your own circular market and earn money' : 'Inicia tu propio mercado circular y gana dinero'}
                    </p>
                  </div>
                </div>
              </AnimatedSection>

              {/* EVANGELIZER */}
              <AnimatedSection animation="scale-in" delay={400}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                  <div className="relative bg-gradient-to-b from-gray-900 to-black border-2 border-purple-600/50 rounded-2xl p-4 shadow-2xl hover:scale-105 transition-transform duration-300 hover:border-purple-400">
                    <div className="aspect-square mb-4 rounded-xl overflow-hidden bg-gradient-to-b from-purple-900/20 to-transparent">
                      <img src={evangelizer} alt="Evangelizer character" className="w-full h-full object-contain" loading="lazy" />
                    </div>
                    <h3 className="text-xl font-permanent-marker mb-2 text-center" style={{
                    color: '#611a5a'
                  }}>
                      EVANGELIZER
                    </h3>
                    <p className="text-sm text-subtitle-styled font-sedgwick-ave text-center leading-tight">
                      {language === 'en' ? 'Promote the circular economy and earn money' : 'Promueve la economía circular y gana dinero'}
                    </p>
                  </div>
                </div>
              </AnimatedSection>

              {/* SCAVENGER */}
              <AnimatedSection animation="scale-in" delay={500}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                  <div className="relative bg-gradient-to-b from-gray-900 to-black border-2 border-purple-600/50 rounded-2xl p-4 shadow-2xl hover:scale-105 transition-transform duration-300 hover:border-purple-400">
                    <div className="aspect-square mb-4 rounded-xl overflow-hidden bg-gradient-to-b from-purple-900/20 to-transparent">
                      <img src={scavenger} alt="Scavenger character" className="w-full h-full object-contain" loading="lazy" />
                    </div>
                    <h3 className="text-xl font-permanent-marker mb-2 text-center" style={{
                    color: '#611a5a'
                  }}>
                      SCAVENGER
                    </h3>
                    <p className="text-sm text-subtitle-styled font-sedgwick-ave text-center leading-tight">
                      {language === 'en' ? 'Collect free items, decorate your home, or sell and earn' : 'Recoge artículos gratis, decora tu hogar, o vende y gana'}
                    </p>
                  </div>
                </div>
              </AnimatedSection>

              {/* ECO-HERO STATS */}
              <AnimatedSection animation="scale-in" delay={600}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-b from-green-600/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                  <div className="relative bg-gradient-to-b from-gray-900 to-black border-2 border-green-600/50 rounded-2xl p-4 shadow-2xl hover:scale-105 transition-transform duration-300 hover:border-green-400">
                    <img src={ecoHeroStats} alt="Eco-Hero Stats showing environmental impact" className="w-full h-full object-contain rounded-xl" loading="lazy" />
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* App Screenshots Section */}
            
          </div>
        </section>
      </AnimatedSection>

      {/* Make Money Sharing Photos Section */}
      <section className="py-20 px-4 bg-black relative bg-cover bg-center" style={{
      backgroundImage: 'url(/lovable-uploads/brick-wall-background.png)'
    }}>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-5xl font-permanent-marker mb-8 leading-tight" style={{
              color: '#699e4b'
            }}>{t('landing.coordinates.title')}</h2>
              <div className="space-y-6 mb-12">
                <div className="flex gap-4">
                  <Camera className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <p className="text-lg text-subtitle-styled font-sedgwick-ave">{t('landing.coordinates.feature1')}</p>
                </div>
                <div className="flex gap-4">
                  <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <p className="text-lg text-subtitle-styled font-sedgwick-ave">{t('landing.coordinates.feature2')}</p>
                </div>
                <div className="flex gap-4">
                  <DollarSign className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <p className="text-lg text-subtitle-styled font-sedgwick-ave">{t('landing.coordinates.feature3')}</p>
                </div>
              </div>

              {/* Buy Coordinates Section */}
              <div className="mt-12">
                <h3 style={{
                color: '#699e4b'
              }} className="text-2xl md:text-4xl font-permanent-marker mb-4 my-0 py-[10px]">{t('landing.coordinates.buy.title')}</h3>
                <p className="text-lg text-subtitle-styled font-sedgwick-ave py-[10px]">{t('landing.coordinates.buy.description')}</p>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="w-80 max-w-sm mx-auto lg:ml-auto">
                <img src={coordinatesPhoneNew} alt="GreenHunt app showing how to buy coordinates of abandoned furniture for $1" className="w-full h-auto rounded-3xl shadow-2xl" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coordinates Promo Image */}
      <section className="py-16 px-4 bg-black relative bg-cover bg-center" style={{
      backgroundImage: 'url(/lovable-uploads/brick-wall-background.png)'
    }}>
        <div className="flex justify-center">
          <img src={coordinatesPromo} alt="Coordinates promo illustration" className="w-full max-w-5xl h-auto" loading="lazy" />
        </div>
      </section>

      {/* Circular Markets Feature */}
      <section className="py-20 px-4 bg-black relative bg-cover bg-center" style={{
      backgroundImage: 'url(/lovable-uploads/brick-wall-background.png)'
    }}>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              {/* App Screenshots - Aligned to left */}
              <div className="space-y-8">
                <div className="w-80 max-w-sm">
                  <img alt="Mary's Garage Sale showcasing various items for sale" className="w-full h-auto rounded-3xl shadow-2xl" loading="lazy" src="/lovable-uploads/ab9befd0-bc33-4099-951d-521544999c84.png" />
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-5xl font-permanent-marker mb-8 leading-tight" style={{
              color: '#699e4b'
            }}>{t('landing.thrift.title')}</h2>
              <div className="space-y-6 mb-8">
                <div className="flex gap-4">
                  <Eye className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <p className="text-lg text-subtitle-styled font-sedgwick-ave">{t('landing.thrift.feature1')}</p>
                </div>
                <div className="flex gap-4">
                  <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <p className="text-lg text-subtitle-styled font-sedgwick-ave">{t('landing.thrift.feature2')}</p>
                </div>
                <div className="flex gap-4">
                  <Trash2 className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <p className="text-lg text-subtitle-styled font-sedgwick-ave">{t('landing.thrift.feature3')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Create Your Own Market Section */}
      <section className="py-20 px-4 bg-black relative bg-cover bg-center" style={{
      backgroundImage: 'url(/lovable-uploads/brick-wall-background.png)'
    }}>
        <div className="container mx-auto max-w-6xl relative z-10">
          <h2 style={{
          color: '#699e4b'
        }} className="text-3xl md:text-5xl font-permanent-marker mb-12 text-center leading-tight my-0 py-[10px]">{t('landing.market.title')}</h2>
          
          <div className="grid md:grid-cols-2 gap-8 my-[100px]">
            <div className="flex justify-center">
              <img src="/lovable-uploads/thrift-store-profile.png" alt="Create your thrift store profile" className="w-full max-w-md h-auto rounded-lg shadow-2xl" loading="lazy" />
            </div>
            <div className="flex justify-center">
              <img src={garageSaleScene} alt="Create your garage sale profile" className="w-full max-w-md h-auto rounded-2xl shadow-2xl" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Linear Economy Section */}
      <section className="py-20 px-4 bg-black relative bg-cover bg-center" style={{
      backgroundImage: 'url(/lovable-uploads/brick-wall-background.png)'
    }}>
        <div className="container mx-auto max-w-6xl relative z-10">
          {/* First Row - BUY and USE */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* BUY */}
            <div className="flex flex-col items-center text-center">
              <img src={buyLinearEconomy} alt="Buy" className="w-full max-w-md h-auto mb-4" loading="lazy" />
              <h3 className="text-4xl md:text-5xl font-permanent-marker" style={{
              color: '#699e4b'
            }}>{t('landing.economy.buy')}</h3>
            </div>

            {/* USE */}
            <div className="flex flex-col items-center text-center">
              <img src={useLinearEconomy} alt="Use" className="w-full max-w-md h-auto mb-4" loading="lazy" />
              <h3 className="text-4xl md:text-5xl font-permanent-marker" style={{
              color: '#699e4b'
            }}>{t('landing.economy.use')}</h3>
            </div>
          </div>

          {/* Second Row - DUMP full width */}
          <div className="mb-12">
            <div className="flex flex-col items-center text-center overflow-hidden w-full">
              <img src={dumpLinearEconomy} alt="Dump" className="w-[120vw] min-h-[60vh] max-w-none h-auto object-contain md:w-full md:min-h-0 md:max-h-none mb-4" loading="lazy" />
              <h3 className="text-4xl md:text-5xl font-permanent-marker" style={{
              color: '#699e4b'
            }}>{t('landing.economy.dump')}</h3>
            </div>
          </div>

          <p className="text-2xl md:text-3xl text-center text-subtitle-styled font-sedgwick-ave max-w-4xl mx-auto mb-12">{t('landing.economy.text')}</p>

          {/* Waste Manager Flow Image - Desktop Only */}
          <div className="w-full hidden md:block">
            <img alt="Waste management flow - Trash Picker, Valuable Stuff Picker, Phygital Marketplace" loading="lazy" className="w-full h-auto object-cover" src="/lovable-uploads/97543963-e090-48e5-b9f3-7d5bab1dfcd8.png" />
          </div>
          
          {/* Mobile Only - Three Waste Steps */}
          <div className="flex flex-col gap-8 md:hidden">
            <img src={wasteStep1} alt="1. Share valuable discarded stuff coordinates - Trash Picker" loading="lazy" className="w-full h-auto" />
            <img src={wasteStep2} alt="2. Optimized picking route - Valuable Stuff Picker" loading="lazy" className="w-full h-auto" />
            <img src={wasteStep3} alt="3. Sell or donate fast - Phygital Circular Marketplace" loading="lazy" className="w-full h-auto" />
          </div>
        </div>
      </section>

      {/* Circular Waste Management Partnership Section */}
      <section className="py-20 bg-black relative bg-cover bg-center" style={{
      backgroundImage: 'url(/lovable-uploads/brick-wall-background.png)'
    }}>
        <div className="container mx-auto max-w-6xl relative z-10 px-4">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-3xl md:text-4xl font-permanent-marker mb-6" style={{
            color: '#699e4b'
          }}>
              {language === 'en' ? 'PARTNERING WITH WASTE MANAGERS FOR A CIRCULAR FUTURE' : 'ALIANZAS CON GESTORES DE RESIDUOS PARA UN FUTURO CIRCULAR'}
            </h3>
            <p className="text-xl text-subtitle-styled font-sedgwick-ave max-w-3xl mb-8">
              {language === 'en' ? 'We are partnering with waste management companies, thrift and antique stores to integrate and co-create our solution with them. Our goal is to scale the \'free stuff\' circular business model to avoid unnecessary waste, reduce first-hand demand, decrease raw material extraction and reduce gas emissions' : 'Nos estamos asociando con empresas de gestión de residuos, tiendas de segunda mano y antigüedades para integrar y co-crear nuestra solución con ellas. Nuestro objetivo es escalar el modelo de negocio circular de \'cosas gratis\' para evitar residuos innecesarios, reducir la demanda de productos nuevos, disminuir la extracción de materias primas y reducir las emisiones de gases'}
            </p>
            <Button asChild className="bg-accent hover:bg-accent/90 font-permanent-marker text-lg px-8 py-6 mb-8" style={{
            color: '#611a5a'
          }}>
              <Link to="/waste-managers">
                {language === 'en' ? 'Know More' : 'Saber Más'}
              </Link>
            </Button>
          </div>
        </div>
        
      </section>

      {/* Ambassador Program Section */}
      <section className="py-20 px-4 bg-black relative bg-cover bg-center" style={{
      backgroundImage: 'url(/lovable-uploads/brick-wall-background.png)'
    }}>
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
              <Button asChild className="bg-accent hover:bg-accent/90 font-permanent-marker text-lg px-8 py-6" style={{
              color: '#611a5a'
            }}>
                <a href="/ambassador-program">
                  {t('landing.ambassador.button')}
                </a>
              </Button>
            </div>
            <div className="order-1 lg:order-2">
              <img src="/lovable-uploads/ambassador-program.png" alt="GreenHunt Ambassador Program" className="w-full max-w-md mx-auto lg:ml-auto h-auto rounded-lg" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Join Beta Section - Before Footer */}
      <section id="waitlist" className="relative py-20 px-4 bg-black bg-cover bg-center" style={{
      backgroundImage: 'url(/lovable-uploads/brick-wall-dark.png)'
    }}>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          {/* Waitlist Form */}
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
              <Input type="email" placeholder={t('landing.beta.placeholder')} value={email} onChange={e => setEmail(e.target.value)} required disabled={loading} className="w-full bg-white/90" />
              <Button type="submit" disabled={loading} className="w-full bg-accent hover:bg-accent/90 font-permanent-marker" style={{
              color: '#611a5a'
            }}>
                {loading ? t('landing.beta.joining') : t('landing.beta.button')}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Logo - Top Center */}
          <div className="flex flex-col items-center justify-center mb-8">
            <img src={greenhuntLogoNew} alt="GreenHunt" className="h-32 sm:h-40 lg:h-48 w-auto mb-4" loading="lazy" />
            <p className="font-sedgwick-ave text-lg text-center text-yellow-200">
              {t('landing.footer.tagline')}
            </p>
          </div>

          {/* Legal Links */}
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

          {/* Social Media Icons - Center */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <a href="https://www.linkedin.com/company/greenriot/" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 transition-colors">
              <Linkedin className="h-8 w-8" />
            </a>
            <a href="https://www.instagram.com/stoopingappgreenriot/" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 transition-colors">
              <Instagram className="h-8 w-8" />
            </a>
            <a href="https://x.com/StoopingApp" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 transition-colors">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="https://www.youtube.com/@greenriotstoopingapp" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 transition-colors">
              <Youtube className="h-8 w-8" />
            </a>
            <a href="https://www.tiktok.com/@stoopingappgreenriot" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 transition-colors">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
              </svg>
            </a>
          </div>

          {/* Bottom - Made with love & Email */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Left - Made with love */}
            <div className="flex items-center gap-2">
              <span className="text-white font-sedgwick-ave text-sm">{t('landing.footer.madeWith')}</span>
              <span className="text-lg">💚</span>
              <span className="text-white font-sedgwick-ave text-sm">{t('landing.footer.forPlanet')}</span>
              <span className="text-lg">🌍</span>
            </div>

            {/* Right - Contact */}
            <a href="mailto:hello@greenhunt.net" className="text-white font-sedgwick-ave text-sm hover:text-accent transition-colors">hello@greenhunt.net</a>
          </div>
        </div>
      </footer>

      {/* Bottom Right Buttons - Language Switcher and Scroll to Top */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* Scroll to Top Button */}
        <Button onClick={() => window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })} className="bg-accent hover:bg-accent/90 font-permanent-marker shadow-rebel px-3 py-2 h-auto text-lg" style={{
        color: '#611a5a'
      }} aria-label={language === 'en' ? 'Go to top' : 'Ir al principio'}>
          <ArrowUp className="h-5 w-5" />
        </Button>
        
        {/* Language Switcher Button */}
        <Button onClick={() => setLanguage(language === 'en' ? 'es' : 'en')} className="bg-accent hover:bg-accent/90 font-permanent-marker shadow-rebel px-3 py-2 h-auto text-lg" style={{
        color: '#611a5a'
      }}>
          {language === 'en' ? 'ES' : 'EN'}
        </Button>
      </div>
    </div>;
}