# swc_ecma_transformer

Hook-based AST transformer for SWC ECMAScript.

## Purpose

This crate provides a composable transformer architecture for SWC that uses the hook-based pattern from `swc_ecma_hooks`. It serves as an alternative to the existing `swc_ecma_transforms_*` crates, offering better composition and organization of transforms.

## Architecture Overview

### Hook-Based Pattern

The transformer uses a two-phase visitation pattern inspired by oxc_transformer:

1. **Enter Phase**: Called before visiting child nodes
2. **Exit Phase**: Called after visiting child nodes

This is implemented through the `VisitMutHook<TransformCtx>` trait from `swc_ecma_hooks`.

### Main Components

```
┌─────────────────────────────────────────────┐
│           Transformer (VisitMut)            │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │       TransformCtx<'a>              │   │
│  │  - source_map: &SourceMap           │   │
│  │  - comments: Option<&Comments>      │   │
│  │  - changed: bool                    │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │    TransformerOptions               │   │
│  │  - compat: CompatOptions            │   │
│  │  - optimization: OptimizationOpts   │   │
│  │  - module: ModuleOptions            │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │      Child Transforms               │   │
│  │  (implement VisitMutHook<Ctx>)      │   │
│  │  - enter_* methods                  │   │
│  │  - exit_* methods                   │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Key Differences from `swc_ecma_transforms_*`

| Aspect | swc_ecma_transforms_* | swc_ecma_transformer |
|--------|----------------------|---------------------|
| **Pattern** | Direct `VisitMut` implementation | Hook-based `VisitMutHook` |
| **Composition** | Manual chaining of visitors | Automatic delegation through hooks |
| **Context** | Per-transform state | Shared `TransformCtx` |
| **Phases** | Single visit per node | Explicit enter/exit phases |
| **Organization** | Spread across multiple crates | Centralized in one crate |

## Usage Examples

### Basic Usage

```rust
use swc_ecma_transformer::{Transformer, TransformCtx, TransformerOptions};
use swc_ecma_visit::VisitMutWith;
use swc_common::SourceMap;

// Create a source map
let source_map = SourceMap::default();

// Create context
let ctx = TransformCtx::new(&source_map, None);

// Configure options
let options = TransformerOptions::default();

// Create transformer
let mut transformer = Transformer::new(ctx, options);

// Transform your AST
program.visit_mut_with(&mut transformer);
```

### With Custom Options

```rust
use swc_ecma_transformer::{
    TransformerOptions,
    CompatOptions,
    OptimizationOptions,
    ModuleOptions
};

let options = TransformerOptions {
    compat: CompatOptions {
        enabled: true,
        target: Some("es5".to_string()),
    },
    optimization: OptimizationOptions {
        enabled: true,
        constant_folding: true,
        dead_code_elimination: true,
    },
    module: ModuleOptions {
        format: Some("commonjs".to_string()),
        strict: true,
    },
};
```

### Implementing a Custom Transform

```rust
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_transformer::TransformCtx;
use swc_ecma_ast::*;

struct MyCustomTransform;

impl VisitMutHook<TransformCtx<'_>> for MyCustomTransform {
    fn enter_function(&mut self, func: &mut Function, ctx: &mut TransformCtx) {
        // Transform logic before visiting children
        ctx.mark_changed();
    }

    fn exit_function(&mut self, func: &mut Function, ctx: &mut TransformCtx) {
        // Transform logic after visiting children
    }
}
```

## Design Goals

1. **Composability**: Easy to combine multiple transforms
2. **Performance**: Efficient single-pass transformation
3. **Maintainability**: Clear separation of concerns
4. **Extensibility**: Simple to add new transforms
5. **Type Safety**: Leverage Rust's type system

## Future Work

- Add concrete transform implementations (compatibility, optimization, etc.)
- Implement transform ordering and dependency management
- Add benchmarks comparing with existing transform crates
- Provide migration guide from `swc_ecma_transforms_*`

## References

- [SWC VisitMut trait](https://rustdoc.swc.rs/swc_ecma_visit/trait.VisitMut.html)
- [SWC ecma hooks](https://rustdoc.swc.rs/swc_ecma_hooks/)
- [Oxc transformer architecture](https://github.com/oxc-project/oxc/tree/main/crates/oxc_transformer)

## License

Apache-2.0
