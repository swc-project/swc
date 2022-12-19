use swc_atoms::js_word;
use swc_css_ast::AbsoluteColorBase;

use crate::compiler::Compiler;

impl Compiler {
    pub(crate) fn process_color_hwb(&mut self, n: &mut AbsoluteColorBase) {
        if let AbsoluteColorBase::Function(function) = n {
            if function.name.value != js_word!("hwb") {
                return;
            }

            // Logic
        }
    }
}
