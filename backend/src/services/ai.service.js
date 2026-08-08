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
        model: "llama-3.1-70b-versatile",
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
};
