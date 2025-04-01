use swc_common::{SourceMapper, Spanned};
use swc_ecma_ast::*;
use swc_ecma_codegen_macros::emitter;

use crate::{
    text_writer::WriteJs, util::StartsWithAlphaNum, Emitter, ListFormat, Result, SourceMapperExt,
};

impl<W, S: SourceMapper> Emitter<'_, W, S>
where
    W: WriteJs,
    S: SourceMapperExt,
{
    #[emitter]
    pub(crate) fn emit_module_decl(&mut self, node: &ModuleDecl) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        match *node {
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

        self.emit_trailing_comments_of_pos(node.span().hi, true, true)?;

        if !self.cfg.minify {
            self.wr.write_line()?;
        }
    }

    #[emitter]
    pub(crate) fn emit_export_decl(&mut self, n: &ExportDecl) -> Result {
        srcmap!(n, true);

        match &n.decl {
            Decl::Class(decl) => {
                for dec in &decl.class.decorators {
                    emit!(dec);
                }

                keyword!("export");

                space!();
                self.emit_class_decl_inner(decl, true)?;
            }
            _ => {
                keyword!("export");

                space!();
                emit!(n.decl);
            }
        }
    }

    #[emitter]
    pub(crate) fn emit_export_default_expr(&mut self, n: &ExportDefaultExpr) -> Result {
        srcmap!(n, true);

        keyword!("export");

        space!();
        keyword!("default");
        {
            let starts_with_alpha_num = n.expr.starts_with_alpha_num();
            if starts_with_alpha_num {
                space!();
            } else {
                formatting_space!();
            }
            emit!(n.expr);
        }
        semi!();

        srcmap!(n, false);
    }

    #[emitter]
    pub(crate) fn emit_export_default_decl(&mut self, n: &ExportDefaultDecl) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        srcmap!(n, true);

        keyword!("export");

        space!();
        keyword!("default");
        space!();
        match n.decl {
            DefaultDecl::Class(ref n) => emit!(n),
            DefaultDecl::Fn(ref n) => emit!(n),
            DefaultDecl::TsInterfaceDecl(ref n) => emit!(n),
        }
    }

    #[emitter]
    pub(crate) fn emit_import(&mut self, n: &ImportDecl) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        srcmap!(n, true);

        keyword!("import");

        if n.type_only {
            space!();
            keyword!("type");
        }

        match n.phase {
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

        let starts_with_ident = !n.specifiers.is_empty()
            && match &n.specifiers[0] {
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
        for specifier in &n.specifiers {
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

                    assert!(n.specifiers.len() <= 2);
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
            self.emit_list(
                n.span(),
                Some(&specifiers),
                ListFormat::NamedImportsOrExportsElements,
            )?;
            punct!("}");
            formatting_space!();

            keyword!("from");
            formatting_space!();
        }

        emit!(n.src);

        if let Some(with) = &n.with {
            formatting_space!();
            if self.cfg.emit_assert_for_import_attributes {
                keyword!("assert");
            } else {
                keyword!("with")
            };
            formatting_space!();
            emit!(with);
        }

        semi!();

        srcmap!(n, false);
    }

    #[emitter]
    pub(crate) fn emit_import_specific(&mut self, node: &ImportNamedSpecifier) -> Result {
        srcmap!(node, true);

        if node.is_type_only {
            keyword!("type");
            space!();
        }

        if let Some(ref imported) = node.imported {
            emit!(imported);
            space!();
            keyword!("as");
            space!();
        }

        emit!(node.local);

        srcmap!(node, false);
    }

    #[emitter]
    pub(crate) fn emit_export_specifier(&mut self, node: &ExportSpecifier) -> Result {
        match node {
            ExportSpecifier::Default(..) => {
                unimplemented!("codegen of `export default from 'foo';`")
            }
            ExportSpecifier::Namespace(ref node) => emit!(node),
            ExportSpecifier::Named(ref node) => emit!(node),
        }
    }

    #[emitter]
    pub(crate) fn emit_namespace_export_specifier(
        &mut self,
        node: &ExportNamespaceSpecifier,
    ) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        punct!("*");
        formatting_space!();
        keyword!("as");
        space!();
        emit!(node.name);

        srcmap!(node, false);
    }

    #[emitter]
    pub(crate) fn emit_named_export_specifier(&mut self, node: &ExportNamedSpecifier) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        if node.is_type_only {
            keyword!("type");
            space!();
        }

        if let Some(exported) = &node.exported {
            emit!(node.orig);
            space!();
            keyword!("as");
            space!();
            emit!(exported);
        } else {
            emit!(node.orig);
        }
        srcmap!(node, false);
    }

    #[emitter]
    pub(crate) fn emit_named_export(&mut self, node: &NamedExport) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

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
        } = node.specifiers.iter().fold(
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

        if node.type_only {
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
            self.emit_list(
                node.span,
                Some(&named_specs),
                ListFormat::NamedImportsOrExportsElements,
            )?;
            punct!("}");
        }

        if let Some(ref src) = node.src {
            if has_named_specs || !has_namespace_spec {
                formatting_space!();
            } else if has_namespace_spec {
                space!();
            }
            keyword!("from");
            formatting_space!();
            emit!(src);

            if let Some(with) = &node.with {
                formatting_space!();
                if self.cfg.emit_assert_for_import_attributes {
                    keyword!("assert");
                } else {
                    keyword!("with")
                };
                formatting_space!();
                emit!(with);
            }
        }
        semi!();

        srcmap!(node, false);
    }

    #[emitter]
    pub(crate) fn emit_export_all(&mut self, node: &ExportAll) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        keyword!("export");

        if node.type_only {
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
        emit!(node.src);

        if let Some(with) = &node.with {
            formatting_space!();
            if self.cfg.emit_assert_for_import_attributes {
                keyword!("assert");
            } else {
                keyword!("with")
            };
            formatting_space!();
            emit!(with);
        }

        semi!();

        srcmap!(node, false);
    }
}
