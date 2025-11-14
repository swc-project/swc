use swc_ecma_ast::Pass;
use swc_ecma_compiler::{ES2021Options, EnvOptions, TransformOptions, Transformer};

pub fn logical_assignments() -> impl Pass {
    Transformer::new(
        "".as_ref(),
        &TransformOptions {
            env: EnvOptions {
                es2021: ES2021Options {
                    logical_assignment_operators: true,
                },
                ..Default::default()
            },
            ..Default::default()
        },
    )
}
