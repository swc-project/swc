# Changelog
## [unreleased]

### Bug Fixes



- **(es/codegen)** Emit .d.ts when using --out-file ([#9582](https://github.com/swc-project/swc/issues/9582)) ([3d9d641](https://github.com/swc-project/swc/commit/3d9d641f8b49725014e7d7a72a6f0a5dfe01f42c))


- **(es/module)** Fix `jsc.paths` using absolute paths with dots in a filename for an alias ([#9595](https://github.com/swc-project/swc/issues/9595)) ([74e3d04](https://github.com/swc-project/swc/commit/74e3d0466abcd7422620623d8adcceac04ce26c9))


- **(es/parser)** Fix failure of TS instantiation followed by satisfies ([#9583](https://github.com/swc-project/swc/issues/9583)) ([77900d8](https://github.com/swc-project/swc/commit/77900d808e2a3be2e62b74022c88a81b26a73f86))

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

### Performance



- **(es/parser)** Optimize macros ([#9100](https://github.com/swc-project/swc/issues/9100)) ([719b7c5](https://github.com/swc-project/swc/commit/719b7c54f69ef276270dc39fbcb8bbdbf52899bf))


- **(es/parser)** Remove unnecessary check ([#9102](https://github.com/swc-project/swc/issues/9102)) ([2a490ad](https://github.com/swc-project/swc/commit/2a490ad0b2f9f89260742e653ba9ca086c1a9798))


- **(es/parser)** Add a check before numeric operations ([#9105](https://github.com/swc-project/swc/issues/9105)) ([c0602c8](https://github.com/swc-project/swc/commit/c0602c81db55777be726cd8fe2fd074e34bd4d96))


- **(es/parser)** Increase token context size ([#9104](https://github.com/swc-project/swc/issues/9104)) ([8ef30cc](https://github.com/swc-project/swc/commit/8ef30cc08c86251bb8bebf66286949805e332b6c))

## [1.6.4] - 2024-06-22

### Features



- **(cli)** Support generating `.d.ts` files ([#9097](https://github.com/swc-project/swc/issues/9097)) ([e71b6d3](https://github.com/swc-project/swc/commit/e71b6d31b1179dffb8a6e2d652b394273a6d7852))


- **(common)** Add fallible methods to `swc_common::SourceMap` ([#9090](https://github.com/swc-project/swc/issues/9090)) ([e423d1b](https://github.com/swc-project/swc/commit/e423d1bcedc24803eaeeed4c72cc84fe9a938f65))


- **(es/transform)** Add experimental `.d.ts` generation ([#9093](https://github.com/swc-project/swc/issues/9093)) ([51a2702](https://github.com/swc-project/swc/commit/51a27022b9a3fa8767797813b23803ea1ecad3e2))


- **(swc_core)** Reexport `swc_typescript` ([#9092](https://github.com/swc-project/swc/issues/9092)) ([a2645e2](https://github.com/swc-project/swc/commit/a2645e2fa0a55c4dbe519b6f8baa9e83a69bb2f0))


- **(typescript)** Implement Isolated Declaration ([#9086](https://github.com/swc-project/swc/issues/9086)) ([a855159](https://github.com/swc-project/swc/commit/a8551592b29bb1a1a0518e3724ad54acacca888a))

### Miscellaneous Tasks



- **(deps)** Replace `sha-1` with `sha1` ([#9091](https://github.com/swc-project/swc/issues/9091)) ([5a2c968](https://github.com/swc-project/swc/commit/5a2c968720141b115ec2055ea13ae6d025175e95))

### Performance



- **(es/lexer)** Apply various optimizations ([#9095](https://github.com/swc-project/swc/issues/9095)) ([2f02630](https://github.com/swc-project/swc/commit/2f02630b1e597692ce5a3d946f8d498ca33709dd))


- **(es/lexer)** Use `memchr::memmem` for lexing block comments ([#9096](https://github.com/swc-project/swc/issues/9096)) ([1b3672f](https://github.com/swc-project/swc/commit/1b3672f1e7d38a0039b1ba0ebc136133dd8c907f))

### Refactor



- **(es/parser)** Rename `EsConfig` and `TsConfig` ([#9094](https://github.com/swc-project/swc/issues/9094)) ([5520b23](https://github.com/swc-project/swc/commit/5520b236dd40fdd579c99cb6d66eef094cabc3fc))

## [1.6.3] - 2024-06-19

### Bug Fixes



- **(css/minifier)** Don't tranform rotate deg ([#9072](https://github.com/swc-project/swc/issues/9072)) ([8d37dae](https://github.com/swc-project/swc/commit/8d37daedf10cbf5fa7ac8ceeb4192ddd6241e310))


- **(es/decorators)** Reduce the number of sourcemap mappings ([#9074](https://github.com/swc-project/swc/issues/9074)) ([cfe3ba3](https://github.com/swc-project/swc/commit/cfe3ba306dc709149c496f67dbb7f35dc4f86819))

### Performance



- **(common)** Use `Chars` in `StringInput` ([#9073](https://github.com/swc-project/swc/issues/9073)) ([7698eaa](https://github.com/swc-project/swc/commit/7698eaa006d2951df0e0e0cb5680fe531d64dcf4))


- **(es/lexer)** Optimize lexer ([#9075](https://github.com/swc-project/swc/issues/9075)) ([6426928](https://github.com/swc-project/swc/commit/6426928b912baa6573b902d7d3c85bcd49b2e823))


- **(es/lexer)** Make lexing of string literals faster ([#9077](https://github.com/swc-project/swc/issues/9077)) ([373bac5](https://github.com/swc-project/swc/commit/373bac55aaffbe1f6e001c7c6d490797de45114e))


- **(es/lexer)** Reduce allocation while lexing identifiers ([#9076](https://github.com/swc-project/swc/issues/9076)) ([69f00b8](https://github.com/swc-project/swc/commit/69f00b85d465e882ec33642d6e8ed22dbe3c3fb2))


- **(es/lexer)** Add a fast-path to template literal lexer ([#9080](https://github.com/swc-project/swc/issues/9080)) ([238f1c5](https://github.com/swc-project/swc/commit/238f1c50e5b27a8655e10ac2b2be723b62233931))


- **(es/lexer)** Add fast-path to jsx lexer ([#9081](https://github.com/swc-project/swc/issues/9081)) ([af58606](https://github.com/swc-project/swc/commit/af586069a922525dc24b5f59aefaf53daed7759a))

### Refactor



- **(common)** Simplify `StringInput` implementation ([#9071](https://github.com/swc-project/swc/issues/9071)) ([c3a8c0b](https://github.com/swc-project/swc/commit/c3a8c0b56755f17d0611f6559689a5cfb3185c33))

## [1.6.1] - 2024-06-16

### Bug Fixes



- **(common)** Revert `Use SourceMap::adjust_mappings` ([#9058](https://github.com/swc-project/swc/issues/9058)) ([cdd20cd](https://github.com/swc-project/swc/commit/cdd20cd16370342f645a181198432a3dc3b6c7ab))

### Performance



- **(es/parser)** Reduce allocations while lexing numbers ([#9057](https://github.com/swc-project/swc/issues/9057)) ([ca26eb7](https://github.com/swc-project/swc/commit/ca26eb796b1aefa150ccab7b16822ecb748aca7b))

## [1.6.0] - 2024-06-15

### Features



- **(common)** Use `SourceMap::adjust_mappings` ([#9052](https://github.com/swc-project/swc/issues/9052)) ([eda2e45](https://github.com/swc-project/swc/commit/eda2e456915cf1c0bfc8e4e833bcd2b9c6c36a41))


- **(es/ast)** Add more utilities ([#9054](https://github.com/swc-project/swc/issues/9054)) ([ab226dc](https://github.com/swc-project/swc/commit/ab226dcfb7abea0b14430697c53c0002bd823866))

### Performance



- **(es/lints)** Avoid needless allocations in `no-dupe-args` ([#9041](https://github.com/swc-project/swc/issues/9041)) ([e560198](https://github.com/swc-project/swc/commit/e5601989a1fa699c3d4f7f120bd14f946eee01fa))


- **(es/parser)** Do not track `raw` by hand ([#9047](https://github.com/swc-project/swc/issues/9047)) ([60fe5f0](https://github.com/swc-project/swc/commit/60fe5f0effdcc45f0cfd363fd0ff4e6f4dba5b33))


- **(es/parser)** Reduce allocations for `raw` while lexing numbers ([#9056](https://github.com/swc-project/swc/issues/9056)) ([bc8ec62](https://github.com/swc-project/swc/commit/bc8ec625ecee8a077fe84de371c490be14a1a033))

### Refactor



- **(es/ast)** Remove unused fields of `TsPropertySignature` ([#8955](https://github.com/swc-project/swc/issues/8955)) ([6306778](https://github.com/swc-project/swc/commit/63067785127a0bf311c3bac2731df447a3cd614a))


- **(es/parser)** Remove unused `raw: Raw` params ([#9048](https://github.com/swc-project/swc/issues/9048)) ([32e23ed](https://github.com/swc-project/swc/commit/32e23edd8591784bda2b49f941611b01a60e9a80))


- **(es/utils)** Refine some APIs ([#9049](https://github.com/swc-project/swc/issues/9049)) ([e856478](https://github.com/swc-project/swc/commit/e8564780600d367a717e7b90a33bfd34275f5a19))

### Testing



- **(es/parser)** Add benchmarks ([#9044](https://github.com/swc-project/swc/issues/9044)) ([11bba26](https://github.com/swc-project/swc/commit/11bba262f555b284087a0a27ad3cbefdbd1b1c24))

## [1.5.29] - 2024-06-13

### Bug Fixes



- **(ci)** Make publish action upload cli artifacts ([#9040](https://github.com/swc-project/swc/issues/9040)) ([3337bb2](https://github.com/swc-project/swc/commit/3337bb26f9b00352c3f03c625f1429ee15ebc070))


- **(es)** Make `output` field optional ([#9033](https://github.com/swc-project/swc/issues/9033)) ([39654bf](https://github.com/swc-project/swc/commit/39654bf1e7136077d2db2f85a93591708b4cfe8c))


- **(es/codegen)** Emit named type in mapped types ([#9038](https://github.com/swc-project/swc/issues/9038)) ([91e92ec](https://github.com/swc-project/swc/commit/91e92ececab33c2258eeb659803da9a549e7591a))


- **(es/minifier)** Visit RHS while hoisting properties ([#9032](https://github.com/swc-project/swc/issues/9032)) ([cb16994](https://github.com/swc-project/swc/commit/cb16994a8d7a203e923b52e444d265bad0fa9e6e))


- **(xtask)** Fix `nightly` action ([#9042](https://github.com/swc-project/swc/issues/9042)) ([733dcc6](https://github.com/swc-project/swc/commit/733dcc6b83e77a2571a3fee307a73fc0c17bd44c))

### Performance



- **(es/minifier)** Do not visit var init multiple times ([#9039](https://github.com/swc-project/swc/issues/9039)) ([675916c](https://github.com/swc-project/swc/commit/675916ccbd378d3b0334ffeb7ad0759538856ddd))


- **(es/parser)** Optimize lexing of template literals ([#9036](https://github.com/swc-project/swc/issues/9036)) ([6ab19a1](https://github.com/swc-project/swc/commit/6ab19a1b5f37e7f485f392ef3b63af024ae9e644))


- **(es/parser)** Optimize lexing of template literals, again ([#9037](https://github.com/swc-project/swc/issues/9037)) ([5bffd0f](https://github.com/swc-project/swc/commit/5bffd0ff9b9548e1585b7e791a3f35ad0a83e1e0))

## [1.5.28] - 2024-06-11

### Bug Fixes



- **(es/minifier)** Fix typescript enum detection ([#9031](https://github.com/swc-project/swc/issues/9031)) ([6669343](https://github.com/swc-project/swc/commit/6669343b4aaaaca5cb4f4ee5753f86aea71974b1))

## [1.5.26] - 2024-06-10

### Bug Fixes



- **(es/es2015)** Remove needless `unreachable!` ([#9021](https://github.com/swc-project/swc/issues/9021)) ([555e71c](https://github.com/swc-project/swc/commit/555e71cfd5dddfec35c8a694b50d6a08ab89ae3c))

### Features



- **(es)** Integrate experimental data API ([#9027](https://github.com/swc-project/swc/issues/9027)) ([825749f](https://github.com/swc-project/swc/commit/825749f44052234ba0de9db3f4cea40517ddd917))


- **(es/minifier)** Support `module: "unknown"` ([#9026](https://github.com/swc-project/swc/issues/9026)) ([cada50b](https://github.com/swc-project/swc/commit/cada50b01746978d7c2c16fd03c3a6672aeed118))


- **(es/renamer)** Workaround a bug of Safari ([#9029](https://github.com/swc-project/swc/issues/9029)) ([54ac992](https://github.com/swc-project/swc/commit/54ac992781fa5a619ee1bcb9f097c3915276d9a3))


- **(es/transforms)** Add experimental output API for transforms ([#9000](https://github.com/swc-project/swc/issues/9000)) ([6fa79be](https://github.com/swc-project/swc/commit/6fa79be0814a6e4dc5d7f61fb3bead3c13920a9d))


- **(es/transforms)** Add an API for returning metadata to JS ([#9022](https://github.com/swc-project/swc/issues/9022)) ([6ce112c](https://github.com/swc-project/swc/commit/6ce112cfebc9be87df7d6e532a67a1af43cc0038))

## [1.5.25] - 2024-06-05

### Bug Fixes



- **(es/es2015)** Fix injection location of `this` for getter/setter properties ([#8993](https://github.com/swc-project/swc/issues/8993)) ([09121a6](https://github.com/swc-project/swc/commit/09121a61cc5bf390b627e548c471bfc39ccb1c0f))


- **(es/minifier)** Preserve unused special properties ([#9005](https://github.com/swc-project/swc/issues/9005)) ([e764ff6](https://github.com/swc-project/swc/commit/e764ff6f64d4e528a2af3e3ad7859ab3f8a2fe48))


- **(es/minifier)** Fix comparison of `-0.0` ([#9012](https://github.com/swc-project/swc/issues/9012)) ([8a29577](https://github.com/swc-project/swc/commit/8a29577cc5bd3842d3bccfdbbffa45e4c9944d7f))


- **(es/minifier)** Do not index a string with a surrogate pair ([#9013](https://github.com/swc-project/swc/issues/9013)) ([2879a4d](https://github.com/swc-project/swc/commit/2879a4d42b18e7e9d6bc12119a799c6a8c95e108))


- **(es/minifier)** Fix evaluation of `-0` as a string ([#9011](https://github.com/swc-project/swc/issues/9011)) ([9f8e24a](https://github.com/swc-project/swc/commit/9f8e24a76c00b8f4470aadf22f071a60f409a13d))


- **(es/resolver)** Fix hoisting of `const` and `let` ([#8987](https://github.com/swc-project/swc/issues/8987)) ([0d9ecf3](https://github.com/swc-project/swc/commit/0d9ecf39c1f452be1f2e583f72cebc6986a8088b))

### Features



- **(es/minifier)** Detect TypeScript enum initialization pattern ([#8986](https://github.com/swc-project/swc/issues/8986)) ([cc8c155](https://github.com/swc-project/swc/commit/cc8c1550ddd8f45712039663487fe07b8dfa2599))


- **(x)** Initialize project ([#8999](https://github.com/swc-project/swc/issues/8999)) ([da70ebe](https://github.com/swc-project/swc/commit/da70ebed692d734ac4c042cd6a67fee9da793731))

### Performance



- **(es/parser)** Add feature named `tracing-spans` ([#9019](https://github.com/swc-project/swc/issues/9019)) ([3bf3114](https://github.com/swc-project/swc/commit/3bf31148ba5058323ee89bb2ca74b641c52c0669))

## [1.5.23] - 2024-05-30

### Bug Fixes



- **(bindings/node)** Fix regression of JS APIs ([#8998](https://github.com/swc-project/swc/issues/8998)) ([125ddd2](https://github.com/swc-project/swc/commit/125ddd2dd98e882f9e10b7d94f766eae85143d71))


- **(es/jest)** Handle `@jest/globals` ([#8994](https://github.com/swc-project/swc/issues/8994)) ([a81a01f](https://github.com/swc-project/swc/commit/a81a01f629613a624798693e60f9796904a8dce1))

## [1.5.9] - 2024-05-28

### Bug Fixes



- **(es/codegen)** Accept `&impl Node` instead of `impl Node` ([#8969](https://github.com/swc-project/swc/issues/8969)) ([a456799](https://github.com/swc-project/swc/commit/a4567998b0570fe7b657ce1361bd4e7c7d900999))


- **(es/es2015)** Fix `typeof` comparions with `"object"` ([#8976](https://github.com/swc-project/swc/issues/8976)) ([51e0639](https://github.com/swc-project/swc/commit/51e0639ede63490bea9da7a4d8dbfdfe2185b169))


- **(es/minifier)** Add type check to `&` and `|` ([#8965](https://github.com/swc-project/swc/issues/8965)) ([545ec51](https://github.com/swc-project/swc/commit/545ec51b51643b8ef7908dbfceda09811f5fc087))


- **(es/minifier)** Fix comparison of `-0.0` and `0` ([#8973](https://github.com/swc-project/swc/issues/8973)) ([2a43df4](https://github.com/swc-project/swc/commit/2a43df49848267ba68a320370e3a5818bf14478e))


- **(es/minifier)** Mark usage in `TaggedTpl` as ref ([#8975](https://github.com/swc-project/swc/issues/8975)) ([a753c8d](https://github.com/swc-project/swc/commit/a753c8d1912940b142f8931dc700c19234b73308))

### Features



- **(es/codegen)** Add `to_code` ([#8968](https://github.com/swc-project/swc/issues/8968)) ([e80fd41](https://github.com/swc-project/swc/commit/e80fd41ea806f118ec9eeaa292f840c75aac3967))


- **(plugin/runner)** Add description about wasi and file system ([#8963](https://github.com/swc-project/swc/issues/8963)) ([ced63a9](https://github.com/swc-project/swc/commit/ced63a973e48e542bc889675b2f2d4fb48abfb8d))

### Testing



- **(es/decorators)** Add tests written by evanw ([#8967](https://github.com/swc-project/swc/issues/8967)) ([95472e4](https://github.com/swc-project/swc/commit/95472e4037dcfd85c96de92fad93c27bceee080e))


- **(es/minifier)** Update the passing terser test list ([#8984](https://github.com/swc-project/swc/issues/8984)) ([c0dc5e4](https://github.com/swc-project/swc/commit/c0dc5e44ab5c2bbe904cd17f359d35834ca99e0f))

## [1.5.8] - 2024-05-20

### Bug Fixes



- **(es/minifier)** Abort array property inliner if the array is used as a ref ([#8956](https://github.com/swc-project/swc/issues/8956)) ([255485e](https://github.com/swc-project/swc/commit/255485e373db506cf96448a76761113050b53c4d))


- **(es/minifier)** Abort property hoisting on `eval` ([#8957](https://github.com/swc-project/swc/issues/8957)) ([02729f2](https://github.com/swc-project/swc/commit/02729f24d8d67ce598b530f84b4eb8a9c71cc45b))

### Refactor



- **(bindings)** Make `@swc/core` a subpackage ([#8625](https://github.com/swc-project/swc/issues/8625)) ([f960d52](https://github.com/swc-project/swc/commit/f960d52364e72fa7548cc8aaaf6367dfdf7b9a8f))

## [1.5.7] - 2024-05-14

### Documentation



- **(es/typescript)** Fix example ([#8952](https://github.com/swc-project/swc/issues/8952)) ([ff60960](https://github.com/swc-project/swc/commit/ff60960afe3f2866e5c98f0414884fa93b5ab3f6))

## [1.5.6] - 2024-05-14

### Bug Fixes



- **(es)** Allow input source map file to be omitted ([#8951](https://github.com/swc-project/swc/issues/8951)) ([606cb67](https://github.com/swc-project/swc/commit/606cb677c42dd43c24ba49ad0912998e33159560))


- **(es/ast)** Pin version of unicodes ([#8941](https://github.com/swc-project/swc/issues/8941)) ([6362ff4](https://github.com/swc-project/swc/commit/6362ff4ba80afc9c887a8817582ae976a05c1d90))


- **(es/compat)** Avoid reserved name for private method ([#8949](https://github.com/swc-project/swc/issues/8949)) ([7053bb1](https://github.com/swc-project/swc/commit/7053bb16ce19ba476760b7fe0b1627d1210d6e18))


- **(es/minifier)** Abort inliner on mutation via property ([#8938](https://github.com/swc-project/swc/issues/8938)) ([257afc9](https://github.com/swc-project/swc/commit/257afc92c9b2a751935f8fdee1b84bc9222359b6))


- **(es/minifier)** Don't invoke IIFE containing reserved words ([#8939](https://github.com/swc-project/swc/issues/8939)) ([5a3456c](https://github.com/swc-project/swc/commit/5a3456c254a686ceef343ce5f9ec67b3e4644138))


- **(es/minifier)** Fix evaluation of `String.charCodeAt` ([#8946](https://github.com/swc-project/swc/issues/8946)) ([772c50f](https://github.com/swc-project/swc/commit/772c50fd7610768c43cf795b03dcae1d00f715d2))


- **(es/minifier)** Abort seq inliner on `**` ([#8947](https://github.com/swc-project/swc/issues/8947)) ([3046d71](https://github.com/swc-project/swc/commit/3046d71daa77327e7b211cfdb641e3e6148bea5f))

## [1.5.5] - 2024-05-08

### Bug Fixes



- **(css/modules)** Allow any order of composes ([#8930](https://github.com/swc-project/swc/issues/8930)) ([7014c63](https://github.com/swc-project/swc/commit/7014c63625c7c9f83322931600a52c82ba8b107a))


- **(css/modules)** Fix `:global` selectors without preceding whitespace ([#8926](https://github.com/swc-project/swc/issues/8926)) ([2405dc6](https://github.com/swc-project/swc/commit/2405dc6ba0aa227df81fda3db303fc6f523972db))


- **(es/fixer)** Wrap class expressions in callee ([#8928](https://github.com/swc-project/swc/issues/8928)) ([6b60bdb](https://github.com/swc-project/swc/commit/6b60bdb69713f7ccf603db04696621985d200d28))


- **(es/minifier)** Respect `module: false` ([#8925](https://github.com/swc-project/swc/issues/8925)) ([aca6a77](https://github.com/swc-project/swc/commit/aca6a77903e31099f473587eb9285ae1c4dee309))


- **(es/minifier)** Consider side effects of operands of binary expressions ([#8929](https://github.com/swc-project/swc/issues/8929)) ([4d4a7a9](https://github.com/swc-project/swc/commit/4d4a7a9bcb39228973c0da2991310b5107feb319))


- **(es/minifier)** Fix operand handling of `**` ([#8933](https://github.com/swc-project/swc/issues/8933)) ([c9d72cd](https://github.com/swc-project/swc/commit/c9d72cdc6aa847ba2d81eb2a99c0d0c74bc669b6))


- **(es/minifier)** Fix a bug about `Tpl` => `Str` ([#8934](https://github.com/swc-project/swc/issues/8934)) ([d4be383](https://github.com/swc-project/swc/commit/d4be3833183b829bf39c0b53407b8892517256d9))


- **(es/module)** Resolve `.jsx` imports fully ([#8936](https://github.com/swc-project/swc/issues/8936)) ([c536d2a](https://github.com/swc-project/swc/commit/c536d2ad6f731e3284df48902637e6446e91a721))

### Refactor



- **(es/minifier)** Remove unnecessary check ([#8927](https://github.com/swc-project/swc/issues/8927)) ([8932a1b](https://github.com/swc-project/swc/commit/8932a1b527a685917e7c24f5fd434a71468abcd8))

## [1.5.4] - 2024-05-06

### Bug Fixes



- **(es/decorators)** Handle ref of decorated class ([#8905](https://github.com/swc-project/swc/issues/8905)) ([af96e39](https://github.com/swc-project/swc/commit/af96e396dea75833f6ea814a019e43989b28e44a))


- **(es/minifier)** Increment `ref_count` while invoking IIFE ([#8904](https://github.com/swc-project/swc/issues/8904)) ([86e2bb0](https://github.com/swc-project/swc/commit/86e2bb04ac0ab98e242732d6a925660a6ee24fbb))


- **(es/proposal)** Fix scoping of explicit resource management pass ([#8903](https://github.com/swc-project/swc/issues/8903)) ([762b0d4](https://github.com/swc-project/swc/commit/762b0d447759a5596db2975fee7e95d80bf3fc72))

### Miscellaneous Tasks



- **(bindings)** Update types ([#8912](https://github.com/swc-project/swc/issues/8912)) ([f1c2550](https://github.com/swc-project/swc/commit/f1c2550d89e6d175fe735b8c4889472e6688068c))

<!-- generated by git-cliff -->
