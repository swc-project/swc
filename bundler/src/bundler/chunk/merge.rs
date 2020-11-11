use super::plan::{DepType, Plan};
use crate::{
    bundler::{
        chunk::plan::NormalPlan,
        load::{Imports, Specifier, TransformedModule},
    },
    debug::print_hygiene,
    id::ModuleId,
    load::Load,
    resolve::Resolve,
    util::{self, IntoParallelIterator, MapWithMut},
    Bundler, Hook, ModuleRecord,
};
use anyhow::{Context, Error};
#[cfg(feature = "concurrent")]
use rayon::iter::ParallelIterator;
use retain_mut::RetainMut;
use std::mem::take;
use swc_atoms::js_word;
use swc_common::{FileName, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{prepend, prepend_stmts, private_ident};
use swc_ecma_visit::{noop_fold_type, noop_visit_mut_type, Fold, FoldWith, VisitMut, VisitMutWith};
use util::CHashSet;

pub(super) struct Ctx {
    pub plan: Plan,
    pub merged: CHashSet<ModuleId>,
}

impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    /// Merge
    pub(super) fn merge_modules(
        &self,
        ctx: &Ctx,
        module_id: ModuleId,
        is_entry: bool,
        allow_circular: bool,
    ) -> Result<Module, Error> {
        self.run(|| {
            if allow_circular {
                if let Some(plan) = ctx.plan.circular.get(&module_id) {
                    let module = self.merge_circular2(ctx, plan).with_context(|| {
                        format!("failed to merge {:?} (circular import)", module_id)
                    })?;
                    if is_entry {
                        // TODO: finalize
                    }
                    return Ok(module);
                }
            }

            let info = self.scope.get_module(module_id).unwrap();

            let mut module = self
                .get_module_for_merging2(module_id, is_entry)
                .with_context(|| format!("Failed to clone {:?} for merging", module_id))?;

            {
                let plan = ctx.plan.normal.get(&module_id);
                let default_plan;
                let plan = match plan {
                    Some(plan) => plan,
                    None => {
                        default_plan = Default::default();
                        &default_plan
                    }
                };

                module = self.merge_deps(ctx, module, plan, &info)?;
            }

            if !is_entry {
                // If we have aliased exports, we handle them at here.
                let mut var_decls = vec![];

                for stmt in module.body.iter_mut() {
                    match stmt {
                        ModuleItem::ModuleDecl(decl) => match decl {
                            ModuleDecl::ExportNamed(export) => {}
                            ModuleDecl::ExportDefaultDecl(export) => match &mut export.decl {
                                DefaultDecl::Class(expr) => {
                                    let expr = expr.take();
                                    let export_name = Pat::Ident(Ident::new(
                                        js_word!("default"),
                                        export.span.with_ctxt(info.export_ctxt()),
                                    ));

                                    let init = match expr.ident {
                                        Some(name) => {
                                            *stmt = ModuleItem::Stmt(Stmt::Decl(Decl::Class(
                                                ClassDecl {
                                                    ident: name.clone(),
                                                    declare: false,
                                                    class: expr.class,
                                                },
                                            )));

                                            Expr::Ident(name)
                                        }
                                        None => {
                                            *stmt = ModuleItem::Stmt(Stmt::Empty(EmptyStmt {
                                                span: DUMMY_SP,
                                            }));

                                            Expr::Class(expr)
                                        }
                                    };

                                    var_decls.push(VarDeclarator {
                                        span: DUMMY_SP,
                                        name: export_name,
                                        init: Some(Box::new(init)),
                                        definite: false,
                                    });
                                }
                                DefaultDecl::Fn(expr) => {
                                    let expr = expr.take();
                                    let export_name = Pat::Ident(Ident::new(
                                        js_word!("default"),
                                        export.span.with_ctxt(info.export_ctxt()),
                                    ));

                                    let init = match expr.ident {
                                        Some(name) => {
                                            *stmt =
                                                ModuleItem::Stmt(Stmt::Decl(Decl::Fn(FnDecl {
                                                    ident: name.clone(),
                                                    declare: false,
                                                    function: expr.function,
                                                })));

                                            Expr::Ident(name)
                                        }
                                        None => {
                                            *stmt = ModuleItem::Stmt(Stmt::Empty(EmptyStmt {
                                                span: DUMMY_SP,
                                            }));

                                            Expr::Fn(expr)
                                        }
                                    };

                                    var_decls.push(VarDeclarator {
                                        span: DUMMY_SP,
                                        name: export_name,
                                        init: Some(Box::new(init)),
                                        definite: false,
                                    });
                                    *stmt =
                                        ModuleItem::Stmt(Stmt::Empty(EmptyStmt { span: DUMMY_SP }));
                                }
                                DefaultDecl::TsInterfaceDecl(_) => continue,
                            },
                            ModuleDecl::ExportDefaultExpr(export) => {
                                var_decls.push(VarDeclarator {
                                    span: DUMMY_SP,
                                    name: Pat::Ident(Ident::new(
                                        js_word!("default"),
                                        DUMMY_SP.with_ctxt(info.export_ctxt()),
                                    )),
                                    init: Some(export.expr.take()),
                                    definite: false,
                                });
                                *stmt = ModuleItem::Stmt(Stmt::Empty(EmptyStmt { span: DUMMY_SP }));
                            }
                            _ => {}
                        },
                        ModuleItem::Stmt(_) => {}
                    }
                }

                if !var_decls.is_empty() {
                    module
                        .body
                        .push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Const,
                            declare: false,
                            decls: var_decls,
                        }))))
                }
            }

            if is_entry {
                self.finalize_merging_of_entry(ctx, &mut module);
            }

            Ok(module)
        })
    }

    fn merge_direct_import(
        &self,
        ctx: &Ctx,
        dep_id: ModuleId,
        specifiers: &[Specifier],
    ) -> Result<Module, Error> {
        let dep_info = self.scope.get_module(dep_id).unwrap();
        let wrapped = self.scope.should_be_wrapped_with_a_fn(dep_id);

        // Now we handle imports
        let mut module = if wrapped {
            let mut module = self.get_module_for_merging2(dep_id, false)?;
            let module_ident = specifiers
                .iter()
                .find_map(|specifier| match specifier {
                    Specifier::Namespace {
                        local, all: true, ..
                    } => Some(local.clone()),
                    _ => None,
                })
                .unwrap();
            // TODO: Store private ident in the scope.
            module = self.wrap_esm(module, module_ident.into_ident())?;

            let plan = ctx.plan.normal.get(&dep_id);
            let default_plan;
            let plan = match plan {
                Some(plan) => plan,
                None => {
                    default_plan = Default::default();
                    &default_plan
                }
            };

            module = self
                .merge_deps(ctx, module, plan, &dep_info)
                .context("failed to merge dependencies")?;

            module
        } else {
            let module = self.merge_modules(ctx, dep_id, false, true)?;
            module
        };

        module = module.fold_with(&mut Unexporter);

        // Handle aliased imports
        let var_decls = specifiers
            .iter()
            .filter_map(|specifier| match specifier {
                Specifier::Specific {
                    local,
                    alias: Some(alias),
                } => Some(VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Ident(local.clone().into_ident()),
                    init: Some(Box::new(Expr::Ident(
                        alias.clone().with_ctxt(dep_info.export_ctxt()).into_ident(),
                    ))),
                    definite: false,
                }),
                // TODO
                Specifier::Namespace { .. } => None,
                _ => None,
            })
            .collect::<Vec<_>>();

        if !var_decls.is_empty() {
            module
                .body
                .push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Const,
                    declare: false,
                    decls: var_decls,
                }))));
        }

        Ok(module)
    }

    fn merge_transitive_import(&self, ctx: &Ctx, dep_id: ModuleId) -> Result<Module, Error> {
        let module = self.merge_modules(ctx, dep_id, false, true)?;

        Ok(module)
    }

    fn merge_deps(
        &self,
        ctx: &Ctx,
        mut module: Module,
        plan: &NormalPlan,
        info: &TransformedModule,
    ) -> Result<Module, Error> {
        self.run(|| -> Result<_, Error> {
            log::debug!(
                "Normal merging: ({}) {} <= {:?}",
                info.id,
                info.fm.name,
                plan
            );
            if plan.chunks.is_empty() {
                return Ok(module);
            }

            let deps: Vec<_> = (&plan.chunks)
                .into_par_iter()
                .map(|dep| -> Result<_, Error> {
                    self.run(|| {
                        let dep_info = self.scope.get_module(dep.id).unwrap();

                        info.helpers.extend(&dep_info.helpers);
                        info.swc_helpers.extend_from(&dep_info.swc_helpers);

                        log::debug!("Merging: {} <= {}", info.fm.name, dep_info.fm.name);

                        let reexport = info
                            .exports
                            .reexports
                            .iter()
                            .find(|(src, _)| src.module_id == dep.id);
                        let wrapped = self.scope.should_be_wrapped_with_a_fn(dep.id);

                        match reexport {
                            Some((_, specifiers)) => {
                                let dep_module = self.merge2_export(ctx, dep.id, &specifiers)?;
                                return Ok((dep, dep_module));
                            }
                            None => {}
                        }

                        let dep_module = match dep.ty {
                            DepType::Direct => {
                                let (_, specifiers) = info
                                    .imports
                                    .specifiers
                                    .iter()
                                    .find(|(src, _)| src.module_id == dep.id)
                                    .expect("it is direct dependency");

                                self.merge_direct_import(ctx, dep.id, &specifiers)?
                            }
                            DepType::Transitive => {
                                debug_assert!(!wrapped, "Transitive dependency cannot be wrapped");
                                self.merge_transitive_import(ctx, dep.id)?
                            }
                        };

                        Ok((dep, dep_module))
                    })
                })
                .collect();

            let mut targets = plan.chunks.clone();

            for dep in deps {
                let (dep, mut dep_module) = dep?;
                let dep_info = self.scope.get_module(dep.id).unwrap();

                if let Some(idx) = targets.iter().position(|v| *v == *dep) {
                    targets.remove(idx);
                    if let Some(v) = ctx.plan.normal.get(&dep.id) {
                        targets.retain(|&dep| !v.chunks.contains(&dep));
                    }
                    if let Some(v) = ctx.plan.circular.get(&dep.id) {
                        targets.retain(|&dep| !v.chunks.contains(&dep.id));
                    }
                }

                if dep_info.is_es6 {
                    // print_hygiene("entry: before injection", &self.cm, &entry);

                    match dep.ty {
                        DepType::Transitive => {
                            prepend_stmts(&mut module.body, take(&mut dep_module.body).into_iter());

                            log::debug!(
                                "Merged {} into {} as a transitive es module",
                                dep_info.fm.name,
                                info.fm.name,
                            );

                            // print_hygiene("ES6", &self.cm, &entry);
                            continue;
                        }
                        _ => {}
                    }

                    // Replace import statement / require with module body
                    let mut injector = Es6ModuleInjector {
                        imported: take(&mut dep_module.body),
                        dep_export_ctxt: dep_info.export_ctxt(),
                        is_direct: match dep.ty {
                            DepType::Direct => true,
                            _ => false,
                        },
                    };
                    module.body.visit_mut_with(&mut injector);

                    if injector.imported.is_empty() {
                        // print_hygiene("entry:after:injection", &self.cm, &entry);

                        log::debug!(
                            "Merged {} into {} as an es module",
                            dep_info.fm.name,
                            info.fm.name,
                        );
                        // print_hygiene(
                        //     &format!("ES6: {:?} <- {:?}", info.ctxt(), dep_info.ctxt()),
                        //     &self.cm,
                        //     &entry,
                        // );
                        continue;
                    }

                    // print_hygiene("entry: failed to inject", &self.cm, &entry);

                    dep_module.body = take(&mut injector.imported);
                }

                // if self.config.require {
                //     self.merge_cjs(
                //         plan,
                //         is_entry,
                //         &mut entry,
                //         &info,
                //         Cow::Owned(dep),
                //         &dep_info,
                //         &mut targets,
                //     )?;
                // }
            }

            Ok(module)
        })
    }

    pub(super) fn get_module_for_merging2(
        &self,
        module_id: ModuleId,
        is_entry: bool,
    ) -> Result<Module, Error> {
        self.run(|| {
            let info = self.scope.get_module(module_id).unwrap();

            let mut entry: Module = (*info.module).clone();
            entry.visit_mut_with(&mut ImportMetaHandler {
                file: &info.fm.name,
                hook: &self.hook,
                is_entry,
                inline_ident: private_ident!("importMeta"),
                occurred: false,
                err: None,
            });

            Ok(entry)
        })
    }

    fn finalize_merging_of_entry(&self, ctx: &Ctx, entry: &mut Module) {
        print_hygiene("done", &self.cm, &entry);

        entry.body.retain_mut(|item| {
            match item {
                ModuleItem::ModuleDecl(ModuleDecl::ExportAll(..)) => return false,

                ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(export)) => {
                    export.src = None;
                }

                ModuleItem::ModuleDecl(ModuleDecl::Import(import)) => {
                    for (id, p) in &ctx.plan.normal {
                        if import.span.ctxt == self.scope.get_module(*id).unwrap().local_ctxt() {
                            log::debug!("Dropping import");
                            return false;
                        }

                        for &dep in &p.chunks {
                            if import.span.ctxt
                                == self.scope.get_module(dep.id).unwrap().local_ctxt()
                            {
                                log::debug!("Dropping direct import");
                                return false;
                            }
                        }
                    }

                    for (id, p) in &ctx.plan.circular {
                        // Drop if it's one of circular import
                        if import.span.ctxt == self.scope.get_module(*id).unwrap().local_ctxt() {
                            log::debug!("Dropping circular import");
                            return false;
                        }

                        for &mid in &p.chunks {
                            if import.span.ctxt == self.scope.get_module(mid).unwrap().local_ctxt()
                            {
                                log::debug!("Dropping circular import");
                                return false;
                            }
                        }
                    }
                }

                _ => {}
            }

            true
        });

        entry.visit_mut_with(&mut DefaultRenamer);

        // print_hygiene(
        //     "done-clean",
        //     &self.cm,
        //     &entry
        //         .clone()
        //         .fold_with(&mut hygiene())
        //         .fold_with(&mut fixer(None)),
        // );
    }
}

pub(super) struct ImportDropper<'a> {
    pub imports: &'a Imports,
}

impl VisitMut for ImportDropper<'_> {
    noop_visit_mut_type!();

    fn visit_mut_module_item(&mut self, i: &mut ModuleItem) {
        match i {
            ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl { src, .. }))
                if self
                    .imports
                    .specifiers
                    .iter()
                    .any(|(s, _)| s.src.value == *src.value) =>
            {
                *i = ModuleItem::Stmt(Stmt::Empty(EmptyStmt { span: DUMMY_SP }))
            }
            _ => {}
        }
    }
}

/// `export var a = 1` => `var a = 1`
pub(super) struct Unexporter;

impl Fold for Unexporter {
    noop_fold_type!();

    fn fold_module_item(&mut self, item: ModuleItem) -> ModuleItem {
        match item {
            ModuleItem::ModuleDecl(decl) => match decl {
                ModuleDecl::ExportDecl(decl) => ModuleItem::Stmt(Stmt::Decl(decl.decl)),

                ModuleDecl::ExportDefaultDecl(export) => match export.decl {
                    DefaultDecl::Class(ClassExpr { ident: None, .. })
                    | DefaultDecl::Fn(FnExpr { ident: None, .. }) => {
                        ModuleItem::Stmt(Stmt::Empty(EmptyStmt { span: DUMMY_SP }))
                    }
                    DefaultDecl::TsInterfaceDecl(decl) => {
                        ModuleItem::Stmt(Stmt::Decl(Decl::TsInterface(decl)))
                    }

                    DefaultDecl::Class(ClassExpr {
                        ident: Some(ident),
                        class,
                    }) => ModuleItem::Stmt(Stmt::Decl(Decl::Class(ClassDecl {
                        declare: false,
                        ident,
                        class,
                    }))),

                    DefaultDecl::Fn(FnExpr {
                        ident: Some(ident),
                        function,
                    }) => ModuleItem::Stmt(Stmt::Decl(Decl::Fn(FnDecl {
                        declare: false,
                        function,
                        ident,
                    }))),
                },

                // Empty statement
                ModuleDecl::ExportAll(..)
                | ModuleDecl::ExportDefaultExpr(..)
                | ModuleDecl::ExportNamed(..) => {
                    ModuleItem::Stmt(Stmt::Empty(EmptyStmt { span: DUMMY_SP }))
                }
                ModuleDecl::Import(..) => ModuleItem::ModuleDecl(decl),

                _ => unimplemented!("Unexported: {:?}", decl),
            },

            _ => item,
        }
    }
}

struct Es6ModuleInjector {
    imported: Vec<ModuleItem>,
    /// Export context of the dependency module.
    dep_export_ctxt: SyntaxContext,
    is_direct: bool,
}

impl VisitMut for Es6ModuleInjector {
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, orig: &mut Vec<ModuleItem>) {
        let items = take(orig);
        let mut buf = Vec::with_capacity(self.imported.len() + items.len());

        for item in items {
            //
            match item {
                ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                    span, specifiers, ..
                })) if span.ctxt == self.dep_export_ctxt => {
                    buf.extend(take(&mut self.imported));

                    if !self.is_direct {
                        let decls = specifiers
                            .iter()
                            .filter_map(|specifier| match specifier {
                                ImportSpecifier::Named(ImportNamedSpecifier {
                                    local,
                                    imported: Some(imported),
                                    ..
                                }) => {
                                    let mut imported = imported.clone();
                                    imported.span = imported.span.with_ctxt(self.dep_export_ctxt);

                                    Some(VarDeclarator {
                                        span: DUMMY_SP,
                                        name: Pat::Ident(local.clone()),
                                        init: Some(Box::new(Expr::Ident(imported))),
                                        definite: false,
                                    })
                                }
                                _ => None,
                            })
                            .collect::<Vec<_>>();

                        if !decls.is_empty() {
                            buf.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                                span: DUMMY_SP,
                                kind: VarDeclKind::Const,
                                declare: false,
                                decls,
                            }))));
                        }
                    }
                }

                _ => buf.push(item),
            }
        }

        *orig = buf;
    }
}

struct DefaultRenamer;

impl VisitMut for DefaultRenamer {
    noop_visit_mut_type!();

    fn visit_mut_pat(&mut self, n: &mut Pat) {
        match n {
            Pat::Ident(n) => {
                if n.sym == js_word!("default") {
                    n.sym = "__default".into()
                }
                return;
            }
            _ => {}
        }
        n.visit_mut_children_with(self);
    }

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        match n {
            Expr::Ident(n) => {
                if n.sym == js_word!("default") {
                    n.sym = "__default".into()
                }
                return;
            }
            _ => {}
        }

        n.visit_mut_children_with(self);
    }

    fn visit_mut_member_expr(&mut self, n: &mut MemberExpr) {
        n.obj.visit_mut_with(self);

        if n.computed {
            n.prop.visit_mut_with(self)
        }
    }
}

struct ImportMetaHandler<'a, 'b> {
    file: &'a FileName,
    hook: &'a Box<dyn 'b + Hook>,
    is_entry: bool,
    inline_ident: Ident,
    occurred: bool,
    err: Option<Error>,
}

impl VisitMut for ImportMetaHandler<'_, '_> {
    fn visit_mut_module(&mut self, n: &mut Module) {
        n.visit_mut_children_with(self);

        if self.occurred {
            match self.hook.get_import_meta_props(
                n.span,
                &ModuleRecord {
                    file_name: self.file.to_owned(),
                    is_entry: self.is_entry,
                },
            ) {
                Ok(key_value_props) => {
                    prepend(
                        &mut n.body,
                        ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                            span: n.span,
                            kind: VarDeclKind::Const,
                            declare: false,
                            decls: vec![VarDeclarator {
                                span: n.span,
                                name: Pat::Ident(self.inline_ident.clone()),
                                init: Some(Box::new(Expr::Object(ObjectLit {
                                    span: n.span,
                                    props: key_value_props
                                        .iter()
                                        .cloned()
                                        .map(|kv| PropOrSpread::Prop(Box::new(Prop::KeyValue(kv))))
                                        .collect(),
                                }))),
                                definite: false,
                            }],
                        }))),
                    );
                }
                Err(err) => self.err = Some(err),
            }
        }
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        match e {
            Expr::MetaProp(MetaPropExpr {
                meta:
                    Ident {
                        sym: js_word!("import"),
                        ..
                    },
                prop:
                    Ident {
                        sym: js_word!("meta"),
                        ..
                    },
                ..
            }) => {
                *e = Expr::Ident(self.inline_ident.clone());
                self.occurred = true;
            }
            _ => {}
        }
    }
}
