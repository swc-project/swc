# Changelog
## [1.10.8] - 2025-01-19

### Bug Fixes



- **(es/decorators)** Fix init order of `2022-03` impl ([#9760](https://github.com/swc-project/swc/issues/9760)) ([751a310](https://github.com/swc-project/swc/commit/751a310e87cbbb61ebd76671018bf01d07487792))


- **(es/testing)** Fix sourcemap generation ([#9891](https://github.com/swc-project/swc/issues/9891)) ([008f2de](https://github.com/swc-project/swc/commit/008f2dee6660529faf4cd498e33a5a3ffd4c6f2f))


- **(es/ts_strip)** Handle ASI hazard in return statement ([#9882](https://github.com/swc-project/swc/issues/9882)) ([121b5fe](https://github.com/swc-project/swc/commit/121b5fefbc17932816f69c88edc14f8387c493e9))


- **(typescript)** Collect usages in extend clauses of classes and interfaces ([#9893](https://github.com/swc-project/swc/issues/9893)) ([ef29ef6](https://github.com/swc-project/swc/commit/ef29ef6a225927ccdd3d98751f9a2cfef88ca237))

### Features



- **(typescript)** Check computed property names of ts signatures ([#9867](https://github.com/swc-project/swc/issues/9867)) ([caed78a](https://github.com/swc-project/swc/commit/caed78a7105969ac15347e99bc2a1c998fa5f7f7))

### Performance



- **(bench)** Run benchmark on a custom runner ([#9877](https://github.com/swc-project/swc/issues/9877)) ([2d6f9a5](https://github.com/swc-project/swc/commit/2d6f9a5c27803257635b4b008c5d3b0592478e1d))


- **(es/codegen)** Remove needless allocations ([#9890](https://github.com/swc-project/swc/issues/9890)) ([f230ff2](https://github.com/swc-project/swc/commit/f230ff2d8454808ffa99c298448eba7522597219))


- **(es/minifier)** Make the first run of DCE more efficient ([#9868](https://github.com/swc-project/swc/issues/9868)) ([7329824](https://github.com/swc-project/swc/commit/7329824b825663c6c51c48dd5ace097da87e2c88))


- **(es/minifier)** Adjust parallel threshold ([#9872](https://github.com/swc-project/swc/issues/9872)) ([d5d856c](https://github.com/swc-project/swc/commit/d5d856cf3b7c89da4d917cb1acea4fdb3096769b))


- **(es/minifier)** Box `VarUsageInfo` of `ProgramData` ([#9894](https://github.com/swc-project/swc/issues/9894)) ([fafd754](https://github.com/swc-project/swc/commit/fafd754f74be0cd9dfc1c0f5a24b1c078023cb64))


- **(es/renamer)** Use `IndexSet` for rename queue ([#9866](https://github.com/swc-project/swc/issues/9866)) ([f404720](https://github.com/swc-project/swc/commit/f404720b8fa0166a27f47bf6913307353def7fae))


- **(es/utils)** Optimize `maybe_par_idx_raw` ([#9870](https://github.com/swc-project/swc/issues/9870)) ([46e3d77](https://github.com/swc-project/swc/commit/46e3d77396a9211ddd79c7390349053c857a9c76))


- Enable `concurrent` in codspeed bench ([#9862](https://github.com/swc-project/swc/issues/9862)) ([6c2bb13](https://github.com/swc-project/swc/commit/6c2bb13f9d9ec522a938d8aba535a8a93758e43d))

### Refactor



- **(atoms)** Rename `FastAtom` to `UnsafeAtom` ([#9873](https://github.com/swc-project/swc/issues/9873)) ([3df8b44](https://github.com/swc-project/swc/commit/3df8b443a129cfcb5ec79f37e2fcf6a2a9468cad))


- **(es/minifier)** Add a way to profile minifier for real-world inputs ([#9881](https://github.com/swc-project/swc/issues/9881)) ([9657294](https://github.com/swc-project/swc/commit/9657294ff159e920e829c1a727219427f19df46e))


- **(es/minifier)** Use `chili` for `minify-all` example ([#9885](https://github.com/swc-project/swc/issues/9885)) ([197f0bc](https://github.com/swc-project/swc/commit/197f0bc1962875a3528b0b051be0dbea16671bc8))


- **(es/minifier)** Make `minify-all` profilable ([#9888](https://github.com/swc-project/swc/issues/9888)) ([fbad136](https://github.com/swc-project/swc/commit/fbad1364984f8b951b884b61fd924b6ea8fafbda))

## [1.10.7] - 2025-01-10

### Bug Fixes



- **(ci/publish)** Do not tag stable if `onlyNightly` is on ([#9863](https://github.com/swc-project/swc/issues/9863)) ([c0c6056](https://github.com/swc-project/swc/commit/c0c60569e268d9e5f3fdf2362061d160c22f4f4e))


- **(es/minifier)** Improve DCE ([#9853](https://github.com/swc-project/swc/issues/9853)) ([85fb16c](https://github.com/swc-project/swc/commit/85fb16c3a241bbd87066a119357ad560e336457d))


- **(es/parser)** Fix context of dynamic import type ([#9852](https://github.com/swc-project/swc/issues/9852)) ([caa7f37](https://github.com/swc-project/swc/commit/caa7f370ff2003983a3448a2b7e6f0f6d6224b86))

### Documentation



- Update the link to the team ([0fcdc31](https://github.com/swc-project/swc/commit/0fcdc3143592fe45522c885796dcb826d8992c75))

### Features



- **(ts/fast-strip)** Distinguish invalid vs unsupported ([#9846](https://github.com/swc-project/swc/issues/9846)) ([5709bc2](https://github.com/swc-project/swc/commit/5709bc2205e17540d55d459cd2208a3110e073c9))

### Testing



- **(parallel)** Add test to debug segfault on windows x64 ([#9857](https://github.com/swc-project/swc/issues/9857)) ([ae53a35](https://github.com/swc-project/swc/commit/ae53a359c331ae9bcf93f94e7067381e2e6f1629))

### Build



- Update `wasmer` to `v5.0.5-rc1` ([#9860](https://github.com/swc-project/swc/issues/9860)) ([615ae93](https://github.com/swc-project/swc/commit/615ae9302e5000963f461f2e322d4a6fd6ad12d7))

## [1.10.6] - 2025-01-07

### Performance



- **(es/minifier)** Speed up `merge_sequences_in_exprs` by caching computation ([#9843](https://github.com/swc-project/swc/issues/9843)) ([6e5632f](https://github.com/swc-project/swc/commit/6e5632fa413c73ea5e1393a0b28b93d4000a3ac1))

## [1.10.5] - 2025-01-07

### Bug Fixes



- **(es/minifier)** Fix minification of `framer-motion` by checking `cons.termniates()` ([#9818](https://github.com/swc-project/swc/issues/9818)) ([512c91f](https://github.com/swc-project/swc/commit/512c91fb6253f131f5d3e409427694e87cf7c873))


- **(typescript)** Fix wrong check for super class ([#9822](https://github.com/swc-project/swc/issues/9822)) ([2307a4d](https://github.com/swc-project/swc/commit/2307a4d4d3def405c4a04726272e14d998880abb))

### Documentation



- **(swc_parallel)** Document safety ([#9847](https://github.com/swc-project/swc/issues/9847)) ([d381e2f](https://github.com/swc-project/swc/commit/d381e2f645e51a5e5077fb9069c82159e0fd376a))

### Features



- **(swc_parallel)** Implement basic APIs ([#9840](https://github.com/swc-project/swc/issues/9840)) ([84a6702](https://github.com/swc-project/swc/commit/84a6702e004cbf1ffad2d50f8042e616331345dd))

### Miscellaneous Tasks



- **(deps)** Update cargo (patch) ([#9819](https://github.com/swc-project/swc/issues/9819)) ([e7a9d88](https://github.com/swc-project/swc/commit/e7a9d88ef2f428c0945ca189004f5bddd0a35c81))


- **(deps)** Update dependency magic-string to v0.30.17 ([#9794](https://github.com/swc-project/swc/issues/9794)) ([51595ae](https://github.com/swc-project/swc/commit/51595aedc05007f5a1fd39a7008e1f220cb7ae49))


- **(deps)** Update rust crate phf to v0.11.3 ([#9848](https://github.com/swc-project/swc/issues/9848)) ([66bf0e5](https://github.com/swc-project/swc/commit/66bf0e5917718b89343a0bc011629fa216ef001a))

### Performance



- **(atoms)** Update `hstr` to optimize `==` of `Atom` ([#9845](https://github.com/swc-project/swc/issues/9845)) ([584a0a0](https://github.com/swc-project/swc/commit/584a0a0fab7e007c88f147fa54a4e4cce1947bcd))


- **(es/lints)** Configure a benchmark for ES lints ([#9833](https://github.com/swc-project/swc/issues/9833)) ([734ec21](https://github.com/swc-project/swc/commit/734ec2197f1baf73af0f3d1003595017b06a389b))


- **(es/lints)** Make ES lints faster ([#9837](https://github.com/swc-project/swc/issues/9837)) ([d56a473](https://github.com/swc-project/swc/commit/d56a473e83ffd389814756378150953e49e1b983))


- **(es/lints)** Make lint rules parallel ([#9842](https://github.com/swc-project/swc/issues/9842)) ([e080172](https://github.com/swc-project/swc/commit/e080172b1e919cab4cd319dbb2001e72b7eaaa8d))


- **(es/minifier)** Improve parallelism and cache friendliness ([#9813](https://github.com/swc-project/swc/issues/9813)) ([f8dff56](https://github.com/swc-project/swc/commit/f8dff5602c129b2188eeeb6ee6ada051c5035166))


- **(es/minifier)** Introduce `FastJsWord` and `FastId` in `swc_atoms` ([#9826](https://github.com/swc-project/swc/issues/9826)) ([ef0ec38](https://github.com/swc-project/swc/commit/ef0ec3820f182ded02b5174c8079a5c432d5b8c0))


- **(es/minifier)** Update `hstr` to `v0.2.14` ([#9828](https://github.com/swc-project/swc/issues/9828)) ([bc4ec00](https://github.com/swc-project/swc/commit/bc4ec009a27b3375d2203e5c51143c8dc3723049))


- **(es/minifier)** Replace `rayon` with `chili` ([#9829](https://github.com/swc-project/swc/issues/9829)) ([858e92a](https://github.com/swc-project/swc/commit/858e92ad27a6b0f2b15eea730150b6ef56557831))

### Refactor



- **(es/lints)** Cleanup & prepare using `chili` ([#9838](https://github.com/swc-project/swc/issues/9838)) ([d47844b](https://github.com/swc-project/swc/commit/d47844b769984630b531421a8e9fc1d51548eab7))

### Build



- **(swc_parallel)** Fix build on CI ([#9844](https://github.com/swc-project/swc/issues/9844)) ([a2b7105](https://github.com/swc-project/swc/commit/a2b7105286cbdf2c697917a54fa363e9acb58856))

## [1.10.4] - 2024-12-30

### Bug Fixes



- **(deps)** Update cargo (patch) ([#9733](https://github.com/swc-project/swc/issues/9733)) ([fb2f6e4](https://github.com/swc-project/swc/commit/fb2f6e44aa5c741977cc70b588a1b6e44aac0cde))


- Remove `Caused by: 'failed to parse'` from TS blank space ([#9820](https://github.com/swc-project/swc/issues/9820)) ([aaeb0ab](https://github.com/swc-project/swc/commit/aaeb0ab3b325c4f9d789aec78a52eec0dfcfac83))

## [1.10.3] - 2024-12-27

### Bug Fixes



- **(es/codegen)** Emit semicolon after using declarations ([#9816](https://github.com/swc-project/swc/issues/9816)) ([556d924](https://github.com/swc-project/swc/commit/556d924cf53c2d3a7577bbfbb2b467d41834c23e))

## [1.10.2] - 2024-12-26

### Bug Fixes



- **(es)** Don't panic when wasm bytecheck faild ([#9803](https://github.com/swc-project/swc/issues/9803)) ([c81be2e](https://github.com/swc-project/swc/commit/c81be2ee2818106387d9c9f5d7ee553c6678e18f))


- **(es/parser)** Do not parse empty stmt after using decl ([#9798](https://github.com/swc-project/swc/issues/9798)) ([c2696db](https://github.com/swc-project/swc/commit/c2696db528fc98187c5c5f7413bd9daac7d6c1b6))

### Documentation



- **(types)** Fix broken links ([#9812](https://github.com/swc-project/swc/issues/9812)) ([7768114](https://github.com/swc-project/swc/commit/7768114451c7070c8eeb5faa8ca93f4b63661141))

## [1.10.1] - 2024-12-09

### Bug Fixes



- **(es/resolver)** Fix wrong syntax context of vars with the same names as catch params ([#9786](https://github.com/swc-project/swc/issues/9786)) ([5a44c6b](https://github.com/swc-project/swc/commit/5a44c6b42471aeceb3771b1cf4ebb310d03a0154))

### Features



- **(es/transforms)** Add `module.outFileExtension` ([#9784](https://github.com/swc-project/swc/issues/9784)) ([e04c7b3](https://github.com/swc-project/swc/commit/e04c7b31fcc776ec990ea33f988e2ed38c78962c))

## [1.10.0] - 2024-12-04

### Bug Fixes



- **(es/codegen)** Use raw value for emitting JSX text ([#9762](https://github.com/swc-project/swc/issues/9762)) ([b83c44f](https://github.com/swc-project/swc/commit/b83c44f4ad604edc30ec157aa8fb0d8755adb389))


- **(es/compat)** Fix marker for inlined helpers ([#9776](https://github.com/swc-project/swc/issues/9776)) ([f54ec2c](https://github.com/swc-project/swc/commit/f54ec2c5a0d36b4a43a0aef48e7c56e188795d6f))


- **(es/minifier)** Drop `console` in optional chainings ([#9759](https://github.com/swc-project/swc/issues/9759)) ([39271ad](https://github.com/swc-project/swc/commit/39271addde60d7b02167ce031bca4569e6d72bb8))


- **(es/minifier)** Do not inline into the exact LHS ([#9777](https://github.com/swc-project/swc/issues/9777)) ([985977b](https://github.com/swc-project/swc/commit/985977b750d458d0ccbdff8b2b779224a917a66b))

### Features



- **(es/minifier)** Support `preserve_annotations` of terser ([#9775](https://github.com/swc-project/swc/issues/9775)) ([6e1c9fd](https://github.com/swc-project/swc/commit/6e1c9fde1f0c95a955a11c44474d6f4a57250c74))


- **(typescript)** Align `isolatedDeclaration` implementation with tsc ([#9715](https://github.com/swc-project/swc/issues/9715)) ([0adad25](https://github.com/swc-project/swc/commit/0adad25da123875c8cec2759004d8264237688f0))


- Apply Wasm-breaking changes ([#9771](https://github.com/swc-project/swc/issues/9771)) ([ed65eee](https://github.com/swc-project/swc/commit/ed65eee834a4f3ce4be1f6f57a5f76462f023c1e))

### Miscellaneous Tasks



- **(deps)** Update dependency magic-string to v0.30.13 ([#9747](https://github.com/swc-project/swc/issues/9747)) ([fa80a1e](https://github.com/swc-project/swc/commit/fa80a1eb86cf4babe1d4912f28152d62f068cbbe))


- **(deps)** Update dependency magic-string to v0.30.14 ([#9764](https://github.com/swc-project/swc/issues/9764)) ([6e46a8b](https://github.com/swc-project/swc/commit/6e46a8b30076f9e8017a1d855093a5de9c329577))

### Refactor



- **(estree/compat)** Do not use nightly features ([#9772](https://github.com/swc-project/swc/issues/9772)) ([0f12bbd](https://github.com/swc-project/swc/commit/0f12bbdcaeae3538cabe04db125ac5824da42bd5))

## [1.9.3] - 2024-11-22

### Bug Fixes



- **(@swc/types)** Tsc build file ignored by npm ([#9754](https://github.com/swc-project/swc/issues/9754)) ([14a5c1e](https://github.com/swc-project/swc/commit/14a5c1ebd233ab0e105a1affdf04d689446d80dc))


- **(es)** Source map `super(...args)` calls in injected constructors ([#9745](https://github.com/swc-project/swc/issues/9745)) ([35b0ca0](https://github.com/swc-project/swc/commit/35b0ca007147dea03e911795639c8b032a0fbd28))


- **(es/plugin)** Migrate `swc plugin new` to use `.cargo/config.toml` ([#9740](https://github.com/swc-project/swc/issues/9740)) ([4ffb21e](https://github.com/swc-project/swc/commit/4ffb21ebe6e40f85f8b7f78cd29b10965fe035b1))


- **(es/resolver)** Ignore `VarDecl` with `declare: true` ([#9734](https://github.com/swc-project/swc/issues/9734)) ([aa0f784](https://github.com/swc-project/swc/commit/aa0f784c7d38d106e65e6aae1f0a318f575a0f09))

### Documentation



- **(types)** Document `Assumptions` API ([#9746](https://github.com/swc-project/swc/issues/9746)) ([cd4321c](https://github.com/swc-project/swc/commit/cd4321c88a97a9a6f9d0f972dcebe5e19a1326bb))

### Features



- **(plugin)** Bump `rkyv` to `v0.8.8` ([#9730](https://github.com/swc-project/swc/issues/9730)) ([81ac77e](https://github.com/swc-project/swc/commit/81ac77e3ab399446a0962db1e92d8066b73b3b31))


- **(plugin)** Update `wasmer` to `v5` ([#9731](https://github.com/swc-project/swc/issues/9731)) ([9b74ccd](https://github.com/swc-project/swc/commit/9b74ccd92cf138d11790178f5817c89e44aa2deb))


- **(visit)** Derive serde for `AstParentKind` ([#9744](https://github.com/swc-project/swc/issues/9744)) ([e0fdd68](https://github.com/swc-project/swc/commit/e0fdd68183b9851050e1a03a903261275872044e))

### Miscellaneous Tasks



- **(bindings/node)** Format `binding.js` ([#9738](https://github.com/swc-project/swc/issues/9738)) ([9f8c14f](https://github.com/swc-project/swc/commit/9f8c14f5f81ca66609fe2fbfdac4c970240702e4))


- **(deps)** Update cargo (patch) ([#9724](https://github.com/swc-project/swc/issues/9724)) ([da37439](https://github.com/swc-project/swc/commit/da37439d6b6aae31e2b21690476d93f12dc87bd3))

### Performance



- **(es/plugin)** Make `analyze_source_file` lazy, again ([#9732](https://github.com/swc-project/swc/issues/9732)) ([c1d12d6](https://github.com/swc-project/swc/commit/c1d12d6e2a0ad1633652817ebea435eca404bbb8))

### Refactor



- **(es/compat)** Use special span instead of passing `static_blocks_mark` ([#9725](https://github.com/swc-project/swc/issues/9725)) ([6ad0735](https://github.com/swc-project/swc/commit/6ad0735033b405c04e53c1e3c7ec56db4b8fcf93))


- Delay Wasm-plugin breaking changes ([#9735](https://github.com/swc-project/swc/issues/9735)) ([92faf5b](https://github.com/swc-project/swc/commit/92faf5b15df2ef5954f1a07c7376c04558efe181))

## [1.9.2] - 2024-11-11

### Bug Fixes



- **(es)** Fix typo in feature name ([#9721](https://github.com/swc-project/swc/issues/9721)) ([aff9de5](https://github.com/swc-project/swc/commit/aff9de5ea37d5d34d587b96b8044d08644936524))

### Features



- **(es/codegen)** Implement proper `inline_script` support ([#9729](https://github.com/swc-project/swc/issues/9729)) ([e732a36](https://github.com/swc-project/swc/commit/e732a36373f0959a0653dc51a863230a9b3d8982))

## [1.9.1] - 2024-11-06

### Bug Fixes



- **(es/codegen)** Fix `ends_with_alpha_num` ([#9720](https://github.com/swc-project/swc/issues/9720)) ([569c799](https://github.com/swc-project/swc/commit/569c799c2e98f6104fdc4edb61a28d83f4c930eb))

## [1.9.0] - 2024-11-06

### Bug Fixes



- **(es/minifier)** Avoid generating reserved mangling names ([#9710](https://github.com/swc-project/swc/issues/9710)) ([b49317a](https://github.com/swc-project/swc/commit/b49317a40344c2c153044095f49d0a9e8a1ef3f3))


- **(es/plugin)** Revert #9696 ([#9717](https://github.com/swc-project/swc/issues/9717)) ([772f023](https://github.com/swc-project/swc/commit/772f023fd2f8bbcb336b0561a81621f0f1163622))

### Features



- **(typescript)** Port deno `isolatedDeclarations` updates ([#9712](https://github.com/swc-project/swc/issues/9712)) ([6194044](https://github.com/swc-project/swc/commit/6194044b4293eec01415a1ef67541bf888c33099))

### Miscellaneous Tasks



- **(deps)** Update rust crate is-macro to v0.3.7 ([#9713](https://github.com/swc-project/swc/issues/9713)) ([d48e6e8](https://github.com/swc-project/swc/commit/d48e6e838b303d97c22688706930107ace673560))

## [1.8.0] - 2024-11-04

### Bug Fixes



- **(es/typescript)** Handle multiline type parameters in async arrow functions ([#9704](https://github.com/swc-project/swc/issues/9704)) ([c5ed19c](https://github.com/swc-project/swc/commit/c5ed19c710fd32f5c23b2d85ff8f30cb09f58899))


- **(es/typescript)** Handle ASI hazards in fast type strip ([#9707](https://github.com/swc-project/swc/issues/9707)) ([c135f71](https://github.com/swc-project/swc/commit/c135f718ed933fcd9eb6e5e5ea9accc0179cf333))

### Features



- **(es)** Add `es2023` and `es2024` to `EsVersion` ([#9700](https://github.com/swc-project/swc/issues/9700)) ([5a6f0e6](https://github.com/swc-project/swc/commit/5a6f0e644ebd515c9de69f8efa0e2b5c79944a1d))


- **(es/plugin)** Introduce `manual-tokio-runtmie` to `swc` crate ([#9701](https://github.com/swc-project/swc/issues/9701)) ([97298c4](https://github.com/swc-project/swc/commit/97298c4e36318674f82343b9cde2d938265ea3d8))

### Performance



- **(common)** Make character analysis lazy ([#9696](https://github.com/swc-project/swc/issues/9696)) ([1c3eaf6](https://github.com/swc-project/swc/commit/1c3eaf684a40a22b09779db39cf68986e69147f1))


- **(es/renamer)** Modify parallel renaming threshold ([#9706](https://github.com/swc-project/swc/issues/9706)) ([91a9106](https://github.com/swc-project/swc/commit/91a9106624f999951b9eb0f424faedb131a4297a))

## [1.7.42] - 2024-10-31

### Bug Fixes



- **(es/generator)** Fix code generation for `break` in nested while ([#9684](https://github.com/swc-project/swc/issues/9684)) ([65872af](https://github.com/swc-project/swc/commit/65872afaf151412be5f14820080325b920901bfb))


- **(es/parser)** Parse `await using()` call ([#9693](https://github.com/swc-project/swc/issues/9693)) ([bcf05de](https://github.com/swc-project/swc/commit/bcf05de2ebe755a54ec8a6b93311b1686494c578))


- **(es/resolver)** Skip resolving lowercase `JSXIdentifiers` ([#9686](https://github.com/swc-project/swc/issues/9686)) ([6ed1715](https://github.com/swc-project/swc/commit/6ed1715b93875cd4588352a784ed876bf183df5d))


- **(es/types)** Add `jsc.experimental.keepImportAssertions` to types ([#9691](https://github.com/swc-project/swc/issues/9691)) ([4b4dcfa](https://github.com/swc-project/swc/commit/4b4dcfa4d8532c84762b19737b66474e97480cef))

### Features



- **(es/minifier)** Optimize switch with side effect and termination tests ([#9677](https://github.com/swc-project/swc/issues/9677)) ([7344a63](https://github.com/swc-project/swc/commit/7344a638b55d483571ab4b35edf56f7088de792b))


- **(es/parser)** Ability to get script's potential module errors ([#9682](https://github.com/swc-project/swc/issues/9682)) ([2bbd1e8](https://github.com/swc-project/swc/commit/2bbd1e8485ca7c152d408cc34cd51460467171a7))

### Miscellaneous Tasks



- **(deps)** Update cargo (patch) ([#9607](https://github.com/swc-project/swc/issues/9607)) ([3597b0f](https://github.com/swc-project/swc/commit/3597b0f53d060b09b7e878e9c825321f053d189e))

### Performance



- **(es)** Cache `current_dir()` system calls ([#9683](https://github.com/swc-project/swc/issues/9683)) ([7aab945](https://github.com/swc-project/swc/commit/7aab945a2199be06e20a35ec0d197fc817a48d9d))


- **(es/lints)** Disable lints by default ([#9689](https://github.com/swc-project/swc/issues/9689)) ([4d887d0](https://github.com/swc-project/swc/commit/4d887d062b299b42b1a6529dfac5f22c3fd49903))


- **(visit)** Introduce `Pass` API and adjust visitor APIs for it ([#9680](https://github.com/swc-project/swc/issues/9680)) ([581aafb](https://github.com/swc-project/swc/commit/581aafb4dfbbcf9b834e3b578cad83fec452a062))

## [1.7.40] - 2024-10-26

### Bug Fixes



- **(bindings)** Update napi to handle string with `\0` ([#9665](https://github.com/swc-project/swc/issues/9665)) ([8f45eaf](https://github.com/swc-project/swc/commit/8f45eaf837d023847c478e562265e141213ce231))


- **(bindings/node)** Add `VisitTsPropertySignature` ([#9670](https://github.com/swc-project/swc/issues/9670)) ([715c42c](https://github.com/swc-project/swc/commit/715c42c0bfe699d822a7e9ea18751d35aac3235d))


- **(es/codegen)** Improve EndsWithAlphaNum ([#9675](https://github.com/swc-project/swc/issues/9675)) ([ba2a942](https://github.com/swc-project/swc/commit/ba2a942f56776e6927b48cfd185d8720052b7409))


- **(es/renamer)** Check `preserved` in normal renaming mode ([#9666](https://github.com/swc-project/swc/issues/9666)) ([87b4e10](https://github.com/swc-project/swc/commit/87b4e10e5dbeb236ee5232d85d3176472fa4a9d0))


- **(typescript)** Check whether the method is abstract when checking `is_overload` ([#9678](https://github.com/swc-project/swc/issues/9678)) ([78500af](https://github.com/swc-project/swc/commit/78500af546ea3c92f016c729e173c66fccbe46ed))

### Documentation



- **(contributing)** Document changeset ([#9667](https://github.com/swc-project/swc/issues/9667)) ([602c667](https://github.com/swc-project/swc/commit/602c667b9d435fa9155345952379287cb11e59db))

### Miscellaneous Tasks



- **(deps)** Update dependency swc-plugin-coverage-instrument to ^0.0.25 ([#9676](https://github.com/swc-project/swc/issues/9676)) ([b8d255b](https://github.com/swc-project/swc/commit/b8d255bf5aa65a5589331b0924269a23b3052137))

## [1.7.39] - 2024-10-22

### Bug Fixes



- **(es/compat)** Add missing visit children for `destructuring` ([#9658](https://github.com/swc-project/swc/issues/9658)) ([32116a0](https://github.com/swc-project/swc/commit/32116a0940a5806d8ad291b5fd6d056709a396bc))


- **(es/parser)** Correct `>` and `<` when exit type context ([#9653](https://github.com/swc-project/swc/issues/9653)) ([abffc07](https://github.com/swc-project/swc/commit/abffc073561b3ba3906aa0923ef3880e5e30d538))


- **(es/proposal)** Use `tsc` version of explicit resource management ([#9585](https://github.com/swc-project/swc/issues/9585)) ([f735108](https://github.com/swc-project/swc/commit/f7351080174c61bad5950be9b30c75c4f17ebe3e))


- **(wasm-typescript)** Fix option types of functions ([#9662](https://github.com/swc-project/swc/issues/9662)) ([4cbe33c](https://github.com/swc-project/swc/commit/4cbe33c32f244e9c568d388f19c0f297bf3d74f1))

### Features



- **(es/minifier)** Implement optional catch binding ([#9657](https://github.com/swc-project/swc/issues/9657)) ([f70b842](https://github.com/swc-project/swc/commit/f70b842c5579c945fcd6357edb712507228f5eb5))

### Miscellaneous Tasks



- **(es/typescript)** Improve enum comments and sourcemap ([#9652](https://github.com/swc-project/swc/issues/9652)) ([31fe3b6](https://github.com/swc-project/swc/commit/31fe3b6be151cbf63fe1ff06f922f814da105d08))

## [1.7.36] - 2024-10-15

### Bug Fixes



- **(es)** Run esnext transforms on esnext target ([#9644](https://github.com/swc-project/swc/issues/9644)) ([8a19201](https://github.com/swc-project/swc/commit/8a192018247ad7ac253c2964038de5f626acb8c4))


- **(es/codegen)** Emit space after div if rhs has leading comment ([#9631](https://github.com/swc-project/swc/issues/9631)) ([f2be26e](https://github.com/swc-project/swc/commit/f2be26efe090f5c1575f5bb9e4067f7ae531f11c))


- **(es/lints)** Correct the false positive error of TS2309 ([#9635](https://github.com/swc-project/swc/issues/9635)) ([f74c1f3](https://github.com/swc-project/swc/commit/f74c1f3e5a117c22aa87a2754715066cb8dfe0fe))


- **(es/minifier)** Only merge last if return ([#9633](https://github.com/swc-project/swc/issues/9633)) ([6f52949](https://github.com/swc-project/swc/commit/6f52949210ee2a71ed119cbcdf2db1842a2e63cb))


- **(es/minifier)** Check type of assignment target before merging assignments ([#9617](https://github.com/swc-project/swc/issues/9617)) ([4436621](https://github.com/swc-project/swc/commit/44366215644f3fff2f897e509a56b36cb5e1f8a2))

### Features



- **(es)** Introduce `runPluginFirst` for Wasm plugins ([#9645](https://github.com/swc-project/swc/issues/9645)) ([3d3e434](https://github.com/swc-project/swc/commit/3d3e4340b33e124f551ee88b68bfaddb537a3c6a))


- **(es/minifier)** Support unary negate in `cast_to_number` ([#9642](https://github.com/swc-project/swc/issues/9642)) ([88a2186](https://github.com/swc-project/swc/commit/88a2186ba419c98c73b997ca9ea90d7a8fd128e4))

### Miscellaneous Tasks



- **(deps)** Update dependency magic-string to v0.30.12 ([#9634](https://github.com/swc-project/swc/issues/9634)) ([085bc19](https://github.com/swc-project/swc/commit/085bc191e46d4d46efc3d4a7cd5fc1240c8474dd))

## [1.7.35] - 2024-10-10

### Bug Fixes



- **(ci)** Fix target triples ([#9622](https://github.com/swc-project/swc/issues/9622)) ([f625035](https://github.com/swc-project/swc/commit/f625035f8a21eb6d2bc487669a534257f3ef7c7c))


- **(es/codegen)** Fix source map so it works with Sentry ([#9627](https://github.com/swc-project/swc/issues/9627)) ([9c90a73](https://github.com/swc-project/swc/commit/9c90a733691e9a15bc1c4182edabcefa8054e9d3))


- **(es/minifier)** Compress consecutive return statements properly ([#9620](https://github.com/swc-project/swc/issues/9620)) ([8263da1](https://github.com/swc-project/swc/commit/8263da17664cc7cb5d49e1a8e9fbca8037fe991f))


- **(es/module)** Allow TypeScript nodes for `Rewriter` ([#9606](https://github.com/swc-project/swc/issues/9606)) ([4ee45ac](https://github.com/swc-project/swc/commit/4ee45ac1fd10da1ea982a152a458deb9f5359998))


- **(es/testing)** Revert #9264 ([#9621](https://github.com/swc-project/swc/issues/9621)) ([85f5e5b](https://github.com/swc-project/swc/commit/85f5e5b955f65ad6b21b9f4aee5b8dacd8a71e93))


- **(html/minifier)** Fix HTML minifier TS types ([#9615](https://github.com/swc-project/swc/issues/9615)) ([7b98bb5](https://github.com/swc-project/swc/commit/7b98bb5e93b132fa14af27b1eadbcf38f0bbcb62))

### Features



- **(bindings/html)** Accept `Buffer|string` instead of `Buffer` ([#9625](https://github.com/swc-project/swc/issues/9625)) ([62edb36](https://github.com/swc-project/swc/commit/62edb3628b26036cdc767b31d59e109c3970497c))


- **(es/preset-env)** Update preset-env data ([#9573](https://github.com/swc-project/swc/issues/9573)) ([9a11d34](https://github.com/swc-project/swc/commit/9a11d34ee569f64e8db02fc90beacbba0f2de0cf))


- **(es/testing)** Parse test code as a `Program` instead of a `Module` ([#9264](https://github.com/swc-project/swc/issues/9264)) ([166b858](https://github.com/swc-project/swc/commit/166b8581c226b127f5d503cd21c22c0a3a8c675c))


- **(es/testing)** Parse test code as a `Program` instead of a `Module` ([#9623](https://github.com/swc-project/swc/issues/9623)) ([bfea322](https://github.com/swc-project/swc/commit/bfea3223515e378c3ebe669f4a9012919f4f9547))

### Miscellaneous Tasks



- **(atoms)** Update `hstr` ([#9612](https://github.com/swc-project/swc/issues/9612)) ([e2e9a9c](https://github.com/swc-project/swc/commit/e2e9a9ccfce75e69546c54fc88a708b4e1dda13b))

### Performance



- **(es)** Avoid needless string comparisons ([#9613](https://github.com/swc-project/swc/issues/9613)) ([ec0a62c](https://github.com/swc-project/swc/commit/ec0a62cbc5c9a20f02d1c558ff2708e7367922a9))


- **(es/codegen)** Reduce usage of `tracing::instrument` ([#9604](https://github.com/swc-project/swc/issues/9604)) ([2f06fc5](https://github.com/swc-project/swc/commit/2f06fc559c8e200ea89133b8b30045f970ffc20b))


- **(es/transforms)** Copy benchmarks from `oxc` ([#9602](https://github.com/swc-project/swc/issues/9602)) ([24c3a0c](https://github.com/swc-project/swc/commit/24c3a0ce138bacbf12b4660862ccfe9e3d19bdd9))


- **(es/typescript)** Reduce unnecessary visits ([#9605](https://github.com/swc-project/swc/issues/9605)) ([866af6c](https://github.com/swc-project/swc/commit/866af6c9478b92cd6be780c515ddd51d2db90ac3))

### Refactor



- **(es/typescript)** Simplifying enum and namespace transforms ([#9558](https://github.com/swc-project/swc/issues/9558)) ([2480bb0](https://github.com/swc-project/swc/commit/2480bb00fc71d588af506eb18f33afa56622361f))

### Build



- Update `rustc` to `nightly-2024-10-07` ([#9624](https://github.com/swc-project/swc/issues/9624)) ([6a3b0fc](https://github.com/swc-project/swc/commit/6a3b0fc1660cba4310880881f21e3bf81aceac0d))

## [1.7.29] - 2024-10-01

### Bug Fixes



- **(deps)** Update cargo (patch) ([#9454](https://github.com/swc-project/swc/issues/9454)) ([b28047a](https://github.com/swc-project/swc/commit/b28047a48b06e1e505e9cad3c70f5a921862d83b))


- **(es/codegen)** Emit .d.ts when using --out-file ([#9582](https://github.com/swc-project/swc/issues/9582)) ([3d9d641](https://github.com/swc-project/swc/commit/3d9d641f8b49725014e7d7a72a6f0a5dfe01f42c))


- **(es/minifier)** Ignore using declarations ([#9598](https://github.com/swc-project/swc/issues/9598)) ([1659c21](https://github.com/swc-project/swc/commit/1659c212b2edf1505def54b7222b3b6a633de3dc))


- **(es/module)** Fix `jsc.paths` using absolute paths with dots in a filename for an alias ([#9595](https://github.com/swc-project/swc/issues/9595)) ([74e3d04](https://github.com/swc-project/swc/commit/74e3d0466abcd7422620623d8adcceac04ce26c9))


- **(es/parser)** Fix failure of TS instantiation followed by satisfies ([#9583](https://github.com/swc-project/swc/issues/9583)) ([77900d8](https://github.com/swc-project/swc/commit/77900d808e2a3be2e62b74022c88a81b26a73f86))

### Features



- **(es)** Add options to disable all `esnext` transforms and lints ([#9597](https://github.com/swc-project/swc/issues/9597)) ([f2b0766](https://github.com/swc-project/swc/commit/f2b07665bfe7175dcfcca92b9d2a6776a714d14e))

### Miscellaneous Tasks



- **(es)** Add helpers ([#9586](https://github.com/swc-project/swc/issues/9586)) ([b94a0e1](https://github.com/swc-project/swc/commit/b94a0e1fd2b900b05c5f18d3d993a74ff9cc6e7d))

## [1.7.28] - 2024-09-24

### Bug Fixes



- **(ast)** Add `archive(check_bytes)` to all relevant AST types ([#9574](https://github.com/swc-project/swc/issues/9574)) ([185d6f5](https://github.com/swc-project/swc/commit/185d6f55b35f4f8323035c1199cddb9dd547f254))


- **(cli)** Exclude non-files from get_files_list ([#9560](https://github.com/swc-project/swc/issues/9560)) ([85cc2bd](https://github.com/swc-project/swc/commit/85cc2bd79c3193cb0a8b54e4fce0efc1aa15b271))


- **(es/codegen)** Fix wrong sourcemap when there are new lines in tpl ([#9578](https://github.com/swc-project/swc/issues/9578)) ([cf74382](https://github.com/swc-project/swc/commit/cf74382ba0429c0d4f04428889cf53a5231fad7f))


- **(es/compat)** Skip `getter` and `setter` as FlowHelper `function` do ([#9580](https://github.com/swc-project/swc/issues/9580)) ([14cfd70](https://github.com/swc-project/swc/commit/14cfd70ee00938497ce6b59f68332f9daa17378b))


- **(es/isolated-dts)** Preserve comments ([#9572](https://github.com/swc-project/swc/issues/9572)) ([6d15d9c](https://github.com/swc-project/swc/commit/6d15d9c2eb4397b15908cda38f2e44e02d81ebc1))


- **(es/minifier)** Avoid decl name when mangle with eval ([#9546](https://github.com/swc-project/swc/issues/9546)) ([e2242c4](https://github.com/swc-project/swc/commit/e2242c41c4d648a32119eb8141dd9990b2c8c468))


- **(es/minifier)** Check variable type while optimizing `+=` ([#9575](https://github.com/swc-project/swc/issues/9575)) ([04016e9](https://github.com/swc-project/swc/commit/04016e9687c5f02e764ffc9d7be2432d16da5dc0))


- **(es/module)** Rewrite import specifier in type declaration ([#9577](https://github.com/swc-project/swc/issues/9577)) ([fc0ba2a](https://github.com/swc-project/swc/commit/fc0ba2a08408b90f7d799cd5707dfa6827334085))


- **(plugin)** Don't panic when ast byte not match ([#9562](https://github.com/swc-project/swc/issues/9562)) ([c36871a](https://github.com/swc-project/swc/commit/c36871a84826cc125c3c10a78ee2d7a435373154))

### Miscellaneous Tasks



- **(es)** Update `wasmer` to `v4.3.7` ([#9557](https://github.com/swc-project/swc/issues/9557)) ([190d6f0](https://github.com/swc-project/swc/commit/190d6f06d9545e4206bdb53c0f1ba2d443a5a7ab))

### Testing



- **(es)** Add tests for arm64 windows ([#9547](https://github.com/swc-project/swc/issues/9547)) ([9dd8f6f](https://github.com/swc-project/swc/commit/9dd8f6facf29817902ddf55ec0388061585cbf7d))

## [1.7.25] - 2024-09-11

### Bug Fixes



- **(es/codegen)** Handle minify number ([#9541](https://github.com/swc-project/swc/issues/9541)) ([8b1e442](https://github.com/swc-project/swc/commit/8b1e4428a3324dea76ba480a6d4cddf3865e41e8))


- **(es/codegen)** Ensure decorators are emitted first in TS paramters ([#9545](https://github.com/swc-project/swc/issues/9545)) ([47ef38d](https://github.com/swc-project/swc/commit/47ef38dc1d53918604481fd078c76554b012a82b))

### Features



- **(es/common)** Introduce pure `Span` and `BytePos` to handle `#__PURE__` ([#9539](https://github.com/swc-project/swc/issues/9539)) ([f63a481](https://github.com/swc-project/swc/commit/f63a481833ebe9b5eae0708ee69b6a50b946ee28))

### Miscellaneous Tasks



- **(bindings/node)** Fix type definition ([64ec111](https://github.com/swc-project/swc/commit/64ec1117697029895284e248d79698f802cf1aa8))

## [1.7.24] - 2024-09-08

### Bug Fixes



- **(es/compat)** Handle label block in constructor ([#9528](https://github.com/swc-project/swc/issues/9528)) ([c43dbad](https://github.com/swc-project/swc/commit/c43dbad028072396390029af44e31bc3292a342a))


- **(es/decorator)** Add support for private access expressions in legacy decorators ([#9535](https://github.com/swc-project/swc/issues/9535)) ([62ed065](https://github.com/swc-project/swc/commit/62ed0655e6d9be2f4a5c641a969b41b8c0e7f75a))


- **(es/minifier)** `typeof` class should be `function` ([#9522](https://github.com/swc-project/swc/issues/9522)) ([c7fdd6b](https://github.com/swc-project/swc/commit/c7fdd6b69b129a11465125d4e11a898326b7e884))


- **(es/minifier)** Prevent removing side effects from accessing getter ([#9530](https://github.com/swc-project/swc/issues/9530)) ([8513816](https://github.com/swc-project/swc/commit/8513816139c6ceef12a906b03c1bcf9471ce0b07))


- **(es/typescript)** Handle enum in single statement ([#9532](https://github.com/swc-project/swc/issues/9532)) ([84b0043](https://github.com/swc-project/swc/commit/84b004387ba8f4135659e1d1f54e59bf1941a57a))

## [1.7.23] - 2024-09-02

### Bug Fixes



- **(es/minifier)** Fix name mangler ([#9524](https://github.com/swc-project/swc/issues/9524)) ([5fd68f9](https://github.com/swc-project/swc/commit/5fd68f9a3a9eeef0e61627a821c52ace69a89696))

### Performance



- **(es/compat)** Reimplement constructor transform ([#9519](https://github.com/swc-project/swc/issues/9519)) ([4b85a92](https://github.com/swc-project/swc/commit/4b85a92170576f194c2b1ad3b3ec624c4839e215))


- **(es/utils)** Rewrite inject_after_super ([#9496](https://github.com/swc-project/swc/issues/9496)) ([c562cfa](https://github.com/swc-project/swc/commit/c562cfa8af1163a4946ef79cb025d461c7e2e5e0))

## [1.7.22] - 2024-08-30

### Bug Fixes



- **(es/minifier)** Iterate object properties in reverse direction while inlining property access ([#9507](https://github.com/swc-project/swc/issues/9507)) ([f584ef7](https://github.com/swc-project/swc/commit/f584ef76d75e86da15d0725ac94be35a88a1c946))

## [1.7.21] - 2024-08-28

### Bug Fixes



- **(es/typescript)** Preserve more comments ([#9509](https://github.com/swc-project/swc/issues/9509)) ([3e253ec](https://github.com/swc-project/swc/commit/3e253ecc21f2028437572093b42df97ef5fe505e))

## [1.7.19] - 2024-08-28

### Bug Fixes



- **(es/minifier)** Track if a var is used with `in` ([#9508](https://github.com/swc-project/swc/issues/9508)) ([7d6269e](https://github.com/swc-project/swc/commit/7d6269e3b826524e340edf274a5e42b2a0ea058a))

### Features



- **(es/minifier)** Support mangle cache ([#9489](https://github.com/swc-project/swc/issues/9489)) ([af922d8](https://github.com/swc-project/swc/commit/af922d83e58596021476006564edb6270069d437))


- **(plugin/runner)** Improve error message ([#9502](https://github.com/swc-project/swc/issues/9502)) ([da52930](https://github.com/swc-project/swc/commit/da529304fe23bcb1a15c25811f928ebf91207ef0))

### Miscellaneous Tasks



- **(es/codegen)** Bump minimum required swc_allocator version to 0.1.8 ([#9492](https://github.com/swc-project/swc/issues/9492)) ([5258763](https://github.com/swc-project/swc/commit/5258763cf673e1684808bc2766ba6ee9c84642f1))

### Refactor



- **(es/utils)** Unify `prepend_stmts` ([#9493](https://github.com/swc-project/swc/issues/9493)) ([faec8c1](https://github.com/swc-project/swc/commit/faec8c134d950d10a9f2dce0e5680d9230f87ceb))

## [1.7.17] - 2024-08-23

### Bug Fixes



- **(bindings/wasm)** Fix typing ([#9469](https://github.com/swc-project/swc/issues/9469)) ([8c007c4](https://github.com/swc-project/swc/commit/8c007c402f73c0839e45066eaa8a01b98edf2f94))


- **(ci)** FIx pattern for `actions/download-artifact` ([ac7bd31](https://github.com/swc-project/swc/commit/ac7bd31e8cd79f9df7f3bf6ac05e84b67b0f4546))


- **(es/minifier)** Force rename synthesized identifiers ([#9473](https://github.com/swc-project/swc/issues/9473)) ([c72b5f8](https://github.com/swc-project/swc/commit/c72b5f8b327118794c3a9c76f68ac30005c94793))


- **(es/minifier)** Mark LHS of for-in/of as update ([#9474](https://github.com/swc-project/swc/issues/9474)) ([ac432c4](https://github.com/swc-project/swc/commit/ac432c4bff26d5ceb1fa349552dfad829075c673))


- **(es/typescript)** Correctly handle deep import chains ([#9487](https://github.com/swc-project/swc/issues/9487)) ([50d70d3](https://github.com/swc-project/swc/commit/50d70d35d0810494a6a76f062177caf185fb9c77))


- **(es/typescript)** Correctly handle ESM context ([#9490](https://github.com/swc-project/swc/issues/9490)) ([fc0483c](https://github.com/swc-project/swc/commit/fc0483ce1becefde4d7736d52b7c1da9aaf77b9a))


- **(html)** Fix html binding ([eefae1c](https://github.com/swc-project/swc/commit/eefae1cde794b28b68e5c0af2d2f13a5053b7a49))

### Features



- **(bindings/html)** Allow using `lightningcss` as minfiier ([#9462](https://github.com/swc-project/swc/issues/9462)) ([74d6478](https://github.com/swc-project/swc/commit/74d6478be1eb8cdf1df096c360c159db64b64d8a))


- **(es/minifier)** Drop more patterns with `PURE` marker ([#9478](https://github.com/swc-project/swc/issues/9478)) ([ede1a52](https://github.com/swc-project/swc/commit/ede1a52cb8fb681ca08c54880c75c9b115c7a906))


- **(es/parser)** Disallow `let let` ([#9484](https://github.com/swc-project/swc/issues/9484)) ([1121bc0](https://github.com/swc-project/swc/commit/1121bc0dc161520a418945dbc610c30adc7ab3aa))


- **(visit)** Add experimental traverse APIs ([#9464](https://github.com/swc-project/swc/issues/9464)) ([3ee8980](https://github.com/swc-project/swc/commit/3ee8980dbe82587285e4920420687ab7ac7c5cdf))

### Miscellaneous Tasks



- **(html)** Use `binding_html_node` instead of `html_node` ([bdea5cb](https://github.com/swc-project/swc/commit/bdea5cb94cf7cc9d02274f32e104b55f977e625d))


- **(html)** Fix publish action ([f30fd4f](https://github.com/swc-project/swc/commit/f30fd4fe42764ee29031ce4c0c038c1c95235482))


- **(plugin/runner)** Fix benchmark ([#9477](https://github.com/swc-project/swc/issues/9477)) ([b0b5e36](https://github.com/swc-project/swc/commit/b0b5e36675835ce5f98ad55528dddc6514064553))

### Performance



- **(visit)** Add linear AST traversal ([#9452](https://github.com/swc-project/swc/issues/9452)) ([911d4ea](https://github.com/swc-project/swc/commit/911d4eaa146ff493636308a3cebd8b21d941bfde))

### Refactor



- **(common)** Simplify `SyntaxContext` and `Mark` ([#9476](https://github.com/swc-project/swc/issues/9476)) ([4bee30a](https://github.com/swc-project/swc/commit/4bee30ab40de19c844956e156a7fb3bed1506daa))

## [1.7.14] - 2024-08-19

### Bug Fixes



- **(common)** Use `SourceMap::adjust_mappings` in correct order ([#9447](https://github.com/swc-project/swc/issues/9447)) ([05961eb](https://github.com/swc-project/swc/commit/05961eb018e2e76ed5ef95de9bad923b2fe1df88))


- **(es)** Preserve more comments ([#9449](https://github.com/swc-project/swc/issues/9449)) ([673655c](https://github.com/swc-project/swc/commit/673655c1697ff1d507f7acbfa937cbf1f58eb1d9))

### Features



- **(es/decorators)** Groundwork for stage 3 decorator ([#9450](https://github.com/swc-project/swc/issues/9450)) ([238ba8b](https://github.com/swc-project/swc/commit/238ba8b1d2220202129595185bd4411b9415cc99))

### Refactor



- **(visit)** Remove `VisitAll` ([#9448](https://github.com/swc-project/swc/issues/9448)) ([8845b76](https://github.com/swc-project/swc/commit/8845b76ac40b36791c79618c5ee89f05d2d08c96))

## [1.7.12] - 2024-08-19

### Bug Fixes



- **(common)** Do not use `adjust_mappings` from `sourcemap` crate ([#9437](https://github.com/swc-project/swc/issues/9437)) ([563c162](https://github.com/swc-project/swc/commit/563c162f1ca8904e7b9a61a0c79fad952a56d624))


- **(es)** Mark TypeScript nodes as reachable from `Evaluator` ([#9440](https://github.com/swc-project/swc/issues/9440)) ([308e5ec](https://github.com/swc-project/swc/commit/308e5ec81b4e6d49c5940f2d8914d8627f838141))


- **(es/compat)** Init this in sub class constructor for async ([#9446](https://github.com/swc-project/swc/issues/9446)) ([bfaf31b](https://github.com/swc-project/swc/commit/bfaf31bc4b90ff803457bfdafdbcef0318b76189))


- **(es/decorators)** Fix metadata for accessors ([#9444](https://github.com/swc-project/swc/issues/9444)) ([99738ef](https://github.com/swc-project/swc/commit/99738ef41233211d6e26de520c3817d395492d37))

### Miscellaneous Tasks



- **(deps)** Update rust crate arrayvec to v0.7.6 ([#9436](https://github.com/swc-project/swc/issues/9436)) ([08dd948](https://github.com/swc-project/swc/commit/08dd948289006583c6f0f76850c08808651f9135))

## [1.7.11] - 2024-08-14

### Bug Fixes



- **(es)** Improve sourcemap url error messages. ([#9422](https://github.com/swc-project/swc/issues/9422)) ([230d1d9](https://github.com/swc-project/swc/commit/230d1d98b91bde2fa0de54e5fe06e899302e481c))


- **(visit)** Fix regression of AST paths ([#9420](https://github.com/swc-project/swc/issues/9420)) ([9751518](https://github.com/swc-project/swc/commit/9751518a0aa1cbe07e2ad4db7a32b0c6cc342641))

### Features



- **(es/typescript)** Add `native_class_properties ` to skip reordering of class properties inits ([#9421](https://github.com/swc-project/swc/issues/9421)) ([d2929d1](https://github.com/swc-project/swc/commit/d2929d1ce61a00360cc0596441041571a958da23))


- **(estree/compat)** Remove dependency on `rayon` ([#9393](https://github.com/swc-project/swc/issues/9393)) ([34d1b27](https://github.com/swc-project/swc/commit/34d1b27251dab3f87dc3a39d245a3498b4c2b151))


- **(html/minifier)** Support using custom css minifier ([#9425](https://github.com/swc-project/swc/issues/9425)) ([970cc81](https://github.com/swc-project/swc/commit/970cc81033b4a616643be6625bdf8da99614ba98))

### Miscellaneous Tasks



- **(bindings/node)** Deprecate `parse` ([#9419](https://github.com/swc-project/swc/issues/9419)) ([1bf467d](https://github.com/swc-project/swc/commit/1bf467d99fb72ebff42136e08d7f03d50872f64e))


- **(deps)** Update cargo (patch) ([#9405](https://github.com/swc-project/swc/issues/9405)) ([baf4928](https://github.com/swc-project/swc/commit/baf4928ce2964e659af5ca77cd899427a8c29f60))


- **(es/preset-env)** Update core js compat data ([#9407](https://github.com/swc-project/swc/issues/9407)) ([ce761cf](https://github.com/swc-project/swc/commit/ce761cf51571f70c9378b6b67759bac3af4f4f92))


- **(es/typescript)** Remove the workaround for wasm-bindgen ([#9428](https://github.com/swc-project/swc/issues/9428)) ([55f7268](https://github.com/swc-project/swc/commit/55f72687f69eae131c6ce08d6a449afaa7357667))

## [1.7.10] - 2024-08-09

### Bug Fixes



- **(es/typescript)** Strip optional mark and definite mark ([#9411](https://github.com/swc-project/swc/issues/9411)) ([8c161a0](https://github.com/swc-project/swc/commit/8c161a003e741320434f31617bc2de98dd2c9a8f))


- **(es/typescript)** Strip exported default overload function declaration ([#9412](https://github.com/swc-project/swc/issues/9412)) ([b395f48](https://github.com/swc-project/swc/commit/b395f483d1e0cb43b1f96126c5c17f9a8c9d0d32))


- **(es/typescript)** Strip `this` param in getter/setter ([#9414](https://github.com/swc-project/swc/issues/9414)) ([442fb7b](https://github.com/swc-project/swc/commit/442fb7b48715597d62f8d09327f93acc66f2d1b8))


- **(es/typescript)** Update ts-strip type definition ([#9415](https://github.com/swc-project/swc/issues/9415)) ([165c8fa](https://github.com/swc-project/swc/commit/165c8facd42d756077fde99defe91ffe656aede8))

## [1.7.9] - 2024-08-09

### Bug Fixes



- **(es/typescript)** Strip class modifiers ([#9399](https://github.com/swc-project/swc/issues/9399)) ([124e5ff](https://github.com/swc-project/swc/commit/124e5ffa7bcf26215a339450f6b40161dabbe5a4))

## [1.7.8] - 2024-08-09

### Bug Fixes



- **(common)** Do not generate invalid source map ([#9050](https://github.com/swc-project/swc/issues/9050)) ([9d65c77](https://github.com/swc-project/swc/commit/9d65c776025346985acaf36bc1d54134ebc4c7c4))


- **(common)** Require newer version of allocator ([#9386](https://github.com/swc-project/swc/issues/9386)) ([4e854c7](https://github.com/swc-project/swc/commit/4e854c79960df75f5259bee8ab71ab77a57f55f3))


- **(common)** Remove unused import ([#9387](https://github.com/swc-project/swc/issues/9387)) ([f530476](https://github.com/swc-project/swc/commit/f5304761b315a961fe2c1165907bf35a084a7c86))


- **(es/minifier)** Preserve function length ([#9389](https://github.com/swc-project/swc/issues/9389)) ([679682c](https://github.com/swc-project/swc/commit/679682ce36e35dd94bbc4b3406d3c8173db10b96))


- **(es/module)** Drop the level of a few tracing events ([#9380](https://github.com/swc-project/swc/issues/9380)) ([95af253](https://github.com/swc-project/swc/commit/95af2536a2cd5040f44e93f2eea9cf577558f335))


- **(es/parser)** Fix span of EOF errors ([#9378](https://github.com/swc-project/swc/issues/9378)) ([f702657](https://github.com/swc-project/swc/commit/f7026578b9ac50b5ac9f08fa51b1e320040ee083))


- **(es/typescript)** Enable Injector to process JSX ([#9395](https://github.com/swc-project/swc/issues/9395)) ([e24e2ff](https://github.com/swc-project/swc/commit/e24e2ffe5971d2d1ef667c910a12b94ca41f1b52))


- **(es/typescript)** Strip declaration of exported function overloads ([#9397](https://github.com/swc-project/swc/issues/9397)) ([5c8aa52](https://github.com/swc-project/swc/commit/5c8aa522da205fc7fab156cb9d44c8acca872523))


- **(visit)** Fix regression ([#9404](https://github.com/swc-project/swc/issues/9404)) ([041a7b7](https://github.com/swc-project/swc/commit/041a7b7ff756fcdac9cc1d25f5ee82b355e73246))

### Features



- **(visit)** Make `kind()` accessible without `swc_visit` ([#9382](https://github.com/swc-project/swc/issues/9382)) ([021e41d](https://github.com/swc-project/swc/commit/021e41d1534da5d9ba17b9d8f14da6652133f467))

### Miscellaneous Tasks



- **(common)** Remove `dbg` log ([#9384](https://github.com/swc-project/swc/issues/9384)) ([a538ca1](https://github.com/swc-project/swc/commit/a538ca1990e7b5b8841bc4a883b464c7690e2022))


- **(deps)** Update cargo (patch) ([#9402](https://github.com/swc-project/swc/issues/9402)) ([10d99e5](https://github.com/swc-project/swc/commit/10d99e5f2b58cbd87746fc88cd49328788bdea03))


- **(es/typescript)** Remove `unreachable_visit_mut_type` ([#9390](https://github.com/swc-project/swc/issues/9390)) ([8e49c90](https://github.com/swc-project/swc/commit/8e49c904d80a04610d307ce1751f5a572871abbb))

### Testing



- **(es/typescript)** Verify TypeScript stripped output ([#9398](https://github.com/swc-project/swc/issues/9398)) ([4c4c860](https://github.com/swc-project/swc/commit/4c4c86014f7827e92731c0d60ef1613238648b30))

## [1.7.6] - 2024-08-04

### Bug Fixes



- **(es/codegen)** Print the missing `abstract` in class expression ([#9372](https://github.com/swc-project/swc/issues/9372)) ([c2e3021](https://github.com/swc-project/swc/commit/c2e302127fc80970d4b5096c93e29c9ce76a2fe4))


- **(es/decorators)** Use correct class name reference ([#9375](https://github.com/swc-project/swc/issues/9375)) ([badd6a9](https://github.com/swc-project/swc/commit/badd6a9ede5bd511763515b3e62bd222f0860968))


- **(es/typescript)** Strip declare export in strip-only mode ([#9374](https://github.com/swc-project/swc/issues/9374)) ([c53cce4](https://github.com/swc-project/swc/commit/c53cce41da69ebb3cd9b464c001902d30bdd07ba))

## [1.7.5] - 2024-08-02

### Bug Fixes



- **(common)** Fix `StringInput.end_pos` ([#9362](https://github.com/swc-project/swc/issues/9362)) ([5368e18](https://github.com/swc-project/swc/commit/5368e189ab5227a5cfdb53dc1105b787665a1c41))


- **(es/parser)** Fix span for unterminated block comments ([#9361](https://github.com/swc-project/swc/issues/9361)) ([dc1b87e](https://github.com/swc-project/swc/commit/dc1b87e43ea628791dab48993182ac43cf98c150))


- **(es/parser)** Make `UnterminatedBlockComment` stick to the EOF ([#9366](https://github.com/swc-project/swc/issues/9366)) ([4f0fc6e](https://github.com/swc-project/swc/commit/4f0fc6eb65c2b7f7e1e0041a9228a3b7dd7e695a))


- **(es/typescript)** Handle single type statement in if/for/while ([#9364](https://github.com/swc-project/swc/issues/9364)) ([2217730](https://github.com/swc-project/swc/commit/221773069b2069ded7eb475cb75a2daa1ec4a752))


- **(es/typescript)** Handle backtick in ASI issue ([#9367](https://github.com/swc-project/swc/issues/9367)) ([6f1716c](https://github.com/swc-project/swc/commit/6f1716c4aed447c3311e41603a6399d97540e1fb))


- **(es/typescript)** Analyze import chain ([#9369](https://github.com/swc-project/swc/issues/9369)) ([4f9116f](https://github.com/swc-project/swc/commit/4f9116f9259150df3fb3947c809c304809bf5764))

### Miscellaneous Tasks



- **(deps)** Update rust crate toml to v0.8.19 ([#9360](https://github.com/swc-project/swc/issues/9360)) ([9cd51ce](https://github.com/swc-project/swc/commit/9cd51cebdf7e9dd25ebe5057cde63ce7ee0bd0c6))

## [1.7.4] - 2024-07-31

### Bug Fixes



- **(es/codegen)** Emit question token for class methods ([#9342](https://github.com/swc-project/swc/issues/9342)) ([636585b](https://github.com/swc-project/swc/commit/636585b44d0f74f457b44766f8d6fda68bcc4c09))


- **(es/minifier)** Fix detection of `this` ([#9339](https://github.com/swc-project/swc/issues/9339)) ([77da7cf](https://github.com/swc-project/swc/commit/77da7cf24bad5064206ab3e6dc248012d08576cf))


- **(es/minifier)** Fix analysis of for-in/of ([#9340](https://github.com/swc-project/swc/issues/9340)) ([1454ab5](https://github.com/swc-project/swc/commit/1454ab54c112c25ca03cbb866aacbd41a16ee60a))


- **(es/minifier)** Preserve flags while dropping elements of `SeqExpr` ([#8907](https://github.com/swc-project/swc/issues/8907)) ([24e8798](https://github.com/swc-project/swc/commit/24e87985d4f4cf69a1d4a184d02195c62ded5a7e))


- **(es/typescript)** Fix ASI in expression for fast strip ([#9358](https://github.com/swc-project/swc/issues/9358)) ([3ee82e2](https://github.com/swc-project/swc/commit/3ee82e223fe0ce54ad892cc5b009f573d997c60e))

### Documentation



- **(contributing)** Add warning for `test --all` ([#9338](https://github.com/swc-project/swc/issues/9338)) ([234bb97](https://github.com/swc-project/swc/commit/234bb974bc54e9c929fd4cf810bcecab36f760ba))

### Miscellaneous Tasks



- **(deps)** Update rust crate toml to v0.8.16 ([#9327](https://github.com/swc-project/swc/issues/9327)) ([67aadfa](https://github.com/swc-project/swc/commit/67aadfa6c976c60a3a756a1b1fcdcf193d96c51f))


- **(deps)** Update dependency magic-string to v0.30.11 ([#9345](https://github.com/swc-project/swc/issues/9345)) ([ced06e2](https://github.com/swc-project/swc/commit/ced06e2da35952c7073fee8aa69cf1a21078cc12))


- **(deps)** Update rust crate toml to v0.8.17 ([#9349](https://github.com/swc-project/swc/issues/9349)) ([d5472cc](https://github.com/swc-project/swc/commit/d5472cc344fb4099af3887e6cc1cf8ec2869c33e))

## [1.7.3] - 2024-07-27

### Bug Fixes



- **(es/decorators)** Fix TypeScript syntax assertion ([#9336](https://github.com/swc-project/swc/issues/9336)) ([acb3952](https://github.com/swc-project/swc/commit/acb3952ae324433c0049619d696f6c61bc9e475c))

## [1.7.2] - 2024-07-25

### Bug Fixes



- **(es/ast)** Accept any case of EsVersion during deserialization ([#9329](https://github.com/swc-project/swc/issues/9329)) ([56da6be](https://github.com/swc-project/swc/commit/56da6be0e9ff9701f4e0dd5e2972539843cde1cf))


- **(es/typescrupt)** Fix ASI issue in fast ts strip ([#9332](https://github.com/swc-project/swc/issues/9332)) ([57146cf](https://github.com/swc-project/swc/commit/57146cf58acb43fb5fa526bfde206c4f147edc6d))


- **(swc_core)** Remove unused `preset_env` ([#9333](https://github.com/swc-project/swc/issues/9333)) ([75bc7bf](https://github.com/swc-project/swc/commit/75bc7bfb52f81050f863466ff595ece765ca4fcf))

### Documentation



- **(bindings/wasm)** Document supported TypeScript version ([#9334](https://github.com/swc-project/swc/issues/9334)) ([66f31c0](https://github.com/swc-project/swc/commit/66f31c0af46dea60c51e4155a8887a5d2b441da3))

## [1.7.1] - 2024-07-24

### Bug Fixes



- **(bindings/types)** Add missing mangle options ([#9298](https://github.com/swc-project/swc/issues/9298)) ([567f40d](https://github.com/swc-project/swc/commit/567f40d7973f25d554770d0138323f6dcfeb67c4))


- **(deps)** Update cargo (patch) ([#9317](https://github.com/swc-project/swc/issues/9317)) ([ea66e84](https://github.com/swc-project/swc/commit/ea66e849116aaa569a707ef03762344f0bc06cab))


- **(es/ast)** Make span of binding ident include type ann ([#9293](https://github.com/swc-project/swc/issues/9293)) ([2b32481](https://github.com/swc-project/swc/commit/2b324812acce58726292d3053ee7ba95e01a3436))


- **(es/minifier)** Support minifying JSX ([#9271](https://github.com/swc-project/swc/issues/9271)) ([9a6367b](https://github.com/swc-project/swc/commit/9a6367b0f661e500219aa3c17ca2ff037e498692))


- **(es/typescript)** Fix typings ([#9301](https://github.com/swc-project/swc/issues/9301)) ([27ca712](https://github.com/swc-project/swc/commit/27ca712812421ce7cef7770b1dde790080ce09ea))


- **(es/typescript)** Preserve type assertions ([#9328](https://github.com/swc-project/swc/issues/9328)) ([4d60f52](https://github.com/swc-project/swc/commit/4d60f528d1e7f3a1606cb2c288786491dbafbd5b))


- **(es/utils)** Use `$crate` for `quote_ident!()` ([#9309](https://github.com/swc-project/swc/issues/9309)) ([bdaaf47](https://github.com/swc-project/swc/commit/bdaaf47cb4fc0146485a567d48449116d0e67e98))

### Features



- **(allocator)** Feature gate `nightly` via macros ([#9274](https://github.com/swc-project/swc/issues/9274)) ([a31fb58](https://github.com/swc-project/swc/commit/a31fb58399cc60ad5052d77b5accd560200a4f3d))


- **(allocator)** Add `maybe` types ([#9278](https://github.com/swc-project/swc/issues/9278)) ([a417ff4](https://github.com/swc-project/swc/commit/a417ff4d868b45a2157154e2334b8e1177c369e1))


- **(es/typescript)** Add esm build for fast ts strip ([#9286](https://github.com/swc-project/swc/issues/9286)) ([d10cb9f](https://github.com/swc-project/swc/commit/d10cb9ffa29033048d242fc3fb4a35ea5fb1bf16))

### Miscellaneous Tasks



- **(deps)** Update actions ([#9311](https://github.com/swc-project/swc/issues/9311)) ([475432e](https://github.com/swc-project/swc/commit/475432e83aad0191b8ad23e503d9fbe1835be196))


- **(deps)** Update npm (patch) ([#9318](https://github.com/swc-project/swc/issues/9318)) ([9d983c3](https://github.com/swc-project/swc/commit/9d983c3864888c3402679ce5498f82e71899c210))


- **(deps)** Update `wasmer` to fix broken Windows build ([#9322](https://github.com/swc-project/swc/issues/9322)) ([a120faf](https://github.com/swc-project/swc/commit/a120faf84b178c666b9ac785d27f426f89d10ac6))


- **(deps)** Drop `atty` ([#9325](https://github.com/swc-project/swc/issues/9325)) ([831500e](https://github.com/swc-project/swc/commit/831500e24a25b454f496729242e5e5d54c01756a))

### Performance



- **(allocator)** Use `std` instead of `allocator-api2` ([#9281](https://github.com/swc-project/swc/issues/9281)) ([88723db](https://github.com/swc-project/swc/commit/88723dbf19a402c6395d34b71a5a8a712b4bf1bc))


- **(es/codegen)** Use `Vec<T>` from `swc_allocator` ([#9280](https://github.com/swc-project/swc/issues/9280)) ([c1cd0b9](https://github.com/swc-project/swc/commit/c1cd0b99c14b03c250f2d278f10480da733e0dfa))


- **(es/codegen)** Optimize using `swc_allocator` ([#9294](https://github.com/swc-project/swc/issues/9294)) ([07376c6](https://github.com/swc-project/swc/commit/07376c6fbbf7f945b673e4adf3f4d789c10c7781))


- **(es/helpers)** Use `bool` instead of `AtomicBool` ([#9321](https://github.com/swc-project/swc/issues/9321)) ([8107e98](https://github.com/swc-project/swc/commit/8107e985e13e73f408d569655119d0684c166f24))


- **(es/minifier)** Pre-allocate collections ([#9289](https://github.com/swc-project/swc/issues/9289)) ([76fe139](https://github.com/swc-project/swc/commit/76fe139334b64c9ba62a98dc5319523d21d633f4))


- **(visit)** Modify `Box` and `Vec` in-place ([#9291](https://github.com/swc-project/swc/issues/9291)) ([ae2ac05](https://github.com/swc-project/swc/commit/ae2ac05b94a6f9f6e56c26cde5c8b8e705739f1c))


- **(visit)** Add `#[inline]` ([#9302](https://github.com/swc-project/swc/issues/9302)) ([0b3dbb8](https://github.com/swc-project/swc/commit/0b3dbb893752952a0bc7ffc5ba9801291c65f019))


- Enable LTO for benchmarks ([#9279](https://github.com/swc-project/swc/issues/9279)) ([a3020b2](https://github.com/swc-project/swc/commit/a3020b2bc77d38fde772b98a14c80deb6c4a6911))

### Refactor



- Remove unused files ([#9285](https://github.com/swc-project/swc/issues/9285)) ([33284c1](https://github.com/swc-project/swc/commit/33284c128ed233878b86ea5f660d9ccfc0f82c53))

### Build



- Update `rustc` to `nightly-2024-07-21` ([#9319](https://github.com/swc-project/swc/issues/9319)) ([279ea91](https://github.com/swc-project/swc/commit/279ea910e001f0c7db8d06bc7a3c48e4d718fed9))

## [1.7.0] - 2024-07-18

### Bug Fixes



- **(allocator)** Fix allocator & add benchmark ([#9234](https://github.com/swc-project/swc/issues/9234)) ([037dad5](https://github.com/swc-project/swc/commit/037dad52f44235590a0bcd5287d5118bca9da111))


- **(allocator)** Remove wrong assertions and add tests ([#9252](https://github.com/swc-project/swc/issues/9252)) ([d8e8b04](https://github.com/swc-project/swc/commit/d8e8b04cd877bcf00157eeee9b7af0b4244a1827))


- **(ci)** Fix CI of `peff ([#9216](https://github.com/swc-project/swc/issues/9216)) ([602e0e5](https://github.com/swc-project/swc/commit/602e0e5aa14ecb3a7bc20bfe77aac2badaa54bb2))


- **(es/codegen)** Fix codegen of large numeric literals ([#9226](https://github.com/swc-project/swc/issues/9226)) ([fba79e6](https://github.com/swc-project/swc/commit/fba79e6f03da69a6ae721eabe4afeaaedc301816))


- **(es/compat)** Consider only the variables used in the closure ([#9151](https://github.com/swc-project/swc/issues/9151)) ([1357531](https://github.com/swc-project/swc/commit/1357531805d529b11848b02d1b59c010a02d272d))


- **(es/compat)** Add support for destructuring with BigInts ([#9215](https://github.com/swc-project/swc/issues/9215)) ([2cc7028](https://github.com/swc-project/swc/commit/2cc70287e0c5d87e0134990e629dad2bf544d867))


- **(es/fixer)** Wrap `in` expr in for-in head ([#9209](https://github.com/swc-project/swc/issues/9209)) ([5cd837f](https://github.com/swc-project/swc/commit/5cd837f39a68d28bbc02a21b715d6153fda78a8a))


- **(es/minifier)** Fix case matching ([#9208](https://github.com/swc-project/swc/issues/9208)) ([f81fa6e](https://github.com/swc-project/swc/commit/f81fa6e06335745ff6ab5f7956cecc38116b1343))


- **(es/minifier)** Fix compress pow `NaN` ([#9210](https://github.com/swc-project/swc/issues/9210)) ([2b361e6](https://github.com/swc-project/swc/commit/2b361e679a7c973177c44029dc85867f5261e902))


- **(es/minifier)** Fix variable declaration in default branch ([#9220](https://github.com/swc-project/swc/issues/9220)) ([a7c82bd](https://github.com/swc-project/swc/commit/a7c82bdfa98f6825143b7afba03d28d325e4a718))


- **(es/minifier)** Check `this` in function params ([#9229](https://github.com/swc-project/swc/issues/9229)) ([da4866d](https://github.com/swc-project/swc/commit/da4866d13b3372ca83b83fdccf6ae42dd00d6ba9))


- **(es/minifier)** Remove optimization for array pattern ([#9241](https://github.com/swc-project/swc/issues/9241)) ([521161e](https://github.com/swc-project/swc/commit/521161e17009e2025ed9b042579f8cd055e26816))


- **(es/minifier)** Fix exponentiate operator ([#9251](https://github.com/swc-project/swc/issues/9251)) ([06bb533](https://github.com/swc-project/swc/commit/06bb5338cea8aef941907933319fbff1d29f9939))


- **(es/minifier)** Fix panic in bitwise logic and incorrect values ([#9258](https://github.com/swc-project/swc/issues/9258)) ([baeb9e2](https://github.com/swc-project/swc/commit/baeb9e2df92892f9486c72cdc787bca8c3858f30))


- **(es/minifier)** Collect raw str values for new Tpl element ([#9261](https://github.com/swc-project/swc/issues/9261)) ([6ddbfa0](https://github.com/swc-project/swc/commit/6ddbfa04db63bf3afbdec5d47f5bdbf7c7ea222f))


- **(es/modules)** Fix lint issue ([#9206](https://github.com/swc-project/swc/issues/9206)) ([efb8636](https://github.com/swc-project/swc/commit/efb86368343e7d9909fec21cae8824edac5008e2))


- **(es/quote)** Fix macro ([#9270](https://github.com/swc-project/swc/issues/9270)) ([93d9e44](https://github.com/swc-project/swc/commit/93d9e44f1c7a3afea673f056d99001a026c0a6d3))


- **(es/typescript)** Handle unicode for fast ts strip ([#9202](https://github.com/swc-project/swc/issues/9202)) ([096bfe3](https://github.com/swc-project/swc/commit/096bfe375147bb5b663ec26f8c2bdb977ee527db))


- **(es/typescript)** Fix `transform` mode ([#9243](https://github.com/swc-project/swc/issues/9243)) ([0e79a5b](https://github.com/swc-project/swc/commit/0e79a5b428c811c46c69f7f4a84fcff31c98db67))


- **(es/typescript)** Workaround `wasm-bindgen` ([#9272](https://github.com/swc-project/swc/issues/9272)) ([6b1d2ff](https://github.com/swc-project/swc/commit/6b1d2ff66b5ef73374c3932c0c505e08b9879a18))

### Documentation



- **(allocator)** Mention `oxc_allocator` ([be99ce0](https://github.com/swc-project/swc/commit/be99ce0a570c41b3fd471c5d609bd63c25740b36))


- **(contributing)** Fix deno installation url ([#9249](https://github.com/swc-project/swc/issues/9249)) ([ff5bbda](https://github.com/swc-project/swc/commit/ff5bbdae6ad16309efe592788f4cb14956ffc3b1))


- **(es/minifier)** Add contributing section ([e22f3ba](https://github.com/swc-project/swc/commit/e22f3ba9adf21eac057eab29284333b1631258b3))

### Features



- **(allocator)** Initialize package ([#9195](https://github.com/swc-project/swc/issues/9195)) ([f3681cb](https://github.com/swc-project/swc/commit/f3681cb34009824725d39d25b0cbf787ec1e8bd8))


- **(allocator)** Implement `SwcAlloc` ([#9232](https://github.com/swc-project/swc/issues/9232)) ([e343eb6](https://github.com/swc-project/swc/commit/e343eb6de2747086f9873c6444964500e40b4936))


- **(allocator)** Add a cargo feature ([#9239](https://github.com/swc-project/swc/issues/9239)) ([398dc21](https://github.com/swc-project/swc/commit/398dc21e073d8271fa7ac4169b93ed8b96645459))


- **(allocator)** Implement `default` mode ([#9242](https://github.com/swc-project/swc/issues/9242)) ([b6333db](https://github.com/swc-project/swc/commit/b6333dbcfcc8f25d08a1187704796732366ac9d7))


- **(es/typescript)** Add `transform` mode back to fast TS strip ([#9237](https://github.com/swc-project/swc/issues/9237)) ([8231e3c](https://github.com/swc-project/swc/commit/8231e3cd4f72ad120735f6a21d9616e98d61eed1))


- **(es/utils)** Support for arrays using `cast_to_number` ([#9212](https://github.com/swc-project/swc/issues/9212)) ([2aef14d](https://github.com/swc-project/swc/commit/2aef14d34d22df41bd6f421633eadc50826217cc))

### Miscellaneous Tasks



- **(es)** Bump `unicode-id-start` to `v1.2.0` ([#9177](https://github.com/swc-project/swc/issues/9177)) ([9904a53](https://github.com/swc-project/swc/commit/9904a53b7fc4c828c06071c19d08c27b5c1d9f42))


- **(es/typescript)** Improve decorator handling of fast strip ([#9178](https://github.com/swc-project/swc/issues/9178)) ([962170f](https://github.com/swc-project/swc/commit/962170fb704e5f0cf7a00c0a9be3e9d7cf4f6b02))

### Performance



- **(allocator)** Drop `scoped_tls` ([#9240](https://github.com/swc-project/swc/issues/9240)) ([4ce2514](https://github.com/swc-project/swc/commit/4ce2514d1bbf1be3972cd620c3a5f6ffd25ffa9d))


- **(bindings)** Invert Wasm size shrink ([#9224](https://github.com/swc-project/swc/issues/9224)) ([aa7f791](https://github.com/swc-project/swc/commit/aa7f791dfdba5845c4253a4014d9bc210e5fb817))


- **(bindings/wasm)** Shrink the size of the wasm file ([#9191](https://github.com/swc-project/swc/issues/9191)) ([3a23b3d](https://github.com/swc-project/swc/commit/3a23b3d120a14ca514204ef80bf744bb483dcfd6))


- **(es/codegen)** Use scoped allocator ([#9248](https://github.com/swc-project/swc/issues/9248)) ([970f323](https://github.com/swc-project/swc/commit/970f32398c6ff444540a31e1172a33b6155ed18b))


- **(es/typescript)** Add a benchmark for fast TS strip ([#9205](https://github.com/swc-project/swc/issues/9205)) ([7d9364c](https://github.com/swc-project/swc/commit/7d9364cad3618d9039eadbab6fa8c57091ec7794))


- **(es/visit)** Introduce `standard_only_*` macros ([#9207](https://github.com/swc-project/swc/issues/9207)) ([92879b1](https://github.com/swc-project/swc/commit/92879b14fee2f74034c365b4a80ca82f2a512c4a))

### Refactor



- **(allocator)** Use `&` instead of a thread-local ([#9235](https://github.com/swc-project/swc/issues/9235)) ([8d5670e](https://github.com/swc-project/swc/commit/8d5670e72bb930f18c5d1d4262caa80cae0be03a))


- **(allocator)** Use RAII guard instead of `scope` ([#9254](https://github.com/swc-project/swc/issues/9254)) ([6e098ae](https://github.com/swc-project/swc/commit/6e098aeeb5976292e43786f72bd91f1de50a9daa))


- **(common)** Drop `SyntaxContext` from AST nodes ([#9175](https://github.com/swc-project/swc/issues/9175)) ([b2491e5](https://github.com/swc-project/swc/commit/b2491e5461c0fea0aed04133074e34c92950845d))


- **(es)** Use `into` for AST construction ([#9197](https://github.com/swc-project/swc/issues/9197)) ([e7358e0](https://github.com/swc-project/swc/commit/e7358e0f816dd2ad985080c95093a464cdc9ca6f))


- **(es)** Use `Into` and `From` for AST construction ([#9201](https://github.com/swc-project/swc/issues/9201)) ([0960b23](https://github.com/swc-project/swc/commit/0960b23c045658ca2d8e8d0c2636141fca108bca))


- **(es/codegen)** Revert #9248 ([#9266](https://github.com/swc-project/swc/issues/9266)) ([b9b233c](https://github.com/swc-project/swc/commit/b9b233cacd9d326afb806d856c91e38474b237c2))


- **(es/helpers)** Remove unnecessary exports ([#9225](https://github.com/swc-project/swc/issues/9225)) ([69719c2](https://github.com/swc-project/swc/commit/69719c2acb6f0eaacd4e3f7739ce8f9ae5d95e76))


- **(visit)** Pre-generate visitor code ([#9262](https://github.com/swc-project/swc/issues/9262)) ([9c17663](https://github.com/swc-project/swc/commit/9c176632b1e0d6edec10929486ca514fa992415b))

### Testing



- **(allocator)** Merge test ([#9267](https://github.com/swc-project/swc/issues/9267)) ([efc3963](https://github.com/swc-project/swc/commit/efc396377ff95b0c464fe4bf793dc3da59abd36e))


- **(es/base)** Disable flaky benchmark ([#9221](https://github.com/swc-project/swc/issues/9221)) ([bd4bef1](https://github.com/swc-project/swc/commit/bd4bef16fb6d21d97699d46649c8db6af1dd27df))


- Enable scoped API by default ([#9247](https://github.com/swc-project/swc/issues/9247)) ([e7ce94b](https://github.com/swc-project/swc/commit/e7ce94b5ee713dc76383c35d99dd6a707c90339c))

### Pers



- **(es/ast)** Introduce `IdentName` ([#9185](https://github.com/swc-project/swc/issues/9185)) ([7b3e5b3](https://github.com/swc-project/swc/commit/7b3e5b3f613e8f9b7a6758a2453515d7c0c5f8a4))

## [1.6.13] - 2024-07-06

### Bug Fixes



- **(es/parser)** Revert #9141 ([#9171](https://github.com/swc-project/swc/issues/9171)) ([8b66d5e](https://github.com/swc-project/swc/commit/8b66d5e89b3489da0339de33a439ba365a60d2ce))


- **(es/testing)** Fix `PluginCommentProxy` ([#9170](https://github.com/swc-project/swc/issues/9170)) ([d86ca2d](https://github.com/swc-project/swc/commit/d86ca2d49ec72614ec8c2493a28f27267e6f8b8f))

### Features



- **(es/typescript)** Improve fast TS strip ([#9166](https://github.com/swc-project/swc/issues/9166)) ([ee8dc28](https://github.com/swc-project/swc/commit/ee8dc28d4d5399b1996bc0eba066270a582d04b6))


- **(es/typescript)** Improve fast TS strip ([#9167](https://github.com/swc-project/swc/issues/9167)) ([98af589](https://github.com/swc-project/swc/commit/98af5890dac03a9acac4e62ddb62bc1f3495d9a2))

### Testing



- **(es/minfiier)** Improve comment testing ([#9164](https://github.com/swc-project/swc/issues/9164)) ([f90574d](https://github.com/swc-project/swc/commit/f90574d04571023f5ccfe694003e6a25ef89cafb))

## [1.6.12] - 2024-07-06

### Bug Fixes



- **(ci)** Restore disabled CI checks ([#9002](https://github.com/swc-project/swc/issues/9002)) ([cdfd4c8](https://github.com/swc-project/swc/commit/cdfd4c85e42e912767893d1f3c1ed5d4867a51af))


- **(es/decorators)** Fix bugs of `2022-03` implementation ([#9145](https://github.com/swc-project/swc/issues/9145)) ([8a3ae44](https://github.com/swc-project/swc/commit/8a3ae4437096d23aeeabadaefb5416f7a6a94644))


- **(es/loader)** Exclude `.json` from default extension list ([#9134](https://github.com/swc-project/swc/issues/9134)) ([e94e5e7](https://github.com/swc-project/swc/commit/e94e5e70c377fae13cd5575f7d4ce84d9d5f10f7))


- **(es/minifier)** Fix `undefined` judgement ([#9146](https://github.com/swc-project/swc/issues/9146)) ([1a739b7](https://github.com/swc-project/swc/commit/1a739b79286aab3ccfd2b4597f11a79776b024b3))


- **(es/renamer)** Fix renaming of default-exported declarations ([#9135](https://github.com/swc-project/swc/issues/9135)) ([45f671d](https://github.com/swc-project/swc/commit/45f671d8d85b0c3955c88ec3cf3d68d8fa6134c5))


- **(es/renamer)** Remove `FastJsWord` ([#9136](https://github.com/swc-project/swc/issues/9136)) ([42b4caf](https://github.com/swc-project/swc/commit/42b4caf5735bc0a025024cf968ef16cd06d9f0dc))


- **(es/typescript)** Fix tricky cases in TS fast strip ([#9159](https://github.com/swc-project/swc/issues/9159)) ([2bc51b8](https://github.com/swc-project/swc/commit/2bc51b8ab25130f355cc1bad4c60d58376485698))


- **(es/typescript)** Fix replacement logic of fast TS strip ([#9163](https://github.com/swc-project/swc/issues/9163)) ([c5acafe](https://github.com/swc-project/swc/commit/c5acafe3869084a3f192a4aac0f120d5bb69e524))

### Features



- **(bindings/ts)** Add transform/strip-only mode ([#9138](https://github.com/swc-project/swc/issues/9138)) ([a08bb46](https://github.com/swc-project/swc/commit/a08bb46ebd50734b150a1fff100b8312223372a2))


- **(es/testing)** Improve comment testing story ([#9150](https://github.com/swc-project/swc/issues/9150)) ([3638e97](https://github.com/swc-project/swc/commit/3638e97c8083a607a9ce295c7465501a7dc379f8))


- **(es/typescript)** Add `swc_fast_ts_strip` ([#9143](https://github.com/swc-project/swc/issues/9143)) ([b129343](https://github.com/swc-project/swc/commit/b129343c949c43c0ad3eb4ad4676e75dc37067e3))


- **(es/typescript)** Improve fast TS stripper ([#9152](https://github.com/swc-project/swc/issues/9152)) ([9fca4ab](https://github.com/swc-project/swc/commit/9fca4ab5557be4f92ba425b39fdc417a4da9a587))


- **(es/typescript)** Improve fast TS stripper ([#9153](https://github.com/swc-project/swc/issues/9153)) ([732d748](https://github.com/swc-project/swc/commit/732d748d4eb7c19d11e37b06f5064d4eca5bf4d8))


- **(es/typescript)** Improve fast TS strip ([#9154](https://github.com/swc-project/swc/issues/9154)) ([05c7210](https://github.com/swc-project/swc/commit/05c721030a0b419058524bff99367aa80ce29536))

### Performance



- **(es)** Reduce allocations for dynamic stacks ([#9133](https://github.com/swc-project/swc/issues/9133)) ([648830a](https://github.com/swc-project/swc/commit/648830a9a9a65915226d2a250e3dfd61684a79b1))

### Refactor



- **(bindings/ts)** Inline Wasm file into `wasm.js` ([#9139](https://github.com/swc-project/swc/issues/9139)) ([307b6f2](https://github.com/swc-project/swc/commit/307b6f27a6860c65f835776549e96cd658cfc817))


- **(es/parser)** Improve readability ([#9141](https://github.com/swc-project/swc/issues/9141)) ([9d9fe66](https://github.com/swc-project/swc/commit/9d9fe6625bd4a7e05e9f29971e8f1a5c5e2470a8))

## [1.6.7] - 2024-07-03

### Bug Fixes



- **(es/compat)** Do not reuse span ([#9117](https://github.com/swc-project/swc/issues/9117)) ([6520052](https://github.com/swc-project/swc/commit/652005243260f46074595a6c031f7b82fa85302d))

### Documentation



- Use `@swc/counter` for 3rd-party download count ([026ff7e](https://github.com/swc-project/swc/commit/026ff7ef0c64379fc34df206eb9880920eda99ee))

### Features



- **(binding)** Create Wasm package for stripping only TypeScript ([#9124](https://github.com/swc-project/swc/issues/9124)) ([6b3c0da](https://github.com/swc-project/swc/commit/6b3c0da755b29022327adf7a5dc9a7c96142ceb2))


- **(es/minifier)** Handle more indexing expression ([#8750](https://github.com/swc-project/swc/issues/8750)) ([570c47a](https://github.com/swc-project/swc/commit/570c47a9acd7363428f58dfea2f41c097f73ec1f))


- **(preset-env)** Upgrade `browserslist-rs` ([#9023](https://github.com/swc-project/swc/issues/9023)) ([18d6277](https://github.com/swc-project/swc/commit/18d6277e4c68474333349a5b413ad30e59813483))

### Performance



- **(es/lexer)** Do not use `memchr::memmem` in parser ([#9118](https://github.com/swc-project/swc/issues/9118)) ([72021de](https://github.com/swc-project/swc/commit/72021def15225c7355f80b72b16ab3bfd99f51ad))

### Refactor



- **(es/typescript)** Extract type annotation proposal out ([#9127](https://github.com/swc-project/swc/issues/9127)) ([dfee5f8](https://github.com/swc-project/swc/commit/dfee5f838b76dae012393e207902effa0a69dd0d))

### Testing



- **(bindings/ts)** Test Wasm binding ([#9128](https://github.com/swc-project/swc/issues/9128)) ([c6d6db3](https://github.com/swc-project/swc/commit/c6d6db3661ec93b9ebb8ca55ff88726f66b3d5e5))


- **(es/decorators)** Split `decorator-tests` ([#9119](https://github.com/swc-project/swc/issues/9119)) ([07c3054](https://github.com/swc-project/swc/commit/07c3054847947bd4c39ca828a7471d990b77ee7c))

### Build



- **(bindings)** Fix build of typescript binding ([#9125](https://github.com/swc-project/swc/issues/9125)) ([f409bc0](https://github.com/swc-project/swc/commit/f409bc09d5613db8342e98552efc520f9c2c393c))

## [1.6.6] - 2024-06-29

### Bug Fixes



- **(es/lexer)** Fix lexing of `\r\n` in JSX ([#9112](https://github.com/swc-project/swc/issues/9112)) ([2a0ebec](https://github.com/swc-project/swc/commit/2a0ebec0f5e51d5cba1c1981215a893834c63255))

<!-- generated by git-cliff -->
