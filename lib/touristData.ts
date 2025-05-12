interface Place {
  id: string;
  name: string;
  description: string;
  category: 'nature' | 'culture' | 'gastronomie';
  openingHours?: string;
  transport?: string;
  historicalInfo?: string;
  imageUrl?: string;
  rating?: number;
  price?: string;
}

interface Itinerary {
  id: string;
  name: string;
  description: string;
  duration: string;
  places: Place[];
  category: 'nature' | 'culture' | 'gastronomie';
  difficulty?: 'facile' | 'moyen' | 'difficile';
  price?: string;
}

export const places: Place[] = [
  {
    id: '1',
    name: 'Jardin Botanique',
    description: 'Un magnifique jardin avec plus de 1000 espèces de plantes.',
    category: 'nature',
    openingHours: '9h-18h tous les jours',
    transport: 'Bus 12, arrêt Jardin Botanique',
    historicalInfo: 'Créé en 1850, ce jardin est classé monument historique.',
    imageUrl: '/images/jardin-botanique.jpg',
    rating: 4.8,
    price: 'Gratuit'
  },
  {
    id: '2',
    name: 'Musée des Beaux-Arts',
    description: 'Collection d\'art classique et contemporain.',
    category: 'culture',
    openingHours: '10h-19h, fermé le lundi',
    transport: 'Métro ligne 1, station Musée',
    historicalInfo: 'Le musée a été inauguré en 1875.',
    imageUrl: '/images/musee-beaux-arts.jpg',
    rating: 4.6,
    price: '12€'
  },
  {
    id: '3',
    name: 'Marché Local',
    description: 'Marché traditionnel avec produits locaux.',
    category: 'gastronomie',
    openingHours: '7h-13h, fermé le lundi',
    transport: 'Bus 5, arrêt Marché Central',
    historicalInfo: 'Ce marché existe depuis plus de 200 ans.',
    imageUrl: '/images/marche-local.jpg',
    rating: 4.7,
    price: 'Gratuit'
  },
  {
    id: '4',
    name: 'Parc National',
    description: 'Vaste parc naturel avec sentiers de randonnée et points de vue panoramiques.',
    category: 'nature',
    openingHours: '8h-20h tous les jours',
    transport: 'Bus 15, arrêt Parc National',
    historicalInfo: 'Créé en 1960 pour préserver la biodiversité locale.',
    imageUrl: '/images/parc-national.jpg',
    rating: 4.9,
    price: '5€'
  },
  {
    id: '5',
    name: 'Théâtre Municipal',
    description: 'Théâtre historique proposant des pièces classiques et contemporaines.',
    category: 'culture',
    openingHours: 'Billetterie : 10h-19h',
    transport: 'Métro ligne 2, station Théâtre',
    historicalInfo: 'Construit en 1890, ce théâtre est un joyau architectural.',
    imageUrl: '/images/theatre-municipal.jpg',
    rating: 4.5,
    price: 'À partir de 25€'
  },
  {
    id: '6',
    name: 'Restaurant Gastronomique',
    description: 'Restaurant étoilé proposant une cuisine locale raffinée.',
    category: 'gastronomie',
    openingHours: '12h-14h et 19h-22h, fermé le dimanche',
    transport: 'Métro ligne 3, station Gastronomie',
    historicalInfo: 'Ouvert en 1985, ce restaurant est une référence gastronomique.',
    imageUrl: '/images/restaurant-gastronomique.jpg',
    rating: 4.9,
    price: 'Menu à partir de 85€'
  }
];

export const itineraries: Itinerary[] = [
  {
    id: '1',
    name: 'Découverte Nature',
    description: 'Une journée dans les plus beaux espaces verts de la ville.',
    duration: '1 jour',
    category: 'nature',
    places: [places[0], places[3]],
    difficulty: 'facile',
    price: '5€'
  },
  {
    id: '2',
    name: 'Tour Culturel',
    description: 'Visite des principaux sites culturels.',
    duration: '1 jour',
    category: 'culture',
    places: [places[1], places[4]],
    difficulty: 'facile',
    price: '37€'
  },
  {
    id: '3',
    name: 'Gastronomie Locale',
    description: 'Découverte des saveurs locales.',
    duration: '1 jour',
    category: 'gastronomie',
    places: [places[2], places[5]],
    difficulty: 'facile',
    price: '85€'
  },
  {
    id: '4',
    name: 'Week-end Nature et Culture',
    description: 'Combinaison parfaite entre nature et culture sur deux jours.',
    duration: '2 jours',
    category: 'nature',
    places: [places[0], places[1], places[3]],
    difficulty: 'moyen',
    price: '45€'
  }
];

export const quickQuestions = [
  "Où puis-je trouver des restaurants gastronomiques ?",
  "Quels sont les meilleurs sites culturels à visiter ?",
  "Je cherche un itinéraire nature pour la journée",
  "Quels sont les horaires du Musée des Beaux-Arts ?",
  "Comment aller au Parc National ?",
  "Je veux découvrir la gastronomie locale",
  "Quels sont les lieux historiques à ne pas manquer ?",
  "Je cherche des activités gratuites"
];

export function findPlacesByCategory(category: 'nature' | 'culture' | 'gastronomie'): Place[] {
  return places.filter(place => place.category === category);
}

export function findItineraryByCategory(category: 'nature' | 'culture' | 'gastronomie'): Itinerary[] {
  return itineraries.filter(itinerary => itinerary.category === category);
}

export function searchPlaces(query: string): Place[] {
  const lowerQuery = query.toLowerCase();
  return places.filter(place => 
    place.name.toLowerCase().includes(lowerQuery) ||
    place.description.toLowerCase().includes(lowerQuery)
  );
}

export function getPlaceInfo(placeName: string): Place | undefined {
  return places.find(place => 
    place.name.toLowerCase() === placeName.toLowerCase()
  );
}

export function getQuickQuestions(): string[] {
  return quickQuestions;
} 