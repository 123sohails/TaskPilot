const { Octokit } = require("@octokit/rest");

const githubToken = process.env.GITHUB_TOKEN;

const octokit = new Octokit({
  auth: githubToken,
});

/**
 * Handle GitHub trigger (e.g., issue created, PR opened)
 */
async function handleTrigger(config, triggerData) {
  try {
    const { eventType, owner, repo } = config;

    return {
      ...triggerData,
      source: "github",
      eventType,
    };
  } catch (error) {
    throw new Error(`GitHub trigger failed: ${error.message}`);
  }
}

/**
 * Create a GitHub issue
 */
async function createIssue(config, data) {
  try {
    const { owner, repo, title, body } = {
      ...config,
      ...data,
    };

    const response = await octokit.rest.issues.create({
      owner,
      repo,
      title,
      body,
    });

    return {
      success: true,
      issueNumber: response.data.number,
      issueUrl: response.data.html_url,
      issueId: response.data.id,
    };
  } catch (error) {
    throw new Error(`Failed to create GitHub issue: ${error.message}`);
  }
}

/**
 * Get GitHub issue details
 */
async function getIssue(owner, repo, issueNumber) {
  try {
    const response = await octokit.rest.issues.get({
      owner,
      repo,
      issue_number: issueNumber,
    });

    return response.data;
  } catch (error) {
    throw new Error(`Failed to get GitHub issue: ${error.message}`);
  }
}

/**
 * Add comment to GitHub issue
 */
async function addComment(owner, repo, issueNumber, body) {
  try {
    const response = await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body,
    });

    return {
      success: true,
      commentId: response.data.id,
      commentUrl: response.data.html_url,
    };
  } catch (error) {
    throw new Error(`Failed to add comment: ${error.message}`);
  }
}

/**
 * Close GitHub issue
 */
async function closeIssue(owner, repo, issueNumber) {
  try {
    const response = await octokit.rest.issues.update({
      owner,
      repo,
      issue_number: issueNumber,
      state: "closed",
    });

    return {
      success: true,
      issueNumber: response.data.number,
      state: response.data.state,
    };
  } catch (error) {
    throw new Error(`Failed to close issue: ${error.message}`);
  }
}

/**
 * Setup webhook for GitHub repository
 */
async function setupWebhook(owner, repo, webhookUrl, secret) {
  try {
    const response = await octokit.rest.repos.createWebhook({
      owner,
      repo,
      name: "web",
      active: true,
      events: ["issues", "pull_request", "push"],
      config: {
        url: webhookUrl,
        content_type: "json",
        secret: secret,
      },
    });

    return {
      success: true,
      webhookId: response.data.id,
      webhookUrl: response.data.url,
    };
  } catch (error) {
    throw new Error(`Failed to setup webhook: ${error.message}`);
  }
}

module.exports = {
  handleTrigger,
  createIssue,
  getIssue,
  addComment,
  closeIssue,
  setupWebhook,
};
