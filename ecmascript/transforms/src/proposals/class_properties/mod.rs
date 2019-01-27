use self::used_name::{UsedNameCollector, UsedNameRenamer};
use crate::{
    helpers::Helpers,
    pass::Pass,
    util::{
        alias_ident_for, default_constructor, undefined, ExprFactory, ModuleItemLike, StmtLike,
    },
};
use ast::*;
use std::{iter, sync::Arc};
use swc_common::{util::move_map::MoveMap, Fold, FoldWith, Mark, Spanned, VisitWith, DUMMY_SP};

#[cfg(test)]
mod tests;
mod used_name;

///
///
///
///
/// # Impl note
///
/// We use custom helper to handle export defaul class
pub fn class_properties(helpers: Arc<Helpers>) -> impl Pass + Clone {
    ClassProperties {
        helpers,
        mark: Mark::fresh(Mark::root()),
    }
}

#[derive(Clone)]
struct ClassProperties {
    helpers: Arc<Helpers>,
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
                        let decl = decl.fold_children(self);

                        match decl {
                            ModuleDecl::ExportDefaultDecl(ExportDefaultDecl::Class(
                                ClassExpr { ident, class },
                            )) => {
                                let ident = ident.unwrap_or_else(|| private_ident!("_class"));

                                let (vars, decl, stmts) = self.fold_class(ident.clone(), class);
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
                                            span: DUMMY_SP,
                                            specifiers: vec![ExportSpecifier {
                                                span: DUMMY_SP,
                                                orig: ident,
                                                exported: Some(quote_ident!("default")),
                                            }],
                                            src: None,
                                        },
                                    )) {
                                        Ok(t) => t,
                                        Err(..) => unreachable!(),
                                    },
                                );
                            }
                            ModuleDecl::ExportDecl(Decl::Class(ClassDecl {
                                ident,
                                declare: false,
                                class,
                            })) => {
                                let (vars, decl, stmts) = self.fold_class(ident, class);
                                if !vars.is_empty() {
                                    buf.push(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                                        span: DUMMY_SP,
                                        kind: VarDeclKind::Var,
                                        decls: vars,
                                        declare: false,
                                    }))));
                                }
                                buf.push(
                                    match T::try_from_module_decl(ModuleDecl::ExportDecl(decl)) {
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
                    let stmt = stmt.fold_children(self);
                    // Fold class
                    match stmt {
                        Stmt::Decl(Decl::Class(ClassDecl {
                            ident,
                            class,
                            declare: false,
                        })) => {
                            let (vars, decl, stmts) = self.fold_class(ident, class);
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

impl Fold<BlockStmtOrExpr> for ClassProperties {
    fn fold(&mut self, body: BlockStmtOrExpr) -> BlockStmtOrExpr {
        let span = body.span();

        match body {
            BlockStmtOrExpr::Expr(box Expr::Class(ClassExpr { ident, class })) => {
                let mut stmts = vec![];
                let ident = ident.unwrap_or_else(|| private_ident!("_class"));
                let (vars, decl, mut extra_stmts) = self.fold_class(ident.clone(), class);
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
            _ => body.fold_children(self),
        }
    }
}

impl ClassProperties {
    fn fold_class(&mut self, ident: Ident, class: Class) -> (Vec<VarDeclarator>, Decl, Vec<Stmt>) {
        let has_super = class.super_class.is_some();

        let (mut constructor_exprs, mut vars, mut extra_stmts, mut members, mut constructor) =
            (vec![], vec![], vec![], vec![], None);
        let mut used_names = vec![];

        for member in class.body {
            match member {
                ClassMember::PrivateMethod(..) | ClassMember::TsIndexSignature(..) => {
                    members.push(member)
                }

                ClassMember::Method(method) => {
                    // we handle computed key here to preserve the execution order
                    let key = match method.key {
                        PropName::Computed(expr) => {
                            let ident =
                                quote_ident!(DUMMY_SP.apply_mark(Mark::fresh(self.mark)), "tmp");
                            // Handle computed property
                            vars.push(VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(ident.clone()),
                                init: Some(expr),
                                definite: false,
                            });
                            // We use computed because `classes` pass converts PropName::Ident to
                            // string.
                            PropName::Computed(box Expr::Ident(ident))
                        }
                        _ => method.key,
                    };
                    members.push(ClassMember::Method(Method { key, ..method }))
                }

                ClassMember::ClassProp(prop) => {
                    let prop_span = prop.span();
                    let key = match *prop.key {
                        Expr::Ident(ref i) if !prop.computed => Lit::Str(Str {
                            span: i.span,
                            value: i.sym.clone(),
                            has_escape: false,
                        })
                        .as_arg(),
                        Expr::Lit(ref lit) if !prop.computed => lit.clone().as_arg(),

                        _ => {
                            let mut ident = alias_ident_for(&prop.key, "_ref");
                            ident.span = ident.span.apply_mark(Mark::fresh(self.mark));
                            // Handle computed property
                            vars.push(VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(ident.clone()),
                                init: Some(prop.key),
                                definite: false,
                            });
                            ident.as_arg()
                        }
                    };
                    prop.value.visit_with(&mut UsedNameCollector {
                        used_names: &mut used_names,
                    });
                    let value = prop.value.unwrap_or_else(|| undefined(prop_span)).as_arg();

                    self.helpers.define_property();
                    let callee = quote_ident!(DUMMY_SP, "_defineProperty").as_callee();

                    if prop.is_static {
                        extra_stmts.push(Stmt::Expr(box Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee,
                            args: vec![ident.clone().as_arg(), key, value],
                            type_args: Default::default(),
                        })))
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
                    prop.value.visit_with(&mut UsedNameCollector {
                        used_names: &mut used_names,
                    });
                    let value = prop.value.unwrap_or_else(|| undefined(prop_span));

                    if prop.is_static {
                        extra_stmts.push(Stmt::Decl(Decl::Var(VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Var,
                            declare: false,
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                definite: false,
                                name: Pat::Ident(ident.clone()),
                                init: Some(if prop.is_static {
                                    box Expr::New(NewExpr {
                                        span: DUMMY_SP,
                                        callee: box Expr::Ident(quote_ident!("WeakMap")),
                                        args: Some(vec![]),
                                        type_args: Default::default(),
                                    })
                                } else {
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
                                }),
                            }],
                        })));
                    //TODO: constructor_exprs.push()
                    } else {

                    }
                }

                ClassMember::Constructor(c) => constructor = Some(c),
            }
        }

        let mut constructor = constructor
            .map(|c| {
                let mut folder = UsedNameRenamer {
                    mark: Mark::fresh(Mark::root()),
                    used_names: &used_names,
                };

                // Handle collisions
                let body = c.body.fold_with(&mut folder);
                let params = c.params.fold_with(&mut folder);
                Constructor { body, params, ..c }
            })
            .unwrap_or_else(|| default_constructor(has_super));

        {
            // Allow using super multiple time
            let mut folder = DefinePropertyInjector {
                constructor_exprs: &constructor_exprs,
                injected: false,
            };
            constructor.body = constructor.body.fold_with(&mut folder);

            if !folder.injected {
                // there was no super() call
                constructor
                    .body
                    .as_mut()
                    .unwrap()
                    .stmts
                    .extend(constructor_exprs.into_iter().map(Stmt::Expr))
            }
        }

        members.push(ClassMember::Constructor(constructor));

        (
            vars,
            Decl::Class(ClassDecl {
                ident: ident.clone(),
                declare: false,
                class: Class {
                    body: members,
                    ..class
                },
            }),
            extra_stmts,
        )
    }
}

struct DefinePropertyInjector<'a> {
    injected: bool,
    constructor_exprs: &'a [Box<Expr>],
}

impl<'a> Fold<Vec<Stmt>> for DefinePropertyInjector<'a> {
    fn fold(&mut self, stmts: Vec<Stmt>) -> Vec<Stmt> {
        if self.constructor_exprs.is_empty() {
            return stmts;
        }

        stmts.move_flat_map(|stmt| match stmt {
            Stmt::Expr(box Expr::Call(CallExpr {
                callee: ExprOrSuper::Super(..),
                ..
            })) => {
                self.injected = true;
                None.into_iter()
                    .chain(iter::once(stmt))
                    .chain(self.constructor_exprs.iter().cloned().map(Stmt::Expr))
            }
            _ => {
                let mut folder = DefinePropertyInjector {
                    injected: false,
                    constructor_exprs: self.constructor_exprs,
                };
                let stmt = stmt.fold_children(&mut folder);
                self.injected |= folder.injected;
                if folder.injected {
                    None.into_iter()
                        .chain(iter::once(stmt))
                        .chain((&[]).iter().cloned().map(Stmt::Expr))
                } else {
                    let mut folder = ExprDefinePropertyInjector {
                        injected: false,
                        constructor_exprs: self.constructor_exprs,
                        injected_tmp: None,
                    };
                    let stmt = stmt.fold_with(&mut folder);

                    self.injected |= folder.injected;
                    let iter = folder
                        .injected_tmp
                        .map(|ident| {
                            Stmt::Decl(Decl::Var(VarDecl {
                                span: DUMMY_SP,
                                kind: VarDeclKind::Var,
                                decls: vec![VarDeclarator {
                                    span: DUMMY_SP,
                                    name: Pat::Ident(ident),
                                    init: None,
                                    definite: false,
                                }],
                                declare: false,
                            }))
                        })
                        .into_iter()
                        .chain(iter::once(stmt))
                        .chain((&[]).iter().cloned().map(Stmt::Expr));

                    iter
                }
            }
        })
    }
}

macro_rules! fold_noop {
    ($T:tt) => {
        impl<'a> Fold<$T> for DefinePropertyInjector<'a> {
            fn fold(&mut self, n: $T) -> $T {
                n
            }
        }
    };
}
fold_noop!(Function);
fold_noop!(Class);

/// Handles code like `foo(super())`
struct ExprDefinePropertyInjector<'a> {
    injected: bool,
    constructor_exprs: &'a [Box<Expr>],
    injected_tmp: Option<Ident>,
}

impl<'a> Fold<Expr> for ExprDefinePropertyInjector<'a> {
    fn fold(&mut self, expr: Expr) -> Expr {
        let expr = expr.fold_children(self);

        match expr {
            Expr::Call(CallExpr {
                callee: ExprOrSuper::Super(..),
                ..
            }) => {
                self.injected_tmp = Some(
                    self.injected_tmp
                        .take()
                        .unwrap_or_else(|| private_ident!("_temp")),
                );
                self.injected = true;

                Expr::Seq(SeqExpr {
                    span: DUMMY_SP,
                    exprs: iter::once(box Expr::Assign(AssignExpr {
                        span: DUMMY_SP,
                        left: PatOrExpr::Pat(box Pat::Ident(
                            self.injected_tmp.as_ref().cloned().unwrap(),
                        )),
                        op: op!("="),
                        right: box expr,
                    }))
                    .chain(self.constructor_exprs.iter().cloned())
                    .chain(iter::once(box Expr::Ident(
                        self.injected_tmp.as_ref().cloned().unwrap(),
                    )))
                    .collect(),
                })
            }
            _ => expr,
        }
    }
}
