// Se ejecuta cada vez que se inicia el servidor, solo en modo de desarrollo

import { db, Role, User, Product, ProductImage } from 'astro:db'
import { v4 as UUID } from 'uuid'
import bcrypt from 'bcryptjs'
import { seedProducts } from './seed-data'

// https://astro.build/db/seed
export default async function seed() {
  const roles = [
    { id: 'admin', name: 'Administrator' },
    { id: 'user', name: 'Basic User' }
  ]

  const jhonDoe = {
    id: 'abc-123-john', // UUID(),
    name: 'John Doe',
    email: 'john.doe@mail.com',
    password: bcrypt.hashSync('12345678'),
    role: 'admin'
  }

  const janeDoe = {
    id: 'xyz-789-jane', // UUID(),
    name: 'Jane Doe',
    email: 'jane.doe@mail.com',
    password: bcrypt.hashSync('12345678'),
    role: 'user'
  }

  await db.insert(Role).values(roles)
  await db.insert(User).values([jhonDoe, janeDoe])

  const queries: any = []

  seedProducts.forEach((p) => {
    const product = {
      id: UUID(),
      stock: p.stock,
      slug: p.slug,
      price: p.price,
      sizes: p.sizes.join(','),
      type: p.type,
      tags: p.tags.join(','),
      title: p.title,
      description: p.description,
      gender: p.gender,
      user: jhonDoe.id
    }

    queries.push(db.insert(Product).values(product))

    p.images.forEach((img) => {
      const image = {
        id: UUID(),
        image: img,
        productId: product.id
      }

      queries.push(db.insert(ProductImage).values(image))
    })
  })

  await db.batch(queries)
}
