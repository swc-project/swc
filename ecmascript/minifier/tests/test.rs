use ansi_term::Color;
use std::fs::read_to_string;
use std::path::PathBuf;
use swc_common::errors::ColorConfig;
use swc_common::errors::Handler;
use swc_common::sync::Lrc;
use swc_common::FileName;
use swc_common::SourceMap;
use swc_ecma_ast::*;
use swc_ecma_codegen::text_writer::JsWriter;
use swc_ecma_codegen::Emitter;
use swc_ecma_minifier::optimize;
use swc_ecma_minifier::option::CompressOptions;
use swc_ecma_minifier::option::MinifyOptions;
use swc_ecma_parser::lexer::input::SourceFileInput;
use swc_ecma_parser::lexer::Lexer;
use swc_ecma_parser::Parser;
use swc_ecma_transforms::fixer;
use swc_ecma_transforms::hygiene;
use swc_ecma_transforms::resolver;
use swc_ecma_visit::FoldWith;
use testing::NormalizedOutput;
use walkdir::WalkDir;

/// Tests ported from terser.
#[testing::fixture("terser/compress/**/input.js")]
fn terser_compress(input: PathBuf) {
    let dir = input.parent().unwrap();
    let config = dir.join("config.json");
    let config = read_to_string(&config).expect("failed to read config.json");
    eprintln!("---- {} -----\n{}", Color::Green.paint("Config"), config);
    let config: CompressOptions =
        serde_json::from_str(&config).expect("failed to deserialize config.json");

    testing::run_test2(false, |cm, handler| {
        let fm = cm.load_file(&input).expect("failed to load input.js");

        eprintln!("---- {} -----\n{}", Color::Green.paint("Input"), fm.src);

        let lexer = Lexer::new(
            Default::default(),
            Default::default(),
            SourceFileInput::from(&*fm),
            None,
        );
        let mut parser = Parser::new_from(lexer);
        let module = parser
            .parse_module()
            .map_err(|err| {
                err.into_diagnostic(&handler).emit();
            })
            .map(|module| module.fold_with(&mut resolver()))?;

        let output = optimize(
            module,
            None,
            &MinifyOptions {
                compress: Some(config),
                ..Default::default()
            },
        )
        .fold_with(&mut hygiene())
        .fold_with(&mut fixer(None));
        let output = print(cm.clone(), &[output]);

        eprintln!("---- {} -----\n{}", Color::Green.paint("Ouput"), output);

        let expected = {
            let expected = read_to_string(&dir.join("output.js")).unwrap();
            let fm = cm.new_source_file(FileName::Anon, expected);
            let lexer = Lexer::new(
                Default::default(),
                Default::default(),
                SourceFileInput::from(&*fm),
                None,
            );
            let mut parser = Parser::new_from(lexer);
            let expected = parser.parse_module().map_err(|err| {
                err.into_diagnostic(&handler).emit();
            })?;
            print(cm.clone(), &[expected])
        };

        if output == expected {
            return Ok(());
        }

        eprintln!(
            "---- {} -----\n{}",
            Color::Green.paint("Expected"),
            expected
        );

        NormalizedOutput::from(output)
            .compare_to_file(dir.join("output.js"))
            .unwrap();

        Ok(())
    })
    .unwrap()
}

fn print<N: swc_ecma_codegen::Node>(cm: Lrc<SourceMap>, nodes: &[N]) -> String {
    let mut buf = vec![];

    {
        let mut emitter = Emitter {
            cfg: Default::default(),
            cm: cm.clone(),
            comments: None,
            wr: Box::new(JsWriter::new(cm.clone(), "\n", &mut buf, None)),
        };

        for n in nodes {
            n.emit_with(&mut emitter).unwrap();
        }
    }

    String::from_utf8(buf).unwrap()
}
