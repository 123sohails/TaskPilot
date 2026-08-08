const axios = require("axios");

// Using Groq API (can also use OpenAI)
const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Summarize GitHub issue
 */
async function summarizeGitHubIssue(issueData) {
  try {
    const prompt = `Summarize the following GitHub issue in 2-3 sentences:
    
Title: ${issueData.title}
Body: ${issueData.body || "No description provided"}
Author: ${issueData.user?.login || "Unknown"}
Labels: ${issueData.labels?.map((l) => l.name).join(", ") || "None"}

Focus on the main problem and what needs to be done.`;

    const response = await callAI(prompt);
    return response;
  } catch (error) {
    throw new Error(`Failed to summarize GitHub issue: ${error.message}`);
  }
}

/**
 * Classify Gmail email
 */
async function classifyGmailEmail(emailData) {
  try {
    const prompt = `Classify the following email into one of these categories: 
- Work
- Personal
- Promotional
- Important
- Spam

Subject: ${emailData.subject}
From: ${emailData.from}
Body: ${emailData.body || "No body provided"}

Return only the category name.`;

    const response = await callAI(prompt);
    return response.trim();
  } catch (error) {
    throw new Error(`Failed to classify Gmail email: ${error.message}`);
  }
}

/**
 * Make AI-powered workflow decision
 */
async function makeWorkflowDecision(context, options) {
  try {
    const prompt = `Based on the following context, choose the best action:

Context: ${JSON.stringify(context)}

Available options:
${options.map((opt, i) => `${i + 1}. ${opt}`).join("\n")}

Return only the option number (1-${options.length}).`;

    const response = await callAI(prompt);
    const choice = parseInt(response.trim()) - 1;

    if (choice < 0 || choice >= options.length) {
      throw new Error("Invalid AI response");
    }

    return options[choice];
  } catch (error) {
    throw new Error(`Failed to make workflow decision: ${error.message}`);
  }
}

/**
 * Analyze text before passing to next step
 */
async function analyzeText(text, analysisType = "general") {
  try {
    const prompts = {
      general: `Analyze the following text and provide key insights:\n${text}`,
      sentiment: `Analyze the sentiment of the following text (positive, negative, or neutral):\n${text}`,
      keywords: `Extract the main keywords from the following text:\n${text}`,
    };

    const prompt = prompts[analysisType] || prompts.general;
    const response = await callAI(prompt);
    return response;
  } catch (error) {
    throw new Error(`Failed to analyze text: ${error.message}`);
  }
}

/**
 * Analyze GitHub webhook event
 */
async function analyzeGitHubEvent(payload) {
  try {
    const eventType = payload.action || 'push';
    const repository = payload.repository?.full_name || 'unknown';
    const sender = payload.sender?.login || 'unknown';
    
    let contentSummary = '';
    if (payload.issue) {
      contentSummary = `Issue: ${payload.issue.title}\nBody: ${payload.issue.body || 'No description'}`;
    } else if (payload.pull_request) {
      contentSummary = `PR: ${payload.pull_request.title}\nBody: ${payload.pull_request.body || 'No description'}`;
    } else if (payload.commits) {
      contentSummary = `Commits: ${payload.commits.map(c => c.message).join(', ')}`;
    }

    const prompt = `Analyze this GitHub webhook event:
Event Type: ${eventType}
Repository: ${repository}
Sender: ${sender}
Content: ${contentSummary}

Extract and return as JSON:
{
  "eventType": "issue_created|issue_closed|pr_opened|push|other",
  "severity": "low|medium|high|critical",
  "category": "bug|feature|documentation|question|other",
  "summary": "2-3 sentence summary",
  "actionItems": ["list of suggested actions"],
  "priority": 1-10
}`;

    const response = await callAI(prompt);
    return response;
  } catch (error) {
    throw new Error(`Failed to analyze GitHub event: ${error.message}`);
  }
}

/**
 * Suggest workflow based on GitHub event analysis
 */
async function suggestGitHubWorkflow(analysis, availableWorkflows) {
  try {
    const workflowDescriptions = availableWorkflows.map(w => 
      `${w.id}: ${w.name} (trigger: ${w.trigger_type})`
    ).join('\n');

    const prompt = `Based on this GitHub event analysis, suggest the best workflow:

Analysis: ${JSON.stringify(analysis)}

Available workflows:
${workflowDescriptions}

Return only the workflow ID that best matches this event. If no workflow matches, return "none".`;

    const response = await callAI(prompt);
    const workflowId = response.trim();
    
    if (workflowId === 'none' || !availableWorkflows.find(w => w.id === workflowId)) {
      return null;
    }
    
    return workflowId;
  } catch (error) {
    throw new Error(`Failed to suggest GitHub workflow: ${error.message}`);
  }
}

/**
 * Extract action items from email
 */
async function extractActionItems(emailData) {
  try {
    const prompt = `Extract action items from this email:
Subject: ${emailData.subject}
From: ${emailData.from}
Body: ${emailData.body || 'No body'}

Return as JSON:
{
  "actionItems": ["list of action items"],
  "deadlines": ["list of deadlines mentioned"],
  "priorities": ["urgent|normal|low for each action"],
  "peopleMentioned": ["list of people mentioned"],
  "urgency": "urgent|normal|low"
}`;

    const response = await callAI(prompt);
    return response;
  } catch (error) {
    throw new Error(`Failed to extract action items: ${error.message}`);
  }
}

/**
 * Suggest workflow based on email classification
 */
async function suggestEmailWorkflow(classification, actionItems, availableWorkflows) {
  try {
    const workflowDescriptions = availableWorkflows.map(w => 
      `${w.id}: ${w.name} (trigger: ${w.trigger_type})`
    ).join('\n');

    const prompt = `Based on this email analysis, suggest the best workflow:

Classification: ${classification}
Action Items: ${JSON.stringify(actionItems)}

Available workflows:
${workflowDescriptions}

Return only the workflow ID that best matches this email. If no workflow matches, return "none".`;

    const response = await callAI(prompt);
    const workflowId = response.trim();
    
    if (workflowId === 'none' || !availableWorkflows.find(w => w.id === workflowId)) {
      return null;
    }
    
    return workflowId;
  } catch (error) {
    throw new Error(`Failed to suggest email workflow: ${error.message}`);
  }
}

/**
 * Generate email response suggestion
 */
async function generateEmailResponse(originalEmail, context) {
  try {
    const prompt = `Generate a professional response to this email:
Original Subject: ${originalEmail.subject}
Original Body: ${originalEmail.body}
Context: ${context}

Keep it concise, professional, and helpful. Return only the response body.`;

    const response = await callAI(prompt);
    return response;
  } catch (error) {
    throw new Error(`Failed to generate email response: ${error.message}`);
  }
}

/**
 * Generic AI call function
 */
async function callAI(prompt) {
  try {
    if (!GROQ_API_KEY) {
      throw new Error("AI API key not configured");
    }

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant for workflow automation.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    if (error.response) {
      throw new Error(
        `AI API error: ${error.response.status} - ${error.response.data?.error?.message || error.message}`
      );
    }
    throw new Error(`Failed to call AI: ${error.message}`);
  }
}

module.exports = {
  summarizeGitHubIssue,
  classifyGmailEmail,
  makeWorkflowDecision,
  analyzeText,
  analyzeGitHubEvent,
  suggestGitHubWorkflow,
  extractActionItems,
  suggestEmailWorkflow,
  generateEmailResponse,
};
