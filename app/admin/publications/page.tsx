"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Search,
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  MessageSquare,
  Heart,
  Pencil,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MultiImageUpload } from "@/components/ui/image-upload"

interface Wilaya {
  _id: string
  name: string
}

interface Attraction {
  _id: string
  name: string
  description: string
  images: string[]
  wilayaId: string
}

export default function PublicationsPage() {
  const [attractions, setAttractions] = useState<Attraction[]>([])
  const [wilayas, setWilayas] = useState<Wilaya[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newAttraction, setNewAttraction] = useState({
    name: "",
    description: "",
    images: [] as string[],
    wilayaId: "",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAttractions()
    fetchWilayas()
  }, [])

  const fetchAttractions = async () => {
    const res = await fetch("/api/attractions")
    const data = await res.json()
    setAttractions(data)
  }
  const fetchWilayas = async () => {
    const res = await fetch("/api/wilayas")
    const data = await res.json()
    setWilayas(data)
  }

  const handleEdit = (attraction: Attraction) => {
    setEditingId(attraction._id)
    setNewAttraction({
      name: attraction.name,
      description: attraction.description,
      images: attraction.images,
      wilayaId: attraction.wilayaId,
    })
    setShowForm(true)
  }

  const handleAddAttraction = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAttraction.name || !newAttraction.description || newAttraction.images.length === 0 || !newAttraction.wilayaId) return alert("Tous les champs sont requis")
    setLoading(true)
    const url = editingId ? `/api/attractions/${editingId}` : "/api/attractions"
    const method = editingId ? "PUT" : "POST"
    
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAttraction),
    })
    setLoading(false)
    if (res.ok) {
      setNewAttraction({ name: "", description: "", images: [], wilayaId: "" })
      setEditingId(null)
      setShowForm(false)
      fetchAttractions()
    } else {
      alert("Erreur lors de l'opération")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette attraction ?")) return
    await fetch(`/api/attractions/${id}`, { method: "DELETE" })
    fetchAttractions()
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#588157] mb-2">Gestion des attractions</h1>
        <Button 
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
            setNewAttraction({
              name: "",
              description: "",
              images: [],
              wilayaId: "",
            })
          }}
          className="bg-[#588157] hover:bg-[#3A5A40] text-white"
        >
          Ajouter une attraction
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleAddAttraction} className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#344E41]">
                  {editingId ? "Modifier l'attraction" : "Ajouter une attraction"}
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
                  placeholder="Nom de l'attraction"
                  value={newAttraction.name}
                  onChange={e => setNewAttraction({ ...newAttraction, name: e.target.value })}
                />
                <select
                  className="w-full border rounded p-2"
                  value={newAttraction.wilayaId}
                  onChange={e => setNewAttraction({ ...newAttraction, wilayaId: e.target.value })}
                  required
                >
                  <option value="">Sélectionner une wilaya</option>
                  {wilayas.map(w => (
                    <option key={w._id} value={w._id}>{w.name}</option>
                  ))}
                </select>
                <Textarea
                  placeholder="Description"
                  value={newAttraction.description}
                  onChange={e => setNewAttraction({ ...newAttraction, description: e.target.value })}
                  className="col-span-2"
                />
                <MultiImageUpload
                  value={newAttraction.images}
                  onChange={urls => setNewAttraction({ ...newAttraction, images: urls })}
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
                <Button type="submit" disabled={loading} className="bg-[#588157] hover:bg-[#3A5A40] text-white">
                  {loading ? "Chargement..." : editingId ? "Mettre à jour" : "Ajouter"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {attractions.map(attr => (
          <div key={attr._id} className="bg-[#F6F7F2] border rounded-xl p-4 flex flex-col shadow hover:shadow-lg transition h-[300px]">
            <div className="flex gap-2 mb-2 flex-wrap">
              {(attr.images || []).map((img: string, idx: number) => (
                <div key={idx} className="relative w-16 h-16 rounded overflow-hidden border">
                  <Image src={img} alt={`Image ${idx + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
            <div className="font-bold text-lg mb-1 text-[#344E41]">{attr.name}</div>
            <div className="text-gray-600 mb-2 flex-1 line-clamp-2">{attr.description}</div>
            <div className="text-sm text-gray-500 mb-2">Wilaya : {wilayas.find(w => w._id === attr.wilayaId)?.name || "-"}</div>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="icon" onClick={() => handleEdit(attr)} title="Modifier">
                <Pencil className="h-4 w-4 text-[#588157]" />
              </Button>
              <Button variant="destructive" size="icon" onClick={() => handleDelete(attr._id)} title="Supprimer">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
