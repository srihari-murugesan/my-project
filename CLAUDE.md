# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

```bash
# Development
npm run dev                    # Start dev server with Turbopack (http://localhost:3000)
npm run dev:daemon            # Start dev server in background (logs to logs.txt)

# Building & Running
npm run build                 # Build for production
npm start                     # Run production server

# Code Quality
npm run lint                  # Run ESLint (Next.js config)

# Testing
npm test                      # Run tests with Vitest
npm test -- --watch          # Run tests in watch mode
npm test src/path/**/*.test.tsx  # Run specific test file

# Database
npm run setup                 # Install deps, generate Prisma client, run migrations
npm run db:reset              # Reset database (destructive)
npx prisma migrate dev        # Create and run new migrations
npx prisma studio            # Open Prisma Studio UI for database inspection
```

## Project Architecture

**UIGen** is an AI-powered React component generator with live preview. Users describe components in chat, Claude generates them using the Vercel AI SDK with Anthropic's Claude model, and components are previewed/edited live.

### High-Level Structure

**Frontend (React/Next.js 15)**
- `src/app/` — App Router pages and API routes
  - `page.tsx` — Home/auth entry point; redirects authenticated users to their project
  - `[projectId]/page.tsx` — Project editor workspace
  - `api/chat/route.ts` — Chat endpoint that streams AI responses with file editing tools
- `src/components/` — UI components grouped by feature
  - `chat/` — Chat interface (MessageList, MessageInput, ChatInterface, MarkdownRenderer)
  - `editor/` — Code editor (CodeEditor, FileTree)
  - `preview/` — Component preview frame
  - `auth/` — Authentication UI (SignUpForm, SignInForm, AuthDialog)
  - `ui/` — Radix UI + Tailwind primitives (button, input, dialog, tabs, etc.)
- `src/lib/` — Core business logic
  - `file-system.ts` — VirtualFileSystem class that mimics a file tree in memory (no disk writes)
  - `contexts/` — React contexts for chat and file system state
  - `tools/` — AI SDK tool definitions (`str-replace.ts`, `file-manager.ts`)
  - `prompts/generation.tsx` — System prompt for component generation
  - `transform/jsx-transformer.ts` — JSX parsing/transformation utilities
  - `auth.ts` — Authentication (JWT sessions using jose, bcrypt for passwords)
  - `prisma.ts` — Prisma client singleton
- `src/actions/` — Next.js Server Actions for database operations
  - `get-project.ts`, `create-project.ts`, `get-projects.ts`, `index.ts` (exports `getUser`)

**Database (SQLite + Prisma)**
- `User` — Email, hashed password, projects
- `Project` — Name, userId, serialized messages (chat history), serialized data (file system state)

### Key Patterns

**Virtual File System**
- Components don't write to disk. The VirtualFileSystem class manages an in-memory file tree (`FileNode` tree).
- Files are serialized to JSON and stored in the `Project.data` field.
- AI tools (`str_replace_editor`, `file_manager`) manipulate the VirtualFileSystem directly.

**AI Integration**
- Uses Vercel AI SDK (`ai@4.3.16`) with Anthropic provider (`@ai-sdk/anthropic`).
- Endpoint: `src/app/api/chat/route.ts` — streams `streamText()` with tool-calling enabled.
- Tools allow Claude to create/edit files and manage the file tree within a single message.
- If `ANTHROPIC_API_KEY` is missing, a mock provider returns static code.
- Uses `cacheControl: { type: "ephemeral" }` on system message (Anthropic's prompt caching).

**Authentication**
- JWT-based sessions (no cookies). Tokens stored in HTTP-only cookies.
- Users can sign up, sign in, or use the app anonymously.
- Server Actions (`getUser()`, `getSession()`) check authentication before DB operations.

**State Management**
- Chat state: `src/lib/contexts/chat-context.tsx`
- File system state: `src/lib/contexts/file-system-context.tsx`
- Both are client-side contexts; the server persists via `Project` record on each AI message.

## Testing

- **Framework**: Vitest + @testing-library (React, DOM)
- **Config**: `vitest.config.mts` — jsdom environment, vite-tsconfig-paths plugin
- **Test files**: Colocated with `__tests__` folders (e.g., `src/components/chat/__tests__/ChatInterface.test.tsx`)
- **Coverage**: Chat components, file system logic, JSX transformer, contexts

## Important Details

- **TypeScript paths**: `@/*` resolves to `src/*` (configured in `tsconfig.json`)
- **Prisma client location**: Generated to `src/generated/prisma/` (not node_modules)
- **Turbopack**: Dev server uses Turbopack for faster builds
- **Tailwind v4**: Using PostCSS integration (`@tailwindcss/postcss`)
- **Next.js Middleware**: `src/middleware.ts` handles auth checks for protected API routes
- **node-compat.cjs**: Required for production builds/start (loaded via NODE_OPTIONS); handles Node polyfills

## Development Best Practices

- **Comments**: Use sparingly—only for complex logic that isn't self-evident from the code. Prefer clear variable/function names and straightforward implementations over explanatory comments.
- **Code clarity**: Prioritize readable, straightforward code over clever solutions. Self-documenting code is better than commenting complex tricks.
- **No over-engineering**: Don't add features, error handling, or abstractions that aren't needed yet. Build for the current requirements, not hypothetical future ones.
