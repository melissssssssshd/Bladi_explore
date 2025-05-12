import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier si la catégorie a des wilayas associées
    const wilayasCount = await prisma.wilaya.count({
      where: {
        categoryId: params.id,
      },
    })

    if (wilayasCount > 0) {
      return NextResponse.json(
        { error: "Impossible de supprimer une catégorie qui contient des wilayas" },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la catégorie" },
      { status: 500 }
    )
  }
} 