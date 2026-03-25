import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Globe, Mail, Play, Calendar, MessageCircle, Phone } from 'lucide-react';

const FONTS_URL = "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Inter:wght@300;400;500;600;700&display=swap";

interface SlideTheme {
  name: string;
  bg: string;
  title: string;
  text: string;
  accent: string;
}

const THEMES: SlideTheme[] = [
  { name: 'Charred Oak', bg: 'linear-gradient(135deg, #1a1008, #2c1c0e 50%, #1a1008)', title: '#E6C27A', text: '#E8DCC8', accent: '#CC5500' },
  { name: 'Scorched Walnut', bg: 'linear-gradient(180deg, #0d0806, #2a1610 50%, #0d0806)', title: '#D4A54A', text: '#F0E6D4', accent: '#8B2500' },
  { name: 'Burnt Cedar', bg: 'linear-gradient(135deg, #1a0f08, #2a1a0e 40%, #1a0f08)', title: '#E6C27A', text: '#E8DCC8', accent: '#D4870F' },
  { name: 'Dark Mahogany', bg: 'linear-gradient(160deg, #1c1410, #3a2820 50%, #1c1410)', title: '#FFD700', text: '#F5E6C8', accent: '#8B4513' },
  { name: 'Aged Ebony', bg: 'linear-gradient(180deg, #0e0c08, #1a1610 60%, #0e0c08)', title: '#DAA520', text: '#DCD0BC', accent: '#654321' },
  { name: 'Weathered Teak', bg: 'linear-gradient(140deg, #1e1408, #2e2010 45%, #1e1408)', title: '#E6C27A', text: '#E8DCC8', accent: '#B8860B' },
  { name: 'Dark Cherry', bg: 'linear-gradient(135deg, #1a0e10, #2c1c1e 50%, #1a0e10)', title: '#FFB347', text: '#F0E0D0', accent: '#A52A2A' },
  { name: 'Smoked Hickory', bg: 'linear-gradient(170deg, #141008, #241c10 50%, #141008)', title: '#E6C27A', text: '#E8DCC8', accent: '#8B6914' },
  { name: 'Ash Wood', bg: 'linear-gradient(135deg, #12100e, #1e1c18 50%, #12100e)', title: '#D4A54A', text: '#D8CDB8', accent: '#556B2F' },
  { name: 'Roasted Chestnut', bg: 'linear-gradient(150deg, #1a1208, #2a2010 45%, #1a1208)', title: '#E6C27A', text: '#E8DCC8', accent: '#8B4513' },
  { name: 'Charred Maple', bg: 'linear-gradient(135deg, #180e08, #281a10 55%, #180e08)', title: '#FFD700', text: '#F0E6D4', accent: '#CC5500' },
  { name: 'Dark Bamboo', bg: 'linear-gradient(160deg, #141006, #221c0e 50%, #141006)', title: '#DAA520', text: '#E0D4C0', accent: '#6B4423' },
  { name: 'Burnt Rosewood', bg: 'linear-gradient(145deg, #1a0e0a, #2c1a14 50%, #1a0e0a)', title: '#E6C27A', text: '#E8DCC8', accent: '#8B0000' },
  { name: 'Weathered Pine', bg: 'linear-gradient(135deg, #161208, #262010 50%, #161208)', title: '#FFB347', text: '#F0E0D0', accent: '#556B2F' },
  { name: 'Dark Redwood', bg: 'linear-gradient(180deg, #1c0e08, #2e1a12 50%, #1c0e08)', title: '#E6C27A', text: '#E8DCC8', accent: '#8B4513' },
  { name: 'Smoked Birch', bg: 'linear-gradient(155deg, #14100a, #241c14 45%, #14100a)', title: '#D4A54A', text: '#DCD0BC', accent: '#8B6914' },
  { name: 'Aged Driftwood', bg: 'linear-gradient(135deg, #181410, #2a2418 50%, #181410)', title: '#E6C27A', text: '#E8DCC8', accent: '#B8860B' },
  { name: 'Dark Cypress', bg: 'linear-gradient(170deg, #0e0c06, #1e1a10 50%, #0e0c06)', title: '#FFD700', text: '#F5E6C8', accent: '#654321' },
  { name: 'Burnt Poplar', bg: 'linear-gradient(140deg, #1a1410, #2c2418 50%, #1a1410)', title: '#E6C27A', text: '#E8DCC8', accent: '#A0522D' },
  { name: 'Charred Spruce', bg: 'linear-gradient(135deg, #161006, #281c0e 55%, #161006)', title: '#DAA520', text: '#E0D4C0', accent: '#CC5500' },
  { name: 'Dark Ironwood', bg: 'linear-gradient(160deg, #100c08, #1e1810 50%, #100c08)', title: '#E6C27A', text: '#E8DCC8', accent: '#8B4513' },
];

const WoodGrain = () => (
  <div className="absolute inset-0 pointer-events-none opacity-30" style={{
    backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(139,105,20,0.06) 60px, rgba(139,105,20,0.06) 61px), repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(0,0,0,0.08) 4px, rgba(0,0,0,0.08) 5px)`,
  }} />
);

const ThemeBadge = ({ theme, slideNum }: { theme: SlideTheme; slideNum: number }) => (
  <div className="absolute bottom-3 left-3 z-20 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
    <div className="text-[10px] text-gray-400 mb-1">Slide {slideNum} · {theme.name}</div>
    <div className="flex items-center gap-2 mb-0.5">
      {[theme.title, theme.text, theme.accent].map((c, i) => (
        <div key={i} className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ background: c }} />
          <span className="text-[9px] text-gray-500">{c}</span>
        </div>
      ))}
    </div>
    <span className="text-[9px] text-gray-500">Fonts: Cinzel · Inter</span>
  </div>
);

const SlideFrame = ({ theme, slideNum, children }: { theme: SlideTheme; slideNum: number; children: React.ReactNode }) => (
  <div className="w-full h-full relative overflow-hidden" style={{ background: theme.bg }}>
    <WoodGrain />
    <div className="absolute inset-0 bg-black/20" />
    <div className="relative z-10 w-full h-full overflow-y-auto">
      <div className="min-h-full flex flex-col items-center justify-center p-4 md:p-8 lg:p-12">
        {children}
      </div>
    </div>
    <ThemeBadge theme={theme} slideNum={slideNum} />
  </div>
);

const Title = ({ color, children }: { color: string; children: React.ReactNode }) => (
  <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-wider text-center uppercase mb-4 md:mb-6" style={{ fontFamily: 'Cinzel, serif', color, textShadow: '2px 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.5)' }}>
    {children}
  </h2>
);

const Body = ({ color, children, className = '' }: { color: string; children: React.ReactNode; className?: string }) => (
  <p className={`text-sm md:text-base lg:text-lg text-center max-w-3xl leading-relaxed ${className}`} style={{ fontFamily: 'Inter, sans-serif', color, textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
    {children}
  </p>
);

const SubTitle = ({ color, children }: { color: string; children: React.ReactNode }) => (
  <p className="text-base md:text-xl font-semibold text-center max-w-2xl mt-3 italic" style={{ fontFamily: 'Inter, sans-serif', color, textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
    {children}
  </p>
);

const SlideImage = ({ src, alt }: { src: string; alt: string }) => (
  <img src={src} alt={alt} className="mt-6 max-h-[30vh] md:max-h-[40vh] rounded-xl shadow-2xl border-2 border-amber-900/40 object-contain" loading="lazy" />
);

const Tags = ({ items, accent }: { items: string[]; accent: string }) => (
  <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-4">
    {items.map(tag => (
      <span key={tag} className="px-3 py-1.5 rounded-md text-xs md:text-sm border" style={{ borderColor: accent, color: accent, fontFamily: 'Cinzel, serif' }}>{tag}</span>
    ))}
  </div>
);

export default function DeckPage() {
  const [current, setCurrent] = useState(0);
  const total = 21;
  const touchRef = useRef<number>(0);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = FONTS_URL;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  const next = useCallback(() => setCurrent(s => Math.min(s + 1, total - 1)), []);
  const prev = useCallback(() => setCurrent(s => Math.max(s - 1, 0)), []);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [next, prev]);

  const onTouchStart = (e: React.TouchEvent) => { touchRef.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); }
  };

  const renderSlide = () => {
    const t = THEMES[current];
    const n = current + 1;

    switch (current) {
      case 0: return (
        <SlideFrame theme={t} slideNum={n}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-widest" style={{ fontFamily: 'Cinzel, serif', color: t.title, textShadow: '3px 3px 12px rgba(0,0,0,0.9), 0 0 40px rgba(204,85,0,0.3)' }}>GREENHUNT</h1>
          <p className="text-xl md:text-2xl lg:text-3xl mt-4 text-center italic" style={{ fontFamily: 'Inter, sans-serif', color: t.text }}>Make local circular economy<br />Easy, fun and profitable</p>
          <Tags items={['ABANDONS', 'JUNK PICK UP', 'PRODUCTS', 'CIRCULAR MARKETS']} accent={t.accent} />
          <SlideImage src="/deck/page_1.jpg" alt="GreenHunt App Cover" />
        </SlideFrame>
      );

      case 1: return (
        <SlideFrame theme={t} slideNum={n}>
          <Title color={t.title}>MASSIVE WASTE ‼️</Title>
          <Body color={t.text}>Tons of objects worth hundreds of dollars, in good or perfect condition, end up destroyed, burned or buried daily in landfills or recycling plants. By innovating it is possible to generate an incentive to give them a second life.</Body>
          <SubTitle color={t.accent}>Waste managers haven't any solution to reintroduce discarded stuff in the market.</SubTitle>
          <SlideImage src="/deck/page_2.jpg" alt="Massive Waste Problem" />
        </SlideFrame>
      );

      case 2: return (
        <SlideFrame theme={t} slideNum={n}>
          <Title color={t.title}>UX OF "STOOPING"</Title>
          <Body color={t.text}>(sharing photos and locations of discarded Stuff on the streets so someone can give them a second life) on Instagram or WhatsApp is horrible, it requires a lot of manual tasks and the information is disorganized.</Body>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {['Stooping NYC', 'Stooping Toronto', 'Stooping in Brooklyn', 'Stooping in Queens'].map(link => (
              <span key={link} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: t.accent, color: t.title, fontFamily: 'Inter' }}>{link}</span>
            ))}
          </div>
          <SlideImage src="/deck/page_3.jpg" alt="UX of Stooping" />
        </SlideFrame>
      );

      case 3: return (
        <SlideFrame theme={t} slideNum={n}>
          <Title color={t.title}>SYSTEM FOR SHARING PHOTOS AND COORDINATES</Title>
          <Body color={t.text}>Avoid discarded stuff from becoming waste and make money for just taking a photo.</Body>
          <Tags items={['Abandons', 'Donations', 'Products', 'Circular Markets']} accent={t.accent} />
          <SlideImage src="/deck/page_4.jpg" alt="Photo & Coordinates System" />
        </SlideFrame>
      );

      case 4: return (
        <SlideFrame theme={t} slideNum={n}>
          <Title color={t.title}>COORDINATES BUY-SELL SYSTEM</Title>
          <Body color={t.text}>You know is 2.4 miles away from you but not exactly where, buy the coordinates and get a 300 $ sofa for 1 $</Body>
          <SubTitle color={t.accent}>Buy bargains or make money taking photos on the streets</SubTitle>
          <SlideImage src="/deck/page_5.jpg" alt="Coordinates Buy-Sell" />
          <p className="text-[10px] md:text-xs mt-4 max-w-2xl text-center italic" style={{ color: t.text, opacity: 0.7, fontFamily: 'Inter' }}>*It is not guaranteed that the object is still there, but the time of publication or the publisher user reputation are indicators of the probability. We are integrating systems to make sure publications are legit.</p>
        </SlideFrame>
      );

      case 5: return (
        <SlideFrame theme={t} slideNum={n}>
          <Title color={t.title}>THE THRIFT STORE PROBLEM</Title>
          <Body color={t.text}>Thrift and antique stores or garage sales do not digitize their catalogs because they do not have a good tool that highlights their value proposition: Seeing and touching things live before buying them.</Body>
          <SubTitle color={t.accent}>"When you buy online vs. when you receive it"</SubTitle>
          <SlideImage src="/deck/page_6.jpg" alt="Thrift Store Problem" />
        </SlideFrame>
      );

      case 6: return (
        <SlideFrame theme={t} slideNum={n}>
          <Title color={t.title}>DIGITIZE THRIFT & ANTIQUE STORES, GARAGE SALES</Title>
          <Body color={t.text}>A nearby list of secondhand stores or circular markets and their catalogs is useful for their clients. Centralizing the catalogs and the communication with them on an App makes the experience easier: Buying, selling, negotiating, donating or requesting a pickup for your unwanted Stuff.</Body>
          <SlideImage src="/deck/page_7.jpg" alt="Digitize Stores" />
        </SlideFrame>
      );

      case 7: return (
        <SlideFrame theme={t} slideNum={n}>
          <Title color={t.title}>CREATE YOUR OWN CIRCULAR MARKET</Title>
          <SubTitle color={t.accent}>Make money and save the planet.</SubTitle>
          <Body color={t.text} className="mt-4">Circular economy store organizations model is to sell things that people get rid of. Collecting things for free and selling them is profitable and good for the planet. We're going to digitize and scale this activity globally.</Body>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-6 max-w-2xl">
            {['emaus.org', 'cancer.org/discovery-shops', 'satruck.org', 'arcthrift.com', 'rastroremar.com', 'stvincentdepaul.net', 'goodwill.org', 'savers.com', 'habitat.org/restores'].map(url => (
              <span key={url} className="text-[10px] md:text-xs px-2 py-1 rounded border" style={{ borderColor: t.accent + '40', color: t.title, fontFamily: 'Inter' }}>{url}</span>
            ))}
          </div>
          <SlideImage src="/deck/page_8.jpg" alt="Circular Market Model" />
        </SlideFrame>
      );

      case 8: return (
        <SlideFrame theme={t} slideNum={n}>
          <Title color={t.title}>REINTRODUCING STUFF</Title>
          <Body color={t.text}>Reintroducing stuff like this on the market is easy if you donate it or sell it very cheap but waste managers and junk removers destroy them because they haven't enough incentives and a solution to do it easily.</Body>
          <SlideImage src="/deck/page_9.jpg" alt="Reintroducing Stuff" />
        </SlideFrame>
      );

      case 9: return (
        <SlideFrame theme={t} slideNum={n}>
          <Title color={t.title}>GREENHUNT "WASTE" MANAGEMENT SYSTEM</Title>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 max-w-4xl">
            <div className="text-center p-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${t.accent}30` }}>
              <p className="font-bold mb-2" style={{ color: t.title, fontFamily: 'Cinzel' }}>SHARE</p>
              <p className="text-xs" style={{ color: t.text, fontFamily: 'Inter' }}>Share valuable item coordinates with your team with a push of a button</p>
            </div>
            <div className="text-center p-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${t.accent}30` }}>
              <p className="font-bold mb-2" style={{ color: t.title, fontFamily: 'Cinzel' }}>ROUTE</p>
              <p className="text-xs" style={{ color: t.text, fontFamily: 'Inter' }}>Go to exact locations with an optimized route to pick up valuable stuff</p>
            </div>
            <div className="text-center p-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${t.accent}30` }}>
              <p className="font-bold mb-2" style={{ color: t.title, fontFamily: 'Cinzel' }}>MEASURE</p>
              <p className="text-xs" style={{ color: t.text, fontFamily: 'Inter' }}>Measure the impact of recovered stuff on your phygital circular market</p>
            </div>
          </div>
          <SlideImage src="/deck/page_10.jpg" alt="Waste Management System" />
        </SlideFrame>
      );

      case 10: return (
        <SlideFrame theme={t} slideNum={n}>
          <Title color={t.title}>PICKUP REQUEST & BIDDING SYSTEM</Title>
          <Body color={t.text}>Create a pickup request for your unwanted items and receive competitive bids from waste management companies. Some pay you, some charge — you choose the best deal.</Body>
          <div className="flex gap-6 mt-6">
            <div className="text-center p-3 rounded-lg" style={{ background: 'rgba(0,180,0,0.15)', border: '1px solid rgba(0,180,0,0.3)' }}>
              <p className="text-lg font-bold" style={{ color: '#4CAF50', fontFamily: 'Cinzel' }}>WE PAY! $</p>
              <p className="text-xs" style={{ color: t.text, fontFamily: 'Inter' }}>NYC Recyclers: +$20 Offer</p>
            </div>
            <div className="text-center p-3 rounded-lg" style={{ background: 'rgba(180,0,0,0.15)', border: '1px solid rgba(180,0,0,0.3)' }}>
              <p className="text-lg font-bold" style={{ color: '#f44336', fontFamily: 'Cinzel' }}>WE CHARGE! $</p>
              <p className="text-xs" style={{ color: t.text, fontFamily: 'Inter' }}>QuickJunk Removal: -$80 Cost</p>
            </div>
          </div>
          <SlideImage src="/deck/page_11.jpg" alt="Pickup System" />
        </SlideFrame>
      );

      case 11: return (
        <SlideFrame theme={t} slideNum={n}>
          <Title color={t.title}>EASY AND PROFITABLE LOCAL CIRCULAR COLLABORATION</Title>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 max-w-4xl">
            {[
              { title: 'ABANDONS / STOOPING', desc: 'Earn money by posting photos and coordinates of discarded stuff on the street and keep them out of the landfill. Or buy and get bargains!' },
              { title: 'DONATIONS', desc: 'Get rid of things you\'ll never use easily. Or pick up free stuff from your neighbors or near circular markets!' },
              { title: 'PRODUCTS', desc: 'Discover local products available at local markets or from nearby individuals. Or sell your stuff for free!' },
              { title: 'THRIFTING', desc: 'Explore nearby thrift stores, circular markets or garage sales. Browse their catalogs, chat directly to buy, sell, negotiate, donate or request pickup services.' },
            ].map(item => (
              <div key={item.title} className="p-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${t.accent}30` }}>
                <p className="font-bold mb-2 text-sm" style={{ color: t.title, fontFamily: 'Cinzel' }}>{item.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: t.text, fontFamily: 'Inter' }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <SlideImage src="/deck/page_12.jpg" alt="Features Overview" />
        </SlideFrame>
      );

      case 12: return (
        <SlideFrame theme={t} slideNum={n}>
          <Title color={t.title}>PLAY FOR THE PLANET</Title>
          <SubTitle color={t.accent}>For fun or for money, company or individual — measure the impact of the treasures you saved from the landfill</SubTitle>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {['CO2 Saved', 'Trees Saved', 'Water Saved', 'Waste Diverted'].map(metric => (
              <div key={metric} className="px-4 py-3 rounded-lg text-center" style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${t.accent}30` }}>
                <p className="text-xs" style={{ color: t.title, fontFamily: 'Cinzel' }}>{metric}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 px-6 py-3 rounded-lg" style={{ background: t.accent + '30', border: `2px solid ${t.accent}` }}>
            <p className="font-bold" style={{ color: t.title, fontFamily: 'Cinzel' }}>🏆 CLAIM REWARDS</p>
          </div>
          <SlideImage src="/deck/page_13.jpg" alt="Impact & Rewards" />
        </SlideFrame>
      );

      case 13: return (
        <SlideFrame theme={t} slideNum={n}>
          <Title color={t.title}>THE MISSING PIECE IN THE LOCAL CIRCULAR ECONOMY</Title>
          <div className="overflow-x-auto mt-4 w-full max-w-5xl">
            <table className="w-full text-xs md:text-sm" style={{ fontFamily: 'Inter', color: t.text }}>
              <thead>
                <tr>
                  <th className="p-2 text-left" style={{ color: t.title }}></th>
                  {['Local Store Catalogs', 'Remote Negotiation', 'Local Donations', 'Stooping', 'Gamification', 'Circular Junk'].map(h => (
                    <th key={h} className="p-2 text-center font-bold text-[10px] md:text-xs uppercase" style={{ color: t.title, fontFamily: 'Cinzel' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Salvation Army', vals: [false, false, true, false, false, false] },
                  { name: 'Olio', vals: [false, true, true, false, false, false] },
                  { name: 'Cash Converters', vals: [true, false, false, false, false, false] },
                  { name: 'Facebook Marketplace', vals: [false, true, true, false, false, false] },
                  { name: 'Craigslist', vals: [false, true, true, false, false, false] },
                  { name: 'GreenHunt', vals: [true, true, true, true, true, true] },
                ].map(row => (
                  <tr key={row.name} className="border-t" style={{ borderColor: t.accent + '20' }}>
                    <td className="p-2 font-bold text-xs" style={{ color: row.name === 'GreenHunt' ? t.title : t.text }}>{row.name}</td>
                    {row.vals.map((v, i) => (
                      <td key={i} className="p-2 text-center text-lg">{v ? '✅' : '❌'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SlideFrame>
      );

      case 14: return (
        <SlideFrame theme={t} slideNum={n}>
          <Title color={t.title}>BUSINESS MODEL</Title>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 max-w-4xl">
            {[
              { icon: '🏪', text: 'Freemium subscriptions for thrift stores, circular economy marketplaces, and garage sales — $89/month premium.' },
              { icon: '♻️', text: 'Freemium subscriptions for waste management companies — $189/month premium.' },
              { icon: '🚛', text: '20% commission on each pickup transaction through the platform.' },
              { icon: '📍', text: '20% commission on the purchase and sale of abandoned item coordinates.' },
              { icon: '📦', text: 'Integrated shipping system with transaction-based commissions.' },
              { icon: '💬', text: 'Premium monthly subscription for unlimited messaging on donor listings — $49/month.' },
              { icon: '🔔', text: 'Premium subscription for real-time notifications of nearby abandoned items — $49/month.' },
              { icon: '🤝', text: 'Strategic partnerships with public institutions, waste management companies, and circular economy networks.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${t.accent}20` }}>
                <span className="text-xl">{item.icon}</span>
                <p className="text-xs leading-relaxed" style={{ color: t.text, fontFamily: 'Inter' }}>{item.text}</p>
              </div>
            ))}
          </div>
        </SlideFrame>
      );

      case 15: return (
        <SlideFrame theme={t} slideNum={n}>
          <Title color={t.title}>FINANCIAL PROJECTIONS</Title>
          {[
            {
              year: 'YEAR 1 — GLOBAL LAUNCH (NYC, LA, SF)',
              rows: [
                ['🏪 Store/Garage Subscriptions', '250 × $89', '$22,250', '$267,000'],
                ['♻️ Waste Mgmt Subscriptions', '20 × $189', '$3,780', '$45,360'],
                ['🚛 Pickup Commissions', '150 × $10', '$1,500', '$18,000'],
                ['📍 Coordinate Sales', '2,000 × $1.00', '$2,000', '$24,000'],
              ],
              total: ['$29,530/mo', '$354,360/yr'],
            },
            {
              year: 'YEAR 2 — SCALING (MULTI-CITY)',
              rows: [
                ['🏪 Store/Garage Subscriptions', '1,500 × $89', '$133,500', '$1,602,000'],
                ['♻️ Waste Mgmt Subscriptions', '60 × $189', '$11,340', '$136,080'],
                ['🚛 Pickup Commissions', '800 × $10', '$8,000', '$96,000'],
                ['📍 Coordinate Sales', '15,000 × $1.00', '$15,000', '$180,000'],
              ],
              total: ['$167,840/mo', '$2,014,080/yr'],
            },
          ].map((table, ti) => (
            <div key={ti} className="w-full max-w-4xl mt-4">
              <h3 className="text-sm md:text-lg font-bold mb-2" style={{ color: t.title, fontFamily: 'Cinzel' }}>{table.year}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-[10px] md:text-xs" style={{ fontFamily: 'Inter', color: t.text }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${t.accent}40` }}>
                      {['Revenue Stream', 'Volume', 'Monthly', 'Annual'].map(h => (
                        <th key={h} className="p-1.5 text-left" style={{ color: t.title }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map((row, ri) => (
                      <tr key={ri} style={{ borderBottom: `1px solid ${t.accent}15` }}>
                        {row.map((cell, ci) => <td key={ci} className="p-1.5">{cell}</td>)}
                      </tr>
                    ))}
                    <tr style={{ background: t.accent + '20' }}>
                      <td className="p-1.5 font-bold" style={{ color: t.title }}>💰 TOTAL</td>
                      <td></td>
                      <td className="p-1.5 font-bold" style={{ color: t.title }}>{table.total[0]}</td>
                      <td className="p-1.5 font-bold" style={{ color: t.title }}>{table.total[1]}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </SlideFrame>
      );

      case 16: return (
        <SlideFrame theme={t} slideNum={n}>
          <Title color={t.title}>MARKET SIZE</Title>
          <div className="flex flex-col gap-6 mt-4 max-w-3xl w-full">
            {[
              { label: 'TAM', subtitle: 'Global Urban Circular Economy', value: '$30-40M ARR', desc: 'Thrift/antique stores, garage sales, waste management companies, donation communities' },
              { label: 'SAM', subtitle: 'Scale on USA & Global Cities', value: '$10-12M ARR', desc: 'Dense urban resale ecosystems, high concentration of thrift stores, active stooping & donation communities' },
              { label: 'SOM', subtitle: 'Launch: NYC · LA · San Francisco', value: '$2-3M ARR', desc: 'Early adopters: stoopers, resellers & local stores. First 24-36 months in core cities' },
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-lg flex flex-col md:flex-row items-start md:items-center gap-4" style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${t.accent}30` }}>
                <div className="text-center md:text-left min-w-[120px]">
                  <p className="text-2xl font-bold" style={{ color: t.title, fontFamily: 'Cinzel' }}>{item.label}</p>
                  <p className="text-lg font-bold" style={{ color: t.accent, fontFamily: 'Cinzel' }}>{item.value}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: t.title, fontFamily: 'Inter' }}>{item.subtitle}</p>
                  <p className="text-xs" style={{ color: t.text, fontFamily: 'Inter' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </SlideFrame>
      );

      case 17: return (
        <SlideFrame theme={t} slideNum={n}>
          <Title color={t.title}>GO-TO-MARKET STRATEGY</Title>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 max-w-5xl">
            {[
              { icon: '🏪', title: 'Partner with Local Stores', desc: 'Offer free premium access to NYC/LA/SF thrift stores. They must create a profile and display a GreenHunt poster.' },
              { icon: '💵', title: 'Free Cash on Streets', desc: 'Campaigns where you find free bundles of bills on the streets after downloading the app for initial traction.' },
              { icon: '🎤', title: 'Influencer Collaborations', desc: 'Partner with stooping, thrifting, and sustainability influencers as long-term brand ambassadors.' },
              { icon: '🔗', title: 'Referral Program', desc: 'Users earn 100% of first month fee from referrals. Referred users get 2 months for the price of 1.' },
              { icon: '📱', title: 'Social Media & UGC', desc: 'Content highlighting the problem and solution. UGC promotions for users who share how they use the app.' },
              { icon: '🎯', title: 'Targeted Paid Ads', desc: 'Highly targeted campaigns to NYC young people interested in sustainability and second-hand culture.' },
              { icon: '📧', title: 'Cold Mailing & Calling', desc: 'Big databases of thrift-antique stores, stooping followers, waste management companies.' },
              { icon: '🔍', title: 'Keywords Optimization', desc: 'SEO, SEM, LLMO and ASO for key terms like circular economy, stooping, thrift stores.' },
              { icon: '📰', title: 'Media & PR Outreach', desc: 'Engage press once the app has visible street presence and user traction.' },
            ].map((item, i) => (
              <div key={i} className="p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${t.accent}20` }}>
                <p className="text-lg mb-1">{item.icon}</p>
                <p className="text-xs font-bold mb-1" style={{ color: t.title, fontFamily: 'Cinzel' }}>{item.title}</p>
                <p className="text-[10px] leading-relaxed" style={{ color: t.text, fontFamily: 'Inter' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </SlideFrame>
      );

      case 18: return (
        <SlideFrame theme={t} slideNum={n}>
          <Title color={t.title}>TEAM</Title>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4 max-w-5xl">
            {[
              { name: 'Iñigo Loperena', role: 'CEO', desc: 'Extensive knowledge in entrepreneurship, growth marketing, and innovation. Deep empathy and imagination to design disruptive systems.' },
              { name: 'Aitor Colino', role: 'Growth Manager', desc: 'Researcher of new growth paths through digital marketing. Technical solutions builder who always seeks to innovate.' },
              { name: 'Daniel Vilaplana', role: 'CIO / Product Manager', desc: 'Bridges UX design, psychology, gamification, and marketing. Transforms complex ideas into products that drive retention.' },
              { name: 'Lucia Roman', role: 'Social Media & UGC', desc: 'Content creator based in Brooklyn. Strong network in NYC Stooping and circular economy community. Specialized in storytelling.' },
              { name: 'Luis Carlos Charris', role: 'CTO', desc: '17+ years in technology, AI, and software architecture. Led scalable projects across sectors. Founder of a startup with exit in USA.' },
            ].map((member, i) => (
              <div key={i} className="p-4 rounded-lg text-center" style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${t.accent}30` }}>
                <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl" style={{ background: t.accent + '30', border: `2px solid ${t.accent}` }}>
                  {member.name[0]}
                </div>
                <p className="font-bold text-sm" style={{ color: t.title, fontFamily: 'Cinzel' }}>{member.name}</p>
                <p className="text-xs font-semibold mb-2" style={{ color: t.accent, fontFamily: 'Inter' }}>{member.role}</p>
                <p className="text-[10px] leading-relaxed" style={{ color: t.text, fontFamily: 'Inter' }}>{member.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] mt-4 max-w-3xl text-center italic" style={{ color: t.text, opacity: 0.7, fontFamily: 'Inter' }}>Remote team with strong skills. CTO agreement for equity-based app development. Recruiting bilingual marketing team in Buenos Aires for strategic advantage.</p>
        </SlideFrame>
      );

      case 19: return (
        <SlideFrame theme={t} slideNum={n}>
          <Title color={t.title}>THE ASK</Title>
          <div className="flex flex-col md:flex-row gap-8 mt-6 max-w-4xl">
            <div className="flex-1 space-y-4">
              {[
                { label: 'Raising', value: '$500,000' },
                { label: 'Instrument', value: 'SAFE Notes' },
                { label: 'Valuation Cap', value: '$5M' },
                { label: 'Company', value: 'U.S. C-Corp' },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-xs" style={{ color: t.text, fontFamily: 'Inter', opacity: 0.7 }}>{item.label}:</p>
                  <p className="text-xl md:text-2xl font-bold" style={{ color: t.title, fontFamily: 'Cinzel' }}>{item.value}</p>
                </div>
              ))}
            </div>
            <div className="flex-1 space-y-3">
              <p className="text-sm font-bold mb-3" style={{ color: t.title, fontFamily: 'Cinzel' }}>Seeking:</p>
              {['Lead investor to anchor the round', 'Preferential valuation or discount', 'Board seat', 'Pro-rata rights'].map(item => (
                <p key={item} className="text-xs flex items-center gap-2" style={{ color: t.text, fontFamily: 'Inter' }}>
                  <span style={{ color: t.accent }}>◆</span> {item}
                </p>
              ))}
              <div className="mt-6 p-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${t.accent}30` }}>
                <p className="text-xs font-bold mb-2" style={{ color: t.title, fontFamily: 'Cinzel' }}>USE OF FUNDS</p>
                <div className="space-y-1">
                  <p className="text-xs" style={{ color: t.text, fontFamily: 'Inter' }}>55-60% — Go-to-Market & Growth</p>
                  <p className="text-xs" style={{ color: t.text, fontFamily: 'Inter' }}>25-30% — Team (key hires & freelancers)</p>
                  <p className="text-xs" style={{ color: t.text, fontFamily: 'Inter' }}>10-15% — Operations & Infrastructure</p>
                </div>
              </div>
            </div>
          </div>
        </SlideFrame>
      );

      case 20: return (
        <SlideFrame theme={t} slideNum={n}>
          <h1 className="text-5xl md:text-7xl font-bold tracking-widest mb-8" style={{ fontFamily: 'Cinzel, serif', color: t.title, textShadow: '3px 3px 12px rgba(0,0,0,0.9)' }}>GREENHUNT</h1>
          <div className="space-y-5">
            {[
              { icon: <Globe size={24} />, label: 'greenhunt.net', href: 'https://greenhunt.net' },
              { icon: <Mail size={24} />, label: 'hello@greenhunt.net', href: 'mailto:hello@greenhunt.net' },
              { icon: <Play size={24} />, label: 'Founder Pitch', href: '#' },
              { icon: <Phone size={24} />, label: 'Beta App', href: 'https://greenhunt.net' },
              { icon: <Calendar size={24} />, label: 'Schedule Call', href: '#' },
              { icon: <MessageCircle size={24} />, label: 'Chat with founder', href: '#' },
            ].map((item, i) => (
              <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                <span style={{ color: t.accent }}>{item.icon}</span>
                <span className="text-lg md:text-xl" style={{ color: t.title, fontFamily: 'Inter' }}>{item.label}</span>
              </a>
            ))}
          </div>
        </SlideFrame>
      );

      default: return null;
    }
  };

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative select-none" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {renderSlide()}

      {/* Navigation */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-black/60 backdrop-blur-md rounded-full px-4 py-2">
        <button onClick={prev} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors" style={{ color: '#E6C27A' }} disabled={current === 0}>
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm min-w-[60px] text-center" style={{ fontFamily: 'Cinzel', color: '#E6C27A' }}>{current + 1} / {total}</span>
        <button onClick={next} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors" style={{ color: '#E6C27A' }} disabled={current === total - 1}>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Slide dots */}
      <div className="fixed right-3 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className="w-2 h-2 rounded-full transition-all" style={{ background: i === current ? '#E6C27A' : 'rgba(255,255,255,0.2)', transform: i === current ? 'scale(1.5)' : 'scale(1)' }} />
        ))}
      </div>
    </div>
  );
}
