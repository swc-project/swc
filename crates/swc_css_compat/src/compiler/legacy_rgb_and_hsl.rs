use swc_atoms::js_word;
use swc_css_ast::{AbsoluteColorBase, AlphaValue, ComponentValue, Number, Percentage};

use crate::compiler::{
    utils::{clamp_unit_f32, round_alpha},
    Compiler,
};
impl Compiler {
    pub(crate) fn process_rgb_and_hsl(&mut self, n: &mut AbsoluteColorBase) {
        if let AbsoluteColorBase::Function(function) = n {
            let name = function.name.value.to_ascii_lowercase();

            let is_rgb = matches!(name, js_word!("rgb") | js_word!("rgba"));
            let is_hsl = matches!(name, js_word!("hsl") | js_word!("hsla"));

            if is_rgb {
                function.value = function
                    .value
                    .drain(..)
                    .into_iter()
                    .map(|n| match n {
                        ComponentValue::Percentage(box Percentage {
                            span,
                            value: Number { value, .. },
                            ..
                        }) => ComponentValue::Number(Box::new(Number {
                            span,
                            value: clamp_unit_f32(value / 100.0) as f64,
                            raw: None,
                        })),
                        _ => n,
                    })
                    .collect();
            } else if is_hsl {
            }

            // TODO handle angle for hsl/hsla
            if is_rgb || is_hsl {
                if let Some(ComponentValue::AlphaValue(box alpha_value)) = function.value.last_mut()
                {
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
}
