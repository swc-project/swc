use swc_atoms::js_word;
use swc_css_ast::*;
use swc_css_utils::serialize_ident;
use swc_css_visit::{VisitMut, VisitMutWith};

use self::ctx::Ctx;

mod alpha_value;
mod angle;
mod calc_sum;
mod color;
mod container;
mod ctx;
mod declaration;
mod easing_function;
mod frequency;
mod import;
mod keyframes;
mod length;
mod math;
mod media;
mod rules;
mod selector;
mod supports;
mod time;
mod transform_function;
mod unicode_range;
mod unit;
mod url;

pub fn compressor() -> impl VisitMut {
    Compressor::default()
}

#[derive(Default)]
struct Compressor {
    ctx: Ctx,
    need_utf8_at_rule: bool,
    in_supports_conidition: bool,
}

impl Compressor {
    #[inline]
    fn is_ident_shorter_than_str(&self, input: &str) -> bool {
        let escaped = serialize_ident(input, None, true);

        // escaped: without double quotes, so need plus 2 here
        escaped.len() < input.len() + 2
    }
}

impl VisitMut for Compressor {
    fn visit_mut_alpha_value(&mut self, n: &mut AlphaValue) {
        n.visit_mut_children_with(self);

        self.compress_alpha_value(n);
    }

    fn visit_mut_stylesheet(&mut self, n: &mut Stylesheet) {
        n.visit_mut_children_with(self);

        self.compress_stylesheet(n);

        if !self.need_utf8_at_rule {
            match n.rules.get(0) {
                Some(Rule::AtRule(box AtRule {
                    prelude: Some(box AtRulePrelude::CharsetPrelude(Str { value, .. })),
                    ..
                })) if value.as_ref().eq_ignore_ascii_case("utf-8") => {
                    n.rules.remove(0);
                }
                _ => {}
            }
        }
    }

    fn visit_mut_simple_block(&mut self, n: &mut SimpleBlock) {
        n.visit_mut_children_with(self);

        self.compress_simple_block(n);
    }

    fn visit_mut_time(&mut self, n: &mut Time) {
        n.visit_mut_children_with(self);

        self.compress_time(n);
    }

    fn visit_mut_unicode_range(&mut self, n: &mut UnicodeRange) {
        n.visit_mut_children_with(self);

        self.compress_unicode_range(n);
    }

    fn visit_mut_url(&mut self, n: &mut Url) {
        n.visit_mut_children_with(self);

        self.compress_url(n);
    }

    fn visit_mut_declaration(&mut self, n: &mut Declaration) {
        if self.in_supports_conidition {
            n.visit_mut_children_with(self);

            return;
        }

        self.compress_declaration(n);

        if let DeclarationName::Ident(Ident { value, .. }) = &n.name {
            if matches_eq_ignore_ascii_case!(
                value,
                js_word!("opacity"),
                js_word!("fill-opacity"),
                js_word!("stroke-opacity"),
                js_word!("shape-image-threshold")
            ) {
                n.visit_mut_children_with(&mut *self.with_ctx(Ctx {
                    preserve_alpha_value: false,
                    ..self.ctx
                }));
            } else {
                n.visit_mut_children_with(self);
            }
        } else {
            n.visit_mut_children_with(self);
        }
    }

    fn visit_mut_color(&mut self, n: &mut Color) {
        n.visit_mut_children_with(self);

        self.compress_color(n);
    }

    fn visit_mut_frequency(&mut self, n: &mut Frequency) {
        n.visit_mut_children_with(self);

        self.compress_frequency(n);
    }

    fn visit_mut_at_rule(&mut self, n: &mut AtRule) {
        n.visit_mut_children_with(self);

        self.compress_keyframes_at_rule(n);
    }

    fn visit_mut_import_href(&mut self, n: &mut ImportHref) {
        n.visit_mut_children_with(self);

        self.compress_import_href(n);
    }

    fn visit_mut_media_query_list(&mut self, n: &mut MediaQueryList) {
        n.visit_mut_children_with(self);

        self.compress_media_query_list(n);
    }

    fn visit_mut_media_condition(&mut self, n: &mut MediaCondition) {
        n.visit_mut_children_with(self);

        self.compress_media_condition(n);
    }

    fn visit_mut_media_condition_without_or(&mut self, n: &mut MediaConditionWithoutOr) {
        n.visit_mut_children_with(self);

        self.compress_media_condition_without_or(n);
    }

    fn visit_mut_media_in_parens(&mut self, n: &mut MediaInParens) {
        n.visit_mut_children_with(self);

        self.compress_media_in_parens(n);
    }

    fn visit_mut_media_feature_value(&mut self, n: &mut MediaFeatureValue) {
        n.visit_mut_children_with(self);

        self.compress_calc_sum_in_media_feature_value(n);
        self.compress_media_feature_value_length(n);
    }

    fn visit_mut_supports_condition(&mut self, n: &mut SupportsCondition) {
        let old_in_support_condition = self.in_supports_conidition;

        self.in_supports_conidition = true;

        n.visit_mut_children_with(self);

        self.in_supports_conidition = old_in_support_condition;

        self.compress_supports_condition(n);
    }

    fn visit_mut_supports_in_parens(&mut self, n: &mut SupportsInParens) {
        n.visit_mut_children_with(self);

        self.compress_supports_in_parens(n);
    }

    fn visit_mut_size_feature_value(&mut self, n: &mut SizeFeatureValue) {
        n.visit_mut_children_with(self);

        self.compress_calc_sum_in_size_feature_value(n);
        self.compress_size_feature_value_length(n);
    }

    fn visit_mut_keyframe_selector(&mut self, n: &mut KeyframeSelector) {
        n.visit_mut_children_with(self);

        self.compress_keyframe_selector(n);
    }

    fn visit_mut_calc_sum(&mut self, n: &mut CalcSum) {
        n.visit_mut_children_with(&mut *self.with_ctx(Ctx {
            in_math_function: true,
            ..self.ctx
        }));

        // Don't touch `@supports`, it can be used to check a browser's support for one
        // or more specific CSS features
        if !self.in_supports_conidition {
            self.compress_calc_sum(n);
        }
    }

    fn visit_mut_component_value(&mut self, n: &mut ComponentValue) {
        n.visit_mut_children_with(self);

        self.compress_calc_sum_in_component_value(n);

        self.compress_alpha_value_in_component_value(n);

        self.compress_component_value_for_length(n);

        self.compress_easing_function(n);

        self.compress_transform_function(n);

        self.compress_angle_in_component_value(n);
    }

    fn visit_mut_length(&mut self, n: &mut Length) {
        n.visit_mut_children_with(self);

        self.compress_length(n);
    }

    fn visit_mut_pseudo_class_selector(&mut self, n: &mut PseudoClassSelector) {
        match &n.name {
            Ident { value, .. }
                if matches_eq_ignore_ascii_case!(
                    value,
                    js_word!("not"),
                    js_word!("is"),
                    js_word!("where"),
                    js_word!("matches"),
                    js_word!("-moz-any"),
                    js_word!("-webkit-any")
                ) =>
            {
                n.visit_mut_children_with(&mut *self.with_ctx(Ctx {
                    in_logic_combinator_selector: true,
                    ..self.ctx
                }));
            }
            _ => {
                n.visit_mut_children_with(self);
            }
        }
    }

    fn visit_mut_selector_list(&mut self, n: &mut SelectorList) {
        n.visit_mut_children_with(self);

        self.comrpess_selector_list(n);
    }

    fn visit_mut_forgiving_selector_list(&mut self, n: &mut ForgivingSelectorList) {
        n.visit_mut_children_with(self);

        self.compress_forgiving_selector_list(n);
    }

    fn visit_mut_relative_selector_list(&mut self, n: &mut RelativeSelectorList) {
        n.visit_mut_children_with(self);

        self.compress_relative_selector_list(n);
    }

    fn visit_mut_forgiving_relative_selector_list(
        &mut self,
        n: &mut ForgivingRelativeSelectorList,
    ) {
        n.visit_mut_children_with(self);

        self.compress_forgiving_relative_selector_list(n);
    }

    fn visit_mut_an_plus_b(&mut self, n: &mut AnPlusB) {
        n.visit_mut_children_with(self);

        self.compress_an_plus_b(n);
    }

    fn visit_mut_subclass_selector(&mut self, n: &mut SubclassSelector) {
        n.visit_mut_children_with(self);

        self.compress_subclass_selector(n);
    }

    fn visit_mut_compound_selector(&mut self, n: &mut CompoundSelector) {
        n.visit_mut_children_with(self);

        self.compress_compound_selector(n);
    }

    fn visit_mut_attribute_selector(&mut self, n: &mut AttributeSelector) {
        n.visit_mut_children_with(self);

        self.compress_attribute_selector(n);
    }

    fn visit_mut_keyframe_block(&mut self, n: &mut KeyframeBlock) {
        n.visit_mut_children_with(&mut *self.with_ctx(Ctx {
            in_keyframe_block: true,
            ..self.ctx
        }));
    }

    fn visit_mut_function(&mut self, n: &mut Function) {
        if matches_eq_ignore_ascii_case!(
            n.name.value,
            js_word!("rotate"),
            js_word!("skew"),
            js_word!("skewx"),
            js_word!("skewy"),
            js_word!("rotate3d"),
            js_word!("rotatex"),
            js_word!("rotatey"),
            js_word!("rotatez")
        ) {
            n.visit_mut_children_with(&mut *self.with_ctx(Ctx {
                in_transform_function: true,
                ..self.ctx
            }));
        } else {
            n.visit_mut_children_with(self);
        }
    }

    fn visit_mut_angle(&mut self, n: &mut Angle) {
        n.visit_mut_children_with(self);

        self.compress_angle(n);
    }

    fn visit_mut_ident(&mut self, ident: &mut Ident) {
        ident.visit_mut_children_with(self);

        if !self.need_utf8_at_rule {
            self.need_utf8_at_rule = !contains_only_ascii_characters(&ident.value);
        }
    }

    fn visit_mut_custom_ident(&mut self, custom_ident: &mut CustomIdent) {
        custom_ident.visit_mut_children_with(self);

        if !self.need_utf8_at_rule {
            self.need_utf8_at_rule = !contains_only_ascii_characters(&custom_ident.value);
        }
    }

    fn visit_mut_dashed_ident(&mut self, dashed_ident: &mut DashedIdent) {
        dashed_ident.visit_mut_children_with(self);

        if !self.need_utf8_at_rule {
            self.need_utf8_at_rule = !contains_only_ascii_characters(&dashed_ident.value);
        }
    }

    fn visit_mut_str(&mut self, string: &mut Str) {
        string.visit_mut_children_with(self);

        if !self.need_utf8_at_rule {
            self.need_utf8_at_rule = !contains_only_ascii_characters(&string.value);
        }
    }

    fn visit_mut_custom_property_name(&mut self, custom_property_name: &mut CustomPropertyName) {
        custom_property_name.visit_mut_children_with(self);

        if !self.need_utf8_at_rule {
            self.need_utf8_at_rule = !contains_only_ascii_characters(&custom_property_name.value);
        }
    }

    fn visit_mut_token_and_span(&mut self, token_and_span: &mut TokenAndSpan) {
        token_and_span.visit_mut_children_with(self);

        if !self.need_utf8_at_rule {
            match &token_and_span.token {
                Token::Ident { value, .. }
                | Token::Function { value, .. }
                | Token::AtKeyword { value, .. }
                | Token::String { value, .. }
                | Token::Url { value, .. }
                    if !contains_only_ascii_characters(value) =>
                {
                    self.need_utf8_at_rule = true;
                }
                Token::BadString { raw: value, .. } if !contains_only_ascii_characters(value) => {
                    self.need_utf8_at_rule = true;
                }
                Token::BadUrl { raw: value, .. } if !contains_only_ascii_characters(value) => {
                    self.need_utf8_at_rule = true;
                }
                Token::Dimension(box DimensionToken { unit: value, .. })
                    if !contains_only_ascii_characters(value) =>
                {
                    self.need_utf8_at_rule = true;
                }
                _ => {}
            }
        }
    }
}

fn contains_only_ascii_characters(string: &str) -> bool {
    string.chars().all(|c: char| c.is_ascii())
}
