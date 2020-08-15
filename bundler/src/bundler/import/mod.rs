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
use swc_ecma_visit::{Fold, FoldWith};

#[cfg(test)]
mod tests;

impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    /// This method de-globs imports if possible.
    ///
    /// Also this method colorizes require calls.
    pub(super) fn extract_import_info(
        &self,
        path: &FileName,
        module: &mut Module,
        _mark: Mark,
    ) -> RawImports {
        self.run(|| {
            let body = replace(&mut module.body, vec![]);

            let mut v = ImportHandler {
                path,
                bundler: self,
                top_level: false,
                info: Default::default(),
                forces_ns: Default::default(),
                ns_usage: Default::default(),
                deglob_phase: false,
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
}

struct ImportHandler<'a, 'b, L, R>
where
    L: Load,
    R: Resolve,
{
    path: &'a FileName,
    bundler: &'a Bundler<'b, L, R>,
    top_level: bool,
    info: RawImports,
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
    forces_ns: HashSet<JsWord>,

    ns_usage: HashMap<JsWord, Vec<Id>>,

    deglob_phase: bool,
}

impl<L, R> ImportHandler<'_, '_, L, R>
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
        let path = self.bundler.resolve(self.path, src).ok()?;
        let (_, mark) = self.bundler.scope.module_id_gen.gen(&path);
        let mut ctxt = SyntaxContext::empty();

        Some(ctxt.apply_mark(mark))
    }
}

impl<L, R> Fold for ImportHandler<'_, '_, L, R>
where
    L: Load,
    R: Resolve,
{
    fn fold_import_decl(&mut self, import: ImportDecl) -> ImportDecl {
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

                    let new_import = ImportDecl {
                        specifiers,
                        ..import
                    };

                    return new_import;
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
            for import in self.info.imports.iter_mut() {
                let use_ns = self.forces_ns.contains(&import.src.value);

                if use_ns {
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
        }

        items
    }

    fn fold_stmts(&mut self, items: Vec<Stmt>) -> Vec<Stmt> {
        self.top_level = false;
        items.fold_children_with(self)
    }

    fn fold_expr(&mut self, e: Expr) -> Expr {
        match e {
            Expr::Member(mut e) => {
                e.obj = e.obj.fold_with(self);

                if e.computed {
                    e.prop = e.prop.fold_with(self);
                }

                match &e.obj {
                    ExprOrSuper::Expr(obj) => {
                        match &**obj {
                            Expr::Ident(i) => {
                                // Search for namespace imports.
                                // If possible, we de-glob namespace imports.
                                if let Some(import) = self.info.imports.iter().find(|import| {
                                    for s in &import.specifiers {
                                        match s {
                                            ImportSpecifier::Namespace(n) => {
                                                return i.sym == n.local.sym
                                                    && i.span.ctxt() == n.local.span.ctxt()
                                            }
                                            _ => {}
                                        }
                                    }

                                    false
                                }) {
                                    let mark = self.ctxt_for(&import.src.value);
                                    let ctxt = match mark {
                                        None => return e.into(),
                                        Some(mark) => mark,
                                    };

                                    if self.deglob_phase {
                                        if self.forces_ns.contains(&import.src.value) {
                                            //
                                            return e.into();
                                        }

                                        let i = match &*e.prop {
                                            Expr::Ident(i) => {
                                                let mut i = i.clone();
                                                i.span = i.span.with_ctxt(ctxt);
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
                                            self.forces_ns.insert(import.src.value.clone());
                                        } else {
                                            let i = match &*e.prop {
                                                Expr::Ident(i) => {
                                                    let mut i = i.clone();
                                                    i.span = i.span.with_ctxt(ctxt);
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
                                if let Some(ctxt) = self.ctxt_for(&src.value) {
                                    i.span = i.span.with_ctxt(ctxt);
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
                            if let Some(mark) = self.ctxt_for(&src.value) {
                                i.span = i.span.with_ctxt(mark);
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
}
