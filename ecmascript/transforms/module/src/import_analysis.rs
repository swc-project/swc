use super::util::Scope;
use std::{cell::RefCell, rc::Rc};
use swc_atoms::js_word;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::enable_helper;
use swc_ecma_visit::{
    as_folder, noop_visit_mut_type, noop_visit_type, Fold, Node, Visit, VisitMut, VisitWith,
};

pub fn import_analyzer(scope: Rc<RefCell<Scope>>) -> impl Fold + VisitMut {
    as_folder(ImportAnalyzer { scope })
}

pub struct ImportAnalyzer {
    scope: Rc<RefCell<Scope>>,
}

/// Inject required helpers methods **for** module transform passes.
impl VisitMut for ImportAnalyzer {
    noop_visit_mut_type!();

    fn visit_mut_module(&mut self, module: &mut Module) {
        self.visit_module(&*module, &Invalid { span: DUMMY_SP } as _);

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

    fn visit_call_expr(&mut self, n: &CallExpr, _parent: &dyn Node) {
        n.visit_children_with(self);
        let mut scope = self.scope.borrow_mut();
        match &n.callee {
            ExprOrSuper::Expr(callee) => match &**callee {
                Expr::Ident(callee) => {
                    if callee.sym == js_word!("import") {
                        if let Some(ExprOrSpread { spread: None, expr }) = n.args.first() {
                            match &**expr {
                                Expr::Lit(Lit::Str(src)) => {
                                    *scope.import_types.entry(src.value.clone()).or_default() =
                                        true;
                                }
                                _ => {
                                    scope.unknown_imports.0 = true;
                                }
                            }
                        }
                    }
                }
                _ => {}
            },
            _ => {}
        }
    }

    fn visit_export_all(&mut self, export: &ExportAll, _parent: &dyn Node) {
        *self
            .scope
            .borrow_mut()
            .import_types
            .entry(export.src.value.clone())
            .or_default() = true
    }

    fn visit_import_decl(&mut self, import: &ImportDecl, _parent: &dyn Node) {
        let mut scope = self.scope.borrow_mut();
        if import.specifiers.is_empty() {
            // import 'foo';
            //   -> require('foo');
        } else if import.specifiers.len() == 1
            && match import.specifiers[0] {
                ImportSpecifier::Namespace(..) => true,
                _ => false,
            }
        {
            if &*import.src.value != "@swc/helpers" {
                scope.import_types.insert(import.src.value.clone(), true);
            }
        } else {
            let mut has_non_default = false;
            for s in &import.specifiers {
                match *s {
                    ImportSpecifier::Namespace(ref _ns) => {
                        if &*import.src.value != "@swc/helpers" {
                            scope.import_types.insert(import.src.value.clone(), true);
                        }
                    }
                    ImportSpecifier::Default(_) => {
                        scope
                            .import_types
                            .entry(import.src.value.clone())
                            .or_insert(false);
                    }
                    ImportSpecifier::Named(ref i) => {
                        let ImportNamedSpecifier {
                            ref local,
                            ref imported,
                            ..
                        } = *i;
                        let name = imported
                            .as_ref()
                            .map(|i| i.sym.clone())
                            .unwrap_or_else(|| local.sym.clone());
                        let is_default = name == js_word!("default");

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

    fn visit_named_export(&mut self, export: &NamedExport, _parent: &dyn Node) {
        if export.specifiers.iter().any(|v| match v {
            ExportSpecifier::Namespace(..) => true,
            _ => false,
        }) {
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
