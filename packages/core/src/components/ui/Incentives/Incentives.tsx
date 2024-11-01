import {
  Icon as UIIcon,
  Incentive as UIIncentive,
  List as UIList,
} from '@faststore-b2b/ui'

export type Incentive = {
  icon: string
  title: string
  firstLineText: string
  secondLineText?: string
  alt?: string
}

export interface IncentivesProps {
  incentives: Incentive[]
  /**
   * Controls whether the component will be colored or not.
   */
  colored?: boolean
  /**
   * Controls the component's direction.
   */
  variant?: 'horizontal' | 'vertical'
  /**
   * Label to identify the incentive list and offer better accessibility
   */
  label?: string
}

function Incentives({
  incentives,
  variant = 'horizontal',
  colored = false,
  label,
}: IncentivesProps) {
  return (
    <section
      data-fs-incentives
      data-fs-incentives-colored={colored}
      data-fs-incentives-variant={variant}
      aria-label={`Incentives List ${label}`}
    >
      <UIList data-fs-content="incentives">
        {incentives.map((incentive, index) => (
          <li role="listitem" key={String(index)}>
            <UIIncentive tabIndex={0}>
              <UIIcon
                data-fs-incentive-icon
                aria-label={incentive.alt}
                name={incentive.icon}
                width={32}
                height={32}
              />
              <section data-fs-incentive-content>
                <p data-fs-incentive-title>{incentive.title}</p>
                <span data-fs-incentive-description>
                  {incentive.firstLineText}
                </span>
                {incentive.secondLineText && (
                  <span data-fs-incentive-description>
                    {incentive.secondLineText}
                  </span>
                )}
              </section>
            </UIIncentive>
          </li>
        ))}
      </UIList>
    </section>
  )
}

export default Incentives
