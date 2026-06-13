// Copyright (c) Meta Platforms, Inc. and affiliates.
//
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.

use react_compiler::entrypoint::plugin_options::{CompilerTarget, PluginOptions};
use react_compiler_ast::{
    scope::{BindingKind, ScopeKind},
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
    convert_scope::build_scope_info, lint_source, prefilter::has_react_like_functions,
    transform_source,
};

fn convert_program_to_swc(file: &File) -> swc_ecma_ast::Program {
    convert_program_to_swc_with_preserved_ast(file, Default::default())
}

fn convert_module(module: &swc_ecma_ast::Module, source_text: &str) -> File {
    let program = swc_ecma_ast::Program::Module(module.clone());
    convert_program(&program, source_text, None).file
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

// ── Prefilter tests ─────────────────────────────────────────────────────────

#[test]
fn prefilter_detects_function_component() {
    let program = parse_program("function MyComponent() { return <div />; }");
    assert!(has_react_like_functions(&program));
}

#[test]
fn prefilter_detects_arrow_component() {
    let program = parse_program("const MyComponent = () => <div />;");
    assert!(has_react_like_functions(&program));
}

#[test]
fn prefilter_detects_hook() {
    let program = parse_program("function useMyHook() { return 42; }");
    assert!(has_react_like_functions(&program));
}

#[test]
fn prefilter_detects_hook_assigned_to_variable() {
    let program = parse_program("const useMyHook = function() { return 42; };");
    assert!(has_react_like_functions(&program));
}

#[test]
fn prefilter_rejects_non_react_program() {
    let program = parse_program(
        r#"
        const x = 1;
        function helper() { return x + 2; }
        export { helper };
        "#,
    );
    assert!(!has_react_like_functions(&program));
}

#[test]
fn prefilter_rejects_lowercase_function() {
    let program = parse_program("function myFunction() { return 42; }");
    assert!(!has_react_like_functions(&program));
}

#[test]
fn prefilter_rejects_use_prefix_without_uppercase() {
    let program = parse_program("function useful() { return true; }");
    assert!(!has_react_like_functions(&program));
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
    let info = build_scope_info(&program);
    assert!(!info.scopes.is_empty());
    assert!(matches!(info.scopes[0].kind, ScopeKind::Program));
    assert!(info.scopes[0].parent.is_none());
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
    let info = build_scope_info(&program);

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
    let info = build_scope_info(&program);

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
    let info = build_scope_info(&program);

    let inner_binding = info
        .bindings
        .iter()
        .find(|b| b.name == "inner")
        .expect("should find binding inner");
    assert!(matches!(inner_binding.kind, BindingKind::Hoisted));
    // inner should be hoisted to the enclosing function scope (outer), not the
    // block
    let scope = &info.scopes[inner_binding.scope.0 as usize];
    assert!(matches!(scope.kind, ScopeKind::Function));
}

#[test]
fn scope_import_bindings() {
    let source = r#"
        import React from 'react';
        import { useState, useEffect } from 'react';
        import * as Utils from './utils';
    "#;
    let program = parse_program(source);
    let info = build_scope_info(&program);

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
    let info = build_scope_info(&program);

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
    let info = build_scope_info(&program);

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
    let info = build_scope_info(&program);

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
    let info = build_scope_info(&program);

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
fn scope_resolves_references_inside_var_decl_patterns() {
    let source = r#"
        const key = "name";
        const fallback = "unknown";
        const obj = {};
        const { [key]: value = fallback } = obj;
    "#;
    let program = parse_program(source);
    let info = build_scope_info(&program);

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
fn transform_non_react_code_returns_none() {
    let source = "const x = 1 + 2;";
    let result = transform_source(source, Default::default(), default_options());
    // Non-React code with compilation_mode "infer" should be skipped (prefilter)
    assert!(result.program.is_none());
    assert!(result.diagnostics.is_empty());
}

#[test]
fn transform_compilation_mode_all_does_not_skip() {
    let source = "const x = 1 + 2;";
    let mut options = default_options();
    options.compilation_mode = "all".to_string();
    let result = transform_source(source, Default::default(), options);
    // With "all" mode, even non-React code should go through the compiler.
    // It may not produce output, but it should not be skipped by prefilter.
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

    // Serialize to JSON and deserialize back
    let json = serde_json::to_value(&file).expect("serialize to JSON");
    let deserialized: react_compiler_ast::File =
        serde_json::from_value(json).expect("deserialize from JSON");

    // Convert the deserialized AST back to SWC
    let program = convert_program_to_swc(&deserialized);
    let module = program.as_module().unwrap();
    assert_eq!(module.body.len(), 2);
}

#[test]
fn reverse_convert_jsx_roundtrip() {
    let source = r#"const el = <div className="test">hello</div>;"#;
    let module = parse_module(source);
    let file = convert_module(&module, source);

    let json = serde_json::to_value(&file).expect("serialize to JSON");
    let deserialized: react_compiler_ast::File =
        serde_json::from_value(json).expect("deserialize from JSON");

    let program = convert_program_to_swc(&deserialized);
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
    let json = serde_json::to_value(&result.file).expect("serialize to JSON");
    let deserialized: react_compiler_ast::File =
        serde_json::from_value(json).expect("deserialize from JSON");

    convert_program_to_swc_with_preserved_ast(&deserialized, result.preserved_ast)
}

/// TS module-interop statements (`import x = require(...)`, `export = x`,
/// `export as namespace X`) have no dedicated node in `react_compiler_ast`.
/// They are carried as opaque `TSModuleDeclaration`s with preserved SWC shells.
/// This test verifies they survive a JSON round trip and emit back without
/// source-text reparse.
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
