use swc_common::{SourceMapper, Spanned};
use swc_ecma_ast::*;
use swc_ecma_codegen_macros::node_impl;

use super::Emitter;
use crate::text_writer::WriteJs;

impl<W, S: SourceMapper> Emitter<'_, W, S>
where
    W: WriteJs,
    S: SourceMapperExt,
{
}

#[node_impl]
impl MacroNode for JSXElement {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emit_ref!(emitter, self.opening);
        emitter.emit_list(
            self.span(),
            Some(&self.children),
            ListFormat::JsxElementOrFragmentChildren,
        )?;
        if let Some(closing) = ref_maybe_mut!(self.closing) {
            emit!(closing)
        }
        Ok(())
    }
}

#[node_impl]
impl MacroNode for JSXOpeningElement {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        punct!(emitter, "<");
        emit_ref!(emitter, self.name);

        if let Some(type_args) = ref_maybe_mut!(self.type_args) {
            emit!(type_args);
        }

        if !self.attrs.is_empty() {
            space!(emitter);

            emitter.emit_list(
                self.span(),
                Some(&self.attrs),
                ListFormat::JsxElementAttributes,
            )?;
        }

        if self.self_closing {
            punct!(emitter, "/");
        }
        punct!(emitter, ">");
        Ok(())
    }
}

#[node_impl]
impl MacroNode for JSXElementName {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            JSXElementName::Ident(n) => emit!(n),
            JSXElementName::JSXMemberExpr(n) => emit!(n),
            JSXElementName::JSXNamespacedName(n) => emit!(n),
        }
        Ok(())
    }
}

#[node_impl]
impl MacroNode for JSXAttr {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emit_ref!(emitter, self.name);

        if let Some(value) = ref_maybe_mut!(self.value) {
            punct!(emitter, "=");
            emit!(value);
        }
        Ok(())
    }
}

#[node_impl]
impl MacroNode for JSXAttrValue {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            JSXAttrValue::Lit(n) => emit!(n),
            JSXAttrValue::JSXExprContainer(n) => emit!(n),
            JSXAttrValue::JSXElement(n) => emit!(n),
            JSXAttrValue::JSXFragment(n) => emit!(n),
        }
        Ok(())
    }
}

#[node_impl]
impl MacroNode for JSXAttrName {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            JSXAttrName::Ident(n) => emit!(n),
            JSXAttrName::JSXNamespacedName(n) => emit!(n),
        }
        Ok(())
    }
}

#[node_impl]
impl MacroNode for JSXAttrOrSpread {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            JSXAttrOrSpread::JSXAttr(n) => emit!(n),
            JSXAttrOrSpread::SpreadElement(n) => {
                punct!(emitter, "{");
                emit!(n);
                punct!(emitter, "}");
            }
        }
        Ok(())
    }
}

#[node_impl]
impl MacroNode for JSXElementChild {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            JSXElementChild::JSXElement(n) => emit!(n),
            JSXElementChild::JSXExprContainer(n) => emit!(n),
            JSXElementChild::JSXFragment(n) => emit!(n),
            JSXElementChild::JSXSpreadChild(n) => emit!(n),
            JSXElementChild::JSXText(n) => emit!(n),
        }
        Ok(())
    }
}

#[node_impl]
impl MacroNode for JSXSpreadChild {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        punct!(emitter, "{");
        punct!(emitter, "...");
        emit_ref!(emitter, self.expr);
        punct!(emitter, "}");
        Ok(())
    }
}

#[node_impl]
impl MacroNode for JSXExprContainer {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        punct!(emitter, "{");
        emit_ref!(emitter, self.expr);
        punct!(emitter, "}");
        Ok(())
    }
}

#[node_impl]
impl MacroNode for JSXExpr {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            JSXExpr::Expr(n) => emit!(n),
            JSXExpr::JSXEmptyExpr(n) => emit!(n),
        }
        Ok(())
    }
}

#[node_impl]
impl MacroNode for JSXClosingElement {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        punct!(emitter, "</");
        emit_ref!(emitter, self.name);
        punct!(emitter, ">");
        Ok(())
    }
}

#[node_impl]
impl MacroNode for JSXFragment {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emit_ref!(emitter, self.opening);

        emitter.emit_list(
            self.span(),
            Some(&self.children),
            ListFormat::JsxElementOrFragmentChildren,
        )?;

        emit_ref!(emitter, self.closing);
        Ok(())
    }
}

#[node_impl]
impl MacroNode for JSXOpeningFragment {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        punct!(emitter, "<>");
        Ok(())
    }
}

#[node_impl]
impl MacroNode for JSXClosingFragment {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        punct!(emitter, "</>");
        Ok(())
    }
}

#[node_impl]
impl MacroNode for JSXNamespacedName {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emit_ref!(emitter, self.ns);
        punct!(emitter, ":");
        emit_ref!(emitter, self.name);
        Ok(())
    }
}

#[node_impl]
impl MacroNode for JSXEmptyExpr {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        Ok(())
    }
}

#[node_impl]
impl MacroNode for JSXText {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_atom(self.span(), &self.raw)?;
        Ok(())
    }
}

#[node_impl]
impl MacroNode for JSXMemberExpr {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emit_ref!(emitter, self.obj);
        punct!(emitter, ".");
        emit_ref!(emitter, self.prop);
        Ok(())
    }
}

#[node_impl]
impl MacroNode for JSXObject {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            JSXObject::Ident(n) => emit!(n),
            JSXObject::JSXMemberExpr(n) => emit!(n),
        }
        Ok(())
    }
}
