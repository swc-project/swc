#![no_main]
use libfuzzer_sys::fuzz_target;
use swc_common::sync::Lrc;
use swc_ecma_ast::{Module, Program};

fuzz_target!(|module: Module| {
    // fuzzed code goes here

    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    let module = module.fold_with(&mut resolver(unresolved_mark, top_level_mark, false));
    let program = Program::Module(module);

    let output = optimize(
        program.into(),
        cm.clone(),
        None,
        None,
        &MinifyOptions {
            compress: Some(Default::default()),
            mangle: Some(MangleOptions {
                top_level: true,
                ..Default::default()
            }),
            ..Default::default()
        },
        &ExtraOptions {
            unresolved_mark,
            top_level_mark,
        },
    )
    .expect_module();

    let output = output.fold_with(&mut fixer(None));

    let code = print(cm, &[output], true);

    Ok(())
});

fn print<N: swc_ecma_codegen::Node>(cm: Lrc<SourceMap>, nodes: &[N], minify: bool) -> String {
    let mut buf = vec![];

    {
        let mut emitter = swc_ecma_codegen::Emitter {
            cfg: swc_ecma_codegen::Config {
                minify,
                ..Default::default()
            },
            cm: cm.clone(),
            comments: None,
            wr: omit_trailing_semi(JsWriter::new(cm, "\n", &mut buf, None)),
        };

        for n in nodes {
            n.emit_with(&mut emitter).unwrap();
        }
    }

    String::from_utf8(buf).unwrap()
}
