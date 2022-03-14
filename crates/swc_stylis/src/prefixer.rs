use std::mem::take;

use swc_common::DUMMY_SP;
use swc_css_ast::*;
use swc_css_utils::{
    replace_function_name, replace_ident, replace_pseudo_class_selector_name,
    replace_pseudo_element_selector_name,
};
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn prefixer() -> impl VisitMut {
    Prefixer::default()
}

#[derive(Default)]
struct Prefixer {
    in_stylesheet: bool,
    added_rules: Vec<Rule>,
    in_simple_block: bool,
    added_declarations: Vec<Declaration>,
}

pub enum Prefix {
    Webkit,
    Moz,
    O,
    Ms,
}

impl VisitMut for Prefixer {
    // TODO handle `resolution` in media/supports at-rules
    // TODO handle declarations in `@media`/`@support`
    // TODO handle `@viewport`
    // TODO handle `@keyframes`

    // TODO improve legacy `::placeholder` pseudo
    fn visit_mut_qualified_rule(&mut self, n: &mut QualifiedRule) {
        n.visit_mut_children_with(self);

        if !self.in_stylesheet {
            return;
        }

        if let QualifiedRulePrelude::Invalid(_) = n.prelude {
            return;
        }

        let mut new_prelude = n.prelude.clone();

        replace_pseudo_class_selector_name(&mut new_prelude, "autofill", "-webkit-autofill");
        replace_pseudo_class_selector_name(&mut new_prelude, "any-link", "-webkit-any-link");
        replace_pseudo_class_selector_name(&mut new_prelude, "fullscreen", "-webkit-full-screen");
        replace_pseudo_element_selector_name(
            &mut new_prelude,
            "file-selector-button",
            "-webkit-file-upload-button",
        );
        replace_pseudo_element_selector_name(&mut new_prelude, "backdrop", "-ms-backdrop");
        replace_pseudo_element_selector_name(
            &mut new_prelude,
            "placeholder",
            "-ms-input-placeholder",
        );

        if n.prelude != new_prelude {
            self.added_rules.push(Rule::QualifiedRule(QualifiedRule {
                span: DUMMY_SP,
                prelude: new_prelude,
                block: n.block.clone(),
            }));
        }

        let mut new_prelude = n.prelude.clone();

        replace_pseudo_class_selector_name(&mut new_prelude, "read-only", "-moz-read-only");
        replace_pseudo_class_selector_name(&mut new_prelude, "read-write", "-moz-read-write");
        replace_pseudo_class_selector_name(&mut new_prelude, "any-link", "-moz-any-link");
        replace_pseudo_class_selector_name(&mut new_prelude, "fullscreen", "-moz-full-screen");
        replace_pseudo_class_selector_name(
            &mut new_prelude,
            "placeholder-shown",
            "-moz-placeholder-shown",
        );
        replace_pseudo_element_selector_name(&mut new_prelude, "selection", "-moz-selection");
        replace_pseudo_element_selector_name(&mut new_prelude, "placeholder", "-moz-placeholder");

        if n.prelude != new_prelude {
            self.added_rules.push(Rule::QualifiedRule(QualifiedRule {
                span: DUMMY_SP,
                prelude: new_prelude,
                block: n.block.clone(),
            }));
        }

        let mut new_prelude = n.prelude.clone();

        replace_pseudo_class_selector_name(&mut new_prelude, "fullscreen", "-ms-fullscreen");
        replace_pseudo_class_selector_name(
            &mut new_prelude,
            "placeholder-shown",
            "-ms-input-placeholder",
        );
        replace_pseudo_element_selector_name(
            &mut new_prelude,
            "file-selector-button",
            "-ms-browse",
        );
        replace_pseudo_element_selector_name(&mut new_prelude, "backdrop", "-webkit-backdrop");
        replace_pseudo_element_selector_name(
            &mut new_prelude,
            "placeholder",
            "-webkit-input-placeholder",
        );

        if n.prelude != new_prelude {
            self.added_rules.push(Rule::QualifiedRule(QualifiedRule {
                span: DUMMY_SP,
                prelude: new_prelude,
                block: n.block.clone(),
            }));
        }
    }

    fn visit_mut_stylesheet(&mut self, n: &mut Stylesheet) {
        let old_in_stylesheet = self.in_stylesheet;

        self.in_stylesheet = true;

        let mut new = vec![];

        for mut n in take(&mut n.rules) {
            n.visit_mut_children_with(self);

            new.append(&mut self.added_rules);
            new.push(n);
        }

        n.rules = new;

        self.in_stylesheet = old_in_stylesheet;
    }

    fn visit_mut_declaration(&mut self, n: &mut Declaration) {
        n.visit_mut_children_with(self);

        if !self.in_simple_block {
            return;
        }

        if n.value.is_empty() {
            return;
        }

        let is_dashed_ident = match n.name {
            DeclarationName::Ident(_) => false,
            DeclarationName::DashedIdent(_) => true,
        };

        if is_dashed_ident {
            return;
        }

        let name = match &n.name {
            DeclarationName::Ident(ident) => &ident.value,
            _ => {
                unreachable!();
            }
        };

        // TODO make it lazy?
        let mut webkit_new_value = n.value.clone();

        replace_function_name(&mut webkit_new_value, "filter", "-webkit-filter");
        replace_function_name(&mut webkit_new_value, "image-set", "-webkit-image-set");
        replace_function_name(&mut webkit_new_value, "calc", "-webkit-calc");

        let mut moz_new_value = n.value.clone();

        replace_function_name(&mut moz_new_value, "element", "-moz-element");
        replace_function_name(&mut moz_new_value, "calc", "-moz-calc");

        let mut o_new_value = n.value.clone();
        let ms_new_value = n.value.clone();

        macro_rules! same_content {
            ($prefix:expr,$name:expr) => {{
                let name = DeclarationName::Ident(Ident {
                    span: DUMMY_SP,
                    value: $name.into(),
                    raw: $name.into(),
                });
                let new_value = match $prefix {
                    Prefix::Webkit => webkit_new_value.clone(),
                    Prefix::Moz => moz_new_value.clone(),
                    Prefix::O => o_new_value.clone(),
                    Prefix::Ms => ms_new_value.clone(),
                };

                self.added_declarations.push(Declaration {
                    span: n.span,
                    name,
                    value: new_value,
                    important: n.important.clone(),
                });
            }};
        }

        macro_rules! simple {
            ($name:expr,$val:expr) => {{
                let val = ComponentValue::Ident(Ident {
                    span: DUMMY_SP,
                    value: $val.into(),
                    raw: $val.into(),
                });
                let name = DeclarationName::Ident(Ident {
                    span: DUMMY_SP,
                    value: $name.into(),
                    raw: $name.into(),
                });
                self.added_declarations.push(Declaration {
                    span: n.span,
                    name,
                    value: vec![val],
                    important: n.important.clone(),
                });
            }};
        }

        macro_rules! same_name {
            ($name:expr) => {{
                let val = Ident {
                    span: DUMMY_SP,
                    value: $name.into(),
                    raw: $name.into(),
                };
                self.added_declarations.push(Declaration {
                    span: n.span,
                    name: n.name.clone(),
                    value: vec![ComponentValue::Ident(val)],
                    important: n.important.clone(),
                });
            }};
        }

        match &*name.to_lowercase() {
            "appearance" => {
                same_content!(Prefix::Webkit, "-webkit-appearance");
                same_content!(Prefix::Moz, "-moz-appearance");
                same_content!(Prefix::Ms, "-ms-appearance");
            }

            "animation" => {
                let need_prefix = n.value.iter().all(|n| match n {
                    ComponentValue::Ident(Ident { value, .. }) => {
                        !matches!(&*value.to_lowercase(), "reverse" | "alternate-reverse")
                    }
                    _ => true,
                });

                if need_prefix {
                    same_content!(Prefix::Webkit, "-webkit-animation");
                    same_content!(Prefix::Moz, "-moz-animation");
                    same_content!(Prefix::O, "-o-animation");
                }
            }

            "animation-name" => {
                same_content!(Prefix::Webkit, "-webkit-animation-name");
                same_content!(Prefix::Moz, "-moz-animation-name");
                same_content!(Prefix::O, "-o-animation-name");
            }

            "animation-duration" => {
                same_content!(Prefix::Webkit, "-webkit-animation-duration");
                same_content!(Prefix::Moz, "-moz-animation-duration");
                same_content!(Prefix::O, "-o-animation-duration");
            }

            "animation-delay" => {
                same_content!(Prefix::Webkit, "-webkit-animation-delay");
                same_content!(Prefix::Moz, "-moz-animation-delay");
                same_content!(Prefix::O, "-o-animation-delay");
            }

            "animation-direction" => {
                if let ComponentValue::Ident(Ident { value, .. }) = &n.value[0] {
                    match &*value.to_lowercase() {
                        "alternate-reverse" | "reverse" => {}

                        _ => {
                            same_content!(Prefix::Webkit, "-webkit-animation-direction");
                            same_content!(Prefix::Moz, "-moz-animation-direction");
                            same_content!(Prefix::O, "-o-animation-direction");
                        }
                    }
                }
            }

            "animation-fill-mode" => {
                same_content!(Prefix::Webkit, "-webkit-animation-fill-mode");
                same_content!(Prefix::Moz, "-moz-animation-fill-mode");
                same_content!(Prefix::O, "-o-animation-fill-mode");
            }

            "animation-iteration-count" => {
                same_content!(Prefix::Webkit, "-webkit-animation-iteration-count");
                same_content!(Prefix::Moz, "-moz-animation-iteration-count");
                same_content!(Prefix::O, "-o-animation-iteration-count");
            }

            "animation-play-state" => {
                same_content!(Prefix::Webkit, "-webkit-animation-play-state");
                same_content!(Prefix::Moz, "-moz-animation-play-state");
                same_content!(Prefix::O, "-o-animation-play-state");
            }

            "animation-timing-function" => {
                same_content!(Prefix::Webkit, "-webkit-animation-timing-function");
                same_content!(Prefix::Moz, "-moz-animation-timing-function");
                same_content!(Prefix::O, "-o-animation-timing-function");
            }

            "background-clip" => {
                if let ComponentValue::Ident(Ident { value, .. }) = &n.value[0] {
                    if &*value.to_lowercase() == "text" {
                        same_content!(Prefix::Webkit, "-webkit-background-clip");
                    }
                }
            }

            "box-decoration-break" => {
                same_content!(Prefix::Webkit, "-webkit-box-decoration-break");
            }

            "box-sizing" => {
                same_content!(Prefix::Webkit, "-webkit-box-sizing");
                same_content!(Prefix::Moz, "-moz-box-sizing");
            }

            "color-adjust" => {
                same_content!(Prefix::Webkit, "-webkit-print-color-adjust");
            }

            "columns" => {
                same_content!(Prefix::Webkit, "-webkit-columns");
                same_content!(Prefix::Moz, "-moz-columns");
            }

            "column-width" => {
                same_content!(Prefix::Webkit, "-webkit-column-width");
                same_content!(Prefix::Moz, "-moz-column-width");
            }

            "column-gap" => {
                same_content!(Prefix::Webkit, "-webkit-column-gap");
                same_content!(Prefix::Moz, "-moz-column-gap");
            }

            "column-rule" => {
                same_content!(Prefix::Webkit, "-webkit-column-rule");
                same_content!(Prefix::Moz, "-moz-column-rule");
            }

            "column-rule-color" => {
                same_content!(Prefix::Webkit, "-webkit-column-rule-color");
                same_content!(Prefix::Moz, "-moz-column-rule-color");
            }

            "column-rule-width" => {
                same_content!(Prefix::Webkit, "-webkit-column-rule-width");
                same_content!(Prefix::Moz, "-moz-column-rule-width");
            }

            "column-count" => {
                same_content!(Prefix::Webkit, "-webkit-column-count");
                same_content!(Prefix::Moz, "-moz-column-count");
            }

            "column-rule-style" => {
                same_content!(Prefix::Webkit, "-webkit-column-rule-style");
                same_content!(Prefix::Moz, "-moz-column-rule-style");
            }

            "column-span" => {
                same_content!(Prefix::Webkit, "-webkit-column-span");
                same_content!(Prefix::Moz, "-moz-column-span");
            }

            "column-fill" => {
                same_content!(Prefix::Webkit, "-webkit-column-fill");
                same_content!(Prefix::Moz, "-moz-column-fill");
            }

            "cursor" => {
                replace_ident(&mut webkit_new_value, "zoom-in", "-webkit-zoom-in");
                replace_ident(&mut webkit_new_value, "zoom-out", "-webkit-zoom-out");
                replace_ident(&mut webkit_new_value, "grab", "-webkit-grab");
                replace_ident(&mut webkit_new_value, "grabbing", "-webkit-grabbing");

                replace_ident(&mut moz_new_value, "zoom-in", "-moz-zoom-in");
                replace_ident(&mut moz_new_value, "zoom-out", "-moz-zoom-out");
                replace_ident(&mut moz_new_value, "grab", "-moz-grab");
                replace_ident(&mut moz_new_value, "grabbing", "-moz-grabbing");
            }

            "display" if n.value.len() == 1 => {
                if let ComponentValue::Ident(Ident { value, .. }) = &n.value[0] {
                    match &*value.to_lowercase() {
                        "flex" => {
                            same_name!("-webkit-box");
                            same_name!("-webkit-flex");
                            same_name!("-moz-box");
                            same_name!("-ms-flexbox");
                        }

                        "inline-flex" => {
                            same_name!("-webkit-inline-box");
                            same_name!("-webkit-inline-flex");
                            same_name!("-moz-inline-box");
                            same_name!("-ms-inline-flexbox");
                        }

                        _ => {}
                    }
                }
            }

            // TODO improve old spec https://github.com/postcss/autoprefixer/blob/main/data/prefixes.js#L330
            // TODO https://github.com/postcss/autoprefixer/blob/main/lib/hacks/ (starting with flex)
            "flex" => {
                same_content!(Prefix::Webkit, "-webkit-flex");
                same_content!(Prefix::Ms, "-ms-flex");
            }

            "flex-grow" => {
                same_content!(Prefix::Webkit, "-webkit-box-flex");
                same_content!(Prefix::Webkit, "-webkit-flex-grow");
                same_content!(Prefix::Moz, "-moz-box-flex");
                same_content!(Prefix::Ms, "-ms-flex-positive");
            }

            "flex-shrink" => {
                same_content!(Prefix::Webkit, "-webkit-flex-shrink");
                same_content!(Prefix::Ms, "-ms-flex-negative");
            }

            "flex-basis" => {
                same_content!(Prefix::Webkit, "-webkit-flex-basis");
                same_content!(Prefix::Ms, "-ms-flex-preferred-size");
            }

            "flex-direction" => {
                same_content!(Prefix::Webkit, "-webkit-flex-direction");
                same_content!(Prefix::Ms, "-ms-flex-direction");
            }

            "flex-wrap" => {
                same_content!(Prefix::Webkit, "-webkit-flex-wrap");
                same_content!(Prefix::Ms, "-ms-flex-wrap");
            }

            "flex-flow" => {
                same_content!(Prefix::Webkit, "-webkit-flex-flow");
                same_content!(Prefix::Ms, "-ms-flex-flow");
            }

            "justify-content" => {
                if n.value.len() == 1 {
                    if let ComponentValue::Ident(Ident { value, .. }) = &n.value[0] {
                        match &*value.to_lowercase() {
                            "flex-end" => {
                                simple!("-webkit-box-pack", "end");
                                simple!("-ms-flex-pack", "end");
                            }

                            "flex-start" => {
                                simple!("-webkit-box-pack", "start");
                                simple!("-ms-flex-pack", "start");
                            }

                            "justify" => {
                                same_content!(Prefix::Webkit, "-webkit-box-pack");
                                same_content!(Prefix::Ms, "-ms-flex-pack");
                            }

                            "space-between" => {
                                simple!("-webkit-box-pack", "justify");
                            }

                            _ => {}
                        }
                    }
                }

                same_content!(Prefix::Webkit, "-webkit-justify-content");
            }

            "order" => {
                same_content!(Prefix::Webkit, "-webkit-order");
                same_content!(Prefix::Ms, "-ms-flex-order");
            }

            "align-items" => {
                same_content!(Prefix::Webkit, "-webkit-align-items");
                same_content!(Prefix::Webkit, "-webkit-box-align");
                same_content!(Prefix::Ms, "-ms-flex-align");
            }

            "align-self" => {
                same_content!(Prefix::Webkit, "-webkit-align-self");
                same_content!(Prefix::Ms, "-ms-flex-item-align");
            }

            "align-content" => {
                same_content!(Prefix::Webkit, "-webkit-align-content");
                same_content!(Prefix::Ms, "-ms-flex-line-pack");
            }

            "image-rendering" => {
                if let ComponentValue::Ident(Ident { value, .. }) = &n.value[0] {
                    if &*value.to_lowercase() == "pixelated" {
                        simple!("-ms-interpolation-mode", "nearest-neighbor");
                        same_name!("-webkit-optimize-contrast");
                        same_name!("-moz-crisp-edges");
                        same_name!("-o-pixelated");
                    }
                }
            }

            "filter" => match &n.value[0] {
                ComponentValue::Ident(Ident { value, .. })
                    if value.as_ref().eq_ignore_ascii_case("progid") => {}
                ComponentValue::Function(Function { name, .. })
                    if name.value.as_ref().eq_ignore_ascii_case("alpha") => {}
                _ => {
                    same_content!(Prefix::Webkit, "-webkit-filter");
                }
            },

            "backdrop-filter" => {
                same_content!(Prefix::Webkit, "-webkit-backdrop-filter");
            }

            "mask-clip" => {
                same_content!(Prefix::Webkit, "-webkit-mask-clip");
            }

            // Fix me https://github.com/postcss/autoprefixer/blob/main/lib/hacks/mask-composite.js
            "mask-composite" => {
                same_content!(Prefix::Webkit, "-webkit-mask-composite");
            }

            "mask-image" => {
                same_content!(Prefix::Webkit, "-webkit-mask-image");
            }

            "mask-origin" => {
                same_content!(Prefix::Webkit, "-webkit-mask-origin");
            }

            "mask-repeat" => {
                same_content!(Prefix::Webkit, "-webkit-mask-repeat");
            }

            "mask-border-repeat" => {
                same_content!(Prefix::Webkit, "-webkit-mask-border-repeat");
            }

            "mask-border-source" => {
                same_content!(Prefix::Webkit, "-webkit-mask-border-source");
            }

            "mask" => {
                same_content!(Prefix::Webkit, "-webkit-mask");
            }

            "mask-position" => {
                same_content!(Prefix::Webkit, "-webkit-mask-position");
            }

            "mask-size" => {
                same_content!(Prefix::Webkit, "-webkit-mask-size");
            }

            "mask-border" => {
                same_content!(Prefix::Webkit, "-webkit-mask-box-image");
            }

            "mask-border-outset" => {
                same_content!(Prefix::Webkit, "-webkit-mask-box-image-outset");
            }

            "mask-border-width" => {
                same_content!(Prefix::Webkit, "-webkit-mask-box-image-width");
            }

            "mask-border-slice" => {
                same_content!(Prefix::Webkit, "-webkit-mask-box-image-slice");
            }

            "border-inline-start" => {
                same_content!(Prefix::Webkit, "-webkit-border-start");
                same_content!(Prefix::Moz, "-moz-border-start");
            }

            "border-inline-end" => {
                same_content!(Prefix::Webkit, "-webkit-border-end");
                same_content!(Prefix::Moz, "-moz-border-end");
            }

            "margin-inline-start" => {
                same_content!(Prefix::Webkit, "-webkit-margin-start");
                same_content!(Prefix::Moz, "-moz-margin-start");
            }

            "margin-inline-end" => {
                same_content!(Prefix::Webkit, "-webkit-margin-end");
                same_content!(Prefix::Moz, "-moz-margin-end");
            }

            "padding-inline-start" => {
                same_content!(Prefix::Webkit, "-webkit-padding-start");
                same_content!(Prefix::Moz, "-moz-padding-start");
            }

            "padding-inline-end" => {
                same_content!(Prefix::Webkit, "-webkit-padding-end");
                same_content!(Prefix::Moz, "-moz-padding-end");
            }

            "border-block-start" => {
                same_content!(Prefix::Webkit, "-webkit-border-before");
            }

            "border-block-end" => {
                same_content!(Prefix::Webkit, "-webkit-border-after");
            }

            "margin-block-start" => {
                same_content!(Prefix::Webkit, "-webkit-margin-before");
            }

            "margin-block-end" => {
                same_content!(Prefix::Webkit, "-webkit-margin-after");
            }

            "padding-block-start" => {
                same_content!(Prefix::Webkit, "-webkit-padding-before");
            }

            "padding-block-end" => {
                same_content!(Prefix::Webkit, "-webkit-padding-after");
            }

            "backface-visibility" => {
                same_content!(Prefix::Webkit, "-webkit-backface-visibility");
                same_content!(Prefix::Moz, "-moz-backface-visibility");
            }

            "clip-path" => {
                same_content!(Prefix::Webkit, "-webkit-clip-path");
            }

            "position" if n.value.len() == 1 => {
                if let ComponentValue::Ident(Ident { value, .. }) = &n.value[0] {
                    if &*value.to_lowercase() == "sticky" {
                        same_name!("-webkit-sticky");
                    }
                }
            }

            "user-select" => {
                same_content!(Prefix::Webkit, "-webkit-user-select");
                same_content!(Prefix::Moz, "-moz-user-select");

                if let ComponentValue::Ident(Ident { value, .. }) = &n.value[0] {
                    match &*value.to_lowercase() {
                        "contain" => {
                            simple!("-ms-user-select", "element");
                        }
                        "all" => {}
                        _ => {
                            same_content!(Prefix::Ms, "-ms-user-select");
                        }
                    }
                }
            }

            "transform" => {
                same_content!(Prefix::Webkit, "-webkit-transform");
                same_content!(Prefix::Moz, "-moz-transform");
                same_content!(Prefix::Ms, "-ms-transform");
                same_content!(Prefix::O, "-o-transform");
            }

            "transform-origin" => {
                same_content!(Prefix::Webkit, "-webkit-transform-origin");
                same_content!(Prefix::Moz, "-moz-transform-origin");
                same_content!(Prefix::Ms, "-ms-transform-origin");
                same_content!(Prefix::O, "-o-transform-origin");
            }

            "transform-style" => {
                same_content!(Prefix::Webkit, "-webkit-transform-style");
                same_content!(Prefix::Moz, "-moz-transform-style");
            }

            "perspective" => {
                same_content!(Prefix::Webkit, "-webkit-perspective");
                same_content!(Prefix::Moz, "-moz-perspective");
            }

            "perspective-origin" => {
                same_content!(Prefix::Webkit, "-webkit-perspective-origin");
                same_content!(Prefix::Moz, "-moz-perspective-origin");
            }

            "text-decoration" => {
                if n.value.len() == 1 {
                    match &n.value[0] {
                        ComponentValue::Ident(Ident { value, .. })
                            if matches!(
                                &*value.to_lowercase(),
                                "none"
                                    | "underline"
                                    | "overline"
                                    | "line-through"
                                    | "blink"
                                    | "inherit"
                                    | "initial"
                                    | "revert"
                                    | "unset"
                            ) => {}
                        _ => {
                            same_content!(Prefix::Webkit, "-webkit-text-decoration");
                            same_content!(Prefix::Moz, "-moz-text-decoration");
                        }
                    }
                } else {
                    same_content!(Prefix::Webkit, "-webkit-text-decoration");
                    same_content!(Prefix::Moz, "-moz-text-decoration");
                }
            }

            "text-decoration-style" => {
                same_content!(Prefix::Webkit, "-webkit-text-decoration-style");
                same_content!(Prefix::Moz, "-moz-text-decoration-style");
            }

            "text-decoration-color" => {
                same_content!(Prefix::Webkit, "-webkit-text-decoration-color");
                same_content!(Prefix::Moz, "-moz-text-decoration-color");
            }

            "text-decoration-line" => {
                same_content!(Prefix::Webkit, "-webkit-text-decoration-line");
                same_content!(Prefix::Moz, "-moz-text-decoration-line");
            }

            "text-decoration-skip" => {
                same_content!(Prefix::Webkit, "-webkit-text-decoration-skip");
            }

            "text-decoration-skip-ink" => {
                if let ComponentValue::Ident(Ident { value, .. }) = &n.value[0] {
                    match &*value.to_lowercase() {
                        "auto" => {
                            simple!("-webkit-text-decoration-skip", "ink")
                        }
                        _ => {
                            same_content!(Prefix::Webkit, "-webkit-text-decoration-skip-ink");
                        }
                    }
                }
            }

            "text-size-adjust" if n.value.len() == 1 => {
                if let ComponentValue::Ident(Ident { value, .. }) = &n.value[0] {
                    if &*value.to_lowercase() == "none" {
                        same_content!(Prefix::Webkit, "-webkit-text-size-adjust");
                        same_content!(Prefix::Moz, "-moz-text-size-adjust");
                        same_content!(Prefix::Ms, "-ms-text-size-adjust");
                    }
                }
            }

            // TODO improve me for `filter` values https://github.com/postcss/autoprefixer/blob/main/test/cases/transition.css#L6
            "transition" => {
                replace_ident(&mut webkit_new_value, "transform", "-webkit-transform");

                same_content!(Prefix::Webkit, "-webkit-transition");

                replace_ident(&mut moz_new_value, "transform", "-moz-transform");

                same_content!(Prefix::Moz, "-moz-transition");

                replace_ident(&mut o_new_value, "transform", "-o-transform");

                same_content!(Prefix::O, "-o-transition");
            }

            "transition-property" => {
                replace_ident(&mut webkit_new_value, "transform", "-webkit-transform");
                replace_ident(&mut moz_new_value, "transform", "-moz-transform");
                replace_ident(&mut o_new_value, "transform", "-o-transform");

                same_content!(Prefix::Webkit, "-webkit-transition-property");
                same_content!(Prefix::Moz, "-moz-transition-timing-function");
                same_content!(Prefix::O, "-o-transition-timing-function");
            }

            "transition-duration" => {
                same_content!(Prefix::Webkit, "-webkit-transition-duration");
                same_content!(Prefix::Moz, "-moz-transition-duration");
                same_content!(Prefix::O, "-o-transition-duration");
            }

            "transition-delay" => {
                same_content!(Prefix::Webkit, "-webkit-transition-delay");
                same_content!(Prefix::Moz, "-moz-transition-delay");
                same_content!(Prefix::O, "-o-transition-delay");
            }

            "transition-timing-function" => {
                same_content!(Prefix::Webkit, "-webkit-transition-timing-function");
                same_content!(Prefix::Moz, "-moz-transition-timing-function");
                same_content!(Prefix::O, "-o-transition-timing-function");
            }

            // TODO fix me, we should look at `direction` property https://github.com/postcss/autoprefixer/blob/main/lib/hacks/writing-mode.js
            "writing-mode" if n.value.len() == 1 => {
                if let ComponentValue::Ident(Ident { value, .. }) = &n.value[0] {
                    match &*value.to_lowercase() {
                        "none" => {
                            same_content!(Prefix::Webkit, "-webkit-writing-mode");
                            same_content!(Prefix::Ms, "-ms-writing-mode");
                        }

                        "vertical-lr" | "sideways-lr" => {
                            same_content!(Prefix::Webkit, "-webkit-writing-mode");
                            simple!("-ms-writing-mode", "tb");
                        }

                        "vertical-rl" | "sideways-rl" => {
                            same_content!(Prefix::Webkit, "-webkit-writing-mode");
                            simple!("-ms-writing-mode", "tb-rl");
                        }

                        "horizontal-tb" => {
                            same_content!(Prefix::Webkit, "-webkit-writing-mode");
                            simple!("-ms-writing-mode", "lr");
                        }

                        _ => {}
                    }
                }
            }

            "width" | "min-width" | "max-width" | "height" | "min-height" | "max-height"
            | "inline-size" | "min-inline-size" | "max-inline-size" | "block-size"
            | "min-block-size" | "max-block-size"
                if n.value.len() == 1 =>
            {
                if let ComponentValue::Ident(Ident { value, .. }) = &n.value[0] {
                    match &*value.to_lowercase() {
                        "fit-content" => {
                            same_name!("-webkit-fit-content");
                            same_name!("-moz-fit-content");
                        }

                        "max-content" => {
                            same_name!("-webkit-max-content");
                            same_name!("-moz-max-content");
                        }

                        "min-content" => {
                            same_name!("-webkit-min-content");
                            same_name!("-moz-min-content");
                        }

                        "fill-available" | "fill" => {
                            same_name!("-webkit-fill-available");
                            same_name!("-moz-available");
                        }

                        "stretch" => {
                            same_name!("-webkit-fill-available");
                            same_name!("-moz-available");
                            same_name!("fill-available");
                        }

                        _ => {}
                    }
                }
            }

            "touch-action" => {
                let mut value = ms_new_value.clone();

                replace_ident(&mut value, "pan-x", "-ms-pan-x");
                replace_ident(&mut value, "pan-y", "-ms-pan-y");
                replace_ident(&mut value, "double-tap-zoom", "-ms-double-tap-zoom");
                replace_ident(&mut value, "manipulation", "-ms-manipulation");
                replace_ident(&mut value, "none", "-ms-none");
                replace_ident(&mut value, "pinch-zoom", "-ms-pinch-zoom");

                let name = DeclarationName::Ident(Ident {
                    span: DUMMY_SP,
                    value: "-ms-touch-action".into(),
                    raw: "-ms-touch-action".into(),
                });
                self.added_declarations.push(Declaration {
                    span: n.span,
                    name,
                    value,
                    important: n.important.clone(),
                });

                same_content!(Prefix::Ms, "-ms-touch-action");
            }

            "text-orientation" => {
                same_content!(Prefix::Webkit, "-webkit-text-orientation");
            }

            "unicode-bidi" => {
                if let ComponentValue::Ident(Ident { value, .. }) = &n.value[0] {
                    match &*value.to_lowercase() {
                        "isolate" => {
                            same_name!("-moz-isolate");
                            same_name!("-webkit-isolate");
                        }
                        "isolate-override" => {
                            same_name!("-moz-isolate-override");
                            same_name!("-webpack-isolate-override");
                        }
                        "plaintext" => {
                            same_name!("-moz-plaintext");
                            same_name!("-webpack-plaintext");
                        }
                        _ => {}
                    }
                }
            }

            "text-spacing" => {
                same_content!(Prefix::Ms, "-ms-text-spacing");
            }

            "text-emphasis" => {
                same_content!(Prefix::Webkit, "-webkit-text-spacing");
            }

            "text-emphasis-position" => {
                same_content!(Prefix::Webkit, "-webkit-text-emphasis-position");
            }

            "text-emphasis-style" => {
                same_content!(Prefix::Webkit, "-webkit-text-emphasis-style");
            }

            "text-emphasis-color" => {
                same_content!(Prefix::Webkit, "-webkit-text-emphasis-color");
            }

            "flow-into" => {
                same_content!(Prefix::Webkit, "-webkit-flow-into");
                same_content!(Prefix::Ms, "-ms-flow-into");
            }

            "flow-from" => {
                same_content!(Prefix::Webkit, "-webkit-flow-from");
                same_content!(Prefix::Ms, "-ms-flow-from");
            }

            "region-fragment" => {
                same_content!(Prefix::Webkit, "-webkit-region-fragment");
                same_content!(Prefix::Ms, "-ms-region-fragment");
            }

            "scroll-snap-type" => {
                same_content!(Prefix::Webkit, "-webkit-scroll-snap-type");
                same_content!(Prefix::Ms, "-ms-scroll-snap-type");
            }

            "scroll-snap-coordinate" => {
                same_content!(Prefix::Webkit, "-webkit-scroll-snap-coordinate");
                same_content!(Prefix::Ms, "-ms-scroll-snap-coordinate");
            }

            "scroll-snap-destination" => {
                same_content!(Prefix::Webkit, "-webkit-scroll-snap-destination");
                same_content!(Prefix::Ms, "-ms-scroll-snap-destination");
            }

            "scroll-snap-points-x" => {
                same_content!(Prefix::Webkit, "-webkit-scroll-snap-points-x");
                same_content!(Prefix::Ms, "-ms-scroll-snap-points-x");
            }

            "scroll-snap-points-y" => {
                same_content!(Prefix::Webkit, "-webkit-scroll-snap-points-y");
                same_content!(Prefix::Ms, "-ms-scroll-snap-points-y");
            }

            "text-align-last" => {
                same_content!(Prefix::Moz, "-moz-text-align-last");
            }

            "text-overflow" => {
                same_content!(Prefix::O, "-o-text-overflow");
            }

            "shape-margin" => {
                same_content!(Prefix::Webkit, "-webkit-shape-margin");
            }

            "shape-outside" => {
                same_content!(Prefix::Webkit, "-webkit-shape-outside");
            }

            "shape-image-threshold" => {
                same_content!(Prefix::Webkit, "-webkit-shape-image-threshold");
            }

            "object-fit" => {
                same_content!(Prefix::O, "-o-object-fit");
            }

            "object-position" => {
                same_content!(Prefix::O, "-o-object-position");
            }

            "tab-size" => {
                same_content!(Prefix::Moz, "-moz-tab-size");
                same_content!(Prefix::O, "-o-tab-size");
            }

            "hyphens" => {
                same_content!(Prefix::Webkit, "-webkit-hyphens");
                same_content!(Prefix::Moz, "-moz-hyphens");
                same_content!(Prefix::Ms, "-ms-hyphens");
            }

            // TODO fix me https://github.com/postcss/autoprefixer/blob/main/lib/hacks/border-image.js
            "border-image" => {
                same_content!(Prefix::Webkit, "-webkit-border-image");
                same_content!(Prefix::Moz, "-moz-border-image");
                same_content!(Prefix::O, "-o-border-image");
            }

            "font-kerning" => {
                same_content!(Prefix::Webkit, "-webkit-font-kerning");
            }

            "font-feature-settings" => {
                same_content!(Prefix::Webkit, "-webkit-font-feature-settings");
                same_content!(Prefix::Moz, "-moz-font-feature-settings");
            }

            "font-variant-ligatures" => {
                same_content!(Prefix::Webkit, "-webkit-font-variant-ligatures");
                same_content!(Prefix::Moz, "-moz-font-variant-ligatures");
            }

            "font-language-override" => {
                same_content!(Prefix::Webkit, "-webkit-font-language-override");
                same_content!(Prefix::Moz, "-moz-font-language-override");
            }

            "background-origin" => {
                same_content!(Prefix::Webkit, "-webkit-background-origin");
                same_content!(Prefix::O, "-o-background-origin");
            }

            "background-size" => {
                same_content!(Prefix::Webkit, "-webkit-background-size");
                same_content!(Prefix::O, "-o-background-size");
            }

            "overscroll-behavior" => {
                if let ComponentValue::Ident(Ident { value, .. }) = &n.value[0] {
                    match &*value.to_lowercase() {
                        "auto" => {
                            simple!("-ms-scroll-chaining", "chained");
                        }
                        "none" | "contain" => {
                            simple!("-ms-scroll-chaining", "none");
                        }
                        _ => {
                            same_content!(Prefix::Ms, "-ms-scroll-chaining");
                        }
                    }
                } else {
                    same_content!(Prefix::Ms, "-ms-scroll-chaining");
                }
            }

            "box-shadow" => {
                same_content!(Prefix::Webkit, "-webkit-box-shadow");
                same_content!(Prefix::Moz, "-moz-box-shadow");
            }

            "forced-color-adjust" => {
                same_content!(Prefix::Ms, "-ms-high-contrast-adjust");
            }

            "break-inside" => {
                if let ComponentValue::Ident(Ident { value, .. }) = &n.value[0] {
                    match &*value.to_lowercase() {
                        "auto" | "avoid" => {
                            same_content!(Prefix::Webkit, "-webkit-column-break-inside");
                        }
                        _ => {}
                    }
                }
            }

            "break-before" => {
                if let ComponentValue::Ident(Ident { value, .. }) = &n.value[0] {
                    match &*value.to_lowercase() {
                        "auto" | "avoid" => {
                            same_content!(Prefix::Webkit, "-webkit-column-break-before");
                        }
                        "column" => {
                            simple!("-webkit-column-break-before", "always");
                        }
                        _ => {}
                    }
                }
            }

            "break-after" => {
                if let ComponentValue::Ident(Ident { value, .. }) = &n.value[0] {
                    match &*value.to_lowercase() {
                        "auto" | "avoid" => {
                            same_content!(Prefix::Webkit, "-webkit-column-break-after");
                        }
                        "column" => {
                            simple!("-webkit-column-break-after", "always");
                        }
                        _ => {}
                    }
                }
            }

            "border-radius" => {
                same_content!(Prefix::Webkit, "-webkit-border-radius");
                same_content!(Prefix::Moz, "-moz-border-radius");
            }

            "border-top-left-radius" => {
                same_content!(Prefix::Webkit, "-webkit-border-top-left-radius");
                same_content!(Prefix::Moz, "-moz-border-radius-topleft");
            }

            "border-top-right-radius" => {
                same_content!(Prefix::Webkit, "-webkit-border-top-right-radius");
                same_content!(Prefix::Moz, "-moz-border-radius-topright");
            }

            "border-bottom-right-radius" => {
                same_content!(Prefix::Webkit, "-webkit-border-bottom-right-radius");
                same_content!(Prefix::Moz, "-moz-border-radius-bottomright");
            }

            "border-bottom-left-radius" => {
                same_content!(Prefix::Webkit, "-webkit-border-bottom-left-radius");
                same_content!(Prefix::Moz, "-moz-border-radius-bottomleft");
            }

            // TODO add `grid` support https://github.com/postcss/autoprefixer/tree/main/lib/hacks (starting with grid) and https://github.com/postcss/autoprefixer/blob/main/data/prefixes.js#L559 and https://github.com/postcss/autoprefixer/blob/main/lib/hacks/intrinsic.js
            // TODO handle https://github.com/postcss/autoprefixer/blob/main/data/prefixes.js#L938
            // TODO handle `image-set()` https://github.com/postcss/autoprefixer/blob/main/lib/hacks/image-set.js
            // TODO handle `linear-gradient()`/`repeating-linear-gradient()`/`radial-gradient()`/`repeating-radial-gradient()` in all properties https://github.com/postcss/autoprefixer/blob/main/data/prefixes.js#L168
            // TODO add https://github.com/postcss/autoprefixer/blob/main/lib/hacks/filter-value.js
            // TODO add https://github.com/postcss/autoprefixer/blob/main/lib/hacks/cross-fade.js
            // TODO handle transform functions https://github.com/postcss/autoprefixer/blob/main/lib/hacks/transform-decl.js
            // TODO fix me https://github.com/postcss/autoprefixer/blob/main/test/cases/custom-prefix.out.css
            _ => {}
        }

        if n.value != webkit_new_value {
            self.added_declarations.push(Declaration {
                span: n.span,
                name: n.name.clone(),
                value: webkit_new_value,
                important: n.important.clone(),
            });
        }

        if n.value != moz_new_value {
            self.added_declarations.push(Declaration {
                span: n.span,
                name: n.name.clone(),
                value: moz_new_value,
                important: n.important.clone(),
            });
        }

        if n.value != o_new_value {
            self.added_declarations.push(Declaration {
                span: n.span,
                name: n.name.clone(),
                value: o_new_value,
                important: n.important.clone(),
            });
        }

        if n.value != ms_new_value {
            self.added_declarations.push(Declaration {
                span: n.span,
                name: n.name.clone(),
                value: ms_new_value,
                important: n.important.clone(),
            });
        }
    }

    fn visit_mut_simple_block(&mut self, simple_block: &mut SimpleBlock) {
        let old_in_simple_block = self.in_simple_block;

        self.in_simple_block = true;

        let mut new = vec![];

        for mut n in take(&mut simple_block.value) {
            n.visit_mut_children_with(self);

            new.extend(
                self.added_declarations
                    .drain(..)
                    .map(DeclarationOrAtRule::Declaration)
                    .map(ComponentValue::DeclarationOrAtRule),
            );
            new.push(n);
        }

        simple_block.value = new;

        self.in_simple_block = old_in_simple_block;
    }
}
