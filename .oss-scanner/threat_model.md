# SWC security audit

SWC is a Rust platform for JavaScript and TypeScript compilation and related
developer tools. Its Rust crates and npm bindings run in downstream build tools.
Memory safety defects in these components can affect applications that embed SWC.

## Security model and scope

Read `/src/SECURITY.md` first. That policy is authoritative if this document
conflicts with it. Audit the current default branch and supported usage of
official SWC crates, npm packages, bindings, and release artifacts.

SWC is a build tool. It does not support processing arbitrary untrusted input
and provides no isolation, resource containment, or sandbox guarantees. Service
operators must provide input validation, isolation, and resource controls.
Exclude findings whose only impact depends on running SWC as an unsupported,
unsandboxed public service for arbitrary untrusted input.

Use malformed source, ASTs, and options to test invariants, but establish practical
confidentiality, integrity, or availability impact in supported usage. Do not
report a caller's violation of an explicitly documented unsafe API precondition
alone. Determine whether safe Rust APIs or official bindings can trigger the
same defect without violating their contracts.

## Audit priorities

Prioritize unsafe code and the callers that establish its safety invariants:

- `crates/swc_allocator`, `crates/swc_arena`, `crates/swc_atoms`, and `crates/hstr`:
  allocation arithmetic, alignment, initialization, ownership, interning,
  lifetimes, and thread safety.
- `crates/swc_common` and parser, compiler, minifier, transform, and codegen paths:
  unchecked indexing, pointer manipulation, string boundaries, AST invariants,
  and safe callers that invalidate unsafe assumptions.
- `bindings`, `crates/swc_native_addon`, and `packages/core`: Rust/JavaScript
  boundary validation, buffer and callback lifetimes, concurrency, and
  serialization. Trace lengths and offsets from public APIs into unsafe code.
- Other project-owned unsafe code, including plugin integration, when a concrete
  supported call path reaches it. Do not assume a dependency is an audit target.

Include reproducible panics, crashes, excessive memory use, and nontermination
with practical availability impact in supported usage. Distinguish normal syntax
errors and ordinary input-proportional resource use from security defects.
Exclude unsupported-version-only findings, reports without practical security
impact, and dependency advisories without a demonstrated impact on SWC.
Check current documentation for known issues and group duplicates by root cause.

## Reproduction environment

The checkout is `/src`. The Dockerfile installs the repository's pinned Rust and
pnpm versions, initializes submodules, prepares preset-env data, builds the core
native Node.js binding and selected Rust crates, and compiles their test targets.
It runs the allocator, arena, and atom tests offline. Cached Cargo dependencies,
Node.js dependencies, and fixtures remain available for focused reproduction.

Use `cargo test --offline --locked -p <crate>` for Rust reproduction. The core
Node.js package is built with `pnpm --dir packages/core build:dev`; its tests are
available through `pnpm --dir packages/core test`. Some broader execution suites
need additional tools or downloads, such as Deno or wasm-pack, which this image
does not install. The image does not validate WebAssembly bindings or non-host
architectures. State any reproduction limits rather than claiming coverage of
those paths.

## Reports

Send all severities privately to `kdy.1997.dev@gmail.com`. Do not open public
issues for vulnerabilities. Include the affected commit and package, minimal
input or safe API sequence, exact offline reproduction command, expected and
actual behavior, root cause, security impact, and relevant preconditions.
For memory safety, provide sanitizer output or another concrete demonstration
when possible. For resource exhaustion, provide input size, timing, and memory
measurements with a bounded reproduction. Derive severity from demonstrated
impact; do not infer code execution from a crash alone. Include a focused
regression test and minimal patch when feasible.
