#![no_main]
use libfuzzer_sys::fuzz_target;
use swc_common::{sync::Lrc, FileName, Mark, SourceMap};
use swc_ecma_ast::{Module, Program};
use swc_ecma_codegen::text_writer::{omit_trailing_semi, JsWriter};
use swc_ecma_minifier::{
    optimize,
    option::{ExtraOptions, MangleOptions, MinifyOptions},
};
use swc_ecma_parser::parse_file_as_module;
use swc_ecma_testing::{exec_node_js, JsExecOptions};
use swc_ecma_transforms_base::{fixer::fixer, resolver};
use swc_ecma_visit::FoldWith;

fuzz_target!(|module: Module| {
    testing::run_test(false, |cm, handler| {
        // fuzzed code goes here

        let code = print(cm.clone(), &[&module], true);
        {
            // Fuzzing produced a syntax error

            if exec_node_js(
                &code,
                JsExecOptions {
                    cache: false,
                    ..Default::default()
                },
            )
            .is_err()
            {
                return Ok(());
            }
        }
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        let fm = cm.new_source_file(FileName::Anon, code);

        let mut program = parse_file_as_module(
            &fm,
            Default::default(),
            Default::default(),
            None,
            &mut Vec::new(),
        )
        .map_err(|err| {
            err.into_diagnostic(handler).emit();
        })
        .map(Program::Module)
        .unwrap();

        program = program.fold_with(&mut resolver(unresolved_mark, top_level_mark, false));

        let output = optimize(
            program,
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

        exec_node_js(
            &code,
            JsExecOptions {
                cache: false,
                ..Default::default()
            },
        )
        .unwrap();

        Ok(())
    })
    .unwrap();
});

fn print<N: swc_ecma_codegen::Node>(cm: Lrc<SourceMap>, nodes: &[N], minify: bool) -> String {
    let mut buf = Vec::new();

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
