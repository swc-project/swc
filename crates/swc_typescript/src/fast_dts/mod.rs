use std::{borrow::Cow, mem::take, sync::Arc};

use swc_atoms::Atom;
use swc_common::{FileName, Span, Spanned, DUMMY_SP};
use swc_ecma_ast::{
    BindingIdent, ExportDefaultExpr, Ident, ModuleDecl, ModuleItem, Pat, Program, Stmt,
    TsModuleBlock, VarDecl, VarDeclKind, VarDeclarator,
};
use swc_ecma_visit::{VisitMut, VisitMutWith, VisitWith};
use type_usage::{TypeRemover, TypeUsageAnalyzer};
use util::type_ann;

use crate::diagnostic::{DtsIssue, SourceRange};

mod class;
mod decl;
mod r#enum;
mod function;
mod inferrer;
mod type_usage;
mod types;
mod util;

/// TypeScript Isolated Declaration support.
///
/// ---
///
/// # License
///
/// Mostly copied from <https://github.com/denoland/deno_graph/blob/15db6e5fb6d3faea027e16c3d9ce6498b11beed2/src/fast_check/transform_dts.rs>
///
/// The original code is MIT licensed.
pub struct FastDts {
    filename: Arc<FileName>,
    diagnostics: Vec<DtsIssue>,
    id_counter: u32,
    is_top_level: bool,
    // TODO: strip_internal: bool,
}

/// Diagnostics
impl FastDts {
    pub fn new(filename: Arc<FileName>) -> Self {
        Self {
            filename,
            diagnostics: Vec::new(),
            id_counter: 0,
            is_top_level: true,
        }
    }

    pub fn mark_diagnostic<T: Into<Cow<'static, str>>>(&mut self, message: T, range: Span) {
        self.diagnostics.push(DtsIssue {
            message: message.into(),
            range: SourceRange {
                filename: self.filename.clone(),
                span: range,
            },
        })
    }
}

impl FastDts {
    pub fn transform(&mut self, program: &mut Program) -> Vec<DtsIssue> {
        // 1. Transform. We only keep decls.
        match program {
            Program::Module(module) => {
                module
                    .body
                    .retain(|item| item.as_stmt().map(|stmt| stmt.is_decl()).unwrap_or(true));
                Self::remove_module_function_overloads(module);
                self.transform_module_items(&mut module.body);
            }
            Program::Script(script) => {
                script.body.retain(|stmt| stmt.is_decl());
                Self::remove_script_function_overloads(script);
                for stmt in script.body.iter_mut() {
                    self.transform_decl(stmt.as_mut_decl().unwrap());
                }
            }
        }

        // 2. Remove unused imports and decls
        let mut type_usage_analyzer = TypeUsageAnalyzer::default();
        program.visit_with(&mut type_usage_analyzer);
        program.visit_mut_with(&mut TypeRemover::new(
            &type_usage_analyzer,
            program.is_module(),
        ));

        // 3. Strip export in ts module block
        program.visit_mut_with(&mut StripExportKeyword);

        take(&mut self.diagnostics)
    }

    fn transform_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        let orig_items = take(items);
        let mut new_items = Vec::with_capacity(orig_items.len());

        for mut item in orig_items {
            match &mut item {
                ModuleItem::ModuleDecl(
                    ModuleDecl::Import(..)
                    | ModuleDecl::TsImportEquals(_)
                    | ModuleDecl::TsNamespaceExport(_)
                    | ModuleDecl::TsExportAssignment(_)
                    | ModuleDecl::ExportNamed(_)
                    | ModuleDecl::ExportAll(_),
                ) => new_items.push(item),
                ModuleItem::Stmt(stmt) => {
                    self.transform_decl(stmt.as_mut_decl().unwrap());
                    new_items.push(item);
                }
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(expor_decl)) => {
                    self.transform_decl(&mut expor_decl.decl);
                    new_items.push(item);
                }
                ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(export)) => {
                    self.transform_default_decl(&mut export.decl);
                    new_items.push(item);
                }
                ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(export)) => {
                    if export.expr.is_ident() {
                        new_items.push(item);
                        continue;
                    }

                    let name_ident = Ident::new_no_ctxt(self.gen_unique_name("_default"), DUMMY_SP);
                    let type_ann = self.infer_type_from_expr(&export.expr).map(type_ann);

                    if type_ann.is_none() {
                        self.default_export_inferred(export.expr.span());
                    }

                    new_items.push(
                        VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Const,
                            declare: true,
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(BindingIdent {
                                    id: name_ident.clone(),
                                    type_ann,
                                }),
                                init: None,
                                definite: false,
                            }],
                            ..Default::default()
                        }
                        .into(),
                    );

                    new_items.push(
                        ExportDefaultExpr {
                            span: export.span,
                            expr: name_ident.into(),
                        }
                        .into(),
                    )
                }
            }
        }

        *items = new_items;
    }

    fn gen_unique_name(&mut self, name: &str) -> Atom {
        self.id_counter += 1;
        format!("{name}_{}", self.id_counter).into()
    }
}

struct StripExportKeyword;

impl VisitMut for StripExportKeyword {
    fn visit_mut_ts_module_block(&mut self, node: &mut TsModuleBlock) {
        for module_item in node.body.iter_mut() {
            if let ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(export_decl)) = module_item {
                *module_item = ModuleItem::Stmt(Stmt::Decl(export_decl.decl.clone()));
            }
        }
    }
}
