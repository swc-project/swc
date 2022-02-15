use swc_common::DUMMY_SP;
use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn compress_keyframes() -> impl VisitMut {
    CompressKeyframes {}
}

struct CompressKeyframes {}

impl VisitMut for CompressKeyframes {
    fn visit_mut_keyframes_rule(&mut self, keyframes_rule: &mut KeyframesRule) {
        keyframes_rule.visit_mut_children_with(self);

        match &keyframes_rule.name {
            KeyframesName::Str(i)
                if !matches!(
                    &*i.value.to_lowercase(),
                    "initial" | "inherit" | "unset" | "revert" | "default"
                ) =>
            {
                keyframes_rule.name = KeyframesName::CustomIdent(CustomIdent {
                    span: i.span,
                    value: i.value.to_string().into(),
                    raw: i.raw[1..i.raw.len() - 1].to_string().into(),
                })
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
                        raw: "0%".into(),
                    },
                })
            }
            KeyframeSelector::Percentage(i) if i.value.value == 100.0 => {
                *keyframe_selector = KeyframeSelector::Ident(Ident {
                    span: i.span,
                    value: "to".into(),
                    raw: "to".into(),
                })
            }
            _ => {}
        }
    }
}
