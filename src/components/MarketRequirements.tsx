import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Video, Mail, Store, Home } from 'lucide-react';

const MarketRequirements = () => {
  return (
    <div className="space-y-6 p-6 bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Create Your Circular Market - FREE!
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Join the urban rebellion! Creating circular markets is now completely free. 
          Help us spread the word about sustainable living and get rewarded for your participation.
        </p>
      </div>

      {/* Requirements Grid */}
      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Thrift Store Requirements */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-gradient-to-l from-green-500 to-transparent w-32 h-32 opacity-10" />
          <CardHeader>
            <div className="flex items-center gap-3">
              <Store className="w-6 h-6 text-green-600" />
              <CardTitle className="text-2xl">Thrift Store Owners</CardTitle>
            </div>
            <Badge variant="secondary" className="w-fit">Physical Store Required</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Display our promotional materials in your store to join the GreenHunt community.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Promotional Kit by Mail</h4>
                  <p className="text-sm text-muted-foreground">
                    We'll send you a sticker and poster to display in your store
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Visible Display Required</h4>
                  <p className="text-sm text-muted-foreground">
                    Place both items in a visible location within your store
                  </p>
                </div>
              </div>
            </div>

            {/* Promotional Materials Preview */}
            <div className="mt-6 space-y-4">
              <h4 className="font-semibold text-center">What you'll receive:</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <img 
                    src="/lovable-uploads/86b3ae28-9916-425e-a0e0-9eb84f073882.png" 
                    alt="GreenHunt Sticker" 
                    className="w-full max-w-32 mx-auto rounded-lg shadow-md mb-2"
                  />
                  <p className="text-xs text-muted-foreground">Promotional Sticker</p>
                </div>
                <div className="text-center">
                  <img 
                    src="/lovable-uploads/2f77681b-a76e-4b04-b5fc-f3213fb9dfc0.png" 
                    alt="GreenHunt Poster" 
                    className="w-full max-w-32 mx-auto rounded-lg shadow-md mb-2"
                  />
                  <p className="text-xs text-muted-foreground">Store Poster</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Garage Sale Requirements */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-500 to-transparent w-32 h-32 opacity-10" />
          <CardHeader>
            <div className="flex items-center gap-3">
              <Home className="w-6 h-6 text-purple-600" />
              <CardTitle className="text-2xl">Garage Sale Hosts</CardTitle>
            </div>
            <Badge variant="secondary" className="w-fit">Social Media Required</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Create content about GreenRiot to help spread awareness about circular economy.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Video className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Create Promotional Video</h4>
                  <p className="text-sm text-muted-foreground">
                    Make a short video talking about the GreenRiot app and your experience
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Share on Social Media</h4>
                  <p className="text-sm text-muted-foreground">
                    Post your video on Instagram, TikTok, Facebook, or YouTube
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Send Video Link</h4>
                  <p className="text-sm text-muted-foreground">
                    Email the link to <strong>contact@greenriot.org</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h5 className="font-semibold text-yellow-800">Important Notice</h5>
                  <p className="text-sm text-yellow-700">
                    Failure to send the video within 1 month of registration may result in account deactivation.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Benefits Section */}
      <Card className="max-w-4xl mx-auto bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-green-800">Why These Requirements?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-green-800">Spread Awareness</h4>
              <p className="text-sm text-green-700">Help more people discover circular economy benefits</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Store className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-blue-800">Build Community</h4>
              <p className="text-sm text-blue-700">Create a network of sustainable businesses</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Video className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-purple-800">Authentic Content</h4>
              <p className="text-sm text-purple-700">Share real experiences from actual users</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <div className="text-center space-y-2">
        <p className="text-muted-foreground">
          Questions about the requirements? Contact us at{' '}
          <a href="mailto:contact@greenriot.org" className="text-primary hover:underline font-semibold">
            contact@greenriot.org
          </a>
        </p>
        <p className="text-sm text-muted-foreground">
          Join the urban rebellion and help build a more sustainable future! 🌱
        </p>
      </div>
    </div>
  );
};

export default MarketRequirements;