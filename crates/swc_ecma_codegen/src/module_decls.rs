use swc_common::{SourceMapper, Spanned};
use swc_ecma_ast::*;
use swc_ecma_codegen_macros::emitter;

use crate::{
    text_writer::WriteJs, util::StartsWithAlphaNum, Emitter, ListFormat, Result, SourceMapperExt,
};

#[node_impl]
impl MacroNode for ModuleDecl {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        match self {
            ModuleDecl::Import(ref d) => emit!(d),
            ModuleDecl::ExportDecl(ref d) => emit!(d),
            ModuleDecl::ExportNamed(ref d) => emit!(d),
            ModuleDecl::ExportDefaultDecl(ref d) => emit!(d),
            ModuleDecl::ExportDefaultExpr(ref n) => emit!(n),
            ModuleDecl::ExportAll(ref d) => emit!(d),
            ModuleDecl::TsExportAssignment(ref n) => emit!(n),
            ModuleDecl::TsImportEquals(ref n) => emit!(n),
            ModuleDecl::TsNamespaceExport(ref n) => emit!(n),
        }

        emitter.emit_trailing_comments_of_pos(self.span().hi, true, true)?;

        if !emitter.cfg.minify {
            emitter.wr.write_line()?;
        }
    }
}

#[node_impl]
impl MacroNode for ExportDecl {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        srcmap!(self, true);

        match &self.decl {
            Decl::Class(decl) => {
                for dec in &decl.class.decorators {
                    emit!(dec);
                }

                keyword!("export");

                space!();
                emitter.emit_class_decl_inner(decl, true)?;
            }
            _ => {
                keyword!("export");

                space!();
                emit!(self.decl);
            }
        }
    }
}

#[node_impl]
impl MacroNode for ExportDefaultExpr {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        srcmap!(self, true);

        keyword!("export");

        space!();
        keyword!("default");
        {
            let starts_with_alpha_num = self.expr.starts_with_alpha_num();
            if starts_with_alpha_num {
                space!();
            } else {
                formatting_space!();
            }
            emit!(self.expr);
        }
        semi!();

        srcmap!(self, false);
    }
}

#[node_impl]
impl MacroNode for ExportDefaultDecl {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(self, true);

        keyword!("export");

        space!();
        keyword!("default");
        space!();
        match self.decl {
            DefaultDecl::Class(ref n) => emit!(n),
            DefaultDecl::Fn(ref n) => emit!(n),
            DefaultDecl::TsInterfaceDecl(ref n) => emit!(n),
        }
    }
}

#[node_impl]
impl MacroNode for ImportDecl {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(self, true);

        keyword!("import");

        if self.type_only {
            space!();
            keyword!("type");
        }

        match self.phase {
            ImportPhase::Evaluation => {}
            ImportPhase::Source => {
                space!();
                keyword!("source");
            }
            ImportPhase::Defer => {
                space!();
                keyword!("defer");
            }
        }

        let starts_with_ident = !self.specifiers.is_empty()
            && match &self.specifiers[0] {
                ImportSpecifier::Default(_) => true,
                _ => false,
            };
        if starts_with_ident {
            space!();
        } else {
            formatting_space!();
        }

        let mut specifiers = Vec::new();
        let mut emitted_default = false;
        let mut emitted_ns = false;
        for specifier in &self.specifiers {
            match specifier {
                ImportSpecifier::Named(ref s) => {
                    specifiers.push(s);
                }
                ImportSpecifier::Default(ref s) => {
                    emit!(s.local);
                    emitted_default = true;
                }
                ImportSpecifier::Namespace(ref ns) => {
                    if emitted_default {
                        punct!(",");
                        formatting_space!();
                    }

                    emitted_ns = true;

                    assert!(self.specifiers.len() <= 2);
                    punct!("*");
                    formatting_space!();
                    keyword!("as");
                    space!();
                    emit!(ns.local);
                }
            }
        }

        if specifiers.is_empty() {
            if emitted_ns || emitted_default {
                space!();
                keyword!("from");
                formatting_space!();
            }
        } else {
            if emitted_default {
                punct!(",");
                formatting_space!();
            }

            punct!("{");
            emitter.emit_list(
                self.span(),
                Some(&specifiers),
                ListFormat::NamedImportsOrExportsElements,
            )?;
            punct!("}");
            formatting_space!();

            keyword!("from");
            formatting_space!();
        }

        emit!(self.src);

        if let Some(with) = &self.with {
            formatting_space!();
            if emitter.cfg.emit_assert_for_import_attributes {
                keyword!("assert");
            } else {
                keyword!("with")
            };
            formatting_space!();
            emit!(with);
        }

        semi!();

        srcmap!(self, false);
    }
}

#[node_impl]
impl MacroNode for ImportNamedSpecifier {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        srcmap!(self, true);

        if self.is_type_only {
            keyword!("type");
            space!();
        }

        if let Some(ref imported) = self.imported {
            emit!(imported);
            space!();
            keyword!("as");
            space!();
        }

        emit!(self.local);

        srcmap!(self, false);
    }
}

#[node_impl]
impl MacroNode for ExportSpecifier {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            ExportSpecifier::Default(..) => {
                unimplemented!("codegen of `export default from 'foo';`")
            }
            ExportSpecifier::Namespace(ref node) => emit!(node),
            ExportSpecifier::Named(ref node) => emit!(node),
        }
    }
}

#[node_impl]
impl MacroNode for ExportNamespaceSpecifier {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(self, true);

        punct!("*");
        formatting_space!();
        keyword!("as");
        space!();
        emit!(self.name);

        srcmap!(self, false);
    }
}

#[node_impl]
impl MacroNode for ExportNamedSpecifier {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(self, true);

        if self.is_type_only {
            keyword!("type");
            space!();
        }

        if let Some(exported) = &self.exported {
            emit!(self.orig);
            space!();
            keyword!("as");
            space!();
            emit!(exported);
        } else {
            emit!(self.orig);
        }
        srcmap!(self, false);
    }
}

#[node_impl]
impl MacroNode for NamedExport {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(self, true);

        struct Specifiers<'a> {
            has_namespace_spec: bool,
            namespace_spec: Option<&'a ExportNamespaceSpecifier>,
            has_named_specs: bool,
            named_specs: Vec<&'a ExportSpecifier>,
        }
        let Specifiers {
            has_namespace_spec,
            namespace_spec,
            has_named_specs,
            named_specs,
        } = self.specifiers.iter().fold(
            Specifiers {
                has_namespace_spec: false,
                namespace_spec: None,
                has_named_specs: false,
                named_specs: Vec::new(),
            },
            |mut result, s| match s {
                ExportSpecifier::Namespace(spec) => {
                    result.has_namespace_spec = true;
                    // There can only be one namespace export specifier.
                    if result.namespace_spec.is_none() {
                        result.namespace_spec = Some(spec)
                    }
                    result
                }
                spec => {
                    result.has_named_specs = true;
                    result.named_specs.push(spec);
                    result
                }
            },
        );

        keyword!("export");

        if self.type_only {
            space!();
            keyword!("type");
        }
        formatting_space!();

        if let Some(spec) = namespace_spec {
            emit!(spec);
            if has_named_specs {
                punct!(",");
                formatting_space!();
            }
        }
        if has_named_specs || !has_namespace_spec {
            punct!("{");
            emitter.emit_list(
                self.span,
                Some(&named_specs),
                ListFormat::NamedImportsOrExportsElements,
            )?;
            punct!("}");
        }

        if let Some(ref src) = self.src {
            if has_named_specs || !has_namespace_spec {
                formatting_space!();
            } else if has_namespace_spec {
                space!();
            }
            keyword!("from");
            formatting_space!();
            emit!(src);

            if let Some(with) = &self.with {
                formatting_space!();
                if emitter.cfg.emit_assert_for_import_attributes {
                    keyword!("assert");
                } else {
                    keyword!("with")
                };
                formatting_space!();
                emit!(with);
            }
        }
        semi!();

        srcmap!(self, false);
    }
}

#[node_impl]
impl MacroNode for ExportAll {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(self, true);

        keyword!("export");

        if self.type_only {
            space!();
            keyword!("type");
            space!();
        } else {
            formatting_space!();
        }

        punct!("*");
        formatting_space!();
        keyword!("from");
        formatting_space!();
        emit!(self.src);

        if let Some(with) = &self.with {
            formatting_space!();
            if emitter.cfg.emit_assert_for_import_attributes {
                keyword!("assert");
            } else {
                keyword!("with")
            };
            formatting_space!();
            emit!(with);
        }

        semi!();

        srcmap!(self, false);
    }
}
