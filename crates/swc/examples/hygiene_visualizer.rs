use std::io::{stderr, Write};

use swc_common::{sync::Lrc, Mark, SourceMap, SyntaxContext, GLOBALS};
use swc_ecma_ast::{Ident, Program};
use swc_ecma_codegen::{text_writer::JsWriter, Emitter};
use swc_ecma_transforms_base::resolver;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith, VisitMutWith};

fn print_hygiene(cm: &Lrc<SourceMap>, t: Program) {
    let program = t.fold_with(&mut HygieneVisualizer);

    let stdout = stderr();
    let mut w = stdout.lock();

    writeln!(w, "==================== @ ====================").unwrap();
    Emitter {
        cfg: swc_ecma_codegen::Config::default(),
        cm: cm.clone(),
        comments: None,
        wr: Box::new(JsWriter::new(cm.clone(), "\n", &mut w, None)),
    }
    .emit_program(&program)
    .unwrap();
    writeln!(w, "==================== @ ====================").unwrap();
}

struct HygieneVisualizer;

impl Fold for HygieneVisualizer {
    noop_fold_type!();

    fn fold_ident(&mut self, node: Ident) -> Ident {
        if node.ctxt == SyntaxContext::empty() {
            return node;
        }
        Ident {
            sym: format!("{}{:?}", node.sym, node.ctxt).into(),
            ..node
        }
    }
}

fn main() {
    use std::{env, path::Path, process};

    use swc_ecma_parser::{parse_file_as_program, EsSyntax, Syntax, TsSyntax};

    // Get command-line arguments
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        eprintln!("Usage: cargo run -p swc --example=hygiene_visualizer <file_path>");
        process::exit(1);
    }

    // Setup source map
    let cm: Lrc<SourceMap> = Default::default();

    // Read and parse file
    let file_path = &args[1];
    let source_file = cm.load_file(Path::new(file_path)).unwrap_or_else(|e| {
        eprintln!("Failed to load file '{}': {}", file_path, e);
        process::exit(1)
    });

    // Determine syntax based on file extension
    let syntax = {
        let path = Path::new(file_path);
        let ext = path.extension().and_then(|e| e.to_str()).unwrap_or("");

        match ext {
            "jsx" => Syntax::Es(EsSyntax {
                jsx: true,
                explicit_resource_management: true,
                ..Default::default()
            }),
            "tsx" => Syntax::Typescript(TsSyntax {
                tsx: true,
                ..Default::default()
            }),
            "js" | "mjs" | "cjs" => Syntax::Es(Default::default()),
            _ => Syntax::Typescript(TsSyntax {
                tsx: true,
                ..Default::default()
            }),
        }
    };

    GLOBALS.set(&Default::default(), || {
        // Parse the file
        let mut program = parse_file_as_program(
            &source_file,
            syntax,
            Default::default(),
            None,
            &mut Vec::new(),
        )
        .unwrap_or_else(|e| {
            eprintln!("Failed to parse file '{}': {:?}", file_path, e);
            process::exit(1)
        });

        // Apply resolver
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        program.visit_mut_with(&mut resolver(
            unresolved_mark,
            top_level_mark,
            syntax.typescript(),
        ));

        // Print hygiene information
        print_hygiene(&cm, program);
    })
}
