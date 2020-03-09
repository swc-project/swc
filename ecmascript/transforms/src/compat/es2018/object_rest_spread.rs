use crate::{
    pass::Pass,
    util::{
        alias_ident_for, alias_if_required, is_literal, var::VarCollector, ExprFactory, StmtLike,
    },
};
use std::{iter, mem};
use swc_common::{
    chain, util::move_map::MoveMap, Fold, FoldWith, Mark, Spanned, Visit, VisitWith, DUMMY_SP,
};
use swc_ecma_ast::*;

/// `@babel/plugin-proposal-object-rest-spread`
pub fn object_rest_spread() -> impl Pass {
    chain!(ObjectRest, ObjectSpread)
}

struct ObjectRest;

noop_fold_type!(ObjectRest);

#[allow(clippy::vec_box)]
struct RestFolder {
    /// Injected before the original statement.
    vars: Vec<VarDeclarator>,
    /// Variables which should ceclaraed using `var`
    mutable_vars: Vec<VarDeclarator>,
    /// Assignment expressions.
    exprs: Vec<Box<Expr>>,
}

noop_fold_type!(RestFolder);

macro_rules! impl_for_for_stmt {
    ($T:tt) => {
        impl Fold<$T> for RestFolder {
            fn fold(&mut self, mut for_stmt: $T) -> $T {
                if !contains_rest(&for_stmt) {
                    return for_stmt;
                }

                let left = match for_stmt.left {
                    VarDeclOrPat::VarDecl(var_decl) => {
                        let ref_ident = private_ident!("_ref");
                        let left = VarDeclOrPat::VarDecl(VarDecl {
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(ref_ident.clone()),
                                init: None,
                                definite: false,
                            }],
                            ..var_decl
                        });

                        // Unpack variables
                        let mut decls = var_decl
                            .decls
                            .into_iter()
                            .map(|decl| VarDeclarator {
                                name: self.fold_rest(
                                    &mut 0,
                                    decl.name,
                                    box Expr::Ident(ref_ident.clone()),
                                    false,
                                    true,
                                ),
                                init: Some(box Expr::Ident(ref_ident.clone())),
                                ..decl
                            })
                            .collect::<Vec<_>>();
                        // .fold_with(self);

                        // **prepend** decls to self.vars
                        decls.append(&mut self.vars);
                        mem::swap(&mut self.vars, &mut decls);
                        left
                    }
                    VarDeclOrPat::Pat(pat) => {
                        let var_ident = private_ident!("_ref");
                        let mut index = self.vars.len();
                        let pat = self.fold_rest(
                            &mut index,
                            pat,
                            box Expr::Ident(var_ident.clone()),
                            false,
                            true,
                        );

                        // initialize (or destructure)
                        match pat {
                            Pat::Object(ObjectPat { ref props, .. }) if props.is_empty() => {}
                            _ => {
                                // insert at index to create
                                // `var { a } = _ref, b = _objectWithoutProperties(_ref, ['a']);`
                                // instead of
                                // var b = _objectWithoutProperties(_ref, ['a']), { a } = _ref;

                                // println!("Var(0): folded pat = var_ident",);
                                self.vars.insert(
                                    index,
                                    VarDeclarator {
                                        span: DUMMY_SP,
                                        name: pat,
                                        init: Some(box Expr::Ident(var_ident.clone())),
                                        definite: false,
                                    },
                                );
                            }
                        }

                        // `var _ref` in `for (var _ref in foo)`
                        VarDeclOrPat::VarDecl(VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Var,
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(var_ident.clone()),
                                init: None,
                                definite: false,
                            }],
                            declare: false,
                        })
                    }
                };
                for_stmt.left = left;

                let stmt = Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    decls: mem::replace(&mut self.vars, vec![]),
                    declare: false,
                }));

                for_stmt.body = box Stmt::Block(match *for_stmt.body {
                    Stmt::Block(BlockStmt { span, stmts }) => BlockStmt {
                        span,
                        stmts: iter::once(stmt).chain(stmts).collect(),
                    },
                    body => BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![stmt, body],
                    },
                });

                for_stmt
            }
        }
    };
}
impl_for_for_stmt!(ForInStmt);
impl_for_for_stmt!(ForOfStmt);

impl Fold<Vec<VarDeclarator>> for RestFolder {
    fn fold(&mut self, decls: Vec<VarDeclarator>) -> Vec<VarDeclarator> {
        // fast path
        if !contains_rest(&decls) {
            return decls;
        }

        for decl in decls {
            // fast path
            if !contains_rest(&decl) {
                // println!("Var: no rest",);
                self.vars.push(decl);
                continue;
            }

            let decl = decl.fold_children(self);

            //            if !contains_rest(&decl.name) {
            //                // println!("Var: no rest",);
            //                self.vars.push(decl);
            //                continue;
            //            }

            let (var_ident, _) = match decl.name {
                Pat::Ident(ref i) => (i.clone(), false),

                _ => match decl.init {
                    Some(ref e) => alias_if_required(e, "_ref"),
                    _ => (private_ident!("_ref"), true),
                },
            };

            let has_init = decl.init.is_some();
            if let Some(init) = decl.init {
                match decl.name {
                    // Optimize { ...props } = this.props
                    Pat::Object(ObjectPat { props, .. })
                        if props.len() == 1
                            && (match props[0] {
                                ObjectPatProp::Rest(..) => true,
                                _ => false,
                            }) =>
                    {
                        let prop = match props.into_iter().next().unwrap() {
                            ObjectPatProp::Rest(r) => r,
                            _ => unreachable!(),
                        };

                        self.vars.push(VarDeclarator {
                            span: prop.span(),
                            name: *prop.arg,
                            init: Some(box Expr::Call(CallExpr {
                                span: DUMMY_SP,
                                callee: helper!(extends, "extends"),
                                args: vec![
                                    ObjectLit {
                                        span: DUMMY_SP,
                                        props: vec![],
                                    }
                                    .as_arg(),
                                    init.as_arg(),
                                ],
                                type_args: Default::default(),
                            })),
                            definite: false,
                        });
                        continue;
                    }
                    _ => {}
                }

                match *init {
                    // skip `z = z`
                    Expr::Ident(..) => {}
                    _ => {
                        // println!("Var: var_ident = init",);
                        self.push_var_if_not_empty(VarDeclarator {
                            span: DUMMY_SP,
                            name: Pat::Ident(var_ident.clone()),
                            init: Some(init),
                            definite: false,
                        });
                    }
                }
            }

            let mut index = self.vars.len();
            let pat = self.fold_rest(
                &mut index,
                decl.name,
                box Expr::Ident(var_ident.clone()),
                false,
                true,
            );
            match pat {
                // skip `{} = z`
                Pat::Object(ObjectPat { ref props, .. }) if props.is_empty() => {}

                _ => {
                    // insert at index to create
                    // `var { a } = _ref, b = _objectWithoutProperties(_ref, ['a']);`
                    // instead of
                    // `var b = _objectWithoutProperties(_ref, ['a']), { a } = _ref;`
                    // println!("var: simplified pat = var_ident({:?})", var_ident);
                    self.insert_var_if_not_empty(
                        index,
                        VarDeclarator {
                            name: simplify_pat(pat),
                            // preserve
                            init: if has_init {
                                Some(box Expr::Ident(var_ident.clone()))
                            } else {
                                None
                            },
                            ..decl
                        },
                    )
                }
            }
        }

        mem::replace(&mut self.vars, vec![])
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
                let mut var_ident = alias_ident_for(&right, "_tmp");
                var_ident.span = var_ident.span.apply_mark(Mark::fresh(Mark::root()));

                // println!("Var: var_ident = None");
                self.mutable_vars.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Ident(var_ident.clone()),
                    init: None,
                    definite: false,
                });
                // println!("Expr: var_ident = right");
                self.exprs.push(box Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    left: PatOrExpr::Pat(box Pat::Ident(var_ident.clone())),
                    op: op!("="),
                    right,
                }));
                let pat =
                    self.fold_rest(&mut 0, pat, box Expr::Ident(var_ident.clone()), true, true);

                match pat {
                    Pat::Object(ObjectPat { ref props, .. }) if props.is_empty() => {}
                    _ => self.exprs.push(box Expr::Assign(AssignExpr {
                        span,
                        left: PatOrExpr::Pat(box pat),
                        op: op!("="),
                        right: box var_ident.clone().into(),
                    })),
                }
                self.exprs.push(box var_ident.into());
                Expr::Seq(SeqExpr {
                    span: DUMMY_SP,
                    exprs: mem::replace(&mut self.exprs, vec![]),
                })
            }
            _ => expr,
        }
    }
}

/// export var { b, ...c } = asdf2;
impl Fold<ModuleDecl> for RestFolder {
    fn fold(&mut self, decl: ModuleDecl) -> ModuleDecl {
        if !contains_rest(&decl) {
            // fast path
            return decl;
        }

        match decl {
            ModuleDecl::ExportDecl(ExportDecl {
                span,
                decl: Decl::Var(var_decl),
                ..
            }) => {
                let specifiers = {
                    let mut found = vec![];
                    let mut finder = VarCollector { to: &mut found };
                    var_decl.visit_with(&mut finder);
                    found
                        .into_iter()
                        .map(|(sym, ctxt)| NamedExportSpecifier {
                            span: DUMMY_SP,
                            orig: Ident::new(sym, DUMMY_SP.with_ctxt(ctxt)),
                            exported: None,
                        })
                        .map(ExportSpecifier::Named)
                        .collect()
                };

                let export = NamedExport {
                    span,
                    specifiers,
                    src: None,
                    type_only: false,
                };

                let mut var_decl = var_decl.fold_with(self);
                self.vars.append(&mut var_decl.decls);

                ModuleDecl::ExportNamed(export)
            }
            _ => decl.fold_children(self),
        }
    }
}

struct RestVisitor {
    found: bool,
}

impl Visit<ObjectPatProp> for RestVisitor {
    fn visit(&mut self, prop: &ObjectPatProp) {
        match *prop {
            ObjectPatProp::Rest(..) => self.found = true,
            _ => prop.visit_children(self),
        }
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

impl<T: StmtLike + VisitWith<RestVisitor> + FoldWith<RestFolder>> Fold<Vec<T>> for ObjectRest
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
            let mut folder = RestFolder {
                vars: vec![],
                mutable_vars: vec![],
                exprs: vec![],
            };
            let stmt = stmt.fold_with(&mut folder);

            // Add variable declaration
            // e.g. var ref
            if !folder.mutable_vars.is_empty() {
                buf.push(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    decls: folder.mutable_vars,
                    declare: false,
                }))));
            }

            if !folder.vars.is_empty() {
                buf.push(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    decls: folder.vars,
                    declare: false,
                }))));
            }

            buf.push(stmt);

            buf.extend(
                folder
                    .exprs
                    .into_iter()
                    .map(|v| v.into_stmt())
                    .map(T::from_stmt),
            );
        }

        buf
    }
}

impl_fold_fn!(RestFolder);

// impl Fold<ArrowExpr> for RestFolder {
//     fn fold(&mut self, f: ArrowExpr) -> ArrowExpr {
//         let body_span = f.body.span();
//         let (params, stmts) = self.fold_fn_like(
//             f.params,
//             match f.body {
//                 BlockStmtOrExpr::BlockStmt(block) => block.stmts,
//                 BlockStmtOrExpr::Expr(expr) => vec![Stmt::Return(ReturnStmt {
//                     span: DUMMY_SP,
//                     arg: Some(expr),
//                 })],
//             },
//         );
//         ArrowExpr {
//             params,
//             body: BlockStmtOrExpr::BlockStmt(BlockStmt {
//                 span: body_span,
//                 stmts,
//             }),
//             ..f
//         }
//     }
// }

// impl Fold<Function> for RestFolder {
//     fn fold(&mut self, f: Function) -> Function {
//         if f.body.is_none() {
//             return f;
//         }
//         let body = f.body.unwrap();

//         let (params, stmts) = self.fold_fn_like(f.params, body.stmts);
//         Function {
//             params,
//             body: Some(BlockStmt { stmts, ..body }),
//             ..f
//         }
//     }
// }

// impl Fold<CatchClause> for RestFolder {
//     fn fold(&mut self, mut c: CatchClause) -> CatchClause {
//         if !contains_rest(&c.param) {
//             // fast path
//             return c;
//         }

//         let pat = match c.param {
//             Some(pat) => pat,
//             _ => return c,
//         };

//         ;
//         let var_ident = private_ident!("_err");
//         let param = self.fold_rest(pat, box Expr::Ident(var_ident.clone()),
// false, true);         // initialize (or destructure)
//         self.push_var_if_not_empty(VarDeclarator {
//             span: DUMMY_SP,
//             name: param,
//             init: Some(box Expr::Ident(var_ident.clone())),
//             definite: false,
//         });
//         c.body.stmts = iter::once(Stmt::Decl(Decl::Var(VarDecl {
//             span: DUMMY_SP,
//             kind: VarDeclKind::Let,
//             decls: mem::replace(&mut self.vars, vec![]),
//             declare: false,
//         })))
//         .chain(c.body.stmts)
//         .collect();

//         CatchClause {
//             // catch (_err) {}
//             param: Some(Pat::Ident(var_ident)),
//             ..c
//         }
//     }
// }

impl RestFolder {
    fn insert_var_if_not_empty(&mut self, idx: usize, decl: VarDeclarator) {
        if let Some(box Expr::Ident(ref i1)) = decl.init {
            if let Pat::Ident(ref i2) = decl.name {
                if *i1 == *i2 {
                    return;
                }
            }
        }

        if let Pat::Object(ObjectPat { ref props, .. }) = decl.name {
            if props.is_empty() {
                return;
            }
        }
        self.vars.insert(idx, decl)
    }

    fn push_var_if_not_empty(&mut self, decl: VarDeclarator) {
        if let Some(box Expr::Ident(ref i1)) = decl.init {
            if let Pat::Ident(ref i2) = decl.name {
                if *i1 == *i2 {
                    return;
                }
            }
        }

        if let Pat::Object(ObjectPat { ref props, .. }) = decl.name {
            if props.is_empty() {
                return;
            }
        }
        self.vars.push(decl)
    }

    fn fold_fn_like(&mut self, params: Vec<Pat>, body: BlockStmt) -> (Vec<Pat>, BlockStmt) {
        if !contains_rest(&params) {
            // fast-path
            return (params, body);
        }

        let params = params
            .into_iter()
            .map(|param| {
                let var_ident = private_ident!(param.span(), "_param");
                let mut index = self.vars.len();
                let param = self.fold_rest(
                    &mut index,
                    param,
                    box Expr::Ident(var_ident.clone()),
                    false,
                    false,
                );
                match param {
                    Pat::Rest(..) | Pat::Ident(..) => param,
                    Pat::Assign(AssignPat {
                        left: box Pat::Ident(..),
                        ..
                    })
                    | Pat::Assign(AssignPat {
                        left: box Pat::Rest(..),
                        ..
                    })
                    | Pat::Assign(AssignPat {
                        left: box Pat::Array(..),
                        ..
                    }) => param,
                    Pat::Array(n) => {
                        let ArrayPat { span, elems, .. } = n;
                        let elems = elems
                            .into_iter()
                            .map(|elem| match elem {
                                Some(param @ Pat::Object(..)) => {
                                    // println!("Var(i): param = var_ident");
                                    self.insert_var_if_not_empty(
                                        index,
                                        VarDeclarator {
                                            span: DUMMY_SP,
                                            name: param,
                                            init: Some(box Expr::Ident(var_ident.clone())),
                                            definite: false,
                                        },
                                    );
                                    index += 1;
                                    Some(Pat::Ident(var_ident.clone()))
                                }
                                _ => elem,
                            })
                            .collect();

                        Pat::Array(ArrayPat { span, elems, ..n })
                    }
                    Pat::Assign(n) => {
                        let AssignPat {
                            span, left, right, ..
                        } = n;
                        self.insert_var_if_not_empty(
                            index,
                            VarDeclarator {
                                span,
                                name: *left,
                                init: Some(box Expr::Ident(var_ident.clone())),
                                definite: false,
                            },
                        );
                        Pat::Assign(AssignPat {
                            span,
                            left: box Pat::Ident(var_ident),
                            right,
                            ..n
                        })
                    }
                    _ => {
                        // initialize snd destructure
                        self.insert_var_if_not_empty(
                            index,
                            VarDeclarator {
                                span: DUMMY_SP,
                                name: param,
                                init: Some(box Expr::Ident(var_ident.clone())),
                                definite: false,
                            },
                        );
                        Pat::Ident(var_ident)
                    }
                }
            })
            .collect();

        (
            params,
            BlockStmt {
                stmts: if self.vars.is_empty() {
                    None
                } else {
                    Some(Stmt::Decl(Decl::Var(VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        decls: mem::replace(&mut self.vars, vec![]),
                        declare: false,
                    })))
                }
                .into_iter()
                .chain(body.stmts)
                .collect(),
                ..body
            },
        )
    }

    fn fold_rest(
        &mut self,
        index: &mut usize,
        pat: Pat,
        obj: Box<Expr>,
        use_expr_for_assign: bool,
        use_member_for_array: bool,
    ) -> Pat {
        // TODO(kdy1): Optimize when all fields are statically known.
        //
        // const { a: { ...bar }, b: { ...baz }, ...foo } = obj;
        //
        // can be
        //
        // const bar = _extends({}, obj.a), baz = _extends({}, obj.b), foo =
        // _extends({}, obj);

        let ObjectPat {
            span,
            props,
            type_ann,
            ..
        } = match pat {
            Pat::Object(pat) => pat,
            Pat::Assign(n) => {
                let AssignPat {
                    span, left, right, ..
                } = n;
                let left = box self.fold_rest(
                    index,
                    *left,
                    obj,
                    use_expr_for_assign,
                    use_member_for_array,
                );
                return Pat::Assign(AssignPat {
                    span,
                    left,
                    right,
                    ..n
                });
            }
            Pat::Array(n) => {
                let ArrayPat { span, elems, .. } = n;
                let elems = elems
                    .into_iter()
                    .enumerate()
                    .map(|(i, elem)| match elem {
                        Some(elem) => Some(self.fold_rest(
                            index,
                            elem,
                            if use_member_for_array {
                                box obj.clone().computed_member(i as f64)
                            } else {
                                obj.clone()
                            },
                            use_expr_for_assign,
                            use_member_for_array,
                        )),
                        None => None,
                    })
                    .collect();

                return Pat::Array(ArrayPat { span, elems, ..n });
            }
            _ => return pat,
        };

        let mut props: Vec<ObjectPatProp> = props
            .into_iter()
            .map(|prop| match prop {
                ObjectPatProp::Rest(n) => {
                    let RestPat {
                        arg, dot3_token, ..
                    } = n;

                    let pat = self.fold_rest(
                        index,
                        *arg,
                        // TODO: fix this. this is wrong
                        obj.clone(),
                        use_expr_for_assign,
                        use_member_for_array,
                    );
                    ObjectPatProp::Rest(RestPat {
                        dot3_token,
                        arg: box pat,
                        ..n
                    })
                }
                ObjectPatProp::KeyValue(KeyValuePatProp { key, value }) => {
                    let computed = match key {
                        PropName::Computed(..) => true,
                        PropName::Num(..) => true,
                        _ => false,
                    };

                    let (key, prop) = match key {
                        PropName::Ident(ref ident) => {
                            let ident = ident.clone();
                            (key, box Expr::Ident(ident))
                        }
                        PropName::Str(Str {
                            ref value, span, ..
                        }) => {
                            let value = value.clone();
                            (key, box Expr::Ident(quote_ident!(span, value)))
                        }
                        PropName::Num(Number { span, value }) => (
                            key,
                            box Expr::Lit(Lit::Str(Str {
                                span,
                                value: format!("{}", value).into(),
                                has_escape: false,
                            })),
                        ),
                        PropName::Computed(ref c) if is_literal(&c.expr) => {
                            let expr = c.expr.clone();
                            (key, expr)
                        }
                        PropName::Computed(c) => {
                            let (ident, aliased) = alias_if_required(&c.expr, "key");
                            if aliased {
                                *index += 1;
                                self.vars.push(VarDeclarator {
                                    span: DUMMY_SP,
                                    name: Pat::Ident(ident.clone()),
                                    init: Some(c.expr),
                                    definite: false,
                                });
                            }

                            (
                                PropName::Computed(ComputedPropName {
                                    span: c.span,
                                    expr: box Expr::Ident(ident.clone()),
                                }),
                                box Expr::Ident(ident),
                            )
                        }
                    };

                    let value = box self.fold_rest(
                        index,
                        *value,
                        box MemberExpr {
                            span: DUMMY_SP,
                            obj: obj.clone().as_obj(),
                            computed,
                            prop,
                        }
                        .into(),
                        use_expr_for_assign,
                        use_member_for_array,
                    );
                    ObjectPatProp::KeyValue(KeyValuePatProp { key, value })
                }
                _ => prop,
            })
            .collect();

        match props.last() {
            Some(ObjectPatProp::Rest(..)) => {}
            _ => {
                return Pat::Object(ObjectPat {
                    span,
                    props,
                    optional: false,
                    type_ann,
                });
            }
        }
        let last = match props.pop() {
            Some(ObjectPatProp::Rest(rest)) => rest,
            _ => unreachable!(),
        };

        let excluded_props = excluded_props(&props);

        if use_expr_for_assign {
            // println!("Expr: last.arg = objectWithoutProperties()",);
            self.exprs.push(box Expr::Assign(AssignExpr {
                span: DUMMY_SP,
                left: PatOrExpr::Pat(last.arg),
                op: op!("="),
                right: box object_without_properties(obj, excluded_props),
            }));
        } else {
            // println!("Var: rest = objectWithoutProperties()",);
            self.push_var_if_not_empty(VarDeclarator {
                span: DUMMY_SP,
                name: *last.arg,
                init: Some(box object_without_properties(obj, excluded_props)),
                definite: false,
            });
        }

        Pat::Object(ObjectPat {
            props,
            span,
            type_ann,
            optional: false,
        })
    }
}

fn object_without_properties(obj: Box<Expr>, excluded_props: Vec<Option<ExprOrSpread>>) -> Expr {
    if excluded_props.is_empty() {
        return Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: helper!(extends, "extends"),
            args: vec![
                ObjectLit {
                    span: DUMMY_SP,
                    props: vec![],
                }
                .as_arg(),
                obj.as_arg(),
            ],
            type_args: Default::default(),
        });
    }

    let excluded_props = excluded_props
        .into_iter()
        .map(|v| {
            v.map(|v| match *v.expr {
                Expr::Lit(Lit::Num(Number { span, value })) => ExprOrSpread {
                    expr: box Expr::Lit(Lit::Str(Str {
                        span,
                        value: value.to_string().into(),
                        has_escape: false,
                    })),
                    ..v
                },
                _ => v,
            })
        })
        .collect();

    Expr::Call(CallExpr {
        span: DUMMY_SP,
        callee: helper!(object_without_properties, "objectWithoutProperties"),
        args: vec![
            obj.as_arg(),
            if is_literal(&excluded_props) {
                ArrayLit {
                    span: DUMMY_SP,
                    elems: excluded_props,
                }
                .as_arg()
            } else {
                CallExpr {
                    span: DUMMY_SP,
                    callee: ArrayLit {
                        span: DUMMY_SP,
                        elems: excluded_props,
                    }
                    .member(Ident::new("map".into(), DUMMY_SP))
                    .as_callee(),
                    args: vec![helper_expr!(to_property_key, "toPropertyKey").as_arg()],
                    type_args: Default::default(),
                }
                .as_arg()
            },
        ],
        type_args: Default::default(),
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
                PropName::Num(Number { span, value }) => Lit::Str(Str {
                    span: *span,
                    value: format!("{}", value).into(),
                    has_escape: false,
                })
                .as_arg(),
                PropName::Computed(c) => c.expr.clone().as_arg(),
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

/// e.g.
///
///  - `{ x4: {}  }` -> `{}`
fn simplify_pat(pat: Pat) -> Pat {
    struct PatSimplifier;
    impl Fold<Pat> for PatSimplifier {
        fn fold(&mut self, pat: Pat) -> Pat {
            let pat = pat.fold_children(self);

            match pat {
                Pat::Object(o) => {
                    let ObjectPat { span, props, .. } = o;
                    let props = props.move_flat_map(|prop| match prop {
                        ObjectPatProp::KeyValue(KeyValuePatProp {
                            value: box Pat::Object(ObjectPat { ref props, .. }),
                            ..
                        }) if props.is_empty() => None,
                        _ => Some(prop),
                    });

                    Pat::Object(ObjectPat { span, props, ..o })
                }
                _ => pat,
            }
        }
    }

    pat.fold_with(&mut PatSimplifier)
}

struct ObjectSpread;

noop_fold_type!(ObjectSpread);

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
                            PropOrSpread::Spread(SpreadElement { expr, .. }) => {
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

                Expr::Call(CallExpr {
                    span,
                    callee: helper!(object_spread, "objectSpread"),
                    args,
                    type_args: Default::default(),
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
