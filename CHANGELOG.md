# Changelog
## [1.15.30] - 2026-04-19

### Bug Fixes



- **(deploy)** Fix musl binding test workflow ([#11804](https://github.com/swc-project/swc/issues/11804)) ([c30a522](https://github.com/swc-project/swc/commit/c30a5226920311a26f2b9692d057a50b18266d30))


- **(deploy)** Build package ts before Linux GNU binding tests ([#11806](https://github.com/swc-project/swc/issues/11806)) ([a3d3ef3](https://github.com/swc-project/swc/commit/a3d3ef3924a80e19101a9735bf357ac14cd68fbc))


- **(es/jsx)** Preserve quoted JSX attribute newlines ([#11796](https://github.com/swc-project/swc/issues/11796)) ([9fe56c8](https://github.com/swc-project/swc/commit/9fe56c88553bb79254a7a5e991bfedc5f6c689e1))


- **(es/minifier)** Support full ES version parsing in minify ([#11800](https://github.com/swc-project/swc/issues/11800)) ([af1f08f](https://github.com/swc-project/swc/commit/af1f08f09e749392815f0449ffac2bdd62a5b0e3))


- **(es/module)** Add opt-in symlink-preserving resolver ([#11801](https://github.com/swc-project/swc/issues/11801)) ([6028240](https://github.com/swc-project/swc/commit/6028240017608aac8d80d2c1ff37cf9f13534af6))


- **(es/parser)** Allow return type annotation on Flow constructors ([#11790](https://github.com/swc-project/swc/issues/11790)) ([d66b29c](https://github.com/swc-project/swc/commit/d66b29c11d7e9709906e7c6ba6a98fcde428ca65))


- **(es/parser)** Support Flow anonymous keyof indexers ([#11792](https://github.com/swc-project/swc/issues/11792)) ([452c4e5](https://github.com/swc-project/swc/commit/452c4e59e6230e36ab2ef19608d214b72d3baf72))


- **(es/parser)** Add Flow strip RN and RNW regression corpus ([#11799](https://github.com/swc-project/swc/issues/11799)) ([23a9109](https://github.com/swc-project/swc/commit/23a9109396dc1fcd496e2fbf90552fce0d5ca55b))

### Documentation



- Require PR template for pull requests ([#11793](https://github.com/swc-project/swc/issues/11793)) ([3a1084a](https://github.com/swc-project/swc/commit/3a1084ad1860afdbea2703f13030c3baaaf778db))

### Features



- **(es/minify)** Support extracting comments ([#11798](https://github.com/swc-project/swc/issues/11798)) ([5986411](https://github.com/swc-project/swc/commit/5986411655d7b9e3a1d4e401de9fbda94164c0a3))

## [1.15.26] - 2026-04-14

### Bug Fixes



- **(es/decorators)** Preserve super in moved static members ([#11781](https://github.com/swc-project/swc/issues/11781)) ([778328e](https://github.com/swc-project/swc/commit/778328e5b40232b311e33e0dede4f1f53e523c4a))


- **(es/decorators)** Scope moved static super rewrite ([#11782](https://github.com/swc-project/swc/issues/11782)) ([f73cacc](https://github.com/swc-project/swc/commit/f73cacca16c628cf59820eddb6594fd08f124d6d))


- **(es/parser)** Parse mixed Flow anonymous callable params ([#11786](https://github.com/swc-project/swc/issues/11786)) ([05e7b69](https://github.com/swc-project/swc/commit/05e7b69373d3b1e4957f557cb3d640b59998d8a7))


- **(es/transforms)** Rewrite class references in non-static members ([#11772](https://github.com/swc-project/swc/issues/11772)) ([fff1426](https://github.com/swc-project/swc/commit/fff1426c86cd47d0d879c5e7c4f029c4adb132e7))


- **(es/typescript)** Handle TypeScript expressions in enum transformation ([#11769](https://github.com/swc-project/swc/issues/11769)) ([85aa4a8](https://github.com/swc-project/swc/commit/85aa4a8b95f08d97df47d11f5c2fd11f7db97381))

### Documentation



- Document Flow strip support ([#11778](https://github.com/swc-project/swc/issues/11778)) ([8f176cc](https://github.com/swc-project/swc/commit/8f176cc907093bc80c6792744ea215b69ff62efb))

### Features



- **(swc_common)** Add SourceMapper.map_raw_pos ([#11777](https://github.com/swc-project/swc/issues/11777)) ([7d2e94c](https://github.com/swc-project/swc/commit/7d2e94ce379ba8fc738a5697299cdb9a3c748e8a))


- **(swc_config)** Add Hash/Eq for options and CachedRegex ([#11775](https://github.com/swc-project/swc/issues/11775)) ([86a4c38](https://github.com/swc-project/swc/commit/86a4c383b8da40a53bad1b1b5098227d3087927c))

### Performance



- **(swc)** Use larger input for es/full benchmarks ([#11779](https://github.com/swc-project/swc/issues/11779)) ([4409920](https://github.com/swc-project/swc/commit/44099207878c2e7f6ec75379040402057ad4f97b))

### Refactor



- **(es/minifier)** Inline into shorthand prop early ([#11766](https://github.com/swc-project/swc/issues/11766)) ([450bdfa](https://github.com/swc-project/swc/commit/450bdfa14f61ca008f5399d7292d5d9bc5e07380))

### Build



- Update `rustc` to `nightly-2026-04-10` ([#11783](https://github.com/swc-project/swc/issues/11783)) ([6facc79](https://github.com/swc-project/swc/commit/6facc79dc4022e9a31dcb1c7e8952917f88867e9))

## [1.15.24] - 2026-04-04

### Bug Fixes



- **(es/decorators)** Scope 2023-11 implicit-global rewrite to decorator-lifted exprs ([#11743](https://github.com/swc-project/swc/issues/11743)) ([1c01bbb](https://github.com/swc-project/swc/commit/1c01bbb46ddb33b380b8216235c1e6f2767d0aae))


- **(es/minifier)** Handle `toExponential(undefined)` ([#11583](https://github.com/swc-project/swc/issues/11583)) ([cd94a31](https://github.com/swc-project/swc/commit/cd94a3141621cec617dac7e84c50070cd598ec46))


- **(es/minifier)** Cap deep if_return conditional chains ([#11758](https://github.com/swc-project/swc/issues/11758)) ([a92fa3e](https://github.com/swc-project/swc/commit/a92fa3e8e27f604186a2393284d3deb67a9146f1))


- **(es/minifier)** Inline prop shorthand in computed props ([#11760](https://github.com/swc-project/swc/issues/11760)) ([71feafb](https://github.com/swc-project/swc/commit/71feafb4bc79883a558164e9543ae4ecedc9187e))


- **(es/parser)** Parse key Flow forms from #11729 (phase 1) ([#11733](https://github.com/swc-project/swc/issues/11733)) ([886fe53](https://github.com/swc-project/swc/commit/886fe533ad7edfb13804be3a779eccb160cf69e7))


- **(es/parser)** Close remaining Flow parser gaps for #11729 (phase 2) ([#11740](https://github.com/swc-project/swc/issues/11740)) ([8d36f05](https://github.com/swc-project/swc/commit/8d36f05499f7e2cc5c568227d05e5f912e01509b))


- **(es/regexp)** Preserve source for wrapped named groups ([#11757](https://github.com/swc-project/swc/issues/11757)) ([7e56fe5](https://github.com/swc-project/swc/commit/7e56fe5cb4dfc3fc1758e2139949107d5eaa8e47))


- **(html/codegen)** Keep </p> for span-parent paragraphs ([#11756](https://github.com/swc-project/swc/issues/11756)) ([ede9950](https://github.com/swc-project/swc/commit/ede9950d35cdd4968331ac0111cdb413e60f3438))


- **(swc_common)** Make `eat_byte` unsafe to prevent UTF-8 boundary violation ([#11731](https://github.com/swc-project/swc/issues/11731)) ([669a659](https://github.com/swc-project/swc/commit/669a659c6e29c12eba793e646c6b29002782a84c))

### Features



- **(es/minifier)** Remove useless arguments for non inlined callee ([#11645](https://github.com/swc-project/swc/issues/11645)) ([bab249e](https://github.com/swc-project/swc/commit/bab249ef031f71ebe4089b15a03b435d7258e895))


- **(react-compiler)** Advance SWC parity for upstream fixtures ([#11724](https://github.com/swc-project/swc/issues/11724)) ([468da70](https://github.com/swc-project/swc/commit/468da70bbdf876e44155fda09cbca7ee939fa68f))


- **(react-compiler)** Tighten core validation parity for upstream fixtures ([#11734](https://github.com/swc-project/swc/issues/11734)) ([7e2cf8d](https://github.com/swc-project/swc/commit/7e2cf8d46a6f41967b93858d9f3269ae46370d14))


- **(react-compiler)** Improve SWC parity for early-return and hooks validation ([#11738](https://github.com/swc-project/swc/issues/11738)) ([4739c58](https://github.com/swc-project/swc/commit/4739c586d0deb88d3d536835adb873b9c036bef5))


- **(react-compiler)** M1 memo validators + lint gating alignment ([#11739](https://github.com/swc-project/swc/issues/11739)) ([7e1ad26](https://github.com/swc-project/swc/commit/7e1ad26b49295085208c2e4ddfb175c479da53bc))


- **(react-compiler)** Improve Stage A diagnostic parity and validation aggregation ([#11745](https://github.com/swc-project/swc/issues/11745)) ([0e2075e](https://github.com/swc-project/swc/commit/0e2075e4addc9771dbe5388b6d30fd4344308bd1))


- **(react-compiler)** Continue swc parity for dependency handling ([#11747](https://github.com/swc-project/swc/issues/11747)) ([83688c8](https://github.com/swc-project/swc/commit/83688c8af8695b895d871a4d6d9530d89fcba2a9))

### Refactor



- **(es/minifier)** Inline usage analyzer and remove crate ([#11750](https://github.com/swc-project/swc/issues/11750)) ([7d8d11b](https://github.com/swc-project/swc/commit/7d8d11b53ad046cafce6aff76672df41ad276615))


- **(react-compiler)** Remove compiler impl and keep fast_check ([#11753](https://github.com/swc-project/swc/issues/11753)) ([f21d336](https://github.com/swc-project/swc/commit/f21d33629033f305d300d91982d0a87bc807e427))

### Ci



- Add manual Publish crates workflow ([#11763](https://github.com/swc-project/swc/issues/11763)) ([169c961](https://github.com/swc-project/swc/commit/169c96107357653fa0d1c0feb715aa2312481e0a))


- Add misc npm publish workflow ([#11764](https://github.com/swc-project/swc/issues/11764)) ([236eff0](https://github.com/swc-project/swc/commit/236eff01dd30e780596ed33704b85bf91491bc10))

## [1.15.21] - 2026-03-22

### Bug Fixes



- **(cli)** Honor externalHelpers=false in rust binary ([#11693](https://github.com/swc-project/swc/issues/11693)) ([1be052e](https://github.com/swc-project/swc/commit/1be052e36154ed0382aeb93a4ff8f9e441ffbdca))


- **(cli)** Skip mkdir when --out-file targets the current directory ([#11720](https://github.com/swc-project/swc/issues/11720)) ([f3f4e51](https://github.com/swc-project/swc/commit/f3f4e51cedb3051a7c75c0cdecaa17e1d276597f))


- **(es/decorators)** Resolve 2022-03 issues #9565/#9078/#9079 and add regressions ([#11698](https://github.com/swc-project/swc/issues/11698)) ([a025d2b](https://github.com/swc-project/swc/commit/a025d2bc2fa482b675084f5802865cd02c8b63c4))


- **(es/fixer)** Wrap new opt chain ([#11618](https://github.com/swc-project/swc/issues/11618)) ([fdcd184](https://github.com/swc-project/swc/commit/fdcd184a2ad3295015faf51fde62dbe4b700515e))


- **(es/flow)** Normalize module await bindings for Hermes parity ([#11703](https://github.com/swc-project/swc/issues/11703)) ([73d8761](https://github.com/swc-project/swc/commit/73d87616f5db5146fac774cd60d5ec18195140c3))


- **(es/minifier)** Fix compatibility for Wasm plugin (`swc_ast_unknown`) ([#11641](https://github.com/swc-project/swc/issues/11641)) ([abd0e45](https://github.com/swc-project/swc/commit/abd0e45fb9cee9f79fb58d3a520f9ff92ecf4566))


- **(es/module)** Preserve explicit index.js import path when baseUrl is set ([#11597](https://github.com/swc-project/swc/issues/11597)) ([830dbeb](https://github.com/swc-project/swc/commit/830dbeb44f3bf6faf807808d596d970442b6e6e3))


- **(es/module)** Avoid rewriting unknown relative extensions ([#11713](https://github.com/swc-project/swc/issues/11713)) ([ed09218](https://github.com/swc-project/swc/commit/ed092184839057467702976ad43ed4e3f902dc6b))


- **(es/regexp)** Implement transform-named-capturing-groups-regex ([#11642](https://github.com/swc-project/swc/issues/11642)) ([f62bfa9](https://github.com/swc-project/swc/commit/f62bfa90701cdcfe87af082d5104f0c1e2dd7e0d))


- **(es/types)** Add new options types ([#11683](https://github.com/swc-project/swc/issues/11683)) ([62eeee1](https://github.com/swc-project/swc/commit/62eeee15324a6aa25a2e17d497f1d41900cbac99))


- **(malloc)** Fallback to system allocator on linux gnu s390x/powerpc ([#11606](https://github.com/swc-project/swc/issues/11606)) ([e103fac](https://github.com/swc-project/swc/commit/e103facd4451349478efbaf8caaf89294d4780f9))


- Update lz4_flex to resolve RUSTSEC-2026-0041 ([#11701](https://github.com/swc-project/swc/issues/11701)) ([7528507](https://github.com/swc-project/swc/commit/7528507bc6d3fb723742e62abb156d510fba1329))

### Documentation



- **(agents)** Improve guidance ([#11626](https://github.com/swc-project/swc/issues/11626)) ([1cdfec9](https://github.com/swc-project/swc/commit/1cdfec9f298d0979f40d2be5a227ea4dc973138b))


- **(agents)** Add AGENTS two-pass rules for es crates ([#11634](https://github.com/swc-project/swc/issues/11634)) ([12af4a1](https://github.com/swc-project/swc/commit/12af4a1fcffff0bcefaa5ca766914d1aae2c7847))


- Move parser design guidance into AGENTS.md ([#11600](https://github.com/swc-project/swc/issues/11600)) ([e6e91a3](https://github.com/swc-project/swc/commit/e6e91a3d525774fb3453ebda64793d3d253771b5))


- Clarify workaround comment requirement in AGENTS ([#11700](https://github.com/swc-project/swc/issues/11700)) ([e2ad6f6](https://github.com/swc-project/swc/commit/e2ad6f61c882b6b302d886268170560087cd5684))

### Features



- **(bindings)** Add linux ppc64le and s390x support across npm bindings ([#11602](https://github.com/swc-project/swc/issues/11602)) ([357255d](https://github.com/swc-project/swc/commit/357255d56d4cc61b55be27a4b052f2f3019d018d))


- **(bindings)** Enable flow strip support in @swc/core ([#11696](https://github.com/swc-project/swc/issues/11696)) ([93da89a](https://github.com/swc-project/swc/commit/93da89a272408ec5d4cf43d9c087774794661657))


- **(cli)** Enable Flow strip support in swc_cli_impl ([#11705](https://github.com/swc-project/swc/issues/11705)) ([0ea9950](https://github.com/swc-project/swc/commit/0ea99502686a43bf33c397ef47fad344de78abb9))


- **(dbg-swc)** Add flow strip verification command ([#11706](https://github.com/swc-project/swc/issues/11706)) ([77b7854](https://github.com/swc-project/swc/commit/77b7854046b584a933935b9252fd6df183828409))


- **(es)** Add `swc_es_codegen` for `swc_es_ast` ([#11628](https://github.com/swc-project/swc/issues/11628)) ([c282d86](https://github.com/swc-project/swc/commit/c282d8616b4626ba880096e356ad1200108def9e))


- **(es)** Add 2-pass transformer and minifier crates ([#11632](https://github.com/swc-project/swc/issues/11632)) ([f70a4b7](https://github.com/swc-project/swc/commit/f70a4b7c15324a0d7d771e11ff1ab738f964e43b))


- **(es)** Add TypeScript + React transforms and tsc corpus tests ([#11635](https://github.com/swc-project/swc/issues/11635)) ([09a5d8d](https://github.com/swc-project/swc/commit/09a5d8d39f65684f4dc88558b92804dcb19a1c0b))


- **(es/helpers)** Prevent recursive instanceof helper transforms ([#11609](https://github.com/swc-project/swc/issues/11609)) ([cb755a3](https://github.com/swc-project/swc/commit/cb755a3260aac2a1aaeab8ccf0458b783607511b))


- **(es/parser)** Add `with_capacity` for `Capturing` ([#11679](https://github.com/swc-project/swc/issues/11679)) ([60df582](https://github.com/swc-project/swc/commit/60df58288867757038c6eec45ccc54bf1799f10c))


- **(es/parser)** Add flow syntax mode and strip integration ([#11685](https://github.com/swc-project/swc/issues/11685)) ([015bbe8](https://github.com/swc-project/swc/commit/015bbe8759da1a57a33dd8c7791bc835e4150034))


- **(es/parser)** Finish flow strip support for core syntax gaps ([#11689](https://github.com/swc-project/swc/issues/11689)) ([584a12f](https://github.com/swc-project/swc/commit/584a12f6fa15f4beaf030fa6224ba77be1874e0f))


- **(es/parser)** Extend flow declare export strip compatibility ([#11691](https://github.com/swc-project/swc/issues/11691)) ([a8315aa](https://github.com/swc-project/swc/commit/a8315aaea70d2b9dcd5da56b5726190c84ed3036))


- **(es/parser)** Support Flow declare export default interface strip path ([#11692](https://github.com/swc-project/swc/issues/11692)) ([588577c](https://github.com/swc-project/swc/commit/588577c5c2541ae0d4c198648ba74265eb05dc39))


- **(es/parser)** Add Hermes Flow parity harness and fixes ([#11699](https://github.com/swc-project/swc/issues/11699)) ([918b6ac](https://github.com/swc-project/swc/commit/918b6ac1f5ca151aa70b6b5f4fcb2443be80eacb))


- **(es/parser)** Complete Hermes Flow stripping parity ([#11702](https://github.com/swc-project/swc/issues/11702)) ([f041f4c](https://github.com/swc-project/swc/commit/f041f4c2f2c757489a2c1194fe03d890052d131e))


- **(es/proposal)** Add decorators 2023-11 support ([#11686](https://github.com/swc-project/swc/issues/11686)) ([e96eb6a](https://github.com/swc-project/swc/commit/e96eb6a82897f80910e9cf81ae5b0649a0a0855a))


- **(es/react-compiler)** Scaffold SWC port of Babel entrypoint ([#11687](https://github.com/swc-project/swc/issues/11687)) ([4a1d3ce](https://github.com/swc-project/swc/commit/4a1d3ce3175428a4113eda8f4bc7b07ccb18b60f))


- **(es/react-compiler)** Phase1 crate API baseline and fixture harness ([#11690](https://github.com/swc-project/swc/issues/11690)) ([31364dc](https://github.com/swc-project/swc/commit/31364dcb26860e49ff64f60fa60d4b5cd39b199d))


- **(es/react-compiler)** Strict upstream parity finalization (crate-only, WIP) ([#11697](https://github.com/swc-project/swc/issues/11697)) ([a3994aa](https://github.com/swc-project/swc/commit/a3994aa5f853836c528614a89e435fc5eacb7f13))


- **(es/react-compiler)** Advance strict upstream parity ([#11709](https://github.com/swc-project/swc/issues/11709)) ([9b3abe0](https://github.com/swc-project/swc/commit/9b3abe078f86db7e6cc80b7cd1c3c1150c41a71a))


- **(es/react-compiler)** Advance upstream fixture parity pipeline ([#11716](https://github.com/swc-project/swc/issues/11716)) ([33fe6f2](https://github.com/swc-project/swc/commit/33fe6f26aa4a5dcc6542d752632e75b4f3595e7d))


- **(es/semantics)** Add scope analysis and statement-level cfg ([#11623](https://github.com/swc-project/swc/issues/11623)) ([86815b1](https://github.com/swc-project/swc/commit/86815b1e9cecd2c0b67c17c5d4ba2b99f904b355))


- **(es_parser)** Complete parity suite with zero ignores ([#11615](https://github.com/swc-project/swc/issues/11615)) ([ee3fdd5](https://github.com/swc-project/swc/commit/ee3fdd553564a1af8490ff1f2b1d1b74c8574ba9))


- **(es_parser)** Complete internal parser wiring without ecma runtime dep ([#11622](https://github.com/swc-project/swc/issues/11622)) ([1c51891](https://github.com/swc-project/swc/commit/1c518913a5abd64e60fe7fa5c5ece856a2861147))


- **(es_parser)** Expand benchmark corpus ([#11633](https://github.com/swc-project/swc/issues/11633)) ([ff3adef](https://github.com/swc-project/swc/commit/ff3adef43b0b49a611f1f1704400ca20ec1111f3))


- **(react-compiler)** Advance SWC upstream fixture parity ([#11718](https://github.com/swc-project/swc/issues/11718)) ([e8d1696](https://github.com/swc-project/swc/commit/e8d16969b74d21f13b1594ef71ceef3d550d0a59))


- **(react-compiler)** Improve lint rename and gating parity ([#11721](https://github.com/swc-project/swc/issues/11721)) ([5f89ee7](https://github.com/swc-project/swc/commit/5f89ee70d5af99a382a8f8ca16ba913b1ddd746e))


- **(swc_es_parser)** Enforce full parity suite and extend grammar surface ([#11611](https://github.com/swc-project/swc/issues/11611)) ([585f7d0](https://github.com/swc-project/swc/commit/585f7d07a44b2508b05d6b07e9fcd83cb5cb7185))


- **(swc_es_parser)** Complete lossless modeling for with/TS module/decorators ([#11613](https://github.com/swc-project/swc/issues/11613)) ([59b1189](https://github.com/swc-project/swc/commit/59b11898fe247382bed44fddfb29c9592050b8bc))


- **(swc_es_parser)** Close parity gaps with full core/large fixture pass-fail parity ([#11614](https://github.com/swc-project/swc/issues/11614)) ([3085f52](https://github.com/swc-project/swc/commit/3085f52a0f2aafc194d01a4394ddce72c455c6a5))


- Complete core parity parser coverage ([#11603](https://github.com/swc-project/swc/issues/11603)) ([18e0edc](https://github.com/swc-project/swc/commit/18e0edce9ebdd50508c9e60f50d1adf5a286e865))

### Performance



- **(es/modules)** Avoid export sort key clones ([#11669](https://github.com/swc-project/swc/issues/11669)) ([e74e17d](https://github.com/swc-project/swc/commit/e74e17dcf2e23ced12e199d05146e88a55b6174f))


- **(es/parser)** Reduce JSX identifier rescan allocations ([#11671](https://github.com/swc-project/swc/issues/11671)) ([f9214fe](https://github.com/swc-project/swc/commit/f9214fed47818f2df75865645ef6a3358300d86a))


- **(es/parser)** Optimize underscore stripping in numeric literal hot path ([#11670](https://github.com/swc-project/swc/issues/11670)) ([874338b](https://github.com/swc-project/swc/commit/874338b77f93b22cebc58d4ec4b43fe02bebb7e2))


- **(es/transformer)** Remove O(n^2) statement mutation hotspots ([#11672](https://github.com/swc-project/swc/issues/11672)) ([bdc24b7](https://github.com/swc-project/swc/commit/bdc24b7fdc006c77f4b5303bf4ff903b71fd8bcb))


- **(es_parser)** Byte-search lexer optimization pass ([#11616](https://github.com/swc-project/swc/issues/11616)) ([607f2db](https://github.com/swc-project/swc/commit/607f2dbba4cdc681447657f07bda10c0533d0d7f))


- **(es_parser)** Reduce lookahead and allocation overhead ([#11673](https://github.com/swc-project/swc/issues/11673)) ([becd9b0](https://github.com/swc-project/swc/commit/becd9b0352db53611cd7ab3f922ff3b1f89d73fe))


- **(ts/fast-strip)** Avoid token capture in default transform path ([#11668](https://github.com/swc-project/swc/issues/11668)) ([06aa0db](https://github.com/swc-project/swc/commit/06aa0db37d19ddec7f3255f92eef84f07c7f2d61))

### Refactor



- **(es/minifier)** Use arguments data from scope ([#11604](https://github.com/swc-project/swc/issues/11604)) ([4738539](https://github.com/swc-project/swc/commit/473853951651a013c896122b88d5fb7db43c2412))

### Testing



- **(es/flow)** Add flow strip corpus correctness test ([#11694](https://github.com/swc-project/swc/issues/11694)) ([cd5ed81](https://github.com/swc-project/swc/commit/cd5ed813da185d8aacc3d9bf7a64acb2e1c32116))


- **(es/parser)** Enforce full ecma fixture parity ([#11637](https://github.com/swc-project/swc/issues/11637)) ([0bf8a46](https://github.com/swc-project/swc/commit/0bf8a4656011bdfeb80afb94fb8f2764739d099e))


- **(es/parser)** Expand flow strip fixture coverage ([#11695](https://github.com/swc-project/swc/issues/11695)) ([e231262](https://github.com/swc-project/swc/commit/e23126212595d32265e0d4478592a15dc9e0ceef))


- **(es_parser)** Add core snapshot suite ([#11617](https://github.com/swc-project/swc/issues/11617)) ([23c56fe](https://github.com/swc-project/swc/commit/23c56fe60f60689994e3cc2b08301886cd0cea65))


- **(es_parser)** De-arenaize ecma_reuse fixture snapshots ([#11639](https://github.com/swc-project/swc/issues/11639)) ([aa6727a](https://github.com/swc-project/swc/commit/aa6727a26dac1a8802ea06d35b5c3ac1ff7633f4))


- **(es_parser)** Recover swc_es_parser benchmark coverage ([#11640](https://github.com/swc-project/swc/issues/11640)) ([0f24ee1](https://github.com/swc-project/swc/commit/0f24ee1dfdea41e7e22218fd3bfc466772d557b7))


- Expand swc_es_parser snapshot suites (ecma-style) ([#11621](https://github.com/swc-project/swc/issues/11621)) ([325170f](https://github.com/swc-project/swc/commit/325170fff9b5c99abe1da19ec63fe6d2d8c6a9bb))


- Move TS decorator fixtures out of proposal crate ([#11723](https://github.com/swc-project/swc/issues/11723)) ([e29d58c](https://github.com/swc-project/swc/commit/e29d58c74b345dc783b8132bea15439f8dcd4119))

### Ci



- Bump cargo-mono to 0.5.0 ([#11605](https://github.com/swc-project/swc/issues/11605)) ([7118713](https://github.com/swc-project/swc/commit/7118713176d7d2c244c1c7c637dbfa7ffa37f167))


- Remove --no-verify flag from cargo mono publish ([02eb5ec](https://github.com/swc-project/swc/commit/02eb5ec20ea24a90c577991d6bb756b346c9c6a3))


- Optimize cargo-test matrix with cargo mono changed ([#11681](https://github.com/swc-project/swc/issues/11681)) ([99e61c4](https://github.com/swc-project/swc/commit/99e61c4cc172b772437dcabcf8f937a8f24dc4bd))


- Bump cargo-mono to 0.5.3 ([#11722](https://github.com/swc-project/swc/issues/11722)) ([b5272af](https://github.com/swc-project/swc/commit/b5272af0f80047ffb98a1eed5de1f1d391657aa2))


- Install zig for core ppc64le/s390x nightly cross builds ([#11725](https://github.com/swc-project/swc/issues/11725)) ([09c4be0](https://github.com/swc-project/swc/commit/09c4be00656d2d64e80ffb0ae250c53db645a39c))

## [1.15.18] - 2026-03-01

### Bug Fixes



- **(html/wasm)** Publish @swc/html-wasm for nodejs ([#11601](https://github.com/swc-project/swc/issues/11601)) ([bd443f5](https://github.com/swc-project/swc/commit/bd443f582c553e9d898a1d5e7395abaad60b26d2))

### Documentation



- Add AGENTS note about next-gen ast ([#11592](https://github.com/swc-project/swc/issues/11592)) ([80b4be8](https://github.com/swc-project/swc/commit/80b4be872d85dc82cbb6e84c91fe102d807a2780))


- Add typescript-eslint AST compatibility note ([#11598](https://github.com/swc-project/swc/issues/11598)) ([c7bfebe](https://github.com/swc-project/swc/commit/c7bfebec4fb691e6e49f3c3b7b257be178e7f238))

### Features



- **(es/ast)** Add runtime arena crate and bootstrap swc_es_ast ([#11588](https://github.com/swc-project/swc/issues/11588)) ([7a06d96](https://github.com/swc-project/swc/commit/7a06d967e43fe2f84078fc241bc655b41450d2c1))


- **(es/parser)** Add `swc_es_parser` ([#11593](https://github.com/swc-project/swc/issues/11593)) ([f11fd70](https://github.com/swc-project/swc/commit/f11fd705ee84909f6b0f984b1b5fc35abf73ec05))

### Ci



- Triage main CI breakage ([#11589](https://github.com/swc-project/swc/issues/11589)) ([075af57](https://github.com/swc-project/swc/commit/075af578c46c0bfdb74c450c157d0e1753024a36))

## [1.15.17] - 2026-02-26

### Documentation



- Add submodule update step before test runs ([#11576](https://github.com/swc-project/swc/issues/11576)) ([81b22c3](https://github.com/swc-project/swc/commit/81b22c31d1acb447caae1a2d2bd530b2e6a40c26))

### Features



- **(bindings)** Add html wasm binding and publish wiring ([#11587](https://github.com/swc-project/swc/issues/11587)) ([b3869c3](https://github.com/swc-project/swc/commit/b3869c3ae2a592d4539f4cbfbabeaf615e55d69e))


- **(sourcemap)** Support safe scopes round-trip metadata ([#11581](https://github.com/swc-project/swc/issues/11581)) ([de2a348](https://github.com/swc-project/swc/commit/de2a348daed80e47c75dabaf2f0ce945d850210a))


- Emit ECMA-426 source map scopes behind experimental flag ([#11582](https://github.com/swc-project/swc/issues/11582)) ([2385a22](https://github.com/swc-project/swc/commit/2385a2279ee71abca3ae485d04a800e24bf55bae))

## [1.15.13] - 2026-02-23

### Bug Fixes



- **(errors)** Avoid panic on invalid diagnostic spans ([#11561](https://github.com/swc-project/swc/issues/11561)) ([b24b8e0](https://github.com/swc-project/swc/commit/b24b8e0253e4e2db4a36a2180906d65ee89495da))


- **(es/helpers)** Fix `_object_without_properties` crash on primitive values ([#11571](https://github.com/swc-project/swc/issues/11571)) ([4f35904](https://github.com/swc-project/swc/commit/4f35904ebfc7d924b75635af4166dd8e2b26c069))


- **(es/jsx)** Preserve whitespace before HTML entities ([#11521](https://github.com/swc-project/swc/issues/11521)) ([64be077](https://github.com/swc-project/swc/commit/64be077515ee15501b179ebe523fa68d2c29f905))


- **(es/minifier)** Do not merge if statements with different local variable values ([#11518](https://github.com/swc-project/swc/issues/11518)) ([3e63627](https://github.com/swc-project/swc/commit/3e636273d4ba0563c9fa15736cfa4c57d80c943d))


- **(es/minifier)** Prevent convert_tpl_to_str when there's emoji under es5 ([#11529](https://github.com/swc-project/swc/issues/11529)) ([ff6cf88](https://github.com/swc-project/swc/commit/ff6cf88c88497881839ccb40fa18d33225971203))


- **(es/minifier)** Inline before merge if ([#11526](https://github.com/swc-project/swc/issues/11526)) ([aa5a9ac](https://github.com/swc-project/swc/commit/aa5a9ac3ebae1f2a5775d980da65bc6a1c2574d7))


- **(es/minifier)** Preserve array join("") nullish semantics ([#11558](https://github.com/swc-project/swc/issues/11558)) ([d477f61](https://github.com/swc-project/swc/commit/d477f61d85de8d88113e886f5e5d8076192ca76a))


- **(es/minifier)** Inline side-effect-free default params ([#11564](https://github.com/swc-project/swc/issues/11564)) ([1babda7](https://github.com/swc-project/swc/commit/1babda721a42de7a85cd0da6f6231f9a67c54bfa))


- **(es/parser)** Fix generic arrow function in TSX mode ([#11549](https://github.com/swc-project/swc/issues/11549)) ([366a16b](https://github.com/swc-project/swc/commit/366a16b4a469d61ca816ec8187d3d476a57860d7))


- **(es/react)** Preserve first-line leading whitespace with entities ([#11568](https://github.com/swc-project/swc/issues/11568)) ([fc62617](https://github.com/swc-project/swc/commit/fc62617f31707bb464dc167d3317dcc705aecd4c))


- **(es/regexp)** Transpile unicode property escapes in RegExp constructor ([#11554](https://github.com/swc-project/swc/issues/11554)) ([476d544](https://github.com/swc-project/swc/commit/476d544f911ea643fcc8434e46aaddd344fa49f8))

### Documentation



- **(agents)** Clarify sandbox escalation for progress ([#11574](https://github.com/swc-project/swc/issues/11574)) ([cb31d0d](https://github.com/swc-project/swc/commit/cb31d0da37b35858986ba63e0dab300555f8ec82))

### Features



- **(es/minifier)** Add `unsafe_hoist_static_method_alias` option ([#11493](https://github.com/swc-project/swc/issues/11493)) ([6e7dbe2](https://github.com/swc-project/swc/commit/6e7dbe234555f926f98d8714789b5cd4a5e65b3d))


- **(es/minifier)** Remove unused args for IIFE ([#11536](https://github.com/swc-project/swc/issues/11536)) ([3cc286b](https://github.com/swc-project/swc/commit/3cc286b2f16489c8175faf5a72601c5be1376bdc))

### Refactor



- **(es/parser)** Compare token kind rather than strings ([#11531](https://github.com/swc-project/swc/issues/11531)) ([5872ffa](https://github.com/swc-project/swc/commit/5872ffa74a5b214bd6fd03732a26479118c41011))


- **(es/typescript)** Run typescript transform in two passes ([#11532](https://github.com/swc-project/swc/issues/11532)) ([b069558](https://github.com/swc-project/swc/commit/b06955813af93cd784aad90e7e98ab06fb648438))


- **(es/typescript)** Precompute namespace import-equals usage in semantic pass ([#11534](https://github.com/swc-project/swc/issues/11534)) ([b7e87c7](https://github.com/swc-project/swc/commit/b7e87c7b951cb8f62d6b22a5cfa2105310a91ccc))

### Testing



- **(es/minifier)** Add execution tests for issue #11517 ([#11530](https://github.com/swc-project/swc/issues/11530)) ([01b3b64](https://github.com/swc-project/swc/commit/01b3b648114ddb2e1e5ded32856397b996cb9fc2))


- Disable `cva` ecosystem ci temporariliy ([55bc966](https://github.com/swc-project/swc/commit/55bc966be4e2a393b926317e228f6d33eacb7715))

### Ci



- Reset closed issue and PR milestone to Planned ([#11559](https://github.com/swc-project/swc/issues/11559)) ([d5c4ebe](https://github.com/swc-project/swc/commit/d5c4ebe3d991b05697f01d8fb67efe7ad708a1f8))


- Add permission ([431c576](https://github.com/swc-project/swc/commit/431c5764b84d43fad0e30d25dcc0a8e049e8beae))

## [1.15.11] - 2026-01-27

### Bug Fixes



- **(es/codegen)** Emit leading comments for JSX elements, fragments, and empty expressions ([#11488](https://github.com/swc-project/swc/issues/11488)) ([1520633](https://github.com/swc-project/swc/commit/1520633549965eb6838c80d4389431074613bd0e))


- **(es/decorators)** Invoke addInitializer callbacks for decorated fields ([#11495](https://github.com/swc-project/swc/issues/11495)) ([11cfe4d](https://github.com/swc-project/swc/commit/11cfe4deaea8c66cd1f78e8894b4df11ebdbe0f7))


- **(es/es3)** Visit export decl body even if name is not reserved ([#11473](https://github.com/swc-project/swc/issues/11473)) ([9113fff](https://github.com/swc-project/swc/commit/9113fffc8cae6d379c5ce7bfd9f5373f6ee9a3aa))


- **(es/es3)** Remove duplicate code ([#11499](https://github.com/swc-project/swc/issues/11499)) ([fbee775](https://github.com/swc-project/swc/commit/fbee7752443e491ce24b590e00d78677b7e4c8f4))


- **(es/minifier)** Treat new expression with empty class as side-effect free ([#11455](https://github.com/swc-project/swc/issues/11455)) ([a33a45e](https://github.com/swc-project/swc/commit/a33a45e3bd4e6227d143174198d36f7cbc4b9f2b))


- **(es/minifier)** Escape control characters when converting strings to template literals ([#11464](https://github.com/swc-project/swc/issues/11464)) ([028551f](https://github.com/swc-project/swc/commit/028551f4f0d00c3880df8af324d3b5eb2637cfb9))


- **(es/minifier)** Handle unused parameters with default values ([#11494](https://github.com/swc-project/swc/issues/11494)) ([6ed1ee9](https://github.com/swc-project/swc/commit/6ed1ee9ca1e816aedfe0387d240479c1dbfcffef))


- **(es/module)** Preserve ./ prefix for hidden directory imports ([#11489](https://github.com/swc-project/swc/issues/11489)) ([a005391](https://github.com/swc-project/swc/commit/a0053916e786711be01f73c767e3c2283c9fb4f6))


- **(es/parser)** Validate dynamic import argument count ([#11462](https://github.com/swc-project/swc/issues/11462)) ([2f67591](https://github.com/swc-project/swc/commit/2f67591e2c9bb41a711d739e6bc81d20a673bfd6))


- **(es/parser)** Allow compilation with --no-default-features ([#11460](https://github.com/swc-project/swc/issues/11460)) ([b70c5f8](https://github.com/swc-project/swc/commit/b70c5f8ade85c3e4a17e0fed61ce850ab6b1f53c))


- **(es/parser)** Skip emitting TS1102 in TypeScript mode ([#11463](https://github.com/swc-project/swc/issues/11463)) ([e6f5b06](https://github.com/swc-project/swc/commit/e6f5b06561c1d87d0235aea5cfce9c253afdcc74))


- **(es/parser)** Reject ambiguous generic arrow functions in TSX mode ([#11491](https://github.com/swc-project/swc/issues/11491)) ([ac00915](https://github.com/swc-project/swc/commit/ac00915ba027bbb2c805ad0abd8d945d7dcf4055))


- **(es/parser)** Disallow NumericLiteralSeparator with BigInts ([#11510](https://github.com/swc-project/swc/issues/11510)) ([6b3644b](https://github.com/swc-project/swc/commit/6b3644b9ca58530a5e0bb92586bdf8210b89124f))


- **(es/react)** Preserve HTML entity-encoded whitespace in JSX ([#11474](https://github.com/swc-project/swc/issues/11474)) ([7d433a9](https://github.com/swc-project/swc/commit/7d433a95ccc372535b4f5b9dc691cbd313c2f388))


- **(es/renamer)** Prevent duplicate parameter names with destructuring patterns ([#11456](https://github.com/swc-project/swc/issues/11456)) ([e25a2c8](https://github.com/swc-project/swc/commit/e25a2c82db0e33c098a8ecd19bb933115e74ac1a))


- **(es/testing)** Skip update when expected output has invalid code ([#11469](https://github.com/swc-project/swc/issues/11469)) ([2be6b8a](https://github.com/swc-project/swc/commit/2be6b8a1fe3f55c30655f82dcf0cf6c04aa9a331))


- **(es/typescript)** Don't mark enums with opaque members as pure ([#11452](https://github.com/swc-project/swc/issues/11452)) ([b713fae](https://github.com/swc-project/swc/commit/b713fae8cc1b4fb7a45ffb4bf4a7e9d1facb651f))


- **(preset-env)** Distinguish unknown browser vs empty config ([#11457](https://github.com/swc-project/swc/issues/11457)) ([1310957](https://github.com/swc-project/swc/commit/1310957bec15ce2352dcb2dde8adb77664625c69))

### Documentation



- Replace swc.config.js references with .swcrc ([#11485](https://github.com/swc-project/swc/issues/11485)) ([fec8d2c](https://github.com/swc-project/swc/commit/fec8d2cbb8e7f5eaaed369dd1b45347839fa0c18))

### Features



- **(cli)** Add --root-mode argument for .swcrc resolution ([#11501](https://github.com/swc-project/swc/issues/11501)) ([b53a0e2](https://github.com/swc-project/swc/commit/b53a0e2a98a7556c5f8a74270a717e4078793053))


- **(es/module)** Make module transforms optional via `module` feature ([#11509](https://github.com/swc-project/swc/issues/11509)) ([b94a178](https://github.com/swc-project/swc/commit/b94a17851c9032e0e17c3c9912cfdb60d00722f4))


- **(es/regexp)** Implement unicode property escape transpilation ([#11472](https://github.com/swc-project/swc/issues/11472)) ([a2e0ba0](https://github.com/swc-project/swc/commit/a2e0ba0151fdde2c11c093d3ab2960410f4ffb86))


- **(es/transformer)** Merge ES3 hooks into swc_ecma_transformer ([#11503](https://github.com/swc-project/swc/issues/11503)) ([5efcac9](https://github.com/swc-project/swc/commit/5efcac946f5cf88e900da2867dc8b92c411bdd18))

### Miscellaneous Tasks



- **(es/minifier)** Extend OrderedChain to support more node types ([#11477](https://github.com/swc-project/swc/issues/11477)) ([aa9d789](https://github.com/swc-project/swc/commit/aa9d789953fc8e62e07b91e25137573d3a4d70d7))

### Performance



- **(bindings)** Optimize string handling by avoiding unnecessary clones ([#11490](https://github.com/swc-project/swc/issues/11490)) ([81daaaa](https://github.com/swc-project/swc/commit/81daaaa054a579fd2b425c5362b33ffc90471e6f))


- **(es/codegen)** Make `commit_pending_semi` explicit in `write_punct` ([#11492](https://github.com/swc-project/swc/issues/11492)) ([5a27fc0](https://github.com/swc-project/swc/commit/5a27fc0c49872098339bf897957af5a6b459abf9))


- **(es/es2015)** Port ES2015 transforms to hook-based visitors ([#11484](https://github.com/swc-project/swc/issues/11484)) ([a54eb0e](https://github.com/swc-project/swc/commit/a54eb0ef7518f759e52636162870f90233ef8532))


- **(es/es3)** Use hooks pattern for single AST traversal ([#11483](https://github.com/swc-project/swc/issues/11483)) ([a139fba](https://github.com/swc-project/swc/commit/a139fba3b9aca632e02e64333312c989f10e0ef8))


- **(es/minifier)** Use combined AST traversal ([#11471](https://github.com/swc-project/swc/issues/11471)) ([c611663](https://github.com/swc-project/swc/commit/c611663e9f22293233d5bd8084c3de703dec8b14))


- **(es/transformer)** Add inline hint ([#11508](https://github.com/swc-project/swc/issues/11508)) ([d72c9df](https://github.com/swc-project/swc/commit/d72c9df7e390389c3f9a2645341f920c5d42d0db))

### Refactor



- **(es/compat)** Put ES3 crates behind feature flag ([#11480](https://github.com/swc-project/swc/issues/11480)) ([d5a8d84](https://github.com/swc-project/swc/commit/d5a8d8447a6a4517372a5d52151e6732d74a1ade))

### Testing



- **(es/minifier)** Add test case for `merge_imports` order preservation ([#11458](https://github.com/swc-project/swc/issues/11458)) ([b874a05](https://github.com/swc-project/swc/commit/b874a05d5cde160c4d40f0d73f871fdb1746a753))


- **(es/parser)** Add error tests for import.source and import.defer with too many args ([#11466](https://github.com/swc-project/swc/issues/11466)) ([7313462](https://github.com/swc-project/swc/commit/731346282ebdb11fd3a1fb6b558cc83982e4afcb))


- **(es/parser)** Check `handler.has_errors()` in test error parsing ([#11487](https://github.com/swc-project/swc/issues/11487)) ([fade647](https://github.com/swc-project/swc/commit/fade647452ed288d42336a4c5580b49bd4953e23))


- Replace deprecated `cargo_bin` function with `cargo_bin!` macro ([#11461](https://github.com/swc-project/swc/issues/11461)) ([73f77b6](https://github.com/swc-project/swc/commit/73f77b6331b1501592315b78babcc96d9ae9b483))

## [1.15.10] - 2026-01-19

### Bug Fixes



- **(ci)** Handle merged PRs separately in milestone manager ([#11409](https://github.com/swc-project/swc/issues/11409)) ([3554268](https://github.com/swc-project/swc/commit/3554268dcb7c8af4abfe0a06e61a382a23c4a3eb))


- **(es/compat)** Preserve this context in nested arrow functions ([#11423](https://github.com/swc-project/swc/issues/11423)) ([f2bdaf2](https://github.com/swc-project/swc/commit/f2bdaf27d869a6d54a3dd47cd47e63c5b39a4d5c))


- **(es/es2017)** Replace `this` in arrow functions during async-to-generator ([#11450](https://github.com/swc-project/swc/issues/11450)) ([a993da6](https://github.com/swc-project/swc/commit/a993da6fb6e43bdbc2cd3a288c8b5be1b79e08c0))

### Features



- **(bindings/wasm)** Enable ecma_lints feature to support semantic error detection ([#11414](https://github.com/swc-project/swc/issues/11414)) ([1faa4a5](https://github.com/swc-project/swc/commit/1faa4a57454ef3932c75a1aca7dd36e37bb215d3))


- **(es/hooks)** Implement VisitMutHook for Either type ([#11428](https://github.com/swc-project/swc/issues/11428)) ([395c85e](https://github.com/swc-project/swc/commit/395c85e921eeb0cad661c8714d97372970cbfb6c))


- **(es/hooks)** Implement VisitMutHook for Option<H> ([#11429](https://github.com/swc-project/swc/issues/11429)) ([0bf1954](https://github.com/swc-project/swc/commit/0bf195421de167b3a01f710be7578d1cedf033b9))


- **(es/hooks)** Add VisitHook trait for immutable AST visitors ([#11437](https://github.com/swc-project/swc/issues/11437)) ([3efb41d](https://github.com/swc-project/swc/commit/3efb41d97e2cdb1d593c55c841c016eb2958ee72))


- **(es/minifier)** Improve nested template literal evaluation ([#11411](https://github.com/swc-project/swc/issues/11411)) ([147df2f](https://github.com/swc-project/swc/commit/147df2f0233c4b701311675dc7c237ee18f0c854))


- **(es/minifier)** Remove inlined IIFE arg and param ([#11436](https://github.com/swc-project/swc/issues/11436)) ([2bc5d40](https://github.com/swc-project/swc/commit/2bc5d402ade64f84523bfa7cf0c2da88ef494ad6))


- **(es/minifier)** Remove inlined IIFE arg and param ([#11446](https://github.com/swc-project/swc/issues/11446)) ([baa1ae3](https://github.com/swc-project/swc/commit/baa1ae3510668f9969bf5cd73ba4e3d66aa74fa0))

### Miscellaneous Tasks



- **(deps)** Update `rkyv` ([#11419](https://github.com/swc-project/swc/issues/11419)) ([432197b](https://github.com/swc-project/swc/commit/432197bdc7c574fbd8829ad5a6e0b3108ccb1d3c))


- **(deps)** Update lru to 0.16.3 ([#11438](https://github.com/swc-project/swc/issues/11438)) ([67c2d75](https://github.com/swc-project/swc/commit/67c2d752910c945732cf4deebf2af0f8a110e880))


- **(deps)** Update browserslist-data to v0.1.5 ([#11454](https://github.com/swc-project/swc/issues/11454)) ([e9f78f0](https://github.com/swc-project/swc/commit/e9f78f032f7d85a500037cdc82babdcf2d2be99a))


- **(helpers)** Replace MagicString with ast-grep's built-in edit API ([#11410](https://github.com/swc-project/swc/issues/11410)) ([a3f0d33](https://github.com/swc-project/swc/commit/a3f0d33916f7ad225d8320c499a8dd0f7b46e5b9))


- **(hstr/wtf8)** Address legacy FIXME comments by switching to derives ([#11416](https://github.com/swc-project/swc/issues/11416)) ([f03bfd8](https://github.com/swc-project/swc/commit/f03bfd8dd15630acbcdb011d64bdea5c1a0ccf79))

### Performance



- **(es/codegen, es/utils)** Migrate to dragonbox_ecma for faster Number::toString ([#11412](https://github.com/swc-project/swc/issues/11412)) ([b7978cc](https://github.com/swc-project/swc/commit/b7978cc9dbe92b26d781748d09ad50e2f1a6343b))


- **(es/react)** Optimize JSX transforms to reduce allocations ([#11425](https://github.com/swc-project/swc/issues/11425)) ([2a20cb6](https://github.com/swc-project/swc/commit/2a20cb6e34bed4260efe2a1b87165f52f9b3d45c))

### Refactor



- **(es)** Improve TypeScript transform configuration structure ([#11434](https://github.com/swc-project/swc/issues/11434)) ([f33a975](https://github.com/swc-project/swc/commit/f33a975c74f63f8d8e3c05db5166912c432ae18b))


- **(es/minifier)** Migrate MinifierPass to Pass trait ([#11442](https://github.com/swc-project/swc/issues/11442)) ([a41e631](https://github.com/swc-project/swc/commit/a41e63193c86290f20fec6529d7aa944562df713))


- **(es/minifier)** Improve tpl to str ([#11415](https://github.com/swc-project/swc/issues/11415)) ([0239523](https://github.com/swc-project/swc/commit/0239523c3863f3c0c8f8a3c7d486b64213fc60ff))


- **(es/react)** Port to VisitMutHook ([#11418](https://github.com/swc-project/swc/issues/11418)) ([9604d9c](https://github.com/swc-project/swc/commit/9604d9cc8a3d265d66ab32c1f70c25031b09cc18))


- **(es/transformer)** Remove OptionalHook wrapper in favor of Option<H> ([#11430](https://github.com/swc-project/swc/issues/11430)) ([72da6bd](https://github.com/swc-project/swc/commit/72da6bdd526eff0fdde76f22a978cbec736b9d3c))


- **(es/transforms)** Migrate TypeScript transform to Pass trait ([#11439](https://github.com/swc-project/swc/issues/11439)) ([dd007c6](https://github.com/swc-project/swc/commit/dd007c64a691d37f6d4903624a8dfa39d389f912))

### Testing



- **(es)** Enable benchmark for `swc` ([#11420](https://github.com/swc-project/swc/issues/11420)) ([3a50a25](https://github.com/swc-project/swc/commit/3a50a2592784a418ef3312b0f445bde2762959ca))


- Disable LTO for benchmarks ([#11421](https://github.com/swc-project/swc/issues/11421)) ([af3c2d3](https://github.com/swc-project/swc/commit/af3c2d36d772eab7905db717f8be2080fd14abec))


- Use rstest as the test framework ([#11417](https://github.com/swc-project/swc/issues/11417)) ([fae258f](https://github.com/swc-project/swc/commit/fae258f530d2f54fa148f90225e9a7740de57d96))

### Ci



- Collapse preivous `claude[bot]` PR review comments ([affb6a2](https://github.com/swc-project/swc/commit/affb6a29de9a511148a3483149aa5a574720fccf))

## [1.15.8] - 2025-12-30

### Bug Fixes



- **(es/minifier)** Remove unused webpack-related code ([#11397](https://github.com/swc-project/swc/issues/11397)) ([8e4eab4](https://github.com/swc-project/swc/commit/8e4eab4c900d5a870788388cd32c35a32104643d))


- **(es/minifier)** Evaluate TemplateLiteral in BinaryExpression ([#11406](https://github.com/swc-project/swc/issues/11406)) ([8d1b6f6](https://github.com/swc-project/swc/commit/8d1b6f613e61b7d7cf9ac9b9071bbe671b8baa8c))


- **(es/minifier)** More strict check if cannot add ident when invoking IIFE ([#11399](https://github.com/swc-project/swc/issues/11399)) ([03642aa](https://github.com/swc-project/swc/commit/03642aafd32af9d07803603795ae13b0fc80bf3a))

### Features



- **(es/minifier)** Support BinaryExpression for Evaluator ([#11390](https://github.com/swc-project/swc/issues/11390)) ([6c76f0a](https://github.com/swc-project/swc/commit/6c76f0adc39cbc72cbf3b81fdc2f521a5d0b6f7b))


- **(es/transformer)** Merge `static_blocks` ([#11403](https://github.com/swc-project/swc/issues/11403)) ([55a5083](https://github.com/swc-project/swc/commit/55a5083f02e2eabd79e0839268f0a74aff2f69a4))

### Performance



- **(es/parser)** Remove `Iterator` implementation for `Lexer` ([#11393](https://github.com/swc-project/swc/issues/11393)) ([5941018](https://github.com/swc-project/swc/commit/59410188a2037ab88b516cddf4401149cc739ee8))


- **(es/parser)** Optimize `do_outside_of_context` and `do_inside_of_context` ([#11394](https://github.com/swc-project/swc/issues/11394)) ([4210cf1](https://github.com/swc-project/swc/commit/4210cf1ca1ec37a624cbeb36d8821855c3f56d41))


- **(es/parser)** Remove `is_first` in lexer state ([#11395](https://github.com/swc-project/swc/issues/11395)) ([97d903b](https://github.com/swc-project/swc/commit/97d903b4e580e99d0a02463c0a38e780f76bd274))


- **(es/parser)** Use `byte_search` to optimize `scan_jsx_token` ([#11398](https://github.com/swc-project/swc/issues/11398)) ([f9b4da2](https://github.com/swc-project/swc/commit/f9b4da2bd85d160b3ee4b3296ed520388675b90e))


- Reduce binary size with panic=abort and ICU optimizations ([#11401](https://github.com/swc-project/swc/issues/11401)) ([18088b2](https://github.com/swc-project/swc/commit/18088b29826acd0948e9682e0de5ab47db399d32))

### Refactor



- **(es/compiler)** Drop the crate ([#11407](https://github.com/swc-project/swc/issues/11407)) ([8faa14e](https://github.com/swc-project/swc/commit/8faa14ec0882dc20780fdc2c1fdba93d6cde7772))


- **(es/minifier)** Move drop_console and unsafes from Pure to Optimizer ([#11388](https://github.com/swc-project/swc/issues/11388)) ([ee40804](https://github.com/swc-project/swc/commit/ee408042547f0c3fe4d3a5dd2599a7846b619852))


- **(es/parser)** Distinguish JsxText from Str ([#11387](https://github.com/swc-project/swc/issues/11387)) ([63c4c44](https://github.com/swc-project/swc/commit/63c4c440a135be06179b4fdc03a2b7a5e9606c1c))

## [1.15.7] - 2025-12-18

### Bug Fixes



- **(es/minifier)** Prevent unsafe sequence merging in `super()` calls ([#11381](https://github.com/swc-project/swc/issues/11381)) ([eb02780](https://github.com/swc-project/swc/commit/eb02780a126cd70da830079fc54168d632d18a4d))


- **(es/transformer)** Fix variable declaration for nullish coalescing in else-if branches ([#11384](https://github.com/swc-project/swc/issues/11384)) ([6746002](https://github.com/swc-project/swc/commit/67460026176cb97a5bfa59a439da59b70447e897))


- **(es/transforms)** Update `_ts_rewrite_relative_import_extension` helper code ([#11382](https://github.com/swc-project/swc/issues/11382)) ([1ec444e](https://github.com/swc-project/swc/commit/1ec444e998fd1aff29b7e674254d1c95e2de2ba0))

### Features



- **(es/transformer)** Merge `private_properties_in_object` ([#11378](https://github.com/swc-project/swc/issues/11378)) ([769c9d2](https://github.com/swc-project/swc/commit/769c9d2938edab63a0f109fc1bf7cad3e40a4619))

### Performance



- **(es/minifier)** Optimize data structures of `ProgramData` ([#11374](https://github.com/swc-project/swc/issues/11374)) ([3639523](https://github.com/swc-project/swc/commit/36395237e7efff0698a2b575e0ad7822381437e3))

### Refactor



- **(es/transformer)** Port var injector ([#11383](https://github.com/swc-project/swc/issues/11383)) ([cfff553](https://github.com/swc-project/swc/commit/cfff5536ac0e5f9051e5a4bb650eac028c7e6067))

## [1.15.6] - 2025-12-18

### Bug Fixes



- **(es/transformer)** Fix missing var declaration in nullish coalescing with spreads ([#11377](https://github.com/swc-project/swc/issues/11377)) ([686d154](https://github.com/swc-project/swc/commit/686d154c1e8aa45c16b45d8b0ed1a921fae5eb39))

### Performance



- **(es/parser)** Remove `raw`s in `TokenValue` ([#11373](https://github.com/swc-project/swc/issues/11373)) ([78a5327](https://github.com/swc-project/swc/commit/78a532726560738f363e812ec4940d0580140576))

## [1.15.5] - 2025-12-15

### Bug Fixes



- **(es/parser)** Fix `bump` length ([#11372](https://github.com/swc-project/swc/issues/11372)) ([ec5c1bc](https://github.com/swc-project/swc/commit/ec5c1bc5bf23249fd7cbd786ab735f9abb4ed9cb))


- **(es/transforms)** Adjust import rewriter pass before inject helpers pass ([#11371](https://github.com/swc-project/swc/issues/11371)) ([8516991](https://github.com/swc-project/swc/commit/8516991cb5316b1fbdc7d52daa6f64b9ca9e0f32))

## [1.15.4] - 2025-12-13

### Bug Fixes



- **(es/compat)** Preserve return value for single-property object destructuring ([#11334](https://github.com/swc-project/swc/issues/11334)) ([847ad22](https://github.com/swc-project/swc/commit/847ad222a9a95e189850172345b0c26dfeb6c225))


- **(es/compat)** Fix generator transform for compound assignments, for-in, and labeled break ([#11339](https://github.com/swc-project/swc/issues/11339)) ([9b6bedd](https://github.com/swc-project/swc/commit/9b6bedd6dab07f81808ee949c769c24e7ecda8a0))


- **(es/compat)** Destructuring evaluation order ([#11337](https://github.com/swc-project/swc/issues/11337)) ([49d04c7](https://github.com/swc-project/swc/commit/49d04c750dc771a6b4a01ae7a0b438f48098a485))


- **(es/compat)** Fix parameter default value evaluation order with object rest ([#11352](https://github.com/swc-project/swc/issues/11352)) ([2ebb261](https://github.com/swc-project/swc/commit/2ebb261c90ab24290a8b972bd4bd7b5b452ddefc))


- **(es/fixer)** Preserve parens around IFFE in binary expressions within sequences ([#11324](https://github.com/swc-project/swc/issues/11324)) ([a4c84ea](https://github.com/swc-project/swc/commit/a4c84ea7807839a87300d2e931b6a457f248b33a))


- **(es/helpers)** Avoid extra trap calls on excluded keys in object rest spread ([#11338](https://github.com/swc-project/swc/issues/11338)) ([4662caf](https://github.com/swc-project/swc/commit/4662caf427c67a2aea7dade478b0f7c00276b30e))


- **(es/minifier)** Fix `debug` cargo feature ([#11325](https://github.com/swc-project/swc/issues/11325)) ([be86fad](https://github.com/swc-project/swc/commit/be86fad7e9b935faac2da7d881a6991295a6dbad))


- **(es/minifier)** Fix optimization pass for `merge_imports` ([#11331](https://github.com/swc-project/swc/issues/11331)) ([ca2f7ed](https://github.com/swc-project/swc/commit/ca2f7ed0d06c7d0971102875a5463176d0dd5204))


- **(es/parser)** Don't call `bump_bytes` in the `continue_if` of `byte_search!` ([#11328](https://github.com/swc-project/swc/issues/11328)) ([583619d](https://github.com/swc-project/swc/commit/583619d019b548621becb8fb0c895dd9ce85da71))


- **(es/parser)** Support type-only string literal in import specifiers ([#11333](https://github.com/swc-project/swc/issues/11333)) ([07762f1](https://github.com/swc-project/swc/commit/07762f13e9ddc5e756b545cb2a6877f427733406))


- **(es/parser)** Handle TypeScript expressions in destructuring patterns ([#11353](https://github.com/swc-project/swc/issues/11353)) ([160ec34](https://github.com/swc-project/swc/commit/160ec343404d7363e94a447be5c23bed2ab50e37))


- **(es/transformer)** Complete `replace_this_in_expr` implementation ([#11361](https://github.com/swc-project/swc/issues/11361)) ([58c4067](https://github.com/swc-project/swc/commit/58c406723e78fbe87011450dd87edbf52508c08e))


- **(es/transformer)** Fix pass order ([#11370](https://github.com/swc-project/swc/issues/11370)) ([373048a](https://github.com/swc-project/swc/commit/373048ae3e6ad0b344bc8aa298765a207289a861))

### Features



- **(es/minifier)** Optimize `typeof x == "undefined"` to `typeof x > "u"` ([#11367](https://github.com/swc-project/swc/issues/11367)) ([a5e144b](https://github.com/swc-project/swc/commit/a5e144bc6329431fcb4beb63b441627e7afce1fa))


- **(es/parser)** Support `no_paren` parser option ([#11359](https://github.com/swc-project/swc/issues/11359)) ([5b9d77c](https://github.com/swc-project/swc/commit/5b9d77c1c89ade5772c6feee429386faf3b93a39))


- **(es/parser)** Revert `no_paren` parser option ([#11362](https://github.com/swc-project/swc/issues/11362)) ([57a8731](https://github.com/swc-project/swc/commit/57a87313194f825efc2ce91d41fb27b8e1e9d9aa))


- **(es/transfomer)** Add modules to prepare porting ([#11347](https://github.com/swc-project/swc/issues/11347)) ([68d740c](https://github.com/swc-project/swc/commit/68d740cc5c2097954d0a7827775af7ac0b3f7cee))


- **(es/transform)** Add common fields ([#11346](https://github.com/swc-project/swc/issues/11346)) ([1a8759f](https://github.com/swc-project/swc/commit/1a8759f30b1d2253bd5e267f68970ca58f301b68))


- **(es/transformer)** Merge `async-to-generator` ([#11355](https://github.com/swc-project/swc/issues/11355)) ([c388e87](https://github.com/swc-project/swc/commit/c388e870cae2e9253f1ef39f659aebe7470ea741))


- **(es/transformer)** Merge `async_to_generator` ([#11358](https://github.com/swc-project/swc/issues/11358)) ([25f3a47](https://github.com/swc-project/swc/commit/25f3a4724d48e7fe32eebacd743f1ab623681e46))


- **(es/transformer)** Merge `object_rest_spread` ([#11357](https://github.com/swc-project/swc/issues/11357)) ([752188e](https://github.com/swc-project/swc/commit/752188ef85d8b0b36d8d60e962d5fbe6349b6263))


- **(es/transformer)** Merge `nullish_coalescing` ([#11365](https://github.com/swc-project/swc/issues/11365)) ([5fb686a](https://github.com/swc-project/swc/commit/5fb686a2c2fca583707406b7d2fec1a60bf9d4c9))


- **(es/transformer)** Merge `logical_assignment_operators` ([#11369](https://github.com/swc-project/swc/issues/11369)) ([94946fa](https://github.com/swc-project/swc/commit/94946fa40b972f86c8aa006b29a49307127bceeb))

### Performance



- **(es/compat)** Merge `exponentation_operator` ([#11310](https://github.com/swc-project/swc/issues/11310)) ([0ef3637](https://github.com/swc-project/swc/commit/0ef3637606035ce6258c9893fe458bc80c598574))


- **(es/compat)** Merge `optional_catch_binding` ([#11313](https://github.com/swc-project/swc/issues/11313)) ([468d20c](https://github.com/swc-project/swc/commit/468d20cf811794e2e905617b4426e8d593cbca59))


- **(es/compat)** Use merged transformer ([#11366](https://github.com/swc-project/swc/issues/11366)) ([c4a5e79](https://github.com/swc-project/swc/commit/c4a5e7989bf0bb943051c56d03f8121d921c9f13))


- **(es/parser)** Optimize `byte_search!` ([#11323](https://github.com/swc-project/swc/issues/11323)) ([67f67c1](https://github.com/swc-project/swc/commit/67f67c1dcb45203601d96d4e7a77cb4c16e82d79))


- **(es/parser)** Small optimization after byte-based lexer ([#11340](https://github.com/swc-project/swc/issues/11340)) ([c92ea4e](https://github.com/swc-project/swc/commit/c92ea4ec5f32654921efaee9af8cb09dc39457df))


- **(es/parser)** Use `slice` rather than matching keywords ([#11341](https://github.com/swc-project/swc/issues/11341)) ([b6ad2cb](https://github.com/swc-project/swc/commit/b6ad2cb114c99676c912ffa6984e50da677630cf))


- **(parser)** Make all parsers work by byte instead of char  ([#11318](https://github.com/swc-project/swc/issues/11318)) ([725efd1](https://github.com/swc-project/swc/commit/725efd16c67f4f2d42c6b3c673cb0ad473ff0ff3))

## [1.15.3] - 2025-11-20

### Bug Fixes



- **(es/codegen)** Restore missing top-level comments ([#11302](https://github.com/swc-project/swc/issues/11302)) ([0998c93](https://github.com/swc-project/swc/commit/0998c93a5ad391a6cc7bd25eb08104f825a29ac4))


- **(es/codegen)** Emit comments of all nodes ([#11314](https://github.com/swc-project/swc/issues/11314)) ([387ee0f](https://github.com/swc-project/swc/commit/387ee0f4d864212d38c008f4d3b715b17036fbef))


- **(es/minifier)** Prevent compress.comparisons from transforming expressions with side effects ([#11256](https://github.com/swc-project/swc/issues/11256)) ([58a9d81](https://github.com/swc-project/swc/commit/58a9d81959162778f6ca1200436c90f3545bd387))


- **(es/minifier)** Remove unused arrow functions in dead code elimination ([#11319](https://github.com/swc-project/swc/issues/11319)) ([88c6ac7](https://github.com/swc-project/swc/commit/88c6ac7eb05e3367d3d14e40bad8468218576783))


- **(es/parser)** Make the span of Program start at input start ([#11199](https://github.com/swc-project/swc/issues/11199)) ([b56e008](https://github.com/swc-project/swc/commit/b56e0083c60e9d96fbe7aef9de20ff83d4c77279))


- **(es/plugin)** Use `#[cfg]` to avoid compilation error ([#11316](https://github.com/swc-project/swc/issues/11316)) ([f615cdb](https://github.com/swc-project/swc/commit/f615cdbc52773b4899fb7831992272088013acc0))


- **(es/quote)** Replace usage of `swc_atoms` with `swc_core::atoms` ([#11299](https://github.com/swc-project/swc/issues/11299)) ([c1e32fa](https://github.com/swc-project/swc/commit/c1e32fafd3dd8c2424331730c6ebc03bc793b058))

### Miscellaneous Tasks



- **(es/transformer)** Determine project structure ([#11306](https://github.com/swc-project/swc/issues/11306)) ([58f2602](https://github.com/swc-project/swc/commit/58f2602981fd5d2efeabc44dc59fbc07dbb4e7cd))

### Performance



- **(es/compat)** Merge `regexp` pass into `Transformer` ([#11307](https://github.com/swc-project/swc/issues/11307)) ([440b391](https://github.com/swc-project/swc/commit/440b391e65fab9514c40e65145828c956b8b437b))


- **(es/compat)** Merge `export_namespace_from` to `Transformer` ([#11309](https://github.com/swc-project/swc/issues/11309)) ([7a528ce](https://github.com/swc-project/swc/commit/7a528ce66ef1a8b715b702de5d246d60a093ab70))

### Refactor



- **(es/transfomer)** Prevent breaking change ([#11308](https://github.com/swc-project/swc/issues/11308)) ([45827fa](https://github.com/swc-project/swc/commit/45827fac5d0d0434f425769f6b3f4383617355e0))

## [1.15.2] - 2025-11-14

### Bug Fixes



- **(bindings/es)** Respect `filename` option from `print()` ([#11264](https://github.com/swc-project/swc/issues/11264)) ([0d4d2d9](https://github.com/swc-project/swc/commit/0d4d2d9ab4e912ecf9e17e7c9b49d26b320c1d98))

### Features



- **(es/minifier)** Drop empty constructors during minification ([#11250](https://github.com/swc-project/swc/issues/11250)) ([2cea7dd](https://github.com/swc-project/swc/commit/2cea7ddb58390253fed44a4033c71d2333271691))


- **(es/visit)** Add context parameter to VisitMutHook trait ([#11254](https://github.com/swc-project/swc/issues/11254)) ([8645d0d](https://github.com/swc-project/swc/commit/8645d0de8fcbd61d7a69235ac485debb64497205))

### Performance



- **(es/parser)** Inline `skip_space` ([afb824a](https://github.com/swc-project/swc/commit/afb824a97f3d917090e14a8289339ee259f42239))


- **(es/parser)** Eliminate the outer loop of `skip_block_comment` ([#11261](https://github.com/swc-project/swc/issues/11261)) ([e41c0ac](https://github.com/swc-project/swc/commit/e41c0ac9d5e5e4956f826bceea43f01ad729725e))


- **(es/plugin)** Use shared tokio runtime to avoid creation overhead ([#11267](https://github.com/swc-project/swc/issues/11267)) ([707026b](https://github.com/swc-project/swc/commit/707026bee1e0d98ec3602ef9d3aac348c7184940))

## [1.15.1] - 2025-11-08

### Bug Fixes



- **(cli)** Print filename to stderr when compiling ([#11249](https://github.com/swc-project/swc/issues/11249)) ([d66dab5](https://github.com/swc-project/swc/commit/d66dab575c0ea7084b8e3c07155990fc93ef636f))


- **(es/minifier)** Prevent array destructuring optimization in assignment contexts ([#11221](https://github.com/swc-project/swc/issues/11221)) ([99d8b0a](https://github.com/swc-project/swc/commit/99d8b0a6257bbc47bc75477a7e3b265c50ad44f5))

### Features



- **(es/compiler)** Determine module structure ([#11238](https://github.com/swc-project/swc/issues/11238)) ([415019c](https://github.com/swc-project/swc/commit/415019c6da388180cb590e802b17206692ec95a4))


- **(ts/fast-strip)** Add a binding crate for nodejs/amaro ([#11236](https://github.com/swc-project/swc/issues/11236)) ([f0829af](https://github.com/swc-project/swc/commit/f0829af6da69e9e5da73a8e114181601d6e50400))


- **(visit)** Add hook APIs for visitors ([#11242](https://github.com/swc-project/swc/issues/11242)) ([3a141ed](https://github.com/swc-project/swc/commit/3a141ed230c0be9660441d6ff14edd82ea41e2d4))

### Miscellaneous Tasks



- **(es/compiler)** Drop `syntax_ext` and prepare AI-based porting ([#11239](https://github.com/swc-project/swc/issues/11239)) ([15639c0](https://github.com/swc-project/swc/commit/15639c0abfa5569873fd75a6778fa8ec2d31f197))

### Performance



- **(common)** Improve `StringInput#bump_bytes` ([#11230](https://github.com/swc-project/swc/issues/11230)) ([6a9fa49](https://github.com/swc-project/swc/commit/6a9fa49117e037aa77bcdd1b0b50f2e08697c05e))


- **(es/parser)** Optimize `skip_space` ([#11225](https://github.com/swc-project/swc/issues/11225)) ([541d252](https://github.com/swc-project/swc/commit/541d252b98298cf71b7d5b773f68a0b7ec4ef087))

### Refactor



- **(visit)** Use separate crate for hooks ([#11243](https://github.com/swc-project/swc/issues/11243)) ([d93ec90](https://github.com/swc-project/swc/commit/d93ec903acdd9029da179281fb93b4af76dc93f5))

## [1.15.0] - 2025-11-04

### Bug Fixes



- **(cli)** Update plugin template to use VisitMut API ([#11218](https://github.com/swc-project/swc/issues/11218)) ([6a87e41](https://github.com/swc-project/swc/commit/6a87e41fbaf2f97e2f530d8560df7bb9e0ba1a12))


- **(hstr)** Skip only `\u` for unicode ([#11216](https://github.com/swc-project/swc/issues/11216)) ([eda01e5](https://github.com/swc-project/swc/commit/eda01e5284ad5b1eda538eda7231795d75f7136f))

### Features



- **(hstr)** Support checked `from_bytes` for Wtf8Buf and Wtf8 ([#11211](https://github.com/swc-project/swc/issues/11211)) ([1430489](https://github.com/swc-project/swc/commit/1430489460a54598300427bfc7ed0f4a30bf8d63))

### Performance



- **(atoms)** Remove temporary allocations in rkyv serialize and deserialize ([#11202](https://github.com/swc-project/swc/issues/11202)) ([85e6e8a](https://github.com/swc-project/swc/commit/85e6e8a66f0e517512d7cd13c5b287b1ef82e191))


- **(es/parser)** Remove `start` in `State` ([#11201](https://github.com/swc-project/swc/issues/11201)) ([b9aeaa3](https://github.com/swc-project/swc/commit/b9aeaa3a3bab072f90fb8f26454cb33062bff584))


- **(plugin)** Avoid data copy when transformation finished ([#11223](https://github.com/swc-project/swc/issues/11223)) ([af134fa](https://github.com/swc-project/swc/commit/af134faecd5979126165a5462abf880c70b5b54b))

### Refactor



- **(ast)** Introduce flexible serialization encoding for AST ([#11100](https://github.com/swc-project/swc/issues/11100)) ([8ad3647](https://github.com/swc-project/swc/commit/8ad36478160ff848466bbff2bf442224696982bf))


- **(plugin)** Switch plugin abi to flexible serialization ([#11198](https://github.com/swc-project/swc/issues/11198)) ([e5feaf1](https://github.com/swc-project/swc/commit/e5feaf15cebb2887cd8dc9d0275c4ec0fbf40d30))


- Flatten cargo workspaces ([#11213](https://github.com/swc-project/swc/issues/11213)) ([6223100](https://github.com/swc-project/swc/commit/622310055c59ee42b744038a33997e6f43cf4af0))

### Testing



- Copy opt-level configs to the top level workspace ([#11210](https://github.com/swc-project/swc/issues/11210)) ([dba23f5](https://github.com/swc-project/swc/commit/dba23f5a72d26b3b62fbafe2d8a65c69c3642669))

## [1.14.0] - 2025-10-29

### Bug Fixes



- **(atoms)** Fix broken quote macro ([#11195](https://github.com/swc-project/swc/issues/11195)) ([3485179](https://github.com/swc-project/swc/commit/3485179196c056b913cdc7507ed5f3bb282623ee))


- **(es/ast)** Fix unicode unpaired surrogates handling ([#11144](https://github.com/swc-project/swc/issues/11144)) ([845512c](https://github.com/swc-project/swc/commit/845512c67819cd37bb25601d34bd5b1ac79afca3))


- **(hstr)** Fix unsoundness of `wtf8`'s transmutation ([#11194](https://github.com/swc-project/swc/issues/11194)) ([f27e65b](https://github.com/swc-project/swc/commit/f27e65b94b517204944505a3c0e11b6033407594))

### Features



- **(es/compiler)** Merge `nullish_coalescing` into `Compiler` ([#11157](https://github.com/swc-project/swc/issues/11157)) ([dd6f71b](https://github.com/swc-project/swc/commit/dd6f71b92fecd0137af3cf16d72799afc3ce30d6))

### Miscellaneous Tasks



- **(binding_macros)** Add `default-features = false` ([#11193](https://github.com/swc-project/swc/issues/11193)) ([85d855f](https://github.com/swc-project/swc/commit/85d855fd0478f989bac5d62caad668497f497137))

### Performance



- **(es/parser)** Remove `had_line_break_before_last` ([#11200](https://github.com/swc-project/swc/issues/11200)) ([7b5bcd7](https://github.com/swc-project/swc/commit/7b5bcd7abe2f4d7c048c350c7403ad719ce52bee))

### Refactor



- **(bindings)** Adjust compile options ([#11190](https://github.com/swc-project/swc/issues/11190)) ([4c6df95](https://github.com/swc-project/swc/commit/4c6df954df6eb1476b65b6c53bfc72e9b856f8e9))


- **(bindings)** Add `opt-level = s` to more crates ([#11191](https://github.com/swc-project/swc/issues/11191)) ([ed63413](https://github.com/swc-project/swc/commit/ed63413d3f0b9b19e717361a09ef938f243400cf))


- **(es/ast)** Cherry-pick #10763 ([#11182](https://github.com/swc-project/swc/issues/11182)) ([e93ffde](https://github.com/swc-project/swc/commit/e93ffde52f33a6b65ad9a595cb73776a9064e7c3))


- **(es/parser)** Detach `swc_ecma_parser` from `swc_ecma_lexer` ([#11148](https://github.com/swc-project/swc/issues/11148)) ([94f175d](https://github.com/swc-project/swc/commit/94f175d643f38477d2c84f00c8602bfebdb7b343))

## [1.13.21] - 2025-10-24

### Bug Fixes



- **(bindings)** Improve ARM64 and Alpine Linux (musl) binary loading and validation ([#11173](https://github.com/swc-project/swc/issues/11173)) ([f9be4d7](https://github.com/swc-project/swc/commit/f9be4d7a37a6b358fe34f0c25fa7391b3a375509))


- **(es/codegen)** Encode non-ASCII chars in regex with ascii_only option ([#11155](https://github.com/swc-project/swc/issues/11155)) ([b6f4d1f](https://github.com/swc-project/swc/commit/b6f4d1f8b76aa6661dd35c04492d5fee0f7803ba))


- **(es/compat)** Apply `Array.prototype.slice` to `arguments` in loose spread ([#11122](https://github.com/swc-project/swc/issues/11122)) ([66428a2](https://github.com/swc-project/swc/commit/66428a2b07fcded28b779860de3b13acd86e6647))


- **(es/compat)** Handle sparse arrays correctly in generator transforms ([#11131](https://github.com/swc-project/swc/issues/11131)) ([9cd4334](https://github.com/swc-project/swc/commit/9cd43343d39ccb0be43f8ce9e8e2cd74c18db4af))


- **(es/compat)** Preserve AutoAccessor to prevent panic ([#11150](https://github.com/swc-project/swc/issues/11150)) ([101c3b7](https://github.com/swc-project/swc/commit/101c3b7ce7851d38f0751913b13fd670088d909f))


- **(es/decorators)** Emit correct metadata for enum parameters ([#11154](https://github.com/swc-project/swc/issues/11154)) ([630484f](https://github.com/swc-project/swc/commit/630484f8560db3dcbc5aaa198ff89241a8aef023))


- **(es/helpers)** Fix SuppressedError argument order in explicit resource management ([#11172](https://github.com/swc-project/swc/issues/11172)) ([7693fb9](https://github.com/swc-project/swc/commit/7693fb909fa2541ca4182a932c6834895f25956e))


- **(es/minifier)** Fix inlining of hoisted functions ([#11159](https://github.com/swc-project/swc/issues/11159)) ([bd55d30](https://github.com/swc-project/swc/commit/bd55d30811d5f421b43dc70fd9c05d2f2b56a049))


- **(es/minifier)** Fix inlining of hoisted functions in param ([#11161](https://github.com/swc-project/swc/issues/11161)) ([5a4088d](https://github.com/swc-project/swc/commit/5a4088d73ab12c7cb59f577e80fc9e5b0edadd07))


- **(es/parser)** Handle JSX attributes with keyword prefixes correctly ([#11136](https://github.com/swc-project/swc/issues/11136)) ([d3cd97f](https://github.com/swc-project/swc/commit/d3cd97fef10518507249d4b0b82983320483ee1c))


- **(es/parser)** Support literal computed property names in enums ([#11163](https://github.com/swc-project/swc/issues/11163)) ([146c77c](https://github.com/swc-project/swc/commit/146c77c04d4cb002326fffffce0a282366d890bf))


- **(es/react)** Use correct span for `@jsxFrag` as null literal ([#11139](https://github.com/swc-project/swc/issues/11139)) ([9353763](https://github.com/swc-project/swc/commit/9353763e4d7f880ac3175bbdc058a3c3b3bea3bb))


- **(es/transforms)** Check errors::HANDLER.is_set() before failing ([#11130](https://github.com/swc-project/swc/issues/11130)) ([1c9ab27](https://github.com/swc-project/swc/commit/1c9ab2719ca21e4fcc4598c7877648d44f22311c))

### Features



- **(bindings)** Introduce AST Viewer to improve debugging experience ([#10963](https://github.com/swc-project/swc/issues/10963)) ([fa3aacc](https://github.com/swc-project/swc/commit/fa3aacc8425af7075d5af8596c0347de08d3f816))


- **(es/minifier)** Add merge_imports optimization pass to reduce bundle size ([#11151](https://github.com/swc-project/swc/issues/11151)) ([a01dee1](https://github.com/swc-project/swc/commit/a01dee106c327d166e2a5fd815b69258164b2821))


- **(es/parser)** Add an error for empty type args for generic ([#11164](https://github.com/swc-project/swc/issues/11164)) ([9a1fa84](https://github.com/swc-project/swc/commit/9a1fa847a74fd288013aeff8947b5ca331eee00f))

### Miscellaneous Tasks



- **(claude)** Use Sonnet 4.5 instead of Opus ([c79e1e5](https://github.com/swc-project/swc/commit/c79e1e50ad33d538aeb900fb2662e86e8e7b442c))


- **(deps)** Update lru crate from 0.10.1 to 0.16.1 ([#11145](https://github.com/swc-project/swc/issues/11145)) ([e347c5b](https://github.com/swc-project/swc/commit/e347c5bafe6645a0d099bf1da6083213de967064))

### Refactor



- **(ast_node)** Make AST enums `non_exhaustive` ([#11115](https://github.com/swc-project/swc/issues/11115)) ([f328e4a](https://github.com/swc-project/swc/commit/f328e4a560f7564d1c10b58bcb7d684ff6a7a3b1))

## [1.13.20] - 2025-09-27

### Bug Fixes



- **(es/minifier)** Preserve `__proto__` shorthand property behavior ([#11123](https://github.com/swc-project/swc/issues/11123)) ([63dbd1d](https://github.com/swc-project/swc/commit/63dbd1df2c01e6174c2452ca2476a5f7d6920194))


- **(es/parser)** Parse `(void)` correctly as arrow function return type ([#11125](https://github.com/swc-project/swc/issues/11125)) ([d3e5dd3](https://github.com/swc-project/swc/commit/d3e5dd37f4f6994371c0ff846c0319edeede7fd0))

### Performance



- **(es/minifier)** Reduce clone of atoms ([#11076](https://github.com/swc-project/swc/issues/11076)) ([89dcb36](https://github.com/swc-project/swc/commit/89dcb360115a9b3d0450c8d2ee9a90fa296e4b74))

## [1.13.19] - 2025-09-25

### Bug Fixes



- **(es/compat)** Preserve comment when transform template with no expr ([#11109](https://github.com/swc-project/swc/issues/11109)) ([80e8408](https://github.com/swc-project/swc/commit/80e84085466e171fddf629417e7e1698a7721dd8))


- **(es/minifier)** Inline block stmt into expr ([#11107](https://github.com/swc-project/swc/issues/11107)) ([72a53a0](https://github.com/swc-project/swc/commit/72a53a0de5ddf5d5163369b18d7c90c0baeb4280))


- **(es/minifier)** Allow MultiReplacer to inline multiple times ([#11106](https://github.com/swc-project/swc/issues/11106)) ([fe8e981](https://github.com/swc-project/swc/commit/fe8e981a4dc516a236aa24da7d2c430d95876dae))

### Features



- **(es/minifier)** Optimize (a | 0) ^ b ([#11110](https://github.com/swc-project/swc/issues/11110)) ([7af1474](https://github.com/swc-project/swc/commit/7af1474488d483b2fac9eb86afe7036411f59cb5))


- **(hstr)** Introduce `Wtf8Atom` ([#11104](https://github.com/swc-project/swc/issues/11104)) ([8cfd47b](https://github.com/swc-project/swc/commit/8cfd47b95a6bc100598dbec2829850be12d7fda1))

### Testing



- **(core)** Fix CI ([#11117](https://github.com/swc-project/swc/issues/11117)) ([52dca39](https://github.com/swc-project/swc/commit/52dca391c9b496b7cf3d516d1c7c80a998f39d65))

## [1.13.7] - 2025-09-19

### Bug Fixes



- **(ci)** Test chanages ([d4396c1](https://github.com/swc-project/swc/commit/d4396c158a6d9ebedc7116f6228035e504a197fe))


- **(es/ast)** Fix unicode lone surrogates handling ([#10987](https://github.com/swc-project/swc/issues/10987)) ([0557609](https://github.com/swc-project/swc/commit/0557609d6f862f7632a67ce91163571e5284163f))


- **(es/compat)** Handle `super` in nested arrow function ([#11056](https://github.com/swc-project/swc/issues/11056)) ([63c5413](https://github.com/swc-project/swc/commit/63c541306a5a0d2a76c880348ed59ad9c2d3b927))


- **(es/compat)** Preserve `typeof` symbol in loose mode ([#11072](https://github.com/swc-project/swc/issues/11072)) ([d92c3bd](https://github.com/swc-project/swc/commit/d92c3bde2d2a43677cccd981e82f5d3238cc23e7))


- **(es/lexer)** Fix token for `&&=` ([#11037](https://github.com/swc-project/swc/issues/11037)) ([d6e76e4](https://github.com/swc-project/swc/commit/d6e76e493fd0d34f4af71c0b2990de54053a8ebc))


- **(es/lexer)** Update regexp token span ([#11061](https://github.com/swc-project/swc/issues/11061)) ([ceb0aff](https://github.com/swc-project/swc/commit/ceb0aff688654e84007d717a5cc3c390740f5aec))


- **(es/minifier)** Fix `debug` feature ([#11030](https://github.com/swc-project/swc/issues/11030)) ([0a2dcf8](https://github.com/swc-project/swc/commit/0a2dcf8c1a470898e0c88d97ba960d2d55773f62))


- **(es/minifier)** Avoid `const_to_let` if reassigned ([#11035](https://github.com/swc-project/swc/issues/11035)) ([5ab92f7](https://github.com/swc-project/swc/commit/5ab92f792fbb763f7fd9e7fd6eba97c6f541f876))


- **(es/minifier)** Make `const_to_let` work in arrows again ([#11062](https://github.com/swc-project/swc/issues/11062)) ([79dc8d4](https://github.com/swc-project/swc/commit/79dc8d4f70b1cee2558f002e75a10ef2fa069d7e))


- **(es/minifier)** Remove `undefined` initializer iff the name is an ident ([#11080](https://github.com/swc-project/swc/issues/11080)) ([0058709](https://github.com/swc-project/swc/commit/0058709f6f881359a161ee6745373820141c69f9))


- **(es/minifier)** Check in param before add ident ([#11091](https://github.com/swc-project/swc/issues/11091)) ([2e61f44](https://github.com/swc-project/swc/commit/2e61f44821c51a7a450f22fbbddf560872143246))


- **(es/optimization)** Do not rely on resolver from `inline_globals` ([#11028](https://github.com/swc-project/swc/issues/11028)) ([dc392e6](https://github.com/swc-project/swc/commit/dc392e6efa2170f49f0a806262b67da171010153))


- **(es/parser)** Capture more tokens ([#11081](https://github.com/swc-project/swc/issues/11081)) ([6b381c9](https://github.com/swc-project/swc/commit/6b381c9d918c27b60184c4089eac95d345ec9d67))


- **(plugin/runner)** Fix wasmtime backend cache corruption ([#11077](https://github.com/swc-project/swc/issues/11077)) ([1e8b92f](https://github.com/swc-project/swc/commit/1e8b92fd0b8f59aef58775b12a4f973e935a5e2c))


- **(swc_common)** Fix compatibility with serde 1.0.220+ ([#11094](https://github.com/swc-project/swc/issues/11094)) ([45f17ed](https://github.com/swc-project/swc/commit/45f17edccc1c3b83e75d42e3459b16c08fd6d76f))

### Features



- **(@swc/types)** Add `preserve` to `react.runtime` ([#11068](https://github.com/swc-project/swc/issues/11068)) ([50354a1](https://github.com/swc-project/swc/commit/50354a190ef19f49b506aab4a0e91908b38186f2))


- **(es/minifier)** Inline arrow with call expr ([#11021](https://github.com/swc-project/swc/issues/11021)) ([4a55bea](https://github.com/swc-project/swc/commit/4a55bea8543ee0e3247da4095ec6420611d55c38))


- **(es/minifier)** Merge if return void ([#11031](https://github.com/swc-project/swc/issues/11031)) ([0f177df](https://github.com/swc-project/swc/commit/0f177df7f3fc02df8895eaadd1ebe8f1f066985e))


- **(es/transforms)** Support `rewriteRelativeImportExtensions` ([#11036](https://github.com/swc-project/swc/issues/11036)) ([038964a](https://github.com/swc-project/swc/commit/038964a182011fe27d2b5f7a1aa1cbe7c4c4ca7a))

### Miscellaneous Tasks



- **(bindings)** Bump dependencies ([#11043](https://github.com/swc-project/swc/issues/11043)) ([4eef9fe](https://github.com/swc-project/swc/commit/4eef9fe796f0e89083a91bac5e26d7b269917c16))

### Performance



- **(es/codegen)** Remove `char` comprison ([#11074](https://github.com/swc-project/swc/issues/11074)) ([078e319](https://github.com/swc-project/swc/commit/078e319285d0117b6c6fd06c1c5c4a5b1c1c83d8))


- **(es/minifier)** Lazy get type ([#11075](https://github.com/swc-project/swc/issues/11075)) ([eb0d615](https://github.com/swc-project/swc/commit/eb0d61548a9796822361787242268ed019c108e7))


- **(es/parser)** Remove `Rc<RefCell<T>>` in `Capturing` ([#11058](https://github.com/swc-project/swc/issues/11058)) ([be6b695](https://github.com/swc-project/swc/commit/be6b69590151af0c20e13f13fcd49359b1c0ebbd))

### Testing



- **(es)** Make `isModule` in test cases available ([#11038](https://github.com/swc-project/swc/issues/11038)) ([44a5536](https://github.com/swc-project/swc/commit/44a553670ba7276fcc10e9e5a2bf63cefc12ae15))


- **(es/parser)** Use relative file name in typescript tests ([#11029](https://github.com/swc-project/swc/issues/11029)) ([82c6b0f](https://github.com/swc-project/swc/commit/82c6b0fe80f0e40aab52d5b34366aa7ec89034cb))

## [1.13.5] - 2025-08-24

### Bug Fixes



- **(es/minifier)** Preserve `array.join` with nullable values ([#10937](https://github.com/swc-project/swc/issues/10937)) ([e495403](https://github.com/swc-project/swc/commit/e49540386e6647fd2b87b2a7b9c2ac7668005e56))


- **(es/preset-env)** Update polyfill data ([#11013](https://github.com/swc-project/swc/issues/11013)) ([934d8a5](https://github.com/swc-project/swc/commit/934d8a5c0b4d641a929febb2477f537614ac62d1))

### Features



- **(es/minifier)** Remove unused parts of destructuring ([#11024](https://github.com/swc-project/swc/issues/11024)) ([b5fed8c](https://github.com/swc-project/swc/commit/b5fed8c2edee1d4fb33df092b970ee2e621bde91))

### Refactor



- **(es/react)** Add `preserve` supports ([#11025](https://github.com/swc-project/swc/issues/11025)) ([bc83875](https://github.com/swc-project/swc/commit/bc838753053b1c0134f4ad94052fef068a505c18))

## [1.13.4] - 2025-08-21

### Bug Fixes



- **(es/lexer)** Use error when handling '\0' ([#10964](https://github.com/swc-project/swc/issues/10964)) ([53c22d1](https://github.com/swc-project/swc/commit/53c22d1cce88c0b9f8bc91f461bf26e58b21c9bd))


- **(es/minifier)** Skip serde of `pure_funcs` in options ([#10969](https://github.com/swc-project/swc/issues/10969)) ([862e70d](https://github.com/swc-project/swc/commit/862e70d596401f876dad054c6fc1cf4231d6d7a0))


- **(es/minifier)** Fix compile error with `debug` feature ([#10999](https://github.com/swc-project/swc/issues/10999)) ([831eed5](https://github.com/swc-project/swc/commit/831eed527e2a21bed07ba9d2747b40e467fd78e3))


- **(es/minifier)** Don't eliminate class expr if some side effects contain `this` ([#11003](https://github.com/swc-project/swc/issues/11003)) ([18aeac6](https://github.com/swc-project/swc/commit/18aeac6bba37aef84cac8a0fc2a2bc70b264929e))


- **(es/module)** Support optional chaining in `import.meta` ([#10985](https://github.com/swc-project/swc/issues/10985)) ([758d8ec](https://github.com/swc-project/swc/commit/758d8ec8e096b844ae6b603bfda72fba50133bf6))


- **(es/parser)** Allow TS type args to start with LSHIFT (`<<`) to parse `T<<S>() => void>` ([#10996](https://github.com/swc-project/swc/issues/10996)) ([4911ec7](https://github.com/swc-project/swc/commit/4911ec72304f619937c4c3728e08227f4894bc37))


- **(ts/isolated-dts)** Correct optional marker for class fields generated from constructor parameter ([#10992](https://github.com/swc-project/swc/issues/10992)) ([0d680fd](https://github.com/swc-project/swc/commit/0d680fd687918cde6ec36f988977d6b0e8331f14))


- Expose GlobalPassOption.build ([#10968](https://github.com/swc-project/swc/issues/10968)) ([c8a2668](https://github.com/swc-project/swc/commit/c8a266892e8bc02cd34f091c8962cd3cd77de285))

### Features



- **(bindings/html)** Add `keep-head-and-body` for `tagOmission` in binding ([#11014](https://github.com/swc-project/swc/issues/11014)) ([1e1ebeb](https://github.com/swc-project/swc/commit/1e1ebeb209f2df5e47f330eac1256693a7829cb9))


- **(html/minifier)** Support `keep_head_and_body` ([#11008](https://github.com/swc-project/swc/issues/11008)) ([86186db](https://github.com/swc-project/swc/commit/86186db36e9c311153b883fa99a20bb777ab2d64))


- **(plugin/runner)** Introduce `wasmtime` backend ([#10958](https://github.com/swc-project/swc/issues/10958)) ([9fa8330](https://github.com/swc-project/swc/commit/9fa833087eeb6901fce25af17f2123e23316ab40))

### Miscellaneous Tasks



- **(es/minifier)** Make a computation lazy ([#11004](https://github.com/swc-project/swc/issues/11004)) ([a4aa0ec](https://github.com/swc-project/swc/commit/a4aa0ec03a2bd4087614aaa852aeec87be24fbc6))

### Performance



- **(es/ast)** Remove alloc in leftmost api ([#11005](https://github.com/swc-project/swc/issues/11005)) ([f59f233](https://github.com/swc-project/swc/commit/f59f2331fb97625093783b5e6cde62042913fe53))


- **(es/minifier)** Use bitflags for context of the `Pure` pass ([#10953](https://github.com/swc-project/swc/issues/10953)) ([8cd5c58](https://github.com/swc-project/swc/commit/8cd5c587b358379df4d36def175a65aac42a12ec))


- **(es/minifier)** Reduce alloc ([#10961](https://github.com/swc-project/swc/issues/10961)) ([6475070](https://github.com/swc-project/swc/commit/64750702c98e2aca6e3c0d9e4a34974cc38b16e5))


- **(es/minifier)** Remove useless clone ([#10970](https://github.com/swc-project/swc/issues/10970)) ([8873f65](https://github.com/swc-project/swc/commit/8873f659a02deb2cc8f496c28ea74a2b04a70259))


- **(es/minifier)** Reduce clone ([#10982](https://github.com/swc-project/swc/issues/10982)) ([4f2ed0d](https://github.com/swc-project/swc/commit/4f2ed0dd080dc68069ad7990f992a15a36ebb5de))


- **(es/minifier)** Use `bitflags` for `DropOpts` ([#10990](https://github.com/swc-project/swc/issues/10990)) ([79206f1](https://github.com/swc-project/swc/commit/79206f17d495eadd930df23f92fedaa5a418d90e))


- **(es/parser)** Remove EOF check ([#10976](https://github.com/swc-project/swc/issues/10976)) ([a10dada](https://github.com/swc-project/swc/commit/a10dada821ff206f10659dc538a8dcad3fb40394))


- **(es/parser)** Introduce checkpoint to reduce clone ([#11001](https://github.com/swc-project/swc/issues/11001)) ([cda08d1](https://github.com/swc-project/swc/commit/cda08d196ef804764b74fdd99f58f4e73cb80495))


- **(es/parser)** Remove useless `Rc<RefCell<T>>` ([#11002](https://github.com/swc-project/swc/issues/11002)) ([39f5784](https://github.com/swc-project/swc/commit/39f5784c106e7fc1feb2b7a48b5d0639a6efdc5f))


- **(es/parser)** Remove `OneDirectionalList` and reduce allocation of `Vec` ([#11000](https://github.com/swc-project/swc/issues/11000)) ([0088ab8](https://github.com/swc-project/swc/commit/0088ab8ebb05c4db569cf2f7cd57e4f73a0e306c))

### Refactor



- **(common)** Remove `SyntaxContextData#opaque` ([#10983](https://github.com/swc-project/swc/issues/10983)) ([d5be248](https://github.com/swc-project/swc/commit/d5be248fc070caa658f04c3f54f5b1a0bca8cd0e))


- **(es/minifier)** Remove useless branch ([#10966](https://github.com/swc-project/swc/issues/10966)) ([e400de3](https://github.com/swc-project/swc/commit/e400de3aca99d4a937c37219eae6c1303785b661))


- **(es/minifier)** Remove duplicate report assign ([#11009](https://github.com/swc-project/swc/issues/11009)) ([9590e1d](https://github.com/swc-project/swc/commit/9590e1dbe967162bc3cda0fe3a1179f0d925eb25))


- **(es/parser)** Remove useless methods ([#10980](https://github.com/swc-project/swc/issues/10980)) ([91c6039](https://github.com/swc-project/swc/commit/91c60390b7623f164219dd6c91ef4c0cce8e4dfd))


- **(hstr)** Use default inline strategy ([#10954](https://github.com/swc-project/swc/issues/10954)) ([d160f7f](https://github.com/swc-project/swc/commit/d160f7f80175c7b4181ca8f22dfb7f5fcb4d639a))


- **(hstr)** Remove needlesss unwrap ([#10959](https://github.com/swc-project/swc/issues/10959)) ([953f75f](https://github.com/swc-project/swc/commit/953f75fce4b594ee66f2339af6d347963c113da5))


- **(plugin/runner)** Introduce abstract runtime ([#10943](https://github.com/swc-project/swc/issues/10943)) ([a445156](https://github.com/swc-project/swc/commit/a44515679cb17c3b8b6ab5e625cbce1ee6d1b9e4))


- **(plugin/runner)** Switch `wasmtime-wasi` to `wasi-common` ([#10979](https://github.com/swc-project/swc/issues/10979)) ([c4114d5](https://github.com/swc-project/swc/commit/c4114d55ad54649825226d515d0fad4272e028f8))


- Add `#[deny(unused)]` ([#10997](https://github.com/swc-project/swc/issues/10997)) ([1bb3716](https://github.com/swc-project/swc/commit/1bb37160daa70017b78a842dfe31f16b374eb298))

## [1.13.3] - 2025-07-29

### Bug Fixes



- **(es/minifier)** Check exported when optimize last expr ([#10939](https://github.com/swc-project/swc/issues/10939)) ([f6f15f3](https://github.com/swc-project/swc/commit/f6f15f38d38ef5458d8dd5c9b9a7090c1da6fd65))


- **(es/minifier)** Disallow types ([#10945](https://github.com/swc-project/swc/issues/10945)) ([63172ef](https://github.com/swc-project/swc/commit/63172ef3b069f6e7ef301233ad6f421d18cd8307))


- **(es/minifier)** Don't optimize Number properties when Number is shadowed ([#10947](https://github.com/swc-project/swc/issues/10947)) ([40a1e2e](https://github.com/swc-project/swc/commit/40a1e2e6b86756a8b1234057ad719bf0b1ef240f))


- **(es/minifier)** Fix cycle detection ([#10950](https://github.com/swc-project/swc/issues/10950)) ([212d8bc](https://github.com/swc-project/swc/commit/212d8bcff1b3986746b57f22f574a0a4e81bd39c))


- **(es/parser)** Correctly handle EOF position ([#10934](https://github.com/swc-project/swc/issues/10934)) ([dd70fbd](https://github.com/swc-project/swc/commit/dd70fbd0dd24f5c7652cf79d1be99d5f4bb9e1c6))

### Performance



- **(es/minifier)** Remove visitor of CharFreqAnalyzer ([#10928](https://github.com/swc-project/swc/issues/10928)) ([65534ff](https://github.com/swc-project/swc/commit/65534ff998036ca881e27ed13074df7d2cadae5d))


- **(es/minifier)** Remove pre-compress pass ([#10932](https://github.com/swc-project/swc/issues/10932)) ([c7f0e4d](https://github.com/swc-project/swc/commit/c7f0e4d5e6c0d6492e750d662711f9b495bc280d))


- **(es/minifier)** Use bitflag for var kind ([#10940](https://github.com/swc-project/swc/issues/10940)) ([4317988](https://github.com/swc-project/swc/commit/43179889525734f9a129d68dc4381fba881d1e66))


- **(es/minifier)** Remove needless clone ([#10949](https://github.com/swc-project/swc/issues/10949)) ([b5e5e8c](https://github.com/swc-project/swc/commit/b5e5e8c35abd4d04b90e18719d059242ed9b33eb))


- **(es/parser)** Reduce comparison ([#10933](https://github.com/swc-project/swc/issues/10933)) ([e44fbd4](https://github.com/swc-project/swc/commit/e44fbd44f348dcd16608b4a29a5582198a70e229))


- **(es/parser)** Reduce comparison ([#10941](https://github.com/swc-project/swc/issues/10941)) ([a262eeb](https://github.com/swc-project/swc/commit/a262eeb053265878333cf597f8c1f167a13c02b6))

## [1.13.2] - 2025-07-22

### Bug Fixes



- **(es/minifier)** Remove the last break in the second switch ([#10923](https://github.com/swc-project/swc/issues/10923)) ([3ed4a12](https://github.com/swc-project/swc/commit/3ed4a1208564f708ead059bbb1d44210450705ba))


- **(es/parser)** Reject malformed phase import statements ([#10912](https://github.com/swc-project/swc/issues/10912)) ([5fde348](https://github.com/swc-project/swc/commit/5fde3482f00207753d190fdc8a89b8527e5560b5))


- **(swc_core)** Add `default-features = false` to drop `stacker` ([#10916](https://github.com/swc-project/swc/issues/10916)) ([38b45b7](https://github.com/swc-project/swc/commit/38b45b7e39222a2aad39bf68cb8752b7e4446f4f))

### Features



- **(es/compiler)** Improve structure ([#10903](https://github.com/swc-project/swc/issues/10903)) ([0cc6743](https://github.com/swc-project/swc/commit/0cc6743ce3efe3e764a2db980a7030d93114050a))


- **(es/compiler)** Merge `private_in_object` and `static_blocks` ([#10909](https://github.com/swc-project/swc/issues/10909)) ([c1405da](https://github.com/swc-project/swc/commit/c1405da64d05b70ca82770decabaa3d06a5e3c43))


- **(es/compiler)** Merge logical assignments ([#10914](https://github.com/swc-project/swc/issues/10914)) ([ccbfcd1](https://github.com/swc-project/swc/commit/ccbfcd1139ad6c9f40f3b982f2536ca64c18247e))


- **(es/compiler)** Merge `export_namespace_from` ([#10917](https://github.com/swc-project/swc/issues/10917)) ([ba6cc71](https://github.com/swc-project/swc/commit/ba6cc71c20578e8185c4ab012d03d4ebc0798d36))


- **(es/renamer)** Add `renamer_keep_contexts` ([#10907](https://github.com/swc-project/swc/issues/10907)) ([1b15171](https://github.com/swc-project/swc/commit/1b15171a95bea857f4fa63ed2f09dbb47a8268bd))

### Miscellaneous Tasks



- **(claude)** Use `Opus` and allow assigning to the `claude-bot` ([3275b9c](https://github.com/swc-project/swc/commit/3275b9c8ce68f8cc29d562d3ce64e49e4de10fe4))

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



- **(es/compat)** Initialize compiler API ([#10902](https://github.com/swc-project/swc/issues/10902)) ([d6566ee](https://github.com/swc-project/swc/commit/d6566ee3d2649a68f8abfc5ffd0b01841f80e016))


- **(es/lexer)** EOF Token ([#10880](https://github.com/swc-project/swc/issues/10880)) ([54c866a](https://github.com/swc-project/swc/commit/54c866aa0ae1e31c058f762795b4181786b5cf45))


- **(es/parser)** Reduce `input_mut()` calls ([#10899](https://github.com/swc-project/swc/issues/10899)) ([1816368](https://github.com/swc-project/swc/commit/1816368bb1f22e020180f5fdf3605ce8f60c12a2))


- **(es/parser)** Remove unnecessary PResult ([#10900](https://github.com/swc-project/swc/issues/10900)) ([27e548d](https://github.com/swc-project/swc/commit/27e548dbda7d285e1d3a6df343efd90a7f749681))


- **(es/preset-env)** Apply swc_ecma_compiler in preset env ([#10921](https://github.com/swc-project/swc/issues/10921)) ([6f5b72a](https://github.com/swc-project/swc/commit/6f5b72a582a54687a5ed7ad615f575ce5eda4038))

### Testing



- **(es/minifier)** Update #10918 test case ([#10924](https://github.com/swc-project/swc/issues/10924)) ([57fb106](https://github.com/swc-project/swc/commit/57fb10662a4a2140f2309933fb778660a48e80af))

## [1.13.1] - 2025-07-19

### Bug Fixes



- **(es/compat)** Properly handle rest assignment in for-in/of RHS ([#10883](https://github.com/swc-project/swc/issues/10883)) ([5d11851](https://github.com/swc-project/swc/commit/5d118515b5f704f25c6240dfda593317db001ff4))


- **(es/decorators)** Handle empty class members ([#10892](https://github.com/swc-project/swc/issues/10892)) ([fe44972](https://github.com/swc-project/swc/commit/fe44972aaab79f2269ee2e401fa4467638b8c84e))


- **(es/minifier)** Hoist props when only props are used ([#10891](https://github.com/swc-project/swc/issues/10891)) ([452fc98](https://github.com/swc-project/swc/commit/452fc989c41b18551682299dea52cfac11a8444c))


- **(es/minifier)** Recursively check stmt for variable when inlining function ([#10896](https://github.com/swc-project/swc/issues/10896)) ([e37a93d](https://github.com/swc-project/swc/commit/e37a93dca660aba8871b1838b289c3440184547d))


- **(es/minifier)** Termination check when stmts containing switch ([#10898](https://github.com/swc-project/swc/issues/10898)) ([4429b20](https://github.com/swc-project/swc/commit/4429b20065d44548ad40f4298ee60a19df6f4eaa))


- **(es/parser)** Fix parsing of JSX identifiers ([#10894](https://github.com/swc-project/swc/issues/10894)) ([0047c39](https://github.com/swc-project/swc/commit/0047c39df08f183ab0a45eca2b4e4314be71379d))


- **(ts/fast-strip)** Strip private method overloads ([#10886](https://github.com/swc-project/swc/issues/10886)) ([cdb6e87](https://github.com/swc-project/swc/commit/cdb6e87291250103b1f54e90a863ca476d7624b0))

### Testing



- **(es/minify)** Verify fixed issue ([#10888](https://github.com/swc-project/swc/issues/10888)) ([86c1dca](https://github.com/swc-project/swc/commit/86c1dca11836b2a035b3fe159ecc260043ca8720))

## [1.13.0] - 2025-07-17

### Bug Fixes



- **(es/lexer)** Disallow legacy octal literals as BigInt ([#10867](https://github.com/swc-project/swc/issues/10867)) ([430fbf4](https://github.com/swc-project/swc/commit/430fbf45371e760b23f5feed56aa9cfdb7403d72))


- **(es/minifier)** Restrict IIFE inlining in class contexts ([#10879](https://github.com/swc-project/swc/issues/10879)) ([a01b54a](https://github.com/swc-project/swc/commit/a01b54afc82b7bd25cbf5faa7d4d4c18543dc9d8))


- **(es/parser)** Mark `static` as reserved in strict mode ([#10861](https://github.com/swc-project/swc/issues/10861)) ([5bdddd7](https://github.com/swc-project/swc/commit/5bdddd7d65b137f8a03a33a4f74a636e8b908227))

### Features



- **(es/minifier)** Drop unused rest paramters ([#10857](https://github.com/swc-project/swc/issues/10857)) ([5305486](https://github.com/swc-project/swc/commit/5305486d58d9cbee06d1f81691cf6f261d7158ed))


- **(es/minifier)** Enhance IIFE invoker for arrow functions ([#10860](https://github.com/swc-project/swc/issues/10860)) ([2b1ce3d](https://github.com/swc-project/swc/commit/2b1ce3d2322d3726cad799b2b3ca9ca1f04449bf))


- **(plugin/runner)** Use wasmer-wasix sys-minimal feature to reduce binary size ([#10638](https://github.com/swc-project/swc/issues/10638)) ([b5f704a](https://github.com/swc-project/swc/commit/b5f704a1199ea1be0a68e23d4eb8928e2ac6bc51))

### Performance



- **(es/lexer)** Reduce comparison while reading numbers ([#10864](https://github.com/swc-project/swc/issues/10864)) ([c6ba5c2](https://github.com/swc-project/swc/commit/c6ba5c263d0ab520e5253579213c02a6b647664b))


- **(es/lexer)** Remove unnecessary check when reading keywords ([#10866](https://github.com/swc-project/swc/issues/10866)) ([4aefe0e](https://github.com/swc-project/swc/commit/4aefe0eb0645f711ec16c2bfdc32a105e19f0733))


- **(es/parser)** Reduce comparisons ([#10862](https://github.com/swc-project/swc/issues/10862)) ([3bd9aad](https://github.com/swc-project/swc/commit/3bd9aadd27e22475e789ab393bc0318a6edbcb96))


- **(es/parser)** Remove useless alloc ([#10865](https://github.com/swc-project/swc/issues/10865)) ([3ebf088](https://github.com/swc-project/swc/commit/3ebf088cc88234c50e3924b1e9d0284d186f81ed))


- **(es/parser)** Reduce token query ([#10869](https://github.com/swc-project/swc/issues/10869)) ([d93ef64](https://github.com/swc-project/swc/commit/d93ef647f29c7c2241adc28a8eb2b6511f054949))


- **(es/parser)** Remove duplicate check ([#10872](https://github.com/swc-project/swc/issues/10872)) ([fe76460](https://github.com/swc-project/swc/commit/fe764608a5d27c41467102ef745d90940a033a7c))


- **(es/parser)** Remove duplicate check ([#10874](https://github.com/swc-project/swc/issues/10874)) ([064123b](https://github.com/swc-project/swc/commit/064123b6b5e5741083e246ad4156dc848ba5a89f))


- **(swc_error_reporters)** Avoid creating miette handler when no diagnostics ([#10852](https://github.com/swc-project/swc/issues/10852)) ([93b318f](https://github.com/swc-project/swc/commit/93b318f05c71b1a9e94a457fa93094cfb9116b4e))

### Refactor



- **(es/lexer)** Avoid passing `convert` ([#10868](https://github.com/swc-project/swc/issues/10868)) ([77393f8](https://github.com/swc-project/swc/commit/77393f80d0a59c6d136221935d439ba1d99d4385))


- **(es/minifier)** Cleanup ([#10882](https://github.com/swc-project/swc/issues/10882)) ([2595cb1](https://github.com/swc-project/swc/commit/2595cb13a737e9ad935c4c99ec954e7c6224ecd0))


- **(es/parser)** Remove duplicate check for reservedness ([#10850](https://github.com/swc-project/swc/issues/10850)) ([4897bfd](https://github.com/swc-project/swc/commit/4897bfd6444fb12ea8a916765a47e3712072dc01))


- **(es/parser)** Remove span swap operation in parser ([#10854](https://github.com/swc-project/swc/issues/10854)) ([32f4bb8](https://github.com/swc-project/swc/commit/32f4bb80c19b33ab490e8cf70666cac4c1b8c495))

## [1.12.14] - 2025-07-14

### Bug Fixes



- **(es/minifier)** Don't inline arrow when it contain `this` ([#10825](https://github.com/swc-project/swc/issues/10825)) ([8b43bb3](https://github.com/swc-project/swc/commit/8b43bb35bce93c66ee9783c8ea132dab7939fcb5))


- **(es/parser)** Make `export` in NS to not affect file type ([#10799](https://github.com/swc-project/swc/issues/10799)) ([ae22033](https://github.com/swc-project/swc/commit/ae22033dc4d03ba8444d87fd74f4e4a8aa86d653))


- **(es/parser)** Correctly check ambient context ([#10802](https://github.com/swc-project/swc/issues/10802)) ([f97ea03](https://github.com/swc-project/swc/commit/f97ea03523198447f176ee956991aefb16312e7c))

### Features



- **(es/parser)** Enable support for dynamic import with `defer` phase ([#10845](https://github.com/swc-project/swc/issues/10845)) ([097d29d](https://github.com/swc-project/swc/commit/097d29d21cbf378c0a3ff7a3c9364ff02242306d))


- **(plugin)** Remove `bytecheck` to make Wasm plugins backward compatible ([#10842](https://github.com/swc-project/swc/issues/10842)) ([30ad808](https://github.com/swc-project/swc/commit/30ad80809c833522f3631424e0b4efdb94455fc8))

### Miscellaneous Tasks



- **(bindings)** Fix dependency issues ([7c57fbb](https://github.com/swc-project/swc/commit/7c57fbb103baaa236d3c040e72d5cf65bc2b7ec4))


- **(deps)** Update `class-validator` to avoid comments ([#10819](https://github.com/swc-project/swc/issues/10819)) ([bacfa4b](https://github.com/swc-project/swc/commit/bacfa4b56d455a5c8e1392a66dd8d3c3add4f488))


- **(ide)** Enable `--workspace` for rust-analyzer check ([#10809](https://github.com/swc-project/swc/issues/10809)) ([92647ff](https://github.com/swc-project/swc/commit/92647ff9d9f95cecfab93b6faa2f1063e3f1239b))

### Performance



- **(es/minifier)** Use `u8` for `remaining_depth` ([#10833](https://github.com/swc-project/swc/issues/10833)) ([ed6956a](https://github.com/swc-project/swc/commit/ed6956a46e1f0abbcfc447773c5429659fe91289))


- **(hstr)** Inline one more byte ([#10817](https://github.com/swc-project/swc/issues/10817)) ([3886c97](https://github.com/swc-project/swc/commit/3886c9720dbf992bf2dbc6a09e416ed63833d6d7))


- **(hstr)** Remove static tag ([#10832](https://github.com/swc-project/swc/issues/10832)) ([66ae1e8](https://github.com/swc-project/swc/commit/66ae1e8d5aa047e2ea7c2a1c46a618bfa7d6a500))

### Refactor



- **(es/helpers)** Make inline helpers optional at compile time ([#10808](https://github.com/swc-project/swc/issues/10808)) ([53f3881](https://github.com/swc-project/swc/commit/53f38811cc994f394d47624cf27b49e5b3163b8a))


- **(es/lexer)** Don't store buffer in lexer ([#10830](https://github.com/swc-project/swc/issues/10830)) ([cac40f1](https://github.com/swc-project/swc/commit/cac40f135d517e9c3e1dbbe9250c8b1dbe39320b))


- **(es/lints)** Remove warnings without features ([#10794](https://github.com/swc-project/swc/issues/10794)) ([41d507f](https://github.com/swc-project/swc/commit/41d507fe1e9c4ef7fa0bb7a266b75f1376c90fff))


- **(es/parser)** Reduce token query ([#10834](https://github.com/swc-project/swc/issues/10834)) ([5cd5185](https://github.com/swc-project/swc/commit/5cd5185a7a51ec838a12005c44dc982642af9508))


- **(es/parser)** Reduce call to `parse_decorators` ([#10846](https://github.com/swc-project/swc/issues/10846)) ([356d3a0](https://github.com/swc-project/swc/commit/356d3a0850d32e79ff9615f3b696207902732895))


- **(es/parser)** Remove duplicate check ([#10847](https://github.com/swc-project/swc/issues/10847)) ([2b04efd](https://github.com/swc-project/swc/commit/2b04efd5403adec38251bf9059a5dec600049288))


- **(es/preset-env)** Use strpool,phf for corejs2 data ([#10803](https://github.com/swc-project/swc/issues/10803)) ([1652fd8](https://github.com/swc-project/swc/commit/1652fd8038ed8ea306fce914948ea6e121d5845f))


- **(es/react)** Remove redundant `replace` calls ([#10795](https://github.com/swc-project/swc/issues/10795)) ([a670b37](https://github.com/swc-project/swc/commit/a670b37c334b69a57f31f8940916d3f66c9ab504))


- **(es/react)** Remove `count_children` ([#10818](https://github.com/swc-project/swc/issues/10818)) ([2116ab2](https://github.com/swc-project/swc/commit/2116ab2fa25b0d4121d0dc69afd42e41ea24e299))


- **(hstr)** Cleanup duplicate header ([#10812](https://github.com/swc-project/swc/issues/10812)) ([630dde9](https://github.com/swc-project/swc/commit/630dde93c9deb35c38d4d27c9e8083349ebad5bc))


- **(hstr)** Make the deallocation of `Atom`s explicit ([#10813](https://github.com/swc-project/swc/issues/10813)) ([406433d](https://github.com/swc-project/swc/commit/406433d55d00c2e14cd72e438ca36666936c62cd))


- **(hstr)** Remove `is_global` ([#10820](https://github.com/swc-project/swc/issues/10820)) ([afda0f9](https://github.com/swc-project/swc/commit/afda0f9d0d65e231615f955e365f77a18dc716d1))

### Testing



- **(es/plugin)** Test memory layout of archived types ([#10841](https://github.com/swc-project/swc/issues/10841)) ([502e991](https://github.com/swc-project/swc/commit/502e991a8bccaefef03f6379bbda8522bde4f62e))

## [1.12.11] - 2025-07-08

### Bug Fixes



- **(ci)** Fix CI ([#10790](https://github.com/swc-project/swc/issues/10790)) ([b3f9760](https://github.com/swc-project/swc/commit/b3f97604b8bc4713ab1f91fa3bd732b7af9cb2e9))


- **(es)** Use `default-features = false` for `swc` crate usages ([#10776](https://github.com/swc-project/swc/issues/10776)) ([50b2eac](https://github.com/swc-project/swc/commit/50b2eacdf7bb3705b5be1ba63e9acdb143e82d40))


- **(es)** Make `swc_typescript` optional ([#10792](https://github.com/swc-project/swc/issues/10792)) ([c32569d](https://github.com/swc-project/swc/commit/c32569dd558e3bd4e27329275e090cc716a6e440))


- **(preset-env)** Fix `default` value for `caniuse` ([#10754](https://github.com/swc-project/swc/issues/10754)) ([aa4cd5b](https://github.com/swc-project/swc/commit/aa4cd5ba7c79229f8082354d470b10d420b5f8cb))


- **(preset-env)** Revert `default` value ([#10778](https://github.com/swc-project/swc/issues/10778)) ([7af5824](https://github.com/swc-project/swc/commit/7af58242c2a4c8b7c1a8df8a2dd7d854892fad5e))

### Features



- **(es/minifeir)** Inline lazily initialized literals ([#10752](https://github.com/swc-project/swc/issues/10752)) ([fd5d2e2](https://github.com/swc-project/swc/commit/fd5d2e2f33db0d6aee8d133fe23047422a67e28c))


- **(es/minifier)** Evaluate `Number.XXX` constants ([#10756](https://github.com/swc-project/swc/issues/10756)) ([c47dab5](https://github.com/swc-project/swc/commit/c47dab5f904ecce101b0388cab26805741bc9bd2))


- **(es/minifier)** Implement partial evaluation of array join ([#10758](https://github.com/swc-project/swc/issues/10758)) ([bdf3a98](https://github.com/swc-project/swc/commit/bdf3a98bb45f6f9cdf1b9a8ed8d292ccce257d4e))


- **(swc_core)** Expose `swc_ecma_parser/unstable` ([#10744](https://github.com/swc-project/swc/issues/10744)) ([db0679e](https://github.com/swc-project/swc/commit/db0679e5ca675ea7b54bc8804897f1a2f313fe0c))

### Miscellaneous Tasks



- **(common)** Remove `clone()` in proc macro ([#10762](https://github.com/swc-project/swc/issues/10762)) ([12e3180](https://github.com/swc-project/swc/commit/12e318036caccee6d9b516baf391fccb07118ca9))


- **(deps)** Update `browserslist-rs` to `0.19` ([#10750](https://github.com/swc-project/swc/issues/10750)) ([f8bf21c](https://github.com/swc-project/swc/commit/f8bf21c07202ac864d1772d5c46e1a4e99bda2fa))


- **(deps)** Remove unused deps with cargo-shear ([#10765](https://github.com/swc-project/swc/issues/10765)) ([f4e4974](https://github.com/swc-project/swc/commit/f4e4974ffeec16b7d6d5b8def107b82bfc3c7e1d))


- **(es/module)** Drop `node` feature of `swc_ecma_loader` ([#10761](https://github.com/swc-project/swc/issues/10761)) ([44471b5](https://github.com/swc-project/swc/commit/44471b51518d3c74ee4f3992f8474687ada13fc0))


- **(plugin/runner)** Remove unused feature and dependency ([#10764](https://github.com/swc-project/swc/issues/10764)) ([a7d8a0a](https://github.com/swc-project/swc/commit/a7d8a0ac890bd4956d6b400017d6ddeba97e9ab0))

### Performance



- **(es/lexer)** Use `bitflags` for `Syntax` ([#10676](https://github.com/swc-project/swc/issues/10676)) ([bf8c722](https://github.com/swc-project/swc/commit/bf8c722e25018baa45706b890b7464f90fc03f6a))


- **(es/lexer)** Do not scan number if there's no underscore ([#10788](https://github.com/swc-project/swc/issues/10788)) ([f5d92ee](https://github.com/swc-project/swc/commit/f5d92ee1bf0a2fbeece6570b745ea833f6cd355e))


- **(es/lints)** Make rules not parallel ([#10772](https://github.com/swc-project/swc/issues/10772)) ([4e6001c](https://github.com/swc-project/swc/commit/4e6001c5a465ce13547abc2a6b24ae724e1adba5))


- **(es/lints)** Merge critical rules ([#10773](https://github.com/swc-project/swc/issues/10773)) ([816e75a](https://github.com/swc-project/swc/commit/816e75a2094fd633243174f7953c9920f4851c79))


- **(es/parser)** Reduce the number of context set ops ([#10742](https://github.com/swc-project/swc/issues/10742)) ([08b4e8b](https://github.com/swc-project/swc/commit/08b4e8b285ddb49eeefd06d1f745d9aec25427c1))


- **(es/parser)** Reduce value set operations for context ([#10751](https://github.com/swc-project/swc/issues/10751)) ([4976b12](https://github.com/swc-project/swc/commit/4976b12f9398c471c0f77e69ad141e0172927a2b))


- **(es/parser)** Reduce query ops of current token ([#10766](https://github.com/swc-project/swc/issues/10766)) ([4304f91](https://github.com/swc-project/swc/commit/4304f9129c1d511c94898727306a50535e11ad39))


- **(es/parser)** Remove useless call in `parse_ident` ([#10770](https://github.com/swc-project/swc/issues/10770)) ([4ca12c9](https://github.com/swc-project/swc/commit/4ca12c97259fdf882b0849112473f3deea54be36))


- **(es/renamer)** Reduce time complexity in case of conflict ([#10749](https://github.com/swc-project/swc/issues/10749)) ([0279914](https://github.com/swc-project/swc/commit/02799141bf0d040b6536f3333cfed852b80c611b))


- **(hstr)** Do not compare string during creating atoms ([#10791](https://github.com/swc-project/swc/issues/10791)) ([43a4f11](https://github.com/swc-project/swc/commit/43a4f117cb0089bc7e117173507886218b064d62))


- Replace `rayon` with `par-iter` ([#10774](https://github.com/swc-project/swc/issues/10774)) ([a6e6ebe](https://github.com/swc-project/swc/commit/a6e6ebeacafb8bccbaf3cb9bec3c87861461437a))

### Refactor



- **(es)** Make `swc_ecma_lint` optional for `swc` crate ([#10767](https://github.com/swc-project/swc/issues/10767)) ([f80415b](https://github.com/swc-project/swc/commit/f80415baa60a55a4dea31eff9b1c3431705183e5))


- **(es/lexer)** Use const fn in `SyntaxFlags` ([#10737](https://github.com/swc-project/swc/issues/10737)) ([b9eb23a](https://github.com/swc-project/swc/commit/b9eb23aec3dd0963afa5080d53bca4dd0325f233))


- **(es/parser)** Cleanup `parse_setter_param` ([#10745](https://github.com/swc-project/swc/issues/10745)) ([70734f4](https://github.com/swc-project/swc/commit/70734f40d4ff0d9ad140b705c3356b44f8bd5663))


- **(es/parser)** Cleanup `typed-arena` ([#10769](https://github.com/swc-project/swc/issues/10769)) ([ce5138d](https://github.com/swc-project/swc/commit/ce5138d3aae6e23127fc76da9f439d47b7c59374))


- **(es/parser)** Cleanup for ctx ([#10777](https://github.com/swc-project/swc/issues/10777)) ([d60a611](https://github.com/swc-project/swc/commit/d60a611dc76244b2b12e7676bbf4995bec5ba37c))


- **(es/parser)** Delete `with_ctx` ([#10779](https://github.com/swc-project/swc/issues/10779)) ([ce057c5](https://github.com/swc-project/swc/commit/ce057c55efcb937437af5ef0fd583240b0538a0e))


- **(es/parser)** Cleanup ([#10781](https://github.com/swc-project/swc/issues/10781)) ([176ce36](https://github.com/swc-project/swc/commit/176ce36d2407b6d054ec6088a45025b76791fed3))


- **(es/preset)** Remove deprecated `preset_env` function and `feature` module ([#10759](https://github.com/swc-project/swc/issues/10759)) ([fa0e0ab](https://github.com/swc-project/swc/commit/fa0e0abf41658271cde27b6852f42dd00dfd8f4a))


- **(es/preset-env)** Use phf for corejs3 entry ([#10712](https://github.com/swc-project/swc/issues/10712)) ([658b26d](https://github.com/swc-project/swc/commit/658b26d8386c17cbe7abf740d905d41eac96b7f7))

### Testing



- **(es/minifier)** Update the terser test list ([#10748](https://github.com/swc-project/swc/issues/10748)) ([1eace01](https://github.com/swc-project/swc/commit/1eace01303a98a522b67f9005601cbebd0d5b71e))


- **(es/minifier)** Update the passing test list ([#10782](https://github.com/swc-project/swc/issues/10782)) ([8aa888b](https://github.com/swc-project/swc/commit/8aa888bc2a0fc0ed84d189725af917ae2be9f905))


- **(es/parser)** Add a test for duplicate labels ([#10784](https://github.com/swc-project/swc/issues/10784)) ([28fc643](https://github.com/swc-project/swc/commit/28fc64310c0fdb0491a1121a801f9a5d184109eb))

### Pref



- **(hstr)** Do not compare static tag ([#10771](https://github.com/swc-project/swc/issues/10771)) ([5d3ce83](https://github.com/swc-project/swc/commit/5d3ce83add12c4b147d238e1cd6fdf6083c696d2))

## [1.12.9] - 2025-07-01

### Bug Fixes



- **(es/lexer)** Parse uppercase hex numbers correctly ([#10728](https://github.com/swc-project/swc/issues/10728)) ([ead6256](https://github.com/swc-project/swc/commit/ead62560b028f74feee506484233de2763ed3378))


- **(es/lexer)** Allow keywords as jsx attribute names ([#10730](https://github.com/swc-project/swc/issues/10730)) ([04ef20a](https://github.com/swc-project/swc/commit/04ef20ad9b7e43dc70666258cb2c996a1a5e4074))


- **(es/minifier)** Fix top level option ([#10227](https://github.com/swc-project/swc/issues/10227)) ([485fced](https://github.com/swc-project/swc/commit/485fced53b9318f707d05d64a1c7adf28d00e41a))


- **(es/minifier)** Do not drop self-referential class expressions ([#10710](https://github.com/swc-project/swc/issues/10710)) ([39e6c2e](https://github.com/swc-project/swc/commit/39e6c2ec2d1528594867408cb9c3071319b32f00))


- **(es/minifier)** Mark `cons` and `alt` of `CondExpr` as `ref` ([#10740](https://github.com/swc-project/swc/issues/10740)) ([9649cc8](https://github.com/swc-project/swc/commit/9649cc80b66edb54db1dadc9214f2c19ea008f24))


- **(es/minifier)** Fix termination detection  ([#10741](https://github.com/swc-project/swc/issues/10741)) ([87bc698](https://github.com/swc-project/swc/commit/87bc69883daae48b633556b55caeb480b7ba2d97))


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

## [1.12.7] - 2025-06-26

### Bug Fixes



- **(es/minifier)** Fix condition for preserving properties ([#10694](https://github.com/swc-project/swc/issues/10694)) ([5c57a05](https://github.com/swc-project/swc/commit/5c57a0559641121218aa8ef2be297c3a97570e70))


- **(es/minifier)** Drop pure tagged string call expr ([#10702](https://github.com/swc-project/swc/issues/10702)) ([85cd9a7](https://github.com/swc-project/swc/commit/85cd9a71d57d7c0e37b2158bfddfbdbe2b09622f))


- **(es/parser)** Improve error message for template literals ([#10690](https://github.com/swc-project/swc/issues/10690)) ([a066b76](https://github.com/swc-project/swc/commit/a066b7629079ad15850c41a982031a62decebd2d))


- **(es/parser)** Rescan `>=` for JSX closing tag ([#10693](https://github.com/swc-project/swc/issues/10693)) ([fe82c4c](https://github.com/swc-project/swc/commit/fe82c4cf83b4cea05403b87bc665f9d0a84928e1))


- **(es/parser)** Support keywords as JSX member expression properties ([#10701](https://github.com/swc-project/swc/issues/10701)) ([643253d](https://github.com/swc-project/swc/commit/643253d5e1df643fd79eb3f494b56f15bdcbdb47))

### Features



- **(es/parser)** Add `override` and `out` keyword ([#10695](https://github.com/swc-project/swc/issues/10695)) ([636d7a3](https://github.com/swc-project/swc/commit/636d7a3830ca3de01ee2078385820e3a37d62343))


- **(es/parser)** Enable import attributes unconditionally ([#10706](https://github.com/swc-project/swc/issues/10706)) ([5ecc3ca](https://github.com/swc-project/swc/commit/5ecc3ca4da6998c8dc9c94d8c25ab10a3b70b62b))


- **(es/parser)** Expose Token API with unstable feature flag ([#10699](https://github.com/swc-project/swc/issues/10699)) ([750c7d4](https://github.com/swc-project/swc/commit/750c7d4c84d34091207932dde9e3e1aaac0cf391))

### Performance



- **(es/parser)** Do not compare error each time ([#10696](https://github.com/swc-project/swc/issues/10696)) ([0ae0341](https://github.com/swc-project/swc/commit/0ae0341d105a9c57810204352b775acdee26d18e))

### Testing



- **(es)** Remove outdated test snapshots ([#10689](https://github.com/swc-project/swc/issues/10689)) ([03d520b](https://github.com/swc-project/swc/commit/03d520bc5be02d45acb173c49d7fcd9580ccacf1))

<!-- generated by git-cliff -->
