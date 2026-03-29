#!/usr/bin/env node

const SUBREDDITS = ['Plumbing', 'HVAC', 'Electricians', 'Construction']
const MIN_UPVOTES = 10
const OUTPUT_FILE = 'trade-posts.md'
const TWENTY_FOUR_HOURS = 60 * 60 * 24

async function fetchTopPosts(subreddit) {
  const url = `https://www.reddit.com/r/${subreddit}/top.json?t=day&limit=100`
  const res = await fetch(url, { headers: { 'User-Agent': 'trade-scraper/1.0' } })
  if (!res.ok) throw new Error(`Failed to fetch r/${subreddit}: ${res.status}`)
  const json = await res.json()
  return json.data.children.map(c => c.data)
}

async function main() {
  const now = new Date()
  const results = []

  for (const sub of SUBREDDITS) {
    process.stdout.write(`Fetching r/${sub}...`)
    try {
      const posts = await fetchTopPosts(sub)
      const filtered = posts.filter(p => {
        const age = Date.now() / 1000 - p.created_utc
        return age <= TWENTY_FOUR_HOURS && p.score >= MIN_UPVOTES
      })
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
    await new Promise(r => setTimeout(r, 500))
  }

  results.sort((a, b) => b.upvotes - a.upvotes)

  const lines = [
    `Trade Subreddits — Top Posts`,
    `Generated: ${now.toUTCString()}`,
    `Subreddits: ${SUBREDDITS.map(s => `r/${s}`).join(', ')}`,
    `Filter: 10+ upvotes, last 24 hours`,
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
  fs.writeFileSync(path.join(__dirname, OUTPUT_FILE), lines.join('\n'))
  console.log(`\nSaved ${results.length} posts to ${OUTPUT_FILE}`)
}

main().catch(err => { console.error(err); process.exit(1) })
