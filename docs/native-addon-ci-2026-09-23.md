# Native release CI repair status — 2026-09-23

Release acceptance is **not satisfied**. The 100 ms cold and 25 ms warm gates
remain unchanged, and macOS x64 still runs under Rosetta. No npm package or
release tag was published by these verification runs.

## Implemented and checked

- Direct setup-node calls disable inferred package-manager caching. Minimum
  Node versions execute binding smoke checks while package tooling uses Node 20.
- Measurements use canonical, executing-user-owned home caches, fresh cold raw
  copies, and 15-sample medians. Reports require rawColdMs and validate both
  overhead calculations. Windows smoke paths share native realpath normalization.
- Windows ancestor validation accepts TrustedInstaller and skips inheritance-only
  ACEs while retaining cache ownership, DACL, and reparse checks. Rejections name
  the ancestor and SID. Core test setup reports native causes.
- Private BLAKE3 1.5.4 metadata binds the entire v1 header to SHA-512-validated raw
  bytes. Runtime decode/cache verification reads all bytes; final verification
  checks both digests. Public verification defaults and release/cache SHA-512
  identities are unchanged.
- Large x64 macOS verification uses bounded parallel BLAKE3 batches. Recoverable
  cache images avoid durability flushes; installed-carrier replacement retains
  them. The shared Rayon versions are pinned for the private Rust 1.73 MSRV.
- A verification source SHA is accepted only with skipPublishing=true. Manual
  carrier-only workflow dispatch is available for native lifecycle diagnosis.

Local validation passed: submodule initialization, cargo fmt --all, full
cargo clippy --all --all-targets -- -D warnings, 15 native JS tests, core
pnpm build:dev and pnpm test (119 passed, three existing tests skipped), and
swc_native_addon / binding_native_addon crate tests on macOS. APFS replacement
passed with an explicit writable APFS volume. Generated public bindings and
fixture lockfiles were restored after testing.

The current three private crates passed their complete test suites in a
Linux ARM64 rust:1.73-bookworm container using scripts/msrv.py. All three also
passed Rust 1.73 x64 macOS type checking, including the parallel implementation.
The four integrity tests passed as actual x64 macOS executables under Rosetta,
including irregular reads, batch boundaries, and corruption after prior success.

## Actual release workflow result

[Verification run 35858146342](https://github.com/swc-project/swc/actions/runs/35858146342)
built source a84674b2633952c830a7a4f6f3765cd726c3b98a. All 48 builds and all
four npm assembly jobs passed after retrying an infrastructure HTTP 500 while
installing wasm-pack. All five minimum-Node jobs passed. The final gate was not
reached because native lifecycle and runtime jobs failed.

That run exposed the macOS /var temporary-path alias (subsequently canonicalized),
Windows mapped-DLL deletion, and performance failures. Core Linux musl Node 22
reported 308.98 ms cold overhead. Core Rosetta reported 399.71/65.02 ms
cold/warm overhead on Node 20 and 317.04/30.57 ms on Node 22. Subsequent cache
flush and parallel-verification changes have not yet passed a full release run.

## Unresolved native lifecycle contracts

Windows binding registration and the new SID/ACE fixtures passed in
[carrier-only run 35867585312](https://github.com/swc-project/swc/actions/runs/35867585312),
but temporary_cleanup_after_process_exit failed because the mapped DLL remained
on disk after process termination. Acquiring the deletion handle before mapping
fixes registration; it does not establish immediate post-exit removal.

Dedicated Windows reproductions tested ordinary/extended delete disposition,
POSIX disposition, replacement, and native NtSetInformationFile:
[Win32 deletion](https://github.com/swc-project/swc/actions/runs/35869871695),
[replacement](https://github.com/swc-project/swc/actions/runs/35870188130), and
[native disposition](https://github.com/swc-project/swc/actions/runs/35870669765).
Deletion before loading prevents loading; deletion after image mapping is
rejected. Deferring delete-on-close leaves the pathname. Failed immediate-delete
experiments were removed so they do not break otherwise successful loading.
Choosing stale-process cleanup or an asynchronous cleanup process requires a
corresponding test-contract decision; the existing test has not been weakened.

The macOS final-artifact verifier fixture appends 4 MiB after the linked Mach-O
image, which current codesign refuses. An unapplied proposal instead retains
4 MiB of nonzero data in the linked fixture and preserves every assertion.
All three private crates passed their full Rust 1.73 suites in a separate macOS
workspace with that proposal. Its existing fixture construction remains unchanged
pending authorization under the supplied AGENTS.md instruction.

## Rosetta diagnostics, not release acceptance

[Run 35869359958](https://github.com/swc-project/swc/actions/runs/35869359958)
rebuilt instrumented carriers from the earlier run's verified raw images with
parallel verification and cache flush removal. These are diagnostics, not
replacement release evidence for the exact source commit.

| Product | Node | Cold overhead (ms) | Warm overhead (ms) | Result |
| --- | --- | ---: | ---: | --- |
| core | 20 | 751.48 | 42.25 | Fail |
| core | 22 | 371.73 | 40.38 | Fail |
| html | 20 | 99.63 | 26.26 | Fail |
| html | 22 | 332.22 | 68.57 | Fail |

Local M5 Max Rosetta measurements improved from approximately 71/15 ms to
42/7 ms cold/warm overhead with parallel verification, but those local numbers
do not override the CI failures. CI phase logs show substantial variation in
both decoding and verification. Larger batches with fewer workers, mapped
output, and lazy loading were also investigated; none establishes a passing
release gate. Temporary diagnostic workflows and instrumentation were removed
from the final working tree; their committed sources and run logs remain linked.

Completion still requires resolving the two native test contracts, satisfying
the unchanged timing budgets, and a new exact-source verification run passing
every required platform, Node version, and final artifact gate.
