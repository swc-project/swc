use std::mem::take;

use swc_ecma_ast::{Decl, ExportDecl, FnDecl, Module, ModuleDecl, ModuleItem, Stmt};

pub struct Checker {}

impl Checker {
    pub fn transform(&mut self, module: &mut Module) {}

    fn transform_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        let items = take(items);
        let mut new_items = Vec::with_capacity(items.len());

        let mut prev_is_overload = false;

        for mut item in items {
            let is_overload = match item {
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl { decl, .. }))
                | ModuleItem::Stmt(Stmt::Decl(decl)) => match decl {
                    Decl::Fn(FnDecl {
                        function, declare, ..
                    }) => !declare && function.body.is_none(),
                    _ => false,
                },
            };

            match &mut item {
                ModuleItem::ModuleDecl(ModuleDecl::Import(..)) => new_items.push(item),

                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    span, decl, ..
                })) => {
                    let should_keep = prev_is_overload && !is_overload;

                    if should_keep {
                        prev_is_overload = is_overload;
                        continue;
                    }

                    if let Some(decl) = self.decl_to_type_decl(decl) {
                        new_items.push(ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(
                            ExportDecl { decl, span: *span },
                        )));
                    } else {
                        self.mark_diagnostic(FastCheckDtsDiagnostic::UnableToInferType {
                            range: self.source_range_to_range(export_decl.range()),
                        })
                    }
                }
            }

            prev_is_overload = is_overload;
        }
    }
}
