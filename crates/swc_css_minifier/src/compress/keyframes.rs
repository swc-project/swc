use swc_atoms::js_word;
use swc_common::DUMMY_SP;
use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn compress_keyframes() -> impl VisitMut {
    CompressKeyframes {}
}

struct CompressKeyframes {}

impl VisitMut for CompressKeyframes {
    fn visit_mut_at_rule(&mut self, at_rule: &mut AtRule) {
        at_rule.visit_mut_children_with(self);

        match &at_rule.prelude {
            Some(AtRulePrelude::KeyframesPrelude(KeyframesName::Str(string)))
                if !matches!(
                    string.value.to_ascii_lowercase(),
                    js_word!("initial")
                        | js_word!("inherit")
                        | js_word!("unset")
                        | js_word!("revert")
                        | js_word!("default")
                        | js_word!("none")
                ) =>
            {
                at_rule.prelude = Some(AtRulePrelude::KeyframesPrelude(
                    KeyframesName::CustomIdent(CustomIdent {
                        span: string.span,
                        value: string.value.to_string().into(),
                        raw: None,
                    }),
                ));
            }
            _ => {}
        }
    }

    fn visit_mut_keyframe_selector(&mut self, keyframe_selector: &mut KeyframeSelector) {
        keyframe_selector.visit_mut_children_with(self);

        match keyframe_selector {
            KeyframeSelector::Ident(i) if &*i.value.to_lowercase() == "from" => {
                *keyframe_selector = KeyframeSelector::Percentage(Percentage {
                    span: i.span,
                    value: Number {
                        span: DUMMY_SP,
                        value: 0.0,
                        raw: None,
                    },
                })
            }
            KeyframeSelector::Percentage(i) if i.value.value == 100.0 => {
                *keyframe_selector = KeyframeSelector::Ident(Ident {
                    span: i.span,
                    value: "to".into(),
                    raw: None,
                })
            }
            _ => {}
        }
    }
}
