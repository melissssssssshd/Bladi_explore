import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        wilayas: true,
      },
      orderBy: {
        name: 'asc',
      },
    })
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des catégories" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name } = body

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: "Nom de catégorie requis et doit être une chaîne non vide" },
        { status: 400 }
      )
    }

    // Vérifier si la catégorie existe déjà
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: {
          equals: name.trim(),
          mode: 'insensitive',
        },
      },
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: "Une catégorie avec ce nom existe déjà" },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error("Erreur lors de la création de la catégorie:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création de la catégorie" },
      { status: 500 }
    )
  }
} 