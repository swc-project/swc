use swc_es_ast::{
    ExportSpecifier, ImportAttribute, ImportAttributeName, ImportSpecifier, ModuleDecl,
    ModuleDeclId,
};

use super::Emitter;
use crate::Result;

impl<W> Emitter<'_, W>
where
    W: crate::WriteJs,
{
    pub(crate) fn emit_module_decl(&mut self, module_decl: ModuleDeclId) -> Result {
        match self.module_decl(module_decl).clone() {
            ModuleDecl::Import(decl) => {
                self.keyword("import")?;

                if decl.specifiers.is_empty() {
                    self.write_space_pretty()?;
                    self.emit_string_literal(decl.src.value.as_ref())?;
                } else {
                    self.write_space_pretty()?;
                    self.emit_import_specifiers(&decl.specifiers)?;
                    self.write_space_pretty()?;
                    self.keyword("from")?;
                    self.write_space_pretty()?;
                    self.emit_string_literal(decl.src.value.as_ref())?;
                }

                self.emit_import_attributes(&decl.with)?;
                self.punct(";")
            }
            ModuleDecl::ExportNamed(decl) => {
                self.keyword("export")?;
                self.write_space_pretty()?;

                if let Some(inline_decl) = decl.decl {
                    self.emit_decl(inline_decl)?;
                    return Ok(());
                }

                self.punct("{")?;
                for (index, specifier) in decl.specifiers.iter().enumerate() {
                    if index != 0 {
                        self.punct(",")?;
                        self.write_space_pretty()?;
                    }
                    self.emit_export_specifier(specifier)?;
                }
                self.punct("}")?;

                if let Some(src) = decl.src {
                    self.write_space_pretty()?;
                    self.keyword("from")?;
                    self.write_space_pretty()?;
                    self.emit_string_literal(src.value.as_ref())?;
                }

                self.emit_import_attributes(&decl.with)?;
                self.punct(";")
            }
            ModuleDecl::ExportDefaultExpr(decl) => {
                self.keyword("export")?;
                self.write_space_pretty()?;
                self.keyword("default")?;
                self.write_space_pretty()?;
                self.emit_expr(decl.expr)?;
                self.punct(";")
            }
            ModuleDecl::ExportDefaultDecl(decl) => {
                self.keyword("export")?;
                self.write_space_pretty()?;
                self.keyword("default")?;
                self.write_space_pretty()?;
                self.emit_decl(decl.decl)
            }
            ModuleDecl::ExportAll(decl) => {
                self.keyword("export")?;
                self.write_space_pretty()?;
                self.punct("*")?;
                if let Some(exported) = decl.exported {
                    self.write_space_pretty()?;
                    self.keyword("as")?;
                    self.write_space_pretty()?;
                    self.emit_ident(&exported)?;
                }
                self.write_space_pretty()?;
                self.keyword("from")?;
                self.write_space_pretty()?;
                self.emit_string_literal(decl.src.value.as_ref())?;
                self.emit_import_attributes(&decl.with)?;
                self.punct(";")
            }
            ModuleDecl::ExportDecl(decl) => {
                self.keyword("export")?;
                self.write_space_pretty()?;
                self.emit_decl(decl.decl)
            }
        }
    }

    fn emit_import_specifiers(&mut self, specifiers: &[ImportSpecifier]) -> Result {
        let mut default = None;
        let mut namespace = None;
        let mut named = Vec::new();

        for specifier in specifiers {
            match specifier {
                ImportSpecifier::Default(specifier) => default = Some(specifier.local.clone()),
                ImportSpecifier::Namespace(specifier) => {
                    namespace = Some(specifier.local.clone());
                }
                ImportSpecifier::Named(specifier) => named.push(specifier.clone()),
            }
        }

        let mut need_comma = false;

        if let Some(local) = default {
            self.emit_ident(&local)?;
            need_comma = true;
        }

        if let Some(local) = namespace {
            if need_comma {
                self.punct(",")?;
                self.write_space_pretty()?;
            }
            self.punct("*")?;
            self.write_space_pretty()?;
            self.keyword("as")?;
            self.write_space_pretty()?;
            self.emit_ident(&local)?;
            need_comma = true;
        }

        if !named.is_empty() {
            if need_comma {
                self.punct(",")?;
                self.write_space_pretty()?;
            }
            self.punct("{")?;
            for (index, specifier) in named.iter().enumerate() {
                if index != 0 {
                    self.punct(",")?;
                    self.write_space_pretty()?;
                }

                if let Some(imported) = &specifier.imported {
                    self.emit_ident(imported)?;
                    if imported.sym != specifier.local.sym {
                        self.write_space_pretty()?;
                        self.keyword("as")?;
                        self.write_space_pretty()?;
                        self.emit_ident(&specifier.local)?;
                    }
                } else {
                    self.emit_ident(&specifier.local)?;
                }
            }
            self.punct("}")?;
        }

        Ok(())
    }

    fn emit_export_specifier(&mut self, specifier: &ExportSpecifier) -> Result {
        self.emit_ident(&specifier.local)?;

        if let Some(exported) = &specifier.exported {
            if exported.sym != specifier.local.sym {
                self.write_space_pretty()?;
                self.keyword("as")?;
                self.write_space_pretty()?;
                self.emit_ident(exported)?;
            }
        }

        Ok(())
    }

    fn emit_import_attributes(&mut self, attrs: &[ImportAttribute]) -> Result {
        if attrs.is_empty() {
            return Ok(());
        }

        self.write_space_pretty()?;
        self.keyword("with")?;
        self.write_space_pretty()?;
        self.punct("{")?;

        for (index, attr) in attrs.iter().enumerate() {
            if index != 0 {
                self.punct(",")?;
                self.write_space_pretty()?;
            }

            match &attr.key {
                ImportAttributeName::Ident(ident) => self.emit_ident(ident)?,
                ImportAttributeName::Str(value) => {
                    self.emit_string_literal(value.value.as_ref())?
                }
            }

            self.punct(":")?;
            self.write_space_pretty()?;
            self.emit_string_literal(attr.value.value.as_ref())?;
        }

        self.punct("}")
    }
}
