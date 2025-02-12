import type { CartItem } from '@/interfaces'
import { defineAction } from 'astro:actions'
import { db, eq, inArray, Product, ProductImage } from 'astro:db'
import { z } from 'astro:schema'

export const loadProductsCart = defineAction({
  accept: 'json',
  input: z.array(
    z.object({
      productId: z.string(),
      size: z.string(),
      quantity: z.number()
    })
  ),
  handler: async (cart, { cookies }) => {
    if (cart.length === 0) return []

    const productsIds = cart.map((item) => item.productId)

    const dbProducts = await db
      .select()
      .from(Product)
      .innerJoin(ProductImage, eq(Product.id, ProductImage.productId))
      .where(inArray(Product.id, productsIds))

    return cart.map((item) => {
      const dbProduct = dbProducts.find((p) => p.Product.id === item.productId)

      if (!dbProduct) {
        throw new Error(`Product with id ${item.productId} not found`)
      }

      const { productId, size, quantity } = item
      const { title, price, slug } = dbProduct.Product
      const image = dbProduct.ProductImage.image

      return {
        productId,
        title,
        quantity,
        size,
        image: image.startsWith('http')
          ? image
          : `${import.meta.env.PUBLIC_URL}/images/products/${image}`,
        price,
        slug
      }
    })
  }
})
