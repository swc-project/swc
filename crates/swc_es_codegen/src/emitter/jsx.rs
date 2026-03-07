use swc_es_ast::{Expr, JSXElementChild, JSXElementName, Lit};

use super::{EmitResult, Emitter};

impl Emitter<'_> {
    pub(super) fn emit_jsx_element(&mut self, id: swc_es_ast::JSXElementId) -> EmitResult {
        let store = self.store;
        let element = Self::get_jsx_element(store, id)?;

        self.out.push_byte(b'<');
        self.emit_jsx_name(&element.opening.name);

        for attr in &element.opening.attrs {
            if attr.name.as_ref() == "..." {
                self.out.push_byte(b' ');
                self.out.push_byte(b'{');
                self.out.push_str("...");
                if let Some(value) = attr.value {
                    self.emit_expr(value, 0)?;
                }
                self.out.push_byte(b'}');
                continue;
            }

            self.out.push_byte(b' ');
            self.out.push_str(attr.name.as_ref());

            if let Some(value) = attr.value {
                self.out.push_byte(b'=');
                if let Expr::Lit(Lit::Str(lit)) = Self::get_expr(store, value)? {
                    self.out.write_js_string(lit.value.as_ref());
                } else {
                    self.out.push_byte(b'{');
                    self.emit_expr(value, 0)?;
                    self.out.push_byte(b'}');
                }
            }
        }

        if element.opening.self_closing {
            self.out.push_str("/>");
            return Ok(());
        }

        self.out.push_byte(b'>');

        for child in &element.children {
            match child {
                JSXElementChild::Element(id) => self.emit_jsx_element(*id)?,
                JSXElementChild::Text(text) => self.out.push_str(text.as_ref()),
                JSXElementChild::Expr(expr) => {
                    self.out.push_byte(b'{');
                    self.emit_expr(*expr, 0)?;
                    self.out.push_byte(b'}');
                }
            }
        }

        let closing = element
            .closing
            .as_ref()
            .ok_or_else(|| Self::invalid_ast("non-self-closing jsx element must have closing"))?;

        self.out.push_str("</");
        self.emit_jsx_name(closing);
        self.out.push_byte(b'>');
        Ok(())
    }

    fn emit_jsx_name(&mut self, name: &JSXElementName) {
        match name {
            JSXElementName::Ident(ident) => self.write_ident_sym(&ident.sym),
            JSXElementName::Qualified(name) => self.out.push_str(name.as_ref()),
        }
    }
}
