"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface Category {
  id: string
  name: string
  wilayas: Wilaya[]
}

interface Wilaya {
  id: string
  name: string
  description: string
  imageUrl: string
  categoryId: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
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

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Explorer par Catégorie</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {category.wilayas.map((wilaya) => (
                  <div key={wilaya.id} className="flex gap-4 items-start">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={wilaya.imageUrl}
                        alt={wilaya.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{wilaya.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {wilaya.description}
                      </p>
                      <Button
                        variant="link"
                        className="p-0 h-auto mt-1"
                        onClick={() => {
                          window.location.href = `/explorer/wilaya/${wilaya.id}`
                        }}
                      >
                        Voir plus
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 