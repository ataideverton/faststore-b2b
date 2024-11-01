import { Icon as UIIcon, List as UIList } from '@faststore-b2b/ui'

import Link from 'src/components/ui/Link'

type FooterSocialLink = {
  icon: {
    icon: string
  }
  alt: string
  url: string
}

export interface FooterSocialProps {
  title: string
  links: FooterSocialLink[]
  id?: string
}

function FooterSocial({
  title,
  links,
  id = 'footer-social-title',
}: FooterSocialProps) {
  return (
    <section data-fs-footer-social aria-labelledby={id}>
      <p data-fs-footer-social-title id={id}>
        {title}
      </p>
      <UIList>
        {links.map(({ icon: { icon }, url }) => (
          <li key={icon}>
            <Link
              href={url}
              title={icon}
              size="small"
              target="_blank"
              variant="display"
              rel="noopener noreferrer"
            >
              <UIIcon name={icon} />
            </Link>
          </li>
        ))}
      </UIList>
    </section>
  )
}

export default FooterSocial
