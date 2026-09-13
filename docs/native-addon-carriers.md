# Native addon carriers

`@swc/core`, `@swc/html`, `@swc/minifier`, and `@swc/react-compiler`
ship a single self-loading, zstd-compressed `.node` file on the targets below.
The existing package names, native filenames, optional platform dependencies,
JavaScript loaders, exports, and Node engine declarations remain unchanged.
Standalone `swc` executables and WASM packages are not compressed by this step.

| System     | Carriers                                              | Existing raw addons                                                                   |
| ---------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------- |
| macOS      | x86_64-apple-darwin, aarch64-apple-darwin             | —                                                                                     |
| Windows    | x86_64-pc-windows-msvc, aarch64-pc-windows-msvc       | i686-pc-windows-msvc                                                                  |
| Linux GNU  | x86_64-unknown-linux-gnu, aarch64-unknown-linux-gnu   | armv7-unknown-linux-gnueabihf, powerpc64le-unknown-linux-gnu, s390x-unknown-linux-gnu |
| Linux musl | x86_64-unknown-linux-musl, aarch64-unknown-linux-musl | —                                                                                     |

## First load and cache

The native carrier decodes the original stripped addon, verifies its length,
native image format, and SHA-512 digest, and forwards native registration to
that verified image. Materialized bytes are identical to the stripped build
input. Corrupt payloads and materialization failures produce actionable
`ERR_SWC_NATIVE_*` errors.

The default cache is isolated by user and addressed by the raw image's SHA-512.
It uses the existing private loader's user-cache root: an absolute
`XDG_CACHE_HOME` when available on Unix, otherwise the user's cache directory
(`~/Library/Caches` on macOS or `~/.cache` on Linux), and
`LOCALAPPDATA/swc` on Windows. Files live under
`swc-native-<effective UID or user SID>/v1/`. Cache hits are verified before
loading. Unique staging files, locks, and atomic replacement prevent concurrent
first loads from observing partially written images. Corrupt regular cache
entries are repaired from the verified payload.

`SWC_NATIVE_BINDING_CACHE` is the only carrier runtime control:

| Value                | Behavior                                                                                                                                                                   |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unset or empty       | Use the default user cache and eligible filesystem replacement.                                                                                                            |
| `0`                  | Materialize a unique temporary image; never replace the installed carrier. Unix unlinks it after loading; Windows retains a delete-on-close handle until process teardown. |
| Absolute directory   | Use this cache root, falling back to the default user cache if unusable.                                                                                                   |
| Other relative value | Throw a configuration error.                                                                                                                                               |

Failure of both a custom root and the default root throws. An executable cache
filesystem is required; a Linux `noexec` cache is rejected. Existing cache
namespaces retain at most three inactive-or-current raw images.

On writable APFS or btrfs, the loader may atomically replace its installed
carrier with the original addon under transparent filesystem compression.
The current process loads a separate verified temporary image. Read-only,
hardlinked, unsupported, or unsuitable installations use the cache. Windows
keeps the carrier DLL in place and requests NTFS compression on decoded cache
files. The sibling CLI is never part of materialization or replacement.

## Release verification

The existing raw napi-rs build finishes first, including its final strip steps.
The finalizer packs that exact input at zstd level 16, builds a carrier in a
temporary location, finishes carrier strip/signing, and verifies the completed
native image. Only then does a same-filesystem atomic operation replace the
selected addon. Failure or a carrier at least as large as the raw input fails
the build. Excluded addons stay on their existing raw path.

Reports are separate CI artifacts, never npm compression sidecars. Each record
binds the release version, build type, source commit, product, target, native
filename, raw SHA-512, final SHA-512, and any existing CLI hashes.

One shared release gate requires all 48 artifacts: 32 valid carriers and 16
unchanged raw addons. It revalidates the exact npm tarball contents after
assembly and prepack, requires each carrier to be smaller, and requires
`sum(carrier bytes) <= sum(selected raw bytes) / 2`. Missing runtime checks,
missing reports, duplicate targets, hash mismatches, and raw substitutions stop
publication. Publishing consumes those exact verified tarballs with lifecycle
scripts disabled. Verification-only runs never publish.

The job summary and JSON artifacts report raw size, compressed frame size,
payload size (including its 96-byte header), carrier size, reduction ratio, npm
tarball size, and load timings. Timings are medians of 15 fresh Node processes
per case, measured around package loading. Cold means an empty materialization
cache; warm means an already populated verified cache. These are not claims
about an empty operating-system page cache. Disposable hardlinked carrier
copies prevent filesystem self-replacement from disguising warm-cache costs.
Representative x64 jobs require at most 100 ms cold overhead and 25 ms warm
overhead over the corresponding raw addon.

Node 20/22 checks exercise every selected target through product tests and
installed tarball resolution. Standalone smoke scripts also exercise Linux GNU
x64 at core's Node 10.0.0 boundary, HTML/minifier's issue-requested 14.0.0
boundary, minifier's declared 12.0.0 boundary, and React Compiler's 20.0.0
boundary. Tooling uses modern Node independently of those test subprocesses.
Actual native file loading is checked so another addon or WASM fallback cannot
hide a carrier failure. Native APFS, btrfs, and Windows lifecycle checks are
required before release activation; a cross-target Rust check alone is not
native execution evidence.

## Local checks

Initialize submodules before validation:

```sh
git submodule update --init --recursive
node --test scripts/native/*.test.mjs
cargo test -p swc_native_addon -p swc_native_addon_pack -p binding_native_addon
python3 crates/swc_native_addon/scripts/msrv.py
cargo fmt --all
cargo clippy --all --all-targets -- -D warnings
```

Build and test each affected native product through its package scripts, and
run `(cd packages/core && pnpm build:dev && pnpm test)`. The
[private implementation guide](../crates/swc_native_addon/README.md) lists the
explicit filesystem tests and minimum-Node fixture command. Report unavailable
commands with their actual missing host, filesystem, tool, or credential reason.
Npm minor changesets and synchronized versioning are managed externally.

See the [integration verification record](native-addon-carriers-verification.md)
for observed local measurements, failed acceptance checks, and unavailable hosts.
