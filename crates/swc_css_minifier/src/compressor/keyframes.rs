use swc_atoms::js_word;
use swc_common::DUMMY_SP;
use swc_css_ast::*;

use super::Compressor;
use crate::is_css_wide_keywords;

impl Compressor {
    pub(super) fn compress_keyframes_at_rule(&mut self, at_rule: &mut AtRule) {
        match at_rule.prelude.as_deref() {
            Some(AtRulePrelude::KeyframesPrelude(KeyframesName::Str(string)))
                if !is_css_wide_keywords(&*string.value) =>
            {
                at_rule.prelude = Some(Box::new(AtRulePrelude::KeyframesPrelude(
                    if let Some(escaped) = crate::escape::try_escape_if_shorter(&*string.value) {
                        KeyframesName::CustomIdent(CustomIdent {
                            span: string.span,
                            value: escaped.into(),
                            raw: None,
                        })
                    } else {
                        KeyframesName::Str(Str {
                            span: string.span,
                            value: string.value.clone(),
                            raw: None,
                        })
                    }
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
