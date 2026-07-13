---
swc: minor
swc_core: minor
---

feat(es/modules): add `auto_module_id` flag and `[name]`/`[path]` template placeholders to `amd::Config.module_id`. Mirrors TypeScript `--outFile` behavior so AMD modules can derive named ids from their source path instead of emitting anonymous `define([...], function(...) {...})`.
