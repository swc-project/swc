# Deno compiler snapshots

This fixture compiles the original 73 TypeScript sources sequentially using the
same parser, helper, and source-map settings as the former ignored concurrency
test. The sources and emitted code are unchanged. This fixture checks compiler
output; it does not execute the upstream Deno runtime tests described in the
input directory's README.
