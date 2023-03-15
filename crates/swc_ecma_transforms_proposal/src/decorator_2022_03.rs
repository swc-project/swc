use std::iter::once;

use swc_common::{util::take::Take, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{
    prepend_stmt, private_ident, prop_name_to_expr_value, quote_ident, ExprFactory,
};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

pub fn decorator_2022_03() -> impl VisitMut + Fold {
    as_folder(Decorator202203::default())
}

#[derive(Debug, Default)]
struct Decorator202203 {
    /// Variables without initializer.
    extra_vars: Vec<VarDeclarator>,
    cur_inits: Vec<(Ident, Vec<Option<ExprOrSpread>>)>,

    /// Injected into static blocks.
    extra_stmts: Vec<Stmt>,

    computed_key_inits: Vec<Box<Expr>>,
}

impl Decorator202203 {
    /// Moves `cur_inits` to `extra_stmts`.
    fn consume_inits(&mut self) {
        if self.cur_inits.is_empty() {
            return;
        }

        let mut lhs = vec![];
        let mut combined_args = vec![ThisExpr { span: DUMMY_SP }.as_arg()];
        let mut arrays = vec![];

        for (id, args) in self.cur_inits.drain(..) {
            lhs.push(Some(id.into()));

            arrays.extend(args);
        }
        combined_args.push(
            ArrayLit {
                span: DUMMY_SP,
                elems: arrays,
            }
            .as_arg(),
        );
        combined_args.push(
            ArrayLit {
                span: DUMMY_SP,
                elems: vec![],
            }
            .as_arg(),
        );

        let expr = Box::new(Expr::Assign(AssignExpr {
            span: DUMMY_SP,
            op: op!("="),
            left: PatOrExpr::Pat(Box::new(Pat::Array(ArrayPat {
                span: DUMMY_SP,
                elems: lhs,
                type_ann: Default::default(),
                optional: false,
            }))),
            right: Box::new(
                CallExpr {
                    span: DUMMY_SP,
                    callee: helper!(get, "applyDecs2203R"),
                    args: combined_args,
                    type_args: Default::default(),
                }
                .make_member(quote_ident!("e")),
            ),
        }));

        self.extra_stmts.push(Stmt::Expr(ExprStmt {
            span: DUMMY_SP,
            expr,
        }));
    }

    /// Returns (name, initilaizer_name)
    fn initializer_name(&mut self, name: &mut PropName) -> (Box<Expr>, Ident) {
        match name {
            PropName::Ident(i) => (
                Box::new(Expr::Lit(Lit::Str(Str {
                    span: i.span.with_ctxt(SyntaxContext::empty()),
                    value: i.sym.clone(),
                    raw: None,
                }))),
                Ident::new(format!("_init_{}", i.sym).into(), i.span.private()),
            ),
            _ => {
                let ident = private_ident!("_computedKey");
                self.extra_vars.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Ident(ident.clone().into()),
                    init: None,
                    definite: false,
                });

                self.computed_key_inits
                    .push(Box::new(Expr::Assign(AssignExpr {
                        span: DUMMY_SP,
                        op: op!("="),
                        left: PatOrExpr::Pat(ident.clone().into()),
                        right: Box::new(prop_name_to_expr_value(name.take())),
                    })));
                *name = PropName::Computed(ComputedPropName {
                    span: DUMMY_SP,
                    expr: ident.clone().into(),
                });

                let init = Ident::new("_init_computedKey".into(), ident.span.private());

                (Box::new(Expr::Ident(ident)), init)
            }
        }
    }
}

impl VisitMut for Decorator202203 {
    noop_visit_mut_type!();

    fn visit_mut_class(&mut self, n: &mut Class) {
        let old_stmts = self.extra_stmts.take();

        n.visit_mut_children_with(self);

        self.consume_inits();

        if !self.extra_stmts.is_empty() {
            n.body.insert(
                0,
                ClassMember::StaticBlock(StaticBlock {
                    span: DUMMY_SP,
                    body: BlockStmt {
                        span: DUMMY_SP,
                        stmts: self.extra_stmts.take(),
                    },
                }),
            );
        }

        self.extra_stmts = old_stmts;
    }

    fn visit_mut_class_prop(&mut self, p: &mut ClassProp) {
        p.visit_mut_children_with(self);

        if p.decorators.is_empty() {
            return;
        }

        let (name, init) = self.initializer_name(&mut p.key);

        self.extra_vars.push(VarDeclarator {
            span: p.span,
            name: Pat::Ident(init.clone().into()),
            init: None,
            definite: false,
        });

        p.value = Some(Box::new(Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: init.clone().as_callee(),
            args: once(ThisExpr { span: DUMMY_SP }.as_arg())
                .chain(p.value.take().map(|v| v.as_arg()))
                .collect(),
            type_args: Default::default(),
        })));

        let initialize_init = p
            .decorators
            .take()
            .into_iter()
            .map(|dec| {
                ArrayLit {
                    span: DUMMY_SP,
                    elems: vec![
                        Some(dec.expr.as_arg()),
                        Some(if p.is_static { 5.as_arg() } else { 0.as_arg() }),
                        Some(name.clone().as_arg()),
                    ],
                }
                .as_arg()
            })
            .map(Some)
            .collect();

        self.cur_inits.push((init, initialize_init))
    }

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        let mut new = Vec::with_capacity(n.len());

        for mut n in n.take() {
            n.visit_mut_with(self);
            if !self.computed_key_inits.is_empty() {
                new.push(
                    Stmt::Expr(ExprStmt {
                        span: DUMMY_SP,
                        expr: Expr::from_exprs(self.computed_key_inits.take()),
                    })
                    .into(),
                )
            }
            new.push(n.take());
        }

        if !self.extra_vars.is_empty() {
            prepend_stmt(
                &mut new,
                VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    decls: self.extra_vars.take(),
                    declare: false,
                }
                .into(),
            );
        }

        *n = new;
    }

    fn visit_mut_private_prop(&mut self, p: &mut PrivateProp) {
        p.visit_mut_children_with(self);

        if p.decorators.is_empty() {
            return;
        }

        let init = private_ident!(format!("_init_{}", p.key.id.sym));

        self.extra_vars.push(VarDeclarator {
            span: p.span,
            name: Pat::Ident(init.clone().into()),
            init: None,
            definite: false,
        });

        p.value = Some(Box::new(Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: init.clone().as_callee(),
            args: once(ThisExpr { span: DUMMY_SP }.as_arg())
                .chain(p.value.take().map(|v| v.as_arg()))
                .collect(),
            type_args: Default::default(),
        })));

        let initialize_init = p
            .decorators
            .take()
            .into_iter()
            .map(|dec| {
                let access_expr = Box::new(Expr::Member(MemberExpr {
                    span: DUMMY_SP,
                    obj: Box::new(Expr::This(ThisExpr { span: DUMMY_SP })),
                    prop: MemberProp::PrivateName(p.key.clone()),
                }));

                let getter = Box::new(Function {
                    span: DUMMY_SP,
                    body: Some(BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![Stmt::Return(ReturnStmt {
                            span: DUMMY_SP,
                            arg: Some(access_expr.clone()),
                        })],
                    }),
                    is_async: false,
                    is_generator: false,
                    decorators: Default::default(),
                    params: Default::default(),
                    type_params: Default::default(),
                    return_type: Default::default(),
                });
                let settter_arg = private_ident!("value");
                let setter = Box::new(Function {
                    span: DUMMY_SP,
                    body: Some(BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![Stmt::Expr(ExprStmt {
                            span: DUMMY_SP,
                            expr: Box::new(Expr::Assign(AssignExpr {
                                span: DUMMY_SP,
                                op: op!("="),
                                left: PatOrExpr::Expr(access_expr),
                                right: Box::new(Expr::Ident(settter_arg.clone())),
                            })),
                        })],
                    }),
                    is_async: false,
                    is_generator: false,
                    decorators: Default::default(),
                    params: vec![Param {
                        span: DUMMY_SP,
                        decorators: Default::default(),
                        pat: Pat::Ident(settter_arg.into()),
                    }],
                    type_params: Default::default(),
                    return_type: Default::default(),
                });

                ArrayLit {
                    span: DUMMY_SP,
                    elems: vec![
                        Some(dec.expr.as_arg()),
                        Some(if p.is_static { 5.as_arg() } else { 0.as_arg() }),
                        Some((&*p.key.id.sym).as_arg()),
                        Some(
                            FnExpr {
                                ident: None,
                                function: getter,
                            }
                            .as_arg(),
                        ),
                        Some(
                            FnExpr {
                                ident: None,
                                function: setter,
                            }
                            .as_arg(),
                        ),
                    ],
                }
                .as_arg()
            })
            .map(Some)
            .collect();

        self.cur_inits.push((init, initialize_init))
    }

    fn visit_mut_stmts(&mut self, n: &mut Vec<Stmt>) {
        let mut new = Vec::with_capacity(n.len());

        for mut n in n.take() {
            n.visit_mut_with(self);
            if !self.computed_key_inits.is_empty() {
                new.push(Stmt::Expr(ExprStmt {
                    span: DUMMY_SP,
                    expr: Expr::from_exprs(self.computed_key_inits.take()),
                }))
            }
            new.push(n.take());
        }

        if !self.extra_vars.is_empty() {
            prepend_stmt(
                &mut new,
                VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    decls: self.extra_vars.take(),
                    declare: false,
                }
                .into(),
            );
        }

        *n = new;
    }
}
