use std::{borrow::Cow, mem::take};
use swc_common::pass::CompilerPass;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut};

/// Import statements must be hoisted to the top of the module.
pub fn import_hoister() -> impl Fold + VisitMut + CompilerPass {
    as_folder(ImportHoister)
}

/// Moves named `export *` to end of the module.
///
/// See https://github.com/swc-project/swc/issues/1714
pub(crate) fn export_hoister() -> impl Fold + VisitMut {
    as_folder(ExportHoister)
}

struct ImportHoister;

impl CompilerPass for ImportHoister {
    fn name() -> Cow<'static, str> {
        Cow::Borrowed("import-hoister")
    }
}

impl VisitMut for ImportHoister {
    noop_visit_mut_type!();

    fn visit_mut_module(&mut self, module: &mut Module) {
        let mut found_other = false;
        let mut need_work = false;

        for stmt in &module.body {
            match stmt {
                ModuleItem::ModuleDecl(ModuleDecl::Import(..)) => {
                    if found_other {
                        need_work = true;
                        break;
                    }
                }
                _ => {
                    found_other = true;
                }
            }
        }

        if !need_work {
            return;
        }

        let mut imports = Vec::with_capacity(module.body.len());
        let mut extra = vec![];

        for body in take(&mut module.body) {
            match body {
                ModuleItem::ModuleDecl(ModuleDecl::Import(..)) => {
                    imports.push(body);
                }
                _ => {
                    extra.push(body);
                }
            }
        }

        imports.extend(extra);
        module.body = imports;
    }
}

struct ExportHoister;

impl VisitMut for ExportHoister {
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        {
            let mut found_other = false;
            let mut need_work = false;

            for stmt in items.iter().rev() {
                match stmt {
                    ModuleItem::ModuleDecl(ModuleDecl::ExportAll(..)) => {
                        if found_other {
                            need_work = true;
                            break;
                        }
                    }
                    _ => {
                        found_other = true;
                    }
                }
            }

            if !need_work {
                return;
            }
        }

        let mut other = vec![];
        let mut export_alls = vec![];

        for item in items.take() {
            match item {
                ModuleItem::ModuleDecl(ModuleDecl::ExportAll(..)) => {
                    export_alls.push(item);
                }
                _ => other.push(item),
            }
        }

        other.extend(export_alls);

        *items = other;
    }
}
