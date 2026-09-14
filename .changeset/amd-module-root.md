---
swc: major
swc_core: major
swc_ecma_transforms_module: major
---

feat(es/module): Support `moduleRoot` for AMD module IDs.

Derive AMD module IDs from the input path relative to `moduleRoot`, resolving relative roots against the `.swcrc` directory or programmatic base directory.

Rust callers must add `module_root` to exhaustive `amd::Config` initializers and pass `base_dir` to `ModuleConfig::get_resolver`. These API changes are also exposed through `swc_core`.
