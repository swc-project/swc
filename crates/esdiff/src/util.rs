use anyhow::{anyhow, Result};
use std::sync::Arc;
use swc_common::{input::SourceFileInput, FileName, SourceFile, SourceMap};
use swc_ecma_ast::{EsVersion, Module};
use swc_ecma_parser::{lexer::Lexer, EsConfig, Parser, Syntax, TsConfig};
use swc_ecma_utils::HANDLER;

pub(crate) fn parse(fm: &SourceFile) -> Result<Module> {
    let syntax = Syntax::Es(EsConfig {
        jsx: true,
        ..Default::default()
    });

    let syntax = match &fm.name {
        FileName::Real(p) => match p.extension() {
            Some(ext) => {
                if ext == "tsx" {
                    Syntax::Typescript(TsConfig {
                        tsx: true,
                        decorators: true,
                        ..Default::default()
                    })
                } else if ext == "ts" {
                    Syntax::Typescript(TsConfig {
                        decorators: true,
                        ..Default::default()
                    })
                } else {
                    syntax
                }
            }
            None => syntax,
        },
        _ => syntax,
    };

    let lexer = Lexer::new(syntax, EsVersion::latest(), SourceFileInput::from(fm), None);

    let mut parser = Parser::new_from(lexer);

    parser.parse_module().map_err(|err| {
        HANDLER.with(|handler| {
            err.into_diagnostic(&handler).emit();
        });

        anyhow!("failed to parse module")
    })
}

pub(crate) fn print_js(cm: Arc<SourceMap>, m: &Module) -> Result<String> {
    let mut buf = vec![];

    {
        let wr = swc_ecma_codegen::text_writer::JsWriter::new(cm.clone(), "\n", &mut buf, None);
        let mut emitter = swc_ecma_codegen::Emitter {
            cfg: swc_ecma_codegen::Config { minify: false },
            cm,
            comments: None,
            wr,
        };

        emitter.emit_module(&m)?;
    }

    Ok(String::from_utf8(buf)?)
}
