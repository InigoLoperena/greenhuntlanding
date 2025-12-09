import { useLanguage } from '@/hooks/useLanguage';

export const StructuredData = () => {
  const { language } = useLanguage();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "GreenHunt",
    "applicationCategory": "LifestyleApplication",
    "operatingSystem": "iOS, Android",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": language === 'en' 
      ? "Make or save money - Save the Planet. Find free stuff, explore circular markets, and turn urban treasures into cash while helping the environment."
      : "Gana o ahorra dinero - Salva el Planeta. Encuentra cosas gratis, explora mercados circulares y convierte tesoros urbanos en efectivo mientras ayudas al medio ambiente.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250"
    },
    "featureList": [
      "Hunt abandoned furniture and treasures",
      "Share coordinates for money",
      "Explore circular markets",
      "Create thrift store profiles",
      "Waste management integration"
    ]
  };

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "GreenHunt",
    "url": "https://greenhunt.net",
    "logo": "https://greenhunt.net/lovable-uploads/greenhunt-logo-new.svg",
    "sameAs": [
      "https://www.linkedin.com/company/greenhunt",
      "https://www.instagram.com/greenhuntstoopingapp/",
      "https://x.com/StoopingApp",
      "https://www.youtube.com/@GreenHuntStoopingApp",
      "https://www.tiktok.com/@greenhuntstoopingapp"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "hello@greenhunt.net",
      "contactType": "customer service"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
    </>
  );
};
