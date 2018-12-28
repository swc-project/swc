use super::{Emitter, Result};
use swc_ecma_ast::*;
use swc_ecma_codegen_macros::emitter;

impl<'a> Emitter<'a> {
    #[emitter]
    pub fn emit_jsx_element(&mut self, node: &JSXElement) -> Result {
        unimplemented!("emit_jsx_element")
    }

    #[emitter]
    pub fn emit_jsx_fragment(&mut self, node: &JSXFragment) -> Result {
        unimplemented!("emit_jsx_fragment")
    }

    #[emitter]
    pub fn emit_jsx_namespaced_name(&mut self, node: &JSXNamespacedName) -> Result {
        unimplemented!("emit_jsx_namespaced_name")
    }

    #[emitter]
    pub fn emit_jsx_empty_expr(&mut self, node: &JSXEmptyExpr) -> Result {}

    #[emitter]
    pub fn emit_jsx_text(&mut self, node: &JSXText) -> Result {
        unimplemented!("emit_jsx_text")
    }

    #[emitter]
    pub fn emit_jsx_member_expr(&mut self, node: &JSXMemberExpr) -> Result {
        unimplemented!("emit_jsx_member_expr")
    }
}
