import React from 'react'

function extractChildRoutes(route: Record<string, any>, prefix?: string) {
  let paths: string[] = []
  const childRoutes =
    route.props && route.props.children
      ? route.props.children
      : route.childRoutes
  if (childRoutes) {
    if (Array.isArray(childRoutes)) {
      childRoutes.forEach((r) => {
        paths = paths.concat(extractRoute(r, prefix))
      })
    } else {
      paths = paths.concat(extractRoute(childRoutes, prefix))
    }
  }
  return paths
}

function extractRoute(route: Record<string, any>, prefix?: string) {
  const path = route.props && route.props.path ? route.props.path : route.path
  let paths: string[] = []

  if (!path) {
    if (Array.isArray(route)) {
      route.forEach((r) => {
        paths = paths.concat(extractRoute(r, prefix))
      })

      return paths
    } else {
      return extractChildRoutes(route, prefix)
    }
  }
  const currentPath = `${prefix || ''}${path}`.replace(/\/+/g, '/')

  if (!/:|\*/.test(currentPath)) {
    paths.push(`${currentPath.startsWith('/') ? '' : '/'}${currentPath}`)
    paths = paths.concat(extractChildRoutes(route, `${currentPath}/`))
  }
  return paths
}

/**
 * extract all routes to array
 * @param children
 * @returns
 */
export function Route2Array(children: JSX.Element) {
  let results: string[] = []
  React.Children.forEach(children, function (element) {
    if (React.isValidElement(element)) {
      console.clear()
      const extracted = extractRoute(element)
      results = results.concat(extracted)
    }
  })
  return results
}
