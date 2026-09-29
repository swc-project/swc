# macOS native addon startup verification

Measured on 2026-09-29 on an Apple M5 Max running macOS 26.6.2 (25G83),
with an APFS user volume and native ARM64 Node. The baseline loader comes from
`68586f07fe`; the optimized loader is `1439941c7c`. Both carriers embed the same
stripped, ad-hoc-signed release `binding_core_node` image from this source tree.
The release profile uses fat LTO, one codegen unit, symbol stripping, and aborting
panics. Builds used separate output directories to prevent stale artifacts from
being reused between source trees.

The raw image is 24,046,656 bytes; the zstd payload is 8,288,283 bytes. The baseline
carrier is 8,842,528 bytes and the optimized carrier is 8,790,880 bytes. The raw
SHA-512 shared by both carriers is:

```
f153fe4d4c6e8d47be3a70ff38442c10bc94769f893a8a55eefcaa13aca9aad1bf144b66b7cabbf962f785e126146795812b55857ac3c129e79915b02e044908
```

## Method and first load

The [comparison script](../scripts/native/compare-startup.mjs) loads the actual
core JavaScript package through the existing native smoke test. Each sample
copies a single-link image outside the timer, starts a fresh Node process with
an empty isolated default cache, and measures only `require()`. Baseline and
optimized order alternates. Three rounds contain 15 samples per case, for each
Node version. No build or test jobs ran locally during the measurements.
These are installation-first loads, not measurements after clearing the OS
page cache. The script asserts that baseline samples really perform APFS
replacement, optimized samples retain the carrier and create one verified raw
cache image, and the three source artifacts remain unchanged.

All six round medians exceed the preselected 5% improvement criterion.
Times below are milliseconds; raw is the matching fresh-file baseline.

| Node | Round | Raw first load | Before | After | Reduction |
| --- | ---: | ---: | ---: | ---: | ---: |
| v20.20.2 | 1 | 272.34 | 606.92 | 493.93 | 18.62% |
| v20.20.2 | 2 | 271.70 | 608.87 | 500.57 | 17.79% |
| v20.20.2 | 3 | 277.44 | 614.15 | 505.21 | 17.74% |
| v22.23.3 | 1 | 275.77 | 647.09 | 529.66 | 18.15% |
| v22.23.3 | 2 | 268.82 | 606.82 | 500.87 | 17.46% |
| v22.23.3 | 3 | 281.46 | 606.62 | 547.19 | 9.80% |

## Subsequent loads and storage

The second-load columns use a fresh process against the same installation:
APFS-compressed raw addon before, carrier plus raw cache after. The separate
warm-cache columns deliberately hardlink both carriers to force the existing
cache path. Each entry is a 15-sample median in milliseconds.

| Node | Round | Installed second, before | Installed second, after | Warm cache, before | Warm cache, after |
| --- | ---: | ---: | ---: | ---: | ---: |
| v20.20.2 | 1 | 253.43 | 18.46 | 14.93 | 14.64 |
| v20.20.2 | 2 | 256.19 | 18.46 | 15.47 | 14.56 |
| v20.20.2 | 3 | 257.29 | 18.48 | 15.03 | 14.50 |
| v22.23.3 | 1 | 259.02 | 16.73 | 15.08 | 14.62 |
| v22.23.3 | 2 | 256.50 | 18.14 | 15.44 | 14.68 |
| v22.23.3 | 3 | 270.02 | 18.08 | 15.08 | 14.83 |

For this build, median allocated binary storage (`stat.blocks * 512`, installed
addon plus persistent `.node` cache files) increases from 11,567,104 bytes
(11.03 MiB) to 32,841,728–33,550,336 bytes (31.32–32.00 MiB). This excludes package
JS and small cache lock files. The download still contains only the compressed
carrier. Full-byte integrity checks remain enabled on every cache load.
These numbers describe this local core artifact, not every released package.

## Reproduction and correctness

Build a single release core image, strip and sign it before packing, and retain
it for both carriers. Build the baseline and changed carriers from their
respective sources using separate `--target-dir` values and the same absolute
`SWC_NATIVE_BINDING_PAYLOAD`. Strip each carrier with `strip -x`, then sign it
with `codesign --force --sign -`. Validate both against the raw input using
`swc-native-addon-verify --input <carrier> --target aarch64-apple-darwin --raw <raw>`.
Build core's JavaScript with `pnpm --dir packages/core build:ts`, then run:

```sh
node scripts/native/compare-startup.mjs raw.node before.node after.node results.json
```

Run that command with each desired native Node binary. It records all samples,
medians, storage observations, and source hashes in the output JSON. The run
fails if baseline replacement did not occur, the changed carrier was replaced,
the decoded image differs, or any first-load round improves by less than 5%.

Local checks passed:

- Recursive submodule initialization, `cargo fmt --all`, and
  `cargo clippy --all --all-targets -- -D warnings`.
- Native private crate suites: 36 passed; three host-specific tests ignored by
  default. The explicit APFS self-replacement test passed separately.
- The same private suites on Rust 1.73: 36 passed, three ignored.
- Native JavaScript suites: 22 passed; one Windows-specific test skipped.
- Core `pnpm build:dev && pnpm test`: 119 passed; three existing skips.

The macOS fixture covers unset/empty/custom/temporary caches, fallback from a
blocked custom root, same-length cache corruption, warm reuse, hardlinked and
read-only installations, and eight simultaneous first loads. It checks that
the carrier's bytes, inode, permissions, and link count are preserved.

Cross-platform release verification is tracked in
[the verification-only workflow](https://github.com/swc-project/swc/actions/runs/36549130544),
which checks runtime commit `1439941c7c` with publishing and tag creation disabled.
