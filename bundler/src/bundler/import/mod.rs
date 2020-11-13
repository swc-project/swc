use super::Bundler;
use crate::{load::Load, resolve::Resolve};
use anyhow::{Context, Error};
use std::{
    collections::{HashMap, HashSet},
    mem::replace,
};
use swc_atoms::{js_word, JsWord};
use swc_common::{
    sync::Lrc, util::move_map::MoveMap, FileName, Mark, Spanned, SyntaxContext, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_utils::{find_ids, ident::IdentLike, Id};
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith};

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
            let body = replace(&mut module.body, vec![]);

            let mut v = ImportHandler {
                module_ctxt: SyntaxContext::empty().apply_mark(module_local_mark),
                path,
                bundler: self,
                top_level: false,
                info: Default::default(),
                ns_usage: Default::default(),
                imported_idents: Default::default(),
                deglob_phase: false,
                idents_to_deglob: Default::default(),
            };
            let body = body.fold_with(&mut v);
            v.deglob_phase = true;
            let body = body.fold_with(&mut v);
            module.body = body;

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
    pub forced_ns: HashSet<JsWord>,
}

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

    ns_usage: HashMap<JsWord, Vec<Id>>,

    /// While deglobbing, we also marks imported identifiers.
    imported_idents: HashMap<Id, SyntaxContext>,

    deglob_phase: bool,
    idents_to_deglob: HashSet<Id>,
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
}

impl<L, R> Fold for ImportHandler<'_, '_, L, R>
where
    L: Load,
    R: Resolve,
{
    noop_fold_type!();

    fn fold_import_decl(&mut self, mut import: ImportDecl) -> ImportDecl {
        if !self.deglob_phase {
            // Ignore if it's a core module.
            if self
                .bundler
                .config
                .external_modules
                .contains(&import.src.value)
            {
                return import;
            }
            if let Some((_, export_ctxt)) = self.ctxt_for(&import.src.value) {
                import.span = import.span.with_ctxt(export_ctxt);

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

            self.info.imports.push(import.clone());
            return import;
        }

        // deglob namespace imports
        if import.specifiers.len() == 1 {
            match &import.specifiers[0] {
                ImportSpecifier::Namespace(_ns) => {
                    //
                    let specifiers = self
                        .ns_usage
                        .remove(&import.src.value)
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
                        let new_import = ImportDecl {
                            specifiers,
                            ..import
                        };

                        return new_import;
                    }

                    self.info.forced_ns.insert(import.src.value.clone());
                }

                _ => {}
            }
        }

        import
    }

    fn fold_module_items(&mut self, items: Vec<ModuleItem>) -> Vec<ModuleItem> {
        self.top_level = true;
        let items = items.move_flat_map(|item| {
            //

            match item {
                ModuleItem::Stmt(Stmt::Empty(..)) => None,
                ModuleItem::Stmt(Stmt::Decl(Decl::Var(mut var))) => {
                    var.decls.retain(|d| match d.name {
                        Pat::Invalid(..) => false,
                        _ => true,
                    });

                    if var.decls.is_empty() {
                        None
                    } else {
                        let var = var.fold_with(self);
                        Some(ModuleItem::Stmt(Stmt::Decl(Decl::Var(var))))
                    }
                }

                _ => Some(item.fold_with(self)),
            }
        });

        if self.deglob_phase {
            let mut wrapping_required = vec![];
            for import in self.info.imports.iter_mut() {
                let use_ns = self.info.forced_ns.contains(&import.src.value);

                if use_ns {
                    wrapping_required.push(import.src.value.clone());

                    import.specifiers.retain(|s| match s {
                        ImportSpecifier::Namespace(_) => true,
                        _ => false,
                    });

                    debug_assert_ne!(
                        import.specifiers,
                        vec![],
                        "forced_ns should be modified only if a namespace import specifier exist"
                    );
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

        items
    }

    fn fold_stmts(&mut self, items: Vec<Stmt>) -> Vec<Stmt> {
        self.top_level = false;
        items.fold_children_with(self)
    }

    fn fold_export_named_specifier(&mut self, mut s: ExportNamedSpecifier) -> ExportNamedSpecifier {
        match &s.exported {
            Some(exported) => {
                debug_assert_eq!(
                    exported.span.ctxt, self.module_ctxt,
                    "Exported names should have same (local) context as top-level module items"
                );
            }
            None => {
                let exported =
                    Ident::new(s.orig.sym.clone(), s.orig.span.with_ctxt(self.module_ctxt));
                s.exported = Some(exported);
            }
        }

        s
    }

    fn fold_expr(&mut self, e: Expr) -> Expr {
        match e {
            Expr::Ident(mut i) if self.deglob_phase => {
                return Expr::Ident(i);
            }

            Expr::Member(mut e) => {
                e.obj = e.obj.fold_with(self);

                if e.computed {
                    e.prop = e.prop.fold_with(self);
                }

                match &e.obj {
                    ExprOrSuper::Expr(obj) => {
                        match &**obj {
                            Expr::Ident(i) => {
                                // Deglob identifier usages.
                                if self.deglob_phase && self.idents_to_deglob.contains(&i.to_id()) {
                                    match *e.prop {
                                        Expr::Ident(prop) => {
                                            return Expr::Ident(Ident::new(
                                                prop.sym,
                                                prop.span.with_ctxt(i.span.ctxt),
                                            ))
                                        }
                                        _ => {}
                                    }
                                }

                                // Search for namespace imports.
                                // If possible, we de-glob namespace imports.
                                if let Some(import) = self.info.imports.iter().find(|import| {
                                    for s in &import.specifiers {
                                        match s {
                                            ImportSpecifier::Namespace(n) => {
                                                return i.sym == n.local.sym
                                                    && (i.span.ctxt == self.module_ctxt
                                                        || i.span.ctxt == n.local.span.ctxt)
                                            }
                                            _ => {}
                                        }
                                    }

                                    false
                                }) {
                                    let mark = self.ctxt_for(&import.src.value);
                                    let exported_ctxt = match mark {
                                        None => return e.into(),
                                        Some(ctxts) => ctxts.1,
                                    };
                                    if self.deglob_phase {
                                        if self.info.forced_ns.contains(&import.src.value) {
                                            //
                                            return e.into();
                                        }

                                        let i = match &*e.prop {
                                            Expr::Ident(i) => {
                                                let mut i = i.clone();
                                                i.span = i.span.with_ctxt(exported_ctxt);
                                                i
                                            }
                                            _ => unreachable!(
                                                "Non-computed member expression with property \
                                                 other than ident is invalid"
                                            ),
                                        };

                                        return Expr::Ident(i);
                                    } else {
                                        if e.computed {
                                            self.info.forced_ns.insert(import.src.value.clone());
                                        } else {
                                            let i = match &*e.prop {
                                                Expr::Ident(i) => {
                                                    let mut i = i.clone();
                                                    i.span = i.span.with_ctxt(exported_ctxt);
                                                    i
                                                }
                                                _ => unreachable!(
                                                    "Non-computed member expression with property \
                                                     other than ident is invalid"
                                                ),
                                            };

                                            self.ns_usage
                                                .entry(import.src.value.clone())
                                                .or_default()
                                                .push(i.to_id());
                                        }
                                    }

                                    return e.into();
                                }
                            }
                            _ => {}
                        }
                    }

                    _ => {}
                }

                return Expr::Member(e);
            }

            _ => {}
        }

        let e: Expr = e.fold_children_with(self);

        match e {
            Expr::Call(mut e) if e.args.len() == 1 => {
                let src = match e.args.first().unwrap() {
                    ExprOrSpread { spread: None, expr } => match &**expr {
                        Expr::Lit(Lit::Str(s)) => s,
                        _ => return Expr::Call(e),
                    },
                    _ => return Expr::Call(e),
                };

                match &mut e.callee {
                    ExprOrSuper::Expr(callee)
                        if !self.deglob_phase
                            && self.bundler.config.require
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
                            self.info.imports.push(decl);
                            return Expr::Call(e);
                        }

                        self.info.lazy_imports.push(decl);
                        return Expr::Call(e);
                    }

                    ExprOrSuper::Expr(ref e) => match &**e {
                        Expr::Ident(Ident {
                            sym: js_word!("import"),
                            ..
                        }) => {
                            self.info.dynamic_imports.push(src.clone());
                        }
                        _ => {}
                    },

                    _ => {}
                }

                return Expr::Call(e);
            }

            _ => {}
        }

        e
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
    fn fold_var_declarator(&mut self, mut node: VarDeclarator) -> VarDeclarator {
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
                            _ => return node,
                        },
                        _ => return node,
                    };
                    // Ignore core modules.
                    if self.bundler.config.external_modules.contains(&src.value) {
                        return node;
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

                    return VarDeclarator {
                        name: node.name.fold_with(self),
                        ..node
                    };
                }

                _ => {}
            },

            _ => {}
        }

        node.fold_children_with(self)
    }

    fn fold_member_expr(&mut self, mut e: MemberExpr) -> MemberExpr {
        e.obj = e.obj.fold_with(self);

        if e.computed {
            e.prop = e.prop.fold_with(self);
        }

        e
    }
}
