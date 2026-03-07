use swc_es_ast::{ImportAttributeName, ImportSpecifier, ModuleDecl};

use super::{EmitResult, Emitter};

impl Emitter<'_> {
    pub(super) fn emit_module_decl_stmt(&mut self, id: swc_es_ast::ModuleDeclId) -> EmitResult {
        let store = self.store;
        match Self::get_module_decl(store, id)? {
            ModuleDecl::Import(import) => {
                self.out.push_str("import");

                if import.specifiers.is_empty() {
                    self.out.push_byte(b' ');
                    self.out.write_js_string(import.src.value.as_ref());
                } else {
                    self.out.push_byte(b' ');

                    let mut default_spec = None;
                    let mut namespace_spec = None;
                    let mut named_specs = Vec::new();

                    for spec in &import.specifiers {
                        match spec {
                            ImportSpecifier::Default(spec) => default_spec = Some(spec),
                            ImportSpecifier::Namespace(spec) => namespace_spec = Some(spec),
                            ImportSpecifier::Named(spec) => named_specs.push(spec),
                        }
                    }

                    let mut wrote_any = false;
                    if let Some(default_spec) = default_spec {
                        wrote_any = true;
                        self.write_ident_sym(&default_spec.local.sym);
                    }

                    if let Some(namespace_spec) = namespace_spec {
                        if wrote_any {
                            self.out.push_byte(b',');
                        }
                        wrote_any = true;
                        self.out.push_str("* as ");
                        self.write_ident_sym(&namespace_spec.local.sym);
                    }

                    if !named_specs.is_empty() {
                        if wrote_any {
                            self.out.push_byte(b',');
                        }
                        self.out.push_byte(b'{');
                        for (idx, spec) in named_specs.iter().enumerate() {
                            if idx != 0 {
                                self.out.push_byte(b',');
                            }
                            if let Some(imported) = &spec.imported {
                                self.write_module_name(&imported.sym);
                                if imported.sym != spec.local.sym {
                                    self.out.push_str(" as ");
                                    self.write_ident_sym(&spec.local.sym);
                                }
                            } else {
                                self.write_ident_sym(&spec.local.sym);
                            }
                        }
                        self.out.push_byte(b'}');
                    }

                    self.out.push_str(" from ");
                    self.out.write_js_string(import.src.value.as_ref());
                }

                self.emit_import_attributes(&import.with)?;
                self.out.push_byte(b';');
                Ok(())
            }
            ModuleDecl::ExportNamed(export_named) => {
                if let Some(decl) = export_named.decl {
                    if !export_named.specifiers.is_empty() || export_named.src.is_some() {
                        return Err(Self::invalid_ast(
                            "export named declaration cannot combine decl with specifiers/src",
                        ));
                    }
                    self.out.push_str("export ");
                    return self.emit_module_item_decl(decl);
                }

                self.out.push_str("export{");
                for (idx, spec) in export_named.specifiers.iter().enumerate() {
                    if idx != 0 {
                        self.out.push_byte(b',');
                    }

                    self.write_module_name(&spec.local.sym);
                    if let Some(exported) = &spec.exported {
                        if exported.sym != spec.local.sym {
                            self.out.push_str(" as ");
                            self.write_module_name(&exported.sym);
                        }
                    }
                }
                self.out.push_byte(b'}');

                if let Some(src) = &export_named.src {
                    self.out.push_str(" from ");
                    self.out.write_js_string(src.value.as_ref());
                }
                self.emit_import_attributes(&export_named.with)?;
                self.out.push_byte(b';');
                Ok(())
            }
            ModuleDecl::ExportDefaultExpr(expr) => {
                self.out.push_str("export default ");
                self.emit_expr(expr.expr, 0)?;
                self.out.push_byte(b';');
                Ok(())
            }
            ModuleDecl::ExportDefaultDecl(decl) => {
                self.out.push_str("export default ");
                self.emit_decl_for_export_default(decl.decl)
            }
            ModuleDecl::ExportAll(export_all) => {
                self.out.push_str("export *");
                if let Some(exported) = &export_all.exported {
                    self.out.push_str(" as ");
                    self.write_module_name(&exported.sym);
                }
                self.out.push_str(" from ");
                self.out.write_js_string(export_all.src.value.as_ref());
                self.emit_import_attributes(&export_all.with)?;
                self.out.push_byte(b';');
                Ok(())
            }
            ModuleDecl::ExportDecl(export_decl) => {
                self.out.push_str("export ");
                self.emit_module_item_decl(export_decl.decl)
            }
        }
    }

    fn emit_import_attributes(&mut self, attrs: &[swc_es_ast::ImportAttribute]) -> EmitResult {
        if attrs.is_empty() {
            return Ok(());
        }

        self.out.push_str(" with {");
        for (idx, attr) in attrs.iter().enumerate() {
            if idx != 0 {
                self.out.push_byte(b',');
            }
            match &attr.key {
                ImportAttributeName::Ident(ident) => self.write_module_name(&ident.sym),
                ImportAttributeName::Str(str_lit) => {
                    self.out.write_js_string(str_lit.value.as_ref())
                }
            }
            self.out.push_byte(b':');
            self.out.write_js_string(attr.value.value.as_ref());
        }
        self.out.push_byte(b'}');
        Ok(())
    }
}
