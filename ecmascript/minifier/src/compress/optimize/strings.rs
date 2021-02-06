use super::Optimizer;
use swc_ecma_ast::*;

impl Optimizer {
    pub(super) fn convert_tpl_to_str(&mut self, e: &mut Expr) {
        match e {
            Expr::Tpl(t) if t.quasis.len() == 1 && t.exprs.is_empty() => {
                if let Some(c) = &t.quasis[0].cooked {
                    if c.value.chars().all(|c| match c {
                        '\u{0020}'..='\u{007e}' => true,
                        _ => false,
                    }) {
                        *e = Expr::Lit(Lit::Str(c.clone()));
                    }
                }
            }
            _ => {}
        }
    }
}
