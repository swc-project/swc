//! Flow-aware parsing and script/module classification shared by the compiler
//! pipelines.

use std::sync::Arc;

use anyhow::{bail, Error};
use swc_common::{comments::Comments, errors::Handler, SourceFile, Span, Spanned};
use swc_ecma_ast::{
    Decl, DefaultDecl, EsVersion, Module, ModuleDecl, ModuleItem, Program, Script, TsNamespaceBody,
};
use swc_ecma_parser::{error::SyntaxError, parse_file_as_program, parse_file_as_script, Syntax};

use crate::{config::IsModule, Compiler};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum ScriptLikeModuleKind {
    Script,
    TypeOnlyModule,
    RuntimeModule(Span),
}

impl Compiler {
    /// Parses transform input while preserving Flow's script-like module
    /// semantics.
    pub(crate) fn parse_js_as_transform_input(
        &self,
        fm: Arc<SourceFile>,
        handler: &Handler,
        target: EsVersion,
        syntax: Syntax,
        is_module: IsModule,
        comments: Option<&dyn Comments>,
    ) -> Result<(Program, bool), Error> {
        if !syntax.flow() {
            return self
                .parse_js(fm, handler, target, syntax, is_module, comments)
                .map(|program| (program, false));
        }

        if matches!(is_module, IsModule::Bool(false)) {
            let mut errors = Vec::new();
            match parse_file_as_script(&fm, syntax, target, comments, &mut errors) {
                Ok(script) => {
                    emit_parser_recoverable_errors(handler, errors)?;
                    return Ok((Program::Script(script), false));
                }
                Err(err) if matches!(err.kind(), SyntaxError::ImportExportInScript) => {}
                Err(err) => {
                    emit_parser_recoverable_errors(handler, errors)?;
                    err.into_diagnostic(handler).emit();
                    return Err(Error::msg("Syntax Error"));
                }
            }

            let mut errors = Vec::new();
            let program = parse_file_as_program(&fm, syntax, target, comments, &mut errors)
                .map_err(|err| {
                    err.into_diagnostic(handler).emit();
                    Error::msg("Syntax Error")
                })?;

            emit_parser_recoverable_errors(handler, errors)?;

            match classify_script_like_module(&program) {
                ScriptLikeModuleKind::Script => Ok((program, false)),
                ScriptLikeModuleKind::TypeOnlyModule => Ok((program, true)),
                ScriptLikeModuleKind::RuntimeModule(span) => {
                    handler
                        .struct_span_err(span, &SyntaxError::ImportExportInScript.msg())
                        .emit();
                    Err(Error::msg("Syntax Error"))
                }
            }
        } else {
            let program = self.parse_js(fm, handler, target, syntax, is_module, comments)?;
            let flow_strip_script_like_module = matches!(
                classify_script_like_module(&program),
                ScriptLikeModuleKind::TypeOnlyModule
            ) && matches!(is_module, IsModule::Unknown);

            Ok((program, flow_strip_script_like_module))
        }
    }
}

/// Converts a stripped Flow type-only module back into a script.
pub(crate) fn downgrade_script_like_module(program: Program) -> Result<Program, Error> {
    let Program::Module(module) = program else {
        return Ok(program);
    };

    if module
        .body
        .iter()
        .any(|module_item| matches!(module_item, ModuleItem::ModuleDecl(..)))
    {
        bail!(
            "failed to downgrade Flow type-only module to script because module declarations \
             remain after stripping"
        );
    }

    let Module {
        span,
        body,
        shebang,
    } = module;

    let body = body
        .into_iter()
        .map(|module_item| match module_item {
            ModuleItem::Stmt(stmt) => Ok(stmt),
            ModuleItem::ModuleDecl(..) => bail!(
                "failed to downgrade Flow type-only module to script because module declarations \
                 remain after stripping"
            ),
        })
        .collect::<Result<_, Error>>()?;

    Ok(Program::Script(Script {
        span,
        body,
        shebang,
    }))
}

fn emit_parser_recoverable_errors(
    handler: &Handler,
    errors: Vec<swc_ecma_parser::error::Error>,
) -> Result<(), Error> {
    if errors.is_empty() {
        return Ok(());
    }

    for error in errors {
        error.into_diagnostic(handler).emit();
    }

    Err(Error::msg("Syntax Error"))
}

fn classify_script_like_module(program: &Program) -> ScriptLikeModuleKind {
    let Program::Module(module) = program else {
        return ScriptLikeModuleKind::Script;
    };

    classify_script_like_module_body(module)
}

fn classify_script_like_module_body(module: &Module) -> ScriptLikeModuleKind {
    let mut saw_module_decl = false;

    for module_item in &module.body {
        let Some(module_decl) = module_item.as_module_decl() else {
            continue;
        };

        saw_module_decl = true;

        if is_runtime_module_decl(module_decl) {
            return ScriptLikeModuleKind::RuntimeModule(module_item.span());
        }
    }

    if saw_module_decl {
        ScriptLikeModuleKind::TypeOnlyModule
    } else {
        let span = module
            .body
            .first()
            .map(Spanned::span)
            .unwrap_or(module.span);
        ScriptLikeModuleKind::RuntimeModule(span)
    }
}

fn is_runtime_module_decl(module_decl: &ModuleDecl) -> bool {
    match module_decl {
        ModuleDecl::Import(import_decl) => !import_decl.type_only,
        ModuleDecl::ExportDecl(export_decl) => is_runtime_decl(&export_decl.decl),
        ModuleDecl::ExportNamed(named_export) => !named_export.type_only,
        ModuleDecl::ExportDefaultDecl(export_default_decl) => {
            is_runtime_default_decl(&export_default_decl.decl)
        }
        ModuleDecl::ExportDefaultExpr(..) => true,
        ModuleDecl::ExportAll(export_all) => !export_all.type_only,
        ModuleDecl::TsImportEquals(ts_import_equals_decl) => !ts_import_equals_decl.is_type_only,
        ModuleDecl::TsExportAssignment(..) => true,
        ModuleDecl::TsNamespaceExport(..) => false,
    }
}

fn is_runtime_decl(decl: &Decl) -> bool {
    if is_declare_decl(decl) {
        return false;
    }

    match decl {
        Decl::TsInterface(..) | Decl::TsTypeAlias(..) => false,
        Decl::Fn(function_decl) => function_decl.function.body.is_some(),
        Decl::Class(..) | Decl::Var(..) | Decl::Using(..) | Decl::TsEnum(..) => true,
        Decl::TsModule(ts_module_decl) => ts_module_decl
            .body
            .as_ref()
            .map(is_runtime_namespace_body)
            .unwrap_or_default(),
    }
}

fn is_runtime_default_decl(default_decl: &DefaultDecl) -> bool {
    match default_decl {
        DefaultDecl::Class(..) => true,
        DefaultDecl::Fn(function_expr) => function_expr.function.body.is_some(),
        DefaultDecl::TsInterfaceDecl(..) => false,
    }
}

fn is_runtime_namespace_body(namespace_body: &TsNamespaceBody) -> bool {
    match namespace_body {
        TsNamespaceBody::TsModuleBlock(ts_module_block) => {
            ts_module_block
                .body
                .iter()
                .any(|module_item| match module_item {
                    ModuleItem::Stmt(stmt) => is_runtime_stmt(stmt),
                    ModuleItem::ModuleDecl(module_decl) => is_runtime_module_decl(module_decl),
                })
        }
        TsNamespaceBody::TsNamespaceDecl(ts_namespace_decl) => {
            is_runtime_namespace_body(&ts_namespace_decl.body)
        }
    }
}

fn is_runtime_stmt(stmt: &swc_ecma_ast::Stmt) -> bool {
    match stmt {
        swc_ecma_ast::Stmt::Empty(..) => false,
        swc_ecma_ast::Stmt::Decl(decl) => is_runtime_decl(decl),
        _ => true,
    }
}

fn is_declare_decl(decl: &Decl) -> bool {
    match decl {
        Decl::Class(class_decl) => class_decl.declare,
        Decl::Fn(function_decl) => function_decl.declare,
        Decl::Var(var_decl) => var_decl.declare,
        Decl::Using(..) => false,
        Decl::TsInterface(..) | Decl::TsTypeAlias(..) => true,
        Decl::TsEnum(ts_enum_decl) => ts_enum_decl.declare,
        Decl::TsModule(ts_module_decl) => ts_module_decl.declare || ts_module_decl.global,
    }
}
