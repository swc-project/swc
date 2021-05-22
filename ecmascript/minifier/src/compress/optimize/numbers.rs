use crate::compress::optimize::Optimizer;
use swc_ecma_ast::*;

impl Optimizer<'_> {
    pub(super) fn optimize_expr_in_num_ctx(&mut self, e: &mut Expr) {
        match e {
            Expr::Lit(Lit::Str(Str { span, value, .. })) => {
                let value = if value.is_empty() { 0.0 } else { 1.0 };

                self.changed = true;
                log::trace!("numbers: Converting a string literal to {:?}", value);
                *e = Expr::Lit(Lit::Num(Number { span: *span, value }));
                return;
            }
            _ => {}
        }
    }
}
