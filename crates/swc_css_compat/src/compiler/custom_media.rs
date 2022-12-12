use swc_common::util::take::Take;
use swc_css_ast::{AtRule, AtRulePrelude, CustomMediaQuery, MediaQuery, MediaQueryList};

#[derive(Debug, Default)]
pub(super) struct CustomMediaHandler {
    medias: Vec<CustomMediaQuery>,
}

impl CustomMediaHandler {
    pub fn store_custom_media(&mut self, n: &mut AtRule) {
        if n.name == *"custom-media" {
            if let Some(box AtRulePrelude::CustomMediaPrelude(prelude)) = &mut n.prelude {
                self.medias.push(prelude.take());
            }
        }
    }

    pub fn process_media_query_list(&mut self, n: &mut MediaQueryList) {
        let mut new = Vec::with_capacity(n.queries.len());

        for q in n.queries.iter_mut() {
            self.process_media_query(&mut new, &mut q);
        }

        n.queries = new;
    }

    fn process_media_query(&mut self, to: &mut Vec<MediaQuery>, n: &mut MediaQuery) {}
}
