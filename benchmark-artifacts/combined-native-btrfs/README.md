# Historical combined native payload and btrfs benchmark

These results measure the revisions listed below, before codec selection was
gated on existing filesystem features. They do not validate the current
feature-gated implementation. On a fresh filesystem without compression feature
bits, the current implementation selects zlib, not the measured zstd path.

The historical comparison measured **12.3% smaller complete carrier, 23.5%
faster first `require()`, 65.0% faster follow-up cold `require()`, and 1.7% less
btrfs allocated space** with the native-payload optimization and unconditional
btrfs zstd selection enabled together.

![Combined native-payload and btrfs benchmark](https://github.com/user-attachments/assets/f81189f2-dadb-40dd-9ba6-bbaefc3320ad)

Baseline: original payload encoder/decoder and zlib btrfs replacement. Combined: optimized payload implementation from `0a101c7041509ce3290f2cb8dba659c4c1ae03d1` and btrfs codec selection from `9e6f95aeb79b13d53a6614795d953bc5fa53b801`.

Tested `@swc/core-linux-arm64-gnu@1.16.2` on Linux ARM64, kernel 7.2.12, Node 18.20.4, using a fresh 512 MiB loopback btrfs filesystem. Eight alternating trials copied each carrier to btrfs and required it in a fresh Node process after evicting the file page cache. Each replacement was verified byte-for-byte against the original addon. The harness also recorded `compsize` allocated bytes and ran three fresh-process, page-cache-cold follow-up requires per trial.

| Metric | Baseline | Both changes | Improvement |
| --- | ---: | ---: | ---: |
| Complete carrier | 10.7 MB | 9.4 MB | 12.3% smaller |
| Allocated btrfs space after replacement | 14.2 MB | 14.0 MB | 1.7% less |
| First carrier `require()` | 284.6 ms | 217.7 ms | 23.5% faster |
| Follow-up cold `require()` | 61.8 ms | 21.6 ms | 65.0% faster |

`results.json` has the raw measurements; `summary.json` records the method and medians. Timing excludes Node process startup. `POSIX_FADV_DONTNEED` evicts the file page cache, while VM and host caches remain uncontrolled. This is a single Linux ARM64 VM measurement, not a cross-platform or end-to-end application benchmark. MB uses decimal units.

## Required follow-up for the feature-gated implementation

Rerun the current revision on both a volume without compression feature bits
and a volume where zstd was explicitly enabled before timing. Record
`BTRFS_IOC_GET_FEATURES` before and after each run, verify codec selection and
unchanged feature bits, and keep input, kernel, Node version, and cache handling
fixed. No such rerun is included in these artifacts; the numbers above must not
be used as performance claims for the feature-gated implementation.
