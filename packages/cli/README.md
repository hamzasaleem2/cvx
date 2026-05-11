# cvx

[![npm](https://img.shields.io/npm/v/@hamzasaleemorg/cvx?color=3fb950&label=)](https://www.npmjs.com/package/@hamzasaleemorg/cvx)

A terminal-native Convex component catalog — for humans and AI agents.

## Install

```bash
npm install -g @hamzasaleemorg/cvx
```

## CLI

```bash
cvx                    # fuzzy-find any component
cvx better-auth        # jump straight to a component
cvx list               # browse all by category
cvx list -c Auth       # filter by category
```

## MCP Server

Start an MCP server for AI agents (Claude, Cursor, Cline, etc.):

```bash
cvx mcp
```

Configure your AI tool:

```json
{
  "mcpServers": {
    "cvx": {
      "command": "cvx",
      "args": ["mcp"]
    }
  }
}
```

Agents get access to `search_components`, `get_component`, `get_install`.
