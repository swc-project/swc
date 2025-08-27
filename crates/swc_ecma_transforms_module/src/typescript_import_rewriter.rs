use swc_ecma_ast::*;
use swc_ecma_visit::{visit_mut_pass, VisitMut};

/// Import rewriter, which rewrites imports as es modules.
pub fn typescript_import_rewriter() -> impl Pass {
    visit_mut_pass(Rewriter)
}

struct Rewriter;

impl VisitMut for Rewriter {
    fn visit_mut_call_expr(&mut self, e: &mut CallExpr) {}

    fn visit_mut_import_decl(&mut self, i: &mut ImportDecl) {}

    fn visit_mut_named_export(&mut self, e: &mut NamedExport) {}

    fn visit_mut_export_all(&mut self, n: &mut ExportAll) {}
}
