//! Parse a JavaScript or TypeScript module and print it with swc_ecma_codegen.
//!
//! Usage:
//!
//! ```sh
//! cargo run -p swc_ecma_codegen --example parse_print -- path/to/input.ts
//! cargo run -p swc_ecma_codegen --example parse_print -- path/to/types.d.ts
//! printf 'export as namespace Foo;\n' | cargo run -p swc_ecma_codegen --example parse_print
//! ```

use std::{
    env,
    io::{self, Read},
    path::Path,
};

use swc_common::{
    comments::{Comments, SingleThreadedComments},
    sync::Lrc,
    FileName, SourceFile, SourceMap,
};
use swc_ecma_ast::{EsVersion, Module};
use swc_ecma_codegen::{text_writer::JsWriter, Emitter, Node};
use swc_ecma_parser::{parse_file_as_module, EsSyntax, Syntax, TsSyntax};

fn main() {
    if let Err(err) = run() {
        eprintln!("{err}");
        std::process::exit(1);
    }
}

fn run() -> Result<(), String> {
    let cm = Lrc::new(SourceMap::default());
    let input = read_input(&cm)?;
    let comments = SingleThreadedComments::default();
    let module = parse_module(&input, &comments)?;
    let output = emit_module(cm, &comments, &module)?;
    print!("{output}");

    Ok(())
}

struct Input {
    file: Lrc<SourceFile>,
    syntax: Syntax,
}

fn read_input(cm: &Lrc<SourceMap>) -> Result<Input, String> {
    let path = env::args().nth(1);
    let Some(path) = path else {
        let mut source = String::new();
        io::stdin()
            .read_to_string(&mut source)
            .map_err(|err| format!("failed to read stdin: {err}"))?;
        let file = cm.new_source_file(Lrc::new(FileName::Anon), source);

        return Ok(Input {
            file,
            syntax: Syntax::Typescript(TsSyntax {
                tsx: true,
                ..Default::default()
            }),
        });
    };

    let path = Path::new(&path);
    let file = cm
        .load_file(path)
        .map_err(|err| format!("failed to read {}: {err}", path.display()))?;

    Ok(Input {
        file,
        syntax: syntax_for_path(path),
    })
}

fn syntax_for_path(path: &Path) -> Syntax {
    let file_name = path.file_name().and_then(|file_name| file_name.to_str());
    let dts = file_name.is_some_and(|file_name| {
        file_name.ends_with(".d.ts")
            || file_name.ends_with(".d.mts")
            || file_name.ends_with(".d.cts")
    });

    match path.extension().and_then(|extension| extension.to_str()) {
        Some("ts" | "mts" | "cts") => Syntax::Typescript(TsSyntax {
            tsx: false,
            dts,
            ..Default::default()
        }),
        Some("tsx") => Syntax::Typescript(TsSyntax {
            tsx: true,
            dts,
            ..Default::default()
        }),
        _ => Syntax::Es(EsSyntax {
            jsx: true,
            ..Default::default()
        }),
    }
}

fn parse_module(input: &Input, comments: &SingleThreadedComments) -> Result<Module, String> {
    let mut errors = Vec::new();
    let module = parse_file_as_module(
        &input.file,
        input.syntax,
        EsVersion::latest(),
        Some(comments as &dyn Comments),
        &mut errors,
    );

    if !errors.is_empty() {
        let messages = errors
            .into_iter()
            .map(|err| err.kind().msg())
            .collect::<Vec<_>>()
            .join("\n");
        return Err(format!("failed to parse input:\n{messages}"));
    }

    module.map_err(|err| format!("failed to parse input: {}", err.kind().msg()))
}

fn emit_module(
    cm: Lrc<SourceMap>,
    comments: &SingleThreadedComments,
    module: &Module,
) -> Result<String, String> {
    let mut buf = Vec::new();

    {
        let wr = JsWriter::new(cm.clone(), "\n", &mut buf, None);
        let mut emitter = Emitter {
            cfg: swc_ecma_codegen::Config::default(),
            cm,
            comments: Some(comments as &dyn Comments),
            wr,
        };
        module
            .emit_with(&mut emitter)
            .map_err(|err| format!("failed to emit output: {err:?}"))?;
    }

    String::from_utf8(buf).map_err(|err| format!("emitted output is not valid UTF-8: {err}"))
}
