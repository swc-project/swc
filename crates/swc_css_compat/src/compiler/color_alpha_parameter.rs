use swc_atoms::js_word;
use swc_css_ast::{AbsoluteColorBase, ComponentValue};

use crate::compiler::Compiler;

impl Compiler {
    pub(crate) fn process_color_alpha_parameter(&mut self, n: &mut AbsoluteColorBase) {
        if let AbsoluteColorBase::Function(function) = n {
            if let Some(ComponentValue::AlphaValue(_)) = function.value.last() {
                let name = function.name.value.to_ascii_lowercase();

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
            }
        }
    }
}
