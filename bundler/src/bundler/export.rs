use super::{
    load::{Source, Specifier},
    Bundler,
};
use crate::{id::Id, load::Load, resolve::Resolve};
use std::collections::HashMap;
use swc_atoms::js_word;
use swc_common::{FileName, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_utils::find_ids;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    /// This method removes exported pure constants from the module.
    ///
    /// A pure constant is a exported literal.
    ///
    ///
    /// TODO: Support pattern like
    ///     export const [a, b] = [1, 2]
    pub(super) fn extract_export_info(
        &self,
        file_name: &FileName,
        module: &mut Module,
    ) -> RawExports {
        self.run(|| {
            let mut v = ExportFinder {
                info: Default::default(),
                file_name,
                bundler: self,
            };

            module.visit_mut_with(&mut v);

            v.info
        })
    }
}

#[derive(Debug, Default)]
pub(super) struct RawExports {
    /// Key is None if it's exported from the module itself.
    pub items: HashMap<Option<Str>, Vec<Specifier>>,
}

#[derive(Debug, Default)]
pub(super) struct Exports {
    pub items: Vec<Specifier>,
    pub reexports: HashMap<Source, Vec<Specifier>>,
}

struct ExportFinder<'a, 'b, L, R>
where
    L: Load,
    R: Resolve,
{
    info: RawExports,
    file_name: &'a FileName,
    bundler: &'a Bundler<'b, L, R>,
}

impl<L, R> ExportFinder<'_, '_, L, R>
where
    L: Load,
    R: Resolve,
{
    fn ctxt_for(&self, src: &str) -> Option<SyntaxContext> {
        // Don't apply mark if it's a core module.
        if self
            .bundler
            .config
            .external_modules
            .iter()
            .any(|v| v == src)
        {
            return None;
        }
        let path = self.bundler.resolve(self.file_name, src).ok()?;
        let (_, mark) = self.bundler.scope.module_id_gen.gen(&path);
        let ctxt = SyntaxContext::empty();

        Some(ctxt.apply_mark(mark))
    }
}

impl<L, R> VisitMut for ExportFinder<'_, '_, L, R>
where
    L: Load,
    R: Resolve,
{
    noop_visit_mut_type!();

    fn visit_mut_module_item(&mut self, item: &mut ModuleItem) {
        match item {
            // TODO: Optimize pure constants
            //            ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
            //                decl: Decl::Var(v),
            //                ..
            //            })) if v.kind == VarDeclKind::Const
            //                && v.decls.iter().all(|v| {
            //                    (match v.name {
            //                        Pat::Ident(..) => true,
            //                        _ => false,
            //                    }) && (match v.init {
            //                        Some(box Expr::Lit(..)) => true,
            //                        _ => false,
            //                    })
            //                }) =>
            //            {
            //                self.info
            //                    .pure_constants
            //                    .extend(v.decls.into_iter().map(|decl| {
            //                        let id = match decl.name {
            //                            Pat::Ident(i) => i.into(),
            //                            _ => unreachable!(),
            //                        };
            //                        let lit = match decl.init {
            //                            Some(box Expr::Lit(l)) => l,
            //                            _ => unreachable!(),
            //                        };
            //                        (id, lit)
            //                    }));
            //                return ModuleItem::Stmt(Stmt::Empty(EmptyStmt { span: DUMMY_SP }));
            //            }
            ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(decl)) => {
                let v = self.info.items.entry(None).or_default();
                v.push({
                    let i = match decl.decl {
                        Decl::Class(ref c) => &c.ident,
                        Decl::Fn(ref f) => &f.ident,
                        Decl::Var(ref var) => {
                            let ids: Vec<Id> = find_ids(&var.decls);
                            for id in ids {
                                v.push(Specifier::Specific {
                                    local: id,
                                    alias: None,
                                });
                            }
                            return;
                        }
                        _ => unreachable!("Decl in ExportDecl: {:?}", decl.decl),
                    };
                    Specifier::Specific {
                        local: i.into(),
                        alias: None,
                    }
                });

                return;
            }

            ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(_decl)) => {
                self.info
                    .items
                    .entry(None)
                    .or_default()
                    .push(Specifier::Specific {
                        local: Id::new(js_word!("default"), SyntaxContext::empty()),
                        alias: None,
                    });

                return;
            }

            ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(_expr)) => {
                self.info
                    .items
                    .entry(None)
                    .or_default()
                    .push(Specifier::Specific {
                        local: Id::new(js_word!("default"), SyntaxContext::empty()),
                        alias: None,
                    });

                return;
            }

            ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(named)) => {
                match &named.src {
                    Some(v) => {
                        let ctxt = self.ctxt_for(&v.value);
                        match ctxt {
                            Some(ctxt) => {
                                named.span = named.span.with_ctxt(ctxt);
                            }
                            None => {}
                        }
                    }
                    None => {}
                };
                let v = self.info.items.entry(named.src.clone()).or_default();
                for s in &named.specifiers {
                    match s {
                        ExportSpecifier::Namespace(n) => v.push(Specifier::Namespace {
                            local: n.name.clone().into(),
                        }),
                        ExportSpecifier::Default(d) => {
                            v.push(Specifier::Specific {
                                local: d.exported.clone().into(),
                                alias: Some(Id::new(js_word!("default"), SyntaxContext::empty())),
                            });
                        }
                        ExportSpecifier::Named(n) => {
                            if let Some(exported) = &n.exported {
                                v.push(Specifier::Specific {
                                    local: exported.clone().into(),
                                    alias: Some(n.orig.clone().into()),
                                });
                            } else {
                                v.push(Specifier::Specific {
                                    local: n.orig.clone().into(),
                                    alias: None,
                                });
                            }
                        }
                    }
                }
                return;
            }

            ModuleItem::ModuleDecl(ModuleDecl::ExportAll(all)) => {
                match self.ctxt_for(&all.src.value) {
                    Some(ctxt) => {
                        all.span = all.span.with_ctxt(ctxt);
                    }
                    None => {}
                }
            }
            _ => {}
        }
    }
}
