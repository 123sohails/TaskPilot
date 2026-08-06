const { google } = require("googleapis");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

/**
 * Create OAuth2 client for Gmail
 */
function getOAuth2Client(accessToken, refreshToken) {
  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  return oauth2Client;
}

/**
 * Handle Gmail trigger (e.g., new email received)
 */
async function handleTrigger(config, triggerData) {
  try {
    const { eventType } = config;

    return {
      ...triggerData,
      source: "gmail",
      eventType,
    };
  } catch (error) {
    throw new Error(`Gmail trigger failed: ${error.message}`);
  }
}

/**
 * Send an email
 */
async function sendEmail(config, data) {
  try {
    const { to, subject, body, accessToken, refreshToken } = {
      ...config,
      ...data,
    };

    const oauth2Client = getOAuth2Client(accessToken, refreshToken);
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const emailContent = [
      `To: ${to}`,
      `Subject: ${subject}`,
      "",
      body,
    ].join("\r\n");

    const encodedEmail = Buffer.from(emailContent)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedEmail,
      },
    });

    return {
      success: true,
      messageId: response.data.id,
      threadId: response.data.threadId,
    };
  } catch (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

/**
 * Get email details
 */
async function getEmail(accessToken, refreshToken, messageId) {
  try {
    const oauth2Client = getOAuth2Client(accessToken, refreshToken);
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const response = await gmail.users.messages.get({
      userId: "me",
      id: messageId,
      format: "full",
    });

    return response.data;
  } catch (error) {
    throw new Error(`Failed to get email: ${error.message}`);
  }
}

/**
 * List recent emails
 */
async function listEmails(accessToken, refreshToken, maxResults = 10) {
  try {
    const oauth2Client = getOAuth2Client(accessToken, refreshToken);
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults,
    });

    return response.data.messages || [];
  } catch (error) {
    throw new Error(`Failed to list emails: ${error.message}`);
  }
}

/**
 * Setup Gmail webhook (via Pub/Sub)
 */
async function setupWebhook(userId, topicName) {
  try {
    // Gmail uses Google Cloud Pub/Sub for webhook notifications
    // This is a simplified version - actual implementation requires GCP setup
    return {
      success: true,
      message: "Gmail webhook setup requires Google Cloud Pub/Sub configuration",
      userId,
      topicName,
    };
  } catch (error) {
    throw new Error(`Failed to setup Gmail webhook: ${error.message}`);
  }
}

/**
 * Get OAuth authorization URL
 */
function getAuthUrl(state) {
  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  );

  const scopes = ["https://www.googleapis.com/auth/gmail.send"];

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    state,
  });
}

/**
 * Exchange authorization code for tokens
 */
async function getTokens(code) {
  try {
    const oauth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URI
    );

    const { tokens } = await oauth2Client.getToken(code);

    return tokens;
  } catch (error) {
    throw new Error(`Failed to get tokens: ${error.message}`);
  }
}

module.exports = {
  handleTrigger,
  sendEmail,
  getEmail,
  listEmails,
  setupWebhook,
  getAuthUrl,
  getTokens,
};
