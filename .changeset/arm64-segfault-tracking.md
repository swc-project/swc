---
"@swc/core": patch
---

## Tracking ARM64 Segfault Issue in v1.13.21

### Issue Summary

Version v1.13.21 was published with corrupted or invalid native binaries for ARM64 platforms, causing segmentation faults on:
- AWS t4g.small (ARM64 Graviton)
- ubuntu-latest-arm on GitHub Actions
- core-darwin-arm64 (Apple Silicon)

Related issues:
- #11129 - v1.13.5 is the latest on npm because v1.13.21 is broken
- #11177 - v1.13.21 segfaults on ARM64 Graviton
- #11178 - Native binding issue on core-darwin-arm64

### Current Status

**Temporary Workaround Applied:**
- npm dist-tag has been set to v1.13.5 as the "latest" version
- Users experiencing segfaults should pin to v1.13.5 until a fix is released

### Root Cause Analysis

The investigation revealed that v1.13.21 contains:
1. The AST Viewer feature (`feat(bindings): Introduce AST Viewer (#10963)`) which was subsequently disabled in CI
2. ARM64/musl binary loading improvements (`fix(bindings): Improve ARM64 and Alpine Linux (musl) binary loading (#11173)`)
3. CI tests for `binding_es_ast_viewer` and `test-linux-aarch64-musl-binding` were disabled

The binary corruption appears to be related to the build/release pipeline rather than the Rust code itself, as evidenced by:
- The binaries have invalid code signatures on macOS
- Segmentation faults occur during binary loading, not during code execution
- The issue affects multiple ARM64 platforms consistently

### Proposed Resolution

1. **Immediate:** Keep v1.13.5 as npm latest (already done)
2. **Short-term:** Investigate CI/build pipeline for ARM64 binary generation
3. **Long-term:** Enhance CI validation to catch binary corruption before release

### For Users

If you're affected by ARM64 segfaults:

```bash
# Pin to working version
npm install @swc/core@1.13.5

# Or use the workaround environment variable
SWC_SKIP_VALIDATION=1 npm install @swc/core
```

### Next Steps

- Re-enable ARM64 musl testing in CI with proper validation
- Verify binary signing and packaging for ARM64/Darwin targets
- Consider bisecting commits between v1.13.5 and v1.13.21 to identify the exact regression
- Test with the nullish_coalescing compiler merge (currently on main but not released)
