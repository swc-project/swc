use crate::path::ImportResolver;
use anyhow::Context;
use swc_atoms::js_word;
use swc_common::FileName;
use swc_ecma_ast::*;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

/// Import rewriter, which rewrites imports as es modules.
pub fn import_rewriter<R>(base: FileName, resolver: R) -> impl Fold + VisitMut
where
    R: ImportResolver,
{
    as_folder(Rewriter { base, resolver })
}

struct Rewriter<R>
where
    R: ImportResolver,
{
    base: FileName,
    resolver: R,
}

impl<R> VisitMut for Rewriter<R>
where
    R: ImportResolver,
{
    noop_visit_mut_type!();

    fn visit_mut_call_expr(&mut self, e: &mut CallExpr) {
        e.visit_mut_children_with(self);

        match &e.callee {
            ExprOrSuper::Expr(callee) => match &**callee {
                Expr::Ident(Ident {
                    sym: js_word!("import"),
                    ..
                }) => {
                    if let Some(ExprOrSpread { spread: None, expr }) = &mut e.args.get_mut(0) {
                        match &mut **expr {
                            Expr::Lit(Lit::Str(s)) => {
                                let src = self
                                    .resolver
                                    .resolve_import(&self.base, &s.value)
                                    .with_context(|| {
                                        format!("failed to resolve import `{}`", s.value)
                                    })
                                    .unwrap();

                                s.value = src;
                            }
                            _ => {}
                        }
                    }
                }
                _ => {}
            },
            _ => {}
        }
    }

    fn visit_mut_import_decl(&mut self, i: &mut ImportDecl) {
        let src = self
            .resolver
            .resolve_import(&self.base, &i.src.value)
            .with_context(|| format!("failed to resolve import `{}`", i.src.value))
            .unwrap();

        i.src.value = src;
    }

    fn visit_mut_named_export(&mut self, e: &mut NamedExport) {
        if let Some(src) = &mut e.src {
            let new = self
                .resolver
                .resolve_import(&self.base, &src.value)
                .with_context(|| format!("failed to resolve import `{}`", src.value))
                .unwrap();

            src.value = new;
        }
    }
}
