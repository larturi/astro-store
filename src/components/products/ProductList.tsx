import type { ProductWithImages } from '@/interfaces/product-with-images.interface'
import ProductCard from './ProductCard'

interface Props {
  products: ProductWithImages[]
}

const ProductList = ({ products }: Props) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductList
