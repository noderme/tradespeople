#!/usr/bin/env node

const OUTPUT_FILE = 'karma-posts.md'
const MIN_UPVOTES = 100
const TWENTY_FOUR_HOURS = 60 * 60 * 24

async function fetchPopularPosts() {
  const url = `https://www.reddit.com/r/popular/top.json?t=day&limit=100`
  const res = await fetch(url, { headers: { 'User-Agent': 'karma-scraper/1.0' } })
  if (!res.ok) throw new Error(`Failed to fetch r/popular: ${res.status}`)
  const json = await res.json()
  return json.data.children.map(c => c.data)
}

async function main() {
  const now = new Date()

  process.stdout.write('Fetching r/popular...')
  const posts = await fetchPopularPosts()

  const results = posts
    .filter(p => {
      const age = Date.now() / 1000 - p.created_utc
      return age <= TWENTY_FOUR_HOURS && p.score >= MIN_UPVOTES
    })
    .map(p => ({
      subreddit: p.subreddit,
      title: p.title,
      upvotes: p.score,
      url: `https://reddit.com${p.permalink}`,
      created: new Date(p.created_utc * 1000),
    }))
    .sort((a, b) => b.upvotes - a.upvotes)

  console.log(` ${results.length} posts`)

  const lines = [
    `# r/popular — Top Posts`,
    ``,
    `**Generated:** ${now.toUTCString()}  `,
    `**Filter:** 100+ upvotes, last 24 hours  `,
    `**Total:** ${results.length} posts`,
    ``,
    `---`,
    ``,
  ]

  for (const post of results) {
    lines.push(`### ${post.title}`)
    lines.push(``)
    lines.push(`- **Subreddit:** r/${post.subreddit}`)
    lines.push(`- **Upvotes:** ${post.upvotes.toLocaleString()}`)
    lines.push(`- **Posted:** ${post.created.toUTCString()}`)
    lines.push(`- **Link:** ${post.url}`)
    lines.push(``)
    lines.push(`---`)
    lines.push(``)
  }

  const fs = require('fs')
  const path = require('path')
  fs.writeFileSync(path.join(__dirname, OUTPUT_FILE), lines.join('\n'))
  console.log(`Saved ${results.length} posts to ${OUTPUT_FILE}`)
}

main().catch(err => { console.error(err); process.exit(1) })
