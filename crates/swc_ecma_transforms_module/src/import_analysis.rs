use swc_atoms::JsWord;
use swc_common::collections::AHashMap;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::enable_helper;
use swc_ecma_visit::{
    as_folder, noop_visit_mut_type, noop_visit_type, Fold, Visit, VisitMut, VisitWith,
};

use crate::module_decl_strip::LinkFlag;

pub fn import_analyzer(no_interop: bool, ignore_dynamic: bool) -> impl Fold + VisitMut {
    as_folder(ImportAnalyzer {
        no_interop,
        ignore_dynamic,
        flag_record: Default::default(),
        dynamic_import_found: false,
    })
}

pub struct ImportAnalyzer {
    no_interop: bool,
    ignore_dynamic: bool,

    flag_record: AHashMap<JsWord, LinkFlag>,
    dynamic_import_found: bool,
}

/// Inject required helpers methods **for** module transform passes.
impl VisitMut for ImportAnalyzer {
    noop_visit_mut_type!();

    fn visit_mut_module(&mut self, module: &mut Module) {
        self.visit_module(&*module);
    }
}

impl Visit for ImportAnalyzer {
    noop_visit_type!();

    fn visit_module_items(&mut self, n: &[ModuleItem]) {
        for item in n.iter() {
            if item.is_module_decl() {
                item.visit_with(self);
            }
        }

        let flag_record = &self.flag_record;

        if flag_record.values().any(|flag| flag.export_star()) {
            enable_helper!(export_star);
        }

        if self.no_interop {
            return;
        }

        if flag_record
            .values()
            .any(|flag| flag.interop() && !flag.has_named())
        {
            enable_helper!(interop_require_default);
        }

        if flag_record.values().any(|flag| flag.namespace()) {
            enable_helper!(interop_require_wildcard);
        } else if !self.ignore_dynamic {
            // `import/export * as foo from "foo"` not found
            // but it may be used with dynamic import
            for item in n.iter() {
                if item.is_stmt() {
                    item.visit_with(self);
                }
                if self.dynamic_import_found {
                    enable_helper!(interop_require_wildcard);
                    break;
                }
            }
        }
    }

    fn visit_import_decl(&mut self, n: &ImportDecl) {
        let flag = self.flag_record.entry(n.src.value.clone()).or_default();
        for s in &n.specifiers {
            *flag |= s.into();
        }
    }

    fn visit_named_export(&mut self, n: &NamedExport) {
        if let Some(src) = n.src.clone() {
            let flag = self.flag_record.entry(src.value).or_default();
            for s in &n.specifiers {
                *flag |= s.into();
            }
        }
    }

    fn visit_export_all(&mut self, n: &ExportAll) {
        *self.flag_record.entry(n.src.value.clone()).or_default() |= LinkFlag::EXPORT_STAR;
    }

    fn visit_import(&mut self, _: &Import) {
        self.dynamic_import_found = true;
    }
}
