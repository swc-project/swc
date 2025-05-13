use swc_common::{Mark, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};

pub fn strip_node_colon_prefix(unresolved_mark: Mark) -> impl Pass {
    visit_mut_pass(NodeColonPrefixStrip {
        unresolved_ctxt: SyntaxContext::empty().apply_mark(unresolved_mark),
    })
}

struct NodeColonPrefixStrip {
    unresolved_ctxt: SyntaxContext,
}

impl VisitMut for NodeColonPrefixStrip {
    noop_visit_mut_type!();

    fn visit_mut_import_decl(&mut self, node: &mut ImportDecl) {
        if let Some(value) = node.src.value.strip_prefix("node:") {
            node.src.value = value.into();
            node.src.raw = None;
        }
    }

    fn visit_mut_named_export(&mut self, node: &mut NamedExport) {
        let Some(src) = &mut node.src else {
            return;
        };
        if let Some(value) = src.value.strip_prefix("node:") {
            src.value = value.into();
            src.raw = None;
        }
    }

    fn visit_mut_export_all(&mut self, node: &mut ExportAll) {
        if let Some(value) = node.src.value.strip_prefix("node:") {
            node.src.value = value.into();
            node.src.raw = None;
        }
    }

    fn visit_mut_call_expr(&mut self, node: &mut CallExpr) {
        node.visit_mut_children_with(self);

        match &node.callee {
            Callee::Import(..) => {}
            Callee::Expr(expr)
                if expr
                    .as_ident()
                    .is_some_and(|id| id.sym == "require" && id.ctxt == self.unresolved_ctxt) => {}
            _ => return,
        }

        if let Some(source) = node
            .args
            .first_mut()
            .and_then(|arg| arg.expr.as_mut_lit())
            .and_then(|lit| lit.as_mut_str())
        {
            if let Some(value) = source.value.strip_prefix("node:") {
                source.value = value.into();
                source.raw = None;
            }
        }
    }
}
