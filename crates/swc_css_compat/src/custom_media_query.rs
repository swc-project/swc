use swc_atoms::js_word;
use swc_common::util::take::Take;
use swc_css_ast::{
    AtRule, AtRulePrelude, CustomMediaQuery, CustomMediaQueryMediaType, Ident, MediaCondition,
    MediaConditionAllType, MediaFeature, MediaFeatureBoolean, MediaFeatureName, MediaInParens,
    MediaQuery, MediaQueryList, Rule, Stylesheet,
};
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn process_custom_media_query(ss: &mut Stylesheet) {
    ss.visit_mut_with(&mut CustomMediaQueryTransform::default());
}

#[derive(Debug, Default)]
struct CustomMediaQueryTransform {
    medias: Vec<CustomMediaQuery>,

    new_medias: Vec<MediaQuery>,
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

    fn visit_mut_media_query_list(&mut self, n: &mut MediaQueryList) {
        let prev = self.new_medias.take();

        let mut new = Vec::with_capacity(n.queries.len());

        for mut q in n.queries.take() {
            q.visit_mut_with(self);

            new.push(q);

            new.append(&mut self.new_medias);
        }

        n.queries = new;
        self.new_medias = prev;
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
                name.take();

                match &media.media {
                    CustomMediaQueryMediaType::Ident(m) => {
                        *n = MediaInParens::Feature(box MediaFeature::Boolean(
                            MediaFeatureBoolean {
                                span: *bool_span,
                                name: MediaFeatureName::Ident(m.clone()),
                            },
                        ));
                    }
                    CustomMediaQueryMediaType::MediaQueryList(m) => {
                        self.new_medias.extend(m.queries.iter().cloned());
                    }
                }
            }
        }
    }

    fn visit_mut_media_condition_all_types(&mut self, n: &mut Vec<MediaConditionAllType>) {
        n.visit_mut_children_with(self);

        n.retain(|n| match n {
            MediaConditionAllType::MediaInParens(MediaInParens::Feature(
                box MediaFeature::Boolean(MediaFeatureBoolean {
                    name:
                        MediaFeatureName::Ident(Ident {
                            value: js_word!(""),
                            ..
                        }),
                    ..
                }),
            )) => false,
            _ => true,
        })
    }

    fn visit_mut_rules(&mut self, n: &mut Vec<Rule>) {
        n.visit_mut_children_with(self);

        n.retain(|n| match n {
            Rule::AtRule(n) => n.name != *"custom-media",
            _ => true,
        });
    }
}
