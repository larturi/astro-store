import { ImageUpload } from '@/utils/image-upload.adapter'
import { defineAction } from 'astro:actions'
import { db, eq, ProductImage } from 'astro:db'
import { z } from 'astro:schema'
import { getSession } from 'auth-astro/server'

export const deleteProductImage = defineAction({
  accept: 'json',
  input: z.string(),
  handler: async (imageId, { request }) => {
    try {
      // Verifica session activa
      const session = await getSession(request)
      const user = session?.user

      if (!user || !user.id) {
        throw new Error('Unauthorized')
      }

      // Busca la imagen en BD
      const productImage = await db
        .select()
        .from(ProductImage)
        .where(eq(ProductImage.id, imageId))
        .get()

      if (!productImage) {
        throw new Error(`Image ${imageId} not found`)
      }

      // Elimina la imagen de BD
      await db.delete(ProductImage).where(eq(ProductImage.id, imageId))

      // Elimina la imagen de Cloudinary
      if (productImage.image.includes('http')) {
        await ImageUpload.delete(productImage.image)
      }

      return { ok: true }
    } catch (error) {
      console.error(error)
      return { ok: false }
    }
  }
})
