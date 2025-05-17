import Image from "next/image";
import { useState } from "react";

interface SafeImageProps {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  [key: string]: any;
}

export default function SafeImage({
  src,
  alt,
  width = 400,
  height = 300,
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(
    src && src.trim() !== "" ? src : "/placeholder.jpg"
  );
  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      onError={() => setImgSrc("/placeholder.jpg")}
      unoptimized
      {...props}
    />
  );
}
