use swc_common::{collections::AHashSet, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::ExprFactory;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

pub fn is_builtin_hook(name: &Ident) -> bool {
    matches!(
        name.sym.as_ref(),
        "useState"
            | "useReducer"
            | "useEffect"
            | "useLayoutEffect"
            | "useMemo"
            | "useCallback"
            | "useRef"
            | "useContext"
            | "useImperativeHandle"
            | "useDebugValue"
    )
}

pub fn is_body_arrow_fn(body: &BlockStmtOrExpr) -> bool {
    if let BlockStmtOrExpr::Expr(body) = body {
        body.is_arrow()
    } else {
        false
    }
}

fn assert_hygiene(e: &Expr) {
    if !cfg!(debug_assertions) {
        return;
    }

    if let Expr::Ident(i) = e {
        if i.span.ctxt == SyntaxContext::empty() {
            panic!("`{}` should be resolved", i)
        }
    }
}

pub fn make_assign_stmt(handle: Ident, expr: Box<Expr>) -> Expr {
    assert_hygiene(&expr);

    Expr::Assign(AssignExpr {
        span: expr.span(),
        op: op!("="),
        left: PatOrExpr::Pat(handle.into()),
        right: expr,
    })
}

pub fn make_call_stmt(handle: Ident) -> Stmt {
    Stmt::Expr(ExprStmt {
        span: DUMMY_SP,
        expr: Box::new(make_call_expr(handle)),
    })
}

pub fn make_call_expr(handle: Ident) -> Expr {
    Expr::Call(CallExpr {
        span: DUMMY_SP,
        callee: handle.as_callee(),
        args: Vec::new(),
        type_args: None,
    })
}

pub fn is_import_or_require(expr: &Expr) -> bool {
    match expr {
        Expr::Call(CallExpr {
            callee: Callee::Expr(expr),
            ..
        }) => {
            if let Expr::Ident(ident) = expr.as_ref() {
                ident.sym.contains("require")
            } else {
                false
            }
        }
        Expr::Call(CallExpr {
            callee: Callee::Import(_),
            ..
        }) => true,
        _ => false,
    }
}

pub struct UsedInJsx(AHashSet<Id>);

impl Visit for UsedInJsx {
    noop_visit_type!();

    fn visit_call_expr(&mut self, n: &CallExpr) {
        n.visit_children_with(self);

        if let Callee::Expr(expr) = &n.callee {
            let ident = match expr.as_ref() {
                Expr::Ident(ident) => ident,
                Expr::Member(MemberExpr {
                    prop: MemberProp::Ident(ident),
                    ..
                }) => ident,
                _ => return,
            };
            if matches!(
                ident.sym.as_ref(),
                "createElement" | "jsx" | "jsxDEV" | "jsxs"
            ) {
                if let Some(ExprOrSpread { expr, .. }) = n.args.get(0) {
                    if let Expr::Ident(ident) = expr.as_ref() {
                        self.0.insert(ident.to_id());
                    }
                }
            }
        }
    }

    fn visit_jsx_opening_element(&mut self, n: &JSXOpeningElement) {
        if let JSXElementName::Ident(ident) = &n.name {
            self.0.insert(ident.to_id());
        }
    }
}

pub fn collect_ident_in_jsx<V: VisitWith<UsedInJsx>>(item: &V) -> AHashSet<Id> {
    let mut visitor = UsedInJsx(AHashSet::default());
    item.visit_with(&mut visitor);
    visitor.0
}
