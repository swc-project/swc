use super::Bundler;
use crate::{
    bundler::load_transformed::{Source, Specifier},
    Id,
};
use fxhash::FxHashMap;
use swc_atoms::js_word;
use swc_common::SyntaxContext;
use swc_ecma_ast::*;
use swc_ecma_codegen::Node;
use swc_ecma_transforms::noop_visit_type;
use swc_ecma_utils::find_ids;
use swc_ecma_visit::Visit;

impl Bundler<'_> {
    /// This method removes exported pure constants from the module.
    ///
    /// A pure constant is a exported literal.
    ///
    ///
    /// TODO: Support pattern like
    ///     export const [a, b] = [1, 2]
    pub(super) fn extract_export_info(&self, module: &Module) -> RawExports {
        self.swc.run(|| {
            let mut v = ExportFinder::default();

            module.visit_with(&mut v);

            v.info
        })
    }
}

#[derive(Debug, Default)]
pub(super) struct RawExports {
    pub pure_constants: Vec<(Id, Lit)>,
    /// Key is None if it's exported from the module itself.
    pub items: FxHashMap<Option<Str>, Vec<Specifier>>,
}

#[derive(Debug, Default)]
pub(super) struct Exports {
    pub pure_constants: Vec<(Id, Lit)>,
    pub items: Vec<Specifier>,
    pub reexports: FxHashMap<Source, Vec<Specifier>>,
}

#[derive(Debug, Default)]
struct ExportFinder {
    info: RawExports,
}

noop_visit_type!(ExportFinder);

impl Visit for ExportFinder {
    fn visit_module_item(&mut self, item: &ModuleItem, _: &dyn Node) {
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
                            v.push(Specifier::Specific {
                                local: n.orig.clone().into(),
                                alias: n.exported.clone().map(From::from),
                            });
                        }
                    }
                }
                return;
            }
            // TODO
            //  ModuleItem::ModuleDecl(ModuleDecl::ExportAll(all)) => {}
            _ => {}
        }
    }
}
