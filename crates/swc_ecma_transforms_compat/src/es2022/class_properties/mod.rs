#![allow(dead_code)]

use indexmap::IndexMap;
use swc_common::{
    collections::{AHashMap, AHashSet},
    util::take::Take,
    Mark, Span, Spanned, SyntaxContext, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{helper, perf::Check};
use swc_ecma_transforms_classes::super_field::SuperFieldAccessFolder;
use swc_ecma_transforms_macros::fast_path;
use swc_ecma_utils::{
    alias_ident_for, alias_if_required, constructor::inject_after_super, default_constructor,
    private_ident, quote_ident, undefined, ExprFactory, ModuleItemLike, StmtLike, HANDLER,
};
use swc_ecma_visit::{
    as_folder, noop_visit_mut_type, noop_visit_type, Fold, Visit, VisitMut, VisitMutWith, VisitWith,
};

use self::{
    class_name_tdz::ClassNameTdzFolder,
    private_field::{
        dup_private_method, visit_private_in_expr, BrandCheckHandler, Private,
        PrivateAccessVisitor, PrivateKind, PrivateRecord,
    },
    this_in_static::{NewTargetInProp, ThisInStaticFolder},
    used_name::UsedNameCollector,
};

mod class_name_tdz;
mod private_field;
mod this_in_static;
mod used_name;

///
///
///
///
/// # Impl note
///
/// We use custom helper to handle export default class
pub fn class_properties(config: Config) -> impl Fold + VisitMut {
    as_folder(ClassProperties {
        config,
        private: PrivateRecord::new(),
    })
}

#[derive(Debug, Clone, Default)]
pub struct Config {
    pub loose: bool,
}

struct ClassProperties {
    config: Config,
    private: PrivateRecord,
}

enum MemberInit {
    Prop(Span, Box<Expr>),
    Private(Span, Box<Expr>),
    PrivMethod(Span),
    PrivAccessor(Span, Option<Ident>, Option<Ident>),
}

type MemberInitMap = IndexMap<Expr, MemberInit, ahash::RandomState>;

#[fast_path(ShouldWork)]
impl VisitMut for ClassProperties {
    noop_visit_mut_type!();

    fn visit_mut_ident(&mut self, i: &mut Ident) {
        i.optional = false;
    }

    fn visit_mut_array_pat(&mut self, p: &mut ArrayPat) {
        p.visit_mut_children_with(self);
        p.optional = false;
    }

    fn visit_mut_object_pat(&mut self, p: &mut ObjectPat) {
        p.visit_mut_children_with(self);
        p.optional = false;
    }

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        self.visit_mut_stmt_like(n);
    }

    fn visit_mut_stmts(&mut self, n: &mut Vec<Stmt>) {
        self.visit_mut_stmt_like(n);
    }

    fn visit_mut_block_stmt_or_expr(&mut self, body: &mut BlockStmtOrExpr) {
        let span = body.span();

        match body {
            BlockStmtOrExpr::Expr(expr) if expr.is_class() => {
                let ClassExpr { ident, class } = expr.take().class().unwrap();

                let mut stmts = vec![];
                let ident = ident.unwrap_or_else(|| private_ident!("_class"));
                let (vars, decl, mut extra_stmts) =
                    self.visit_mut_class_as_decl(ident.clone(), class);
                if !vars.is_empty() {
                    stmts.push(Stmt::Decl(Decl::Var(VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        decls: vars,
                        declare: false,
                    })));
                }
                stmts.push(Stmt::Decl(Decl::Class(decl)));
                stmts.append(&mut extra_stmts);
                stmts.push(Stmt::Return(ReturnStmt {
                    span: DUMMY_SP,
                    arg: Some(Box::new(Expr::Ident(ident))),
                }));

                *body = BlockStmtOrExpr::BlockStmt(BlockStmt { span, stmts });
            }
            _ => body.visit_mut_children_with(self),
        };
    }

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        if let Expr::Class(ClassExpr { ident, class }) = expr {
            let ident = ident.take().unwrap_or_else(|| private_ident!("_class"));
            let mut stmts = vec![];
            let (vars, decl, mut extra_stmts) =
                self.visit_mut_class_as_decl(ident.clone(), class.take());

            if !vars.is_empty() {
                stmts.push(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    decls: vars,
                    declare: false,
                })));
            }

            if stmts.is_empty() && extra_stmts.is_empty() {
                *expr = Expr::Class(ClassExpr {
                    ident: Some(decl.ident),
                    class: decl.class,
                });
                return;
            }

            stmts.push(Stmt::Decl(Decl::Class(decl)));
            stmts.append(&mut extra_stmts);

            stmts.push(Stmt::Return(ReturnStmt {
                span: DUMMY_SP,
                arg: Some(Box::new(Expr::Ident(ident))),
            }));

            *expr = Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: FnExpr {
                    ident: None,
                    function: Function {
                        span: DUMMY_SP,
                        decorators: vec![],
                        is_async: false,
                        is_generator: false,
                        params: vec![],

                        body: Some(BlockStmt {
                            span: DUMMY_SP,
                            stmts,
                        }),

                        type_params: Default::default(),
                        return_type: Default::default(),
                    },
                }
                .as_callee(),
                args: vec![],
                type_args: Default::default(),
            });
        } else {
            expr.visit_mut_children_with(self);
        };
    }
}

impl ClassProperties {
    fn visit_mut_stmt_like<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike + ModuleItemLike + VisitMutWith<Self>,
    {
        let mut buf = Vec::with_capacity(stmts.len());

        for stmt in stmts.drain(..) {
            match T::try_into_stmt(stmt) {
                Err(node) => match node.try_into_module_decl() {
                    Ok(mut decl) => {
                        match decl {
                            ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                                span,
                                decl: DefaultDecl::Class(ClassExpr { ident, class }),
                                ..
                            }) => {
                                let ident = ident.unwrap_or_else(|| private_ident!("_class"));

                                let (vars, decl, stmts) =
                                    self.visit_mut_class_as_decl(ident.clone(), class);
                                if !vars.is_empty() {
                                    buf.push(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                                        span: DUMMY_SP,
                                        kind: VarDeclKind::Var,
                                        decls: vars,
                                        declare: false,
                                    }))));
                                }
                                buf.push(T::from_stmt(Stmt::Decl(Decl::Class(decl))));
                                buf.extend(stmts.into_iter().map(T::from_stmt));
                                buf.push(
                                    match T::try_from_module_decl(ModuleDecl::ExportNamed(
                                        NamedExport {
                                            span,
                                            specifiers: vec![ExportNamedSpecifier {
                                                span: DUMMY_SP,
                                                orig: ModuleExportName::Ident(ident),
                                                exported: Some(ModuleExportName::Ident(
                                                    private_ident!("default"),
                                                )),
                                                is_type_only: false,
                                            }
                                            .into()],
                                            src: None,
                                            type_only: false,
                                            asserts: None,
                                        },
                                    )) {
                                        Ok(t) => t,
                                        Err(..) => unreachable!(),
                                    },
                                );
                            }
                            ModuleDecl::ExportDecl(ExportDecl {
                                span,
                                decl:
                                    Decl::Class(ClassDecl {
                                        ident,
                                        declare: false,
                                        class,
                                    }),
                                ..
                            }) => {
                                let (vars, decl, stmts) =
                                    self.visit_mut_class_as_decl(ident, class);
                                if !vars.is_empty() {
                                    buf.push(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                                        span: DUMMY_SP,
                                        kind: VarDeclKind::Var,
                                        decls: vars,
                                        declare: false,
                                    }))));
                                }
                                buf.push(
                                    match T::try_from_module_decl(ModuleDecl::ExportDecl(
                                        ExportDecl {
                                            span,
                                            decl: Decl::Class(decl),
                                        },
                                    )) {
                                        Ok(t) => t,
                                        Err(..) => unreachable!(),
                                    },
                                );
                                buf.extend(stmts.into_iter().map(T::from_stmt));
                            }
                            _ => {
                                decl.visit_mut_children_with(self);
                                buf.push(match T::try_from_module_decl(decl) {
                                    Ok(t) => t,
                                    Err(..) => unreachable!(),
                                })
                            }
                        };
                    }
                    Err(..) => unreachable!(),
                },
                Ok(mut stmt) => {
                    // Fold class
                    match stmt {
                        Stmt::Decl(Decl::Class(ClassDecl {
                            ident,
                            class,
                            declare: false,
                        })) => {
                            let (vars, decl, stmts) = self.visit_mut_class_as_decl(ident, class);
                            if !vars.is_empty() {
                                buf.push(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                                    span: DUMMY_SP,
                                    kind: VarDeclKind::Var,
                                    decls: vars,
                                    declare: false,
                                }))));
                            }
                            buf.push(T::from_stmt(Stmt::Decl(Decl::Class(decl))));
                            buf.extend(stmts.into_iter().map(T::from_stmt));
                        }
                        _ => {
                            stmt.visit_mut_children_with(self);
                            buf.push(T::from_stmt(stmt))
                        }
                    }
                }
            }
        }

        *stmts = buf;
    }
}

impl ClassProperties {
    fn visit_mut_class_as_decl(
        &mut self,
        class_ident: Ident,
        mut class: Class,
    ) -> (Vec<VarDeclarator>, ClassDecl, Vec<Stmt>) {
        // Create one mark per class
        let private = Private {
            mark: Mark::fresh(Mark::root()),
            class_name: class_ident.clone(),
            ident: {
                let mut private_map = AHashMap::default();

                for member in class.body.iter() {
                    match member {
                        ClassMember::PrivateMethod(method) => {
                            if let Some(kind) = private_map.get_mut(&method.key.id.sym) {
                                if dup_private_method(kind, method) {
                                    let error =
                                        format!("duplicate private name #{}.", method.key.id.sym);
                                    HANDLER.with(|handler| {
                                        handler.struct_span_err(method.key.id.span, &error).emit()
                                    });
                                } else {
                                    match method.kind {
                                        MethodKind::Getter => kind.has_getter = true,
                                        MethodKind::Setter => kind.has_setter = true,
                                        MethodKind::Method => unreachable!(),
                                    }
                                }
                            } else {
                                private_map.insert(
                                    method.key.id.sym.clone(),
                                    PrivateKind {
                                        is_method: true,
                                        is_static: method.is_static,
                                        has_getter: method.kind == MethodKind::Getter,
                                        has_setter: method.kind == MethodKind::Setter,
                                    },
                                );
                            }
                        }

                        ClassMember::PrivateProp(prop) => {
                            if private_map.get(&prop.key.id.sym).is_some() {
                                let error = format!("duplicate private name #{}.", prop.key.id.sym);
                                HANDLER.with(|handler| {
                                    handler.struct_span_err(prop.key.id.span, &error).emit()
                                });
                            } else {
                                private_map.insert(
                                    prop.key.id.sym.clone(),
                                    PrivateKind {
                                        is_method: false,
                                        is_static: prop.is_static,
                                        has_getter: false,
                                        has_setter: false,
                                    },
                                );
                            };
                        }

                        _ => (),
                    };
                }

                private_map
            },
        };

        self.private.push(private);

        // we must collect outer class's private first
        class.visit_mut_children_with(self);

        let has_super = class.super_class.is_some();

        // we need a hash map to avoid generate two init for corresponding getter/setter
        let mut constructor_inits = MemberInitMap::default();
        let mut vars = vec![];
        let mut extra_inits = MemberInitMap::default();
        // same here
        let mut private_method_fn_decls = vec![];
        let mut members = vec![];
        let mut constructor = None;
        let mut used_names = vec![];
        let mut used_key_names = vec![];

        class.body.visit_mut_with(&mut BrandCheckHandler {
            names: &mut AHashSet::default(),
            private: &self.private,
        });

        for member in class.body {
            match member {
                ClassMember::Empty(..) | ClassMember::TsIndexSignature(..) => members.push(member),

                ClassMember::Method(method) => {
                    // we handle computed key here to preserve the execution order
                    let key = match method.key {
                        PropName::Computed(ComputedPropName {
                            span: c_span,
                            mut expr,
                        }) => {
                            vars.extend(visit_private_in_expr(&mut expr, &self.private));

                            expr.visit_mut_with(&mut ClassNameTdzFolder {
                                class_name: &class_ident,
                            });
                            let ident = private_ident!("tmp");
                            // Handle computed property
                            vars.push(VarDeclarator {
                                span: DUMMY_SP,
                                name: ident.clone().into(),
                                init: Some(expr),
                                definite: false,
                            });
                            // We use computed because `classes` pass converts PropName::Ident to
                            // string.
                            PropName::Computed(ComputedPropName {
                                span: c_span,
                                expr: Box::new(Expr::Ident(ident)),
                            })
                        }
                        _ => method.key,
                    };
                    members.push(ClassMember::Method(ClassMethod { key, ..method }))
                }

                ClassMember::ClassProp(mut prop) => {
                    let prop_span = prop.span();
                    prop.key.visit_mut_with(&mut ClassNameTdzFolder {
                        class_name: &class_ident,
                    });

                    if !prop.is_static {
                        prop.key.visit_with(&mut UsedNameCollector {
                            used_names: &mut used_key_names,
                        });

                        prop.value.visit_with(&mut UsedNameCollector {
                            used_names: &mut used_names,
                        });
                    }

                    let key = match prop.key {
                        PropName::Ident(i) => Expr::from(Lit::Str(Str {
                            span: i.span,
                            value: i.sym,
                            has_escape: false,
                            kind: StrKind::Normal {
                                contains_quote: false,
                            },
                        })),
                        PropName::Num(num) => Expr::from(num),
                        PropName::Str(s) => Expr::from(s),
                        PropName::BigInt(big_int) => Expr::from(big_int),

                        PropName::Computed(mut key) => {
                            vars.extend(visit_private_in_expr(&mut key.expr, &self.private));
                            let (ident, aliased) = if let Expr::Ident(i) = &*key.expr {
                                if used_key_names.contains(&i.sym) {
                                    (alias_ident_for(&key.expr, "_ref"), true)
                                } else {
                                    alias_if_required(&key.expr, "_ref")
                                }
                            } else {
                                alias_if_required(&key.expr, "_ref")
                            };
                            // ident.span = ident.span.apply_mark(Mark::fresh(Mark::root()));
                            if aliased {
                                // Handle computed property
                                vars.push(VarDeclarator {
                                    span: DUMMY_SP,
                                    name: ident.clone().into(),
                                    init: Some(key.expr),
                                    definite: false,
                                });
                            }
                            Expr::from(ident)
                        }
                    };

                    let mut value = prop.value.unwrap_or_else(|| undefined(prop_span));

                    value.visit_mut_with(&mut NewTargetInProp);

                    vars.extend(visit_private_in_expr(&mut value, &self.private));

                    if prop.is_static {
                        value.visit_mut_with(&mut SuperFieldAccessFolder {
                            class_name: &class_ident,
                            vars: &mut vars,
                            constructor_this_mark: None,
                            is_static: true,
                            folding_constructor: false,
                            in_injected_define_property_call: false,
                            in_nested_scope: false,
                            this_alias_mark: None,
                            // TODO: add loose mode
                            constant_super: false,
                            super_class: &None,
                        });
                        value.visit_mut_with(&mut ThisInStaticFolder {
                            ident: class_ident.clone(),
                        });
                    }

                    if prop.is_static {
                        extra_inits.insert(key, MemberInit::Prop(prop_span, value));
                    } else {
                        constructor_inits.insert(key, MemberInit::Prop(prop_span, value));
                    }
                }
                ClassMember::PrivateProp(mut prop) => {
                    let prop_span = prop.span();

                    let ident = Ident::new(
                        format!("_{}", prop.key.id.sym).into(),
                        // We use `self.mark` for private variables.
                        prop.key.span.apply_mark(self.private.cur_mark()),
                    );

                    if let Some(value) = &mut prop.value {
                        value.visit_mut_with(&mut NewTargetInProp);
                        vars.extend(visit_private_in_expr(&mut *value, &self.private));
                    }

                    prop.value.visit_with(&mut UsedNameCollector {
                        used_names: &mut used_names,
                    });
                    if prop.is_static {
                        prop.value.visit_mut_with(&mut ThisInStaticFolder {
                            ident: class_ident.clone(),
                        });
                    }

                    let value = prop.value.unwrap_or_else(|| undefined(prop_span));

                    if prop.is_static {
                        extra_inits.insert(ident.into(), MemberInit::Private(prop_span, value));
                    } else {
                        constructor_inits
                            .insert(ident.clone().into(), MemberInit::Private(prop_span, value));
                    let extra_init = if prop.is_static {
                        Box::new(Expr::Object(ObjectLit {
                            span: DUMMY_SP,
                            props: vec![
                                PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                                    key: PropName::Ident(quote_ident!("writable")),
                                    value: true.into(),
                                }))),
                                PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                                    key: PropName::Ident(quote_ident!("value")),
                                    value,
                                }))),
                            ],
                        }))
                    } else {
                        constructor_exprs.push(Box::new(Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: helper!(class_private_field_init, "classPrivateFieldInit"),
                            args: vec![
                                ThisExpr { span: DUMMY_SP }.as_arg(),
                                ident.clone().as_arg(),
                                ObjectLit {
                                    span: DUMMY_SP,
                                    props: vec![
                                        // writeable: true
                                        PropOrSpread::Prop(Box::new(Prop::KeyValue(
                                            KeyValueProp {
                                                key: PropName::Ident(quote_ident!("writable")),
                                                value: true.into(),
                                            },
                                        ))),
                                        // value: value,
                                        PropOrSpread::Prop(Box::new(Prop::KeyValue(
                                            KeyValueProp {
                                                key: PropName::Ident(quote_ident!("value")),
                                                value,
                                            },
                                        ))),
                                    ],
                                }
                                .as_arg(),
                            ],
                            type_args: Default::default(),
                        })));

                        vars.push(VarDeclarator {
                            span: DUMMY_SP,
                            definite: false,
                            name: ident.into(),
                            init: Some(Box::new(Expr::from(NewExpr {
                                span: DUMMY_SP,
                                callee: Box::new(Expr::Ident(quote_ident!("WeakMap"))),
                                args: Some(Default::default()),
                                type_args: Default::default(),
                            }))),
                        });
                    };
                }

                ClassMember::Constructor(c) => {
                    constructor = Some(c);
                }

                ClassMember::PrivateMethod(method) => {
                    let is_static = method.is_static;
                    let prop_span = method.span;

                    let fn_name = Ident::new(
                        match method.kind {
                            MethodKind::Getter => format!("get_{}", method.key.id.sym).into(),
                            MethodKind::Setter => format!("set_{}", method.key.id.sym).into(),
                            MethodKind::Method => method.key.id.sym.clone(),
                        },
                        method
                            .span
                            .with_ctxt(SyntaxContext::empty())
                            .apply_mark(self.private.cur_mark()),
                    );

                    let weak_coll_var = Ident::new(
                        format!("_{}", method.key.id.sym).into(),
                        // We use `self.mark` for private variables.
                        method.key.span.apply_mark(self.private.cur_mark()),
                    );
                    method.function.visit_with(&mut UsedNameCollector {
                        used_names: &mut used_names,
                    });

                    let extra_collect = match (method.kind, is_static) {
                        (MethodKind::Getter | MethodKind::Setter, false) => {
                            let mut inserted = false;
                            let mut key = weak_coll_var.clone();
                            key.span = DUMMY_SP.with_ctxt(key.span.ctxt);
                            let mut entry =
                                constructor_inits.entry(key.into()).or_insert_with(|| {
                                    inserted = true;
                                    MemberInit::PrivAccessor(prop_span, None, None)
                                });
                            if let MemberInit::PrivAccessor(_, getter, setter) = &mut entry {
                                if method.kind == MethodKind::Getter {
                                    *getter = Some(fn_name.clone())
                                } else {
                                    *setter = Some(fn_name.clone())
                                }
                            };

                            if inserted {
                                Some(quote_ident!("WeakMap"))
                            } else {
                                None
                            }
                        }
                        (MethodKind::Getter | MethodKind::Setter, true) => {
                            let mut key = weak_coll_var.clone();
                            key.span = DUMMY_SP.with_ctxt(key.span.ctxt);
                            let mut entry = extra_inits
                                .entry(key.into())
                                .or_insert(MemberInit::PrivAccessor(prop_span, None, None));
                            if let MemberInit::PrivAccessor(_, getter, setter) = &mut entry {
                                if method.kind == MethodKind::Getter {
                                    *getter = Some(fn_name.clone())
                                } else {
                                    *setter = Some(fn_name.clone())
                                }
                            }
                            None
                        }

                        (MethodKind::Method, false) => {
                            constructor_inits.insert(
                                weak_coll_var.clone().into(),
                                MemberInit::PrivMethod(prop_span),
                            );
                            Some(quote_ident!("WeakSet"))
                        }
                        (MethodKind::Method, true) => None,
                    };

                    if let Some(extra) = extra_collect {
                        vars.push(VarDeclarator {
                            span: DUMMY_SP,
                            definite: false,
                            name: weak_coll_var.clone().into(),
                            init: Some(Box::new(Expr::from(NewExpr {
                                span: DUMMY_SP,
                                callee: Box::new(Expr::Ident(extra)),
                                args: Some(Default::default()),
                                type_args: Default::default(),
                            }))),
                        })
                    };

                    private_method_fn_decls.push(Stmt::Decl(Decl::Fn(FnDecl {
                        ident: fn_name,
                        function: method.function,
                        declare: false,
                    })))
                }

                ClassMember::StaticBlock(..) => unreachable!(
                    "classes pass: static blocks\nstatic_blocks pass should remove this"
                ),
            }
        }

        let constructor = self.process_constructor(constructor, has_super, constructor_inits);
        if let Some(c) = constructor {
            members.push(ClassMember::Constructor(c));
        }

        private_method_fn_decls.visit_mut_with(&mut PrivateAccessVisitor {
            private: &self.private,
            vars: vec![],
            in_assign_pat: false,
        });

        let extra_stmts = extra_inits
            .into_iter()
            .map(|(key, value)| match value {
                MemberInit::Prop(span, value) => Stmt::Expr(ExprStmt {
                    span,
                    expr: Expr::Call(CallExpr {
                        span,
                        callee: helper!(define_property, "defineProperty"),
                        args: vec![class_ident.clone().as_arg(), key.as_arg(), value.as_arg()],
                        type_args: Default::default(),
                    })
                    .into(),
                }),
                MemberInit::Private(span, value) => Stmt::Decl(Decl::Var(VarDecl {
                    span,
                    kind: VarDeclKind::Var,
                    decls: vec![VarDeclarator {
                        span,
                        name: key.expect_ident().into(),
                        init: Some(
                            Expr::Object(ObjectLit {
                                span,
                                props: vec![
                                    PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                                        key: PropName::Ident(quote_ident!("writable")),
                                        value: true.into(),
                                    }))),
                                    PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                                        key: PropName::Ident(quote_ident!("value")),
                                        value,
                                    }))),
                                ],
                            })
                            .into(),
                        ),
                        definite: false,
                    }],
                    declare: false,
                })),
                MemberInit::PrivAccessor(span, getter, setter) => Stmt::Decl(Decl::Var(VarDecl {
                    span,
                    kind: VarDeclKind::Var,
                    decls: vec![VarDeclarator {
                        span,
                        name: key.expect_ident().into(),
                        init: Some(
                            Expr::Object(ObjectLit {
                                span,
                                props: vec![
                                    PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                                        key: PropName::Ident(quote_ident!("get")),
                                        value: getter
                                            .map(|id| Box::new(id.into()))
                                            .unwrap_or_else(|| undefined(DUMMY_SP)),
                                    }))),
                                    PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                                        key: PropName::Ident(quote_ident!("set")),
                                        value: setter
                                            .map(|id| Box::new(id.into()))
                                            .unwrap_or_else(|| undefined(DUMMY_SP)),
                                    }))),
                                ],
                            })
                            .into(),
                        ),
                        definite: false,
                    }],
                    declare: false,
                })),
                MemberInit::PrivMethod(_) => unreachable!(),
            })
            .chain(private_method_fn_decls)
            .collect();

        members.visit_mut_with(&mut PrivateAccessVisitor {
            private: &self.private,
            vars: vec![],
            in_assign_pat: false,
        });

        self.private.pop();

        (
            vars,
            ClassDecl {
                ident: class_ident,
                declare: false,
                class: Class {
                    body: members,
                    ..class
                },
            },
            extra_stmts,
        )
    }

    /// # Legacy support.
    ///
    /// ## Why is this required?
    ///
    /// Hygiene data of
    ///
    ///```ts
    /// class A {
    ///     b = this.a;
    ///     constructor(a){
    ///         this.a = a;
    ///     }
    /// }
    /// ```
    ///
    /// is
    ///
    ///```ts
    /// class A0 {
    ///     constructor(a1){
    ///         this.a0 = a0;
    ///         this.b0 = this.a0;
    ///     }
    /// }
    /// ```
    ///
    /// which is valid only for es2020 properties.
    ///
    /// Legacy proposal which is used by typescript requires different hygiene.
    #[allow(clippy::vec_box)]
    fn process_constructor(
        &mut self,
        constructor: Option<Constructor>,
        has_super: bool,
        constructor_exprs: MemberInitMap,
    ) -> Option<Constructor> {
        let constructor = constructor.or_else(|| {
            if constructor_exprs.is_empty() {
                None
            } else {
                Some(default_constructor(has_super))
            }
        });

        if let Some(mut c) = constructor {
            let constructor_exprs = constructor_exprs
                .into_iter()
                .map(|(key, value)| {
                    let (span, callee, args) = match value {
                        MemberInit::PrivMethod(span) => (
                            span,
                            helper!(class_private_method_init, "classPrivateMethodInit"),
                            vec![ThisExpr { span: DUMMY_SP }.as_arg(), key.as_arg()],
                        ),
                        MemberInit::Private(span, value) => (
                            span,
                            helper!(class_private_field_init, "classPrivateFieldInit"),
                            vec![
                                ThisExpr { span: DUMMY_SP }.as_arg(),
                                key.as_arg(),
                                ObjectLit {
                                    span: DUMMY_SP,
                                    props: vec![
                                        // writeable: true
                                        PropOrSpread::Prop(Box::new(Prop::KeyValue(
                                            KeyValueProp {
                                                key: PropName::Ident(quote_ident!("writable")),
                                                value:true.into(),
                                            },
                                        ))),
                                        // value: value,
                                        PropOrSpread::Prop(Box::new(Prop::KeyValue(
                                            KeyValueProp {
                                                key: PropName::Ident(quote_ident!("value")),
                                                value,
                                            },
                                        ))),
                                    ],
                                }
                                .as_arg(),
                            ],
                        ),
                        MemberInit::PrivAccessor(span, getter, setter) => (
                            span,
                            helper!(class_private_field_init, "classPrivateFieldInit"),
                            vec![
                                ThisExpr { span: DUMMY_SP }.as_arg(),
                                key.as_arg(),
                                ObjectLit {
                                    span: DUMMY_SP,
                                    props: vec![
                                        PropOrSpread::Prop(Box::new(Prop::KeyValue(
                                            KeyValueProp {
                                                key: PropName::Ident(quote_ident!("get")),
                                                value: getter
                                                    .map(|id| Box::new(id.into()))
                                                    .unwrap_or_else(|| undefined(DUMMY_SP)),
                                            },
                                        ))),
                                        PropOrSpread::Prop(Box::new(Prop::KeyValue(
                                            KeyValueProp {
                                                key: PropName::Ident(quote_ident!("set")),
                                                value: setter
                                                    .map(|id| Box::new(id.into()))
                                                    .unwrap_or_else(|| undefined(DUMMY_SP)),
                                            },
                                        ))),
                                    ],
                                }
                                .as_arg(),
                            ],
                        ),
                        MemberInit::Prop(span, value) => (
                            span,
                            helper!(define_property, "defineProperty"),
                            vec![
                                ThisExpr { span: DUMMY_SP }.as_arg(),
                                key.as_arg(),
                                value.as_arg(),
                            ],
                        ),
                    };
                    Box::new(Expr::Call(CallExpr {
                        span,
                        callee,
                        args,
                        type_args: Default::default(),
                    }))
                })
                .collect();
            // Prepend properties
            inject_after_super(&mut c, constructor_exprs);
            Some(c)
        } else {
            None
        }
    }
}

#[derive(Default)]
struct ShouldWork {
    found: bool,
}

impl Visit for ShouldWork {
    noop_visit_type!();

    fn visit_ident(&mut self, n: &Ident) {
        if n.optional {
            self.found = true;
        }
    }

    fn visit_array_pat(&mut self, n: &ArrayPat) {
        if n.optional {
            self.found = true;
        }
    }

    fn visit_object_pat(&mut self, n: &ObjectPat) {
        if n.optional {
            self.found = true;
        }
    }

    fn visit_class_method(&mut self, _: &ClassMethod) {
        self.found = true;
    }

    fn visit_class_prop(&mut self, _: &ClassProp) {
        self.found = true;
    }

    fn visit_private_prop(&mut self, _: &PrivateProp) {
        self.found = true;
    }

    fn visit_private_method(&mut self, _: &PrivateMethod) {
        self.found = true;
    }

    fn visit_constructor(&mut self, _: &Constructor) {
        self.found = true;
    }
}

impl Check for ShouldWork {
    fn should_handle(&self) -> bool {
        self.found
    }
}
