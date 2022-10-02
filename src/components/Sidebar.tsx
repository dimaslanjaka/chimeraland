import { OutboundLink } from './react-seo-meta-tags/OutboundLink'

export function Sidebar() {
  return (
    <div className="position-sticky" style={{ top: '2rem' }}>
      <div className="p-4 mb-3 bg-light rounded">
        <h4 className="fst-italic">About</h4>
        <p className="mb-0">
          Unofficial Chimeraland Wikipedia is a blog website that records all
          data information about the chimeraland game (Android, iOS, PC)
        </p>
      </div>

      <div className="p-4">
        <h4 className="fst-italic">Archives</h4>
        <ol className="list-unstyled mb-0">
          <li>
            <OutboundLink href="#">March 2021</OutboundLink>
          </li>
          <li>
            <OutboundLink href="#">February 2021</OutboundLink>
          </li>
          <li>
            <OutboundLink href="#">January 2021</OutboundLink>
          </li>
          <li>
            <OutboundLink href="#">December 2020</OutboundLink>
          </li>
          <li>
            <OutboundLink href="#">November 2020</OutboundLink>
          </li>
          <li>
            <OutboundLink href="#">October 2020</OutboundLink>
          </li>
          <li>
            <OutboundLink href="#">September 2020</OutboundLink>
          </li>
          <li>
            <OutboundLink href="#">August 2020</OutboundLink>
          </li>
          <li>
            <OutboundLink href="#">July 2020</OutboundLink>
          </li>
          <li>
            <OutboundLink href="#">June 2020</OutboundLink>
          </li>
          <li>
            <OutboundLink href="#">May 2020</OutboundLink>
          </li>
          <li>
            <OutboundLink href="/sitemap">Sitemap</OutboundLink>
          </li>
        </ol>
      </div>

      <div className="p-4">
        <h4 className="fst-italic">Elsewhere</h4>
        <ol className="list-unstyled">
          <li>
            <OutboundLink href="#">GitHub</OutboundLink>
          </li>
          <li>
            <OutboundLink href="#">Twitter</OutboundLink>
          </li>
          <li>
            <OutboundLink href="#">Facebook</OutboundLink>
          </li>
        </ol>
      </div>
    </div>
  )
}
