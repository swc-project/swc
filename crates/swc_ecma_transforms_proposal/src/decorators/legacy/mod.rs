use swc_atoms::JsWord;
use swc_common::{collections::AHashMap, util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{
    constructor::inject_after_super, default_constructor, private_ident, prop_name_to_expr_value,
    quote_ident, replace_ident, undefined, ExprFactory, StmtLike,
};
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
        prepended_exprs: Default::default(),
        class_name: Default::default(),
        constructor_exprs: Default::default(),
        exports: Default::default(),
    }
}

pub(super) struct TscDecorator {
    metadata: bool,

    enums: AHashMap<JsWord, EnumKind>,

    /// Used for computed keys, and this variables are not initialized.
    vars: Vec<VarDeclarator>,
    appended_exprs: Vec<Box<Expr>>,
    prepended_exprs: Vec<Box<Expr>>,

    class_name: Option<Ident>,

    /// Only used if `use_define_for_class_props` is false.
    constructor_exprs: Vec<Box<Expr>>,

    exports: Vec<ExportSpecifier>,
}

impl TscDecorator {
    fn visit_mut_stmt_likes<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike + VisitMutWith<Self>,
    {
        let old_vars = self.vars.take();
        let old_appended_exprs = self.appended_exprs.take();
        let old_prepended_exprs = self.prepended_exprs.take();

        let mut new = vec![];

        for mut s in stmts.take() {
            debug_assert!(self.appended_exprs.is_empty());

            s.visit_mut_with(self);

            if !self.vars.is_empty() {
                new.push(T::from_stmt(
                    VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        declare: Default::default(),
                        decls: self.vars.take(),
                    }
                    .into(),
                ));
            }

            new.extend(
                self.prepended_exprs
                    .drain(..)
                    .map(|expr| {
                        Stmt::Expr(ExprStmt {
                            span: DUMMY_SP,
                            expr,
                        })
                    })
                    .map(T::from_stmt),
            );

            new.push(s);

            new.extend(
                self.appended_exprs
                    .drain(..)
                    .map(|expr| {
                        Stmt::Expr(ExprStmt {
                            span: DUMMY_SP,
                            expr,
                        })
                    })
                    .map(T::from_stmt),
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
                    name: Pat::Ident(var_name.clone().into()),
                    init: None,
                    definite: Default::default(),
                });

                // Initialize var
                self.prepended_exprs.push(Box::new(Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    op: op!("="),
                    left: PatOrExpr::Pat(var_name.clone().into()),
                    right: k.expr.take(),
                })));

                k.expr = Box::new(Expr::Ident(var_name.clone()));

                return Expr::Ident(var_name);
            }
            PropName::Ident(i) => {
                return Expr::Lit(Lit::Str(Str {
                    span: DUMMY_SP,
                    raw: None,
                    value: i.sym.clone(),
                }))
            }
            _ => {}
        }

        prop_name_to_expr_value(k.clone())
    }

    /// Creates `__decorate` calls.
    fn add_decorate_call(
        &mut self,
        decorators: impl IntoIterator<Item = Box<Expr>>,
        target: ExprOrSpread,
        key: ExprOrSpread,
        desc: ExprOrSpread,
    ) {
        let decorators = ArrayLit {
            span: DUMMY_SP,
            elems: decorators
                .into_iter()
                .map(|v| v.as_arg())
                .map(Some)
                .collect(),
        }
        .as_arg();

        self.appended_exprs.push(Box::new(Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: helper!(ts, ts_decorate),
            args: vec![decorators, target, key, desc],
            type_args: Default::default(),
        })));
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
        let old_constructor_stmts = self.constructor_exprs.take();

        n.visit_mut_with(&mut ParamMetadata);

        if self.metadata {
            let i = self.class_name.clone();

            n.visit_mut_with(&mut Metadata {
                enums: &self.enums,
                class_name: i.as_ref(),
            });
        }

        n.visit_mut_children_with(self);

        if !self.constructor_exprs.is_empty() {
            for m in &mut n.body {
                if let ClassMember::Constructor(c @ Constructor { body: Some(..), .. }) = m {
                    inject_after_super(c, self.constructor_exprs.take());
                }
            }

            if !self.constructor_exprs.is_empty() {
                let mut c = default_constructor(n.super_class.is_some());
                inject_after_super(&mut c, self.constructor_exprs.take());
                n.body.insert(0, ClassMember::Constructor(c));
            }
        }

        self.constructor_exprs = old_constructor_stmts;

        if let Some(class_name) = self.class_name.clone() {
            if !n.decorators.is_empty() {
                let decorators = ArrayLit {
                    span: DUMMY_SP,
                    elems: n
                        .decorators
                        .take()
                        .into_iter()
                        .map(|v| v.expr.as_arg())
                        .map(Some)
                        .collect(),
                }
                .as_arg();

                let decorated = Box::new(Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee: helper!(ts, ts_decorate),
                    args: vec![decorators, class_name.clone().as_arg()],
                    type_args: Default::default(),
                }));
                self.appended_exprs.push(Box::new(Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    op: op!("="),
                    left: PatOrExpr::Pat(class_name.into()),
                    right: decorated,
                })));
            }
        }
    }

    fn visit_mut_class_decl(&mut self, n: &mut ClassDecl) {
        let old = self.class_name.take();
        self.class_name = Some(n.ident.clone());

        n.visit_mut_children_with(self);

        self.class_name = old;
    }

    fn visit_mut_class_expr(&mut self, n: &mut ClassExpr) {
        let old = self.class_name.take();
        if contains_decorator(n) && n.ident.is_none() {
            n.ident = Some(private_ident!("_class"));
        }

        if let Some(ident) = &n.ident {
            self.class_name = Some(ident.clone());
        }

        n.visit_mut_children_with(self);

        self.class_name = old;
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
                    undefined(DUMMY_SP).as_arg(),
                );
            }
        }
    }

    fn visit_mut_decl(&mut self, n: &mut Decl) {
        match n {
            Decl::Class(decl) => {
                let convert_to_let = !decl.class.decorators.is_empty();
                decl.visit_mut_with(self);

                if convert_to_let {
                    let inner_ident = private_ident!(decl.ident.sym.clone());

                    decl.class.body.iter_mut().for_each(|m| match m {
                        ClassMember::PrivateProp(PrivateProp {
                            is_static: true, ..
                        })
                        | ClassMember::StaticBlock(..)
                        | ClassMember::ClassProp(ClassProp {
                            is_static: true, ..
                        }) => {
                            replace_ident(m, decl.ident.to_id(), &inner_ident);
                        }
                        _ => {}
                    });

                    let d = VarDeclarator {
                        span: DUMMY_SP,
                        name: decl.ident.clone().into(),
                        init: Some(Box::new(Expr::Class(ClassExpr {
                            ident: Some(inner_ident),
                            class: decl.class.take(),
                        }))),
                        definite: Default::default(),
                    };
                    *n = Decl::Var(Box::new(VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Let,
                        declare: Default::default(),
                        decls: vec![d],
                    }));
                }
            }
            _ => {
                n.visit_mut_children_with(self);
            }
        }
    }

    fn visit_mut_module(&mut self, n: &mut Module) {
        n.visit_with(self);

        n.visit_mut_children_with(self);
    }

    fn visit_mut_module_item(&mut self, module_item: &mut ModuleItem) {
        match module_item {
            ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(n)) => {
                let export_decl_span = n.span;

                match &mut n.decl {
                    Decl::Class(decl) => {
                        let convert_to_let = !decl.class.decorators.is_empty();
                        decl.visit_mut_with(self);

                        if convert_to_let {
                            let inner_ident = private_ident!(decl.ident.sym.clone());

                            decl.class.body.iter_mut().for_each(|m| match m {
                                ClassMember::PrivateProp(PrivateProp {
                                    is_static: true, ..
                                })
                                | ClassMember::StaticBlock(..)
                                | ClassMember::ClassProp(ClassProp {
                                    is_static: true, ..
                                }) => {
                                    replace_ident(m, decl.ident.to_id(), &inner_ident);
                                }
                                _ => {}
                            });

                            let d = VarDeclarator {
                                span: DUMMY_SP,
                                name: decl.ident.clone().into(),
                                init: Some(Box::new(Expr::Class(ClassExpr {
                                    ident: Some(inner_ident),
                                    class: decl.class.take(),
                                }))),
                                definite: Default::default(),
                            };

                            let let_decl = VarDecl {
                                span: DUMMY_SP,
                                kind: VarDeclKind::Let,
                                declare: Default::default(),
                                decls: vec![d],
                            }
                            .into();
                            *module_item =
                                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                                    span: export_decl_span,
                                    decl: let_decl,
                                }));
                        }
                    }
                    _ => {
                        module_item.visit_mut_children_with(self);
                    }
                }
            }
            ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(n)) => match &mut n.decl {
                DefaultDecl::Class(decl) => {
                    let convert_to_let = !decl.class.decorators.is_empty();
                    decl.visit_mut_with(self);

                    if convert_to_let {
                        let ident = decl.ident.clone().unwrap();

                        let inner_ident = private_ident!(ident.sym.clone());

                        decl.class.body.iter_mut().for_each(|m| match m {
                            ClassMember::PrivateProp(PrivateProp {
                                is_static: true, ..
                            })
                            | ClassMember::StaticBlock(..)
                            | ClassMember::ClassProp(ClassProp {
                                is_static: true, ..
                            }) => {
                                replace_ident(m, ident.to_id(), &inner_ident);
                            }
                            _ => {}
                        });

                        let d = VarDeclarator {
                            span: DUMMY_SP,
                            name: ident.clone().into(),
                            init: Some(Box::new(Expr::Class(ClassExpr {
                                ident: Some(inner_ident),
                                ..decl.take()
                            }))),
                            definite: Default::default(),
                        };
                        *module_item = VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Let,
                            declare: Default::default(),
                            decls: vec![d],
                        }
                        .into();
                        self.exports
                            .push(ExportSpecifier::Named(ExportNamedSpecifier {
                                span: DUMMY_SP,
                                orig: ModuleExportName::Ident(ident),
                                exported: Some(ModuleExportName::Ident(quote_ident!("default"))),
                                is_type_only: Default::default(),
                            }));
                    }
                }
                _ => {
                    module_item.visit_mut_children_with(self);
                }
            },
            _ => {
                module_item.visit_mut_children_with(self);
            }
        }
    }

    fn visit_mut_module_items(&mut self, s: &mut Vec<ModuleItem>) {
        self.visit_mut_stmt_likes(s);

        if !self.exports.is_empty() {
            s.push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                NamedExport {
                    span: DUMMY_SP,
                    specifiers: self.exports.take(),
                    src: None,
                    type_only: Default::default(),
                    with: Default::default(),
                },
            )));
        }
    }

    fn visit_mut_script(&mut self, n: &mut Script) {
        n.visit_with(self);

        n.visit_mut_children_with(self);
    }

    fn visit_mut_stmts(&mut self, s: &mut Vec<Stmt>) {
        self.visit_mut_stmt_likes(s)
    }
}
