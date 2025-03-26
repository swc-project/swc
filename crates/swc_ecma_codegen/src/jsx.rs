use swc_common::{SourceMapper, Spanned};
use swc_ecma_ast::*;
use swc_ecma_codegen_macros::emitter;

use super::{Emitter, Result};
use crate::text_writer::WriteJs;

#[node_impl]
impl MacroNode for JSXObject {
    fn emit(&mut self, emitter: &mut Macro) {
        match self {
            JSXObject::Ident(n) => emit!(n),
            JSXObject::JSXMemberExpr(n) => emit!(n),
        }
    }
}

#[node_impl]
impl MacroNode for JSXElement {
    fn emit(&mut self, emitter: &mut Macro) {
        emit!(self.opening);
        emitter.emit_list(
            self.span(),
            Some(&self.children),
            ListFormat::JsxElementOrFragmentChildren,
        )?;
        if let Some(ref closing) = self.closing {
            emit!(closing)
        }
    }
}

#[node_impl]
impl MacroNode for JSXOpeningElement {
    fn emit(&mut self, emitter: &mut Macro) {
        punct!("<");
        emit!(self.name);

        if let Some(type_args) = &self.type_args {
            emit!(type_args);
        }

        if !self.attrs.is_empty() {
            space!();

            emitter.emit_list(
                self.span(),
                Some(&self.attrs),
                ListFormat::JsxElementAttributes,
            )?;
        }

        if self.self_closing {
            punct!("/");
        }
        punct!(">");
    }
}

#[node_impl]
impl MacroNode for JSXElementName {
    fn emit(&mut self, emitter: &mut Macro) {
        match self {
            JSXElementName::Ident(n) => emit!(n),
            JSXElementName::JSXMemberExpr(n) => emit!(n),
            JSXElementName::JSXNamespacedName(n) => emit!(n),
        }
    }
}

#[node_impl]
impl MacroNode for JSXAttr {
    fn emit(&mut self, emitter: &mut Macro) {
        emit!(self.name);

        if let Some(ref value) = self.value {
            punct!("=");

            emit!(value);
        }
    }
}

#[node_impl]
impl MacroNode for JSXAttrValue {
    fn emit(&mut self, emitter: &mut Macro) {
        match self {
            JSXAttrValue::Lit(n) => emit!(n),
            JSXAttrValue::JSXExprContainer(n) => emit!(n),
            JSXAttrValue::JSXElement(n) => emit!(n),
            JSXAttrValue::JSXFragment(n) => emit!(n),
        }
    }
}

#[node_impl]
impl MacroNode for JSXAttrName {
    fn emit(&mut self, emitter: &mut Macro) {
        match self {
            JSXAttrName::Ident(n) => emit!(n),
            JSXAttrName::JSXNamespacedName(n) => emit!(n),
        }
    }
}

#[node_impl]
impl MacroNode for JSXAttrOrSpread {
    fn emit(&mut self, emitter: &mut Macro) {
        match self {
            JSXAttrOrSpread::JSXAttr(n) => emit!(n),
            JSXAttrOrSpread::SpreadElement(n) => {
                punct!("{");
                emit!(n);
                punct!("}");
            }
        }
    }
}

#[node_impl]
impl MacroNode for JSXElementChild {
    fn emit(&mut self, emitter: &mut Macro) {
        match self {
            JSXElementChild::JSXElement(n) => emit!(n),
            JSXElementChild::JSXExprContainer(n) => emit!(n),
            JSXElementChild::JSXFragment(n) => emit!(n),
            JSXElementChild::JSXSpreadChild(n) => emit!(n),
            JSXElementChild::JSXText(n) => emit!(n),
        }
    }
}

#[node_impl]
impl MacroNode for JSXSpreadChild {
    fn emit(&mut self, emitter: &mut Macro) {
        punct!("{");
        punct!("...");
        emit!(self.expr);
        punct!("}");
    }
}

#[node_impl]
impl MacroNode for JSXExprContainer {
    fn emit(&mut self, emitter: &mut Macro) {
        punct!("{");
        emit!(self.expr);
        punct!("}");
    }
}

#[node_impl]
impl MacroNode for JSXExpr {
    fn emit(&mut self, emitter: &mut Macro) {
        match self {
            JSXExpr::Expr(n) => emit!(n),
            JSXExpr::JSXEmptyExpr(n) => emit!(n),
        }
    }
}

#[node_impl]
impl MacroNode for JSXClosingElement {
    fn emit(&mut self, emitter: &mut Macro) {
        punct!("</");
        emit!(self.name);
        punct!(">");
    }
}

#[node_impl]
impl MacroNode for JSXFragment {
    fn emit(&mut self, emitter: &mut Macro) {
        emit!(self.opening);

        emitter.emit_list(
            self.span(),
            Some(&self.children),
            ListFormat::JsxElementOrFragmentChildren,
        )?;

        emit!(self.closing);
    }
}

#[node_impl]
impl MacroNode for JSXOpeningFragment {
    fn emit(&mut self, emitter: &mut Macro) {
        punct!("<>");
    }
}

#[node_impl]
impl MacroNode for JSXClosingFragment {
    fn emit(&mut self, emitter: &mut Macro) {
        punct!("</>");
    }
}

#[node_impl]
impl MacroNode for JSXNamespacedName {
    fn emit(&mut self, emitter: &mut Macro) {
        emit!(self.ns);
        punct!(":");
        emit!(self.name);
    }
}

#[node_impl]
impl MacroNode for JSXEmptyExpr {
    fn emit(&mut self, emitter: &mut Macro) {
        // Empty implementation as per its nature
    }
}

#[node_impl]
impl MacroNode for JSXText {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter.emit_atom(self.span(), &self.raw)?;
    }
}

#[node_impl]
impl MacroNode for JSXMemberExpr {
    fn emit(&mut self, emitter: &mut Macro) {
        emit!(self.obj);
        punct!(".");
        emit!(self.prop);
    }
}

impl<W, S: SourceMapper> Emitter<'_, W, S>
where
    W: WriteJs,
    S: SourceMapperExt,
{
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

        if let Some(type_args) = &node.type_args {
            emit!(type_args);
        }

        if !node.attrs.is_empty() {
            space!();

            self.emit_list(
                node.span(),
                Some(&node.attrs),
                ListFormat::JsxElementAttributes,
            )?;
        }

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
    fn emit_jsx_namespaced_name(&mut self, node: &JSXNamespacedName) -> Result {
        emit!(node.ns);
        punct!(":");
        emit!(node.name);
    }

    #[emitter]
    fn emit_jsx_empty_expr(&mut self, _: &JSXEmptyExpr) -> Result {}

    #[emitter]
    fn emit_jsx_text(&mut self, node: &JSXText) -> Result {
        self.emit_atom(node.span(), &node.raw)?;
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
