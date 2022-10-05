import { DiscussionEmbed } from 'disqus-react'
import moment from 'moment-timezone'
import React from 'react'
import { Helmet } from 'react-helmet'
import slugify from 'slugify'
import { icons } from '../components/icons'
import { OutboundLink } from '../components/react-seo-meta-tags/OutboundLink'
import { ReactSEOMetaTags } from '../components/react-seo-meta-tags/ReactSEOMetaTags'
import { Fancybox } from '../fancybox/src'
import '../fancybox/src/Fancybox/Fancybox.scss'
import { MaterialsData, RecipesData } from '../utils/chimeraland'
import { capitalizer } from '../utils/string'
import { pathname2url } from '../utils/url'
import { adsArticle, adsArticle1 } from './adsense/myads'
import './Recipes.scss'

type RecipesProp = typeof RecipesData[number]
/**
 * @route /chimeraland/recipes/*.html
 * @param props
 * @returns
 */
export function Recipes(props: RecipesProp) {
  const delegate = '[data-fancybox]'

  React.useEffect(() => {
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

  const siteMetadata = {
    url: pathname2url(props.pathname),
    title: props.name + ' Cooking Recipe - Chimeraland',
    datePublished: props.datePublished,
    dateModified: props.dateModified,
    description: props.name + ' - Chimeraland',
    language: 'en-US,id',
    image:
      typeof props.images !== 'undefined' && props.images.icon
        ? props.images.icon.pathname
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

  return (
    <>
      <ReactSEOMetaTags
        render={(el: React.ReactNode) => <Helmet>{el}</Helmet>}
        website={{ ...siteMetadata }}
      />
      <main className="container-fluid">
        <nav aria-label="breadcrumb mb-2">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <OutboundLink
                href="/chimeraland"
                legacy={true}
                className="text-decoration-none">
                Home
              </OutboundLink>
            </li>
            <li className="breadcrumb-item">
              <OutboundLink
                href={'/chimeraland/' + props.type}
                legacy={true}
                className="text-decoration-none">
                {capitalizer(props.type)}
              </OutboundLink>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {props.name}
            </li>
          </ol>
        </nav>

        <div className="row mb-2">
          <div className="col-md-12 mb-2">
            <table className="table" id="post-info">
              <tbody>
                <tr>
                  <td>
                    {props.images && props.images.icon && (
                      <img
                        className="d-inline-block me-2"
                        src={props.images.icon.pathname}
                        width="auto"
                        height="auto"
                      />
                    )}
                  </td>
                  <td>
                    <h1 className="fs-5">{props.name} Cooking Recipe</h1>
                    <div className="text-muted">
                      <span className="me-1">
                        <icons.FcCalendar className="ic me-1" />
                        {moment(props.datePublished).format('LLL')}
                      </span>
                      <span className="me-1">
                        <icons.FaHistory className="ic me-1" />
                        {moment(props.dateModified).format('LLL')}
                      </span>
                      <span>
                        <icons.BsFillPersonFill className="ic me-1" />
                        <span>L3n4r0x</span>
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="h-250">{adsArticle(props.name + 'recipe-2')}</div>

        <div className="card mb-2">
          <div className="row g-0">
            <div className="col-sm-4 position-relative mb-2">
              <img
                src={
                  props.images.material
                    ? props.images.material.pathname
                    : 'https://via.placeholder.com/600'
                }
                className="card-img fit-cover w-100 h-100"
                alt={props.name}
                data-fancybox="true"
              />
            </div>
            {/** buff */}
            <div className="col-sm-8 mb-2">
              <div className="card-body">
                <h2 className="card-title fs-5">Buff {props.name}</h2>

                <div className="card-text">
                  <ul>
                    {'buff' in props ? (
                      (props.buff as string[])?.map((str, bi) => {
                        return <li key={'bi' + bi}>{str}</li>
                      })
                    ) : (
                      <>Buff {props.name} not yet written</>
                    )}
                  </ul>
                </div>
                <span className="badge rounded-pill bg-dark">recipe</span>
              </div>

              <div className="card-footer text-end text-muted">
                webmanajemen.com
              </div>
            </div>
          </div>
        </div>

        {/** recipes */}
        <div className="row mb-2">
          <div className="col-12 h-250">
            {adsArticle1(props.name + 'recipe-1')}
          </div>
          {props.recipes.map((recipe, ri) => {
            let device = ''
            const rg = /--device: (.*)--/i
            const split = recipe.match(rg)
            if (split) {
              device = split[1]
            }
            const replace = recipe
              .replace(rg, '')
              .trim()
              .split('+')
              .map((str) => str.trim())
              .map((str, mi) => {
                const cleanstr = str.replace(/\[\d\]/, '').trim()
                const findmat = MaterialsData.find(
                  (mat) =>
                    slugify(mat.name, { lower: true, trim: true }) ===
                    slugify(cleanstr, { lower: true, trim: true })
                )
                if (findmat) {
                  return (
                    <OutboundLink
                      className="text-decoration-none"
                      href={findmat.pathname}
                      legacy={true}
                      key={'material' + ri + mi}>
                      {str}
                    </OutboundLink>
                  )
                } else {
                  //console.log(cleanstr)
                  return <>{str}</>
                }
              })
              .reduce((prev, curr) => (
                <>
                  {prev}
                  <span> + </span>
                  {curr}
                </>
              ))
            //console.log(replace)
            return (
              <div
                className="col-12 col-lg-6 recipe-item mb-2"
                key={'recipe-' + ri}>
                <div className="card">
                  <div className="card-body">
                    <h2 className="card-title fs-5">
                      Recipe {props.name} {ri + 1}
                    </h2>
                    <div className="card-text">
                      <ul>
                        <li>{replace}</li>
                        {device && <li>Device: {device}</li>}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="row mb-2">
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
      </main>
    </>
  )
}
