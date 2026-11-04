use std::path::Path;

use swc_common::{FileName, Mark};
use swc_ecma_ast::{noop_pass, EsVersion, Pass, Program};
use swc_ecma_codegen::{Config, Emitter};
use swc_ecma_parser::{EsSyntax, Parser, StringInput, Syntax};
use swc_ecma_preset_env::{transform_from_env, transform_from_es_version, Config as EnvConfig};
use swc_ecma_transforms_base::{assumptions::Assumptions, fixer::fixer, hygiene, resolver};
use swc_ecma_transforms_react::{react, Options};
use swc_ecma_transforms_testing::Tester;
use testing::NormalizedOutput;

/// Executes script fixtures with their original exact code generation checks.
pub(super) fn test_script(
    src: &str,
    output: &Path,
    options: Options,
    env: Option<EnvConfig>,
    target: Option<EsVersion>,
    assumptions: Assumptions,
    loose: bool,
) {
    Tester::run(|tester| {
        let fm = tester
            .cm
            .new_source_file(FileName::Real("input.js".into()).into(), src.to_string());

        let syntax = Syntax::Es(EsSyntax {
            jsx: true,
            ..Default::default()
        });

        let mut parser = Parser::new(syntax, StringInput::from(&*fm), Some(&tester.comments));

        let script = parser.parse_script().unwrap();

        let top_level_mark = Mark::new();
        let unresolved_mark = Mark::new();

        let compat: Box<dyn Pass> = if let Some(env) = env {
            Box::new(transform_from_env(
                unresolved_mark,
                Some(tester.comments.clone()),
                env.into(),
                assumptions,
            ))
        } else if let Some(target) = target {
            Box::new(transform_from_es_version(
                unresolved_mark,
                Some(tester.comments.clone()),
                target,
                assumptions,
                loose,
            ))
        } else {
            Box::new(noop_pass())
        };
        let script = Program::Script(script).apply((
            resolver(unresolved_mark, top_level_mark, false),
            react(
                tester.cm.clone(),
                Some(&tester.comments),
                options,
                top_level_mark,
                unresolved_mark,
            ),
            compat,
            hygiene::hygiene(),
            fixer(Some(&tester.comments)),
        ));

        let mut buf = Vec::new();

        let mut emitter = Emitter {
            cfg: Config::default()
                .with_ascii_only(true)
                .with_omit_last_semi(true),
            cm: tester.cm.clone(),
            wr: Box::new(swc_ecma_codegen::text_writer::JsWriter::new(
                tester.cm.clone(),
                "\n",
                &mut buf,
                None,
            )),
            comments: Some(&tester.comments),
        };

        // println!("Emitting: {:?}", module);
        emitter.emit_program(&script).unwrap();

        let s = String::from_utf8_lossy(&buf).to_string();
        assert!(NormalizedOutput::new_raw(s).compare_to_file(output).is_ok());

        Ok(())
    })
}
