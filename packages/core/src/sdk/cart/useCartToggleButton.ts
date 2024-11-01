import { useCallback } from 'react'

import { useUI } from '@faststore-b2b/ui'
import { useCart } from './index'

export const useCartToggleButton = () => {
  const { totalItems } = useCart()
  const { cart: displayCart, openCart, closeCart } = useUI()

  const onClick = useCallback(() => {
    if (displayCart) {
      closeCart()
    } else {
      openCart()
    }
  }, [closeCart, displayCart, openCart])

  return {
    onClick,
    'data-testid': 'cart-toggle',
    'data-items': totalItems,
  }
}
