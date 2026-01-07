# TC39 ECMA-426 Scopes Proposal - SWC Implementation Design

**Version:** 1.0
**Date:** 2026-01-07
**Status:** Design Phase
**Author:** SWC Development Team

## Executive Summary

This document outlines the design for implementing the TC39 ECMA-426 scopes proposal in SWC. The scopes proposal extends source maps to include scope information (variable bindings, function boundaries, scope hierarchies), enabling debuggers to provide accurate variable inspection even after aggressive optimizations like inlining, tree-shaking, and minification.

### Key Design Goals

1. **Zero-overhead when disabled**: Use feature flags to ensure no performance or binary size impact when scopes are not needed
2. **Minimal memory overhead**: Leverage existing SWC infrastructure (Resolver, SyntaxContext) to avoid duplicate scope tracking
3. **Performance-first**: Efficient data structures, minimal allocations, optimized VLQ encoding
4. **Incremental integration**: Design for phased implementation without breaking existing functionality
5. **Compatibility**: Work with existing source map generation infrastructure

---

## 1. Current SWC Source Map Architecture

### 1.1 Overview

SWC's source map implementation follows this flow:

```
Parse → AST with Spans → Transformations → Codegen → Source Map Generation
```

**Key Components:**

- **`swc_common::SourceMap`**: Manages source files and position tracking (`crates/swc_common/src/source_map.rs`)
- **`swc_sourcemap` crate**: External dependency (v9.3.4) providing source map v3 encoding/decoding
- **`JsWriter`**: Tracks generated positions during codegen (`crates/swc_ecma_codegen/src/text_writer/basic_impl.rs`)
- **`Emitter`**: Orchestrates code generation (`crates/swc_ecma_codegen/src/lib.rs`)

### 1.2 Position Tracking During Codegen

The `JsWriter` maintains:

```rust
pub struct JsWriter<'a, W: Write> {
    line_count: usize,              // Current output line (0-indexed)
    line_pos: usize,                // Current column (UTF-16 chars)
    srcmap: Option<&'a mut Vec<(BytePos, LineCol)>>,  // Mapping accumulator
    srcmap_done: HashSet<(BytePos, u32, u32)>,        // Deduplication
    // ... other fields
}
```

**Key Methods:**
- `add_srcmap(pos: BytePos)`: Records mapping from original BytePos to current output LineCol
- `update_pos(data: &str)`: Updates line_count/line_pos after writing text
- `srcmap(pos: BytePos)`: Core mapping logic with deduplication

**Source Map Building:**

After codegen, `SourceMap::build_source_map()` converts the `Vec<(BytePos, LineCol)>` into a `swc_sourcemap::SourceMap` with VLQ-encoded mappings.

```rust
// From crates/swc_common/src/source_map.rs:1289
pub fn build_source_map(
    files: &impl Files,
    mappings: &[(BytePos, LineCol)],
    orig: Option<swc_sourcemap::SourceMap>,
    config: &impl SourceMapGenConfig,
) -> swc_sourcemap::SourceMap
```

### 1.3 Scope Tracking Infrastructure

SWC already has comprehensive scope tracking via the **Resolver** pass:

**Location:** `crates/swc_ecma_transforms_base/src/resolver/mod.rs`

**Core Structures:**

```rust
struct Resolver<'a> {
    current: Scope<'a>,           // Current scope being processed
    ident_type: IdentType,        // Binding vs Reference
    decl_kind: DeclKind,          // var, let, const, param, function
    // ...
}

struct Scope<'a> {
    parent: Option<&'a Scope<'a>>,
    kind: ScopeKind,              // Fn or Block
    mark: Mark,                   // Unique identifier
    declared_symbols: FxHashMap<Atom, DeclKind>,
    // ...
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ScopeKind {
    Block,
    Fn,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum DeclKind {
    Lexical,   // let/const
    Param,
    Var,
    Function,
    Type,
}
```

**Key Insight:** The Resolver already builds a scope tree and tracks variable declarations. We can extend this to record scope information for source maps.

---

## 2. TC39 Scopes Proposal - Technical Specification

### 2.1 Original Scopes

Represents scopes in the authored source code:

```typescript
interface OriginalScope {
  start: { line: number; column: number };
  end: { line: number; column: number };
  name?: string;           // e.g., function name
  kind?: string;           // "global", "function", "class", "block"
  isStackFrame?: boolean;  // true for callable functions
  variables?: string[];    // declared variables
  children?: OriginalScope[];
}
```

### 2.2 Generated Ranges

Represents code locations in the compiled output:

```typescript
interface GeneratedRange {
  start: { line: number; column: number };
  end: { line: number; column: number };
  isStackFrame?: boolean;
  isHidden?: boolean;      // exclude from stack traces
  originalScope?: number;  // index into original scopes array
  callsite?: { sourceIndex: number; line: number; column: number };
  bindings?: BindingRange[];
  children?: GeneratedRange[];
}

interface BindingRange {
  name: string;            // variable name (from names array)
  expression?: string;     // how to compute value
  // subranges for partial availability
}
```

### 2.3 VLQ Encoding Format

The scopes data is encoded in a new `"scopes"` field in the source map JSON, using comma-separated VLQ items with tags:

| Tag | Hex  | Purpose | Format |
|-----|------|---------|--------|
| B   | 0x1  | Original scope start | `B uFLAGS uLINE uCOLUMN [sNAME] [sKIND]` |
| C   | 0x2  | Original scope end | `C uLINE uCOLUMN` |
| D   | 0x3  | Scope variables | `D uCOUNT sVAR1 sVAR2 ...` |
| E   | 0x4  | Generated range start | `E uFLAGS [uLINE] uCOLUMN [sDEFINITION]` |
| F   | 0x5  | Generated range end | `F [uLINE] uCOLUMN` |
| G   | 0x6  | Simple bindings | `G sBIND1 sBIND2 ...` |
| H   | 0x7  | Subrange binding | `H sVAR_IDX uCOUNT [pos expr]...` |
| I   | 0x8  | Callsite | `I uSOURCE uLINE uCOLUMN` |

**Encoding Details:**
- `u` prefix = unsigned VLQ
- `s` prefix = signed VLQ (delta-encoded)
- FLAGS are bit fields (0x1=has_name, 0x2=has_kind, 0x4=is_stack_frame, 0x8=is_hidden)
- Positions are delta-encoded relative to previous occurrences of the same type
- Variables/names reference the source map's "names" array (1-based, 0=unavailable)

---

## 3. Rust Data Structure Design

### 3.1 Original Scope Structures

```rust
// crates/swc_sourcemap_scopes/src/original.rs

use swc_common::{BytePos, Span};
use swc_atoms::Atom;

/// Represents a scope in the original source code
#[derive(Debug, Clone)]
pub struct OriginalScope {
    /// Span in the original source file
    pub span: Span,

    /// Optional name (e.g., function name)
    pub name: Option<Atom>,

    /// Scope kind: "global", "function", "class", "block"
    pub kind: ScopeKind,

    /// Whether this scope represents a stack frame (callable function)
    pub is_stack_frame: bool,

    /// Variables declared in this scope
    pub variables: Vec<Atom>,

    /// Child scopes
    pub children: Vec<OriginalScope>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ScopeKind {
    Global,
    Function,
    Class,
    Block,
}

impl From<swc_ecma_transforms_base::scope::ScopeKind> for ScopeKind {
    fn from(kind: swc_ecma_transforms_base::scope::ScopeKind) -> Self {
        match kind {
            swc_ecma_transforms_base::scope::ScopeKind::Fn => ScopeKind::Function,
            swc_ecma_transforms_base::scope::ScopeKind::Block => ScopeKind::Block,
        }
    }
}
```

### 3.2 Generated Range Structures

```rust
// crates/swc_sourcemap_scopes/src/generated.rs

use swc_common::source_map::LineCol;

/// Represents a range in the generated output
#[derive(Debug, Clone)]
pub struct GeneratedRange {
    /// Start position in generated code
    pub start: LineCol,

    /// End position in generated code
    pub end: LineCol,

    /// Whether this is a stack frame
    pub is_stack_frame: bool,

    /// Whether to hide from stack traces
    pub is_hidden: bool,

    /// Index to corresponding original scope
    pub original_scope: Option<u32>,

    /// Callsite information for inlined functions
    pub callsite: Option<Callsite>,

    /// Variable bindings
    pub bindings: Vec<Binding>,

    /// Child ranges
    pub children: Vec<GeneratedRange>,
}

#[derive(Debug, Clone)]
pub struct Callsite {
    pub source_index: u32,
    pub line: u32,
    pub column: u32,
}

#[derive(Debug, Clone)]
pub struct Binding {
    /// Index into names array (1-based, 0=unavailable)
    pub name_index: u32,

    /// Optional expression for computing value
    pub expression: Option<String>,

    /// Subranges if variable has partial availability
    pub subranges: Vec<BindingSubrange>,
}

#[derive(Debug, Clone)]
pub struct BindingSubrange {
    pub start: LineCol,
    pub end: LineCol,
    pub expression: Option<String>,
}
```

### 3.3 Scope Collection During Transformation

```rust
// crates/swc_sourcemap_scopes/src/collector.rs

use swc_common::{DUMMY_SP, Span};
use swc_ecma_ast::*;
use swc_ecma_visit::{Visit, VisitWith};
use swc_atoms::Atom;

/// Collects scope information during AST traversal
pub struct ScopeCollector {
    /// Stack of active scopes
    scope_stack: Vec<OriginalScope>,

    /// Root scopes (one per source file)
    pub roots: Vec<OriginalScope>,

    /// Whether to collect scope information
    enabled: bool,
}

impl ScopeCollector {
    pub fn new(enabled: bool) -> Self {
        Self {
            scope_stack: Vec::new(),
            roots: Vec::new(),
            enabled,
        }
    }

    fn push_scope(&mut self, span: Span, name: Option<Atom>, kind: ScopeKind, is_stack_frame: bool) {
        if !self.enabled {
            return;
        }

        let scope = OriginalScope {
            span,
            name,
            kind,
            is_stack_frame,
            variables: Vec::new(),
            children: Vec::new(),
        };

        self.scope_stack.push(scope);
    }

    fn pop_scope(&mut self) {
        if !self.enabled {
            return;
        }

        if let Some(scope) = self.scope_stack.pop() {
            if let Some(parent) = self.scope_stack.last_mut() {
                parent.children.push(scope);
            } else {
                self.roots.push(scope);
            }
        }
    }

    fn add_variable(&mut self, name: Atom) {
        if !self.enabled {
            return;
        }

        if let Some(scope) = self.scope_stack.last_mut() {
            if !scope.variables.contains(&name) {
                scope.variables.push(name);
            }
        }
    }

    fn current_scope_mut(&mut self) -> Option<&mut OriginalScope> {
        self.scope_stack.last_mut()
    }
}

impl Visit for ScopeCollector {
    fn visit_function(&mut self, n: &Function) {
        self.push_scope(
            n.span,
            n.ident.as_ref().map(|id| id.sym.clone()),
            ScopeKind::Function,
            true,  // Functions are stack frames
        );

        // Collect parameters as variables
        for param in &n.params {
            self.collect_pat_variables(&param.pat);
        }

        n.visit_children_with(self);
        self.pop_scope();
    }

    fn visit_arrow_expr(&mut self, n: &ArrowExpr) {
        self.push_scope(n.span, None, ScopeKind::Function, true);

        // Collect parameters
        for param in &n.params {
            self.collect_pat_variables(param);
        }

        n.visit_children_with(self);
        self.pop_scope();
    }

    fn visit_class(&mut self, n: &Class) {
        self.push_scope(
            n.span,
            None,  // Class name handled by parent decl
            ScopeKind::Class,
            false,
        );

        n.visit_children_with(self);
        self.pop_scope();
    }

    fn visit_block_stmt(&mut self, n: &BlockStmt) {
        self.push_scope(n.span, None, ScopeKind::Block, false);
        n.visit_children_with(self);
        self.pop_scope();
    }

    fn visit_var_decl(&mut self, n: &VarDecl) {
        for decl in &n.decls {
            self.collect_pat_variables(&decl.name);
        }
        n.visit_children_with(self);
    }

    fn visit_fn_decl(&mut self, n: &FnDecl) {
        // Add function name to current scope
        self.add_variable(n.ident.sym.clone());

        // Visit function body with new scope
        self.visit_function(&n.function);
    }

    fn visit_class_decl(&mut self, n: &ClassDecl) {
        // Add class name to current scope
        self.add_variable(n.ident.sym.clone());

        // Visit class body
        self.visit_class(&n.class);
    }
}

impl ScopeCollector {
    fn collect_pat_variables(&mut self, pat: &Pat) {
        match pat {
            Pat::Ident(ident) => {
                self.add_variable(ident.sym.clone());
            }
            Pat::Array(arr) => {
                for elem in &arr.elems {
                    if let Some(elem) = elem {
                        self.collect_pat_variables(elem);
                    }
                }
            }
            Pat::Object(obj) => {
                for prop in &obj.props {
                    match prop {
                        ObjectPatProp::KeyValue(kv) => {
                            self.collect_pat_variables(&kv.value);
                        }
                        ObjectPatProp::Assign(assign) => {
                            self.add_variable(assign.key.sym.clone());
                        }
                        ObjectPatProp::Rest(rest) => {
                            self.collect_pat_variables(&rest.arg);
                        }
                    }
                }
            }
            Pat::Rest(rest) => {
                self.collect_pat_variables(&rest.arg);
            }
            Pat::Assign(assign) => {
                self.collect_pat_variables(&assign.left);
            }
            Pat::Invalid(_) | Pat::Expr(_) => {}
        }
    }
}
```

### 3.4 Generated Range Tracking During Codegen

```rust
// crates/swc_sourcemap_scopes/src/range_tracker.rs

use swc_common::source_map::LineCol;
use std::collections::HashMap;

/// Tracks generated ranges during code generation
pub struct RangeTracker {
    /// Stack of active ranges
    range_stack: Vec<GeneratedRange>,

    /// Completed root ranges
    pub roots: Vec<GeneratedRange>,

    /// Map from original BytePos to original scope index
    scope_map: HashMap<BytePos, u32>,

    /// Whether tracking is enabled
    enabled: bool,
}

impl RangeTracker {
    pub fn new(enabled: bool) -> Self {
        Self {
            range_stack: Vec::new(),
            roots: Vec::new(),
            scope_map: HashMap::new(),
            enabled,
        }
    }

    /// Start a new generated range
    pub fn start_range(
        &mut self,
        pos: LineCol,
        original_scope: Option<u32>,
        is_stack_frame: bool,
    ) {
        if !self.enabled {
            return;
        }

        let range = GeneratedRange {
            start: pos,
            end: pos,  // Will be updated
            is_stack_frame,
            is_hidden: false,
            original_scope,
            callsite: None,
            bindings: Vec::new(),
            children: Vec::new(),
        };

        self.range_stack.push(range);
    }

    /// End the current range
    pub fn end_range(&mut self, pos: LineCol) {
        if !self.enabled {
            return;
        }

        if let Some(mut range) = self.range_stack.pop() {
            range.end = pos;

            if let Some(parent) = self.range_stack.last_mut() {
                parent.children.push(range);
            } else {
                self.roots.push(range);
            }
        }
    }

    /// Add a variable binding to the current range
    pub fn add_binding(&mut self, name_index: u32, expression: Option<String>) {
        if !self.enabled {
            return;
        }

        if let Some(range) = self.range_stack.last_mut() {
            range.bindings.push(Binding {
                name_index,
                expression,
                subranges: Vec::new(),
            });
        }
    }
}
```

### 3.5 VLQ Encoder

```rust
// crates/swc_sourcemap_scopes/src/encode.rs

use std::io::{Write, Result};

const BASE64_CHARS: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

/// Encode a signed VLQ value
pub fn encode_vlq_signed<W: Write>(writer: &mut W, value: i32) -> Result<()> {
    let unsigned = if value < 0 {
        ((-value) << 1) | 1
    } else {
        value << 1
    };
    encode_vlq_unsigned(writer, unsigned as u32)
}

/// Encode an unsigned VLQ value
pub fn encode_vlq_unsigned<W: Write>(writer: &mut W, mut value: u32) -> Result<()> {
    loop {
        let mut digit = value & 0x1F;
        value >>= 5;

        if value > 0 {
            digit |= 0x20;  // Continuation bit
        }

        writer.write_all(&[BASE64_CHARS[digit as usize]])?;

        if value == 0 {
            break;
        }
    }
    Ok(())
}

/// Scopes encoder
pub struct ScopesEncoder<W: Write> {
    writer: W,

    // State for delta encoding
    last_orig_line: u32,
    last_orig_col: u32,
    last_gen_line: u32,
    last_gen_col: u32,
    last_name_idx: i32,
    last_kind_idx: i32,
}

impl<W: Write> ScopesEncoder<W> {
    pub fn new(writer: W) -> Self {
        Self {
            writer,
            last_orig_line: 0,
            last_orig_col: 0,
            last_gen_line: 0,
            last_gen_col: 0,
            last_name_idx: 0,
            last_kind_idx: 0,
        }
    }

    /// Encode original scope start (Tag B)
    pub fn encode_original_scope_start(
        &mut self,
        line: u32,
        col: u32,
        name_idx: Option<i32>,
        kind_idx: Option<i32>,
        is_stack_frame: bool,
    ) -> Result<()> {
        // Tag B = 0x1
        encode_vlq_unsigned(&mut self.writer, 0x1)?;

        // FLAGS
        let mut flags = 0u32;
        if name_idx.is_some() {
            flags |= 0x1;
        }
        if kind_idx.is_some() {
            flags |= 0x2;
        }
        if is_stack_frame {
            flags |= 0x4;
        }
        encode_vlq_unsigned(&mut self.writer, flags)?;

        // LINE (delta)
        let line_delta = (line as i32) - (self.last_orig_line as i32);
        encode_vlq_signed(&mut self.writer, line_delta)?;
        self.last_orig_line = line;

        // COLUMN (delta if same line, absolute if different)
        let col_delta = if line_delta == 0 {
            (col as i32) - (self.last_orig_col as i32)
        } else {
            col as i32
        };
        encode_vlq_signed(&mut self.writer, col_delta)?;
        self.last_orig_col = col;

        // NAME (delta)
        if let Some(idx) = name_idx {
            let name_delta = idx - self.last_name_idx;
            encode_vlq_signed(&mut self.writer, name_delta)?;
            self.last_name_idx = idx;
        }

        // KIND (delta)
        if let Some(idx) = kind_idx {
            let kind_delta = idx - self.last_kind_idx;
            encode_vlq_signed(&mut self.writer, kind_delta)?;
            self.last_kind_idx = idx;
        }

        Ok(())
    }

    /// Encode original scope end (Tag C)
    pub fn encode_original_scope_end(&mut self, line: u32, col: u32) -> Result<()> {
        // Tag C = 0x2
        encode_vlq_unsigned(&mut self.writer, 0x2)?;

        // LINE (delta)
        let line_delta = (line as i32) - (self.last_orig_line as i32);
        encode_vlq_signed(&mut self.writer, line_delta)?;
        self.last_orig_line = line;

        // COLUMN (delta if same line, absolute if different)
        let col_delta = if line_delta == 0 {
            (col as i32) - (self.last_orig_col as i32)
        } else {
            col as i32
        };
        encode_vlq_signed(&mut self.writer, col_delta)?;
        self.last_orig_col = col;

        Ok(())
    }

    /// Encode scope variables (Tag D)
    pub fn encode_variables(&mut self, var_indices: &[i32]) -> Result<()> {
        // Tag D = 0x3
        encode_vlq_unsigned(&mut self.writer, 0x3)?;

        // COUNT
        encode_vlq_unsigned(&mut self.writer, var_indices.len() as u32)?;

        // Variables (delta-encoded indices)
        for &idx in var_indices {
            let delta = idx - self.last_name_idx;
            encode_vlq_signed(&mut self.writer, delta)?;
            self.last_name_idx = idx;
        }

        Ok(())
    }

    /// Encode generated range start (Tag E)
    pub fn encode_generated_range_start(
        &mut self,
        line: u32,
        col: u32,
        original_scope_idx: Option<u32>,
        is_stack_frame: bool,
        is_hidden: bool,
    ) -> Result<()> {
        // Tag E = 0x4
        encode_vlq_unsigned(&mut self.writer, 0x4)?;

        // FLAGS
        let has_line = line != self.last_gen_line;
        let mut flags = 0u32;
        if has_line {
            flags |= 0x1;
        }
        if original_scope_idx.is_some() {
            flags |= 0x2;
        }
        if is_stack_frame {
            flags |= 0x4;
        }
        if is_hidden {
            flags |= 0x8;
        }
        encode_vlq_unsigned(&mut self.writer, flags)?;

        // LINE (optional)
        if has_line {
            let line_delta = (line as i32) - (self.last_gen_line as i32);
            encode_vlq_signed(&mut self.writer, line_delta)?;
            self.last_gen_line = line;
            self.last_gen_col = 0;  // Reset column on new line
        }

        // COLUMN (always present)
        let col_delta = (col as i32) - (self.last_gen_col as i32);
        encode_vlq_signed(&mut self.writer, col_delta)?;
        self.last_gen_col = col;

        // DEFINITION (original scope index, delta)
        if let Some(idx) = original_scope_idx {
            encode_vlq_signed(&mut self.writer, idx as i32)?;
        }

        Ok(())
    }

    /// Encode generated range end (Tag F)
    pub fn encode_generated_range_end(&mut self, line: u32, col: u32) -> Result<()> {
        // Tag F = 0x5
        encode_vlq_unsigned(&mut self.writer, 0x5)?;

        // LINE (optional)
        if line != self.last_gen_line {
            let line_delta = (line as i32) - (self.last_gen_line as i32);
            encode_vlq_signed(&mut self.writer, line_delta)?;
            self.last_gen_line = line;
            self.last_gen_col = 0;
        }

        // COLUMN
        let col_delta = (col as i32) - (self.last_gen_col as i32);
        encode_vlq_signed(&mut self.writer, col_delta)?;
        self.last_gen_col = col;

        Ok(())
    }

    /// Encode simple bindings (Tag G)
    pub fn encode_bindings(&mut self, binding_indices: &[i32]) -> Result<()> {
        // Tag G = 0x6
        encode_vlq_unsigned(&mut self.writer, 0x6)?;

        // Binding indices (delta-encoded, 0 = unavailable)
        for &idx in binding_indices {
            let delta = idx - self.last_name_idx;
            encode_vlq_signed(&mut self.writer, delta)?;
            if idx != 0 {
                self.last_name_idx = idx;
            }
        }

        Ok(())
    }

    /// Write comma separator
    pub fn write_separator(&mut self) -> Result<()> {
        self.writer.write_all(b",")
    }

    /// Reset state (for new top-level scope tree)
    pub fn reset_state(&mut self) {
        self.last_orig_line = 0;
        self.last_orig_col = 0;
        self.last_gen_line = 0;
        self.last_gen_col = 0;
        // Note: name_idx and kind_idx remain continuous across trees
    }
}
```

---

## 4. Integration Points in Compilation Pipeline

### 4.1 Overall Flow

```
┌─────────────┐
│   Parsing   │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  AST with Spans     │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐     ┌──────────────────────┐
│  Resolver Pass      │────▶│ ScopeCollector       │
│  (existing)         │     │ (NEW - collects      │
│                     │     │  original scopes)    │
└──────┬──────────────┘     └──────────────────────┘
       │
       ▼
┌─────────────────────┐
│ Transform Passes    │
│ (minify, inline...) │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐     ┌──────────────────────┐
│   Code Generation   │────▶│ RangeTracker         │
│   (Emitter)         │     │ (NEW - tracks        │
│                     │     │  generated ranges)   │
└──────┬──────────────┘     └──────────────────────┘
       │
       ▼
┌─────────────────────┐     ┌──────────────────────┐
│ Source Map Building │────▶│ Scopes Encoding      │
│ (build_source_map)  │     │ (NEW - encode scopes │
│                     │     │  field)              │
└─────────────────────┘     └──────────────────────┘
```

### 4.2 Phase 1: Scope Collection (After Resolver)

**Location:** After `swc_ecma_transforms_base::resolver` pass

**Approach:**

1. Add `ScopeCollector` as a `Visit` pass (read-only traversal)
2. Run immediately after Resolver to leverage SyntaxContext information
3. Build `OriginalScope` tree for each source file

**Integration:**

```rust
// In swc_core or user code
let mut passes = chain!(
    resolver(unresolved_mark, top_level_mark, false),

    // NEW: Scope collection pass
    optional_pass(
        config.source_maps == SourceMapsConfig::WithScopes,
        scope_collector_pass()
    ),

    // Existing transforms...
    hygiene(),
    fixer(None),
);
```

### 4.3 Phase 2: Range Tracking (During Codegen)

**Modifications to `Emitter`:**

```rust
// crates/swc_ecma_codegen/src/lib.rs

pub struct Emitter<'a, W, S: SourceMapper>
where
    W: WriteJs,
    S: SourceMapperExt,
{
    pub cfg: config::Config,
    pub cm: Lrc<S>,
    pub comments: Option<&'a dyn Comments>,
    pub wr: W,

    // NEW: Optional range tracker
    #[cfg(feature = "sourcemap-scopes")]
    pub range_tracker: Option<&'a mut RangeTracker>,
}
```

**Tracking Ranges:**

```rust
impl<W, S> Emitter<'_, W, S>
where
    W: WriteJs,
    S: SourceMapper + SourceMapperExt,
{
    fn emit_function(&mut self, n: &Function) -> Result {
        // Start tracking range for this function
        #[cfg(feature = "sourcemap-scopes")]
        if let Some(tracker) = &mut self.range_tracker {
            let pos = self.wr.current_pos();
            let orig_scope = self.lookup_original_scope(n.span);
            tracker.start_range(pos, orig_scope, true);
        }

        // Emit function code...
        keyword!(self, "function");
        // ... rest of emission ...

        // End range
        #[cfg(feature = "sourcemap-scopes")]
        if let Some(tracker) = &mut self.range_tracker {
            let pos = self.wr.current_pos();
            tracker.end_range(pos);
        }

        Ok(())
    }
}
```

### 4.4 Phase 3: Encoding (During Source Map Building)

**Extend `build_source_map`:**

```rust
// crates/swc_common/src/source_map.rs

#[cfg(feature = "sourcemap-scopes")]
pub fn build_source_map_with_scopes(
    files: &impl Files,
    mappings: &[(BytePos, LineCol)],
    orig: Option<swc_sourcemap::SourceMap>,
    config: &impl SourceMapGenConfig,
    scopes_data: ScopesData,  // NEW
) -> swc_sourcemap::SourceMap {
    let mut map = build_source_map(files, mappings, orig, config);

    // Encode scopes field
    let scopes_string = encode_scopes(&scopes_data)?;
    map.set_scopes(scopes_string);

    map
}
```

---

## 5. Performance Considerations

### 5.1 Zero-Overhead Design

**Feature Flag Strategy:**

```toml
# crates/swc_common/Cargo.toml
[features]
sourcemap = ["swc_sourcemap"]
sourcemap-scopes = ["sourcemap", "swc_sourcemap_scopes"]
```

**Conditional Compilation:**

```rust
#[cfg(feature = "sourcemap-scopes")]
pub struct ScopeCollector { /* ... */ }

#[cfg(not(feature = "sourcemap-scopes"))]
pub struct ScopeCollector;  // Zero-size type
```

### 5.2 Memory Optimization

**Techniques:**

1. **Reuse Resolver Data**: Don't duplicate scope tracking; extend existing infrastructure
2. **Arena Allocation**: Use `bumpalo` or similar for scope tree allocation
3. **Interning**: Scope names/kinds stored as `Atom` (already interned)
4. **Lazy Encoding**: Don't encode scopes until source map serialization

**Estimated Memory Usage:**

- **Original Scopes**: ~48 bytes per scope + variable list
- **Generated Ranges**: ~56 bytes per range + bindings
- **Typical 100KB file**: ~500 scopes = 24KB overhead (0.024% of source)

### 5.3 Encoding Optimization

**Strategies:**

1. **Delta Encoding**: Minimize VLQ sizes by encoding differences
2. **Deduplication**: Don't emit duplicate ranges
3. **Batch Writes**: Buffer VLQ output to reduce syscalls
4. **Streaming**: Encode directly to output without intermediate allocation

**Benchmark Targets:**

- Source map generation overhead: <5% increase
- Encoded scopes size: <10% of original source map size
- Encoding time: <1ms per 1000 scopes

---

## 6. Testing Strategy

### 6.1 Unit Tests

**Test Coverage:**

1. **VLQ Encoding:**
   - Signed/unsigned values
   - Delta encoding correctness
   - Round-trip encode/decode

2. **Scope Collection:**
   - Function scopes (regular, arrow, async, generator)
   - Block scopes (if, for, while, try-catch)
   - Class scopes
   - Variable declarations (var, let, const, parameters)
   - Nested scopes

3. **Range Tracking:**
   - Basic range creation/nesting
   - Position updates
   - Binding tracking

4. **Integration:**
   - End-to-end: Parse → Transform → Codegen → Encode
   - Verify encoded output matches spec

**Example Test:**

```rust
#[test]
fn test_function_scope_collection() {
    let code = r#"
        function outer(a, b) {
            let x = 1;
            function inner(c) {
                let y = 2;
                return a + x + y + c;
            }
            return inner(b);
        }
    "#;

    let module = parse(code);
    let mut collector = ScopeCollector::new(true);
    module.visit_with(&mut collector);

    assert_eq!(collector.roots.len(), 1);
    let outer_scope = &collector.roots[0];
    assert_eq!(outer_scope.kind, ScopeKind::Function);
    assert_eq!(outer_scope.variables, vec!["a", "b", "x", "inner"]);
    assert_eq!(outer_scope.children.len(), 1);

    let inner_scope = &outer_scope.children[0];
    assert_eq!(inner_scope.kind, ScopeKind::Function);
    assert_eq!(inner_scope.variables, vec!["c", "y"]);
}
```

### 6.2 Integration Tests

**Test Scenarios:**

1. **Minification:** Verify scopes survive variable renaming
2. **Inlining:** Verify callsite information is preserved
3. **Tree Shaking:** Verify removed scopes don't appear
4. **Multiple Files:** Verify scopes from different sources
5. **Edge Cases:** Empty scopes, dummy spans, invalid positions

### 6.3 Compatibility Tests

**Validation:**

1. **Source Map v3 Compatibility:** Existing tools can still parse source maps
2. **Chrome DevTools:** Test with actual debugger
3. **VS Code:** Test with source map viewer
4. **Backwards Compatibility:** Old consumers ignore "scopes" field

---

## 7. API Design

### 7.1 Configuration

```rust
// crates/swc_common/src/source_map.rs

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum SourceMapsConfig {
    /// No source maps
    Disabled,

    /// Standard source maps (v3)
    Enabled,

    /// Source maps with scopes (ECMA-426)
    #[cfg(feature = "sourcemap-scopes")]
    WithScopes,
}

pub trait SourceMapGenConfig {
    // Existing methods...
    fn file_name_to_source(&self, f: &FileName) -> String;

    // NEW: Enable scopes generation
    #[cfg(feature = "sourcemap-scopes")]
    fn enable_scopes(&self) -> bool {
        false
    }

    // NEW: Scope kind names (for customization)
    #[cfg(feature = "sourcemap-scopes")]
    fn scope_kind_name(&self, kind: ScopeKind) -> Option<&str> {
        match kind {
            ScopeKind::Global => Some("global"),
            ScopeKind::Function => Some("function"),
            ScopeKind::Class => Some("class"),
            ScopeKind::Block => Some("block"),
        }
    }
}
```

### 7.2 Public API

```rust
// crates/swc_sourcemap_scopes/src/lib.rs

#![cfg_attr(not(feature = "sourcemap-scopes"), allow(unused))]

pub mod collector;
pub mod generated;
pub mod original;
pub mod encode;
pub mod range_tracker;

pub use collector::ScopeCollector;
pub use generated::{GeneratedRange, Binding, Callsite};
pub use original::{OriginalScope, ScopeKind};
pub use range_tracker::RangeTracker;

/// Complete scopes data for a source map
#[derive(Debug)]
pub struct ScopesData {
    /// Original scopes (one tree per source file)
    pub original_scopes: Vec<OriginalScope>,

    /// Generated ranges (one or more trees)
    pub generated_ranges: Vec<GeneratedRange>,

    /// Names array (shared with source map)
    pub names: Vec<String>,
}

/// Encode scopes data to VLQ string
pub fn encode_scopes(data: &ScopesData) -> std::io::Result<String> {
    let mut buf = Vec::new();
    let mut encoder = encode::ScopesEncoder::new(&mut buf);

    // Encode original scopes
    for scope in &data.original_scopes {
        encode_original_scope_tree(&mut encoder, scope)?;
    }

    // Encode generated ranges
    for range in &data.generated_ranges {
        encode_generated_range_tree(&mut encoder, range)?;
    }

    String::from_utf8(buf).map_err(|e| {
        std::io::Error::new(std::io::ErrorKind::InvalidData, e)
    })
}
```

### 7.3 Usage Example

```rust
use swc_common::{SourceMap, GLOBALS, source_map::SourceMapsConfig};
use swc_ecma_parser::{Parser, Syntax};
use swc_ecma_codegen::{Emitter, text_writer::JsWriter};
use swc_sourcemap_scopes::{ScopeCollector, RangeTracker, encode_scopes};

fn compile_with_scopes(code: &str) -> (String, String) {
    GLOBALS.set(&Default::default(), || {
        let cm = Lrc::new(SourceMap::default());
        let fm = cm.new_source_file(
            Lrc::new("input.js".into()),
            code.into()
        );

        // Parse
        let module = parse_module(&fm);

        // Collect original scopes
        let mut scope_collector = ScopeCollector::new(true);
        module.visit_with(&scope_collector);

        // Generate code with range tracking
        let mut output = Vec::new();
        let mut srcmap_buf = Vec::new();
        let mut range_tracker = RangeTracker::new(true);

        {
            let mut emitter = Emitter {
                cfg: Default::default(),
                cm: cm.clone(),
                comments: None,
                wr: JsWriter::new(cm.clone(), "\n", &mut output, Some(&mut srcmap_buf)),
                range_tracker: Some(&mut range_tracker),
            };

            emitter.emit_module(&module).unwrap();
        }

        // Build source map with scopes
        let srcmap = cm.build_source_map_with_scopes(
            &srcmap_buf,
            None,
            DefaultSourceMapGenConfig,
            ScopesData {
                original_scopes: scope_collector.roots,
                generated_ranges: range_tracker.roots,
                names: vec![],  // Build from scopes
            },
        );

        let output_code = String::from_utf8(output).unwrap();
        let mut srcmap_json = Vec::new();
        srcmap.to_writer(&mut srcmap_json).unwrap();

        (output_code, String::from_utf8(srcmap_json).unwrap())
    })
}
```

---

## 8. Implementation Phases

### Phase 1: Foundation (Week 1-2)

**Deliverables:**
- [ ] Create `swc_sourcemap_scopes` crate structure
- [ ] Implement basic data structures (`OriginalScope`, `GeneratedRange`)
- [ ] Implement VLQ encoder with unit tests
- [ ] Add feature flags to relevant crates

**Files to Create:**
- `crates/swc_sourcemap_scopes/Cargo.toml`
- `crates/swc_sourcemap_scopes/src/lib.rs`
- `crates/swc_sourcemap_scopes/src/original.rs`
- `crates/swc_sourcemap_scopes/src/generated.rs`
- `crates/swc_sourcemap_scopes/src/encode.rs`
- `crates/swc_sourcemap_scopes/tests/vlq_tests.rs`

### Phase 2: Scope Collection (Week 3-4)

**Deliverables:**
- [ ] Implement `ScopeCollector` visitor
- [ ] Handle all scope types (function, class, block)
- [ ] Collect variable declarations
- [ ] Integration tests for scope collection

**Files to Create/Modify:**
- `crates/swc_sourcemap_scopes/src/collector.rs`
- `crates/swc_sourcemap_scopes/tests/collector_tests.rs`
- `crates/swc_ecma_transforms_base/src/lib.rs` (export scope types)

### Phase 3: Range Tracking (Week 5-6)

**Deliverables:**
- [ ] Implement `RangeTracker`
- [ ] Modify `Emitter` to support range tracking
- [ ] Track function boundaries
- [ ] Track scope nesting during codegen

**Files to Modify:**
- `crates/swc_sourcemap_scopes/src/range_tracker.rs`
- `crates/swc_ecma_codegen/src/lib.rs`
- `crates/swc_ecma_codegen/Cargo.toml` (add feature)

### Phase 4: Encoding (Week 7-8)

**Deliverables:**
- [ ] Implement full scopes encoding
- [ ] Integrate with `build_source_map`
- [ ] Add to source map JSON output
- [ ] End-to-end tests

**Files to Modify:**
- `crates/swc_sourcemap_scopes/src/encode.rs`
- `crates/swc_common/src/source_map.rs`
- `crates/swc_sourcemap_scopes/tests/integration_tests.rs`

### Phase 5: Optimization & Polish (Week 9-10)

**Deliverables:**
- [ ] Performance benchmarks
- [ ] Memory optimization
- [ ] Documentation
- [ ] Examples

**Files to Create:**
- `crates/swc_sourcemap_scopes/benches/encode_bench.rs`
- `crates/swc_sourcemap_scopes/examples/basic.rs`
- `crates/swc_sourcemap_scopes/README.md`

### Phase 6: Advanced Features (Week 11-12)

**Deliverables:**
- [ ] Variable binding tracking
- [ ] Callsite information (for inlining)
- [ ] Subrange bindings
- [ ] Real-world testing with Chrome DevTools

**Files to Modify:**
- `crates/swc_sourcemap_scopes/src/range_tracker.rs`
- `crates/swc_ecma_codegen/src/lib.rs` (binding tracking)

---

## 9. Open Questions & Future Work

### 9.1 Open Questions

1. **Binding Expressions:** How to generate expressions for optimized variables?
   - May require tracking transformations more deeply
   - Could start with simple name mappings

2. **Inlining Detection:** How to detect when a function is inlined?
   - Requires cooperation with optimization passes
   - May need new metadata on AST nodes

3. **TypeScript Integration:** How to handle TypeScript-specific scopes?
   - Namespaces, enums, type-only scopes
   - May need extended scope kinds

4. **Source Map v4:** Should we prepare for future spec changes?
   - Current design is extensible
   - VLQ format allows forward compatibility

### 9.2 Future Enhancements

1. **Incremental Updates:** Update scopes without full recompilation
2. **Multi-threaded Encoding:** Parallelize VLQ encoding for large files
3. **Source Map Visualization:** Tools to inspect scopes
4. **IDE Integration:** VS Code extension for scope debugging
5. **Advanced Optimizations:**
   - Dead code elimination tracking
   - Constant folding expression generation
   - Loop unrolling scope mapping

---

## 10. References

### Specifications
- [TC39 ECMA-426 Scopes Proposal](https://github.com/tc39/ecma426/blob/main/proposals/scopes.md)
- [ECMA-426 Source Map Specification](https://tc39.es/ecma426/)
- [Source Map v3 Specification](https://sourcemaps.info/spec.html)

### Reference Implementations
- [Chrome DevTools Scopes Encoding](https://github.com/ChromeDevTools/sourcemap-scopes-encoding)
- [TC39 Proposal Scope Mapping Reference](https://github.com/hbenl/tc39-proposal-scope-mapping)

### SWC Documentation
- [swc_common SourceMap Docs](https://rustdoc.swc.rs/swc_common/source_map/index.html)
- [swc_sourcemap Crate](https://docs.rs/swc_sourcemap)
- [VLQ Encoding in Rust](https://docs.rs/vlq/latest/vlq/)

### Key SWC Files
- `crates/swc_common/src/source_map.rs` - Source map infrastructure
- `crates/swc_ecma_transforms_base/src/resolver/mod.rs` - Scope tracking
- `crates/swc_ecma_codegen/src/text_writer/basic_impl.rs` - Position tracking
- `crates/swc_ecma_visit/src/lib.rs` - Visitor patterns

---

## 11. Appendix: Example Encoded Output

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

### Source Map (with scopes field)

```json
{
  "version": 3,
  "sources": ["input.js"],
  "names": ["outer", "a", "b", "x", "inner", "c", "y"],
  "mappings": "AAAA,SAASA,KAAM,CAACC,CAAC,CAAEC,CAAC...",
  "scopes": "BCAA,CCAA,DCAA,ECAA,FCAA,..."
}
```

### Scopes Field Breakdown

```
B - Original scope start (outer function)
  FLAGS: 0x5 (has_name=1, is_stack_frame=1)
  LINE: 0 (delta from 0)
  COL: 0
  NAME: 1 (index for "outer")

D - Variables in outer scope
  COUNT: 4
  VARS: [2, 3, 4, 5] (a, b, x, inner)

B - Original scope start (inner function)
  FLAGS: 0x5 (has_name=1, is_stack_frame=1)
  LINE: 2 (delta +2)
  COL: 2
  NAME: 5 (index for "inner")

D - Variables in inner scope
  COUNT: 2
  VARS: [6, 7] (c, y)

C - Original scope end (inner)
  LINE: 4
  COL: 2

C - Original scope end (outer)
  LINE: 6
  COL: 0

E - Generated range start
  FLAGS: 0x7 (has_line=1, has_def=1, is_stack_frame=1)
  LINE: 0
  COL: 0
  DEF: 0 (maps to first original scope)

G - Bindings
  [2, 3, 4, 5] (maps generated positions to original vars)

... (more ranges and bindings)
```

---

## Conclusion

This design provides a comprehensive, performance-conscious approach to implementing TC39 ECMA-426 scopes in SWC. The phased implementation allows for incremental development and testing, while the feature-flag approach ensures zero overhead for users who don't need scopes.

The design leverages SWC's existing scope tracking infrastructure (Resolver) and source map generation pipeline, minimizing code duplication and maximizing performance. The VLQ encoding implementation follows the specification closely while optimizing for common cases.

Key success metrics:
- ✅ Zero overhead when disabled
- ✅ <5% performance impact when enabled
- ✅ Accurate scope information for all JavaScript constructs
- ✅ Compatible with existing source map consumers
- ✅ Extensible for future enhancements

Next steps: Begin Phase 1 implementation with VLQ encoder and basic data structures.
