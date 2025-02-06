import { db, Role, User } from 'astro:db'
import { v4 as UUID } from 'uuid'
import bcrypt from 'bcryptjs'

// https://astro.build/db/seed
export default async function seed() {
  const roles = [
    { id: 'admin', name: 'Administrator' },
    { id: 'user', name: 'Basic User' }
  ]

  const jhonDoe = {
    id: UUID(),
    name: 'John Doe',
    email: 'john.doe@mail.com',
    password: bcrypt.hashSync('12345678'),
    role: 'admin'
  }

  const janeDoe = {
    id: UUID(),
    name: 'Jane Doe',
    email: 'jane.doe@mail.com',
    password: bcrypt.hashSync('12345678'),
    role: 'user'
  }

  await db.insert(Role).values(roles)
  await db.insert(User).values([jhonDoe, janeDoe])
}
