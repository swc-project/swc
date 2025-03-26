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
