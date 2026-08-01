// Copyright (c) Meta Platforms, Inc. and affiliates.
//
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.

use react_compiler::entrypoint::plugin_options::{CompilerTarget, PluginOptions};
use react_compiler_ast::{
    scope::{BindingId, BindingKind, ScopeInfo, ScopeKind},
    statements::Statement,
    File,
};
use swc_common::{sync::Lrc, FileName, SourceMap};
use swc_ecma_ast::EsVersion;
use swc_ecma_codegen::Node;
use swc_ecma_parser::{parse_file_as_module, parse_file_as_program, EsSyntax, Syntax};

use crate::{
    convert_ast::convert_program,
    convert_ast_reverse::convert_program_to_swc as convert_program_to_swc_with_preserved_ast,
    convert_scope::SemanticBuilder, diagnostics::Severity, lint_source, transform_source,
    SourceType,
};

fn convert_program_to_swc(file: &File) -> swc_ecma_ast::Program {
    convert_program_to_swc_with_preserved_ast(file, Default::default())
}

fn convert_module(module: &swc_ecma_ast::Module, source_text: &str) -> File {
    let program = swc_ecma_ast::Program::Module(module.clone());
    convert_program(&program, source_text, None).file
}

fn assert_file_serializes_to_json(file: &File) {
    let json = serde_json::to_value(file).expect("serialize to JSON");
    assert!(json
        .get("program")
        .and_then(|program| program.get("body"))
        .is_some());
    assert!(json
        .pointer("/program/body")
        .and_then(serde_json::Value::as_array)
        .is_some());
}

fn parse_program(source: &str) -> swc_ecma_ast::Program {
    let cm = Lrc::new(SourceMap::default());
    let fm = cm.new_source_file(Lrc::new(FileName::Anon), source.to_string());
    let mut errors = vec![];
    parse_file_as_program(
        &fm,
        Syntax::Es(EsSyntax {
            jsx: true,
            ..Default::default()
        }),
        EsVersion::latest(),
        None,
        &mut errors,
    )
    .expect("Failed to parse")
}

fn parse_program_with_resource_management(source: &str) -> swc_ecma_ast::Program {
    let cm = Lrc::new(SourceMap::default());
    let fm = cm.new_source_file(Lrc::new(FileName::Anon), source.to_string());
    let mut errors = vec![];
    parse_file_as_program(
        &fm,
        Syntax::Es(EsSyntax {
            jsx: true,
            explicit_resource_management: true,
            ..Default::default()
        }),
        EsVersion::latest(),
        None,
        &mut errors,
    )
    .expect("Failed to parse")
}

fn parse_module(source: &str) -> swc_ecma_ast::Module {
    let cm = Lrc::new(SourceMap::default());
    let fm = cm.new_source_file(Lrc::new(FileName::Anon), source.to_string());
    let mut errors = vec![];
    parse_file_as_module(
        &fm,
        Syntax::Es(EsSyntax {
            jsx: true,
            ..Default::default()
        }),
        EsVersion::latest(),
        None,
        &mut errors,
    )
    .expect("Failed to parse")
}

fn source_pos(source: &str, needle: &str) -> u32 {
    source
        .find(needle)
        .unwrap_or_else(|| panic!("should find {needle:?}")) as u32
        + 1
}

fn binding_id_at(info: &ScopeInfo, source: &str, name: &str, needle: &str) -> BindingId {
    let start = source_pos(source, needle);
    info.bindings
        .iter()
        .find(|binding| binding.name == name && binding.declaration_start == Some(start))
        .unwrap_or_else(|| panic!("should find binding {name} at {needle:?}"))
        .id
}

fn parse_ts_program(source: &str) -> swc_ecma_ast::Program {
    let cm = Lrc::new(SourceMap::default());
    let fm = cm.new_source_file(Lrc::new(FileName::Anon), source.to_string());
    let mut errors = vec![];
    parse_file_as_program(
        &fm,
        Syntax::Typescript(Default::default()),
        EsVersion::latest(),
        None,
        &mut errors,
    )
    .expect("Failed to parse")
}

fn default_options() -> PluginOptions {
    PluginOptions {
        should_compile: true,
        enable_reanimated: false,
        is_dev: false,
        filename: None,
        compilation_mode: "infer".to_string(),
        panic_threshold: "none".to_string(),
        target: CompilerTarget::Version("19".to_string()),
        gating: None,
        dynamic_gating: None,
        no_emit: false,
        output_mode: None,
        eslint_suppression_rules: None,
        flow_suppressions: true,
        ignore_use_no_forget: false,
        custom_opt_out_directives: None,
        environment: Default::default(),
        source_code: None,
        profiling: false,
        debug: false,
    }
}

// ── AST round-trip tests ────────────────────────────────────────────────────

#[test]
fn convert_variable_declaration() {
    let source = "const x = 1;";
    let program = parse_program(source);
    let file = convert_program(&program, source, None).file;
    assert_eq!(file.program.body.len(), 1);
    assert!(matches!(
        &file.program.body[0],
        Statement::VariableDeclaration(_)
    ));
}

#[test]
fn convert_function_declaration() {
    let source = "function foo() { return 42; }";
    let program = parse_program(source);
    let file = convert_program(&program, source, None).file;
    assert_eq!(file.program.body.len(), 1);
    assert!(matches!(
        &file.program.body[0],
        Statement::FunctionDeclaration(_)
    ));
}

#[test]
fn convert_arrow_function_expression() {
    let source = "const f = (x) => x + 1;";
    let program = parse_program(source);
    let file = convert_program(&program, source, None).file;
    assert_eq!(file.program.body.len(), 1);
    assert!(matches!(
        &file.program.body[0],
        Statement::VariableDeclaration(_)
    ));
}

#[test]
fn convert_jsx_element() {
    let source = "const el = <div className=\"test\">hello</div>;";
    let program = parse_program(source);
    let file = convert_program(&program, source, None).file;
    assert_eq!(file.program.body.len(), 1);
    assert!(matches!(
        &file.program.body[0],
        Statement::VariableDeclaration(_)
    ));
}

#[test]
fn convert_import_declaration() {
    let source = "import { useState } from 'react';";
    let program = parse_program(source);
    let file = convert_program(&program, source, None).file;
    assert_eq!(file.program.body.len(), 1);
    assert!(matches!(
        &file.program.body[0],
        Statement::ImportDeclaration(_)
    ));
}

#[test]
fn convert_export_named_declaration() {
    let source = "export const x = 1;";
    let program = parse_program(source);
    let file = convert_program(&program, source, None).file;
    assert_eq!(file.program.body.len(), 1);
    assert!(matches!(
        &file.program.body[0],
        Statement::ExportNamedDeclaration(_)
    ));
}

#[test]
fn convert_export_default_declaration() {
    let source = "export default function App() { return <div />; }";
    let program = parse_program(source);
    let file = convert_program(&program, source, None).file;
    assert_eq!(file.program.body.len(), 1);
    assert!(matches!(
        &file.program.body[0],
        Statement::ExportDefaultDeclaration(_)
    ));
}

#[test]
fn convert_multiple_statements() {
    let source = r#"
        import React from 'react';
        const x = 1;
        function App() { return <div>{x}</div>; }
        export default App;
    "#;
    let program = parse_program(source);
    let file = convert_program(&program, source, None).file;
    assert_eq!(file.program.body.len(), 4);
    assert!(matches!(
        &file.program.body[0],
        Statement::ImportDeclaration(_)
    ));
    assert!(matches!(
        &file.program.body[1],
        Statement::VariableDeclaration(_)
    ));
    assert!(matches!(
        &file.program.body[2],
        Statement::FunctionDeclaration(_)
    ));
    assert!(matches!(
        &file.program.body[3],
        Statement::ExportDefaultDeclaration(_)
    ));
}

#[test]
fn convert_directive() {
    let source = "'use strict';\nconst x = 1;";
    let program = parse_program(source);
    let file = convert_program(&program, source, None).file;
    assert_eq!(file.program.directives.len(), 1);
    assert_eq!(file.program.body.len(), 1);
}

// ── Scope analysis tests ────────────────────────────────────────────────────

#[test]
fn scope_program_scope_created() {
    let source = "const x = 1;";
    let program = parse_program(source);
    let info = SemanticBuilder::new().build(&program);
    assert!(!info.scopes.is_empty());
    assert!(matches!(info.scopes[0].kind, ScopeKind::Program));
    assert!(info.scopes[0].parent.is_none());
}

#[test]
fn scope_program_scope_uses_program_span() {
    let source = "const x = 1;";
    let program = parse_program(source);
    let span = match &program {
        swc_ecma_ast::Program::Module(module) => module.span,
        swc_ecma_ast::Program::Script(script) => script.span,
    };
    let info = SemanticBuilder::new().build(&program);

    assert_eq!(
        info.node_to_scope.get(&span.lo.0).copied(),
        Some(info.program_scope)
    );
    assert_eq!(
        info.node_to_scope_end.get(&span.lo.0).copied(),
        Some(span.hi.0)
    );
}

#[test]
fn scope_var_hoists_to_function() {
    let source = r#"
        function foo() {
            {
                var x = 1;
            }
        }
    "#;
    let program = parse_program(source);
    let info = SemanticBuilder::new().build(&program);

    // Find the binding for x
    let x_binding = info
        .bindings
        .iter()
        .find(|b| b.name == "x")
        .expect("should find binding x");
    assert!(matches!(x_binding.kind, BindingKind::Var));

    // x should be in a Function scope, not the Block scope
    let scope = &info.scopes[x_binding.scope.0 as usize];
    assert!(matches!(scope.kind, ScopeKind::Function));
}

#[test]
fn scope_let_const_block_scoped() {
    let source = r#"
        function foo() {
            {
                let x = 1;
                const y = 2;
            }
        }
    "#;
    let program = parse_program(source);
    let info = SemanticBuilder::new().build(&program);

    let x_binding = info
        .bindings
        .iter()
        .find(|b| b.name == "x")
        .expect("should find binding x");
    assert!(matches!(x_binding.kind, BindingKind::Let));
    let x_scope = &info.scopes[x_binding.scope.0 as usize];
    assert!(matches!(x_scope.kind, ScopeKind::Block));

    let y_binding = info
        .bindings
        .iter()
        .find(|b| b.name == "y")
        .expect("should find binding y");
    assert!(matches!(y_binding.kind, BindingKind::Const));
    let y_scope = &info.scopes[y_binding.scope.0 as usize];
    assert!(matches!(y_scope.kind, ScopeKind::Block));
}

#[test]
fn scope_function_declaration_hoists() {
    let source = r#"
        function outer() {
            {
                function inner() {}
            }
        }
    "#;
    let program = parse_program(source);
    let info = SemanticBuilder::new().build(&program);

    let inner_binding = info
        .bindings
        .iter()
        .find(|b| b.name == "inner")
        .expect("should find binding inner");
    assert!(matches!(inner_binding.kind, BindingKind::Hoisted));
    // In sloppy mode, block function declarations follow Annex B hoisting.
    let scope = &info.scopes[inner_binding.scope.0 as usize];
    assert!(matches!(scope.kind, ScopeKind::Function));
}

#[test]
fn scope_strict_block_function_declaration_is_block_scoped() {
    let source = r#"
        function outer() {
            "use strict";
            {
                function inner() {}
                inner();
            }
            inner;
        }
    "#;
    let program = parse_program(source);
    let info = SemanticBuilder::new().build(&program);

    let inner_binding = info
        .bindings
        .iter()
        .find(|b| b.name == "inner")
        .expect("should find binding inner");
    let scope = &info.scopes[inner_binding.scope.0 as usize];
    assert!(matches!(scope.kind, ScopeKind::Block));

    let inner_call = source.find("inner();").expect("should find inner call") as u32 + 1;
    assert_eq!(
        info.ref_node_id_to_binding.get(&inner_call).copied(),
        Some(inner_binding.id)
    );

    let outer_ref = source.rfind("inner;").expect("should find outer inner ref") as u32 + 1;
    assert_eq!(info.ref_node_id_to_binding.get(&outer_ref), None);
}

#[test]
fn scope_module_block_function_declaration_is_block_scoped() {
    let source = r#"
        export const value = 1;
        {
            function inner() {}
            inner();
        }
        inner;
    "#;
    let module = parse_module(source);
    let program = swc_ecma_ast::Program::Module(module);
    let info = SemanticBuilder::new().build(&program);

    let inner_binding = info
        .bindings
        .iter()
        .find(|b| b.name == "inner")
        .expect("should find binding inner");
    let scope = &info.scopes[inner_binding.scope.0 as usize];
    assert!(matches!(scope.kind, ScopeKind::Block));

    let inner_call = source.find("inner();").expect("should find inner call") as u32 + 1;
    assert_eq!(
        info.ref_node_id_to_binding.get(&inner_call).copied(),
        Some(inner_binding.id)
    );

    let outer_ref = source.rfind("inner;").expect("should find outer inner ref") as u32 + 1;
    assert_eq!(info.ref_node_id_to_binding.get(&outer_ref), None);
}

#[test]
fn scope_typescript_script_block_function_declaration_is_block_scoped() {
    let source = r#"
        function outer() {
            {
                function inner() {}
                inner();
            }
            inner;
        }
    "#;
    let program = parse_ts_program(source);
    let info = SemanticBuilder::with_source_type(SourceType::script().with_typescript(true))
        .build(&program);

    let inner_binding = info
        .bindings
        .iter()
        .find(|b| b.name == "inner")
        .expect("should find binding inner");
    let scope = &info.scopes[inner_binding.scope.0 as usize];
    assert!(matches!(scope.kind, ScopeKind::Block));

    let inner_call = source.find("inner();").expect("should find inner call") as u32 + 1;
    assert_eq!(
        info.ref_node_id_to_binding.get(&inner_call).copied(),
        Some(inner_binding.id)
    );

    let outer_ref = source.rfind("inner;").expect("should find outer inner ref") as u32 + 1;
    assert_eq!(info.ref_node_id_to_binding.get(&outer_ref), None);
}

#[test]
fn scope_named_function_expression_is_local() {
    let source = "const f = function g() { return g; };";
    let program = parse_program(source);
    let info = SemanticBuilder::new().build(&program);

    let g_binding = info
        .bindings
        .iter()
        .find(|b| b.name == "g")
        .expect("should find binding g");
    assert!(matches!(g_binding.kind, BindingKind::Local));

    let scope = &info.scopes[g_binding.scope.0 as usize];
    assert!(matches!(scope.kind, ScopeKind::Function));

    let g_ref = source.find("return g").expect("should find return g") as u32 + 8;
    assert_eq!(
        info.ref_node_id_to_binding.get(&g_ref).copied(),
        Some(g_binding.id)
    );
}

#[test]
fn scope_named_function_expression_allows_same_named_param() {
    let source = "const g = function f(f) { return f; };";
    let program = parse_program(source);
    let info = SemanticBuilder::new().build(&program);

    let f_bindings: Vec<_> = info.bindings.iter().filter(|b| b.name == "f").collect();
    assert_eq!(f_bindings.len(), 2, "should create separate f bindings");

    let function_binding = f_bindings
        .iter()
        .find(|binding| matches!(binding.kind, BindingKind::Local))
        .expect("should find named function expression binding");
    let param_binding = f_bindings
        .iter()
        .find(|binding| matches!(binding.kind, BindingKind::Param))
        .expect("should find parameter binding");

    assert!(matches!(
        info.scopes[function_binding.scope.0 as usize].kind,
        ScopeKind::Function
    ));
    assert!(matches!(
        info.scopes[param_binding.scope.0 as usize].kind,
        ScopeKind::Function
    ));

    let return_ref = source.find("return f").expect("should find return f") as u32 + 8;
    assert_eq!(
        info.ref_node_id_to_binding.get(&return_ref).copied(),
        Some(param_binding.id)
    );
    assert_ne!(
        info.ref_node_id_to_binding.get(&return_ref).copied(),
        Some(function_binding.id)
    );
}

#[test]
fn scope_named_function_expression_preserves_scope_when_shadowed_by_var() {
    let source = "const g = function f() { var f; return f; };";
    let program = parse_program(source);
    let info = SemanticBuilder::new().build(&program);

    let f_bindings: Vec<_> = info.bindings.iter().filter(|b| b.name == "f").collect();
    assert_eq!(f_bindings.len(), 2, "should create separate f bindings");

    let function_binding = f_bindings
        .iter()
        .find(|binding| matches!(binding.kind, BindingKind::Local))
        .expect("should find named function expression binding");
    let var_binding = f_bindings
        .iter()
        .find(|binding| matches!(binding.kind, BindingKind::Var))
        .expect("should find var binding");

    assert!(matches!(
        info.scopes[function_binding.scope.0 as usize].kind,
        ScopeKind::Function
    ));
    assert!(matches!(
        info.scopes[var_binding.scope.0 as usize].kind,
        ScopeKind::Function
    ));

    let return_ref = source.find("return f").expect("should find return f") as u32 + 8;
    assert_eq!(
        info.ref_node_id_to_binding.get(&return_ref).copied(),
        Some(var_binding.id)
    );
    assert_ne!(
        info.ref_node_id_to_binding.get(&return_ref).copied(),
        Some(function_binding.id)
    );
}

#[test]
fn scope_export_default_function_named_binding_is_program_scoped() {
    let source = "export default function App() { return App; }";
    let program = parse_program(source);
    let info = SemanticBuilder::new().build(&program);

    let app_binding = info
        .bindings
        .iter()
        .find(|b| b.name == "App")
        .expect("should find binding App");
    assert!(matches!(app_binding.kind, BindingKind::Hoisted));

    let scope = &info.scopes[app_binding.scope.0 as usize];
    assert!(matches!(scope.kind, ScopeKind::Program));

    let export_ref = source
        .find("export default function")
        .expect("should find export default function") as u32
        + 1;
    assert_eq!(
        info.ref_node_id_to_binding.get(&export_ref).copied(),
        Some(app_binding.id)
    );
}

#[test]
fn scope_export_default_class_named_binding_is_program_scoped() {
    let source = "export default class Foo { method() { return Foo; } }";
    let program = parse_program(source);
    let info = SemanticBuilder::new().build(&program);

    let foo_binding = info
        .bindings
        .iter()
        .find(|b| b.name == "Foo")
        .expect("should find binding Foo");
    assert!(matches!(foo_binding.kind, BindingKind::Local));

    let scope = &info.scopes[foo_binding.scope.0 as usize];
    assert!(matches!(scope.kind, ScopeKind::Program));

    let foo_ref = source.find("return Foo").expect("should find return Foo") as u32 + 8;
    assert_eq!(
        info.ref_node_id_to_binding.get(&foo_ref).copied(),
        Some(foo_binding.id)
    );
}

#[test]
fn scope_function_redeclaration_reuses_original_binding() {
    let source = "function foo() {}\nfunction foo() {}\nfoo();";
    let program = parse_program(source);
    let info = SemanticBuilder::new().build(&program);

    let foo_bindings: Vec<_> = info.bindings.iter().filter(|b| b.name == "foo").collect();
    assert_eq!(foo_bindings.len(), 1, "should keep a single foo binding");
    let foo_binding = foo_bindings[0];

    let second_decl = source
        .rfind("function foo")
        .expect("should find second function foo") as u32
        + 10;
    assert_eq!(
        info.ref_node_id_to_binding.get(&second_decl).copied(),
        Some(foo_binding.id)
    );

    let call_ref = source.rfind("foo();").expect("should find foo call") as u32 + 1;
    assert_eq!(
        info.ref_node_id_to_binding.get(&call_ref).copied(),
        Some(foo_binding.id)
    );
}

#[test]
fn scope_using_decl_is_const_like_binding() {
    let source = r#"
        function foo() {
            using resource = create();
            return resource;
        }
    "#;
    let program = parse_program_with_resource_management(source);
    let info = SemanticBuilder::new().build(&program);

    let resource_binding = info
        .bindings
        .iter()
        .find(|b| b.name == "resource")
        .expect("should find binding resource");
    assert!(matches!(resource_binding.kind, BindingKind::Const));

    let scope = &info.scopes[resource_binding.scope.0 as usize];
    assert!(matches!(scope.kind, ScopeKind::Function));

    let resource_ref = source
        .find("return resource")
        .expect("should find return resource") as u32
        + 8;
    assert_eq!(
        info.ref_node_id_to_binding.get(&resource_ref).copied(),
        Some(resource_binding.id)
    );
}

#[test]
fn scope_object_setter_creates_function_scope() {
    let source = "const obj = { set value(x) { var y = x; y; } };";
    let program = parse_program(source);
    let info = SemanticBuilder::new().build(&program);

    let x_binding = info
        .bindings
        .iter()
        .find(|b| b.name == "x")
        .expect("should find binding x");
    assert!(matches!(x_binding.kind, BindingKind::Param));
    let x_scope = &info.scopes[x_binding.scope.0 as usize];
    assert!(matches!(x_scope.kind, ScopeKind::Function));

    let y_binding = info
        .bindings
        .iter()
        .find(|b| b.name == "y")
        .expect("should find binding y");
    assert!(matches!(y_binding.kind, BindingKind::Var));
    let y_scope = &info.scopes[y_binding.scope.0 as usize];
    assert!(matches!(y_scope.kind, ScopeKind::Function));

    let x_ref = source
        .find("= x")
        .expect("should find setter param reference") as u32
        + 3;
    assert_eq!(
        info.ref_node_id_to_binding.get(&x_ref).copied(),
        Some(x_binding.id)
    );

    let y_ref = source.rfind("y;").expect("should find y reference") as u32 + 1;
    assert_eq!(
        info.ref_node_id_to_binding.get(&y_ref).copied(),
        Some(y_binding.id)
    );
}

#[test]
fn scope_object_method_creates_function_scope() {
    let source = "const x = 0; const obj = { method(x) { var y = x; y; } }; x;";
    let program = parse_program(source);
    let info = SemanticBuilder::new().build(&program);

    let outer_x_binding = info
        .bindings
        .iter()
        .find(|b| b.name == "x" && matches!(b.kind, BindingKind::Const))
        .expect("should find outer x binding");
    let param_x_binding = info
        .bindings
        .iter()
        .find(|b| b.name == "x" && matches!(b.kind, BindingKind::Param))
        .expect("should find method param x binding");
    let y_binding = info
        .bindings
        .iter()
        .find(|b| b.name == "y")
        .expect("should find method var y binding");

    let method_scope = &info.scopes[param_x_binding.scope.0 as usize];
    assert!(matches!(method_scope.kind, ScopeKind::Function));
    let y_scope = &info.scopes[y_binding.scope.0 as usize];
    assert!(matches!(y_scope.kind, ScopeKind::Function));

    let param_x_ref = source.find("= x;").expect("should find method x reference") as u32 + 3;
    assert_eq!(
        info.ref_node_id_to_binding.get(&param_x_ref).copied(),
        Some(param_x_binding.id)
    );

    let outer_x_ref = source.rfind("x;").expect("should find outer x reference") as u32 + 1;
    assert_eq!(
        info.ref_node_id_to_binding.get(&outer_x_ref).copied(),
        Some(outer_x_binding.id)
    );
}

#[test]
fn scope_class_method_creates_function_scope() {
    let source = "const x = 0; class Foo { method(x) { var y = x; y; } } x;";
    let program = parse_program(source);
    let info = SemanticBuilder::new().build(&program);

    let outer_x_binding = info
        .bindings
        .iter()
        .find(|b| b.name == "x" && matches!(b.kind, BindingKind::Const))
        .expect("should find outer x binding");
    let param_x_binding = info
        .bindings
        .iter()
        .find(|b| b.name == "x" && matches!(b.kind, BindingKind::Param))
        .expect("should find class method param x binding");
    let y_binding = info
        .bindings
        .iter()
        .find(|b| b.name == "y")
        .expect("should find class method var y binding");

    assert!(matches!(
        info.scopes[param_x_binding.scope.0 as usize].kind,
        ScopeKind::Function
    ));
    assert!(matches!(
        info.scopes[y_binding.scope.0 as usize].kind,
        ScopeKind::Function
    ));

    let param_x_ref = source
        .find("= x;")
        .expect("should find class method x reference") as u32
        + 3;
    assert_eq!(
        info.ref_node_id_to_binding.get(&param_x_ref).copied(),
        Some(param_x_binding.id)
    );

    let outer_x_ref = source.rfind("x;").expect("should find outer x reference") as u32 + 1;
    assert_eq!(
        info.ref_node_id_to_binding.get(&outer_x_ref).copied(),
        Some(outer_x_binding.id)
    );
}

#[test]
fn scope_private_method_creates_function_scope() {
    let source = "const x = 0; class Foo { #method(x) { var y = x; y; } } x;";
    let program = parse_program(source);
    let info = SemanticBuilder::new().build(&program);

    let outer_x_binding = info
        .bindings
        .iter()
        .find(|b| b.name == "x" && matches!(b.kind, BindingKind::Const))
        .expect("should find outer x binding");
    let param_x_binding = info
        .bindings
        .iter()
        .find(|b| b.name == "x" && matches!(b.kind, BindingKind::Param))
        .expect("should find private method param x binding");
    let y_binding = info
        .bindings
        .iter()
        .find(|b| b.name == "y")
        .expect("should find private method var y binding");

    assert!(matches!(
        info.scopes[param_x_binding.scope.0 as usize].kind,
        ScopeKind::Function
    ));
    assert!(matches!(
        info.scopes[y_binding.scope.0 as usize].kind,
        ScopeKind::Function
    ));

    let param_x_ref = source
        .find("= x;")
        .expect("should find private method x reference") as u32
        + 3;
    assert_eq!(
        info.ref_node_id_to_binding.get(&param_x_ref).copied(),
        Some(param_x_binding.id)
    );

    let outer_x_ref = source.rfind("x;").expect("should find outer x reference") as u32 + 1;
    assert_eq!(
        info.ref_node_id_to_binding.get(&outer_x_ref).copied(),
        Some(outer_x_binding.id)
    );
}

#[test]
fn scope_constructor_creates_function_scope() {
    let source = "const x = 0; class Foo { constructor(x) { var y = x; y; } } x;";
    let program = parse_program(source);
    let info = SemanticBuilder::new().build(&program);

    let outer_x_binding = info
        .bindings
        .iter()
        .find(|b| b.name == "x" && matches!(b.kind, BindingKind::Const))
        .expect("should find outer x binding");
    let param_x_binding = info
        .bindings
        .iter()
        .find(|b| b.name == "x" && matches!(b.kind, BindingKind::Param))
        .expect("should find constructor param x binding");
    let y_binding = info
        .bindings
        .iter()
        .find(|b| b.name == "y")
        .expect("should find constructor var y binding");

    assert!(matches!(
        info.scopes[param_x_binding.scope.0 as usize].kind,
        ScopeKind::Function
    ));
    assert!(matches!(
        info.scopes[y_binding.scope.0 as usize].kind,
        ScopeKind::Function
    ));

    let param_x_ref = source
        .find("= x;")
        .expect("should find constructor x reference") as u32
        + 3;
    assert_eq!(
        info.ref_node_id_to_binding.get(&param_x_ref).copied(),
        Some(param_x_binding.id)
    );

    let outer_x_ref = source.rfind("x;").expect("should find outer x reference") as u32 + 1;
    assert_eq!(
        info.ref_node_id_to_binding.get(&outer_x_ref).copied(),
        Some(outer_x_binding.id)
    );
}

#[test]
fn scope_ts_enum_binding_is_local() {
    let source = "enum Status { Ready }\nconst value = Status.Ready;";
    let program = parse_ts_program(source);
    let info = SemanticBuilder::with_source_type(SourceType::script().with_typescript(true))
        .build(&program);

    let status_binding = info
        .bindings
        .iter()
        .find(|b| b.name == "Status")
        .expect("should find enum binding Status");
    assert!(matches!(status_binding.kind, BindingKind::Local));

    let status_ref = source
        .find("Status.Ready")
        .expect("should find enum reference") as u32
        + 1;
    assert_eq!(
        info.ref_node_id_to_binding.get(&status_ref).copied(),
        Some(status_binding.id)
    );
}

#[test]
fn scope_declare_ts_enum_binding_is_local() {
    let source = "declare enum Status { Ready }\nconst value = Status.Ready;";
    let program = parse_ts_program(source);
    let info = SemanticBuilder::with_source_type(SourceType::script().with_typescript(true))
        .build(&program);

    let status_binding = info
        .bindings
        .iter()
        .find(|binding| binding.name == "Status")
        .expect("declare enum should create a binding for reference resolution");
    assert!(matches!(status_binding.kind, BindingKind::Local));

    let status_ref = source
        .find("Status.Ready")
        .expect("should find enum reference") as u32
        + 1;
    assert_eq!(
        info.ref_node_id_to_binding.get(&status_ref),
        Some(&status_binding.id)
    );
}

#[test]
fn scope_ts_import_equals_binding_is_module_scoped() {
    let source = "import foo = require('foo');\nfoo;";
    let module = parse_ts_module(source);
    let program = swc_ecma_ast::Program::Module(module);
    let info = SemanticBuilder::new().build(&program);

    let foo_binding = info
        .bindings
        .iter()
        .find(|b| b.name == "foo")
        .expect("should find binding foo");
    assert!(matches!(foo_binding.kind, BindingKind::Module));

    let scope = &info.scopes[foo_binding.scope.0 as usize];
    assert!(matches!(scope.kind, ScopeKind::Program));

    let foo_ref = source.rfind("foo;").expect("should find foo reference") as u32 + 1;
    assert_eq!(
        info.ref_node_id_to_binding.get(&foo_ref).copied(),
        Some(foo_binding.id)
    );
}

#[test]
fn scope_duplicate_var_reuses_original_binding() {
    let source = "function foo() { var x = 1; var x = 2; x; }";
    let program = parse_program(source);
    let info = SemanticBuilder::new().build(&program);

    let x_bindings: Vec<_> = info.bindings.iter().filter(|b| b.name == "x").collect();
    assert_eq!(x_bindings.len(), 1, "should keep a single x binding");
    let x_binding = x_bindings[0];

    let second_decl = source.rfind("var x").expect("should find second var x") as u32 + 5;
    assert_eq!(
        info.ref_node_id_to_binding.get(&second_decl).copied(),
        Some(x_binding.id)
    );

    let x_ref = source.rfind("x;").expect("should find x reference") as u32 + 1;
    assert_eq!(
        info.ref_node_id_to_binding.get(&x_ref).copied(),
        Some(x_binding.id)
    );
}

#[test]
fn scope_import_bindings() {
    let source = r#"
        import React from 'react';
        import { useState, useEffect } from 'react';
        import * as Utils from './utils';
    "#;
    let program = parse_program(source);
    let info = SemanticBuilder::new().build(&program);

    let react_binding = info
        .bindings
        .iter()
        .find(|b| b.name == "React")
        .expect("should find binding React");
    assert!(matches!(react_binding.kind, BindingKind::Module));
    assert!(react_binding.import.is_some());
    let import_data = react_binding.import.as_ref().unwrap();
    assert_eq!(import_data.source, "react");

    let use_state_binding = info
        .bindings
        .iter()
        .find(|b| b.name == "useState")
        .expect("should find binding useState");
    assert!(matches!(use_state_binding.kind, BindingKind::Module));

    let utils_binding = info
        .bindings
        .iter()
        .find(|b| b.name == "Utils")
        .expect("should find binding Utils");
    assert!(matches!(utils_binding.kind, BindingKind::Module));
}

#[test]
fn scope_nested_functions_create_scopes() {
    let source = r#"
        function outer(a) {
            function inner(b) {
                return a + b;
            }
        }
    "#;
    let program = parse_program(source);
    let info = SemanticBuilder::new().build(&program);

    let a_binding = info
        .bindings
        .iter()
        .find(|b| b.name == "a")
        .expect("should find binding a");
    assert!(matches!(a_binding.kind, BindingKind::Param));

    let b_binding = info
        .bindings
        .iter()
        .find(|b| b.name == "b")
        .expect("should find binding b");
    assert!(matches!(b_binding.kind, BindingKind::Param));

    // a and b should be in different function scopes
    assert!(a_binding.scope.0 != b_binding.scope.0);
}

#[test]
fn scope_catch_clause_creates_scope() {
    let source = r#"
        try {
            throw new Error();
        } catch (e) {
            console.log(e);
        }
    "#;
    let program = parse_program(source);
    let info = SemanticBuilder::new().build(&program);

    let e_binding = info
        .bindings
        .iter()
        .find(|b| b.name == "e")
        .expect("should find binding e");
    assert!(matches!(e_binding.kind, BindingKind::Let));
    let scope = &info.scopes[e_binding.scope.0 as usize];
    assert!(matches!(scope.kind, ScopeKind::Catch));
}

#[test]
fn scope_arrow_function_params() {
    let source = "const f = (x, y) => x + y;";
    let program = parse_program(source);
    let info = SemanticBuilder::new().build(&program);

    let x_binding = info
        .bindings
        .iter()
        .find(|b| b.name == "x")
        .expect("should find binding x");
    assert!(matches!(x_binding.kind, BindingKind::Param));
    let scope = &info.scopes[x_binding.scope.0 as usize];
    assert!(matches!(scope.kind, ScopeKind::Function));
}

#[test]
fn scope_for_loop_creates_scope() {
    let source = "for (let i = 0; i < 10; i++) { console.log(i); }";
    let program = parse_program(source);
    let info = SemanticBuilder::new().build(&program);

    let i_binding = info
        .bindings
        .iter()
        .find(|b| b.name == "i")
        .expect("should find binding i");
    assert!(matches!(i_binding.kind, BindingKind::Let));
    let scope = &info.scopes[i_binding.scope.0 as usize];
    assert!(matches!(scope.kind, ScopeKind::For));
}

#[test]
fn scope_resolves_function_param_references_before_body_bindings() {
    let source = r#"
        const fallback = "outer";
        function useValue(value = fallback) {
            const fallback = "inner";
            return value;
        }
    "#;
    let program = parse_program(source);
    let info = SemanticBuilder::new().build(&program);

    let source_pos = |needle: &str| {
        source
            .find(needle)
            .unwrap_or_else(|| panic!("should find {needle:?}")) as u32
            + 1
    };
    let binding_id_at = |name: &str, needle: &str| {
        let start = source_pos(needle);
        info.bindings
            .iter()
            .find(|binding| binding.name == name && binding.declaration_start == Some(start))
            .unwrap_or_else(|| panic!("should find binding {name} at {needle:?}"))
            .id
    };

    let outer_fallback = binding_id_at("fallback", "fallback = \"outer\"");
    let inner_fallback = binding_id_at("fallback", "fallback = \"inner\"");
    let fallback_ref = source_pos("fallback) {");
    let resolved = info.ref_node_id_to_binding.get(&fallback_ref).copied();

    assert_eq!(resolved, Some(outer_fallback));
    assert_ne!(resolved, Some(inner_fallback));
}

#[test]
fn scope_resolves_deferred_function_param_references_from_outer_scope() {
    let source = r#"
        function useValue(value = fallback) {
            const fallback = "inner";
            return value;
        }
        const fallback = "outer";
    "#;
    let program = parse_program(source);
    let info = SemanticBuilder::new().build(&program);

    let outer_fallback = binding_id_at(&info, source, "fallback", "fallback = \"outer\"");
    let inner_fallback = binding_id_at(&info, source, "fallback", "fallback = \"inner\"");
    let fallback_ref = source_pos(source, "fallback) {");
    let resolved = info.ref_node_id_to_binding.get(&fallback_ref).copied();

    assert_eq!(resolved, Some(outer_fallback));
    assert_ne!(resolved, Some(inner_fallback));
}

#[test]
fn scope_does_not_resolve_function_param_references_to_body_var() {
    let source = r#"
        function useValue(value = fallback) {
            var fallback = "inner";
            return value;
        }
        const fallback = "outer";
    "#;
    let program = parse_program(source);
    let info = SemanticBuilder::new().build(&program);

    let outer_fallback = binding_id_at(&info, source, "fallback", "fallback = \"outer\"");
    let body_fallback = binding_id_at(&info, source, "fallback", "fallback = \"inner\"");
    let fallback_ref = source_pos(source, "fallback) {");
    let resolved = info.ref_node_id_to_binding.get(&fallback_ref).copied();

    assert_eq!(resolved, Some(outer_fallback));
    assert_ne!(resolved, Some(body_fallback));
}

#[test]
fn scope_leaves_function_param_references_unresolved_without_outer_binding() {
    let source = r#"
        function useValue(value = fallback) {
            const fallback = "inner";
            return value;
        }
    "#;
    let program = parse_program(source);
    let info = SemanticBuilder::new().build(&program);

    let body_fallback = binding_id_at(&info, source, "fallback", "fallback = \"inner\"");
    let fallback_ref = source_pos(source, "fallback) {");
    let resolved = info.ref_node_id_to_binding.get(&fallback_ref).copied();

    assert_eq!(resolved, None);
    assert_ne!(resolved, Some(body_fallback));
}

#[test]
fn scope_resolves_function_param_references_to_later_params() {
    let source = r#"
        function useValue(value = fallback, fallback) {
            return value;
        }
    "#;
    let program = parse_program(source);
    let info = SemanticBuilder::new().build(&program);

    let fallback_param = binding_id_at(&info, source, "fallback", "fallback) {");
    let fallback_ref = source_pos(source, "fallback, fallback");

    assert_eq!(
        info.ref_node_id_to_binding.get(&fallback_ref).copied(),
        Some(fallback_param)
    );
}

#[test]
fn scope_resolves_function_expression_name_in_param_default() {
    let source = r#"
        const useValue = function inner(value = inner) {
            return value;
        };
    "#;
    let program = parse_program(source);
    let info = SemanticBuilder::new().build(&program);

    let function_binding = binding_id_at(&info, source, "inner", "inner(value");
    let inner_ref = source_pos(source, "inner) {");

    assert_eq!(
        info.ref_node_id_to_binding.get(&inner_ref).copied(),
        Some(function_binding)
    );
}

#[test]
fn scope_resolves_same_named_function_expression_param_default_to_param() {
    let source = r#"
        const useValue = function inner(inner = inner) {
            return inner;
        };
    "#;
    let program = parse_program(source);
    let info = SemanticBuilder::new().build(&program);

    let function_binding = binding_id_at(&info, source, "inner", "inner(inner");
    let param_binding = binding_id_at(&info, source, "inner", "inner = inner");
    let default_ref = source_pos(source, "inner) {");
    let return_ref = source_pos(source, "inner;");

    assert_eq!(
        info.ref_node_id_to_binding.get(&default_ref).copied(),
        Some(param_binding)
    );
    assert_eq!(
        info.ref_node_id_to_binding.get(&return_ref).copied(),
        Some(param_binding)
    );
    assert_ne!(
        info.ref_node_id_to_binding.get(&default_ref).copied(),
        Some(function_binding)
    );
}

#[test]
fn scope_resolves_computed_function_param_references_outside_body_scope() {
    let source = r#"
        function useValue({ [key]: value }) {
            const key = "inner";
            return value;
        }
        const key = "outer";
    "#;
    let program = parse_program(source);
    let info = SemanticBuilder::new().build(&program);

    let outer_key = binding_id_at(&info, source, "key", "key = \"outer\"");
    let inner_key = binding_id_at(&info, source, "key", "key = \"inner\"");
    let value_param = binding_id_at(&info, source, "value", "value })");
    let key_ref = source_pos(source, "key]: value");
    let value_ref = source_pos(source, "value;");

    assert_eq!(
        info.ref_node_id_to_binding.get(&key_ref).copied(),
        Some(outer_key)
    );
    assert_ne!(
        info.ref_node_id_to_binding.get(&key_ref).copied(),
        Some(inner_key)
    );
    assert_eq!(
        info.ref_node_id_to_binding.get(&value_ref).copied(),
        Some(value_param)
    );
}

#[test]
fn scope_resolves_catch_param_references_before_body_bindings() {
    let source = r#"
        try {
        } catch ({ [key]: value }) {
            const key = "inner";
            console.log(value);
        }
        const key = "outer";
    "#;
    let program = parse_program(source);
    let info = SemanticBuilder::new().build(&program);

    let source_pos = |needle: &str| {
        source
            .find(needle)
            .unwrap_or_else(|| panic!("should find {needle:?}")) as u32
            + 1
    };
    let binding_id_at = |name: &str, needle: &str| {
        let start = source_pos(needle);
        info.bindings
            .iter()
            .find(|binding| binding.name == name && binding.declaration_start == Some(start))
            .unwrap_or_else(|| panic!("should find binding {name} at {needle:?}"))
            .id
    };

    let outer_key = binding_id_at("key", "key = \"outer\"");
    let inner_key = binding_id_at("key", "key = \"inner\"");
    let catch_value = binding_id_at("value", "value })");
    let key_ref = source_pos("key]: value");
    let value_ref = source_pos("value);");

    let resolved_key = info.ref_node_id_to_binding.get(&key_ref).copied();
    assert_eq!(resolved_key, Some(outer_key));
    assert_ne!(resolved_key, Some(inner_key));
    assert_eq!(
        info.ref_node_id_to_binding.get(&value_ref).copied(),
        Some(catch_value)
    );
}

#[test]
fn scope_catch_param_binding_covers_initializer_references() {
    let source = r#"
        try {
        } catch ({ e = () => e }) {
            e();
        }
        const e = "outer";
    "#;
    let program = parse_program(source);
    let info = SemanticBuilder::new().build(&program);

    let source_pos = |needle: &str| {
        source
            .find(needle)
            .unwrap_or_else(|| panic!("should find {needle:?}")) as u32
            + 1
    };
    let binding_id_at = |name: &str, needle: &str| {
        let start = source_pos(needle);
        info.bindings
            .iter()
            .find(|binding| binding.name == name && binding.declaration_start == Some(start))
            .unwrap_or_else(|| panic!("should find binding {name} at {needle:?}"))
            .id
    };

    let catch_e = binding_id_at("e", "e = ()");
    let outer_e = binding_id_at("e", "e = \"outer\"");
    let initializer_e_ref = source_pos("=> e") + 3;
    let body_e_ref = source_pos("e();");
    let catch_binding = &info.bindings[catch_e.0 as usize];

    assert!(matches!(catch_binding.kind, BindingKind::Let));
    assert!(matches!(
        info.scopes[catch_binding.scope.0 as usize].kind,
        ScopeKind::Catch
    ));
    assert_eq!(
        info.ref_node_id_to_binding.get(&initializer_e_ref).copied(),
        Some(catch_e)
    );
    assert_ne!(
        info.ref_node_id_to_binding.get(&initializer_e_ref).copied(),
        Some(outer_e)
    );
    assert_eq!(
        info.ref_node_id_to_binding.get(&body_e_ref).copied(),
        Some(catch_e)
    );
}

#[test]
fn scope_resolves_references_inside_var_decl_patterns() {
    let source = r#"
        const key = "name";
        const fallback = "unknown";
        const obj = {};
        const { [key]: value = fallback } = obj;
    "#;
    let program = parse_program(source);
    let info = SemanticBuilder::new().build(&program);

    let binding_id = |name: &str| {
        info.bindings
            .iter()
            .find(|binding| binding.name == name)
            .unwrap_or_else(|| panic!("should find binding {name}"))
            .id
    };
    let source_pos = |needle: &str| {
        source
            .find(needle)
            .unwrap_or_else(|| panic!("should find {needle:?}")) as u32
            + 1
    };

    let key_ref = source_pos("key]: value");
    assert_eq!(
        info.ref_node_id_to_binding.get(&key_ref).copied(),
        Some(binding_id("key"))
    );

    let fallback_ref = source_pos("fallback } = obj");
    assert_eq!(
        info.ref_node_id_to_binding.get(&fallback_ref).copied(),
        Some(binding_id("fallback"))
    );
}

#[test]
fn scope_resolves_references_inside_object_assign_patterns() {
    let source = r#"
        const fallback = "unknown";
        const obj = {};
        const { x = fallback } = obj;
    "#;
    let program = parse_program(source);
    let info = SemanticBuilder::new().build(&program);

    let binding_id = |name: &str| {
        info.bindings
            .iter()
            .find(|binding| binding.name == name)
            .unwrap_or_else(|| panic!("should find binding {name}"))
            .id
    };

    let fallback_ref = source
        .find("fallback } = obj")
        .expect("should find fallback reference") as u32
        + 1;
    assert_eq!(
        info.ref_node_id_to_binding.get(&fallback_ref).copied(),
        Some(binding_id("fallback"))
    );
}

#[test]
fn scope_class_static_block_var_is_scoped() {
    let source = r#"
        const x = 1;
        class C {
            static { var x = 2; }
        }
        function App() { return x; }
    "#;
    let program = parse_program(source);
    let info = SemanticBuilder::new().build(&program);

    let x_bindings: Vec<_> = info.bindings.iter().filter(|b| b.name == "x").collect();
    assert_eq!(x_bindings.len(), 2, "should have two x bindings");

    let static_block_x = x_bindings
        .iter()
        .find(|b| matches!(b.kind, BindingKind::Var))
        .expect("should find var x binding in static block");
    let static_block_scope = &info.scopes[static_block_x.scope.0 as usize];
    assert!(
        matches!(static_block_scope.kind, ScopeKind::Class),
        "static block var x should be scoped to Class scope"
    );
}

#[test]
fn scope_ts_module_block_creates_scope() {
    let source = r#"
        namespace N {
            export const hidden = 1;
        }
        function App() { return N.hidden; }
    "#;
    let module = parse_ts_module(source);
    let program = swc_ecma_ast::Program::Module(module);
    let info = SemanticBuilder::new().build(&program);

    let hidden_binding = info
        .bindings
        .iter()
        .find(|b| b.name == "hidden")
        .expect("should find hidden binding");

    let hidden_scope = &info.scopes[hidden_binding.scope.0 as usize];
    assert!(
        !matches!(hidden_scope.kind, ScopeKind::Program),
        "namespace member should not leak to Program scope"
    );
}

// ── Full transform pipeline tests ───────────────────────────────────────────

#[test]
fn transform_simple_component_does_not_panic() {
    let source = r#"
        function App() {
            return <div>Hello</div>;
        }
    "#;
    let result = transform_source(source, Default::default(), default_options());
    // The transform should complete without panicking.
    // It may or may not produce output depending on compiler completeness.
    let _ = result.program;
    let _ = result.diagnostics;
}

#[test]
fn transform_component_with_hook_does_not_panic() {
    let source = r#"
        import { useState } from 'react';
        function Counter() {
            const [count, setCount] = useState(0);
            return <div>{count}</div>;
        }
    "#;
    let result = transform_source(source, Default::default(), default_options());
    let _ = result.program;
    let _ = result.diagnostics;
}

#[test]
fn transform_ref_access_error_is_not_swc_diagnostic_with_default_panic_threshold() {
    let source = r#"
        import { useRef } from 'react';

        function App() {
            const ref = useRef(1);
            return ref.current;
        }
    "#;

    let result = transform_source(source, Default::default(), default_options());

    assert!(
        result.program.is_none(),
        "component with a ref access error should not be compiled"
    );
    assert!(
        result.diagnostics.is_empty(),
        "non-fatal React Compiler events should not surface as SWC diagnostics: {:#?}",
        result.diagnostics
    );
}

#[test]
fn transform_compilation_mode_all_does_not_skip() {
    let source = "const x = 1 + 2;";
    let mut options = default_options();
    options.compilation_mode = "all".to_string();
    let result = transform_source(source, Default::default(), options);
    // With "all" mode, even non-React code should go through the compiler.
    // It may not produce output.
    let _ = result.program;
}

#[test]
fn lint_simple_component_does_not_panic() {
    let source = r#"
        function App() {
            return <div>Hello</div>;
        }
    "#;
    let result = lint_source(source, Default::default(), default_options());
    let _ = result.diagnostics;
}

#[test]
fn lint_reports_ref_access_error_with_default_panic_threshold() {
    let source = r#"
        import { useRef } from 'react';

        function App() {
            const ref = useRef(1);
            return ref.current;
        }
    "#;

    let result = lint_source(source, Default::default(), default_options());

    assert_eq!(result.diagnostics.len(), 1);
    assert!(
        matches!(result.diagnostics[0].severity, Severity::Error),
        "lint should preserve React Compiler error severity: {:#?}",
        result.diagnostics
    );
    assert!(
        result.diagnostics[0]
            .message
            .contains("[ReactCompiler] Refs: Cannot access refs during render"),
        "unexpected diagnostic: {:#?}",
        result.diagnostics
    );
}

#[test]
fn lint_non_react_code_returns_empty() {
    let source = "const x = 1;";
    let result = lint_source(source, Default::default(), default_options());
    assert!(result.diagnostics.is_empty());
}

// ── Reverse AST conversion tests ────────────────────────────────────────────

#[test]
fn reverse_convert_variable_declaration() {
    let source = "const x = 1;";
    let module = parse_module(source);
    let file = convert_module(&module, source);

    let program = convert_program_to_swc(&file);
    let module = program.as_module().unwrap();
    assert_eq!(module.body.len(), 1);
    assert!(matches!(
        &module.body[0],
        swc_ecma_ast::ModuleItem::Stmt(swc_ecma_ast::Stmt::Decl(swc_ecma_ast::Decl::Var(_)))
    ));
}

#[test]
fn reverse_convert_function_declaration() {
    let source = "function foo() { return 42; }";
    let module = parse_module(source);
    let file = convert_module(&module, source);

    let program = convert_program_to_swc(&file);
    let module = program.as_module().unwrap();
    assert_eq!(module.body.len(), 1);
    assert!(matches!(
        &module.body[0],
        swc_ecma_ast::ModuleItem::Stmt(swc_ecma_ast::Stmt::Decl(swc_ecma_ast::Decl::Fn(_)))
    ));
}

#[test]
fn reverse_convert_import_export() {
    let source = r#"
        import { useState } from 'react';
        export const x = 1;
    "#;
    let module = parse_module(source);
    let file = convert_module(&module, source);

    let program = convert_program_to_swc(&file);
    let module = program.as_module().unwrap();
    assert_eq!(module.body.len(), 2);
}

#[test]
fn reverse_convert_roundtrip_via_json() {
    let source = r#"
        const x = 1;
        function foo(a, b) { return a + b; }
    "#;
    let module = parse_module(source);
    let file = convert_module(&module, source);

    assert_file_serializes_to_json(&file);

    let program = convert_program_to_swc(&file);
    let module = program.as_module().unwrap();
    assert_eq!(module.body.len(), 2);
}

#[test]
fn reverse_convert_jsx_roundtrip() {
    let source = r#"const el = <div className="test">hello</div>;"#;
    let module = parse_module(source);
    let file = convert_module(&module, source);

    assert_file_serializes_to_json(&file);

    let program = convert_program_to_swc(&file);
    let module = program.as_module().unwrap();
    assert_eq!(module.body.len(), 1);
}

#[test]
fn reverse_convert_multiple_statement_types() {
    let source = r#"
        import React from 'react';
        const x = 1;
        let y = 'hello';
        function App() { return <div>{x}{y}</div>; }
        export default App;
    "#;
    let module = parse_module(source);
    let file = convert_module(&module, source);

    let program = convert_program_to_swc(&file);
    let module = program.as_module().unwrap();
    assert_eq!(module.body.len(), 5);
}

// ── TS module interop statements ────────────────────────────────────────────

fn parse_ts_module(source: &str) -> swc_ecma_ast::Module {
    let syntax = swc_ecma_parser::TsSyntax {
        tsx: true,
        ..Default::default()
    };
    let cm = Lrc::new(SourceMap::default());
    let fm = cm.new_source_file(Lrc::new(FileName::Anon), source.to_string());
    let mut errors = vec![];
    parse_file_as_module(
        &fm,
        Syntax::Typescript(syntax),
        EsVersion::latest(),
        None,
        &mut errors,
    )
    .expect("Failed to parse")
}

fn convert_ts_source(source: &str) -> crate::convert_ast::ConvertResult {
    let module = parse_ts_module(source);
    let program = swc_ecma_ast::Program::Module(module);
    convert_program(&program, source, None)
}

fn round_trip_convert_result(result: crate::convert_ast::ConvertResult) -> swc_ecma_ast::Program {
    assert_file_serializes_to_json(&result.file);

    convert_program_to_swc_with_preserved_ast(&result.file, result.preserved_ast)
}

/// TS module-interop statements (`import x = require(...)`, `export = x`,
/// `export as namespace X`) have no dedicated node in `react_compiler_ast`.
/// They are carried as opaque `TSModuleDeclaration`s with preserved SWC shells.
/// This test verifies the typed AST still serializes to JSON and emits back
/// without source-text reparse.
#[test]
fn ts_module_interop_statements_round_trip() {
    let source =
        "import lib = require('shared-runtime');\nexport = lib;\nexport as namespace Foo;\n";
    let result = convert_ts_source(source);

    assert_eq!(result.file.program.body.len(), 3);
    for stmt in result.file.program.body.iter() {
        match stmt {
            Statement::TSModuleDeclaration(..) => continue,
            other => panic!("expected TSModuleDeclaration, got {other:?}"),
        }
    }

    let swc_program = round_trip_convert_result(result);
    let swc_module = swc_program.as_module().unwrap();
    assert_eq!(swc_module.body.len(), 3);
    assert!(matches!(
        &swc_module.body[0],
        swc_ecma_ast::ModuleItem::ModuleDecl(swc_ecma_ast::ModuleDecl::TsImportEquals(_))
    ));
    assert!(matches!(
        &swc_module.body[1],
        swc_ecma_ast::ModuleItem::ModuleDecl(swc_ecma_ast::ModuleDecl::TsExportAssignment(_))
    ));
    assert!(matches!(
        &swc_module.body[2],
        swc_ecma_ast::ModuleItem::ModuleDecl(swc_ecma_ast::ModuleDecl::TsNamespaceExport(_))
    ));

    let code = emit_program(&swc_program).expect("emit should succeed");
    assert!(
        code.contains("import lib = require('shared-runtime');"),
        "missing import-equals in output: {code}"
    );
    assert!(
        code.contains("export = lib"),
        "missing export-assignment in output: {code}"
    );
    assert!(
        code.contains("export as namespace Foo"),
        "missing namespace export in output: {code}"
    );
}

/// A qualified-name module reference (`import a = b.c.d`) round-trips
/// through the raw `TSQualifiedName` shape.
#[test]
fn ts_import_equals_qualified_name_round_trips() {
    let source = "import a = b.c.d;\n";
    let program = round_trip_convert_result(convert_ts_source(source));
    let code = emit_program(&program).expect("emit should succeed");
    assert!(
        code.contains("import a = b.c.d;"),
        "missing qualified import-equals in output: {code}"
    );
}

/// Round-trip a TS import-equals declaration source string and return the
/// rebuilt SWC declaration plus the emitted code.
fn round_trip_import_equals(source: &str) -> (swc_ecma_ast::TsImportEqualsDecl, String) {
    let swc_program = round_trip_convert_result(convert_ts_source(source));
    let swc_module = swc_program.as_module().unwrap();
    let decl = match &swc_module.body[0] {
        swc_ecma_ast::ModuleItem::ModuleDecl(swc_ecma_ast::ModuleDecl::TsImportEquals(d)) => {
            (**d).clone()
        }
        other => panic!("expected TsImportEquals, got {other:?}"),
    };
    let code = emit_program(&swc_program).expect("emit should succeed");
    (decl, code)
}

/// `import type x = require(...)` round-trips with `is_type_only`
/// preserved through the raw `importKind: "type"` field.
#[test]
fn ts_import_equals_type_only_round_trips() {
    let source = "import type x = require('shared-runtime');\n";
    let (decl, code) = round_trip_import_equals(source);
    assert!(decl.is_type_only, "is_type_only lost in round trip");
    assert!(!decl.is_export);
    assert!(
        code.contains("import type x = require('shared-runtime');"),
        "missing type-only import-equals in output: {code}"
    );
}

/// `export import x = require(...)` round-trips with `is_export` preserved
/// through the raw `isExport: true` field.
#[test]
fn ts_import_equals_export_round_trips() {
    let source = "export import x = require('shared-runtime');\n";
    let (decl, code) = round_trip_import_equals(source);
    assert!(decl.is_export, "is_export lost in round trip");
    assert!(!decl.is_type_only);
    assert!(
        code.contains("export import x = require('shared-runtime');"),
        "missing exported import-equals in output: {code}"
    );
}

/// A TypeScript `this` parameter (`function f(this: T) {}`) declares the type
/// of `this` inside the body. SWC represents it as a `Pat::Ident("this")`,
/// indistinguishable from a real parameter. The scope collector must skip it
/// to avoid a "reserved word" diagnostic.
#[test]
fn ts_this_param_in_function_is_not_a_reserved_identifier_error() {
    let source = r#"
        'use client';

        import * as React from 'react';

        function useClickHandler() {
            const [count, setCount] = React.useState(0);
            function handleClick(this: HTMLElement) {
                setCount(c => c + 1);
            }
            return handleClick;
        }
    "#;

    let result = transform_source(
        source,
        swc_ecma_parser::Syntax::Typescript(swc_ecma_parser::TsSyntax {
            tsx: true,
            ..Default::default()
        }),
        default_options(),
    );

    assert!(
        result.diagnostics.is_empty(),
        "got unexpected diagnostic for TS `this` param: {:#?}",
        result.diagnostics
    );
}

fn emit_program(program: &swc_ecma_ast::Program) -> Result<String, String> {
    let cm = Lrc::new(SourceMap::default());
    let mut buf = Vec::new();
    {
        let wr = swc_ecma_codegen::text_writer::JsWriter::new(cm.clone(), "\n", &mut buf, None);
        let mut emitter = swc_ecma_codegen::Emitter {
            cfg: swc_ecma_codegen::Config::default(),
            cm,
            comments: None,
            wr: Box::new(wr),
        };

        program
            .emit_with(&mut emitter)
            .map_err(|err| format!("failed to emit output: {err:?}"))?;
    }

    String::from_utf8(buf).map_err(|err| format!("emitted output is not valid UTF-8: {err}"))
}
