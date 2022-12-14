use swc_atoms::js_word;
use swc_css_ast::{AbsoluteColorBase, AlphaValue, ComponentValue, Number, Percentage};

use crate::compiler::{utils::round_alpha, Compiler};

impl Compiler {
    pub(crate) fn process_color_alpha_parameter(&mut self, n: &mut AbsoluteColorBase) {
        if let AbsoluteColorBase::Function(function) = n {
            let name = function.name.value.to_ascii_lowercase();

            if let Some(ComponentValue::AlphaValue(_) | ComponentValue::Function(_)) =
                function.value.last()
            {
                if !matches!(
                    name,
                    js_word!("rgb") | js_word!("rgba") | js_word!("hsl") | js_word!("hsla")
                ) {
                    return;
                }

                match name {
                    js_word!("rgb") => {
                        function.name.value = js_word!("rgba");
                        function.name.raw = None;
                    }
                    js_word!("hsl") => {
                        function.name.value = js_word!("hsla");
                        function.name.raw = None;
                    }
                    _ => {}
                }
            } else {
                match name {
                    js_word!("rgba") => {
                        function.name.value = js_word!("rgb");
                        function.name.raw = None;
                    }
                    js_word!("hsla") => {
                        function.name.value = js_word!("hsl");
                        function.name.raw = None;
                    }
                    _ => {}
                }
            }
        }
    }

    pub(crate) fn process_float_values_in_parameters(&mut self, n: &mut AbsoluteColorBase) {
        if let AbsoluteColorBase::Function(function) = n {
            if let Some(ComponentValue::AlphaValue(box alpha_value)) = function.value.last_mut() {
                let name = function.name.value.to_ascii_lowercase();

                if !matches!(
                    name,
                    js_word!("rgb") | js_word!("rgba") | js_word!("hsl") | js_word!("hsla")
                ) {
                    return;
                }

                if let AlphaValue::Percentage(Percentage {
                    span,
                    value: Number { value: a, .. },
                    ..
                }) = alpha_value
                {
                    *alpha_value = AlphaValue::Number(Number {
                        span: *span,
                        value: round_alpha(*a / 100.0),
                        raw: None,
                    });
                }
            }
        }
    }
}
