use swc_common::util::take::Take;
use swc_css_ast::{AtRule, AtRulePrelude, CustomMediaQuery, MediaQueryList};

#[derive(Debug, Default)]
pub(super) struct CustomMediaHandler {
    medias: Vec<CustomMediaQuery>,
}

impl CustomMediaHandler {
    pub fn store_custom_media(&self, n: &mut AtRule) {
        if n.name == *"custom-media" {
            if let Some(box AtRulePrelude::CustomMediaPrelude(prelude)) = &mut n.prelude {
                self.medias.push(prelude.take());
            }
        }
    }

    pub fn process_media_query_list(&self, n: &mut MediaQueryList) {}
}
