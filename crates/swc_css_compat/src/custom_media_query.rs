use swc_common::util::take::Take;
use swc_css_ast::{AtRule, AtRulePrelude, CustomMediaQuery, Rule};
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn custom_media_query() -> impl VisitMut {
    CustomMediaQueryTransform::default()
}

#[derive(Debug, Default)]
struct CustomMediaQueryTransform {
    medias: Vec<CustomMediaQuery>,
}

impl VisitMut for CustomMediaQueryTransform {
    fn visit_mut_at_rule(&mut self, n: &mut AtRule) {
        n.visit_mut_children_with(self);

        if n.name == *"custom-media" {
            if let Some(box AtRulePrelude::CustomMediaPrelude(prelude)) = &mut n.prelude {
                self.medias.push(prelude.take());
            }
        }
    }

    fn visit_mut_rules(&mut self, n: &mut Vec<Rule>) {
        n.visit_mut_children_with(self);

        n.retain(|n| match n {
            Rule::AtRule(n) => n.name != *"custom-media",
            _ => true,
        });
    }
}
