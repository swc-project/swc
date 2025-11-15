/// OXC Transformer Adapter for SWC
///
/// This module provides infrastructure for porting OXC transformers to work
/// with SWC's `VisitMutHook` API pattern.
///
/// # Overview
///
/// The OXC (Oxidation Compiler) project provides high-performance
/// JavaScript/TypeScript transformers using the `Traverse` trait pattern. SWC
/// uses a different pattern with `VisitMut` for top-level transformers and
/// `VisitMutHook<TraverseCtx>` for composable sub-transformers.
///
/// This adapter layer provides:
///
/// - **TraverseCtx**: A context type compatible with SWC's VisitMutHook pattern
/// - **Transformer**: A base type that implements VisitMut by delegating to
///   VisitMutHook
/// - **Documentation**: Comprehensive guides for porting OXC transformers
///
/// # Architecture
///
/// ```text
/// ┌─────────────────────────────────────────────────────────────┐
/// │                    OXC Transformers                         │
/// │  (Using Traverse trait with enter_*/exit_* methods)         │
/// │  - Uses oxc_ast types                                       │
/// │  - Uses oxc_traverse::TraverseCtx                           │
/// └─────────────────────────────────────────────────────────────┘
///                              │
///                              │ Porting
///                              ▼
/// ┌─────────────────────────────────────────────────────────────┐
/// │              SWC Transformers (This Adapter)                │
/// │  (Using VisitMutHook pattern)                               │
/// │  - Uses swc_ecma_ast types                                  │
/// │  - Uses TraverseCtx from this module                        │
/// │  - Implements VisitMutHook<TraverseCtx>                     │
/// └─────────────────────────────────────────────────────────────┘
///                              │
///                              │ Executes via
///                              ▼
/// ┌─────────────────────────────────────────────────────────────┐
/// │              Transformer<Hook, Context>                     │
/// │  (Implements VisitMut)                                      │
/// │  - Delegates to hook.enter_* and hook.exit_*                │
/// │  - Manages context lifecycle                                │
/// └─────────────────────────────────────────────────────────────┘
/// ```
///
/// # Quick Start
///
/// ```rust,ignore
/// use swc_ecma_ast::*;
/// use swc_ecma_visit::VisitMut;
/// use swc_ecma_hooks::VisitMutHook;
/// use swc_ecma_transforms::oxc_adapter::{Transformer, TraverseCtx};
///
/// // 1. Define your transform as a VisitMutHook
/// struct MyTransform;
///
/// impl VisitMutHook<TraverseCtx> for MyTransform {
///     fn enter_expr(&mut self, node: &mut Expr, ctx: &mut TraverseCtx) {
///         // Your transformation logic here
///         match node {
///             Expr::Bin(bin) => {
///                 // Transform binary expressions
///             }
///             _ => {}
///         }
///     }
/// }
///
/// // 2. Create and use the transformer
/// let mut transformer = Transformer::new(
///     MyTransform,
///     TraverseCtx::new(),
/// );
///
/// // 3. Apply to AST
/// program.visit_mut_with(&mut transformer);
/// ```
///
/// # Porting from OXC
///
/// When porting an OXC transformer:
///
/// 1. **Change the trait**: Replace `Traverse<'a, State>` with
///    `VisitMutHook<TraverseCtx>`
/// 2. **Update AST types**: Replace `oxc_ast` types with `swc_ecma_ast` types
/// 3. **Adapt method names**: Map OXC method names to SWC equivalents
///    - `enter_expression` → `enter_expr`
///    - `exit_statement` → `exit_stmt`
/// 4. **Update context usage**: Use the provided `TraverseCtx` instead of OXC's
///    context
///
/// # Example: Before and After
///
/// ## OXC Pattern (Before)
///
/// ```rust,ignore
/// use oxc_ast::ast::*;
/// use oxc_traverse::Traverse;
///
/// pub struct MyTransform;
///
/// impl<'a> Traverse<'a, TransformState<'a>> for MyTransform {
///     fn enter_expression(&mut self, expr: &mut Expression<'a>, ctx: &mut TraverseCtx<'a>) {
///         // OXC transformation logic
///     }
/// }
/// ```
///
/// ## SWC Pattern (After)
///
/// ```rust,ignore
/// use swc_ecma_ast::*;
/// use swc_ecma_hooks::VisitMutHook;
/// use swc_ecma_transforms::oxc_adapter::TraverseCtx;
///
/// pub struct MyTransform;
///
/// impl VisitMutHook<TraverseCtx> for MyTransform {
///     fn enter_expr(&mut self, node: &mut Expr, ctx: &mut TraverseCtx) {
///         // SWC transformation logic (adapted from OXC)
///     }
/// }
/// ```
///
/// # References
///
/// - [OXC Transformer Documentation](https://oxc.rs/docs/guide/usage/transformer.html)
/// - [SWC VisitMut Documentation](https://rustdoc.swc.rs/swc_ecma_visit/trait.VisitMut.html)
/// - [README with detailed architecture](./README.md)
mod example;
mod transformer;
mod traverse_ctx;

pub use example::ExampleConstantFolding;
pub use transformer::Transformer;
pub use traverse_ctx::{TraverseCtx, TraverseState};
