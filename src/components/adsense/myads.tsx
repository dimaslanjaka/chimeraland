import { Adsense } from './Adsense'

export const adsAuto = (key = 'default') => (
  <Adsense
    key={key}
    style={{ display: 'block' }}
    client="ca-pub-2188063137129806"
    slot="2667720583"
    data-ad-format="auto"
    data-full-width-responsive="true"
  />
)

export const adsArticle = (key = 'default1') => (
  <Adsense
    key={key}
    style={{ display: 'block', textAlign: 'center' }}
    layout="in-article"
    format="fluid"
    client="ca-pub-2188063137129806"
    slot="8481296455"
  />
)

export const adsArticle1 = (key = 'default') => (
  <Adsense
    key={key}
    style={{ display: 'block', textAlign: 'center' }}
    layout="in-article"
    format="fluid"
    client="ca-pub-2188063137129806"
    slot="5634823028"
  />
)

export const adsMultiplex = (key = 'default') => (
  <Adsense
    key={key}
    style={{ display: 'block' }}
    format="autorelaxed"
    client="ca-pub-2188063137129806"
    slot="5041245242"
  />
)

export const adsFeedImgLeft = (key = 'default') => (
  <Adsense
    key={key}
    style={{ display: 'block' }}
    data-ad-format="fluid"
    data-ad-layout-key="-fb+5w+4e-db+86"
    client="ca-pub-2188063137129806"
    slot="6133452172"
  />
)

export const adsFeedTextOnly = (key = 'default') => (
  <Adsense
    key={key}
    style={{ display: 'block' }}
    data-ad-format="fluid"
    data-ad-layout-key="-gw-3+1f-3d+2z"
    client="ca-pub-2188063137129806"
    slot="6979059162"
  />
)
