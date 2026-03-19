use swc_atoms::Atom;
use swc_common::{Span, DUMMY_SP};
use swc_ecma_ast::{
    Decl, Ident, ImportDecl, ImportNamedSpecifier, ImportPhase, ImportSpecifier, Module,
    ModuleDecl, ModuleExportName, ModuleItem, Program, Str, VarDecl, VarDeclKind, VarDeclarator,
};

use crate::error::{CompilerError, CompilerErrorDetail, ErrorCategory};

pub fn has_memo_cache_function_import(program: &Program, module_name: &str) -> bool {
    let Program::Module(module) = program else {
        return false;
    };

    module.body.iter().any(|item| {
        let ModuleItem::ModuleDecl(ModuleDecl::Import(import_decl)) = item else {
            return false;
        };

        if import_decl.type_only {
            return false;
        }

        if import_decl.src.value != module_name {
            return false;
        }

        import_decl.specifiers.iter().any(|specifier| {
            let ImportSpecifier::Named(named) = specifier else {
                return false;
            };

            if named.is_type_only {
                return false;
            }

            match &named.imported {
                Some(ModuleExportName::Ident(imported)) => imported.sym == "c",
                Some(ModuleExportName::Str(imported)) => imported.value == "c",
                None => named.local.sym == "c",
            }
        })
    })
}

pub fn validate_restricted_imports(
    program: &Program,
    restricted: &[Atom],
) -> Result<(), CompilerError> {
    if restricted.is_empty() {
        return Ok(());
    }

    let Program::Module(module) = program else {
        return Ok(());
    };

    let mut err = CompilerError::new();

    for item in &module.body {
        let ModuleItem::ModuleDecl(ModuleDecl::Import(import_decl)) = item else {
            continue;
        };

        if restricted
            .iter()
            .any(|candidate| import_decl.src.value == candidate.as_ref())
        {
            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::Todo,
                "Bailing out due to blocklisted import",
            );
            detail.description = Some(format!(
                "Import from module {}",
                import_decl.src.value.to_string_lossy()
            ));
            detail.loc = Some(import_decl.span);
            err.push(detail);
        }
    }

    if err.has_any_errors() {
        Err(err)
    } else {
        Ok(())
    }
}

pub fn add_memo_cache_import(program: &mut Program, module_name: &str) -> bool {
    add_import_specifier(program, module_name, "c", "_c").is_some()
}

pub fn add_external_import(
    program: &mut Program,
    source: &str,
    imported_name: &str,
    local_name: &str,
) -> bool {
    add_import_specifier(program, source, imported_name, local_name).is_some()
}

fn add_import_specifier(
    program: &mut Program,
    module_name: &str,
    imported_name: &str,
    local_hint: &str,
) -> Option<Ident> {
    let Program::Module(module) = program else {
        return None;
    };

    if let Some(existing_local) = find_existing_named_import(module, module_name, imported_name) {
        return Some(existing_local);
    }

    let local = Ident::new_no_ctxt(Atom::new(local_hint), DUMMY_SP);

    let new_specifier = ImportSpecifier::Named(ImportNamedSpecifier {
        span: DUMMY_SP,
        local: local.clone(),
        imported: if local.sym == imported_name {
            None
        } else {
            Some(ModuleExportName::Ident(Ident::new_no_ctxt(
                Atom::new(imported_name),
                DUMMY_SP,
            )))
        },
        is_type_only: false,
    });

    if let Some(import_decl) = find_existing_import_mut(module, module_name) {
        import_decl.specifiers.push(new_specifier);
        return Some(local);
    }

    module.body.insert(
        0,
        ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
            span: DUMMY_SP,
            specifiers: vec![new_specifier],
            src: Box::new(Str {
                span: DUMMY_SP,
                value: Atom::new(module_name).into(),
                raw: None,
            }),
            type_only: false,
            with: None,
            phase: ImportPhase::Evaluation,
        })),
    );

    Some(local)
}

fn find_existing_import_mut<'a>(
    module: &'a mut Module,
    module_name: &str,
) -> Option<&'a mut ImportDecl> {
    for item in &mut module.body {
        let ModuleItem::ModuleDecl(ModuleDecl::Import(import_decl)) = item else {
            continue;
        };

        if import_decl.src.value == module_name && !import_decl.type_only {
            return Some(import_decl);
        }
    }

    None
}

fn find_existing_named_import(
    module: &Module,
    module_name: &str,
    imported_name: &str,
) -> Option<Ident> {
    for item in &module.body {
        let ModuleItem::ModuleDecl(ModuleDecl::Import(import_decl)) = item else {
            continue;
        };

        if import_decl.src.value != module_name {
            continue;
        }
        if import_decl.type_only {
            continue;
        }

        for specifier in &import_decl.specifiers {
            let ImportSpecifier::Named(named) = specifier else {
                continue;
            };
            if named.is_type_only {
                continue;
            }

            let imported_matches = match &named.imported {
                Some(ModuleExportName::Ident(ident_name)) => ident_name.sym == imported_name,
                Some(ModuleExportName::Str(str_name)) => str_name.value == imported_name,
                None => named.local.sym == imported_name,
            };

            if imported_matches {
                return Some(named.local.clone());
            }
        }
    }

    None
}

#[allow(dead_code)]
fn _script_require_stub(_span: Span) -> Decl {
    Decl::Var(Box::new(VarDecl {
        span: DUMMY_SP,
        ctxt: Default::default(),
        kind: VarDeclKind::Const,
        declare: false,
        decls: vec![VarDeclarator {
            span: DUMMY_SP,
            name: swc_ecma_ast::Pat::Invalid(swc_ecma_ast::Invalid { span: DUMMY_SP }),
            init: None,
            definite: false,
        }],
    }))
}

#[cfg(test)]
mod tests {
    use swc_common::FileName;
    use swc_ecma_ast::EsVersion;
    use swc_ecma_parser::{parse_file_as_module, Syntax, TsSyntax};

    use super::*;

    fn parse_module(code: &str) -> Program {
        let cm = swc_common::sync::Lrc::new(swc_common::SourceMap::default());
        let fm = cm.new_source_file(
            FileName::Custom("fixture.ts".into()).into(),
            code.to_string(),
        );
        Program::Module(
            parse_file_as_module(
                &fm,
                Syntax::Typescript(TsSyntax::default()),
                EsVersion::latest(),
                None,
                &mut vec![],
            )
            .expect("should parse"),
        )
    }

    #[test]
    fn ignores_type_only_cache_helper_import() {
        let program = parse_module("import type { c } from \"react/compiler-runtime\";\n");
        assert!(!has_memo_cache_function_import(
            &program,
            "react/compiler-runtime"
        ));
    }

    #[test]
    fn detects_runtime_cache_helper_import() {
        let program = parse_module("import { c as _c } from \"react/compiler-runtime\";\n");
        assert!(has_memo_cache_function_import(
            &program,
            "react/compiler-runtime"
        ));
    }
}
