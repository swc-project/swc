# Native release CI repair status — updated 2026-09-24

Release acceptance is **not satisfied** pending a new full verification run.
The approved startup overhead budgets are now 500 ms cold and 125 ms warm,
and macOS x64 still runs under Rosetta. No npm package or release tag was
published by these verification runs. Earlier results below used 100/25 ms
budgets and retain their original pass/fail outcomes.

The latest full run at 98f1ecac0b passed all Windows checks after disabling NTFS
compression for new cache images. It passed 63/64 runtime jobs; Rosetta core
Node 20 exceeded the warm budget at 103.34 ms. A new complete verification is
required after fixing the remaining Rosetta warm-load failure. Temporary diagnostic
comparisons below are not release acceptance evidence.

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

## Alternatives considered before revising the startup budget

- Keeping compressed macOS x64 carriers did not meet the original performance
  budgets on CI. Shipping the original macOS x64 images is an alternative, not
  an implemented or verified fix. Based on the last full run's 32 selected
  artifact reports, that substitution would retain approximately 54.90% total
  size reduction across those 32 artifacts, versus 62.57% with all carriers.
  This calculation excludes the other 16 builds and is not a new gate result.
- Disabling NTFS compression for Windows runtime cache images passed focused
  measurements, but changes the existing compressed-cache test contract. It is
  approved in the follow-up below. npm payload compression and
  complete runtime integrity verification would remain required.

## Approved startup budget revision (2026-09-24)

The maintainer accepted the measured startup cost and explicitly selected
500 ms cold / 100 ms warm overhead. The shared runtime/final gate now enforces
those limits for the existing x64 target scope, with boundary and rejection
coverage for macOS, Windows, GNU, and musl. The gate JSON and summary disclose
the limits alongside measured timings. The 15-sample medians, fresh cold raw
copies, complete integrity verification, compressed carriers, NTFS cache
compression, and Rosetta execution remain unchanged. No raw fallback or
unsuccessful optimization prototype is adopted.

## Full verification under 500/100 ms budgets

[Run 35982132217](https://github.com/swc-project/swc/actions/runs/35982132217)
tested source deb4b9689b. All 48 builds, four npm assembly jobs, five minimum-Node
checks, and four platform lifecycle jobs passed. Runtime checks passed 61 of 64
jobs, including all eight Rosetta jobs. Rosetta core measured 84.05/75.70 ms
cold/warm overhead on Node 20 and 177.57/62.20 ms on Node 22. All 201 standard
PR checks also passed at this source.

Three Windows x64 jobs failed the 500 ms cold budget after passing package
loading and image-integrity checks:

| Product | Node | Cold overhead (ms) | Warm overhead (ms) |
| --- | --- | ---: | ---: |
| core | 20 | 1517.92 | 16.10 |
| core | 22 | 1123.64 | 16.53 |
| html | 22 | 635.45 | 9.23 |

The final release gate was skipped. A preceding run was cancelled during builds
after an unused wasm-pack installer crashed on Windows. Native build jobs now
omit that installer; the separate WASM publishing job retains it. The Rust
installation action also uses a commit retained in upstream master history,
with explicit toolchain inputs preserving the previous installer behavior.

## Approved Windows cache policy follow-up

The maintainer approved ordinary Windows cache images while retaining the
500/100 ms budgets, npm zstd carriers, and full integrity verification. New
persistent and temporary images clear inherited NTFS compression through their
existing private write handles before decoding. Existing compressed images
remain immutable on verified hits; corruption triggers replacement with an
ordinary image. Ownership, DACL, reparse-point, and digest checks are unchanged.

The existing NTFS fixture now constructs a legacy compressed entry and retains
its compression/integrity assertions. Additional fixtures cover ordinary and
compressed cache roots, compressed-entry corruption after a successful hit, and
process-local images beneath a compressed root. The complete release workflow
must pass again for the new source before acceptance.

## Full verification after the Windows cache change

[Run 35988753734](https://github.com/swc-project/swc/actions/runs/35988753734)
tested source 98f1ecac0b. All 48 builds, four npm assemblies, five minimum-Node
checks, four lifecycle jobs, and 63/64 runtime jobs passed. All 201 standard PR
checks also passed. Windows core cold/warm overhead was 146.27/16.67 ms on
Node 20 and 124.33/13.99 ms on Node 22; HTML Node 22 passed at 135.61/7.02 ms.

Rosetta core Node 20 passed cold at 132.97 ms but failed warm at 103.34 ms.
Node 22 passed at 197.77/66.71 ms. The final release gate was skipped. No failed
performance job was rerun to obtain a passing result.

## Streaming verification within one worker task

[Scheduling comparison 35995040990](https://github.com/swc-project/swc/actions/runs/35995040990)
compared unchanged code, two workers, and sequential hashing on each host.
Warm overhead on Node 20 was 26.41/28.17/42.00 ms; on Node 22 it was
47.35/28.54/45.77 ms. Neither reducing workers nor sequential hashing gave a
consistent improvement, so those alternatives are not adopted.

Local x64 profiling separated file reading from hashing. Keeping the entire
file verification loop within one worker task allowed a reusable 1 MiB buffer
without repeatedly dispatching from the calling thread. Median verification
time fell from 8.97 ms to 5.48 ms with identical bytes and digests. The prototype passed local private-crate, MSRV, clippy, core binding, and
actual Rosetta cache/integrity tests, including corruption across streaming
boundaries. These local results do not establish a CI performance improvement.

[Comparison 35996139123](https://github.com/swc-project/swc/actions/runs/35996139123)
compared unchanged and streamed verification on each Rosetta host using the
production 15-sample measurement and 500/100 ms gates. Both passed the budgets,
but warm overhead regressed from 32.39 to 42.06 ms on Node 20 and from 29.43 to
33.42 ms on Node 22. The streamed verification prototype and its added test
fixture were reverted; it is not adopted. The production verification code is
unchanged from the full run at 98f1ecac0b.

## Native loading flags comparison

Node 20 defaults to `RTLD_LAZY` on POSIX, while the carrier explicitly uses
`RTLD_NOW`. [Comparison 35998148201](https://github.com/swc-project/swc/actions/runs/35998148201)
tested that flag alone on each Rosetta host. Node 20 warm overhead increased
from 29.15 to 33.61 ms; Node 22 decreased from 39.42 to 29.46 ms. Local Node 20
measurements also increased from 9.38 to 10.50 ms. The inconsistent result does
not justify changing the production loader's symbol resolution behavior.

The temporary comparison workflow and scripts have been removed. None of the
scheduling, streaming, or lazy-loading candidates is shipped. The latest full
release evidence remains the 63/64 result at 98f1ecac0b, including the 103.34 ms
Rosetta warm failure under the then-current 500/100 ms limits; no full release
gate has passed for this repair.

## Approved warm budget adjustment

The maintainer approved a 125 ms warm overhead limit while retaining the
500 ms cold limit. Runtime validation and the final release gate share this
policy, including the budgets written to the gate report. Boundary tests accept
125 ms and reject 126 ms for every representative x64 target. The 15-sample
medians, raw baselines, Rosetta coverage, compressed npm carriers, and full-byte
integrity checks are unchanged.

The earlier 103.34 ms result remains a failure of its original 100 ms gate.
Release acceptance requires a new complete verification of the updated source
with publishing disabled; historical reports are not reclassified as passing.
