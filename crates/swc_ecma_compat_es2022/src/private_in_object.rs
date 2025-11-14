use swc_ecma_ast::Pass;
use swc_ecma_compiler::{
    ClassPropertiesOptions, ES2022Options, EnvOptions, TransformOptions, Transformer,
};

/// https://github.com/tc39/proposal-private-fields-in-in
pub fn private_in_object() -> impl Pass {
    Transformer::new(
        "".as_ref(),
        &TransformOptions {
            env: EnvOptions {
                es2022: ES2022Options {
                    class_properties: Some(ClassPropertiesOptions {
                        ..Default::default()
                    }),
                    ..Default::default()
                },
                ..Default::default()
            },
            ..Default::default()
        },
    )
}
