use self::swc_ecma_parser::{EsConfig, Parser, StringInput, Syntax};
use super::*;
use crate::config::Config;
use crate::text_writer::omit_trailing_semi;
use std::{
    fmt::{self, Debug, Display, Formatter},
    io::Write,
    sync::{Arc, RwLock},
};
use swc_common::{comments::SingleThreadedComments, FileName, SourceMap};
use swc_ecma_parser;

struct Builder {
    cfg: Config,
    cm: Lrc<SourceMap>,
    comments: SingleThreadedComments,
}

impl Builder {
    pub fn with<F, Ret>(self, src: &str, s: &mut Vec<u8>, op: F) -> Ret
    where
        F: FnOnce(&mut Emitter<'_>) -> Ret,
    {
        let writer = text_writer::JsWriter::new(self.cm.clone(), "\n", s, None);
        let writer: Box<dyn WriteJs> = if self.cfg.minify {
            Box::new(omit_trailing_semi(writer))
        } else {
            Box::new(writer)
        };

        let mut e = Emitter {
            cfg: self.cfg,
            cm: self.cm.clone(),
            wr: writer,
            comments: Some(&self.comments),
        };

        let ret = op(&mut e);

        ret
    }

    pub fn text<F>(self, src: &str, op: F) -> String
    where
        F: FnOnce(&mut Emitter<'_>),
    {
        let mut buf = vec![];

        self.with(src, &mut buf, op);

        String::from_utf8(buf).unwrap()
    }
}

fn parse_then_emit(from: &str, cfg: Config, syntax: Syntax) -> String {
    ::testing::run_test(false, |cm, handler| {
        let src = cm.new_source_file(FileName::Real("custom.js".into()), from.to_string());
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

        let out = Builder { cfg, cm, comments }.text(from, |e| e.emit_module(&res).unwrap());
        Ok(out)
    })
    .unwrap()
}

pub(crate) fn assert_min(from: &str, to: &str) {
    let out = parse_then_emit(from, Config { minify: true }, Syntax::default());

    assert_eq!(DebugUsingDisplay(out.trim()), DebugUsingDisplay(to),);
}

/// Clone of the regular `assert_min` function but with TypeScript syntax.
pub(crate) fn assert_min_typescript(from: &str, to: &str) {
    let out = parse_then_emit(
        from,
        Config { minify: true },
        Syntax::Typescript(Default::default()),
    );

    assert_eq!(DebugUsingDisplay(out.trim()), DebugUsingDisplay(to),);
}

pub(crate) fn assert_pretty(from: &str, to: &str) {
    let out = parse_then_emit(from, Config { minify: false }, Syntax::default());

    println!("Expected: {:?}", to);
    println!("Actaul:   {:?}", out);
    assert_eq!(DebugUsingDisplay(&out.trim()), DebugUsingDisplay(to),);
}

#[track_caller]
fn test_from_to(from: &str, expected: &str) {
    let out = parse_then_emit(from, Default::default(), Syntax::default());

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

fn test_from_to_custom_config(from: &str, to: &str, cfg: Config, syntax: Syntax) {
    let out = parse_then_emit(from, cfg, syntax);

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
        "// foo
// bar
a;
// foo
b; // bar",
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
        r#"'\x00a';
'\x000';
'\x001';
'\x009'"#,
        r#"'\x00a';
'\x000';
'\x001';
'\x009';"#,
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
        "export{};",
        Config { minify: true },
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
        "export{}from'foo';",
        Config { minify: true },
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
        "export{bar}from'foo';",
        Config { minify: true },
        Default::default(),
    );
}

#[test]
fn export_namespace_from() {
    test_from_to_custom_config(
        "export * as Foo from 'foo';",
        "export * as Foo from 'foo';",
        Default::default(),
        Syntax::Es(EsConfig {
            export_namespace_from: true,
            ..EsConfig::default()
        }),
    );
}

#[test]
fn export_namespace_from_min() {
    test_from_to_custom_config(
        "export * as Foo from 'foo';",
        "export*as Foo from'foo';",
        Config { minify: true },
        Syntax::Es(EsConfig {
            export_namespace_from: true,
            ..EsConfig::default()
        }),
    );
}

#[test]
fn named_and_namespace_export_from() {
    test_from_to_custom_config(
        "export * as Foo, { bar } from 'foo';",
        "export * as Foo, { bar } from 'foo';",
        Default::default(),
        Syntax::Es(EsConfig {
            export_namespace_from: true,
            ..EsConfig::default()
        }),
    );
}

#[test]
fn named_and_namespace_export_from_min() {
    test_from_to_custom_config(
        "export * as Foo, { bar } from 'foo';",
        "export*as Foo,{bar}from'foo';",
        Config { minify: true },
        Syntax::Es(EsConfig {
            export_namespace_from: true,
            ..EsConfig::default()
        }),
    );
}

#[test]
fn issue_450() {
    test_from_to(
        r#"console.log(`
\`\`\`html
<h1>It works!</h1>
\`\`\`
`);"#,
        r#"console.log(`\n\`\`\`html\n<h1>It works!</h1>\n\`\`\`\n`);"#,
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
        r#"`${resolvedDevice.toLowerCase()}\\`"#,
        r#"`${resolvedDevice.toLowerCase()}\\`;"#,
    );
}

#[test]
fn tpl_escape_4() {
    test_from_to(
        r#"`\\\\${firstPart}\\${path.slice(last)}`"#,
        r#"`\\\\${firstPart}\\${path.slice(last)}`;"#,
    );
}

#[test]
fn tpl_escape_5() {
    test_from_to(
        r#"const data = text.encode(`${arg}\0`);"#,
        r#"const data = text.encode(`${arg}\0`);"#,
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
        Default::default(),
        Syntax::Typescript(Default::default()),
    );
    assert_eq!(DebugUsingDisplay(out.trim()), DebugUsingDisplay(to.trim()),);
}

#[test]
fn issue_915_1() {
    test_identical(r#"relResolveCacheIdentifier = `${parent.path}\x00${request}`;"#);
}

#[test]
fn issue_915_2() {
    test_identical(r#"relResolveCacheIdentifier = `${parent.path}\x00${request}`;"#);
}

#[test]
fn issue_915_3() {
    test_identical(r#"encoder.encode("\\r\\n");"#);
}

#[test]
fn issue_915_4() {
    test_identical(r#"`\\r\\n--${this.boundary}`;"#);
}

#[test]
fn jsx_1() {
    test_from_to_custom_config(
        "<Foo title=\"name\" desc=\"<empty>\" bool it>foo</Foo>;",
        "<Foo title=\"name\" desc=\"<empty>\" bool it>foo</Foo>;",
        Default::default(),
        Syntax::Es(EsConfig {
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
fn dneo_8541_1() {
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
fn test_escape_without_source() {
    fn es2020(src: &str, expected: &str) {
        assert_eq!(
            super::escape_without_source(src, JscTarget::Es2020, true),
            expected
        )
    }

    es2020("abcde", "abcde");
    es2020(
        "\x00\r\n\u{85}\u{2028}\u{2029};",
        "\\0\\r\\n\\x85\\u2028\\u2029;",
    );

    es2020("\n", "\\n");
    es2020("\t", "\\t");

    es2020("'string'", "\\'string\\'");

    es2020("\u{0}", "\\0");
    es2020("\u{1}", "\\x01");

    es2020("\u{1000}", "\\u1000");
    es2020("\u{ff}", "\\xff");
    es2020("\u{10ffff}", "\\u{10ffff}");
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

#[derive(Debug, Clone)]
struct Buf(Arc<RwLock<Vec<u8>>>);
impl Write for Buf {
    fn write(&mut self, data: &[u8]) -> io::Result<usize> {
        self.0.write().unwrap().write(data)
    }

    fn flush(&mut self) -> io::Result<()> {
        self.0.write().unwrap().flush()
    }
}

#[derive(PartialEq, Eq)]
struct DebugUsingDisplay<'a>(&'a str);

impl<'a> Debug for DebugUsingDisplay<'a> {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        Display::fmt(self.0, f)
    }
}
