//! Visitor generator for the rust language.
//!
//!
//! There are three variants of visitor in swc. Those are `Fold`, `VisitMut`,
//! `Visit`.
//!
//! # Comparisons
//!
//! ## `Fold` vs `VisitMut`
//!
//! `Fold` and `VisitMut` do almost identical tasks, but `Fold` is easier to use
//! while being slower and weak to stack overflow for very deep asts. `Fold` is
//! fast enough for almost all cases so it would be better to start with `Fold`.
//!
//! By very deep asts, I meant code like thousands of `a + a + a + a + ...`.
//!
//!
//! # `Fold`
//!
//! > WARNING: `Fold` is slow, and it's recommended to use VisitMut if you are
//! experienced.
//!
//!
//! `Fold` takes ownership of value, which means you have to return the new
//! value. Returning new value means returning ownership of the value. But you
//! don't have to care about ownership or about managing memories while using
//! such visitors. `rustc` handles them automatically and all allocations will
//! be freed when it goes out of the scope.
//!
//! You can invoke your `Fold` implementation like `node.fold_with(&mut
//! visitor)` where `visitor` is your visitor. Note that as it takes ownership
//! of value, you have to call `node.fold_children_with(self)` in e.g. `fn
//! fold_module(&mut self, m: Module) -> Module` if you override the default
//! behavior. Also you have to store return value from `fold_children_with`,
//! like `let node = node.fold_children_with(self)`. Order of execution can be
//! controlled using this. If there is some logic that should be applied to the
//! parent first, you can call `fold_children_with` after such logic.
//!
//! # `VisitMut`
//!
//! `VisitMut` uses a mutable reference to AST nodes (e.g. `&mut Expr`). You can
//! use `Take` from `swc_common::util::take::Take` to get owned value from a
//! mutable reference.
//!
//! You will typically use code like
//!
//! ```ignore
//! *e = return_value.take();
//! ```
//!
//! where `e = &mut Expr` and `return_value` is also `&mut Expr`. `take()` is an
//! extension method defined on `MapWithMut`.  It's almost identical to `Fold`,
//! so I'll skip memory management.
//!
//! You can invoke your `VisitMut` implementation like `node.visit_mut_with(&mut
//! visitor)` where `visitor` is your visitor. Again, you need to call
//! `node.visit_mut_children_with(self)` in visitor implementation if you want
//! to modify children nodes. You don't need to store the return value in this
//! case.
//!
//!
//! # `Visit`
//!
//!`Visit` uses non-mutable references to AST nodes. It can be used to see if
//! an AST node contains a specific node nested deeply in the AST. This is
//! useful for checking if AST node contains `this`. This is useful for lots of
//! cases - `this` in arrow expressions are special and we need to generate
//! different code if a `this` expression is used.
//!
//! You can use your `Visit` implementation like  `node.visit_with(&Invalid{
//! span: DUMMY_SP, }, &mut visitor`. I think API is mis-designed, but it works
//! and there are really lots of code using `Visit` already.
//!
//!
//!
//! # Cargo features
//!
//! You should add
//! ```toml
//! [features]
//! path = []
//! ```
//!
//! If you want to allow using path-aware visitor.
//!
//!
//! # Path-aware visitor
//!
//! Path-aware visitor is a visitor that can be used to visit AST nodes with
//! current path from the entrypoint.
//!
//! `VisitMutAstPath` and `FoldAstPath` can be used to transform AST nodes with
//! the path to the node.

pub use either::Either;
pub use swc_visit_macros::define;

pub mod util;

/// Visit all children nodes. This converts `VisitAll` to `Visit`. The type
/// parameter `V` should implement `VisitAll` and `All<V>` implements `Visit`.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct All<V> {
    pub visitor: V,
}

/// A visitor which visits node only if `enabled` is true.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Optional<V> {
    pub enabled: bool,
    pub visitor: V,
}

impl<V> Optional<V> {
    pub const fn new(visitor: V, enabled: bool) -> Self {
        Self { enabled, visitor }
    }
}

/// Trait for a pass which is designed to invoked multiple time to same input.
///
/// See [Repeat].
pub trait Repeated {
    /// Should run again?
    fn changed(&self) -> bool;

    /// Reset.
    fn reset(&mut self);
}

/// A visitor which applies `A` and then `B`.
#[derive(Debug, Default, Clone, Copy, PartialEq, Eq)]
pub struct AndThen<A, B> {
    pub first: A,
    pub second: B,
}

/// Chains multiple visitor.
#[macro_export]
macro_rules! chain {
    ($a:expr, $b:expr) => {{
        use $crate::AndThen;

        AndThen {
            first: $a,
            second: $b,
        }
    }};

    ($a:expr, $b:expr,) => {
        chain!($a, $b)
    };

    ($a:expr, $b:expr,  $($rest:tt)+) => {{
        use $crate::AndThen;

        AndThen{
            first: $a,
            second: chain!($b, $($rest)*),
        }
    }};
}

/// A visitor which applies `V` again and again if `V` modifies the node.
///
/// # Note
/// `V` should return `true` from `changed()` to make the pass run multiple
/// time.
///
/// See: [Repeated]
#[derive(Debug, Default, Clone, Copy, PartialEq, Eq)]
pub struct Repeat<V>
where
    V: Repeated,
{
    pub pass: V,
}

impl<V> Repeat<V>
where
    V: Repeated,
{
    pub fn new(pass: V) -> Self {
        Self { pass }
    }
}

impl<V> Repeated for Repeat<V>
where
    V: Repeated,
{
    fn changed(&self) -> bool {
        self.pass.changed()
    }

    fn reset(&mut self) {
        self.pass.reset()
    }
}

impl<A, B> Repeated for AndThen<A, B>
where
    A: Repeated,
    B: Repeated,
{
    fn changed(&self) -> bool {
        self.first.changed() || self.second.changed()
    }

    fn reset(&mut self) {
        self.first.reset();
        self.second.reset();
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AstKindPath<K>
where
    K: Copy,
{
    path: Vec<K>,
}

impl<K> std::ops::Deref for AstKindPath<K>
where
    K: Copy,
{
    type Target = Vec<K>;

    fn deref(&self) -> &Self::Target {
        &self.path
    }
}

impl<K> Default for AstKindPath<K>
where
    K: Copy,
{
    fn default() -> Self {
        Self {
            path: Default::default(),
        }
    }
}

impl<K> AstKindPath<K>
where
    K: Copy,
{
    pub fn new(path: Vec<K>) -> Self {
        Self { path }
    }

    pub fn with<Ret>(&mut self, path: K, op: impl FnOnce(&mut Self) -> Ret) -> Ret {
        self.path.push(path);
        let ret = op(self);
        self.path.pop();
        ret
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AstNodePath<N>
where
    N: Copy,
{
    path: Vec<N>,
}

impl<N> std::ops::Deref for AstNodePath<N>
where
    N: Copy,
{
    type Target = Vec<N>;

    fn deref(&self) -> &Self::Target {
        &self.path
    }
}

impl<N> Default for AstNodePath<N>
where
    N: Copy,
{
    fn default() -> Self {
        Self {
            path: Default::default(),
        }
    }
}

impl<N> AstNodePath<N>
where
    N: Copy,
{
    pub fn new(path: Vec<N>) -> Self {
        Self { path }
    }

    pub fn with<F, Ret>(&mut self, node: N, op: F) -> Ret
    where
        F: for<'aa> FnOnce(&'aa mut AstNodePath<N>) -> Ret,
    {
        self.path.push(node);
        let ret = op(self);
        self.path.pop();

        ret
    }
}
