#![allow(dead_code)]

use std::time::Instant;

use rustc_hash::FxHashSet;
use swc_atoms::Atom;
use swc_common::{util::take::Take, Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{stack_size::maybe_grow_default, ModuleItemLike, StmtLike, Value};
use swc_ecma_visit::{noop_visit_type, visit_obj_and_computed, Visit, VisitWith};

pub(crate) mod base54;
pub(crate) mod size;
pub(crate) mod sort;
pub(crate) mod unit;

pub(crate) fn make_number(span: Span, value: f64) -> Expr {
    trace_op!("Creating a numeric literal");
    Lit::Num(Number {
        span,
        value,
        raw: None,
    })
    .into()
}

pub trait ModuleItemExt:
    StmtLike + ModuleItemLike + From<Stmt> + Spanned + std::fmt::Debug
{
    fn as_module_decl(&self) -> Result<&ModuleDecl, &Stmt>;

    fn from_module_item(item: ModuleItem) -> Self;

    fn into_module_item(self) -> ModuleItem {
        match self.into_module_decl() {
            Ok(v) => v.into(),
            Err(v) => v.into(),
        }
    }

    fn into_module_decl(self) -> Result<ModuleDecl, Stmt>;
}

impl ModuleItemExt for Stmt {
    fn as_module_decl(&self) -> Result<&ModuleDecl, &Stmt> {
        Err(self)
    }

    fn from_module_item(item: ModuleItem) -> Self {
        item.expect_stmt()
    }

    fn into_module_decl(self) -> Result<ModuleDecl, Stmt> {
        Err(self)
    }
}

impl ModuleItemExt for ModuleItem {
    fn as_module_decl(&self) -> Result<&ModuleDecl, &Stmt> {
        match self {
            ModuleItem::ModuleDecl(v) => Ok(v),
            ModuleItem::Stmt(v) => Err(v),
        }
    }

    fn from_module_item(item: ModuleItem) -> Self {
        item
    }

    fn into_module_decl(self) -> Result<ModuleDecl, Stmt> {
        match self {
            ModuleItem::ModuleDecl(v) => Ok(v),
            ModuleItem::Stmt(v) => Err(v),
        }
    }
}

///
/// - `!0` for true
/// - `!1` for false
pub(crate) fn make_bool(span: Span, value: bool) -> Expr {
    trace_op!("Creating a boolean literal");

    UnaryExpr {
        span,
        op: op!("!"),
        arg: Lit::Num(Number {
            span: DUMMY_SP,
            value: if value { 0.0 } else { 1.0 },
            raw: None,
        })
        .into(),
    }
    .into()
}

/// Additional methods for optimizing expressions.
pub(crate) trait ExprOptExt: Sized {
    fn as_expr(&self) -> &Expr;
    fn as_mut(&mut self) -> &mut Expr;

    fn first_expr_mut(&mut self) -> &mut Expr {
        let expr = self.as_mut();
        match expr {
            Expr::Seq(seq) => seq
                .exprs
                .first_mut()
                .expect("Sequence expressions should have at least one element")
                .first_expr_mut(),
            expr => expr,
        }
    }

    /// This returns itself for normal expressions and returns last expressions
    /// for sequence expressions.
    fn value_mut(&mut self) -> &mut Expr {
        let expr = self.as_mut();
        match expr {
            Expr::Seq(seq) => seq
                .exprs
                .last_mut()
                .expect("Sequence expressions should have at least one element")
                .value_mut(),
            expr => expr,
        }
    }

    fn force_seq(&mut self) -> &mut SeqExpr {
        let expr = self.as_mut();
        match expr {
            Expr::Seq(seq) => seq,
            _ => {
                let inner = expr.take();
                *expr = SeqExpr {
                    span: DUMMY_SP,
                    exprs: vec![Box::new(inner)],
                }
                .into();
                expr.force_seq()
            }
        }
    }

    fn prepend_exprs(&mut self, mut exprs: Vec<Box<Expr>>) {
        if exprs.is_empty() {
            return;
        }

        let to = self.as_mut();
        match to {
            Expr::Seq(to) => {
                exprs.append(&mut to.exprs);
                to.exprs = exprs;
            }
            _ => {
                let v = to.take();
                exprs.push(Box::new(v));
                *to = SeqExpr {
                    span: DUMMY_SP,
                    exprs,
                }
                .into();
            }
        }
    }
}

impl ExprOptExt for Box<Expr> {
    fn as_expr(&self) -> &Expr {
        self
    }

    fn as_mut(&mut self) -> &mut Expr {
        self
    }
}

impl ExprOptExt for Expr {
    fn as_expr(&self) -> &Expr {
        self
    }

    fn as_mut(&mut self) -> &mut Expr {
        self
    }
}

pub(crate) fn contains_leaping_continue_with_label<N>(n: &N, label: Atom) -> bool
where
    N: VisitWith<LeapFinder>,
{
    let mut v = LeapFinder {
        target_label: Some(label),
        ..Default::default()
    };
    n.visit_with(&mut v);
    v.found_continue_with_label
}

#[allow(unused)]
pub(crate) fn contains_leaping_yield<N>(n: &N) -> bool
where
    N: VisitWith<LeapFinder>,
{
    let mut v = LeapFinder::default();
    n.visit_with(&mut v);
    v.found_yield
}

#[derive(Default)]
pub(crate) struct LeapFinder {
    found_await: bool,
    found_yield: bool,
    found_continue_with_label: bool,
    target_label: Option<Atom>,
}

impl Visit for LeapFinder {
    noop_visit_type!();

    fn visit_await_expr(&mut self, n: &AwaitExpr) {
        n.visit_children_with(self);

        self.found_await = true;
    }

    fn visit_arrow_expr(&mut self, _: &ArrowExpr) {}

    fn visit_class_method(&mut self, _: &ClassMethod) {}

    fn visit_constructor(&mut self, _: &Constructor) {}

    fn visit_continue_stmt(&mut self, n: &ContinueStmt) {
        n.visit_children_with(self);

        if let Some(label) = &n.label {
            self.found_continue_with_label |= self
                .target_label
                .as_ref()
                .map_or(false, |l| *l == label.sym);
        }
    }

    fn visit_function(&mut self, _: &Function) {}

    fn visit_getter_prop(&mut self, _: &GetterProp) {}

    fn visit_setter_prop(&mut self, _: &SetterProp) {}

    fn visit_yield_expr(&mut self, n: &YieldExpr) {
        n.visit_children_with(self);

        self.found_yield = true;
    }
}

/// This method returns true only if `T` is `var`. (Not `const` or `let`)
pub(crate) fn is_hoisted_var_decl_without_init<T>(t: &T) -> bool
where
    T: StmtLike,
{
    let var = match t.as_stmt() {
        Some(Stmt::Decl(Decl::Var(v)))
            if matches!(
                &**v,
                VarDecl {
                    kind: VarDeclKind::Var,
                    ..
                }
            ) =>
        {
            v
        }
        _ => return false,
    };
    var.decls.iter().all(|decl| decl.init.is_none())
}

pub(crate) trait IsModuleItem {
    fn is_module_item() -> bool;
}

impl IsModuleItem for Stmt {
    fn is_module_item() -> bool {
        false
    }
}

impl IsModuleItem for ModuleItem {
    fn is_module_item() -> bool {
        true
    }
}

pub trait ValueExt<T>: Into<Value<T>> {
    fn opt(self) -> Option<T> {
        match self.into() {
            Value::Known(v) => Some(v),
            _ => None,
        }
    }
}

impl<T> ValueExt<T> for Value<T> {}

pub struct DeepThisExprVisitor {
    found: bool,
}

impl Visit for DeepThisExprVisitor {
    noop_visit_type!();

    fn visit_this_expr(&mut self, _: &ThisExpr) {
        self.found = true;
    }
}

pub fn deeply_contains_this_expr<N>(body: &N) -> bool
where
    N: VisitWith<DeepThisExprVisitor>,
{
    let mut visitor = DeepThisExprVisitor { found: false };
    body.visit_with(&mut visitor);
    visitor.found
}

#[derive(Default)]
pub(crate) struct IdentUsageCollector {
    ids: FxHashSet<Id>,
    ignore_nested: bool,
}

impl Visit for IdentUsageCollector {
    noop_visit_type!();

    visit_obj_and_computed!();

    fn visit_block_stmt_or_expr(&mut self, n: &BlockStmtOrExpr) {
        if self.ignore_nested {
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_constructor(&mut self, n: &Constructor) {
        if self.ignore_nested {
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_function(&mut self, n: &Function) {
        if self.ignore_nested {
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_getter_prop(&mut self, n: &GetterProp) {
        if self.ignore_nested {
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_setter_prop(&mut self, n: &SetterProp) {
        if self.ignore_nested {
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_ident(&mut self, n: &Ident) {
        self.ids.insert(n.to_id());
    }

    fn visit_prop_name(&mut self, n: &PropName) {
        if let PropName::Computed(..) = n {
            n.visit_children_with(self);
        }
    }
}

#[derive(Default)]
pub(crate) struct CapturedIdCollector {
    ids: FxHashSet<Id>,
    is_nested: bool,
}

impl Visit for CapturedIdCollector {
    noop_visit_type!();

    visit_obj_and_computed!();

    fn visit_block_stmt_or_expr(&mut self, n: &BlockStmtOrExpr) {
        let old = self.is_nested;
        self.is_nested = true;
        n.visit_children_with(self);
        self.is_nested = old;
    }

    fn visit_constructor(&mut self, n: &Constructor) {
        let old = self.is_nested;
        self.is_nested = true;
        n.visit_children_with(self);
        self.is_nested = old;
    }

    fn visit_function(&mut self, n: &Function) {
        let old = self.is_nested;
        self.is_nested = true;
        n.visit_children_with(self);
        self.is_nested = old;
    }

    fn visit_ident(&mut self, n: &Ident) {
        if self.is_nested {
            self.ids.insert(n.to_id());
        }
    }

    fn visit_prop_name(&mut self, n: &PropName) {
        if let PropName::Computed(..) = n {
            n.visit_children_with(self);
        }
    }
}

pub(crate) fn idents_captured_by<N>(n: &N) -> FxHashSet<Id>
where
    N: VisitWith<CapturedIdCollector>,
{
    let mut v = CapturedIdCollector {
        is_nested: false,
        ..Default::default()
    };
    n.visit_with(&mut v);
    v.ids
}

pub(crate) fn idents_used_by<N>(n: &N) -> FxHashSet<Id>
where
    N: VisitWith<IdentUsageCollector>,
{
    let mut v = IdentUsageCollector {
        ignore_nested: false,
        ..Default::default()
    };
    n.visit_with(&mut v);
    v.ids
}

pub(crate) fn idents_used_by_ignoring_nested<N>(n: &N) -> FxHashSet<Id>
where
    N: VisitWith<IdentUsageCollector>,
{
    let mut v = IdentUsageCollector {
        ignore_nested: true,
        ..Default::default()
    };
    n.visit_with(&mut v);
    v.ids
}

pub fn now() -> Option<Instant> {
    #[cfg(target_arch = "wasm32")]
    {
        None
    }
    #[cfg(not(target_arch = "wasm32"))]
    {
        Some(Instant::now())
    }
}

pub(crate) fn contains_eval<N>(node: &N, include_with: bool) -> bool
where
    N: VisitWith<EvalFinder>,
{
    let mut v = EvalFinder {
        found: false,
        include_with,
    };

    node.visit_with(&mut v);
    v.found
}

pub(crate) struct EvalFinder {
    found: bool,
    include_with: bool,
}

impl Visit for EvalFinder {
    noop_visit_type!();

    visit_obj_and_computed!();

    fn visit_expr(&mut self, n: &Expr) {
        maybe_grow_default(|| n.visit_children_with(self));
    }

    fn visit_ident(&mut self, i: &Ident) {
        if i.sym == "eval" {
            self.found = true;
        }
    }

    fn visit_with_stmt(&mut self, s: &WithStmt) {
        if self.include_with {
            self.found = true;
        } else {
            s.visit_children_with(self);
        }
    }
}

#[cfg(feature = "concurrent")]
#[macro_export(local_inner_macros)]
#[allow(clippy::crate_in_macro_def)]
macro_rules! maybe_par {
  ($prefix:ident.$name:ident.iter().$operator:ident($($rest:expr)*), $threshold:expr) => {
      if $prefix.$name.len() >= $threshold {
          use rayon::prelude::*;
          $prefix.$name.par_iter().$operator($($rest)*)
      } else {
          $prefix.$name.iter().$operator($($rest)*)
      }
  };

  ($prefix:ident.$name:ident.into_iter().$operator:ident($($rest:expr)*), $threshold:expr) => {
      if $prefix.$name.len() >= $threshold {
          use rayon::prelude::*;
          $prefix.$name.into_par_iter().$operator($($rest)*)
      } else {
          $prefix.$name.into_iter().$operator($($rest)*)
      }
  };

  ($name:ident.iter().$operator:ident($($rest:expr)*), $threshold:expr) => {
      if $name.len() >= $threshold {
          use rayon::prelude::*;
          $name.par_iter().$operator($($rest)*)
      } else {
          $name.iter().$operator($($rest)*)
      }
  };

  ($name:ident.into_iter().$operator:ident($($rest:expr)*), $threshold:expr) => {
      if $name.len() >= $threshold {
          use rayon::prelude::*;
          $name.into_par_iter().$operator($($rest)*)
      } else {
          $name.into_iter().$operator($($rest)*)
      }
  };

  ($name:ident.iter_mut().$operator:ident($($rest:expr)*), $threshold:expr) => {
      if $name.len() >= $threshold {
          use rayon::prelude::*;
          $name.par_iter_mut().$operator($($rest)*)
      } else {
          $name.iter_mut().$operator($($rest)*)
      }
  };

  ($name:ident.iter().$operator:ident($($rest:expr)*).$operator2:ident($($rest2:expr)*), $threshold:expr) => {
      if $name.len() >= $threshold {
          use rayon::prelude::*;
          $name.par_iter().$operator($($rest)*).$operator2($($rest2)*)
      } else {
          $name.iter().$operator($($rest)*).$operator2($($rest2)*)
      }
  };

  ($name:ident.into_iter().$operator:ident($($rest:expr)*).$operator2:ident($($rest2:expr)*), $threshold:expr) => {
      if $name.len() >= $threshold {
          use rayon::prelude::*;
          $name.into_par_iter().$operator($($rest)*).$operator2($($rest2)*)
      } else {
          $name.into_iter().$operator($($rest)*).$operator2($($rest2)*)
      }
  };

  ($name:ident.iter_mut().$operator:ident($($rest:expr)*).$operator2:ident($($rest2:expr)*), $threshold:expr) => {
      if $name.len() >= $threshold {
          use rayon::prelude::*;
          $name.par_iter_mut().$operator($($rest)*).$operator2($($rest2)*)
      } else {
          $name.iter_mut().$operator($($rest)*).$operator2($($rest2)*)
      }
  };

  ($name:ident.iter().$operator:ident($($rest:expr)*).$operator2:ident::<$t:ty>($($rest2:expr)*), $threshold:expr) => {
      if $name.len() >= $threshold {
          use rayon::prelude::*;
          $name.par_iter().$operator($($rest)*).$operator2::<$t>($($rest2)*)
      } else {
          $name.iter().$operator($($rest)*).$operator2::<$t>($($rest2)*)
      }
  };

  ($name:ident.iter().$operator:ident($($rest:expr)*).$operator2:ident($($rest2:expr)*).$operator3:ident($($rest3:expr)*), $threshold:expr) => {
      if $name.len() >= $threshold {
          use rayon::prelude::*;
          $name.par_iter().$operator($($rest)*).$operator2($($rest2)*).$operator3($($rest3)*)
      } else {
          $name.iter().$operator($($rest)*).$operator2($($rest2)*).$operator3($($rest3)*)
      }
  };
}

#[cfg(not(feature = "concurrent"))]
#[macro_export(local_inner_macros)]
#[allow(clippy::crate_in_macro_def)]
macro_rules! maybe_par {
  ($prefix:ident.$name:ident.iter().$operator:ident($($rest:expr)*), $threshold:expr) => {
    $prefix.$name.iter().$operator($($rest)*)
  };

  ($prefix:ident.$name:ident.into_iter().$operator:ident($($rest:expr)*), $threshold:expr) => {
    $prefix.$name.into_iter().$operator($($rest)*)
  };

  ($name:ident.iter().$operator:ident($($rest:expr)*), $threshold:expr) => {
    $name.iter().$operator($($rest)*)
  };

  ($name:ident.into_iter().$operator:ident($($rest:expr)*), $threshold:expr) => {
    $name.into_iter().$operator($($rest)*)
  };

  ($name:ident.iter_mut().$operator:ident($($rest:expr)*), $threshold:expr) => {
    $name.iter_mut().$operator($($rest)*)
  };

  ($name:ident.iter().$operator:ident($($rest:expr)*).$operator2:ident($($rest2:expr)*), $threshold:expr) => {
    $name.iter().$operator($($rest)*).$operator2($($rest2)*)
  };

  ($name:ident.into_iter().$operator:ident($($rest:expr)*).$operator2:ident($($rest2:expr)*), $threshold:expr) => {
    $name.into_iter().$operator($($rest)*).$operator2($($rest2)*)
  };

  ($name:ident.iter_mut().$operator:ident($($rest:expr)*).$operator2:ident($($rest2:expr)*), $threshold:expr) => {
    $name.iter_mut().$operator($($rest)*).$operator2($($rest2)*)
  };

  ($name:ident.iter().$operator:ident($($rest:expr)*).$operator2:ident::<$t:ty>($($rest2:expr)*), $threshold:expr) => {
    $name.iter().$operator($($rest)*).$operator2::<$t>($($rest2)*)
  };

  ($name:ident.iter().$operator:ident($($rest:expr)*).$operator2:ident($($rest2:expr)*).$operator3:ident($($rest3:expr)*), $threshold:expr) => {
    $name.iter().$operator($($rest)*).$operator2($($rest2)*).$operator3($($rest3)*)
  };
}
