import { defineAction } from 'astro:actions'
import { db, eq, Product } from 'astro:db'
import { z } from 'astro:schema'
import { getSession } from 'auth-astro/server'
import { v4 as UUID } from 'uuid'

const MAX_SIZE_FILES = 5_000_000 // 5MB
const ACCEPTED_IMAGES_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/svg+xml'
]

export const creteUpdateProduct = defineAction({
  accept: 'form',
  input: z.object({
    id: z.string().optional(),
    description: z.string(),
    gender: z.string(),
    price: z.number(),
    sizes: z.string(),
    slug: z.string(),
    stock: z.number(),
    tags: z.string(),
    title: z.string(),
    type: z.string(),

    imageFiles: z
      .array(
        z
          .instanceof(File)
          .refine((file) => file.size <= MAX_SIZE_FILES, {
            message: 'Invalid file'
          })
          .refine((file) => {
            if (file.size === 0) return
            return ACCEPTED_IMAGES_TYPES.includes(file.type)
          }, `Invalid file. Accepted types: ${ACCEPTED_IMAGES_TYPES.join(', ')}`)
      )
      .optional()
  }),
  handler: async (form, { request }) => {
    const session = await getSession(request)
    const user = session?.user

    if (!user || !user.id) {
      throw new Error('Unauthorized')
    }

    const { id = UUID(), imageFiles, ...rest } = form

    rest.slug = rest.slug.toLowerCase().replaceAll(' ', '-')

    const product = {
      id,
      user: user.id,
      ...rest
    }

    if (!form.id) {
      await db.insert(Product).values(product)
    } else {
      await db.update(Product).set(product).where(eq(Product.id, id))
    }

    return product
  }
})
