use super::{merge::Unexporter, plan::Plan};
use crate::{bundler::load::TransformedModule, util, Bundler, Load, Resolve};
use anyhow::{Context, Error};
use std::mem::{replace, take};
use swc_atoms::js_word;
use swc_common::{Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::find_ids;
use swc_ecma_visit::{noop_visit_mut_type, FoldWith, VisitMut, VisitMutWith};

impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    pub(super) fn merge_reexports(
        &self,
        plan: &Plan,
        entry: &mut Module,
        info: &TransformedModule,
    ) -> Result<(), Error> {
        entry.visit_mut_with(&mut DefaultRenamer);

        for (src, specifiers) in &info.exports.reexports {
            let imported = self.scope.get_module(src.module_id).unwrap();
            assert!(imported.is_es6, "Reexports are es6 only");

            info.helpers.extend(&imported.helpers);

            // print_hygiene("entry:init", &self.cm, &entry);
            // print_hygiene("dep:init", &self.cm, &dep);

            let (_, dep) = util::join(
                || {
                    self.run(|| {
                        entry.visit_mut_with(&mut NamedExportOrigMarker {
                            top_level_ctxt: SyntaxContext::empty().apply_mark(self.top_level_mark),
                            target_ctxt: SyntaxContext::empty().apply_mark(info.mark()),
                        });

                        entry.visit_mut_with(&mut ExportRenamer {
                            from: SyntaxContext::empty().apply_mark(imported.mark()),
                            to: SyntaxContext::empty().apply_mark(info.mark()),
                        });
                    })
                },
                || -> Result<_, Error> {
                    self.run(|| {
                        let mut dep = self
                            .merge_modules(plan, src.module_id, false, false)
                            .with_context(|| {
                                format!(
                                    "failed to merge for reexport: ({}):{} <= ({}):{}",
                                    info.id, info.fm.name, src.module_id, src.src.value
                                )
                            })?;

                        dep = self.drop_unused(dep, Some(&specifiers));

                        dep.visit_mut_with(&mut UnexportAsVar {
                            target_ctxt: SyntaxContext::empty().apply_mark(info.mark()),
                        });
                        // print_hygiene("dep:unexport-as-var", &self.cm, &dep);

                        dep.visit_mut_with(&mut AliasExports {
                            importer_ctxt: SyntaxContext::empty().apply_mark(info.mark()),
                            decls: Default::default(),
                        });
                        // print_hygiene("dep:alias-exports", &self.cm, &dep);

                        dep = dep.fold_with(&mut Unexporter);

                        Ok(dep)
                    })
                },
            );
            let dep = dep?;

            // print_hygiene("entry:before-injection", &self.cm, &entry);
            // print_hygiene("dep:before-injection", &self.cm, &dep);

            // Replace import statement / require with module body
            let mut injector = ExportInjector {
                imported: dep.body,
                src: src.src.clone(),
            };
            entry.body.visit_mut_with(&mut injector);

            // print_hygiene(
            //     &format!(
            //         "entry:injection {:?} <- {:?}",
            //         SyntaxContext::empty().apply_mark(info.mark()),
            //         SyntaxContext::empty().apply_mark(imported.mark()),
            //     ),
            //     &self.cm,
            //     &entry,
            // );
            // assert_eq!(injector.imported, vec![]);
        }

        Ok(())
    }
}

struct ExportInjector {
    imported: Vec<ModuleItem>,
    src: Str,
}

impl VisitMut for ExportInjector {
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, orig: &mut Vec<ModuleItem>) {
        let items = take(orig);
        let mut buf = Vec::with_capacity(self.imported.len() + items.len());

        for item in items {
            //
            match item {
                ModuleItem::Stmt(Stmt::Empty(..)) => continue,

                ModuleItem::ModuleDecl(ModuleDecl::ExportAll(ref export))
                    if export.src.value == self.src.value =>
                {
                    buf.extend(take(&mut self.imported));
                    buf.push(item);
                }

                ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                    export @ NamedExport { src: Some(..), .. },
                )) if export.src.as_ref().unwrap().value == self.src.value => {
                    buf.extend(take(&mut self.imported));
                    buf.push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                        NamedExport {
                            src: None,
                            ..export
                        },
                    )));
                }

                _ => buf.push(item),
            }
        }

        *orig = buf;
    }
}

struct ExportRenamer {
    /// Syntax context for the top level.
    from: SyntaxContext,
    /// Syntax context for the top level nodes of dependency module.
    to: SyntaxContext,
}

impl VisitMut for ExportRenamer {
    noop_visit_mut_type!();

    fn visit_mut_named_export(&mut self, export: &mut NamedExport) {
        // if export.src.is_none() {
        //     return;
        // }

        export.specifiers.visit_mut_children_with(self);
    }

    fn visit_mut_export_named_specifier(&mut self, s: &mut ExportNamedSpecifier) {
        match &mut s.exported {
            Some(v) => {
                if v.span.ctxt == self.from {
                    v.span = v.span.with_ctxt(self.to);
                }
            }
            None => {}
        }
        if s.orig.span.ctxt == self.from {
            s.orig.span = s.orig.span.with_ctxt(self.to);
        }
    }

    fn visit_mut_stmt(&mut self, _: &mut Stmt) {}
}

/// Converts
///
/// ```js
/// export { l1 as e2 };
/// ```
///
/// to
///
/// ```js
/// const e3 = l1;
/// ```
struct UnexportAsVar {
    /// Syntax context for the generated variables.
    target_ctxt: SyntaxContext,
}

impl VisitMut for UnexportAsVar {
    noop_visit_mut_type!();

    fn visit_mut_module_item(&mut self, n: &mut ModuleItem) {
        n.visit_mut_children_with(self);

        match n {
            ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(export)) => {
                let expr = replace(
                    &mut export.expr,
                    Box::new(Expr::Invalid(Invalid { span: DUMMY_SP })),
                );

                *n = ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: export.span,
                    kind: VarDeclKind::Const,
                    declare: false,
                    decls: vec![VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(Ident::new(
                            "__default".into(),
                            expr.span().with_ctxt(self.target_ctxt),
                        )),
                        init: Some(expr),
                        definite: false,
                    }],
                })));
            }
            ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(ref export)) => {
                let mut decls = vec![];
                for s in &export.specifiers {
                    match s {
                        ExportSpecifier::Namespace(_) => {}
                        ExportSpecifier::Default(_) => {}
                        ExportSpecifier::Named(n) => match &n.exported {
                            Some(exported) => {
                                // TODO: (maybe) Check previous context
                                let mut exported = exported.clone();
                                exported.span = exported.span.with_ctxt(self.target_ctxt);

                                decls.push(VarDeclarator {
                                    span: n.span,
                                    name: Pat::Ident(exported),
                                    init: Some(Box::new(Expr::Ident(n.orig.clone()))),
                                    definite: true,
                                })
                            }
                            None => decls.push(VarDeclarator {
                                span: n.span,
                                name: Pat::Ident(Ident::new(
                                    n.orig.sym.clone(),
                                    n.orig.span.with_ctxt(self.target_ctxt),
                                )),
                                init: Some(Box::new(Expr::Ident(n.orig.clone()))),
                                definite: false,
                            }),
                        },
                    }
                }

                if decls.is_empty() {
                    *n = ModuleItem::Stmt(Stmt::Empty(EmptyStmt { span: DUMMY_SP }))
                } else {
                    *n = ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                        span: export.span,
                        decls,
                        declare: false,
                        kind: VarDeclKind::Const,
                    })))
                }
            }
            _ => {}
        }
    }

    fn visit_mut_stmt(&mut self, _: &mut Stmt) {}
}

pub(super) struct NamedExportOrigMarker {
    pub top_level_ctxt: SyntaxContext,
    pub target_ctxt: SyntaxContext,
}

impl VisitMut for NamedExportOrigMarker {
    noop_visit_mut_type!();

    fn visit_mut_export_named_specifier(&mut self, s: &mut ExportNamedSpecifier) {
        if s.orig.span.ctxt == self.top_level_ctxt {
            s.orig.span = s.orig.span.with_ctxt(self.target_ctxt);
        }
    }

    fn visit_mut_stmt(&mut self, _: &mut Stmt) {}
}

struct AliasExports {
    /// Syntax context of the importer.
    importer_ctxt: SyntaxContext,
    decls: Vec<VarDeclarator>,
}

impl VisitMut for AliasExports {
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        for item in items.iter_mut() {
            item.visit_mut_with(self);
        }

        if !self.decls.is_empty() {
            items.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Const,
                decls: take(&mut self.decls),
                declare: false,
            }))))
        }
    }

    fn visit_mut_module_decl(&mut self, decl: &mut ModuleDecl) {
        match decl {
            ModuleDecl::ExportDecl(ref export) => match &export.decl {
                Decl::Class(c) => self.decls.push(VarDeclarator {
                    span: c.class.span,
                    name: Pat::Ident(Ident::new(
                        c.ident.sym.clone(),
                        c.ident.span.with_ctxt(self.importer_ctxt),
                    )),
                    init: Some(Box::new(Expr::Ident(c.ident.clone()))),
                    definite: false,
                }),
                Decl::Fn(f) => self.decls.push(VarDeclarator {
                    span: f.function.span,
                    name: Pat::Ident(Ident::new(
                        f.ident.sym.clone(),
                        f.ident.span.with_ctxt(self.importer_ctxt),
                    )),
                    init: Some(Box::new(Expr::Ident(f.ident.clone()))),
                    definite: false,
                }),
                Decl::Var(var) => {
                    let ids = find_ids::<_, Ident>(&var.decls);
                    for ident in ids {
                        self.decls.push(VarDeclarator {
                            span: ident.span,
                            name: Pat::Ident(Ident::new(
                                ident.sym.clone(),
                                ident.span.with_ctxt(self.importer_ctxt),
                            )),
                            init: Some(Box::new(Expr::Ident(ident))),
                            definite: false,
                        })
                    }
                }
                _ => {}
            },
            _ => {}
        }
    }

    fn visit_mut_stmt(&mut self, _: &mut Stmt) {}
}

struct DefaultRenamer;

impl VisitMut for DefaultRenamer {
    noop_visit_mut_type!();

    fn visit_mut_export_named_specifier(&mut self, n: &mut ExportNamedSpecifier) {
        if n.orig.sym == js_word!("default") {
            n.orig.sym = "__default".into()
        }
    }

    fn visit_mut_stmt(&mut self, _: &mut Stmt) {}
}
