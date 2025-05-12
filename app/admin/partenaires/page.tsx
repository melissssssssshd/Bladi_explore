"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/ui/image-upload"
import { Plus, Eye, Pencil, Trash2, CheckCircle, XCircle, Filter } from "lucide-react"

interface Wilaya {
  _id: string
  name: string
}

interface Partner {
  _id: string
  name: string
  type: string
  status: string
  city: string
  wilayaId: string
  email: string
  phone: string
  website: string
  address: string
  description: string
  image: string
  services: string[]
  priceRange: string
  rating: number | null
  reviews: number | null
  createdAt: string
  updatedAt: string
}

const PARTNER_TYPES = [
  "Hébergement",
  "Agence de voyage",
  "Restauration",
  "Guide touristique",
]
const STATUS = ["Actif", "Inactif"]
const PRICE_RANGE = ["Modéré", "Élevé", "Abordable", "Luxueux"]

export default function AdminPartners() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [wilayas, setWilayas] = useState<Wilaya[]>([])
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState("")
  const [newPartner, setNewPartner] = useState({
    name: "",
    type: "",
    status: "Actif",
    city: "",
    wilayaId: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    description: "",
    image: "",
    services: [] as string[],
    priceRange: "",
    rating: null as number | null,
    reviews: null as number | null,
  })
  const [serviceInput, setServiceInput] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPartners()
    fetchWilayas()
  }, [])

  const fetchPartners = async () => {
    const res = await fetch("/api/partners")
    const data = await res.json()
    setPartners(data)
  }
  const fetchWilayas = async () => {
    const res = await fetch("/api/wilayas")
    const data = await res.json()
    setWilayas(data)
  }

  const handleAddPartner = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPartner.name || !newPartner.type || !newPartner.wilayaId) return alert("Nom, type et wilaya sont requis")
    setLoading(true)
    const res = await fetch("/api/partners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPartner),
    })
    setLoading(false)
    if (res.ok) {
      setShowForm(false)
      setNewPartner({
        name: "",
        type: "",
        status: "Actif",
        city: "",
        wilayaId: "",
        email: "",
        phone: "",
        website: "",
        address: "",
        description: "",
        image: "",
        services: [],
        priceRange: "",
        rating: null,
        reviews: null,
      })
      fetchPartners()
    } else {
      alert("Erreur lors de l'ajout")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce partenaire ?")) return
    await fetch(`/api/partners/${id}`, { method: "DELETE" })
    fetchPartners()
  }

  const filteredPartners = partners.filter(p =>
    (p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())) &&
    (!filterType || p.type === filterType)
  )

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#588157]">Gestion des partenaires</h1>
          <p className="text-gray-600">Gérez les partenaires de la plateforme Bladi</p>
        </div>
        <Button className="bg-[#588157] hover:bg-[#3A5A40] text-white px-6 py-2 rounded-lg" onClick={() => setShowForm(true)}>
          <Plus className="h-5 w-5 mr-2" /> Ajouter un partenaire
        </Button>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <Input
          placeholder="Rechercher un partenaire..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <select
          className="border rounded p-2"
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
        >
          <option value="">Tous les types</option>
          {PARTNER_TYPES.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <Button variant="outline" className="flex gap-2 items-center">
          <Filter className="h-4 w-4" /> Filtres
        </Button>
      </div>
      {/* Cards partenaires */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPartners.map(partner => (
          <div key={partner._id} className="bg-white rounded-xl shadow p-6 flex flex-col gap-2 relative border">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-full bg-[#DAD7CD] flex items-center justify-center text-2xl font-bold text-[#344E41]">
                {partner.name[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-[#344E41]">{partner.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ml-2 ${partner.status === "Actif" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>{partner.status}</span>
                </div>
                <div className="text-sm text-gray-500">{partner.type}</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <span>{partner.city}</span>
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <span>{partner.email}</span>
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <span>{partner.phone}</span>
            </div>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="icon" className="hover:bg-[#E9ECE5]" title="Voir (à venir)"><Eye className="h-4 w-4 text-[#588157]" /></Button>
              <Button variant="outline" size="icon" className="hover:bg-[#E9ECE5]" title="Modifier (à venir)"><Pencil className="h-4 w-4 text-[#588157]" /></Button>
              <Button variant="destructive" size="icon" onClick={() => handleDelete(partner._id)} title="Supprimer"><Trash2 className="h-4 w-4" /></Button>
            </div>
            <div className="text-xs text-gray-400 mt-2">Depuis le {new Date(partner.createdAt).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
      {/* Modal ajout partenaire */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl relative max-h-[80vh] overflow-y-auto p-8">
            <button className="absolute top-4 right-4" onClick={() => setShowForm(false)}><XCircle className="h-6 w-6 text-gray-400 hover:text-gray-600" /></button>
            <h2 className="text-xl font-bold mb-6 text-[#344E41]">Ajouter un partenaire</h2>
            <form onSubmit={handleAddPartner} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  placeholder="Nom du partenaire"
                  value={newPartner.name}
                  onChange={e => setNewPartner({ ...newPartner, name: e.target.value })}
                  required
                />
                <select
                  className="w-full border rounded p-2"
                  value={newPartner.type}
                  onChange={e => setNewPartner({ ...newPartner, type: e.target.value })}
                  required
                >
                  <option value="">Type</option>
                  {PARTNER_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <select
                  className="w-full border rounded p-2"
                  value={newPartner.status}
                  onChange={e => setNewPartner({ ...newPartner, status: e.target.value })}
                >
                  {STATUS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <select
                  className="w-full border rounded p-2"
                  value={newPartner.wilayaId}
                  onChange={e => setNewPartner({ ...newPartner, wilayaId: e.target.value })}
                  required
                >
                  <option value="">Wilaya</option>
                  {wilayas.map(w => (
                    <option key={w._id} value={w._id}>{w.name}</option>
                  ))}
                </select>
                <Input
                  placeholder="Ville"
                  value={newPartner.city}
                  onChange={e => setNewPartner({ ...newPartner, city: e.target.value })}
                />
                <Input
                  placeholder="Adresse"
                  value={newPartner.address}
                  onChange={e => setNewPartner({ ...newPartner, address: e.target.value })}
                />
                <Input
                  placeholder="Email"
                  value={newPartner.email}
                  onChange={e => setNewPartner({ ...newPartner, email: e.target.value })}
                />
                <Input
                  placeholder="Téléphone"
                  value={newPartner.phone}
                  onChange={e => setNewPartner({ ...newPartner, phone: e.target.value })}
                />
                <Input
                  placeholder="Site web"
                  value={newPartner.website}
                  onChange={e => setNewPartner({ ...newPartner, website: e.target.value })}
                />
                <ImageUpload
                  value={newPartner.image}
                  onChange={url => setNewPartner({ ...newPartner, image: url })}
                />
                <Textarea
                  placeholder="Description"
                  value={newPartner.description}
                  onChange={e => setNewPartner({ ...newPartner, description: e.target.value })}
                  className="col-span-2"
                />
                <Input
                  placeholder="Gamme de prix (ex: Modéré, Élevé)"
                  value={newPartner.priceRange}
                  onChange={e => setNewPartner({ ...newPartner, priceRange: e.target.value })}
                />
                <Input
                  placeholder="Note (ex: 4.5)"
                  type="number"
                  step="0.1"
                  value={newPartner.rating ?? ""}
                  onChange={e => setNewPartner({ ...newPartner, rating: e.target.value ? parseFloat(e.target.value) : null })}
                />
                <Input
                  placeholder="Nombre d'avis"
                  type="number"
                  value={newPartner.reviews ?? ""}
                  onChange={e => setNewPartner({ ...newPartner, reviews: e.target.value ? parseInt(e.target.value) : null })}
                />
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Services proposés</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Ajouter un service"
                      value={serviceInput}
                      onChange={e => setServiceInput(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="button" onClick={() => {
                      if (serviceInput.trim()) {
                        setNewPartner({ ...newPartner, services: [...newPartner.services, serviceInput.trim()] })
                        setServiceInput("")
                      }
                    }}>Ajouter</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newPartner.services.map((s, idx) => (
                      <span key={idx} className="bg-[#E9ECE5] px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        {s}
                        <button type="button" onClick={() => setNewPartner({ ...newPartner, services: newPartner.services.filter((_, i) => i !== idx) })}>
                          <XCircle className="h-4 w-4 text-gray-400 hover:text-red-500" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button type="submit" className="bg-[#588157] hover:bg-[#3A5A40] text-white px-8 py-2 rounded-lg shadow">Ajouter</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
