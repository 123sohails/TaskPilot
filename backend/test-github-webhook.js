const crypto = require('crypto');

// Configuration
const WEBHOOK_SECRET = 'test_secret_123'; // This should match your GITHUB_WEBHOOK_SECRET
const WEBHOOK_URL = 'http://localhost:5000/webhooks/github';

// Simulate a GitHub push event
const githubPushPayload = {
  ref: 'refs/heads/main',
  before: 'a1b2c3d4e5f6',
  after: 'f6e5d4c3b2a1',
  repository: {
    id: 123456789,
    name: 'test-repo',
    full_name: 'testuser/test-repo',
    owner: {
      login: 'testuser',
    },
  },
  pusher: {
    name: 'testuser',
    email: 'testuser@example.com',
  },
  commits: [
    {
      id: 'f6e5d4c3b2a1',
      message: 'Test commit for webhook',
      timestamp: new Date().toISOString(),
    },
  ],
};

// Generate signature
const payloadString = JSON.stringify(githubPushPayload);
const signature = `sha256=${crypto
  .createHmac('sha256', WEBHOOK_SECRET)
  .update(payloadString)
  .digest('hex')}`;

console.log('Testing GitHub Webhook...');
console.log('URL:', WEBHOOK_URL);
console.log('Signature:', signature);
console.log('Payload:', JSON.stringify(githubPushPayload, null, 2));

// Send webhook
fetch(WEBHOOK_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-GitHub-Event': 'push',
    'X-GitHub-Delivery': '12345678-1234-1234-1234-123456789012',
    'X-Hub-Signature-256': signature,
  },
  body: payloadString,
})
  .then((response) => response.json())
  .then((data) => {
    console.log('✅ Webhook Response:', data);
  })
  .catch((error) => {
    console.error('❌ Webhook Error:', error);
  });
