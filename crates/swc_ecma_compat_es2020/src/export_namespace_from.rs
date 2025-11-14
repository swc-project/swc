use swc_ecma_ast::Pass;
use swc_ecma_compiler::{ES2020Options, EnvOptions, TransformOptions, Transformer};

pub fn export_namespace_from() -> impl Pass {
    Transformer::new(
        "".as_ref(),
        &TransformOptions {
            env: EnvOptions {
                es2020: ES2020Options {
                    export_namespace_from: true,
                    ..Default::default()
                },
                ..Default::default()
            },
            ..Default::default()
        },
    )
}
