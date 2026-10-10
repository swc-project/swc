---
swc_core: patch
---

fix(bindings): Fall back to the system temporary directory when the Unix user cache root fails its security checks, instead of failing to load the native binding.
