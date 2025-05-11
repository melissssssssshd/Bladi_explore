"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { MapPin, Upload } from "lucide-react"

export default function CreerPage() {
  return (
    <div className="min-h-screen bg-[#DAD7CD]/20 flex">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <Header title="Créer une publication" />

        <div className="bg-white rounded-xl shadow-md p-8 max-w-3xl mx-auto">
          <form>
            <div className="mb-6">
              <label htmlFor="titre" className="block text-sm font-medium text-gray-700 mb-1">
                Titre
              </label>
              <input
                id="titre"
                type="text"
                placeholder="Donnez un titre"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#588157] focus:border-transparent"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                rows={5}
                placeholder="Ajouter une description détaillée"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#588157] focus:border-transparent"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="lieu" className="block text-sm font-medium text-gray-700 mb-1">
                  Lieu
                </label>
                <div className="relative">
                  <input
                    id="lieu"
                    type="text"
                    placeholder="Donnez un lieu"
                    className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#588157] focus:border-transparent"
                  />
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
              </div>

              <div>
                <label htmlFor="categorie" className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  id="categorie"
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#588157] focus:border-transparent"
                >
                  <option value="">Sélectionnez une catégorie</option>
                  <option value="plages">Plages</option>
                  <option value="montagnes">Montagnes</option>
                  <option value="desert">Désert</option>
                  <option value="villes">Villes</option>
                  <option value="culture">Culture</option>
                  <option value="gastronomie">Gastronomie</option>
                </select>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
                <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-2">Glissez et déposez des images ici</p>
                <p className="text-gray-500 text-sm mb-4">ou</p>
                <button
                  type="button"
                  className="px-4 py-2 bg-[#588157] text-white rounded-md hover:bg-[#3A5A40] transition-colors"
                >
                  Parcourir les fichiers
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 mr-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#588157] text-white rounded-md hover:bg-[#3A5A40] transition-colors"
              >
                Publier
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
