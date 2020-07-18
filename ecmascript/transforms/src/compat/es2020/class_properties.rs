use self::{
    class_name_tdz::ClassNameTdzFolder,
    private_field::FieldAccessFolder,
    this_in_static::ThisInStaticFolder,
    used_name::{UsedNameCollector, UsedNameRenamer},
};
use crate::{
    compat::es2015::classes::SuperFieldAccessFolder,
    util::{
        alias_ident_for, alias_if_required, constructor::inject_after_super, default_constructor,
        undefined, ExprFactory, ModuleItemLike, StmtLike,
    },
};
use std::collections::HashSet;
use swc_atoms::JsWord;
use swc_common::{Mark, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_visit::{Fold, FoldWith};

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
/// We use custom helper to handle export defaul class
pub fn class_properties() -> impl Fold {
    ClassProperties { mark: Mark::root() }
}

#[derive(Clone)]
struct ClassProperties {
    mark: Mark,
}

impl<T> Fold<Vec<T>> for ClassProperties
where
    T: StmtLike + ModuleItemLike + FoldWith<Self>,
{
    fn fold(&mut self, stmts: Vec<T>) -> Vec<T> {
        let mut buf = Vec::with_capacity(stmts.len());

        for stmt in stmts {
            match T::try_into_stmt(stmt) {
                Err(node) => match node.try_into_module_decl() {
                    Ok(decl) => {
                        let decl = decl.fold_children_with(self);

                        match decl {
                            ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                                span,
                                decl: DefaultDecl::Class(ClassExpr { ident, class }),
                                ..
                            }) => {
                                let ident = ident.unwrap_or_else(|| private_ident!("_class"));

                                let (vars, decl, stmts) =
                                    self.fold_class_as_decl(ident.clone(), class);
                                if !vars.is_empty() {
                                    buf.push(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                                        span: DUMMY_SP,
                                        kind: VarDeclKind::Var,
                                        decls: vars,
                                        declare: false,
                                    }))));
                                }
                                buf.push(T::from_stmt(Stmt::Decl(decl)));
                                buf.extend(stmts.into_iter().map(T::from_stmt));
                                buf.push(
                                    match T::try_from_module_decl(ModuleDecl::ExportNamed(
                                        NamedExport {
                                            span,
                                            specifiers: vec![ExportNamedSpecifier {
                                                span: DUMMY_SP,
                                                orig: ident,
                                                exported: Some(private_ident!("default")),
                                            }
                                            .into()],
                                            src: None,
                                            type_only: false,
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
                                let (vars, decl, stmts) = self.fold_class_as_decl(ident, class);
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
                                        ExportDecl { span, decl },
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
                Ok(stmt) => {
                    let stmt = stmt.fold_children_with(self);
                    // Fold class
                    match stmt {
                        Stmt::Decl(Decl::Class(ClassDecl {
                            ident,
                            class,
                            declare: false,
                        })) => {
                            let (vars, decl, stmts) = self.fold_class_as_decl(ident, class);
                            if !vars.is_empty() {
                                buf.push(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                                    span: DUMMY_SP,
                                    kind: VarDeclKind::Var,
                                    decls: vars,
                                    declare: false,
                                }))));
                            }
                            buf.push(T::from_stmt(Stmt::Decl(decl)));
                            buf.extend(stmts.into_iter().map(T::from_stmt));
                        }
                        _ => buf.push(T::from_stmt(stmt)),
                    }
                }
            }
        }

        buf
    }
}

impl Fold for ClassProperties {
    fn fold_expr(&mut self, expr: Expr) -> Expr {
        let expr = expr.fold_children_with(self);

        match expr {
            // TODO(kdy1): Make it generate smaller code.
            //
            // We currently creates a iife for a class expression.
            // Although this results in a large code, but it's ok as class expression is rarely used
            // in wild.
            Expr::Class(ClassExpr { ident, class }) => {
                let ident = ident.unwrap_or_else(|| private_ident!("_class"));
                let mut stmts = vec![];
                let (vars, decl, mut extra_stmts) = self.fold_class_as_decl(ident.clone(), class);

                if !vars.is_empty() {
                    stmts.push(Stmt::Decl(Decl::Var(VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        decls: vars,
                        declare: false,
                    })));
                }
                stmts.push(Stmt::Decl(decl));
                stmts.append(&mut extra_stmts);

                stmts.push(Stmt::Return(ReturnStmt {
                    span: DUMMY_SP,
                    arg: Some(box Expr::Ident(ident)),
                }));

                Expr::Call(CallExpr {
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
                })
            }
            _ => expr,
        }
    }

    fn fold_block_stmt_or_expr(&mut self, body: BlockStmtOrExpr) -> BlockStmtOrExpr {
        let span = body.span();

        match body {
            BlockStmtOrExpr::Expr(box Expr::Class(ClassExpr { ident, class })) => {
                let mut stmts = vec![];
                let ident = ident.unwrap_or_else(|| private_ident!("_class"));
                let (vars, decl, mut extra_stmts) = self.fold_class_as_decl(ident.clone(), class);
                if !vars.is_empty() {
                    stmts.push(Stmt::Decl(Decl::Var(VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        decls: vars,
                        declare: false,
                    })));
                }
                stmts.push(Stmt::Decl(decl));
                stmts.append(&mut extra_stmts);
                stmts.push(Stmt::Return(ReturnStmt {
                    span: DUMMY_SP,
                    arg: Some(box Expr::Ident(ident)),
                }));

                BlockStmtOrExpr::BlockStmt(BlockStmt { span, stmts })
            }
            _ => body.fold_children_with(self),
        }
    }
}

impl ClassProperties {
    fn fold_class_as_decl(
        &mut self,
        ident: Ident,
        class: Class,
    ) -> (Vec<VarDeclarator>, Decl, Vec<Stmt>) {
        // Create one mark per class
        self.mark = Mark::fresh(Mark::root());

        let has_super = class.super_class.is_some();

        let (mut constructor_exprs, mut vars, mut extra_stmts, mut members, mut constructor) =
            (vec![], vec![], vec![], vec![], None);
        let mut used_names = vec![];
        let mut used_key_names = vec![];
        let mut statics = HashSet::default();

        for member in class.body {
            match member {
                ClassMember::PrivateMethod(..)
                | ClassMember::Empty(..)
                | ClassMember::TsIndexSignature(..) => members.push(member),

                ClassMember::Method(method) => {
                    // we handle computed key here to preserve the execution order
                    let key = match method.key {
                        PropName::Computed(ComputedPropName { span: c_span, expr }) => {
                            let expr =
                                expr.fold_with(&mut ClassNameTdzFolder { class_name: &ident });
                            let ident = private_ident!("tmp");
                            // Handle computed property
                            vars.push(VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(ident.clone()),
                                init: Some(expr),
                                definite: false,
                            });
                            // We use computed because `classes` pass converts PropName::Ident to
                            // string.
                            PropName::Computed(ComputedPropName {
                                span: c_span,
                                expr: box Expr::Ident(ident),
                            })
                        }
                        _ => method.key,
                    };
                    members.push(ClassMember::Method(ClassMethod { key, ..method }))
                }

                ClassMember::ClassProp(mut prop) => {
                    let prop_span = prop.span();
                    prop.key = prop
                        .key
                        .fold_with(&mut ClassNameTdzFolder { class_name: &ident });

                    if !prop.is_static {
                        prop.key.visit_with(&mut UsedNameCollector {
                            used_names: &mut used_key_names,
                        });

                        prop.value.visit_with(&mut UsedNameCollector {
                            used_names: &mut used_names,
                        });
                    }

                    let key = match *prop.key {
                        Expr::Ident(ref i) if !prop.computed => Lit::Str(Str {
                            span: i.span,
                            value: i.sym.clone(),
                            has_escape: false,
                        })
                        .as_arg(),
                        Expr::Lit(ref lit) if !prop.computed => lit.clone().as_arg(),

                        _ => {
                            let (ident, aliased) = if let Expr::Ident(ref i) = *prop.key {
                                if used_key_names.contains(&i.sym) {
                                    (alias_ident_for(&prop.key, "_ref"), true)
                                } else {
                                    alias_if_required(&prop.key, "_ref")
                                }
                            } else {
                                alias_if_required(&prop.key, "_ref")
                            };
                            // ident.span = ident.span.apply_mark(Mark::fresh(Mark::root()));
                            if aliased {
                                // Handle computed property
                                vars.push(VarDeclarator {
                                    span: DUMMY_SP,
                                    name: Pat::Ident(ident.clone()),
                                    init: Some(prop.key),
                                    definite: false,
                                });
                            }
                            ident.as_arg()
                        }
                    };

                    let value = prop.value.unwrap_or_else(|| undefined(prop_span)).as_arg();

                    let callee = helper!(define_property, "defineProperty");

                    if prop.is_static {
                        extra_stmts.push(
                            CallExpr {
                                span: DUMMY_SP,
                                callee,
                                args: vec![
                                    ident.clone().as_arg(),
                                    key,
                                    value
                                        .fold_with(&mut SuperFieldAccessFolder {
                                            class_name: &ident,
                                            vars: &mut vars,
                                            constructor_this_mark: None,
                                            is_static: true,
                                            folding_constructor: false,
                                            in_injected_define_property_call: false,
                                            in_nested_scope: false,
                                            this_alias_mark: None,
                                        })
                                        .fold_with(&mut ThisInStaticFolder {
                                            ident: ident.clone(),
                                        }),
                                ],
                                type_args: Default::default(),
                            }
                            .into_stmt(),
                        )
                    } else {
                        constructor_exprs.push(box Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee,
                            args: vec![ThisExpr { span: DUMMY_SP }.as_arg(), key, value],
                            type_args: Default::default(),
                        }));
                    }
                }
                ClassMember::PrivateProp(prop) => {
                    let prop_span = prop.span();
                    if prop.is_static {
                        statics.insert(prop.key.id.sym.clone());
                    }

                    let ident = Ident::new(
                        format!("_{}", prop.key.id.sym).into(),
                        // We use `self.mark` for private variables.
                        prop.key.span.apply_mark(self.mark),
                    );
                    prop.value.visit_with(&mut UsedNameCollector {
                        used_names: &mut used_names,
                    });
                    let value = prop.value.unwrap_or_else(|| undefined(prop_span));

                    let extra_init = if prop.is_static {
                        box Expr::Object(ObjectLit {
                            span: DUMMY_SP,
                            props: vec![
                                PropOrSpread::Prop(box Prop::KeyValue(KeyValueProp {
                                    key: PropName::Ident(quote_ident!("writable")),
                                    value: box Expr::Lit(Lit::Bool(Bool {
                                        span: DUMMY_SP,
                                        value: true,
                                    })),
                                })),
                                PropOrSpread::Prop(box Prop::KeyValue(KeyValueProp {
                                    key: PropName::Ident(quote_ident!("value")),
                                    value,
                                })),
                            ],
                        })
                    } else {
                        constructor_exprs.push(box Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: ident.clone().member(quote_ident!("set")).as_callee(),
                            args: vec![
                                ThisExpr { span: DUMMY_SP }.as_arg(),
                                ObjectLit {
                                    span: DUMMY_SP,
                                    props: vec![
                                        // writeable: true
                                        PropOrSpread::Prop(box Prop::KeyValue(KeyValueProp {
                                            key: PropName::Ident(quote_ident!("writable")),
                                            value: box Expr::Lit(Lit::Bool(Bool {
                                                value: true,
                                                span: DUMMY_SP,
                                            })),
                                        })),
                                        // value: value,
                                        PropOrSpread::Prop(box Prop::KeyValue(KeyValueProp {
                                            key: PropName::Ident(quote_ident!("value")),
                                            value,
                                        })),
                                    ],
                                }
                                .as_arg(),
                            ],
                            type_args: Default::default(),
                        }));

                        box Expr::New(NewExpr {
                            span: DUMMY_SP,
                            callee: box Expr::Ident(quote_ident!("WeakMap")),
                            args: Some(vec![]),
                            type_args: Default::default(),
                        })
                    };

                    extra_stmts.push(Stmt::Decl(Decl::Var(VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        declare: false,
                        decls: vec![VarDeclarator {
                            span: DUMMY_SP,
                            definite: false,
                            name: Pat::Ident(ident.clone()),
                            init: Some(extra_init),
                        }],
                    })));
                }

                ClassMember::Constructor(c) => constructor = Some(c),
            }
        }

        let constructor =
            self.process_constructor(constructor, has_super, &used_names, constructor_exprs);
        if let Some(c) = constructor {
            members.push(ClassMember::Constructor(c));
        }

        let members = members.fold_with(&mut FieldAccessFolder {
            mark: self.mark,
            statics: &statics,
            vars: vec![],
            class_name: &ident,
            in_assign_pat: false,
        });

        (
            vars,
            Decl::Class(ClassDecl {
                ident,
                declare: false,
                class: Class {
                    body: members,
                    ..class
                },
            }),
            extra_stmts,
        )
    }

    #[allow(clippy::vec_box)]
    fn process_constructor(
        &mut self,
        constructor: Option<Constructor>,
        has_super: bool,
        used_names: &[JsWord],
        constructor_exprs: Vec<Box<Expr>>,
    ) -> Option<Constructor> {
        let constructor = constructor
            .map(|c| {
                let mut folder = UsedNameRenamer {
                    mark: Mark::fresh(Mark::root()),
                    used_names,
                };

                // Handle collisions
                let body = c.body.fold_with(&mut folder);
                let params = c.params.fold_with(&mut folder);
                Constructor { body, params, ..c }
            })
            .or_else(|| {
                if constructor_exprs.is_empty() {
                    None
                } else {
                    Some(default_constructor(has_super))
                }
            });

        if let Some(c) = constructor {
            Some(inject_after_super(c, constructor_exprs))
        } else {
            None
        }
    }
}
