# cvx

A terminal-native Convex component catalog.

Find, inspect, and install Convex components without leaving your terminal.

## Install

```bash
npm install -g @hamzasaleemorg/cvx
```

Or run directly:

```bash
npx @hamzasaleemorg/cvx
```

## Usage

```bash
cvx                    # fuzzy-find any component
cvx better-auth        # jump straight to a component
cvx list               # browse all components by category
cvx list -c Auth       # filter by category
```

Each component shows description, author, download count, and copy-paste-able
install instructions for both `npm install` and `convex.config.ts`.
