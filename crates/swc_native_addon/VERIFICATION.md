# Implementation verification

Verified on 2026-09-07 in the hosted Linux x86_64 runner, starting from SWC main
`a5bd5924c14e702b995cdbb6581a9ecf4098df5a`. This records observed results, not a
claim that unexecuted native platform tests passed.

## Passed

- `cargo fmt --all`.
- `cargo test -p swc_native_addon -p swc_native_addon_pack -p binding_native_addon
  --target-dir target/native-node`: 17 tests passed; the three explicit filesystem
  tests were ignored pending their required volumes/hosts.
- `cargo clippy -p swc_native_addon -p swc_native_addon_pack
  -p binding_native_addon --all-targets --target-dir target/native-lints --
  -D warnings`.
- `python3 crates/swc_native_addon/scripts/msrv.py`: the same private suites
  passed with Rust 1.73.0 and the repository's dependency versions in a temporary
  standalone workspace.
- `SWC_TEST_NODE=/tmp/swc-native-node/node-v<VERSION>-linux-x64/bin/node
  cargo test -p binding_native_addon --test carrier --target-dir target/native-node`
  passed separately for 10.0.0, 12.0.0, 14.0.0, and 20.0.0. The default Node 24.20.0
  run passed too. These exercise exact exports forwarding, live callbacks, raw
  exceptions, loader errors, and simultaneous first loads in real Node processes.
- In `packages/core`, `pnpm build:dev` and then `pnpm test`: 40 test files and
  117 tests passed; two files and three tests were skipped by the existing suite.
  The initially missing `wasm32-wasip1` target was installed before the successful
  retry. Generated public binding and fixture files were restored afterward.

The actual core development addon was copied, stripped with `strip --strip-all`,
packed, and embedded into a release carrier. Under Node 24.20.0 with
`SWC_NATIVE_BINDING_CACHE=0`, `getTargetTriple()` returned
`x86_64-unknown-linux-gnu` and `transformSync` successfully transformed JavaScript.
The stripped raw file was 95,439,432 bytes, its payload 20,488,224 bytes, and the
release carrier 21,073,680 bytes. These are one local artifact's measurements,
not a release-wide size or performance guarantee.

## Cross-target Rust checks

This command passed for each target below:

```sh
ZSTD_SYS_USE_PKG_CONFIG=1 PKG_CONFIG_ALLOW_CROSS=1 \
  cargo clippy -p swc_native_addon -p binding_native_addon --all-targets \
  --target <TARGET> --target-dir target/native-cross -- -D warnings
```

- `x86_64-pc-windows-msvc`
- `aarch64-pc-windows-msvc`
- `x86_64-apple-darwin`
- `aarch64-apple-darwin`
- `x86_64-unknown-linux-musl`
- `aarch64-unknown-linux-musl`
- `aarch64-unknown-linux-gnu`

Host pkg-config supplied zstd metadata only for these Rust checks. They did not
link target zstd/native images and do not verify native loading, filesystem
behavior, signing, or Windows process-exit cleanup.

## Blocked and unavailable commands

`git submodule update --init --recursive` was attempted before tests. The runner
rejected it with: "git submodule update is disabled by the runner because each
submodule requires an independently bound repository credential". The missing
submodules were not cloned through another route.

`cargo clippy --all --all-targets -- -D warnings` was run. It could not complete:
`crates/swc_html_parser/tests/html5lib_tests.rs` at lines 61 and 540 reported
fixture-macro panics, "No test found", because the `html5lib-tests` submodule is
empty. Those failures also cause unused-import diagnostics in that test. The
submodule authorization restriction above prevents repairing this environment.

The following native commands remain unavailable:

| Command | Exact reason |
| --- | --- |
| `SWC_TEST_VOLUME=/writable/apfs cargo test -p swc_native_addon --test platform apfs_self_replacement -- --ignored --exact` | The host is Linux, with no APFS volume or macOS runtime. Apple's `/usr/bin/ditto` is unavailable. |
| `SWC_TEST_VOLUME=/writable/btrfs cargo test -p swc_native_addon --test platform btrfs_self_replacement -- --ignored --exact` | The workspace and OS-temp filesystem are overlayfs. A btrfs image was prepared, but `sudo mount -o loop /tmp/swc-btrfs-test-57qzc5li/volume.img /tmp/swc-btrfs-test-57qzc5li/mount` failed because sudo requires a terminal/password. No writable btrfs mount is available. |
| `cargo test -p swc_native_addon --test platform ntfs_compression -- --ignored --exact` | The host has neither a Windows runtime nor an NTFS volume on which the Win32 compression API can run. |
| `cargo test -p swc_native_addon --test platform temporary_cleanup_after_process_exit -- --exact` on Windows | This Windows-only test is excluded on Linux. Normal-exit and forced-termination delete-on-close behavior require a real Windows process and filesystem. |
| `cargo test -p binding_native_addon --test carrier` on macOS | There is no macOS runtime, Apple SDK, or `/usr/bin/codesign`; Linux cross-target linting cannot execute the Mach-O carrier or its signing checks. |
| `cargo test -p binding_native_addon --test carrier` on Windows | There is no Windows runtime or MSVC native link environment for loading the PE carrier. Rust type checking alone does not exercise Windows loader locks or deletion sharing. |

The explicit APFS, btrfs, and NTFS tests remain ignored by default so an ordinary
test run does not misrepresent fallback behavior as successful compression.
Run these native checks before activating carriers in npm release publishing.
