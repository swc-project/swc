# Changelog
## [unreleased]

### Bug Fixes



- **(es/transformer)** Complete `replace_this_in_expr` implementation ([#11361](https://github.com/swc-project/swc/issues/11361)) ([58c4067](https://github.com/swc-project/swc/commit/58c406723e78fbe87011450dd87edbf52508c08e))

### Features



- **(es/parser)** Support `no_paren` parser option ([#11359](https://github.com/swc-project/swc/issues/11359)) ([5b9d77c](https://github.com/swc-project/swc/commit/5b9d77c1c89ade5772c6feee429386faf3b93a39))


- **(es/parser)** Revert `no_paren` parser option ([#11362](https://github.com/swc-project/swc/issues/11362)) ([57a8731](https://github.com/swc-project/swc/commit/57a87313194f825efc2ce91d41fb27b8e1e9d9aa))


- **(es/transformer)** Merge `async_to_generator` ([#11358](https://github.com/swc-project/swc/issues/11358)) ([25f3a47](https://github.com/swc-project/swc/commit/25f3a4724d48e7fe32eebacd743f1ab623681e46))


- **(es/transformer)** Merge `object_rest_spread` ([#11357](https://github.com/swc-project/swc/issues/11357)) ([752188e](https://github.com/swc-project/swc/commit/752188ef85d8b0b36d8d60e962d5fbe6349b6263))


- **(es/transformer)** Merge `nullish_coalescing` ([#11365](https://github.com/swc-project/swc/issues/11365)) ([5fb686a](https://github.com/swc-project/swc/commit/5fb686a2c2fca583707406b7d2fec1a60bf9d4c9))

### Performance



- **(es/compat)** Use merged transformer ([#11366](https://github.com/swc-project/swc/issues/11366)) ([c4a5e79](https://github.com/swc-project/swc/commit/c4a5e7989bf0bb943051c56d03f8121d921c9f13))

## [swc_core@v50.1.3] - 2025-12-08

## [swc_core@v50.1.2] - 2025-12-08

### Features



- **(es/transformer)** Merge `async-to-generator` ([#11355](https://github.com/swc-project/swc/issues/11355)) ([c388e87](https://github.com/swc-project/swc/commit/c388e870cae2e9253f1ef39f659aebe7470ea741))

## [swc_core@v50.1.1] - 2025-12-08

### Bug Fixes



- **(es/parser)** Handle TypeScript expressions in destructuring patterns ([#11353](https://github.com/swc-project/swc/issues/11353)) ([160ec34](https://github.com/swc-project/swc/commit/160ec343404d7363e94a447be5c23bed2ab50e37))

## [swc_core@v50.1.0] - 2025-12-05

### Bug Fixes



- **(es/compat)** Fix parameter default value evaluation order with object rest ([#11352](https://github.com/swc-project/swc/issues/11352)) ([2ebb261](https://github.com/swc-project/swc/commit/2ebb261c90ab24290a8b972bd4bd7b5b452ddefc))

### Features



- **(es/transfomer)** Add modules to prepare porting ([#11347](https://github.com/swc-project/swc/issues/11347)) ([68d740c](https://github.com/swc-project/swc/commit/68d740cc5c2097954d0a7827775af7ac0b3f7cee))


- **(es/transform)** Add common fields ([#11346](https://github.com/swc-project/swc/issues/11346)) ([1a8759f](https://github.com/swc-project/swc/commit/1a8759f30b1d2253bd5e267f68970ca58f301b68))

### Performance



- **(es/compat)** Merge `optional_catch_binding` ([#11313](https://github.com/swc-project/swc/issues/11313)) ([468d20c](https://github.com/swc-project/swc/commit/468d20cf811794e2e905617b4426e8d593cbca59))

## [swc_core@v50.0.0] - 2025-12-04

### Bug Fixes



- **(es/compat)** Preserve return value for single-property object destructuring ([#11334](https://github.com/swc-project/swc/issues/11334)) ([847ad22](https://github.com/swc-project/swc/commit/847ad222a9a95e189850172345b0c26dfeb6c225))


- **(es/compat)** Fix generator transform for compound assignments, for-in, and labeled break ([#11339](https://github.com/swc-project/swc/issues/11339)) ([9b6bedd](https://github.com/swc-project/swc/commit/9b6bedd6dab07f81808ee949c769c24e7ecda8a0))


- **(es/compat)** Destructuring evaluation order ([#11337](https://github.com/swc-project/swc/issues/11337)) ([49d04c7](https://github.com/swc-project/swc/commit/49d04c750dc771a6b4a01ae7a0b438f48098a485))


- **(es/helpers)** Avoid extra trap calls on excluded keys in object rest spread ([#11338](https://github.com/swc-project/swc/issues/11338)) ([4662caf](https://github.com/swc-project/swc/commit/4662caf427c67a2aea7dade478b0f7c00276b30e))

### Performance



- **(es/parser)** Small optimization after byte-based lexer ([#11340](https://github.com/swc-project/swc/issues/11340)) ([c92ea4e](https://github.com/swc-project/swc/commit/c92ea4ec5f32654921efaee9af8cb09dc39457df))


- **(es/parser)** Use `slice` rather than matching keywords ([#11341](https://github.com/swc-project/swc/issues/11341)) ([b6ad2cb](https://github.com/swc-project/swc/commit/b6ad2cb114c99676c912ffa6984e50da677630cf))

## [swc_core@v49.0.0] - 2025-11-27

### Bug Fixes



- **(es/minifier)** Fix `debug` cargo feature ([#11325](https://github.com/swc-project/swc/issues/11325)) ([be86fad](https://github.com/swc-project/swc/commit/be86fad7e9b935faac2da7d881a6991295a6dbad))


- **(es/minifier)** Fix optimization pass for `merge_imports` ([#11331](https://github.com/swc-project/swc/issues/11331)) ([ca2f7ed](https://github.com/swc-project/swc/commit/ca2f7ed0d06c7d0971102875a5463176d0dd5204))


- **(es/parser)** Don't call `bump_bytes` in the `continue_if` of `byte_search!` ([#11328](https://github.com/swc-project/swc/issues/11328)) ([583619d](https://github.com/swc-project/swc/commit/583619d019b548621becb8fb0c895dd9ce85da71))


- **(es/parser)** Support type-only string literal in import specifiers ([#11333](https://github.com/swc-project/swc/issues/11333)) ([07762f1](https://github.com/swc-project/swc/commit/07762f13e9ddc5e756b545cb2a6877f427733406))

### Performance



- **(es/compat)** Merge `exponentation_operator` ([#11310](https://github.com/swc-project/swc/issues/11310)) ([0ef3637](https://github.com/swc-project/swc/commit/0ef3637606035ce6258c9893fe458bc80c598574))


- **(parser)** Make all parsers work by byte instead of char  ([#11318](https://github.com/swc-project/swc/issues/11318)) ([725efd1](https://github.com/swc-project/swc/commit/725efd16c67f4f2d42c6b3c673cb0ad473ff0ff3))

## [swc_core@v48.0.4] - 2025-11-22

### Bug Fixes



- **(es/fixer)** Preserve parens around IFFE in binary expressions within sequences ([#11324](https://github.com/swc-project/swc/issues/11324)) ([a4c84ea](https://github.com/swc-project/swc/commit/a4c84ea7807839a87300d2e931b6a457f248b33a))

## [swc_core@v48.0.3] - 2025-11-21

### Performance



- **(es/parser)** Optimize `byte_search!` ([#11323](https://github.com/swc-project/swc/issues/11323)) ([67f67c1](https://github.com/swc-project/swc/commit/67f67c1dcb45203601d96d4e7a77cb4c16e82d79))

## [swc_core@v48.0.2] - 2025-11-20

### Bug Fixes



- **(es/minifier)** Remove unused arrow functions in dead code elimination ([#11319](https://github.com/swc-project/swc/issues/11319)) ([88c6ac7](https://github.com/swc-project/swc/commit/88c6ac7eb05e3367d3d14e40bad8468218576783))

## [swc_core@v48.0.1] - 2025-11-20

### Bug Fixes



- **(es/plugin)** Use `#[cfg]` to avoid compilation error ([#11316](https://github.com/swc-project/swc/issues/11316)) ([f615cdb](https://github.com/swc-project/swc/commit/f615cdbc52773b4899fb7831992272088013acc0))

## [swc_core@v48.0.0] - 2025-11-19

### Bug Fixes



- **(es/codegen)** Emit comments of all nodes ([#11314](https://github.com/swc-project/swc/issues/11314)) ([387ee0f](https://github.com/swc-project/swc/commit/387ee0f4d864212d38c008f4d3b715b17036fbef))

### Miscellaneous Tasks



- **(es/transformer)** Determine project structure ([#11306](https://github.com/swc-project/swc/issues/11306)) ([58f2602](https://github.com/swc-project/swc/commit/58f2602981fd5d2efeabc44dc59fbc07dbb4e7cd))

### Performance



- **(es/compat)** Merge `regexp` pass into `Transformer` ([#11307](https://github.com/swc-project/swc/issues/11307)) ([440b391](https://github.com/swc-project/swc/commit/440b391e65fab9514c40e65145828c956b8b437b))


- **(es/compat)** Merge `export_namespace_from` to `Transformer` ([#11309](https://github.com/swc-project/swc/issues/11309)) ([7a528ce](https://github.com/swc-project/swc/commit/7a528ce66ef1a8b715b702de5d246d60a093ab70))

### Refactor



- **(es/transfomer)** Prevent breaking change ([#11308](https://github.com/swc-project/swc/issues/11308)) ([45827fa](https://github.com/swc-project/swc/commit/45827fac5d0d0434f425769f6b3f4383617355e0))

## [swc_core@v47.0.9] - 2025-11-19

### Bug Fixes



- **(es/codegen)** Restore missing top-level comments ([#11302](https://github.com/swc-project/swc/issues/11302)) ([0998c93](https://github.com/swc-project/swc/commit/0998c93a5ad391a6cc7bd25eb08104f825a29ac4))

## [swc_core@v47.0.8] - 2025-11-18

### Bug Fixes



- **(es/quote)** Replace usage of `swc_atoms` with `swc_core::atoms` ([#11299](https://github.com/swc-project/swc/issues/11299)) ([c1e32fa](https://github.com/swc-project/swc/commit/c1e32fafd3dd8c2424331730c6ebc03bc793b058))

## [swc_core@v47.0.7] - 2025-11-17

### Bug Fixes



- **(es/minifier)** Prevent compress.comparisons from transforming expressions with side effects ([#11256](https://github.com/swc-project/swc/issues/11256)) ([58a9d81](https://github.com/swc-project/swc/commit/58a9d81959162778f6ca1200436c90f3545bd387))


- **(es/parser)** Make the span of Program start at input start ([#11199](https://github.com/swc-project/swc/issues/11199)) ([b56e008](https://github.com/swc-project/swc/commit/b56e0083c60e9d96fbe7aef9de20ff83d4c77279))

## [swc_core@v47.0.6] - 2025-11-14

### Bug Fixes



- **(bindings/es)** Respect `filename` option from `print()` ([#11264](https://github.com/swc-project/swc/issues/11264)) ([0d4d2d9](https://github.com/swc-project/swc/commit/0d4d2d9ab4e912ecf9e17e7c9b49d26b320c1d98))

### Performance



- **(es/plugin)** Use shared tokio runtime to avoid creation overhead ([#11267](https://github.com/swc-project/swc/issues/11267)) ([707026b](https://github.com/swc-project/swc/commit/707026bee1e0d98ec3602ef9d3aac348c7184940))

## [swc_core@v47.0.5] - 2025-11-13

### Features



- **(es/minifier)** Drop empty constructors during minification ([#11250](https://github.com/swc-project/swc/issues/11250)) ([2cea7dd](https://github.com/swc-project/swc/commit/2cea7ddb58390253fed44a4033c71d2333271691))


- **(es/visit)** Add context parameter to VisitMutHook trait ([#11254](https://github.com/swc-project/swc/issues/11254)) ([8645d0d](https://github.com/swc-project/swc/commit/8645d0de8fcbd61d7a69235ac485debb64497205))

### Performance



- **(es/parser)** Inline `skip_space` ([afb824a](https://github.com/swc-project/swc/commit/afb824a97f3d917090e14a8289339ee259f42239))


- **(es/parser)** Eliminate the outer loop of `skip_block_comment` ([#11261](https://github.com/swc-project/swc/issues/11261)) ([e41c0ac](https://github.com/swc-project/swc/commit/e41c0ac9d5e5e4956f826bceea43f01ad729725e))

## [swc_core@v47.0.4] - 2025-11-08

### Bug Fixes



- **(cli)** Print filename to stderr when compiling ([#11249](https://github.com/swc-project/swc/issues/11249)) ([d66dab5](https://github.com/swc-project/swc/commit/d66dab575c0ea7084b8e3c07155990fc93ef636f))

### Features



- **(es/compiler)** Determine module structure ([#11238](https://github.com/swc-project/swc/issues/11238)) ([415019c](https://github.com/swc-project/swc/commit/415019c6da388180cb590e802b17206692ec95a4))


- **(ts/fast-strip)** Add a binding crate for nodejs/amaro ([#11236](https://github.com/swc-project/swc/issues/11236)) ([f0829af](https://github.com/swc-project/swc/commit/f0829af6da69e9e5da73a8e114181601d6e50400))


- **(visit)** Add hook APIs for visitors ([#11242](https://github.com/swc-project/swc/issues/11242)) ([3a141ed](https://github.com/swc-project/swc/commit/3a141ed230c0be9660441d6ff14edd82ea41e2d4))

### Miscellaneous Tasks



- **(es/compiler)** Drop `syntax_ext` and prepare AI-based porting ([#11239](https://github.com/swc-project/swc/issues/11239)) ([15639c0](https://github.com/swc-project/swc/commit/15639c0abfa5569873fd75a6778fa8ec2d31f197))

### Performance



- **(common)** Improve `StringInput#bump_bytes` ([#11230](https://github.com/swc-project/swc/issues/11230)) ([6a9fa49](https://github.com/swc-project/swc/commit/6a9fa49117e037aa77bcdd1b0b50f2e08697c05e))

### Refactor



- **(visit)** Use separate crate for hooks ([#11243](https://github.com/swc-project/swc/issues/11243)) ([d93ec90](https://github.com/swc-project/swc/commit/d93ec903acdd9029da179281fb93b4af76dc93f5))

## [swc_core@v47.0.3] - 2025-11-04

### Bug Fixes



- **(es/minifier)** Prevent array destructuring optimization in assignment contexts ([#11221](https://github.com/swc-project/swc/issues/11221)) ([99d8b0a](https://github.com/swc-project/swc/commit/99d8b0a6257bbc47bc75477a7e3b265c50ad44f5))

### Performance



- **(es/parser)** Optimize `skip_space` ([#11225](https://github.com/swc-project/swc/issues/11225)) ([541d252](https://github.com/swc-project/swc/commit/541d252b98298cf71b7d5b773f68a0b7ec4ef087))

## [swc_core@v47.0.2] - 2025-11-04

### Performance



- **(plugin)** Avoid data copy when transformation finished ([#11223](https://github.com/swc-project/swc/issues/11223)) ([af134fa](https://github.com/swc-project/swc/commit/af134faecd5979126165a5462abf880c70b5b54b))

## [swc_core@v47.0.1] - 2025-11-03

### Bug Fixes



- **(cli)** Update plugin template to use VisitMut API ([#11218](https://github.com/swc-project/swc/issues/11218)) ([6a87e41](https://github.com/swc-project/swc/commit/6a87e41fbaf2f97e2f530d8560df7bb9e0ba1a12))


- **(hstr)** Skip only `\u` for unicode ([#11216](https://github.com/swc-project/swc/issues/11216)) ([eda01e5](https://github.com/swc-project/swc/commit/eda01e5284ad5b1eda538eda7231795d75f7136f))

### Features



- **(hstr)** Support checked `from_bytes` for Wtf8Buf and Wtf8 ([#11211](https://github.com/swc-project/swc/issues/11211)) ([1430489](https://github.com/swc-project/swc/commit/1430489460a54598300427bfc7ed0f4a30bf8d63))

### Performance



- **(es/parser)** Remove `start` in `State` ([#11201](https://github.com/swc-project/swc/issues/11201)) ([b9aeaa3](https://github.com/swc-project/swc/commit/b9aeaa3a3bab072f90fb8f26454cb33062bff584))

### Refactor



- **(ast)** Introduce flexible serialization encoding for AST ([#11100](https://github.com/swc-project/swc/issues/11100)) ([8ad3647](https://github.com/swc-project/swc/commit/8ad36478160ff848466bbff2bf442224696982bf))


- **(plugin)** Switch plugin abi to flexible serialization ([#11198](https://github.com/swc-project/swc/issues/11198)) ([e5feaf1](https://github.com/swc-project/swc/commit/e5feaf15cebb2887cd8dc9d0275c4ec0fbf40d30))


- Flatten cargo workspaces ([#11213](https://github.com/swc-project/swc/issues/11213)) ([6223100](https://github.com/swc-project/swc/commit/622310055c59ee42b744038a33997e6f43cf4af0))

### Testing



- Copy opt-level configs to the top level workspace ([#11210](https://github.com/swc-project/swc/issues/11210)) ([dba23f5](https://github.com/swc-project/swc/commit/dba23f5a72d26b3b62fbafe2d8a65c69c3642669))

## [swc_core@v46.0.3] - 2025-10-30

### Performance



- **(atoms)** Remove temporary allocations in rkyv serialize and deserialize ([#11202](https://github.com/swc-project/swc/issues/11202)) ([85e6e8a](https://github.com/swc-project/swc/commit/85e6e8a66f0e517512d7cd13c5b287b1ef82e191))

## [swc_core@v46.0.2] - 2025-10-29

### Performance



- **(es/parser)** Remove `had_line_break_before_last` ([#11200](https://github.com/swc-project/swc/issues/11200)) ([7b5bcd7](https://github.com/swc-project/swc/commit/7b5bcd7abe2f4d7c048c350c7403ad719ce52bee))

## [swc_core@v46.0.1] - 2025-10-28

### Bug Fixes



- **(atoms)** Fix broken quote macro ([#11195](https://github.com/swc-project/swc/issues/11195)) ([3485179](https://github.com/swc-project/swc/commit/3485179196c056b913cdc7507ed5f3bb282623ee))


- **(hstr)** Fix unsoundness of `wtf8`'s transmutation ([#11194](https://github.com/swc-project/swc/issues/11194)) ([f27e65b](https://github.com/swc-project/swc/commit/f27e65b94b517204944505a3c0e11b6033407594))

## [swc_core@v46.0.0] - 2025-10-28

### Bug Fixes



- **(es/ast)** Fix unicode unpaired surrogates handling ([#11144](https://github.com/swc-project/swc/issues/11144)) ([845512c](https://github.com/swc-project/swc/commit/845512c67819cd37bb25601d34bd5b1ac79afca3))

### Features



- **(es/compiler)** Merge `nullish_coalescing` into `Compiler` ([#11157](https://github.com/swc-project/swc/issues/11157)) ([dd6f71b](https://github.com/swc-project/swc/commit/dd6f71b92fecd0137af3cf16d72799afc3ce30d6))


- **(es/parser)** Add an error for empty type args for generic ([#11164](https://github.com/swc-project/swc/issues/11164)) ([9a1fa84](https://github.com/swc-project/swc/commit/9a1fa847a74fd288013aeff8947b5ca331eee00f))

### Miscellaneous Tasks



- **(binding_macros)** Add `default-features = false` ([#11193](https://github.com/swc-project/swc/issues/11193)) ([85d855f](https://github.com/swc-project/swc/commit/85d855fd0478f989bac5d62caad668497f497137))

### Refactor



- **(bindings)** Adjust compile options ([#11190](https://github.com/swc-project/swc/issues/11190)) ([4c6df95](https://github.com/swc-project/swc/commit/4c6df954df6eb1476b65b6c53bfc72e9b856f8e9))


- **(bindings)** Add `opt-level = s` to more crates ([#11191](https://github.com/swc-project/swc/issues/11191)) ([ed63413](https://github.com/swc-project/swc/commit/ed63413d3f0b9b19e717361a09ef938f243400cf))


- **(es/ast)** Cherry-pick #10763 ([#11182](https://github.com/swc-project/swc/issues/11182)) ([e93ffde](https://github.com/swc-project/swc/commit/e93ffde52f33a6b65ad9a595cb73776a9064e7c3))


- **(es/parser)** Detach `swc_ecma_parser` from `swc_ecma_lexer` ([#11148](https://github.com/swc-project/swc/issues/11148)) ([94f175d](https://github.com/swc-project/swc/commit/94f175d643f38477d2c84f00c8602bfebdb7b343))

## [swc_core@v45.0.2] - 2025-10-23

### Bug Fixes



- **(bindings)** Improve ARM64 and Alpine Linux (musl) binary loading and validation ([#11173](https://github.com/swc-project/swc/issues/11173)) ([f9be4d7](https://github.com/swc-project/swc/commit/f9be4d7a37a6b358fe34f0c25fa7391b3a375509))


- **(es/helpers)** Fix SuppressedError argument order in explicit resource management ([#11172](https://github.com/swc-project/swc/issues/11172)) ([7693fb9](https://github.com/swc-project/swc/commit/7693fb909fa2541ca4182a932c6834895f25956e))


- **(es/minifier)** Fix inlining of hoisted functions in param ([#11161](https://github.com/swc-project/swc/issues/11161)) ([5a4088d](https://github.com/swc-project/swc/commit/5a4088d73ab12c7cb59f577e80fc9e5b0edadd07))


- **(es/parser)** Support literal computed property names in enums ([#11163](https://github.com/swc-project/swc/issues/11163)) ([146c77c](https://github.com/swc-project/swc/commit/146c77c04d4cb002326fffffce0a282366d890bf))

## [swc_core@v45.0.1] - 2025-10-21

### Bug Fixes



- **(es/minifier)** Fix inlining of hoisted functions ([#11159](https://github.com/swc-project/swc/issues/11159)) ([bd55d30](https://github.com/swc-project/swc/commit/bd55d30811d5f421b43dc70fd9c05d2f2b56a049))

## [swc_core@v45.0.0] - 2025-10-20

### Bug Fixes



- **(es/codegen)** Encode non-ASCII chars in regex with ascii_only option ([#11155](https://github.com/swc-project/swc/issues/11155)) ([b6f4d1f](https://github.com/swc-project/swc/commit/b6f4d1f8b76aa6661dd35c04492d5fee0f7803ba))


- **(es/compat)** Preserve AutoAccessor to prevent panic ([#11150](https://github.com/swc-project/swc/issues/11150)) ([101c3b7](https://github.com/swc-project/swc/commit/101c3b7ce7851d38f0751913b13fd670088d909f))


- **(es/decorators)** Emit correct metadata for enum parameters ([#11154](https://github.com/swc-project/swc/issues/11154)) ([630484f](https://github.com/swc-project/swc/commit/630484f8560db3dcbc5aaa198ff89241a8aef023))

### Features



- **(es/minifier)** Add merge_imports optimization pass to reduce bundle size ([#11151](https://github.com/swc-project/swc/issues/11151)) ([a01dee1](https://github.com/swc-project/swc/commit/a01dee106c327d166e2a5fd815b69258164b2821))

### Miscellaneous Tasks



- **(deps)** Update lru crate from 0.10.1 to 0.16.1 ([#11145](https://github.com/swc-project/swc/issues/11145)) ([e347c5b](https://github.com/swc-project/swc/commit/e347c5bafe6645a0d099bf1da6083213de967064))

### Refactor



- **(ast_node)** Make AST enums `non_exhaustive` ([#11115](https://github.com/swc-project/swc/issues/11115)) ([f328e4a](https://github.com/swc-project/swc/commit/f328e4a560f7564d1c10b58bcb7d684ff6a7a3b1))

## [swc_core@v44.0.2] - 2025-10-04

### Bug Fixes



- **(es/react)** Use correct span for `@jsxFrag` as null literal ([#11139](https://github.com/swc-project/swc/issues/11139)) ([9353763](https://github.com/swc-project/swc/commit/9353763e4d7f880ac3175bbdc058a3c3b3bea3bb))

## [swc_core@v44.0.1] - 2025-10-02

### Bug Fixes



- **(es/parser)** Handle JSX attributes with keyword prefixes correctly ([#11136](https://github.com/swc-project/swc/issues/11136)) ([d3cd97f](https://github.com/swc-project/swc/commit/d3cd97fef10518507249d4b0b82983320483ee1c))

## [swc_core@v44.0.0] - 2025-10-01

### Bug Fixes



- **(es/compat)** Apply `Array.prototype.slice` to `arguments` in loose spread ([#11122](https://github.com/swc-project/swc/issues/11122)) ([66428a2](https://github.com/swc-project/swc/commit/66428a2b07fcded28b779860de3b13acd86e6647))


- **(es/compat)** Handle sparse arrays correctly in generator transforms ([#11131](https://github.com/swc-project/swc/issues/11131)) ([9cd4334](https://github.com/swc-project/swc/commit/9cd43343d39ccb0be43f8ce9e8e2cd74c18db4af))


- **(es/transforms)** Check errors::HANDLER.is_set() before failing ([#11130](https://github.com/swc-project/swc/issues/11130)) ([1c9ab27](https://github.com/swc-project/swc/commit/1c9ab2719ca21e4fcc4598c7877648d44f22311c))

### Miscellaneous Tasks



- **(claude)** Use Sonnet 4.5 instead of Opus ([c79e1e5](https://github.com/swc-project/swc/commit/c79e1e50ad33d538aeb900fb2662e86e8e7b442c))

## [swc_core@v43.0.1] - 2025-09-28

### Features



- **(bindings)** Introduce AST Viewer to improve debugging experience ([#10963](https://github.com/swc-project/swc/issues/10963)) ([fa3aacc](https://github.com/swc-project/swc/commit/fa3aacc8425af7075d5af8596c0347de08d3f816))

## [swc_core@v43.0.0] - 2025-09-26

### Bug Fixes



- **(es/minifier)** Preserve `__proto__` shorthand property behavior ([#11123](https://github.com/swc-project/swc/issues/11123)) ([63dbd1d](https://github.com/swc-project/swc/commit/63dbd1df2c01e6174c2452ca2476a5f7d6920194))


- **(es/parser)** Parse `(void)` correctly as arrow function return type ([#11125](https://github.com/swc-project/swc/issues/11125)) ([d3e5dd3](https://github.com/swc-project/swc/commit/d3e5dd37f4f6994371c0ff846c0319edeede7fd0))

### Performance



- **(es/minifier)** Reduce clone of atoms ([#11076](https://github.com/swc-project/swc/issues/11076)) ([89dcb36](https://github.com/swc-project/swc/commit/89dcb360115a9b3d0450c8d2ee9a90fa296e4b74))

## [swc_core@v42.1.0] - 2025-09-24

### Features



- **(hstr)** Introduce `Wtf8Atom` ([#11104](https://github.com/swc-project/swc/issues/11104)) ([8cfd47b](https://github.com/swc-project/swc/commit/8cfd47b95a6bc100598dbec2829850be12d7fda1))

## [swc_core@v42.0.4] - 2025-09-23

### Features



- **(es/minifier)** Optimize (a | 0) ^ b ([#11110](https://github.com/swc-project/swc/issues/11110)) ([7af1474](https://github.com/swc-project/swc/commit/7af1474488d483b2fac9eb86afe7036411f59cb5))

### Testing



- **(core)** Fix CI ([#11117](https://github.com/swc-project/swc/issues/11117)) ([52dca39](https://github.com/swc-project/swc/commit/52dca391c9b496b7cf3d516d1c7c80a998f39d65))

## [swc_core@v42.0.3] - 2025-09-22

### Bug Fixes



- **(es/compat)** Preserve comment when transform template with no expr ([#11109](https://github.com/swc-project/swc/issues/11109)) ([80e8408](https://github.com/swc-project/swc/commit/80e84085466e171fddf629417e7e1698a7721dd8))


- **(es/minifier)** Inline block stmt into expr ([#11107](https://github.com/swc-project/swc/issues/11107)) ([72a53a0](https://github.com/swc-project/swc/commit/72a53a0de5ddf5d5163369b18d7c90c0baeb4280))


- **(es/minifier)** Allow MultiReplacer to inline multiple times ([#11106](https://github.com/swc-project/swc/issues/11106)) ([fe8e981](https://github.com/swc-project/swc/commit/fe8e981a4dc516a236aa24da7d2c430d95876dae))

## [swc_core@v42.0.1] - 2025-09-16

### Bug Fixes



- **(ci)** Test chanages ([d4396c1](https://github.com/swc-project/swc/commit/d4396c158a6d9ebedc7116f6228035e504a197fe))


- **(swc_common)** Fix compatibility with serde 1.0.220+ ([#11094](https://github.com/swc-project/swc/issues/11094)) ([45f17ed](https://github.com/swc-project/swc/commit/45f17edccc1c3b83e75d42e3459b16c08fd6d76f))

## [swc_core@v41.0.0] - 2025-09-15

### Bug Fixes



- **(es/minifier)** Check in param before add ident ([#11091](https://github.com/swc-project/swc/issues/11091)) ([2e61f44](https://github.com/swc-project/swc/commit/2e61f44821c51a7a450f22fbbddf560872143246))

## [swc_core@v40.0.0] - 2025-09-12

### Bug Fixes



- **(es/compat)** Preserve `typeof` symbol in loose mode ([#11072](https://github.com/swc-project/swc/issues/11072)) ([d92c3bd](https://github.com/swc-project/swc/commit/d92c3bde2d2a43677cccd981e82f5d3238cc23e7))


- **(es/parser)** Capture more tokens ([#11081](https://github.com/swc-project/swc/issues/11081)) ([6b381c9](https://github.com/swc-project/swc/commit/6b381c9d918c27b60184c4089eac95d345ec9d67))

### Features



- **(es/transforms)** Support `rewriteRelativeImportExtensions` ([#11036](https://github.com/swc-project/swc/issues/11036)) ([038964a](https://github.com/swc-project/swc/commit/038964a182011fe27d2b5f7a1aa1cbe7c4c4ca7a))

## [swc_core@v39.0.3] - 2025-09-11

### Bug Fixes



- **(es/minifier)** Remove `undefined` initializer iff the name is an ident ([#11080](https://github.com/swc-project/swc/issues/11080)) ([0058709](https://github.com/swc-project/swc/commit/0058709f6f881359a161ee6745373820141c69f9))

## [swc_core@v39.0.1] - 2025-09-09

### Bug Fixes



- **(plugin/runner)** Fix wasmtime backend cache corruption ([#11077](https://github.com/swc-project/swc/issues/11077)) ([1e8b92f](https://github.com/swc-project/swc/commit/1e8b92fd0b8f59aef58775b12a4f973e935a5e2c))

### Features



- **(@swc/types)** Add `preserve` to `react.runtime` ([#11068](https://github.com/swc-project/swc/issues/11068)) ([50354a1](https://github.com/swc-project/swc/commit/50354a190ef19f49b506aab4a0e91908b38186f2))

### Performance



- **(es/codegen)** Remove `char` comprison ([#11074](https://github.com/swc-project/swc/issues/11074)) ([078e319](https://github.com/swc-project/swc/commit/078e319285d0117b6c6fd06c1c5c4a5b1c1c83d8))


- **(es/minifier)** Lazy get type ([#11075](https://github.com/swc-project/swc/issues/11075)) ([eb0d615](https://github.com/swc-project/swc/commit/eb0d61548a9796822361787242268ed019c108e7))

## [swc_core@v39.0.0] - 2025-09-06

### Bug Fixes



- **(es/ast)** Fix unicode lone surrogates handling ([#10987](https://github.com/swc-project/swc/issues/10987)) ([0557609](https://github.com/swc-project/swc/commit/0557609d6f862f7632a67ce91163571e5284163f))


- **(es/compat)** Handle `super` in nested arrow function ([#11056](https://github.com/swc-project/swc/issues/11056)) ([63c5413](https://github.com/swc-project/swc/commit/63c541306a5a0d2a76c880348ed59ad9c2d3b927))


- **(es/lexer)** Update regexp token span ([#11061](https://github.com/swc-project/swc/issues/11061)) ([ceb0aff](https://github.com/swc-project/swc/commit/ceb0aff688654e84007d717a5cc3c390740f5aec))


- **(es/minifier)** Make `const_to_let` work in arrows again ([#11062](https://github.com/swc-project/swc/issues/11062)) ([79dc8d4](https://github.com/swc-project/swc/commit/79dc8d4f70b1cee2558f002e75a10ef2fa069d7e))

### Performance



- **(es/parser)** Remove `Rc<RefCell<T>>` in `Capturing` ([#11058](https://github.com/swc-project/swc/issues/11058)) ([be6b695](https://github.com/swc-project/swc/commit/be6b69590151af0c20e13f13fcd49359b1c0ebbd))

## [swc_core@v38.0.1] - 2025-09-02

### Bug Fixes



- **(es/minifier)** Avoid `const_to_let` if reassigned ([#11035](https://github.com/swc-project/swc/issues/11035)) ([5ab92f7](https://github.com/swc-project/swc/commit/5ab92f792fbb763f7fd9e7fd6eba97c6f541f876))

### Miscellaneous Tasks



- **(bindings)** Bump dependencies ([#11043](https://github.com/swc-project/swc/issues/11043)) ([4eef9fe](https://github.com/swc-project/swc/commit/4eef9fe796f0e89083a91bac5e26d7b269917c16))

## [swc_core@v38.0.0] - 2025-08-29

### Bug Fixes



- **(es/lexer)** Fix token for `&&=` ([#11037](https://github.com/swc-project/swc/issues/11037)) ([d6e76e4](https://github.com/swc-project/swc/commit/d6e76e493fd0d34f4af71c0b2990de54053a8ebc))


- **(es/minifier)** Fix `debug` feature ([#11030](https://github.com/swc-project/swc/issues/11030)) ([0a2dcf8](https://github.com/swc-project/swc/commit/0a2dcf8c1a470898e0c88d97ba960d2d55773f62))


- **(es/optimization)** Do not rely on resolver from `inline_globals` ([#11028](https://github.com/swc-project/swc/issues/11028)) ([dc392e6](https://github.com/swc-project/swc/commit/dc392e6efa2170f49f0a806262b67da171010153))

### Features



- **(es/minifier)** Inline arrow with call expr ([#11021](https://github.com/swc-project/swc/issues/11021)) ([4a55bea](https://github.com/swc-project/swc/commit/4a55bea8543ee0e3247da4095ec6420611d55c38))


- **(es/minifier)** Merge if return void ([#11031](https://github.com/swc-project/swc/issues/11031)) ([0f177df](https://github.com/swc-project/swc/commit/0f177df7f3fc02df8895eaadd1ebe8f1f066985e))

### Testing



- **(es)** Make `isModule` in test cases available ([#11038](https://github.com/swc-project/swc/issues/11038)) ([44a5536](https://github.com/swc-project/swc/commit/44a553670ba7276fcc10e9e5a2bf63cefc12ae15))


- **(es/parser)** Use relative file name in typescript tests ([#11029](https://github.com/swc-project/swc/issues/11029)) ([82c6b0f](https://github.com/swc-project/swc/commit/82c6b0fe80f0e40aab52d5b34366aa7ec89034cb))

## [swc_core@v37.0.0] - 2025-08-24

### Bug Fixes



- **(es/minifier)** Preserve `array.join` with nullable values ([#10937](https://github.com/swc-project/swc/issues/10937)) ([e495403](https://github.com/swc-project/swc/commit/e49540386e6647fd2b87b2a7b9c2ac7668005e56))


- **(es/preset-env)** Update polyfill data ([#11013](https://github.com/swc-project/swc/issues/11013)) ([934d8a5](https://github.com/swc-project/swc/commit/934d8a5c0b4d641a929febb2477f537614ac62d1))

### Features



- **(es/minifier)** Remove unused parts of destructuring ([#11024](https://github.com/swc-project/swc/issues/11024)) ([b5fed8c](https://github.com/swc-project/swc/commit/b5fed8c2edee1d4fb33df092b970ee2e621bde91))

### Refactor



- **(es/react)** Add `preserve` supports ([#11025](https://github.com/swc-project/swc/issues/11025)) ([bc83875](https://github.com/swc-project/swc/commit/bc838753053b1c0134f4ad94052fef068a505c18))

## [swc_core@v36.0.1] - 2025-08-21

### Features



- **(bindings/html)** Add `keep-head-and-body` for `tagOmission` in binding ([#11014](https://github.com/swc-project/swc/issues/11014)) ([1e1ebeb](https://github.com/swc-project/swc/commit/1e1ebeb209f2df5e47f330eac1256693a7829cb9))

### Refactor



- **(es/minifier)** Remove duplicate report assign ([#11009](https://github.com/swc-project/swc/issues/11009)) ([9590e1d](https://github.com/swc-project/swc/commit/9590e1dbe967162bc3cda0fe3a1179f0d925eb25))

## [swc_core@v36.0.0] - 2025-08-18

### Bug Fixes



- **(es/minifier)** Fix compile error with `debug` feature ([#10999](https://github.com/swc-project/swc/issues/10999)) ([831eed5](https://github.com/swc-project/swc/commit/831eed527e2a21bed07ba9d2747b40e467fd78e3))


- **(es/minifier)** Don't eliminate class expr if some side effects contain `this` ([#11003](https://github.com/swc-project/swc/issues/11003)) ([18aeac6](https://github.com/swc-project/swc/commit/18aeac6bba37aef84cac8a0fc2a2bc70b264929e))


- **(es/module)** Support optional chaining in `import.meta` ([#10985](https://github.com/swc-project/swc/issues/10985)) ([758d8ec](https://github.com/swc-project/swc/commit/758d8ec8e096b844ae6b603bfda72fba50133bf6))


- **(es/parser)** Allow TS type args to start with LSHIFT (`<<`) to parse `T<<S>() => void>` ([#10996](https://github.com/swc-project/swc/issues/10996)) ([4911ec7](https://github.com/swc-project/swc/commit/4911ec72304f619937c4c3728e08227f4894bc37))


- **(ts/isolated-dts)** Correct optional marker for class fields generated from constructor parameter ([#10992](https://github.com/swc-project/swc/issues/10992)) ([0d680fd](https://github.com/swc-project/swc/commit/0d680fd687918cde6ec36f988977d6b0e8331f14))

### Features



- **(html/minifier)** Support `keep_head_and_body` ([#11008](https://github.com/swc-project/swc/issues/11008)) ([86186db](https://github.com/swc-project/swc/commit/86186db36e9c311153b883fa99a20bb777ab2d64))

### Miscellaneous Tasks



- **(es/minifier)** Make a computation lazy ([#11004](https://github.com/swc-project/swc/issues/11004)) ([a4aa0ec](https://github.com/swc-project/swc/commit/a4aa0ec03a2bd4087614aaa852aeec87be24fbc6))

### Performance



- **(es/ast)** Remove alloc in leftmost api ([#11005](https://github.com/swc-project/swc/issues/11005)) ([f59f233](https://github.com/swc-project/swc/commit/f59f2331fb97625093783b5e6cde62042913fe53))


- **(es/minifier)** Reduce clone ([#10982](https://github.com/swc-project/swc/issues/10982)) ([4f2ed0d](https://github.com/swc-project/swc/commit/4f2ed0dd080dc68069ad7990f992a15a36ebb5de))


- **(es/minifier)** Use `bitflags` for `DropOpts` ([#10990](https://github.com/swc-project/swc/issues/10990)) ([79206f1](https://github.com/swc-project/swc/commit/79206f17d495eadd930df23f92fedaa5a418d90e))


- **(es/parser)** Remove EOF check ([#10976](https://github.com/swc-project/swc/issues/10976)) ([a10dada](https://github.com/swc-project/swc/commit/a10dada821ff206f10659dc538a8dcad3fb40394))


- **(es/parser)** Introduce checkpoint to reduce clone ([#11001](https://github.com/swc-project/swc/issues/11001)) ([cda08d1](https://github.com/swc-project/swc/commit/cda08d196ef804764b74fdd99f58f4e73cb80495))


- **(es/parser)** Remove useless `Rc<RefCell<T>>` ([#11002](https://github.com/swc-project/swc/issues/11002)) ([39f5784](https://github.com/swc-project/swc/commit/39f5784c106e7fc1feb2b7a48b5d0639a6efdc5f))


- **(es/parser)** Remove `OneDirectionalList` and reduce allocation of `Vec` ([#11000](https://github.com/swc-project/swc/issues/11000)) ([0088ab8](https://github.com/swc-project/swc/commit/0088ab8ebb05c4db569cf2f7cd57e4f73a0e306c))

### Refactor



- **(common)** Remove `SyntaxContextData#opaque` ([#10983](https://github.com/swc-project/swc/issues/10983)) ([d5be248](https://github.com/swc-project/swc/commit/d5be248fc070caa658f04c3f54f5b1a0bca8cd0e))


- **(es/parser)** Remove useless methods ([#10980](https://github.com/swc-project/swc/issues/10980)) ([91c6039](https://github.com/swc-project/swc/commit/91c60390b7623f164219dd6c91ef4c0cce8e4dfd))


- **(plugin/runner)** Switch `wasmtime-wasi` to `wasi-common` ([#10979](https://github.com/swc-project/swc/issues/10979)) ([c4114d5](https://github.com/swc-project/swc/commit/c4114d55ad54649825226d515d0fad4272e028f8))


- Add `#[deny(unused)]` ([#10997](https://github.com/swc-project/swc/issues/10997)) ([1bb3716](https://github.com/swc-project/swc/commit/1bb37160daa70017b78a842dfe31f16b374eb298))

## [swc_core@v35.0.0] - 2025-08-05

### Bug Fixes



- **(es/minifier)** Skip serde of `pure_funcs` in options ([#10969](https://github.com/swc-project/swc/issues/10969)) ([862e70d](https://github.com/swc-project/swc/commit/862e70d596401f876dad054c6fc1cf4231d6d7a0))


- Expose GlobalPassOption.build ([#10968](https://github.com/swc-project/swc/issues/10968)) ([c8a2668](https://github.com/swc-project/swc/commit/c8a266892e8bc02cd34f091c8962cd3cd77de285))

### Features



- **(plugin/runner)** Introduce `wasmtime` backend ([#10958](https://github.com/swc-project/swc/issues/10958)) ([9fa8330](https://github.com/swc-project/swc/commit/9fa833087eeb6901fce25af17f2123e23316ab40))

### Performance



- **(es/minifier)** Remove useless clone ([#10970](https://github.com/swc-project/swc/issues/10970)) ([8873f65](https://github.com/swc-project/swc/commit/8873f659a02deb2cc8f496c28ea74a2b04a70259))

### Refactor



- **(es/minifier)** Remove useless branch ([#10966](https://github.com/swc-project/swc/issues/10966)) ([e400de3](https://github.com/swc-project/swc/commit/e400de3aca99d4a937c37219eae6c1303785b661))


- **(plugin/runner)** Introduce abstract runtime ([#10943](https://github.com/swc-project/swc/issues/10943)) ([a445156](https://github.com/swc-project/swc/commit/a44515679cb17c3b8b6ab5e625cbce1ee6d1b9e4))

## [swc_core@v34.0.4] - 2025-07-31

### Bug Fixes



- **(es/lexer)** Use error when handling '\0' ([#10964](https://github.com/swc-project/swc/issues/10964)) ([53c22d1](https://github.com/swc-project/swc/commit/53c22d1cce88c0b9f8bc91f461bf26e58b21c9bd))

### Performance



- **(es/minifier)** Use bitflags for context of the `Pure` pass ([#10953](https://github.com/swc-project/swc/issues/10953)) ([8cd5c58](https://github.com/swc-project/swc/commit/8cd5c587b358379df4d36def175a65aac42a12ec))


- **(es/minifier)** Reduce alloc ([#10961](https://github.com/swc-project/swc/issues/10961)) ([6475070](https://github.com/swc-project/swc/commit/64750702c98e2aca6e3c0d9e4a34974cc38b16e5))

### Refactor



- **(hstr)** Use default inline strategy ([#10954](https://github.com/swc-project/swc/issues/10954)) ([d160f7f](https://github.com/swc-project/swc/commit/d160f7f80175c7b4181ca8f22dfb7f5fcb4d639a))


- **(hstr)** Remove needlesss unwrap ([#10959](https://github.com/swc-project/swc/issues/10959)) ([953f75f](https://github.com/swc-project/swc/commit/953f75fce4b594ee66f2339af6d347963c113da5))

## [swc_core@v34.0.3] - 2025-07-29

### Bug Fixes



- **(es/minifier)** Check exported when optimize last expr ([#10939](https://github.com/swc-project/swc/issues/10939)) ([f6f15f3](https://github.com/swc-project/swc/commit/f6f15f38d38ef5458d8dd5c9b9a7090c1da6fd65))


- **(es/minifier)** Disallow types ([#10945](https://github.com/swc-project/swc/issues/10945)) ([63172ef](https://github.com/swc-project/swc/commit/63172ef3b069f6e7ef301233ad6f421d18cd8307))


- **(es/minifier)** Don't optimize Number properties when Number is shadowed ([#10947](https://github.com/swc-project/swc/issues/10947)) ([40a1e2e](https://github.com/swc-project/swc/commit/40a1e2e6b86756a8b1234057ad719bf0b1ef240f))


- **(es/minifier)** Fix cycle detection ([#10950](https://github.com/swc-project/swc/issues/10950)) ([212d8bc](https://github.com/swc-project/swc/commit/212d8bcff1b3986746b57f22f574a0a4e81bd39c))

### Performance



- **(es/minifier)** Use bitflag for var kind ([#10940](https://github.com/swc-project/swc/issues/10940)) ([4317988](https://github.com/swc-project/swc/commit/43179889525734f9a129d68dc4381fba881d1e66))


- **(es/minifier)** Remove needless clone ([#10949](https://github.com/swc-project/swc/issues/10949)) ([b5e5e8c](https://github.com/swc-project/swc/commit/b5e5e8c35abd4d04b90e18719d059242ed9b33eb))


- **(es/parser)** Reduce comparison ([#10941](https://github.com/swc-project/swc/issues/10941)) ([a262eeb](https://github.com/swc-project/swc/commit/a262eeb053265878333cf597f8c1f167a13c02b6))

## [swc_core@v34.0.2] - 2025-07-24

### Bug Fixes



- **(es/parser)** Correctly handle EOF position ([#10934](https://github.com/swc-project/swc/issues/10934)) ([dd70fbd](https://github.com/swc-project/swc/commit/dd70fbd0dd24f5c7652cf79d1be99d5f4bb9e1c6))

### Performance



- **(es/parser)** Reduce comparison ([#10933](https://github.com/swc-project/swc/issues/10933)) ([e44fbd4](https://github.com/swc-project/swc/commit/e44fbd44f348dcd16608b4a29a5582198a70e229))

## [swc_core@v34.0.1] - 2025-07-24

### Performance



- **(es/minifier)** Remove visitor of CharFreqAnalyzer ([#10928](https://github.com/swc-project/swc/issues/10928)) ([65534ff](https://github.com/swc-project/swc/commit/65534ff998036ca881e27ed13074df7d2cadae5d))


- **(es/minifier)** Remove pre-compress pass ([#10932](https://github.com/swc-project/swc/issues/10932)) ([c7f0e4d](https://github.com/swc-project/swc/commit/c7f0e4d5e6c0d6492e750d662711f9b495bc280d))

## [swc_core@v34.0.0] - 2025-07-22

### Bug Fixes



- **(es/minifier)** Remove the last break in the second switch ([#10923](https://github.com/swc-project/swc/issues/10923)) ([3ed4a12](https://github.com/swc-project/swc/commit/3ed4a1208564f708ead059bbb1d44210450705ba))

### Features



- **(es/compiler)** Merge `export_namespace_from` ([#10917](https://github.com/swc-project/swc/issues/10917)) ([ba6cc71](https://github.com/swc-project/swc/commit/ba6cc71c20578e8185c4ab012d03d4ebc0798d36))


- **(es/renamer)** Add `renamer_keep_contexts` ([#10907](https://github.com/swc-project/swc/issues/10907)) ([1b15171](https://github.com/swc-project/swc/commit/1b15171a95bea857f4fa63ed2f09dbb47a8268bd))

### Performance



- **(es/lexer)** Remove option for handler ([#10881](https://github.com/swc-project/swc/issues/10881)) ([1ad8506](https://github.com/swc-project/swc/commit/1ad85064acebbde83fc3bacf6d71e3f29a51d174))


- **(es/lexer)** Reduce memory move ([#10906](https://github.com/swc-project/swc/issues/10906)) ([145fba4](https://github.com/swc-project/swc/commit/145fba48acde32a04bfedf82735a3f661bc5deab))


- **(es/lexer)** Reduce context query ([#10910](https://github.com/swc-project/swc/issues/10910)) ([443aa1c](https://github.com/swc-project/swc/commit/443aa1c3f2cbcbf2cbb82ed0331b37ca9c4398e7))


- **(es/lexer)** Reduce query and comparison ([#10919](https://github.com/swc-project/swc/issues/10919)) ([400c996](https://github.com/swc-project/swc/commit/400c9968c00d73c58f4df4c859e48902a1ca528f))


- **(es/minifier)** Make `get_type` for `===` lazy ([#10920](https://github.com/swc-project/swc/issues/10920)) ([4eab8e8](https://github.com/swc-project/swc/commit/4eab8e89fd6c0b5f9ec8d8885acbd773764c2ea0))


- **(es/minifier)** Reduce `get_type` calls ([#10922](https://github.com/swc-project/swc/issues/10922)) ([9d55e88](https://github.com/swc-project/swc/commit/9d55e88e500d309cf9d154aa5082f81b03480cbf))


- **(es/parser)** Reduce check during parsing binding ([#10905](https://github.com/swc-project/swc/issues/10905)) ([92ca5ec](https://github.com/swc-project/swc/commit/92ca5ecd4591d0d9c3a5f874abbd6cdf780dd0fc))


- **(es/parser)** Reduce comparison ([#10911](https://github.com/swc-project/swc/issues/10911)) ([e00c178](https://github.com/swc-project/swc/commit/e00c1783b0ed66e279b9adf42a1ae85c91d41a36))

### Refactor



- **(es/lexer)** EOF Token ([#10880](https://github.com/swc-project/swc/issues/10880)) ([54c866a](https://github.com/swc-project/swc/commit/54c866aa0ae1e31c058f762795b4181786b5cf45))


- **(es/parser)** Reduce `input_mut()` calls ([#10899](https://github.com/swc-project/swc/issues/10899)) ([1816368](https://github.com/swc-project/swc/commit/1816368bb1f22e020180f5fdf3605ce8f60c12a2))


- **(es/parser)** Remove unnecessary PResult ([#10900](https://github.com/swc-project/swc/issues/10900)) ([27e548d](https://github.com/swc-project/swc/commit/27e548dbda7d285e1d3a6df343efd90a7f749681))


- **(es/preset-env)** Apply swc_ecma_compiler in preset env ([#10921](https://github.com/swc-project/swc/issues/10921)) ([6f5b72a](https://github.com/swc-project/swc/commit/6f5b72a582a54687a5ed7ad615f575ce5eda4038))

### Testing



- **(es/minifier)** Update #10918 test case ([#10924](https://github.com/swc-project/swc/issues/10924)) ([57fb106](https://github.com/swc-project/swc/commit/57fb10662a4a2140f2309933fb778660a48e80af))

## [swc_core@v33.0.7] - 2025-07-21

### Bug Fixes



- **(swc_core)** Add `default-features = false` to drop `stacker` ([#10916](https://github.com/swc-project/swc/issues/10916)) ([38b45b7](https://github.com/swc-project/swc/commit/38b45b7e39222a2aad39bf68cb8752b7e4446f4f))

### Features



- **(es/compiler)** Merge logical assignments ([#10914](https://github.com/swc-project/swc/issues/10914)) ([ccbfcd1](https://github.com/swc-project/swc/commit/ccbfcd1139ad6c9f40f3b982f2536ca64c18247e))

## [swc_core@v33.0.5] - 2025-07-21

### Bug Fixes



- **(es/parser)** Reject malformed phase import statements ([#10912](https://github.com/swc-project/swc/issues/10912)) ([5fde348](https://github.com/swc-project/swc/commit/5fde3482f00207753d190fdc8a89b8527e5560b5))

### Features



- **(es/compiler)** Improve structure ([#10903](https://github.com/swc-project/swc/issues/10903)) ([0cc6743](https://github.com/swc-project/swc/commit/0cc6743ce3efe3e764a2db980a7030d93114050a))


- **(es/compiler)** Merge `private_in_object` and `static_blocks` ([#10909](https://github.com/swc-project/swc/issues/10909)) ([c1405da](https://github.com/swc-project/swc/commit/c1405da64d05b70ca82770decabaa3d06a5e3c43))

### Miscellaneous Tasks



- **(claude)** Use `Opus` and allow assigning to the `claude-bot` ([3275b9c](https://github.com/swc-project/swc/commit/3275b9c8ce68f8cc29d562d3ce64e49e4de10fe4))

### Refactor



- **(es/compat)** Initialize compiler API ([#10902](https://github.com/swc-project/swc/issues/10902)) ([d6566ee](https://github.com/swc-project/swc/commit/d6566ee3d2649a68f8abfc5ffd0b01841f80e016))

## [swc_core@v33.0.4] - 2025-07-19

### Bug Fixes



- **(es/minifier)** Recursively check stmt for variable when inlining function ([#10896](https://github.com/swc-project/swc/issues/10896)) ([e37a93d](https://github.com/swc-project/swc/commit/e37a93dca660aba8871b1838b289c3440184547d))


- **(es/minifier)** Termination check when stmts containing switch ([#10898](https://github.com/swc-project/swc/issues/10898)) ([4429b20](https://github.com/swc-project/swc/commit/4429b20065d44548ad40f4298ee60a19df6f4eaa))

## [swc_core@v33.0.3] - 2025-07-18

### Bug Fixes



- **(es/decorators)** Handle empty class members ([#10892](https://github.com/swc-project/swc/issues/10892)) ([fe44972](https://github.com/swc-project/swc/commit/fe44972aaab79f2269ee2e401fa4467638b8c84e))


- **(es/minifier)** Hoist props when only props are used ([#10891](https://github.com/swc-project/swc/issues/10891)) ([452fc98](https://github.com/swc-project/swc/commit/452fc989c41b18551682299dea52cfac11a8444c))


- **(es/parser)** Fix parsing of JSX identifiers ([#10894](https://github.com/swc-project/swc/issues/10894)) ([0047c39](https://github.com/swc-project/swc/commit/0047c39df08f183ab0a45eca2b4e4314be71379d))

### Testing



- **(es/minify)** Verify fixed issue ([#10888](https://github.com/swc-project/swc/issues/10888)) ([86c1dca](https://github.com/swc-project/swc/commit/86c1dca11836b2a035b3fe159ecc260043ca8720))

## [swc_core@v33.0.2] - 2025-07-18

### Bug Fixes



- **(es/compat)** Properly handle rest assignment in for-in/of RHS ([#10883](https://github.com/swc-project/swc/issues/10883)) ([5d11851](https://github.com/swc-project/swc/commit/5d118515b5f704f25c6240dfda593317db001ff4))


- **(ts/fast-strip)** Strip private method overloads ([#10886](https://github.com/swc-project/swc/issues/10886)) ([cdb6e87](https://github.com/swc-project/swc/commit/cdb6e87291250103b1f54e90a863ca476d7624b0))

## [swc_core@v33.0.1] - 2025-07-17

### Refactor



- **(es/minifier)** Cleanup ([#10882](https://github.com/swc-project/swc/issues/10882)) ([2595cb1](https://github.com/swc-project/swc/commit/2595cb13a737e9ad935c4c99ec954e7c6224ecd0))

## [swc_core@v33.0.0] - 2025-07-17

### Bug Fixes



- **(es/lexer)** Disallow legacy octal literals as BigInt ([#10867](https://github.com/swc-project/swc/issues/10867)) ([430fbf4](https://github.com/swc-project/swc/commit/430fbf45371e760b23f5feed56aa9cfdb7403d72))


- **(es/parser)** Mark `static` as reserved in strict mode ([#10861](https://github.com/swc-project/swc/issues/10861)) ([5bdddd7](https://github.com/swc-project/swc/commit/5bdddd7d65b137f8a03a33a4f74a636e8b908227))

### Features



- **(plugin/runner)** Use wasmer-wasix sys-minimal feature to reduce binary size ([#10638](https://github.com/swc-project/swc/issues/10638)) ([b5f704a](https://github.com/swc-project/swc/commit/b5f704a1199ea1be0a68e23d4eb8928e2ac6bc51))

### Performance



- **(es/lexer)** Reduce comparison while reading numbers ([#10864](https://github.com/swc-project/swc/issues/10864)) ([c6ba5c2](https://github.com/swc-project/swc/commit/c6ba5c263d0ab520e5253579213c02a6b647664b))


- **(es/lexer)** Remove unnecessary check when reading keywords ([#10866](https://github.com/swc-project/swc/issues/10866)) ([4aefe0e](https://github.com/swc-project/swc/commit/4aefe0eb0645f711ec16c2bfdc32a105e19f0733))


- **(es/parser)** Reduce comparisons ([#10862](https://github.com/swc-project/swc/issues/10862)) ([3bd9aad](https://github.com/swc-project/swc/commit/3bd9aadd27e22475e789ab393bc0318a6edbcb96))


- **(es/parser)** Remove useless alloc ([#10865](https://github.com/swc-project/swc/issues/10865)) ([3ebf088](https://github.com/swc-project/swc/commit/3ebf088cc88234c50e3924b1e9d0284d186f81ed))


- **(es/parser)** Reduce token query ([#10869](https://github.com/swc-project/swc/issues/10869)) ([d93ef64](https://github.com/swc-project/swc/commit/d93ef647f29c7c2241adc28a8eb2b6511f054949))


- **(es/parser)** Remove duplicate check ([#10872](https://github.com/swc-project/swc/issues/10872)) ([fe76460](https://github.com/swc-project/swc/commit/fe764608a5d27c41467102ef745d90940a033a7c))


- **(es/parser)** Remove duplicate check ([#10874](https://github.com/swc-project/swc/issues/10874)) ([064123b](https://github.com/swc-project/swc/commit/064123b6b5e5741083e246ad4156dc848ba5a89f))

### Refactor



- **(es/lexer)** Avoid passing `convert` ([#10868](https://github.com/swc-project/swc/issues/10868)) ([77393f8](https://github.com/swc-project/swc/commit/77393f80d0a59c6d136221935d439ba1d99d4385))


- **(es/parser)** Remove duplicate check for reservedness ([#10850](https://github.com/swc-project/swc/issues/10850)) ([4897bfd](https://github.com/swc-project/swc/commit/4897bfd6444fb12ea8a916765a47e3712072dc01))


- **(es/parser)** Remove span swap operation in parser ([#10854](https://github.com/swc-project/swc/issues/10854)) ([32f4bb8](https://github.com/swc-project/swc/commit/32f4bb80c19b33ab490e8cf70666cac4c1b8c495))

## [swc_core@v32.0.5] - 2025-07-17

### Bug Fixes



- **(es/minifier)** Restrict IIFE inlining in class contexts ([#10879](https://github.com/swc-project/swc/issues/10879)) ([a01b54a](https://github.com/swc-project/swc/commit/a01b54afc82b7bd25cbf5faa7d4d4c18543dc9d8))

## [swc_core@v32.0.3] - 2025-07-16

### Features



- **(es/minifier)** Drop unused rest paramters ([#10857](https://github.com/swc-project/swc/issues/10857)) ([5305486](https://github.com/swc-project/swc/commit/5305486d58d9cbee06d1f81691cf6f261d7158ed))


- **(es/minifier)** Enhance IIFE invoker for arrow functions ([#10860](https://github.com/swc-project/swc/issues/10860)) ([2b1ce3d](https://github.com/swc-project/swc/commit/2b1ce3d2322d3726cad799b2b3ca9ca1f04449bf))

## [swc_core@v32.0.2] - 2025-07-14

### Miscellaneous Tasks



- **(bindings)** Fix dependency issues ([7c57fbb](https://github.com/swc-project/swc/commit/7c57fbb103baaa236d3c040e72d5cf65bc2b7ec4))

### Performance



- **(swc_error_reporters)** Avoid creating miette handler when no diagnostics ([#10852](https://github.com/swc-project/swc/issues/10852)) ([93b318f](https://github.com/swc-project/swc/commit/93b318f05c71b1a9e94a457fa93094cfb9116b4e))

## [swc_core@v32.0.1] - 2025-07-14

### Refactor



- **(es/parser)** Remove duplicate check ([#10847](https://github.com/swc-project/swc/issues/10847)) ([2b04efd](https://github.com/swc-project/swc/commit/2b04efd5403adec38251bf9059a5dec600049288))

## [swc_core@v32.0.0] - 2025-07-13

### Bug Fixes



- **(es/minifier)** Don't inline arrow when it contain `this` ([#10825](https://github.com/swc-project/swc/issues/10825)) ([8b43bb3](https://github.com/swc-project/swc/commit/8b43bb35bce93c66ee9783c8ea132dab7939fcb5))

### Features



- **(es/parser)** Enable support for dynamic import with `defer` phase ([#10845](https://github.com/swc-project/swc/issues/10845)) ([097d29d](https://github.com/swc-project/swc/commit/097d29d21cbf378c0a3ff7a3c9364ff02242306d))


- **(plugin)** Remove `bytecheck` to make Wasm plugins backward compatible ([#10842](https://github.com/swc-project/swc/issues/10842)) ([30ad808](https://github.com/swc-project/swc/commit/30ad80809c833522f3631424e0b4efdb94455fc8))

### Miscellaneous Tasks



- **(deps)** Update `class-validator` to avoid comments ([#10819](https://github.com/swc-project/swc/issues/10819)) ([bacfa4b](https://github.com/swc-project/swc/commit/bacfa4b56d455a5c8e1392a66dd8d3c3add4f488))

### Performance



- **(es/minifier)** Use `u8` for `remaining_depth` ([#10833](https://github.com/swc-project/swc/issues/10833)) ([ed6956a](https://github.com/swc-project/swc/commit/ed6956a46e1f0abbcfc447773c5429659fe91289))


- **(hstr)** Remove static tag ([#10832](https://github.com/swc-project/swc/issues/10832)) ([66ae1e8](https://github.com/swc-project/swc/commit/66ae1e8d5aa047e2ea7c2a1c46a618bfa7d6a500))

### Refactor



- **(es/helpers)** Make inline helpers optional at compile time ([#10808](https://github.com/swc-project/swc/issues/10808)) ([53f3881](https://github.com/swc-project/swc/commit/53f38811cc994f394d47624cf27b49e5b3163b8a))


- **(es/lexer)** Don't store buffer in lexer ([#10830](https://github.com/swc-project/swc/issues/10830)) ([cac40f1](https://github.com/swc-project/swc/commit/cac40f135d517e9c3e1dbbe9250c8b1dbe39320b))


- **(es/parser)** Reduce token query ([#10834](https://github.com/swc-project/swc/issues/10834)) ([5cd5185](https://github.com/swc-project/swc/commit/5cd5185a7a51ec838a12005c44dc982642af9508))


- **(es/parser)** Reduce call to `parse_decorators` ([#10846](https://github.com/swc-project/swc/issues/10846)) ([356d3a0](https://github.com/swc-project/swc/commit/356d3a0850d32e79ff9615f3b696207902732895))


- **(es/preset-env)** Use strpool,phf for corejs2 data ([#10803](https://github.com/swc-project/swc/issues/10803)) ([1652fd8](https://github.com/swc-project/swc/commit/1652fd8038ed8ea306fce914948ea6e121d5845f))


- **(es/react)** Remove `count_children` ([#10818](https://github.com/swc-project/swc/issues/10818)) ([2116ab2](https://github.com/swc-project/swc/commit/2116ab2fa25b0d4121d0dc69afd42e41ea24e299))


- **(hstr)** Make the deallocation of `Atom`s explicit ([#10813](https://github.com/swc-project/swc/issues/10813)) ([406433d](https://github.com/swc-project/swc/commit/406433d55d00c2e14cd72e438ca36666936c62cd))


- **(hstr)** Remove `is_global` ([#10820](https://github.com/swc-project/swc/issues/10820)) ([afda0f9](https://github.com/swc-project/swc/commit/afda0f9d0d65e231615f955e365f77a18dc716d1))

### Testing



- **(es/plugin)** Test memory layout of archived types ([#10841](https://github.com/swc-project/swc/issues/10841)) ([502e991](https://github.com/swc-project/swc/commit/502e991a8bccaefef03f6379bbda8522bde4f62e))

## [swc_core@v31.1.0] - 2025-07-10

### Bug Fixes



- **(es/parser)** Make `export` in NS to not affect file type ([#10799](https://github.com/swc-project/swc/issues/10799)) ([ae22033](https://github.com/swc-project/swc/commit/ae22033dc4d03ba8444d87fd74f4e4a8aa86d653))


- **(es/parser)** Correctly check ambient context ([#10802](https://github.com/swc-project/swc/issues/10802)) ([f97ea03](https://github.com/swc-project/swc/commit/f97ea03523198447f176ee956991aefb16312e7c))

### Miscellaneous Tasks



- **(ide)** Enable `--workspace` for rust-analyzer check ([#10809](https://github.com/swc-project/swc/issues/10809)) ([92647ff](https://github.com/swc-project/swc/commit/92647ff9d9f95cecfab93b6faa2f1063e3f1239b))

### Performance



- **(hstr)** Inline one more byte ([#10817](https://github.com/swc-project/swc/issues/10817)) ([3886c97](https://github.com/swc-project/swc/commit/3886c9720dbf992bf2dbc6a09e416ed63833d6d7))

### Refactor



- **(es/lints)** Remove warnings without features ([#10794](https://github.com/swc-project/swc/issues/10794)) ([41d507f](https://github.com/swc-project/swc/commit/41d507fe1e9c4ef7fa0bb7a266b75f1376c90fff))


- **(es/react)** Remove redundant `replace` calls ([#10795](https://github.com/swc-project/swc/issues/10795)) ([a670b37](https://github.com/swc-project/swc/commit/a670b37c334b69a57f31f8940916d3f66c9ab504))


- **(hstr)** Cleanup duplicate header ([#10812](https://github.com/swc-project/swc/issues/10812)) ([630dde9](https://github.com/swc-project/swc/commit/630dde93c9deb35c38d4d27c9e8083349ebad5bc))

## [swc_core@v31.0.0] - 2025-07-07

### Bug Fixes



- **(ci)** Fix CI ([#10790](https://github.com/swc-project/swc/issues/10790)) ([b3f9760](https://github.com/swc-project/swc/commit/b3f97604b8bc4713ab1f91fa3bd732b7af9cb2e9))


- **(es)** Use `default-features = false` for `swc` crate usages ([#10776](https://github.com/swc-project/swc/issues/10776)) ([50b2eac](https://github.com/swc-project/swc/commit/50b2eacdf7bb3705b5be1ba63e9acdb143e82d40))


- **(es)** Make `swc_typescript` optional ([#10792](https://github.com/swc-project/swc/issues/10792)) ([c32569d](https://github.com/swc-project/swc/commit/c32569dd558e3bd4e27329275e090cc716a6e440))

### Performance



- **(es/lexer)** Do not scan number if there's no underscore ([#10788](https://github.com/swc-project/swc/issues/10788)) ([f5d92ee](https://github.com/swc-project/swc/commit/f5d92ee1bf0a2fbeece6570b745ea833f6cd355e))


- **(hstr)** Do not compare string during creating atoms ([#10791](https://github.com/swc-project/swc/issues/10791)) ([43a4f11](https://github.com/swc-project/swc/commit/43a4f117cb0089bc7e117173507886218b064d62))

### Refactor



- **(es/parser)** Delete `with_ctx` ([#10779](https://github.com/swc-project/swc/issues/10779)) ([ce057c5](https://github.com/swc-project/swc/commit/ce057c55efcb937437af5ef0fd583240b0538a0e))


- **(es/parser)** Cleanup ([#10781](https://github.com/swc-project/swc/issues/10781)) ([176ce36](https://github.com/swc-project/swc/commit/176ce36d2407b6d054ec6088a45025b76791fed3))


- **(es/preset)** Remove deprecated `preset_env` function and `feature` module ([#10759](https://github.com/swc-project/swc/issues/10759)) ([fa0e0ab](https://github.com/swc-project/swc/commit/fa0e0abf41658271cde27b6852f42dd00dfd8f4a))


- **(es/preset-env)** Use phf for corejs3 entry ([#10712](https://github.com/swc-project/swc/issues/10712)) ([658b26d](https://github.com/swc-project/swc/commit/658b26d8386c17cbe7abf740d905d41eac96b7f7))

### Testing



- **(es/minifier)** Update the passing test list ([#10782](https://github.com/swc-project/swc/issues/10782)) ([8aa888b](https://github.com/swc-project/swc/commit/8aa888bc2a0fc0ed84d189725af917ae2be9f905))


- **(es/parser)** Add a test for duplicate labels ([#10784](https://github.com/swc-project/swc/issues/10784)) ([28fc643](https://github.com/swc-project/swc/commit/28fc64310c0fdb0491a1121a801f9a5d184109eb))

## [swc_core@v30.1.2] - 2025-07-04

### Bug Fixes



- **(preset-env)** Revert `default` value ([#10778](https://github.com/swc-project/swc/issues/10778)) ([7af5824](https://github.com/swc-project/swc/commit/7af58242c2a4c8b7c1a8df8a2dd7d854892fad5e))

### Miscellaneous Tasks



- **(deps)** Remove unused deps with cargo-shear ([#10765](https://github.com/swc-project/swc/issues/10765)) ([f4e4974](https://github.com/swc-project/swc/commit/f4e4974ffeec16b7d6d5b8def107b82bfc3c7e1d))

### Refactor



- **(es/parser)** Cleanup for ctx ([#10777](https://github.com/swc-project/swc/issues/10777)) ([d60a611](https://github.com/swc-project/swc/commit/d60a611dc76244b2b12e7676bbf4995bec5ba37c))

## [swc_core@v30.1.1] - 2025-07-04

### Performance



- Replace `rayon` with `par-iter` ([#10774](https://github.com/swc-project/swc/issues/10774)) ([a6e6ebe](https://github.com/swc-project/swc/commit/a6e6ebeacafb8bccbaf3cb9bec3c87861461437a))

## [swc_core@v30.1.0] - 2025-07-04

### Features



- **(es/minifier)** Implement partial evaluation of array join ([#10758](https://github.com/swc-project/swc/issues/10758)) ([bdf3a98](https://github.com/swc-project/swc/commit/bdf3a98bb45f6f9cdf1b9a8ed8d292ccce257d4e))

### Performance



- **(es/lints)** Make rules not parallel ([#10772](https://github.com/swc-project/swc/issues/10772)) ([4e6001c](https://github.com/swc-project/swc/commit/4e6001c5a465ce13547abc2a6b24ae724e1adba5))


- **(es/lints)** Merge critical rules ([#10773](https://github.com/swc-project/swc/issues/10773)) ([816e75a](https://github.com/swc-project/swc/commit/816e75a2094fd633243174f7953c9920f4851c79))


- **(es/parser)** Reduce query ops of current token ([#10766](https://github.com/swc-project/swc/issues/10766)) ([4304f91](https://github.com/swc-project/swc/commit/4304f9129c1d511c94898727306a50535e11ad39))


- **(es/parser)** Remove useless call in `parse_ident` ([#10770](https://github.com/swc-project/swc/issues/10770)) ([4ca12c9](https://github.com/swc-project/swc/commit/4ca12c97259fdf882b0849112473f3deea54be36))

### Refactor



- **(es)** Make `swc_ecma_lint` optional for `swc` crate ([#10767](https://github.com/swc-project/swc/issues/10767)) ([f80415b](https://github.com/swc-project/swc/commit/f80415baa60a55a4dea31eff9b1c3431705183e5))


- **(es/parser)** Cleanup `typed-arena` ([#10769](https://github.com/swc-project/swc/issues/10769)) ([ce5138d](https://github.com/swc-project/swc/commit/ce5138d3aae6e23127fc76da9f439d47b7c59374))

### Pref



- **(hstr)** Do not compare static tag ([#10771](https://github.com/swc-project/swc/issues/10771)) ([5d3ce83](https://github.com/swc-project/swc/commit/5d3ce83add12c4b147d238e1cd6fdf6083c696d2))

## [swc_core@v30.0.2] - 2025-07-03

### Features



- **(es/minifier)** Evaluate `Number.XXX` constants ([#10756](https://github.com/swc-project/swc/issues/10756)) ([c47dab5](https://github.com/swc-project/swc/commit/c47dab5f904ecce101b0388cab26805741bc9bd2))

### Miscellaneous Tasks



- **(common)** Remove `clone()` in proc macro ([#10762](https://github.com/swc-project/swc/issues/10762)) ([12e3180](https://github.com/swc-project/swc/commit/12e318036caccee6d9b516baf391fccb07118ca9))


- **(es/module)** Drop `node` feature of `swc_ecma_loader` ([#10761](https://github.com/swc-project/swc/issues/10761)) ([44471b5](https://github.com/swc-project/swc/commit/44471b51518d3c74ee4f3992f8474687ada13fc0))


- **(plugin/runner)** Remove unused feature and dependency ([#10764](https://github.com/swc-project/swc/issues/10764)) ([a7d8a0a](https://github.com/swc-project/swc/commit/a7d8a0ac890bd4956d6b400017d6ddeba97e9ab0))

## [swc_core@v30.0.0] - 2025-07-02

### Bug Fixes



- **(preset-env)** Fix `default` value for `caniuse` ([#10754](https://github.com/swc-project/swc/issues/10754)) ([aa4cd5b](https://github.com/swc-project/swc/commit/aa4cd5ba7c79229f8082354d470b10d420b5f8cb))

### Features



- **(es/minifeir)** Inline lazily initialized literals ([#10752](https://github.com/swc-project/swc/issues/10752)) ([fd5d2e2](https://github.com/swc-project/swc/commit/fd5d2e2f33db0d6aee8d133fe23047422a67e28c))


- **(swc_core)** Expose `swc_ecma_parser/unstable` ([#10744](https://github.com/swc-project/swc/issues/10744)) ([db0679e](https://github.com/swc-project/swc/commit/db0679e5ca675ea7b54bc8804897f1a2f313fe0c))

### Miscellaneous Tasks



- **(deps)** Update `browserslist-rs` to `0.19` ([#10750](https://github.com/swc-project/swc/issues/10750)) ([f8bf21c](https://github.com/swc-project/swc/commit/f8bf21c07202ac864d1772d5c46e1a4e99bda2fa))

### Performance



- **(es/lexer)** Use `bitflags` for `Syntax` ([#10676](https://github.com/swc-project/swc/issues/10676)) ([bf8c722](https://github.com/swc-project/swc/commit/bf8c722e25018baa45706b890b7464f90fc03f6a))


- **(es/parser)** Reduce the number of context set ops ([#10742](https://github.com/swc-project/swc/issues/10742)) ([08b4e8b](https://github.com/swc-project/swc/commit/08b4e8b285ddb49eeefd06d1f745d9aec25427c1))


- **(es/parser)** Reduce value set operations for context ([#10751](https://github.com/swc-project/swc/issues/10751)) ([4976b12](https://github.com/swc-project/swc/commit/4976b12f9398c471c0f77e69ad141e0172927a2b))


- **(es/renamer)** Reduce time complexity in case of conflict ([#10749](https://github.com/swc-project/swc/issues/10749)) ([0279914](https://github.com/swc-project/swc/commit/02799141bf0d040b6536f3333cfed852b80c611b))

### Refactor



- **(es/lexer)** Use const fn in `SyntaxFlags` ([#10737](https://github.com/swc-project/swc/issues/10737)) ([b9eb23a](https://github.com/swc-project/swc/commit/b9eb23aec3dd0963afa5080d53bca4dd0325f233))


- **(es/parser)** Cleanup `parse_setter_param` ([#10745](https://github.com/swc-project/swc/issues/10745)) ([70734f4](https://github.com/swc-project/swc/commit/70734f40d4ff0d9ad140b705c3356b44f8bd5663))

### Testing



- **(es/minifier)** Update the terser test list ([#10748](https://github.com/swc-project/swc/issues/10748)) ([1eace01](https://github.com/swc-project/swc/commit/1eace01303a98a522b67f9005601cbebd0d5b71e))

## [swc_core@v29.4.2] - 2025-07-01

### Bug Fixes



- **(es/minifier)** Fix termination detection  ([#10741](https://github.com/swc-project/swc/issues/10741)) ([87bc698](https://github.com/swc-project/swc/commit/87bc69883daae48b633556b55caeb480b7ba2d97))

## [swc_core@v29.4.1] - 2025-07-01

### Bug Fixes



- **(es/minifier)** Mark `cons` and `alt` of `CondExpr` as `ref` ([#10740](https://github.com/swc-project/swc/issues/10740)) ([9649cc8](https://github.com/swc-project/swc/commit/9649cc80b66edb54db1dadc9214f2c19ea008f24))

## [swc_core@v29.4.0] - 2025-06-30

### Bug Fixes



- **(es/lexer)** Parse uppercase hex numbers correctly ([#10728](https://github.com/swc-project/swc/issues/10728)) ([ead6256](https://github.com/swc-project/swc/commit/ead62560b028f74feee506484233de2763ed3378))


- **(es/lexer)** Allow keywords as jsx attribute names ([#10730](https://github.com/swc-project/swc/issues/10730)) ([04ef20a](https://github.com/swc-project/swc/commit/04ef20ad9b7e43dc70666258cb2c996a1a5e4074))


- **(es/minifier)** Fix top level option ([#10227](https://github.com/swc-project/swc/issues/10227)) ([485fced](https://github.com/swc-project/swc/commit/485fced53b9318f707d05d64a1c7adf28d00e41a))


- **(es/minifier)** Do not drop self-referential class expressions ([#10710](https://github.com/swc-project/swc/issues/10710)) ([39e6c2e](https://github.com/swc-project/swc/commit/39e6c2ec2d1528594867408cb9c3071319b32f00))


- **(es/parser)** Allow non-prop operand in delete ([#10733](https://github.com/swc-project/swc/issues/10733)) ([38132e0](https://github.com/swc-project/swc/commit/38132e0e6abaead3eae15a08610ad5dda5026dd8))

### Features



- **(es/minifier)** Hoist more properties ([#10707](https://github.com/swc-project/swc/issues/10707)) ([0f2c8d5](https://github.com/swc-project/swc/commit/0f2c8d5963a48e582bf4517b4a52a6cfb31b399c))


- **(es/transforms)** Expose `tsEnumIsMutable` to JS ([#10716](https://github.com/swc-project/swc/issues/10716)) ([6b3ae00](https://github.com/swc-project/swc/commit/6b3ae008d80c0bf7b215cae7d8a754e51a732bc9))

### Performance



- **(es/minifier)** Make `CharFreq::scan` in mangler table-based ([#10679](https://github.com/swc-project/swc/issues/10679)) ([04d39aa](https://github.com/swc-project/swc/commit/04d39aaa9e57965dacc44d96f3e562cf8311d3bf))


- **(ts/fast-strip)** Use `swc_ecma_parser::Lexer` ([#10677](https://github.com/swc-project/swc/issues/10677)) ([ffe0292](https://github.com/swc-project/swc/commit/ffe029283139eafd533c287e52b4b7a3c7794b90))


- Optimize `Input::reset_to` ([#10719](https://github.com/swc-project/swc/issues/10719)) ([8084066](https://github.com/swc-project/swc/commit/808406616a86f84fa4599a22a01a5a3921975e0e))

### Refactor



- **(es/lexer)** Useless reset ([#10714](https://github.com/swc-project/swc/issues/10714)) ([c9eee0b](https://github.com/swc-project/swc/commit/c9eee0beadb2ba927b0c4e068eb034b7712ffffd))


- **(es/lexer)** Cleanup `read_int` ([#10727](https://github.com/swc-project/swc/issues/10727)) ([c5fb4b1](https://github.com/swc-project/swc/commit/c5fb4b13f5507dd4fb58f12860d0ec53d00c157d))


- **(es/parser)** Remove `read_number_no_dot` ([#10703](https://github.com/swc-project/swc/issues/10703)) ([fa8607f](https://github.com/swc-project/swc/commit/fa8607f1e42a0453d24e72d0c10ab62139d12dd7))


- **(es/parser)** Remove needless branching ([#10717](https://github.com/swc-project/swc/issues/10717)) ([b0c23b2](https://github.com/swc-project/swc/commit/b0c23b2d31a27205b061a68688dddf4bc59937d7))

### Testing



- **(es/preset-env)** Add entry import bench ([#10722](https://github.com/swc-project/swc/issues/10722)) ([9868b4d](https://github.com/swc-project/swc/commit/9868b4d095007bf971dfc3372e12c934d9992fee))


- Make codspeed concurrent on main branch ([#10711](https://github.com/swc-project/swc/issues/10711)) ([4392ce3](https://github.com/swc-project/swc/commit/4392ce3414a77ca98c9923c093d60ca662615852))

## [swc_core@v29.2.0] - 2025-06-26

### Bug Fixes



- **(es/minifier)** Drop pure tagged string call expr ([#10702](https://github.com/swc-project/swc/issues/10702)) ([85cd9a7](https://github.com/swc-project/swc/commit/85cd9a71d57d7c0e37b2158bfddfbdbe2b09622f))


- **(es/parser)** Support keywords as JSX member expression properties ([#10701](https://github.com/swc-project/swc/issues/10701)) ([643253d](https://github.com/swc-project/swc/commit/643253d5e1df643fd79eb3f494b56f15bdcbdb47))

### Features



- **(es/parser)** Add `override` and `out` keyword ([#10695](https://github.com/swc-project/swc/issues/10695)) ([636d7a3](https://github.com/swc-project/swc/commit/636d7a3830ca3de01ee2078385820e3a37d62343))


- **(es/parser)** Enable import attributes unconditionally ([#10706](https://github.com/swc-project/swc/issues/10706)) ([5ecc3ca](https://github.com/swc-project/swc/commit/5ecc3ca4da6998c8dc9c94d8c25ab10a3b70b62b))


- **(es/parser)** Expose Token API with unstable feature flag ([#10699](https://github.com/swc-project/swc/issues/10699)) ([750c7d4](https://github.com/swc-project/swc/commit/750c7d4c84d34091207932dde9e3e1aaac0cf391))

### Performance



- **(es/parser)** Do not compare error each time ([#10696](https://github.com/swc-project/swc/issues/10696)) ([0ae0341](https://github.com/swc-project/swc/commit/0ae0341d105a9c57810204352b775acdee26d18e))

## [swc_core@v29.1.4] - 2025-06-24

### Bug Fixes



- **(es/minifier)** Fix condition for preserving properties ([#10694](https://github.com/swc-project/swc/issues/10694)) ([5c57a05](https://github.com/swc-project/swc/commit/5c57a0559641121218aa8ef2be297c3a97570e70))

## [swc_core@v29.1.3] - 2025-06-24

### Bug Fixes



- **(es/parser)** Improve error message for template literals ([#10690](https://github.com/swc-project/swc/issues/10690)) ([a066b76](https://github.com/swc-project/swc/commit/a066b7629079ad15850c41a982031a62decebd2d))


- **(es/parser)** Rescan `>=` for JSX closing tag ([#10693](https://github.com/swc-project/swc/issues/10693)) ([fe82c4c](https://github.com/swc-project/swc/commit/fe82c4cf83b4cea05403b87bc665f9d0a84928e1))

### Miscellaneous Tasks



- **(ecosystem-ci)** Exclude `react-leaflet` ([cfbb1f9](https://github.com/swc-project/swc/commit/cfbb1f9505b430b2e93062611734d2f0a196b008))

### Testing



- **(es)** Remove outdated test snapshots ([#10689](https://github.com/swc-project/swc/issues/10689)) ([03d520b](https://github.com/swc-project/swc/commit/03d520bc5be02d45acb173c49d7fcd9580ccacf1))

### Build



- **(wasm)** Fix wasm builds ([eee0578](https://github.com/swc-project/swc/commit/eee05787231c07b41430d5bfed73f3c39011c491))

## [swc_core@v29.1.2] - 2025-06-23

### Bug Fixes



- **(es/parser)** Throw error if JSX does not end with `>` ([#10687](https://github.com/swc-project/swc/issues/10687)) ([cb3d6db](https://github.com/swc-project/swc/commit/cb3d6dbfd4dd9d82bea0222934daf902f57e1034))

### Refactor



- **(ts/fast-strip)** Rename crate ([#10685](https://github.com/swc-project/swc/issues/10685)) ([6b5904c](https://github.com/swc-project/swc/commit/6b5904c838394def3b45bd0d1c9bbdc75a1c1af9))

## [swc_core@v29.1.1] - 2025-06-23

### Bug Fixes



- **(es/react-compiler)** Use tsx syntax for parser ([#10682](https://github.com/swc-project/swc/issues/10682)) ([a355e37](https://github.com/swc-project/swc/commit/a355e376707f35845d5a8b30be0f98fbc2e73b5d))


- **(ts/isolated-dts)** Skip parameters without accessibility modifiers in private constructors ([#10675](https://github.com/swc-project/swc/issues/10675)) ([1976d8e](https://github.com/swc-project/swc/commit/1976d8ef2de0ffd3203b7f450f92ec91a1d3b260))

### Performance



- **(es/lexer)** Optimize lexing of numbers with separators ([#10665](https://github.com/swc-project/swc/issues/10665)) ([cac651b](https://github.com/swc-project/swc/commit/cac651b85d5e0bee9e4d1b1ba4d9df69621a5361))


- **(ts/fast-strip)** Prealloc buf for codegen ([#10680](https://github.com/swc-project/swc/issues/10680)) ([a8347fe](https://github.com/swc-project/swc/commit/a8347fea2711203209e1cd1b0c920cb83bb6d957))

## [swc_core@v29.1.0] - 2025-06-21

### Features



- **(ts/fast-strip)** Support JSX under a feature flag ([#10656](https://github.com/swc-project/swc/issues/10656)) ([6a70d17](https://github.com/swc-project/swc/commit/6a70d17f17109bcb2e6ed715fe321c3fb3eaae6e))

## [swc_core@v29.0.4] - 2025-06-21

### Bug Fixes



- **(hstr)** Support MSRV = `1.86` ([#10673](https://github.com/swc-project/swc/issues/10673)) ([de19d1e](https://github.com/swc-project/swc/commit/de19d1e79d9626b82ee07c3cdefcdcaa317e64e3))

## [swc_core@v29.0.3] - 2025-06-21

### Performance



- **(es/lexer)** Optimize number literal parsing with fast path ([#10655](https://github.com/swc-project/swc/issues/10655)) ([15d0828](https://github.com/swc-project/swc/commit/15d0828f2d9a741b053f26e88bd52b5c2c7c78f4))


- **(es/lexer)** Reduce allocations while lexing numbers ([#10667](https://github.com/swc-project/swc/issues/10667)) ([115d228](https://github.com/swc-project/swc/commit/115d228d90566fb09bf456be9fc203ff1fb7cb34))


- **(es/lexer)** Introduce `byte_search` to reduce comparison operations ([#10668](https://github.com/swc-project/swc/issues/10668)) ([3806ffd](https://github.com/swc-project/swc/commit/3806ffd04872a556b4a906348ade955814da044d))


- **(es/lexer)** Compare `\n` first ([#10669](https://github.com/swc-project/swc/issues/10669)) ([9c41e2f](https://github.com/swc-project/swc/commit/9c41e2f71016699917c8109c2bd4660cfa7fb4f3))


- **(es/minifier)** Remove needless clones ([#10661](https://github.com/swc-project/swc/issues/10661)) ([5f4f7dd](https://github.com/swc-project/swc/commit/5f4f7dd0f164a30ff6340dd0114fe0759e64d83f))

## [swc_core@v29.0.2] - 2025-06-21

### Bug Fixes



- **(es/parser)** Parse jsx entity ([#10652](https://github.com/swc-project/swc/issues/10652)) ([bfd3bc5](https://github.com/swc-project/swc/commit/bfd3bc5456a33e3d66008ea198d9c5f38660af39))


- **(es/parser)** Consider reseved ident in jsx name ([#10647](https://github.com/swc-project/swc/issues/10647)) ([9262a59](https://github.com/swc-project/swc/commit/9262a591fd8f35200948fa298aa0f9cc4d0a06e7))

### Performance



- **(es/parser)** Optimize `next_token` ([#10654](https://github.com/swc-project/swc/issues/10654)) ([1be2ca0](https://github.com/swc-project/swc/commit/1be2ca0d6e0cbe096352521b016320b6a30d36b7))

### Refactor



- **(es/lexer)** Remove faster path for `\t` ([#10650](https://github.com/swc-project/swc/issues/10650)) ([d6ac3b7](https://github.com/swc-project/swc/commit/d6ac3b7adbe067b3796cba57480806b3e23cfafb))

## [swc_core@v29.0.1] - 2025-06-19

### Bug Fixes



- **(es/minifier)** Fix `Buffer` handling of `minify()` API ([#10643](https://github.com/swc-project/swc/issues/10643)) ([cdf068e](https://github.com/swc-project/swc/commit/cdf068e1bd8f007e06f41bd05f98055243468ba4))


- **(es/minifier)** Fix arrow inlining ([#10642](https://github.com/swc-project/swc/issues/10642)) ([7232c10](https://github.com/swc-project/swc/commit/7232c102d36bbf6957bd7326d9392d2b00155ee9))


- Fix CI ([#10641](https://github.com/swc-project/swc/issues/10641)) ([9df98f7](https://github.com/swc-project/swc/commit/9df98f748eba99de4c51dc407de34b97456e93ce))

## [swc_core@v29.0.0] - 2025-06-19

### Bug Fixes



- Update `par-core` and `par-iter` ([#10629](https://github.com/swc-project/swc/issues/10629)) ([38f7d51](https://github.com/swc-project/swc/commit/38f7d51d3ca2d55a85020cca0cffc22b2e5b5b8a))

### Refactor



- **(es/parser)** Cleanup ([#10631](https://github.com/swc-project/swc/issues/10631)) ([c7c2035](https://github.com/swc-project/swc/commit/c7c2035292c3a86d65ad97438ffc9ffa2df09628))

## [swc_core@v28.0.3] - 2025-06-19

### Bug Fixes



- **(es/parser)** Don't be greedy in the end of jsx open el ([#10637](https://github.com/swc-project/swc/issues/10637)) ([8a2c656](https://github.com/swc-project/swc/commit/8a2c656d50dd1fe86b7338dc83cc1397a99ebbbe))

## [swc_core@v28.0.2] - 2025-06-19

### Bug Fixes



- **(ci)** Fix build of `@swc/minifier` ([0dc5244](https://github.com/swc-project/swc/commit/0dc52440ea8f2320614d0875fc421ba647f1a75c))


- **(es/codgen)** Emit leading comments of JSXExprContainer ([#10627](https://github.com/swc-project/swc/issues/10627)) ([2d2162a](https://github.com/swc-project/swc/commit/2d2162a1e90b997db130ba8ab9b262cd145f998a))

### Performance



- **(es/minifier)** Remove needless JSON conversion ([#10628](https://github.com/swc-project/swc/issues/10628)) ([4a58dca](https://github.com/swc-project/swc/commit/4a58dca92c71c2db871be3a09ea0aa6c9a6702fc))

## [swc_core@v28.0.1] - 2025-06-18

### Bug Fixes



- **(es/parser)** Allow type ann in jsx expr child ([#10626](https://github.com/swc-project/swc/issues/10626)) ([48f576c](https://github.com/swc-project/swc/commit/48f576c64ac119af3bc990c78f06678dc0fdd800))

## [swc_core@v28.0.0] - 2025-06-18

### Bug Fixes



- **(ts/isolated-dts)** Fix usage dependency ([#10621](https://github.com/swc-project/swc/issues/10621)) ([b3677d3](https://github.com/swc-project/swc/commit/b3677d36681820dd7c0f35ef97c44d5f7de69121))


- **(ts/isolated-dts)** Emit properties in overloaded constructor params ([#10623](https://github.com/swc-project/swc/issues/10623)) ([6634ef1](https://github.com/swc-project/swc/commit/6634ef1d2fd7f298a4c5fbb5c23e28c2571177b8))

### Features



- **(swc_common)** Allow returning `None` in `try_lookup_source_file` ([#10625](https://github.com/swc-project/swc/issues/10625)) ([d8e2405](https://github.com/swc-project/swc/commit/d8e2405d7f67867699eeda36ca59ac11ca7baf71))

### Performance



- **(atoms)** Improve `atom!` for inlinable strings ([#10612](https://github.com/swc-project/swc/issues/10612)) ([5113121](https://github.com/swc-project/swc/commit/51131212c3bd1992bdade5ab509572ad79d1aa53))

### Refactor



- **(es/parser)** Remove token contexts ([#10547](https://github.com/swc-project/swc/issues/10547)) ([7ffe9d2](https://github.com/swc-project/swc/commit/7ffe9d23ca55c61acef69782e88d2e0e0e7ea47a))

## [swc_core@v27.0.6] - 2025-06-17

### Bug Fixes



- **(es/codegen)** Fix `.map` path when using `output_path` ([01e5bd1](https://github.com/swc-project/swc/commit/01e5bd1d6560d3b40e98122e09d0f7bd7c73b4c5))


- **(swc)** Fix wrong caching of resolvers regarding file exts ([#10615](https://github.com/swc-project/swc/issues/10615)) ([68aacd1](https://github.com/swc-project/swc/commit/68aacd1dfc2dd97feb5636f1833a6fa1e15407bd))

## [swc_core@v27.0.5] - 2025-06-14

### Performance



- **(es/minifier)** Avoid calling some costly function when optimizing deep nested binary expr ([#10611](https://github.com/swc-project/swc/issues/10611)) ([1434571](https://github.com/swc-project/swc/commit/1434571477f5f8576a268a2bd32631eb9ce77229))


- **(es/parser)** Reduce cmp in jsx spread child ([#10606](https://github.com/swc-project/swc/issues/10606)) ([fb33c13](https://github.com/swc-project/swc/commit/fb33c135444edc4de4531cac7d5ae27feabfff76))

### Refactor



- **(es/parser)** Cleanup - deduplicate some code ([#10608](https://github.com/swc-project/swc/issues/10608)) ([5f9af96](https://github.com/swc-project/swc/commit/5f9af969d7a123b6cbc82c7a76489acf244a1cf3))

## [swc_core@v27.0.4] - 2025-06-12

### Bug Fixes



- **(es/minifier)** Perform DCE on the end ([#10602](https://github.com/swc-project/swc/issues/10602)) ([a97b149](https://github.com/swc-project/swc/commit/a97b1494267bba03436d160d39cd21ce68150173))

## [swc_core@v27.0.3] - 2025-06-12

### Bug Fixes



- **(es/minifier)** Fix top level detection of DCE ([#10603](https://github.com/swc-project/swc/issues/10603)) ([964a560](https://github.com/swc-project/swc/commit/964a5607d7bacb2bab1135bf0dd546a1a33fdb6c))


- **(es/minifier)** Fix inlining of arrows ([#10604](https://github.com/swc-project/swc/issues/10604)) ([cc3bc4d](https://github.com/swc-project/swc/commit/cc3bc4d66c381d33d00bc530b57c88447ae8ead8))

### Features



- **(es/parser)** Support parsing CommonJS ([#10600](https://github.com/swc-project/swc/issues/10600)) ([70bda6a](https://github.com/swc-project/swc/commit/70bda6a199bec4b0f8fddb20040a382c44a78354))

## [swc_core@v27.0.2] - 2025-06-11

### Bug Fixes



- **(@swc/types)** Remove `nativeClassProperties` ([#10592](https://github.com/swc-project/swc/issues/10592)) ([39032dc](https://github.com/swc-project/swc/commit/39032dcd96bc618fcddf55d0824836c56f766eab))


- **(swc_common)** Add `Files#is_in_file` ([#10599](https://github.com/swc-project/swc/issues/10599)) ([e6b61eb](https://github.com/swc-project/swc/commit/e6b61ebfde2b0680c3e4144e6725803b2d9d7fc8))


- Fix bindings ([0f858fd](https://github.com/swc-project/swc/commit/0f858fd3470c5c104ab9b6ca900ea97be37c615f))

## [swc_core@v27.0.0] - 2025-06-10

### Bug Fixes



- **(@swc/types)** Add `jsc.output.charset` ([#10567](https://github.com/swc-project/swc/issues/10567)) ([26b41e8](https://github.com/swc-project/swc/commit/26b41e86cb103fd6e9b76dcc9ed6625ef73ef9d0))


- **(es/codegen)** Don't call `cmt.get_leading` for dummy span ([#10568](https://github.com/swc-project/swc/issues/10568)) ([16e204d](https://github.com/swc-project/swc/commit/16e204d3fa44acfea087e2e8929b7989894cf7bc))


- **(es/parser)** Disallow spread operator(`...`) in JSX attribute values ([#10587](https://github.com/swc-project/swc/issues/10587)) ([8deba78](https://github.com/swc-project/swc/commit/8deba787bb7a210826be09ce065a7a40eef0d508))


- **(es/typescript)** Pass `native_class_properties` ([#10561](https://github.com/swc-project/swc/issues/10561)) ([7e4cd9a](https://github.com/swc-project/swc/commit/7e4cd9ad4fcd28bc179c75020acb9a596d405efb))


- **(es/typescript)** Handle `export declare var` in namespace ([#10579](https://github.com/swc-project/swc/issues/10579)) ([2daa17f](https://github.com/swc-project/swc/commit/2daa17f110910eae14412bbb29e8fdcf61265d13))


- **(ts/isolated-dts)** Add edges `SymbolFlags::Value` and `SymbolFlags::Type` in exports ([#10577](https://github.com/swc-project/swc/issues/10577)) ([e6d4da2](https://github.com/swc-project/swc/commit/e6d4da219530744171ba46bfa44a06076080e7c2))

### Documentation



- **(contributing)** Add a script to patch local projects ([#10565](https://github.com/swc-project/swc/issues/10565)) ([3ac0a21](https://github.com/swc-project/swc/commit/3ac0a21288c780ef1267cfeba2662bc6a825b508))

### Features



- **(es/minifier)** Regex support for `format.comments` ([#10571](https://github.com/swc-project/swc/issues/10571)) ([e441df5](https://github.com/swc-project/swc/commit/e441df50105a99c4725277278059e9b6100a95d0))


- **(es/module)** Add support for `import.meta.main` in AMD and CJS ([#10596](https://github.com/swc-project/swc/issues/10596)) ([759de2e](https://github.com/swc-project/swc/commit/759de2e463864d331e5528bbe60b400efb3b1f84))

### Miscellaneous Tasks



- **(ecosystem-ci)** Exclude `ts-node` ([2b284e1](https://github.com/swc-project/swc/commit/2b284e1930bd9aab88d74bef0f7453bf23e2ddfe))


- **(plugin/runner)** Update `virtual-fs` to dedupe dependencies ([#10594](https://github.com/swc-project/swc/issues/10594)) ([de667bb](https://github.com/swc-project/swc/commit/de667bbc485efae5dcb2ba0bd0c29b90e66605d2))

### Refactor



- **(es/lexer)** Remove unnecessary result wrap ([#10578](https://github.com/swc-project/swc/issues/10578)) ([49d15df](https://github.com/swc-project/swc/commit/49d15df1b4d2f5e07d10e10c75dcbeb637b2528d))


- **(es/parser)** Extract `parse_jsx_attrs` ([#10569](https://github.com/swc-project/swc/issues/10569)) ([6492786](https://github.com/swc-project/swc/commit/649278679eab86e6cf167c170ecb49987559e26c))


- **(es/parser)** Remove `cur!(false)` macro ([#10583](https://github.com/swc-project/swc/issues/10583)) ([c96fa23](https://github.com/swc-project/swc/commit/c96fa238168ce6418781b6c6c14aea7de832d67c))


- **(swc_common)** Remove `Input::find` ([#10542](https://github.com/swc-project/swc/issues/10542)) ([494cef9](https://github.com/swc-project/swc/commit/494cef9982b7b9f93601ed8c0f49978a7d260259))


- **(swc_common)** Use `BytesStr` instead of `Lrc<String>` ([#10580](https://github.com/swc-project/swc/issues/10580)) ([6f00973](https://github.com/swc-project/swc/commit/6f00973ba08b19f09adb1bc9b9dd9558be27247a))


- **(swc_common)** Use `swc_sourcemap` instead ([#10593](https://github.com/swc-project/swc/issues/10593)) ([8a9f609](https://github.com/swc-project/swc/commit/8a9f609061e65977b97baca95dce147fa19e92fd))

### Testing



- **(es/parser)** Enable jsx test ([#10566](https://github.com/swc-project/swc/issues/10566)) ([72b1efe](https://github.com/swc-project/swc/commit/72b1efeaec0931b17c9a7b0acd52be8de77d07dc))

## [swc_core@v26.4.5] - 2025-06-05

### Bug Fixes



- **(es/codegen)** Exclude `constructor` from source map names ([#10551](https://github.com/swc-project/swc/issues/10551)) ([ef85640](https://github.com/swc-project/swc/commit/ef856402515758196f5d925bcfb8213bf0ca18fd))

## [swc_core@v26.4.4] - 2025-06-04

### Bug Fixes



- **(es/fixer)** Fix a bug with awaited arrow fn expression ([#10555](https://github.com/swc-project/swc/issues/10555)) ([9dfdfa6](https://github.com/swc-project/swc/commit/9dfdfa62d3603586ff4279daf4e66443c024cdd6))


- **(swc_common)** Revert skip condition patch ([#10564](https://github.com/swc-project/swc/issues/10564)) ([2a2b284](https://github.com/swc-project/swc/commit/2a2b284f2522ee1bb04033a4aa787b853617823f))

## [swc_core@v26.4.3] - 2025-06-04

### Bug Fixes



- **(swc_common)** Fix skip condition for sourcemap, really ([#10563](https://github.com/swc-project/swc/issues/10563)) ([14feedb](https://github.com/swc-project/swc/commit/14feedb55286bbd811b4dfba26501bd1127067fe))

## [swc_core@v26.4.2] - 2025-06-04

### Bug Fixes



- **(swc_common)** Fix skip condition for sourcemap ([#10562](https://github.com/swc-project/swc/issues/10562)) ([cbee0df](https://github.com/swc-project/swc/commit/cbee0dfa2b82ed470a387d06470e70617a6ee60a))

## [swc_core@v26.4.0] - 2025-06-04

### Bug Fixes



- **(es/minifier)** Inline object of member if prop is an ident ([#10548](https://github.com/swc-project/swc/issues/10548)) ([e554381](https://github.com/swc-project/swc/commit/e554381bffa3602d7ce9ee156652cf654bac507f))


- **(es/minifier)** Add side effect check for test expr when compressing IfStmt ([#10550](https://github.com/swc-project/swc/issues/10550)) ([3e9728e](https://github.com/swc-project/swc/commit/3e9728e70c77139a770717f87a9e54920e4a58c9))


- **(es/minifier)** Fix typo in an option name ([#10554](https://github.com/swc-project/swc/issues/10554)) ([a303941](https://github.com/swc-project/swc/commit/a303941a36a59db19fe376b7601378fdc3830212))

### Features



- **(swc_common)** Add `map_raw_pos` to `Files` ([#10560](https://github.com/swc-project/swc/issues/10560)) ([71224c3](https://github.com/swc-project/swc/commit/71224c365335e970f6dd12a47b4524da6d861bb3))

### Refactor



- **(es/lexer)** Share `skip_block_comment` ([#10549](https://github.com/swc-project/swc/issues/10549)) ([b101a87](https://github.com/swc-project/swc/commit/b101a87771d287b8e3bd9ae60a94b39de192718b))


- **(es/parser)** Cleanup ([#10559](https://github.com/swc-project/swc/issues/10559)) ([963ac9e](https://github.com/swc-project/swc/commit/963ac9efb23d4613932bcb6a29b94b9ac5d13860))

## [swc_core@v26.3.4] - 2025-06-02

### Bug Fixes



- **(es/parser)** Emit syntax errors for strict mode in non-module or scripts ([#10545](https://github.com/swc-project/swc/issues/10545)) ([1291b4a](https://github.com/swc-project/swc/commit/1291b4a78c51512fb0c699f3409275f4065bbc0b))

### Performance



- **(swc_common)** Remove `char_indices` calls ([#10541](https://github.com/swc-project/swc/issues/10541)) ([51507bc](https://github.com/swc-project/swc/commit/51507bcfa24fcdc202e5bbf255a24feb1665a395))

## [swc_core@v26.3.3] - 2025-06-02

### Bug Fixes



- **(swc_common)** Fix build ([#10544](https://github.com/swc-project/swc/issues/10544)) ([2ed934d](https://github.com/swc-project/swc/commit/2ed934d4a1b2c85d6cc04c038aaee3e09c189e8b))

## [swc_core@v26.3.2] - 2025-06-02

### Features



- **(swc_common)** Add `Globals::clone_data` ([#10543](https://github.com/swc-project/swc/issues/10543)) ([39f30b0](https://github.com/swc-project/swc/commit/39f30b066fe4d91f8df641fe59aba86acb10d645))

## [swc_core@v26.3.1] - 2025-05-30

### Bug Fixes



- **(react-compiler)** Fix fast check ([#10538](https://github.com/swc-project/swc/issues/10538)) ([9403ce2](https://github.com/swc-project/swc/commit/9403ce2e7372dbcd579e2710480f2ffc78d8bcca))

## [swc_core@v26.3.0] - 2025-05-29

### Bug Fixes



- **(es/codegen)** Improve comments handling ([#10534](https://github.com/swc-project/swc/issues/10534)) ([d9ba838](https://github.com/swc-project/swc/commit/d9ba838df9b88d6c4108bc21dd9d6eebd406aacd))

### Refactor



- **(es/lexer)** Cleanup code for reading tokens ([#10533](https://github.com/swc-project/swc/issues/10533)) ([a72092c](https://github.com/swc-project/swc/commit/a72092c13166fe80d494e49cf0c5ec04e93ee4eb))

## [swc_core@v26.2.2] - 2025-05-27

### Bug Fixes



- **(ts/fast-dts)** Ensure correct emission of template literals and symbol-keyed properties ([#10530](https://github.com/swc-project/swc/issues/10530)) ([8dbdbef](https://github.com/swc-project/swc/commit/8dbdbef266f508e09f52ffe1cbe2e953e5039a3d))

## [swc_core@v26.2.1] - 2025-05-27

### Features



- **(es/regexp)** Add crates for RegExp ([#10525](https://github.com/swc-project/swc/issues/10525)) ([4b3f924](https://github.com/swc-project/swc/commit/4b3f924edf996983e2a61cc29eb0c552cf71af7a))

### Performance



- **(es/minifier)** Remove needless clone ([#10523](https://github.com/swc-project/swc/issues/10523)) ([1c02ef6](https://github.com/swc-project/swc/commit/1c02ef63aa48b239a43f359991af736071634a21))


- **(es/parser)** Reduce comparison while reading logical ([#10526](https://github.com/swc-project/swc/issues/10526)) ([2bc551c](https://github.com/swc-project/swc/commit/2bc551cb39d99ecebd5d6f10fc94a93173b2aefa))

### Refactor



- **(es/parser)** Share code for parsing strings ([#10522](https://github.com/swc-project/swc/issues/10522)) ([931a2d6](https://github.com/swc-project/swc/commit/931a2d6761bfec72cdda7eb875ad02dc217848b9))

## [swc_core@v26.2.0] - 2025-05-23

### Miscellaneous Tasks



- **(bindings)** Use published versions of crates ([#10513](https://github.com/swc-project/swc/issues/10513)) ([f65f028](https://github.com/swc-project/swc/commit/f65f02831cb68245d5790a6c867ac3e997eedbfd))

### Performance



- **(es/minifier)** Merge `PropertyCollector` into usage analyzer ([#10514](https://github.com/swc-project/swc/issues/10514)) ([505bf54](https://github.com/swc-project/swc/commit/505bf542cd197afb2a5a5f7cd89ed97ac681a923))

## [swc_core@v26.1.1] - 2025-05-22

### Bug Fixes



- **(es/minifier)** Fix missing variable ([#10478](https://github.com/swc-project/swc/issues/10478)) ([6de3ef6](https://github.com/swc-project/swc/commit/6de3ef65bc599679020de13a3085824f06e047a7))


- **(es/utils)** Fix `extract_var_ids` ([#10511](https://github.com/swc-project/swc/issues/10511)) ([5644372](https://github.com/swc-project/swc/commit/56443727dd195a2a3500014b8f54b9a18e14e484))

## [swc_core@v26.1.0] - 2025-05-22

### Bug Fixes



- **(es/react-compiler)** Fix usefulness detection ([#10506](https://github.com/swc-project/swc/issues/10506)) ([41075a1](https://github.com/swc-project/swc/commit/41075a1c8776b62d7c2fc6436677d5d6b083a2f8))


- **(ts/fast-dts)** Correctly emit Symbol-keyed accessors in declarations ([#10508](https://github.com/swc-project/swc/issues/10508)) ([1298e76](https://github.com/swc-project/swc/commit/1298e767e78d69ba02efb1cb3260266b5a2812c2))

### Performance



- **(es/renamer)** Merge analyze/collect ([#10509](https://github.com/swc-project/swc/issues/10509)) ([7b47f66](https://github.com/swc-project/swc/commit/7b47f661dd6794f658023b649ebcdc153fe6e27c))

### Refactor



- **(es/codegen)** Migrate to `ryu-js` for numeric literal codegen ([#10503](https://github.com/swc-project/swc/issues/10503)) ([4bc4244](https://github.com/swc-project/swc/commit/4bc4244c195d3a364b588348657fd8a3d8c22079))


- **(ts/fast-dts)** Derive computed flags from source code ([#10510](https://github.com/swc-project/swc/issues/10510)) ([a2d5664](https://github.com/swc-project/swc/commit/a2d56645cbf753770a2634e23423a59acaae6b84))

## [swc_core@v26.0.1] - 2025-05-21

### Bug Fixes



- **(ts/fast-dts)** Emit `readonly` for Object getter prop ([#10492](https://github.com/swc-project/swc/issues/10492)) ([6c03e20](https://github.com/swc-project/swc/commit/6c03e20a98b239572c29424165d6031207a7340d))


- **(ts/fast-dts)** Align object getter/setter emit behavior with TypeScript ([#10502](https://github.com/swc-project/swc/issues/10502)) ([78c754e](https://github.com/swc-project/swc/commit/78c754e7a6057c07db077f2954a11d0eb7eb7276))

### Refactor



- **(ecma/transform)** Cleanup rename analyzer ([#10500](https://github.com/swc-project/swc/issues/10500)) ([de51be1](https://github.com/swc-project/swc/commit/de51be1a782af1f22c2ca5ab3ddc5fa187872281))


- **(es/renamer)** Inline `get_unresolved` ([#10493](https://github.com/swc-project/swc/issues/10493)) ([0f5d9c1](https://github.com/swc-project/swc/commit/0f5d9c1ac780b8db83dcaf108aef499157b084c3))

## [swc_core@v26.0.0] - 2025-05-20

### Bug Fixes



- **(es/compat)** Properly handle rest assignment in for-in/of head ([#10489](https://github.com/swc-project/swc/issues/10489)) ([b9c0446](https://github.com/swc-project/swc/commit/b9c04468f17f0583a132f00daf9d138ce38a9d8b))

### Features



- Initialize `@swc/react-compiler` ([#10475](https://github.com/swc-project/swc/issues/10475)) ([883b24c](https://github.com/swc-project/swc/commit/883b24c6248fecb223693974951080889bd8827a))

### Performance



- **(es/renamer)** Merge Id/Def collector ([#10487](https://github.com/swc-project/swc/issues/10487)) ([73377f0](https://github.com/swc-project/swc/commit/73377f09dc83624559f7d1539de59922c42836c9))


- **(es/utils)** Stop visiting once found in `EvalFinder` ([#10483](https://github.com/swc-project/swc/issues/10483)) ([3402270](https://github.com/swc-project/swc/commit/3402270edc81838451c7ce3a5cc93ba205d076d6))

### Refactor



- **(es/minifier)** Merge label/private name renamer ([#10480](https://github.com/swc-project/swc/issues/10480)) ([5add84d](https://github.com/swc-project/swc/commit/5add84dffcc4c03ed79e4aa29ded3fc1bfa70a7d))


- **(es/parser)** Split parser into also-lex/parse-only ([#10399](https://github.com/swc-project/swc/issues/10399)) ([26289ab](https://github.com/swc-project/swc/commit/26289ab766230a896da6c3a2d95a157ce3793eee))


- **(es/parser)** Parse shebang and cleanup ([#10481](https://github.com/swc-project/swc/issues/10481)) ([619873a](https://github.com/swc-project/swc/commit/619873a2cf7d5ddb1ce1aa59123371127dc9f2f6))


- **(es/parser)** Cleanup usage of `is!` and `bump!` ([#10490](https://github.com/swc-project/swc/issues/10490)) ([b695b68](https://github.com/swc-project/swc/commit/b695b6830e2e7a4d1922fa455d94fe4d912effa4))

## [swc_core@v25.0.0] - 2025-05-16

### Bug Fixes



- **(ci)** Remove wasmer override ([425eeb9](https://github.com/swc-project/swc/commit/425eeb905656cede2e67cdd114beb5bc2fc6699d))


- **(es/minifier)** Properly handle object shorthand syntax during compression ([#10467](https://github.com/swc-project/swc/issues/10467)) ([bae4940](https://github.com/swc-project/swc/commit/bae494039d49967c05c6d34645de25ade13aac33))


- **(es/renamer)** Fix (broken) identifier preserving API ([#10474](https://github.com/swc-project/swc/issues/10474)) ([06c64cf](https://github.com/swc-project/swc/commit/06c64cf9ed0e84891daf102f8756fcb1ee516527))

### Features



- **(es/module)** Add support for stripping "node:" prefix in imports and exports ([#10461](https://github.com/swc-project/swc/issues/10461)) ([ae2ff62](https://github.com/swc-project/swc/commit/ae2ff627a1bf0ea0e479361cc267c8f7ebde8f49))

### Miscellaneous Tasks



- **(es/minifier)** Remove useless check ([#10471](https://github.com/swc-project/swc/issues/10471)) ([ca85958](https://github.com/swc-project/swc/commit/ca859584036b2fb2e8a9398e602e2a7f42e36a07))

### Performance



- **(common)** Accept owned instance of `sourcemap::SourceMap` ([#10463](https://github.com/swc-project/swc/issues/10463)) ([6ee439a](https://github.com/swc-project/swc/commit/6ee439aa7a96f99524c2aaee88d200e301ae611c))


- **(es/minifier)** Clear graph eagerly in DCE ([#10455](https://github.com/swc-project/swc/issues/10455)) ([31e21d7](https://github.com/swc-project/swc/commit/31e21d7cbc9ed3b359ff2a48771a6fda16e916bc))


- **(es/minifier)** Perform full analysis only once for DCE ([#10454](https://github.com/swc-project/swc/issues/10454)) ([61baf84](https://github.com/swc-project/swc/commit/61baf849424a4f430f584b90a3a797578f316693))


- **(es/minifier)** Use `bitflags` for var info ([#10459](https://github.com/swc-project/swc/issues/10459)) ([36f8385](https://github.com/swc-project/swc/commit/36f8385256caca7efa42fb5a8e129d51df9df226))

### Refactor



- **(common)** Remove unused methods ([#10469](https://github.com/swc-project/swc/issues/10469)) ([b77311a](https://github.com/swc-project/swc/commit/b77311adfc19fa41c2b316e37ef3832c9ffaede8))


- **(es)** Remove unused code ([#10460](https://github.com/swc-project/swc/issues/10460)) ([d344133](https://github.com/swc-project/swc/commit/d34413338b387e58c3ea998ca05f26bac81fbe6f))


- **(es)** Deduplicate `EvalFinder` ([#10472](https://github.com/swc-project/swc/issues/10472)) ([9f104af](https://github.com/swc-project/swc/commit/9f104af5089b34f0ffccf29d5f77c2abdfc83066))


- **(es/minifier)** Remove unused file ([#10465](https://github.com/swc-project/swc/issues/10465)) ([7d49097](https://github.com/swc-project/swc/commit/7d490978251d85696e0279298a736ebd286c5685))


- **(es/transforms)** Unify `preset_env` and `es_version` transform ([#10451](https://github.com/swc-project/swc/issues/10451)) ([6546c27](https://github.com/swc-project/swc/commit/6546c27fab5a3bd3b1a114ccf35c5a5c725935fe))

## [swc_core@v24.0.0] - 2025-05-12

### Bug Fixes



- **(es/jest)** Revert #10410 ([#10452](https://github.com/swc-project/swc/issues/10452)) ([bc756f8](https://github.com/swc-project/swc/commit/bc756f84c9b1c154fe7f00193066301658ef1484))

### Features



- **(common)** Add `ignoreList` support for sourcemap ([#10442](https://github.com/swc-project/swc/issues/10442)) ([6750459](https://github.com/swc-project/swc/commit/6750459d9180048a39c11e14b02c9bfed251a12e))


- **(config)** Allow using glob in some places ([#10445](https://github.com/swc-project/swc/issues/10445)) ([f7a6359](https://github.com/swc-project/swc/commit/f7a635985e8bf9654ed999b3d4da72b4a27e7fda))


- **(config)** Use `globset` instead ([#10446](https://github.com/swc-project/swc/issues/10446)) ([7bbaef8](https://github.com/swc-project/swc/commit/7bbaef8b170348839f1b43617244c1809896c094))

### Performance



- **(es/minifier)** Use fxhash for DCE ([#10440](https://github.com/swc-project/swc/issues/10440)) ([c0ddd96](https://github.com/swc-project/swc/commit/c0ddd96f694ca35825d7ca89a1bb318ffb23625c))


- **(es/minifier)** Remove needless `collect_decls` call ([#10450](https://github.com/swc-project/swc/issues/10450)) ([8e4b6ce](https://github.com/swc-project/swc/commit/8e4b6ce881448813935e6ae68d16a838d7a01838))


- **(es/optimization)** Rely on `resolver` from `inline_globals` ([#10449](https://github.com/swc-project/swc/issues/10449)) ([1978809](https://github.com/swc-project/swc/commit/197880946afb1eeea85520b83fa04a91fc1c6de4))


- **(es/utils)** Make `IdentUsageFinder` parallel ([#10444](https://github.com/swc-project/swc/issues/10444)) ([d074bca](https://github.com/swc-project/swc/commit/d074bcaf201e26ce2973633f9ef9f142b74f8dc3))

### Build



- Update `rustc` to `nightly-2025-05-06` ([#10443](https://github.com/swc-project/swc/issues/10443)) ([a7cbde7](https://github.com/swc-project/swc/commit/a7cbde7fdbe17c12bd0c2b205f0349a21707ec65))

## [swc_core@v23.2.0] - 2025-05-06

### Build



- **(plugin)** Update `wasmer` to `v6.0.0` ([#10439](https://github.com/swc-project/swc/issues/10439)) ([b9eff3c](https://github.com/swc-project/swc/commit/b9eff3c92b77cfd9b15b24d7e08614ac0c59f8fd))

## [swc_core@v23.1.0] - 2025-05-06

### Bug Fixes



- **(es/react-compiler)** Mark function components declared as a var interesting ([#10437](https://github.com/swc-project/swc/issues/10437)) ([5eac076](https://github.com/swc-project/swc/commit/5eac076b77fa43649cde468deee49771a987781c))

### Features



- **(common)** Allow using `build_sourcemap` with multiple `SourceMap` ([#10438](https://github.com/swc-project/swc/issues/10438)) ([2a07c8a](https://github.com/swc-project/swc/commit/2a07c8a9c223cbb3862cf7aaafa7659667d13b6e))

## [swc_core@v22.6.0] - 2025-05-02

### Bug Fixes



- **(@swc/types)** Add `transform.nativeClassProperties` ([#10418](https://github.com/swc-project/swc/issues/10418)) ([f3af44c](https://github.com/swc-project/swc/commit/f3af44c1540268c02c86b71796f1a0ac50594584))


- **(@swc/types)** Add `resolveFully` to `BaseModuleConfig` ([#10426](https://github.com/swc-project/swc/issues/10426)) ([164cbaa](https://github.com/swc-project/swc/commit/164cbaa2c02a3216096fa7b969fcfa6575954892))


- **(es/jest)** Hoisting vars with names starting with mock ([#10410](https://github.com/swc-project/swc/issues/10410)) ([a29eb29](https://github.com/swc-project/swc/commit/a29eb2973365ae22cae0fde6e20693b538962cf9))


- **(es/module)** Handle `__proto__` export name ([#10420](https://github.com/swc-project/swc/issues/10420)) ([1b94c7a](https://github.com/swc-project/swc/commit/1b94c7a7fb8c55200faa474448f2cc29612f6aa0))


- **(es/optimization)** Support decimal numbers in `jsonify` ([#10424](https://github.com/swc-project/swc/issues/10424)) ([affdec2](https://github.com/swc-project/swc/commit/affdec2be84d58ac30f91bf17325bd3095e1ce46))

### Features



- **(es/react-compiler)** Initialize support crate ([#10422](https://github.com/swc-project/swc/issues/10422)) ([1e88e6b](https://github.com/swc-project/swc/commit/1e88e6b4143ba450b80fedcf4bdd34aa0a990590))

### Refactor



- **(common)** Remove useless `&mut` ([#10405](https://github.com/swc-project/swc/issues/10405)) ([edbeb49](https://github.com/swc-project/swc/commit/edbeb4947a78d778de111c61f02edf0e8d3ce3ae))

## [swc_core@v22.5.4] - 2025-04-29

### Bug Fixes



- **(es/compat)** Remove `PURE` mark from _async_to_generator ([#10414](https://github.com/swc-project/swc/issues/10414)) ([1c6f65c](https://github.com/swc-project/swc/commit/1c6f65cd5b2c742a41b35b8711af00eb61297f88))

## [swc_core@v22.5.3] - 2025-04-29

### Bug Fixes



- **(es/proposal)** Preserve class id for hoisted classes when transforming `using` declarations ([#10407](https://github.com/swc-project/swc/issues/10407)) ([b703f21](https://github.com/swc-project/swc/commit/b703f21f6175386be7794ff1adaff471e42af9f3))

### Refactor



- Use debug level tracing for ast related tracing ([#10411](https://github.com/swc-project/swc/issues/10411)) ([3a0fa99](https://github.com/swc-project/swc/commit/3a0fa9968ebce3f6ce46961fa539dbbb07d32658))

## [swc_core@v22.5.2] - 2025-04-23

### Miscellaneous Tasks



- **(bindings/node)** Add `README.md` ([#10402](https://github.com/swc-project/swc/issues/10402)) ([a0e89f0](https://github.com/swc-project/swc/commit/a0e89f09b86a2dd034020257907130ad1c66797f))

### Performance



- **(common)** Use `next` instead of `nth` ([#10403](https://github.com/swc-project/swc/issues/10403)) ([12c2807](https://github.com/swc-project/swc/commit/12c28079fccc67c8e125a782c9dfd7ef5354df9e))

## [swc_core@v22.5.1] - 2025-04-21

### Bug Fixes



- **(es/proposal)** Fix exported class for `explicit-resource-management` ([#10393](https://github.com/swc-project/swc/issues/10393)) ([6b5dbc6](https://github.com/swc-project/swc/commit/6b5dbc6078248cc6fd467a7f57be17082b837565))


- **(swc_core)** Fix downstream doc builds ([#10401](https://github.com/swc-project/swc/issues/10401)) ([df511ba](https://github.com/swc-project/swc/commit/df511ba183570f1a2f4564cd24a3d67dd3b3573c))

### Miscellaneous Tasks



- **(es/utils)** Mark Symbol members as literal ([#10400](https://github.com/swc-project/swc/issues/10400)) ([3935b60](https://github.com/swc-project/swc/commit/3935b60340685d1f4aa464da8e9cec80c48cabd2))

## [swc_core@v22.5.0] - 2025-04-18

### Bug Fixes



- Upgrade browserslist-rs version ([#10389](https://github.com/swc-project/swc/issues/10389)) ([f802892](https://github.com/swc-project/swc/commit/f802892add01c7dac9744db1a8f1f7366b43dd0a))

### Miscellaneous Tasks



- **(es/parser)** Remove useless check ([#10386](https://github.com/swc-project/swc/issues/10386)) ([d1770ac](https://github.com/swc-project/swc/commit/d1770ac5d75a295fc0910cc5185c8d6a75b2b9be))

### Performance



- **(es/minifier)** Use bigflags to reduce context size of analyzer ([#10380](https://github.com/swc-project/swc/issues/10380)) ([773d19c](https://github.com/swc-project/swc/commit/773d19cdc49ddb55ed6f6c3262a0fccbf73b4c5f))


- **(es/minifier)** Use `bitflags` to reduce context size of `InfectionCollector`  ([#10387](https://github.com/swc-project/swc/issues/10387)) ([126d432](https://github.com/swc-project/swc/commit/126d43295e7f5e09092da653f537c843f2d79836))


- **(es/minifier)** Use `bitflags` to reduce compress context size ([#10381](https://github.com/swc-project/swc/issues/10381)) ([99495bd](https://github.com/swc-project/swc/commit/99495bde7e73b045c8d2aea8a3fa9a2c9492ca82))


- **(es/parser)** Move `found_module_item` to `Parser` ([#10388](https://github.com/swc-project/swc/issues/10388)) ([fd52c5c](https://github.com/swc-project/swc/commit/fd52c5c5c0682309042e22ecc511a1a1712322ec))

### Refactor



- **(es/lexer)** Split lexer ([#10377](https://github.com/swc-project/swc/issues/10377)) ([3ef2bd1](https://github.com/swc-project/swc/commit/3ef2bd13d0102b2a59a5c32c4197ccdea998b5f2))

### Testing



- **(es/transform)** Add tests for source map ([#10375](https://github.com/swc-project/swc/issues/10375)) ([0018a8e](https://github.com/swc-project/swc/commit/0018a8ead2592857b9a6dff446933c16f58a9df2))

## [swc_core@v22.4.0] - 2025-04-15

### Bug Fixes



- **(es/parser)** Parse `export default from;` with `exportDefaultFrom: true` option ([#10373](https://github.com/swc-project/swc/issues/10373)) ([a270cb0](https://github.com/swc-project/swc/commit/a270cb0f469b174cd36174740a674f0ffc19b042))

### Features



- **(bindings/core)** Enhance existing parse function to accept both string and buffer types([#10371](https://github.com/swc-project/swc/issues/10371)) ([c9a2afc](https://github.com/swc-project/swc/commit/c9a2afcfd1b6ce0bd5ca8ea56a4ab7f75a629094))


- **(css/prefixer)** Fix default implementation ([#10351](https://github.com/swc-project/swc/issues/10351)) ([34f4e41](https://github.com/swc-project/swc/commit/34f4e4158524da6d2a9fbbea96ecaab861336553))

### Refactor



- **(es/compat)** Simplify `async_to_generator` ([#10341](https://github.com/swc-project/swc/issues/10341)) ([e9eeba1](https://github.com/swc-project/swc/commit/e9eeba1b3d4b2c291633c4a8951737c4a5b2246c))

## [swc_core@v22.3.0] - 2025-04-14

### Bug Fixes



- **(es/helpers)** Sync tslib `_ts_generator` implementation ([#10366](https://github.com/swc-project/swc/issues/10366)) ([d3fb992](https://github.com/swc-project/swc/commit/d3fb992a2f16882837cef4b6932be5d5415e7268))


- **(es/proposal)** Fix scope of declarations for `explicit-resource-management` ([#10362](https://github.com/swc-project/swc/issues/10362)) ([eb7f7e9](https://github.com/swc-project/swc/commit/eb7f7e9ff99ad639cc65e5ea702194c75a013f02))


- **(ts/fast-strip)** Increase Wasm stack size ([#10359](https://github.com/swc-project/swc/issues/10359)) ([6d444a5](https://github.com/swc-project/swc/commit/6d444a55921a6836db80661254b855bcb01376bc))

### Miscellaneous Tasks



- **(es/parser)** Remove useless check ([#10363](https://github.com/swc-project/swc/issues/10363)) ([0f6a8c3](https://github.com/swc-project/swc/commit/0f6a8c3f3d64ef80b888bf7d4d7fed31d28d81f5))

### Performance



- **(es/parser)** Reduce string comparison ([#10355](https://github.com/swc-project/swc/issues/10355)) ([21789c4](https://github.com/swc-project/swc/commit/21789c407795189b6ac1383e728763fcb44f5790))


- **(es/parser)** Add initial capacitity for some vectors ([#10361](https://github.com/swc-project/swc/issues/10361)) ([7b7b50e](https://github.com/swc-project/swc/commit/7b7b50e6cd96e49f2db7d564ad7724ee17909be2))


- **(es/parser)** Reduce clone of token contexts ([#10364](https://github.com/swc-project/swc/issues/10364)) ([3ab47b2](https://github.com/swc-project/swc/commit/3ab47b291f846d12aa26f209999978a91dc31719))


- **(es/parser)** Use `bitflags` to reduce parser context size ([#10367](https://github.com/swc-project/swc/issues/10367)) ([a2d3596](https://github.com/swc-project/swc/commit/a2d35960ad39799e105d15cb30a90b5344345646))


- **(es/parser)** Replace byte arguments with generics ([#10370](https://github.com/swc-project/swc/issues/10370)) ([68f7667](https://github.com/swc-project/swc/commit/68f76679b4a46205cb129be44f36ca31fac953c3))


- **(es/parser)** Use `arrayvec` and unsafe `push` to optimize escaped string parsing ([#10369](https://github.com/swc-project/swc/issues/10369)) ([e12ae1c](https://github.com/swc-project/swc/commit/e12ae1c994d901caab57335d16678d6e2aad7e0e))

## [swc_core@v22.2.1] - 2025-04-11

### Bug Fixes



- **(es/resolver)** Handle using declarations ([#10354](https://github.com/swc-project/swc/issues/10354)) ([dad815c](https://github.com/swc-project/swc/commit/dad815cee63f89fbdb393bdf8c02751ea4c4e929))

### Performance



- **(es/parser)** Remove ascii check for no-ascii ([#10350](https://github.com/swc-project/swc/issues/10350)) ([4279b96](https://github.com/swc-project/swc/commit/4279b96d12f259bd3205a71b3402402fe4880d5b))

## [swc_core@v22.2.0] - 2025-04-11

### Testing



- **(es)** Unignore tests and update node to `20` in exec tests ([#10348](https://github.com/swc-project/swc/issues/10348)) ([eee73ce](https://github.com/swc-project/swc/commit/eee73cec761d1c28f6d1b87be9082fdf2af6e226))

## [swc_core@v22.0.0] - 2025-04-10

### Bug Fixes



- **(error_reporters)** Removing unused code to fix clippy check ([#10338](https://github.com/swc-project/swc/issues/10338)) ([5970f93](https://github.com/swc-project/swc/commit/5970f937f7dec526fc45d0c33f28e2f0c3f86758))


- **(es/minifier)** Preserve block with block scoped declaration ([#10335](https://github.com/swc-project/swc/issues/10335)) ([a4ac3b7](https://github.com/swc-project/swc/commit/a4ac3b7188c595aa76d0f28c75d302da7fe25ccc))


- **(es/parser)** Allow abstract method named `accessor` ([#10327](https://github.com/swc-project/swc/issues/10327)) ([3f71776](https://github.com/swc-project/swc/commit/3f7177665cda8497961bdaf8d8cff5a41e09df00))


- **(es/preset-env)** Consider `browserslist` config if `env.target` is not configured ([#8921](https://github.com/swc-project/swc/issues/8921)) ([a2dc372](https://github.com/swc-project/swc/commit/a2dc372f9ce8f89c2446ee5df3e205223616d229))


-  fix(es/compat): Remove one promise tick in yield* (tc39/ecma262#2819) ([#10317](https://github.com/swc-project/swc/issues/10317))

**Related issue:**

- babel/babel#14877
- tc39/ecma262#2819 ([3fb1950](https://github.com/swc-project/swc/commit/3fb19505b58039eb3d2b1e7790321567c4b3b124))

### Features



- **(errors)** Integrate `miette` for enhanced diagnostic reporting ([#10241](https://github.com/swc-project/swc/issues/10241)) ([156c3b1](https://github.com/swc-project/swc/commit/156c3b1cdcf4c0937c20daac99d07b1d96b2c739))


- **(es/codegen)** Support `sourceMap.url` option of `terser` ([#10346](https://github.com/swc-project/swc/issues/10346)) ([566bc7c](https://github.com/swc-project/swc/commit/566bc7c06e66805c2c03f8284016711029539111))


- **(plugin/runner)** Support `pluginEnvVars` ([#10318](https://github.com/swc-project/swc/issues/10318)) ([795fedc](https://github.com/swc-project/swc/commit/795fedc6aec7f3dac7be0dd4a3237fe27d05dc7f))

### Miscellaneous Tasks



- **(es/helpers)** Update peer dependency version for `@swc/helpers` to `>=0.5.17` ([#10321](https://github.com/swc-project/swc/issues/10321)) ([ddbf3e1](https://github.com/swc-project/swc/commit/ddbf3e1d8c3f81f86593c09d1ec260fd1c44a647))


- **(ide)** Disable RA diagnostics ([#10324](https://github.com/swc-project/swc/issues/10324)) ([fcf280f](https://github.com/swc-project/swc/commit/fcf280fc62a9df6b041ae294abf4566b5307df9e))

### Performance



- **(es/ast)** Reduce redundant string comparison for `Atom`s ([#10323](https://github.com/swc-project/swc/issues/10323)) ([3ce9d81](https://github.com/swc-project/swc/commit/3ce9d8119ea0a053eb27b8c40cd760679bbada64))


- **(es/jsx)** Cache FileName for JSX pass ([#9951](https://github.com/swc-project/swc/issues/9951)) ([#10322](https://github.com/swc-project/swc/issues/10322)) ([9852940](https://github.com/swc-project/swc/commit/98529404bcb5f2a24c449f023fcd14a2f0128510))


- **(es/parser)** Remove redundant `is_ascii` calls ([#10334](https://github.com/swc-project/swc/issues/10334)) ([e66b4d6](https://github.com/swc-project/swc/commit/e66b4d660c36a491f06e8d79f6d49a815dadebdc))

## [swc_core@v21.0.1] - 2025-04-07

### Features



- **(ts/isolated-dts)** Distinguish js value and ts type ([#10316](https://github.com/swc-project/swc/issues/10316)) ([c480604](https://github.com/swc-project/swc/commit/c480604da533f0c2738160efe31d914355f53601))

## [swc_core@v20.0.0] - 2025-04-04

### Bug Fixes



- **(errors)** Disable wrapping of text lines ([#10314](https://github.com/swc-project/swc/issues/10314)) ([f6840ea](https://github.com/swc-project/swc/commit/f6840ea41411adcc46cfb7570ad800d479f2014d))


- **(es/codegen)** Ensure proper Unicode escape handling for ES5 and below #10028 ([#10309](https://github.com/swc-project/swc/issues/10309)) ([7f76fa3](https://github.com/swc-project/swc/commit/7f76fa37050cfa46503333243cf2d9bd6e9dfd47))

### Features



- **(es/minifier)** Remove useless to number ([#10308](https://github.com/swc-project/swc/issues/10308)) ([898f170](https://github.com/swc-project/swc/commit/898f17057af46dbc9a10d9e94c638db764733278))

<!-- generated by git-cliff -->
