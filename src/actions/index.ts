import { loginUser, logout, registerUser } from './auth'
import { getProductsByPageRowQuery } from './products/get-products-by-page.action'

export const server = {
  // actions

  // Auth
  loginUser,
  logout,
  registerUser,

  // Products
  getProductsByPageRowQuery
}
