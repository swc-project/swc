# Changelog
## [unreleased]

### Bug Fixes



- **(common)** Remove `<` and `>` from `Display` impl of `FileName::Custom` ([#8530](https://github.com/swc-project/swc/issues/8530)) ([014a6cd](https://github.com/swc-project/swc/commit/014a6cda8205183f6c3a5e395b6f89cbf7b388b9))


- **(es/codegen)** Fix codegen of `\\0` ([#8433](https://github.com/swc-project/swc/issues/8433)) ([9f1ce3a](https://github.com/swc-project/swc/commit/9f1ce3acd6965302afb3a65713f429fd1ddf4a2b))


- **(es/minifier)** Fix a bug in tpl string <-> string logic ([#8510](https://github.com/swc-project/swc/issues/8510)) ([4946a11](https://github.com/swc-project/swc/commit/4946a111377cfb7da5eee3df88a06e2365aac0c2))


- **(es/typescript)** Fix panic on invalid jsx pragma ([#8513](https://github.com/swc-project/swc/issues/8513)) ([f40f59b](https://github.com/swc-project/swc/commit/f40f59bd707a9d21d8eb41e42b5c6a1c95f0bb7e))

### Miscellaneous Tasks



- **(preset-env)** Update `browserslist-rs` ([#8524](https://github.com/swc-project/swc/issues/8524)) ([5e40dc7](https://github.com/swc-project/swc/commit/5e40dc7d8c7d7b979c3765fbaa2f9c9b41cf49a0))

### Testing



- **(es/codegen)** Add tests for `@ctrl/tinycolor` ([#8518](https://github.com/swc-project/swc/issues/8518)) ([1c4eb1f](https://github.com/swc-project/swc/commit/1c4eb1f54fbecef8f955172cba725c27eb4e2b7e))


- **(es/codegen)** Add a JS test for ascii-only mode ([#8519](https://github.com/swc-project/swc/issues/8519)) ([974c6a0](https://github.com/swc-project/swc/commit/974c6a0036c5ef3e3d12c81c7310758046ff0a0d))


- **(es/minifier)** Add a test for a fixed issue ([#8520](https://github.com/swc-project/swc/issues/8520)) ([8fac2bb](https://github.com/swc-project/swc/commit/8fac2bb03ce63eb66774fa007285fa8ae8575038))


- **(es/module)** Add a test for a fixed issue ([#8521](https://github.com/swc-project/swc/issues/8521)) ([4b4a0a2](https://github.com/swc-project/swc/commit/4b4a0a244deef02a86165b8fd0a070408abfa654))

## [1.3.104] - 2024-01-17

### Bug Fixes



- **(es)** Fix plugin template & restore `test!` as `test_inline!` ([#8508](https://github.com/swc-project/swc/issues/8508)) ([10449e0](https://github.com/swc-project/swc/commit/10449e08d9459af2c313eb7146005bcff016d169))


- **(es/systemjs)** Handle top level this ([#8506](https://github.com/swc-project/swc/issues/8506)) ([0f94c8c](https://github.com/swc-project/swc/commit/0f94c8cf051f7a7526f6a3e7742fc079146e0af2))


- **(plugin)** Set `swc_common::errors::HANDLER` while invoking plugins ([#8511](https://github.com/swc-project/swc/issues/8511)) ([ba753f1](https://github.com/swc-project/swc/commit/ba753f12885c4c3062afa5782dc7f6652981a659))

## [1.3.103] - 2024-01-15

### Bug Fixes



- **(binding/types)** Add type for `decoratorVersion` ([#8468](https://github.com/swc-project/swc/issues/8468)) ([79438e6](https://github.com/swc-project/swc/commit/79438e6dc24735fae1adc98e9a74ab6cecd502de))


- **(es/codegen)** Emit abstract keyword ([#8479](https://github.com/swc-project/swc/issues/8479)) ([a12eaae](https://github.com/swc-project/swc/commit/a12eaae0e544d7e485ce7ce11e56591e7ff34108))


- **(es/codegen)** Emit declare keyword for class properties ([#8478](https://github.com/swc-project/swc/issues/8478)) ([2076ef8](https://github.com/swc-project/swc/commit/2076ef8f359941ad511c860000ec3eaa74410cac))


- **(es/codegen)** Emit implements clause with commas ([#8477](https://github.com/swc-project/swc/issues/8477)) ([d98a282](https://github.com/swc-project/swc/commit/d98a28290b1c439abbd0cdec30436ef25a256ebd))


- **(es/codegen)** Emit `?` for an optional computed property ([#8481](https://github.com/swc-project/swc/issues/8481)) ([e0bdc0f](https://github.com/swc-project/swc/commit/e0bdc0f7c210c73f0291ab72e380743fe5f03b72))


- **(es/codegen)** Fix codegen of a property key in ascii-only mode ([#8493](https://github.com/swc-project/swc/issues/8493)) ([8d9bf4c](https://github.com/swc-project/swc/commit/8d9bf4cfaaeef9a9f3307b53c3349bff1359ccdf))


- **(es/compat)** Set inserted var inside export class in destructing ([#8470](https://github.com/swc-project/swc/issues/8470)) ([4416077](https://github.com/swc-project/swc/commit/4416077f4ac1afb74575b9a0e836bb66b8dc8b9a))


- **(es/compat)** Correctly handle `this` in arrow function parameters ([#8489](https://github.com/swc-project/swc/issues/8489)) ([52a8f05](https://github.com/swc-project/swc/commit/52a8f05fe419e905465e31b493d2007a1511276c))


- **(es/minifier)** Correctly escape more characters ([#8490](https://github.com/swc-project/swc/issues/8490)) ([f7c4934](https://github.com/swc-project/swc/commit/f7c4934e591bc14bc965cb28bc6b9ca1d8ac1350))


- **(es/module)** Fix resolving of `.js` files ([#8480](https://github.com/swc-project/swc/issues/8480)) ([b70e96f](https://github.com/swc-project/swc/commit/b70e96ffe93d3ed59420d5c66a0a4258f6bf1de7))


- **(es/parser)** Correctly parse the keyword ([#8483](https://github.com/swc-project/swc/issues/8483)) ([740e6f3](https://github.com/swc-project/swc/commit/740e6f390a8a5327cc320c9582dbe8afbc8b5a27))


- **(es/resolver)** Resolve top-level `undefined`, `NaN`, and `Infinity` correctly ([#8471](https://github.com/swc-project/swc/issues/8471)) ([82bd807](https://github.com/swc-project/swc/commit/82bd8070cb276d8020ba688f1b781b7b46b6ce0c))

### Documentation



- Replace `string_cache` with `hstr` in `ARCHITECTURE.md` ([#8487](https://github.com/swc-project/swc/issues/8487)) ([abd7c51](https://github.com/swc-project/swc/commit/abd7c51583dff82816a910d46e894eddea3c1aff))

### Features



- **(html/parser)** Allow self-closing `/>` on non-void HTML elements via a flag ([#8460](https://github.com/swc-project/swc/issues/8460)) ([566063d](https://github.com/swc-project/swc/commit/566063dca5fe73834cdf5e0acf7c7f344a9806a5))

### Refactor



- **(css/parser)** Remove value normalization ([#8434](https://github.com/swc-project/swc/issues/8434)) ([85be8a4](https://github.com/swc-project/swc/commit/85be8a4de1d8407421aadeb5769d414b9938f693))

### Testing



- **(es/minifier)** Enable non esm mode for tests ([#8472](https://github.com/swc-project/swc/issues/8472)) ([1120336](https://github.com/swc-project/swc/commit/1120336f23a75e8c236f088d56b6dea04311d2ed))


- **(es/minifier)** Enable script mode for `terser_exec` and `mangle` ([#8474](https://github.com/swc-project/swc/issues/8474)) ([b676e75](https://github.com/swc-project/swc/commit/b676e75cdd8ae6b4b3637152e39e982637221701))

## [1.3.102] - 2023-12-31

### Bug Fixes



- **(css/parser)** Fix parsing of `hsla(var(--foo), 1)` ([#8443](https://github.com/swc-project/swc/issues/8443)) ([d89b60a](https://github.com/swc-project/swc/commit/d89b60a000e6a40a6d624ba3903743f9c80170d1))


- **(es)** Apply `paren_remover` for minify ([#8442](https://github.com/swc-project/swc/issues/8442)) ([e68720a](https://github.com/swc-project/swc/commit/e68720a76cf8146befa26ff147a812e9ba2959aa))


- **(es/codegen)** Fix codegen of type-only export declarations ([#8447](https://github.com/swc-project/swc/issues/8447)) ([65dec90](https://github.com/swc-project/swc/commit/65dec905c076c8e95341ada23b140a538d37abce))


- **(es/codegen)** Emit `override` keyword ([#8449](https://github.com/swc-project/swc/issues/8449)) ([0dd96f8](https://github.com/swc-project/swc/commit/0dd96f85e2215f5c18849bdfb150dc95006399e8))


- **(es/compat)** Use correct `span.lo` in class transforms ([#8439](https://github.com/swc-project/swc/issues/8439)) ([a06d5b2](https://github.com/swc-project/swc/commit/a06d5b23416d8f4f45334e5edaed3da53f9f5777))


- **(es/minifier)** Add WeakRef as a safe global reference ([#8458](https://github.com/swc-project/swc/issues/8458)) ([d681785](https://github.com/swc-project/swc/commit/d681785b428b7958e7652dc3a7c709ad85b298f9))


- **(es/parser)** Disallowing await as an identifier in class static block ([#8450](https://github.com/swc-project/swc/issues/8450)) ([0b188cc](https://github.com/swc-project/swc/commit/0b188ccdff487bc5c344b0e70b102ce1d9ba308d))


- **(es/renamer)** Correctly check top level ([#8456](https://github.com/swc-project/swc/issues/8456)) ([1e44e57](https://github.com/swc-project/swc/commit/1e44e57a095c151fc52685b9580c083620342fe7))

## [1.3.101] - 2023-12-18

### Bug Fixes



- **(es/codegen)** Emit extra paren emitting `AssignExpr` ([#8413](https://github.com/swc-project/swc/issues/8413)) ([dce3693](https://github.com/swc-project/swc/commit/dce369336d873a920a9c6bd56f03286a3487ae26))


- **(es/codegen)** Fix codegen of ts specific syntax in class props ([#8426](https://github.com/swc-project/swc/issues/8426)) ([7566ddf](https://github.com/swc-project/swc/commit/7566ddf0b7802650f0f25ca7f7c607f58faa4972))


- **(es/compat)** Fix destructuring of export class/function ([#8371](https://github.com/swc-project/swc/issues/8371)) ([630f9d3](https://github.com/swc-project/swc/commit/630f9d342fcb396074168cc379776774a832d73e))


- **(es/compat)** Preserve spread in the `generator` pass ([#8401](https://github.com/swc-project/swc/issues/8401)) ([29bec98](https://github.com/swc-project/swc/commit/29bec986471b2782570416698041e3ea92feccac))


- **(es/compat)** Preserve comment for arrow body ([#8427](https://github.com/swc-project/swc/issues/8427)) ([56992e3](https://github.com/swc-project/swc/commit/56992e3dccad6f9ce37b70bf77363468c310d875))


- **(es/fixer)** Preserve parenthesis for optional chaining ([#8399](https://github.com/swc-project/swc/issues/8399)) ([a69f172](https://github.com/swc-project/swc/commit/a69f172aacb29caafef2c2af0659faf1b9154f2c))


- **(es/lints)** Ignore ambient context binding  ([#8368](https://github.com/swc-project/swc/issues/8368)) ([83c8fe5](https://github.com/swc-project/swc/commit/83c8fe56f06eec5f84b87d945262b8be119b827b))


- **(es/resolver)** Handle `TsInterfaceDecl` and `UsingDecl` correctly ([#8403](https://github.com/swc-project/swc/issues/8403)) ([f8ce316](https://github.com/swc-project/swc/commit/f8ce31627bf4a6cf5896470b415c0cbb6c84855f))

### Features



- **(es/ast)** Add `as_import_with` to `ObjectLit` to provide easier API ([#8405](https://github.com/swc-project/swc/issues/8405)) ([daf6265](https://github.com/swc-project/swc/commit/daf6265af43a8e214adbcee67512bc292d0753ef))

### Miscellaneous Tasks



- **(atoms)** Evaluate `.into()` in `AtomStoreCell` eagerly ([#8363](https://github.com/swc-project/swc/issues/8363)) ([1e8edb4](https://github.com/swc-project/swc/commit/1e8edb4769874eda94d862caee1b25513143a80e))


- **(deps)** Update `base64` to `v0.21` ([#8369](https://github.com/swc-project/swc/issues/8369)) ([c2d1a6c](https://github.com/swc-project/swc/commit/c2d1a6c9fee715d72594389360b47ed2395d8745))


- **(deps)** Update `indexmap` to `v2` ([#8370](https://github.com/swc-project/swc/issues/8370)) ([91e0fc7](https://github.com/swc-project/swc/commit/91e0fc7250bed3ccf7078938e67e8ed23a539b56))

### Performance



- **(common)** Fix OOM of `inputSourceMap` ([#8402](https://github.com/swc-project/swc/issues/8402)) ([6a73d47](https://github.com/swc-project/swc/commit/6a73d47aa132ea03abcf8008630ca1634bafe389))

### Refactor



- **(css/codegen)** Support stable rust ([#8379](https://github.com/swc-project/swc/issues/8379)) ([7cddbc6](https://github.com/swc-project/swc/commit/7cddbc618a189446d7f781a5c11f6f02bf7504e3))


- **(css/compat)** Support stable rust ([#8386](https://github.com/swc-project/swc/issues/8386)) ([bc1e328](https://github.com/swc-project/swc/commit/bc1e32829deb4ebe91ebea5ce08b5c6bc95292a3))


- **(css/lints)** Support stable rust ([#8384](https://github.com/swc-project/swc/issues/8384)) ([19d1d01](https://github.com/swc-project/swc/commit/19d1d013b2e0567a301bd7593db6e16b713e7490))


- **(css/minifier)** Support stable rust ([#8389](https://github.com/swc-project/swc/issues/8389)) ([305e72e](https://github.com/swc-project/swc/commit/305e72e67297fabefb5124922e52b15522496467))


- **(css/modules)** Support stable rust ([#8381](https://github.com/swc-project/swc/issues/8381)) ([0ff4157](https://github.com/swc-project/swc/commit/0ff4157375715b9bf6cf1ef791742707a24cfd70))


- **(css/parser)** Support stable rust ([#8378](https://github.com/swc-project/swc/issues/8378)) ([4870e8b](https://github.com/swc-project/swc/commit/4870e8b47e74939321c2e46ce0a1246ec957d342))


- **(css/prefixer)** Support stable rust ([#8385](https://github.com/swc-project/swc/issues/8385)) ([f93f2b8](https://github.com/swc-project/swc/commit/f93f2b8334e82255c21d4abf23d474ee8c6fff73))


- **(es/utils)** Use exact type for factory methods ([#8417](https://github.com/swc-project/swc/issues/8417)) ([61c304f](https://github.com/swc-project/swc/commit/61c304fa9ed7f8abb1fe303183f6512868d3e1f1))


- **(html/minifier)** Support stable rust ([#8380](https://github.com/swc-project/swc/issues/8380)) ([77145ce](https://github.com/swc-project/swc/commit/77145ce47ab66a1dbcbd614fc66886bfbec5f4f7))

### Build



- **(macros)** Drop `pmutil` to improve compile time ([#8404](https://github.com/swc-project/swc/issues/8404)) ([835151e](https://github.com/swc-project/swc/commit/835151e04d2cae8d65e4062cd1e6b01adf574373))

## [1.3.100] - 2023-11-30

### Bug Fixes



- **(es/codegen)** Fix panic due to `\\ud` ([#8346](https://github.com/swc-project/swc/issues/8346)) ([1891afa](https://github.com/swc-project/swc/commit/1891afa2ad27f183e56adcd288dd3a1ae0c5b367))


- **(es/codegen)** Wrap quote for length greater than one ([#8351](https://github.com/swc-project/swc/issues/8351)) ([2cdea3f](https://github.com/swc-project/swc/commit/2cdea3fbeaf4a2dac662a4d019982943c0a896ba))


- **(es/decorators)** Resolve enum for `design:returntype` ([#8320](https://github.com/swc-project/swc/issues/8320)) ([91ef7c9](https://github.com/swc-project/swc/commit/91ef7c9415c0efed347d3faf20653749fb7a6b15))


- **(es/fixer)** Wrap yield expression in await expression ([#8357](https://github.com/swc-project/swc/issues/8357)) ([ff719f0](https://github.com/swc-project/swc/commit/ff719f0cdd3cf79e7afa1c136243e6fa53c5abe3))


- **(es/minifier)** Fix `if_return` bug related to `await` and `yield` ([#8328](https://github.com/swc-project/swc/issues/8328)) ([01e2c7f](https://github.com/swc-project/swc/commit/01e2c7fc5ab71d55c522e48eae9e3e08d8bf418d))


- **(es/minifier)** Give up terminate merge if in `try` with `finally` ([#8342](https://github.com/swc-project/swc/issues/8342)) ([ed5a9b3](https://github.com/swc-project/swc/commit/ed5a9b3f2e5b7035f657a8ea3cb38a27413369b2))


- **(es/parser)** Wrap with `OptChain` across `TsNonNull` ([#8332](https://github.com/swc-project/swc/issues/8332)) ([8af6ffb](https://github.com/swc-project/swc/commit/8af6ffb1ddaf60b997163aaf80abfb528eb2ca9c))


- **(es/parser)** Fix conditional compilation ([#8343](https://github.com/swc-project/swc/issues/8343)) ([a423681](https://github.com/swc-project/swc/commit/a423681df897956e58650b3acc9f2331887e42e8))


- **(es/react)** Make jsx with single spread child static ([#8339](https://github.com/swc-project/swc/issues/8339)) ([58568fa](https://github.com/swc-project/swc/commit/58568fa23be932ed8f3858c24962973bdc4b8057))


- **(es/renamer)** Allow `globalThis` to be shadowed ([#8327](https://github.com/swc-project/swc/issues/8327)) ([3dd73a3](https://github.com/swc-project/swc/commit/3dd73a3cd8fddd9e19dc85c2a2bf785b585b5b9a))


- **(es/typescript)** Handle shebang with jsx pragma ([#8318](https://github.com/swc-project/swc/issues/8318)) ([c25601d](https://github.com/swc-project/swc/commit/c25601dec21d7293ad48549a1f49ccd161f9da72))

### Miscellaneous Tasks



- **(css/linter)** Document rules require porting ([#8352](https://github.com/swc-project/swc/issues/8352)) ([55da0bb](https://github.com/swc-project/swc/commit/55da0bb9ddbb661a75e24162b7bdd63d2549dca3))

### Build



- **(cargo)** Update `vergen` to `v8` ([#8325](https://github.com/swc-project/swc/issues/8325)) ([1315615](https://github.com/swc-project/swc/commit/13156157ebf9434fef8ed04ee4cf59c22421a3fa))

## [1.3.98] - 2023-11-21

### Bug Fixes



- **(es/codegen)** Check for trailing comments while emitting an arrow ([#8257](https://github.com/swc-project/swc/issues/8257)) ([0faa2c4](https://github.com/swc-project/swc/commit/0faa2c4a013abf71b5689279b454f86586d21c93))


- **(es/codegen)** Fix codegen of type args of an import type and a type query ([#8296](https://github.com/swc-project/swc/issues/8296)) ([369fb21](https://github.com/swc-project/swc/commit/369fb21e220a26ac1cbfe64846f759ac576d2c6e))


- **(es/codegen)** Fix `get_ascii_only_ident` ([#8287](https://github.com/swc-project/swc/issues/8287)) ([07c8935](https://github.com/swc-project/swc/commit/07c8935904122191b4dad141e6fe164298f46af9))


- **(es/decorators)** Minimize class declarations transformation ([#8245](https://github.com/swc-project/swc/issues/8245)) ([6992d83](https://github.com/swc-project/swc/commit/6992d83d09a7ad4c18e1dbd8389e26cc13ce0f6c))


- **(es/minifier)** Use `cooked` while converting tpls into strings ([#8248](https://github.com/swc-project/swc/issues/8248)) ([be748f0](https://github.com/swc-project/swc/commit/be748f0f33bda76a1ae4a4acd586213adfe7b2aa))


- **(es/minifier)** Enable seq inliner for const declarations ([#8255](https://github.com/swc-project/swc/issues/8255)) ([ebcd825](https://github.com/swc-project/swc/commit/ebcd8252253d2b5169ea03ec19ee4a76d3ca22c3))


- **(es/minifier)** Keep class with a static block ([#8283](https://github.com/swc-project/swc/issues/8283)) ([20fb5ba](https://github.com/swc-project/swc/commit/20fb5bab32a1e428af5e9e2203d3982d3a7ddcf3))


- **(es/minifier)** Respect `pure_funcs` for tagged tpls ([#8280](https://github.com/swc-project/swc/issues/8280)) ([1ccfc07](https://github.com/swc-project/swc/commit/1ccfc0762cdc2895d013e7730eda24d81ce53501))


- **(es/minifier)** Make `Finalizer` inline literals ([#8285](https://github.com/swc-project/swc/issues/8285)) ([73fec94](https://github.com/swc-project/swc/commit/73fec945b5b64845308ab03bea639b53e4ff021e))


- **(es/minifier)** Remove hack for built-in class names ([#8293](https://github.com/swc-project/swc/issues/8293)) ([7985e02](https://github.com/swc-project/swc/commit/7985e02fc8cf519572650ad026dba649af48d7a5))


- **(es/minifier)** Apply new `SyntaxContext` to inlined `Arrow` ([#8301](https://github.com/swc-project/swc/issues/8301)) ([c18a959](https://github.com/swc-project/swc/commit/c18a959e3a53c52c05672297a39f6eb628a076a0))


- **(es/minifier)** Apply new `SyntaxContext` to inlined `Arrow` correctly ([#8312](https://github.com/swc-project/swc/issues/8312)) ([572ad63](https://github.com/swc-project/swc/commit/572ad63e0825e4eddb511933d1a6d57184fc03c2))


- **(es/module)** Read link if an import is resolved as symlink ([#8297](https://github.com/swc-project/swc/issues/8297)) ([7dfdc12](https://github.com/swc-project/swc/commit/7dfdc1221890d373d2e6caf52bc8dee8c20765ca))


- **(es/parser)** Consider ASI while parsing TypeScript type aliases ([#8263](https://github.com/swc-project/swc/issues/8263)) ([e589126](https://github.com/swc-project/swc/commit/e58912622d86f2b03f90dd7d0782e5740822dca6))


- **(es/parser)** Adjust the context for cond expr while parsing JSX ([#8261](https://github.com/swc-project/swc/issues/8261)) ([0678c3c](https://github.com/swc-project/swc/commit/0678c3c55fa65780caf15e55919276912348943b))


- **(es/parser)** Fix ASI hazard of `static` ([#8262](https://github.com/swc-project/swc/issues/8262)) ([c128153](https://github.com/swc-project/swc/commit/c1281534b65d1d7f0069c04d35c1eb29f08e9a14))


- **(es/parser)** Fix parsing of `import type from from` ([#8309](https://github.com/swc-project/swc/issues/8309)) ([00b8839](https://github.com/swc-project/swc/commit/00b88399a0ea10dfd6d48cb168dd5ae914f11d54))


- **(es/parser)** Report error for exported reserved name ([#8313](https://github.com/swc-project/swc/issues/8313)) ([feb8a6d](https://github.com/swc-project/swc/commit/feb8a6dad99bf55cf541bd88a8f21b865c6bcd97))


- **(es/parsing)** Fix parsing of `type satisfies = 0;` ([#8305](https://github.com/swc-project/swc/issues/8305)) ([51042e0](https://github.com/swc-project/swc/commit/51042e090de246bcf92300e5ffd03139f255e77b))


- **(es/proposal)** Improve resolving of `design:returntype` ([#8303](https://github.com/swc-project/swc/issues/8303)) ([fab51e1](https://github.com/swc-project/swc/commit/fab51e18433d85f29d720ef11371411fa4ecf623))


- **(es/resolver)** Ignore qualifiers of `TsImportType` ([#8299](https://github.com/swc-project/swc/issues/8299)) ([2113bb3](https://github.com/swc-project/swc/commit/2113bb3e19131d68eb2a1c384e4ac58b2bc10f00))

### Features



- **(es/minifier)** Swap bin expr to save paren ([#8277](https://github.com/swc-project/swc/issues/8277)) ([65c3d0e](https://github.com/swc-project/swc/commit/65c3d0e3f4ec4b447e6d36f31eb40bdafdf65db7))


- **(es/minifier)** Support `format.inline_script` ([#8252](https://github.com/swc-project/swc/issues/8252)) ([f059270](https://github.com/swc-project/swc/commit/f059270348a7ee26ee8ed2d185ba71d166f43e14))

### Performance



- **(css/parser)** Use `AtomStoreCell` ([#8247](https://github.com/swc-project/swc/issues/8247)) ([302954e](https://github.com/swc-project/swc/commit/302954e4e54b7190c88667534c2dd6105f744f90))


- **(es/minifier)** Improve `format.inline_script` ([#8292](https://github.com/swc-project/swc/issues/8292)) ([7d1836d](https://github.com/swc-project/swc/commit/7d1836de3fd96786351f5ae30c2b0e7bbda2fa55))

### Refactor



- **(swc_node_base)** Rename to `swc_malloc` ([#8272](https://github.com/swc-project/swc/issues/8272)) ([9a0572b](https://github.com/swc-project/swc/commit/9a0572b9680e824ff904d7563167faa84aab47b5))


- Remove `swc_ecma_dep_graph` ([#8290](https://github.com/swc-project/swc/issues/8290)) ([7bbe5e6](https://github.com/swc-project/swc/commit/7bbe5e67d9a4316f47158bf717f8dfa86236b41b))

### Testing



- **(es/minifier)** Update test refs ([#8310](https://github.com/swc-project/swc/issues/8310)) ([a004842](https://github.com/swc-project/swc/commit/a0048427ddfd8bd9f62d5eb104dcd501bac45293))

### Build



- **(common)** Remove dependency on `string-cache` ([#8291](https://github.com/swc-project/swc/issues/8291)) ([66a4d37](https://github.com/swc-project/swc/commit/66a4d370314d45b5d4a0117401002ac43dbcba0a))


- **(es)** Remove duplicate `phf` dependency ([#8294](https://github.com/swc-project/swc/issues/8294)) ([25ac679](https://github.com/swc-project/swc/commit/25ac679bd3906c09212134859df9c75f38018822))

## [1.3.97] - 2023-11-09

### Bug Fixes



- **(css/modules)** Allow out-of-order class names for `composes` ([#8218](https://github.com/swc-project/swc/issues/8218)) ([aeb9caf](https://github.com/swc-project/swc/commit/aeb9cafd11c56d9dce41372211d90a3edb4d1848))


- **(css/modules)** Fix handling of `:global()` selector ([#8219](https://github.com/swc-project/swc/issues/8219)) ([02cd7c2](https://github.com/swc-project/swc/commit/02cd7c2608758476545aadf62e01f2d74ed486f2))

### Features



- **(es/codegen)** Respect `ascii_only: false` for `StrLit` ([#8217](https://github.com/swc-project/swc/issues/8217)) ([1a26be2](https://github.com/swc-project/swc/commit/1a26be2a271437894b1cda86c4707014e684b5ba))

### Miscellaneous Tasks



- **(bindings/node)** Upgrade jemalloc ([#8227](https://github.com/swc-project/swc/issues/8227)) ([495268f](https://github.com/swc-project/swc/commit/495268f12611161285536ccbc03304a1bf1589d0))

### Performance



- **(atoms)** Replace `string-cache` with `hstr` ([#8126](https://github.com/swc-project/swc/issues/8126)) ([aa22746](https://github.com/swc-project/swc/commit/aa22746d034c2579bcb0f0404866ff933b9037ba))


- **(atoms)** Update `hstr` to make global APIs fast ([#8241](https://github.com/swc-project/swc/issues/8241)) ([c01454a](https://github.com/swc-project/swc/commit/c01454ad4165d5e6ba58dc2b3b72910bbbc3a518))


- **(atoms)** Introduce `AtomStoreCell` ([#8232](https://github.com/swc-project/swc/issues/8232)) ([a5a6eb5](https://github.com/swc-project/swc/commit/a5a6eb53a56faa8e224f59f5cd967e5075c12edd))


- **(css/parser)** Use `AtomStore` ([#8238](https://github.com/swc-project/swc/issues/8238)) ([a3c03b3](https://github.com/swc-project/swc/commit/a3c03b30fb3aa19cb590addbf47b0583d1b05dad))


- **(es)** Delete useless partition and extend in comments ([#8214](https://github.com/swc-project/swc/issues/8214)) ([67e2c4a](https://github.com/swc-project/swc/commit/67e2c4a4fd17436732099422c25d1c0d82f815dd))


- **(es/lexer)** Remove needless clones of `Rc<RefCell<AtomStore>>` ([#8231](https://github.com/swc-project/swc/issues/8231)) ([37657b8](https://github.com/swc-project/swc/commit/37657b8bd53d848035040f31a386029ef4af7cea))


- **(es/minifier)** Remove needless operations for char freq analysis ([#8222](https://github.com/swc-project/swc/issues/8222)) ([b745ed7](https://github.com/swc-project/swc/commit/b745ed7ac8a87582d43fb2f975f53ad96ed3477b))


- **(es/parser)** Remove needless `strcmp` ops ([#8223](https://github.com/swc-project/swc/issues/8223)) ([3833cf4](https://github.com/swc-project/swc/commit/3833cf4e55a27982c930c18c901a9b06e60f92fc))


- **(es/parser)** Improve performance ([#8224](https://github.com/swc-project/swc/issues/8224)) ([e3e439d](https://github.com/swc-project/swc/commit/e3e439dba638cd631560d2eb0c2b0ec4db288e68))


- **(es/parser)** Use smarter lookup table for lexer ([#8226](https://github.com/swc-project/swc/issues/8226)) ([d4ae44a](https://github.com/swc-project/swc/commit/d4ae44ac4547ad0964bb4c3bc482c9a23c13feb9))


- **(es/typescript)** Visit ts import/export only once ([#8213](https://github.com/swc-project/swc/issues/8213)) ([a00f575](https://github.com/swc-project/swc/commit/a00f575837a44a14dd09dd634f45a64e138263b0))

### Refactor



- **(atoms)** Improve APIs ([#8249](https://github.com/swc-project/swc/issues/8249)) ([9a4bad4](https://github.com/swc-project/swc/commit/9a4bad4e9ec67a09761398eae5e6bb37e6d0d94f))

### Build



- **(cargo)** Update rustc to `nightly-2023-11-04` ([#8221](https://github.com/swc-project/swc/issues/8221)) ([14ea705](https://github.com/swc-project/swc/commit/14ea705f272968cba65399271a62e56a9943dc72))


- **(preset-env/base)** Upgrade `browserslist-rs` to `v0.13.0` ([#8229](https://github.com/swc-project/swc/issues/8229)) ([f9f305c](https://github.com/swc-project/swc/commit/f9f305cc5faa79dd13bfa5763c6250b23a2a91e3))

## [1.3.96] - 2023-11-03

### Bug Fixes



- **(ci)** Set `tag` for wasm publish actions ([#8200](https://github.com/swc-project/swc/issues/8200)) ([8db80b8](https://github.com/swc-project/swc/commit/8db80b8c28bba5a423194dd19ddf05ccd94eb650))


- **(es/compat)** Make `block-scoping` pass rename exports correctly ([#8175](https://github.com/swc-project/swc/issues/8175)) ([b13bc32](https://github.com/swc-project/swc/commit/b13bc320274e773c9b0ef479e86194c4c6f1f6f8))


- **(es/compat)** Use dummy span for blocks in `parameters` ([#8202](https://github.com/swc-project/swc/issues/8202)) ([c1b255a](https://github.com/swc-project/swc/commit/c1b255a59c1e8d81371c9576ca0c4573f04e65da))


- **(es/compat)** Handle private names from class properties pass ([#8090](https://github.com/swc-project/swc/issues/8090)) ([83a5a0c](https://github.com/swc-project/swc/commit/83a5a0c612b7ca97529720f8a35117957d4cb9a6))


- **(es/react)** Visit children nodes in `jsx-src` pass ([#8212](https://github.com/swc-project/swc/issues/8212)) ([47733a9](https://github.com/swc-project/swc/commit/47733a951c14bc22c2a60acb420b597ddab7d306))


- **(es/transforms)** Do not add `PURE` comment to `BytePos(0)` ([#8207](https://github.com/swc-project/swc/issues/8207)) ([c061356](https://github.com/swc-project/swc/commit/c061356b63431fcd0323e434402ead143c622340))


- **(es/typescript)** Preserve const enum for named export ([#8208](https://github.com/swc-project/swc/issues/8208)) ([abced23](https://github.com/swc-project/swc/commit/abced23b2a16e9602ffe59a20e6cbf65a882a3ce))

### Features



- **(es/minifier)** Respect inline level and preserve native names ([#8205](https://github.com/swc-project/swc/issues/8205)) ([dd805e9](https://github.com/swc-project/swc/commit/dd805e95a4735e1b869c298489b80555ab4eb20d))


- **(es/preset-env)** Update compat data ([#8194](https://github.com/swc-project/swc/issues/8194)) ([3dc4e1e](https://github.com/swc-project/swc/commit/3dc4e1e02d3e594da6301ca4c80aaee582642fd7))


- **(es/testing)** Support babel-like fixture testing officially ([#8190](https://github.com/swc-project/swc/issues/8190)) ([e960614](https://github.com/swc-project/swc/commit/e9606147fc560cac2ffa75b917a08413b7c94908))


- **(es/testing)** Use `__swc_snapshots__` for `test!` macro ([#8191](https://github.com/swc-project/swc/issues/8191)) ([0aafa75](https://github.com/swc-project/swc/commit/0aafa75fef43beb6630b143e9d71f129300e7614))

### Performance



- **(es/minifier)** Add `has_flag` to `Comments` ([#8182](https://github.com/swc-project/swc/issues/8182)) ([7530e90](https://github.com/swc-project/swc/commit/7530e9051d67d8721126e48c39f0a8ac27d980a5))

### Refactor



- **(es/minifier)** Simplify analyzer context ([#8164](https://github.com/swc-project/swc/issues/8164)) ([bb02cdd](https://github.com/swc-project/swc/commit/bb02cdd26ed863649c6ec8ef9c5cbdaece743b9b))

## [1.3.95] - 2023-10-24

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

### Refactor



- **(es/ast)** Reimplement optional chaining ([#7441](https://github.com/swc-project/swc/issues/7441)) ([aa83584](https://github.com/swc-project/swc/commit/aa83584634286d7c741d903ad94ba5228c89bc62))


- **(es/ast)** Remove unused fields ([#7518](https://github.com/swc-project/swc/issues/7518)) ([3958f17](https://github.com/swc-project/swc/commit/3958f1792c4598e965f36a11c567c95f69984a9f))

<!-- generated by git-cliff -->
