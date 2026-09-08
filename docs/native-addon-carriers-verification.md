# Native release integration verification

Observed on 2026-09-08 in the hosted Linux x86_64 runner, starting from main
`2855b5a8c1f24d09e69cca1ea80b03c3c55180e4`. The host reports Intel Xeon Platinum
8488C CPUs and uses overlayfs. This records this integration's checks; the
[foundation verification](../crates/swc_native_addon/VERIFICATION.md) is separate.

**Release acceptance is not yet satisfied.** Core exceeds the issue's cold and
warm load budgets on this host. Native cross-platform execution and the full
48-artifact release have not run here. The new shared gate rejects missing or
failing evidence; these limitations do not permit a raw fallback or publication.

## Passed checks

-   `node --test scripts/native/*.test.mjs`: 9 passed. Coverage includes the exact
    48-manifest boundary, missing/duplicate/stale/raw-substituted evidence, the
    aggregate 50% boundary, excluded targets, real `npm pack` layout and byte
    substitution, workflow dependencies, finalization order, and shell syntax.
-   Actionlint 1.7.7 passed on the three touched workflows with `-shellcheck=`;
    the workflow script tests independently parse all embedded build scripts with
    `bash -n`.
-   `cargo fmt --all` passed.
-   `cargo test -p swc_native_addon -p swc_native_addon_pack
-p binding_native_addon --target-dir target/native-tests`: 30 passed, three
    explicit filesystem tests ignored. The new real-image verifier test checks
    stripping, retained payload inspection, extraction equality, rejected raw and
    corrupt images, size failure, CLI protection, and atomic replacement.
-   `python3 crates/swc_native_addon/scripts/msrv.py`: the private suites passed
    with Rust 1.73.0 and the repository's locked dependency versions.
-   `cargo clippy -p swc_native_addon -p swc_native_addon_pack
-p binding_native_addon --all-targets --target-dir target/native-lints
-- -D warnings` passed.
-   `(cd packages/core && pnpm build:dev && pnpm test)` passed: 40 files and 117
    tests, with the existing two files/three tests skipped.
-   All four actual Linux GNU x64 release addons built using their package build
    scripts. Core used `--no-default-features --features swc_v1,plugin`, matching
    that workflow target. The new finalizer packed, validated, and replaced each
    exact addon; host verification extracted SHA-512-identical raw images.
-   With the actual carriers and `SWC_NATIVE_BINDING_CACHE=0`, core's 117 tests,
    minifier's two tests, and React Compiler's eight tests passed. HTML's existing
    package test is an echo command; the additional carrier smoke successfully
    minified HTML and removed comments.
-   All four products loaded through their checked-in JS loader paths and real
    main/platform tarballs on Node 20.20.0 and 22.14.0. Native exports matched raw
    exports, and bytes actually materialized in the warm cache matched the raw
    SHA-512. Timing acceptance is reported separately below.
-   Both layouts passed the exact minimum smoke versions: core 10.0.0, HTML
    14.0.0, minifier 12.0.0 and 14.0.0, and React Compiler 20.0.0.

Generated public bindings, package manifests, README copies, and fixture
lockfiles from local builds/prepack were restored. No package engine, optional
platform dependency contract, JS loader, or public native export was changed.
Npm changesets and synchronized versioning are externally managed as requested.

## Actual Linux GNU x64 artifact measurements

Sizes are bytes. Payload includes the 96-byte private header. Tarball size is
for the actual matching platform package; main tarballs were also inspected and
loaded. Local assembly prepared only the four available target pairs; it did
not bypass the production assembler's requirement for twelve targets/product.

| Product        |        Raw | Compressed frame |   Payload |    Carrier | Reduction | Platform tarball |
| -------------- | ---------: | ---------------: | --------: | ---------: | --------: | ---------------: |
| core           | 32,908,416 |        9,860,693 | 9,860,789 | 10,484,712 |    68.14% |       10,153,748 |
| html           | 12,491,344 |        3,721,865 | 3,721,961 |  4,345,832 |    65.21% |        4,024,426 |
| minifier       |  8,365,120 |        2,592,757 | 2,592,853 |  3,216,744 |    61.55% |        2,890,640 |
| react-compiler |  6,904,576 |        2,379,827 | 2,379,923 |  3,003,816 |    56.50% |        2,684,894 |

These four addons total 60,669,456 raw bytes and 21,051,104 carrier bytes
(65.30% reduction). This is **not** a measurement of all 32 selected artifacts,
and no claim is made that the other 16 artifacts were built locally. CI requires
all 32 carrier and 16 raw records, verifies tarball bytes, and enforces the full
selected aggregate independently.

## Load timings and observed release blocker

Each cell is a median over 15 fresh Node processes, in milliseconds, measured
around the package's `require()`. Cold uses an empty custom cache; warm uses an
already populated cache. Disposable hardlinks prevent self-replacement from
turning this into a raw-file measurement. Raw and carrier exports and product
operations are checked before timings. Timing failures print their measurements
but do not emit a successful report for the release gate.

| Product        | Node    |   Raw |    Cold |   Warm | Cold overhead | Warm overhead | 100/25 ms budgets |
| -------------- | ------- | ----: | ------: | -----: | ------------: | ------------: | ----------------- |
| core           | 20.20.0 | 4.978 | 210.044 | 67.537 |       205.066 |        62.559 | Fail              |
| core           | 22.14.0 | 4.646 | 213.831 | 67.423 |       209.185 |        62.777 | Fail              |
| html           | 20.20.0 | 2.670 |  84.865 | 27.045 |        82.195 |        24.375 | Pass              |
| html           | 22.14.0 | 2.384 |  85.778 | 26.273 |        83.394 |        23.889 | Pass              |
| minifier       | 20.20.0 | 3.134 |  63.109 | 19.708 |        59.975 |        16.574 | Pass              |
| minifier       | 22.14.0 | 2.840 |  61.305 | 19.322 |        58.466 |        16.482 | Pass              |
| react-compiler | 20.20.0 | 3.547 |  52.269 | 16.970 |        48.722 |        13.423 | Pass              |
| react-compiler | 22.14.0 | 3.304 |  54.929 | 17.047 |        51.625 |        13.743 | Pass              |

The checked-in runtime hashes the complete decoded file on every cache hit and
verifies again after filesystem compression when publishing a new cache entry.
As a diagnostic, hashing core's raw bytes with Node's native SHA-512 alone took
44–46 ms on this host. This does not establish a complete performance profile,
but it shows that skipping decompression alone cannot satisfy the 25 ms budget
here. Integrity checks and acceptance thresholds were kept intact. A runtime
performance follow-up and representative native CI results are needed before
release acceptance can be claimed.

## Cross-target Rust checks

After installing the seven Rust target libraries and `libzstd-dev`, this command
passed for Windows MSVC x64/arm64, Darwin x64/arm64, Linux musl x64/arm64, and
Linux GNU arm64:

```sh
ZSTD_SYS_USE_PKG_CONFIG=1 PKG_CONFIG_ALLOW_CROSS=1 \
  cargo clippy -p swc_native_addon -p binding_native_addon \
  -p swc_native_addon_pack --all-targets --target <TARGET> \
  --target-dir target/native-cross -- -D warnings
```

The first Darwin check found an existing Linux mount-table helper compiled but
unused on macOS. Its compilation is now limited to Linux, matching its caller
and existing unit tests. Both Darwin checks passed after that correction.
Host pkg-config supplies zstd metadata for Rust checking only. These checks do
not link cross-target images or establish target zstd ABI, signing, execution,
or filesystem behavior.

## Unavailable or blocked validation

`git submodule update --init --recursive` was attempted before tests. The runner
rejected it with: "git submodule update is disabled by the runner because each
submodule requires an independently bound repository credential". The empty
submodules were not fetched through another route.

The required `cargo clippy --all --all-targets -- -D warnings` was run and failed
because `crates/swc_html_parser/tests/html5lib_tests.rs` fixture macros at lines
61 and 540 report "No test found" for the empty `html5lib-tests` submodule. The
same failure produces nine unused-import diagnostics. The private-crate clippy
command passed separately.

| Check                                                                                                            | Exact local limitation                                                                                                                                                                                                                                                         |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Full 48-artifact assembly and 32-target/product runtime inventory                                                | Only Linux GNU x64 product images were linked and run. The other target images and matching native hosts are not available in this VM. The production gate rejects this incomplete inventory.                                                                                  |
| Linux musl container build/load and cross-architecture containers                                                | Docker was installed. Starting `sudo -n dockerd --data-root /tmp/swc-native-docker --host unix:///tmp/swc-native-docker.sock --iptables=false --bridge=none` failed with `sudo: a password is required`. No running Docker daemon or cross-architecture emulator is available. |
| `SWC_TEST_VOLUME=... cargo test -p swc_native_addon --test platform btrfs_self_replacement -- --ignored --exact` | btrfs-progs was installed and an image formatted. `sudo -n mount -o loop /tmp/swc-native-btrfs.img /tmp/swc-native-btrfs-volume` failed with `sudo: a password is required`; workspace and temp paths are overlayfs.                                                           |
| `SWC_TEST_VOLUME=... cargo test -p swc_native_addon --test platform apfs_self_replacement -- --ignored --exact`  | Linux has no APFS volume, macOS runtime, Apple SDK, `/usr/bin/ditto`, or `/usr/bin/codesign`. Mach-O execution and signing need a Mac host.                                                                                                                                    |
| `cargo test -p swc_native_addon --test platform ntfs_compression -- --ignored --exact`                           | No Windows runtime or NTFS volume supporting the Win32 compression API is available.                                                                                                                                                                                           |
| `cargo test -p swc_native_addon --test platform temporary_cleanup_after_process_exit -- --exact` on Windows      | Windows-only process-exit/delete-on-close behavior cannot execute on Linux.                                                                                                                                                                                                    |
| Steady-state CodSpeed comparison                                                                                 | The existing Rust benchmark workflow uses the hosted CodSpeed action and repository `CODSPEED_TOKEN`; this local run has no hosted comparison result. The benchmark workflow was preserved.                                                                                    |

The release workflow now requires real APFS, btrfs, Windows lifecycle checks,
all selected Node 20/22 product paths, exact minimum-version smokes, complete
artifact inventory, size budgets, and timing budgets before any npm or native
GitHub asset publication.
