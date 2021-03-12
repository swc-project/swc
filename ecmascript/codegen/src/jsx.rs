use super::{Emitter, Result};
use crate::list::ListFormat;
use swc_common::Spanned;
use swc_ecma_ast::*;
use swc_ecma_codegen_macros::emitter;

impl<'a> Emitter<'a> {
    #[emitter]
    fn emit_jsx_element(&mut self, node: &JSXElement) -> Result {
        emit!(node.opening);
        self.emit_list(
            node.span(),
            Some(&node.children),
            ListFormat::JsxElementOrFragmentChildren,
        )?;
        if let Some(ref closing) = node.closing {
            emit!(closing)
        }
    }

    #[emitter]
    fn emit_jsx_opening_element(&mut self, node: &JSXOpeningElement) -> Result {
        punct!("<");
        emit!(node.name);

        space!();

        self.emit_list(
            node.span(),
            Some(&node.attrs),
            ListFormat::JsxElementAttributes,
        )?;

        if node.self_closing {
            punct!("/");
        }
        punct!(">");
    }

    #[emitter]
    fn emit_jsx_element_name(&mut self, node: &JSXElementName) -> Result {
        match *node {
            JSXElementName::Ident(ref n) => emit!(n),
            JSXElementName::JSXMemberExpr(ref n) => emit!(n),
            JSXElementName::JSXNamespacedName(ref n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_jsx_attr(&mut self, node: &JSXAttr) -> Result {
        emit!(node.name);

        if let Some(ref value) = node.value {
            punct!("=");

            emit!(value);
        }
    }

    #[emitter]
    fn emit_jsx_attr_value(&mut self, node: &JSXAttrValue) -> Result {
        match *node {
            JSXAttrValue::Lit(ref n) => emit!(n),
            JSXAttrValue::JSXExprContainer(ref n) => emit!(n),
            JSXAttrValue::JSXElement(ref n) => emit!(n),
            JSXAttrValue::JSXFragment(ref n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_jsx_attr_name(&mut self, node: &JSXAttrName) -> Result {
        match *node {
            JSXAttrName::Ident(ref n) => emit!(n),
            JSXAttrName::JSXNamespacedName(ref n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_jsx_attr_or_spread(&mut self, node: &JSXAttrOrSpread) -> Result {
        match *node {
            JSXAttrOrSpread::JSXAttr(ref n) => emit!(n),
            JSXAttrOrSpread::SpreadElement(ref n) => {
                punct!("{");
                emit!(n);
                punct!("}");
            }
        }
    }

    #[emitter]
    fn emit_jsx_element_child(&mut self, node: &JSXElementChild) -> Result {
        match *node {
            JSXElementChild::JSXElement(ref n) => emit!(n),
            JSXElementChild::JSXExprContainer(ref n) => emit!(n),
            JSXElementChild::JSXFragment(ref n) => emit!(n),
            JSXElementChild::JSXSpreadChild(ref n) => emit!(n),
            JSXElementChild::JSXText(ref n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_jsx_spread_child(&mut self, node: &JSXSpreadChild) -> Result {
        punct!("{");
        punct!("...");
        emit!(node.expr);
        punct!("}");
    }

    #[emitter]
    fn emit_jsx_expr_container(&mut self, node: &JSXExprContainer) -> Result {
        punct!("{");
        emit!(node.expr);
        punct!("}");
    }

    #[emitter]
    fn emit_jsx_expr(&mut self, node: &JSXExpr) -> Result {
        match *node {
            JSXExpr::Expr(ref n) => emit!(n),
            JSXExpr::JSXEmptyExpr(ref n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_jsx_closing_element(&mut self, node: &JSXClosingElement) -> Result {
        punct!("</");
        emit!(node.name);
        punct!(">");
    }

    #[emitter]
    fn emit_jsx_fragment(&mut self, node: &JSXFragment) -> Result {
        emit!(node.opening);

        self.emit_list(
            node.span(),
            Some(&node.children),
            ListFormat::JsxElementOrFragmentChildren,
        )?;

        emit!(node.closing);
    }

    #[emitter]
    fn emit_jsx_opening_fragment(&mut self, node: &JSXOpeningFragment) -> Result {
        punct!("<>")
    }

    #[emitter]
    fn emit_jsx_closing_fragment(&mut self, node: &JSXClosingFragment) -> Result {
        punct!("</>")
    }

    #[emitter]
    fn emit_jsx_namespaced_name(&mut self, node: &JSXNamespacedName) -> Result {
        emit!(node.ns);
        punct!(":");
        emit!(node.name);
    }

    #[emitter]
    fn emit_jsx_empty_expr(&mut self, node: &JSXEmptyExpr) -> Result {}

    #[emitter]
    fn emit_jsx_text(&mut self, node: &JSXText) -> Result {
        self.emit_js_word(node.span(), &node.value)?;
    }

    #[emitter]
    fn emit_jsx_member_expr(&mut self, node: &JSXMemberExpr) -> Result {
        emit!(node.obj);
        punct!(".");
        emit!(node.prop);
    }

    #[emitter]
    fn emit_jsx_object(&mut self, node: &JSXObject) -> Result {
        match *node {
            JSXObject::Ident(ref n) => emit!(n),
            JSXObject::JSXMemberExpr(ref n) => emit!(n),
        }
    }
}
