const dotenv = require('dotenv')
const { getUserRepositories, getUserTotalCommits, validateGitHubUsername } = require('./src/lib/github')

// Load environment variables
dotenv.config({ path: './.env.local' })

async function logTest(title, test) {
  console.log(`\n=== ${title} ===`)
  try {
    const result = await test
    console.log('Success:', JSON.stringify(result, null, 2))
    return result
  } catch (error) {
    console.log('Error:', error.message)
    // Return undefined for unsuccessful tests
    return undefined
  }
}

async function main() {
  console.log('Starting GitHub Service Tests...')

  // Test 1: getUserRepositories with valid username
  const validRepos = await logTest('Test 1: getUserRepositories with valid username (renovamen1)', getUserRepositories('renovamen1'))
  console.log('Response structure check:', validRepos ? `Array of ${validRepos.length} repositories with keys: ${Object.keys(validRepos[0] || {})}` : 'No data')

  // Test 2: getUserRepositories with invalid username
  await logTest('Test 2: getUserRepositories with invalid username', getUserRepositories('invalid-user-12345'))

  // Test 3: getUserTotalCommits with username
  const totalCommits = await logTest('Test 3: getUserTotalCommits with username (renovamen1)', getUserTotalCommits('renovamen1'))
  console.log('Response structure check:', typeof totalCommits === 'number' ? `Number: ${totalCommits}` : 'Not a number')

  // Test 4: Rate limit handling - make multiple requests quickly
  console.log('\n=== Test 4: Rate Limit Handling ===')
  const requests = []
  for (let i = 0; i < 110; i++) {
    requests.push(getUserRepositories('renovamen1').catch(() => null)) // Ignore errors for rate limit test
  }
  const results = await Promise.all(requests)
  console.log(`Made ${results.length} requests. Successful: ${results.filter(r => r !== null).length}, Failed: ${results.filter(r => r === null).length}`)

  // Validate username
  const valid = await validateGitHubUsername('renovamen1')
  console.log(`Username 'renovamen1' is valid: ${valid}`)

  const invalid = await validateGitHubUsername('invalid-user-12345')
  console.log(`Username 'invalid-user-12345' is valid: ${invalid}`)
}

main().catch(console.error)
