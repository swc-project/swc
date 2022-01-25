use serde::Deserialize;
use std::iter;
use swc_atoms::js_word;
use swc_common::{util::take::Take, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{helper, perf::Check};
use swc_ecma_transforms_macros::fast_path;
use swc_ecma_utils::{
    alias_ident_for, alias_if_required, has_rest_pat, is_literal, member_expr, private_ident,
    prop_name_to_expr, quote_ident, undefined, ExprFactory, StmtLike,
};
use swc_ecma_visit::{
    as_folder, noop_visit_mut_type, noop_visit_type, Fold, Visit, VisitMut, VisitMutWith, VisitWith,
};

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
pub fn destructuring(c: Config) -> impl Fold + VisitMut {
    as_folder(Destructuring { c })
}

struct Destructuring {
    c: Config,
}

#[derive(Debug, Default, Clone, Copy, Deserialize)]
pub struct Config {
    #[serde(default)]
    pub loose: bool,
}

macro_rules! impl_for_for_stmt {
    ($name:ident, $T:tt) => {
        fn $name(&mut self, for_stmt: &mut $T) {
            let (left, stmt) = match &mut for_stmt.left {
                VarDeclOrPat::VarDecl(var_decl) => {
                    let has_complex = var_decl.decls.iter().any(|d| match d.name {
                        Pat::Ident(_) => false,
                        _ => true,
                    });

                    if !has_complex {
                        return;
                    }
                    let ref_ident = make_ref_ident_for_for_stmt();
                    let left = VarDeclOrPat::VarDecl(VarDecl {
                        decls: vec![VarDeclarator {
                            span: DUMMY_SP,
                            name: ref_ident.clone().into(),
                            init: None,
                            definite: false,
                        }],
                        span: var_decl.span,
                        kind: var_decl.kind,
                        declare: var_decl.declare,
                    });

                    // I(kdy1) guess var_decl.len() == 1
                    let mut decls = var_decl
                        .decls
                        .take()
                        .into_iter()
                        .map(|decl| VarDeclarator {
                            init: Some(Box::new(Expr::Ident(ref_ident.clone()))),
                            ..decl
                        })
                        .collect::<Vec<_>>();
                    decls.visit_mut_children_with(self);

                    // Unpack variables
                    let stmt = Stmt::Decl(Decl::Var(VarDecl {
                        span: var_decl.span(),
                        kind: VarDeclKind::Let,
                        decls,
                        declare: false,
                    }));
                    (left, stmt)
                }
                VarDeclOrPat::Pat(pat) => match pat {
                    Pat::Ident(..) => {
                        return;
                    }
                    _ => {
                        let left_ident = make_ref_ident_for_for_stmt();
                        let left = VarDeclOrPat::Pat(Pat::Ident(left_ident.clone().into()));
                        // Unpack variables
                        let stmt = AssignExpr {
                            span: DUMMY_SP,
                            left: PatOrExpr::Pat(Box::new(pat.take())),
                            op: op!("="),
                            right: Box::new(left_ident.into()),
                        }
                        .into_stmt();
                        (left, stmt)
                    }
                },
            };

            for_stmt.left = left;

            for_stmt.body = Box::new(Stmt::Block(match &mut *for_stmt.body {
                Stmt::Block(BlockStmt { span, stmts }) => BlockStmt {
                    span: *span,
                    stmts: iter::once(stmt).chain(stmts.take()).collect(),
                },
                body => BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![stmt, body.take()],
                },
            }));
        }
    };
}

fn make_ref_ident_for_for_stmt() -> Ident {
    private_ident!("ref")
}

impl AssignFolder {
    fn visit_mut_var_decl(&mut self, decls: &mut Vec<VarDeclarator>, decl: VarDeclarator) {
        match decl.name {
            Pat::Ident(..) => decls.push(decl),
            Pat::Rest(..) => unreachable!(
                "rest pattern should handled by array pattern handler: {:?}",
                decl.name
            ),
            Pat::Array(ArrayPat { elems, .. }) => {
                assert!(
                    decl.init.is_some(),
                    "destructuring pattern binding requires initializer"
                );

                let init = decl.init.unwrap();

                if is_literal(&init) {
                    match *init {
                        Expr::Array(arr)
                            if elems.len() == arr.elems.len()
                                || (elems.len() < arr.elems.len() && has_rest_pat(&elems)) =>
                        {
                            let mut arr_elems = Some(arr.elems.into_iter());
                            elems.into_iter().for_each(|p| match p {
                                Some(Pat::Rest(p)) => {
                                    self.visit_mut_var_decl(
                                        decls,
                                        VarDeclarator {
                                            span: p.span(),
                                            name: *p.arg,
                                            init: Some(Box::new(Expr::Array(ArrayLit {
                                                span: DUMMY_SP,
                                                elems: arr_elems
                                                    .take()
                                                    .expect("two rest element?")
                                                    .collect(),
                                            }))),
                                            definite: false,
                                        },
                                    );
                                }
                                Some(p) => {
                                    let e = arr_elems
                                        .as_mut()
                                        .expect("pattern after rest element?")
                                        .next()
                                        .unwrap();
                                    self.visit_mut_var_decl(
                                        decls,
                                        VarDeclarator {
                                            span: p.span(),
                                            init: e.map(|e| {
                                                debug_assert_eq!(e.spread, None);
                                                e.expr
                                            }),
                                            name: p,
                                            definite: false,
                                        },
                                    )
                                }

                                None => {
                                    arr_elems
                                        .as_mut()
                                        .expect("pattern after rest element?")
                                        .next();
                                }
                            });
                            return;
                        }
                        _ => {}
                    }
                }
                // Make ref var if required
                let ref_ident = make_ref_ident_for_array(
                    self.c,
                    if self.exporting {
                        &mut self.vars
                    } else {
                        decls
                    },
                    Some(init),
                    Some(if has_rest_pat(&elems) {
                        std::usize::MAX
                    } else {
                        elems.len()
                    }),
                );

                for (i, elem) in elems.into_iter().enumerate() {
                    let elem: Pat = match elem {
                        Some(elem) => elem,
                        None => continue,
                    };

                    let var_decl = match elem {
                        Pat::Rest(RestPat {
                            dot3_token, arg, ..
                        }) => VarDeclarator {
                            span: dot3_token,
                            name: *arg,
                            init: Some(Box::new(Expr::Call(CallExpr {
                                span: DUMMY_SP,
                                callee: ref_ident
                                    .clone()
                                    .make_member(quote_ident!("slice"))
                                    .as_callee(),
                                args: vec![Lit::Num(Number {
                                    value: i as f64,
                                    span: dot3_token,
                                })
                                .as_arg()],
                                type_args: Default::default(),
                            }))),
                            definite: false,
                        },
                        _ => VarDeclarator {
                            span: elem.span(),
                            // This might be pattern.
                            // So we fold it again.
                            name: elem,
                            init: Some(Box::new(make_ref_idx_expr(&ref_ident, i))),
                            definite: false,
                        },
                    };

                    let mut var_decls = vec![var_decl];
                    var_decls.visit_mut_with(self);
                    decls.extend(var_decls);
                }
            }
            Pat::Object(ObjectPat { span, props, .. }) if props.is_empty() => {
                let (ident, aliased) = alias_if_required(decl.init.as_ref().unwrap(), "ref");
                if aliased {
                    decls.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: ident.clone().into(),
                        init: decl.init,
                        definite: false,
                    });
                }

                // We should convert
                //
                //      var {} = null;
                //
                // to
                //
                //      var _ref = null;
                //      _objectDestructuringEmpty(_ref);
                //
                decls.push(VarDeclarator {
                    span,
                    name: ident.clone().into(),
                    init: Some(Box::new(Expr::Cond(CondExpr {
                        span: DUMMY_SP,
                        test: Box::new(Expr::Bin(BinExpr {
                            span: DUMMY_SP,
                            left: Box::new(Expr::Ident(ident.clone())),
                            op: op!("!=="),
                            right: Null { span: DUMMY_SP }.into(),
                        })),
                        cons: Box::new(Expr::Ident(ident)),
                        alt: Box::new(Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: helper!(throw, "throw"),
                            args: vec![
                                // new TypeError("Cannot destructure undefined")
                                NewExpr {
                                    span: DUMMY_SP,
                                    callee: Box::new(Expr::Ident(Ident::new(
                                        "TypeError".into(),
                                        DUMMY_SP,
                                    ))),
                                    args: Some(vec!["Cannot destructure undefined".as_arg()]),
                                    type_args: Default::default(),
                                }
                                .as_arg(),
                            ],
                            type_args: Default::default(),
                        })),
                    }))),
                    definite: false,
                })
            }

            Pat::Object(ObjectPat { props, .. }) => {
                assert!(
                    decl.init.is_some(),
                    "destructuring pattern binding requires initializer"
                );

                if props.len() == 1 {
                    if let ObjectPatProp::Assign(p @ AssignPatProp { value: None, .. }) = &props[0]
                    {
                        decls.push(VarDeclarator {
                            span: decl.span,
                            name: p.key.clone().into(),
                            init: Some(Box::new(decl.init.unwrap().make_member(p.key.clone()))),
                            definite: false,
                        });
                        return;
                    }
                }

                let can_be_null = can_be_null(decl.init.as_ref().unwrap());

                let ref_decls = if self.exporting {
                    &mut self.vars
                } else {
                    decls.as_mut()
                };

                let ref_ident = make_ref_ident(self.c, ref_decls, decl.init);

                let ref_ident = if can_be_null {
                    let init = Box::new(Expr::Ident(ref_ident));
                    make_ref_ident(self.c, ref_decls, Some(init))
                } else {
                    ref_ident
                };

                for prop in props {
                    let prop_span = prop.span();

                    match prop {
                        ObjectPatProp::KeyValue(KeyValuePatProp { key, value }) => {
                            let computed = matches!(key, PropName::Computed(..));

                            let var_decl = VarDeclarator {
                                span: prop_span,
                                name: *value,
                                init: Some(Box::new(make_ref_prop_expr(
                                    &ref_ident,
                                    Box::new(prop_name_to_expr(key)),
                                    computed,
                                ))),
                                definite: false,
                            };

                            let mut var_decls = vec![var_decl];
                            var_decls.visit_mut_with(self);
                            decls.extend(var_decls);
                        }
                        ObjectPatProp::Assign(AssignPatProp { key, value, .. }) => {
                            let computed = false;

                            match value {
                                Some(value) => {
                                    let ref_ident = make_ref_ident(
                                        self.c,
                                        decls,
                                        Some(Box::new(make_ref_prop_expr(
                                            &ref_ident,
                                            Box::new(key.clone().into()),
                                            computed,
                                        ))),
                                    );

                                    let var_decl = VarDeclarator {
                                        span: prop_span,
                                        name: key.clone().into(),
                                        init: Some(Box::new(make_cond_expr(ref_ident, value))),
                                        definite: false,
                                    };
                                    let mut var_decls = vec![var_decl];
                                    var_decls.visit_mut_with(self);
                                    decls.extend(var_decls);
                                }
                                None => {
                                    let var_decl = VarDeclarator {
                                        span: prop_span,
                                        name: key.clone().into(),
                                        init: Some(Box::new(make_ref_prop_expr(
                                            &ref_ident,
                                            Box::new(key.clone().into()),
                                            computed,
                                        ))),
                                        definite: false,
                                    };
                                    let mut var_decls = vec![var_decl];
                                    var_decls.visit_mut_with(self);
                                    decls.extend(var_decls);
                                }
                            }
                        }
                        ObjectPatProp::Rest(..) => unreachable!(
                            "Object rest pattern should be removed by es2018::object_rest_spread \
                             pass"
                        ),
                    }
                }
            }
            Pat::Assign(AssignPat {
                span,
                left,
                right: def_value,
                ..
            }) => {
                assert!(
                    decl.init.is_some(),
                    "destructuring pattern binding requires initializer"
                );

                let init = decl.init;
                let tmp_ident: Ident = (|| {
                    if let Some(ref e) = init {
                        match &**e {
                            Expr::Ident(ref i) if i.span.ctxt() != SyntaxContext::empty() => {
                                return i.clone();
                            }
                            _ => {}
                        }
                    }

                    let tmp_ident = private_ident!(span, "tmp");
                    decls.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: tmp_ident.clone().into(),
                        init,
                        definite: false,
                    });

                    tmp_ident
                })();

                let var_decl = VarDeclarator {
                    span,
                    name: *left,
                    // tmp === void 0 ? def_value : tmp
                    init: Some(Box::new(make_cond_expr(tmp_ident, def_value))),
                    definite: false,
                };
                let mut var_decls = vec![var_decl];
                var_decls.visit_mut_with(self);
                decls.extend(var_decls);
            }

            _ => unimplemented!("Pattern {:?}", decl),
        }
    }
}

#[fast_path(DestructuringVisitor)]
impl VisitMut for Destructuring {
    noop_visit_mut_type!();

    impl_for_for_stmt!(visit_mut_for_in_stmt, ForInStmt);
    impl_for_for_stmt!(visit_mut_for_of_stmt, ForOfStmt);

    impl_visit_mut_fn!();

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        self.visit_mut_stmt_like(n);
    }

    fn visit_mut_stmts(&mut self, n: &mut Vec<Stmt>) {
        self.visit_mut_stmt_like(n);
    }
}

impl Destructuring {
    fn visit_mut_fn_like(
        &mut self,
        ps: &mut Vec<Param>,
        body: &mut BlockStmt,
    ) -> (Vec<Param>, BlockStmt) {
        let mut params = vec![];
        let mut decls = vec![];

        for param in ps.drain(..) {
            let span = param.span();
            match param.pat {
                Pat::Ident(..) => params.push(param),
                Pat::Array(..) | Pat::Object(..) | Pat::Assign(..) => {
                    let ref_ident = private_ident!(span, "ref");

                    params.push(Param {
                        span: DUMMY_SP,
                        decorators: Default::default(),
                        pat: ref_ident.clone().into(),
                    });
                    decls.push(VarDeclarator {
                        span,
                        name: param.pat,
                        init: Some(Box::new(Expr::Ident(ref_ident))),
                        definite: false,
                    })
                }
                Pat::Rest(..) | Pat::Expr(..) => params.push(param),
                Pat::Invalid(..) => {}
            }
        }

        let stmts = if decls.is_empty() {
            body.stmts.take()
        } else {
            let mut stmt = Stmt::Decl(Decl::Var(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Let,
                decls,
                declare: false,
            }));

            stmt.visit_mut_children_with(self);

            iter::once(stmt).chain(body.stmts.take()).collect()
        };

        (
            params,
            BlockStmt {
                stmts,
                ..body.take()
            },
        )
    }
}

struct AssignFolder {
    c: Config,
    exporting: bool,
    vars: Vec<VarDeclarator>,
    /// Used like `.take().is_some()`.
    ignore_return_value: Option<()>,
}

#[fast_path(DestructuringVisitor)]
impl VisitMut for AssignFolder {
    noop_visit_mut_type!();

    fn visit_mut_export_decl(&mut self, decl: &mut ExportDecl) {
        let old = self.exporting;
        self.exporting = true;
        decl.visit_mut_children_with(self);
        self.exporting = old;
    }

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        let ignore_return_value = self.ignore_return_value.take().is_some();

        match expr {
            // Handle iife
            Expr::Fn(..) | Expr::Object(..) => {
                expr.visit_mut_with(&mut Destructuring { c: self.c })
            }
            _ => expr.visit_mut_children_with(self),
        };

        if let Expr::Assign(AssignExpr {
            span,
            left: PatOrExpr::Pat(pat),
            op: op!("="),
            right,
        }) = expr
        {
            match &mut **pat {
                Pat::Expr(pat_expr) => {
                    *expr = Expr::Assign(AssignExpr {
                        span: *span,
                        left: PatOrExpr::Expr(pat_expr.take()),
                        op: op!("="),
                        right: right.take(),
                    });
                }

                Pat::Ident(..) => {}
                Pat::Array(ArrayPat { elems, .. }) => {
                    let mut exprs = Vec::with_capacity(elems.len() + 1);

                    if is_literal(right) && ignore_return_value {
                        match &mut **right {
                            Expr::Array(arr)
                                if elems.len() == arr.elems.len()
                                    || (elems.len() < arr.elems.len() && has_rest_pat(elems)) =>
                            {
                                let mut arr_elems = Some(arr.elems.take().into_iter());
                                elems.iter_mut().for_each(|p| match p {
                                    Some(Pat::Rest(p)) => {
                                        exprs.push(Box::new(Expr::Assign(AssignExpr {
                                            span: p.span(),
                                            left: PatOrExpr::Pat(p.arg.take()),
                                            op: op!("="),
                                            right: Box::new(Expr::Array(ArrayLit {
                                                span: DUMMY_SP,
                                                elems: arr_elems
                                                    .take()
                                                    .expect("two rest element?")
                                                    .collect(),
                                            })),
                                        })));
                                    }
                                    Some(p) => {
                                        let e = arr_elems
                                            .as_mut()
                                            .expect("pattern after rest element?")
                                            .next()
                                            .and_then(|v| v);
                                        let right = e
                                            .map(|e| {
                                                debug_assert_eq!(e.spread, None);
                                                e.expr
                                            })
                                            .unwrap_or_else(|| undefined(p.span()));

                                        let mut expr = Expr::Assign(AssignExpr {
                                            span: p.span(),
                                            left: Box::new(p.take()).into(),
                                            op: op!("="),
                                            right,
                                        });

                                        self.visit_mut_expr(&mut expr);

                                        exprs.push(Box::new(expr));
                                    }

                                    None => {
                                        arr_elems
                                            .as_mut()
                                            .expect("pattern after rest element?")
                                            .next();
                                    }
                                });
                                *expr = SeqExpr { span: *span, exprs }.into();
                                return;
                            }
                            _ => {}
                        }
                    }

                    // initialized by first element of sequence expression
                    let ref_ident = make_ref_ident_for_array(
                        self.c,
                        &mut self.vars,
                        None,
                        Some(if has_rest_pat(elems) {
                            std::usize::MAX
                        } else {
                            elems.len()
                        }),
                    );
                    exprs.push(Box::new(Expr::Assign(AssignExpr {
                        span: DUMMY_SP,
                        op: op!("="),
                        left: PatOrExpr::Pat(ref_ident.clone().into()),
                        right: if self.c.loose {
                            right.take()
                        } else {
                            match &mut **right {
                                Expr::Ident(Ident {
                                    sym: js_word!("arguments"),
                                    ..
                                }) => Box::new(Expr::Call(CallExpr {
                                    span: DUMMY_SP,
                                    callee: member_expr!(DUMMY_SP, Array.prototype.slice.call)
                                        .as_callee(),
                                    args: vec![right.take().as_arg()],
                                    type_args: Default::default(),
                                })),
                                Expr::Array(..) => right.take(),
                                _ => {
                                    // if left has rest then need `_toArray`
                                    // else `_slicedToArray`
                                    if elems.iter().any(|elem| matches!(elem, Some(Pat::Rest(..))))
                                    {
                                        Box::new(Expr::Call(CallExpr {
                                            span: DUMMY_SP,
                                            callee: helper!(to_array, "toArray"),
                                            args: vec![right.take().as_arg()],
                                            type_args: Default::default(),
                                        }))
                                    } else {
                                        Box::new(
                                            CallExpr {
                                                span: DUMMY_SP,
                                                callee: helper!(sliced_to_array, "slicedToArray"),
                                                args: vec![
                                                    right.take().as_arg(),
                                                    elems.len().as_arg(),
                                                ],
                                                type_args: Default::default(),
                                            }
                                            .into(),
                                        )
                                    }
                                }
                            }
                        },
                    })));

                    for (i, elem) in elems.iter_mut().enumerate() {
                        let elem = match elem {
                            Some(elem) => elem,
                            None => continue,
                        };
                        let elem_span = elem.span();

                        match elem {
                            Pat::Assign(AssignPat {
                                span, left, right, ..
                            }) => {
                                // initialized by sequence expression.
                                let assign_ref_ident = make_ref_ident(self.c, &mut self.vars, None);
                                exprs.push(Box::new(Expr::Assign(AssignExpr {
                                    span: DUMMY_SP,
                                    left: PatOrExpr::Pat(assign_ref_ident.clone().into()),
                                    op: op!("="),
                                    right: Box::new(ref_ident.clone().computed_member(i as f64)),
                                })));

                                let mut assign_expr = Expr::Assign(AssignExpr {
                                    span: *span,
                                    left: PatOrExpr::Pat(left.take()),
                                    op: op!("="),
                                    right: Box::new(make_cond_expr(assign_ref_ident, right.take())),
                                });
                                assign_expr.visit_mut_with(self);

                                exprs.push(Box::new(assign_expr));
                            }
                            Pat::Rest(RestPat { arg, .. }) => {
                                let mut assign_expr = Expr::Assign(AssignExpr {
                                    span: elem_span,
                                    op: op!("="),
                                    left: PatOrExpr::Pat(arg.take()),
                                    right: Box::new(Expr::Call(CallExpr {
                                        span: DUMMY_SP,
                                        callee: ref_ident
                                            .clone()
                                            .make_member(quote_ident!("slice"))
                                            .as_callee(),
                                        args: vec![(i as f64).as_arg()],
                                        type_args: Default::default(),
                                    })),
                                });

                                assign_expr.visit_mut_with(self);
                                exprs.push(Box::new(assign_expr));
                            }
                            _ => {
                                let mut assign_expr = Expr::Assign(AssignExpr {
                                    span: elem_span,
                                    op: op!("="),
                                    left: PatOrExpr::Pat(Box::new(elem.take())),
                                    right: Box::new(make_ref_idx_expr(&ref_ident, i)),
                                });

                                assign_expr.visit_mut_with(self);
                                exprs.push(Box::new(assign_expr))
                            }
                        }
                    }

                    // last one should be `ref`
                    exprs.push(Box::new(Expr::Ident(ref_ident)));

                    *expr = Expr::Seq(SeqExpr {
                        span: DUMMY_SP,
                        exprs,
                    })
                }
                Pat::Object(ObjectPat { span, props, .. }) => {
                    if props.len() == 1 {
                        if let ObjectPatProp::Assign(p @ AssignPatProp { value: None, .. }) =
                            &props[0]
                        {
                            *expr = Expr::Assign(AssignExpr {
                                span: *span,
                                op: op!("="),
                                left: PatOrExpr::Pat(p.key.clone().into()),
                                right: Box::new(right.take().make_member(p.key.clone())),
                            });
                            return;
                        }
                    }

                    let ref_ident = make_ref_ident(self.c, &mut self.vars, None);

                    let mut exprs = vec![Box::new(Expr::Assign(AssignExpr {
                        span: *span,
                        left: PatOrExpr::Pat(ref_ident.clone().into()),
                        op: op!("="),
                        right: right.take(),
                    }))];

                    for prop in props {
                        let span = prop.span();
                        match prop {
                            ObjectPatProp::KeyValue(KeyValuePatProp { key, value }) => {
                                let computed = matches!(key, PropName::Computed(..));

                                let mut expr = Expr::Assign(AssignExpr {
                                    span,
                                    left: PatOrExpr::Pat(value.take()),
                                    op: op!("="),
                                    right: Box::new(make_ref_prop_expr(
                                        &ref_ident,
                                        Box::new(prop_name_to_expr(key.take())),
                                        computed,
                                    )),
                                });

                                expr.visit_mut_with(self);
                                exprs.push(Box::new(expr));
                            }
                            ObjectPatProp::Assign(AssignPatProp { key, value, .. }) => {
                                let computed = false;

                                match value {
                                    Some(value) => {
                                        let prop_ident =
                                            make_ref_ident(self.c, &mut self.vars, None);

                                        exprs.push(Box::new(Expr::Assign(AssignExpr {
                                            span,
                                            left: PatOrExpr::Pat(prop_ident.clone().into()),
                                            op: op!("="),
                                            right: Box::new(make_ref_prop_expr(
                                                &ref_ident,
                                                Box::new(key.clone().into()),
                                                computed,
                                            )),
                                        })));

                                        exprs.push(Box::new(Expr::Assign(AssignExpr {
                                            span,
                                            left: PatOrExpr::Pat(key.clone().into()),
                                            op: op!("="),
                                            right: Box::new(make_cond_expr(
                                                prop_ident,
                                                value.take(),
                                            )),
                                        })));
                                    }
                                    None => {
                                        exprs.push(Box::new(Expr::Assign(AssignExpr {
                                            span,
                                            left: PatOrExpr::Pat(key.clone().into()),
                                            op: op!("="),
                                            right: Box::new(make_ref_prop_expr(
                                                &ref_ident,
                                                Box::new(key.clone().into()),
                                                computed,
                                            )),
                                        })));
                                    }
                                }
                            }
                            ObjectPatProp::Rest(_) => unreachable!(
                                "object rest pattern should be removed by \
                                 es2018::object_rest_spread pass"
                            ),
                        }
                    }

                    // Last one should be object itself.
                    exprs.push(Box::new(Expr::Ident(ref_ident)));

                    *expr = Expr::Seq(SeqExpr {
                        span: DUMMY_SP,
                        exprs,
                    });
                }
                Pat::Assign(pat) => {
                    let ref_ident = make_ref_ident(self.c, &mut self.vars, None);

                    let mut exprs = vec![Box::new(
                        AssignExpr {
                            span: *span,
                            left: PatOrExpr::Pat(ref_ident.clone().into()),
                            op: op!("="),
                            right: right.take(),
                        }
                        .into(),
                    )];

                    let mut assign_cond_expr = Expr::Assign(AssignExpr {
                        span: *span,
                        left: pat.left.take().into(),
                        op: op!("="),
                        right: Box::new(make_cond_expr(ref_ident, pat.right.take())),
                    });

                    assign_cond_expr.visit_mut_with(self);
                    exprs.push(Box::new(assign_cond_expr));

                    *expr = Expr::Seq(SeqExpr {
                        span: DUMMY_SP,
                        exprs,
                    });
                }
                Pat::Rest(pat) => unimplemented!("rest pattern {:?}", pat),

                Pat::Invalid(..) => unreachable!(),
            }
        };
    }

    fn visit_mut_stmt(&mut self, s: &mut Stmt) {
        match s {
            Stmt::Expr(e) => {
                self.ignore_return_value = Some(());
                e.visit_mut_with(self);
                assert_eq!(self.ignore_return_value, None);
            }
            _ => s.visit_mut_children_with(self),
        };
    }

    fn visit_mut_var_declarators(&mut self, declarators: &mut Vec<VarDeclarator>) {
        declarators.visit_mut_children_with(self);

        let is_complex = declarators
            .iter()
            .any(|d| !matches!(d.name, Pat::Ident(..)));
        if !is_complex {
            return;
        }

        let mut decls = Vec::with_capacity(declarators.len());
        for decl in declarators.drain(..) {
            self.visit_mut_var_decl(&mut decls, decl);
        }

        *declarators = decls;
    }
}

impl Destructuring {
    fn visit_mut_stmt_like<T>(&mut self, stmts: &mut Vec<T>)
    where
        Vec<T>: VisitMutWith<Self>,
        T: StmtLike + VisitMutWith<AssignFolder>,
    {
        stmts.visit_mut_children_with(self);

        let mut stmts_updated = Vec::with_capacity(stmts.len());

        for stmt in stmts.drain(..) {
            let mut folder = AssignFolder {
                c: self.c,
                exporting: false,
                vars: vec![],
                ignore_return_value: None,
            };

            match stmt.try_into_stmt() {
                Err(mut item) => {
                    item.visit_mut_with(&mut folder);

                    // Add variable declaration
                    // e.g. var ref
                    if !folder.vars.is_empty() {
                        stmts_updated.push(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Var,
                            decls: folder.vars,
                            declare: false,
                        }))));
                    }

                    stmts_updated.push(item);
                }
                Ok(mut stmt) => {
                    stmt.visit_mut_with(&mut folder);

                    // Add variable declaration
                    // e.g. var ref
                    if !folder.vars.is_empty() {
                        stmts_updated.push(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Var,
                            decls: folder.vars,
                            declare: false,
                        }))));
                    }

                    stmts_updated.push(T::from_stmt(stmt));
                }
            }
        }

        *stmts = stmts_updated;
    }
}

fn make_ref_idx_expr(ref_ident: &Ident, i: usize) -> Expr {
    ref_ident.clone().computed_member(i as f64)
}

fn make_ref_ident(c: Config, decls: &mut Vec<VarDeclarator>, init: Option<Box<Expr>>) -> Ident {
    make_ref_ident_for_array(c, decls, init, None)
}

fn make_ref_ident_for_array(
    c: Config,
    decls: &mut Vec<VarDeclarator>,
    mut init: Option<Box<Expr>>,
    elem_cnt: Option<usize>,
) -> Ident {
    if elem_cnt.is_none() {
        if let Some(e) = init {
            match *e {
                Expr::Ident(i) => return i,
                _ => init = Some(e),
            }
        }
    }

    let span = init.span();

    let (ref_ident, aliased) = if c.loose {
        if let Some(ref init) = init {
            alias_if_required(init, "ref")
        } else {
            (private_ident!(span, "ref"), true)
        }
    } else if let Some(ref init) = init {
        (alias_ident_for(init, "ref"), true)
    } else {
        (private_ident!(span, "ref"), true)
    };

    if aliased {
        decls.push(VarDeclarator {
            span,
            name: ref_ident.clone().into(),
            init: init.map(|v| {
                if c.loose || matches!(*v, Expr::Array(..)) {
                    v
                } else {
                    match elem_cnt {
                        None => v,
                        Some(std::usize::MAX) => Box::new(
                            CallExpr {
                                span: DUMMY_SP,
                                callee: helper!(to_array, "toArray"),
                                args: vec![v.as_arg()],
                                type_args: Default::default(),
                            }
                            .into(),
                        ),
                        Some(value) => Box::new(
                            CallExpr {
                                span: DUMMY_SP,
                                callee: helper!(sliced_to_array, "slicedToArray"),
                                args: vec![v.as_arg(), value.as_arg()],
                                type_args: Default::default(),
                            }
                            .into(),
                        ),
                    }
                }
            }),
            definite: false,
        });
    }

    ref_ident
}

fn make_ref_prop_expr(ref_ident: &Ident, prop: Box<Expr>, mut computed: bool) -> Expr {
    computed |= matches!(*prop, Expr::Lit(Lit::Num(..)) | Expr::Lit(Lit::Str(..)));

    Expr::Member(MemberExpr {
        span: DUMMY_SP,
        obj: Box::new(ref_ident.clone().into()),
        prop: if computed {
            MemberProp::Computed(ComputedPropName {
                span: DUMMY_SP,
                expr: prop,
            })
        } else {
            MemberProp::Ident(prop.ident().unwrap())
        },
    })
}

/// Creates `tmp === void 0 ? def_value : tmp`
fn make_cond_expr(tmp: Ident, def_value: Box<Expr>) -> Expr {
    Expr::Cond(CondExpr {
        span: DUMMY_SP,
        test: Box::new(Expr::Bin(BinExpr {
            span: DUMMY_SP,
            left: Box::new(Expr::Ident(tmp.clone())),
            op: op!("==="),
            right: Box::new(Expr::Unary(UnaryExpr {
                span: DUMMY_SP,
                op: op!("void"),
                arg: 0.0.into(),
            })),
        })),
        cons: def_value,
        alt: Box::new(Expr::Ident(tmp)),
    })
}

fn can_be_null(e: &Expr) -> bool {
    match *e {
        Expr::Lit(Lit::Null(..))
        | Expr::This(..)
        | Expr::Ident(..)
        | Expr::PrivateName(..)
        | Expr::Member(..)
        | Expr::SuperProp(..)
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

        Expr::TaggedTpl(..) => true,

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

        Expr::JSXMember(..)
        | Expr::JSXNamespacedName(..)
        | Expr::JSXEmpty(..)
        | Expr::JSXElement(..)
        | Expr::JSXFragment(..) => unreachable!("destructuring jsx"),

        // Trust user
        Expr::TsNonNull(..) => false,
        Expr::TsAs(TsAsExpr { ref expr, .. })
        | Expr::TsTypeAssertion(TsTypeAssertion { ref expr, .. })
        | Expr::TsConstAssertion(TsConstAssertion { ref expr, .. }) => can_be_null(expr),
        Expr::OptChain(ref e) => can_be_null(&e.expr),

        Expr::Invalid(..) => unreachable!(),
    }
}

#[derive(Default)]
struct DestructuringVisitor {
    found: bool,
}

impl Visit for DestructuringVisitor {
    noop_visit_type!();

    fn visit_pat(&mut self, node: &Pat) {
        node.visit_children_with(self);
        match *node {
            Pat::Ident(..) => {}
            _ => self.found = true,
        }
    }
}

impl Check for DestructuringVisitor {
    fn should_handle(&self) -> bool {
        self.found
    }
}
