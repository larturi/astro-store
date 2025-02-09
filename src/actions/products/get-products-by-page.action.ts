import type { ProductWithImages } from '@/interfaces/product-with-images.interface'
import { defineAction } from 'astro:actions'
import { count, db, eq, Product, ProductImage, sql } from 'astro:db'
import { z } from 'astro:schema'

export const getProductsByPageORM = defineAction({
  accept: 'json',
  input: z.object({
    page: z.number().optional().default(1),
    limit: z.number().optional().default(12)
  }),
  handler: async ({ page, limit }) => {
    page = page < 0 ? 1 : page

    const [totalRecords] = await db.select({ count: count() }).from(Product)

    const totalPages = Math.ceil(totalRecords.count / limit)

    if (page > totalPages) {
      return { products: [], totalPages }
    }

    const products = await db
      .select()
      .from(Product)
      .innerJoin(ProductImage, eq(Product.id, ProductImage.productId))
      .limit(limit)
      .offset((page - 1) * limit)

    return { products: products, totalPages: totalPages }
  }
})

export const getProductsByPageRowQuery = defineAction({
  accept: 'json',
  input: z.object({
    page: z.number().optional().default(1),
    limit: z.number().optional().default(12)
  }),
  handler: async ({ page, limit }) => {
    page = page < 0 ? 1 : page

    const [totalRecords] = await db.select({ count: count() }).from(Product)

    const totalPages = Math.ceil(totalRecords.count / limit)

    if (page > totalPages) {
      return { products: [] as ProductWithImages[], totalPages }
    }

    const productsQuery = sql`
      SELECT a.*,
        (SELECT GROUP_CONCAT(image,',') FROM
          ( SELECT * FROM ${ProductImage} WHERE ProductImage.productId = a.id LIMIT 2)
      ) AS images
      FROM ${Product} a
      LIMIT ${limit} OFFSET ${(page - 1) * limit}`

    const { rows } = await db.run(productsQuery)

    return {
      products: rows as unknown as ProductWithImages[],
      totalPages: totalPages
    }
  }
})
