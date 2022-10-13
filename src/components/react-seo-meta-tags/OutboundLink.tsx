import React, { forwardRef, LegacyRef } from 'react'
import { Link, matchPath } from 'react-router-dom'
import { SitemapCache2 } from '../Sitemap'

export type OutboundLinkpropTypes = React.DOMAttributes<HTMLAnchorElement> & {
  [key: string]: any
  href: string
  target?: HTMLAnchorElement['target']
  onClick?: React.DOMAttributes<HTMLAnchorElement>['onClick']
  /**
   * inner html elements or string
   */
  children?: React.DOMAttributes<HTMLAnchorElement>['children']
  /**
   * using legacy hyperlink <a /> instead <Link /> from react-dom
   */
  legacy?: boolean
}

/**
 * Outbound link anchor with analystic
 * @param param0
 * @param ref
 * @returns
 */
const OutboundLink_func = (
  { children, ...props }: OutboundLinkpropTypes,
  ref: LegacyRef<HTMLAnchorElement>
) => {
  const useLegacy = props.legacy
  delete props.legacy

  // push internal link to sitemap
  if (props.href.startsWith('/')) {
    SitemapCache2({ href: props.href })
  } else {
    // console.log('not internal', props.href)
  }

  const handler: React.DOMAttributes<HTMLAnchorElement>['onClick'] = (e) => {
    if (typeof props.onClick === `function`) {
      props.onClick(e)
    }
    let allowRedirect = true
    if (
      e.button !== 0 ||
      e.altKey ||
      e.ctrlKey ||
      e.metaKey ||
      e.shiftKey ||
      e.defaultPrevented
    ) {
      console.log('hyperlink has default Prevented')
      allowRedirect = false
    }

    // skip target blank
    if (props.target && props.target.toLowerCase() !== `_self`) {
      console.log('hyperlink has target', props.target)
      allowRedirect = false
    }

    // skip hash
    if (props.href.startsWith('#')) {
      console.log('hyperlink hash', props.href)
      allowRedirect = false
    }

    const doRedirect = () => {
      let pathname = '#'
      if (allowRedirect) {
        if (useLegacy) {
          e.preventDefault()
          document.location = props.href
        } else {
          const notHavePrefix = !matchPath(process.env.PUBLIC_URL, props.href)
          if (notHavePrefix) {
            pathname = (process.env.PUBLIC_URL + '/' + props.href).replace(
              /\/{2,10}/,
              '/'
            )
            document.location = pathname
          }
        }
      }
    }

    if (
      typeof window.gtag === 'function' &&
      /^https?:\/\/|^\//.test(props.href)
    ) {
      window.gtag(`event`, `click`, {
        event_category: `outbound`,
        event_label: props.href,
        screen_name: document.title,
        transport_type: allowRedirect ? `beacon` : ``,
        event_callback: doRedirect
      })
    } else {
      doRedirect()
    }

    return false
  }

  const legacy = (
    <a ref={ref} {...props} onClick={handler}>
      {children}
    </a>
  )

  const linked = (function () {
    if (props.href.startsWith('/')) {
      return (
        <Link to={{ pathname: props.href }} {...props} onClick={handler}>
          {children}
        </Link>
      )
    } else if (/^https:\/\//.test(props.href)) {
      const parseHref = new URL(props.href)
      if (/localhost|:/i.test(parseHref.host)) {
        return (
          <Link to={props.href} {...props} onClick={handler}>
            {children}
          </Link>
        )
      } else {
        // return original <a> for external url
        return legacy
      }
    } else {
      return legacy
    }
  })()

  if (useLegacy) {
    return legacy
  } else {
    return linked
  }
}
export const OutboundLink = forwardRef(OutboundLink_func)
