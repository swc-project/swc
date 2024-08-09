# Changelog
## [unreleased]

### Bug Fixes



- **(common)** Do not generate invalid source map ([#9050](https://github.com/swc-project/swc/issues/9050)) ([9d65c77](https://github.com/swc-project/swc/commit/9d65c776025346985acaf36bc1d54134ebc4c7c4))


- **(common)** Require newer version of allocator ([#9386](https://github.com/swc-project/swc/issues/9386)) ([4e854c7](https://github.com/swc-project/swc/commit/4e854c79960df75f5259bee8ab71ab77a57f55f3))


- **(common)** Remove unused import ([#9387](https://github.com/swc-project/swc/issues/9387)) ([f530476](https://github.com/swc-project/swc/commit/f5304761b315a961fe2c1165907bf35a084a7c86))


- **(es/minifier)** Preserve function length ([#9389](https://github.com/swc-project/swc/issues/9389)) ([679682c](https://github.com/swc-project/swc/commit/679682ce36e35dd94bbc4b3406d3c8173db10b96))


- **(es/module)** Drop the level of a few tracing events ([#9380](https://github.com/swc-project/swc/issues/9380)) ([95af253](https://github.com/swc-project/swc/commit/95af2536a2cd5040f44e93f2eea9cf577558f335))


- **(es/parser)** Fix span of EOF errors ([#9378](https://github.com/swc-project/swc/issues/9378)) ([f702657](https://github.com/swc-project/swc/commit/f7026578b9ac50b5ac9f08fa51b1e320040ee083))


- **(es/typescript)** Enable Injector to process JSX ([#9395](https://github.com/swc-project/swc/issues/9395)) ([e24e2ff](https://github.com/swc-project/swc/commit/e24e2ffe5971d2d1ef667c910a12b94ca41f1b52))


- **(es/typescript)** Strip declaration of exported function overloads ([#9397](https://github.com/swc-project/swc/issues/9397)) ([5c8aa52](https://github.com/swc-project/swc/commit/5c8aa522da205fc7fab156cb9d44c8acca872523))

### Features



- **(visit)** Make `kind()` accessible without `swc_visit` ([#9382](https://github.com/swc-project/swc/issues/9382)) ([021e41d](https://github.com/swc-project/swc/commit/021e41d1534da5d9ba17b9d8f14da6652133f467))

### Miscellaneous Tasks



- **(common)** Remove `dbg` log ([#9384](https://github.com/swc-project/swc/issues/9384)) ([a538ca1](https://github.com/swc-project/swc/commit/a538ca1990e7b5b8841bc4a883b464c7690e2022))


- **(es/typescript)** Remove `unreachable_visit_mut_type` ([#9390](https://github.com/swc-project/swc/issues/9390)) ([8e49c90](https://github.com/swc-project/swc/commit/8e49c904d80a04610d307ce1751f5a572871abbb))

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

<!-- generated by git-cliff -->
