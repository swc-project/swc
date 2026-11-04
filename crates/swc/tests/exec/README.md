# Compiler execution fixtures

`tests/exec.rs` runs compiler, Babel, TypeScript semantic, and native async
fixtures through the same pipeline. Each `exec.js`, `exec.mjs`, or `exec.ts` is
the input. The runner loads its complete `.swcrc` once through the compiler's
configuration loader, compiles the input for each configuration in the execution
matrix, and executes the emitted code with Node. No generated code snapshot is
required.

The default matrix covers ten targets, from ESNext through ES5, combined with
minification, external helpers, and inline source maps enabled and disabled:
80 configurations per fixture. The matrix supplies the parser, module format,
target, helper mode, and minification options as API options; other settings from
`.swcrc` remain active. Both compression and mangling are enabled for the
minified rows; non-minified rows explicitly disable them, regardless of file
configuration. Source maps are explicitly enabled or disabled as well.
TypeScript inputs enable decorators. `.mjs` matrix outputs run as ES modules;
other matrix outputs run as CommonJS.

`env` and `jsc.target` cannot be active together. Explicit target rows select
`jsc.target` without changing the file. A fixture with `env` also runs eight
environment rows, selecting the file's `env` instead of `jsc.target`, with the
same minification, helper, and source map combinations.

Every fixture with a `.swcrc` additionally compiles and executes the file
configuration once, including its detailed minifier options, parser, module
format, helpers, and source maps. If both `env` and `jsc.target` are present, this
execution selects `env`, which supplies its own lowering targets. The configured
module format determines Node's execution mode; missing module configuration
uses ES modules for `.mjs` and CommonJS otherwise.

Configuration lookup and path resolution happen before matrix expansion. The
resulting full configuration is passed as API options with `swcrc: false` to
avoid reloading the file and undoing the target/environment choice. Original
`.swcrc` files are preserved without removing any fields.

Before running the matrix, the runner executes the original input as an ES
module, then as CommonJS if needed, to obtain the expected stdout. If neither
works, it compiles a reference with the TypeScript parser, decorators enabled,
an ES2022 target, and define semantics for class fields, then executes that
reference. TypeScript references use CommonJS output. Reference compilation
remains independent of the `.swcrc` under test, preserving the previous runner's
reference behavior instead of applying the same configuration to both sides of
the comparison.

Each execution injects `expect`. Tests must exit successfully and produce exactly
the reference stdout, preserving both assertions and observable side effects.

The nearest `exec.json` in the input's directory or an ancestor can configure
execution policy independently of `.swcrc`:

- `targets`: a nonempty array restricting the target matrix. Native async
  fixtures use `["es2017"]` to retain their eight configurations, covering async
  iteration lowering with compression, mangling, helpers, and source maps.
- `reference`: compiler configuration overrides for the fallback reference.
  The class-field assignment fixtures set
  `jsc.transform.useDefineForClassFields` to `false`, preserving the original
  reference semantics without depending on directory names.

`exec.json` is test metadata, not a compiler configuration file. The first one
found is used as a whole; ancestor files are not merged. Fixtures without one
use the defaults. Existing hidden fixtures remain ignored, and a successful
explicit run of an ignored fixture keeps the existing automatic unignore
behavior. A failed baseline reports an error without deleting its input.

The previous runner left `Options.swcrc` at its Rust default of `false` and only
read `useDefineForClassFields` manually. Full configuration loading now also
exercises previously inactive settings. Those settings can change emitted code;
the original runtime assertions and reference stdout remain the oracle for every
matrix and configured execution.
