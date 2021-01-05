use super::util::Scope;
use swc_atoms::js_word;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::enable_helper;
use swc_ecma_visit::noop_visit_type;
use swc_ecma_visit::{noop_fold_type, Fold, Node, Visit};

pub fn import_analyzer() -> impl Fold {
    ImportAnalyzer {
        scope: Default::default(),
    }
}

/// Inject required helpers methods **for** module transform passes.
struct ImportAnalyzer {
    scope: Scope,
}

impl Fold for ImportAnalyzer {
    noop_fold_type!();

    fn fold_module(&mut self, module: Module) -> Module {
        self.visit_module(&module, &Invalid { span: DUMMY_SP } as _);

        for (_, ty) in self.scope.import_types.drain() {
            if ty {
                enable_helper!(interop_require_wildcard);
            } else {
                enable_helper!(interop_require_default);
            }
        }

        module
    }
}

impl Visit for ImportAnalyzer {
    noop_visit_type!();

    fn visit_export_all(&mut self, export: &ExportAll, _parent: &dyn Node) {
        *self
            .scope
            .import_types
            .entry(export.src.value.clone())
            .or_default() = true
    }

    fn visit_import_decl(&mut self, import: &ImportDecl, _parent: &dyn Node) {
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
                self.scope
                    .import_types
                    .insert(import.src.value.clone(), true);
            }
        } else {
            for s in &import.specifiers {
                match *s {
                    ImportSpecifier::Namespace(..) => unreachable!(
                        "import * as foo cannot be used with other type of import specifiers"
                    ),
                    ImportSpecifier::Default(_) => {
                        self.scope
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
                            self.scope
                                .import_types
                                .entry(import.src.value.clone())
                                .or_insert(false);
                        } else {
                            self.scope
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
        for &ExportNamedSpecifier { ref orig, .. } in export.specifiers.iter().map(|e| match *e {
            ExportSpecifier::Named(ref e) => e,
            _ => unreachable!("export default from 'foo'; should be removed by previous pass"),
        }) {
            let is_import_default = orig.sym == js_word!("default");

            if let Some(ref src) = export.src {
                if is_import_default {
                    self.scope
                        .import_types
                        .entry(src.value.clone())
                        .or_insert(false);
                } else {
                    self.scope
                        .import_types
                        .entry(src.value.clone())
                        .and_modify(|v| *v = true);
                }
            }
        }
    }
}
