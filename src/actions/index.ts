import { loginUser, logout, registerUser } from './auth'
import { loadProductsCart } from './cart/load-products-cart.action'
import { getProductsBySlug } from './products/get-product-by-slug.action'
import { getProductsByPageRowQuery } from './products/get-products-by-page.action'

export const server = {
  // actions

  // Auth
  loginUser,
  logout,
  registerUser,

  // Products
  getProductsByPageRowQuery,
  getProductsBySlug,

  // Cart
  loadProductsCart
}
