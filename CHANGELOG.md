# Changelog
## [unreleased]

### Bug Fixes

- **(build)** Increase memory ([d600d52](d600d521573ef6c829551deb635170ef290a4cb3))
- **(bundler)** Prevent infinite loop (#1872) ([ea93e1d](ea93e1d1be8f13f09233326fcbc78f906960c0e8))
- **(bundler)** Prepare renaming of bundler (#2066) ([883c1ac](883c1ac4e4875c65b866aecdd122ca9514c62139))
- **(bundler)** Fix stack overflow (#2080) ([f8aa050](f8aa0509ceda03128f19549a517f30570507205f))
- **(bundler)** Fix handling of reexports from cjs modules (#2143) ([b027824](b0278242ba7b081ba1a48d221f955b4513a50a62))
- **(bundler)** Fix name of helper (#2518) ([5afedf8](5afedf83c96eff47a22c93b2ca98d8a5bc72f0ec))
- **(bundler)** Fix bundler (#2510) ([cead404](cead404a537658ee688922aa087abd61bd1681fd))
- **(bundler)** Ignore `require` of external modules (#2840) ([c8de935](c8de935560eac5cac557e1f641447143efcb8f53))
- **(bundler)** Use interop for common js dependencies (#2930) ([24de550](24de5507ae5c5774a6a329f79519b37461ce5145))
- **(ci)** Use cross-env (#1897) ([04d4384](04d43844821bfea4de40f14e58a10e6f7a42f147))
- **(ci)** Fix CI (#2003) ([a4fb114](a4fb1148211a5ab92063e059ea3b0ab08414631c))
- **(ci)** Publish v1.2.86 (#2235) ([f78a504](f78a5048066db357181e815ab5e3d7447ac7263a))
- **(ci)** Publish (#2250) ([cab37f8](cab37f816646f824b526fe8f888ac33953b24dbf))
- **(ci)** Fix freebsd builds (#2944) ([a93f111](a93f1111f91aec042dd65f192001a0897a400717))
- **(common)** Remove potential race condition (#2001) ([080b1fa](080b1fa3ac666b80377b9de2ebbe40578f96b9fb))
- **(common)** Fix sourcemap (#2457) ([9ba68c6](9ba68c68639916b48b79ad831e3cf69d7b0c8051))
- **(common, node/swc)** Allow inlining `sourcesContent` (#2245) ([48d6103](48d61039d24aaef688bf0d573d6f6037366c5eec))
- **(css)** Fixup (#2138) ([81061a9](81061a91bbc50c340880e389ca21b090378d14d6))
- **(css)** Reexport codegen from `swc_css` (#2314) ([36c8312](36c83127e8ccee1bd4378358e52171609b08c757))
- **(css)** Change the type of the source of `@import` rules. (#2363) ([cf1235e](cf1235ece10ec889aac6eddc49b879e2c44f4e80))
- **(css)** Handle custom properties properly (#2869) ([c94735e](c94735e540e7a5995d912761df7b68e8b70dce2c))
- **(css)** Fix `stylis` (#2987) ([c8395bc](c8395bc74f82ffd2a37611408ec7cee963cfc99e))
- **(css/ast)** Fix typo (#2298) ([75c930c](75c930caf19da8c15f118ce7a1dfc5c17ac0ea4f))
- **(css/ast)** Fix delimiter token (#2415) ([e2e4f2f](e2e4f2f64f59f9fa98c521dda223bf3d7fef3490))
- **(css/ast)** Use correct type for units (#2464) ([5234530](5234530cd5aca55a72f7c0530d222acdd1a5f73c))
- **(css/ast)** Fix AST definitions for `@keyframes` (#2848) ([ce6c7ee](ce6c7ee85dd03db675373cdedf691698f189335e))
- **(css/ast)** Fix type definition of `@namespace` (#2919) ([0f4ad0f](0f4ad0f8c805d838b7c6d2119f3f426f1c73f3fe))
- **(css/ast)** Fix type definitions related to parsing unknown at-rules (#2922) ([8781527](87815277515041eb5874b68775096ecd75b2672f))
- **(css/lexer)** Fix some edge cases (#2612) ([c89a9ea](c89a9ea171a7edd02fa66d84a5be9ed27f89e8c7))
- **(css/lexer)** Exclude whitespace from spans (#2702) ([0b10423](0b1042354cb3a0e29c6841da7054abe1af67aad7))
- **(css/parse)** Fix parsing of pseudo elements and pseudo classes (#2672) ([465c188](465c18860e56417d1aacde0a448def182c23c742))
- **(css/parser)** Fix parsing of selectors (#2217) ([d8ae4c4](d8ae4c4e901a42e94d600367da1ddf666e732f71))
- **(css/parser)** Fix parsing of selectors (#2221) ([a9573b9](a9573b9a5fe4be74d6b5fa96d812a18f623d0254))
- **(css/parser)** Allow @at-rules to be lowercased (#2274) ([9eb45e8](9eb45e851551fbaff325b575b5e76223c5630b3a))
- **(css/parser)** Fix parsing of url (#2280) ([b5ad03d](b5ad03d0b179bdcf32f4aad64b760e4035cec0bf))
- **(css/parser)** Fix parsing of `!important` (#2286) ([2f4da9a](2f4da9a8ff418aa7c131a3f4a8d7b2ee72bd2b95))
- **(css/parser)** Fix error recovery logic of property values (#2331) ([9f4c5b7](9f4c5b7ba55a7310c410133e446790a4ad5ad99a))
- **(css/parser)** Fix parsing of funxtion named `url` (#2350) ([6863d96](6863d9624ecec469d1f8905853e5e5c60837fd15))
- **(css/parser)** Fix parsing of comments (#2414) ([f7b065e](f7b065ef0b4d7efa08138cbf97b718c401484795))
- **(css/parser)** Fix parsing of numbers (#2444) ([4f2dbd8](4f2dbd816c12b9e5f86883d326e576d429f61b9d))
- **(css/parser)** Fix parsing of url (#2484) ([d83bde8](d83bde8ca5be3536632a51c9143f414879aeaf13))
- **(css/parser)** Resolve some TODOs (#2572) ([47f7f1a](47f7f1ad4fdf79f0ea6e406474cc518ee55a5d98))
- **(css/parser)** Exclude whitespace from span (#2659) ([a8e4c72](a8e4c72f33858bb7dca4af5881285ac8337376f7))
- **(css/parser)** Fix parsing of escaped characters (#2700) ([d8ddb2f](d8ddb2fb99f5eddedf370c46bb6b49b5d87c9ecb))
- **(css/parser)** Fix parsing of whitespaces (#2787) ([e32093e](e32093e72d6f37b3ab2c2ef5b5e9bd3007177e64))
- **(css/parser)** Fix span of type selectors (#2870) ([c40e134](c40e1347135b3df4793b7f4c030ae69330e75030))
- **(css/parser)** Fix lexing of value starting with `-` (#3011) ([e0c8bbf](e0c8bbf7a0b24f3fe36f04886346a4709b5e09d9))
- **(dev/cli)** Remove CLI from main swc repositoy (#2393) ([897f4b6](897f4b670eba7f7445b0cab7c481a7baf8da70c6))
- **(es)** Ensure that #1681 is fixed (#1970) ([6285f20](6285f20cfaa76abbc34cb519a429edc04e8247e2))
- **(es)** Fix bugs (#2004) ([81abfe5](81abfe55d6e18cb116ba8b885580570c0b25b87a))
- **(es)** Fix codegen & minifier (#2006) ([48bc26d](48bc26d3c93e64174b3d1cd269205a98b1581a0c))
- **(es)** Fix bugs (#2055) ([72c9f43](72c9f4373aa4e3ddf40c5f1c5ac2a89198b471fa))
- **(es)** Fix simple bugs (#2077) ([949a4d9](949a4d9716a0e86318bcf1987e6bbdcad10c62b6))
- **(es)** Fix source map (#2159) ([d975a19](d975a197c906ba90485b6180ddcaf230f39170e0))
- **(es)** Fix some easy bugs (#2166) ([97514a7](97514a754986eaf3a227cab95640327534aa183f))
- **(es)** Fix easy bugs (#2178) ([c0b0337](c0b0337d1df6093a62bc5eb806c68e1a2b4adb8e))
- **(es)** Fix bugs (#2222) ([2c47778](2c477780f05eb8272414bddf5e3a80e1bf086e85))
- **(es)** Fix bugs (#2256) ([ce01b8a](ce01b8a9b7249a961e02ce7c4bb1c9ead8f314b5))
- **(es)** Fix performance bugs (#2313) ([6a41e9a](6a41e9a0bea739e55ca3f61e230b9ab07d6b6f3e))
- **(es)** Fix bugs (#2403) ([6366d05](6366d05fd31b15d195d464fc253e7ac96a5cc80a))
- **(es)** Fix bugs (#2447) ([ee9177b](ee9177b75336b8db3e8376aacd25aecfdfb1cdd7))
- **(es)** Fix bugs (#2469) ([c9437d3](c9437d32265f322275bcfef5bd85149bd5bc7600))
- **(es)** Fix simple bugs (#2495) ([eef3d6e](eef3d6e3fbbf334810a8f908f9da63fe74c7caaf))
- **(es)** Fix `paths` support (#2712) ([1d028fe](1d028fe940566c53fb30313bc2ff0ac28d33351a))
- **(es)** Move `TargetEnv` to loader from ast (#2719) ([665c8e0](665c8e05fc05b411544cea0b64e056bfbec7370a))
- **(es/ast)** Fix handling of reserved words (#1891) ([7634106](76341068d05aa2ab130d559e10354103fc99ecd5))
- **(es/codegen)** Fix codegen of template literals (#1936) ([39ee7b9](39ee7b962d3295f951633140944053d739eb8bc6))
- **(es/codegen)** Remove extra space of import decl (#1975) ([ef4bb31](ef4bb314b90ca41055a352185896262859dc7ec8))
- **(es/codegen)** Fix codegen of `~` (#2104) ([6896a83](6896a83d5493d45f7fb1399d151449c8de24678f))
- **(es/codegen)** Fix sourcemap (#2142) ([427df9a](427df9a979dee9f0737c3234085a52f7a79ea19a))
- **(es/codegen)** Fix codegen of ` in synthesized template literals (#2260) ([e2d8465](e2d846556568dc43093ef61612230b7323416898))
- **(es/codegen)** Emit `static` before `readonly` (#2271) ([8e0a545](8e0a5450b10f76a86069b2535e74e277bfa442ab))
- **(es/codegen)** Fix codegen of numbers (#2317) ([bd92d89](bd92d8930619710cff97360870241bd44163a2b6))
- **(es/codegen)** Fix codegen of synthesized template literals. (#2440) ([d045244](d0452440895be0d02b85d6892eddba0a9d6193f5))
- **(es/codegen)** Escape backtick of synthesized template literals (#2453) ([de368f6](de368f6bb7656ca6a9a540e59e4ccf700806e52a))
- **(es/codegen)** Fix sourcemap (#3003) ([a3bd6ae](a3bd6aea54f8ad6eacbcb1cb67cb19c6c1cd2be8))
- **(es/codegen, es/transforms/typescript)** Fix bugs (#2383) ([2c058cb](2c058cb124d0f53a9de3e6e441f935b2451aa29d))
- **(es/compat)** Fix order of transforms (#2629) ([550584f](550584f93c96d41ac4cf676ad6eb3c8fe1c81e5c))
- **(es/compat)** Preserve constructor parameters (#2975) ([f052a65](f052a65bf3b79928be5263428f620eb11614f8f4))
- **(es/compat)** Fix for synthesized template literals (#2994) ([6a7ad92](6a7ad9239ea2fc12fc4ffe8de51d971c2f42422e))
- **(es/dep_graph)** Fix parsing of import assertions (#3005) ([819fc88](819fc88a19a927091e8ce093d9eab518da039138))
- **(es/fixer)** Preserve more parens (#2553) ([97b5a73](97b5a738c2735c9b689123f402cda4c286b53691))
- **(es/hygiene)** Reduce renaming (#2938) ([4d993c2](4d993c26b61e208d07b7299fbc4bff3e65067207))
- **(es/lexer)** Fix parsing of interpreter (#2589) ([52318a4](52318a4a8e76897d3658b5a1b1b0b0d4c55acd87))
- **(es/lexer)** Fix handling of jsx escapes (#2723) ([11d1fa5](11d1fa56c073c21aeb2b427ed39b2f0f6a00b558))
- **(es/lexer)** Fix lexing of hexadecimal escape sequences (#2838) ([cf777c5](cf777c5ba11af3fd383f7c5ee9b3291c42a6ebea))
- **(es/loader)** Fix node resolver (#2172) ([5d70283](5d702835e8c3623dfd604757d7a57f16ad672fb6))
- **(es/loader)** Improve handling of `base_dir` (#2182) ([361bc70](361bc70065e3bf313a139a834106a933874f8ee1))
- **(es/loader)** Fix support for `jsc.paths`. (#2227) ([9eafd0c](9eafd0c6c41f86c5244f7346ab22382212b7c1c4))
- **(es/loader)** Add more built-in modules (#2760) ([fdd6eaa](fdd6eaaa9b600ceb8a2aaec30379b8f3680e0557))
- **(es/minifer)** Fix handling of callable expressions (#2379) ([ab687a0](ab687a0f98c823196fdcfe415f4a82dca32382df))
- **(es/minifer)** Fix bugs (#2397) ([98cc79a](98cc79a2becb2218c5c4dffced12838dc5bf844c))
- **(es/minifier)** Fix minifier (#1985) ([be23e66](be23e66ca807caacbaaa69f8b1cdfed549822677))
- **(es/minifier)** Improve output of minifier (#1990) ([f44e25c](f44e25c3afba2470e8013b757a6bacf30614b1f9))
- **(es/minifier)** Improve output of minifier (#2005) ([68608db](68608db0b3c68b3a0fc67edaf84cbf55a29bad7c))
- **(es/minifier)** Fix bugs and implement more rules (#2032) ([9793926](9793926cc8fc8110b2e4fcbe6c488b33d374a935))
- **(es/minifier)** Fix bugs of the minifier (#2052) ([a7cb2ab](a7cb2aba9d2a6eb0823768ab685fac9a12104050))
- **(es/minifier)** Make use of hygiene optimizer (#2145) ([838a7a8](838a7a8b33a29ff5ea9b4257c7ba257e6814acdc))
- **(es/minifier)** Fix usage via yarn resolution (#2158) ([e468752](e468752ebcf5819839ca77e6f276bb0b9a68967c))
- **(es/minifier)** Don't drop used variables (#2272) ([3f306f0](3f306f0b795d599f4d4972543d990d654855d766))
- **(es/minifier)** Fix bugs (#2283) ([e8a1710](e8a1710a2124f8474e20a0df212eb0c3b6bcc1dc))
- **(es/minifier)** Fix minifier (#2323) ([dad7392](dad73926e6572b2395cabbe50668d149363e763b))
- **(es/minifier)** Don't optimize `new String`. (#2341) ([8403057](840305726875f250babe254d16e9f01e36305477))
- **(es/minifier)** Fix inlining into shorthand properties (#2348) ([87b20a8](87b20a8896c1b838d236b77259a84e5b80f30640))
- **(es/minifier)** Fix minifier (#2355) ([9e6a1f4](9e6a1f431b3024d75531fdc330019f3e2db3ae46))
- **(es/minifier)** Fix iteration order (#2412) ([62f7f65](62f7f655a9720a6867b549004fee291f9266597e))
- **(es/minifier)** Fix infinite loop (#2424) ([aff6670](aff66708564fc13fe1b26f922596a9ab7850ec3b))
- **(es/minifier)** Fix bugs (#2433) ([0e48284](0e48284afb30fc08f51c46788bc25c2817df7dc3))
- **(es/minifier)** Fix minification of react hooks (#2450) ([63ad4b4](63ad4b432272718f52e515b5f9c69c6f85175389))
- **(es/minifier)** Check for conditional usages while inlining (#2459) ([06ca25f](06ca25f3d040af319e6f6cbc99db6b34bffdb495))
- **(es/minifier)** Fix minifier (#2477) ([0020e16](0020e163702ce82a7dd8360391ef8fd8b0b43130))
- **(es/minifier)** Fix regexp handling (#2489) ([7c5b6ca](7c5b6cafd8fbb50d0e6506cb4b29d9ca8c8278c0))
- **(es/minifier)** Fix `join_vars` (#2494) ([cef2c86](cef2c8666e5b3159421d49667a20db2023743d52))
- **(es/minifier)** Fix minifier using `Deno` test suite (#2503) ([9e21576](9e215769cc443410a6ef84b965b7302d039030b6))
- **(es/minifier)** Improve name mangler (#2509) ([fce3b79](fce3b79e790d855f26711a4eef9bd88e67b206fc))
- **(es/minifier)** Fix minifier (#2528) ([dcf5f05](dcf5f051950ccdc26b65dc01d6f0ea8ab2bcd689))
- **(es/minifier)** Fix minifier (#2551) ([f81b60f](f81b60fd1bd2015701f5c23abb0a0680e8da761a))
- **(es/minifier)** Don't treat catch clause as a scope (#2557) ([79a426e](79a426e0d8b291c2acccbc8fa3074d8304be43fd))
- **(es/minifier)** Fix minifier (#2564) ([4b2903e](4b2903e3b4d212562df55639b1e50b1e50faecbf))
- **(es/minifier)** Fix block unwrapping issue (#2570) ([69cfa98](69cfa98c5031f01c5267caa6f833c8a485877982))
- **(es/minifier)** Fix minifier (#2597) ([306cf98](306cf989db7292387cb7369242ef0025233d775e))
- **(es/minifier)** Fix bugs of the minifier (#2610) ([9cb3bf9](9cb3bf96dc26fe80f76bbdb6d89b30368e673778))
- **(es/minifier)** Fix for `react-countup` (#2625) ([7ea4ee8](7ea4ee81c26f54546db0f245fba0e05474a8318b))
- **(es/minifier)** Fix for `@emotion/react` and `murmur2` (#2637) ([808d578](808d57822bb2f9d44ee07be6bec6b19803da61fa))
- **(es/minifier)** Fix minifier (#2711) ([df635c9](df635c9e6de3aa84e38bd82e80ca1ea365175b90))
- **(es/minifier)** Don't inline string literals if it's used multiple time (#2748) ([f2c67b8](f2c67b8caf6a767b598b350ccacd842f34e5160d))
- **(es/minifier)** Fix bugs (#2779) ([fa342a0](fa342a0067a4d67fcb9bea0a586ce9737252bc2d))
- **(es/minifier)** Don't create top level variables (#2985) ([4a7937d](4a7937d56eca08a600bec22f228c681cc7adc3f4))
- **(es/parser)** Make comments in empty file be in leading comments (#1879) ([534c0b1](534c0b19c8a1a0f65742fd650f3e781faf5a3711))
- **(es/parser)** Allow using '>' and '<' in template literal types (#1885) ([14cee03](14cee03a436d181987d325be367be8ca064ce3b2))
- **(es/parser)** Fix parsing of file with onlly shebang (#1896) ([ed274b0](ed274b02f2d9c425c5ed7e9ab2633b5fba6e4f17))
- **(es/parser)** Use correct error message (#2025) ([8a39c1d](8a39c1db9748456942012c3512269cbba6ee7426))
- **(es/parser)** Recover from `import.meta` in scripts (#2042) ([8cbbddb](8cbbddb957a267995d86e701f99aa9a214b1a570))
- **(es/parser)** Fix parsing of `function` in property names (#2076) ([b0067ad](b0067adb9cc76a401a54b4db35ecd8ce7330ce78))
- **(es/parser)** Allow using parser with stable rustc (#2084) ([1b0ef75](1b0ef756f2e0c8f9ef4222d159143309f5003e7b))
- **(es/parser)** Remove `static_blocks` from `TsConfig` (#2186) ([2f2e35a](2f2e35af6968d432c1a4dee1664a5de89069a4c3))
- **(es/parser)** Fix parsing of static blocks (#2200) ([cbc8230](cbc823031042638c99fd58692ac94527d1ab1852))
- **(es/parser)** Fix bugs (#2255) ([ca0d6dd](ca0d6ddf2e1b0c9514938580fe95f3075f0dc1a5))
- **(es/parser)** Report errors for multiple import/export specifiers without comma (#2302) ([83153a0](83153a0f8588f30a72f59525d9605035c43af4a2))
- **(es/parser)** Improve error message (#2304) ([552fc23](552fc2374d12476c81d11f7cf4362e0d8774bd1d))
- **(es/parser)** Report errors for multiple array elements without comma (#2366) ([521e671](521e6717ad0449117cfd230c41696f52fe572a78))
- **(es/parser)** Report errors for array patterns without comma (#2365) ([d65ce85](d65ce85030b2b35875c3bc69b40f0f9ec32e24cf))
- **(es/parser)** Allow using `async` as the first one in parameters (#2386) ([2379fe1](2379fe1ce064c84666939c006a172cb6c84c3bdf))
- **(es/parser)** Allow using `async` as the first one in parameters (#2388) ([be3dca2](be3dca295ba410bd287aa4ebeb53af8c9ec74bee))
- **(es/parser)** Allow `async` in `TsAsExpr` (#2395) ([4458f9c](4458f9c74d1ea3a738bb8e66dfef735e8ae1e5a0))
- **(es/parser)** Fix async function in `SeqExpr` (#2399) ([d7f570f](d7f570ff7c930c9de2aea26930566c866a68aa36))
- **(es/parser)** Ensure that comments are collected (#2407) ([4d47711](4d4771109a78b8217df318af08bb323795277f87))
- **(es/parser)** Fix class getter/setter ASI bugs (#2409) ([9446a03](9446a037cb3aed59a59c970cc49a1c83cd9fa1d6))
- **(es/parser)** Fix parsing of a property named `async` (#2485) ([3886eed](3886eeddd53147ce2d8b95ba86cf4ffd98342a5d))
- **(es/parser)** Check for more typescript class names (#2732) ([6e10168](6e101682079256ddabb5ff6b8d7943387fb43006))
- **(es/parser)** Allow `static`/`declare` to be optional class property name (#2782) ([1caa61a](1caa61a1820e2c207531aa505a1c05e27b9b118e))
- **(es/parser)** Fix span of named export (#2813) ([338b8fd](338b8fd98e871660973364ed6438b03880761616))
- **(es/parser)** Fix span of empty modules (#2827) ([9525ea1](9525ea178fc36865d296ca7936e964a0aeeb6bd7))
- **(es/parser)** Fix comments of empty modules (#2828) ([79ba13c](79ba13cbb5b40dc18276dc8847ca7b5ea683ccdb))
- **(es/parser)** Fix parser (#2903) ([c186aa4](c186aa443a4be3ede9317afc91013ee97a3fbcd5))
- **(es/parser)** Drop outdated options (#2974) ([1ea965c](1ea965cecbc35839f40b65dea44ddd2ad925efd7))
- **(es/parser, es/compat)** Transform tagged template with invalid escape sequence (#2939) ([d8c8641](d8c8641e59d987a2961f03dfb532fb78b00cc2fd))
- **(es/preset-env)** Enable "mobile to desktop" (#2907) ([5a68a36](5a68a360b46fd1c1f53927068c78b12442386295))
- **(es/react)** Implement proper `development` handling (#2741) ([ed704c9](ed704c906f6c3bd065637b8a38ce1e58de4d5e89))
- **(es/regenerator)** Fix for nested try (#2463) ([201c0fc](201c0fcfd04182533f005f2b251d896e1de63517))
- **(es/transform/compat)** Preserve more span (#2766) ([ddfc7e6](ddfc7e6e915aeef46054d36bd23acaea69f9af37))
- **(es/transform/react)** Handle TypeScript declare module (#1875) ([1a01d0f](1a01d0f2c5e20de541cc412c95bedb1b6bd51367))
- **(es/transform/react)** Allow multiple JSX pragmas in single `Comment` (#2561) ([3f5c826](3f5c826251e54370094b65b482551401d35310de))
- **(es/transforms)** Fix transforms (#1900) ([69186eb](69186eb74d836095c39d84e4d312708432a7e38b))
- **(es/transforms)** Fix decorator bugs (#1905) ([03be315](03be31592148c5664aad660a246558c393dfeb5c))
- **(es/transforms)** Fix transforms (#1909) ([104be98](104be9837b39bfd88a5ce4fcb47a7bd8915cc993))
- **(es/transforms)** Fix fixer (#1919) ([7a8ad88](7a8ad8826a0072a53993977e68b00ccabe525d01))
- **(es/transforms)** Allow using rest pattern in arrow functions. (#1926) ([a26a189](a26a18989f0f6acf0bad5adfab3c4a2cd57bddab))
- **(es/transforms)** Fix passes related to optimizations (#1942) ([21848ce](21848ce2eac1553812a831247e495eb275396ed6))
- **(es/transforms)** Fix bugs (#1950) ([204a71c](204a71ca9444a4a891563cdbddb155fe8299b9bf))
- **(es/transforms)** Strip out private method overloads (#1977) ([d64aa6f](d64aa6f80de004534074c663ff4367ce1a055119))
- **(es/transforms)** Fix bugs (#2089) ([a309b36](a309b3623657075697bd1a1c6222067ba4d998bd))
- **(es/transforms)** Fix bugs (#2181) ([ee16139](ee16139a1966bcbd6b8e52d58e06ce7d5a44b4f3))
- **(es/transforms)** Fix bugs (#2249) ([6f33c32](6f33c327cb3853e4d180ed997174636d3c5d42ab))
- **(es/transforms)** Fix for react + typescript (#2422) ([76de513](76de51333dc87e5b1c0db18b5691338279346eb7))
- **(es/transforms)** Fix detection of `this` (#2634) ([f4efd7a](f4efd7ad9276bf09e9edb7462d7fae25063fbfbf))
- **(es/transforms)** Update helpers about array (#2970) ([ae4bb42](ae4bb420ae2e8fe0fca37d08d54db27c000e905c))
- **(es/transforms/async_to_generator)** Fix handling of `this` (#2667) ([01727c0](01727c0e5a4677ad6596210e77a9389264e6f9b8))
- **(es/transforms/base)** Fix ts_resolver (#1903) ([fe7f7b6](fe7f7b691ba3a7abcb10997dedd9e8c3d05ba5fd))
- **(es/transforms/base)** Fix hygiene (#1964) ([af4cbba](af4cbbae23a948d4339e14b4ce28d1fbbb18134b))
- **(es/transforms/base)** Fix `await` expressions. (#2157) ([8c5daee](8c5daeec2ad7ad9e52e40261f7f052a64ff48ac4))
- **(es/transforms/base)** Optimize `hygiene` (#2193) ([cb2b0c6](cb2b0c671f9dec9a53df52aa34f9d8091ebecb98))
- **(es/transforms/base)** Fix `hygiene` pass (#2266) ([180dc31](180dc31550c4e12897ab4b0ad6b428e1e0d825b2))
- **(es/transforms/base)** Fix `hygiene` (#2282) ([2156364](215636412113bedb3a6554c455f36750a4f03c4d))
- **(es/transforms/base)** Fix `hygiene` (#2299) ([5e1003e](5e1003ec4c310b3ce54c5a11dc0c3169826ba184))
- **(es/transforms/base)** Fix `hyigiene` (#2421) ([8074c72](8074c72ce926c66b88588643189b4362e2683877))
- **(es/transforms/base)** Fix `resolver` (#2448) ([7ab07ab](7ab07ab0b9ae2151613a5e0a9a948342204eaa60))
- **(es/transforms/base)** Reimplement `hygiene` (#2408) ([26944e1](26944e159d91f03f20319cc5ac692b5eb3344c00))
- **(es/transforms/base)** Fix `ts_resolver` (#2824) ([9cd3d16](9cd3d1610d6a2c768931e00af5062b4c50051bf9))
- **(es/transforms/base)** Fix `ts_resolver` (#2826) ([7a6bf42](7a6bf424c522d8e776ecfb45a9a23c5645e9b1fb))
- **(es/transforms/cjs)** Allow reassignment to exported functions (#2569) ([7cc51be](7cc51beb450b6c0160693e37a3fb5616682881ab))
- **(es/transforms/cjs)** Allow mixing named exports and export stars. (#2583) ([7e3fb0a](7e3fb0a0abcbb71e549c2fcc550a95f1833d535d))
- **(es/transforms/cjs)** Allow using multiple `export *` (#2598) ([5b141ee](5b141ee80a7f8adae8428bf89b0038abaa6a8a2d))
- **(es/transforms/classes)** Fix a bug related to super property access (#1960) ([403f647](403f6477523c135339965841af0c22e8c3a04db2))
- **(es/transforms/common_js)** Allow reassignment to functions exported as default (#2705) ([691e5e5](691e5e581c1d3ef3fcd0f65e4f8c8265faabb37c))
- **(es/transforms/compat)** Handle nested optional chaining expression (#1899) ([6037332](6037332cb44fa668300b01504191ab6e970038ba))
- **(es/transforms/compat)** Fix regenerator (#1906) ([480287a](480287aec409b9f9889b51ae82d2f54cd0688b06))
- **(es/transforms/compat)** Implement `new.tartet` (#2129) ([c78baef](c78baef2ccecaca76ca973f57c834e00a25154bb))
- **(es/transforms/compat)** Add `new.target` to `es5` (#2231) ([6e12ef0](6e12ef0306c0aecdc25f2faeac8c29be7e563748))
- **(es/transforms/compat)** Move the optional catch binding pass to ES2019 (#2247) ([4d500ba](4d500baaaa742529ecf1d2c514d6bde7a84c82fb))
- **(es/transforms/compat)** Fix regenerator (#2460) ([5bcabb0](5bcabb047172743bd21267094dfb15d63491a196))
- **(es/transforms/compat)** Fix handling of private static properties (#2478) ([9b96885](9b96885171ca0b820ba04193b2f3a0b177cd5195))
- **(es/transforms/compat)** Change error message (#2500) ([52dfb55](52dfb558166e1a97127db13f0442d71083173b5c))
- **(es/transforms/compat)** Fix `async_to_generator` (#2526) ([e7189fb](e7189fbdbd131bf2aa452e6d6899327cb9382158))
- **(es/transforms/compat)** Fix static blocks (#2652) ([d1523dc](d1523dc5e8ef423012632a6cead939e300134e47))
- **(es/transforms/compat)** Apply `regenerator` for default function declarations (#2681) ([8fe0d25](8fe0d2583fb13339277c0cd2f4f78d06c3110c16))
- **(es/transforms/compat)** Use `_createSuper` for super classes (#2699) ([8edd72e](8edd72ed73eeca2353348daf50cf0d9117c2c1ae))
- **(es/transforms/compat)** Fix `new_target` (#2736) ([571c5e3](571c5e31233d017cf88b374c88224960f6cb570a))
- **(es/transforms/compat)** Apply `block_scoping` before `regenerator` (#2740) ([bb646cc](bb646cc31cbdbcb1b12786733fb3c9d9d75ae095))
- **(es/transforms/compat)** Preserve more span (#2762) ([2fb4e5a](2fb4e5a60ccdd5531e075bb03348a3548e275d2b))
- **(es/transforms/compat)** Revert #2740 (#2784) ([06e02d8](06e02d83756f0adc43c39c92d1420cf11346fdbd))
- **(es/transforms/compat)** Fix `optional_chaining`(#2791) ([29da148](29da148b3e9e1960f9c5b11c4f3a08d03d600da6))
- **(es/transforms/compat)** Remove `.bind(this)` (#2776) ([5261df5](5261df52d268b8ddad40d6e2f05c60f099e0e72a))
- **(es/transforms/compat)** Reduce `.bind(this)` (#2806) ([26734d4](26734d44ebcca535e1ea62876a452f053a1da3be))
- **(es/transforms/compat)** Fix `this` in constructor (#2818) ([6a7775b](6a7775b5daf1f4aba6cddb4e2fe8cced450d5245))
- **(es/transforms/compat)** Fix `destructuring` (#2866) ([a6398e9](a6398e9f26e3c266e0413747cf45c509af5b502d))
- **(es/transforms/compat)** Fix `arrow` (#2882) ([803787a](803787ab9e90458308e3300284d0ee91466b6676))
- **(es/transforms/compat)** Fix block scoping (#2916) ([028d0ce](028d0ce2c6e275f7b9ca1652c60fa18c1a10c667))
- **(es/transforms/compat)** Fix `destructuring`  (#2904) ([0c1f2eb](0c1f2ebdde2bcd1a1e0b91c07ccd0bd9b9b70b50))
- **(es/transforms/module)** Fix for duplicate export (#1846) ([f8a3df8](f8a3df8cc3236b6cb251e3d4400019dd8c9f2edf))
- **(es/transforms/module)** Allow namespace import with default import  (#1940) ([de24ff2](de24ff275db54cf0b650fcd54e30039a926b78cb))
- **(es/transforms/module)** Fix `paths` bug. (#2043) ([2c52021](2c52021ed42adc8d3524562c21a0dfca31c8d110))
- **(es/transforms/module)** Fix detection of helpers to inject (#2868) ([43e89fd](43e89fd0c86f314280d95cbe5dd7a524b92a0fb3))
- **(es/transforms/module)** Fix overriding of `export *` (#2883) ([6f05c10](6f05c101f166e2f6c5cdbd27e2946e1cc2efdf2f))
- **(es/transforms/optimization)** Migrate to VisitMut (#1880) ([ab16179](ab161793a100001bf8b8dc697a2aac2b3f694e37))
- **(es/transforms/optimization)** Fix `dead_branch_remover` (#2373) ([1f99c3a](1f99c3a44cab4faed5f5ddfe08f6b1a6da80f167))
- **(es/transforms/optimization)** Fix `inline_globals` (#2524) ([709b3c7](709b3c7cd62ca8818e3856d8dc3faf5bade02a1d))
- **(es/transforms/proposal)** Fix order of constructor statements (#1914) ([d13eff9](d13eff99d871ad25a7b3dd4def5da9c6c5fb2409))
- **(es/transforms/proposal)** Fix type detection (#2431) ([f899584](f8995848b89acc0d08ad0ba6370f28a364c79cd1))
- **(es/transforms/react)** Handle escape correctly (#2014) ([eb45760](eb45760697922390d7d4736a6d763be6154d88d9))
- **(es/transforms/react)** Allow non-first jsx directives (#2377) ([4466ca6](4466ca6ab83b7ae6608a36d53d8b46366250dba1))
- **(es/transforms/react)** Fix escape of quote in HTML entities (#2419) ([029cf05](029cf056f28a9526395e00683071690b7b08dcbe))
- **(es/transforms/react)** Fix hygiene of react fast refresh (#2501) ([175c997](175c9976769346e99f277eea3055fe1cfe38aafa))
- **(es/transforms/react)** Revert #2542 (#2552) ([5f0524c](5f0524c54e63e4c33839763ad3b2feee78b7e8a1))
- **(es/transforms/react)** Fix handling of whitespaces (#2638) ([7ab3b5b](7ab3b5b0b8bc7f198cf118efe3d03f7c1dbe1a80))
- **(es/transforms/strip)** Strip types for typescript export equals (#2623) ([d2f2409](d2f24095281569afaebc1114b80d5786bbaaf503))
- **(es/transforms/testing)** Fix comparing logic (#2263) ([f087d15](f087d1515b7f5a729f89d258d23979636d98f997))
- **(es/transforms/testing)** Fix `test_fixture` (#2400) ([f560789](f5607891e4a4cc123e62f504c9a89e0d2e507670))
- **(es/transforms/typescript)** Fix typescript stripper (#1945) ([ebdd04d](ebdd04d7c761f3c86fadfc5e31286070bb48567c))
- **(es/transforms/typescript)** Fix `strip` (#2496) ([c29a6e1](c29a6e11c9c791aeb5467a84890842d8f7fb5dbe))
- **(es/transforms/typescript)** Remove `declare`d class properties (#2530) ([693181e](693181ee6a7fc65783af174fdc10162f49d333be))
- **(es/transforms/typescript)** Allow `(foo as any) = bar` (#2631) ([12be4b1](12be4b17991cf67e76fd2aa24c9103b354ee5650))
- **(es/transforms/typescript)** Allow enum aliases when values are strings (#2816) ([95a6a28](95a6a28014ab1a7deb8cb32829261c097024b517))
- **(es/trasnforms/testing)** Improve `test_fixture` (#2369) ([7a19fc6](7a19fc6e8c61a5b59a56b4a598efec066022dc2e))
- **(es/typescript)** Run `resolver` before `typescript::strip` (#2951) ([67280b6](67280b6fb07ee06757c8d4c61c5e341031bbb3c2))
- **(es/typescript)** Transform namespace with multiple identifiers in name (#2952) ([0a8a5a1](0a8a5a1c7800aa961ce23b9f8fc6c9ae843dd5b9))
- **(es/typescript)** Support declaration merging of exported enums and namespaces (#2982) ([2cd1649](2cd16490e4ba381e0435736365c9c0c7e894fbfd))
- **(es/typescript)** Fix enums which reference themselves (#3000) ([c8c73cb](c8c73cb313e2684e8fbcc33d32b6ef7820233ba7))
- **(es/utils)** Fix macros (#2349) ([b64afb5](b64afb5b6f3ccf019b8217408383a44aa3261bea))
- **(es/utils)** Fix `collect_decls` (#2792) ([af420ea](af420eab4be807536bf66fd6269be36fa0453185))
- **(es/utils)** Fix `extract_var_ids` (#2798) ([02ffe8a](02ffe8a2897b782be8aca9dc2ce3a9696bad8e8a))
- **(estree)** Fix serialization of `ObjectMethod` (#2961) ([c346f12](c346f12b327620b5eb5ee33a13ab5b08b4245939))
- **(graph_analyzer)** Allow invoking `load` multiple time (#2823) ([020b4a5](020b4a554dfa0f78b46d9cd7f1776fe67a7f7546))
- **(node)** Fix `parseFile` (#2881) ([7bccbcc](7bccbcc880d29d0379886bf59ab93fc0ed308517))
- **(node-swc)** Fix visitor (#1890) ([211e208](211e208219c85a1f439412cb58563cc0b24509e8))
- **(node/bundler)** Prevent spreading string into return (#2335) ([f426166](f42616698c3fd5c8bf86421c92c33f3f6e43c05c))
- **(node/swc)** Fix field name (#1923) ([d5cdf44](d5cdf444e8df727852b84e5cb00cdfa0352dc83f))
- **(node/swc)** Fix for m1 mac (#1939) ([d6454ad](d6454add72d342933482ac021eedfca99c61e9bb))
- **(node/swc)** Fix typings for parser options (#1971) ([eecaac1](eecaac12a0f18bb98e06471a834893c2f79338ea))
- **(node/swc)** Allow specifying filename when parsing (#2031) ([abb1451](abb14510619a97401d6fede2ebc4c28f456b97b9))
- **(node/swc)** Fix incorrect field package.json (#2069) ([035ff77](035ff77f1abdccd49a48ed1fb44c81c85b51edad))
- **(node/swc)** Allow `JsMinifyOptions` type for `JscConfig.minify` (#2287) ([4846c32](4846c3230396875ee5a7017c525aa64e788b3bb7))
- **(node/swc)** Add `baseUrl` to `JscConfig` (#2968) ([1f6d830](1f6d8302c1cebbbc43ea797c1db9fef291bca3a1))
- **(node/swc)** Allow using custom bindings (#2983) ([c02dd99](c02dd9935e5e559ecb28fc23dbd8253577a3770a))
- **(node/types)** Add `es6` to `ModuleConfig` (#2648) ([b6a5656](b6a5656f69056779415932606f68fcda75e1e340))
- **(plugin)** Fix serialization and deserialization (#2651) ([a683636](a6836368a2dd466e20e41705811760bdfc259e4c))
- **(swc)** Fix source path of a source map file (#1902) ([19bcb06](19bcb06f736ddafcefb93268894158bc08506c00))
- **(swc)** Fix order of passes (#1931) ([4a9b31d](4a9b31df3e3c47418f9831376140061ce5fea4dd))
- **(swc)** Fix bugs (#1932) ([ff47e25](ff47e2539ed08272740bb1c09d27c2b87a78ae0d))
- **(swc)** Fix bugs (#2034) ([53b031b](53b031b019d0ae1e94371944d99dd24d0fdb0149))
- **(swc)** Report error correctly (#2065) ([c6dce67](c6dce6749467ffd9fb687f72266da13a7be2b8a2))
- **(swc)** Fix bugs (#2067) ([1b9584c](1b9584cfc07c4450cc2533ffa359e6d31b2c9f44))
- **(swc)** Disable `aes` feature (#2109) ([6eaf60b](6eaf60b8a4902228b758873e805032b696673493))
- **(swc)** Improve rust apis (#2197) ([77be9f6](77be9f63b9fd2b400f6b1a767172d95d3260dc84))
- **(swc)** Fix `target` (#2226) ([9ffe471](9ffe47106a70150579b80d103bd1a0193e5b8483))
- **(swc)** Remove global side effects for rust users. (#2270) ([b82702c](b82702cf0f845f7fce3d5d958a55f31df5b98bf6))
- **(swc)** Fix simple bugs (#2292) ([1b2e670](1b2e6706bdbe890cc4449876c3105342f3cfa9c5))
- **(swc)** Fix `try_with_handler` (#2315) ([2c50cde](2c50cde8defdde0ecd8ce50795aa5f86bc6d4a9d))
- **(swc)** Fix order of custom passes (#2347) ([6d35e7c](6d35e7c28d5b7d749624598f2213795cd56758ad))
- **(swc)** Fix order of custom passes (#2367) ([edc4cb4](edc4cb432e0fbe01061cbda00a2636a77492839d))
- **(swc)** Fix `swc` as a crate (#2376) ([656f3e9](656f3e944df7ec8d9f1ab7ac2745c0d4dde3e605))
- **(swc)** Fix `sourceMap` option of minify (#2380) ([486c689](486c68950439844e051923fe40be0c5f27468f70))
- **(swc)** Fix bugs (#2396) ([ff2baf7](ff2baf75b4ea5ce3fc15cdba1a817413d8fedc65))
- **(swc)** Fix order of passes (#2427) ([51d7a14](51d7a144bb8ca477f430d6c6200112c36e281b91))
- **(swc)** Change default value of `inlineSourcesContent ` (#2471) ([ee880d6](ee880d63aede35b54529ca861542826fd80617ce))
- **(swc)** Fix bugs (#2538) ([b8933e3](b8933e3db983f5b9e381fc68e25c210d62eb41bb))
- **(swc)** Allow overriding specified parser config using `.swcrc` (#2547) ([8494f65](8494f6583c76014ea0d2413a34660c2bd22e2aee))
- **(swc)** Use standard base64 charset for inlined source maps (#2585) ([4327d11](4327d11d416fe6b9e752cfd45b68185af84ea596))
- **(swc)** Don't print same error twice (#2692) ([22ce68c](22ce68cfaaac3791534084a33498d54083595de9))
- **(swc)** Fix tests (#2707) ([a90fae5](a90fae56962a2a5c67ab4302627b285c22ef638d))
- **(swc)** Fix handling of `jest` option (#2892) ([ddc3aca](ddc3aca3f089db6b557171c6ef399803e18ade03))
- **(swc)** Unimplement `Default` for `JsMinifyOptions` (#2901) ([bb66083](bb66083f69fe988bab977cad6361b6649a202cca))
- **(swc/hygiene)** Prefer not renaming top level variables (#2940) ([beb2c73](beb2c73c2c2a00e1d2244376e1ca677d6001716a))
- **(testing)** Allow using it with stable rustc (#1974) ([4011703](4011703af516298001e5063718f12c2cf01541d4))
- **(testing)** Fix CRLF issue on windows (#2338) ([20171a3](20171a3654977d8a886f25cf687c2f1aae4dd0ae))
- **(wasm)** Fix bugs (#2279) ([e5f46a6](e5f46a6800d6dc52f112789d4d8247846a0b136c))
- **(wasm)** Fix `wasm-web` (#2803) ([1368981](1368981f1942556ea91371b067efe0ec0bbd9fb4))
- **(webpack/ast)** Adjust `acorn` options. (#2908) ([586ab0c](586ab0cf764d1192fd0d43173042d7788317f397))
- **(webpack/ast)** Fix ast reducer (#2914) ([32b68ef](32b68ef5d0fea16dc7d97e8d7e9109bf984a743f))
- **(webpack/ast)** Improve ast reducer (#2917) ([854b598](854b598e94ec87b5df9c0a4efcd3c4b7c872226c))
- **(webpack/ast)** Fix span of null literals (#2925) ([18d9fd9](18d9fd91f9624f7ad799883768f6e0159ef9225f))
- **(webpack/ast)** Fix handling of `define` (#2935) ([9f5fc11](9f5fc11a8f3d37dfc3d04a1d8935704ec9be0179))
- **(webpack/ast)** Fix ast reducer (#2936) ([667dd1e](667dd1e95e887328fd450b9c52c8c13b5f3e23e4))
- **(webpack/ast)** Don't remove comparison of `process.env.NODE_ENV` (#2937) ([4539b3a](4539b3a61034f65a41fcfcf085d96d3fe30eee70))
- **(webpack/ast)** Remove more string literals (#2957) ([1eb62dc](1eb62dc201854303973471c1de9fb98a0a19c4b9))
- **(webpack/ast)** Fix amd support (#2959) ([eda514b](eda514bcc54146237690cf9f7abd67478b844b0b))
- **(webpack/ast)** Preserve more arguments of `define` calls (#2960) ([4008a65](4008a65b1e3fc5f7932618fa09f80000cf9dc999))
- **(webpack/ast)** Reduce `if` statements (#2969) ([2a01dd4](2a01dd4b32a96a14efbe7067dac2d83f3a881c84))
- **(webpack/ast)** Preserve span (#2971) ([74363e0](74363e03579367b2d362f0fcbc3f5bc92a88d469))
- **(webpack/ast)** Fix `webpackAST` (#2979) ([4cf5852](4cf58528df1cd3d3ae9b44ac6cc874b2c8f0beb6))<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Remove println ([360b4bc](360b4bcc046d178bc7792a51fe00bcd456f2987f)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Fix simple bugs (#2220) ([b4796d9](b4796d9d54e31fdd5f29c8c1a43875dcb7bbf186)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Migrate dependencies (#2307) ([650e149](650e1494d492a4129916b265aa688b1062fad119)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Revert #2766 (#2774) ([95e7f4d](95e7f4d4e91d967c3482dd673a670d134e9760b6)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** (es/compat): Change order of passes (#2949) ([99da422](99da4221ae4ef7ba01d765a3f8c097fe04d3dc2f)) -->


### Documentation

- **(common)** Improve doc of `Take` (#2192) ([55f065b](55f065b78adcce9e69e96494543905b8038fd641))
- **(es/ast)** Document identifier mangagement system (#2371) ([b0ee954](b0ee9543d4e9da88cfb17fd0d24b819e73c3b6ce))

### Features

- **(babel/compat)** Implement reverse operation of babelify (#1655) ([c49e9b0](c49e9b0b8dab683c43d7907eac2eba409a49df17))
- **(babel/compat)** Support type-only import/export specifiers (#2342) ([ef4c80b](ef4c80be7dd0481c1bebcbf9ca47e55595524c64))
- **(bundler)** Support `paths` (#2054) ([cfc3725](cfc3725dbb2be0ff0f9974bfbdb545b6fd55fa7b))
- **(bundler)** Support replacing any environment variables (#2121) ([61e58d7](61e58d732952a7324a13ae17a26dc9e4a043a8b9))
- **(common)** Add an utiliy method for comments (#2002) ([064416c](064416c0797ac16323ef8220481af91d2ade14bd))
- **(common)** Implement `TypeEq` and `EqIgnoreSpan` for tuples (#2184) ([d58642b](d58642b70c5f789a72c7f932fb3676c371ec5323))
- **(common)** Add variants to `FileName` (#2202) ([87f30b2](87f30b21a34b41f567da4f3f28b7767fed0d76af))
- **(css)** Implement parser (#2074) ([d39acd1](d39acd1d11d64a2e1d3e2c4a2f102de739f667dc))
- **(css)** Groundwork for css processor (#2105) ([0d63470](0d63470eba4766403389d67d8ef80e809a4f4af8))
- **(css)** Implement codegen for css (#2115) ([7381644](7381644f6bdaad28d4e3a4d88876bd8c9d0667e0))
- **(css)** Port stylis (#2131) ([c05a724](c05a724d8454aedb9ad3d4ffb6cbc5da51cd3d55))
- **(css)** Recover from invalid properties (#2312) ([b206404](b206404d94b7b2e6de1e69cb1c916320e20ac4ab))
- **(css)** Add error recovery for tokens in selector positions (#2357) ([3714802](3714802bd308d01acf9f11bd8a3240cf7bd790ec))
- **(css)** Add `BadUrl` token (#2426) ([c2ce89c](c2ce89c0fb4d5832c05e1a495dd7e78507402030))
- **(css/ast)** Add raw to `Text` (#2361) ([4ff1b75](4ff1b7568c825165fec22df3c66e5227c6d7f11b))
- **(css/ast)** Add `raw` to `Str` (#2295) ([a5592e3](a5592e3207e4ad5eaf89d926ec0aaa130ef311a7))
- **(css/ast)** Add `raw` to `Url` (#2389) ([2678c34](2678c34488fc455fabe7228147510031230f5a66))
- **(css/ast)** Add delim token (#2398) ([fb4869f](fb4869f413c5d32557dbf2567ed71244a08ca344))
- **(css/ast)** Add `Function` token (#2491) ([b62dc60](b62dc60c5d9c70c96a1245b4f300e9cd15f9567a))
- **(css/ast)** Add `Percent` token (#2482) ([e327c9a](e327c9a502089357de573b950414ddd67d92a6f7))
- **(css/ast)** Add `raw` to the hash value (#2535) ([303cecb](303cecbefcd0bb0beb1c830edfae87f6bccb9095))
- **(css/ast)** Add `value` to the whitespace token (#2533) ([4f04736](4f0473616d0a61796b8f24384290065fceb3b4ae))
- **(css/ast)** Add `SquareBracketBlock` (#2573) ([f77d6ce](f77d6ceb00639c605d5137373321a1d5a6dc10b3))
- **(css/ast)** Add `RoundBracketBlock` to `Value` (#2618) ([8c61d0d](8c61d0d6096e1714e723334f0877bc53f3191f8d))
- **(css/ast)** Add `SelectorList` (#2639) ([0b76d29](0b76d29ae41401096e3bc4fe27c7dffc2b13b269))
- **(css/ast)** Add nested selector (#2641) ([6ae3af3](6ae3af3673843fae9765641b411e8b5213d0e785))
- **(css/ast)** Add types for `An+b` syntax (#2759) ([6ce437d](6ce437d65d5eae07040b93a3a5c4842f19e88e4a))
- **(css/ast)** Add support for nested `@at-rule`s (#2897) ([c77ebbe](c77ebbeb8d186ade51d3cc5ac94176a4cf071569))
- **(css/ast)** Add a flag to number types (#2905) ([fcd0d7a](fcd0d7a6cba4279087ef41ff2d220f62bb0b78d5))
- **(css/minifier)** Initialize crate (#2884) ([c6cb790](c6cb790cd927b5a7fdd623954ea5c1f02a53261d))
- **(css/parser)** Improve parser api (#2147) ([8c57cf0](8c57cf053757a3b20bac3ace73da1c4bd6815be4))
- **(css/parser)** Implement more error recovery (#2316) ([ce40ff7](ce40ff73a73891fb1b41aedf1f6a26ce867ed7a1))
- **(css/parser)** Allow invalid line comments (#2443) ([7f04ef4](7f04ef47155cb8ec06eb4296d8c3c915c79221d6))
- **(css/parser)** Use `Function` token. (#2571) ([67c0d4c](67c0d4cc37af3c3bf98a83b051cadc017be60e8f))
- **(css/parser)** Improve parser api (#2847) ([839a99e](839a99e7fda3ed920d9cc912eaa5859f76361950))
- **(css/parser)** Add more error recovery (#2849) ([d7183d8](d7183d82e2956fa7632bda074dae405a7775dad3))
- **(es)** Reexport minifier from `swc_ecmascript` (#2146) ([584c44a](584c44a490e88a8031dc0f5cdb4e6e54de06152d))
- **(es)** Support type-only import/export specifiers (#2309) ([2b292e6](2b292e6d176f0f561d49e85ada5459909feabc8b))
- **(es/ast)** Implement `Take` for more types (#2649) ([0414c31](0414c31480d8dbe63f07c1d049b9566ec2db8163))
- **(es/ast)** Add utils (#2657) ([994c965](994c9655c899d71e5482a7bfe06cad015a25f512))
- **(es/babel)** Support `babelify` of static blocks (#2504) ([91717c9](91717c9c5f1a734bd6f2edb95de748ccd87050e4))
- **(es/codegen)** Expose more API (#2375) ([500dbf2](500dbf244b3caee28438acc1b2e42b743b9af119))
- **(es/estree)** Allow emitting `acorn` ast (#2859) ([cdef843](cdef843369a0a35ffecb2ee5272e3805dfadb149))
- **(es/loader)** Support target runtime environment. (#2045) ([2151366](2151366b9325967df8ec821fd3ee2fdee28b3323))
- **(es/loader)** Support more types for `browser` in package.json (#2060) ([e84ed13](e84ed13ffe6d0961232e716a4a8414ba679ce34d))
- **(es/minifer)** Improve minifier (#2229) ([20ce326](20ce326909670d0e40c9f1bbd804387c2958eae6))
- **(es/minifier)** Implement more rules (#1766) ([33a43f8](33a43f85b18191ed2a68d04a1c2e39aa623e6b66))
- **(es/minifier)** Implement more rules (#1871) ([b02e189](b02e189d078aedbf5736c4feec3bdd6a6e296727))
- **(es/minifier)** Make minifier parallel (#2009) ([026c21e](026c21ec68b8c32a2768231c4e89e7f618a77dab))
- **(es/minifier)** Implement more rules (#2039) ([71080db](71080dbd26fdb09bc6b6e69b3e088e3994b704ce))
- **(es/minifier)** Implement more rules (#2058) ([0e30deb](0e30deba1a6fba0cfb9cf570ecf7838def56389b))
- **(es/minifier)** Implement static evaluator (#2176) ([11fe35d](11fe35dbd149a928f814ca4032f9bce293c89098))
- **(es/minifier)** Implement more rules (#2183) ([c8b46bf](c8b46bf6dbe96f5e1e593e7b6be0bad371eb99da))
- **(es/minifier)** Add CLI for debugging (#2273) ([406fa3f](406fa3fc780eea0e26aa3f636643e6db7ee32b04))
- **(es/minifier)** Improve `drop_console` (#2830) ([c5768d7](c5768d7672ba33e75e0268176a90f9fb1d725fb4))
- **(es/minifier)** Print more informantion on infinite loops (#2976) ([694d3c5](694d3c50725ce0bfae9650f4c4b3caf2aa6b6821))
- **(es/parser)** Allow stripping out typescript parser (#1962) ([85a216e](85a216ef565ee852046abd540424e3f3ed85efdf))
- **(es/parser)** Report an error for `import.meta` in script (#1999) ([a086a20](a086a203dde45442357759f79921e33aa30e4d2d))
- **(es/parser)** Always enable features in ES spec (#2029) ([f4e0e91](f4e0e91f64a44c4adb702656e3b738a041547b9b))
- **(es/parser)** Emit an error for top-level await in script (#2094) ([33bdff0](33bdff095708309e39185340bb898e7c8fa1c522))
- **(es/parser)** Report an early error for `await` used in wrong contexts (#2098) ([e3e2908](e3e29081397363c3afdbf983dd94c63763f411c3))
- **(es/parser)** Add tests for static blocks (#2180) ([b2c9971](b2c99719fdf0549ff5a296c13747580b3a2f6e0c))
- **(es/parser)** Enable ergonomic brand checks for TypeScript (#2562) ([7b4af43](7b4af435f24e475889c3020288796624577b352a))
- **(es/parser)** Implement more error recovery (#2874) ([b853d4a](b853d4ac9545b2791d80da1d50f12d56563d2b01))
- **(es/parser, es/codegen, es/visit)** Support  static blocks in classes (#2130) ([a10118c](a10118c90fa32d3b52a127411e5fe671c4eb19f3))
- **(es/parser, es/transform)** Implement ergonomic brand checking (#2079) ([e46a842](e46a842e99bba7ff63957ddd199c1eb970440371))
- **(es/preset-env)** Upgrade `browserslist-rs` (#2927) ([8a55870](8a55870ce5ee9aac667408d81e802063cd6b36d2))
- **(es/preset_env)** Use `browserslist-rs` (#2845) ([2c099bf](2c099bfd2c4a1ec147269d445db88bd88856e1f8))
- **(es/transforms)** Improve module transform (#2053) ([a26071f](a26071f99d1384c6755da98f2632eb8bea0f2d44))
- **(es/transforms)** Move `class_properties` to `es2022` (#2512) ([ecd617a](ecd617af394181b62f177415e47b4d89ecc9648c))
- **(es/transforms)** Move stage 4 proposals to `es2022` (#2519) ([65c83e8](65c83e8cb427105025ee3ed1608c6da675040d03))
- **(es/transforms/compat)** Add single-property optimization to `destructuring` (#2511) ([f33d321](f33d3218cdec8d325c934791d74cd920796efa98))
- **(es/transforms/compat)** Add more loose mode (#2611) ([dc58122](dc58122283864f34a27c294cea8835d6fa10204c))
- **(es/transforms/compat)** Add loose mode to `parameters` (#2911) ([1555ceb](1555ceb8a395351e26b9e66bf8a4e77adc0300c5))
- **(es/transforms/module)** Add an option to preserve dynamic imports (#2441) ([130a47f](130a47f42cfcae7dcdb83677b8a7ed29c0cc246a))
- **(es/transforms/module)** Fix transform of `this` for classes (#2514) ([c482162](c4821622067a570fcfc8a945ebcfbb778dd5e567))
- **(es/transforms/optimization)** Support inlining of `typeof`s (#2473) ([2ca6e5d](2ca6e5d79bedbae9df88d45aa16771996d467c47))
- **(es/transforms/optimization)** Improve `inline_globals` (#2479) ([b0361ca](b0361caa582600074962c2b80a442421d2ab5a4f))
- **(es/transforms/react)** Improve development more (#2542) ([70f5583](70f55833e9a19a62257806e79225bda896d90396))
- **(es/transforms/regenerator)** Allow configuring import path (#2581) ([33bc3d2](33bc3d2b91f5f85dc1375d568b7a1e2ca2397749))
- **(es/transforms/testing)** Reduce CI time by caching execution result (#2565) ([0364f9a](0364f9a2aee0fc300153f4e2ed61909bd4ec2f7c))
- **(es/trasform)** Support static blocks (#2474) ([bb1cc97](bb1cc974c71d61b8c3b174d2475db62a18c8e0a9))
- **(node/swc)** Support `sourceFileName` (#1976) ([e916b35](e916b35dd2ee3a191fee487ac61e64d9410b72ed))
- **(node/swc)** Enable tsx automatically based on the extension (#2230) ([4ca85ec](4ca85ec79cc24ed11191668501c21626777c0b2a))
- **(node/swc)** Add a named export for `Visitor` (#2291) ([2580f1a](2580f1a3728ac3f739aefd7af27002fd686248fc))
- **(plugin)** Groundwork for rust plugin system (#1893) ([18e2232](18e2232dbca69649963e076cc63f7829d18ec555))
- **(plugin)** Proxy `swc_common` apis (#2646) ([3807229](380722976ab65b103c274704ca96de96510d7475))
- **(plugin)** Rename `Plugin` to `JsPlugin` (#2893) ([ffcb357](ffcb3570103eaeef5a0614dd72c5208b12276fe6))
- **(plugin)** Enable plugin support under experimental flag (#2894) ([91ef3cc](91ef3cc16e622fa35ac4b8212c29fd8b425f4a62))
- **(plugin/api)** Determine plugin api (#2199) ([7a31a3f](7a31a3f53083a20b7719a1b448bd6209e93d45fd))
- **(plugin/runner)** Supports specifying exact path for plugin (#2918) ([5999634](599963495216a929b5992b3e40717d215b2c93b4))
- **(rplugin)** Implement general AST processing plugin system (#2671) ([bf0007b](bf0007bec0127adaa74ffbc23b2c6662612e062f))
- **(swc)** Expose minifier api (#1978) ([d1c4817](d1c481790ca6bb17353b3ee3268655ea48effa36))
- **(swc)** Improve swc as a crate (#2026) ([4cdb45f](4cdb45ff2e6372af940f9398e179f5fae09ceabc))
- **(swc)** Implement `format.comments` of terser (#2095) ([879a0f3](879a0f39a880403436fae4f690d1e65968523bc9))
- **(swc)** Accept map for `envs` (#2467) ([28f2c7a](28f2c7ae5d4602c36aac610aab60986805f17678))
- **(swc)** Allow removing filename from error output (#2498) ([ecf0d75](ecf0d7507ce4d25cd44c081c9874928c52340efc))
- **(swc)** Add `browserslist` to `optionalDependencies` (#2515) ([4abde38](4abde38dd78fb1885b0acfcdd90be50795628f9d))
- **(swc)** Provide `&Program` to pass creator (#2665) ([3dc1e76](3dc1e765e98b90d1e0d954c987db3497294f9bef))
- **(swc)** Add `IsModule` (#2601) ([65d376a](65d376a91baf19f1f6ddf99e700a5f82b33c9e0c))
- **(swc)** Implement `Default` for `JsMinifyOptions` (#2899) ([5425509](54255092082fcb8c7aafa90227ba9543509c31fb))
- **(swc_common)** Allow `dylib` (#2628) ([04238d0](04238d0b932f0efd8ac8ae262174ebc18469fa6f))
- **(swcpack)** Enable concurrent mode (#2356) ([d0342a5](d0342a5a584fd55c2b4131f53bc36c6f71252716))
- **(webpack)** Add ast reducer (#2875) ([c2bbdbe](c2bbdbe9d6397e2ec36beabdacb2541497c76510))<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Expose `.take()` (#2190) ([a8cb554](a8cb554be5dea1d06dc91b3b2d715682663e3549)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Enable logging of timings (#2833) ([6b96a3d](6b96a3d8ed2bc9c55fdc07d22257800d27e7a160)) -->


### Miscellaneous Tasks

- **(ci)** Switch installation method of deno (#1915) ([4e42c66](4e42c66663e6627c33dea9868de59609b7fde5cc))
- **(ci)** Add a CI script to publish from github actions (#2353) ([305f90c](305f90ce766bb39cd148f019166d1697069f004d))
- **(ci)** Prevent benchmark from marking PR as failed (#2488) ([eef63ca](eef63ca6dbbe982e9a44ff9693d8ab27db8bd572))
- **(ci)** Don't use push action ([b197eb6](b197eb65afad1b73109641a53112e230b98a8ea5))
- **(doc)** Add an example of stripping out types (#2430) ([647d3ed](647d3ed36a63a541061930e34daa5705f4ff468e))
- **(es/minifier)** Publish (#2354) ([a553451](a55345156268e31b9f466150bf842a7026dd1269))
- **(es/minifier)** Add a script to copy tests from a next.js app (#2778) ([e1b7665](e1b76654f59cc02133d394e5393664ba74cb8d34))
- **(es/parser)** Update an error message (#2148) ([78a7c6b](78a7c6befe68172df049a17b8810afc1a64f4a67))
- **(es/preset-env)** Upgrade `browserslist-rs` (#2889) ([af216c1](af216c10147afff6ba296adbbfb9b2683a21ee50))
- **(plugin)** Publish ([fd08a27](fd08a27f0c1965f8a9f6760c153d09b19f70c48d))
- **(wasm)** Fix license (#1874) ([c4e0134](c4e013441b877f8e97ee47a6fccf5ff6f59d9d99))<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish v1.2.63 & Update rustc (#1894) ([35af4c5](35af4c518613b54d84c1f3cf096600af9f135a37)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish v1.2.63 (#1895) ([44b6400](44b6400385ef3cdc6292b8039bec23702bd3b168)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Update README.md (#1910) ([8694b11](8694b11959a01da78bdb7ec283894ac9576e4186)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish v1.2.65 ([7f96847](7f968472fbfe86efe2055278a64e0242df6359fa)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Fix typo (#1958) ([cd4a564](cd4a564eead8cb3a6b0b0780ab6b0ba1ee116346)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Use correct license for the node package (#1966) ([f3603b2](f3603b2cb84605a0ba5e0d818bef4ba86098712e)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish a new version ([839476d](839476dc3c6c3d39d6d729a3c2cfb190b27ebeba)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Cleanup codes for fixture testing (#2070) ([b0c41bb](b0c41bb3f2db6cf0b3e333694adf10df1ca5856c)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Fix typo in type definition (#2116) ([91c239b](91c239bc741a7770e637a7b413123427e7dfa4fe)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Fix typo (#2136) ([84cda8a](84cda8a9f5d142c4af2bead63c65bb8b80f296f9)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Fix typo (#2135) ([1d71a8e](1d71a8ea956e3da81532258676028859d49d1a50)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Add a link to github sponers ([ff389ca](ff389ca8d2737875d0d1a220863815c6fe23bbb3)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Add discord server link to `README.md` (#2278) ([893fb08](893fb087ae77fe5ab03cba5a67ce155123695441)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Ignore linguist detection for fixtures (#2285) ([e538970](e5389700e64f1e33fef9a59f6755a139b33ab41a)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Fix typo (#2288) ([dd3f18b](dd3f18b760dd1922904677e8a3705a5187fbf140)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Improve docs (#2301) ([83d88ce](83d88ce388ee8553af6507032630ddbc7a100d14)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Update rustc (#2332) ([a7357ab](a7357ab51730322a55bde7161de629f9d6da118e)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Improve documentation for rust users (#2340) ([bbefa0e](bbefa0e57e54f18a21ac448148eb93012344d2df)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Setup workfllow to bump version (#2368) ([e2a0edd](e2a0edd49d47e43f93716a6435fdd7eb2dac1405)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish swc ([d19df13](d19df1379cc24fd14089c815badbca2be533fa48)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish ([b9b7de0](b9b7de08714a03e38c6b4ab893a0d93fd8a6b584)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish ([eb402d8](eb402d8c6faa4553441ad0c199bcbdc11c0ec34c)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Fix CI script for publising ([5fb5a70](5fb5a7058fab29539ed414522abb78670392ce51)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Disable freebsd to publish ([267d639](267d639c2e28adc8409df4a5b74beba8b64eec43)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Check for issues already fixed (#2429) ([a25d67b](a25d67bfbfdc8258df5ed98eb7803bd79d9d261e)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish ([dcf4277](dcf42771ad3a138a352f3f090ff614affb58c2c4)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Add `include` to `swc` ([ac77240](ac772403b2eb51c0fe013e2fe56685a5df0389a5)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Add CI steps for combined benchmark data (#2458) ([8c0c250](8c0c250249e9a14a14e653c9e55f6e233d3537a5)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish `swc_ecma_transforms_compat` ([98a18e3](98a18e306a502b2784c3ab1d960164e3fb597118)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Fix typo (#2472) ([123c1f5](123c1f5d020d1c885bbde6db8551af654356c442)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish ([7af0f8c](7af0f8c81b83b89db55aafd8156ee9bfaf94426f)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Remove useless submodules (#2537) ([265084c](265084c41ed1b484c0f7d486d56b71db8d6cc9d1)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Configure kodiak ([2febd77](2febd77c56137406e0fc5467ff3315aebb088f2f)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Disable freebsd build to publish ([e3869f1](e3869f1d27c2e4a518d9ba5468d08f58e6e8f18e)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Pulbish ([7fae0bb](7fae0bb979ec5725f97012c75527cfe4a0099aa1)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Fix ci script ([a6fcfe1](a6fcfe1ddd5a58e8c3d1b67bfb2fac21b0aeefe2)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Fix typo ([5469457](54694571b90102ceb60617f5203fbf93b778d328)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Fix publish scripts ([ac02f3f](ac02f3f3faabff6466b1a5e5b5fbf91cc3573118)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Fix failing tests and improve CI scripts (#2563) ([7e29685](7e29685a1766a3a0fd4b03766e6a96ac24054f6e)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Fix CI script for PRs (#2575) ([a6af0ab](a6af0ab30f45d72890ecbed40e3c5d7b91ab4f37)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Make `cargo test --all` work (#2580) ([f9a8ad3](f9a8ad386d5feafb48756764982f6843f6adaca3)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Fix typo (#2586) ([ef3c9a7](ef3c9a7422ef62d6a767dd96882f024d47aad1de)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Manage crate version using github action (#2587) ([f997bc4](f997bc4889473399462173b4ba043e5b93d8bc6c)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([bb189c7](bb189c74acfeab10d3830538535f83bb497d0d7f)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Fix script for managing crates (#2588) ([d63553e](d63553e5d741b9fd307efdf1570cbefef0f60dd6)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Fix crate manager script ([bab638c](bab638c5e8887febaa061358f889a646cab41580)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Fix permission issue ([ceb025b](ceb025b735607ff8094e2cde5ec8050d05ead871)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([4328276](432827641418215e8c1f7924f50b2d3d486bcbb1)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish ([344daef](344daefd16152a0fdfda68ef7bf79b50ee07f8d0)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Fix musl target ([dfd8d1a](dfd8d1ad61675d8de0c96df96b04b6c13540ed3a)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Use ubuntu-18.04 for musl ([e3b8e53](e3b8e5324bf6d3ea42fc92b70e9f37db28ba6a6a)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Use form for issues (#2595) ([a278eff](a278eff5ee0307d56b426d6029d9ac77fd8d1c55)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Fix syntax of github issue template (#2596) ([c05f35d](c05f35d5f1c89cdcbeb70000020a8eefa59316cd)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([cd2a277](cd2a2777d9459ba0f67774ed8a37e2b070b51e81)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([fbbdeea](fbbdeeae5677b065182e5853e011832a6fedf68c)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Update playground link in the issue form (#2621) ([f8c7d36](f8c7d36ac9cb6d46de690e90a0399a1b01ca823b)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([befda97](befda9752eb88687a07650bc3d7ea34c648c6777)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([6644a06](6644a06da634a2aee6683c01faff06cee84ca095)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Improve version manager script ([3935400](3935400a55109aa2c40906a8d8999574b3f99012)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([9a2f729](9a2f729322c26e3bd8b3bef23201bf794c09873d)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([170a53a](170a53a4ce7d9e7d5cf2efa3791291300e711cc8)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([74aa006](74aa0068db32cf442c15bd582cc1a4cbf8faa5c1)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([4e003b6](4e003b60f7a45f5c8fc30630ca5feda968561cc2)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([1c5f754](1c5f75485fdc657920b9fda05f8a9bdb3dcd62f1)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([a973b0b](a973b0bed46f9af697ce5969ca2ed6d1c8e304de)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([7403956](7403956d4ae4bd1cad0d76e513ac38ed3cb2b3dc)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([04befab](04befab67af4c68f22bafe5a61fb16a8e5e105bd)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([46e32a6](46e32a6a726bbe4c0fd305534b396252ff3e4cc9)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([224972f](224972f487e0395d527b75c3d3f007237996e8ab)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([0240bec](0240beccdf565d6b2887c4eedefae4a3f5f7d2e2)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([b3fd704](b3fd7046d7eb678fa5b688db920cec03913b3276)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([5c2479c](5c2479c00594ae75642afe7aedfb67746bdc19fc)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([999ad77](999ad77a3d4c9e0e49cbeae523002743088b0fdd)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([fd14b4f](fd14b4f1ddd49c0e5d0650a95c9b2fa42943c662)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([98fc409](98fc40988c52fea01ec2d6cc264371b38ea26904)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([6b478cc](6b478ccce0389914d2d2360934b99b7e6c2a1ae0)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([76d9ae7](76d9ae76568a05f3e40f526f37654e942fc2acf3)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([7e259ab](7e259abae1d7ed9c56675414178ae2f4f265ad7e)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Update rustc to prevent `CVE-2021-42574` (#2690) ([368b9e2](368b9e2ff278eebf63636a44349add4cf940096d)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([bcf1cfa](bcf1cfa6a1b60fbc4f264f379ec92b56e7b38a30)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([797f4ff](797f4fff14f79b9e4e581796e31db59cc6e31b71)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([2be8559](2be8559e35e860d27b817d056b3b67ba3e610435)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([158136f](158136fae91efab6b473c3ef26daafde98a58f25)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([4863bee](4863bee163d1da746210c292e8d3ef8a6bd14940)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Update README.md (#2693) ([cb68956](cb689565d570a3fd86fe9b4589d37a5adc73cd96)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([3adeb6b](3adeb6bf309f47a516d2aab69e651c0548848f08)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([5db7bdc](5db7bdc1336b29f3cb22267666d62791346c5e59)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([c5aac71](c5aac71660f1bd5ac9aeded9b1f3ab13ac59c171)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([544835a](544835a3a54054382751db7e48ce9b146d9aa78e)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([90b7074](90b7074556ee2f78d9cd346df862d5a31e7208bf)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([fd4a717](fd4a71747bce0d71e06156279f8e06e3e716e53c)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([3294a35](3294a354174f0560ab319fde5e97cf9d8426d2a8)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Fix broken link (#2737) ([79fc464](79fc464f8ddc5ccf77520734405ae7c174f4383d)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([898ed70](898ed7015cb4b9eb097ebb92ac01a6db89f33720)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([8df860e](8df860e16cfbce50315a2b78646cd8bd902376a2)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Update markdown files to use "SWC" instead of "swc" (#2744) ([3ebc5c6](3ebc5c6b6905d28769da6aefb48646a4ad6d023d)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([2cd565b](2cd565bfc06e27a7720d657f08821f9f64a6f314)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Change Gitter link to Discord (#2752) ([015b258](015b2586c307d22b07aa02a9db2202aff337f554)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Rename the default branch from `master` to `main` (#2750) ([6b70fb5](6b70fb5afe91fc7e0a5b5031409179e0ad1f8d32)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Ensure `feature.manyFiles` of Git is enabled (#2754) ([8aea5eb](8aea5ebb47524d3a0a25e93e394133eed8c4d72b)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([c15116d](c15116de0781d66243ab49dade19d50f071c2465)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Fix benchmark github action (#2755) ([54bc405](54bc4054a9a892439725d8944b6dc5116df59389)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([6129e99](6129e990d461e07050e6faacba98fee5c968480f)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([262c894](262c8941a2bc8340a7ecb1c0ecd4cff021606307)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([3e4fbe7](3e4fbe7667eb3effabb582829f68bb7f7e3d31cd)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Fix typo (#2764) ([2e01876](2e018769c2bdbec7b2891bf09293c6c5b5c0dee6)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([7fcbdf2](7fcbdf20dd3b69d92c205e81ee33924ad0b02d61)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Fix links and paths (#2773) ([58bf5a5](58bf5a5e2cff18ab7524188387cc893051edf045)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([e03af45](e03af45c09dae9f614ab5dabfb43c48dd2916a34)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([8c04d39](8c04d396e4843fc78a7223bbc46f216a5f199998)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([225af14](225af14b529f87d0f320155f0c434715e893fb0f)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish ([e5604c3](e5604c3e56e8ebdc96d4a15e1610f5dbcae09876)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([ee12362](ee123626880ea5153a164d968312834f9495ae23)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([88fe823](88fe823e774f9fece20fc5a3ffe08afac346afe9)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([4e8cb5d](4e8cb5dbfd20da4e1e2586aed14d34ea375f393c)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([a2f7bad](a2f7bade39335222ab3b6e36dfb7c47028c33161)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([8615a64](8615a64f2fa12145c09fba606257db8cef3eecbc)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([ca55539](ca55539938b99990c6c4c3dd3fcc42d8d99ae6a1)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([51bee9b](51bee9bfd33b555c725105dddc23704e5a2245ed)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([e39748e](e39748ed4ac87bd3bedbab552fc547d8b8cf9113)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([43586d0](43586d0b7c30dccb6fd49dbcf2434e61e96175e8)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([5a03787](5a037876ddb5854fc7bafb6979708ddd9e858d21)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([cdf7f5f](cdf7f5f5a06e055935f6bbaba2913eac6d592cf5)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([2749817](2749817545114bb1a40428750ff8bd47bb734d6a)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([218a269](218a269bb54b10785446607172183347de019b4a)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([96d8ee5](96d8ee522c54d05c43d780c9ef5642f92e582937)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([a392a4c](a392a4c0fde4de12ebb24c8be085f77aa098f985)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([46e7225](46e722559e18fdea585078590f903add32f8a8d0)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Typo (#2829) ([bfa6458](bfa645873710c07a77658ed0472ff817de6d10a5)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([7ec522f](7ec522f165bf50b0c3a935091c22cb8264e6bf20)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish babel crates (#2835) ([d0cabc3](d0cabc37edf78928e32cdaba2cb649f5b2769668)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([e99c4d2](e99c4d26ae887ed72e911d481421418b0218aba0)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([c1e99ee](c1e99eee3e65c352743218bb7cebcf23c3afb70a)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([e4216a2](e4216a2e6c73894942f6ae13d89711893c6fed7a)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([d4ffce1](d4ffce13b576746609b7b2a238132d08a6328821)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([a8bda3b](a8bda3bb9c6120c9037aa3c4394e40e738a7275a)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([770da5a](770da5ae9ebd70ee9c4046ee7eb2a0e43a984176)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish v1.2.112 ([1cc4de3](1cc4de3e9bfae4f25055d8a49f466d64d974434a)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([e04f086](e04f0867fc00b38bb7ca7799c852890049a15e91)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([62a4887](62a48875bd98e570f12d81bdfca003181d81f1a2)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Allow using `#[doc(cfg)]` (#2871) ([28850ee](28850eef5c98d9b0975eb84aa647d2b2c1977cb7)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([2c9de7d](2c9de7dd4ab1aac16a8da5377a2521006884b12e)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([730e138](730e138925fa79d2ba4955c115ec4bb9e094d640)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([a38889b](a38889be91869b8c97a971cab60bce35cd322b5a)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([72e892e](72e892ec12a3f8a9312e28728a7e663bf7f68197)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([ad8dc4d](ad8dc4ded6d9c3b69bfb646d467122bf9015fb73)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([01d4139](01d4139e42cb0e94f05b0d0e9ded3a66815d3c97)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Document features (#2890) ([f5af22e](f5af22ef716db76a39ea22cc88f3f92745fb4aad)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([035b6d8](035b6d83dab7635fd7d17fb2f8b92544f9e3d350)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([0d39521](0d39521b915cace598e0af568c3b6eaabf695600)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([2485c97](2485c97317d1a614330637b4d35ba566bc746881)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([875c421](875c4212595ab0f6019518da06d1652fb0189d50)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([188eaad](188eaad24e4a8beb49dd37d902bfab644210df50)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([3d75b9a](3d75b9a968b597c3684b8ffb9a6aa7fd024f78fa)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([756a9ba](756a9bad6a5ba92921f48857b1d47d6366671fab)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([a46ee17](a46ee17281f0f83b3523469232c1ac569270709c)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([edc0cb0](edc0cb0a2da7faa2a56f7415f9edead740192183)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Reduce compile time (#2909) ([435facc](435faccc2e9e989e6de5b5e6e809599f53afa1c1)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([3211ad2](3211ad23cf5e6e8b2d6abc642ced05e48e1e416f)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([655d754](655d754d0eafd1fe47daf8141161752929dc9ca4)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Fix cargo config ([3695159](36951599584182b56456b69f6e462a1a0f8a0799)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Fix cargo config again ([189a590](189a5903ccbf25531dc26c8f793d14ec08261cbe)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Revert ([166c12d](166c12d295a18507856424f5cd6ab9a18572c9db)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Revert #2907 ([666e3cc](666e3cc71ef8f9e491b45c1ff695a5d0cf21b5d3)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Reduce compile time ([158d4bc](158d4bc1edce4ce5e0fa6a9408ac0037362fb3af)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([167798b](167798b599ac9fe0b3d56bfb1316fcfaf0e044b0)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([9b022db](9b022dbabeca38700c0e19b650cc4c4108cbc363)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([57fb692](57fb69262d552787e4b6ee678566750eaf08e43f)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([073c378](073c3787f1f05d37a9159f82cf220e55aed2224b)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([12d31c9](12d31c997b52e36f178f3fb55d2bca82491ff7c1)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([e6957ce](e6957ce40052cc329869f3a1dcb5a0f4af7b3e86)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([b6f9249](b6f92497bf7d8cd6b4a5ef0b2744a0ffaf83b475)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish v1.2.115 ([86d2ceb](86d2cebd3721e765f467b2ad641a5db966a23cdd)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([563c63c](563c63c2251e45ec5cd6c71e764e4749858a682a)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([1fabb03](1fabb0381af7cdcc6f79ebff5ab3f749a7ec3675)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([f8fcee1](f8fcee1c46247181b7c38fc379f30c6923002c23)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([f9cd49b](f9cd49b8453428bcbca3c715ddf00897fff9c69a)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([3bf751a](3bf751ac4a7e889f7e0be48272e0d16ec4fbff88)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish `v1.2.116` ([4e214ce](4e214ce43753631f8fd7a1224844430eb11e14b5)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([67dc0d3](67dc0d3b9426d3160e95d4be6dce0e892677f819)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Break cycles (#2941) ([0304c55](0304c550a48b0f31ac646ed8e3326c0568210883)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Drop freebsd for publishing ([82c8694](82c8694f4b840d439d091de0ffe9af07c0d172f2)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Add a script to manage crates ([b9baa50](b9baa503e3c8c94fb9f4c535ab83689654715e89)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([36db1ed](36db1ed3591e9afde8df6fd9166058f283a5a02b)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([e8225a6](e8225a66a04d3ae1b519a8a01fed0222d99154f9)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([eade037](eade0374f24c6b01640d3e3ffdd09616dff04653)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([ef3ea6b](ef3ea6b467cc5bef7fb987331291ee11c47dd5a0)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([348b6cf](348b6cf6f0d4688f70b51d0c05d21b1223d7ba79)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([fd8541e](fd8541eb9d8cceaaf901d412e27cfa96ff148773)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Make `rust-analyzer` faster (#2962) ([02322aa](02322aaa9919f75a150b7ea27a637fee0b981b36)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([32e2f3e](32e2f3e46c8ec819250600deb79a5531b9d96215)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([42a93dd](42a93dd8ef39a2997594bc5e41e924613b4ba411)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Remove duplicate version field in `package.json` (#2965) ([ce60138](ce601382d5b79449a355ad636ea83322816eccd9)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([fd2a788](fd2a78828275f1e284f41c7c842a0bb7579aabf7)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([58159d3](58159d377c33969c98c0f5af012ae8d47357aa2a)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([529f980](529f9806937be45d701b2131ff2915301252c206)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Inline `@swc/helpers` (#2972) ([ffec782](ffec782a41c86d8988425df05f719ec80ae6cb0e)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([16540fb](16540fba758861935e86f680975c95669eccf6c2)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([acc45e7](acc45e7c36c329a759100fcda2d4eddcc9f40f93)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([b1a47ee](b1a47ee97111b3196e947da57d4221857762ae19)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([82ece9d](82ece9d0ca3c1c7900707d1b0953b91ee7ade6b9)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([7d4c372](7d4c372e8ae3074ad425fe497d3c19e52563c7fe)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish `@swc/helpers` ([20179a6](20179a6acfd8224a69644d43a8d72dbd5c659f4f)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([bf69cd5](bf69cd554bc4cd5846a674c35d39fd9a1cdb097c)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Fix `@swc/helpers` ([6996d7c](6996d7cdd7ed227bd0794af852d11cbd79ac94b8)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish `@swc/helpers@0.3.2` ([144754a](144754a3ea2c1ab21c77cf2e119bc43cd4dc16ee)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([f6a926e](f6a926e6fb76c4536a708c29a4a1874e8121573c)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([8ea40a3](8ea40a370714b238b5500a86e3ee9b0047a642a9)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Fix license issue (#3002) ([0a637d6](0a637d6ce2fd86dc063e50235e81e3a99b87acfd)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([deae28c](deae28c31dfefb5674464758978cb7417e2b5458)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([c5b943f](c5b943f5880b6fbaf640c11c7f6d79ddc15b243f)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([6886100](68861007d98b022ec02c90db1def868cd2eefa93)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([57f512c](57f512c26229594cba6e82a69dcd33fc8274cf89)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Remove redundant dependencies (#3008) ([cabf5a4](cabf5a458d7e823ce2787ecc0ee660ddb1b390fe)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([9a00c9a](9a00c9a13f8cd0ebf0db7e71b81134c3f5aec74a)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([f87df95](f87df958d5a9a7a4c0a7d2ce3803590f226fe48c)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish crates ([da4111a](da4111a022f6b1b71ff52071fc7a7750e60db1e8)) -->


### Performance

- **(atoms)** Update `string_cache` (#2411) ([4411d1d](4411d1d3a5cd9b05103b5c0a1fd60eb7d096ee50))
- **(bundler)** Improve performance (#2384) ([ac3fbd9](ac3fbd91acec2aab1fb263121b4187ce7390a037))
- **(bundler)** Improve performance (#2394) ([b5f8321](b5f832193a2cfb7dc594d526c049edc66cfccccc))
- **(common)** Avoid string re-allocation (#2318) ([fee270f](fee270fe57ecc1822ed1d6b057e304290c5d8d9d))
- **(es/codegen, es/parser)** Improve performance (#2406) ([4c983e9](4c983e9158d01d6ca510ba6457931fa1a2e99d1b))
- **(es/compat)** Migrate `class_properties` to `VisitMut` partially (#2966) ([89af8ab](89af8ab9a278539b34c93ab888a8930f4a35b146))
- **(es/compat)** Migrate `static_blocks` to `VisitMut` (#2973) ([32f9369](32f936995889e9814e9ac97e313df70c814a9be2))
- **(es/compat)** Migrate `class_properties` to `VisitMut` (#2993) ([a175606](a1756062c5f2e05042bc43c343ace448d65f3925))
- **(es/compat)** Migrate `object_rest` to `VisitMut` (#2997) ([7ca1e17](7ca1e174b7a396eb9952cf42fa32588dab0c965d))
- **(es/compat)** Migrate `regenerator` to `VisitMut` partially (#3007) ([91d6343](91d6343d7fe8272a4fcd645d39fca74b5e0c6fc6))
- **(es/compat)** Migrate `classes` to `VisitMut` partially (#2995) ([333b52c](333b52c646d9d56e37cdf5e6d9f4d04ceb7bfbd6))
- **(es/minifier)** Make name mangler parallel (#2527) ([a099e8f](a099e8f846194109a801a958e28d7971be6368b1))
- **(es/parser)** Make typescript parser faster (#2483) ([bf886ba](bf886bac73ad348ab7bc333e6eae824c96e9abde))
- **(es/transform/compat)** Migrate `optional_chaining` to `VisitMut` (#2891) ([4075ff8](4075ff8029b4d0a71819145dd53de061c47d9b74))
- **(es/transforms)** Improve performance (#2329) ([fac6f47](fac6f4786354f7896c2ca5a2b0f0532e0282cc93))
- **(es/transforms)** Reduce usage of `#[fast_path]` (#2439) ([e722bd4](e722bd4887e19f871238b7301640f89ba404775c))
- **(es/transforms)** Reduce usage of `#[fast_path]` (#2442) ([1645bb3](1645bb30b70f84898d1e5b1ab29c02f031628e5d))
- **(es/transforms)** Make transforms parallel (#2449) ([3d204b4](3d204b44f0883bfe6ac6542eced2d9ce46ef3291))
- **(es/transforms)** Improve performance (#2454) ([575aa44](575aa44c25c4815014ea420bea838d9f0dccda56))
- **(es/transforms/base)** Make `resolver` faster (#2392) ([a330322](a33032279aa4cee19f10a74d72eb3b308f901df1))
- **(es/transforms/compat)** Migrate to `VisitMut` (#2696) ([824fa24](824fa2485276ff85b66a27c7570b280b95199e9c))
- **(es/transforms/compat)** Migrate `parameters` to `VisitMut` (#2804) ([372f5bf](372f5bf1e0608d8a4ed7fe4376839b1c0ffeed27))
- **(es/transforms/compat)** Migrate `block_scoping` to `VisitMut` (#2817) ([a9a9833](a9a9833be8c3506063159b19ad90739ae328d8b9))
- **(es/transforms/compat)** Migrate `computed_props` to `VisitMut` (#2857) ([1609580](1609580a4e99257c1a88e08433e047dfc3a17709))
- **(es/transforms/compat)** Migrate `spread` to `VisitMut` (#2888) ([283074c](283074c86edb3793068d77289f82638061f8a3ee))
- **(node/swc)** Use mimalloc (#2068) ([fe2a063](fe2a06352599f6a61245c374b7fd05b0949ed608))
- **(node/swc)** Parse input using worker thread (#2590) ([db09bce](db09bce687bab9771e041808c8db483f0014d34a))<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Use ahash instead of sip hash (#2073) ([f6aabfc](f6aabfce9c4b7bcd46bd6fdec593ec26f7dc1a09)) -->


### Refactor

- **(css/ast)** Use `delim` token (#2425) ([93a7a17](93a7a17472ec81b1ce23385270e46d767cb851f2))
- **(css/ast)** Rename types (#2532) ([0e45877](0e458778ec4bab29d9ade155bd2ccf8ac21eba22))
- **(css/ast)** Use names from specification for ast types (#2643) ([20f4e21](20f4e2148c752f2fb1200e935fde82aaa9e71b33))
- **(css/ast)** Rename `NamespacedName` to `TypeSelector` (#2642) ([c361982](c36198296395fb0939791f192f1ba959add85873))
- **(css/ast)** Refactor complex selector to represent all css (#2660) ([75e6e08](75e6e08e14ac73fb30bb7ddf9cfdeda6bc7940b9))
- **(css/ast)** Remove `UniversalSelector` (#2673) ([4484d64](4484d64f946b7800a97f0625a9a7846f33cc46e4))
- **(css/ast)** Rename `Text` to `Ident` (#2726) ([65ee1b4](65ee1b467e9aa12d55e2c7a0de69c936bf8852ae))
- **(css/ast)** Rename `StyleRule` to `QualifiedRule` (#2756) ([c50cec1](c50cec1533ad8d8fc8196060207d5d96c75da2d3))
- **(css/ast)** Split pseudo class and pseudo element (#2675) ([4bcf3fc](4bcf3fc2adbf4d0f268c7318407d5d075da97170))
- **(css/codegen)** Use `raw` instead (#2534) ([5ef6686](5ef66860292adf9bc2714bc0a4f3f3f5815a724d))
- **(css/lexer)** Refactor lexer to follow spec (#2593) ([b806551](b806551ade204a11928a60b9d624174c084c0682))
- **(css/lexer)** Follow spec more closely (#2839) ([4bf1f93](4bf1f930176faf2fcd2edcd09abc2f83bc6aa6ed))
- **(css/parser)** Respect spec (#2487) ([430a06c](430a06ce4ddf4e0ee96176789df86ed5df137702))
- **(css/parser)** Fix parsing of some selectors (#2525) ([6876b1b](6876b1b26c2d380264efb5517e25c4cbfb282dc4))
- **(css/parser)** Refactor parser for at rules (#2617) ([cc5398b](cc5398b1a6d915e04ed84298907dc90215c7c255))
- **(es)** Use `BlockStmt` instead `Vec<Stmt>` for static blocks. (#2188) ([99c35ff](99c35ff9800b3d04604800a98994758b5581b5de))
- **(es/ast)** Move `Id` to `swc_ecma_ast` (#3004) ([8340a86](8340a86fbbf86556c8002b628eeb8787e3740d36))
- **(es/compat)** Migrate `destructuring` to `VisitMut` (#2947) ([084eebe](084eebec848b1e4ce097a689ec48d9d54284c61b))
- **(es/dep-graph)** Remove SourceMap dependency (#1908) ([6dc6d8a](6dc6d8a8474f17a1064a9da2d7744bf518f72660))
- **(es/dep_graph)** Use `dyn` instead of `impl` (#2119) ([3d58457](3d5845702707f4d668a099ac81f2eae85d2343e6))
- **(es/estree)** Rename: `babel` => `estree` (#2846) ([790a262](790a262c074909128e2db9ca0240ebce6b75f88e))
- **(es/parser)** Cleanup (#2033) ([4ead801](4ead801295a106e08c109991ea2cf528c40d22a5))
- **(es/parser)** Simplify parsing logic (#2381) ([644e49c](644e49c7faa6cd6f037787662727edeff393c1a7))
- **(es/parser)** Simplify parsing logic (#2405) ([4ad25d2](4ad25d2155028dce44e05dc1fb8f1d1d2e0c9d75))
- **(es/parser)** Cleanup codes for the comment buffer (#2410) ([d114e7d](d114e7d3643a0adc0f75e2664667f5990ea50317))
- **(es/parser)** Deprecate `JscTarget` (#2600) ([3280b4c](3280b4cd7a147cf72f517afa7a11cc5c39ccec06))
- **(es/parser)** Simplify `skip_line_comment` (#2768) ([1bb2c68](1bb2c687c049bb742745dfb259b263533ee801e1))
- **(es/parser)** Remove `import_assertions` from `TsConfig` (#2950) ([97df4ce](97df4cef80862cf6dc8154509d6f91171988c2c4))
- **(es/preset-env)** Avoid unnecessary `unwrap` (#2943) ([3302d17](3302d1733acd5adf4f53ce8c2aef678990f584f2))
- **(es/transforms/bugfix)** Migrate `edge_default_param` to `VisitMut` (#2676) ([8915913](891591382d50a70712b804668f7c56573bca3d12))
- **(es/transforms/compat)** Migrate to `VisitMut` (#2709) ([6148d0c](6148d0c3da011d3d5707424ea822c5948445fc1d))
- **(es/transforms/compat)** Migrate to `VisitMut` (#2751) ([e7cbe3d](e7cbe3df2038a98f0f83cf918604f5b971161e10))
- **(es/transforms/compat)** Lift this replacer out of arrow (#2812) ([fbcbeb4](fbcbeb4892c7e19d1e603eb8a6ebf0c205564d2a))
- **(es/transforms/compat)** Improve `async_to_generator` (#2876) ([a350d86](a350d86c5701084838d8a996d99d4abc0754bb4f))
- **(swc_bundler)** Extract logic for analyzing cycles (#2733) ([b869c81](b869c81888553b870a5a2c79c6ef49354df15670))
- **(visit)** Remove `&dyn Node` from `Visit` (#2984) ([e48263b](e48263b2f3ea4cd1d0e922ced5572d2a83dd7b21))<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Move `HANDLER` to `swc_common` (#2599) ([e589d00](e589d00f62c94065247b4eae69a09840e012dd34)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Remove trailing whitespace (#2668) ([94cb430](94cb4303ae49440aeb9d53d52376ad66b44f28ce)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Flatten crates (#2697) ([687305f](687305f280937cba1544fdade652aeb5f3941b2e)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Flatten more packages (#2706) ([4f70ee6](4f70ee6d980dbe198aa2db6f4ee7427805568064)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Flatten `ecmascript` (#2708) ([2b2f695](2b2f6955f22c7ef04dd844e7aa686bbcefd977db)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Flatten `css` (#2731) ([1d518fe](1d518fe3813ed7847ff76e67001fec8420126286)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Cleanup (#2749) ([2462b99](2462b9941f94bc475cf9ff9c67e3b7c1f98739cc)) -->


### Testing

- **(css/codegen)** Add tests for parenthesis (#2691) ([9824fda](9824fdaae25a78a7762ab930bfa48151b9bfdea7))
- **(css/parser)** Add tests for `@page` at-rule (#2296) ([2a565e8](2a565e846451e6da93a963317d59c1979ec9ed00))
- **(css/parser)** Add tests for comments in selectors (#2293) ([8af2173](8af2173a33ac1fbb3283d28a77ff34c15dadbe37))
- **(css/parser)** Combinators (#2359) ([f0be833](f0be833f14f4477325706b70032492b679f2a8c1))
- **(css/parser)** Add tests for hex colors (#2360) ([1e9ecfb](1e9ecfbad1beca1aa46ae556d9f6b539788d1b8c))
- **(css/parser)** Add tests for comments (#2364) ([a36f8e4](a36f8e42bdf23974ae9118b1798f2071bb0f8312))
- **(css/parser)** Add a test for `BOM` (#2686) ([ca2338e](ca2338edbddc0c9a5be2aee3ece68b449267b137))
- **(es)** Use typescript test suite as a golden testing (#2456) ([675c0e7](675c0e714fc198e5cb18223d718739193a1a8bfc))
- **(es)** Freeze as `es2015` to verify base transforms (#2468) ([01e171a](01e171a4b45f3217d034174419269311885abb35))
- **(es/ext/jest)** Add tests for jest (#2082) ([ddb2dc7](ddb2dc738076b20ba3df64f74fd270910eed885d))
- **(es/minifier)** Add a test for `moment.js` (#2522) ([a8b29b6](a8b29b662e7baecc2fd3366bfb2af5fc4c96fe54))
- **(es/transforms/compat)** Add tests for `optional_catch_binding` (#2502) ([a9869e6](a9869e60f2e8feb0fbcbbba693bc86a14dbeb83f))
- **(swc)** Add a test for sourcemap (#2777) ([53c8939](53c8939550c43ee6ee1a57be2b0388469838483b))

## [1.2.62] - 2021-06-27

### Bug Fixes

- **(es/codegen)** Preserve more comments (#1856) ([098e48b](098e48b8f3557de6e7c0a74637ec34933444f47a))
- **(es/parser)** Fix parsing of abstract class over multiple lines (#1837) ([6c49279](6c492796d03b484dbeee7db46b2b1f37aba4a37a))
- **(es/parser)** Fix span of ExportDefaultDeclaration (#1818) ([7488950](7488950f90bba8c454a12a611d1f8d77405feac7))
- **(es/transforms)** Fix transforms (#1861) ([33f2ab2](33f2ab2d795ee8fbe935f535cf5568a252af1fcc))
- **(es/transforms/base)** Fix fixer for the call in callee position (#1857) ([5345c90](5345c90989be34c592bf5e74e4f58091f26f220e))
- **(es/transforms/module)** Allow importing same module with multiple names (#1830) ([9ae8c47](9ae8c47d9b696772f6027801d5e2e4316249ab7c))
- **(es/transforms/module)** Share usage data between passes (#1829) ([a31ca40](a31ca40dbb653407499753b502cdcd42dc4cacac))
- **(es/utils)** Fix detection of used variables (#1835) ([11f75df](11f75dfdcdf85c0b148fe54a87d2d621dd9e4463))
- **(swc)** Fix sourcemap (#1832) ([5a6c4fd](5a6c4fd5a0418e3b01c44c9a07af669008668e94))

### Features

- **(ci)** Track binary size and performance (#1840) ([f424957](f4249574daea86d948be5d7bac0b7c413744a041))
- **(es/loader)** Add more logics to tsconfig.paths handler (#1860) ([eaaf32d](eaaf32d806065b7bbfb1e0804de2815b749be7e4))
- **(es/visit)** Groundwork to use VisitMut instead of Fold (#1842) ([6ad3f7b](6ad3f7b90ef1c1d54eb9e472a163ce991fc4929b))
- **(swc)** Add import resolvers (#1834) ([4cd4337](4cd43375a5367cd4cff87f391b183bfc0f1c7528))

### Miscellaneous Tasks

- **(es/ast)** Upgrade arbitrary crate to v1 (#1844) ([c5f1c6b](c5f1c6b8ba3a26f1b3463f92954c245ecc52e23a))
- **(es/ast)** Bump version (#1853) ([737ce63](737ce63b78ceb65d0ce482eb72adf1422469f37d))<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Organize project  (#1849) ([ff440d4](ff440d47a402bf5273217f6995269a918886d322)) -->


## [1.2.61] - 2021-06-16

### Bug Fixes

- **(es)** Remove UB (#1815) ([3c3fb35](3c3fb359ee099fea45c87684ca4079e18bb79252))
- **(es)** Fix bugs for the type checker (#1823) ([7fa4e1b](7fa4e1bea53fa1ca8d7fffc6faf84d2ae5c844c4))
- **(es)** Improve handling of typescript (#1824) ([4c8d68b](4c8d68bfe2da7392cf8a9f31e44fefcac91b693c))
- **(es/parser)** Fix parser (#1808) ([c561157](c56115793c3b2fae3d2a6c44f72dfe8ac0a2b426))
- **(es/parser)** Fix lexing of numbers (#1821) ([001af86](001af8637d436420e0bbb2f750bf312800ac4922))
- **(es/parser)** Fix parsing of line terminators (#1755) ([8d8b2d1](8d8b2d10d47953ba0f3374d867fc236f3481b04d))
- **(es/parser)** Fix panic on debug mode (#1828) ([f9bdc7b](f9bdc7b227caa0ce35f33430d0e293769bb02d9e))
- **(es/transforms/optimization)** Fix dead_branch_remover (#1827) ([b5a7a3f](b5a7a3f57798589ec2e652968810e89d05991bc8))
- **(swc)** Fix bugs (#1811) ([97ef7c0](97ef7c0553fc9fefc4dd7ea7627de6fb667dddf2))
- **(swc)** Fix bugs (#1820) ([d3944f5](d3944f520376b03e5df4939d85dfd3239ab7da58))

## [1.2.60] - 2021-06-06

### Bug Fixes

- **(bundler)** Fix cycle detection (#1779) ([4e7723a](4e7723a7a0286f49124e7dc1ca10668ad6a237a9))
- **(es/transforms)** Fix bugs (#1769) ([ad55711](ad55711e45107cbc9e38b99418b211ea97652963))
- **(es/transforms)** Fix bugs (#1783) ([0bd2a3a](0bd2a3a07ece7eee38140e52e167758bb6c120d0))
- **(es/transforms)** Fix bugs (#1795) ([7730a6e](7730a6ea5af2206764fa728b627bb63927b281c1))
- **(es/transforms/base)** Wrap binary operands of unary expressions. (#1793) ([03db7ad](03db7adc9f38c2d5b0915ab2cc96a2121f376cc2))

### Features

- **(node-swc)** Support windows aarch64 and linux aarch64 musl (#1773) ([d657193](d6571933ffa8024db0d04216c6cd5cbb14aa1537))

## [1.2.59] - 2021-05-30

### Bug Fixes

- **(common)** Fix compiler error (#1747) ([7b9b9fe](7b9b9fe9cee9979c165ab4841cbd86daa01d5867))
- **(es)** Fix bugs (#1728) ([a518c83](a518c8348597c30e2c9bab38cbfd9f7698a41f32))
- **(es/codegen)** Fix codegen of classes with minify enabled (#1767) ([5d219b8](5d219b8cd164373cb6359207232633fc00f0cdd9))
- **(es/parser)** Report error for wrong declare keywords (#1760) ([65ffd87](65ffd87771d07a843eb467d3c8f38a9e7dd91ab8))
- **(es/transforms/base)** Fix ts_resolver (#1761) ([9fa878c](9fa878c1a68a1ada44316cb36290b99b17944ef2))
- **(spack)** Fix node resolver (#1748) ([1150fbc](1150fbc9285074106ab6a869b199faf14fbd6651))
- **(spack)** Update the list of node js core modules (#1749) ([3359188](3359188a20f5bf458c4e4661c79886983d3cb89a))
- **(swc)** Fix bugs (#1732) ([a795de7](a795de7f43358baacd8ffdb1374af2eedb726f97))
- **(swc)** Fix bugs (#1739) ([d60c324](d60c3242afaf7ff0fe29dee9f5a1df4944480c42))
- **(swc)** Fix bugs (#1745) ([8726c9c](8726c9caf2ef57b19639e590db04aa2a02024f49))
- **(swc)** Fix bugs (#1753) ([c79db25](c79db252dcf07c83889a3f457516b87855786758))

### Features

- **(es/minifier)** Implement more rules (#1717) ([d20c1d3](d20c1d30890ccbaaefddc505d08daee54da8e9f1))
- **(es/minifier)** Implement more rules (#1730) ([3522fc7](3522fc71e44de6e773322e01b999b8375645f58a))
- **(es/minifier)** Implement more rules (#1731) ([5e2db21](5e2db21e476b8ab22c40dc70e5b88c655b5b94fc))
- **(es/minifier)** Implement more rules (#1735) ([ef6a745](ef6a745599563da4a577971c4aaf3222eb4345ad))
- **(es/minifier)** Implement rules and classify tests (#1750) ([99e7386](99e738643aadf846260ab6b78783d92274904f43))
- **(node-swc)** Support FreeBSD (#1758) ([6a13615](6a13615381725ed06116f1d45281f038fa9331d3))

## [1.2.58] - 2021-05-21

### Bug Fixes

- **(es)** Fix various bugs (#1680) ([24bd5ea](24bd5ea4a4cdd1b7d812ea08fe6617bf2f2a8e49))
- **(es)** Fix various bugs (#1707) ([57d1aaf](57d1aaf80f4e9b21121318759cde4f864692bc46))
- **(es)** Fix bugs (#1709) ([dee8290](dee82904f891ed48d4df124620e71246416c895d))
- **(es/minifier)** Use log instead of stderr (#1715) ([ded8f2b](ded8f2b5e55d7457926856fdce940c5fcbd6e0c4))
- **(es/minifier)** Publish (#1716) ([470c8f4](470c8f47457ff228131834fb09e9d9051ec8fcdb))
- **(es/preset-env)** Update core js compat data (#1719) ([8a2909b](8a2909bc51dda27ecf4d645a017d29de1d2a2750))
- **(es/transform)** Fix bugs (#1699) ([b4aa1d4](b4aa1d48e37260f334435a92b09312a801f6591e))
- **(es/transforms)** Fix bugs (#1691) ([f0d7a3d](f0d7a3d064c6c3bc52906f4d72fd6198af49f3e2))
- **(es/transforms/base)** Fix resolver (#1710) ([a0241c8](a0241c88b253774f085585376eb2218e5be2dfa6))
- **(es/transforms/compat)** Support private methods (#1700) ([b044d2c](b044d2c6dd0e29bb95527d802ad3bddd27aa43e2))
- **(es/transforms/compat)** Fix `async_to_generator` pass. (#1724) ([a1341dc](a1341dcdc68f96f12661d800d9a6e1ab7980b24b))
- **(es/transforsm/compat)** Transform private field access in private methods (#1703) ([8a36435](8a36435ee1897d40591b9fab77eae188d54a12dc))
- **(node-swc)** Fix typescript definitions for react options (#1720) ([c2bd319](c2bd3195e84ba7df9c55207755f4812f626716d4))
- **(swc)** Fix bugs (#1712) ([b6589af](b6589af92bd56c4338166ea429f2e6018a1afccf))

### Features

- **(es)** Support type-only import equals declaration (#1695) ([1dbc364](1dbc3644a50f8a23cbb6d33355dc02a7ca9ccc24))
- **(es/minifier)** Implement minifier partially (#1302) ([c6b22c5](c6b22c57f878b6bc57e54197f6e18582f58f3389))

## [1.2.57] - 2021-05-11

### Bug Fixes

- **(ci)** Don't run tests on macos (#1659) ([4d013d9](4d013d98ca4270c787badb56be074d7ae246a300))
- **(es)** Fix various bugs. (#1664) ([b0b0709](b0b0709e1aedaf7159b77f480cd9b7251df7b14e))
- **(es/parser)** Allow using `override` with `static` (#1663) ([4aed942](4aed9423de5a82b0a90a17dc8ec1cbfe83c3c814))
- **(es/tranforms/base)** Resolver: Handle function declarations in ts modules (#1665) ([aea08fb](aea08fb8c94c0d7857e8c1624566844cfca5fbba))
- **(es/transforms/base)** Fix resolver (#1666) ([9585500](9585500476290adffb9c047dd5cdae3066eab1f6))
- **(es/transforms/base)** Fix resolver (#1672) ([9381d0d](9381d0dbc2b0fc80b53c2654126b2d9937253a71))
- **(es/transforms/compat)** Fix span for comments in classes transform. (#1658) ([c3bf517](c3bf517dc9cf9822da270f1f38f038684105aed2))
- **(es/transforms/compat)** Don't create unnecessary IIFE. (#1669) ([2b918b0](2b918b0c3dcd8784758f39c711f76bd9048f9b37))
- **(es/transforms/compat)** Improve performance (#1673) ([2ad0af9](2ad0af9e9182942aaf55b6aa2aa236e0baa14ce5))
- **(node-swc)** Fixed parseFile (#1654) ([0cdabeb](0cdabeb4c0fe22246eaaf12644e4aa0292f23e6f))

### Features

- **(es/parser)** Allow `override` in parameter properties (#1667) ([1548f6d](1548f6d7992af5dab76998ab572506380a0da2c1))
- **(es/parser)** Enforce order of `abstract` and `override` (#1668) ([50f8048](50f8048f2a953855b63a753a1d09334112acce63))
- **(es/parser)** Enforce orders of `override` and `async` (#1670) ([b713972](b713972493e1652edcc8170ba835a60d4a7f7fa3))
- **(es/transforms/compat)** Add pure comment to classes (#1646) ([f4d0e46](f4d0e46cbb3966917f2736c799cecd5558d7d687))

## [1.2.56] - 2021-05-08

### Bug Fixes

- **(ci)** Fix android build ([e3bdb97](e3bdb97e669d37e5339ce7d717f78f0e7b42b279))
- **(es/transforms/react)** Bump version ([f368c5f](f368c5f81c8cfd464b755c0b34c4b3c08dc89f2b))

## [1.2.55] - 2021-05-07

### Bug Fixes

- **(bundler)** Improve performance (#1599) ([9a07869](9a07869c21ba272306dcd0155409f7af9ad6393b))
- **(bundler)** Fix performance (#1601) ([308792d](308792dc90eefda5476a41a996a210c39e6f1a79))
- **(bundler)** Use proper algorithm for dependency analysis (#1610) ([731dc68](731dc68c92d9feb278c1ed6aead166e43cbc9652))
- **(ci)** Use ghcr.io build image (#1622) ([7ea8760](7ea87600b4dee146dcf9e06bee1066cbf1d2b5cb))
- **(es/transforms/compat)** Allow keywords in method names. (#1651) ([1b1c46b](1b1c46b492c28f52e48c119ea95468ec93e1acef))
- **(es/transforms/fixer)** Handle binary expressions in super class expr (#1636) ([27a1c30](27a1c30fef2948856b3cbc26ae65b69db91f3a18))
- **(es/transforms/optimization)** Preserve `x instanceof Object` (#1630) ([b6ff4d6](b6ff4d6f717dfb4bd41c62c7085e15ace868f296))
- **(es/transforms/react)** Expose `RefreshOptions` (#1635) ([2724cef](2724cefe2cdac5b74c8482815ce7b237133066d2))
- **(es/transforms/react)** Change order of passes (#1639) ([fe107a1](fe107a1223bf8c2361b3ac50cc7280afa32c988c))
- **(es/transforms/resolver)** Fix setter properties (#1645) ([deec1f6](deec1f67a338bc711600beae09099bc695ab0c55))
- **(es/transforms/resolver)** Fix setter properties (#1647) ([abc24c9](abc24c9256c27fb3e860c2fdabdc3ddb8a3344ee))
- **(node-swc)** Fix definition of FunctionDeclaration (#1602) ([1c1de63](1c1de6392bc6c16b9e97dead146521ee4258a437))
- **(node-swc)** Fix outdated types (#1621) ([e9d58fa](e9d58fa002b774de01c118247af0184acf3ceab2))
- **(node-swc)** Fix definition of JSXOpeningElement (#1608) ([304b57c](304b57cdd493ba3d6e5fa25e780d41ae2180a066))
- **(swc)** Fix bugs (#1591) ([dbec753](dbec753ca1b3253c9cea6b6e650606287a7562f2))
- **(swc)** Fix various bugs (#1613) ([5a0bacb](5a0bacb5b8c490cd9dd39ad2e14787220486b470))
- **(swc)** Fix bugs (#1624) ([28bb61f](28bb61fb8d2b2ef8940354e7fc2c5c64244ab579))
- **(swc)** Fix various bugs. (#1632) ([d10671b](d10671bbda6d591a1358d52ef5f0ed8efb360a0d))
- **(wasm-web)** Use jq with an explicit temp file (#1637) ([882e2d9](882e2d91b6c4c7bc93a4668b990a5be516c48f66))

### Features

- **(ast_node)** Add #[ast_serde] (#1595) ([8222cc0](8222cc075d82a3e0a7effd1c40d5e5eb59790704))
- **(babel/compat)** Improve performance of babelify (#1626) ([82ef06a](82ef06afb8cc7ef912afb11bba2293e1d0cd91fd))
- **(es/preset-env)** Make android targets fall back to chrome (#1597) ([a24266d](a24266d986b25c8412945b29501ffa4eb568a211))
- **(es/transforms/optimization)** Simplify: Preserve do-while loops with conditional stoppers (#1618) ([f943021](f943021de0ab3b37addae2d88187fcbba15c6107))
- **(node-swc)** Babel ast translator (#1465) ([d1415f9](d1415f9bf7c5ea377851b93b8844e64023f8aa5e))

## [1.2.54] - 2021-04-19

### Bug Fixes

- **(es/transforms/compat)** Fix syntax context of super classes (#1586) ([d7ea5ae](d7ea5ae00c16a697a3c0ecc325f436a6aeba3be7))
- **(es/transforms/compat)** Handle references to `arguments` inside arrow functions and block scoped loops (#1585) ([1c4fa63](1c4fa63bdcc76fa58682b9a8999f2ac945e5114e))
- **(swc)** Fix bugs (#1560) ([46c3d62](46c3d62ebd06bd6d24091cff972eac53103af891))
- **(swc)** Fix various bugs (#1588) ([4db24fb](4db24fb7f63fdec6e2c3eb59d4948337690663f3))<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Fix bugs (#1590) ([c765c7e](c765c7e06e1d3caa6f7271630831c79f4b3e6a2c)) -->


## [1.2.53] - 2021-04-16

### Bug Fixes

- **(bundler)** Fix bugs (#1572) ([246bdd5](246bdd5088ce48838def373585fe6ef7a45a2a9c))
- **(bundler)** Fix bundler (#1576) ([1178686](1178686a4cec95ec6a3f4c93b273549b70f47263))
- **(es/transforms/base)** Fix nested function scopes (#1559) ([92bbde3](92bbde3b5377e281525828de426e481fbc70029f))
- **(es/transforms/base)** Fix precedence of yield expression inside ternary (#1577) ([00461f3](00461f3a76ed82f41f334cd34008209563c473e5))
- **(es/transforms/base/fixer)** Fix parens of sequence expressions (#1566) ([14edb69](14edb69826c1c405a396a29f58a214b9cc3ed624))
- **(es/transforms/compat)** Fix block scoping of class declarations (#1569) ([d8a18df](d8a18dfd9e9e67da0ef19c5f44e847534790e58f))
- **(es/transforms/compat)** Fix regenerator pass for yield* expressions (#1580) ([efa7a9a](efa7a9af7801c00362960b86c6e11c5bd97c21d1))
- **(es/transforms/module)** Use correct this (#1561) ([df2a926](df2a926e9d4908456256e701b1399d3af7d153d0))
- **(es/transforms/optimization)** Preserve missing object members (#1567) ([e43de77](e43de77ec6740ac558f191cdcb49fd41bc45da34))

## [1.2.52] - 2021-04-11

### Bug Fixes

- **(es)** Fix for the type checker (#1528) ([4ab7a91](4ab7a91fe30d3c39c8ea4849e3e7f188ecaa1160))
- **(es)** Fix sourcemap (#1548) ([62d0cbc](62d0cbcabb9d63d0dc1933c63ea9fd4811dcd835))
- **(es)** Fix bugs. (#1565) ([5ef3c43](5ef3c43522c1f9a5892aa4b48bc46d8434fd45fe))
- **(es/ast)** Remove TsSignatureDecl (#1531) ([f179270](f1792708b46d9c434806a26ac19e1811d8b171a6))
- **(es/codegen)** Fix sourcemaps of multi line block comments (#1511) ([393808a](393808a8f68f134688fea3b9cd5f7504f13506a5))
- **(es/parser)** Fix assert after imports (#1513) ([3ddf229](3ddf229c18e9c391bd03c98cce59a6e0540a3007))
- **(es/parser)** Use correct position for comments (#1527) ([5ce4e1e](5ce4e1e9278c83a1b6f955da01f7ba3f62240883))
- **(es/parser)** Disallow `override` in non-subclass (#1552) ([39e1e54](39e1e54ee4a44980f592b7e053b8c187f6efba12))
- **(es/parser)** Fix error message (#1551) ([f002b73](f002b73d825f23f58106b344af301c1c1b02876a))
- **(es/transforms/base)** Fix named function expression handling in resolver (#1540) ([beeb1f9](beeb1f90671e604aa2fe0672288757ab54869e17))
- **(es/transforms/optimization)** Fix inlining nested block statements in branch simplifier (#1536) ([0d79ca6](0d79ca617d7847420983de5b40fd81a503050800))
- **(es/transforms/optimization)** Fix function hoisting with early return branch simplification (#1539) ([ee641ba](ee641bab630dff154fab23cdd2c9eadc772b07a2))
- **(es/transforms/typescript)** Fix TS import elision with shadowed declarations (#1521) ([b9f5a50](b9f5a50d184b2aa2c99631cea510d5762ecb1ea6))
- **(node-swc)** Make `Argument.spread` optional (#1535) ([dcaea5f](dcaea5fd316c5d0e64158f9d8ca883c2d8fecf0d))
- **(node-swc)** Fix VariableDeclarationKind typescript definition (#1542) ([c7dc911](c7dc9116e1836f02a0d6146479f5d1beb517c459))
- **(node-swc)** Fix handling of tagged template expressions in Visitor (#1544) ([228429c](228429c7bb069c9e7dbf36b50a0281d604145644))
- **(strip)** Expand class expressions as sequences ([8b1f8dd](8b1f8dde4b3ed286dd0a16472492b53aba21980b))
- **(swc)** Fix bugs for v1.2.52 (#1506) ([99f4f0f](99f4f0f2808ac7a35cc73adcae44bc2292e053a7))
- **(swc)** Fix bugs (#1529) ([252804d](252804d2e34c192a3b5146915e752d3fa023980a))
- **(swc)** Fix various bugs (#1550) ([2211a99](2211a9908a9a1c2e01d5f483ad91ac396336dc08))<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Fix bugs (#1516) ([51d0cef](51d0cef287bd90c337db391e977daf34d8820419)) -->


### Features

- **(es)** Support TS 4.3 static index signature in class (#1537) ([6512216](65122163cff5bc270b8d4e8f481e6f3b50316c43))
- **(es)** Support `override` syntax in class for TS 4.3 (#1541) ([3d0ad22](3d0ad22acec606008cdb4dd1725ff4db567c3dfc))
- **(es/transforms/react)** Support fast refresh (#1524) ([0fabc2c](0fabc2cfc9486a75f31e319d14a4a781d78a7402))
- **(es/transforms/react)** Fast refresh config (#1538) ([6cad184](6cad184dfdfe0ab544c7ab923214bf37e5421bd2))
- **(es/transforms/react)** Add pure annotation comments (#1564) ([8f5daa3](8f5daa3bbbcc05997a71dd23159347ad3622238c))

### Miscellaneous Tasks

- **(ci)** Configure github actions for rustdoc (#1523) ([13a9d12](13a9d12c849a0ed0b01d729b5fa7fef7b3d5f9bd))

## [1.2.51] - 2021-03-28

### Bug Fixes

- **(bundler)** Fix stack overflow on Windows (#1464) ([fec189f](fec189f2f3827cae7bff862890f83ccfc2bfcb5c))
- **(bundler)** Fix inlining pass (#1495) ([7853b0a](7853b0a76c923a6d86e2964cb2951e3b03fdf018))
- **(ci)** Speed up (#1494) ([0351a47](0351a4767891d06dc1ca46bc46b162827ecb8c96))
- **(common)** Fix column positions in generated sourcemaps (#1470) ([9d53a70](9d53a70221a90e421b937bf2ec0d28004abe0f76))
- **(es/codegen)** Fix SX spread props (#1463) ([06cb4b8](06cb4b89cba109e8bae8739a8509c5be569d1da1))
- **(es/codegen)** Fix codegen of arrow expressions. (#1452) ([9445c10](9445c109f99d9ee18c295c5d18563693ac40ccc7))
- **(es/transforms/base)** Fix fixer (#1496) ([b7eb1f9](b7eb1f91543d7e7e1c4977ba415dfee829d7a16b))
- **(es/transforms/fixer)** Fix await expressions. (#1475) ([df3f310](df3f3106df43f71e30099b19ea5fce94527bc212))
- **(es/transforms/react)** Handle jsx entities in attributes correctly (#1501) ([232cfc5](232cfc5f4f39591c48e44c8a243d166b986b94ae))
- **(es/transforms/typescript)** Precompute class field keys (#1498) ([8eae009](8eae00900f88b09cf04dc1a991f815124a07d08f))
- **(strip)** Combine typescript_class_properties() into strip() (#1478) ([9bc074e](9bc074ed469a7b3e85a0ef23df27ff857fe44b84))
- **(strip)** Transform static class fields to assignments (#1487) ([fa3d65c](fa3d65cd585402a4128a4801ddeacf11f5fbd07d))
- **(swc)** Fix bugs (#1453) ([dcdac2d](dcdac2db6fbe9e1b78dc99dc1e29aa24c6a683f1))

### Miscellaneous Tasks
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Add note about required dev tools (#1467) ([a903683](a90368372f340a356a90eccb2bbf423caf80f73c)) -->


### Refactor

- **(es/ast)** Change TaggedTpl to have a Tpl (#1114) ([da62c73](da62c732391f3445a67bc2fb1c4753068df77676))

## [1.2.50] - 2021-03-03

### Bug Fixes

- **(bundler)** Fix bundler (#1427) ([c047e0e](c047e0e54d044a0e10df528fb33bf8a9e8c6208f))
- **(bundler)** Fix bugs (#1437) ([bbaf619](bbaf619f63f98c00e5730b3f078d3affc54ad01d))
- **(es/parser)** Recover from type annotations after `=` (#1445) ([73b8826](73b8826a2f9b53eddce0399bd141a6865c1107db))
- **(es/parser)** Fix lexing of template literals. (#1450) ([bc07215](bc07215d4df960deccdb1c7d82a790f5325618a7))
- **(es/transforms/base)** Fix span hygiene of type elements (#1436) ([a4d408d](a4d408dc6e192200fa0c1c4a8c6af61d96ea2204))
- **(swc)** Fix various bugs (#1440) ([a310542](a3105428ba2ff9abd7d0e5464868da3ca9b66294))
- **(swc)** Fix bugs for v1.2.50 (#1444) ([97269a3](97269a37b964f362d4d8cade37ce30010a4a6199))

### Features

- **(es/transforms)** Port @babel/preset-modules (#1439) ([eec65f2](eec65f25bbfaaf81ee6e18ed2b9461c1d7d8c618))

### Miscellaneous Tasks
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Typo (#1442) ([24dac86](24dac8605b8ed6473ac5881651437c3f614bb001)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Fix link (#1443) ([7d62fdf](7d62fdf761b558f7ca29a85f6da76f82f1750802)) -->


## [1.2.49] - 2021-02-23

### Bug Fixes

- **(common)** Allow using with MIRI (#1426) ([abfff69](abfff69300e46fff8d244fe27bacf08c1545d005))
- **(node-swc)** Fix glibc compatibility issue (#1431) ([6ece763](6ece76367b3b36e673e16ffd8d9600ccdd6c65cf))<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Fix tests on windows (#1419) ([59bd00d](59bd00d8413fc95cb285e838e66f26b5b09fd2bb)) -->


## [1.2.48] - 2021-02-22

### Bug Fixes

- **(bundler)** Fix bugs (#1373) ([bfde9a1](bfde9a1f6e40d572b0cfdc6d6c4180d13e4883a4))
- **(bundler)** Fix bugs (#1382) ([7f5bfdc](7f5bfdcc006749acd60cd2c6b6cc82b82f4c7aee))
- **(es)** Fix for the type checker (#1381) ([686c981](686c98116d0483ea73529c6ae662b0908fea9203))
- **(es)** Fix bugs (#1395) ([9dabf00](9dabf00200cefe7af2569ab6d9dd3cc1769c6af2))
- **(es)** Fix docs.rs (#1399) ([fc2a8cb](fc2a8cb073e00759a867422b6ff3a52d2c04e429))
- **(es)** Improve performance (#1411) ([eaeffab](eaeffabf74d73696bb45e106a92cbcd9fd34d8f3))
- **(es/ast)** Remove TsTypeCastExpr it's not used (#1420) ([adcca03](adcca03cfa5d12eea37533b4fdefa94a3895ffe6))
- **(es/parser)** Fix bugs (#1405) ([5ad57b0](5ad57b02f2a2d5970bf23a04154da243e7a991a2))
- **(es/transforms/base)** Fix hygiene of catch clause (#1413) ([27aad87](27aad87798fb3ce4b619f0891e83514089d2e8e8))
- **(es/transforms/base)** Fix resolver (#1414) ([eecdca4](eecdca4e866f470781806ed287fd8480aefa8dce))
- **(es/transforms/react)** Use VisitMut instead of Fold (#1409) ([8fb0b4c](8fb0b4c30339c1d2609239b6feb093735c83b140))
- **(node)** Add es2020 to JscTarget in types.ts (#1376) ([98ae167](98ae16761d2dd91c691c00e69375db6bad392eca))
- **(node-swc)** Don't remove plugin from options (#1390) ([a0898e8](a0898e8ce311d5838c52a77dd5e47974e21016ac))
- **(node-swc)** Handle empty object patterns. (#1393) ([f5a90ae](f5a90ae985c3a5dff80fb8f83facc5196093d4d7))
- **(swc)** Fix  bugs (#1372) ([bf445a7](bf445a75c4ed1df5a4f450e0c665159188655de1))
- **(swc)** Reduce allocation (#1401) ([a53186c](a53186c842bf9eb33f0834bab911a7f5a8c9b17b))

### Documentation
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Fixed documentation link URL in README.md (#1375) ([7a93594](7a935942294c2b72480c6ecf1388684d625a1229)) -->


### Features

- **(es/parser)** Allow to look at the kind of an error (#1396) ([313f51f](313f51fab159f2e58eef9574c95fc8546dab9782))
- **(es/preset-env)** Custom config path (#1374) ([bd119e6](bd119e6634d4b017982d4a02ebd07fa867c4a9fd))
- **(es/transforms/react)** New jsx transform (#1408) ([0be20ff](0be20ff0ae49f379a63a5ce0f1a3d806dae1eff7))
- **(node-swc)** Reduce binary size (#1418) ([9d896c7](9d896c746e4604c9047f8ef62bcd728ca51d3aa3))<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Add import assertion to dep analyzer (#1387) ([8ef78a9](8ef78a9e08008275c3c60090ce65ad4339220eb5)) -->


### Miscellaneous Tasks

- **(node-swc)** Use latest napi versions (#1386) ([79e991b](79e991bcc32c6b89e61df1db3ca6133eb0a855e3))

## [1.2.47] - 2021-01-30

### Bug Fixes

- **(bundler)** Fix bugs (#1349) ([947161b](947161b43b81e5e7f8fdb33b2fadebbd95e6b6ee))
- **(bundler)** Fix pass ordering (#1363) ([767f21e](767f21e9ddf037cc429df7ec52ce45b94c6b9fe9))
- **(bundler)** Prevent hanging (#1369) ([0d130f8](0d130f8103527d018a15c97680431acfab766a4d))
- **(es)** Fixes for type checker (#1359) ([93a1914](93a19140a8dd845a0f0601e5f2efca0196d105a8))
- **(es/ast)** Compilation (#1357) ([2921b90](2921b903d7e07edebe221ad0dc2ef46c9ebf3f3e))
- **(es/ast)** Fix EqIgnoreSpan (#1360) ([947f9c5](947f9c56411cb6cee6cdc8370d01f986d9825245))
- **(swc)** Fix bugs for v1.2.47 (#1368) ([af25a88](af25a889026a84b385272e4d288b9dc83d0433de))

### Features

- **(es/transforms/typescript)** Strip out type-only namespaces (#1361) ([78e79a7](78e79a7acec59ae6e9a5818aa369b7b3b4cf1781))
- **(node-swc)** Support windows ia32 arch (#1367) ([ca417e9](ca417e9d59d8d7ae591963bf8073fdfa3017143d))

## [1.2.46] - 2021-01-24

### Bug Fixes

- **(bundler)** Publish ([ebc0d0a](ebc0d0a203ce683957e5aca3ab273f39a011adb8))
- **(bundler)** Fix bugs (#1342) ([17f17e8](17f17e82e67983d5bb3cb91f90d862fae7b76ef3))
- **(bundler)** Fix bugs (#1346) ([6a1c3da](6a1c3da3264a3ca5482134efb90744f4fd7ca296))
- **(es)** Fixes for the type checker (#1331) ([613a5a4](613a5a45dd2828739ab33dbc194b91b1a0ec0c6c))
- **(es)** Move and rename JscTarget (#1343) ([0469e3a](0469e3a33e0a379cbdd5c2fd1d8139ef2b4da42e))
- **(es)** Fix bugs (#1347) ([d4df2ce](d4df2cece8bd08cad314086743165ef653f016ac))
- **(es)** Fix bugs (#1353) ([b7ae896](b7ae896bbd0a2b3052490c04d3ffe6ce7ec80511))
- **(es/transforms)** Handle enum in namespaces (#1340) ([ddc9492](ddc9492aedd924dd14f10b70c426fd8bfe5157ad))
- **(swc)** Fix bugs (#1300) ([a9bf9bb](a9bf9bb9e1b4e060a554ce5f7cfebe6a64d9791b))

### Features

- **(ES/transform/typescript)** Support namespace (#1325) ([6984217](698421720014e93dcc4b1dbf39bb671be178aceb))
- **(es)** TypeScript 4.2 (#1330) ([3faefb5](3faefb5836942062e372727503bacc099185f0e7))

## [1.2.44] - 2021-01-11

### Bug Fixes

- **(bundler)** Fix bundler (#1318) ([23aebac](23aebacadea4a724cc71318ef25a029d1feeeaaf))
- **(ci)** Insert *_bg files in @swc/wasm-web (#1305) ([895b431](895b431f7279457b38547ed75b7e27beb75a9a09))
- **(ecmascript/transforms)** Fix dce (#1301) ([842b6f9](842b6f953c205c32d98ee0bbdabccd79de21bf1c))

### Features

- **(ecmascript)** Remove macros (#1319) ([c83d19e](c83d19eb2f4e39f0795e6173a0b5ba3e05e844b7))
- **(ecmascript/transforms)** Split into multiple crates. (#1311) ([76d9e2a](76d9e2a9dfe3f5e6d4f10834c6740637f65eef44))

### Miscellaneous Tasks
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Fix website docs link (#1317) ([5d88e8b](5d88e8ba5434bd059eb2ae91df295fb3f1fb707b)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Update actions/setup-node (#1315) ([78dc61a](78dc61af332fe8ce796d9345a86ef7830294e135)) -->


## [1.2.42] - 2020-12-29

### Bug Fixes

- **(bundler)** Fix statement ordering issue (#1264) ([b66ee58](b66ee58ee3a5c6a61d9e5bfa566eb66f9c0725fa))
- **(bundler)** Fix remaining bugs (#1296) ([ba13db5](ba13db54db5a3c412888490bec537b9f4a9d448a))
- **(bundler)** Don't load dynamic imports (#1297) ([bc7ac45](bc7ac45d8701a0783250ec720a9ae9dd10fb95b8))
- **(ci)** Insert *_bg files in @swc/wasm-web (#1291) (#1293) ([066bb4e](066bb4e9c92371055f9752b7ff01aacf03f75048))
- **(swc)** Fixes for typescript type checker (#1146) ([6941f29](6941f29943fb95a980ded584ead6dee2c630814f))

### Features

- **(ecmascript/ast)** Add EqIgnoreSpan and TypeEq (#1295) ([34249bb](34249bbf47dfac31ded39d750a4eae24b6ba84c5))
- **(ecmascript/codegen)** Fix and use omit_trailing_semi (#1298) ([9063908](906390852836cb130e9eeec409cb4ec1e7fb82bd))

## [1.2.41] - 2020-12-23

### Bug Fixes

- **(ci)** Fix ci (OOM & library api change) (#1284) ([0ead8dc](0ead8dc403cd1ade73c50f39955323aea6d8349e))
- **(ci)** Publish npm packages as public (#1277) (#1290) ([dd977ff](dd977ff80c9f439169b115e995efa6c8e93bc47e))
- **(ecmascript)** Fix bugs related to string literals (#1287) ([8a8db58](8a8db58f1c879a269fecfbcf08813f40b580ca0f))
- **(ecmascript/codegen)** TsQualifiedName has trailing dot (#1268) ([b760c7c](b760c7c9c7206dc4e59f58b929ad64f94c48f80c))
- **(ecmascript/lexer)** Normalize \r\n and \r to \n in template literals (#1286) ([576fb6a](576fb6a532913f8b48ff67d66adc9b35fe8f945e))
- **(ecmascript/parser)** Fix span of `declare` decls. (#1282) ([bf69b47](bf69b477918f42861e1511f5d6b475a5d2637580))

### Features

- **(ecmascript/parser)** Add tests for binding patterns (#1289) ([c2a9994](c2a99944cfa35c7f7b0cdaaf264c16d05d3d39ec))
- **(fixer)** Handle ?? properly (#1270) ([ccf4c2b](ccf4c2b12cf82f22c7d26d3c3e4581dc5a2ad320))
- **(node-swc)** Remove duplicate type and correct name (#1267) ([261e2ec](261e2ec5ffeea3aef56f7da3be429d7d63d3db65))
- **(parser)** Don't hang on unexpected inputs (#1274) ([25856f2](25856f230c604868aea7a957ce5f29fe82d2c8b5))
- **(visit)** Add support for Arc<T> (#1256) ([718f478](718f47803bcfd0ff2d11bf72aaa7c34029cae789))
- **(wasm-web)** Initialize ([edf74fc](edf74fc1ec6543af5844c666187659700b68699e))<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Specifier position in DependencyDescriptor (#1260) ([8ba2ae9](8ba2ae959d0a44b368e26daf6a23657f83f3196c)) -->


## [1.2.40] - 2020-12-03

### Bug Fixes

- **(regenerator)** Handle ternary correctly (#1228) ([f8a1fb8](f8a1fb878daf603150174ca23b7e6d22d22e3b5c))
- **(source map)** Fix inline source map comment slicing (#1237) ([cdaefcc](cdaefcc27e3c943e6ff9b98fc4ea19f0d7a1bf23))<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Decorator metadata (#1248) ([2e29d78](2e29d7828164493ec6e8e3c043325ebcd2d935e1)) -->


### Features

- **(swc_common)** Expose non-tty EmitterWriter (#1240) ([46b553e](46b553ecc3efd3ddcaff6531535b27526dc16781))

## [1.2.39] - 2020-11-22

### Bug Fixes

- **(typo)** Dowloads => downloads (#1222) ([723970d](723970db1f8e0077dfd5a641f7edf87ca3053961))<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Publish script ([1268206](1268206bff17b1258e125f6214f8d9b2b1dc42a3)) -->


### Features
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Macro for fixture testing (#1226) ([ad23a58](ad23a58fed924747a4175b22f0ba49db40a9dd2d)) -->


## [1.2.38] - 2020-11-08

### Bug Fixes
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** SourceMap::span_to_lines for empty file (#1198) ([546a01c](546a01cdc2f7dbe4bda06a2f3440c117136b72a8)) -->


## [1.2.35] - 2020-10-04

### Bug Fixes

- **(jsx)** Drop extra spaces around jsx attributes (#1121) ([ea09133](ea091337d80760df6e09bce90ed3906ecb3e7626))
- **(strip)** Don't treat type-only exports as concrete references (#1126) ([e4b8a0c](e4b8a0cc1eed8de5d7f8f9706ced5acc56f6c15e))

## [1.2.33] - 2020-09-24

### Bug Fixes

- **(strip)** Fix Config::import_not_used_as_values (#1101) ([a9c3072](a9c3072b651fec425b569829fb75012e93282115))

### Miscellaneous Tasks
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Bump version of wasm (#1102) ([73671ec](73671ecd90900194f87a39947f37ce15a8675ea9)) -->


## [1.2.25] - 2020-09-11

### Bug Fixes
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Handle conditional expression in callee (#1051) ([9be8bf6](9be8bf671d27033df7d535840dfe2b54a12792b2)) -->


## [1.2.23-alpha.1] - 2020-09-07

### Bug Fixes

- **(dep_graph)** Top level dynamic import (#1024) ([c4cc433](c4cc4334348a633ced02976c8ac584448253e63c))<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Expose dep_graph crate (#1023) ([9a073f1](9a073f10a58270d66b6fd745ca29f3400ea70797)) -->
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Handle binary expression in callee of new (#1030) ([6524802](6524802ae526bf2437c7025d0ed2e79a92ad66eb)) -->


## [1.2.10] - 2020-07-31

### Bug Fixes
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Readonly is not stripped from private prop (#916) ([9cb32cb](9cb32cbb7581a2c967d189afa7b0ca7311180f92)) -->


## [1.0.48] - 2019-11-10

### Miscellaneous Tasks
<!-- NOTE: Most of chore commits do not have category, so for now skipping it in changelogs. Enable if needed. -->
<!-- - **(No Category)** Cleanup for docs; no email from travis ([056a11d](056a11dd06c35dff6a6531890124876ba7c811bf)) -->


<!-- generated by git-cliff -->
