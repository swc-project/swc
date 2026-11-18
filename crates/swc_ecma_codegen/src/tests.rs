use std::path::PathBuf;

use ascii::AsciiChar;
use swc_common::{comments::SingleThreadedComments, FileName, SourceMap};
use swc_ecma_parser;
use swc_ecma_testing::{exec_node_js, JsExecOptions};
use testing::DebugUsingDisplay;

use self::swc_ecma_parser::{EsSyntax, Parser, StringInput, Syntax};
use super::*;
use crate::{lit::get_quoted_utf16, text_writer::omit_trailing_semi};

struct Builder {
    cfg: Config,
    cm: Lrc<SourceMap>,
    comments: SingleThreadedComments,
}

impl Builder {
    pub fn with<'a, F, Ret>(self, _: &str, s: &'a mut std::vec::Vec<u8>, op: F) -> Ret
    where
        F: for<'aa> FnOnce(&mut Emitter<'aa, Box<dyn WriteJs + 'aa>, SourceMap>) -> Ret,
        Ret: 'static,
    {
        let writer = text_writer::JsWriter::new(self.cm.clone(), "\n", s, None);
        let writer: Box<dyn WriteJs> = if self.cfg.minify {
            Box::new(omit_trailing_semi(writer))
        } else {
            Box::new(writer)
        };

        {
            let mut e = Emitter {
                cfg: self.cfg,
                cm: self.cm.clone(),
                wr: writer,
                comments: Some(&self.comments),
            };

            op(&mut e)
        }
    }

    pub fn text<F>(self, src: &str, op: F) -> String
    where
        F: for<'aa> FnOnce(&mut Emitter<'aa, Box<dyn WriteJs + 'aa>, SourceMap>),
    {
        let mut buf = std::vec::Vec::new();

        self.with(src, &mut buf, op);

        String::from_utf8(buf).unwrap()
    }
}

fn parse_then_emit(from: &str, cfg: Config, syntax: Syntax) -> String {
    ::testing::run_test(false, |cm, handler| {
        let src = cm.new_source_file(FileName::Real("custom.js".into()).into(), from.to_string());
        println!(
            "--------------------\nSource: \n{}\nPos: {:?} ~ {:?}\n",
            from, src.start_pos, src.end_pos
        );

        let comments = Default::default();
        let res = {
            let mut parser = Parser::new(syntax, StringInput::from(&*src), Some(&comments));
            let res = parser
                .parse_module()
                .map_err(|e| e.into_diagnostic(handler).emit());

            for err in parser.take_errors() {
                err.into_diagnostic(handler).emit()
            }

            res?
        };

        let out = Builder { cfg, cm, comments }.text(from, |e| res.emit_with(e).unwrap());
        Ok(out)
    })
    .unwrap()
}

#[track_caller]
pub(crate) fn assert_min(from: &str, to: &str) {
    let out = parse_then_emit(
        from,
        Config {
            minify: true,
            target: EsVersion::latest(),
            omit_last_semi: true,
            ..Default::default()
        },
        Syntax::Es(Default::default()),
    );

    assert_eq!(DebugUsingDisplay(out.trim()), DebugUsingDisplay(to),);
}

#[track_caller]
pub(crate) fn assert_min_target(from: &str, to: &str, target: EsVersion) {
    let out = parse_then_emit(
        from,
        Config {
            minify: true,
            omit_last_semi: true,
            target,
            ..Default::default()
        },
        Syntax::default(),
    );

    assert_eq!(DebugUsingDisplay(out.trim()), DebugUsingDisplay(to),);
}

/// Clone of the regular `assert_min` function but with TypeScript syntax.
#[track_caller]
pub(crate) fn assert_min_typescript(from: &str, to: &str) {
    let out = parse_then_emit(
        from,
        Config {
            minify: true,
            omit_last_semi: true,
            target: EsVersion::latest(),
            ..Default::default()
        },
        Syntax::Typescript(Default::default()),
    );

    assert_eq!(DebugUsingDisplay(out.trim()), DebugUsingDisplay(to),);
}

pub(crate) fn assert_pretty(from: &str, to: &str) {
    let out = parse_then_emit(
        from,
        Config {
            minify: false,
            target: EsVersion::latest(),
            ..Default::default()
        },
        Syntax::default(),
    );

    println!("Expected: {to:?}");
    println!("Actual:   {out:?}");
    assert_eq!(DebugUsingDisplay(out.trim()), DebugUsingDisplay(to),);
}

#[track_caller]
fn test_from_to(from: &str, expected: &str) {
    let out = parse_then_emit(
        from,
        Config {
            target: EsVersion::latest(),
            ..Default::default()
        },
        Syntax::default(),
    );

    dbg!(&out);
    dbg!(&expected);

    assert_eq!(
        DebugUsingDisplay(out.trim()),
        DebugUsingDisplay(expected.trim()),
    );
}

fn test_identical(from: &str) {
    test_from_to(from, from)
}

fn constructed_number(value: f64, raw: Option<&str>) -> Box<Expr> {
    Box::new(Expr::Lit(Lit::Num(Number {
        span: DUMMY_SP,
        value,
        raw: raw.map(Atom::from),
    })))
}

fn constructed_ident(sym: &str) -> Box<Expr> {
    Box::new(Expr::Ident(Ident::new_no_ctxt(sym.into(), DUMMY_SP)))
}

fn constructed_binary(op: BinaryOp, left: Box<Expr>, right: Box<Expr>) -> Expr {
    Expr::Bin(BinExpr {
        span: DUMMY_SP,
        op,
        left,
        right,
    })
}

fn emit_constructed_node<N>(node: &N, minify: bool) -> String
where
    N: Node,
{
    ::testing::run_test(false, |cm, _| {
        let comments = Default::default();
        let output = Builder {
            cfg: Config {
                minify,
                ..Default::default()
            },
            cm,
            comments,
        }
        .text("", |emitter| node.emit_with(emitter).unwrap());

        Ok(output)
    })
    .unwrap()
}

fn assert_valid_constructed_expr(code: &str, syntax: Syntax) {
    let source = format!("const value = {code};");
    parse_then_emit(&source, Default::default(), syntax);
}

#[test]
fn emit_non_finite_number_literals() {
    let cases = [
        (f64::NAN, "0 / 0", "0/0"),
        (f64::INFINITY, "1 / 0", "1/0"),
        (f64::NEG_INFINITY, "-1 / 0", "-1/0"),
    ];

    for (value, readable, minified) in cases {
        let readable_output = emit_constructed_node(&*constructed_number(value, None), false);
        let minified_output = emit_constructed_node(&*constructed_number(value, None), true);

        assert_eq!(readable_output, readable);
        assert_eq!(minified_output, minified);
        assert_valid_constructed_expr(&readable_output, Syntax::default());
        assert_valid_constructed_expr(&minified_output, Syntax::default());
    }

    assert_eq!(
        emit_constructed_node(&*constructed_number(f64::INFINITY, Some("1e999")), false),
        "1e999"
    );
    assert_eq!(
        emit_constructed_node(&*constructed_number(f64::INFINITY, Some("1e999")), true),
        "1/0"
    );
    assert_eq!(
        emit_constructed_node(&*constructed_number(f64::NAN, Some("NaN")), false),
        "NaN"
    );
    assert_eq!(
        emit_constructed_node(&*constructed_number(f64::NAN, Some("NaN")), true),
        "0/0"
    );
    assert_eq!(
        emit_constructed_node(&*constructed_number(f64::INFINITY, Some("Infinity")), false),
        "Infinity"
    );
    assert_eq!(
        emit_constructed_node(&*constructed_number(f64::INFINITY, Some("Infinity")), true),
        "1/0"
    );

    let property_name = PropName::Num(Number {
        span: DUMMY_SP,
        value: f64::NAN,
        raw: None,
    });
    assert_eq!(emit_constructed_node(&property_name, true), "NaN");
}

#[test]
fn emit_non_finite_number_precedence() {
    let ident = || constructed_ident("x");
    let infinity = || constructed_number(f64::INFINITY, None);

    let cases = [
        (
            constructed_binary(op!(bin, "+"), infinity(), ident()),
            "1 / 0 + x",
            "1/0+x",
        ),
        (
            constructed_binary(op!("*"), infinity(), ident()),
            "1 / 0 * x",
            "1/0*x",
        ),
        (
            constructed_binary(op!("*"), ident(), infinity()),
            "x * 2e308",
            "x*2e308",
        ),
        (
            constructed_binary(op!("/"), ident(), infinity()),
            "x / 2e308",
            "x/2e308",
        ),
        (
            constructed_binary(op!("**"), infinity(), ident()),
            "2e308 ** x",
            "2e308**x",
        ),
        (
            constructed_binary(op!("**"), ident(), infinity()),
            "x ** 2e308",
            "x**2e308",
        ),
    ];

    for (expr, readable, minified) in cases {
        for (minify, expected) in [(false, readable), (true, minified)] {
            let output = emit_constructed_node(&expr, minify);
            assert_eq!(output, expected);
            assert_valid_constructed_expr(&output, Syntax::default());
        }
    }

    let not_nan = Expr::Unary(UnaryExpr {
        span: DUMMY_SP,
        op: op!("!"),
        arg: constructed_number(f64::NAN, None),
    });
    assert_eq!(emit_constructed_node(&not_nan, false), "!(0 / 0)");
    assert_eq!(emit_constructed_node(&not_nan, true), "!(0/0)");

    let await_infinity = Expr::Await(AwaitExpr {
        span: DUMMY_SP,
        arg: infinity(),
    });
    assert_eq!(emit_constructed_node(&await_infinity, false), "await 2e308");
    assert_eq!(emit_constructed_node(&await_infinity, true), "await 2e308");

    let divide_by_infinity =
        constructed_binary(op!("/"), constructed_number(1.0, None), infinity());
    let divide_by_infinity = emit_constructed_node(&divide_by_infinity, true);
    let not_nan = emit_constructed_node(&not_nan, true);
    let code = format!("console.log({divide_by_infinity}, {not_nan})");
    assert_eq!(run_node(&code), "0 true\n");
}

#[test]
fn emit_non_finite_number_postfix_contexts() {
    let member = |value| {
        Expr::Member(MemberExpr {
            span: DUMMY_SP,
            obj: constructed_number(value, None),
            prop: MemberProp::Ident(IdentName::new("x".into(), DUMMY_SP)),
        })
    };

    assert_eq!(emit_constructed_node(&member(f64::NAN), false), "(0 / 0).x");
    assert_eq!(
        emit_constructed_node(&member(f64::INFINITY), false),
        "2e308.x"
    );
    let raw_overflow_member = Expr::Member(MemberExpr {
        span: DUMMY_SP,
        obj: constructed_number(f64::INFINITY, Some("2e308")),
        prop: MemberProp::Ident(IdentName::new("x".into(), DUMMY_SP)),
    });
    assert_eq!(
        emit_constructed_node(&raw_overflow_member, false),
        "2e308.x"
    );
    assert_eq!(
        emit_constructed_node(&member(f64::NEG_INFINITY), false),
        "(-1 / 0).x"
    );
    assert_eq!(
        emit_constructed_node(&member(f64::INFINITY), true),
        "2e308.x"
    );

    let call = Expr::Call(CallExpr {
        span: DUMMY_SP,
        ctxt: Default::default(),
        callee: Callee::Expr(constructed_number(f64::INFINITY, None)),
        args: vec![],
        type_args: None,
    });
    let call_output = emit_constructed_node(&call, true);
    assert_eq!(call_output, "2e308()");
    assert_valid_constructed_expr(&call_output, Syntax::default());

    let optional_member = Expr::OptChain(OptChainExpr {
        span: DUMMY_SP,
        optional: true,
        base: Box::new(OptChainBase::Member(MemberExpr {
            span: DUMMY_SP,
            obj: constructed_number(f64::INFINITY, None),
            prop: MemberProp::Ident(IdentName::new("x".into(), DUMMY_SP)),
        })),
    });
    let optional_member_output = emit_constructed_node(&optional_member, true);
    assert_eq!(optional_member_output, "2e308?.x");
    assert_valid_constructed_expr(&optional_member_output, Syntax::default());

    let new = Expr::New(NewExpr {
        span: DUMMY_SP,
        ctxt: Default::default(),
        callee: constructed_number(f64::INFINITY, None),
        args: None,
        type_args: None,
    });
    let new_output = emit_constructed_node(&new, true);
    assert_eq!(new_output, "new 2e308");
    assert_valid_constructed_expr(&new_output, Syntax::default());

    let tagged = Expr::TaggedTpl(TaggedTpl {
        span: DUMMY_SP,
        ctxt: Default::default(),
        tag: constructed_number(f64::INFINITY, None),
        type_params: None,
        tpl: Box::new(Tpl {
            span: DUMMY_SP,
            exprs: vec![],
            quasis: vec![TplElement {
                span: DUMMY_SP,
                tail: true,
                cooked: None,
                raw: "".into(),
            }],
        }),
    });
    let tagged_output = emit_constructed_node(&tagged, true);
    assert_eq!(tagged_output, "2e308``");
    assert_valid_constructed_expr(&tagged_output, Syntax::default());

    let class = Expr::Class(ClassExpr {
        ident: None,
        class: Box::new(Class {
            super_class: Some(constructed_number(f64::INFINITY, None)),
            ..Default::default()
        }),
    });
    let class_output = emit_constructed_node(&class, true);
    assert_eq!(class_output, "class extends 2e308{}");
    assert_valid_constructed_expr(&class_output, Syntax::default());
}

#[test]
fn emit_non_finite_number_typescript_contexts() {
    let type_ann = || {
        Box::new(TsType::TsKeywordType(TsKeywordType {
            span: DUMMY_SP,
            kind: TsKeywordTypeKind::TsAnyKeyword,
        }))
    };

    let assertion = Expr::TsTypeAssertion(TsTypeAssertion {
        span: DUMMY_SP,
        expr: constructed_number(f64::INFINITY, None),
        type_ann: type_ann(),
    });
    assert_eq!(emit_constructed_node(&assertion, true), "<any>2e308");

    let non_null = Expr::TsNonNull(TsNonNullExpr {
        span: DUMMY_SP,
        expr: constructed_number(f64::INFINITY, None),
    });
    assert_eq!(emit_constructed_node(&non_null, true), "2e308!");

    let instantiation = Expr::TsInstantiation(TsInstantiation {
        span: DUMMY_SP,
        expr: constructed_number(f64::INFINITY, None),
        type_args: Box::new(TsTypeParamInstantiation {
            span: DUMMY_SP,
            params: vec![type_ann()],
        }),
    });
    assert_eq!(emit_constructed_node(&instantiation, true), "2e308<any>");

    let number_type = TsType::TsLitType(TsLitType {
        span: DUMMY_SP,
        lit: TsLit::Number(Number {
            span: DUMMY_SP,
            value: f64::NAN,
            raw: None,
        }),
    });
    assert_eq!(emit_constructed_node(&number_type, true), "NaN");

    for output in [
        emit_constructed_node(&assertion, true),
        emit_constructed_node(&non_null, true),
        emit_constructed_node(&instantiation, true),
    ] {
        assert_valid_constructed_expr(&output, Syntax::Typescript(Default::default()));
    }
}

fn test_from_to_custom_config(from: &str, to: &str, cfg: Config, syntax: Syntax) {
    let out = parse_then_emit(
        from,
        Config {
            omit_last_semi: true,
            ..cfg
        },
        syntax,
    );

    assert_eq!(DebugUsingDisplay(out.trim()), DebugUsingDisplay(to.trim()),);
}

#[test]
fn empty_stmt() {
    test_from_to(";", ";");
}

#[test]
fn comment_1() {
    test_from_to(
        "// foo
a",
        "// foo
a;",
    );
}

#[test]
fn comment_2() {
    test_from_to("a // foo", "a; // foo");
}

#[test]
fn comment_3() {
    test_from_to(
        "// foo
// bar
a
// foo
b // bar",
        "// foo\n// bar\na;\n// foo\nb; // bar",
    );
}

#[test]
fn comment_4() {
    test_from_to("/** foo */ a", "/** foo */ a;");
}

#[test]
fn comment_5() {
    test_from_to(
        "// foo
// bar
a",
        "// foo
// bar
a;",
    );
}

#[test]
fn no_octal_escape() {
    test_from_to(
        r"'\x00a';
'\x000';
'\x001';
'\x009'",
        r"'\x00a';
'\x000';
'\x001';
'\x009';",
    );
}

#[test]
fn empty_named_export() {
    test_from_to("export { }", "export { };");
}

#[test]
fn empty_named_export_min() {
    test_from_to_custom_config(
        "export { }",
        "export{}",
        Config {
            minify: true,
            ..Default::default()
        },
        Default::default(),
    );
}

#[test]
fn empty_named_export_from() {
    test_from_to("export { } from 'foo';", "export { } from 'foo';");
}

#[test]
fn empty_named_export_from_min() {
    test_from_to_custom_config(
        "export { } from 'foo';",
        "export{}from\"foo\"",
        Config {
            minify: true,
            ..Default::default()
        },
        Default::default(),
    );
}

#[test]
fn named_export_from() {
    test_from_to("export { bar } from 'foo';", "export { bar } from 'foo';");
}

#[test]
fn named_export_from_min() {
    test_from_to_custom_config(
        "export { bar } from 'foo';",
        "export{bar}from\"foo\"",
        Config {
            minify: true,
            ..Default::default()
        },
        Default::default(),
    );
}

#[test]
fn export_namespace_from() {
    test_from_to_custom_config(
        "export * as Foo from 'foo';",
        "export * as Foo from 'foo';",
        Default::default(),
        Syntax::Es(EsSyntax::default()),
    );
}

#[test]
fn export_namespace_from_min() {
    test_from_to_custom_config(
        "export * as Foo from 'foo';",
        "export*as Foo from\"foo\"",
        Config {
            minify: true,
            ..Default::default()
        },
        Syntax::Es(EsSyntax::default()),
    );
}

#[test]
fn named_and_namespace_export_from() {
    test_from_to_custom_config(
        "export * as Foo, { bar } from 'foo';",
        "export * as Foo, { bar } from 'foo';",
        Default::default(),
        Syntax::Es(EsSyntax {
            export_default_from: true,
            ..EsSyntax::default()
        }),
    );
}

#[test]
fn named_and_namespace_export_from_min() {
    test_from_to_custom_config(
        "export * as Foo, { bar } from 'foo';",
        "export*as Foo,{bar}from\"foo\"",
        Config {
            minify: true,
            ..Default::default()
        },
        Syntax::Es(EsSyntax {
            export_default_from: true,
            ..EsSyntax::default()
        }),
    );
}

#[test]
fn issue_450() {
    test_from_to(
        r"console.log(`
\`\`\`html
<h1>It works!</h1>
\`\`\`
`);",
        "console.log(`\n\\`\\`\\`html\n<h1>It works!</h1>\n\\`\\`\\`\n`);",
    );
}

#[test]
fn issue_546() {
    test_from_to(
        "import availabilities, * as availabilityFunctions from 'reducers/availabilities';",
        "import availabilities, * as availabilityFunctions from 'reducers/availabilities';",
    );
}

#[test]
fn issue_637() {
    test_from_to(
        r"`\
`;", r"`\
`;",
    );
}

#[test]
fn issue_639() {
    test_from_to(r"`\x1b[33m Yellow \x1b[0m`;", r"`\x1b[33m Yellow \x1b[0m`;");
}

#[test]
fn issue_910() {
    test_from_to(
        "console.log(\"Hello World\");",
        "console.log(\"Hello World\");",
    );

    test_from_to("console.log('Hello World');", "console.log('Hello World');");

    test_from_to(
        "console.log(\"Hello\\\" World\");",
        "console.log(\"Hello\\\" World\");",
    );

    test_from_to(
        "console.log('Hello\\' World');",
        "console.log('Hello\\' World');",
    );
}

#[test]
fn tpl_1() {
    test_from_to(
        "`id '${id}' must be a non-empty string`;",
        "`id '${id}' must be a non-empty string`;",
    )
}

#[test]
fn tpl_2() {
    test_from_to(
        "`${Module.wrapper[0]}${script}${Module.wrapper[1]}`",
        "`${Module.wrapper[0]}${script}${Module.wrapper[1]}`;",
    );
}

#[test]
fn tpl_escape_1() {
    test_from_to(
        "`${parent.path}\x00${request}`",
        "`${parent.path}\x00${request}`;",
    )
}

#[test]
fn tpl_escape_2() {
    test_from_to("`${arg}\0`", "`${arg}\0`;");
}

#[test]
fn tpl_escape_3() {
    test_from_to(
        r"`${resolvedDevice.toLowerCase()}\\`",
        r"`${resolvedDevice.toLowerCase()}\\`;",
    );
}

#[test]
fn tpl_escape_4() {
    test_from_to(
        r"`\\\\${firstPart}\\${path.slice(last)}`",
        r"`\\\\${firstPart}\\${path.slice(last)}`;",
    );
}

#[test]
fn tpl_escape_5() {
    test_from_to(
        r"const data = text.encode(`${arg}\0`);",
        r"const data = text.encode(`${arg}\0`);",
    );
}

#[test]
fn tpl_escape_6() {
    let from = r#"export class MultipartReader {
    newLine = encoder.encode("\r\n");
    newLineDashBoundary = encoder.encode(`\r\n--${this.boundary}`);
    dashBoundaryDash = encoder.encode(`--${this.boundary}--`);
}"#;
    let to = r#"export class MultipartReader {
    newLine = encoder.encode("\r\n");
    newLineDashBoundary = encoder.encode(`\r\n--${this.boundary}`);
    dashBoundaryDash = encoder.encode(`--${this.boundary}--`);
}"#;

    let out = parse_then_emit(
        from,
        Config {
            target: EsVersion::latest(),
            ..Default::default()
        },
        Syntax::Typescript(Default::default()),
    );
    assert_eq!(DebugUsingDisplay(out.trim()), DebugUsingDisplay(to.trim()),);
}

#[test]
fn issue_915_1() {
    test_identical(r"relResolveCacheIdentifier = `${parent.path}\x00${request}`;");
}

#[test]
fn issue_915_2() {
    test_identical(r"relResolveCacheIdentifier = `${parent.path}\x00${request}`;");
}

#[test]
fn issue_915_3() {
    test_identical(r#"encoder.encode("\\r\\n");"#);
}

#[test]
fn issue_915_4() {
    test_identical(r"`\\r\\n--${this.boundary}`;");
}

#[test]
fn jsx_1() {
    test_from_to_custom_config(
        "<Foo title=\"name\" desc=\"<empty>\" bool it>foo</Foo>;",
        "<Foo title=\"name\" desc=\"<empty>\" bool it>foo</Foo>;",
        Default::default(),
        Syntax::Es(EsSyntax {
            jsx: true,
            ..Default::default()
        }),
    );
}

#[test]
fn deno_8162() {
    test_from_to(
        r#""\x00\r\n\x85\u2028\u2029";"#,
        r#""\x00\r\n\x85\u2028\u2029";"#,
    );
}

#[test]
fn integration_01() {
    test_from_to(
        r#"
    `Unexpected ${unexpectedKeys.length > 1 ? 'keys' : 'key'} ` +
    `"${unexpectedKeys.join('", "')}" found in ${argumentName}. ` +
    `Expected to find one of the known reducer keys instead: ` +
    `"${reducerKeys.join('", "')}". Unexpected keys will be ignored.`
    "#,
        "
    `Unexpected ${unexpectedKeys.length > 1 ? 'keys' : 'key'} ` + `\"${unexpectedKeys.join('\", \
         \"')}\" found in ${argumentName}. ` + `Expected to find one of the known reducer keys \
         instead: ` + `\"${reducerKeys.join('\", \"')}\". Unexpected keys will be ignored.`;
        ",
    );
}

#[test]
fn integration_01_reduced_01() {
    test_from_to(
        r#"
    `Unexpected ${unexpectedKeys.length > 1 ? 'keys' : 'key'} ` +
    `"${unexpectedKeys.join('", "')}" found in ${argumentName}. `
    "#,
        "
    `Unexpected ${unexpectedKeys.length > 1 ? 'keys' : 'key'} ` + `\"${unexpectedKeys.join('\", \
         \"')}\" found in ${argumentName}. `;",
    );
}

#[test]
fn deno_8541_1() {
    test_from_to(
        "React.createElement('span', null, '\\u{b7}');",
        "React.createElement('span', null, '\\u{b7}');",
    );
}

#[test]
fn deno_8925() {
    assert_pretty("const 𝒫 = 2;", "const 𝒫 = 2;");
}

#[test]
#[ignore = "Tested by a bundler test"]
fn deno_9620() {
    assert_pretty(
        "const content = `--------------------------366796e1c748a2fb\r
Content-Disposition: form-data; name=\"payload\"\r
Content-Type: text/plain\r
\r
CONTENT\r
--------------------------366796e1c748a2fb--`",
        "`const content = `--------------------------366796e1c748a2fb\\r\\nContent-Disposition: \
         form-data; name=\"payload\"\\r\\nContent-Type: \
         text/plain\\r\\n\\r\\nCONTENT\\r\\n--------------------------366796e1c748a2fb--`;",
    );
}

#[test]
fn test_get_quoted_utf16() {
    fn combine((quote_char, s): (AsciiChar, CowStr<'_>)) -> String {
        let mut new = String::with_capacity(s.len() + 2);
        new.push(quote_char.as_char());
        new.push_str(s.as_ref());
        new.push(quote_char.as_char());
        new
    }

    #[track_caller]
    fn es2020(src: &str, expected: &str) {
        assert_eq!(
            combine(get_quoted_utf16(src.into(), true, EsVersion::Es2020)),
            expected
        )
    }

    #[track_caller]
    fn es2020_nonascii(src: &str, expected: &str) {
        assert_eq!(
            combine(get_quoted_utf16(src.into(), true, EsVersion::Es2020)),
            expected
        )
    }

    #[track_caller]
    fn es5(src: &str, expected: &str) {
        assert_eq!(
            combine(get_quoted_utf16(src.into(), true, EsVersion::Es5)),
            expected
        )
    }

    es2020("abcde", "\"abcde\"");
    es2020(
        "\x00\r\n\u{85}\u{2028}\u{2029};",
        "\"\\0\\r\\n\\x85\\u2028\\u2029;\"",
    );

    es2020("\n", "\"\\n\"");
    es2020("\t", "\"\t\"");

    es2020("'string'", "\"'string'\"");

    es2020("\u{0}", "\"\\0\"");
    es2020("\u{1}", "\"\\x01\"");

    es2020("\u{1000}", "\"\\u1000\"");
    es2020("\u{ff}", "\"\\xff\"");
    es2020("\u{10ffff}", "\"\\u{10FFFF}\"");
    es2020("😀", "\"\\u{1F600}\"");
    es2020("ퟻ", "\"\\uD7FB\"");

    es2020_nonascii("\u{FEFF}abc", "\"\\uFEFFabc\"");
    es2020_nonascii("\u{10ffff}", "\"\\u{10FFFF}\"");

    es5("\u{FEFF}abc", "\"\\uFEFFabc\"");
    es5("\u{10ffff}", "\"\\uDBFF\\uDFFF\"");
    es5("\u{FFFF}", "\"\\uFFFF\"");
    es5("😀", "\"\\uD83D\\uDE00\"");
    es5("ퟻ", "\"\\uD7FB\"");
}

#[test]
fn deno_8541_2() {
    test_from_to(
        "React.createElement('span', null, '\\u00b7');",
        "React.createElement('span', null, '\\u00b7');",
    );
}

#[test]
fn issue_1452_1() {
    assert_min("async foo => 0", "async foo=>0");
}

#[test]
fn issue_1619_1() {
    assert_min_target(
        "\"\\x00\" + \"\\x31\"",
        "\"\\0\"+\"1\"",
        EsVersion::latest(),
    );
}

#[test]
fn issue_1619_2() {
    assert_min_target(
        "\"\\x00\" + \"\\x31\"",
        "\"\\0\"+\"1\"",
        EsVersion::latest(),
    );
}

#[test]
fn issue_1619_3() {
    assert_eq!(
        &*get_quoted_utf16("\x00\x31".into(), true, EsVersion::Es3).1,
        "\\x001"
    );
}

fn check_latest(src: &str, expected: &str) {
    let actual = parse_then_emit(
        src,
        Config {
            minify: false,
            target: EsVersion::latest(),
            ..Default::default()
        },
        Default::default(),
    );
    assert_eq!(expected, actual.trim());
}

#[test]
fn invalid_unicode_in_ident() {
    check_latest("\\ud83d;", "\\uD83D;");
}

#[test]
fn test_escape_with_source_str() {
    check_latest("'\\ud83d'", "'\\ud83d';");
    check_latest(
        "'\\ud83d\\ud83d\\ud83d\\ud83d\\ud83d'",
        "'\\ud83d\\ud83d\\ud83d\\ud83d\\ud83d';",
    );
}

#[test]
fn issue_2213() {
    assert_min("a - -b * c", "a- -b*c")
}

#[test]
fn issue_3617() {
    // Convert characters to es5 compatibility code
    let from = r"// a string of all valid unicode whitespaces
    module.exports = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' +
      '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF' + '\u{a0}';";

    let expected = "// a string of all valid unicode whitespaces\nmodule.exports = \
                    '\\u0009\\u000A\\u000B\\u000C\\u000D\\u0020\\u00A0\\u1680\\u2000\\u2001\\\
                    u2002' + '\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200A\\u202F\\\
                    u205F\\u3000\\u2028\\u2029\\uFEFF' + \"\\xa0\";\n";

    let out = parse_then_emit(
        from,
        Config {
            ascii_only: true,
            target: EsVersion::Es5,
            ..Default::default()
        },
        Syntax::default(),
    );

    dbg!(&out);
    dbg!(&expected);

    assert_eq!(
        DebugUsingDisplay(out.trim()),
        DebugUsingDisplay(expected.trim()),
    );
}

#[test]
fn issue_3617_1() {
    // Print characters as is for ECMA target > 5
    let from = r"// a string of all valid unicode whitespaces
    module.exports = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' +
      '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF' + '\u{a0}';";
    let expected = r"// a string of all valid unicode whitespaces
module.exports = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' + '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF' + '\u{a0}';";

    let out = parse_then_emit(
        from,
        Config {
            target: EsVersion::Es2022,
            ..Default::default()
        },
        Syntax::default(),
    );

    dbg!(&out);
    dbg!(&expected);

    assert_eq!(
        DebugUsingDisplay(out.trim()),
        DebugUsingDisplay(expected.trim()),
    );
}

fn test_all(src: &str, expected: &str, expected_minified: &str, config: Config) {
    {
        let out = parse_then_emit(
            src,
            Config {
                minify: false,
                omit_last_semi: true,
                ..config
            },
            Syntax::default(),
        );

        dbg!(out.trim());
        dbg!(expected.trim());

        assert_eq!(
            DebugUsingDisplay(out.trim()),
            DebugUsingDisplay(expected.trim()),
        );
    }
    {
        eprintln!("> minified");
        let out = parse_then_emit(
            src,
            Config {
                minify: true,
                omit_last_semi: true,
                ..config
            },
            Syntax::default(),
        );

        dbg!(out.trim());
        dbg!(expected_minified.trim());

        assert_eq!(
            DebugUsingDisplay(out.trim()),
            DebugUsingDisplay(expected_minified.trim()),
        );
    }
}

#[test]
fn ascii_only_str_1() {
    test_all(
        "'😊❤️'",
        "'😊❤️';\n",
        r#""😊❤️""#,
        Config {
            ascii_only: false,
            target: EsVersion::Es2015,
            ..Default::default()
        },
    );
}

#[test]
fn ascii_only_str_2() {
    test_all(
        "'😊❤️'",
        r#""\u{1F60A}\u2764\uFE0F";"#,
        r#""\u{1F60A}\u2764\uFE0F""#,
        Config {
            ascii_only: true,
            ..Default::default()
        },
    );
}

#[test]
fn ascii_only_str_3() {
    test_all(
        "'\\u{1F60A}'",
        "'\\u{1F60A}';\n",
        "\"\\u{1F60A}\"",
        Config {
            ascii_only: true,
            ..Default::default()
        },
    );
}

#[test]
fn ascii_only_tpl_lit() {
    test_all(
        "`😊❤️`",
        r"`\u{1F60A}\u{2764}\u{FE0F}`;",
        r"`\u{1F60A}\u{2764}\u{FE0F}`",
        Config {
            ascii_only: true,
            ..Default::default()
        },
    );
}

#[test]
fn ascii_only_issue_7240() {
    test_all(
        r#"
        export default {
            "\u3131": '\u11B0',
        }
        "#,
        r#"
export default {
    "\u3131": '\u11B0'
};
        "#,
        r#"export default{"\u3131":"\u11B0"}"#,
        Config {
            ascii_only: true,
            ..Default::default()
        },
    );
}

#[test]
fn ascii_only_regex_1() {
    test_all(
        r"/[\w@Ø-ÞÀ-Öß-öø-ÿ]/",
        r"/[\w@Ø-ÞÀ-Öß-öø-ÿ]/;",
        r"/[\w@Ø-ÞÀ-Öß-öø-ÿ]/",
        Config {
            ascii_only: false,
            ..Default::default()
        },
    );
}

#[test]
fn ascii_only_regex_2() {
    test_all(
        r"/[\w@Ø-ÞÀ-Öß-öø-ÿ]/",
        r"/[\w@\xd8-\xde\xc0-\xd6\xdf-\xf6\xf8-\xff]/;",
        r"/[\w@\xd8-\xde\xc0-\xd6\xdf-\xf6\xf8-\xff]/",
        Config {
            ascii_only: true,
            ..Default::default()
        },
    );
}

#[test]
fn ascii_only_regex_3() {
    test_all(
        r"/[😊❤️]/g",
        r"/[😊❤️]/g;",
        r"/[😊❤️]/g",
        Config {
            ascii_only: false,
            ..Default::default()
        },
    );
}

#[test]
fn ascii_only_regex_4() {
    test_all(
        r"/[😊❤️]/g",
        r"/[\ud83d\ude0a\u2764\ufe0f]/g;",
        r"/[\ud83d\ude0a\u2764\ufe0f]/g",
        Config {
            ascii_only: true,
            ..Default::default()
        },
    );
}

#[test]
fn ascii_only_regex_5() {
    test_all(
        r"/test/",
        r"/test/;",
        r"/test/",
        Config {
            ascii_only: true,
            ..Default::default()
        },
    );
}

#[test]
fn emit_type_import_statement_named() {
    let from = r#"
      import type { X } from "y";
    "#;
    let to = r#"
      import type { X } from "y";
    "#;

    let out = parse_then_emit(
        from,
        Default::default(),
        Syntax::Typescript(Default::default()),
    );
    assert_eq!(DebugUsingDisplay(out.trim()), DebugUsingDisplay(to.trim()),);
}

#[test]
fn emit_type_import_statement_default() {
    let from = r#"
      import type X from "y";
    "#;
    let to = r#"
      import type X from "y";
    "#;

    let out = parse_then_emit(
        from,
        Default::default(),
        Syntax::Typescript(Default::default()),
    );
    assert_eq!(DebugUsingDisplay(out.trim()), DebugUsingDisplay(to.trim()),);
}

#[test]
fn emit_type_import_specifier() {
    let from = r#"
      import { type X } from "y";
    "#;
    let to = r#"
      import { type X } from "y";
    "#;

    let out = parse_then_emit(
        from,
        Default::default(),
        Syntax::Typescript(Default::default()),
    );
    assert_eq!(DebugUsingDisplay(out.trim()), DebugUsingDisplay(to.trim()),);
}

#[test]
fn issue_8491_1() {
    test_all(
        "console.log({aób: 'ó'})",
        r#"console.log({
    "a\xf3b": "\xf3"
});"#,
        r#"console.log({"a\xf3b":"\xf3"})"#,
        Config {
            ascii_only: true,
            target: EsVersion::Es5,
            ..Default::default()
        },
    );
}

#[test]
fn issue_8491_2() {
    test_all(
        "console.log({aób: 'ó'})",
        r#"console.log({
    "a\xf3b": "\xf3"
});"#,
        r#"console.log({"a\xf3b":"\xf3"})"#,
        Config {
            ascii_only: true,
            target: EsVersion::Es2015,
            ..Default::default()
        },
    );
}

#[test]
fn issue_9630() {
    test_from_to_custom_config(
        "console.log(1 / /* @__PURE__ */ something())",
        "console.log(1/ /* @__PURE__ */something())",
        Config {
            minify: true,
            ..Default::default()
        },
        Default::default(),
    );
}

#[testing::fixture("tests/str-lits/**/*.txt")]
fn test_str_lit(input: PathBuf) {
    test_str_lit_inner(input)
}

/// Print text back using `console.log`
fn run_node(code: &str) -> String {
    exec_node_js(
        code,
        JsExecOptions {
            cache: true,
            module: false,
            args: Default::default(),
        },
    )
    .expect("failed to execute node.js")
}

fn test_str_lit_inner(input: PathBuf) {
    let raw_str = std::fs::read_to_string(&*input).unwrap();
    let input_code = format!("console.log('{raw_str}')");

    let output_code = parse_then_emit(
        &input_code,
        Config::default()
            .with_target(EsVersion::latest())
            .with_minify(true),
        Syntax::default(),
    );

    let expected = run_node(&input_code);
    let actual = run_node(&output_code);

    assert_eq!(actual, expected);
}
