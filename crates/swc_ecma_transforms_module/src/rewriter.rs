use std::sync::Arc;

use anyhow::Context;
use swc_common::FileName;
use swc_ecma_ast::*;
use swc_ecma_visit::{visit_mut_pass, VisitMut, VisitMutWith};

use crate::path::ImportResolver;

pub struct ImportRewriterOptions {
    pub base: FileName,
    pub resolver: Arc<dyn ImportResolver>,
    pub rewrite_relative_import_extensions: bool,
}

/// Import rewriter, which rewrites imports as es modules.
pub fn import_rewriter(options: ImportRewriterOptions) -> impl Pass {
    visit_mut_pass(Rewriter { options })
}

struct Rewriter {
    options: ImportRewriterOptions,
}

impl VisitMut for Rewriter {
    fn visit_mut_call_expr(&mut self, e: &mut CallExpr) {
        e.visit_mut_children_with(self);

        if let Callee::Import(_) = &e.callee {
            if let Some(ExprOrSpread { spread: None, expr }) = &mut e.args.get_mut(0) {
                if let Expr::Lit(Lit::Str(s)) = &mut **expr {
                    let src = self
                        .options
                        .resolver
                        .resolve_import(&self.options.base, &s.value)
                        .with_context(|| format!("failed to resolve import `{}`", s.value))
                        .unwrap();

                    s.raw = None;
                    s.value = src;
                }
            }
        }
    }

    fn visit_mut_import_decl(&mut self, i: &mut ImportDecl) {
        let src = self
            .options
            .resolver
            .resolve_import(&self.options.base, &i.src.value)
            .with_context(|| format!("failed to resolve import `{}`", i.src.value))
            .unwrap();

        i.src.raw = None;
        i.src.value = src;
    }

    fn visit_mut_named_export(&mut self, e: &mut NamedExport) {
        if let Some(src) = &mut e.src {
            let new = self
                .options
                .resolver
                .resolve_import(&self.options.base, &src.value)
                .with_context(|| format!("failed to resolve import `{}`", src.value))
                .unwrap();

            src.raw = None;
            src.value = new;
        }
    }

    fn visit_mut_export_all(&mut self, n: &mut ExportAll) {
        let src = &mut n.src;

        let new = self
            .options
            .resolver
            .resolve_import(&self.options.base, &src.value)
            .with_context(|| format!("failed to resolve import `{}`", src.value))
            .unwrap();

        src.raw = None;
        src.value = new;
    }
}
