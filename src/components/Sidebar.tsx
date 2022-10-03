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
        <h4 className="fst-italic">Sitelink</h4>
        <ol className="list-unstyled mb-0">
          <li>
            <OutboundLink href="/sitemap">Sitemap</OutboundLink>
          </li>
        </ol>
      </div>

      <div className="p-4">
        <h4 className="fst-italic">Abbreviations</h4>
        <ol className="list-unstyled">
          <li>Lv.1 (Grey Grade)</li>
          <li>Lv.2/Common (Green Grade)</li>
          <li>Lv.3/Uncommon (Blue Grade)</li>
          <li>Lv.4/Epic (Purple Grade)</li>
          <li>Lv.5/Legendary (Orange Grade)</li>
          <li>Lv.6/Mythic (Red Grade)</li>
          <li>All food buffs last for 15 minutes </li>
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
