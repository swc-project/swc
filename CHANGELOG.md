# Changelog
## [1.12.1] - 2025-06-12

### Bug Fixes



- **(@swc/types)** Remove `nativeClassProperties` ([#10592](https://github.com/swc-project/swc/issues/10592)) ([39032dc](https://github.com/swc-project/swc/commit/39032dcd96bc618fcddf55d0824836c56f766eab))


- **(es/minifier)** Fix top level detection of DCE ([#10603](https://github.com/swc-project/swc/issues/10603)) ([964a560](https://github.com/swc-project/swc/commit/964a5607d7bacb2bab1135bf0dd546a1a33fdb6c))


- **(es/minifier)** Fix inlining of arrows ([#10604](https://github.com/swc-project/swc/issues/10604)) ([cc3bc4d](https://github.com/swc-project/swc/commit/cc3bc4d66c381d33d00bc530b57c88447ae8ead8))


- **(es/minifier)** Perform DCE on the end ([#10602](https://github.com/swc-project/swc/issues/10602)) ([a97b149](https://github.com/swc-project/swc/commit/a97b1494267bba03436d160d39cd21ce68150173))


- **(swc_common)** Add `Files#is_in_file` ([#10599](https://github.com/swc-project/swc/issues/10599)) ([e6b61eb](https://github.com/swc-project/swc/commit/e6b61ebfde2b0680c3e4144e6725803b2d9d7fc8))

### Features



- **(es/parser)** Support parsing CommonJS ([#10600](https://github.com/swc-project/swc/issues/10600)) ([70bda6a](https://github.com/swc-project/swc/commit/70bda6a199bec4b0f8fddb20040a382c44a78354))

## [1.12.0] - 2025-06-10

### Bug Fixes



- **(@swc/types)** Add `jsc.output.charset` ([#10567](https://github.com/swc-project/swc/issues/10567)) ([26b41e8](https://github.com/swc-project/swc/commit/26b41e86cb103fd6e9b76dcc9ed6625ef73ef9d0))


- **(es/codegen)** Don't call `cmt.get_leading` for dummy span ([#10568](https://github.com/swc-project/swc/issues/10568)) ([16e204d](https://github.com/swc-project/swc/commit/16e204d3fa44acfea087e2e8929b7989894cf7bc))


- **(es/parser)** Disallow spread operator(`...`) in JSX attribute values ([#10587](https://github.com/swc-project/swc/issues/10587)) ([8deba78](https://github.com/swc-project/swc/commit/8deba787bb7a210826be09ce065a7a40eef0d508))


- **(es/typescript)** Pass `native_class_properties` ([#10561](https://github.com/swc-project/swc/issues/10561)) ([7e4cd9a](https://github.com/swc-project/swc/commit/7e4cd9ad4fcd28bc179c75020acb9a596d405efb))


- **(es/typescript)** Handle `export declare var` in namespace ([#10579](https://github.com/swc-project/swc/issues/10579)) ([2daa17f](https://github.com/swc-project/swc/commit/2daa17f110910eae14412bbb29e8fdcf61265d13))


- **(ts/isolated-dts)** Add edges `SymbolFlags::Value` and `SymbolFlags::Type` in exports ([#10577](https://github.com/swc-project/swc/issues/10577)) ([e6d4da2](https://github.com/swc-project/swc/commit/e6d4da219530744171ba46bfa44a06076080e7c2))


- Fix bindings ([0f858fd](https://github.com/swc-project/swc/commit/0f858fd3470c5c104ab9b6ca900ea97be37c615f))

### Documentation



- **(contributing)** Add a script to patch local projects ([#10565](https://github.com/swc-project/swc/issues/10565)) ([3ac0a21](https://github.com/swc-project/swc/commit/3ac0a21288c780ef1267cfeba2662bc6a825b508))

### Features



- **(es/minifier)** Regex support for `format.comments` ([#10571](https://github.com/swc-project/swc/issues/10571)) ([e441df5](https://github.com/swc-project/swc/commit/e441df50105a99c4725277278059e9b6100a95d0))


- **(es/module)** Add support for `import.meta.main` in AMD and CJS ([#10596](https://github.com/swc-project/swc/issues/10596)) ([759de2e](https://github.com/swc-project/swc/commit/759de2e463864d331e5528bbe60b400efb3b1f84))

### Miscellaneous Tasks



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

## [1.11.31] - 2025-06-05

### Bug Fixes



- **(es/codegen)** Improve comments handling ([#10534](https://github.com/swc-project/swc/issues/10534)) ([d9ba838](https://github.com/swc-project/swc/commit/d9ba838df9b88d6c4108bc21dd9d6eebd406aacd))


- **(es/codegen)** Exclude `constructor` from source map names ([#10551](https://github.com/swc-project/swc/issues/10551)) ([ef85640](https://github.com/swc-project/swc/commit/ef856402515758196f5d925bcfb8213bf0ca18fd))


- **(es/fixer)** Fix a bug with awaited arrow fn expression ([#10555](https://github.com/swc-project/swc/issues/10555)) ([9dfdfa6](https://github.com/swc-project/swc/commit/9dfdfa62d3603586ff4279daf4e66443c024cdd6))


- **(es/minifier)** Fix missing variable ([#10478](https://github.com/swc-project/swc/issues/10478)) ([6de3ef6](https://github.com/swc-project/swc/commit/6de3ef65bc599679020de13a3085824f06e047a7))


- **(es/minifier)** Inline object of member if prop is an ident ([#10548](https://github.com/swc-project/swc/issues/10548)) ([e554381](https://github.com/swc-project/swc/commit/e554381bffa3602d7ce9ee156652cf654bac507f))


- **(es/minifier)** Add side effect check for test expr when compressing IfStmt ([#10550](https://github.com/swc-project/swc/issues/10550)) ([3e9728e](https://github.com/swc-project/swc/commit/3e9728e70c77139a770717f87a9e54920e4a58c9))


- **(es/minifier)** Fix typo in an option name ([#10554](https://github.com/swc-project/swc/issues/10554)) ([a303941](https://github.com/swc-project/swc/commit/a303941a36a59db19fe376b7601378fdc3830212))


- **(es/parser)** Emit syntax errors for strict mode in non-module or scripts ([#10545](https://github.com/swc-project/swc/issues/10545)) ([1291b4a](https://github.com/swc-project/swc/commit/1291b4a78c51512fb0c699f3409275f4065bbc0b))


- **(es/react-compiler)** Fix usefulness detection ([#10506](https://github.com/swc-project/swc/issues/10506)) ([41075a1](https://github.com/swc-project/swc/commit/41075a1c8776b62d7c2fc6436677d5d6b083a2f8))


- **(es/utils)** Fix `extract_var_ids` ([#10511](https://github.com/swc-project/swc/issues/10511)) ([5644372](https://github.com/swc-project/swc/commit/56443727dd195a2a3500014b8f54b9a18e14e484))


- **(react-compiler)** Fix fast check ([#10538](https://github.com/swc-project/swc/issues/10538)) ([9403ce2](https://github.com/swc-project/swc/commit/9403ce2e7372dbcd579e2710480f2ffc78d8bcca))


- **(swc_common)** Fix build ([#10544](https://github.com/swc-project/swc/issues/10544)) ([2ed934d](https://github.com/swc-project/swc/commit/2ed934d4a1b2c85d6cc04c038aaee3e09c189e8b))


- **(swc_common)** Fix skip condition for sourcemap ([#10562](https://github.com/swc-project/swc/issues/10562)) ([cbee0df](https://github.com/swc-project/swc/commit/cbee0dfa2b82ed470a387d06470e70617a6ee60a))


- **(swc_common)** Fix skip condition for sourcemap, really ([#10563](https://github.com/swc-project/swc/issues/10563)) ([14feedb](https://github.com/swc-project/swc/commit/14feedb55286bbd811b4dfba26501bd1127067fe))


- **(swc_common)** Revert skip condition patch ([#10564](https://github.com/swc-project/swc/issues/10564)) ([2a2b284](https://github.com/swc-project/swc/commit/2a2b284f2522ee1bb04033a4aa787b853617823f))


- **(ts/fast-dts)** Correctly emit Symbol-keyed accessors in declarations ([#10508](https://github.com/swc-project/swc/issues/10508)) ([1298e76](https://github.com/swc-project/swc/commit/1298e767e78d69ba02efb1cb3260266b5a2812c2))


- **(ts/fast-dts)** Ensure correct emission of template literals and symbol-keyed properties ([#10530](https://github.com/swc-project/swc/issues/10530)) ([8dbdbef](https://github.com/swc-project/swc/commit/8dbdbef266f508e09f52ffe1cbe2e953e5039a3d))

### Features



- **(es/regexp)** Add crates for RegExp ([#10525](https://github.com/swc-project/swc/issues/10525)) ([4b3f924](https://github.com/swc-project/swc/commit/4b3f924edf996983e2a61cc29eb0c552cf71af7a))


- **(swc_common)** Add `Globals::clone_data` ([#10543](https://github.com/swc-project/swc/issues/10543)) ([39f30b0](https://github.com/swc-project/swc/commit/39f30b066fe4d91f8df641fe59aba86acb10d645))


- **(swc_common)** Add `map_raw_pos` to `Files` ([#10560](https://github.com/swc-project/swc/issues/10560)) ([71224c3](https://github.com/swc-project/swc/commit/71224c365335e970f6dd12a47b4524da6d861bb3))

### Miscellaneous Tasks



- **(bindings)** Use published versions of crates ([#10513](https://github.com/swc-project/swc/issues/10513)) ([f65f028](https://github.com/swc-project/swc/commit/f65f02831cb68245d5790a6c867ac3e997eedbfd))


- **(ecosystem-ci)** Exclude `ts-node` ([2b284e1](https://github.com/swc-project/swc/commit/2b284e1930bd9aab88d74bef0f7453bf23e2ddfe))

### Performance



- **(es/minifier)** Merge `PropertyCollector` into usage analyzer ([#10514](https://github.com/swc-project/swc/issues/10514)) ([505bf54](https://github.com/swc-project/swc/commit/505bf542cd197afb2a5a5f7cd89ed97ac681a923))


- **(es/minifier)** Remove needless clone ([#10523](https://github.com/swc-project/swc/issues/10523)) ([1c02ef6](https://github.com/swc-project/swc/commit/1c02ef63aa48b239a43f359991af736071634a21))


- **(es/parser)** Reduce comparison while reading logical ([#10526](https://github.com/swc-project/swc/issues/10526)) ([2bc551c](https://github.com/swc-project/swc/commit/2bc551cb39d99ecebd5d6f10fc94a93173b2aefa))


- **(es/renamer)** Merge analyze/collect ([#10509](https://github.com/swc-project/swc/issues/10509)) ([7b47f66](https://github.com/swc-project/swc/commit/7b47f661dd6794f658023b649ebcdc153fe6e27c))


- **(swc_common)** Remove `char_indices` calls ([#10541](https://github.com/swc-project/swc/issues/10541)) ([51507bc](https://github.com/swc-project/swc/commit/51507bcfa24fcdc202e5bbf255a24feb1665a395))

### Refactor



- **(es/codegen)** Migrate to `ryu-js` for numeric literal codegen ([#10503](https://github.com/swc-project/swc/issues/10503)) ([4bc4244](https://github.com/swc-project/swc/commit/4bc4244c195d3a364b588348657fd8a3d8c22079))


- **(es/lexer)** Cleanup code for reading tokens ([#10533](https://github.com/swc-project/swc/issues/10533)) ([a72092c](https://github.com/swc-project/swc/commit/a72092c13166fe80d494e49cf0c5ec04e93ee4eb))


- **(es/lexer)** Share `skip_block_comment` ([#10549](https://github.com/swc-project/swc/issues/10549)) ([b101a87](https://github.com/swc-project/swc/commit/b101a87771d287b8e3bd9ae60a94b39de192718b))


- **(es/parser)** Share code for parsing strings ([#10522](https://github.com/swc-project/swc/issues/10522)) ([931a2d6](https://github.com/swc-project/swc/commit/931a2d6761bfec72cdda7eb875ad02dc217848b9))


- **(es/parser)** Cleanup ([#10559](https://github.com/swc-project/swc/issues/10559)) ([963ac9e](https://github.com/swc-project/swc/commit/963ac9efb23d4613932bcb6a29b94b9ac5d13860))


- **(ts/fast-dts)** Derive computed flags from source code ([#10510](https://github.com/swc-project/swc/issues/10510)) ([a2d5664](https://github.com/swc-project/swc/commit/a2d56645cbf753770a2634e23423a59acaae6b84))

## [1.11.29] - 2025-05-21

### Bug Fixes



- **(@swc/types)** Add `transform.nativeClassProperties` ([#10418](https://github.com/swc-project/swc/issues/10418)) ([f3af44c](https://github.com/swc-project/swc/commit/f3af44c1540268c02c86b71796f1a0ac50594584))


- **(@swc/types)** Add `resolveFully` to `BaseModuleConfig` ([#10426](https://github.com/swc-project/swc/issues/10426)) ([164cbaa](https://github.com/swc-project/swc/commit/164cbaa2c02a3216096fa7b969fcfa6575954892))


- **(ci)** Remove wasmer override ([425eeb9](https://github.com/swc-project/swc/commit/425eeb905656cede2e67cdd114beb5bc2fc6699d))


- **(es/compat)** Properly handle rest assignment in for-in/of head ([#10489](https://github.com/swc-project/swc/issues/10489)) ([b9c0446](https://github.com/swc-project/swc/commit/b9c04468f17f0583a132f00daf9d138ce38a9d8b))


- **(es/jest)** Hoisting vars with names starting with mock ([#10410](https://github.com/swc-project/swc/issues/10410)) ([a29eb29](https://github.com/swc-project/swc/commit/a29eb2973365ae22cae0fde6e20693b538962cf9))


- **(es/jest)** Revert #10410 ([#10452](https://github.com/swc-project/swc/issues/10452)) ([bc756f8](https://github.com/swc-project/swc/commit/bc756f84c9b1c154fe7f00193066301658ef1484))


- **(es/minifier)** Properly handle object shorthand syntax during compression ([#10467](https://github.com/swc-project/swc/issues/10467)) ([bae4940](https://github.com/swc-project/swc/commit/bae494039d49967c05c6d34645de25ade13aac33))


- **(es/module)** Handle `__proto__` export name ([#10420](https://github.com/swc-project/swc/issues/10420)) ([1b94c7a](https://github.com/swc-project/swc/commit/1b94c7a7fb8c55200faa474448f2cc29612f6aa0))


- **(es/optimization)** Support decimal numbers in `jsonify` ([#10424](https://github.com/swc-project/swc/issues/10424)) ([affdec2](https://github.com/swc-project/swc/commit/affdec2be84d58ac30f91bf17325bd3095e1ce46))


- **(es/react-compiler)** Mark function components declared as a var interesting ([#10437](https://github.com/swc-project/swc/issues/10437)) ([5eac076](https://github.com/swc-project/swc/commit/5eac076b77fa43649cde468deee49771a987781c))


- **(es/renamer)** Fix (broken) identifier preserving API ([#10474](https://github.com/swc-project/swc/issues/10474)) ([06c64cf](https://github.com/swc-project/swc/commit/06c64cf9ed0e84891daf102f8756fcb1ee516527))


- **(ts/fast-dts)** Emit `readonly` for Object getter prop ([#10492](https://github.com/swc-project/swc/issues/10492)) ([6c03e20](https://github.com/swc-project/swc/commit/6c03e20a98b239572c29424165d6031207a7340d))


- **(ts/fast-dts)** Align object getter/setter emit behavior with TypeScript ([#10502](https://github.com/swc-project/swc/issues/10502)) ([78c754e](https://github.com/swc-project/swc/commit/78c754e7a6057c07db077f2954a11d0eb7eb7276))

### Features



- **(common)** Allow using `build_sourcemap` with multiple `SourceMap` ([#10438](https://github.com/swc-project/swc/issues/10438)) ([2a07c8a](https://github.com/swc-project/swc/commit/2a07c8a9c223cbb3862cf7aaafa7659667d13b6e))


- **(common)** Add `ignoreList` support for sourcemap ([#10442](https://github.com/swc-project/swc/issues/10442)) ([6750459](https://github.com/swc-project/swc/commit/6750459d9180048a39c11e14b02c9bfed251a12e))


- **(config)** Allow using glob in some places ([#10445](https://github.com/swc-project/swc/issues/10445)) ([f7a6359](https://github.com/swc-project/swc/commit/f7a635985e8bf9654ed999b3d4da72b4a27e7fda))


- **(config)** Use `globset` instead ([#10446](https://github.com/swc-project/swc/issues/10446)) ([7bbaef8](https://github.com/swc-project/swc/commit/7bbaef8b170348839f1b43617244c1809896c094))


- **(es/module)** Add support for stripping "node:" prefix in imports and exports ([#10461](https://github.com/swc-project/swc/issues/10461)) ([ae2ff62](https://github.com/swc-project/swc/commit/ae2ff627a1bf0ea0e479361cc267c8f7ebde8f49))


- **(es/react-compiler)** Initialize support crate ([#10422](https://github.com/swc-project/swc/issues/10422)) ([1e88e6b](https://github.com/swc-project/swc/commit/1e88e6b4143ba450b80fedcf4bdd34aa0a990590))


- Initialize `@swc/react-compiler` ([#10475](https://github.com/swc-project/swc/issues/10475)) ([883b24c](https://github.com/swc-project/swc/commit/883b24c6248fecb223693974951080889bd8827a))

### Miscellaneous Tasks



- **(es/minifier)** Remove useless check ([#10471](https://github.com/swc-project/swc/issues/10471)) ([ca85958](https://github.com/swc-project/swc/commit/ca859584036b2fb2e8a9398e602e2a7f42e36a07))

### Performance



- **(common)** Accept owned instance of `sourcemap::SourceMap` ([#10463](https://github.com/swc-project/swc/issues/10463)) ([6ee439a](https://github.com/swc-project/swc/commit/6ee439aa7a96f99524c2aaee88d200e301ae611c))


- **(es/minifier)** Use fxhash for DCE ([#10440](https://github.com/swc-project/swc/issues/10440)) ([c0ddd96](https://github.com/swc-project/swc/commit/c0ddd96f694ca35825d7ca89a1bb318ffb23625c))


- **(es/minifier)** Remove needless `collect_decls` call ([#10450](https://github.com/swc-project/swc/issues/10450)) ([8e4b6ce](https://github.com/swc-project/swc/commit/8e4b6ce881448813935e6ae68d16a838d7a01838))


- **(es/minifier)** Clear graph eagerly in DCE ([#10455](https://github.com/swc-project/swc/issues/10455)) ([31e21d7](https://github.com/swc-project/swc/commit/31e21d7cbc9ed3b359ff2a48771a6fda16e916bc))


- **(es/minifier)** Perform full analysis only once for DCE ([#10454](https://github.com/swc-project/swc/issues/10454)) ([61baf84](https://github.com/swc-project/swc/commit/61baf849424a4f430f584b90a3a797578f316693))


- **(es/minifier)** Use `bitflags` for var info ([#10459](https://github.com/swc-project/swc/issues/10459)) ([36f8385](https://github.com/swc-project/swc/commit/36f8385256caca7efa42fb5a8e129d51df9df226))


- **(es/optimization)** Rely on `resolver` from `inline_globals` ([#10449](https://github.com/swc-project/swc/issues/10449)) ([1978809](https://github.com/swc-project/swc/commit/197880946afb1eeea85520b83fa04a91fc1c6de4))


- **(es/renamer)** Merge Id/Def collector ([#10487](https://github.com/swc-project/swc/issues/10487)) ([73377f0](https://github.com/swc-project/swc/commit/73377f09dc83624559f7d1539de59922c42836c9))


- **(es/utils)** Make `IdentUsageFinder` parallel ([#10444](https://github.com/swc-project/swc/issues/10444)) ([d074bca](https://github.com/swc-project/swc/commit/d074bcaf201e26ce2973633f9ef9f142b74f8dc3))


- **(es/utils)** Stop visiting once found in `EvalFinder` ([#10483](https://github.com/swc-project/swc/issues/10483)) ([3402270](https://github.com/swc-project/swc/commit/3402270edc81838451c7ce3a5cc93ba205d076d6))

### Refactor



- **(common)** Remove useless `&mut` ([#10405](https://github.com/swc-project/swc/issues/10405)) ([edbeb49](https://github.com/swc-project/swc/commit/edbeb4947a78d778de111c61f02edf0e8d3ce3ae))


- **(common)** Remove unused methods ([#10469](https://github.com/swc-project/swc/issues/10469)) ([b77311a](https://github.com/swc-project/swc/commit/b77311adfc19fa41c2b316e37ef3832c9ffaede8))


- **(ecma/transform)** Cleanup rename analyzer ([#10500](https://github.com/swc-project/swc/issues/10500)) ([de51be1](https://github.com/swc-project/swc/commit/de51be1a782af1f22c2ca5ab3ddc5fa187872281))


- **(es)** Remove unused code ([#10460](https://github.com/swc-project/swc/issues/10460)) ([d344133](https://github.com/swc-project/swc/commit/d34413338b387e58c3ea998ca05f26bac81fbe6f))


- **(es)** Deduplicate `EvalFinder` ([#10472](https://github.com/swc-project/swc/issues/10472)) ([9f104af](https://github.com/swc-project/swc/commit/9f104af5089b34f0ffccf29d5f77c2abdfc83066))


- **(es/minifier)** Remove unused file ([#10465](https://github.com/swc-project/swc/issues/10465)) ([7d49097](https://github.com/swc-project/swc/commit/7d490978251d85696e0279298a736ebd286c5685))


- **(es/minifier)** Merge label/private name renamer ([#10480](https://github.com/swc-project/swc/issues/10480)) ([5add84d](https://github.com/swc-project/swc/commit/5add84dffcc4c03ed79e4aa29ded3fc1bfa70a7d))


- **(es/parser)** Split parser into also-lex/parse-only ([#10399](https://github.com/swc-project/swc/issues/10399)) ([26289ab](https://github.com/swc-project/swc/commit/26289ab766230a896da6c3a2d95a157ce3793eee))


- **(es/parser)** Parse shebang and cleanup ([#10481](https://github.com/swc-project/swc/issues/10481)) ([619873a](https://github.com/swc-project/swc/commit/619873a2cf7d5ddb1ce1aa59123371127dc9f2f6))


- **(es/parser)** Cleanup usage of `is!` and `bump!` ([#10490](https://github.com/swc-project/swc/issues/10490)) ([b695b68](https://github.com/swc-project/swc/commit/b695b6830e2e7a4d1922fa455d94fe4d912effa4))


- **(es/renamer)** Inline `get_unresolved` ([#10493](https://github.com/swc-project/swc/issues/10493)) ([0f5d9c1](https://github.com/swc-project/swc/commit/0f5d9c1ac780b8db83dcaf108aef499157b084c3))


- **(es/transforms)** Unify `preset_env` and `es_version` transform ([#10451](https://github.com/swc-project/swc/issues/10451)) ([6546c27](https://github.com/swc-project/swc/commit/6546c27fab5a3bd3b1a114ccf35c5a5c725935fe))

### Build



- **(plugin)** Update `wasmer` to `v6.0.0` ([#10439](https://github.com/swc-project/swc/issues/10439)) ([b9eff3c](https://github.com/swc-project/swc/commit/b9eff3c92b77cfd9b15b24d7e08614ac0c59f8fd))


- Update `rustc` to `nightly-2025-05-06` ([#10443](https://github.com/swc-project/swc/issues/10443)) ([a7cbde7](https://github.com/swc-project/swc/commit/a7cbde7fdbe17c12bd0c2b205f0349a21707ec65))

## [1.11.23] - 2025-04-29

### Bug Fixes



- **(es/compat)** Remove `PURE` mark from _async_to_generator ([#10414](https://github.com/swc-project/swc/issues/10414)) ([1c6f65c](https://github.com/swc-project/swc/commit/1c6f65cd5b2c742a41b35b8711af00eb61297f88))


- **(es/proposal)** Preserve class id for hoisted classes when transforming `using` declarations ([#10407](https://github.com/swc-project/swc/issues/10407)) ([b703f21](https://github.com/swc-project/swc/commit/b703f21f6175386be7794ff1adaff471e42af9f3))

### Refactor



- Use debug level tracing for ast related tracing ([#10411](https://github.com/swc-project/swc/issues/10411)) ([3a0fa99](https://github.com/swc-project/swc/commit/3a0fa9968ebce3f6ce46961fa539dbbb07d32658))

## [1.11.22] - 2025-04-23

### Bug Fixes



- **(es/parser)** Parse `export default from;` with `exportDefaultFrom: true` option ([#10373](https://github.com/swc-project/swc/issues/10373)) ([a270cb0](https://github.com/swc-project/swc/commit/a270cb0f469b174cd36174740a674f0ffc19b042))


- **(es/proposal)** Fix exported class for `explicit-resource-management` ([#10393](https://github.com/swc-project/swc/issues/10393)) ([6b5dbc6](https://github.com/swc-project/swc/commit/6b5dbc6078248cc6fd467a7f57be17082b837565))


- **(swc_core)** Fix downstream doc builds ([#10401](https://github.com/swc-project/swc/issues/10401)) ([df511ba](https://github.com/swc-project/swc/commit/df511ba183570f1a2f4564cd24a3d67dd3b3573c))


- Upgrade browserslist-rs version ([#10389](https://github.com/swc-project/swc/issues/10389)) ([f802892](https://github.com/swc-project/swc/commit/f802892add01c7dac9744db1a8f1f7366b43dd0a))

### Features



- **(bindings/core)** Enhance existing parse function to accept both string and buffer types([#10371](https://github.com/swc-project/swc/issues/10371)) ([c9a2afc](https://github.com/swc-project/swc/commit/c9a2afcfd1b6ce0bd5ca8ea56a4ab7f75a629094))


- **(css/prefixer)** Fix default implementation ([#10351](https://github.com/swc-project/swc/issues/10351)) ([34f4e41](https://github.com/swc-project/swc/commit/34f4e4158524da6d2a9fbbea96ecaab861336553))

### Miscellaneous Tasks



- **(bindings/node)** Add `README.md` ([#10402](https://github.com/swc-project/swc/issues/10402)) ([a0e89f0](https://github.com/swc-project/swc/commit/a0e89f09b86a2dd034020257907130ad1c66797f))


- **(es/parser)** Remove useless check ([#10386](https://github.com/swc-project/swc/issues/10386)) ([d1770ac](https://github.com/swc-project/swc/commit/d1770ac5d75a295fc0910cc5185c8d6a75b2b9be))


- **(es/utils)** Mark Symbol members as literal ([#10400](https://github.com/swc-project/swc/issues/10400)) ([3935b60](https://github.com/swc-project/swc/commit/3935b60340685d1f4aa464da8e9cec80c48cabd2))

### Performance



- **(common)** Use `next` instead of `nth` ([#10403](https://github.com/swc-project/swc/issues/10403)) ([12c2807](https://github.com/swc-project/swc/commit/12c28079fccc67c8e125a782c9dfd7ef5354df9e))


- **(es/minifier)** Use bigflags to reduce context size of analyzer ([#10380](https://github.com/swc-project/swc/issues/10380)) ([773d19c](https://github.com/swc-project/swc/commit/773d19cdc49ddb55ed6f6c3262a0fccbf73b4c5f))


- **(es/minifier)** Use `bitflags` to reduce context size of `InfectionCollector`  ([#10387](https://github.com/swc-project/swc/issues/10387)) ([126d432](https://github.com/swc-project/swc/commit/126d43295e7f5e09092da653f537c843f2d79836))


- **(es/minifier)** Use `bitflags` to reduce compress context size ([#10381](https://github.com/swc-project/swc/issues/10381)) ([99495bd](https://github.com/swc-project/swc/commit/99495bde7e73b045c8d2aea8a3fa9a2c9492ca82))


- **(es/parser)** Move `found_module_item` to `Parser` ([#10388](https://github.com/swc-project/swc/issues/10388)) ([fd52c5c](https://github.com/swc-project/swc/commit/fd52c5c5c0682309042e22ecc511a1a1712322ec))

### Refactor



- **(es/compat)** Simplify `async_to_generator` ([#10341](https://github.com/swc-project/swc/issues/10341)) ([e9eeba1](https://github.com/swc-project/swc/commit/e9eeba1b3d4b2c291633c4a8951737c4a5b2246c))


- **(es/lexer)** Split lexer ([#10377](https://github.com/swc-project/swc/issues/10377)) ([3ef2bd1](https://github.com/swc-project/swc/commit/3ef2bd13d0102b2a59a5c32c4197ccdea998b5f2))

### Testing



- **(es/transform)** Add tests for source map ([#10375](https://github.com/swc-project/swc/issues/10375)) ([0018a8e](https://github.com/swc-project/swc/commit/0018a8ead2592857b9a6dff446933c16f58a9df2))

## [1.11.21] - 2025-04-14

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

## [1.11.20] - 2025-04-11

### Bug Fixes



- **(error_reporters)** Removing unused code to fix clippy check ([#10338](https://github.com/swc-project/swc/issues/10338)) ([5970f93](https://github.com/swc-project/swc/commit/5970f937f7dec526fc45d0c33f28e2f0c3f86758))


- **(es/minifier)** Preserve block with block scoped declaration ([#10335](https://github.com/swc-project/swc/issues/10335)) ([a4ac3b7](https://github.com/swc-project/swc/commit/a4ac3b7188c595aa76d0f28c75d302da7fe25ccc))


- **(es/parser)** Allow abstract method named `accessor` ([#10327](https://github.com/swc-project/swc/issues/10327)) ([3f71776](https://github.com/swc-project/swc/commit/3f7177665cda8497961bdaf8d8cff5a41e09df00))


- **(es/preset-env)** Consider `browserslist` config if `env.target` is not configured ([#8921](https://github.com/swc-project/swc/issues/8921)) ([a2dc372](https://github.com/swc-project/swc/commit/a2dc372f9ce8f89c2446ee5df3e205223616d229))


- **(es/resolver)** Handle using declarations ([#10354](https://github.com/swc-project/swc/issues/10354)) ([dad815c](https://github.com/swc-project/swc/commit/dad815cee63f89fbdb393bdf8c02751ea4c4e929))


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


- **(es/parser)** Remove ascii check for no-ascii ([#10350](https://github.com/swc-project/swc/issues/10350)) ([4279b96](https://github.com/swc-project/swc/commit/4279b96d12f259bd3205a71b3402402fe4880d5b))

### Testing



- **(es)** Unignore tests and update node to `20` in exec tests ([#10348](https://github.com/swc-project/swc/issues/10348)) ([eee73ce](https://github.com/swc-project/swc/commit/eee73cec761d1c28f6d1b87be9082fdf2af6e226))

## [1.11.18] - 2025-04-07

### Bug Fixes



- **(errors)** Disable wrapping of text lines ([#10314](https://github.com/swc-project/swc/issues/10314)) ([f6840ea](https://github.com/swc-project/swc/commit/f6840ea41411adcc46cfb7570ad800d479f2014d))


- **(es/codegen)** Ensure proper Unicode escape handling for ES5 and below #10028 ([#10309](https://github.com/swc-project/swc/issues/10309)) ([7f76fa3](https://github.com/swc-project/swc/commit/7f76fa37050cfa46503333243cf2d9bd6e9dfd47))


- **(node)** Fix `worker_threads` issue on glibc platform ([#10306](https://github.com/swc-project/swc/issues/10306)) ([1d1ff9e](https://github.com/swc-project/swc/commit/1d1ff9edcc6376b94f95c2f421c8708d12388b8a))

### Features



- **(es/minifier)** Optimize number to int ([#10294](https://github.com/swc-project/swc/issues/10294)) ([6dcfa70](https://github.com/swc-project/swc/commit/6dcfa703ef3cd87c76bdf25eb63446cfe8a161b5))


- **(es/minifier)** Remove useless to number ([#10308](https://github.com/swc-project/swc/issues/10308)) ([898f170](https://github.com/swc-project/swc/commit/898f17057af46dbc9a10d9e94c638db764733278))


- **(ts/isolated-dts)** Distinguish js value and ts type ([#10316](https://github.com/swc-project/swc/issues/10316)) ([c480604](https://github.com/swc-project/swc/commit/c480604da533f0c2738160efe31d914355f53601))

### Refactor



- **(es/codegen)** Split `lib.rs` into multiple files ([#10304](https://github.com/swc-project/swc/issues/10304)) ([5a07a5d](https://github.com/swc-project/swc/commit/5a07a5db219a9251091d36190151101ac1b7e3fb))


- **(es/codegen)** Refactor macro to inverse order ([#10297](https://github.com/swc-project/swc/issues/10297)) ([78f907f](https://github.com/swc-project/swc/commit/78f907f5bb97de54c3c26ca24b5de3a4be7940d1))

### Testing



- **(es/minifier)** Remove duplicate test ([#10305](https://github.com/swc-project/swc/issues/10305)) ([a80dea8](https://github.com/swc-project/swc/commit/a80dea81dfa960f2922591a76c6f1b81ab8e12cd))

## [1.11.16] - 2025-04-01

### Miscellaneous Tasks



- **(deps)** Update actions ([#10222](https://github.com/swc-project/swc/issues/10222)) ([cf33196](https://github.com/swc-project/swc/commit/cf33196160fdcd004e188c33f8f665a4c81263f2))

## [1.11.15] - 2025-04-01

### Bug Fixes



- **(bindings/node)** Fix build on platforms without plugin ([#10301](https://github.com/swc-project/swc/issues/10301)) ([3faae55](https://github.com/swc-project/swc/commit/3faae55a170664ff6d22824fe8dcb8cf1a110bec))


- **(cli)** Fix plugin target as `wasm32-wasip1` ([#10293](https://github.com/swc-project/swc/issues/10293)) ([7daf4f4](https://github.com/swc-project/swc/commit/7daf4f4b62f77f97f39eb1fbe97e947948cdb0ad))


- **(deps)** Update cargo (patch) ([#10081](https://github.com/swc-project/swc/issues/10081)) ([e0ff00e](https://github.com/swc-project/swc/commit/e0ff00ecb347a7a907e17162b095eb32d9c602a6))


- **(es)** Do not reuse `Compiler` for `minify()` and `transform()` ([#10273](https://github.com/swc-project/swc/issues/10273)) ([63bd8a1](https://github.com/swc-project/swc/commit/63bd8a10a9e90bb021d8425cd0563e2f0cd200a0))


- **(es/analysis)** Support comments ([#10299](https://github.com/swc-project/swc/issues/10299)) ([2919d16](https://github.com/swc-project/swc/commit/2919d1688a880e1fa4c6b1e6595e5aacb9167754))


- **(es/bugfix)** Do not rename in non-ident-function ([#10274](https://github.com/swc-project/swc/issues/10274)) ([48b6bdb](https://github.com/swc-project/swc/commit/48b6bdb6398cfd5f18e8a7d1313f8e794179446b))


- **(es/minifier)** Remove unnecessary check when invoke IIFE ([#10257](https://github.com/swc-project/swc/issues/10257)) ([6b75775](https://github.com/swc-project/swc/commit/6b75775dbf18a67a28f3d63a1035ff83613b74c8))


- **(es/parser)** Parser a program as a module with TLA in non-expression statement ([#10287](https://github.com/swc-project/swc/issues/10287)) ([157c52a](https://github.com/swc-project/swc/commit/157c52aaa7ae2c5fbd30afd537c2b5c681d85508))


- **(html)** Remove `async` from `minifyFragmentSync` ([#10289](https://github.com/swc-project/swc/issues/10289)) ([7028457](https://github.com/swc-project/swc/commit/702845784361953050ce06450a05c6ef2a598311))

### Documentation



- **(es/types)** Document `outFileExtension` ([#10265](https://github.com/swc-project/swc/issues/10265)) ([99018c5](https://github.com/swc-project/swc/commit/99018c53ad0394a1b775b4a4265b301306394a8c))


- Add star history to `README.md` ([b51eea9](https://github.com/swc-project/swc/commit/b51eea9f48a943fb8c0fb457f4961e1178c203bc))

### Features



- **(es)** Add Rust plugin host part for analysis API ([#10285](https://github.com/swc-project/swc/issues/10285)) ([d213a84](https://github.com/swc-project/swc/commit/d213a840e027abd49c70de712abc7bf5fc41be71))


- **(es)** Add analysis API and refactor output API ([#10288](https://github.com/swc-project/swc/issues/10288)) ([a53c60d](https://github.com/swc-project/swc/commit/a53c60db18bd90539f3449348cbb166f32f46223))


- **(es/minifier)** Allow disabling char frequency analysis ([#10259](https://github.com/swc-project/swc/issues/10259)) ([50c62d1](https://github.com/swc-project/swc/commit/50c62d1ca20da77fe47e9af1b484c09ca180a830))


- **(es/minifier)** Merge expression with empty return ([#10283](https://github.com/swc-project/swc/issues/10283)) ([c276a38](https://github.com/swc-project/swc/commit/c276a3876a47c973886568eaaa42dc3afe7b0c0a))


- **(es/minifier)** Optimize code generated by optional chaining ([#10292](https://github.com/swc-project/swc/issues/10292)) ([0d88041](https://github.com/swc-project/swc/commit/0d880412dfeeef25fd1978e3c05b8f7e23bd780d))


- **(es/minifier)** Support `reduce_escaped_newline` ([#10232](https://github.com/swc-project/swc/issues/10232)) ([64fb286](https://github.com/swc-project/swc/commit/64fb2864b11e5e615b6201dc70ece082fa975742))


- **(ts/fast-strip)** Improve error message format ([#10298](https://github.com/swc-project/swc/issues/10298)) ([29c4afb](https://github.com/swc-project/swc/commit/29c4afb534d582f7411a2fa6be4f1416c517e83f))


- Add parallel iterators ([#10075](https://github.com/swc-project/swc/issues/10075)) ([3b775bf](https://github.com/swc-project/swc/commit/3b775bf38dd76fabf2fc5fdb21a4431e959d02f3))

### Miscellaneous Tasks



- **(html)** Fix typing ([3ed8a7a](https://github.com/swc-project/swc/commit/3ed8a7a42f2973bdb0f626f0193d550a2bd790c5))

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

## [1.11.13] - 2025-03-24

### Features



- **(es/minifier)** Merge alt's cons with cons ([#10256](https://github.com/swc-project/swc/issues/10256)) ([589bcd7](https://github.com/swc-project/swc/commit/589bcd70c4c3ad9f66ba2bbf5e4c46b82a5ddb68))


- **(swc_core)** Expose features of `swc_parallel` ([#10258](https://github.com/swc-project/swc/issues/10258)) ([042f19f](https://github.com/swc-project/swc/commit/042f19ff66e56a28a8a7616049744498c1349bfb))

### Performance



- **(es/minifier)** Merge `expr_simplifier` into pure optimizer ([#10202](https://github.com/swc-project/swc/issues/10202)) ([9c9b0ba](https://github.com/swc-project/swc/commit/9c9b0baaacf36083709dac2d18ba4db9482c70ed))

## [1.11.12] - 2025-03-23

### Bug Fixes



- **(es/minifier)** Make `inline_globals` noop by default ([#10231](https://github.com/swc-project/swc/issues/10231)) ([b192dc8](https://github.com/swc-project/swc/commit/b192dc82e6a84bd30f159fb12ca8a216f41e8efb))


- **(es/minifier)** Fix access to `GLOBALS` in char freq compute ([#10239](https://github.com/swc-project/swc/issues/10239)) ([6286663](https://github.com/swc-project/swc/commit/628666386877067c96c32f50b55cda80acde979e))


- **(es/parser)** Fix span of wrong `await` tokens ([#10252](https://github.com/swc-project/swc/issues/10252)) ([5c28dc3](https://github.com/swc-project/swc/commit/5c28dc39646a449a9d0a92f560427ee75e1b0644))


- **(es/types)** Fix broken types ([#10224](https://github.com/swc-project/swc/issues/10224)) ([540bdf8](https://github.com/swc-project/swc/commit/540bdf868d888a017e90c9badf8bab49e9b485bb))

### Documentation



- **(es)** Improve documentation ([#10247](https://github.com/swc-project/swc/issues/10247)) ([549e38d](https://github.com/swc-project/swc/commit/549e38db9e13135c5318fdef76635eeb82a21c11))

### Features



- **(es/fast-lexer)** Enhance identifier handling with Unicode support ([#10226](https://github.com/swc-project/swc/issues/10226)) ([482b63a](https://github.com/swc-project/swc/commit/482b63a905ddcc49a0cbf0b5a84f93ca7d2a42df))


- **(es/minifier)** Invoke IIFE into block ([#10220](https://github.com/swc-project/swc/issues/10220)) ([c9a6c23](https://github.com/swc-project/swc/commit/c9a6c2378737828becd9b6a87c2fb3b93d9c0acb))


- **(es/minifier)** Remove needless blocks ([#10234](https://github.com/swc-project/swc/issues/10234)) ([0817970](https://github.com/swc-project/swc/commit/08179702bfb1172d5764d8c5326bd00f4e04ba61))


- **(swc_parallel)** Introduce `rayon` mode ([#10237](https://github.com/swc-project/swc/issues/10237)) ([3c2213c](https://github.com/swc-project/swc/commit/3c2213c8299e889fb99ace0a53cf0b2152976bae))


- **(ts/fast-strip)** Add start/end span information ([#10251](https://github.com/swc-project/swc/issues/10251)) ([ab39a62](https://github.com/swc-project/swc/commit/ab39a62528ee852acc5eb089c305ff93aa5d1bea))


- **(ts/fast-strip)** Improve error message snippet ([#10253](https://github.com/swc-project/swc/issues/10253)) ([f4f426c](https://github.com/swc-project/swc/commit/f4f426c9c95d4eda5433e1da123f9b93bc1cb408))


- **(ts/fast-strip)** Remove line numbers ([#10254](https://github.com/swc-project/swc/issues/10254)) ([40e216d](https://github.com/swc-project/swc/commit/40e216db82225a1b6cbd9bf2925a4fe7aab2c98e))

### Performance



- **(es/minifier)** Merge `dead_branch_remover` into pure optimizer ([#10201](https://github.com/swc-project/swc/issues/10201)) ([6841523](https://github.com/swc-project/swc/commit/6841523977d072f3bed361fbb7a47910b41bbcd9))

## [1.11.11] - 2025-03-17

### Bug Fixes



- **(es/ast)** Fix Typo in API ([#10210](https://github.com/swc-project/swc/issues/10210)) ([8eb87ba](https://github.com/swc-project/swc/commit/8eb87ba89698f5d8ce2ade37737ae3e285f1235c))


- **(es/minifier)** Do not drop numbers incorrectly ([#10211](https://github.com/swc-project/swc/issues/10211)) ([80ccd86](https://github.com/swc-project/swc/commit/80ccd861a280c133f48e6fe01e80814da8f03cc4))


- **(es/minifier)** Allow TypeScript nodes to fix `styled-jsx` ([#10221](https://github.com/swc-project/swc/issues/10221)) ([9d87d4d](https://github.com/swc-project/swc/commit/9d87d4d8e4d14fd1d58a8bc04a61823367435605))

### Features



- **(es/minifier)** Default to the smallest size ([#10218](https://github.com/swc-project/swc/issues/10218)) ([800f51a](https://github.com/swc-project/swc/commit/800f51aae55be0025f8ae494b1ced7579f6f17de))

### Miscellaneous Tasks



- **(es/minifier)** Make `test.sh` faster ([#10209](https://github.com/swc-project/swc/issues/10209)) ([f28d96e](https://github.com/swc-project/swc/commit/f28d96e356d07d9d2bdb68815a0736b380b53e93))

### Refactor



- **(es/minifier)** Move some deps to dev deps ([#10216](https://github.com/swc-project/swc/issues/10216)) ([1dcdbbc](https://github.com/swc-project/swc/commit/1dcdbbc78d64f6eb52f320f50b3928e9f185bf6f))

### Testing



- **(es/minifier)** Add full tests back ([#10212](https://github.com/swc-project/swc/issues/10212)) ([e6c04b4](https://github.com/swc-project/swc/commit/e6c04b4f58ee6d7a7fca6bace5fa1ec959551873))


- **(es/minifier)** Remove `full` tests with too large input ([#10213](https://github.com/swc-project/swc/issues/10213)) ([99b590f](https://github.com/swc-project/swc/commit/99b590f869f950373bc784e9080a5321a5e96d1c))

## [1.11.10] - 2025-03-17

### Bug Fixes



- **(es/proposal)** Fix declarations for `explicit-resource-management` ([#10198](https://github.com/swc-project/swc/issues/10198)) ([99ba555](https://github.com/swc-project/swc/commit/99ba555c810a89ceae899cf612f8ee17925f5581))


- **(es/types)** Add missing types for `jsc.transform.react.refresh` ([#10206](https://github.com/swc-project/swc/issues/10206)) ([e71b000](https://github.com/swc-project/swc/commit/e71b000392a01ecb5a35ec8f0faac9cd79ff2cd1))


- **(typescript)** Skip the body of ArrowExpr in type usage analysis  ([#10187](https://github.com/swc-project/swc/issues/10187)) ([9aca205](https://github.com/swc-project/swc/commit/9aca205c770988d6483dad372028fd1928e3f5b0))

### Documentation



- **(es/minifier)** Make `minifier` example utilize comments ([#10195](https://github.com/swc-project/swc/issues/10195)) ([ec3ebe7](https://github.com/swc-project/swc/commit/ec3ebe78fff5bce29ec780e45427ede56576d7c4))

### Features



- **(es/fast-parser)** Implement the initial version ([#10185](https://github.com/swc-project/swc/issues/10185)) ([44e7c39](https://github.com/swc-project/swc/commit/44e7c39fda5d0a7cbdf9dbc3a8d9c85a24a22251))

### Miscellaneous Tasks



- **(es/minifier)** Fix lints & `size.sh` ([#10191](https://github.com/swc-project/swc/issues/10191)) ([e862c32](https://github.com/swc-project/swc/commit/e862c329fc9af61414b664e81030976bde313983))

### Performance



- **(es/minifier)** Do not repeat applying pure minifier on last ([#10196](https://github.com/swc-project/swc/issues/10196)) ([e6b7cee](https://github.com/swc-project/swc/commit/e6b7cee6cd0b4c9401981dcc9d40d758be94814b))

### Refactor



- **(es/minifier)** Remove code for infinite loop ([#10194](https://github.com/swc-project/swc/issues/10194)) ([fcc6884](https://github.com/swc-project/swc/commit/fcc68842422c0a46eee4d47956e77a727f202998))

### Testing



- **(es/minifier)** Update test inputs ([#10193](https://github.com/swc-project/swc/issues/10193)) ([97d8337](https://github.com/swc-project/swc/commit/97d83372dcc63cc68451a2a86672f8748c751600))


- **(es/minifier)** Add a benchmark for real-world inputs ([#10204](https://github.com/swc-project/swc/issues/10204)) ([97f2180](https://github.com/swc-project/swc/commit/97f2180e86323fd530bed5a274a0e50abaf81237))


- **(es/minifier)** Disable real-world benchmarks on CI ([#10205](https://github.com/swc-project/swc/issues/10205)) ([c5f1cbe](https://github.com/swc-project/swc/commit/c5f1cbe46762b9b9fa1cc27495675ae32e30c9ed))


- **(es/minifier)** Test only sizes for large inputs ([#10208](https://github.com/swc-project/swc/issues/10208)) ([bec3e3e](https://github.com/swc-project/swc/commit/bec3e3e960a7afe2f82b389bb8d9b0162d69e2b6))

## [1.11.9] - 2025-03-12

### Bug Fixes



- **(es/compat)** Hoist `arguments` in object method while lowering async functions ([#10167](https://github.com/swc-project/swc/issues/10167)) ([e764df2](https://github.com/swc-project/swc/commit/e764df24807d667e581fdc3e1018ab7491104195))


- **(es/minifier)** Check array inline for indexed with dynamic key ([#10184](https://github.com/swc-project/swc/issues/10184)) ([c2fe4bf](https://github.com/swc-project/swc/commit/c2fe4bf2d34033959070c922ce1c2d46a79de62c))

### Features



- **(es/module)** Support more `import.meta` properties ([#10179](https://github.com/swc-project/swc/issues/10179)) ([11727a6](https://github.com/swc-project/swc/commit/11727a62e4a615039d11d8cc250d53f128e40eff))


- **(ts/fast-strip)** Throw js object instead of map ([#10186](https://github.com/swc-project/swc/issues/10186)) ([2da0142](https://github.com/swc-project/swc/commit/2da0142217842bf85d84645beeafc7f706215469))

### Performance



- **(es/fast-lexer)** Optimize `read_identifier` ([#10170](https://github.com/swc-project/swc/issues/10170)) ([d97f7b2](https://github.com/swc-project/swc/commit/d97f7b233ff88405710cb3281178fd8e035c40ab))


- **(es/fast-lexer)** Use `memchr` for `skip_line_comments` ([#10173](https://github.com/swc-project/swc/issues/10173)) ([35194e3](https://github.com/swc-project/swc/commit/35194e30086de55a52ebad32474b6c571cdd0b9f))


- **(es/fast-lexer)** Use SIMD properly for string literals ([#10172](https://github.com/swc-project/swc/issues/10172)) ([be60338](https://github.com/swc-project/swc/commit/be60338267eb27c0b96c52fb32ddbf8699d4fe91))


- **(es/fast-lexer)** Add length-based fast path for keywords ([#10176](https://github.com/swc-project/swc/issues/10176)) ([1f70af8](https://github.com/swc-project/swc/commit/1f70af842e3d09614c8187685e2fc503ac1f272a))


- **(es/fast-lexer)** Optimize memory layout of cursor ([#10175](https://github.com/swc-project/swc/issues/10175)) ([aa20494](https://github.com/swc-project/swc/commit/aa204949827e7ef0cb83ab1c0ae589270fc1fd2d))


- **(es/fast-lexer)** Remove bound checks ([#10174](https://github.com/swc-project/swc/issues/10174)) ([bccdafc](https://github.com/swc-project/swc/commit/bccdafc0c394bf3979da3c6a06d974c7d2c9bcee))


- **(es/fast-lexer)** Replace PHF with static keyword lookup table ([#10181](https://github.com/swc-project/swc/issues/10181)) ([56d065e](https://github.com/swc-project/swc/commit/56d065ebcbcddd18cc9ea9406fd0de1e716318fc))


- **(es/fast-lexer)** Optimize SIMD vector initialization with initialing `u8x16` once. ([#10183](https://github.com/swc-project/swc/issues/10183)) ([435197c](https://github.com/swc-project/swc/commit/435197cc84f10095063bbc983969449653e1fc90))

## [1.11.8] - 2025-03-07

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

## [1.11.7] - 2025-03-04

### Features



- **(ts/fast-strip)** Emit json errors ([#10144](https://github.com/swc-project/swc/issues/10144)) ([740bd57](https://github.com/swc-project/swc/commit/740bd579ae8d081604be606fd69e92298a5d6862))

## [1.11.6] - 2025-03-04

### Bug Fixes



- **(es/minifier)** Fix regression due to #10056 ([#10134](https://github.com/swc-project/swc/issues/10134)) ([b145275](https://github.com/swc-project/swc/commit/b1452757f3ff0b05330578b4e7607db3ee874bd5))


- **(es/typescript)** Remove empty statements that const enum decls are folded into ([#10128](https://github.com/swc-project/swc/issues/10128)) ([7bea830](https://github.com/swc-project/swc/commit/7bea830a0e6f73ab0ba5032d13d5e58e4674bc72))

## [1.11.5] - 2025-02-28

### Bug Fixes



- **(es/lints)** Capture errors and emit from the original thread ([#10119](https://github.com/swc-project/swc/issues/10119)) ([2304cd8](https://github.com/swc-project/swc/commit/2304cd8cfd6555c57ddcf3f41a2c427387a38b4a))


- **(es/minifier)** Skip inlining if the referential identity of a function matters ([#10123](https://github.com/swc-project/swc/issues/10123)) ([c08fe8d](https://github.com/swc-project/swc/commit/c08fe8dc13ae512cf669eb25356edcd22cc36351))


- **(ts/fast-strip)** Throw object consistently ([#10122](https://github.com/swc-project/swc/issues/10122)) ([010ff2a](https://github.com/swc-project/swc/commit/010ff2af0db625f7a118b4121aff6d709ed10dc9))

### Miscellaneous Tasks



- **(deps)** Update dependency `base64` to `v0.22.1` ([#10124](https://github.com/swc-project/swc/issues/10124)) ([edea2c5](https://github.com/swc-project/swc/commit/edea2c5fa442da6a2860442eed285464edcd55c8))

### Performance



- **(es/resolver)** Remove needless allocations ([#10120](https://github.com/swc-project/swc/issues/10120)) ([f019d53](https://github.com/swc-project/swc/commit/f019d53044cba422a26f811cec43279f1f1ea6f4))

## [1.11.4] - 2025-02-27

### Bug Fixes



- **(es/decorators)** Support negative numbers ([#10114](https://github.com/swc-project/swc/issues/10114)) ([5044580](https://github.com/swc-project/swc/commit/5044580f441949c4e7c6456bcc61bbb835fecd42))


- **(es/minifier)** Fix cargo feature `debug` ([#10090](https://github.com/swc-project/swc/issues/10090)) ([48f68db](https://github.com/swc-project/swc/commit/48f68db89c5fd80c037ef9df891c60011880e7de))


- **(es/minifier)** Fix insufficient logging ([#10091](https://github.com/swc-project/swc/issues/10091)) ([9ee79c9](https://github.com/swc-project/swc/commit/9ee79c9d475823d1472011bba9ad1f8805487a52))


- **(es/minifier)** Inline before cost analysis ([#10092](https://github.com/swc-project/swc/issues/10092)) ([1425b56](https://github.com/swc-project/swc/commit/1425b5663969ef3e3f342ed7fceacaf89a729554))


- **(es/minifier)** Remove needless `println` ([b1e5b2d](https://github.com/swc-project/swc/commit/b1e5b2da1963aea75729a05a4fb0eb0e7df200b3))


- **(es/resolver)** Analyze variable declarations with `declare` ([#10102](https://github.com/swc-project/swc/issues/10102)) ([cff6a64](https://github.com/swc-project/swc/commit/cff6a64a18af26c73afd3b42cffea3c7300b369b))


- **(swc_malloc)** Fix build issue due to malloc, really ([#10117](https://github.com/swc-project/swc/issues/10117)) ([207a13f](https://github.com/swc-project/swc/commit/207a13f2ddc12503174a71c5cf0fc65fdf96c906))


- **(swc_malloc)** Add `target_env = "gnu"` check ([#10118](https://github.com/swc-project/swc/issues/10118)) ([da81e11](https://github.com/swc-project/swc/commit/da81e112df25dca8f94c18eb3d60ddc9bb63248a))


- Use `jemalloc` on platforms that `mimalloc` fails to build ([#10116](https://github.com/swc-project/swc/issues/10116)) ([fb75b98](https://github.com/swc-project/swc/commit/fb75b9827902d2ac5481357c965e2bc20075fd2e))

### Miscellaneous Tasks



- **(deps)** Update dependency `jsonc-parser` to `v0.26.2` ([#10112](https://github.com/swc-project/swc/issues/10112)) ([8c5f7ef](https://github.com/swc-project/swc/commit/8c5f7ef8cadd6f6f756957a9939f90385890ac30))

### Performance



- **(es/minifier)** Improve arrow function inlining cost analysis ([#10093](https://github.com/swc-project/swc/issues/10093)) ([e74929c](https://github.com/swc-project/swc/commit/e74929c01d2d8b9001bbc056f20ca8e1cb1c9a63))


- **(es/resolver)** Remove some vector allocations ([#10101](https://github.com/swc-project/swc/issues/10101)) ([b65387a](https://github.com/swc-project/swc/commit/b65387ac570c4bbb3b776a69bda810be862b434e))


- Use `mimalloc` on linux ([#10113](https://github.com/swc-project/swc/issues/10113)) ([3334932](https://github.com/swc-project/swc/commit/333493245d04fb5f43dff9f9306f7ec659613cd6))

### Refactor



- **(es/react)** Remove `Lrc` from `parse_expr_for_jsx` ([#10098](https://github.com/swc-project/swc/issues/10098)) ([bab7704](https://github.com/swc-project/swc/commit/bab7704032e59be1883e7429a2312551c74f678d))

## [1.11.1] - 2025-02-25

### Bug Fixes



- **(error-reporters)** Store diagnostics in `TransformOutput` ([#10027](https://github.com/swc-project/swc/issues/10027)) ([52caf23](https://github.com/swc-project/swc/commit/52caf23fbda680d35a6939a8fbb3baced982ac51))


- **(es/loader)** Fix the absolute path check when resolving modules ([#10080](https://github.com/swc-project/swc/issues/10080)) ([a3894ae](https://github.com/swc-project/swc/commit/a3894aebe5a080ed99b209af11d5740759411e7d))


- **(es/minifier)** Fix the order of match arms to inline correctly ([#10053](https://github.com/swc-project/swc/issues/10053)) ([f0f842d](https://github.com/swc-project/swc/commit/f0f842d1a72ede992e26d3debee5d3a5b72117e7))


- **(es/types)** Add `transform.verbatimModuleSyntax` ([#10079](https://github.com/swc-project/swc/issues/10079)) ([a883cdc](https://github.com/swc-project/swc/commit/a883cdc3900fa210aa0e6132ffb6c761497594c6))


- **(swc_common)** Fix build with `swc_allocator/nightly` ([#10067](https://github.com/swc-project/swc/issues/10067)) ([6a90b1f](https://github.com/swc-project/swc/commit/6a90b1fd431601e904b7ce5f18b60d36b94a5aec))

### Documentation



- **(swc_core)** Add ChangeLog for `swc_core` ([#10072](https://github.com/swc-project/swc/issues/10072)) ([608bc69](https://github.com/swc-project/swc/commit/608bc690e268e0e12a799bc78f12c4bb46c64c9a))

### Features



- **(es/ast)** Add explicit `namespace` field to distinguish namespace and module declarations ([#10023](https://github.com/swc-project/swc/issues/10023)) ([76c2cba](https://github.com/swc-project/swc/commit/76c2cba9486370e3aaf66097d0b387ce94163f56))


- **(es/ast)** Add import attributes to `TsImportType` ([#9796](https://github.com/swc-project/swc/issues/9796)) ([7d297be](https://github.com/swc-project/swc/commit/7d297bedf5518797776f18b70ea304981419368b))


- **(es/minifier)** Inline across side-effect-free member exprs, ([#10056](https://github.com/swc-project/swc/issues/10056)) ([19d01d7](https://github.com/swc-project/swc/commit/19d01d718aeb7a211384944dd2d9858cc4f04da2))


- **(es/minifier)** Make seq inliner inline into var without init ([#10077](https://github.com/swc-project/swc/issues/10077)) ([c4a839b](https://github.com/swc-project/swc/commit/c4a839b6bd16627415500cb3eab4857f08e156b6))


- **(es/visit)** Introduce core-only visitors ([#10049](https://github.com/swc-project/swc/issues/10049)) ([bc666be](https://github.com/swc-project/swc/commit/bc666be26cc2251572f4feb756195aef01e35097))


- **(swc_allocator)** Provide allocators ([#10061](https://github.com/swc-project/swc/issues/10061)) ([d4362f7](https://github.com/swc-project/swc/commit/d4362f7183ed716fafcce5ffbe7d81f16de16bad))

### Miscellaneous Tasks



- **(deps)** Update dependency swc-plugin-coverage-instrument to ^0.0.26 ([#10051](https://github.com/swc-project/swc/issues/10051)) ([d3fbd21](https://github.com/swc-project/swc/commit/d3fbd21acd3b3e4e315d5299b4430264b46e1f7c))


- **(swc_allocator)** Remove `nightly` from default feature ([#10058](https://github.com/swc-project/swc/issues/10058)) ([e78b9d1](https://github.com/swc-project/swc/commit/e78b9d11d820fb9a775077ef1caf9067657ef2d3))


- **(swc_allocator)** Add `#[inline]` to allocator methods ([#10066](https://github.com/swc-project/swc/issues/10066)) ([853eb53](https://github.com/swc-project/swc/commit/853eb53d62b8c5684b846dd095b93a73f8d9a7b4))

### Performance



- **(es/lints)** Remove needless locks ([#10086](https://github.com/swc-project/swc/issues/10086)) ([43458e9](https://github.com/swc-project/swc/commit/43458e91eeb276d4c0603c95da6960e4439747be))


- **(es/minifier)** Prevent double boxing ([#10074](https://github.com/swc-project/swc/issues/10074)) ([29bd286](https://github.com/swc-project/swc/commit/29bd286dea65dd934c217b31d419c79b7c15767d))

### Refactor



- **(atoms)** Rename `FastAtom` to `UnsafeAtom` ([#10070](https://github.com/swc-project/swc/issues/10070)) ([1771222](https://github.com/swc-project/swc/commit/1771222440773376351ab89cdda4c14cfc50f462))


- **(atoms)** Remove `JsWord` alias ([#10071](https://github.com/swc-project/swc/issues/10071)) ([f33b0bc](https://github.com/swc-project/swc/commit/f33b0bc2d1474232f608847a6a26eaa068f2c106))


- **(es/minifier)** Remove `CompileUnit` to simplify ([#10055](https://github.com/swc-project/swc/issues/10055)) ([c75578b](https://github.com/swc-project/swc/commit/c75578be5b11558ea9f1aec6270834cd17d3737a))

## [1.10.18] - 2025-02-19

### Bug Fixes



- **(hstr)** Prevent memory leak for global stores ([#10047](https://github.com/swc-project/swc/issues/10047)) ([4718bc0](https://github.com/swc-project/swc/commit/4718bc0df9dd3285442f0dcf3b9709d8440703e5))

### Miscellaneous Tasks



- **(es/minifier)** Make `minify-all` example ignore parsing errors ([#10045](https://github.com/swc-project/swc/issues/10045)) ([6c7ec46](https://github.com/swc-project/swc/commit/6c7ec46ee423d745305204460f15450c897a90a9))

### Build



- **(es)** Select optimization level for each crates ([#10046](https://github.com/swc-project/swc/issues/10046)) ([c28d494](https://github.com/swc-project/swc/commit/c28d4942c513c4dad8bc69e1c6ca2679132b58f6))

## [1.10.17] - 2025-02-18

### Bug Fixes



- **(deps)** Update cargo (patch) ([#10021](https://github.com/swc-project/swc/issues/10021)) ([ffb7734](https://github.com/swc-project/swc/commit/ffb77342d977722c6afa93ac5c8959e2152ea11c))


- **(typescript)** Improve type inferring for undefined and null ([#10038](https://github.com/swc-project/swc/issues/10038)) ([5059ece](https://github.com/swc-project/swc/commit/5059ece95a2bf941779213e34dd18997d16a7140))


- **(typescript)** Remove the usages of private members ([#10037](https://github.com/swc-project/swc/issues/10037)) ([8410b59](https://github.com/swc-project/swc/commit/8410b596218bfea290751ed40e29fcea8626d0dc))

### Performance



- **(hstr)** Use thin arc for hash and length ([#10033](https://github.com/swc-project/swc/issues/10033)) ([2bea793](https://github.com/swc-project/swc/commit/2bea793bf39c53a5c36b8ccdd274ca93bf1ff1ed))


- **(hstr)** Skip interning if the text is long enough ([#10035](https://github.com/swc-project/swc/issues/10035)) ([2622e4e](https://github.com/swc-project/swc/commit/2622e4e1d0263a6a10b6cd47cba3f4e50d697c32))

### Testing



- **(hstr)** Add tests ([#10043](https://github.com/swc-project/swc/issues/10043)) ([32b58f0](https://github.com/swc-project/swc/commit/32b58f0b21bba8c32ea21d3c03d068c7fe260669))


- **(ts/fast-strip)** Add tests for `declare module` error cases ([#10040](https://github.com/swc-project/swc/issues/10040)) ([37672e0](https://github.com/swc-project/swc/commit/37672e024e340b1509f4d8f70414bc132a8337bf))

## [1.10.16] - 2025-02-13

### Bug Fixes



- **(es/minifier)** Check assign target before merge assign cond ([#10020](https://github.com/swc-project/swc/issues/10020)) ([6dab49a](https://github.com/swc-project/swc/commit/6dab49a07c5f0853fd6200a7ee153e66a7b8dcdc))


- **(es/parser)** Preserve comment positions with leading semicolon ([#10019](https://github.com/swc-project/swc/issues/10019)) ([c9937b6](https://github.com/swc-project/swc/commit/c9937b65bfdaeb2ad9b8fe72943053ac5fe767c5))


- **(swc_common)** Fix panic with non-narrow chars with width != 2 ([#10011](https://github.com/swc-project/swc/issues/10011)) ([f9f4cac](https://github.com/swc-project/swc/commit/f9f4cac0e5ae586f0d3cbd3c8f4db8f79ff67e17))


- **(ts/fast-strip)** Handle unsupported `module` keyword ([#10022](https://github.com/swc-project/swc/issues/10022)) ([308f5d0](https://github.com/swc-project/swc/commit/308f5d03c735649ec81d73ec6b785cd68345a04c))

### Performance



- **(es/codegen)** Reduce allocation using `compact_str` ([#10008](https://github.com/swc-project/swc/issues/10008)) ([7d7319f](https://github.com/swc-project/swc/commit/7d7319f248afe10f33da2a7201c1a90ec58a441c))

## [1.10.15] - 2025-02-08

### Bug Fixes



- **(es/fixer)** Wrap object tagged templates ([#9991](https://github.com/swc-project/swc/issues/9991)) ([963c3a5](https://github.com/swc-project/swc/commit/963c3a58c8ec05a381b61724ee9930093cf65b8f))


- **(es/minifier)** Dont't optimize swtich case before DCE ([#9994](https://github.com/swc-project/swc/issues/9994)) ([afe21b5](https://github.com/swc-project/swc/commit/afe21b5e71edb8cee5ba4335a193fb8a309bb43b))


- **(es/minifier)** Revert #10006 ([#10007](https://github.com/swc-project/swc/issues/10007)) ([7e21323](https://github.com/swc-project/swc/commit/7e21323b3bedc0552634da5d6c34f33fb2c5bad6))


- **(es/parser, es/codegen)** Handle trailing empty slots in array patterns ([#9992](https://github.com/swc-project/swc/issues/9992)) ([1a87e76](https://github.com/swc-project/swc/commit/1a87e76e95566eb998bf81bde1e77dc14eb42fda))


- **(es/react)** Avoid adding `__self` in constructors of derived class in the `jsx_self` ([#9987](https://github.com/swc-project/swc/issues/9987)) ([83f24af](https://github.com/swc-project/swc/commit/83f24afad9114801c897d04bfa7a1525c92686c1))

### Features



- **(es/ast)** Add `ShrinkToFit` implementation ([#10009](https://github.com/swc-project/swc/issues/10009)) ([6849b6a](https://github.com/swc-project/swc/commit/6849b6aba764b06674783f6c0a7d2f26350ea5fe))


- **(es/helpers)** Update package exports for module-sync and webpack compatibility ([#9995](https://github.com/swc-project/swc/issues/9995)) ([6f4e7ad](https://github.com/swc-project/swc/commit/6f4e7adce4b476ee33ea8a9a1aa333cbf80c85cc))


- **(fast-ts)** Support Uint8Array Input ([#9879](https://github.com/swc-project/swc/issues/9879)) ([61ae579](https://github.com/swc-project/swc/commit/61ae579a1c7c588244317320da42a03541a7f801))

### Performance



- **(es/codegen)** Remove needless allocations ([#9978](https://github.com/swc-project/swc/issues/9978)) ([9c89d57](https://github.com/swc-project/swc/commit/9c89d57cf9f3cd409e003f7b667afc9c87916359))


- **(es/minifier)** Do not clone from `take_ident_of_pat_if_unused` ([#10005](https://github.com/swc-project/swc/issues/10005)) ([dc3b46e](https://github.com/swc-project/swc/commit/dc3b46eff9befa898a777308d8588b1ff37e577a))


- **(es/minifier)** Allocate in once from `mark_property_mutation` ([#10004](https://github.com/swc-project/swc/issues/10004)) ([4a90e51](https://github.com/swc-project/swc/commit/4a90e5197d337ba1d0851908053d0ad13b17f907))


- **(es/minifier)** Limit infection analysis by the entry size ([#10006](https://github.com/swc-project/swc/issues/10006)) ([1a3a4b9](https://github.com/swc-project/swc/commit/1a3a4b936cca1db646a40c0813a7a1275832b604))


- **(es/minifier)** Make the default pass 2 ([#10014](https://github.com/swc-project/swc/issues/10014)) ([07dc423](https://github.com/swc-project/swc/commit/07dc423b7f7ee11753338e8a98a65aef087c3468))

## [1.10.14] - 2025-02-03

### Bug Fixes



- **(deps)** Update cargo (patch) ([#9971](https://github.com/swc-project/swc/issues/9971)) ([e9843d8](https://github.com/swc-project/swc/commit/e9843d8bb730ebdfca42108585c2e013f96fd612))


- **(es/transforms)** Pass `unresolved_mark` to `simplifier` instead of `top_level_mark` ([#9989](https://github.com/swc-project/swc/issues/9989)) ([963b088](https://github.com/swc-project/swc/commit/963b0881f9e027fd9ca6ed7b59a3b1f284bf688e))


- **(swc_core)** Fix typo in swc_core feature ([#9979](https://github.com/swc-project/swc/issues/9979)) ([99a6339](https://github.com/swc-project/swc/commit/99a63397b65dfe02bc2c864069edbffb84efa510))

### Features



- **(ts/fast-strip)** Support type-only/uninstantiated namespaces ([#9983](https://github.com/swc-project/swc/issues/9983)) ([a72c6fa](https://github.com/swc-project/swc/commit/a72c6fa28cea8c9e2bc0d85fbf4909ed03f4d344))


- Add (experimental) nodejs interop crates ([#9974](https://github.com/swc-project/swc/issues/9974)) ([37e0ea5](https://github.com/swc-project/swc/commit/37e0ea5697c657582e132aa5fe86837c2e86cae6))


- Add (experimental) `js-interop` npm package ([#9975](https://github.com/swc-project/swc/issues/9975)) ([eebb0ea](https://github.com/swc-project/swc/commit/eebb0ea14fa2061fd721992c0fc31734fe9d1e42))

### Performance



- Update `rustc-hash` to `v2` and drop `ahash` ([#9982](https://github.com/swc-project/swc/issues/9982)) ([6765db0](https://github.com/swc-project/swc/commit/6765db0dfef953d841fe414480c7c635d740dbd7))

## [1.10.12] - 2025-01-29

### Bug Fixes



- **(es/parser)** Remove wrong check about `const` without init ([#9970](https://github.com/swc-project/swc/issues/9970)) ([1b57261](https://github.com/swc-project/swc/commit/1b572617f36b9eb02b8dd7002bd2374a0cc8e2b1))

### Performance



- **(es/minifier)** Make analyzer not call `collect_infects_from` recursively ([#9924](https://github.com/swc-project/swc/issues/9924)) ([37616c3](https://github.com/swc-project/swc/commit/37616c33bf877845afe55c9fc0d21ccbbf59bad3))


- **(es/minifier)** Skip complex inline operations if possible ([#9972](https://github.com/swc-project/swc/issues/9972)) ([772cc30](https://github.com/swc-project/swc/commit/772cc309cc0ff677ebe415b1745cfcb55fe12c03))


- **(es/minifier)** Merge binding analyzer into infection analyzer ([#9973](https://github.com/swc-project/swc/issues/9973)) ([ca8a71f](https://github.com/swc-project/swc/commit/ca8a71f523f94fdfb866f10c470cc3dea2fd1f9c))

## [1.10.11] - 2025-01-27

### Bug Fixes



- **(es)** Restore JSON config & Adjust feature renaming ([#9967](https://github.com/swc-project/swc/issues/9967)) ([72e5455](https://github.com/swc-project/swc/commit/72e545575bea0a12614889861d839578581af170))


- **(es/minifier)** Avoid paren when compressing ternary ([#9920](https://github.com/swc-project/swc/issues/9920)) ([9d6fe37](https://github.com/swc-project/swc/commit/9d6fe370cff502b00245c409bbbc9a3d00e622fe))


- **(es/parser)** Parse `yield<T> (v: T)=>v` ([#9915](https://github.com/swc-project/swc/issues/9915)) ([04333aa](https://github.com/swc-project/swc/commit/04333aacfeded1f1d21c167c4cdc6bce7b0eaf23))


- **(ts/fast-strip)** More robust generic arrow handling ([#9913](https://github.com/swc-project/swc/issues/9913)) ([f7faa7c](https://github.com/swc-project/swc/commit/f7faa7c08c65f6cc453ded39834077e9ae7c7b91))


- **(typescript)** Allow references to the global Symbol in computed property names under `isolatedDeclarations` ([#9869](https://github.com/swc-project/swc/issues/9869)) ([e4c1e03](https://github.com/swc-project/swc/commit/e4c1e03e1775065be98b4bc230725b5b745f8843))

### Features



- **(es/minifier)** Compress negate eq ([#9911](https://github.com/swc-project/swc/issues/9911)) ([e8f23cf](https://github.com/swc-project/swc/commit/e8f23cf92146828ea2a8b65724c7a6824acf9f0f))


- **(es/minifier)** Compress Assign to number ([#9943](https://github.com/swc-project/swc/issues/9943)) ([d5f40a0](https://github.com/swc-project/swc/commit/d5f40a0bc00df0cfb850a5989b15efb7467f3303))


- **(parallel)** Add `merge_in_parallel` ([#9939](https://github.com/swc-project/swc/issues/9939)) ([c5b8390](https://github.com/swc-project/swc/commit/c5b8390d622eb58badb22d49176e47ddcadf8559))


- Merge `hstr` into the main repository ([#9963](https://github.com/swc-project/swc/issues/9963)) ([bc61c13](https://github.com/swc-project/swc/commit/bc61c1317f9dc8128557d4c92799877dca2d87dc))

### Miscellaneous Tasks



- **(es/minifier)** Add a script for samply profiler ([#9923](https://github.com/swc-project/swc/issues/9923)) ([8f8dcaa](https://github.com/swc-project/swc/commit/8f8dcaac2f22f71de538802034db5756e84c7f55))


- **(preset-env)** Update `browserslist-rs` ([#9918](https://github.com/swc-project/swc/issues/9918)) ([606ffe5](https://github.com/swc-project/swc/commit/606ffe51ea8c4108878264da3934ec3edd8f4ff7))

### Performance



- **(es/react)** Use proper string types for react configuration ([#9949](https://github.com/swc-project/swc/issues/9949)) ([1bf837e](https://github.com/swc-project/swc/commit/1bf837e4764f57656b4fb43642d4fdda464504f6))


- **(es/utils)** Prevent too many recursion ([#9931](https://github.com/swc-project/swc/issues/9931)) ([d24f785](https://github.com/swc-project/swc/commit/d24f785a5cc9c9e80f090e7488d326a73b8c3677))


- **(es/utils)** Restrict recursion of `get_type` ([#9933](https://github.com/swc-project/swc/issues/9933)) ([1781b85](https://github.com/swc-project/swc/commit/1781b85ddb68e148b9662f52d670476f6c1a9b3a))


- **(preset-env)** Store `Versions` in `Arc` ([#9950](https://github.com/swc-project/swc/issues/9950)) ([03dffb5](https://github.com/swc-project/swc/commit/03dffb50fb92b3774e23735cb9f08c0cbe1fd630))

### Refactor



- **(es/minifier)** Make `minify-all` example sequential ([#9912](https://github.com/swc-project/swc/issues/9912)) ([5b5c87e](https://github.com/swc-project/swc/commit/5b5c87e72480638ae382d519980302702e333305))


- **(hstr)** Remove needless operations ([#9964](https://github.com/swc-project/swc/issues/9964)) ([6f781d8](https://github.com/swc-project/swc/commit/6f781d8fd49f40bab300907eee8227a0a9d434b9))


- **(swc)** Remove typo feature ([#9965](https://github.com/swc-project/swc/issues/9965)) ([4b14eec](https://github.com/swc-project/swc/commit/4b14eecabf51b3185103f32723742546b1cee953))


- Apply all pending breaking changes ([#9966](https://github.com/swc-project/swc/issues/9966)) ([1c2f7e9](https://github.com/swc-project/swc/commit/1c2f7e9db7a12ba55875d99e896328db2af62c0f))

## [1.10.9] - 2025-01-21

### Bug Fixes



- **(es/minifier)** Set param type to unknown ([#9905](https://github.com/swc-project/swc/issues/9905)) ([09b3b37](https://github.com/swc-project/swc/commit/09b3b371f93ca603c61992eca3e44208cd857dc5))

### Documentation



- **(es/parallel)** Improve document of `Parallel` ([#9896](https://github.com/swc-project/swc/issues/9896)) ([9962c9c](https://github.com/swc-project/swc/commit/9962c9c98d8a30623b4680303e398ae57da6d6a9))

### Features



- **(es/minifier)** Print total size from `minify-all` example ([#9897](https://github.com/swc-project/swc/issues/9897)) ([134000f](https://github.com/swc-project/swc/commit/134000fe93029c3af887726e5be6da1fd812e330))


- **(es/minifier)** Turn `1 * v` into `+v` ([#9903](https://github.com/swc-project/swc/issues/9903)) ([a228347](https://github.com/swc-project/swc/commit/a2283475b1b8f770e113806590f4959550f89f31))


- **(es/minifier)** Compress `foo ? num : 0` into `num * !!foo` ([#9908](https://github.com/swc-project/swc/issues/9908)) ([ce22557](https://github.com/swc-project/swc/commit/ce22557a0512e9263cb316116e5262757d884479))

### Miscellaneous Tasks



- **(es/minifier)** Print slow files from `minify-all` example ([#9899](https://github.com/swc-project/swc/issues/9899)) ([2d87b89](https://github.com/swc-project/swc/commit/2d87b897e6f62e07aee3b0741d3e961190986763))

### Performance



- **(es/minifier)** Make character frequency analysis parallel ([#9895](https://github.com/swc-project/swc/issues/9895)) ([ca2fd1e](https://github.com/swc-project/swc/commit/ca2fd1ebdf94270efdb319379551de31f41428a2))


- **(es/minifier)** Parallelize handling of class members ([#9900](https://github.com/swc-project/swc/issues/9900)) ([ed74839](https://github.com/swc-project/swc/commit/ed748394be54b9e4e212717007b430aa169667e9))


- **(es/minifier)** Adjust threshold for parallel char frequency calculation ([#9901](https://github.com/swc-project/swc/issues/9901)) ([47ea8de](https://github.com/swc-project/swc/commit/47ea8de2777051bce249f666b10580f168d8d72a))


- **(es/minifier)** Do heavy operation only if required ([#9902](https://github.com/swc-project/swc/issues/9902)) ([2687231](https://github.com/swc-project/swc/commit/26872310f60d4de40e717cd30e7bf856bad3edba))


- **(es/minifier)** Cache `var_or_default` calls ([#9909](https://github.com/swc-project/swc/issues/9909)) ([4a3be8d](https://github.com/swc-project/swc/commit/4a3be8d60b1ad49d723a5e102264ec3284603638))


- **(es/minifier)** Invert cache to be really a cache ([#9910](https://github.com/swc-project/swc/issues/9910)) ([8bfb0e5](https://github.com/swc-project/swc/commit/8bfb0e5edd51934dff37fe70136b73d5301a4e41))

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



- **(es/minifier)** Ignore using declarations ([#9598](https://github.com/swc-project/swc/issues/9598)) ([1659c21](https://github.com/swc-project/swc/commit/1659c212b2edf1505def54b7222b3b6a633de3dc))

<!-- generated by git-cliff -->
