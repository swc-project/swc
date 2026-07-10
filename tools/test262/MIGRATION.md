# Official Test262 migration

This document records the repository migration state and the deletion gates for
the frozen `test262-parser-tests` corpus. The conformance architecture and
developer commands are documented in [README.md](README.md).

## Locked scope

- `tc39/test262` is fetched at the full SHA in `upstreams.toml` as a managed,
  shallow checkout. It is not a Git submodule.
- `cargo test262` covers parser/early errors/serde, the compact lexer in
  `swc_ecma_parser`, codegen/fixer, source maps, ES5 transforms, and minifier
  pipelines.
- Runtime conformance uses persistent Node.js workers and a canonical Node.js
  22 reviewed allowlist. It remains an independent monitor workflow.
- `swc_ecma_lexer` is a frozen published compatibility crate. Its existing
  crate-local regression tests remain, but it is not a Test262 target or an
  affected dependency of this runner.
- ESTree conformance is explicitly deferred. No ESTree oracle checkout,
  baseline, suite, or CI input belongs in this migration.
- The existing Terser token-mapping differential remains an independent
  codegen regression. It must not become a Node package dependency of
  `cargo test262`.

## Implemented replacement suites

- [x] Runner crate, Cargo alias, pinned setup/status/update/explain commands.
- [x] Strict metadata parsing, Test262 variant generation, shared parallel
  loader, typed skip policy, deterministic JSON/human reports.
- [x] Revision-bound non-runtime baselines with unexpected-pass detection.
- [x] Parser/early-error/serde and compact lexer suites.
- [x] Normal/minified codegen, fixer AST round-trip and idempotence suites.
- [x] Normal/minified source-map round-trip, bounds, and `sourcesContent`
  checks.
- [x] High-level ES5 transform and compress/compress-mangle suites.
- [x] Persistent runtime worker, module graph, dynamic imports, async `$DONE`,
  negative phases, typed Node feature/host capability reporting, and four
  independent SWC pipelines.
- [x] Related-change non-runtime CI, independent runtime workflow, and manual
  upstream updater.

## Legacy deletion gates

Legacy assets stay frozen until the replacement suite for that contract has
landed in required CI and remained stable. Passing this checklist is required;
the presence of a newer suite alone is not permission to delete diagnostics or
regressions.

### Parser

- [ ] Group the 703 tracked legacy stderr files by typed parser error variant.
- [ ] Move one representative diagnostic fixture per variant, plus meaningful
  EOF/span boundaries and multi-error cases, into `tests/errors`.
- [ ] Preserve named regressions for the historical template, unterminated
  comment, missing brace, multiple assignment, and generic EOF bugs.
- [ ] Delete `crates/swc_ecma_parser/tests/test262.rs` and
  `tests/test262-error-references` only after that audit.
- [ ] Remove only the `is_test262` branches from the shared parser test
  normalizer; keep normalization used by ordinary JS/TS/Flow fixtures.

### Codegen and fixer

- [ ] Audit historical fixes for large numeric literals, ES5/raw strings,
  null escapes, string escaping, trailing commas, templates, comments, and
  Unicode escaping. Extract any uniquely covered bug into a named fixture.
- [ ] Delete the legacy codegen Test262 harness and the `test262` and
  `test262-min` golden directories after the structural replacement is stable.
- [ ] Delete `fixer_test262.rs` and its dedicated ignore/normalizer tables after
  the codegen/fixer replacement is stable.

### Terser mapping differential

- [ ] Replace the legacy corpus input with a small named local fixture set that
  covers members, literals, modules, classes, arrows, comments, Unicode, and
  multiline mappings.
- [ ] Make a missing or failed Terser oracle an explicit test failure instead
  of silently returning success.
- [ ] Include the Node/Terser environment in its cache identity, or disable the
  cache for the small local suite.
- [ ] Report eligible, code-identical, compared, and skipped counts.

### Final submodule removal

- [ ] Confirm no code consumer references `tests/test262-parser`.
- [ ] Remove the gitlink and only its entry from `.gitmodules`.
- [ ] Remove dedicated Prettier/VS Code ignores and stale architecture/crate
  documentation references.
- [ ] Preserve local Test262-derived regression fixtures which do not depend on
  the gitlink.

The legacy deletion is intentionally a later change. Combining it with the
initial runner landing would bypass the stability gate and make regressions
harder to attribute.
