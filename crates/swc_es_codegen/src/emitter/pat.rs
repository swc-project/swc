use swc_es_ast::{ObjectPatProp, Pat};

use super::{EmitResult, Emitter};

impl Emitter<'_> {
    pub(super) fn emit_pat(&mut self, id: swc_es_ast::PatId) -> EmitResult {
        let store = self.store;
        match Self::get_pat(store, id)? {
            Pat::Ident(ident) => {
                self.write_ident_sym(&ident.sym);
                Ok(())
            }
            Pat::Expr(expr) => self.emit_expr(*expr, 0),
            Pat::Array(array) => {
                self.out.push_byte(b'[');
                for (idx, elem) in array.elems.iter().enumerate() {
                    if idx != 0 {
                        self.out.push_byte(b',');
                    }
                    if let Some(elem) = elem {
                        self.emit_pat(*elem)?;
                    }
                }
                self.out.push_byte(b']');
                Ok(())
            }
            Pat::Object(object) => {
                self.out.push_byte(b'{');
                for (idx, prop) in object.props.iter().enumerate() {
                    if idx != 0 {
                        self.out.push_byte(b',');
                    }
                    match prop {
                        ObjectPatProp::KeyValue(prop) => {
                            self.emit_prop_name(&prop.key)?;
                            self.out.push_byte(b':');
                            self.emit_pat(prop.value)?;
                        }
                        ObjectPatProp::Assign(prop) => {
                            self.write_ident_sym(&prop.key.sym);
                            if let Some(value) = prop.value {
                                self.out.push_byte(b'=');
                                self.emit_expr(value, 0)?;
                            }
                        }
                        ObjectPatProp::Rest(rest) => {
                            self.out.push_str("...");
                            self.emit_pat(rest.arg)?;
                        }
                    }
                }
                self.out.push_byte(b'}');
                Ok(())
            }
            Pat::Rest(rest) => {
                self.out.push_str("...");
                self.emit_pat(rest.arg)
            }
            Pat::Assign(assign) => {
                self.emit_pat(assign.left)?;
                self.out.push_byte(b'=');
                self.emit_expr(assign.right, 0)
            }
        }
    }
}
