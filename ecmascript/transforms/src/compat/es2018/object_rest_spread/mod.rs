use crate::{
    compat::helpers::Helpers,
    util::{ExprFactory, StmtLike},
};
use ast::*;
use std::{
    mem,
    sync::{atomic::Ordering, Arc},
};
use swc_common::{Fold, FoldWith, Mark, Visit, VisitWith, DUMMY_SP};

#[cfg(test)]
mod tests;

pub fn object_rest_spread(helpers: Arc<Helpers>) -> impl Fold<Module> {
    chain!(
        ObjectRest {
            helpers: helpers.clone(),
        },
        ObjectSpread { helpers }
    )
}

struct ObjectRest {
    helpers: Arc<Helpers>,
}

struct RestFolder {
    /// Injected before the original statement.
    helpers: Arc<Helpers>,
    vars: Vec<VarDeclarator>,
    /// Injected after the original statement.
    stmts: Vec<Stmt>,
}

/// Handles assign expression
impl Fold<Expr> for RestFolder {
    fn fold(&mut self, expr: Expr) -> Expr {
        // fast path
        if !contains_rest(&expr) {
            return expr;
        }

        let expr = expr.fold_children(self);

        match expr {
            Expr::Assign(AssignExpr {
                span,
                left:
                    PatOrExpr::Pat(box Pat::Object(ObjectPat {
                        span: props_span,
                        mut props,
                    })),
                op: op!("="),
                right,
            }) => {
                match props.last() {
                    Some(ObjectPatProp::Rest(..)) => {}
                    _ => {
                        return Expr::Assign(AssignExpr {
                            span,
                            left: PatOrExpr::Pat(box Pat::Object(ObjectPat {
                                span: props_span,
                                props,
                            })),
                            op: op!("="),
                            right,
                        });
                    }
                }
                let last = match props.pop() {
                    Some(ObjectPatProp::Rest(rest_pat)) => rest_pat,
                    _ => unreachable!(),
                };

                let mark = Mark::fresh(Mark::root());
                let mut var_ident = match *right {
                    Expr::Ident(ref ident) => quote_ident!(format!("_{}", ident.sym)),
                    _ => quote_ident!("_tmp"),
                };
                var_ident.span = var_ident.span.apply_mark(mark);

                self.vars.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Ident(var_ident.clone()),
                    init: Some(right),
                });

                let excluded_props = props
                    .iter()
                    .map(|prop| match prop {
                        ObjectPatProp::KeyValue(KeyValuePatProp { key, .. }) => match key {
                            PropName::Ident(ident) => Lit::Str(Str {
                                span: ident.span,
                                value: ident.sym.clone(),
                                has_escape: false,
                            })
                            .as_arg(),
                            PropName::Str(s) => Lit::Str(s.clone()).as_arg(),
                            _ => {
                                unimplemented!("numeric / computed property name with object rest")
                            }
                        },
                        ObjectPatProp::Assign(AssignPatProp { key, .. }) => Lit::Str(Str {
                            span: key.span,
                            value: key.sym.clone(),
                            has_escape: false,
                        })
                        .as_arg(),
                        ObjectPatProp::Rest(..) => {
                            unreachable!("invalid syntax (multiple rest element)")
                        }
                    })
                    .map(Some)
                    .collect();

                self.helpers
                    .object_without_properties
                    .store(true, Ordering::Relaxed);
                self.stmts.push(Stmt::Expr(box Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    left: PatOrExpr::Pat(last.arg),
                    op: op!("="),
                    // we exclude properties using helper
                    right: box Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        callee: quote_ident!("_objectWithoutProperties").as_callee(),
                        args: vec![
                            var_ident.clone().as_arg(),
                            ArrayLit {
                                span: DUMMY_SP,
                                elems: excluded_props,
                            }
                            .as_arg(),
                        ],
                    }),
                })));

                Expr::Assign(AssignExpr {
                    span,
                    left: PatOrExpr::Pat(box Pat::Object(ObjectPat {
                        span: props_span,
                        props,
                    })),
                    op: op!("="),
                    right: box Expr::Ident(var_ident.clone()),
                })
            }
            _ => expr,
        }
    }
}

struct RestVisitor {
    found: bool,
}

impl Visit<RestPat> for RestVisitor {
    fn visit(&mut self, _: &RestPat) {
        self.found = true;
    }
}

fn contains_rest<N>(node: &N) -> bool
where
    N: VisitWith<RestVisitor>,
{
    let mut v = RestVisitor { found: false };
    node.visit_with(&mut v);
    v.found
}

impl<T: StmtLike + VisitWith<RestVisitor>> Fold<Vec<T>> for ObjectRest
where
    Vec<T>: FoldWith<Self>,
{
    fn fold(&mut self, stmts: Vec<T>) -> Vec<T> {
        if !contains_rest(&stmts) {
            return stmts;
        }
        let stmts = stmts.fold_children(self);

        let mut buf = vec![];

        for stmt in stmts {
            match stmt.try_into_stmt() {
                Err(module_item) => buf.push(module_item),
                Ok(stmt) => {
                    let mut folder = RestFolder {
                        helpers: self.helpers.clone(),
                        vars: vec![],
                        stmts: vec![],
                    };
                    let stmt = stmt.fold_with(&mut folder);

                    // Add variable declaration
                    // e.g. var ref
                    if !folder.vars.is_empty() {
                        buf.push(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Var,
                            decls: folder.vars,
                        }))));
                    }

                    buf.push(T::from_stmt(stmt));
                    buf.extend(folder.stmts.into_iter().map(T::from_stmt))
                }
            }
        }

        buf
    }
}

struct ObjectSpread {
    helpers: Arc<Helpers>,
}

impl Fold<Expr> for ObjectSpread {
    fn fold(&mut self, expr: Expr) -> Expr {
        // fast-path
        if !contains_spread(&expr) {
            return expr;
        }

        let expr = expr.fold_children(self);

        match expr {
            Expr::Object(ObjectLit { span, props }) => {
                let has_spread = props.iter().any(|p| match p {
                    PropOrSpread::Spread(..) => true,
                    _ => false,
                });
                if !has_spread {
                    return Expr::Object(ObjectLit { span, props });
                }

                let mut first = true;

                // { foo, ...x } => ({ foo }, x)
                let args = {
                    let mut buf = vec![];
                    let mut obj = ObjectLit {
                        span: DUMMY_SP,
                        props: vec![],
                    };
                    for prop in props {
                        match prop {
                            PropOrSpread::Prop(..) => obj.props.push(prop),
                            PropOrSpread::Spread(SpreadElement {
                                dot3_token: _,
                                expr,
                            }) => {
                                // Push object if it's not empty
                                if first || !obj.props.is_empty() {
                                    let obj = mem::replace(
                                        &mut obj,
                                        ObjectLit {
                                            span: DUMMY_SP,
                                            props: vec![],
                                        },
                                    );
                                    buf.push(obj.as_arg());
                                    first = false;
                                }

                                buf.push(expr.as_arg());
                            }
                        }
                    }

                    if !obj.props.is_empty() {
                        buf.push(obj.as_arg());
                    }

                    buf
                };

                self.helpers.define_property.store(true, Ordering::Relaxed);
                self.helpers.object_spread.store(true, Ordering::Relaxed);
                Expr::Call(CallExpr {
                    span,
                    callee: quote_ident!("_objectSpread").as_callee(),
                    args,
                })
            }
            _ => expr,
        }
    }
}

fn contains_spread(expr: &Expr) -> bool {
    struct Visitor {
        found: bool,
    }

    impl Visit<SpreadElement> for Visitor {
        fn visit(&mut self, _: &SpreadElement) {
            self.found = true;
        }
    }

    let mut v = Visitor { found: false };
    expr.visit_with(&mut v);
    v.found
}
