use swc_common::{Span, Spanned};
use swc_ecma_ast::*;
use swc_ecma_codegen_macros::node_impl;

use crate::{util::StartsWithAlphaNum, ListFormat};

#[node_impl]
impl MacroNode for ModuleDecl {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let result = match self {
            ModuleDecl::Import(ref d) => {
                let n = emit!(emitter, d);

                Ok(only_new!(ModuleDecl::Import(n)))
            }
            ModuleDecl::ExportDecl(ref d) => {
                let n = emit!(emitter, d);

                Ok(only_new!(ModuleDecl::ExportDecl(n)))
            }
            ModuleDecl::ExportNamed(ref d) => {
                let n = emit!(emitter, d);

                Ok(only_new!(ModuleDecl::ExportNamed(n)))
            }
            ModuleDecl::ExportDefaultDecl(ref d) => {
                let n = emit!(emitter, d);

                Ok(only_new!(ModuleDecl::ExportDefaultDecl(n)))
            }
            ModuleDecl::ExportDefaultExpr(ref n) => {
                let n = emit!(emitter, n);

                Ok(only_new!(ModuleDecl::ExportDefaultExpr(n)))
            }
            ModuleDecl::ExportAll(ref d) => {
                let n = emit!(emitter, d);

                Ok(only_new!(ModuleDecl::ExportAll(n)))
            }
            ModuleDecl::TsExportAssignment(ref n) => {
                let n = emit!(emitter, n);

                Ok(only_new!(ModuleDecl::TsExportAssignment(n)))
            }
            ModuleDecl::TsImportEquals(ref n) => {
                let n = emit!(emitter, n);

                Ok(only_new!(ModuleDecl::TsImportEquals(n)))
            }
            ModuleDecl::TsNamespaceExport(ref n) => {
                let n = emit!(emitter, n);

                Ok(only_new!(ModuleDecl::TsNamespaceExport(n)))
            }
        };

        emitter.emit_trailing_comments_of_pos(self.span().hi, true, true)?;

        if !emitter.cfg.minify {
            emitter.wr.write_line()?;
        }

        result
    }
}

#[node_impl]
impl MacroNode for ExportDecl {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        let lo = only_new!(emitter.wr.get_pos());

        srcmap!(emitter, self, true);

        match &self.decl {
            Decl::Class(decl) => {
                for dec in &decl.class.decorators {
                    emit!(emitter, dec);
                }

                keyword!(emitter, "export");

                space!(emitter);
                emitter.emit_class_decl_inner(decl, true)?;
            }
            _ => {
                keyword!(emitter, "export");

                space!(emitter);
                emit!(emitter, self.decl);
            }
        }

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(ExportDecl {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for ExportDefaultExpr {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        let lo = only_new!(emitter.wr.get_pos());

        srcmap!(emitter, self, true);

        keyword!(emitter, "export");

        space!(emitter);
        keyword!(emitter, "default");
        {
            let starts_with_alpha_num = self.expr.starts_with_alpha_num();
            if starts_with_alpha_num {
                space!(emitter);
            } else {
                formatting_space!(emitter);
            }
            emit!(emitter, self.expr);
        }
        semi!(emitter);

        srcmap!(emitter, self, false);

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(ExportDefaultExpr {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for ExportDefaultDecl {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        srcmap!(emitter, self, true);

        keyword!(emitter, "export");

        space!(emitter);
        keyword!(emitter, "default");
        space!(emitter);
        let decl = match self.decl {
            DefaultDecl::Class(ref n) => {
                let n = emit!(emitter, n);

                only_new!(DefaultDecl::Class(n))
            }
            DefaultDecl::Fn(ref n) => {
                let n = emit!(emitter, n);

                only_new!(DefaultDecl::Fn(n))
            }
            DefaultDecl::TsInterfaceDecl(ref n) => {
                let n = emit!(emitter, n);

                only_new!(DefaultDecl::TsInterfaceDecl(n))
            }
        };

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(ExportDefaultDecl {
            span: Span::new(lo, hi),
            decl,
        }))
    }
}

#[node_impl]
impl MacroNode for ImportDecl {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        srcmap!(emitter, self, true);

        keyword!(emitter, "import");

        if self.type_only {
            space!(emitter);
            keyword!(emitter, "type");
        }

        match self.phase {
            ImportPhase::Evaluation => {}
            ImportPhase::Source => {
                space!(emitter);
                keyword!(emitter, "source");
            }
            ImportPhase::Defer => {
                space!(emitter);
                keyword!(emitter, "defer");
            }
        }

        let starts_with_ident = !self.specifiers.is_empty()
            && match &self.specifiers[0] {
                ImportSpecifier::Default(_) => true,
                _ => false,
            };
        if starts_with_ident {
            space!(emitter);
        } else {
            formatting_space!(emitter);
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
                    emit!(emitter, s.local);
                    emitted_default = true;
                }
                ImportSpecifier::Namespace(ref ns) => {
                    if emitted_default {
                        punct!(emitter, ",");
                        formatting_space!(emitter);
                    }

                    emitted_ns = true;

                    assert!(self.specifiers.len() <= 2);
                    punct!(emitter, "*");
                    formatting_space!(emitter);
                    keyword!(emitter, "as");
                    space!(emitter);
                    emit!(emitter, ns.local);
                }
            }
        }

        if specifiers.is_empty() {
            if emitted_ns || emitted_default {
                space!(emitter);
                keyword!(emitter, "from");
                formatting_space!(emitter);
            }
        } else {
            if emitted_default {
                punct!(emitter, ",");
                formatting_space!(emitter);
            }

            punct!(emitter, "{");
            emitter.emit_list(
                self.span(),
                Some(&specifiers),
                ListFormat::NamedImportsOrExportsElements,
            )?;
            punct!(emitter, "}");
            formatting_space!(emitter);

            keyword!(emitter, "from");
            formatting_space!(emitter);
        }

        emit!(emitter, self.src);

        if let Some(with) = &self.with {
            formatting_space!(emitter);
            if emitter.cfg.emit_assert_for_import_attributes {
                keyword!(emitter, "assert");
            } else {
                keyword!(emitter, "with")
            };
            formatting_space!(emitter);
            emit!(emitter, with);
        }

        semi!(emitter);

        srcmap!(emitter, self, false);

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(ImportDecl {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for ImportNamedSpecifier {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        let lo = only_new!(emitter.wr.get_pos());

        srcmap!(emitter, self, true);

        if self.is_type_only {
            keyword!(emitter, "type");
            space!(emitter);
        }

        if let Some(ref imported) = self.imported {
            emit!(emitter, imported);
            space!(emitter);
            keyword!(emitter, "as");
            space!(emitter);
        }

        emit!(emitter, self.local);

        srcmap!(emitter, self, false);

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(ImportNamedSpecifier {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for ExportSpecifier {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            ExportSpecifier::Default(..) => {
                unimplemented!("codegen of `export default from 'foo';`")
            }
            ExportSpecifier::Namespace(ref node) => {
                let n = emit!(emitter, node);

                Ok(only_new!(ExportSpecifier::Namespace(n)))
            }
            ExportSpecifier::Named(ref node) => {
                let n = emit!(emitter, node);

                Ok(only_new!(ExportSpecifier::Named(n)))
            }
        }
    }
}

#[node_impl]
impl MacroNode for ExportNamespaceSpecifier {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        srcmap!(emitter, self, true);

        punct!(emitter, "*");
        formatting_space!(emitter);
        keyword!(emitter, "as");
        space!(emitter);
        emit!(emitter, self.name);

        srcmap!(emitter, self, false);

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(ExportNamespaceSpecifier {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for ExportNamedSpecifier {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        srcmap!(emitter, self, true);

        if self.is_type_only {
            keyword!(emitter, "type");
            space!(emitter);
        }

        if let Some(exported) = &self.exported {
            emit!(emitter, self.orig);
            space!(emitter);
            keyword!(emitter, "as");
            space!(emitter);
            emit!(emitter, exported);
        } else {
            emit!(emitter, self.orig);
        }
        srcmap!(emitter, self, false);

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(ExportNamedSpecifier {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for NamedExport {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        srcmap!(emitter, self, true);

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

        keyword!(emitter, "export");

        if self.type_only {
            space!(emitter);
            keyword!(emitter, "type");
        }
        formatting_space!(emitter);

        if let Some(spec) = namespace_spec {
            emit!(emitter, spec);
            if has_named_specs {
                punct!(emitter, ",");
                formatting_space!(emitter);
            }
        }
        if has_named_specs || !has_namespace_spec {
            punct!(emitter, "{");
            emitter.emit_list(
                self.span,
                Some(&named_specs),
                ListFormat::NamedImportsOrExportsElements,
            )?;
            punct!(emitter, "}");
        }

        if let Some(ref src) = self.src {
            if has_named_specs || !has_namespace_spec {
                formatting_space!(emitter);
            } else if has_namespace_spec {
                space!(emitter);
            }
            keyword!(emitter, "from");
            formatting_space!(emitter);
            emit!(emitter, src);

            if let Some(with) = &self.with {
                formatting_space!(emitter);
                if emitter.cfg.emit_assert_for_import_attributes {
                    keyword!(emitter, "assert");
                } else {
                    keyword!(emitter, "with")
                };
                formatting_space!(emitter);
                emit!(emitter, with);
            }
        }
        semi!(emitter);

        srcmap!(emitter, self, false);

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(NamedExport {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for ExportAll {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        srcmap!(emitter, self, true);

        keyword!(emitter, "export");

        if self.type_only {
            space!(emitter);
            keyword!(emitter, "type");
            space!(emitter);
        } else {
            formatting_space!(emitter);
        }

        punct!(emitter, "*");
        formatting_space!(emitter);
        keyword!(emitter, "from");
        formatting_space!(emitter);
        emit!(emitter, self.src);

        if let Some(with) = &self.with {
            formatting_space!(emitter);
            if emitter.cfg.emit_assert_for_import_attributes {
                keyword!(emitter, "assert");
            } else {
                keyword!(emitter, "with")
            };
            formatting_space!(emitter);
            emit!(emitter, with);
        }

        semi!(emitter);

        srcmap!(emitter, self, false);

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(ExportAll {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}
