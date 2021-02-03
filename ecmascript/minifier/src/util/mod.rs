use swc_common::pass::CompilerPass;
use swc_common::pass::Repeated;
use swc_common::Mark;
use swc_common::Span;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::StmtLike;
use swc_ecma_utils::Value;
use swc_ecma_visit::noop_visit_type;
use swc_ecma_visit::Fold;
use swc_ecma_visit::FoldWith;
use swc_ecma_visit::Node;
use swc_ecma_visit::Visit;
use swc_ecma_visit::VisitWith;

pub(crate) mod base54;
pub(crate) mod sort;

///
/// - `!0` for true
/// - `!1` for false
pub(crate) fn make_bool(span: Span, value: bool) -> Expr {
    Expr::Unary(UnaryExpr {
        span,
        op: op!("!"),
        arg: Box::new(Expr::Lit(Lit::Num(Number {
            span: DUMMY_SP,
            value: if value { 0.0 } else { 1.0 },
        }))),
    })
}

/// Addditional methods for optimizing expressions.
pub(crate) trait ExprOptExt: Sized {
    fn as_mut(&mut self) -> &mut Expr;

    /// This returns itself for normal expressions and returns last exprssions
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
    fn as_mut(&mut self) -> &mut Expr {
        self
    }
}

impl ExprOptExt for Expr {
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

pub(crate) fn contains_leaping_yield<N>(n: &N) -> bool
where
    N: VisitWith<LeapFinder>,
{
    let mut v = LeapFinder::default();
    n.visit_with(&Invalid { span: DUMMY_SP }, &mut v);
    v.found_yield
}

#[derive(Default)]
pub(crate) struct LeapFinder {
    found_yield: bool,
}

impl Visit for LeapFinder {
    noop_visit_type!();

    fn visit_yield_expr(&mut self, _: &YieldExpr, _: &dyn Node) {
        self.found_yield = true;
    }

    fn visit_function(&mut self, _: &Function, _: &dyn Node) {}
    fn visit_arrow_expr(&mut self, _: &ArrowExpr, _: &dyn Node) {}
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
