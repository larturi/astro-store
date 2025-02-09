import type { ProductWithImages } from '@/interfaces/product-with-images.interface'
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
      className='block p-4 transition-transform transform hover:scale-105'
    >
      <img
        src={currentImage}
        alt={product.title}
        className='w-full h-[200px] md:h-[350px] object-contain'
      />
      <h4 className='mt-2 text-lg font-semibold text-center md:text-left'>
        {product.title}
      </h4>
      <p className='mt-1 text-center md:text-left text-gray-700'>
        ${product.price}
      </p>
    </a>
  )
}

export default ProductCard
