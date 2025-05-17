interface ChatbotData {
  question: string[];
  answer: string;
}

export const bejaiaChatData: ChatbotData[] = [
  {
    question: [
      "bonjour", "salut", "salam", "hello", "hi", "bonsoir",
      "yo", "coucou", "ça va", "hey", "bjr"
    ],
    answer:
      "Bonjour et bienvenue ! Je suis votre guide virtuel pour Béjaïa. Posez-moi vos questions sur la ville, ses plages, ses sites touristiques, sa localisation, son histoire, sa culture, la gastronomie locale ou même la météo. Je suis là pour vous aider à découvrir cette belle région ! 😊",
  },
  {
    question: [
      "où se trouve bejaia", "où est bejaia", "localisation bejaia",
      "emplacement bejaia", "situe bejaia", "position bejaia",
      "bejaia se trouve où", "c’est où bejaia", "bejaia localisation"
    ],
    answer:
      "Béjaïa (بجاية) est une ville portuaire située au nord-est de l’Algérie, dans la région montagneuse et culturelle de la Kabylie. Elle se trouve à environ 250 km à l’est d’Alger, au bord de la mer Méditerranée, ce qui lui confère un climat doux et agréable. C’est aussi le chef-lieu de la wilaya de Béjaïa, connue pour son riche patrimoine naturel et historique.",
  },
  {
    question: [
      "attractions bejaia", "que visiter à bejaia", "sites touristiques bejaia",
      "lieux à voir à bejaia", "que faire à bejaia", "activités bejaia",
      "que voir à bejaia", "endroits à visiter à bejaia", "quoi faire à bejaia",
      "quelles sont les attractions", "tourisme bejaia", "visiter bejaia",
      "lieux à ne pas rater", "top sites bejaia"
    ],
    answer:
      "Voici les attractions incontournables de Béjaïa :\n\n🟢 **Sites naturels** :\n- Parc National de Gouraya avec ses forêts, ses singes magots et ses panoramas\n- Cap Carbon, célèbre pour son phare historique et ses falaises vertigineuses\n- Mont Yemma Gouraya, idéal pour les randonnées avec une vue spectaculaire\n\n🏖️ **Plages** :\n- Boulimat, une plage animée avec sable fin\n- Tighremt, tranquille et familiale\n- Les Aiguades, spot idéal pour la plongée\n- Saket, plage sauvage avec un cadre naturel préservé\n\n🏛️ **Sites historiques** :\n- La Casbah, forteresse ancienne au cœur de la ville\n- Fort Bordj Moussa, vestige militaire\n- La Porte Sarrasine, vestige des anciennes murailles\n\n🚠 **Autres activités** :\n- Le téléphérique de Béjaïa pour une balade panoramique\n- Découverte des marchés traditionnels pour l’artisanat local\n- Dégustation de la gastronomie kabyle dans les restaurants typiques\n\nBéjaïa combine nature, culture et histoire pour une expérience complète !",
  },
  {
    question: [
      "yemma gouraya", "mont gouraya", "montagne gouraya",
      "randonnée gouraya", "gouraya rando", "site yemma gouraya",
      "mausolée gouraya", "statue femme bejaia", "vue panoramique bejaia"
    ],
    answer:
      "**Yemma Gouraya** est un symbole emblématique de Béjaïa :\n\n- Montagne culminant à 660 mètres\n- Offre une vue spectaculaire sur la mer Méditerranée et la ville\n- Lieu sacré avec un mausolée dédié à une figure féminine locale\n- Parfait pour les randonnées (niveau intermédiaire), avec sentiers balisés\n- Partie intégrante du Parc National de Gouraya, qui abrite une biodiversité riche\n- Selon la légende, la silhouette de la montagne évoque une femme allongée, d’où son nom 🌄",
  },
  {
    question: [
      "plages bejaia", "meilleures plages", "plages à visiter bejaia",
      "où se baigner à bejaia", "plage bejaia", "baignade bejaia",
      "plage boulimat", "tighremt", "aiguades", "saket"
    ],
    answer:
      "Les plages les plus populaires à Béjaïa :\n\n🏖️ **Boulimat** : Plage urbaine avec sable fin, idéale pour profiter de la mer en famille ou entre amis. Animée en été avec des activités nautiques.\n🏖️ **Tighremt** : Plage paisible, parfaite pour les familles et ceux qui cherchent calme et tranquillité.\n🏖️ **Les Aiguades** : Plages historiques, parfaites pour les amateurs de plongée sous-marine et de snorkeling.\n🏖️ **Saket** : Plus sauvage, avec des paysages préservés, offrant un cadre naturel splendide pour se détendre.\n\nChaque plage a son charme unique, parfait pour profiter du soleil et de la Méditerranée !",
  },
  {
    question: [
      "météo bejaia", "climat bejaia", "quand visiter bejaia",
      "température bejaia", "quel temps fait-il à bejaia",
      "saison idéale", "meilleure période pour visiter"
    ],
    answer:
      "**Climat méditerranéen à Béjaïa** :\n\n☀️ **Été (juin à septembre)** : Chaud et sec, températures entre 25°C et 30°C, parfait pour les activités balnéaires.\n🌸 **Printemps (mars à mai)** : Doux et agréable, idéal pour les randonnées et visites culturelles (15-22°C).\n🍁 **Automne (octobre à novembre)** : Températures douces, climat agréable pour les excursions (18-25°C).\n🌧️ **Hiver (décembre à février)** : Temps doux avec des pluies occasionnelles (12-15°C).\n\n👉 La meilleure période pour visiter Béjaïa est de **mai à octobre**, pour profiter pleinement du beau temps et des activités en extérieur.",
  },
  {
    question: [
      "histoire bejaia", "origine bejaia", "ville historique bejaia",
      "ancien nom bejaia", "béjaïa histoire", "patrimoine bejaia",
      "histoire kabylie"
    ],
    answer:
      "Béjaïa a une histoire riche et fascinante :\n\n- Connue sous le nom de **Saldae** durant l’époque romaine\n- Capitale du royaume des Hammadides au 11e siècle, période de grand rayonnement culturel et commercial\n- Important centre d’études et de commerce méditerranéen\n- Point d’introduction des chiffres arabes en Europe grâce à Fibonacci, qui étudia ici\n- Un mélange unique de cultures berbère, arabe et méditerranéenne, visible dans l’architecture, la cuisine et les traditions locales\n\nUne ville où passé et présent cohabitent harmonieusement.",
  },
  {
    question: [
      "comment y aller", "aller à bejaia", "trajet vers bejaia",
      "comment se rendre à bejaia", "moyen de transport bejaia",
      "train vers bejaia", "bus pour bejaia", "route pour bejaia",
      "avion bejaia", "aéroport bejaia"
    ],
    answer:
      "Pour venir à Béjaïa :\n\n🚗 **En voiture** : Depuis Alger, comptez environ 3h30 via l’autoroute Est-Ouest et la RN12. La route est panoramique et agréable.\n🚌 **En bus** : Des lignes régulières relient Béjaïa aux principales villes algériennes.\n🚆 **En train** : Liaison ferroviaire avec Alger, économique mais un peu plus lente.\n✈️ **En avion** : Aéroport Abane Ramdane de Béjaïa, avec vols domestiques réguliers, pratique pour gagner du temps.\n\nN’hésitez pas à planifier votre trajet en fonction de votre budget et de votre emploi du temps.",
  },
  {
    question: [
      "gastronomie bejaia", "plat typique bejaia", "cuisine kabyle",
      "spécialités culinaires bejaia", "quoi manger bejaia", "restaurants bejaia",
      "recette kabyle"
    ],
    answer:
      "La gastronomie de Béjaïa est riche et savoureuse, typique de la Kabylie :\n\n🍲 **Spécialités** :\n- Couscous kabyle, préparé avec semoule, légumes et viande\n- Tajines variés, notamment au poulet, agneau ou poisson\n- Chakhchoukha, un plat à base de galettes émiettées et sauce\n- Poissons frais de la Méditerranée\n\n🍯 **Douceurs** :\n- Makroud, pâtisserie aux dattes\n- Gâteaux aux amandes\n\n🍽️ Vous trouverez de nombreux restaurants et gargotes dans la ville et près des plages, proposant une cuisine authentique et conviviale.\n\nN’hésitez pas à goûter les produits locaux comme le miel de Kabylie, réputé pour sa qualité !",
  },
  {
    question: [
      "événements bejaia", "festivals bejaia", "fêtes bejaia",
      "manifestations culturelles bejaia", "agenda bejaia"
    ],
    answer:
      "Béjaïa accueille plusieurs événements culturels et festifs tout au long de l’année :\n\n🎉 **Festival des Arts et de la Culture Kabyle** : musique, danse, artisanat\n🎭 **Festival International du Théâtre de Béjaïa**\n🎶 **Concerts de musique traditionnelle et moderne**\n\nCes événements sont parfaits pour découvrir la richesse culturelle locale et partager des moments conviviaux.\n\nConsultez l’agenda local pour les dates précises lors de votre visite.",
  },
  {
    question: [
      "hébergement bejaia", "où dormir bejaia", "hôtels bejaia",
      "auberges bejaia", "logement bejaia", "location bejaia"
    ],
    answer:
      "À Béjaïa, vous trouverez différentes options d’hébergement :\n\n🏨 **Hôtels et résidences** : du confortable au luxe, situés en centre-ville ou près de la mer\n🏠 **Auberges et maisons d’hôtes** : pour une expérience plus authentique et conviviale\n🏡 **Locations Airbnb** : appartements ou maisons pour tous les budgets\n\nIl est conseillé de réserver à l’avance surtout pendant la haute saison estivale pour garantir votre séjour.",
  },
  {
    question: [
      "shopping bejaia", "marchés bejaia", "artisanat bejaia",
      "souks bejaia", "boutiques bejaia"
    ],
    answer:
      "Pour le shopping à Béjaïa :\n\n🛍️ **Marchés traditionnels (souks)** : où vous pouvez trouver artisanat kabyle, bijoux, poteries, textiles et produits locaux\n🎨 **Boutiques d’artisanat** : vendant des objets faits main, parfaits comme souvenirs\n🍯 **Produits locaux** : miel, olives, fromages\n\nLes marchés sont aussi un excellent endroit pour découvrir la vie locale et rencontrer les habitants.",
  },
  {
    question: [
      "sécurité bejaia", "est-ce sûr bejaia", "conseils sécurité bejaia",
      "voyager à bejaia"
    ],
    answer:
      "Béjaïa est généralement une ville sûre pour les touristes. Comme partout, il est conseillé de :\n\n- Garder vos objets de valeur en sécurité\n- Éviter de circuler seul la nuit dans les zones isolées\n- Respecter les coutumes locales et les règles de savoir-vivre\n\nLes habitants sont accueillants et prêts à aider les visiteurs. Profitez sereinement de votre séjour !",
  }
];
