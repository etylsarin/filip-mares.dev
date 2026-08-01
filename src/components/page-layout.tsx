import * as React from "react"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"
import * as styles from "./page-layout.module.scss"

const MAX_TITLE_LENGTH = 65
const MAX_DESCRIPTION_LENGTH = 160
const OG_IMAGE_PATH = "/icons/icon-512x512.png"

// Pages that exist for the framework, not for search engines.
const NOINDEX_PATHS = ["/404", "/offline-plugin-app-shell-fallback"]

const truncate = (text: string, limit: number) => {
  if (text.length <= limit) {
    return text
  }
  const cut = text.lastIndexOf(" ", limit - 1)

  return `${text.slice(0, cut > 0 ? cut : limit - 1).trimEnd()}…`
}

export const PageLayout = ({ children, pageContext, location, path }) => {
  const { title, desc, category, year, description } =
    pageContext?.frontmatter || {}
  const {
    site: { siteMetadata },
  } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          siteUrl
        }
      }
    }
  `)
  const currentYear = new Date().getFullYear()

  const siteUrl = siteMetadata.siteUrl.replace(/\/+$/, "")
  const pathname = location?.pathname || path || "/"
  const canonicalPath =
    pathname.endsWith("/") || /\.[a-z0-9]+$/i.test(pathname)
      ? pathname
      : `${pathname}/`
  const canonicalUrl = `${siteUrl}${canonicalPath}`
  const isNoindex = NOINDEX_PATHS.some(prefix => pathname.startsWith(prefix))

  // Each page needs its own title and description - identical ones across the
  // whole site are a common reason for "crawled, currently not indexed".
  // Search results cut titles off at roughly 60 characters, so drop the least
  // important part until the title fits.
  const TITLE = title
    ? [
        `${title}${category ? ` — ${category}` : ""} | ${siteMetadata.title}`,
        `${title} | ${siteMetadata.title}`,
        `${title} | Filip Mareš`,
        title,
      ].find(
        (candidate, index, candidates) =>
          candidate.length <= MAX_TITLE_LENGTH ||
          index === candidates.length - 1,
      )
    : `${siteMetadata.title} | selected works 2005 - ${currentYear}`
  const summary = (desc || description || "").replace(/\s*\.\s*$/, "")
  const DESC = truncate(
    summary
      ? `${summary}. ${
          category && year
            ? `A ${category} project (${year}) from the portfolio of Filip Mareš.`
            : ""
        }`.trim()
      : siteMetadata.description,
    MAX_DESCRIPTION_LENGTH,
  )

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Filip Mareš",
    jobTitle: "Full-stack web developer",
    description: siteMetadata.description,
    url: `${siteUrl}/`,
    image: `${siteUrl}${OG_IMAGE_PATH}`,
    email: "mailto:maresf@gmail.com",
    telephone: "+420777116630",
    sameAs: [
      "https://github.com/etylsarin",
      "https://www.linkedin.com/in/filipmares1",
    ],
  }

  return (
    <>
      <Helmet htmlAttributes={{ lang: "en" }}>
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESC} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content={siteMetadata.title} />
        <meta property="og:locale" content="en_GB" />
        <meta property="og:image" content={`${siteUrl}${OG_IMAGE_PATH}`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESC} />
        <meta name="twitter:image" content={`${siteUrl}${OG_IMAGE_PATH}`} />
        {isNoindex ? (
          <meta name="robots" content="noindex, follow" />
        ) : (
          <link rel="canonical" href={canonicalUrl} />
        )}
        {canonicalPath === "/" ? (
          <script type="application/ld+json">
            {JSON.stringify(personSchema)}
          </script>
        ) : null}
      </Helmet>
      <div className={styles.page}>
        <header className={styles.header}>
          <h1>
            <a href="/">Filip Mareš</a> // web developer
          </h1>
          <nav className={styles.navigation}>
            <ul>
              <li>
                <a href="/#about">About</a>
              </li>
              <li>
                <a href="/#work">Work</a>
              </li>
              <li>
                <a href="/#contact">Contact</a>
              </li>
            </ul>
          </nav>
        </header>
        <main>{children}</main>
        <footer className={styles.footer}>
          <small>
            Copyright © 2005 - {currentYear}, created by Filip Mareš
          </small>
        </footer>
      </div>
    </>
  )
}

export default PageLayout
