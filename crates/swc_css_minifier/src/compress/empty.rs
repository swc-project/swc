use swc_atoms::js_word;
use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn compress_empty() -> impl VisitMut {
    CompressEmpty {}
}

struct CompressEmpty {}

impl VisitMut for CompressEmpty {
    fn visit_mut_stylesheet(&mut self, stylesheet: &mut Stylesheet) {
        stylesheet.visit_mut_children_with(self);

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

    fn visit_mut_simple_block(&mut self, simple_block: &mut SimpleBlock) {
        simple_block.visit_mut_children_with(self);

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

fn need_keep_by_name(name: &str) -> bool {
    matches!(
        name.to_ascii_lowercase(),
        js_word!("counter-style")
            | js_word!("color-profile")
            | js_word!("font-palette-values")
            | js_word!("layer")
    )
}
