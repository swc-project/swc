use std::mem::take;

use swc_atoms::{js_word, JsWord};
use swc_common::{collections::AHashMap, EqIgnoreSpan, Span, Spanned, SyntaxContext};
use swc_css_ast::*;
use swc_css_visit::{Visit, VisitMutWith, VisitWith};

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

struct CompatibilityChecker {
    pub allow_to_merge: bool,
}

impl Default for CompatibilityChecker {
    fn default() -> Self {
        CompatibilityChecker {
            allow_to_merge: true,
        }
    }
}

// TODO improve me https://github.com/cssnano/cssnano/blob/master/packages/postcss-merge-rules/src/lib/ensureCompatibility.js#L62, need browserslist
impl Visit for CompatibilityChecker {
    fn visit_pseudo_class_selector(&mut self, _n: &PseudoClassSelector) {
        self.allow_to_merge = false;
    }

    fn visit_pseudo_element_selector(&mut self, _n: &PseudoElementSelector) {
        self.allow_to_merge = false;
    }

    fn visit_attribute_selector(&mut self, n: &AttributeSelector) {
        if n.modifier.is_some() {
            self.allow_to_merge = false;
        }
    }
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

    fn merge_selector_list(&self, left: &SelectorList, right: &SelectorList) -> SelectorList {
        let mut children = left.children.clone();

        children.extend(right.children.clone());

        SelectorList {
            span: Span::new(left.span_lo(), right.span_hi(), SyntaxContext::empty()),
            children,
        }
    }

    fn merge_simple_block(&self, left: &SimpleBlock, right: &SimpleBlock) -> SimpleBlock {
        let mut value = left.value.clone();

        value.extend(right.value.clone());

        SimpleBlock {
            span: Span::new(left.span_lo(), right.span_hi(), SyntaxContext::empty()),
            name: left.name.clone(),
            value,
        }
    }

    fn can_merge_qualified_rules(&self, left: &QualifiedRule, right: &QualifiedRule) -> bool {
        let left_selector_list = match &left.prelude {
            QualifiedRulePrelude::SelectorList(selector_list) => selector_list,
            _ => return false,
        };
        let right_selector_list = match &right.prelude {
            QualifiedRulePrelude::SelectorList(selector_list) => selector_list,
            _ => return false,
        };

        let mut checker = CompatibilityChecker::default();

        left_selector_list.visit_with(&mut checker);
        right_selector_list.visit_with(&mut checker);

        checker.allow_to_merge
    }

    fn try_merge_qualified_rules(
        &mut self,
        left: &QualifiedRule,
        right: &QualifiedRule,
    ) -> Option<QualifiedRule> {
        if !self.can_merge_qualified_rules(left, right) {
            return None;
        }

        // Merge when declarations are exactly equal
        // e.g. h1 { color: red } h2 { color: red }
        if left.block.eq_ignore_span(&right.block) {
            if let (
                QualifiedRulePrelude::SelectorList(prev_selector_list),
                QualifiedRulePrelude::SelectorList(current_selector_list),
            ) = (&left.prelude, &right.prelude)
            {
                let selector_list =
                    self.merge_selector_list(prev_selector_list, current_selector_list);
                let mut qualified_rule = QualifiedRule {
                    span: Span::new(
                        left.span.span_lo(),
                        right.span.span_lo(),
                        SyntaxContext::empty(),
                    ),
                    prelude: QualifiedRulePrelude::SelectorList(selector_list),
                    block: left.block.clone(),
                };

                qualified_rule.visit_mut_children_with(self);

                return Some(qualified_rule);
            }
        }

        // Merge when both selectors are exactly equal
        // e.g. a { color: blue } a { font-weight: bold }
        if left.prelude.eq_ignore_span(&right.prelude) {
            let block = self.merge_simple_block(&left.block, &right.block);
            let mut qualified_rule = QualifiedRule {
                span: Span::new(
                    left.span.span_lo(),
                    right.span.span_lo(),
                    SyntaxContext::empty(),
                ),
                prelude: left.prelude.clone(),
                block,
            };

            qualified_rule.visit_mut_children_with(self);

            return Some(qualified_rule);
        }

        // Partial merge: check if the rule contains a subset of the last; if
        // so create a joined selector with the subset, if smaller.
        // TODO improve me

        None
    }

    fn is_mergeable_at_rule(&self, at_rule: &AtRule) -> bool {
        let name = match &at_rule.name {
            AtRuleName::Ident(Ident { value, .. }) => value,
            _ => return false,
        };

        match name.to_ascii_lowercase() {
            js_word!("media") | js_word!("container") | js_word!("nest") => true,
            _ => false,
        }
    }

    fn try_merge_at_rule(&mut self, left: &AtRule, right: &AtRule) -> Option<AtRule> {
        // Merge when both media queries are exactly equal
        // e.g. @media print { .color { color: red; } } @media print { .color { color:
        // blue; } }
        if left.prelude.eq_ignore_span(&right.prelude) {
            if let Some(left_block) = &left.block {
                if let Some(right_block) = &right.block {
                    let block = self.merge_simple_block(left_block, right_block);
                    let mut at_rule = AtRule {
                        span: Span::new(
                            left.span.span_lo(),
                            right.span.span_lo(),
                            SyntaxContext::empty(),
                        ),
                        name: left.name.clone(),
                        prelude: left.prelude.clone(),
                        block: Some(block),
                    };

                    at_rule.visit_mut_children_with(self);

                    return Some(at_rule);
                }
            }
        }

        None
    }

    pub(super) fn compress_stylesheet(&mut self, stylesheet: &mut Stylesheet) {
        let mut names: AHashMap<Name, isize> = Default::default();
        let mut prev_rule: Option<Rule> = None;
        let mut remove_rules_list = vec![];
        let mut prev_index = 0;
        let mut index = 0;

        stylesheet.rules.retain_mut(|rule| {
            let result = match rule {
                Rule::AtRule(box AtRule {
                    name: AtRuleName::Ident(Ident { value, .. }),
                    block: Some(block),
                    ..
                }) if !need_keep_by_name(value) && block.value.is_empty() => false,
                Rule::QualifiedRule(box QualifiedRule { block, .. }) if block.value.is_empty() => {
                    false
                }
                Rule::AtRule(box at_rule @ AtRule { .. })
                    if self.is_mergeable_at_rule(at_rule)
                        && matches!(prev_rule, Some(Rule::AtRule(_))) =>
                {
                    if let Some(Rule::AtRule(box prev_rule)) = &prev_rule {
                        if let Some(at_rule) = self.try_merge_at_rule(prev_rule, at_rule) {
                            *rule = Rule::AtRule(Box::new(at_rule));

                            remove_rules_list.push(prev_index);
                        }
                    }

                    true
                }
                Rule::QualifiedRule(box qualified_rule @ QualifiedRule { .. })
                    if matches!(prev_rule, Some(Rule::QualifiedRule(_))) =>
                {
                    if let Some(Rule::QualifiedRule(box prev_rule)) = &prev_rule {
                        if let Some(qualified_rule) =
                            self.try_merge_qualified_rules(prev_rule, qualified_rule)
                        {
                            *rule = Rule::QualifiedRule(Box::new(qualified_rule));

                            remove_rules_list.push(prev_index);
                        }
                    }

                    true
                }
                _ => {
                    self.collect_names(rule, &mut names);

                    true
                }
            };

            if result {
                match rule {
                    Rule::AtRule(box at_rule @ AtRule { .. })
                        if self.is_mergeable_at_rule(at_rule) =>
                    {
                        prev_index = index;
                        prev_rule = Some(Rule::AtRule(Box::new(at_rule.clone())));
                    }
                    Rule::QualifiedRule(box qualified_rule @ QualifiedRule { .. }) => {
                        prev_index = index;
                        prev_rule = Some(Rule::QualifiedRule(Box::new(qualified_rule.clone())));
                    }
                    _ => {
                        prev_rule = None;
                    }
                }

                index += 1;
            }

            result
        });

        if !names.is_empty() {
            self.discard_overridden(ParentNode::Stylesheet(stylesheet), &mut names);
        }

        if !remove_rules_list.is_empty() {
            stylesheet.rules = take(&mut stylesheet.rules)
                .into_iter()
                .enumerate()
                .filter_map(|(idx, value)| {
                    if remove_rules_list.contains(&idx) {
                        None
                    } else {
                        Some(value)
                    }
                })
                .collect::<Vec<_>>();
        }
    }

    pub(super) fn compress_simple_block(&mut self, simple_block: &mut SimpleBlock) {
        let mut names: AHashMap<Name, isize> = Default::default();
        let mut prev_qualified_rule: Option<QualifiedRule> = None;
        let mut remove_rules_list = vec![];
        let mut prev_index = 0;
        let mut index = 0;

        simple_block.value.retain_mut(|rule| {
            let result = match rule {
                ComponentValue::Rule(Rule::AtRule(box AtRule {
                    block: Some(block), ..
                }))
                | ComponentValue::Rule(Rule::QualifiedRule(box QualifiedRule { block, .. }))
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
                ComponentValue::Rule(Rule::QualifiedRule(
                    box current_qualified_rule @ QualifiedRule { .. },
                )) if prev_qualified_rule.is_some() => {
                    if let Some(qualified_rule) = self.try_merge_qualified_rules(
                        prev_qualified_rule.as_ref().unwrap(),
                        current_qualified_rule,
                    ) {
                        *rule = ComponentValue::Rule(Rule::QualifiedRule(Box::new(qualified_rule)));

                        remove_rules_list.push(prev_index);
                    }

                    true
                }
                ComponentValue::StyleBlock(StyleBlock::QualifiedRule(
                    box current_qualified_rule @ QualifiedRule { .. },
                )) if prev_qualified_rule.is_some() => {
                    if let Some(qualified_rule) = self.try_merge_qualified_rules(
                        prev_qualified_rule.as_ref().unwrap(),
                        current_qualified_rule,
                    ) {
                        *rule = ComponentValue::StyleBlock(StyleBlock::QualifiedRule(Box::new(
                            qualified_rule,
                        )));

                        remove_rules_list.push(prev_index);
                    }

                    true
                }
                _ => {
                    if let ComponentValue::Rule(rule) = rule {
                        self.collect_names(rule, &mut names);
                    }

                    true
                }
            };

            if result {
                match rule {
                    ComponentValue::Rule(Rule::QualifiedRule(
                        box qualified_rule @ QualifiedRule { .. },
                    ))
                    | ComponentValue::StyleBlock(StyleBlock::QualifiedRule(
                        box qualified_rule @ QualifiedRule { .. },
                    )) => {
                        prev_index = index;
                        prev_qualified_rule = Some(qualified_rule.clone());
                    }
                    _ => {
                        prev_qualified_rule = None;
                    }
                }

                index += 1;
            }

            result
        });

        if !names.is_empty() {
            self.discard_overridden(ParentNode::SimpleBlock(simple_block), &mut names);
        }

        if !remove_rules_list.is_empty() {
            simple_block.value = take(&mut simple_block.value)
                .into_iter()
                .enumerate()
                .filter_map(|(idx, value)| {
                    if remove_rules_list.contains(&idx) {
                        None
                    } else {
                        Some(value)
                    }
                })
                .collect::<Vec<_>>();
        }
    }
}

fn need_keep_by_name(name: &JsWord) -> bool {
    matches!(
        name.to_ascii_lowercase(),
        js_word!("color-profile") | js_word!("layer")
    )
}
