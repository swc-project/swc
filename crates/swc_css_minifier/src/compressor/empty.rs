use swc_atoms::{js_word, JsWord};
use swc_css_ast::*;

use super::Compressor;

impl Compressor {
    pub(super) fn compresss_empty_stylesheet(&self, stylesheet: &mut Stylesheet) {
        stylesheet.rules.retain(|rule| match rule {
            Rule::QualifiedRule(QualifiedRule { block, .. }) if block.value.is_empty() => false,
            Rule::AtRule(AtRule {
                name: AtRuleName::Ident(Ident { value, .. }),
                block: Some(block),
                ..
            }) if !need_keep_by_name(value) && block.value.is_empty() => false,
            _ => true,
        });
    }

    pub(super) fn compresss_empty_simple_block(&self, simple_block: &mut SimpleBlock) {
        simple_block.value.retain(|rule| match rule {
            ComponentValue::Rule(Rule::QualifiedRule(QualifiedRule { block, .. }))
            | ComponentValue::Rule(Rule::AtRule(AtRule {
                block: Some(block), ..
            }))
            | ComponentValue::StyleBlock(StyleBlock::QualifiedRule(QualifiedRule {
                block, ..
            }))
            | ComponentValue::StyleBlock(StyleBlock::AtRule(AtRule {
                block: Some(block), ..
            }))
            | ComponentValue::DeclarationOrAtRule(DeclarationOrAtRule::AtRule(AtRule {
                block: Some(block),
                ..
            }))
            | ComponentValue::KeyframeBlock(KeyframeBlock { block, .. })
                if block.value.is_empty() =>
            {
                false
            }
            _ => true,
        });
    }
}

fn need_keep_by_name(name: &JsWord) -> bool {
    matches!(
        name.to_ascii_lowercase(),
        js_word!("counter-style")
            | js_word!("color-profile")
            | js_word!("font-palette-values")
            | js_word!("layer")
    )
}
