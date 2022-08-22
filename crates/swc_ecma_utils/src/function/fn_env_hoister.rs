use std::mem;

use indexmap::IndexMap;
use swc_atoms::{js_word, JsWord};
use swc_common::{util::take::Take, Span, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use crate::ExprFactory;

#[derive(Default)]
struct SuperField {
    computed: Option<Ident>,
    ident: IndexMap<JsWord, Ident>,
}

/// Don't use it against function, it will stop if come across any function
/// use it against function body

#[derive(Default)]
pub struct FnEnvHoister {
    unresolved_ctxt: SyntaxContext,
    this: Option<Ident>,
    args: Option<Ident>,
    new_target: Option<Ident>,
    super_get: SuperField,
    super_set: SuperField,
    super_update: SuperField,

    in_pat: bool,

    // extra ident for super["xx"] += 123
    extra_ident: Vec<Ident>,
}

impl FnEnvHoister {
    pub fn new(unresolved_ctxt: SyntaxContext) -> Self {
        Self {
            unresolved_ctxt,
            ..Default::default()
        }
    }

    pub fn take(&mut self) -> Self {
        let mut new = Self {
            unresolved_ctxt: self.unresolved_ctxt,
            ..Default::default()
        };

        mem::swap(self, &mut new);

        new
    }

    pub fn to_decl(self) -> Vec<VarDeclarator> {
        let Self {
            this,
            args,
            new_target,
            super_get,
            super_set,
            super_update,
            ..
        } = self;

        let mut decls = Vec::with_capacity(3);
        if let Some(this_id) = this {
            decls.push(VarDeclarator {
                span: DUMMY_SP,
                name: this_id.into(),
                init: Some(Box::new(Expr::This(ThisExpr { span: DUMMY_SP }))),
                definite: false,
            });
        }
        if let Some(id) = args {
            decls.push(VarDeclarator {
                span: DUMMY_SP,
                name: id.into(),
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
                name: id.into(),
                init: Some(Box::new(Expr::MetaProp(MetaPropExpr {
                    span: DUMMY_SP,
                    kind: MetaPropKind::NewTarget,
                }))),
                definite: false,
            });
        }
        extend_super(&mut decls, super_get, super_set, super_update);
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
            super_update,
            ..
        } = self;

        let mut decls = Vec::with_capacity(3);
        if let Some(this_id) = &this {
            decls.push(VarDeclarator {
                span: DUMMY_SP,
                name: this_id.clone().into(),
                init: None,
                definite: false,
            });
        }
        if let Some(id) = args {
            decls.push(VarDeclarator {
                span: DUMMY_SP,
                name: id.into(),
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
                name: id.into(),
                init: Some(Box::new(Expr::MetaProp(MetaPropExpr {
                    span: DUMMY_SP,
                    kind: MetaPropKind::NewTarget,
                }))),
                definite: false,
            });
        }

        extend_super(&mut decls, super_get, super_set, super_update);

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

    fn super_get(&mut self, prop_name: &JsWord, prop_span: Span) -> Ident {
        if let Some(callee) = self.super_get.ident.get(prop_name) {
            callee.clone()
        } else {
            let ident = private_ident!(prop_span, format!("_superprop_get_{}", prop_name));
            self.super_get
                .ident
                .insert(prop_name.clone(), ident.clone());
            ident
        }
    }

    fn super_get_computed(&mut self, span: Span) -> Ident {
        self.super_get
            .computed
            .get_or_insert_with(|| private_ident!(span, "_superprop_get"))
            .clone()
    }

    fn super_set(&mut self, prop_name: &JsWord, prop_span: Span) -> Ident {
        if let Some(callee) = self.super_set.ident.get(prop_name) {
            callee.clone()
        } else {
            let ident = private_ident!(prop_span, format!("_superprop_set_{}", prop_name));
            self.super_set
                .ident
                .insert(prop_name.clone(), ident.clone());
            ident
        }
    }

    fn super_set_computed(&mut self, span: Span) -> Ident {
        self.super_set
            .computed
            .get_or_insert_with(|| private_ident!(span, "_superprop_set"))
            .clone()
    }

    fn super_update(&mut self, prop_name: &JsWord, prop_span: Span) -> Ident {
        if let Some(callee) = self.super_update.ident.get(prop_name) {
            callee.clone()
        } else {
            self.super_get
                .ident
                .entry(prop_name.clone())
                .or_insert_with(|| {
                    private_ident!(prop_span, format!("_superprop_get_{}", prop_name))
                });

            self.super_set
                .ident
                .entry(prop_name.clone())
                .or_insert_with(|| {
                    private_ident!(prop_span, format!("_superprop_set_{}", prop_name))
                });

            let ident = private_ident!(prop_span, format!("_superprop_update_{}", prop_name));
            self.super_update
                .ident
                .insert(prop_name.clone(), ident.clone());
            ident
        }
    }

    fn super_update_computed(&mut self, span: Span) -> Ident {
        self.super_get
            .computed
            .get_or_insert_with(|| private_ident!(span, "_superprop_get"));
        self.super_set
            .computed
            .get_or_insert_with(|| private_ident!(span, "_superprop_set"));
        self.super_update
            .computed
            .get_or_insert_with(|| private_ident!(span, "_superprop_update"))
            .clone()
    }
}

impl VisitMut for FnEnvHoister {
    noop_visit_mut_type!();

    fn visit_mut_pat(&mut self, n: &mut Pat) {
        let in_pat = self.in_pat;
        self.in_pat = true;
        n.visit_mut_children_with(self);
        self.in_pat = in_pat;
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        match e {
            Expr::Ident(Ident { span, sym, .. })
                if *sym == js_word!("arguments") && span.ctxt == self.unresolved_ctxt =>
            {
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
                            let callee = self.super_set_computed(left_span);

                            let op = op.to_update();

                            let args = if let Some(op) = op {
                                let tmp = private_ident!("tmp");
                                self.extra_ident.push(tmp.clone());
                                vec![
                                    Expr::Assign(AssignExpr {
                                        span: DUMMY_SP,
                                        left: PatOrExpr::Pat(tmp.clone().into()),
                                        op: op!("="),
                                        right: c.expr.take(),
                                    })
                                    .as_arg(),
                                    Expr::Bin(BinExpr {
                                        span: DUMMY_SP,
                                        left: Box::new(Expr::Call(CallExpr {
                                            span: DUMMY_SP,
                                            callee: self.super_get_computed(DUMMY_SP).as_callee(),
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
                                callee: callee.as_callee(),
                                type_args: None,
                            });
                        }
                        SuperProp::Ident(id) => {
                            let callee = self.super_set(&id.sym, left_span);
                            *e = Expr::Call(CallExpr {
                                span: *span,
                                args: vec![(if let Some(op) = op.to_update() {
                                    Box::new(Expr::Bin(BinExpr {
                                        span: DUMMY_SP,
                                        left: Box::new(
                                            self.super_get(&id.sym, id.span)
                                                .as_call(id.span, Vec::new()),
                                        ),
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
                                callee: callee.as_callee(),
                                type_args: None,
                            });
                            let mut new_args = args.take();

                            new_args.insert(0, self.get_this().as_arg());

                            *e = call.call_fn(*span, new_args);
                        }
                        SuperProp::Ident(id) => {
                            let callee = self.super_get(&id.sym, super_prop.span);
                            let call = Expr::Call(CallExpr {
                                span: *span,
                                args: Vec::new(),
                                callee: callee.as_callee(),
                                type_args: None,
                            });
                            let mut new_args = args.take();

                            new_args.insert(0, self.get_this().as_arg());

                            *e = call.call_fn(*span, new_args);
                        }
                    }
                };
                e.visit_mut_children_with(self)
            }
            // super.foo ++
            Expr::Update(UpdateExpr { arg, .. }) if arg.is_super_prop() => {
                let in_pat = self.in_pat;
                // NOTE: It's not in pat, but we need the `update` trick
                self.in_pat = true;
                arg.visit_mut_with(self);
                self.in_pat = in_pat;
            }
            Expr::SuperProp(SuperPropExpr { prop, span, .. }) => match prop {
                SuperProp::Computed(c) => {
                    c.expr.visit_mut_children_with(self);
                    *e = if self.in_pat {
                        Expr::Call(CallExpr {
                            span: *span,
                            args: vec![c.expr.take().as_arg()],
                            callee: self.super_update_computed(*span).as_callee(),
                            type_args: None,
                        })
                        .make_member(quote_ident!("_"))
                    } else {
                        Expr::Call(CallExpr {
                            span: *span,
                            args: vec![c.expr.take().as_arg()],
                            callee: self.super_get_computed(*span).as_callee(),
                            type_args: None,
                        })
                    };
                }
                SuperProp::Ident(id) => {
                    *e = if self.in_pat {
                        self.super_update(&id.sym, *span)
                            .make_member(quote_ident!("_"))
                    } else {
                        Expr::Call(CallExpr {
                            span: *span,
                            args: Vec::new(),
                            callee: self.super_get(&id.sym, *span).as_callee(),
                            type_args: None,
                        })
                    };
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

        if let Expr::Call(
            call_expr @ CallExpr {
                callee: Callee::Super(..),
                ..
            },
        ) = expr
        {
            let span = call_expr.span;
            *expr = Expr::Paren(ParenExpr {
                span,
                expr: Box::new(Expr::Seq(SeqExpr {
                    span,
                    exprs: vec![
                        Box::new(Expr::Call(call_expr.take())),
                        Box::new(Expr::Assign(AssignExpr {
                            span: DUMMY_SP,
                            left: PatOrExpr::Pat(self.this_id.clone().into()),
                            op: AssignOp::Assign,
                            right: Box::new(Expr::This(ThisExpr { span: DUMMY_SP })),
                        })),
                    ],
                })),
            })
        }
    }
}

fn extend_super(
    decls: &mut Vec<VarDeclarator>,
    get: SuperField,
    set: SuperField,
    update: SuperField,
) {
    decls.extend(update.ident.into_iter().map(|(key, ident)| {
        let value = private_ident!("v");
        VarDeclarator {
            span: DUMMY_SP,
            name: ident.into(),
            init: Some(Box::new(Expr::Object(ObjectLit {
                span: DUMMY_SP,
                props: vec![
                    Prop::Getter(GetterProp {
                        span: DUMMY_SP,
                        key: PropName::Ident(quote_ident!("_")),
                        type_ann: None,
                        body: Some(BlockStmt {
                            span: DUMMY_SP,
                            stmts: vec![Expr::Ident(
                                get.ident
                                    .get(&key)
                                    .cloned()
                                    .expect("getter not found")
                                    .without_loc(),
                            )
                            .as_call(DUMMY_SP, Default::default())
                            .into_return_stmt()
                            .into()],
                        }),
                    }),
                    Prop::Setter(SetterProp {
                        span: DUMMY_SP,
                        key: PropName::Ident(quote_ident!("_")),
                        param: value.clone().into(),
                        body: Some(BlockStmt {
                            span: DUMMY_SP,
                            stmts: vec![Expr::Ident(
                                set.ident
                                    .get(&key)
                                    .cloned()
                                    .expect("setter not found")
                                    .without_loc(),
                            )
                            .as_call(DUMMY_SP, vec![value.as_arg()])
                            .into_stmt()],
                        }),
                    }),
                ]
                .into_iter()
                .map(Box::new)
                .map(Into::into)
                .collect(),
            }))),
            definite: false,
        }
    }));
    if let Some(id) = update.computed {
        let prop = private_ident!("_prop");
        let value = private_ident!("v");

        decls.push(VarDeclarator {
            span: DUMMY_SP,
            name: id.into(),
            init: Some(Box::new(Expr::Arrow(ArrowExpr {
                span: DUMMY_SP,
                params: vec![prop.clone().into()],
                body: BlockStmtOrExpr::Expr(Box::new(Expr::Object(ObjectLit {
                    span: DUMMY_SP,
                    props: vec![
                        Prop::Getter(GetterProp {
                            span: DUMMY_SP,
                            key: PropName::Ident(quote_ident!("_")),
                            type_ann: None,
                            body: Some(BlockStmt {
                                span: DUMMY_SP,
                                stmts: vec![Expr::Ident(
                                    get.computed
                                        .clone()
                                        .expect("getter computed not found")
                                        .without_loc(),
                                )
                                .as_call(DUMMY_SP, vec![prop.clone().as_arg()])
                                .into_return_stmt()
                                .into()],
                            }),
                        }),
                        Prop::Setter(SetterProp {
                            span: DUMMY_SP,
                            key: PropName::Ident(quote_ident!("_")),
                            param: value.clone().into(),
                            body: Some(BlockStmt {
                                span: DUMMY_SP,
                                stmts: vec![Expr::Ident(
                                    set.computed
                                        .clone()
                                        .expect("setter computed not found")
                                        .without_loc(),
                                )
                                .as_call(DUMMY_SP, vec![prop.as_arg(), value.as_arg()])
                                .into_return_stmt()
                                .into()],
                            }),
                        }),
                    ]
                    .into_iter()
                    .map(Box::new)
                    .map(Into::into)
                    .collect(),
                }))),
                is_async: false,
                is_generator: false,
                return_type: None,
                type_params: None,
            }))),
            definite: false,
        });
    }
    decls.extend(get.ident.into_iter().map(|(key, ident)| VarDeclarator {
        span: DUMMY_SP,
        name: ident.without_loc().into(),
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
            name: id.without_loc().into(),
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
            name: ident.without_loc().into(),
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
            name: id.without_loc().into(),
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
