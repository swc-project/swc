// This is not a public api.
#![cfg_attr(docsrs, feature(doc_cfg))]
#![deny(clippy::all)]
#![allow(clippy::ptr_arg)]

#[doc(hidden)]
pub extern crate swc_ecma_ast;

use std::{borrow::Cow, fmt::Debug};

use swc_allocator::arena::{Allocator, Vec};
use swc_common::{arena::Take, pass::CompilerPass, Span, DUMMY_SP};
use swc_ecma_ast::arena::*;
use swc_visit::{Repeat, Repeated};

pub use self::generated::*;
mod generated;

pub fn fold_pass<'a, V>(allocator: &'a Allocator, pass: V) -> FoldPass<'a, V>
where
    V: Fold<'a>,
{
    FoldPass { allocator, pass }
}

pub struct FoldPass<'a, V> {
    allocator: &'a Allocator,
    pass: V,
}

impl<'a, V> Pass<'a> for FoldPass<'a, V>
where
    V: Fold<'a>,
{
    #[inline(always)]
    fn process(&mut self, program: &mut Program<'a>) {
        program.map_with_mut(self.allocator, |p| p.fold_with(&mut self.pass));
    }
}

impl<'a, V> Fold<'a> for FoldPass<'a, V>
where
    V: Fold<'a>,
{
    #[inline(always)]
    fn fold_program(&mut self, node: Program<'a>) -> Program<'a> {
        self.pass.fold_program(node)
    }

    #[inline(always)]
    fn fold_module(&mut self, node: Module<'a>) -> Module<'a> {
        self.pass.fold_module(node)
    }

    #[inline(always)]
    fn fold_script(&mut self, node: Script<'a>) -> Script<'a> {
        self.pass.fold_script(node)
    }

    #[inline(always)]
    fn fold_stmt(&mut self, node: Stmt<'a>) -> Stmt<'a> {
        self.pass.fold_stmt(node)
    }

    #[inline(always)]
    fn fold_module_item(&mut self, item: ModuleItem<'a>) -> ModuleItem<'a> {
        self.pass.fold_module_item(item)
    }

    #[inline(always)]
    fn fold_expr(&mut self, expr: Expr<'a>) -> Expr<'a> {
        self.pass.fold_expr(expr)
    }

    #[inline(always)]
    fn fold_pat(&mut self, pat: Pat<'a>) -> Pat<'a> {
        self.pass.fold_pat(pat)
    }

    #[inline(always)]
    fn fold_assign_target(&mut self, target: AssignTarget<'a>) -> AssignTarget<'a> {
        self.pass.fold_assign_target(target)
    }

    #[inline(always)]
    fn fold_ident(&mut self, ident: Ident) -> Ident {
        self.pass.fold_ident(ident)
    }
}

impl<'a, V> Repeated for FoldPass<'a, V>
where
    V: Fold<'a> + Repeated,
{
    fn changed(&self) -> bool {
        self.pass.changed()
    }

    fn reset(&mut self) {
        self.pass.reset();
    }
}

impl<'a, V> CompilerPass for FoldPass<'a, V>
where
    V: Fold<'a> + CompilerPass,
{
    fn name(&self) -> Cow<'static, str> {
        self.pass.name()
    }
}

pub fn visit_mut_pass<'a, V>(pass: V) -> VisitMutPass<V>
where
    V: VisitMut<'a>,
{
    VisitMutPass { pass }
}

pub struct VisitMutPass<V> {
    pass: V,
}

impl<'a, V> Pass<'a> for VisitMutPass<V>
where
    V: VisitMut<'a>,
{
    #[inline(always)]
    fn process(&mut self, program: &mut Program<'a>) {
        program.visit_mut_with(&mut self.pass);
    }
}

impl<'a, V> VisitMut<'a> for VisitMutPass<V>
where
    V: VisitMut<'a>,
{
    #[inline(always)]
    fn visit_mut_program(&mut self, program: &mut Program<'a>) {
        self.pass.visit_mut_program(program);
    }

    #[inline(always)]
    fn visit_mut_module(&mut self, module: &mut Module<'a>) {
        self.pass.visit_mut_module(module);
    }

    #[inline(always)]
    fn visit_mut_script(&mut self, script: &mut Script<'a>) {
        self.pass.visit_mut_script(script);
    }

    #[inline(always)]
    fn visit_mut_module_item(&mut self, item: &mut ModuleItem<'a>) {
        self.pass.visit_mut_module_item(item);
    }

    #[inline(always)]
    fn visit_mut_stmt(&mut self, stmt: &mut Stmt<'a>) {
        self.pass.visit_mut_stmt(stmt);
    }

    #[inline(always)]
    fn visit_mut_expr(&mut self, expr: &mut Expr<'a>) {
        self.pass.visit_mut_expr(expr);
    }

    #[inline(always)]
    fn visit_mut_pat(&mut self, pat: &mut Pat<'a>) {
        self.pass.visit_mut_pat(pat);
    }

    #[inline(always)]
    fn visit_mut_assign_target(&mut self, target: &mut AssignTarget<'a>) {
        self.pass.visit_mut_assign_target(target);
    }

    #[inline(always)]
    fn visit_mut_ident(&mut self, ident: &mut Ident) {
        self.pass.visit_mut_ident(ident);
    }
}

impl<'a, V> Repeated for VisitMutPass<V>
where
    V: VisitMut<'a> + Repeated,
{
    fn changed(&self) -> bool {
        self.pass.changed()
    }

    fn reset(&mut self) {
        self.pass.reset();
    }
}

impl<'a, V> CompilerPass for VisitMutPass<V>
where
    V: VisitMut<'a> + CompilerPass,
{
    fn name(&self) -> Cow<'static, str> {
        self.pass.name()
    }
}

pub fn visit_pass<'a, V>(pass: V) -> VisitPass<V>
where
    V: Visit<'a>,
{
    VisitPass { pass }
}

pub struct VisitPass<V> {
    pass: V,
}

impl<'a, V> Pass<'a> for VisitPass<V>
where
    V: Visit<'a>,
{
    #[inline(always)]
    fn process(&mut self, program: &mut Program<'a>) {
        program.visit_with(&mut self.pass);
    }
}

impl<'a, V> Repeated for VisitPass<V>
where
    V: Visit<'a> + Repeated,
{
    fn changed(&self) -> bool {
        self.pass.changed()
    }

    fn reset(&mut self) {
        self.pass.reset();
    }
}

impl<'a, V> CompilerPass for VisitPass<V>
where
    V: Visit<'a> + CompilerPass,
{
    fn name(&self) -> Cow<'static, str> {
        self.pass.name()
    }
}

impl<'a, V> Fold<'a> for Repeat<V>
where
    V: Fold<'a> + Repeated,
{
    fn fold_program(&mut self, mut node: Program<'a>) -> Program<'a> {
        loop {
            self.pass.reset();
            node = node.fold_with(&mut self.pass);

            if !self.pass.changed() {
                break;
            }
        }

        node
    }

    fn fold_module(&mut self, mut node: Module<'a>) -> Module<'a> {
        loop {
            self.pass.reset();
            node = node.fold_with(&mut self.pass);

            if !self.pass.changed() {
                break;
            }
        }

        node
    }

    fn fold_script(&mut self, mut node: Script<'a>) -> Script<'a> {
        loop {
            self.pass.reset();
            node = node.fold_with(&mut self.pass);

            if !self.pass.changed() {
                break;
            }
        }

        node
    }
}

impl<'a, V> VisitMut<'a> for Repeat<V>
where
    V: VisitMut<'a> + Repeated,
{
    fn visit_mut_program(&mut self, node: &mut Program<'a>) {
        loop {
            self.pass.reset();
            node.visit_mut_with(&mut self.pass);

            if !self.pass.changed() {
                break;
            }
        }
    }

    fn visit_mut_module(&mut self, node: &mut Module<'a>) {
        loop {
            self.pass.reset();
            node.visit_mut_with(&mut self.pass);

            if !self.pass.changed() {
                break;
            }
        }
    }

    fn visit_mut_script(&mut self, node: &mut Script<'a>) {
        loop {
            self.pass.reset();
            node.visit_mut_with(&mut self.pass);

            if !self.pass.changed() {
                break;
            }
        }
    }
}

/// Not a public api.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
struct SpanRemover;

/// Returns a `Fold` which changes all span into `DUMMY_SP`.
pub fn span_remover<'a>() -> impl Debug + Fold<'a> + Copy + Eq + Default + 'static {
    SpanRemover
}

impl Fold<'_> for SpanRemover {
    fn fold_span(&mut self, _: Span) -> Span {
        DUMMY_SP
    }
}

#[macro_export]
macro_rules! assert_eq_ignore_span_arena {
    ($l:expr, $r:expr) => {{
        use swc_ecma_visit::arena::FoldWith;
        let l = $l.fold_with(&mut swc_ecma_visit::arena::span_remover());
        let r = $r.fold_with(&mut swc_ecma_visit::arena::span_remover());

        assert_eq!(l, r);
    }};

    ($l:expr, $r:expr, $($tts:tt)*) => {{
        use swc_ecma_visit::arena::FoldWith;
        let l = $l.fold_with(&mut swc_ecma_visit::arena::span_remover());
        let r = $r.fold_with(&mut swc_ecma_visit::arena::span_remover());

        assert_eq!(l, r, $($tts)*);
    }};
}

/// Implemented for passes which inject variables.
///
/// If a pass depends on other pass which injects variables, this trait can be
/// used to keep the variables.
pub trait InjectVars {
    fn take_vars(&mut self) -> Vec<VarDeclarator>;
}

impl<'a, V> InjectVars for FoldPass<'a, V>
where
    V: Fold<'a> + InjectVars,
{
    fn take_vars(&mut self) -> Vec<VarDeclarator> {
        self.pass.take_vars()
    }
}

impl<'a, V> InjectVars for VisitMutPass<V>
where
    V: VisitMut<'a> + InjectVars,
{
    fn take_vars(&mut self) -> Vec<VarDeclarator> {
        self.pass.take_vars()
    }
}

impl<'a, V> InjectVars for VisitPass<V>
where
    V: Visit<'a> + InjectVars,
{
    fn take_vars(&mut self) -> Vec<VarDeclarator> {
        self.pass.take_vars()
    }
}

macro_rules! impl_traits_for_tuple {
    (
        [$idx:tt, $name:ident], $([$idx_rest:tt, $name_rest:ident]),*
    ) => {
        impl<'a, $name, $($name_rest),*> VisitMut<'a> for ($name, $($name_rest),*)
        where
            $name: VisitMut<'a>,
            $($name_rest: VisitMut<'a>),*
        {

            fn visit_mut_program(&mut self, program: &mut Program<'a>) {
                self.$idx.visit_mut_program(program);

                $(
                    self.$idx_rest.visit_mut_program(program);
                )*
            }

            fn visit_mut_module(&mut self, module: &mut Module<'a>) {
                self.$idx.visit_mut_module(module);

                $(
                    self.$idx_rest.visit_mut_module(module);
                )*
            }

            fn visit_mut_script(&mut self, script: &mut Script<'a>) {
                self.$idx.visit_mut_script(script);

                $(
                    self.$idx_rest.visit_mut_script(script);
                )*
            }

            fn visit_mut_stmt(&mut self, stmt: &mut Stmt<'a>) {
                self.$idx.visit_mut_stmt(stmt);

                $(
                    self.$idx_rest.visit_mut_stmt(stmt);
                )*
            }

            fn visit_mut_expr(&mut self, expr: &mut Expr<'a>) {
                self.$idx.visit_mut_expr(expr);

                $(
                    self.$idx_rest.visit_mut_expr(expr);
                )*
            }

            fn visit_mut_pat(&mut self, pat: &mut Pat<'a>) {
                self.$idx.visit_mut_pat(pat);

                $(
                    self.$idx_rest.visit_mut_pat(pat);
                )*
            }

            fn visit_mut_assign_target(&mut self, target: &mut AssignTarget<'a>) {
                self.$idx.visit_mut_assign_target(target);

                $(
                    self.$idx_rest.visit_mut_assign_target(target);
                )*
            }

            fn visit_mut_ident(&mut self, ident: &mut Ident) {
                self.$idx.visit_mut_ident(ident);

                $(
                    self.$idx_rest.visit_mut_ident(ident);
                )*
            }
        }
    };
}

impl_traits_for_tuple!([0, A], [1, B]);
impl_traits_for_tuple!([0, A], [1, B], [2, C]);
impl_traits_for_tuple!([0, A], [1, B], [2, C], [3, D]);
impl_traits_for_tuple!([0, A], [1, B], [2, C], [3, D], [4, E]);
impl_traits_for_tuple!([0, A], [1, B], [2, C], [3, D], [4, E], [5, F]);
impl_traits_for_tuple!([0, A], [1, B], [2, C], [3, D], [4, E], [5, F], [6, G]);
impl_traits_for_tuple!(
    [0, A],
    [1, B],
    [2, C],
    [3, D],
    [4, E],
    [5, F],
    [6, G],
    [7, H]
);
impl_traits_for_tuple!(
    [0, A],
    [1, B],
    [2, C],
    [3, D],
    [4, E],
    [5, F],
    [6, G],
    [7, H],
    [8, I]
);
impl_traits_for_tuple!(
    [0, A],
    [1, B],
    [2, C],
    [3, D],
    [4, E],
    [5, F],
    [6, G],
    [7, H],
    [8, I],
    [9, J]
);
impl_traits_for_tuple!(
    [0, A],
    [1, B],
    [2, C],
    [3, D],
    [4, E],
    [5, F],
    [6, G],
    [7, H],
    [8, I],
    [9, J],
    [10, K]
);
impl_traits_for_tuple!(
    [0, A],
    [1, B],
    [2, C],
    [3, D],
    [4, E],
    [5, F],
    [6, G],
    [7, H],
    [8, I],
    [9, J],
    [10, K],
    [11, L]
);
impl_traits_for_tuple!(
    [0, A],
    [1, B],
    [2, C],
    [3, D],
    [4, E],
    [5, F],
    [6, G],
    [7, H],
    [8, I],
    [9, J],
    [10, K],
    [11, L],
    [12, M]
);
