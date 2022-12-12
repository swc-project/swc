use swc_common::util::take::Take;
use swc_css_ast::{
    AtRule, AtRulePrelude, CustomMediaQuery, CustomMediaQueryMediaType, MediaFeature,
    MediaFeatureBoolean, MediaFeatureName, MediaInParens, MediaQuery, Rule, Stylesheet,
};
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn process_custom_media_query(ss: &mut Stylesheet) {
    ss.visit_mut_with(&mut CustomMediaQueryTransform::default());
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
            return;
        }
    }

    fn visit_mut_media_query(&mut self, n: &mut MediaQuery) {
        n.visit_mut_children_with(self);

        dbg!(&*n);
    }

    fn visit_mut_media_in_parens(&mut self, n: &mut MediaInParens) {
        n.visit_mut_children_with(self);

        if let MediaInParens::Feature(box MediaFeature::Boolean(MediaFeatureBoolean {
            name: MediaFeatureName::Ident(name),
            span: bool_span,
        })) = n
        {
            //
            if let Some(media) = self.medias.iter().find(|m| m.name.value == name.value) {
                match &media.media {
                    CustomMediaQueryMediaType::Ident(m) => {
                        *n = MediaInParens::Feature(box MediaFeature::Boolean(
                            MediaFeatureBoolean {
                                span: *bool_span,
                                name: MediaFeatureName::Ident(m.clone()),
                            },
                        ));
                    }
                    CustomMediaQueryMediaType::MediaQueryList(m) => {}
                }
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
