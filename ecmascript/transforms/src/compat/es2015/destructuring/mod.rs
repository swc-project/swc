use ast::*;
use crate::{
    compat::helpers::Helpers,
    util::{ExprFactory, StmtLike},
};
use std::{
    iter,
    sync::{atomic::Ordering, Arc},
};
use swc_atoms::JsWord;
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
pub fn destructuring(helpers: Arc<Helpers>) -> impl Fold<Module> + Fold<BlockStmt> {
    Destructuring { helpers }
}

#[derive(Debug, Clone, Default)]
struct Destructuring {
    helpers: Arc<Helpers>,
}

macro_rules! impl_for_for_stmt {
    ($T:tt) => {
        impl Fold<$T> for Destructuring {
            fn fold(&mut self, mut for_stmt: $T) -> $T {
                let (left, stmt) = match for_stmt.left {
                    VarDeclOrPat::VarDecl(var_decl) => {
                        let has_complex = var_decl.decls.iter().any(|d| match d.name {
                            Pat::Ident(_) => false,
                            _ => true,
                        });

                        if !has_complex {
                            return $T {
                                left: VarDeclOrPat::VarDecl(var_decl),
                                ..for_stmt
                            };
                        }
                        let ref_ident = make_ref_ident_for_for_stmt();
                        let left = VarDeclOrPat::VarDecl(VarDecl {
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(ref_ident.clone()),
                                init: None,
                            }],
                            ..var_decl
                        });
                        // Unpack variables
                        let stmt = Stmt::Decl(Decl::Var(VarDecl {
                            span: var_decl.span(),
                            kind: VarDeclKind::Let,
                            // I(kdy1) guess var_decl.len() == 1
                            decls: var_decl
                                .decls
                                .into_iter()
                                .map(|decl| VarDeclarator {
                                    init: Some(box Expr::Ident(ref_ident.clone())),
                                    ..decl
                                })
                                .collect::<Vec<_>>()
                                .fold_with(self),
                        }));
                        (left, stmt)
                    }
                    VarDeclOrPat::Pat(pat) => match pat {
                        Pat::Ident(..) => {
                            return $T {
                                left: VarDeclOrPat::Pat(pat),
                                ..for_stmt
                            }
                        }
                        _ => unimplemented!("for in/of loop without let / const / var"),
                    },
                };
                for_stmt.left = left;

                for_stmt.body = box Stmt::Block(match *for_stmt.body {
                    Stmt::Block(BlockStmt { span, stmts }) => BlockStmt {
                        span,
                        stmts: iter::once(stmt).chain(stmts).collect(),
                    },
                    body => BlockStmt {
                        span: DUMMY_SP,
                        stmts: iter::once(stmt).chain(iter::once(body)).collect(),
                    },
                });

                for_stmt
            }
        }
    };
}
impl_for_for_stmt!(ForInStmt);
impl_for_for_stmt!(ForOfStmt);

fn make_ref_ident_for_for_stmt() -> Ident {
    let mark = Mark::fresh(Mark::root());
    quote_ident!(DUMMY_SP.apply_mark(mark), "ref")
}

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
                    let ref_ident = make_ref_ident(&mut decls, decl.init);

                    for (i, elem) in elems.into_iter().enumerate() {
                        let elem: Pat = match elem {
                            Some(elem) => elem,
                            None => continue,
                        };

                        let var_decl = match elem {
                            Pat::Rest(RestPat {
                                dot3_token,
                                box arg,
                            }) => VarDeclarator {
                                span: dot3_token,
                                name: arg,
                                init: Some(box Expr::Call(CallExpr {
                                    span: DUMMY_SP,
                                    callee: MemberExpr {
                                        span: dot3_token,
                                        obj: ExprOrSuper::Expr(box Expr::Ident(ref_ident.clone())),
                                        computed: false,
                                        prop: box Expr::Ident(quote_ident!("slice")),
                                    }
                                    .as_callee(),
                                    args: vec![Lit::Num(Number {
                                        value: i as f64,
                                        span: dot3_token,
                                    })
                                    .as_arg()],
                                })),
                            },
                            _ => VarDeclarator {
                                span: elem.span(),
                                // This might be pattern.
                                // So we fold it again.
                                name: elem,
                                init: Some(box make_ref_idx_expr(&ref_ident, i)),
                            },
                        };
                        decls.extend(vec![var_decl].fold_with(self));
                    }
                }
                Pat::Object(ObjectPat { props, .. }) => {
                    assert!(
                        decl.init.is_some(),
                        "destructuring pattern binding requires initializer"
                    );
                    let can_be_null = can_be_null(decl.init.as_ref().unwrap());
                    let ref_ident = make_ref_ident(&mut decls, decl.init);

                    let ref_ident = if can_be_null {
                        self.helpers.throw.store(true, Ordering::Relaxed);
                        make_ref_ident(
                            &mut decls,
                            Some(box Expr::Cond(CondExpr {
                                span: DUMMY_SP,
                                test: box Expr::Ident(ref_ident.clone()),
                                cons: box Expr::Ident(ref_ident.clone()),
                                // _throw(new TypeError())
                                alt: box Expr::Call(CallExpr {
                                    span: DUMMY_SP,
                                    callee: quote_ident!("_throw").as_callee(),
                                    // new TypeError()
                                    args: vec![NewExpr {
                                        span: DUMMY_SP,
                                        callee: box Expr::Ident(quote_ident!("TypeError")),
                                        args: Some(vec![Lit::Str(quote_str!(
                                            "Cannot destructure 'undefined' or 'null'"
                                        ))
                                        .as_arg()]),
                                    }
                                    .as_arg()],
                                }),
                            })),
                        )
                    } else {
                        ref_ident
                    };

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
                            }
                            ObjectPatProp::Assign(AssignPatProp { key, value, .. }) => {
                                match value {
                                    Some(value) => {
                                        let ref_ident = make_ref_ident(
                                            &mut decls,
                                            Some(box make_ref_prop_expr(
                                                &ref_ident,
                                                box key.clone().into(),
                                            )),
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
                        "desturcturing pattern binding requires initializer"
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

impl Fold<Function> for Destructuring {
    fn fold(&mut self, f: Function) -> Function {
        let f = f.fold_children(self);

        let mut params = Vec::with_capacity(f.params.len());
        let mut decls = vec![];

        for pat in f.params {
            let span = pat.span();
            match pat {
                Pat::Ident(..) => params.push(pat),
                Pat::Array(..) | Pat::Object(..) | Pat::Assign(..) => {
                    let mark = Mark::fresh(Mark::root());
                    let ref_ident = quote_ident!(span.apply_mark(mark), "ref");

                    params.push(Pat::Ident(ref_ident.clone()));
                    decls.push(VarDeclarator {
                        span,
                        name: pat,
                        init: Some(box Expr::Ident(ref_ident)),
                    })
                }
                _ => {}
            }
        }

        let stmts = if decls.is_empty() {
            f.body.stmts
        } else {
            iter::once(
                Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Let,
                    decls,
                }))
                .fold_with(self),
            )
            .chain(f.body.stmts)
            .collect()
        };

        Function {
            params,
            body: BlockStmt {
                span: f.body.span,
                stmts,
            },
            ..f
        }
    }
}

#[derive(Debug, Default)]
struct AssignFolder {
    helpers: Arc<Helpers>,
    vars: Vec<VarDeclarator>,
}

impl Fold<Expr> for AssignFolder {
    fn fold(&mut self, expr: Expr) -> Expr {
        let expr = match expr {
            // Handle iife
            Expr::Fn(..) | Expr::Object(..) => Destructuring {
                helpers: self.helpers.clone(),
            }
            .fold(expr),
            _ => expr.fold_children(self),
        };

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
                    Pat::Array(ArrayPat { elems, .. }) => {
                        // initialized by first element of sequence expression
                        let ref_ident = make_ref_ident(&mut self.vars, None);

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

                            exprs.push(
                                box Expr::Assign(AssignExpr {
                                    span: elem.span(),
                                    op: op!("="),
                                    left: PatOrExpr::Pat(box elem),
                                    right: box make_ref_idx_expr(&ref_ident, i),
                                })
                                .fold_with(self),
                            );
                        }

                        // last one should be `ref`
                        exprs.push(box Expr::Ident(ref_ident));

                        Expr::Seq(SeqExpr {
                            span: DUMMY_SP,
                            exprs,
                        })
                    }
                    Pat::Object(ObjectPat { span, props }) => {
                        let ref_ident = make_ref_ident(&mut self.vars, None);

                        let mut exprs = vec![];

                        exprs.push(box Expr::Assign(AssignExpr {
                            span,
                            left: PatOrExpr::Pat(box Pat::Ident(ref_ident.clone())),
                            op: op!("="),
                            right,
                        }));

                        for prop in props {
                            let span = prop.span();
                            match prop {
                                ObjectPatProp::KeyValue(KeyValuePatProp { key, value }) => {
                                    exprs.push(box Expr::Assign(AssignExpr {
                                        span,
                                        left: PatOrExpr::Pat(value),
                                        op: op!("="),
                                        right: box make_ref_prop_expr(
                                            &ref_ident,
                                            box prop_name_to_expr(key),
                                        ),
                                    }));
                                }
                                ObjectPatProp::Assign(AssignPatProp { key, value, .. }) => {
                                    match value {
                                        Some(value) => {
                                            let prop_ident = make_ref_ident(&mut self.vars, None);

                                            exprs.push(box Expr::Assign(AssignExpr {
                                                span,
                                                left: PatOrExpr::Pat(box Pat::Ident(
                                                    prop_ident.clone(),
                                                )),
                                                op: op!("="),
                                                right: box make_ref_prop_expr(
                                                    &ref_ident,
                                                    box key.clone().into(),
                                                ),
                                            }));

                                            exprs.push(box Expr::Assign(AssignExpr {
                                                span,
                                                left: PatOrExpr::Pat(box Pat::Ident(
                                                    key.clone().into(),
                                                )),
                                                op: op!("="),
                                                right: box make_cond_expr(prop_ident, value),
                                            }));
                                        }
                                        None => {
                                            exprs.push(box Expr::Assign(AssignExpr {
                                                span,
                                                left: PatOrExpr::Pat(box Pat::Ident(
                                                    key.clone().into(),
                                                )),
                                                op: op!("="),
                                                right: box make_ref_prop_expr(
                                                    &ref_ident,
                                                    box key.clone().into(),
                                                ),
                                            }));
                                        }
                                    }
                                }
                                ObjectPatProp::Rest(_) => unimplemented!(),
                            }
                        }

                        // Last one should be object itself.
                        exprs.push(box Expr::Ident(ref_ident));

                        Expr::Seq(SeqExpr {
                            span: DUMMY_SP,
                            exprs,
                        })
                    }
                    Pat::Expr(box expr) => Expr::Assign(AssignExpr {
                        span,
                        left: PatOrExpr::Pat(box Pat::Expr(box expr)),
                        op: op!("="),
                        right,
                    }),
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

        let mut buf = Vec::with_capacity(stmts.len());

        for stmt in stmts {
            match stmt.try_into_stmt() {
                Err(module_item) => buf.push(module_item),
                Ok(stmt) => {
                    let mut folder = AssignFolder::default();
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
                }
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

fn make_ref_ident(decls: &mut Vec<VarDeclarator>, init: Option<Box<Expr>>) -> Ident {
    match init {
        Some(box Expr::Ident(i)) => i,
        init => {
            let s: JsWord = match init {
                Some(box Expr::Member(MemberExpr {
                    obj: ExprOrSuper::Expr(box Expr::Ident(ref i1)),
                    prop: box Expr::Ident(ref i2),
                    ..
                })) => format!("_{}${}", i1.sym, i2.sym).into(),

                _ => "ref".into(),
            };

            let span = init.span();
            let mark = Mark::fresh(Mark::root());
            let ref_ident = quote_ident!(span.apply_mark(mark), s);

            decls.push(VarDeclarator {
                span,
                name: Pat::Ident(ref_ident.clone()),
                init,
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

fn can_be_null(e: &Expr) -> bool {
    match *e {
        Expr::Lit(Lit::Null(..))
        | Expr::This(..)
        | Expr::Ident(..)
        | Expr::Member(..)
        | Expr::Call(..)
        | Expr::New(..)
        | Expr::Yield(..)
        | Expr::Await(..)
        | Expr::MetaProp(..) => true,

        // This does not include null
        Expr::Lit(..) => false,

        Expr::Array(..)
        | Expr::Arrow(..)
        | Expr::Object(..)
        | Expr::Fn(..)
        | Expr::Class(..)
        | Expr::Tpl(..) => false,

        Expr::Paren(ParenExpr { ref expr, .. }) => can_be_null(expr),
        Expr::Seq(SeqExpr { ref exprs, .. }) => {
            exprs.last().map(|e| can_be_null(e)).unwrap_or(true)
        }
        Expr::Assign(AssignExpr { ref right, .. }) => can_be_null(right),
        Expr::Cond(CondExpr {
            ref cons, ref alt, ..
        }) => can_be_null(cons) || can_be_null(alt),

        // TODO(kdy1): I'm not sure about this.
        Expr::Unary(..) | Expr::Update(..) | Expr::Bin(..) => true,
    }
}
