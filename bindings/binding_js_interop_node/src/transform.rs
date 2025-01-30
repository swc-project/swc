use std::path::Path;

use napi::{Env, JsBuffer, JsBufferValue, JsFunction, JsObject, Ref};
use swc_core::{base::config::Options, common::FileName, node::MapErr};
use swc_interop_babel::transform::{JsTrasnform, TransformOutput};
use tracing::instrument;

use crate::{get_compiler, util::try_with};

fn apply_swc(input: TransformOutput, options: Ref<JsBufferValue>) -> napi::Result<TransformOutput> {
    let c = get_compiler();
    let mut options: Options = serde_json::from_slice(options.as_ref())?;
    if !options.filename.is_empty() {
        options.config.adjust(Path::new(&options.filename));
    }

    let error_format = options.experimental.error_format.unwrap_or_default();

    try_with(
        c.cm.clone(),
        !options.config.error.filename.into_bool(),
        error_format,
        |handler| {
            c.run(|| {
                let fm = c.cm.new_source_file(
                    if options.filename.is_empty() {
                        FileName::Anon.into()
                    } else {
                        FileName::Real(options.filename.clone().into()).into()
                    },
                    input.code,
                );

                let output = c.process_js_file(fm, handler, &options)?;

                Ok(TransformOutput {
                    code: output.code,
                    map: output.map,
                })
            })
        },
    )
    .convert_err()
}

#[napi]
#[instrument(level = "trace", skip_all)]
pub fn transform_3_times(
    env: Env,
    src: String,
    first_options: JsBuffer,
    babel_transform: JsFunction,
    third_options: JsBuffer,
) -> napi::Result<JsObject> {
    let first_options = first_options.into_ref()?;
    let third_options = third_options.into_ref()?;
    let babel_hook = JsTrasnform::new(&env, &babel_transform)?;

    env.spawn_future(async move {
        let input = TransformOutput {
            code: src,
            map: None,
        };

        let output = apply_swc(input, first_options)?;

        let output = babel_hook.transform(output).await?;

        apply_swc(output, third_options)
    })
}

#[napi]
#[instrument(level = "trace", skip_all)]
pub fn transform_2_times(
    env: Env,
    src: String,
    first_options: JsBuffer,
    babel_transform: JsFunction,
) -> napi::Result<JsObject> {
    let first_options = first_options.into_ref()?;
    let babel_hook = JsTrasnform::new(&env, &babel_transform)?;

    env.spawn_future(async move {
        let input = TransformOutput {
            code: src,
            map: None,
        };

        let output = apply_swc(input, first_options)?;

        babel_hook.transform(output).await
    })
}

#[napi]
#[instrument(level = "trace", skip_all)]
pub fn transform_once(env: Env, src: String, first_options: JsBuffer) -> napi::Result<JsObject> {
    let first_options = first_options.into_ref()?;

    env.spawn_future(async move {
        let input = TransformOutput {
            code: src,
            map: None,
        };

        apply_swc(input, first_options)
    })
}
