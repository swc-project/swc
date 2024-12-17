use rustc_hash::FxHashMap;
use swc_allocator::{
    arena::{Allocator, Box, CloneIn, Vec as SwcVec},
    vec,
};
use swc_common::{arena::Take, util::move_map::MoveMap, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::arena::*;
use swc_ecma_utils::{ident::IdentLike, stack_size::maybe_grow_default};
use swc_ecma_visit::{
    arena::{VisitMut, VisitMutWith},
    noop_visit_mut_type_arena,
};

use super::RenameMap;
use crate::arena::hygiene::Config;

pub(super) struct Operator<'this, 'a: 'this, I>
where
    I: IdentLike,
{
    pub alloc: &'a Allocator,
    pub rename: &'this FxHashMap<Id, I>,
    pub config: Config,

    pub extra: Vec<ModuleItem<'a>>,
}

impl<'this, 'a: 'this, I> Operator<'this, 'a, I>
where
    I: IdentLike,
{
    fn keep_class_name(
        &mut self,
        ident: &mut Ident,
        class: &mut Class<'a>,
    ) -> Option<ClassExpr<'a>> {
        if !self.config.keep_class_names {
            return None;
        }

        let mut orig_name = ident.clone_in(self.alloc);
        orig_name.ctxt = SyntaxContext::empty();

        {
            // Remove span hygiene of the class.
            let mut rename = RenameMap::default();

            rename.insert(ident.to_id(), orig_name.sym.clone_in(self.alloc));

            let mut operator = Operator {
                alloc: self.alloc,
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
            class: Box::new_in(class.take(self.alloc), self.alloc),
        };

        Some(class_expr)
    }
}

// impl<'a, I> Parallel for Operator<'a, I>
// where
//     I: IdentLike,
// {
//     fn create(&self) -> Self {
//         Self {
//             alloc: self.alloc,
//             rename: self.rename,
//             config: self.config.clone_in(self.alloc),
//             extra: Default::default(),
//         }
//     }

//     fn merge(&mut self, other: Self) {
//         self.extra.extend(other.extra);
//     }

//     fn after_module_items(&mut self, stmts: &mut Vec<ModuleItem>) {
//         stmts.append(&mut self.extra);
//     }
// }

// impl<'a, I> ParExplode for Operator<'a, I>
// where
//     I: IdentLike,
// {
//     fn after_one_stmt(&mut self, _: &mut Vec<Stmt>) {}

//     fn after_one_module_item(&mut self, stmts: &mut Vec<ModuleItem>) {
//         stmts.append(&mut self.extra);
//     }
// }

impl<'this, 'a: 'this, I> VisitMut<'a> for Operator<'this, 'a, I>
where
    I: IdentLike,
{
    noop_visit_mut_type_arena!();

    /// Preserve key of properties.
    fn visit_mut_assign_pat_prop(&mut self, p: &mut AssignPatProp<'a>) {
        if let Some(value) = &mut p.value {
            value.visit_mut_children_with(self);
        }
    }

    fn visit_mut_class_expr(&mut self, n: &mut ClassExpr<'a>) {
        if let Some(ident) = &mut n.ident {
            if let Some(expr) = self.keep_class_name(ident, &mut n.class) {
                *n = expr;
                return;
            }
        }

        n.ident.visit_mut_with(self);

        n.class.visit_mut_with(self);
    }

    fn visit_mut_decl(&mut self, decl: &mut Decl<'a>) {
        match decl {
            Decl::Class(cls) if self.config.keep_class_names => {
                let span = cls.class.span;

                let mut cls_inner = cls.as_mut().take(self.alloc);
                let ident = &mut cls_inner.ident;
                let class = &mut cls_inner.class;
                let expr = self.keep_class_name(ident, class);

                let _ = std::mem::replace(cls.as_mut(), cls_inner);
                if let Some(expr) = expr {
                    let var = VarDeclarator {
                        span,
                        name: Pat::Ident(Box::new_in(
                            cls.ident.clone_in(self.alloc).into(),
                            self.alloc,
                        )),
                        init: Some(Expr::Class(Box::new_in(expr, self.alloc))),
                        definite: false,
                    };
                    *decl = Decl::Var(Box::new_in(
                        VarDecl {
                            span,
                            kind: VarDeclKind::Let,
                            decls: vec![in self.alloc; var],
                            ctxt: SyntaxContext::default(),
                            declare: false,
                        },
                        self.alloc,
                    ));
                    return;
                }

                return;
            }
            _ => {}
        }

        decl.visit_mut_children_with(self);
    }

    fn visit_mut_export_named_specifier(&mut self, s: &mut ExportNamedSpecifier<'a>) {
        if s.exported.is_some() {
            s.orig.visit_mut_with(self);
            return;
        }

        let exported = s.orig.clone_in(self.alloc);

        if let ModuleExportName::Ident(orig) = &mut s.orig {
            if self.rename_ident(orig).is_ok() {
                match &exported {
                    ModuleExportName::Ident(exported) => {
                        if orig.sym == exported.sym {
                            return;
                        }
                    }
                    ModuleExportName::Str(_) => {}
                }

                s.exported = Some(exported);
            }
        }
    }

    fn visit_mut_expr(&mut self, n: &mut Expr<'a>) {
        maybe_grow_default(|| n.visit_mut_children_with(self))
    }

    // fn visit_mut_expr_or_spreads(&mut self, n: &mut Vec<ExprOrSpread>) {
    //     self.maybe_par(cpu_count() * 100, n, |v, n| {
    //         n.visit_mut_with(v);
    //     })
    // }

    // fn visit_mut_exprs(&mut self, n: &mut Vec<Box<Expr>>) {
    //     self.maybe_par(cpu_count() * 100, n, |v, n| {
    //         n.visit_mut_with(v);
    //     })
    // }

    fn visit_mut_ident(&mut self, ident: &mut Ident) {
        match self.rename_ident(ident) {
            Ok(i) | Err(i) => i,
        }
    }

    fn visit_mut_import_named_specifier(&mut self, s: &mut ImportNamedSpecifier<'a>) {
        if s.imported.is_some() {
            s.local.visit_mut_with(self);
            return;
        }

        let imported = s.local.clone_in(self.alloc);
        let local = self.rename_ident(&mut s.local);

        if local.is_ok() {
            if s.local.sym == imported.sym {
                return;
            }

            s.imported = Some(ModuleExportName::Ident(Box::new_in(imported, self.alloc)));
        }
    }

    /// Preserve key of properties.
    fn visit_mut_key_value_pat_prop(&mut self, p: &mut KeyValuePatProp<'a>) {
        p.key.visit_mut_with(self);
        p.value.visit_mut_with(self);
    }

    fn visit_mut_key_value_prop(&mut self, p: &mut KeyValueProp<'a>) {
        p.key.visit_mut_with(self);
        p.value.visit_mut_with(self);
    }

    fn visit_mut_member_expr(&mut self, expr: &mut MemberExpr<'a>) {
        expr.span.visit_mut_with(self);
        expr.obj.visit_mut_with(self);

        if let MemberProp::Computed(c) = &mut expr.prop {
            c.visit_mut_with(self)
        }
    }

    fn visit_mut_module_item(&mut self, item: &mut ModuleItem<'a>) {
        let span = item.span();

        macro_rules! export {
            ($orig:expr, $ident:expr) => {
                self.extra
                    .push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                        Box::new_in(
                            NamedExport {
                                span,
                                specifiers: vec![in self.alloc; ExportSpecifier::Named(Box::new_in(ExportNamedSpecifier {
                                    span: DUMMY_SP,
                                    orig: $ident,
                                    exported: Some($orig),
                                    is_type_only: false,
                                }, self.alloc))],
                                src: None,
                                type_only: false,
                                with: None,
                            },
                            self.alloc,
                        ),
                    )));
            };
        }

        match item {
            ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(export_decl))
                if export_decl.decl.is_class() =>
            {
                let ExportDecl { span, decl } = export_decl.as_mut();
                let ClassDecl {
                    ident,
                    class,
                    declare,
                } = decl.as_mut_class().unwrap().as_mut();
                let mut ident = ident.take(self.alloc);
                let mut class = class.take(self.alloc);

                class.visit_mut_with(self);
                let orig_ident = ident.clone_in(self.alloc);
                match self.rename_ident(&mut ident) {
                    Ok(..) => {
                        *item = ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(Box::new_in(
                            ExportDecl {
                                span: *span,
                                decl: Decl::Class(Box::new_in(
                                    ClassDecl {
                                        ident: ident.clone_in(self.alloc),
                                        class: class.take(self.alloc),
                                        declare: *declare,
                                    },
                                    self.alloc,
                                )),
                            },
                            self.alloc,
                        )));
                        export!(
                            ModuleExportName::Ident(Box::new_in(orig_ident, self.alloc)),
                            ModuleExportName::Ident(Box::new_in(
                                ident.take(self.alloc),
                                self.alloc
                            ))
                        );
                    }
                    Err(..) => {
                        *item = ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(Box::new_in(
                            ExportDecl {
                                span: *span,
                                decl: Decl::Class(Box::new_in(
                                    ClassDecl {
                                        ident: ident.take(self.alloc),
                                        class: class.take(self.alloc),
                                        declare: *declare,
                                    },
                                    self.alloc,
                                )),
                            },
                            self.alloc,
                        )))
                    }
                }
            }
            ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(export_decl))
                if export_decl.decl.is_fn_decl() =>
            {
                let ExportDecl { span, decl } = export_decl.as_mut();
                let FnDecl {
                    ident,
                    function,
                    declare,
                } = decl.as_mut_fn_decl().unwrap().as_mut();
                let mut ident = ident.take(self.alloc);
                let mut function = function.take(self.alloc);

                function.visit_mut_with(self);
                let orig_ident = ident.clone_in(self.alloc);
                match self.rename_ident(&mut ident) {
                    Ok(..) => {
                        *item = ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(Box::new_in(
                            ExportDecl {
                                span: *span,
                                decl: Decl::Fn(Box::new_in(
                                    FnDecl {
                                        ident: ident.clone_in(self.alloc),
                                        function,
                                        declare: *declare,
                                    },
                                    self.alloc,
                                )),
                            },
                            self.alloc,
                        )));
                        export!(
                            ModuleExportName::Ident(Box::new_in(orig_ident, self.alloc)),
                            ModuleExportName::Ident(Box::new_in(ident, self.alloc))
                        );
                    }
                    Err(..) => {
                        *item = ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(Box::new_in(
                            ExportDecl {
                                span: *span,
                                decl: Decl::Fn(Box::new_in(
                                    FnDecl {
                                        ident,
                                        function,
                                        declare: *declare,
                                    },
                                    self.alloc,
                                )),
                            },
                            self.alloc,
                        )))
                    }
                }
            }
            ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(export_decl))
                if export_decl.decl.is_var() =>
            {
                let var = export_decl.as_mut().decl.as_mut_var().unwrap();
                let decls = var.decls.take(self.alloc);

                let mut renamed = SwcVec::new_in(self.alloc);
                let decls = decls.move_map(|mut decl| {
                    decl.name.visit_mut_with(&mut VarFolder {
                        orig: self,
                        renamed: &mut renamed,
                    });
                    decl.init.visit_mut_with(self);
                    decl
                });

                if renamed.is_empty() {
                    *item = ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(Box::new_in(
                        ExportDecl {
                            span,
                            decl: Decl::Var(Box::new_in(
                                VarDecl {
                                    decls,
                                    ..var.as_mut().take(self.alloc)
                                },
                                self.alloc,
                            )),
                        },
                        self.alloc,
                    )));

                    return;
                }
                *item = ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(Box::new_in(
                    ExportDecl {
                        span,
                        decl: Decl::Var(Box::new_in(
                            VarDecl {
                                decls,
                                ..var.as_mut().take(self.alloc)
                            },
                            self.alloc,
                        )),
                    },
                    self.alloc,
                )));
                self.extra
                    .push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                        Box::new_in(
                            NamedExport {
                                span,
                                specifiers: renamed,
                                src: None,
                                type_only: false,
                                with: None,
                            },
                            self.alloc,
                        ),
                    )));
            }
            _ => {
                item.visit_mut_children_with(self);
            }
        }
    }

    // fn visit_mut_module_items(&mut self, nodes: &mut Vec<ModuleItem>) {
    //     use std::mem::take;

    //     #[cfg(feature = "concurrent")]
    //     if nodes.len() >= 8 * cpu_count() {
    //         ::swc_common::GLOBALS.with(|globals| {
    //             use rayon::prelude::*;

    //             let (visitor, new_nodes) = take(nodes)
    //                 .into_par_iter()
    //                 .map(|mut node| {
    //                     ::swc_common::GLOBALS.set(globals, || {
    //                         let mut visitor = Parallel::create(&*self);
    //                         node.visit_mut_with(&mut visitor);

    //                         let mut nodes = Vec::with_capacity(4);

    //                         ParExplode::after_one_module_item(&mut visitor, &mut
    // nodes);

    //                         nodes.push(node);

    //                         (visitor, nodes)
    //                     })
    //                 })
    //                 .reduce(
    //                     || (Parallel::create(&*self), Vec::new()),
    //                     |mut a, b| {
    //                         Parallel::merge(&mut a.0, b.0);

    //                         a.1.extend(b.1);

    //                         a
    //                     },
    //                 );

    //             Parallel::merge(self, visitor);

    //             {
    //                 self.after_module_items(nodes);
    //             }

    //             *nodes = new_nodes;
    //         });

    //         return;
    //     }

    //     let mut buf = Vec::with_capacity(nodes.len());

    //     for mut node in take(nodes) {
    //         let mut visitor = Parallel::create(&*self);
    //         node.visit_mut_with(&mut visitor);
    //         buf.push(node);
    //         visitor.after_one_module_item(&mut buf);
    //     }

    //     self.after_module_items(&mut buf);

    //     *nodes = buf;
    // }

    fn visit_mut_named_export(&mut self, e: &mut NamedExport<'a>) {
        if e.src.is_some() {
            return;
        }

        e.visit_mut_children_with(self);
    }

    fn visit_mut_object_pat_prop(&mut self, n: &mut ObjectPatProp<'a>) {
        n.visit_mut_children_with(self);

        if let ObjectPatProp::Assign(p) = n {
            let mut renamed = Ident::from(&p.key);
            if self.rename_ident(&mut renamed).is_ok() {
                if renamed.sym == p.key.sym {
                    return;
                }

                *n = ObjectPatProp::KeyValue(Box::new_in(
                    KeyValuePatProp {
                        key: PropName::Ident(Box::new_in(
                            p.key.take(self.alloc).into(),
                            self.alloc,
                        )),
                        value: match p.value.take() {
                            Some(default_expr) => Pat::Assign(Box::new_in(
                                AssignPat {
                                    span: p.span,
                                    left: Pat::Ident(Box::new_in(renamed.into(), self.alloc)),
                                    right: default_expr,
                                },
                                self.alloc,
                            )),
                            None => Pat::Ident(Box::new_in(renamed.into(), self.alloc)),
                        },
                    },
                    self.alloc,
                ));
            }
        }
    }

    // fn visit_mut_opt_vec_expr_or_spreads(&mut self, n: &mut
    // Vec<Option<ExprOrSpread>>) {     self.maybe_par(cpu_count() * 100, n, |v,
    // n| {         n.visit_mut_with(v);
    //     })
    // }

    fn visit_mut_prop(&mut self, prop: &mut Prop<'a>) {
        match prop {
            Prop::Shorthand(i) => {
                let mut renamed = i.clone_in(self.alloc);
                if self.rename_ident(&mut renamed).is_ok() {
                    if renamed.sym == i.sym {
                        return;
                    }

                    *prop = Prop::KeyValue(Box::new_in(
                        KeyValueProp {
                            key: PropName::Ident(Box::new_in(
                                IdentName {
                                    // clear mark
                                    span: i.span,
                                    sym: i.sym.clone_in(self.alloc),
                                },
                                self.alloc,
                            )),
                            value: renamed.into(),
                        },
                        self.alloc,
                    ))
                }
            }
            _ => prop.visit_mut_children_with(self),
        }
    }

    fn visit_mut_prop_name(&mut self, n: &mut PropName<'a>) {
        if let PropName::Computed(c) = n {
            c.visit_mut_with(self)
        }
    }

    // fn visit_mut_prop_or_spreads(&mut self, n: &mut Vec<'a, PropOrSpread<'a>>) {
    //     self.maybe_par(cpu_count() * 100, n, |v, n| {
    //         n.visit_mut_with(v);
    //     })
    // }

    // fn visit_mut_stmts(&mut self, nodes: &mut Vec<Stmt>) {
    //     use std::mem::take;

    //     #[cfg(feature = "concurrent")]
    //     if nodes.len() >= 100 * cpu_count() {
    //         ::swc_common::GLOBALS.with(|globals| {
    //             use rayon::prelude::*;

    //             let (visitor, new_nodes) = take(nodes)
    //                 .into_par_iter()
    //                 .map(|mut node| {
    //                     ::swc_common::GLOBALS.set(globals, || {
    //                         let mut visitor = Parallel::create(&*self);
    //                         node.visit_mut_with(&mut visitor);

    //                         let mut nodes = Vec::with_capacity(4);

    //                         ParExplode::after_one_stmt(&mut visitor, &mut nodes);

    //                         nodes.push(node);

    //                         (visitor, nodes)
    //                     })
    //                 })
    //                 .reduce(
    //                     || (Parallel::create(&*self), Vec::new()),
    //                     |mut a, b| {
    //                         Parallel::merge(&mut a.0, b.0);

    //                         a.1.extend(b.1);

    //                         a
    //                     },
    //                 );

    //             Parallel::merge(self, visitor);

    //             {
    //                 self.after_stmts(nodes);
    //             }

    //             *nodes = new_nodes;
    //         });

    //         return;
    //     }

    //     let mut buf = Vec::with_capacity(nodes.len());

    //     for mut node in take(nodes) {
    //         let mut visitor = Parallel::create(&*self);
    //         node.visit_mut_with(&mut visitor);
    //         buf.push(node);
    //         visitor.after_one_stmt(&mut buf);
    //     }

    //     self.after_stmts(&mut buf);

    //     *nodes = buf;
    // }

    fn visit_mut_super_prop_expr(&mut self, expr: &mut SuperPropExpr<'a>) {
        expr.span.visit_mut_with(self);
        if let SuperProp::Computed(c) = &mut expr.prop {
            c.visit_mut_with(self);
        }
    }

    // fn visit_mut_var_declarators(&mut self, n: &mut Vec<VarDeclarator>) {
    //     self.maybe_par(cpu_count() * 100, n, |v, n| {
    //         n.visit_mut_with(v);
    //     })
    // }
}

struct VarFolder<'this: 'map, 'map, 'a: 'this, I>
where
    I: IdentLike,
{
    orig: &'this Operator<'this, 'a, I>,
    renamed: &'map mut SwcVec<'a, ExportSpecifier<'a>>,
}

impl<'this: 'map, 'map, 'a: 'this, I> VisitMut<'a> for VarFolder<'this, 'map, 'a, I>
where
    I: IdentLike,
{
    noop_visit_mut_type_arena!();

    #[inline]
    fn visit_mut_expr(&mut self, _: &mut Expr) {}

    #[inline]
    fn visit_mut_simple_assign_target(&mut self, _: &mut SimpleAssignTarget) {}

    fn visit_mut_ident(&mut self, i: &mut Ident) {
        let orig = i.clone();
        if self.orig.rename_ident(i).is_ok() {
            self.renamed.push(ExportSpecifier::Named(Box::new_in(
                ExportNamedSpecifier {
                    span: i.span,
                    exported: Some(ModuleExportName::Ident(Box::new_in(orig, self.orig.alloc))),
                    orig: ModuleExportName::Ident(Box::new_in(i.clone(), self.orig.alloc)),
                    is_type_only: false,
                },
                self.orig.alloc,
            )));
        }
    }
}

impl<I> Operator<'_, '_, I>
where
    I: IdentLike,
{
    /// Returns `Ok(renamed_ident)` if ident should be renamed.
    fn rename_ident(&self, ident: &mut Ident) -> Result<(), ()> {
        if let Some(new_id) = self.rename.get(&ident.to_id()) {
            let (new_sym, new_ctxt) = new_id.to_id();

            if new_sym == ident.sym {
                return Err(());
            }

            ident.ctxt = new_ctxt;
            ident.sym = new_sym;
            return Ok(());
        }

        Err(())
    }
}
