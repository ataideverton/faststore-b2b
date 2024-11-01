import type {
  AddToCartEvent,
  CurrencyCode,
  RemoveFromCartEvent,
} from '@faststore-b2b/sdk'
import {
  CartItem as UICartItem,
  CartItemImage as UICartItemImage,
  CartItemSummary as UICartItemSummary,
} from '@faststore-b2b/ui'
import { useCallback, useMemo } from 'react'

import { Image } from 'src/components/ui/Image'
import type { AnalyticsItem } from 'src/sdk/analytics/types'
import type { CartItem as ICartItem } from 'src/sdk/cart'
import { cartStore } from 'src/sdk/cart'
import { useRemoveButton } from 'src/sdk/cart/useRemoveButton'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import { useSession } from 'src/sdk/session'

function useCartItemEvent() {
  const {
    currency: { code },
  } = useSession()

  const sendCartItemEvent = useCallback(
    (item: Props['item'], quantity: number) => {
      const quantityDelta = quantity - item.quantity

      import('@faststore-b2b/sdk').then(({ sendAnalyticsEvent }) => {
        return sendAnalyticsEvent<
          AddToCartEvent<AnalyticsItem> | RemoveFromCartEvent<AnalyticsItem>
        >({
          name: quantityDelta > 0 ? 'add_to_cart' : 'remove_from_cart',
          params: {
            currency: code as CurrencyCode,
            // TODO: In the future, we can explore more robust ways of
            // calculating the value (gift items, discounts, etc.).
            value: item.price * Math.abs(quantityDelta),
            items: [
              {
                item_id: item.itemOffered.isVariantOf.productGroupID,
                item_name: item.itemOffered.isVariantOf.name,
                item_brand: item.itemOffered.brand.name,
                item_variant: item.itemOffered.sku,
                quantity: Math.abs(quantityDelta),
                price: item.price,
                discount: item.listPrice - item.price,
                currency: code as CurrencyCode,
                item_variant_name: item.itemOffered.name,
                product_reference_id: item.itemOffered.gtin,
              },
            ],
          },
        })
      })
    },
    [code]
  )

  return useMemo(() => ({ sendCartItemEvent }), [sendCartItemEvent])
}

interface Props {
  item: ICartItem
  useUnitMultiplier?: boolean
  taxesConfiguration?: {
    usePriceWithTaxes?: boolean
    taxesLabel?: string
  }
}

function CartItem({
  item,
  useUnitMultiplier = false,
  taxesConfiguration,
}: Props) {
  const btnProps = useRemoveButton(item)

  const { sendCartItemEvent } = useCartItemEvent()

  const onQuantityChange = useCallback(
    (quantity: number) => {
      sendCartItemEvent(item, quantity)

      cartStore.updateItemQuantity(item.id, quantity)
    },
    [item, sendCartItemEvent]
  )

  const skuActiveVariants =
    item.itemOffered.isVariantOf.skuVariants.activeVariations
  const activeVariations = Object.keys(skuActiveVariants).map((key) => ({
    label: key,
    option: skuActiveVariants[key],
  }))

  const price = taxesConfiguration?.usePriceWithTaxes
    ? item.priceWithTaxes
    : item.price

  const listPrice = taxesConfiguration?.usePriceWithTaxes
    ? item.listPriceWithTaxes
    : item.listPrice

  const unitMultiplier = item.itemOffered.unitMultiplier ?? 1

  return (
    <UICartItem
      price={{
        value: price,
        listPrice: useUnitMultiplier ? listPrice * unitMultiplier : listPrice,
        formatter: useFormattedPrice,
      }}
      quantity={item.quantity}
      onQuantityChange={onQuantityChange}
      removeBtnProps={btnProps}
      data-sku={item.itemOffered.sku}
      data-seller={item.seller.identifier}
      unitMultiplier={item.itemOffered.unitMultiplier}
      useUnitMultiplier={useUnitMultiplier}
    >
      <UICartItemImage>
        <Image
          src={item.itemOffered.image[0].url}
          alt={item.itemOffered.image[0].alternateName}
          width={56}
          height={56}
        />
      </UICartItemImage>
      <UICartItemSummary
        title={item.itemOffered.isVariantOf.name}
        activeVariations={activeVariations}
      />
    </UICartItem>
  )
}

export default CartItem
