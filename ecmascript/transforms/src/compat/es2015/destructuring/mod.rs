use ast::*;
use crate::util::StmtLike;
use swc_common::{Fold, FoldWith, Mark, Spanned, DUMMY_SP};

#[cfg(test)]
mod tests;

/// `@babel/plugin-transform-destructuring`
///
/// # Example
/// ## In
/// ```js
/// let {x, y} = obj;
///
/// let [a, b, ...rest] = arr;
/// ```
/// ## Out
/// ```js
/// let _obj = obj,
///     x = _obj.x,
///     y = _obj.y;
///
/// let _arr = arr,
///     _arr2 = _toArray(_arr),
///     a = _arr2[0],
///     b = _arr2[1],
///     rest = _arr2.slice(2);
/// ```
pub fn destructuring() -> impl Fold<Module> {
    Destructuring
}

#[derive(Debug, Clone, Copy, Default)]
struct Destructuring;

impl Fold<Vec<VarDeclarator>> for Destructuring {
    fn fold(&mut self, declarators: Vec<VarDeclarator>) -> Vec<VarDeclarator> {
        let is_complex = declarators.iter().any(|d| match d.name {
            Pat::Ident(..) => false,
            _ => true,
        });
        if !is_complex {
            return declarators;
        }

        let mut decls = vec![];

        for decl in declarators {
            match decl.name {
                Pat::Ident(..) => decls.push(decl),
                Pat::Array(ArrayPat { elems, .. }) => {
                    assert!(
                        decl.init.is_some(),
                        "destructuring pattern binding requires initializer"
                    );

                    // Make ref var if required
                    let ref_ident = make_ref_ident(&mut decls, decl.init.unwrap());

                    for (i, elem) in elems.into_iter().enumerate() {
                        let elem = match elem {
                            Some(elem) => elem,
                            None => continue,
                        };

                        let var_decl = VarDeclarator {
                            span: elem.span(),
                            // This might be pattern.
                            // So we fold it again.
                            name: elem,
                            init: Some(box make_ref_idx_expr(&ref_ident, i)),
                        };
                        decls.extend(vec![var_decl].fold_with(self));
                    }
                }
                Pat::Object(ObjectPat { props, .. }) => {
                    assert!(
                        decl.init.is_some(),
                        "Desturing pattern binding requires initializer"
                    );
                    let ref_ident = make_ref_ident(&mut decls, decl.init.unwrap());

                    for prop in props {
                        let prop_span = prop.span();

                        match prop {
                            ObjectPatProp::KeyValue(KeyValuePatProp { key, value }) => {
                                let var_decl = VarDeclarator {
                                    span: prop_span,
                                    name: *value,
                                    init: Some(box make_ref_prop_expr(
                                        &ref_ident,
                                        box prop_name_to_expr(key),
                                    )),
                                };
                                decls.extend(vec![var_decl].fold_with(self));
                                // decls.push(var_decl);
                            }
                            ObjectPatProp::Assign(AssignPatProp { key, value, .. }) => {
                                match value {
                                    Some(value) => {
                                        let ref_ident = make_ref_ident(
                                            &mut decls,
                                            box make_ref_prop_expr(
                                                &ref_ident,
                                                box key.clone().into(),
                                            ),
                                        );

                                        let var_decl = VarDeclarator {
                                            span: prop_span,
                                            name: Pat::Ident(key.clone().into()),
                                            init: Some(box make_cond_expr(ref_ident, value)),
                                        };
                                        decls.extend(vec![var_decl].fold_with(self));
                                    }
                                    None => {
                                        let var_decl = VarDeclarator {
                                            span: prop_span,
                                            name: Pat::Ident(key.clone().into()),
                                            init: Some(box make_ref_prop_expr(
                                                &ref_ident,
                                                box key.clone().into(),
                                            )),
                                        };
                                        decls.extend(vec![var_decl].fold_with(self));
                                    }
                                }
                            }
                            ObjectPatProp::Rest(_) => unimplemented!(),
                        }
                    }
                }
                Pat::Assign(AssignPat {
                    span,
                    left,
                    right: def_value,
                }) => {
                    assert!(
                        decl.init.is_some(),
                        "Desturing pattern binding requires initializer"
                    );

                    let tmp_mark = Mark::fresh(Mark::root());
                    let tmp_ident = quote_ident!(span.apply_mark(tmp_mark), "tmp");

                    decls.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(tmp_ident.clone()),
                        init: decl.init,
                    });

                    let var_decl = VarDeclarator {
                        span,
                        name: *left,
                        // tmp === void 0 ? def_value : tmp
                        init: Some(box make_cond_expr(tmp_ident, def_value)),
                    };
                    decls.extend(vec![var_decl].fold_with(self))
                }
                _ => unimplemented!("Pattern {:?}", decl),
            }
        }

        decls
    }
}

#[derive(Debug, Default)]
struct AssignFolder {
    vars: Vec<VarDecl>,
}

impl Fold<Expr> for AssignFolder {
    fn fold(&mut self, expr: Expr) -> Expr {
        let expr = expr.fold_children(self);

        match expr {
            Expr::Assign(AssignExpr {
                span,
                left,
                op: op!("="),
                right,
            }) => match left {
                PatOrExpr::Pat(pat) => match *pat {
                    Pat::Ident(..) => {
                        return Expr::Assign(AssignExpr {
                            span,
                            left: PatOrExpr::Pat(pat),
                            op: op!("="),
                            right,
                        })
                    }
                    Pat::Array(ArrayPat { span, elems }) => {
                        let mark = Mark::fresh(Mark::root());
                        let ref_ident = quote_ident!(span.apply_mark(mark), "ref");

                        let var_decl = VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Var,
                            decls: vec![VarDeclarator {
                                span,
                                name: Pat::Ident(ref_ident.clone()),
                                // initialized by first element of sequence expression
                                init: None,
                            }],
                        };
                        let mut exprs = vec![];
                        exprs.push(box Expr::Assign(AssignExpr {
                            span: DUMMY_SP,
                            op: op!("="),
                            left: PatOrExpr::Pat(box Pat::Ident(ref_ident.clone())),
                            right,
                        }));

                        for (i, elem) in elems.into_iter().enumerate() {
                            let elem = match elem {
                                Some(elem) => elem,
                                None => continue,
                            };

                            exprs.push(box Expr::Assign(AssignExpr {
                                span: elem.span(),
                                op: op!("="),
                                left: PatOrExpr::Pat(box elem),
                                right: box make_ref_idx_expr(&ref_ident, i),
                            }));
                        }
                        self.vars.push(var_decl);

                        // last one should be `ref`
                        exprs.push(box Expr::Ident(ref_ident));

                        Expr::Seq(SeqExpr {
                            span: DUMMY_SP,
                            exprs,
                        })
                    }
                    _ => unimplemented!("assignment pattern {:?}", pat),
                },
                _ => {
                    return Expr::Assign(AssignExpr {
                        span,
                        left,
                        op: op!("="),
                        right,
                    })
                }
            },
            _ => expr,
        }
    }
}

impl<T: StmtLike> Fold<Vec<T>> for Destructuring
where
    Vec<T>: FoldWith<Self>,
{
    fn fold(&mut self, stmts: Vec<T>) -> Vec<T> {
        let stmts = stmts.fold_children(self);

        let mut buf = vec![];

        for stmt in stmts {
            match stmt.try_into_stmt() {
                Err(module_item) => buf.push(module_item),
                Ok(stmt) => match stmt {
                    Stmt::Expr(box expr) => {
                        let mut folder = AssignFolder::default();
                        let expr = folder.fold(expr);
                        for var in folder.vars {
                            buf.push(T::from_stmt(Stmt::Decl(Decl::Var(var))));
                        }
                        buf.push(T::from_stmt(Stmt::Expr(box expr)));
                    }
                    _ => buf.push(T::from_stmt(stmt)),
                },
            }
        }

        buf
    }
}

fn make_ref_idx_expr(ref_ident: &Ident, i: usize) -> Expr {
    Expr::Member(MemberExpr {
        span: DUMMY_SP,
        obj: ExprOrSuper::Expr(box ref_ident.clone().into()),
        // Use `[]`
        computed: true,
        prop: box Expr::Lit(Lit::Num(Number {
            span: DUMMY_SP,
            value: i as f64,
        })),
    })
}

fn make_ref_ident(decls: &mut Vec<VarDeclarator>, init: Box<Expr>) -> Ident {
    match *init {
        Expr::Ident(i) => i,
        init => {
            let span = init.span();
            let mark = Mark::fresh(Mark::root());
            let ref_ident = quote_ident!(span.apply_mark(mark), "ref");

            decls.push(VarDeclarator {
                span,
                name: Pat::Ident(ref_ident.clone()),
                init: Some(box init),
            });

            ref_ident
        }
    }
}

fn prop_name_to_expr(p: PropName) -> Expr {
    match p {
        PropName::Ident(i) => Expr::Ident(i),
        PropName::Str(s) => Expr::Lit(Lit::Str(s)),
        PropName::Num(n) => Expr::Lit(Lit::Num(n)),
        PropName::Computed(expr) => *expr,
    }
}

fn make_ref_prop_expr(ref_ident: &Ident, prop: Box<Expr>) -> Expr {
    Expr::Member(MemberExpr {
        span: DUMMY_SP,
        obj: ExprOrSuper::Expr(box ref_ident.clone().into()),
        computed: match *prop {
            Expr::Ident(..) => false,
            _ => true,
        },
        prop,
    })
}

/// Creates `tmp === void 0 ? def_value : tmp`
fn make_cond_expr(tmp: Ident, def_value: Box<Expr>) -> Expr {
    Expr::Cond(CondExpr {
        span: DUMMY_SP,
        test: box Expr::Bin(BinExpr {
            span: DUMMY_SP,
            left: box Expr::Ident(tmp.clone()),
            op: op!("==="),
            right: box Expr::Unary(UnaryExpr {
                span: DUMMY_SP,
                op: op!("void"),
                arg: box Expr::Lit(Lit::Num(Number {
                    span: DUMMY_SP,
                    value: 0.0,
                })),
            }),
        }),
        cons: def_value,
        alt: box Expr::Ident(tmp),
    })
}
