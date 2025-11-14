use swc_ecma_ast::*;
use swc_ecma_compiler::{ES2022Options, EnvOptions, TransformOptions, Transformer};

pub fn static_blocks() -> impl Pass {
    Transformer::new(
        "".as_ref(),
        &TransformOptions {
            env: EnvOptions {
                es2022: ES2022Options {
                    class_static_block: true,
                    ..Default::default()
                },
                ..Default::default()
            },
            ..Default::default()
        },
    )
}
