/// Reexported for convenience.
use abi_stable::std_types::{RResult, RStr, RString};
use anyhow::Context;
use serde::de::DeserializeOwned;
use swc_ecma_ast::Program;
pub use swc_plugin_api::*;

#[doc(hidden)]
pub fn invoke_js_plugin<C, F>(
    rt: swc_common::plugin::Runtime,
    op: fn(C) -> F,
    config_json: RStr,
    ast_json: RString,
) -> RResult<RString, RString>
where
    C: DeserializeOwned,
    F: swc_ecma_visit::Fold,
{
    use swc_ecma_visit::FoldWith;

    let config = serde_json::from_str(config_json.as_str())
        .context("failed to deserialize config string as json");
    let config: C = match config {
        Ok(v) => v,
        Err(err) => return RResult::RErr(format!("{:?}", err).into()),
    };

    let ast =
        serde_json::from_str(ast_json.as_str()).context("failed to deserialize ast string as json");
    let ast: Program = match ast {
        Ok(v) => v,
        Err(err) => return RResult::RErr(format!("{:?}", err).into()),
    };

    swc_common::plugin::with_runtime(&rt, || {
        let mut tr = op(config);

        let ast = ast.fold_with(&mut tr);

        let res = match serde_json::to_string(&ast) {
            Ok(v) => v,
            Err(err) => {
                return RResult::RErr(
                    format!(
                        "failed to serialize swc_ecma_ast::Program as json: {:?}",
                        err
                    )
                    .into(),
                )
            }
        };

        RResult::ROk(res.into())
    })
}

#[macro_export]
macro_rules! define_js_plugin {
    ($fn_name:ident) => {
        #[abi_stable::export_root_module]
        pub fn swc_library() -> $crate::SwcPluginRef {
            extern "C" fn swc_js_plugin(
                rt: swc_common::plugin::Runtime,
                config_json: abi_stable::std_types::RStr,
                ast_json: abi_stable::std_types::RString,
            ) -> abi_stable::std_types::RResult<
                abi_stable::std_types::RString,
                abi_stable::std_types::RString,
            > {
                $crate::invoke_js_plugin(rt, $fn_name, config_json, ast_json)
            }
            use abi_stable::prefix_type::PrefixTypeTrait;

            $crate::SwcPlugin {
                process_js: Some(swc_js_plugin),
            }
            .leak_into_prefix()
        }
    };
}
