use swc_common::{input::StringInput, FileName, SourceMap};
use swc_es_parser::{lexer::Lexer, Error, EsSyntax, Parser, Syntax, TsSyntax};

#[derive(Clone, Copy)]
struct BenchCase {
    fixture: &'static str,
    syntax: Syntax,
    src: &'static str,
}

#[derive(Debug)]
struct ParseOutcome {
    result: Result<usize, Error>,
    recovered_errors: Vec<Error>,
}

fn parse_case(case: BenchCase) -> ParseOutcome {
    let cm = SourceMap::default();
    let fm = cm.new_source_file(FileName::Anon.into(), case.src);

    let lexer = Lexer::new(case.syntax, StringInput::from(&*fm), None);
    let mut parser = Parser::new_from(lexer);
    let parsed = parser.parse_program().map(|program| {
        program
            .store
            .program(program.program)
            .map_or(0, |value| value.body.len())
    });
    let recovered_errors = parser.take_errors();

    ParseOutcome {
        result: parsed,
        recovered_errors,
    }
}

fn render_error_context(src: &str, err: &Error) -> String {
    let offset = err.span().lo.0.saturating_sub(1) as usize;
    let bounded_offset = offset.min(src.len());

    let mut line = 1usize;
    let mut column = 1usize;
    let mut line_start = 0usize;

    for (idx, ch) in src.char_indices() {
        if idx >= bounded_offset {
            break;
        }
        if ch == '\n' {
            line += 1;
            column = 1;
            line_start = idx + ch.len_utf8();
        } else {
            column += 1;
        }
    }

    let line_end = src[line_start..]
        .find('\n')
        .map(|rel| line_start + rel)
        .unwrap_or(src.len());
    let line_text = &src[line_start..line_end];
    let caret_width = (bounded_offset.saturating_sub(line_start)).min(line_text.len());

    format!(
        "line={line}, column={column}, byte_pos={}, line_text=`{line_text}`\n{}^",
        err.span().lo.0,
        " ".repeat(caret_width)
    )
}

fn render_recovered_errors(src: &str, recovered_errors: &[Error]) -> String {
    if recovered_errors.is_empty() {
        return "recovered_errors=0".to_string();
    }

    let mut lines = vec![format!("recovered_errors={}", recovered_errors.len())];
    for (idx, err) in recovered_errors.iter().take(3).enumerate() {
        lines.push(format!(
            "  [{}] code={:?}, message={}\n{}",
            idx,
            err.code(),
            err.message(),
            render_error_context(src, err)
        ));
    }

    if recovered_errors.len() > 3 {
        lines.push(format!(
            "  ... {} additional recovered errors omitted",
            recovered_errors.len() - 3
        ));
    }

    lines.join("\n")
}

fn parser_bench_cases() -> [BenchCase; 11] {
    [
        BenchCase {
            fixture: "colors.js",
            syntax: Syntax::Es(EsSyntax::default()),
            src: include_str!("../benches/files/colors.js"),
        },
        BenchCase {
            fixture: "angular-1.2.5.js",
            syntax: Syntax::Es(EsSyntax::default()),
            src: include_str!("../benches/files/angular-1.2.5.js"),
        },
        BenchCase {
            fixture: "backbone-1.1.0.js",
            syntax: Syntax::Es(EsSyntax::default()),
            src: include_str!("../benches/files/backbone-1.1.0.js"),
        },
        BenchCase {
            fixture: "jquery-1.9.1.js",
            syntax: Syntax::Es(EsSyntax::default()),
            src: include_str!("../benches/files/jquery-1.9.1.js"),
        },
        BenchCase {
            fixture: "jquery.mobile-1.4.2.js",
            syntax: Syntax::Es(EsSyntax::default()),
            src: include_str!("../benches/files/jquery.mobile-1.4.2.js"),
        },
        BenchCase {
            fixture: "mootools-1.4.5.js",
            syntax: Syntax::Es(EsSyntax::default()),
            src: include_str!("../benches/files/mootools-1.4.5.js"),
        },
        BenchCase {
            fixture: "underscore-1.5.2.js",
            syntax: Syntax::Es(EsSyntax::default()),
            src: include_str!("../benches/files/underscore-1.5.2.js"),
        },
        BenchCase {
            fixture: "three-0.138.3.js",
            syntax: Syntax::Es(EsSyntax::default()),
            src: include_str!("../benches/files/three-0.138.3.js"),
        },
        BenchCase {
            fixture: "yui-3.12.0.js",
            syntax: Syntax::Es(EsSyntax::default()),
            src: include_str!("../benches/files/yui-3.12.0.js"),
        },
        BenchCase {
            fixture: "cal.com.tsx",
            syntax: Syntax::Typescript(TsSyntax {
                tsx: true,
                ..Default::default()
            }),
            src: include_str!("../benches/files/cal.com.tsx"),
        },
        BenchCase {
            fixture: "typescript.js",
            syntax: Syntax::Es(EsSyntax::default()),
            src: include_str!("../benches/files/typescript.js"),
        },
    ]
}

#[test]
fn parser_bench_cases_parse_without_fatal_errors() {
    let mut failures = Vec::new();

    for case in parser_bench_cases() {
        let outcome = parse_case(case);
        if let Err(err) = outcome.result {
            failures.push(format!(
                "fixture {} should parse without fatal errors: code={:?}, message={}, {}\n{}",
                case.fixture,
                err.code(),
                err.message(),
                render_recovered_errors(case.src, &outcome.recovered_errors),
                render_error_context(case.src, &err)
            ));
        }
    }

    assert!(failures.is_empty(), "{}", failures.join("\n\n"));
}
