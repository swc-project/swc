use std::{iter::once, mem::transmute};

use swc_common::{util::take::Take, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{
    constructor::inject_after_super, default_constructor, prepend_stmt, private_ident,
    prop_name_to_expr_value, quote_ident, ExprFactory, IdentExt,
};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

pub fn decorator_2022_03() -> impl VisitMut + Fold {
    as_folder(Decorator202203::default())
}

#[derive(Debug, Default)]
struct Decorator202203 {
    /// Variables without initializer.
    extra_vars: Vec<VarDeclarator>,
    static_inits: Vec<(Ident, Vec<Option<ExprOrSpread>>)>,
    cur_inits: Vec<(Ident, Vec<Option<ExprOrSpread>>)>,

    /// If not empty, `initProto` should be injected to the constructor.
    init_proto: Option<Ident>,
    init_proto_args: Vec<Option<ExprOrSpread>>,

    init_static: Option<Ident>,
    init_static_args: Vec<Option<ExprOrSpread>>,

    /// Injected into static blocks.
    extra_stmts: Vec<Stmt>,

    computed_key_inits: Vec<Box<Expr>>,

    class_lhs: Vec<Option<Pat>>,
    class_decorators: Vec<Option<ExprOrSpread>>,
}

impl Decorator202203 {
    /// Moves `cur_inits` to `extra_stmts`.
    fn consume_inits(&mut self, for_static: bool) {
        let init_ident = if for_static {
            self.init_static.take()
        } else {
            self.init_proto.take()
        };

        let inits = if for_static {
            self.static_inits.take()
        } else {
            self.cur_inits.take()
        };

        if inits.is_empty()
            && init_ident.is_none()
            && (for_static || self.class_decorators.is_empty())
        {
            return;
        }

        let mut e_lhs = vec![];
        let mut combined_args = vec![ThisExpr { span: DUMMY_SP }.as_arg()];
        let mut arrays = vec![];

        for (id, args) in inits {
            e_lhs.push(Some(id.into()));

            arrays.extend(args);
        }

        if let Some(init_proto) = init_ident.clone() {
            self.extra_vars.push(VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Ident(init_proto.clone().into()),
                init: None,
                definite: false,
            });

            e_lhs.push(Some(init_proto.into()));
            if for_static {
                combined_args.push(
                    ArrayLit {
                        span: DUMMY_SP,
                        elems: self.init_static_args.take(),
                    }
                    .as_arg(),
                );
            } else {
                combined_args.push(
                    ArrayLit {
                        span: DUMMY_SP,
                        elems: self.init_proto_args.take(),
                    }
                    .as_arg(),
                );
            }
        }

        combined_args.push(
            ArrayLit {
                span: DUMMY_SP,
                elems: arrays,
            }
            .as_arg(),
        );
        if !for_static {
            combined_args.push(
                ArrayLit {
                    span: DUMMY_SP,
                    elems: self.class_decorators.take(),
                }
                .as_arg(),
            );
        }

        let e_pat = if e_lhs.is_empty() {
            None
        } else {
            Some(ObjectPatProp::KeyValue(KeyValuePatProp {
                key: PropName::Ident(quote_ident!("e")),
                value: Box::new(Pat::Array(ArrayPat {
                    span: DUMMY_SP,
                    elems: e_lhs,
                    type_ann: Default::default(),
                    optional: false,
                })),
            }))
        };

        let c_pat = if self.class_lhs.is_empty() {
            None
        } else {
            Some(ObjectPatProp::KeyValue(KeyValuePatProp {
                key: PropName::Ident(quote_ident!("c")),
                value: Box::new(Pat::Array(ArrayPat {
                    span: DUMMY_SP,
                    elems: self.class_lhs.take(),
                    type_ann: Default::default(),
                    optional: false,
                })),
            }))
        };

        let expr = Box::new(Expr::Assign(AssignExpr {
            span: DUMMY_SP,
            op: op!("="),
            left: PatOrExpr::Pat(Box::new(Pat::Object(ObjectPat {
                span: DUMMY_SP,
                props: e_pat.into_iter().chain(c_pat).collect(),
                optional: false,
                type_ann: None,
            }))),
            right: Box::new(Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: helper!(apply_decs_2203_r, "apply_decs_2203_r"),
                args: combined_args,
                type_args: Default::default(),
            })),
        }));

        self.extra_stmts.push(Stmt::Expr(ExprStmt {
            span: DUMMY_SP,
            expr,
        }));

        if for_static {
            if let Some(init) = init_ident {
                self.extra_stmts.push(Stmt::Expr(ExprStmt {
                    span: DUMMY_SP,
                    expr: Box::new(Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        callee: init.as_callee(),
                        args: vec![ThisExpr { span: DUMMY_SP }.as_arg()],
                        type_args: Default::default(),
                    })),
                }));
            }
        }
    }

    /// Returns (name, initilaizer_name)
    fn initializer_name(&mut self, name: &mut PropName, prefix: &str) -> (Box<Expr>, Ident) {
        match name {
            PropName::Ident(i) => (
                Box::new(Expr::Lit(Lit::Str(Str {
                    span: i.span.with_ctxt(SyntaxContext::empty()),
                    value: i.sym.clone(),
                    raw: None,
                }))),
                Ident::new(format!("_{prefix}_{}", i.sym).into(), i.span.private()),
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

                let init = Ident::new(
                    format!("_{prefix}_computedKey").into(),
                    ident.span.private(),
                );

                (Box::new(Expr::Ident(ident)), init)
            }
        }
    }

    fn ensure_constructor<'a>(&mut self, c: &'a mut Class) -> &'a mut Constructor {
        for member in c.body.iter_mut() {
            if let ClassMember::Constructor(constructor) = member {
                return unsafe {
                    // Safety: We need polonius
                    transmute::<&mut Constructor, &'a mut Constructor>(constructor)
                };
            }
        }

        c.body
            .insert(0, default_constructor(c.super_class.is_some()).into());

        for member in c.body.iter_mut() {
            if let ClassMember::Constructor(constructor) = member {
                return constructor;
            }
        }

        unreachable!()
    }

    fn handle_class_decorator(&mut self, class: &mut Class, ident: Option<&Ident>) -> Ident {
        debug_assert!(
            !class.decorators.is_empty(),
            "handle_class_decorator should be called only when decorators are present"
        );

        let init_class = private_ident!("_initClass");

        self.extra_vars.push(VarDeclarator {
            span: DUMMY_SP,
            name: Pat::Ident(init_class.clone().into()),
            init: None,
            definite: false,
        });

        let new_class_name = ident.map_or_else(
            || private_ident!("_class"),
            |i| private_ident!(format!("_{}", i.sym)),
        );

        self.class_lhs.push(Some(new_class_name.clone().into()));
        self.class_lhs.push(Some(init_class.clone().into()));

        self.extra_vars.push(VarDeclarator {
            span: DUMMY_SP,
            name: Pat::Ident(new_class_name.clone().into()),
            init: None,
            definite: false,
        });

        self.class_decorators
            .extend(class.decorators.drain(..).map(|e| Some(e.expr.as_arg())));

        {
            let call_stmt = CallExpr {
                span: DUMMY_SP,
                callee: init_class.as_callee(),
                args: vec![ThisExpr { span: DUMMY_SP }.as_arg()],
                type_args: Default::default(),
            }
            .into_stmt();

            class.body.push(ClassMember::StaticBlock(StaticBlock {
                span: DUMMY_SP,
                body: BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![call_stmt],
                },
            }));
        }

        new_class_name
    }
}

impl VisitMut for Decorator202203 {
    noop_visit_mut_type!();

    fn visit_mut_class(&mut self, n: &mut Class) {
        let old_stmts = self.extra_stmts.take();

        n.visit_mut_children_with(self);

        if let Some(init_proto) = self.init_proto.clone() {
            let c = self.ensure_constructor(n);

            inject_after_super(
                c,
                vec![Box::new(Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee: init_proto.as_callee(),
                    args: vec![ThisExpr { span: DUMMY_SP }.as_arg()],
                    type_args: Default::default(),
                }))],
            )
        }

        self.consume_inits(true);
        self.consume_inits(false);

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

        self.init_proto.take();

        self.extra_stmts = old_stmts;
    }

    fn visit_mut_class_member(&mut self, n: &mut ClassMember) {
        n.visit_mut_children_with(self);

        if let ClassMember::PrivateMethod(p) = n {
            if p.function.decorators.is_empty() {
                return;
            }

            let init = private_ident!(format!("_call_{}", p.key.id.sym));

            self.extra_vars.push(VarDeclarator {
                span: p.span,
                name: Pat::Ident(init.clone().into()),
                init: None,
                definite: false,
            });

            if p.is_static {
                self.init_static
                    .get_or_insert_with(|| private_ident!("_initStatic"));
            } else {
                self.init_proto
                    .get_or_insert_with(|| private_ident!("_initProto"));
            }

            for mut dec in p.function.decorators.take() {
                let caller = FnExpr {
                    ident: None,
                    function: p.function.clone(),
                };

                let arg = Some(
                    ArrayLit {
                        span: DUMMY_SP,
                        elems: vec![
                            Some(dec.expr.take().as_arg()),
                            Some(
                                if p.is_static {
                                    match p.kind {
                                        MethodKind::Method => 7,
                                        MethodKind::Setter => 9,
                                        MethodKind::Getter => 8,
                                    }
                                } else {
                                    match p.kind {
                                        MethodKind::Method => 2,
                                        MethodKind::Setter => 4,
                                        MethodKind::Getter => 3,
                                    }
                                }
                                .as_arg(),
                            ),
                            Some(p.key.id.sym.clone().as_arg()),
                            Some(caller.as_arg()),
                        ],
                    }
                    .as_arg(),
                );
                if p.is_static {
                    self.init_static_args.push(arg);
                } else {
                    self.init_proto_args.push(arg);
                }
            }

            if p.is_static {
                self.static_inits.push((init.clone(), vec![]));
            } else {
                self.cur_inits.push((init.clone(), vec![]));
            }

            match p.kind {
                MethodKind::Method => {
                    *n = ClassMember::PrivateProp(PrivateProp {
                        accessibility: Default::default(),
                        span: p.span,
                        key: p.key.clone(),
                        is_optional: Default::default(),
                        is_override: Default::default(),
                        is_static: p.is_static,
                        value: Some(init.into()),
                        type_ann: Default::default(),
                        decorators: Default::default(),
                        definite: Default::default(),
                        readonly: Default::default(),
                    });
                }
                MethodKind::Getter => {
                    let call_stmt = Stmt::Return(ReturnStmt {
                        span: DUMMY_SP,
                        arg: Some(Box::new(Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: init.as_callee(),
                            args: vec![ThisExpr { span: DUMMY_SP }.as_arg()],
                            type_args: Default::default(),
                        }))),
                    });

                    p.function.body = Some(BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![call_stmt],
                    });
                }
                MethodKind::Setter => {
                    let call_stmt = Stmt::Expr(ExprStmt {
                        span: DUMMY_SP,
                        expr: Box::new(Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: init.as_callee(),
                            args: vec![
                                ThisExpr { span: DUMMY_SP }.as_arg(),
                                p.function.params[0].pat.clone().expect_ident().id.as_arg(),
                            ],
                            type_args: Default::default(),
                        })),
                    });

                    p.function.body = Some(BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![call_stmt],
                    });
                }
            }
        }
    }

    fn visit_mut_class_method(&mut self, n: &mut ClassMethod) {
        n.visit_mut_children_with(self);

        if n.function.decorators.is_empty() {
            return;
        }

        let (name, init) = self.initializer_name(&mut n.key, "call");

        if n.is_static {
            self.init_static
                .get_or_insert_with(|| private_ident!("_initStatic"));
        } else {
            self.init_proto
                .get_or_insert_with(|| private_ident!("_initProto"));
        }

        for mut dec in n.function.decorators.drain(..) {
            let arg = Some(
                ArrayLit {
                    span: DUMMY_SP,
                    elems: vec![
                        Some(dec.expr.take().as_arg()),
                        Some(
                            match (n.is_static, n.kind) {
                                (true, MethodKind::Method) => 7,
                                (false, MethodKind::Method) => 2,
                                (true, MethodKind::Setter) => 9,
                                (false, MethodKind::Setter) => 4,
                                (true, MethodKind::Getter) => 8,
                                (false, MethodKind::Getter) => 3,
                            }
                            .as_arg(),
                        ),
                        Some(name.clone().as_arg()),
                    ],
                }
                .as_arg(),
            );
            if n.is_static {
                self.init_static_args.push(arg);
            } else {
                self.init_proto_args.push(arg);
            }
        }
    }

    fn visit_mut_class_prop(&mut self, p: &mut ClassProp) {
        p.visit_mut_children_with(self);

        if p.decorators.is_empty() {
            return;
        }

        let (name, init) = self.initializer_name(&mut p.key, "init");

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

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        if let Expr::Class(c) = e {
            if !c.class.decorators.is_empty() {
                let new = self.handle_class_decorator(&mut c.class, c.ident.as_ref());

                c.visit_mut_with(self);

                *e = Expr::Seq(SeqExpr {
                    span: DUMMY_SP,
                    exprs: vec![Box::new(e.take()), Box::new(Expr::Ident(new))],
                });

                return;
            }
        }

        e.visit_mut_children_with(self);
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
        let old_extra_stmts = self.extra_stmts.take();
        let old_extra_vars = self.extra_vars.take();

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

        self.extra_vars = old_extra_vars;
        self.extra_stmts = old_extra_stmts;
    }
}
