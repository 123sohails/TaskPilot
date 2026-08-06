const { Client } = require("@notionhq/client");

const notionToken = process.env.NOTION_TOKEN;

const notion = new Client({
  auth: notionToken,
});

/**
 * Create a Notion page
 */
async function createPage(config, data) {
  try {
    const { databaseId, title, content } = {
      ...config,
      ...data,
    };

    const response = await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: {
        title: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
      },
      children: content
        ? [
            {
              object: "block",
              type: "paragraph",
              paragraph: {
                rich_text: [
                  {
                    type: "text",
                    text: {
                      content: content,
                    },
                  },
                ],
              },
            },
          ]
        : undefined,
    });

    return {
      success: true,
      pageId: response.id,
      pageUrl: response.url,
    };
  } catch (error) {
    throw new Error(`Failed to create Notion page: ${error.message}`);
  }
}

/**
 * Get Notion page details
 */
async function getPage(pageId) {
  try {
    const response = await notion.pages.retrieve({
      page_id: pageId,
    });

    return response;
  } catch (error) {
    throw new Error(`Failed to get Notion page: ${error.message}`);
  }
}

/**
 * Update Notion page
 */
async function updatePage(pageId, updates) {
  try {
    const response = await notion.pages.update({
      page_id: pageId,
      properties: updates,
    });

    return {
      success: true,
      pageId: response.id,
      pageUrl: response.url,
    };
  } catch (error) {
    throw new Error(`Failed to update Notion page: ${error.message}`);
  }
}

/**
 * Append content to Notion page
 */
async function appendContent(pageId, content) {
  try {
    const response = await notion.blocks.children.append({
      block_id: pageId,
      children: [
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: content,
                },
              },
            ],
          },
        },
      ],
    });

    return {
      success: true,
      blockId: response.results[0]?.id,
    };
  } catch (error) {
    throw new Error(`Failed to append content to Notion page: ${error.message}`);
  }
}

/**
 * Query Notion database
 */
async function queryDatabase(databaseId, filter = {}) {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter,
    });

    return response.results;
  } catch (error) {
    throw new Error(`Failed to query Notion database: ${error.message}`);
  }
}

/**
 * Search Notion
 */
async function search(query) {
  try {
    const response = await notion.search({
      query,
    });

    return response.results;
  } catch (error) {
    throw new Error(`Failed to search Notion: ${error.message}`);
  }
}

/**
 * Setup Notion webhook (via integration settings)
 */
async function setupWebhook() {
  try {
    // Notion webhooks are configured via integration settings
    // This is a placeholder for the setup process
    return {
      success: true,
      message: "Notion webhooks are configured via integration settings at https://www.notion.so/my-integrations",
    };
  } catch (error) {
    throw new Error(`Failed to setup Notion webhook: ${error.message}`);
  }
}

module.exports = {
  createPage,
  getPage,
  updatePage,
  appendContent,
  queryDatabase,
  search,
  setupWebhook,
};
