use indexmap::IndexMap;
use swc_atoms::{js_word, JsWord};
use swc_common::{util::take::Take, Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use crate::ExprFactory;

#[derive(Default)]
struct SuperField {
    computed: Option<Ident>,
    ident: IndexMap<JsWord, Ident>,
}

/// Don't use it aginst function, it will stop if come across any function
/// use it against function body

#[derive(Default)]
pub struct FnEnvHoister {
    this: Option<Ident>,
    args: Option<Ident>,
    new_target: Option<Ident>,
    super_get: SuperField,
    super_set: SuperField,

    // extra ident for super["xx"] += 123
    extra_ident: Vec<Ident>,
}

impl FnEnvHoister {
    pub fn to_decl(self) -> Vec<VarDeclarator> {
        let Self {
            this,
            args,
            new_target,
            super_get,
            super_set,
            ..
        } = self;

        let mut decls = Vec::with_capacity(3);
        if let Some(this_id) = this {
            decls.push(VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Ident(this_id.into()),
                init: Some(Box::new(Expr::This(ThisExpr { span: DUMMY_SP }))),
                definite: false,
            });
        }
        if let Some(id) = args {
            decls.push(VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Ident(id.into()),
                init: Some(Box::new(Expr::Ident(Ident::new(
                    js_word!("arguments"),
                    DUMMY_SP,
                )))),
                definite: false,
            });
        }
        if let Some(id) = new_target {
            decls.push(VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Ident(id.into()),
                init: Some(Box::new(Expr::MetaProp(MetaPropExpr {
                    span: DUMMY_SP,
                    kind: MetaPropKind::NewTarget,
                }))),
                definite: false,
            });
        }
        extend_super(&mut decls, super_get, super_set);
        decls
    }
    pub fn to_stmt(self) -> Option<Stmt> {
        let decls = self.to_decl();

        if decls.is_empty() {
            None
        } else {
            Some(Stmt::Decl(Decl::Var(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Var,
                declare: false,
                decls,
            })))
        }
    }

    pub fn to_stmt_in_subclass(self) -> (Option<Stmt>, Option<Ident>) {
        let Self {
            this,
            args,
            new_target,
            super_get,
            super_set,
            ..
        } = self;

        let mut decls = Vec::with_capacity(3);
        if let Some(this_id) = &this {
            decls.push(VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Ident(this_id.clone().into()),
                init: None,
                definite: false,
            });
        }
        if let Some(id) = args {
            decls.push(VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Ident(id.into()),
                init: Some(Box::new(Expr::Ident(Ident::new(
                    js_word!("arguments"),
                    DUMMY_SP,
                )))),
                definite: false,
            });
        }
        if let Some(id) = new_target {
            decls.push(VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Ident(id.into()),
                init: Some(Box::new(Expr::MetaProp(MetaPropExpr {
                    span: DUMMY_SP,
                    kind: MetaPropKind::NewTarget,
                }))),
                definite: false,
            });
        }

        extend_super(&mut decls, super_get, super_set);

        if decls.is_empty() {
            (None, None)
        } else {
            (
                Some(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls,
                }))),
                this,
            )
        }
    }

    fn get_this(&mut self) -> Ident {
        self.this
            .get_or_insert_with(|| private_ident!("_this"))
            .clone()
    }

    fn super_get(&mut self, id: &mut Ident, span: Span) -> Ident {
        if let Some(callee) = self.super_get.ident.get(&id.sym) {
            callee.clone()
        } else {
            let ident = private_ident!(span, format!("_superprop_get_{}", id.sym));
            self.super_get.ident.insert(id.take().sym, ident.clone());
            ident
        }
    }

    fn super_get_computed(&mut self, span: Span) -> Ident {
        self.super_get
            .computed
            .get_or_insert_with(|| private_ident!(span, "_superprop_get"))
            .clone()
    }
}

impl Take for FnEnvHoister {
    fn dummy() -> Self {
        Self::default()
    }
}

impl VisitMut for FnEnvHoister {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        match e {
            Expr::Ident(id) if id.sym == js_word!("arguments") => {
                let arguments = self
                    .args
                    .get_or_insert_with(|| private_ident!("_arguments"));
                *e = Expr::Ident(arguments.clone());
            }
            Expr::This(..) => {
                let this = self.get_this();
                *e = Expr::Ident(this);
            }
            Expr::MetaProp(MetaPropExpr {
                kind: MetaPropKind::NewTarget,
                ..
            }) => {
                let target = self
                    .new_target
                    .get_or_insert_with(|| private_ident!("_newtarget"));
                *e = Expr::Ident(target.clone());
            }
            // super.foo = 123 => super_get_foo = (value) => super.foo = value
            Expr::Assign(AssignExpr {
                left,
                right,
                span,
                op,
            }) => {
                let expr = match left {
                    PatOrExpr::Expr(e) => e,
                    PatOrExpr::Pat(p) => {
                        if let Pat::Expr(e) = &mut **p {
                            e
                        } else {
                            e.visit_mut_children_with(self);
                            return;
                        }
                    }
                };
                if let Expr::SuperProp(super_prop) = &mut **expr {
                    let left_span = super_prop.span;
                    match &mut super_prop.prop {
                        SuperProp::Computed(c) => {
                            let callee = self
                                .super_set
                                .computed
                                .get_or_insert_with(|| private_ident!(left_span, "_superprop_set"))
                                .clone();

                            let op = op.to_update();

                            let args = if let Some(op) = op {
                                let tmp = private_ident!("tmp");
                                self.extra_ident.push(tmp.clone());
                                vec![
                                    Expr::Assign(AssignExpr {
                                        span: DUMMY_SP,
                                        left: PatOrExpr::Pat(Box::new(Pat::Ident(
                                            tmp.clone().into(),
                                        ))),
                                        op: op!("="),
                                        right: c.expr.take(),
                                    })
                                    .as_arg(),
                                    Expr::Bin(BinExpr {
                                        span: DUMMY_SP,
                                        left: Box::new(Expr::Call(CallExpr {
                                            span: DUMMY_SP,
                                            callee: Callee::Expr(Box::new(
                                                self.super_get_computed(DUMMY_SP).into(),
                                            )),
                                            args: vec![tmp.as_arg()],
                                            type_args: None,
                                        })),
                                        op,
                                        right: right.take(),
                                    })
                                    .as_arg(),
                                ]
                            } else {
                                vec![c.expr.take().as_arg(), right.take().as_arg()]
                            };
                            *e = Expr::Call(CallExpr {
                                span: *span,
                                args,
                                callee: Expr::Ident(callee).as_callee(),
                                type_args: None,
                            });
                        }
                        SuperProp::Ident(id) => {
                            let callee = if let Some(callee) = self.super_set.ident.get(&id.sym) {
                                callee.clone()
                            } else {
                                let ident =
                                    private_ident!(id.span, format!("_superprop_set_{}", id.sym));
                                self.super_set.ident.insert(id.sym.clone(), ident.clone());
                                ident
                            };
                            *e = Expr::Call(CallExpr {
                                span: *span,
                                args: vec![(if let Some(op) = op.to_update() {
                                    Box::new(Expr::Bin(BinExpr {
                                        span: DUMMY_SP,
                                        left: Box::new(self.super_get(id, id.span).into()),
                                        op,
                                        right: right.take(),
                                    }))
                                } else {
                                    right.take()
                                })
                                .as_arg()],
                                callee: callee.as_callee(),
                                type_args: None,
                            });
                        }
                    }
                }
                e.visit_mut_children_with(self)
            }
            // super.foo() => super_get_foo = () => super.foo
            Expr::Call(CallExpr {
                span,
                callee: Callee::Expr(expr),
                args,
                ..
            }) => {
                if let Expr::SuperProp(super_prop) = &mut **expr {
                    match &mut super_prop.prop {
                        SuperProp::Computed(c) => {
                            let callee = self.super_get_computed(super_prop.span);
                            let call = Expr::Call(CallExpr {
                                span: *span,
                                args: vec![c.expr.take().as_arg()],
                                callee: Expr::Ident(callee).as_callee(),
                                type_args: None,
                            });
                            let mut new_args = args.take();

                            new_args.insert(0, self.get_this().as_arg());

                            *e = call.call_fn(new_args, *span);
                        }
                        SuperProp::Ident(id) => {
                            let callee = self.super_get(id, super_prop.span);
                            let call = Expr::Call(CallExpr {
                                span: *span,
                                args: Vec::new(),
                                callee: callee.as_callee(),
                                type_args: None,
                            });
                            let mut new_args = args.take();

                            new_args.insert(0, self.get_this().as_arg());

                            *e = call.call_fn(new_args, *span);
                        }
                    }
                };
                e.visit_mut_children_with(self)
            }
            Expr::SuperProp(SuperPropExpr { prop, span, .. }) => match prop {
                SuperProp::Computed(c) => {
                    c.expr.visit_mut_children_with(self);
                    *e = Expr::Call(CallExpr {
                        span: *span,
                        args: vec![c.expr.take().as_arg()],
                        callee: Expr::Ident(self.super_get_computed(*span)).as_callee(),
                        type_args: None,
                    })
                }
                SuperProp::Ident(id) => {
                    *e = Expr::Call(CallExpr {
                        span: *span,
                        args: Vec::new(),
                        callee: Expr::Ident(self.super_get(id, *span)).as_callee(),
                        type_args: None,
                    })
                }
            },
            _ => e.visit_mut_children_with(self),
        }
    }

    fn visit_mut_block_stmt(&mut self, b: &mut BlockStmt) {
        b.visit_mut_children_with(self);

        // we will not vist into fn/class so it's fine
        if !self.extra_ident.is_empty() {
            b.stmts.insert(
                0,
                Stmt::Decl(Decl::Var(VarDecl {
                    kind: VarDeclKind::Var,
                    span: DUMMY_SP,
                    decls: self
                        .extra_ident
                        .take()
                        .into_iter()
                        .map(|ident| VarDeclarator {
                            span: DUMMY_SP,
                            name: ident.into(),
                            init: None,
                            definite: false,
                        })
                        .collect(),
                    declare: false,
                })),
            )
        }
    }

    fn visit_mut_block_stmt_or_expr(&mut self, b: &mut BlockStmtOrExpr) {
        b.visit_mut_children_with(self);

        // we will not vist into fn/class so it's fine
        if !self.extra_ident.is_empty() {
            if let BlockStmtOrExpr::Expr(e) = b {
                *b = BlockStmtOrExpr::BlockStmt(BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![
                        Stmt::Decl(Decl::Var(VarDecl {
                            kind: VarDeclKind::Var,
                            span: DUMMY_SP,
                            decls: self
                                .extra_ident
                                .take()
                                .into_iter()
                                .map(|ident| VarDeclarator {
                                    span: DUMMY_SP,
                                    name: ident.into(),
                                    init: None,
                                    definite: false,
                                })
                                .collect(),
                            declare: false,
                        })),
                        Stmt::Return(ReturnStmt {
                            span: e.span(),
                            arg: Some(e.take()),
                        }),
                    ],
                })
            }
        }
    }

    /// Don't recurse into prop of member expression unless computed
    fn visit_mut_member_expr(&mut self, m: &mut MemberExpr) {
        if let MemberProp::Computed(computed) = &mut m.prop {
            computed.visit_mut_with(self);
        }

        m.obj.visit_mut_with(self);
    }

    /// Don't recurse into prop of super expression unless computed
    fn visit_mut_super_prop_expr(&mut self, m: &mut SuperPropExpr) {
        if let SuperProp::Computed(computed) = &mut m.prop {
            computed.visit_mut_with(self);
        }
    }

    /// Don't recurse into constructor
    fn visit_mut_class(&mut self, _: &mut Class) {}

    /// Don't recurse into fn
    fn visit_mut_function(&mut self, _: &mut Function) {}

    /// Don't recurse into getter/setter/method except computed key
    fn visit_mut_getter_prop(&mut self, p: &mut GetterProp) {
        if p.key.is_computed() {
            p.key.visit_mut_with(self);
        }
    }

    fn visit_mut_setter_prop(&mut self, p: &mut SetterProp) {
        if p.key.is_computed() {
            p.key.visit_mut_with(self);
        }
    }

    fn visit_mut_method_prop(&mut self, p: &mut MethodProp) {
        if p.key.is_computed() {
            p.key.visit_mut_with(self);
        }
    }
}

pub fn init_this(stmts: &mut Vec<Stmt>, this_id: &Ident) {
    stmts.visit_mut_children_with(&mut InitThis { this_id })
}

struct InitThis<'a> {
    this_id: &'a Ident,
}

// babel is skip function and class property
impl<'a> VisitMut for InitThis<'a> {
    noop_visit_mut_type!();

    fn visit_mut_class(&mut self, _: &mut Class) {}

    // babel will transform super() to super(); _this = this
    // hopefully it will be meaningless
    // fn visit_mut_stmts(&mut self, stmt: &mut Vec<Stmt>) {}

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        expr.visit_mut_children_with(self);

        if let Expr::Call(CallExpr {
            callee: Callee::Super(Super { span: super_span }),
            span,
            ..
        }) = expr
        {
            *expr = Expr::Paren(ParenExpr {
                span: *span,
                expr: Box::new(Expr::Seq(SeqExpr {
                    span: *span,
                    exprs: vec![
                        Box::new(Expr::Call(CallExpr {
                            span: *span,
                            callee: Callee::Super(Super { span: *super_span }),
                            args: Vec::new(),
                            type_args: None,
                        })),
                        Box::new(Expr::Assign(AssignExpr {
                            span: DUMMY_SP,
                            left: PatOrExpr::Pat(Box::new(self.this_id.clone().into())),
                            op: AssignOp::Assign,
                            right: Box::new(Expr::This(ThisExpr { span: DUMMY_SP })),
                        })),
                    ],
                })),
            })
        }
    }
}

fn extend_super(decls: &mut Vec<VarDeclarator>, get: SuperField, set: SuperField) {
    decls.extend(get.ident.into_iter().map(|(key, ident)| VarDeclarator {
        span: DUMMY_SP,
        name: Pat::Ident(ident.into()),
        init: Some(Box::new(Expr::Arrow(ArrowExpr {
            span: DUMMY_SP,
            params: Vec::new(),
            body: BlockStmtOrExpr::Expr(Box::new(Expr::SuperProp(SuperPropExpr {
                obj: Super { span: DUMMY_SP },
                prop: SuperProp::Ident(quote_ident!(key)),
                span: DUMMY_SP,
            }))),
            is_async: false,
            is_generator: false,
            return_type: None,
            type_params: None,
        }))),
        definite: false,
    }));
    if let Some(id) = get.computed {
        let param = private_ident!("_prop");
        decls.push(VarDeclarator {
            span: DUMMY_SP,
            name: Pat::Ident(id.into()),
            init: Some(Box::new(Expr::Arrow(ArrowExpr {
                span: DUMMY_SP,
                params: vec![param.clone().into()],
                body: BlockStmtOrExpr::Expr(Box::new(Expr::SuperProp(SuperPropExpr {
                    obj: Super { span: DUMMY_SP },
                    prop: SuperProp::Computed(ComputedPropName {
                        span: DUMMY_SP,
                        expr: Box::new(Expr::Ident(param)),
                    }),
                    span: DUMMY_SP,
                }))),
                is_async: false,
                is_generator: false,
                return_type: None,
                type_params: None,
            }))),
            definite: false,
        });
    }
    decls.extend(set.ident.into_iter().map(|(key, ident)| {
        let value = private_ident!("_value");
        VarDeclarator {
            span: DUMMY_SP,
            name: Pat::Ident(ident.into()),
            init: Some(Box::new(Expr::Arrow(ArrowExpr {
                span: DUMMY_SP,
                params: vec![value.clone().into()],
                body: BlockStmtOrExpr::Expr(Box::new(Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    left: PatOrExpr::Expr(Box::new(Expr::SuperProp(SuperPropExpr {
                        obj: Super { span: DUMMY_SP },
                        prop: SuperProp::Ident(quote_ident!(key)),
                        span: DUMMY_SP,
                    }))),
                    op: op!("="),
                    right: Box::new(Expr::Ident(value)),
                }))),
                is_async: false,
                is_generator: false,
                return_type: None,
                type_params: None,
            }))),
            definite: false,
        }
    }));
    if let Some(id) = set.computed {
        let prop = private_ident!("_prop");
        let value = private_ident!("_value");
        decls.push(VarDeclarator {
            span: DUMMY_SP,
            name: Pat::Ident(id.into()),
            init: Some(Box::new(Expr::Arrow(ArrowExpr {
                span: DUMMY_SP,
                params: vec![prop.clone().into(), value.clone().into()],
                body: BlockStmtOrExpr::Expr(Box::new(Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    left: PatOrExpr::Expr(Box::new(Expr::SuperProp(SuperPropExpr {
                        obj: Super { span: DUMMY_SP },
                        prop: SuperProp::Computed(ComputedPropName {
                            span: DUMMY_SP,
                            expr: Box::new(Expr::Ident(prop)),
                        }),
                        span: DUMMY_SP,
                    }))),
                    op: op!("="),
                    right: Box::new(Expr::Ident(value)),
                }))),
                is_async: false,
                is_generator: false,
                return_type: None,
                type_params: None,
            }))),
            definite: false,
        });
    }
}
