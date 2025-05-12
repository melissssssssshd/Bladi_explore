"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ImagePlus, X } from "lucide-react"
import Image from "next/image"

interface MultiImageUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
}

export function MultiImageUpload({ value, onChange }: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setIsUploading(true)
    try {
      const uploadedUrls: string[] = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append("file", file)
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Erreur lors de l'upload")
        }
        const data = await response.json()
        uploadedUrls.push(data.url)
      }
      onChange([...value, ...uploadedUrls])
    } catch (error) {
      alert("Erreur lors de l'upload d'une ou plusieurs images.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = (url: string) => {
    onChange(value.filter((img) => img !== url))
  }

  return (
    <div className="flex flex-wrap gap-4 items-center">
      {value.map((img, idx) => (
        <div key={idx} className="relative w-[120px] h-[120px] rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
          <Image src={img} alt={`Image ${idx + 1}`} fill className="object-cover" />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => handleRemove(img)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <label className="w-[120px] h-[120px] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleUpload}
          disabled={isUploading}
        />
        <ImagePlus className="h-8 w-8 text-gray-400" />
        <span className="mt-2 text-xs text-gray-500 text-center">
          {isUploading ? "Upload..." : "Ajouter"}
        </span>
      </label>
    </div>
  )
}

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erreur lors de l'upload")
      }
      const data = await response.json()
      onChange(data.url)
    } catch (error) {
      alert("Erreur lors de l'upload de l'image.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-[200px] h-[200px] rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
        {value ? (
          <>
            <Image
              src={value}
              alt="Uploaded image"
              fill
              className="object-cover"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => onChange("")}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={isUploading}
            />
            <ImagePlus className="h-8 w-8 text-gray-400" />
            <span className="mt-2 text-sm text-gray-500">
              {isUploading ? "Upload en cours..." : "Cliquez pour uploader"}
            </span>
          </label>
        )}
      </div>
    </div>
  )
} 