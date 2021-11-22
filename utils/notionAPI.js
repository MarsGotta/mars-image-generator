const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_KEY });

exports.notionAPI = async function () {
    const databaseId = process.env.NOTION_DATABASE_ID;
    const response = await notion.databases.query({ database_id: databaseId, sorts: [
        {
            property: 'Title',
            direction: 'ascending',
        },
      ],
      page_size: 3 
    });

    return response.results;
}