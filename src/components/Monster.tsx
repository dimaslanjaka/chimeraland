import { DiscussionEmbed } from 'disqus-react'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import slugify from 'slugify'
import { Fancybox } from '../fancybox/src'
import '../fancybox/src/Fancybox/Fancybox.scss'
import { MaterialsData, MonstersData, RecipesData } from '../utils/chimeraland'
import { capitalizer } from '../utils/string'
import { pathname2url } from '../utils/url'
import { adsArticle, adsArticle1, adsAuto } from './adsense/myads'
import './Monster.scss'
import { OutboundLink } from './react-seo-meta-tags/OutboundLink'
import { ReactSEOMetaTags } from './react-seo-meta-tags/ReactSEOMetaTags'

type MonsterProps = typeof MonstersData[number]
export function Monster(props: MonsterProps) {
  const siteMetadata = {
    url: pathname2url(props.pathname),
    title: props.name + ' - Chimeraland',
    datePublished: props.datePublished,
    dateModified: props.dateModified,
    description: props.name + ' - Chimeraland',
    language: 'en-US,id',
    image:
      typeof props.images[0] === 'string'
        ? props.images[0]
        : 'https://via.placeholder.com/250x180.png?text=' + props.name,
    author: {
      email: 'dimaslanjaka@gmail.com',
      name: 'Dimas Lanjaka',
      image: 'https://avatars.githubusercontent.com/u/12471057?v=4'
    },
    site: {
      siteName: 'WMI Chimeraland',
      searchUrl: 'https://www.google.com/search?q='
    }
  }

  const delegate = '[data-fancybox]'

  useEffect(() => {
    const opts = {
      groupAll: true, // Group all items
      on: {
        ready: (fancybox: HTMLElement) => {
          console.log(`fancybox #${fancybox.id} is ready!`)
        }
      }
    }

    Fancybox.bind(delegate, opts)

    return () => {
      Fancybox.destroy()
    }
  }, [])

  const onClickBox = function (this: any, e: any) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let el: HTMLElement = this
    if (typeof e == 'object' && 'target' in e) el = e.target
    el.querySelector('a')?.click()
    el.parentElement?.querySelector('a')?.click()
  }

  const mappedTasty = props.delicacies.map((tasty) => {
    const findIndex = RecipesData.findIndex(
      (recipe) =>
        slugify(tasty, { lower: true, trim: true }) ===
        slugify(recipe.name, { lower: true, trim: true })
    )
    const result = Object.assign(
      {
        pathname:
          '#' + slugify(tasty.replace(/[^a-zA-Z ]/g, ''), { lower: true }),
        name: tasty
      },
      RecipesData[findIndex] || {}
    )
    return result as typeof RecipesData[number] & { pathname: string }
  })

  return (
    <>
      <ReactSEOMetaTags
        render={(el: React.ReactNode) => <Helmet>{el}</Helmet>}
        website={{ ...siteMetadata }}
      />

      <div className="container">
        <nav aria-label="breadcrumb">
          <ol
            className="breadcrumb"
            itemScope={true}
            itemType="https://schema.org/BreadcrumbList">
            <li
              className="breadcrumb-item"
              itemProp="itemListElement"
              itemScope={true}
              itemType="https://schema.org/ListItem">
              <OutboundLink
                href="/chimeraland"
                itemProp="item"
                legacy={true}
                className="text-decoration-none">
                <span itemProp="name">Home</span>
                <meta itemProp="position" content="1" />
              </OutboundLink>
            </li>
            <li
              className="breadcrumb-item"
              itemProp="itemListElement"
              itemScope={true}
              itemType="https://schema.org/ListItem">
              <OutboundLink
                href={'/chimeraland/' + props.type}
                legacy={true}
                itemProp="item"
                itemScope={true}
                itemType="https://schema.org/WebPage"
                itemID={'/chimeraland/' + props.type}
                className="text-decoration-none">
                <span itemProp="name">{capitalizer(props.type)}</span>
                <meta itemProp="position" content="2" />
              </OutboundLink>
            </li>
            <li
              className="breadcrumb-item active"
              aria-current="page"
              itemProp="itemListElement"
              itemScope={true}
              itemType="https://schema.org/ListItem">
              <span itemProp="name">{props.name}</span>
              <meta itemProp="position" content="3" />
            </li>
          </ol>
        </nav>
      </div>

      <div className="container-fluid mt-3" id="stats-wrapper">
        <div className="row">
          {/** stats */}
          <div className="col-12">
            <h2 id="stats">{props.name} stats information</h2>
            <div className="row" id="stats-wrapper">
              <div className="col-12 col-stat col-lg-6 mb-2">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Default Quality</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      Default Quality for {props.name}
                    </h6>
                    <p className="card-text">{props.qty}</p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-stat col-lg-6 mb-2">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Delicacies/Tasty</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      Delicacies/Tasty for {props.name}
                    </h6>
                    <div className="card-text">
                      <ul>
                        {mappedTasty.map((str, i) => {
                          return (
                            <li key={'tasty' + i}>
                              <OutboundLink
                                className="text-decoration-none"
                                href={str.pathname}
                                legacy={true}
                                about={'delicacies/tasty for' + props.name}
                                title={'delicacies/tasty for' + props.name}>
                                {str.name}
                              </OutboundLink>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-stat col-lg-6 mb-2">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Bloodline Buff</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      Bloodline Buff for {props.name}
                    </h6>
                    <div className="card-text">
                      <ul>
                        {props.buff.map((buff, i) => {
                          return (
                            <li key={'buff' + i}>
                              <OutboundLink
                                className="text-decoration-none"
                                href={
                                  '#' +
                                  slugify(buff.replace(/[^a-zA-Z ]/g, ''), {
                                    lower: true,
                                    trim: true
                                  })
                                }
                                title={'bloodline buff for' + props.name}
                                about={'bloodline buff for' + props.name}>
                                {buff}
                              </OutboundLink>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 h-250 col-lg-6 mb-2">
                {adsArticle(props.name + 'article-1')}
              </div>
            </div>
          </div>
          {/** delicacies */}
          <div className="col-12">
            <h2 id="delicacies">
              Delicacies and tasty recipes for {props.name}
            </h2>
            <div className="h-250">{adsArticle1(props.name + 'article-2')}</div>
            <div className="row" id="delicacies-wrapper">
              {mappedTasty.map((recipe, i) => {
                return (
                  <div className="col-md-12 mb-2" key={'mappedTasty' + i}>
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">
                          <OutboundLink
                            className="text-decoration-none"
                            legacy={true}
                            href={
                              'pathname' in recipe === false
                                ? '#' + slugify(recipe.name, { lower: true })
                                : recipe.pathname
                            }>
                            {recipe.name}
                          </OutboundLink>
                        </h5>
                        <h6 className="card-subtitle mb-2 text-muted">
                          {recipe.name} cooking ingredients
                        </h6>
                        <div className="card-text">
                          <ul>
                            {'recipes' in recipe &&
                            Array.isArray(recipe.recipes)
                              ? recipe.recipes.map((ingredient, ii) => {
                                  return (
                                    <li key={ingredient + i + ii}>
                                      {ingredient
                                        .split('+')
                                        .map((ing, mi) => {
                                          function findMaterial(
                                            matName: string
                                          ) {
                                            matName = matName.trim()
                                            const material = MaterialsData.find(
                                              (mat) => mat.name == matName
                                            )
                                            if (material) {
                                              return (
                                                <OutboundLink
                                                  title={
                                                    recipe.name +
                                                    ' recipe ' +
                                                    (ii + 1)
                                                  }
                                                  about={
                                                    recipe.name +
                                                    ' recipe ' +
                                                    (ii + 1)
                                                  }
                                                  legacy={true}
                                                  key={material.pathname + mi}
                                                  className="text-decoration-none"
                                                  href={material.pathname}>
                                                  <img
                                                    src={
                                                      material.images[0]
                                                        .pathname
                                                    }
                                                    alt={material.name}
                                                    width="25px"
                                                    height="auto"
                                                    className="me-1"
                                                  />
                                                  <span>{material.name}</span>
                                                </OutboundLink>
                                              )
                                            }
                                            // return original string
                                            return <>{matName}</>
                                          }
                                          if (/\//.test(ing)) {
                                            return ing
                                              .split(/\//g)
                                              .map(findMaterial)
                                              .reduce((prev, curr) => (
                                                <>
                                                  {prev}
                                                  <span> or </span>
                                                  {curr}
                                                </>
                                              ))
                                          }
                                          return findMaterial(ing)
                                        })
                                        .reduce((prev, curr) => (
                                          <>
                                            {prev}
                                            <span> + </span>
                                            {curr}
                                          </>
                                        ))}
                                    </li>
                                  )
                                })
                              : 'Recipe ' + recipe.name + ' not yet written'}
                            {'recipes' in recipe ? (
                              <li>Device to cook: {recipe.device}</li>
                            ) : (
                              ''
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          {/** gallery photos */}
          <div className="col-12">
            <h2 id="galleries">Galleries {props.name}</h2>
            <div className="h-250">{adsAuto(props.name + 'monster-auto')}</div>
            <div className="gallery-image text-center" id="gallery">
              {props.images.map((o, i) => {
                const src =
                  '/chimeraland/monsters/' +
                  slugify(props.name, { lower: true, trim: true }) +
                  '/' +
                  o.filename
                return (
                  <div className="mb-2" key={'img-box-wrapper' + i}>
                    <div
                      className="img-box"
                      onClick={onClickBox}
                      key={'img-box' + i}>
                      <OutboundLink
                        legacy={true}
                        key={'link-img-box' + i}
                        href={src}
                        data-fancybox="gallery"
                        data-caption={props.name + ' Gallery ' + (i + 1)}>
                        <img
                          src={src}
                          key={'img-img-box' + i}
                          alt={props.name + ' Gallery ' + (i + 1)}
                        />
                      </OutboundLink>
                      <div
                        className="transparent-box"
                        key={'img-box-transparent' + i}>
                        <div className="caption" key={'capt-' + i}>
                          <p key={'pname-' + i}>{props.name}</p>
                          <p className="opacity-low" key={'opacity-' + i}>
                            {props.name} Gallery {i + 1}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          {/** comment */}
          <div className="col-12">
            <DiscussionEmbed
              shortname="dimaslanjaka"
              config={{
                url: pathname2url(props.pathname),
                identifier: props.pathname,
                title: props.name
                // language: 'zh_TW' //e.g. for Traditional Chinese (Taiwan)
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
