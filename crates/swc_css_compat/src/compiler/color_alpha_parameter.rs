use swc_atoms::js_word;
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

                if name.value == js_word!("rgb") {
                    name.value = js_word!("rgba");
                    name.raw = None;
                } else if name.value == js_word!("hsl") {
                    name.value = js_word!("hsla");
                    name.raw = None;
                }
            } else {
                let name = match &mut function.name {
                    FunctionName::Ident(name) => name,
                    _ => {
                        return;
                    }
                };

                if name.value == js_word!("rgba") {
                    name.value = js_word!("rgb");
                    name.raw = None;
                } else if name.value == js_word!("hsla") {
                    name.value = js_word!("hsl");
                    name.raw = None;
                }
            }
        }
    }
}
