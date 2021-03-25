use super::Bundler;
use crate::{load::Load, resolve::Resolve};
use ahash::AHashMap;
use ahash::AHashSet;
use anyhow::{Context, Error};
use retain_mut::RetainMut;
use swc_atoms::{js_word, JsWord};
use swc_common::{sync::Lrc, FileName, Mark, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{find_ids, ident::IdentLike, Id};
use swc_ecma_visit::noop_visit_mut_type;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;

#[cfg(test)]
mod tests;

impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    /// This method de-globs imports if possible and colorizes imported values.
    pub(super) fn extract_import_info(
        &self,
        path: &FileName,
        module: &mut Module,
        module_local_mark: Mark,
    ) -> RawImports {
        self.run(|| {
            let mut v = ImportHandler {
                module_ctxt: SyntaxContext::empty().apply_mark(module_local_mark),
                path,
                bundler: self,
                top_level: false,
                info: Default::default(),
                usages: Default::default(),
                imported_idents: Default::default(),
                deglob_phase: false,
                idents_to_deglob: Default::default(),
                in_obj_of_member: false,
            };
            module.body.visit_mut_with(&mut v);
            v.deglob_phase = true;
            module.body.visit_mut_with(&mut v);

            v.info
        })
    }

    pub(super) fn resolve(
        &self,
        base: &FileName,
        module_specifier: &str,
    ) -> Result<Lrc<FileName>, Error> {
        self.run(|| {
            let path = self
                .resolver
                .resolve(base, module_specifier)
                .with_context(|| format!("failed to resolve {} from {}", module_specifier, base))?;

            let path = Lrc::new(path);

            Ok(path)
        })
    }
}

#[derive(Debug, Default)]
pub(super) struct RawImports {
    /// Unconditional imports. This includes require on top level.
    pub imports: Vec<ImportDecl>,

    /// Non-top-level imports.
    ///
    /// # Example
    ///
    /// ```js
    /// try{
    ///     const { watch } = require('watcher');
    /// } catch (e) {
    /// }
    /// ```
    pub lazy_imports: Vec<ImportDecl>,
    pub dynamic_imports: Vec<Str>,

    /// Contains namespace imports accessed with computed key.
    ///
    ///
    /// e.g.
    ///
    ///```js
    /// import * as foo from './foo';
    /// function bar() {}
    /// foo[bar()]
    /// ```
    pub forced_ns: AHashSet<JsWord>,
}

/// This type implements two operation (analysis, deglobbing) to reduce binary
/// size.
struct ImportHandler<'a, 'b, L, R>
where
    L: Load,
    R: Resolve,
{
    /// The [SyntaxContext] for the top level module items.
    //// The top level module items includes imported bindings.
    module_ctxt: SyntaxContext,
    path: &'a FileName,
    bundler: &'a Bundler<'b, L, R>,
    top_level: bool,
    info: RawImports,

    /// HashMap from the local identifier of a namespace import to used
    /// properties.
    usages: AHashMap<Id, Vec<Id>>,

    /// While deglobbing, we also marks imported identifiers.
    imported_idents: AHashMap<Id, SyntaxContext>,

    deglob_phase: bool,
    idents_to_deglob: AHashSet<Id>,

    /// `true` while folding objects of a member expression.
    ///
    /// This is used to distinguish usage of `a` in `console.log(a)` and
    /// `a.join()`.
    in_obj_of_member: bool,
}

impl RawImports {
    fn insert(&mut self, import: &ImportDecl) {
        for prev in self.imports.iter_mut() {
            if prev.src.value == import.src.value {
                prev.specifiers.extend(import.specifiers.clone());
                return;
            }
        }

        self.imports.push(import.clone());
    }
}

impl<L, R> ImportHandler<'_, '_, L, R>
where
    L: Load,
    R: Resolve,
{
    /// Retursn (local, export)
    fn ctxt_for(&self, src: &JsWord) -> Option<(SyntaxContext, SyntaxContext)> {
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
        let path = self.bundler.resolve(self.path, src).ok()?;
        let (_, local_mark, export_mark) = self.bundler.scope.module_id_gen.gen(&path);

        Some((
            SyntaxContext::empty().apply_mark(local_mark),
            SyntaxContext::empty().apply_mark(export_mark),
        ))
    }

    fn mark_as_wrapping_required(&self, src: &JsWord) {
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
        let path = self.bundler.resolve(self.path, src);
        let path = match path {
            Ok(v) => v,
            Err(_) => return,
        };
        let (id, _, _) = self.bundler.scope.module_id_gen.gen(&path);

        self.bundler.scope.mark_as_wrapping_required(id);
    }

    fn add_forced_ns_for(&mut self, id: Id) {
        self.idents_to_deglob.remove(&id);
        self.imported_idents.remove(&id);
        self.usages.remove(&id);

        if let Some(src) = self
            .info
            .imports
            .iter()
            .find(|import| {
                import.specifiers.iter().any(|specifier| match specifier {
                    ImportSpecifier::Namespace(ns) => {
                        ns.local.sym == id.0 && ns.local.span.ctxt == id.1
                    }
                    _ => false,
                })
            })
            .map(|import| import.src.value.clone())
        {
            self.info.forced_ns.insert(src);
            return;
        }
    }

    fn find_require(&mut self, e: &mut Expr) {
        match e {
            Expr::Call(e) if e.args.len() == 1 => {
                let src = match e.args.first().unwrap() {
                    ExprOrSpread { spread: None, expr } => match &**expr {
                        Expr::Lit(Lit::Str(s)) => s,
                        _ => return,
                    },
                    _ => return,
                };

                match &mut e.callee {
                    ExprOrSuper::Expr(callee)
                        if self.bundler.config.require
                            && match &**callee {
                                Expr::Ident(Ident {
                                    sym: js_word!("require"),
                                    ..
                                }) => true,
                                _ => false,
                            } =>
                    {
                        match &mut **callee {
                            Expr::Ident(i) => {
                                if let Some((_, export_ctxt)) = self.ctxt_for(&src.value) {
                                    i.span = i.span.with_ctxt(export_ctxt);
                                }
                            }
                            _ => {}
                        }

                        let span = callee.span();

                        let decl = ImportDecl {
                            span,
                            specifiers: vec![],
                            src: src.clone(),
                            type_only: false,
                            asserts: None,
                        };

                        if self.top_level {
                            self.info.insert(&decl);
                            return;
                        }

                        self.info.lazy_imports.push(decl);
                        return;
                    }

                    // TODO: Uncomment this after implementing an option to make swc_bundler
                    // includes dynamic imports
                    //
                    //
                    // ExprOrSuper::Expr(ref e) => match &**e {
                    //     Expr::Ident(Ident {
                    //         sym: js_word!("import"),
                    //         ..
                    //     }) => {
                    //         self.info.dynamic_imports.push(src.clone());
                    //     }
                    //     _ => {}
                    // },
                    _ => {}
                }
            }
            _ => {}
        }
    }

    fn analyze_usage(&mut self, e: &mut Expr) {
        match e {
            Expr::Member(e) => match &e.obj {
                ExprOrSuper::Super(_) => return,
                ExprOrSuper::Expr(obj) => match &**obj {
                    Expr::Ident(obj) => {
                        if !self.imported_idents.contains_key(&obj.to_id()) {
                            // If it's not imported, just abort the usage analysis.
                            return;
                        }

                        if e.computed {
                            // If a module is accessed with unknown key, we should import
                            // everyrthing from it.
                            self.add_forced_ns_for(obj.to_id());
                            return;
                        }

                        // Store usages of obj
                        let import = self.info.imports.iter().find(|import| {
                            for s in &import.specifiers {
                                match s {
                                    ImportSpecifier::Namespace(n) => {
                                        return obj.sym == n.local.sym
                                            && (obj.span.ctxt == self.module_ctxt
                                                || obj.span.ctxt == n.local.span.ctxt)
                                    }
                                    _ => {}
                                }
                            }

                            false
                        });
                        let import = match import {
                            Some(v) => v,
                            None => return,
                        };

                        let mark = self.ctxt_for(&import.src.value);
                        let exported_ctxt = match mark {
                            None => return,
                            Some(ctxts) => ctxts.1,
                        };
                        let prop = match &*e.prop {
                            Expr::Ident(i) => {
                                let mut i = i.clone();
                                i.span = i.span.with_ctxt(exported_ctxt);
                                i
                            }
                            _ => unreachable!(
                                "Non-computed member expression with property other than ident is \
                                 invalid"
                            ),
                        };

                        self.usages
                            .entry(obj.to_id())
                            .or_default()
                            .push(prop.to_id());
                    }
                    _ => {}
                },
            },
            _ => {}
        }
    }

    fn try_deglob(&mut self, e: &mut Expr) {
        let me = match e {
            Expr::Member(e) => e,
            _ => return,
        };
        if me.computed {
            return;
        }

        let obj = match &me.obj {
            ExprOrSuper::Super(_) => return,
            ExprOrSuper::Expr(e) => e,
        };

        let obj = match &**obj {
            Expr::Ident(obj) => obj,
            _ => return,
        };

        let usages = self.usages.get(&obj.to_id());

        match usages {
            Some(..) => {}
            _ => return,
        };

        let mut prop = match &*me.prop {
            Expr::Ident(v) => v.clone(),
            _ => return,
        };
        prop.span.ctxt = self.imported_idents.get(&obj.to_id()).copied().unwrap();

        *e = Expr::Ident(prop);
    }
}

impl<L, R> VisitMut for ImportHandler<'_, '_, L, R>
where
    L: Load,
    R: Resolve,
{
    noop_visit_mut_type!();

    fn visit_mut_import_decl(&mut self, import: &mut ImportDecl) {
        // Ignore if it's a core module.
        if self
            .bundler
            .config
            .external_modules
            .contains(&import.src.value)
        {
            return;
        }

        if !self.deglob_phase {
            if let Some((_, export_ctxt)) = self.ctxt_for(&import.src.value) {
                // Firstly we attach proper syntax contexts.
                import.span = import.span.with_ctxt(export_ctxt);

                // Then we store list of imported identifiers.
                for specifier in &mut import.specifiers {
                    match specifier {
                        ImportSpecifier::Named(n) => {
                            self.imported_idents.insert(n.local.to_id(), export_ctxt);
                            match &mut n.imported {
                                Some(imported) => {
                                    imported.span.ctxt = export_ctxt;
                                }
                                None => {
                                    let mut imported: Ident = n.local.clone();
                                    imported.span.ctxt = export_ctxt;
                                    n.imported = Some(imported);
                                }
                            }
                        }
                        ImportSpecifier::Default(n) => {
                            self.imported_idents
                                .insert(n.local.to_id(), n.local.span.ctxt);
                        }
                        ImportSpecifier::Namespace(n) => {
                            self.imported_idents.insert(n.local.to_id(), export_ctxt);
                        }
                    }
                }
            }

            self.info.insert(&import);
            return;
        }

        // Now we are in deglobbing phase.

        // We cannot deglob this.
        if self.info.forced_ns.contains(&import.src.value) {
            return;
        }

        // deglob namespace imports
        if import.specifiers.len() == 1 {
            match &import.specifiers[0] {
                ImportSpecifier::Namespace(ns) => {
                    //
                    let specifiers = self
                        .usages
                        .get(&ns.local.to_id())
                        .cloned()
                        .map(|ids| {
                            //
                            let specifiers: Vec<_> = ids
                                .into_iter()
                                .map(|id| {
                                    self.idents_to_deglob.insert(id.clone());
                                    ImportSpecifier::Named(ImportNamedSpecifier {
                                        span: DUMMY_SP,
                                        local: Ident::new(id.0, DUMMY_SP.with_ctxt(id.1)),
                                        imported: None,
                                    })
                                })
                                .collect();

                            for import_info in &mut self.info.imports {
                                if import_info.src != import.src {
                                    continue;
                                }

                                import_info.specifiers.extend(specifiers.clone());
                            }

                            specifiers
                        })
                        .unwrap_or_else(Vec::new);

                    if !specifiers.is_empty() {
                        import.specifiers = specifiers;
                        return;
                    }

                    // We failed to found property usage.
                    self.info.forced_ns.insert(import.src.value.clone());
                }

                _ => {}
            }
        }
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        if !self.deglob_phase {
            // Firstly, we check for usages of imported namespaces.
            // Code like below are handled by this check.
            //
            // import * as log from './log';
            // console.log(log)
            // console.log(log.getLogger())
            if !self.in_obj_of_member {
                match &e {
                    Expr::Ident(i) => {
                        if !self.in_obj_of_member {
                            self.add_forced_ns_for(i.to_id());
                            return;
                        }
                    }
                    _ => {}
                }
            }

            self.analyze_usage(e);
            self.find_require(e);
        } else {
            self.try_deglob(e);
        }
    }

    fn visit_mut_member_expr(&mut self, e: &mut MemberExpr) {
        let old = self.in_obj_of_member;
        self.in_obj_of_member = true;
        e.obj.visit_mut_with(self);

        if e.computed {
            self.in_obj_of_member = false;
            e.prop.visit_mut_with(self);
        }

        self.in_obj_of_member = old;
    }

    fn visit_mut_stmts(&mut self, items: &mut Vec<Stmt>) {
        self.top_level = false;
        items.visit_mut_children_with(self)
    }

    fn visit_mut_export_named_specifier(&mut self, s: &mut ExportNamedSpecifier) {
        match &s.exported {
            Some(exported) => {
                debug_assert_eq!(
                    exported.span.ctxt, self.module_ctxt,
                    "Exported names should have same (local) context as top-level module \
                     items\n{}\n{:?}",
                    self.path, s
                );
            }
            None => {
                let exported =
                    Ident::new(s.orig.sym.clone(), s.orig.span.with_ctxt(self.module_ctxt));
                s.exported = Some(exported);
            }
        }
    }

    /// ```js
    /// const { readFile } = required('fs');
    /// ```
    ///
    /// is treated as
    ///
    ///  ```js
    /// import { readFile } from 'fs';
    /// ```
    fn visit_mut_var_declarator(&mut self, node: &mut VarDeclarator) {
        node.visit_mut_children_with(self);

        match &mut node.init {
            Some(init) => match &mut **init {
                Expr::Call(CallExpr {
                    span,
                    callee: ExprOrSuper::Expr(ref mut callee),
                    ref args,
                    ..
                }) if self.bundler.config.require
                    && match &**callee {
                        Expr::Ident(Ident {
                            sym: js_word!("require"),
                            ..
                        }) => true,
                        _ => false,
                    }
                    && args.len() == 1 =>
                {
                    let span = *span;
                    let src = match args.first().unwrap() {
                        ExprOrSpread { spread: None, expr } => match &**expr {
                            Expr::Lit(Lit::Str(s)) => s.clone(),
                            _ => return,
                        },
                        _ => return,
                    };
                    // Ignore core modules.
                    if self.bundler.config.external_modules.contains(&src.value) {
                        return;
                    }

                    match &mut **callee {
                        Expr::Ident(i) => {
                            if let Some((_, export_ctxt)) = self.ctxt_for(&src.value) {
                                i.span = i.span.with_ctxt(export_ctxt);
                            }
                        }
                        _ => {}
                    }

                    let ids: Vec<Ident> = find_ids(&node.name);

                    let decl = ImportDecl {
                        span,
                        specifiers: ids
                            .into_iter()
                            .map(|ident| {
                                ImportSpecifier::Named(ImportNamedSpecifier {
                                    span,
                                    local: ident,
                                    imported: None,
                                })
                            })
                            .collect(),
                        src,
                        type_only: false,
                        asserts: None,
                    };

                    // if self.top_level {
                    //     self.info.imports.push(decl);
                    //     node.init = None;
                    //     node.name = Pat::Invalid(Invalid { span: DUMMY_SP });
                    //     return node;
                    // }

                    self.info.lazy_imports.push(decl);
                }

                _ => {}
            },

            _ => {}
        }
    }

    fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        self.top_level = true;
        items.visit_mut_children_with(self);

        items.retain_mut(|item| match item {
            ModuleItem::Stmt(Stmt::Empty(..)) => false,
            ModuleItem::Stmt(Stmt::Decl(Decl::Var(var))) => {
                var.decls.retain(|d| match d.name {
                    Pat::Invalid(..) => false,
                    _ => true,
                });

                if var.decls.is_empty() {
                    false
                } else {
                    true
                }
            }

            _ => true,
        });

        if self.deglob_phase {
            let mut wrapping_required = vec![];
            for import in self.info.imports.iter_mut() {
                let use_ns = self.info.forced_ns.contains(&import.src.value)
                    || self
                        .bundler
                        .config
                        .external_modules
                        .contains(&import.src.value);

                if use_ns {
                    wrapping_required.push(import.src.value.clone());
                } else {
                    // De-glob namespace imports
                    import.specifiers.retain(|s| match s {
                        ImportSpecifier::Namespace(_) => false,
                        _ => true,
                    });
                }
            }

            for id in wrapping_required {
                self.mark_as_wrapping_required(&id);
            }
        }
    }
}
