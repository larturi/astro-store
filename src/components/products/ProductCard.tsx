import type { ProductWithImages } from '@/interfaces/product-with_images.interface'
import { useState } from 'react'

interface Props {
  product: ProductWithImages
}

const ProductCard = ({ product }: Props) => {
  const images = product.images.split(',').map((image) => {
    return image.startsWith('http')
      ? image
      : `${import.meta.env.PUBLIC_URL}/images/products/${image}`
  })

  const [currentImage, setCurrentImage] = useState(images[0])

  return (
    <a
      href={`/products/${product.slug}`}
      onMouseEnter={() => setCurrentImage(images[1] ?? images[0])}
      onMouseLeave={() => setCurrentImage(images[0])}
    >
      <img
        src={currentImage}
        alt={product.title}
        className='h-[350px] object-contain'
      />
      <h4>{product.title}</h4>
      <p>${product.price}</p>
    </a>
  )
}

export default ProductCard
