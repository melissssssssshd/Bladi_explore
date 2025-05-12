"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Eye, Plus, Filter } from "lucide-react"

interface User {
  _id: string
  name?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  role?: "Utilisateur" | "Modérateur" | "Admin"
  status?: "Actif" | "Inactif"
  password?: string
  createdAt?: string
  updatedAt?: string
}

const ROLES = ["Utilisateur", "Modérateur", "Admin"]
const STATUS = ["Actif", "Inactif"]

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Utilisateur" as User["role"],
    status: "Actif" as User["status"],
    password: "",
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const res = await fetch("/api/users")
    const data = await res.json()
    setUsers(data)
  }

  const handleEdit = (user: User) => {
    setEditingId(user._id)
    setNewUser({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "Utilisateur",
      status: user.status || "Actif",
      password: "",
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet utilisateur ?")) return
    await fetch(`/api/users/${id}`, { method: "DELETE" })
    fetchUsers()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUser.name || !newUser.email || !newUser.phone || !newUser.role || !newUser.status || (!editingId && !newUser.password)) {
      alert("Tous les champs sont requis")
      return
    }
    const url = editingId ? `/api/users/${editingId}` : "/api/users"
    const method = editingId ? "PUT" : "POST"
    const body = { ...newUser } as typeof newUser & { password?: string }
    if (editingId && !('password' in body) || !body.password) { delete (body as any).password }
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      setShowForm(false)
      setEditingId(null)
      setNewUser({ name: "", email: "", phone: "", role: "Utilisateur", status: "Actif", password: "" })
      fetchUsers()
    } else {
      alert("Erreur lors de l'opération")
    }
  }

  const filteredUsers = users.filter(u =>
    ((u.name || "") + " " + (u.firstName || "") + " " + (u.lastName || "")).toLowerCase().includes(search.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="max-w-7xl mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#52734D]">Gestion des utilisateurs</h1>
          <p className="text-gray-500">Gérez les utilisateurs de la plateforme Bladi</p>
        </div>
        <Button className="bg-[#52734D] hover:bg-[#3A5A40] text-white px-6" onClick={() => { setShowForm(true); setEditingId(null); setNewUser({ name: "", email: "", phone: "", role: "Utilisateur", status: "Actif", password: "" }) }}>
          <Plus className="mr-2 h-5 w-5" /> Ajouter un utilisateur
        </Button>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <Input
          placeholder="Rechercher un utilisateur..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-md"
        />
        <Button variant="outline" className="ml-2"><Filter className="h-4 w-4 mr-1" />Filtres</Button>
        <Button variant="outline">Exporter</Button>
      </div>
      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-[#F6F7F2] text-gray-700">
              <th className="py-3 px-2 text-left font-semibold">Nom</th>
              <th className="py-3 px-2 text-left font-semibold">Email</th>
              <th className="py-3 px-2 text-left font-semibold">Téléphone</th>
              <th className="py-3 px-2 text-left font-semibold">Rôle</th>
              <th className="py-3 px-2 text-left font-semibold">Statut</th>
              <th className="py-3 px-2 text-left font-semibold">Date d'inscription</th>
              <th className="py-3 px-2 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map(user => {
              const {
                name = "",
                firstName = "",
                lastName = "",
                email = "-",
                phone = "-",
                role = "-",
                status = "-",
                createdAt = "",
                _id
              } = user
              const displayName = name || (firstName + " " + lastName).trim() || email
              return (
                <tr key={_id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-2 font-medium flex items-center gap-2">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-[#52734D] text-white font-bold">
                      {displayName.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()}
                    </span>
                    {displayName}
                  </td>
                  <td className="py-2 px-2">{email}</td>
                  <td className="py-2 px-2">{phone}</td>
                  <td className="py-2 px-2">{role}</td>
                  <td className="py-2 px-2">
                    <Badge className={status === "Actif" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}>
                      {status}
                    </Badge>
                  </td>
                  <td className="py-2 px-2">{createdAt ? new Date(createdAt).toLocaleDateString() : "-"}</td>
                  <td className="py-2 px-2 flex gap-2">
                    <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}><Pencil className="h-4 w-4 text-[#52734D]" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(_id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="text-center text-gray-500 py-8">Aucun utilisateur trouvé.</div>
        )}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-2 py-4">
            <div className="text-sm text-gray-500">
              Affichage de {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, filteredUsers.length)} sur {filteredUsers.length} utilisateurs
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>&lt;</Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button key={page} variant={page === currentPage ? "default" : "outline"} size="icon" onClick={() => setCurrentPage(page)}>{page}</Button>
              ))}
              <Button variant="outline" size="icon" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>&gt;</Button>
            </div>
          </div>
        )}
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-xl font-semibold mb-4 text-[#344E41]">{editingId ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input placeholder="Nom" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
                <Input placeholder="Email" type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
                <Input placeholder="Téléphone" value={newUser.phone} onChange={e => setNewUser({ ...newUser, phone: e.target.value })} />
                <select className="w-full border rounded p-2" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value as User["role"] })}>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <select className="w-full border rounded p-2" value={newUser.status} onChange={e => setNewUser({ ...newUser, status: e.target.value as User["status"] })}>
                  {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <Input placeholder="Mot de passe" type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
              </div>
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>Annuler</Button>
                <Button type="submit" className="bg-[#52734D] hover:bg-[#3A5A40] text-white">{editingId ? "Mettre à jour" : "Ajouter"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
