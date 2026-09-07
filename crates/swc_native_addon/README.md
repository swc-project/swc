# Private native addon carriers

This foundation packages an already stripped native addon into a single target
carrier. It is private implementation support for issue #12273, not an npm
publishing switch. The existing raw addon build, generated JS/DTS, package names,
and sibling `swc` executable are not changed.

## Build contract

Run the host packer **after the final raw-addon strip/signing steps**:

```sh
cargo run -p swc_native_addon_pack -- \
  --input /absolute/final-stripped.node --output /absolute/payload.swcn \
  --target x86_64-unknown-linux-gnu
SWC_NATIVE_BINDING_PAYLOAD=/absolute/payload.swcn \
  cargo build -p binding_native_addon --release --features embedded-payload \
  --target x86_64-unknown-linux-gnu
```

`SWC_NATIVE_BINDING_PAYLOAD` is a build input, not a runtime cache setting.
The packer records the carrier target, and the build script requires it to match
Cargo's `TARGET` before validating and snapshotting it into `OUT_DIR`. Without the explicit
feature, the crate can participate in workspace checks but has no usable payload;
loading that development carrier throws an error. An enabled build without a
valid payload fails. No unpublished napi-rs dependency is needed.

The carrier allowlist is x86_64/aarch64 on Apple Darwin, Windows MSVC, and Linux
GNU/musl. Other npm targets stay raw. Future release integration must stage,
strip/sign, validate, and size-check the completed carrier before atomically
replacing only the selected `.node` artifact. A carrier that is not smaller than
the stripped addon must fail that integration step. Never strip or otherwise
modify the raw bytes after packing them.

## Version 1 format

All integers are little-endian, independent of Rust layout and target byte order.

| Offset | Bytes | Field |
| --- | --- | --- |
| 0 | 8 | ASCII `SWCNZSTD` |
| 8 | 2 | Version, `1` |
| 10 | 2 | Header size, `96` |
| 12 | 1 | Supported carrier target identifier |
| 13 | 3 | Reserved, all zero |
| 16 | 8 | Exact compressed frame length |
| 24 | 8 | Exact raw addon length |
| 32 | 64 | SHA-512 of the raw addon |
| 96 | variable | One level-16 zstd frame |

Both lengths must be nonzero and at most 2 GiB. The zstd frame must declare the
same raw size and cannot use a dictionary, skippable frame, concatenated frames,
or trailing bytes. Decoding bounds the window by the declared output size and
streams through a fixed-size buffer; it never reserves the claimed raw size up
front. Length, digest, and native magic validation finish before publication.
ELF/Mach-O magic is checked, and PE requires a bounded DOS offset and `PE\0\0`
signature, not merely `MZ`. The OS loader remains responsible for complete image
format, architecture, dynamic dependencies, and signing validation.

The digest proves equality with the trusted installed carrier's raw addon. It
does not authenticate an untrusted carrier or defend against a process with the
same user's ability to modify arbitrary code files. Corrupt cache contents are
never treated as executable code merely because their filename is a digest.

## Runtime and cache

The carrier resolves its own image using `dladdr` on Unix and
`GetModuleHandleExW`/`GetModuleFileNameW` on Windows. Payload bytes come from the
mapped image, not a pathname that another process might have replaced already.
No N-API 9 path API is used. Only original N-API error functions are required, and
the advertised N-API version is 3, matching the existing bindings. Package Node
minimums remain core 10, minifier 12, HTML 14, and React Compiler 20.

Node 10.0 also needs the original constructor-based `napi_module_register` hook;
exporting `napi_register_module_v1` alone is insufficient on that runtime. The
constructor only registers a static descriptor. It does no decoding or file IO,
and the normal initializer still forwards the exact raw registration call.

The raw initializer receives the original environment and exports pointers. Its
result is returned unchanged, including a distinct exports object or null with a
pending exception. Initialization failures throw `ERR_SWC_NATIVE_*` errors with
operation/path context and remediation; they do not return empty exports. Loaded
libraries remain resident for the process lifetime because callbacks can outlive
registration or any one Node environment. Initialization locks are released
before invoking addon registration.

`SWC_NATIVE_BINDING_CACHE` is the **only runtime cache control**:

| Value | Behavior |
| --- | --- |
| Unset or empty | User-isolated, content-addressed user cache |
| `0` | Temporary materialization only in the user cache; never self-replace the carrier |
| Absolute directory | Custom root; fall back to the user cache if unusable |
| Any other relative value | Throw a configuration error |

The default user cache avoids hardened system temporary mounts that are `noexec`;
Linux rejects a user cache mounted `noexec` before attempting to load from it.
Under either persistent root, entries live in `swc-native-<effective UID or user
SID>/v1/<128 hexadecimal SHA-512 digits>.node`. Unix directories are owner-only;
Windows directories have protected owner/SYSTEM DACLs. Unsafe cache files,
symlinks/reparse points, and Unix roots with a non-sticky cross-user-writable
ancestor are rejected. A normal corrupt regular entry is replaced
with newly decoded, verified bytes. If both custom and default roots fail, the
loader throws rather than silently loading unverified data.

Every cache hit is checked for native magic, length, and SHA-512. Per-digest OS
file locks coordinate checking, repair, publication, and native loading. Writers
use unique staging files in the destination directory, flush and verify them,
then rename atomically. Canonical entries are never truncated in place. Closing
the lock handle releases coordination after failures or process death, without
stale PID locks. Staging files abandoned by abrupt termination are never cache
hits; they may be removed when the owning user cleans the temporary directory.

In mode `0`, each materialization has a unique process-prefixed filename. Unix
unlinks it after successful `dlopen` while retaining the mapped library. Windows
closes the writable decoder handle before loading and retains a noninheritable
delete-on-close handle until process teardown. This avoids relying on Rust
destructors running at exit. Native Windows subprocess tests must verify this
lifecycle before release activation.

## Transparent filesystem compression

On writable APFS/btrfs, persistent modes first try self-replacement. Only a
completed compressed staging file beside the carrier is atomically renamed into
place. The original mapped inode is never modified. The current process loads a
separate verified temporary image, avoiding recursive lookup of the already
mapped carrier. Competing first loads lock the original inode and recheck its
identity before replacement. Hardlinked or differently owned images use the
cache path instead. Package-manager updates do not participate in these advisory
locks, so replacement remains a best-effort optimization of a stable installation.

APFS uses Apple's installed `/usr/bin/ditto --hfsCompression` on staging files,
then verifies transparent readback and `UF_COMPRESSED`. btrfs sets compression
policy and explicitly recompresses written extents; setting an inode flag alone
would not compress existing bytes. Unsupported/read-only filesystems and failed
compression fall back to the verified cache. The sibling CLI is never touched.
Replacement preserves ownership, permissions, and extended security attributes.
An already matching inherited security label is left alone; failure to preserve
a differing label disables replacement. Compression-specific resource metadata
is regenerated for the raw image instead of copied from the carrier.

Windows never replaces a loaded carrier DLL. It requests NTFS compression on the
decoded staging file before cache publication. Unsupported filesystem compression
does not prevent loading a verified ordinary cache file.

## Verification

```sh
git submodule update --init --recursive
cargo test -p swc_native_addon -p swc_native_addon_pack -p binding_native_addon
python3 crates/swc_native_addon/scripts/msrv.py
cargo fmt --all
cargo clippy --all --all-targets -- -D warnings
```

The MSRV script copies only these private components into a temporary workspace
and uses Rust 1.73 with the existing dependency versions. SWC's main workspace
uses a v4 lockfile and nightly flags, so those settings cannot directly serve as
the MSRV harness. The script leaves the repository lockfile and configuration
unchanged. Fixtures are compiled from Rust source and stripped during testing;
they are real native libraries, not byte arrays pretending to be addons.

Run the carrier smoke suite using each package minimum, for example:

```sh
SWC_TEST_NODE=/absolute/node-10.0.0/bin/node \
  cargo test -p binding_native_addon --test carrier
```

On matching hosts, explicitly run the filesystem tests:

```sh
SWC_TEST_VOLUME=/writable/apfs \
  cargo test -p swc_native_addon --test platform apfs_self_replacement -- --ignored --exact
SWC_TEST_VOLUME=/writable/btrfs \
  cargo test -p swc_native_addon --test platform btrfs_self_replacement -- --ignored --exact
cargo test -p swc_native_addon --test platform ntfs_compression -- --ignored --exact
```

Cross-target `cargo check` validates Rust adapters but cannot establish native
loading, signing, filesystem compression, or Windows deletion semantics. Report
those tests as unavailable, with the actual host/tool/filesystem reason, whenever
they cannot run. This implementation was written afresh; no PR #12000 or
MIT-licensed PoC implementation was copied.
The original Node.js registration-interface attribution is retained in
`bindings/binding_native_addon/NOTICE` and must accompany distributed carriers.

See [VERIFICATION.md](VERIFICATION.md) for the implementation run's results and
the native platform checks that still require matching hosts.
