use crate::{
    compat::helpers::Helpers,
    util::{ExprFactory, StmtLike},
};
use ast::*;
use std::{
    iter, mem,
    sync::{atomic::Ordering, Arc},
};
use swc_common::{Fold, FoldWith, Mark, Spanned, Visit, VisitWith, DUMMY_SP};

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
    helpers: Arc<Helpers>,
    /// Injected before the original statement.
    vars: Vec<VarDeclarator>,
    /// Injected after the original statement.
    stmts: Vec<Box<Expr>>,
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

                let excluded_props = excluded_props(&props);

                self.stmts.push(box Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    left: PatOrExpr::Pat(last.arg),
                    op: op!("="),
                    // we exclude properties using helper
                    right: box object_without_properties(
                        &self.helpers,
                        var_ident.clone(),
                        excluded_props,
                    ),
                }));

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
                    buf.extend(folder.stmts.into_iter().map(Stmt::Expr).map(T::from_stmt))
                }
            }
        }

        buf
    }
}

impl Fold<CatchClause> for ObjectRest {
    fn fold(&mut self, mut c: CatchClause) -> CatchClause {
        if !contains_rest(&c.param) {
            // fast path
            return c;
        }

        let pat = match c.param {
            Some(pat) => pat,
            _ => return c,
        };

        let param = fold_rest(&self.helpers, pat, &mut c.body.stmts);

        CatchClause {
            param: Some(param),
            ..c
        }
    }
}

fn fold_rest(helpers: &Helpers, pat: Pat, stmts: &mut Vec<Stmt>) -> Pat {
    let ObjectPat { span, props } = match pat {
        Pat::Object(pat) => pat,
        _ => return pat,
    };

    let mut props: Vec<ObjectPatProp> = props
        .into_iter()
        .map(|prop| match prop {
            ObjectPatProp::Rest(RestPat { arg, dot3_token }) => {
                let pat = fold_rest(helpers, *arg, stmts);
                ObjectPatProp::Rest(RestPat {
                    dot3_token,
                    arg: box pat,
                })
            }
            ObjectPatProp::KeyValue(KeyValuePatProp { key, value }) => {
                let value = box fold_rest(helpers, *value, stmts);
                ObjectPatProp::KeyValue(KeyValuePatProp { key, value })
            }
            _ => prop,
        })
        .collect();

    match props.last() {
        Some(ObjectPatProp::Rest(..)) => {}
        _ => {
            return Pat::Object(ObjectPat { span, props });
        }
    }
    let last = match props.pop() {
        Some(ObjectPatProp::Rest(rest)) => rest,
        _ => unreachable!(),
    };

    let mark = Mark::fresh(Mark::root());
    let var_ident = quote_ident!(last.span().apply_mark(mark), "_ref");

    let excluded_props = excluded_props(&props);

    stmts.insert(
        0,
        Stmt::Decl(Decl::Var(VarDecl {
            span: DUMMY_SP,
            kind: VarDeclKind::Let,
            decls: vec![
                VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Object(ObjectPat { span, props }),
                    init: Some(box var_ident.clone().into()),
                },
                VarDeclarator {
                    span: DUMMY_SP,
                    name: *last.arg,
                    init: Some(box object_without_properties(
                        helpers,
                        var_ident.clone(),
                        excluded_props,
                    )),
                },
            ],
        })),
    );

    Pat::Ident(var_ident)
}

fn object_without_properties(
    helpers: &Helpers,
    var_ident: Ident,
    excluded_props: Vec<Option<ExprOrSpread>>,
) -> Expr {
    if excluded_props.is_empty() {
        helpers.extends.store(true, Ordering::Relaxed);

        return Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: quote_ident!("_extends").as_callee(),
            args: vec![
                ObjectLit {
                    span: DUMMY_SP,
                    props: vec![],
                }
                .as_arg(),
                var_ident.as_arg(),
            ],
        });
    }

    helpers
        .object_without_properties
        .store(true, Ordering::Relaxed);

    Expr::Call(CallExpr {
        span: DUMMY_SP,
        callee: quote_ident!("_objectWithoutProperties").as_callee(),
        args: vec![
            var_ident.as_arg(),
            ArrayLit {
                span: DUMMY_SP,
                elems: excluded_props,
            }
            .as_arg(),
        ],
    })
}

fn excluded_props(props: &[ObjectPatProp]) -> Vec<Option<ExprOrSpread>> {
    props
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
                _ => unimplemented!("numeric / computed property name with object rest"),
            },
            ObjectPatProp::Assign(AssignPatProp { key, .. }) => Lit::Str(Str {
                span: key.span,
                value: key.sym.clone(),
                has_escape: false,
            })
            .as_arg(),
            ObjectPatProp::Rest(..) => unreachable!("invalid syntax (multiple rest element)"),
        })
        .map(Some)
        .collect()
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
