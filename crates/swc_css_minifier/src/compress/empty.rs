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
            Rule::QualifiedRule(QualifiedRule { block, .. })
            | Rule::AtRule(AtRule::FontFace(FontFaceRule { block, .. }))
            | Rule::AtRule(AtRule::Keyframes(KeyframesRule { block, .. }))
            | Rule::AtRule(AtRule::Layer(LayerRule {
                block: Some(block), ..
            }))
            | Rule::AtRule(AtRule::Media(MediaRule { block, .. }))
            | Rule::AtRule(AtRule::Supports(SupportsRule { block, .. }))
            | Rule::AtRule(AtRule::Page(PageRule { block, .. }))
            | Rule::AtRule(AtRule::Viewport(ViewportRule { block, .. }))
            | Rule::AtRule(AtRule::Document(DocumentRule { block, .. }))
            | Rule::AtRule(AtRule::Property(PropertyRule { block, .. }))
                if block.value.is_empty() =>
            {
                false
            }
            _ => true,
        });
    }

    fn visit_mut_simple_block(&mut self, simple_block: &mut SimpleBlock) {
        simple_block.visit_mut_children_with(self);

        simple_block.value.retain(|rule| match rule {
            ComponentValue::Rule(Rule::QualifiedRule(QualifiedRule { block, .. }))
            | ComponentValue::Rule(Rule::AtRule(AtRule::Media(MediaRule { block, .. })))
            | ComponentValue::Rule(Rule::AtRule(AtRule::Supports(SupportsRule {
                block, ..
            })))
            | ComponentValue::Rule(Rule::AtRule(AtRule::Keyframes(KeyframesRule {
                block, ..
            })))
            | ComponentValue::Rule(Rule::AtRule(AtRule::FontFace(FontFaceRule {
                block, ..
            })))
            | ComponentValue::DeclarationOrAtRule(DeclarationOrAtRule::AtRule(
                AtRule::PageMargin(PageMarginRule { block, .. }),
            ))
            | ComponentValue::StyleBlock(StyleBlock::QualifiedRule(QualifiedRule {
                block, ..
            }))
            | ComponentValue::StyleBlock(StyleBlock::AtRule(AtRule::Nest(NestRule {
                block,
                ..
            })))
            | ComponentValue::StyleBlock(StyleBlock::AtRule(AtRule::Media(MediaRule {
                block,
                ..
            })))
            | ComponentValue::StyleBlock(StyleBlock::AtRule(AtRule::Supports(SupportsRule {
                block,
                ..
            })))
            | ComponentValue::StyleBlock(StyleBlock::AtRule(AtRule::Document(DocumentRule {
                block,
                ..
            })))
            | ComponentValue::KeyframeBlock(KeyframeBlock { block, .. })
                if block.value.is_empty() =>
            {
                false
            }
            _ => true,
        });
    }
}
