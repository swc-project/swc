---
swc: minor
swc_core: minor
---

feat(es/loader): add opt-in Yarn Plug'n'Play resolver to `swc_ecma_loader`. Reads the JSON manifest variant `.pnp.data.json` (emitted when Yarn `pnpEnableInlining: false` is set), avoiding the need to execute `.pnp.cjs` JS in the Rust host.
