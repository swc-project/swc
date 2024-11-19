use swc_common::{
    collections::AHashMap, errors::HANDLER, source_map::PURE_SP, util::take::Take, Mark, Span,
    Spanned, SyntaxContext, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{helper, perf::Check};
use swc_ecma_transforms_classes::super_field::SuperFieldAccessFolder;
use swc_ecma_transforms_macros::fast_path;
use swc_ecma_utils::{
    alias_ident_for, alias_if_required, constructor::inject_after_super,
    default_constructor_with_span, is_literal, prepend_stmt, private_ident, quote_ident,
    replace_ident, ExprFactory, ModuleItemLike, StmtLike,
};
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, visit_mut_pass, Visit, VisitMut, VisitMutWith, VisitWith,
};
use swc_trace_macro::swc_trace;

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
pub fn class_properties(config: Config, unresolved_mark: Mark) -> impl Pass {
    visit_mut_pass(ClassProperties {
        c: config,
        private: PrivateRecord::new(),
        extra: ClassExtra::default(),
        unresolved_mark,
    })
}

#[derive(Debug, Default, Clone, Copy)]
pub struct Config {
    pub private_as_properties: bool,
    pub set_public_fields: bool,
    pub constant_super: bool,
    pub no_document_all: bool,
    pub pure_getter: bool,
}

struct ClassProperties {
    extra: ClassExtra,
    c: Config,
    private: PrivateRecord,
    unresolved_mark: Mark,
}

#[derive(Default)]
struct ClassExtra {
    lets: Vec<VarDeclarator>,
    vars: Vec<VarDeclarator>,
    stmts: Vec<Stmt>,
}

#[swc_trace]
impl ClassExtra {
    fn prepend_with<T: StmtLike>(self, stmts: &mut Vec<T>) {
        if !self.vars.is_empty() {
            prepend_stmt(
                stmts,
                T::from(Stmt::from(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    decls: self.vars,
                    ..Default::default()
                })),
            )
        }

        if !self.lets.is_empty() {
            prepend_stmt(
                stmts,
                T::from(Stmt::from(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Let,
                    decls: self.lets,
                    ..Default::default()
                })),
            )
        }

        stmts.extend(self.stmts.into_iter().map(|stmt| stmt.into()))
    }

    fn merge_with<T: StmtLike>(self, stmts: &mut Vec<T>, class: T) {
        if !self.vars.is_empty() {
            stmts.push(T::from(Stmt::from(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Var,
                decls: self.vars,
                ..Default::default()
            })))
        }

        if !self.lets.is_empty() {
            stmts.push(T::from(
                VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Let,
                    decls: self.lets,
                    ..Default::default()
                }
                .into(),
            ));
        }

        stmts.push(class);

        stmts.extend(self.stmts.into_iter().map(|stmt| stmt.into()))
    }
}

impl Take for ClassExtra {
    fn dummy() -> Self {
        Self::default()
    }
}

#[swc_trace]
#[fast_path(ShouldWork)]
impl VisitMut for ClassProperties {
    noop_visit_mut_type!(fail);

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        self.visit_mut_stmt_like(n);

        self.extra.take().prepend_with(n)
    }

    fn visit_mut_stmts(&mut self, n: &mut Vec<Stmt>) {
        let old = self.extra.take();
        self.visit_mut_stmt_like(n);

        self.extra.take().prepend_with(n);

        self.extra = old;
    }

    fn visit_mut_block_stmt_or_expr(&mut self, body: &mut BlockStmtOrExpr) {
        match body {
            BlockStmtOrExpr::Expr(expr) if expr.is_class() => {
                let ClassExpr { ident, class } = expr.take().class().unwrap();

                let mut stmts = Vec::new();
                let ident = ident.unwrap_or_else(|| private_ident!("_class"));
                let (decl, extra) = self.visit_mut_class_as_decl(ident.clone(), class);

                extra.merge_with(&mut stmts, decl.into());

                stmts.push(
                    ReturnStmt {
                        span: DUMMY_SP,
                        arg: Some(ident.into()),
                    }
                    .into(),
                );

                *body = BlockStmtOrExpr::BlockStmt(BlockStmt {
                    span: DUMMY_SP,
                    stmts,
                    ..Default::default()
                });
            }
            _ => body.visit_mut_children_with(self),
        };
    }

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        if let Expr::Class(ClassExpr {
            ident: orig_ident,
            class,
        }) = expr
        {
            let ident = private_ident!(orig_ident
                .clone()
                .map(|id| format!("_{}", id.sym))
                .unwrap_or_else(|| "_class".into()));
            let (decl, ClassExtra { lets, vars, stmts }) =
                self.visit_mut_class_as_decl(ident.clone(), class.take());

            let class = ClassExpr {
                ident: orig_ident.clone(),
                class: decl.class,
            }
            .into();
            if vars.is_empty() && lets.is_empty() && stmts.is_empty() {
                *expr = class;
                return;
            }

            let mut exprs = Vec::new();

            for mut var in vars {
                let init = var.init.take();
                if let Some(init) = init {
                    exprs.push(
                        AssignExpr {
                            span: var.span,
                            op: op!("="),
                            left: var.name.clone().try_into().unwrap(),
                            right: init,
                        }
                        .into(),
                    )
                }
                self.extra.vars.push(var);
            }

            for mut var in lets {
                let init = var.init.take();
                if let Some(init) = init {
                    exprs.push(
                        AssignExpr {
                            span: var.span,
                            op: op!("="),
                            left: var.name.clone().try_into().unwrap(),
                            right: init,
                        }
                        .into(),
                    )
                }
                self.extra.lets.push(var);
            }

            let mut extra_value = false;
            if !stmts.is_empty() {
                extra_value = true;
                self.extra.vars.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: ident.clone().into(),
                    init: None,
                    definite: false,
                });
                exprs.push(
                    AssignExpr {
                        span: DUMMY_SP,
                        left: ident.clone().into(),
                        op: op!("="),
                        right: class.into(),
                    }
                    .into(),
                );
            } else {
                exprs.push(class.into());
            }

            for mut stmt in stmts {
                if let Some(orig_ident) = orig_ident {
                    replace_ident(&mut stmt, orig_ident.clone().into(), &ident);
                }
                match stmt {
                    Stmt::Expr(e) => exprs.push(e.expr),
                    Stmt::Decl(Decl::Var(v)) => {
                        for mut decl in v.decls {
                            let init = decl.init.take();

                            if let Some(init) = init {
                                exprs.push(
                                    AssignExpr {
                                        span: decl.span,
                                        op: op!("="),
                                        left: decl.name.clone().try_into().unwrap(),
                                        right: init,
                                    }
                                    .into(),
                                )
                            }

                            self.extra.vars.push(decl)
                        }
                    }
                    _ => self.extra.stmts.push(stmt),
                }
            }

            if extra_value {
                exprs.push(Box::new(ident.into()))
            }

            *expr = SeqExpr {
                span: DUMMY_SP,
                exprs,
            }
            .into()
        } else {
            expr.visit_mut_children_with(self);
        };
    }
}

#[swc_trace]
impl ClassProperties {
    fn visit_mut_stmt_like<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike + ModuleItemLike + VisitMutWith<Self> + From<Stmt>,
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

                                let (decl, extra) =
                                    self.visit_mut_class_as_decl(ident.clone(), class);

                                extra.merge_with(&mut buf, T::from(decl.into()));

                                buf.push(
                                    match T::try_from_module_decl(
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
                                            with: None,
                                        }
                                        .into(),
                                    ) {
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
                                let (decl, extra) = self.visit_mut_class_as_decl(ident, class);
                                extra.merge_with(
                                    &mut buf,
                                    match T::try_from_module_decl(
                                        ExportDecl {
                                            span,
                                            decl: decl.into(),
                                        }
                                        .into(),
                                    ) {
                                        Ok(t) => t,
                                        Err(..) => unreachable!(),
                                    },
                                )
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
                            let (decl, extra) = self.visit_mut_class_as_decl(ident, class);
                            extra.merge_with(&mut buf, T::from(decl.into()))
                        }
                        _ => {
                            stmt.visit_mut_children_with(self);
                            buf.push(T::from(stmt))
                        }
                    }
                }
            }
        }

        *stmts = buf;
    }
}

#[swc_trace]
impl ClassProperties {
    fn visit_mut_class_as_decl(
        &mut self,
        class_ident: Ident,
        mut class: Box<Class>,
    ) -> (ClassDecl, ClassExtra) {
        // Create one mark per class
        let private = Private {
            mark: Mark::fresh(Mark::root()),
            class_name: class_ident.clone(),
            ident: {
                let mut private_map = AHashMap::default();

                for member in class.body.iter() {
                    match member {
                        ClassMember::PrivateMethod(method) => {
                            if let Some(kind) = private_map.get_mut(&method.key.name) {
                                if dup_private_method(kind, method) {
                                    let error =
                                        format!("duplicate private name #{}.", method.key.name);
                                    HANDLER.with(|handler| {
                                        handler.struct_span_err(method.key.span, &error).emit()
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
                                    method.key.name.clone(),
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
                            if private_map.contains_key(&prop.key.name) {
                                let error = format!("duplicate private name #{}.", prop.key.name);
                                HANDLER.with(|handler| {
                                    handler.struct_span_err(prop.key.span, &error).emit()
                                });
                            } else {
                                private_map.insert(
                                    prop.key.name.clone(),
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
        let mut vars = Vec::new();
        let mut lets = Vec::new();
        let mut extra_inits = MemberInitRecord::new(self.c);
        let mut private_method_fn_decls = Vec::new();
        let mut members = Vec::new();
        let mut constructor = None;
        let mut used_names = Vec::new();
        let mut used_key_names = Vec::new();
        let mut super_ident = None;

        class.body.visit_mut_with(&mut BrandCheckHandler {
            private: &self.private,
        });

        let should_create_vars_for_method_names = class.body.iter().any(|m| match m {
            ClassMember::Constructor(_)
            | ClassMember::PrivateMethod(_)
            | ClassMember::TsIndexSignature(_)
            | ClassMember::Empty(_) => false,

            ClassMember::Method(m) => contains_super(&m.key),

            ClassMember::ClassProp(_)
            | ClassMember::AutoAccessor(_)
            | ClassMember::PrivateProp(_)
            | ClassMember::StaticBlock(_) => true,
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
                        }) if should_create_vars_for_method_names && !is_literal(&*expr) => {
                            vars.extend(visit_private_in_expr(
                                &mut expr,
                                &self.private,
                                self.c,
                                self.unresolved_mark,
                            ));

                            expr.visit_mut_with(&mut ClassNameTdzFolder {
                                class_name: &class_ident,
                            });
                            let ident = alias_ident_for(&expr, "tmp");
                            // Handle computed property
                            lets.push(VarDeclarator {
                                span: DUMMY_SP,
                                name: ident.clone().into(),
                                init: Some(expr),
                                definite: false,
                            });
                            // We use computed because `classes` pass converts PropName::Ident to
                            // string.
                            PropName::Computed(ComputedPropName {
                                span: c_span,
                                expr: ident.into(),
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

                    match &mut prop.key {
                        PropName::Computed(key) if !is_literal(&key.expr) => {
                            vars.extend(visit_private_in_expr(
                                &mut key.expr,
                                &self.private,
                                self.c,
                                self.unresolved_mark,
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
                            if aliased {
                                // Handle computed property
                                lets.push(VarDeclarator {
                                    span: DUMMY_SP,
                                    name: ident.clone().into(),
                                    init: Some(key.expr.take()),
                                    definite: false,
                                });
                            }
                            *key.expr = ident.into();
                        }
                        _ => (),
                    };

                    let mut value = prop.value.unwrap_or_else(|| Expr::undefined(prop_span));

                    value.visit_mut_with(&mut NewTargetInProp);

                    vars.extend(visit_private_in_expr(
                        &mut value,
                        &self.private,
                        self.c,
                        self.unresolved_mark,
                    ));

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
                                **super_class = AssignExpr {
                                    span,
                                    op: op!("="),
                                    left: ident.into(),
                                    right: super_class.take(),
                                }
                                .into()
                            }
                        }

                        value.visit_mut_with(&mut SuperFieldAccessFolder {
                            class_name: &class_ident,
                            constructor_this_mark: None,
                            is_static: true,
                            folding_constructor: false,
                            in_injected_define_property_call: false,
                            in_nested_scope: false,
                            this_alias_mark: None,
                            constant_super: self.c.constant_super,
                            super_class: &super_ident,
                            in_pat: false,
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
                        format!("_{}", prop.key.name).into(),
                        // We use `self.mark` for private variables.
                        prop.key.span,
                        SyntaxContext::empty().apply_mark(self.private.cur_mark()),
                    );

                    if let Some(value) = &mut prop.value {
                        value.visit_mut_with(&mut NewTargetInProp);

                        if prop.is_static {
                            value.visit_mut_with(&mut SuperFieldAccessFolder {
                                class_name: &class_ident,
                                constructor_this_mark: None,
                                is_static: true,
                                folding_constructor: false,
                                in_injected_define_property_call: false,
                                in_nested_scope: false,
                                this_alias_mark: None,
                                constant_super: self.c.constant_super,
                                super_class: &super_ident,
                                in_pat: false,
                            });
                        }
                        vars.extend(visit_private_in_expr(
                            &mut *value,
                            &self.private,
                            self.c,
                            self.unresolved_mark,
                        ));
                    }

                    prop.value.visit_with(&mut UsedNameCollector {
                        used_names: &mut used_names,
                    });
                    if prop.is_static {
                        prop.value.visit_mut_with(&mut ThisInStaticFolder {
                            ident: class_ident.clone(),
                        });
                    }

                    let value = prop.value.unwrap_or_else(|| Expr::undefined(prop_span));

                    if prop.is_static && prop.key.span.is_placeholder() {
                        let init = MemberInit::StaticBlock(value);
                        extra_inits.push(init);
                        continue;
                    }

                    let init = MemberInit::PrivProp(PrivProp {
                        span: prop_span,
                        name: ident.clone(),
                        value,
                    });
                    let span = PURE_SP;
                    if self.c.private_as_properties {
                        vars.push(VarDeclarator {
                            span: DUMMY_SP,
                            definite: false,
                            name: ident.clone().into(),
                            init: Some(
                                CallExpr {
                                    span,
                                    callee: helper!(class_private_field_loose_key),
                                    args: vec![ident.sym.as_arg()],
                                    ..Default::default()
                                }
                                .into(),
                            ),
                        });
                    } else if !prop.is_static {
                        vars.push(VarDeclarator {
                            span: DUMMY_SP,
                            definite: false,
                            name: ident.into(),
                            init: Some(
                                NewExpr {
                                    span,
                                    callee: Box::new(quote_ident!("WeakMap").into()),
                                    args: Some(Default::default()),
                                    ..Default::default()
                                }
                                .into(),
                            ),
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

                ClassMember::PrivateMethod(mut method) => {
                    let is_static = method.is_static;
                    let prop_span = method.span;

                    let fn_name = Ident::new(
                        match method.kind {
                            MethodKind::Getter => format!("get_{}", method.key.name).into(),
                            MethodKind::Setter => format!("set_{}", method.key.name).into(),
                            MethodKind::Method => {
                                if method.key.name.is_reserved_in_any() {
                                    format!("__{}", method.key.name).into()
                                } else {
                                    method.key.name.clone()
                                }
                            }
                        },
                        method.span,
                        SyntaxContext::empty().apply_mark(self.private.cur_mark()),
                    );

                    let weak_coll_var = Ident::new(
                        format!("_{}", method.key.name).into(),
                        // We use `self.mark` for private variables.
                        method.key.span,
                        SyntaxContext::empty().apply_mark(self.private.cur_mark()),
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
                                Some(IdentName::default())
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
                                Some(Default::default())
                            } else {
                                None
                            }
                        }
                    };

                    if let Some(extra) = extra_collect {
                        let span = PURE_SP;
                        vars.push(VarDeclarator {
                            span: DUMMY_SP,
                            definite: false,
                            name: weak_coll_var.clone().into(),
                            init: Some(Box::new(if self.c.private_as_properties {
                                CallExpr {
                                    span,
                                    callee: helper!(class_private_field_loose_key),
                                    args: vec![weak_coll_var.sym.as_arg()],
                                    ..Default::default()
                                }
                                .into()
                            } else {
                                NewExpr {
                                    span,
                                    callee: extra.into(),
                                    args: Some(Default::default()),
                                    ..Default::default()
                                }
                                .into()
                            })),
                        })
                    };

                    method.function.visit_mut_with(&mut SuperFieldAccessFolder {
                        class_name: &class_ident,
                        constructor_this_mark: None,
                        is_static,
                        folding_constructor: false,
                        in_injected_define_property_call: false,
                        in_nested_scope: false,
                        this_alias_mark: None,
                        constant_super: self.c.constant_super,
                        super_class: &super_ident,
                        in_pat: false,
                    });

                    private_method_fn_decls.push(
                        FnDecl {
                            ident: fn_name,
                            function: method.function,
                            declare: false,
                        }
                        .into(),
                    )
                }

                ClassMember::StaticBlock(..) => {
                    unreachable!("static_blocks pass should remove this")
                }

                ClassMember::AutoAccessor(..) => {
                    unreachable!("auto_accessor pass should remove this")
                }
            }
        }

        let constructor =
            self.process_constructor(class.span, constructor, has_super, constructor_inits);
        if let Some(c) = constructor {
            members.push(ClassMember::Constructor(c));
        }

        private_method_fn_decls.visit_mut_with(&mut PrivateAccessVisitor {
            private: &self.private,
            vars: Vec::new(),
            private_access_type: Default::default(),
            c: self.c,
            unresolved_mark: self.unresolved_mark,
        });

        let mut extra_stmts = extra_inits.into_init_static(class_ident.clone());

        extra_stmts.extend(private_method_fn_decls);

        members.visit_mut_with(&mut PrivateAccessVisitor {
            private: &self.private,
            vars: Vec::new(),
            private_access_type: Default::default(),
            c: self.c,
            unresolved_mark: self.unresolved_mark,
        });

        self.private.pop();

        (
            ClassDecl {
                ident: class_ident,
                declare: false,
                class: Class {
                    body: members,
                    ..*class
                }
                .into(),
            },
            ClassExtra {
                vars,
                lets,
                stmts: extra_stmts,
            },
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
        class_span: Span,
        constructor: Option<Constructor>,
        has_super: bool,
        constructor_exprs: MemberInitRecord,
    ) -> Option<Constructor> {
        let constructor = constructor.or_else(|| {
            if constructor_exprs.record.is_empty() {
                None
            } else {
                Some(default_constructor_with_span(has_super, class_span))
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

#[swc_trace]
impl Visit for ShouldWork {
    noop_visit_type!(fail);

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

// TODO: remove
struct SuperVisitor {
    found: bool,
}

impl Visit for SuperVisitor {
    noop_visit_type!(fail);

    /// Don't recurse into constructor
    fn visit_constructor(&mut self, _: &Constructor) {}

    /// Don't recurse into fn
    fn visit_fn_decl(&mut self, _: &FnDecl) {}

    /// Don't recurse into fn
    fn visit_fn_expr(&mut self, _: &FnExpr) {}

    /// Don't recurse into fn
    fn visit_function(&mut self, _: &Function) {}

    /// Don't recurse into fn
    fn visit_getter_prop(&mut self, n: &GetterProp) {
        n.key.visit_with(self);
    }

    /// Don't recurse into fn
    fn visit_method_prop(&mut self, n: &MethodProp) {
        n.key.visit_with(self);
        n.function.visit_with(self);
    }

    /// Don't recurse into fn
    fn visit_setter_prop(&mut self, n: &SetterProp) {
        n.key.visit_with(self);
        n.param.visit_with(self);
    }

    fn visit_super(&mut self, _: &Super) {
        self.found = true;
    }
}

fn contains_super<N>(body: &N) -> bool
where
    N: VisitWith<SuperVisitor>,
{
    let mut visitor = SuperVisitor { found: false };
    body.visit_with(&mut visitor);
    visitor.found
}
