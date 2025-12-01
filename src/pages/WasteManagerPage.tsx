import { Button } from "@/components/ui/button";
import { MapPin, Users, Camera, Smartphone, Bluetooth, Navigation, Store, Recycle, TrendingUp, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import greenhuntLogoNew from "@/assets/greenhunt-logo-new.svg";
import wasteManagerTruck from "@/assets/waste-manager-truck.png";
import scoutingSystemIllustration from "@/assets/scouting-system-illustration.png";
import circularVsLinearWaste from "@/assets/circular-flow.png";
import circularFlowDiagram from "@/assets/circular-flow-diagram.png";
import treasureMap from "@/assets/treasure-map.jpg";

export default function WasteManagerPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Header with Logo */}
      <header className="w-full bg-black py-8 px-4 bg-cover bg-center sticky top-0 z-40" style={{
        backgroundImage: 'url(/lovable-uploads/brick-wall-background.png)'
      }}>
        <div className="container mx-auto max-w-6xl flex justify-between items-center">
          <Link to="/">
            <img src={greenhuntLogoNew} alt="GreenHunt Logo" className="h-16 sm:h-20 w-auto" />
          </Link>
          <Link to="/">
            <Button className="bg-accent hover:bg-accent/90 font-permanent-marker" style={{ color: '#611a5a' }}>
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full bg-black py-16 px-4 bg-cover bg-center" style={{
        backgroundImage: 'url(/lovable-uploads/brick-wall-background.png)'
      }}>
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-6xl font-permanent-marker mb-6 leading-tight" style={{
            color: '#699e4b'
          }}>
            GreenHunt Waste Manager System
          </h1>
          <p className="text-xl md:text-3xl text-subtitle-styled font-sedgwick-ave max-w-4xl mx-auto mb-8">
            A Tool to Facilitate the Circularity of discarded Valuable Objects
          </p>
          <p className="text-lg text-subtitle-styled font-sedgwick-ave max-w-3xl mx-auto mb-8">
            Transform linear waste management and save valuable items from beeing distroyed on landfills or recycling plants. Get a new revenue stream and measure the impact of your companie
          </p>
          <img src={circularFlowDiagram} alt="Circular economy flow showing city explorer, trash picker, valuable stuff picker, recycling plant, and digital circular market" className="w-full max-w-5xl mx-auto h-auto rounded-lg" loading="lazy" />
        </div>
      </section>


      {/* Waste Manager Profile Feature */}
      <section className="py-20 px-4 bg-black relative bg-cover bg-center" style={{
        backgroundImage: 'url(/lovable-uploads/brick-wall-background.png)'
      }}>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-5xl font-permanent-marker mb-8 leading-tight" style={{
                color: '#699e4b'
              }}>
                Coordinates share system
              </h2>
              <div className="space-y-6 mb-8">
                <div className="flex gap-4">
                  <Navigation className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <p className="text-lg text-subtitle-styled font-sedgwick-ave">
                    Go to exact locations to pick up valuable stuff
                  </p>
                </div>
                <div className="flex gap-4">
                  <Share2 className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <p className="text-lg text-subtitle-styled font-sedgwick-ave">
                    Share valuable item coordinates with your team or make them public for all users
                  </p>
                </div>
                <div className="flex gap-4">
                  <TrendingUp className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <p className="text-lg text-subtitle-styled font-sedgwick-ave">
                    Measure the impact of recovered stuff
                  </p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <img src={wasteManagerTruck} alt="Waste Manager using GreenHunt app in truck" className="w-full h-auto rounded-lg shadow-2xl" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Team Collaboration */}
      <section className="py-20 px-4 bg-black relative bg-cover bg-center" style={{
        backgroundImage: 'url(/lovable-uploads/brick-wall-background.png)'
      }}>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-1 lg:order-1">
              <img src={treasureMap} alt="Team collaboration map showing valuable items and team coordinates" className="w-full max-w-md h-auto rounded-lg shadow-2xl" loading="lazy" />
            </div>
            <div className="order-2 lg:order-2">
              <h2 className="text-3xl md:text-5xl font-permanent-marker mb-8 leading-tight" style={{
                color: '#699e4b'
              }}>
                Team Collaboration
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <Users className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <p className="text-lg text-subtitle-styled font-sedgwick-ave">
                    Add team members to your Waste Manager profile
                  </p>
                </div>
                <div className="flex gap-4">
                  <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <p className="text-lg text-subtitle-styled font-sedgwick-ave">
                    View a shared map with all coordinates added by team members
                  </p>
                </div>
                <div className="flex gap-4">
                  <TrendingUp className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <p className="text-lg text-subtitle-styled font-sedgwick-ave">
                    Track recovery rates and contribute to circular economy metrics
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coordinate Sharing */}
      <section className="py-20 px-4 bg-black relative bg-cover bg-center" style={{
        backgroundImage: 'url(/lovable-uploads/brick-wall-background.png)'
      }}>
        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-permanent-marker mb-12" style={{ color: '#699e4b' }}>
            Share Valuable Item Locations
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-black/50 p-8 rounded-lg border border-primary/20">
              <Camera className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-permanent-marker mb-4" style={{ color: '#699e4b' }}>
                With Photo
              </h3>
              <p className="text-subtitle-styled font-sedgwick-ave">
                Capture and share valuable items with photos for quick identification
              </p>
            </div>
            <div className="bg-black/50 p-8 rounded-lg border border-primary/20">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-permanent-marker mb-4" style={{ color: '#699e4b' }}>
                Coordinates Only
              </h3>
              <p className="text-subtitle-styled font-sedgwick-ave">
                Quick location sharing without photos for faster workflow
              </p>
            </div>
            <div className="bg-black/50 p-8 rounded-lg border border-primary/20">
              <Share2 className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-permanent-marker mb-4" style={{ color: '#699e4b' }}>
                Public or Private
              </h3>
              <p className="text-subtitle-styled font-sedgwick-ave">
                Share with your team only or make coordinates public for all users
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Scouting System */}
      <section className="py-20 px-4 bg-black relative bg-cover bg-center" style={{
        backgroundImage: 'url(/lovable-uploads/brick-wall-background.png)'
      }}>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-5xl font-permanent-marker mb-8 leading-tight" style={{
                color: '#699e4b'
              }}>
                Advanced Scouting System
              </h2>
              <div className="space-y-6 mb-8">
                <div className="flex gap-4">
                  <Bluetooth className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-lg text-subtitle-styled font-sedgwick-ave font-bold mb-2">
                      Bluetooth Device Integration
                    </p>
                    <p className="text-subtitle-styled font-sedgwick-ave">
                      Use a Bluetooth device to share coordinates with the push of a button - no need to pull out your phone or take photos
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Smartphone className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-lg text-subtitle-styled font-sedgwick-ave font-bold mb-2">
                      Motorcycle Scout + Truck Follow
                    </p>
                    <p className="text-subtitle-styled font-sedgwick-ave">
                      Deploy a motorcycle scout to find valuable items quickly. The collection truck follows behind with the shared coordinates map
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Navigation className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-lg text-subtitle-styled font-sedgwick-ave font-bold mb-2">
                      Integrated Navigation
                    </p>
                    <p className="text-subtitle-styled font-sedgwick-ave">
                      Built-in navigation system similar to Uber - no need to open external map apps
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <img src={scoutingSystemIllustration} alt="Motorcycle scout finding valuable items with truck following" className="w-full h-auto rounded-lg shadow-2xl" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-black relative bg-cover bg-center" style={{
        backgroundImage: 'url(/lovable-uploads/brick-wall-background.png)'
      }}>
        <div className="container mx-auto max-w-6xl relative z-10">
          <h2 className="text-3xl md:text-5xl font-permanent-marker mb-12 text-center" style={{ color: '#699e4b' }}>
            Benefits for Waste Management Companies
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-black/50 p-8 rounded-lg border border-primary/20">
              <h3 className="text-2xl font-permanent-marker mb-4" style={{ color: '#699e4b' }}>
                Enhance Community Relations
              </h3>
              <p className="text-lg text-subtitle-styled font-sedgwick-ave">
                Facilitate communication and interaction between waste management companies and citizens. Build trust and demonstrate environmental commitment.
              </p>
            </div>
            <div className="bg-black/50 p-8 rounded-lg border border-primary/20">
              <h3 className="text-2xl font-permanent-marker mb-4" style={{ color: '#699e4b' }}>
                Reduce Landfill Impact
              </h3>
              <p className="text-lg text-subtitle-styled font-sedgwick-ave">
                Divert valuable items from landfills and recycling plants. Contribute to circular economy goals and sustainability metrics.
              </p>
            </div>
            <div className="bg-black/50 p-8 rounded-lg border border-primary/20">
              <h3 className="text-2xl font-permanent-marker mb-4" style={{ color: '#699e4b' }}>
                Operational Efficiency
              </h3>
              <p className="text-lg text-subtitle-styled font-sedgwick-ave">
                Streamline valuable item identification and recovery with mobile scouting and integrated navigation. Optimize collection routes.
              </p>
            </div>
            <div className="bg-black/50 p-8 rounded-lg border border-primary/20">
              <h3 className="text-2xl font-permanent-marker mb-4" style={{ color: '#699e4b' }}>
                Revenue Opportunities
              </h3>
              <p className="text-lg text-subtitle-styled font-sedgwick-ave">
                Create additional revenue streams through Circular Markets. Turn waste management into resource recovery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-black relative bg-cover bg-center" style={{
        backgroundImage: 'url(/lovable-uploads/brick-wall-dark.png)'
      }}>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-permanent-marker mb-6" style={{ color: '#699e4b' }}>
            Ready to Transform Your Waste Management?
          </h2>
          <p className="text-xl text-subtitle-styled font-sedgwick-ave mb-8 max-w-2xl mx-auto">
            Join GreenHunt and be part of the circular economy revolution. Connect with your community and save valuable items from landfills.
          </p>
          <Link to="/#waitlist">
            <Button className="bg-accent hover:bg-accent/90 font-permanent-marker text-xl px-12 py-6" style={{ color: '#611a5a' }}>
              Join the Waitlist
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 px-4 border-t border-white/10">
        <div className="container mx-auto max-w-6xl text-center">
          <Link to="/">
            <img src={greenhuntLogoNew} alt="GreenHunt" className="h-24 w-auto mx-auto mb-6" loading="lazy" />
          </Link>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
            <Link to="/privacy" className="hover:text-accent transition-colors font-permanent-marker text-white">
              Privacy Policy
            </Link>
            <Link to="/legal" className="hover:text-accent transition-colors font-permanent-marker text-white">
              Terms of Service
            </Link>
            <Link to="/cookies" className="hover:text-accent transition-colors font-permanent-marker text-white">
              Cookie Policy
            </Link>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-white font-sedgwick-ave text-sm">Made with</span>
            <span className="text-lg">💚</span>
            <span className="text-white font-sedgwick-ave text-sm">for our planet</span>
            <span className="text-lg">🌍</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
