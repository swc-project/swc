use swc_es_ast::{ObjectPatProp, Pat, PatId};

use super::Emitter;
use crate::Result;

impl<W> Emitter<'_, W>
where
    W: crate::WriteJs,
{
    pub(crate) fn emit_pat(&mut self, pat: PatId) -> Result {
        match self.pat(pat).clone() {
            Pat::Ident(ident) => self.emit_ident(&ident),
            Pat::Expr(expr) => self.emit_expr(expr),
            Pat::Array(array) => {
                self.punct("[")?;
                for (index, elem) in array.elems.iter().enumerate() {
                    if index != 0 {
                        self.punct(",")?;
                        self.write_space_pretty()?;
                    }

                    if let Some(elem) = elem {
                        self.emit_pat(*elem)?;
                    }
                }
                self.punct("]")
            }
            Pat::Object(object) => {
                self.punct("{")?;
                for (index, prop) in object.props.iter().enumerate() {
                    if index != 0 {
                        self.punct(",")?;
                        self.write_space_pretty()?;
                    }

                    match prop {
                        ObjectPatProp::KeyValue(prop) => {
                            self.emit_prop_name(&prop.key)?;
                            self.punct(":")?;
                            self.write_space_pretty()?;
                            self.emit_pat(prop.value)?;
                        }
                        ObjectPatProp::Assign(prop) => {
                            self.emit_ident(&prop.key)?;
                            if let Some(value) = prop.value {
                                self.write_space_pretty()?;
                                self.punct("=")?;
                                self.write_space_pretty()?;
                                self.emit_expr(value)?;
                            }
                        }
                        ObjectPatProp::Rest(rest) => {
                            self.punct("...")?;
                            self.emit_pat(rest.arg)?;
                        }
                    }
                }
                self.punct("}")
            }
            Pat::Rest(rest) => {
                self.punct("...")?;
                self.emit_pat(rest.arg)
            }
            Pat::Assign(assign) => {
                self.emit_pat(assign.left)?;
                self.write_space_pretty()?;
                self.punct("=")?;
                self.write_space_pretty()?;
                self.emit_expr(assign.right)
            }
        }
    }
}
