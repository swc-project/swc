# Changelog
## [unreleased]

### Bug Fixes



- **(es/compat)** Don't add pure annotations to dummy spans ([#8172](https://github.com/swc-project/swc/issues/8172)) ([9ceb57b](https://github.com/swc-project/swc/commit/9ceb57b4c7b15e679031c08d4100bb2b6a0ce229))


- **(es/minifier)** Always consider `reassigned` when inlining ([#8168](https://github.com/swc-project/swc/issues/8168)) ([c26a225](https://github.com/swc-project/swc/commit/c26a2252b6cfbc659fdd935a7282cec27bcb527b))


- **(es/typescript)** Support `ts_enum_is_mutable` with const enums ([#8171](https://github.com/swc-project/swc/issues/8171)) ([02d0613](https://github.com/swc-project/swc/commit/02d0613a35a3875ad3b0c0b008cf063bd162bc07))

### Build



- **(deps)** Update `ahash` ([#8174](https://github.com/swc-project/swc/issues/8174)) ([5ca3b63](https://github.com/swc-project/swc/commit/5ca3b6358219ec71a000fa30d8be14ee2c3f2fc8))

## [1.3.94] - 2023-10-21

### Bug Fixes



- **(css/ast)** Make `.hash()` of `Token` not recursive ([#8151](https://github.com/swc-project/swc/issues/8151)) ([8d7894c](https://github.com/swc-project/swc/commit/8d7894c71f86ef6b1813b69a15d72bb7911ed7ca))


- **(es/minifier)** Abort seq inliner if `b` can short-circuit ([#8128](https://github.com/swc-project/swc/issues/8128)) ([111de26](https://github.com/swc-project/swc/commit/111de264b0ec04ec7a693b0006050df21513b583))


- **(es/minifier)** Abort function inliner if `keep_fnames` is `true` ([#8145](https://github.com/swc-project/swc/issues/8145)) ([35601e4](https://github.com/swc-project/swc/commit/35601e4dcb7bb65e16d217c50d6065958cbd8e6d))


- **(es/parser)** Skip `this` parameters in setter ([#8158](https://github.com/swc-project/swc/issues/8158)) ([826386f](https://github.com/swc-project/swc/commit/826386f49a1226ff3f7d352a75ccdc65c982b4be))


- **(es/utils)** Skip var declarator name in `RefRewriter` ([#8125](https://github.com/swc-project/swc/issues/8125)) ([fb81a36](https://github.com/swc-project/swc/commit/fb81a36adcebdc269ae89677977220e9b21b072f))


- **(es/utils)** Fix regression of `RefRewriter` ([#8153](https://github.com/swc-project/swc/issues/8153)) ([08cf1f7](https://github.com/swc-project/swc/commit/08cf1f786d0a0fbe4029614306ba2ebaf0a9c919))

### Features



- **(es/compat)** Implement decorator metadata proposal ([#8097](https://github.com/swc-project/swc/issues/8097)) ([9c029ef](https://github.com/swc-project/swc/commit/9c029ef095f83783a3581dfcc165dd197308f538))


- **(es/compat)** Skip empty class static blocks ([#8138](https://github.com/swc-project/swc/issues/8138)) ([e186b80](https://github.com/swc-project/swc/commit/e186b80ddcc0c95f276e845cc491b276d0fb15ee))


- **(es/minifier)** Evaluate more `toFixed` expressions ([#8109](https://github.com/swc-project/swc/issues/8109)) ([7da3f52](https://github.com/swc-project/swc/commit/7da3f52485062eb23c719e1236b2fee90c228bdd))


- **(es/minifier)** Inline into the arguments of `new` using seq inliner ([#8127](https://github.com/swc-project/swc/issues/8127)) ([4f67794](https://github.com/swc-project/swc/commit/4f67794223cf2848ac3c3e42e1e43acec4533246))


- **(es/minifier)** Drop empty static blocks ([#8152](https://github.com/swc-project/swc/issues/8152)) ([8a461b8](https://github.com/swc-project/swc/commit/8a461b89573e82bfdac9e730ee23a2fa9210a4c5))


- **(es/parser)** Implement `AsRef<str>` for `IdentLike` ([#8133](https://github.com/swc-project/swc/issues/8133)) ([bffe33a](https://github.com/swc-project/swc/commit/bffe33a27036d01d409bad3fcc69d35157665662))


- **(es/typescript)** Add `ts_enum_is_mutable` to disable enum inlining ([#8115](https://github.com/swc-project/swc/issues/8115)) ([57b171d](https://github.com/swc-project/swc/commit/57b171dcbe55a8d285d5bc477844b24fdf48835a))

### Miscellaneous Tasks



- **(bindings)** Add `@deprecated` to JS plugins ([#8132](https://github.com/swc-project/swc/issues/8132)) ([1e9b4e0](https://github.com/swc-project/swc/commit/1e9b4e027cabba88c8a0cfd6b62f9ca6c00b29a8))


- **(es/module)** Remove `serde(deny_unknown_fields)` ([#8163](https://github.com/swc-project/swc/issues/8163)) ([5be8e74](https://github.com/swc-project/swc/commit/5be8e74ee0a2e81058c340f414479da554081d09))

### Refactor



- **(es/minifier)** Decouple `assign_count` from `reassigned` ([#8137](https://github.com/swc-project/swc/issues/8137)) ([13106e0](https://github.com/swc-project/swc/commit/13106e0d2eaa08c4c74f58205f57c4f2d7d4479f))

## [1.3.93] - 2023-10-13

### Bug Fixes



- **(ci)** Fix CI ([#8079](https://github.com/swc-project/swc/issues/8079)) ([7073e83](https://github.com/swc-project/swc/commit/7073e83f65ed5e98ee294c8e366a80b0a0f5921f))


- **(es/codegen)** Fix codegen of type-only imports ([#8070](https://github.com/swc-project/swc/issues/8070)) ([6f45b46](https://github.com/swc-project/swc/commit/6f45b4693e6d35bf05bacb89b65c7f013d0366a2))


- **(es/compat)** Handle `__proto__` edge case in `shorthand` pass ([#8077](https://github.com/swc-project/swc/issues/8077)) ([a912937](https://github.com/swc-project/swc/commit/a912937cea672ad4fbda057efc3a09283e3635fe))


- **(es/compat)** Handle export default decorator only if not empty ([#8099](https://github.com/swc-project/swc/issues/8099)) ([bf523f5](https://github.com/swc-project/swc/commit/bf523f53513311d6c7d4a94f9a36bedd42230c09))


- **(es/decorators)** Fix a regression about class expressions ([#8102](https://github.com/swc-project/swc/issues/8102)) ([cb4361f](https://github.com/swc-project/swc/commit/cb4361f2931cf222edbb449db6fe2c261c4b735d))


- **(es/helpers)** Override mistake in `_interop_require_wildcard` ([#8076](https://github.com/swc-project/swc/issues/8076)) ([1346528](https://github.com/swc-project/swc/commit/1346528477bd8c587f0ee0d5fa6969f397739ddb))


- **(es/minifier)** Don't inline functions if `keep_fnames` is enabled ([#8093](https://github.com/swc-project/swc/issues/8093)) ([94bb42e](https://github.com/swc-project/swc/commit/94bb42e29418a8697ba0ab41dad2ffe63f1c32c7))


- **(es/parser)** Fix parsing of `await using` ([#8101](https://github.com/swc-project/swc/issues/8101)) ([e1043fa](https://github.com/swc-project/swc/commit/e1043fae77ca9e33b2d65ce6edc9559917a895ec))


- **(xtask)** Fix nightly command ([#8105](https://github.com/swc-project/swc/issues/8105)) ([db4ca65](https://github.com/swc-project/swc/commit/db4ca650e445e602f289f7964b24f7e2647beacd))

### Features



- **(css/parser)** Store lexed comments ([#8091](https://github.com/swc-project/swc/issues/8091)) ([d1097cc](https://github.com/swc-project/swc/commit/d1097ccb599c4343e3f80ca9bd793bbfce424e8b))

### Miscellaneous Tasks



- **(es/minifier)** Fix script for extracting test cases from next.js app ([#8092](https://github.com/swc-project/swc/issues/8092)) ([a2d0779](https://github.com/swc-project/swc/commit/a2d077958f071752dbc347fbf414622e0146e1fd))

### Refactor



- **(atoms)** Remove usage of `js_word!` to drop `string-cache` ([#7976](https://github.com/swc-project/swc/issues/7976)) ([84cec87](https://github.com/swc-project/swc/commit/84cec8766db77062cc984c777dd716358ee8fd6e))


- **(es/compat)** Split `swc_ecma_transforms_compat` ([#8110](https://github.com/swc-project/swc/issues/8110)) ([affb6fb](https://github.com/swc-project/swc/commit/affb6fb5e3e363f1eb4d42d4501a4a806c4060f7))


- **(es/module)** Reimplement some functions of module/typescript ([#8063](https://github.com/swc-project/swc/issues/8063)) ([3e5b062](https://github.com/swc-project/swc/commit/3e5b062cd2792703371bbbfeaf1be309e8280abd))


- **(es/parser)** Introduce `TokenKind` along with `Token` ([#8071](https://github.com/swc-project/swc/issues/8071)) ([9b9bc51](https://github.com/swc-project/swc/commit/9b9bc51c28fee51de9eeedf6d49fbe115d6052e6))


- **(es/preset-env)** Rename parameter to avoid confusion ([#8106](https://github.com/swc-project/swc/issues/8106)) ([95eb147](https://github.com/swc-project/swc/commit/95eb147742ea1aa207845807a306847afc859702))

## [1.3.92] - 2023-10-05

### Bug Fixes



- **(es/compat)** Fix scoping of `explicit-resource-management` ([#8044](https://github.com/swc-project/swc/issues/8044)) ([96a7a4d](https://github.com/swc-project/swc/commit/96a7a4d045d08547fed75c79a7156f79262edfc2))


- **(es/compat)** Transform default-exported class decorators correctly ([#8050](https://github.com/swc-project/swc/issues/8050)) ([a751f1c](https://github.com/swc-project/swc/commit/a751f1cfaf415917ab2a5e5098d9ca32bffa907b))


- **(es/compat)** Use `async` and `await` correctly in `block-scoping` pass ([#8056](https://github.com/swc-project/swc/issues/8056)) ([8318ea8](https://github.com/swc-project/swc/commit/8318ea82c28d3cf55e701f6da2f3077efe8ca653))


- **(es/module)** Handle directives ([#8048](https://github.com/swc-project/swc/issues/8048)) ([4d8e101](https://github.com/swc-project/swc/commit/4d8e1013bb7775f60d463276cc3233ecd7849b31))

### Refactor



- **(cli)** Make CLI testable/managable with `swc-bump` ([#8045](https://github.com/swc-project/swc/issues/8045)) ([f717cf2](https://github.com/swc-project/swc/commit/f717cf21cc1cea5e30e87c4d08861daadb25ab14))

## [1.3.91] - 2023-10-01

### Bug Fixes



- **(es/compat)** Use return statements for method and setter decorator ([#8017](https://github.com/swc-project/swc/issues/8017)) ([38bc710](https://github.com/swc-project/swc/commit/38bc71006ed6f46c0145e07acccce75f7be26553))


- **(es/compat)** Generate `OptCall` for `OptCall` for private fields ([#8031](https://github.com/swc-project/swc/issues/8031)) ([06b6eb9](https://github.com/swc-project/swc/commit/06b6eb999964c25a964b0105bd7a4f20b51300dd))


- **(es/minifier)** Check if object shorthand is skippable for seq inliner ([#8036](https://github.com/swc-project/swc/issues/8036)) ([01391e3](https://github.com/swc-project/swc/commit/01391e3c13e42b7f42f80ab13b396cad182942ff))


- **(es/module)** Sort the exported ESM bindings ([#8024](https://github.com/swc-project/swc/issues/8024)) ([990ca06](https://github.com/swc-project/swc/commit/990ca06aca3242a789e165f4318c95d0bb64b02e))


- **(es/typescript)** Rename wrong `unresolved_mark` ([#8018](https://github.com/swc-project/swc/issues/8018)) ([5817268](https://github.com/swc-project/swc/commit/58172689ce7f8dd2f0a79d8771c52fe309880b44))


- **(es/typescript)** Preserve default value of an exported binding in a namespace ([#8029](https://github.com/swc-project/swc/issues/8029)) ([cf96171](https://github.com/swc-project/swc/commit/cf96171a53589118a0103495169e02fed10a675f))

### Documentation



- **(counter)** Document the purpose of the package ([#8032](https://github.com/swc-project/swc/issues/8032)) ([b6b5a4d](https://github.com/swc-project/swc/commit/b6b5a4d3a6f1c6c74d47c855081a8fee17066829))

### Features



- **(bindings)** Create a minifier-only package ([#7993](https://github.com/swc-project/swc/issues/7993)) ([64d8f4b](https://github.com/swc-project/swc/commit/64d8f4b59f81c71bffbb906595bafa356f326924))

### Refactor



- **(es)** Extract parser/codegen code for `swc::Compiler` ([#8030](https://github.com/swc-project/swc/issues/8030)) ([a13f5cb](https://github.com/swc-project/swc/commit/a13f5cbe03f067b376f9f3318ef822142551eb96))


- **(es/minifier)** Move JS options to `swc_ecma_minifier` ([#8028](https://github.com/swc-project/swc/issues/8028)) ([725f7f5](https://github.com/swc-project/swc/commit/725f7f5bda0881bdaac1bf1254f58e5341633d4e))

## [1.3.90] - 2023-09-27

### Bug Fixes



- **(es/codegen)** Fix codegen of unicode surrogates ([#7985](https://github.com/swc-project/swc/issues/7985)) ([39c680d](https://github.com/swc-project/swc/commit/39c680d814644fbde50b0f73a29aebe791812eb2))


- **(es/codegen)** Fix codegen of optional chaining expr with a comment ([#8005](https://github.com/swc-project/swc/issues/8005)) ([f07bb48](https://github.com/swc-project/swc/commit/f07bb482e694a422591085621a38aff747294502))


- **(es/typescript)** Handle `DeclareCollect` correctly ([#8008](https://github.com/swc-project/swc/issues/8008)) ([9d08b8a](https://github.com/swc-project/swc/commit/9d08b8a6145d486e570a22563c62a69722cf8759))


- **(es/typescript)** Handle qualified access in assign pat ([#8012](https://github.com/swc-project/swc/issues/8012)) ([2f01aba](https://github.com/swc-project/swc/commit/2f01aba978415add87994f9b20e3e2db83fc48b6))

## [1.3.89] - 2023-09-25

### Bug Fixes



- **(es)** Enable resolver if `jsc.baseUrl` is specified ([#7998](https://github.com/swc-project/swc/issues/7998)) ([f374ad9](https://github.com/swc-project/swc/commit/f374ad903a066ebf3a7e54a3656cb3fc44b37445))


- **(es/compat)** Skip function scope in `block-scoped-fns` pass ([#7975](https://github.com/swc-project/swc/issues/7975)) ([d91a554](https://github.com/swc-project/swc/commit/d91a554033c8ce0ea2b2538b0e86abf5a81eac76))

### Refactor



- **(es/typescript)** Reimplement TypeScript pass ([#7202](https://github.com/swc-project/swc/issues/7202)) ([9c9a538](https://github.com/swc-project/swc/commit/9c9a538f23cb2bcd2f46e156babf64c7a81db245))

## [1.3.88] - 2023-09-24

### Features



- **(es/config)** Accept `jsc.experimental.keepImportAssertions` ([#7995](https://github.com/swc-project/swc/issues/7995)) ([4d777ee](https://github.com/swc-project/swc/commit/4d777ee270183ba375b68c003e61692af6d571c3))

### Refactor



- **(bindingins)** Create `@swc/counter` ([#7991](https://github.com/swc-project/swc/issues/7991)) ([0acbb5f](https://github.com/swc-project/swc/commit/0acbb5f78daa52cf505e077993a694eb966368af))

## [1.3.87] - 2023-09-22

### Bug Fixes



- **(bindings/type)** Update types of `jsc.experimental` ([#7972](https://github.com/swc-project/swc/issues/7972)) ([e40fccb](https://github.com/swc-project/swc/commit/e40fccb9ce2a8fc925de818c8da4b6503aab7ae3))


- **(es/compat)** Handle nullish in fn expr scope ([#7980](https://github.com/swc-project/swc/issues/7980)) ([5050f58](https://github.com/swc-project/swc/commit/5050f5820a43b8de7a87511070405e189eaafb5f))


- **(es/minifier)** Do not inline into a template literal with sequential inliner ([#7971](https://github.com/swc-project/swc/issues/7971)) ([b3d3a7b](https://github.com/swc-project/swc/commit/b3d3a7bc7339776e57ca402e77cf3fb22c774784))

## [1.3.86] - 2023-09-18

### Bug Fixes



- **(es/compat)** Handle `PrivateName` in `logical_assignments` ([#7958](https://github.com/swc-project/swc/issues/7958)) ([28318f0](https://github.com/swc-project/swc/commit/28318f09ed358b2baa155141bc715c25f658a2eb))


- **(es/minifier)** Handle `ModuleDecl` when transform const modules ([#7959](https://github.com/swc-project/swc/issues/7959)) ([06ca1fe](https://github.com/swc-project/swc/commit/06ca1fe0a03954883750c3c39d0163fc29596ad1))


- **(es/module)** Preserve import specifier if resolving fails ([#7955](https://github.com/swc-project/swc/issues/7955)) ([be5b02a](https://github.com/swc-project/swc/commit/be5b02a8cfe2a2c1c399a4f9404b8fd097084234))

### Miscellaneous Tasks



- **(es/preset-env)** Add the repository url to `Cargo.toml` ([#7941](https://github.com/swc-project/swc/issues/7941)) ([ca22359](https://github.com/swc-project/swc/commit/ca22359dbd0ca6e2e925bdc240939f6bd6e9ac9a))


- **(es/preset-env)** Ignore `tp` in the version of a browser version ([#7968](https://github.com/swc-project/swc/issues/7968)) ([005ddc5](https://github.com/swc-project/swc/commit/005ddc573e3752183783cc25dd6242b750f8beb5))

### Refactor



- **(es/lint)** Remove usage of `box_patterns` ([#7966](https://github.com/swc-project/swc/issues/7966)) ([f7b5e16](https://github.com/swc-project/swc/commit/f7b5e16aef968c9c9f38f40962edf334cc3983e6))

### Build



- **(bindings/node)** Link msvc runtime statically ([#7965](https://github.com/swc-project/swc/issues/7965)) ([0759779](https://github.com/swc-project/swc/commit/07597795cc39cce527f505bc5db304ad93082494))

## [1.3.85] - 2023-09-15

### Bug Fixes



- **(css/modules)** Support composes when using multiple subclass selectors ([#7949](https://github.com/swc-project/swc/issues/7949)) ([05ca19b](https://github.com/swc-project/swc/commit/05ca19b84489ae47f69d8228b3c0097164c7ec6e))


- **(es/compat)** Handle single expression case in static block ([#7944](https://github.com/swc-project/swc/issues/7944)) ([a80aec4](https://github.com/swc-project/swc/commit/a80aec47efcff953d3408cf6910b66c2312f3006))


- **(es/minifier)** Parse a file as a module only if `opts.module` is `true` ([#7943](https://github.com/swc-project/swc/issues/7943)) ([b87ac64](https://github.com/swc-project/swc/commit/b87ac646f81f181b574da798b3e613a3cfa4cad5))

### Features



- **(es/compat)** Support `pure_getters` for `optional_chaining` ([#7933](https://github.com/swc-project/swc/issues/7933)) ([c091c5e](https://github.com/swc-project/swc/commit/c091c5e295ec2ef704be1461f6587ae85051b543))


- **(es/module)** Add an option to make resolver fully resolve `index.js` ([#7945](https://github.com/swc-project/swc/issues/7945)) ([7e8d72d](https://github.com/swc-project/swc/commit/7e8d72d03b312b7a48c17afa8d2a4d7f4e802a6a))

## [1.3.84] - 2023-09-11

### Bug Fixes



- **(es/codegen)** Emit leading comments for `ExprStmt` ([#7916](https://github.com/swc-project/swc/issues/7916)) ([2da5895](https://github.com/swc-project/swc/commit/2da58959c26d5afb0b8f179fc681478bf05e6e20))


- **(es/codegen)** Use `emitAssertForImportAttributes` ([#7936](https://github.com/swc-project/swc/issues/7936)) ([dac8888](https://github.com/swc-project/swc/commit/dac8888829841e1de19d53c887a2a52c9ab5feaa))


- **(es/compat)** Visit assign expr in generator ([#7932](https://github.com/swc-project/swc/issues/7932)) ([97068e1](https://github.com/swc-project/swc/commit/97068e12d16803012a4859114702577def024a36))

## [1.3.83] - 2023-09-07

### Bug Fixes



- **(css/modules)** Aggregate class names when composes is chained. ([#7917](https://github.com/swc-project/swc/issues/7917)) ([0db25a2](https://github.com/swc-project/swc/commit/0db25a252cf35e4b64b38bde9f34a2f33eb2f662))


- **(es/module)** Revert #7901 ([#7906](https://github.com/swc-project/swc/issues/7906)) ([85d6e9b](https://github.com/swc-project/swc/commit/85d6e9be07af7bb788594b21a986636657d86f03))


- **(es/module)** Fix `jsc.paths` for projects using pnpm ([#7918](https://github.com/swc-project/swc/issues/7918)) ([a86e9f3](https://github.com/swc-project/swc/commit/a86e9f3bb5bd490ebf0b18fe7349a2b0fbc0c45f))

### Features



- **(es/codegen)** Add an option to print `assert` for import attributes ([#7914](https://github.com/swc-project/swc/issues/7914)) ([ee75756](https://github.com/swc-project/swc/commit/ee7575695de6dad140457ffb8bb8f0ac80c4dcdc))

## [1.3.82] - 2023-09-01

### Bug Fixes



- **(common)** Fix logic for excluding `FileName` from source maps ([#7900](https://github.com/swc-project/swc/issues/7900)) ([aa64955](https://github.com/swc-project/swc/commit/aa6495519b9271cb21d380c0c5a35fe79d31ee14))


- **(es/module)** Make `jsc.paths` fully resolve TypeScript files ([#7901](https://github.com/swc-project/swc/issues/7901)) ([c714dd2](https://github.com/swc-project/swc/commit/c714dd20dedfab60ac75de613d13c0f3af60a6c7))


- **(es/resolver)** Correctly resolve global value ([#7893](https://github.com/swc-project/swc/issues/7893)) ([2db10e9](https://github.com/swc-project/swc/commit/2db10e9fd1913b69cb088aaded2d587872e9f2bb))

## [1.3.81] - 2023-08-30

### Bug Fixes



- **(es/codegen)** Fix placing of comments of yield arguments ([#7858](https://github.com/swc-project/swc/issues/7858)) ([122d14c](https://github.com/swc-project/swc/commit/122d14c0d306d7c437f1ef0f6f375634ff5d7d1a))


- **(es/compat)** Apply transforms for explicit resource management ([#7881](https://github.com/swc-project/swc/issues/7881)) ([3180e68](https://github.com/swc-project/swc/commit/3180e68bf27fb95ff00bd24677ae7e96b3aa6c62))


- **(es/compat)** Make `SwitchCase` handler of `block-scoping` stateless ([#7888](https://github.com/swc-project/swc/issues/7888)) ([4b33d41](https://github.com/swc-project/swc/commit/4b33d41fabf841dfc31c6f44d94e4651239ab667))


- **(es/dep-graph)** Analyze import type children ([#7883](https://github.com/swc-project/swc/issues/7883)) ([057bd5f](https://github.com/swc-project/swc/commit/057bd5f3efe55077a5a8e7f627e80175c8af2bd0))


- **(es/minifier)** Report `is_fn_local` even if var is hoisted ([#7876](https://github.com/swc-project/swc/issues/7876)) ([87a47bf](https://github.com/swc-project/swc/commit/87a47bfb2c602f2ce7eb33f78612197e290518b8))


- **(es/module)** Don't create absolute paths for `jsc.paths` on Windows ([#7892](https://github.com/swc-project/swc/issues/7892)) ([5fbc251](https://github.com/swc-project/swc/commit/5fbc251db1cc1f7973ba780a6c4fc1cdce5ef40d))


- **(swc-info)** Use correct path while getting local package versions ([#7872](https://github.com/swc-project/swc/issues/7872)) ([67afaf1](https://github.com/swc-project/swc/commit/67afaf1f2db087518ac990c71de896c8e5e2a051))

### Features



- **(es)** Add an option to disable builtin transforms ([#7873](https://github.com/swc-project/swc/issues/7873)) ([71d01ec](https://github.com/swc-project/swc/commit/71d01ec12772c2854a47947deceb6d1cab141289))


- **(es/ast)** Support import attributes proposal ([#7868](https://github.com/swc-project/swc/issues/7868)) ([4d3fcb8](https://github.com/swc-project/swc/commit/4d3fcb86e4843cf323a471537cc1ab3a26d054b1))


- **(es/preset-env)** Update data ([#7882](https://github.com/swc-project/swc/issues/7882)) ([a97d8b4](https://github.com/swc-project/swc/commit/a97d8b42b1f85c1f76ffadcabf6e9c85f0458d8d))


- **(swc-info)** Add a CLI to help issue reporting ([#7871](https://github.com/swc-project/swc/issues/7871)) ([d6952ea](https://github.com/swc-project/swc/commit/d6952ea687beb5b9aff1eae26076fa98ac94818b))

### Miscellaneous Tasks



- **(deps)** Update `memchr` ([#7891](https://github.com/swc-project/swc/issues/7891)) ([01cbd6e](https://github.com/swc-project/swc/commit/01cbd6edbd37c95ece7ca20ad2f6c85d6c1b6e35))

### Performance



- **(es/transforms)** Remove wrong parallelism ([#7889](https://github.com/swc-project/swc/issues/7889)) ([a505012](https://github.com/swc-project/swc/commit/a50501255d2a91f2bbc1ce9767689dc4fad540cc))

### Refactor



- **(es/minifier)** Remove `mutated` and `mutation_by_call_count` ([#7890](https://github.com/swc-project/swc/issues/7890)) ([8db968a](https://github.com/swc-project/swc/commit/8db968a25d508a0d28d15d556ad121951f39ae0d))

## [1.3.80] - 2023-08-25

### Bug Fixes



- **(es/module)** Fix logic for exact matches in `jsc.paths` ([#7860](https://github.com/swc-project/swc/issues/7860)) ([52a1ee7](https://github.com/swc-project/swc/commit/52a1ee78da87da760f9923cd8cdb420da855417f))


- **(es/module)** Don't resolve as `node_modules` from `TscResolver` ([#7866](https://github.com/swc-project/swc/issues/7866)) ([11ebae1](https://github.com/swc-project/swc/commit/11ebae1bdd2fbd05d908fa560b81b830dddb3c56))

## [1.3.79] - 2023-08-25

### Bug Fixes



- **(es)** Fix default value of `jsc.minify.format.comments` ([#7853](https://github.com/swc-project/swc/issues/7853)) ([64e51d3](https://github.com/swc-project/swc/commit/64e51d3a28052734d2eaf9992bc8ba578dd5630b))


- **(es/minifier)** Don't inline properties if the var is not `fn-local` ([#7839](https://github.com/swc-project/swc/issues/7839)) ([7fe01e6](https://github.com/swc-project/swc/commit/7fe01e64dd9917d375a4f1cf9661ffaca822c5b3))


- **(es/minifier)** Don't remove exports ([#7856](https://github.com/swc-project/swc/issues/7856)) ([ae8cd94](https://github.com/swc-project/swc/commit/ae8cd9430dd1ec0d857ac7f87ffa4b76258be92c))


- **(es/module)** Make `jsc.paths` work for a nest.js app ([#7852](https://github.com/swc-project/swc/issues/7852)) ([d33a973](https://github.com/swc-project/swc/commit/d33a97303ceeee4069321ef21027ff99fe973a79))

### Features



- **(css/ast)** Support `@scope` at-rule ([#7837](https://github.com/swc-project/swc/issues/7837)) ([a34f359](https://github.com/swc-project/swc/commit/a34f3592b3fd2731b63a5c58c5022e12a403850b))

### Refactor



- **(common)** Mark some methods of `Input` unsafe ([#7848](https://github.com/swc-project/swc/issues/7848)) ([c657324](https://github.com/swc-project/swc/commit/c65732496e4e2aab664b7443a29f5180cba6e965))


- **(es/helpers)** Move packages for monorepo ([#7833](https://github.com/swc-project/swc/issues/7833)) ([1ab406c](https://github.com/swc-project/swc/commit/1ab406cd7aa19ea333a8462b0cd496ceb3e39ac1))


- **(es/minifier)** Pre-calculate `reassigned` ([#7832](https://github.com/swc-project/swc/issues/7832)) ([65db1ba](https://github.com/swc-project/swc/commit/65db1badff3108983fcd59f933e9f87c55d62916))


- **(es/types)** Extract `@swc/types` as a small, reusable package ([#7834](https://github.com/swc-project/swc/issues/7834)) ([f713f1b](https://github.com/swc-project/swc/commit/f713f1b2f6783ed6d85edd6decd87daa473acea0))

## [1.3.78] - 2023-08-17

### Bug Fixes



- **(es/codegen)** Add quotes to property names when `ascii_only` is `true` ([#7820](https://github.com/swc-project/swc/issues/7820)) ([04921f3](https://github.com/swc-project/swc/commit/04921f301afbc2dc74bed4cb24e7656b60e54327))


- **(es/compat)** Remove wrong logic for object patterns in `object_rest` ([#7788](https://github.com/swc-project/swc/issues/7788)) ([3766a7c](https://github.com/swc-project/swc/commit/3766a7c776b63e159be3f11f5f931c5e5f968cdb))


- **(es/minifier)** Preserve `cooked` while compressing template literals ([#7773](https://github.com/swc-project/swc/issues/7773)) ([05990a9](https://github.com/swc-project/swc/commit/05990a98fd3f06a3c03bd1e795800acf22f16035))


- **(es/minifier)** Abort seq inliner if var is not fn_local or reassigned ([#7804](https://github.com/swc-project/swc/issues/7804)) ([f8ca366](https://github.com/swc-project/swc/commit/f8ca366cc179d2d83d35148c3600b8faa2e7f801))


- **(es/minifier)** Preserve more analysis data upon inlining ([#7823](https://github.com/swc-project/swc/issues/7823)) ([31de19e](https://github.com/swc-project/swc/commit/31de19ece22663623b1fc1fe48c90b7aa41e41e0))

### Features



- **(es/module)** Improve error message about relative `jsc.baseUrl` ([#7827](https://github.com/swc-project/swc/issues/7827)) ([9099883](https://github.com/swc-project/swc/commit/9099883175c590106109670de01ab32b33303bfd))

### Refactor



- **(common)** Make `ahash` optional ([#7816](https://github.com/swc-project/swc/issues/7816)) ([981d7b1](https://github.com/swc-project/swc/commit/981d7b152b2f488a67d42052152db22225f1d094))


- **(es/parser)** Remove needless `unsafe` ([#7818](https://github.com/swc-project/swc/issues/7818)) ([8b809db](https://github.com/swc-project/swc/commit/8b809dbe23cab3db2159979cf1852a69c109f1e0))


- Use `ahash` from `swc_common` in more places ([#7815](https://github.com/swc-project/swc/issues/7815)) ([b43e38d](https://github.com/swc-project/swc/commit/b43e38d3f92bc889e263b741dbe173a6f2206d88))

## [1.3.77] - 2023-08-16

### Bug Fixes



- **(es)** Resolve `jsc.baseUrl` for `.swcrc` specified by `--config-file` ([#7801](https://github.com/swc-project/swc/issues/7801)) ([fe1ca26](https://github.com/swc-project/swc/commit/fe1ca26218493d2e7d4121433c365a37e13285e6))


- **(es/compat)** Revert #7610  ([#7813](https://github.com/swc-project/swc/issues/7813)) ([42dec55](https://github.com/swc-project/swc/commit/42dec557ed2e8fd829aba7847b354003cfea1b18))


- **(es/parser)** Revert lexer fix for `<<` ([#7807](https://github.com/swc-project/swc/issues/7807)) ([e527c12](https://github.com/swc-project/swc/commit/e527c12a82740397ed4e909f242326f8e92624a8))

### Features



- **(es/ast)** Expose `Archived` types ([#7811](https://github.com/swc-project/swc/issues/7811)) ([478fa47](https://github.com/swc-project/swc/commit/478fa4736f355555c7a19e7b674db5d7bd81c0e2))

### Refactor



- **(es/parser)** Don't attempt to handle shebangs in `read_token_number_sign` ([#7803](https://github.com/swc-project/swc/issues/7803)) ([5e7834a](https://github.com/swc-project/swc/commit/5e7834aa2ecb0cd01b72979f393a517f1c1e5add))

## [1.3.76] - 2023-08-10

### Bug Fixes



- **(es/ast)** Bump version ([#7793](https://github.com/swc-project/swc/issues/7793)) ([13bedc0](https://github.com/swc-project/swc/commit/13bedc084e46db193b3fd0b7930046b2f013742b))


- **(es/minifier)** Abort seq inliner if a same var is defined in outer scope ([#7772](https://github.com/swc-project/swc/issues/7772)) ([ef8d121](https://github.com/swc-project/swc/commit/ef8d12154ddaad47eddb41298bae14460834be0c))


- **(es/minifier)** Do not drop properties used via `this` ([#7785](https://github.com/swc-project/swc/issues/7785)) ([552d9aa](https://github.com/swc-project/swc/commit/552d9aa344cb6db2dff1e20011411a56f92d4f06))


- **(es/module)** Use `jsc.baseUrl` while resolving absolute paths ([#7775](https://github.com/swc-project/swc/issues/7775)) ([5c4bfa6](https://github.com/swc-project/swc/commit/5c4bfa61f9e4f7732bc1a9da6cd25f52e593a374))

### Features



- **(es/minifier)** Support `mangle.eval` ([#7777](https://github.com/swc-project/swc/issues/7777)) ([eff0cac](https://github.com/swc-project/swc/commit/eff0caca2b6bfd383c8369cf0f4cdad86bb9e575))

### Performance



- **(es/compat)** Improve time complexity of `class_properties` ([#7786](https://github.com/swc-project/swc/issues/7786)) ([76c6258](https://github.com/swc-project/swc/commit/76c6258d1544ede09cb4f281c42e1fc80ad4145b))

## [1.3.75] - 2023-08-08

### Bug Fixes



- **(es/codegen)** Don't strip necessary escape characters ([#7687](https://github.com/swc-project/swc/issues/7687)) ([b45649b](https://github.com/swc-project/swc/commit/b45649b8d6484bd872f6443fc729f6b1998ff44d))


- **(es/compat)** Fix loose mode of the `spread` pass ([#7760](https://github.com/swc-project/swc/issues/7760)) ([b69ae8f](https://github.com/swc-project/swc/commit/b69ae8f433a1702e09a24c1c47b2fc312e8fb801))


- **(es/minifier)** Abort on `Array.slice` with `start >= end` ([#7745](https://github.com/swc-project/swc/issues/7745)) ([36ccbec](https://github.com/swc-project/swc/commit/36ccbec06130a55bc0707a0096a56558a77a1ceb))


- **(es/module)** Fix handling of continuous assignments in `systemjs` ([#7741](https://github.com/swc-project/swc/issues/7741)) ([f713f6a](https://github.com/swc-project/swc/commit/f713f6aba84ffe84bed9dff80a772b0cd78135b8))


- **(es/utils)** Ignore `typeof Id` while preserving side effects ([#7763](https://github.com/swc-project/swc/issues/7763)) ([d57ac0d](https://github.com/swc-project/swc/commit/d57ac0dd28cdefef63a18d53565154e65ee8b838))


- **(plugin/runner)** Use fs cache properly ([#7748](https://github.com/swc-project/swc/issues/7748)) ([1122de7](https://github.com/swc-project/swc/commit/1122de7d8b3c178b4e315bb50a6e214669c37a4f))

### Features



- **(es)** Alias `format` as `output` for `minify()` ([#7746](https://github.com/swc-project/swc/issues/7746)) ([28dfc51](https://github.com/swc-project/swc/commit/28dfc518879b9125a382b48e8310895e137d4fd4))

### Refactor



- **(es/ast)** Avoid `transmute` in impl of `Hash` for `Number` ([#7771](https://github.com/swc-project/swc/issues/7771)) ([2258274](https://github.com/swc-project/swc/commit/225827423355cab8cd3c0ae80f335cd2873e6cd4))


- **(es/minifier)** Support stable rustc ([#7734](https://github.com/swc-project/swc/issues/7734)) ([f7afe7e](https://github.com/swc-project/swc/commit/f7afe7edecc65f41845721c75b77d2f6dba04a6a))


- **(es/parser)** Do not use `lexical` ([#7758](https://github.com/swc-project/swc/issues/7758)) ([e50cfde](https://github.com/swc-project/swc/commit/e50cfde938b2504b723a95f034ac4b388d8725c3))


- **(es/parser)** Do not validate top-level await with target  ([#7774](https://github.com/swc-project/swc/issues/7774)) ([5f97f86](https://github.com/swc-project/swc/commit/5f97f8656f9ff7c42bbf1db95fd9d964c5cc6c7c))

## [1.3.74] - 2023-08-02

### Bug Fixes



- **(es)** Fix typo in a warning ([#7740](https://github.com/swc-project/swc/issues/7740)) ([22e06cc](https://github.com/swc-project/swc/commit/22e06cce630b365b17f390559e065ee48cb3d2b9))


- **(es/minifier)** Mark args of `new`s as references ([#7743](https://github.com/swc-project/swc/issues/7743)) ([3873f58](https://github.com/swc-project/swc/commit/3873f5849999e49b732fef9959cb12ce6159c078))

## [1.3.73] - 2023-08-01

### Bug Fixes



- **(es/minifier)** Handle synthesized export default expression ([#7707](https://github.com/swc-project/swc/issues/7707)) ([5ea6f27](https://github.com/swc-project/swc/commit/5ea6f27eb07df768c6fab2bdff744e402480c53f))


- **(es/utils)** Fix string evaluation of array literals ([#7731](https://github.com/swc-project/swc/issues/7731)) ([e8c58cf](https://github.com/swc-project/swc/commit/e8c58cfd779f7c9dcfae06200ec2f726fbc74758))

### Features



- **(es/preset-env)** Update builtin definitions for `core-js` imports ([#7715](https://github.com/swc-project/swc/issues/7715)) ([b4f3332](https://github.com/swc-project/swc/commit/b4f3332b21fc2b04e9824469568401725d1dfca5))

### Testing



- **(es/compat)** Add a test for optional chaining with loose mode ([#7726](https://github.com/swc-project/swc/issues/7726)) ([216c4f1](https://github.com/swc-project/swc/commit/216c4f17df449847c3cc3a62b9f5694d2416eca1))

## [1.3.72] - 2023-07-28

### Bug Fixes



- **(es/compat)** Fix handling of private members in optional chaining pass ([#7610](https://github.com/swc-project/swc/issues/7610)) ([7ba7b6e](https://github.com/swc-project/swc/commit/7ba7b6ec1fd7170ef7a321a6bd4931984e1a08d4))


- **(es/minifier)** Do not drop used properties ([#7702](https://github.com/swc-project/swc/issues/7702)) ([f901b41](https://github.com/swc-project/swc/commit/f901b417d1a37f679ff4c5a54e81671684d9f485))


- **(es/module)** Do not determine module name for modules without exports in UMD ([#7718](https://github.com/swc-project/swc/issues/7718)) ([40136f7](https://github.com/swc-project/swc/commit/40136f7c54bdc347d5f725549a27e1104433ff36))

### Features



- **(es)** Add a validation for a wrong config ([#7704](https://github.com/swc-project/swc/issues/7704)) ([900701f](https://github.com/swc-project/swc/commit/900701fbf24912dce219f97baa8c11c533966896))


- **(swc_core)** Expose `visit/serde` as serde feature ([#7722](https://github.com/swc-project/swc/issues/7722)) ([2bc9637](https://github.com/swc-project/swc/commit/2bc96373b736ce4d81336c1c0340a1d4f7d7f4b0))

### Refactor



- **(es/parser)** Make `stacker` an optional dependency ([#7720](https://github.com/swc-project/swc/issues/7720)) ([864bdef](https://github.com/swc-project/swc/commit/864bdefbe0012ddbe93075c70f0b2b44577a5424))

## [1.3.71] - 2023-07-25

### Bug Fixes



- **(css/modules)** Preserve attr selectors used with `:global` ([#7670](https://github.com/swc-project/swc/issues/7670)) ([11b4679](https://github.com/swc-project/swc/commit/11b4679231bdfa8662fdcb1dade4dc1146f8e11d))


- **(es/minifier)** Only cast global `Infinity`/`undefined`/`NaN` ([#7684](https://github.com/swc-project/swc/issues/7684)) ([241c04a](https://github.com/swc-project/swc/commit/241c04ab4a2e7e7f34563fdc8a355f82c6ba03e8))


- **(es/minifier)** Drop line comments starting with `!` ([#7689](https://github.com/swc-project/swc/issues/7689)) ([951138c](https://github.com/swc-project/swc/commit/951138cd13339ca7b5cb5305203e466fcd4a0b0e))


- **(es/minifier)** Abort seq inliner using visitor ([#7699](https://github.com/swc-project/swc/issues/7699)) ([a26dbce](https://github.com/swc-project/swc/commit/a26dbce9817c8f39c7d5857bb258298da274c6f3))


- **(es/typescript)** Fix handling of optional chaining ([#7660](https://github.com/swc-project/swc/issues/7660)) ([c017874](https://github.com/swc-project/swc/commit/c01787408522202f3c717c0ecfa8e00aedef9142))

### Features



- **(css/parser)** Support `@starting-style` ([#7677](https://github.com/swc-project/swc/issues/7677)) ([cfb7b51](https://github.com/swc-project/swc/commit/cfb7b511eebe068b3c57f4540b90cb59c922d7e9))

### Refactor



- **(es/minifier)** Respect `toplevel` and `module` options ([#7671](https://github.com/swc-project/swc/issues/7671)) ([9893bd2](https://github.com/swc-project/swc/commit/9893bd2d43de60978dd28c44c8e4032170b11987))


- **(es/minifier)** Respect top-level when invoking IIFE  ([#7690](https://github.com/swc-project/swc/issues/7690)) ([bf72362](https://github.com/swc-project/swc/commit/bf723625b02204c4d2e9228d53ac53c9d41221a1))

## [1.3.70] - 2023-07-18

### Bug Fixes



- **(es/minifier)** Fix a bug about `eval` of name mangler ([#7615](https://github.com/swc-project/swc/issues/7615)) ([6be1f70](https://github.com/swc-project/swc/commit/6be1f7075d8d14cc56b05079ee134153ab65c6fc))


- **(es/minifier)** Do not reuse identifier used for import bindings ([#7639](https://github.com/swc-project/swc/issues/7639)) ([a65be14](https://github.com/swc-project/swc/commit/a65be14a00f41e9b0b4439c31b49febeefd1f845))


- **(es/module)** Skip CJS and AMD transformations for `Script` ([#7661](https://github.com/swc-project/swc/issues/7661)) ([a2d0408](https://github.com/swc-project/swc/commit/a2d040859790d10d445ba6b06e9fe88635d84c1b))

### Features



- **(es/minifier)** Drop recursively used var declaration ([#7649](https://github.com/swc-project/swc/issues/7649)) ([04b0f6d](https://github.com/swc-project/swc/commit/04b0f6d8234bdcc34815a558c4c9eecf24c8e4e7))

### Testing



- **(es)** Add a test for a unreproducible issue ([#7656](https://github.com/swc-project/swc/issues/7656)) ([c0e4805](https://github.com/swc-project/swc/commit/c0e480593f7af001eb329f088dc29ea3f0f8df58))


- **(es/modules)** Add a test for unreproducible issue ([#7655](https://github.com/swc-project/swc/issues/7655)) ([7528de1](https://github.com/swc-project/swc/commit/7528de189780cc6850fad2f744004353c8892a70))

### Buiild



- **(bindings/wasm)** Fix Wasm build ([#7666](https://github.com/swc-project/swc/issues/7666)) ([dc5135f](https://github.com/swc-project/swc/commit/dc5135f43f5fe01ed36c1b40a5647b2f1c3277b4))

## [1.3.69] - 2023-07-13

### Bug Fixes



- **(es/compat)** Visit children of `while` statement in the `generator` pass ([#7624](https://github.com/swc-project/swc/issues/7624)) ([d2ac2c1](https://github.com/swc-project/swc/commit/d2ac2c16a3d9067b3afa14ba6ae8745b553c6642))


- **(es/compat)** Fix loose mode of the `spread` pass ([#7608](https://github.com/swc-project/swc/issues/7608)) ([a7daa5b](https://github.com/swc-project/swc/commit/a7daa5b28e45c0b310850279433178bf75f0f5f0))


- **(es/minifier)** Don't drop unused properties of top-level vars ([#7638](https://github.com/swc-project/swc/issues/7638)) ([19ba714](https://github.com/swc-project/swc/commit/19ba714ea11d6e733cd46ed3ce6b851ddc972e5a))

### Features



- **(es/preset-env)** Update compat data ([#7630](https://github.com/swc-project/swc/issues/7630)) ([7e9e84e](https://github.com/swc-project/swc/commit/7e9e84e2306941de591700d3c5f15da2d43236bb))

### Miscellaneous Tasks



- **(es/parser)** Scope use of `lexical` to certain features ([#7644](https://github.com/swc-project/swc/issues/7644)) ([a961090](https://github.com/swc-project/swc/commit/a961090c9da5994ec83ad6ffca1074277d61431d))

### Refactor



- **(bindings/node)** Remove unused `babelify` type ([#7625](https://github.com/swc-project/swc/issues/7625)) ([73c7769](https://github.com/swc-project/swc/commit/73c77694f11c2b98b6caca5fdd106390e3f82629))

### Build



- **(cargo)** Update `rustc` to `2023-07-03` ([#7623](https://github.com/swc-project/swc/issues/7623)) ([b34f1ad](https://github.com/swc-project/swc/commit/b34f1adbcc0d9556872c05bb6c7a92b77332a924))

## [1.3.68] - 2023-07-05

### Bug Fixes



- **(css/modules)** Fix `:local` and `:global` ([#7600](https://github.com/swc-project/swc/issues/7600)) ([f0ab5b3](https://github.com/swc-project/swc/commit/f0ab5b39f79685023cfc9529bc60e96231ad18d7))


- **(es/compat)** Visit transformed expression in optional chaining pass ([#7614](https://github.com/swc-project/swc/issues/7614)) ([c087c82](https://github.com/swc-project/swc/commit/c087c82aa3131ecafa2e42cdef6ecfba6c80b9b8))


- **(es/fixer)** Don't change default decls to default expr exports ([#7585](https://github.com/swc-project/swc/issues/7585)) ([e272545](https://github.com/swc-project/swc/commit/e2725451aa507c18222c5f66cf0a5a049c92bd0b))


- **(es/minifier)** Add usage to inlined ident eagerly ([#7597](https://github.com/swc-project/swc/issues/7597)) ([4f866de](https://github.com/swc-project/swc/commit/4f866de8788558a4f9f3e3f889048136c7896ee3))


- **(es/parser)** Re-lex `<<` as two `<`-s if required ([#7439](https://github.com/swc-project/swc/issues/7439)) ([6850372](https://github.com/swc-project/swc/commit/68503726a78cfc37cd995eda69a3e8982b6fdf57))


- **(plugin/runner)** Disable wasi env cleanup ([#7607](https://github.com/swc-project/swc/issues/7607)) ([8209594](https://github.com/swc-project/swc/commit/8209594a8c11d2a65061763fef5d3a7780976f39))


- **(xml/codegen)** Fix wrong minification of spaces in a self-closing tag ([#7595](https://github.com/swc-project/swc/issues/7595)) ([769d651](https://github.com/swc-project/swc/commit/769d6516a50796e6642d6724e8472dd32d871612))

### Features



- **(es/compat)** Implement transform for explicit resource management ([#7376](https://github.com/swc-project/swc/issues/7376)) ([bcd5a1d](https://github.com/swc-project/swc/commit/bcd5a1d6665bc6f4aaa857d1f88b0da82a6c4a04))


- **(es/minifier)** Drop unused properties ([#7534](https://github.com/swc-project/swc/issues/7534)) ([47d2edd](https://github.com/swc-project/swc/commit/47d2edd4dc448a611396006852f30e2b8de1c42c))


- **(es/minifier)** Compress common sub expressions in sequences ([#7587](https://github.com/swc-project/swc/issues/7587)) ([ff1ad95](https://github.com/swc-project/swc/commit/ff1ad95b59732282c014474609bbb405e0f9edb4))


- **(es/optimization)** Support `default` imports for const modules ([#7604](https://github.com/swc-project/swc/issues/7604)) ([ac02b84](https://github.com/swc-project/swc/commit/ac02b84918932f2d51840b4c4cef9adf460fce40))

### Refactor



- **(es/compat)** Remove usage of `box_patterns` ([#7613](https://github.com/swc-project/swc/issues/7613)) ([0a26066](https://github.com/swc-project/swc/commit/0a26066b7b01d06a6d9e3df2ab7c7e47f4aa9e4c))

## [1.3.67] - 2023-06-29

### Bug Fixes



- **(es/minifier)** Don't drop assignments to unused top-level variables ([#7581](https://github.com/swc-project/swc/issues/7581)) ([a685c88](https://github.com/swc-project/swc/commit/a685c88c61248e5bff98fb339a71b40b8fd4e528))


- **(es/parser)** Adjust context while parsing type arguments of TypeScript type queries ([#7582](https://github.com/swc-project/swc/issues/7582)) ([9d5dda1](https://github.com/swc-project/swc/commit/9d5dda12991dac031064b139eb61d2d03dcd8571))


- **(estree/compat)** Adjust `loc.col` ([#7565](https://github.com/swc-project/swc/issues/7565)) ([d86f8f6](https://github.com/swc-project/swc/commit/d86f8f6a3c1f6ad5de3078ade5c8a905f7067f24))

### Features



- **(es/minifier)** Support `__NO_SIDE_EFFECTS__` ([#7532](https://github.com/swc-project/swc/issues/7532)) ([3ad07a7](https://github.com/swc-project/swc/commit/3ad07a7d2e5c9507a786dc338f0cf50191916aa3))


- **(es/minifier)** Enable `hoist_props` by default ([#7535](https://github.com/swc-project/swc/issues/7535)) ([07a8580](https://github.com/swc-project/swc/commit/07a858030c1a368b3152bfdb57471a35c47c3b32))


- **(es/minifier)** Inline constants even if they are exported ([#7583](https://github.com/swc-project/swc/issues/7583)) ([398e922](https://github.com/swc-project/swc/commit/398e922ca0214e03556bb84fe632e5e03badd533))


- **(plugin/runner)** Update `wasmer` to `v4` ([#7576](https://github.com/swc-project/swc/issues/7576)) ([ab7b17c](https://github.com/swc-project/swc/commit/ab7b17cf106620caa1ba46adf23e6013cc4d6288))


- **(plugin/runner)** Share runtime `Engine` ([#7590](https://github.com/swc-project/swc/issues/7590)) ([9512ea3](https://github.com/swc-project/swc/commit/9512ea31ff1bb0c70f4f96a620b429fa01f48e0c))


- **(testing)** Add `CARGO_TARGET_DIR` and use it from other crates ([#7552](https://github.com/swc-project/swc/issues/7552)) ([46fb461](https://github.com/swc-project/swc/commit/46fb4619bafd56dfa3edd9064c1fe2ae4b6b78de))

### Refactor



- **(common)** Remove `add_bitflags` and update `bitflags` ([#7571](https://github.com/swc-project/swc/issues/7571)) ([95ac74e](https://github.com/swc-project/swc/commit/95ac74e6e494afc90f32c8fc9add2b1824f25db5))

### Build



- **(cargo)** Update deps ([#7564](https://github.com/swc-project/swc/issues/7564)) ([d12dc70](https://github.com/swc-project/swc/commit/d12dc70c9108d5863e0ca2e4f05f4aefcfb4380e))


- **(cargo)** Update deps ([#7566](https://github.com/swc-project/swc/issues/7566)) ([d57d0d3](https://github.com/swc-project/swc/commit/d57d0d3ad3f8ce7ed449eec5896eb2f10b83a930))


- **(deps)** Update `syn` to `v2` ([#7557](https://github.com/swc-project/swc/issues/7557)) ([5441004](https://github.com/swc-project/swc/commit/54410047fa7ccb1330fb2e9db27a3c0b2a24a02e))

## [1.3.66] - 2023-06-20

### Bug Fixes



- **(es)** Accept `parse` option for `minify()` ([#7543](https://github.com/swc-project/swc/issues/7543)) ([1d84e95](https://github.com/swc-project/swc/commit/1d84e952feefc3cd50e379455bb6648b82c42256))


- **(es/compat)** Visit arrow body from optional chaining pass ([#7549](https://github.com/swc-project/swc/issues/7549)) ([bc6e950](https://github.com/swc-project/swc/commit/bc6e95052eaf60d71c544c8a88c8440d7a2b437c))


- **(es/preset-env)** Don't log `Yield` to the console ([#7548](https://github.com/swc-project/swc/issues/7548)) ([8cfc4f9](https://github.com/swc-project/swc/commit/8cfc4f9e9ab43a5ed25c9b600b9dd7e5790c2d1e))


- **(es/resolver)** Resolve the super class before registering a class name ([#7550](https://github.com/swc-project/swc/issues/7550)) ([1d9f972](https://github.com/swc-project/swc/commit/1d9f972fb44e0722fce8a83090cbada81decf577))

### Features



- **(es/codegen)** Support `preamble` ([#7551](https://github.com/swc-project/swc/issues/7551)) ([6e5d8b3](https://github.com/swc-project/swc/commit/6e5d8b3cf1af74d614d5c073d966da543c26e302))

### Testing



- **(es)** Add a test for a wrong issue ([#7542](https://github.com/swc-project/swc/issues/7542)) ([70bc605](https://github.com/swc-project/swc/commit/70bc605c6769759b0e896e7e5e91bb070d719552))


- **(es)** Add one more test for a wrong issue ([#7545](https://github.com/swc-project/swc/issues/7545)) ([862f095](https://github.com/swc-project/swc/commit/862f095e656edf6c0e86f1ad8065d8095e162cfa))


- **(plugin/runner)** Share `target` directory ([#7544](https://github.com/swc-project/swc/issues/7544)) ([aa82e5f](https://github.com/swc-project/swc/commit/aa82e5fff3452db38599bb0bf7fef7cd72b6a09f))

## [1.3.65] - 2023-06-19

### Bug Fixes



- **(es/compat)** Fix optional chaining ([#7530](https://github.com/swc-project/swc/issues/7530)) ([990e48e](https://github.com/swc-project/swc/commit/990e48e0e81c339b42b0bf33b62a6f7126b0e2e8))


- **(es/module)** Add `"use strict"` while preserving directives ([#7537](https://github.com/swc-project/swc/issues/7537)) ([f42fdd2](https://github.com/swc-project/swc/commit/f42fdd21afad775358138c3aaed4ff3c41bfb16a))


- **(es/typescript)** Don't panic of `@jsxFrag null` ([#7540](https://github.com/swc-project/swc/issues/7540)) ([76aa91f](https://github.com/swc-project/swc/commit/76aa91f83cf37a11aa55feba40d6f73819fc811d))

### Features



- **(es/module)** Preserve custom `use` directives ([#7528](https://github.com/swc-project/swc/issues/7528)) ([3e9dd88](https://github.com/swc-project/swc/commit/3e9dd88e37fcb99293a3683ea7a62214950f7860))

## [1.3.64] - 2023-06-14

### Bug Fixes



- **(es/codegen)** Emit type arguments of jsx element names ([#7522](https://github.com/swc-project/swc/issues/7522)) ([a0da02d](https://github.com/swc-project/swc/commit/a0da02d0ff641863dafc1a7d573419478c3b16dc))


- **(es/codegen)** Fix regression of source maps ([#7523](https://github.com/swc-project/swc/issues/7523)) ([f27838d](https://github.com/swc-project/swc/commit/f27838dedcac792ac30380f45ef89b329221de59))


- **(es/compat)** Fix handling of `this` of optional chaining pass ([#7527](https://github.com/swc-project/swc/issues/7527)) ([4644d00](https://github.com/swc-project/swc/commit/4644d005d2ca06ad002dc7c6ff6c4d19e1734970))

## [1.3.63] - 2023-06-13

### Bug Fixes



- **(es/codegen)** Remove extra spaces in `AssignPatProp` and `KeyValuePatProp` ([#7488](https://github.com/swc-project/swc/issues/7488)) ([064bcf4](https://github.com/swc-project/swc/commit/064bcf4854f8505f04b40b72da1becec0c531a7d))


- **(es/compat)** Make stage 3 decorator pass use correct state for inner classes ([#7508](https://github.com/swc-project/swc/issues/7508)) ([cc4146c](https://github.com/swc-project/swc/commit/cc4146c9d3a21514031e46003170a3fdaac1987a))


- **(es/minifier)** Infect mutation when assigning a property ([#7503](https://github.com/swc-project/swc/issues/7503)) ([7f9f0b8](https://github.com/swc-project/swc/commit/7f9f0b8bcebc26eed1354ce2901aabd61261f434))


- **(es/react)** Default to empty string when emitting refresh signature ([#7514](https://github.com/swc-project/swc/issues/7514)) ([8e933c8](https://github.com/swc-project/swc/commit/8e933c8a9fdf8867deb7f0d108b99430949aad54))

### Features



- **(es/codegen)** Add ability to set indentation string via rust api ([#7494](https://github.com/swc-project/swc/issues/7494)) ([a343e7c](https://github.com/swc-project/swc/commit/a343e7ccae4e88d9e3941beedf63b61bd0512c3d))


- **(es/minifier)** Remove unused labels ([#7478](https://github.com/swc-project/swc/issues/7478)) ([62075fa](https://github.com/swc-project/swc/commit/62075faeaada8d9df3c7d849bbcfda8ff0c5d79f))


- **(es/parser)** Disallow tagged tpl in optional chaining ([#7515](https://github.com/swc-project/swc/issues/7515)) ([6c00a24](https://github.com/swc-project/swc/commit/6c00a2422addf0e402bb221e80f6f8acad839b28))


- **(plugin/runner)** Support shared wasix runtime ([#7504](https://github.com/swc-project/swc/issues/7504)) ([73929fc](https://github.com/swc-project/swc/commit/73929fc43c34fd4545bd292fbf0f6d7de35fbee9))

### Performance



- **(css/prefixer)** Convert macro to a function call to reduce binary size ([#7507](https://github.com/swc-project/swc/issues/7507)) ([d545df6](https://github.com/swc-project/swc/commit/d545df6dd951fa2f5756830c40c21ae251e4e634))


- **(es)** Use `&dyn Comments` to reduce binary size ([#7489](https://github.com/swc-project/swc/issues/7489)) ([2c3ac68](https://github.com/swc-project/swc/commit/2c3ac682e271dad0ab6e82c14ad14f06715d853b))


- **(es)** Use `&dyn Comments` for jsx and TypeScript ([#7490](https://github.com/swc-project/swc/issues/7490)) ([abd62bc](https://github.com/swc-project/swc/commit/abd62bc797175d783d18d162301c851eefa7ac23))

### Refactor



- **(es/ast)** Reimplement optional chaining ([#7441](https://github.com/swc-project/swc/issues/7441)) ([aa83584](https://github.com/swc-project/swc/commit/aa83584634286d7c741d903ad94ba5228c89bc62))


- **(es/ast)** Remove unused fields ([#7518](https://github.com/swc-project/swc/issues/7518)) ([3958f17](https://github.com/swc-project/swc/commit/3958f1792c4598e965f36a11c567c95f69984a9f))

## [1.3.62] - 2023-06-03

### Bug Fixes



- **(es/minifier)** Don't generate generator arrows ([#7466](https://github.com/swc-project/swc/issues/7466)) ([e506635](https://github.com/swc-project/swc/commit/e506635f74e38cb7eb88a2fa540d8c4f71c7323a))

### Performance



- **(bindings)** Enable `share-generics` to reduce binary size ([#7482](https://github.com/swc-project/swc/issues/7482)) ([d623db4](https://github.com/swc-project/swc/commit/d623db48dedf08f32bf7a2afbf71cd1aed27d30a))


- **(es/minifier)** Make minifier not overly generic ([#7483](https://github.com/swc-project/swc/issues/7483)) ([65ce5d1](https://github.com/swc-project/swc/commit/65ce5d1081271f1cb4db6d4537311fbb60a08359))

## [1.3.61] - 2023-05-30

### Bug Fixes



- **(css/modules)** Don't drop the correct selector ([#7450](https://github.com/swc-project/swc/issues/7450)) ([d370324](https://github.com/swc-project/swc/commit/d370324cfd251af49853fe887644fcaa8d811431))


- **(es/codegen)** Emit `;` for `TsImportEqualsDecl` ([#7464](https://github.com/swc-project/swc/issues/7464)) ([3935d02](https://github.com/swc-project/swc/commit/3935d02e365c2fcfdf517fe6dc5943f4ba2616cd))


- **(es/parser)** Fix parsing of generic jsx element name ([#7449](https://github.com/swc-project/swc/issues/7449)) ([77850dd](https://github.com/swc-project/swc/commit/77850dd8f01f51af1e9dda3eabddd07b7e39c841))


- **(plugin/runner)** Disable `wasi_env` cleanup ([#7458](https://github.com/swc-project/swc/issues/7458)) ([1868d36](https://github.com/swc-project/swc/commit/1868d36cfed54e48c3439ec4547251e45731c93a))

### Features



- **(common)** Enable bytecheck for missing structs ([#7465](https://github.com/swc-project/swc/issues/7465)) ([56ac9eb](https://github.com/swc-project/swc/commit/56ac9eb6b3c8cc379ee4ccf55d6130e39aa641b8))


- **(es/minifier)** Inline for loop variables ([#7445](https://github.com/swc-project/swc/issues/7445)) ([0cd2b61](https://github.com/swc-project/swc/commit/0cd2b61b054031f1a49cae25a82925d52dff0a73))

### Miscellaneous Tasks



- **(es/preset-env)** Update data ([#7459](https://github.com/swc-project/swc/issues/7459)) ([e15adaf](https://github.com/swc-project/swc/commit/e15adaf6eaada62b6a3c1b8447fb39612dee7946))

### Testing



- **(es/parser)** Add a test for a fixed issue ([#7467](https://github.com/swc-project/swc/issues/7467)) ([8274cce](https://github.com/swc-project/swc/commit/8274cce9a7d0aca8d005a215b46f7db9ed7c5aed))

## [1.3.60] - 2023-05-25

### Bug Fixes



- **(es)** Init filesystem cache only if plugin exists ([#7436](https://github.com/swc-project/swc/issues/7436)) ([786cf3a](https://github.com/swc-project/swc/commit/786cf3a10ffe5e2990c5473062ea42771b769124))


- **(es)** Ignore input sourcemap error ([#7446](https://github.com/swc-project/swc/issues/7446)) ([0c92e53](https://github.com/swc-project/swc/commit/0c92e534a5e3ccc74077ac03c473ad2c12fd5349))


- **(es/compat)** Fix destructuring handling of `block_scoping` ([#7425](https://github.com/swc-project/swc/issues/7425)) ([66d52ec](https://github.com/swc-project/swc/commit/66d52ec849f3ed2b33db0a3738f5692cb8fa2400))


- **(es/compat)** Fix stage 3 decorator pass ([#7392](https://github.com/swc-project/swc/issues/7392)) ([97d0f79](https://github.com/swc-project/swc/commit/97d0f79142ec8ac6d1795b5c56cc565ca9b0a085))


- **(es/compat)** Fix variable scoping of object rest pass. ([#7437](https://github.com/swc-project/swc/issues/7437)) ([f3d660f](https://github.com/swc-project/swc/commit/f3d660f972a9fef7ee0783125655c4873a5d43fe))


- **(es/parser)** Reset class context ([#7433](https://github.com/swc-project/swc/issues/7433)) ([1cab43f](https://github.com/swc-project/swc/commit/1cab43f17deb35ef7e9a4b2c229327edc0f87756))


- **(es/parser)** Allow using `package` as a parameter name in interface ([#7438](https://github.com/swc-project/swc/issues/7438)) ([33a922b](https://github.com/swc-project/swc/commit/33a922b6f8c8362b46fe8547e9d327a4d82520a4))


- **(es/parser)** Fix parsing of tsx with a type annotation in a conditional expression ([#7440](https://github.com/swc-project/swc/issues/7440)) ([a37d59a](https://github.com/swc-project/swc/commit/a37d59a134b2a046b50bb5e70c694130227e0d9e))


- **(es/preset-env)** Fix pass ordering ([#7434](https://github.com/swc-project/swc/issues/7434)) ([2071f89](https://github.com/swc-project/swc/commit/2071f89d4eea7ae311b05457650e2f42c1b503ef))


- **(swc_core)** Correctly expose plugin with host ([#7427](https://github.com/swc-project/swc/issues/7427)) ([558ca40](https://github.com/swc-project/swc/commit/558ca40b99bd3e9ac9a1742223dd9d3ef84061cb))

### Features



- **(plugin/runner)** Enable in-memory precompiled module cache ([#7420](https://github.com/swc-project/swc/issues/7420)) ([f8fe365](https://github.com/swc-project/swc/commit/f8fe365c3b888bbe49e011a616b6926c9ef24fa2))

### Refactor



- **(plugin/runner)** Add attributes to the module bytes ([#7419](https://github.com/swc-project/swc/issues/7419)) ([c03a74c](https://github.com/swc-project/swc/commit/c03a74c19819cb0cfc8a47cd9b2c1e558355d40d))


- **(swc_core)** Make `common_plugin_transform` agnostic to mode ([#7422](https://github.com/swc-project/swc/issues/7422)) ([cfdd407](https://github.com/swc-project/swc/commit/cfdd40789673eef32a9b9365456860a7cb511000))


- **(visit)** Reduce expanded LOCs ([#7442](https://github.com/swc-project/swc/issues/7442)) ([e83368e](https://github.com/swc-project/swc/commit/e83368e5744ebabab8537cb979a374ecbc2e7d95))

## [1.3.59] - 2023-05-19

### Bug Fixes



- **(common)** Disable `tracing/release_max_level_info` ([#7401](https://github.com/swc-project/swc/issues/7401)) ([95291f2](https://github.com/swc-project/swc/commit/95291f2c5daaf039623b4db4668a91104c0c0124))


- **(es/codegen)** Do not create duplicate source map entry ([#7309](https://github.com/swc-project/swc/issues/7309)) ([40ba242](https://github.com/swc-project/swc/commit/40ba242076f9c39cd19fe2a040fdf10867c67b9f))


- **(es/compat)** Mark reserved function names private ([#7298](https://github.com/swc-project/swc/issues/7298)) ([dba78a0](https://github.com/swc-project/swc/commit/dba78a0031b97a4c152b506ae2072438cdba92b2))


- **(es/minifier)** Mark all function params as potential property mutation ([#7409](https://github.com/swc-project/swc/issues/7409)) ([5dbbbea](https://github.com/swc-project/swc/commit/5dbbbea2efb84e7f187859ba03fd548af92c613f))


- **(es/minifier)** Prevent inlining vars assigned outside current function scope ([#7414](https://github.com/swc-project/swc/issues/7414)) ([40d2bf7](https://github.com/swc-project/swc/commit/40d2bf7ec3ac58364a8389d2d2284c8089e74fae))


- **(es/parser)** Fix parsing of `module` identifier ([#7400](https://github.com/swc-project/swc/issues/7400)) ([1d3f320](https://github.com/swc-project/swc/commit/1d3f32056c7a63b327b2ccf6131479f851a2e870))


- **(es/parser)** Fix parsing of `>` in typescript mode ([#7407](https://github.com/swc-project/swc/issues/7407)) ([57ad722](https://github.com/swc-project/swc/commit/57ad722d06084671ef18f4eb1dae53afbb737c3d))

### Miscellaneous Tasks



- **(plugin)** Update `rkyv` to `v0.7.42` ([#7397](https://github.com/swc-project/swc/issues/7397)) ([3a0565f](https://github.com/swc-project/swc/commit/3a0565f3778648f2ae57043c8e1bf8c15832b61e))

### Refactor



- **(plugin/runner)** Revise cache, module loading ([#7408](https://github.com/swc-project/swc/issues/7408)) ([ac5ab60](https://github.com/swc-project/swc/commit/ac5ab607c94d418dde0ceb4f303cb7d432551565))

### Testing



- **(css/module)** Add a test for a fixed issue ([#7399](https://github.com/swc-project/swc/issues/7399)) ([6b92eec](https://github.com/swc-project/swc/commit/6b92eecd398e94a8d58b6b5e49679f7977a17703))


- **(es/minifier)** Enable more terser tests ([#7396](https://github.com/swc-project/swc/issues/7396)) ([f9cdd74](https://github.com/swc-project/swc/commit/f9cdd741c288bee59aa9120b0a5c6f7ca284bd31))


- **(es/parser)** Add a test for a fixed issue ([#7398](https://github.com/swc-project/swc/issues/7398)) ([eaba323](https://github.com/swc-project/swc/commit/eaba323581d2aa2b578c600f44f9b41b103d35b3))

## [1.3.58] - 2023-05-15

### Bug Fixes



- **(es/minifier)** Fix remapping of vars upon inlining ([#7362](https://github.com/swc-project/swc/issues/7362)) ([1dced17](https://github.com/swc-project/swc/commit/1dced17998a625e30d4a8ef653aef9e2caa7627d))


- **(es/parser)** Fix `>=` with type instantiate ([#7388](https://github.com/swc-project/swc/issues/7388)) ([fa7a352](https://github.com/swc-project/swc/commit/fa7a3521f531caa32439fa6f4c338a2a7d859e05))

### Features



- **(es/compat)** Partially support auto accessors ([#7364](https://github.com/swc-project/swc/issues/7364)) ([97ec259](https://github.com/swc-project/swc/commit/97ec25914451d931918287591d8d3f08648a65b9))


- **(es/compat)** Implement auto accessors fully ([#7370](https://github.com/swc-project/swc/issues/7370)) ([cad18fa](https://github.com/swc-project/swc/commit/cad18fae4b93a916ad2c45b8741e08baeea78b98))


- **(es/parser)** Implement explicit resource management ([#7322](https://github.com/swc-project/swc/issues/7322)) ([041b491](https://github.com/swc-project/swc/commit/041b49146627000971ef05f60e11f916182c67f1))


- **(plugin)** Add versioned wrapper struct ([#7382](https://github.com/swc-project/swc/issues/7382)) ([bba1fad](https://github.com/swc-project/swc/commit/bba1fad35ceda0011e0cd427c670209ac4eb6ed2))


- **(swc_core)** Allow native env plugin to use memory cache ([#7390](https://github.com/swc-project/swc/issues/7390)) ([e3868a7](https://github.com/swc-project/swc/commit/e3868a7e00bfb5d7a4677b8be0b64a87e9bf200d))


- **(swc_core)** Expose plugin proxy to the host env ([#7391](https://github.com/swc-project/swc/issues/7391)) ([05b4c11](https://github.com/swc-project/swc/commit/05b4c1149781ab1f69a93a54a462413af2603a3a))

### Miscellaneous Tasks



- **(es)** Enable tracing spans for release builds ([#7379](https://github.com/swc-project/swc/issues/7379)) ([166e77c](https://github.com/swc-project/swc/commit/166e77c2b39b4390bb09f3a93f58148a5de40efa))

### Refactor



- **(common)** Derive `ByteCheck` for `ArcString` ([#7380](https://github.com/swc-project/swc/issues/7380)) ([9b3a41c](https://github.com/swc-project/swc/commit/9b3a41c57df4ead8e64c33ee247e8cd029792b16))

## [1.3.57] - 2023-05-09

### Bug Fixes



- **(es/compat)** Fix `is_setter` in `parameters` pass ([#7348](https://github.com/swc-project/swc/issues/7348)) ([e0de83e](https://github.com/swc-project/swc/commit/e0de83e862f7de765ba804e8c31a16660d7186b5))


- **(xml/codegen)** Escape `<` and `>` in child ([#7351](https://github.com/swc-project/swc/issues/7351)) ([b180d09](https://github.com/swc-project/swc/commit/b180d09e1dd9c4269d7d690d892ef4fd1c5b6563))

### Features



- **(es/compat)** Support `export class` from stage 3 decorator pass ([#7363](https://github.com/swc-project/swc/issues/7363)) ([9c052db](https://github.com/swc-project/swc/commit/9c052db796473a4a7253d643426a7c2c765d9640))


- **(plugin)** Enable bytecheck ([#7280](https://github.com/swc-project/swc/issues/7280)) ([d2c1f45](https://github.com/swc-project/swc/commit/d2c1f45f5a1a1d72fa6d6fa28bd84f242d5aff81))

### Refactor



- **(plugin/runner)** Refine cache location ([#7346](https://github.com/swc-project/swc/issues/7346)) ([91a3fbe](https://github.com/swc-project/swc/commit/91a3fbe460799ed604c2b43b4facaed60cfd6c87))

### Build



- **(cargo)** Update `wasmer` to `v3.3` ([#7352](https://github.com/swc-project/swc/issues/7352)) ([4e278be](https://github.com/swc-project/swc/commit/4e278befcf0071619ee583ffa7c8357ea4fd5c2f))

## [1.3.56] - 2023-04-29

### Bug Fixes



- **(es/codegen)** Emit type arguments for call expressions ([#7335](https://github.com/swc-project/swc/issues/7335)) ([7e99e5f](https://github.com/swc-project/swc/commit/7e99e5fd2c3d15aba6bf29958bd9305e29312e6a))


- **(es/parser)** Parse decorators after `export` ([#7340](https://github.com/swc-project/swc/issues/7340)) ([985f0ca](https://github.com/swc-project/swc/commit/985f0cad06b9de5f9e98bed3ad62769e0f3c7528))


- **(es/typescript)** Fix typescript strip pass ([#7342](https://github.com/swc-project/swc/issues/7342)) ([d061d29](https://github.com/swc-project/swc/commit/d061d295ff2ca6ebb03d9c62c367f42f7186c2d7))


- **(plugin/runner)** Revert #7341 ([#7344](https://github.com/swc-project/swc/issues/7344)) ([d6999ba](https://github.com/swc-project/swc/commit/d6999ba1ac454a1617bab00c740d99f81ff1a18d))

### Features



- **(es/minifier)** Drop expressions using sequential inliner ([#6936](https://github.com/swc-project/swc/issues/6936)) ([246300a](https://github.com/swc-project/swc/commit/246300ae25be0cfdbbb266e02f80d06013a96d85))


- **(plugin/runner)** Improve caching ([#7341](https://github.com/swc-project/swc/issues/7341)) ([245163a](https://github.com/swc-project/swc/commit/245163a77827767ab0b4df59d00597c4af62d745))

## [1.3.55] - 2023-04-25

### Bug Fixes



- **(es/helpers)** Add `src/*.mjs` entry back ([#7328](https://github.com/swc-project/swc/issues/7328)) ([84af855](https://github.com/swc-project/swc/commit/84af85563f91a9593e0eb319f46c49c1d4cf7895))

### Features



- **(es/module)** Add `export_interop_annotation` flag ([#7330](https://github.com/swc-project/swc/issues/7330)) ([caee073](https://github.com/swc-project/swc/commit/caee073935a9abb08f0b5e2e0e9160d80064995b))

## [1.3.54] - 2023-04-25

### Bug Fixes



- **(bindings/node)** Support `TsSatisfiesExpression` ([#7317](https://github.com/swc-project/swc/issues/7317)) ([761ef83](https://github.com/swc-project/swc/commit/761ef8389dd000e465bd385ec925654a8cb2ae09))


- **(common)** Workaround the `Arc` and `rkyv` issue ([#7321](https://github.com/swc-project/swc/issues/7321)) ([577f81e](https://github.com/swc-project/swc/commit/577f81ec405f4f3a3e58e3f97c07d3720dd80912))


- **(es/codegen)** Fix codegen of `TsModuleDecl` ([#7319](https://github.com/swc-project/swc/issues/7319)) ([0ca05d8](https://github.com/swc-project/swc/commit/0ca05d8b69b6301e2346e5de6c45a77c863676e9))


- **(es/compat)** Transform curried function call with optional chaining ([#7313](https://github.com/swc-project/swc/issues/7313)) ([66b5b11](https://github.com/swc-project/swc/commit/66b5b110bf94259e0e0223224940bb8d0384e9b6))

### Testing



- **(es)** Update tsc test suite ([#7323](https://github.com/swc-project/swc/issues/7323)) ([603f22d](https://github.com/swc-project/swc/commit/603f22de76eaeac1a64ee5e5f2e1dd095f908604))

## [1.3.53] - 2023-04-21

### Bug Fixes



- **(es)** Fix a crash related to source map ([#7307](https://github.com/swc-project/swc/issues/7307)) ([e7f7b01](https://github.com/swc-project/swc/commit/e7f7b01f59b622c993ee584ae825a39c390b2570))


- **(es/helpers)** Remove unnecessary parameters in `helper_expr!` macro ([#7296](https://github.com/swc-project/swc/issues/7296)) ([38dfb91](https://github.com/swc-project/swc/commit/38dfb91ebc04eecab97ec023c79b183958fda227))


- **(es/modules)** Support `jsc.baseUrl` without `jsc.paths` ([#7302](https://github.com/swc-project/swc/issues/7302)) ([9c279b8](https://github.com/swc-project/swc/commit/9c279b802b6a615fdba33a6f81866ce3ef606676))


- **(es/parser)** Fix handling of `in` and `out` of typescript ([#7308](https://github.com/swc-project/swc/issues/7308)) ([6f81cb9](https://github.com/swc-project/swc/commit/6f81cb9c32219cd8e51a97c924e0b272fc25a0c1))


- **(testing)** Fix path normalization on windows for testing diffs ([#7299](https://github.com/swc-project/swc/issues/7299)) ([3422923](https://github.com/swc-project/swc/commit/3422923cb004111f8c57501bb8b222905cf6bd09))

### Testing



- **(es/compat)** Add a test for a wrong issue ([#7300](https://github.com/swc-project/swc/issues/7300)) ([38495a9](https://github.com/swc-project/swc/commit/38495a9835c47ded30d07d6c961a094e22146222))

## [1.3.52] - 2023-04-19

### Bug Fixes



- **(es/minifier)** Fix a inliner bug related to `Script` ([#7288](https://github.com/swc-project/swc/issues/7288)) ([0aab90c](https://github.com/swc-project/swc/commit/0aab90c005b29b9fced96a04b84a49fe2298560e))


- **(es/resolver)** Hoist parameter in arrow and constructor ([#7292](https://github.com/swc-project/swc/issues/7292)) ([7a00f2e](https://github.com/swc-project/swc/commit/7a00f2e95412b7dcbe9ce3b32d8b299104b2f5c5))

### Performance



- **(es/react)** Don't use regex ([#7284](https://github.com/swc-project/swc/issues/7284)) ([248fd37](https://github.com/swc-project/swc/commit/248fd374e66bf33c3d40eff1fe2ab2d584aec507))


- **(preset-env)** Update static map ([#7293](https://github.com/swc-project/swc/issues/7293)) ([bc83cb2](https://github.com/swc-project/swc/commit/bc83cb2ecfcfcec0fef0e0b2f2450746ada4628c))

### Build



- **(cargo)** Bump up wasmer ([#7294](https://github.com/swc-project/swc/issues/7294)) ([39d415c](https://github.com/swc-project/swc/commit/39d415cc1623456255dc2c7b87594f7fd00ab87b))

## [1.3.51] - 2023-04-16

### Bug Fixes



- **(es)** Allow extra comments after `sourceMappingURL` ([#7262](https://github.com/swc-project/swc/issues/7262)) ([219a738](https://github.com/swc-project/swc/commit/219a738a752e44bcbf5681f2f77766f5581439c3))


- **(es/helpers)** Do not duplicate property names ([#7266](https://github.com/swc-project/swc/issues/7266)) ([30a4e52](https://github.com/swc-project/swc/commit/30a4e52f74e9c2e6f919f41930f79b4a0c3eab76))


- **(es/loader)** Fix browser overwrites not applying correctly ([#7243](https://github.com/swc-project/swc/issues/7243)) ([beefdd4](https://github.com/swc-project/swc/commit/beefdd459c1bdd96bcd5c83f8dc2e4c4c1be695d))


- **(es/minifier)** Use UTF16 length for `str.length` ([#7275](https://github.com/swc-project/swc/issues/7275)) ([4c06a56](https://github.com/swc-project/swc/commit/4c06a56e52184796280d9c19975f5317f3050cc9))


- **(es/renamer)** Ensure that param and function body are in same scope ([#7271](https://github.com/swc-project/swc/issues/7271)) ([93a264c](https://github.com/swc-project/swc/commit/93a264c9a4c8329eddbf02c02c979d5dee3f02b5))

### Features



- **(es/modules)** Use function instead of arrow function unconditionally ([#7273](https://github.com/swc-project/swc/issues/7273)) ([5d3313a](https://github.com/swc-project/swc/commit/5d3313aa7e696a5c4c28e513062b8ba92bd40e5f))

### Refactor



- **(es/parser)** Remove `::` token as it's not used ([#7268](https://github.com/swc-project/swc/issues/7268)) ([635bf81](https://github.com/swc-project/swc/commit/635bf8116bb002d5d737f0e9dfbf5efd3a433e7d))

### Build



- **(cargo)** Update `bitflags` to v2 ([#7270](https://github.com/swc-project/swc/issues/7270)) ([c4cce12](https://github.com/swc-project/swc/commit/c4cce127587e304b938c43059992ff0ed6bd2821))

## [1.3.50] - 2023-04-13

### Bug Fixes



- **(es)** Fix a crash related to an empty source map ([#7229](https://github.com/swc-project/swc/issues/7229)) ([c665918](https://github.com/swc-project/swc/commit/c6659183a616725b61733e584bbb6e540b9cbbde))


- **(es/codegen)** Respect `ascii_only` for identifiers ([#7247](https://github.com/swc-project/swc/issues/7247)) ([e35097f](https://github.com/swc-project/swc/commit/e35097fd8c036dfab9fcf923f01db562b003720b))


- **(es/compat)** Handle export function in `reserved_word` ([#7251](https://github.com/swc-project/swc/issues/7251)) ([2e947e7](https://github.com/swc-project/swc/commit/2e947e7aeb1fd2989a10fb49a2ffa2ea35bc9941))


- **(es/minifier)** Fix handling of optional chaining when `hoist_props` is enabled ([#7246](https://github.com/swc-project/swc/issues/7246)) ([a44fea1](https://github.com/swc-project/swc/commit/a44fea1ec8f19a822d84c744b9e39c122026fd9d))


- **(es/parser)** Use a hard error for missing r-paren in an if stmt ([#7223](https://github.com/swc-project/swc/issues/7223)) ([b1c40a4](https://github.com/swc-project/swc/commit/b1c40a411f01792f9b9f4bc9d5f08782fc6d6a1c))


- **(es/parser)** Reset ctx for cond while parsing a stmt ([#7232](https://github.com/swc-project/swc/issues/7232)) ([01db30f](https://github.com/swc-project/swc/commit/01db30f91ec91d5dffe4c2ac1934965cc9c73cf8))


- **(es/parser)** Parse `const` type parameters in arrow function expressions ([#7242](https://github.com/swc-project/swc/issues/7242)) ([6614886](https://github.com/swc-project/swc/commit/66148861926a8e70cb75ff20cb2f0ff171c2e630))

### Features



- **(es)** Provide more information when loading of input source map failed ([#7249](https://github.com/swc-project/swc/issues/7249)) ([f0e3b1d](https://github.com/swc-project/swc/commit/f0e3b1d09a69c3eb3035e2dbc00d537576b48a08))


- **(es)** Use `minify.format.ascii_only` if `output.charset` is not specified ([#7258](https://github.com/swc-project/swc/issues/7258)) ([1fe5c3a](https://github.com/swc-project/swc/commit/1fe5c3a803daf247709ac51f8c637ba7e56181bc))


- **(es/minifier)** Support `PURE` comment of seq exprs ([#7245](https://github.com/swc-project/swc/issues/7245)) ([559d120](https://github.com/swc-project/swc/commit/559d1202bc9a25c06eae01c6e033a44bb31aab62))


- **(plugin)** Enable validation ([#7250](https://github.com/swc-project/swc/issues/7250)) ([efad714](https://github.com/swc-project/swc/commit/efad714983459393639f4b026da7793807c1b401))

### Refactor



- **(plugin)** Remove `bytecheck` flag ([#7256](https://github.com/swc-project/swc/issues/7256)) ([6bd58cb](https://github.com/swc-project/swc/commit/6bd58cbcfdef99604470a106853628e1cdb36cda))


- **(plugin/runner)** Fix clippy warnings ([#7244](https://github.com/swc-project/swc/issues/7244)) ([70b86db](https://github.com/swc-project/swc/commit/70b86dbe371fafc2dffde0573bc091860aa529b3))

### Testing



- **(es/plugin)** Enable E2E test again ([#7236](https://github.com/swc-project/swc/issues/7236)) ([695ce06](https://github.com/swc-project/swc/commit/695ce060e95ccdda50334468dc669da2df76c026))

### Build



- **(plugin)** Update `rkyv` ([#7257](https://github.com/swc-project/swc/issues/7257)) ([ff3decc](https://github.com/swc-project/swc/commit/ff3decc7dbf7965085261b16efa1a7b251aec696))

## [1.3.49] - 2023-04-10

### Features



- **(plugin/runner)** Update `wasmer` to `v3` ([#7197](https://github.com/swc-project/swc/issues/7197)) ([56bdacc](https://github.com/swc-project/swc/commit/56bdacc72df967bc613c5b067cf773f39c4bce00))

### Refactor



- **(plugin/runner)** Fix publish action ([#7234](https://github.com/swc-project/swc/issues/7234)) ([b868ed0](https://github.com/swc-project/swc/commit/b868ed02a35904bd6063709685d1470598cdaf81))

## [1.3.47] - 2023-04-10

### Bug Fixes



- **(bindings/node)** Make peer dependency of helpers optional ([#7216](https://github.com/swc-project/swc/issues/7216)) ([e86d598](https://github.com/swc-project/swc/commit/e86d59882a6644a63e98094127694f27b3c1b5a4))


- **(es/compat)** Fix `finally` handling of `generator` ([#7215](https://github.com/swc-project/swc/issues/7215)) ([f5c62fb](https://github.com/swc-project/swc/commit/f5c62fbbf8ccbadec4daae4a2158b7b2fc707a2b))


- **(es/minifier)** Don't remove used var decl ([#7200](https://github.com/swc-project/swc/issues/7200)) ([73bc29e](https://github.com/swc-project/swc/commit/73bc29eeb0e0a758daff2ec9567d8949fb48fa50))


- **(es/testing)** Ensure that we call `fold_program` ([#7222](https://github.com/swc-project/swc/issues/7222)) ([e241201](https://github.com/swc-project/swc/commit/e241201bf76c3ae111d815dac7dbcc169d12dc25))


- **(es/typescript)** Fix computation of enum bits ([#7219](https://github.com/swc-project/swc/issues/7219)) ([29bf176](https://github.com/swc-project/swc/commit/29bf1760befc5acf56841f4c369016e296184bdb))

### Features



- **(es)** Expose stage 3 decorator ([#7220](https://github.com/swc-project/swc/issues/7220)) ([a7a53c6](https://github.com/swc-project/swc/commit/a7a53c6208ae63a07b663049575f3b50f37d2f2a))

### Refactor



- **(macros/ast-node)** Drop `darling` to reduce compile time ([#7214](https://github.com/swc-project/swc/issues/7214)) ([3f61638](https://github.com/swc-project/swc/commit/3f61638cbfb1acc9fa59fa68434a182ba8bcfb2a))

## [1.3.45] - 2023-04-04

### Bug Fixes



- **(es)** Allow missing `.map` file ([#7141](https://github.com/swc-project/swc/issues/7141)) ([3e6a186](https://github.com/swc-project/swc/commit/3e6a1869e84ec01125cf115c3d5f5c5c89645e1a))


- **(es/compat)** Handle shorthand object prop while renaming ([#7176](https://github.com/swc-project/swc/issues/7176)) ([0a80e05](https://github.com/swc-project/swc/commit/0a80e0506b0fd58d31027c348ea0c957a5cc60f7))


- **(es/helpers)** Use snake_case for helpers ([#7147](https://github.com/swc-project/swc/issues/7147)) ([3ca954b](https://github.com/swc-project/swc/commit/3ca954b9f9622ed400308f2af35242583a4bdc3d))


- **(es/modules)** Hint nodejs for multiple `export *` ([#7184](https://github.com/swc-project/swc/issues/7184)) ([98f1493](https://github.com/swc-project/swc/commit/98f14931e7fa24b9d888eb5149c647840978b096))


- **(es/parser)** Fix infinite loop on jsx in js ([#7191](https://github.com/swc-project/swc/issues/7191)) ([414e669](https://github.com/swc-project/swc/commit/414e66910dc5d9fea254811618f69067ab4a7a67))


- **(es/typescript)** Mark `A` as a type in `export { type A }` ([#7196](https://github.com/swc-project/swc/issues/7196)) ([ddfbc93](https://github.com/swc-project/swc/commit/ddfbc936244c1168c547e134f20d436bfb6227f9))


- **(swc_core)** Fix a feature name ([#7198](https://github.com/swc-project/swc/issues/7198)) ([bfe6544](https://github.com/swc-project/swc/commit/bfe654438f15d875257caf7735f11a79e51780a5))

### Features



- **(css/modules)** Preserve spans of CSS class names ([#7185](https://github.com/swc-project/swc/issues/7185)) ([df7b4e7](https://github.com/swc-project/swc/commit/df7b4e71d22a7174df6f4fe9691044560e8e7f65))


- **(es/compat)** Implement stage 3 decorator, without auto accessor ([#6950](https://github.com/swc-project/swc/issues/6950)) ([7a863ad](https://github.com/swc-project/swc/commit/7a863ad18ffeb45801cc17992634b5c62adfe88b))


- **(es/helpers)** Use named export and unify import path ([#7182](https://github.com/swc-project/swc/issues/7182)) ([a13a78e](https://github.com/swc-project/swc/commit/a13a78e3fe2f81f0cbbe4a98da9cbb5a48b6cbed))


- **(plugin/runner)** Improve cache path ([#7188](https://github.com/swc-project/swc/issues/7188)) ([976667f](https://github.com/swc-project/swc/commit/976667f7d98b821940c5325efc092e50c6554dc2))

### Testing



- **(es/plugin)** Enable E2E plugin test ([#7178](https://github.com/swc-project/swc/issues/7178)) ([a785f18](https://github.com/swc-project/swc/commit/a785f18740942c841fede3d625ec2fd4b090d020))

## [1.3.44] - 2023-03-30

### Bug Fixes



- **(css/codegen)** Preserve `raw` of numbers ([#7131](https://github.com/swc-project/swc/issues/7131)) ([150c2b6](https://github.com/swc-project/swc/commit/150c2b6fbaef976c6ee97438d1b9b7ffe4b210be))


- **(css/compat)** Remove usage of `box_syntax` ([#7153](https://github.com/swc-project/swc/issues/7153)) ([6f0bf66](https://github.com/swc-project/swc/commit/6f0bf665c29abaa64c60fb43053f96e465d3e041))


- **(es/compat)** Handle import/export in `reserved_word` ([#7165](https://github.com/swc-project/swc/issues/7165)) ([065d11c](https://github.com/swc-project/swc/commit/065d11cb9bd49f36825b3b707e4e9ecfcc64e17b))


- **(es/compat)** Fix the position for temp var injection ([#7171](https://github.com/swc-project/swc/issues/7171)) ([23fb8c5](https://github.com/swc-project/swc/commit/23fb8c5563a8e5f79d256bb27bdbdfd56944ccbc))


- **(es/react)** Respect `import_source` in new jsx ([#7128](https://github.com/swc-project/swc/issues/7128)) ([5d7acfd](https://github.com/swc-project/swc/commit/5d7acfd9cbbb9780879d0d7a046f716572a477f7))


- **(es/renamer)** Don't use symbols used by declarations if `eval` exists ([#7116](https://github.com/swc-project/swc/issues/7116)) ([6d9763e](https://github.com/swc-project/swc/commit/6d9763e8c0f5cef7689961e7eb11dc7199e8cd08))


- **(es/visit)** Fix handling of `Program` of `AndThen` ([#7120](https://github.com/swc-project/swc/issues/7120)) ([d50689e](https://github.com/swc-project/swc/commit/d50689eab0e82a68c84fcacdd8ce5c9009a65100))


- **(fast-graph)** Use fxhash instead of ahash to make iteration order consistent ([#7133](https://github.com/swc-project/swc/issues/7133)) ([b13eb4c](https://github.com/swc-project/swc/commit/b13eb4c81192a57a7e69b10a2d4530ccd91150f8))

### Documentation



- **(es)** Fix doc url ([#7123](https://github.com/swc-project/swc/issues/7123)) ([1e4abcb](https://github.com/swc-project/swc/commit/1e4abcb11d4c5884cc6559db8e86ecd7fbd96e5d))

### Features



- **(css/parser)** Add `legacy_ie` to the `ParserConfig` ([#7109](https://github.com/swc-project/swc/issues/7109)) ([5e58b3e](https://github.com/swc-project/swc/commit/5e58b3e5f6dfe6a7ede97c3e8a2f7436db964113))


- **(es/react)** Support script within automatic runtime ([#7126](https://github.com/swc-project/swc/issues/7126)) ([05a2815](https://github.com/swc-project/swc/commit/05a2815e6ceb6d12e122be4e4ef84281d398f8c2))

### Miscellaneous Tasks



- **(cargo)** Refactor `Cargo.toml` to reduce merge conflict ([#7139](https://github.com/swc-project/swc/issues/7139)) ([2826198](https://github.com/swc-project/swc/commit/28261985b00c23fd1411a8f782c04439d4e4919c))

### Refactor



- **(ast)** Make serde optional ([#7138](https://github.com/swc-project/swc/issues/7138)) ([30bc086](https://github.com/swc-project/swc/commit/30bc0860526c0983042c60a039a1f5acee47830c))


- **(es)** Remove needless build scripts to reduce compile time ([#7129](https://github.com/swc-project/swc/issues/7129)) ([dfe1a3f](https://github.com/swc-project/swc/commit/dfe1a3f4964ba58fdd676c184fdff0919fa78b26))


- **(es/codegen)** Extract code from generic functions to reduce compile time ([#7127](https://github.com/swc-project/swc/issues/7127)) ([08fa94f](https://github.com/swc-project/swc/commit/08fa94fc737c2c3522227c1275e4a1d93c2a8611))


- **(es/parser)** Remove `EnumKind` to reduce compile time ([#7137](https://github.com/swc-project/swc/issues/7137)) ([915f747](https://github.com/swc-project/swc/commit/915f747cb7ba972e47e249b5a5ba9573dd68f607))


- **(macros)** Reduce compile time ([#7132](https://github.com/swc-project/swc/issues/7132)) ([2154a3f](https://github.com/swc-project/swc/commit/2154a3f117d9ea7cc2f12856d6e7f2b33a255d26))

### Build



- **(cargo)** Update `rustc` to `nightly-2023-03-28` ([#7154](https://github.com/swc-project/swc/issues/7154)) ([e445502](https://github.com/swc-project/swc/commit/e445502072d8ebfcbe0da0cb59f3d6a85d4a2087))


- **(cargo)** Revert rustc upgrade ([#7162](https://github.com/swc-project/swc/issues/7162)) ([12546c8](https://github.com/swc-project/swc/commit/12546c853a67210e840efd61452041ef8db00d3a))


- **(cargo)** Update `rustc` to `nightly-2023-03-20` ([#7170](https://github.com/swc-project/swc/issues/7170)) ([0259a74](https://github.com/swc-project/swc/commit/0259a7465fc5122cf2f297f962f7f0209f619251))

## [1.3.42] - 2023-03-22

### Bug Fixes



- **(bindings/node)** Fix loading of `spack.config.js` ([#7105](https://github.com/swc-project/swc/issues/7105)) ([a4d1af1](https://github.com/swc-project/swc/commit/a4d1af18deabe79caa959eb654ca1ebc2d9f6867))


- **(es/ast)** Fix `EqIgnoreSpan` impl of `Number` ([#7112](https://github.com/swc-project/swc/issues/7112)) ([6a570a3](https://github.com/swc-project/swc/commit/6a570a334c787358d67ae6c590a7fd0e916f35e8))


- **(es/compat)** Don't modify private fields from `reserved_words` pass ([#7113](https://github.com/swc-project/swc/issues/7113)) ([2bc631d](https://github.com/swc-project/swc/commit/2bc631df8792d2f1356b5ef2dbf3ee0c46ecbd4f))


- **(es/minifier)** Pass `keep_*` in config to `compress` and `mangle` ([#7102](https://github.com/swc-project/swc/issues/7102)) ([6a1201c](https://github.com/swc-project/swc/commit/6a1201cfc44fe5ae3d8599669fd8032c82e6c580))


- **(es/minifier)** Don't inline into arrow heads ([#7099](https://github.com/swc-project/swc/issues/7099)) ([610e1bb](https://github.com/swc-project/swc/commit/610e1bb581a04fe9b871dd7afa0cf81ab9ee7fa8))


- **(es/parser)** Fix parsing of static accessors ([#7108](https://github.com/swc-project/swc/issues/7108)) ([dd2b16d](https://github.com/swc-project/swc/commit/dd2b16db9ec77e515dcd38f68f8020d70d0f9ac9))

### Features



- **(es/resolver)** Make scope context identical to the vars ([#7095](https://github.com/swc-project/swc/issues/7095)) ([0f09e35](https://github.com/swc-project/swc/commit/0f09e356c38268ac10223d0d44dd253949bcbc59))


- Feat(css/minifier) Follow the CSS spec more rigorously ([#6291](https://github.com/swc-project/swc/issues/6291))

**Description:**

Full refactor of the "calc" simplification to be more compliant with the spec. ([df09d2f](https://github.com/swc-project/swc/commit/df09d2fd4bef3ab83efbe46f8e3d42d26bbae95d))

### Refactor



- **(es/fixer)** Move comments with the insertion order ([#7097](https://github.com/swc-project/swc/issues/7097)) ([f250f24](https://github.com/swc-project/swc/commit/f250f243cba49b9cdcdc920d37c92662c14941bc))


- **(es/resolver)** Make syntax context for unresolved and top-level stable ([#7096](https://github.com/swc-project/swc/issues/7096)) ([c114f00](https://github.com/swc-project/swc/commit/c114f006b4ea388ef9a4503e935d59e92a647ecf))

## [1.3.41] - 2023-03-17

### Bug Fixes



- **(bindings/cli)** Change order of checking inputs to workaround a Windows issue ([#7077](https://github.com/swc-project/swc/issues/7077)) ([7bbec92](https://github.com/swc-project/swc/commit/7bbec92d234ddb47b51a014937d1ec7c1cb571c7))


- **(css/codegen)** Respect `raw` of `Str` ([#7078](https://github.com/swc-project/swc/issues/7078)) ([7849a2d](https://github.com/swc-project/swc/commit/7849a2d75d57bf3b6242f5f472a06a30c9fb948d))


- **(css/parser)** Fix parsing of `:global(> *)` ([#7082](https://github.com/swc-project/swc/issues/7082)) ([60f74ea](https://github.com/swc-project/swc/commit/60f74ea0769c2be764af8eb5320343f77ea78c1a))


- **(es/codegen)** Emit `type_params` for `TsConstructSignatureDecl` ([#7080](https://github.com/swc-project/swc/issues/7080)) ([8353acc](https://github.com/swc-project/swc/commit/8353accb1315a8847e4dabcd36274cde5856e763))


- **(es/minifier)** Preserve `delete` of unresolved variables ([#7072](https://github.com/swc-project/swc/issues/7072)) ([86295ba](https://github.com/swc-project/swc/commit/86295ba8f26fbe3829c2c08fd8034975f05f60b5))


- **(es/minifier)** Accept `keep_fnames` and `keep_classnames` ([#7090](https://github.com/swc-project/swc/issues/7090)) ([0086914](https://github.com/swc-project/swc/commit/00869147d3ac62db323cdf2a06cc8cc17dcdd1f3))


- **(es/minifier)** Remove wrong optimization of `new RegExp(…)` ([#7091](https://github.com/swc-project/swc/issues/7091)) ([493a4f7](https://github.com/swc-project/swc/commit/493a4f7042bad7f883981b10cdc02fe0d36a5fb0))


- **(es/react)** Align to `babel@8` behavior ([#7081](https://github.com/swc-project/swc/issues/7081)) ([7b491a6](https://github.com/swc-project/swc/commit/7b491a69a5ea80cd8aace9e7da3e73079c6a259f))


- **(testing)** Ignore `non_snake_case` for generated test names ([#7087](https://github.com/swc-project/swc/issues/7087)) ([1c254b1](https://github.com/swc-project/swc/commit/1c254b1c44f72f5e66698f78d76796d5a7f66146))

### Performance



- **(es/lexer)** Use jump table for `skip_space` ([#7073](https://github.com/swc-project/swc/issues/7073)) ([f854d51](https://github.com/swc-project/swc/commit/f854d51343dcbdf43acd87f51e2288a052e39a0b))

### Refactor



- Fix lints using clippy from `nightly-2023-03-13` ([#6920](https://github.com/swc-project/swc/issues/6920)) ([963c460](https://github.com/swc-project/swc/commit/963c46061321fff3a2893da4953c1fd5ec649311))

## [1.3.40] - 2023-03-13

### Bug Fixes



- **(bindings/cli)** Update `swc_ecma_ast` ([#7060](https://github.com/swc-project/swc/issues/7060)) ([1b40689](https://github.com/swc-project/swc/commit/1b40689c3a754ce4a038ea98d7e9f41b1e9cf7a7))


- **(es)** Respect the value of assumptions ([#7065](https://github.com/swc-project/swc/issues/7065)) ([11d4874](https://github.com/swc-project/swc/commit/11d4874a2ea173a43e0a1fcdf8a1390d4320b7ee))


- **(es/ast)** Fix memory layout ([#7062](https://github.com/swc-project/swc/issues/7062)) ([085c6f3](https://github.com/swc-project/swc/commit/085c6f35f1f298a7863a99f3adfeb48b2dddbcb8))


- **(es/compat)** Handle `useDefineForClassFields: false` ([#7055](https://github.com/swc-project/swc/issues/7055)) ([bb6dde7](https://github.com/swc-project/swc/commit/bb6dde794326838b2069c7f86fb900eee36027bc))


- **(es/compat)** Insert the variable declaration nearest to the available statements ([#7067](https://github.com/swc-project/swc/issues/7067)) ([ae348e3](https://github.com/swc-project/swc/commit/ae348e32e18e07c277c358746e3ba3a78b9251c4))

### Performance



- **(es/lexer)** Use jump table for `read_token` ([#7058](https://github.com/swc-project/swc/issues/7058)) ([9beefaa](https://github.com/swc-project/swc/commit/9beefaa1d5e711b63293d52a6c77e8aaf5e8f4c1))

<!-- generated by git-cliff -->
