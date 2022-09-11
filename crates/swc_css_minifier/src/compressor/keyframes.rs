use swc_atoms::js_word;
use swc_common::DUMMY_SP;
use swc_css_ast::*;

use super::Compressor;

impl Compressor {
    pub(super) fn compress_keyframes_at_rule(&mut self, at_rule: &mut AtRule) {
        match at_rule.prelude.as_deref() {
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
                at_rule.prelude = Some(Box::new(AtRulePrelude::KeyframesPrelude(
                    KeyframesName::CustomIdent(CustomIdent {
                        span: string.span,
                        value: string.value.to_string().into(),
                        raw: None,
                    }),
                )));
            }
            _ => {}
        }
    }

    pub(super) fn compress_keyframe_selector(&mut self, keyframe_selector: &mut KeyframeSelector) {
        match keyframe_selector {
            KeyframeSelector::Ident(i) if i.value.to_ascii_lowercase() == js_word!("from") => {
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
