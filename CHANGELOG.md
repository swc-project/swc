# Changelog
## [unreleased]

### Bug Fixes



- **(bindings/node)** Support `TsSatisfiesExpression` ([#7317](https://github.com/swc-project/swc/issues/7317)) ([761ef83](https://github.com/swc-project/swc/commit/761ef8389dd000e465bd385ec925654a8cb2ae09))


- **(bindings/type)** Update types of `jsc.experimental` ([#7972](https://github.com/swc-project/swc/issues/7972)) ([e40fccb](https://github.com/swc-project/swc/commit/e40fccb9ce2a8fc925de818c8da4b6503aab7ae3))


- **(ci)** Fix CI ([#8079](https://github.com/swc-project/swc/issues/8079)) ([7073e83](https://github.com/swc-project/swc/commit/7073e83f65ed5e98ee294c8e366a80b0a0f5921f))


- **(ci)** Set `tag` for wasm publish actions ([#8200](https://github.com/swc-project/swc/issues/8200)) ([8db80b8](https://github.com/swc-project/swc/commit/8db80b8c28bba5a423194dd19ddf05ccd94eb650))


- **(common)** Workaround the `Arc` and `rkyv` issue ([#7321](https://github.com/swc-project/swc/issues/7321)) ([577f81e](https://github.com/swc-project/swc/commit/577f81ec405f4f3a3e58e3f97c07d3720dd80912))


- **(common)** Disable `tracing/release_max_level_info` ([#7401](https://github.com/swc-project/swc/issues/7401)) ([95291f2](https://github.com/swc-project/swc/commit/95291f2c5daaf039623b4db4668a91104c0c0124))


- **(common)** Fix logic for excluding `FileName` from source maps ([#7900](https://github.com/swc-project/swc/issues/7900)) ([aa64955](https://github.com/swc-project/swc/commit/aa6495519b9271cb21d380c0c5a35fe79d31ee14))


- **(css/ast)** Make `.hash()` of `Token` not recursive ([#8151](https://github.com/swc-project/swc/issues/8151)) ([8d7894c](https://github.com/swc-project/swc/commit/8d7894c71f86ef6b1813b69a15d72bb7911ed7ca))


- **(css/modules)** Don't drop the correct selector ([#7450](https://github.com/swc-project/swc/issues/7450)) ([d370324](https://github.com/swc-project/swc/commit/d370324cfd251af49853fe887644fcaa8d811431))


- **(css/modules)** Fix `:local` and `:global` ([#7600](https://github.com/swc-project/swc/issues/7600)) ([f0ab5b3](https://github.com/swc-project/swc/commit/f0ab5b39f79685023cfc9529bc60e96231ad18d7))


- **(css/modules)** Preserve attr selectors used with `:global` ([#7670](https://github.com/swc-project/swc/issues/7670)) ([11b4679](https://github.com/swc-project/swc/commit/11b4679231bdfa8662fdcb1dade4dc1146f8e11d))


- **(css/modules)** Aggregate class names when composes is chained. ([#7917](https://github.com/swc-project/swc/issues/7917)) ([0db25a2](https://github.com/swc-project/swc/commit/0db25a252cf35e4b64b38bde9f34a2f33eb2f662))


- **(css/modules)** Support composes when using multiple subclass selectors ([#7949](https://github.com/swc-project/swc/issues/7949)) ([05ca19b](https://github.com/swc-project/swc/commit/05ca19b84489ae47f69d8228b3c0097164c7ec6e))


- **(css/modules)** Allow out-of-order class names for `composes` ([#8218](https://github.com/swc-project/swc/issues/8218)) ([aeb9caf](https://github.com/swc-project/swc/commit/aeb9cafd11c56d9dce41372211d90a3edb4d1848))


- **(css/modules)** Fix handling of `:global()` selector ([#8219](https://github.com/swc-project/swc/issues/8219)) ([02cd7c2](https://github.com/swc-project/swc/commit/02cd7c2608758476545aadf62e01f2d74ed486f2))


- **(es)** Fix a crash related to source map ([#7307](https://github.com/swc-project/swc/issues/7307)) ([e7f7b01](https://github.com/swc-project/swc/commit/e7f7b01f59b622c993ee584ae825a39c390b2570))


- **(es)** Init filesystem cache only if plugin exists ([#7436](https://github.com/swc-project/swc/issues/7436)) ([786cf3a](https://github.com/swc-project/swc/commit/786cf3a10ffe5e2990c5473062ea42771b769124))


- **(es)** Ignore input sourcemap error ([#7446](https://github.com/swc-project/swc/issues/7446)) ([0c92e53](https://github.com/swc-project/swc/commit/0c92e534a5e3ccc74077ac03c473ad2c12fd5349))


- **(es)** Accept `parse` option for `minify()` ([#7543](https://github.com/swc-project/swc/issues/7543)) ([1d84e95](https://github.com/swc-project/swc/commit/1d84e952feefc3cd50e379455bb6648b82c42256))


- **(es)** Fix typo in a warning ([#7740](https://github.com/swc-project/swc/issues/7740)) ([22e06cc](https://github.com/swc-project/swc/commit/22e06cce630b365b17f390559e065ee48cb3d2b9))


- **(es)** Resolve `jsc.baseUrl` for `.swcrc` specified by `--config-file` ([#7801](https://github.com/swc-project/swc/issues/7801)) ([fe1ca26](https://github.com/swc-project/swc/commit/fe1ca26218493d2e7d4121433c365a37e13285e6))


- **(es)** Fix default value of `jsc.minify.format.comments` ([#7853](https://github.com/swc-project/swc/issues/7853)) ([64e51d3](https://github.com/swc-project/swc/commit/64e51d3a28052734d2eaf9992bc8ba578dd5630b))


- **(es)** Enable resolver if `jsc.baseUrl` is specified ([#7998](https://github.com/swc-project/swc/issues/7998)) ([f374ad9](https://github.com/swc-project/swc/commit/f374ad903a066ebf3a7e54a3656cb3fc44b37445))


- **(es/ast)** Bump version ([#7793](https://github.com/swc-project/swc/issues/7793)) ([13bedc0](https://github.com/swc-project/swc/commit/13bedc084e46db193b3fd0b7930046b2f013742b))


- **(es/codegen)** Fix codegen of `TsModuleDecl` ([#7319](https://github.com/swc-project/swc/issues/7319)) ([0ca05d8](https://github.com/swc-project/swc/commit/0ca05d8b69b6301e2346e5de6c45a77c863676e9))


- **(es/codegen)** Emit type arguments for call expressions ([#7335](https://github.com/swc-project/swc/issues/7335)) ([7e99e5f](https://github.com/swc-project/swc/commit/7e99e5fd2c3d15aba6bf29958bd9305e29312e6a))


- **(es/codegen)** Do not create duplicate source map entry ([#7309](https://github.com/swc-project/swc/issues/7309)) ([40ba242](https://github.com/swc-project/swc/commit/40ba242076f9c39cd19fe2a040fdf10867c67b9f))


- **(es/codegen)** Emit `;` for `TsImportEqualsDecl` ([#7464](https://github.com/swc-project/swc/issues/7464)) ([3935d02](https://github.com/swc-project/swc/commit/3935d02e365c2fcfdf517fe6dc5943f4ba2616cd))


- **(es/codegen)** Remove extra spaces in `AssignPatProp` and `KeyValuePatProp` ([#7488](https://github.com/swc-project/swc/issues/7488)) ([064bcf4](https://github.com/swc-project/swc/commit/064bcf4854f8505f04b40b72da1becec0c531a7d))


- **(es/codegen)** Emit type arguments of jsx element names ([#7522](https://github.com/swc-project/swc/issues/7522)) ([a0da02d](https://github.com/swc-project/swc/commit/a0da02d0ff641863dafc1a7d573419478c3b16dc))


- **(es/codegen)** Fix regression of source maps ([#7523](https://github.com/swc-project/swc/issues/7523)) ([f27838d](https://github.com/swc-project/swc/commit/f27838dedcac792ac30380f45ef89b329221de59))


- **(es/codegen)** Don't strip necessary escape characters ([#7687](https://github.com/swc-project/swc/issues/7687)) ([b45649b](https://github.com/swc-project/swc/commit/b45649b8d6484bd872f6443fc729f6b1998ff44d))


- **(es/codegen)** Add quotes to property names when `ascii_only` is `true` ([#7820](https://github.com/swc-project/swc/issues/7820)) ([04921f3](https://github.com/swc-project/swc/commit/04921f301afbc2dc74bed4cb24e7656b60e54327))


- **(es/codegen)** Fix placing of comments of yield arguments ([#7858](https://github.com/swc-project/swc/issues/7858)) ([122d14c](https://github.com/swc-project/swc/commit/122d14c0d306d7c437f1ef0f6f375634ff5d7d1a))


- **(es/codegen)** Emit leading comments for `ExprStmt` ([#7916](https://github.com/swc-project/swc/issues/7916)) ([2da5895](https://github.com/swc-project/swc/commit/2da58959c26d5afb0b8f179fc681478bf05e6e20))


- **(es/codegen)** Use `emitAssertForImportAttributes` ([#7936](https://github.com/swc-project/swc/issues/7936)) ([dac8888](https://github.com/swc-project/swc/commit/dac8888829841e1de19d53c887a2a52c9ab5feaa))


- **(es/codegen)** Fix codegen of unicode surrogates ([#7985](https://github.com/swc-project/swc/issues/7985)) ([39c680d](https://github.com/swc-project/swc/commit/39c680d814644fbde50b0f73a29aebe791812eb2))


- **(es/codegen)** Fix codegen of optional chaining expr with a comment ([#8005](https://github.com/swc-project/swc/issues/8005)) ([f07bb48](https://github.com/swc-project/swc/commit/f07bb482e694a422591085621a38aff747294502))


- **(es/codegen)** Fix codegen of type-only imports ([#8070](https://github.com/swc-project/swc/issues/8070)) ([6f45b46](https://github.com/swc-project/swc/commit/6f45b4693e6d35bf05bacb89b65c7f013d0366a2))


- **(es/codegen)** Check for trailing comments while emitting an arrow ([#8257](https://github.com/swc-project/swc/issues/8257)) ([0faa2c4](https://github.com/swc-project/swc/commit/0faa2c4a013abf71b5689279b454f86586d21c93))


- **(es/codegen)** Fix codegen of type args of an import type and a type query ([#8296](https://github.com/swc-project/swc/issues/8296)) ([369fb21](https://github.com/swc-project/swc/commit/369fb21e220a26ac1cbfe64846f759ac576d2c6e))


- **(es/codegen)** Fix `get_ascii_only_ident` ([#8287](https://github.com/swc-project/swc/issues/8287)) ([07c8935](https://github.com/swc-project/swc/commit/07c8935904122191b4dad141e6fe164298f46af9))


- **(es/codegen)** Fix panic due to `\\ud` ([#8346](https://github.com/swc-project/swc/issues/8346)) ([1891afa](https://github.com/swc-project/swc/commit/1891afa2ad27f183e56adcd288dd3a1ae0c5b367))


- **(es/codegen)** Wrap quote for length greater than one ([#8351](https://github.com/swc-project/swc/issues/8351)) ([2cdea3f](https://github.com/swc-project/swc/commit/2cdea3fbeaf4a2dac662a4d019982943c0a896ba))


- **(es/compat)** Transform curried function call with optional chaining ([#7313](https://github.com/swc-project/swc/issues/7313)) ([66b5b11](https://github.com/swc-project/swc/commit/66b5b110bf94259e0e0223224940bb8d0384e9b6))


- **(es/compat)** Fix `is_setter` in `parameters` pass ([#7348](https://github.com/swc-project/swc/issues/7348)) ([e0de83e](https://github.com/swc-project/swc/commit/e0de83e862f7de765ba804e8c31a16660d7186b5))


- **(es/compat)** Mark reserved function names private ([#7298](https://github.com/swc-project/swc/issues/7298)) ([dba78a0](https://github.com/swc-project/swc/commit/dba78a0031b97a4c152b506ae2072438cdba92b2))


- **(es/compat)** Fix destructuring handling of `block_scoping` ([#7425](https://github.com/swc-project/swc/issues/7425)) ([66d52ec](https://github.com/swc-project/swc/commit/66d52ec849f3ed2b33db0a3738f5692cb8fa2400))


- **(es/compat)** Fix stage 3 decorator pass ([#7392](https://github.com/swc-project/swc/issues/7392)) ([97d0f79](https://github.com/swc-project/swc/commit/97d0f79142ec8ac6d1795b5c56cc565ca9b0a085))


- **(es/compat)** Fix variable scoping of object rest pass. ([#7437](https://github.com/swc-project/swc/issues/7437)) ([f3d660f](https://github.com/swc-project/swc/commit/f3d660f972a9fef7ee0783125655c4873a5d43fe))


- **(es/compat)** Make stage 3 decorator pass use correct state for inner classes ([#7508](https://github.com/swc-project/swc/issues/7508)) ([cc4146c](https://github.com/swc-project/swc/commit/cc4146c9d3a21514031e46003170a3fdaac1987a))


- **(es/compat)** Fix handling of `this` of optional chaining pass ([#7527](https://github.com/swc-project/swc/issues/7527)) ([4644d00](https://github.com/swc-project/swc/commit/4644d005d2ca06ad002dc7c6ff6c4d19e1734970))


- **(es/compat)** Fix optional chaining ([#7530](https://github.com/swc-project/swc/issues/7530)) ([990e48e](https://github.com/swc-project/swc/commit/990e48e0e81c339b42b0bf33b62a6f7126b0e2e8))


- **(es/compat)** Visit arrow body from optional chaining pass ([#7549](https://github.com/swc-project/swc/issues/7549)) ([bc6e950](https://github.com/swc-project/swc/commit/bc6e95052eaf60d71c544c8a88c8440d7a2b437c))


- **(es/compat)** Visit transformed expression in optional chaining pass ([#7614](https://github.com/swc-project/swc/issues/7614)) ([c087c82](https://github.com/swc-project/swc/commit/c087c82aa3131ecafa2e42cdef6ecfba6c80b9b8))


- **(es/compat)** Visit children of `while` statement in the `generator` pass ([#7624](https://github.com/swc-project/swc/issues/7624)) ([d2ac2c1](https://github.com/swc-project/swc/commit/d2ac2c16a3d9067b3afa14ba6ae8745b553c6642))


- **(es/compat)** Fix loose mode of the `spread` pass ([#7608](https://github.com/swc-project/swc/issues/7608)) ([a7daa5b](https://github.com/swc-project/swc/commit/a7daa5b28e45c0b310850279433178bf75f0f5f0))


- **(es/compat)** Fix handling of private members in optional chaining pass ([#7610](https://github.com/swc-project/swc/issues/7610)) ([7ba7b6e](https://github.com/swc-project/swc/commit/7ba7b6ec1fd7170ef7a321a6bd4931984e1a08d4))


- **(es/compat)** Fix loose mode of the `spread` pass ([#7760](https://github.com/swc-project/swc/issues/7760)) ([b69ae8f](https://github.com/swc-project/swc/commit/b69ae8f433a1702e09a24c1c47b2fc312e8fb801))


- **(es/compat)** Revert #7610  ([#7813](https://github.com/swc-project/swc/issues/7813)) ([42dec55](https://github.com/swc-project/swc/commit/42dec557ed2e8fd829aba7847b354003cfea1b18))


- **(es/compat)** Remove wrong logic for object patterns in `object_rest` ([#7788](https://github.com/swc-project/swc/issues/7788)) ([3766a7c](https://github.com/swc-project/swc/commit/3766a7c776b63e159be3f11f5f931c5e5f968cdb))


- **(es/compat)** Apply transforms for explicit resource management ([#7881](https://github.com/swc-project/swc/issues/7881)) ([3180e68](https://github.com/swc-project/swc/commit/3180e68bf27fb95ff00bd24677ae7e96b3aa6c62))


- **(es/compat)** Make `SwitchCase` handler of `block-scoping` stateless ([#7888](https://github.com/swc-project/swc/issues/7888)) ([4b33d41](https://github.com/swc-project/swc/commit/4b33d41fabf841dfc31c6f44d94e4651239ab667))


- **(es/compat)** Visit assign expr in generator ([#7932](https://github.com/swc-project/swc/issues/7932)) ([97068e1](https://github.com/swc-project/swc/commit/97068e12d16803012a4859114702577def024a36))


- **(es/compat)** Handle single expression case in static block ([#7944](https://github.com/swc-project/swc/issues/7944)) ([a80aec4](https://github.com/swc-project/swc/commit/a80aec47efcff953d3408cf6910b66c2312f3006))


- **(es/compat)** Handle `PrivateName` in `logical_assignments` ([#7958](https://github.com/swc-project/swc/issues/7958)) ([28318f0](https://github.com/swc-project/swc/commit/28318f09ed358b2baa155141bc715c25f658a2eb))


- **(es/compat)** Handle nullish in fn expr scope ([#7980](https://github.com/swc-project/swc/issues/7980)) ([5050f58](https://github.com/swc-project/swc/commit/5050f5820a43b8de7a87511070405e189eaafb5f))


- **(es/compat)** Skip function scope in `block-scoped-fns` pass ([#7975](https://github.com/swc-project/swc/issues/7975)) ([d91a554](https://github.com/swc-project/swc/commit/d91a554033c8ce0ea2b2538b0e86abf5a81eac76))


- **(es/compat)** Use return statements for method and setter decorator ([#8017](https://github.com/swc-project/swc/issues/8017)) ([38bc710](https://github.com/swc-project/swc/commit/38bc71006ed6f46c0145e07acccce75f7be26553))


- **(es/compat)** Generate `OptCall` for `OptCall` for private fields ([#8031](https://github.com/swc-project/swc/issues/8031)) ([06b6eb9](https://github.com/swc-project/swc/commit/06b6eb999964c25a964b0105bd7a4f20b51300dd))


- **(es/compat)** Fix scoping of `explicit-resource-management` ([#8044](https://github.com/swc-project/swc/issues/8044)) ([96a7a4d](https://github.com/swc-project/swc/commit/96a7a4d045d08547fed75c79a7156f79262edfc2))


- **(es/compat)** Transform default-exported class decorators correctly ([#8050](https://github.com/swc-project/swc/issues/8050)) ([a751f1c](https://github.com/swc-project/swc/commit/a751f1cfaf415917ab2a5e5098d9ca32bffa907b))


- **(es/compat)** Use `async` and `await` correctly in `block-scoping` pass ([#8056](https://github.com/swc-project/swc/issues/8056)) ([8318ea8](https://github.com/swc-project/swc/commit/8318ea82c28d3cf55e701f6da2f3077efe8ca653))


- **(es/compat)** Handle `__proto__` edge case in `shorthand` pass ([#8077](https://github.com/swc-project/swc/issues/8077)) ([a912937](https://github.com/swc-project/swc/commit/a912937cea672ad4fbda057efc3a09283e3635fe))


- **(es/compat)** Handle export default decorator only if not empty ([#8099](https://github.com/swc-project/swc/issues/8099)) ([bf523f5](https://github.com/swc-project/swc/commit/bf523f53513311d6c7d4a94f9a36bedd42230c09))


- **(es/compat)** Don't add pure annotations to dummy spans ([#8172](https://github.com/swc-project/swc/issues/8172)) ([9ceb57b](https://github.com/swc-project/swc/commit/9ceb57b4c7b15e679031c08d4100bb2b6a0ce229))


- **(es/compat)** Make `block-scoping` pass rename exports correctly ([#8175](https://github.com/swc-project/swc/issues/8175)) ([b13bc32](https://github.com/swc-project/swc/commit/b13bc320274e773c9b0ef479e86194c4c6f1f6f8))


- **(es/compat)** Use dummy span for blocks in `parameters` ([#8202](https://github.com/swc-project/swc/issues/8202)) ([c1b255a](https://github.com/swc-project/swc/commit/c1b255a59c1e8d81371c9576ca0c4573f04e65da))


- **(es/compat)** Handle private names from class properties pass ([#8090](https://github.com/swc-project/swc/issues/8090)) ([83a5a0c](https://github.com/swc-project/swc/commit/83a5a0c612b7ca97529720f8a35117957d4cb9a6))


- **(es/decorators)** Fix a regression about class expressions ([#8102](https://github.com/swc-project/swc/issues/8102)) ([cb4361f](https://github.com/swc-project/swc/commit/cb4361f2931cf222edbb449db6fe2c261c4b735d))


- **(es/decorators)** Minimize class declarations transformation ([#8245](https://github.com/swc-project/swc/issues/8245)) ([6992d83](https://github.com/swc-project/swc/commit/6992d83d09a7ad4c18e1dbd8389e26cc13ce0f6c))


- **(es/decorators)** Resolve enum for `design:returntype` ([#8320](https://github.com/swc-project/swc/issues/8320)) ([91ef7c9](https://github.com/swc-project/swc/commit/91ef7c9415c0efed347d3faf20653749fb7a6b15))


- **(es/dep-graph)** Analyze import type children ([#7883](https://github.com/swc-project/swc/issues/7883)) ([057bd5f](https://github.com/swc-project/swc/commit/057bd5f3efe55077a5a8e7f627e80175c8af2bd0))


- **(es/fixer)** Don't change default decls to default expr exports ([#7585](https://github.com/swc-project/swc/issues/7585)) ([e272545](https://github.com/swc-project/swc/commit/e2725451aa507c18222c5f66cf0a5a049c92bd0b))


- **(es/fixer)** Wrap yield expression in await expression ([#8357](https://github.com/swc-project/swc/issues/8357)) ([ff719f0](https://github.com/swc-project/swc/commit/ff719f0cdd3cf79e7afa1c136243e6fa53c5abe3))


- **(es/helpers)** Remove unnecessary parameters in `helper_expr!` macro ([#7296](https://github.com/swc-project/swc/issues/7296)) ([38dfb91](https://github.com/swc-project/swc/commit/38dfb91ebc04eecab97ec023c79b183958fda227))


- **(es/helpers)** Add `src/*.mjs` entry back ([#7328](https://github.com/swc-project/swc/issues/7328)) ([84af855](https://github.com/swc-project/swc/commit/84af85563f91a9593e0eb319f46c49c1d4cf7895))


- **(es/helpers)** Override mistake in `_interop_require_wildcard` ([#8076](https://github.com/swc-project/swc/issues/8076)) ([1346528](https://github.com/swc-project/swc/commit/1346528477bd8c587f0ee0d5fa6969f397739ddb))


- **(es/minifier)** Fix a inliner bug related to `Script` ([#7288](https://github.com/swc-project/swc/issues/7288)) ([0aab90c](https://github.com/swc-project/swc/commit/0aab90c005b29b9fced96a04b84a49fe2298560e))


- **(es/minifier)** Fix remapping of vars upon inlining ([#7362](https://github.com/swc-project/swc/issues/7362)) ([1dced17](https://github.com/swc-project/swc/commit/1dced17998a625e30d4a8ef653aef9e2caa7627d))


- **(es/minifier)** Mark all function params as potential property mutation ([#7409](https://github.com/swc-project/swc/issues/7409)) ([5dbbbea](https://github.com/swc-project/swc/commit/5dbbbea2efb84e7f187859ba03fd548af92c613f))


- **(es/minifier)** Prevent inlining vars assigned outside current function scope ([#7414](https://github.com/swc-project/swc/issues/7414)) ([40d2bf7](https://github.com/swc-project/swc/commit/40d2bf7ec3ac58364a8389d2d2284c8089e74fae))


- **(es/minifier)** Don't generate generator arrows ([#7466](https://github.com/swc-project/swc/issues/7466)) ([e506635](https://github.com/swc-project/swc/commit/e506635f74e38cb7eb88a2fa540d8c4f71c7323a))


- **(es/minifier)** Infect mutation when assigning a property ([#7503](https://github.com/swc-project/swc/issues/7503)) ([7f9f0b8](https://github.com/swc-project/swc/commit/7f9f0b8bcebc26eed1354ce2901aabd61261f434))


- **(es/minifier)** Don't drop assignments to unused top-level variables ([#7581](https://github.com/swc-project/swc/issues/7581)) ([a685c88](https://github.com/swc-project/swc/commit/a685c88c61248e5bff98fb339a71b40b8fd4e528))


- **(es/minifier)** Add usage to inlined ident eagerly ([#7597](https://github.com/swc-project/swc/issues/7597)) ([4f866de](https://github.com/swc-project/swc/commit/4f866de8788558a4f9f3e3f889048136c7896ee3))


- **(es/minifier)** Don't drop unused properties of top-level vars ([#7638](https://github.com/swc-project/swc/issues/7638)) ([19ba714](https://github.com/swc-project/swc/commit/19ba714ea11d6e733cd46ed3ce6b851ddc972e5a))


- **(es/minifier)** Fix a bug about `eval` of name mangler ([#7615](https://github.com/swc-project/swc/issues/7615)) ([6be1f70](https://github.com/swc-project/swc/commit/6be1f7075d8d14cc56b05079ee134153ab65c6fc))


- **(es/minifier)** Do not reuse identifier used for import bindings ([#7639](https://github.com/swc-project/swc/issues/7639)) ([a65be14](https://github.com/swc-project/swc/commit/a65be14a00f41e9b0b4439c31b49febeefd1f845))


- **(es/minifier)** Only cast global `Infinity`/`undefined`/`NaN` ([#7684](https://github.com/swc-project/swc/issues/7684)) ([241c04a](https://github.com/swc-project/swc/commit/241c04ab4a2e7e7f34563fdc8a355f82c6ba03e8))


- **(es/minifier)** Drop line comments starting with `!` ([#7689](https://github.com/swc-project/swc/issues/7689)) ([951138c](https://github.com/swc-project/swc/commit/951138cd13339ca7b5cb5305203e466fcd4a0b0e))


- **(es/minifier)** Abort seq inliner using visitor ([#7699](https://github.com/swc-project/swc/issues/7699)) ([a26dbce](https://github.com/swc-project/swc/commit/a26dbce9817c8f39c7d5857bb258298da274c6f3))


- **(es/minifier)** Do not drop used properties ([#7702](https://github.com/swc-project/swc/issues/7702)) ([f901b41](https://github.com/swc-project/swc/commit/f901b417d1a37f679ff4c5a54e81671684d9f485))


- **(es/minifier)** Handle synthesized export default expression ([#7707](https://github.com/swc-project/swc/issues/7707)) ([5ea6f27](https://github.com/swc-project/swc/commit/5ea6f27eb07df768c6fab2bdff744e402480c53f))


- **(es/minifier)** Mark args of `new`s as references ([#7743](https://github.com/swc-project/swc/issues/7743)) ([3873f58](https://github.com/swc-project/swc/commit/3873f5849999e49b732fef9959cb12ce6159c078))


- **(es/minifier)** Abort on `Array.slice` with `start >= end` ([#7745](https://github.com/swc-project/swc/issues/7745)) ([36ccbec](https://github.com/swc-project/swc/commit/36ccbec06130a55bc0707a0096a56558a77a1ceb))


- **(es/minifier)** Abort seq inliner if a same var is defined in outer scope ([#7772](https://github.com/swc-project/swc/issues/7772)) ([ef8d121](https://github.com/swc-project/swc/commit/ef8d12154ddaad47eddb41298bae14460834be0c))


- **(es/minifier)** Do not drop properties used via `this` ([#7785](https://github.com/swc-project/swc/issues/7785)) ([552d9aa](https://github.com/swc-project/swc/commit/552d9aa344cb6db2dff1e20011411a56f92d4f06))


- **(es/minifier)** Preserve `cooked` while compressing template literals ([#7773](https://github.com/swc-project/swc/issues/7773)) ([05990a9](https://github.com/swc-project/swc/commit/05990a98fd3f06a3c03bd1e795800acf22f16035))


- **(es/minifier)** Abort seq inliner if var is not fn_local or reassigned ([#7804](https://github.com/swc-project/swc/issues/7804)) ([f8ca366](https://github.com/swc-project/swc/commit/f8ca366cc179d2d83d35148c3600b8faa2e7f801))


- **(es/minifier)** Preserve more analysis data upon inlining ([#7823](https://github.com/swc-project/swc/issues/7823)) ([31de19e](https://github.com/swc-project/swc/commit/31de19ece22663623b1fc1fe48c90b7aa41e41e0))


- **(es/minifier)** Don't inline properties if the var is not `fn-local` ([#7839](https://github.com/swc-project/swc/issues/7839)) ([7fe01e6](https://github.com/swc-project/swc/commit/7fe01e64dd9917d375a4f1cf9661ffaca822c5b3))


- **(es/minifier)** Don't remove exports ([#7856](https://github.com/swc-project/swc/issues/7856)) ([ae8cd94](https://github.com/swc-project/swc/commit/ae8cd9430dd1ec0d857ac7f87ffa4b76258be92c))


- **(es/minifier)** Report `is_fn_local` even if var is hoisted ([#7876](https://github.com/swc-project/swc/issues/7876)) ([87a47bf](https://github.com/swc-project/swc/commit/87a47bfb2c602f2ce7eb33f78612197e290518b8))


- **(es/minifier)** Parse a file as a module only if `opts.module` is `true` ([#7943](https://github.com/swc-project/swc/issues/7943)) ([b87ac64](https://github.com/swc-project/swc/commit/b87ac646f81f181b574da798b3e613a3cfa4cad5))


- **(es/minifier)** Handle `ModuleDecl` when transform const modules ([#7959](https://github.com/swc-project/swc/issues/7959)) ([06ca1fe](https://github.com/swc-project/swc/commit/06ca1fe0a03954883750c3c39d0163fc29596ad1))


- **(es/minifier)** Do not inline into a template literal with sequential inliner ([#7971](https://github.com/swc-project/swc/issues/7971)) ([b3d3a7b](https://github.com/swc-project/swc/commit/b3d3a7bc7339776e57ca402e77cf3fb22c774784))


- **(es/minifier)** Check if object shorthand is skippable for seq inliner ([#8036](https://github.com/swc-project/swc/issues/8036)) ([01391e3](https://github.com/swc-project/swc/commit/01391e3c13e42b7f42f80ab13b396cad182942ff))


- **(es/minifier)** Don't inline functions if `keep_fnames` is enabled ([#8093](https://github.com/swc-project/swc/issues/8093)) ([94bb42e](https://github.com/swc-project/swc/commit/94bb42e29418a8697ba0ab41dad2ffe63f1c32c7))


- **(es/minifier)** Abort seq inliner if `b` can short-circuit ([#8128](https://github.com/swc-project/swc/issues/8128)) ([111de26](https://github.com/swc-project/swc/commit/111de264b0ec04ec7a693b0006050df21513b583))


- **(es/minifier)** Abort function inliner if `keep_fnames` is `true` ([#8145](https://github.com/swc-project/swc/issues/8145)) ([35601e4](https://github.com/swc-project/swc/commit/35601e4dcb7bb65e16d217c50d6065958cbd8e6d))


- **(es/minifier)** Always consider `reassigned` when inlining ([#8168](https://github.com/swc-project/swc/issues/8168)) ([c26a225](https://github.com/swc-project/swc/commit/c26a2252b6cfbc659fdd935a7282cec27bcb527b))


- **(es/minifier)** Use `cooked` while converting tpls into strings ([#8248](https://github.com/swc-project/swc/issues/8248)) ([be748f0](https://github.com/swc-project/swc/commit/be748f0f33bda76a1ae4a4acd586213adfe7b2aa))


- **(es/minifier)** Enable seq inliner for const declarations ([#8255](https://github.com/swc-project/swc/issues/8255)) ([ebcd825](https://github.com/swc-project/swc/commit/ebcd8252253d2b5169ea03ec19ee4a76d3ca22c3))


- **(es/minifier)** Keep class with a static block ([#8283](https://github.com/swc-project/swc/issues/8283)) ([20fb5ba](https://github.com/swc-project/swc/commit/20fb5bab32a1e428af5e9e2203d3982d3a7ddcf3))


- **(es/minifier)** Respect `pure_funcs` for tagged tpls ([#8280](https://github.com/swc-project/swc/issues/8280)) ([1ccfc07](https://github.com/swc-project/swc/commit/1ccfc0762cdc2895d013e7730eda24d81ce53501))


- **(es/minifier)** Make `Finalizer` inline literals ([#8285](https://github.com/swc-project/swc/issues/8285)) ([73fec94](https://github.com/swc-project/swc/commit/73fec945b5b64845308ab03bea639b53e4ff021e))


- **(es/minifier)** Remove hack for built-in class names ([#8293](https://github.com/swc-project/swc/issues/8293)) ([7985e02](https://github.com/swc-project/swc/commit/7985e02fc8cf519572650ad026dba649af48d7a5))


- **(es/minifier)** Apply new `SyntaxContext` to inlined `Arrow` ([#8301](https://github.com/swc-project/swc/issues/8301)) ([c18a959](https://github.com/swc-project/swc/commit/c18a959e3a53c52c05672297a39f6eb628a076a0))


- **(es/minifier)** Apply new `SyntaxContext` to inlined `Arrow` correctly ([#8312](https://github.com/swc-project/swc/issues/8312)) ([572ad63](https://github.com/swc-project/swc/commit/572ad63e0825e4eddb511933d1a6d57184fc03c2))


- **(es/minifier)** Fix `if_return` bug related to `await` and `yield` ([#8328](https://github.com/swc-project/swc/issues/8328)) ([01e2c7f](https://github.com/swc-project/swc/commit/01e2c7fc5ab71d55c522e48eae9e3e08d8bf418d))


- **(es/minifier)** Give up terminate merge if in `try` with `finally` ([#8342](https://github.com/swc-project/swc/issues/8342)) ([ed5a9b3](https://github.com/swc-project/swc/commit/ed5a9b3f2e5b7035f657a8ea3cb38a27413369b2))


- **(es/module)** Add `"use strict"` while preserving directives ([#7537](https://github.com/swc-project/swc/issues/7537)) ([f42fdd2](https://github.com/swc-project/swc/commit/f42fdd21afad775358138c3aaed4ff3c41bfb16a))


- **(es/module)** Skip CJS and AMD transformations for `Script` ([#7661](https://github.com/swc-project/swc/issues/7661)) ([a2d0408](https://github.com/swc-project/swc/commit/a2d040859790d10d445ba6b06e9fe88635d84c1b))


- **(es/module)** Do not determine module name for modules without exports in UMD ([#7718](https://github.com/swc-project/swc/issues/7718)) ([40136f7](https://github.com/swc-project/swc/commit/40136f7c54bdc347d5f725549a27e1104433ff36))


- **(es/module)** Fix handling of continuous assignments in `systemjs` ([#7741](https://github.com/swc-project/swc/issues/7741)) ([f713f6a](https://github.com/swc-project/swc/commit/f713f6aba84ffe84bed9dff80a772b0cd78135b8))


- **(es/module)** Use `jsc.baseUrl` while resolving absolute paths ([#7775](https://github.com/swc-project/swc/issues/7775)) ([5c4bfa6](https://github.com/swc-project/swc/commit/5c4bfa61f9e4f7732bc1a9da6cd25f52e593a374))


- **(es/module)** Make `jsc.paths` work for a nest.js app ([#7852](https://github.com/swc-project/swc/issues/7852)) ([d33a973](https://github.com/swc-project/swc/commit/d33a97303ceeee4069321ef21027ff99fe973a79))


- **(es/module)** Fix logic for exact matches in `jsc.paths` ([#7860](https://github.com/swc-project/swc/issues/7860)) ([52a1ee7](https://github.com/swc-project/swc/commit/52a1ee78da87da760f9923cd8cdb420da855417f))


- **(es/module)** Don't resolve as `node_modules` from `TscResolver` ([#7866](https://github.com/swc-project/swc/issues/7866)) ([11ebae1](https://github.com/swc-project/swc/commit/11ebae1bdd2fbd05d908fa560b81b830dddb3c56))


- **(es/module)** Don't create absolute paths for `jsc.paths` on Windows ([#7892](https://github.com/swc-project/swc/issues/7892)) ([5fbc251](https://github.com/swc-project/swc/commit/5fbc251db1cc1f7973ba780a6c4fc1cdce5ef40d))


- **(es/module)** Make `jsc.paths` fully resolve TypeScript files ([#7901](https://github.com/swc-project/swc/issues/7901)) ([c714dd2](https://github.com/swc-project/swc/commit/c714dd20dedfab60ac75de613d13c0f3af60a6c7))


- **(es/module)** Revert #7901 ([#7906](https://github.com/swc-project/swc/issues/7906)) ([85d6e9b](https://github.com/swc-project/swc/commit/85d6e9be07af7bb788594b21a986636657d86f03))


- **(es/module)** Fix `jsc.paths` for projects using pnpm ([#7918](https://github.com/swc-project/swc/issues/7918)) ([a86e9f3](https://github.com/swc-project/swc/commit/a86e9f3bb5bd490ebf0b18fe7349a2b0fbc0c45f))


- **(es/module)** Preserve import specifier if resolving fails ([#7955](https://github.com/swc-project/swc/issues/7955)) ([be5b02a](https://github.com/swc-project/swc/commit/be5b02a8cfe2a2c1c399a4f9404b8fd097084234))


- **(es/module)** Sort the exported ESM bindings ([#8024](https://github.com/swc-project/swc/issues/8024)) ([990ca06](https://github.com/swc-project/swc/commit/990ca06aca3242a789e165f4318c95d0bb64b02e))


- **(es/module)** Handle directives ([#8048](https://github.com/swc-project/swc/issues/8048)) ([4d8e101](https://github.com/swc-project/swc/commit/4d8e1013bb7775f60d463276cc3233ecd7849b31))


- **(es/module)** Read link if an import is resolved as symlink ([#8297](https://github.com/swc-project/swc/issues/8297)) ([7dfdc12](https://github.com/swc-project/swc/commit/7dfdc1221890d373d2e6caf52bc8dee8c20765ca))


- **(es/modules)** Support `jsc.baseUrl` without `jsc.paths` ([#7302](https://github.com/swc-project/swc/issues/7302)) ([9c279b8](https://github.com/swc-project/swc/commit/9c279b802b6a615fdba33a6f81866ce3ef606676))


- **(es/parser)** Fix handling of `in` and `out` of typescript ([#7308](https://github.com/swc-project/swc/issues/7308)) ([6f81cb9](https://github.com/swc-project/swc/commit/6f81cb9c32219cd8e51a97c924e0b272fc25a0c1))


- **(es/parser)** Parse decorators after `export` ([#7340](https://github.com/swc-project/swc/issues/7340)) ([985f0ca](https://github.com/swc-project/swc/commit/985f0cad06b9de5f9e98bed3ad62769e0f3c7528))


- **(es/parser)** Fix `>=` with type instantiate ([#7388](https://github.com/swc-project/swc/issues/7388)) ([fa7a352](https://github.com/swc-project/swc/commit/fa7a3521f531caa32439fa6f4c338a2a7d859e05))


- **(es/parser)** Fix parsing of `module` identifier ([#7400](https://github.com/swc-project/swc/issues/7400)) ([1d3f320](https://github.com/swc-project/swc/commit/1d3f32056c7a63b327b2ccf6131479f851a2e870))


- **(es/parser)** Fix parsing of `>` in typescript mode ([#7407](https://github.com/swc-project/swc/issues/7407)) ([57ad722](https://github.com/swc-project/swc/commit/57ad722d06084671ef18f4eb1dae53afbb737c3d))


- **(es/parser)** Reset class context ([#7433](https://github.com/swc-project/swc/issues/7433)) ([1cab43f](https://github.com/swc-project/swc/commit/1cab43f17deb35ef7e9a4b2c229327edc0f87756))


- **(es/parser)** Allow using `package` as a parameter name in interface ([#7438](https://github.com/swc-project/swc/issues/7438)) ([33a922b](https://github.com/swc-project/swc/commit/33a922b6f8c8362b46fe8547e9d327a4d82520a4))


- **(es/parser)** Fix parsing of tsx with a type annotation in a conditional expression ([#7440](https://github.com/swc-project/swc/issues/7440)) ([a37d59a](https://github.com/swc-project/swc/commit/a37d59a134b2a046b50bb5e70c694130227e0d9e))


- **(es/parser)** Fix parsing of generic jsx element name ([#7449](https://github.com/swc-project/swc/issues/7449)) ([77850dd](https://github.com/swc-project/swc/commit/77850dd8f01f51af1e9dda3eabddd07b7e39c841))


- **(es/parser)** Adjust context while parsing type arguments of TypeScript type queries ([#7582](https://github.com/swc-project/swc/issues/7582)) ([9d5dda1](https://github.com/swc-project/swc/commit/9d5dda12991dac031064b139eb61d2d03dcd8571))


- **(es/parser)** Re-lex `<<` as two `<`-s if required ([#7439](https://github.com/swc-project/swc/issues/7439)) ([6850372](https://github.com/swc-project/swc/commit/68503726a78cfc37cd995eda69a3e8982b6fdf57))


- **(es/parser)** Revert lexer fix for `<<` ([#7807](https://github.com/swc-project/swc/issues/7807)) ([e527c12](https://github.com/swc-project/swc/commit/e527c12a82740397ed4e909f242326f8e92624a8))


- **(es/parser)** Fix parsing of `await using` ([#8101](https://github.com/swc-project/swc/issues/8101)) ([e1043fa](https://github.com/swc-project/swc/commit/e1043fae77ca9e33b2d65ce6edc9559917a895ec))


- **(es/parser)** Skip `this` parameters in setter ([#8158](https://github.com/swc-project/swc/issues/8158)) ([826386f](https://github.com/swc-project/swc/commit/826386f49a1226ff3f7d352a75ccdc65c982b4be))


- **(es/parser)** Consider ASI while parsing TypeScript type aliases ([#8263](https://github.com/swc-project/swc/issues/8263)) ([e589126](https://github.com/swc-project/swc/commit/e58912622d86f2b03f90dd7d0782e5740822dca6))


- **(es/parser)** Adjust the context for cond expr while parsing JSX ([#8261](https://github.com/swc-project/swc/issues/8261)) ([0678c3c](https://github.com/swc-project/swc/commit/0678c3c55fa65780caf15e55919276912348943b))


- **(es/parser)** Fix ASI hazard of `static` ([#8262](https://github.com/swc-project/swc/issues/8262)) ([c128153](https://github.com/swc-project/swc/commit/c1281534b65d1d7f0069c04d35c1eb29f08e9a14))


- **(es/parser)** Fix parsing of `import type from from` ([#8309](https://github.com/swc-project/swc/issues/8309)) ([00b8839](https://github.com/swc-project/swc/commit/00b88399a0ea10dfd6d48cb168dd5ae914f11d54))


- **(es/parser)** Report error for exported reserved name ([#8313](https://github.com/swc-project/swc/issues/8313)) ([feb8a6d](https://github.com/swc-project/swc/commit/feb8a6dad99bf55cf541bd88a8f21b865c6bcd97))


- **(es/parser)** Wrap with `OptChain` across `TsNonNull` ([#8332](https://github.com/swc-project/swc/issues/8332)) ([8af6ffb](https://github.com/swc-project/swc/commit/8af6ffb1ddaf60b997163aaf80abfb528eb2ca9c))


- **(es/parser)** Fix conditional compilation ([#8343](https://github.com/swc-project/swc/issues/8343)) ([a423681](https://github.com/swc-project/swc/commit/a423681df897956e58650b3acc9f2331887e42e8))


- **(es/parsing)** Fix parsing of `type satisfies = 0;` ([#8305](https://github.com/swc-project/swc/issues/8305)) ([51042e0](https://github.com/swc-project/swc/commit/51042e090de246bcf92300e5ffd03139f255e77b))


- **(es/preset-env)** Fix pass ordering ([#7434](https://github.com/swc-project/swc/issues/7434)) ([2071f89](https://github.com/swc-project/swc/commit/2071f89d4eea7ae311b05457650e2f42c1b503ef))


- **(es/preset-env)** Don't log `Yield` to the console ([#7548](https://github.com/swc-project/swc/issues/7548)) ([8cfc4f9](https://github.com/swc-project/swc/commit/8cfc4f9e9ab43a5ed25c9b600b9dd7e5790c2d1e))


- **(es/proposal)** Improve resolving of `design:returntype` ([#8303](https://github.com/swc-project/swc/issues/8303)) ([fab51e1](https://github.com/swc-project/swc/commit/fab51e18433d85f29d720ef11371411fa4ecf623))


- **(es/react)** Default to empty string when emitting refresh signature ([#7514](https://github.com/swc-project/swc/issues/7514)) ([8e933c8](https://github.com/swc-project/swc/commit/8e933c8a9fdf8867deb7f0d108b99430949aad54))


- **(es/react)** Visit children nodes in `jsx-src` pass ([#8212](https://github.com/swc-project/swc/issues/8212)) ([47733a9](https://github.com/swc-project/swc/commit/47733a951c14bc22c2a60acb420b597ddab7d306))


- **(es/react)** Make jsx with single spread child static ([#8339](https://github.com/swc-project/swc/issues/8339)) ([58568fa](https://github.com/swc-project/swc/commit/58568fa23be932ed8f3858c24962973bdc4b8057))


- **(es/renamer)** Allow `globalThis` to be shadowed ([#8327](https://github.com/swc-project/swc/issues/8327)) ([3dd73a3](https://github.com/swc-project/swc/commit/3dd73a3cd8fddd9e19dc85c2a2bf785b585b5b9a))


- **(es/resolver)** Hoist parameter in arrow and constructor ([#7292](https://github.com/swc-project/swc/issues/7292)) ([7a00f2e](https://github.com/swc-project/swc/commit/7a00f2e95412b7dcbe9ce3b32d8b299104b2f5c5))


- **(es/resolver)** Resolve the super class before registering a class name ([#7550](https://github.com/swc-project/swc/issues/7550)) ([1d9f972](https://github.com/swc-project/swc/commit/1d9f972fb44e0722fce8a83090cbada81decf577))


- **(es/resolver)** Correctly resolve global value ([#7893](https://github.com/swc-project/swc/issues/7893)) ([2db10e9](https://github.com/swc-project/swc/commit/2db10e9fd1913b69cb088aaded2d587872e9f2bb))


- **(es/resolver)** Ignore qualifiers of `TsImportType` ([#8299](https://github.com/swc-project/swc/issues/8299)) ([2113bb3](https://github.com/swc-project/swc/commit/2113bb3e19131d68eb2a1c384e4ac58b2bc10f00))


- **(es/transforms)** Do not add `PURE` comment to `BytePos(0)` ([#8207](https://github.com/swc-project/swc/issues/8207)) ([c061356](https://github.com/swc-project/swc/commit/c061356b63431fcd0323e434402ead143c622340))


- **(es/typescript)** Fix typescript strip pass ([#7342](https://github.com/swc-project/swc/issues/7342)) ([d061d29](https://github.com/swc-project/swc/commit/d061d295ff2ca6ebb03d9c62c367f42f7186c2d7))


- **(es/typescript)** Don't panic of `@jsxFrag null` ([#7540](https://github.com/swc-project/swc/issues/7540)) ([76aa91f](https://github.com/swc-project/swc/commit/76aa91f83cf37a11aa55feba40d6f73819fc811d))


- **(es/typescript)** Fix handling of optional chaining ([#7660](https://github.com/swc-project/swc/issues/7660)) ([c017874](https://github.com/swc-project/swc/commit/c01787408522202f3c717c0ecfa8e00aedef9142))


- **(es/typescript)** Handle `DeclareCollect` correctly ([#8008](https://github.com/swc-project/swc/issues/8008)) ([9d08b8a](https://github.com/swc-project/swc/commit/9d08b8a6145d486e570a22563c62a69722cf8759))


- **(es/typescript)** Handle qualified access in assign pat ([#8012](https://github.com/swc-project/swc/issues/8012)) ([2f01aba](https://github.com/swc-project/swc/commit/2f01aba978415add87994f9b20e3e2db83fc48b6))


- **(es/typescript)** Rename wrong `unresolved_mark` ([#8018](https://github.com/swc-project/swc/issues/8018)) ([5817268](https://github.com/swc-project/swc/commit/58172689ce7f8dd2f0a79d8771c52fe309880b44))


- **(es/typescript)** Preserve default value of an exported binding in a namespace ([#8029](https://github.com/swc-project/swc/issues/8029)) ([cf96171](https://github.com/swc-project/swc/commit/cf96171a53589118a0103495169e02fed10a675f))


- **(es/typescript)** Support `ts_enum_is_mutable` with const enums ([#8171](https://github.com/swc-project/swc/issues/8171)) ([02d0613](https://github.com/swc-project/swc/commit/02d0613a35a3875ad3b0c0b008cf063bd162bc07))


- **(es/typescript)** Preserve const enum for named export ([#8208](https://github.com/swc-project/swc/issues/8208)) ([abced23](https://github.com/swc-project/swc/commit/abced23b2a16e9602ffe59a20e6cbf65a882a3ce))


- **(es/typescript)** Handle shebang with jsx pragma ([#8318](https://github.com/swc-project/swc/issues/8318)) ([c25601d](https://github.com/swc-project/swc/commit/c25601dec21d7293ad48549a1f49ccd161f9da72))


- **(es/utils)** Fix string evaluation of array literals ([#7731](https://github.com/swc-project/swc/issues/7731)) ([e8c58cf](https://github.com/swc-project/swc/commit/e8c58cfd779f7c9dcfae06200ec2f726fbc74758))


- **(es/utils)** Ignore `typeof Id` while preserving side effects ([#7763](https://github.com/swc-project/swc/issues/7763)) ([d57ac0d](https://github.com/swc-project/swc/commit/d57ac0dd28cdefef63a18d53565154e65ee8b838))


- **(es/utils)** Skip var declarator name in `RefRewriter` ([#8125](https://github.com/swc-project/swc/issues/8125)) ([fb81a36](https://github.com/swc-project/swc/commit/fb81a36adcebdc269ae89677977220e9b21b072f))


- **(es/utils)** Fix regression of `RefRewriter` ([#8153](https://github.com/swc-project/swc/issues/8153)) ([08cf1f7](https://github.com/swc-project/swc/commit/08cf1f786d0a0fbe4029614306ba2ebaf0a9c919))


- **(estree/compat)** Adjust `loc.col` ([#7565](https://github.com/swc-project/swc/issues/7565)) ([d86f8f6](https://github.com/swc-project/swc/commit/d86f8f6a3c1f6ad5de3078ade5c8a905f7067f24))


- **(plugin/runner)** Revert #7341 ([#7344](https://github.com/swc-project/swc/issues/7344)) ([d6999ba](https://github.com/swc-project/swc/commit/d6999ba1ac454a1617bab00c740d99f81ff1a18d))


- **(plugin/runner)** Disable `wasi_env` cleanup ([#7458](https://github.com/swc-project/swc/issues/7458)) ([1868d36](https://github.com/swc-project/swc/commit/1868d36cfed54e48c3439ec4547251e45731c93a))


- **(plugin/runner)** Disable wasi env cleanup ([#7607](https://github.com/swc-project/swc/issues/7607)) ([8209594](https://github.com/swc-project/swc/commit/8209594a8c11d2a65061763fef5d3a7780976f39))


- **(plugin/runner)** Use fs cache properly ([#7748](https://github.com/swc-project/swc/issues/7748)) ([1122de7](https://github.com/swc-project/swc/commit/1122de7d8b3c178b4e315bb50a6e214669c37a4f))


- **(swc-info)** Use correct path while getting local package versions ([#7872](https://github.com/swc-project/swc/issues/7872)) ([67afaf1](https://github.com/swc-project/swc/commit/67afaf1f2db087518ac990c71de896c8e5e2a051))


- **(swc_core)** Correctly expose plugin with host ([#7427](https://github.com/swc-project/swc/issues/7427)) ([558ca40](https://github.com/swc-project/swc/commit/558ca40b99bd3e9ac9a1742223dd9d3ef84061cb))


- **(testing)** Fix path normalization on windows for testing diffs ([#7299](https://github.com/swc-project/swc/issues/7299)) ([3422923](https://github.com/swc-project/swc/commit/3422923cb004111f8c57501bb8b222905cf6bd09))


- **(xml/codegen)** Escape `<` and `>` in child ([#7351](https://github.com/swc-project/swc/issues/7351)) ([b180d09](https://github.com/swc-project/swc/commit/b180d09e1dd9c4269d7d690d892ef4fd1c5b6563))


- **(xml/codegen)** Fix wrong minification of spaces in a self-closing tag ([#7595](https://github.com/swc-project/swc/issues/7595)) ([769d651](https://github.com/swc-project/swc/commit/769d6516a50796e6642d6724e8472dd32d871612))


- **(xtask)** Fix nightly command ([#8105](https://github.com/swc-project/swc/issues/8105)) ([db4ca65](https://github.com/swc-project/swc/commit/db4ca650e445e602f289f7964b24f7e2647beacd))

### Documentation



- **(counter)** Document the purpose of the package ([#8032](https://github.com/swc-project/swc/issues/8032)) ([b6b5a4d](https://github.com/swc-project/swc/commit/b6b5a4d3a6f1c6c74d47c855081a8fee17066829))

### Features



- **(bindings)** Create a minifier-only package ([#7993](https://github.com/swc-project/swc/issues/7993)) ([64d8f4b](https://github.com/swc-project/swc/commit/64d8f4b59f81c71bffbb906595bafa356f326924))


- **(common)** Enable bytecheck for missing structs ([#7465](https://github.com/swc-project/swc/issues/7465)) ([56ac9eb](https://github.com/swc-project/swc/commit/56ac9eb6b3c8cc379ee4ccf55d6130e39aa641b8))


- **(css/ast)** Support `@scope` at-rule ([#7837](https://github.com/swc-project/swc/issues/7837)) ([a34f359](https://github.com/swc-project/swc/commit/a34f3592b3fd2731b63a5c58c5022e12a403850b))


- **(css/parser)** Support `@starting-style` ([#7677](https://github.com/swc-project/swc/issues/7677)) ([cfb7b51](https://github.com/swc-project/swc/commit/cfb7b511eebe068b3c57f4540b90cb59c922d7e9))


- **(css/parser)** Store lexed comments ([#8091](https://github.com/swc-project/swc/issues/8091)) ([d1097cc](https://github.com/swc-project/swc/commit/d1097ccb599c4343e3f80ca9bd793bbfce424e8b))


- **(es)** Add a validation for a wrong config ([#7704](https://github.com/swc-project/swc/issues/7704)) ([900701f](https://github.com/swc-project/swc/commit/900701fbf24912dce219f97baa8c11c533966896))


- **(es)** Alias `format` as `output` for `minify()` ([#7746](https://github.com/swc-project/swc/issues/7746)) ([28dfc51](https://github.com/swc-project/swc/commit/28dfc518879b9125a382b48e8310895e137d4fd4))


- **(es)** Add an option to disable builtin transforms ([#7873](https://github.com/swc-project/swc/issues/7873)) ([71d01ec](https://github.com/swc-project/swc/commit/71d01ec12772c2854a47947deceb6d1cab141289))


- **(es/ast)** Expose `Archived` types ([#7811](https://github.com/swc-project/swc/issues/7811)) ([478fa47](https://github.com/swc-project/swc/commit/478fa4736f355555c7a19e7b674db5d7bd81c0e2))


- **(es/ast)** Support import attributes proposal ([#7868](https://github.com/swc-project/swc/issues/7868)) ([4d3fcb8](https://github.com/swc-project/swc/commit/4d3fcb86e4843cf323a471537cc1ab3a26d054b1))


- **(es/codegen)** Add ability to set indentation string via rust api ([#7494](https://github.com/swc-project/swc/issues/7494)) ([a343e7c](https://github.com/swc-project/swc/commit/a343e7ccae4e88d9e3941beedf63b61bd0512c3d))


- **(es/codegen)** Support `preamble` ([#7551](https://github.com/swc-project/swc/issues/7551)) ([6e5d8b3](https://github.com/swc-project/swc/commit/6e5d8b3cf1af74d614d5c073d966da543c26e302))


- **(es/codegen)** Add an option to print `assert` for import attributes ([#7914](https://github.com/swc-project/swc/issues/7914)) ([ee75756](https://github.com/swc-project/swc/commit/ee7575695de6dad140457ffb8bb8f0ac80c4dcdc))


- **(es/codegen)** Respect `ascii_only: false` for `StrLit` ([#8217](https://github.com/swc-project/swc/issues/8217)) ([1a26be2](https://github.com/swc-project/swc/commit/1a26be2a271437894b1cda86c4707014e684b5ba))


- **(es/compat)** Support `export class` from stage 3 decorator pass ([#7363](https://github.com/swc-project/swc/issues/7363)) ([9c052db](https://github.com/swc-project/swc/commit/9c052db796473a4a7253d643426a7c2c765d9640))


- **(es/compat)** Partially support auto accessors ([#7364](https://github.com/swc-project/swc/issues/7364)) ([97ec259](https://github.com/swc-project/swc/commit/97ec25914451d931918287591d8d3f08648a65b9))


- **(es/compat)** Implement auto accessors fully ([#7370](https://github.com/swc-project/swc/issues/7370)) ([cad18fa](https://github.com/swc-project/swc/commit/cad18fae4b93a916ad2c45b8741e08baeea78b98))


- **(es/compat)** Implement transform for explicit resource management ([#7376](https://github.com/swc-project/swc/issues/7376)) ([bcd5a1d](https://github.com/swc-project/swc/commit/bcd5a1d6665bc6f4aaa857d1f88b0da82a6c4a04))


- **(es/compat)** Support `pure_getters` for `optional_chaining` ([#7933](https://github.com/swc-project/swc/issues/7933)) ([c091c5e](https://github.com/swc-project/swc/commit/c091c5e295ec2ef704be1461f6587ae85051b543))


- **(es/compat)** Implement decorator metadata proposal ([#8097](https://github.com/swc-project/swc/issues/8097)) ([9c029ef](https://github.com/swc-project/swc/commit/9c029ef095f83783a3581dfcc165dd197308f538))


- **(es/compat)** Skip empty class static blocks ([#8138](https://github.com/swc-project/swc/issues/8138)) ([e186b80](https://github.com/swc-project/swc/commit/e186b80ddcc0c95f276e845cc491b276d0fb15ee))


- **(es/config)** Accept `jsc.experimental.keepImportAssertions` ([#7995](https://github.com/swc-project/swc/issues/7995)) ([4d777ee](https://github.com/swc-project/swc/commit/4d777ee270183ba375b68c003e61692af6d571c3))


- **(es/minifier)** Drop expressions using sequential inliner ([#6936](https://github.com/swc-project/swc/issues/6936)) ([246300a](https://github.com/swc-project/swc/commit/246300ae25be0cfdbbb266e02f80d06013a96d85))


- **(es/minifier)** Inline for loop variables ([#7445](https://github.com/swc-project/swc/issues/7445)) ([0cd2b61](https://github.com/swc-project/swc/commit/0cd2b61b054031f1a49cae25a82925d52dff0a73))


- **(es/minifier)** Remove unused labels ([#7478](https://github.com/swc-project/swc/issues/7478)) ([62075fa](https://github.com/swc-project/swc/commit/62075faeaada8d9df3c7d849bbcfda8ff0c5d79f))


- **(es/minifier)** Support `__NO_SIDE_EFFECTS__` ([#7532](https://github.com/swc-project/swc/issues/7532)) ([3ad07a7](https://github.com/swc-project/swc/commit/3ad07a7d2e5c9507a786dc338f0cf50191916aa3))


- **(es/minifier)** Enable `hoist_props` by default ([#7535](https://github.com/swc-project/swc/issues/7535)) ([07a8580](https://github.com/swc-project/swc/commit/07a858030c1a368b3152bfdb57471a35c47c3b32))


- **(es/minifier)** Inline constants even if they are exported ([#7583](https://github.com/swc-project/swc/issues/7583)) ([398e922](https://github.com/swc-project/swc/commit/398e922ca0214e03556bb84fe632e5e03badd533))


- **(es/minifier)** Drop unused properties ([#7534](https://github.com/swc-project/swc/issues/7534)) ([47d2edd](https://github.com/swc-project/swc/commit/47d2edd4dc448a611396006852f30e2b8de1c42c))


- **(es/minifier)** Compress common sub expressions in sequences ([#7587](https://github.com/swc-project/swc/issues/7587)) ([ff1ad95](https://github.com/swc-project/swc/commit/ff1ad95b59732282c014474609bbb405e0f9edb4))


- **(es/minifier)** Drop recursively used var declaration ([#7649](https://github.com/swc-project/swc/issues/7649)) ([04b0f6d](https://github.com/swc-project/swc/commit/04b0f6d8234bdcc34815a558c4c9eecf24c8e4e7))


- **(es/minifier)** Support `mangle.eval` ([#7777](https://github.com/swc-project/swc/issues/7777)) ([eff0cac](https://github.com/swc-project/swc/commit/eff0caca2b6bfd383c8369cf0f4cdad86bb9e575))


- **(es/minifier)** Evaluate more `toFixed` expressions ([#8109](https://github.com/swc-project/swc/issues/8109)) ([7da3f52](https://github.com/swc-project/swc/commit/7da3f52485062eb23c719e1236b2fee90c228bdd))


- **(es/minifier)** Inline into the arguments of `new` using seq inliner ([#8127](https://github.com/swc-project/swc/issues/8127)) ([4f67794](https://github.com/swc-project/swc/commit/4f67794223cf2848ac3c3e42e1e43acec4533246))


- **(es/minifier)** Drop empty static blocks ([#8152](https://github.com/swc-project/swc/issues/8152)) ([8a461b8](https://github.com/swc-project/swc/commit/8a461b89573e82bfdac9e730ee23a2fa9210a4c5))


- **(es/minifier)** Respect inline level and preserve native names ([#8205](https://github.com/swc-project/swc/issues/8205)) ([dd805e9](https://github.com/swc-project/swc/commit/dd805e95a4735e1b869c298489b80555ab4eb20d))


- **(es/minifier)** Swap bin expr to save paren ([#8277](https://github.com/swc-project/swc/issues/8277)) ([65c3d0e](https://github.com/swc-project/swc/commit/65c3d0e3f4ec4b447e6d36f31eb40bdafdf65db7))


- **(es/minifier)** Support `format.inline_script` ([#8252](https://github.com/swc-project/swc/issues/8252)) ([f059270](https://github.com/swc-project/swc/commit/f059270348a7ee26ee8ed2d185ba71d166f43e14))


- **(es/module)** Add `export_interop_annotation` flag ([#7330](https://github.com/swc-project/swc/issues/7330)) ([caee073](https://github.com/swc-project/swc/commit/caee073935a9abb08f0b5e2e0e9160d80064995b))


- **(es/module)** Preserve custom `use` directives ([#7528](https://github.com/swc-project/swc/issues/7528)) ([3e9dd88](https://github.com/swc-project/swc/commit/3e9dd88e37fcb99293a3683ea7a62214950f7860))


- **(es/module)** Improve error message about relative `jsc.baseUrl` ([#7827](https://github.com/swc-project/swc/issues/7827)) ([9099883](https://github.com/swc-project/swc/commit/9099883175c590106109670de01ab32b33303bfd))


- **(es/module)** Add an option to make resolver fully resolve `index.js` ([#7945](https://github.com/swc-project/swc/issues/7945)) ([7e8d72d](https://github.com/swc-project/swc/commit/7e8d72d03b312b7a48c17afa8d2a4d7f4e802a6a))


- **(es/optimization)** Support `default` imports for const modules ([#7604](https://github.com/swc-project/swc/issues/7604)) ([ac02b84](https://github.com/swc-project/swc/commit/ac02b84918932f2d51840b4c4cef9adf460fce40))


- **(es/parser)** Implement explicit resource management ([#7322](https://github.com/swc-project/swc/issues/7322)) ([041b491](https://github.com/swc-project/swc/commit/041b49146627000971ef05f60e11f916182c67f1))


- **(es/parser)** Disallow tagged tpl in optional chaining ([#7515](https://github.com/swc-project/swc/issues/7515)) ([6c00a24](https://github.com/swc-project/swc/commit/6c00a2422addf0e402bb221e80f6f8acad839b28))


- **(es/parser)** Implement `AsRef<str>` for `IdentLike` ([#8133](https://github.com/swc-project/swc/issues/8133)) ([bffe33a](https://github.com/swc-project/swc/commit/bffe33a27036d01d409bad3fcc69d35157665662))


- **(es/preset-env)** Update compat data ([#7630](https://github.com/swc-project/swc/issues/7630)) ([7e9e84e](https://github.com/swc-project/swc/commit/7e9e84e2306941de591700d3c5f15da2d43236bb))


- **(es/preset-env)** Update builtin definitions for `core-js` imports ([#7715](https://github.com/swc-project/swc/issues/7715)) ([b4f3332](https://github.com/swc-project/swc/commit/b4f3332b21fc2b04e9824469568401725d1dfca5))


- **(es/preset-env)** Update data ([#7882](https://github.com/swc-project/swc/issues/7882)) ([a97d8b4](https://github.com/swc-project/swc/commit/a97d8b42b1f85c1f76ffadcabf6e9c85f0458d8d))


- **(es/preset-env)** Update compat data ([#8194](https://github.com/swc-project/swc/issues/8194)) ([3dc4e1e](https://github.com/swc-project/swc/commit/3dc4e1e02d3e594da6301ca4c80aaee582642fd7))


- **(es/testing)** Support babel-like fixture testing officially ([#8190](https://github.com/swc-project/swc/issues/8190)) ([e960614](https://github.com/swc-project/swc/commit/e9606147fc560cac2ffa75b917a08413b7c94908))


- **(es/testing)** Use `__swc_snapshots__` for `test!` macro ([#8191](https://github.com/swc-project/swc/issues/8191)) ([0aafa75](https://github.com/swc-project/swc/commit/0aafa75fef43beb6630b143e9d71f129300e7614))


- **(es/typescript)** Add `ts_enum_is_mutable` to disable enum inlining ([#8115](https://github.com/swc-project/swc/issues/8115)) ([57b171d](https://github.com/swc-project/swc/commit/57b171dcbe55a8d285d5bc477844b24fdf48835a))


- **(plugin)** Enable bytecheck ([#7280](https://github.com/swc-project/swc/issues/7280)) ([d2c1f45](https://github.com/swc-project/swc/commit/d2c1f45f5a1a1d72fa6d6fa28bd84f242d5aff81))


- **(plugin)** Add versioned wrapper struct ([#7382](https://github.com/swc-project/swc/issues/7382)) ([bba1fad](https://github.com/swc-project/swc/commit/bba1fad35ceda0011e0cd427c670209ac4eb6ed2))


- **(plugin/runner)** Improve caching ([#7341](https://github.com/swc-project/swc/issues/7341)) ([245163a](https://github.com/swc-project/swc/commit/245163a77827767ab0b4df59d00597c4af62d745))


- **(plugin/runner)** Enable in-memory precompiled module cache ([#7420](https://github.com/swc-project/swc/issues/7420)) ([f8fe365](https://github.com/swc-project/swc/commit/f8fe365c3b888bbe49e011a616b6926c9ef24fa2))


- **(plugin/runner)** Support shared wasix runtime ([#7504](https://github.com/swc-project/swc/issues/7504)) ([73929fc](https://github.com/swc-project/swc/commit/73929fc43c34fd4545bd292fbf0f6d7de35fbee9))


- **(plugin/runner)** Update `wasmer` to `v4` ([#7576](https://github.com/swc-project/swc/issues/7576)) ([ab7b17c](https://github.com/swc-project/swc/commit/ab7b17cf106620caa1ba46adf23e6013cc4d6288))


- **(plugin/runner)** Share runtime `Engine` ([#7590](https://github.com/swc-project/swc/issues/7590)) ([9512ea3](https://github.com/swc-project/swc/commit/9512ea31ff1bb0c70f4f96a620b429fa01f48e0c))


- **(swc-info)** Add a CLI to help issue reporting ([#7871](https://github.com/swc-project/swc/issues/7871)) ([d6952ea](https://github.com/swc-project/swc/commit/d6952ea687beb5b9aff1eae26076fa98ac94818b))


- **(swc_core)** Allow native env plugin to use memory cache ([#7390](https://github.com/swc-project/swc/issues/7390)) ([e3868a7](https://github.com/swc-project/swc/commit/e3868a7e00bfb5d7a4677b8be0b64a87e9bf200d))


- **(swc_core)** Expose plugin proxy to the host env ([#7391](https://github.com/swc-project/swc/issues/7391)) ([05b4c11](https://github.com/swc-project/swc/commit/05b4c1149781ab1f69a93a54a462413af2603a3a))


- **(swc_core)** Expose `visit/serde` as serde feature ([#7722](https://github.com/swc-project/swc/issues/7722)) ([2bc9637](https://github.com/swc-project/swc/commit/2bc96373b736ce4d81336c1c0340a1d4f7d7f4b0))


- **(testing)** Add `CARGO_TARGET_DIR` and use it from other crates ([#7552](https://github.com/swc-project/swc/issues/7552)) ([46fb461](https://github.com/swc-project/swc/commit/46fb4619bafd56dfa3edd9064c1fe2ae4b6b78de))

### Miscellaneous Tasks



- **(bindings)** Add `@deprecated` to JS plugins ([#8132](https://github.com/swc-project/swc/issues/8132)) ([1e9b4e0](https://github.com/swc-project/swc/commit/1e9b4e027cabba88c8a0cfd6b62f9ca6c00b29a8))


- **(bindings/node)** Upgrade jemalloc ([#8227](https://github.com/swc-project/swc/issues/8227)) ([495268f](https://github.com/swc-project/swc/commit/495268f12611161285536ccbc03304a1bf1589d0))


- **(css/linter)** Document rules require porting ([#8352](https://github.com/swc-project/swc/issues/8352)) ([55da0bb](https://github.com/swc-project/swc/commit/55da0bb9ddbb661a75e24162b7bdd63d2549dca3))


- **(deps)** Update `memchr` ([#7891](https://github.com/swc-project/swc/issues/7891)) ([01cbd6e](https://github.com/swc-project/swc/commit/01cbd6edbd37c95ece7ca20ad2f6c85d6c1b6e35))


- **(es)** Enable tracing spans for release builds ([#7379](https://github.com/swc-project/swc/issues/7379)) ([166e77c](https://github.com/swc-project/swc/commit/166e77c2b39b4390bb09f3a93f58148a5de40efa))


- **(es/minifier)** Fix script for extracting test cases from next.js app ([#8092](https://github.com/swc-project/swc/issues/8092)) ([a2d0779](https://github.com/swc-project/swc/commit/a2d077958f071752dbc347fbf414622e0146e1fd))


- **(es/module)** Remove `serde(deny_unknown_fields)` ([#8163](https://github.com/swc-project/swc/issues/8163)) ([5be8e74](https://github.com/swc-project/swc/commit/5be8e74ee0a2e81058c340f414479da554081d09))


- **(es/parser)** Scope use of `lexical` to certain features ([#7644](https://github.com/swc-project/swc/issues/7644)) ([a961090](https://github.com/swc-project/swc/commit/a961090c9da5994ec83ad6ffca1074277d61431d))


- **(es/preset-env)** Update data ([#7459](https://github.com/swc-project/swc/issues/7459)) ([e15adaf](https://github.com/swc-project/swc/commit/e15adaf6eaada62b6a3c1b8447fb39612dee7946))


- **(es/preset-env)** Add the repository url to `Cargo.toml` ([#7941](https://github.com/swc-project/swc/issues/7941)) ([ca22359](https://github.com/swc-project/swc/commit/ca22359dbd0ca6e2e925bdc240939f6bd6e9ac9a))


- **(es/preset-env)** Ignore `tp` in the version of a browser version ([#7968](https://github.com/swc-project/swc/issues/7968)) ([005ddc5](https://github.com/swc-project/swc/commit/005ddc573e3752183783cc25dd6242b750f8beb5))


- **(plugin)** Update `rkyv` to `v0.7.42` ([#7397](https://github.com/swc-project/swc/issues/7397)) ([3a0565f](https://github.com/swc-project/swc/commit/3a0565f3778648f2ae57043c8e1bf8c15832b61e))

### Performance



- **(atoms)** Replace `string-cache` with `hstr` ([#8126](https://github.com/swc-project/swc/issues/8126)) ([aa22746](https://github.com/swc-project/swc/commit/aa22746d034c2579bcb0f0404866ff933b9037ba))


- **(atoms)** Update `hstr` to make global APIs fast ([#8241](https://github.com/swc-project/swc/issues/8241)) ([c01454a](https://github.com/swc-project/swc/commit/c01454ad4165d5e6ba58dc2b3b72910bbbc3a518))


- **(atoms)** Introduce `AtomStoreCell` ([#8232](https://github.com/swc-project/swc/issues/8232)) ([a5a6eb5](https://github.com/swc-project/swc/commit/a5a6eb53a56faa8e224f59f5cd967e5075c12edd))


- **(bindings)** Enable `share-generics` to reduce binary size ([#7482](https://github.com/swc-project/swc/issues/7482)) ([d623db4](https://github.com/swc-project/swc/commit/d623db48dedf08f32bf7a2afbf71cd1aed27d30a))


- **(css/parser)** Use `AtomStore` ([#8238](https://github.com/swc-project/swc/issues/8238)) ([a3c03b3](https://github.com/swc-project/swc/commit/a3c03b30fb3aa19cb590addbf47b0583d1b05dad))


- **(css/parser)** Use `AtomStoreCell` ([#8247](https://github.com/swc-project/swc/issues/8247)) ([302954e](https://github.com/swc-project/swc/commit/302954e4e54b7190c88667534c2dd6105f744f90))


- **(css/prefixer)** Convert macro to a function call to reduce binary size ([#7507](https://github.com/swc-project/swc/issues/7507)) ([d545df6](https://github.com/swc-project/swc/commit/d545df6dd951fa2f5756830c40c21ae251e4e634))


- **(es)** Use `&dyn Comments` to reduce binary size ([#7489](https://github.com/swc-project/swc/issues/7489)) ([2c3ac68](https://github.com/swc-project/swc/commit/2c3ac682e271dad0ab6e82c14ad14f06715d853b))


- **(es)** Use `&dyn Comments` for jsx and TypeScript ([#7490](https://github.com/swc-project/swc/issues/7490)) ([abd62bc](https://github.com/swc-project/swc/commit/abd62bc797175d783d18d162301c851eefa7ac23))


- **(es)** Delete useless partition and extend in comments ([#8214](https://github.com/swc-project/swc/issues/8214)) ([67e2c4a](https://github.com/swc-project/swc/commit/67e2c4a4fd17436732099422c25d1c0d82f815dd))


- **(es/compat)** Improve time complexity of `class_properties` ([#7786](https://github.com/swc-project/swc/issues/7786)) ([76c6258](https://github.com/swc-project/swc/commit/76c6258d1544ede09cb4f281c42e1fc80ad4145b))


- **(es/lexer)** Remove needless clones of `Rc<RefCell<AtomStore>>` ([#8231](https://github.com/swc-project/swc/issues/8231)) ([37657b8](https://github.com/swc-project/swc/commit/37657b8bd53d848035040f31a386029ef4af7cea))


- **(es/minifier)** Make minifier not overly generic ([#7483](https://github.com/swc-project/swc/issues/7483)) ([65ce5d1](https://github.com/swc-project/swc/commit/65ce5d1081271f1cb4db6d4537311fbb60a08359))


- **(es/minifier)** Add `has_flag` to `Comments` ([#8182](https://github.com/swc-project/swc/issues/8182)) ([7530e90](https://github.com/swc-project/swc/commit/7530e9051d67d8721126e48c39f0a8ac27d980a5))


- **(es/minifier)** Remove needless operations for char freq analysis ([#8222](https://github.com/swc-project/swc/issues/8222)) ([b745ed7](https://github.com/swc-project/swc/commit/b745ed7ac8a87582d43fb2f975f53ad96ed3477b))


- **(es/minifier)** Improve `format.inline_script` ([#8292](https://github.com/swc-project/swc/issues/8292)) ([7d1836d](https://github.com/swc-project/swc/commit/7d1836de3fd96786351f5ae30c2b0e7bbda2fa55))


- **(es/parser)** Remove needless `strcmp` ops ([#8223](https://github.com/swc-project/swc/issues/8223)) ([3833cf4](https://github.com/swc-project/swc/commit/3833cf4e55a27982c930c18c901a9b06e60f92fc))


- **(es/parser)** Improve performance ([#8224](https://github.com/swc-project/swc/issues/8224)) ([e3e439d](https://github.com/swc-project/swc/commit/e3e439dba638cd631560d2eb0c2b0ec4db288e68))


- **(es/parser)** Use smarter lookup table for lexer ([#8226](https://github.com/swc-project/swc/issues/8226)) ([d4ae44a](https://github.com/swc-project/swc/commit/d4ae44ac4547ad0964bb4c3bc482c9a23c13feb9))


- **(es/react)** Don't use regex ([#7284](https://github.com/swc-project/swc/issues/7284)) ([248fd37](https://github.com/swc-project/swc/commit/248fd374e66bf33c3d40eff1fe2ab2d584aec507))


- **(es/transforms)** Remove wrong parallelism ([#7889](https://github.com/swc-project/swc/issues/7889)) ([a505012](https://github.com/swc-project/swc/commit/a50501255d2a91f2bbc1ce9767689dc4fad540cc))


- **(es/typescript)** Visit ts import/export only once ([#8213](https://github.com/swc-project/swc/issues/8213)) ([a00f575](https://github.com/swc-project/swc/commit/a00f575837a44a14dd09dd634f45a64e138263b0))


- **(preset-env)** Update static map ([#7293](https://github.com/swc-project/swc/issues/7293)) ([bc83cb2](https://github.com/swc-project/swc/commit/bc83cb2ecfcfcec0fef0e0b2f2450746ada4628c))

### Refactor



- **(atoms)** Remove usage of `js_word!` to drop `string-cache` ([#7976](https://github.com/swc-project/swc/issues/7976)) ([84cec87](https://github.com/swc-project/swc/commit/84cec8766db77062cc984c777dd716358ee8fd6e))


- **(atoms)** Improve APIs ([#8249](https://github.com/swc-project/swc/issues/8249)) ([9a4bad4](https://github.com/swc-project/swc/commit/9a4bad4e9ec67a09761398eae5e6bb37e6d0d94f))


- **(bindingins)** Create `@swc/counter` ([#7991](https://github.com/swc-project/swc/issues/7991)) ([0acbb5f](https://github.com/swc-project/swc/commit/0acbb5f78daa52cf505e077993a694eb966368af))


- **(bindings/node)** Remove unused `babelify` type ([#7625](https://github.com/swc-project/swc/issues/7625)) ([73c7769](https://github.com/swc-project/swc/commit/73c77694f11c2b98b6caca5fdd106390e3f82629))


- **(cli)** Make CLI testable/managable with `swc-bump` ([#8045](https://github.com/swc-project/swc/issues/8045)) ([f717cf2](https://github.com/swc-project/swc/commit/f717cf21cc1cea5e30e87c4d08861daadb25ab14))


- **(common)** Derive `ByteCheck` for `ArcString` ([#7380](https://github.com/swc-project/swc/issues/7380)) ([9b3a41c](https://github.com/swc-project/swc/commit/9b3a41c57df4ead8e64c33ee247e8cd029792b16))


- **(common)** Remove `add_bitflags` and update `bitflags` ([#7571](https://github.com/swc-project/swc/issues/7571)) ([95ac74e](https://github.com/swc-project/swc/commit/95ac74e6e494afc90f32c8fc9add2b1824f25db5))


- **(common)** Make `ahash` optional ([#7816](https://github.com/swc-project/swc/issues/7816)) ([981d7b1](https://github.com/swc-project/swc/commit/981d7b152b2f488a67d42052152db22225f1d094))


- **(common)** Mark some methods of `Input` unsafe ([#7848](https://github.com/swc-project/swc/issues/7848)) ([c657324](https://github.com/swc-project/swc/commit/c65732496e4e2aab664b7443a29f5180cba6e965))


- **(es)** Extract parser/codegen code for `swc::Compiler` ([#8030](https://github.com/swc-project/swc/issues/8030)) ([a13f5cb](https://github.com/swc-project/swc/commit/a13f5cbe03f067b376f9f3318ef822142551eb96))


- **(es/ast)** Reimplement optional chaining ([#7441](https://github.com/swc-project/swc/issues/7441)) ([aa83584](https://github.com/swc-project/swc/commit/aa83584634286d7c741d903ad94ba5228c89bc62))


- **(es/ast)** Remove unused fields ([#7518](https://github.com/swc-project/swc/issues/7518)) ([3958f17](https://github.com/swc-project/swc/commit/3958f1792c4598e965f36a11c567c95f69984a9f))


- **(es/ast)** Avoid `transmute` in impl of `Hash` for `Number` ([#7771](https://github.com/swc-project/swc/issues/7771)) ([2258274](https://github.com/swc-project/swc/commit/225827423355cab8cd3c0ae80f335cd2873e6cd4))


- **(es/compat)** Remove usage of `box_patterns` ([#7613](https://github.com/swc-project/swc/issues/7613)) ([0a26066](https://github.com/swc-project/swc/commit/0a26066b7b01d06a6d9e3df2ab7c7e47f4aa9e4c))


- **(es/compat)** Split `swc_ecma_transforms_compat` ([#8110](https://github.com/swc-project/swc/issues/8110)) ([affb6fb](https://github.com/swc-project/swc/commit/affb6fb5e3e363f1eb4d42d4501a4a806c4060f7))


- **(es/helpers)** Move packages for monorepo ([#7833](https://github.com/swc-project/swc/issues/7833)) ([1ab406c](https://github.com/swc-project/swc/commit/1ab406cd7aa19ea333a8462b0cd496ceb3e39ac1))


- **(es/lint)** Remove usage of `box_patterns` ([#7966](https://github.com/swc-project/swc/issues/7966)) ([f7b5e16](https://github.com/swc-project/swc/commit/f7b5e16aef968c9c9f38f40962edf334cc3983e6))


- **(es/minifier)** Respect `toplevel` and `module` options ([#7671](https://github.com/swc-project/swc/issues/7671)) ([9893bd2](https://github.com/swc-project/swc/commit/9893bd2d43de60978dd28c44c8e4032170b11987))


- **(es/minifier)** Respect top-level when invoking IIFE  ([#7690](https://github.com/swc-project/swc/issues/7690)) ([bf72362](https://github.com/swc-project/swc/commit/bf723625b02204c4d2e9228d53ac53c9d41221a1))


- **(es/minifier)** Support stable rustc ([#7734](https://github.com/swc-project/swc/issues/7734)) ([f7afe7e](https://github.com/swc-project/swc/commit/f7afe7edecc65f41845721c75b77d2f6dba04a6a))


- **(es/minifier)** Pre-calculate `reassigned` ([#7832](https://github.com/swc-project/swc/issues/7832)) ([65db1ba](https://github.com/swc-project/swc/commit/65db1badff3108983fcd59f933e9f87c55d62916))


- **(es/minifier)** Remove `mutated` and `mutation_by_call_count` ([#7890](https://github.com/swc-project/swc/issues/7890)) ([8db968a](https://github.com/swc-project/swc/commit/8db968a25d508a0d28d15d556ad121951f39ae0d))


- **(es/minifier)** Move JS options to `swc_ecma_minifier` ([#8028](https://github.com/swc-project/swc/issues/8028)) ([725f7f5](https://github.com/swc-project/swc/commit/725f7f5bda0881bdaac1bf1254f58e5341633d4e))


- **(es/minifier)** Decouple `assign_count` from `reassigned` ([#8137](https://github.com/swc-project/swc/issues/8137)) ([13106e0](https://github.com/swc-project/swc/commit/13106e0d2eaa08c4c74f58205f57c4f2d7d4479f))


- **(es/minifier)** Simplify analyzer context ([#8164](https://github.com/swc-project/swc/issues/8164)) ([bb02cdd](https://github.com/swc-project/swc/commit/bb02cdd26ed863649c6ec8ef9c5cbdaece743b9b))


- **(es/module)** Reimplement some functions of module/typescript ([#8063](https://github.com/swc-project/swc/issues/8063)) ([3e5b062](https://github.com/swc-project/swc/commit/3e5b062cd2792703371bbbfeaf1be309e8280abd))


- **(es/parser)** Make `stacker` an optional dependency ([#7720](https://github.com/swc-project/swc/issues/7720)) ([864bdef](https://github.com/swc-project/swc/commit/864bdefbe0012ddbe93075c70f0b2b44577a5424))


- **(es/parser)** Do not use `lexical` ([#7758](https://github.com/swc-project/swc/issues/7758)) ([e50cfde](https://github.com/swc-project/swc/commit/e50cfde938b2504b723a95f034ac4b388d8725c3))


- **(es/parser)** Do not validate top-level await with target  ([#7774](https://github.com/swc-project/swc/issues/7774)) ([5f97f86](https://github.com/swc-project/swc/commit/5f97f8656f9ff7c42bbf1db95fd9d964c5cc6c7c))


- **(es/parser)** Don't attempt to handle shebangs in `read_token_number_sign` ([#7803](https://github.com/swc-project/swc/issues/7803)) ([5e7834a](https://github.com/swc-project/swc/commit/5e7834aa2ecb0cd01b72979f393a517f1c1e5add))


- **(es/parser)** Remove needless `unsafe` ([#7818](https://github.com/swc-project/swc/issues/7818)) ([8b809db](https://github.com/swc-project/swc/commit/8b809dbe23cab3db2159979cf1852a69c109f1e0))


- **(es/parser)** Introduce `TokenKind` along with `Token` ([#8071](https://github.com/swc-project/swc/issues/8071)) ([9b9bc51](https://github.com/swc-project/swc/commit/9b9bc51c28fee51de9eeedf6d49fbe115d6052e6))


- **(es/preset-env)** Rename parameter to avoid confusion ([#8106](https://github.com/swc-project/swc/issues/8106)) ([95eb147](https://github.com/swc-project/swc/commit/95eb147742ea1aa207845807a306847afc859702))


- **(es/types)** Extract `@swc/types` as a small, reusable package ([#7834](https://github.com/swc-project/swc/issues/7834)) ([f713f1b](https://github.com/swc-project/swc/commit/f713f1b2f6783ed6d85edd6decd87daa473acea0))


- **(es/typescript)** Reimplement TypeScript pass ([#7202](https://github.com/swc-project/swc/issues/7202)) ([9c9a538](https://github.com/swc-project/swc/commit/9c9a538f23cb2bcd2f46e156babf64c7a81db245))


- **(plugin/runner)** Refine cache location ([#7346](https://github.com/swc-project/swc/issues/7346)) ([91a3fbe](https://github.com/swc-project/swc/commit/91a3fbe460799ed604c2b43b4facaed60cfd6c87))


- **(plugin/runner)** Revise cache, module loading ([#7408](https://github.com/swc-project/swc/issues/7408)) ([ac5ab60](https://github.com/swc-project/swc/commit/ac5ab607c94d418dde0ceb4f303cb7d432551565))


- **(plugin/runner)** Add attributes to the module bytes ([#7419](https://github.com/swc-project/swc/issues/7419)) ([c03a74c](https://github.com/swc-project/swc/commit/c03a74c19819cb0cfc8a47cd9b2c1e558355d40d))


- **(swc_core)** Make `common_plugin_transform` agnostic to mode ([#7422](https://github.com/swc-project/swc/issues/7422)) ([cfdd407](https://github.com/swc-project/swc/commit/cfdd40789673eef32a9b9365456860a7cb511000))


- **(swc_node_base)** Rename to `swc_malloc` ([#8272](https://github.com/swc-project/swc/issues/8272)) ([9a0572b](https://github.com/swc-project/swc/commit/9a0572b9680e824ff904d7563167faa84aab47b5))


- **(visit)** Reduce expanded LOCs ([#7442](https://github.com/swc-project/swc/issues/7442)) ([e83368e](https://github.com/swc-project/swc/commit/e83368e5744ebabab8537cb979a374ecbc2e7d95))


- Use `ahash` from `swc_common` in more places ([#7815](https://github.com/swc-project/swc/issues/7815)) ([b43e38d](https://github.com/swc-project/swc/commit/b43e38d3f92bc889e263b741dbe173a6f2206d88))


- Remove `swc_ecma_dep_graph` ([#8290](https://github.com/swc-project/swc/issues/8290)) ([7bbe5e6](https://github.com/swc-project/swc/commit/7bbe5e67d9a4316f47158bf717f8dfa86236b41b))

### Testing



- **(css/module)** Add a test for a fixed issue ([#7399](https://github.com/swc-project/swc/issues/7399)) ([6b92eec](https://github.com/swc-project/swc/commit/6b92eecd398e94a8d58b6b5e49679f7977a17703))


- **(es)** Update tsc test suite ([#7323](https://github.com/swc-project/swc/issues/7323)) ([603f22d](https://github.com/swc-project/swc/commit/603f22de76eaeac1a64ee5e5f2e1dd095f908604))


- **(es)** Add a test for a wrong issue ([#7542](https://github.com/swc-project/swc/issues/7542)) ([70bc605](https://github.com/swc-project/swc/commit/70bc605c6769759b0e896e7e5e91bb070d719552))


- **(es)** Add one more test for a wrong issue ([#7545](https://github.com/swc-project/swc/issues/7545)) ([862f095](https://github.com/swc-project/swc/commit/862f095e656edf6c0e86f1ad8065d8095e162cfa))


- **(es)** Add a test for a unreproducible issue ([#7656](https://github.com/swc-project/swc/issues/7656)) ([c0e4805](https://github.com/swc-project/swc/commit/c0e480593f7af001eb329f088dc29ea3f0f8df58))


- **(es/compat)** Add a test for a wrong issue ([#7300](https://github.com/swc-project/swc/issues/7300)) ([38495a9](https://github.com/swc-project/swc/commit/38495a9835c47ded30d07d6c961a094e22146222))


- **(es/compat)** Add a test for optional chaining with loose mode ([#7726](https://github.com/swc-project/swc/issues/7726)) ([216c4f1](https://github.com/swc-project/swc/commit/216c4f17df449847c3cc3a62b9f5694d2416eca1))


- **(es/minifier)** Enable more terser tests ([#7396](https://github.com/swc-project/swc/issues/7396)) ([f9cdd74](https://github.com/swc-project/swc/commit/f9cdd741c288bee59aa9120b0a5c6f7ca284bd31))


- **(es/minifier)** Update test refs ([#8310](https://github.com/swc-project/swc/issues/8310)) ([a004842](https://github.com/swc-project/swc/commit/a0048427ddfd8bd9f62d5eb104dcd501bac45293))


- **(es/modules)** Add a test for unreproducible issue ([#7655](https://github.com/swc-project/swc/issues/7655)) ([7528de1](https://github.com/swc-project/swc/commit/7528de189780cc6850fad2f744004353c8892a70))


- **(es/parser)** Add a test for a fixed issue ([#7398](https://github.com/swc-project/swc/issues/7398)) ([eaba323](https://github.com/swc-project/swc/commit/eaba323581d2aa2b578c600f44f9b41b103d35b3))


- **(es/parser)** Add a test for a fixed issue ([#7467](https://github.com/swc-project/swc/issues/7467)) ([8274cce](https://github.com/swc-project/swc/commit/8274cce9a7d0aca8d005a215b46f7db9ed7c5aed))


- **(plugin/runner)** Share `target` directory ([#7544](https://github.com/swc-project/swc/issues/7544)) ([aa82e5f](https://github.com/swc-project/swc/commit/aa82e5fff3452db38599bb0bf7fef7cd72b6a09f))

### Buiild



- **(bindings/wasm)** Fix Wasm build ([#7666](https://github.com/swc-project/swc/issues/7666)) ([dc5135f](https://github.com/swc-project/swc/commit/dc5135f43f5fe01ed36c1b40a5647b2f1c3277b4))

### Build



- **(bindings/node)** Link msvc runtime statically ([#7965](https://github.com/swc-project/swc/issues/7965)) ([0759779](https://github.com/swc-project/swc/commit/07597795cc39cce527f505bc5db304ad93082494))


- **(cargo)** Bump up wasmer ([#7294](https://github.com/swc-project/swc/issues/7294)) ([39d415c](https://github.com/swc-project/swc/commit/39d415cc1623456255dc2c7b87594f7fd00ab87b))


- **(cargo)** Update `wasmer` to `v3.3` ([#7352](https://github.com/swc-project/swc/issues/7352)) ([4e278be](https://github.com/swc-project/swc/commit/4e278befcf0071619ee583ffa7c8357ea4fd5c2f))


- **(cargo)** Update deps ([#7564](https://github.com/swc-project/swc/issues/7564)) ([d12dc70](https://github.com/swc-project/swc/commit/d12dc70c9108d5863e0ca2e4f05f4aefcfb4380e))


- **(cargo)** Update deps ([#7566](https://github.com/swc-project/swc/issues/7566)) ([d57d0d3](https://github.com/swc-project/swc/commit/d57d0d3ad3f8ce7ed449eec5896eb2f10b83a930))


- **(cargo)** Update `rustc` to `2023-07-03` ([#7623](https://github.com/swc-project/swc/issues/7623)) ([b34f1ad](https://github.com/swc-project/swc/commit/b34f1adbcc0d9556872c05bb6c7a92b77332a924))


- **(cargo)** Update rustc to `nightly-2023-11-04` ([#8221](https://github.com/swc-project/swc/issues/8221)) ([14ea705](https://github.com/swc-project/swc/commit/14ea705f272968cba65399271a62e56a9943dc72))


- **(cargo)** Update `vergen` to `v8` ([#8325](https://github.com/swc-project/swc/issues/8325)) ([1315615](https://github.com/swc-project/swc/commit/13156157ebf9434fef8ed04ee4cf59c22421a3fa))


- **(common)** Remove dependency on `string-cache` ([#8291](https://github.com/swc-project/swc/issues/8291)) ([66a4d37](https://github.com/swc-project/swc/commit/66a4d370314d45b5d4a0117401002ac43dbcba0a))


- **(deps)** Update `syn` to `v2` ([#7557](https://github.com/swc-project/swc/issues/7557)) ([5441004](https://github.com/swc-project/swc/commit/54410047fa7ccb1330fb2e9db27a3c0b2a24a02e))


- **(deps)** Update `ahash` ([#8174](https://github.com/swc-project/swc/issues/8174)) ([5ca3b63](https://github.com/swc-project/swc/commit/5ca3b6358219ec71a000fa30d8be14ee2c3f2fc8))


- **(es)** Remove duplicate `phf` dependency ([#8294](https://github.com/swc-project/swc/issues/8294)) ([25ac679](https://github.com/swc-project/swc/commit/25ac679bd3906c09212134859df9c75f38018822))


- **(preset-env/base)** Upgrade `browserslist-rs` to `v0.13.0` ([#8229](https://github.com/swc-project/swc/issues/8229)) ([f9f305c](https://github.com/swc-project/swc/commit/f9f305cc5faa79dd13bfa5763c6250b23a2a91e3))

<!-- generated by git-cliff -->
