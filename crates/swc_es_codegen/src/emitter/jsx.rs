use swc_es_ast::{Expr, JSXElementChild, JSXElementId, JSXElementName, Lit};

use super::Emitter;
use crate::Result;

impl<W> Emitter<'_, W>
where
    W: crate::WriteJs,
{
    pub(super) fn emit_jsx_element(&mut self, element_id: JSXElementId) -> Result {
        let element = self.jsx_element(element_id).clone();

        self.punct("<")?;
        self.emit_jsx_name(&element.opening.name)?;

        for attr in &element.opening.attrs {
            self.write_space_force()?;
            if attr.name.as_ref() == "..." {
                self.punct("{")?;
                self.punct("...")?;
                if let Some(value) = attr.value {
                    self.emit_expr(value)?;
                }
                self.punct("}")?;
                continue;
            }

            self.write_token(attr.name.as_ref())?;
            if let Some(value) = attr.value {
                self.punct("=")?;
                match self.expr(value).clone() {
                    Expr::Lit(Lit::Str(value)) => {
                        self.emit_string_literal(value.value.as_ref())?;
                    }
                    _ => {
                        self.punct("{")?;
                        self.emit_expr(value)?;
                        self.punct("}")?;
                    }
                }
            }
        }

        if element.opening.self_closing {
            self.punct(" />")?;
            return Ok(());
        }

        self.punct(">")?;

        for child in &element.children {
            match child {
                JSXElementChild::Element(element) => self.emit_jsx_element(*element)?,
                JSXElementChild::Text(text) => self.write_raw(text.as_ref())?,
                JSXElementChild::Expr(expr) => {
                    self.punct("{")?;
                    self.emit_expr(*expr)?;
                    self.punct("}")?;
                }
            }
        }

        self.punct("</")?;
        if let Some(name) = &element.closing {
            self.emit_jsx_name(name)?;
        } else {
            self.emit_jsx_name(&element.opening.name)?;
        }
        self.punct(">")
    }

    fn emit_jsx_name(&mut self, name: &JSXElementName) -> Result {
        match name {
            JSXElementName::Ident(ident) => self.emit_ident(ident),
            JSXElementName::Qualified(name) => self.write_token(name.as_ref()),
        }
    }
}
