use std::{cell::RefCell, rc::Rc};

use swc_atoms::{js_word, JsWord};
use swc_common::collections::AHashSet;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::enable_helper;
use swc_ecma_visit::{
    as_folder, noop_visit_mut_type, noop_visit_type, Fold, Visit, VisitMut, VisitWith,
};

use super::util::Scope;

pub fn import_analyzer(scope: Rc<RefCell<Scope>>) -> impl Fold + VisitMut {
    as_folder(ImportAnalyzer {
        scope,
        import_srcs: Default::default(),
    })
}

pub struct ImportAnalyzer {
    scope: Rc<RefCell<Scope>>,
    import_srcs: AHashSet<JsWord>,
}

/// Inject required helpers methods **for** module transform passes.
impl VisitMut for ImportAnalyzer {
    noop_visit_mut_type!();

    fn visit_mut_module(&mut self, module: &mut Module) {
        self.visit_module(&*module);

        for (_, ty) in self.scope.borrow().import_types.iter() {
            if *ty {
                enable_helper!(interop_require_wildcard);
            } else {
                enable_helper!(interop_require_default);
            }
        }

        let (need_wildcard, need_default) = self.scope.borrow().unknown_imports;

        if need_wildcard {
            enable_helper!(interop_require_wildcard);
        }

        if need_default {
            enable_helper!(interop_require_default);
        }
    }
}

impl Visit for ImportAnalyzer {
    noop_visit_type!();

    fn visit_call_expr(&mut self, n: &CallExpr) {
        n.visit_children_with(self);
        let mut scope = self.scope.borrow_mut();
        if let Callee::Import(..) = &n.callee {
            if let Some(ExprOrSpread { spread: None, expr }) = n.args.first() {
                match &**expr {
                    Expr::Lit(Lit::Str(src)) => {
                        *scope.import_types.entry(src.value.clone()).or_default() = true;
                    }
                    _ => {
                        scope.unknown_imports.0 = true;
                    }
                }
            }
        }
    }

    fn visit_export_all(&mut self, export: &ExportAll) {
        *self
            .scope
            .borrow_mut()
            .import_types
            .entry(export.src.value.clone())
            .or_default() = true
    }

    fn visit_import_decl(&mut self, import: &ImportDecl) {
        let mut scope = self.scope.borrow_mut();
        if import.specifiers.is_empty() {
            // import 'foo';
            //   -> require('foo');
        } else if import.specifiers.len() == 1
            && matches!(import.specifiers[0], ImportSpecifier::Namespace(..))
        {
            scope.import_types.insert(import.src.value.clone(), true);
        } else {
            let mut has_non_default = false;

            for s in &import.specifiers {
                match *s {
                    ImportSpecifier::Namespace(ref _ns) => {
                        scope.import_types.insert(import.src.value.clone(), true);
                    }
                    ImportSpecifier::Default(_) => {
                        if !import.src.value.starts_with("@swc/helpers") {
                            let src = import.src.value.clone();
                            let src_already_exist = self.import_srcs.contains(&src);

                            scope.import_types.entry(src).or_insert(src_already_exist);
                        }
                    }
                    ImportSpecifier::Named(ref i) => {
                        let ImportNamedSpecifier {
                            ref local,
                            ref imported,
                            ..
                        } = *i;
                        let imported = match imported {
                            Some(ModuleExportName::Ident(ident)) => Some(ident),
                            Some(ModuleExportName::Str(..)) => {
                                unimplemented!("module string names unimplemented")
                            }
                            _ => None,
                        };
                        let name = imported
                            .as_ref()
                            .map(|i| i.sym.clone())
                            .unwrap_or_else(|| local.sym.clone());
                        let is_default = name == js_word!("default");

                        // in case of default import comes after named import, it needs to know
                        // if there's prior import to same src to determine interopDefault or
                        // interopWildcard.
                        self.import_srcs.insert(import.src.value.clone());

                        if is_default {
                            scope
                                .import_types
                                .entry(import.src.value.clone())
                                .or_insert(has_non_default);
                        } else {
                            has_non_default = true;
                            scope
                                .import_types
                                .entry(import.src.value.clone())
                                .and_modify(|v| *v = true);
                        }
                    }
                }
            }
        }
    }

    fn visit_named_export(&mut self, export: &NamedExport) {
        if export
            .specifiers
            .iter()
            .any(|v| matches!(v, ExportSpecifier::Namespace(..)))
        {
            let mut scope = self.scope.borrow_mut();

            if let Some(ref src) = export.src {
                *scope.import_types.entry(src.value.clone()).or_default() = true;
            }
            return;
        }

        let mut scope = self.scope.borrow_mut();
        for &ExportNamedSpecifier { ref orig, .. } in
            export.specifiers.iter().filter_map(|e| match *e {
                ExportSpecifier::Named(ref e) => Some(e),
                _ => None,
            })
        {
            let orig = match orig {
                ModuleExportName::Ident(ident) => ident,
                _ => unimplemented!("module string names unimplemented"),
            };
            let is_import_default = orig.sym == js_word!("default");

            if let Some(ref src) = export.src {
                if is_import_default {
                    scope.import_types.entry(src.value.clone()).or_insert(false);
                } else {
                    scope
                        .import_types
                        .entry(src.value.clone())
                        .and_modify(|v| *v = true);
                }
            }
        }
    }
}
