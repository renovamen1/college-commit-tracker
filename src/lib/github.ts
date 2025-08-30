import { Octokit } from '@octokit/rest'
import { Repository, GitHubCommit } from '../types'

const token = process.env.GITHUB_ACCESS_TOKEN
const octokit = token ? new Octokit({ auth: token }) : new Octokit()

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
      if (error.status === 403 && error.headers?.['x-ratelimit-remaining'] === '0') {
        const resetTime = parseInt(error.headers['x-ratelimit-reset']) * 1000
        const waitTime = resetTime - Date.now()

        console.log(`Rate limit exceeded, waiting ${waitTime}ms until reset.`)
        await new Promise(resolve => setTimeout(resolve, waitTime))
        continue
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
  return retryWithBackoff(async () => {
    const repos: Repository[] = []
    let page = 1
    let hasMore = true

    while (hasMore) {
      const response = await octokit.repos.listForUser({
        username,
        visibility: 'public',
        per_page: 100,
        page,
      })

      repos.push(
        ...response.data.map((repo: any) => ({
          name: repo.name,
          description: repo.description || undefined,
          language: repo.language || undefined,
          updated_at: repo.updated_at || '',
        }))
      )

      hasMore = response.data.length === 100 && page < 10 // Limit to prevent infinite
      page++
    }

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

export async function validateGitHubUsername(username: string): Promise<boolean> {
  try {
    await octokit.users.getByUsername({ username })
    return true
  } catch (error: any) {
    if (error.status === 404) {
      return false
    }
    console.error('Error validating GitHub username:', error.message)
    return false
  }
}
