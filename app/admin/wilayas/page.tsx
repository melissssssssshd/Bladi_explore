"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/ui/image-upload"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Pencil, Trash2, X } from "lucide-react"

interface Wilaya {
  _id: string
  name: string
  description: string
  imageUrl: string
  overview?: {
    image: string
    description: string
    weather: string
    bestPeriod: string
    localCuisine: string
    culturalEvents: string
    travelTips: string
  }
  attractions?: {
    name: string
    description: string
    image: string
  }[]
  createdAt: string
  updatedAt: string
}

export default function AdminWilayas() {
  const [wilayas, setWilayas] = useState<Wilaya[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [newWilaya, setNewWilaya] = useState({
    name: "",
    description: "",
    imageUrl: "",
    overview: {
      image: "",
      description: "",
      weather: "",
      bestPeriod: "",
      localCuisine: "",
      culturalEvents: "",
      travelTips: "",
    },
    attractions: [] as { name: string; description: string; image: string }[],
  })
  const { toast } = useToast()
  const [newAttraction, setNewAttraction] = useState({ name: "", description: "", image: "" })

  useEffect(() => {
    fetchWilayas()
  }, [])

  const fetchWilayas = async () => {
    try {
      const response = await fetch("/api/wilayas")
      const data = await response.json()
      setWilayas(data)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les wilayas",
        variant: "error",
      })
    }
  }

  const handleEdit = (wilaya: Wilaya) => {
    setEditingId(wilaya._id)
    setNewWilaya({
      name: wilaya.name,
      description: wilaya.description,
      imageUrl: wilaya.imageUrl,
      overview: {
        image: wilaya.overview?.image || "",
        description: wilaya.overview?.description || "",
        weather: wilaya.overview?.weather || "",
        bestPeriod: wilaya.overview?.bestPeriod || "",
        localCuisine: wilaya.overview?.localCuisine || "",
        culturalEvents: wilaya.overview?.culturalEvents || "",
        travelTips: wilaya.overview?.travelTips || "",
      },
      attractions: wilaya.attractions || [],
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newWilaya.name || !newWilaya.description || !newWilaya.imageUrl) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "error",
      })
      return
    }

    try {
      const url = editingId ? `/api/wilayas/${editingId}` : "/api/wilayas"
      const method = editingId ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newWilaya),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erreur lors de l'opération")
      }

      toast({
        title: "Succès",
        description: editingId ? "Wilaya mise à jour avec succès" : "Wilaya ajoutée avec succès",
      })

      setNewWilaya({
        name: "",
        description: "",
        imageUrl: "",
        overview: {
          image: "",
          description: "",
          weather: "",
          bestPeriod: "",
          localCuisine: "",
          culturalEvents: "",
          travelTips: "",
        },
        attractions: [],
      })
      setNewAttraction({ name: "", description: "", image: "" })
      setEditingId(null)
      setShowForm(false)
      fetchWilayas()
    } catch (error) {
      toast({
        title: "Erreur",
        description: editingId ? "Impossible de mettre à jour la wilaya" : "Impossible d'ajouter la wilaya",
        variant: "error",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette wilaya ?")) return

    try {
      const response = await fetch(`/api/wilayas/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Erreur lors de la suppression")

      toast({
        title: "Succès",
        description: "Wilaya supprimée avec succès",
      })

      fetchWilayas()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la wilaya",
        variant: "error",
      })
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#588157] mb-2">Gestion des wilayas</h1>
        <Button 
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
            setNewWilaya({
              name: "",
              description: "",
              imageUrl: "",
              overview: {
                image: "",
                description: "",
                weather: "",
                bestPeriod: "",
                localCuisine: "",
                culturalEvents: "",
                travelTips: "",
              },
              attractions: [],
            })
          }}
          className="bg-[#588157] hover:bg-[#3A5A40] text-white"
        >
          Ajouter une wilaya
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#344E41]">
                  {editingId ? "Modifier la wilaya" : "Ajouter une wilaya"}
                </h2>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  placeholder="Nom de la wilaya"
                  value={newWilaya.name}
                  onChange={e => setNewWilaya({ ...newWilaya, name: e.target.value })}
                />
                <Textarea
                  placeholder="Description"
                  value={newWilaya.description}
                  onChange={e => setNewWilaya({ ...newWilaya, description: e.target.value })}
                  className="col-span-2"
                />
                <ImageUpload
                  value={newWilaya.imageUrl}
                  onChange={url => setNewWilaya({ ...newWilaya, imageUrl: url })}
                />
              </div>
              <h3 className="font-semibold mt-6 mb-2">Aperçu</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageUpload
                  value={newWilaya.overview.image}
                  onChange={url => setNewWilaya({ ...newWilaya, overview: { ...newWilaya.overview, image: url } })}
                />
                <Textarea
                  placeholder="Description de l'aperçu"
                  value={newWilaya.overview.description}
                  onChange={e => setNewWilaya({ ...newWilaya, overview: { ...newWilaya.overview, description: e.target.value } })}
                />
                <Input
                  placeholder="Météo (ex: Ensoleillé 30°C)"
                  value={newWilaya.overview.weather}
                  onChange={e => setNewWilaya({ ...newWilaya, overview: { ...newWilaya.overview, weather: e.target.value } })}
                />
                <Input
                  placeholder="Meilleure période (ex: Octobre à Mars)"
                  value={newWilaya.overview.bestPeriod}
                  onChange={e => setNewWilaya({ ...newWilaya, overview: { ...newWilaya.overview, bestPeriod: e.target.value } })}
                />
                <Input
                  placeholder="Cuisine locale (ex: Méchoui, Tagella, Thé à la menthe)"
                  value={newWilaya.overview.localCuisine}
                  onChange={e => setNewWilaya({ ...newWilaya, overview: { ...newWilaya.overview, localCuisine: e.target.value } })}
                />
                <Input
                  placeholder="Événements culturels (ex: Festival de l'Imzad, Sebiba de Djanet)"
                  value={newWilaya.overview.culturalEvents}
                  onChange={e => setNewWilaya({ ...newWilaya, overview: { ...newWilaya.overview, culturalEvents: e.target.value } })}
                />
                <Textarea
                  placeholder="Conseils de voyage"
                  value={newWilaya.overview.travelTips}
                  onChange={e => setNewWilaya({ ...newWilaya, overview: { ...newWilaya.overview, travelTips: e.target.value } })}
                  className="col-span-2"
                />
              </div>
              <div className="flex justify-end gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                  }}
                >
                  Annuler
                </Button>
                <Button type="submit" className="bg-[#588157] hover:bg-[#3A5A40] text-white">
                  {editingId ? "Mettre à jour" : "Ajouter"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 mb-4">
        <Input
          placeholder="Rechercher une wilaya..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {wilayas.filter(w => w.name.toLowerCase().includes(search.toLowerCase())).map(wilaya => (
          <Card key={wilaya._id} className="overflow-hidden h-[300px]">
            <div className="relative h-40">
              <Image
                src={wilaya.imageUrl}
                alt={wilaya.name}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">{wilaya.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-gray-600 text-sm line-clamp-2 mb-4">{wilaya.description}</p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(wilaya)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(wilaya._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
