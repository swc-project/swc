# Changelog

## 9.2.2

### Various fixes & improvements

- fix: Correctly interpret missing line/column numbers (#129) by @loewenheim
- ref: Remove fail macro (#128) by @loewenheim
- perf: Make `adjust_mappings` faster by reducing the type size (#124) by @kdy1
- perf: Optimize `flatten()` even more (#122) by @kdy1

## 9.2.1

### Various fixes & improvements

- perf: Make `SourceMapIndex::flatten` more efficient (#121) by @kdy1

## 9.2.0

### Various fixes & improvements

- feat: Add ability to adjust SourceMapIndex offset rows (#119) by @szokeasaurusrex
- feat: Enable getting/setting debug ID on DecodedMap (#118) by @szokeasaurusrex
- build: upgrade dependencies (#107) by @paolobarbolini
- build: drop unused `rustc_version` dependency (#108) by @paolobarbolini
- feat: Add `debug_id` field to `SourceMapIndex` (#117) by @szokeasaurusrex
- ref(tests): Move tests under `cfg(test)` (#115) by @szokeasaurusrex
- ref(utils): Fix clippy lint (#116) by @szokeasaurusrex
- fix(Hermes): Use 1-based indexing for lines (#106) by @pablomatiasgomez

## 9.1.2

### Various fixes & improvements

- Prefer `"debug_id"` for sourcemap debug IDs (#101) by @loewenheim

## 9.1.1

### Various fixes & improvements

- Fixed an error when deserializing sourcemaps with
  both `"debugId"` and `"debug_id"` keys (#100) by @loewenheim

## 9.1.0

### Various fixes & improvements

- Add support for ignoreList property (#93) by @wbinnssmith

## 9.0.1

### Various fixes and improvements

- Debug IDs can be read from the "debugId" field in addition to "debug_id" (#97) by @loewenheim.

## 9.0.0

### Various fixes and improvements

- ref: Tokens within a sourcemap are now always sorted by their position in the
      minified file (#91) by @loewenheim.
      Consequently:
      - the type `IndexIter` and the functions `get_index_size`, `index_iter`,
        and `idx_from_token` have been deleted;
      - the function `sourcemap_from_token` has been turned into the method
        `sourcemap` on `Token`;
      - the `idx` parameter of `SourceMap::get_token` now has the type `usize`.

## 8.0.1

### Various fixes & improvements

- feat: Skip encoding range mappings if it's empty (#86) by @kdy1

## 8.0.0

### Various fixes & improvements

- feat: Add support for range mappings proposal (#77) by @kdy1
- perf: using Arc<str> instead of String (#84) by @underfin
- perf: using FxHashMap instead of HashMap (#83) by @underfin

## 7.1.1

### Various fixes & improvements

- chore: remove unless change (#82) by @underfin

## 7.1.0

### Various fixes & improvements

- refactor: make SourceView implement Sync (#80) by @underfin
- feat: add SourceMap::to_data_url (#81) by @underfin
- feat: Replace `unicode-id` crate with `unicode-id-start` (#78) by @Boshen

## 7.0.1

### Various fixes and improvements

- fix: Fixed a bug in index sourcemap flattening (#74) by @loewenheim

## 7.0.0

### Various fixes and improvements

- ref: SourceMap::adjust_mappings now works in place (#70) by @loewenheim

## 6.4.1

### Various fixes & improvements

- fix: Do not set source_contents if it already exists (#68) by @kamilogorek

## 6.4.0

### Various fixes and improvements

- feat: Implement sourcemap composition(#67) by @loewenheim

## 6.3.0

### Various fixes & improvements

- feat: Sourcemaps now support debug ids (#66) by @loewenheim

## 6.2.3

### Various fixes & improvements

- fix: Correctly handle protocol-only sourceRoot values (#61) by @kamilogorek

## 6.2.2

### Various fixes & improvements

- Ensure greatest_lower_bound returns lowest match index (#60) by @jridgewell
- feat: Switch to data-encoding for base64 (#59) by @mitsuhiko

## 6.2.1

### Various fixes & improvements

- ref: Update CI definitions (#58) by @Swatinem
- fix: Correctly rewrite SourceMapHermes (#56) by @Swatinem
- Remove regex dependency for faster runtime, and compile (#55) by @willstott101
- Jridgewell index (#54) by @Swatinem

## 6.2.0

**Features**:

- Add `source_root` support for `SourceMap` and `SourceMapBuilder`, with respective getters/setters and de/serialization. ([#51](https://github.com/getsentry/rust-sourcemap/pull/51))

## 6.1.0

**Features**:

- Add a new `get_scope_for_token` method to `SourceMapHermes` as a more flexible alternative to `get_original_function_name`. ([#48](https://github.com/getsentry/rust-sourcemap/pull/48))

## 6.0.2

**Fixes**:

- Improve parsing performance by reusing a temporary allocation. [#40](https://github.com/getsentry/rust-sourcemap/pull/40)

## 6.0.1

**Fixes**:

- Fix compilation errors when targetting wasm.

## 6.0.0

**Breaking Changes**:

- The `SourceMapRef::Missing` variant was removed in favor of explicit `Option`s.
- The `locate_sourcemap_reference_slice` and `locate_sourcemap_reference` functions now return a `Option`.
- `SourceMapRef::get_url` does _not_ return an `Option` anymore.

**Features**:

- Added missing `Clone` and `Debug` impls to a lot of types.
- A lot of new convenience API, including a `DecodedMap::get_original_function_name` method that works across all supported SourceMap types.
