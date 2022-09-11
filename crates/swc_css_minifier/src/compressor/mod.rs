use swc_atoms::js_word;
use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};

use self::ctx::Ctx;

mod angle;
mod color;
mod ctx;
mod declaration;
mod easing_function;
mod empty;
mod frequency;
mod keyframes;
mod length;
mod selector;
mod time;
mod unicode_range;
mod url;

pub fn compressor() -> impl VisitMut {
    Compressor::default()
}

#[derive(Default)]
struct Compressor {
    ctx: Ctx,
}

impl VisitMut for Compressor {
    fn visit_mut_alpha_value(&mut self, n: &mut AlphaValue) {
        n.visit_mut_children_with(self);
    }

    fn visit_mut_stylesheet(&mut self, n: &mut Stylesheet) {
        n.visit_mut_children_with(self);

        self.compresss_empty_stylesheet(n);
    }

    fn visit_mut_simple_block(&mut self, n: &mut SimpleBlock) {
        n.visit_mut_children_with(self);

        self.compresss_empty_simple_block(n);
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
        n.visit_mut_children_with(self);

        self.compress_declaration(n);
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

    fn visit_mut_keyframe_selector(&mut self, n: &mut KeyframeSelector) {
        n.visit_mut_children_with(self);

        self.compress_keyframe_selector(n);
    }

    fn visit_mut_calc_sum(&mut self, n: &mut CalcSum) {
        n.visit_mut_children_with(&mut *self.with_ctx(Ctx {
            in_math_function: true,
            ..self.ctx
        }));
    }

    fn visit_mut_component_value(&mut self, n: &mut ComponentValue) {
        n.visit_mut_children_with(self);

        self.compress_component_value_for_length(n);

        self.compress_easing_function(n);

        self.compress_angle_in_component_value(n);
    }

    fn visit_mut_length(&mut self, n: &mut Length) {
        n.visit_mut_children_with(self);

        self.compress_length(n);
    }

    fn visit_mut_pseudo_class_selector(&mut self, n: &mut PseudoClassSelector) {
        match &n.name {
            Ident { value, .. }
                if matches!(
                    value.to_ascii_lowercase(),
                    js_word!("not")
                        | js_word!("is")
                        | js_word!("where")
                        | js_word!("matches")
                        | js_word!("-moz-any")
                        | js_word!("-webkit-any")
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
        match &n.name {
            Ident { value, .. }
                if matches!(
                    value.to_ascii_lowercase(),
                    js_word!("rotate")
                        | js_word!("skew")
                        | js_word!("skewx")
                        | js_word!("skewy")
                        | js_word!("rotate3d")
                        | js_word!("rotatex")
                        | js_word!("rotatey")
                        | js_word!("rotatez")
                ) =>
            {
                n.visit_mut_children_with(&mut *self.with_ctx(Ctx {
                    in_transform_function: true,
                    ..self.ctx
                }));
            }
            _ => {
                n.visit_mut_children_with(self);
            }
        }
    }

    fn visit_mut_angle(&mut self, n: &mut Angle) {
        n.visit_mut_children_with(self);

        self.compress_angle(n);
    }
}
