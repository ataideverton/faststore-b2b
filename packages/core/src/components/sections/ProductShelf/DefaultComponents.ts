import { ProductShelf as UIProductShelf } from '@faststore-b2b/ui'
import ProductCard from 'src/components/product/ProductCard'
import Carousel from 'src/components/ui/Carousel'

export const ProductShelfDefaultComponents = {
  ProductShelf: UIProductShelf,
  __experimentalCarousel: Carousel,
  __experimentalProductCard: ProductCard,
} as const
