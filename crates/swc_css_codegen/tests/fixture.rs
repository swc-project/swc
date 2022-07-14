use std::{
    mem::take,
    path::{Path, PathBuf},
};

use swc_common::{FileName, Span};
use swc_css_ast::{
    AnPlusBNotation, ComponentValue, HexColor, ImportantFlag, Integer, Number, Str, Stylesheet,
    Token, TokenAndSpan, UrlValueRaw,
};
use swc_css_codegen::{
    writer::basic::{BasicCssWriter, BasicCssWriterConfig, IndentType, LineFeed},
    CodeGenerator, CodegenConfig, Emit,
};
use swc_css_parser::{parse_file, parser::ParserConfig};
use swc_css_visit::{VisitMut, VisitMutWith};
use testing::{assert_eq, run_test2, NormalizedOutput};

fn run(input: &Path, minify: bool) {
    let dir = input.parent().unwrap();
    // let map = if minify {
    //     dir.join(format!(
    //         "output.min.{}.map",
    //         input.extension().unwrap().to_string_lossy()
    //     ))
    // } else {
    //     dir.join(format!(
    //         "output.{}.map",
    //         input.extension().unwrap().to_string_lossy()
    //     ))
    // };
    let output = if minify {
        dir.join(format!(
            "output.min.{}",
            input.extension().unwrap().to_string_lossy()
        ))
    } else {
        dir.join(format!(
            "output.{}",
            input.extension().unwrap().to_string_lossy()
        ))
    };

    run_test2(false, |cm, handler| {
        let fm = cm.load_file(input).unwrap();

        eprintln!("==== ==== Input ==== ====\n{}\n", fm.src);

        let mut errors = vec![];
        let mut stylesheet: Stylesheet = parse_file(
            &fm,
            ParserConfig {
                ..Default::default()
            },
            &mut errors,
        )
        .unwrap();

        for err in take(&mut errors) {
            err.to_diagnostics(&handler).emit();
        }

        let mut css_str = String::new();
        // let mut src_map_buf = vec![];

        {
            let wr = BasicCssWriter::new(
                &mut css_str,
                None, // Some(&mut src_map_buf),
                BasicCssWriterConfig::default(),
            );

            let mut gen = CodeGenerator::new(wr, CodegenConfig { minify });

            gen.emit(&stylesheet).unwrap();
        }

        // let source_map = cm.build_source_map(&mut src_map_buf);
        // let mut source_map_output: Vec<u8> = vec![];
        // source_map.to_writer(&mut source_map_output).unwrap();
        // let str_source_map_output = String::from_utf8_lossy(&source_map_output);
        // std::fs::write(map, &*str_source_map_output).expect("Unable to write file");

        let fm_output = cm.load_file(&output).unwrap();

        NormalizedOutput::from(css_str)
            .compare_to_file(output)
            .unwrap();

        let mut errors = vec![];
        let mut stylesheet_output: Stylesheet = parse_file(
            &fm_output,
            ParserConfig {
                ..Default::default()
            },
            &mut errors,
        )
        .map_err(|err| {
            err.to_diagnostics(&handler).emit();
        })?;

        for err in take(&mut errors) {
            err.to_diagnostics(&handler).emit();
        }

        stylesheet.visit_mut_with(&mut NormalizeTest);
        stylesheet_output.visit_mut_with(&mut NormalizeTest);

        assert_eq!(stylesheet, stylesheet_output);

        Ok(())
    })
    .unwrap();
}

struct NormalizeTest;

impl VisitMut for NormalizeTest {
    fn visit_mut_hex_color(&mut self, n: &mut HexColor) {
        n.visit_mut_children_with(self);

        n.value = "fff".into();
        n.raw = None;
    }

    fn visit_mut_important_flag(&mut self, n: &mut ImportantFlag) {
        n.visit_mut_children_with(self);

        n.value.value = n.value.value.to_lowercase().into();
        n.value.raw = None;
    }

    // TODO - we should parse only some properties as `<integer>`, but it requires
    // more work, let's postpone it to avoid breaking code
    fn visit_mut_component_value(&mut self, n: &mut ComponentValue) {
        n.visit_mut_children_with(self);

        match n {
            ComponentValue::Number(Number { value, .. }) if value.fract() == 0.0 => {
                *n = ComponentValue::Integer(Integer {
                    span: Default::default(),
                    value: value.round() as i64,
                    raw: None,
                })
            }
            _ => {}
        }
    }

    fn visit_mut_integer(&mut self, n: &mut Integer) {
        n.visit_mut_children_with(self);

        n.raw = None;
    }

    fn visit_mut_number(&mut self, n: &mut Number) {
        n.visit_mut_children_with(self);

        n.raw = None;
    }

    fn visit_mut_str(&mut self, n: &mut Str) {
        n.visit_mut_children_with(self);

        n.raw = None;
    }

    fn visit_mut_url_value_raw(&mut self, n: &mut UrlValueRaw) {
        n.visit_mut_children_with(self);

        n.before = None;
        n.after = None;
        n.raw = None;
    }

    fn visit_mut_an_plus_b_notation(&mut self, n: &mut AnPlusBNotation) {
        n.visit_mut_children_with(self);

        if n.a_raw.is_some() {
            n.a_raw = None;
        }

        if n.b_raw.is_some() {
            n.b_raw = None;
        }
    }

    fn visit_mut_token_and_span(&mut self, n: &mut TokenAndSpan) {
        n.visit_mut_children_with(self);

        if let Token::WhiteSpace { .. } = &n.token {
            n.token = Token::WhiteSpace { value: "".into() }
        }
    }

    fn visit_mut_span(&mut self, n: &mut Span) {
        *n = Default::default()
    }
}

#[testing::fixture("tests/fixture/**/input.css")]
fn css(input: PathBuf) {
    run(&input, false);
    run(&input, true);
}

#[testing::fixture("tests/options/indent_type/**/input.css")]
fn indent_type(input: PathBuf) {
    let dir = input.parent().unwrap();
    let output = dir.join(format!(
        "output.{}",
        input.extension().unwrap().to_string_lossy()
    ));

    run_test2(false, |cm, handler| {
        let fm = cm.load_file(&input).unwrap();

        eprintln!("==== ==== Input ==== ====\n{}\n", fm.src);

        let mut errors = vec![];
        let mut stylesheet: Stylesheet = parse_file(
            &fm,
            ParserConfig {
                ..Default::default()
            },
            &mut errors,
        )
        .unwrap();

        for err in take(&mut errors) {
            err.to_diagnostics(&handler).emit();
        }

        let mut css_str = String::new();

        {
            let wr = BasicCssWriter::new(
                &mut css_str,
                None,
                BasicCssWriterConfig {
                    indent_type: IndentType::Tab,
                    indent_width: 2,
                    linefeed: LineFeed::default(),
                },
            );

            let mut gen = CodeGenerator::new(wr, CodegenConfig { minify: false });

            gen.emit(&stylesheet).unwrap();
        }

        let fm_output = cm.load_file(&output).unwrap();

        NormalizedOutput::from(css_str)
            .compare_to_file(output)
            .unwrap();

        let mut errors = vec![];
        let mut stylesheet_output: Stylesheet = parse_file(
            &fm_output,
            ParserConfig {
                ..Default::default()
            },
            &mut errors,
        )
        .map_err(|err| {
            err.to_diagnostics(&handler).emit();
        })?;

        for err in take(&mut errors) {
            err.to_diagnostics(&handler).emit();
        }

        stylesheet.visit_mut_with(&mut NormalizeTest);
        stylesheet_output.visit_mut_with(&mut NormalizeTest);

        assert_eq!(stylesheet, stylesheet_output);

        Ok(())
    })
    .unwrap();
}

#[testing::fixture("tests/options/indent_width/**/input.css")]
fn indent_width(input: PathBuf) {
    let dir = input.parent().unwrap();
    let output = dir.join(format!(
        "output.{}",
        input.extension().unwrap().to_string_lossy()
    ));

    run_test2(false, |cm, handler| {
        let fm = cm.load_file(&input).unwrap();

        eprintln!("==== ==== Input ==== ====\n{}\n", fm.src);

        let mut errors = vec![];
        let mut stylesheet: Stylesheet = parse_file(
            &fm,
            ParserConfig {
                ..Default::default()
            },
            &mut errors,
        )
        .unwrap();

        for err in take(&mut errors) {
            err.to_diagnostics(&handler).emit();
        }

        let mut css_str = String::new();

        {
            let wr = BasicCssWriter::new(
                &mut css_str,
                None,
                BasicCssWriterConfig {
                    indent_type: IndentType::default(),
                    indent_width: 4,
                    linefeed: LineFeed::default(),
                },
            );

            let mut gen = CodeGenerator::new(wr, CodegenConfig { minify: false });

            gen.emit(&stylesheet).unwrap();
        }

        let fm_output = cm.load_file(&output).unwrap();

        NormalizedOutput::from(css_str)
            .compare_to_file(output)
            .unwrap();

        let mut errors = vec![];
        let mut stylesheet_output: Stylesheet = parse_file(
            &fm_output,
            ParserConfig {
                ..Default::default()
            },
            &mut errors,
        )
        .map_err(|err| {
            err.to_diagnostics(&handler).emit();
        })?;

        for err in take(&mut errors) {
            err.to_diagnostics(&handler).emit();
        }

        stylesheet.visit_mut_with(&mut NormalizeTest);
        stylesheet_output.visit_mut_with(&mut NormalizeTest);

        assert_eq!(stylesheet, stylesheet_output);

        Ok(())
    })
    .unwrap();
}

#[testing::fixture("tests/options/linefeed/lf/**/input.css")]
fn linefeed_lf(input: PathBuf) {
    let dir = input.parent().unwrap();
    let output = dir.join(format!(
        "output.{}",
        input.extension().unwrap().to_string_lossy()
    ));

    run_test2(false, |cm, handler| {
        let fm = cm.load_file(&input).unwrap();

        eprintln!("==== ==== Input ==== ====\n{}\n", fm.src);

        let mut errors = vec![];
        let mut stylesheet: Stylesheet = parse_file(
            &fm,
            ParserConfig {
                ..Default::default()
            },
            &mut errors,
        )
        .unwrap();

        for err in take(&mut errors) {
            err.to_diagnostics(&handler).emit();
        }

        let mut css_str = String::new();

        {
            let wr = BasicCssWriter::new(
                &mut css_str,
                None,
                BasicCssWriterConfig {
                    indent_type: IndentType::default(),
                    indent_width: 2,
                    linefeed: LineFeed::LF,
                },
            );

            let mut gen = CodeGenerator::new(wr, CodegenConfig { minify: false });

            gen.emit(&stylesheet).unwrap();
        }

        let fm_output = cm.load_file(&output).unwrap();

        assert!(!css_str.contains("\r\n"));

        NormalizedOutput::from(css_str)
            .compare_to_file(output)
            .unwrap();

        let mut errors = vec![];
        let mut stylesheet_output: Stylesheet = parse_file(
            &fm_output,
            ParserConfig {
                ..Default::default()
            },
            &mut errors,
        )
        .map_err(|err| {
            err.to_diagnostics(&handler).emit();
        })?;

        for err in take(&mut errors) {
            err.to_diagnostics(&handler).emit();
        }

        stylesheet.visit_mut_with(&mut NormalizeTest);
        stylesheet_output.visit_mut_with(&mut NormalizeTest);

        assert_eq!(stylesheet, stylesheet_output);

        Ok(())
    })
    .unwrap();
}

#[testing::fixture("tests/options/linefeed/crlf/**/input.css")]
fn linefeed_crlf(input: PathBuf) {
    let dir = input.parent().unwrap();
    let output = dir.join(format!(
        "output.{}",
        input.extension().unwrap().to_string_lossy()
    ));

    run_test2(false, |cm, handler| {
        let fm = cm.load_file(&input).unwrap();

        eprintln!("==== ==== Input ==== ====\n{}\n", fm.src);

        let mut errors = vec![];
        let mut stylesheet: Stylesheet = parse_file(
            &fm,
            ParserConfig {
                ..Default::default()
            },
            &mut errors,
        )
        .unwrap();

        for err in take(&mut errors) {
            err.to_diagnostics(&handler).emit();
        }

        let mut css_str = String::new();

        {
            let wr = BasicCssWriter::new(
                &mut css_str,
                None,
                BasicCssWriterConfig {
                    indent_type: IndentType::default(),
                    indent_width: 2,
                    linefeed: LineFeed::CRLF,
                },
            );

            let mut gen = CodeGenerator::new(wr, CodegenConfig { minify: false });

            gen.emit(&stylesheet).unwrap();
        }

        let fm_output = cm.load_file(&output).unwrap();

        assert!(css_str.contains("\r\n"));

        NormalizedOutput::from(css_str)
            .compare_to_file(output)
            .unwrap();

        let mut errors = vec![];
        let mut stylesheet_output: Stylesheet = parse_file(
            &fm_output,
            ParserConfig {
                ..Default::default()
            },
            &mut errors,
        )
        .map_err(|err| {
            err.to_diagnostics(&handler).emit();
        })?;

        for err in take(&mut errors) {
            err.to_diagnostics(&handler).emit();
        }

        stylesheet.visit_mut_with(&mut NormalizeTest);
        stylesheet_output.visit_mut_with(&mut NormalizeTest);

        assert_eq!(stylesheet, stylesheet_output);

        Ok(())
    })
    .unwrap();
}

#[testing::fixture("../swc_css_parser/tests/fixture/**/input.css")]
fn parse_again(input: PathBuf) {
    eprintln!("{}", input.display());

    testing::run_test2(false, |cm, handler| {
        let fm = cm.load_file(&input).unwrap();

        eprintln!("==== ==== Input ==== ====\n{}\n", fm.src);

        let mut errors = vec![];
        let mut stylesheet: Stylesheet = parse_file(
            &fm,
            ParserConfig {
                ..Default::default()
            },
            &mut errors,
        )
        .map_err(|err| {
            err.to_diagnostics(&handler).emit();
        })?;

        for err in take(&mut errors) {
            err.to_diagnostics(&handler).emit();
        }

        let mut css_str = String::new();
        {
            let wr = BasicCssWriter::new(&mut css_str, None, BasicCssWriterConfig::default());
            let mut gen = CodeGenerator::new(wr, CodegenConfig { minify: false });

            gen.emit(&stylesheet).unwrap();
        }

        eprintln!("==== ==== Codegen ==== ====\n{}\n", css_str);

        let new_fm = cm.new_source_file(FileName::Anon, css_str);
        let mut parsed_errors = vec![];
        let mut parsed: Stylesheet = parse_file(
            &new_fm,
            ParserConfig {
                ..Default::default()
            },
            &mut parsed_errors,
        )
        .map_err(|err| {
            err.to_diagnostics(&handler).emit();
        })?;

        for err in parsed_errors {
            err.to_diagnostics(&handler).emit();
        }

        stylesheet.visit_mut_with(&mut DropSpan);
        parsed.visit_mut_with(&mut DropSpan);

        assert_eq!(stylesheet, parsed);

        Ok(())
    })
    .unwrap();
}

struct DropSpan;

impl VisitMut for DropSpan {
    fn visit_mut_span(&mut self, n: &mut Span) {
        *n = Default::default()
    }
}
