---
swc_core: patch
---

perf(bindings): Prefer zstd for btrfs native addon replacement when already enabled on the filesystem, with feature-gated lzo and baseline zlib fallbacks. Preserve compatibility with older kernels by never enabling new filesystem compression features.
