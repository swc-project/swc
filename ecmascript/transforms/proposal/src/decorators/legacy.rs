use self::metadata::{Metadata, ParamMetadata};
use super::usage::DecoratorFinder;
use fxhash::FxHashMap;
use smallvec::SmallVec;
use std::mem::replace;
use swc_common::{util::move_map::MoveMap, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::member_expr;
use swc_ecma_utils::private_ident;
use swc_ecma_utils::quote_ident;
use swc_ecma_utils::{
    alias_if_required, default_constructor, prepend, prop_name_to_expr_value, undefined,
    ExprFactory, ModuleItemLike, StmtLike,
};
use swc_ecma_utils::{ident::IdentLike, Id};
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith, Node, Visit, VisitWith};

mod metadata;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum EnumKind {
    Mixed,
    Str,
    Num,
}

#[derive(Debug)]
pub(super) struct Legacy {
    metadata: bool,
    uninitialized_vars: Vec<VarDeclarator>,
    initialized_vars: Vec<VarDeclarator>,
    exports: Vec<ExportSpecifier>,
    enums: FxHashMap<Id, EnumKind>,
}

pub(super) fn new(metadata: bool) -> Legacy {
    Legacy {
        metadata,
        uninitialized_vars: Default::default(),
        initialized_vars: Default::default(),
        exports: Default::default(),
        enums: Default::default(),
    }
}

impl Visit for Legacy {
    fn visit_ts_enum_decl(&mut self, e: &TsEnumDecl, _: &dyn Node) {
        let enum_kind = e
            .members
            .iter()
            .map(|member| member.init.as_ref())
            .map(|init| match init {
                Some(e) => match &**e {
                    Expr::Lit(lit) => match lit {
                        Lit::Str(_) => EnumKind::Str,
                        Lit::Num(_) => EnumKind::Num,
                        _ => EnumKind::Mixed,
                    },
                    _ => EnumKind::Mixed,
                },
                None => EnumKind::Num,
            })
            .fold(None, |opt: Option<EnumKind>, item| {
                //
                let a = match item {
                    EnumKind::Mixed => return Some(EnumKind::Mixed),
                    _ => item,
                };

                let b = match opt {
                    Some(EnumKind::Mixed) => return Some(EnumKind::Mixed),
                    Some(v) => v,
                    None => return Some(item),
                };
                if a == b {
                    return Some(a);
                } else {
                    return Some(EnumKind::Mixed);
                }
            });
        if let Some(kind) = enum_kind {
            self.enums.insert(e.id.to_id(), kind);
        }
    }
}

impl Fold for Legacy {
    noop_fold_type!();

    fn fold_decl(&mut self, decl: Decl) -> Decl {
        let decl: Decl = decl.fold_children_with(self);

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
                        name: Pat::Ident(c.ident.into()),
                        init: Some(expr),
                        definite: false,
                    }],
                });
            }

            _ => {}
        }

        decl
    }

    fn fold_expr(&mut self, e: Expr) -> Expr {
        let e: Expr = e.fold_children_with(self);

        match e {
            Expr::Class(e) => {
                let expr = self.handle(e);

                return *expr;
            }

            _ => {}
        }

        e
    }

    fn fold_module(&mut self, m: Module) -> Module {
        // Collect required information.
        // For example, value type of enum affects codegen
        m.visit_with(&Invalid { span: DUMMY_SP }, self);

        let mut m = m.fold_children_with(self);

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
                asserts: None,
            });

            m.body.push(decl.into());
        }

        m
    }

    fn fold_module_item(&mut self, item: ModuleItem) -> ModuleItem {
        let item: ModuleItem = item.fold_children_with(self);

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
                        name: Pat::Ident(export_ident.into()),
                        init: Some(expr),
                        definite: false,
                    }],
                })));
            }

            _ => {}
        }

        item
    }

    fn fold_script(&mut self, s: Script) -> Script {
        let mut s = s.fold_children_with(self);

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

    fn fold_module_items(&mut self, n: Vec<ModuleItem>) -> Vec<ModuleItem> {
        self.fold_stmt_like(n)
    }

    fn fold_stmts(&mut self, n: Vec<Stmt>) -> Vec<Stmt> {
        self.fold_stmt_like(n)
    }
}

impl Legacy {
    fn fold_stmt_like<T>(&mut self, stmts: Vec<T>) -> Vec<T>
    where
        T: FoldWith<Self> + VisitWith<DecoratorFinder> + StmtLike + ModuleItemLike,
        Vec<T>: VisitWith<DecoratorFinder>,
    {
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

impl Legacy {
    fn handle(&mut self, mut c: ClassExpr) -> Box<Expr> {
        if self.metadata {
            let i = c.ident.clone();

            c = c.fold_with(&mut ParamMetadata).fold_with(&mut Metadata {
                enums: &self.enums,
                class_name: i.as_ref(),
            });
        }

        let cls_ident = private_ident!("_class");
        let cls_name = c.ident.clone();

        self.uninitialized_vars.push(VarDeclarator {
            span: DUMMY_SP,
            name: Pat::Ident(cls_ident.clone().into()),
            init: None,
            definite: false,
        });

        // Injected to sequence expression which is wrapped with parenthesis.
        let mut extra_exprs = vec![];
        // Injected to constructor
        let mut constructor_stmts = SmallVec::<[_; 8]>::new();

        let prototype = MemberExpr {
            span: DUMMY_SP,
            obj: ExprOrSuper::Expr(Box::new(Expr::Ident(cls_ident.clone()))),
            prop: Box::new(quote_ident!("prototype").into()),
            computed: false,
        };

        c.class.body = c.class.body.move_flat_map(|m| match m {
            ClassMember::Method(mut m)
                if !m.function.decorators.is_empty()
                    || m.function.params.iter().any(|p| !p.decorators.is_empty()) =>
            {
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
                            name: Pat::Ident(i.clone().into()),
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

                        dec_inits.push(Box::new(Expr::Assign(AssignExpr {
                            span: dec.span,
                            op: op!("="),
                            left: PatOrExpr::Pat(Box::new(Pat::Ident(i.clone().into()))),
                            right,
                        })));
                    }

                    dec_exprs.push(Some(i.as_arg()))
                }

                let name = match &m.key {
                    PropName::Computed(e) => {
                        let (name, aliased) = alias_if_required(&e.expr, "key");
                        if aliased {
                            self.initialized_vars.push(VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(name.clone().into()),
                                init: Some(e.expr.clone()),
                                definite: Default::default(),
                            })
                        }

                        Expr::Ident(name)
                    }
                    _ => prop_name_to_expr_value(m.key.clone()),
                };

                {
                    // https://github.com/swc-project/swc/issues/863
                    let mut new_params = Vec::with_capacity(m.function.params.len());
                    for (index, param) in m.function.params.into_iter().enumerate() {
                        for dec in param.decorators {
                            //
                            extra_exprs.push(Box::new(Expr::Call(CallExpr {
                                span: dec.span,
                                callee: dec.expr.as_callee(),
                                args: vec![
                                    prototype.clone(),
                                    name.clone().as_arg(),
                                    Lit::Num(Number {
                                        span: param.span,
                                        value: index as _,
                                    })
                                    .as_arg(),
                                ],
                                type_args: None,
                            })))
                        }

                        new_params.push(Param {
                            decorators: Default::default(),
                            ..param
                        });
                    }
                    m.function.params = new_params;
                }

                let callee = helper!(apply_decorated_descriptor, "applyDecoratedDescriptor");

                extra_exprs.extend(dec_inits);

                extra_exprs.push(Box::new(Expr::Call(CallExpr {
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
                })));

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
                        name: Pat::Ident(descriptor.clone().into()),
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
                            name: Pat::Ident(i.clone().into()),
                            init: Some(dec.expr),
                            definite: false,
                        });
                    }

                    dec_exprs.push(Some(i.as_arg()))
                }

                // TODO: Handle s prop name
                let name = match *p.key {
                    Expr::Ident(ref i) => Box::new(Expr::Lit(Lit::Str(Str {
                        span: i.span,
                        value: i.sym.clone(),
                        has_escape: false,
                        kind: StrKind::Normal {
                            contains_quote: false,
                        },
                    }))),
                    _ => p.key.clone(),
                };
                let init = private_ident!("_init");
                if p.is_static {
                    self.uninitialized_vars.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(init.clone().into()),
                        init: None,
                        definite: false,
                    });
                }

                let mut property_descriptor = Expr::Object(ObjectLit {
                    span: DUMMY_SP,
                    props: vec![
                        // configurable: true,
                        PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                            key: quote_ident!("configurable").into(),
                            value: Box::new(Expr::Lit(Lit::Bool(Bool {
                                span: DUMMY_SP,
                                value: true,
                            }))),
                        }))), // enumerable: true,
                        PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                            key: quote_ident!("enumerable").into(),
                            value: Box::new(Expr::Lit(Lit::Bool(Bool {
                                span: DUMMY_SP,
                                value: true,
                            }))),
                        }))),
                        // writable: true,
                        PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                            key: quote_ident!("writable").into(),
                            value: Box::new(Expr::Lit(Lit::Bool(Bool {
                                span: DUMMY_SP,
                                value: true,
                            }))),
                        }))),
                        // initializer: function () {
                        //     return 2;
                        // }
                        PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                            key: quote_ident!("initializer").into(),
                            value: if value.is_some() && value.as_ref().unwrap().is_some() {
                                Box::new(Expr::Fn(FnExpr {
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
                                                    Some(Box::new(Expr::Ident(init.clone())))
                                                } else {
                                                    value.take().unwrap()
                                                },
                                            }
                                            .into()],
                                        }),

                                        type_params: Default::default(),
                                        return_type: Default::default(),
                                    },
                                }))
                            } else {
                                undefined(DUMMY_SP)
                                // Box::new(Expr::Lit(Lit::Null(Null { span:
                                // DUMMY_SP })))
                            },
                        }))),
                    ],
                });

                if p.is_static {
                    property_descriptor = Expr::Seq(SeqExpr {
                        span: DUMMY_SP,
                        exprs: vec![
                            Box::new(Expr::Assign(AssignExpr {
                                span: DUMMY_SP,
                                left: PatOrExpr::Pat(Box::new(Pat::Ident(init.clone().into()))),
                                op: op!("="),
                                // Object.getOwnPropertyDescriptor(_class, "enumconfwrite")
                                right: Box::new(Expr::Call(CallExpr {
                                    span: DUMMY_SP,
                                    callee: member_expr!(DUMMY_SP, Object.getOwnPropertyDescriptor)
                                        .as_callee(),
                                    args: vec![cls_ident.clone().as_arg(), name.clone().as_arg()],
                                    type_args: Default::default(),
                                })),
                            })),
                            // _init = _init ? _init.value : void 0
                            Box::new(Expr::Assign(AssignExpr {
                                span: DUMMY_SP,
                                left: PatOrExpr::Pat(Box::new(Pat::Ident(init.clone().into()))),
                                op: op!("="),
                                right: Box::new(Expr::Cond(CondExpr {
                                    span: DUMMY_SP,
                                    test: Box::new(Expr::Ident(init.clone())),
                                    cons: Box::new(init.clone().make_member(quote_ident!("value"))),
                                    alt: undefined(DUMMY_SP),
                                })),
                            })),
                            Box::new(property_descriptor),
                        ],
                    });
                }

                // _applyDecoratedDescriptor(_class2.prototype, "prop2", [_dec9, _dec10], {
                //     configurable: true,
                //     enumerable: true,
                //     writable: true,
                //     `: function () {
                //         return 2;
                //     }
                // }))
                let call_expr = Box::new(Expr::Call(CallExpr {
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
                }));

                if !p.is_static {
                    extra_exprs.push(Box::new(Expr::Assign(AssignExpr {
                        span: DUMMY_SP,
                        op: op!("="),
                        left: PatOrExpr::Pat(Box::new(Pat::Ident(descriptor.clone().into()))),
                        right: call_expr,
                    })));
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

        let cls_assign = Box::new(Expr::Assign(AssignExpr {
            span: DUMMY_SP,
            op: op!("="),
            left: PatOrExpr::Pat(Box::new(Pat::Ident(cls_ident.clone().into()))),
            right: Box::new(Expr::Class(ClassExpr {
                ident: c.ident.clone(),
                class: Class {
                    decorators: vec![],
                    ..c.class
                },
            })),
        }));

        let var_init = Box::new(Expr::Bin(BinExpr {
            span: DUMMY_SP,
            left: cls_assign,
            op: op!("||"),
            right: Box::new(Expr::Ident(cls_ident.clone())),
        }));

        let expr = self.apply(
            &cls_ident,
            if extra_exprs.is_empty() {
                var_init
            } else {
                extra_exprs.insert(0, var_init);
                // Return value.
                extra_exprs.push(Box::new(Expr::Ident(cls_ident.clone())));

                Box::new(Expr::Seq(SeqExpr {
                    span: DUMMY_SP,
                    exprs: extra_exprs,
                }))
            },
            c.class.decorators,
        );

        expr
    }

    /// Apply class decorators.
    fn apply(
        &mut self,
        class_ident: &Ident,
        mut expr: Box<Expr>,
        decorators: Vec<Decorator>,
    ) -> Box<Expr> {
        for dec in decorators.into_iter().rev() {
            let (i, aliased) = alias_if_required(&dec.expr, "_dec");
            if aliased {
                self.initialized_vars.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Ident(i.clone().into()),
                    init: Some(dec.expr),
                    definite: false,
                });
            }

            let dec_call_expr = Box::new(Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: i.as_callee(),
                args: vec![expr.as_arg()],
                type_args: None,
            }));

            // _class = dec(_class = function() {}) || _class
            let class_expr = Box::new(Expr::Assign(AssignExpr {
                span: DUMMY_SP,
                left: PatOrExpr::Pat(Box::new(Pat::Ident(class_ident.clone().into()))),
                op: op!("="),
                right: Box::new(Expr::Bin(BinExpr {
                    span: DUMMY_SP,
                    left: dec_call_expr,
                    op: op!("||"),
                    right: Box::new(Expr::Ident(class_ident.clone())),
                })),
            }));

            expr = class_expr;
        }

        expr
    }
}

struct ClassFieldAccessConverter {
    cls_name: Ident,
    /// `_class`
    alias: Ident,
}

impl Fold for ClassFieldAccessConverter {
    noop_fold_type!();

    fn fold_ident(&mut self, node: Ident) -> Ident {
        if node.sym == self.cls_name.sym && node.span.ctxt() == self.cls_name.span.ctxt() {
            return self.alias.clone();
        }

        node
    }

    fn fold_member_expr(&mut self, node: MemberExpr) -> MemberExpr {
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
