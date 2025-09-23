use std::sync::Arc;

use anyhow::Context;
use swc_common::FileName;
use swc_ecma_ast::*;
use swc_ecma_visit::{visit_mut_pass, VisitMut, VisitMutWith};

use crate::{path::ImportResolver, wtf8::wtf8_to_cow_str};

/// Import rewriter, which rewrites imports as es modules.
pub fn swc_import_rewriter(base: FileName, resolver: Arc<dyn ImportResolver>) -> impl Pass {
    visit_mut_pass(Rewriter { base, resolver })
}

struct Rewriter {
    base: FileName,
    resolver: Arc<dyn ImportResolver>,
}

impl VisitMut for Rewriter {
    fn visit_mut_call_expr(&mut self, e: &mut CallExpr) {
        e.visit_mut_children_with(self);

        if !e.callee.is_import() {
            return;
        }

        if let Some(ExprOrSpread { spread: None, expr }) = &mut e.args.get_mut(0) {
            if let Expr::Lit(Lit::Str(s)) = &mut **expr {
                let spec = wtf8_to_cow_str(&s.value);
                let src = self
                    .resolver
                    .resolve_import(&self.base, &spec)
                    .with_context(|| {
                        format!("failed to resolve import `{}`", s.value.to_string_lossy())
                    })
                    .unwrap();

                s.raw = None;
                s.value = src.into();
            }
        }
    }

    fn visit_mut_import_decl(&mut self, i: &mut ImportDecl) {
        let spec = wtf8_to_cow_str(&i.src.value);
        let src = self
            .resolver
            .resolve_import(&self.base, &spec)
            .with_context(|| {
                format!(
                    "failed to resolve import `{}`",
                    i.src.value.to_string_lossy()
                )
            })
            .unwrap();

        i.src.raw = None;
        i.src.value = src.into();
    }

    fn visit_mut_named_export(&mut self, e: &mut NamedExport) {
        if let Some(src) = &mut e.src {
            let spec = wtf8_to_cow_str(&src.value);
            let new = self
                .resolver
                .resolve_import(&self.base, &spec)
                .with_context(|| {
                    format!("failed to resolve import `{}`", src.value.to_string_lossy())
                })
                .unwrap();

            src.raw = None;
            src.value = new.into();
        }
    }

    fn visit_mut_export_all(&mut self, n: &mut ExportAll) {
        let src = &mut n.src;

        let spec = wtf8_to_cow_str(&src.value);
        let new = self
            .resolver
            .resolve_import(&self.base, &spec)
            .with_context(|| format!("failed to resolve import `{}`", src.value.to_string_lossy()))
            .unwrap();

        src.raw = None;
        src.value = new.into();
    }
}
