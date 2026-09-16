---
preset_env_base: major
swc_core: major
---

perf(es/preset-env): Reduce binary size by upgrading browserslist-rs to 0.21.2 with deflate enabled.

The public `BrowserData::parse_versions` API now accepts `browserslist::Distrib` from browserslist-rs 0.21 instead of 0.20, including through the `swc_core::ecma::preset_env` re-export.
