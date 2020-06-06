use super::usage::DecoratorFinder;
use crate::util::{
    alias_if_required, default_constructor, prepend, prop_name_to_expr_value, undefined,
    ExprFactory, ModuleItemLike, StmtLike,
};
use smallvec::SmallVec;
use std::mem::replace;
use swc_common::{util::move_map::MoveMap, Fold, FoldWith, VisitWith, DUMMY_SP};
use swc_ecma_ast::*;

#[derive(Debug, Default)]
pub(super) struct Legacy {
    uninitialized_vars: Vec<VarDeclarator>,
    initialized_vars: Vec<VarDeclarator>,
    exports: Vec<ExportSpecifier>,
}

noop_fold_type!(Legacy);

impl Fold<Module> for Legacy {
    fn fold(&mut self, m: Module) -> Module {
        let mut m = m.fold_children(self);

        if !self.uninitialized_vars.is_empty() {
            prepend(
                &mut m.body,
                Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    decls: replace(&mut self.uninitialized_vars, Default::default()),
                    declare: false,
                }))
                .into(),
            );
        }

        if !self.exports.is_empty() {
            let decl = ModuleDecl::ExportNamed(NamedExport {
                span: DUMMY_SP,
                specifiers: replace(&mut self.exports, Default::default()),
                src: None,
                type_only: false,
            });

            m.body.push(decl.into());
        }

        m
    }
}

impl Fold<Script> for Legacy {
    fn fold(&mut self, s: Script) -> Script {
        let mut s = s.fold_children(self);

        if !self.uninitialized_vars.is_empty() {
            prepend(
                &mut s.body,
                Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    decls: replace(&mut self.uninitialized_vars, Default::default()),
                    declare: false,
                })),
            );
        }

        s
    }
}

impl<T> Fold<Vec<T>> for Legacy
where
    T: FoldWith<Self> + VisitWith<DecoratorFinder> + StmtLike + ModuleItemLike,
    Vec<T>: VisitWith<DecoratorFinder>,
{
    fn fold(&mut self, stmts: Vec<T>) -> Vec<T> {
        if !super::usage::has_decorator(&stmts) {
            return stmts;
        }

        let mut buf = Vec::with_capacity(stmts.len() + 4);

        for stmt in stmts {
            if !super::usage::has_decorator(&stmt) {
                buf.push(stmt);
                continue;
            }

            let stmt = stmt.fold_with(self);

            if !self.initialized_vars.is_empty() {
                buf.push(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    decls: replace(&mut self.initialized_vars, Default::default()),
                    declare: false,
                }))));
            }

            buf.push(stmt);
        }

        buf
    }
}
impl Fold<ModuleItem> for Legacy {
    fn fold(&mut self, item: ModuleItem) -> ModuleItem {
        let item: ModuleItem = item.fold_children(self);

        match item {
            ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                decl: DefaultDecl::Class(c),
                ..
            })) => {
                let export_ident = c.ident.clone().unwrap_or_else(|| private_ident!("_class"));

                let expr = self.handle(c);

                self.exports
                    .push(ExportSpecifier::Named(ExportNamedSpecifier {
                        span: DUMMY_SP,
                        orig: export_ident.clone(),
                        exported: Some(quote_ident!("default")),
                    }));

                return ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Let,
                    declare: false,
                    decls: vec![VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(export_ident),
                        init: Some(expr),
                        definite: false,
                    }],
                })));
            }

            _ => {}
        }

        item
    }
}

impl Fold<Expr> for Legacy {
    fn fold(&mut self, e: Expr) -> Expr {
        let e: Expr = e.fold_children(self);

        match e {
            Expr::Class(e) => {
                let expr = self.handle(e);

                return *expr;
            }

            _ => {}
        }

        e
    }
}

impl Fold<Decl> for Legacy {
    fn fold(&mut self, decl: Decl) -> Decl {
        let decl: Decl = decl.fold_children(self);

        match decl {
            Decl::Class(c) => {
                let expr = self.handle(ClassExpr {
                    class: c.class,
                    ident: Some(c.ident.clone()),
                });

                return Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Let,
                    declare: false,
                    decls: vec![VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(c.ident),
                        init: Some(expr),
                        definite: false,
                    }],
                });
            }

            _ => {}
        }

        decl
    }
}

impl Legacy {
    fn handle(&mut self, mut c: ClassExpr) -> Box<Expr> {
        let cls_ident = private_ident!("_class");
        let cls_name = c.ident.clone();

        self.uninitialized_vars.push(VarDeclarator {
            span: DUMMY_SP,
            name: Pat::Ident(cls_ident.clone()),
            init: None,
            definite: false,
        });

        let mut extra_exprs = vec![];
        let mut constructor_stmts = SmallVec::<[_; 8]>::new();

        let prototype = MemberExpr {
            span: DUMMY_SP,
            obj: ExprOrSuper::Expr(box Expr::Ident(cls_ident.clone())),
            prop: box quote_ident!("prototype").into(),
            computed: false,
        };

        c.class.body = c.class.body.move_flat_map(|m| match m {
            ClassMember::Method(m) if !m.function.decorators.is_empty() => {
                let prototype = if m.is_static {
                    cls_ident.clone().as_arg()
                } else {
                    // _class2.prototype,
                    prototype.clone().as_arg()
                };

                // _applyDecoratedDescriptor(_class2.prototype, "method2", [_dec7, _dec8],
                // Object.getOwnPropertyDescriptor(_class2.prototype, "method2"),
                // _class2.prototype)

                let mut dec_exprs = vec![];
                let mut dec_inits = vec![];
                for dec in m.function.decorators.into_iter() {
                    let (i, aliased) = alias_if_required(&dec.expr, "_dec");
                    if aliased {
                        self.uninitialized_vars.push(VarDeclarator {
                            span: DUMMY_SP,
                            name: Pat::Ident(i.clone()),
                            init: None,
                            definite: false,
                        });

                        // We use _class.staticField instead of Person.staticField because while
                        // initializing the class,
                        //
                        //  _dec = Debounce(Person.debounceTime)
                        //
                        // fails while
                        //
                        //  _dec = Debounce(_class.debounceTime)
                        //
                        // works.
                        //
                        // See: https://github.com/swc-project/swc/issues/823
                        let right = if let Some(cls_name) = cls_name.clone() {
                            dec.expr.fold_with(&mut ClassFieldAccessConverter {
                                cls_name,
                                alias: cls_ident.clone(),
                            })
                        } else {
                            dec.expr
                        };

                        dec_inits.push(box Expr::Assign(AssignExpr {
                            span: dec.span,
                            op: op!("="),
                            left: PatOrExpr::Pat(box Pat::Ident(i.clone())),
                            right,
                        }));
                    }

                    dec_exprs.push(Some(i.as_arg()))
                }

                let callee = helper!(apply_decorated_descriptor, "applyDecoratedDescriptor");

                let name = match m.key {
                    PropName::Computed(..) => {
                        unimplemented!("decorators on methods with computed key")
                    }
                    _ => prop_name_to_expr_value(m.key.clone()),
                };

                extra_exprs.extend(dec_inits);

                extra_exprs.push(box Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee,
                    // (_class2.prototype, "method2", [_dec7, _dec8],
                    // Object.getOwnPropertyDescriptor(_class2.prototype, "method2"),
                    // _class2.prototype)
                    args: vec![
                        prototype.clone(),
                        // "method2"
                        name.clone().as_arg(),
                        // [_dec7, _dec8],
                        ArrayLit {
                            span: DUMMY_SP,
                            elems: dec_exprs,
                        }
                        .as_arg(),
                        // Object.getOwnPropertyDescriptor(_class2.prototype, "method2"),
                        CallExpr {
                            span: DUMMY_SP,
                            callee: member_expr!(DUMMY_SP, Object.getOwnPropertyDescriptor)
                                .as_callee(),
                            args: vec![prototype.clone(), name.as_arg()],
                            type_args: None,
                        }
                        .as_arg(),
                        // _class2.prototype
                        prototype.clone(),
                    ],
                    type_args: None,
                }));

                Some(ClassMember::Method(ClassMethod {
                    function: Function {
                        decorators: vec![],
                        ..m.function
                    },
                    ..m
                }))
            }

            ClassMember::ClassProp(p) if !p.decorators.is_empty() => {
                let prototype = if p.is_static {
                    cls_ident.clone().as_arg()
                } else {
                    // _class2.prototype,
                    prototype.clone().as_arg()
                };

                //
                let descriptor = private_ident!("_descriptor");
                if !p.is_static {
                    self.uninitialized_vars.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(descriptor.clone()),
                        init: None,
                        definite: false,
                    });
                }

                let mut value = Some(p.value);

                let mut dec_exprs = vec![];
                for dec in p.decorators.into_iter() {
                    let (i, aliased) = alias_if_required(&dec.expr, "_dec");
                    if aliased {
                        self.initialized_vars.push(VarDeclarator {
                            span: DUMMY_SP,
                            name: Pat::Ident(i.clone()),
                            init: Some(dec.expr),
                            definite: false,
                        });
                    }

                    dec_exprs.push(Some(i.as_arg()))
                }

                // TODO: Handle s prop name
                let name = match *p.key {
                    Expr::Ident(ref i) => box Expr::Lit(Lit::Str(Str {
                        span: i.span,
                        value: i.sym.clone(),
                        has_escape: false,
                    })),
                    _ => p.key.clone(),
                };
                let init = private_ident!("_init");
                if p.is_static {
                    self.uninitialized_vars.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(init.clone()),
                        init: None,
                        definite: false,
                    });
                }

                let mut property_descriptor = Expr::Object(ObjectLit {
                    span: DUMMY_SP,
                    props: vec![
                        // configurable: true,
                        PropOrSpread::Prop(box Prop::KeyValue(KeyValueProp {
                            key: quote_ident!("configurable").into(),
                            value: box Expr::Lit(Lit::Bool(Bool {
                                span: DUMMY_SP,
                                value: true,
                            })),
                        })), // enumerable: true,
                        PropOrSpread::Prop(box Prop::KeyValue(KeyValueProp {
                            key: quote_ident!("enumerable").into(),
                            value: box Expr::Lit(Lit::Bool(Bool {
                                span: DUMMY_SP,
                                value: true,
                            })),
                        })),
                        // writable: true,
                        PropOrSpread::Prop(box Prop::KeyValue(KeyValueProp {
                            key: quote_ident!("writable").into(),
                            value: box Expr::Lit(Lit::Bool(Bool {
                                span: DUMMY_SP,
                                value: true,
                            })),
                        })),
                        // initializer: function () {
                        //     return 2;
                        // }
                        PropOrSpread::Prop(box Prop::KeyValue(KeyValueProp {
                            key: quote_ident!("initializer").into(),
                            value: box Expr::Fn(FnExpr {
                                ident: None,
                                function: Function {
                                    decorators: Default::default(),
                                    is_generator: false,
                                    is_async: false,
                                    span: DUMMY_SP,
                                    params: vec![],

                                    body: Some(BlockStmt {
                                        span: DUMMY_SP,
                                        stmts: vec![ReturnStmt {
                                            span: DUMMY_SP,
                                            arg: if p.is_static {
                                                Some(box Expr::Ident(init.clone()))
                                            } else {
                                                value.take().unwrap()
                                            },
                                        }
                                        .into()],
                                    }),

                                    type_params: Default::default(),
                                    return_type: Default::default(),
                                },
                            }),
                        })),
                    ],
                });

                if p.is_static {
                    property_descriptor = Expr::Seq(SeqExpr {
                        span: DUMMY_SP,
                        exprs: vec![
                            box Expr::Assign(AssignExpr {
                                span: DUMMY_SP,
                                left: PatOrExpr::Pat(box Pat::Ident(init.clone())),
                                op: op!("="),
                                // Object.getOwnPropertyDescriptor(_class, "enumconfwrite")
                                right: box Expr::Call(CallExpr {
                                    span: DUMMY_SP,
                                    callee: member_expr!(DUMMY_SP, Object.getOwnPropertyDescriptor)
                                        .as_callee(),
                                    args: vec![cls_ident.clone().as_arg(), name.clone().as_arg()],
                                    type_args: Default::default(),
                                }),
                            }),
                            // _init = _init ? _init.value : void 0
                            box Expr::Assign(AssignExpr {
                                span: DUMMY_SP,
                                left: PatOrExpr::Pat(box Pat::Ident(init.clone())),
                                op: op!("="),
                                right: box Expr::Cond(CondExpr {
                                    span: DUMMY_SP,
                                    test: box Expr::Ident(init.clone()),
                                    cons: box init.clone().member(quote_ident!("value")),
                                    alt: undefined(DUMMY_SP),
                                }),
                            }),
                            box property_descriptor,
                        ],
                    });
                }

                // _applyDecoratedDescriptor(_class2.prototype, "prop2", [_dec9, _dec10], {
                //     configurable: true,
                //     enumerable: true,
                //     writable: true,
                //     initializer: function () {
                //         return 2;
                //     }
                // }))
                let call_expr = box Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee: helper!(apply_decorated_descriptor, "applyDecoratedDescriptor"),
                    args: {
                        if p.is_static {
                            vec![
                                prototype,
                                name.clone().as_arg(),
                                ArrayLit {
                                    span: DUMMY_SP,
                                    elems: dec_exprs,
                                }
                                .as_arg(),
                                property_descriptor.as_arg(),
                                cls_ident.clone().as_arg(),
                            ]
                        } else {
                            vec![
                                prototype,
                                name.clone().as_arg(),
                                ArrayLit {
                                    span: DUMMY_SP,
                                    elems: dec_exprs,
                                }
                                .as_arg(),
                                property_descriptor.as_arg(),
                            ]
                        }
                    },
                    type_args: Default::default(),
                });

                if !p.is_static {
                    extra_exprs.push(box Expr::Assign(AssignExpr {
                        span: DUMMY_SP,
                        op: op!("="),
                        left: PatOrExpr::Pat(box Pat::Ident(descriptor.clone())),
                        right: call_expr,
                    }));
                } else {
                    extra_exprs.push(call_expr);
                }

                if !p.is_static {
                    constructor_stmts.push(
                        CallExpr {
                            span: DUMMY_SP,
                            callee: helper!(
                                initializer_define_property,
                                "initializerDefineProperty"
                            ),
                            args: vec![
                                ThisExpr { span: DUMMY_SP }.as_arg(),
                                name.as_arg(),
                                descriptor.as_arg(),
                                ThisExpr { span: DUMMY_SP }.as_arg(),
                            ],
                            type_args: None,
                        }
                        .into_stmt(),
                    );
                }

                if p.is_static {
                    Some(
                        ClassProp {
                            decorators: vec![],
                            value: value.take().unwrap(),
                            ..p
                        }
                        .into(),
                    )
                } else {
                    None
                }
            }

            _ => Some(m),
        });

        if !constructor_stmts.is_empty() {
            {
                // Create constructors as required

                let has = c.class.body.iter().any(|m| match m {
                    ClassMember::Constructor(..) => true,
                    _ => false,
                });

                if !has {
                    c.class
                        .body
                        .push(ClassMember::Constructor(default_constructor(
                            c.class.super_class.is_some(),
                        )))
                }
            }

            let constructor = c
                .class
                .body
                .iter_mut()
                .filter_map(|m| match m {
                    ClassMember::Constructor(c) => Some(c),
                    _ => None,
                })
                .next()
                .unwrap();

            if constructor.body.is_none() {
                constructor.body = Some(BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![],
                });
            }

            constructor
                .body
                .as_mut()
                .unwrap()
                .stmts
                .extend(constructor_stmts)
        }

        let cls_assign = box Expr::Assign(AssignExpr {
            span: DUMMY_SP,
            op: op!("="),
            left: PatOrExpr::Pat(box Pat::Ident(cls_ident.clone())),
            right: box Expr::Class(ClassExpr {
                ident: c.ident.clone(),
                class: Class {
                    decorators: vec![],
                    ..c.class
                },
            }),
        });

        let var_init = box Expr::Bin(BinExpr {
            span: DUMMY_SP,
            left: cls_assign,
            op: op!("||"),
            right: box Expr::Ident(cls_ident.clone()),
        });

        let expr = self.apply(
            if extra_exprs.is_empty() {
                var_init
            } else {
                extra_exprs.insert(0, var_init);
                // Return value.
                extra_exprs.push(box Expr::Ident(cls_ident));

                box Expr::Seq(SeqExpr {
                    span: DUMMY_SP,
                    exprs: extra_exprs,
                })
            },
            c.class.decorators,
        );

        expr
    }

    fn apply(&mut self, mut expr: Box<Expr>, decorators: Vec<Decorator>) -> Box<Expr> {
        for dec in decorators.into_iter().rev() {
            let (i, aliased) = alias_if_required(&dec.expr, "_dec");
            if aliased {
                self.initialized_vars.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Ident(i.clone()),
                    init: Some(dec.expr),
                    definite: false,
                });
            }

            expr = box Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: i.as_callee(),
                args: vec![expr.as_arg()],
                type_args: None,
            });
        }

        expr
    }
}

struct ClassFieldAccessConverter {
    cls_name: Ident,
    /// `_class`
    alias: Ident,
}

noop_fold_type!(ClassFieldAccessConverter);

impl Fold<MemberExpr> for ClassFieldAccessConverter {
    fn fold(&mut self, node: MemberExpr) -> MemberExpr {
        if node.computed {
            MemberExpr {
                obj: node.obj.fold_with(self),
                prop: node.prop.fold_with(self),
                ..node
            }
        } else {
            MemberExpr {
                obj: node.obj.fold_with(self),
                ..node
            }
        }
    }
}

impl Fold<Ident> for ClassFieldAccessConverter {
    fn fold(&mut self, node: Ident) -> Ident {
        if node.sym == self.cls_name.sym && node.span.ctxt() == self.cls_name.span.ctxt() {
            return self.alias.clone();
        }

        node
    }
}
