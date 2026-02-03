use std::borrow::Cow;

use swc_atoms::Atom;
use swc_ecma_ast::*;
use swc_ecma_utils::private_ident;

use crate::CompilerImpl;

impl<'a> CompilerImpl<'a> {
    pub(crate) fn transform_export_namespace_from(&mut self, items: &mut Vec<ModuleItem>) {
        let count = items
            .iter()
            .filter(|m| {
                matches!(m, ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(NamedExport {
                        specifiers,
                        src: Some(..),
                        type_only: false,
                        ..
                    })) if specifiers.iter().any(|s| s.is_namespace()))
            })
            .count();

        if count == 0 {
            return;
        }

        let mut stmts = Vec::<ModuleItem>::with_capacity(items.len() + count);

        for item in items.drain(..) {
            match item {
                ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(NamedExport {
                    span,
                    specifiers,
                    src: Some(src),
                    type_only: false,
                    with,
                })) if specifiers.iter().any(|s| s.is_namespace()) => {
                    let mut origin_specifiers = Vec::new();

                    let mut import_specifiers = Vec::new();
                    let mut export_specifiers = Vec::new();

                    for s in specifiers.into_iter() {
                        match s {
                            ExportSpecifier::Namespace(ExportNamespaceSpecifier { span, name }) => {
                                let local_bridge =
                                    private_ident!(format!("_{}", normalize_name(&name)));

                                import_specifiers.push(ImportSpecifier::Namespace(
                                    ImportStarAsSpecifier {
                                        span,
                                        local: local_bridge.clone(),
                                    },
                                ));
                                export_specifiers.push(ExportSpecifier::Named(
                                    ExportNamedSpecifier {
                                        span,
                                        orig: local_bridge.into(),
                                        exported: Some(name),
                                        is_type_only: false,
                                    },
                                ))
                            }
                            ExportSpecifier::Default(..) | ExportSpecifier::Named(..) => {
                                origin_specifiers.push(s);
                            }
                            #[cfg(swc_ast_unknown)]
                            _ => panic!("unable to access unknown nodes"),
                        }
                    }

                    stmts.push(
                        ImportDecl {
                            span,
                            specifiers: import_specifiers,
                            src: src.clone(),
                            type_only: false,
                            with: with.clone(),
                            phase: Default::default(),
                        }
                        .into(),
                    );

                    stmts.push(
                        NamedExport {
                            span,
                            specifiers: export_specifiers,
                            src: None,
                            type_only: false,
                            with: None,
                        }
                        .into(),
                    );

                    if !origin_specifiers.is_empty() {
                        stmts.push(
                            NamedExport {
                                span,
                                specifiers: origin_specifiers,
                                src: Some(src),
                                type_only: false,
                                with,
                            }
                            .into(),
                        );
                    }
                }
                _ => {
                    stmts.push(item);
                }
            }
        }

        *items = stmts;
    }
}

fn normalize_name(module_export_name: &ModuleExportName) -> Cow<Atom> {
    match module_export_name {
        ModuleExportName::Ident(Ident { sym: name, .. }) => Cow::Borrowed(name),
        ModuleExportName::Str(Str { value: name, .. }) => {
            // Normally, the export name should be valid UTF-8. But it might also contain
            // unpaired surrogates.   Node would give an error in this case:
            // `SyntaxError: Invalid module export name: contains unpaired
            // surrogate`.  Here, we temporarily replace the unpaired surrogates
            // with U+FFFD REPLACEMENT CHARACTER by using Wtf8::to_string_lossy.
            Cow::Owned(Atom::from(name.to_string_lossy()))
        }
        #[cfg(swc_ast_unknown)]
        _ => panic!("unable to access unknown nodes"),
    }
}
