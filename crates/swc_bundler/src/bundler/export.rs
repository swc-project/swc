use indexmap::IndexMap;
use rustc_hash::FxBuildHasher;
use swc_atoms::{atom, Atom};
use swc_common::{FileName, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_utils::find_pat_ids;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use super::{
    load::{Source, Specifier},
    Bundler,
};
use crate::{id::Id, load::Load, resolve::Resolve, util::ExportMetadata};

impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    /// TODO: Support pattern like
    ///     export const [a, b] = [1, 2]
    pub(super) fn extract_export_info(
        &self,
        file_name: &FileName,
        module: &mut Module,
        export_ctxt: SyntaxContext,
    ) -> RawExports {
        self.run(|| {
            let mut v = ExportFinder {
                info: Default::default(),
                file_name,
                bundler: self,
                export_ctxt,
            };

            module.visit_mut_with(&mut v);

            v.info
        })
    }
}

#[derive(Debug, Default)]
pub(super) struct RawExports {
    /// Key is None if it's exported from the module itself.
    pub items: IndexMap<Option<Str>, Vec<Specifier>, FxBuildHasher>,
}

#[derive(Debug, Default)]
pub(crate) struct Exports {
    pub items: Vec<Specifier>,
    pub reexports: Vec<(Source, Vec<Specifier>)>,
}

struct ExportFinder<'a, 'b, L, R>
where
    L: Load,
    R: Resolve,
{
    info: RawExports,
    file_name: &'a FileName,
    bundler: &'a Bundler<'b, L, R>,
    export_ctxt: SyntaxContext,
}

impl<L, R> ExportFinder<'_, '_, L, R>
where
    L: Load,
    R: Resolve,
{
    /// Returns `(local, export)`.
    fn ctxt_for(&self, src: &Atom) -> Option<(SyntaxContext, SyntaxContext)> {
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
        let (_, local_mark, export_mark) = self.bundler.scope.module_id_gen.gen(&path);

        Some((
            SyntaxContext::empty().apply_mark(local_mark),
            SyntaxContext::empty().apply_mark(export_mark),
        ))
    }

    fn mark_as_wrapping_required(&self, src: &Atom) {
        // Don't apply mark if it's a core module.
        if self
            .bundler
            .config
            .external_modules
            .iter()
            .any(|v| v == src)
        {
            return;
        }
        let path = self.bundler.resolve(self.file_name, src);
        let path = match path {
            Ok(v) => v,
            _ => return,
        };
        let (id, _, _) = self.bundler.scope.module_id_gen.gen(&path);

        self.bundler.scope.mark_as_wrapping_required(id);
    }
}

impl<L, R> VisitMut for ExportFinder<'_, '_, L, R>
where
    L: Load,
    R: Resolve,
{
    noop_visit_mut_type!(fail);

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
                            let ids: Vec<Id> = find_pat_ids(&var.decls);
                            for id in ids {
                                v.push(Specifier::Specific {
                                    local: id,
                                    alias: None,
                                });
                            }
                            return;
                        }
                        Decl::TsEnum(ref e) => &e.id,
                        Decl::TsInterface(ref i) => &i.id,
                        Decl::TsTypeAlias(ref a) => &a.id,
                        _ => unreachable!("Decl in ExportDecl: {:?}", decl.decl),
                    };
                    Specifier::Specific {
                        local: i.into(),
                        alias: None,
                    }
                });
            }

            ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(_decl)) => {
                self.info
                    .items
                    .entry(None)
                    .or_default()
                    .push(Specifier::Specific {
                        local: Id::new(atom!("default"), SyntaxContext::empty()),
                        alias: None,
                    });
            }

            ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(_expr)) => {
                self.info
                    .items
                    .entry(None)
                    .or_default()
                    .push(Specifier::Specific {
                        local: Id::new(atom!("default"), SyntaxContext::empty()),
                        alias: None,
                    });
            }

            ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(named)) => {
                let ctxt = named.src.as_ref().and_then(|s| {
                    let src_atom = s.value.to_atom_lossy();
                    self.ctxt_for(src_atom.as_ref())
                });
                let mut need_wrapping = false;

                let v = self
                    .info
                    .items
                    .entry(named.src.clone().map(|v| *v))
                    .or_default();
                for s in &mut named.specifiers {
                    match s {
                        ExportSpecifier::Namespace(n) => {
                            match &mut n.name {
                                ModuleExportName::Ident(name) => {
                                    name.ctxt = self.export_ctxt;

                                    need_wrapping = true;
                                    v.push(Specifier::Namespace {
                                        local: name.clone().into(),
                                        all: true,
                                    })
                                }
                                ModuleExportName::Str(..) => {
                                    unimplemented!("module string names unimplemented")
                                }
                                #[cfg(swc_ast_unknown)]
                                _ => panic!("unable to access unknown nodes"),
                            };
                        }
                        ExportSpecifier::Default(d) => {
                            v.push(Specifier::Specific {
                                local: d.exported.clone().into(),
                                alias: Some(Id::new(atom!("default"), SyntaxContext::empty())),
                            });
                        }
                        ExportSpecifier::Named(n) => {
                            let orig = match &mut n.orig {
                                ModuleExportName::Ident(ident) => ident,
                                ModuleExportName::Str(..) => {
                                    unimplemented!("module string names unimplemented")
                                }
                                #[cfg(swc_ast_unknown)]
                                _ => panic!("unable to access unknown nodes"),
                            };
                            if let Some((_, export_ctxt)) = ctxt {
                                orig.ctxt = export_ctxt;
                            }

                            match &mut n.exported {
                                Some(ModuleExportName::Ident(exported)) => {
                                    exported.ctxt = self.export_ctxt;
                                }
                                Some(ModuleExportName::Str(..)) => {
                                    unimplemented!("module string names unimplemented")
                                }
                                #[cfg(swc_ast_unknown)]
                                Some(_) => panic!("unable to access unknown nodes"),
                                None => {
                                    let mut exported: Ident = orig.clone();
                                    exported.ctxt = self.export_ctxt;
                                    n.exported = Some(ModuleExportName::Ident(exported));
                                }
                            }

                            match &n.exported {
                                Some(ModuleExportName::Ident(exported)) => {
                                    v.push(Specifier::Specific {
                                        local: exported.clone().into(),
                                        alias: Some(orig.clone().into()),
                                    });
                                }
                                Some(ModuleExportName::Str(..)) => {
                                    unimplemented!("module string names unimplemented")
                                }
                                _ => {
                                    v.push(Specifier::Specific {
                                        local: orig.clone().into(),
                                        alias: None,
                                    });
                                }
                            }
                        }
                        #[cfg(swc_ast_unknown)]
                        _ => panic!("unable to access unknown nodes"),
                    }
                }

                if need_wrapping {
                    let wrap_atom = named.src.as_ref().unwrap().value.to_atom_lossy();
                    self.mark_as_wrapping_required(wrap_atom.as_ref());
                }
            }

            ModuleItem::ModuleDecl(ModuleDecl::ExportAll(all)) => {
                let ctxt = {
                    let src_atom = all.src.value.to_atom_lossy();
                    self.ctxt_for(src_atom.as_ref())
                };
                if let Some((_, export_ctxt)) = ctxt {
                    ExportMetadata {
                        export_ctxt: Some(export_ctxt),
                        ..Default::default()
                    }
                    .encode(&mut all.with);
                }

                self.info.items.entry(Some(*all.src.clone())).or_default();
            }
            _ => {}
        }
    }
}
