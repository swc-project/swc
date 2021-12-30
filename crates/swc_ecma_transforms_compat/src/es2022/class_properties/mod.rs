#![allow(dead_code)]

use self::{
    class_name_tdz::ClassNameTdzFolder,
    private_field::{BrandCheckHandler, FieldAccessFolder},
    this_in_static::ThisInStaticFolder,
    used_name::UsedNameCollector,
};
use std::collections::HashSet;
use swc_common::{util::take::Take, Mark, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{helper, perf::Check};
use swc_ecma_transforms_classes::super_field::SuperFieldAccessFolder;
use swc_ecma_transforms_macros::fast_path;
use swc_ecma_utils::{
    alias_ident_for, alias_if_required, constructor::inject_after_super, default_constructor,
    private_ident, quote_ident, undefined, ExprFactory, ModuleItemLike, StmtLike,
};
use swc_ecma_visit::{
    as_folder, noop_visit_mut_type, noop_visit_type, Fold, Visit, VisitMut, VisitMutWith, VisitWith,
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
        mark: Mark::root(),
        method_mark: Mark::root(),
    })
}

#[derive(Debug, Clone, Default)]
pub struct Config {
    pub loose: bool,
}

#[derive(Clone)]
struct ClassProperties {
    config: Config,
    mark: Mark,
    method_mark: Mark,
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
        expr.visit_mut_children_with(self);

        match expr {
            // TODO(kdy1): Make it generate smaller code.
            //
            // We currently creates a iife for a class expression.
            // Although this results in a large code, but it's ok as class expression is rarely used
            // in wild.
            Expr::Class(ClassExpr { ident, class }) => {
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
            }
            _ => {}
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
                        decl.visit_mut_children_with(self);

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
                                                orig: ident,
                                                exported: Some(private_ident!("default")),
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
                            _ => buf.push(match T::try_from_module_decl(decl) {
                                Ok(t) => t,
                                Err(..) => unreachable!(),
                            }),
                        };
                    }
                    Err(..) => unreachable!(),
                },
                Ok(mut stmt) => {
                    stmt.visit_mut_children_with(self);
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
                        _ => buf.push(T::from_stmt(stmt)),
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
        self.mark = Mark::fresh(Mark::root());
        self.method_mark = Mark::fresh(Mark::root());

        let has_super = class.super_class.is_some();

        let mut typescript_constructor_properties = vec![];

        let mut constructor_exprs = vec![];
        let mut vars = vec![];
        let mut extra_stmts = vec![];
        let mut private_method_fn_decls = vec![];
        let mut members = vec![];
        let mut constructor = None;
        let mut used_names = vec![];
        let mut used_key_names = vec![];
        let mut names_used_for_brand_checks = HashSet::default();

        let statics = {
            let mut s = HashSet::default();

            for member in &class.body {
                match member {
                    ClassMember::PrivateMethod(method) => {
                        if method.is_static {
                            s.insert(method.key.id.sym.clone());
                        }
                    }

                    ClassMember::PrivateProp(prop) => {
                        if prop.is_static {
                            s.insert(prop.key.id.sym.clone());
                        }
                    }

                    _ => {}
                }
            }

            s
        };
        let private_methods = {
            let mut s = HashSet::default();

            for member in &class.body {
                match member {
                    ClassMember::PrivateMethod(method) => {
                        s.insert(method.key.id.sym.clone());
                    }

                    _ => {}
                }
            }

            s
        };

        class.body.visit_mut_with(&mut BrandCheckHandler {
            mark: self.mark,
            class_name: &class_ident,
            names: &mut names_used_for_brand_checks,
            statics: &statics,
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
                            expr.visit_mut_with(&mut ClassNameTdzFolder {
                                class_name: &class_ident,
                            });
                            let ident = private_ident!("tmp");
                            // Handle computed property
                            vars.push(VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(ident.clone().into()),
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
                        PropName::Ident(ref i) => Box::new(Expr::from(Lit::Str(Str {
                            span: i.span,
                            value: i.sym.clone(),
                            has_escape: false,
                            kind: StrKind::Normal {
                                contains_quote: false,
                            },
                        }))),
                        PropName::Num(ref num) => Box::new(Expr::from(num.clone())),
                        PropName::Str(ref str) => Box::new(Expr::from(str.clone())),
                        PropName::BigInt(ref big_int) => Box::new(Expr::from(big_int.clone())),

                        PropName::Computed(key) => {
                            let (ident, aliased) = if let Expr::Ident(ref i) = *key.expr {
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
                                    name: Pat::Ident(ident.clone().into()),
                                    init: Some(key.expr),
                                    definite: false,
                                });
                            }
                            Box::new(Expr::from(ident))
                        }
                    };

                    let mut value = prop.value.unwrap_or_else(|| undefined(prop_span));
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
                        });
                        value.visit_mut_with(&mut ThisInStaticFolder {
                            ident: class_ident.clone(),
                        });
                    }

                    let callee = helper!(define_property, "defineProperty");

                    if prop.is_static {
                        extra_stmts.push(
                            CallExpr {
                                span: DUMMY_SP,
                                callee,
                                args: vec![
                                    class_ident.clone().as_arg(),
                                    key.as_arg(),
                                    value.as_arg(),
                                ],
                                type_args: Default::default(),
                            }
                            .into_stmt(),
                        )
                    } else {
                        constructor_exprs.push(Box::new(Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee,
                            args: vec![
                                ThisExpr { span: DUMMY_SP }.as_arg(),
                                key.as_arg(),
                                value.as_arg(),
                            ],
                            type_args: Default::default(),
                        })));
                    }
                }
                ClassMember::PrivateProp(mut prop) => {
                    let prop_span = prop.span();

                    let ident = Ident::new(
                        format!("_{}", prop.key.id.sym).into(),
                        // We use `self.mark` for private variables.
                        prop.key.span.apply_mark(self.mark),
                    );
                    prop.value.visit_with(&mut UsedNameCollector {
                        used_names: &mut used_names,
                    });
                    if prop.is_static {
                        prop.value.visit_mut_with(&mut ThisInStaticFolder {
                            ident: class_ident.clone(),
                        });
                    }

                    let value = prop.value.unwrap_or_else(|| undefined(prop_span));

                    let extra_init = if prop.is_static {
                        Box::new(Expr::Object(ObjectLit {
                            span: DUMMY_SP,
                            props: vec![
                                PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                                    key: PropName::Ident(quote_ident!("writable")),
                                    value: Box::new(Expr::Lit(Lit::Bool(Bool {
                                        span: DUMMY_SP,
                                        value: true,
                                    }))),
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
                            callee: ident.clone().make_member(quote_ident!("set")).as_callee(),
                            args: vec![
                                ThisExpr { span: DUMMY_SP }.as_arg(),
                                ObjectLit {
                                    span: DUMMY_SP,
                                    props: vec![
                                        // writeable: true
                                        PropOrSpread::Prop(Box::new(Prop::KeyValue(
                                            KeyValueProp {
                                                key: PropName::Ident(quote_ident!("writable")),
                                                value: Box::new(Expr::Lit(Lit::Bool(Bool {
                                                    value: true,
                                                    span: DUMMY_SP,
                                                }))),
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

                        Box::new(Expr::New(NewExpr {
                            span: DUMMY_SP,
                            callee: Box::new(Expr::Ident(quote_ident!("WeakMap"))),
                            args: Some(vec![]),
                            type_args: Default::default(),
                        }))
                    };

                    extra_stmts.push(Stmt::Decl(Decl::Var(VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        declare: false,
                        decls: vec![VarDeclarator {
                            span: DUMMY_SP,
                            definite: false,
                            name: Pat::Ident(ident.clone().into()),
                            init: Some(extra_init),
                        }],
                    })));
                }

                ClassMember::Constructor(c) => {
                    constructor = Some(c);
                }

                ClassMember::PrivateMethod(method) => {
                    let prop_span = method.span;
                    let fn_name = Ident::new(
                        method.key.id.sym.clone(),
                        method
                            .span
                            .with_ctxt(SyntaxContext::empty())
                            .apply_mark(self.method_mark),
                    );

                    let should_use_map =
                        matches!(method.kind, MethodKind::Getter | MethodKind::Setter)
                            && names_used_for_brand_checks.contains(&method.key.id.sym)
                            && !statics.contains(&method.key.id.sym);

                    let weak_coll_var = Ident::new(
                        format!("_{}", method.key.id.sym).into(),
                        // We use `self.mark` for private variables.
                        method.key.span.apply_mark(self.mark),
                    );
                    method.function.visit_with(&mut UsedNameCollector {
                        used_names: &mut used_names,
                    });

                    if should_use_map || !statics.contains(&method.key.id.sym) {
                        vars.push(VarDeclarator {
                            span: DUMMY_SP,
                            definite: false,
                            name: Pat::Ident(weak_coll_var.clone().into()),
                            init: Some(Box::new(Expr::from(NewExpr {
                                span: DUMMY_SP,
                                callee: if should_use_map {
                                    Box::new(Expr::Ident(quote_ident!("WeakMap")))
                                } else {
                                    Box::new(Expr::Ident(quote_ident!("WeakSet")))
                                },
                                args: Some(Default::default()),
                                type_args: Default::default(),
                            }))),
                        });
                    }

                    if should_use_map {
                        let get = PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                            key: PropName::Ident(quote_ident!("get")),
                            value: Box::new(Expr::Ident(fn_name.clone())),
                        })));
                        let set = PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                            key: PropName::Ident(quote_ident!("set")),
                            value: undefined(DUMMY_SP),
                        })));

                        let obj = ObjectLit {
                            span: DUMMY_SP,
                            props: vec![get, set],
                        };

                        let obj = if statics.contains(&method.key.id.sym) {
                            let var_name = private_ident!("static_method");

                            vars.push(VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(var_name.clone().into()),
                                init: Some(Box::new(Expr::Object(obj))),
                                definite: Default::default(),
                            });

                            var_name.as_arg()
                        } else {
                            obj.as_arg()
                        };

                        constructor_exprs.push(Box::new(Expr::Call(CallExpr {
                            span: prop_span,
                            callee: weak_coll_var
                                .clone()
                                .make_member(quote_ident!("set"))
                                .as_callee(),
                            args: vec![ThisExpr { span: DUMMY_SP }.as_arg(), obj],
                            type_args: Default::default(),
                        })));
                    } else if !statics.contains(&method.key.id.sym) {
                        // Add `_get.add(this);` to the constructor where `_get` is the name of the
                        // weak set.
                        constructor_exprs.push(Box::new(Expr::Call(CallExpr {
                            span: prop_span,
                            callee: weak_coll_var
                                .clone()
                                .make_member(quote_ident!("add"))
                                .as_callee(),
                            args: vec![ThisExpr { span: DUMMY_SP }.as_arg()],
                            type_args: Default::default(),
                        })));
                    }

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

        let constructor_exprs = {
            typescript_constructor_properties.extend(constructor_exprs);
            typescript_constructor_properties
        };

        let constructor = self.process_constructor(constructor, has_super, constructor_exprs);
        if let Some(c) = constructor {
            members.push(ClassMember::Constructor(c));
        }

        private_method_fn_decls.visit_mut_with(&mut FieldAccessFolder {
            mark: self.mark,
            method_mark: self.method_mark,
            private_methods: &private_methods,
            statics: &statics,
            vars: vec![],
            class_name: &class_ident,
            in_assign_pat: false,
        });

        extra_stmts.extend(private_method_fn_decls);

        members.visit_mut_with(&mut FieldAccessFolder {
            mark: self.mark,
            method_mark: self.method_mark,
            private_methods: &private_methods,
            statics: &statics,
            vars: vec![],
            class_name: &class_ident,
            in_assign_pat: false,
        });

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
        constructor_exprs: Vec<Box<Expr>>,
    ) -> Option<Constructor> {
        let constructor = constructor.or_else(|| {
            if constructor_exprs.is_empty() {
                None
            } else {
                Some(default_constructor(has_super))
            }
        });

        if let Some(mut c) = constructor {
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
