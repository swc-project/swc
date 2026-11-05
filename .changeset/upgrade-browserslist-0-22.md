---
preset_env_base: major
swc_core: major
---

chore(es/preset-env): Upgrade browserslist-rs to 0.22.0

Update browser data, improve usage-query precision, and reduce feature-query initialization overhead. Disable the default `local` feature so date-sensitive queries use UTC instead of the local time zone, without enabling Chrono's `clock` feature through browserslist-rs.

`BrowserData::parse_versions`, including its re-exports, now accepts `Distrib` values from browserslist-rs 0.22 instead of 0.21.
