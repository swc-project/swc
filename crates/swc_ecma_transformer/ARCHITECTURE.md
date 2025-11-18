# Architecture

This document describes the architecture of `swc_ecma_transformer`, an oxc-inspired transformer implementation built on SWC's infrastructure.

## Overview

The `swc_ecma_transformer` crate provides a composable, hook-based architecture for JavaScript/TypeScript transformations. It draws inspiration from [oxc's transformer](https://github.com/oxc-project/oxc/tree/main/crates/oxc_transformer) design while adapting it to work with SWC's visitor patterns and infrastructure.

## Core Concepts

### Two-Trait Pattern: VisitMut + VisitMutHook

Unlike oxc's single `Traverse` trait, SWC uses a two-trait pattern:

1. **`VisitMut`** (from `swc_ecma_visit`): The base visitor trait that handles AST traversal
2. **`VisitMutHook<C>`** (from `swc_ecma_hooks`): A composable hook trait with context passing

This separation provides several benefits:
- Individual transforms can focus on specific node types using `VisitMutHook`
- The context type `C` can be customized per transformation pipeline
- Hooks can be composed using `CompositeHook` without manual visitor delegation
- The `VisitMutWithHook` adapter bridges between `VisitMut` and `VisitMutHook`

### TraverseCtx: Transformation Context

The `TraverseCtx` type serves a similar role to oxc's `TraverseCtx`, providing utilities for transformations:

```rust
pub struct TraverseCtx<'a> {
    unresolved_ctxt: SyntaxContext,
    top_level_ctxt: SyntaxContext,
    uid_counter: usize,
    state: Option<&'a mut dyn std::any::Any>,
}
```

**Key features:**
- **Syntax Context Management**: Maintains `unresolved_ctxt` and `top_level_ctxt` for proper identifier resolution
- **Unique ID Generation**: `generate_uid_name()` creates unique temporary variable names
- **AST Building Helpers**: Methods like `create_ident_expr()`, `create_member_expr()`, `create_call_expr()`
- **User State**: Optional `state` field for transform-specific data

**Comparison to oxc:**

| oxc TraverseCtx | SWC TraverseCtx | Notes |
|----------------|-----------------|-------|
| `ancestry` field | Not included (yet) | Future: could add parent stack tracking |
| `scoping` field | `SyntaxContext` fields | SWC uses syntax contexts instead of explicit scope tree |
| `ast` builder | Helper methods | SWC doesn't use arena allocation, creates owned nodes |
| `generate_binding()` | `create_unresolved_ident()` | Different names, similar purpose |

### Main Transformer

The `Transformer` struct implements `VisitMut` and orchestrates all transformation hooks:

```rust
pub struct Transformer {
    options: TransformOptions,
    unresolved_mark: Mark,
    top_level_mark: Mark,
}

impl VisitMut for Transformer {
    fn visit_mut_program(&mut self, program: &mut Program) {
        let mut ctx = self.create_context();

        // Compose hooks based on options and call them in order
        // (pseudocode - actual implementation pending)
        let hook = build_hook_chain(&self.options);
        let mut visitor = VisitMutWithHook { hook, context: ctx };
        program.visit_mut_with(&mut visitor);
    }
}
```

## Module Organization

The crate follows oxc's organizational structure:

```
src/
├── lib.rs              # Main Transformer struct, exports
├── context.rs          # TraverseCtx implementation
├── options.rs          # Configuration types
│
├── es2015/             # ES2015 (ES6) transforms
├── es2016/             # ES2016 (ES7) transforms
├── es2017/             # ES2017 transforms
├── es2018/             # ES2018 transforms
├── es2019/             # ES2019 transforms
├── es2020/             # ES2020 transforms
├── es2021/             # ES2021 transforms
├── es2022/             # ES2022 transforms
├── es2026/             # Future ES2026 transforms
│
├── jsx/                # JSX transformations
├── typescript/         # TypeScript transformations
├── decorator/          # Decorator transformations
├── regexp/             # RegExp transformations
│
├── common/             # Shared utilities
├── proposals/          # Experimental proposals
└── utils/              # General utilities
```

### ES20XX Modules

Each ES version module contains transforms for features introduced in that version:

- **es2015**: Arrow functions, classes, template literals, destructuring, block scoping, for-of, spread, default/rest parameters
- **es2016**: Exponentiation operator
- **es2017**: Async functions
- **es2018**: Object rest/spread, async iteration, RegExp improvements
- **es2019**: Optional catch binding
- **es2020**: Optional chaining, nullish coalescing, BigInt, dynamic import
- **es2021**: Logical assignment operators, numeric separators
- **es2022**: Class fields, private methods/fields, static blocks, top-level await
- **es2026**: Future proposals

### Feature Modules

- **jsx**: Classic and automatic JSX transforms, React Refresh
- **typescript**: Type stripping, enums, namespaces, parameter properties
- **decorator**: Legacy and 2022-03 decorator proposals
- **regexp**: Sticky/unicode/dotAll flags, named capture groups, unicode property escapes

### Infrastructure Modules

- **common**: Shared transformation utilities
- **proposals**: Experimental JavaScript proposals not yet in spec
- **utils**: General-purpose helper functions

## Transformation Order

Transforms are applied in a specific order to ensure correctness:

1. **TypeScript** (layer x0): Strip types, transform TS-specific syntax
2. **JSX** (layer x1): Transform JSX syntax
3. **Decorator** (layer x1): Transform decorators
4. **ES20XX** (layers x2-x4): Transform modern syntax to target version
   - ES2022 → ES2021 → ES2020 → ... → ES2015 (reverse chronological order)
5. **RegExp** (layer x4): Transform RegExp features
6. **Common** (layer x4): Apply universal utilities

This ordering mirrors oxc's layered approach and ensures that:
- Types are removed before syntax transformations
- Modern syntax is transformed step-by-step to older versions
- Feature detection and polyfills are added last

## Hook Composition Pattern

Individual transforms implement `VisitMutHook<TraverseCtx>`:

```rust
pub struct Es2015ArrowFunction {
    // transform state
}

impl VisitMutHook<TraverseCtx<'_>> for Es2015ArrowFunction {
    fn enter_expr(&mut self, expr: &mut Expr, ctx: &mut TraverseCtx) {
        if let Expr::Arrow(arrow) = expr {
            // Transform arrow function to regular function
            // Use ctx.generate_uid_name() for temp variables
            // Use ctx.create_ident_expr() to build new AST nodes
        }
    }
}
```

Hooks are composed using `CompositeHook`:

```rust
let es2015_hook = CompositeHook {
    first: Es2015ArrowFunction::new(),
    second: CompositeHook {
        first: Es2015Classes::new(),
        second: Es2015TemplateLiterals::new(),
    },
};
```

The `VisitMutWithHook` adapter calls hooks before/after visiting children:

```rust
let mut visitor = VisitMutWithHook {
    hook: es2015_hook,
    context: ctx,
};
program.visit_mut_with(&mut visitor);
```

## SWC Integration

### Syntax Contexts and Marks

SWC uses `Mark` and `SyntaxContext` for hygiene and identifier resolution:

- **`Mark`**: A unique stamp applied to scopes
- **`SyntaxContext`**: Combination of marks that identifies a scope chain

The transformer maintains two marks:
- `unresolved_mark`: For references to global/unresolved identifiers
- `top_level_mark`: For top-level declarations

These are applied to contexts in `TraverseCtx`:
```rust
let unresolved_ctxt = SyntaxContext::empty().apply_mark(self.unresolved_mark);
let top_level_ctxt = SyntaxContext::empty().apply_mark(self.top_level_mark);
```

### AST Ownership

Unlike oxc (which uses arena allocation with `&'a Allocator`), SWC uses owned AST nodes:
- oxc: `Box<'a, Expr<'a>>` allocated in arena
- SWC: `Box<Expr>` on the heap

This means:
- No arena or lifetime parameters needed
- Slightly higher allocation overhead
- Simpler ownership model
- More familiar to Rust developers

### Atom Usage

When creating `Atom` instances for identifiers, follow SWC conventions:
- Prefer `&str` when possible: `sym: "foo".into()`
- Use `Cow<str>` for conditional strings
- Avoid `String` unless necessary

From CLAUDE.md:
> When creating Atom instances, it's better to use `Cow<str>` or `&str` instead of `String`. Note that `&str` is better than `Cow<str>` here.

## Implementation Roadmap

### Phase 1: Infrastructure (Current)
- [x] Create crate structure
- [x] Implement `TraverseCtx`
- [x] Define options types
- [x] Set up module directories
- [x] Implement main `Transformer` struct
- [x] Document architecture

### Phase 2: Core ES2015 Transforms
- [ ] Arrow functions
- [ ] Classes
- [ ] Template literals
- [ ] Block scoping (let/const)
- [ ] Destructuring
- [ ] For-of loops
- [ ] Spread operator
- [ ] Default/rest parameters

### Phase 3: Additional ES Versions
- [ ] ES2016 (exponentiation)
- [ ] ES2017 (async/await)
- [ ] ES2018 (object rest/spread, async iteration)
- [ ] ES2019 (optional catch binding)
- [ ] ES2020 (optional chaining, nullish coalescing)
- [ ] ES2021 (logical assignment)
- [ ] ES2022 (class fields, private members)

### Phase 4: Feature Transforms
- [ ] JSX (classic and automatic)
- [ ] TypeScript (type stripping)
- [ ] Decorators
- [ ] RegExp transforms

### Phase 5: Polish & Optimization
- [ ] Performance benchmarking
- [ ] Memory optimization
- [ ] Comprehensive test suite
- [ ] Integration with SWC CLI/API

## Testing Strategy

Each transform will include:

1. **Unit tests**: Test individual transformation logic
2. **Integration tests**: Test composed transformation pipelines
3. **Fixture tests**: Compare output with expected transformed code
4. **Compatibility tests**: Verify behavior matches Babel/TypeScript/oxc where appropriate

Example test structure:
```rust
#[test]
fn test_arrow_to_function() {
    let input = "const fn = (x) => x * 2;";
    let expected = "const fn = function(x) { return x * 2; };";

    let mut transformer = Transformer::new(TransformOptions {
        target: EsVersion::Es5,
        ..Default::default()
    });

    assert_transform(input, expected, &mut transformer);
}
```

## Performance Considerations

Following SWC's performance-first philosophy (from CLAUDE.md):
> Write performant code. Always prefer performance over other things.

Key strategies:
- Minimize allocations where possible
- Reuse AST nodes via `std::mem::replace` instead of cloning
- Use `&str` for Atom creation (faster than `String`)
- Avoid unnecessary traversals (only visit relevant node types)
- Benchmark against SWC's existing transforms

## Future Enhancements

Potential additions beyond initial port:

1. **Ancestry Tracking**: Add parent stack to `TraverseCtx` like oxc
2. **Scope Analysis**: Integrate with SWC's scope analysis for better symbol resolution
3. **Parallel Transforms**: Explore parallel transform passes for independent transformations
4. **Plugin API**: Allow external hooks to be registered
5. **Incremental Transforms**: Only re-transform changed portions of AST

## References

- [oxc transformer source](https://github.com/oxc-project/oxc/tree/main/crates/oxc_transformer/src)
- [oxc Traverse trait](https://github.com/oxc-project/oxc/tree/main/crates/oxc_traverse/src)
- [SWC VisitMut API](https://rustdoc.swc.rs/swc_ecma_visit/trait.VisitMut.html)
- [SWC hooks crate](https://docs.rs/swc_ecma_hooks)
- [oxc transformer announcement](https://oxc.rs/blog/2024-09-29-transformer-alpha)
