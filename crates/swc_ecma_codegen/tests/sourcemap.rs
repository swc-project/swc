use std::{fs::read_to_string, path::PathBuf};

use base64::prelude::{Engine, BASE64_STANDARD};
use rustc_hash::FxBuildHasher;
use swc_allocator::api::global::HashSet;
use swc_common::{
    comments::SingleThreadedComments, source_map::SourceMapGenConfig, sync::Lrc, BytePos, FileName,
    LineCol, SourceMap as CommonSourceMap, Spanned, DUMMY_SP,
};
use swc_ecma_ast::{
    ArrayLit, AssignTarget, Bool, CallExpr, Callee, ClassMember, DebuggerStmt, Decl, EmptyStmt,
    EsVersion, ExportSpecifier, Expr, ExprOrSpread, ExprStmt, Ident, Import, ImportDecl,
    ImportPhase, ImportSpecifier, Invalid, JSXAttrName, JSXAttrOrSpread, JSXElementChild,
    JSXElementName, JSXExpr, Module, ModuleDecl, ModuleExportName, ModuleItem, ObjectPatProp, Pat,
    SeqExpr, SimpleAssignTarget, Stmt, Str, Super, ThisExpr, TsKeywordType, TsKeywordTypeKind,
    TsLit, TsLitType, TsNonNullExpr, TsType, TsTypeElement,
};
use swc_ecma_codegen::{text_writer::WriteJs, Emitter};
use swc_ecma_parser::{lexer::Lexer, EsSyntax, Parser, Syntax};
use swc_ecma_testing::{exec_node_js, JsExecOptions};
use swc_sourcemap::SourceMap;

fn generated_import() -> ModuleItem {
    ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
        span: DUMMY_SP,
        specifiers: Vec::new(),
        src: Box::new(Str {
            span: DUMMY_SP,
            value: "generated-only".into(),
            raw: None,
        }),
        type_only: false,
        with: None,
        phase: ImportPhase::Evaluation,
    }))
}

fn parse_module_with_syntax(
    cm: &Lrc<CommonSourceMap>,
    source: &str,
    syntax: Syntax,
) -> (Module, SingleThreadedComments) {
    let fm = cm.new_source_file(
        FileName::Custom("source.js".into()).into(),
        source.to_owned(),
    );
    let comments = SingleThreadedComments::default();
    let lexer = Lexer::new(syntax, Default::default(), (&*fm).into(), Some(&comments));
    let mut parser = Parser::new_from(lexer);
    let module = parser.parse_module().expect("failed to parse test module");
    assert!(parser.take_errors().is_empty());

    (module, comments)
}

fn parse_module(cm: &Lrc<CommonSourceMap>, source: &str) -> (Module, SingleThreadedComments) {
    parse_module_with_syntax(cm, source, Syntax::default())
}

fn emit_source_map(
    cm: Lrc<CommonSourceMap>,
    comments: &SingleThreadedComments,
    module: &Module,
    minify: bool,
    emit_columns: bool,
    input_source_map: Option<SourceMap>,
) -> (String, SourceMap, Vec<(BytePos, LineCol)>) {
    let mut code = Vec::new();
    let mut mappings = Vec::new();
    {
        let wr = Box::new(swc_ecma_codegen::text_writer::JsWriter::new(
            cm.clone(),
            "\n",
            &mut code,
            Some(&mut mappings),
        )) as Box<dyn WriteJs>;
        let mut emitter = Emitter {
            cfg: swc_ecma_codegen::Config::default().with_minify(minify),
            cm: cm.clone(),
            wr,
            comments: Some(comments),
        };
        emitter.emit_module(module).unwrap();
    }

    let map = cm.build_source_map(
        &mappings,
        input_source_map,
        SourceMapConfigImpl { emit_columns },
    );

    (String::from_utf8(code).unwrap(), map, mappings)
}

fn generated_position(code: &str, needle: &str) -> (u32, u32) {
    let offset = code.find(needle).expect("generated text not found");
    let prefix = &code[..offset];
    let line = prefix.bytes().filter(|&byte| byte == b'\n').count() as u32;
    let line_start = prefix.rfind('\n').map_or(0, |index| index + 1);
    let col = code[line_start..offset].encode_utf16().count() as u32;

    (line, col)
}

fn assert_source_location(
    map: &SourceMap,
    code: &str,
    needle: &str,
    expected_line: u32,
    expected_col: u32,
) {
    let (line, col) = generated_position(code, needle);
    let token = map
        .lookup_token(line, col)
        .unwrap_or_else(|| panic!("missing mapping for {needle:?} at {line}:{col}"));
    assert!(token.has_source(), "{needle:?} should have a source");
    assert_eq!(token.get_src_line(), expected_line, "line for {needle:?}");
    assert_eq!(token.get_src_col(), expected_col, "column for {needle:?}");
}

fn assert_source_less(map: &SourceMap, code: &str, needle: &str) {
    let (line, col) = generated_position(code, needle);
    if let Some(token) = map.lookup_token(line, col) {
        assert!(
            !token.has_source(),
            "{needle:?} unexpectedly maps to {}:{}",
            token.get_src_line(),
            token.get_src_col()
        );
    }
}

fn assert_source_less_boundary(map: &SourceMap, code: &str, needle: &str) {
    let (line, col) = generated_position(code, needle);
    let token = map
        .lookup_token(line, col)
        .unwrap_or_else(|| panic!("missing source-less boundary for {needle:?} at {line}:{col}"));
    assert!(!token.has_source(), "{needle:?} should clear its mapping");
    assert_eq!(
        token.get_dst(),
        (line, col),
        "source-less boundary should start at {needle:?}"
    );
}

fn assert_source_less_boundary_after(map: &SourceMap, code: &str, needle: &str) {
    let offset = code.find(needle).expect("generated text not found") + needle.len();
    let prefix = &code[..offset];
    let line = prefix.bytes().filter(|&byte| byte == b'\n').count() as u32;
    let line_start = prefix.rfind('\n').map_or(0, |index| index + 1);
    let col = code[line_start..offset].encode_utf16().count() as u32;
    let token = map
        .lookup_token(line, col)
        .unwrap_or_else(|| panic!("missing source-less boundary after {needle:?} at {line}:{col}"));

    assert!(
        !token.has_source(),
        "boundary after {needle:?} should be source-less"
    );
    assert_eq!(
        token.get_dst(),
        (line, col),
        "source-less boundary should start after {needle:?}"
    );
}

#[test]
fn dummy_span_import_is_source_less() {
    let source =
        "/* leading comment */\nvar first;\nimport value from './value.js';\nconsole.log(value);\n";

    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) = parse_module(&cm, source);
        module.body.insert(0, generated_import());

        let (code, map, mappings) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_location(&map, &code, "/* leading comment */", 0, 0);
        assert_source_less(&map, &code, "generated-only");
        assert_source_location(&map, &code, "var first", 1, 0);
        assert_source_location(&map, &code, "import value", 2, 0);
        assert_source_location(&map, &code, "log(value)", 3, 8);
        assert_eq!(
            mappings
                .iter()
                .filter(|(pos, _)| *pos == BytePos::SYNTHESIZED)
                .count(),
            0,
            "an initially unmapped generated region needs no boundary: {code}"
        );
    }
}

#[test]
fn dummy_span_between_mapped_regions_clears_mapping() {
    let source = "before();\nafter();\n";

    for minify in [false, true] {
        for emit_columns in [false, true] {
            let cm = Lrc::<CommonSourceMap>::default();
            let (mut module, comments) = parse_module(&cm, source);
            module.body.insert(1, generated_import());

            let (code, map, mappings) =
                emit_source_map(cm, &comments, &module, minify, emit_columns, None);

            assert_source_location(&map, &code, "before", 0, 0);
            assert_source_less_boundary(&map, &code, "import");
            assert_source_location(&map, &code, "after", 1, 0);
            assert_eq!(
                mappings
                    .iter()
                    .filter(|(pos, _)| *pos == BytePos::SYNTHESIZED)
                    .count(),
                1,
                "dummy source-map events should be deduplicated: {code}"
            );
        }
    }
}

#[test]
fn dummy_typescript_declaration_prefixes_are_source_less() {
    let source = "before_enum();\nenum Original {}\nafter_enum();\ntype Original = \
                  boolean;\nafter_type_alias();\nexport as namespace \
                  OriginalNamespace;\nafter_namespace_export();\n";
    let cm = Lrc::<CommonSourceMap>::default();
    let (mut module, comments) =
        parse_module_with_syntax(&cm, source, Syntax::Typescript(Default::default()));

    let ModuleItem::Stmt(Stmt::Decl(Decl::TsEnum(enum_decl))) = &mut module.body[1] else {
        panic!("expected an enum declaration");
    };
    enum_decl.span = DUMMY_SP;
    enum_decl.declare = true;
    enum_decl.is_const = true;
    enum_decl.id.span = DUMMY_SP;

    let ModuleItem::Stmt(Stmt::Decl(Decl::TsTypeAlias(type_alias))) = &mut module.body[3] else {
        panic!("expected a type alias declaration");
    };
    type_alias.span = DUMMY_SP;
    type_alias.id.span = DUMMY_SP;
    *type_alias.type_ann = TsType::TsKeywordType(TsKeywordType {
        span: DUMMY_SP,
        kind: TsKeywordTypeKind::TsBooleanKeyword,
    });

    let ModuleItem::ModuleDecl(ModuleDecl::TsNamespaceExport(namespace_export)) =
        &mut module.body[5]
    else {
        panic!("expected a namespace export declaration");
    };
    namespace_export.span = DUMMY_SP;
    namespace_export.id.span = DUMMY_SP;

    let (code, map, _) = emit_source_map(cm, &comments, &module, true, true, None);

    assert_source_location(&map, &code, "before_enum", 0, 0);
    assert_source_less_boundary(&map, &code, "declare const enum");
    assert_source_location(&map, &code, "after_enum", 2, 0);
    assert_source_less_boundary(&map, &code, "type Original");
    assert_source_location(&map, &code, "after_type_alias", 4, 0);
    assert_source_less_boundary(&map, &code, "export as namespace");
    assert_source_location(&map, &code, "after_namespace_export", 6, 0);
}

#[test]
fn dummy_leaf_nodes_between_mapped_regions_clear_mapping() {
    let source = "before();\nmiddle();\nlater();\nafter();\n";
    let cm = Lrc::<CommonSourceMap>::default();
    let (mut module, comments) = parse_module(&cm, source);

    module.body.insert(
        1,
        ModuleItem::Stmt(Stmt::Empty(EmptyStmt { span: DUMMY_SP })),
    );
    module.body.insert(
        3,
        ModuleItem::Stmt(Stmt::Expr(ExprStmt {
            span: DUMMY_SP,
            expr: Box::new(Expr::Invalid(Invalid { span: DUMMY_SP })),
        })),
    );
    module.body.insert(
        5,
        ModuleItem::Stmt(Stmt::Debugger(DebuggerStmt { span: DUMMY_SP })),
    );

    let (code, map, mappings) = emit_source_map(cm, &comments, &module, true, true, None);

    assert_source_location(&map, &code, "before", 0, 0);
    assert_source_less_boundary(&map, &code, ";middle");
    assert_source_location(&map, &code, "middle", 1, 0);
    assert_source_less_boundary(&map, &code, "<invalid>");
    assert_source_location(&map, &code, "later", 2, 0);
    assert_source_less_boundary(&map, &code, "debugger");
    assert_source_location(&map, &code, "after", 3, 0);
    assert_eq!(
        mappings
            .iter()
            .filter(|(pos, _)| *pos == BytePos::SYNTHESIZED)
            .count(),
        3,
        "each generated leaf region should have one source-less boundary: {code}"
    );
}

#[test]
fn dummy_span_between_composed_mapped_regions_clears_mapping() {
    let source = "before();\nafter();\n";
    let input_source_map = SourceMap::from_slice(
        br#"{
            "version": 3,
            "sources": ["original.js"],
            "names": [],
            "mappings": "AAUA;AACA"
        }"#,
    )
    .unwrap();

    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) = parse_module(&cm, source);
        module.body.insert(1, generated_import());

        let (code, map, _) = emit_source_map(
            cm,
            &comments,
            &module,
            minify,
            true,
            Some(input_source_map.clone()),
        );

        assert_source_location(&map, &code, "before", 10, 0);
        assert_source_less_boundary(&map, &code, "import");
        assert_source_location(&map, &code, "after", 11, 0);
    }
}

#[test]
fn dummy_span_array_delimiters_are_source_less() {
    let source = "before();\nelement;\nafter();\n";

    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) = parse_module(&cm, source);

        let ModuleItem::Stmt(Stmt::Expr(expr_stmt)) = &mut module.body[1] else {
            panic!("expected an expression statement");
        };
        let element = expr_stmt.expr.clone();
        *expr_stmt.expr = Expr::Array(ArrayLit {
            span: DUMMY_SP,
            elems: vec![Some(ExprOrSpread {
                spread: None,
                expr: element,
            })],
        });

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_less_boundary(&map, &code, "[");
        assert_source_location(&map, &code, "element", 1, 0);
        assert_source_less_boundary(&map, &code, "]");
        assert_source_location(&map, &code, "after", 2, 0);
    }
}

#[test]
fn real_array_pattern_resumes_before_closing_delimiter() {
    let source = "before();\nlet [element] = values;\nafter();\n";

    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) = parse_module(&cm, source);

        let ModuleItem::Stmt(Stmt::Decl(Decl::Var(var))) = &mut module.body[1] else {
            panic!("expected a variable declaration");
        };
        let Pat::Array(pattern) = &mut var.decls[0].name else {
            panic!("expected an array pattern");
        };
        let Some(Pat::Ident(element)) = &mut pattern.elems[0] else {
            panic!("expected an identifier pattern");
        };
        element.id.span = DUMMY_SP;

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_less_boundary(&map, &code, "element");
        assert_source_location(&map, &code, "]", 1, 12);
        assert_source_location(&map, &code, "after", 2, 0);
    }
}

#[test]
fn real_object_pattern_resumes_before_closing_delimiter() {
    let source = "before();\nlet { element } = values;\nafter();\n";

    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) = parse_module(&cm, source);

        let ModuleItem::Stmt(Stmt::Decl(Decl::Var(var))) = &mut module.body[1] else {
            panic!("expected a variable declaration");
        };
        let Pat::Object(pattern) = &mut var.decls[0].name else {
            panic!("expected an object pattern");
        };
        let ObjectPatProp::Assign(property) = &mut pattern.props[0] else {
            panic!("expected an assignment pattern property");
        };
        property.span = DUMMY_SP;

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_location(&map, &code, "}", 1, 14);
        assert_source_location(&map, &code, "after", 2, 0);
    }
}

#[test]
fn jsx_opening_delimiters_resume_after_dummy_siblings() {
    let source = "const value = <root><generated/><real/><generated2/><>fragment</></root>;\n";

    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) = parse_module_with_syntax(
            &cm,
            source,
            Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
        );

        let ModuleItem::Stmt(Stmt::Decl(Decl::Var(var))) = &mut module.body[0] else {
            panic!("expected a variable declaration");
        };
        let Some(init) = &mut var.decls[0].init else {
            panic!("expected a variable initializer");
        };
        let Expr::JSXElement(root) = &mut **init else {
            panic!("expected a JSX element initializer");
        };

        for index in [0, 2] {
            let JSXElementChild::JSXElement(element) = &mut root.children[index] else {
                panic!("expected a generated JSX element");
            };
            element.span = DUMMY_SP;
            element.opening.span = DUMMY_SP;
            let JSXElementName::Ident(name) = &mut element.opening.name else {
                panic!("expected a JSX identifier");
            };
            name.span = DUMMY_SP;
        }

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_less_boundary(&map, &code, "<generated");
        assert_source_location(&map, &code, "<real", 0, 32);
        assert_source_less_boundary(&map, &code, "<generated2");
        assert_source_location(&map, &code, "<>fragment", 0, 52);
    }
}

#[test]
fn real_jsx_opening_element_resumes_before_self_closing_delimiters() {
    let source = "const element = <root generated />;\nafter();\n";

    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) = parse_module_with_syntax(
            &cm,
            source,
            Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
        );

        let ModuleItem::Stmt(Stmt::Decl(Decl::Var(var))) = &mut module.body[0] else {
            panic!("expected a variable declaration");
        };
        let Some(init) = &mut var.decls[0].init else {
            panic!("expected a variable initializer");
        };
        let Expr::JSXElement(element) = &mut **init else {
            panic!("expected a JSX element initializer");
        };
        let JSXAttrOrSpread::JSXAttr(attr) = &mut element.opening.attrs[0] else {
            panic!("expected a JSX attribute");
        };
        attr.span = DUMMY_SP;
        let JSXAttrName::Ident(name) = &mut attr.name else {
            panic!("expected a JSX attribute identifier");
        };
        name.span = DUMMY_SP;

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_less_boundary(&map, &code, "generated");
        assert_source_location(&map, &code, "/", 0, 33);
        assert_source_location(&map, &code, ">", 0, 33);
        assert_source_location(&map, &code, "after", 1, 0);
    }
}

#[test]
fn real_jsx_spread_attribute_resumes_before_closing_delimiter() {
    let source = "const element = <root {...value} />;\nafter();\n";

    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) = parse_module_with_syntax(
            &cm,
            source,
            Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
        );

        let ModuleItem::Stmt(Stmt::Decl(Decl::Var(var))) = &mut module.body[0] else {
            panic!("expected a variable declaration");
        };
        let Some(init) = &mut var.decls[0].init else {
            panic!("expected a variable initializer");
        };
        let Expr::JSXElement(element) = &mut **init else {
            panic!("expected a JSX element initializer");
        };
        let JSXAttrOrSpread::SpreadElement(spread) = &mut element.opening.attrs[0] else {
            panic!("expected a JSX spread attribute");
        };
        *spread.expr = Expr::This(ThisExpr { span: DUMMY_SP });

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_less(&map, &code, "this");
        assert_source_location(&map, &code, "}", 0, 26);
        assert_source_location(&map, &code, "after", 1, 0);
    }
}

#[test]
fn real_jsx_expression_container_resumes_before_closing_delimiters() {
    let source = "const element = <div>{value}</div>;\nafter();\n";

    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) = parse_module_with_syntax(
            &cm,
            source,
            Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
        );

        let ModuleItem::Stmt(Stmt::Decl(Decl::Var(var))) = &mut module.body[0] else {
            panic!("expected a variable declaration");
        };
        let Some(init) = &mut var.decls[0].init else {
            panic!("expected a variable initializer");
        };
        let Expr::JSXElement(element) = &mut **init else {
            panic!("expected a JSX element initializer");
        };
        let JSXElementChild::JSXExprContainer(container) = &mut element.children[0] else {
            panic!("expected a JSX expression container");
        };
        let JSXExpr::Expr(expr) = &mut container.expr else {
            panic!("expected a JSX expression");
        };
        **expr = Expr::This(ThisExpr { span: DUMMY_SP });

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_less_boundary(&map, &code, "this");
        assert_source_location(&map, &code, "}", 0, 27);
        assert_source_location(&map, &code, "</", 0, 28);
        assert_source_location(&map, &code, "after", 1, 0);
    }
}

#[test]
fn real_jsx_closing_element_resumes_after_dummy_child() {
    let source = "const element = <root><generated/></root>;\nafter();\n";

    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) = parse_module_with_syntax(
            &cm,
            source,
            Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
        );

        let ModuleItem::Stmt(Stmt::Decl(Decl::Var(var))) = &mut module.body[0] else {
            panic!("expected a variable declaration");
        };
        let Some(init) = &mut var.decls[0].init else {
            panic!("expected a variable initializer");
        };
        let Expr::JSXElement(root) = &mut **init else {
            panic!("expected a JSX element initializer");
        };
        let JSXElementChild::JSXElement(child) = &mut root.children[0] else {
            panic!("expected a JSX element child");
        };
        child.span = DUMMY_SP;
        child.opening.span = DUMMY_SP;
        let JSXElementName::Ident(name) = &mut child.opening.name else {
            panic!("expected a JSX identifier");
        };
        name.span = DUMMY_SP;
        let closing = root.closing.as_mut().expect("expected a closing element");
        let JSXElementName::Ident(name) = &mut closing.name else {
            panic!("expected a closing JSX identifier");
        };
        name.span = DUMMY_SP;

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_less_boundary(&map, &code, "<generated");
        assert_source_location(&map, &code, "</root", 0, 34);
        assert_source_location(&map, &code, ">;", 0, 40);
        assert_source_location(&map, &code, "after", 1, 0);
    }
}

#[test]
fn real_jsx_spread_child_resumes_before_closing_delimiter() {
    let source = "const element = <div>{...value}</div>;\nafter();\n";

    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) = parse_module_with_syntax(
            &cm,
            source,
            Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
        );

        let ModuleItem::Stmt(Stmt::Decl(Decl::Var(var))) = &mut module.body[0] else {
            panic!("expected a variable declaration");
        };
        let Some(init) = &mut var.decls[0].init else {
            panic!("expected a variable initializer");
        };
        let Expr::JSXElement(element) = &mut **init else {
            panic!("expected a JSX element initializer");
        };
        let JSXElementChild::JSXSpreadChild(spread) = &mut element.children[0] else {
            panic!("expected a JSX spread child");
        };
        *spread.expr = Expr::This(ThisExpr { span: DUMMY_SP });

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_less_boundary(&map, &code, "this");
        assert_source_location(&map, &code, "}", 0, 30);
        assert_source_location(&map, &code, "</", 0, 31);
        assert_source_location(&map, &code, "after", 1, 0);
    }
}

#[test]
fn dummy_span_call_delimiters_are_source_less() {
    let source = "before();\nargument;\nafter();\n";

    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) = parse_module(&cm, source);

        let ModuleItem::Stmt(Stmt::Expr(expr_stmt)) = &mut module.body[1] else {
            panic!("expected an expression statement");
        };
        let argument = expr_stmt.expr.clone();
        *expr_stmt.expr = Expr::Call(CallExpr {
            span: DUMMY_SP,
            ctxt: Default::default(),
            callee: Callee::Expr(Box::new(Expr::Ident(Ident::new_no_ctxt(
                "generated".into(),
                DUMMY_SP,
            )))),
            args: vec![ExprOrSpread {
                spread: None,
                expr: argument,
            }],
            type_args: None,
        });

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_less_boundary(&map, &code, "generated");
        assert_source_location(&map, &code, "argument", 1, 0);
        assert_source_less_boundary_after(&map, &code, "argument");
        assert_source_location(&map, &code, "after", 2, 0);
    }
}

#[test]
fn dummy_span_operators_are_source_less() {
    let source = "before();\nleft + right;\ntarget = value;\noperand++;\nafter();\n";

    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) = parse_module(&cm, source);

        let ModuleItem::Stmt(Stmt::Expr(expr_stmt)) = &mut module.body[1] else {
            panic!("expected a binary expression statement");
        };
        let Expr::Bin(binary) = &mut *expr_stmt.expr else {
            panic!("expected a binary expression");
        };
        binary.span = DUMMY_SP;

        let ModuleItem::Stmt(Stmt::Expr(expr_stmt)) = &mut module.body[2] else {
            panic!("expected an assignment expression statement");
        };
        let Expr::Assign(assign) = &mut *expr_stmt.expr else {
            panic!("expected an assignment expression");
        };
        assign.span = DUMMY_SP;

        let ModuleItem::Stmt(Stmt::Expr(expr_stmt)) = &mut module.body[3] else {
            panic!("expected an update expression statement");
        };
        let Expr::Update(update) = &mut *expr_stmt.expr else {
            panic!("expected an update expression");
        };
        update.span = DUMMY_SP;

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_location(&map, &code, "left", 1, 0);
        assert_source_less_boundary(&map, &code, "+");
        assert_source_location(&map, &code, "right", 1, 7);
        assert_source_location(&map, &code, "target", 2, 0);
        assert_source_less_boundary(&map, &code, "=");
        assert_source_location(&map, &code, "value", 2, 9);
        assert_source_location(&map, &code, "operand", 3, 0);
        assert_source_less_boundary(&map, &code, "++");
        assert_source_location(&map, &code, "after", 4, 0);
    }
}

#[test]
fn real_span_operators_resume_after_dummy_children() {
    let source = "before();\nleft + right;\ntarget = value;\noperand++;\nafter();\n";

    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) = parse_module(&cm, source);

        let ModuleItem::Stmt(Stmt::Expr(expr_stmt)) = &mut module.body[1] else {
            panic!("expected a binary expression statement");
        };
        let Expr::Bin(binary) = &mut *expr_stmt.expr else {
            panic!("expected a binary expression");
        };
        let Expr::Ident(left) = &mut *binary.left else {
            panic!("expected an identifier on the left");
        };
        left.span = DUMMY_SP;

        let ModuleItem::Stmt(Stmt::Expr(expr_stmt)) = &mut module.body[2] else {
            panic!("expected an assignment expression statement");
        };
        let Expr::Assign(assign) = &mut *expr_stmt.expr else {
            panic!("expected an assignment expression");
        };
        let AssignTarget::Simple(SimpleAssignTarget::Ident(target)) = &mut assign.left else {
            panic!("expected an identifier assignment target");
        };
        target.id.span = DUMMY_SP;

        let ModuleItem::Stmt(Stmt::Expr(expr_stmt)) = &mut module.body[3] else {
            panic!("expected an update expression statement");
        };
        let Expr::Update(update) = &mut *expr_stmt.expr else {
            panic!("expected an update expression");
        };
        let Expr::Ident(operand) = &mut *update.arg else {
            panic!("expected an identifier update operand");
        };
        operand.span = DUMMY_SP;

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_less_boundary(&map, &code, "left");
        assert_source_location(&map, &code, "+", 1, 0);
        assert_source_location(&map, &code, "right", 1, 7);
        assert_source_less_boundary(&map, &code, "target");
        assert_source_location(&map, &code, "=", 2, 0);
        assert_source_location(&map, &code, "value", 2, 9);
        assert_source_less_boundary(&map, &code, "operand");
        assert_source_location(&map, &code, "++", 3, 0);
        assert_source_location(&map, &code, "after", 4, 0);
    }
}

#[test]
fn real_conditional_separators_resume_after_dummy_children() {
    let source = "before();\ntest ? consequent : alternative;\nafter();\n";

    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) = parse_module(&cm, source);

        let ModuleItem::Stmt(Stmt::Expr(expr_stmt)) = &mut module.body[1] else {
            panic!("expected an expression statement");
        };
        let Expr::Cond(conditional) = &mut *expr_stmt.expr else {
            panic!("expected a conditional expression");
        };
        *conditional.test = Expr::This(ThisExpr { span: DUMMY_SP });
        *conditional.cons = Expr::Ident(Ident::new_no_ctxt("generated".into(), DUMMY_SP));

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        if minify {
            assert_source_less_boundary(&map, &code, "this");
        }
        assert_source_location(&map, &code, "?", 1, 0);
        assert_source_less_boundary(&map, &code, "generated");
        assert_source_location(&map, &code, ":", 1, 0);
        assert_source_location(&map, &code, "after", 2, 0);
    }
}

#[test]
fn real_template_interpolation_closers_resume_after_dummy_expressions() {
    let source =
        "before();\n`plain${value}plain_tail`;\ntag`tagged${value}tagged_tail`;\nafter();\n";

    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) = parse_module(&cm, source);

        let ModuleItem::Stmt(Stmt::Expr(expr_stmt)) = &mut module.body[1] else {
            panic!("expected an expression statement");
        };
        let Expr::Tpl(template) = &mut *expr_stmt.expr else {
            panic!("expected a template expression");
        };
        *template.exprs[0] = Expr::This(ThisExpr { span: DUMMY_SP });

        let ModuleItem::Stmt(Stmt::Expr(expr_stmt)) = &mut module.body[2] else {
            panic!("expected an expression statement");
        };
        let Expr::TaggedTpl(tagged) = &mut *expr_stmt.expr else {
            panic!("expected a tagged template expression");
        };
        *tagged.tpl.exprs[0] = Expr::This(ThisExpr { span: DUMMY_SP });

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_less_boundary(&map, &code, "this}plain_tail");
        assert_source_location(&map, &code, "}plain_tail", 1, 0);
        assert_source_less_boundary(&map, &code, "this}tagged_tail");
        assert_source_location(&map, &code, "}tagged_tail", 2, 3);
        assert_source_location(&map, &code, "after", 3, 0);
    }
}

#[test]
fn real_member_separator_resumes_after_dummy_object() {
    let source = "before();\nobject.member;\nafter();\n";

    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) = parse_module(&cm, source);

        let ModuleItem::Stmt(Stmt::Expr(expr_stmt)) = &mut module.body[1] else {
            panic!("expected a member expression statement");
        };
        let Expr::Member(member) = &mut *expr_stmt.expr else {
            panic!("expected a member expression");
        };
        *member.obj = Expr::This(ThisExpr { span: DUMMY_SP });

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_less_boundary(&map, &code, "this");
        assert_source_location(&map, &code, ".member", 1, 0);
        assert_source_location(&map, &code, "after", 2, 0);
    }
}

#[test]
fn real_sequence_separator_resumes_after_dummy_child() {
    let source = "before();\nfirst, second;\nafter();\n";

    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) = parse_module(&cm, source);

        let ModuleItem::Stmt(Stmt::Expr(expr_stmt)) = &mut module.body[1] else {
            panic!("expected an expression statement");
        };
        let Expr::Seq(sequence) = &mut *expr_stmt.expr else {
            panic!("expected a sequence expression");
        };
        *sequence.exprs[0] = Expr::This(ThisExpr { span: DUMMY_SP });

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_less_boundary(&map, &code, "this");
        assert_source_location(&map, &code, ",", 1, 0);
        assert_source_location(&map, &code, "second", 1, 7);
        assert_source_location(&map, &code, "after", 2, 0);
    }
}

#[test]
fn real_span_separators_resume_after_nested_dummy_descendants() {
    let source = "before();\nleft + right;\ntarget = value;\noperand++;\nafter();\n";

    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) = parse_module(&cm, source);

        let ModuleItem::Stmt(Stmt::Expr(expr_stmt)) = &mut module.body[1] else {
            panic!("expected a binary expression statement");
        };
        let Expr::Bin(binary) = &mut *expr_stmt.expr else {
            panic!("expected a binary expression");
        };
        let left = binary.left.clone();
        *binary.left = Expr::Seq(SeqExpr {
            span: left.span(),
            exprs: vec![left, Box::new(Expr::This(ThisExpr { span: DUMMY_SP }))],
        });

        let ModuleItem::Stmt(Stmt::Expr(expr_stmt)) = &mut module.body[2] else {
            panic!("expected an assignment expression statement");
        };
        let Expr::Assign(assign) = &mut *expr_stmt.expr else {
            panic!("expected an assignment expression");
        };
        let AssignTarget::Simple(target) = &assign.left else {
            panic!("expected a simple assignment target");
        };
        assign.left = AssignTarget::Simple(SimpleAssignTarget::TsNonNull(TsNonNullExpr {
            span: target.span(),
            expr: Box::new(Expr::This(ThisExpr { span: DUMMY_SP })),
        }));

        let ModuleItem::Stmt(Stmt::Expr(expr_stmt)) = &mut module.body[3] else {
            panic!("expected an update expression statement");
        };
        let Expr::Update(update) = &mut *expr_stmt.expr else {
            panic!("expected an update expression");
        };
        let arg_span = update.arg.span();
        *update.arg = Expr::TsNonNull(TsNonNullExpr {
            span: arg_span,
            expr: Box::new(Expr::This(ThisExpr { span: DUMMY_SP })),
        });

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_less_boundary(&map, &code, "this");
        assert_source_location(&map, &code, "+", 1, 0);
        assert_source_less_boundary(&map, &code, "this!");
        assert_source_location(&map, &code, "=", 2, 0);
        assert_source_less_boundary(&map, &code, "this!++");
        assert_source_location(&map, &code, "++", 3, 0);
        assert_source_location(&map, &code, "after", 4, 0);
    }
}

#[test]
fn dummy_span_expression_leaves_are_source_less() {
    let source = "before();\nleft + right;\nafter();\n";

    let cm = Lrc::<CommonSourceMap>::default();
    let (mut module, comments) = parse_module(&cm, source);
    let ModuleItem::Stmt(Stmt::Expr(expr_stmt)) = &mut module.body[1] else {
        panic!("expected an expression statement");
    };
    let Expr::Bin(binary) = &mut *expr_stmt.expr else {
        panic!("expected a binary expression");
    };
    *binary.right = Expr::This(ThisExpr { span: DUMMY_SP });

    let (code, map, _) = emit_source_map(cm, &comments, &module, false, true, None);

    assert_source_location(&map, &code, "left", 1, 0);
    assert_source_less_boundary(&map, &code, "this");
    assert_source_location(&map, &code, "after", 2, 0);
}

#[test]
fn dummy_span_callee_leaves_are_source_less() {
    let source = "before();\ncallee();\nafter();\n";

    for (callee, needle) in [
        (Callee::Super(Super { span: DUMMY_SP }), "super"),
        (
            Callee::Import(Import {
                span: DUMMY_SP,
                phase: ImportPhase::Evaluation,
            }),
            "import",
        ),
    ] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) = parse_module(&cm, source);
        let ModuleItem::Stmt(Stmt::Expr(expr_stmt)) = &mut module.body[1] else {
            panic!("expected an expression statement");
        };
        let Expr::Call(call) = &mut *expr_stmt.expr else {
            panic!("expected a call expression");
        };
        call.callee = callee;

        let (code, map, _) = emit_source_map(cm, &comments, &module, false, true, None);

        assert_source_less_boundary(&map, &code, needle);
        assert_source_location(&map, &code, "after", 2, 0);
    }
}

#[test]
fn dummy_span_typescript_bool_is_source_less() {
    let source = "type Value = original;\nafter();\n";
    let cm = Lrc::<CommonSourceMap>::default();
    let (mut module, comments) =
        parse_module_with_syntax(&cm, source, Syntax::Typescript(Default::default()));
    let ModuleItem::Stmt(Stmt::Decl(Decl::TsTypeAlias(type_alias))) = &mut module.body[0] else {
        panic!("expected a type alias declaration");
    };
    *type_alias.type_ann = TsType::TsLitType(TsLitType {
        span: DUMMY_SP,
        lit: TsLit::Bool(Bool {
            span: DUMMY_SP,
            value: true,
        }),
    });

    let (code, map, _) = emit_source_map(cm, &comments, &module, false, true, None);

    assert_source_location(&map, &code, "Value", 0, 5);
    assert_source_less_boundary(&map, &code, "true");
    assert_source_location(&map, &code, "after", 1, 0);
}

#[test]
fn real_array_type_resumes_before_brackets() {
    let source = "type Value = original[];\nafter();\n";

    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) =
            parse_module_with_syntax(&cm, source, Syntax::Typescript(Default::default()));
        let ModuleItem::Stmt(Stmt::Decl(Decl::TsTypeAlias(type_alias))) = &mut module.body[0]
        else {
            panic!("expected a type alias declaration");
        };
        let TsType::TsArrayType(array) = &mut *type_alias.type_ann else {
            panic!("expected an array type");
        };
        *array.elem_type = TsType::TsLitType(TsLitType {
            span: DUMMY_SP,
            lit: TsLit::Bool(Bool {
                span: DUMMY_SP,
                value: true,
            }),
        });

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_less_boundary(&map, &code, "true");
        assert_source_location(&map, &code, "[]", 0, 22);
        assert_source_location(&map, &code, "after", 1, 0);
    }
}

#[test]
fn real_type_arguments_resume_before_closing_delimiter() {
    let source = "fn<Original>();\nafter();\n";

    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) =
            parse_module_with_syntax(&cm, source, Syntax::Typescript(Default::default()));
        let ModuleItem::Stmt(Stmt::Expr(expr_stmt)) = &mut module.body[0] else {
            panic!("expected an expression statement");
        };
        let Expr::Call(call) = &mut *expr_stmt.expr else {
            panic!("expected a call expression");
        };
        let type_args = call
            .type_args
            .as_mut()
            .expect("expected call type arguments");
        *type_args.params[0] = TsType::TsKeywordType(TsKeywordType {
            span: DUMMY_SP,
            kind: TsKeywordTypeKind::TsBooleanKeyword,
        });

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_less_boundary(&map, &code, "boolean");
        assert_source_location(&map, &code, ">", 0, 11);
        assert_source_location(&map, &code, "after", 1, 0);
    }
}

#[test]
fn real_type_parameter_declaration_resumes_before_closing_delimiter() {
    let source = "function fn<T extends Original>() {}\nafter();\n";

    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) =
            parse_module_with_syntax(&cm, source, Syntax::Typescript(Default::default()));
        let ModuleItem::Stmt(Stmt::Decl(Decl::Fn(function))) = &mut module.body[0] else {
            panic!("expected a function declaration");
        };
        let type_params = function
            .function
            .type_params
            .as_mut()
            .expect("expected type parameters");
        let constraint = type_params.params[0]
            .constraint
            .as_mut()
            .expect("expected a type parameter constraint");
        **constraint = TsType::TsKeywordType(TsKeywordType {
            span: DUMMY_SP,
            kind: TsKeywordTypeKind::TsBooleanKeyword,
        });

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_less_boundary(&map, &code, "boolean");
        assert_source_location(&map, &code, ">", 0, 30);
        assert_source_location(&map, &code, "after", 1, 0);
    }
}

#[test]
fn real_typescript_separators_resume_after_dummy_children() {
    let source = "before();\nvalue as Type;\nvalue satisfies Type;\ntype Choice = Check extends \
                  Base ? Yes : No;\nafter();\n";

    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) =
            parse_module_with_syntax(&cm, source, Syntax::Typescript(Default::default()));

        let ModuleItem::Stmt(Stmt::Expr(expr_stmt)) = &mut module.body[1] else {
            panic!("expected an expression statement");
        };
        let Expr::TsAs(as_expr) = &mut *expr_stmt.expr else {
            panic!("expected an as expression");
        };
        *as_expr.expr = Expr::This(ThisExpr { span: DUMMY_SP });

        let ModuleItem::Stmt(Stmt::Expr(expr_stmt)) = &mut module.body[2] else {
            panic!("expected an expression statement");
        };
        let Expr::TsSatisfies(satisfies) = &mut *expr_stmt.expr else {
            panic!("expected a satisfies expression");
        };
        *satisfies.expr = Expr::Ident(Ident::new_no_ctxt("generated".into(), DUMMY_SP));

        let ModuleItem::Stmt(Stmt::Decl(Decl::TsTypeAlias(type_alias))) = &mut module.body[3]
        else {
            panic!("expected a type alias declaration");
        };
        let TsType::TsConditionalType(conditional) = &mut *type_alias.type_ann else {
            panic!("expected a conditional type");
        };
        *conditional.check_type = TsType::TsKeywordType(TsKeywordType {
            span: DUMMY_SP,
            kind: TsKeywordTypeKind::TsBooleanKeyword,
        });
        *conditional.extends_type = TsType::TsKeywordType(TsKeywordType {
            span: DUMMY_SP,
            kind: TsKeywordTypeKind::TsNumberKeyword,
        });
        *conditional.true_type = TsType::TsKeywordType(TsKeywordType {
            span: DUMMY_SP,
            kind: TsKeywordTypeKind::TsStringKeyword,
        });

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_less_boundary(&map, &code, "this");
        assert_source_location(&map, &code, "as", 1, 0);
        assert_source_less_boundary(&map, &code, "generated");
        assert_source_location(&map, &code, "satisfies", 2, 0);
        assert_source_less_boundary(&map, &code, "boolean");
        assert_source_location(&map, &code, "extends", 3, 14);
        assert_source_less_boundary(&map, &code, "number");
        assert_source_location(&map, &code, "?", 3, 14);
        assert_source_less_boundary(&map, &code, "string");
        assert_source_location(&map, &code, ":", 3, 14);
        assert_source_location(&map, &code, "after", 4, 0);
    }
}

#[test]
fn real_tuple_type_resumes_before_closing_delimiter() {
    let source = "type Value = [original];\nafter();\n";

    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) =
            parse_module_with_syntax(&cm, source, Syntax::Typescript(Default::default()));
        let ModuleItem::Stmt(Stmt::Decl(Decl::TsTypeAlias(type_alias))) = &mut module.body[0]
        else {
            panic!("expected a type alias declaration");
        };
        let TsType::TsTupleType(tuple) = &mut *type_alias.type_ann else {
            panic!("expected a tuple type");
        };
        *tuple.elem_types[0].ty = TsType::TsLitType(TsLitType {
            span: DUMMY_SP,
            lit: TsLit::Bool(Bool {
                span: DUMMY_SP,
                value: true,
            }),
        });

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_less_boundary(&map, &code, "true");
        assert_source_location(&map, &code, "]", 0, 22);
        assert_source_location(&map, &code, "after", 1, 0);
    }
}

#[test]
fn real_parenthesized_type_resumes_before_closing_delimiter() {
    let source = "type Value = (original);\nafter();\n";

    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) =
            parse_module_with_syntax(&cm, source, Syntax::Typescript(Default::default()));
        let ModuleItem::Stmt(Stmt::Decl(Decl::TsTypeAlias(type_alias))) = &mut module.body[0]
        else {
            panic!("expected a type alias declaration");
        };
        let TsType::TsParenthesizedType(parenthesized) = &mut *type_alias.type_ann else {
            panic!("expected a parenthesized type");
        };
        *parenthesized.type_ann = TsType::TsLitType(TsLitType {
            span: DUMMY_SP,
            lit: TsLit::Bool(Bool {
                span: DUMMY_SP,
                value: true,
            }),
        });

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_less_boundary(&map, &code, "true");
        assert_source_location(&map, &code, ")", 0, 22);
        assert_source_location(&map, &code, "after", 1, 0);
    }
}

#[test]
fn real_arrow_suffix_resumes_after_dummy_final_parameter() {
    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) = parse_module(&cm, "(first, second) => body;\nafter();\n");

        let ModuleItem::Stmt(Stmt::Expr(expr_stmt)) = &mut module.body[0] else {
            panic!("expected an expression statement");
        };
        let Expr::Arrow(arrow) = &mut *expr_stmt.expr else {
            panic!("expected an arrow expression");
        };
        let Pat::Ident(param) = arrow.params.last_mut().expect("expected a final parameter") else {
            panic!("expected an identifier parameter");
        };
        param.id.span = DUMMY_SP;

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_less_boundary(&map, &code, "second");
        assert_source_location(&map, &code, ")", 0, 0);
        assert_source_location(&map, &code, "=>", 0, 0);
        assert_source_location(&map, &code, "after", 1, 0);

        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) = parse_module_with_syntax(
            &cm,
            "(first, second): number => body;\nafter();\n",
            Syntax::Typescript(Default::default()),
        );

        let ModuleItem::Stmt(Stmt::Expr(expr_stmt)) = &mut module.body[0] else {
            panic!("expected an expression statement");
        };
        let Expr::Arrow(arrow) = &mut *expr_stmt.expr else {
            panic!("expected an arrow expression");
        };
        let Pat::Ident(param) = arrow.params.last_mut().expect("expected a final parameter") else {
            panic!("expected an identifier parameter");
        };
        param.id.span = DUMMY_SP;

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_less_boundary(&map, &code, "second");
        assert_source_location(&map, &code, ")", 0, 0);
        assert_source_location(&map, &code, ":", 0, 0);
        assert_source_location(&map, &code, "=>", 0, 23);
        assert_source_location(&map, &code, "after", 1, 0);
    }
}

#[test]
fn real_type_literal_resumes_before_closing_brace() {
    let source = "type Shape = { property: string };\nafter();\n";

    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) =
            parse_module_with_syntax(&cm, source, Syntax::Typescript(Default::default()));

        let ModuleItem::Stmt(Stmt::Decl(Decl::TsTypeAlias(type_alias))) = &mut module.body[0]
        else {
            panic!("expected a type alias declaration");
        };
        let TsType::TsTypeLit(type_lit) = &mut *type_alias.type_ann else {
            panic!("expected a type literal");
        };
        let TsTypeElement::TsPropertySignature(property) = &mut type_lit.members[0] else {
            panic!("expected a type literal property");
        };
        property.span = DUMMY_SP;
        let Expr::Ident(key) = &mut *property.key else {
            panic!("expected an identifier property key");
        };
        key.span = DUMMY_SP;
        let type_ann = property
            .type_ann
            .as_mut()
            .expect("expected a property type annotation");
        type_ann.span = DUMMY_SP;
        *type_ann.type_ann = TsType::TsKeywordType(TsKeywordType {
            span: DUMMY_SP,
            kind: TsKeywordTypeKind::TsBooleanKeyword,
        });

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_less_boundary(&map, &code, "property");
        assert_source_less(&map, &code, "boolean");
        assert_source_location(&map, &code, "}", 0, 32);
        assert_source_location(&map, &code, "after", 1, 0);
    }
}

#[test]
fn real_list_and_declarator_separators_resume_after_dummy_children() {
    let source = "call(before, after);\nlet binding = value;\nafter();\n";

    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) = parse_module(&cm, source);

        let ModuleItem::Stmt(Stmt::Expr(expr_stmt)) = &mut module.body[0] else {
            panic!("expected an expression statement");
        };
        let Expr::Call(call) = &mut *expr_stmt.expr else {
            panic!("expected a call expression");
        };
        *call.args[0].expr = Expr::This(ThisExpr { span: DUMMY_SP });

        let ModuleItem::Stmt(Stmt::Decl(Decl::Var(var))) = &mut module.body[1] else {
            panic!("expected a variable declaration");
        };
        let Pat::Ident(binding) = &mut var.decls[0].name else {
            panic!("expected an identifier binding");
        };
        binding.id.span = DUMMY_SP;

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_less_boundary(&map, &code, "this");
        assert_source_location(&map, &code, ",", 0, 0);
        assert_source_less_boundary(&map, &code, "binding");
        assert_source_location(&map, &code, "=", 1, 4);
        assert_source_location(&map, &code, "after()", 2, 0);
    }
}

#[test]
fn real_do_while_suffix_resumes_after_dummy_body() {
    let source = "do body(); while (test);\nafter();\n";

    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) = parse_module(&cm, source);

        let ModuleItem::Stmt(Stmt::DoWhile(do_while)) = &mut module.body[0] else {
            panic!("expected a do-while statement");
        };
        *do_while.body = Stmt::Empty(EmptyStmt { span: DUMMY_SP });

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_less_boundary(&map, &code, ";");
        assert_source_location(&map, &code, "while", 0, 0);
        assert_source_location(&map, &code, "after", 1, 0);
    }
}

#[test]
fn real_call_openers_resume_after_dummy_callees() {
    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) = parse_module(&cm, "callee();\nafter();\n");

        let ModuleItem::Stmt(Stmt::Expr(expr_stmt)) = &mut module.body[0] else {
            panic!("expected an expression statement");
        };
        let Expr::Call(call) = &mut *expr_stmt.expr else {
            panic!("expected a call expression");
        };
        call.callee = Callee::Expr(Box::new(Expr::This(ThisExpr { span: DUMMY_SP })));

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_less(&map, &code, "this");
        assert_source_location(&map, &code, "(", 0, 0);
        assert_source_location(&map, &code, "after", 1, 0);

        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) = parse_module(&cm, "new Constructor(argument);\nafter();\n");

        let ModuleItem::Stmt(Stmt::Expr(expr_stmt)) = &mut module.body[0] else {
            panic!("expected an expression statement");
        };
        let Expr::New(new_expr) = &mut *expr_stmt.expr else {
            panic!("expected a new expression");
        };
        *new_expr.callee = Expr::This(ThisExpr { span: DUMMY_SP });

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_less_boundary(&map, &code, "this");
        assert_source_location(&map, &code, "(", 0, 0);
        assert_source_location(&map, &code, "after", 1, 0);
    }
}

#[test]
fn real_jsx_closing_fragment_resumes_after_dummy_child() {
    let source = "const element = <>child</>;\nafter();\n";

    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) = parse_module_with_syntax(
            &cm,
            source,
            Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
        );

        let ModuleItem::Stmt(Stmt::Decl(Decl::Var(var))) = &mut module.body[0] else {
            panic!("expected a variable declaration");
        };
        let Some(init) = &mut var.decls[0].init else {
            panic!("expected a variable initializer");
        };
        let Expr::JSXFragment(fragment) = &mut **init else {
            panic!("expected a JSX fragment initializer");
        };
        let JSXElementChild::JSXText(text) = &mut fragment.children[0] else {
            panic!("expected a JSX text child");
        };
        text.span = DUMMY_SP;

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_less_boundary(&map, &code, "child");
        assert_source_location(&map, &code, "</>", 0, 23);
        assert_source_location(&map, &code, "after", 1, 0);
    }
}

#[test]
fn real_interface_body_resumes_before_closing_brace() {
    let source = "interface Shape { property: string }\nafter();\n";

    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) =
            parse_module_with_syntax(&cm, source, Syntax::Typescript(Default::default()));

        let ModuleItem::Stmt(Stmt::Decl(Decl::TsInterface(interface))) = &mut module.body[0] else {
            panic!("expected an interface declaration");
        };
        let TsTypeElement::TsPropertySignature(property) = &mut interface.body.body[0] else {
            panic!("expected an interface property");
        };
        property.span = DUMMY_SP;
        let Expr::Ident(key) = &mut *property.key else {
            panic!("expected an identifier property key");
        };
        key.span = DUMMY_SP;
        let type_ann = property
            .type_ann
            .as_mut()
            .expect("expected a property type annotation");
        type_ann.span = DUMMY_SP;
        *type_ann.type_ann = TsType::TsKeywordType(TsKeywordType {
            span: DUMMY_SP,
            kind: TsKeywordTypeKind::TsBooleanKeyword,
        });

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_less_boundary(&map, &code, "property");
        assert_source_less(&map, &code, "boolean");
        assert_source_location(&map, &code, "}", 0, 35);
        assert_source_location(&map, &code, "after", 1, 0);
    }
}

#[test]
fn real_super_property_separator_resumes_after_dummy_super() {
    let source = "class Derived { method() { super.property; } }\nafter();\n";

    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) = parse_module(&cm, source);

        let ModuleItem::Stmt(Stmt::Decl(Decl::Class(class))) = &mut module.body[0] else {
            panic!("expected a class declaration");
        };
        let ClassMember::Method(method) = &mut class.class.body[0] else {
            panic!("expected a class method");
        };
        let body = method
            .function
            .body
            .as_mut()
            .expect("expected a method body");
        let Stmt::Expr(expr_stmt) = &mut body.stmts[0] else {
            panic!("expected an expression statement");
        };
        let Expr::SuperProp(super_prop) = &mut *expr_stmt.expr else {
            panic!("expected a super property expression");
        };
        super_prop.obj.span = DUMMY_SP;

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_less_boundary(&map, &code, "super");
        assert_source_location(&map, &code, ".property", 0, 27);
        assert_source_location(&map, &code, "after", 1, 0);
    }
}

#[test]
fn real_class_heritage_resumes_after_dummy_children() {
    let source = "class Derived extends Base<Type> implements Contract {}\nafter();\n";

    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) =
            parse_module_with_syntax(&cm, source, Syntax::Typescript(Default::default()));

        let ModuleItem::Stmt(Stmt::Decl(Decl::Class(class))) = &mut module.body[0] else {
            panic!("expected a class declaration");
        };
        **class
            .class
            .super_class
            .as_mut()
            .expect("expected a superclass") = Expr::This(ThisExpr { span: DUMMY_SP });
        *class
            .class
            .implements
            .last_mut()
            .expect("expected an implements type")
            .expr = Expr::This(ThisExpr { span: DUMMY_SP });

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_less_boundary(&map, &code, "this");
        assert_source_location(&map, &code, "<", 0, 0);
        assert_source_location(&map, &code, "implements", 0, 31);
        assert_source_location(&map, &code, "{", 0, 0);
        assert_source_location(&map, &code, "after", 1, 0);
    }
}

#[test]
fn real_if_else_resumes_after_dummy_consequent() {
    let source = "if (test) consequent(); else alternate();\nafter();\n";

    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) = parse_module(&cm, source);

        let ModuleItem::Stmt(Stmt::If(if_stmt)) = &mut module.body[0] else {
            panic!("expected an if statement");
        };
        *if_stmt.cons = Stmt::Empty(EmptyStmt { span: DUMMY_SP });

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_less_boundary(&map, &code, ";");
        assert_source_location(&map, &code, "else", 0, 0);
        assert_source_location(&map, &code, "after", 1, 0);
    }
}

#[test]
fn real_optional_type_resumes_before_question_mark() {
    let source = "type Tuple = [Original?];\nafter();\n";

    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) =
            parse_module_with_syntax(&cm, source, Syntax::Typescript(Default::default()));

        let ModuleItem::Stmt(Stmt::Decl(Decl::TsTypeAlias(type_alias))) = &mut module.body[0]
        else {
            panic!("expected a type alias declaration");
        };
        let TsType::TsTupleType(tuple) = &mut *type_alias.type_ann else {
            panic!("expected a tuple type");
        };
        let TsType::TsOptionalType(optional) = &mut *tuple.elem_types[0].ty else {
            panic!("expected an optional tuple element");
        };
        *optional.type_ann = TsType::TsKeywordType(TsKeywordType {
            span: DUMMY_SP,
            kind: TsKeywordTypeKind::TsBooleanKeyword,
        });

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_less_boundary(&map, &code, "boolean");
        assert_source_location(&map, &code, "?", 0, 14);
        assert_source_location(&map, &code, "after", 1, 0);
    }
}

#[test]
fn real_jsx_attribute_resumes_before_equals_sign() {
    let source = "const element = <root original=\"value\" />;\nafter();\n";

    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) = parse_module_with_syntax(
            &cm,
            source,
            Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
        );

        let ModuleItem::Stmt(Stmt::Decl(Decl::Var(var))) = &mut module.body[0] else {
            panic!("expected a variable declaration");
        };
        let Some(init) = &mut var.decls[0].init else {
            panic!("expected a variable initializer");
        };
        let Expr::JSXElement(element) = &mut **init else {
            panic!("expected a JSX element initializer");
        };
        let JSXAttrOrSpread::JSXAttr(attr) = &mut element.opening.attrs[0] else {
            panic!("expected a JSX attribute");
        };
        let JSXAttrName::Ident(name) = &mut attr.name else {
            panic!("expected a JSX attribute identifier");
        };
        name.span = DUMMY_SP;

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_less_boundary(&map, &code, "original");
        assert_source_location(&map, &code, "=\"value\"", 0, 22);
        assert_source_location(&map, &code, "after", 1, 0);
    }
}

#[test]
fn real_module_specifiers_resume_before_alias_keywords() {
    for minify in [false, true] {
        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) = parse_module(
            &cm,
            "import { original as local } from \"mod\";\nafter();\n",
        );

        let ModuleItem::ModuleDecl(ModuleDecl::Import(import)) = &mut module.body[0] else {
            panic!("expected an import declaration");
        };
        let ImportSpecifier::Named(specifier) = &mut import.specifiers[0] else {
            panic!("expected a named import specifier");
        };
        let Some(ModuleExportName::Ident(imported)) = &mut specifier.imported else {
            panic!("expected an imported identifier");
        };
        imported.span = DUMMY_SP;

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_less_boundary(&map, &code, "original");
        assert_source_location(&map, &code, "as", 0, 9);
        assert_source_location(&map, &code, "after", 1, 0);

        let cm = Lrc::<CommonSourceMap>::default();
        let (mut module, comments) =
            parse_module(&cm, "export { original as publicName };\nafter();\n");

        let ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(export)) = &mut module.body[0] else {
            panic!("expected a named export declaration");
        };
        let ExportSpecifier::Named(specifier) = &mut export.specifiers[0] else {
            panic!("expected a named export specifier");
        };
        let ModuleExportName::Ident(original) = &mut specifier.orig else {
            panic!("expected an original export identifier");
        };
        original.span = DUMMY_SP;

        let (code, map, _) = emit_source_map(cm, &comments, &module, minify, true, None);

        assert_source_less_boundary(&map, &code, "original");
        assert_source_location(&map, &code, "as", 0, 9);
        assert_source_location(&map, &code, "after", 1, 0);
    }
}

#[test]
fn empty_module_source_map_stays_empty() {
    let cm = Lrc::<CommonSourceMap>::default();
    let (module, comments) = parse_module(&cm, "");
    let (code, map, mappings) = emit_source_map(cm, &comments, &module, false, true, None);

    assert!(code.is_empty());
    assert!(mappings.is_empty());
    assert_eq!(map.get_token_count(), 0);
}

static IGNORED_PASS_TESTS: &[&str] = &[
    // Temporally ignored
    "16c7073c546fdd58.js",
    "369fd0a1e40030d8.js",
    "3df03e7e138b7760.js",
    "5333f04581124314.js",
    "a157424306915066.js",
    "ce5f3bc27d5ccaac.js",
    "d4e81043d808dc31.js",
    // Stack size (Stupid parens)
    "6b5e7e125097d439.js",
    "714be6d28082eaa7.js",
    "882910de7dd1aef9.js",
    "dd3c63403db5c06e.js",
    // Wrong tests (variable name or value is different)
    "0339fa95c78c11bd.js",
    "0426f15dac46e92d.js",
    "0b4d61559ccce0f9.js",
    "0f88c334715d2489.js",
    "1093d98f5fc0758d.js",
    "15d9592709b947a0.js",
    "2179895ec5cc6276.js",
    "247a3a57e8176ebd.js",
    "441a92357939904a.js",
    "47f974d6fc52e3e4.js",
    "4e1a0da46ca45afe.js",
    "5829d742ab805866.js",
    "589dc8ad3b9aa28f.js",
    "598a5cedba92154d.js",
    "72d79750e81ef03d.js",
    "7788d3c1e1247da9.js",
    "7b72d7b43bedc895.js",
    "7dab6e55461806c9.js",
    "82c827ccaecbe22b.js",
    "87a9b0d1d80812cc.js",
    "8c80f7ee04352eba.js",
    "96f5d93be9a54573.js",
    "988e362ed9ddcac5.js",
    "9bcae7c7f00b4e3c.js",
    "a8a03a88237c4e8f.js",
    "ad06370e34811a6a.js",
    "b0fdc038ee292aba.js",
    "b62c6dd890bef675.js",
    "cb211fadccb029c7.js",
    "ce968fcdf3a1987c.js",
    "db3c01738aaf0b92.js",
    "e1387fe892984e2b.js",
    "e71c1d5f0b6b833c.js",
    "e8ea384458526db0.js",
    // We don't implement Annex B fully.
    "1c1e2a43fe5515b6.js",
    "3dabeca76119d501.js",
    "52aeec7b8da212a2.js",
    "59ae0289778b80cd.js",
    "a4d62a651f69d815.js",
    "c06df922631aeabc.js",
    // swc_common issue - `\r` should be treated as a newline
    "be2c3fff6426873e.js",
    "db66e1e8f3f1faef.js",
    "a7b8ce1d4c0f0bc2.js",
    "6498dcc494193cb4.js",
    "6a240463b40550d2.js",
    // TODO: (maybe) fix span of `,`
    "641ac9060a206183.js",
    "e4cef19dab44335a.js",
    "a6806d6fedbf6759.js",
    "2dc0ded5a1bff643.js",
    "547fa50af16beca7.js",
    "547fa50af16beca7.js",
    "8c8a7a2941fb6d64.js",
    "9e98dbfde77e3dfe.js",
    "d9eb39b11bc766f4.js",
    "f9888fa1a1e366e7.js",
    "78cf02220fb0937c.js",
    "5e7ca8611aaa4d53.js",
    // TODO(kdy1): Non-ascii char count
    "58cb05d17f7ec010.js",
    "4d2c7020de650d40.js",
    "dafb7abe5b9b44f5.js",
    // Our one is better
    "1efde9ddd9d6e6ce.module.js",
    "d010d377bcfd5565.js",
    "ce0aaec02d5d4465.js",
    "edd1f39f90576180.js",
    "290fdc5a2f826ead.js",
    "e71a91c61343cdb1.js",
    "409f30dc7efe75d5.js",
    "03608b6e222ae700.js",
    "e54c1a2fc15cd4b8.js",
    "e08e181172bad2b1.js",
    "cc793d44a11617e7.js",
    "54e70df597a4f9a3.js",
    "efef19e06f58fdd9.js",
    "e0fc2148b455a6be.js",
    "10857a84ed2962f1.js",
    "d7c7ff252e84e81d.js",
    "0aa6aab640155051.js",
    "c80d9415dde647cd.js",
    "09e84f25af85b836.js",
    "ce8c443eb361e1a2.js",
    "affd557fd820e1f2.js",
    "ec99a663d6f3983d.js",
    "01fd8e8a0a42307b.js",
    "e01c7172cf204b92.js",
    "12d5bedf1812952a.js",
    "df20c9b7a7d534cb.js",
    "c767fa4d683aa3ce.js",
    "bf8ffad512a5f568.js",
    "c8513472857eae9c.js",
    "b86b0122e80c330e.js",
    "aa7e721756949024.js",
    "a830df7cf2e74c9f.js",
    "845631d1a33b3409.js",
    "066b76285ce79182.js",
    "fe2d3b945530c806.js",
    "bd28a7d19ac0d50b.js",
    "06c7efc128ce74a0.js",
    "075c7204d0b0af60.js",
    "0827a8316cca777a.js",
    "b9a0cb6df76a73d2.js",
    "bf210a4f0cf9e352.js",
    "6edc155d463535cb.js",
    "b8f8dfc41df97add.js",
    "b549d045fc8e93bf.js",
    "e42f306327c0f578.js",
    "9a9cb616daadf90a.js",
    "d2ae1c7b6e55143f.js",
    "a445a478b4ce0c58.js",
    "0d137e8a97ffe083.js",
    "b7a6a807ae6db312.js",
    "bb8b546cf9db5996.js",
    "50ac15a08f7c812f.js",
    "a2cb5a14559c6a50.js",
    "bbff5671643cc2ea.js",
    "c2f12d66ce17d5ab.js",
    "13045bfdda0434e0.js",
    "10d6486502949e74.js",
    "119e9dce4feae643.js",
    "1223609b0f7a2129.js",
    "177fef3d002eb873.js",
    "19ffea7e9e887e08.js",
    "1c6c67fcd71f2d08.js",
    "1cdce2d337e64b4f.js",
    "1f039e0eeb1bc271.js",
    "227118dffd2c9935.js",
    "250ced8c8e83b389.js",
    "a2798917405b080b.js",
    "ad6bf12aa7eda975.js",
    "24fa28a37061a18f.js",
    "252bb992a448270e.js",
    "285648c16156804f.js",
    "2d10fed2af94fbd1.js",
    "3097f73926c93640.js",
    "30aee1020fc69090.js",
    "312f85fecc352681.js",
    "317532451c2ce8ff.js",
    "32b635a9667a9fb1.js",
    "36224cf8215ad8e4.js",
    "37e4a6eca1ece7e5.js",
    "38284ea2d9914d86.js",
    "3b57183c81070eec.js",
    "3bbd75d597d54fe6.js",
    "3c1e2ada0ac2b8e3.js",
    "3e1a6f702041b599.js",
    "3e3a99768a4a1502.js",
    "3e69c5cc1a7ac103.js",
    "3eac36e29398cdc5.js",
    "3ff52d86c77678bd.js",
    "43023cd549deee77.js",
    "44af28febe2288cc.js",
    "478ede4cfe7906d5.js",
    "4869454dd215468e.js",
    "48b6f8ce65d3b3ee.js",
    "4c71e11fbbc56349.js",
    "4d833cbc56caaaf9.js",
    "4e7c58761e24d77c.js",
    "4e7c58761e24d77c.js",
    "5641ad33abcd1752.js",
    "587400d1c019785a.js",
    "58ed6ffb30191684.js",
    "5b8d2b991d2c1f5b.js",
    "5f730961df66e8e8.js",
    "597108fd45a6e79b.js",
    "60dcd48a3f6af44f.js",
    "62d7c1ee4e1626c4.js",
    "665f4940c7cf30c9.js",
    "64cc57f82a54b7fb.js",
    "66d2dbcb692491ec.module.js",
    "697b3d30c1d06918.js",
    "698a8cfb0705c277.js",
    "69bbdc7c34ed23cc.js",
    "6a323491fe75918a.js",
    "6b76b8761a049c19.js",
    "70bf2c409480ae10.js",
    "74c5ebda713c8bd7.js",
    "75172741c27c7703.js",
    "753a8b016a700975.js",
    "77c661b2fbe3dd3a.js",
    "784a059faa166072.js",
    "7855fbf5ea10e622.js",
    "7cd7c68a6131f816.js",
    "7df2a606ecc6cd84.js",
    "7dfb625b91c5c879.js",
    "7fdf990c6f42edcd.module.js",
    "80d2351a5ae68524.js",
    "84250e15785d8a9e.js",
    "85263ecacc7a4dc5.js",
    "8628cd459b39ffe8.js",
    "870a0b8d891753e9.js",
    "8d14286a8cc6ee9d.js",
    "8d67ad04bfc356c9.js",
    "8ecaef2617d8c6a7.js",
    "918e105a2ff6c64a.js",
    "92fd8e24864fde0a.js",
    "94b8a654a87039b9.js",
    "94cb828d5dcfd136.js",
    "98df58b0c40fac90.js",
    "9949a2e1a6844836.module.js",
    "99cdfc40e20af6f5.js",
    "9a666205cafd530f.js",
    "a454d2e2ab3484e6.js",
    "a54cca69085ad35a.js",
    "a86a29773d1168d3.js",
    "b205355de22689d1.js",
    "b93d116fd0409637.js",
    "c85bc4de504befc7.js",
    "c8689b6da6fd227a.js",
    "cda499c521ff60c7.js",
    "d4b898b45172a637.js",
    "e2ac0bea41202dc9.js",
    "f01d9f3c7b2b2717.js",
    "f15772354efa5ecf.js",
    "f17ec9517a3339d9.js",
    "fa5b398eeef697a6.js",
    "fa9eaf58f51d6926.js",
    "faa4a026e1e86145.js",
    "fada2c7bbfabe14a.js",
    "fb8db7a71f3755fc.js",
    "fbde237f11796df9.js",
    "fd5ea844fcc07d3d.js",
    "6c5f0dd83c417a5a.js",
    "78eb22badc114b6f.js",
    "7afd38d79e6795a8.js",
    "80950061e291542b.js",
    "8a0fc8ea31727188.module.js",
    "af97a3752e579223.js",
    "bbffb851469a3f0e.js",
    "bc302492d441d561.js",
    "be2fd5888f434cbd.js",
    "f3260491590325af.js",
    // Unicode 14 vs 15
    "046a0bb70d03d0cc.js",
    "08a39e4289b0c3f3.js",
    "300a638d978d0f2c.js",
    "44f31660bd715f05.js",
];

#[testing::fixture("../swc_ecma_parser/tests/test262-parser/pass/*.js")]
fn identity(entry: PathBuf) {
    let file_name = entry
        .file_name()
        .unwrap()
        .to_str()
        .expect("to_str() failed")
        .to_string();

    let input = read_to_string(&entry).unwrap();

    let ignore = IGNORED_PASS_TESTS.contains(&&*file_name);

    if ignore {
        return;
    }

    let is_module = file_name.contains("module");

    let msg = format!("\n\n========== Running codegen test {file_name}\nSource:\n{input}\n");
    let mut wr = std::vec::Vec::new();

    ::testing::run_test(false, |cm, handler| {
        let fm = cm.load_file(&entry).expect("failed to load file");
        eprintln!(
            "{}\nPos: {:?} ~ {:?} (L{})",
            msg,
            fm.start_pos,
            fm.end_pos,
            fm.count_lines()
        );
        let (expected_code, expected_map, visualizer_url_for_expected) =
            match get_expected(&fm.src, is_module) {
                Some(v) => v,
                None => return Ok(()),
            };
        println!("Expected code:\n{expected_code}");
        let expected_tokens = print_source_map(&expected_map);

        let comments = SingleThreadedComments::default();
        let lexer = Lexer::new(
            Syntax::default(),
            Default::default(),
            (&*fm).into(),
            Some(&comments),
        );
        let mut parser: Parser<Lexer> = Parser::new_from(lexer);
        let mut src_map = Vec::new();

        {
            let mut wr = Box::new(swc_ecma_codegen::text_writer::JsWriter::new(
                cm.clone(),
                "\n",
                &mut wr,
                Some(&mut src_map),
            )) as Box<dyn WriteJs>;

            wr = Box::new(swc_ecma_codegen::text_writer::omit_trailing_semi(wr));

            let mut emitter = Emitter {
                cfg: swc_ecma_codegen::Config::default()
                    .with_minify(true)
                    .with_ascii_only(true)
                    .with_target(EsVersion::Es5),
                cm: cm.clone(),
                wr,
                comments: None,
            };

            // Parse source
            if is_module {
                emitter
                    .emit_module(
                        &parser
                            .parse_module()
                            .map_err(|e| e.into_diagnostic(handler).emit())?,
                    )
                    .unwrap();
            } else {
                emitter
                    .emit_script(
                        &parser
                            .parse_script()
                            .map_err(|e| e.into_diagnostic(handler).emit())?,
                    )
                    .unwrap();
            }
        }

        let actual_code = String::from_utf8(wr).unwrap();
        let actual_map =
            cm.build_source_map(&src_map, None, SourceMapConfigImpl { emit_columns: true });

        let visualizer_url_for_actual = visualizer_url(&actual_code, &actual_map);

        let actual_tokens = print_source_map(&actual_map);

        let common_tokens = actual_tokens
            .iter()
            .filter(|a| expected_tokens.contains(&**a))
            .map(|v| v.to_string())
            .collect::<HashSet<_, FxBuildHasher>>();

        let actual_tokens_diff = actual_tokens
            .iter()
            .filter(|a| !common_tokens.contains(&**a))
            .map(|v| v.to_string())
            .collect::<Vec<_>>();
        let expected_tokens_diff = expected_tokens
            .iter()
            .filter(|a| !common_tokens.contains(&**a))
            .map(|v| v.to_string())
            .collect::<Vec<_>>();
        eprintln!("---- Actual -----");
        for s in actual_tokens_diff {
            eprintln!("{s}");
        }
        eprintln!("---- Expected -----");
        for s in expected_tokens_diff {
            eprintln!("{s}");
        }

        dbg!(&src_map);

        if actual_code != expected_code {
            // Generated code is different
            // We can't ensure that identical sourcemap will mean identical code
            eprintln!("Actual code:\n{actual_code}");
            eprintln!("Expected code:\n{expected_code}");
            return Ok(());
        }

        eprintln!(
            "----- Visualizer -----\nExpected: {visualizer_url_for_expected}\nActual: \
             {visualizer_url_for_actual}"
        );

        assert_eq_same_map(&expected_map, &actual_map);
        Ok(())
    })
    .expect("failed to run test");
}

fn get_expected(code: &str, is_module: bool) -> Option<(String, SourceMap, String)> {
    let output = exec_node_js(
        include_str!("./srcmap.mjs"),
        JsExecOptions {
            cache: true,
            module: true,
            args: vec![
                code.to_string(),
                if is_module {
                    "module".into()
                } else {
                    "script".into()
                },
            ],
        },
    )
    .ok()?;

    let v = serde_json::from_str::<serde_json::Map<String, serde_json::Value>>(&output).unwrap();

    let code = v.get("code").unwrap().as_str().unwrap();
    let map = v.get("map").unwrap().as_str().unwrap();

    let map = SourceMap::from_slice(map.as_bytes()).expect("invalid sourcemap");

    let visualizer_url = visualizer_url(code, &map);

    Some((code.to_string(), map, visualizer_url))
}

fn print_source_map(map: &SourceMap) -> Vec<String> {
    let mut v = map
        .tokens()
        .map(|t| {
            format!(
                "Token: {}:{} => {}:{}",
                t.get_src_line(),
                t.get_src_col(),
                t.get_dst_line(),
                t.get_dst_col()
            )
        })
        .collect::<Vec<_>>();

    v.sort();
    v
}

fn assert_eq_same_map(expected: &SourceMap, actual: &SourceMap) {
    for expected_token in expected.tokens() {
        let actual_token = actual
            .lookup_token(expected_token.get_dst_line(), expected_token.get_dst_col())
            .unwrap_or_else(|| panic!("token not found: {expected_token:?}"));

        if expected_token.get_src_line() == 0 && expected_token.get_src_col() == 0 {
            continue;
        }

        assert_eq!(
            expected_token.get_src_line(),
            actual_token.get_src_line(),
            "line mismatch at {}:{}",
            expected_token.get_dst_line(),
            expected_token.get_dst_col()
        );
        assert_eq!(
            expected_token.get_src_col(),
            actual_token.get_src_col(),
            "col mismatch at {}:{}",
            expected_token.get_dst_line(),
            expected_token.get_dst_col()
        );
    }
}

/// Creates a url for https://evanw.github.io/source-map-visualization/
fn visualizer_url(code: &str, map: &SourceMap) -> String {
    let map = {
        let mut buf = std::vec::Vec::new();
        map.to_writer(&mut buf).unwrap();
        String::from_utf8(buf).unwrap()
    };

    let code_len = format!("{}\0", code.len());
    let map_len = format!("{}\0", map.len());
    let hash = BASE64_STANDARD.encode(format!("{code_len}{code}{map_len}{map}"));

    format!("https://evanw.github.io/source-map-visualization/#{hash}")
}

struct SourceMapConfigImpl {
    emit_columns: bool,
}

impl SourceMapGenConfig for SourceMapConfigImpl {
    fn file_name_to_source(&self, f: &swc_common::FileName) -> String {
        f.to_string()
    }

    fn inline_sources_content(&self, _: &swc_common::FileName) -> bool {
        true
    }

    fn emit_columns(&self, _: &swc_common::FileName) -> bool {
        self.emit_columns
    }
}
