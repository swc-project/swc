# Native release CI repair status — updated 2026-09-24

Release acceptance is **not satisfied**. The 100 ms cold and 25 ms warm gates
remain unchanged, and macOS x64 still runs under Rosetta. No npm package or
release tag was published by these verification runs.

The current production implementation passes the four-host lifecycle suite, but
no full release gate has passed. Windows still enables NTFS cache compression;
macOS x64 still ships a compressed carrier. Changing either behavior requires
the pending user decision. All unsuccessful diagnostic workflows and prototype
scripts have been removed from the branch; their source and evidence remain in
Git and the linked workflow runs.

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
cargo clippy --all --all-targets -- -D warnings, 17 native JS tests, core
pnpm build:dev and pnpm test (119 passed, three existing tests skipped), and
swc_native_addon / binding_native_addon crate tests on macOS. APFS replacement
passed with an explicit writable APFS volume. Generated public bindings and
fixture lockfiles were restored after testing.

The current three private crates passed their complete test suites in a
Linux ARM64 rust:1.73-bookworm container using
crates/swc_native_addon/scripts/msrv.py. All three also
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

## Native lifecycle fixes (verified 2026-09-24)

[Lifecycle run 35948451570](https://github.com/swc-project/swc/actions/runs/35948451570)
passed all four hosts: Windows x64, Windows ARM64, macOS ARM64, and Linux x64.
This includes registration, cache/ACL/integrity fixtures, NTFS/APFS/btrfs checks,
and Windows cleanup after both ordinary exit and forced termination.

Windows uses a small embedded native executable to remove a temporary DLL after
its owning process releases the image section. A private pipe triggers cleanup
without relying on destructors or PID reuse. The worker is verified over its
complete bytes before every launch and retries deletion for up to ten seconds.
It needs no shell or separately installed runtime. Its executable persists in
the private cache; temporary loading starts a worker, while persistent cache hits
do not. External mappings or termination of the worker can still leave files.
The test retains its deletion assertion with a bounded wait for this asynchronous
contract. Additional tests cover literal Unicode/metacharacter paths and a
corrupted worker executable. The final source additionally statically links the
helper's CRT and includes an explicit Windows Rust 1.73 CI check.

The macOS verifier fixture now links its 4 MiB padding as retained static data
instead of appending an overlay that codesign rejects. Every existing verifier
assertion is preserved. The changes to fixture construction and Windows cleanup
were authorized by the user's instruction to complete the first approach.

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
release gate. Diagnostic workflows are temporary; their instrumented binaries do not count
as final release evidence.

## Bounded verification batches (2026-09-24)

[Comparison run 35948542616](https://github.com/swc-project/swc/actions/runs/35948542616)
compared the existing 1 MiB batches against batches bounded at 32 MiB. Both read
and hash every byte. Avoiding repeated worker dispatch reduced Rosetta Node 22
core overhead from 282.28/28.61 ms to 42.25/20.77 ms, and HTML overhead from
127.03/74.73 ms to 93.45/10.57 ms. Both optimized diagnostic jobs passed the
unchanged 100/25 ms gates. Disabling zstd assembly was not retained.

The final implementation includes corruption and irregular-read tests around
32 MiB, executed as native ARM64 and actual Rosetta x64 test binaries. All three
private crate suites, full clippy, native JS tests, core binding build/tests,
and macOS/Linux Rust 1.73 suites passed locally. The earlier diagnostic results
above remain historical evidence, not acceptance for the final source.

## Exact-source release verification: remaining failures

[Full verification run 35949055402](https://github.com/swc-project/swc/actions/runs/35949055402)
built source bfc1095d7a with publishing and tag creation disabled. After retrying
one external wasm-pack installer segmentation fault, all 48 artifact builds,
all four npm assembly jobs, and all five minimum-Node checks passed. Linux
GNU/musl and native macOS ARM64 runtime jobs passed. The final gate did not run:
eight Windows x64 jobs, one Windows ARM64 job, and seven Rosetta jobs failed.

Windows failures exposed drive-letter tar parsing, default elevated-token file
ownership, and test setup that Rstest did not inherit into inline projects.
Tarballs now travel through tar's stdin, new private files explicitly name the
current user's SID as owner, and each Rstest project installs the diagnostics.
Existing files still require exact ownership and safe DACL/reparse properties.
[Lifecycle run 35953122812](https://github.com/swc-project/swc/actions/runs/35953122812)
passed all four hosts, including Windows Rust 1.73 and portable tarball tests.

Rosetta core reported cold/warm overhead of 197.62/67.92 ms on Node 20 and
238.30/81.05 ms on Node 22. These failures supersede the earlier passing focused
diagnostics; release acceptance remains unsatisfied.

Subsequent Windows profiles separate cache preparation from DLL loading.
Enabling NTFS compression before decoding avoids the expensive rewrite of an
already populated file: HTML cache preparation is approximately 40 ms and core
approximately 80 ms. However, the first LoadLibrary call still dominates their
cold measurements. Focused diagnostics are checking filesystem compression and
volume placement before any further implementation or measurement change.
Neither these profiles nor a cancelled diagnostic run is passing release evidence.

## Follow-up measurements and current decision points

Fresh raw baseline files now use the same home/cache volume as extracted files.
Windows runners place checkout and home on different drives; comparing their
first-load times confounded loader overhead with volume behavior. The copying
remains outside the timer, and all reports still use 15-sample medians.

[Windows comparison 35954368485](https://github.com/swc-project/swc/actions/runs/35954368485)
measured HTML at 468.19/5.53 ms cold/warm overhead with NTFS compression and
92.20/8.74 ms without it, using the same home volume. Uncompressed core measured
-122.95/16.03 ms. Negative cold overhead reflects variation in first native
loading, not a claim that verification is free. These are diagnostic variants:
production still enables NTFS compression, pending the requested decision about
changing this existing cache behavior and its test contract.

The successful initialization path now resolves native exception helpers only
if an error occurs. All three private crate suites, Rust 1.73 checks, full
clippy, and core build/tests passed locally after this change.

[Latest lifecycle run 35960471029](https://github.com/swc-project/swc/actions/runs/35960471029)
passed all four hosts at source dcc20b4b19: Windows x64/ARM64, Linux x64,
and macOS ARM64. This checks the current production implementation, including
Windows Rust 1.73, NTFS compression, cleanup, portable tarballs, and APFS/btrfs
replacement. This carrier-only dispatch does not run the release performance
gate and publishes no packages or tags.

[Rosetta worker experiment 35957275680](https://github.com/swc-project/swc/actions/runs/35957275680)
kept Node and the actual addon under Rosetta, while a native ARM process decoded
and verified complete images. Minifier passed at 60.01/16.22 ms, but core failed
at 197.86/34.17 ms. This is an incomplete prototype, with a prebuilt helper at
a checkout path; it is not a self-contained shipping implementation. Its result
does not establish acceptance.

[Parallel worker experiment 35958141560](https://github.com/swc-project/swc/actions/runs/35958141560)
also failed core: the original encoding measured -69.51/64.36 ms and faster
encoding measured 26.68/48.38 ms. Minifier passed at 50.67/23.43 ms. In addition,
locally installing a fresh helper executable before each verification added a
median of about 142 ms including its first execution and verification. The
preinstalled-helper prototype omits this deployment cost and will not ship.
Its scripts have been removed; the historical source is retained in Git.

[Direct mapped-file experiment 35959107897](https://github.com/swc-project/swc/actions/runs/35959107897)
also failed core on Node 22. Serial verification measured 181.59/68.37 ms and
parallel verification measured 232.41/74.87 ms. The local prototype passed the
three private crate suites and measured approximately 7 ms warm overhead, but
the CI failures take precedence. Direct mapping is not adopted in production.

Further isolated ARM mapping experiments also failed core on Node 22:

| Run | Variant | Cold overhead (ms) | Warm overhead (ms) |
| --- | --- | ---: | ---: |
| [35960382089](https://github.com/swc-project/swc/actions/runs/35960382089) | Serial native mapping | 105.90 | 40.70 |
| [35960382089](https://github.com/swc-project/swc/actions/runs/35960382089) | Serial mapping with user-initiated scheduling | 535.60 | 51.52 |
| [35960712691](https://github.com/swc-project/swc/actions/runs/35960712691) | Parallel mapping with user-initiated scheduling | 13.19 | 36.61 |
| [35960964263](https://github.com/swc-project/swc/actions/runs/35960964263) | Calling worker participates in parallel mapping | 105.00 | 48.43 |

None is adopted. No ARM helper asset or mapped-file verification has been added
to the production implementation. Their temporary instrumentation is removed.
[Uninstrumented comparison 35961800265](https://github.com/swc-project/swc/actions/runs/35961800265)
failed core on Node 22 both with retained samples (219.35/62.05 ms) and with
completed cold samples removed after each iteration (152.68/69.23 ms). Cleanup
bounded temporary storage at about 85 MB instead of growing to 884 MB, but did
not satisfy the latency budgets. Neither host swapped during measurement.
The production measurement lifecycle remains unchanged. Run 35961538261 was
cancelled during building, before any measurements, and superseded by this
uninstrumented comparison.

[Caller participation comparison 35963772315](https://github.com/swc-project/swc/actions/runs/35963772315)
tested an isolated caller-owned verification pool with faster payload encoding,
using the unchanged 15-sample harness and no Rust timing instrumentation.
Ordinary reads measured -234.29/79.98 ms cold/warm overhead; mapped reads measured
233.80/64.75 ms. Both failed. A local mapped prototype passed the private crate
suites, actual Rosetta cache/integrity tests, and a failed Node worker
initialization followed by a main-thread retry. Its local 28.57/7.46 ms timings
do not supersede the CI failures. Neither caller-owned scheduling nor mapped
verification nor faster encoding has been adopted.

## Scope decisions still pending

- Keeping compressed macOS x64 carriers has not met the unchanged performance
  budgets on CI. Shipping the original macOS x64 images is an alternative, not
  an implemented or verified fix. Based on the last full run's 32 selected
  artifact reports, that substitution would retain approximately 54.90% total
  size reduction across those 32 artifacts, versus 62.57% with all carriers.
  This calculation excludes the other 16 builds and is not a new gate result.
- Disabling NTFS compression for Windows runtime cache images passed focused
  measurements, but changes the existing compressed-cache test contract. It is
  not implemented pending explicit authorization. npm payload compression and
  complete runtime integrity verification would remain required.

Any approved implementation must pass a new exact-source release workflow,
including all runtime/minimum-Node jobs and the final gate, before acceptance.
