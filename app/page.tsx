"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Search, ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";

const destinations = [
  {
    id: 1,
    image: "/images/tassili.jpeg",
    title: "TASSILI N'AJJER",
    subtitle: "Sahara",
    description:
      "Explorez les formations rocheuses uniques et les peintures rupestres préhistoriques dans ce trésor naturel du Sahara algérien.",
  },
  {
    id: 2,
    image: "/images/plage-sidi-merouane.jpeg",
    title: "SIDI MEROUANE",
    subtitle: "Cap Ténès, Chlef",
    description:
      "Découvrez cette plage paradisiaque aux eaux cristallines turquoise entourée de falaises majestueuses.",
  },
  {
    id: 3,
    image: "/images/casbah.jpeg",
    title: "LA CASBAH",
    subtitle: "Alger",
    description:
      "Perdez-vous dans les ruelles étroites de ce quartier historique classé au patrimoine mondial de l'UNESCO.",
  },
  {
    id: 4,
    image: "/images/skikda.jpeg",
    title: "SKIKDA",
    subtitle: "Côte Méditerranéenne",
    description:
      "Admirez les plages de sable fin et les criques secrètes de cette perle de la côte algérienne.",
  },
  {
    id: 5,
    image: "/images/jardin-essai.jpeg",
    title: "JARDIN D'ESSAI",
    subtitle: "Alger",
    description:
      "Promenez-vous dans ce jardin botanique luxuriant avec vue sur le monument emblématique Maqam Echahid.",
  },
];

const categories = [
  "Plages d'Algérie",
  "Randonnées dans l'Atlas",
  "Cuisine traditionnelle",
  "Festivals locaux",
  "Hébergements authentiques",
];

export default function Home() {
  const [activeDestination, setActiveDestination] = useState(0);

  const nextDestination = () => {
    setActiveDestination((prev) => (prev + 1) % destinations.length);
  };

  const prevDestination = () => {
    setActiveDestination(
      (prev) => (prev - 1 + destinations.length) % destinations.length
    );
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 lg:px-20 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-2">
          <Globe className="h-6 w-6 text-[#3A5A40]" />
          <span className="text-xl font-bold tracking-widest text-[#3A5A40]">
            Bladi
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="text-[#344E41] hover:text-[#588157] transition-colors"
          >
            Accueil
          </Link>
          <Link
            href="/explorers"
            className="text-[#344E41] hover:text-[#588157] transition-colors"
          >
            Explorer
          </Link>
          <Link
            href="/about"
            className="text-[#344E41] hover:text-[#588157] transition-colors"
          >
            À propos
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden md:block px-4 py-2 text-[#344E41] hover:text-[#588157] transition-colors"
          >
            Se connecter
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-[#588157] text-white rounded-md hover:bg-[#3A5A40] transition-colors"
          >
            S'inscrire
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#344E41] mb-6">
                Découvrez les destinations paradisiaques
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Explorez, planifiez et vivez des expériences uniques dans nos
                régions. Des paysages à couper le souffle vous attendent.
              </p>
              <Link
                href="/explorers"
                className="inline-flex items-center px-6 py-3 bg-[#588157] text-white rounded-md hover:bg-[#3A5A40] transition-colors"
              >
                Explorer
              </Link>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative h-64 rounded-2xl overflow-hidden shadow-lg"
              >
                <Image
                  src="/images/tassili.jpeg"
                  alt="Tassili n'Ajjer"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h3 className="text-xl font-bold">Tassili n'Ajjer</h3>
                  <p className="text-sm">
                    Des formations rocheuses distinctives
                  </p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative h-64 rounded-2xl overflow-hidden shadow-lg mt-8"
              >
                <Image
                  src="/images/plage-sidi-merouane.jpeg"
                  alt="Lac Alpin"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h3 className="text-xl font-bold">Lac Alpin</h3>
                  <p className="text-sm">Eaux cristallines et montagnes</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="relative h-64 rounded-2xl overflow-hidden shadow-lg"
              >
                <Image
                  src="/images/skikda.jpeg"
                  alt="Paradis Tropical"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h3 className="text-xl font-bold">Paradis Tropical</h3>
                  <p className="text-sm">Plages de sable fin</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="relative h-64 rounded-2xl overflow-hidden shadow-lg mt-8"
              >
                <Image
                  src="/images/casbah.jpeg"
                  alt="La Casbah"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h3 className="text-xl font-bold">La Casbah</h3>
                  <p className="text-sm">Architecture traditionnelle</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 px-6 lg:px-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#344E41] mb-4">
              Recherchez une idée
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl">
              Que souhaitez-vous explorer ensuite ? Pensez à un lieu qui vous
              fait rêver, par exemple « plages d'Algérie », et découvrez nos
              suggestions personnalisées.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 flex items-center gap-2">
              <Search className="w-5 h-5 text-[#588157]" />
              <input
                type="text"
                placeholder="Rechercher une destination, une activité..."
                className="flex-1 outline-none text-gray-700"
              />
            </div>
            <button className="bg-[#588157] text-white px-6 py-3 rounded-md hover:bg-[#3A5A40] transition-colors">
              Explorateur
            </button>
          </div>

          <div>
            <h3 className="text-lg font-medium text-[#344E41] mb-4">
              Recherches populaires :
            </h3>
            <div className="flex flex-wrap gap-3">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className="px-4 py-2 bg-white rounded-full border border-gray-200 text-gray-700 hover:bg-[#588157] hover:text-white hover:border-[#588157] transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 px-6 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#344E41] mb-4">
                Destinations Populaires
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl">
                Découvrez les lieux les plus appréciés par nos voyageurs à
                travers l'Algérie.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={prevDestination}
                className="p-2 bg-[#588157] rounded-full hover:bg-[#3A5A40] transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={nextDestination}
                className="p-2 bg-[#588157] rounded-full hover:bg-[#3A5A40] transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <AnimatePresence mode="wait">
              {[0, 1, 2].map((offset) => {
                const index =
                  (activeDestination + offset) % destinations.length;
                return (
                  <motion.div
                    key={destinations[index].id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: 0.1 * offset }}
                    className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={destinations[index].image || "/placeholder.svg"}
                        alt={destinations[index].title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-[#344E41]">
                            {destinations[index].title}
                          </h3>
                          <p className="text-[#588157]">
                            {destinations[index].subtitle}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">
                        {destinations[index].description}
                      </p>
                      <Link
                        href={`/destination/${destinations[index].id}`}
                        className="inline-flex items-center text-[#588157] font-medium hover:text-[#3A5A40] transition-colors"
                      >
                        Explorer
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-6 lg:px-20 bg-[#3A5A40] text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Restez Informé
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            Inscrivez-vous à notre newsletter pour recevoir les dernières
            nouvelles et offres spéciales.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-3 rounded-md text-gray-800 outline-none"
            />
            <button className="px-6 py-3 bg-[#A3B18A] text-[#344E41] font-medium rounded-md hover:bg-[#DAD7CD] transition-colors">
              S'abonner
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#344E41] text-white py-12 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-6 w-6" />
              <span className="text-xl font-bold tracking-widest">Bladi</span>
            </div>
            <p className="text-white/70">
              Votre guide ultime pour découvrir toutes les merveilles de
              l'Algérie.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Explorer
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Catégories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/plages"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Plages
                </Link>
              </li>
              <li>
                <Link
                  href="/montagnes"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Montagnes
                </Link>
              </li>
              <li>
                <Link
                  href="/villes"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Villes
                </Link>
              </li>
              <li>
                <Link
                  href="/desert"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Désert
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-white/70">
              <li>Email: contact@bladi.com</li>
              <li>Téléphone: +213 123 456 789</li>
              <li>Adresse: Alger, Algérie</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/20 text-center text-white/50">
          <p>© {new Date().getFullYear()} Bladi. Tous droits réservés.</p>
        </div>
      </footer>
    </main>
  );
}
