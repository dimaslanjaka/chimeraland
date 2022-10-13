import React, { useEffect } from 'react'
import { array_unique } from '../../utils/array'
import { isDev } from '../../utils/env'
import './Adsense.scss'

const usedScript: string[] = []
export const useScript = (
  url: string,
  integrity = 'anonymous',
  async = true,
  crossOrigin = 'anonymous'
) => {
  useEffect(() => {
    if (usedScript.includes(url)) return
    const script = document.createElement('script')
    usedScript.push(url)
    script.src = url

    script.async = async

    if (integrity) {
      script.integrity = integrity
    }

    script.crossOrigin = crossOrigin

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [url, integrity, async, crossOrigin])
}

interface AdsenseInsProps {
  [key: string]: any
  className?: string
  style?: React.CSSProperties
  client: string
  slot: string
  layout?: string
  layoutKey?: string
  format?: string
  responsive?: string
  pageLevelAds?: boolean
  adTest?: string
  children?: React.ReactNode
}

export function AdsElement({
  className = '',
  style = { display: 'block' },
  client,
  slot,
  layout = '',
  layoutKey = '',
  format = 'auto',
  responsive = 'false',
  pageLevelAds = false,
  adTest,
  children,
  ...rest
}: AdsenseInsProps) {
  useScript('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js')
  useEffect(() => {
    const p: any = {}
    if (pageLevelAds) {
      p.google_ad_client = client
      p.enable_page_level_ads = true
    }

    try {
      if (typeof window === 'object') {
        ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
          p
        )
      }
    } catch {
      // Pass
    }
  }, [])

  // auto ads test
  if (isDev) {
    adTest = 'true'
    style = Object.assign(style, { border: '1px solid red' })
  }

  let props: Record<string, any> = {}
  const clssName = array_unique(
    `adsbygoogle ${className}`.split(/\s+/).map((str) => str.trim())
  )
  props.className = clssName.join(' ')
  props.style = style
  props['data-ad-client'] = client
  props['data-ad-slot'] = slot
  if (format.length > 0) props['data-ad-format'] = format
  if (layout.length > 0) props['data-ad-layout'] = layout
  if (layoutKey.length > 0) props['data-ad-layout-key'] = layoutKey
  if (responsive === 'true') props['data-full-width-responsive'] = 'true'
  if (adTest) props['data-adtest'] = 'true'
  props = Object.assign(props, rest)

  return <ins {...props}>{children}</ins>

  /*return (
    <ins
      className={`adsbygoogle ${className}`}
      style={style}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-layout={layout}
      data-ad-layout-key={layoutKey}
      data-ad-format={format}
      data-full-width-responsive={responsive}
      data-adtest={adTest}
      {...rest}>
      {children}
    </ins>
  )*/
}

/**
 * fix |uncaught exception: TagError: adsbygoogle.push() error: All ins elements in the DOM with class=adsbygoogle already have ads in them.
 */

/**
 * ensure adsense not duplicate
 * @param prevProps
 * @param nextProps
 * @returns
 */
function areEqual(prevProps: AdsenseInsProps, nextProps: AdsenseInsProps) {
  /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  */
  if (JSON.stringify(prevProps) === JSON.stringify(nextProps)) {
    return true // donot re-render
  }
  return false // will re-render
}
/**
 * import this variable instead adselement
 */
export const Adsense = React.memo(AdsElement, areEqual)
