use std::collections::hash_map::Entry;

use swc_atoms::JsWord;
use swc_common::{
    collections::{AHashMap, AHashSet},
    util::{move_map::MoveMap, take::Take},
    Spanned, SyntaxContext, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use super::Config;
use crate::perf::{cpu_count, ParExplode, Parallel};
#[derive(Debug, Default)]
pub(super) struct Operations {
    pub rename: AHashMap<Id, JsWord>,
    symbols: AHashSet<JsWord>,
}

impl Operations {
    #[inline]
    pub fn rename(&mut self, from: Id, to: JsWord) {
        match self.rename.entry(from) {
            Entry::Occupied(..) => {}
            Entry::Vacant(e) => {
                e.insert(to.clone());
                self.symbols.insert(to);
            }
        }
    }

    pub fn add_used(&mut self, sym: JsWord) {
        self.symbols.insert(sym);
    }

    #[inline]
    pub fn get_renamed(&self, i: &Id) -> Option<JsWord> {
        self.rename.get(i).cloned()
    }

    #[inline]
    pub fn is_used_as_rename_target(&self, symbol: &JsWord) -> bool {
        self.symbols.contains(symbol)
    }
}

pub(super) struct Operator<'a> {
    pub rename: &'a AHashMap<Id, JsWord>,
    pub config: Config,

    pub extra: Vec<ModuleItem>,
}

impl Operator<'_> {
    fn keep_class_name(&mut self, ident: &mut Ident, class: &mut Class) -> Option<ClassExpr> {
        if !self.config.keep_class_names {
            return None;
        }

        let mut orig_name = ident.clone();
        orig_name.span.ctxt = SyntaxContext::empty();

        {
            // Remove span hygiene of the class.
            let mut rename = AHashMap::default();

            rename.insert(ident.to_id(), orig_name.sym.clone());

            let mut operator = Operator {
                rename: &rename,
                config: self.config.clone(),
                extra: Default::default(),
            };

            class.visit_mut_with(&mut operator);
        }

        let _ = self.rename_ident(ident);
        class.visit_mut_with(self);

        let class_expr = ClassExpr {
            ident: Some(orig_name),
            class: class.take(),
        };

        Some(class_expr)
    }
}

impl Parallel for Operator<'_> {
    fn create(&self) -> Self {
        Self {
            rename: self.rename,
            config: self.config.clone(),
            extra: Default::default(),
        }
    }

    fn merge(&mut self, other: Self) {
        self.extra.extend(other.extra);
    }

    fn after_module_items(&mut self, stmts: &mut Vec<ModuleItem>) {
        stmts.append(&mut self.extra);
    }
}

impl ParExplode for Operator<'_> {
    fn after_one_stmt(&mut self, _: &mut Vec<Stmt>) {}

    fn after_one_module_item(&mut self, stmts: &mut Vec<ModuleItem>) {
        stmts.append(&mut self.extra);
    }
}

impl<'a> VisitMut for Operator<'a> {
    noop_visit_mut_type!();

    /// Preserve key of properties.
    fn visit_mut_assign_pat_prop(&mut self, p: &mut AssignPatProp) {
        match &mut p.value {
            Some(value) => {
                value.visit_mut_children_with(self);
            }
            None => {}
        }
    }

    fn visit_mut_class_expr(&mut self, n: &mut ClassExpr) {
        if let Some(ident) = &mut n.ident {
            if let Some(expr) = self.keep_class_name(ident, &mut n.class) {
                *n = expr;
                return;
            }
        }

        n.ident.visit_mut_with(self);

        n.class.visit_mut_with(self);
    }

    fn visit_mut_decl(&mut self, decl: &mut Decl) {
        match decl {
            Decl::Class(cls) if self.config.keep_class_names => {
                let span = cls.class.span;

                let expr = self.keep_class_name(&mut cls.ident, &mut cls.class);
                if let Some(expr) = expr {
                    let var = VarDeclarator {
                        span,
                        name: cls.ident.clone().into(),
                        init: Some(Box::new(Expr::Class(expr))),
                        definite: false,
                    };
                    *decl = Decl::Var(VarDecl {
                        span,
                        kind: VarDeclKind::Let,
                        declare: false,
                        decls: vec![var],
                    });
                    return;
                }

                return;
            }
            _ => {}
        }

        decl.visit_mut_children_with(self);
    }

    fn visit_mut_export_named_specifier(&mut self, s: &mut ExportNamedSpecifier) {
        if s.exported.is_some() {
            s.orig.visit_mut_with(self);
            return;
        }

        let exported = s.orig.clone();

        if let ModuleExportName::Ident(orig) = &mut s.orig {
            if let Ok(..) = self.rename_ident(orig) {
                s.exported = Some(exported);
            }
        }
    }

    fn visit_mut_ident(&mut self, ident: &mut Ident) {
        match self.rename_ident(ident) {
            Ok(i) | Err(i) => i,
        }
    }

    fn visit_mut_import_named_specifier(&mut self, s: &mut ImportNamedSpecifier) {
        if s.imported.is_some() {
            s.local.visit_mut_with(self);
            return;
        }

        let imported = s.local.clone();
        let local = self.rename_ident(&mut s.local);

        if let Ok(..) = local {
            s.imported = Some(ModuleExportName::Ident(imported));
        }
    }

    /// Preserve key of properties.
    fn visit_mut_key_value_pat_prop(&mut self, p: &mut KeyValuePatProp) {
        p.key.visit_mut_with(self);
        p.value.visit_mut_with(self);
    }

    fn visit_mut_key_value_prop(&mut self, p: &mut KeyValueProp) {
        p.key.visit_mut_with(self);
        p.value.visit_mut_with(self);
    }

    fn visit_mut_member_expr(&mut self, expr: &mut MemberExpr) {
        expr.span.visit_mut_with(self);
        expr.obj.visit_mut_with(self);

        if let MemberProp::Computed(c) = &mut expr.prop {
            c.visit_mut_with(self)
        }
    }

    fn visit_mut_module_item(&mut self, item: &mut ModuleItem) {
        let span = item.span();

        macro_rules! export {
            ($orig:expr, $ident:expr) => {
                self.extra
                    .push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                        NamedExport {
                            span,
                            specifiers: vec![ExportSpecifier::Named(ExportNamedSpecifier {
                                span: DUMMY_SP,
                                orig: $ident,
                                exported: Some($orig),
                                is_type_only: false,
                            })],
                            src: None,
                            type_only: false,
                            asserts: None,
                        },
                    )));
            };
        }

        match item {
            ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                span,
                decl:
                    Decl::Class(ClassDecl {
                        ident,
                        class,
                        declare,
                    }),
            })) => {
                let mut ident = ident.take();
                let mut class = class.take();

                class.visit_mut_with(self);
                let orig_ident = ident.clone();
                match self.rename_ident(&mut ident) {
                    Ok(..) => {
                        *item = ModuleItem::Stmt(Stmt::Decl(Decl::Class(ClassDecl {
                            ident: ident.clone(),
                            class: class.take(),
                            declare: *declare,
                        })));
                        export!(
                            ModuleExportName::Ident(orig_ident),
                            ModuleExportName::Ident(ident.take())
                        );
                    }
                    Err(..) => {
                        *item = ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                            span: *span,
                            decl: Decl::Class(ClassDecl {
                                ident: ident.take(),
                                class: class.take(),
                                declare: *declare,
                            }),
                        }))
                    }
                }
            }
            ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                span,
                decl:
                    Decl::Fn(FnDecl {
                        ident,
                        function,
                        declare,
                    }),
            })) => {
                let mut ident = ident.take();
                let mut function = function.take();

                function.visit_mut_with(self);
                let orig_ident = ident.clone();
                match self.rename_ident(&mut ident) {
                    Ok(..) => {
                        *item = ModuleItem::Stmt(Stmt::Decl(Decl::Fn(FnDecl {
                            ident: ident.clone(),
                            function,
                            declare: *declare,
                        })));
                        export!(
                            ModuleExportName::Ident(orig_ident),
                            ModuleExportName::Ident(ident)
                        );
                    }
                    Err(..) => {
                        *item = ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                            span: *span,
                            decl: Decl::Fn(FnDecl {
                                ident,
                                function,
                                declare: *declare,
                            }),
                        }))
                    }
                }
            }
            ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                decl: Decl::Var(var),
                ..
            })) => {
                let decls = var.decls.take();

                let mut renamed: Vec<ExportSpecifier> = vec![];
                let decls = decls.move_map(|mut decl| {
                    decl.name.visit_mut_with(&mut VarFolder {
                        orig: self,
                        renamed: &mut renamed,
                    });
                    decl.init.visit_mut_with(self);
                    decl
                });

                if renamed.is_empty() {
                    *item = ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                        span,
                        decl: Decl::Var(VarDecl {
                            decls,
                            ..var.take()
                        }),
                    }));
                    return;
                }
                *item = ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                    decls,
                    ..var.take()
                })));
                self.extra
                    .push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                        NamedExport {
                            span,
                            specifiers: renamed,
                            src: None,
                            type_only: false,
                            asserts: None,
                        },
                    )));
            }
            _ => {
                item.visit_mut_children_with(self);
            }
        }
    }

    fn visit_mut_module_items(&mut self, nodes: &mut Vec<ModuleItem>) {
        use std::mem::take;

        #[cfg(feature = "rayon")]
        if nodes.len() >= 64 * cpu_count() {
            use swc_common::errors::HANDLER;

            use crate::helpers::HELPERS;

            ::swc_common::GLOBALS.with(|globals| {
                HELPERS.with(|helpers| {
                    HANDLER.with(|handler| {
                        use rayon::prelude::*;

                        let (visitor, new_nodes) = take(nodes)
                            .into_par_iter()
                            .map(|mut node| {
                                ::swc_common::GLOBALS.set(globals, || {
                                    HELPERS.set(helpers, || {
                                        HANDLER.set(handler, || {
                                            let mut visitor = Parallel::create(&*self);
                                            node.visit_mut_with(&mut visitor);

                                            let mut nodes = Vec::with_capacity(4);

                                            ParExplode::after_one_module_item(
                                                &mut visitor,
                                                &mut nodes,
                                            );

                                            nodes.push(node);

                                            (visitor, nodes)
                                        })
                                    })
                                })
                            })
                            .reduce(
                                || (Parallel::create(&*self), vec![]),
                                |mut a, b| {
                                    Parallel::merge(&mut a.0, b.0);

                                    a.1.extend(b.1);

                                    a
                                },
                            );

                        Parallel::merge(self, visitor);

                        {
                            self.after_module_items(nodes);
                        }

                        *nodes = new_nodes;
                    })
                })
            });

            return;
        }

        let mut buf = Vec::with_capacity(nodes.len());

        for mut node in take(nodes) {
            let mut visitor = Parallel::create(&*self);
            node.visit_mut_with(&mut visitor);
            self.after_one_module_item(&mut buf);
            buf.push(node);
        }

        self.after_module_items(&mut buf);

        *nodes = buf;
    }

    fn visit_mut_named_export(&mut self, e: &mut NamedExport) {
        if e.src.is_some() {
            return;
        }

        e.visit_mut_children_with(self);
    }

    fn visit_mut_object_pat_prop(&mut self, n: &mut ObjectPatProp) {
        n.visit_mut_children_with(self);

        if let ObjectPatProp::Assign(p) = n {
            let mut renamed = p.key.clone();
            if let Ok(..) = self.rename_ident(&mut renamed) {
                *n = KeyValuePatProp {
                    key: PropName::Ident(p.key.take()),
                    value: match p.value.take() {
                        Some(default_expr) => Box::new(Pat::Assign(AssignPat {
                            span: p.span,
                            left: renamed.into(),
                            right: default_expr,
                            type_ann: None,
                        })),
                        None => renamed.into(),
                    },
                }
                .into();
            }
        }
    }

    fn visit_mut_prop(&mut self, prop: &mut Prop) {
        match prop {
            Prop::Shorthand(i) => {
                let mut renamed = i.clone();
                if let Ok(..) = self.rename_ident(&mut renamed) {
                    *prop = Prop::KeyValue(KeyValueProp {
                        key: PropName::Ident(Ident {
                            // clear mark
                            span: i.span.with_ctxt(SyntaxContext::empty()),
                            ..i.clone()
                        }),
                        value: Box::new(Expr::Ident(renamed)),
                    })
                }
            }
            _ => prop.visit_mut_children_with(self),
        }
    }

    fn visit_mut_prop_name(&mut self, n: &mut PropName) {
        if let PropName::Computed(c) = n {
            c.visit_mut_with(self)
        }
    }

    fn visit_mut_super_prop_expr(&mut self, expr: &mut SuperPropExpr) {
        expr.span.visit_mut_with(self);
        if let SuperProp::Computed(c) = &mut expr.prop {
            c.visit_mut_with(self);
        }
    }
}

struct VarFolder<'a, 'b> {
    orig: &'a mut Operator<'b>,
    renamed: &'a mut Vec<ExportSpecifier>,
}

impl VisitMut for VarFolder<'_, '_> {
    noop_visit_mut_type!();

    #[inline]
    fn visit_mut_expr(&mut self, _: &mut Expr) {}

    fn visit_mut_ident(&mut self, i: &mut Ident) {
        let orig = i.clone();
        if let Ok(..) = self.orig.rename_ident(i) {
            self.renamed
                .push(ExportSpecifier::Named(ExportNamedSpecifier {
                    span: i.span,
                    exported: Some(ModuleExportName::Ident(orig)),
                    orig: ModuleExportName::Ident(i.clone()),
                    is_type_only: false,
                }));
        }
    }
}

impl<'a> Operator<'a> {
    /// Returns `Ok(renamed_ident)` if ident should be renamed.
    fn rename_ident(&mut self, ident: &mut Ident) -> Result<(), ()> {
        if let Some(sym) = self.rename.get(&ident.to_id()) {
            ident.span = ident.span.with_ctxt(SyntaxContext::empty());
            ident.sym = sym.clone();
            return Ok(());
        }

        Err(())
    }
}
