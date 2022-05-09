# Changelog
## [unreleased]

### Bug Fixes



- **(es/minifier)** Fix handling of `NaN` (#4593) ([dd09cdf](https://github.com/swc-project/swc/commit/dd09cdf8b12d53aa6060e14857fa3efeddf41334))

## [1.2.180] - 2022-05-09

### Bug Fixes



- **(es)** Use `unresolved_mark` (#4573) ([0868409](https://github.com/swc-project/swc/commit/086840956d696816c694fc2fd96258351aab9573))


- **(es/minifier)** Improve sequential inliner (#4570) ([af368ee](https://github.com/swc-project/swc/commit/af368eead2529c3340e985acddf2948af44aba2e))


- **(es/minifier)** Preserve more identifiers if `eval` or `with` exists (#4580) ([e43689b](https://github.com/swc-project/swc/commit/e43689b7d58354bf2847cb47bfc82eb208d5b5e6))


- **(es/minifier)** Don't create an invalid labeled statement (#4581) ([7e80c10](https://github.com/swc-project/swc/commit/7e80c10cba50a8a1f74875ba8a90c4f282b33fc0))


- **(es/minifier)** Unwrap blocks more carefully (#4586) ([8db3442](https://github.com/swc-project/swc/commit/8db3442216e84b0535fa2884208e19020f22ec19))


- **(es/minifier)** Consider more aliases in sequences pass (#4583) ([3521ce0](https://github.com/swc-project/swc/commit/3521ce09e7a2c3168f17491196f6fbc835637380))


- **(es/resolver)** Fix handling of a complex try catch (#4574) ([9e79f9c](https://github.com/swc-project/swc/commit/9e79f9ced697df4aba51219ce4759238a53c11e3))


- **(es/resolver)** Fix more try catch issues (#4582) ([56c3010](https://github.com/swc-project/swc/commit/56c3010f6ba0cdebf4a1631c4ad54e10584c0422))


- **(html/parser)** Add recovery for attributes on html and body (#4566) ([c7d20e4](https://github.com/swc-project/swc/commit/c7d20e43e63cb2c45cd589e3c72811575fca2f07))


- **(node)** Use `jemallocator` on linux (#4591) ([af91094](https://github.com/swc-project/swc/commit/af91094b2db0809f02e6f0a6f07b021d12aa1512))

### Features



- **(config)** Make all configuration overridable (#4575) ([7fc9bbc](https://github.com/swc-project/swc/commit/7fc9bbccd9ce867d9851cb3518501509b5a3f97e))


- **(es/ast)** Add methods for parens (#4576) ([55d0ee6](https://github.com/swc-project/swc/commit/55d0ee6cba32d3a9d15cdb5485fb65a84bebe123))


- **(html/parser)** Parse document fragment (#4579) ([a34dea1](https://github.com/swc-project/swc/commit/a34dea11d0425dde75c45b6ba16682cc4df087a8))

### Miscellaneous Tasks



- **(ci)** Improve CI scripts (#4572) ([f23c943](https://github.com/swc-project/swc/commit/f23c943227e8438dabeaa951bab552cd3d076e41))

### Refactor



- **(html/parser)** Resolve TODO (#4577) ([4cc247f](https://github.com/swc-project/swc/commit/4cc247f39f53ee2c4183c3881c3b686a109a3419))

### Testing



- **(es/minifier)** Fix test system (#4571) ([bf5ee01](https://github.com/swc-project/swc/commit/bf5ee018b3d2cbf235b48e2325374f3ec545703a))


- **(html/parser)** Add tests (#4565) ([adbce64](https://github.com/swc-project/swc/commit/adbce64f28ba72f73de375b91d72382d98362824))


- **(html/parser)** Improve script on/off tests (#4564) ([4838267](https://github.com/swc-project/swc/commit/4838267015d19299f09e90efc2e41d22502be390))

## [1.2.179] - 2022-05-08

### Bug Fixes



- **(es/minifier)** Distinguish `raw` and `cooked` while joining template literals (#4559) ([f9b6016](https://github.com/swc-project/swc/commit/f9b6016d4b990032505c0dbb5b5bf82949c7d74d))


- **(es/minifier)** Fix handling of template literals (#4563) ([920d9a7](https://github.com/swc-project/swc/commit/920d9a76784b6e2ac9ccbfd826f2253410bf2be5))


- **(html/parser)** Fix for noah's ark clause (#4558) ([7ef6372](https://github.com/swc-project/swc/commit/7ef637263e57b9c995de1a847606f878991054fd))


- **(html/parser)** Fix adoption agency algorithm (#4552) ([d6e4885](https://github.com/swc-project/swc/commit/d6e48850b65ada6dae4da75347c6669161cb036a))

### Documentation



- **(es/resolver)** Add docs for top-level mark (#4560) ([13cc228](https://github.com/swc-project/swc/commit/13cc2282627f852d5b114332a83816de2a47742b))

### Features



- **(es/minifier)** Drop vars using sequential inliner (#4547) ([c5b4ef4](https://github.com/swc-project/swc/commit/c5b4ef4377874d8659d5b4e6c4099e1eac6c40f1))


- **(es/minifier)** Remove duplicate control flow in nested blocks (#4569) ([b3b6fd4](https://github.com/swc-project/swc/commit/b3b6fd448c35fc25cd99d210c684e90c68da0b04))

### Refactor



- **(plugin)** Align deps (#4568) ([846a319](https://github.com/swc-project/swc/commit/846a31919eba58b7b14788ccc26b0ff23e488044))

## [1.2.178] - 2022-05-07

### Bug Fixes



- **(es/compat)** Memorize computed props in logical assignment (#4525) ([2e74787](https://github.com/swc-project/swc/commit/2e7478787040645ef9cd162ef18e948c112c93d8))


- **(es/minifier)** Respect `keepClassNames` for class expressions (#4536) ([3d5d234](https://github.com/swc-project/swc/commit/3d5d234047bb7e3f76189fa586030014c7c29f46))


- **(es/minifier)** Skip getter/setter when collapsing vars (#4557) ([5d3a01a](https://github.com/swc-project/swc/commit/5d3a01ad352fcea33db46de3b144950944b18b62))


- **(es/modules)** Preserve extensions (#4524) ([f3b262e](https://github.com/swc-project/swc/commit/f3b262e340cdd5aaa5ce4008936e3ba696f3dc06))


- **(es/parser)** Revert #4067 (#4540) ([2831059](https://github.com/swc-project/swc/commit/28310596a6c2c62cab3e5124c9b68439e152ba18))


- **(es/parser)** Revert #4287 (#4542) ([e2fde1a](https://github.com/swc-project/swc/commit/e2fde1a9a7ea702439666fdee6b2a378e70d9a7e))


- **(html/lexer)** Fix lexing of numeric characters (#4544) ([6980381](https://github.com/swc-project/swc/commit/698038107de8f7ec9ee2b2981b4137d47182a022))


- **(html/parser)** Fix a bug related to parsing foreign elements (#4527) ([2f6f8fa](https://github.com/swc-project/swc/commit/2f6f8fa717c4a969221958bc2c70a3f68590d93b))


- **(html/parser)** Fix parsing of cdata in foreign context (#4531) ([5dc9376](https://github.com/swc-project/swc/commit/5dc9376a4ba4d449d1c3f2755a6aca6a77919f6f))


- **(html/parser)** Fix a bug with optional `li` (#4526) ([6310eab](https://github.com/swc-project/swc/commit/6310eab96652bbe747eaf1b467894b2dbacfab98))


- **(html/parser)** Fix parsing of comments in `textarea` (#4530) ([79090e1](https://github.com/swc-project/swc/commit/79090e1b2abce3dc396f25a5851637c675b6c87e))


- **(html/parser)** Fix parsing of `nobr` (#4535) ([e6042a5](https://github.com/swc-project/swc/commit/e6042a5e692c785bb12058f1eb63e728f3191cef))


- **(html/parser)** Fix parsing of cdata (#4537) ([07cf28a](https://github.com/swc-project/swc/commit/07cf28a168c0e4619c3293ece180922d5e9a632d))


- **(html/parser)** Fix parsing of newline in `textarea` (#4543) ([dd40e7b](https://github.com/swc-project/swc/commit/dd40e7bf69b355f00b68819785365603bc7634a2))


- **(html/parser)** Fix support for document mode (#4539) ([e11ee88](https://github.com/swc-project/swc/commit/e11ee88ea09ef1a67e2a2e063e91ce1df40ca8fb))

### Features



- **(plugin)** Make plugin source map api use `SourceMapper` (#4541) ([10f903d](https://github.com/swc-project/swc/commit/10f903dd3952286f84c0957d96b9c43236938de5))

### Miscellaneous Tasks



- **(repo)** Configure `prettier` (#4523) ([a6d404a](https://github.com/swc-project/swc/commit/a6d404a8c28ab82f15d9f7fbd849e27713a49872))

### Refactor



- **(html/parser)** Cleanup (#4545) ([446172f](https://github.com/swc-project/swc/commit/446172f14575b56d36ef72175c16fa05f374736c))

### Testing



- **(es/minifier)** Categorize more tests (#4538) ([3d3e3bb](https://github.com/swc-project/swc/commit/3d3e3bb1d27ba4a75464c925d8fe03f703902e49))


- **(es/minifier)** Ignore difference of parens (#4546) ([b0efd00](https://github.com/swc-project/swc/commit/b0efd00f38edb7ecb87c53590821d908316cfcba))


- **(html/parser)** Add integration tests from html5lib-test (#4517) ([a4a815b](https://github.com/swc-project/swc/commit/a4a815b28815b1c875c73f0a153fb219558e26ce))

### Build



- **(plugin)** Update `swc_plugin_proxy` (#4551) ([b5a2033](https://github.com/swc-project/swc/commit/b5a203399455304f3be7941b751e8a9847b0bb97))

## [1.2.177] - 2022-05-04

### Bug Fixes



- **(html/parser)** Fix a bug of unwrapping element without parent (#4505) ([597c0c6](https://github.com/swc-project/swc/commit/597c0c672a9111b1a0b6e7219edb577866252343))


- **(node)** Fix tls allocation issue (#4514) ([3d5c0fa](https://github.com/swc-project/swc/commit/3d5c0fa966f96c7e463c5de8819c4c8eea65f3aa))

### Features



- **(es/parser)** Reject accessors named `constructor` (#4520) ([0e0ded1](https://github.com/swc-project/swc/commit/0e0ded121cbf0e43bc061030c8933d4079a898b2))


- **(plugin)** Expose `Pos` (#4516) ([c0432e4](https://github.com/swc-project/swc/commit/c0432e46df1fa15d8819859211913796e59d9192))

### Miscellaneous Tasks



- **(repo)** Fix lints (#4519) ([33f58fa](https://github.com/swc-project/swc/commit/33f58faa0bb4f87ee13e38a704ca929efc21430b))

### Testing



- **(html/parser)** Add tests (#4507) ([202a6e4](https://github.com/swc-project/swc/commit/202a6e4a0100e5ddc3a3c920b447aca803fffbae))

## [1.2.176] - 2022-05-04

### Bug Fixes



- **(es/compat)** Revert a wrong patch about private properties ([97e0e27](https://github.com/swc-project/swc/commit/97e0e271d57ae2c2f6a4d8a09032885ca9a27be9))


- **(es/compat)** Fix the position of inserted statements in `class_properties` (#4511) ([9e45882](https://github.com/swc-project/swc/commit/9e45882b8407e46573b363ea47ddbbc7cf9c82e4))

## [1.2.175] - 2022-05-03

### Bug Fixes



- **(css/prefixer)** Add prefix for `print-color-adjust` (#4503) ([90ac93a](https://github.com/swc-project/swc/commit/90ac93af12b9fb8d50f15ce98a7af5c5ce21d77b))


- **(es/bugfixes)** Fix handling of syntax context (#4490) ([a444726](https://github.com/swc-project/swc/commit/a444726fe3014c1a241439d8126188c0c5fe5212))


- **(es/compat)** Support updating a private field with bigint value (#4136) ([1e1d081](https://github.com/swc-project/swc/commit/1e1d081805e51d494d2d22568b656698a28849f0))


- **(es/compat)** Visit default export in `static_block` (#4500) ([c4b156c](https://github.com/swc-project/swc/commit/c4b156ce1f4910189cc796c483c7bab92ebd290d))


- **(es/decorators)** Make legacy decorator identical to `tsc` (#4496) ([f30ffdf](https://github.com/swc-project/swc/commit/f30ffdf200555ba59afe88c3dc4ba6fa89d76fe6))


- **(html/parser)** Fix adoption agency algorithm (#4487) ([00358e1](https://github.com/swc-project/swc/commit/00358e10fc00e9118e933da8a8674e347d0d60f0))


- **(html/parser)** Fix bugs (#4502) ([fca84eb](https://github.com/swc-project/swc/commit/fca84eb0f27cec0821b1dd63a331de9b7d1118b4))


- **(html/parser)** Fix parsing of `select` (#4504) ([b8588c4](https://github.com/swc-project/swc/commit/b8588c4a4511373abf53ed303f975b7c9eeaec61))


- **(html/parser)** Fix parsing of a table with a table (#4506) ([efe87bc](https://github.com/swc-project/swc/commit/efe87bcbf65c5fe7ebf8dd219842ca792f823292))


- **(node/types)** Add types for `jsc.minify.format` (#4492) ([3ed1538](https://github.com/swc-project/swc/commit/3ed1538bfe3cc8fb008b34c7a78dc239115f4159))

### Features



- **(es/compat)** Verify private property access (#4465) ([de53a6f](https://github.com/swc-project/swc/commit/de53a6fa9d3e983773d458f0d7e6df561f7cb5d3))


- **(es/lints)** Implement `no-var` (#4485) ([17f237d](https://github.com/swc-project/swc/commit/17f237d3ba97fc14d098cef2038bb846ac2b7c8d))


- **(es/parser)** Reject private field called `#constructor` (#4491) ([857e798](https://github.com/swc-project/swc/commit/857e798194e18ec874ddd51c27d136ca1e5298b8))


- **(es/preset-env)** Update data (#4497) ([5c5337d](https://github.com/swc-project/swc/commit/5c5337d342b442c7ebbe1293b7ab705d74e482bc))

### Refactor



- **(es/minifier)** Cleanup (#4489) ([50b2049](https://github.com/swc-project/swc/commit/50b20496cdd1d5fb2dd119c633b5dc7608cb638c))

### Testing



- **(es/decorators)** Migrate some tests to file-based fixture tests (#4510) ([8629e0c](https://github.com/swc-project/swc/commit/8629e0c665bf493c480ebb81112667fc0b4abc83))

## [1.2.174] - 2022-04-30

### Bug Fixes



- **(es/helpers)** Update `_interopRequireWildcard` (#4479) ([7d40208](https://github.com/swc-project/swc/commit/7d40208377133b0fcd153c5bfcf47f6b489113c1))


- **(es/minifier)** Disable some passes for `hoist_props` (#4468) ([effc85d](https://github.com/swc-project/swc/commit/effc85df572609a180f9a28177a5b37ed960c860))


- **(es/minifier)** Fix skipping logic of sequential inliner (#4469) ([233c4d5](https://github.com/swc-project/swc/commit/233c4d5b860d557710bfe654f76d7901e5d0b3a0))


- **(html)** Fix bugs of parser and codegen (#4461) ([8bdfcd9](https://github.com/swc-project/swc/commit/8bdfcd996aa5abde0e50743b90f4d36fd25003ba))


- **(html/parser)** Fix bugs (#4459) ([2098228](https://github.com/swc-project/swc/commit/20982288fb05dcb4e2c72e5ea4c0888a0e946580))

### Features



- **(es/lints)** Implement `no-throw-literal` (#4477) ([3a8cade](https://github.com/swc-project/swc/commit/3a8cade2091bea83769b5140a92dad7b2a277ce0))


- **(es/minifier)** Drop more returns (#4471) ([2739546](https://github.com/swc-project/swc/commit/273954640aa2d22d0e65f4d186bcb6add0844cb1))


- **(es/minifier)** Consider cost of functions for inlining (#4470) ([7a584d7](https://github.com/swc-project/swc/commit/7a584d755aa0dc70c8c367f1c0c4b61e2dbc34df))


- **(es/minifier)** Drop pure `new` calls (#4478) ([918c9c8](https://github.com/swc-project/swc/commit/918c9c8a21c248617aef4474380c94f9f98df1dc))


- **(es/minifier)** Add `pristine_globals` (#4480) ([09ba3c0](https://github.com/swc-project/swc/commit/09ba3c0e688b2bd66e707836ecba23feee93fb8c))


- **(html/minifier)** Remove `javascript:` prefix (#4460) ([a1877e7](https://github.com/swc-project/swc/commit/a1877e740acf6bf51421b97c27236b0f208eaf9d))


- **(html/minifier)** Remove duplicate attributes (#4474) ([750d655](https://github.com/swc-project/swc/commit/750d6551fcbdf9c0664bfa6ad97d394ba6c641de))

### Miscellaneous Tasks



- **(es/minifier)** Update debugging utils (#4467) ([c45b0df](https://github.com/swc-project/swc/commit/c45b0df8770727b84ede1c3348c9769f5d4367c2))

## [1.2.173] - 2022-04-28

### Bug Fixes



- **(es)** Remove wrong debug assertion (#4445) ([962cf4a](https://github.com/swc-project/swc/commit/962cf4a08caaee6dc0579aed556df55bc60bf093))


- **(es/async-generator)** Fix `yield*` in async generators (#4452) ([0bc0bae](https://github.com/swc-project/swc/commit/0bc0bae90dcf6f448f45d35edc02ce025c0d8114))


- **(es/parser)** Throw syntax error for missing function expr body (#4462) ([393cfa8](https://github.com/swc-project/swc/commit/393cfa84b65264a07f90387a0f7852535d87cd6d))


- **(es/preset-env)** Do not import new features when using old core-js (#4458) ([4262874](https://github.com/swc-project/swc/commit/4262874ce458260fc6a7d363522b5c6591df93b3))


- **(html/parser)** Fix a bug with nested tags (#4438) ([8c4dc4c](https://github.com/swc-project/swc/commit/8c4dc4cc46e73265ad45e63fecd513f4ba4cf7bb))


- **(html/parser)** Parse table including broken one (#4451) ([6e60813](https://github.com/swc-project/swc/commit/6e6081336714861055a1ae148f1305e2ab180efc))


- **(html/parser)** Fix fosting logic for text nodes (#4457) ([65a158a](https://github.com/swc-project/swc/commit/65a158a66b2a394f70757ae363ab329ced71436f))

### Features



- **(es/parser)** Reject indirect opt chain in assignment (#4447) ([df7b3f6](https://github.com/swc-project/swc/commit/df7b3f611a7bf5509e143cf81a69e0443cf80288))


- **(html/minifier)** Compress whitespaces (#4463) ([0ae4350](https://github.com/swc-project/swc/commit/0ae43502f3f54ad7d77b790c9f1ad2af63d32090))

### Miscellaneous Tasks



- **(es/minifier)** Don't run tests with infinite loops (#4448) ([ec7dfb9](https://github.com/swc-project/swc/commit/ec7dfb92098897d9b8dbe5726bef78ea2a868053))

### Testing



- **(html/codegen)** Improve fixture testing (#4450) ([f30e771](https://github.com/swc-project/swc/commit/f30e7717a20348af2f6ef65bb7ff800fbffeadb4))

## [1.2.172] - 2022-04-26

### Bug Fixes



- **(es/ast)** Fix tag of `BigInt` (#4440) ([2813eaa](https://github.com/swc-project/swc/commit/2813eaadcd0703b9f8c11d77f91c70cd002c9296))


- **(es/minifier)** Remove the last break in the last `BlockStmt` (#4413) ([83244ad](https://github.com/swc-project/swc/commit/83244add338c3dd1a1a84fec94b73d1931699cdb))


- **(es/minifier)** Don't drop arguments to an IIFE without body (#4419) ([aa19b65](https://github.com/swc-project/swc/commit/aa19b65f9cb1170c36991649348e064406523699))


- **(es/minifier)** Preserve more side effects (#4420) ([8ab12fd](https://github.com/swc-project/swc/commit/8ab12fd97b035e4131775676cdd33daaf31587b8))


- **(es/minifier)** Fix analysis of update expressions (#4428) ([9733917](https://github.com/swc-project/swc/commit/9733917cc718ad4800697ffc9203ad96d5dd3f3f))


- **(es/minifier)** Remove wrong logic for optimizing `delete`s (#4429) ([8118569](https://github.com/swc-project/swc/commit/8118569045135e06fcaadc61255b9ca09ef120ea))


- **(es/parser)** Fix top-level await with binary expr (#4426) ([465cc2f](https://github.com/swc-project/swc/commit/465cc2f92907ebd4ad4a659eca18b6ca2bc426a7))


- **(html/lexer)** Fix lexing of html entity (#4423) ([9b26dbd](https://github.com/swc-project/swc/commit/9b26dbd45763fbf48dd81a1652608cc90736fe4f))


- **(html/parser)** Parse foreign attributes (#4400) ([cf3be64](https://github.com/swc-project/swc/commit/cf3be649bb327feda8bce4e7ab7eca92d248c2da))


- **(html/parser)** Fix parsing of foreign elements (#4422) ([4ccbdf2](https://github.com/swc-project/swc/commit/4ccbdf2a7d6419552db6b34586a32fef52b200bd))


- **(html/parser)** Fix span (#4437) ([3293060](https://github.com/swc-project/swc/commit/329306007018d733bc9d348cd4a5dc839768b3e8))


- **(html/parsing)** Fix parsing of formatting elements (#4442) ([8f2a3ea](https://github.com/swc-project/swc/commit/8f2a3ead6a56c47ae867c40ac863346a0e6bc88a))

### Features



- **(es/optimization)** Accept top level mark from simplifiers (#4434) ([8048597](https://github.com/swc-project/swc/commit/8048597c9ec10fb956de06e6b2de28e621262dd9))


- **(es/parser)** Reject invalid regex flags (#4404) ([c96e322](https://github.com/swc-project/swc/commit/c96e32243c549d0f7db26a8e76d69a5646b4865c))


- **(es/parser)** Reject invalid `new.target` (#4406) ([da02c9d](https://github.com/swc-project/swc/commit/da02c9dc509f97d58f565223c81e7b123b0301c5))


- **(es/parser)** Reject `'use strict'` with non-simple params list in TS (#4416) ([6dc64c9](https://github.com/swc-project/swc/commit/6dc64c9ca0bccf27b325d3298f4ed7f07eaaa076))


- **(es/resolver)** Use different syntax context for unresolved refs (#4436) ([53610fd](https://github.com/swc-project/swc/commit/53610fdafc83d25f0a5132b3381737aaffb1a29d))


- **(html)** Prepare processing system (#4358) ([7332dce](https://github.com/swc-project/swc/commit/7332dce4f801546f0c5f29b6919feaaebebc435a))


- **(html/codegen)** Print unquoted value when it is possible (#4402) ([c15dc4f](https://github.com/swc-project/swc/commit/c15dc4f2b7e97eae939a82113ff5ab15a2553d78))


- **(html/minifier)** Initialize crate (#4403) ([63a6280](https://github.com/swc-project/swc/commit/63a6280e8f691f93db246db02ce2479b08874220))


- **(html/minifier)** Remove `script` `type` attribute (#4407) ([fec0f2e](https://github.com/swc-project/swc/commit/fec0f2e417b8da2e0391f594f28d32e93b03673e))


- **(html/minifier)** Compress `type` for `style` and `link` tags (#4424) ([25a87f0](https://github.com/swc-project/swc/commit/25a87f000048facf4daa78fb6605af3b1e50e81e))


- **(html/minifier)** Compress doctype (#4425) ([6fc70f3](https://github.com/swc-project/swc/commit/6fc70f3866e4d60867a3ae38ae40c8f46065153c))


- **(html/minifier)** Compress default values of attributes (#4427) ([4c699f2](https://github.com/swc-project/swc/commit/4c699f2554157333f0598cd4f8143f536027d396))


- **(node/css)** Add css bindings crate (#4346) ([6a19ff1](https://github.com/swc-project/swc/commit/6a19ff1a152b67b15714c0290eb21ede878692e5))


- **(preset-env/base)** Update "browserslist-rs" (#4435) ([1c2af93](https://github.com/swc-project/swc/commit/1c2af932b68cae34805b4ab789d6f2ccb4171fa4))

### Miscellaneous Tasks



- **(ci)** Improve bot script (#4430) ([c216a03](https://github.com/swc-project/swc/commit/c216a03673ca12e16d3650161eb890e6236054b1))


- **(ci)** Use `yarn` instead of `npm` (#4432) ([b3fb0e9](https://github.com/swc-project/swc/commit/b3fb0e9ceb45b6d2b1c45499680a7d519f6d2f25))


- **(es/minifier)** Add a script to instrument real-world inputs (#4399) ([efdf93d](https://github.com/swc-project/swc/commit/efdf93d91099bab79f04a58635b418b7160a0b75))


- **(plugin)** Add a benchmark (#4397) ([60efb7e](https://github.com/swc-project/swc/commit/60efb7e9c75445fdffccf936964785424f421a7e))


- **(repo)** Make `git commit` faster (#4421) ([65e00aa](https://github.com/swc-project/swc/commit/65e00aafc3b27bc896178fc9b3164fef0777cd9f))

### Performance



- **(es/minifier)** Add some fast-path to the `MultiReplacer` (#4408) ([4c9e5c0](https://github.com/swc-project/swc/commit/4c9e5c01ef91d01c95a6e928daa9e99839eabedf))

### Testing



- **(es)** Add tests for `.swcrc` (#4398) ([5134b4f](https://github.com/swc-project/swc/commit/5134b4f9bee5725bae53876067399aa0528a8add))


- **(es/minifier)** Split tests into improvement and stabilization (#4409) ([ab88637](https://github.com/swc-project/swc/commit/ab886379377726bd32f9221da494eb00d9b6fa94))


- **(es/minifier)** Use `_` instead of `-` for terser tests (#4411) ([4e11303](https://github.com/swc-project/swc/commit/4e113037e5142ca24bb4f28c316f58bbd28d3f9b))


- **(es/minifier)** Execute terser tests if possible (#4418) ([f787f8c](https://github.com/swc-project/swc/commit/f787f8c81943b022078a53575486094d5d2b1eca))


- **(es/minifier)** Categorize tests (#4410) ([9b34ecf](https://github.com/swc-project/swc/commit/9b34ecfd2e292ed557b4e357ea61a0cda4533445))

## [1.2.171] - 2022-04-22

### Bug Fixes



- **(common)** Ignore extraneous mapping of 1, 0 => 0, 0 (#4381) ([a06c559](https://github.com/swc-project/swc/commit/a06c55930f64a158b289c790ac9f7f71de78838a))


- **(es)** Fix CI (#4385) ([805238a](https://github.com/swc-project/swc/commit/805238ae303b9c3e688c729b6863e0d5745f1949))


- **(es/codegen)** Allow non-ascii character in more places (#4394) ([139ac24](https://github.com/swc-project/swc/commit/139ac24c4636ff72f37a215a578871ac2f4a9f5d))


- **(es/minifier)** Don't drop labels if required (#4370) ([922299a](https://github.com/swc-project/swc/commit/922299a4907d9ce8082c5db2a9dc435abe507ca6))


- **(es/minifier)** Preserve more labels (#4380) ([87859e3](https://github.com/swc-project/swc/commit/87859e373dd42857a52e5552a49e063c649b4607))


- **(es/minifier)** Disable `conditionals` by default (#4391) ([375cc59](https://github.com/swc-project/swc/commit/375cc5975afffae27a9a7d5f1403ffd1328fdda1))


- **(plugin)** Align deps to fix build (#4377) ([8419b60](https://github.com/swc-project/swc/commit/8419b604300695e57cb6b1191e9daf638c65c828))


- **(plugin)** Align deps for the plugin (#4384) ([46e88a3](https://github.com/swc-project/swc/commit/46e88a303fd62378139c112839006364bcc8726c))

### Features



- **(es/minifier)** Improve handling of switches (#4260) ([8cf3ddd](https://github.com/swc-project/swc/commit/8cf3ddda6cd41d9dd0eddab9bd6e869753e1f0f8))


- **(es/parser)** Reject await expr with `**` (#4395) ([59f63da](https://github.com/swc-project/swc/commit/59f63da560bc686eb658a091e363a1956da0daf3))

### Miscellaneous Tasks
- **general**: Fix wasm publish script ([234e380](https://github.com/swc-project/swc/commit/234e38058071f1d91e899ba7d16f37f3e3a69334))- **general**: Fix CI ([11012d0](https://github.com/swc-project/swc/commit/11012d07e56895369f016eb7e6c7cc9261398250))- **general**: Fix CI, really ([000e31b](https://github.com/swc-project/swc/commit/000e31b3cdd44430e6fc9957bb496577294ac218))

### Testing



- **(es/parser)** Add a test for a fixed issue (#4388) ([b9cba1a](https://github.com/swc-project/swc/commit/b9cba1ad4dc90090fe42755ad479fefd5ee8b17c))

## [1.2.170] - 2022-04-20

### Performance



- **(es/minifier)** Fix default of `TerserCompressorOptions` (#4378) ([203dde9](https://github.com/swc-project/swc/commit/203dde9c6b83390e65444615299829f4212eac9d))

### Testing



- **(es/minifier)** Organize tests (#4375) ([4a8b1da](https://github.com/swc-project/swc/commit/4a8b1dad1d527cbbdd95a9aabb82423772841f18))

## [1.2.169] - 2022-04-20

### Bug Fixes



- **(es/lexer)** Fix handling of object properties with the name `function` (#4374) ([3bdf5a8](https://github.com/swc-project/swc/commit/3bdf5a89600ecbc81be4eba162c09820a8a6550c))


- **(es/minifier)** Fix default values of `toplevel` (#4366) ([128175c](https://github.com/swc-project/swc/commit/128175c3297e036ad38e8faa68aa149a94f5ee29))


- **(es/minifier)** Apply name mangler as much as we can (#4365) ([a8ed5ba](https://github.com/swc-project/swc/commit/a8ed5ba357d735657245e5bcd266ba9bda341099))


- **(es/minifier)** Apply name mangler even more (#4368) ([4b1590e](https://github.com/swc-project/swc/commit/4b1590e72fb2dbae6af135d8c284d4c1a875045a))


- **(es/modules/cjs)** Fix order of statements (#4361) ([5c1ce0b](https://github.com/swc-project/swc/commit/5c1ce0ba051de3320e90b0992d57a965a6c2dd8a))

### Features



- **(cli)** Support configuring output file extension (#4343) ([c4f01c6](https://github.com/swc-project/swc/commit/c4f01c6d6000890f5d3e0bb2e0e9531cff9c8c6b))


- **(es/minifier)** Implement more evaluation rules (#4356) ([e13b862](https://github.com/swc-project/swc/commit/e13b8625f2f67c98c36ac975f3739b304706201b))


- **(es/minifier)** Improve evaluation of template literals (#4359) ([2e095fa](https://github.com/swc-project/swc/commit/2e095face5b6873d50f20babca88a632e5b70d76))


- **(es/minifier)** Implement all template literal evaluation rules (#4360) ([e60ae2a](https://github.com/swc-project/swc/commit/e60ae2a486cdbe4e652f9b7f3a62b4b7dea9c4fb))


- **(plugin)** Support `lookup_char_pos` of `SourceMap` (#4364) ([f06c862](https://github.com/swc-project/swc/commit/f06c862a9ff2c6510c3b88b4d5bd4807a11b5bfb))

### Miscellaneous Tasks



- **(es)** Rename benchmarks (#4355) ([8309440](https://github.com/swc-project/swc/commit/83094400080bef161b4b106aa3840efc7f2dfecd))


- **(es/minifier)** Setup correct benchmark (#4372) ([5d179bf](https://github.com/swc-project/swc/commit/5d179bfd7d41731a2322854c7aafc93b008eb5f8))


- **(node/types)** Add `unsafe` to compress options (#4362) ([b63cd53](https://github.com/swc-project/swc/commit/b63cd53ca6cb230f7724a03ffaebe2362c80d35b))- **general**: Remove an incorrect link in `CONTRIBUTING.md` (#4363) ([c661d5f](https://github.com/swc-project/swc/commit/c661d5f6f6b613cfed22545cc7cde7411dbd5747))

### Performance



- **(es/minifier)** Make `base54` use stack-allocated vector (#4371) ([6300b9c](https://github.com/swc-project/swc/commit/6300b9cdb19150686bc71c08386e11d7899a0764))


- **(es/minifier)** Change default value of `passes` to `3` (#4373) ([a8eb00c](https://github.com/swc-project/swc/commit/a8eb00cc540c0bfdfc7d0b922fe34bea2cf8ef45))

### Testing



- **(es/parser)** Add a test for a fixed issue (#4357) ([bf76175](https://github.com/swc-project/swc/commit/bf761752f1b62635e973da7fb8150ddc323dea9b))

## [1.2.168] - 2022-04-17

### Bug Fixes



- **(es/codegen)** Emit decorators before export (#4349) ([4953ce4](https://github.com/swc-project/swc/commit/4953ce466fcb008aa356d88489786b7bff3f2395))


- **(es/minifier)** Preserve vars in dead branches (#4345) ([5a5e41a](https://github.com/swc-project/swc/commit/5a5e41aaaa3791f76de9c73aa29c714fa097c773))

### Features



- **(es/minifier)** `const` => `let` (#3654) ([b3b95ac](https://github.com/swc-project/swc/commit/b3b95acc75f765af433b0c7f887821403561378f))

### Miscellaneous Tasks



- **(es/minifier)** Organize scripts (#4347) ([14c74f5](https://github.com/swc-project/swc/commit/14c74f50c0b21d65d9604b58a2ce348baeb1baa3))


- **(es/minifier)** Improve scripts (#4339) ([2563c7f](https://github.com/swc-project/swc/commit/2563c7f8ff5bb86131f642b6cca948955d795820))


- **(repo)** Make git commit faster (#4353) ([f7df3d8](https://github.com/swc-project/swc/commit/f7df3d8f24a0571b1766e6187d2305fdf566b08a))- **general**: Fix CI script ([a953455](https://github.com/swc-project/swc/commit/a953455ada2604c65493db7a04dcfbdd2ef5ca78))

### Performance



- **(es)** Disable wrong parallelization (#4354) ([da6fa60](https://github.com/swc-project/swc/commit/da6fa602310c0a56825723d83585fb258b88c931))


- **(es/minifier)** Split frequently used functions (#4352) ([42e15ae](https://github.com/swc-project/swc/commit/42e15aedc2b7c0ccdd9d6db58cc425a1e781cdd8))

## [1.2.167] - 2022-04-17

### Bug Fixes



- **(es/parser)** Reject optional constructor call (#4340) ([31b3336](https://github.com/swc-project/swc/commit/31b3336cd5881ff8f99d791254ee02ff4fa23fcc))

### Miscellaneous Tasks



- **(ci)** Fix wasm publish script ([1900d35](https://github.com/swc-project/swc/commit/1900d3506efb8bc319dece4219789e2509ecf67c))

### Performance



- **(es/minifier)** Make name mangler faster (#4342) ([66ff7b8](https://github.com/swc-project/swc/commit/66ff7b8a09bc504d3912d12b4a8ebea3a96d4e4b))

## [1.2.166] - 2022-04-15

### Bug Fixes



- **(css/parser)** Parse legacy `calc`s (#4320) ([81370d1](https://github.com/swc-project/swc/commit/81370d16cb405d43aeb9198e1fce4aa11009045f))


- **(css/prefixer)** Don't prefix if it's already prefixed (#4307) ([690ce26](https://github.com/swc-project/swc/commit/690ce2628c988a3d1823cbcf4f786203e548cb84))


- **(css/prefixer)** Handle at-rules and don't generate unnecessary prefixes (#4318) ([ac4f14a](https://github.com/swc-project/swc/commit/ac4f14ad7b70e67c41507cafd997f6b4e346e815))


- **(css/prefixer)** Fix more bugs (#4330) ([405e5ed](https://github.com/swc-project/swc/commit/405e5ed0b3bbcf8076c80d1383588bfee1cf8d22))


- **(es/codegen)** Fix overflow of numeric literals (#4321) ([0245e26](https://github.com/swc-project/swc/commit/0245e26af5f984cf89a2f474d89f6b3dfe2f0eff))


- **(es/codegen)** Fix codegen of arrow expressions (#4306) ([4c99730](https://github.com/swc-project/swc/commit/4c9973010a5c2b865e6ed676a4e0364234cf5d88))


- **(es/compat)** Fix renaming bug of `block_scoping` (#4310) ([6c9882e](https://github.com/swc-project/swc/commit/6c9882ec68fee9b702f5e4749482eca74fbd87e8))


- **(es/lints)** Check parameters in the duplicate binding rule (#4288) ([e4a565c](https://github.com/swc-project/swc/commit/e4a565c2d4c90dc23267b44e8f4aee2e0cc79c23))


- **(es/loader)** Fix traversal of node modules resolver (#4327) ([780de70](https://github.com/swc-project/swc/commit/780de7095e1ea6b71204017f708f8370ed4531a8))


- **(es/minifier)** Fix inlining of uninitialized variables (#4292) ([b990b19](https://github.com/swc-project/swc/commit/b990b19ed130ce1dc57f76b883bf638ace64c4f4))


- **(es/minifier)** Respect `dead_code` (#4328) ([8886a4b](https://github.com/swc-project/swc/commit/8886a4b572c4b24091aa3db38fdc7b486334c069))


- **(es/minifier)** Inline before cloning (#4338) ([4110fcb](https://github.com/swc-project/swc/commit/4110fcb9612ceeba0c52f539896075a571c9a619))


- **(es/parser)** Enable static blocks by default (#4334) ([7599fe7](https://github.com/swc-project/swc/commit/7599fe74317f790cce8f8638e84c320c5ebbc4c2))


- **(es/parser)** Make parsing of TS InstantiationExpr more permissive (#4332) ([ea466af](https://github.com/swc-project/swc/commit/ea466afdc8dc6b64be81244a8c0261ac34f22157))


- **(node-swc/types)** Add `isTypeOnly` to types (#4303) ([1a48732](https://github.com/swc-project/swc/commit/1a48732e78b9c650f93320f4d6f7be57a9f4a6c4))

### Features



- **(css/minifier)** Compress colors (#4308) ([65b18ee](https://github.com/swc-project/swc/commit/65b18ee602506d455ce10c6ca2bd599d57d29d14))


- **(es)** Support `typeof` with private fields (#4302) ([d0de5a6](https://github.com/swc-project/swc/commit/d0de5a63a01ef45101cdd10f90546ec7950ce7ac))


- **(es/minifier)** Enable `conditionals` by default (#4301) ([7e8f613](https://github.com/swc-project/swc/commit/7e8f6132729ca3ddf7884f1b246964921cde1c35))


- **(es/minifier)** Enable `dead_code` by default (#4309) ([74a5087](https://github.com/swc-project/swc/commit/74a5087989173f833517cb6f6bf51afcf9642286))


- **(es/minifier)** Improve sequential inliner (#4335) ([f92242d](https://github.com/swc-project/swc/commit/f92242dcb17a7b6dc25dac63d052df9e3d7042bc))


- **(es/parser)** Support `extends` clause to `infer` type (#4326) ([1c3d1af](https://github.com/swc-project/swc/commit/1c3d1af01cdfdf6794e73e32bb0062698d4910be))

### Miscellaneous Tasks



- **(*)** Typo + fomatting (#4304) ([37a8c90](https://github.com/swc-project/swc/commit/37a8c90750d778edcd69ffdd85fe990a27efc75d))


- **(ci)** Fix CI (#4299) ([adea17d](https://github.com/swc-project/swc/commit/adea17dbe3b17e397d79a7dae1f469bf38f0185f))


- **(es/minifier)** Update terser test references (#4297) ([df0d572](https://github.com/swc-project/swc/commit/df0d572b4ff250be037ca9a04b6bcd95329f9f3b))


- **(es/minifier)** Add full benchmark for `.minify()` (#4341) ([ba5f743](https://github.com/swc-project/swc/commit/ba5f7436c18b7e3845bc2935aca6cdb76477b686))

### Refactor



- **(bindings)** Rename crates (#4337) ([83a8f48](https://github.com/swc-project/swc/commit/83a8f489ec5b7010a762a75dc31a63b2fb060372))


- **(es/minifier)** Clean up logging (#4322) ([2002554](https://github.com/swc-project/swc/commit/2002554fa26c1ebd683f71d87263f26fd95d00f1))


- **(es/parser)** Simplify logic (#4329) ([37aec5b](https://github.com/swc-project/swc/commit/37aec5b19965bedbe67fa1b454be6a7017ccedec))

## [1.2.165] - 2022-04-09

### Bug Fixes



- **(css/prefixer)** FIx a bug related to `writing-mode` (#4278) ([7f38e06](https://github.com/swc-project/swc/commit/7f38e06e0209216200182555c7c7ddb11499e45d))


- **(es/minifier)** Fix handling of `eval` (#4273) ([c961371](https://github.com/swc-project/swc/commit/c961371c312f85553ab17eb1b67f0721861bcbf5))


- **(es/module)** Support top-level await in dynamic imports (#4277) ([720244f](https://github.com/swc-project/swc/commit/720244fff9f3fcf5cb0ed4bcfc6e2a5795ad3be1))


- **(es/optimization)** Don't create invalid sequence expressions (#4285) ([4868c73](https://github.com/swc-project/swc/commit/4868c73d5bc5eb3ffbbc2fd31c485e3e22795550))

### Features



- **(html)** Add raw fields (#4281) ([ee108af](https://github.com/swc-project/swc/commit/ee108af3d0bf81cfa101d8b52ee4d072705b04f4))


- **(plugin)** Implement `Copy` and `Clone` for the comment proxy (#4280) ([3c4e520](https://github.com/swc-project/swc/commit/3c4e5204ecb51dd67c73ae5556c886b303891a23))


- **(plugin)** Make more types serializable (#4289) ([281db2c](https://github.com/swc-project/swc/commit/281db2cc4f9af29577095038b37af5855a1e5aa5))


- **(plugin/runner)** Allow fs access from wasi plugin (#4279) ([fc3a2d0](https://github.com/swc-project/swc/commit/fc3a2d0cf9a4767076dda3fac929b24a50144730))

### Miscellaneous Tasks



- **(plugin)** Align version of `swc_common` to include dummy comment api (#4270) ([fad652f](https://github.com/swc-project/swc/commit/fad652f879d12a1015b4500f0a512232c9433c2d))

### Refactor



- **(es/minifier)** Merge code for multi-replacer (#4269) ([434dcf4](https://github.com/swc-project/swc/commit/434dcf4af786a7d31827f7b078dea40efc35b64f))


- **(plugin/api)** Expand the proxy crate (#4290) ([cf7ca50](https://github.com/swc-project/swc/commit/cf7ca5076a7f0b33f3587fb34f2eddcb2d316e5d))

## [1.2.164] - 2022-04-07

### Bug Fixes



- **(es/codegen)** Commit `;` before a template literal (#4252) ([8cd903b](https://github.com/swc-project/swc/commit/8cd903b3b006b823cc5d3a61d40a1311fc97276c))


- **(es/codegen)** Handle comments on the argument of `throw` (#4254) ([ccd3188](https://github.com/swc-project/swc/commit/ccd3188c8bbf9d80efaa632e283941ed6e1fc59c))


- **(es/minifier)** Remap variables on IIFE evaluation (#4230) ([55b98fc](https://github.com/swc-project/swc/commit/55b98fc87470cc5b2e2645ae8588c106c490fb3a))


- **(es/minifier)** Handle empty RegExp (#4235) ([6a51d04](https://github.com/swc-project/swc/commit/6a51d0471a53cfdd48c8426c9cdc5bfddf200b35))


- **(es/minifier)** Fix infinite loops (#4250) ([350a195](https://github.com/swc-project/swc/commit/350a19587e2220a134d9049b7afb19e35da236f0))


- **(es/optimizer/simplifier)** Collect idents in init first (#4239) ([b1645f6](https://github.com/swc-project/swc/commit/b1645f606d1334eadb7ebf912c847bb5bdff6b96))


- **(es/parser)** Support error reporting for TS1274 (#4232) ([6d380ea](https://github.com/swc-project/swc/commit/6d380ea6faf1bde18c6f92c87ed0395c674a1ead))


- **(es/parser)** Adjust context in a function block (#4264) ([b89937c](https://github.com/swc-project/swc/commit/b89937c3c081132e3cf126467476080f29272cdd))


- **(html/parser)** Support cdata (#4259) ([3f6037b](https://github.com/swc-project/swc/commit/3f6037b467a378357051a7de6002e34d36b640d4))


- **(html/parser)** Fix bugs (#4265) ([105a0cc](https://github.com/swc-project/swc/commit/105a0cccf7dec630824e2e0f8ee77bf31645aa28))

### Features



- **(css/parser)** Improve error recovery for unknown at-rules (#4257) ([8b6647c](https://github.com/swc-project/swc/commit/8b6647cf8571fabb820d0a5dae7a3b69e561202d))


- **(es)** Support jsonc for `.swcrc` (#4236) ([8008b79](https://github.com/swc-project/swc/commit/8008b79f8c69f9abc1cdd7be299f5580be8c3c0f))


- **(es/ast)** Add `raw` to `Num` (#4245) ([f39d3ac](https://github.com/swc-project/swc/commit/f39d3aca4db25db2880f447fe738375ad5307c86))


- **(es/minifier)** Improve sequential inlining (#4231) ([fe358ad](https://github.com/swc-project/swc/commit/fe358ad0b93d6f3bd2150fc9ce888f798875beed))


- **(es/minifier)** Improve inliner and evaluator (#4216) ([4701da5](https://github.com/swc-project/swc/commit/4701da576f0b12b656cf1baa57174a787b590742))


- **(es/minifier)** Exclude local bindings from aliases (#4261) ([ab1f440](https://github.com/swc-project/swc/commit/ab1f4401037803ae230148f9e189b1835b92dcd9))


- **(es/minifier)** Implement more rules for `hoist_props` (#4262) ([1f5cac4](https://github.com/swc-project/swc/commit/1f5cac4d413bc8d035e137d74470469dfd886fa3))


- **(es/parser)** Report more errors (#4244) ([674275c](https://github.com/swc-project/swc/commit/674275c8242df111bb9391da13b9869d7e6b6405))


- **(html)** Initialize (#4240) ([3e7872c](https://github.com/swc-project/swc/commit/3e7872c8de05ac46ef6ffb99f778ef5b64e47f1b))


- **(html)** Support boolean attributes (#4258) ([8640c8b](https://github.com/swc-project/swc/commit/8640c8bd43a164eb185733b5294342ff01c858f6))


- **(plugin)** Implement proxy for `dummy_with_cmt` (#4268) ([b15e984](https://github.com/swc-project/swc/commit/b15e984317ae6eb03597e9236f637fee205dd8a5))


- **(plugin/api)** Expose `swc_ecma_utils` (#4256) ([7bc04a6](https://github.com/swc-project/swc/commit/7bc04a67918374b1b2d02ed5034330cd6dd78d57))

### Miscellaneous Tasks



- **(bench)** Migrate to criterion (#4237) ([06d0891](https://github.com/swc-project/swc/commit/06d0891e7cae751dfc62ac4607675e872ac12304))


- **(build)** Dedup `swc_common` (#4247) ([4093814](https://github.com/swc-project/swc/commit/4093814895a4c473d13852d2edeee17d06d7421f))


- **(ci)** Fix benchmark action (#4242) ([1f466e1](https://github.com/swc-project/swc/commit/1f466e1d2f10193b45c09ced2b6384d85ea8f333))


- **(es/preset-env)** Typo (#4243) ([06020bb](https://github.com/swc-project/swc/commit/06020bb76d5009f693cc702a70ac3add1ef0fe4a))

### Refactor



- **(plugin)** Consolidate exported namespaces (#4263) ([8706c17](https://github.com/swc-project/swc/commit/8706c17c4f20fb508e685cb81945cd51672eaba5))

### Testing



- **(es)** Organize tests (#4251) ([c32f42b](https://github.com/swc-project/swc/commit/c32f42b374a4964e858d05106eaa1b8fcd446cad))


- **(es/parser)** Add a test for a fixed issue (#4255) ([1f0039f](https://github.com/swc-project/swc/commit/1f0039f2c31778acf01a10807ca54be6d3ebac08))

## [1.2.163] - 2022-04-03

### Bug Fixes



- **(cli)** Update plugin template (#4222) ([69cb512](https://github.com/swc-project/swc/commit/69cb512e571de1f8b245fdc538cf9a09c51823f2))


- **(css/prefixer)** Fix flex box (#4212) ([75b0ed5](https://github.com/swc-project/swc/commit/75b0ed55f6c352ab2cd918ac746ceef99fa0f124))


- **(es/preset-env)** Change order of passes ([7eea95b](https://github.com/swc-project/swc/commit/7eea95be7a08d27d999e9f8a698077bf08b12d12))

### Features



- **(css/ast)** Derive more traits (#4220) ([def2826](https://github.com/swc-project/swc/commit/def2826029fcc405ac73283b3559415105266ad2))


- **(es/ast)** Add `raw` to `BigInt` (#4218) ([e91f271](https://github.com/swc-project/swc/commit/e91f2718730b87d7318f45ecfe4ac0c03a52c6fd))


- **(es/compat)** Support more regex expressions (#4205) ([b793aa0](https://github.com/swc-project/swc/commit/b793aa020095d797a76e2c19f42ab5822ee2ef03))


- **(plugin)** Implement plugin api for comments (#4229) ([6ea66cf](https://github.com/swc-project/swc/commit/6ea66cf001754bb88604a824a2290a3360a798b8))

### Performance



- **(es/minifier)** Add fast-path for sequences pass (#4217) ([688f653](https://github.com/swc-project/swc/commit/688f653323cc9480f9c262040e0bc3861a2ffff9))


- **(es/parser)** Improve performance by using `#[cold]` (#4215) ([1645562](https://github.com/swc-project/swc/commit/164556290b03cd530ad5158947cd28310c18fb12))

### Refactor



- **(css/ast)** Union all at-rules to one at-rule in AST (#4189) ([6696a93](https://github.com/swc-project/swc/commit/6696a93b5c7d005bb35be97e3f3ec52c1fe235aa))

### Testing



- **(es)** Add a test to ensure that an issue is not a bug of swc (#4227) ([bbbaf15](https://github.com/swc-project/swc/commit/bbbaf15bbae204030d7c781ca4155987d324c16a))

## [1.2.162] - 2022-03-31

### Bug Fixes



- **(es/compat)** Handle spreads of string literials (#4191) ([4f5c5cf](https://github.com/swc-project/swc/commit/4f5c5cf8429bb6c10b48aefdc3440b563f21d836))


- **(es/compat)** Handle `new.target` in getter/setter properties (#4194) ([3426dda](https://github.com/swc-project/swc/commit/3426dda4f7d662c758d7cb9a15527029f369779f))


- **(es/compat)** Fix label handling of `block_scoping` (#4198) ([c946236](https://github.com/swc-project/swc/commit/c946236fcc911da8bdc213dc8674b48c5d0a41e7))


- **(es/compat)** Hoist env in function params (#4210) ([6a27a0c](https://github.com/swc-project/swc/commit/6a27a0ce882269df7da71c431a8f8026b698cd60))


- **(es/minifier)** Fix `react-ace` (#4183) ([9a9a4f3](https://github.com/swc-project/swc/commit/9a9a4f37d82336f53bf6efbdf4ee38a63d45e278))


- **(es/minifier)** Fix evaluation of IIFEs (#4207) ([1071854](https://github.com/swc-project/swc/commit/10718547e0724271f7b8e06292647ec6faa035f7))


- **(es/optimization)** Support jsx in `dce` (#4203) ([073751f](https://github.com/swc-project/swc/commit/073751f70d7eb557d0f865aa997cbc36396d923d))


- **(es/parser)** Fix parsing of an arrow and a conditional expression (#4199) ([99a0d34](https://github.com/swc-project/swc/commit/99a0d34a1e13a69f5bc1ecf51a6279adab6c20cc))


- **(node-swc)** Initialize custom trace subscriber only once (#4209) ([eecda21](https://github.com/swc-project/swc/commit/eecda21d9a36fc2c4b98c2cae4933adb300cdaa0))

### Features



- **(common/preset-env)** Dedup `arrayvec` (#4201) ([1ad357c](https://github.com/swc-project/swc/commit/1ad357cb32147ea95ccce534076b87ea5ae76ebd))


- **(es/minifier)** Evaluate trivial expressions (#4179) ([a6f6799](https://github.com/swc-project/swc/commit/a6f679981140867bd36e887249ae63d75186ca5a))


- **(es/minifier)** Optimize switches more correctly (#4180) ([6d3ea17](https://github.com/swc-project/swc/commit/6d3ea17aa6b708c7819a6769dccd920bd3fe2efe))


- **(es/minifier)** Evaluate more iifes (#4200) ([11fe5fa](https://github.com/swc-project/swc/commit/11fe5fabd8280f7cf2c3ef0d6a12e0f3803ef3e8))


- **(es/parser)** Allow parsing files with missing close braces (#4187) ([cffe5ca](https://github.com/swc-project/swc/commit/cffe5ca58e933253f69eb9befd77243c9b81775f))


- **(plugin)** Implement PoC of comments api (#4206) ([536a190](https://github.com/swc-project/swc/commit/536a190dc940b89ebb21aa3ee78b90dfbadbf622))

### Miscellaneous Tasks



- **(es/parser)** Add span tests back (#4186) ([1759567](https://github.com/swc-project/swc/commit/1759567fc46c93f963b2fbe54997197f00bc884a))

### Refactor



- **(*)** Remove `fastmem` (#4211) ([3b1da22](https://github.com/swc-project/swc/commit/3b1da220e2c148725a646064519165f2be2a0036))


- **(cli)** Alias plugin build with wasm target (#4181) ([8ca4e67](https://github.com/swc-project/swc/commit/8ca4e674515b77341f77f180235fcfb396dac26d))

## [1.2.161] - 2022-03-28

### Bug Fixes



- **(cli)** Fix executable permission (#4154) ([e1d1d82](https://github.com/swc-project/swc/commit/e1d1d82fdb6504f3d6d53a0a8dbc3f3ec3eead70))


- **(es)** Make `ErrorConfig.filename` default to true (#4150) ([7a1dcb1](https://github.com/swc-project/swc/commit/7a1dcb1b933308fe237f992ff38650c15875c4c5))


- **(es)** Consume surrogate pairs (#4115) ([fcf67c4](https://github.com/swc-project/swc/commit/fcf67c45706419127bd5cb3f5a4e65ef08bd9ba6))


- **(es/codegen)** Fix codegen of template literals (#4124) ([f5a5217](https://github.com/swc-project/swc/commit/f5a5217506dd18b4ad49920d2e82026eb85dfd73))


- **(es/codegen)** Emit sourcemap of key-value properties correctly (#4166) ([ea0de90](https://github.com/swc-project/swc/commit/ea0de9013768bac03d60beb984aa177e0d943694))


- **(es/lints)** Ignore type-only imports while checking duplicates (#4163) ([fce554c](https://github.com/swc-project/swc/commit/fce554cfb02d034942ab64114ea212020c51e570))


- **(es/parser)** Allow arrows without parenthesized param in typescript (#4138) ([ab4ea9f](https://github.com/swc-project/swc/commit/ab4ea9f0cb202d79b3713b9418271b19a64dd23a))


- **(es/parser)** Fix logic for consuming ts modifiers (#4137) ([f5ce79a](https://github.com/swc-project/swc/commit/f5ce79a72c947e255830281151c4f7fe14baa45b))

### Features



- **(cli)** Implements some compile flags (#4125) ([a6f39d3](https://github.com/swc-project/swc/commit/a6f39d3bd6e7bc57203e1cf4f2cadc12e4396e9f))


- **(css/minifier)** Compress more properties (#4130) ([93866d0](https://github.com/swc-project/swc/commit/93866d0be5cf08a1c0a78c3a8c6b907a31525926))


- **(css/minifier)** Remove `@charset` at-rule if possible (#4135) ([6b6664a](https://github.com/swc-project/swc/commit/6b6664a92df62338c1152fbe9baa5227eb3075a4))


- **(css/minifier)** Compress more properties (#4155) ([364ebd9](https://github.com/swc-project/swc/commit/364ebd951a49c5dcc2f8b04b1b9521422ad772fc))


- **(css/prefixer)** Prefix more properties (#4153) ([46c35da](https://github.com/swc-project/swc/commit/46c35dab25f9e54c8c25e5176cd127ad2f91b380))


- **(es/codegen)** Compress `\t` in string literals more (#4131) ([48f3dc8](https://github.com/swc-project/swc/commit/48f3dc8cc439fa5970b68a28c7db26cb88dacca7))


- **(es/lints)** Use `Str.raw` instead of source map (#4139) ([d8a988e](https://github.com/swc-project/swc/commit/d8a988ef3d5dfba839af0866ead73faf54f205dc))


- **(es/lints)** Improve error messages (#4142) ([0f92eda](https://github.com/swc-project/swc/commit/0f92eda0c78277d3de83ae85cf8a5c04e9c437bf))


- **(es/lints)** Implement `no-param-reassign` rule (#4134) ([47712de](https://github.com/swc-project/swc/commit/47712de0da0a923dfebe52ebd98070924303f4d0))


- **(es/lints)** Remove source map accesses (#4147) ([7a06c5b](https://github.com/swc-project/swc/commit/7a06c5b3d888418098dfe55d030645087e11b5e8))


- **(es/lints)** Implement `symbol-description` rule (#4161) ([10851ec](https://github.com/swc-project/swc/commit/10851ece981b7d71bf33b5f9a5391b59d4841b57))


- **(es/lints)** Implement `no-obj-calls` rule (#4168) ([a88d56e](https://github.com/swc-project/swc/commit/a88d56ee08c29b1f9f4cf5028fe2113d15b2efcf))


- **(es/minifier)** Implement some unsafe evaluation rules (#4133) ([1d3763d](https://github.com/swc-project/swc/commit/1d3763d96c94638bb0828110cc90bd123f96e327))


- **(es/minifier)** Implement more rules for optimizing for-if-break (#4140) ([ee5c48c](https://github.com/swc-project/swc/commit/ee5c48c935b3cd8fa237680dd02f6bcb4faf8a82))


- **(es/minifier)** Implement rules for optimizing loops (#4157) ([b37dafb](https://github.com/swc-project/swc/commit/b37dafbd2789ee8e5194ef2593c460f056c2b70f))


- **(es/minifier)** Implement more rules for dropping unused assignemnts (#4171) ([6f25e57](https://github.com/swc-project/swc/commit/6f25e5774b3ac228b64da47cb370053ed1511b86))


- **(es/parser)** Report more errors for invalid patterns (#4145) ([cd7112b](https://github.com/swc-project/swc/commit/cd7112b18bcc98b704846adbd32c1d63557dcffe))


- **(es/plugin)** Make `quote` optional (#4160) ([5de3141](https://github.com/swc-project/swc/commit/5de31416be579a4257789d0ad927db15eec9a73c))


- **(es/typescript)** Support optional variance annotations (#4008) ([bf1924d](https://github.com/swc-project/swc/commit/bf1924d1a8cc2039b624eecd9730d012c1e47321))


- **(plugin/runner)** Implement initial loading for wasm32 (#4151) ([161353c](https://github.com/swc-project/swc/commit/161353cf25c32777cc8fff971b978b1424235cda))


- **(wasm/plugin)** Implement initial plugin interface for wasm runtimes (#4123) ([50f7f46](https://github.com/swc-project/swc/commit/50f7f465f9181ef6bcb63ee5457aa42f5e6ee29c))

### Miscellaneous Tasks



- **(deps)** Update `string-cache` (#4169) ([b473414](https://github.com/swc-project/swc/commit/b473414b3cbc5b66ae362f0ad670430be5a7d451))


- **(es/minifier)** Add logging (#4156) ([97dfcb9](https://github.com/swc-project/swc/commit/97dfcb9ccb39620576d6e63c195ec588ff4c5790))

### Refactor



- **(css/prefixer)** Rename crate (#4159) ([7817547](https://github.com/swc-project/swc/commit/78175473fa10cb5298b226c083da0efab38db997))


- **(es/lints)** Use util for parens (#4167) ([2a9cb2d](https://github.com/swc-project/swc/commit/2a9cb2d12ac0957c0d1ae0f64d2b2f8dc72de12a))

### Testing



- **(es)** Organize tests (#4129) ([ede6e02](https://github.com/swc-project/swc/commit/ede6e027c2965478459840967713e910344b2521))

## [1.2.160] - 2022-03-22

### Bug Fixes



- **(common)** Fix the line number of errors (#4082) ([57802cf](https://github.com/swc-project/swc/commit/57802cfcce6293fb6c4591987c39c6141fdd9390))


- **(es/codegen)** Support multiline comments in return stmt (#4102) ([552f16d](https://github.com/swc-project/swc/commit/552f16dba6c91876529354f3f5e155a3360a74ea))


- **(es/codegen)** Emit decorators on class methods (#4103) ([9b64a69](https://github.com/swc-project/swc/commit/9b64a6960fc413d5aac000d0868d836d881ca895))


- **(es/codegen)** Fix codes related to sourcemap (#4106) ([61f1a37](https://github.com/swc-project/swc/commit/61f1a374928a0c0dd314fdbc4decdee421121abb))


- **(es/compat)** Visit non-method properties in a nested object literal (#4094) ([f5b9600](https://github.com/swc-project/swc/commit/f5b9600b2befe0053bec2d3e6210bf35dd824dfb))


- **(es/compat)** Fix regression of `es2015` (#4119) ([154d443](https://github.com/swc-project/swc/commit/154d443c88d7e08bd8a51da190a06a312976c6e2))


- **(es/minifier)** Consider side effects while lifting sequences (#4116) ([4a9817f](https://github.com/swc-project/swc/commit/4a9817f003d5ce053c0eeaa5cd47c46bd30548a1))


- **(es/parser)** Allow parentheses in assignment target (#4105) ([d38117d](https://github.com/swc-project/swc/commit/d38117d4cb6fb2819efc18dae843546018c39362))


- **(es/parser)** Make `let` a reserved word in strict mode (#4113) ([9a8fc27](https://github.com/swc-project/swc/commit/9a8fc2776e8bbd349a0a86eb558e2e96f33c0242))


- **(es/typescript)** Collect all bindings in `strip` (#4118) ([13b2f38](https://github.com/swc-project/swc/commit/13b2f38cdd9b11b5a4e021ef3340458071d4a926))

### Features



- **(es/ast)** Add `raw` to `Str` (#4071) ([634d732](https://github.com/swc-project/swc/commit/634d7328030e44be0376019c156624e073d56fde))


- **(es/lints)** Implement `valid-typeof` rule (#4095) ([9ceefa7](https://github.com/swc-project/swc/commit/9ceefa734f1193cb7379404132ffd89417b4ed8f))


- **(es/lints)** Implement `use-isnan` rule (#4080) ([dd862ba](https://github.com/swc-project/swc/commit/dd862ba9f8c50242f0f508aecfe29aef3f6052f0))


- **(es/minifier)** Implement more evaluation rules (#4030) ([c6f8742](https://github.com/swc-project/swc/commit/c6f8742669a4161efec07e8c6fce493139e04cc5))

### Miscellaneous Tasks



- **(issues)** Add some links ([69f16da](https://github.com/swc-project/swc/commit/69f16da7369c3c001d01a9581d1e574f28e460f4))


- **(issues)** Typo ([ea0bbc6](https://github.com/swc-project/swc/commit/ea0bbc6f5fb3cb728e0bfa93fabca0d49cebc95e))


- **(plugin/runner)** Update `wasmer-*` (#4111) ([f41a717](https://github.com/swc-project/swc/commit/f41a717c457d7ca3e9b5cd6a24ce0fa48040b6f4))- **general**: Typo ([3f78053](https://github.com/swc-project/swc/commit/3f78053227f2d286940e9b118f27aa9474b0c838))- **general**: Fix CI ([565a720](https://github.com/swc-project/swc/commit/565a7202eda1435498f7d98a1f9ec1b34d9fdf33))- **general**: Fix CI ([b31ead5](https://github.com/swc-project/swc/commit/b31ead5cbed61b201991cf55e227a6de52365a24))

### Testing



- **(es/codegen)** Add a test for fixed issue (#4121) ([95c572f](https://github.com/swc-project/swc/commit/95c572f20710e4770a58d99d8028be1651099bb2))

## [1.2.159] - 2022-03-19

### Bug Fixes



- **(api/rust)** Exclude test files from rust packages (#4091) ([533f756](https://github.com/swc-project/swc/commit/533f75627405fbb05fcebf42a49105d019093ffe))


- **(common)** Fix handling of input source maps (#4086) ([b716210](https://github.com/swc-project/swc/commit/b716210de1495d11f45f74bdc3941826a9dd5d6a))


- **(es/compat)** Visit generated codes from `arrow` (#4090) ([cb0881c](https://github.com/swc-project/swc/commit/cb0881cc3dd4ea8fb880e7cbd9eb6a11031a8e9b))


- **(es/compat)** Revert wrong fix of `arrow` (#4093) ([0d6bd81](https://github.com/swc-project/swc/commit/0d6bd813b209155fcf45baa6f0195657ee383845))


- **(es/module/cjs)** Fix conflict of a local export and exports-alls (#4089) ([6ac7934](https://github.com/swc-project/swc/commit/6ac793401769028f7e18b642303de46592d39598))


- **(es/resolver)** Fix handling of decorators (#4084) ([f662298](https://github.com/swc-project/swc/commit/f66229822c2e44d35854cd9a1ecbdae82242a08c))

### Features



- **(es/lints)** Implement `no-new-symbol` rule (#4076) ([b39e345](https://github.com/swc-project/swc/commit/b39e345d8e43c3e6c1491f7b75448e3b091d7b0d))


- **(es/module/cjs)** Support `import.meta.url` (#4087) ([d0f687b](https://github.com/swc-project/swc/commit/d0f687bf44862e737e189dc585e9f1b789291685))

### Testing



- **(es/parser)** Add a test for a fixed issue (#4085) ([792ab2c](https://github.com/swc-project/swc/commit/792ab2ca251eadd5a85e496a35af31acada7cf9f))

## [1.2.158] - 2022-03-18

### Bug Fixes



- **(css/prefixer)** Reduce the number of vars in debug build (#4078) ([4af5e6d](https://github.com/swc-project/swc/commit/4af5e6d77bff7bf6bf247b18185b22754c3ceceb))


- **(es/helpers)** Fix decorator helper script (#4072) ([55cfad1](https://github.com/swc-project/swc/commit/55cfad152d52e7f818fc4e71913e94ce84ab91a2))


- **(es/modules)** Fix sourcemap, really (#4074) ([22d005e](https://github.com/swc-project/swc/commit/22d005e2246505ad01ee1aef0be714f98ff7b577))


- **(es/react)** Fix `_createElement` (#4070) ([bb08354](https://github.com/swc-project/swc/commit/bb08354950beb8155fbe27abcc391e43e1c15e2b))

### Features



- **(es/modules)** Support namespaced reexports (#4073) ([9458f08](https://github.com/swc-project/swc/commit/9458f08092e544cf051a88001b195f8543035d1c))

### Miscellaneous Tasks



- **(repo)** Auto-lock outdated issues and PRs (#4066) ([ed7a5e5](https://github.com/swc-project/swc/commit/ed7a5e54ccdf7f6835082286fa9892f0cf3ac270))

## [1.2.157] - 2022-03-17

### Bug Fixes



- **(es/ast)** Revert removal of `definite` in `PrivateProp` (#4051) ([bbe8f3d](https://github.com/swc-project/swc/commit/bbe8f3d8fe0a5a62fa2624c5cbe46980ad6264ac))


- **(es/codegen)** Fix codegen of string literals (#4037) ([bd444c0](https://github.com/swc-project/swc/commit/bd444c0ceb1bfdc8582e15dec439917474b55b25))


- **(es/codegen)** Fix sourcemap (#4062) ([9310c39](https://github.com/swc-project/swc/commit/9310c39fe922283b4bea46c30b08f8768cda577d))


- **(es/helpers)** Add missing `export` for `classPrivateFieldLooseKey` (#4045) ([3125bba](https://github.com/swc-project/swc/commit/3125bbacbe1dc9afa9e2c809146dcf42ab5c82de))


- **(es/helpers)** Export `classPrivateFieldLooseKey` as `default` (#4047) ([025c921](https://github.com/swc-project/swc/commit/025c921409caa53131bdacd3db2d4adeb1806d52))


- **(es/helpers)** Fix the name of `_classPrivateFieldLooseBase` (#4061) ([f8a3849](https://github.com/swc-project/swc/commit/f8a3849299e666e1b6543fec953732ed9c88a225))


- **(es/parser)** Allow nested ambient context in `.d.ts` files (#4060) ([ffcb6ce](https://github.com/swc-project/swc/commit/ffcb6ce523fb4ffba8531d5194f69e62c63d3d9a))


- **(plugin/runner)** Make build pass for `wasm32` (#4056) ([5c84fe5](https://github.com/swc-project/swc/commit/5c84fe525f336064eaa5b383cb4606f1b3cd8df2))

### Features



- **(cli)** Enable plugins for `swc_cli` (#4059) ([fefb587](https://github.com/swc-project/swc/commit/fefb5870c7ed9bb4a97be778bf3be1eee74aa344))


- **(css/prefixer)** Support more properties (#4055) ([f2517a3](https://github.com/swc-project/swc/commit/f2517a345bcae30ebb4f0b2910a8db31e944648d))


- **(es/lints)** Implement `yoda` rule (#3886) ([833958b](https://github.com/swc-project/swc/commit/833958bd7469993e756c24dcd1263ef2c5ef9eb9))


- **(node-swc)** Add `libc` field in Linux platform packages (#4046) ([db9b988](https://github.com/swc-project/swc/commit/db9b9888459c0394209f68bad421eb31a491547a))


- **(node-swc)** Embed target triple string (#4058) ([5a2a603](https://github.com/swc-project/swc/commit/5a2a6037d442d76d557d07795def5653aff91f2a))

## [1.2.156] - 2022-03-16

### Bug Fixes



- **(es)** Sort spans while preserving comments (#4011) ([b337c2e](https://github.com/swc-project/swc/commit/b337c2e2d4716520c3cf718b2037d299d9654bc5))


- **(es/compat)** Change pass ordering of `es2015` (#4029) ([e19a60a](https://github.com/swc-project/swc/commit/e19a60aad44318d9752f790c913bf010423e7f7c))


- **(es/decorator)** Remove `noop_fold_type` (#4022) ([0c8c3d7](https://github.com/swc-project/swc/commit/0c8c3d7d51e49ad9050224a8647ebc55a0262b35))


- **(es/decorator)** Insert initializer to constructor with body (#4028) ([0c76696](https://github.com/swc-project/swc/commit/0c76696ed2d8cbf00a18fd9506b8c09f1be9cdd3))


- **(es/helpers)** Inject helpers for scripts (#4025) ([73c91d3](https://github.com/swc-project/swc/commit/73c91d34d5c6fcd869e99db02b0cf82f8e159224))


- **(es/lints)** Fix false-positive of `duplicate-exports` (#4041) ([ba1c854](https://github.com/swc-project/swc/commit/ba1c854fb1685e581599da3e9f25a4e35a9279bc))


- **(es/modules)** Use correct span for `ExportAll`s (#4038) ([834cd4f](https://github.com/swc-project/swc/commit/834cd4f7b6866729b345fe68ce6386dc94b202d7))


- **(es/parser)** Report an error if `LeftHandSideExpression` is invalid (#4001) ([f8d6127](https://github.com/swc-project/swc/commit/f8d6127dd1a064e2d4b255dfc1894a1b9eb89f71))


- **(es/parser)** Allow building with stable `rustc` (#4024) ([25e5ccc](https://github.com/swc-project/swc/commit/25e5ccc548260823c9ad78b607617440e04950d3))


- **(es/parser)** Emit an error for multiple constructors with body (#4031) ([120d2a5](https://github.com/swc-project/swc/commit/120d2a534e76003e726848f3fc9f6c648a837dbb))


- **(node-swc)** Disable logging of `warn` level by default (#4033) ([bba5a33](https://github.com/swc-project/swc/commit/bba5a33415b6420c9e7b85f50da4df6c11ac9e6d))

### Features



- **(cli/compile)** Support `out-file` (#4016) ([629709e](https://github.com/swc-project/swc/commit/629709e1b14bb6c5a6b9963fec234fb9c6911786))


- **(css)** Supports more color notations (#4009) ([a4bc092](https://github.com/swc-project/swc/commit/a4bc0927a0c44ba9d3219964d8548a0cf11d24ce))


- **(css/prefixer)** Implement more rules for prefixer (#4013) ([4f6f244](https://github.com/swc-project/swc/commit/4f6f244170f2059e1b5a3765560b91c102e00a1b))


- **(es/minifier)** Drop noop calls (#4019) ([be09ea6](https://github.com/swc-project/swc/commit/be09ea6991165162fd9fa4cfce2ead4cdba0b0cf))


- **(es/transforms/base)** Add `paren_remover` (#4034) ([3a4704f](https://github.com/swc-project/swc/commit/3a4704fe77d3d3533e2f1dc438c63c8058a1df51))

### Miscellaneous Tasks



- **(ci)** Make bump-command check lazy (#4018) ([c27b84c](https://github.com/swc-project/swc/commit/c27b84c3f693ecae73cb0da74dd6f6178d8ab45e))


- **(ci)** Fix auto-rebase script ([9b8b111](https://github.com/swc-project/swc/commit/9b8b11126480ae9b1160f3b5722fc4e27a05b025))


- **(ci)** Revert package scripts to fix publish action (#4039) ([eee8e0f](https://github.com/swc-project/swc/commit/eee8e0f7bb025fea83c6ba44a506799be061c2f6))- **general**: Fix CI ([da1fd03](https://github.com/swc-project/swc/commit/da1fd033b846696dec555d2e7cfb2b62b0f4d7eb))

### Refactor



- **(es/minifier)** Cleanup (#4020) ([3173047](https://github.com/swc-project/swc/commit/3173047f589128c429d02b7cb128d80f0fd6e011))


- **(plugin/runner)** Split modules and introduce feature flags (#4035) ([dab2002](https://github.com/swc-project/swc/commit/dab2002a2eebefde1db545fd8f388fa528079f33))

### Testing



- **(es)** Add tests for fixed issues (#4036) ([71f7cf2](https://github.com/swc-project/swc/commit/71f7cf2011fd948a0c1d7c4268316f3c0103f2f3))

### Build



- **(tsconfig)** Set `tsbuildinfo` filename (#4042) ([a1308c9](https://github.com/swc-project/swc/commit/a1308c9a16c651555acb2c6e082ce95519fda88e))

## [1.2.155] - 2022-03-14

### Bug Fixes



- **(common)** Don't use `None` as source while generating source maps (#4007) ([0ad13d9](https://github.com/swc-project/swc/commit/0ad13d93f288e54f245b249920d74cfe13d1e969))


- **(css/codegen)** Fix source maps (#3997) ([ece8d96](https://github.com/swc-project/swc/commit/ece8d962f86a9adadf02b425288308a2a06851fb))


- **(es)** Merge `jsc.loose` and `jsc.assumptions` (#3990) ([3590ea2](https://github.com/swc-project/swc/commit/3590ea22779fa3ca57fc9eab55cd203f9fb23f29))


- **(es/resolver)** Use correct context for identifiers after type parameters (#4000) ([87a3c1c](https://github.com/swc-project/swc/commit/87a3c1c91673c2609e71eda12f969a1fd4e56294))

### Documentation



- **(api/rust)** Add examples (#4002) ([dac84b9](https://github.com/swc-project/swc/commit/dac84b98e38bd546cb9c9df72e3ad8d08b9550d9))


- **(api/rust)** Add an example for generating code and sourcemap (#4005) ([f650ca6](https://github.com/swc-project/swc/commit/f650ca6bb91845558d66c975d7c01c235eaa4ab1))

### Features



- **(common)** Implement a pretty error reporter (#3946) ([40b8a4e](https://github.com/swc-project/swc/commit/40b8a4e596f0df33a325c93b75e5abab1336be11))


- **(css/parser)** Improve error reporting (#3999) ([96d6f37](https://github.com/swc-project/swc/commit/96d6f37c204f4962d0850a4ee2e38652d4833fa3))


- **(es/minifier)** Implement more rules for `arrows`  (#3992) ([64ca5ba](https://github.com/swc-project/swc/commit/64ca5bae4d87b0aed82776d74e6aa5e2a712a35f))


- **(es/minifier)** Compress more comparisons (#3996) ([a23af2d](https://github.com/swc-project/swc/commit/a23af2dea243a16a12ce09c778f6fd3d56da0382))

### Miscellaneous Tasks



- **(ci)** Invoke `yarn` before publishing ([743a5da](https://github.com/swc-project/swc/commit/743a5da1e5e6a3c9b8c59694e4f3cf04fa89006d))


- **(es/preset-env)** Track `.json` files to make cargo happy ([bd0fcb9](https://github.com/swc-project/swc/commit/bd0fcb9ea491f713ab3c0ed2b6035d3438446e8e))- **general**: Update linguist (#3991) ([0312292](https://github.com/swc-project/swc/commit/0312292410e3e001906241f5a2ab88839995376f))

### Performance



- **(es/minifier)** Refactor base54 (#3989) ([04db7e2](https://github.com/swc-project/swc/commit/04db7e2a9be00248e005deb0a9113bcba0039e8f))


- **(es/minifier)** Use `Vec<u8>` as a buffer for `base54` (#3993) ([f7b212b](https://github.com/swc-project/swc/commit/f7b212bfc4fe9cdc89b77b5639be52a586c220e0))

### Testing



- **(*)** Print diagnostics to stderr while testing (#4003) ([ee9a841](https://github.com/swc-project/swc/commit/ee9a841f33005c1ae287151952cf132a18b26de6))


- **(es)** Add an execution test system (#3994) ([b22d084](https://github.com/swc-project/swc/commit/b22d084180b77508f5e940045eb1b7bb9cd5c99b))


- **(es)** Add auto-closable tests (#3995) ([dabc492](https://github.com/swc-project/swc/commit/dabc4920a813ab395a96f9f8f90b3c50163063f9))

### Build



- **(cargo)** Set workspace default members (#3978) ([560c81b](https://github.com/swc-project/swc/commit/560c81b120043b1edc20702a3ccfe3d3336c489a))

## [1.2.154] - 2022-03-12

### Bug Fixes



- **(es)** Change error message as it can be misleading (#3982) ([48f2fd8](https://github.com/swc-project/swc/commit/48f2fd8e1b723e3dfa1d54c25aa9f3c391c5ee74))


- **(es/preset-env)** Fix compilation issue (#3972) ([7ebfcfa](https://github.com/swc-project/swc/commit/7ebfcfa70f1456e627f6cf30f65c00e2b0b17476))


- **(es/preset-env)** Publish `builtin.json` (#3973) ([858372f](https://github.com/swc-project/swc/commit/858372ffada23f0f36c1161d2ec36b6da93d973c))


- **(es/preset-env)** Move out finished proposals (#3970) ([502f934](https://github.com/swc-project/swc/commit/502f934ce5397526db3a26554293841c3c5821ae))


- **(preset-env)** Use `core-js-compat` and `@babel/compat-data` directly (#3968) ([487273f](https://github.com/swc-project/swc/commit/487273fc5b5f964c159ea23d409b0f66e1d74229))

### Features



- **(*)** Update dependencies (#3964) ([1206c84](https://github.com/swc-project/swc/commit/1206c84e19eca2711670e96407c47062c22a4d04))


- **(css/codegen)** Fix source maps and ast defs (#3974) ([516dbc6](https://github.com/swc-project/swc/commit/516dbc65dc769b21411989f4397dc97cf97571ed))


- **(css/prefixer)** Prefix more properties (#3976) ([4a9a5ff](https://github.com/swc-project/swc/commit/4a9a5ffa4b128c706f9a73a8465a317240c4babf))


- **(es/lints)** Mark catch params as binding patterns while checking duplicates (#3981) ([f28134f](https://github.com/swc-project/swc/commit/f28134fe774173b6e12c8571c92fe1c015f8b53b))

### Miscellaneous Tasks



- **(ci)** Skip unnecessary package for the benchmark (#3980) ([485dc54](https://github.com/swc-project/swc/commit/485dc54d299c6f48752841401d2bfaf716f64f06))


- **(es/parser)** Add some inline attributes (#3969) ([6a6c322](https://github.com/swc-project/swc/commit/6a6c32203b8f2fde61279320cca505052f969da3))


- **(es/preset-env)** Use js script for copying files (#3986) ([83722df](https://github.com/swc-project/swc/commit/83722df21a54d29caffb6fe8eb1261763a085830))

### Performance



- **(common)** Use `fxhash` everywhere (#3985) ([db60291](https://github.com/swc-project/swc/commit/db602911647360e0a26139d93882c353ba4d9330))


- **(es/minifier)** Make mangler faster by merging hash sets into one (#3983) ([107c91d](https://github.com/swc-project/swc/commit/107c91dd206e31c221df98446f71e8f18020c060))


- **(es/minifier)** Use fxhash for integers (#3984) ([67e6154](https://github.com/swc-project/swc/commit/67e615421f85aee2919016a5d01e4ebb1b9b08c4))


- **(es/minifier)** Merge hashmap for scoping before checking (#3988) ([1beecce](https://github.com/swc-project/swc/commit/1beecceead16765abd1b698d3a255e647a2adcc7))

### Testing



- **(es)** Add tests for fixed issues (#3987) ([073d847](https://github.com/swc-project/swc/commit/073d847a33fe9902428633292efa8a606fe208f1))

## [1.2.153] - 2022-03-11

### Bug Fixes



- **(api/rust)** Fix transform comment api (#3962) ([fcbd3c5](https://github.com/swc-project/swc/commit/fcbd3c5c5849418b911d87d3a0b36eb84bef1a68))


- **(es)** Adjust tracing span level (#3911) ([ca071fb](https://github.com/swc-project/swc/commit/ca071fb705210ec33698dbce81069156de4fcf7a))


- **(es/codegen)** Fix sourcemap issue caused by reserved `BytePos` values (#3948) ([e8018c5](https://github.com/swc-project/swc/commit/e8018c54d4581c43c72d27e51d0aa36a64881a9e))


- **(es/compat)** Refer this in constructor when `super_is_callable_constructor` is set (#3944) ([de8a711](https://github.com/swc-project/swc/commit/de8a7116cd587a6ddb8d734ffd96cdacd076f48c))


- **(es/lints)** Don't visit types while collecting `const` (#3967) ([c6b5371](https://github.com/swc-project/swc/commit/c6b5371c51413577165543eddb78e7d051f3d376))


- **(es/minifier)** Preserve fuction parameters used for template literals in `evaluate` and `reduce_vars` (#3949) ([91a302a](https://github.com/swc-project/swc/commit/91a302a672a70a34fe693fa84d65ba87901d0f36))


- **(es/parser)** Parse if-else chain iteratively (#3961) ([76e6468](https://github.com/swc-project/swc/commit/76e646804a025e2a451314013a437e79a6cd8ce2))


- **(node-swc/types)** Add `reserved` to `TerserMangleOptions` (#3959) ([70a68a7](https://github.com/swc-project/swc/commit/70a68a785091845c5e66ab3fe0fd52cc47f11a80))

### Features



- **(css/codegen)** Support source map (#3958) ([5a6ebd3](https://github.com/swc-project/swc/commit/5a6ebd36ee7a35e81e4f3b0961106a41f83f6b7f))


- **(es)** Add an option to preserve all comments (#3815) ([c5a0c9a](https://github.com/swc-project/swc/commit/c5a0c9a0ab2345aa9c41a40100d049a144dfb70f))


- **(es/lints)** Refine error message (#3952) ([579aeb7](https://github.com/swc-project/swc/commit/579aeb7cfacb38d822634e5c82b209bd311ac9b2))

## [1.2.152] - 2022-03-10

### Bug Fixes



- **(es)** Don't create `.swc` if not required (#3937) ([46e9d3f](https://github.com/swc-project/swc/commit/46e9d3f62e07b5aaeac9a9f73bb4b5573ad69b27))


- **(es/compat/es2015)** Fix span handling of `arrow` and `classes` (#3921) ([12b8606](https://github.com/swc-project/swc/commit/12b8606c99994a1ae4fc65105cd380f1a34d632e))


- **(es/minifier)** Skip exported vars while collapsing vars (#3928) ([cc564ff](https://github.com/swc-project/swc/commit/cc564ff6c586db266f0ab8fcb7f25a8d32155d35))


- **(es/module)** Make exported vars follow specification (#3906) ([534fc52](https://github.com/swc-project/swc/commit/534fc52a727e5be43adfad47ed3fcdd606967c5c))


- **(es/module)** Fix exported vars with bigint values (#3909) ([8559fc9](https://github.com/swc-project/swc/commit/8559fc96239026d070f7fcf415e5443b096de605))


- **(es/module)** Use correct return values for suffix update expressions (#3927) ([dc457b4](https://github.com/swc-project/swc/commit/dc457b4883ef23815fcdff952c040e5e1e7d7897))


- **(es/module/cjs)** Allow re-exports to be lazy (#3856) ([f575b1b](https://github.com/swc-project/swc/commit/f575b1bc4868dd46c572c3ef61767fdd2ee2c2b3))


- **(es/parser)** Fix the logic for token contexts (#3926) ([4b4aef3](https://github.com/swc-project/swc/commit/4b4aef3270cac8bdd75c79af9be186bf446b23f1))


- **(es/transform/optimization)** Prevent inlining of vars used as RHS in logical expressions (#3907) ([782a874](https://github.com/swc-project/swc/commit/782a8746963f11a1ada446cb1f744a58f6516cf8))


- **(es/typescript)** Remove imports used in interfaces and type signatures (#3893) ([5c92b2d](https://github.com/swc-project/swc/commit/5c92b2d4cee64686d0aad788b177b34cd2fd3bfc))


- **(wasm)** Fix handling of `swc_common::GLOBALS` (#3936) ([45a4374](https://github.com/swc-project/swc/commit/45a4374ee19154238eb24952cffbd9e134831c8b))

### Features



- **(common)** Align `stable_hasher` to latest rustc (#3895) ([372f298](https://github.com/swc-project/swc/commit/372f298f5f6faae804370a3caaf8dce309fcb9f5))


- **(css/lints)** Implement `custom-property-no-missing-var-function` rule (#3890) ([19ececc](https://github.com/swc-project/swc/commit/19ececcd507da27993b421ae76fd0f259b516125))


- **(css/lints)** Implement `no-duplicate-at-import-rules` rule (#3833) ([59c84ac](https://github.com/swc-project/swc/commit/59c84ac8bdd2919bb6c8550bc5d8ec7b814f9cda))


- **(css/parser)** Improve error recovery (#3901) ([6f781c3](https://github.com/swc-project/swc/commit/6f781c3b43a99ce65e5680665b8101a382adb4ef))


- **(css/prefixer)** Implement more prefixing rules (#3905) ([b25c479](https://github.com/swc-project/swc/commit/b25c47901e69a04079cbb9ce1e76154a8affbd11))


- **(css/prefixer)** Handle more properties (#3919) ([c2b9e1c](https://github.com/swc-project/swc/commit/c2b9e1c61aa5f72aa0738349ee330d46b9446ed6))


- **(css/prefixer)** Implement more rules (#3933) ([62ab179](https://github.com/swc-project/swc/commit/62ab17999eb98312bb03f3ad2f436fbac6ae4acc))


- **(es/compat)** Add tracing support to remaining compat transforms (#3904) ([bd0a921](https://github.com/swc-project/swc/commit/bd0a9214c3a678a65a814517ffef6c59199ac06b))


- **(es/compat)** Add pure comments for class fields keys (#3939) ([112f428](https://github.com/swc-project/swc/commit/112f4287343c818c28dc9d422c3df78d9f663397))


- **(es/fixer)** Remove extra parens around IIFE in statements (#3918) ([7cfa930](https://github.com/swc-project/swc/commit/7cfa930a629da96b30c2d5021a51d15c0b121013))


- **(es/minifier)** Remove pure calls (#3925) ([bd838ac](https://github.com/swc-project/swc/commit/bd838ac5a9524c1a7f3db34c2110c6ddb9718de0))


- **(es/minifier)** Improve dropping of unused vars (#3923) ([9e4dea6](https://github.com/swc-project/swc/commit/9e4dea6663eaba794fb4793318865892eecce910))


- **(es/parser)** Report errors for non-abstract members in an abstract class (#3917) ([16182d5](https://github.com/swc-project/swc/commit/16182d586f1b54e383ae83a264576267441e49ba))


- **(es/parser)** Relax MSRV requirement (#3922) ([a8ac7e3](https://github.com/swc-project/swc/commit/a8ac7e39b0fbd3908c4b506a1739a0ddf33ac250))


- **(es/testing)** Print comments in `test_fixture` (#3920) ([3d43a9b](https://github.com/swc-project/swc/commit/3d43a9b69df6002786654b3c378b9d981447c126))


- **(preset-env)** Update `browserslist-rs` (#3935) ([aec1a54](https://github.com/swc-project/swc/commit/aec1a54204e2140511442479753b6502448f25cb))

### Performance



- **(*)** Update `tracing` to improve performance of disabled spans (#3932) ([86ea237](https://github.com/swc-project/swc/commit/86ea23785d911f572474d73462cc8bd9af6afaf6))


- **(es)** Add fast memory deallocator (#3910) ([f3da349](https://github.com/swc-project/swc/commit/f3da3499c5b2a2a58bdc85f33dd5886f49704932))


- **(es/minifier)** Remove needless type parameter (#3897) ([8b3aa6d](https://github.com/swc-project/swc/commit/8b3aa6d3aaf46a7bf4e8972bc867dede950196db))


- **(es/minifier)** Make optimization of pure calls parallel (#3938) ([f1ec862](https://github.com/swc-project/swc/commit/f1ec8620ac0df2f0325bd0437227b277de099950))


- **(es/parser)** Improve performance by adjusting inlining (#3902) ([4387813](https://github.com/swc-project/swc/commit/43878137e71894fbb3367473317ba65de5e40616))

### Refactor



- **(css/parser)** Remove unused codes (#3903) ([3a9af73](https://github.com/swc-project/swc/commit/3a9af7316748641e8b59b59d014513456ecfc606))

## [1.2.151] - 2022-03-07

### Bug Fixes



- **(es/module)** Revert fix for `jest.spyOn` ([8e30d83](https://github.com/swc-project/swc/commit/8e30d83d145061c9ee256e76e77e64ab0b5552ed))

### Features



- **(es/compat)** Enable `set_public_method` for TypeScript (#3884) ([cb93883](https://github.com/swc-project/swc/commit/cb93883232515cbce46d1f87a0f5feec37bd489c))


- **(es/fixer)** Remove extra parens around iife in expression position (#3887) ([9dd0105](https://github.com/swc-project/swc/commit/9dd0105c5b5479e421b36a0fb5ea3f2ea788d8a5))


- **(es/lints)** Support module/script mode in `duplicate_bindings`  (#3880) ([0181fbe](https://github.com/swc-project/swc/commit/0181fbe63b04145b99475a63a81937d8039abcd7))

### Performance



- **(es/lints)** Extract top level bindings only if the rule is enabled (#3889) ([3e8efac](https://github.com/swc-project/swc/commit/3e8efacf3a804c4dbaa3f92fa2f5f08e425b7866))


- **(es/minifier)** Add a fast-path to export merger (#3891) ([a47eed7](https://github.com/swc-project/swc/commit/a47eed7241bb3aa932cd51109c39b7f7fe6d4789))

## [1.2.150] - 2022-03-06

### Bug Fixes



- **(es/module)** Fix `jsc.paths` (#3879) ([a65755f](https://github.com/swc-project/swc/commit/a65755fd9a2dfa9bad929df735bb7b3c21613972))


- **(es/parser)** Fix parsing of `const` in ambient context (#3883) ([aea59b8](https://github.com/swc-project/swc/commit/aea59b844ce224250e42315b44ca19db19fbc537))

## [1.2.149] - 2022-03-06

### Bug Fixes



- **(css/lints)** Allow empty `@layer` at-rule before `@import` at-rule (#3842) ([90fdbab](https://github.com/swc-project/swc/commit/90fdbab0d67f1fca8b52fb6df9b927cc35219445))


- **(es/lints)** Ignore identifiers used as types while checking for duplicate bindings (#3869) ([d10e662](https://github.com/swc-project/swc/commit/d10e66285bab3ae6aadd1d4e6ef3ae0d5c977ec4))


- **(es/minifier)** Don't remove comments if `compress` is not configured (#3866) ([e70c9d8](https://github.com/swc-project/swc/commit/e70c9d8f22ad91f7a1246ac60b0ace8a3b3e7d79))


- **(es/module)** Fix `jest.spyOn` (#3845) ([9546eef](https://github.com/swc-project/swc/commit/9546eefe72178bbc7059d0fc6c5e7e9bbca089e0))


- **(es/module)** Visit the value of class properties (#3877) ([6a005fc](https://github.com/swc-project/swc/commit/6a005fc15a16c0d056a559fe3695a61b2e63944b))


- **(es/parser)** Use unicode id instead of xid (#3867) ([4426250](https://github.com/swc-project/swc/commit/44262508c6e122e7f9dd8e0ad961a4d6ad4a8a0c))


- **(es/parser)** Allow `await` in non-strict mode (#3871) ([f757163](https://github.com/swc-project/swc/commit/f7571630caf249b4a10101a2f1c86b2bbc12d4d6))

### Features



- **(cli)** Setup subcommands for the features (#3858) ([367a57d](https://github.com/swc-project/swc/commit/367a57df6d66bc11dd750c6b7c30bf3a114e00fa))


- **(css)** Improve error recovery (#3853) ([c84bf13](https://github.com/swc-project/swc/commit/c84bf133a6ffce311548170cb9c4b0edb9804478))


- **(css/lints)** Allow using regex in ignore list (#3855) ([dc0de58](https://github.com/swc-project/swc/commit/dc0de58a46c495bb520a99c4d8e8fcf380713f54))


- **(css/minifier)** Compress `@import` at-rule (#3850) ([ccfb4bf](https://github.com/swc-project/swc/commit/ccfb4bfc0b10375d96620f2748b0a3d022c4e359))


- **(es/compat)** Implement loose mode for `async_to_generator` (#3870) ([c7f2bdb](https://github.com/swc-project/swc/commit/c7f2bdb8138f4fbe59b6a03f9d6aa74966389d04))


- **(es/minifier)** Implement `pure_getters` partially (#3872) ([a264360](https://github.com/swc-project/swc/commit/a2643608a7aeda910da0ed03a705cff3ddecd543))


- **(es/module/cjs)** Support regex-based patterns for lazy config (#3704) ([1f70fa6](https://github.com/swc-project/swc/commit/1f70fa6e08e9b400c2e34ee9f0d6749cf21b9e3f))


- **(es/transform)** Unify logic for handling class properties (#3766) ([6f076e4](https://github.com/swc-project/swc/commit/6f076e4927fca646882709832826dc0eb7106e35))

### Performance



- **(es)** Filter logs for `cranelift` out (#3801) ([225f9a7](https://github.com/swc-project/swc/commit/225f9a7f2a3dad917aaf2a231463ec05699b4064))


- **(es/ast)** Implement `Clone` without inline for some enums (#3878) ([3b04789](https://github.com/swc-project/swc/commit/3b04789a5750532ab9ccb78a833226b39b47a714))


- **(es/compat)** Add tracing support to transforms for from es2017 to es2019 (#3844) ([a933db5](https://github.com/swc-project/swc/commit/a933db5a1a54804efefd1b1d901b85a44ba059a5))


- **(es/compat)** Add tracing support for es2015 transforms (#3857) ([cd8bb0f](https://github.com/swc-project/swc/commit/cd8bb0fb2c70c30ea421842fc6c5b6837e3ff182))


- **(es/transform)** Use `SingleThreadedComments` for transform (#3847) ([73ec0b3](https://github.com/swc-project/swc/commit/73ec0b3dd734dfd1ee79addfe078c709620ade17))

### Testing



- **(es)** Add a test for a fixed issue (#3873) ([0ab3263](https://github.com/swc-project/swc/commit/0ab32639a1ce04eba221a0bc958d150ba65fa656))


- **(es)** Add tests for fixed issues (#3874) ([2605e13](https://github.com/swc-project/swc/commit/2605e132e683ad0b649621a321be31347e0ac5e6))


- **(es)** Add tests for fixed issues (#3875) ([8d3c9d3](https://github.com/swc-project/swc/commit/8d3c9d39f036a1e876ca98bd801515edfe1cee5b))


- **(es/transform/jest)** Ensure that sourcemap is working (#3864) ([fc87f43](https://github.com/swc-project/swc/commit/fc87f43507ed398eb0941cffb426321e1b781980))


- **(swc)** Use external helpers for reference testing (#3865) ([8400708](https://github.com/swc-project/swc/commit/84007087688292fe7fcb1becea56538944dabc66))

## [1.2.148] - 2022-03-04

### Bug Fixes



- **(css/codegen)** Fix codegen of preserved tokens (#3819) ([7ba5861](https://github.com/swc-project/swc/commit/7ba5861a334657cb443b2f143222f632fcbcf752))


- **(css/codegen)** Fix the output of `SimpleBlock` (#3838) ([e3a5c14](https://github.com/swc-project/swc/commit/e3a5c142d5f6e965478bd68201714e6d0b4bc863))


- **(css/parser)** Fix parsing of `;` in values (#3821) ([30cd29b](https://github.com/swc-project/swc/commit/30cd29b0f0153bd732f0004dfcb10892635ee027))


- **(es/compat)** Fix block scoping of variables (#3826) ([406b8ea](https://github.com/swc-project/swc/commit/406b8eaeafa37d1ec68a5d5aca0f8dd337ae39ec))


- **(es/hygiene)** Fix renaming bugs (#3824) ([043fba2](https://github.com/swc-project/swc/commit/043fba274e13055dad4b2f6cee85b1bf751572ca))


- **(es/minifier)** Preserve more variables (#3805) ([89388e6](https://github.com/swc-project/swc/commit/89388e6ac3669f129d1dfc1f687ad7792373dbc9))


- **(es/minifier)** Don't reorder unnecessarily (#3817) ([8a468f7](https://github.com/swc-project/swc/commit/8a468f7544ae7e717de4d629c33e5cdffdfcc7de))


- **(es/minifier)** Support declaring multiple bindings with the same name (#3837) ([0fc819e](https://github.com/swc-project/swc/commit/0fc819e2ef04a5a809d1c15523262b2f3fbc580a))


- **(node-swc)** Correctly close trace spans after completion (#3811) ([ffb2ee8](https://github.com/swc-project/swc/commit/ffb2ee85e6e3cac7136578c2eaaff73b883f208c))


- **(node-swc)** Fix handling of `OptionalChainingExpression` in `Visitor` (#3809) ([4d123c3](https://github.com/swc-project/swc/commit/4d123c3789cd5a837de08014675e945990122c62))


- **(node-swc/types)** Add a missing field of `ExportNamedDeclaration` (#3822) ([bde7577](https://github.com/swc-project/swc/commit/bde75770988a6e1c9bb6ae4b850866cea79b0f2c))

### Features



- **(config)** Add a dedicated cached regex (#3832) ([efc6741](https://github.com/swc-project/swc/commit/efc67417a5afd7813c2d09938300b5c372d1a978))


- **(css)** Support color functions (#3836) ([3df887c](https://github.com/swc-project/swc/commit/3df887ca3744813d8cfc6c253a7bb3decaca54db))


- **(css/lints)** Add `font-family-no-duplicate-names` rule (#3818) ([2d273d6](https://github.com/swc-project/swc/commit/2d273d60b9dec4d9f969f0e691ba21ce4b252b7d))


- **(css/lints)** Implement `color-hex-alpha` rule (#3829) ([818b408](https://github.com/swc-project/swc/commit/818b40857328ae9b855d78d774621fa1ab243da9))


- **(css/minifier)** Compress more declarations (#3840) ([0db6915](https://github.com/swc-project/swc/commit/0db6915e32d6c1de848b0f5aeacea2c4cb4522f8))


- **(css/parser)** Improve error recovery (#3810) ([f969f8c](https://github.com/swc-project/swc/commit/f969f8c5f54e3028576a74ccfcaae72b1c19eaf9))


- **(css/parser)** Improve error recovery (#3828) ([fbb98aa](https://github.com/swc-project/swc/commit/fbb98aa73cbbac186493065af8cfa0fd31407fe6))


- **(es/lints)** Implement `radix` rule (#3651) ([f6b4bbe](https://github.com/swc-project/swc/commit/f6b4bbe47beccb6052d60c8e6d7d8c8c7fec5100))


- **(es/minifier)** Drop more function parameters in strict mode (#3814) ([789eb7b](https://github.com/swc-project/swc/commit/789eb7baa9ece80e85f0ffd9a92f4d07214d9b11))


- **(es/minifier)** Improve sequential inlining (#3820) ([364532e](https://github.com/swc-project/swc/commit/364532e9a74ee55196cecb37eb3fc8256e3a23df))


- **(es/minifier)** Implement more rules (#3841) ([260c2a8](https://github.com/swc-project/swc/commit/260c2a885e16332a0e3401bccb65d1381bfab3f3))

### Miscellaneous Tasks
- **general**: Ignore linguist detection for CSS test files (#3831) ([8755ce1](https://github.com/swc-project/swc/commit/8755ce160f9fa6f9ce75c4ac40fc02d5df236d2d))

### Performance



- **(es)** Use `Mutex` from `parking_lot` (#3830) ([351b814](https://github.com/swc-project/swc/commit/351b814ed0f1ca36a1e8fd352674689ffe392eda))


- **(es/parser)** Remove duplicated instantiations of `Parser` to reduce binary size (#3813) ([f5103a7](https://github.com/swc-project/swc/commit/f5103a77256060e2c27ca360d0c58bbcc6b92b13))

### Testing



- **(es/compat)** Organize tests (#3825) ([814dcc0](https://github.com/swc-project/swc/commit/814dcc09d66f9c7a968348fc3a08573cadd036f8))

## [1.2.147] - 2022-03-02

### Bug Fixes



- **(es/compat)** Initialize class fields as a last step (#3767) ([11bf29f](https://github.com/swc-project/swc/commit/11bf29f44b4233b2e7f60b750ef56429dbe47ce9))


- **(es/minifier)** Disable some operations for asm.js codes (#3572) ([e7f7f69](https://github.com/swc-project/swc/commit/e7f7f69db4f327b35005e863d3669bad382626c6))


- **(es/minifier)** Fix inlining logic (#3776) ([cfc0363](https://github.com/swc-project/swc/commit/cfc036381a5c174798198f4ecf7e0a62abce5a75))


- **(es/minifier)** Preserve unresolved references (#3780) ([73cab63](https://github.com/swc-project/swc/commit/73cab638a11978da9f94c886a5fafc462b1556b7))


- **(es/minifier)** Fix optimizations of terminating expressions (#3794) ([8beaa20](https://github.com/swc-project/swc/commit/8beaa202e2a8c321a0f2266378d0f0a3ecb06c03))


- **(es/react)** Catch refresh directives widely (#3791) ([5ae907f](https://github.com/swc-project/swc/commit/5ae907f6f21d31da708ac7237536bd6f838856c3))


- **(es/react)** Fix logic for extracting refresh comments (#3796) ([b485b5a](https://github.com/swc-project/swc/commit/b485b5a1d5480548de9ce2c22060be37298e6346))


- **(es/typescript)** Transform `this` in TypeScript classes (#3764) ([5f3f9ef](https://github.com/swc-project/swc/commit/5f3f9ef033797a1b13d32bd854c3acf3cbaf4495))


- **(node-swc/cli)** Correctly expose `swcx` entrypoint (#3784) ([95ecc01](https://github.com/swc-project/swc/commit/95ecc013fe9b0ab0c2f52465bd961616315938c3))

### Documentation



- **(adr)** Add `adr-00002` for event trace profiling (#3787) ([3c1c5d0](https://github.com/swc-project/swc/commit/3c1c5d0363b231a8ac3f5bdfd15f1b2ec9224849))

### Features



- **(css/ast)** Union `Value` and `ComponentValue` (#3804) ([3ec45a6](https://github.com/swc-project/swc/commit/3ec45a6858a24c56ee1fe143410f3763b2b5e4b4))


- **(css/lints)** Add CSS linter (#3765) ([66c6cae](https://github.com/swc-project/swc/commit/66c6cae8dc7d614aac83a620b4dff022459f54d7))


- **(css/lints)** Add `selector-max-combinators` rule (#3789) ([e389bef](https://github.com/swc-project/swc/commit/e389bef3ad0f27382d2d6c5f2be62dd28e65e757))


- **(css/minifier)** Convert more length (#3769) ([500d62c](https://github.com/swc-project/swc/commit/500d62c0850a93321baafb44fa4ac4b8a9bff3f8))


- **(es/codegen)** Optimize output of new expressions without arguments (#3800) ([e1b13eb](https://github.com/swc-project/swc/commit/e1b13eb21a6eb1ec094a64ab30852042b89748a8))


- **(es/compat)** Optimize handling of literals in computed property names (#3756) ([8ed4d2f](https://github.com/swc-project/swc/commit/8ed4d2fcaccf27733e8fbfe19da810504653ce6b))


- **(es/compat)** Add tracing support for `es2022` transforms (#3785) ([4d70482](https://github.com/swc-project/swc/commit/4d7048291fae26c081754a496d9c77ddb2215575))


- **(es/compat)** Use sequence expressions instead of iife in `classes` pass (#3773) ([5b6beca](https://github.com/swc-project/swc/commit/5b6beca1afb7e4278629840c94c775a083288cd2))


- **(es/compat)** Add tracing support for es2020 transforms (#3798) ([8f41d7a](https://github.com/swc-project/swc/commit/8f41d7a10e99c21dc12176ee7724f0e13ca702dd))


- **(es/dep-graph)** Add support for `require.resolve` (#3783) ([19b84e7](https://github.com/swc-project/swc/commit/19b84e7723c381843c98df90f64e5123acdd5808))


- **(es/minifier)** Consider `arguments` while dropping unused assignments (#3775) ([714e05e](https://github.com/swc-project/swc/commit/714e05e5535dd4f8552ce700cc5b582d134d8a08))


- **(es/module)** Workaround stack overflow bug of JavaScriptCore related to too many exports (#3763) ([ad0a853](https://github.com/swc-project/swc/commit/ad0a8539e058fda49e40cc8fab167e2602576d48))


- **(es/modules)** Support system js (#3659) ([557a520](https://github.com/swc-project/swc/commit/557a520a6d6814f79625ca0227c47fa2d42a806e))


- **(es/parser)** Raise a syntax error on an invalid shorthand assignment (#3734) ([2aa3b21](https://github.com/swc-project/swc/commit/2aa3b2123fc73bc187099b5c4a0b1f796b0a51f4))


- **(es/quote)** Implement quasi quoter partially (#3155) ([fe0ddcc](https://github.com/swc-project/swc/commit/fe0ddcc54b0f8343a3a3d227bde8b38fa47ebd80))


- **(es/quote)** Support variables (#3774) ([e3c374b](https://github.com/swc-project/swc/commit/e3c374b53bdd3fe8baef5be7a63b10d2efcd47e4))


- **(plugin)** Expose `swc_ecma_quote` (#3790) ([bc60a6e](https://github.com/swc-project/swc/commit/bc60a6e90ccc1adcb8d9eda9ef47725e20fbfa23))


- **(plugin/runner)** Update `wasmer` to `v2.2` (#3788) ([99d536e](https://github.com/swc-project/swc/commit/99d536e4869df5a9cc642ed0a155683165ee93c9))

### Miscellaneous Tasks
- **general**: Update `rustc` (#3768) ([3798436](https://github.com/swc-project/swc/commit/3798436201a0838e55beac974792f4d560b47657))

### Performance



- **(css/lints)** Skip disabled rules (#3803) ([0336029](https://github.com/swc-project/swc/commit/0336029c22a8751d2acb9765f11ead79c77115dc))


- **(plugin/runner)** Optimize `write_into_memory_view` (#3797) ([7fd0eee](https://github.com/swc-project/swc/commit/7fd0eeecb844a182fef39872178e3991356e3ae0))

### Refactor



- **(css/ast)** Simplify AST types (#3753) ([815a489](https://github.com/swc-project/swc/commit/815a489dcfb72df928fc03f216dbe4a21b0e0716))


- **(css/lints)** Simplify error reporting API (#3781) ([b8211da](https://github.com/swc-project/swc/commit/b8211da1c9a8277cf09a8a3a1d7ae537b5d6e783))

### Testing



- **(css/parser)** Add tests for selectors (#3770) ([1651bcc](https://github.com/swc-project/swc/commit/1651bccf4578ff2d44a9c37eab3845c006b5164d))


- **(css/parser)** Add css files for material design (#3777) ([189707a](https://github.com/swc-project/swc/commit/189707a1fd5ef8547b3b80ac82f7f422f295086a))


- **(es/minifier)** Prepare porting more rules from `terser` (#3779) ([86072b5](https://github.com/swc-project/swc/commit/86072b57f9e0cf59b660f88cdb2c9cee15f33720))

### Build



- **(node-swc)** Rename entrypoint to avoid artifact collision (#3806) ([b485a2f](https://github.com/swc-project/swc/commit/b485a2fc267e0f373b9882e61c14b9fbf7a92471))

## [1.2.146] - 2022-02-27

### Bug Fixes



- **(css)** Fix processing of integers (#3752) ([f258ee4](https://github.com/swc-project/swc/commit/f258ee4729ccd007b43b1a08d77359d99f53ca87))


- **(es/codegen)** Fix escaping of unicodes in es5 (#3636) ([dba90ea](https://github.com/swc-project/swc/commit/dba90eae875bbaec9911c6dd72d482b75de77982))


- **(es/helpers)** Cast the result of the `instanceof` helper to boolean (#3728) ([72c9e6c](https://github.com/swc-project/swc/commit/72c9e6ca2b8186c4b297658bec1ce37912898d9f))


- **(es/parser)** Handle trailing comma and bracket after an arrow function in conditional (#3685) ([342dccc](https://github.com/swc-project/swc/commit/342dccce473aa507eabb3eed96485e2ff0674188))


- **(es/typescript)** Allow empty nested namespaces (#3754) ([f5a3647](https://github.com/swc-project/swc/commit/f5a364736420c2977a5d1211ead55ea91700fccb))


- **(plugin/macro)** Do not free guest memory twice (#3732) ([d8b0166](https://github.com/swc-project/swc/commit/d8b01660dcd0bca43993043e8fa6ed33c62894a9))- **general**: Fix(es/parser) Throw a syntax error for `const` without initializer in strict mode (#3742)

Co-authored-by: Donny/강동윤 <kdy1997.dev@gmail.com> ([abc0572](https://github.com/swc-project/swc/commit/abc05725575b0ee29319f32beadb014e70af5e06))

### Features



- **(cli)** Add tracing options for `compile` command (#3746) ([41f92d2](https://github.com/swc-project/swc/commit/41f92d228b778193e12c51466630a42cb8953599))


- **(css/ast)** Support more selectors (#3729) ([f5c5e77](https://github.com/swc-project/swc/commit/f5c5e7761297e4413a1615e2537ade885ec12280))


- **(css/ast)** Allow more syntax for `@supports` at-rule (#3740) ([9b92eba](https://github.com/swc-project/swc/commit/9b92eba63686fee2176715fad8d072d6d6d34fe9))


- **(css/ast)** Improve type definitions for unicode ranges (#3757) ([91cf965](https://github.com/swc-project/swc/commit/91cf965e07a5382349262c6d6993477fde68aa58))


- **(css/minifier)** Compress `display` (#3706) ([8512719](https://github.com/swc-project/swc/commit/8512719e126d4041133a78e106bce6c7eca30154))


- **(es/codegen)** Add sourcemap entry for injected semicolons (#3750) ([0fd4fd2](https://github.com/swc-project/swc/commit/0fd4fd242287fde0e6a744dabf7c09430fb23d21))


- **(es/compat)** Implement loose mode for `class_properties` (#3722) ([14155eb](https://github.com/swc-project/swc/commit/14155eb0e7f6295471c92067afa4dfb84b3224ca))


- **(es/dep-graph)** Add `TsImportEqualsDecl` for `DependencyCollector` (#3758) ([7de7eca](https://github.com/swc-project/swc/commit/7de7ecaa85f21d074d8ca8a05dae2bf5b4ab3ce8))


- **(es/parser)** Provide more api for reducing binary size (#3747) ([47ccff8](https://github.com/swc-project/swc/commit/47ccff8a7ca0054fcd761ea5878a92165f7e1c6b))


- **(macros)** Add `#[swc_trace]` (#3738) ([b4830b6](https://github.com/swc-project/swc/commit/b4830b61dc7be716fd4de3703537517e6adefdba))


- **(node-swc)** Add experimental trace support in `@swc/core` (#3731) ([a454996](https://github.com/swc-project/swc/commit/a454996314f31ed9d8672e10588ef94815b16e98))


- **(plugin)** Support tracing plugin execution (#3744) ([5c29f15](https://github.com/swc-project/swc/commit/5c29f156404002d6946fbc7a71d76a6c97d7b82a))


- **(visit)** Allow using `?Sized` as visitor (#3745) ([b0b5d5d](https://github.com/swc-project/swc/commit/b0b5d5d0c2779e48d815fbbc65c01d5344590763))

### Miscellaneous Tasks
- **general**: Skip CI for automated commits (#3760) ([6d98d14](https://github.com/swc-project/swc/commit/6d98d146a65e801677e63069bc52e66bb5315617))- **general**: Skip more actions for automated commits (#3761) ([0ff4ad3](https://github.com/swc-project/swc/commit/0ff4ad37c3783e7b141c6d879ed0a5a7e85135a3))

### Performance



- **(es/modules)** Reduce usage of generics (#3743) ([1094018](https://github.com/swc-project/swc/commit/1094018153bc7d0373d9b7b533193191f416406d))


- **(es/parser)** Reduce usage of generics to reduce binary size (#3726) ([e21579d](https://github.com/swc-project/swc/commit/e21579d84ec287632393480e86032cc228bef0ce))

### Refactor



- **(es)** Make compilation faster (#3749) ([3d94465](https://github.com/swc-project/swc/commit/3d944656bfa47532a79925f5b7392e2aec1a8a30))


- **(es/transforms)** Use recommended ast apis (#3735) ([fd22379](https://github.com/swc-project/swc/commit/fd223793e86f70400a3a69d7f7c8a4775b8abaad))

### Testing



- **(css/parser)** Add malformed hex color tests (#3762) ([9f90882](https://github.com/swc-project/swc/commit/9f90882b27d345fac79f938d42e1b5fd04d4b1b5))

## [1.2.145] - 2022-02-24

### Bug Fixes



- **(es/codegen)** Fix sourcemap of comments (#3723) ([b8b0c92](https://github.com/swc-project/swc/commit/b8b0c920e49c235fb65ca5585d343d2af79f9526))


- **(es/compat)** Throw an error if a private property is initialized multiple times (#3665) ([b6434e5](https://github.com/swc-project/swc/commit/b6434e52e70e79b96a12d48c4cebe2b0f6d8b7f5))


- **(es/parser)** Emit an error for non-last rest element in an object pattern (#3675) ([6a9d778](https://github.com/swc-project/swc/commit/6a9d77808b8513246592129e8c9e154f686fa8a9))


- **(es/parser)** Allow `Expr::TsInstantiation` in extends clause (#3696) ([d499b8c](https://github.com/swc-project/swc/commit/d499b8c14f0f75fd48fd7f5e4b7ad6e790bf4882))


- **(es/parser)** Disallow using reserved words as an expression in typescript (#3697) ([d6522f3](https://github.com/swc-project/swc/commit/d6522f3a37f38aef713c7cbba06349708b56ee27))


- **(es/parser)** Fix a typescript instantiation expression followed by EOF (#3699) ([010fe04](https://github.com/swc-project/swc/commit/010fe048c20bc5a0acfbc65fe43cdd38aeae8fc1))


- **(es/parser)** Fix the span of an export declaration containing a const enum (#3701) ([4318a2e](https://github.com/swc-project/swc/commit/4318a2e73b1ab7df07da809cf3207268942d77b7))


- **(es/parser)** Don't attach comments to `;` (#3720) ([8b87bb4](https://github.com/swc-project/swc/commit/8b87bb48702f22e270574a0a67206b0dcc0b8058))


- **(es/typescript)** Fix `name` of decorated classes (#3689) ([1e49fcd](https://github.com/swc-project/swc/commit/1e49fcd44daa3107a180f7016d72f8138fb56688))


- **(es/typescript)** Support heterogeneous enums (#3721) ([1761cab](https://github.com/swc-project/swc/commit/1761cab6ff1e3989281493adffda07859eb90a0d))

### Features



- **(cli)** Support stdin (#3688) ([3cf3b20](https://github.com/swc-project/swc/commit/3cf3b20f15e8ddbb2c32405c71183cfdbbb87835))


- **(css/minifier)** Compress urange (#3668) ([b1476d2](https://github.com/swc-project/swc/commit/b1476d2ac6b7ff37653192fe7f46de9ae282b8cd))


- **(css/minifier)** Compress lengths (#3698) ([7079e88](https://github.com/swc-project/swc/commit/7079e88744ece43ebf82b05a376c5683c8015084))


- **(css/minifier)** Compress more properties (#3708) ([cd95ac4](https://github.com/swc-project/swc/commit/cd95ac4caf0af06db9195790707a475938a5fcb7))


- **(css/minifier)** Compress alpha of values (#3707) ([bff04b4](https://github.com/swc-project/swc/commit/bff04b4afecb9a57046352aaa92e4cec0e25363b))


- **(es/lints)** Implement `default-param-last` rule (#3681) ([e252265](https://github.com/swc-project/swc/commit/e252265a3f21a4c0dcef2e9c13aa7365f683b235))


- **(es/typescript)** Inline typescript `enum`s (#3647) ([1743302](https://github.com/swc-project/swc/commit/1743302819cd385f57c8d30aa8869a0765e1c5b6))


- **(node-swc)** Expose the new `swc_cli` as a binary named `swcx` (#3684) ([9cc094a](https://github.com/swc-project/swc/commit/9cc094ab574940f87f78328e8e1c1a346e62e5bf))

### Miscellaneous Tasks



- **(ci)** Reduce CI time (#3719) ([76ec275](https://github.com/swc-project/swc/commit/76ec275c3cea182386ad6124c264bc809e1b1633))


- **(clippy)** Improve config (#3691) ([e35d73a](https://github.com/swc-project/swc/commit/e35d73adf4efbd7329cae6c63215e1c0a9193f8d))

### Refactor



- **(css/ast)** Fix the type definitions for an plus b syntax (#3682) ([321ee75](https://github.com/swc-project/swc/commit/321ee756d95f287ed4d81a9568da59c637febf19))


- **(es)** Improve ast apis (#3690) ([135acf3](https://github.com/swc-project/swc/commit/135acf3b42221b8a9e684e39d762ad8481c75f73))

## [1.2.144] - 2022-02-22

### Bug Fixes



- **(es/ast)** Fix definition of `Expr::TsInstantiation` (#3657) ([68a1551](https://github.com/swc-project/swc/commit/68a155165bd04530e97ef62ecede617d954fa98d))


- **(es/parser)** Allow type arguments inside optional chaining (#3653) ([581b63c](https://github.com/swc-project/swc/commit/581b63cf3640f5cfc35a09819dd927c87a7db2b7))

### Features



- **(cli)** Improve the template `package.json` for plugins (#3641) ([f237aee](https://github.com/swc-project/swc/commit/f237aeea79e140e5b6e105304fccfc48960462bf))


- **(css/ast)** Improve parsing of colors (#3680) ([003a7b8](https://github.com/swc-project/swc/commit/003a7b85a4b458f50d057af06c9cc6ec69b592da))


- **(css/minifier)** Compress selectors (#3623) ([9e691fe](https://github.com/swc-project/swc/commit/9e691fe75b60c73ff3ab2a7939c36f6cea167d06))


- **(css/minifier)** Compress declarations (#3649) ([7d15316](https://github.com/swc-project/swc/commit/7d15316ee12506327b25d0ab6aaf972ac687709b))


- **(css/minifier)** Compress degrees to zero (#3664) ([0b5f554](https://github.com/swc-project/swc/commit/0b5f5544c60136bde3bd07c9c75459086cf4b0d5))


- **(css/minifier)** Compress urls (#3666) ([fab6473](https://github.com/swc-project/swc/commit/fab6473183e6c3c4a8541e0146514da1264a2db6))


- **(css/minifier)** Compress transform functions (#3663) ([1afbd1b](https://github.com/swc-project/swc/commit/1afbd1b6e961869b001a03a90a9e24f0fe7304a6))


- **(css/minifier)** Compress frequency (#3669) ([9b28d4d](https://github.com/swc-project/swc/commit/9b28d4da792a67275ed5d1e33acafc929f67d86f))


- **(es/ast)** Support TypeScript Instantiation Expression (#3642) ([61e711c](https://github.com/swc-project/swc/commit/61e711c912bc31453a24dce2d1e1d98044aab3df))


- **(es/lints)** Implement `no-new` rule (#3634) ([7ff4cbc](https://github.com/swc-project/swc/commit/7ff4cbcbe12b26ff54ffa2db9d30592f770132a2))


- **(es/lints)** Implement `no-bitwise` rule (#3635) ([5a9d0cf](https://github.com/swc-project/swc/commit/5a9d0cf8a75275f457ae60157f34a14ada2fe852))


- **(es/lints)** Add `no-loop-func` rule (#3630) ([f4af363](https://github.com/swc-project/swc/commit/f4af3634de94076e571836a65b491210e096b2b8))


- **(es/lints)** Implement `no-empty-function` rule (#3565) ([319d501](https://github.com/swc-project/swc/commit/319d501f1733febb5861b55782dc5fe742015d2f))


- **(es/minifier)** Merge exports (#3643) ([10adf1e](https://github.com/swc-project/swc/commit/10adf1e548c381d3ff6beef7929d409b1ff1fb60))


- **(es/minifier)** Improve name mangler (#3638) ([e9fabd6](https://github.com/swc-project/swc/commit/e9fabd61e883edc9089cd7ddca44fda5e387b3b8))


- **(es/minifier)** Drop more unused vars (#3656) ([de6effc](https://github.com/swc-project/swc/commit/de6effc6e16665a0f18f23014aec15c66603a039))


- **(es/preset-env)** Upgrade `browserslist-rs` (#3670) ([3199966](https://github.com/swc-project/swc/commit/319996698d5531ea04afe8a6b3f3ed657620f8b4))


- **(plugin)** Pass `NODE_ENV` to plugins using the plugin context (#3677) ([ca0a448](https://github.com/swc-project/swc/commit/ca0a448e8ff85a4a0d02e3229ebcb2603a0b5d9a))

### Miscellaneous Tasks



- **(ci)** Kill previous runs (#3678) ([f733c9c](https://github.com/swc-project/swc/commit/f733c9c82f0ab942e4a02e7f97d2fda0ef88bfc1))


- **(cli)** Improve the plugin template (#3632) ([0f1afcb](https://github.com/swc-project/swc/commit/0f1afcb8963b27bc04145bc3e947f7408c8d9a18))- **general**: Typo (#3646) ([c5f0e87](https://github.com/swc-project/swc/commit/c5f0e87ebf20259eae230c478da200530f9430e0))

### Performance



- **(es/minifier)** Parallelize `join_vars` (#3655) ([da2c77d](https://github.com/swc-project/swc/commit/da2c77d9afe179b4f4f0ca1921294ba311f9306e))

### Refactor



- **(es/ast)** Change definition of optional chaining expressions (#3645) ([2cb66ae](https://github.com/swc-project/swc/commit/2cb66ae075ba45968f302d5cd756b0ce0dbcee41))


- **(preset-env)** Extract common logic for `browserslist` support (#3674) ([b1d2470](https://github.com/swc-project/swc/commit/b1d24702e3ca857c60b0c91d7f81652fd178ea31))

### Build



- **(cargo)** Use `lld` for windows-x64 (#3683) ([82914d4](https://github.com/swc-project/swc/commit/82914d4edf709c47e0c3338c961b81b6613b5db7))


- **(swc)** Remove unused dependencies (#3673) ([210f17a](https://github.com/swc-project/swc/commit/210f17af8c028dd9742a2e0ff46ce3b3869c6064))

## [1.2.143] - 2022-02-19

### Features



- **(es/lints)** Implement `no-restricted-syntax` rule (#3607) ([72343ba](https://github.com/swc-project/swc/commit/72343baf5be311809fe786ee8bbea52515197286))


- **(es/minifier)** Treat `!0` as a literal while inlining (#3631) ([d2c9441](https://github.com/swc-project/swc/commit/d2c94416a8735715f37fc680c7b5178bc88239ce))

### Performance



- **(es/minifier)** Fix performance bug of the mangler (#3633) ([fd0e952](https://github.com/swc-project/swc/commit/fd0e952aec427e86d276b51e8f6659de8f9eac94))

## [1.2.142] - 2022-02-18

### Bug Fixes



- **(css)** Fix recovery mode for functions (#3600) ([5420bcc](https://github.com/swc-project/swc/commit/5420bccc595b7088a8092ebebc589e5532cec55a))


- **(css/parser)** Fix parsing of component values (#3611) ([b7dcccc](https://github.com/swc-project/swc/commit/b7dcccc74811c2a56cf6c137176de519c0737a28))


- **(es)** Pass `FileName::Custom` to plugins (#3578) ([df69930](https://github.com/swc-project/swc/commit/df69930c7f27127bc4e8268ee14e6cc28c157748))


- **(es/compat)** Handle `super` and `new.target` in class properties (#3594) ([3191741](https://github.com/swc-project/swc/commit/31917417e929ab2137143b44c15b95d7c642e71e))


- **(es/lints)** Use `kebab-case` for configuration (#3590) ([71a94b1](https://github.com/swc-project/swc/commit/71a94b143ed881eca9097e724f5dd4986241a9b1))


- **(node-swc/types)** Fix experimental config options (#3603) ([2b5eba1](https://github.com/swc-project/swc/commit/2b5eba16c3a5e3621b6e66d92db1e0d6c400c9f2))


- **(plugin)** Fix caching of wasm modulee (#3616) ([05aecf5](https://github.com/swc-project/swc/commit/05aecf507e9bf46002e0629b159245ff9c0f7b2c))


- **(swc_common)** Fix names of proxied functions (#3608) ([e863f9d](https://github.com/swc-project/swc/commit/e863f9dd0486a53c835e9cd08cfa7ab7c31dd087))

### Documentation



- **(api/rust)** Fix rustdoc (#3620) ([4d5ba55](https://github.com/swc-project/swc/commit/4d5ba55e8a220155c2bae82d843309ae5731f8a1))


- **(swc_common)** Document error reporting using `HANDLER` (#3605) ([9df0d7c](https://github.com/swc-project/swc/commit/9df0d7c854b1ebceb955a0cfe3fc7edb5891c0d0))

### Features



- **(api/rust)** Improve error messages for wrong usages of scoped thread-local variables (#3606) ([798ef13](https://github.com/swc-project/swc/commit/798ef137069ebb4a5998938bc99866c5b2050437))


- **(cli)** Initialize compile command (#3602) ([5ed3f3a](https://github.com/swc-project/swc/commit/5ed3f3a503ef01d162b45e0671a85f69b92f360c))


- **(css/ast)** Use `SimpleBlock` for `@keyframe`s (#3577) ([a20ed34](https://github.com/swc-project/swc/commit/a20ed34e6b7ebb9b63d51a3e04d5c6e28b013daa))


- **(css/codegen)** Improve minification of selectors (#3624) ([8271566](https://github.com/swc-project/swc/commit/8271566d21a6e33ccad40f4f30c50454a723e0f5))


- **(css/minifier)** Remove empty qualified rules and at-rules (#3597) ([8c9b154](https://github.com/swc-project/swc/commit/8c9b154e13624110053a14365321c49fc2eec434))


- **(css/minifier)** Implement the rule for easing functions (#3615) ([8e06b2a](https://github.com/swc-project/swc/commit/8e06b2a42c7ba349ddbf957a6e62916c82f94b1a))


- **(es/compat)** Check for duplicate private names and undefined private names (#3613) ([5c03551](https://github.com/swc-project/swc/commit/5c035513410326a0d5d0dfa61f7440e9d0987632))


- **(es/lints)** Implement `no-dupe-args` rule (#3574) ([3e29b73](https://github.com/swc-project/swc/commit/3e29b73a2a46b146c735e3ce1e01c0cadd906323))


- **(es/lints)** Allow using number as an error level (#3593) ([08c343b](https://github.com/swc-project/swc/commit/08c343b18634ce9cc2af9ff1b2ff1921520fb0dd))


- **(swc)** Add `$schema` and utf8-bom support for `.swcrc` (#3622) ([3615f41](https://github.com/swc-project/swc/commit/3615f41c7907e74aa3f0321e4577bc78bbdc8f25))

### Miscellaneous Tasks



- **(ci)** Fix the script for `CHANGELOG.md` ([cbe87db](https://github.com/swc-project/swc/commit/cbe87db4dfd82a5800c880b86702ad8ac15993fe))

### Refactor



- **(node-swc/types)** Provide typed configuration for plugins (#3584) ([07485d3](https://github.com/swc-project/swc/commit/07485d372ec4aaf4d58a58410dbac40311989b61))

### Testing



- **(css/codegen)** Add tests for custom properties in at-rules (#3596) ([b019165](https://github.com/swc-project/swc/commit/b01916531fe889d1559e0bf6a87777454467ab7a))


- **(es/modules)** Add a test for a fixed issue (#3586) ([038e7f8](https://github.com/swc-project/swc/commit/038e7f86698adfbbc2b04d8662e877401d7cf2ea))


- **(es/parser)** Add a test for #2417 (#3588) ([a2f9c88](https://github.com/swc-project/swc/commit/a2f9c88b629b83532c2bd644fbba0e1f50b61b73))


- **(es/typescript)** Add a test for #2670 (#3589) ([f469e65](https://github.com/swc-project/swc/commit/f469e653f861e5ca8789ba1baa4b29f507d0c737))

### Build



- **(swc)** Bump the version of `parking_lot` (#3604) ([5061101](https://github.com/swc-project/swc/commit/50611019992618b0d0a2783ddca4e21bc6e1af69))

## [1.2.141] - 2022-02-16

### Bug Fixes



- **(es/lints)** Fix `duplicate-bindings` for typescript (#3583) ([786d016](https://github.com/swc-project/swc/commit/786d016174bf0aaea0783d4a1644349437d8cd3b))


- **(node-swc/types)** Change `StringLiteral.has_escape` to `StringLiteral.hasEscape` (#3581) ([bf68155](https://github.com/swc-project/swc/commit/bf68155e56dd32884ac880010dba519ea3a35746))

### Features



- **(css/ast)** Use `SimpleBlock` in more places (#3575) ([e97074b](https://github.com/swc-project/swc/commit/e97074b6c37a326095a4aa6cb04be0c26d5bbb42))


- **(css/minifier)** Compress contents of `@keyframes` at-rule (#3579) ([803499c](https://github.com/swc-project/swc/commit/803499c5bee0b7b092c2b872f546f329fda83130))

### Miscellaneous Tasks



- **(ci)** Don't run pr check for pushes ([1bce557](https://github.com/swc-project/swc/commit/1bce5578516a934b920297931ffdd480f0ade624))


- **(ci)** Make CI faster ([55250e4](https://github.com/swc-project/swc/commit/55250e442872ec0bcc20f9b82008fe9d6d14d34e))


- **(ci)** Fix the auto-bump scripts ([2d9735b](https://github.com/swc-project/swc/commit/2d9735b9a9c2e74412c307645f59b3b0ac0d9696))


- **(ci)** Fix the auto-bump scripts ([7ddd588](https://github.com/swc-project/swc/commit/7ddd5886f3be72d34828678c2ceeb6335f2032ae))


- **(ci)** Fix the auto-bump scripts ([c775674](https://github.com/swc-project/swc/commit/c775674ec035618cc8cc569e9122e9064e2335ce))


- **(ci)** Fix version of git-cliff ([32bc17f](https://github.com/swc-project/swc/commit/32bc17ff1a75cdc78544dd4242173244d5691bc4))


- **(ci)** Don't mark as a failure ([6173bb8](https://github.com/swc-project/swc/commit/6173bb88fd6bff9f191b99d841266a70fd211a0e))


- **(ci)** Fix the condition for cancel action ([d66f701](https://github.com/swc-project/swc/commit/d66f701a4a106f431b4199cb611f6fd5bf657c41))


- **(ci)** Skip instead of cancel ([85caf29](https://github.com/swc-project/swc/commit/85caf291e2314bf25997148b09c6babbe80c88e1))

### Refactor



- **(plugin)** Remove direct dependency to `once_cell` (#3582) ([88e07b2](https://github.com/swc-project/swc/commit/88e07b21d1f8a6439335134747e3da3bc1da646d))

## [1.2.140] - 2022-02-15

### Bug Fixes



- **(es/compat)** Allow destructuring assignment to an object property (#3544) ([5802b62](https://github.com/swc-project/swc/commit/5802b62e3486b0fba176533fcd2998f47c60910d))


- **(es/compat)** Fix destructing of `const` (#3545) ([342c320](https://github.com/swc-project/swc/commit/342c320bfa1f43f25262c0ba403a51df8228c655))


- **(es/compat)** Apply `new.target` before `classes` (#3555) ([f1c7394](https://github.com/swc-project/swc/commit/f1c7394d10d624009549ec24de8c79b08594cfd4))


- **(es/compat)** Handle arrow parameters in class fields (#3556) ([45b44b0](https://github.com/swc-project/swc/commit/45b44b088cf0c0964232b66bb4b7b5f9e539623d))


- **(es/compat)** Fix handling of constructor in `classes` (#3505) ([0b16210](https://github.com/swc-project/swc/commit/0b162102fad75a364121b51a94fc36a7f8872259))


- **(es/minifier)** Fix analyzer (#3557) ([ac1d405](https://github.com/swc-project/swc/commit/ac1d4058f276693f52d5ccec5ccbb4c04f62bc9f))


- **(es/minifier)** Disable name mangler if `eval` is used (#3526) ([bfc9897](https://github.com/swc-project/swc/commit/bfc9897e347e2adc6efb5bd66151abdb9cbaa4fa))


- **(es/utils)** Keep arguments to `super` call (#3570) ([f67796a](https://github.com/swc-project/swc/commit/f67796a962cfd1e5c33206622c325dfbdd3b4ee2))

### Documentation



- **(plugin)** Fix typo (#3547) ([3fc16cd](https://github.com/swc-project/swc/commit/3fc16cdc1c69a5ee0ecb506e3a3c496c51e52756))

### Features



- **(bot)** Add auto-bump script (#3573) ([a1e45c4](https://github.com/swc-project/swc/commit/a1e45c4b863cd9119fd8ca8cd24439ec1bff1bfc))


- **(css/ast)** Add `;` to delimiters (#3551) ([da36e90](https://github.com/swc-project/swc/commit/da36e90d1ee6ca479826ef379fbf0562cdc02ee5))


- **(css/ast)** Use correct type for `calc` (#3549) ([b311ace](https://github.com/swc-project/swc/commit/b311aced89dbbcb1605312e3ad5b0715e437bcd8))


- **(css/ast)** Use `SimpleBlock` for `@document` at-rule (#3564) ([3399702](https://github.com/swc-project/swc/commit/3399702b735cebcf19855b01c5b884cb44e06653))


- **(es/compat)** Add loose mode for `classes` (#3474) ([0f7a997](https://github.com/swc-project/swc/commit/0f7a99787f78a1b010a20fc042c4c565959557ad))


- **(es/lints)** Add this handling support to `no-alert` rule (#3515) ([af82006](https://github.com/swc-project/swc/commit/af8200647bb5f96525bcf3333c7c6889fe69dd5d))


- **(es/lints)** Add `allow` config for `no-console` rule (#3517) ([286b6c8](https://github.com/swc-project/swc/commit/286b6c804fc9f4b12065eb848be56d0a58230cf2))


- **(es/lints)** Implement `eqeqeq` rule (#3513) ([8d92050](https://github.com/swc-project/swc/commit/8d92050f557690bca6f695bbae173876fd9e53a2))


- **(es/lints)** Implement `no-empty-pattern` rule (#3550) ([f9fda27](https://github.com/swc-project/swc/commit/f9fda2743cb549d1af6b9bbb92155da3f60536c2))


- **(plugin)** Add `PluginContext` (#3568) ([a96217f](https://github.com/swc-project/swc/commit/a96217feaa9fea72cf828f2ec02f0639b5dd1561))


- **(plugin/runner)** Improve resolver support for npm (#3566) ([d6477a7](https://github.com/swc-project/swc/commit/d6477a76cf088072f5355335f48413fbbc9310c7))

### Miscellaneous Tasks



- **(bot)** Fix permission issue ([bfb51f3](https://github.com/swc-project/swc/commit/bfb51f382eb1dbd1086eddbab8cfbd285d3b7edf))


- **(ci)** Add a bot for auto-rebasing (#3560) ([b1fc7a9](https://github.com/swc-project/swc/commit/b1fc7a9e3446240e4615a50517e4a13c50c05f4e))


- **(ci)** Remove useless tests from the matrix (#3561) ([47a81bd](https://github.com/swc-project/swc/commit/47a81bdb95e11e577afd35c854939151bb8bd668))- **general**: Fix auto-rebase script ([d055711](https://github.com/swc-project/swc/commit/d0557117ce62ea6a9294720689769c4b156c62eb))- **general**: Fix auto-rebase script again ([d3f1c4e](https://github.com/swc-project/swc/commit/d3f1c4e6025722dbf5dcb493e5a60067b4227341))- **general**: Use `GITHUB_TOKEN` for auto-rebasing ([1c6e9ef](https://github.com/swc-project/swc/commit/1c6e9efeb46251d99831aab56d8b3332af6167bd))- **general**: Fix CLA issue of auto-rebase script ([59233d5](https://github.com/swc-project/swc/commit/59233d5082af625816450691103f95ffd121bd16))

### Performance



- **(es/optimization)** Replace `map_with_mut` with proper implementation (#3539) ([6d132ca](https://github.com/swc-project/swc/commit/6d132ca0765a46b39a6844b7de2e7f2655f7dd1b))

### Refactor



- **(css/ast)** Rename tokens to match spec (#3553) ([aed622b](https://github.com/swc-project/swc/commit/aed622be2f8f73581ce72f5263ad2b61a7b04ea7))


- **(css/parser)** Remove `parse_values`, which is not used (#3552) ([d5aee47](https://github.com/swc-project/swc/commit/d5aee470cb6ea1e25057a5a36f0a19274c1f42b3))

### Testing



- **(css/codegen)** Add tests (#3563) ([08dd695](https://github.com/swc-project/swc/commit/08dd695c67012fe8d58828ab047cb902b0a7d53c))


- **(css/parser)** Add a test for a custom function name (#3554) ([f252dfb](https://github.com/swc-project/swc/commit/f252dfb885b904ef8386f2004c359a1a2f43b63e))

### Build



- **(*)** Dedupe `once_cell` (#3567) ([ad6f24a](https://github.com/swc-project/swc/commit/ad6f24ad83ed0086ab7f4e260800df598212be25))

## [1.2.139] - 2022-02-12

### Bug Fixes



- **(cli)** Update the plugin template for pinned dependencies (#3538) ([05cf2e9](https://github.com/swc-project/swc/commit/05cf2e92e690c72ca6d49fee1dd33c9e776ba304))


- **(css/ast)** Use `SimpleBlock` in more types (#3535) ([cfb2248](https://github.com/swc-project/swc/commit/cfb2248a2e7bf19d3bafb345c5c227d4615ee197))


- **(es/modules)** Use correct `StrKind` after rewriting import path (#3489) ([ff6eb27](https://github.com/swc-project/swc/commit/ff6eb272a00f0c11c9e916eb898e1b309bcb686c))


- **(es/modules)** Hoist named exports (#3479) ([fa0216d](https://github.com/swc-project/swc/commit/fa0216d908118ba008f4be2505590bbb09b7be46))


- **(node/helpers)** Fix `isNativeReflectConstruct` (#3530) ([d14d3eb](https://github.com/swc-project/swc/commit/d14d3ebbc8f24a6bed61ce9e534ab06b32c08e34))


- **(plugin)** Allow testing (#3542) ([fbe9196](https://github.com/swc-project/swc/commit/fbe91963bfb80976eebadc9f0e94e080ed81d624))

### Documentation



- **(plugin)** Fix install command (#3541) ([72b3197](https://github.com/swc-project/swc/commit/72b31977e49417cf9e4c95ad1365e2e212cac4d4))

### Features



- **(cli)** Add a command for scaffolding a new plugin (#3536) ([6ed089e](https://github.com/swc-project/swc/commit/6ed089e1cff8d1e3edbe67cfe5945e3ff121f5d2))


- **(css)** Support urange syntax (#3491) ([cbe302b](https://github.com/swc-project/swc/commit/cbe302b99d762a72d8522196cc05159791515e49))


- **(css/minifier)** Implement more rules (#3522) ([69cfe39](https://github.com/swc-project/swc/commit/69cfe395c7cc0de8ea5eb4bdf605f5c56b7cf69b))


- **(css/parser)** Improve error recovery (#3486) ([48e5b90](https://github.com/swc-project/swc/commit/48e5b903e2b82e8fc741d125662bbac825d5b0d0))


- **(css/parser)** Implement more parser logic for nth selectors (#3532) ([fcbc2ff](https://github.com/swc-project/swc/commit/fcbc2ff03f9eebbb5fed95dd082504a6b1a49af9))


- **(css/parser)** Implement more error recovery (#3534) ([547eba5](https://github.com/swc-project/swc/commit/547eba5e31745877be425ad14722adf6134caca7))


- **(es/lints)** Implement `dot-notation` rule (#3481) ([5bb6bd7](https://github.com/swc-project/swc/commit/5bb6bd71b6aa5dbdde62842c34e9ef6742968650))


- **(es/lints)** Implement `no-use-before-define` rule (#3456) ([205b76e](https://github.com/swc-project/swc/commit/205b76e78d238de3a5cb8ab64aa5c61799b77bd2))


- **(es/minifier)** Implement `reserved` mangle option (#3476) ([5488159](https://github.com/swc-project/swc/commit/5488159ba5dd124878ebdc50c390a51ab3b07f16))


- **(es/minifier)** Drop useless assignments (#3528) ([a7f0e84](https://github.com/swc-project/swc/commit/a7f0e84bbf986df0afc39f18ea7553f4a8c445f1))


- **(plugin)** Implement proxy for `Mark` and `SyntaxContext` (#3511) ([bc25026](https://github.com/swc-project/swc/commit/bc250262f2af38086eeed59e4d42d14ff44d5b83))


- **(swc/plugin)** Implement proxy for `Mark::fresh` (#3492) ([494b4c8](https://github.com/swc-project/swc/commit/494b4c8203514dd9f21b2bc3804ba8c44d46a4a1))

### Miscellaneous Tasks



- **(build)** Disable LTO for local builds (#3514) ([80ed69d](https://github.com/swc-project/swc/commit/80ed69d67dfae44986c19c04ddff758fee98f8ff))


- **(build)** Remove version pinning of `parking_lot_core` (#3537) ([a4d914d](https://github.com/swc-project/swc/commit/a4d914dab5a4263a9f2ac396decd11b64dfc0714))


- **(ci)** Remove `cargo-uttil` from dependency (#3543) ([068a408](https://github.com/swc-project/swc/commit/068a4087caa12f2c28ec62b5e194a85efcc907a1))


- **(crates)** Use bot account for publishing commits ([c10cbc4](https://github.com/swc-project/swc/commit/c10cbc4ecaaca8f5795de70c8bcf7feee455aaa4))


- **(crates)** Use bot account for commiitter ([edc46cc](https://github.com/swc-project/swc/commit/edc46ccf939f8fd3ac49300085daf3b42d4ce841))

### Performance



- **(es/minifier)** Remove useless operations like eager call to `.span()` (#3512) ([8dab3d9](https://github.com/swc-project/swc/commit/8dab3d92b178b3ee1e1cb6a7288ce33b91793145))

### Refactor



- **(common)** Cleanup & rustfmt (#3495) ([9b76783](https://github.com/swc-project/swc/commit/9b76783281af7c6b92e8185b44ebefae41648d3f))


- **(css/ast)** Rename types to match specification (#3484) ([460f846](https://github.com/swc-project/swc/commit/460f84693414c58d4aa116f9d4e630b1e32bffa4))


- **(css/ast)** Remove `Tokens` in favor of `Vec<TokenAndSpan>` (#3507) ([92a3cb9](https://github.com/swc-project/swc/commit/92a3cb9609b68e73a6a1f439186f09c15da8d570))


- **(css/ast)** Unify `SimpleBlock` and `Block` (#3519) ([57f6a58](https://github.com/swc-project/swc/commit/57f6a581fa730ae6763dc9db712514d1a72c764e))


- **(css/ast)** Unify `SimpleBlock` and `Block` completely (#3531) ([37c49e8](https://github.com/swc-project/swc/commit/37c49e876c123f4ee98a0499729998b3793037b2))


- **(css/parser)** Refactor codes related to simple blocks (#3506) ([4e124c7](https://github.com/swc-project/swc/commit/4e124c7bca85d70b6e4836038ea1aaa25b9ea663))


- **(css/parser)** Refactor code for error recovery (#3508) ([2d997b3](https://github.com/swc-project/swc/commit/2d997b38066ff01e2e84284ae3a1f79f8df8bb6b))

### Testing



- **(css/codegen)** Add tests for multiple keyframe selectors (#3509) ([ebd71d5](https://github.com/swc-project/swc/commit/ebd71d565d0ac29d38cda195085be78dfdf3eaf0))


- **(css/parser)** Add tests from `postcss` (#3488) ([04782ae](https://github.com/swc-project/swc/commit/04782ae9f73193ec6cd15f7e7059c97143289169))


- **(css/parser)** Add some tests from `postcss` (#3501) ([8b438ea](https://github.com/swc-project/swc/commit/8b438ea024661f344cb4af1160c3102a5d880ae6))


- **(es/minifier)** Add snapshot testing for the analyzer (#3529) ([73e9185](https://github.com/swc-project/swc/commit/73e9185bbafa45f00d9222a9ad8a34229e079130))

## [1.2.138] - 2022-02-08

### Bug Fixes



- **(es/minifier)** Make `sequences` less aggressive (#3480) ([292add7](https://github.com/swc-project/swc/commit/292add7d26a079a1da09ff94444124faea8e39fc))

### Features



- **(css)** Add support for `@property` at-rule (#3470) ([fd5668c](https://github.com/swc-project/swc/commit/fd5668c32fa002698e387df6bc6a927c0d562e06))


- **(css/ast)** Add types for `@counter-style` at-rule (#3469) ([e6f4fbf](https://github.com/swc-project/swc/commit/e6f4fbf056767344776afbb6bd3b2f5dfe83dcf3))


- **(css/ast)** Add types for all dimensions (#3477) ([dc939c6](https://github.com/swc-project/swc/commit/dc939c65afa3b3b09101128f5801f532170bdea2))


- **(es/parser)** Disallow assignment to optional chaining expressions (#3483) ([26565b1](https://github.com/swc-project/swc/commit/26565b1ae9c0ab93b425c97fc40aaf49576e4b90))


- **(plugin)** Support global `HANDLER` in the plugin context (#3478) ([d473a65](https://github.com/swc-project/swc/commit/d473a6597653e59fc485ffb9cb116d23b4b55e70))

### Miscellaneous Tasks



- **(es)** Fix clippy warnings (#3482) ([8bf5cf4](https://github.com/swc-project/swc/commit/8bf5cf4d030ec5ab615924b938c8c027c600e3e1))


- **(repo)** Configure kodiak (#3485) ([cf8aa05](https://github.com/swc-project/swc/commit/cf8aa05d9ce5b60936c53c42d70ca934a09c373e))

## [1.2.137] - 2022-02-07

### Bug Fixes



- **(css)** Fix parsing of `@page` at-rule (#3356) ([4853821](https://github.com/swc-project/swc/commit/4853821d004f366c89c1b9122786e26ff923df05))


- **(css/ast)** Fix type definitions for `@document` at-rule (#3468) ([df08e4c](https://github.com/swc-project/swc/commit/df08e4cfd7ed76fcfd00cc8245b13cc328513938))


- **(css/parser)** Report errors of at-rules (#3461) ([e732250](https://github.com/swc-project/swc/commit/e732250cdf74c47faf5321b650a9cea6bd1ab4d4))


- **(es/compat)** Handle private fields in nested classes (#3431) ([01500a5](https://github.com/swc-project/swc/commit/01500a54e04b88d08edff09f218166c862763657))


- **(es/compat)** Handle initializer hole in array patterns (#3442) ([3bb2a6c](https://github.com/swc-project/swc/commit/3bb2a6ccca4e78412f80aea4fe6c22d04d345a00))


- **(es/compat)** Fix legacy decorator pass (#3459) ([4f5e87b](https://github.com/swc-project/swc/commit/4f5e87b66b42a5672e00edcfa22234f1cde79580))


- **(es/fixer)** Handle more expressions in the super class position (#3452) ([032f397](https://github.com/swc-project/swc/commit/032f397b52415378ede985be35713a3482093958))


- **(es/minifier)** Fix `codemirror` (#3462) ([5812c3c](https://github.com/swc-project/swc/commit/5812c3c10fc224fbb33a17302491c5f7c2bd0a0b))


- **(es/minifier)** Fix `mapbox` (#3463) ([0371c41](https://github.com/swc-project/swc/commit/0371c41b7cb9d505705a956b84b8e4dbe626a17c))


- **(es/modules)** Allow using a dynamic import with an expression from another import (#3450) ([745604b](https://github.com/swc-project/swc/commit/745604b26d9151732d2572307dbeb22b2d10ca66))


- **(es/parser)** Fix parsing of decorators (#3449) ([5a806c5](https://github.com/swc-project/swc/commit/5a806c5b817c63b7c4f7730b538831b1cea62711))


- **(es/resolver)** Fix handling of for statements (#3446) ([2af5096](https://github.com/swc-project/swc/commit/2af5096e83229df1e5ccfe62659360c0392ef0ba))

### Features



- **(css/ast)** Improve types related to `url` tokens (#3444) ([49564d9](https://github.com/swc-project/swc/commit/49564d9b5d627b38b2faa63b55076cb55ba8d1a7))


- **(css/codegen)** Implement minification of hex colors (#3453) ([eeedd71](https://github.com/swc-project/swc/commit/eeedd71705dc9b94363ec4e002ec647a3addba2d))


- **(css/codegen)** Implement minification of identifiers (#3466) ([81850c2](https://github.com/swc-project/swc/commit/81850c2b30693061428569c9a6ebd4a3f07d7683))


- **(css/codegen)** Improve minification for page rules (#3467) ([0ca036a](https://github.com/swc-project/swc/commit/0ca036a962042727e362b91748aa10547c87fc63))


- **(css/lexer)** Implement error recovery for functions (#3445) ([f1410fc](https://github.com/swc-project/swc/commit/f1410fc09b4838fa8113c9b2041f58d7d752c519))


- **(es/lints)** Implement `prefer-regex-literals` (#3399) ([8166275](https://github.com/swc-project/swc/commit/81662751666b5d49458ab8dad15f3c73e89ef2f6))


- **(es/lints)** Implement linter for quotes of string literals (#3443) ([5d6143a](https://github.com/swc-project/swc/commit/5d6143a53c03d0caefc76ea54d6975126984d84d))


- **(es/parser)** Add an option to allow `super` outside of class methods (#3427) ([cc185f0](https://github.com/swc-project/swc/commit/cc185f01cb249634d144830db702a281674f48da))

### Miscellaneous Tasks



- **(es/lints)** Fix CI ([b06a5ab](https://github.com/swc-project/swc/commit/b06a5abe5868c3652fe89927acd3a56ea437b113))

### Refactor



- **(css/ast)** Refactor types related to `@keyframes` at-rule (#3441) ([5c1b021](https://github.com/swc-project/swc/commit/5c1b02182df9ee2f59b8b83f58b5d0b1ae04af35))


- **(css/ast)** Change AST for `!important` (#3440) ([38879de](https://github.com/swc-project/swc/commit/38879de8deec6a45882252104fdcbb33cc3116a9))


- **(css/ast)** Refactor types related to selectors (#3460) ([cd87d96](https://github.com/swc-project/swc/commit/cd87d965f35155748ec0e3b22deae3d8a5ebdb5b))


- **(css/ast)** Remove unused types (#3465) ([69660fd](https://github.com/swc-project/swc/commit/69660fd161e0cce5eca7b7f5d436d4bb67dea64f))

### Testing



- **(css/parser)** Add more tests for the selector parser (#3455) ([479b509](https://github.com/swc-project/swc/commit/479b50984513296439af2814f990eb88486b82d5))


- **(es)** Update tsc test suite (#3448) ([8b7c38c](https://github.com/swc-project/swc/commit/8b7c38c80ceeb8fc41ad4c60eb427dab9c06ba6e))


- **(es/parser)** Fix crlf (#3451) ([397a96a](https://github.com/swc-project/swc/commit/397a96a1cf4a0d540db6e766890ed874f7818a65))

## [1.2.136] - 2022-02-03

### Bug Fixes



- **(css)** Allow empty `@media` at-rule (#3404) ([75a14f9](https://github.com/swc-project/swc/commit/75a14f98b7370226115ee24eec6eb8c802bd4837))


- **(css/parser)** Fix parser logic related to case insensivity (#3382) ([3ded88b](https://github.com/swc-project/swc/commit/3ded88bffca4abd0bb77a52b0dfb32d8c8520581))


- **(css/parser)** Fix bugs related to `url` (#3403) ([3c8d985](https://github.com/swc-project/swc/commit/3c8d985a07baf5a52f40221fcc73344b3ca48d15))


- **(es/codegen)** Fix bugs (#3436) ([ea8dfd8](https://github.com/swc-project/swc/commit/ea8dfd872ced8e264ad3d6da7f07c0043dacfb27))


- **(es/compat)** Add the missing span in `optional_chaining` (#3384) ([9eb7773](https://github.com/swc-project/swc/commit/9eb77738fd1049022693f52843483623553856dd))


- **(es/minifier)** Fix evaluator (#3391) ([38c2499](https://github.com/swc-project/swc/commit/38c2499358e2dc4df5b6acee25da54fe411f6e8a))


- **(es/modules)** Allow using dynamic import with a name from another import (#3390) ([1dcc188](https://github.com/swc-project/swc/commit/1dcc188dd8230954e2801f7c6e3034b0c0215bc4))


- **(es/modules)** Fix span of imports (#3418) ([2c99ca1](https://github.com/swc-project/swc/commit/2c99ca1bab353668f5c475ab6cb223186701927a))


- **(swc)** Run `resolver` before everything (#3400) ([cebc5dc](https://github.com/swc-project/swc/commit/cebc5dc148fa4c03a536a841a106955de18b010b))

### Features



- **(css)** Improve codegen where `minify: true` (#3414) ([30c29a3](https://github.com/swc-project/swc/commit/30c29a30cfbcc9f41adb83a8fe7d277084dd8053))


- **(css/ast)** Add `/` to the delimiters (#3402) ([2dc31d9](https://github.com/swc-project/swc/commit/2dc31d9d142a4e76529507596bc476590b4a26e9))


- **(css/codegen)** Implement `minify: true` (#3369) ([0537ef1](https://github.com/swc-project/swc/commit/0537ef1a1170da5c693a36cd20fd2b089a8a3618))


- **(css/codegen)** Improve minification of numbers (#3423) ([340844a](https://github.com/swc-project/swc/commit/340844ae6eb2617d8bec07e7c27ade9f320184b8))


- **(css/parser)** Improve selector parser (#3386) ([c73835b](https://github.com/swc-project/swc/commit/c73835bfebe56518e107a3666fe95ca649d33a24))


- **(css/parser)** Improve parsing of math functions (#3415) ([1b1cae0](https://github.com/swc-project/swc/commit/1b1cae037279be2e1f66788f0cb1539b7b8d6721))


- **(es/codegen)** Improve compression of numbers (#3425) ([e8b64a9](https://github.com/swc-project/swc/commit/e8b64a9871ccfda5f5fb1f03662650f3500e6634))


- **(es/lints)** Implement `no-debugger` rule (#3398) ([9dec923](https://github.com/swc-project/swc/commit/9dec9236f7b3c95c803571404d7abae71e173936))


- **(es/lints)** Add `no-alert` and a feature gate (#3394) ([5cbe4fe](https://github.com/swc-project/swc/commit/5cbe4fe512c67dd6017e0142b12465e20a2153a5))


- **(es/minifier)** Implement `drop_console` (#3392) ([91d7800](https://github.com/swc-project/swc/commit/91d78000ea445575f9ac30d0f36299ab4f0cbf5c))

### Miscellaneous Tasks



- **(repo)** Add `clippy` to git push hook (#3383) ([78e83a3](https://github.com/swc-project/swc/commit/78e83a386b62abaf9b38b58b5dd942de2333e3a6))

### Performance



- **(node-swc)** Speed up `parse` and `parseFile` (#3380) ([0359deb](https://github.com/swc-project/swc/commit/0359deb4841be743d73db4536d4a22ac797d7f65))

### Refactor



- **(css/ast)** Refactor delimited values (#3397) ([b31619d](https://github.com/swc-project/swc/commit/b31619d48e2caa29ae581331eaf2ed4c4bb93683))


- **(css/ast)** Use `Dimension` instead of `UnitValue` (#3401) ([1904944](https://github.com/swc-project/swc/commit/1904944bf7767183a667a533a9f2089447f06c48))


- **(css/ast)** Use `Color` instead of `HashValue` (#3411) ([6b921ca](https://github.com/swc-project/swc/commit/6b921cac02e801318529ad5511104ddb4ac6a6c6))


- **(css/ast)** Rename `property` to `name` (#3410) ([eeedd9a](https://github.com/swc-project/swc/commit/eeedd9adf573b75435ecf7c87a71f9d8c5b64b20))


- **(es/minifier)** Remove unused crates (#3395) ([74b4330](https://github.com/swc-project/swc/commit/74b433080bf79026fbcb905d7f0fba435822df68))


- **(es/parser)** Flatten tests to make `git` faster (#3393) ([839d0ac](https://github.com/swc-project/swc/commit/839d0ac480f0a702ac40bf14ba84d192cde47ec6))

### Testing



- **(css/codegen)** Add more tests (#3405) ([64383e3](https://github.com/swc-project/swc/commit/64383e385cc6a5b735273218f31a4430a772c941))


- **(css/codegen)** Verify AST is not broken after minification (#3430) ([73efd72](https://github.com/swc-project/swc/commit/73efd72cbe03f3f386dadf3c969763f15bb9b41d))


- **(swc)** Add tests (#3435) ([9e4cea0](https://github.com/swc-project/swc/commit/9e4cea017c2230e3d8db8dc48c3196116e90198a))

## [1.2.135] - 2022-01-27

### Bug Fixes



- **(css)** Fix the type definition of `@support` at-rules (#3330) ([34943ff](https://github.com/swc-project/swc/commit/34943ffa15ddecb56ee0889a598dfd3d0aa4025c))


- **(css)** Fix `@keyframes` at-rule (#3331) ([f89ffa6](https://github.com/swc-project/swc/commit/f89ffa67aea6c99ec61a961754001e7fa85b86b5))


- **(css)** Fix `@supports` at-rule (#3329) ([9f38060](https://github.com/swc-project/swc/commit/9f3806029c4aa47944f38e1b1c4c8feac4ace4c1))


- **(css/parser)** Fix parsing of at rules (#3328) ([506a310](https://github.com/swc-project/swc/commit/506a31078aaebf50129658f096bbd5929995205f))


- **(es/block-scoping)** Pop scope correctly on early returns (#3360) ([b1a8db6](https://github.com/swc-project/swc/commit/b1a8db61943d022bcbed583eb3562510d1ed727c))


- **(es/compat)** Fix regression of `destructuring` (#3326) ([6d1ad36](https://github.com/swc-project/swc/commit/6d1ad368aca53ee64a63ae565cd015909f2f4458))


- **(es/compat)** Handle nested functions in `private_field` (#3355) ([29aaac1](https://github.com/swc-project/swc/commit/29aaac1f15f747ea3f938bcab1d536168e9d36a6))


- **(es/loader)** Add an option to resolve symlinks with `true` as a default (#3340) ([afdb168](https://github.com/swc-project/swc/commit/afdb168aad9096e4653580a52cc7736915cd2b69))


- **(es/minifier)** Consider capturing while inlining (#3322) ([4f23d65](https://github.com/swc-project/swc/commit/4f23d651d1a8855f9383c5306d5e417c273c5c22))


- **(es/minifier)** Don't inline a var if the initializer is reassigned (#3333) ([d52a1f3](https://github.com/swc-project/swc/commit/d52a1f3899d7d782917ea1c8701e951fcd6c214f))


- **(es/minifier)** Respect block scoping while negating if statements (#3344) ([6921ffb](https://github.com/swc-project/swc/commit/6921ffbbda110384524114dc2d3230b8432e34cc))


- **(es/minifier)** Prepend/append correctly (#3367) ([703972d](https://github.com/swc-project/swc/commit/703972dc296fbdfc319d48d43ef3841ebfa56eb3))


- **(es/minifier)** Improve minifier (#3350) ([68e9017](https://github.com/swc-project/swc/commit/68e90173762feb2aa6744ca46f5d1185a89da271))


- **(es/module)** Remove `.jsx` file extension (#3334) ([b2bf38d](https://github.com/swc-project/swc/commit/b2bf38d025064a42c398ab321fc2e69401a3f74b))


- **(es/typescript)** Handle typescript enums with string values (#3339) ([da709fe](https://github.com/swc-project/swc/commit/da709fe3d351f76b51b526cfd0718d8e6cb8f2a0))


- **(swc)** Respect `jsc.experimental.keepImportAssertions` (#3352) ([d9dc2b9](https://github.com/swc-project/swc/commit/d9dc2b99dde69792db4f5a31ffc983f8b04c0bef))

### Documentation



- **(contributing)** Fix formatting (#3376) ([90cf073](https://github.com/swc-project/swc/commit/90cf073ab91d44718235d8e0bc38953f7a4c1970))

### Features



- **(css/ast)** Add `Ratio`, which is defined by spec (#3335) ([c7e5fae](https://github.com/swc-project/swc/commit/c7e5faea5c49333a3141111f92e3b36e29f6202c))


- **(css/ast)** Add types for dashed identifiers and `@color-profile` at-rules (#3364) ([dfa0286](https://github.com/swc-project/swc/commit/dfa0286aca8aeca49820ebb6a3b0e4461d30fe29))


- **(css/parser)** Improve parsing of urls (#3362) ([50521d8](https://github.com/swc-project/swc/commit/50521d8ffa3425ad26eb4630698f06b69c41ef2b))


- **(es/bugfix)** Add `bugfix-safari-id-destructuring-collision-in-function-expression` (#3109) ([d1c90a4](https://github.com/swc-project/swc/commit/d1c90a4e5f2ddfc71c6143ef07e16af352da25fa))


- **(es/codegen)** Emit comments of `Module` and `Script` (#3358) ([fcb7288](https://github.com/swc-project/swc/commit/fcb7288eb66e027fa7278b8f028e4486059241cd))


- **(es/lints)** Implement "no-console" rule (#3269) ([9872137](https://github.com/swc-project/swc/commit/987213797f71f9b5e0a0ac19edfbd18fe96a7ce5))


- **(es/minifier)** Handle array literals in `sequences` (#3348) ([8007b2d](https://github.com/swc-project/swc/commit/8007b2dc9338e34a1e9780606fd35181890af990))


- **(es/preset-env)** Upgrade `browserslist-rs` (#3375) ([d3d754b](https://github.com/swc-project/swc/commit/d3d754bd174bfbd0f6fc25276c40e46e3a3da01f))


- **(plugin)** Pass host context to plugins for diagnostics emission (#3359) ([a8debc1](https://github.com/swc-project/swc/commit/a8debc17f6082c033d3734a8e2c0cccc598c1d08))

### Miscellaneous Tasks



- **(ci)** Update `thread_local` (#3357) ([a635e9f](https://github.com/swc-project/swc/commit/a635e9f35bb2a718abad56286d7b6fcecdfe4e58))


- **(ci)** Fix FreeBSD build (#3379) ([464c15b](https://github.com/swc-project/swc/commit/464c15b7757aedd50c80d955d7f2c78133a7f994))

### Performance



- **(node)** Avoid cloning options (#3325) ([8a76935](https://github.com/swc-project/swc/commit/8a76935ca261579f23519d1e2c3b7849ba75a6e0))

### Refactor



- **(css/ast)** Merge several kinds of blocks into a single type (#3336) ([c664eaf](https://github.com/swc-project/swc/commit/c664eafdefe2b8a65d3d745e4538063a33f93346))


- **(css/ast)** Fix type definitions related to `@import` at-rule (#3351) ([7787f90](https://github.com/swc-project/swc/commit/7787f90da02d198b26bc2236229446a19628c794))


- **(css/ast)** Rename `PercentValue` to `Percent` (#3363) ([6fc7562](https://github.com/swc-project/swc/commit/6fc7562686b0915c7a1280620ffe183de66e113f))


- **(es/minifier)** Merge execution tests into a file to make `git` faster (#3377) ([7ef3bfa](https://github.com/swc-project/swc/commit/7ef3bfa5b617bffeeb91240dbc2d842dcd48826c))


- **(plugin)** Remove multivalue polyfill (#3346) ([4386498](https://github.com/swc-project/swc/commit/438649818fb7e7b1ef6cddf5ba244f80cf7e69a9))

## [1.2.133] - 2022-01-20

### Bug Fixes



- **(css)** Fix parsing of media queries (#3318) ([0723ee2](https://github.com/swc-project/swc/commit/0723ee282861a1e648490989c122d5f4e683dc35))


- **(es/minifier)** Don't inline functions used as arguments (#3320) ([57204e3](https://github.com/swc-project/swc/commit/57204e39cd24ecdb190a671bd3e163ff0c2ab983))

### Documentation



- **(repo)** Update contributing docs (#3298) ([5af79f6](https://github.com/swc-project/swc/commit/5af79f634b7431e886b254992e7fbdbe044d1e9d))

### Miscellaneous Tasks



- **(rustc)** Downgrade rustc ([041bf00](https://github.com/swc-project/swc/commit/041bf003627e55cdef2839a31cbb3149e161eb6e))

### Build



- **(node-swc)** Fix GLIBC < 2.18 compatible issues and android arm binary loading issue (#3314) ([9608605](https://github.com/swc-project/swc/commit/9608605772351a2406870e19ed8738adf2147374))


- **(node-swc)** Fix Windows arm64 build OOM (#3324) ([c069c78](https://github.com/swc-project/swc/commit/c069c78b21b9b4bf150d22e8ff333053f2039e3b))

## [1.2.131] - 2022-01-19

### Bug Fixes



- **(common)** Use `siphasher` directly and upgrade transitive dependencies to avoid UB (#3299) ([641265b](https://github.com/swc-project/swc/commit/641265b147da9478f5d205ddc0c7c16ed94b8676))


- **(es/compat)** Apply `static_blocks` before `class_properties`  (#3292) ([89235b8](https://github.com/swc-project/swc/commit/89235b8294dedb4dd50c85e2a3b3ce41bddac85e))


- **(es/minifier)** Fix analysis of unary expressions (#3286) ([b55ae4b](https://github.com/swc-project/swc/commit/b55ae4b312b5677efeb9f3e9697dc2bcff81e322))


- **(es/minifier)** Inline into interpolations in tagged template literals (#3287) ([fa5c063](https://github.com/swc-project/swc/commit/fa5c063144246ce634305399787e08498765eb8f))


- **(es/minifier)** Remove more side-effect-free expressions. (#3301) ([18a11d7](https://github.com/swc-project/swc/commit/18a11d7c8f6582df2a486ef8fdafca85d323bee7))


- **(es/minifier)** Don't emit invalid code (#3302) ([8e796cd](https://github.com/swc-project/swc/commit/8e796cdc0ac59d7cab7e9e845afc2f98ee89c3ae))


- **(es/minifier)** Fix logic for checking `arguments` (#3313) ([1aa494b](https://github.com/swc-project/swc/commit/1aa494b1c0d26151c56500dd2bab283b7a4222c5))


- **(es/minifier)** Prevent infinite loop due to negation (#3310) ([b4d21bf](https://github.com/swc-project/swc/commit/b4d21bf0778d973d651b6f1825c4eb27dc150ea2))


- **(es/resolver)** Ignore names of jsx attributes (#3289) ([9a89895](https://github.com/swc-project/swc/commit/9a898951bc14e96af926e8a47a87d9220eaf4826))

### Documentation



- **(swc)** Document `typescript::strip` (#3305) ([18cd98e](https://github.com/swc-project/swc/commit/18cd98e54cdd3c651fc12815aa59a6640a1c0dcb))

### Features



- **(es/compat)** Use remove useless source map entries generated by `classes` (#3242) ([2352920](https://github.com/swc-project/swc/commit/2352920889c217be41dd5d18c2af6088e1cd0473))


- **(es/minifier)** Drop more expressions from parallel optimizer (#3303) ([210ecf8](https://github.com/swc-project/swc/commit/210ecf83bb2d23d72f903243c173a249cf4ffccb))


- **(plugin)** Add `PluginError` (#3300) ([c6ffdc8](https://github.com/swc-project/swc/commit/c6ffdc87172e504adff5757ebbb6ec2014136cf1))

### Refactor



- **(es)** Add `visit_obj_and_computed` macro (#3304) ([9e636c7](https://github.com/swc-project/swc/commit/9e636c7e582ff898ca2e374f0b3938dda98a5b67))


- **(es/minifier)** Fix clippy warnings (#3312) ([2891220](https://github.com/swc-project/swc/commit/289122009bff1e8d57178ca2cc1706f52335d1c5))

### Testing



- **(plugin/runner)** Pin dependencies for the integration test (#3306) ([7ba8a83](https://github.com/swc-project/swc/commit/7ba8a838819ae40f54801808a41af3d5334421b6))

## [1.2.130] - 2022-01-17

### Bug Fixes



- **(css/lexer)** Resolve a `TODO` (#3260) ([ade8ab8](https://github.com/swc-project/swc/commit/ade8ab8c35b9d1c61d740f42672fb4d27977346d))


- **(es/ast)** Update `EsVersion::latest()` (#3261) ([6997851](https://github.com/swc-project/swc/commit/69978518c9f6be3797f401dcaf9a429de88e8ce1))


- **(es/minifier)** Preserve side effects in correct position (#3263) ([efd8671](https://github.com/swc-project/swc/commit/efd86715c9827197278914df5dbc9f4fab1a35d9))


- **(es/parser)** Throw an error when function body has use strict and paramaters is not simple (#3278) ([6406b49](https://github.com/swc-project/swc/commit/6406b49df259eb10424ecbcc7fbbc9e4acdd37db))


- **(es/react)** Fix `createElement` (#3277) ([88a258a](https://github.com/swc-project/swc/commit/88a258a5fb91a58feb571096c4a73d6779b3128d))


- **(es/resolver)** Treat a switch statement as a block scope (#3275) ([f4b3cb7](https://github.com/swc-project/swc/commit/f4b3cb714aac1f936523f4d95467b67e554e583d))


- **(es/transforms)** Fix `this` in async arrow class properties (#3252) ([7c19e26](https://github.com/swc-project/swc/commit/7c19e26d0f41002a35c1695c259172916e578eab))


- **(es/transforms)** Remove unsafe `new String("...")` optimization (#3284) ([162c1fe](https://github.com/swc-project/swc/commit/162c1fe047631c35f8b8105c1a40ad6728e6edff))


- **(es/transforms)** Handle template literals within `jsonify` pass (#3282) ([b76d1da](https://github.com/swc-project/swc/commit/b76d1da699ab0475d349a0c9d5b06ffdd7a6b48f))


- **(swc)** Remove `wrong-target` (#3251) ([0843f74](https://github.com/swc-project/swc/commit/0843f742c5db3e0a8dc2fc2767b96fe0fad76bd1))

### Documentation



- **(adr)** Configure adr and add `00001-plugin` (#3249) ([8652b2d](https://github.com/swc-project/swc/commit/8652b2df99c37527fcd973bd8f0cd3c54bfa9485))

### Features



- **(css)** Support `@layer` at-rule (#3258) ([c195335](https://github.com/swc-project/swc/commit/c1953350121a0703f6b71474e348bc9408de085c))


- **(es/ast)** Improve AST api for plugin authors (#3281) ([9dd0647](https://github.com/swc-project/swc/commit/9dd0647e3ae6c00a4fcea3bdb82c269ebb1e61ca))


- **(es/compat)** Use `var` for `_len` and `args` in rest parameters (#3267) ([d3cc488](https://github.com/swc-project/swc/commit/d3cc488ac1f41bc752903a3e15a123a909a2b765))


- **(plugin/runner)** Free allocated memory on errors (#3270) ([66d1a92](https://github.com/swc-project/swc/commit/66d1a92635c4e04041af1c106dbda8b4d692ba8a))


- **(plugin/runnner)** Support `wasm32-wasi` targets (#3271) ([a4c4974](https://github.com/swc-project/swc/commit/a4c497464da5691fee1aff1246d3d36d1b3579af))

### Miscellaneous Tasks



- **(ci)** Configure `clippy` (#3250) ([978de59](https://github.com/swc-project/swc/commit/978de5943e60a09b5596b20b9c96596d392393c9))

### Refactor



- **(*)** Fix some clippy warnings (#3257) ([15b604b](https://github.com/swc-project/swc/commit/15b604b6d6f55353a0df13293333367851962f6c))


- **(*)** Cleanup (#3274) ([357a350](https://github.com/swc-project/swc/commit/357a35039082c79ba698ce64a69e9022d790632d))


- **(es)** More fix for clippy (#3280) ([e8670b3](https://github.com/swc-project/swc/commit/e8670b3383b4baf02a94702bc92a6dcdcd647755))


- **(es/transforms)** Cleanup (#3273) ([2690742](https://github.com/swc-project/swc/commit/2690742db0bf59246d0d9b96dfc5f6248fcbb3a0))


- **(es/utils)** Merge the super field visitor with `FnEnvHoister` (#3279) ([90a62bb](https://github.com/swc-project/swc/commit/90a62bb21528035eef02fe7fa99de6f6e014d0ca))

### Build



- **(node)** Fix glibc issue on linux gnu arm (#3255) ([2144271](https://github.com/swc-project/swc/commit/214427157ddf155da14b2bede3b315d3f6ce1e77))

## [1.2.129] - 2022-01-13

### Bug Fixes



- **(es/compat)** Transform `&&=` operator (#3225) ([2e5150d](https://github.com/swc-project/swc/commit/2e5150d2b714ba86bd228506eb0f008d9f5859e1))


- **(es/minifier)** Fix handling of inlined call to a hoisted function (#3223) ([78720c4](https://github.com/swc-project/swc/commit/78720c4c91530165b24585dab635f13eea9997a3))


- **(es/minifier)** Fix optimization of assignment expressions (#3231) ([12dd0a6](https://github.com/swc-project/swc/commit/12dd0a6c1fb6eeaf603f0f1a6da3a4231c8c47f6))


- **(es/minifier)** Fix bugs (#3238) ([74fd353](https://github.com/swc-project/swc/commit/74fd3530535813023b77739dd8f37a682269be67))


- **(es/parser)** Fix span of `ComputedPropName` (#3234) ([105cbc2](https://github.com/swc-project/swc/commit/105cbc2017e20a7c6a5d7dfdd7a9a4c396032be9))


- **(es/typescript)** Remove rogue `println` (#3244) ([282232c](https://github.com/swc-project/swc/commit/282232c9958309e70a18799449802ef5d7e88123))

### Features



- **(plugin)** Don't serialize/deserialize needlessly (#3227) ([a2f2b5a](https://github.com/swc-project/swc/commit/a2f2b5ac8924ce635fc9547057da287864fe188a))


- **(plugin/macro)** Add safe API for plugins based on a proc-macro (#3240) ([432d5d3](https://github.com/swc-project/swc/commit/432d5d3fb7d870b08f8c16e4147c3f5421693d2b))

## [1.2.128] - 2022-01-11

### Bug Fixes



- **(es/helpers)** Don't transpile `_typeof` helper (#3208) ([54353a6](https://github.com/swc-project/swc/commit/54353a6fb5ab53ed4762161ecdda1a3ec0d77c62))


- **(es/hygiene)** Visit computed properties in usage analyzer (#3217) ([cdb46cf](https://github.com/swc-project/swc/commit/cdb46cfb9180e67915c88eabdfd48317870e330d))


- **(es/minifier)** Disable inlining of expressions from `collapse_vars` (#3200) ([69b5f79](https://github.com/swc-project/swc/commit/69b5f799f3d40947ce3b5bc851ee44d3caad5328))


- **(es/minifier)** Drop unreachable statements eagerly (#3204) ([0105939](https://github.com/swc-project/swc/commit/01059394268791d85d48d9c1cbfa11564b1eb85e))


- **(es/modules)** Fix lazy import handling (#3211) ([9565149](https://github.com/swc-project/swc/commit/956514953940556847e7a5b42d7f1f21cffe9dd8))

### Features



- **(es/ast)** Use `ModuleExportName` for `ExportNamespaceSpecifier` (#3195) ([432f877](https://github.com/swc-project/swc/commit/432f87779003e50f17bcaedc35edb8583644c548))


- **(es/ast)** Update `is-macro` (#3226) ([1edbf1a](https://github.com/swc-project/swc/commit/1edbf1a37a37c5e3a9bf695b4793d0c35c2d6592))


- **(es/compat)** Implement object super (#3127) ([b649d23](https://github.com/swc-project/swc/commit/b649d23bac1faf5ae0ba9463ba9069d09055b63c))


- **(es/parser)** Accept strings for import/exports (#3190) ([3fb76f6](https://github.com/swc-project/swc/commit/3fb76f64c4e5ee49b0415757b3ead5fc753a93b6))


- **(es/transforms)** Add `Assumptions` (#3215) ([42f7268](https://github.com/swc-project/swc/commit/42f726873e6c9e813a750acbf6d818bd4e914e31))


- **(plugin)** Pass serialized ast to a wasm file (#3199) ([92de2c7](https://github.com/swc-project/swc/commit/92de2c78841ee1dc8b372268690637a19c3f4307))


- **(plugin)** Allow multi-value for the plugin signature (#3216) ([c9ded9b](https://github.com/swc-project/swc/commit/c9ded9b72080b013466f450d9b3917055e40fa23))


- **(plugin)** Perform actual transforms in plugins (#3220) ([7e7421e](https://github.com/swc-project/swc/commit/7e7421ea527f499c6488de19fb8171f2b65787b4))

### Miscellaneous Tasks



- **(es/minifier)** Add scripts to extract tests automatically (#3212) ([057fca4](https://github.com/swc-project/swc/commit/057fca4196263dcfc05e6161cb727ec4888d7e10))

### Refactor



- **(es/ast)** Change types of member-like expressions (#3178) ([f58b50b](https://github.com/swc-project/swc/commit/f58b50bea7507def95b94b498ba9c5faf55df802))


- **(es/compat)** Preserve length of functions in `async_generator` (#3202) ([5bee4e4](https://github.com/swc-project/swc/commit/5bee4e490229a3a045d4008b156034c4233ec89e))

### Security



- **(repo)** Fix crev integration (#3210) ([70c2f3b](https://github.com/swc-project/swc/commit/70c2f3b3a57ec9afc1f28ec1c6377dbbf4e920b6))

## [1.2.127] - 2022-01-06

### Bug Fixes



- **(es/lints)** Fix incorrect duplicate binding error (#3194) ([913c82a](https://github.com/swc-project/swc/commit/913c82a2ab94e14eb350e1573af736aa87c7f2bb))


- **(es/minifier)** Fix bugs (#2955) ([1c1c9f0](https://github.com/swc-project/swc/commit/1c1c9f0eaee4993d2a8e7c9714e3bab00123f14b))


- **(es/visit)** Make `noop_visit_type` visit typescript nodes that executes at runtime (#3192) ([517662c](https://github.com/swc-project/swc/commit/517662c9c243aa56451025563a7b7e57fd24d9d0))

### Features



- **(es/dep-graph)** Improve DependencyDescriptor to combine `import_assertions` with `dynamic_import_assertions` (#3183) ([e5e6e84](https://github.com/swc-project/swc/commit/e5e6e843004b7ad3ce0ffa95f583d2c2a808736a))


- **(esdiff)** Create a command to determine problematic file (#3181) ([51c792e](https://github.com/swc-project/swc/commit/51c792eb302a4e22104912a1289d19f80610d480))

### Miscellaneous Tasks



- **(*)** Update `rustc` (#3185) ([7d0a8a1](https://github.com/swc-project/swc/commit/7d0a8a12f145c42fba2ec6a80c4d9b720f29c40e))


- **(ci)** Split cargo docs (#3187) ([46949d3](https://github.com/swc-project/swc/commit/46949d39ebdcb14347156eb00490e53d37d06707))


- **(ci)** Fix publish scripts ([3458e9f](https://github.com/swc-project/swc/commit/3458e9f1d3eac7c47ba00a5768d3f8f41c8037ef))


- **(ci)** Fix publish scripts again ([b292126](https://github.com/swc-project/swc/commit/b292126b387c4efff0576517c7d706b16c08bca3))


- **(ci)** Fix `--cargo-flags` ([a20f5d9](https://github.com/swc-project/swc/commit/a20f5d9a7cd007d3c5fb671710d1344cd1577119))


- **(ci)** Use `--cargo-flags` in correct place ([ef4ea2f](https://github.com/swc-project/swc/commit/ef4ea2fc7b10ec50d317118680f58c70cf64c89b))


- **(ci)** Use `RUSTFLAGS` for linux ([4cbe8d1](https://github.com/swc-project/swc/commit/4cbe8d18bb10dfa8a333931767ebf958dab3bbae))


- **(ci)** Use more `RUSTFLAGS` ([bf0acd1](https://github.com/swc-project/swc/commit/bf0acd13da50a500414edbaf686a0632736f66fd))


- **(ci)** Fix musl ([fef8449](https://github.com/swc-project/swc/commit/fef844954b6aecd610c87ccb5ec30a2b08bd328a))


- **(ci)** Fix `aarch64-pc-windows-msvc` ([1ebbe62](https://github.com/swc-project/swc/commit/1ebbe622909a974abd0ea96929adee1c33f8f256))


- **(ci)** Change version of `rustc` ([d901b62](https://github.com/swc-project/swc/commit/d901b6222f8a77beed64968fcb4764bbacf8c755))


- **(ci)** Fix publish script (#3197) ([c34f1a9](https://github.com/swc-project/swc/commit/c34f1a977fac44813ebda5beb77b6444469e36e4))


- **(ci)** Remove redudant plugin test ([e19fe7d](https://github.com/swc-project/swc/commit/e19fe7d33b2a18c1b068c2f808f3ea72f1ccff15))

### Refactor



- **(dbg-swc)** Rename `esdiff` to `dbg-swc` (#3189) ([c758997](https://github.com/swc-project/swc/commit/c758997180793502b76d737cf56ebc10b0d88004))


- **(plugin)** Add a loader for wasm-based plugin system (#3179) ([fc4c670](https://github.com/swc-project/swc/commit/fc4c6708f24cda39640fbbfe56123f2f6eeb2474))


- **(plugin)** Remove codes related to the plugin system based on `abi_stable` (#3188) ([32d3342](https://github.com/swc-project/swc/commit/32d3342283ec788842a89bf129e4f04cfab13eb6))


- **(plugin/runner)** Avoid redundant filesystem reads (#3186) ([b61c49f](https://github.com/swc-project/swc/commit/b61c49fe39acf28e09888e7b2163c7be5cceff4b))


- **(plugin/runner)** Replace wasm runtime (#3196) ([c3895ca](https://github.com/swc-project/swc/commit/c3895ca9aaf4c8b76f1eb1bf2c8655d8acb20b94))


- **(plugin/runner)** Reuse wasmer ([28ff059](https://github.com/swc-project/swc/commit/28ff0592a4005e89561500f915929ffa25da9160))

## [1.2.126] - 2022-01-03

### Bug Fixes



- **(es/minifier)** Fix comparison of objects, numbers and strings (#3172) ([db51ce4](https://github.com/swc-project/swc/commit/db51ce44614e3661c9c25c562d39b7581e521850))


- **(node-swc)** Recover from ldd not found ([1dfc2ee](https://github.com/swc-project/swc/commit/1dfc2ee1054d20b0d04699ebef3ab09b2f6fc4f8))

### Features



- **(es/ast)** Add `ModuleExportName` (#3048) ([07c0489](https://github.com/swc-project/swc/commit/07c0489575188846b82b1af3e4bd711466e006ca))

## [1.2.125] - 2022-01-02

### Bug Fixes



- **(es/compat)** Visit all private class methods (#3150) ([35b6461](https://github.com/swc-project/swc/commit/35b64613bb1f6de52d7362e66d28c50513dbbe12))


- **(es/compat)** Fix length of async functions (#3136) ([f78d005](https://github.com/swc-project/swc/commit/f78d005a9587d2ea44741c4cef80fa711e8a1d26))


- **(es/compat)** Fix `new.target` in class properties (#3156) ([e112103](https://github.com/swc-project/swc/commit/e11210309cf2aab4aae77a76e4cdfba0bf9efa40))


- **(es/minifier)** Fix for modules (#3170) ([790c506](https://github.com/swc-project/swc/commit/790c50631ba1daa124e62bcee299f89031a4ec3d))


- **(es/typescript)** Fix handling of references in a TypeScript enum (#3163) ([e02307d](https://github.com/swc-project/swc/commit/e02307d4c82e043079131b414198ee5b4b7560e5))


- **(es/typescript)** Declare the exported variables in a namespace (#3162) ([366dc0e](https://github.com/swc-project/swc/commit/366dc0eec3e19b4e608dc4df8eb728f6d710f9b7))


- **(es/utils)** Fix handling of `new.target` (#3145) ([356082a](https://github.com/swc-project/swc/commit/356082ad84fa69cf09b5627598a2576bd1b27c36))

### Documentation



- **(es/ast)** Improve rustdoc (#3142) ([333acb5](https://github.com/swc-project/swc/commit/333acb56223139817c1df0c8b3763190b55a6295))- **general**: Update discord link (#3161) ([fb20480](https://github.com/swc-project/swc/commit/fb2048035f0aa67761aa213c58795accfde7a6d0))

### Features



- **(es/ast)** Add `rkyv` support (#3166) ([bf751cb](https://github.com/swc-project/swc/commit/bf751cb6905c7520f0846b9f0a6f4f44edecbdb3))


- **(es/codegen)** Make the output for empty objects and empty statements pretty (#3171) ([5296180](https://github.com/swc-project/swc/commit/52961804d19c413c09ff4e08c327647ffc3d0bea))


- **(es/diff)** Add a internal CLI program for debugging minifier (#3168) ([1aa55e6](https://github.com/swc-project/swc/commit/1aa55e616a7bc2ffa791600e908ddb10a4009e7b))

### Miscellaneous Tasks



- **(ci)** Update `github-action-benchmark` (#3148) ([5a3bdc9](https://github.com/swc-project/swc/commit/5a3bdc9ed37ba39a0591c66bd89eddb95f6df850))- **general**: Add `enhancement` label to `feature_request` template (#3164) ([360ad7b](https://github.com/swc-project/swc/commit/360ad7b41c6fa35ce3afc81c2237d9acdae9a549))

### Performance



- **(es/ast/serde)** Make deserialization faster (#3160) ([7a83c0c](https://github.com/swc-project/swc/commit/7a83c0cb575b0ec6510d8dff6d1bd44d9c97fdb9))

### Refactor



- **(*)** Drop unused dependencies (#3138) ([72c9636](https://github.com/swc-project/swc/commit/72c963662d63338235378d71ee856c782cdeddfe))


- **(*)** Use 2021 edition (#3151) ([194b3e9](https://github.com/swc-project/swc/commit/194b3e9b67fb096dee8dbd12fff9167e4217174b))


- **(bundler)** Improve test suite (#3144) ([8a1016f](https://github.com/swc-project/swc/commit/8a1016fb406dd04dcf432ccf4e07036f81d4c9c6))

### Testing



- **(es/parser)** Add tests about null escape (#3147) ([a4e8e53](https://github.com/swc-project/swc/commit/a4e8e53c1958f842206916eade24a269d582d69c))

## [1.2.124] - 2021-12-29

### Bug Fixes



- **(es)** Handle import assertions correctly (#3113) ([c9adf03](https://github.com/swc-project/swc/commit/c9adf0333811b2830fe3f3c06d6fd9706f7bb9ae))


- **(es/compat)** Fix handling of hoisted functions in regenerator (#3119) ([ac78a52](https://github.com/swc-project/swc/commit/ac78a527ebba3e8df2342e65b4fd5c2d36240ff0))


- **(es/compat)** Fix private methods of a class (#3123) ([1b6ac25](https://github.com/swc-project/swc/commit/1b6ac25d5c6c009c38a7097b910f7b6838ab560b))


- **(es/compat)** Fix `computed_properties` (#3120) ([27d3fd9](https://github.com/swc-project/swc/commit/27d3fd93b0ad2b5e305ded8145100b060ac6c2a3))


- **(es/optimization)** Fix inlining (#3132) ([693c22a](https://github.com/swc-project/swc/commit/693c22aa93ce115aca294f61feefe4582336ada3))


- **(es/parser)** Support import assertions in specifier-less imports (#3134) ([2f3ca22](https://github.com/swc-project/swc/commit/2f3ca22ecf7f567256695c39a904f02ff75e2c85))


- **(es/renamer)** Fix renamer (#3139) ([43c8cda](https://github.com/swc-project/swc/commit/43c8cda31a89bfc027ea3948bd9653d97d3fc29c))


- **(es/utils)** Fix `is_valid_ident` (#3133) ([ec7e0ae](https://github.com/swc-project/swc/commit/ec7e0aee256cc7cc13f81ef22164c29f42bb43be))


- **(node-swc)** Recover from `ldd` not found (#3125) ([054a195](https://github.com/swc-project/swc/commit/054a19518ce77f36520a17e146c65632aeab3080))

### Features



- **(es/preset-env)** Upgrade `browserslist-rs` (#3122) ([83f71c2](https://github.com/swc-project/swc/commit/83f71c2c0b8382e70172b1e2d4d9a18852e7a995))

### Miscellaneous Tasks



- **(ci)** Reduce CI time (#3128) ([61cd7da](https://github.com/swc-project/swc/commit/61cd7da265bd775605a0e48346f70b41adf9a225))

### Refactor



- **(es/react/fast-refresh)** Use `VisitMut` (#3129) ([f8f04e0](https://github.com/swc-project/swc/commit/f8f04e031e218393abd8ae5ca6469484b0fe90d3))

### Security



- **(repo)** Configure `cargo-crev` (#3124) ([cec325b](https://github.com/swc-project/swc/commit/cec325be6329bbdc175d7850443de8aabfcf31d6))

## [1.2.123] - 2021-12-26

### Bug Fixes



- **(es/ast)** Fix `Ident::verify_symbol` (#3108) ([e5971f7](https://github.com/swc-project/swc/commit/e5971f77d5861038f7dcd905a9aca72c84b1a035))


- **(es/compat)** Fix `classes` pass (#3107) ([d923f89](https://github.com/swc-project/swc/commit/d923f89db19b4343034569595dc3bbbce29b86b0))


- **(es/compat)** Fix `destructuring` (#3104) ([9f5a8f7](https://github.com/swc-project/swc/commit/9f5a8f728ade23640430d82f9f4bbcb341e30e2a))


- **(es/compat)** Fix handling of class methods with a big int as a key (#3118) ([a1cb4a4](https://github.com/swc-project/swc/commit/a1cb4a4aa57bd54e6718f293a65361952f4ef11d))


- **(es/helpers)** Fix decorators (#3105) ([f66c2cd](https://github.com/swc-project/swc/commit/f66c2cd375f78711fdf6a058003010bce8999aed))

### Features



- **(es/bundler)** Add an option to disable tree-shaking (#3102) ([d98a593](https://github.com/swc-project/swc/commit/d98a59339a0fa2a14f2bcb92c6deeb810ec339be))


- **(es/diff)** Initialize a diff tool for ecmascript (#3101) ([ff0b55b](https://github.com/swc-project/swc/commit/ff0b55b7782cfa9c428d88d366520b53307bca42))


- **(node)** Upgrade `napi` to v2 (#2958) ([206da12](https://github.com/swc-project/swc/commit/206da128a1f1ecd43c7580a7ad5f58ebc363c812))

### Miscellaneous Tasks



- **(ci)** Fix script for publishing ([f51314c](https://github.com/swc-project/swc/commit/f51314cd51990b2caf8b18a7d8a647236a0ec893))


- **(xi)** Fix publishing script ([e0e7f74](https://github.com/swc-project/swc/commit/e0e7f749551c15eae875457d584b869088794aea))- **general**: Fix `package.json` ([999df43](https://github.com/swc-project/swc/commit/999df436f7b9317167a822d6e0602324c8871dae))

## [1.2.122] - 2021-12-22

### Bug Fixes



- **(es/compat)** Fix handling of union of the legacy decorator pass (#3057) ([938e544](https://github.com/swc-project/swc/commit/938e544ac55503e91811cfc4e0c333deb2ccc7ed))


- **(es/loader)** Prefer ESM (#3089) ([ba2563f](https://github.com/swc-project/swc/commit/ba2563f59ed819e67a56e39cdcf38a7ccabd8f47))


- **(es/loader)** Update `lru` (#3092) ([15cbe4f](https://github.com/swc-project/swc/commit/15cbe4fcaad7b7b2f7bcc9fd413594a18ede25d8))


- **(es/transforms)** Fix `descturcturing` (#3098) ([df87c2b](https://github.com/swc-project/swc/commit/df87c2b30221f990cdd63125c9ef6036f370145e))


- **(es/typescript)** Export destructured properties in typescript namespaces (#3084) ([31dea3d](https://github.com/swc-project/swc/commit/31dea3dd319a19b75554b061cb1374d12718af24))

### Features



- **(cli)** Setup packages for CLI (#3070) ([2e89a4f](https://github.com/swc-project/swc/commit/2e89a4f5a8fda133a8d990ecfc0104e64075d15c))


- **(es/dep-graph)** Add `DependencyDescriptor::dynamic_import_assertions` (#3095) ([7d57eb2](https://github.com/swc-project/swc/commit/7d57eb2dc490b4dd7c24c35f4a4df9c13f267d56))


- **(es/lints)** Implement simple validations (#2763) ([f21af5b](https://github.com/swc-project/swc/commit/f21af5bcd600aa94f8bd99b1250524bbc823662c))


- **(es/preset-env)** Upgrade `browserslist-rs` (#3069) ([a1b315a](https://github.com/swc-project/swc/commit/a1b315a114d63aa06856de63d02070d471c271d0))


- **(es/preset-env)** Add ES2022 features to `preset-env` (#3072) ([7beaabd](https://github.com/swc-project/swc/commit/7beaabd533c9f5f368da8baa7365c7e1a30f9512))


- **(es/preset-env)** Add `.js` to generated imports (#3077) ([7d125f5](https://github.com/swc-project/swc/commit/7d125f5cdb0c078cb02958c6d168f9c993f3e830))


- **(node)** Report correct error when `swc_v1` and `swc_v2` is enabled at the same time (#3080) ([f1b8126](https://github.com/swc-project/swc/commit/f1b81266cf895dac28f68151b9c16eaa9401ec43))


- **(node/core)** Include noop swc binaries (#3088) ([42046e1](https://github.com/swc-project/swc/commit/42046e104dfa301a803f3dfd85da2801b0ebad66))

### Miscellaneous Tasks



- **(node)** Publish v1.2.122 ([f4cc323](https://github.com/swc-project/swc/commit/f4cc323e08c73f10bd4cc323a81dd5d3778395df))


- **(repo)** Make `git` faster (#3075) ([8afb5af](https://github.com/swc-project/swc/commit/8afb5af517e87b85ae1bdd8156509850c53fa276))


- **(repo)** Add section for the actual behavior to the issue template (#3100) ([0472199](https://github.com/swc-project/swc/commit/047219932fd18e7e78131f44ab5fb3be0518dc04))


- **(scripts)** Use `cargo profile instruments` instead of `cargo instruments` (#3086) ([d482d61](https://github.com/swc-project/swc/commit/d482d61b9fd9997367d0dd27e3b90c662064ae3d))

### Performance



- **(es/hygiene)** Fix performance bug (#3090) ([a81661c](https://github.com/swc-project/swc/commit/a81661c74a59376b15b1211385e95891102d2928))

### Refactor



- **(es/minifier)** Use `swc_timer` (#3087) ([0e4dce6](https://github.com/swc-project/swc/commit/0e4dce694da75f6fb3848a2f0479410bf3076412))

### Testing



- **(es/codegen)** Add some tests for sourcemap (#3078) ([0e58950](https://github.com/swc-project/swc/commit/0e5895043ffdc76857f798e0daabc05797ff22ac))

## [1.2.121] - 2021-12-19

### Bug Fixes



- **(es/compat)** Fix `block_scoping` (#3058) ([a381fb8](https://github.com/swc-project/swc/commit/a381fb8bce0ed82e7b0a201bb175acb13ce90205))


- **(es/compat)** Transform an optional eval call as an indirect eval call (#3068) ([ff1aab7](https://github.com/swc-project/swc/commit/ff1aab710c3593ca127032b41b419ecc1a4038d5))


- **(es/lexer)** Don't report lexer errors while backtracking (#3051) ([61e9b5f](https://github.com/swc-project/swc/commit/61e9b5f84115ded8c5361e6674d10e5826fd1635))


- **(es/lexer)** Fix lexing of numbers with large exponent (#3061) ([0c813ae](https://github.com/swc-project/swc/commit/0c813ae4530b34b4203ae844b470786c0305d268))


- **(es/loader)** Support fully-specified ESM import specifiers (#3050) ([d5c7fb8](https://github.com/swc-project/swc/commit/d5c7fb898fd0f92c51e04b09e8a77098dbd098ac))


- **(es/parser)** Allow assignment assertions in typescript classes (#3047) ([23a59db](https://github.com/swc-project/swc/commit/23a59db9bbbeee2ec8ccd3cdfe681e704480f97a))


- **(webpack/ast)** Fix `webpackAST` (#3040) ([15ea98b](https://github.com/swc-project/swc/commit/15ea98bf65c9993f07e226b1490bd31e81f09663))


- **(webpack/ast)** Handle typescript (#3045) ([24179bd](https://github.com/swc-project/swc/commit/24179bd9beeb8ac519186db4a71a6919852afa43))


- **(webpack/ast)** Expose fields of `AstOutput` (#3046) ([0892018](https://github.com/swc-project/swc/commit/08920189ba62cee4f836a417bffcef014e97becb))

### Features



- **(es/parser)** Report an error for `export type * from "mod";` (#3064) ([f1a2832](https://github.com/swc-project/swc/commit/f1a28329cbfa6cdda275ca16615c82472bda5121))

### Miscellaneous Tasks



- **(crates)** Use interactive bump ([276d74f](https://github.com/swc-project/swc/commit/276d74f2e9b508cd96e53c6798f28a7bb47afaed))


- **(node)** Publish v1.2.121 ([806c9db](https://github.com/swc-project/swc/commit/806c9db1a1c40e26402a08010ca74bc0f4221dab))

### Performance



- **(es/compat)** Migrate `regenerator` to `VisitMut` (#3037) ([29eb71a](https://github.com/swc-project/swc/commit/29eb71aaf9b1154aba1a28c408aaa1a2bd7a8ec7))


- **(es/parser)** Improve performance (#3059) ([b4d95b4](https://github.com/swc-project/swc/commit/b4d95b44a7465941e58ec66a13c800e00409b188))

### Refactor



- **(es/ast)** Change type or the `key` of `ClassProp` to `PropName` (#3038) ([38955c0](https://github.com/swc-project/swc/commit/38955c0c8d687866755e0d594871da449faf1da1))

## [1.2.120] - 2021-12-13

### Bug Fixes



- **(css/parser)** Fix lexing of value starting with `-` (#3011) ([e0c8bbf](https://github.com/swc-project/swc/commit/e0c8bbf7a0b24f3fe36f04886346a4709b5e09d9))


- **(es/codegen)** Fix sourcemap bug related to multi-line comments (#3023) ([c415487](https://github.com/swc-project/swc/commit/c415487bb91f466948c2279030f3643049ad395a))


- **(es/dep_graph)** Fix parsing of import assertions (#3005) ([819fc88](https://github.com/swc-project/swc/commit/819fc88a19a927091e8ce093d9eab518da039138))


- **(es/parser)** Allow trailing comma in dynamic imports if import assertion is enabled (#3018) ([b4c210d](https://github.com/swc-project/swc/commit/b4c210d1d928d21abd8fc3ed46005460f77fd183))

### Features



- **(node-swc)** Add cargo feature for v2 (#3019) ([017392a](https://github.com/swc-project/swc/commit/017392aa5b681e4a8240259e7e26709b7160d623))

### Miscellaneous Tasks



- **(api/rust)** Automate updating of change logs ([4006d56](https://github.com/swc-project/swc/commit/4006d5691fead36529ded1e0ab6273087624b180))


- **(ci)** Setup yarn cache (#3015) ([69123dd](https://github.com/swc-project/swc/commit/69123ddc283f55b224c9bee218065926cba5ae64))- **general**: Remove redundant dependencies (#3008) ([cabf5a4](https://github.com/swc-project/swc/commit/cabf5a458d7e823ce2787ecc0ee660ddb1b390fe))- **general**: Add changelog and pr template (#3017) ([aab3326](https://github.com/swc-project/swc/commit/aab3326b3eec376d2fd754c42f3b2505af163c40))

### Performance



- **(es/compat)** Migrate `regenerator` to `VisitMut` partially (#3007) ([91d6343](https://github.com/swc-project/swc/commit/91d6343d7fe8272a4fcd645d39fca74b5e0c6fc6))


- **(es/compat)** Migrate `classes` to `VisitMut` partially (#2995) ([333b52c](https://github.com/swc-project/swc/commit/333b52c646d9d56e37cdf5e6d9f4d04ceb7bfbd6))


- **(es/compat)** Migrate class helper to `VisitMut` (#3020) ([d3ffc67](https://github.com/swc-project/swc/commit/d3ffc6719b46c18ec47c4cc054f09a9ed950391f))

### Refactor



- **(es/ast)** Move `Id` to `swc_ecma_ast` (#3004) ([8340a86](https://github.com/swc-project/swc/commit/8340a86fbbf86556c8002b628eeb8787e3740d36))


- **(es/parser)** Make some verification logic optional (#3024) ([7236a22](https://github.com/swc-project/swc/commit/7236a2213e0ca260cbe9ff44ae909a3ceeeb3c4f))

### Build
- **general**: Use `mocha` for `exec_ test` instead of `jest` (#3009) ([00d22b8](https://github.com/swc-project/swc/commit/00d22b8fde8ef1639608d1d6894dd4fea38cc39f))

### Type



- **(node/swc)** Allow null for `NamedExportSpecifier.exported` (#3010) ([bdea89d](https://github.com/swc-project/swc/commit/bdea89dd95cce10ddd277f959f0d774492c806ad))

## [1.2.119] - 2021-12-10

### Bug Fixes



- **(css)** Fix `stylis` (#2987) ([c8395bc](https://github.com/swc-project/swc/commit/c8395bc74f82ffd2a37611408ec7cee963cfc99e))


- **(es/codegen)** Fix sourcemap (#3003) ([a3bd6ae](https://github.com/swc-project/swc/commit/a3bd6aea54f8ad6eacbcb1cb67cb19c6c1cd2be8))


- **(es/compat)** Preserve constructor parameters (#2975) ([f052a65](https://github.com/swc-project/swc/commit/f052a65bf3b79928be5263428f620eb11614f8f4))


- **(es/compat)** Fix for synthesized template literals (#2994) ([6a7ad92](https://github.com/swc-project/swc/commit/6a7ad9239ea2fc12fc4ffe8de51d971c2f42422e))


- **(es/minifier)** Don't create top level variables (#2985) ([4a7937d](https://github.com/swc-project/swc/commit/4a7937d56eca08a600bec22f228c681cc7adc3f4))


- **(es/react)** Implement proper `development` handling (#2741) ([ed704c9](https://github.com/swc-project/swc/commit/ed704c906f6c3bd065637b8a38ce1e58de4d5e89))


- **(es/transforms)** Update helpers about array (#2970) ([ae4bb42](https://github.com/swc-project/swc/commit/ae4bb420ae2e8fe0fca37d08d54db27c000e905c))


- **(es/typescript)** Support declaration merging of exported enums and namespaces (#2982) ([2cd1649](https://github.com/swc-project/swc/commit/2cd16490e4ba381e0435736365c9c0c7e894fbfd))


- **(es/typescript)** Fix enums which reference themselves (#3000) ([c8c73cb](https://github.com/swc-project/swc/commit/c8c73cb313e2684e8fbcc33d32b6ef7820233ba7))


- **(node/swc)** Allow using custom bindings (#2983) ([c02dd99](https://github.com/swc-project/swc/commit/c02dd9935e5e559ecb28fc23dbd8253577a3770a))


- **(webpack/ast)** Fix `webpackAST` (#2979) ([4cf5852](https://github.com/swc-project/swc/commit/4cf58528df1cd3d3ae9b44ac6cc874b2c8f0beb6))

### Features



- **(es/minifier)** Print more informantion on infinite loops (#2976) ([694d3c5](https://github.com/swc-project/swc/commit/694d3c50725ce0bfae9650f4c4b3caf2aa6b6821))

### Miscellaneous Tasks
- **general**: Fix `@swc/helpers` ([6996d7c](https://github.com/swc-project/swc/commit/6996d7cdd7ed227bd0794af852d11cbd79ac94b8))- **general**: Fix license issue (#3002) ([0a637d6](https://github.com/swc-project/swc/commit/0a637d6ce2fd86dc063e50235e81e3a99b87acfd))

### Performance



- **(es/compat)** Migrate `static_blocks` to `VisitMut` (#2973) ([32f9369](https://github.com/swc-project/swc/commit/32f936995889e9814e9ac97e313df70c814a9be2))


- **(es/compat)** Migrate `class_properties` to `VisitMut` (#2993) ([a175606](https://github.com/swc-project/swc/commit/a1756062c5f2e05042bc43c343ace448d65f3925))


- **(es/compat)** Migrate `object_rest` to `VisitMut` (#2997) ([7ca1e17](https://github.com/swc-project/swc/commit/7ca1e174b7a396eb9952cf42fa32588dab0c965d))

### Refactor



- **(visit)** Remove `&dyn Node` from `Visit` (#2984) ([e48263b](https://github.com/swc-project/swc/commit/e48263b2f3ea4cd1d0e922ced5572d2a83dd7b21))

## [1.2.118] - 2021-12-05

### Bug Fixes



- **(es/hygiene)** Reduce renaming (#2938) ([4d993c2](https://github.com/swc-project/swc/commit/4d993c26b61e208d07b7299fbc4bff3e65067207))


- **(es/parser)** Drop outdated options (#2974) ([1ea965c](https://github.com/swc-project/swc/commit/1ea965cecbc35839f40b65dea44ddd2ad925efd7))


- **(es/parser, es/compat)** Transform tagged template with invalid escape sequence (#2939) ([d8c8641](https://github.com/swc-project/swc/commit/d8c8641e59d987a2961f03dfb532fb78b00cc2fd))


- **(es/typescript)** Run `resolver` before `typescript::strip` (#2951) ([67280b6](https://github.com/swc-project/swc/commit/67280b6fb07ee06757c8d4c61c5e341031bbb3c2))


- **(es/typescript)** Transform namespace with multiple identifiers in name (#2952) ([0a8a5a1](https://github.com/swc-project/swc/commit/0a8a5a1c7800aa961ce23b9f8fc6c9ae843dd5b9))


- **(estree)** Fix serialization of `ObjectMethod` (#2961) ([c346f12](https://github.com/swc-project/swc/commit/c346f12b327620b5eb5ee33a13ab5b08b4245939))


- **(node/swc)** Add `baseUrl` to `JscConfig` (#2968) ([1f6d830](https://github.com/swc-project/swc/commit/1f6d8302c1cebbbc43ea797c1db9fef291bca3a1))


- **(swc/hygiene)** Prefer not renaming top level variables (#2940) ([beb2c73](https://github.com/swc-project/swc/commit/beb2c73c2c2a00e1d2244376e1ca677d6001716a))


- **(webpack/ast)** Remove more string literals (#2957) ([1eb62dc](https://github.com/swc-project/swc/commit/1eb62dc201854303973471c1de9fb98a0a19c4b9))


- **(webpack/ast)** Fix amd support (#2959) ([eda514b](https://github.com/swc-project/swc/commit/eda514bcc54146237690cf9f7abd67478b844b0b))


- **(webpack/ast)** Preserve more arguments of `define` calls (#2960) ([4008a65](https://github.com/swc-project/swc/commit/4008a65b1e3fc5f7932618fa09f80000cf9dc999))


- **(webpack/ast)** Reduce `if` statements (#2969) ([2a01dd4](https://github.com/swc-project/swc/commit/2a01dd4b32a96a14efbe7067dac2d83f3a881c84))


- **(webpack/ast)** Preserve span (#2971) ([74363e0](https://github.com/swc-project/swc/commit/74363e03579367b2d362f0fcbc3f5bc92a88d469))- **general**: (es/compat): Change order of passes (#2949) ([99da422](https://github.com/swc-project/swc/commit/99da4221ae4ef7ba01d765a3f8c097fe04d3dc2f))

### Miscellaneous Tasks
- **general**: Add a script to manage crates ([b9baa50](https://github.com/swc-project/swc/commit/b9baa503e3c8c94fb9f4c535ab83689654715e89))- **general**: Make `rust-analyzer` faster (#2962) ([02322aa](https://github.com/swc-project/swc/commit/02322aaa9919f75a150b7ea27a637fee0b981b36))- **general**: Remove duplicate version field in `package.json` (#2965) ([ce60138](https://github.com/swc-project/swc/commit/ce601382d5b79449a355ad636ea83322816eccd9))- **general**: Inline `@swc/helpers` (#2972) ([ffec782](https://github.com/swc-project/swc/commit/ffec782a41c86d8988425df05f719ec80ae6cb0e))

### Performance



- **(es/compat)** Migrate `class_properties` to `VisitMut` partially (#2966) ([89af8ab](https://github.com/swc-project/swc/commit/89af8ab9a278539b34c93ab888a8930f4a35b146))

### Refactor



- **(es/compat)** Migrate `destructuring` to `VisitMut` (#2947) ([084eebe](https://github.com/swc-project/swc/commit/084eebec848b1e4ce097a689ec48d9d54284c61b))


- **(es/parser)** Remove `import_assertions` from `TsConfig` (#2950) ([97df4ce](https://github.com/swc-project/swc/commit/97df4cef80862cf6dc8154509d6f91171988c2c4))


- **(es/preset-env)** Avoid unnecessary `unwrap` (#2943) ([3302d17](https://github.com/swc-project/swc/commit/3302d1733acd5adf4f53ce8c2aef678990f584f2))

### Build
- **general**: Update `.npmignore` (#2963) ([ad35d95](https://github.com/swc-project/swc/commit/ad35d954e1f847edc48574b4b4dedcae83e1bcbb))

## [1.2.117] - 2021-12-02

### Bug Fixes



- **(ci)** Fix freebsd builds (#2944) ([a93f111](https://github.com/swc-project/swc/commit/a93f1111f91aec042dd65f192001a0897a400717))

### Features



- **(es/transforms/compat)** Add loose mode to `parameters` (#2911) ([1555ceb](https://github.com/swc-project/swc/commit/1555ceb8a395351e26b9e66bf8a4e77adc0300c5))

### Miscellaneous Tasks
- **general**: Break cycles (#2941) ([0304c55](https://github.com/swc-project/swc/commit/0304c550a48b0f31ac646ed8e3326c0568210883))- **general**: Drop freebsd for publishing ([82c8694](https://github.com/swc-project/swc/commit/82c8694f4b840d439d091de0ffe9af07c0d172f2))

## [1.2.116] - 2021-12-01

### Bug Fixes



- **(bundler)** Use interop for common js dependencies (#2930) ([24de550](https://github.com/swc-project/swc/commit/24de5507ae5c5774a6a329f79519b37461ce5145))


- **(css/ast)** Fix type definition of `@namespace` (#2919) ([0f4ad0f](https://github.com/swc-project/swc/commit/0f4ad0f8c805d838b7c6d2119f3f426f1c73f3fe))


- **(css/ast)** Fix type definitions related to parsing unknown at-rules (#2922) ([8781527](https://github.com/swc-project/swc/commit/87815277515041eb5874b68775096ecd75b2672f))


- **(webpack/ast)** Fix span of null literals (#2925) ([18d9fd9](https://github.com/swc-project/swc/commit/18d9fd91f9624f7ad799883768f6e0159ef9225f))


- **(webpack/ast)** Fix handling of `define` (#2935) ([9f5fc11](https://github.com/swc-project/swc/commit/9f5fc11a8f3d37dfc3d04a1d8935704ec9be0179))


- **(webpack/ast)** Fix ast reducer (#2936) ([667dd1e](https://github.com/swc-project/swc/commit/667dd1e95e887328fd450b9c52c8c13b5f3e23e4))


- **(webpack/ast)** Don't remove comparison of `process.env.NODE_ENV` (#2937) ([4539b3a](https://github.com/swc-project/swc/commit/4539b3a61034f65a41fcfcf085d96d3fe30eee70))

### Features



- **(es/preset-env)** Upgrade `browserslist-rs` (#2927) ([8a55870](https://github.com/swc-project/swc/commit/8a55870ce5ee9aac667408d81e802063cd6b36d2))

## [1.2.115] - 2021-12-01

### Bug Fixes



- **(es/transforms/compat)** Fix block scoping (#2916) ([028d0ce](https://github.com/swc-project/swc/commit/028d0ce2c6e275f7b9ca1652c60fa18c1a10c667))


- **(es/transforms/compat)** Fix `destructuring`  (#2904) ([0c1f2eb](https://github.com/swc-project/swc/commit/0c1f2ebdde2bcd1a1e0b91c07ccd0bd9b9b70b50))


- **(webpack/ast)** Fix ast reducer (#2914) ([32b68ef](https://github.com/swc-project/swc/commit/32b68ef5d0fea16dc7d97e8d7e9109bf984a743f))


- **(webpack/ast)** Improve ast reducer (#2917) ([854b598](https://github.com/swc-project/swc/commit/854b598e94ec87b5df9c0a4efcd3c4b7c872226c))

### Features



- **(css/ast)** Add a flag to number types (#2905) ([fcd0d7a](https://github.com/swc-project/swc/commit/fcd0d7a6cba4279087ef41ff2d220f62bb0b78d5))


- **(plugin/runner)** Supports specifying exact path for plugin (#2918) ([5999634](https://github.com/swc-project/swc/commit/599963495216a929b5992b3e40717d215b2c93b4))

### Miscellaneous Tasks
- **general**: Reduce compile time ([158d4bc](https://github.com/swc-project/swc/commit/158d4bc1edce4ce5e0fa6a9408ac0037362fb3af))

### Performance



- **(es/transform/compat)** Migrate `optional_chaining` to `VisitMut` (#2891) ([4075ff8](https://github.com/swc-project/swc/commit/4075ff8029b4d0a71819145dd53de061c47d9b74))

## [1.2.114] - 2021-11-29

### Bug Fixes



- **(css)** Handle custom properties properly (#2869) ([c94735e](https://github.com/swc-project/swc/commit/c94735e540e7a5995d912761df7b68e8b70dce2c))


- **(es/parser)** Fix parser (#2903) ([c186aa4](https://github.com/swc-project/swc/commit/c186aa443a4be3ede9317afc91013ee97a3fbcd5))


- **(es/preset-env)** Enable "mobile to desktop" (#2907) ([5a68a36](https://github.com/swc-project/swc/commit/5a68a360b46fd1c1f53927068c78b12442386295))


- **(es/transforms/module)** Fix overriding of `export *` (#2883) ([6f05c10](https://github.com/swc-project/swc/commit/6f05c101f166e2f6c5cdbd27e2946e1cc2efdf2f))


- **(swc)** Unimplement `Default` for `JsMinifyOptions` (#2901) ([bb66083](https://github.com/swc-project/swc/commit/bb66083f69fe988bab977cad6361b6649a202cca))


- **(webpack/ast)** Adjust `acorn` options. (#2908) ([586ab0c](https://github.com/swc-project/swc/commit/586ab0cf764d1192fd0d43173042d7788317f397))

### Features



- **(css/ast)** Add support for nested `@at-rule`s (#2897) ([c77ebbe](https://github.com/swc-project/swc/commit/c77ebbeb8d186ade51d3cc5ac94176a4cf071569))


- **(css/parser)** Add more error recovery (#2849) ([d7183d8](https://github.com/swc-project/swc/commit/d7183d82e2956fa7632bda074dae405a7775dad3))


- **(plugin)** Rename `Plugin` to `JsPlugin` (#2893) ([ffcb357](https://github.com/swc-project/swc/commit/ffcb3570103eaeef5a0614dd72c5208b12276fe6))


- **(plugin)** Enable plugin support under experimental flag (#2894) ([91ef3cc](https://github.com/swc-project/swc/commit/91ef3cc16e622fa35ac4b8212c29fd8b425f4a62))


- **(swc)** Implement `Default` for `JsMinifyOptions` (#2899) ([5425509](https://github.com/swc-project/swc/commit/54255092082fcb8c7aafa90227ba9543509c31fb))

### Miscellaneous Tasks



- **(es/preset-env)** Upgrade `browserslist-rs` (#2889) ([af216c1](https://github.com/swc-project/swc/commit/af216c10147afff6ba296adbbfb9b2683a21ee50))- **general**: Reduce compile time (#2909) ([435facc](https://github.com/swc-project/swc/commit/435faccc2e9e989e6de5b5e6e809599f53afa1c1))- **general**: Fix cargo config ([3695159](https://github.com/swc-project/swc/commit/36951599584182b56456b69f6e462a1a0f8a0799))- **general**: Fix cargo config again ([189a590](https://github.com/swc-project/swc/commit/189a5903ccbf25531dc26c8f793d14ec08261cbe))- **general**: Revert ([166c12d](https://github.com/swc-project/swc/commit/166c12d295a18507856424f5cd6ab9a18572c9db))- **general**: Revert #2907 ([666e3cc](https://github.com/swc-project/swc/commit/666e3cc71ef8f9e491b45c1ff695a5d0cf21b5d3))

## [1.2.113] - 2021-11-27

### Bug Fixes



- **(css/ast)** Fix AST definitions for `@keyframes` (#2848) ([ce6c7ee](https://github.com/swc-project/swc/commit/ce6c7ee85dd03db675373cdedf691698f189335e))


- **(css/parser)** Fix span of type selectors (#2870) ([c40e134](https://github.com/swc-project/swc/commit/c40e1347135b3df4793b7f4c030ae69330e75030))


- **(es/transforms/compat)** Fix `destructuring` (#2866) ([a6398e9](https://github.com/swc-project/swc/commit/a6398e9f26e3c266e0413747cf45c509af5b502d))


- **(es/transforms/compat)** Fix `arrow` (#2882) ([803787a](https://github.com/swc-project/swc/commit/803787ab9e90458308e3300284d0ee91466b6676))


- **(es/transforms/module)** Fix detection of helpers to inject (#2868) ([43e89fd](https://github.com/swc-project/swc/commit/43e89fd0c86f314280d95cbe5dd7a524b92a0fb3))


- **(node)** Fix `parseFile` (#2881) ([7bccbcc](https://github.com/swc-project/swc/commit/7bccbcc880d29d0379886bf59ab93fc0ed308517))


- **(swc)** Fix handling of `jest` option (#2892) ([ddc3aca](https://github.com/swc-project/swc/commit/ddc3aca3f089db6b557171c6ef399803e18ade03))

### Features



- **(css/minifier)** Initialize crate (#2884) ([c6cb790](https://github.com/swc-project/swc/commit/c6cb790cd927b5a7fdd623954ea5c1f02a53261d))


- **(es/estree)** Allow emitting `acorn` ast (#2859) ([cdef843](https://github.com/swc-project/swc/commit/cdef843369a0a35ffecb2ee5272e3805dfadb149))


- **(es/parser)** Implement more error recovery (#2874) ([b853d4a](https://github.com/swc-project/swc/commit/b853d4ac9545b2791d80da1d50f12d56563d2b01))


- **(webpack)** Add ast reducer (#2875) ([c2bbdbe](https://github.com/swc-project/swc/commit/c2bbdbe9d6397e2ec36beabdacb2541497c76510))

### Miscellaneous Tasks
- **general**: Allow using `#[doc(cfg)]` (#2871) ([28850ee](https://github.com/swc-project/swc/commit/28850eef5c98d9b0975eb84aa647d2b2c1977cb7))- **general**: Document features (#2890) ([f5af22e](https://github.com/swc-project/swc/commit/f5af22ef716db76a39ea22cc88f3f92745fb4aad))

### Performance



- **(es/transforms/compat)** Migrate `spread` to `VisitMut` (#2888) ([283074c](https://github.com/swc-project/swc/commit/283074c86edb3793068d77289f82638061f8a3ee))

### Refactor



- **(css/lexer)** Follow spec more closely (#2839) ([4bf1f93](https://github.com/swc-project/swc/commit/4bf1f930176faf2fcd2edcd09abc2f83bc6aa6ed))


- **(es/transforms/compat)** Improve `async_to_generator` (#2876) ([a350d86](https://github.com/swc-project/swc/commit/a350d86c5701084838d8a996d99d4abc0754bb4f))

## [1.2.112] - 2021-11-24

### Bug Fixes



- **(bundler)** Ignore `require` of external modules (#2840) ([c8de935](https://github.com/swc-project/swc/commit/c8de935560eac5cac557e1f641447143efcb8f53))


- **(es/lexer)** Fix lexing of hexadecimal escape sequences (#2838) ([cf777c5](https://github.com/swc-project/swc/commit/cf777c5ba11af3fd383f7c5ee9b3291c42a6ebea))


- **(es/minifier)** Fix bugs (#2779) ([fa342a0](https://github.com/swc-project/swc/commit/fa342a0067a4d67fcb9bea0a586ce9737252bc2d))


- **(es/parser)** Fix span of named export (#2813) ([338b8fd](https://github.com/swc-project/swc/commit/338b8fd98e871660973364ed6438b03880761616))


- **(es/parser)** Fix span of empty modules (#2827) ([9525ea1](https://github.com/swc-project/swc/commit/9525ea178fc36865d296ca7936e964a0aeeb6bd7))


- **(es/parser)** Fix comments of empty modules (#2828) ([79ba13c](https://github.com/swc-project/swc/commit/79ba13cbb5b40dc18276dc8847ca7b5ea683ccdb))


- **(es/transforms/base)** Fix `ts_resolver` (#2824) ([9cd3d16](https://github.com/swc-project/swc/commit/9cd3d1610d6a2c768931e00af5062b4c50051bf9))


- **(es/transforms/base)** Fix `ts_resolver` (#2826) ([7a6bf42](https://github.com/swc-project/swc/commit/7a6bf424c522d8e776ecfb45a9a23c5645e9b1fb))


- **(es/transforms/compat)** Reduce `.bind(this)` (#2806) ([26734d4](https://github.com/swc-project/swc/commit/26734d44ebcca535e1ea62876a452f053a1da3be))


- **(es/transforms/compat)** Fix `this` in constructor (#2818) ([6a7775b](https://github.com/swc-project/swc/commit/6a7775b5daf1f4aba6cddb4e2fe8cced450d5245))


- **(es/transforms/typescript)** Allow enum aliases when values are strings (#2816) ([95a6a28](https://github.com/swc-project/swc/commit/95a6a28014ab1a7deb8cb32829261c097024b517))


- **(graph_analyzer)** Allow invoking `load` multiple time (#2823) ([020b4a5](https://github.com/swc-project/swc/commit/020b4a554dfa0f78b46d9cd7f1776fe67a7f7546))

### Features



- **(css/parser)** Improve parser api (#2847) ([839a99e](https://github.com/swc-project/swc/commit/839a99e7fda3ed920d9cc912eaa5859f76361950))


- **(es/minifier)** Improve `drop_console` (#2830) ([c5768d7](https://github.com/swc-project/swc/commit/c5768d7672ba33e75e0268176a90f9fb1d725fb4))


- **(es/preset_env)** Use `browserslist-rs` (#2845) ([2c099bf](https://github.com/swc-project/swc/commit/2c099bfd2c4a1ec147269d445db88bd88856e1f8))- **general**: Enable logging of timings (#2833) ([6b96a3d](https://github.com/swc-project/swc/commit/6b96a3d8ed2bc9c55fdc07d22257800d27e7a160))

### Miscellaneous Tasks
- **general**: Typo (#2829) ([bfa6458](https://github.com/swc-project/swc/commit/bfa645873710c07a77658ed0472ff817de6d10a5))

### Performance



- **(es/transforms/compat)** Migrate `parameters` to `VisitMut` (#2804) ([372f5bf](https://github.com/swc-project/swc/commit/372f5bf1e0608d8a4ed7fe4376839b1c0ffeed27))


- **(es/transforms/compat)** Migrate `block_scoping` to `VisitMut` (#2817) ([a9a9833](https://github.com/swc-project/swc/commit/a9a9833be8c3506063159b19ad90739ae328d8b9))


- **(es/transforms/compat)** Migrate `computed_props` to `VisitMut` (#2857) ([1609580](https://github.com/swc-project/swc/commit/1609580a4e99257c1a88e08433e047dfc3a17709))

### Refactor



- **(css/ast)** Split pseudo class and pseudo element (#2675) ([4bcf3fc](https://github.com/swc-project/swc/commit/4bcf3fc2adbf4d0f268c7318407d5d075da97170))


- **(es/estree)** Rename: `babel` => `estree` (#2846) ([790a262](https://github.com/swc-project/swc/commit/790a262c074909128e2db9ca0240ebce6b75f88e))


- **(es/transforms/compat)** Lift this replacer out of arrow (#2812) ([fbcbeb4](https://github.com/swc-project/swc/commit/fbcbeb4892c7e19d1e603eb8a6ebf0c205564d2a))

### Bench



- **(es/visit)** Add some benchmarks (#2820) ([d64b066](https://github.com/swc-project/swc/commit/d64b066ef103a81e7ee23699bbd01ceeb7ce93b1))

## [1.2.111] - 2021-11-19

### Bug Fixes



- **(css/parser)** Fix parsing of whitespaces (#2787) ([e32093e](https://github.com/swc-project/swc/commit/e32093e72d6f37b3ab2c2ef5b5e9bd3007177e64))


- **(es/parser)** Allow `static`/`declare` to be optional class property name (#2782) ([1caa61a](https://github.com/swc-project/swc/commit/1caa61a1820e2c207531aa505a1c05e27b9b118e))


- **(es/transforms/compat)** Fix `optional_chaining`(#2791) ([29da148](https://github.com/swc-project/swc/commit/29da148b3e9e1960f9c5b11c4f3a08d03d600da6))


- **(es/transforms/compat)** Remove `.bind(this)` (#2776) ([5261df5](https://github.com/swc-project/swc/commit/5261df52d268b8ddad40d6e2f05c60f099e0e72a))


- **(es/utils)** Fix `collect_decls` (#2792) ([af420ea](https://github.com/swc-project/swc/commit/af420eab4be807536bf66fd6269be36fa0453185))


- **(es/utils)** Fix `extract_var_ids` (#2798) ([02ffe8a](https://github.com/swc-project/swc/commit/02ffe8a2897b782be8aca9dc2ce3a9696bad8e8a))


- **(wasm)** Fix `wasm-web` (#2803) ([1368981](https://github.com/swc-project/swc/commit/1368981f1942556ea91371b067efe0ec0bbd9fb4))

### Refactor



- **(css/ast)** Rename `StyleRule` to `QualifiedRule` (#2756) ([c50cec1](https://github.com/swc-project/swc/commit/c50cec1533ad8d8fc8196060207d5d96c75da2d3))

## [1.2.110] - 2021-11-17

### Bug Fixes



- **(es/transforms/compat)** Revert #2740 (#2784) ([06e02d8](https://github.com/swc-project/swc/commit/06e02d83756f0adc43c39c92d1420cf11346fdbd))

### Miscellaneous Tasks



- **(es/minifier)** Add a script to copy tests from a next.js app (#2778) ([e1b7665](https://github.com/swc-project/swc/commit/e1b76654f59cc02133d394e5393664ba74cb8d34))

## [1.2.109] - 2021-11-17

### Bug Fixes



- **(es/lexer)** Fix handling of jsx escapes (#2723) ([11d1fa5](https://github.com/swc-project/swc/commit/11d1fa56c073c21aeb2b427ed39b2f0f6a00b558))


- **(es/loader)** Add more built-in modules (#2760) ([fdd6eaa](https://github.com/swc-project/swc/commit/fdd6eaaa9b600ceb8a2aaec30379b8f3680e0557))


- **(es/minifier)** Don't inline string literals if it's used multiple time (#2748) ([f2c67b8](https://github.com/swc-project/swc/commit/f2c67b8caf6a767b598b350ccacd842f34e5160d))


- **(es/parser)** Check for more typescript class names (#2732) ([6e10168](https://github.com/swc-project/swc/commit/6e101682079256ddabb5ff6b8d7943387fb43006))


- **(es/transform/compat)** Preserve more span (#2766) ([ddfc7e6](https://github.com/swc-project/swc/commit/ddfc7e6e915aeef46054d36bd23acaea69f9af37))


- **(es/transforms/compat)** Fix `new_target` (#2736) ([571c5e3](https://github.com/swc-project/swc/commit/571c5e31233d017cf88b374c88224960f6cb570a))


- **(es/transforms/compat)** Apply `block_scoping` before `regenerator` (#2740) ([bb646cc](https://github.com/swc-project/swc/commit/bb646cc31cbdbcb1b12786733fb3c9d9d75ae095))


- **(es/transforms/compat)** Preserve more span (#2762) ([2fb4e5a](https://github.com/swc-project/swc/commit/2fb4e5a60ccdd5531e075bb03348a3548e275d2b))- **general**: Revert #2766 (#2774) ([95e7f4d](https://github.com/swc-project/swc/commit/95e7f4d4e91d967c3482dd673a670d134e9760b6))

### Features



- **(css/ast)** Add types for `An+b` syntax (#2759) ([6ce437d](https://github.com/swc-project/swc/commit/6ce437d65d5eae07040b93a3a5c4842f19e88e4a))


- **(es/transforms/compat)** Add more loose mode (#2611) ([dc58122](https://github.com/swc-project/swc/commit/dc58122283864f34a27c294cea8835d6fa10204c))


- **(swc)** Add `IsModule` (#2601) ([65d376a](https://github.com/swc-project/swc/commit/65d376a91baf19f1f6ddf99e700a5f82b33c9e0c))

### Miscellaneous Tasks
- **general**: Fix broken link (#2737) ([79fc464](https://github.com/swc-project/swc/commit/79fc464f8ddc5ccf77520734405ae7c174f4383d))- **general**: Update markdown files to use "SWC" instead of "swc" (#2744) ([3ebc5c6](https://github.com/swc-project/swc/commit/3ebc5c6b6905d28769da6aefb48646a4ad6d023d))- **general**: Change Gitter link to Discord (#2752) ([015b258](https://github.com/swc-project/swc/commit/015b2586c307d22b07aa02a9db2202aff337f554))- **general**: Rename the default branch from `master` to `main` (#2750) ([6b70fb5](https://github.com/swc-project/swc/commit/6b70fb5afe91fc7e0a5b5031409179e0ad1f8d32))- **general**: Ensure `feature.manyFiles` of Git is enabled (#2754) ([8aea5eb](https://github.com/swc-project/swc/commit/8aea5ebb47524d3a0a25e93e394133eed8c4d72b))- **general**: Fix benchmark github action (#2755) ([54bc405](https://github.com/swc-project/swc/commit/54bc4054a9a892439725d8944b6dc5116df59389))- **general**: Fix typo (#2764) ([2e01876](https://github.com/swc-project/swc/commit/2e018769c2bdbec7b2891bf09293c6c5b5c0dee6))- **general**: Fix links and paths (#2773) ([58bf5a5](https://github.com/swc-project/swc/commit/58bf5a5e2cff18ab7524188387cc893051edf045))

### Refactor



- **(css/ast)** Rename `Text` to `Ident` (#2726) ([65ee1b4](https://github.com/swc-project/swc/commit/65ee1b467e9aa12d55e2c7a0de69c936bf8852ae))


- **(es/parser)** Simplify `skip_line_comment` (#2768) ([1bb2c68](https://github.com/swc-project/swc/commit/1bb2c687c049bb742745dfb259b263533ee801e1))


- **(es/transforms/compat)** Migrate to `VisitMut` (#2709) ([6148d0c](https://github.com/swc-project/swc/commit/6148d0c3da011d3d5707424ea822c5948445fc1d))


- **(es/transforms/compat)** Migrate to `VisitMut` (#2751) ([e7cbe3d](https://github.com/swc-project/swc/commit/e7cbe3df2038a98f0f83cf918604f5b971161e10))


- **(swc_bundler)** Extract logic for analyzing cycles (#2733) ([b869c81](https://github.com/swc-project/swc/commit/b869c81888553b870a5a2c79c6ef49354df15670))- **general**: Flatten `css` (#2731) ([1d518fe](https://github.com/swc-project/swc/commit/1d518fe3813ed7847ff76e67001fec8420126286))- **general**: Cleanup (#2749) ([2462b99](https://github.com/swc-project/swc/commit/2462b9941f94bc475cf9ff9c67e3b7c1f98739cc))

### Testing



- **(swc)** Add a test for sourcemap (#2777) ([53c8939](https://github.com/swc-project/swc/commit/53c8939550c43ee6ee1a57be2b0388469838483b))

## [1.2.108] - 2021-11-11

### Bug Fixes



- **(css/lexer)** Exclude whitespace from spans (#2702) ([0b10423](https://github.com/swc-project/swc/commit/0b1042354cb3a0e29c6841da7054abe1af67aad7))


- **(css/parse)** Fix parsing of pseudo elements and pseudo classes (#2672) ([465c188](https://github.com/swc-project/swc/commit/465c18860e56417d1aacde0a448def182c23c742))


- **(css/parser)** Fix parsing of escaped characters (#2700) ([d8ddb2f](https://github.com/swc-project/swc/commit/d8ddb2fb99f5eddedf370c46bb6b49b5d87c9ecb))


- **(es)** Fix `paths` support (#2712) ([1d028fe](https://github.com/swc-project/swc/commit/1d028fe940566c53fb30313bc2ff0ac28d33351a))


- **(es)** Move `TargetEnv` to loader from ast (#2719) ([665c8e0](https://github.com/swc-project/swc/commit/665c8e05fc05b411544cea0b64e056bfbec7370a))


- **(es/minifier)** Fix minifier (#2711) ([df635c9](https://github.com/swc-project/swc/commit/df635c9e6de3aa84e38bd82e80ca1ea365175b90))


- **(es/transforms/async_to_generator)** Fix handling of `this` (#2667) ([01727c0](https://github.com/swc-project/swc/commit/01727c0e5a4677ad6596210e77a9389264e6f9b8))


- **(es/transforms/common_js)** Allow reassignment to functions exported as default (#2705) ([691e5e5](https://github.com/swc-project/swc/commit/691e5e581c1d3ef3fcd0f65e4f8c8265faabb37c))


- **(es/transforms/compat)** Apply `regenerator` for default function declarations (#2681) ([8fe0d25](https://github.com/swc-project/swc/commit/8fe0d2583fb13339277c0cd2f4f78d06c3110c16))


- **(es/transforms/compat)** Use `_createSuper` for super classes (#2699) ([8edd72e](https://github.com/swc-project/swc/commit/8edd72ed73eeca2353348daf50cf0d9117c2c1ae))


- **(es/transforms/react)** Fix handling of whitespaces (#2638) ([7ab3b5b](https://github.com/swc-project/swc/commit/7ab3b5b0b8bc7f198cf118efe3d03f7c1dbe1a80))


- **(swc)** Don't print same error twice (#2692) ([22ce68c](https://github.com/swc-project/swc/commit/22ce68cfaaac3791534084a33498d54083595de9))


- **(swc)** Fix tests (#2707) ([a90fae5](https://github.com/swc-project/swc/commit/a90fae56962a2a5c67ab4302627b285c22ef638d))

### Features



- **(rplugin)** Implement general AST processing plugin system (#2671) ([bf0007b](https://github.com/swc-project/swc/commit/bf0007bec0127adaa74ffbc23b2c6662612e062f))

### Miscellaneous Tasks
- **general**: Update rustc to prevent `CVE-2021-42574` (#2690) ([368b9e2](https://github.com/swc-project/swc/commit/368b9e2ff278eebf63636a44349add4cf940096d))- **general**: Update README.md (#2693) ([cb68956](https://github.com/swc-project/swc/commit/cb689565d570a3fd86fe9b4589d37a5adc73cd96))

### Performance



- **(es/transforms/compat)** Migrate to `VisitMut` (#2696) ([824fa24](https://github.com/swc-project/swc/commit/824fa2485276ff85b66a27c7570b280b95199e9c))

### Refactor



- **(css/ast)** Refactor complex selector to represent all css (#2660) ([75e6e08](https://github.com/swc-project/swc/commit/75e6e08e14ac73fb30bb7ddf9cfdeda6bc7940b9))


- **(css/ast)** Remove `UniversalSelector` (#2673) ([4484d64](https://github.com/swc-project/swc/commit/4484d64f946b7800a97f0625a9a7846f33cc46e4))


- **(es/transforms/bugfix)** Migrate `edge_default_param` to `VisitMut` (#2676) ([8915913](https://github.com/swc-project/swc/commit/891591382d50a70712b804668f7c56573bca3d12))- **general**: Remove trailing whitespace (#2668) ([94cb430](https://github.com/swc-project/swc/commit/94cb4303ae49440aeb9d53d52376ad66b44f28ce))- **general**: Flatten crates (#2697) ([687305f](https://github.com/swc-project/swc/commit/687305f280937cba1544fdade652aeb5f3941b2e))- **general**: Flatten more packages (#2706) ([4f70ee6](https://github.com/swc-project/swc/commit/4f70ee6d980dbe198aa2db6f4ee7427805568064))- **general**: Flatten `ecmascript` (#2708) ([2b2f695](https://github.com/swc-project/swc/commit/2b2f6955f22c7ef04dd844e7aa686bbcefd977db))

### Testing



- **(css/codegen)** Add tests for parenthesis (#2691) ([9824fda](https://github.com/swc-project/swc/commit/9824fdaae25a78a7762ab930bfa48151b9bfdea7))


- **(css/parser)** Add a test for `BOM` (#2686) ([ca2338e](https://github.com/swc-project/swc/commit/ca2338edbddc0c9a5be2aee3ece68b449267b137))

## [1.2.107] - 2021-11-06

### Bug Fixes



- **(css/lexer)** Fix some edge cases (#2612) ([c89a9ea](https://github.com/swc-project/swc/commit/c89a9ea171a7edd02fa66d84a5be9ed27f89e8c7))


- **(css/parser)** Exclude whitespace from span (#2659) ([a8e4c72](https://github.com/swc-project/swc/commit/a8e4c72f33858bb7dca4af5881285ac8337376f7))


- **(es/compat)** Fix order of transforms (#2629) ([550584f](https://github.com/swc-project/swc/commit/550584f93c96d41ac4cf676ad6eb3c8fe1c81e5c))


- **(es/minifier)** Fix minifier (#2597) ([306cf98](https://github.com/swc-project/swc/commit/306cf989db7292387cb7369242ef0025233d775e))


- **(es/minifier)** Fix bugs of the minifier (#2610) ([9cb3bf9](https://github.com/swc-project/swc/commit/9cb3bf96dc26fe80f76bbdb6d89b30368e673778))


- **(es/minifier)** Fix for `react-countup` (#2625) ([7ea4ee8](https://github.com/swc-project/swc/commit/7ea4ee81c26f54546db0f245fba0e05474a8318b))


- **(es/minifier)** Fix for `@emotion/react` and `murmur2` (#2637) ([808d578](https://github.com/swc-project/swc/commit/808d57822bb2f9d44ee07be6bec6b19803da61fa))


- **(es/transforms)** Fix detection of `this` (#2634) ([f4efd7a](https://github.com/swc-project/swc/commit/f4efd7ad9276bf09e9edb7462d7fae25063fbfbf))


- **(es/transforms/cjs)** Allow mixing named exports and export stars. (#2583) ([7e3fb0a](https://github.com/swc-project/swc/commit/7e3fb0a0abcbb71e549c2fcc550a95f1833d535d))


- **(es/transforms/cjs)** Allow using multiple `export *` (#2598) ([5b141ee](https://github.com/swc-project/swc/commit/5b141ee80a7f8adae8428bf89b0038abaa6a8a2d))


- **(es/transforms/compat)** Fix static blocks (#2652) ([d1523dc](https://github.com/swc-project/swc/commit/d1523dc5e8ef423012632a6cead939e300134e47))


- **(es/transforms/strip)** Strip types for typescript export equals (#2623) ([d2f2409](https://github.com/swc-project/swc/commit/d2f24095281569afaebc1114b80d5786bbaaf503))


- **(es/transforms/typescript)** Allow `(foo as any) = bar` (#2631) ([12be4b1](https://github.com/swc-project/swc/commit/12be4b17991cf67e76fd2aa24c9103b354ee5650))


- **(node/types)** Add `es6` to `ModuleConfig` (#2648) ([b6a5656](https://github.com/swc-project/swc/commit/b6a5656f69056779415932606f68fcda75e1e340))


- **(plugin)** Fix serialization and deserialization (#2651) ([a683636](https://github.com/swc-project/swc/commit/a6836368a2dd466e20e41705811760bdfc259e4c))

### Features



- **(css/ast)** Add `RoundBracketBlock` to `Value` (#2618) ([8c61d0d](https://github.com/swc-project/swc/commit/8c61d0d6096e1714e723334f0877bc53f3191f8d))


- **(css/ast)** Add `SelectorList` (#2639) ([0b76d29](https://github.com/swc-project/swc/commit/0b76d29ae41401096e3bc4fe27c7dffc2b13b269))


- **(css/ast)** Add nested selector (#2641) ([6ae3af3](https://github.com/swc-project/swc/commit/6ae3af3673843fae9765641b411e8b5213d0e785))


- **(es/ast)** Implement `Take` for more types (#2649) ([0414c31](https://github.com/swc-project/swc/commit/0414c31480d8dbe63f07c1d049b9566ec2db8163))


- **(es/ast)** Add utils (#2657) ([994c965](https://github.com/swc-project/swc/commit/994c9655c899d71e5482a7bfe06cad015a25f512))


- **(plugin)** Proxy `swc_common` apis (#2646) ([3807229](https://github.com/swc-project/swc/commit/380722976ab65b103c274704ca96de96510d7475))


- **(swc)** Provide `&Program` to pass creator (#2665) ([3dc1e76](https://github.com/swc-project/swc/commit/3dc1e765e98b90d1e0d954c987db3497294f9bef))


- **(swc_common)** Allow `dylib` (#2628) ([04238d0](https://github.com/swc-project/swc/commit/04238d0b932f0efd8ac8ae262174ebc18469fa6f))

### Miscellaneous Tasks
- **general**: Use form for issues (#2595) ([a278eff](https://github.com/swc-project/swc/commit/a278eff5ee0307d56b426d6029d9ac77fd8d1c55))- **general**: Fix syntax of github issue template (#2596) ([c05f35d](https://github.com/swc-project/swc/commit/c05f35d5f1c89cdcbeb70000020a8eefa59316cd))- **general**: Update playground link in the issue form (#2621) ([f8c7d36](https://github.com/swc-project/swc/commit/f8c7d36ac9cb6d46de690e90a0399a1b01ca823b))- **general**: Improve version manager script ([3935400](https://github.com/swc-project/swc/commit/3935400a55109aa2c40906a8d8999574b3f99012))

### Refactor



- **(css/ast)** Use names from specification for ast types (#2643) ([20f4e21](https://github.com/swc-project/swc/commit/20f4e2148c752f2fb1200e935fde82aaa9e71b33))


- **(css/ast)** Rename `NamespacedName` to `TypeSelector` (#2642) ([c361982](https://github.com/swc-project/swc/commit/c36198296395fb0939791f192f1ba959add85873))


- **(css/lexer)** Refactor lexer to follow spec (#2593) ([b806551](https://github.com/swc-project/swc/commit/b806551ade204a11928a60b9d624174c084c0682))


- **(css/parser)** Refactor parser for at rules (#2617) ([cc5398b](https://github.com/swc-project/swc/commit/cc5398b1a6d915e04ed84298907dc90215c7c255))


- **(es/parser)** Deprecate `JscTarget` (#2600) ([3280b4c](https://github.com/swc-project/swc/commit/3280b4cd7a147cf72f517afa7a11cc5c39ccec06))- **general**: Move `HANDLER` to `swc_common` (#2599) ([e589d00](https://github.com/swc-project/swc/commit/e589d00f62c94065247b4eae69a09840e012dd34))

## [1.2.106] - 2021-10-31

### Bug Fixes



- **(css/parser)** Resolve some TODOs (#2572) ([47f7f1a](https://github.com/swc-project/swc/commit/47f7f1ad4fdf79f0ea6e406474cc518ee55a5d98))


- **(es/lexer)** Fix parsing of interpreter (#2589) ([52318a4](https://github.com/swc-project/swc/commit/52318a4a8e76897d3658b5a1b1b0b0d4c55acd87))


- **(es/minifier)** Fix minifier (#2564) ([4b2903e](https://github.com/swc-project/swc/commit/4b2903e3b4d212562df55639b1e50b1e50faecbf))


- **(es/minifier)** Fix block unwrapping issue (#2570) ([69cfa98](https://github.com/swc-project/swc/commit/69cfa98c5031f01c5267caa6f833c8a485877982))


- **(es/transform/react)** Allow multiple JSX pragmas in single `Comment` (#2561) ([3f5c826](https://github.com/swc-project/swc/commit/3f5c826251e54370094b65b482551401d35310de))


- **(es/transforms/cjs)** Allow reassignment to exported functions (#2569) ([7cc51be](https://github.com/swc-project/swc/commit/7cc51beb450b6c0160693e37a3fb5616682881ab))


- **(swc)** Use standard base64 charset for inlined source maps (#2585) ([4327d11](https://github.com/swc-project/swc/commit/4327d11d416fe6b9e752cfd45b68185af84ea596))

### Features



- **(css/ast)** Add `value` to the whitespace token (#2533) ([4f04736](https://github.com/swc-project/swc/commit/4f0473616d0a61796b8f24384290065fceb3b4ae))


- **(css/ast)** Add `SquareBracketBlock` (#2573) ([f77d6ce](https://github.com/swc-project/swc/commit/f77d6ceb00639c605d5137373321a1d5a6dc10b3))


- **(css/parser)** Use `Function` token. (#2571) ([67c0d4c](https://github.com/swc-project/swc/commit/67c0d4cc37af3c3bf98a83b051cadc017be60e8f))


- **(es/transforms/regenerator)** Allow configuring import path (#2581) ([33bc3d2](https://github.com/swc-project/swc/commit/33bc3d2b91f5f85dc1375d568b7a1e2ca2397749))


- **(es/transforms/testing)** Reduce CI time by caching execution result (#2565) ([0364f9a](https://github.com/swc-project/swc/commit/0364f9a2aee0fc300153f4e2ed61909bd4ec2f7c))

### Miscellaneous Tasks



- **(ci)** Don't use push action ([b197eb6](https://github.com/swc-project/swc/commit/b197eb65afad1b73109641a53112e230b98a8ea5))- **general**: Fix failing tests and improve CI scripts (#2563) ([7e29685](https://github.com/swc-project/swc/commit/7e29685a1766a3a0fd4b03766e6a96ac24054f6e))- **general**: Fix CI script for PRs (#2575) ([a6af0ab](https://github.com/swc-project/swc/commit/a6af0ab30f45d72890ecbed40e3c5d7b91ab4f37))- **general**: Make `cargo test --all` work (#2580) ([f9a8ad3](https://github.com/swc-project/swc/commit/f9a8ad386d5feafb48756764982f6843f6adaca3))- **general**: Fix typo (#2586) ([ef3c9a7](https://github.com/swc-project/swc/commit/ef3c9a7422ef62d6a767dd96882f024d47aad1de))- **general**: Manage crate version using github action (#2587) ([f997bc4](https://github.com/swc-project/swc/commit/f997bc4889473399462173b4ba043e5b93d8bc6c))- **general**: Fix script for managing crates (#2588) ([d63553e](https://github.com/swc-project/swc/commit/d63553e5d741b9fd307efdf1570cbefef0f60dd6))- **general**: Fix crate manager script ([bab638c](https://github.com/swc-project/swc/commit/bab638c5e8887febaa061358f889a646cab41580))- **general**: Fix permission issue ([ceb025b](https://github.com/swc-project/swc/commit/ceb025b735607ff8094e2cde5ec8050d05ead871))- **general**: Fix musl target ([dfd8d1a](https://github.com/swc-project/swc/commit/dfd8d1ad61675d8de0c96df96b04b6c13540ed3a))- **general**: Use ubuntu-18.04 for musl ([e3b8e53](https://github.com/swc-project/swc/commit/e3b8e5324bf6d3ea42fc92b70e9f37db28ba6a6a))

### Performance



- **(node/swc)** Parse input using worker thread (#2590) ([db09bce](https://github.com/swc-project/swc/commit/db09bce687bab9771e041808c8db483f0014d34a))

### Ci
- **general**: Sync to latest napi workflow (#2592) ([1a659d3](https://github.com/swc-project/swc/commit/1a659d32141daa9ce4c2f190722489d337c3665a))

## [1.2.105] - 2021-10-28

### Bug Fixes



- **(es/minifier)** Don't treat catch clause as a scope (#2557) ([79a426e](https://github.com/swc-project/swc/commit/79a426e0d8b291c2acccbc8fa3074d8304be43fd))

### Features



- **(css/ast)** Add `raw` to the hash value (#2535) ([303cecb](https://github.com/swc-project/swc/commit/303cecbefcd0bb0beb1c830edfae87f6bccb9095))


- **(es/parser)** Enable ergonomic brand checks for TypeScript (#2562) ([7b4af43](https://github.com/swc-project/swc/commit/7b4af435f24e475889c3020288796624577b352a))

### Miscellaneous Tasks
- **general**: Pulbish ([7fae0bb](https://github.com/swc-project/swc/commit/7fae0bb979ec5725f97012c75527cfe4a0099aa1))- **general**: Fix ci script ([a6fcfe1](https://github.com/swc-project/swc/commit/a6fcfe1ddd5a58e8c3d1b67bfb2fac21b0aeefe2))- **general**: Fix typo ([5469457](https://github.com/swc-project/swc/commit/54694571b90102ceb60617f5203fbf93b778d328))- **general**: Fix publish scripts ([ac02f3f](https://github.com/swc-project/swc/commit/ac02f3f3faabff6466b1a5e5b5fbf91cc3573118))

## [1.2.104] - 2021-10-27

### Bug Fixes



- **(es/fixer)** Preserve more parens (#2553) ([97b5a73](https://github.com/swc-project/swc/commit/97b5a738c2735c9b689123f402cda4c286b53691))


- **(es/minifier)** Fix minifier (#2528) ([dcf5f05](https://github.com/swc-project/swc/commit/dcf5f051950ccdc26b65dc01d6f0ea8ab2bcd689))


- **(es/minifier)** Fix minifier (#2551) ([f81b60f](https://github.com/swc-project/swc/commit/f81b60fd1bd2015701f5c23abb0a0680e8da761a))


- **(es/transforms/react)** Revert #2542 (#2552) ([5f0524c](https://github.com/swc-project/swc/commit/5f0524c54e63e4c33839763ad3b2feee78b7e8a1))


- **(es/transforms/typescript)** Remove `declare`d class properties (#2530) ([693181e](https://github.com/swc-project/swc/commit/693181ee6a7fc65783af174fdc10162f49d333be))


- **(swc)** Fix bugs (#2538) ([b8933e3](https://github.com/swc-project/swc/commit/b8933e3db983f5b9e381fc68e25c210d62eb41bb))


- **(swc)** Allow overriding specified parser config using `.swcrc` (#2547) ([8494f65](https://github.com/swc-project/swc/commit/8494f6583c76014ea0d2413a34660c2bd22e2aee))

### Features



- **(es/transforms/react)** Improve development more (#2542) ([70f5583](https://github.com/swc-project/swc/commit/70f55833e9a19a62257806e79225bda896d90396))

### Miscellaneous Tasks
- **general**: Remove useless submodules (#2537) ([265084c](https://github.com/swc-project/swc/commit/265084c41ed1b484c0f7d486d56b71db8d6cc9d1))- **general**: Configure kodiak ([2febd77](https://github.com/swc-project/swc/commit/2febd77c56137406e0fc5467ff3315aebb088f2f))- **general**: Disable freebsd build to publish ([e3869f1](https://github.com/swc-project/swc/commit/e3869f1d27c2e4a518d9ba5468d08f58e6e8f18e))

### Performance



- **(es/minifier)** Make name mangler parallel (#2527) ([a099e8f](https://github.com/swc-project/swc/commit/a099e8f846194109a801a958e28d7971be6368b1))

### Refactor



- **(css/ast)** Rename types (#2532) ([0e45877](https://github.com/swc-project/swc/commit/0e458778ec4bab29d9ade155bd2ccf8ac21eba22))


- **(css/codegen)** Use `raw` instead (#2534) ([5ef6686](https://github.com/swc-project/swc/commit/5ef66860292adf9bc2714bc0a4f3f3f5815a724d))


- **(css/parser)** Fix parsing of some selectors (#2525) ([6876b1b](https://github.com/swc-project/swc/commit/6876b1b26c2d380264efb5517e25c4cbfb282dc4))

### Ci
- **general**: Limit number of runs in graph (#2540) ([edc97ef](https://github.com/swc-project/swc/commit/edc97ef540e74d1be3065039f06c7302615bad4f))

## [1.2.103] - 2021-10-25

### Bug Fixes



- **(bundler)** Fix name of helper (#2518) ([5afedf8](https://github.com/swc-project/swc/commit/5afedf83c96eff47a22c93b2ca98d8a5bc72f0ec))


- **(bundler)** Fix bundler (#2510) ([cead404](https://github.com/swc-project/swc/commit/cead404a537658ee688922aa087abd61bd1681fd))


- **(es/minifier)** Fix minifier using `Deno` test suite (#2503) ([9e21576](https://github.com/swc-project/swc/commit/9e215769cc443410a6ef84b965b7302d039030b6))


- **(es/minifier)** Improve name mangler (#2509) ([fce3b79](https://github.com/swc-project/swc/commit/fce3b79e790d855f26711a4eef9bd88e67b206fc))


- **(es/transforms/compat)** Change error message (#2500) ([52dfb55](https://github.com/swc-project/swc/commit/52dfb558166e1a97127db13f0442d71083173b5c))


- **(es/transforms/compat)** Fix `async_to_generator` (#2526) ([e7189fb](https://github.com/swc-project/swc/commit/e7189fbdbd131bf2aa452e6d6899327cb9382158))


- **(es/transforms/optimization)** Fix `inline_globals` (#2524) ([709b3c7](https://github.com/swc-project/swc/commit/709b3c7cd62ca8818e3856d8dc3faf5bade02a1d))


- **(es/transforms/react)** Fix hygiene of react fast refresh (#2501) ([175c997](https://github.com/swc-project/swc/commit/175c9976769346e99f277eea3055fe1cfe38aafa))


- **(es/transforms/typescript)** Fix `strip` (#2496) ([c29a6e1](https://github.com/swc-project/swc/commit/c29a6e11c9c791aeb5467a84890842d8f7fb5dbe))

### Features



- **(css/ast)** Add `Percent` token (#2482) ([e327c9a](https://github.com/swc-project/swc/commit/e327c9a502089357de573b950414ddd67d92a6f7))


- **(es/babel)** Support `babelify` of static blocks (#2504) ([91717c9](https://github.com/swc-project/swc/commit/91717c9c5f1a734bd6f2edb95de748ccd87050e4))


- **(es/transforms)** Move `class_properties` to `es2022` (#2512) ([ecd617a](https://github.com/swc-project/swc/commit/ecd617af394181b62f177415e47b4d89ecc9648c))


- **(es/transforms)** Move stage 4 proposals to `es2022` (#2519) ([65c83e8](https://github.com/swc-project/swc/commit/65c83e8cb427105025ee3ed1608c6da675040d03))


- **(es/transforms/compat)** Add single-property optimization to `destructuring` (#2511) ([f33d321](https://github.com/swc-project/swc/commit/f33d3218cdec8d325c934791d74cd920796efa98))


- **(es/transforms/module)** Fix transform of `this` for classes (#2514) ([c482162](https://github.com/swc-project/swc/commit/c4821622067a570fcfc8a945ebcfbb778dd5e567))


- **(swc)** Add `browserslist` to `optionalDependencies` (#2515) ([4abde38](https://github.com/swc-project/swc/commit/4abde38dd78fb1885b0acfcdd90be50795628f9d))

### Refactor



- **(css/parser)** Respect spec (#2487) ([430a06c](https://github.com/swc-project/swc/commit/430a06ce4ddf4e0ee96176789df86ed5df137702))

### Testing



- **(es/minifier)** Add a test for `moment.js` (#2522) ([a8b29b6](https://github.com/swc-project/swc/commit/a8b29b662e7baecc2fd3366bfb2af5fc4c96fe54))


- **(es/transforms/compat)** Add tests for `optional_catch_binding` (#2502) ([a9869e6](https://github.com/swc-project/swc/commit/a9869e60f2e8feb0fbcbbba693bc86a14dbeb83f))

### Ci
- **general**: Re-enable FreeBSD build (#2497) ([1b91d55](https://github.com/swc-project/swc/commit/1b91d55277ddc9fb7eed3de5345f14c70f85e2fe))

## [1.2.102] - 2021-10-21

### Bug Fixes



- **(css/parser)** Fix parsing of url (#2484) ([d83bde8](https://github.com/swc-project/swc/commit/d83bde8ca5be3536632a51c9143f414879aeaf13))


- **(es)** Fix simple bugs (#2495) ([eef3d6e](https://github.com/swc-project/swc/commit/eef3d6e3fbbf334810a8f908f9da63fe74c7caaf))


- **(es/minifier)** Fix regexp handling (#2489) ([7c5b6ca](https://github.com/swc-project/swc/commit/7c5b6cafd8fbb50d0e6506cb4b29d9ca8c8278c0))


- **(es/minifier)** Fix `join_vars` (#2494) ([cef2c86](https://github.com/swc-project/swc/commit/cef2c8666e5b3159421d49667a20db2023743d52))


- **(es/parser)** Fix parsing of a property named `async` (#2485) ([3886eed](https://github.com/swc-project/swc/commit/3886eeddd53147ce2d8b95ba86cf4ffd98342a5d))


- **(es/transforms/base)** Reimplement `hygiene` (#2408) ([26944e1](https://github.com/swc-project/swc/commit/26944e159d91f03f20319cc5ac692b5eb3344c00))

### Features



- **(css/ast)** Add `Function` token (#2491) ([b62dc60](https://github.com/swc-project/swc/commit/b62dc60c5d9c70c96a1245b4f300e9cd15f9567a))


- **(es/trasform)** Support static blocks (#2474) ([bb1cc97](https://github.com/swc-project/swc/commit/bb1cc974c71d61b8c3b174d2475db62a18c8e0a9))


- **(swc)** Allow removing filename from error output (#2498) ([ecf0d75](https://github.com/swc-project/swc/commit/ecf0d7507ce4d25cd44c081c9874928c52340efc))

### Miscellaneous Tasks



- **(ci)** Prevent benchmark from marking PR as failed (#2488) ([eef63ca](https://github.com/swc-project/swc/commit/eef63ca6dbbe982e9a44ff9693d8ab27db8bd572))

## [1.2.101] - 2021-10-19

### Bug Fixes



- **(css/ast)** Use correct type for units (#2464) ([5234530](https://github.com/swc-project/swc/commit/5234530cd5aca55a72f7c0530d222acdd1a5f73c))


- **(es/minifier)** Fix minifier (#2477) ([0020e16](https://github.com/swc-project/swc/commit/0020e163702ce82a7dd8360391ef8fd8b0b43130))


- **(es/transforms/compat)** Fix handling of private static properties (#2478) ([9b96885](https://github.com/swc-project/swc/commit/9b96885171ca0b820ba04193b2f3a0b177cd5195))


- **(swc)** Change default value of `inlineSourcesContent ` (#2471) ([ee880d6](https://github.com/swc-project/swc/commit/ee880d63aede35b54529ca861542826fd80617ce))

### Features



- **(es/transforms/optimization)** Support inlining of `typeof`s (#2473) ([2ca6e5d](https://github.com/swc-project/swc/commit/2ca6e5d79bedbae9df88d45aa16771996d467c47))


- **(es/transforms/optimization)** Improve `inline_globals` (#2479) ([b0361ca](https://github.com/swc-project/swc/commit/b0361caa582600074962c2b80a442421d2ab5a4f))

### Miscellaneous Tasks
- **general**: Fix typo (#2472) ([123c1f5](https://github.com/swc-project/swc/commit/123c1f5d020d1c885bbde6db8551af654356c442))

### Performance



- **(es/parser)** Make typescript parser faster (#2483) ([bf886ba](https://github.com/swc-project/swc/commit/bf886bac73ad348ab7bc333e6eae824c96e9abde))

## [1.2.100] - 2021-10-19

### Bug Fixes



- **(common)** Fix sourcemap (#2457) ([9ba68c6](https://github.com/swc-project/swc/commit/9ba68c68639916b48b79ad831e3cf69d7b0c8051))


- **(es)** Fix bugs (#2469) ([c9437d3](https://github.com/swc-project/swc/commit/c9437d32265f322275bcfef5bd85149bd5bc7600))


- **(es/minifier)** Check for conditional usages while inlining (#2459) ([06ca25f](https://github.com/swc-project/swc/commit/06ca25f3d040af319e6f6cbc99db6b34bffdb495))


- **(es/regenerator)** Fix for nested try (#2463) ([201c0fc](https://github.com/swc-project/swc/commit/201c0fcfd04182533f005f2b251d896e1de63517))


- **(es/transforms/compat)** Fix regenerator (#2460) ([5bcabb0](https://github.com/swc-project/swc/commit/5bcabb047172743bd21267094dfb15d63491a196))

### Features



- **(swc)** Accept map for `envs` (#2467) ([28f2c7a](https://github.com/swc-project/swc/commit/28f2c7ae5d4602c36aac610aab60986805f17678))

### Miscellaneous Tasks
- **general**: Add `include` to `swc` ([ac77240](https://github.com/swc-project/swc/commit/ac772403b2eb51c0fe013e2fe56685a5df0389a5))- **general**: Add CI steps for combined benchmark data (#2458) ([8c0c250](https://github.com/swc-project/swc/commit/8c0c250249e9a14a14e653c9e55f6e233d3537a5))

### Performance



- **(es/transforms)** Improve performance (#2454) ([575aa44](https://github.com/swc-project/swc/commit/575aa44c25c4815014ea420bea838d9f0dccda56))

### Testing



- **(es)** Use typescript test suite as a golden testing (#2456) ([675c0e7](https://github.com/swc-project/swc/commit/675c0e714fc198e5cb18223d718739193a1a8bfc))


- **(es)** Freeze as `es2015` to verify base transforms (#2468) ([01e171a](https://github.com/swc-project/swc/commit/01e171a4b45f3217d034174419269311885abb35))

## [1.2.99] - 2021-10-17

### Bug Fixes



- **(css/parser)** Fix parsing of numbers (#2444) ([4f2dbd8](https://github.com/swc-project/swc/commit/4f2dbd816c12b9e5f86883d326e576d429f61b9d))


- **(es/codegen)** Escape backtick of synthesized template literals (#2453) ([de368f6](https://github.com/swc-project/swc/commit/de368f6bb7656ca6a9a540e59e4ccf700806e52a))


- **(es/minifier)** Fix minification of react hooks (#2450) ([63ad4b4](https://github.com/swc-project/swc/commit/63ad4b432272718f52e515b5f9c69c6f85175389))

### Performance



- **(es/transforms)** Reduce usage of `#[fast_path]` (#2442) ([1645bb3](https://github.com/swc-project/swc/commit/1645bb30b70f84898d1e5b1ab29c02f031628e5d))


- **(es/transforms)** Make transforms parallel (#2449) ([3d204b4](https://github.com/swc-project/swc/commit/3d204b44f0883bfe6ac6542eced2d9ce46ef3291))

## [1.2.98] - 2021-10-16

### Bug Fixes



- **(es)** Fix bugs (#2447) ([ee9177b](https://github.com/swc-project/swc/commit/ee9177b75336b8db3e8376aacd25aecfdfb1cdd7))


- **(es/transforms/base)** Fix `resolver` (#2448) ([7ab07ab](https://github.com/swc-project/swc/commit/7ab07ab0b9ae2151613a5e0a9a948342204eaa60))

### Features



- **(css)** Add `BadUrl` token (#2426) ([c2ce89c](https://github.com/swc-project/swc/commit/c2ce89c0fb4d5832c05e1a495dd7e78507402030))


- **(css/parser)** Allow invalid line comments (#2443) ([7f04ef4](https://github.com/swc-project/swc/commit/7f04ef47155cb8ec06eb4296d8c3c915c79221d6))

## [1.2.97] - 2021-10-15

### Bug Fixes



- **(css/ast)** Fix delimiter token (#2415) ([e2e4f2f](https://github.com/swc-project/swc/commit/e2e4f2f64f59f9fa98c521dda223bf3d7fef3490))


- **(es/codegen)** Fix codegen of synthesized template literals. (#2440) ([d045244](https://github.com/swc-project/swc/commit/d0452440895be0d02b85d6892eddba0a9d6193f5))


- **(es/minifier)** Fix bugs (#2433) ([0e48284](https://github.com/swc-project/swc/commit/0e48284afb30fc08f51c46788bc25c2817df7dc3))


- **(es/transforms/proposal)** Fix type detection (#2431) ([f899584](https://github.com/swc-project/swc/commit/f8995848b89acc0d08ad0ba6370f28a364c79cd1))

### Features



- **(es/transforms/module)** Add an option to preserve dynamic imports (#2441) ([130a47f](https://github.com/swc-project/swc/commit/130a47f42cfcae7dcdb83677b8a7ed29c0cc246a))

### Miscellaneous Tasks



- **(doc)** Add an example of stripping out types (#2430) ([647d3ed](https://github.com/swc-project/swc/commit/647d3ed36a63a541061930e34daa5705f4ff468e))- **general**: Check for issues already fixed (#2429) ([a25d67b](https://github.com/swc-project/swc/commit/a25d67bfbfdc8258df5ed98eb7803bd79d9d261e))

### Performance



- **(es/codegen, es/parser)** Improve performance (#2406) ([4c983e9](https://github.com/swc-project/swc/commit/4c983e9158d01d6ca510ba6457931fa1a2e99d1b))


- **(es/transforms)** Reduce usage of `#[fast_path]` (#2439) ([e722bd4](https://github.com/swc-project/swc/commit/e722bd4887e19f871238b7301640f89ba404775c))

### Refactor



- **(css/ast)** Use `delim` token (#2425) ([93a7a17](https://github.com/swc-project/swc/commit/93a7a17472ec81b1ce23385270e46d767cb851f2))

## [1.2.96] - 2021-10-14

### Bug Fixes



- **(css/parser)** Fix parsing of comments (#2414) ([f7b065e](https://github.com/swc-project/swc/commit/f7b065ef0b4d7efa08138cbf97b718c401484795))


- **(dev/cli)** Remove CLI from main swc repositoy (#2393) ([897f4b6](https://github.com/swc-project/swc/commit/897f4b670eba7f7445b0cab7c481a7baf8da70c6))


- **(es)** Fix bugs (#2403) ([6366d05](https://github.com/swc-project/swc/commit/6366d05fd31b15d195d464fc253e7ac96a5cc80a))


- **(es/minifer)** Fix handling of callable expressions (#2379) ([ab687a0](https://github.com/swc-project/swc/commit/ab687a0f98c823196fdcfe415f4a82dca32382df))


- **(es/minifer)** Fix bugs (#2397) ([98cc79a](https://github.com/swc-project/swc/commit/98cc79a2becb2218c5c4dffced12838dc5bf844c))


- **(es/minifier)** Fix iteration order (#2412) ([62f7f65](https://github.com/swc-project/swc/commit/62f7f655a9720a6867b549004fee291f9266597e))


- **(es/minifier)** Fix infinite loop (#2424) ([aff6670](https://github.com/swc-project/swc/commit/aff66708564fc13fe1b26f922596a9ab7850ec3b))


- **(es/parser)** Allow using `async` as the first one in parameters (#2386) ([2379fe1](https://github.com/swc-project/swc/commit/2379fe1ce064c84666939c006a172cb6c84c3bdf))


- **(es/parser)** Allow using `async` as the first one in parameters (#2388) ([be3dca2](https://github.com/swc-project/swc/commit/be3dca295ba410bd287aa4ebeb53af8c9ec74bee))


- **(es/parser)** Allow `async` in `TsAsExpr` (#2395) ([4458f9c](https://github.com/swc-project/swc/commit/4458f9c74d1ea3a738bb8e66dfef735e8ae1e5a0))


- **(es/parser)** Fix async function in `SeqExpr` (#2399) ([d7f570f](https://github.com/swc-project/swc/commit/d7f570ff7c930c9de2aea26930566c866a68aa36))


- **(es/parser)** Ensure that comments are collected (#2407) ([4d47711](https://github.com/swc-project/swc/commit/4d4771109a78b8217df318af08bb323795277f87))


- **(es/parser)** Fix class getter/setter ASI bugs (#2409) ([9446a03](https://github.com/swc-project/swc/commit/9446a037cb3aed59a59c970cc49a1c83cd9fa1d6))


- **(es/transforms)** Fix for react + typescript (#2422) ([76de513](https://github.com/swc-project/swc/commit/76de51333dc87e5b1c0db18b5691338279346eb7))


- **(es/transforms/base)** Fix `hyigiene` (#2421) ([8074c72](https://github.com/swc-project/swc/commit/8074c72ce926c66b88588643189b4362e2683877))


- **(es/transforms/react)** Fix escape of quote in HTML entities (#2419) ([029cf05](https://github.com/swc-project/swc/commit/029cf056f28a9526395e00683071690b7b08dcbe))


- **(es/transforms/testing)** Fix `test_fixture` (#2400) ([f560789](https://github.com/swc-project/swc/commit/f5607891e4a4cc123e62f504c9a89e0d2e507670))


- **(swc)** Fix bugs (#2396) ([ff2baf7](https://github.com/swc-project/swc/commit/ff2baf75b4ea5ce3fc15cdba1a817413d8fedc65))


- **(swc)** Fix order of passes (#2427) ([51d7a14](https://github.com/swc-project/swc/commit/51d7a144bb8ca477f430d6c6200112c36e281b91))

### Features



- **(css/ast)** Add `raw` to `Str` (#2295) ([a5592e3](https://github.com/swc-project/swc/commit/a5592e3207e4ad5eaf89d926ec0aaa130ef311a7))


- **(css/ast)** Add `raw` to `Url` (#2389) ([2678c34](https://github.com/swc-project/swc/commit/2678c34488fc455fabe7228147510031230f5a66))


- **(css/ast)** Add delim token (#2398) ([fb4869f](https://github.com/swc-project/swc/commit/fb4869f413c5d32557dbf2567ed71244a08ca344))


- **(plugin/api)** Determine plugin api (#2199) ([7a31a3f](https://github.com/swc-project/swc/commit/7a31a3f53083a20b7719a1b448bd6209e93d45fd))

### Miscellaneous Tasks



- **(plugin)** Publish ([fd08a27](https://github.com/swc-project/swc/commit/fd08a27f0c1965f8a9f6760c153d09b19f70c48d))- **general**: Fix CI script for publising ([5fb5a70](https://github.com/swc-project/swc/commit/5fb5a7058fab29539ed414522abb78670392ce51))- **general**: Disable freebsd to publish ([267d639](https://github.com/swc-project/swc/commit/267d639c2e28adc8409df4a5b74beba8b64eec43))

### Performance



- **(atoms)** Update `string_cache` (#2411) ([4411d1d](https://github.com/swc-project/swc/commit/4411d1d3a5cd9b05103b5c0a1fd60eb7d096ee50))


- **(bundler)** Improve performance (#2384) ([ac3fbd9](https://github.com/swc-project/swc/commit/ac3fbd91acec2aab1fb263121b4187ce7390a037))


- **(bundler)** Improve performance (#2394) ([b5f8321](https://github.com/swc-project/swc/commit/b5f832193a2cfb7dc594d526c049edc66cfccccc))


- **(es/transforms/base)** Make `resolver` faster (#2392) ([a330322](https://github.com/swc-project/swc/commit/a33032279aa4cee19f10a74d72eb3b308f901df1))

### Refactor



- **(es/parser)** Simplify parsing logic (#2405) ([4ad25d2](https://github.com/swc-project/swc/commit/4ad25d2155028dce44e05dc1fb8f1d1d2e0c9d75))


- **(es/parser)** Cleanup codes for the comment buffer (#2410) ([d114e7d](https://github.com/swc-project/swc/commit/d114e7d3643a0adc0f75e2664667f5990ea50317))

### Testing



- **(css/parser)** Add tests for comments (#2364) ([a36f8e4](https://github.com/swc-project/swc/commit/a36f8e42bdf23974ae9118b1798f2071bb0f8312))

## [1.2.95] - 2021-10-09

### Bug Fixes



- **(css)** Change the type of the source of `@import` rules. (#2363) ([cf1235e](https://github.com/swc-project/swc/commit/cf1235ece10ec889aac6eddc49b879e2c44f4e80))


- **(es/codegen, es/transforms/typescript)** Fix bugs (#2383) ([2c058cb](https://github.com/swc-project/swc/commit/2c058cb124d0f53a9de3e6e441f935b2451aa29d))


- **(swc)** Fix `sourceMap` option of minify (#2380) ([486c689](https://github.com/swc-project/swc/commit/486c68950439844e051923fe40be0c5f27468f70))

### Refactor



- **(es/parser)** Simplify parsing logic (#2381) ([644e49c](https://github.com/swc-project/swc/commit/644e49c7faa6cd6f037787662727edeff393c1a7))

## [1.2.94] - 2021-10-08

### Bug Fixes



- **(css/parser)** Fix parsing of funxtion named `url` (#2350) ([6863d96](https://github.com/swc-project/swc/commit/6863d9624ecec469d1f8905853e5e5c60837fd15))


- **(es/minifier)** Don't optimize `new String`. (#2341) ([8403057](https://github.com/swc-project/swc/commit/840305726875f250babe254d16e9f01e36305477))


- **(es/minifier)** Fix inlining into shorthand properties (#2348) ([87b20a8](https://github.com/swc-project/swc/commit/87b20a8896c1b838d236b77259a84e5b80f30640))


- **(es/minifier)** Fix minifier (#2355) ([9e6a1f4](https://github.com/swc-project/swc/commit/9e6a1f431b3024d75531fdc330019f3e2db3ae46))


- **(es/parser)** Report errors for multiple array elements without comma (#2366) ([521e671](https://github.com/swc-project/swc/commit/521e6717ad0449117cfd230c41696f52fe572a78))


- **(es/parser)** Report errors for array patterns without comma (#2365) ([d65ce85](https://github.com/swc-project/swc/commit/d65ce85030b2b35875c3bc69b40f0f9ec32e24cf))


- **(es/transforms/optimization)** Fix `dead_branch_remover` (#2373) ([1f99c3a](https://github.com/swc-project/swc/commit/1f99c3a44cab4faed5f5ddfe08f6b1a6da80f167))


- **(es/transforms/react)** Allow non-first jsx directives (#2377) ([4466ca6](https://github.com/swc-project/swc/commit/4466ca6ab83b7ae6608a36d53d8b46366250dba1))


- **(es/trasnforms/testing)** Improve `test_fixture` (#2369) ([7a19fc6](https://github.com/swc-project/swc/commit/7a19fc6e8c61a5b59a56b4a598efec066022dc2e))


- **(es/utils)** Fix macros (#2349) ([b64afb5](https://github.com/swc-project/swc/commit/b64afb5b6f3ccf019b8217408383a44aa3261bea))


- **(node/bundler)** Prevent spreading string into return (#2335) ([f426166](https://github.com/swc-project/swc/commit/f42616698c3fd5c8bf86421c92c33f3f6e43c05c))


- **(swc)** Fix order of custom passes (#2347) ([6d35e7c](https://github.com/swc-project/swc/commit/6d35e7c28d5b7d749624598f2213795cd56758ad))


- **(swc)** Fix order of custom passes (#2367) ([edc4cb4](https://github.com/swc-project/swc/commit/edc4cb432e0fbe01061cbda00a2636a77492839d))


- **(swc)** Fix `swc` as a crate (#2376) ([656f3e9](https://github.com/swc-project/swc/commit/656f3e944df7ec8d9f1ab7ac2745c0d4dde3e605))


- **(testing)** Fix CRLF issue on windows (#2338) ([20171a3](https://github.com/swc-project/swc/commit/20171a3654977d8a886f25cf687c2f1aae4dd0ae))

### Documentation



- **(es/ast)** Document identifier mangagement system (#2371) ([b0ee954](https://github.com/swc-project/swc/commit/b0ee9543d4e9da88cfb17fd0d24b819e73c3b6ce))

### Features



- **(babel/compat)** Support type-only import/export specifiers (#2342) ([ef4c80b](https://github.com/swc-project/swc/commit/ef4c80be7dd0481c1bebcbf9ca47e55595524c64))


- **(css)** Add error recovery for tokens in selector positions (#2357) ([3714802](https://github.com/swc-project/swc/commit/3714802bd308d01acf9f11bd8a3240cf7bd790ec))


- **(css/ast)** Add raw to `Text` (#2361) ([4ff1b75](https://github.com/swc-project/swc/commit/4ff1b7568c825165fec22df3c66e5227c6d7f11b))


- **(es/codegen)** Expose more API (#2375) ([500dbf2](https://github.com/swc-project/swc/commit/500dbf244b3caee28438acc1b2e42b743b9af119))


- **(swcpack)** Enable concurrent mode (#2356) ([d0342a5](https://github.com/swc-project/swc/commit/d0342a5a584fd55c2b4131f53bc36c6f71252716))

### Miscellaneous Tasks



- **(ci)** Add a CI script to publish from github actions (#2353) ([305f90c](https://github.com/swc-project/swc/commit/305f90ce766bb39cd148f019166d1697069f004d))


- **(es/minifier)** Publish (#2354) ([a553451](https://github.com/swc-project/swc/commit/a55345156268e31b9f466150bf842a7026dd1269))- **general**: Improve documentation for rust users (#2340) ([bbefa0e](https://github.com/swc-project/swc/commit/bbefa0e57e54f18a21ac448148eb93012344d2df))- **general**: Setup workfllow to bump version (#2368) ([e2a0edd](https://github.com/swc-project/swc/commit/e2a0edd49d47e43f93716a6435fdd7eb2dac1405))

### Performance



- **(es/transforms)** Improve performance (#2329) ([fac6f47](https://github.com/swc-project/swc/commit/fac6f4786354f7896c2ca5a2b0f0532e0282cc93))

### Testing



- **(css/parser)** Combinators (#2359) ([f0be833](https://github.com/swc-project/swc/commit/f0be833f14f4477325706b70032492b679f2a8c1))


- **(css/parser)** Add tests for hex colors (#2360) ([1e9ecfb](https://github.com/swc-project/swc/commit/1e9ecfbad1beca1aa46ae556d9f6b539788d1b8c))

## [1.2.93] - 2021-10-01

### Bug Fixes



- **(css/parser)** Fix error recovery logic of property values (#2331) ([9f4c5b7](https://github.com/swc-project/swc/commit/9f4c5b7ba55a7310c410133e446790a4ad5ad99a))


- **(es)** Fix performance bugs (#2313) ([6a41e9a](https://github.com/swc-project/swc/commit/6a41e9a0bea739e55ca3f61e230b9ab07d6b6f3e))


- **(es/codegen)** Fix codegen of numbers (#2317) ([bd92d89](https://github.com/swc-project/swc/commit/bd92d8930619710cff97360870241bd44163a2b6))


- **(es/minifier)** Fix minifier (#2323) ([dad7392](https://github.com/swc-project/swc/commit/dad73926e6572b2395cabbe50668d149363e763b))


- **(swc)** Fix `try_with_handler` (#2315) ([2c50cde](https://github.com/swc-project/swc/commit/2c50cde8defdde0ecd8ce50795aa5f86bc6d4a9d))

### Features



- **(css/parser)** Implement more error recovery (#2316) ([ce40ff7](https://github.com/swc-project/swc/commit/ce40ff73a73891fb1b41aedf1f6a26ce867ed7a1))

### Miscellaneous Tasks
- **general**: Update rustc (#2332) ([a7357ab](https://github.com/swc-project/swc/commit/a7357ab51730322a55bde7161de629f9d6da118e))

### Performance



- **(common)** Avoid string re-allocation (#2318) ([fee270f](https://github.com/swc-project/swc/commit/fee270fe57ecc1822ed1d6b057e304290c5d8d9d))

## [1.2.92] - 2021-09-28

### Bug Fixes



- **(css)** Reexport codegen from `swc_css` (#2314) ([36c8312](https://github.com/swc-project/swc/commit/36c83127e8ccee1bd4378358e52171609b08c757))


- **(es/minifier)** Fix bugs (#2283) ([e8a1710](https://github.com/swc-project/swc/commit/e8a1710a2124f8474e20a0df212eb0c3b6bcc1dc))


- **(es/parser)** Report errors for multiple import/export specifiers without comma (#2302) ([83153a0](https://github.com/swc-project/swc/commit/83153a0f8588f30a72f59525d9605035c43af4a2))


- **(es/parser)** Improve error message (#2304) ([552fc23](https://github.com/swc-project/swc/commit/552fc2374d12476c81d11f7cf4362e0d8774bd1d))- **general**: Migrate dependencies (#2307) ([650e149](https://github.com/swc-project/swc/commit/650e1494d492a4129916b265aa688b1062fad119))

### Features



- **(css)** Recover from invalid properties (#2312) ([b206404](https://github.com/swc-project/swc/commit/b206404d94b7b2e6de1e69cb1c916320e20ac4ab))


- **(es)** Support type-only import/export specifiers (#2309) ([2b292e6](https://github.com/swc-project/swc/commit/2b292e6d176f0f561d49e85ada5459909feabc8b))


- **(es/parser, es/transform)** Implement ergonomic brand checking (#2079) ([e46a842](https://github.com/swc-project/swc/commit/e46a842e99bba7ff63957ddd199c1eb970440371))


- **(node/swc)** Add a named export for `Visitor` (#2291) ([2580f1a](https://github.com/swc-project/swc/commit/2580f1a3728ac3f739aefd7af27002fd686248fc))

## [1.2.91] - 2021-09-24

### Bug Fixes



- **(css/ast)** Fix typo (#2298) ([75c930c](https://github.com/swc-project/swc/commit/75c930caf19da8c15f118ce7a1dfc5c17ac0ea4f))


- **(css/parser)** Fix parsing of `!important` (#2286) ([2f4da9a](https://github.com/swc-project/swc/commit/2f4da9a8ff418aa7c131a3f4a8d7b2ee72bd2b95))


- **(es/parser)** Fix bugs (#2255) ([ca0d6dd](https://github.com/swc-project/swc/commit/ca0d6ddf2e1b0c9514938580fe95f3075f0dc1a5))


- **(es/transforms/base)** Fix `hygiene` (#2299) ([5e1003e](https://github.com/swc-project/swc/commit/5e1003ec4c310b3ce54c5a11dc0c3169826ba184))


- **(swc)** Fix simple bugs (#2292) ([1b2e670](https://github.com/swc-project/swc/commit/1b2e6706bdbe890cc4449876c3105342f3cfa9c5))

### Miscellaneous Tasks
- **general**: Improve docs (#2301) ([83d88ce](https://github.com/swc-project/swc/commit/83d88ce388ee8553af6507032630ddbc7a100d14))

### Testing



- **(css/parser)** Add tests for `@page` at-rule (#2296) ([2a565e8](https://github.com/swc-project/swc/commit/2a565e846451e6da93a963317d59c1979ec9ed00))


- **(css/parser)** Add tests for comments in selectors (#2293) ([8af2173](https://github.com/swc-project/swc/commit/8af2173a33ac1fbb3283d28a77ff34c15dadbe37))

## [1.2.90] - 2021-09-23

### Bug Fixes



- **(es/transforms/base)** Fix `hygiene` (#2282) ([2156364](https://github.com/swc-project/swc/commit/215636412113bedb3a6554c455f36750a4f03c4d))


- **(node/swc)** Allow `JsMinifyOptions` type for `JscConfig.minify` (#2287) ([4846c32](https://github.com/swc-project/swc/commit/4846c3230396875ee5a7017c525aa64e788b3bb7))

### Miscellaneous Tasks
- **general**: Ignore linguist detection for fixtures (#2285) ([e538970](https://github.com/swc-project/swc/commit/e5389700e64f1e33fef9a59f6755a139b33ab41a))- **general**: Fix typo (#2288) ([dd3f18b](https://github.com/swc-project/swc/commit/dd3f18b760dd1922904677e8a3705a5187fbf140))

## [1.2.89] - 2021-09-21

### Bug Fixes



- **(css/parser)** Allow @at-rules to be lowercased (#2274) ([9eb45e8](https://github.com/swc-project/swc/commit/9eb45e851551fbaff325b575b5e76223c5630b3a))


- **(css/parser)** Fix parsing of url (#2280) ([b5ad03d](https://github.com/swc-project/swc/commit/b5ad03d0b179bdcf32f4aad64b760e4035cec0bf))


- **(es)** Fix bugs (#2256) ([ce01b8a](https://github.com/swc-project/swc/commit/ce01b8a9b7249a961e02ce7c4bb1c9ead8f314b5))


- **(es/codegen)** Fix codegen of ` in synthesized template literals (#2260) ([e2d8465](https://github.com/swc-project/swc/commit/e2d846556568dc43093ef61612230b7323416898))


- **(es/codegen)** Emit `static` before `readonly` (#2271) ([8e0a545](https://github.com/swc-project/swc/commit/8e0a5450b10f76a86069b2535e74e277bfa442ab))


- **(es/minifier)** Don't drop used variables (#2272) ([3f306f0](https://github.com/swc-project/swc/commit/3f306f0b795d599f4d4972543d990d654855d766))


- **(es/transforms/base)** Fix `hygiene` pass (#2266) ([180dc31](https://github.com/swc-project/swc/commit/180dc31550c4e12897ab4b0ad6b428e1e0d825b2))


- **(es/transforms/compat)** Move the optional catch binding pass to ES2019 (#2247) ([4d500ba](https://github.com/swc-project/swc/commit/4d500baaaa742529ecf1d2c514d6bde7a84c82fb))


- **(es/transforms/testing)** Fix comparing logic (#2263) ([f087d15](https://github.com/swc-project/swc/commit/f087d1515b7f5a729f89d258d23979636d98f997))


- **(swc)** Remove global side effects for rust users. (#2270) ([b82702c](https://github.com/swc-project/swc/commit/b82702cf0f845f7fce3d5d958a55f31df5b98bf6))


- **(wasm)** Fix bugs (#2279) ([e5f46a6](https://github.com/swc-project/swc/commit/e5f46a6800d6dc52f112789d4d8247846a0b136c))

### Features



- **(es/minifier)** Add CLI for debugging (#2273) ([406fa3f](https://github.com/swc-project/swc/commit/406fa3fc780eea0e26aa3f636643e6db7ee32b04))

### Miscellaneous Tasks
- **general**: Add discord server link to `README.md` (#2278) ([893fb08](https://github.com/swc-project/swc/commit/893fb087ae77fe5ab03cba5a67ce155123695441))

## [1.2.88] - 2021-09-16

### Bug Fixes



- **(es/transforms)** Fix bugs (#2249) ([6f33c32](https://github.com/swc-project/swc/commit/6f33c327cb3853e4d180ed997174636d3c5d42ab))

### Features



- **(es/minifer)** Improve minifier (#2229) ([20ce326](https://github.com/swc-project/swc/commit/20ce326909670d0e40c9f1bbd804387c2958eae6))

### Miscellaneous Tasks
- **general**: Add a link to github sponers ([ff389ca](https://github.com/swc-project/swc/commit/ff389ca8d2737875d0d1a220863815c6fe23bbb3))

## [1.2.87] - 2021-09-14

### Bug Fixes



- **(ci)** Publish (#2250) ([cab37f8](https://github.com/swc-project/swc/commit/cab37f816646f824b526fe8f888ac33953b24dbf))


- **(common, node/swc)** Allow inlining `sourcesContent` (#2245) ([48d6103](https://github.com/swc-project/swc/commit/48d61039d24aaef688bf0d573d6f6037366c5eec))


- **(es/transforms/compat)** Add `new.target` to `es5` (#2231) ([6e12ef0](https://github.com/swc-project/swc/commit/6e12ef0306c0aecdc25f2faeac8c29be7e563748))

### Features



- **(node/swc)** Enable tsx automatically based on the extension (#2230) ([4ca85ec](https://github.com/swc-project/swc/commit/4ca85ec79cc24ed11191668501c21626777c0b2a))

## [1.2.86] - 2021-09-11

### Bug Fixes



- **(ci)** Publish v1.2.86 (#2235) ([f78a504](https://github.com/swc-project/swc/commit/f78a5048066db357181e815ab5e3d7447ac7263a))


- **(css/parser)** Fix parsing of selectors (#2221) ([a9573b9](https://github.com/swc-project/swc/commit/a9573b9a5fe4be74d6b5fa96d812a18f623d0254))


- **(es)** Fix bugs (#2222) ([2c47778](https://github.com/swc-project/swc/commit/2c477780f05eb8272414bddf5e3a80e1bf086e85))


- **(es/loader)** Fix support for `jsc.paths`. (#2227) ([9eafd0c](https://github.com/swc-project/swc/commit/9eafd0c6c41f86c5244f7346ab22382212b7c1c4))


- **(swc)** Fix `target` (#2226) ([9ffe471](https://github.com/swc-project/swc/commit/9ffe47106a70150579b80d103bd1a0193e5b8483))

## [1.2.85] - 2021-09-09

### Bug Fixes



- **(css/parser)** Fix parsing of selectors (#2217) ([d8ae4c4](https://github.com/swc-project/swc/commit/d8ae4c4e901a42e94d600367da1ddf666e732f71))


- **(es/parser)** Fix parsing of static blocks (#2200) ([cbc8230](https://github.com/swc-project/swc/commit/cbc823031042638c99fd58692ac94527d1ab1852))


- **(swc)** Improve rust apis (#2197) ([77be9f6](https://github.com/swc-project/swc/commit/77be9f63b9fd2b400f6b1a767172d95d3260dc84))- **general**: Fix simple bugs (#2220) ([b4796d9](https://github.com/swc-project/swc/commit/b4796d9d54e31fdd5f29c8c1a43875dcb7bbf186))

### Features



- **(common)** Add variants to `FileName` (#2202) ([87f30b2](https://github.com/swc-project/swc/commit/87f30b21a34b41f567da4f3f28b7767fed0d76af))


- **(es/minifier)** Implement more rules (#2183) ([c8b46bf](https://github.com/swc-project/swc/commit/c8b46bf6dbe96f5e1e593e7b6be0bad371eb99da))

## [1.2.84] - 2021-09-01

### Bug Fixes



- **(es)** Fix easy bugs (#2178) ([c0b0337](https://github.com/swc-project/swc/commit/c0b0337d1df6093a62bc5eb806c68e1a2b4adb8e))


- **(es/loader)** Fix node resolver (#2172) ([5d70283](https://github.com/swc-project/swc/commit/5d702835e8c3623dfd604757d7a57f16ad672fb6))


- **(es/loader)** Improve handling of `base_dir` (#2182) ([361bc70](https://github.com/swc-project/swc/commit/361bc70065e3bf313a139a834106a933874f8ee1))


- **(es/parser)** Remove `static_blocks` from `TsConfig` (#2186) ([2f2e35a](https://github.com/swc-project/swc/commit/2f2e35af6968d432c1a4dee1664a5de89069a4c3))


- **(es/transforms)** Fix bugs (#2181) ([ee16139](https://github.com/swc-project/swc/commit/ee16139a1966bcbd6b8e52d58e06ce7d5a44b4f3))


- **(es/transforms/base)** Optimize `hygiene` (#2193) ([cb2b0c6](https://github.com/swc-project/swc/commit/cb2b0c671f9dec9a53df52aa34f9d8091ebecb98))

### Documentation



- **(common)** Improve doc of `Take` (#2192) ([55f065b](https://github.com/swc-project/swc/commit/55f065b78adcce9e69e96494543905b8038fd641))

### Features



- **(common)** Implement `TypeEq` and `EqIgnoreSpan` for tuples (#2184) ([d58642b](https://github.com/swc-project/swc/commit/d58642b70c5f789a72c7f932fb3676c371ec5323))


- **(es/minifier)** Implement static evaluator (#2176) ([11fe35d](https://github.com/swc-project/swc/commit/11fe35dbd149a928f814ca4032f9bce293c89098))


- **(es/parser)** Add tests for static blocks (#2180) ([b2c9971](https://github.com/swc-project/swc/commit/b2c99719fdf0549ff5a296c13747580b3a2f6e0c))


- **(es/parser, es/codegen, es/visit)** Support  static blocks in classes (#2130) ([a10118c](https://github.com/swc-project/swc/commit/a10118c90fa32d3b52a127411e5fe671c4eb19f3))- **general**: Expose `.take()` (#2190) ([a8cb554](https://github.com/swc-project/swc/commit/a8cb554be5dea1d06dc91b3b2d715682663e3549))

### Refactor



- **(es)** Use `BlockStmt` instead `Vec<Stmt>` for static blocks. (#2188) ([99c35ff](https://github.com/swc-project/swc/commit/99c35ff9800b3d04604800a98994758b5581b5de))

## [1.2.83] - 2021-08-27

### Bug Fixes



- **(es)** Fix source map (#2159) ([d975a19](https://github.com/swc-project/swc/commit/d975a197c906ba90485b6180ddcaf230f39170e0))


- **(es)** Fix some easy bugs (#2166) ([97514a7](https://github.com/swc-project/swc/commit/97514a754986eaf3a227cab95640327534aa183f))


- **(es/minifier)** Fix usage via yarn resolution (#2158) ([e468752](https://github.com/swc-project/swc/commit/e468752ebcf5819839ca77e6f276bb0b9a68967c))


- **(es/transforms/base)** Fix `await` expressions. (#2157) ([8c5daee](https://github.com/swc-project/swc/commit/8c5daeec2ad7ad9e52e40261f7f052a64ff48ac4))

### Features



- **(plugin)** Groundwork for rust plugin system (#1893) ([18e2232](https://github.com/swc-project/swc/commit/18e2232dbca69649963e076cc63f7829d18ec555))

### Refactor



- **(es/dep_graph)** Use `dyn` instead of `impl` (#2119) ([3d58457](https://github.com/swc-project/swc/commit/3d5845702707f4d668a099ac81f2eae85d2343e6))

## [1.2.82] - 2021-08-25

### Bug Fixes



- **(es/codegen)** Fix sourcemap (#2142) ([427df9a](https://github.com/swc-project/swc/commit/427df9a979dee9f0737c3234085a52f7a79ea19a))

### Features



- **(css/parser)** Improve parser api (#2147) ([8c57cf0](https://github.com/swc-project/swc/commit/8c57cf053757a3b20bac3ace73da1c4bd6815be4))


- **(es)** Reexport minifier from `swc_ecmascript` (#2146) ([584c44a](https://github.com/swc-project/swc/commit/584c44a490e88a8031dc0f5cdb4e6e54de06152d))

### Miscellaneous Tasks



- **(es/parser)** Update an error message (#2148) ([78a7c6b](https://github.com/swc-project/swc/commit/78a7c6befe68172df049a17b8810afc1a64f4a67))

## [1.2.81] - 2021-08-24

### Bug Fixes



- **(bundler)** Fix handling of reexports from cjs modules (#2143) ([b027824](https://github.com/swc-project/swc/commit/b0278242ba7b081ba1a48d221f955b4513a50a62))


- **(css)** Fixup (#2138) ([81061a9](https://github.com/swc-project/swc/commit/81061a91bbc50c340880e389ca21b090378d14d6))


- **(es/minifier)** Make use of hygiene optimizer (#2145) ([838a7a8](https://github.com/swc-project/swc/commit/838a7a8b33a29ff5ea9b4257c7ba257e6814acdc))


- **(es/transforms/compat)** Implement `new.tartet` (#2129) ([c78baef](https://github.com/swc-project/swc/commit/c78baef2ccecaca76ca973f57c834e00a25154bb))

### Features



- **(bundler)** Support replacing any environment variables (#2121) ([61e58d7](https://github.com/swc-project/swc/commit/61e58d732952a7324a13ae17a26dc9e4a043a8b9))


- **(css)** Groundwork for css processor (#2105) ([0d63470](https://github.com/swc-project/swc/commit/0d63470eba4766403389d67d8ef80e809a4f4af8))


- **(css)** Implement codegen for css (#2115) ([7381644](https://github.com/swc-project/swc/commit/7381644f6bdaad28d4e3a4d88876bd8c9d0667e0))


- **(css)** Port stylis (#2131) ([c05a724](https://github.com/swc-project/swc/commit/c05a724d8454aedb9ad3d4ffb6cbc5da51cd3d55))


- **(es/parser)** Report an early error for `await` used in wrong contexts (#2098) ([e3e2908](https://github.com/swc-project/swc/commit/e3e29081397363c3afdbf983dd94c63763f411c3))

### Miscellaneous Tasks
- **general**: Fix typo in type definition (#2116) ([91c239b](https://github.com/swc-project/swc/commit/91c239bc741a7770e637a7b413123427e7dfa4fe))- **general**: Fix typo (#2136) ([84cda8a](https://github.com/swc-project/swc/commit/84cda8a9f5d142c4af2bead63c65bb8b80f296f9))- **general**: Fix typo (#2135) ([1d71a8e](https://github.com/swc-project/swc/commit/1d71a8ea956e3da81532258676028859d49d1a50))

## [1.2.80] - 2021-08-19

### Bug Fixes



- **(swc)** Disable `aes` feature (#2109) ([6eaf60b](https://github.com/swc-project/swc/commit/6eaf60b8a4902228b758873e805032b696673493))

## [1.2.79] - 2021-08-19

### Bug Fixes



- **(es/codegen)** Fix codegen of `~` (#2104) ([6896a83](https://github.com/swc-project/swc/commit/6896a83d5493d45f7fb1399d151449c8de24678f))

### Features



- **(css)** Implement parser (#2074) ([d39acd1](https://github.com/swc-project/swc/commit/d39acd1d11d64a2e1d3e2c4a2f102de739f667dc))


- **(es/parser)** Emit an error for top-level await in script (#2094) ([33bdff0](https://github.com/swc-project/swc/commit/33bdff095708309e39185340bb898e7c8fa1c522))


- **(swc)** Implement `format.comments` of terser (#2095) ([879a0f3](https://github.com/swc-project/swc/commit/879a0f39a880403436fae4f690d1e65968523bc9))

## [1.2.78] - 2021-08-16

### Bug Fixes



- **(bundler)** Fix stack overflow (#2080) ([f8aa050](https://github.com/swc-project/swc/commit/f8aa0509ceda03128f19549a517f30570507205f))


- **(es)** Fix simple bugs (#2077) ([949a4d9](https://github.com/swc-project/swc/commit/949a4d9716a0e86318bcf1987e6bbdcad10c62b6))


- **(es/parser)** Fix parsing of `function` in property names (#2076) ([b0067ad](https://github.com/swc-project/swc/commit/b0067adb9cc76a401a54b4db35ecd8ce7330ce78))


- **(es/parser)** Allow using parser with stable rustc (#2084) ([1b0ef75](https://github.com/swc-project/swc/commit/1b0ef756f2e0c8f9ef4222d159143309f5003e7b))


- **(es/transforms)** Fix bugs (#2089) ([a309b36](https://github.com/swc-project/swc/commit/a309b3623657075697bd1a1c6222067ba4d998bd))


- **(node/swc)** Fix incorrect field package.json (#2069) ([035ff77](https://github.com/swc-project/swc/commit/035ff77f1abdccd49a48ed1fb44c81c85b51edad))

### Features



- **(es/loader)** Support more types for `browser` in package.json (#2060) ([e84ed13](https://github.com/swc-project/swc/commit/e84ed13ffe6d0961232e716a4a8414ba679ce34d))


- **(es/minifier)** Implement more rules (#2058) ([0e30deb](https://github.com/swc-project/swc/commit/0e30deba1a6fba0cfb9cf570ecf7838def56389b))

### Miscellaneous Tasks
- **general**: Cleanup codes for fixture testing (#2070) ([b0c41bb](https://github.com/swc-project/swc/commit/b0c41bb3f2db6cf0b3e333694adf10df1ca5856c))

### Performance
- **general**: Use ahash instead of sip hash (#2073) ([f6aabfc](https://github.com/swc-project/swc/commit/f6aabfce9c4b7bcd46bd6fdec593ec26f7dc1a09))

### Testing



- **(es/ext/jest)** Add tests for jest (#2082) ([ddb2dc7](https://github.com/swc-project/swc/commit/ddb2dc738076b20ba3df64f74fd270910eed885d))

## [1.2.77] - 2021-08-13

### Bug Fixes



- **(bundler)** Prepare renaming of bundler (#2066) ([883c1ac](https://github.com/swc-project/swc/commit/883c1ac4e4875c65b866aecdd122ca9514c62139))


- **(es)** Fix bugs (#2055) ([72c9f43](https://github.com/swc-project/swc/commit/72c9f4373aa4e3ddf40c5f1c5ac2a89198b471fa))


- **(es/minifier)** Fix bugs of the minifier (#2052) ([a7cb2ab](https://github.com/swc-project/swc/commit/a7cb2aba9d2a6eb0823768ab685fac9a12104050))


- **(swc)** Report error correctly (#2065) ([c6dce67](https://github.com/swc-project/swc/commit/c6dce6749467ffd9fb687f72266da13a7be2b8a2))


- **(swc)** Fix bugs (#2067) ([1b9584c](https://github.com/swc-project/swc/commit/1b9584cfc07c4450cc2533ffa359e6d31b2c9f44))

### Features



- **(bundler)** Support `paths` (#2054) ([cfc3725](https://github.com/swc-project/swc/commit/cfc3725dbb2be0ff0f9974bfbdb545b6fd55fa7b))


- **(es/transforms)** Improve module transform (#2053) ([a26071f](https://github.com/swc-project/swc/commit/a26071f99d1384c6755da98f2632eb8bea0f2d44))

### Performance



- **(node/swc)** Use mimalloc (#2068) ([fe2a063](https://github.com/swc-project/swc/commit/fe2a06352599f6a61245c374b7fd05b0949ed608))

## [1.2.76] - 2021-08-10

### Bug Fixes



- **(es/parser)** Recover from `import.meta` in scripts (#2042) ([8cbbddb](https://github.com/swc-project/swc/commit/8cbbddb957a267995d86e701f99aa9a214b1a570))


- **(es/transforms/module)** Fix `paths` bug. (#2043) ([2c52021](https://github.com/swc-project/swc/commit/2c52021ed42adc8d3524562c21a0dfca31c8d110))


- **(swc)** Fix bugs (#2034) ([53b031b](https://github.com/swc-project/swc/commit/53b031b019d0ae1e94371944d99dd24d0fdb0149))

### Features



- **(es/loader)** Support target runtime environment. (#2045) ([2151366](https://github.com/swc-project/swc/commit/2151366b9325967df8ec821fd3ee2fdee28b3323))


- **(es/minifier)** Implement more rules (#2039) ([71080db](https://github.com/swc-project/swc/commit/71080dbd26fdb09bc6b6e69b3e088e3994b704ce))

### Refactor



- **(es/parser)** Cleanup (#2033) ([4ead801](https://github.com/swc-project/swc/commit/4ead801295a106e08c109991ea2cf528c40d22a5))

## [1.2.75] - 2021-08-08

### Bug Fixes



- **(es/minifier)** Fix bugs and implement more rules (#2032) ([9793926](https://github.com/swc-project/swc/commit/9793926cc8fc8110b2e4fcbe6c488b33d374a935))


- **(es/parser)** Use correct error message (#2025) ([8a39c1d](https://github.com/swc-project/swc/commit/8a39c1db9748456942012c3512269cbba6ee7426))


- **(es/transforms/classes)** Fix a bug related to super property access (#1960) ([403f647](https://github.com/swc-project/swc/commit/403f6477523c135339965841af0c22e8c3a04db2))


- **(es/transforms/react)** Handle escape correctly (#2014) ([eb45760](https://github.com/swc-project/swc/commit/eb45760697922390d7d4736a6d763be6154d88d9))


- **(node/swc)** Allow specifying filename when parsing (#2031) ([abb1451](https://github.com/swc-project/swc/commit/abb14510619a97401d6fede2ebc4c28f456b97b9))

### Features



- **(es/minifier)** Make minifier parallel (#2009) ([026c21e](https://github.com/swc-project/swc/commit/026c21ec68b8c32a2768231c4e89e7f618a77dab))


- **(es/parser)** Always enable features in ES spec (#2029) ([f4e0e91](https://github.com/swc-project/swc/commit/f4e0e91f64a44c4adb702656e3b738a041547b9b))


- **(swc)** Improve swc as a crate (#2026) ([4cdb45f](https://github.com/swc-project/swc/commit/4cdb45ff2e6372af940f9398e179f5fae09ceabc))

## [1.2.74] - 2021-08-04

### Bug Fixes



- **(es)** Fix codegen & minifier (#2006) ([48bc26d](https://github.com/swc-project/swc/commit/48bc26d3c93e64174b3d1cd269205a98b1581a0c))

## [1.2.73] - 2021-08-04

### Bug Fixes



- **(ci)** Fix CI (#2003) ([a4fb114](https://github.com/swc-project/swc/commit/a4fb1148211a5ab92063e059ea3b0ab08414631c))


- **(common)** Remove potential race condition (#2001) ([080b1fa](https://github.com/swc-project/swc/commit/080b1fa3ac666b80377b9de2ebbe40578f96b9fb))


- **(es)** Fix bugs (#2004) ([81abfe5](https://github.com/swc-project/swc/commit/81abfe55d6e18cb116ba8b885580570c0b25b87a))


- **(es/minifier)** Improve output of minifier (#1990) ([f44e25c](https://github.com/swc-project/swc/commit/f44e25c3afba2470e8013b757a6bacf30614b1f9))


- **(es/minifier)** Improve output of minifier (#2005) ([68608db](https://github.com/swc-project/swc/commit/68608db0b3c68b3a0fc67edaf84cbf55a29bad7c))

### Features



- **(common)** Add an utiliy method for comments (#2002) ([064416c](https://github.com/swc-project/swc/commit/064416c0797ac16323ef8220481af91d2ade14bd))


- **(es/parser)** Report an error for `import.meta` in script (#1999) ([a086a20](https://github.com/swc-project/swc/commit/a086a203dde45442357759f79921e33aa30e4d2d))

## [1.2.71] - 2021-08-02

### Bug Fixes



- **(es)** Ensure that #1681 is fixed (#1970) ([6285f20](https://github.com/swc-project/swc/commit/6285f20cfaa76abbc34cb519a429edc04e8247e2))

### Features



- **(node/swc)** Support `sourceFileName` (#1976) ([e916b35](https://github.com/swc-project/swc/commit/e916b35dd2ee3a191fee487ac61e64d9410b72ed))

## [1.2.70] - 2021-07-31

### Bug Fixes



- **(es/minifier)** Fix minifier (#1985) ([be23e66](https://github.com/swc-project/swc/commit/be23e66ca807caacbaaa69f8b1cdfed549822677))

## [1.2.69] - 2021-07-31

### Bug Fixes



- **(build)** Increase memory ([d600d52](https://github.com/swc-project/swc/commit/d600d521573ef6c829551deb635170ef290a4cb3))

## [1.2.67] - 2021-07-31

### Bug Fixes



- **(es/codegen)** Remove extra space of import decl (#1975) ([ef4bb31](https://github.com/swc-project/swc/commit/ef4bb314b90ca41055a352185896262859dc7ec8))


- **(es/transforms)** Fix passes related to optimizations (#1942) ([21848ce](https://github.com/swc-project/swc/commit/21848ce2eac1553812a831247e495eb275396ed6))


- **(es/transforms)** Fix bugs (#1950) ([204a71c](https://github.com/swc-project/swc/commit/204a71ca9444a4a891563cdbddb155fe8299b9bf))


- **(es/transforms)** Strip out private method overloads (#1977) ([d64aa6f](https://github.com/swc-project/swc/commit/d64aa6f80de004534074c663ff4367ce1a055119))


- **(es/transforms/base)** Fix hygiene (#1964) ([af4cbba](https://github.com/swc-project/swc/commit/af4cbbae23a948d4339e14b4ce28d1fbbb18134b))


- **(es/transforms/module)** Allow namespace import with default import  (#1940) ([de24ff2](https://github.com/swc-project/swc/commit/de24ff275db54cf0b650fcd54e30039a926b78cb))


- **(es/transforms/typescript)** Fix typescript stripper (#1945) ([ebdd04d](https://github.com/swc-project/swc/commit/ebdd04d7c761f3c86fadfc5e31286070bb48567c))


- **(node/swc)** Fix typings for parser options (#1971) ([eecaac1](https://github.com/swc-project/swc/commit/eecaac12a0f18bb98e06471a834893c2f79338ea))


- **(testing)** Allow using it with stable rustc (#1974) ([4011703](https://github.com/swc-project/swc/commit/4011703af516298001e5063718f12c2cf01541d4))- **general**: Remove println ([360b4bc](https://github.com/swc-project/swc/commit/360b4bcc046d178bc7792a51fe00bcd456f2987f))

### Features



- **(es/minifier)** Implement more rules (#1871) ([b02e189](https://github.com/swc-project/swc/commit/b02e189d078aedbf5736c4feec3bdd6a6e296727))


- **(es/parser)** Allow stripping out typescript parser (#1962) ([85a216e](https://github.com/swc-project/swc/commit/85a216ef565ee852046abd540424e3f3ed85efdf))


- **(swc)** Expose minifier api (#1978) ([d1c4817](https://github.com/swc-project/swc/commit/d1c481790ca6bb17353b3ee3268655ea48effa36))

### Miscellaneous Tasks
- **general**: Fix typo (#1958) ([cd4a564](https://github.com/swc-project/swc/commit/cd4a564eead8cb3a6b0b0780ab6b0ba1ee116346))- **general**: Use correct license for the node package (#1966) ([f3603b2](https://github.com/swc-project/swc/commit/f3603b2cb84605a0ba5e0d818bef4ba86098712e))

## [1.2.66] - 2021-07-20

### Bug Fixes



- **(es/codegen)** Fix codegen of template literals (#1936) ([39ee7b9](https://github.com/swc-project/swc/commit/39ee7b962d3295f951633140944053d739eb8bc6))


- **(node/swc)** Fix field name (#1923) ([d5cdf44](https://github.com/swc-project/swc/commit/d5cdf444e8df727852b84e5cb00cdfa0352dc83f))


- **(node/swc)** Fix for m1 mac (#1939) ([d6454ad](https://github.com/swc-project/swc/commit/d6454add72d342933482ac021eedfca99c61e9bb))

## [1.2.65] - 2021-07-18

### Bug Fixes



- **(es/transforms)** Allow using rest pattern in arrow functions. (#1926) ([a26a189](https://github.com/swc-project/swc/commit/a26a18989f0f6acf0bad5adfab3c4a2cd57bddab))


- **(swc)** Fix order of passes (#1931) ([4a9b31d](https://github.com/swc-project/swc/commit/4a9b31df3e3c47418f9831376140061ce5fea4dd))


- **(swc)** Fix bugs (#1932) ([ff47e25](https://github.com/swc-project/swc/commit/ff47e2539ed08272740bb1c09d27c2b87a78ae0d))

## [1.2.64] - 2021-07-14

### Bug Fixes



- **(es/parser)** Fix parsing of file with onlly shebang (#1896) ([ed274b0](https://github.com/swc-project/swc/commit/ed274b02f2d9c425c5ed7e9ab2633b5fba6e4f17))


- **(es/transforms)** Fix transforms (#1900) ([69186eb](https://github.com/swc-project/swc/commit/69186eb74d836095c39d84e4d312708432a7e38b))


- **(es/transforms)** Fix decorator bugs (#1905) ([03be315](https://github.com/swc-project/swc/commit/03be31592148c5664aad660a246558c393dfeb5c))


- **(es/transforms)** Fix transforms (#1909) ([104be98](https://github.com/swc-project/swc/commit/104be9837b39bfd88a5ce4fcb47a7bd8915cc993))


- **(es/transforms)** Fix fixer (#1919) ([7a8ad88](https://github.com/swc-project/swc/commit/7a8ad8826a0072a53993977e68b00ccabe525d01))


- **(es/transforms/base)** Fix ts_resolver (#1903) ([fe7f7b6](https://github.com/swc-project/swc/commit/fe7f7b691ba3a7abcb10997dedd9e8c3d05ba5fd))


- **(es/transforms/compat)** Handle nested optional chaining expression (#1899) ([6037332](https://github.com/swc-project/swc/commit/6037332cb44fa668300b01504191ab6e970038ba))


- **(es/transforms/compat)** Fix regenerator (#1906) ([480287a](https://github.com/swc-project/swc/commit/480287aec409b9f9889b51ae82d2f54cd0688b06))


- **(es/transforms/proposal)** Fix order of constructor statements (#1914) ([d13eff9](https://github.com/swc-project/swc/commit/d13eff99d871ad25a7b3dd4def5da9c6c5fb2409))


- **(swc)** Fix source path of a source map file (#1902) ([19bcb06](https://github.com/swc-project/swc/commit/19bcb06f736ddafcefb93268894158bc08506c00))

### Miscellaneous Tasks



- **(ci)** Switch installation method of deno (#1915) ([4e42c66](https://github.com/swc-project/swc/commit/4e42c66663e6627c33dea9868de59609b7fde5cc))- **general**: Update README.md (#1910) ([8694b11](https://github.com/swc-project/swc/commit/8694b11959a01da78bdb7ec283894ac9576e4186))

### Refactor



- **(es/dep-graph)** Remove SourceMap dependency (#1908) ([6dc6d8a](https://github.com/swc-project/swc/commit/6dc6d8a8474f17a1064a9da2d7744bf518f72660))

## [1.2.63] - 2021-07-06

### Bug Fixes



- **(bundler)** Prevent infinite loop (#1872) ([ea93e1d](https://github.com/swc-project/swc/commit/ea93e1d1be8f13f09233326fcbc78f906960c0e8))


- **(ci)** Use cross-env (#1897) ([04d4384](https://github.com/swc-project/swc/commit/04d43844821bfea4de40f14e58a10e6f7a42f147))


- **(es/ast)** Fix handling of reserved words (#1891) ([7634106](https://github.com/swc-project/swc/commit/76341068d05aa2ab130d559e10354103fc99ecd5))


- **(es/parser)** Make comments in empty file be in leading comments (#1879) ([534c0b1](https://github.com/swc-project/swc/commit/534c0b19c8a1a0f65742fd650f3e781faf5a3711))


- **(es/parser)** Allow using '>' and '<' in template literal types (#1885) ([14cee03](https://github.com/swc-project/swc/commit/14cee03a436d181987d325be367be8ca064ce3b2))


- **(es/transform/react)** Handle TypeScript declare module (#1875) ([1a01d0f](https://github.com/swc-project/swc/commit/1a01d0f2c5e20de541cc412c95bedb1b6bd51367))


- **(es/transforms/module)** Fix for duplicate export (#1846) ([f8a3df8](https://github.com/swc-project/swc/commit/f8a3df8cc3236b6cb251e3d4400019dd8c9f2edf))


- **(es/transforms/optimization)** Migrate to VisitMut (#1880) ([ab16179](https://github.com/swc-project/swc/commit/ab161793a100001bf8b8dc697a2aac2b3f694e37))


- **(node-swc)** Fix visitor (#1890) ([211e208](https://github.com/swc-project/swc/commit/211e208219c85a1f439412cb58563cc0b24509e8))

### Features



- **(babel/compat)** Implement reverse operation of babelify (#1655) ([c49e9b0](https://github.com/swc-project/swc/commit/c49e9b0b8dab683c43d7907eac2eba409a49df17))


- **(es/minifier)** Implement more rules (#1766) ([33a43f8](https://github.com/swc-project/swc/commit/33a43f85b18191ed2a68d04a1c2e39aa623e6b66))

### Miscellaneous Tasks



- **(wasm)** Fix license (#1874) ([c4e0134](https://github.com/swc-project/swc/commit/c4e013441b877f8e97ee47a6fccf5ff6f59d9d99))

## [1.2.62] - 2021-06-27

### Bug Fixes



- **(es/codegen)** Preserve more comments (#1856) ([098e48b](https://github.com/swc-project/swc/commit/098e48b8f3557de6e7c0a74637ec34933444f47a))


- **(es/parser)** Fix parsing of abstract class over multiple lines (#1837) ([6c49279](https://github.com/swc-project/swc/commit/6c492796d03b484dbeee7db46b2b1f37aba4a37a))


- **(es/parser)** Fix span of ExportDefaultDeclaration (#1818) ([7488950](https://github.com/swc-project/swc/commit/7488950f90bba8c454a12a611d1f8d77405feac7))


- **(es/transforms)** Fix transforms (#1861) ([33f2ab2](https://github.com/swc-project/swc/commit/33f2ab2d795ee8fbe935f535cf5568a252af1fcc))


- **(es/transforms/base)** Fix fixer for the call in callee position (#1857) ([5345c90](https://github.com/swc-project/swc/commit/5345c90989be34c592bf5e74e4f58091f26f220e))


- **(es/transforms/module)** Allow importing same module with multiple names (#1830) ([9ae8c47](https://github.com/swc-project/swc/commit/9ae8c47d9b696772f6027801d5e2e4316249ab7c))


- **(es/transforms/module)** Share usage data between passes (#1829) ([a31ca40](https://github.com/swc-project/swc/commit/a31ca40dbb653407499753b502cdcd42dc4cacac))


- **(es/utils)** Fix detection of used variables (#1835) ([11f75df](https://github.com/swc-project/swc/commit/11f75dfdcdf85c0b148fe54a87d2d621dd9e4463))


- **(swc)** Fix sourcemap (#1832) ([5a6c4fd](https://github.com/swc-project/swc/commit/5a6c4fd5a0418e3b01c44c9a07af669008668e94))

### Features



- **(ci)** Track binary size and performance (#1840) ([f424957](https://github.com/swc-project/swc/commit/f4249574daea86d948be5d7bac0b7c413744a041))


- **(es/loader)** Add more logics to tsconfig.paths handler (#1860) ([eaaf32d](https://github.com/swc-project/swc/commit/eaaf32d806065b7bbfb1e0804de2815b749be7e4))


- **(es/visit)** Groundwork to use VisitMut instead of Fold (#1842) ([6ad3f7b](https://github.com/swc-project/swc/commit/6ad3f7b90ef1c1d54eb9e472a163ce991fc4929b))


- **(swc)** Add import resolvers (#1834) ([4cd4337](https://github.com/swc-project/swc/commit/4cd43375a5367cd4cff87f391b183bfc0f1c7528))

### Miscellaneous Tasks



- **(es/ast)** Upgrade arbitrary crate to v1 (#1844) ([c5f1c6b](https://github.com/swc-project/swc/commit/c5f1c6b8ba3a26f1b3463f92954c245ecc52e23a))


- **(es/ast)** Bump version (#1853) ([737ce63](https://github.com/swc-project/swc/commit/737ce63b78ceb65d0ce482eb72adf1422469f37d))- **general**: Organize project  (#1849) ([ff440d4](https://github.com/swc-project/swc/commit/ff440d47a402bf5273217f6995269a918886d322))

## [1.2.61] - 2021-06-16

### Bug Fixes



- **(es)** Remove UB (#1815) ([3c3fb35](https://github.com/swc-project/swc/commit/3c3fb359ee099fea45c87684ca4079e18bb79252))


- **(es)** Fix bugs for the type checker (#1823) ([7fa4e1b](https://github.com/swc-project/swc/commit/7fa4e1bea53fa1ca8d7fffc6faf84d2ae5c844c4))


- **(es)** Improve handling of typescript (#1824) ([4c8d68b](https://github.com/swc-project/swc/commit/4c8d68bfe2da7392cf8a9f31e44fefcac91b693c))


- **(es/parser)** Fix parser (#1808) ([c561157](https://github.com/swc-project/swc/commit/c56115793c3b2fae3d2a6c44f72dfe8ac0a2b426))


- **(es/parser)** Fix lexing of numbers (#1821) ([001af86](https://github.com/swc-project/swc/commit/001af8637d436420e0bbb2f750bf312800ac4922))


- **(es/parser)** Fix parsing of line terminators (#1755) ([8d8b2d1](https://github.com/swc-project/swc/commit/8d8b2d10d47953ba0f3374d867fc236f3481b04d))


- **(es/parser)** Fix panic on debug mode (#1828) ([f9bdc7b](https://github.com/swc-project/swc/commit/f9bdc7b227caa0ce35f33430d0e293769bb02d9e))


- **(es/transforms/optimization)** Fix dead_branch_remover (#1827) ([b5a7a3f](https://github.com/swc-project/swc/commit/b5a7a3f57798589ec2e652968810e89d05991bc8))


- **(swc)** Fix bugs (#1811) ([97ef7c0](https://github.com/swc-project/swc/commit/97ef7c0553fc9fefc4dd7ea7627de6fb667dddf2))


- **(swc)** Fix bugs (#1820) ([d3944f5](https://github.com/swc-project/swc/commit/d3944f520376b03e5df4939d85dfd3239ab7da58))

### Build



- **(node-swc)** Support lower version glibc linux on non-x64 arch (#1809) ([c6ce8c6](https://github.com/swc-project/swc/commit/c6ce8c60b718d285d86ae49e74329357531ac878))

## [1.2.60] - 2021-06-06

### Bug Fixes



- **(bundler)** Fix cycle detection (#1779) ([4e7723a](https://github.com/swc-project/swc/commit/4e7723a7a0286f49124e7dc1ca10668ad6a237a9))


- **(es/transforms)** Fix bugs (#1769) ([ad55711](https://github.com/swc-project/swc/commit/ad55711e45107cbc9e38b99418b211ea97652963))


- **(es/transforms)** Fix bugs (#1783) ([0bd2a3a](https://github.com/swc-project/swc/commit/0bd2a3a07ece7eee38140e52e167758bb6c120d0))


- **(es/transforms)** Fix bugs (#1795) ([7730a6e](https://github.com/swc-project/swc/commit/7730a6ea5af2206764fa728b627bb63927b281c1))


- **(es/transforms/base)** Wrap binary operands of unary expressions. (#1793) ([03db7ad](https://github.com/swc-project/swc/commit/03db7adc9f38c2d5b0915ab2cc96a2121f376cc2))

### Features



- **(node-swc)** Support windows aarch64 and linux aarch64 musl (#1773) ([d657193](https://github.com/swc-project/swc/commit/d6571933ffa8024db0d04216c6cd5cbb14aa1537))

## [1.2.59] - 2021-05-30

### Bug Fixes



- **(common)** Fix compiler error (#1747) ([7b9b9fe](https://github.com/swc-project/swc/commit/7b9b9fe9cee9979c165ab4841cbd86daa01d5867))


- **(es)** Fix bugs (#1728) ([a518c83](https://github.com/swc-project/swc/commit/a518c8348597c30e2c9bab38cbfd9f7698a41f32))


- **(es/codegen)** Fix codegen of classes with minify enabled (#1767) ([5d219b8](https://github.com/swc-project/swc/commit/5d219b8cd164373cb6359207232633fc00f0cdd9))


- **(es/parser)** Report error for wrong declare keywords (#1760) ([65ffd87](https://github.com/swc-project/swc/commit/65ffd87771d07a843eb467d3c8f38a9e7dd91ab8))


- **(es/transforms/base)** Fix ts_resolver (#1761) ([9fa878c](https://github.com/swc-project/swc/commit/9fa878c1a68a1ada44316cb36290b99b17944ef2))


- **(spack)** Fix node resolver (#1748) ([1150fbc](https://github.com/swc-project/swc/commit/1150fbc9285074106ab6a869b199faf14fbd6651))


- **(spack)** Update the list of node js core modules (#1749) ([3359188](https://github.com/swc-project/swc/commit/3359188a20f5bf458c4e4661c79886983d3cb89a))


- **(swc)** Fix bugs (#1732) ([a795de7](https://github.com/swc-project/swc/commit/a795de7f43358baacd8ffdb1374af2eedb726f97))


- **(swc)** Fix bugs (#1739) ([d60c324](https://github.com/swc-project/swc/commit/d60c3242afaf7ff0fe29dee9f5a1df4944480c42))


- **(swc)** Fix bugs (#1745) ([8726c9c](https://github.com/swc-project/swc/commit/8726c9caf2ef57b19639e590db04aa2a02024f49))


- **(swc)** Fix bugs (#1753) ([c79db25](https://github.com/swc-project/swc/commit/c79db252dcf07c83889a3f457516b87855786758))

### Features



- **(es/minifier)** Implement more rules (#1717) ([d20c1d3](https://github.com/swc-project/swc/commit/d20c1d30890ccbaaefddc505d08daee54da8e9f1))


- **(es/minifier)** Implement more rules (#1730) ([3522fc7](https://github.com/swc-project/swc/commit/3522fc71e44de6e773322e01b999b8375645f58a))


- **(es/minifier)** Implement more rules (#1731) ([5e2db21](https://github.com/swc-project/swc/commit/5e2db21e476b8ab22c40dc70e5b88c655b5b94fc))


- **(es/minifier)** Implement more rules (#1735) ([ef6a745](https://github.com/swc-project/swc/commit/ef6a745599563da4a577971c4aaf3222eb4345ad))


- **(es/minifier)** Implement rules and classify tests (#1750) ([99e7386](https://github.com/swc-project/swc/commit/99e738643aadf846260ab6b78783d92274904f43))


- **(node-swc)** Support FreeBSD (#1758) ([6a13615](https://github.com/swc-project/swc/commit/6a13615381725ed06116f1d45281f038fa9331d3))

## [1.2.58] - 2021-05-21

### Bug Fixes



- **(es)** Fix various bugs (#1680) ([24bd5ea](https://github.com/swc-project/swc/commit/24bd5ea4a4cdd1b7d812ea08fe6617bf2f2a8e49))


- **(es)** Fix various bugs (#1707) ([57d1aaf](https://github.com/swc-project/swc/commit/57d1aaf80f4e9b21121318759cde4f864692bc46))


- **(es)** Fix bugs (#1709) ([dee8290](https://github.com/swc-project/swc/commit/dee82904f891ed48d4df124620e71246416c895d))


- **(es/minifier)** Use log instead of stderr (#1715) ([ded8f2b](https://github.com/swc-project/swc/commit/ded8f2b5e55d7457926856fdce940c5fcbd6e0c4))


- **(es/minifier)** Publish (#1716) ([470c8f4](https://github.com/swc-project/swc/commit/470c8f47457ff228131834fb09e9d9051ec8fcdb))


- **(es/preset-env)** Update core js compat data (#1719) ([8a2909b](https://github.com/swc-project/swc/commit/8a2909bc51dda27ecf4d645a017d29de1d2a2750))


- **(es/transform)** Fix bugs (#1699) ([b4aa1d4](https://github.com/swc-project/swc/commit/b4aa1d48e37260f334435a92b09312a801f6591e))


- **(es/transforms)** Fix bugs (#1691) ([f0d7a3d](https://github.com/swc-project/swc/commit/f0d7a3d064c6c3bc52906f4d72fd6198af49f3e2))


- **(es/transforms/base)** Fix resolver (#1710) ([a0241c8](https://github.com/swc-project/swc/commit/a0241c88b253774f085585376eb2218e5be2dfa6))


- **(es/transforms/compat)** Support private methods (#1700) ([b044d2c](https://github.com/swc-project/swc/commit/b044d2c6dd0e29bb95527d802ad3bddd27aa43e2))


- **(es/transforms/compat)** Fix `async_to_generator` pass. (#1724) ([a1341dc](https://github.com/swc-project/swc/commit/a1341dcdc68f96f12661d800d9a6e1ab7980b24b))


- **(es/transforsm/compat)** Transform private field access in private methods (#1703) ([8a36435](https://github.com/swc-project/swc/commit/8a36435ee1897d40591b9fab77eae188d54a12dc))


- **(node-swc)** Fix typescript definitions for react options (#1720) ([c2bd319](https://github.com/swc-project/swc/commit/c2bd3195e84ba7df9c55207755f4812f626716d4))


- **(swc)** Fix bugs (#1712) ([b6589af](https://github.com/swc-project/swc/commit/b6589af92bd56c4338166ea429f2e6018a1afccf))

### Features



- **(es)** Support type-only import equals declaration (#1695) ([1dbc364](https://github.com/swc-project/swc/commit/1dbc3644a50f8a23cbb6d33355dc02a7ca9ccc24))


- **(es/minifier)** Implement minifier partially (#1302) ([c6b22c5](https://github.com/swc-project/swc/commit/c6b22c57f878b6bc57e54197f6e18582f58f3389))

## [1.2.57] - 2021-05-11

### Bug Fixes



- **(ci)** Don't run tests on macos (#1659) ([4d013d9](https://github.com/swc-project/swc/commit/4d013d98ca4270c787badb56be074d7ae246a300))


- **(es)** Fix various bugs. (#1664) ([b0b0709](https://github.com/swc-project/swc/commit/b0b0709e1aedaf7159b77f480cd9b7251df7b14e))


- **(es/parser)** Allow using `override` with `static` (#1663) ([4aed942](https://github.com/swc-project/swc/commit/4aed9423de5a82b0a90a17dc8ec1cbfe83c3c814))


- **(es/tranforms/base)** Resolver: Handle function declarations in ts modules (#1665) ([aea08fb](https://github.com/swc-project/swc/commit/aea08fb8c94c0d7857e8c1624566844cfca5fbba))


- **(es/transforms/base)** Fix resolver (#1666) ([9585500](https://github.com/swc-project/swc/commit/9585500476290adffb9c047dd5cdae3066eab1f6))


- **(es/transforms/base)** Fix resolver (#1672) ([9381d0d](https://github.com/swc-project/swc/commit/9381d0dbc2b0fc80b53c2654126b2d9937253a71))


- **(es/transforms/compat)** Fix span for comments in classes transform. (#1658) ([c3bf517](https://github.com/swc-project/swc/commit/c3bf517dc9cf9822da270f1f38f038684105aed2))


- **(es/transforms/compat)** Don't create unnecessary IIFE. (#1669) ([2b918b0](https://github.com/swc-project/swc/commit/2b918b0c3dcd8784758f39c711f76bd9048f9b37))


- **(es/transforms/compat)** Improve performance (#1673) ([2ad0af9](https://github.com/swc-project/swc/commit/2ad0af9e9182942aaf55b6aa2aa236e0baa14ce5))


- **(node-swc)** Fixed parseFile (#1654) ([0cdabeb](https://github.com/swc-project/swc/commit/0cdabeb4c0fe22246eaaf12644e4aa0292f23e6f))

### Features



- **(es/parser)** Allow `override` in parameter properties (#1667) ([1548f6d](https://github.com/swc-project/swc/commit/1548f6d7992af5dab76998ab572506380a0da2c1))


- **(es/parser)** Enforce order of `abstract` and `override` (#1668) ([50f8048](https://github.com/swc-project/swc/commit/50f8048f2a953855b63a753a1d09334112acce63))


- **(es/parser)** Enforce orders of `override` and `async` (#1670) ([b713972](https://github.com/swc-project/swc/commit/b713972493e1652edcc8170ba835a60d4a7f7fa3))


- **(es/transforms/compat)** Add pure comment to classes (#1646) ([f4d0e46](https://github.com/swc-project/swc/commit/f4d0e46cbb3966917f2736c799cecd5558d7d687))

## [1.2.56] - 2021-05-08

### Bug Fixes



- **(ci)** Fix android build ([e3bdb97](https://github.com/swc-project/swc/commit/e3bdb97e669d37e5339ce7d717f78f0e7b42b279))


- **(es/transforms/react)** Bump version ([f368c5f](https://github.com/swc-project/swc/commit/f368c5f81c8cfd464b755c0b34c4b3c08dc89f2b))

## [1.2.55] - 2021-05-07

### Bug Fixes



- **(bundler)** Improve performance (#1599) ([9a07869](https://github.com/swc-project/swc/commit/9a07869c21ba272306dcd0155409f7af9ad6393b))


- **(bundler)** Fix performance (#1601) ([308792d](https://github.com/swc-project/swc/commit/308792dc90eefda5476a41a996a210c39e6f1a79))


- **(bundler)** Use proper algorithm for dependency analysis (#1610) ([731dc68](https://github.com/swc-project/swc/commit/731dc68c92d9feb278c1ed6aead166e43cbc9652))


- **(ci)** Use ghcr.io build image (#1622) ([7ea8760](https://github.com/swc-project/swc/commit/7ea87600b4dee146dcf9e06bee1066cbf1d2b5cb))


- **(es/transforms/compat)** Allow keywords in method names. (#1651) ([1b1c46b](https://github.com/swc-project/swc/commit/1b1c46b492c28f52e48c119ea95468ec93e1acef))


- **(es/transforms/fixer)** Handle binary expressions in super class expr (#1636) ([27a1c30](https://github.com/swc-project/swc/commit/27a1c30fef2948856b3cbc26ae65b69db91f3a18))


- **(es/transforms/optimization)** Preserve `x instanceof Object` (#1630) ([b6ff4d6](https://github.com/swc-project/swc/commit/b6ff4d6f717dfb4bd41c62c7085e15ace868f296))


- **(es/transforms/react)** Expose `RefreshOptions` (#1635) ([2724cef](https://github.com/swc-project/swc/commit/2724cefe2cdac5b74c8482815ce7b237133066d2))


- **(es/transforms/react)** Change order of passes (#1639) ([fe107a1](https://github.com/swc-project/swc/commit/fe107a1223bf8c2361b3ac50cc7280afa32c988c))


- **(es/transforms/resolver)** Fix setter properties (#1645) ([deec1f6](https://github.com/swc-project/swc/commit/deec1f67a338bc711600beae09099bc695ab0c55))


- **(es/transforms/resolver)** Fix setter properties (#1647) ([abc24c9](https://github.com/swc-project/swc/commit/abc24c9256c27fb3e860c2fdabdc3ddb8a3344ee))


- **(node-swc)** Fix definition of FunctionDeclaration (#1602) ([1c1de63](https://github.com/swc-project/swc/commit/1c1de6392bc6c16b9e97dead146521ee4258a437))


- **(node-swc)** Fix outdated types (#1621) ([e9d58fa](https://github.com/swc-project/swc/commit/e9d58fa002b774de01c118247af0184acf3ceab2))


- **(node-swc)** Fix definition of JSXOpeningElement (#1608) ([304b57c](https://github.com/swc-project/swc/commit/304b57cdd493ba3d6e5fa25e780d41ae2180a066))


- **(swc)** Fix bugs (#1591) ([dbec753](https://github.com/swc-project/swc/commit/dbec753ca1b3253c9cea6b6e650606287a7562f2))


- **(swc)** Fix various bugs (#1613) ([5a0bacb](https://github.com/swc-project/swc/commit/5a0bacb5b8c490cd9dd39ad2e14787220486b470))


- **(swc)** Fix bugs (#1624) ([28bb61f](https://github.com/swc-project/swc/commit/28bb61fb8d2b2ef8940354e7fc2c5c64244ab579))


- **(swc)** Fix various bugs. (#1632) ([d10671b](https://github.com/swc-project/swc/commit/d10671bbda6d591a1358d52ef5f0ed8efb360a0d))


- **(wasm-web)** Use jq with an explicit temp file (#1637) ([882e2d9](https://github.com/swc-project/swc/commit/882e2d91b6c4c7bc93a4668b990a5be516c48f66))

### Features



- **(ast_node)** Add #[ast_serde] (#1595) ([8222cc0](https://github.com/swc-project/swc/commit/8222cc075d82a3e0a7effd1c40d5e5eb59790704))


- **(babel/compat)** Improve performance of babelify (#1626) ([82ef06a](https://github.com/swc-project/swc/commit/82ef06afb8cc7ef912afb11bba2293e1d0cd91fd))


- **(es/preset-env)** Make android targets fall back to chrome (#1597) ([a24266d](https://github.com/swc-project/swc/commit/a24266d986b25c8412945b29501ffa4eb568a211))


- **(es/transforms/optimization)** Simplify: Preserve do-while loops with conditional stoppers (#1618) ([f943021](https://github.com/swc-project/swc/commit/f943021de0ab3b37addae2d88187fcbba15c6107))


- **(node-swc)** Babel ast translator (#1465) ([d1415f9](https://github.com/swc-project/swc/commit/d1415f9bf7c5ea377851b93b8844e64023f8aa5e))

## [1.2.54] - 2021-04-19

### Bug Fixes



- **(es/transforms/compat)** Fix syntax context of super classes (#1586) ([d7ea5ae](https://github.com/swc-project/swc/commit/d7ea5ae00c16a697a3c0ecc325f436a6aeba3be7))


- **(es/transforms/compat)** Handle references to `arguments` inside arrow functions and block scoped loops (#1585) ([1c4fa63](https://github.com/swc-project/swc/commit/1c4fa63bdcc76fa58682b9a8999f2ac945e5114e))


- **(swc)** Fix bugs (#1560) ([46c3d62](https://github.com/swc-project/swc/commit/46c3d62ebd06bd6d24091cff972eac53103af891))


- **(swc)** Fix various bugs (#1588) ([4db24fb](https://github.com/swc-project/swc/commit/4db24fb7f63fdec6e2c3eb59d4948337690663f3))- **general**: Fix bugs (#1590) ([c765c7e](https://github.com/swc-project/swc/commit/c765c7e06e1d3caa6f7271630831c79f4b3e6a2c))

## [1.2.53] - 2021-04-16

### Bug Fixes



- **(bundler)** Fix bugs (#1572) ([246bdd5](https://github.com/swc-project/swc/commit/246bdd5088ce48838def373585fe6ef7a45a2a9c))


- **(bundler)** Fix bundler (#1576) ([1178686](https://github.com/swc-project/swc/commit/1178686a4cec95ec6a3f4c93b273549b70f47263))


- **(es/transforms/base)** Fix nested function scopes (#1559) ([92bbde3](https://github.com/swc-project/swc/commit/92bbde3b5377e281525828de426e481fbc70029f))


- **(es/transforms/base)** Fix precedence of yield expression inside ternary (#1577) ([00461f3](https://github.com/swc-project/swc/commit/00461f3a76ed82f41f334cd34008209563c473e5))


- **(es/transforms/base/fixer)** Fix parens of sequence expressions (#1566) ([14edb69](https://github.com/swc-project/swc/commit/14edb69826c1c405a396a29f58a214b9cc3ed624))


- **(es/transforms/compat)** Fix block scoping of class declarations (#1569) ([d8a18df](https://github.com/swc-project/swc/commit/d8a18dfd9e9e67da0ef19c5f44e847534790e58f))


- **(es/transforms/compat)** Fix regenerator pass for yield* expressions (#1580) ([efa7a9a](https://github.com/swc-project/swc/commit/efa7a9af7801c00362960b86c6e11c5bd97c21d1))


- **(es/transforms/module)** Use correct this (#1561) ([df2a926](https://github.com/swc-project/swc/commit/df2a926e9d4908456256e701b1399d3af7d153d0))


- **(es/transforms/optimization)** Preserve missing object members (#1567) ([e43de77](https://github.com/swc-project/swc/commit/e43de77ec6740ac558f191cdcb49fd41bc45da34))

## [1.2.52] - 2021-04-11

### Bug Fixes



- **(es)** Fix for the type checker (#1528) ([4ab7a91](https://github.com/swc-project/swc/commit/4ab7a91fe30d3c39c8ea4849e3e7f188ecaa1160))


- **(es)** Fix sourcemap (#1548) ([62d0cbc](https://github.com/swc-project/swc/commit/62d0cbcabb9d63d0dc1933c63ea9fd4811dcd835))


- **(es)** Fix bugs. (#1565) ([5ef3c43](https://github.com/swc-project/swc/commit/5ef3c43522c1f9a5892aa4b48bc46d8434fd45fe))


- **(es/ast)** Remove TsSignatureDecl (#1531) ([f179270](https://github.com/swc-project/swc/commit/f1792708b46d9c434806a26ac19e1811d8b171a6))


- **(es/codegen)** Fix sourcemaps of multi line block comments (#1511) ([393808a](https://github.com/swc-project/swc/commit/393808a8f68f134688fea3b9cd5f7504f13506a5))


- **(es/parser)** Fix assert after imports (#1513) ([3ddf229](https://github.com/swc-project/swc/commit/3ddf229c18e9c391bd03c98cce59a6e0540a3007))


- **(es/parser)** Use correct position for comments (#1527) ([5ce4e1e](https://github.com/swc-project/swc/commit/5ce4e1e9278c83a1b6f955da01f7ba3f62240883))


- **(es/parser)** Disallow `override` in non-subclass (#1552) ([39e1e54](https://github.com/swc-project/swc/commit/39e1e54ee4a44980f592b7e053b8c187f6efba12))


- **(es/parser)** Fix error message (#1551) ([f002b73](https://github.com/swc-project/swc/commit/f002b73d825f23f58106b344af301c1c1b02876a))


- **(es/transforms/base)** Fix named function expression handling in resolver (#1540) ([beeb1f9](https://github.com/swc-project/swc/commit/beeb1f90671e604aa2fe0672288757ab54869e17))


- **(es/transforms/optimization)** Fix inlining nested block statements in branch simplifier (#1536) ([0d79ca6](https://github.com/swc-project/swc/commit/0d79ca617d7847420983de5b40fd81a503050800))


- **(es/transforms/optimization)** Fix function hoisting with early return branch simplification (#1539) ([ee641ba](https://github.com/swc-project/swc/commit/ee641bab630dff154fab23cdd2c9eadc772b07a2))


- **(es/transforms/typescript)** Fix TS import elision with shadowed declarations (#1521) ([b9f5a50](https://github.com/swc-project/swc/commit/b9f5a50d184b2aa2c99631cea510d5762ecb1ea6))


- **(node-swc)** Make `Argument.spread` optional (#1535) ([dcaea5f](https://github.com/swc-project/swc/commit/dcaea5fd316c5d0e64158f9d8ca883c2d8fecf0d))


- **(node-swc)** Fix VariableDeclarationKind typescript definition (#1542) ([c7dc911](https://github.com/swc-project/swc/commit/c7dc9116e1836f02a0d6146479f5d1beb517c459))


- **(node-swc)** Fix handling of tagged template expressions in Visitor (#1544) ([228429c](https://github.com/swc-project/swc/commit/228429c7bb069c9e7dbf36b50a0281d604145644))


- **(strip)** Expand class expressions as sequences ([8b1f8dd](https://github.com/swc-project/swc/commit/8b1f8dde4b3ed286dd0a16472492b53aba21980b))


- **(swc)** Fix bugs for v1.2.52 (#1506) ([99f4f0f](https://github.com/swc-project/swc/commit/99f4f0f2808ac7a35cc73adcae44bc2292e053a7))


- **(swc)** Fix bugs (#1529) ([252804d](https://github.com/swc-project/swc/commit/252804d2e34c192a3b5146915e752d3fa023980a))


- **(swc)** Fix various bugs (#1550) ([2211a99](https://github.com/swc-project/swc/commit/2211a9908a9a1c2e01d5f483ad91ac396336dc08))- **general**: Fix bugs (#1516) ([51d0cef](https://github.com/swc-project/swc/commit/51d0cef287bd90c337db391e977daf34d8820419))

### Features



- **(es)** Support TS 4.3 static index signature in class (#1537) ([6512216](https://github.com/swc-project/swc/commit/65122163cff5bc270b8d4e8f481e6f3b50316c43))


- **(es)** Support `override` syntax in class for TS 4.3 (#1541) ([3d0ad22](https://github.com/swc-project/swc/commit/3d0ad22acec606008cdb4dd1725ff4db567c3dfc))


- **(es/transforms/react)** Support fast refresh (#1524) ([0fabc2c](https://github.com/swc-project/swc/commit/0fabc2cfc9486a75f31e319d14a4a781d78a7402))


- **(es/transforms/react)** Fast refresh config (#1538) ([6cad184](https://github.com/swc-project/swc/commit/6cad184dfdfe0ab544c7ab923214bf37e5421bd2))


- **(es/transforms/react)** Add pure annotation comments (#1564) ([8f5daa3](https://github.com/swc-project/swc/commit/8f5daa3bbbcc05997a71dd23159347ad3622238c))

### Miscellaneous Tasks



- **(ci)** Configure github actions for rustdoc (#1523) ([13a9d12](https://github.com/swc-project/swc/commit/13a9d12c849a0ed0b01d729b5fa7fef7b3d5f9bd))

## [1.2.51] - 2021-03-28

### Bug Fixes



- **(bundler)** Fix stack overflow on Windows (#1464) ([fec189f](https://github.com/swc-project/swc/commit/fec189f2f3827cae7bff862890f83ccfc2bfcb5c))


- **(bundler)** Fix inlining pass (#1495) ([7853b0a](https://github.com/swc-project/swc/commit/7853b0a76c923a6d86e2964cb2951e3b03fdf018))


- **(ci)** Speed up (#1494) ([0351a47](https://github.com/swc-project/swc/commit/0351a4767891d06dc1ca46bc46b162827ecb8c96))


- **(common)** Fix column positions in generated sourcemaps (#1470) ([9d53a70](https://github.com/swc-project/swc/commit/9d53a70221a90e421b937bf2ec0d28004abe0f76))


- **(es/codegen)** Fix SX spread props (#1463) ([06cb4b8](https://github.com/swc-project/swc/commit/06cb4b89cba109e8bae8739a8509c5be569d1da1))


- **(es/codegen)** Fix codegen of arrow expressions. (#1452) ([9445c10](https://github.com/swc-project/swc/commit/9445c109f99d9ee18c295c5d18563693ac40ccc7))


- **(es/transforms/base)** Fix fixer (#1496) ([b7eb1f9](https://github.com/swc-project/swc/commit/b7eb1f91543d7e7e1c4977ba415dfee829d7a16b))


- **(es/transforms/fixer)** Fix await expressions. (#1475) ([df3f310](https://github.com/swc-project/swc/commit/df3f3106df43f71e30099b19ea5fce94527bc212))


- **(es/transforms/react)** Handle jsx entities in attributes correctly (#1501) ([232cfc5](https://github.com/swc-project/swc/commit/232cfc5f4f39591c48e44c8a243d166b986b94ae))


- **(es/transforms/typescript)** Precompute class field keys (#1498) ([8eae009](https://github.com/swc-project/swc/commit/8eae00900f88b09cf04dc1a991f815124a07d08f))


- **(strip)** Combine typescript_class_properties() into strip() (#1478) ([9bc074e](https://github.com/swc-project/swc/commit/9bc074ed469a7b3e85a0ef23df27ff857fe44b84))


- **(strip)** Transform static class fields to assignments (#1487) ([fa3d65c](https://github.com/swc-project/swc/commit/fa3d65cd585402a4128a4801ddeacf11f5fbd07d))


- **(swc)** Fix bugs (#1453) ([dcdac2d](https://github.com/swc-project/swc/commit/dcdac2db6fbe9e1b78dc99dc1e29aa24c6a683f1))

### Miscellaneous Tasks
- **general**: Add note about required dev tools (#1467) ([a903683](https://github.com/swc-project/swc/commit/a90368372f340a356a90eccb2bbf423caf80f73c))

### Refactor



- **(es/ast)** Change TaggedTpl to have a Tpl (#1114) ([da62c73](https://github.com/swc-project/swc/commit/da62c732391f3445a67bc2fb1c4753068df77676))

## [1.2.50] - 2021-03-03

### Bug Fixes



- **(bundler)** Fix bundler (#1427) ([c047e0e](https://github.com/swc-project/swc/commit/c047e0e54d044a0e10df528fb33bf8a9e8c6208f))


- **(bundler)** Fix bugs (#1437) ([bbaf619](https://github.com/swc-project/swc/commit/bbaf619f63f98c00e5730b3f078d3affc54ad01d))


- **(es/parser)** Recover from type annotations after `=` (#1445) ([73b8826](https://github.com/swc-project/swc/commit/73b8826a2f9b53eddce0399bd141a6865c1107db))


- **(es/parser)** Fix lexing of template literals. (#1450) ([bc07215](https://github.com/swc-project/swc/commit/bc07215d4df960deccdb1c7d82a790f5325618a7))


- **(es/transforms/base)** Fix span hygiene of type elements (#1436) ([a4d408d](https://github.com/swc-project/swc/commit/a4d408dc6e192200fa0c1c4a8c6af61d96ea2204))


- **(swc)** Fix various bugs (#1440) ([a310542](https://github.com/swc-project/swc/commit/a3105428ba2ff9abd7d0e5464868da3ca9b66294))


- **(swc)** Fix bugs for v1.2.50 (#1444) ([97269a3](https://github.com/swc-project/swc/commit/97269a37b964f362d4d8cade37ce30010a4a6199))

### Features



- **(es/transforms)** Port @babel/preset-modules (#1439) ([eec65f2](https://github.com/swc-project/swc/commit/eec65f25bbfaaf81ee6e18ed2b9461c1d7d8c618))

### Miscellaneous Tasks
- **general**: Typo (#1442) ([24dac86](https://github.com/swc-project/swc/commit/24dac8605b8ed6473ac5881651437c3f614bb001))- **general**: Fix link (#1443) ([7d62fdf](https://github.com/swc-project/swc/commit/7d62fdf761b558f7ca29a85f6da76f82f1750802))

## [1.2.49] - 2021-02-23

### Bug Fixes



- **(common)** Allow using with MIRI (#1426) ([abfff69](https://github.com/swc-project/swc/commit/abfff69300e46fff8d244fe27bacf08c1545d005))


- **(node-swc)** Fix glibc compatibility issue (#1431) ([6ece763](https://github.com/swc-project/swc/commit/6ece76367b3b36e673e16ffd8d9600ccdd6c65cf))- **general**: Fix tests on windows (#1419) ([59bd00d](https://github.com/swc-project/swc/commit/59bd00d8413fc95cb285e838e66f26b5b09fd2bb))

## [1.2.48] - 2021-02-22

### Bug Fixes



- **(bundler)** Fix bugs (#1373) ([bfde9a1](https://github.com/swc-project/swc/commit/bfde9a1f6e40d572b0cfdc6d6c4180d13e4883a4))


- **(bundler)** Fix bugs (#1382) ([7f5bfdc](https://github.com/swc-project/swc/commit/7f5bfdcc006749acd60cd2c6b6cc82b82f4c7aee))


- **(es)** Fix for the type checker (#1381) ([686c981](https://github.com/swc-project/swc/commit/686c98116d0483ea73529c6ae662b0908fea9203))


- **(es)** Fix bugs (#1395) ([9dabf00](https://github.com/swc-project/swc/commit/9dabf00200cefe7af2569ab6d9dd3cc1769c6af2))


- **(es)** Fix docs.rs (#1399) ([fc2a8cb](https://github.com/swc-project/swc/commit/fc2a8cb073e00759a867422b6ff3a52d2c04e429))


- **(es)** Improve performance (#1411) ([eaeffab](https://github.com/swc-project/swc/commit/eaeffabf74d73696bb45e106a92cbcd9fd34d8f3))


- **(es/ast)** Remove TsTypeCastExpr it's not used (#1420) ([adcca03](https://github.com/swc-project/swc/commit/adcca03cfa5d12eea37533b4fdefa94a3895ffe6))


- **(es/parser)** Fix bugs (#1405) ([5ad57b0](https://github.com/swc-project/swc/commit/5ad57b02f2a2d5970bf23a04154da243e7a991a2))


- **(es/transforms/base)** Fix hygiene of catch clause (#1413) ([27aad87](https://github.com/swc-project/swc/commit/27aad87798fb3ce4b619f0891e83514089d2e8e8))


- **(es/transforms/base)** Fix resolver (#1414) ([eecdca4](https://github.com/swc-project/swc/commit/eecdca4e866f470781806ed287fd8480aefa8dce))


- **(es/transforms/react)** Use VisitMut instead of Fold (#1409) ([8fb0b4c](https://github.com/swc-project/swc/commit/8fb0b4c30339c1d2609239b6feb093735c83b140))


- **(node)** Add es2020 to JscTarget in types.ts (#1376) ([98ae167](https://github.com/swc-project/swc/commit/98ae16761d2dd91c691c00e69375db6bad392eca))


- **(node-swc)** Don't remove plugin from options (#1390) ([a0898e8](https://github.com/swc-project/swc/commit/a0898e8ce311d5838c52a77dd5e47974e21016ac))


- **(node-swc)** Handle empty object patterns. (#1393) ([f5a90ae](https://github.com/swc-project/swc/commit/f5a90ae985c3a5dff80fb8f83facc5196093d4d7))


- **(swc)** Fix  bugs (#1372) ([bf445a7](https://github.com/swc-project/swc/commit/bf445a75c4ed1df5a4f450e0c665159188655de1))


- **(swc)** Reduce allocation (#1401) ([a53186c](https://github.com/swc-project/swc/commit/a53186c842bf9eb33f0834bab911a7f5a8c9b17b))

### Documentation
- **general**: Fixed documentation link URL in README.md (#1375) ([7a93594](https://github.com/swc-project/swc/commit/7a935942294c2b72480c6ecf1388684d625a1229))

### Features



- **(es/parser)** Allow to look at the kind of an error (#1396) ([313f51f](https://github.com/swc-project/swc/commit/313f51fab159f2e58eef9574c95fc8546dab9782))


- **(es/preset-env)** Custom config path (#1374) ([bd119e6](https://github.com/swc-project/swc/commit/bd119e6634d4b017982d4a02ebd07fa867c4a9fd))


- **(es/transforms/react)** New jsx transform (#1408) ([0be20ff](https://github.com/swc-project/swc/commit/0be20ff0ae49f379a63a5ce0f1a3d806dae1eff7))


- **(node-swc)** Reduce binary size (#1418) ([9d896c7](https://github.com/swc-project/swc/commit/9d896c746e4604c9047f8ef62bcd728ca51d3aa3))- **general**: Add import assertion to dep analyzer (#1387) ([8ef78a9](https://github.com/swc-project/swc/commit/8ef78a9e08008275c3c60090ce65ad4339220eb5))

### Miscellaneous Tasks



- **(node-swc)** Use latest napi versions (#1386) ([79e991b](https://github.com/swc-project/swc/commit/79e991bcc32c6b89e61df1db3ca6133eb0a855e3))

## [1.2.47] - 2021-01-30

### Bug Fixes



- **(bundler)** Fix bugs (#1349) ([947161b](https://github.com/swc-project/swc/commit/947161b43b81e5e7f8fdb33b2fadebbd95e6b6ee))


- **(bundler)** Fix pass ordering (#1363) ([767f21e](https://github.com/swc-project/swc/commit/767f21e9ddf037cc429df7ec52ce45b94c6b9fe9))


- **(bundler)** Prevent hanging (#1369) ([0d130f8](https://github.com/swc-project/swc/commit/0d130f8103527d018a15c97680431acfab766a4d))


- **(es)** Fixes for type checker (#1359) ([93a1914](https://github.com/swc-project/swc/commit/93a19140a8dd845a0f0601e5f2efca0196d105a8))


- **(es/ast)** Compilation (#1357) ([2921b90](https://github.com/swc-project/swc/commit/2921b903d7e07edebe221ad0dc2ef46c9ebf3f3e))


- **(es/ast)** Fix EqIgnoreSpan (#1360) ([947f9c5](https://github.com/swc-project/swc/commit/947f9c56411cb6cee6cdc8370d01f986d9825245))


- **(swc)** Fix bugs for v1.2.47 (#1368) ([af25a88](https://github.com/swc-project/swc/commit/af25a889026a84b385272e4d288b9dc83d0433de))

### Features



- **(es/transforms/typescript)** Strip out type-only namespaces (#1361) ([78e79a7](https://github.com/swc-project/swc/commit/78e79a7acec59ae6e9a5818aa369b7b3b4cf1781))


- **(node-swc)** Support windows ia32 arch (#1367) ([ca417e9](https://github.com/swc-project/swc/commit/ca417e9d59d8d7ae591963bf8073fdfa3017143d))

## [1.2.46] - 2021-01-24

### Bug Fixes



- **(bundler)** Publish ([ebc0d0a](https://github.com/swc-project/swc/commit/ebc0d0a203ce683957e5aca3ab273f39a011adb8))


- **(bundler)** Fix bugs (#1342) ([17f17e8](https://github.com/swc-project/swc/commit/17f17e82e67983d5bb3cb91f90d862fae7b76ef3))


- **(bundler)** Fix bugs (#1346) ([6a1c3da](https://github.com/swc-project/swc/commit/6a1c3da3264a3ca5482134efb90744f4fd7ca296))


- **(es)** Fixes for the type checker (#1331) ([613a5a4](https://github.com/swc-project/swc/commit/613a5a45dd2828739ab33dbc194b91b1a0ec0c6c))


- **(es)** Move and rename JscTarget (#1343) ([0469e3a](https://github.com/swc-project/swc/commit/0469e3a33e0a379cbdd5c2fd1d8139ef2b4da42e))


- **(es)** Fix bugs (#1347) ([d4df2ce](https://github.com/swc-project/swc/commit/d4df2cece8bd08cad314086743165ef653f016ac))


- **(es)** Fix bugs (#1353) ([b7ae896](https://github.com/swc-project/swc/commit/b7ae896bbd0a2b3052490c04d3ffe6ce7ec80511))


- **(es/transforms)** Handle enum in namespaces (#1340) ([ddc9492](https://github.com/swc-project/swc/commit/ddc9492aedd924dd14f10b70c426fd8bfe5157ad))


- **(swc)** Fix bugs (#1300) ([a9bf9bb](https://github.com/swc-project/swc/commit/a9bf9bb9e1b4e060a554ce5f7cfebe6a64d9791b))

### Features



- **(ES/transform/typescript)** Support namespace (#1325) ([6984217](https://github.com/swc-project/swc/commit/698421720014e93dcc4b1dbf39bb671be178aceb))


- **(es)** TypeScript 4.2 (#1330) ([3faefb5](https://github.com/swc-project/swc/commit/3faefb5836942062e372727503bacc099185f0e7))

### V1.2.46
- **general**: Prevent regression. (#1356) ([5c3a0b5](https://github.com/swc-project/swc/commit/5c3a0b516607941297f4eb099632b6c5294d20a2))

## [1.2.44] - 2021-01-11

### Bug Fixes



- **(bundler)** Fix bundler (#1318) ([23aebac](https://github.com/swc-project/swc/commit/23aebacadea4a724cc71318ef25a029d1feeeaaf))


- **(ci)** Insert *_bg files in @swc/wasm-web (#1305) ([895b431](https://github.com/swc-project/swc/commit/895b431f7279457b38547ed75b7e27beb75a9a09))


- **(ecmascript/transforms)** Fix dce (#1301) ([842b6f9](https://github.com/swc-project/swc/commit/842b6f953c205c32d98ee0bbdabccd79de21bf1c))

### Features



- **(ecmascript)** Remove macros (#1319) ([c83d19e](https://github.com/swc-project/swc/commit/c83d19eb2f4e39f0795e6173a0b5ba3e05e844b7))


- **(ecmascript/transforms)** Split into multiple crates. (#1311) ([76d9e2a](https://github.com/swc-project/swc/commit/76d9e2a9dfe3f5e6d4f10834c6740637f65eef44))

### Miscellaneous Tasks
- **general**: Fix website docs link (#1317) ([5d88e8b](https://github.com/swc-project/swc/commit/5d88e8ba5434bd059eb2ae91df295fb3f1fb707b))- **general**: Update actions/setup-node (#1315) ([78dc61a](https://github.com/swc-project/swc/commit/78dc61af332fe8ce796d9345a86ef7830294e135))

## [1.2.43] - 2020-12-30

## [1.2.42] - 2020-12-29

### Bug Fixes



- **(bundler)** Fix statement ordering issue (#1264) ([b66ee58](https://github.com/swc-project/swc/commit/b66ee58ee3a5c6a61d9e5bfa566eb66f9c0725fa))


- **(bundler)** Fix remaining bugs (#1296) ([ba13db5](https://github.com/swc-project/swc/commit/ba13db54db5a3c412888490bec537b9f4a9d448a))


- **(bundler)** Don't load dynamic imports (#1297) ([bc7ac45](https://github.com/swc-project/swc/commit/bc7ac45d8701a0783250ec720a9ae9dd10fb95b8))


- **(ci)** Insert *_bg files in @swc/wasm-web (#1291) (#1293) ([066bb4e](https://github.com/swc-project/swc/commit/066bb4e9c92371055f9752b7ff01aacf03f75048))


- **(swc)** Fixes for typescript type checker (#1146) ([6941f29](https://github.com/swc-project/swc/commit/6941f29943fb95a980ded584ead6dee2c630814f))

### Features



- **(ecmascript/ast)** Add EqIgnoreSpan and TypeEq (#1295) ([34249bb](https://github.com/swc-project/swc/commit/34249bbf47dfac31ded39d750a4eae24b6ba84c5))


- **(ecmascript/codegen)** Fix and use omit_trailing_semi (#1298) ([9063908](https://github.com/swc-project/swc/commit/906390852836cb130e9eeec409cb4ec1e7fb82bd))

## [1.2.41] - 2020-12-23

### Bug Fixes



- **(ci)** Fix ci (OOM & library api change) (#1284) ([0ead8dc](https://github.com/swc-project/swc/commit/0ead8dc403cd1ade73c50f39955323aea6d8349e))


- **(ci)** Publish npm packages as public (#1277) (#1290) ([dd977ff](https://github.com/swc-project/swc/commit/dd977ff80c9f439169b115e995efa6c8e93bc47e))


- **(ecmascript)** Fix bugs related to string literals (#1287) ([8a8db58](https://github.com/swc-project/swc/commit/8a8db58f1c879a269fecfbcf08813f40b580ca0f))


- **(ecmascript/codegen)** TsQualifiedName has trailing dot (#1268) ([b760c7c](https://github.com/swc-project/swc/commit/b760c7c9c7206dc4e59f58b929ad64f94c48f80c))


- **(ecmascript/lexer)** Normalize \r\n and \r to \n in template literals (#1286) ([576fb6a](https://github.com/swc-project/swc/commit/576fb6a532913f8b48ff67d66adc9b35fe8f945e))


- **(ecmascript/parser)** Fix span of `declare` decls. (#1282) ([bf69b47](https://github.com/swc-project/swc/commit/bf69b477918f42861e1511f5d6b475a5d2637580))

### Features



- **(ecmascript/parser)** Add tests for binding patterns (#1289) ([c2a9994](https://github.com/swc-project/swc/commit/c2a99944cfa35c7f7b0cdaaf264c16d05d3d39ec))


- **(fixer)** Handle ?? properly (#1270) ([ccf4c2b](https://github.com/swc-project/swc/commit/ccf4c2b12cf82f22c7d26d3c3e4581dc5a2ad320))


- **(node-swc)** Remove duplicate type and correct name (#1267) ([261e2ec](https://github.com/swc-project/swc/commit/261e2ec5ffeea3aef56f7da3be429d7d63d3db65))


- **(parser)** Don't hang on unexpected inputs (#1274) ([25856f2](https://github.com/swc-project/swc/commit/25856f230c604868aea7a957ce5f29fe82d2c8b5))


- **(visit)** Add support for Arc<T> (#1256) ([718f478](https://github.com/swc-project/swc/commit/718f47803bcfd0ff2d11bf72aaa7c34029cae789))


- **(wasm-web)** Initialize ([edf74fc](https://github.com/swc-project/swc/commit/edf74fc1ec6543af5844c666187659700b68699e))- **general**: Specifier position in DependencyDescriptor (#1260) ([8ba2ae9](https://github.com/swc-project/swc/commit/8ba2ae959d0a44b368e26daf6a23657f83f3196c))

## [1.2.40] - 2020-12-03

### Bug Fixes



- **(regenerator)** Handle ternary correctly (#1228) ([f8a1fb8](https://github.com/swc-project/swc/commit/f8a1fb878daf603150174ca23b7e6d22d22e3b5c))


- **(source map)** Fix inline source map comment slicing (#1237) ([cdaefcc](https://github.com/swc-project/swc/commit/cdaefcc27e3c943e6ff9b98fc4ea19f0d7a1bf23))- **general**: Decorator metadata (#1248) ([2e29d78](https://github.com/swc-project/swc/commit/2e29d7828164493ec6e8e3c043325ebcd2d935e1))

### Features



- **(swc_common)** Expose non-tty EmitterWriter (#1240) ([46b553e](https://github.com/swc-project/swc/commit/46b553ecc3efd3ddcaff6531535b27526dc16781))

## [1.2.39] - 2020-11-22

### Bug Fixes



- **(typo)** Dowloads => downloads (#1222) ([723970d](https://github.com/swc-project/swc/commit/723970db1f8e0077dfd5a641f7edf87ca3053961))- **general**: Publish script ([1268206](https://github.com/swc-project/swc/commit/1268206bff17b1258e125f6214f8d9b2b1dc42a3))

### Features
- **general**: Macro for fixture testing (#1226) ([ad23a58](https://github.com/swc-project/swc/commit/ad23a58fed924747a4175b22f0ba49db40a9dd2d))

### Bundler
- **general**: Fix issues (#1212) ([4294b5e](https://github.com/swc-project/swc/commit/4294b5e7ba41b74ff731df3b524155a60fd434a9))

## [1.2.38] - 2020-11-08

### Bug Fixes
- **general**: SourceMap::span_to_lines for empty file (#1198) ([546a01c](https://github.com/swc-project/swc/commit/546a01cdc2f7dbe4bda06a2f3440c117136b72a8))

### Bundler
- **general**: Improve hook for import.meta (#1195) ([3cdb62b](https://github.com/swc-project/swc/commit/3cdb62bfd85f537e91918c39bb216a04c9a569ca))- **general**: Use a local variable for import.meta (#1201) ([64942b5](https://github.com/swc-project/swc/commit/64942b50065226bdd56bfc700a764b1e72d12892))- **general**: Handle swc helpers (#1199) ([0a5e23f](https://github.com/swc-project/swc/commit/0a5e23f97c30d7ee72b8faaddfc697e33e3cdd4d))

### Resolver
- **general**: Handle class declarations (#1200) ([f21a288](https://github.com/swc-project/swc/commit/f21a28844dd819f22cef87c9e0e285e9482afcf0))

## [1.2.37] - 2020-10-29

### Ast
- **general**: Add support for fuzzing (#1167) ([11d137a](https://github.com/swc-project/swc/commit/11d137ac1121d505bdcceebabe9f75b2b77f6b18))

### Bundler
- **general**: Allow importing and exporting from same module (#1152) ([f0ea70c](https://github.com/swc-project/swc/commit/f0ea70cb25e571ad81fc7027e61f69b69edec5ab))- **general**: Fix bugs (#1154) ([6f00620](https://github.com/swc-project/swc/commit/6f006208ac555ef02aac7a1c8c09dff124564e8c))- **general**: Fix dead code elimination (#1157) ([5a91ab9](https://github.com/swc-project/swc/commit/5a91ab994c5daa6920df7986e8694df906011243))- **general**: Handle computed accesses correctly (#1159) ([ad7cb65](https://github.com/swc-project/swc/commit/ad7cb6544d1ff019243f40fa87f59843d7b2151d))- **general**: Make output deterministic (#1166) ([41d1738](https://github.com/swc-project/swc/commit/41d1738b822ee44b664f152c69724184d2238cad))- **general**: Fix ordering (#1171) ([626c881](https://github.com/swc-project/swc/commit/626c881c981ecf6e8102409171b66174737b7e19))

### Codegen
- **general**: Preserve space for postfix unary operators (#1185) ([6e9d06e](https://github.com/swc-project/swc/commit/6e9d06e95a31c15cb856377591d05f9be3c8b5f1))

### Parser
- **general**: Remove unnecessary question mark (#1174) ([fd760fb](https://github.com/swc-project/swc/commit/fd760fbf09e7632ba2f3f66e20377a4b5f545568))

### Transforms
- **general**: Fix _typeof helper  ([6b03c65](https://github.com/swc-project/swc/commit/6b03c659caba37693a8f0eb86ac98112884b70d8))

## [1.2.36] - 2020-10-06

### Bundler
- **general**: Fix bugs (#1141) ([c127cb2](https://github.com/swc-project/swc/commit/c127cb2b48e6ad2301f7ea67184a78b0621994cb))

## [1.2.35] - 2020-10-04

### Bug Fixes



- **(jsx)** Drop extra spaces around jsx attributes (#1121) ([ea09133](https://github.com/swc-project/swc/commit/ea091337d80760df6e09bce90ed3906ecb3e7626))


- **(strip)** Don't treat type-only exports as concrete references (#1126) ([e4b8a0c](https://github.com/swc-project/swc/commit/e4b8a0cc1eed8de5d7f8f9706ced5acc56f6c15e))

### Bundler
- **general**: Fix bugs (#1105) ([9879fa5](https://github.com/swc-project/swc/commit/9879fa59c87d1f54bde7413a9ca49e40ffd65b38))- **general**: Fix extra bugs (#1127) ([205ce4e](https://github.com/swc-project/swc/commit/205ce4ebe2bc300f66bb4e82de7a128b91e0425c))

## [1.2.34] - 2020-09-24

## [1.2.33] - 2020-09-24

### Bug Fixes



- **(strip)** Fix Config::import_not_used_as_values (#1101) ([a9c3072](https://github.com/swc-project/swc/commit/a9c3072b651fec425b569829fb75012e93282115))

### Miscellaneous Tasks
- **general**: Bump version of wasm (#1102) ([73671ec](https://github.com/swc-project/swc/commit/73671ecd90900194f87a39947f37ce15a8675ea9))

## [1.2.32] - 2020-09-22

### Codegen
- **general**: Fix for jsx (#1097) ([7e8ff1d](https://github.com/swc-project/swc/commit/7e8ff1d342b43231ad273631a45517413e0add41))

## [1.2.31] - 2020-09-22

### Bundler
- **general**: Handle export * properly (#1083) ([fa756a1](https://github.com/swc-project/swc/commit/fa756a1b4819e4f2966f152204afd91b80450cec))

### Resolver
- **general**: Handle pattern in lhs of for of/in correctly (#1089) ([ac0a19c](https://github.com/swc-project/swc/commit/ac0a19c0e84c612b0ca0ee06b463143f4abedccf))

### Wasm
- **general**: Automatic deployment (#1084) ([7905b0d](https://github.com/swc-project/swc/commit/7905b0dcf5afaf9a465e54b6dbae211627a48ad0))

## [1.2.30] - 2020-09-18

## [1.2.29] - 2020-09-18

### Bundler
- **general**: Fix for deno (#1078) ([24c597f](https://github.com/swc-project/swc/commit/24c597f097235c9756a5d8d6e1e2bdf76b3261cb))

### Typescript_strip
- **general**: Option to remove completely unused imports (#1060) ([bc82b55](https://github.com/swc-project/swc/commit/bc82b5567e2abb9c56aa3b537354b021f4b04a6e))

## [1.2.28] - 2020-09-13

## [1.2.27-alpha.1] - 2020-09-13

### Cjs
- **general**: Fix import order (#1069) ([8a01729](https://github.com/swc-project/swc/commit/8a0172912e963d0fa274af0ea262d27feff68ad8))

### Parser
- **general**: Parse member expression is object patterns (#1068) ([0972db9](https://github.com/swc-project/swc/commit/0972db98a1d4f592e1030e20d71996a65e8d4dd1))

### Resolver
- **general**: No additional scope for function child (#1070) ([f029115](https://github.com/swc-project/swc/commit/f029115914969d3949f77322519d3030fdbe17d9))- **general**: Correctly set in_type (#1071) ([4d5a0da](https://github.com/swc-project/swc/commit/4d5a0dacec80b2e0fdba1781ffef80aeaaa9cc49))

## [1.2.26] - 2020-09-11

## [1.2.25] - 2020-09-11

### Bug Fixes
- **general**: Handle conditional expression in callee (#1051) ([9be8bf6](https://github.com/swc-project/swc/commit/9be8bf671d27033df7d535840dfe2b54a12792b2))

### Codegen
- **general**: Don't emit newline after a block comment (#1062) ([2fff66d](https://github.com/swc-project/swc/commit/2fff66d985b53412322ed37f8549d0668336fc52))

### Common_js
- **general**: Change order of exports (#1057) ([dc4c92c](https://github.com/swc-project/swc/commit/dc4c92c9da148c4a8a4617ad7e3bafedbbd5af97))

### Jsdoc
- **general**: Fix parser (#1059) ([09e3f96](https://github.com/swc-project/swc/commit/09e3f96a3e6e524360d6bff1b4520d5163780f88))

### Resolver
- **general**: Handle constructor properly (#1054) ([e2546e0](https://github.com/swc-project/swc/commit/e2546e0100683b13c51345bea80affbe6941476a))- **general**: Fix handling of constructor parameters (#1056) ([aec155b](https://github.com/swc-project/swc/commit/aec155b58fdc61928f0a4e25c3405932d751a3f9))

## [1.2.24] - 2020-09-08

## [1.2.23] - 2020-09-07

## [1.2.23-alpha.1] - 2020-09-07

### Bug Fixes



- **(dep_graph)** Top level dynamic import (#1024) ([c4cc433](https://github.com/swc-project/swc/commit/c4cc4334348a633ced02976c8ac584448253e63c))- **general**: Expose dep_graph crate (#1023) ([9a073f1](https://github.com/swc-project/swc/commit/9a073f10a58270d66b6fd745ca29f3400ea70797))- **general**: Handle binary expression in callee of new (#1030) ([6524802](https://github.com/swc-project/swc/commit/6524802ae526bf2437c7025d0ed2e79a92ad66eb))

## [1.2.22] - 2020-08-30

## [1.2.22-alpha.2] - 2020-08-30

## [1.2.22-alpha.1] - 2020-08-30

## [1.2.21] - 2020-08-24

## [1.2.20] - 2020-08-15

### Hygiene
- **general**: No ref-ref conflict (#963) ([01aeec3](https://github.com/swc-project/swc/commit/01aeec39ca2a999bc1960a45dc5407cd6f51712b))

### Spack
- **general**: Allow using jsx (#971) ([7387872](https://github.com/swc-project/swc/commit/73878728aa919234f8219c912fe34981c993be13))

## [1.2.19] - 2020-08-13

## [1.2.17] - 2020-08-10

## [1.2.15] - 2020-08-09

## [1.2.14] - 2020-08-08

## [1.2.13] - 2020-08-07

## [1.2.12] - 2020-08-06

## [1.2.11] - 2020-08-02

## [1.2.10] - 2020-07-31

### Bug Fixes
- **general**: Readonly is not stripped from private prop (#916) ([9cb32cb](https://github.com/swc-project/swc/commit/9cb32cbb7581a2c967d189afa7b0ca7311180f92))

### Codegen
- **general**: Preserve quotes (#911) ([ca43112](https://github.com/swc-project/swc/commit/ca43112d2acbf528dcaf7c638539762c6ef15a9b))

## [1.2.9] - 2020-07-26

### Cleanup
- **general**: `native` (#887) ([68799d7](https://github.com/swc-project/swc/commit/68799d74efc10261c4224bf992cc8db353584c2d))

### Spack
- **general**: Remove_item is deprecated (#881) ([053f81c](https://github.com/swc-project/swc/commit/053f81c7613a3c49e42435790a8a047e4df2e68e))

## [1.2.8] - 2020-07-05

## [1.2.7] - 2020-07-01

### Spack
- **general**: More extensions for node resolver (#842) ([aea757d](https://github.com/swc-project/swc/commit/aea757d369898aac573454ada6074d03084e59e4))- **general**: Enhancement (#845) ([31020e4](https://github.com/swc-project/swc/commit/31020e46d8f87eaee4bb4100cb6b660c4998e8cc))- **general**: Modules (#848) ([66d42ad](https://github.com/swc-project/swc/commit/66d42adf7eddb9af4fb664c5297c2adb7fc0805c))

## [1.2.1] - 2020-06-14

## [1.2.0] - 2020-06-14

### Spack
- **general**: Super-fast bundler (#825) ([fcef201](https://github.com/swc-project/swc/commit/fcef2016951a1040ef8b9e62271e98c4b85b71b8))

## [1.1.58] - 2020-06-12

### Regenerator
- **general**: Handle yield* correctly (#833) ([5022999](https://github.com/swc-project/swc/commit/5022999600bf443cd29ebff2b9c7bb3497da0449))

## [1.1.56] - 2020-06-10

## [1.1.53] - 2020-06-03

## [1.1.52] - 2020-06-02

## [1.1.51] - 2020-05-28

## [1.1.50] - 2020-05-28

## [1.1.49] - 2020-05-28

## [1.1.48] - 2020-05-23

### Typescript_strip
- **general**: Handle types used only in casts (#794) ([f117fed](https://github.com/swc-project/swc/commit/f117fedad890b7968ff5070853aca50371b1a6af))

## [1.1.46] - 2020-05-21

### Resolver
- **general**: Handle body of arrow functions correctly (#790) ([5cc3efa](https://github.com/swc-project/swc/commit/5cc3efa851652235d10b6fbb4258c645a4edeb7c))

## [1.1.45] - 2020-05-19

## [1.1.44] - 2020-05-18

## [1.1.42] - 2020-05-09

### Dce
- **general**: Separate phase for dropping imports (#764) ([ddc5ace](https://github.com/swc-project/swc/commit/ddc5ace570d0e860901816c68d6b55c2ce8834ec))

## [1.1.41] - 2020-05-05

## [1.1.40] - 2020-04-30

## [1.1.39] - 2020-04-10

## [1.1.38] - 2020-04-05

## [1.1.37] - 2020-03-28

## [1.1.36] - 2020-03-26

## [1.1.35] - 2020-03-13

## [1.1.34] - 2020-03-09

## [1.1.33] - 2020-03-05

## [1.1.32] - 2020-03-04

## [1.1.31] - 2020-03-01

## [1.1.30] - 2020-02-29

## [1.1.29] - 2020-02-25

### Resolver
- **general**: Handle hoisting correctly (#689) ([363b835](https://github.com/swc-project/swc/commit/363b8353cf274bb134a0cbbc67ece27a63313a8b))

## [1.1.28] - 2020-02-22

## [1.1.27] - 2020-02-20

## [1.1.26] - 2020-02-19

### Resolver
- **general**: Handle method property correctly (#679) ([f79223e](https://github.com/swc-project/swc/commit/f79223e98c6a133457305d39baf53ff51c2009f9))

## [1.1.25] - 2020-02-17

## [1.1.24] - 2020-02-15

## [1.1.23] - 2020-02-13

## [1.1.22] - 2020-02-13

## [1.1.21] - 2020-02-11

## [1.1.19] - 2020-02-07

## [1.1.18] - 2020-02-06

## [1.1.17] - 2020-01-30

## [1.1.16] - 2020-01-24

### Block_scoping
- **general**: Handle variable infection (#610) ([480015d](https://github.com/swc-project/swc/commit/480015d407c74f12f8454e553dd8e65e131ab0ce))

## [1.1.15] - 2020-01-24

### Hygiene
- **general**: Fix handling of special identifiers (#603) ([9be9ea2](https://github.com/swc-project/swc/commit/9be9ea2c430f34d8d447cbca0a4fb1a5b3ec2b13))

## [1.1.14] - 2020-01-23

### Bug Fixes
- **general**: Fix as_bool treating bitor like bitand (#596)

 ([08ce8d0](https://github.com/swc-project/swc/commit/08ce8d029323c8c7685739d188c27c7d5d965b64))

### Hygiene
- **general**: Handle use-use conflict (#599) ([8ecbe14](https://github.com/swc-project/swc/commit/8ecbe14207156c2fc34b29c63bb52f8ba303afce))

### Regenerator
- **general**: Allow nested finally block (#601) ([20e37ea](https://github.com/swc-project/swc/commit/20e37eae5d579b91576dc93afe94e615f54832bd))

## [1.1.13] - 2020-01-17

### Resolver
- **general**: Handle methods correctly (#579) ([b7f8282](https://github.com/swc-project/swc/commit/b7f8282eb1c92f20ad0d846c0314ca758bfdad43))

## [1.1.12] - 2020-01-08

### Dce
- **general**: Preserve nested if statement (#565) ([3e0f4a5](https://github.com/swc-project/swc/commit/3e0f4a5bd7d247d9ac69ac8bb537a33eadc85f53))

## [1.1.11] - 2020-01-02

## [1.1.10] - 2019-12-28

## [1.1.9] - 2019-12-25

## [1.1.8] - 2019-12-24

## [1.1.7] - 2019-12-21

## [1.1.6] - 2019-12-14

### Bug Fixes
- **general**: Fixup! Add a test for #503
 ([5076249](https://github.com/swc-project/swc/commit/5076249c907f53235778d6b44d6b83d433b88829))

### Parser
- **general**: Respect jsc.target (#507) ([332061f](https://github.com/swc-project/swc/commit/332061f44dcad267a4d011ef7fc6cd35159586dd))

## [1.1.5] - 2019-12-11

## [1.1.4] - 2019-12-09

## [1.1.2] - 2019-12-02

## [1.1.1] - 2019-12-01

## [1.1.0] - 2019-11-30

### Bug Fixes
- **general**: Fixup! Don't omit empty values while serializing
 ([41c6941](https://github.com/swc-project/swc/commit/41c6941dc5b30b701eb1e536983892d8862fe26e))

## [1.0.54] - 2019-11-24

## [1.0.53] - 2019-11-23

### Resolver
- **general**: Handle arrow expression correctly (#462) ([fa941b3](https://github.com/swc-project/swc/commit/fa941b3ea3d5b8073f8fc33311231d7c71229e01))

## [1.0.52] - 2019-11-20

### Resolver
- **general**: Handle hoisting (#455) ([2106860](https://github.com/swc-project/swc/commit/210686011d8890bfae702687de3172cb52178d02))

## [1.0.50] - 2019-11-18

### Parser
- **general**: Error recovery (#449) ([d074063](https://github.com/swc-project/swc/commit/d0740638671d6572d753324a6abec8340037af6d))

## [1.0.49] - 2019-11-15

## [1.0.48] - 2019-11-10

### Bug Fixes
- **general**: Fix typo
 ([d73de6c](https://github.com/swc-project/swc/commit/d73de6c5d807946e37df7575f546088d8575b8dc))- **general**: Fix typo
 ([06d2be4](https://github.com/swc-project/swc/commit/06d2be43c385d6ac7f1e9390b861a9a00b9e3a11))- **general**: Fix links and use sudo
 ([9ec8856](https://github.com/swc-project/swc/commit/9ec8856136d9264cd71159f300bf37bc17cf2786))- **general**: Fix tests
 ([92c7def](https://github.com/swc-project/swc/commit/92c7defc2e726fa2485bd545f596e33890b7627d))- **general**: Fixup! fix tests
 ([59f11a8](https://github.com/swc-project/swc/commit/59f11a83d16a82b1861a5bd6720ab264896028c4))- **general**: Fix

It's not rust code..
 ([f8ea0bd](https://github.com/swc-project/swc/commit/f8ea0bdfea5d9ae732e7f56f2dc0127685f07598))- **general**: Fix parser tests
 ([dc8e178](https://github.com/swc-project/swc/commit/dc8e178088ae0d0dfacbc35419b7a61c4d0c1d5e))- **general**: Fix link
 ([ed6ba04](https://github.com/swc-project/swc/commit/ed6ba04cf37c1c4f4b989f75beec2647d5c8381f))- **general**: Fix swc_ecma_codegen
 ([fd79f4e](https://github.com/swc-project/swc/commit/fd79f4eb78e182b289d13051e93a840d8738331f))- **general**: Fix a link in README.md
 ([d4ef56e](https://github.com/swc-project/swc/commit/d4ef56eb5b66c043e5b8cc5a84a8275cda04bd7c))- **general**: Fix a bug
 ([90135ed](https://github.com/swc-project/swc/commit/90135ede1ebffd6328929ac82aedd1716a03f7ef))- **general**: Fix test imports for latest nightly (#355)

 ([6f97012](https://github.com/swc-project/swc/commit/6f970128219af125f839bf11785d5eb351dd06cb))- **general**: Fix lints
 ([fbbafc5](https://github.com/swc-project/swc/commit/fbbafc5712356135e9714f1f281c93d3530a17c1))- **general**: Fix `this` in async generator (#425)

swc_ecma_transforms:
 - Don't delete test file when an execution test fails
 - fix #400
 ([3a637d4](https://github.com/swc-project/swc/commit/3a637d422944b5e983fd4befb21586034efb2552))- **general**: Fixup! Bump versions
 ([2add7a0](https://github.com/swc-project/swc/commit/2add7a08ef422e06b3b7bb9bb1c6d657a44278a7))

### Miscellaneous Tasks
- **general**: Cleanup for docs; no email from travis ([056a11d](https://github.com/swc-project/swc/commit/056a11dd06c35dff6a6531890124876ba7c811bf))

### Simplify
- **general**: `left.rhs * right` is only safe when operators are the same ([07bf194](https://github.com/swc-project/swc/commit/07bf194e61b922421584026d033c885cd44e2be1))

### Es2015
- **general**: :destructuring pass (#312) ([b4a391b](https://github.com/swc-project/swc/commit/b4a391b3a7e0d2f70bd8b4c101f7ce4747b72441))

### Readme
- **general**: Fix npm install command (#89) ([946a32a](https://github.com/swc-project/swc/commit/946a32adf86e61951adfb45b7d0cce24672d8456))

### Swc_ecma_ast
- **general**: - Split class member / property into separate types ([a46804a](https://github.com/swc-project/swc/commit/a46804ab48a54c46a35d719507822f207cb296fa))

### Swc_ecma_transforms
- **general**: - remove this parameter from typescript::strip pass (fixes #236) ([4fddea0](https://github.com/swc-project/swc/commit/4fddea0bbd750fdc6658d3e092366b3fecf3c899))

### Travis
- **general**: Fix doc upload (#47) ([bbd9ec9](https://github.com/swc-project/swc/commit/bbd9ec9eb98f08a279a0ee70105e816f2aac41c7))- **general**: Don't cache docs ([4e21eb1](https://github.com/swc-project/swc/commit/4e21eb160d69e423d45d39ae1cba7f1e0cf264f4))

<!-- generated by git-cliff -->
