#![allow(dead_code)]

use swc_common::{
    collections::{AHashMap, AHashSet},
    util::take::Take,
    Mark, Spanned, SyntaxContext, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{helper, perf::Check};
use swc_ecma_transforms_classes::super_field::SuperFieldAccessFolder;
use swc_ecma_transforms_macros::fast_path;
use swc_ecma_utils::{
    alias_ident_for, alias_if_required, constructor::inject_after_super, default_constructor,
    is_literal, private_ident, quote_ident, undefined, ExprFactory, ModuleItemLike, StmtLike,
    HANDLER,
};
use swc_ecma_visit::{
    as_folder, noop_visit_mut_type, noop_visit_type, Fold, Visit, VisitMut, VisitMutWith, VisitWith,
};

use self::{
    class_name_tdz::ClassNameTdzFolder,
    member_init::{MemberInit, MemberInitRecord, PrivAccessor, PrivMethod, PrivProp, PubProp},
    private_field::{
        dup_private_method, visit_private_in_expr, BrandCheckHandler, Private,
        PrivateAccessVisitor, PrivateKind, PrivateRecord,
    },
    this_in_static::{NewTargetInProp, ThisInStaticFolder},
    used_name::UsedNameCollector,
};

mod class_name_tdz;
mod member_init;
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
        c: config,
        private: PrivateRecord::new(),
    })
}

#[derive(Debug, Clone, Copy, Default)]
pub struct Config {
    pub private_as_properties: bool,
    pub set_public_fields: bool,
    pub constant_super: bool,
    pub no_document_all: bool,
}

struct ClassProperties {
    c: Config,
    private: PrivateRecord,
}

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

        let mut constructor_inits = MemberInitRecord::new(self.c);
        let mut vars = vec![];
        let mut extra_inits = MemberInitRecord::new(self.c);
        let mut private_method_fn_decls = vec![];
        let mut members = vec![];
        let mut constructor = None;
        let mut used_names = vec![];
        let mut used_key_names = vec![];
        let mut super_ident = None;

        class.body.visit_mut_with(&mut BrandCheckHandler {
            names: &mut AHashSet::default(),
            private: &self.private,
        });

        for member in class.body {
            match member {
                ClassMember::Empty(..) | ClassMember::TsIndexSignature(..) => members.push(member),

                ClassMember::Method(method) => {
                    // we handle computed key here to preserve the execution order
                    let key = if let PropName::Computed(ComputedPropName {
                        span: c_span,
                        mut expr,
                    }) = method.key
                    {
                        vars.extend(visit_private_in_expr(&mut expr, &self.private, self.c));

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
                    } else {
                        method.key
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

                    if let PropName::Computed(key) = &mut prop.key {
                        if !is_literal(&key.expr) {
                            vars.extend(visit_private_in_expr(
                                &mut key.expr,
                                &self.private,
                                self.c,
                            ));
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
                                    init: Some(key.expr.take()),
                                    definite: false,
                                });
                            }
                            *key.expr = Expr::from(ident);
                        }
                    };

                    let mut value = prop.value.unwrap_or_else(|| undefined(prop_span));

                    value.visit_mut_with(&mut NewTargetInProp);

                    vars.extend(visit_private_in_expr(&mut value, &self.private, self.c));

                    if prop.is_static {
                        if let (Some(super_class), None) = (&mut class.super_class, &super_ident) {
                            let (ident, aliased) = alias_if_required(&*super_class, "_ref");
                            super_ident = Some(ident.clone());

                            if aliased {
                                vars.push(VarDeclarator {
                                    span: DUMMY_SP,
                                    name: ident.clone().into(),
                                    init: None,
                                    definite: false,
                                });
                                let span = super_class.span();
                                **super_class = Expr::Assign(AssignExpr {
                                    span,
                                    op: op!("="),
                                    left: PatOrExpr::Pat(Box::new(ident.into())),
                                    right: super_class.take(),
                                })
                            }
                        }

                        value.visit_mut_with(&mut SuperFieldAccessFolder {
                            class_name: &class_ident,
                            vars: &mut vars,
                            constructor_this_mark: None,
                            is_static: true,
                            folding_constructor: false,
                            in_injected_define_property_call: false,
                            in_nested_scope: false,
                            this_alias_mark: None,
                            constant_super: self.c.constant_super,
                            super_class: &super_ident,
                        });
                        value.visit_mut_with(&mut ThisInStaticFolder {
                            ident: class_ident.clone(),
                        });
                    }

                    let init = MemberInit::PubProp(PubProp {
                        span: prop_span,
                        name: prop.key,
                        value,
                    });
                    if prop.is_static {
                        extra_inits.push(init);
                    } else {
                        constructor_inits.push(init);
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
                        vars.extend(visit_private_in_expr(&mut *value, &self.private, self.c));
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

                    let init = MemberInit::PrivProp(PrivProp {
                        span: prop_span,
                        name: ident.clone(),
                        value,
                    });
                    if self.c.private_as_properties {
                        vars.push(VarDeclarator {
                            span: DUMMY_SP,
                            definite: false,
                            name: ident.clone().into(),
                            init: Some(Box::new(Expr::from(CallExpr {
                                span: DUMMY_SP,
                                callee: helper!(
                                    class_private_field_loose_key,
                                    "classPrivateFieldLooseKey"
                                ),
                                args: vec![ident.sym.as_arg()],
                                type_args: Default::default(),
                            }))),
                        });
                    } else if !prop.is_static {
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
                    if prop.is_static {
                        extra_inits.push(init);
                    } else {
                        constructor_inits.push(init);
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
                            let is_getter = method.kind == MethodKind::Getter;
                            let inserted =
                                constructor_inits.push(MemberInit::PrivAccessor(PrivAccessor {
                                    span: prop_span,
                                    name: weak_coll_var.clone(),
                                    getter: if is_getter {
                                        Some(fn_name.clone())
                                    } else {
                                        None
                                    },
                                    setter: if !is_getter {
                                        Some(fn_name.clone())
                                    } else {
                                        None
                                    },
                                }));

                            if inserted {
                                Some(quote_ident!("WeakMap"))
                            } else {
                                None
                            }
                        }
                        (MethodKind::Getter | MethodKind::Setter, true) => {
                            let is_getter = method.kind == MethodKind::Getter;
                            let inserted =
                                extra_inits.push(MemberInit::PrivAccessor(PrivAccessor {
                                    span: prop_span,
                                    name: weak_coll_var.clone(),
                                    getter: if is_getter {
                                        Some(fn_name.clone())
                                    } else {
                                        None
                                    },
                                    setter: if !is_getter {
                                        Some(fn_name.clone())
                                    } else {
                                        None
                                    },
                                }));
                            if inserted && self.c.private_as_properties {
                                Some(Ident::dummy())
                            } else {
                                None
                            }
                        }

                        (MethodKind::Method, false) => {
                            constructor_inits.push(MemberInit::PrivMethod(PrivMethod {
                                span: prop_span,
                                name: weak_coll_var.clone(),
                                fn_name: if self.c.private_as_properties {
                                    fn_name.clone()
                                } else {
                                    Ident::dummy()
                                },
                            }));
                            Some(quote_ident!("WeakSet"))
                        }
                        (MethodKind::Method, true) => {
                            if self.c.private_as_properties {
                                extra_inits.push(MemberInit::PrivMethod(PrivMethod {
                                    span: prop_span,
                                    name: weak_coll_var.clone(),
                                    fn_name: fn_name.clone(),
                                }));
                                Some(Ident::dummy())
                            } else {
                                None
                            }
                        }
                    };

                    if let Some(extra) = extra_collect {
                        vars.push(VarDeclarator {
                            span: DUMMY_SP,
                            definite: false,
                            name: weak_coll_var.clone().into(),
                            init: Some(Box::new(if self.c.private_as_properties {
                                Expr::from(CallExpr {
                                    span: DUMMY_SP,
                                    callee: helper!(
                                        class_private_field_loose_key,
                                        "classPrivateFieldLooseKey"
                                    ),
                                    args: vec![weak_coll_var.sym.as_arg()],
                                    type_args: Default::default(),
                                })
                            } else {
                                Expr::New(NewExpr {
                                    span: DUMMY_SP,
                                    callee: Box::new(Expr::Ident(extra)),
                                    args: Some(Default::default()),
                                    type_args: Default::default(),
                                })
                            })),
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
            c: self.c,
        });

        let mut extra_stmts = extra_inits.into_init_static(class_ident.clone());

        extra_stmts.extend(private_method_fn_decls);

        members.visit_mut_with(&mut PrivateAccessVisitor {
            private: &self.private,
            vars: vec![],
            in_assign_pat: false,
            c: self.c,
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
        constructor_exprs: MemberInitRecord,
    ) -> Option<Constructor> {
        let constructor = constructor.or_else(|| {
            if constructor_exprs.record.is_empty() {
                None
            } else {
                Some(default_constructor(has_super))
            }
        });

        if let Some(mut c) = constructor {
            let constructor_exprs = constructor_exprs.into_init();
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
