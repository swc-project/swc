use crate::{
    compat::helpers::Helpers,
    util::{ExprFactory, StmtLike},
};
use ast::*;
use std::{
    iter, mem,
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
    helpers: Arc<Helpers>,
    /// Injected before the original statement.
    vars: Vec<VarDeclarator>,
    /// Assignment expressions.
    exprs: Vec<Box<Expr>>,
}

impl Fold<Vec<VarDeclarator>> for RestFolder {
    fn fold(&mut self, decls: Vec<VarDeclarator>) -> Vec<VarDeclarator> {
        // fast path
        if !contains_rest(&decls) {
            return decls;
        }

        let mut buf: Vec<_> = decls
            .into_iter()
            .map(|decl| {
                // fast path
                if !contains_rest(&decl) {
                    return decl;
                }
                let mut var_ident = match decl.init {
                    Some(box Expr::Ident(ref ident)) => ident.clone(),
                    _ => quote_ident!("_ref"),
                };
                var_ident.span = var_ident.span.apply_mark(Mark::fresh(Mark::root()));

                let pat = self.fold_rest(decl.name, box Expr::Ident(var_ident), false);

                VarDeclarator { name: pat, ..decl }
            })
            .collect();
        buf.append(&mut self.vars);
        buf
    }
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
                left: PatOrExpr::Pat(box pat),
                op: op!("="),
                right,
            }) => {
                let mut var_ident = match *right {
                    Expr::Ident(ref ident) => quote_ident!(format!("_{}", ident.sym)),
                    _ => quote_ident!("_tmp"),
                };
                var_ident.span = var_ident.span.apply_mark(Mark::fresh(Mark::root()));

                self.vars.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Ident(var_ident.clone()),
                    init: Some(right),
                });

                let pat = self.fold_rest(pat, box Expr::Ident(var_ident.clone()), true);

                Expr::Assign(AssignExpr {
                    span,
                    left: PatOrExpr::Pat(box pat),
                    op: op!("="),
                    right: box var_ident.clone().into(),
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
                        exprs: vec![],
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

                    buf.extend(folder.exprs.into_iter().map(Stmt::Expr).map(T::from_stmt));
                }
            }
        }

        buf
    }
}

impl Fold<CatchClause> for RestFolder {
    fn fold(&mut self, mut c: CatchClause) -> CatchClause {
        if !contains_rest(&c.param) {
            // fast path
            return c;
        }

        let pat = match c.param {
            Some(pat) => pat,
            _ => return c,
        };

        let mark = Mark::fresh(Mark::root());
        let var_ident = quote_ident!(DUMMY_SP.apply_mark(mark), "_err");
        let param = self.fold_rest(pat, box Expr::Ident(var_ident.clone()), false);
        // initialize (or destructure)
        self.vars.push(VarDeclarator {
            span: DUMMY_SP,
            name: param,
            init: Some(box Expr::Ident(var_ident.clone())),
        });
        c.body.stmts = iter::once(Stmt::Decl(Decl::Var(VarDecl {
            span: DUMMY_SP,
            kind: VarDeclKind::Let,
            decls: mem::replace(&mut self.vars, vec![]),
        })))
        .chain(c.body.stmts)
        .collect();

        CatchClause {
            // catch (_err) {}
            param: Some(Pat::Ident(var_ident)),
            ..c
        }
    }
}

impl RestFolder {
    fn fold_rest(&mut self, pat: Pat, obj: Box<Expr>, use_expr_for_assign: bool) -> Pat {
        let ObjectPat { span, props } = match pat {
            Pat::Object(pat) => pat,
            _ => return pat,
        };

        let mut props: Vec<ObjectPatProp> = props
            .into_iter()
            .map(|prop| match prop {
                ObjectPatProp::Rest(RestPat { arg, dot3_token }) => {
                    let pat = self.fold_rest(
                        *arg,
                        // TODO: fix this. this is wrong
                        obj.clone(),
                        use_expr_for_assign,
                    );
                    ObjectPatProp::Rest(RestPat {
                        dot3_token,
                        arg: box pat,
                    })
                }
                ObjectPatProp::KeyValue(KeyValuePatProp { key, value }) => {
                    let value = box self.fold_rest(
                        *value,
                        box MemberExpr {
                            span: DUMMY_SP,
                            obj: obj.clone().as_obj(),
                            computed: match key {
                                PropName::Computed(..) => true,
                                _ => false,
                            },
                            prop: match key {
                                PropName::Ident(ref ident) => box Expr::Ident(ident.clone()),
                                _ => unimplemented!(),
                            },
                        }
                        .into(),
                        use_expr_for_assign,
                    );
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

        let excluded_props = excluded_props(&props);

        if use_expr_for_assign {
            self.exprs.push(box Expr::Assign(AssignExpr {
                span: DUMMY_SP,
                left: PatOrExpr::Pat(last.arg),
                op: op!("="),
                right: box object_without_properties(&self.helpers, obj.clone(), excluded_props),
            }));
        } else {
            self.vars.push(VarDeclarator {
                span: DUMMY_SP,
                name: *last.arg,
                init: Some(box object_without_properties(
                    &self.helpers,
                    obj.clone(),
                    excluded_props,
                )),
            });
        }

        if !use_expr_for_assign {
            // self.vars.insert(
            //     0,
            //     VarDeclarator {
            //         span: DUMMY_SP,
            //         name: Pat::Object(ObjectPat { span, props }),
            //         init: Some(obj),
            //     },
            // );
        }

        Pat::Object(ObjectPat { props, span })
    }
}

fn object_without_properties(
    helpers: &Helpers,
    obj: Box<Expr>,
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
                obj.as_arg(),
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
            obj.as_arg(),
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
