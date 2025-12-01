import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'landing.hero.cta.abandoned': 'FIND ABANDONED FURNITURE',
    'landing.hero.cta.share': 'SHARE YOUR FINDS',
    'landing.stooping.title': 'STOOPING & THRIFTING APP',
    'landing.stooping.subtitle': 'save the planet by hunting abandoned furnitures. earn money exploring your city in a circular economy marketplace and game.',
    'landing.comingSoon': 'Coming soon',
    'landing.pokemon.text': 'Instead of hunting Pokémons, explore and hunt abandoned furnitures and other objects. Earn money and Save them from the landfill.',
    'landing.hunt.treasures': 'Hunt abandoned treasures and sell them $$$',
    'landing.hunt.explore': 'Explore your city and earn money by sharing photos and coordinates',
    'landing.coordinates.title': 'MAKE MONEY SHARING PHOTOS AND COORDINATES OF ABANDONED STREET FINDS',
    'landing.coordinates.feature1': 'hunt furniture, electronics or treasures abandoned on the street',
    'landing.coordinates.feature2': 'share the approximate location and earn money when someone buys the exact coordinates',
    'landing.coordinates.feature3': 'turn your daily walks into an urban business opportunity',
    'landing.coordinates.buy.title': 'BUY COORDINATES AND GET BARGAINS',
    'landing.coordinates.buy.description': 'you know there is a free couch 6 miles away from you but not exactly where, buy the coordinates and get a $200 couch for $1',
    'landing.thrift.title': 'EXPLORE LOCAL CIRCULAR THRIFT STORES AND GARAGE SALES',
    'landing.thrift.feature1': 'BROWSE CATALOGS OF LOCAL THRIFT STORES, GARAGE SALES AND CIRCULAR MARKETS FROM HOME. CHAT AND NEGOTIATE',
    'landing.thrift.feature2': "VISIT ONLY THE PLACES THAT HAVE WHAT YOU'RE LOOKING FOR, SAVING TIME AND GAS",
    'landing.thrift.feature3': 'ASK THEM TO COME TO YOUR HOUSE TO COLLECT YOUR UNWANTED ITEMS INSTEAD OF THROWING THEM IN THE TRASH',
    'landing.market.title': 'CREATE YOUR OWN CIRCULAR MARKET PROFILE FREE, MAKE MONEY WITH UNWANTED STUFF AND SAVE THE PLANET',
    'landing.economy.buy': '1 BUY',
    'landing.economy.use': '2 USE',
    'landing.economy.dump': '3 DUMP',
    'landing.economy.text': 'The linear economy of buy, use and Dump has changed forever',
    'landing.footer.tagline': 'Making local circular economy Easy, fun and profitable',
    'landing.beta.title': 'JOIN THE BETA',
    'landing.beta.description': 'Be among the first to try GreenHunt',
    'landing.beta.placeholder': 'Enter your email',
    'landing.beta.button': 'JOIN WAITLIST',
    'landing.beta.joining': 'Joining...',
    'landing.beta.emailExists': 'This email is already on the waitlist!',
    'landing.beta.error': 'Something went wrong. Please try again.',
    'landing.beta.success': "You're on the list! We'll notify you when the beta is ready.",
    'landing.beta.invalidEmail': 'Please enter a valid email address',
    'landing.markets.discover.title': 'DISCOVER LOCAL CIRCULAR MARKETS',
    'landing.markets.discover.feature1': 'Browse garage sales, thrift stores and circular markets near you',
    'landing.markets.discover.feature2': 'Find exact locations with our interactive map',
    'landing.markets.discover.feature3': 'Discover abandoned furniture left on the street',
    'landing.markets.discover.feature4': 'Create your own circular market or garage sale',
    'landing.survey.title': 'HELP US BUILD THE FUTURE',
    'landing.survey.description': 'Share your feedback and help us create the best stooping experience',
    'landing.survey.stooper.title': 'For Stooping Enthusiasts',
    'landing.survey.manager.title': 'For Circular Market Managers',
    'landing.survey.button': 'TAKE SURVEY',
    'landing.footer.privacy': 'Privacy Policy',
    'landing.footer.terms': 'Terms & Conditions',
    'landing.footer.cookies': 'Cookie Policy',
    'landing.footer.madeWith': 'Made with',
    'landing.footer.forPlanet': 'for the planet',
    'landing.footer.contact': 'Contact: stooping@greenriot.net',
    'landing.ambassador.title': "We're looking for GreenHunt Ambassadors!",
    'landing.ambassador.description': 'Help us build our circular thrift store and waste managers network before the app launch. Earn money by bringing partners on board and become a lifetime GreenHunt Ambassador to receive exclusive benefits such as higher commissions affiliate program and more',
    'landing.ambassador.button': 'Know more',
    'ambassador.dashboard': 'Ambassador Dashboard',
    'ambassador.welcome': 'Welcome',
    'ambassador.logout': 'Logout',
    'ambassador.login': 'Ambassador Login',
    'ambassador.nickname': 'Nickname',
    'ambassador.password': 'Password',
    'ambassador.loading': 'Loading...',
    'ambassador.loginBtn': 'Login',
    'ambassador.signupBtn': 'Sign Up',
    'ambassador.noAccount': "Don't have an account? Sign up",
    'ambassador.hasAccount': 'Already have an account? Login',
    'ambassador.backHome': 'Back to Home',
    'ambassador.gotStore': 'I Got a Store!',
    'ambassador.mySubmissions': 'My Store Submissions',
    'ambassador.leaderboard': 'Ambassador Leaderboard',
    'ambassador.form.title': 'Submit a New Store',
    'ambassador.form.storeName': 'Store Name',
    'ambassador.form.storeUrl': 'Website or Google Maps Profile',
    'ambassador.form.city': 'City',
    'ambassador.form.warning': 'Ask the store that signed the agreement to send us an email with the contract attached to hello@greenhunt.net. We will verify it and send commissions to the USD bank accounts configured in your profile at the end of the month.',
    'ambassador.form.submit': 'Submit Store',
    'ambassador.form.cancel': 'Cancel',
    'ambassador.form.success': 'Store submitted successfully!',
    'ambassador.form.error': 'Error submitting store',
    'ambassador.submissions.status': 'Status',
    'ambassador.submissions.pending': 'Pending Review',
    'ambassador.submissions.approved': 'Approved',
    'ambassador.submissions.rejected': 'Rejected',
    'ambassador.submissions.commission': 'Commission',
    'ambassador.submissions.submittedOn': 'Submitted on',
    'ambassador.submissions.empty': 'No submissions yet',
    'ambassador.leaderboard.rank': 'Rank',
    'ambassador.leaderboard.ambassador': 'Ambassador',
    'ambassador.leaderboard.stores': 'Stores',
    'ambassador.leaderboard.earned': 'Total Earned',
    'ambassador.leaderboard.empty': 'No ambassadors on the leaderboard yet',
    'ambassador.accountCreated': 'Ambassador account created successfully!',
    'ambassador.loginSuccess': 'Logged in successfully!',
    'ambassador.logoutSuccess': 'Logged out successfully',
    'ambassador.loginError': 'Error logging in',
    'ambassador.createError': 'Error creating account'
  },
  es: {
    'landing.hero.cta.abandoned': 'ENCUENTRA MUEBLES ABANDONADOS',
    'landing.hero.cta.share': 'COMPARTE TUS HALLAZGOS',
    'landing.stooping.title': 'APP DE STOOPING Y THRIFTING',
    'landing.stooping.subtitle': 'salva el planeta cazando muebles abandonados. gana dinero explorando tu ciudad en un marketplace de economía circular y juego.',
    'landing.comingSoon': 'Próximamente',
    'landing.pokemon.text': 'En lugar de cazar Pokémons, explora y caza muebles y otros objetos abandonados. Gana dinero y sálvalos del vertedero.',
    'landing.hunt.treasures': 'Caza tesoros abandonados y véndelos $$$',
    'landing.hunt.explore': 'Explora tu ciudad y gana dinero compartiendo fotos y coordenadas',
    'landing.coordinates.title': 'GANA DINERO COMPARTIENDO FOTOS Y COORDENADAS DE HALLAZGOS ABANDONADOS EN LA CALLE',
    'landing.coordinates.feature1': 'caza muebles, electrónicos o tesoros abandonados en la calle',
    'landing.coordinates.feature2': 'comparte la ubicación aproximada y gana dinero cuando alguien compre las coordenadas exactas',
    'landing.coordinates.feature3': 'convierte tus paseos diarios en una oportunidad de negocio urbano',
    'landing.coordinates.buy.title': 'COMPRA COORDENADAS Y CONSIGUE GANGAS',
    'landing.coordinates.buy.description': 'sabes que hay un sofá gratis a 10 km de ti pero no exactamente dónde, compra las coordenadas y consigue un sofá de $200 por $1',
    'landing.thrift.title': 'EXPLORA TIENDAS DE SEGUNDA MANO Y MERCADILLOS CIRCULARES LOCALES',
    'landing.thrift.feature1': 'NAVEGA CATÁLOGOS DE TIENDAS DE SEGUNDA MANO, MERCADILLOS Y MERCADOS CIRCULARES DESDE CASA. CHATEA Y NEGOCIA',
    'landing.thrift.feature2': 'VISITA SOLO LOS LUGARES QUE TIENEN LO QUE BUSCAS, AHORRANDO TIEMPO Y GASOLINA',
    'landing.thrift.feature3': 'PÍDELES QUE VENGAN A TU CASA A RECOGER TUS ARTÍCULOS NO DESEADOS EN LUGAR DE TIRARLOS A LA BASURA',
    'landing.market.title': 'CREA TU PROPIO PERFIL DE MERCADO CIRCULAR GRATIS, GANA DINERO CON COSAS NO DESEADAS Y SALVA EL PLANETA',
    'landing.economy.buy': '1 COMPRAR',
    'landing.economy.use': '2 USAR',
    'landing.economy.dump': '3 TIRAR',
    'landing.economy.text': 'La economía lineal de comprar, usar y tirar ha cambiado para siempre',
    'landing.footer.tagline': 'Haciendo la economía circular local fácil, divertida y rentable',
    'landing.beta.title': 'ÚNETE A LA BETA',
    'landing.beta.description': 'Sé de los primeros en probar GreenHunt',
    'landing.beta.placeholder': 'Introduce tu email',
    'landing.beta.button': 'UNIRSE A LISTA',
    'landing.beta.joining': 'Uniéndose...',
    'landing.beta.emailExists': '¡Este email ya está en la lista de espera!',
    'landing.beta.error': 'Algo salió mal. Por favor, inténtalo de nuevo.',
    'landing.beta.success': '¡Estás en la lista! Te avisaremos cuando la beta esté lista.',
    'landing.beta.invalidEmail': 'Por favor, introduce una dirección de email válida',
    'landing.markets.discover.title': 'DESCUBRE MERCADOS CIRCULARES LOCALES',
    'landing.markets.discover.feature1': 'Explora mercadillos, tiendas de segunda mano y mercados circulares cerca de ti',
    'landing.markets.discover.feature2': 'Encuentra ubicaciones exactas con nuestro mapa interactivo',
    'landing.markets.discover.feature3': 'Descubre muebles abandonados en la calle',
    'landing.markets.discover.feature4': 'Crea tu propio mercado circular o mercadillo',
    'landing.survey.title': 'AYÚDANOS A CONSTRUIR EL FUTURO',
    'landing.survey.description': 'Comparte tu opinión y ayúdanos a crear la mejor experiencia de stooping',
    'landing.survey.stooper.title': 'Para Entusiastas del Stooping',
    'landing.survey.manager.title': 'Para Gestores de Mercados Circulares',
    'landing.survey.button': 'HACER ENCUESTA',
    'landing.footer.privacy': 'Política de Privacidad',
    'landing.footer.terms': 'Términos y Condiciones',
    'landing.footer.cookies': 'Política de Cookies',
    'landing.footer.madeWith': 'Hecho con',
    'landing.footer.forPlanet': 'por el planeta',
    'landing.footer.contact': 'Contacto: stooping@greenriot.net',
    'landing.ambassador.title': '¡Buscamos Embajadores de GreenHunt!',
    'landing.ambassador.description': 'Ayúdanos a construir nuestra red circular de tiendas de segunda mano y waste managers antes del lanzamiento de la app. Gana dinero trayendo socios y conviértete en Embajador de GreenHunt de por vida para recibir beneficios exclusivos como comisiones más altas en el programa de afiliados y más',
    'landing.ambassador.button': 'Saber más',
    'ambassador.dashboard': 'Panel de Embajador',
    'ambassador.welcome': 'Bienvenido',
    'ambassador.logout': 'Cerrar Sesión',
    'ambassador.login': 'Inicio de Sesión de Embajador',
    'ambassador.nickname': 'Apodo',
    'ambassador.password': 'Contraseña',
    'ambassador.loading': 'Cargando...',
    'ambassador.loginBtn': 'Iniciar Sesión',
    'ambassador.signupBtn': 'Registrarse',
    'ambassador.noAccount': '¿No tienes cuenta? Regístrate',
    'ambassador.hasAccount': '¿Ya tienes cuenta? Inicia sesión',
    'ambassador.backHome': 'Volver al Inicio',
    'ambassador.gotStore': '¡Conseguí un Store!',
    'ambassador.mySubmissions': 'Mis Tiendas Enviadas',
    'ambassador.leaderboard': 'Ranking de Embajadores',
    'ambassador.form.title': 'Enviar una Nueva Tienda',
    'ambassador.form.storeName': 'Nombre de la Tienda',
    'ambassador.form.storeUrl': 'Sitio Web o Perfil de Google Maps',
    'ambassador.form.city': 'Ciudad',
    'ambassador.form.warning': 'Pídele a la tienda que firmó el acuerdo que nos envíe un email con el contrato adjunto a hello@greenhunt.net. Lo comprobaremos y enviaremos comisiones a las cuentas bancarias de USD configuradas en tu perfil a final de mes.',
    'ambassador.form.submit': 'Enviar Tienda',
    'ambassador.form.cancel': 'Cancelar',
    'ambassador.form.success': '¡Tienda enviada exitosamente!',
    'ambassador.form.error': 'Error al enviar tienda',
    'ambassador.submissions.status': 'Estado',
    'ambassador.submissions.pending': 'Pendiente de Revisión',
    'ambassador.submissions.approved': 'Aprobada',
    'ambassador.submissions.rejected': 'Rechazada',
    'ambassador.submissions.commission': 'Comisión',
    'ambassador.submissions.submittedOn': 'Enviada el',
    'ambassador.submissions.empty': 'No hay envíos todavía',
    'ambassador.leaderboard.rank': 'Posición',
    'ambassador.leaderboard.ambassador': 'Embajador',
    'ambassador.leaderboard.stores': 'Tiendas',
    'ambassador.leaderboard.earned': 'Total Ganado',
    'ambassador.leaderboard.empty': 'No hay embajadores en el ranking todavía',
    'ambassador.accountCreated': '¡Cuenta de embajador creada exitosamente!',
    'ambassador.loginSuccess': '¡Sesión iniciada exitosamente!',
    'ambassador.logoutSuccess': 'Sesión cerrada exitosamente',
    'ambassador.loginError': 'Error al iniciar sesión',
    'ambassador.createError': 'Error al crear cuenta'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'es')) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
