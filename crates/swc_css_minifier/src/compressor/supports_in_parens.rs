use swc_css_ast::*;

use super::Compressor;

impl Compressor {
    pub(super) fn compress_supports_in_parens(&mut self, n: &mut SupportsInParens) {
        match n {
            SupportsInParens::SupportsCondition(supports_condition)
                if supports_condition.conditions.len() == 1 =>
            {
                if let Some(SupportsConditionType::SupportsInParens(supports_in_parens)) =
                    supports_condition.conditions.get(0)
                {
                    *n = supports_in_parens.clone();
                }
            }
            _ => {}
        }
    }
}
