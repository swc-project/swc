use std::{iter, mem};

use metadata::remove_span;
use swc_atoms::JsWord;
use swc_common::{collections::AHashMap, util::take::Take, BytePos, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{private_ident, prop_name_to_expr_value, quote_ident, ExprFactory, StmtLike};
use swc_ecma_visit::{Visit, VisitMut, VisitMutWith, VisitWith};

use self::metadata::{Metadata, ParamMetadata};
use super::contains_decorator;

mod metadata;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum EnumKind {
    Mixed,
    Str,
    Num,
}

pub(super) fn new(metadata: bool) -> TscDecorator {
    TscDecorator {
        metadata,
        enums: Default::default(),
        vars: Default::default(),
        appended_exprs: Default::default(),
        appended_private_access_exprs: Default::default(),
        prepended_exprs: Default::default(),
        class_name: Default::default(),

        assign_class_expr_to: Default::default(),
    }
}

pub(super) struct TscDecorator {
    metadata: bool,

    enums: AHashMap<JsWord, EnumKind>,

    /// Used for computed keys, and this variables are not initialized.
    vars: Vec<VarDeclarator>,
    appended_exprs: Vec<Box<Expr>>,
    appended_private_access_exprs: Vec<Box<Expr>>,
    prepended_exprs: Vec<Box<Expr>>,

    class_name: Option<Ident>,

    assign_class_expr_to: Option<Ident>,
}

impl TscDecorator {
    fn visit_mut_stmt_likes<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike + VisitMutWith<Self>,
    {
        let old_vars = self.vars.take();
        let old_appended_exprs = self.appended_exprs.take();
        let old_prepended_exprs = self.prepended_exprs.take();

        let mut new = Vec::new();

        for mut s in stmts.take() {
            debug_assert!(self.appended_exprs.is_empty());

            s.visit_mut_with(self);

            if !self.vars.is_empty() {
                new.push(T::from(
                    VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        declare: Default::default(),
                        decls: self.vars.take(),
                        ..Default::default()
                    }
                    .into(),
                ));
            }

            new.extend(
                self.prepended_exprs
                    .drain(..)
                    .map(|expr| {
                        ExprStmt {
                            span: DUMMY_SP,
                            expr,
                        }
                        .into()
                    })
                    .map(T::from),
            );

            new.push(s);

            new.extend(
                self.appended_exprs
                    .drain(..)
                    .map(|expr| {
                        ExprStmt {
                            span: DUMMY_SP,
                            expr,
                        }
                        .into()
                    })
                    .map(T::from),
            );
        }

        *stmts = new;

        self.prepended_exprs = old_prepended_exprs;
        self.appended_exprs = old_appended_exprs;
        self.vars = old_vars;
    }

    fn key(&mut self, k: &mut PropName) -> Expr {
        match k {
            PropName::Computed(k) if !k.expr.is_lit() => {
                let var_name = private_ident!(k.span, "_key");

                // Declare var
                self.vars.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: var_name.clone().into(),
                    init: None,
                    definite: Default::default(),
                });

                // Initialize var
                self.prepended_exprs.push(
                    AssignExpr {
                        span: DUMMY_SP,
                        op: op!("="),
                        left: var_name.clone().into(),
                        right: k.expr.take(),
                    }
                    .into(),
                );

                k.expr = var_name.clone().into();

                return var_name.into();
            }
            PropName::Ident(i) => {
                return Lit::Str(Str {
                    span: DUMMY_SP,
                    raw: None,
                    value: i.sym.clone(),
                })
                .into()
            }
            _ => {}
        }

        prop_name_to_expr_value(k.clone())
    }

    fn has_private_access(mut expr: &Expr) -> bool {
        while let Some(MemberExpr { obj, prop, .. }) = expr.as_member() {
            if prop.is_private_name() {
                return true;
            }
            expr = obj;
        }

        false
    }

    /// Creates `__decorate` calls.
    fn add_decorate_call(
        &mut self,
        decorators: impl IntoIterator<Item = Box<Expr>>,
        mut target: ExprOrSpread,
        key: ExprOrSpread,
        mut desc: ExprOrSpread,
    ) {
        let mut has_private_access = false;
        let decorators = ArrayLit {
            span: DUMMY_SP,
            elems: decorators
                .into_iter()
                .inspect(|e| {
                    if has_private_access {
                        return;
                    }
                    has_private_access = Self::has_private_access(e);
                })
                .map(|mut v| {
                    remove_span(&mut v);

                    v.as_arg()
                })
                .map(Some)
                .collect(),
        }
        .as_arg();

        remove_span(&mut target.expr);
        remove_span(&mut desc.expr);

        let expr = CallExpr {
            callee: helper!(ts, ts_decorate),
            args: vec![decorators, target, key, desc],
            ..Default::default()
        }
        .into();

        if has_private_access {
            self.appended_private_access_exprs.push(expr);
        } else {
            self.appended_exprs.push(expr);
        }
    }
}

impl Visit for TscDecorator {
    fn visit_ts_enum_decl(&mut self, e: &TsEnumDecl) {
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
                    Some(a)
                } else {
                    Some(EnumKind::Mixed)
                }
            });
        if let Some(kind) = enum_kind {
            self.enums.insert(e.id.sym.clone(), kind);
        }
    }
}

impl VisitMut for TscDecorator {
    fn visit_mut_class(&mut self, n: &mut Class) {
        let appended_private = self.appended_private_access_exprs.take();

        n.visit_mut_with(&mut ParamMetadata);

        if self.metadata {
            let i = self.class_name.clone();

            n.visit_mut_with(&mut Metadata::new(&self.enums, i.as_ref()));
        }

        n.visit_mut_children_with(self);

        let appended_private =
            mem::replace(&mut self.appended_private_access_exprs, appended_private);

        if !appended_private.is_empty() {
            let expr = if appended_private.len() == 1 {
                *appended_private.into_iter().next().unwrap()
            } else {
                SeqExpr {
                    exprs: appended_private,
                    ..Default::default()
                }
                .into()
            };

            n.body.push(
                StaticBlock {
                    body: BlockStmt {
                        stmts: vec![expr.into_stmt()],
                        ..Default::default()
                    },
                    ..Default::default()
                }
                .into(),
            )
        }

        if let Some(class_name) = self.class_name.clone() {
            if !n.decorators.is_empty() {
                let decorators = ArrayLit {
                    span: DUMMY_SP,
                    elems: n
                        .decorators
                        .take()
                        .into_iter()
                        .map(|mut v| {
                            remove_span(&mut v.expr);

                            v.expr.as_arg()
                        })
                        .map(Some)
                        .collect(),
                }
                .as_arg();

                let decorated = CallExpr {
                    span: DUMMY_SP,
                    callee: helper!(ts, ts_decorate),
                    args: vec![
                        decorators,
                        class_name
                            .clone()
                            .with_pos(BytePos::DUMMY, BytePos::DUMMY)
                            .as_arg(),
                    ],
                    ..Default::default()
                }
                .into();
                self.appended_exprs.push(
                    AssignExpr {
                        span: DUMMY_SP,
                        op: op!("="),
                        left: class_name.with_pos(BytePos::DUMMY, BytePos::DUMMY).into(),
                        right: decorated,
                    }
                    .into(),
                );
            }
        }
    }

    fn visit_mut_class_decl(&mut self, n: &mut ClassDecl) {
        let old = mem::replace(&mut self.class_name, Some(n.ident.clone()));

        n.visit_mut_children_with(self);

        self.class_name = old;
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        let appended_exprs = mem::take(&mut self.appended_exprs);
        e.visit_mut_children_with(self);
        let appended_exprs = mem::replace(&mut self.appended_exprs, appended_exprs);

        if let Some(var_name) = self.assign_class_expr_to.take() {
            self.vars.push(VarDeclarator {
                span: DUMMY_SP,
                name: var_name.clone().into(),
                init: None,
                definite: Default::default(),
            });

            *e = SeqExpr {
                span: DUMMY_SP,
                exprs: iter::once(AssignExpr {
                    span: DUMMY_SP,
                    op: op!("="),
                    left: var_name.clone().into(),
                    right: Box::new(e.take()),
                })
                .map(Into::into)
                .chain(appended_exprs)
                .chain(iter::once(var_name.into()))
                .collect(),
            }
            .into();
        }
    }

    fn visit_mut_class_expr(&mut self, n: &mut ClassExpr) {
        if !contains_decorator(n) {
            return;
        }

        let ident = n
            .ident
            .get_or_insert_with(|| private_ident!("_class"))
            .clone();

        let old = mem::replace(&mut self.class_name, Some(ident.clone()));

        n.visit_mut_children_with(self);

        self.assign_class_expr_to = Some(ident);

        self.class_name = old;
    }

    fn visit_mut_export_default_decl(&mut self, n: &mut ExportDefaultDecl) {
        n.visit_mut_children_with(self);
        // `export default class` is not expr
        self.assign_class_expr_to = None;
    }

    fn visit_mut_class_method(&mut self, c: &mut ClassMethod) {
        c.visit_mut_children_with(self);

        if let Some(class_name) = self.class_name.clone() {
            if !c.function.decorators.is_empty() {
                let key = self.key(&mut c.key);

                let target = if c.is_static {
                    class_name.as_arg()
                } else {
                    class_name.make_member(quote_ident!("prototype")).as_arg()
                };

                self.add_decorate_call(
                    c.function.decorators.drain(..).map(|d| d.expr),
                    target,
                    key.as_arg(),
                    Lit::Null(Null::dummy()).as_arg(),
                );
            }
        }
    }

    fn visit_mut_class_prop(&mut self, c: &mut ClassProp) {
        c.visit_mut_children_with(self);

        if let Some(class_name) = self.class_name.clone() {
            if !c.decorators.is_empty() {
                let key = self.key(&mut c.key);

                let target = if c.is_static {
                    class_name.as_arg()
                } else {
                    class_name.make_member(quote_ident!("prototype")).as_arg()
                };

                self.add_decorate_call(
                    c.decorators.drain(..).map(|d| d.expr),
                    target,
                    key.as_arg(),
                    Expr::undefined(DUMMY_SP).as_arg(),
                );
            }
        }
    }

    fn visit_mut_module(&mut self, n: &mut Module) {
        n.visit_with(self);

        n.visit_mut_children_with(self);
    }

    fn visit_mut_module_items(&mut self, s: &mut Vec<ModuleItem>) {
        self.visit_mut_stmt_likes(s);
    }

    fn visit_mut_script(&mut self, n: &mut Script) {
        n.visit_with(self);

        n.visit_mut_children_with(self);
    }

    fn visit_mut_stmts(&mut self, s: &mut Vec<Stmt>) {
        self.visit_mut_stmt_likes(s)
    }
}
