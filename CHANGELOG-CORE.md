# Changelog
## [unreleased]

### Bug Fixes



- **(es/minifier)** Skip inlining if the referential identity of a function matters ([#10123](https://github.com/swc-project/swc/issues/10123)) ([c08fe8d](https://github.com/swc-project/swc/commit/c08fe8dc13ae512cf669eb25356edcd22cc36351))


- **(es/minifier)** Fix regression due to #10056 ([#10134](https://github.com/swc-project/swc/issues/10134)) ([b145275](https://github.com/swc-project/swc/commit/b1452757f3ff0b05330578b4e7607db3ee874bd5))


- **(es/typescript)** Remove empty statements that const enum decls are folded into ([#10128](https://github.com/swc-project/swc/issues/10128)) ([7bea830](https://github.com/swc-project/swc/commit/7bea830a0e6f73ab0ba5032d13d5e58e4674bc72))


- **(ts/fast-strip)** Throw object consistently ([#10122](https://github.com/swc-project/swc/issues/10122)) ([010ff2a](https://github.com/swc-project/swc/commit/010ff2af0db625f7a118b4121aff6d709ed10dc9))

### Miscellaneous Tasks



- **(deps)** Update dependency `base64` to `v0.22.1` ([#10124](https://github.com/swc-project/swc/issues/10124)) ([edea2c5](https://github.com/swc-project/swc/commit/edea2c5fa442da6a2860442eed285464edcd55c8))

### Performance



- **(es/resolver)** Remove needless allocations ([#10120](https://github.com/swc-project/swc/issues/10120)) ([f019d53](https://github.com/swc-project/swc/commit/f019d53044cba422a26f811cec43279f1f1ea6f4))

## [swc_core@v16.2.3] - 2025-02-27

### Bug Fixes



- **(es/lints)** Capture errors and emit from the original thread ([#10119](https://github.com/swc-project/swc/issues/10119)) ([2304cd8](https://github.com/swc-project/swc/commit/2304cd8cfd6555c57ddcf3f41a2c427387a38b4a))

## [swc_core@v16.2.2] - 2025-02-27

### Bug Fixes



- **(swc_malloc)** Add `target_env = "gnu"` check ([#10118](https://github.com/swc-project/swc/issues/10118)) ([da81e11](https://github.com/swc-project/swc/commit/da81e112df25dca8f94c18eb3d60ddc9bb63248a))

## [swc_core@v16.2.1] - 2025-02-27

### Bug Fixes



- **(swc_malloc)** Fix build issue due to malloc, really ([#10117](https://github.com/swc-project/swc/issues/10117)) ([207a13f](https://github.com/swc-project/swc/commit/207a13f2ddc12503174a71c5cf0fc65fdf96c906))

## [swc_core@v16.2.0] - 2025-02-27

### Bug Fixes



- Use `jemalloc` on platforms that `mimalloc` fails to build ([#10116](https://github.com/swc-project/swc/issues/10116)) ([fb75b98](https://github.com/swc-project/swc/commit/fb75b9827902d2ac5481357c965e2bc20075fd2e))

## [swc_core@v16.1.0] - 2025-02-27

### Bug Fixes



- **(es/decorators)** Support negative numbers ([#10114](https://github.com/swc-project/swc/issues/10114)) ([5044580](https://github.com/swc-project/swc/commit/5044580f441949c4e7c6456bcc61bbb835fecd42))


- **(es/resolver)** Analyze variable declarations with `declare` ([#10102](https://github.com/swc-project/swc/issues/10102)) ([cff6a64](https://github.com/swc-project/swc/commit/cff6a64a18af26c73afd3b42cffea3c7300b369b))

### Miscellaneous Tasks



- **(deps)** Update dependency `jsonc-parser` to `v0.26.2` ([#10112](https://github.com/swc-project/swc/issues/10112)) ([8c5f7ef](https://github.com/swc-project/swc/commit/8c5f7ef8cadd6f6f756957a9939f90385890ac30))

### Performance



- Use `mimalloc` on linux ([#10113](https://github.com/swc-project/swc/issues/10113)) ([3334932](https://github.com/swc-project/swc/commit/333493245d04fb5f43dff9f9306f7ec659613cd6))

## [swc_core@v16.0.0] - 2025-02-27

### Bug Fixes



- **(es/minifier)** Fix cargo feature `debug` ([#10090](https://github.com/swc-project/swc/issues/10090)) ([48f68db](https://github.com/swc-project/swc/commit/48f68db89c5fd80c037ef9df891c60011880e7de))


- **(es/minifier)** Fix insufficient logging ([#10091](https://github.com/swc-project/swc/issues/10091)) ([9ee79c9](https://github.com/swc-project/swc/commit/9ee79c9d475823d1472011bba9ad1f8805487a52))


- **(es/minifier)** Inline before cost analysis ([#10092](https://github.com/swc-project/swc/issues/10092)) ([1425b56](https://github.com/swc-project/swc/commit/1425b5663969ef3e3f342ed7fceacaf89a729554))


- **(es/minifier)** Remove needless `println` ([b1e5b2d](https://github.com/swc-project/swc/commit/b1e5b2da1963aea75729a05a4fb0eb0e7df200b3))

### Performance



- **(es/minifier)** Improve arrow function inlining cost analysis ([#10093](https://github.com/swc-project/swc/issues/10093)) ([e74929c](https://github.com/swc-project/swc/commit/e74929c01d2d8b9001bbc056f20ca8e1cb1c9a63))


- **(es/resolver)** Remove some vector allocations ([#10101](https://github.com/swc-project/swc/issues/10101)) ([b65387a](https://github.com/swc-project/swc/commit/b65387ac570c4bbb3b776a69bda810be862b434e))

### Refactor



- **(es/react)** Remove `Lrc` from `parse_expr_for_jsx` ([#10098](https://github.com/swc-project/swc/issues/10098)) ([bab7704](https://github.com/swc-project/swc/commit/bab7704032e59be1883e7429a2312551c74f678d))

## [swc_core@v15.0.0] - 2025-02-24

### Bug Fixes



- **(error-reporters)** Store diagnostics in `TransformOutput` ([#10027](https://github.com/swc-project/swc/issues/10027)) ([52caf23](https://github.com/swc-project/swc/commit/52caf23fbda680d35a6939a8fbb3baced982ac51))


- **(es/loader)** Fix the absolute path check when resolving modules ([#10080](https://github.com/swc-project/swc/issues/10080)) ([a3894ae](https://github.com/swc-project/swc/commit/a3894aebe5a080ed99b209af11d5740759411e7d))


- **(es/types)** Add `transform.verbatimModuleSyntax` ([#10079](https://github.com/swc-project/swc/issues/10079)) ([a883cdc](https://github.com/swc-project/swc/commit/a883cdc3900fa210aa0e6132ffb6c761497594c6))


- **(swc_common)** Fix build with `swc_allocator/nightly` ([#10067](https://github.com/swc-project/swc/issues/10067)) ([6a90b1f](https://github.com/swc-project/swc/commit/6a90b1fd431601e904b7ce5f18b60d36b94a5aec))

### Documentation



- **(swc_core)** Add ChangeLog for `swc_core` ([#10072](https://github.com/swc-project/swc/issues/10072)) ([608bc69](https://github.com/swc-project/swc/commit/608bc690e268e0e12a799bc78f12c4bb46c64c9a))

### Features



- **(es/ast)** Add explicit `namespace` field to distinguish namespace and module declarations ([#10023](https://github.com/swc-project/swc/issues/10023)) ([76c2cba](https://github.com/swc-project/swc/commit/76c2cba9486370e3aaf66097d0b387ce94163f56))


- **(es/ast)** Add import attributes to `TsImportType` ([#9796](https://github.com/swc-project/swc/issues/9796)) ([7d297be](https://github.com/swc-project/swc/commit/7d297bedf5518797776f18b70ea304981419368b))


- **(es/minifier)** Make seq inliner inline into var without init ([#10077](https://github.com/swc-project/swc/issues/10077)) ([c4a839b](https://github.com/swc-project/swc/commit/c4a839b6bd16627415500cb3eab4857f08e156b6))


- **(swc_allocator)** Provide allocators ([#10061](https://github.com/swc-project/swc/issues/10061)) ([d4362f7](https://github.com/swc-project/swc/commit/d4362f7183ed716fafcce5ffbe7d81f16de16bad))

### Miscellaneous Tasks



- **(swc_allocator)** Add `#[inline]` to allocator methods ([#10066](https://github.com/swc-project/swc/issues/10066)) ([853eb53](https://github.com/swc-project/swc/commit/853eb53d62b8c5684b846dd095b93a73f8d9a7b4))

### Performance



- **(es/lints)** Remove needless locks ([#10086](https://github.com/swc-project/swc/issues/10086)) ([43458e9](https://github.com/swc-project/swc/commit/43458e91eeb276d4c0603c95da6960e4439747be))


- **(es/minifier)** Prevent double boxing ([#10074](https://github.com/swc-project/swc/issues/10074)) ([29bd286](https://github.com/swc-project/swc/commit/29bd286dea65dd934c217b31d419c79b7c15767d))

### Refactor



- **(atoms)** Rename `FastAtom` to `UnsafeAtom` ([#10070](https://github.com/swc-project/swc/issues/10070)) ([1771222](https://github.com/swc-project/swc/commit/1771222440773376351ab89cdda4c14cfc50f462))


- **(atoms)** Remove `JsWord` alias ([#10071](https://github.com/swc-project/swc/issues/10071)) ([f33b0bc](https://github.com/swc-project/swc/commit/f33b0bc2d1474232f608847a6a26eaa068f2c106))

## [swc_core@v14.1.0] - 2025-02-20

### Bug Fixes



- **(es/minifier)** Fix the order of match arms to inline correctly ([#10053](https://github.com/swc-project/swc/issues/10053)) ([f0f842d](https://github.com/swc-project/swc/commit/f0f842d1a72ede992e26d3debee5d3a5b72117e7))

### Features



- **(es/minifier)** Inline across side-effect-free member exprs, ([#10056](https://github.com/swc-project/swc/issues/10056)) ([19d01d7](https://github.com/swc-project/swc/commit/19d01d718aeb7a211384944dd2d9858cc4f04da2))


- **(es/visit)** Introduce core-only visitors ([#10049](https://github.com/swc-project/swc/issues/10049)) ([bc666be](https://github.com/swc-project/swc/commit/bc666be26cc2251572f4feb756195aef01e35097))

### Miscellaneous Tasks



- **(deps)** Update dependency swc-plugin-coverage-instrument to ^0.0.26 ([#10051](https://github.com/swc-project/swc/issues/10051)) ([d3fbd21](https://github.com/swc-project/swc/commit/d3fbd21acd3b3e4e315d5299b4430264b46e1f7c))


- **(swc_allocator)** Remove `nightly` from default feature ([#10058](https://github.com/swc-project/swc/issues/10058)) ([e78b9d1](https://github.com/swc-project/swc/commit/e78b9d11d820fb9a775077ef1caf9067657ef2d3))

### Refactor



- **(es/minifier)** Remove `CompileUnit` to simplify ([#10055](https://github.com/swc-project/swc/issues/10055)) ([c75578b](https://github.com/swc-project/swc/commit/c75578be5b11558ea9f1aec6270834cd17d3737a))

## [swc_core@v14.0.1] - 2025-02-19

### Bug Fixes



- **(hstr)** Prevent memory leak for global stores ([#10047](https://github.com/swc-project/swc/issues/10047)) ([4718bc0](https://github.com/swc-project/swc/commit/4718bc0df9dd3285442f0dcf3b9709d8440703e5))

### Miscellaneous Tasks



- **(es/minifier)** Make `minify-all` example ignore parsing errors ([#10045](https://github.com/swc-project/swc/issues/10045)) ([6c7ec46](https://github.com/swc-project/swc/commit/6c7ec46ee423d745305204460f15450c897a90a9))

### Testing



- **(ts/fast-strip)** Add tests for `declare module` error cases ([#10040](https://github.com/swc-project/swc/issues/10040)) ([37672e0](https://github.com/swc-project/swc/commit/37672e024e340b1509f4d8f70414bc132a8337bf))

### Build



- **(es)** Select optimization level for each crates ([#10046](https://github.com/swc-project/swc/issues/10046)) ([c28d494](https://github.com/swc-project/swc/commit/c28d4942c513c4dad8bc69e1c6ca2679132b58f6))

## [swc_core@v14.0.0] - 2025-02-17

### Bug Fixes



- **(deps)** Update cargo (patch) ([#10021](https://github.com/swc-project/swc/issues/10021)) ([ffb7734](https://github.com/swc-project/swc/commit/ffb77342d977722c6afa93ac5c8959e2152ea11c))


- **(typescript)** Improve type inferring for undefined and null ([#10038](https://github.com/swc-project/swc/issues/10038)) ([5059ece](https://github.com/swc-project/swc/commit/5059ece95a2bf941779213e34dd18997d16a7140))


- **(typescript)** Remove the usages of private members ([#10037](https://github.com/swc-project/swc/issues/10037)) ([8410b59](https://github.com/swc-project/swc/commit/8410b596218bfea290751ed40e29fcea8626d0dc))

### Performance



- **(hstr)** Use thin arc for hash and length ([#10033](https://github.com/swc-project/swc/issues/10033)) ([2bea793](https://github.com/swc-project/swc/commit/2bea793bf39c53a5c36b8ccdd274ca93bf1ff1ed))


- **(hstr)** Skip interning if the text is long enough ([#10035](https://github.com/swc-project/swc/issues/10035)) ([2622e4e](https://github.com/swc-project/swc/commit/2622e4e1d0263a6a10b6cd47cba3f4e50d697c32))

### Testing



- **(hstr)** Add tests ([#10043](https://github.com/swc-project/swc/issues/10043)) ([32b58f0](https://github.com/swc-project/swc/commit/32b58f0b21bba8c32ea21d3c03d068c7fe260669))

## [swc_core@v13.3.0] - 2025-02-13

### Bug Fixes



- **(es/minifier)** Check assign target before merge assign cond ([#10020](https://github.com/swc-project/swc/issues/10020)) ([6dab49a](https://github.com/swc-project/swc/commit/6dab49a07c5f0853fd6200a7ee153e66a7b8dcdc))


- **(es/parser)** Preserve comment positions with leading semicolon ([#10019](https://github.com/swc-project/swc/issues/10019)) ([c9937b6](https://github.com/swc-project/swc/commit/c9937b65bfdaeb2ad9b8fe72943053ac5fe767c5))


- **(swc_common)** Fix panic with non-narrow chars with width != 2 ([#10011](https://github.com/swc-project/swc/issues/10011)) ([f9f4cac](https://github.com/swc-project/swc/commit/f9f4cac0e5ae586f0d3cbd3c8f4db8f79ff67e17))


- **(ts/fast-strip)** Handle unsupported `module` keyword ([#10022](https://github.com/swc-project/swc/issues/10022)) ([308f5d0](https://github.com/swc-project/swc/commit/308f5d03c735649ec81d73ec6b785cd68345a04c))

### Performance



- **(es/codegen)** Reduce allocation using `compact_str` ([#10008](https://github.com/swc-project/swc/issues/10008)) ([7d7319f](https://github.com/swc-project/swc/commit/7d7319f248afe10f33da2a7201c1a90ec58a441c))

## [swc_core@v13.2.0] - 2025-02-08

### Performance



- **(es/minifier)** Make the default pass 2 ([#10014](https://github.com/swc-project/swc/issues/10014)) ([07dc423](https://github.com/swc-project/swc/commit/07dc423b7f7ee11753338e8a98a65aef087c3468))

## [swc_core@v13.1.0] - 2025-02-06

### Bug Fixes



- **(es/minifier)** Dont't optimize swtich case before DCE ([#9994](https://github.com/swc-project/swc/issues/9994)) ([afe21b5](https://github.com/swc-project/swc/commit/afe21b5e71edb8cee5ba4335a193fb8a309bb43b))


- **(es/minifier)** Revert #10006 ([#10007](https://github.com/swc-project/swc/issues/10007)) ([7e21323](https://github.com/swc-project/swc/commit/7e21323b3bedc0552634da5d6c34f33fb2c5bad6))


- **(es/parser, es/codegen)** Handle trailing empty slots in array patterns ([#9992](https://github.com/swc-project/swc/issues/9992)) ([1a87e76](https://github.com/swc-project/swc/commit/1a87e76e95566eb998bf81bde1e77dc14eb42fda))

### Features



- **(es/ast)** Add `ShrinkToFit` implementation ([#10009](https://github.com/swc-project/swc/issues/10009)) ([6849b6a](https://github.com/swc-project/swc/commit/6849b6aba764b06674783f6c0a7d2f26350ea5fe))


- **(es/helpers)** Update package exports for module-sync and webpack compatibility ([#9995](https://github.com/swc-project/swc/issues/9995)) ([6f4e7ad](https://github.com/swc-project/swc/commit/6f4e7adce4b476ee33ea8a9a1aa333cbf80c85cc))

### Performance



- **(es/minifier)** Do not clone from `take_ident_of_pat_if_unused` ([#10005](https://github.com/swc-project/swc/issues/10005)) ([dc3b46e](https://github.com/swc-project/swc/commit/dc3b46eff9befa898a777308d8588b1ff37e577a))


- **(es/minifier)** Allocate in once from `mark_property_mutation` ([#10004](https://github.com/swc-project/swc/issues/10004)) ([4a90e51](https://github.com/swc-project/swc/commit/4a90e5197d337ba1d0851908053d0ad13b17f907))


- **(es/minifier)** Limit infection analysis by the entry size ([#10006](https://github.com/swc-project/swc/issues/10006)) ([1a3a4b9](https://github.com/swc-project/swc/commit/1a3a4b936cca1db646a40c0813a7a1275832b604))

## [swc_core@v13.0.4] - 2025-02-05

### Bug Fixes



- **(es/fixer)** Wrap object tagged templates ([#9991](https://github.com/swc-project/swc/issues/9991)) ([963c3a5](https://github.com/swc-project/swc/commit/963c3a58c8ec05a381b61724ee9930093cf65b8f))

## [swc_core@v13.0.3] - 2025-02-05

### Bug Fixes



- **(es/react)** Avoid adding `__self` in constructors of derived class in the `jsx_self` ([#9987](https://github.com/swc-project/swc/issues/9987)) ([83f24af](https://github.com/swc-project/swc/commit/83f24afad9114801c897d04bfa7a1525c92686c1))

### Features



- **(fast-ts)** Support Uint8Array Input ([#9879](https://github.com/swc-project/swc/issues/9879)) ([61ae579](https://github.com/swc-project/swc/commit/61ae579a1c7c588244317320da42a03541a7f801))

### Performance



- **(es/codegen)** Remove needless allocations ([#9978](https://github.com/swc-project/swc/issues/9978)) ([9c89d57](https://github.com/swc-project/swc/commit/9c89d57cf9f3cd409e003f7b667afc9c87916359))

## [swc_core@v13.0.1] - 2025-02-03

### Bug Fixes



- **(es/transforms)** Pass `unresolved_mark` to `simplifier` instead of `top_level_mark` ([#9989](https://github.com/swc-project/swc/issues/9989)) ([963b088](https://github.com/swc-project/swc/commit/963b0881f9e027fd9ca6ed7b59a3b1f284bf688e))

## [swc_core@v13.0.0] - 2025-02-03

### Bug Fixes



- **(deps)** Update cargo (patch) ([#9971](https://github.com/swc-project/swc/issues/9971)) ([e9843d8](https://github.com/swc-project/swc/commit/e9843d8bb730ebdfca42108585c2e013f96fd612))

### Features



- **(ts/fast-strip)** Support type-only/uninstantiated namespaces ([#9983](https://github.com/swc-project/swc/issues/9983)) ([a72c6fa](https://github.com/swc-project/swc/commit/a72c6fa28cea8c9e2bc0d85fbf4909ed03f4d344))

### Performance



- Update `rustc-hash` to `v2` and drop `ahash` ([#9982](https://github.com/swc-project/swc/issues/9982)) ([6765db0](https://github.com/swc-project/swc/commit/6765db0dfef953d841fe414480c7c635d740dbd7))

## [swc_core@v12.0.1] - 2025-02-01

### Bug Fixes



- **(swc_core)** Fix typo in swc_core feature ([#9979](https://github.com/swc-project/swc/issues/9979)) ([99a6339](https://github.com/swc-project/swc/commit/99a63397b65dfe02bc2c864069edbffb84efa510))

### Features



- Add (experimental) nodejs interop crates ([#9974](https://github.com/swc-project/swc/issues/9974)) ([37e0ea5](https://github.com/swc-project/swc/commit/37e0ea5697c657582e132aa5fe86837c2e86cae6))


- Add (experimental) `js-interop` npm package ([#9975](https://github.com/swc-project/swc/issues/9975)) ([eebb0ea](https://github.com/swc-project/swc/commit/eebb0ea14fa2061fd721992c0fc31734fe9d1e42))

## [swc_core@v12.0.0] - 2025-01-29

### Bug Fixes



- **(es/parser)** Remove wrong check about `const` without init ([#9970](https://github.com/swc-project/swc/issues/9970)) ([1b57261](https://github.com/swc-project/swc/commit/1b572617f36b9eb02b8dd7002bd2374a0cc8e2b1))

### Performance



- **(es/minifier)** Make analyzer not call `collect_infects_from` recursively ([#9924](https://github.com/swc-project/swc/issues/9924)) ([37616c3](https://github.com/swc-project/swc/commit/37616c33bf877845afe55c9fc0d21ccbbf59bad3))


- **(es/minifier)** Skip complex inline operations if possible ([#9972](https://github.com/swc-project/swc/issues/9972)) ([772cc30](https://github.com/swc-project/swc/commit/772cc309cc0ff677ebe415b1745cfcb55fe12c03))


- **(es/minifier)** Merge binding analyzer into infection analyzer ([#9973](https://github.com/swc-project/swc/issues/9973)) ([ca8a71f](https://github.com/swc-project/swc/commit/ca8a71f523f94fdfb866f10c470cc3dea2fd1f9c))

## [swc_core@v11.0.1] - 2025-01-27

### Bug Fixes



- **(es)** Restore JSON config & Adjust feature renaming ([#9967](https://github.com/swc-project/swc/issues/9967)) ([72e5455](https://github.com/swc-project/swc/commit/72e545575bea0a12614889861d839578581af170))

## [swc_core@v11.0.0] - 2025-01-27

### Bug Fixes



- **(es/minifier)** Avoid paren when compressing ternary ([#9920](https://github.com/swc-project/swc/issues/9920)) ([9d6fe37](https://github.com/swc-project/swc/commit/9d6fe370cff502b00245c409bbbc9a3d00e622fe))


- **(es/parser)** Parse `yield<T> (v: T)=>v` ([#9915](https://github.com/swc-project/swc/issues/9915)) ([04333aa](https://github.com/swc-project/swc/commit/04333aacfeded1f1d21c167c4cdc6bce7b0eaf23))


- **(ts/fast-strip)** More robust generic arrow handling ([#9913](https://github.com/swc-project/swc/issues/9913)) ([f7faa7c](https://github.com/swc-project/swc/commit/f7faa7c08c65f6cc453ded39834077e9ae7c7b91))


- **(typescript)** Allow references to the global Symbol in computed property names under `isolatedDeclarations` ([#9869](https://github.com/swc-project/swc/issues/9869)) ([e4c1e03](https://github.com/swc-project/swc/commit/e4c1e03e1775065be98b4bc230725b5b745f8843))

### Features



- **(es/minifier)** Compress Assign to number ([#9943](https://github.com/swc-project/swc/issues/9943)) ([d5f40a0](https://github.com/swc-project/swc/commit/d5f40a0bc00df0cfb850a5989b15efb7467f3303))


- **(parallel)** Add `merge_in_parallel` ([#9939](https://github.com/swc-project/swc/issues/9939)) ([c5b8390](https://github.com/swc-project/swc/commit/c5b8390d622eb58badb22d49176e47ddcadf8559))


- Merge `hstr` into the main repository ([#9963](https://github.com/swc-project/swc/issues/9963)) ([bc61c13](https://github.com/swc-project/swc/commit/bc61c1317f9dc8128557d4c92799877dca2d87dc))

### Miscellaneous Tasks



- **(preset-env)** Update `browserslist-rs` ([#9918](https://github.com/swc-project/swc/issues/9918)) ([606ffe5](https://github.com/swc-project/swc/commit/606ffe51ea8c4108878264da3934ec3edd8f4ff7))

### Performance



- **(es/react)** Use proper string types for react configuration ([#9949](https://github.com/swc-project/swc/issues/9949)) ([1bf837e](https://github.com/swc-project/swc/commit/1bf837e4764f57656b4fb43642d4fdda464504f6))


- **(es/utils)** Prevent too many recursion ([#9931](https://github.com/swc-project/swc/issues/9931)) ([d24f785](https://github.com/swc-project/swc/commit/d24f785a5cc9c9e80f090e7488d326a73b8c3677))


- **(es/utils)** Restrict recursion of `get_type` ([#9933](https://github.com/swc-project/swc/issues/9933)) ([1781b85](https://github.com/swc-project/swc/commit/1781b85ddb68e148b9662f52d670476f6c1a9b3a))


- **(preset-env)** Store `Versions` in `Arc` ([#9950](https://github.com/swc-project/swc/issues/9950)) ([03dffb5](https://github.com/swc-project/swc/commit/03dffb50fb92b3774e23735cb9f08c0cbe1fd630))

### Refactor



- **(hstr)** Remove needless operations ([#9964](https://github.com/swc-project/swc/issues/9964)) ([6f781d8](https://github.com/swc-project/swc/commit/6f781d8fd49f40bab300907eee8227a0a9d434b9))


- **(swc)** Remove typo feature ([#9965](https://github.com/swc-project/swc/issues/9965)) ([4b14eec](https://github.com/swc-project/swc/commit/4b14eecabf51b3185103f32723742546b1cee953))


- Apply all pending breaking changes ([#9966](https://github.com/swc-project/swc/issues/9966)) ([1c2f7e9](https://github.com/swc-project/swc/commit/1c2f7e9db7a12ba55875d99e896328db2af62c0f))

## [swc_core@v10.7.0] - 2025-01-22

### Features



- **(es/minifier)** Compress negate eq ([#9911](https://github.com/swc-project/swc/issues/9911)) ([e8f23cf](https://github.com/swc-project/swc/commit/e8f23cf92146828ea2a8b65724c7a6824acf9f0f))

### Miscellaneous Tasks



- **(es/minifier)** Add a script for samply profiler ([#9923](https://github.com/swc-project/swc/issues/9923)) ([8f8dcaa](https://github.com/swc-project/swc/commit/8f8dcaac2f22f71de538802034db5756e84c7f55))

### Performance



- **(es/minifier)** Cache `var_or_default` calls ([#9909](https://github.com/swc-project/swc/issues/9909)) ([4a3be8d](https://github.com/swc-project/swc/commit/4a3be8d60b1ad49d723a5e102264ec3284603638))


- **(es/minifier)** Invert cache to be really a cache ([#9910](https://github.com/swc-project/swc/issues/9910)) ([8bfb0e5](https://github.com/swc-project/swc/commit/8bfb0e5edd51934dff37fe70136b73d5301a4e41))

### Refactor



- **(es/minifier)** Make `minify-all` example sequential ([#9912](https://github.com/swc-project/swc/issues/9912)) ([5b5c87e](https://github.com/swc-project/swc/commit/5b5c87e72480638ae382d519980302702e333305))

## [swc_core@v10.6.0] - 2025-01-21

### Features



- **(es/minifier)** Compress `foo ? num : 0` into `num * !!foo` ([#9908](https://github.com/swc-project/swc/issues/9908)) ([ce22557](https://github.com/swc-project/swc/commit/ce22557a0512e9263cb316116e5262757d884479))

## [swc_core@v10.5.1] - 2025-01-20

### Bug Fixes



- **(es/minifier)** Set param type to unknown ([#9905](https://github.com/swc-project/swc/issues/9905)) ([09b3b37](https://github.com/swc-project/swc/commit/09b3b371f93ca603c61992eca3e44208cd857dc5))

### Features



- **(es/minifier)** Turn `1 * v` into `+v` ([#9903](https://github.com/swc-project/swc/issues/9903)) ([a228347](https://github.com/swc-project/swc/commit/a2283475b1b8f770e113806590f4959550f89f31))

## [swc_core@v10.5.0] - 2025-01-20

### Documentation



- **(es/parallel)** Improve document of `Parallel` ([#9896](https://github.com/swc-project/swc/issues/9896)) ([9962c9c](https://github.com/swc-project/swc/commit/9962c9c98d8a30623b4680303e398ae57da6d6a9))

### Features



- **(es/minifier)** Print total size from `minify-all` example ([#9897](https://github.com/swc-project/swc/issues/9897)) ([134000f](https://github.com/swc-project/swc/commit/134000fe93029c3af887726e5be6da1fd812e330))

### Miscellaneous Tasks



- **(es/minifier)** Print slow files from `minify-all` example ([#9899](https://github.com/swc-project/swc/issues/9899)) ([2d87b89](https://github.com/swc-project/swc/commit/2d87b897e6f62e07aee3b0741d3e961190986763))

### Performance



- **(es/minifier)** Make character frequency analysis parallel ([#9895](https://github.com/swc-project/swc/issues/9895)) ([ca2fd1e](https://github.com/swc-project/swc/commit/ca2fd1ebdf94270efdb319379551de31f41428a2))


- **(es/minifier)** Parallelize handling of class members ([#9900](https://github.com/swc-project/swc/issues/9900)) ([ed74839](https://github.com/swc-project/swc/commit/ed748394be54b9e4e212717007b430aa169667e9))


- **(es/minifier)** Adjust threshold for parallel char frequency calculation ([#9901](https://github.com/swc-project/swc/issues/9901)) ([47ea8de](https://github.com/swc-project/swc/commit/47ea8de2777051bce249f666b10580f168d8d72a))


- **(es/minifier)** Do heavy operation only if required ([#9902](https://github.com/swc-project/swc/issues/9902)) ([2687231](https://github.com/swc-project/swc/commit/26872310f60d4de40e717cd30e7bf856bad3edba))

## [swc_core@v10.4.0] - 2025-01-19

### Performance



- **(es/minifier)** Box `VarUsageInfo` of `ProgramData` ([#9894](https://github.com/swc-project/swc/issues/9894)) ([fafd754](https://github.com/swc-project/swc/commit/fafd754f74be0cd9dfc1c0f5a24b1c078023cb64))

## [swc_core@v10.3.0] - 2025-01-17

### Bug Fixes



- **(typescript)** Collect usages in extend clauses of classes and interfaces ([#9893](https://github.com/swc-project/swc/issues/9893)) ([ef29ef6](https://github.com/swc-project/swc/commit/ef29ef6a225927ccdd3d98751f9a2cfef88ca237))

### Performance



- **(es/codegen)** Remove needless allocations ([#9890](https://github.com/swc-project/swc/issues/9890)) ([f230ff2](https://github.com/swc-project/swc/commit/f230ff2d8454808ffa99c298448eba7522597219))

## [swc_core@v10.2.3] - 2025-01-16

### Bug Fixes



- **(es/testing)** Fix sourcemap generation ([#9891](https://github.com/swc-project/swc/issues/9891)) ([008f2de](https://github.com/swc-project/swc/commit/008f2dee6660529faf4cd498e33a5a3ffd4c6f2f))

## [swc_core@v10.2.2] - 2025-01-16

### Bug Fixes



- **(es/ts_strip)** Handle ASI hazard in return statement ([#9882](https://github.com/swc-project/swc/issues/9882)) ([121b5fe](https://github.com/swc-project/swc/commit/121b5fefbc17932816f69c88edc14f8387c493e9))

### Refactor



- **(es/minifier)** Add a way to profile minifier for real-world inputs ([#9881](https://github.com/swc-project/swc/issues/9881)) ([9657294](https://github.com/swc-project/swc/commit/9657294ff159e920e829c1a727219427f19df46e))


- **(es/minifier)** Use `chili` for `minify-all` example ([#9885](https://github.com/swc-project/swc/issues/9885)) ([197f0bc](https://github.com/swc-project/swc/commit/197f0bc1962875a3528b0b051be0dbea16671bc8))


- **(es/minifier)** Make `minify-all` profilable ([#9888](https://github.com/swc-project/swc/issues/9888)) ([fbad136](https://github.com/swc-project/swc/commit/fbad1364984f8b951b884b61fd924b6ea8fafbda))

## [swc_core@v10.2.1] - 2025-01-15

### Bug Fixes



- **(es/decorators)** Fix init order of `2022-03` impl ([#9760](https://github.com/swc-project/swc/issues/9760)) ([751a310](https://github.com/swc-project/swc/commit/751a310e87cbbb61ebd76671018bf01d07487792))

### Performance



- **(bench)** Run benchmark on a custom runner ([#9877](https://github.com/swc-project/swc/issues/9877)) ([2d6f9a5](https://github.com/swc-project/swc/commit/2d6f9a5c27803257635b4b008c5d3b0592478e1d))

### Refactor



- **(atoms)** Rename `FastAtom` to `UnsafeAtom` ([#9873](https://github.com/swc-project/swc/issues/9873)) ([3df8b44](https://github.com/swc-project/swc/commit/3df8b443a129cfcb5ec79f37e2fcf6a2a9468cad))

## [swc_core@v10.2.0] - 2025-01-13

### Bug Fixes



- **(ci/publish)** Do not tag stable if `onlyNightly` is on ([#9863](https://github.com/swc-project/swc/issues/9863)) ([c0c6056](https://github.com/swc-project/swc/commit/c0c60569e268d9e5f3fdf2362061d160c22f4f4e))

### Features



- **(typescript)** Check computed property names of ts signatures ([#9867](https://github.com/swc-project/swc/issues/9867)) ([caed78a](https://github.com/swc-project/swc/commit/caed78a7105969ac15347e99bc2a1c998fa5f7f7))

### Performance



- **(es/minifier)** Make the first run of DCE more efficient ([#9868](https://github.com/swc-project/swc/issues/9868)) ([7329824](https://github.com/swc-project/swc/commit/7329824b825663c6c51c48dd5ace097da87e2c88))


- **(es/minifier)** Adjust parallel threshold ([#9872](https://github.com/swc-project/swc/issues/9872)) ([d5d856c](https://github.com/swc-project/swc/commit/d5d856cf3b7c89da4d917cb1acea4fdb3096769b))


- **(es/renamer)** Use `IndexSet` for rename queue ([#9866](https://github.com/swc-project/swc/issues/9866)) ([f404720](https://github.com/swc-project/swc/commit/f404720b8fa0166a27f47bf6913307353def7fae))


- **(es/utils)** Optimize `maybe_par_idx_raw` ([#9870](https://github.com/swc-project/swc/issues/9870)) ([46e3d77](https://github.com/swc-project/swc/commit/46e3d77396a9211ddd79c7390349053c857a9c76))


- Enable `concurrent` in codspeed bench ([#9862](https://github.com/swc-project/swc/issues/9862)) ([6c2bb13](https://github.com/swc-project/swc/commit/6c2bb13f9d9ec522a938d8aba535a8a93758e43d))

## [swc_core@v10.1.0] - 2025-01-10

### Documentation



- Update the link to the team ([0fcdc31](https://github.com/swc-project/swc/commit/0fcdc3143592fe45522c885796dcb826d8992c75))

### Features



- **(ts/fast-strip)** Distinguish invalid vs unsupported ([#9846](https://github.com/swc-project/swc/issues/9846)) ([5709bc2](https://github.com/swc-project/swc/commit/5709bc2205e17540d55d459cd2208a3110e073c9))

### Testing



- **(parallel)** Add test to debug segfault on windows x64 ([#9857](https://github.com/swc-project/swc/issues/9857)) ([ae53a35](https://github.com/swc-project/swc/commit/ae53a359c331ae9bcf93f94e7067381e2e6f1629))

### Build



- Update `wasmer` to `v5.0.5-rc1` ([#9860](https://github.com/swc-project/swc/issues/9860)) ([615ae93](https://github.com/swc-project/swc/commit/615ae9302e5000963f461f2e322d4a6fd6ad12d7))

## [swc_core@v10.0.2] - 2025-01-09

### Bug Fixes



- **(es/minifier)** Improve DCE ([#9853](https://github.com/swc-project/swc/issues/9853)) ([85fb16c](https://github.com/swc-project/swc/commit/85fb16c3a241bbd87066a119357ad560e336457d))


- **(es/parser)** Fix context of dynamic import type ([#9852](https://github.com/swc-project/swc/issues/9852)) ([caa7f37](https://github.com/swc-project/swc/commit/caa7f370ff2003983a3448a2b7e6f0f6d6224b86))

## [swc_core@v10.0.1] - 2025-01-07

### Miscellaneous Tasks



- **(deps)** Update rust crate phf to v0.11.3 ([#9848](https://github.com/swc-project/swc/issues/9848)) ([66bf0e5](https://github.com/swc-project/swc/commit/66bf0e5917718b89343a0bc011629fa216ef001a))

### Performance



- **(es/minifier)** Speed up `merge_sequences_in_exprs` by caching computation ([#9843](https://github.com/swc-project/swc/issues/9843)) ([6e5632f](https://github.com/swc-project/swc/commit/6e5632fa413c73ea5e1393a0b28b93d4000a3ac1))

## [swc_core@v10.0.0] - 2025-01-07

### Documentation



- **(swc_parallel)** Document safety ([#9847](https://github.com/swc-project/swc/issues/9847)) ([d381e2f](https://github.com/swc-project/swc/commit/d381e2f645e51a5e5077fb9069c82159e0fd376a))

### Performance



- **(atoms)** Update `hstr` to optimize `==` of `Atom` ([#9845](https://github.com/swc-project/swc/issues/9845)) ([584a0a0](https://github.com/swc-project/swc/commit/584a0a0fab7e007c88f147fa54a4e4cce1947bcd))


- **(es/lints)** Make lint rules parallel ([#9842](https://github.com/swc-project/swc/issues/9842)) ([e080172](https://github.com/swc-project/swc/commit/e080172b1e919cab4cd319dbb2001e72b7eaaa8d))


- **(es/minifier)** Replace `rayon` with `chili` ([#9829](https://github.com/swc-project/swc/issues/9829)) ([858e92a](https://github.com/swc-project/swc/commit/858e92ad27a6b0f2b15eea730150b6ef56557831))

### Build



- **(swc_parallel)** Fix build on CI ([#9844](https://github.com/swc-project/swc/issues/9844)) ([a2b7105](https://github.com/swc-project/swc/commit/a2b7105286cbdf2c697917a54fa363e9acb58856))

## [swc_core@v9.0.6] - 2025-01-06

### Features



- **(swc_parallel)** Implement basic APIs ([#9840](https://github.com/swc-project/swc/issues/9840)) ([84a6702](https://github.com/swc-project/swc/commit/84a6702e004cbf1ffad2d50f8042e616331345dd))

## [swc_core@v9.0.5] - 2025-01-06

### Miscellaneous Tasks



- **(deps)** Update cargo (patch) ([#9819](https://github.com/swc-project/swc/issues/9819)) ([e7a9d88](https://github.com/swc-project/swc/commit/e7a9d88ef2f428c0945ca189004f5bddd0a35c81))


- **(deps)** Update dependency magic-string to v0.30.17 ([#9794](https://github.com/swc-project/swc/issues/9794)) ([51595ae](https://github.com/swc-project/swc/commit/51595aedc05007f5a1fd39a7008e1f220cb7ae49))

### Performance



- **(es/lints)** Configure a benchmark for ES lints ([#9833](https://github.com/swc-project/swc/issues/9833)) ([734ec21](https://github.com/swc-project/swc/commit/734ec2197f1baf73af0f3d1003595017b06a389b))


- **(es/lints)** Make ES lints faster ([#9837](https://github.com/swc-project/swc/issues/9837)) ([d56a473](https://github.com/swc-project/swc/commit/d56a473e83ffd389814756378150953e49e1b983))


- **(es/minifier)** Improve parallelism and cache friendliness ([#9813](https://github.com/swc-project/swc/issues/9813)) ([f8dff56](https://github.com/swc-project/swc/commit/f8dff5602c129b2188eeeb6ee6ada051c5035166))


- **(es/minifier)** Introduce `FastJsWord` and `FastId` in `swc_atoms` ([#9826](https://github.com/swc-project/swc/issues/9826)) ([ef0ec38](https://github.com/swc-project/swc/commit/ef0ec3820f182ded02b5174c8079a5c432d5b8c0))


- **(es/minifier)** Update `hstr` to `v0.2.14` ([#9828](https://github.com/swc-project/swc/issues/9828)) ([bc4ec00](https://github.com/swc-project/swc/commit/bc4ec009a27b3375d2203e5c51143c8dc3723049))

### Refactor



- **(es/lints)** Cleanup & prepare using `chili` ([#9838](https://github.com/swc-project/swc/issues/9838)) ([d47844b](https://github.com/swc-project/swc/commit/d47844b769984630b531421a8e9fc1d51548eab7))

## [swc_core@v9.0.4] - 2024-12-31

### Bug Fixes



- **(deps)** Update cargo (patch) ([#9733](https://github.com/swc-project/swc/issues/9733)) ([fb2f6e4](https://github.com/swc-project/swc/commit/fb2f6e44aa5c741977cc70b588a1b6e44aac0cde))


- **(es/minifier)** Fix minification of `framer-motion` by checking `cons.termniates()` ([#9818](https://github.com/swc-project/swc/issues/9818)) ([512c91f](https://github.com/swc-project/swc/commit/512c91fb6253f131f5d3e409427694e87cf7c873))


- **(typescript)** Fix wrong check for super class ([#9822](https://github.com/swc-project/swc/issues/9822)) ([2307a4d](https://github.com/swc-project/swc/commit/2307a4d4d3def405c4a04726272e14d998880abb))


- Remove `Caused by: 'failed to parse'` from TS blank space ([#9820](https://github.com/swc-project/swc/issues/9820)) ([aaeb0ab](https://github.com/swc-project/swc/commit/aaeb0ab3b325c4f9d789aec78a52eec0dfcfac83))

## [swc_core@v9.0.3] - 2024-12-27

### Bug Fixes



- **(es/codegen)** Emit semicolon after using declarations ([#9816](https://github.com/swc-project/swc/issues/9816)) ([556d924](https://github.com/swc-project/swc/commit/556d924cf53c2d3a7577bbfbb2b467d41834c23e))

### Documentation



- **(types)** Fix broken links ([#9812](https://github.com/swc-project/swc/issues/9812)) ([7768114](https://github.com/swc-project/swc/commit/7768114451c7070c8eeb5faa8ca93f4b63661141))

## [swc_core@v9.0.2] - 2024-12-18

### Bug Fixes



- **(es)** Don't panic when wasm bytecheck faild ([#9803](https://github.com/swc-project/swc/issues/9803)) ([c81be2e](https://github.com/swc-project/swc/commit/c81be2ee2818106387d9c9f5d7ee553c6678e18f))

## [swc_core@v9.0.1] - 2024-12-16

### Bug Fixes



- **(es/parser)** Do not parse empty stmt after using decl ([#9798](https://github.com/swc-project/swc/issues/9798)) ([c2696db](https://github.com/swc-project/swc/commit/c2696db528fc98187c5c5f7413bd9daac7d6c1b6))

## [swc_core@v9.0.0] - 2024-12-09

### Features



- **(es/transforms)** Add `module.outFileExtension` ([#9784](https://github.com/swc-project/swc/issues/9784)) ([e04c7b3](https://github.com/swc-project/swc/commit/e04c7b31fcc776ec990ea33f988e2ed38c78962c))

## [swc_core@v8.0.2] - 2024-12-09

### Bug Fixes



- **(es/compat)** Fix marker for inlined helpers ([#9776](https://github.com/swc-project/swc/issues/9776)) ([f54ec2c](https://github.com/swc-project/swc/commit/f54ec2c5a0d36b4a43a0aef48e7c56e188795d6f))


- **(es/minifier)** Do not inline into the exact LHS ([#9777](https://github.com/swc-project/swc/issues/9777)) ([985977b](https://github.com/swc-project/swc/commit/985977b750d458d0ccbdff8b2b779224a917a66b))


- **(es/resolver)** Fix wrong syntax context of vars with the same names as catch params ([#9786](https://github.com/swc-project/swc/issues/9786)) ([5a44c6b](https://github.com/swc-project/swc/commit/5a44c6b42471aeceb3771b1cf4ebb310d03a0154))

### Miscellaneous Tasks



- **(deps)** Update dependency magic-string to v0.30.14 ([#9764](https://github.com/swc-project/swc/issues/9764)) ([6e46a8b](https://github.com/swc-project/swc/commit/6e46a8b30076f9e8017a1d855093a5de9c329577))

## [swc_core@v8.0.0] - 2024-12-02

### Features



- **(es/minifier)** Support `preserve_annotations` of terser ([#9775](https://github.com/swc-project/swc/issues/9775)) ([6e1c9fd](https://github.com/swc-project/swc/commit/6e1c9fde1f0c95a955a11c44474d6f4a57250c74))

## [swc_core@v7.0.0] - 2024-12-02

### Bug Fixes



- **(es/codegen)** Use raw value for emitting JSX text ([#9762](https://github.com/swc-project/swc/issues/9762)) ([b83c44f](https://github.com/swc-project/swc/commit/b83c44f4ad604edc30ec157aa8fb0d8755adb389))

### Features



- **(typescript)** Align `isolatedDeclaration` implementation with tsc ([#9715](https://github.com/swc-project/swc/issues/9715)) ([0adad25](https://github.com/swc-project/swc/commit/0adad25da123875c8cec2759004d8264237688f0))


- Apply Wasm-breaking changes ([#9771](https://github.com/swc-project/swc/issues/9771)) ([ed65eee](https://github.com/swc-project/swc/commit/ed65eee834a4f3ce4be1f6f57a5f76462f023c1e))

### Miscellaneous Tasks



- **(deps)** Update dependency magic-string to v0.30.13 ([#9747](https://github.com/swc-project/swc/issues/9747)) ([fa80a1e](https://github.com/swc-project/swc/commit/fa80a1eb86cf4babe1d4912f28152d62f068cbbe))

### Refactor



- **(estree/compat)** Do not use nightly features ([#9772](https://github.com/swc-project/swc/issues/9772)) ([0f12bbd](https://github.com/swc-project/swc/commit/0f12bbdcaeae3538cabe04db125ac5824da42bd5))

## [swc_core@v6.0.2] - 2024-11-25

### Bug Fixes



- **(@swc/types)** Tsc build file ignored by npm ([#9754](https://github.com/swc-project/swc/issues/9754)) ([14a5c1e](https://github.com/swc-project/swc/commit/14a5c1ebd233ab0e105a1affdf04d689446d80dc))


- **(es)** Source map `super(...args)` calls in injected constructors ([#9745](https://github.com/swc-project/swc/issues/9745)) ([35b0ca0](https://github.com/swc-project/swc/commit/35b0ca007147dea03e911795639c8b032a0fbd28))


- **(es/minifier)** Drop `console` in optional chainings ([#9759](https://github.com/swc-project/swc/issues/9759)) ([39271ad](https://github.com/swc-project/swc/commit/39271addde60d7b02167ce031bca4569e6d72bb8))

### Documentation



- **(types)** Document `Assumptions` API ([#9746](https://github.com/swc-project/swc/issues/9746)) ([cd4321c](https://github.com/swc-project/swc/commit/cd4321c88a97a9a6f9d0f972dcebe5e19a1326bb))

### Features



- **(visit)** Derive serde for `AstParentKind` ([#9744](https://github.com/swc-project/swc/issues/9744)) ([e0fdd68](https://github.com/swc-project/swc/commit/e0fdd68183b9851050e1a03a903261275872044e))

## [swc_core@v6.0.1] - 2024-11-18

### Bug Fixes



- **(es/plugin)** Migrate `swc plugin new` to use `.cargo/config.toml` ([#9740](https://github.com/swc-project/swc/issues/9740)) ([4ffb21e](https://github.com/swc-project/swc/commit/4ffb21ebe6e40f85f8b7f78cd29b10965fe035b1))

## [swc_core@v6.0.0] - 2024-11-16

### Miscellaneous Tasks



- **(bindings/node)** Format `binding.js` ([#9738](https://github.com/swc-project/swc/issues/9738)) ([9f8c14f](https://github.com/swc-project/swc/commit/9f8c14f5f81ca66609fe2fbfdac4c970240702e4))

### Refactor



- **(es/compat)** Use special span instead of passing `static_blocks_mark` ([#9725](https://github.com/swc-project/swc/issues/9725)) ([6ad0735](https://github.com/swc-project/swc/commit/6ad0735033b405c04e53c1e3c7ec56db4b8fcf93))

## [swc_core@v5.0.4] - 2024-11-12

### Bug Fixes



- **(es/resolver)** Ignore `VarDecl` with `declare: true` ([#9734](https://github.com/swc-project/swc/issues/9734)) ([aa0f784](https://github.com/swc-project/swc/commit/aa0f784c7d38d106e65e6aae1f0a318f575a0f09))

### Features



- **(plugin)** Bump `rkyv` to `v0.8.8` ([#9730](https://github.com/swc-project/swc/issues/9730)) ([81ac77e](https://github.com/swc-project/swc/commit/81ac77e3ab399446a0962db1e92d8066b73b3b31))


- **(plugin)** Update `wasmer` to `v5` ([#9731](https://github.com/swc-project/swc/issues/9731)) ([9b74ccd](https://github.com/swc-project/swc/commit/9b74ccd92cf138d11790178f5817c89e44aa2deb))

### Miscellaneous Tasks



- **(deps)** Update cargo (patch) ([#9724](https://github.com/swc-project/swc/issues/9724)) ([da37439](https://github.com/swc-project/swc/commit/da37439d6b6aae31e2b21690476d93f12dc87bd3))

### Performance



- **(es/plugin)** Make `analyze_source_file` lazy, again ([#9732](https://github.com/swc-project/swc/issues/9732)) ([c1d12d6](https://github.com/swc-project/swc/commit/c1d12d6e2a0ad1633652817ebea435eca404bbb8))

### Refactor



- Delay Wasm-plugin breaking changes ([#9735](https://github.com/swc-project/swc/issues/9735)) ([92faf5b](https://github.com/swc-project/swc/commit/92faf5b15df2ef5954f1a07c7376c04558efe181))

## [swc_core@v5.0.3] - 2024-11-11

### Features



- **(es/codegen)** Implement proper `inline_script` support ([#9729](https://github.com/swc-project/swc/issues/9729)) ([e732a36](https://github.com/swc-project/swc/commit/e732a36373f0959a0653dc51a863230a9b3d8982))

## [swc_core@v5.0.2] - 2024-11-06

### Bug Fixes



- **(es)** Fix typo in feature name ([#9721](https://github.com/swc-project/swc/issues/9721)) ([aff9de5](https://github.com/swc-project/swc/commit/aff9de5ea37d5d34d587b96b8044d08644936524))

## [swc_core@v5.0.1] - 2024-11-06

### Bug Fixes



- **(es/codegen)** Fix `ends_with_alpha_num` ([#9720](https://github.com/swc-project/swc/issues/9720)) ([569c799](https://github.com/swc-project/swc/commit/569c799c2e98f6104fdc4edb61a28d83f4c930eb))

### Miscellaneous Tasks



- **(deps)** Update rust crate is-macro to v0.3.7 ([#9713](https://github.com/swc-project/swc/issues/9713)) ([d48e6e8](https://github.com/swc-project/swc/commit/d48e6e838b303d97c22688706930107ace673560))

## [swc_core@v5.0.0] - 2024-11-06

### Bug Fixes



- **(es/minifier)** Avoid generating reserved mangling names ([#9710](https://github.com/swc-project/swc/issues/9710)) ([b49317a](https://github.com/swc-project/swc/commit/b49317a40344c2c153044095f49d0a9e8a1ef3f3))


- **(es/plugin)** Revert #9696 ([#9717](https://github.com/swc-project/swc/issues/9717)) ([772f023](https://github.com/swc-project/swc/commit/772f023fd2f8bbcb336b0561a81621f0f1163622))

### Features



- **(typescript)** Port deno `isolatedDeclarations` updates ([#9712](https://github.com/swc-project/swc/issues/9712)) ([6194044](https://github.com/swc-project/swc/commit/6194044b4293eec01415a1ef67541bf888c33099))

## [swc_core@v4.0.3] - 2024-11-04

### Bug Fixes



- **(es/typescript)** Handle ASI hazards in fast type strip ([#9707](https://github.com/swc-project/swc/issues/9707)) ([c135f71](https://github.com/swc-project/swc/commit/c135f718ed933fcd9eb6e5e5ea9accc0179cf333))

## [swc_core@v4.0.2] - 2024-11-02

### Performance



- **(es/renamer)** Modify parallel renaming threshold ([#9706](https://github.com/swc-project/swc/issues/9706)) ([91a9106](https://github.com/swc-project/swc/commit/91a9106624f999951b9eb0f424faedb131a4297a))

## [swc_core@v4.0.1] - 2024-11-02

### Bug Fixes



- **(es/typescript)** Handle multiline type parameters in async arrow functions ([#9704](https://github.com/swc-project/swc/issues/9704)) ([c5ed19c](https://github.com/swc-project/swc/commit/c5ed19c710fd32f5c23b2d85ff8f30cb09f58899))

## [swc_core@v4.0.0] - 2024-11-01

### Features



- **(es)** Add `es2023` and `es2024` to `EsVersion` ([#9700](https://github.com/swc-project/swc/issues/9700)) ([5a6f0e6](https://github.com/swc-project/swc/commit/5a6f0e644ebd515c9de69f8efa0e2b5c79944a1d))


- **(es/plugin)** Introduce `manual-tokio-runtmie` to `swc` crate ([#9701](https://github.com/swc-project/swc/issues/9701)) ([97298c4](https://github.com/swc-project/swc/commit/97298c4e36318674f82343b9cde2d938265ea3d8))

### Performance



- **(common)** Make character analysis lazy ([#9696](https://github.com/swc-project/swc/issues/9696)) ([1c3eaf6](https://github.com/swc-project/swc/commit/1c3eaf684a40a22b09779db39cf68986e69147f1))

## [swc_core@v3.0.2] - 2024-10-31

### Bug Fixes



- **(es/parser)** Parse `await using()` call ([#9693](https://github.com/swc-project/swc/issues/9693)) ([bcf05de](https://github.com/swc-project/swc/commit/bcf05de2ebe755a54ec8a6b93311b1686494c578))


- **(es/resolver)** Skip resolving lowercase `JSXIdentifiers` ([#9686](https://github.com/swc-project/swc/issues/9686)) ([6ed1715](https://github.com/swc-project/swc/commit/6ed1715b93875cd4588352a784ed876bf183df5d))


- **(es/types)** Add `jsc.experimental.keepImportAssertions` to types ([#9691](https://github.com/swc-project/swc/issues/9691)) ([4b4dcfa](https://github.com/swc-project/swc/commit/4b4dcfa4d8532c84762b19737b66474e97480cef))

### Performance



- **(es/lints)** Disable lints by default ([#9689](https://github.com/swc-project/swc/issues/9689)) ([4d887d0](https://github.com/swc-project/swc/commit/4d887d062b299b42b1a6529dfac5f22c3fd49903))

## [swc_core@v3.0.1] - 2024-10-30

### Bug Fixes



- **(es/generator)** Fix code generation for `break` in nested while ([#9684](https://github.com/swc-project/swc/issues/9684)) ([65872af](https://github.com/swc-project/swc/commit/65872afaf151412be5f14820080325b920901bfb))

### Miscellaneous Tasks



- **(deps)** Update cargo (patch) ([#9607](https://github.com/swc-project/swc/issues/9607)) ([3597b0f](https://github.com/swc-project/swc/commit/3597b0f53d060b09b7e878e9c825321f053d189e))

### Performance



- **(es)** Cache `current_dir()` system calls ([#9683](https://github.com/swc-project/swc/issues/9683)) ([7aab945](https://github.com/swc-project/swc/commit/7aab945a2199be06e20a35ec0d197fc817a48d9d))

## [swc_core@v3.0.0] - 2024-10-29

### Performance



- **(visit)** Introduce `Pass` API and adjust visitor APIs for it ([#9680](https://github.com/swc-project/swc/issues/9680)) ([581aafb](https://github.com/swc-project/swc/commit/581aafb4dfbbcf9b834e3b578cad83fec452a062))

## [swc_core@v2.0.0] - 2024-10-29

### Features



- **(es/minifier)** Optimize switch with side effect and termination tests ([#9677](https://github.com/swc-project/swc/issues/9677)) ([7344a63](https://github.com/swc-project/swc/commit/7344a638b55d483571ab4b35edf56f7088de792b))


- **(es/parser)** Ability to get script's potential module errors ([#9682](https://github.com/swc-project/swc/issues/9682)) ([2bbd1e8](https://github.com/swc-project/swc/commit/2bbd1e8485ca7c152d408cc34cd51460467171a7))

## [swc_core@v1.0.6] - 2024-10-26

### Bug Fixes



- **(typescript)** Check whether the method is abstract when checking `is_overload` ([#9678](https://github.com/swc-project/swc/issues/9678)) ([78500af](https://github.com/swc-project/swc/commit/78500af546ea3c92f016c729e173c66fccbe46ed))

### Miscellaneous Tasks



- **(deps)** Update dependency swc-plugin-coverage-instrument to ^0.0.25 ([#9676](https://github.com/swc-project/swc/issues/9676)) ([b8d255b](https://github.com/swc-project/swc/commit/b8d255bf5aa65a5589331b0924269a23b3052137))

## [swc_core@v1.0.5] - 2024-10-24

### Bug Fixes



- **(bindings)** Update napi to handle string with `\0` ([#9665](https://github.com/swc-project/swc/issues/9665)) ([8f45eaf](https://github.com/swc-project/swc/commit/8f45eaf837d023847c478e562265e141213ce231))


- **(bindings/node)** Add `VisitTsPropertySignature` ([#9670](https://github.com/swc-project/swc/issues/9670)) ([715c42c](https://github.com/swc-project/swc/commit/715c42c0bfe699d822a7e9ea18751d35aac3235d))


- **(es/codegen)** Improve EndsWithAlphaNum ([#9675](https://github.com/swc-project/swc/issues/9675)) ([ba2a942](https://github.com/swc-project/swc/commit/ba2a942f56776e6927b48cfd185d8720052b7409))


- **(es/compat)** Add missing visit children for `destructuring` ([#9658](https://github.com/swc-project/swc/issues/9658)) ([32116a0](https://github.com/swc-project/swc/commit/32116a0940a5806d8ad291b5fd6d056709a396bc))


- **(es/renamer)** Check `preserved` in normal renaming mode ([#9666](https://github.com/swc-project/swc/issues/9666)) ([87b4e10](https://github.com/swc-project/swc/commit/87b4e10e5dbeb236ee5232d85d3176472fa4a9d0))


- **(wasm-typescript)** Fix option types of functions ([#9662](https://github.com/swc-project/swc/issues/9662)) ([4cbe33c](https://github.com/swc-project/swc/commit/4cbe33c32f244e9c568d388f19c0f297bf3d74f1))

### Documentation



- **(contributing)** Document changeset ([#9667](https://github.com/swc-project/swc/issues/9667)) ([602c667](https://github.com/swc-project/swc/commit/602c667b9d435fa9155345952379287cb11e59db))

### Features



- **(es/minifier)** Implement optional catch binding ([#9657](https://github.com/swc-project/swc/issues/9657)) ([f70b842](https://github.com/swc-project/swc/commit/f70b842c5579c945fcd6357edb712507228f5eb5))

## [swc_core@v1.0.3] - 2024-10-17

### Bug Fixes



- **(es/proposal)** Use `tsc` version of explicit resource management ([#9585](https://github.com/swc-project/swc/issues/9585)) ([f735108](https://github.com/swc-project/swc/commit/f7351080174c61bad5950be9b30c75c4f17ebe3e))

## [swc_core@v1.0.2] - 2024-10-17

### Bug Fixes



- **(es/parser)** Correct `>` and `<` when exit type context ([#9653](https://github.com/swc-project/swc/issues/9653)) ([abffc07](https://github.com/swc-project/swc/commit/abffc073561b3ba3906aa0923ef3880e5e30d538))

### Miscellaneous Tasks



- **(es/typescript)** Improve enum comments and sourcemap ([#9652](https://github.com/swc-project/swc/issues/9652)) ([31fe3b6](https://github.com/swc-project/swc/commit/31fe3b6be151cbf63fe1ff06f922f814da105d08))

## [swc_core@v1.0.1] - 2024-10-15

### Bug Fixes



- **(es)** Run esnext transforms on esnext target ([#9644](https://github.com/swc-project/swc/issues/9644)) ([8a19201](https://github.com/swc-project/swc/commit/8a192018247ad7ac253c2964038de5f626acb8c4))


- **(es/minifier)** Check type of assignment target before merging assignments ([#9617](https://github.com/swc-project/swc/issues/9617)) ([4436621](https://github.com/swc-project/swc/commit/44366215644f3fff2f897e509a56b36cb5e1f8a2))

### Features



- **(es)** Introduce `runPluginFirst` for Wasm plugins ([#9645](https://github.com/swc-project/swc/issues/9645)) ([3d3e434](https://github.com/swc-project/swc/commit/3d3e4340b33e124f551ee88b68bfaddb537a3c6a))


- **(es/minifier)** Support unary negate in `cast_to_number` ([#9642](https://github.com/swc-project/swc/issues/9642)) ([88a2186](https://github.com/swc-project/swc/commit/88a2186ba419c98c73b997ca9ea90d7a8fd128e4))

### Miscellaneous Tasks



- **(deps)** Update dependency magic-string to v0.30.12 ([#9634](https://github.com/swc-project/swc/issues/9634)) ([085bc19](https://github.com/swc-project/swc/commit/085bc191e46d4d46efc3d4a7cd5fc1240c8474dd))

## [swc_core@v0.109.2] - 2024-10-12

### Bug Fixes



- **(es/codegen)** Emit space after div if rhs has leading comment ([#9631](https://github.com/swc-project/swc/issues/9631)) ([f2be26e](https://github.com/swc-project/swc/commit/f2be26efe090f5c1575f5bb9e4067f7ae531f11c))


- **(es/lints)** Correct the false positive error of TS2309 ([#9635](https://github.com/swc-project/swc/issues/9635)) ([f74c1f3](https://github.com/swc-project/swc/commit/f74c1f3e5a117c22aa87a2754715066cb8dfe0fe))


- **(es/minifier)** Only merge last if return ([#9633](https://github.com/swc-project/swc/issues/9633)) ([6f52949](https://github.com/swc-project/swc/commit/6f52949210ee2a71ed119cbcdf2db1842a2e63cb))

## [swc_core@v0.109.1] - 2024-10-10

### Bug Fixes



- **(es/codegen)** Fix source map so it works with Sentry ([#9627](https://github.com/swc-project/swc/issues/9627)) ([9c90a73](https://github.com/swc-project/swc/commit/9c90a733691e9a15bc1c4182edabcefa8054e9d3))

### Features



- **(bindings/html)** Accept `Buffer|string` instead of `Buffer` ([#9625](https://github.com/swc-project/swc/issues/9625)) ([62edb36](https://github.com/swc-project/swc/commit/62edb3628b26036cdc767b31d59e109c3970497c))

### Build



- Update `rustc` to `nightly-2024-10-07` ([#9624](https://github.com/swc-project/swc/issues/9624)) ([6a3b0fc](https://github.com/swc-project/swc/commit/6a3b0fc1660cba4310880881f21e3bf81aceac0d))

## [swc_core@v0.109.0] - 2024-10-08

### Bug Fixes



- **(ci)** Fix target triples ([#9622](https://github.com/swc-project/swc/issues/9622)) ([f625035](https://github.com/swc-project/swc/commit/f625035f8a21eb6d2bc487669a534257f3ef7c7c))

### Features



- **(es/preset-env)** Update preset-env data ([#9573](https://github.com/swc-project/swc/issues/9573)) ([9a11d34](https://github.com/swc-project/swc/commit/9a11d34ee569f64e8db02fc90beacbba0f2de0cf))


- **(es/testing)** Parse test code as a `Program` instead of a `Module` ([#9623](https://github.com/swc-project/swc/issues/9623)) ([bfea322](https://github.com/swc-project/swc/commit/bfea3223515e378c3ebe669f4a9012919f4f9547))

## [swc_core@v0.108.0] - 2024-10-08

### Bug Fixes



- **(es/minifier)** Compress consecutive return statements properly ([#9620](https://github.com/swc-project/swc/issues/9620)) ([8263da1](https://github.com/swc-project/swc/commit/8263da17664cc7cb5d49e1a8e9fbca8037fe991f))


- **(es/testing)** Revert #9264 ([#9621](https://github.com/swc-project/swc/issues/9621)) ([85f5e5b](https://github.com/swc-project/swc/commit/85f5e5b955f65ad6b21b9f4aee5b8dacd8a71e93))


- **(html/minifier)** Fix HTML minifier TS types ([#9615](https://github.com/swc-project/swc/issues/9615)) ([7b98bb5](https://github.com/swc-project/swc/commit/7b98bb5e93b132fa14af27b1eadbcf38f0bbcb62))

### Features



- **(es/testing)** Parse test code as a `Program` instead of a `Module` ([#9264](https://github.com/swc-project/swc/issues/9264)) ([166b858](https://github.com/swc-project/swc/commit/166b8581c226b127f5d503cd21c22c0a3a8c675c))

### Miscellaneous Tasks



- **(atoms)** Update `hstr` ([#9612](https://github.com/swc-project/swc/issues/9612)) ([e2e9a9c](https://github.com/swc-project/swc/commit/e2e9a9ccfce75e69546c54fc88a708b4e1dda13b))

### Performance



- **(es)** Avoid needless string comparisons ([#9613](https://github.com/swc-project/swc/issues/9613)) ([ec0a62c](https://github.com/swc-project/swc/commit/ec0a62cbc5c9a20f02d1c558ff2708e7367922a9))

### Refactor



- **(es/typescript)** Simplifying enum and namespace transforms ([#9558](https://github.com/swc-project/swc/issues/9558)) ([2480bb0](https://github.com/swc-project/swc/commit/2480bb00fc71d588af506eb18f33afa56622361f))

## [swc_core@v0.106.4] - 2024-10-02

### Bug Fixes



- **(es/module)** Allow TypeScript nodes for `Rewriter` ([#9606](https://github.com/swc-project/swc/issues/9606)) ([4ee45ac](https://github.com/swc-project/swc/commit/4ee45ac1fd10da1ea982a152a458deb9f5359998))

### Performance



- **(es/codegen)** Reduce usage of `tracing::instrument` ([#9604](https://github.com/swc-project/swc/issues/9604)) ([2f06fc5](https://github.com/swc-project/swc/commit/2f06fc559c8e200ea89133b8b30045f970ffc20b))


- **(es/transforms)** Copy benchmarks from `oxc` ([#9602](https://github.com/swc-project/swc/issues/9602)) ([24c3a0c](https://github.com/swc-project/swc/commit/24c3a0ce138bacbf12b4660862ccfe9e3d19bdd9))


- **(es/typescript)** Reduce unnecessary visits ([#9605](https://github.com/swc-project/swc/issues/9605)) ([866af6c](https://github.com/swc-project/swc/commit/866af6c9478b92cd6be780c515ddd51d2db90ac3))

## [swc_core@v0.106.2] - 2024-10-01

### Bug Fixes



- **(deps)** Update cargo (patch) ([#9454](https://github.com/swc-project/swc/issues/9454)) ([b28047a](https://github.com/swc-project/swc/commit/b28047a48b06e1e505e9cad3c70f5a921862d83b))


- **(es/minifier)** Ignore using declarations ([#9598](https://github.com/swc-project/swc/issues/9598)) ([1659c21](https://github.com/swc-project/swc/commit/1659c212b2edf1505def54b7222b3b6a633de3dc))

### Features



- **(es)** Add options to disable all `esnext` transforms and lints ([#9597](https://github.com/swc-project/swc/issues/9597)) ([f2b0766](https://github.com/swc-project/swc/commit/f2b07665bfe7175dcfcca92b9d2a6776a714d14e))

## [swc_core@v0.106.1] - 2024-10-01

### Bug Fixes



- **(allocator)** Remove wrong assertions and add tests ([#9252](https://github.com/swc-project/swc/issues/9252)) ([d8e8b04](https://github.com/swc-project/swc/commit/d8e8b04cd877bcf00157eeee9b7af0b4244a1827))


- **(ast)** Add `archive(check_bytes)` to all relevant AST types ([#9574](https://github.com/swc-project/swc/issues/9574)) ([185d6f5](https://github.com/swc-project/swc/commit/185d6f55b35f4f8323035c1199cddb9dd547f254))


- **(bindings/types)** Add missing mangle options ([#9298](https://github.com/swc-project/swc/issues/9298)) ([567f40d](https://github.com/swc-project/swc/commit/567f40d7973f25d554770d0138323f6dcfeb67c4))


- **(bindings/wasm)** Fix typing ([#9469](https://github.com/swc-project/swc/issues/9469)) ([8c007c4](https://github.com/swc-project/swc/commit/8c007c402f73c0839e45066eaa8a01b98edf2f94))


- **(ci)** FIx pattern for `actions/download-artifact` ([ac7bd31](https://github.com/swc-project/swc/commit/ac7bd31e8cd79f9df7f3bf6ac05e84b67b0f4546))


- **(cli)** Exclude non-files from get_files_list ([#9560](https://github.com/swc-project/swc/issues/9560)) ([85cc2bd](https://github.com/swc-project/swc/commit/85cc2bd79c3193cb0a8b54e4fce0efc1aa15b271))


- **(common)** Fix `StringInput.end_pos` ([#9362](https://github.com/swc-project/swc/issues/9362)) ([5368e18](https://github.com/swc-project/swc/commit/5368e189ab5227a5cfdb53dc1105b787665a1c41))


- **(common)** Do not generate invalid source map ([#9050](https://github.com/swc-project/swc/issues/9050)) ([9d65c77](https://github.com/swc-project/swc/commit/9d65c776025346985acaf36bc1d54134ebc4c7c4))


- **(common)** Require newer version of allocator ([#9386](https://github.com/swc-project/swc/issues/9386)) ([4e854c7](https://github.com/swc-project/swc/commit/4e854c79960df75f5259bee8ab71ab77a57f55f3))


- **(common)** Remove unused import ([#9387](https://github.com/swc-project/swc/issues/9387)) ([f530476](https://github.com/swc-project/swc/commit/f5304761b315a961fe2c1165907bf35a084a7c86))


- **(common)** Do not use `adjust_mappings` from `sourcemap` crate ([#9437](https://github.com/swc-project/swc/issues/9437)) ([563c162](https://github.com/swc-project/swc/commit/563c162f1ca8904e7b9a61a0c79fad952a56d624))


- **(common)** Use `SourceMap::adjust_mappings` in correct order ([#9447](https://github.com/swc-project/swc/issues/9447)) ([05961eb](https://github.com/swc-project/swc/commit/05961eb018e2e76ed5ef95de9bad923b2fe1df88))


- **(deps)** Update cargo (patch) ([#9317](https://github.com/swc-project/swc/issues/9317)) ([ea66e84](https://github.com/swc-project/swc/commit/ea66e849116aaa569a707ef03762344f0bc06cab))


- **(es)** Improve sourcemap url error messages. ([#9422](https://github.com/swc-project/swc/issues/9422)) ([230d1d9](https://github.com/swc-project/swc/commit/230d1d98b91bde2fa0de54e5fe06e899302e481c))


- **(es)** Mark TypeScript nodes as reachable from `Evaluator` ([#9440](https://github.com/swc-project/swc/issues/9440)) ([308e5ec](https://github.com/swc-project/swc/commit/308e5ec81b4e6d49c5940f2d8914d8627f838141))


- **(es)** Preserve more comments ([#9449](https://github.com/swc-project/swc/issues/9449)) ([673655c](https://github.com/swc-project/swc/commit/673655c1697ff1d507f7acbfa937cbf1f58eb1d9))


- **(es/ast)** Make span of binding ident include type ann ([#9293](https://github.com/swc-project/swc/issues/9293)) ([2b32481](https://github.com/swc-project/swc/commit/2b324812acce58726292d3053ee7ba95e01a3436))


- **(es/ast)** Accept any case of EsVersion during deserialization ([#9329](https://github.com/swc-project/swc/issues/9329)) ([56da6be](https://github.com/swc-project/swc/commit/56da6be0e9ff9701f4e0dd5e2972539843cde1cf))


- **(es/codegen)** Emit question token for class methods ([#9342](https://github.com/swc-project/swc/issues/9342)) ([636585b](https://github.com/swc-project/swc/commit/636585b44d0f74f457b44766f8d6fda68bcc4c09))


- **(es/codegen)** Print the missing `abstract` in class expression ([#9372](https://github.com/swc-project/swc/issues/9372)) ([c2e3021](https://github.com/swc-project/swc/commit/c2e302127fc80970d4b5096c93e29c9ce76a2fe4))


- **(es/codegen)** Handle minify number ([#9541](https://github.com/swc-project/swc/issues/9541)) ([8b1e442](https://github.com/swc-project/swc/commit/8b1e4428a3324dea76ba480a6d4cddf3865e41e8))


- **(es/codegen)** Ensure decorators are emitted first in TS paramters ([#9545](https://github.com/swc-project/swc/issues/9545)) ([47ef38d](https://github.com/swc-project/swc/commit/47ef38dc1d53918604481fd078c76554b012a82b))


- **(es/codegen)** Fix wrong sourcemap when there are new lines in tpl ([#9578](https://github.com/swc-project/swc/issues/9578)) ([cf74382](https://github.com/swc-project/swc/commit/cf74382ba0429c0d4f04428889cf53a5231fad7f))


- **(es/codegen)** Emit .d.ts when using --out-file ([#9582](https://github.com/swc-project/swc/issues/9582)) ([3d9d641](https://github.com/swc-project/swc/commit/3d9d641f8b49725014e7d7a72a6f0a5dfe01f42c))


- **(es/compat)** Init this in sub class constructor for async ([#9446](https://github.com/swc-project/swc/issues/9446)) ([bfaf31b](https://github.com/swc-project/swc/commit/bfaf31bc4b90ff803457bfdafdbcef0318b76189))


- **(es/compat)** Handle label block in constructor ([#9528](https://github.com/swc-project/swc/issues/9528)) ([c43dbad](https://github.com/swc-project/swc/commit/c43dbad028072396390029af44e31bc3292a342a))


- **(es/compat)** Skip `getter` and `setter` as FlowHelper `function` do ([#9580](https://github.com/swc-project/swc/issues/9580)) ([14cfd70](https://github.com/swc-project/swc/commit/14cfd70ee00938497ce6b59f68332f9daa17378b))


- **(es/decorator)** Add support for private access expressions in legacy decorators ([#9535](https://github.com/swc-project/swc/issues/9535)) ([62ed065](https://github.com/swc-project/swc/commit/62ed0655e6d9be2f4a5c641a969b41b8c0e7f75a))


- **(es/decorators)** Fix TypeScript syntax assertion ([#9336](https://github.com/swc-project/swc/issues/9336)) ([acb3952](https://github.com/swc-project/swc/commit/acb3952ae324433c0049619d696f6c61bc9e475c))


- **(es/decorators)** Use correct class name reference ([#9375](https://github.com/swc-project/swc/issues/9375)) ([badd6a9](https://github.com/swc-project/swc/commit/badd6a9ede5bd511763515b3e62bd222f0860968))


- **(es/decorators)** Fix metadata for accessors ([#9444](https://github.com/swc-project/swc/issues/9444)) ([99738ef](https://github.com/swc-project/swc/commit/99738ef41233211d6e26de520c3817d395492d37))


- **(es/isolated-dts)** Preserve comments ([#9572](https://github.com/swc-project/swc/issues/9572)) ([6d15d9c](https://github.com/swc-project/swc/commit/6d15d9c2eb4397b15908cda38f2e44e02d81ebc1))


- **(es/minifier)** Fix exponentiate operator ([#9251](https://github.com/swc-project/swc/issues/9251)) ([06bb533](https://github.com/swc-project/swc/commit/06bb5338cea8aef941907933319fbff1d29f9939))


- **(es/minifier)** Fix panic in bitwise logic and incorrect values ([#9258](https://github.com/swc-project/swc/issues/9258)) ([baeb9e2](https://github.com/swc-project/swc/commit/baeb9e2df92892f9486c72cdc787bca8c3858f30))


- **(es/minifier)** Collect raw str values for new Tpl element ([#9261](https://github.com/swc-project/swc/issues/9261)) ([6ddbfa0](https://github.com/swc-project/swc/commit/6ddbfa04db63bf3afbdec5d47f5bdbf7c7ea222f))


- **(es/minifier)** Support minifying JSX ([#9271](https://github.com/swc-project/swc/issues/9271)) ([9a6367b](https://github.com/swc-project/swc/commit/9a6367b0f661e500219aa3c17ca2ff037e498692))


- **(es/minifier)** Fix detection of `this` ([#9339](https://github.com/swc-project/swc/issues/9339)) ([77da7cf](https://github.com/swc-project/swc/commit/77da7cf24bad5064206ab3e6dc248012d08576cf))


- **(es/minifier)** Fix analysis of for-in/of ([#9340](https://github.com/swc-project/swc/issues/9340)) ([1454ab5](https://github.com/swc-project/swc/commit/1454ab54c112c25ca03cbb866aacbd41a16ee60a))


- **(es/minifier)** Preserve flags while dropping elements of `SeqExpr` ([#8907](https://github.com/swc-project/swc/issues/8907)) ([24e8798](https://github.com/swc-project/swc/commit/24e87985d4f4cf69a1d4a184d02195c62ded5a7e))


- **(es/minifier)** Preserve function length ([#9389](https://github.com/swc-project/swc/issues/9389)) ([679682c](https://github.com/swc-project/swc/commit/679682ce36e35dd94bbc4b3406d3c8173db10b96))


- **(es/minifier)** Force rename synthesized identifiers ([#9473](https://github.com/swc-project/swc/issues/9473)) ([c72b5f8](https://github.com/swc-project/swc/commit/c72b5f8b327118794c3a9c76f68ac30005c94793))


- **(es/minifier)** Mark LHS of for-in/of as update ([#9474](https://github.com/swc-project/swc/issues/9474)) ([ac432c4](https://github.com/swc-project/swc/commit/ac432c4bff26d5ceb1fa349552dfad829075c673))


- **(es/minifier)** Track if a var is used with `in` ([#9508](https://github.com/swc-project/swc/issues/9508)) ([7d6269e](https://github.com/swc-project/swc/commit/7d6269e3b826524e340edf274a5e42b2a0ea058a))


- **(es/minifier)** Iterate object properties in reverse direction while inlining property access ([#9507](https://github.com/swc-project/swc/issues/9507)) ([f584ef7](https://github.com/swc-project/swc/commit/f584ef76d75e86da15d0725ac94be35a88a1c946))


- **(es/minifier)** Fix name mangler ([#9524](https://github.com/swc-project/swc/issues/9524)) ([5fd68f9](https://github.com/swc-project/swc/commit/5fd68f9a3a9eeef0e61627a821c52ace69a89696))


- **(es/minifier)** `typeof` class should be `function` ([#9522](https://github.com/swc-project/swc/issues/9522)) ([c7fdd6b](https://github.com/swc-project/swc/commit/c7fdd6b69b129a11465125d4e11a898326b7e884))


- **(es/minifier)** Prevent removing side effects from accessing getter ([#9530](https://github.com/swc-project/swc/issues/9530)) ([8513816](https://github.com/swc-project/swc/commit/8513816139c6ceef12a906b03c1bcf9471ce0b07))


- **(es/minifier)** Avoid decl name when mangle with eval ([#9546](https://github.com/swc-project/swc/issues/9546)) ([e2242c4](https://github.com/swc-project/swc/commit/e2242c41c4d648a32119eb8141dd9990b2c8c468))


- **(es/minifier)** Check variable type while optimizing `+=` ([#9575](https://github.com/swc-project/swc/issues/9575)) ([04016e9](https://github.com/swc-project/swc/commit/04016e9687c5f02e764ffc9d7be2432d16da5dc0))


- **(es/module)** Drop the level of a few tracing events ([#9380](https://github.com/swc-project/swc/issues/9380)) ([95af253](https://github.com/swc-project/swc/commit/95af2536a2cd5040f44e93f2eea9cf577558f335))


- **(es/module)** Rewrite import specifier in type declaration ([#9577](https://github.com/swc-project/swc/issues/9577)) ([fc0ba2a](https://github.com/swc-project/swc/commit/fc0ba2a08408b90f7d799cd5707dfa6827334085))


- **(es/module)** Fix `jsc.paths` using absolute paths with dots in a filename for an alias ([#9595](https://github.com/swc-project/swc/issues/9595)) ([74e3d04](https://github.com/swc-project/swc/commit/74e3d0466abcd7422620623d8adcceac04ce26c9))


- **(es/parser)** Fix span for unterminated block comments ([#9361](https://github.com/swc-project/swc/issues/9361)) ([dc1b87e](https://github.com/swc-project/swc/commit/dc1b87e43ea628791dab48993182ac43cf98c150))


- **(es/parser)** Make `UnterminatedBlockComment` stick to the EOF ([#9366](https://github.com/swc-project/swc/issues/9366)) ([4f0fc6e](https://github.com/swc-project/swc/commit/4f0fc6eb65c2b7f7e1e0041a9228a3b7dd7e695a))


- **(es/parser)** Fix span of EOF errors ([#9378](https://github.com/swc-project/swc/issues/9378)) ([f702657](https://github.com/swc-project/swc/commit/f7026578b9ac50b5ac9f08fa51b1e320040ee083))


- **(es/parser)** Fix failure of TS instantiation followed by satisfies ([#9583](https://github.com/swc-project/swc/issues/9583)) ([77900d8](https://github.com/swc-project/swc/commit/77900d808e2a3be2e62b74022c88a81b26a73f86))


- **(es/quote)** Fix macro ([#9270](https://github.com/swc-project/swc/issues/9270)) ([93d9e44](https://github.com/swc-project/swc/commit/93d9e44f1c7a3afea673f056d99001a026c0a6d3))


- **(es/typescript)** Workaround `wasm-bindgen` ([#9272](https://github.com/swc-project/swc/issues/9272)) ([6b1d2ff](https://github.com/swc-project/swc/commit/6b1d2ff66b5ef73374c3932c0c505e08b9879a18))


- **(es/typescript)** Fix typings ([#9301](https://github.com/swc-project/swc/issues/9301)) ([27ca712](https://github.com/swc-project/swc/commit/27ca712812421ce7cef7770b1dde790080ce09ea))


- **(es/typescript)** Preserve type assertions ([#9328](https://github.com/swc-project/swc/issues/9328)) ([4d60f52](https://github.com/swc-project/swc/commit/4d60f528d1e7f3a1606cb2c288786491dbafbd5b))


- **(es/typescript)** Fix ASI in expression for fast strip ([#9358](https://github.com/swc-project/swc/issues/9358)) ([3ee82e2](https://github.com/swc-project/swc/commit/3ee82e223fe0ce54ad892cc5b009f573d997c60e))


- **(es/typescript)** Handle single type statement in if/for/while ([#9364](https://github.com/swc-project/swc/issues/9364)) ([2217730](https://github.com/swc-project/swc/commit/221773069b2069ded7eb475cb75a2daa1ec4a752))


- **(es/typescript)** Handle backtick in ASI issue ([#9367](https://github.com/swc-project/swc/issues/9367)) ([6f1716c](https://github.com/swc-project/swc/commit/6f1716c4aed447c3311e41603a6399d97540e1fb))


- **(es/typescript)** Analyze import chain ([#9369](https://github.com/swc-project/swc/issues/9369)) ([4f9116f](https://github.com/swc-project/swc/commit/4f9116f9259150df3fb3947c809c304809bf5764))


- **(es/typescript)** Strip declare export in strip-only mode ([#9374](https://github.com/swc-project/swc/issues/9374)) ([c53cce4](https://github.com/swc-project/swc/commit/c53cce41da69ebb3cd9b464c001902d30bdd07ba))


- **(es/typescript)** Enable Injector to process JSX ([#9395](https://github.com/swc-project/swc/issues/9395)) ([e24e2ff](https://github.com/swc-project/swc/commit/e24e2ffe5971d2d1ef667c910a12b94ca41f1b52))


- **(es/typescript)** Strip declaration of exported function overloads ([#9397](https://github.com/swc-project/swc/issues/9397)) ([5c8aa52](https://github.com/swc-project/swc/commit/5c8aa522da205fc7fab156cb9d44c8acca872523))


- **(es/typescript)** Strip class modifiers ([#9399](https://github.com/swc-project/swc/issues/9399)) ([124e5ff](https://github.com/swc-project/swc/commit/124e5ffa7bcf26215a339450f6b40161dabbe5a4))


- **(es/typescript)** Strip optional mark and definite mark ([#9411](https://github.com/swc-project/swc/issues/9411)) ([8c161a0](https://github.com/swc-project/swc/commit/8c161a003e741320434f31617bc2de98dd2c9a8f))


- **(es/typescript)** Strip exported default overload function declaration ([#9412](https://github.com/swc-project/swc/issues/9412)) ([b395f48](https://github.com/swc-project/swc/commit/b395f483d1e0cb43b1f96126c5c17f9a8c9d0d32))


- **(es/typescript)** Strip `this` param in getter/setter ([#9414](https://github.com/swc-project/swc/issues/9414)) ([442fb7b](https://github.com/swc-project/swc/commit/442fb7b48715597d62f8d09327f93acc66f2d1b8))


- **(es/typescript)** Update ts-strip type definition ([#9415](https://github.com/swc-project/swc/issues/9415)) ([165c8fa](https://github.com/swc-project/swc/commit/165c8facd42d756077fde99defe91ffe656aede8))


- **(es/typescript)** Correctly handle deep import chains ([#9487](https://github.com/swc-project/swc/issues/9487)) ([50d70d3](https://github.com/swc-project/swc/commit/50d70d35d0810494a6a76f062177caf185fb9c77))


- **(es/typescript)** Correctly handle ESM context ([#9490](https://github.com/swc-project/swc/issues/9490)) ([fc0483c](https://github.com/swc-project/swc/commit/fc0483ce1becefde4d7736d52b7c1da9aaf77b9a))


- **(es/typescript)** Preserve more comments ([#9509](https://github.com/swc-project/swc/issues/9509)) ([3e253ec](https://github.com/swc-project/swc/commit/3e253ecc21f2028437572093b42df97ef5fe505e))


- **(es/typescript)** Handle enum in single statement ([#9532](https://github.com/swc-project/swc/issues/9532)) ([84b0043](https://github.com/swc-project/swc/commit/84b004387ba8f4135659e1d1f54e59bf1941a57a))


- **(es/typescrupt)** Fix ASI issue in fast ts strip ([#9332](https://github.com/swc-project/swc/issues/9332)) ([57146cf](https://github.com/swc-project/swc/commit/57146cf58acb43fb5fa526bfde206c4f147edc6d))


- **(es/utils)** Use `$crate` for `quote_ident!()` ([#9309](https://github.com/swc-project/swc/issues/9309)) ([bdaaf47](https://github.com/swc-project/swc/commit/bdaaf47cb4fc0146485a567d48449116d0e67e98))


- **(html)** Fix html binding ([eefae1c](https://github.com/swc-project/swc/commit/eefae1cde794b28b68e5c0af2d2f13a5053b7a49))


- **(plugin)** Don't panic when ast byte not match ([#9562](https://github.com/swc-project/swc/issues/9562)) ([c36871a](https://github.com/swc-project/swc/commit/c36871a84826cc125c3c10a78ee2d7a435373154))


- **(swc_core)** Remove unused `preset_env` ([#9333](https://github.com/swc-project/swc/issues/9333)) ([75bc7bf](https://github.com/swc-project/swc/commit/75bc7bfb52f81050f863466ff595ece765ca4fcf))


- **(visit)** Fix regression ([#9404](https://github.com/swc-project/swc/issues/9404)) ([041a7b7](https://github.com/swc-project/swc/commit/041a7b7ff756fcdac9cc1d25f5ee82b355e73246))


- **(visit)** Fix regression of AST paths ([#9420](https://github.com/swc-project/swc/issues/9420)) ([9751518](https://github.com/swc-project/swc/commit/9751518a0aa1cbe07e2ad4db7a32b0c6cc342641))

### Documentation



- **(bindings/wasm)** Document supported TypeScript version ([#9334](https://github.com/swc-project/swc/issues/9334)) ([66f31c0](https://github.com/swc-project/swc/commit/66f31c0af46dea60c51e4155a8887a5d2b441da3))


- **(contributing)** Fix deno installation url ([#9249](https://github.com/swc-project/swc/issues/9249)) ([ff5bbda](https://github.com/swc-project/swc/commit/ff5bbdae6ad16309efe592788f4cb14956ffc3b1))


- **(contributing)** Add warning for `test --all` ([#9338](https://github.com/swc-project/swc/issues/9338)) ([234bb97](https://github.com/swc-project/swc/commit/234bb974bc54e9c929fd4cf810bcecab36f760ba))

### Features



- **(allocator)** Feature gate `nightly` via macros ([#9274](https://github.com/swc-project/swc/issues/9274)) ([a31fb58](https://github.com/swc-project/swc/commit/a31fb58399cc60ad5052d77b5accd560200a4f3d))


- **(allocator)** Add `maybe` types ([#9278](https://github.com/swc-project/swc/issues/9278)) ([a417ff4](https://github.com/swc-project/swc/commit/a417ff4d868b45a2157154e2334b8e1177c369e1))


- **(bindings/html)** Allow using `lightningcss` as minfiier ([#9462](https://github.com/swc-project/swc/issues/9462)) ([74d6478](https://github.com/swc-project/swc/commit/74d6478be1eb8cdf1df096c360c159db64b64d8a))


- **(es/common)** Introduce pure `Span` and `BytePos` to handle `#__PURE__` ([#9539](https://github.com/swc-project/swc/issues/9539)) ([f63a481](https://github.com/swc-project/swc/commit/f63a481833ebe9b5eae0708ee69b6a50b946ee28))


- **(es/decorators)** Groundwork for stage 3 decorator ([#9450](https://github.com/swc-project/swc/issues/9450)) ([238ba8b](https://github.com/swc-project/swc/commit/238ba8b1d2220202129595185bd4411b9415cc99))


- **(es/minifier)** Drop more patterns with `PURE` marker ([#9478](https://github.com/swc-project/swc/issues/9478)) ([ede1a52](https://github.com/swc-project/swc/commit/ede1a52cb8fb681ca08c54880c75c9b115c7a906))


- **(es/minifier)** Support mangle cache ([#9489](https://github.com/swc-project/swc/issues/9489)) ([af922d8](https://github.com/swc-project/swc/commit/af922d83e58596021476006564edb6270069d437))


- **(es/parser)** Disallow `let let` ([#9484](https://github.com/swc-project/swc/issues/9484)) ([1121bc0](https://github.com/swc-project/swc/commit/1121bc0dc161520a418945dbc610c30adc7ab3aa))


- **(es/typescript)** Add esm build for fast ts strip ([#9286](https://github.com/swc-project/swc/issues/9286)) ([d10cb9f](https://github.com/swc-project/swc/commit/d10cb9ffa29033048d242fc3fb4a35ea5fb1bf16))


- **(es/typescript)** Add `native_class_properties ` to skip reordering of class properties inits ([#9421](https://github.com/swc-project/swc/issues/9421)) ([d2929d1](https://github.com/swc-project/swc/commit/d2929d1ce61a00360cc0596441041571a958da23))


- **(estree/compat)** Remove dependency on `rayon` ([#9393](https://github.com/swc-project/swc/issues/9393)) ([34d1b27](https://github.com/swc-project/swc/commit/34d1b27251dab3f87dc3a39d245a3498b4c2b151))


- **(html/minifier)** Support using custom css minifier ([#9425](https://github.com/swc-project/swc/issues/9425)) ([970cc81](https://github.com/swc-project/swc/commit/970cc81033b4a616643be6625bdf8da99614ba98))


- **(plugin/runner)** Improve error message ([#9502](https://github.com/swc-project/swc/issues/9502)) ([da52930](https://github.com/swc-project/swc/commit/da529304fe23bcb1a15c25811f928ebf91207ef0))


- **(visit)** Make `kind()` accessible without `swc_visit` ([#9382](https://github.com/swc-project/swc/issues/9382)) ([021e41d](https://github.com/swc-project/swc/commit/021e41d1534da5d9ba17b9d8f14da6652133f467))


- **(visit)** Add experimental traverse APIs ([#9464](https://github.com/swc-project/swc/issues/9464)) ([3ee8980](https://github.com/swc-project/swc/commit/3ee8980dbe82587285e4920420687ab7ac7c5cdf))

### Miscellaneous Tasks



- **(bindings/node)** Deprecate `parse` ([#9419](https://github.com/swc-project/swc/issues/9419)) ([1bf467d](https://github.com/swc-project/swc/commit/1bf467d99fb72ebff42136e08d7f03d50872f64e))


- **(bindings/node)** Fix type definition ([64ec111](https://github.com/swc-project/swc/commit/64ec1117697029895284e248d79698f802cf1aa8))


- **(common)** Remove `dbg` log ([#9384](https://github.com/swc-project/swc/issues/9384)) ([a538ca1](https://github.com/swc-project/swc/commit/a538ca1990e7b5b8841bc4a883b464c7690e2022))


- **(deps)** Update actions ([#9311](https://github.com/swc-project/swc/issues/9311)) ([475432e](https://github.com/swc-project/swc/commit/475432e83aad0191b8ad23e503d9fbe1835be196))


- **(deps)** Update npm (patch) ([#9318](https://github.com/swc-project/swc/issues/9318)) ([9d983c3](https://github.com/swc-project/swc/commit/9d983c3864888c3402679ce5498f82e71899c210))


- **(deps)** Update `wasmer` to fix broken Windows build ([#9322](https://github.com/swc-project/swc/issues/9322)) ([a120faf](https://github.com/swc-project/swc/commit/a120faf84b178c666b9ac785d27f426f89d10ac6))


- **(deps)** Drop `atty` ([#9325](https://github.com/swc-project/swc/issues/9325)) ([831500e](https://github.com/swc-project/swc/commit/831500e24a25b454f496729242e5e5d54c01756a))


- **(deps)** Update rust crate toml to v0.8.16 ([#9327](https://github.com/swc-project/swc/issues/9327)) ([67aadfa](https://github.com/swc-project/swc/commit/67aadfa6c976c60a3a756a1b1fcdcf193d96c51f))


- **(deps)** Update dependency magic-string to v0.30.11 ([#9345](https://github.com/swc-project/swc/issues/9345)) ([ced06e2](https://github.com/swc-project/swc/commit/ced06e2da35952c7073fee8aa69cf1a21078cc12))


- **(deps)** Update rust crate toml to v0.8.17 ([#9349](https://github.com/swc-project/swc/issues/9349)) ([d5472cc](https://github.com/swc-project/swc/commit/d5472cc344fb4099af3887e6cc1cf8ec2869c33e))


- **(deps)** Update rust crate toml to v0.8.19 ([#9360](https://github.com/swc-project/swc/issues/9360)) ([9cd51ce](https://github.com/swc-project/swc/commit/9cd51cebdf7e9dd25ebe5057cde63ce7ee0bd0c6))


- **(deps)** Update cargo (patch) ([#9402](https://github.com/swc-project/swc/issues/9402)) ([10d99e5](https://github.com/swc-project/swc/commit/10d99e5f2b58cbd87746fc88cd49328788bdea03))


- **(deps)** Update cargo (patch) ([#9405](https://github.com/swc-project/swc/issues/9405)) ([baf4928](https://github.com/swc-project/swc/commit/baf4928ce2964e659af5ca77cd899427a8c29f60))


- **(deps)** Update rust crate arrayvec to v0.7.6 ([#9436](https://github.com/swc-project/swc/issues/9436)) ([08dd948](https://github.com/swc-project/swc/commit/08dd948289006583c6f0f76850c08808651f9135))


- **(es)** Update `wasmer` to `v4.3.7` ([#9557](https://github.com/swc-project/swc/issues/9557)) ([190d6f0](https://github.com/swc-project/swc/commit/190d6f06d9545e4206bdb53c0f1ba2d443a5a7ab))


- **(es)** Add helpers ([#9586](https://github.com/swc-project/swc/issues/9586)) ([b94a0e1](https://github.com/swc-project/swc/commit/b94a0e1fd2b900b05c5f18d3d993a74ff9cc6e7d))


- **(es/codegen)** Bump minimum required swc_allocator version to 0.1.8 ([#9492](https://github.com/swc-project/swc/issues/9492)) ([5258763](https://github.com/swc-project/swc/commit/5258763cf673e1684808bc2766ba6ee9c84642f1))


- **(es/preset-env)** Update core js compat data ([#9407](https://github.com/swc-project/swc/issues/9407)) ([ce761cf](https://github.com/swc-project/swc/commit/ce761cf51571f70c9378b6b67759bac3af4f4f92))


- **(es/typescript)** Remove `unreachable_visit_mut_type` ([#9390](https://github.com/swc-project/swc/issues/9390)) ([8e49c90](https://github.com/swc-project/swc/commit/8e49c904d80a04610d307ce1751f5a572871abbb))


- **(es/typescript)** Remove the workaround for wasm-bindgen ([#9428](https://github.com/swc-project/swc/issues/9428)) ([55f7268](https://github.com/swc-project/swc/commit/55f72687f69eae131c6ce08d6a449afaa7357667))


- **(html)** Use `binding_html_node` instead of `html_node` ([bdea5cb](https://github.com/swc-project/swc/commit/bdea5cb94cf7cc9d02274f32e104b55f977e625d))


- **(html)** Fix publish action ([f30fd4f](https://github.com/swc-project/swc/commit/f30fd4fe42764ee29031ce4c0c038c1c95235482))


- **(plugin/runner)** Fix benchmark ([#9477](https://github.com/swc-project/swc/issues/9477)) ([b0b5e36](https://github.com/swc-project/swc/commit/b0b5e36675835ce5f98ad55528dddc6514064553))

### Performance



- **(allocator)** Use `std` instead of `allocator-api2` ([#9281](https://github.com/swc-project/swc/issues/9281)) ([88723db](https://github.com/swc-project/swc/commit/88723dbf19a402c6395d34b71a5a8a712b4bf1bc))


- **(es/codegen)** Use scoped allocator ([#9248](https://github.com/swc-project/swc/issues/9248)) ([970f323](https://github.com/swc-project/swc/commit/970f32398c6ff444540a31e1172a33b6155ed18b))


- **(es/codegen)** Use `Vec<T>` from `swc_allocator` ([#9280](https://github.com/swc-project/swc/issues/9280)) ([c1cd0b9](https://github.com/swc-project/swc/commit/c1cd0b99c14b03c250f2d278f10480da733e0dfa))


- **(es/codegen)** Optimize using `swc_allocator` ([#9294](https://github.com/swc-project/swc/issues/9294)) ([07376c6](https://github.com/swc-project/swc/commit/07376c6fbbf7f945b673e4adf3f4d789c10c7781))


- **(es/compat)** Reimplement constructor transform ([#9519](https://github.com/swc-project/swc/issues/9519)) ([4b85a92](https://github.com/swc-project/swc/commit/4b85a92170576f194c2b1ad3b3ec624c4839e215))


- **(es/helpers)** Use `bool` instead of `AtomicBool` ([#9321](https://github.com/swc-project/swc/issues/9321)) ([8107e98](https://github.com/swc-project/swc/commit/8107e985e13e73f408d569655119d0684c166f24))


- **(es/minifier)** Pre-allocate collections ([#9289](https://github.com/swc-project/swc/issues/9289)) ([76fe139](https://github.com/swc-project/swc/commit/76fe139334b64c9ba62a98dc5319523d21d633f4))


- **(es/utils)** Rewrite inject_after_super ([#9496](https://github.com/swc-project/swc/issues/9496)) ([c562cfa](https://github.com/swc-project/swc/commit/c562cfa8af1163a4946ef79cb025d461c7e2e5e0))


- **(visit)** Modify `Box` and `Vec` in-place ([#9291](https://github.com/swc-project/swc/issues/9291)) ([ae2ac05](https://github.com/swc-project/swc/commit/ae2ac05b94a6f9f6e56c26cde5c8b8e705739f1c))


- **(visit)** Add `#[inline]` ([#9302](https://github.com/swc-project/swc/issues/9302)) ([0b3dbb8](https://github.com/swc-project/swc/commit/0b3dbb893752952a0bc7ffc5ba9801291c65f019))


- **(visit)** Add linear AST traversal ([#9452](https://github.com/swc-project/swc/issues/9452)) ([911d4ea](https://github.com/swc-project/swc/commit/911d4eaa146ff493636308a3cebd8b21d941bfde))


- Enable LTO for benchmarks ([#9279](https://github.com/swc-project/swc/issues/9279)) ([a3020b2](https://github.com/swc-project/swc/commit/a3020b2bc77d38fde772b98a14c80deb6c4a6911))

### Refactor



- **(allocator)** Use RAII guard instead of `scope` ([#9254](https://github.com/swc-project/swc/issues/9254)) ([6e098ae](https://github.com/swc-project/swc/commit/6e098aeeb5976292e43786f72bd91f1de50a9daa))


- **(common)** Simplify `SyntaxContext` and `Mark` ([#9476](https://github.com/swc-project/swc/issues/9476)) ([4bee30a](https://github.com/swc-project/swc/commit/4bee30ab40de19c844956e156a7fb3bed1506daa))


- **(es/codegen)** Revert #9248 ([#9266](https://github.com/swc-project/swc/issues/9266)) ([b9b233c](https://github.com/swc-project/swc/commit/b9b233cacd9d326afb806d856c91e38474b237c2))


- **(es/utils)** Unify `prepend_stmts` ([#9493](https://github.com/swc-project/swc/issues/9493)) ([faec8c1](https://github.com/swc-project/swc/commit/faec8c134d950d10a9f2dce0e5680d9230f87ceb))


- **(visit)** Pre-generate visitor code ([#9262](https://github.com/swc-project/swc/issues/9262)) ([9c17663](https://github.com/swc-project/swc/commit/9c176632b1e0d6edec10929486ca514fa992415b))


- **(visit)** Remove `VisitAll` ([#9448](https://github.com/swc-project/swc/issues/9448)) ([8845b76](https://github.com/swc-project/swc/commit/8845b76ac40b36791c79618c5ee89f05d2d08c96))


- Remove unused files ([#9285](https://github.com/swc-project/swc/issues/9285)) ([33284c1](https://github.com/swc-project/swc/commit/33284c128ed233878b86ea5f660d9ccfc0f82c53))

### Testing



- **(allocator)** Merge test ([#9267](https://github.com/swc-project/swc/issues/9267)) ([efc3963](https://github.com/swc-project/swc/commit/efc396377ff95b0c464fe4bf793dc3da59abd36e))


- **(es)** Add tests for arm64 windows ([#9547](https://github.com/swc-project/swc/issues/9547)) ([9dd8f6f](https://github.com/swc-project/swc/commit/9dd8f6facf29817902ddf55ec0388061585cbf7d))


- **(es/typescript)** Verify TypeScript stripped output ([#9398](https://github.com/swc-project/swc/issues/9398)) ([4c4c860](https://github.com/swc-project/swc/commit/4c4c86014f7827e92731c0d60ef1613238648b30))


- Enable scoped API by default ([#9247](https://github.com/swc-project/swc/issues/9247)) ([e7ce94b](https://github.com/swc-project/swc/commit/e7ce94b5ee713dc76383c35d99dd6a707c90339c))

### Build



- Update `rustc` to `nightly-2024-07-21` ([#9319](https://github.com/swc-project/swc/issues/9319)) ([279ea91](https://github.com/swc-project/swc/commit/279ea910e001f0c7db8d06bc7a3c48e4d718fed9))

<!-- generated by git-cliff -->
