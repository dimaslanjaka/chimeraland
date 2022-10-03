import { OutboundLink } from './react-seo-meta-tags/OutboundLink'

export function Footer() {
  return (
    <footer className="blog-footer">
      <p>
        Blog template built with{' '}
        <OutboundLink
          href="https://getbootstrap.com/"
          rel="nofollow noopener noreferer"
          target="_blank">
          Bootstrap
        </OutboundLink>
        <span> by </span>
        <OutboundLink
          href="https://github.com/dimaslanjaka"
          rel="nofollow noopener">
          @L3n4r0x
        </OutboundLink>
        .
      </p>
    </footer>
  )
}
