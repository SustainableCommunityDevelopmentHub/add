import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { config } from 'config/config'
import { getCollectionItems } from 'lib/firebase'
import { showErrorNotification } from 'lib/showNotification'
import { articlesCollection, ArticlesContextProvider } from 'hooks/articles'
import useUser from 'hooks/useUser'

import ArticleList from 'components/articles/ArticleList'

function ArticleListPage ({ articles }) {
  // Note: 'query' contains both /:params and ?query=value from url
  const { query } = useRouter()
  const { user } = useUser()
  return (
    <>
      <h1>{config.appName}</h1>

      <p><em>{config.appTagline}</em></p>

      <ArticlesContextProvider
        articles={articles}
        onError={showErrorNotification}
      >
        <ArticleList />
      </ArticlesContextProvider>

      
      <!--<h2>Routing</h2>
      <p>Current query: <strong>{JSON.stringify(query)}</strong></p>
      <h2>Log in (using Firebase Authentication)</h2>
      {user && (
        <p>You are logged in as <strong>{user.email}</strong></p>
      )}-->
      <Link href='/login'>
        <a>Click here to log in</a>
      </Link>

      <h2>Techology assessment</h2>
      <p>Examine your project with different system criteria.</p>

      <p>Get <a target='_blank' rel='noopener noreferrer' href='https://github.com/tomsoderlund/nextjs-pwa-firebase-boilerplate'>snextjs-pwa-firebase-blpt</a></p>

      <p>Version {config.appVersion}</p>
    </>
  )
}

export default ArticleListPage

export async function getStaticProps ({ params }) {
  const articlesRaw = await getCollectionItems(articlesCollection()) // Add .orderBy('dateCreated') to sort by date but only rows where dateCreated exists
  const articles = articlesRaw.map(article => ({
    ...article,
    // To avoid “cannot be serialized as JSON” error:
    dateCreated: article.dateCreated ? article.dateCreated.toString() : null,
    dateUpdated: article.dateUpdated ? article.dateUpdated.toString() : null
  }))
  return {
    props: {
      articles
    },
    revalidate: 60 // Seconds. This refresh time could be longer depending on how often data changes.
  }
}
