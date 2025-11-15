# OXC Transformer Adapter for SWC

This module provides infrastructure for porting OXC transformers to work with SWC's `VisitMutHook` API pattern.

## Overview

The OXC (Oxidation Compiler) project has a collection of high-performance transformers that use the `Traverse` trait pattern with `enter_*` and `exit_*` methods. SWC uses a different pattern with `VisitMut` for top-level transformers and `VisitMutHook<TraverseCtx>` for composable sub-transformers.

This adapter layer bridges the gap between these two architectures, allowing OXC transformer logic to be reused within SWC's ecosystem.

## Architecture

### OXC Pattern (Source)

```rust
// OXC uses Traverse trait with enter/exit methods
impl<'a> Traverse<'a, TransformState<'a>> for MyTransform {
    fn enter_expression(&mut self, expr: &mut Expression<'a>, ctx: &mut TraverseCtx<'a>) {
        // Transform logic before visiting children
    }

    fn exit_expression(&mut self, expr: &mut Expression<'a>, ctx: &mut TraverseCtx<'a>) {
        // Transform logic after visiting children
    }
}
```

### SWC Pattern (Target)

```rust
// SWC uses VisitMutHook with generic context
impl<C> VisitMutHook<C> for MyTransform {
    fn enter_expr(&mut self, node: &mut Expr, ctx: &mut C) {
        // Transform logic before visiting children
    }

    fn exit_expr(&mut self, node: &mut Expr, ctx: &mut C) {
        // Transform logic after visiting children
    }
}

// Top-level transformer implements VisitMut
pub struct Transformer<H, C> {
    hook: H,
    context: C,
}

impl<H: VisitMutHook<C>, C> VisitMut for Transformer<H, C> {
    fn visit_mut_expr(&mut self, node: &mut Expr) {
        self.hook.enter_expr(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_expr(node, &mut self.context);
    }
}
```

## Key Differences

| Aspect | OXC | SWC |
|--------|-----|-----|
| Trait | `Traverse<'a, State>` | `VisitMutHook<Context>` |
| AST | `oxc_ast` types | `swc_ecma_ast` types |
| Context | `TraverseCtx<'a>` from OXC | Generic context type |
| Method Names | `enter_expression`, `exit_expression` | `enter_expr`, `exit_expr` |
| Composition | Manually in main transformer | `CompositeHook` for composing hooks |

## Components

### 1. TraverseCtx Type

The `TraverseCtx` type is designed to be compatible with SWC's `VisitMutHook` pattern while providing similar functionality to OXC's context:

```rust
pub struct TraverseCtx<'a> {
    /// Scope information and semantic analysis
    pub scoping: &'a mut Scoping,

    /// Current scope ID for variable binding
    pub scope_id: ScopeId,

    /// AST builder for creating new nodes
    pub ast: AstBuilder<'a>,

    /// State management for transformers
    pub state: TransformState,
}
```

### 2. Base Transformer

The base `Transformer` type implements `VisitMut` and manages the execution of `VisitMutHook` implementations:

```rust
pub struct Transformer<H, C> {
    pub hook: H,
    pub context: C,
}

impl<H: VisitMutHook<C>, C> VisitMut for Transformer<H, C> {
    // Implements VisitMut by delegating to hooks
    // Calls enter_*, visits children, calls exit_*
}
```

### 3. Sub-Transformers

Individual transforms implement `VisitMutHook<TraverseCtx>`:

```rust
pub struct ES2020Transform {
    // Transform-specific state
}

impl VisitMutHook<TraverseCtx> for ES2020Transform {
    fn enter_expr(&mut self, node: &mut Expr, ctx: &mut TraverseCtx) {
        // Transform logic
    }
}
```

## Porting Strategy

### Phase 1: Infrastructure (This PR)

1. Create `TraverseCtx` type compatible with SWC's patterns
2. Implement base `Transformer` infrastructure
3. Document architecture and provide examples
4. Set up directory structure for transformers

### Phase 2: AST Mapping (Future)

1. Create mapping layer between OXC AST (`oxc_ast`) and SWC AST (`swc_ecma_ast`)
2. Implement conversion utilities for common patterns
3. Handle lifetime and ownership differences

### Phase 3: Transform Porting (Future)

1. Port individual ES20XX transforms
2. Port TypeScript transform
3. Port JSX transform
4. Add comprehensive tests

## Usage Example

```rust
use swc_ecma_ast::*;
use swc_ecma_visit::VisitMut;
use swc_ecma_hooks::VisitMutHook;

// Define a transform as a VisitMutHook
struct MyTransform;

impl VisitMutHook<TraverseCtx> for MyTransform {
    fn enter_expr(&mut self, node: &mut Expr, ctx: &mut TraverseCtx) {
        // Transform expressions before visiting children
        match node {
            Expr::Bin(bin) => {
                // Transform binary expressions
            }
            _ => {}
        }
    }
}

// Create and use the transformer
let mut transformer = Transformer {
    hook: MyTransform,
    context: TraverseCtx::new(/* ... */),
};

program.visit_mut_with(&mut transformer);
```

## Performance Considerations

Following the project's CLAUDE.md guidelines:

1. **Always prefer performance over other things**
   - Use `&str` for `Atom` instances instead of `String` or `Cow<str>`
   - Minimize allocations in hot paths
   - Use inline annotations where appropriate

2. **No unstable features**
   - All code uses stable Rust only
   - Compatible with current MSRV

3. **Comprehensive testing**
   - Unit tests for each component
   - Integration tests for the full pipeline
   - Performance benchmarks for critical paths

## References

- [OXC Transformer Documentation](https://oxc.rs/docs/guide/usage/transformer.html)
- [OXC GitHub Repository](https://github.com/oxc-project/oxc/tree/main/crates/oxc_transformer)
- [OXC Transformer Blog Post](https://oxc.rs/blog/2024-09-29-transformer-alpha.html)
- [SWC VisitMut Documentation](https://rustdoc.swc.rs/swc_ecma_visit/trait.VisitMut.html)
- [SWC Visit Pattern Guide](https://swc.rs/docs/plugin/ecmascript/getting-started)
- [SWC ECMAScript Hooks](../../../swc_ecma_hooks/src/generated.rs)

## Contributing

When adding new transformers:

1. Implement `VisitMutHook<TraverseCtx>` for your transform
2. Add comprehensive documentation
3. Include unit tests
4. Follow the existing code style
5. Run `cargo fmt --all` and `cargo clippy --all --all-targets`
