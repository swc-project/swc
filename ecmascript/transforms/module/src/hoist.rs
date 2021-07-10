use std::{borrow::Cow, mem::take};
use swc_common::pass::CompilerPass;
use swc_ecma_ast::*;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut};

pub fn import_hoister() -> impl Fold + VisitMut + CompilerPass {
    as_folder(Hoister)
}

struct Hoister;

impl CompilerPass for Hoister {
    fn name() -> Cow<'static, str> {
        Cow::Borrowed("import-hoister")
    }
}

impl VisitMut for Hoister {
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
