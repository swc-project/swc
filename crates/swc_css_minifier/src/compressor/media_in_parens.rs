use swc_css_ast::*;

use super::Compressor;

impl Compressor {
    pub(super) fn compress_media_in_parens(&mut self, n: &mut MediaInParens) {
        match n {
            MediaInParens::MediaCondition(media_condition)
                if media_condition.conditions.len() == 1 =>
            {
                if let Some(MediaConditionAllType::MediaInParens(media_in_parens)) =
                    media_condition.conditions.get(0)
                {
                    *n = media_in_parens.clone();
                }
            }
            _ => {}
        }
    }
}
