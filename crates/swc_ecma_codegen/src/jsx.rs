use swc_common::{SourceMapper, Spanned};
use swc_ecma_ast::*;
use swc_ecma_codegen_macros::emitter;

use super::{Emitter, Result};
use crate::text_writer::WriteJs;

impl<W, S: SourceMapper> Emitter<'_, W, S>
where
    W: WriteJs,
    S: SourceMapperExt,
{
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

    fn emit_jsx_opening_element(&mut self, node: &JSXOpeningElement) -> Result {
        punct!(self, "<");
        emit!(node.name);

        if let Some(type_args) = &node.type_args {
            emit!(type_args);
        }

        if !node.attrs.is_empty() {
            space!(self);

            self.emit_list(
                node.span(),
                Some(&node.attrs),
                ListFormat::JsxElementAttributes,
            )?;
        }

        if node.self_closing {
            punct!(self, "/");
        }
        punct!(self, ">");
    }

    fn emit_jsx_element_name(&mut self, node: &JSXElementName) -> Result {
        match *node {
            JSXElementName::Ident(ref n) => emit!(n),
            JSXElementName::JSXMemberExpr(ref n) => emit!(n),
            JSXElementName::JSXNamespacedName(ref n) => emit!(n),
        }
    }

    fn emit_jsx_attr(&mut self, node: &JSXAttr) -> Result {
        emit!(node.name);

        if let Some(ref value) = node.value {
            punct!(self, "=");

            emit!(value);
        }
    }

    fn emit_jsx_attr_value(&mut self, node: &JSXAttrValue) -> Result {
        match *node {
            JSXAttrValue::Lit(ref n) => emit!(n),
            JSXAttrValue::JSXExprContainer(ref n) => emit!(n),
            JSXAttrValue::JSXElement(ref n) => emit!(n),
            JSXAttrValue::JSXFragment(ref n) => emit!(n),
        }
    }

    fn emit_jsx_attr_name(&mut self, node: &JSXAttrName) -> Result {
        match *node {
            JSXAttrName::Ident(ref n) => emit!(n),
            JSXAttrName::JSXNamespacedName(ref n) => emit!(n),
        }
    }

    fn emit_jsx_attr_or_spread(&mut self, node: &JSXAttrOrSpread) -> Result {
        match *node {
            JSXAttrOrSpread::JSXAttr(ref n) => emit!(n),
            JSXAttrOrSpread::SpreadElement(ref n) => {
                punct!(self, "{");
                emit!(n);
                punct!(self, "}");
            }
        }
    }

    fn emit_jsx_element_child(&mut self, node: &JSXElementChild) -> Result {
        match *node {
            JSXElementChild::JSXElement(ref n) => emit!(n),
            JSXElementChild::JSXExprContainer(ref n) => emit!(n),
            JSXElementChild::JSXFragment(ref n) => emit!(n),
            JSXElementChild::JSXSpreadChild(ref n) => emit!(n),
            JSXElementChild::JSXText(ref n) => emit!(n),
        }
    }

    fn emit_jsx_spread_child(&mut self, node: &JSXSpreadChild) -> Result {
        punct!(self, "{");
        punct!(self, "...");
        emit!(node.expr);
        punct!(self, "}");
    }

    fn emit_jsx_expr_container(&mut self, node: &JSXExprContainer) -> Result {
        punct!(self, "{");
        emit!(node.expr);
        punct!(self, "}");
    }

    fn emit_jsx_expr(&mut self, node: &JSXExpr) -> Result {
        match *node {
            JSXExpr::Expr(ref n) => emit!(n),
            JSXExpr::JSXEmptyExpr(ref n) => emit!(n),
        }
    }

    fn emit_jsx_closing_element(&mut self, node: &JSXClosingElement) -> Result {
        punct!(self, "</");
        emit!(node.name);
        punct!(self, ">");
    }

    fn emit_jsx_fragment(&mut self, node: &JSXFragment) -> Result {
        emit!(node.opening);

        self.emit_list(
            node.span(),
            Some(&node.children),
            ListFormat::JsxElementOrFragmentChildren,
        )?;

        emit!(node.closing);
    }

    fn emit_jsx_opening_fragment(&mut self, _: &JSXOpeningFragment) -> Result {
        punct!(self, "<>")
    }

    fn emit_jsx_closing_fragment(&mut self, _: &JSXClosingFragment) -> Result {
        punct!(self, "</>")
    }

    fn emit_jsx_namespaced_name(&mut self, node: &JSXNamespacedName) -> Result {
        emit!(node.ns);
        punct!(self, ":");
        emit!(node.name);
    }

    fn emit_jsx_empty_expr(&mut self, _: &JSXEmptyExpr) -> Result {}

    fn emit_jsx_text(&mut self, node: &JSXText) -> Result {
        self.emit_atom(node.span(), &node.raw)?;
    }

    fn emit_jsx_member_expr(&mut self, node: &JSXMemberExpr) -> Result {
        emit!(node.obj);
        punct!(self, ".");
        emit!(node.prop);
    }

    fn emit_jsx_object(&mut self, node: &JSXObject) -> Result {
        match *node {
            JSXObject::Ident(ref n) => emit!(n),
            JSXObject::JSXMemberExpr(ref n) => emit!(n),
        }
    }
}
