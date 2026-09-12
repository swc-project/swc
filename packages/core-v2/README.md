# `@swc/core` v2 preview

This private workspace package is the source for `@swc/core@next`. It intentionally has a
different local name so v1 and v2 can be developed together in the same pnpm workspace. Release
staging changes the package name to `@swc/core` only after the workspace build has completed.

The v2 API does not export the legacy `bundle`, `print`, or `printSync` entry points.
