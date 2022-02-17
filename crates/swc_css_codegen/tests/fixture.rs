use std::{
    mem::take,
    path::{Path, PathBuf},
};

use swc_common::{FileName, Span};
use swc_css_ast::{
    HexColor, ImportantFlag, Number, Str, Stylesheet, Token, TokenAndSpan, UrlValueRaw,
};
use swc_css_codegen::{
    writer::basic::{BasicCssWriter, BasicCssWriterConfig},
    CodeGenerator, CodegenConfig, Emit,
};
use swc_css_parser::{parse_file, parser::ParserConfig};
use swc_css_visit::{VisitMut, VisitMutWith};
use testing::{assert_eq, run_test2, NormalizedOutput};

fn run(input: &Path, minify: bool) {
    let dir = input.parent().unwrap();
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

        {
            let wr = BasicCssWriter::new(
                &mut css_str,
                BasicCssWriterConfig {
                    indent: if minify { "" } else { "\t" },
                },
            );

            let mut gen = CodeGenerator::new(wr, CodegenConfig { minify });

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

struct NormalizeTest;

impl VisitMut for NormalizeTest {
    fn visit_mut_hex_color(&mut self, n: &mut HexColor) {
        n.visit_mut_children_with(self);

        n.value = "fff".into();
        n.raw = "fff".into();
    }

    fn visit_mut_important_flag(&mut self, n: &mut ImportantFlag) {
        n.visit_mut_children_with(self);

        n.value.value = n.value.value.to_lowercase().into();
        n.value.raw = n.value.raw.to_lowercase().into();
    }

    fn visit_mut_number(&mut self, n: &mut Number) {
        n.visit_mut_children_with(self);

        n.raw = "".into();
    }

    fn visit_mut_str(&mut self, n: &mut Str) {
        n.visit_mut_children_with(self);

        n.raw = "".into();
    }

    fn visit_mut_url_value_raw(&mut self, n: &mut UrlValueRaw) {
        n.visit_mut_children_with(self);

        n.before = "".into();
        n.after = "".into();
        n.raw = "".into();
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
            let wr = BasicCssWriter::new(&mut css_str, BasicCssWriterConfig { indent: "\t" });
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
