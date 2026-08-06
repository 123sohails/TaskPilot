# TaskPilot Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
- **Type**: Bearer Token (Supabase JWT)
- **Header**: `Authorization: Bearer <token>`

---

## Workflow APIs

### Create Workflow
**POST** `/api/workflows`

Create a new workflow.

**Request Body:**
```json
{
  "name": "GitHub Issue to Notion",
  "description": "Auto-create Notion page when GitHub issue is created",
  "trigger_type": "github_issue_created"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "GitHub Issue to Notion",
  "description": "Auto-create Notion page when GitHub issue is created",
  "trigger_type": "github_issue_created",
  "status": "active",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

---

### Get All Workflows
**GET** `/api/workflows`

Get all workflows for the authenticated user.

**Response (200):**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "name": "GitHub Issue to Notion",
    "description": "Auto-create Notion page when GitHub issue is created",
    "trigger_type": "github_issue_created",
    "status": "active",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### Get Single Workflow
**GET** `/api/workflows/:id`

Get details of a specific workflow.

**Response (200):**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "GitHub Issue to Notion",
  "description": "Auto-create Notion page when GitHub issue is created",
  "trigger_type": "github_issue_created",
  "status": "active",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

---

### Update Workflow
**PUT** `/api/workflows/:id`

Update an existing workflow.

**Request Body:**
```json
{
  "name": "Updated Workflow Name",
  "description": "Updated description",
  "trigger_type": "github_pr_created",
  "status": "inactive"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "Updated Workflow Name",
  "description": "Updated description",
  "trigger_type": "github_pr_created",
  "status": "inactive",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T02:00:00.000Z"
}
```

---

### Delete Workflow
**DELETE** `/api/workflows/:id`

Delete a workflow.

**Response (200):**
```json
{
  "success": true,
  "message": "Workflow deleted successfully"
}
```

---

## Workflow Step APIs

### Add Step to Workflow
**POST** `/api/workflows/:workflowId/steps`

Add a new step to a workflow.

**Request Body:**
```json
{
  "step_order": 1,
  "step_type": "ai_summarize",
  "config": {
    "model": "llama3-70b-8192"
  }
}
```

**Available Step Types:**
- `github_trigger` - GitHub webhook trigger
- `ai_summarize` - AI text summarization
- `ai_classify` - AI email classification
- `ai_decision` - AI-powered decision making
- `notion_create_page` - Create Notion page
- `gmail_send` - Send Gmail
- `github_create_issue` - Create GitHub issue

**Response (201):**
```json
{
  "id": "uuid",
  "workflow_id": "uuid",
  "step_order": 1,
  "step_type": "ai_summarize",
  "config": {
    "model": "llama3-70b-8192"
  },
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

---

### Get Workflow Steps
**GET** `/api/workflows/:workflowId/steps`

Get all steps for a workflow (ordered by step_order).

**Response (200):**
```json
[
  {
    "id": "uuid",
    "workflow_id": "uuid",
    "step_order": 1,
    "step_type": "ai_summarize",
    "config": {
      "model": "llama3-70b-8192"
    },
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "uuid",
    "workflow_id": "uuid",
    "step_order": 2,
    "step_type": "notion_create_page",
    "config": {
      "databaseId": "database-id"
    },
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### Get Single Step
**GET** `/api/workflows/steps/:stepId`

Get details of a specific step.

**Response (200):**
```json
{
  "id": "uuid",
  "workflow_id": "uuid",
  "step_order": 1,
  "step_type": "ai_summarize",
  "config": {
    "model": "llama3-70b-8192"
  },
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

---

### Update Step
**PUT** `/api/workflows/steps/:stepId`

Update a workflow step.

**Request Body:**
```json
{
  "step_order": 2,
  "step_type": "ai_classify",
  "config": {
    "categories": ["Work", "Personal", "Important"]
  }
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "workflow_id": "uuid",
  "step_order": 2,
  "step_type": "ai_classify",
  "config": {
    "categories": ["Work", "Personal", "Important"]
  },
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

---

### Delete Step
**DELETE** `/api/workflows/steps/:stepId`

Delete a workflow step.

**Response (200):**
```json
{
  "success": true,
  "message": "Workflow step deleted successfully"
}
```

---

## Execution APIs

### Run Workflow
**POST** `/api/executions/run/:workflowId`

Execute a workflow and create an execution record.

**Request Body:**
```json
{
  "triggerData": {
    "issueTitle": "Bug in login flow",
    "issueBody": "Users cannot login with Google OAuth",
    "author": "john-doe"
  }
}
```

**Response (201):**
```json
{
  "execution": {
    "id": "uuid",
    "workflow_id": "uuid",
    "status": "pending",
    "started_at": "2024-01-01T00:00:00.000Z",
    "finished_at": null,
    "logs": "{\"message\":\"Execution created\",\"triggerData\":{...}}"
  },
  "workflow": {
    "id": "uuid",
    "name": "GitHub Issue to Notion",
    "trigger_type": "github_issue_created"
  },
  "steps": [
    {
      "id": "uuid",
      "step_order": 1,
      "step_type": "ai_summarize",
      "config": {}
    }
  ]
}
```

---

### Get All Executions
**GET** `/api/executions`

Get all executions for the authenticated user.

**Response (200):**
```json
[
  {
    "id": "uuid",
    "workflow_id": "uuid",
    "status": "completed",
    "started_at": "2024-01-01T00:00:00.000Z",
    "finished_at": "2024-01-01T00:01:00.000Z",
    "logs": "{\"message\":\"Execution completed\"}",
    "workflows": {
      "id": "uuid",
      "name": "GitHub Issue to Notion",
      "trigger_type": "github_issue_created"
    }
  }
]
```

---

### Get Single Execution
**GET** `/api/executions/:id`

Get details of a specific execution.

**Response (200):**
```json
{
  "id": "uuid",
  "workflow_id": "uuid",
  "status": "completed",
  "started_at": "2024-01-01T00:00:00.000Z",
  "finished_at": "2024-01-01T00:01:00.000Z",
  "logs": "{\"message\":\"Execution completed\",\"stepResults\":[...]}",
  "workflows": {
    "id": "uuid",
    "name": "GitHub Issue to Notion",
    "trigger_type": "github_issue_created",
    "user_id": "uuid"
  }
}
```

---

## Error Responses

All endpoints may return error responses:

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Workflow name is required"]
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Route /api/workflows/invalid-id not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Failed to create workflow: Database error"
}
```

---

## Environment Variables

Required environment variables in `.env`:

```env
PORT=5000
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
JWT_SECRET=your-jwt-secret
REDIS_URL=redis://localhost:6379
GITHUB_TOKEN=your-github-token
NOTION_TOKEN=your-notion-token
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=your-google-redirect-uri
GROQ_API_KEY=your-groq-api-key
OPENAI_API_KEY=your-openai-api-key
```

---

## Integration Services

### GitHub Integration
- **Service**: `src/integrations/github/github.service.js`
- **Functions**: `createIssue`, `getIssue`, `addComment`, `closeIssue`, `setupWebhook`

### Gmail Integration
- **Service**: `src/integrations/gmail/gmail.service.js`
- **Functions**: `sendEmail`, `getEmail`, `listEmails`, `getAuthUrl`, `getTokens`

### Notion Integration
- **Service**: `src/integrations/notion/notion.service.js`
- **Functions**: `createPage`, `getPage`, `updatePage`, `appendContent`, `queryDatabase`

### AI Service
- **Service**: `src/services/ai.service.js`
- **Functions**: `summarizeGitHubIssue`, `classifyGmailEmail`, `makeWorkflowDecision`, `analyzeText`

---

## Running the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

**Worker (for queue processing):**
```bash
npm run worker
```

---

## Database Schema

### workflows
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `name` (String)
- `description` (String, Optional)
- `trigger_type` (String)
- `status` (String)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### workflow_steps
- `id` (UUID, Primary Key)
- `workflow_id` (UUID, Foreign Key)
- `step_order` (Integer)
- `step_type` (String)
- `config` (JSONB)
- `created_at` (Timestamp)

### executions
- `id` (UUID, Primary Key)
- `workflow_id` (UUID, Foreign Key)
- `status` (String)
- `started_at` (Timestamp)
- `finished_at` (Timestamp, Optional)
- `logs` (JSONB)
