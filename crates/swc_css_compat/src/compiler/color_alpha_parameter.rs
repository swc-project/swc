use swc_css_ast::{AbsoluteColorBase, ComponentValue, FunctionName};

use crate::compiler::Compiler;

impl Compiler {
    pub(crate) fn process_color_alpha_parameter(&mut self, n: &mut AbsoluteColorBase) {
        if let AbsoluteColorBase::Function(function) = n {
            if let Some(ComponentValue::AlphaValue(_) | ComponentValue::Function(_)) =
                function.value.last()
            {
                let name = match &mut function.name {
                    FunctionName::Ident(name) => name,
                    _ => {
                        return;
                    }
                };

                if name.value.eq_ignore_ascii_case("rgb") {
                    name.value = "rgba".into();
                    name.raw = None;
                } else if name.value.eq_ignore_ascii_case("hsl") {
                    name.value = "hsla".into();
                    name.raw = None;
                }
            } else {
                let name = match &mut function.name {
                    FunctionName::Ident(name) => name,
                    _ => {
                        return;
                    }
                };

                if name.value.eq_ignore_ascii_case("rgba") {
                    name.value = "rgb".into();
                    name.raw = None;
                } else if name.value.eq_ignore_ascii_case("hsla") {
                    name.value = "hsl".into();
                    name.raw = None;
                }
            }
        }
    }
}
