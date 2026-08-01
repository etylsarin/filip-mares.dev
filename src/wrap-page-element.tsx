import * as React from "react"
import { PageLayout } from "./components/page-layout"
import { PortfolioLayout } from "./components/portfolio-layout"

/**
 * Shared by gatsby-browser and gatsby-ssr so that the layout - and with it the
 * document head - is part of the statically rendered HTML, not just the
 * hydrated client render.
 */
export const wrapPageElement = ({ element, props }) => {
  const pathname = props?.location?.pathname || props?.path || props?.uri || "/"
  const child = pathname.startsWith("/portfolio/") ? (
    <PortfolioLayout {...props}>{element}</PortfolioLayout>
  ) : (
    <>{element}</>
  )

  return <PageLayout {...props}>{child}</PageLayout>
}

export default wrapPageElement
