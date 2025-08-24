# Changelog
## [unreleased]

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



- **(bindings/node)** Fix build on platforms without plugin ([#10301](https://github.com/swc-project/swc/issues/10301)) ([3faae55](https://github.com/swc-project/swc/commit/3faae55a170664ff6d22824fe8dcb8cf1a110bec))


- **(errors)** Disable wrapping of text lines ([#10314](https://github.com/swc-project/swc/issues/10314)) ([f6840ea](https://github.com/swc-project/swc/commit/f6840ea41411adcc46cfb7570ad800d479f2014d))


- **(es/codegen)** Ensure proper Unicode escape handling for ES5 and below #10028 ([#10309](https://github.com/swc-project/swc/issues/10309)) ([7f76fa3](https://github.com/swc-project/swc/commit/7f76fa37050cfa46503333243cf2d9bd6e9dfd47))


- **(node)** Fix `worker_threads` issue on glibc platform ([#10306](https://github.com/swc-project/swc/issues/10306)) ([1d1ff9e](https://github.com/swc-project/swc/commit/1d1ff9edcc6376b94f95c2f421c8708d12388b8a))

### Features



- **(es/minifier)** Optimize number to int ([#10294](https://github.com/swc-project/swc/issues/10294)) ([6dcfa70](https://github.com/swc-project/swc/commit/6dcfa703ef3cd87c76bdf25eb63446cfe8a161b5))


- **(es/minifier)** Remove useless to number ([#10308](https://github.com/swc-project/swc/issues/10308)) ([898f170](https://github.com/swc-project/swc/commit/898f17057af46dbc9a10d9e94c638db764733278))


- **(ts/fast-strip)** Improve error message format ([#10298](https://github.com/swc-project/swc/issues/10298)) ([29c4afb](https://github.com/swc-project/swc/commit/29c4afb534d582f7411a2fa6be4f1416c517e83f))

### Miscellaneous Tasks



- **(deps)** Update actions ([#10222](https://github.com/swc-project/swc/issues/10222)) ([cf33196](https://github.com/swc-project/swc/commit/cf33196160fdcd004e188c33f8f665a4c81263f2))


- **(html)** Fix typing ([3ed8a7a](https://github.com/swc-project/swc/commit/3ed8a7a42f2973bdb0f626f0193d550a2bd790c5))

### Refactor



- **(es/codegen)** Split `lib.rs` into multiple files ([#10304](https://github.com/swc-project/swc/issues/10304)) ([5a07a5d](https://github.com/swc-project/swc/commit/5a07a5db219a9251091d36190151101ac1b7e3fb))


- **(es/codegen)** Refactor macro to inverse order ([#10297](https://github.com/swc-project/swc/issues/10297)) ([78f907f](https://github.com/swc-project/swc/commit/78f907f5bb97de54c3c26ca24b5de3a4be7940d1))

### Testing



- **(es/minifier)** Remove duplicate test ([#10305](https://github.com/swc-project/swc/issues/10305)) ([a80dea8](https://github.com/swc-project/swc/commit/a80dea81dfa960f2922591a76c6f1b81ab8e12cd))

## [swc_core@v18.0.0] - 2025-03-31

### Bug Fixes



- **(cli)** Fix plugin target as `wasm32-wasip1` ([#10293](https://github.com/swc-project/swc/issues/10293)) ([7daf4f4](https://github.com/swc-project/swc/commit/7daf4f4b62f77f97f39eb1fbe97e947948cdb0ad))


- **(es/analysis)** Support comments ([#10299](https://github.com/swc-project/swc/issues/10299)) ([2919d16](https://github.com/swc-project/swc/commit/2919d1688a880e1fa4c6b1e6595e5aacb9167754))

### Features



- **(es)** Add Rust plugin host part for analysis API ([#10285](https://github.com/swc-project/swc/issues/10285)) ([d213a84](https://github.com/swc-project/swc/commit/d213a840e027abd49c70de712abc7bf5fc41be71))


- **(es)** Add analysis API and refactor output API ([#10288](https://github.com/swc-project/swc/issues/10288)) ([a53c60d](https://github.com/swc-project/swc/commit/a53c60db18bd90539f3449348cbb166f32f46223))


- **(es/minifier)** Merge expression with empty return ([#10283](https://github.com/swc-project/swc/issues/10283)) ([c276a38](https://github.com/swc-project/swc/commit/c276a3876a47c973886568eaaa42dc3afe7b0c0a))


- **(es/minifier)** Optimize code generated by optional chaining ([#10292](https://github.com/swc-project/swc/issues/10292)) ([0d88041](https://github.com/swc-project/swc/commit/0d880412dfeeef25fd1978e3c05b8f7e23bd780d))


- **(es/minifier)** Support `reduce_escaped_newline` ([#10232](https://github.com/swc-project/swc/issues/10232)) ([64fb286](https://github.com/swc-project/swc/commit/64fb2864b11e5e615b6201dc70ece082fa975742))

## [swc_core@v17.0.0] - 2025-03-29

### Bug Fixes



- **(deps)** Update cargo (patch) ([#10081](https://github.com/swc-project/swc/issues/10081)) ([e0ff00e](https://github.com/swc-project/swc/commit/e0ff00ecb347a7a907e17162b095eb32d9c602a6))


- **(es)** Do not reuse `Compiler` for `minify()` and `transform()` ([#10273](https://github.com/swc-project/swc/issues/10273)) ([63bd8a1](https://github.com/swc-project/swc/commit/63bd8a10a9e90bb021d8425cd0563e2f0cd200a0))


- **(es/bugfix)** Do not rename in non-ident-function ([#10274](https://github.com/swc-project/swc/issues/10274)) ([48b6bdb](https://github.com/swc-project/swc/commit/48b6bdb6398cfd5f18e8a7d1313f8e794179446b))


- **(es/minifier)** Remove unnecessary check when invoke IIFE ([#10257](https://github.com/swc-project/swc/issues/10257)) ([6b75775](https://github.com/swc-project/swc/commit/6b75775dbf18a67a28f3d63a1035ff83613b74c8))


- **(es/parser)** Parser a program as a module with TLA in non-expression statement ([#10287](https://github.com/swc-project/swc/issues/10287)) ([157c52a](https://github.com/swc-project/swc/commit/157c52aaa7ae2c5fbd30afd537c2b5c681d85508))


- **(html)** Remove `async` from `minifyFragmentSync` ([#10289](https://github.com/swc-project/swc/issues/10289)) ([7028457](https://github.com/swc-project/swc/commit/702845784361953050ce06450a05c6ef2a598311))

### Documentation



- **(es/types)** Document `outFileExtension` ([#10265](https://github.com/swc-project/swc/issues/10265)) ([99018c5](https://github.com/swc-project/swc/commit/99018c53ad0394a1b775b4a4265b301306394a8c))


- Add star history to `README.md` ([b51eea9](https://github.com/swc-project/swc/commit/b51eea9f48a943fb8c0fb457f4961e1178c203bc))

### Features



- **(es/minifier)** Allow disabling char frequency analysis ([#10259](https://github.com/swc-project/swc/issues/10259)) ([50c62d1](https://github.com/swc-project/swc/commit/50c62d1ca20da77fe47e9af1b484c09ca180a830))


- Add parallel iterators ([#10075](https://github.com/swc-project/swc/issues/10075)) ([3b775bf](https://github.com/swc-project/swc/commit/3b775bf38dd76fabf2fc5fdb21a4431e959d02f3))

### Performance



- **(es/minifier)** Adjust parallelism threshold ([#10260](https://github.com/swc-project/swc/issues/10260)) ([28cc6f6](https://github.com/swc-project/swc/commit/28cc6f647dfead420600cd585530783f2961313c))


- **(es/minifier)** Process `cons` and `alt` of `IfStmt` in parallel ([#10262](https://github.com/swc-project/swc/issues/10262)) ([ccb6eb8](https://github.com/swc-project/swc/commit/ccb6eb8f043db57c47dabfeb77e78da26e52ae24))


- **(es/minifier)** Move logic to the pure minifier ([#10264](https://github.com/swc-project/swc/issues/10264)) ([7ecd807](https://github.com/swc-project/swc/commit/7ecd807c97513fbff4461bfcbe3207c3dfaba932))


- **(es/minifier)** Use `swc_par_iter` instead of `rayon` ([#10267](https://github.com/swc-project/swc/issues/10267)) ([78e37a1](https://github.com/swc-project/swc/commit/78e37a1eff64253a8f63885529f5c520be0ea224))

### Refactor



- Extract `par-core` and `par-iter` ([#10269](https://github.com/swc-project/swc/issues/10269)) ([0c63bda](https://github.com/swc-project/swc/commit/0c63bda61d26e9e9a34608795955493b5fa36d86))


- Drop `swc_fast_graph` ([#10268](https://github.com/swc-project/swc/issues/10268)) ([b23c8cb](https://github.com/swc-project/swc/commit/b23c8cb1385da356ac03398e5457a29b36e1c209))

### Testing



- **(es/minifier)** Update the terser passing test list ([#10263](https://github.com/swc-project/swc/issues/10263)) ([1d91571](https://github.com/swc-project/swc/commit/1d91571d7cf21fcf2685f62e81c2236b00507276))

## [swc_core@v16.10.0] - 2025-03-24

### Features



- **(es/minifier)** Merge alt's cons with cons ([#10256](https://github.com/swc-project/swc/issues/10256)) ([589bcd7](https://github.com/swc-project/swc/commit/589bcd70c4c3ad9f66ba2bbf5e4c46b82a5ddb68))


- **(swc_core)** Expose features of `swc_parallel` ([#10258](https://github.com/swc-project/swc/issues/10258)) ([042f19f](https://github.com/swc-project/swc/commit/042f19ff66e56a28a8a7616049744498c1349bfb))


- **(ts/fast-strip)** Remove line numbers ([#10254](https://github.com/swc-project/swc/issues/10254)) ([40e216d](https://github.com/swc-project/swc/commit/40e216db82225a1b6cbd9bf2925a4fe7aab2c98e))

### Performance



- **(es/minifier)** Merge `expr_simplifier` into pure optimizer ([#10202](https://github.com/swc-project/swc/issues/10202)) ([9c9b0ba](https://github.com/swc-project/swc/commit/9c9b0baaacf36083709dac2d18ba4db9482c70ed))

## [swc_core@v16.9.1] - 2025-03-23

### Bug Fixes



- **(es/parser)** Fix span of wrong `await` tokens ([#10252](https://github.com/swc-project/swc/issues/10252)) ([5c28dc3](https://github.com/swc-project/swc/commit/5c28dc39646a449a9d0a92f560427ee75e1b0644))

### Documentation



- **(es)** Improve documentation ([#10247](https://github.com/swc-project/swc/issues/10247)) ([549e38d](https://github.com/swc-project/swc/commit/549e38db9e13135c5318fdef76635eeb82a21c11))

### Features



- **(ts/fast-strip)** Add start/end span information ([#10251](https://github.com/swc-project/swc/issues/10251)) ([ab39a62](https://github.com/swc-project/swc/commit/ab39a62528ee852acc5eb089c305ff93aa5d1bea))


- **(ts/fast-strip)** Improve error message snippet ([#10253](https://github.com/swc-project/swc/issues/10253)) ([f4f426c](https://github.com/swc-project/swc/commit/f4f426c9c95d4eda5433e1da123f9b93bc1cb408))

## [swc_core@v16.9.0] - 2025-03-20

### Bug Fixes



- **(es/minifier)** Fix access to `GLOBALS` in char freq compute ([#10239](https://github.com/swc-project/swc/issues/10239)) ([6286663](https://github.com/swc-project/swc/commit/628666386877067c96c32f50b55cda80acde979e))

## [swc_core@v16.8.0] - 2025-03-20

### Bug Fixes



- **(es/minifier)** Make `inline_globals` noop by default ([#10231](https://github.com/swc-project/swc/issues/10231)) ([b192dc8](https://github.com/swc-project/swc/commit/b192dc82e6a84bd30f159fb12ca8a216f41e8efb))


- **(es/types)** Fix broken types ([#10224](https://github.com/swc-project/swc/issues/10224)) ([540bdf8](https://github.com/swc-project/swc/commit/540bdf868d888a017e90c9badf8bab49e9b485bb))

### Features



- **(es/fast-lexer)** Enhance identifier handling with Unicode support ([#10226](https://github.com/swc-project/swc/issues/10226)) ([482b63a](https://github.com/swc-project/swc/commit/482b63a905ddcc49a0cbf0b5a84f93ca7d2a42df))


- **(es/minifier)** Invoke IIFE into block ([#10220](https://github.com/swc-project/swc/issues/10220)) ([c9a6c23](https://github.com/swc-project/swc/commit/c9a6c2378737828becd9b6a87c2fb3b93d9c0acb))


- **(es/minifier)** Remove needless blocks ([#10234](https://github.com/swc-project/swc/issues/10234)) ([0817970](https://github.com/swc-project/swc/commit/08179702bfb1172d5764d8c5326bd00f4e04ba61))


- **(swc_parallel)** Introduce `rayon` mode ([#10237](https://github.com/swc-project/swc/issues/10237)) ([3c2213c](https://github.com/swc-project/swc/commit/3c2213c8299e889fb99ace0a53cf0b2152976bae))

### Performance



- **(es/minifier)** Merge `dead_branch_remover` into pure optimizer ([#10201](https://github.com/swc-project/swc/issues/10201)) ([6841523](https://github.com/swc-project/swc/commit/6841523977d072f3bed361fbb7a47910b41bbcd9))

## [swc_core@v16.7.0] - 2025-03-17

### Features



- **(es/minifier)** Default to the smallest size ([#10218](https://github.com/swc-project/swc/issues/10218)) ([800f51a](https://github.com/swc-project/swc/commit/800f51aae55be0025f8ae494b1ced7579f6f17de))

## [swc_core@v16.6.2] - 2025-03-17

### Bug Fixes



- **(es/minifier)** Allow TypeScript nodes to fix `styled-jsx` ([#10221](https://github.com/swc-project/swc/issues/10221)) ([9d87d4d](https://github.com/swc-project/swc/commit/9d87d4d8e4d14fd1d58a8bc04a61823367435605))

## [swc_core@v16.6.1] - 2025-03-17

### Bug Fixes



- **(es/ast)** Fix Typo in API ([#10210](https://github.com/swc-project/swc/issues/10210)) ([8eb87ba](https://github.com/swc-project/swc/commit/8eb87ba89698f5d8ce2ade37737ae3e285f1235c))


- **(es/minifier)** Do not drop numbers incorrectly ([#10211](https://github.com/swc-project/swc/issues/10211)) ([80ccd86](https://github.com/swc-project/swc/commit/80ccd861a280c133f48e6fe01e80814da8f03cc4))


- **(es/types)** Add missing types for `jsc.transform.react.refresh` ([#10206](https://github.com/swc-project/swc/issues/10206)) ([e71b000](https://github.com/swc-project/swc/commit/e71b000392a01ecb5a35ec8f0faac9cd79ff2cd1))

### Miscellaneous Tasks



- **(es/minifier)** Make `test.sh` faster ([#10209](https://github.com/swc-project/swc/issues/10209)) ([f28d96e](https://github.com/swc-project/swc/commit/f28d96e356d07d9d2bdb68815a0736b380b53e93))

### Refactor



- **(es/minifier)** Move some deps to dev deps ([#10216](https://github.com/swc-project/swc/issues/10216)) ([1dcdbbc](https://github.com/swc-project/swc/commit/1dcdbbc78d64f6eb52f320f50b3928e9f185bf6f))

### Testing



- **(es/minifier)** Disable real-world benchmarks on CI ([#10205](https://github.com/swc-project/swc/issues/10205)) ([c5f1cbe](https://github.com/swc-project/swc/commit/c5f1cbe46762b9b9fa1cc27495675ae32e30c9ed))


- **(es/minifier)** Test only sizes for large inputs ([#10208](https://github.com/swc-project/swc/issues/10208)) ([bec3e3e](https://github.com/swc-project/swc/commit/bec3e3e960a7afe2f82b389bb8d9b0162d69e2b6))


- **(es/minifier)** Add full tests back ([#10212](https://github.com/swc-project/swc/issues/10212)) ([e6c04b4](https://github.com/swc-project/swc/commit/e6c04b4f58ee6d7a7fca6bace5fa1ec959551873))


- **(es/minifier)** Remove `full` tests with too large input ([#10213](https://github.com/swc-project/swc/issues/10213)) ([99b590f](https://github.com/swc-project/swc/commit/99b590f869f950373bc784e9080a5321a5e96d1c))

## [swc_core@v16.6.0] - 2025-03-15

### Bug Fixes



- **(es/proposal)** Fix declarations for `explicit-resource-management` ([#10198](https://github.com/swc-project/swc/issues/10198)) ([99ba555](https://github.com/swc-project/swc/commit/99ba555c810a89ceae899cf612f8ee17925f5581))


- **(typescript)** Skip the body of ArrowExpr in type usage analysis  ([#10187](https://github.com/swc-project/swc/issues/10187)) ([9aca205](https://github.com/swc-project/swc/commit/9aca205c770988d6483dad372028fd1928e3f5b0))

### Documentation



- **(es/minifier)** Make `minifier` example utilize comments ([#10195](https://github.com/swc-project/swc/issues/10195)) ([ec3ebe7](https://github.com/swc-project/swc/commit/ec3ebe78fff5bce29ec780e45427ede56576d7c4))

### Features



- **(es/fast-parser)** Implement the initial version ([#10185](https://github.com/swc-project/swc/issues/10185)) ([44e7c39](https://github.com/swc-project/swc/commit/44e7c39fda5d0a7cbdf9dbc3a8d9c85a24a22251))


- **(ts/fast-strip)** Throw js object instead of map ([#10186](https://github.com/swc-project/swc/issues/10186)) ([2da0142](https://github.com/swc-project/swc/commit/2da0142217842bf85d84645beeafc7f706215469))

### Miscellaneous Tasks



- **(es/minifier)** Fix lints & `size.sh` ([#10191](https://github.com/swc-project/swc/issues/10191)) ([e862c32](https://github.com/swc-project/swc/commit/e862c329fc9af61414b664e81030976bde313983))

### Performance



- **(es/minifier)** Do not repeat applying pure minifier on last ([#10196](https://github.com/swc-project/swc/issues/10196)) ([e6b7cee](https://github.com/swc-project/swc/commit/e6b7cee6cd0b4c9401981dcc9d40d758be94814b))

### Refactor



- **(es/minifier)** Remove code for infinite loop ([#10194](https://github.com/swc-project/swc/issues/10194)) ([fcc6884](https://github.com/swc-project/swc/commit/fcc68842422c0a46eee4d47956e77a727f202998))

### Testing



- **(es/minifier)** Update test inputs ([#10193](https://github.com/swc-project/swc/issues/10193)) ([97d8337](https://github.com/swc-project/swc/commit/97d83372dcc63cc68451a2a86672f8748c751600))


- **(es/minifier)** Add a benchmark for real-world inputs ([#10204](https://github.com/swc-project/swc/issues/10204)) ([97f2180](https://github.com/swc-project/swc/commit/97f2180e86323fd530bed5a274a0e50abaf81237))

## [swc_core@v16.5.0] - 2025-03-12

### Bug Fixes



- **(es/compat)** Hoist `arguments` in object method while lowering async functions ([#10167](https://github.com/swc-project/swc/issues/10167)) ([e764df2](https://github.com/swc-project/swc/commit/e764df24807d667e581fdc3e1018ab7491104195))


- **(es/minifier)** Check array inline for indexed with dynamic key ([#10184](https://github.com/swc-project/swc/issues/10184)) ([c2fe4bf](https://github.com/swc-project/swc/commit/c2fe4bf2d34033959070c922ce1c2d46a79de62c))

### Features



- **(es/module)** Support more `import.meta` properties ([#10179](https://github.com/swc-project/swc/issues/10179)) ([11727a6](https://github.com/swc-project/swc/commit/11727a62e4a615039d11d8cc250d53f128e40eff))

### Performance



- **(es/fast-lexer)** Optimize `read_identifier` ([#10170](https://github.com/swc-project/swc/issues/10170)) ([d97f7b2](https://github.com/swc-project/swc/commit/d97f7b233ff88405710cb3281178fd8e035c40ab))


- **(es/fast-lexer)** Use `memchr` for `skip_line_comments` ([#10173](https://github.com/swc-project/swc/issues/10173)) ([35194e3](https://github.com/swc-project/swc/commit/35194e30086de55a52ebad32474b6c571cdd0b9f))


- **(es/fast-lexer)** Use SIMD properly for string literals ([#10172](https://github.com/swc-project/swc/issues/10172)) ([be60338](https://github.com/swc-project/swc/commit/be60338267eb27c0b96c52fb32ddbf8699d4fe91))


- **(es/fast-lexer)** Add length-based fast path for keywords ([#10176](https://github.com/swc-project/swc/issues/10176)) ([1f70af8](https://github.com/swc-project/swc/commit/1f70af842e3d09614c8187685e2fc503ac1f272a))


- **(es/fast-lexer)** Optimize memory layout of cursor ([#10175](https://github.com/swc-project/swc/issues/10175)) ([aa20494](https://github.com/swc-project/swc/commit/aa204949827e7ef0cb83ab1c0ae589270fc1fd2d))


- **(es/fast-lexer)** Remove bound checks ([#10174](https://github.com/swc-project/swc/issues/10174)) ([bccdafc](https://github.com/swc-project/swc/commit/bccdafc0c394bf3979da3c6a06d974c7d2c9bcee))


- **(es/fast-lexer)** Replace PHF with static keyword lookup table ([#10181](https://github.com/swc-project/swc/issues/10181)) ([56d065e](https://github.com/swc-project/swc/commit/56d065ebcbcddd18cc9ea9406fd0de1e716318fc))


- **(es/fast-lexer)** Optimize SIMD vector initialization with initialing `u8x16` once. ([#10183](https://github.com/swc-project/swc/issues/10183)) ([435197c](https://github.com/swc-project/swc/commit/435197cc84f10095063bbc983969449653e1fc90))

## [swc_core@v16.4.1] - 2025-03-07

### Bug Fixes



- **(es/fast-lexer)** Fix lexing of numeric literals ([#10153](https://github.com/swc-project/swc/issues/10153)) ([65d23fe](https://github.com/swc-project/swc/commit/65d23febaaa6334c9e9477a3d5af82ebea66259b))


- **(es/parser)** Rescan `<<` in new expression ([#10159](https://github.com/swc-project/swc/issues/10159)) ([35bd6d9](https://github.com/swc-project/swc/commit/35bd6d9e1c0bcb1e1fd58fe086b68a9b7c40a596))

### Features



- **(ts/fast-strip)** Throw an object instead of string ([#10162](https://github.com/swc-project/swc/issues/10162)) ([241b881](https://github.com/swc-project/swc/commit/241b8810ab551072c22cec077f9aa3155dbaec6f))

### Performance



- **(es/fast-lexer)** Optimize lexing of keywords ([#10155](https://github.com/swc-project/swc/issues/10155)) ([fb610b0](https://github.com/swc-project/swc/commit/fb610b096f4b5a8661b1e35e63b6ae327d4725ed))


- **(es/fast-lexer)** Optimize bound checks ([#10157](https://github.com/swc-project/swc/issues/10157)) ([d74360e](https://github.com/swc-project/swc/commit/d74360ed26fb7bdad448523e1ffa64d59aa11673))


- **(es/fast-lexer)** Make whitespace skipper use SIMD properly ([#10158](https://github.com/swc-project/swc/issues/10158)) ([15ea059](https://github.com/swc-project/swc/commit/15ea059712f6726d52b6304870f337a93272bb53))


- **(es/lexer)** Optimize whitespace scanning ([#10136](https://github.com/swc-project/swc/issues/10136)) ([8a59753](https://github.com/swc-project/swc/commit/8a59753429538c62490dde54c56a964b6faa50ec))


- **(es/lexer)** Optimize comment scanning ([#10137](https://github.com/swc-project/swc/issues/10137)) ([9676c9a](https://github.com/swc-project/swc/commit/9676c9acc83cca4297f07abdc203f0ab8da36b2b))

### Refactor



- **(es/lexer)** Add fast lexer implementation ([#10145](https://github.com/swc-project/swc/issues/10145)) ([b993f86](https://github.com/swc-project/swc/commit/b993f8621c41ff4752d8634e9de7ed7a48f23eb9))


- Drop unused crates ([#10151](https://github.com/swc-project/swc/issues/10151)) ([58e4279](https://github.com/swc-project/swc/commit/58e4279fae94a9958ad4229cfa0c9b89b9d0fde4))


- Drop unused js interop bindings ([#10161](https://github.com/swc-project/swc/issues/10161)) ([0ceefaf](https://github.com/swc-project/swc/commit/0ceefafbf3485ddfc831913114a7978e06c9ce5c))

### Ci



- Add swc_plugins test to ecosystem CI ([#10164](https://github.com/swc-project/swc/issues/10164)) ([b23d133](https://github.com/swc-project/swc/commit/b23d133959687161726bd6d08d101e5f57a6f8d9))

## [swc_core@v16.4.0] - 2025-03-04

### Features



- **(ts/fast-strip)** Emit json errors ([#10144](https://github.com/swc-project/swc/issues/10144)) ([740bd57](https://github.com/swc-project/swc/commit/740bd579ae8d081604be606fd69e92298a5d6862))

## [swc_core@v16.3.1] - 2025-03-04

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



- Add (experimental) `js-interop` npm package ([#9975](https://github.com/swc-project/swc/issues/9975)) ([eebb0ea](https://github.com/swc-project/swc/commit/eebb0ea14fa2061fd721992c0fc31734fe9d1e42))

<!-- generated by git-cliff -->
