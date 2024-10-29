use std::{iter, mem};

use serde::Deserialize;
use swc_common::{util::take::Take, Span, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_compat_common::impl_visit_mut_fn;
use swc_ecma_transforms_base::{helper, helper_expr, perf::Check};
use swc_ecma_transforms_macros::fast_path;
use swc_ecma_utils::{
    alias_ident_for, alias_if_required, has_rest_pat, is_literal, member_expr, private_ident,
    prop_name_to_expr, quote_ident, ExprFactory, StmtLike,
};
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, visit_mut_pass, Visit, VisitMut, VisitMutWith, VisitWith,
};
use swc_trace_macro::swc_trace;

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
///     _arr2 = _to_array(_arr),
///     a = _arr2[0],
///     b = _arr2[1],
///     rest = _arr2.slice(2);
/// ```
pub fn destructuring(c: Config) -> impl Pass {
    visit_mut_pass(Destructuring { c })
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
            for_stmt.visit_mut_children_with(self);

            let (left, stmt) = match &mut for_stmt.left {
                ForHead::VarDecl(var_decl) => {
                    let has_complex = var_decl.decls.iter().any(|d| match d.name {
                        Pat::Ident(_) => false,
                        _ => true,
                    });

                    if !has_complex {
                        return;
                    }
                    let ref_ident = make_ref_ident_for_for_stmt();
                    let left = VarDecl {
                        decls: vec![VarDeclarator {
                            span: DUMMY_SP,
                            name: ref_ident.clone().into(),
                            init: None,
                            definite: false,
                        }],
                        span: var_decl.span,
                        kind: var_decl.kind,
                        declare: var_decl.declare,
                        ..Default::default()
                    }
                    .into();

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
                    let stmt: Stmt = VarDecl {
                        span: var_decl.span(),
                        kind: VarDeclKind::Let,
                        decls,
                        ..Default::default()
                    }
                    .into();
                    (left, stmt)
                }
                ForHead::Pat(pat) => match **pat {
                    Pat::Ident(..) => {
                        return;
                    }
                    _ => {
                        let left_ident = make_ref_ident_for_for_stmt();
                        let left = ForHead::Pat(left_ident.clone().into());
                        // Unpack variables
                        let stmt = AssignExpr {
                            span: DUMMY_SP,
                            left: pat.take().try_into().unwrap(),
                            op: op!("="),
                            right: Box::new(left_ident.into()),
                        }
                        .into_stmt();
                        (left, stmt)
                    }
                },

                ForHead::UsingDecl(..) => {
                    unreachable!("using declaration must be removed by previous pass")
                }
            };

            for_stmt.left = left;

            for_stmt.body = Box::new(Stmt::Block(match &mut *for_stmt.body {
                Stmt::Block(BlockStmt { span, stmts, ctxt }) => BlockStmt {
                    span: *span,
                    stmts: iter::once(stmt).chain(stmts.take()).collect(),
                    ctxt: *ctxt,
                },
                body => BlockStmt {
                    stmts: vec![stmt, body.take()],
                    ..Default::default()
                },
            }));
        }
    };
}

fn make_ref_ident_for_for_stmt() -> Ident {
    private_ident!("ref")
}

#[swc_trace]
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
                            if !elems.is_empty()
                                && (elems.len() == arr.elems.len()
                                    || (elems.len() < arr.elems.len() && has_rest_pat(&elems))) =>
                        {
                            let mut arr_elems = Some(arr.elems.into_iter());
                            elems.into_iter().for_each(|p| match p {
                                Some(Pat::Rest(p)) => {
                                    self.visit_mut_var_decl(
                                        decls,
                                        VarDeclarator {
                                            span: p.span(),
                                            name: *p.arg,
                                            init: Some(
                                                ArrayLit {
                                                    span: DUMMY_SP,
                                                    elems: arr_elems
                                                        .take()
                                                        .expect("two rest element?")
                                                        .collect(),
                                                }
                                                .into(),
                                            ),
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
                        usize::MAX
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
                            init: Some(
                                CallExpr {
                                    span: DUMMY_SP,
                                    callee: ref_ident
                                        .clone()
                                        .make_member(quote_ident!("slice"))
                                        .as_callee(),
                                    args: vec![Number {
                                        value: i as f64,
                                        span: dot3_token,
                                        raw: None,
                                    }
                                    .as_arg()],
                                    ..Default::default()
                                }
                                .into(),
                            ),
                            definite: false,
                        },
                        _ => VarDeclarator {
                            span: elem.span(),
                            // This might be pattern.
                            // So we fold it again.
                            name: elem,
                            init: Some(make_ref_idx_expr(&ref_ident, i).into()),
                            definite: false,
                        },
                    };

                    let mut var_decls = vec![var_decl];
                    var_decls.visit_mut_with(self);
                    decls.extend(var_decls);
                }
            }
            Pat::Object(ObjectPat { span, props, .. }) if props.is_empty() => {
                // We should convert
                //
                //      var {} = null;
                //
                // to
                //
                //      var _ref = null;
                //      _object_destructuring_empty(_ref);
                //

                let expr = helper_expr!(object_destructuring_empty).as_call(
                    DUMMY_SP,
                    vec![decl
                        .init
                        .expect("destructuring must be initialized")
                        .as_arg()],
                );

                let var_decl = VarDeclarator {
                    span: DUMMY_SP,
                    name: private_ident!(span, "ref").into(),
                    init: Some(Box::new(expr)),
                    definite: false,
                };

                decls.push(var_decl);
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
                            init: Some(decl.init.unwrap().make_member(p.key.clone().into()).into()),
                            definite: false,
                        });
                        return;
                    }
                }

                let can_be_null = can_be_null(decl.init.as_ref().unwrap());

                let ref_decls = if self.exporting {
                    &mut self.vars
                } else {
                    &mut *decls
                };

                let ref_ident = make_ref_ident(self.c, ref_decls, decl.init);

                let ref_ident = if can_be_null {
                    let init = ref_ident.into();
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
                                            key.clone().into(),
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
                                            key.clone().into(),
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
                let init = if let Some(init) = decl.init {
                    let tmp_ident = match &*init {
                        Expr::Ident(ref i) if i.ctxt != SyntaxContext::empty() => i.clone(),

                        _ => {
                            let tmp_ident = private_ident!(span, "tmp");
                            decls.push(VarDeclarator {
                                span: DUMMY_SP,
                                name: tmp_ident.clone().into(),
                                init: Some(init),
                                definite: false,
                            });

                            tmp_ident
                        }
                    };

                    // tmp === void 0 ? def_value : tmp
                    Some(Box::new(make_cond_expr(tmp_ident, def_value)))
                } else {
                    Some(def_value)
                };

                let var_decl = VarDeclarator {
                    span,
                    name: *left,
                    init,
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

#[swc_trace]
#[fast_path(DestructuringVisitor)]
impl VisitMut for Destructuring {
    noop_visit_mut_type!(fail);

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

#[swc_trace]
impl Destructuring {
    fn visit_mut_fn_like(
        &mut self,
        ps: &mut Vec<Param>,
        body: &mut BlockStmt,
    ) -> (Vec<Param>, BlockStmt) {
        let mut params = Vec::new();
        let mut decls = Vec::new();

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
                        init: Some(ref_ident.into()),
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
            let mut stmt: Stmt = VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Let,
                decls,
                declare: false,
                ..Default::default()
            }
            .into();

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

impl AssignFolder {
    pub fn handle_assign_pat(
        &mut self,
        span: Span,
        mut pat: AssignPat,
        right: &mut Box<Expr>,
    ) -> Expr {
        let ref_ident = make_ref_ident(self.c, &mut self.vars, None);

        let mut exprs = vec![Box::new(
            AssignExpr {
                span,
                left: ref_ident.clone().into(),
                op: op!("="),
                right: right.take(),
            }
            .into(),
        )];

        let mut assign_cond_expr: Expr = AssignExpr {
            span,
            left: pat.left.take().try_into().unwrap(),
            op: op!("="),
            right: Box::new(make_cond_expr(ref_ident, pat.right.take())),
        }
        .into();

        assign_cond_expr.visit_mut_with(self);
        exprs.push(Box::new(assign_cond_expr));

        SeqExpr {
            span: DUMMY_SP,
            exprs,
        }
        .into()
    }
}

#[swc_trace]
#[fast_path(DestructuringVisitor)]
impl VisitMut for AssignFolder {
    noop_visit_mut_type!(fail);

    fn visit_mut_export_decl(&mut self, decl: &mut ExportDecl) {
        let old = self.exporting;
        self.exporting = true;
        decl.visit_mut_children_with(self);
        self.exporting = old;
    }

    fn visit_mut_function(&mut self, f: &mut Function) {
        let exporting = mem::replace(&mut self.exporting, false);
        f.visit_mut_children_with(self);
        self.exporting = exporting;
    }

    fn visit_mut_class(&mut self, f: &mut Class) {
        let exporting = mem::replace(&mut self.exporting, false);
        f.visit_mut_children_with(self);
        self.exporting = exporting;
    }

    fn visit_mut_object_lit(&mut self, f: &mut ObjectLit) {
        let exporting = mem::replace(&mut self.exporting, false);
        f.visit_mut_children_with(self);
        self.exporting = exporting;
    }

    fn visit_mut_arrow_expr(&mut self, f: &mut ArrowExpr) {
        let exporting = mem::replace(&mut self.exporting, false);
        f.visit_mut_children_with(self);
        self.exporting = exporting;
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
            left: AssignTarget::Pat(pat),
            op: op!("="),
            right,
        }) = expr
        {
            match pat {
                // Pat::Expr(pat_expr) => {
                //     *expr = Expr::Assign(AssignExpr {
                //         span: *span,
                //         left: pat_expr.take().try_into().unwrap(),
                //         op: op!("="),
                //         right: right.take(),
                //     });
                // }
                AssignTargetPat::Array(ArrayPat { elems, .. }) => {
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
                                        exprs.push(
                                            AssignExpr {
                                                span: p.span(),
                                                left: p.arg.take().try_into().unwrap(),
                                                op: op!("="),
                                                right: Box::new(
                                                    ArrayLit {
                                                        span: DUMMY_SP,
                                                        elems: arr_elems
                                                            .take()
                                                            .expect("two rest element?")
                                                            .collect(),
                                                    }
                                                    .into(),
                                                ),
                                            }
                                            .into(),
                                        );
                                    }
                                    Some(p) => {
                                        let e = arr_elems
                                            .as_mut()
                                            .expect("pattern after rest element?")
                                            .next()
                                            .and_then(|v| v);
                                        let mut right = e
                                            .map(|e| {
                                                debug_assert_eq!(e.spread, None);
                                                e.expr
                                            })
                                            .unwrap_or_else(|| Expr::undefined(p.span()));

                                        let p = p.take();
                                        let mut expr = if let Pat::Assign(pat) = p {
                                            self.handle_assign_pat(*span, pat, &mut right)
                                        } else {
                                            AssignExpr {
                                                span: p.span(),
                                                left: p.try_into().unwrap(),
                                                op: op!("="),
                                                right,
                                            }
                                            .into()
                                        };

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
                            usize::MAX
                        } else {
                            elems.len()
                        }),
                    );
                    exprs.push(
                        AssignExpr {
                            span: DUMMY_SP,
                            op: op!("="),
                            left: ref_ident.clone().into(),
                            right: if self.c.loose {
                                right.take()
                            } else {
                                match &mut **right {
                                    Expr::Ident(Ident { sym, .. }) if &**sym == "arguments" => {
                                        Box::new(
                                            CallExpr {
                                                span: DUMMY_SP,
                                                callee: member_expr!(
                                                    Default::default(),
                                                    Default::default(),
                                                    Array.prototype.slice.call
                                                )
                                                .as_callee(),
                                                args: vec![right.take().as_arg()],
                                                ..Default::default()
                                            }
                                            .into(),
                                        )
                                    }
                                    Expr::Array(..) => right.take(),
                                    _ => {
                                        // if left has rest then need `_to_array`
                                        // else `_sliced_to_array`
                                        if elems
                                            .iter()
                                            .any(|elem| matches!(elem, Some(Pat::Rest(..))))
                                        {
                                            Box::new(
                                                CallExpr {
                                                    span: DUMMY_SP,
                                                    callee: helper!(to_array),
                                                    args: vec![right.take().as_arg()],
                                                    ..Default::default()
                                                }
                                                .into(),
                                            )
                                        } else {
                                            Box::new(
                                                CallExpr {
                                                    span: DUMMY_SP,
                                                    callee: helper!(sliced_to_array),
                                                    args: vec![
                                                        right.take().as_arg(),
                                                        elems.len().as_arg(),
                                                    ],
                                                    ..Default::default()
                                                }
                                                .into(),
                                            )
                                        }
                                    }
                                }
                            },
                        }
                        .into(),
                    );

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
                                exprs.push(
                                    AssignExpr {
                                        span: DUMMY_SP,
                                        left: assign_ref_ident.clone().into(),
                                        op: op!("="),
                                        right: ref_ident.clone().computed_member(i as f64).into(),
                                    }
                                    .into(),
                                );

                                let mut assign_expr: Expr = AssignExpr {
                                    span: *span,
                                    left: left.take().try_into().unwrap(),
                                    op: op!("="),
                                    right: Box::new(make_cond_expr(assign_ref_ident, right.take())),
                                }
                                .into();
                                assign_expr.visit_mut_with(self);

                                exprs.push(Box::new(assign_expr));
                            }
                            Pat::Rest(RestPat { arg, .. }) => {
                                let mut assign_expr: Expr = AssignExpr {
                                    span: elem_span,
                                    op: op!("="),
                                    left: arg.take().try_into().unwrap(),
                                    right: CallExpr {
                                        span: DUMMY_SP,
                                        callee: ref_ident
                                            .clone()
                                            .make_member(quote_ident!("slice"))
                                            .as_callee(),
                                        args: vec![(i as f64).as_arg()],
                                        ..Default::default()
                                    }
                                    .into(),
                                }
                                .into();

                                assign_expr.visit_mut_with(self);
                                exprs.push(Box::new(assign_expr));
                            }
                            _ => {
                                let mut assign_expr: Expr = AssignExpr {
                                    span: elem_span,
                                    op: op!("="),
                                    left: elem.take().try_into().unwrap(),
                                    right: make_ref_idx_expr(&ref_ident, i).into(),
                                }
                                .into();

                                assign_expr.visit_mut_with(self);
                                exprs.push(Box::new(assign_expr))
                            }
                        }
                    }

                    // last one should be `ref`
                    exprs.push(ref_ident.into());

                    *expr = SeqExpr {
                        span: DUMMY_SP,
                        exprs,
                    }
                    .into()
                }
                AssignTargetPat::Object(ObjectPat { props, .. }) if props.is_empty() => {
                    let mut right = right.take();
                    right.visit_mut_with(self);

                    *expr = helper_expr!(object_destructuring_empty)
                        .as_call(DUMMY_SP, vec![right.as_arg()]);
                }
                AssignTargetPat::Object(ObjectPat { span, props, .. }) => {
                    if props.len() == 1 {
                        if let ObjectPatProp::Assign(p @ AssignPatProp { value: None, .. }) =
                            &props[0]
                        {
                            *expr = AssignExpr {
                                span: *span,
                                op: op!("="),
                                left: p.key.clone().into(),
                                right: right.take().make_member(p.key.clone().into()).into(),
                            }
                            .into();
                            return;
                        }
                    }

                    let ref_ident = make_ref_ident(self.c, &mut self.vars, None);

                    let mut exprs = vec![Box::new(Expr::Assign(AssignExpr {
                        span: *span,
                        left: ref_ident.clone().into(),
                        op: op!("="),
                        right: right.take(),
                    }))];

                    for prop in props {
                        let span = prop.span();
                        match prop {
                            ObjectPatProp::KeyValue(KeyValuePatProp { key, value }) => {
                                let computed = matches!(key, PropName::Computed(..));

                                let mut right = Box::new(make_ref_prop_expr(
                                    &ref_ident,
                                    Box::new(prop_name_to_expr(key.take())),
                                    computed,
                                ));
                                let value = value.take();

                                let mut expr = if let Pat::Assign(pat) = *value {
                                    self.handle_assign_pat(span, pat, &mut right)
                                } else {
                                    AssignExpr {
                                        span,
                                        left: value.try_into().unwrap(),
                                        op: op!("="),
                                        right,
                                    }
                                    .into()
                                };

                                expr.visit_mut_with(self);
                                exprs.push(Box::new(expr));
                            }
                            ObjectPatProp::Assign(AssignPatProp { key, value, .. }) => {
                                let computed = false;

                                match value {
                                    Some(value) => {
                                        let prop_ident =
                                            make_ref_ident(self.c, &mut self.vars, None);

                                        exprs.push(
                                            AssignExpr {
                                                span,
                                                left: prop_ident.clone().into(),
                                                op: op!("="),
                                                right: Box::new(make_ref_prop_expr(
                                                    &ref_ident,
                                                    key.clone().into(),
                                                    computed,
                                                )),
                                            }
                                            .into(),
                                        );

                                        exprs.push(
                                            AssignExpr {
                                                span,
                                                left: key.clone().into(),
                                                op: op!("="),
                                                right: Box::new(make_cond_expr(
                                                    prop_ident,
                                                    value.take(),
                                                )),
                                            }
                                            .into(),
                                        );
                                    }
                                    None => {
                                        exprs.push(
                                            AssignExpr {
                                                span,
                                                left: key.clone().into(),
                                                op: op!("="),
                                                right: Box::new(make_ref_prop_expr(
                                                    &ref_ident,
                                                    key.clone().into(),
                                                    computed,
                                                )),
                                            }
                                            .into(),
                                        );
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
                    exprs.push(ref_ident.into());

                    *expr = SeqExpr {
                        span: DUMMY_SP,
                        exprs,
                    }
                    .into();
                }

                AssignTargetPat::Invalid(..) => unreachable!(),
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

    fn visit_mut_var_decl(&mut self, var_decl: &mut VarDecl) {
        var_decl.decls.visit_mut_with(self);

        if var_decl.kind == VarDeclKind::Const {
            var_decl.decls.iter_mut().for_each(|v| {
                if v.init.is_none() {
                    v.init = Some(Expr::undefined(DUMMY_SP));
                }
            })
        }
    }
}

#[swc_trace]
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
                vars: Vec::new(),
                ignore_return_value: None,
            };

            match stmt.try_into_stmt() {
                Err(mut item) => {
                    item.visit_mut_with(&mut folder);

                    // Add variable declaration
                    // e.g. var ref
                    if !folder.vars.is_empty() {
                        stmts_updated.push(T::from(
                            VarDecl {
                                span: DUMMY_SP,
                                kind: VarDeclKind::Var,
                                decls: folder.vars,
                                ..Default::default()
                            }
                            .into(),
                        ));
                    }

                    stmts_updated.push(item);
                }
                Ok(mut stmt) => {
                    stmt.visit_mut_with(&mut folder);

                    // Add variable declaration
                    // e.g. var ref
                    if !folder.vars.is_empty() {
                        stmts_updated.push(T::from(
                            VarDecl {
                                span: DUMMY_SP,
                                kind: VarDeclKind::Var,
                                decls: folder.vars,
                                ..Default::default()
                            }
                            .into(),
                        ));
                    }

                    stmts_updated.push(T::from(stmt));
                }
            }
        }

        *stmts = stmts_updated;
    }
}

fn make_ref_idx_expr(ref_ident: &Ident, i: usize) -> MemberExpr {
    ref_ident.clone().computed_member(i as f64)
}

fn make_ref_ident(c: Config, decls: &mut Vec<VarDeclarator>, init: Option<Box<Expr>>) -> Ident {
    make_ref_ident_for_array(c, decls, init, None)
}

#[tracing::instrument(level = "info", skip_all)]
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
                                callee: helper!(to_array),
                                args: vec![v.as_arg()],
                                ..Default::default()
                            }
                            .into(),
                        ),
                        Some(value) => Box::new(
                            CallExpr {
                                span: DUMMY_SP,
                                callee: helper!(sliced_to_array),
                                args: vec![v.as_arg(), value.as_arg()],
                                ..Default::default()
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
    computed |= !matches!(*prop, Expr::Ident(..));

    MemberExpr {
        span: DUMMY_SP,
        obj: Box::new(ref_ident.clone().into()),
        prop: if computed {
            MemberProp::Computed(ComputedPropName {
                span: DUMMY_SP,
                expr: prop,
            })
        } else {
            MemberProp::Ident(prop.ident().unwrap().into())
        },
    }
    .into()
}

/// Creates `tmp === void 0 ? def_value : tmp`
fn make_cond_expr(tmp: Ident, def_value: Box<Expr>) -> Expr {
    CondExpr {
        span: DUMMY_SP,
        test: BinExpr {
            span: DUMMY_SP,
            left: Box::new(Expr::Ident(tmp.clone())),
            op: op!("==="),
            right: Box::new(Expr::Unary(UnaryExpr {
                span: DUMMY_SP,
                op: op!("void"),
                arg: 0.0.into(),
            })),
        }
        .into(),
        cons: def_value,
        alt: tmp.into(),
    }
    .into()
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
        | Expr::OptChain(..)
        | Expr::New(..)
        | Expr::Yield(..)
        | Expr::Await(..)
        | Expr::MetaProp(..) => true,

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

        Expr::Unary(..) | Expr::Update(..) | Expr::Bin(..) => true,

        Expr::JSXMember(..)
        | Expr::JSXNamespacedName(..)
        | Expr::JSXEmpty(..)
        | Expr::JSXElement(..)
        | Expr::JSXFragment(..) => unreachable!("destructuring jsx"),

        Expr::TsNonNull(..) => false,
        Expr::TsAs(TsAsExpr { ref expr, .. })
        | Expr::TsTypeAssertion(TsTypeAssertion { ref expr, .. })
        | Expr::TsConstAssertion(TsConstAssertion { ref expr, .. })
        | Expr::TsInstantiation(TsInstantiation { ref expr, .. })
        | Expr::TsSatisfies(TsSatisfiesExpr { ref expr, .. }) => can_be_null(expr),

        Expr::Invalid(..) => unreachable!(),
    }
}

#[derive(Default)]
struct DestructuringVisitor {
    found: bool,
}

impl Visit for DestructuringVisitor {
    noop_visit_type!(fail);

    fn visit_assign_target_pat(&mut self, _: &AssignTargetPat) {
        self.found = true;
    }

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

#[cfg(test)]
mod tests {
    use swc_ecma_transforms_testing::test;

    use super::*;

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| destructuring(Default::default()),
        nested_for_of,
        r#"
            for (const [k1, v1] of Object.entries(o)){
                for (const [k2, v2] of Object.entries(o)){
                    console.log(k1, v1, k2, v2);
                }
            }        
        "#
    );
}
