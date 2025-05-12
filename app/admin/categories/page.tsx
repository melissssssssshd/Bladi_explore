"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Category {
  id: string
  name: string
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState({ name: "" })
  const { toast } = useToast()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les catégories",
        variant: "error",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newCategory.name) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un nom de catégorie",
        variant: "error",
      })
      return
    }

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      })

      if (!response.ok) throw new Error("Erreur lors de l'ajout")

      toast({
        title: "Succès",
        description: "Catégorie ajoutée avec succès",
      })

      setNewCategory({ name: "" })
      fetchCategories()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la catégorie",
        variant: "error",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) return

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Erreur lors de la suppression")

      toast({
        title: "Succès",
        description: "Catégorie supprimée avec succès",
      })

      fetchCategories()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la catégorie",
        variant: "error",
      })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Catégories</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            <div className="flex gap-4">
              <Input
                placeholder="Nom de la catégorie"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ name: e.target.value })}
              />
              <Button type="submit">Ajouter une catégorie</Button>
            </div>
          </form>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                    >
                      Supprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 