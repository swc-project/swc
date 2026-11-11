---
swc_core: patch
---

perf(bindings): Shrink large native addon payloads using zstd level 22 with bounded search tables and long-distance matching, within the existing decoder window limit.

Decode bounded full-history frames directly into their output buffer, then hash and write every byte in chunks to reduce decoding time and memory. Preserve streaming for larger images and legacy small-window frames.

Batch decoded output writes without another allocation, and reduce compression lookup-table memory.
