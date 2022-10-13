use swc_atoms::{js_word, JsWord};
use swc_common::collections::AHashMap;
use swc_css_ast::*;

use super::Compressor;

enum ParentNode<'a> {
    Stylesheet(&'a mut Stylesheet),
    SimpleBlock(&'a mut SimpleBlock),
}

#[derive(Eq, Hash, PartialEq)]
enum Name {
    CounterStyle(JsWord),
    // We need to keep prefixed keyframes, i.e. `@-webkit-keyframes`
    Keyframes(JsWord, JsWord),
}

impl Compressor {
    fn get_at_rule_name(&self, at_rule: &AtRule) -> JsWord {
        match &at_rule.name {
            AtRuleName::Ident(Ident { value, .. }) => value.to_ascii_lowercase(),
            AtRuleName::DashedIdent(DashedIdent { value, .. }) => value.to_ascii_lowercase(),
        }
    }

    fn collect_names(&self, rule: &Rule, names: &mut AHashMap<Name, isize>) {
        if let Rule::AtRule(box at_rule) = rule {
            match &at_rule.prelude {
                Some(box AtRulePrelude::CounterStylePrelude(CustomIdent {
                    value: name, ..
                })) => {
                    names
                        .entry(Name::CounterStyle(name.clone()))
                        .and_modify(|mana| *mana += 1)
                        .or_insert(1);
                }
                Some(box AtRulePrelude::KeyframesPrelude(KeyframesName::CustomIdent(
                    box CustomIdent { value: name, .. },
                )))
                | Some(box AtRulePrelude::KeyframesPrelude(KeyframesName::Str(box Str {
                    value: name,
                    ..
                }))) => {
                    names
                        .entry(Name::Keyframes(
                            self.get_at_rule_name(at_rule),
                            name.clone(),
                        ))
                        .and_modify(|mana| *mana += 1)
                        .or_insert(1);
                }

                _ => {}
            }
        }
    }

    fn discard_overridden(&self, parent_node: ParentNode, names: &mut AHashMap<Name, isize>) {
        let mut discarder = |at_rule: &AtRule| match &at_rule.prelude {
            Some(box AtRulePrelude::CounterStylePrelude(CustomIdent { value: name, .. })) => {
                if let Some(counter) = names.get_mut(&Name::CounterStyle(name.clone())) {
                    if *counter > 1 {
                        *counter -= 1;

                        false
                    } else {
                        true
                    }
                } else {
                    false
                }
            }
            Some(box AtRulePrelude::KeyframesPrelude(KeyframesName::CustomIdent(
                box CustomIdent { value: name, .. },
            )))
            | Some(box AtRulePrelude::KeyframesPrelude(KeyframesName::Str(box Str {
                value: name,
                ..
            }))) => {
                let counter = names.get_mut(&Name::Keyframes(
                    self.get_at_rule_name(at_rule),
                    name.clone(),
                ));

                if let Some(counter) = counter {
                    if *counter > 1 {
                        *counter -= 1;

                        false
                    } else {
                        true
                    }
                } else {
                    false
                }
            }
            _ => true,
        };

        match parent_node {
            ParentNode::Stylesheet(stylesheet) => {
                stylesheet.rules.retain(|rule| match rule {
                    Rule::AtRule(box at_rule) => discarder(at_rule),
                    _ => true,
                });
            }
            ParentNode::SimpleBlock(simple_block) => simple_block.value.retain(|rule| match rule {
                ComponentValue::Rule(Rule::AtRule(box at_rule)) => discarder(at_rule),
                _ => true,
            }),
        }
    }

    pub(super) fn compress_empty_stylesheet(&self, stylesheet: &mut Stylesheet) {
        let mut names: AHashMap<Name, isize> = Default::default();

        stylesheet.rules.retain(|rule| match rule {
            Rule::QualifiedRule(box QualifiedRule { block, .. }) if block.value.is_empty() => false,
            Rule::AtRule(box AtRule {
                name: AtRuleName::Ident(Ident { value, .. }),
                block: Some(block),
                ..
            }) if !need_keep_by_name(value) && block.value.is_empty() => false,
            _ => {
                self.collect_names(rule, &mut names);

                true
            }
        });

        if !names.is_empty() {
            self.discard_overridden(ParentNode::Stylesheet(stylesheet), &mut names);
        }
    }

    pub(super) fn compress_empty_simple_block(&self, simple_block: &mut SimpleBlock) {
        let mut names: AHashMap<Name, isize> = Default::default();

        simple_block.value.retain(|rule| match rule {
            ComponentValue::Rule(Rule::QualifiedRule(box QualifiedRule { block, .. }))
            | ComponentValue::Rule(Rule::AtRule(box AtRule {
                block: Some(block), ..
            }))
            | ComponentValue::StyleBlock(StyleBlock::QualifiedRule(box QualifiedRule {
                block,
                ..
            }))
            | ComponentValue::StyleBlock(StyleBlock::AtRule(box AtRule {
                block: Some(block),
                ..
            }))
            | ComponentValue::DeclarationOrAtRule(DeclarationOrAtRule::AtRule(box AtRule {
                block: Some(block),
                ..
            }))
            | ComponentValue::KeyframeBlock(KeyframeBlock { block, .. })
                if block.value.is_empty() =>
            {
                false
            }
            _ => {
                if let ComponentValue::Rule(rule) = rule {
                    self.collect_names(rule, &mut names);
                }

                true
            }
        });

        if !names.is_empty() {
            self.discard_overridden(ParentNode::SimpleBlock(simple_block), &mut names);
        }
    }
}

fn need_keep_by_name(name: &JsWord) -> bool {
    matches!(
        name.to_ascii_lowercase(),
        js_word!("color-profile") | js_word!("layer")
    )
}
