import { Octokit } from '@octokit/rest'
import { Repository, GitHubCommit } from '../types'

const token = process.env.GITHUB_ACCESS_TOKEN
const octokit = token ? new Octokit({ auth: token }) : new Octokit()

// Log authentication status
console.log(`🔑 GitHub API ${token ? 'authenticated' : 'unauthenticated'} (${token ? '5000 req/hour' : '60 req/hour'})`)

// Helper function for retry logic
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error

      // Check if it's a rate limit error
      if (error.status === 403) {
        // Check for rate limit in the error message
        if (error.message?.includes('rate limit exceeded')) {
          console.log(`❌ GitHub API rate limit exceeded (authenticated: ${!!token})`)
          console.log(`💡 Authenticated requests: 5000/hour, Unauthenticated: 60/hour`)
          console.log(`🔧 In production: implement user-specific tokens or caching`)

          // Re-throw immediately - with personal token this shouldn't happen in dev
          throw error
        }
        throw error // Re-throw non-rate-limit 403 errors
      }

      if (attempt > maxRetries) throw error

      // Exponential backoff for other errors
      const delay = baseDelay * Math.pow(2, attempt - 1)
      console.log(`Attempt ${attempt} failed, retrying in ${delay}ms:`, error.message)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError!
}

export async function getUserRepositories(username: string): Promise<Repository[]> {
  console.log(`🚀 Fetching repositories for @${username}`)
  return retryWithBackoff(async () => {
    const repos: Repository[] = []
    let page = 1
    let hasMore = true

    while (hasMore) {
      const response = await octokit.repos.listForUser({
        username,
        visibility: 'public',
        per_page: 30, // Reduce to 30 per page for fewer API calls
        page,
      })

      console.log(`📦 Page ${page}: Found ${response.data.length} repositories for @${username}`)

      repos.push(
        ...response.data.map((repo: any) => ({
          name: repo.name,
          description: repo.description || undefined,
          language: repo.language || undefined,
          updated_at: repo.updated_at || '',
        }))
      )

      hasMore = response.data.length === 30 && page < 5 // Limit to prevent excessive API calls
      page++
    }

    console.log(`✅ Total repositories found for @${username}: ${repos.length}`)
    return repos
  })
}

export async function getRepositoryCommits(
  owner: string,
  repo: string,
  since?: Date
): Promise<GitHubCommit[]> {
  return retryWithBackoff(async () => {
    const response = await octokit.repos.listCommits({
      owner,
      repo,
      since: since?.toISOString(),
    })

    return response.data.map(commit => ({
      sha: commit.sha,
      message: commit.commit.message,
      author: {
        name: commit.commit.author?.name || '',
        email: commit.commit.author?.email || '',
      },
      date: new Date(commit.commit.author?.date || ''),
    }))
  })
}

export async function getUserTotalCommits(username: string, since?: Date): Promise<number> {
  const repos = await getUserRepositories(username)

  const commitPromises = repos.map(repo =>
    getRepositoryCommits(username, repo.name, since)
      .then(commits => commits.length)
      .catch(() => 0) // Skip errors, count as 0
  )

  const commitCounts = await Promise.all(commitPromises)
  return commitCounts.reduce((total, count) => total + count, 0)
}

export async function getRepositoryCommitCount(
  owner: string,
  repo: string,
  since?: Date
): Promise<number> {
  try {
    const commits = await getRepositoryCommits(owner, repo, since)
    return commits.length
  } catch (error) {
    console.log(`⚠️ Could not get commit count for ${owner}/${repo}:`, error instanceof Error ? error.message : 'Unknown error')
    return 0
  }
}

export async function getUserTotalCommitsFromEvents(username: string, since?: Date): Promise<number> {
  console.log(`📊 Getting total commits for @${username} using Events API (since ${since?.toISOString() || 'beginning'})`)

  return retryWithBackoff(async () => {
    let totalCommits = 0
    let page = 1
    let hasMore = true
    const maxPages = 10 // Limit to prevent excessive API calls

    while (hasMore && page <= maxPages) {
      const response = await octokit.activity.listEventsForAuthenticatedUser({
        username,
        per_page: 100,
        page,
      })

      if (response.data.length === 0) break

      // Count only PushEvents (which represent commits)
      const pushEvents = response.data.filter(event => event.type === 'PushEvent')

      for (const event of pushEvents) {
        // Skip events before the 'since' date if provided
        if (since && event.created_at && new Date(event.created_at) < since) continue

        // PushEvent has a payload with commits
        const pushPayload = event.payload as any
        if (pushPayload.commits && Array.isArray(pushPayload.commits)) {
          totalCommits += pushPayload.commits.length
        }
      }

      hasMore = response.data.length === 100
      page++
    }

    console.log(`✅ Found ${totalCommits} total commits for @${username} via Events API`)
    return totalCommits
  })
}

export async function validateGitHubUsername(username: string): Promise<boolean> {
  try {
    const response = await octokit.users.getByUsername({ username })
    console.log(`✅ GitHub user @${username} exists`)
    return true
  } catch (error: any) {
    console.log(`❌ GitHub user @${username} validation failed:`, error.status, error.message)
    return false
  }
}
