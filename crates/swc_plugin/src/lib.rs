/// Reexported for convenience.
use abi_stable::std_types::{RResult, RStr, RString};
use anyhow::Context;
use rplugin::StableAst;
use serde::de::DeserializeOwned;
pub use swc_plugin_js_api::*;

#[doc(hidden)]
pub fn invoke_js_plugin<C, F>(
    rt: swc_common::plugin::Runtime,
    op: fn(C) -> F,
    config_json: RStr,
    ast: swc_ecma_plugin_ast::Program,
) -> RResult<swc_ecma_plugin_ast::Program, RString>
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

    swc_common::plugin::with_runtime(&rt, || {
        let ast = ast.into_unstable();

        let mut tr = op(config);

        let ast = ast.fold_with(&mut tr);

        let res = StableAst::from_unstable(ast);

        RResult::ROk(res)
    })
}

#[macro_export]
macro_rules! define_js_plugin {
    ($fn_name:ident) => {
        #[abi_stable::export_root_module]
        pub fn swc_library() -> $crate::SwcJsPluginRef {
            extern "C" fn swc_js_plugin(
                rt: swc_common::plugin::Runtime,
                config_json: abi_stable::std_types::RStr,
                ast: swc_ecma_plugin_ast::Program,
            ) -> abi_stable::std_types::RResult<
                swc_ecma_plugin_ast::Program,
                abi_stable::std_types::RString,
            > {
                $crate::invoke_js_plugin(rt, $fn_name, config_json, ast)
            }
            use abi_stable::prefix_type::PrefixTypeTrait;

            $crate::SwcJsPlugin {
                process_js: Some(swc_js_plugin),
            }
            .leak_into_prefix()
        }
    };
}
