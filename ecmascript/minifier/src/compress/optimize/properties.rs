use crate::compress::optimize::Optimizer;
use swc_atoms::js_word;
use swc_common::SyntaxContext;
use swc_ecma_ast::*;

impl Optimizer<'_> {
    pub(super) fn handle_known_computed_member_expr(&mut self, e: &mut MemberExpr) {
        if !self.options.props {
            return;
        }

        if !e.computed {
            return;
        }

        match &*e.prop {
            Expr::Lit(Lit::Str(s)) => {
                if s.value == js_word!("") {
                    return;
                }

                self.changed = true;

                e.computed = false;
                e.prop = Box::new(Expr::Ident(Ident::new(
                    s.value.clone(),
                    s.span.with_ctxt(SyntaxContext::empty()),
                )));
            }
            _ => {}
        }
    }
}
