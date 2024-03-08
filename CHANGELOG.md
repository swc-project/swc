# Changelog
## [unreleased]

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

<!-- generated by git-cliff -->
