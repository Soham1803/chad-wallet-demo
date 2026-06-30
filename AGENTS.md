<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# TypeScript Type Conventions

1. **Use types instead of interfaces**: All data entities, props, and API signatures must be declared using TypeScript `type` instead of `interface`.
2. **T-Prefix naming convention**: All type declarations must be prefixed with a capital `T` (e.g., `TTokenDetails`, `TActivityFeedProps`).
3. **Placed at the bottom**: All type declarations must be placed at the very bottom of the file, after the main component body implementation.
