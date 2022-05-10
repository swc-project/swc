use std::time::Instant;

use rustc_hash::FxHashSet;
use swc_atoms::js_word;
use swc_common::{
    pass::{CompilerPass, Repeated},
    util::take::Take,
    Mark, Span, Spanned, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id, ModuleItemLike, StmtLike, Value};
use swc_ecma_visit::{noop_visit_type, visit_obj_and_computed, Fold, FoldWith, Visit, VisitWith};

pub(crate) mod base54;
pub(crate) mod sort;
pub(crate) mod unit;

///
pub(crate) fn make_number(span: Span, value: f64) -> Expr {
    trace_op!("Creating a numeric literal");
    Expr::Lit(Lit::Num(Number {
        span,
        value,
        raw: None,
    }))
}

pub trait ModuleItemExt:
    StmtLike + ModuleItemLike + From<Stmt> + Spanned + std::fmt::Debug
{
    fn as_module_decl(&self) -> Result<&ModuleDecl, &Stmt>;

    fn from_module_item(item: ModuleItem) -> Self;

    fn into_module_item(self) -> ModuleItem {
        match self.into_module_decl() {
            Ok(v) => ModuleItem::ModuleDecl(v),
            Err(v) => ModuleItem::Stmt(v),
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

    Expr::Unary(UnaryExpr {
        span,
        op: op!("!"),
        arg: Box::new(Expr::Lit(Lit::Num(Number {
            span: DUMMY_SP,
            value: if value { 0.0 } else { 1.0 },
            raw: None,
        }))),
    })
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
                *expr = Expr::Seq(SeqExpr {
                    span: DUMMY_SP,
                    exprs: vec![Box::new(inner)],
                });
                expr.force_seq()
            }
        }
    }

    #[inline]
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
                *to = Expr::Seq(SeqExpr {
                    span: DUMMY_SP,
                    exprs,
                });
            }
        }
    }
}

impl ExprOptExt for Box<Expr> {
    #[inline]
    fn as_expr(&self) -> &Expr {
        self
    }

    #[inline]
    fn as_mut(&mut self) -> &mut Expr {
        self
    }
}

impl ExprOptExt for Expr {
    #[inline]
    fn as_expr(&self) -> &Expr {
        self
    }

    #[inline]
    fn as_mut(&mut self) -> &mut Expr {
        self
    }
}

pub(crate) trait SpanExt: Into<Span> {
    fn with_mark(self, mark: Mark) -> Span {
        let span = self.into();
        span.apply_mark(mark)
    }
}

impl SpanExt for Span {}

pub(crate) fn contains_leaping_continue_with_label<N>(n: &N, label: Id) -> bool
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
    found_yield: bool,
    found_continue_with_label: bool,
    target_label: Option<Id>,
}

impl Visit for LeapFinder {
    noop_visit_type!();

    fn visit_arrow_expr(&mut self, _: &ArrowExpr) {}

    fn visit_class_method(&mut self, _: &ClassMethod) {}

    fn visit_constructor(&mut self, _: &Constructor) {}

    fn visit_continue_stmt(&mut self, n: &ContinueStmt) {
        n.visit_children_with(self);

        if let Some(label) = &n.label {
            self.found_continue_with_label |= self
                .target_label
                .as_ref()
                .map_or(false, |l| *l == label.to_id());
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
        Some(Stmt::Decl(Decl::Var(
            v @ VarDecl {
                kind: VarDeclKind::Var,
                ..
            },
        ))) => v,
        _ => return false,
    };
    var.decls.iter().all(|decl| decl.init.is_none())
}

pub(crate) trait IsModuleItem {
    fn is_module_item() -> bool;
}

impl IsModuleItem for Stmt {
    #[inline]
    fn is_module_item() -> bool {
        false
    }
}

impl IsModuleItem for ModuleItem {
    #[inline]
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

/// TODO(kdy1): Modify swc_visit.
/// Actually we should implement `swc_visit::Repeated` for
/// `swc_visit::Optional`. But I'm too lazy to bump versions.
pub(crate) struct Optional<V> {
    pub enabled: bool,
    pub visitor: V,
}

impl<V> Repeated for Optional<V>
where
    V: Repeated,
{
    #[inline]
    fn changed(&self) -> bool {
        if self.enabled {
            return false;
        }

        self.visitor.changed()
    }

    #[inline]
    fn reset(&mut self) {
        if self.enabled {
            return;
        }

        self.visitor.reset()
    }
}

impl<V> CompilerPass for Optional<V>
where
    V: CompilerPass,
{
    fn name() -> std::borrow::Cow<'static, str> {
        V::name()
    }
}

impl<V> Fold for Optional<V>
where
    V: Fold,
{
    #[inline(always)]
    fn fold_module(&mut self, module: Module) -> Module {
        if !self.enabled {
            return module;
        }
        module.fold_with(&mut self.visitor)
    }
}

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

pub(crate) fn can_end_conditionally(s: &Stmt) -> bool {
    ///
    ///`ignore_always`: If true, [Stmt::Return] will be ignored.
    fn can_end(s: &Stmt, ignore_always: bool) -> bool {
        match s {
            Stmt::If(s) => {
                can_end(&s.cons, false)
                    || s.alt
                        .as_deref()
                        .map(|s| can_end(s, false))
                        .unwrap_or_default()
            }

            Stmt::Switch(s) => s
                .cases
                .iter()
                .any(|case| case.cons.iter().any(|s| can_end(s, false))),

            Stmt::DoWhile(s) => can_end(&s.body, false),

            Stmt::While(s) => can_end(&s.body, false),

            Stmt::For(s) => can_end(&s.body, false),

            Stmt::ForOf(s) => can_end(&s.body, false),

            Stmt::ForIn(s) => can_end(&s.body, false),

            Stmt::Return(..) | Stmt::Break(..) | Stmt::Continue(..) => !ignore_always,

            _ => false,
        }
    }

    can_end(s, true)
}

pub fn now() -> Option<Instant> {
    if cfg!(target_arch = "wasm32") {
        None
    } else {
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

    fn visit_ident(&mut self, i: &Ident) {
        if i.sym == js_word!("eval") {
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
