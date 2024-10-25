use swc_common::{errors::HANDLER, Mark, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_lints::{rule::Rule, rules::LintParams};
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_base::resolver;

fn main() {
    // testing::run_test creates Lrc<SourceMap> and `&Handler` for you
    // You can refer to source code of it or try_with_handler of the swc crate.

    let msg = testing::run_test(false, |cm, handler| -> Result<(), _> {
        HANDLER.set(handler, || {
            let fm = cm.load_file("examples/all.js".as_ref()).unwrap();

            let module = swc_ecma_parser::parse_file_as_module(
                &fm,
                Syntax::default(),
                EsVersion::latest(),
                None,
                &mut Vec::new(),
            );
            let mut program = match module {
                Ok(v) => Program::Module(v),
                Err(err) => {
                    err.into_diagnostic(handler).emit();
                    return Err(());
                }
            };

            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();
            let unresolved_ctxt = SyntaxContext::empty().apply_mark(unresolved_mark);
            let top_level_ctxt = SyntaxContext::empty().apply_mark(top_level_mark);

            program.mutate(resolver(unresolved_mark, top_level_mark, false));

            let mut rules = swc_ecma_lints::rules::all(LintParams {
                program: &program,
                lint_config: &Default::default(),
                unresolved_ctxt,
                top_level_ctxt,
                es_version: EsVersion::latest(),
                source_map: cm.clone(),
            });

            let module = program.expect_module();
            rules.lint_module(&module);

            Err(())
        })
    })
    .unwrap_err();

    println!("{}", msg);
}
