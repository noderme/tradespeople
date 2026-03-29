#!/usr/bin/env node

const SUBREDDITS = [
  'AskReddit',
  'todayilearned',
  'explainlikeimfive',
  'personalfinance',
  'smallbusiness',
  'Entrepreneur',
]

const MIN_UPVOTES = 50
const OUTPUT_FILE = 'daily-posts.md'
const TWENTY_FOUR_HOURS = 60 * 60 * 24

async function fetchTopPosts(subreddit) {
  const url = `https://www.reddit.com/r/${subreddit}/top.json?t=day&limit=100`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'engagement-scraper/1.0' },
  })
  if (!res.ok) throw new Error(`Failed to fetch r/${subreddit}: ${res.status}`)
  const json = await res.json()
  return json.data.children.map(c => c.data)
}

function isTextPost(post) {
  return post.is_self && post.selftext && post.selftext.trim() !== '[removed]' && post.selftext.trim() !== ''
}

function isWithin24Hours(post) {
  const age = Date.now() / 1000 - post.created_utc
  return age <= TWENTY_FOUR_HOURS
}

async function main() {
  const now = new Date()
  const results = []

  for (const sub of SUBREDDITS) {
    process.stdout.write(`Fetching r/${sub}...`)
    try {
      const posts = await fetchTopPosts(sub)
      const filtered = posts.filter(
        p => isWithin24Hours(p) && isTextPost(p) && p.score >= MIN_UPVOTES
      )
      console.log(` ${filtered.length} posts`)
      for (const p of filtered) {
        results.push({
          subreddit: sub,
          title: p.title,
          upvotes: p.score,
          url: `https://reddit.com${p.permalink}`,
          created: new Date(p.created_utc * 1000),
        })
      }
    } catch (err) {
      console.error(` ERROR: ${err.message}`)
    }
    // polite delay between requests
    await new Promise(r => setTimeout(r, 500))
  }

  // sort by upvotes descending
  results.sort((a, b) => b.upvotes - a.upvotes)

  const lines = [
    `Reddit Top Posts — ${now.toUTCString()}`,
    `Subreddits: ${SUBREDDITS.map(s => `r/${s}`).join(', ')}`,
    `Filter: text posts only, 50+ upvotes, last 24 hours`,
    `Total: ${results.length} posts`,
    ``,
    `========================================`,
    ``,
  ]

  for (const post of results) {
    lines.push(post.title)
    lines.push(`Subreddit: r/${post.subreddit}`)
    lines.push(`Upvotes: ${post.upvotes.toLocaleString()}`)
    lines.push(`Posted: ${post.created.toUTCString()}`)
    lines.push(`Link: ${post.url}`)
    lines.push(``)
    lines.push(`----------------------------------------`)
    lines.push(``)
  }

  const fs = require('fs')
  const path = require('path')
  const outPath = path.join(__dirname, OUTPUT_FILE)
  fs.writeFileSync(outPath, lines.join('\n'))
  console.log(`\nSaved ${results.length} posts to ${OUTPUT_FILE}`)
}

main().catch(err => { console.error(err); process.exit(1) })
