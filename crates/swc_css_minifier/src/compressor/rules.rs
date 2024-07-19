use std::mem::take;

use swc_atoms::JsWord;
use swc_common::{collections::AHashMap, util::take::Take, EqIgnoreSpan, Span, Spanned};
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
            AtRuleName::Ident(Ident { value, .. }) => value.clone(),
            AtRuleName::DashedIdent(DashedIdent { value, .. }) => value.clone(),
        }
    }

    fn is_same_declaration_name(&self, left: &Declaration, right: &Declaration) -> bool {
        match (&left.name, &right.name) {
            (
                DeclarationName::Ident(Ident {
                    value: left_value, ..
                }),
                DeclarationName::Ident(Ident {
                    value: right_value, ..
                }),
            ) => left_value.eq_ignore_ascii_case(right_value),
            (
                DeclarationName::DashedIdent(DashedIdent {
                    value: left_value, ..
                }),
                DeclarationName::DashedIdent(DashedIdent {
                    value: right_value, ..
                }),
            ) => left_value == right_value,
            _ => false,
        }
    }

    fn collect_names(&self, at_rule: &AtRule, names: &mut AHashMap<Name, isize>) {
        let Some(prelude) = &at_rule.prelude else {
            return;
        };

        match &**prelude {
            AtRulePrelude::CounterStylePrelude(CustomIdent { value: name, .. }) => {
                names
                    .entry(Name::CounterStyle(name.clone()))
                    .and_modify(|mana| *mana += 1)
                    .or_insert(1);
            }
            prelude => {
                let name = match prelude {
                    AtRulePrelude::KeyframesPrelude(KeyframesName::CustomIdent(custom_ident)) => {
                        &custom_ident.value
                    }
                    AtRulePrelude::KeyframesPrelude(KeyframesName::Str(s)) => &s.value,
                    _ => return,
                };

                names
                    .entry(Name::Keyframes(
                        self.get_at_rule_name(at_rule),
                        name.clone(),
                    ))
                    .and_modify(|mana| *mana += 1)
                    .or_insert(1);
            }
        }
    }

    fn discard_overridden(
        &self,
        parent_node: ParentNode,
        names: &mut AHashMap<Name, isize>,
        remove_rules_list: &mut Vec<usize>,
    ) {
        let mut discarder = |at_rule: &AtRule| {
            let Some(prelude) = &at_rule.prelude else {
                return true;
            };

            match &**prelude {
                AtRulePrelude::CounterStylePrelude(CustomIdent { value: name, .. }) => {
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
                prelude => {
                    let name = match prelude {
                        AtRulePrelude::KeyframesPrelude(KeyframesName::CustomIdent(
                            custom_ident,
                        )) => &custom_ident.value,
                        AtRulePrelude::KeyframesPrelude(KeyframesName::Str(s)) => &s.value,
                        _ => return true,
                    };

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
            }
        };

        match parent_node {
            ParentNode::Stylesheet(stylesheet) => {
                for index in 0..stylesheet.rules.len() {
                    let node = stylesheet.rules.get(index);

                    if let Some(Rule::AtRule(at_rule)) = node {
                        if !discarder(at_rule) {
                            remove_rules_list.push(index);
                        }
                    }
                }
            }
            ParentNode::SimpleBlock(simple_block) => {
                for index in 0..simple_block.value.len() {
                    let node = simple_block.value.get(index);

                    if let Some(ComponentValue::AtRule(at_rule)) = node {
                        if !discarder(at_rule) {
                            remove_rules_list.push(index);
                        }
                    }
                }
            }
        }
    }

    fn merge_selector_list(
        &self,
        left: &mut SelectorList,
        right: &mut SelectorList,
    ) -> SelectorList {
        let mut children = left.children.take();

        children.extend(right.children.take());

        SelectorList {
            span: Span::new(left.span_lo(), right.span_hi()),
            children,
        }
    }

    fn merge_relative_selector_list(
        &self,
        left: &mut RelativeSelectorList,
        right: &mut RelativeSelectorList,
    ) -> RelativeSelectorList {
        let mut children = left.children.take();

        children.extend(right.children.take());

        RelativeSelectorList {
            span: Span::new(left.span_lo(), right.span_hi()),
            children,
        }
    }

    fn merge_simple_block(&self, left: &mut SimpleBlock, right: &mut SimpleBlock) -> SimpleBlock {
        let mut value = left.value.take();

        value.extend(right.value.take());

        SimpleBlock {
            span: Span::new(left.span_lo(), right.span_hi()),
            name: left.name.clone(),
            value,
        }
    }

    fn can_merge_qualified_rules(&self, left: &QualifiedRule, right: &QualifiedRule) -> bool {
        match (&left.prelude, &right.prelude) {
            (
                QualifiedRulePrelude::SelectorList(left_selector_list),
                QualifiedRulePrelude::SelectorList(right_selector_list),
            ) => {
                let mut checker = CompatibilityChecker::default();

                left_selector_list.visit_with(&mut checker);
                right_selector_list.visit_with(&mut checker);

                checker.allow_to_merge
            }
            (
                QualifiedRulePrelude::RelativeSelectorList(left_relative_selector_list),
                QualifiedRulePrelude::RelativeSelectorList(right_relative_selector_list),
            ) => {
                let mut checker = CompatibilityChecker::default();

                left_relative_selector_list.visit_with(&mut checker);
                right_relative_selector_list.visit_with(&mut checker);

                checker.allow_to_merge
            }
            _ => false,
        }
    }

    fn try_merge_qualified_rules(
        &mut self,
        left: &mut QualifiedRule,
        right: &mut QualifiedRule,
    ) -> Option<QualifiedRule> {
        if !self.can_merge_qualified_rules(left, right) {
            return None;
        }

        // Merge when declarations are exactly equal
        // e.g. h1 { color: red } h2 { color: red }
        if left.block.eq_ignore_span(&right.block) {
            match (&mut left.prelude, &mut right.prelude) {
                (
                    QualifiedRulePrelude::SelectorList(prev_selector_list),
                    QualifiedRulePrelude::SelectorList(current_selector_list),
                ) => {
                    let selector_list =
                        self.merge_selector_list(prev_selector_list, current_selector_list);
                    let mut qualified_rule = QualifiedRule {
                        span: Span::new(left.span_lo(), right.span_hi()),
                        prelude: QualifiedRulePrelude::SelectorList(selector_list),
                        block: left.block.take(),
                    };

                    qualified_rule.visit_mut_children_with(self);

                    return Some(qualified_rule);
                }
                (
                    QualifiedRulePrelude::RelativeSelectorList(prev_relative_selector_list),
                    QualifiedRulePrelude::RelativeSelectorList(current_relative_selector_list),
                ) => {
                    let relative_selector_list = self.merge_relative_selector_list(
                        prev_relative_selector_list,
                        current_relative_selector_list,
                    );
                    let mut qualified_rule = QualifiedRule {
                        span: Span::new(left.span_lo(), right.span_hi()),
                        prelude: QualifiedRulePrelude::RelativeSelectorList(relative_selector_list),
                        block: left.block.take(),
                    };

                    qualified_rule.visit_mut_children_with(self);

                    return Some(qualified_rule);
                }
                _ => {}
            }
        }

        // Merge when both selectors are exactly equal
        // e.g. a { color: blue } a { font-weight: bold }
        if left.prelude.eq_ignore_span(&right.prelude) {
            let block = self.merge_simple_block(&mut left.block, &mut right.block);
            let mut qualified_rule = QualifiedRule {
                span: Span::new(left.span_lo(), right.span_hi()),
                prelude: left.prelude.take(),
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

        matches!(
            &**name,
            "media" | "supports" | "container" | "layer" | "nest"
        )
    }

    fn try_merge_at_rule(&mut self, left: &mut AtRule, right: &mut AtRule) -> Option<AtRule> {
        // Merge when both at-rule's prelude is exactly equal
        // e.g.
        // @media print { .color { color: red; } }
        // @media print { .color { color: blue; } }
        if left.prelude.eq_ignore_span(&right.prelude) {
            if let Some(left_block) = &mut left.block {
                if let Some(right_block) = &mut right.block {
                    let block = self.merge_simple_block(left_block, right_block);
                    let mut at_rule = AtRule {
                        span: Span::new(left.span.span_lo(), right.span.span_lo()),
                        name: left.name.clone(),
                        prelude: left.prelude.take(),
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
        let mut prev_rule_idx = None;
        let mut remove_rules_list = Vec::new();
        let mut prev_index = 0;

        for index in 0..stylesheet.rules.len() {
            // We need two &mut
            let (a, b) = stylesheet.rules.split_at_mut(index);

            let mut prev_rule = match prev_rule_idx {
                Some(idx) => a.get_mut(idx),
                None => None,
            };
            let rule = match b.first_mut() {
                Some(v) => v,
                None => continue,
            };

            let result = match rule {
                Rule::AtRule(at_rule)
                    if at_rule
                        .name
                        .as_ident()
                        .map(|ident| !need_keep_by_name(&ident.value))
                        .unwrap_or_default()
                        && at_rule
                            .block
                            .as_ref()
                            .map(|block| block.value.is_empty())
                            .unwrap_or_default() =>
                {
                    false
                }
                Rule::QualifiedRule(qualified_rule) if qualified_rule.block.value.is_empty() => {
                    false
                }
                Rule::AtRule(at_rule)
                    if self.is_mergeable_at_rule(at_rule)
                        && matches!(prev_rule, Some(Rule::AtRule(_))) =>
                {
                    if let Some(Rule::AtRule(prev_rule)) = &mut prev_rule {
                        if let Some(at_rule) = self.try_merge_at_rule(prev_rule, at_rule) {
                            *rule = Rule::AtRule(Box::new(at_rule));

                            remove_rules_list.push(prev_index);
                        }
                    }

                    true
                }
                Rule::QualifiedRule(qualified_rule)
                    if matches!(prev_rule, Some(Rule::QualifiedRule(_))) =>
                {
                    if let Some(Rule::QualifiedRule(prev_rule)) = &mut prev_rule {
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
                    if let Rule::AtRule(rule) = rule {
                        self.collect_names(rule, &mut names);
                    }

                    true
                }
            };

            if result {
                match rule {
                    Rule::AtRule(at_rule) if self.is_mergeable_at_rule(at_rule) => {
                        prev_index = index;
                        prev_rule_idx = Some(index);
                    }
                    Rule::QualifiedRule(_) => {
                        prev_index = index;
                        prev_rule_idx = Some(index);
                    }
                    _ => {
                        prev_rule_idx = None;
                    }
                }
            }

            if !result {
                remove_rules_list.push(index);
            }
        }

        if !names.is_empty() {
            self.discard_overridden(
                ParentNode::Stylesheet(stylesheet),
                &mut names,
                &mut remove_rules_list,
            );
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

            // To merge
            // .foo {
            //     background: red;
            // }
            //
            // .bar {
            //     background: red;
            // }
            //
            // .foo {
            //     color: green;
            // }
            //
            // .bar {
            //     color: green;
            // }
            self.compress_stylesheet(stylesheet);
        }
    }

    pub(super) fn compress_simple_block(&mut self, simple_block: &mut SimpleBlock) {
        let mut names: AHashMap<Name, isize> = Default::default();
        let mut prev_rule_idx = None;
        let mut remove_rules_list = Vec::new();
        let mut prev_index = 0;

        for index in 0..simple_block.value.len() {
            // We need two &mut
            let (a, b) = simple_block.value.split_at_mut(index);

            let mut prev_rule = match prev_rule_idx {
                Some(idx) => a.get_mut(idx),
                None => None,
            };
            let rule = match b.first_mut() {
                Some(v) => v,
                None => continue,
            };

            let result = match rule {
                ComponentValue::AtRule(at_rule)
                    if at_rule
                        .block
                        .as_ref()
                        .map(|block| block.value.is_empty())
                        .unwrap_or_default() =>
                {
                    false
                }
                ComponentValue::QualifiedRule(qualified_rule)
                    if qualified_rule.block.value.is_empty() =>
                {
                    false
                }
                ComponentValue::KeyframeBlock(keyframe_block)
                    if keyframe_block.block.value.is_empty() =>
                {
                    false
                }
                ComponentValue::AtRule(at_rule)
                    if prev_rule.is_some() && self.is_mergeable_at_rule(at_rule) =>
                {
                    if let Some(ComponentValue::AtRule(prev_rule)) = &mut prev_rule {
                        if let Some(at_rule) = self.try_merge_at_rule(prev_rule, at_rule) {
                            *rule = ComponentValue::AtRule(Box::new(at_rule));

                            remove_rules_list.push(prev_index);
                        }
                    }

                    true
                }
                ComponentValue::QualifiedRule(qualified_rule) if prev_rule.is_some() => {
                    if let Some(ComponentValue::QualifiedRule(prev_rule)) = &mut prev_rule {
                        if let Some(qualified_rule) =
                            self.try_merge_qualified_rules(prev_rule, qualified_rule)
                        {
                            *rule = ComponentValue::QualifiedRule(Box::new(qualified_rule));

                            remove_rules_list.push(prev_index);
                        }
                    }

                    true
                }
                ComponentValue::Declaration(declaration) if prev_rule.is_some() => {
                    if let Some(ComponentValue::Declaration(prev_rule)) = &mut prev_rule {
                        if self.is_same_declaration_name(prev_rule, declaration)
                            && prev_rule.value.eq_ignore_span(&declaration.value)
                        {
                            remove_rules_list.push(prev_index);
                        }
                    }

                    true
                }
                _ => {
                    if let ComponentValue::AtRule(rule) = rule {
                        self.collect_names(rule, &mut names);
                    }

                    true
                }
            };

            if result {
                match rule {
                    ComponentValue::AtRule(at_rule) if self.is_mergeable_at_rule(at_rule) => {
                        prev_index = index;
                        prev_rule_idx = Some(index);
                    }
                    ComponentValue::QualifiedRule(_) => {
                        prev_index = index;
                        prev_rule_idx = Some(index);
                    }
                    ComponentValue::Declaration(_) => {
                        prev_index = index;
                        prev_rule_idx = Some(index);
                    }
                    _ => {
                        prev_rule_idx = None;
                    }
                }
            }

            if !result {
                remove_rules_list.push(index);
            }
        }

        if !names.is_empty() {
            self.discard_overridden(
                ParentNode::SimpleBlock(simple_block),
                &mut names,
                &mut remove_rules_list,
            );
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

            // To merge
            // .foo {
            //     & .foo {
            //         background: red;
            //     }
            //
            //     & .bar {
            //         background: red;
            //     }
            //
            //     & .foo {
            //         color: green;
            //     }
            //
            //     & .bar {
            //         color: green;
            //     }
            // }
            self.compress_simple_block(simple_block);
        }
    }
}

#[inline]
fn need_keep_by_name(name: &JsWord) -> bool {
    *name == "color-profile"
}
