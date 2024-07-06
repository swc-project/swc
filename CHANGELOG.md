# Changelog
## [unreleased]

### Bug Fixes



- **(es/testing)** Fix `PluginCommentProxy` ([#9170](https://github.com/swc-project/swc/issues/9170)) ([d86ca2d](https://github.com/swc-project/swc/commit/d86ca2d49ec72614ec8c2493a28f27267e6f8b8f))

### Features



- **(es/typescript)** Improve fast TS strip ([#9166](https://github.com/swc-project/swc/issues/9166)) ([ee8dc28](https://github.com/swc-project/swc/commit/ee8dc28d4d5399b1996bc0eba066270a582d04b6))

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

## [1.5.1] - 2024-04-27

### Bug Fixes



- **(es/decorator)** Support for legacy decorators in class expressions ([#8892](https://github.com/swc-project/swc/issues/8892)) ([8fe57ad](https://github.com/swc-project/swc/commit/8fe57adc02f1a67ece9b73769d90320ae4e72808))


- **(es/helpers)** Remove unused export from `_using_ctx.js` ([#8891](https://github.com/swc-project/swc/issues/8891)) ([438d0b3](https://github.com/swc-project/swc/commit/438d0b32b680a1a64861e97cb4a1e14213335e48))


- **(es/minifier)** Do not add vars if `eval` exists ([#8888](https://github.com/swc-project/swc/issues/8888)) ([be359fa](https://github.com/swc-project/swc/commit/be359fa75318d645f954feb90353b884dfa51e6e))

## [1.5.0] - 2024-04-24

### Bug Fixes



- **(es/minifier)** Abort seq inline on recursive usage ([#8887](https://github.com/swc-project/swc/issues/8887)) ([cd4548f](https://github.com/swc-project/swc/commit/cd4548fd8c32f67d0e8373f7a2c3cb625f43e6c4))

### Features



- **(es/ast)** Support abstract auto-accessors ([#8736](https://github.com/swc-project/swc/issues/8736)) ([1155ac7](https://github.com/swc-project/swc/commit/1155ac79720512625568c45bfd3542ec340c0ebd))

## [1.4.17] - 2024-04-23

### Bug Fixes



- **(es)** Ignore `sourceMappingURL` in string literals ([#8879](https://github.com/swc-project/swc/issues/8879)) ([d7188cd](https://github.com/swc-project/swc/commit/d7188cdb66a3bba577ebefe0c33cf77f48858d50))


- **(es/codegen)** Use `Str.raw` for es5 ([#8873](https://github.com/swc-project/swc/issues/8873)) ([c7a06b1](https://github.com/swc-project/swc/commit/c7a06b1a5e3a59abccbd40fed1f65fcf8487fba6))


- **(es/compat)** Fix async generator ([#8881](https://github.com/swc-project/swc/issues/8881)) ([063eabd](https://github.com/swc-project/swc/commit/063eabd33cd5ee1dbe9e248462519f76f6eacd36))


- **(es/resolver)** Prioritze `jsc.paths` by length in tsc resolver ([#8875](https://github.com/swc-project/swc/issues/8875)) ([e22c368](https://github.com/swc-project/swc/commit/e22c3681a6705f2184f0af7032ed30103ab9bfcc))


- **(html/codegen)** Expand elements before which body isn’t elided ([#8877](https://github.com/swc-project/swc/issues/8877)) ([5419a94](https://github.com/swc-project/swc/commit/5419a9477fa54297ed5e02b3769374e07e0921f3))

## [1.4.16] - 2024-04-18

### Bug Fixes



- **(es/helpers)** Fix resolving of `usingCtx` helper ([#8874](https://github.com/swc-project/swc/issues/8874)) ([6e9d1a4](https://github.com/swc-project/swc/commit/6e9d1a4ebfa705d58b576f5de32d4a17393d4e81))

## [1.4.15] - 2024-04-17

### Bug Fixes



- **(es/codegen)** Fix `ascii_only` for identifiers ([#8866](https://github.com/swc-project/swc/issues/8866)) ([2075a23](https://github.com/swc-project/swc/commit/2075a23373eac575240ab33778079174505cdcb4))


- **(es/minifier)** Remove `raw` of strings after modification ([#8865](https://github.com/swc-project/swc/issues/8865)) ([740c0bb](https://github.com/swc-project/swc/commit/740c0bb00a0bb9e0f4d808c9dc71e8087d416f72))


- **(es/parser)** Fix span of `BindingIdent` ([#8859](https://github.com/swc-project/swc/issues/8859)) ([fbd32fb](https://github.com/swc-project/swc/commit/fbd32fbff323ff4116e82d2dd1d763f7f3844de2))


- **(es/proposal)** Update explicit resource management to match spec ([#8860](https://github.com/swc-project/swc/issues/8860)) ([6d24076](https://github.com/swc-project/swc/commit/6d240768b11cd6cabd347a54c135cb8937df2240))

### Features



- **(es/transforms)** Allocate stacks dynamically ([#8867](https://github.com/swc-project/swc/issues/8867)) ([a1c5415](https://github.com/swc-project/swc/commit/a1c5415b3b84fdb8f780685e5eec4a121d442e28))

### Refactor



- **(es/minifier)** Remove `mangle.safari10` ([#8857](https://github.com/swc-project/swc/issues/8857)) ([df2e056](https://github.com/swc-project/swc/commit/df2e056f299c84d309bcc0d26e1da55a561614af))

### Build



- **(cargo)** Update rustc to `nightly-2024-04-03` ([#8821](https://github.com/swc-project/swc/issues/8821)) ([ca9c76b](https://github.com/swc-project/swc/commit/ca9c76b46f26f0aaf6b7f18cb7b4c6fdb7ebd512))


- **(cargo)** Update `rustc` to `nightly-2024-04-16` ([#8870](https://github.com/swc-project/swc/issues/8870)) ([f9459a8](https://github.com/swc-project/swc/commit/f9459a8adf28de02d44dfe1da243a1d66a6ec41e))

## [1.4.14] - 2024-04-15

### Bug Fixes



- **(es/compat)** Handle class fields correctly ([#8835](https://github.com/swc-project/swc/issues/8835)) ([5cc585b](https://github.com/swc-project/swc/commit/5cc585b8f3359d960420e31a91f53c761c90f3f5))


- **(es/helpers)** Add missing helpers ([#8843](https://github.com/swc-project/swc/issues/8843)) ([67bfcf4](https://github.com/swc-project/swc/commit/67bfcf41f59699ebb5286211fcc2cf5546f94376))


- **(es/minifier)** Handle switch cases ([#8854](https://github.com/swc-project/swc/issues/8854)) ([7a89e5d](https://github.com/swc-project/swc/commit/7a89e5da3be25d00e5cc18b46c847f0e8de54022))


- **(es/plugin)** Create `tokio` runtime only if necessary ([#8845](https://github.com/swc-project/swc/issues/8845)) ([62c4f5e](https://github.com/swc-project/swc/commit/62c4f5efb84daa5f9e7f88bbbfddd7823bb1355d))


- **(es/resolver)** Correctly check strict mode ([#8851](https://github.com/swc-project/swc/issues/8851)) ([f6ba92b](https://github.com/swc-project/swc/commit/f6ba92b033c3594c69672a33df124ecf6429f450))


- **(es/utils)** Preserve optional chain effect ([#8850](https://github.com/swc-project/swc/issues/8850)) ([a7a32c4](https://github.com/swc-project/swc/commit/a7a32c4b6c2089dfbe9be2f70a0c4712e9feeef4))

### Documentation



- **(swc_core)** Resolve build issue with `--all-features` flag ([#8848](https://github.com/swc-project/swc/issues/8848)) ([c0d901e](https://github.com/swc-project/swc/commit/c0d901eac6539940ce1956ec5031f624c4c049f0))

### Refactor



- **(es)** Make the code compile with `miri` ([#8836](https://github.com/swc-project/swc/issues/8836)) ([3a51140](https://github.com/swc-project/swc/commit/3a51140dd77ccf2cc35098a72c411b05de418ff1))


- **(es/decorator)** Remove unsafe code ([#8839](https://github.com/swc-project/swc/issues/8839)) ([e8c6344](https://github.com/swc-project/swc/commit/e8c63447f64076de64002bcb5a3124b809df44ed))


- **(visit)** Simplify `Vec::move_map` ([#8838](https://github.com/swc-project/swc/issues/8838)) ([b1973d4](https://github.com/swc-project/swc/commit/b1973d490afc8e4bc597192caab7a3aa8eb2701d))

### Testing



- **(es)** Update `conformance` test suite from `tsc` ([#8834](https://github.com/swc-project/swc/issues/8834)) ([ea5d9cc](https://github.com/swc-project/swc/commit/ea5d9cc52413a1270e25af93c353baf10282fd86))

## [1.4.13] - 2024-04-09

### Bug Fixes



- **(es/decorators)** Fix capacity overflow with decorators ([#8818](https://github.com/swc-project/swc/issues/8818)) ([9ed93c1](https://github.com/swc-project/swc/commit/9ed93c17cdb645274392ebdb9ad87f8fbeeed971))


- **(es/minifier)** Respect `top_retain` for top-level functions ([#8814](https://github.com/swc-project/swc/issues/8814)) ([811308c](https://github.com/swc-project/swc/commit/811308c3526003608e61c559f43408f6065ff9ee))


- **(es/minifier)** Abort IIFE invoker in function parameters ([#8828](https://github.com/swc-project/swc/issues/8828)) ([ebb68db](https://github.com/swc-project/swc/commit/ebb68db24d7287ca12d85a68a34aabfa660eeae0))


- **(es/module)** Respect `module.resolveFully` in more cases ([#8820](https://github.com/swc-project/swc/issues/8820)) ([e1f7704](https://github.com/swc-project/swc/commit/e1f770463d1f0402468e07fca9c637e3823bb2d1))


- **(es/transforms)** Fix capacity overflow with decorators ([#8815](https://github.com/swc-project/swc/issues/8815)) ([974f5c7](https://github.com/swc-project/swc/commit/974f5c759c7736ab521d18c8e7bd88210691a2ab))


- **(plugin/runner)** Pin version of `virtual-fs` ([#8827](https://github.com/swc-project/swc/issues/8827)) ([089f61b](https://github.com/swc-project/swc/commit/089f61bc37bb9c09dc94a24a5518840883827f57))


- **(visit)** Improve `Map` implementation for `Box` ([#8819](https://github.com/swc-project/swc/issues/8819)) ([dc04657](https://github.com/swc-project/swc/commit/dc046572def13a3eb625520c5a8bfd651b86f3a3))

## [1.4.12] - 2024-04-04

### Bug Fixes



- **(common)** Fix source index for `inputSourceMap` ([#8800](https://github.com/swc-project/swc/issues/8800)) ([4f9ab81](https://github.com/swc-project/swc/commit/4f9ab8151dad9984c81c72eb10c2afe5313a7591))


- **(es)** Change default value of `inputSourceMap` to `true` ([#8801](https://github.com/swc-project/swc/issues/8801)) ([9ffcd18](https://github.com/swc-project/swc/commit/9ffcd1823c0abdc741f654b8e1e330cdc06769a1))


- **(es/bugfixes)** Fix fn transform in nameless fns ([#8796](https://github.com/swc-project/swc/issues/8796)) ([7ad004e](https://github.com/swc-project/swc/commit/7ad004e1899d98ee8da49909163455b3b622686d))


- **(es/helpers)** Fix metadata of decorators being `undefined` ([#8768](https://github.com/swc-project/swc/issues/8768)) ([263ce6e](https://github.com/swc-project/swc/commit/263ce6e22bd4dbba0323099f256fb062b8e644a2))


- **(es/minifier)** Abort fn inliner if there's a spread arg ([#8809](https://github.com/swc-project/swc/issues/8809)) ([730ded2](https://github.com/swc-project/swc/commit/730ded2a26f63f0069dea0d3bc207bb31f344444))


- **(es/module)** Fix `jsc.paths` with `resolveFully` ([#8784](https://github.com/swc-project/swc/issues/8784)) ([4961bb0](https://github.com/swc-project/swc/commit/4961bb055df9925da97279819d2fdf740b4b3d92))


- **(es/parser)** Tweak msg of `SyntaxError::UsingDeclNotEnabled` ([#8791](https://github.com/swc-project/swc/issues/8791)) ([95c822e](https://github.com/swc-project/swc/commit/95c822e7c43470e4c972bef00d97e7e0de02e0b0))

### Features



- **(es/minifier)** Evaluate spread of arrays ([#8811](https://github.com/swc-project/swc/issues/8811)) ([47714c5](https://github.com/swc-project/swc/commit/47714c52ce08b0e94617d17c11c8e8994c62dbaa))


- **(plugin/runner)** Improve error message for Wasm plugin crashes ([#8794](https://github.com/swc-project/swc/issues/8794)) ([571d297](https://github.com/swc-project/swc/commit/571d29781a90f4def4811ae46fa4a5f966e461e6))

### Miscellaneous Tasks



- **(deps)** Update dependencies ([#8810](https://github.com/swc-project/swc/issues/8810)) ([207582f](https://github.com/swc-project/swc/commit/207582ff254a66a9dd4613de6d3cb43c19957b68))


- **(es/transforms)** Add `repository` field to `swc_ecma_ext_transforms` ([#8793](https://github.com/swc-project/swc/issues/8793)) ([37f0a79](https://github.com/swc-project/swc/commit/37f0a7994bdf7d90c30a00f70c6dde97b4d89c8f))

### Performance



- **(atoms)** Update `hstr` ([#8799](https://github.com/swc-project/swc/issues/8799)) ([0745624](https://github.com/swc-project/swc/commit/0745624cb71e12b18b06d9ee106066d8b585c4c6))


- **(es/parser)** Use faster unicode crate ([#8785](https://github.com/swc-project/swc/issues/8785)) ([6f780ca](https://github.com/swc-project/swc/commit/6f780ca749a611f54aa4deb628e532fd0a12228f))

## [1.4.9] - 2024-03-26

### Bug Fixes



- **(es/minifier)** Abort eval on `valueOf` or `toString` ([#8763](https://github.com/swc-project/swc/issues/8763)) ([9f98a70](https://github.com/swc-project/swc/commit/9f98a7026df50a548011baf6d075d00bdd77a85a))


- **(es/minifier)** Fix tpl-to-string conversion ([#8778](https://github.com/swc-project/swc/issues/8778)) ([e7bca10](https://github.com/swc-project/swc/commit/e7bca101424ed3a3195ca6f45fd4993318cf105d))


- **(es/module)** Fix interop of `jsc.paths` with symlinks ([#8757](https://github.com/swc-project/swc/issues/8757)) ([e2c6db5](https://github.com/swc-project/swc/commit/e2c6db5226e9b34442ab65e02d5bbc3fa9aca65c))


- **(es/parser)** Fix parsing of TypeScript type instantiation ([#8758](https://github.com/swc-project/swc/issues/8758)) ([2d6de94](https://github.com/swc-project/swc/commit/2d6de94936bec269b6a926a1f461179a97b9ac83))


- **(es/parser)** Parse `await using` in for head ([#8775](https://github.com/swc-project/swc/issues/8775)) ([53fd09c](https://github.com/swc-project/swc/commit/53fd09cbd7f559ea65dbcbf8c77eea1fcf67b691))


- **(es/utils)** Mark `ident` of default fn/class as binding ([#8764](https://github.com/swc-project/swc/issues/8764)) ([f62097c](https://github.com/swc-project/swc/commit/f62097ca01a2ffdf852161d2fb040acd57e70081))

### Features



- **(es/lints)** Detect duplicate bindings in export defaults ([#8760](https://github.com/swc-project/swc/issues/8760)) ([c9c971a](https://github.com/swc-project/swc/commit/c9c971a79236f0e5c713f4341ea71591e979ea21))

### Miscellaneous Tasks



- **(deps)** Update `sourcemap` to `v8.0.0` ([#8771](https://github.com/swc-project/swc/issues/8771)) ([f8681c9](https://github.com/swc-project/swc/commit/f8681c9299813580849dc39240d29441b6038192))

### Refactor



- **(common)** Debug-print spans more compactly ([#8746](https://github.com/swc-project/swc/issues/8746)) ([f2300da](https://github.com/swc-project/swc/commit/f2300dadbf8de9270f0e431dff61b7905fe08caa))

### Build



- **(bindings/node)** Update `sourcemap` ([#8777](https://github.com/swc-project/swc/issues/8777)) ([2920a88](https://github.com/swc-project/swc/commit/2920a88cf772092b63a16d2913704e4e5ebed754))

## [1.4.8] - 2024-03-14

### Bug Fixes



- **(es/module)** Fix regression of resolving relative modules ([#8748](https://github.com/swc-project/swc/issues/8748)) ([f988b66](https://github.com/swc-project/swc/commit/f988b66e1fd921266a8abf6fe9bb997b6878e949))


- **(es/parser)** Allow `export` after decorators when valid ([#8739](https://github.com/swc-project/swc/issues/8739)) ([663261b](https://github.com/swc-project/swc/commit/663261be97364911e7b57eab0560ee48e53d8f33))

### Miscellaneous Tasks



- **(es)** Allow using older `tokio` ([#8740](https://github.com/swc-project/swc/issues/8740)) ([9c1eb01](https://github.com/swc-project/swc/commit/9c1eb017fcd90bd21b43f1a988c7fc67639343c1))

## [1.4.7] - 2024-03-13

### Bug Fixes



- **(es/minifier)** Fix eval of `toString` of array with holes ([#8727](https://github.com/swc-project/swc/issues/8727)) ([f3fbd9d](https://github.com/swc-project/swc/commit/f3fbd9d54925b708139a37865508430cdcb98f9a))


- **(es/minifier)** Do not evaluate `slice` calls with negative index ([#8726](https://github.com/swc-project/swc/issues/8726)) ([23f9635](https://github.com/swc-project/swc/commit/23f9635d2cb523d63e5d1611dcf55922bcc54a87))


- **(es/minifier)** Handle cyclic references while dropping unused properties ([#8725](https://github.com/swc-project/swc/issues/8725)) ([102241b](https://github.com/swc-project/swc/commit/102241b812b8e815b59575178193bb71b4264bab))


- **(es/minifier)** Fix evaluation of array literals with `void 0` ([#8733](https://github.com/swc-project/swc/issues/8733)) ([aa0154d](https://github.com/swc-project/swc/commit/aa0154d2d86b0bed7ffed3324c7a650ffe111c93))


- **(es/minifier)** Fix removal of array pattern bindings ([#8730](https://github.com/swc-project/swc/issues/8730)) ([312f0d8](https://github.com/swc-project/swc/commit/312f0d8427b3c4436b491ed4265f9469dc017f8f))


- **(es/minifier)** Make `Finalizer` handle `hoisted_props` correctly ([#8738](https://github.com/swc-project/swc/issues/8738)) ([95761b7](https://github.com/swc-project/swc/commit/95761b76bf09a4d2c09517b2bd7bf7b78ee2149f))


- **(es/proposal)** Fix var placement for using transform ([#8732](https://github.com/swc-project/swc/issues/8732)) ([633cd89](https://github.com/swc-project/swc/commit/633cd89bacef5f0efef20f1dfa709cff1ecba36f))

### Features



- **(es/lints)** Add `no-prototype-builtins` rule ([#8684](https://github.com/swc-project/swc/issues/8684)) ([a5dbb17](https://github.com/swc-project/swc/commit/a5dbb17612327c66366086f99b44c6731d125ffc))


- **(es/lints)** Add `prefer-object-spread` rule ([#8696](https://github.com/swc-project/swc/issues/8696)) ([aa9297b](https://github.com/swc-project/swc/commit/aa9297b42e001f6b7319881870f6012a56c50aef))

### Refactor



- **(es)** Prepare `wasm32-wasi-preview1-threads` target support ([#8724](https://github.com/swc-project/swc/issues/8724)) ([e3acd14](https://github.com/swc-project/swc/commit/e3acd1476c2428e5329a359bb7323687c06108d2))

## [1.4.6] - 2024-03-08

### Bug Fixes



- **(es/minifier)** Do not drop used properties ([#8703](https://github.com/swc-project/swc/issues/8703)) ([6069217](https://github.com/swc-project/swc/commit/606921700ee9fdb3747a8b54bb851e1d0df27484))

### Performance



- **(es)** Do not create tokio runtime if not required ([#8711](https://github.com/swc-project/swc/issues/8711)) ([9a1f04f](https://github.com/swc-project/swc/commit/9a1f04f4269f65df845897d2fb61449985bdd821))

## [1.4.5] - 2024-03-06

### Bug Fixes



- **(es/module)** Fix relativeness check for `jsc.paths` ([#8702](https://github.com/swc-project/swc/issues/8702)) ([d37125f](https://github.com/swc-project/swc/commit/d37125fb8ea23eb7b7fae09835c92f548fa5f0ab))

### Features



- **(es/parser)** Support Regular Expression `v` flag ([#8690](https://github.com/swc-project/swc/issues/8690)) ([4ce39eb](https://github.com/swc-project/swc/commit/4ce39ebf32d79982a31458b7b70d9fecde40cd35))

## [1.4.3] - 2024-03-05

### Bug Fixes



- **(css/parser)** Fix parsing of `@import` without `;` or space ([#8657](https://github.com/swc-project/swc/issues/8657)) ([60b2340](https://github.com/swc-project/swc/commit/60b234077e26c2d319225ced2735e6d549c4557e))


- **(es/codegen)** Emit computed getter and setter signatures ([#8656](https://github.com/swc-project/swc/issues/8656)) ([66bf8e9](https://github.com/swc-project/swc/commit/66bf8e907d09349d847a99036747edb724c4a20a))


- **(es/codegen)** Fix replacement when `inline_script` is on ([#8659](https://github.com/swc-project/swc/issues/8659)) ([e179134](https://github.com/swc-project/swc/commit/e1791340cd35e5465ff3f6b71ac596a138173d04))


- **(es/codegen)** Emit `namespace` keyword of `TsModuleDecl` if possible ([#8676](https://github.com/swc-project/swc/issues/8676)) ([64c9b8f](https://github.com/swc-project/swc/commit/64c9b8f4f1115dc7fbda673b855eaa1605792b25))


- **(es/compat)** Split declaration and init in `block-scoping` pass ([#8648](https://github.com/swc-project/swc/issues/8648)) ([6fe6810](https://github.com/swc-project/swc/commit/6fe6810c492ca20ad73d1536e328ddb804533537))


- **(es/decorators)** Handle default exported class ([#8691](https://github.com/swc-project/swc/issues/8691)) ([570483a](https://github.com/swc-project/swc/commit/570483ae48c532d6aa169d38bddca5b767ead8f3))


- **(es/module)** Allow `FileName::Anon` from node resolver ([#8686](https://github.com/swc-project/swc/issues/8686)) ([761365e](https://github.com/swc-project/swc/commit/761365eb56254005ddbbfc8079cf1376e5edbd32))


- **(es/modules)** Do not call `Path::parent()` for `FileName::Anon` ([#8662](https://github.com/swc-project/swc/issues/8662)) ([1bc4cb7](https://github.com/swc-project/swc/commit/1bc4cb7c0548483980e27483022d6abf0888891d))


- **(es/modules)** Fix resolution of `jsc.paths` with exact match ([#8685](https://github.com/swc-project/swc/issues/8685)) ([08ed0fb](https://github.com/swc-project/swc/commit/08ed0fb6663e835bf9efe8270118ce49ccd53903))


- **(es/parser)** Check for existence of modifiers while parsing `accessor` token ([#8649](https://github.com/swc-project/swc/issues/8649)) ([ca23a33](https://github.com/swc-project/swc/commit/ca23a3353cefb0064ab28d10ea86634be5a0c191))


- **(es/typescript)** Handle accessibility in private method ([#8689](https://github.com/swc-project/swc/issues/8689)) ([baba663](https://github.com/swc-project/swc/commit/baba66346403da84db3083d22f4afbba4f6a9bfb))


- **(es/visit)** Skip `TsExprWithTypeArgs` from `noop_visit/fold_type` macros ([#8677](https://github.com/swc-project/swc/issues/8677)) ([a7a00aa](https://github.com/swc-project/swc/commit/a7a00aafb9ead8cb536e1205087b371e20a795b3))

### Documentation



- **(contributing)** Remove `enum_kind` from `ARCHITECTURE.md` ([#8666](https://github.com/swc-project/swc/issues/8666)) ([f5651e8](https://github.com/swc-project/swc/commit/f5651e87b1b615ae86fbed20a1d259260341a451))


- **(es/minifier)** Update examples code ([#8652](https://github.com/swc-project/swc/issues/8652)) ([3bf3a62](https://github.com/swc-project/swc/commit/3bf3a62505cc3fc6eaf182b75c319ea4bc212ee8))

### Features



- **(es/ast)** Add alias to `EsVersion` ([#8653](https://github.com/swc-project/swc/issues/8653)) ([7d62c76](https://github.com/swc-project/swc/commit/7d62c762e657cdddf45c1a99c66285ae9cb07b5c))


- **(es/lints)** Add `no-cond-assign` rule ([#8661](https://github.com/swc-project/swc/issues/8661)) ([c0d01df](https://github.com/swc-project/swc/commit/c0d01dff213b2bf0725a16a5e6ca915f7517699d))


- **(es/lints)** Add `no-new-object` rule ([#8663](https://github.com/swc-project/swc/issues/8663)) ([15eef4d](https://github.com/swc-project/swc/commit/15eef4dc7357cffbc934df4e781607afccd959a5))


- **(es/minifier)** Allow `expr_simplifier` to do arithmetic with string literals ([#8683](https://github.com/swc-project/swc/issues/8683)) ([7e05adf](https://github.com/swc-project/swc/commit/7e05adf0fac77455c60e8cd42720c48831f98f5f))

### Performance



- **(visit)** Use `quote::quote!` instead of `pmutil::q!` ([#8485](https://github.com/swc-project/swc/issues/8485)) ([8defcb2](https://github.com/swc-project/swc/commit/8defcb28196238e9f8bcbb0e8f345724d47f8882))


- **(visit)** Use qualified paths for generated codes ([#8655](https://github.com/swc-project/swc/issues/8655)) ([671c4a7](https://github.com/swc-project/swc/commit/671c4a78dd294591a0b18a44e18edc29bba30a52))


- **(visit)** Drop `pmutil` to improve compile time ([#8673](https://github.com/swc-project/swc/issues/8673)) ([b474382](https://github.com/swc-project/swc/commit/b47438245a0fb7f12b325a66a756beeaf58c3c9e))

## [1.4.2] - 2024-02-19

### Bug Fixes



- **(es/helpers)** Add `addInitializer` to field decorators ([#8619](https://github.com/swc-project/swc/issues/8619)) ([cd38ef3](https://github.com/swc-project/swc/commit/cd38ef39d6a3b3f1e31d5144e2e8c11bd9144239))


- **(es/minifier)** Abort property hoister on `this` usage ([#8647](https://github.com/swc-project/swc/issues/8647)) ([9715320](https://github.com/swc-project/swc/commit/97153206ad07c98e6f8f4f0a62b1f52eecbdf847))


- **(es/react)** Validate pragma before parsing ([#8637](https://github.com/swc-project/swc/issues/8637)) ([5f1cf01](https://github.com/swc-project/swc/commit/5f1cf018237d12f786fc6deee48cae5d7d3d77de))


- **(es/typescript)** Handle exported JSX members ([#8642](https://github.com/swc-project/swc/issues/8642)) ([22c8e2e](https://github.com/swc-project/swc/commit/22c8e2e1e9914ed161482dea9e63cd34504b6cbd))

### Features



- **(es/minifier)** Remove unused parameters of arrow functions ([#8636](https://github.com/swc-project/swc/issues/8636)) ([8cd4813](https://github.com/swc-project/swc/commit/8cd481306755fb8cd2436dabceb06ea7cbccbb78))


- **(swc_core)** Expose ES linter ([#8635](https://github.com/swc-project/swc/issues/8635)) ([762959c](https://github.com/swc-project/swc/commit/762959c72d08994c2ad7c4f43405e591cc6af6eb))

### Testing



- **(es/parser)** Add a test for `<<` ([#8634](https://github.com/swc-project/swc/issues/8634)) ([2c63b31](https://github.com/swc-project/swc/commit/2c63b3114382940e5fa96ddd32ed823a78657ec7))


- **(es/transforms)** Add a test for `reserved_words` pass ([#8638](https://github.com/swc-project/swc/issues/8638)) ([a0b77e0](https://github.com/swc-project/swc/commit/a0b77e06645f27a2ffb9f0635b2fa4c8db2fe105))

## [1.4.1] - 2024-02-13

### Bug Fixes



- **(binding/types)** Update typings for `options.envs` to match implementation ([#8620](https://github.com/swc-project/swc/issues/8620)) ([2a115cf](https://github.com/swc-project/swc/commit/2a115cff716b3ac9216d03a4c88649fedff73850))


- **(es/compat)** Visit AssignExpr right branch in FnEnvHoister ([#8633](https://github.com/swc-project/swc/issues/8633)) ([e5d6de0](https://github.com/swc-project/swc/commit/e5d6de0ea9fbab0e36791f59b58d6d2c76809ea5))


- **(es/decorators)** Do not insert duplicate constructors ([#8631](https://github.com/swc-project/swc/issues/8631)) ([21a447f](https://github.com/swc-project/swc/commit/21a447f35a79cdad4721cdefea26da1d355d34d3))


- **(es/parser)** Set class property to `abstract` or `override` even in error states ([#8610](https://github.com/swc-project/swc/issues/8610)) ([5a77306](https://github.com/swc-project/swc/commit/5a773061dbb8674d93fab46681492a7e08f95f2c))


- **(es/parser)** Fix parsing of dynamic source phase imports ([#8611](https://github.com/swc-project/swc/issues/8611)) ([7d724d8](https://github.com/swc-project/swc/commit/7d724d8ea3d222721ddc1c2913771c3367b6f689))


- **(es/parser)** Rescan `<<` as `<` when parsing type args ([#8607](https://github.com/swc-project/swc/issues/8607)) ([9e6dad9](https://github.com/swc-project/swc/commit/9e6dad9baf900b44591c97c5467494c893f02661))


- **(es/parser)** Fix detection of `use strict` directive ([#8617](https://github.com/swc-project/swc/issues/8617)) ([95236e9](https://github.com/swc-project/swc/commit/95236e9abe546c455222a775f9648e82543dfaed))


- **(es/plugin)** Fix schema version issue ([#8621](https://github.com/swc-project/swc/issues/8621)) ([132be95](https://github.com/swc-project/swc/commit/132be951733660654b5c0992e19b5f3d414e7350))


- **(es/quote)** Allow variables typed `AssignTarget` ([#8602](https://github.com/swc-project/swc/issues/8602)) ([6a48be4](https://github.com/swc-project/swc/commit/6a48be4b6b91c71687c2edc1cf9db9538d9f5650))


- **(es/quote)** Support `AssignTarget`, really ([#8603](https://github.com/swc-project/swc/issues/8603)) ([ef91661](https://github.com/swc-project/swc/commit/ef916614f1b714bc765721fd7a35a4a471ac6811))


- **(es/quote)** Fix code generation of `AssignTarget` ([#8604](https://github.com/swc-project/swc/issues/8604)) ([16e9d4c](https://github.com/swc-project/swc/commit/16e9d4ca31561caf4fb2a5182337eae78395dbe6))

### Features



- **(es/minifier)** Implement correct `hoist_props` ([#8593](https://github.com/swc-project/swc/issues/8593)) ([3122e94](https://github.com/swc-project/swc/commit/3122e944a8a1720584b43c7f0c4db3508f0cf915))

### Miscellaneous Tasks



- **(config)** Remove an empty file in `swc_config` ([#8609](https://github.com/swc-project/swc/issues/8609)) ([d87fef0](https://github.com/swc-project/swc/commit/d87fef0fea661b3a50e43af85c12db98e978bc82))


- **(preset-env)** Update `browserslist-rs` ([#8614](https://github.com/swc-project/swc/issues/8614)) ([e5585e9](https://github.com/swc-project/swc/commit/e5585e99f120eb7c76625d90961fd6e4f12579e5))

### Refactor



- **(bindings)** Remove bindings for experimental packages ([#8600](https://github.com/swc-project/swc/issues/8600)) ([6c50ff1](https://github.com/swc-project/swc/commit/6c50ff1bec9c49d0883016d0b2c0cfa3941290c7))

### Testing



- **(es)** Update `tsc` conformance test suite ([#8615](https://github.com/swc-project/swc/issues/8615)) ([c0beba7](https://github.com/swc-project/swc/commit/c0beba7708f88320617d02ce68f079bbe0252075))


- Update `@swc/plguin-jest` used for plugin e2e testing ([#8601](https://github.com/swc-project/swc/issues/8601)) ([95fe3db](https://github.com/swc-project/swc/commit/95fe3dbe931ec42a456fceb2d583d6a04e33edd6))

### Build



- **(cargo)** Update `rustc` to `nightly-2024-02-06` ([#8618](https://github.com/swc-project/swc/issues/8618)) ([6726b63](https://github.com/swc-project/swc/commit/6726b631e68cf7f14612e046c8cf057411e4a3c2))


- **(plugin)** Update `wasmer` to `v4.2.5` ([#8624](https://github.com/swc-project/swc/issues/8624)) ([4e0d240](https://github.com/swc-project/swc/commit/4e0d24089588da8952c6986f1bfcc47bcd9f84a2))

## [1.4.0] - 2024-02-05

### Bug Fixes



- **(cli)** Make Rust CLI use sourcemap code from the `swc` crate ([#8576](https://github.com/swc-project/swc/issues/8576)) ([82bc061](https://github.com/swc-project/swc/commit/82bc061b8caad9b240f3c2ab75c2a53aed502297))


- **(es/codegen)** Fix codegen of async methods with decorators ([#8575](https://github.com/swc-project/swc/issues/8575)) ([8c32225](https://github.com/swc-project/swc/commit/8c322250b7276f002fc0848bbb5c53bdb8802c00))


- **(es/lexer)** Fix typo in `package` keyword ([#8589](https://github.com/swc-project/swc/issues/8589)) ([8413a6c](https://github.com/swc-project/swc/commit/8413a6c48e94613b9ba264210acab4f7f1787057))


- **(es/minifier)** Fix top-level check ([#8583](https://github.com/swc-project/swc/issues/8583)) ([a7c5255](https://github.com/swc-project/swc/commit/a7c5255ad1ad98c183b676af5caaf9057a9eccf1))


- **(es/proposals)** Support using `using` keyword with functions ([#8574](https://github.com/swc-project/swc/issues/8574)) ([d81596c](https://github.com/swc-project/swc/commit/d81596cd2b03ab7523937ae3206797a9c3b819bf))


- **(es/resolver)** Skip property in JSX member ([#8598](https://github.com/swc-project/swc/issues/8598)) ([d480ab9](https://github.com/swc-project/swc/commit/d480ab9ae8226fd8330376e33f0ad556c50d5b75))


- **(es/testing)** Make `test_inline!` not read output as a file ([#8569](https://github.com/swc-project/swc/issues/8569)) ([d683089](https://github.com/swc-project/swc/commit/d683089be1116f7944fcd3dbd4536b343becdf5e))


- **(es/typescript)** Handle exported JSX binding name in TypeScript namespace ([#8596](https://github.com/swc-project/swc/issues/8596)) ([2a70a6b](https://github.com/swc-project/swc/commit/2a70a6b1d477db5ae31c5c9412d299acaea10880))

### Features



- **(es/minifier)** Inline more IIFE arguments ([#8584](https://github.com/swc-project/swc/issues/8584)) ([18e0b53](https://github.com/swc-project/swc/commit/18e0b53fbb19eb016fe3695a169ac7f0708c96d3))


- **(es/minifier)** Respect more options ([#8582](https://github.com/swc-project/swc/issues/8582)) ([fd997d3](https://github.com/swc-project/swc/commit/fd997d3712cf83d5de5bb63b3e2ac38871c4b736))

### Refactor



- **(es/ast)** Improve type definitions of patterns ([#8532](https://github.com/swc-project/swc/issues/8532)) ([7f2a2c1](https://github.com/swc-project/swc/commit/7f2a2c1e406021b8907b8fd35da456bfdc5f55ac))

### Testing



- **(es/minifer)** Update the passing terser test list ([#8573](https://github.com/swc-project/swc/issues/8573)) ([8b86638](https://github.com/swc-project/swc/commit/8b86638970797fe352db40128aabfb6a8cf9a43e))


- **(es/testing)** Ensure that `test_inline!` is working properly ([#8590](https://github.com/swc-project/swc/issues/8590)) ([872a47b](https://github.com/swc-project/swc/commit/872a47b851504f4c0095f7c9f2729d50451c97a6))

## [1.3.107] - 2024-01-28

### Bug Fixes



- **(es/codegen)** Do not produce octal literals ([#8565](https://github.com/swc-project/swc/issues/8565)) ([07634a0](https://github.com/swc-project/swc/commit/07634a05ba9b989d68502953a69a40a2806e93d0))


- **(es/decorator)** Skip TypeScript class method/prop declarations ([#8555](https://github.com/swc-project/swc/issues/8555)) ([6a8dd8c](https://github.com/swc-project/swc/commit/6a8dd8cbb384372657923d4c1094e8053661aa56))


- **(es/decorator)** Preserve state while traversing the `module_items` scope ([#8556](https://github.com/swc-project/swc/issues/8556)) ([f416aff](https://github.com/swc-project/swc/commit/f416aff7d7036de72509132603d9b423a0b95f68))


- **(es/loader)** Make `tsc` resolver work for bare specifier ([#8550](https://github.com/swc-project/swc/issues/8550)) ([d6a4615](https://github.com/swc-project/swc/commit/d6a46158987d0e96d6184d41c2fdd73df92d6681))

## [1.3.106] - 2024-01-25

### Bug Fixes



- **(binding/types)** Add `bugfixes` field to EnvConfig ([#8538](https://github.com/swc-project/swc/issues/8538)) ([49ebdf9](https://github.com/swc-project/swc/commit/49ebdf9fb7c9228c711c303c822add29bc3c8364))


- **(common)** Fix source map generation with `inputSourceMap` ([#8546](https://github.com/swc-project/swc/issues/8546)) ([043ee85](https://github.com/swc-project/swc/commit/043ee85d0852c7c7d6193ad699074a599326aeec))


- **(es/ast)** Add `definite` and `is_override` to `AutoAccessor` ([#8436](https://github.com/swc-project/swc/issues/8436)) ([572bcae](https://github.com/swc-project/swc/commit/572bcaefc1b6ba9f92c57a35ede61fec9f3221bd))


- **(es/ast)** Fix definition of `SetterProp` ([#8314](https://github.com/swc-project/swc/issues/8314)) ([bc38ac9](https://github.com/swc-project/swc/commit/bc38ac906c427ba060f3da47c64726fe417162ed))


- **(es/codegen)** Set `sourceRoot` of sourcemaps ([#6086](https://github.com/swc-project/swc/issues/6086)) ([ae78669](https://github.com/swc-project/swc/commit/ae786692a0d20254bc233472a23035ba1be25e46))


- **(es/compat)** Support vars from `reserved_word` pass ([#8543](https://github.com/swc-project/swc/issues/8543)) ([fc929e9](https://github.com/swc-project/swc/commit/fc929e962ba18afa98ae4523e50ff630527a218f))


- **(es/loader)** Don't use browser versions for `jsc.paths` ([#8548](https://github.com/swc-project/swc/issues/8548)) ([fab27da](https://github.com/swc-project/swc/commit/fab27dabed3a4d0478b28c86809cc06482b2c45c))


- **(es/minifier)** Fix a bug related to inliner and the variable scoping ([#8542](https://github.com/swc-project/swc/issues/8542)) ([aa70131](https://github.com/swc-project/swc/commit/aa70131c558158abd3dcd3fca53dfe444c511ae1))


- **(es/module)** Fix resolving of dependencies ([#8533](https://github.com/swc-project/swc/issues/8533)) ([71fb5c1](https://github.com/swc-project/swc/commit/71fb5c12a75bec27cc775069f83b576019d261f2))


- **(es/module)** Fix handling of `*` in `jsc.paths` ([#8535](https://github.com/swc-project/swc/issues/8535)) ([2d8bd9e](https://github.com/swc-project/swc/commit/2d8bd9ed894cbc2e0e9063f6a1ab723c3d3bfdc6))


- **(es/quote)** Add support for import phase to quote macro ([#8536](https://github.com/swc-project/swc/issues/8536)) ([71930ff](https://github.com/swc-project/swc/commit/71930ffb5625fb58fab3200764ea98b05abab8ba))

### Features



- **(css/parser)** Implement error reporting for `@value` of CSS Modules ([#8547](https://github.com/swc-project/swc/issues/8547)) ([00619b1](https://github.com/swc-project/swc/commit/00619b17082e857d1d5822f04b9ee82b0a295cc3))


- **(es/ast)** Support import phase ([#8279](https://github.com/swc-project/swc/issues/8279)) ([72048ae](https://github.com/swc-project/swc/commit/72048ae1ced64b6d9d326e6d436a60b1191bc266))


- **(swc_core)** Expose `preset_env_base` ([#8537](https://github.com/swc-project/swc/issues/8537)) ([793f265](https://github.com/swc-project/swc/commit/793f2651a8c44c43cde8b83d4f98eda6e274676c))

### Miscellaneous Tasks



- **(common)** Update `sourcemap` ([#8544](https://github.com/swc-project/swc/issues/8544)) ([4630426](https://github.com/swc-project/swc/commit/4630426d6aa77af992787456e476b8862c25a45e))

## [1.3.105] - 2024-01-21

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


- **(es/codegen)** Emit `override` keyword ([#8449](https://github.com/swc-project/swc/issues/8449)) ([0dd96f8](https://github.com/swc-project/swc/commit/0dd96f85e2215f5c18849bdfb150dc95006399e8))


- **(es/minifier)** Add WeakRef as a safe global reference ([#8458](https://github.com/swc-project/swc/issues/8458)) ([d681785](https://github.com/swc-project/swc/commit/d681785b428b7958e7652dc3a7c709ad85b298f9))


- **(es/parser)** Disallowing await as an identifier in class static block ([#8450](https://github.com/swc-project/swc/issues/8450)) ([0b188cc](https://github.com/swc-project/swc/commit/0b188ccdff487bc5c344b0e70b102ce1d9ba308d))


- **(es/renamer)** Correctly check top level ([#8456](https://github.com/swc-project/swc/issues/8456)) ([1e44e57](https://github.com/swc-project/swc/commit/1e44e57a095c151fc52685b9580c083620342fe7))

<!-- generated by git-cliff -->
