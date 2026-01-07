# TC39 ECMA-426 Scopes Proposal Implementation

- Status: proposed
- Deciders: SWC Development Team
- Date: 2026-01-07

Technical Story: This ADR documents the design for implementing the TC39 ECMA-426 scopes proposal in SWC, which extends source maps to include scope information for improved debugging after code transformations.

## Context and Problem Statement

Modern JavaScript tooling performs aggressive optimizations like minification, inlining, tree-shaking, and dead code elimination. While these improve performance, they make debugging difficult because:

1. Variable names are changed or removed
2. Function boundaries are unclear after inlining
3. Scope hierarchies are lost
4. Debuggers cannot accurately show which variables are available at any point

The TC39 ECMA-426 scopes proposal extends source maps with scope information, enabling debuggers to provide accurate variable inspection even after aggressive transformations. How should SWC implement this specification while maintaining performance and compatibility with existing source map infrastructure?

## Decision Drivers

- **Zero-overhead when disabled**: No performance or binary size impact when scopes are not needed
- **Performance-first**: Minimal allocations, efficient encoding when enabled (target <5% overhead)
- **Leverage existing infrastructure**: Reuse SWC's Resolver and source map generation pipeline
- **Incremental integration**: Design for phased implementation without breaking existing functionality
- **Standards compliance**: Follow TC39 ECMA-426 specification exactly
- **Compatibility**: Work with existing source map consumers (ignore "scopes" field if not supported)

## Considered Options

### Option 1: External post-processing tool
Create a separate tool that analyzes SWC's output and AST to generate scopes information.

### Option 2: Integrated collection with separate encoding
Collect scope information during SWC's existing compilation pipeline and encode it as part of source map generation (chosen approach).

### Option 3: New visitor pass before resolver
Add scope collection as a pre-resolver pass, building entirely separate scope tracking infrastructure.

## Decision Outcome

Chosen option: **Option 2 - Integrated collection with separate encoding**, because:

1. Leverages existing Resolver infrastructure (already tracks scopes)
2. Integrates naturally into existing codegen pipeline
3. Allows feature flags for zero-overhead when disabled
4. Provides access to all transformation context needed for accurate mapping
5. Enables efficient scope-to-position mapping during code generation

### Positive Consequences

- Minimal code duplication (reuse Resolver's scope tracking)
- Natural integration points in compilation pipeline
- Feature-gated implementation ensures no impact when disabled
- Direct access to span information during both collection and generation
- Efficient memory usage by building scopes alongside existing compilation

### Negative Consequences

- Requires modifications to multiple crates (swc_common, swc_ecma_codegen, swc_ecma_transforms_base)
- Additional complexity in codegen phase
- Need to maintain scopes across transformation passes

## Implementation Design

### Architecture Overview

```
Parse → AST with Spans → Resolver → [ScopeCollector] → Transformations →
  Codegen + [RangeTracker] → Source Map + [Scopes Encoding]
```

The implementation consists of three new components:

1. **ScopeCollector** (crates/swc_sourcemap_scopes/src/collector.rs): Visitor that collects original scope information during/after resolver pass
2. **RangeTracker** (crates/swc_sourcemap_scopes/src/range_tracker.rs): Tracks generated code ranges during codegen
3. **ScopesEncoder** (crates/swc_sourcemap_scopes/src/encode.rs): VLQ encoder for the "scopes" source map field

### Data Structures

**Original Scopes** (from source code):
```rust
pub struct OriginalScope {
    pub span: Span,              // Position in source
    pub name: Option<Atom>,      // e.g., function name
    pub kind: ScopeKind,         // Global/Function/Class/Block
    pub is_stack_frame: bool,    // Callable function?
    pub variables: Vec<Atom>,    // Declared variables
    pub children: Vec<OriginalScope>,
}

pub enum ScopeKind {
    Global, Function, Class, Block
}
```

**Generated Ranges** (from compiled output):
```rust
pub struct GeneratedRange {
    pub start: LineCol,
    pub end: LineCol,
    pub is_stack_frame: bool,
    pub is_hidden: bool,         // Hide from stack traces
    pub original_scope: Option<u32>,  // Index to original scope
    pub callsite: Option<Callsite>,   // For inlined functions
    pub bindings: Vec<Binding>,
    pub children: Vec<GeneratedRange>,
}
```

### VLQ Encoding Format

The scopes are encoded using Variable-Length Quantity (VLQ) with tags:

| Tag | Purpose | Format |
|-----|---------|--------|
| B (0x1) | Original scope start | `B uFLAGS uLINE uCOLUMN [sNAME] [sKIND]` |
| C (0x2) | Original scope end | `C uLINE uCOLUMN` |
| D (0x3) | Scope variables | `D uCOUNT sVAR1 sVAR2 ...` |
| E (0x4) | Generated range start | `E uFLAGS [uLINE] uCOLUMN [sDEF]` |
| F (0x5) | Generated range end | `F [uLINE] uCOLUMN` |
| G (0x6) | Simple bindings | `G sBIND1 sBIND2 ...` |

All positions are delta-encoded relative to previous occurrences of the same type.

### Integration Points

**1. Scope Collection (After Resolver):**
```rust
let mut passes = chain!(
    resolver(unresolved_mark, top_level_mark, false),

    // NEW: Optional scope collection
    #[cfg(feature = "sourcemap-scopes")]
    optional_pass(
        config.enable_scopes(),
        scope_collector_pass()
    ),

    // Existing transforms...
);
```

**2. Range Tracking (During Codegen):**
```rust
impl Emitter {
    fn emit_function(&mut self, n: &Function) -> Result {
        #[cfg(feature = "sourcemap-scopes")]
        if let Some(tracker) = &mut self.range_tracker {
            tracker.start_range(
                self.wr.current_pos(),
                self.lookup_original_scope(n.span),
                true  // is_stack_frame
            );
        }

        // ... emit function code ...

        #[cfg(feature = "sourcemap-scopes")]
        if let Some(tracker) = &mut self.range_tracker {
            tracker.end_range(self.wr.current_pos());
        }
    }
}
```

**3. Encoding (During Source Map Building):**
```rust
#[cfg(feature = "sourcemap-scopes")]
pub fn build_source_map_with_scopes(
    files: &impl Files,
    mappings: &[(BytePos, LineCol)],
    config: &impl SourceMapGenConfig,
    scopes_data: ScopesData,
) -> swc_sourcemap::SourceMap {
    let mut map = build_source_map(files, mappings, None, config);
    let scopes_string = encode_scopes(&scopes_data)?;
    map.set_scopes(scopes_string);
    map
}
```

### Performance Considerations

**Zero-Overhead Strategy:**
- Feature flag `sourcemap-scopes` for conditional compilation
- Zero-size types when feature is disabled
- Runtime boolean checks only when feature is enabled

**Memory Optimization:**
- Reuse existing Resolver scope data
- Use `Atom` for interned strings (names/kinds)
- Arena allocation for scope trees
- Estimated overhead: ~48 bytes per scope

**Encoding Optimization:**
- Delta encoding minimizes VLQ sizes
- Deduplication avoids duplicate ranges
- Streaming encoder (no intermediate buffers)
- Target: <1ms per 1000 scopes

### Testing Strategy

**Unit Tests:**
- VLQ encoding/decoding correctness
- Scope collection for all scope types (function, arrow, class, block)
- Variable declaration tracking (var, let, const, parameters)
- Range tracking and nesting

**Integration Tests:**
- End-to-end: Parse → Transform → Codegen → Encode
- Minification with variable renaming
- Multiple source files
- Edge cases: empty scopes, dummy spans

**Compatibility Tests:**
- Source Map v3 consumers can still parse maps
- Chrome DevTools debugging
- Existing tools ignore "scopes" field gracefully

## Implementation Phases

### Phase 1: Foundation (Weeks 1-2)
- Create `swc_sourcemap_scopes` crate
- Implement data structures (OriginalScope, GeneratedRange)
- Implement VLQ encoder with unit tests
- Add feature flags

**Files:**
- `crates/swc_sourcemap_scopes/Cargo.toml`
- `crates/swc_sourcemap_scopes/src/{lib,original,generated,encode}.rs`
- `crates/swc_sourcemap_scopes/tests/vlq_tests.rs`

### Phase 2: Scope Collection (Weeks 3-4)
- Implement ScopeCollector visitor
- Handle all scope types and variable declarations
- Integration tests for collection

**Files:**
- `crates/swc_sourcemap_scopes/src/collector.rs`
- `crates/swc_sourcemap_scopes/tests/collector_tests.rs`

### Phase 3: Range Tracking (Weeks 5-6)
- Implement RangeTracker
- Modify Emitter for range tracking
- Track function boundaries and scope nesting

**Files:**
- `crates/swc_sourcemap_scopes/src/range_tracker.rs`
- `crates/swc_ecma_codegen/src/lib.rs` (modifications)

### Phase 4: Encoding (Weeks 7-8)
- Implement full scopes encoding
- Integrate with build_source_map
- End-to-end tests

**Files:**
- `crates/swc_common/src/source_map.rs` (modifications)
- `crates/swc_sourcemap_scopes/tests/integration_tests.rs`

### Phase 5: Optimization & Polish (Weeks 9-10)
- Performance benchmarks
- Memory optimization
- Documentation and examples

### Phase 6: Advanced Features (Weeks 11-12)
- Variable binding tracking
- Callsite information (for inlining)
- Subrange bindings
- Real-world testing with debuggers

## API Design

### Configuration
```rust
pub enum SourceMapsConfig {
    Disabled,
    Enabled,
    #[cfg(feature = "sourcemap-scopes")]
    WithScopes,
}

pub trait SourceMapGenConfig {
    #[cfg(feature = "sourcemap-scopes")]
    fn enable_scopes(&self) -> bool { false }

    #[cfg(feature = "sourcemap-scopes")]
    fn scope_kind_name(&self, kind: ScopeKind) -> Option<&str>;
}
```

### Public API
```rust
// crates/swc_sourcemap_scopes/src/lib.rs
pub struct ScopesData {
    pub original_scopes: Vec<OriginalScope>,
    pub generated_ranges: Vec<GeneratedRange>,
    pub names: Vec<String>,
}

pub fn encode_scopes(data: &ScopesData) -> std::io::Result<String>;
```

## Open Questions

1. **Binding Expressions**: How to generate expressions for optimized variables?
   - Start with simple name mappings
   - May require tracking transformations more deeply in future

2. **Inlining Detection**: How to detect when functions are inlined?
   - Requires cooperation with optimization passes
   - May need new metadata on AST nodes

3. **TypeScript Integration**: How to handle TypeScript-specific scopes?
   - Namespaces, enums, type-only scopes
   - May need extended scope kinds

## Links

- [TC39 ECMA-426 Scopes Proposal](https://github.com/tc39/ecma426/blob/main/proposals/scopes.md)
- [ECMA-426 Specification](https://tc39.es/ecma426/)
- [Source Map v3 Specification](https://sourcemaps.info/spec.html)
- [Chrome DevTools Scopes Encoding](https://github.com/ChromeDevTools/sourcemap-scopes-encoding)
- [Reference Implementation](https://github.com/hbenl/tc39-proposal-scope-mapping)
- [SWC SourceMap Docs](https://rustdoc.swc.rs/swc_common/source_map/index.html)
- [swc_sourcemap Crate](https://docs.rs/swc_sourcemap)

## Appendix: Example

### Input JavaScript
```javascript
function outer(a, b) {
  let x = 1;
  function inner(c) {
    let y = 2;
    return a + x + y + c;
  }
  return inner(b);
}
```

### Source Map Output
```json
{
  "version": 3,
  "sources": ["input.js"],
  "names": ["outer", "a", "b", "x", "inner", "c", "y"],
  "mappings": "AAAA,SAASA,KAAM,CAACC,CAAC,CAAEC,CAAC...",
  "scopes": "BCAA,DCAA,BCCA,DCCA,CCCA,CCAA,ECAA,GCAA,..."
}
```

The "scopes" field contains VLQ-encoded scope information:
- B: Original scope start (outer function, line 0 col 0, name "outer")
- D: Variables in outer scope (a, b, x, inner)
- B: Original scope start (inner function, line 2 col 2, name "inner")
- D: Variables in inner scope (c, y)
- C: Original scope end (inner, line 4 col 2)
- C: Original scope end (outer, line 6 col 0)
- E: Generated range start (maps to outer scope)
- G: Bindings (maps generated vars to original)
- ... (more ranges and bindings)
