
# Style Report MCP Server

This is a MCP server exposing a tool to fetch a style report for the current user.

## Integrating with MCP Clients (Claude Desktop, Cursor, etc.)

To connect this MCP server to a client such as Claude Desktop, use the following configuration format (note the use of `command` and `args`):

```
{
  "mcpServers": {
    "style-report": {
      "command": "npx",
      "args": [
        "tsx",
        "/PATH/TO/may-mcp/may/src/index.ts"
      ],
      "env": {
        "MAY_API_KEY": "[API-KEY]"
      }
    }
  }
}
```

Replace `/PATH/TO/may-mcp/may/src/index.ts` with the actual path to the `index.ts` file in your local repository. You can use the `pwd` command to get the full path.

This will allow Claude Desktop (or Cursor, etc.) to launch your MCP server directly as a subprocess.

### Claude Desktop Configuration File Location

- **macOS:** `~/Library/Application\ Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%/Claude/claude_desktop_config.json`

After updating the configuration file, **restart your MCP client** to apply the changes.

## Usage

Once integrated, use the tool `getStyleReport` from your client to fetch the latest style report for your team. You can do this by asking the client to use the style report server to help with writing a message or some other task. 

## Notes

- This server uses FastMCP v1.22.4, Zod for schema validation, and Axios for HTTP requests.

---

For additional FastMCP documentation, see: https://github.com/punkpeye/fastmcp


## Running the Server

This is not necessary for integrating with an MCP client as clients such as Claude will automatically launch the server as a subprocess. But it may be helpful for debugging. 

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npx ts-node src/index.ts
```