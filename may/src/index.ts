import { FastMCP } from "fastmcp";
import { z } from "zod";
import axios from "axios";

// Environment variables configuration
const requiredEnvVars = {
  MAY_API_KEY: process.env.MAY_API_KEY,
};
// Validate required environment variables
Object.entries(requiredEnvVars).forEach(([name, value]) => {
  if (!value) throw new Error(`${name} environment variable is required`);
});

const server = new FastMCP({
  name: "style-report",
  version: "1.0.0",
});

const TOOL_DESCRIPTION = `Fetches the style report for the current user.

The style report provides essential context and tone guidance for a wide variety of writing tasks. It should be used whenever generating, editing, or reviewing any written content for a user to ensure the output aligns with the user's preferences and expectations.

This tool must always be used when a user mentions a "style report" or the word "May", but it is also recommended for any user-facing communication, including emails, summaries, explanations, or creative writing.

Examples of usage:
- Before drafting an email or message to a user, fetch the style report to tailor the tone and style appropriately.
- When a user requests a summary or rewrite, use the style report to match their preferred language and formality.
- If a user says, "Can you use my style report?" or mentions "May", always retrieve the style report first to guide your writing.
`;

server.addTool({
  name: "get-style-report",
  description: TOOL_DESCRIPTION,
  parameters: z.object({}),
  execute: async () => {
    const url = `https://app.enduring-labs.com/api/mcp/style-report`;
    try {
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${process.env.MAY_API_KEY}`
        }
      });
      const report = response.data?.report;
      if (report) {
        // Sanitize the report output to remove problematic characters
        const sanitize = (input: string) =>
          input
            .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F\u2028\u2029]/g, "") // Remove control chars, line/para sep
            .replace(
              /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g,
              "",
            ); // Remove unpaired surrogates
            const clean = sanitize(JSON.stringify(report?.reportData ?? {}));
        return clean.slice(0, 10000);
      }
      return `Debug unexpected API output: ${JSON.stringify(response.data)}`;
    } catch (err: any) {
      //throw new Error('Failed to fetch style report: ' + (err?.message || err));
      return `Debug error output: ${JSON.stringify(err)}`;
    }
  },
});

server.start({
  transportType: "stdio",
});
