# Changelog

## [unreleased]

### Performance

- **(node)** Reduce macOS native addon startup time by using the verified cache directly and skipping APFS recompression while retaining compressed downloads. ([#12436](https://github.com/swc-project/swc/pull/12436)) ([0b151bf](https://github.com/swc-project/swc/commit/0b151bfab3a4507d65a6f888dfda065bbeb6c297))

  **Crates:** `swc_core`

### Testing

- **(es/ast)** Add missing ctxt field to jsx_element serde test ([#12439](https://github.com/swc-project/swc/issues/12439)) ([7dc1796](https://github.com/swc-project/swc/commit/7dc1796987ab886b8f86e37e67da2c72aa734017))

## [1.16.12] - 2026-09-29

### Breaking Changes

- **(es/minifier)** Revert #12384 property and destructuring PURE annotations and `pure_getters` optimization ([#12419](https://github.com/swc-project/swc/pull/12419)) ([763cc20](https://github.com/swc-project/swc/commit/763cc20be690560793ab51c1b7a9014a1e0dfc81))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/module)** Support `moduleRoot` for AMD module IDs. ([#12365](https://github.com/swc-project/swc/pull/12365)) ([5f3645d](https://github.com/swc-project/swc/commit/5f3645ddc15c2cf978fb52bb6eba265e9218410f))

  **Crates:** `swc`, `swc_core`, `swc_ecma_transforms_module`

  Derive AMD module IDs from the input path relative to `moduleRoot`, resolving relative roots against the `.swcrc` directory or programmatic base directory.

  Rust callers must add `module_root` to exhaustive `amd::Config` initializers and pass `base_dir` to `ModuleConfig::get_resolver`. These API changes are also exposed through `swc_core`.

- **(es/preset-env)** Reduce binary size by upgrading browserslist-rs to 0.21.2 with deflate enabled. ([#12381](https://github.com/swc-project/swc/pull/12381)) ([81e0d7d](https://github.com/swc-project/swc/commit/81e0d7d4119a1e45c1750621e8c54558089a5d9b))

  **Crates:** `preset_env_base`, `swc_core`

  The public `BrowserData::parse_versions` API now accepts `browserslist::Distrib` from browserslist-rs 0.21 instead of 0.20, including through the `swc_core::ecma::preset_env` re-export.

- **(html/minifier)** Preserve separate script elements during minification ([#12411](https://github.com/swc-project/swc/pull/12411)) ([aea189d](https://github.com/swc-project/swc/commit/aea189db3a34f8b8c40bca71a0f02780e3131c16))

  **Crates:** `swc_core`, `swc_html_minifier`

### Bug Fixes

- **(binding/node)** Return an error when a file cannot be read instead of panicking ([#12379](https://github.com/swc-project/swc/issues/12379)) ([d342acd](https://github.com/swc-project/swc/commit/d342acdd4d73c69f1f12b4b9963c20b28815045c))

- **(bindings)** Detect macOS ACLs with supported APIs ([#12391](https://github.com/swc-project/swc/issues/12391)) ([a73ea68](https://github.com/swc-project/swc/commit/a73ea68fe2e8cc4d06f95b27dc240d848a41b816))

- **(es/ast)** Fix typo in the `SimpleAssignTarget` AST tag ([#12376](https://github.com/swc-project/swc/pull/12376)) ([96c0927](https://github.com/swc-project/swc/commit/96c0927d72e48d4c25e70ea5769d54df36ad3841))

  **Crates:** `swc_core`, `swc_ecma_ast`

- **(es/ast)** Preserve line endings, Unicode escapes, and unpaired surrogates when decoding template raw values. ([#12347](https://github.com/swc-project/swc/pull/12347)) ([7898152](https://github.com/swc-project/swc/commit/78981525cb1256c3f69a22984b42b5f04b6e51dc))

  **Crates:** `swc_core`, `swc_ecma_ast`

- **(es/codegen)** Minify unicode escapes in template literals ([#12284](https://github.com/swc-project/swc/pull/12284)) ([76ef91c](https://github.com/swc-project/swc/commit/76ef91c5d324e059f3097b08bc35520a64093f24))

  **Crates:** `swc_core`, `swc_ecma_codegen`

- **(es/codegen)** Separate generic type assertion openers ([#12340](https://github.com/swc-project/swc/pull/12340)) ([8948dac](https://github.com/swc-project/swc/commit/8948dac4d4b9598a4a77ff61c884358d0d06a9e8))

  **Crates:** `swc_core`, `swc_ecma_codegen`

- **(es/compat)** Decode raw escapes when lowering ordinary templates whose cooked values are missing. ([#12347](https://github.com/swc-project/swc/pull/12347)) ([7898152](https://github.com/swc-project/swc/commit/78981525cb1256c3f69a22984b42b5f04b6e51dc))

  **Crates:** `swc_core`, `swc_ecma_compat_es2015`, `swc_ecma_transforms_compat`

- **(es/compat)** Preserve array rest when lowering nested object rest. ([#12352](https://github.com/swc-project/swc/pull/12352)) ([9348083](https://github.com/swc-project/swc/commit/93480832352270aeae2624c1729867fd84c11c39))

  **Crates:** `swc_core`, `swc_ecma_transformer`, `swc_ecma_transforms_compat`

- **(es/lexer)** Stop iteration when input is exhausted ([#12388](https://github.com/swc-project/swc/pull/12388)) ([c392686](https://github.com/swc-project/swc/commit/c392686e98fcefc861c47e79fc15158c760738e1))

  **Crates:** `swc_core`, `swc_ecma_lexer`

- **(es/minifier)** Account for shorthand expansion when inlining ([#12428](https://github.com/swc-project/swc/pull/12428)) ([bd4c573](https://github.com/swc-project/swc/commit/bd4c573affb3eeb6f68ce4a4078645abd64fcce2))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Avoid inlining arrows that capture `this` or `super` ([#12409](https://github.com/swc-project/swc/pull/12409)) ([9de48a0](https://github.com/swc-project/swc/commit/9de48a01e5d5dddb2dc286221bc7e155d4e8c81e))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Check eval and arguments usage in var define scope ([#12174](https://github.com/swc-project/swc/issues/12174)) ([5d1aa16](https://github.com/swc-project/swc/commit/5d1aa161d9532f074c4dc3a70e249162250cec36))

- **(es/minifier)** Correct class side-effect detection and sequence optimization ([#12336](https://github.com/swc-project/swc/pull/12336)) ([397e0b6](https://github.com/swc-project/swc/commit/397e0b6f3e59dbf9f52d3c5656ec317d78528c22))

  **Crates:** `swc_core`, `swc_ecma_minifier`, `swc_ecma_utils`

- **(es/minifier)** Do not merge sequences across array spreads ([#12375](https://github.com/swc-project/swc/pull/12375)) ([f145dfe](https://github.com/swc-project/swc/commit/f145dfe1dd92c0b1315ef26ee595cc83aa0ce34c))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Drop unused `Map` and `Set` constructions with array initializers ([#12287](https://github.com/swc-project/swc/pull/12287)) ([d602f58](https://github.com/swc-project/swc/commit/d602f58df03e2c12a0a3dd07de76a46b4c4e04aa))

  **Crates:** `swc`, `swc_core`, `swc_ecma_minifier`, `swc_ecma_transforms_optimization`, `swc_ecma_utils`

- **(es/minifier)** Evaluate String.raw templates using raw quasis ([#12322](https://github.com/swc-project/swc/pull/12322)) ([5f49135](https://github.com/swc-project/swc/commit/5f49135c02699ec3c4b0626bc8f3c10b26e9e3a5))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Exclude object literal prototype setters from Object.keys folding ([#12249](https://github.com/swc-project/swc/pull/12249)) ([8953ee3](https://github.com/swc-project/swc/commit/8953ee37a6803bf22a11bc54ac51ecfbe85a4dad))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Fold local deletes to false ([#12231](https://github.com/swc-project/swc/pull/12231)) ([dcbcf93](https://github.com/swc-project/swc/commit/dcbcf93781c95e9c26cb0276e4ce635aa4774a23))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Fold out-of-range string `codePointAt` calls to `undefined`. ([#12230](https://github.com/swc-project/swc/pull/12230)) ([052592a](https://github.com/swc-project/swc/commit/052592a6acff30f6d8102de696915d72c9a1f223))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Format folded toExponential calls compatibly ([#12257](https://github.com/swc-project/swc/pull/12257)) ([62d8b28](https://github.com/swc-project/swc/commit/62d8b28a71f5f32b2638526c306799fa38943c59))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Keep function and class declarations whose self-reference is dropped ([#12401](https://github.com/swc-project/swc/pull/12401)) ([cd25b14](https://github.com/swc-project/swc/commit/cd25b1466a608b20b90312b18c1a5c9086673c33))

  **Crates:** `swc_core`, `swc_ecma_transforms_optimization`

- **(es/minifier)** Mark properties assigned through destructuring targets as mutated ([#12398](https://github.com/swc-project/swc/pull/12398)) ([42e4f7e](https://github.com/swc-project/swc/commit/42e4f7e98b2c78d708a5b85c7e29365fdce2b213))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Preserve IIFE arguments after dynamic spreads ([#12243](https://github.com/swc-project/swc/pull/12243)) ([924d225](https://github.com/swc-project/swc/commit/924d2250689a8a4b2ebfdbf82610b1d6377f62d9))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Preserve assignment target evaluation order when lifting conditional sequences ([#12253](https://github.com/swc-project/swc/pull/12253)) ([5d703f0](https://github.com/swc-project/swc/commit/5d703f056a05d06ef906d91ac46ce603b415ec6e))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Preserve bodies reachable through constant switch fallthrough ([#12328](https://github.com/swc-project/swc/pull/12328)) ([fe41cd5](https://github.com/swc-project/swc/commit/fe41cd5c4435f9b3f84b772af78cc7eaefa4a51a))

  **Crates:** `swc_ecma_minifier`

- **(es/minifier)** Preserve branch structure when only collapse_vars is enabled ([#12280](https://github.com/swc-project/swc/pull/12280)) ([0239111](https://github.com/swc-project/swc/commit/02391118a058128502d2b2fdddbdcedec96bb797))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Preserve catch assignments before finally ([#12259](https://github.com/swc-project/swc/pull/12259)) ([7a2ca6e](https://github.com/swc-project/swc/commit/7a2ca6ef973c2759674256b01b3ed1689ac53af6))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Preserve catch return evaluation before finally ([#12232](https://github.com/swc-project/swc/pull/12232)) ([191b951](https://github.com/swc-project/swc/commit/191b95170ce6543af291f9ec7c497243a78bfc64))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Preserve class declaration scope in if-return negation ([#12319](https://github.com/swc-project/swc/pull/12319)) ([f568ff2](https://github.com/swc-project/swc/commit/f568ff2fefe8bb76f2d5bbc19cdd946c045ad11b))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Preserve delete operand effects ([#12244](https://github.com/swc-project/swc/pull/12244)) ([d8631aa](https://github.com/swc-project/swc/commit/d8631aae18f0bab0e01f69daff8407035d5715f1))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Preserve destructuring patterns with `/*#__PURE__*/`-annotated initializers ([#12386](https://github.com/swc-project/swc/pull/12386)) ([6ee2384](https://github.com/swc-project/swc/commit/6ee238450e1fd17f24faf5f47dba63d396149921))

  **Crates:** `swc_core`, `swc_ecma_minifier`

  A `/*#__PURE__*/` annotation on the initializer of a destructuring declaration only describes the evaluation of the initializer itself. The pattern still performs property reads, which can invoke getters, and checks the initializer value for nullishness, which can throw. Unused destructuring declarations such as `const { a } = /*#__PURE__*/ x()` are therefore no longer removed. Annotations written directly on a pattern (`const /*#__PURE__*/ { a } = obj`) and unused plain bindings (`const a = /*#__PURE__*/ x()`) keep their previous behavior.

- **(es/minifier)** Preserve effects from visited constant switch case tests ([#12252](https://github.com/swc-project/swc/pull/12252)) ([ca1f943](https://github.com/swc-project/swc/commit/ca1f943495b8e62ed1e94ff937b4ef31b04303c3))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Preserve empty object destructuring errors ([#12276](https://github.com/swc-project/swc/pull/12276)) ([246e615](https://github.com/swc-project/swc/commit/246e6156ca14eaa07243ac8d9aa994c91c95cf3d))

  **Crates:** `swc_core`, `swc_ecma_minifier`, `swc_ecma_transforms_optimization`

- **(es/minifier)** Preserve evaluation order for unary comparison operands ([#12275](https://github.com/swc-project/swc/pull/12275)) ([440fd7f](https://github.com/swc-project/swc/commit/440fd7fb065b823c303f6a9ebb697999e17d3527))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Preserve finalizer breaks in switches ([#12330](https://github.com/swc-project/swc/pull/12330)) ([1156952](https://github.com/swc-project/swc/commit/1156952f67e339de7f9d3954643c71eb63cf76fb))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Preserve iterable consumption for unused `Set` and `Map` ([#12254](https://github.com/swc-project/swc/pull/12254)) ([c28b95f](https://github.com/swc-project/swc/commit/c28b95f0fe32ca0a156402e243ee12b007512c6c))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Preserve let initialization when extracting side effects from unused declarators. ([#12345](https://github.com/swc-project/swc/pull/12345)) ([2ea13bf](https://github.com/swc-project/swc/commit/2ea13bf64310f0739a783806421b0eed7f52f520))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Preserve lexical arguments and super in method parameter defaults ([#12239](https://github.com/swc-project/swc/pull/12239)) ([7446da9](https://github.com/swc-project/swc/commit/7446da9da2e1d38eb3983124ddfdeb574b58656a))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Preserve locally bound roots when applying global definitions ([#12266](https://github.com/swc-project/swc/pull/12266)) ([107af6a](https://github.com/swc-project/swc/commit/107af6a32f554f4cfdde39c61329fbdfba56d8c9))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Preserve nested computed global definitions in update targets ([#12326](https://github.com/swc-project/swc/pull/12326)) ([22518fc](https://github.com/swc-project/swc/commit/22518fc8c511400bc0c80a30987ce761df7cd699))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Preserve parameter initialization in empty IIFEs ([#12268](https://github.com/swc-project/swc/pull/12268)) ([c8a2657](https://github.com/swc-project/swc/commit/c8a2657f9feb65c364bf42f58875a98fb75ebab4))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Preserve repeated nonterminating branches when merging similar if statements ([#12262](https://github.com/swc-project/swc/pull/12262)) ([e608832](https://github.com/swc-project/swc/commit/e608832c9d9ec38642e690a820ffc31e9fcdcb85))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Preserve rest parameters referenced through dynamic scopes ([#12264](https://github.com/swc-project/swc/pull/12264)) ([e222efd](https://github.com/swc-project/swc/commit/e222efddbc87cfc47edcaa142751ef6aede6476e))

  **Crates:** `swc_ecma_minifier`

- **(es/minifier)** Preserve sequence arrow IIFE argument evaluation ([#12258](https://github.com/swc-project/swc/pull/12258)) ([c8eec79](https://github.com/swc-project/swc/commit/c8eec7920501f37d564df17be77b7130a9846ea0))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Preserve signed coercion after unsigned shifts ([#12260](https://github.com/swc-project/swc/pull/12260)) ([e0f3f4e](https://github.com/swc-project/swc/commit/e0f3f4eb6ca111c1246e9e8841b2c994d1c3f333))

  **Crates:** `swc_ecma_minifier`

- **(es/minifier)** Preserve spread iteration in unused builtins ([#12334](https://github.com/swc-project/swc/pull/12334)) ([90d449d](https://github.com/swc-project/swc/commit/90d449d8e4ed19846fd594403172b6a9b5c87a58))

  **Crates:** `swc_ecma_minifier`

- **(es/minifier)** Preserve terminal completions in finally blocks ([#12325](https://github.com/swc-project/swc/pull/12325)) ([eddbd18](https://github.com/swc-project/swc/commit/eddbd18f95ba20186ed9583e7a3d1226947b5781))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Preserve tiny nonzero `toPrecision` calls ([#12246](https://github.com/swc-project/swc/pull/12246)) ([d64acad](https://github.com/swc-project/swc/commit/d64acad31b4ff1e7ad5a7c96d3223dd7591c69aa))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Retain observable unsafe Symbol call arguments ([#12248](https://github.com/swc-project/swc/pull/12248)) ([2611085](https://github.com/swc-project/swc/commit/2611085c57d669f0adbe483a3d8ed6a948540282))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Safely hoist object properties used as callees ([#12183](https://github.com/swc-project/swc/pull/12183)) ([df3f7ab](https://github.com/swc-project/swc/commit/df3f7abb9e719bf7b949d442d0a97e63f5163b53))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Scan all adjacent hoist declaration pairs ([#12335](https://github.com/swc-project/swc/pull/12335)) ([c3e2d35](https://github.com/swc-project/swc/commit/c3e2d3528a3d694b02c404740014144ccbe6e777))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Avoid evaluating shadowed static helpers ([#12247](https://github.com/swc-project/swc/pull/12247)) ([f154b61](https://github.com/swc-project/swc/commit/f154b61208c3767ffd809b86773e2cbad94f2c10))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Drop unused object pattern defaults ([#12176](https://github.com/swc-project/swc/issues/12176)) ([76ac4bd](https://github.com/swc-project/swc/commit/76ac4bdd8574aaec63e5e9c8cae54814153f8e48))

- **(es/minifier)** Preserve Array constructor spread arity ([#12237](https://github.com/swc-project/swc/pull/12237)) ([cfbef85](https://github.com/swc-project/swc/commit/cfbef857b442d1ab4f1257afaab9a9292346bdf8))

  **Crates:** `swc_ecma_minifier`

- **(es/minifier)** Preserve async IIFE return values ([#12269](https://github.com/swc-project/swc/pull/12269)) ([3119b07](https://github.com/swc-project/swc/commit/3119b07e536747f728b3afbb50c9f70c1fcd6537))

  **Crates:** `swc_ecma_minifier`

- **(es/minifier)** Preserve empty array assignment destructuring semantics ([#12250](https://github.com/swc-project/swc/pull/12250)) ([20e9c5f](https://github.com/swc-project/swc/commit/20e9c5fcf8708e09d4c6abf625d1676f851b22a5))

  **Crates:** `swc_core`, `swc_ecma_minifier`, `swc_ecma_parser`

- **(es/minifier)** Preserve indexed arguments reads for reassigned parameters ([#12235](https://github.com/swc-project/swc/pull/12235)) ([5f02d02](https://github.com/swc-project/swc/commit/5f02d02b935626ec03b445116d92e39dd911d8b2))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Preserve optional-chain continuation throws ([#12261](https://github.com/swc-project/swc/pull/12261)) ([c5f381b](https://github.com/swc-project/swc/commit/c5f381b3a66795aec4aebeb98e7f5616f0252f13))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Preserve returns in finalizers ([#12324](https://github.com/swc-project/swc/pull/12324)) ([f7894f5](https://github.com/swc-project/swc/commit/f7894f55a84dcd90bc9b0b13b3f02d0a8d8ef96c))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Preserve shadowed `undefined` yield values ([#12272](https://github.com/swc-project/swc/pull/12272)) ([00da5c1](https://github.com/swc-project/swc/commit/00da5c1d5ec7379213b20e4a82db661a4919fa44))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/parser)** Accept valid declare readonly field initializers ([#12363](https://github.com/swc-project/swc/pull/12363)) ([3668176](https://github.com/swc-project/swc/commit/366817647cf0da46cc296a77b2feca6a1882d733))

  **Crates:** `swc`, `swc_core`, `swc_ecma_parser`

- **(es/parser)** Allow await identifiers in explicit Script parsing ([#12364](https://github.com/swc-project/swc/pull/12364)) ([a2db32d](https://github.com/swc-project/swc/commit/a2db32d65fa1097a40ae5663a3da8aea98cd70b1))

  **Crates:** `swc_core`, `swc_ecma_parser`

- **(es/parser)** Parse optional renamed Flow component parameters ([#12410](https://github.com/swc-project/swc/pull/12410)) ([1dea7a6](https://github.com/swc-project/swc/commit/1dea7a6ec8e1326f49f381a63b1b11932047d54a))

  **Crates:** `swc_core`, `swc_ecma_parser`

- **(es/parser)** Reset inherited static block context for nested functions and instance fields ([#12360](https://github.com/swc-project/swc/pull/12360)) ([e3a33ab](https://github.com/swc-project/swc/commit/e3a33ab99abec735211a65a7fadf249cc2d04a84))

  **Crates:** `swc_core`, `swc_ecma_parser`

- **(es/parser)** Respect line breaks after `declare` ([#12353](https://github.com/swc-project/swc/pull/12353)) ([fe1dfad](https://github.com/swc-project/swc/commit/fe1dfadac8cdea99d52d9bcae1a509a28d426363))

  **Crates:** `swc_core`, `swc_ecma_parser`

- **(es/parser)** Respect line breaks before definite assignment assertions ([#12362](https://github.com/swc-project/swc/pull/12362)) ([505766f](https://github.com/swc-project/swc/commit/505766fdc62e969257d7d17e37e9d631d1766e35))

  **Crates:** `swc_core`, `swc_ecma_parser`

- **(es/parser)** Restore the outer strict context before lexing tokens after a class ([#12361](https://github.com/swc-project/swc/pull/12361)) ([0cb1a67](https://github.com/swc-project/swc/commit/0cb1a675aeb9294114579ff6fd55cf9ef91bf62b))

  **Crates:** `swc_core`, `swc_ecma_parser`

- **(es/parser)** Support optional leading pipes in Flow match patterns ([#12393](https://github.com/swc-project/swc/pull/12393)) ([3c381f4](https://github.com/swc-project/swc/commit/3c381f4f3ba62185410c5e37f0d7f3d00372530d))

  **Crates:** `swc_core`, `swc_ecma_parser`

- **(es/parser)** Allow ambient rest trailing commas ([#12342](https://github.com/swc-project/swc/pull/12342)) ([9362f19](https://github.com/swc-project/swc/commit/9362f192c96a5381256bd2b9e86fe3bafb0407a0))

  **Crates:** `swc_core`, `swc_ecma_parser`

- **(es/parser)** Allow escaped keywords as property names ([#12358](https://github.com/swc-project/swc/pull/12358)) ([478aaee](https://github.com/swc-project/swc/commit/478aaeefab89206fd25f2fd1b5c41213dd7435d6))

  **Crates:** `swc`, `swc_core`, `swc_ecma_parser`

- **(es/parser)** Allow eval and arguments in ambient function declarations ([#12359](https://github.com/swc-project/swc/pull/12359)) ([21b0cba](https://github.com/swc-project/swc/commit/21b0cbafbb744eff936293193e9862b4d2ac6ed0))

  **Crates:** `swc`, `swc_core`, `swc_ecma_parser`

- **(es/parser)** Allow line breaks before enum names ([#12341](https://github.com/swc-project/swc/pull/12341)) ([c594a7c](https://github.com/swc-project/swc/commit/c594a7cd8e99af6f56946b34b86f099d1c8878b3))

  **Crates:** `swc_core`, `swc_ecma_parser`

- **(es/parser)** Allow line breaks before import attributes ([#12356](https://github.com/swc-project/swc/pull/12356)) ([6684de3](https://github.com/swc-project/swc/commit/6684de3b06f101636b2e3dd6ec5d21c11ca74d9b))

  **Crates:** `swc_core`, `swc_ecma_parser`

- **(es/parser)** Allow of bindings in await using loops ([#12354](https://github.com/swc-project/swc/pull/12354)) ([c7f40bb](https://github.com/swc-project/swc/commit/c7f40bb260b39863c55d815c7b65e66543fc0e83))

  **Crates:** `swc`, `swc_core`, `swc_ecma_parser`, `swc_ecma_transforms_typescript`

- **(es/parser)** Allow string import and export names after type ([#12371](https://github.com/swc-project/swc/pull/12371)) ([baf0ba6](https://github.com/swc-project/swc/commit/baf0ba6ee4c033760a2a55280c379767d3ff5ae3))

  **Crates:** `swc_core`, `swc_ecma_lexer`, `swc_ecma_parser`

- **(es/parser)** Correctly round non-decimal numeric literals ([#12370](https://github.com/swc-project/swc/pull/12370)) ([7636d01](https://github.com/swc-project/swc/commit/7636d01be520c245d70323e8a9adb762fb9305ce))

  **Crates:** `swc_core`, `swc_ecma_parser`

- **(es/parser)** Isolate constructor function contexts ([#12367](https://github.com/swc-project/swc/pull/12367)) ([7954b2d](https://github.com/swc-project/swc/commit/7954b2d0a0cb8ac4712e83c0a20ec983dae014e2))

  **Crates:** `swc_core`, `swc_ecma_parser`

- **(es/parser)** Parse optional generator methods ([#12355](https://github.com/swc-project/swc/pull/12355)) ([0b33a30](https://github.com/swc-project/swc/commit/0b33a30b6cfd602a173900d388260c9b1fbab7c6))

  **Crates:** `swc_core`, `swc_ecma_parser`

- **(es/parser)** Parse static constructor methods in JavaScript ([#12357](https://github.com/swc-project/swc/pull/12357)) ([98f718f](https://github.com/swc-project/swc/commit/98f718f99d42aaf11b3a8e162ed3b00bb7f8fdf3))

  **Crates:** `swc_core`, `swc_ecma_codegen`, `swc_ecma_parser`

- **(es/parser)** Preserve elisions in arrow binding patterns ([#12366](https://github.com/swc-project/swc/pull/12366)) ([3b3689a](https://github.com/swc-project/swc/commit/3b3689a599bf129a7657228d4bdda47a3aef26b5))

  **Crates:** `swc_core`, `swc_ecma_codegen`, `swc_ecma_minifier`, `swc_ecma_parser`

- **(es/parser)** Preserve type references named asserts before line breaks ([#12372](https://github.com/swc-project/swc/pull/12372)) ([1f12e7f](https://github.com/swc-project/swc/commit/1f12e7f7acf144395bd097483886d34121fcf881))

  **Crates:** `swc_core`, `swc_ecma_lexer`, `swc_ecma_parser`

- **(es/parser)** Recognize named optional and rest tuple elements ([#12368](https://github.com/swc-project/swc/pull/12368)) ([476ba33](https://github.com/swc-project/swc/commit/476ba3384ed3d1453fae9a1b0d83918a25c3e4fa))

  **Crates:** `swc_core`, `swc_ecma_lexer`, `swc_ecma_parser`

- **(es/parser)** Reject unicode escapes in RegExp flags ([#12093](https://github.com/swc-project/swc/pull/12093)) ([4f98673](https://github.com/swc-project/swc/commit/4f98673af6270948d36261f41dd3d1eef0992093))

  **Crates:** `swc_core`, `swc_ecma_parser`

- **(es/typescript)** Fold optional-chained enum member reads ([#12179](https://github.com/swc-project/swc/pull/12179)) ([4519330](https://github.com/swc-project/swc/commit/45193304cdf7e0eca7e536d56f4ffc2a00aaf6f7))

  **Crates:** `swc_core`, `swc_ecma_transforms_typescript`

- **(hstr)** Avoid panicking in `Wtf8::starts_with` ([#12383](https://github.com/swc-project/swc/pull/12383)) ([3ae4e24](https://github.com/swc-project/swc/commit/3ae4e24165303cb64609268cc1e3ec967aedfbe0))

  **Crates:** `hstr`, `swc_core`

- **(html/parser)** Preserve customizable select markup and rich option content ([#12413](https://github.com/swc-project/swc/pull/12413)) ([86d40bd](https://github.com/swc-project/swc/commit/86d40bdd5bec8e673e57bdd0ae0421eef6ef0a9f))

  **Crates:** `swc_core`, `swc_html_minifier`, `swc_html_parser`

- **(node)** Correct native release cache handling, integrity verification, and load-time measurements; avoid NTFS compression for new Windows cache images. ([#12415](https://github.com/swc-project/swc/pull/12415)) ([2b292c8](https://github.com/swc-project/swc/commit/2b292c804347ce83dde75cc3431d1faa592554e4))

  **Crates:** `swc_core`

- **(nodejs)** Complete Amaro REPL support with tokenization, top-level await locations, unexpected EOF recovery, and persistent import bindings. ([#12395](https://github.com/swc-project/swc/pull/12395)) ([4b42cd5](https://github.com/swc-project/swc/commit/4b42cd59d7ceaa194a1ef0bdbbb30f12a02ac992))

  **Crates:** `swc_core`

- **(typescript)** Decode raw-only templates in Fast DTS values, computed property names, accessor matching, and enum evaluation. ([#12347](https://github.com/swc-project/swc/pull/12347)) ([7898152](https://github.com/swc-project/swc/commit/78981525cb1256c3f69a22984b42b5f04b6e51dc))

  **Crates:** `swc_core`, `swc_typescript`

### Documentation

- Require detailed changeset release notes ([af9df38](https://github.com/swc-project/swc/commit/af9df38554fad95e2b98a6b40fd27a04b11489d8))

- **(es/minifier)** Clarify implementation and review policy for semantic preservation edge cases. ([#12349](https://github.com/swc-project/swc/pull/12349)) ([ff6a3c3](https://github.com/swc-project/swc/commit/ff6a3c3b198d0d31a5e3a84dc0bf41542be534da))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Clarify that decorators are lowered before minification and keep decorator-specific handling and tests in the appropriate parser or transform suites. ([#12337](https://github.com/swc-project/swc/pull/12337)) ([d8b76cc](https://github.com/swc-project/swc/commit/d8b76cc14ca18a01f9dfcac5cfcce1280a93eff5))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Document the Terser fixture backlog workflow ([#12274](https://github.com/swc-project/swc/pull/12274)) ([07328de](https://github.com/swc-project/swc/commit/07328de0c1c813cdc79aa5a75cfe2aace10f9b07))

  **Crates:** `swc_core`, `swc_ecma_minifier`

### Features

- **(bindings)** Add private Rust support for verified zstd native addon carriers ([#12289](https://github.com/swc-project/swc/pull/12289)) ([2855b5a](https://github.com/swc-project/swc/commit/2855b5a8c1f24d09e69cca1ea80b03c3c55180e4))

  **Crates:** `swc_core`

- **(bindings)** Gate native npm releases on verified carriers ([#12292](https://github.com/swc-project/swc/issues/12292)) ([556044f](https://github.com/swc-project/swc/commit/556044f4af6738005b546163b3384378c5969298))

- **(es/minifier)** Drop ignored property accesses under `pure_getters` ([#12384](https://github.com/swc-project/swc/pull/12384)) ([43f4fdb](https://github.com/swc-project/swc/commit/43f4fdb583e7205adb3f0c60218705077d86dd7d))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Honor `/*#__PURE__*/` on property reads and destructuring patterns ([#12384](https://github.com/swc-project/swc/pull/12384)) ([43f4fdb](https://github.com/swc-project/swc/commit/43f4fdb583e7205adb3f0c60218705077d86dd7d))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/module)** Support moduleRoot for AMD module IDs ([#11964](https://github.com/swc-project/swc/issues/11964)) ([4b4c135](https://github.com/swc-project/swc/commit/4b4c135ef479287bfc2c489e0214d04a1f4bfedb))

- **(releaser)** Preserve changeset bodies in changelogs ([180ffbd](https://github.com/swc-project/swc/commit/180ffbdf23538cbbfc8cec6d76880cd7e0434733))

### Miscellaneous Tasks

- **(es/transforms)** Remove the export-default-from benchmark ([#12350](https://github.com/swc-project/swc/pull/12350)) ([5a2096f](https://github.com/swc-project/swc/commit/5a2096ff7d256aa651ddae20d8172b4870c70a70))

  **Crates:** `swc_core`, `swc_ecma_transforms_proposal`

### Other Changes

- Fix array join compression when an array literal contains holes. ([#12242](https://github.com/swc-project/swc/pull/12242)) ([7eca515](https://github.com/swc-project/swc/commit/7eca5154640f60dd63d8073efd3bfae8ad178d0d))

  **Crates:** `swc_ecma_minifier`

- Fix duplicate property names emitted by folded `Object.keys` calls. ([#12263](https://github.com/swc-project/swc/pull/12263)) ([c652537](https://github.com/swc-project/swc/commit/c6525371903780552d4e5ac1d32e36c6143a6b58))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- Fix empty-separator array join compression preserving numeric additions. ([#12240](https://github.com/swc-project/swc/pull/12240)) ([a5bd592](https://github.com/swc-project/swc/commit/a5bd5924c14e702b995cdbb6581a9ecf4098df5a))

  **Crates:** `swc_ecma_minifier`

- Fix rest-argument IIFE inlining changing RegExp literal identity. ([#12238](https://github.com/swc-project/swc/pull/12238)) ([4a73df1](https://github.com/swc-project/swc/commit/4a73df199f6205e7c9cd2a217cdd0a95a7b52053))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- Fix unsafe folding of `Function.length` for functions with default or rest parameters. ([#12251](https://github.com/swc-project/swc/pull/12251)) ([753db8c](https://github.com/swc-project/swc/commit/753db8c34ff2e64bc1d20e474955a38e9f11ca29))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- Preserve argument evaluation when folding literal string case-conversion calls. ([#12234](https://github.com/swc-project/swc/pull/12234)) ([0d377f1](https://github.com/swc-project/swc/commit/0d377f1dad47808e99848e3231e38db6bf79feb6))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- Preserve named function expressions referenced by parameter initializers and when `keep_fnames` is enabled. ([#12318](https://github.com/swc-project/swc/pull/12318)) ([9ee8686](https://github.com/swc-project/swc/commit/9ee8686d1ccdd73266624fc307e341643a3076cc))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- Preserve strict member comparisons when repeated call evaluation can produce different values. ([#12320](https://github.com/swc-project/swc/pull/12320)) ([2755d73](https://github.com/swc-project/swc/commit/2755d73f966a8bbdd9d0ce5305c2e76f1a9308ca))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- Preserve string-named module imports when merging import declarations. ([#12245](https://github.com/swc-project/swc/pull/12245)) ([b23c5ed](https://github.com/swc-project/swc/commit/b23c5ed2fa314f3c605502f453cc2c93482f600e))

  **Crates:** `swc_ecma_minifier`

- Preserve unpaired surrogate code units when converting string values to template literals. ([#12329](https://github.com/swc-project/swc/pull/12329)) ([ff90d49](https://github.com/swc-project/swc/commit/ff90d49e12947e2c591b8fa882b7bc15328c36b8))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- Reduce runtime dependencies for swc_estree_compat. ([#12377](https://github.com/swc-project/swc/pull/12377)) ([f517d5a](https://github.com/swc-project/swc/commit/f517d5ade9d2094e25238d95f21dada81b288f65))

  **Crates:** `swc_estree_compat`

### Performance

- **(core)** Reduce native binary size by consolidating ICU dependencies. ([#12385](https://github.com/swc-project/swc/pull/12385)) ([53cb564](https://github.com/swc-project/swc/commit/53cb564071ad55bfbdbefc3804fe454e814c4563))

  **Crates:** `swc_core`

- **(es/proposal)** Process export-default-from without a visitor ([#12348](https://github.com/swc-project/swc/pull/12348)) ([f37ce70](https://github.com/swc-project/swc/commit/f37ce705d2dce729fe4448dded8ce9a1f700ad3c))

  **Crates:** `swc_core`, `swc_ecma_transforms_proposal`

### Refactor

- **(es/minifier)** Refine dead code optimization around termination ([#12392](https://github.com/swc-project/swc/pull/12392)) ([bbdc059](https://github.com/swc-project/swc/commit/bbdc059047416ae1584e91249c17bbe9054a48c3))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Remove redundant helpers and reuse existing expression utilities. ([#12286](https://github.com/swc-project/swc/pull/12286)) ([b83aa6a](https://github.com/swc-project/swc/commit/b83aa6a014d2844036e128a196399884333721a3))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Remove useless helpers ([#12343](https://github.com/swc-project/swc/issues/12343)) ([14bfa36](https://github.com/swc-project/swc/commit/14bfa3676e8ca475fba6e2622c5193fd72eac9a7))

- **(es/minifier)** Simplify constant-false loop guards ([#12293](https://github.com/swc-project/swc/pull/12293)) ([a37d439](https://github.com/swc-project/swc/commit/a37d439e4c403bd56d2ee3a7a9eacdbc1f083568))

  **Crates:** `swc_core`, `swc_ecma_minifier`

## [1.16.2] - 2026-09-04

### Breaking Changes

- **(es/react-compiler)** Use the official React compiler package ([#12168](https://github.com/swc-project/swc/pull/12168)) ([6d34fe7](https://github.com/swc-project/swc/commit/6d34fe730c1410849210d5e7186331b08c93f2d6))

  **Crates:** `swc_core`, `swc_ecma_react_compiler`

### Bug Fixes

- **(es/compat)** Preserve for-of object-rest binding scope ([#12158](https://github.com/swc-project/swc/pull/12158)) ([f6d5bd1](https://github.com/swc-project/swc/commit/f6d5bd12bf267dbb2e1551ccacd82b198e6edc6f))

  **Crates:** `swc_core`, `swc_ecma_transformer`, `swc_ecma_transforms_compat`

- **(es/decorators)** Drop params from getter replacing decorated private method ([#12161](https://github.com/swc-project/swc/pull/12161)) ([d56f594](https://github.com/swc-project/swc/commit/d56f5943861178b91ff6e718bddb10e997da1a8c))

  **Crates:** `swc_core`, `swc_ecma_transforms_proposal`

- **(es/minifier)** Avoid an optimization loop when JSX element names cannot be inlined ([#12149](https://github.com/swc-project/swc/pull/12149)) ([4e79b94](https://github.com/swc-project/swc/commit/4e79b94930d7fc21b794f3c480fea4c9f8f8344e))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Do not apply callee-owned PURE annotations to outer invocations ([#12180](https://github.com/swc-project/swc/pull/12180)) ([ec780f9](https://github.com/swc-project/swc/commit/ec780f927369cc81dfa3a1aca73802d7e5885a96))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Do not apply inner PURE annotations to returned value calls ([#12140](https://github.com/swc-project/swc/pull/12140)) ([c37b5a9](https://github.com/swc-project/swc/commit/c37b5a954794cf0e4cfa419868899385f067bc05))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Don't replace value-used console.*.bind() calls with undefined ([#12138](https://github.com/swc-project/swc/pull/12138)) ([ed74223](https://github.com/swc-project/swc/commit/ed742230471f5462da9f24a8a4c1566d8fa8ef68))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Preserve closure bindings in repeatedly executed loop expressions ([#12131](https://github.com/swc-project/swc/pull/12131)) ([1260e36](https://github.com/swc-project/swc/commit/1260e362fd9bb15cf93b2d3ce595290c7ff272cf))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Preserve do-while control-flow targets ([#12160](https://github.com/swc-project/swc/pull/12160)) ([f62c437](https://github.com/swc-project/swc/commit/f62c437dc2546d8cf3aa8211970f72693a357d0c))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Prevent binding collisions in copied inline arrows ([#12141](https://github.com/swc-project/swc/pull/12141)) ([cf7b5c9](https://github.com/swc-project/swc/commit/cf7b5c96430be5fc5fab4820c6bf75eb53f5c712))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Track assignments from `var` declarations in for-in/of loop heads ([#12136](https://github.com/swc-project/swc/pull/12136)) ([783bbc2](https://github.com/swc-project/swc/commit/783bbc29c8ccbc7d2dfa73860dd2765ee09d459d))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/parser)** Parse ambiguous top-level `await` expressions using the valid Program goal ([#12142](https://github.com/swc-project/swc/pull/12142)) ([141a320](https://github.com/swc-project/swc/commit/141a3201322dd3cf1acb317fe1c8889cdeda9358))

  **Crates:** `swc_core`, `swc_ecma_parser`, `swc_ecma_transforms_base`

- **(es/parser)** Preserve await grammar boundaries in unambiguous parsing ([#12156](https://github.com/swc-project/swc/pull/12156)) ([c732683](https://github.com/swc-project/swc/commit/c7326832e57d2d3effe9eb1b3c415424ae68bf21))

  **Crates:** `swc_core`, `swc_ecma_parser`

- **(es/quote)** Restore top-level await parsing in quoted nodes ([#12163](https://github.com/swc-project/swc/pull/12163)) ([918f517](https://github.com/swc-project/swc/commit/918f5174a17425cd49c3eedc1e761ebdf1fc3d2e))

  **Crates:** `swc_core`, `swc_ecma_parser`, `swc_ecma_quote_macros`

- **(es/typescript)** Preserve Flow component type semantics ([#12090](https://github.com/swc-project/swc/pull/12090)) ([c8d5b49](https://github.com/swc-project/swc/commit/c8d5b497c4895367b0902bde42b3f6a3fa5b7c24))

  **Crates:** `swc`, `swc_core`, `swc_ecma_transforms_typescript`

- **(es/typescript)** Treat const variable references as enum constants ([#12101](https://github.com/swc-project/swc/pull/12101)) ([c523551](https://github.com/swc-project/swc/commit/c5235516340959f703c02d91a79ba40df897eb9c))

  **Crates:** `swc_core`, `swc_ecma_transforms_typescript`

- **(swc)** Drop spans of parsed `jsc.transform.optimizer.globals` values before caching them ([#12129](https://github.com/swc-project/swc/pull/12129)) ([9a306b8](https://github.com/swc-project/swc/commit/9a306b890ac9d4fc8698faf6c55ff95e82983585))

  **Crates:** `swc`, `swc_core`

- **(swc)** Key cached optimizer environment values by their configured map ([#12166](https://github.com/swc-project/swc/pull/12166)) ([c0b6f12](https://github.com/swc-project/swc/commit/c0b6f12fe4c3b1d0235a64496560941751e21bd8))

  **Crates:** `swc`, `swc_core`

- **(visit)** Panic deterministically on invalid AST paths ([#12154](https://github.com/swc-project/swc/pull/12154)) ([b4d11a9](https://github.com/swc-project/swc/commit/b4d11a99fd79c54486a9466c1477a9eb0e07b443))

  **Crates:** `swc_core`, `swc_visit`

### Features

- **(es/minifier)** Evaluate `Math.floor`, `Math.ceil`, `Math.round` and `Math.sqrt` ([#12117](https://github.com/swc-project/swc/pull/12117)) ([e876e80](https://github.com/swc-project/swc/commit/e876e80f6652d2cc96709678ee8ee213dc06b94e))

  **Crates:** `swc_core`, `swc_ecma_minifier`, `swc_ecma_utils`

- **(es/parser)** Add opt-in parser-only TSRX lowering and Rust facade features ([#12120](https://github.com/swc-project/swc/pull/12120)) ([61ff097](https://github.com/swc-project/swc/commit/61ff097706c3fb0568f92bb6e9b2565d87ce3e4f))

  **Crates:** `swc_core`, `swc_ecma_parser`, `swc_ecmascript`

### Miscellaneous Tasks

- **(deps)** Upgrade reqwest to 0.12 ([#12144](https://github.com/swc-project/swc/pull/12144)) ([8dd98e4](https://github.com/swc-project/swc/commit/8dd98e45092289eeadf3e3255c9de9323f2944f6))

  **Crates:** `swc_bundler`, `swc_core`

- **(deps)** Ignore unpatched Wasmtime advisory ([#12170](https://github.com/swc-project/swc/issues/12170)) ([5dd7422](https://github.com/swc-project/swc/commit/5dd7422d5bd4e3cdfef14402477f01da662bfe48))

### Testing

- **(es/minifier)** Update test fixtures ([#12135](https://github.com/swc-project/swc/issues/12135)) ([2f3e88d](https://github.com/swc-project/swc/commit/2f3e88d76b0f18ba50c9ad9085a87d9916aace5f))

### ci

- Gate jobs with detected changes ([#12147](https://github.com/swc-project/swc/issues/12147)) ([3802924](https://github.com/swc-project/swc/commit/380292485239ad8b19aabdfcc0f77701844f6051))

- Only plan completed issues and merged PRs ([#12133](https://github.com/swc-project/swc/issues/12133)) ([4d9aa8e](https://github.com/swc-project/swc/commit/4d9aa8e3971b21fca583069d3c6d46d1e15e1213))

- Tag published misc npm packages ([#12173](https://github.com/swc-project/swc/issues/12173)) ([a789691](https://github.com/swc-project/swc/commit/a7896914a2c72c618f28e726b49e658e010eefc6))

## [1.16.1] - 2026-08-19

### Bug Fixes

- **(es/minifier)** Preserve for-loop initializer bindings ([#12121](https://github.com/swc-project/swc/pull/12121)) ([0a1d4de](https://github.com/swc-project/swc/commit/0a1d4de3c6439770aa718b488d87ac9a29d3d92a))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/modules)** Preserve destructuring assignment targets in SystemJS ([#12122](https://github.com/swc-project/swc/pull/12122)) ([557060b](https://github.com/swc-project/swc/commit/557060b72a2138c37a76114a1a2862390246a500))

  **Crates:** `swc_core`, `swc_ecma_transforms_module`

- **(es/react)** Handle `apos` JSX character references. ([#12125](https://github.com/swc-project/swc/pull/12125)) ([d09547f](https://github.com/swc-project/swc/commit/d09547fbd99915d1063e3513d1a99cd9e2aeda7e))

  **Crates:** `swc_core`, `swc_ecma_transforms_react`

## [1.16.0] - 2026-08-14

### Breaking Changes

- Update browserslist-rs to 0.20 ([#12098](https://github.com/swc-project/swc/pull/12098)) ([b395eab](https://github.com/swc-project/swc/commit/b395eabee58ec2735c09e4f29267f55cdbdde18c))

  **Crates:** `preset_env_base`

- **(deps)** Upgrade `lru` to 0.18.2 to address RUSTSEC-2026-0253 ([#12116](https://github.com/swc-project/swc/pull/12116)) ([c9d1da4](https://github.com/swc-project/swc/commit/c9d1da49161d0dc32e3f83387a0c200630f059f2))

  **Crates:** `swc_core`, `swc_ecma_loader`

- **(encoding)** Correct field counts for ignored fields ([#11905](https://github.com/swc-project/swc/pull/11905)) ([6fb4ca1](https://github.com/swc-project/swc/commit/6fb4ca16332f862e71f149f19da55147f12a0c80))

  **Crates:** `ast_node`, `swc_core`

- **(es/ast)** Add `body_ctxt` to `Switch` ([#12065](https://github.com/swc-project/swc/issues/12065)) ([bf25ae0](https://github.com/swc-project/swc/commit/bf25ae01aa950185c41edaacfddae644f2ab4581))

  Add `body_ctxt` to `Switch` ([#12065](https://github.com/swc-project/swc/issues/12065))

- **(es/ast)** Introduce a dedicated `FunctionBody` node ([#12096](https://github.com/swc-project/swc/pull/12096)) ([394c7c9](https://github.com/swc-project/swc/commit/394c7c926edd4f779d09ba00612f8b8baab4907a))

  **Crates:** `swc`, `swc_bundler`, `swc_core`, `swc_ecma_ast`, `swc_ecma_codegen`, `swc_ecma_compat_bugfixes`, `swc_ecma_compat_common`, `swc_ecma_compat_es2015`, `swc_ecma_compat_es2022`, `swc_ecma_hooks`, `swc_ecma_lexer`, `swc_ecma_lints`, `swc_ecma_minifier`, `swc_ecma_parser`, `swc_ecma_quote_macros`, `swc_ecma_react_compiler`, `swc_ecma_transformer`, `swc_ecma_transforms_base`, `swc_ecma_transforms_module`, `swc_ecma_transforms_optimization`, `swc_ecma_transforms_proposal`, `swc_ecma_transforms_react`, `swc_ecma_transforms_typescript`, `swc_ecma_utils`, `swc_ecma_visit`, `swc_estree_compat`, `swc_typescript`

- **(es/ast)** Prevent `Expr::unwrap_mut_with` from leaking mutable callback references ([#12088](https://github.com/swc-project/swc/pull/12088)) ([592f559](https://github.com/swc-project/swc/commit/592f559787e62f091cbe5c4c370b2ff30e4abd34))

  **Crates:** `swc_core`, `swc_ecma_ast`

- **(es/ast)** Split TypeScript and Flow `this` parameters into a dedicated AST field ([#12075](https://github.com/swc-project/swc/pull/12075)) ([1687c0f](https://github.com/swc-project/swc/commit/1687c0fbd2f22c563e02f5f3efa8d5e4f0772e12))

  **Crates:** `swc`, `swc_core`, `swc_ecma_ast`, `swc_ecma_codegen`, `swc_ecma_hooks`, `swc_ecma_lexer`, `swc_ecma_parser`, `swc_ecma_quote_macros`, `swc_ecma_react_compiler`, `swc_ecma_transforms_base`, `swc_ecma_transforms_typescript`, `swc_ecma_visit`, `swc_estree_compat`, `swc_ts_fast_strip`, `swc_typescript`

- **(es/ast)** Use `Function` for object accessors ([#12077](https://github.com/swc-project/swc/pull/12077)) ([9ae902e](https://github.com/swc-project/swc/commit/9ae902e3fe9771c75c116546dc36ac90e481c316))

  **Crates:** `swc`, `swc_core`, `swc_ecma_ast`, `swc_ecma_codegen`, `swc_ecma_compat_common`, `swc_ecma_compat_es2015`, `swc_ecma_compat_es2022`, `swc_ecma_lexer`, `swc_ecma_lints`, `swc_ecma_minifier`, `swc_ecma_parser`, `swc_ecma_quote_macros`, `swc_ecma_react_compiler`, `swc_ecma_transformer`, `swc_ecma_transforms_base`, `swc_ecma_transforms_classes`, `swc_ecma_transforms_compat`, `swc_ecma_transforms_module`, `swc_ecma_transforms_optimization`, `swc_ecma_transforms_proposal`, `swc_ecma_transforms_typescript`, `swc_ecma_utils`, `swc_ecma_visit`, `swc_estree_compat`, `swc_ts_fast_strip`, `swc_typescript`

- **(es/ast)** Fix panic on JSX surrogate entities ([#11803](https://github.com/swc-project/swc/issues/11803)) ([d21de47](https://github.com/swc-project/swc/commit/d21de4761a5306be015b2b9021fbc3cc9d02f13b))

  fix panic on JSX surrogate entities ([#11803](https://github.com/swc-project/swc/issues/11803))

- **(plugin)** Make raw byte reconstruction unsafe ([#12089](https://github.com/swc-project/swc/pull/12089)) ([83ab4ed](https://github.com/swc-project/swc/commit/83ab4ed6fd19782342f221bfaf05177508b73217))

  **Crates:** `swc_common`, `swc_core`, `swc_plugin_macro`, `swc_plugin_proxy`

### Bug Fixes

- **(es/es2015)** Preserve this in static field parameters ([#12085](https://github.com/swc-project/swc/issues/12085)) ([5b758ed](https://github.com/swc-project/swc/commit/5b758ed173292dccf4d97d372a36a4086a820a7c))

- **(es/minifier)** Limit generated parameters when replacing `arguments` accesses. ([#12053](https://github.com/swc-project/swc/pull/12053)) ([46d6f41](https://github.com/swc-project/swc/commit/46d6f41ccec6ce9d97baad4e16c1bdc8e24d77db))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Remove unused variable initializer cycles ([#12106](https://github.com/swc-project/swc/pull/12106)) ([0421534](https://github.com/swc-project/swc/commit/0421534a522d3c7b4b5aeb71b44751bb8aa90979))

  **Crates:** `swc_core`, `swc_ecma_minifier`, `swc_ecma_transforms_optimization`

- **(es/preset-env)** Lower async generators for unsupported targets ([#12086](https://github.com/swc-project/swc/pull/12086)) ([3a144b1](https://github.com/swc-project/swc/commit/3a144b1caa98d48b0adcb4ca824ee7c22ad7f702))

  **Crates:** `swc_core`, `swc_ecma_preset_env`, `swc_ecma_transformer`

- **(es/react-compiler)** Make the compilation fast check conservative ([#12105](https://github.com/swc-project/swc/pull/12105)) ([7e14950](https://github.com/swc-project/swc/commit/7e149500d84ae4ea3f4f43aa1b29e97b891739ad))

  **Crates:** `swc_core`, `swc_ecma_react_compiler`

- **(hstr)** Avoid references to uninitialized memory ([#12087](https://github.com/swc-project/swc/pull/12087)) ([68f0983](https://github.com/swc-project/swc/commit/68f0983877976a379cb0249c7af21898505313be))

  **Crates:** `hstr`, `swc_core`

- **(plugin/runner)** Write Wasmer plugin cache atomically ([#12100](https://github.com/swc-project/swc/pull/12100)) ([3c4f404](https://github.com/swc-project/swc/commit/3c4f404bb3f54fd8a25eb9399b84a86bb3fc26fe))

  **Crates:** `swc_core`, `swc_plugin_backend_wasmer`

- **(react-compiler)** Preserve TypeScript function overload signatures ([#12115](https://github.com/swc-project/swc/pull/12115)) ([a132384](https://github.com/swc-project/swc/commit/a1323843cb3389250eafcf53f027314515aff549))

  **Crates:** `swc_core`, `swc_ecma_react_compiler`

## [1.15.47] - 2026-07-29

### Breaking Changes

- **(es/ast)** Support NaN and infinity in Number while preserving Hash. ([#12043](https://github.com/swc-project/swc/pull/12043)) ([f4b85a6](https://github.com/swc-project/swc/commit/f4b85a63e9546245782068f5a9b2b7a0991cb99c))

  **Crates:** `ast_node`, `swc_core`, `swc_ecma_ast`

- **(swc_config)** Upgrade `regress` to v0.11.1 ([#12070](https://github.com/swc-project/swc/pull/12070)) ([b71793f](https://github.com/swc-project/swc/commit/b71793f64c0ad5296d13ac51edf6aa7f4f4e681a))

  **Crates:** `swc_config`, `swc_core`

### Bug Fixes

- **(es)** Preserve numeric property key identity ([#12050](https://github.com/swc-project/swc/pull/12050)) ([46900a3](https://github.com/swc-project/swc/commit/46900a31a92bdb89de94bf9264606342ec201fd3))

  **Crates:** `swc_core`, `swc_ecma_compat_es2015`, `swc_ecma_minifier`, `swc_ecma_transformer`, `swc_ecma_transforms_compat`, `swc_ecma_transforms_optimization`, `swc_ecma_utils`, `swc_typescript`

- **(es/codegen)** Emit non-finite numeric literals without identifier capture. ([#12047](https://github.com/swc-project/swc/pull/12047)) ([883abc4](https://github.com/swc-project/swc/commit/883abc4b97bf73a71cf1f6717238d24603ea9eb8))

  **Crates:** `swc_core`, `swc_ecma_codegen`, `swc_ecma_minifier`, `swc_ecma_transforms_base`

- **(es/decorators)** Avoid class state leakage for nested undecorated classes ([#12076](https://github.com/swc-project/swc/pull/12076)) ([4c9d277](https://github.com/swc-project/swc/commit/4c9d27752e9889b989cff9f6b72118e240048a23))

  **Crates:** `swc_core`, `swc_ecma_transforms_proposal`

- **(es/minifier)** Apply `ToUint16` when folding `String.fromCharCode`. ([#12055](https://github.com/swc-project/swc/pull/12055)) ([9ae7b92](https://github.com/swc-project/swc/commit/9ae7b9239fefc9eb781093eed5cd409bc31f34ad))

  **Crates:** `swc_core`, `swc_ecma_minifier`, `swc_ecma_utils`

- **(es/minifier)** Avoid inexact number radix folding ([#12057](https://github.com/swc-project/swc/pull/12057)) ([506a0ea](https://github.com/swc-project/swc/commit/506a0ea89b929733fa2530181542942157ee24fb))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Index string literals by UTF-16 code unit ([#12054](https://github.com/swc-project/swc/pull/12054)) ([bc263d2](https://github.com/swc-project/swc/commit/bc263d24d5f3630188751c85757f5f7e31f9fbc2))

  **Crates:** `swc_core`, `swc_ecma_minifier`, `swc_ecma_transforms_optimization`

- **(es/minifier)** Preserve invalid Array constructor lengths ([#12056](https://github.com/swc-project/swc/pull/12056)) ([3ce9e16](https://github.com/swc-project/swc/commit/3ce9e1693ec9586ab04b4ef9776be1233708e923))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Preserve non-canonical `arguments` property accesses. ([#12052](https://github.com/swc-project/swc/pull/12052)) ([850230b](https://github.com/swc-project/swc/commit/850230b22b6a10c025a47efaaadb6b81b5fce5e7))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Preserve top-level declarations referenced only by direct eval ([#12029](https://github.com/swc-project/swc/pull/12029)) ([ad0e3b4](https://github.com/swc-project/swc/commit/ad0e3b49bca3a61bc8f5ac90e15dc263b9cc674c))

  **Crates:** `swc_core`, `swc_ecma_transforms_optimization`

- **(es/minifier)** Use numeric literals for non-finite values during optimization. ([#12048](https://github.com/swc-project/swc/pull/12048)) ([b830786](https://github.com/swc-project/swc/commit/b83078644a7f0f1bbb56d6b45754ca9ed1bafc4b))

  **Crates:** `swc`, `swc_core`, `swc_ecma_minifier`, `swc_ecma_transforms_optimization`, `swc_ecma_utils`

- **(es/optimization)** Apply ToInt32 when folding bitwise NOT ([#12058](https://github.com/swc-project/swc/pull/12058)) ([550e2f7](https://github.com/swc-project/swc/commit/550e2f7881cdf2c3369a649afebd1b016485da81))

  **Crates:** `swc_core`, `swc_ecma_transforms_optimization`

- **(es/optimization)** Preserve large numbers, overflowed infinities, and negative zero in JSON literals. ([#12051](https://github.com/swc-project/swc/pull/12051)) ([667af8c](https://github.com/swc-project/swc/commit/667af8cacdbc58e1af3887d381184355b84d4952))

  **Crates:** `swc_core`, `swc_ecma_transforms_optimization`, `swc_ecma_utils`

- **(es/transforms)** Use numeric literals for non-finite enum values. ([#12049](https://github.com/swc-project/swc/pull/12049)) ([1e3ed5c](https://github.com/swc-project/swc/commit/1e3ed5caf878cfb867a374e768ae8e8344531441))

  **Crates:** `swc`, `swc_core`, `swc_ecma_transforms_typescript`, `swc_typescript`

- **(es/typescript)** Evaluate enum templates from cooked values ([#12059](https://github.com/swc-project/swc/pull/12059)) ([49d0b0f](https://github.com/swc-project/swc/commit/49d0b0f1ac744b04bb657a7e3147ed44ba7ecdde))

  **Crates:** `swc_core`, `swc_ecma_transforms_typescript`, `swc_typescript`

- **(html/minifier)** Preserve JSON script boundaries ([#12080](https://github.com/swc-project/swc/pull/12080)) ([e1877b4](https://github.com/swc-project/swc/commit/e1877b44bdac8abc9fd51e984d584f40f6999832))

  **Crates:** `swc_core`, `swc_html_minifier`

- **(testing)** Check ignored fixtures relative to the crate root ([#12073](https://github.com/swc-project/swc/pull/12073)) ([da858b4](https://github.com/swc-project/swc/commit/da858b45923c73238dc16a8a8e7ebf9e77048e71))

  **Crates:** `swc_core`, `testing_macros`

- **(ts/fast-strip)** Preserve ASI before interpolated templates ([#12040](https://github.com/swc-project/swc/pull/12040)) ([54467fe](https://github.com/swc-project/swc/commit/54467fe851eb51c751916225b5372cdd2ccae900))

  **Crates:** `swc_core`, `swc_ts_fast_strip`

- **(ts/fast-strip)** Preserve UTF-16 source positions, reduce strip-only parser bookkeeping, and defer unused diagnostic setup. ([#12067](https://github.com/swc-project/swc/pull/12067)) ([ac4bfc9](https://github.com/swc-project/swc/commit/ac4bfc95973e50997ba1a7131ccd4d9fe1ff8898))

  **Crates:** `swc_core`, `swc_ts_fast_strip`, `swc_ts_fast_strip_binding`

### Features

- **(es/minifier)** Drop trivial object spread of primitives ([#12068](https://github.com/swc-project/swc/pull/12068)) ([aa49e36](https://github.com/swc-project/swc/commit/aa49e36b247ce11144e03b63e52a1f7792065db1))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(swc)** Expose React Compiler function outlining configuration ([#12030](https://github.com/swc-project/swc/pull/12030)) ([52b78aa](https://github.com/swc-project/swc/commit/52b78aa1d75b20f6bb1cddef96c9d79ab1ca5e53))

  **Crates:** `swc`, `swc_core`

### Performance

- **(es/renamer)** Skip identity rename mappings on apply ([#12044](https://github.com/swc-project/swc/pull/12044)) ([a69f024](https://github.com/swc-project/swc/commit/a69f02405c5b87db6918f05b1091fafec6ba3d7c))

  **Crates:** `swc_core`, `swc_ecma_transforms_base`

- **(es/renamer)** Skip identity rename mappings on apply ([#12041](https://github.com/swc-project/swc/issues/12041)) ([0f9ff15](https://github.com/swc-project/swc/commit/0f9ff15f8172c4cddba8037fb9410c359830319e))

## [1.15.46] - 2026-07-19

### Breaking Changes

- Remove direct rkyv dependencies and archive implementation features. ([#12010](https://github.com/swc-project/swc/pull/12010)) ([5761a2b](https://github.com/swc-project/swc/commit/5761a2b162c9ae41bd436932619d773ceb042d41))

  **Crates:** `ast_node`, `hstr`, `jsdoc`, `swc_allocator`, `swc_atoms`, `swc_common`, `swc_core`, `swc_css_ast`, `swc_ecma_ast`, `swc_ecma_regexp_ast`, `swc_ecmascript`, `swc_html_ast`

- **(es/minifier)** Respect scoped eval when invoking IIFEs ([#11987](https://github.com/swc-project/swc/pull/11987)) ([457df11](https://github.com/swc-project/swc/commit/457df113722f972cd26e42c84fa94ff22290c94f))

  **Crates:** `swc_core`, `swc_ecma_minifier`, `swc_ecma_transforms_base`, `swc_ecma_transforms_compat`

- **(es/module)** Make `rewriteRelativeImportExtensions` rewrite `.tsx` imports to `.js` unless JSX is preserved ([#11995](https://github.com/swc-project/swc/pull/11995)) ([c341d9c](https://github.com/swc-project/swc/commit/c341d9c6e13bd4f71f8c5aeffc4d84ac4f82c28f))

  **Crates:** `swc`, `swc_core`, `swc_ecma_transforms_module`

- **(es/module)** Rewrite SystemJS transform. ([#11996](https://github.com/swc-project/swc/pull/11996)) ([2f47530](https://github.com/swc-project/swc/commit/2f475305944477f19484117226ce4d9c864fbf5e))

  **Crates:** `swc`, `swc_core`, `swc_ecma_transforms_module`, `swc_ecma_utils`

  BREAKING: The Rust `system_js::Config` wrapper was replaced with the shared module transform `Config`. Rust API users should pass fields such as `resolve_fully` and `out_file_extension` directly instead of through `config.config`. The `.swcrc` SystemJS module config remains flat.

### Bug Fixes

- Remove non-deterministic vergen build metadata ([#11976](https://github.com/swc-project/swc/pull/11976)) ([26d8a28](https://github.com/swc-project/swc/commit/26d8a28bd14e46b2eed6459de0309aa07a12bd86))

  **Crates:** `swc_core`, `swc_plugin_runner`

- **(deps)** Update crossbeam-epoch to 0.9.20 ([#12004](https://github.com/swc-project/swc/issues/12004)) ([fababa1](https://github.com/swc-project/swc/commit/fababa16c16c55619164a4d9818d161072ce145f))

- **(es/fixer)** Normalize for-head identifier patterns after removing parentheses ([#11968](https://github.com/swc-project/swc/pull/11968)) ([af681bc](https://github.com/swc-project/swc/commit/af681bc4471139c60bb5e0f2df2069b9d8be7aca))

  **Crates:** `swc_core`, `swc_ecma_transforms_base`

- **(es/fixer)** Preserve parens around PURE-annotated receivers ([#12022](https://github.com/swc-project/swc/issues/12022)) ([73d8941](https://github.com/swc-project/swc/commit/73d894103b4b9302ebb8a8c71a6ec19cab375d89))

- **(es/hygiene)** Rename conflicting bindings even when eval is present ([#12003](https://github.com/swc-project/swc/pull/12003)) ([dd43ad6](https://github.com/swc-project/swc/commit/dd43ad61e802a2b7bff30896d4869f7ace49a129))

  **Crates:** `swc`, `swc_core`, `swc_ecma_minifier`, `swc_ecma_transforms_base`

- **(es/minifier)** Check last case ([#11972](https://github.com/swc-project/swc/issues/11972)) ([060c7ac](https://github.com/swc-project/swc/commit/060c7ac2e6795ed4c28562417167cecac3d0c5d1))

- **(es/minifier)** Collect every used ident for infection analysis ([#11998](https://github.com/swc-project/swc/pull/11998)) ([fb9ebee](https://github.com/swc-project/swc/commit/fb9ebeebc33bed96a53e44b7a84035f93d9d1ab9))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Disable IIFE invoke when there's eval ([#11984](https://github.com/swc-project/swc/pull/11984)) ([eabe4be](https://github.com/swc-project/swc/commit/eabe4be047916d437365aad256ec0932c0f50c16))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Eliminate unused classes with cyclic references ([#11963](https://github.com/swc-project/swc/pull/11963)) ([63a94b9](https://github.com/swc-project/swc/commit/63a94b92c2ef96d64413f0e29af7dbc3594ead5a))

  **Crates:** `swc_core`, `swc_ecma_transforms_optimization`

- **(es/minifier)** Measure number length precisely ([#12026](https://github.com/swc-project/swc/issues/12026)) ([54d139a](https://github.com/swc-project/swc/commit/54d139a23a8e541859a0107b269db96ba730c7a5))

- **(es/minifier)** Preserve switch fallthrough termination analysis ([#11971](https://github.com/swc-project/swc/pull/11971)) ([a5d19ae](https://github.com/swc-project/swc/commit/a5d19ae89ea8cc1aa80df39fe46e207130e12934))

  **Crates:** `swc_core`, `swc_ecma_minifier`, `swc_ecma_utils`

- **(es/modules)** Resolve relative symlinked inputs from cwd ([#11883](https://github.com/swc-project/swc/pull/11883)) ([01e857d](https://github.com/swc-project/swc/commit/01e857d7e2848181df9f75bf3fd968a2d44309ad))

  **Crates:** `swc_core`, `swc_ecma_transforms_module`

- **(es/react)** Emit jsxdev source for fragments ([#11993](https://github.com/swc-project/swc/pull/11993)) ([a70ce24](https://github.com/swc-project/swc/commit/a70ce24ac453e299fb05d87f5f9e2c05b14a580b))

  **Crates:** `swc_core`, `swc_ecma_transforms_react`

- **(es/react-compiler)** Correct catch and parameter scope resolution ([#11985](https://github.com/swc-project/swc/pull/11985)) ([3867e57](https://github.com/swc-project/swc/commit/3867e57e8ed55b41f63bbe9c9827a0a12bfdc2a1))

  **Crates:** `swc_core`, `swc_ecma_react_compiler`

- **(react-compiler)** Defer compilation eligibility to React Compiler instead of filtering for React-like functions in SWC. This allows compiler directives in nested functions to reach React Compiler without requiring the containing function to look like a component or hook. ([#12007](https://github.com/swc-project/swc/pull/12007)) ([ab66869](https://github.com/swc-project/swc/commit/ab6686969decd940808bdeaea55e83953d4c6610))

  **Crates:** `swc_core`, `swc_ecma_react_compiler`

- **(ts/fast-strip)** Preserve multiline generic arrow functions in strip-only mode ([#12034](https://github.com/swc-project/swc/pull/12034)) ([3d82701](https://github.com/swc-project/swc/commit/3d8270109a97d991a07b6642fe595c7b576ecbc9))

  **Crates:** `swc_core`, `swc_ts_fast_strip`

### Documentation

- **(agents)** Document minifier assumptions ([#11966](https://github.com/swc-project/swc/issues/11966)) ([58df612](https://github.com/swc-project/swc/commit/58df612bf65b2e89f85120fad0c537f3bb3834a8))

### Features

- **(es/minifier)** Remove unused arguments from `new` expressions ([#12027](https://github.com/swc-project/swc/pull/12027)) ([661067c](https://github.com/swc-project/swc/commit/661067cfe92d5108f9ee5f32a24f3cbf30fc6c56))

  **Crates:** `swc`, `swc_core`, `swc_ecma_minifier`, `swc_ecma_transforms_base`

- **(es/minifier)** Remove unused param for new Function or Class Expr ([#12017](https://github.com/swc-project/swc/issues/12017)) ([be56e09](https://github.com/swc-project/swc/commit/be56e09901846d01126ab6150e15aec574bc03f0))

- **(es/react-compiler)** Add lint-only React Compiler diagnostics API ([#11965](https://github.com/swc-project/swc/pull/11965)) ([ab4ce67](https://github.com/swc-project/swc/commit/ab4ce67b6339584531801583030b8f4fc3874c6e))

  **Crates:** `swc_core`, `swc_ecma_react_compiler`

- **(wasm)** Add `@swc/nodejs-support-wasm` for Node.js integrations ([#11975](https://github.com/swc-project/swc/pull/11975)) ([b617562](https://github.com/swc-project/swc/commit/b617562734d0819946ebba8d95ccdec8fe8de3b0))

  **Crates:** `swc_core`

### Refactor

- **(es/helpers)** Generate inline helpers from canonical ESM sources ([#12006](https://github.com/swc-project/swc/issues/12006)) ([f36e4b6](https://github.com/swc-project/swc/commit/f36e4b6d66caaad66d9e99659c0d7b5ec613e74a))

- **(es/helpers)** Remove unused jsx helper ([#12009](https://github.com/swc-project/swc/issues/12009)) ([ccbc906](https://github.com/swc-project/swc/commit/ccbc906f31f36c56bee8e4ff0ac896c656598065))

- **(es/lexer)** Replace the archived `smartstring` dependency with `compact_str` ([#12013](https://github.com/swc-project/swc/pull/12013)) ([d6833cc](https://github.com/swc-project/swc/commit/d6833cc8d7fb2714411e1795e525c4e0a3cc8225))

  **Crates:** `hstr`, `swc_core`, `swc_ecma_lexer`, `swc_ecma_minifier`, `swc_ecma_parser`

- **(es/minifier)** Remove ProgramData.top ([#12031](https://github.com/swc-project/swc/issues/12031)) ([a72571f](https://github.com/swc-project/swc/commit/a72571f7ed086f39cb174329dec1eabb0152e36f))

- **(es/module)** Align module transform records with spec terms ([#11992](https://github.com/swc-project/swc/pull/11992)) ([f680df5](https://github.com/swc-project/swc/commit/f680df59d482de708669eb8d720dac97bd412cf3))

  **Crates:** `swc_core`, `swc_ecma_transforms_module`

- **(es/module)** Introduce source module lowering pipeline ([#11999](https://github.com/swc-project/swc/pull/11999)) ([9609b7f](https://github.com/swc-project/swc/commit/9609b7fd1d6a28fc359615f9e6e876f82923c898))

  **Crates:** `swc`, `swc_core`, `swc_ecma_transforms_module`

### Testing

- **(react-compiler)** Add build-pass fixtures for wrapped assignment targets ([#11967](https://github.com/swc-project/swc/issues/11967)) ([58d9b53](https://github.com/swc-project/swc/commit/58d9b537b04c2c0e158280b9b2cef463415ca6a2))

### ci

- Allow memmap2 advisory ([#11961](https://github.com/swc-project/swc/issues/11961)) ([0be5872](https://github.com/swc-project/swc/commit/0be5872e6af5539f3ced5aa1c4ffbe3bffd505f8))

- Allow publish milestone PR updates ([#11960](https://github.com/swc-project/swc/issues/11960)) ([885d3e2](https://github.com/swc-project/swc/commit/885d3e22796b6c1f6512d827fdb77c31a9df706e))

- Update rust-toolchain action pin ([#12021](https://github.com/swc-project/swc/issues/12021)) ([78b41b5](https://github.com/swc-project/swc/commit/78b41b59c89c50fca16edaf80d1400beb7c1a801))

- Update rust-toolchain action pin ([#12036](https://github.com/swc-project/swc/issues/12036)) ([d1a1e23](https://github.com/swc-project/swc/commit/d1a1e23756a156e5c99113dc528d3c09684c39cd))

- Use Node.js 24 by default ([#12035](https://github.com/swc-project/swc/issues/12035)) ([d658d08](https://github.com/swc-project/swc/commit/d658d08d4674961f69c3270d22722f416c1d5008))

- Use Node.js 24 for wasm publishing ([#12038](https://github.com/swc-project/swc/issues/12038)) ([516bf3c](https://github.com/swc-project/swc/commit/516bf3c7a2a0366c1f378a515053ee7df6918f8c))

## [1.15.43] - 2026-06-22

### Breaking Changes

- Remove production tracing hooks, including swc_timer and swc_trace_macro ([#11945](https://github.com/swc-project/swc/pull/11945)) ([0dffdc4](https://github.com/swc-project/swc/commit/0dffdc4998a5b8605de8f07fb0518bc60495a931))

  **Crates:** `dbg-swc`, `preset_env_base`, `swc`, `swc_bundler`, `swc_cli_impl`, `swc_common`, `swc_compiler_base`, `swc_core`, `swc_ecma_codegen`, `swc_ecma_compat_bugfixes`, `swc_ecma_compat_common`, `swc_ecma_compat_es2015`, `swc_ecma_compat_es2022`, `swc_ecma_lexer`, `swc_ecma_loader`, `swc_ecma_minifier`, `swc_ecma_parser`, `swc_ecma_testing`, `swc_ecma_transformer`, `swc_ecma_transforms_base`, `swc_ecma_transforms_module`, `swc_ecma_transforms_optimization`, `swc_ecma_utils`, `swc_graph_analyzer`, `swc_node_bundler`, `swc_plugin_proxy`, `swc_plugin_runner`, `swc_ts_fast_strip`, `swc_typescript`, `testing`

- **(es/react-compiler)** Avoid reporting non-fatal success events as diagnostics ([#11951](https://github.com/swc-project/swc/pull/11951)) ([cb4cb23](https://github.com/swc-project/swc/commit/cb4cb230ec473cb42ccd27dc8d20702ccb24e653))

  **Crates:** `swc_core`, `swc_ecma_react_compiler`

- **(es/react-compiler)** Update forked React Compiler to 0.2.0 ([#11946](https://github.com/swc-project/swc/pull/11946)) ([6fbe188](https://github.com/swc-project/swc/commit/6fbe188741cebee363e7afeec4b0c4aa96144070))

  **Crates:** `swc_core`, `swc_ecma_react_compiler`

- **(swc)** Gate React Compiler behind opt-in Cargo features ([#11941](https://github.com/swc-project/swc/pull/11941)) ([dcc0f2d](https://github.com/swc-project/swc/commit/dcc0f2d0c5c5b68656065277b0b84572286693a5))

  **Crates:** `swc`, `swc_cli_impl`, `swc_core`

### Bug Fixes

- **(es/es2022)** Correct private property brand check scope ([#11953](https://github.com/swc-project/swc/pull/11953)) ([fb5afa2](https://github.com/swc-project/swc/commit/fb5afa22796439b41a0b261b6a4823cab0dcc8df))

  **Crates:** `swc_core`, `swc_ecma_transformer`, `swc_ecma_transforms_compat`

- **(es/minifier)** Gate `Number(x)` -> `+x` on `unsafe` flag ([#11949](https://github.com/swc-project/swc/pull/11949)) ([6176019](https://github.com/swc-project/swc/commit/617601978a4090cde8c0dd900c079cc7eb64b642))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Preserve `cooked` when concatenating template literals ([#11939](https://github.com/swc-project/swc/pull/11939)) ([a7244a6](https://github.com/swc-project/swc/commit/a7244a65e2dcb28f20ab6d747fd782d02a8eebf9))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/parser)** Parse Flow bare `renders` render types ([#11929](https://github.com/swc-project/swc/pull/11929)) ([a71c8eb](https://github.com/swc-project/swc/commit/a71c8eba7b0ef4280b8866cd8e6eebc5be10f0dc))

  **Crates:** `swc_core`, `swc_ecma_parser`

- **(es/parser)** Allow compilation without default features ([#11956](https://github.com/swc-project/swc/pull/11956)) ([baab240](https://github.com/swc-project/swc/commit/baab240500b8d7329fabfb3ec936ba62b59742db))

  **Crates:** `swc_core`, `swc_ecma_parser`

- **(es/react-compiler)** Avoid panics for wrapped assignment targets ([#11952](https://github.com/swc-project/swc/pull/11952)) ([fc9b453](https://github.com/swc-project/swc/commit/fc9b4537a0e4adf8bce0f8834b7805a75a448a5b))

  **Crates:** `swc_core`, `swc_ecma_react_compiler`

- **(es/react-compiler)** Disable parser default features ([#11957](https://github.com/swc-project/swc/pull/11957)) ([75ddb28](https://github.com/swc-project/swc/commit/75ddb28bceb2c88ea5f0aaa21e19d4f83f4ae5c7))

  **Crates:** `swc_core`, `swc_ecma_react_compiler`

- **(es/react-compiler)** Preserve TypeScript metadata during AST roundtrip ([#11950](https://github.com/swc-project/swc/pull/11950)) ([9c4dec3](https://github.com/swc-project/swc/commit/9c4dec3799bc65782823281ba9b2bb714c43181c))

  **Crates:** `swc_core`, `swc_ecma_react_compiler`

- **(es/react-compiler)** Scope class static blocks and TypeScript module blocks correctly ([#11943](https://github.com/swc-project/swc/pull/11943)) ([1ee74a0](https://github.com/swc-project/swc/commit/1ee74a0cc5938a720e106221374c0d894396a16d))

  **Crates:** `swc_core`, `swc_ecma_react_compiler`

- **(es/react-compiler)** Skip TypeScript `this` pseudo-params in scope collector ([#11940](https://github.com/swc-project/swc/pull/11940)) ([9066c43](https://github.com/swc-project/swc/commit/9066c4319a8c4e8bf9dc97885d2d7ff3a26cf79f))

  **Crates:** `swc_core`, `swc_ecma_react_compiler`

- **(plugin)** Publish swc_plugin_macro wasm import module fix ([#11955](https://github.com/swc-project/swc/pull/11955)) ([09273c0](https://github.com/swc-project/swc/commit/09273c0ab1a645d49bb58204ee3aa771a9f9b04c))

  **Crates:** `swc_core`, `swc_plugin_macro`

### Documentation

- Document untrusted input security scope ([#11937](https://github.com/swc-project/swc/issues/11937)) ([677305b](https://github.com/swc-project/swc/commit/677305b6fb204d5ffd391616f3e091c5c190893a))

### Features

- **(ecma/react-compiler)** Add React Compiler integration ([#11917](https://github.com/swc-project/swc/pull/11917)) ([b182fbd](https://github.com/swc-project/swc/commit/b182fbd5bc0336f33ac1dec4ca0027d5b25ce1e3))

  **Crates:** `swc`, `swc_core`, `swc_ecma_react_compiler`

## [1.15.41] - 2026-06-09

### Breaking Changes

- **(common)** Lazily compute source file hashes ([#11879](https://github.com/swc-project/swc/pull/11879)) ([a3cfbd7](https://github.com/swc-project/swc/commit/a3cfbd7be01b11aada1f31f4217c7bcde7666bd2))

  **Crates:** `swc_common`, `swc_core`, `swc_ecma_ast`

- **(plugin)** Avoid importing __free from env ([#11908](https://github.com/swc-project/swc/pull/11908)) ([4584296](https://github.com/swc-project/swc/commit/4584296629bd87f7186a09b0ec37d5ab3dd3ff94))

  **Crates:** `swc_common`

  Bumping swc_common to republish all crates

### Bug Fixes

- **(bindings/node)** Preserve source context for AST transforms ([#11920](https://github.com/swc-project/swc/issues/11920)) ([b6dfa74](https://github.com/swc-project/swc/commit/b6dfa74d9e518904f93a39ad05ab2e17e3229d2d))

- **(common)** Clamp sourcemap mappings inside UTF-8 characters ([#11918](https://github.com/swc-project/swc/pull/11918)) ([40c1601](https://github.com/swc-project/swc/commit/40c16011bc5487732483164886d8031f3f03cf79))

  **Crates:** `swc_common`, `swc_core`

- **(common)** Revert sourcemap multibyte mapping clamp ([#11919](https://github.com/swc-project/swc/pull/11919)) ([08b4200](https://github.com/swc-project/swc/commit/08b420000bce30b0d96d480201c852b2639fc680))

  **Crates:** `swc_common`, `swc_core`

- **(es)** Preserve parentheses for tagged template new callees ([#11922](https://github.com/swc-project/swc/pull/11922)) ([242a03a](https://github.com/swc-project/swc/commit/242a03a5fcd6542eab527dfdcb67590b0b477eba))

  **Crates:** `swc`, `swc_core`, `swc_ecma_transforms_base`

- **(es/codegen)** Emit `export as namespace` correctly ([#11923](https://github.com/swc-project/swc/pull/11923)) ([4e1f832](https://github.com/swc-project/swc/commit/4e1f8326295932d77faa3d617a5b7cb8ba993a38))

  **Crates:** `swc_core`, `swc_ecma_codegen`

- **(es/codegen)** Emit `export as namespace` minified correctly ([#11924](https://github.com/swc-project/swc/pull/11924)) ([7157499](https://github.com/swc-project/swc/commit/71574992dde5c4ef5de6a564ea096d48d739b6e2))

  **Crates:** `swc_core`, `swc_ecma_codegen`

- **(es/decorators)** Handle import types in decorator metadata ([#11916](https://github.com/swc-project/swc/pull/11916)) ([f411429](https://github.com/swc-project/swc/commit/f4114297983e1f62220f57caaa4e2138ab906f5d))

  **Crates:** `swc_core`, `swc_ecma_transforms`, `swc_ecma_transforms_proposal`

- **(es/decorators)** Revert 2022 decorator initializer ordering change ([#11901](https://github.com/swc-project/swc/pull/11901)) ([a3f23b1](https://github.com/swc-project/swc/commit/a3f23b10986654bcc7296283786d90934a39a53b))

  **Crates:** `swc_core`, `swc_ecma_transforms_base`, `swc_ecma_transforms_proposal`

- **(es/decorators)** Run 2022 field decorator initializers after field storage ([#11847](https://github.com/swc-project/swc/pull/11847)) ([3f1a4f5](https://github.com/swc-project/swc/commit/3f1a4f59670f58533d6f7545b671704d0ef469de))

  **Crates:** `swc_core`, `swc_ecma_transforms_base`, `swc_ecma_transforms_proposal`

- **(es/minifier)** Handle unknown member props in hoisted property optimization ([#11927](https://github.com/swc-project/swc/pull/11927)) ([e59ba68](https://github.com/swc-project/swc/commit/e59ba6890764a2f121c38df1a71d5f70e179b08d))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/parser)** Parse Flow async generic arrows and declare class anonymous function params ([#11926](https://github.com/swc-project/swc/pull/11926)) ([b9b8993](https://github.com/swc-project/swc/commit/b9b8993391168e6b83e9f84b3c4c063cf4ccd4f7))

  **Crates:** `swc_core`, `swc_ecma_parser`

- **(es/renamer)** Avoid duplicate mangled names across eval scope boundaries ([#11913](https://github.com/swc-project/swc/pull/11913)) ([4a1af84](https://github.com/swc-project/swc/commit/4a1af846d2cc0039b3a0d6e997f8c1c131e22a2b))

  **Crates:** `swc_core`, `swc_ecma_transforms_base`

- **(es2017)** Rewrite `this` in destructuring defaults for async class-field arrows ([#11909](https://github.com/swc-project/swc/pull/11909)) ([68af779](https://github.com/swc-project/swc/commit/68af779eff35120407a7147b3b60700c54db243c))

  **Crates:** `swc_core`, `swc_ecma_transformer`, `swc_ecma_transforms_compat`

- **(swc)** Preserve plugin error context in diagnostics ([#11904](https://github.com/swc-project/swc/pull/11904)) ([4e2e9fc](https://github.com/swc-project/swc/commit/4e2e9fc3900475085e3f426e59e81d3a51fa34fa))

  **Crates:** `swc`, `swc_core`

### Documentation

- Fix architecture fixer link ([#11911](https://github.com/swc-project/swc/issues/11911)) ([51cbc8c](https://github.com/swc-project/swc/commit/51cbc8c8d24021c59895c7787aa800d4a5fb4110))

### Performance

- **(atoms)** Optimize Atom equality checks ([#11902](https://github.com/swc-project/swc/pull/11902)) ([c6f8cb0](https://github.com/swc-project/swc/commit/c6f8cb087678bcaeb4ab7802a6f6805ef6ddd82c))

  **Crates:** `hstr`, `swc_atoms`, `swc_core`

## [1.15.40] - 2026-05-23

### Breaking Changes

- Update Rust dependency versions ([#11851](https://github.com/swc-project/swc/pull/11851)) ([20d92eb](https://github.com/swc-project/swc/commit/20d92eb3c8dee378f046a6bff839913600a1fbdb))

  **Crates:** `hstr`, `preset_env_base`, `swc`, `swc_atoms`, `swc_bundler`, `swc_common`, `swc_config`, `swc_core`, `swc_css_ast`, `swc_ecma_ast`, `swc_ecma_lints`, `swc_ecma_loader`, `swc_ecma_transforms_optimization`, `swc_html_ast`, `swc_node_comments`

### Bug Fixes

- **(es/minifier)** Avoid generating mangled property names that collide with existing properties ([#11839](https://github.com/swc-project/swc/pull/11839)) ([9b4fab5](https://github.com/swc-project/swc/commit/9b4fab58c90256a6da688de87ea405225a5a6fdb))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Fix typo in debug log ([#11866](https://github.com/swc-project/swc/pull/11866)) ([3de0254](https://github.com/swc-project/swc/commit/3de0254db7fae5a2883af78b8b7d57af4cb94531))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Preserve object props used through default parameters ([#11884](https://github.com/swc-project/swc/pull/11884)) ([71ff84f](https://github.com/swc-project/swc/commit/71ff84f19762306ab9b86accb29eb6ed83c46f84))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Preserve args for destructured callbacks ([#11830](https://github.com/swc-project/swc/issues/11830)) ([21873b0](https://github.com/swc-project/swc/commit/21873b06df3fd62d952a21cf879e14d11d4b39d7))

- **(es/minifier)** Respect ecma when emitting IIFE temp vars ([#11873](https://github.com/swc-project/swc/pull/11873)) ([e481934](https://github.com/swc-project/swc/commit/e481934a63c0ee891e4a770c4f0cd5ec3fd8624e))

  **Crates:** `swc`, `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Revert ecma-dependent IIFE temp var declarations ([#11878](https://github.com/swc-project/swc/pull/11878)) ([3b1a217](https://github.com/swc-project/swc/commit/3b1a217abbfc7d94c856dcfa0e7e57a8edc3812d))

  **Crates:** `swc`, `swc_core`, `swc_ecma_minifier`

- **(es/parser)** Reject object rest assignment to array or object literals ([#11881](https://github.com/swc-project/swc/pull/11881)) ([4ec2eaf](https://github.com/swc-project/swc/commit/4ec2eaf4d89ddd95293b8f09169a88b0434c5a13))

  **Crates:** `swc_core`, `swc_es_parser`

- **(es/parser)** Reject object rest assignment to array or object literals ([#11875](https://github.com/swc-project/swc/pull/11875)) ([7b57d1f](https://github.com/swc-project/swc/commit/7b57d1f8717d8bf6be0b617b04bc6e219a2b3775))

  **Crates:** `swc`, `swc_core`, `swc_ecma_parser`, `swc_ecma_transforms_optimization`, `swc_ecma_transforms_typescript`

- **(es/react)** Exclude self-recursive hooks from refresh dependency array ([86145f0](https://github.com/swc-project/swc/commit/86145f0fabd0fa5f3cebdab27f72ac051548e9dd))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/react)** Exclude self-recursive hooks from refresh dependency array ([#11838](https://github.com/swc-project/swc/pull/11838)) ([9101c71](https://github.com/swc-project/swc/commit/9101c719fa8f3f5cb410d716d4f50544650cd81e))

  **Crates:** `swc_core`, `swc_ecma_transforms_react`

- **(ts)** Handle assertion precedence in parser and fast strip ([#11828](https://github.com/swc-project/swc/pull/11828)) ([aa5b539](https://github.com/swc-project/swc/commit/aa5b539b277dbf4c68c87380d16f4b8713145df3))

  **Crates:** `swc_core`, `swc_ecma_parser`, `swc_ts_fast_strip`

- **(typescript)** Strip definite assertions in dts ([#11858](https://github.com/swc-project/swc/pull/11858)) ([2ab1b8a](https://github.com/swc-project/swc/commit/2ab1b8a50f2af3d8b4c42d6c4dd4f2051940cae0))

  **Crates:** `swc_core`, `swc_typescript`

- **(typescript)** Strip parameter binding defaults in dts ([#11857](https://github.com/swc-project/swc/pull/11857)) ([800bc17](https://github.com/swc-project/swc/commit/800bc170334a74191eb5ae21e3bfc96bf6f7fe56))

  **Crates:** `swc_core`, `swc_typescript`

### Documentation

- Clarify security scope for npm packages ([#11877](https://github.com/swc-project/swc/issues/11877)) ([4662db8](https://github.com/swc-project/swc/commit/4662db8fe3e503f298a285697ea63ecc1ca3b958))

- Add security policy ([#11876](https://github.com/swc-project/swc/issues/11876)) ([6c43c2d](https://github.com/swc-project/swc/commit/6c43c2de9cb9d5516b0ac87101345940964e943e))

- Clarify untrusted input security model ([#11882](https://github.com/swc-project/swc/issues/11882)) ([5463777](https://github.com/swc-project/swc/commit/546377770e164aead174404fb678319c9c56a9dc))

- Update agent guidance ([#11842](https://github.com/swc-project/swc/issues/11842)) ([bf2d015](https://github.com/swc-project/swc/commit/bf2d0154cf8b66fdab16085585fda0086d297a64))

### Features

- **(es/minifier)** Fine grained effect analysis of class ([#11814](https://github.com/swc-project/swc/pull/11814)) ([c9058ad](https://github.com/swc-project/swc/commit/c9058adb5bb7d6bbe354e6136685271f722354a0))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(swc_cli)** Implement all features for `swc_cli` ([#11797](https://github.com/swc-project/swc/pull/11797)) ([9300ede](https://github.com/swc-project/swc/commit/9300ede1d495463042da1db11754c76057a50954))

  **Crates:** `swc_cli_impl`, `swc_core`

### Miscellaneous Tasks

- **(html)** Add webcontainer fallback for `@swc/html` ([#11860](https://github.com/swc-project/swc/issues/11860)) ([7692eed](https://github.com/swc-project/swc/commit/7692eed981916bb01a3c4c231b3af012d4993d9e))

### Performance

- Optimize es parser comment finalization ([#11852](https://github.com/swc-project/swc/pull/11852)) ([2959ddf](https://github.com/swc-project/swc/commit/2959ddf87af0ac95eb5176180782819bd1073d66))

  **Crates:** `swc_core`, `swc_ecma_parser`

- **(ecma)** Reduce transformer compat overhead ([#11856](https://github.com/swc-project/swc/pull/11856)) ([d03cb71](https://github.com/swc-project/swc/commit/d03cb71fb8b39f01f0ad704473109294e52e07fd))

  **Crates:** `swc_core`, `swc_ecma_compat_common`, `swc_ecma_compat_es2015`, `swc_ecma_compat_es2016`, `swc_ecma_compat_es2017`, `swc_ecma_compat_es2018`, `swc_ecma_compat_es2019`, `swc_ecma_compat_es2020`, `swc_ecma_compat_es2021`, `swc_ecma_compat_es2022`, `swc_ecma_transformer`

- **(es/codegen)** Remove JsWriter last_srcmap cache ([#11869](https://github.com/swc-project/swc/issues/11869)) ([3bc1c2b](https://github.com/swc-project/swc/commit/3bc1c2b9b2594b05478dc4240977b981d6f8521b))

- **(es/codegen)** Speed up JsWriter position and srcmap tracking ([7366799](https://github.com/swc-project/swc/commit/7366799e485f472ffb4cd646ed564464815071ab))

  **Crates:** `swc_core`, `swc_ecma_codegen`

- **(es/codegen)** Speed up JsWriter position and srcmap tracking ([#11867](https://github.com/swc-project/swc/issues/11867)) ([dbceade](https://github.com/swc-project/swc/commit/dbceade22809ac9a9cb7548456ab335df26fb046))

- **(es/minifier)** Reduce minifier profiling hotspots ([#11853](https://github.com/swc-project/swc/pull/11853)) ([28c1091](https://github.com/swc-project/swc/commit/28c1091adb2c6f6d0e46daa5595908d1ba6fccb7))

  **Crates:** `swc_core`, `swc_ecma_minifier`, `swc_ecma_transforms_base`, `swc_ecma_transforms_optimization`, `swc_ecma_utils`

### Testing

- **(es/minifier)** Move issue_11835 fixture out of terser folder ([#11840](https://github.com/swc-project/swc/issues/11840)) ([3dd3431](https://github.com/swc-project/swc/commit/3dd34310d429baff6e8d1a6393266c648684d3c6))

### ci

- Fix publish musl linker and windows tests ([#11890](https://github.com/swc-project/swc/issues/11890)) ([a798a23](https://github.com/swc-project/swc/commit/a798a23e5f5018e5c01f874457aa20370c0d7058))

- Lock issues closed by merged prs ([#11887](https://github.com/swc-project/swc/issues/11887)) ([6bd74e5](https://github.com/swc-project/swc/commit/6bd74e5683ed43640db64f78dc74001a056c1bfa))

- Make minifier test path explicit ([#11891](https://github.com/swc-project/swc/issues/11891)) ([e7cba97](https://github.com/swc-project/swc/commit/e7cba972ff25565208c4448accab19c259e6947c))

- Pass publish docker env explicitly ([#11888](https://github.com/swc-project/swc/issues/11888)) ([c5f7547](https://github.com/swc-project/swc/commit/c5f7547cf68a4803aec3e88901e0d6b57ebbeb55))

- Provide aarch64 musl linker in publish job ([#11889](https://github.com/swc-project/swc/issues/11889)) ([20234fd](https://github.com/swc-project/swc/commit/20234fd265f8f86f0c81c31c36e467d405a04d01))

- Update corepack in publish docker jobs ([#11885](https://github.com/swc-project/swc/issues/11885)) ([9a7d954](https://github.com/swc-project/swc/commit/9a7d954c4939b12da4c60023eba50d6df8086fd7))

### security

- Save CI caches only on main ([#11848](https://github.com/swc-project/swc/issues/11848)) ([7582529](https://github.com/swc-project/swc/commit/75825293150b548216bf5c08531e1850bd064fcb))

- Harden PR workflow permissions ([#11849](https://github.com/swc-project/swc/issues/11849)) ([e199564](https://github.com/swc-project/swc/commit/e199564ebaae88ec121a777cf0ec4eec9644aed5))

## [1.15.33] - 2026-05-02

### Bug Fixes

- **(ci)** Update rand lockfile entries ([#11827](https://github.com/swc-project/swc/issues/11827)) ([7988966](https://github.com/swc-project/swc/commit/7988966eb33d2404fe588ec50345100ea57a3cf4))

- **(es/minifier)** Fold unary bool nullish coalescing ([#11826](https://github.com/swc-project/swc/pull/11826)) ([e39ae3d](https://github.com/swc-project/swc/commit/e39ae3d3489373414ef23177b82f0ab77250a1f2))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Preserve for-init sequence order ([#11837](https://github.com/swc-project/swc/pull/11837)) ([16a56d0](https://github.com/swc-project/swc/commit/16a56d031fd801796df6b648bc533b97e27b39f8))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/parser)** Parse empty Flow exact object type ([#11836](https://github.com/swc-project/swc/pull/11836)) ([3d18a26](https://github.com/swc-project/swc/commit/3d18a2673a69e6e6172c161815fd576c41d59330))

  **Crates:** `swc_core`, `swc_ecma_parser`

### Features

- Move swc ast explorer into workspace ([#11831](https://github.com/swc-project/swc/issues/11831)) ([02a8f81](https://github.com/swc-project/swc/commit/02a8f8123bdec3e8291a2f82ccf01d3e44114c49))

## [1.15.32] - 2026-04-27

### Breaking Changes

- [codex] Fix Flow type-only modules in script transforms ([#11817](https://github.com/swc-project/swc/pull/11817)) ([be38316](https://github.com/swc-project/swc/commit/be38316f9a7242f2d3765503216b9c3116021b1c))

  **Crates:** `swc`, `swc_ecma_transforms_typescript`

- **(es)** Add `jsc.preserveSymlinks` option to opt out of symlink canonicalization in the module transform resolver ([#11813](https://github.com/swc-project/swc/pull/11813)) ([fe38342](https://github.com/swc-project/swc/commit/fe38342b8fa960b430300f2491a5695c09debf4c))

  **Crates:** `swc`, `swc_core`

### Bug Fixes

- **(es/flow)** Avoid restoring module context when flow syntax is enabled ([#11819](https://github.com/swc-project/swc/issues/11819)) ([3ed7243](https://github.com/swc-project/swc/commit/3ed724389a55847f5e236421c23f2cd85a7208b3))

- **(minifier)** Preserve frozen spread registry keys ([#11825](https://github.com/swc-project/swc/pull/11825)) ([347181c](https://github.com/swc-project/swc/commit/347181c45717431a64cb60e0d6ccbe667322a809))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(parser)** Align Flow generic arrow JSX disambiguation ([#11821](https://github.com/swc-project/swc/pull/11821)) ([28a7fad](https://github.com/swc-project/swc/commit/28a7fadc2acf95500d934988617b73f0debf5a53))

  **Crates:** `swc_core`, `swc_ecma_lexer`, `swc_ecma_parser`

## [1.15.30] - 2026-04-19

### Breaking Changes

- [codex] Add Flow strip RN and RNW regression corpus ([#11799](https://github.com/swc-project/swc/pull/11799)) ([23a9109](https://github.com/swc-project/swc/commit/23a9109396dc1fcd496e2fbf90552fce0d5ca55b))

  **Crates:** `swc_ecma_parser`, `swc_ecma_transforms_typescript`

- Minify comments ([857c0b6](https://github.com/swc-project/swc/commit/857c0b66b6027e3367ac2374bfff34439accc893))

  **Crates:** `swc_compiler_base`, `swc_ecma_minifier`

- **(es/module)** Add opt-in symlink-preserving resolver ([#11801](https://github.com/swc-project/swc/pull/11801)) ([6028240](https://github.com/swc-project/swc/commit/6028240017608aac8d80d2c1ff37cf9f13534af6))

  **Crates:** `swc_ecma_transforms_module`

### Bug Fixes

- **(deploy)** Fix musl binding test workflow ([#11804](https://github.com/swc-project/swc/issues/11804)) ([c30a522](https://github.com/swc-project/swc/commit/c30a5226920311a26f2b9692d057a50b18266d30))

- **(deploy)** Build package ts before Linux GNU binding tests ([#11806](https://github.com/swc-project/swc/issues/11806)) ([a3d3ef3](https://github.com/swc-project/swc/commit/a3d3ef3924a80e19101a9735bf357ac14cd68fbc))

- **(es/parser)** Allow return type annotation on Flow constructors ([#11790](https://github.com/swc-project/swc/pull/11790)) ([d66b29c](https://github.com/swc-project/swc/commit/d66b29c11d7e9709906e7c6ba6a98fcde428ca65))

  **Crates:** `swc_core`, `swc_ecma_parser`

- **(parser)** Support Flow anonymous keyof indexers ([#11792](https://github.com/swc-project/swc/pull/11792)) ([452c4e5](https://github.com/swc-project/swc/commit/452c4e59e6230e36ab2ef19608d214b72d3baf72))

  **Crates:** `swc_core`, `swc_ecma_parser`

### Documentation

- Require PR template for pull requests ([#11793](https://github.com/swc-project/swc/issues/11793)) ([3a1084a](https://github.com/swc-project/swc/commit/3a1084ad1860afdbea2703f13030c3baaaf778db))

### Features

- **(es/minify)** Support extracting comments ([#11798](https://github.com/swc-project/swc/issues/11798)) ([5986411](https://github.com/swc-project/swc/commit/5986411655d7b9e3a1d4e401de9fbda94164c0a3))

### Other Changes

- [codex] Preserve quoted JSX attribute newlines ([#11796](https://github.com/swc-project/swc/pull/11796)) ([9fe56c8](https://github.com/swc-project/swc/commit/9fe56c88553bb79254a7a5e991bfedc5f6c689e1))

  **Crates:** `swc_core`, `swc_ecma_transforms_react`

- [codex] Support full ES version parsing in minify ([#11800](https://github.com/swc-project/swc/pull/11800)) ([af1f08f](https://github.com/swc-project/swc/commit/af1f08f09e749392815f0449ffac2bdd62a5b0e3))

  **Crates:** `swc_core`, `swc_ecma_minifier`

## [1.15.26] - 2026-04-14

### Breaking Changes

- **(swc_ecma_minifier, swc_config)** Add Hash/Eq for options and CachedRegex ([#11775](https://github.com/swc-project/swc/pull/11775)) ([86a4c38](https://github.com/swc-project/swc/commit/86a4c383b8da40a53bad1b1b5098227d3087927c))

  **Crates:** `swc_ecma_minifier`

### Bug Fixes

- **(decorators)** Preserve super in moved static members ([#11781](https://github.com/swc-project/swc/pull/11781)) ([778328e](https://github.com/swc-project/swc/commit/778328e5b40232b311e33e0dede4f1f53e523c4a))

  **Crates:** `swc_core`, `swc_ecma_transforms_proposal`

- **(es/decorators)** Scope moved static super rewrite ([#11782](https://github.com/swc-project/swc/issues/11782)) ([f73cacc](https://github.com/swc-project/swc/commit/f73cacca16c628cf59820eddb6594fd08f124d6d))

- **(es/parser)** Parse mixed Flow anonymous callable params (#11785) ([#11786](https://github.com/swc-project/swc/pull/11786)) ([05e7b69](https://github.com/swc-project/swc/commit/05e7b69373d3b1e4957f557cb3d640b59998d8a7))

  **Crates:** `swc_core`, `swc_ecma_parser`

- **(es/transforms)** Rewrite class references in non-static members ([#11772](https://github.com/swc-project/swc/pull/11772)) ([fff1426](https://github.com/swc-project/swc/commit/fff1426c86cd47d0d879c5e7c4f029c4adb132e7))

  **Crates:** `swc_core`, `swc_ecma_transforms_proposal`

- **(es/typescript)** Handle TypeScript expressions in enum transformation ([#11769](https://github.com/swc-project/swc/pull/11769)) ([85aa4a8](https://github.com/swc-project/swc/commit/85aa4a8b95f08d97df47d11f5c2fd11f7db97381))

  **Crates:** `swc_core`, `swc_ecma_transforms_base`, `swc_ecma_transforms_typescript`

### Features

- **(swc_common)** Add SourceMapper.map_raw_pos ([#11777](https://github.com/swc-project/swc/pull/11777)) ([7d2e94c](https://github.com/swc-project/swc/commit/7d2e94ce379ba8fc738a5697299cdb9a3c748e8a))

  **Crates:** `swc_common`, `swc_core`, `swc_ecma_codegen`

- **(swc_ecma_minifier, swc_config)** Add Hash/Eq for options and CachedRegex ([#11775](https://github.com/swc-project/swc/pull/11775)) ([86a4c38](https://github.com/swc-project/swc/commit/86a4c383b8da40a53bad1b1b5098227d3087927c))

  **Crates:** `swc_config`, `swc_core`, `swc_ecma_minifier`

### Other Changes

- [codex] Document Flow strip support ([#11778](https://github.com/swc-project/swc/pull/11778)) ([8f176cc](https://github.com/swc-project/swc/commit/8f176cc907093bc80c6792744ea215b69ff62efb))

  **Crates:** `swc_core`, `swc_ecma_parser`, `swc_ecma_transforms_typescript`

- **(es/minifier)** Inline into shorthand prop early ([#11766](https://github.com/swc-project/swc/pull/11766)) ([450bdfa](https://github.com/swc-project/swc/commit/450bdfa14f61ca008f5399d7292d5d9bc5e07380))

  **Crates:** `swc_core`, `swc_ecma_minifier`, `swc_ecma_transforms_base`, `swc_ecma_utils`

### Performance

- **(swc)** Use larger input for es/full benchmarks ([#11779](https://github.com/swc-project/swc/issues/11779)) ([4409920](https://github.com/swc-project/swc/commit/44099207878c2e7f6ec75379040402057ad4f97b))

### build

- Update `rustc` to `nightly-2026-04-10` ([#11783](https://github.com/swc-project/swc/issues/11783)) ([6facc79](https://github.com/swc-project/swc/commit/6facc79dc4022e9a31dcb1c7e8952917f88867e9))

## [1.15.24] - 2026-04-04

### Breaking Changes

- **(es/common)** Make `eat_byte` unsafe to prevent UTF-8 boundary violation ([#11731](https://github.com/swc-project/swc/pull/11731)) ([669a659](https://github.com/swc-project/swc/commit/669a659c6e29c12eba793e646c6b29002782a84c))

  **Crates:** `swc_common`

- **(es/minifier)** Remove useless arguments for non inlined callee ([#11645](https://github.com/swc-project/swc/pull/11645)) ([bab249e](https://github.com/swc-project/swc/commit/bab249ef031f71ebe4089b15a03b435d7258e895))

  **Crates:** `swc_ecma_usage_analyzer`

- **(minifier)** Inline usage analyzer and remove crate ([#11750](https://github.com/swc-project/swc/pull/11750)) ([7d8d11b](https://github.com/swc-project/swc/commit/7d8d11b53ad046cafce6aff76672df41ad276615))

  **Crates:** `swc_ecma_minifier`

- **(swc_ecma_react_compiler)** Remove compiler impl and keep fast_check ([#11753](https://github.com/swc-project/swc/pull/11753)) ([f21d336](https://github.com/swc-project/swc/commit/f21d33629033f305d300d91982d0a87bc807e427))

  **Crates:** `swc_ecma_react_compiler`

### Bug Fixes

- **(decorators)** Scope 2023-11 implicit-global rewrite to decorator-lifted exprs ([#11743](https://github.com/swc-project/swc/pull/11743)) ([1c01bbb](https://github.com/swc-project/swc/commit/1c01bbb46ddb33b380b8216235c1e6f2767d0aae))

  **Crates:** `swc_core`, `swc_ecma_transforms_proposal`

- **(es/minifier)** Handle `toExponential(undefined)` ([#11583](https://github.com/swc-project/swc/issues/11583)) ([cd94a31](https://github.com/swc-project/swc/commit/cd94a3141621cec617dac7e84c50070cd598ec46))

- **(es/minifier)** Inline prop shorthand in computed props ([#11760](https://github.com/swc-project/swc/pull/11760)) ([71feafb](https://github.com/swc-project/swc/commit/71feafb4bc79883a558164e9543ae4ecedc9187e))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/parser)** Close remaining Flow parser gaps for #11729 (phase 2) ([#11740](https://github.com/swc-project/swc/issues/11740)) ([8d36f05](https://github.com/swc-project/swc/commit/8d36f05499f7e2cc5c568227d05e5f912e01509b))

- **(es/regexp)** Preserve source for wrapped named groups ([#11757](https://github.com/swc-project/swc/pull/11757)) ([7e56fe5](https://github.com/swc-project/swc/commit/7e56fe5cb4dfc3fc1758e2139949107d5eaa8e47))

  **Crates:** `swc_core`, `swc_ecma_transformer`, `swc_ecma_transforms_base`

- **(html)** Keep </p> for span-parent paragraphs ([#11756](https://github.com/swc-project/swc/pull/11756)) ([ede9950](https://github.com/swc-project/swc/commit/ede9950d35cdd4968331ac0111cdb413e60f3438))

  **Crates:** `swc_core`, `swc_html_codegen`

- **(minifier)** Cap deep if_return conditional chains ([#11758](https://github.com/swc-project/swc/pull/11758)) ([a92fa3e](https://github.com/swc-project/swc/commit/a92fa3e8e27f604186a2393284d3deb67a9146f1))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(parser)** Parse key Flow forms from #11729 (phase 1) ([#11733](https://github.com/swc-project/swc/pull/11733)) ([886fe53](https://github.com/swc-project/swc/commit/886fe533ad7edfb13804be3a779eccb160cf69e7))

  **Crates:** `swc_core`, `swc_ecma_parser`

### Features

- **(react-compiler)** M1 memo validators + lint gating alignment ([#11739](https://github.com/swc-project/swc/issues/11739)) ([7e1ad26](https://github.com/swc-project/swc/commit/7e1ad26b49295085208c2e4ddfb175c479da53bc))

- **(react-compiler)** Advance SWC parity for upstream fixtures ([#11724](https://github.com/swc-project/swc/issues/11724)) ([468da70](https://github.com/swc-project/swc/commit/468da70bbdf876e44155fda09cbca7ee939fa68f))

- **(react-compiler)** Continue swc parity for dependency handling ([#11747](https://github.com/swc-project/swc/issues/11747)) ([83688c8](https://github.com/swc-project/swc/commit/83688c8af8695b895d871a4d6d9530d89fcba2a9))

- **(react-compiler)** Improve SWC parity for early-return and hooks validation ([#11738](https://github.com/swc-project/swc/issues/11738)) ([4739c58](https://github.com/swc-project/swc/commit/4739c586d0deb88d3d536835adb873b9c036bef5))

- **(react-compiler)** Improve Stage A diagnostic parity and validation aggregation ([#11745](https://github.com/swc-project/swc/issues/11745)) ([0e2075e](https://github.com/swc-project/swc/commit/0e2075e4addc9771dbe5388b6d30fd4344308bd1))

- **(react-compiler)** Tighten core validation parity for upstream fixtures ([#11734](https://github.com/swc-project/swc/issues/11734)) ([7e2cf8d](https://github.com/swc-project/swc/commit/7e2cf8d46a6f41967b93858d9f3269ae46370d14))

### Miscellaneous Tasks

- Update cargo-mono to 0.6.5 in CI ([#11765](https://github.com/swc-project/swc/pull/11765)) ([43a2c54](https://github.com/swc-project/swc/commit/43a2c549140827a9fcf2d76afa996f865d1d7c15))

  **Crates:** `swc_core`

### ci

- Add manual Publish crates workflow ([#11763](https://github.com/swc-project/swc/issues/11763)) ([169c961](https://github.com/swc-project/swc/commit/169c96107357653fa0d1c0feb715aa2312481e0a))

- Add misc npm publish workflow ([#11764](https://github.com/swc-project/swc/issues/11764)) ([236eff0](https://github.com/swc-project/swc/commit/236eff01dd30e780596ed33704b85bf91491bc10))

## [1.15.21] - 2026-03-22

### Breaking Changes

- **(es/minifier)** Use arguments data from scope ([#11604](https://github.com/swc-project/swc/pull/11604)) ([4738539](https://github.com/swc-project/swc/commit/473853951651a013c896122b88d5fb7db43c2412))

  **Crates:** `swc_ecma_usage_analyzer`

- **(flow-strip)** Normalize module await bindings for Hermes parity ([#11703](https://github.com/swc-project/swc/pull/11703)) ([73d8761](https://github.com/swc-project/swc/commit/73d87616f5db5146fac774cd60d5ec18195140c3))

  **Crates:** `swc_ecma_transforms_typescript`

- **(parser)** Add flow syntax mode and strip integration ([#11685](https://github.com/swc-project/swc/pull/11685)) ([015bbe8](https://github.com/swc-project/swc/commit/015bbe8759da1a57a33dd8c7791bc835e4150034))

  **Crates:** `swc_ecma_parser`

- **(proposal)** Add decorators 2023-11 support with Babel parity ([#11686](https://github.com/swc-project/swc/pull/11686)) ([e96eb6a](https://github.com/swc-project/swc/commit/e96eb6a82897f80910e9cf81ae5b0649a0a0855a))

  **Crates:** `swc_ecma_transforms_proposal`

- **(react-compiler)** Scaffold SWC port of Babel entrypoint ([#11687](https://github.com/swc-project/swc/pull/11687)) ([4a1d3ce](https://github.com/swc-project/swc/commit/4a1d3ce3175428a4113eda8f4bc7b07ccb18b60f))

  **Crates:** `swc_ecma_react_compiler`

### Bug Fixes

- Update lz4_flex to resolve RUSTSEC-2026-0041 ([#11701](https://github.com/swc-project/swc/issues/11701)) ([7528507](https://github.com/swc-project/swc/commit/7528507bc6d3fb723742e62abb156d510fba1329))

- **(cli)** Honor externalHelpers=false in rust binary ([#11693](https://github.com/swc-project/swc/pull/11693)) ([1be052e](https://github.com/swc-project/swc/commit/1be052e36154ed0382aeb93a4ff8f9e441ffbdca))

  **Crates:** `swc_cli_impl`

- **(cli)** Skip mkdir when --out-file targets the current directory ([#11720](https://github.com/swc-project/swc/issues/11720)) ([f3f4e51](https://github.com/swc-project/swc/commit/f3f4e51cedb3051a7c75c0cdecaa17e1d276597f))

- **(es/base)** Wrap new opt chain ([#11618](https://github.com/swc-project/swc/pull/11618)) ([fdcd184](https://github.com/swc-project/swc/commit/fdcd184a2ad3295015faf51fde62dbe4b700515e))

  **Crates:** `swc_core`, `swc_ecma_transforms_base`

- **(es/decorators)** Resolve 2022-03 issues #9565/#9078/#9079 and add regressions ([#11698](https://github.com/swc-project/swc/issues/11698)) ([a025d2b](https://github.com/swc-project/swc/commit/a025d2bc2fa482b675084f5802865cd02c8b63c4))

- **(es/module)** Preserve explicit index.js import path when baseUrl is set ([#11597](https://github.com/swc-project/swc/pull/11597)) ([830dbeb](https://github.com/swc-project/swc/commit/830dbeb44f3bf6faf807808d596d970442b6e6e3))

  **Crates:** `swc_core`, `swc_ecma_transforms_module`

- **(es/regexp)** Implement transform-named-capturing-groups-regex ([#11642](https://github.com/swc-project/swc/pull/11642)) ([f62bfa9](https://github.com/swc-project/swc/commit/f62bfa90701cdcfe87af082d5104f0c1e2dd7e0d))

  **Crates:** `swc_core`, `swc_ecma_transformer`, `swc_ecma_transforms_base`

- **(es/transforms)** Avoid rewriting unknown relative extensions ([#11713](https://github.com/swc-project/swc/pull/11713)) ([ed09218](https://github.com/swc-project/swc/commit/ed092184839057467702976ad43ed4e3f902dc6b))

  **Crates:** `swc_core`, `swc_ecma_transforms_module`

- **(es/types)** Add new options types ([#11683](https://github.com/swc-project/swc/issues/11683)) ([62eeee1](https://github.com/swc-project/swc/commit/62eeee15324a6aa25a2e17d497f1d41900cbac99))

- **(swc_ecma_minifier)** Fixed compatibility for wasm plugin (swc_ast_unknown) ([#11641](https://github.com/swc-project/swc/pull/11641)) ([abd0e45](https://github.com/swc-project/swc/commit/abd0e45fb9cee9f79fb58d3a520f9ff92ecf4566))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(swc_malloc)** Fallback to system allocator on linux gnu s390x/powerpc ([#11606](https://github.com/swc-project/swc/pull/11606)) ([e103fac](https://github.com/swc-project/swc/commit/e103facd4451349478efbaf8caaf89294d4780f9))

  **Crates:** `swc_core`, `swc_malloc`

### Documentation

- Move parser design guidance into AGENTS.md ([#11600](https://github.com/swc-project/swc/issues/11600)) ([e6e91a3](https://github.com/swc-project/swc/commit/e6e91a3d525774fb3453ebda64793d3d253771b5))

- Clarify workaround comment requirement in AGENTS ([#11700](https://github.com/swc-project/swc/issues/11700)) ([e2ad6f6](https://github.com/swc-project/swc/commit/e2ad6f61c882b6b302d886268170560087cd5684))

- **(agents)** Add AGENTS two-pass rules for es crates ([#11634](https://github.com/swc-project/swc/issues/11634)) ([12af4a1](https://github.com/swc-project/swc/commit/12af4a1fcffff0bcefaa5ca766914d1aae2c7847))

- **(agents)** Improve guidance ([#11626](https://github.com/swc-project/swc/issues/11626)) ([1cdfec9](https://github.com/swc-project/swc/commit/1cdfec9f298d0979f40d2be5a227ea4dc973138b))

### Features

- Complete core parity parser coverage ([#11603](https://github.com/swc-project/swc/issues/11603)) ([18e0edc](https://github.com/swc-project/swc/commit/18e0edce9ebdd50508c9e60f50d1adf5a286e865))

- **(bindings)** Add linux ppc64le and s390x support across npm bindings ([#11602](https://github.com/swc-project/swc/issues/11602)) ([357255d](https://github.com/swc-project/swc/commit/357255d56d4cc61b55be27a4b052f2f3019d018d))

- **(bindings)** Enable flow strip support in @swc/core ([#11696](https://github.com/swc-project/swc/issues/11696)) ([93da89a](https://github.com/swc-project/swc/commit/93da89a272408ec5d4cf43d9c087774794661657))

- **(cli)** Enable Flow strip support in swc_cli_impl ([#11705](https://github.com/swc-project/swc/issues/11705)) ([0ea9950](https://github.com/swc-project/swc/commit/0ea99502686a43bf33c397ef47fad344de78abb9))

- **(dbg-swc)** Add flow strip verification command ([#11706](https://github.com/swc-project/swc/issues/11706)) ([77b7854](https://github.com/swc-project/swc/commit/77b7854046b584a933935b9252fd6df183828409))

- **(es)** Add `swc_es_codegen` for `swc_es_ast` ([#11628](https://github.com/swc-project/swc/issues/11628)) ([c282d86](https://github.com/swc-project/swc/commit/c282d8616b4626ba880096e356ad1200108def9e))

- **(es)** Add 2-pass transformer and minifier crates ([#11632](https://github.com/swc-project/swc/issues/11632)) ([f70a4b7](https://github.com/swc-project/swc/commit/f70a4b7c15324a0d7d771e11ff1ab738f964e43b))

- **(es)** Add TypeScript + React transforms and tsc corpus tests ([#11635](https://github.com/swc-project/swc/issues/11635)) ([09a5d8d](https://github.com/swc-project/swc/commit/09a5d8d39f65684f4dc88558b92804dcb19a1c0b))

- **(es/helpers)** Prevent recursive instanceof helper transforms ([#11609](https://github.com/swc-project/swc/issues/11609)) ([cb755a3](https://github.com/swc-project/swc/commit/cb755a3260aac2a1aaeab8ccf0458b783607511b))

- **(es/parser)** Add `with_capacity` for `Capturing` ([#11679](https://github.com/swc-project/swc/issues/11679)) ([60df582](https://github.com/swc-project/swc/commit/60df58288867757038c6eec45ccc54bf1799f10c))

- **(es/parser)** Add Hermes Flow parity harness and fixes ([#11699](https://github.com/swc-project/swc/issues/11699)) ([918b6ac](https://github.com/swc-project/swc/commit/918b6ac1f5ca151aa70b6b5f4fcb2443be80eacb))

- **(es/parser)** Complete Hermes Flow stripping parity ([#11702](https://github.com/swc-project/swc/issues/11702)) ([f041f4c](https://github.com/swc-project/swc/commit/f041f4c2f2c757489a2c1194fe03d890052d131e))

- **(es/parser)** Extend flow declare export strip compatibility ([#11691](https://github.com/swc-project/swc/issues/11691)) ([a8315aa](https://github.com/swc-project/swc/commit/a8315aaea70d2b9dcd5da56b5726190c84ed3036))

- **(es/parser)** Finish flow strip support for core syntax gaps ([#11689](https://github.com/swc-project/swc/issues/11689)) ([584a12f](https://github.com/swc-project/swc/commit/584a12f6fa15f4beaf030fa6224ba77be1874e0f))

- **(es/parser)** Support Flow declare export default interface strip path ([#11692](https://github.com/swc-project/swc/issues/11692)) ([588577c](https://github.com/swc-project/swc/commit/588577c5c2541ae0d4c198648ba74265eb05dc39))

- **(es/react-compiler)** Advance strict upstream parity ([#11709](https://github.com/swc-project/swc/issues/11709)) ([9b3abe0](https://github.com/swc-project/swc/commit/9b3abe078f86db7e6cc80b7cd1c3c1150c41a71a))

- **(es/react-compiler)** Advance upstream fixture parity pipeline ([#11716](https://github.com/swc-project/swc/issues/11716)) ([33fe6f2](https://github.com/swc-project/swc/commit/33fe6f26aa4a5dcc6542d752632e75b4f3595e7d))

- **(es/react-compiler)** Phase1 crate API baseline and fixture harness ([#11690](https://github.com/swc-project/swc/issues/11690)) ([31364dc](https://github.com/swc-project/swc/commit/31364dcb26860e49ff64f60fa60d4b5cd39b199d))

- **(es/react-compiler)** Strict upstream parity finalization (crate-only, WIP) ([#11697](https://github.com/swc-project/swc/issues/11697)) ([a3994aa](https://github.com/swc-project/swc/commit/a3994aa5f853836c528614a89e435fc5eacb7f13))

- **(es/semantics)** Add scope analysis and statement-level cfg ([#11623](https://github.com/swc-project/swc/issues/11623)) ([86815b1](https://github.com/swc-project/swc/commit/86815b1e9cecd2c0b67c17c5d4ba2b99f904b355))

- **(es_parser)** Complete parity suite with zero ignores ([#11615](https://github.com/swc-project/swc/issues/11615)) ([ee3fdd5](https://github.com/swc-project/swc/commit/ee3fdd553564a1af8490ff1f2b1d1b74c8574ba9))

- **(es_parser)** Expand benchmark corpus ([#11633](https://github.com/swc-project/swc/issues/11633)) ([ff3adef](https://github.com/swc-project/swc/commit/ff3adef43b0b49a611f1f1704400ca20ec1111f3))

- **(es_parser)** Complete internal parser wiring without ecma runtime dep ([#11622](https://github.com/swc-project/swc/issues/11622)) ([1c51891](https://github.com/swc-project/swc/commit/1c518913a5abd64e60fe7fa5c5ece856a2861147))

- **(react-compiler)** Advance SWC upstream fixture parity ([#11718](https://github.com/swc-project/swc/issues/11718)) ([e8d1696](https://github.com/swc-project/swc/commit/e8d16969b74d21f13b1594ef71ceef3d550d0a59))

- **(react-compiler)** Improve lint rename and gating parity ([#11721](https://github.com/swc-project/swc/issues/11721)) ([5f89ee7](https://github.com/swc-project/swc/commit/5f89ee70d5af99a382a8f8ca16ba913b1ddd746e))

- **(swc_es_parser)** Close parity gaps with full core/large fixture pass-fail parity ([#11614](https://github.com/swc-project/swc/issues/11614)) ([3085f52](https://github.com/swc-project/swc/commit/3085f52a0f2aafc194d01a4394ddce72c455c6a5))

- **(swc_es_parser)** Complete lossless modeling for with/TS module/decorators ([#11613](https://github.com/swc-project/swc/issues/11613)) ([59b1189](https://github.com/swc-project/swc/commit/59b11898fe247382bed44fddfb29c9592050b8bc))

- **(swc_es_parser)** Enforce full parity suite and extend grammar surface ([#11611](https://github.com/swc-project/swc/issues/11611)) ([585f7d0](https://github.com/swc-project/swc/commit/585f7d07a44b2508b05d6b07e9fcd83cb5cb7185))

### Other Changes

- **(es/minifier)** Use arguments data from scope ([9231f70](https://github.com/swc-project/swc/commit/9231f7072b23cc7599ae1338044c1a46067a879b))

  **Crates:** `swc_core`, `swc_ecma_transforms_base`

### Performance

- **(es/modules)** Avoid export sort key clones ([#11669](https://github.com/swc-project/swc/issues/11669)) ([e74e17d](https://github.com/swc-project/swc/commit/e74e17dcf2e23ced12e199d05146e88a55b6174f))

- **(es/parser)** Optimize underscore stripping in numeric literal hot path ([#11670](https://github.com/swc-project/swc/issues/11670)) ([874338b](https://github.com/swc-project/swc/commit/874338b77f93b22cebc58d4ec4b43fe02bebb7e2))

- **(es/parser)** Reduce JSX identifier rescan allocations ([#11671](https://github.com/swc-project/swc/issues/11671)) ([f9214fe](https://github.com/swc-project/swc/commit/f9214fed47818f2df75865645ef6a3358300d86a))

- **(es/transformer)** Remove O(n^2) statement mutation hotspots ([#11672](https://github.com/swc-project/swc/issues/11672)) ([bdc24b7](https://github.com/swc-project/swc/commit/bdc24b7fdc006c77f4b5303bf4ff903b71fd8bcb))

- **(es_parser)** Byte-search lexer optimization pass ([#11616](https://github.com/swc-project/swc/issues/11616)) ([607f2db](https://github.com/swc-project/swc/commit/607f2dbba4cdc681447657f07bda10c0533d0d7f))

- **(es_parser)** Reduce lookahead and allocation overhead ([#11673](https://github.com/swc-project/swc/issues/11673)) ([becd9b0](https://github.com/swc-project/swc/commit/becd9b0352db53611cd7ab3f922ff3b1f89d73fe))

- **(ts/fast-strip)** Avoid token capture in default transform path ([#11668](https://github.com/swc-project/swc/issues/11668)) ([06aa0db](https://github.com/swc-project/swc/commit/06aa0db37d19ddec7f3255f92eef84f07c7f2d61))

### Testing

- Expand swc_es_parser snapshot suites (ecma-style) ([#11621](https://github.com/swc-project/swc/issues/11621)) ([325170f](https://github.com/swc-project/swc/commit/325170fff9b5c99abe1da19ec63fe6d2d8c6a9bb))

- Move TS decorator fixtures out of proposal crate ([#11723](https://github.com/swc-project/swc/issues/11723)) ([e29d58c](https://github.com/swc-project/swc/commit/e29d58c74b345dc783b8132bea15439f8dcd4119))

- **(es/flow)** Add flow strip corpus correctness test ([#11694](https://github.com/swc-project/swc/issues/11694)) ([cd5ed81](https://github.com/swc-project/swc/commit/cd5ed813da185d8aacc3d9bf7a64acb2e1c32116))

- **(es/parser)** Enforce full ecma fixture parity ([#11637](https://github.com/swc-project/swc/issues/11637)) ([0bf8a46](https://github.com/swc-project/swc/commit/0bf8a4656011bdfeb80afb94fb8f2764739d099e))

- **(es/parser)** Expand flow strip fixture coverage ([#11695](https://github.com/swc-project/swc/issues/11695)) ([e231262](https://github.com/swc-project/swc/commit/e23126212595d32265e0d4478592a15dc9e0ceef))

- **(es_parser)** Add core snapshot suite ([#11617](https://github.com/swc-project/swc/issues/11617)) ([23c56fe](https://github.com/swc-project/swc/commit/23c56fe60f60689994e3cc2b08301886cd0cea65))

- **(es_parser)** Recover swc_es_parser benchmark coverage ([#11640](https://github.com/swc-project/swc/issues/11640)) ([0f24ee1](https://github.com/swc-project/swc/commit/0f24ee1dfdea41e7e22218fd3bfc466772d557b7))

- **(es_parser)** De-arenaize ecma_reuse fixture snapshots ([#11639](https://github.com/swc-project/swc/issues/11639)) ([aa6727a](https://github.com/swc-project/swc/commit/aa6727a26dac1a8802ea06d35b5c3ac1ff7633f4))

### ci

- Bump cargo-mono to 0.5.0 ([#11605](https://github.com/swc-project/swc/issues/11605)) ([7118713](https://github.com/swc-project/swc/commit/7118713176d7d2c244c1c7c637dbfa7ffa37f167))

- Remove --no-verify flag from cargo mono publish ([02eb5ec](https://github.com/swc-project/swc/commit/02eb5ec20ea24a90c577991d6bb756b346c9c6a3))

- Bump cargo-mono to 0.5.3 ([#11722](https://github.com/swc-project/swc/issues/11722)) ([b5272af](https://github.com/swc-project/swc/commit/b5272af0f80047ffb98a1eed5de1f1d391657aa2))

- Install zig for core ppc64le/s390x nightly cross builds ([#11725](https://github.com/swc-project/swc/issues/11725)) ([09c4be0](https://github.com/swc-project/swc/commit/09c4be00656d2d64e80ffb0ae250c53db645a39c))

- Optimize cargo-test matrix with cargo mono changed ([#11681](https://github.com/swc-project/swc/issues/11681)) ([99e61c4](https://github.com/swc-project/swc/commit/99e61c4cc172b772437dcabcf8f937a8f24dc4bd))

## [1.15.18] - 2026-03-01

### Bug Fixes

- **(html/wasm)** Publish @swc/html-wasm for nodejs ([#11601](https://github.com/swc-project/swc/issues/11601)) ([bd443f5](https://github.com/swc-project/swc/commit/bd443f582c553e9d898a1d5e7395abaad60b26d2))

### Documentation

- Add AGENTS note about next-gen ast ([#11592](https://github.com/swc-project/swc/issues/11592)) ([80b4be8](https://github.com/swc-project/swc/commit/80b4be872d85dc82cbb6e84c91fe102d807a2780))

- Add typescript-eslint AST compatibility note ([#11598](https://github.com/swc-project/swc/issues/11598)) ([c7bfebe](https://github.com/swc-project/swc/commit/c7bfebec4fb691e6e49f3c3b7b257be178e7f238))

### Features

- **(es/ast)** Add runtime arena crate and bootstrap swc_es_ast ([#11588](https://github.com/swc-project/swc/issues/11588)) ([7a06d96](https://github.com/swc-project/swc/commit/7a06d967e43fe2f84078fc241bc655b41450d2c1))

- **(es/parser)** Add `swc_es_parser` ([#11593](https://github.com/swc-project/swc/issues/11593)) ([f11fd70](https://github.com/swc-project/swc/commit/f11fd705ee84909f6b0f984b1b5fc35abf73ec05))

### ci

- Triage main CI breakage ([#11589](https://github.com/swc-project/swc/issues/11589)) ([075af57](https://github.com/swc-project/swc/commit/075af578c46c0bfdb74c450c157d0e1753024a36))

## [1.15.17] - 2026-02-26

### Breaking Changes

- Emit ECMA-426 source map scopes behind experimental flag ([#11582](https://github.com/swc-project/swc/pull/11582)) ([2385a22](https://github.com/swc-project/swc/commit/2385a2279ee71abca3ae485d04a800e24bf55bae))

  **Crates:** `swc_sourcemap`

### Documentation

- Add submodule update step before test runs ([#11576](https://github.com/swc-project/swc/issues/11576)) ([81b22c3](https://github.com/swc-project/swc/commit/81b22c31d1acb447caae1a2d2bd530b2e6a40c26))

### Features

- **(bindings)** Add html wasm binding and publish wiring ([#11587](https://github.com/swc-project/swc/issues/11587)) ([b3869c3](https://github.com/swc-project/swc/commit/b3869c3ae2a592d4539f4cbfbabeaf615e55d69e))

- **(sourcemap)** Support safe scopes round-trip metadata ([#11581](https://github.com/swc-project/swc/pull/11581)) ([de2a348](https://github.com/swc-project/swc/commit/de2a348daed80e47c75dabaf2f0ce945d850210a))

  **Crates:** `swc_core`, `swc_sourcemap`

## [1.15.13] - 2026-02-23

### Breaking Changes

- **(es/parser)** Compare token kind rather than strings ([#11531](https://github.com/swc-project/swc/pull/11531)) ([5872ffa](https://github.com/swc-project/swc/commit/5872ffa74a5b214bd6fd03732a26479118c41011))

  **Crates:** `swc_ecma_parser`

### Bug Fixes

- **(error-reporters)** Avoid panic on invalid diagnostic spans ([#11561](https://github.com/swc-project/swc/pull/11561)) ([b24b8e0](https://github.com/swc-project/swc/commit/b24b8e0253e4e2db4a36a2180906d65ee89495da))

  **Crates:** `swc_core`, `swc_error_reporters`

- **(es/helpers)** Fix `_object_without_properties` crash on primitive values ([#11571](https://github.com/swc-project/swc/issues/11571)) ([4f35904](https://github.com/swc-project/swc/commit/4f35904ebfc7d924b75635af4166dd8e2b26c069))

- **(es/minifier)** Inline before merge if ([#11526](https://github.com/swc-project/swc/issues/11526)) ([aa5a9ac](https://github.com/swc-project/swc/commit/aa5a9ac3ebae1f2a5775d980da65bc6a1c2574d7))

- **(es/minifier)** Inline side-effect-free default params ([#11564](https://github.com/swc-project/swc/issues/11564)) ([1babda7](https://github.com/swc-project/swc/commit/1babda721a42de7a85cd0da6f6231f9a67c54bfa))

- **(es/minifier)** Prevent convert_tpl_to_str when there's emoji under es5 ([#11529](https://github.com/swc-project/swc/issues/11529)) ([ff6cf88](https://github.com/swc-project/swc/commit/ff6cf88c88497881839ccb40fa18d33225971203))

- **(es/parser)** Fix generic arrow function in TSX mode ([#11549](https://github.com/swc-project/swc/pull/11549)) ([366a16b](https://github.com/swc-project/swc/commit/366a16b4a469d61ca816ec8187d3d476a57860d7))

  **Crates:** `swc_core`, `swc_ecma_lexer`, `swc_ecma_parser`

- **(es/react)** Preserve first-line leading whitespace with entities ([#11568](https://github.com/swc-project/swc/pull/11568)) ([fc62617](https://github.com/swc-project/swc/commit/fc62617f31707bb464dc167d3317dcc705aecd4c))

  **Crates:** `swc_core`, `swc_ecma_transforms_react`

- **(es/regexp)** Transpile unicode property escapes in RegExp constructor ([#11554](https://github.com/swc-project/swc/issues/11554)) ([476d544](https://github.com/swc-project/swc/commit/476d544f911ea643fcc8434e46aaddd344fa49f8))

- **(jsx)** Preserve whitespace before HTML entities ([#11521](https://github.com/swc-project/swc/pull/11521)) ([64be077](https://github.com/swc-project/swc/commit/64be077515ee15501b179ebe523fa68d2c29f905))

  **Crates:** `swc_core`, `swc_ecma_transforms_react`

- **(minifier)** Do not merge if statements with different local variable values ([#11518](https://github.com/swc-project/swc/pull/11518)) ([3e63627](https://github.com/swc-project/swc/commit/3e636273d4ba0563c9fa15736cfa4c57d80c943d))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(minifier)** Preserve array join("") nullish semantics ([#11558](https://github.com/swc-project/swc/pull/11558)) ([d477f61](https://github.com/swc-project/swc/commit/d477f61d85de8d88113e886f5e5d8076192ca76a))

  **Crates:** `swc_core`, `swc_ecma_minifier`

### Documentation

- **(agents)** Clarify sandbox escalation for progress ([#11574](https://github.com/swc-project/swc/issues/11574)) ([cb31d0d](https://github.com/swc-project/swc/commit/cb31d0da37b35858986ba63e0dab300555f8ec82))

### Features

- **(es/minifier)** Add `unsafe_hoist_static_method_alias` option ([#11493](https://github.com/swc-project/swc/pull/11493)) ([6e7dbe2](https://github.com/swc-project/swc/commit/6e7dbe234555f926f98d8714789b5cd4a5e65b3d))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Remove unused args for IIFE ([#11536](https://github.com/swc-project/swc/issues/11536)) ([3cc286b](https://github.com/swc-project/swc/commit/3cc286b2f16489c8175faf5a72601c5be1376bdc))

### Refactor

- **(es/typescript)** Precompute namespace import-equals usage in semantic pass ([#11534](https://github.com/swc-project/swc/issues/11534)) ([b7e87c7](https://github.com/swc-project/swc/commit/b7e87c7b951cb8f62d6b22a5cfa2105310a91ccc))

- **(es/typescript)** Run typescript transform in two passes ([#11532](https://github.com/swc-project/swc/pull/11532)) ([b069558](https://github.com/swc-project/swc/commit/b06955813af93cd784aad90e7e98ab06fb648438))

  **Crates:** `swc_ecma_transforms_typescript`

### Testing

- Disable `cva` ecosystem ci temporariliy ([55bc966](https://github.com/swc-project/swc/commit/55bc966be4e2a393b926317e228f6d33eacb7715))

- **(es/minifier)** Add execution tests for issue #11517 ([#11530](https://github.com/swc-project/swc/issues/11530)) ([01b3b64](https://github.com/swc-project/swc/commit/01b3b648114ddb2e1e5ded32856397b996cb9fc2))

### ci

- Add permission ([431c576](https://github.com/swc-project/swc/commit/431c5764b84d43fad0e30d25dcc0a8e049e8beae))

- Reset closed issue and PR milestone to Planned ([#11559](https://github.com/swc-project/swc/issues/11559)) ([d5c4ebe](https://github.com/swc-project/swc/commit/d5c4ebe3d991b05697f01d8fb67efe7ad708a1f8))

## [1.15.11] - 2026-01-27

### Breaking Changes

- **(es/codegen)** Make `commit_pending_semi` explicit in `write_punct` ([#11492](https://github.com/swc-project/swc/pull/11492)) ([5a27fc0](https://github.com/swc-project/swc/commit/5a27fc0c49872098339bf897957af5a6b459abf9))

  **Crates:** `swc_ecma_ast`, `swc_ecma_codegen`

- **(es/compat)** Implement unicode property escape transpilation ([#11472](https://github.com/swc-project/swc/pull/11472)) ([a2e0ba0](https://github.com/swc-project/swc/commit/a2e0ba0151fdde2c11c093d3ab2960410f4ffb86))

  **Crates:** `swc_ecma_compat_regexp`

- **(es/compat)** Put ES3 crates behind feature flag ([#11480](https://github.com/swc-project/swc/pull/11480)) ([d5a8d84](https://github.com/swc-project/swc/commit/d5a8d8447a6a4517372a5d52151e6732d74a1ade))

  **Crates:** `swc_ecma_compat_es3`

- **(es/es2015)** Port ES2015 transforms to hook-based visitors ([#11484](https://github.com/swc-project/swc/pull/11484)) ([a54eb0e](https://github.com/swc-project/swc/commit/a54eb0ef7518f759e52636162870f90233ef8532))

  **Crates:** `swc_ecma_transformer`

- **(es/es3)** Remove duplicate codes ([#11499](https://github.com/swc-project/swc/pull/11499)) ([fbee775](https://github.com/swc-project/swc/commit/fbee7752443e491ce24b590e00d78677b7e4c8f4))

  **Crates:** `swc_ecma_compat_es3`

- **(preset-env)** Distinguish unknown browser vs empty config ([9752aac](https://github.com/swc-project/swc/commit/9752aac3cb5fd9d132a13b404a495be7d96c9ed7))

  **Crates:** `preset_env_base`

- **(swc)** Make module transforms optional via `module` feature ([#11509](https://github.com/swc-project/swc/pull/11509)) ([b94a178](https://github.com/swc-project/swc/commit/b94a17851c9032e0e17c3c9912cfdb60d00722f4))

  **Crates:** `swc_ecma_transforms_module`

### Bug Fixes

- **(es/codegen)** Emit leading comments for JSX elements, fragments, and empty expressions ([#11488](https://github.com/swc-project/swc/pull/11488)) ([1520633](https://github.com/swc-project/swc/commit/1520633549965eb6838c80d4389431074613bd0e))

  **Crates:** `swc_core`, `swc_ecma_codegen`

- **(es/compat)** Visit export decl body even if name is not reserved ([#11473](https://github.com/swc-project/swc/pull/11473)) ([9113fff](https://github.com/swc-project/swc/commit/9113fffc8cae6d379c5ce7bfd9f5373f6ee9a3aa))

  **Crates:** `swc_core`, `swc_ecma_compat_es3`

- **(es/decorators)** Invoke addInitializer callbacks for decorated fields ([#11495](https://github.com/swc-project/swc/issues/11495)) ([11cfe4d](https://github.com/swc-project/swc/commit/11cfe4deaea8c66cd1f78e8894b4df11ebdbe0f7))

- **(es/minifier)** Escape control characters when converting strings to template literals ([#11464](https://github.com/swc-project/swc/pull/11464)) ([028551f](https://github.com/swc-project/swc/commit/028551f4f0d00c3880df8af324d3b5eb2637cfb9))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Handle unused parameters with default values ([#11494](https://github.com/swc-project/swc/issues/11494)) ([6ed1ee9](https://github.com/swc-project/swc/commit/6ed1ee9ca1e816aedfe0387d240479c1dbfcffef))

- **(es/minifier)** Treat new expression with empty class as side-effect free ([#11455](https://github.com/swc-project/swc/pull/11455)) ([a33a45e](https://github.com/swc-project/swc/commit/a33a45e3bd4e6227d143174198d36f7cbc4b9f2b))

  **Crates:** `swc_core`, `swc_ecma_minifier`, `swc_ecma_utils`

- **(es/module)** Preserve ./ prefix for hidden directory imports ([#11489](https://github.com/swc-project/swc/pull/11489)) ([a005391](https://github.com/swc-project/swc/commit/a0053916e786711be01f73c767e3c2283c9fb4f6))

  **Crates:** `swc_core`, `swc_ecma_transforms_module`, `swc_ecma_transforms_proposal`

- **(es/parser)** Allow compilation with --no-default-features ([#11460](https://github.com/swc-project/swc/pull/11460)) ([b70c5f8](https://github.com/swc-project/swc/commit/b70c5f8ade85c3e4a17e0fed61ce850ab6b1f53c))

  **Crates:** `swc_core`, `swc_ecma_parser`

- **(es/parser)** Disallow NumericLiteralSeparator with BigInts ([#11510](https://github.com/swc-project/swc/pull/11510)) ([6b3644b](https://github.com/swc-project/swc/commit/6b3644b9ca58530a5e0bb92586bdf8210b89124f))

  **Crates:** `swc_core`, `swc_ecma_parser`

- **(es/parser)** Reject ambiguous generic arrow functions in TSX mode ([#11491](https://github.com/swc-project/swc/pull/11491)) ([ac00915](https://github.com/swc-project/swc/commit/ac00915ba027bbb2c805ad0abd8d945d7dcf4055))

  **Crates:** `swc_core`, `swc_ecma_lexer`, `swc_ecma_parser`

- **(es/parser)** Skip emitting TS1102 in TypeScript mode ([#11463](https://github.com/swc-project/swc/pull/11463)) ([e6f5b06](https://github.com/swc-project/swc/commit/e6f5b06561c1d87d0235aea5cfce9c253afdcc74))

  **Crates:** `swc_core`, `swc_ecma_parser`

- **(es/parser)** Validate dynamic import argument count ([#11462](https://github.com/swc-project/swc/pull/11462)) ([2f67591](https://github.com/swc-project/swc/commit/2f67591e2c9bb41a711d739e6bc81d20a673bfd6))

  **Crates:** `swc_core`, `swc_ecma_parser`

- **(es/react)** Preserve HTML entity-encoded whitespace in JSX ([#11474](https://github.com/swc-project/swc/pull/11474)) ([7d433a9](https://github.com/swc-project/swc/commit/7d433a95ccc372535b4f5b9dc691cbd313c2f388))

  **Crates:** `swc_core`, `swc_ecma_transforms_react`

- **(es/renamer)** Prevent duplicate parameter names with destructuring patterns ([#11456](https://github.com/swc-project/swc/pull/11456)) ([e25a2c8](https://github.com/swc-project/swc/commit/e25a2c82db0e33c098a8ecd19bb933115e74ac1a))

  **Crates:** `swc_core`, `swc_ecma_transforms_base`

- **(es/testing)** Skip update when expected output has invalid code ([#11469](https://github.com/swc-project/swc/pull/11469)) ([2be6b8a](https://github.com/swc-project/swc/commit/2be6b8a1fe3f55c30655f82dcf0cf6c04aa9a331))

  **Crates:** `swc_core`, `swc_ecma_transforms_testing`

- **(preset-env)** Distinguish unknown browser vs empty config ([#11457](https://github.com/swc-project/swc/issues/11457)) ([1310957](https://github.com/swc-project/swc/commit/1310957bec15ce2352dcb2dde8adb77664625c69))

- **(transforms/ts)** Don't mark enums with opaque members as pure ([#11452](https://github.com/swc-project/swc/pull/11452)) ([b713fae](https://github.com/swc-project/swc/commit/b713fae8cc1b4fb7a45ffb4bf4a7e9d1facb651f))

  **Crates:** `swc_core`, `swc_ecma_transforms_typescript`

### Documentation

- Replace swc.config.js references with .swcrc ([#11485](https://github.com/swc-project/swc/issues/11485)) ([fec8d2c](https://github.com/swc-project/swc/commit/fec8d2cbb8e7f5eaaed369dd1b45347839fa0c18))

### Features

- **(cli)** Add --root-mode argument for .swcrc resolution ([#11501](https://github.com/swc-project/swc/issues/11501)) ([b53a0e2](https://github.com/swc-project/swc/commit/b53a0e2a98a7556c5f8a74270a717e4078793053))

- **(es/minifier)** Use swc_ecma_hooks for combined AST traversal ([#11471](https://github.com/swc-project/swc/pull/11471)) ([c611663](https://github.com/swc-project/swc/commit/c611663e9f22293233d5bd8084c3de703dec8b14))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/transformer)** Merge ES3 hooks into swc_ecma_transformer ([#11503](https://github.com/swc-project/swc/issues/11503)) ([5efcac9](https://github.com/swc-project/swc/commit/5efcac946f5cf88e900da2867dc8b92c411bdd18))

### Miscellaneous Tasks

- **(es/minifier)** Extend OrderedChain to support more node types ([#11477](https://github.com/swc-project/swc/issues/11477)) ([aa9d789](https://github.com/swc-project/swc/commit/aa9d789953fc8e62e07b91e25137573d3a4d70d7))

### Performance

- **(bindings)** Optimize string handling by avoiding unnecessary clones ([#11490](https://github.com/swc-project/swc/issues/11490)) ([81daaaa](https://github.com/swc-project/swc/commit/81daaaa054a579fd2b425c5362b33ffc90471e6f))

- **(es/es3)** Use hooks pattern for single AST traversal ([#11483](https://github.com/swc-project/swc/pull/11483)) ([a139fba](https://github.com/swc-project/swc/commit/a139fba3b9aca632e02e64333312c989f10e0ef8))

  **Crates:** `swc_core`, `swc_ecma_compat_es3`

- **(es/transformer)** Add inline hint ([#11508](https://github.com/swc-project/swc/issues/11508)) ([d72c9df](https://github.com/swc-project/swc/commit/d72c9df7e390389c3f9a2645341f920c5d42d0db))

### Testing

- Replace deprecated `cargo_bin` function with `cargo_bin!` macro ([#11461](https://github.com/swc-project/swc/issues/11461)) ([73f77b6](https://github.com/swc-project/swc/commit/73f77b6331b1501592315b78babcc96d9ae9b483))

- **(es/minifier)** Add test case for `merge_imports` order preservation ([#11458](https://github.com/swc-project/swc/issues/11458)) ([b874a05](https://github.com/swc-project/swc/commit/b874a05d5cde160c4d40f0d73f871fdb1746a753))

- **(es/parser)** Add error tests for import.source and import.defer with too many args ([#11466](https://github.com/swc-project/swc/issues/11466)) ([7313462](https://github.com/swc-project/swc/commit/731346282ebdb11fd3a1fb6b558cc83982e4afcb))

- **(es/parser)** Check `handler.has_errors()` in test error parsing ([#11487](https://github.com/swc-project/swc/issues/11487)) ([fade647](https://github.com/swc-project/swc/commit/fade647452ed288d42336a4c5580b49bd4953e23))

## [1.15.10] - 2026-01-19

### Breaking Changes

- **(es/minifier)** Improve tpl to str ([#11415](https://github.com/swc-project/swc/pull/11415)) ([0239523](https://github.com/swc-project/swc/commit/0239523c3863f3c0c8f8a3c7d486b64213fc60ff))

  **Crates:** `swc_ecma_ast`

- **(es/transforms/react)** Port to VisitMutHook ([#11418](https://github.com/swc-project/swc/pull/11418)) ([9604d9c](https://github.com/swc-project/swc/commit/9604d9cc8a3d265d66ab32c1f70c25031b09cc18))

  **Crates:** `swc_ecma_transforms_react`

### Bug Fixes

- **(ci)** Handle merged PRs separately in milestone manager ([#11409](https://github.com/swc-project/swc/issues/11409)) ([3554268](https://github.com/swc-project/swc/commit/3554268dcb7c8af4abfe0a06e61a382a23c4a3eb))

- **(es/compat)** Preserve this context in nested arrow functions ([#11423](https://github.com/swc-project/swc/pull/11423)) ([f2bdaf2](https://github.com/swc-project/swc/commit/f2bdaf27d869a6d54a3dd47cd47e63c5b39a4d5c))

  **Crates:** `swc_core`, `swc_ecma_compat_es2015`

- **(es/es2017)** Replace `this` in arrow functions during async-to-generator ([#11450](https://github.com/swc-project/swc/pull/11450)) ([a993da6](https://github.com/swc-project/swc/commit/a993da6fb6e43bdbc2cd3a288c8b5be1b79e08c0))

  **Crates:** `swc_core`, `swc_ecma_transformer`

### Features

- **(bindings/wasm)** Enable ecma_lints feature to support semantic error detection ([#11414](https://github.com/swc-project/swc/issues/11414)) ([1faa4a5](https://github.com/swc-project/swc/commit/1faa4a57454ef3932c75a1aca7dd36e37bb215d3))

- **(es/hooks)** Add VisitHook trait for immutable AST visitors ([#11437](https://github.com/swc-project/swc/issues/11437)) ([3efb41d](https://github.com/swc-project/swc/commit/3efb41d97e2cdb1d593c55c841c016eb2958ee72))

- **(es/hooks)** Implement VisitMutHook for Either type ([#11428](https://github.com/swc-project/swc/pull/11428)) ([395c85e](https://github.com/swc-project/swc/commit/395c85e921eeb0cad661c8714d97372970cbfb6c))

  **Crates:** `swc_core`, `swc_ecma_hooks`

- **(es/hooks)** Implement VisitMutHook for Option<H> ([#11429](https://github.com/swc-project/swc/issues/11429)) ([0bf1954](https://github.com/swc-project/swc/commit/0bf195421de167b3a01f710be7578d1cedf033b9))

- **(es/minifier)** Remove inlined IIFE arg and param ([#11436](https://github.com/swc-project/swc/pull/11436)) ([2bc5d40](https://github.com/swc-project/swc/commit/2bc5d402ade64f84523bfa7cf0c2da88ef494ad6))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Remove inlined IIFE arg and param ([#11446](https://github.com/swc-project/swc/pull/11446)) ([baa1ae3](https://github.com/swc-project/swc/commit/baa1ae3510668f9969bf5cd73ba4e3d66aa74fa0))

  **Crates:** `swc_core`, `swc_ecma_minifier`

### Miscellaneous Tasks

- **(deps)** Update `rkyv` ([#11419](https://github.com/swc-project/swc/issues/11419)) ([432197b](https://github.com/swc-project/swc/commit/432197bdc7c574fbd8829ad5a6e0b3108ccb1d3c))

- **(deps)** Update browserslist-data to v0.1.5 ([#11454](https://github.com/swc-project/swc/issues/11454)) ([e9f78f0](https://github.com/swc-project/swc/commit/e9f78f032f7d85a500037cdc82babdcf2d2be99a))

- **(deps)** Update lru to 0.16.3 ([#11438](https://github.com/swc-project/swc/issues/11438)) ([67c2d75](https://github.com/swc-project/swc/commit/67c2d752910c945732cf4deebf2af0f8a110e880))

- **(helpers)** Replace MagicString with ast-grep's built-in edit API ([#11410](https://github.com/swc-project/swc/issues/11410)) ([a3f0d33](https://github.com/swc-project/swc/commit/a3f0d33916f7ad225d8320c499a8dd0f7b46e5b9))

- **(hstr/wtf8)** Address legacy FIXME comments by switching to derives ([#11416](https://github.com/swc-project/swc/pull/11416)) ([f03bfd8](https://github.com/swc-project/swc/commit/f03bfd8dd15630acbcdb011d64bdea5c1a0ccf79))

  **Crates:** `hstr`, `swc_core`

### Other Changes

- Revert "feat(es/minifier): Remove inlined IIFE arg and param" ([#11444](https://github.com/swc-project/swc/issues/11444))

Reverts swc-project/swc#11436 ([144be84](https://github.com/swc-project/swc/commit/144be84ba1d6462ce9ae9739d60261dec14b4a45))

### Performance

- **(es/codegen,es/utils)** Migrate to dragonbox_ecma for faster Number::toString ([#11412](https://github.com/swc-project/swc/pull/11412)) ([b7978cc](https://github.com/swc-project/swc/commit/b7978cc9dbe92b26d781748d09ad50e2f1a6343b))

  **Crates:** `swc_core`, `swc_ecma_codegen`, `swc_ecma_utils`

- **(es/react)** Optimize JSX transforms to reduce allocations ([#11425](https://github.com/swc-project/swc/issues/11425)) ([2a20cb6](https://github.com/swc-project/swc/commit/2a20cb6e34bed4260efe2a1b87165f52f9b3d45c))

### Refactor

- **(es)** Improve TypeScript transform configuration structure ([#11434](https://github.com/swc-project/swc/issues/11434)) ([f33a975](https://github.com/swc-project/swc/commit/f33a975c74f63f8d8e3c05db5166912c432ae18b))

- **(es/minifier)** Improve nested template literal evaluation ([#11411](https://github.com/swc-project/swc/pull/11411)) ([147df2f](https://github.com/swc-project/swc/commit/147df2f0233c4b701311675dc7c237ee18f0c854))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Migrate MinifierPass to Pass trait ([#11442](https://github.com/swc-project/swc/issues/11442)) ([a41e631](https://github.com/swc-project/swc/commit/a41e63193c86290f20fec6529d7aa944562df713))

- **(es/transformer)** Remove OptionalHook wrapper in favor of Option<H> ([#11430](https://github.com/swc-project/swc/pull/11430)) ([72da6bd](https://github.com/swc-project/swc/commit/72da6bdd526eff0fdde76f22a978cbec736b9d3c))

  **Crates:** `swc_core`, `swc_ecma_transformer`

- **(es/transforms)** Migrate TypeScript transform to Pass trait ([#11439](https://github.com/swc-project/swc/issues/11439)) ([dd007c6](https://github.com/swc-project/swc/commit/dd007c64a691d37f6d4903624a8dfa39d389f912))

### Testing

- Disable LTO for benchmarks ([#11421](https://github.com/swc-project/swc/issues/11421)) ([af3c2d3](https://github.com/swc-project/swc/commit/af3c2d36d772eab7905db717f8be2080fd14abec))

- Use rstest as the test framework ([#11417](https://github.com/swc-project/swc/issues/11417)) ([fae258f](https://github.com/swc-project/swc/commit/fae258f530d2f54fa148f90225e9a7740de57d96))

- **(es)** Enable benchmark for `swc` ([#11420](https://github.com/swc-project/swc/issues/11420)) ([3a50a25](https://github.com/swc-project/swc/commit/3a50a2592784a418ef3312b0f445bde2762959ca))

### ci

- Collapse preivous `claude[bot]` PR review comments ([affb6a2](https://github.com/swc-project/swc/commit/affb6a29de9a511148a3483149aa5a574720fccf))

## [1.15.8] - 2025-12-30

### Breaking Changes

- **(es/parser)** Distinguish JsxText from Str ([#11387](https://github.com/swc-project/swc/pull/11387)) ([63c4c44](https://github.com/swc-project/swc/commit/63c4c440a135be06179b4fdc03a2b7a5e9606c1c))

  **Crates:** `swc_ecma_parser`

- **(es/parser)** Use `byte_search` to optimize `scan_jsx_token` ([#11398](https://github.com/swc-project/swc/pull/11398)) ([f9b4da2](https://github.com/swc-project/swc/commit/f9b4da2bd85d160b3ee4b3296ed520388675b90e))

  **Crates:** `swc_ecma_parser`

### Bug Fixes

- **(es/minifier)** Evaluate TemplateLiteral in BinaryExpression ([#11406](https://github.com/swc-project/swc/pull/11406)) ([8d1b6f6](https://github.com/swc-project/swc/commit/8d1b6f613e61b7d7cf9ac9b9071bbe671b8baa8c))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** More strict check if cannot add ident when invoking IIFE ([#11399](https://github.com/swc-project/swc/pull/11399)) ([03642aa](https://github.com/swc-project/swc/commit/03642aafd32af9d07803603795ae13b0fc80bf3a))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(minifier)** Remove unused webpack-related code ([#11397](https://github.com/swc-project/swc/pull/11397)) ([8e4eab4](https://github.com/swc-project/swc/commit/8e4eab4c900d5a870788388cd32c35a32104643d))

  **Crates:** `swc_core`, `swc_ecma_minifier`

### Features

- **(es/minifier)** Support BinaryExpression for Evaluator ([#11390](https://github.com/swc-project/swc/pull/11390)) ([6c76f0a](https://github.com/swc-project/swc/commit/6c76f0adc39cbc72cbf3b81fdc2f521a5d0b6f7b))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/transformer)** Merge `static_blocks` ([#11403](https://github.com/swc-project/swc/pull/11403)) ([55a5083](https://github.com/swc-project/swc/commit/55a5083f02e2eabd79e0839268f0a74aff2f69a4))

  **Crates:** `swc_core`, `swc_ecma_compat_es2022`, `swc_ecma_preset_env`, `swc_ecma_transformer`, `swc_ecma_transforms_compat`

### Performance

- Reduce binary size with panic=abort and ICU optimizations ([#11401](https://github.com/swc-project/swc/issues/11401)) ([18088b2](https://github.com/swc-project/swc/commit/18088b29826acd0948e9682e0de5ab47db399d32))

- **(es/parser)** Remove `Iterator` implementation for `Lexer` ([#11393](https://github.com/swc-project/swc/issues/11393)) ([5941018](https://github.com/swc-project/swc/commit/59410188a2037ab88b516cddf4401149cc739ee8))

- **(es/parser)** Remove `is_first` in lexer state ([#11395](https://github.com/swc-project/swc/issues/11395)) ([97d903b](https://github.com/swc-project/swc/commit/97d903b4e580e99d0a02463c0a38e780f76bd274))

- **(es/parser)** Optimize `do_outside_of_context` and `do_inside_of_context` ([#11394](https://github.com/swc-project/swc/pull/11394)) ([4210cf1](https://github.com/swc-project/swc/commit/4210cf1ca1ec37a624cbeb36d8821855c3f56d41))

  **Crates:** `swc_core`, `swc_ecma_parser`

### Refactor

- **(es/compiler)** Drop the crate ([#11407](https://github.com/swc-project/swc/issues/11407)) ([8faa14e](https://github.com/swc-project/swc/commit/8faa14ec0882dc20780fdc2c1fdba93d6cde7772))

- **(minifier)** Move drop_console and unsafes from Pure to Optimizer ([#11388](https://github.com/swc-project/swc/pull/11388)) ([ee40804](https://github.com/swc-project/swc/commit/ee408042547f0c3fe4d3a5dd2599a7846b619852))

  **Crates:** `swc_core`, `swc_ecma_minifier`

## [1.15.7] - 2025-12-18

### Breaking Changes

- **(es/minifier)** Optimize data structures of `ProgramData` ([#11374](https://github.com/swc-project/swc/pull/11374)) ([3639523](https://github.com/swc-project/swc/commit/36395237e7efff0698a2b575e0ad7822381437e3))

  **Crates:** `swc_ecma_usage_analyzer`

### Bug Fixes

- **(es/transformer)** Fix variable declaration for nullish coalescing in else-if branches ([#11384](https://github.com/swc-project/swc/issues/11384)) ([6746002](https://github.com/swc-project/swc/commit/67460026176cb97a5bfa59a439da59b70447e897))

- **(es/transforms)** Update `_ts_rewrite_relative_import_extension` helper code ([#11382](https://github.com/swc-project/swc/pull/11382)) ([1ec444e](https://github.com/swc-project/swc/commit/1ec444e998fd1aff29b7e674254d1c95e2de2ba0))

  **Crates:** `swc_core`, `swc_ecma_transforms_base`

- **(minifier)** Prevent unsafe sequence merging in super() calls ([#11381](https://github.com/swc-project/swc/pull/11381)) ([eb02780](https://github.com/swc-project/swc/commit/eb02780a126cd70da830079fc54168d632d18a4d))

  **Crates:** `swc_core`, `swc_ecma_minifier`

### Features

- **(es/transformer)** Merge `private_properties_in_object` ([#11378](https://github.com/swc-project/swc/pull/11378)) ([769c9d2](https://github.com/swc-project/swc/commit/769c9d2938edab63a0f109fc1bf7cad3e40a4619))

  **Crates:** `swc_core`, `swc_ecma_compat_es2022`, `swc_ecma_preset_env`, `swc_ecma_transformer`

### Refactor

- **(es/transformer)** Port var injector ([#11383](https://github.com/swc-project/swc/pull/11383)) ([cfff553](https://github.com/swc-project/swc/commit/cfff5536ac0e5f9051e5a4bb650eac028c7e6067))

  **Crates:** `swc_core`, `swc_ecma_transformer`

## [1.15.6] - 2025-12-18

### Breaking Changes

- **(es/parser)** Remove `raw`s in `TokenValue` ([#11373](https://github.com/swc-project/swc/pull/11373)) ([78a5327](https://github.com/swc-project/swc/commit/78a532726560738f363e812ec4940d0580140576))

  **Crates:** `swc_ecma_parser`

### Bug Fixes

- **(es/transformer)** Fix missing var declaration in nullish coalescing with spreads ([#11377](https://github.com/swc-project/swc/pull/11377)) ([686d154](https://github.com/swc-project/swc/commit/686d154c1e8aa45c16b45d8b0ed1a921fae5eb39))

  **Crates:** `swc_core`, `swc_ecma_transformer`

## [1.15.5] - 2025-12-15

### Bug Fixes

- **(es/parser)** Correct some bumped size ([#11372](https://github.com/swc-project/swc/pull/11372)) ([ec5c1bc](https://github.com/swc-project/swc/commit/ec5c1bc5bf23249fd7cbd786ab735f9abb4ed9cb))

  **Crates:** `swc_core`, `swc_ecma_parser`

- **(es/transforms)** Adjust import rewriter pass before inject helpers pass ([#11371](https://github.com/swc-project/swc/pull/11371)) ([8516991](https://github.com/swc-project/swc/commit/8516991cb5316b1fbdc7d52daa6f64b9ca9e0f32))

  **Crates:** `swc`, `swc_core`

## [1.15.4] - 2025-12-13

### Breaking Changes

- **(es/parser)** Use `slice` rather than matching keywords ([#11341](https://github.com/swc-project/swc/pull/11341)) ([b6ad2cb](https://github.com/swc-project/swc/commit/b6ad2cb114c99676c912ffa6984e50da677630cf))

  **Crates:** `swc_common`, `swc_ecma_parser`

- **(es/parser)** Support `no_paren` parser option ([#11359](https://github.com/swc-project/swc/pull/11359)) ([5b9d77c](https://github.com/swc-project/swc/commit/5b9d77c1c89ade5772c6feee429386faf3b93a39))

  **Crates:** `swc_ecma_parser`

- **(parser)** Make all parsers work by byte instead of char ([#11318](https://github.com/swc-project/swc/pull/11318)) ([725efd1](https://github.com/swc-project/swc/commit/725efd16c67f4f2d42c6b3c673cb0ad473ff0ff3))

  **Crates:** `swc_common`

### Bug Fixes

- **(es/compat)** Destructuring evaluation order ([#11337](https://github.com/swc-project/swc/pull/11337)) ([49d04c7](https://github.com/swc-project/swc/commit/49d04c750dc771a6b4a01ae7a0b438f48098a485))

  **Crates:** `swc_core`, `swc_ecma_compat_es2018`

- **(es/compat)** Fix generator transform for compound assignments, for-in, and labeled break ([#11339](https://github.com/swc-project/swc/pull/11339)) ([9b6bedd](https://github.com/swc-project/swc/commit/9b6bedd6dab07f81808ee949c769c24e7ecda8a0))

  **Crates:** `swc_core`, `swc_ecma_compat_es2015`

- **(es/compat)** Fix parameter default value evaluation order with object rest ([#11352](https://github.com/swc-project/swc/pull/11352)) ([2ebb261](https://github.com/swc-project/swc/commit/2ebb261c90ab24290a8b972bd4bd7b5b452ddefc))

  **Crates:** `swc_core`, `swc_ecma_compat_es2018`

- **(es/compat)** Preserve return value for single-property object destructuring ([#11334](https://github.com/swc-project/swc/pull/11334)) ([847ad22](https://github.com/swc-project/swc/commit/847ad222a9a95e189850172345b0c26dfeb6c225))

  **Crates:** `swc_core`, `swc_ecma_compat_es2015`

- **(es/helpers)** Avoid extra trap calls on excluded keys in object rest spread ([#11338](https://github.com/swc-project/swc/pull/11338)) ([4662caf](https://github.com/swc-project/swc/commit/4662caf427c67a2aea7dade478b0f7c00276b30e))

  **Crates:** `swc_core`, `swc_ecma_transforms_base`

- **(es/minifier)** Fix debug feature ([#11325](https://github.com/swc-project/swc/pull/11325)) ([be86fad](https://github.com/swc-project/swc/commit/be86fad7e9b935faac2da7d881a6991295a6dbad))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Merge_imports optimization pass ([#11331](https://github.com/swc-project/swc/pull/11331)) ([ca2f7ed](https://github.com/swc-project/swc/commit/ca2f7ed0d06c7d0971102875a5463176d0dd5204))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/parser)** Don't call `bump_bytes` in the `continue_if` of `byte_search!` ([#11328](https://github.com/swc-project/swc/pull/11328)) ([583619d](https://github.com/swc-project/swc/commit/583619d019b548621becb8fb0c895dd9ce85da71))

  **Crates:** `swc_core`, `swc_ecma_parser`

- **(es/parser)** Handle TypeScript expressions in destructuring patterns ([#11353](https://github.com/swc-project/swc/pull/11353)) ([160ec34](https://github.com/swc-project/swc/commit/160ec343404d7363e94a447be5c23bed2ab50e37))

  **Crates:** `swc_core`, `swc_ecma_parser`

- **(es/parser)** Support type-only string literal in import specifiers ([#11333](https://github.com/swc-project/swc/pull/11333)) ([07762f1](https://github.com/swc-project/swc/commit/07762f13e9ddc5e756b545cb2a6877f427733406))

  **Crates:** `swc_core`, `swc_ecma_parser`

- **(es/transformer)** Complete `replace_this_in_expr` implementation ([#11361](https://github.com/swc-project/swc/issues/11361)) ([58c4067](https://github.com/swc-project/swc/commit/58c406723e78fbe87011450dd87edbf52508c08e))

- **(es/transformer)** Fix pass order ([#11370](https://github.com/swc-project/swc/pull/11370)) ([373048a](https://github.com/swc-project/swc/commit/373048ae3e6ad0b344bc8aa298765a207289a861))

  **Crates:** `swc_core`, `swc_ecma_transformer`

- **(es/transforms/base)** Preserve parens around IFFE in binary expressions within sequences ([#11324](https://github.com/swc-project/swc/pull/11324)) ([a4c84ea](https://github.com/swc-project/swc/commit/a4c84ea7807839a87300d2e931b6a457f248b33a))

  **Crates:** `swc_core`, `swc_ecma_transforms_base`

### Features

- **(es/minifier)** Optimize `typeof x == "undefined"` to `typeof x > "u"` ([#11367](https://github.com/swc-project/swc/pull/11367)) ([a5e144b](https://github.com/swc-project/swc/commit/a5e144bc6329431fcb4beb63b441627e7afce1fa))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/parser)** Revert `no_paren` parser option ([#11362](https://github.com/swc-project/swc/issues/11362)) ([57a8731](https://github.com/swc-project/swc/commit/57a87313194f825efc2ce91d41fb27b8e1e9d9aa))

- **(es/transfomer)** Add modules to prepare porting ([#11347](https://github.com/swc-project/swc/issues/11347)) ([68d740c](https://github.com/swc-project/swc/commit/68d740cc5c2097954d0a7827775af7ac0b3f7cee))

- **(es/transform)** Add common fields ([#11346](https://github.com/swc-project/swc/issues/11346)) ([1a8759f](https://github.com/swc-project/swc/commit/1a8759f30b1d2253bd5e267f68970ca58f301b68))

- **(es/transformer)** Implement async-to-generator transformation ([#11355](https://github.com/swc-project/swc/pull/11355)) ([c388e87](https://github.com/swc-project/swc/commit/c388e870cae2e9253f1ef39f659aebe7470ea741))

  **Crates:** `swc_core`, `swc_ecma_compat_es2017`, `swc_ecma_preset_env`, `swc_ecma_transformer`

- **(es/transformer)** Merge `async_to_generator` ([#11358](https://github.com/swc-project/swc/pull/11358)) ([25f3a47](https://github.com/swc-project/swc/commit/25f3a4724d48e7fe32eebacd743f1ab623681e46))

  **Crates:** `swc_core`, `swc_ecma_compat_es2017`, `swc_ecma_preset_env`, `swc_ecma_transformer`

- **(es/transformer)** Merge `logical_assignment_operators` ([#11369](https://github.com/swc-project/swc/issues/11369)) ([94946fa](https://github.com/swc-project/swc/commit/94946fa40b972f86c8aa006b29a49307127bceeb))

- **(es/transformer)** Merge `nullish_coalescing` ([#11365](https://github.com/swc-project/swc/pull/11365)) ([5fb686a](https://github.com/swc-project/swc/commit/5fb686a2c2fca583707406b7d2fec1a60bf9d4c9))

  **Crates:** `swc_core`, `swc_ecma_compat_es2020`, `swc_ecma_preset_env`, `swc_ecma_transformer`

- **(es/transformer)** Merge `object_rest_spread` ([#11357](https://github.com/swc-project/swc/issues/11357)) ([752188e](https://github.com/swc-project/swc/commit/752188ef85d8b0b36d8d60e962d5fbe6349b6263))

### Other Changes

- Revert "feat(es/transformer): Merge `async-to-generator` ([#11355](https://github.com/swc-project/swc/issues/11355))"

This reverts commit c388e870cae2e9253f1ef39f659aebe7470ea741. ([b5025b3](https://github.com/swc-project/swc/commit/b5025b3f9ec2005b4d5acd57d6854d590769a257))

### Performance

- **(es/compat)** Merge `exponentation_operator` ([#11310](https://github.com/swc-project/swc/pull/11310)) ([0ef3637](https://github.com/swc-project/swc/commit/0ef3637606035ce6258c9893fe458bc80c598574))

  **Crates:** `swc_core`, `swc_ecma_compat_es2016`, `swc_ecma_preset_env`, `swc_ecma_transformer`

- **(es/compat)** Merge `optional_catch_binding` ([#11313](https://github.com/swc-project/swc/pull/11313)) ([468d20c](https://github.com/swc-project/swc/commit/468d20cf811794e2e905617b4426e8d593cbca59))

  **Crates:** `swc_core`, `swc_ecma_compat_es2019`, `swc_ecma_preset_env`, `swc_ecma_transformer`

- **(es/compat)** Use merged transformer ([#11366](https://github.com/swc-project/swc/pull/11366)) ([c4a5e79](https://github.com/swc-project/swc/commit/c4a5e7989bf0bb943051c56d03f8121d921c9f13))

  **Crates:** `swc_core`, `swc_ecma_compat_es2018`, `swc_ecma_preset_env`, `swc_ecma_transformer`

- **(es/parser)** Optimize `byte_search!` ([#11323](https://github.com/swc-project/swc/pull/11323)) ([67f67c1](https://github.com/swc-project/swc/commit/67f67c1dcb45203601d96d4e7a77cb4c16e82d79))

  **Crates:** `swc_core`, `swc_ecma_parser`

- **(es/parser)** Small optimization after byte-based lexer ([#11340](https://github.com/swc-project/swc/pull/11340)) ([c92ea4e](https://github.com/swc-project/swc/commit/c92ea4ec5f32654921efaee9af8cb09dc39457df))

  **Crates:** `swc_core`, `swc_ecma_parser`

## [1.15.3] - 2025-11-20

### Bug Fixes

- **(es/codegen)** Emit comments of all nodes ([#11314](https://github.com/swc-project/swc/pull/11314)) ([387ee0f](https://github.com/swc-project/swc/commit/387ee0f4d864212d38c008f4d3b715b17036fbef))

  **Crates:** `swc_core`, `swc_ecma_codegen`

- **(es/codegen)** Restore missing top-level comments ([#11302](https://github.com/swc-project/swc/pull/11302)) ([0998c93](https://github.com/swc-project/swc/commit/0998c93a5ad391a6cc7bd25eb08104f825a29ac4))

  **Crates:** `swc_core`, `swc_ecma_codegen`, `swc_ecma_parser`

- **(es/minifier)** Prevent compress.comparisons from transforming expressions with side effects ([#11256](https://github.com/swc-project/swc/pull/11256)) ([58a9d81](https://github.com/swc-project/swc/commit/58a9d81959162778f6ca1200436c90f3545bd387))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Prevent compress.comparisons from transforming expressions with side effects ([633536a](https://github.com/swc-project/swc/commit/633536a68125b0334b2780bf8d93511a8d29cf08))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/minifier)** Remove unused arrow functions in dead code elimination ([#11319](https://github.com/swc-project/swc/pull/11319)) ([88c6ac7](https://github.com/swc-project/swc/commit/88c6ac7eb05e3367d3d14e40bad8468218576783))

  **Crates:** `swc_core`, `swc_ecma_minifier`

- **(es/plugin)** Use `#[cfg]` to avoid compilation error ([#11316](https://github.com/swc-project/swc/pull/11316)) ([f615cdb](https://github.com/swc-project/swc/commit/f615cdbc52773b4899fb7831992272088013acc0))

  **Crates:** `swc`, `swc_core`

- **(es/quote)** Replace usage of `swc_atoms` with `swc_core::atoms` ([#11299](https://github.com/swc-project/swc/pull/11299)) ([c1e32fa](https://github.com/swc-project/swc/commit/c1e32fafd3dd8c2424331730c6ebc03bc793b058))

  **Crates:** `swc_core`, `swc_ecma_quote_macros`

### Miscellaneous Tasks

- **(es/transformer)** Determine project structure ([#11306](https://github.com/swc-project/swc/issues/11306)) ([58f2602](https://github.com/swc-project/swc/commit/58f2602981fd5d2efeabc44dc59fbc07dbb4e7cd))

### Other Changes

- **(es/parser)** Program start at input start ([633536a](https://github.com/swc-project/swc/commit/633536a68125b0334b2780bf8d93511a8d29cf08))

  **Crates:** `swc_core`, `swc_ecma_minifier`, `swc_ecma_parser`

- **(es/parser)** Program start at input start ([#11199](https://github.com/swc-project/swc/pull/11199)) ([b56e008](https://github.com/swc-project/swc/commit/b56e0083c60e9d96fbe7aef9de20ff83d4c77279))

  **Crates:** `swc_core`, `swc_ecma_minifier`, `swc_ecma_parser`

### Performance

- **(es/compat)** Merge `export_namespace_from` to `Transformer` ([#11309](https://github.com/swc-project/swc/issues/11309)) ([7a528ce](https://github.com/swc-project/swc/commit/7a528ce66ef1a8b715b702de5d246d60a093ab70))

- **(es/compat)** Merge `regexp` pass into `Transformer` ([#11307](https://github.com/swc-project/swc/issues/11307)) ([440b391](https://github.com/swc-project/swc/commit/440b391e65fab9514c40e65145828c956b8b437b))

### Refactor

- **(es/transfomer)** Prevent breaking change ([#11308](https://github.com/swc-project/swc/issues/11308)) ([45827fa](https://github.com/swc-project/swc/commit/45827fac5d0d0434f425769f6b3f4383617355e0))

## [1.15.2] - 2025-11-14

### Bug Fixes

- **(bindings/es)** Respect `filename` option from `print()` ([#11264](https://github.com/swc-project/swc/issues/11264)) ([0d4d2d9](https://github.com/swc-project/swc/commit/0d4d2d9ab4e912ecf9e17e7c9b49d26b320c1d98))

### Features

- **(ecma/hooks)** Add context parameter to VisitMutHook trait ([#11254](https://github.com/swc-project/swc/pull/11254)) ([8645d0d](https://github.com/swc-project/swc/commit/8645d0de8fcbd61d7a69235ac485debb64497205))

  **Crates:** `swc_core`, `swc_ecma_hooks`

- **(minifier)** Drop empty constructors during minification ([#11250](https://github.com/swc-project/swc/pull/11250)) ([2cea7dd](https://github.com/swc-project/swc/commit/2cea7ddb58390253fed44a4033c71d2333271691))

  **Crates:** `swc_core`, `swc_ecma_minifier`

### Performance

- **(es/parser)** Eliminate the outer loop of `skip_block_comment` ([#11261](https://github.com/swc-project/swc/pull/11261)) ([e41c0ac](https://github.com/swc-project/swc/commit/e41c0ac9d5e5e4956f826bceea43f01ad729725e))

  **Crates:** `swc_core`, `swc_ecma_parser`

- **(es/parser)** Inline `skip_space` ([afb824a](https://github.com/swc-project/swc/commit/afb824a97f3d917090e14a8289339ee259f42239))

  **Crates:** `swc_core`, `swc_ecma_parser`

- **(plugin)** Use shared tokio runtime to avoid creation overhead ([#11267](https://github.com/swc-project/swc/pull/11267)) ([707026b](https://github.com/swc-project/swc/commit/707026bee1e0d98ec3602ef9d3aac348c7184940))

  **Crates:** `swc`, `swc_core`

## [1.15.1] - 2025-11-08

### Bug Fixes

- **(cli)** Don't output "unknown" when compiling from stdin ([#11249](https://github.com/swc-project/swc/pull/11249)) ([d66dab5](https://github.com/swc-project/swc/commit/d66dab575c0ea7084b8e3c07155990fc93ef636f))

  **Crates:** `swc_cli_impl`, `swc_core`

- **(es/minifier)** Prevent array destructuring optimization in assignment contexts ([#11221](https://github.com/swc-project/swc/pull/11221)) ([99d8b0a](https://github.com/swc-project/swc/commit/99d8b0a6257bbc47bc75477a7e3b265c50ad44f5))

  **Crates:** `swc_core`, `swc_ecma_minifier`

### Features

- **(es/compiler)** Determine module structure ([#11238](https://github.com/swc-project/swc/issues/11238)) ([415019c](https://github.com/swc-project/swc/commit/415019c6da388180cb590e802b17206692ec95a4))

- **(ts/fast-strip)** Add a binding crate for nodejs/amaro ([#11236](https://github.com/swc-project/swc/issues/11236)) ([f0829af](https://github.com/swc-project/swc/commit/f0829af6da69e9e5da73a8e114181601d6e50400))

- **(visit)** Add hook APIs for visitors ([#11242](https://github.com/swc-project/swc/pull/11242)) ([3a141ed](https://github.com/swc-project/swc/commit/3a141ed230c0be9660441d6ff14edd82ea41e2d4))

  **Crates:** `swc_core`, `swc_css_visit`, `swc_ecma_visit`, `swc_html_visit`, `swc_xml_visit`

### Miscellaneous Tasks

- **(es/compiler)** Drop `syntax_ext` and prepare AI-based porting ([#11239](https://github.com/swc-project/swc/issues/11239)) ([15639c0](https://github.com/swc-project/swc/commit/15639c0abfa5569873fd75a6778fa8ec2d31f197))

### Performance

- **(common)** Improve `StringInput#bump_bytes` ([#11230](https://github.com/swc-project/swc/pull/11230)) ([6a9fa49](https://github.com/swc-project/swc/commit/6a9fa49117e037aa77bcdd1b0b50f2e08697c05e))

  **Crates:** `swc_common`, `swc_core`, `swc_ecma_parser`

- **(es/parser)** Optimize `skip_space` ([#11225](https://github.com/swc-project/swc/pull/11225)) ([541d252](https://github.com/swc-project/swc/commit/541d252b98298cf71b7d5b773f68a0b7ec4ef087))

  **Crates:** `swc_core`, `swc_ecma_parser`

### Refactor

- **(visit)** Use separate crate for hooks ([#11243](https://github.com/swc-project/swc/issues/11243)) ([d93ec90](https://github.com/swc-project/swc/commit/d93ec903acdd9029da179281fb93b4af76dc93f5))

## [1.15.0] - 2025-11-04

### Breaking Changes

- **(ast)** Introduce flexible serialization encoding for ast ([#11100](https://github.com/swc-project/swc/pull/11100)) ([8ad3647](https://github.com/swc-project/swc/commit/8ad36478160ff848466bbff2bf442224696982bf))

  **Crates:** `ast_node`, `from_variant`, `swc_atoms`

### Bug Fixes

- **(atom)** Skip only unicode \u ([#11216](https://github.com/swc-project/swc/pull/11216)) ([eda01e5](https://github.com/swc-project/swc/commit/eda01e5284ad5b1eda538eda7231795d75f7136f))

  **Crates:** `hstr`, `swc_core`

- **(cli)** Update plugin template to use VisitMut API ([#11218](https://github.com/swc-project/swc/issues/11218)) ([6a87e41](https://github.com/swc-project/swc/commit/6a87e41fbaf2f97e2f530d8560df7bb9e0ba1a12))

### Features

- **(hstr)** Support checked `from_bytes` for Wtf8Buf and Wtf8 ([#11211](https://github.com/swc-project/swc/pull/11211)) ([1430489](https://github.com/swc-project/swc/commit/1430489460a54598300427bfc7ed0f4a30bf8d63))

  **Crates:** `hstr`, `swc_core`

### Performance

- **(atoms)** Remove temporary allocations in rkyv serialize and deserialize ([#11202](https://github.com/swc-project/swc/issues/11202)) ([85e6e8a](https://github.com/swc-project/swc/commit/85e6e8a66f0e517512d7cd13c5b287b1ef82e191))

- **(es/parser)** Remove `start` in `State` ([#11201](https://github.com/swc-project/swc/pull/11201)) ([b9aeaa3](https://github.com/swc-project/swc/commit/b9aeaa3a3bab072f90fb8f26454cb33062bff584))

  **Crates:** `swc_core`, `swc_ecma_parser`

- **(plugin)** Avoid data copy when transformation finished ([#11223](https://github.com/swc-project/swc/pull/11223)) ([af134fa](https://github.com/swc-project/swc/commit/af134faecd5979126165a5462abf880c70b5b54b))

  **Crates:** `swc_core`, `swc_plugin_runner`

### Refactor

- Flatten cargo workspaces ([#11213](https://github.com/swc-project/swc/issues/11213)) ([6223100](https://github.com/swc-project/swc/commit/622310055c59ee42b744038a33997e6f43cf4af0))

- **(plugin)** Switch plugin abi to flexible serialization ([#11198](https://github.com/swc-project/swc/issues/11198)) ([e5feaf1](https://github.com/swc-project/swc/commit/e5feaf15cebb2887cd8dc9d0275c4ec0fbf40d30))

### Testing

- Copy opt-level configs to the top level workspace ([#11210](https://github.com/swc-project/swc/issues/11210)) ([dba23f5](https://github.com/swc-project/swc/commit/dba23f5a72d26b3b62fbafe2d8a65c69c3642669))

<!-- generated by swc-releaser with git-cliff -->
