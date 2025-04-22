use swc_common::{SourceMapper, Span, Spanned};
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
        let lo = only_new!(emitter.wr.get_pos());

        emit!(emitter, self.opening);
        emitter.emit_list(
            self.span(),
            Some(&self.children),
            ListFormat::JsxElementOrFragmentChildren,
        )?;
        let closing = if let Some(ref closing) = self.closing {
            Some(emit!(emitter, closing))
        } else {
            None
        };
        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(JSXElement {
            span: Span::new(lo, hi),
            closing,
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for JSXOpeningElement {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        let lo = only_new!(emitter.wr.get_pos());

        punct!(emitter, "<");
        emit!(emitter, self.name);

        if let Some(type_args) = &self.type_args {
            emit!(emitter, type_args);
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

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(JSXOpeningElement {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for JSXElementName {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match *self {
            JSXElementName::Ident(ref n) => {
                let n = emit!(emitter, n);

                Ok(only_new!(JSXElementName::Ident(n)))
            }
            JSXElementName::JSXMemberExpr(ref n) => {
                let n = emit!(emitter, n);

                Ok(only_new!(JSXElementName::JSXMemberExpr(n)))
            }
            JSXElementName::JSXNamespacedName(ref n) => {
                let n = emit!(emitter, n);

                Ok(only_new!(JSXElementName::JSXNamespacedName(n)))
            }
        }
    }
}

#[node_impl]
impl MacroNode for JSXAttr {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        let lo = only_new!(emitter.wr.get_pos());

        emit!(emitter, self.name);

        if let Some(ref value) = self.value {
            punct!(emitter, "=");
            emit!(emitter, value);
        }
        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(JSXAttr {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for JSXAttrValue {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match *self {
            JSXAttrValue::Lit(ref n) => {
                let n = emit!(emitter, n);

                Ok(only_new!(JSXAttrValue::Lit(n)))
            }
            JSXAttrValue::JSXExprContainer(ref n) => {
                let n = emit!(emitter, n);

                Ok(only_new!(JSXAttrValue::JSXExprContainer(n)))
            }
            JSXAttrValue::JSXElement(ref n) => {
                let n = emit!(emitter, n);

                Ok(only_new!(JSXAttrValue::JSXElement(n)))
            }
            JSXAttrValue::JSXFragment(ref n) => {
                let n = emit!(emitter, n);

                Ok(only_new!(JSXAttrValue::JSXFragment(n)))
            }
        }
    }
}

#[node_impl]
impl MacroNode for JSXAttrName {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match *self {
            JSXAttrName::Ident(ref n) => {
                let n = emit!(emitter, n);

                Ok(only_new!(JSXAttrName::Ident(n)))
            }
            JSXAttrName::JSXNamespacedName(ref n) => {
                let n = emit!(emitter, n);

                Ok(only_new!(JSXAttrName::JSXNamespacedName(n)))
            }
        }
    }
}

#[node_impl]
impl MacroNode for JSXAttrOrSpread {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match *self {
            JSXAttrOrSpread::JSXAttr(ref n) => {
                let n = emit!(emitter, n);

                Ok(only_new!(JSXAttrOrSpread::JSXAttr(n)))
            }
            JSXAttrOrSpread::SpreadElement(ref n) => {
                punct!(emitter, "{");
                let n = emit!(emitter, n);
                punct!(emitter, "}");

                Ok(only_new!(JSXAttrOrSpread::SpreadElement(n)))
            }
        }
    }
}

#[node_impl]
impl MacroNode for JSXElementChild {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match *self {
            JSXElementChild::JSXElement(ref n) => {
                let n = emit!(emitter, n);

                Ok(only_new!(JSXElementChild::JSXElement(n)))
            }
            JSXElementChild::JSXExprContainer(ref n) => {
                let n = emit!(emitter, n);

                Ok(only_new!(JSXElementChild::JSXExprContainer(n)))
            }
            JSXElementChild::JSXSpreadChild(ref n) => {
                let n = emit!(emitter, n);

                Ok(only_new!(JSXElementChild::JSXSpreadChild(n)))
            }
            JSXElementChild::JSXFragment(ref n) => {
                let n = emit!(emitter, n);

                Ok(only_new!(JSXElementChild::JSXFragment(n)))
            }
            JSXElementChild::JSXText(ref n) => {
                let n = emit!(emitter, n);

                Ok(only_new!(JSXElementChild::JSXText(n)))
            }
        }
    }
}

#[node_impl]
impl MacroNode for JSXSpreadChild {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        let lo = only_new!(emitter.wr.get_pos());

        punct!(emitter, "{");
        punct!(emitter, "...");
        emit!(emitter, self.expr);
        punct!(emitter, "}");

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(JSXSpreadChild {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for JSXExprContainer {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        let lo = only_new!(emitter.wr.get_pos());

        punct!(emitter, "{");
        emit!(emitter, self.expr);
        punct!(emitter, "}");

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(JSXExprContainer {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for JSXExpr {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match *self {
            JSXExpr::Expr(ref n) => {
                let n = emit!(emitter, n);

                Ok(only_new!(JSXExpr::Expr(n)))
            }
            JSXExpr::JSXEmptyExpr(ref n) => {
                let n = emit!(emitter, n);

                Ok(only_new!(JSXExpr::JSXEmptyExpr(n)))
            }
        }
    }
}

#[node_impl]
impl MacroNode for JSXClosingElement {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        let lo = only_new!(emitter.wr.get_pos());

        punct!(emitter, "</");
        emit!(emitter, self.name);
        punct!(emitter, ">");

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(JSXClosingElement {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for JSXFragment {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        let lo = only_new!(emitter.wr.get_pos());

        emit!(emitter, self.opening);

        emitter.emit_list(
            self.span(),
            Some(&self.children),
            ListFormat::JsxElementOrFragmentChildren,
        )?;

        emit!(emitter, self.closing);

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(JSXFragment {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for JSXOpeningFragment {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        let lo = only_new!(emitter.wr.get_pos());

        punct!(emitter, "<>");

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(JSXOpeningFragment {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for JSXClosingFragment {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        let lo = only_new!(emitter.wr.get_pos());

        punct!(emitter, "</>");

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(JSXClosingFragment {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}
#[node_impl]
impl MacroNode for JSXNamespacedName {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        let lo = only_new!(emitter.wr.get_pos());

        emit!(emitter, self.ns);
        punct!(emitter, ":");
        emit!(emitter, self.name);

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(JSXNamespacedName {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for JSXEmptyExpr {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        let lo = only_new!(emitter.wr.get_pos());

        Ok(only_new!(JSXEmptyExpr {
            span: Span::new(lo, lo),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for JSXText {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        let lo = only_new!(emitter.wr.get_pos());

        emitter.emit_atom(self.span(), &self.raw)?;

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(JSXText {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for JSXMemberExpr {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        let lo = only_new!(emitter.wr.get_pos());

        emit!(emitter, self.obj);
        punct!(emitter, ".");
        emit!(emitter, self.prop);

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(JSXMemberExpr {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for JSXObject {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match *self {
            JSXObject::Ident(ref n) => {
                let n = emit!(emitter, n);

                Ok(only_new!(JSXObject::Ident(n)))
            }
            JSXObject::JSXMemberExpr(ref n) => {
                let n = emit!(emitter, n);

                Ok(only_new!(JSXObject::JSXMemberExpr(n)))
            }
        }
    }
}
