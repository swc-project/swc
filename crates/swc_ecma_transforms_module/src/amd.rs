use serde::{Deserialize, Serialize};
use swc_common::{comments::Comments, Mark};
use swc_ecma_ast::Pass;
use swc_ecma_visit::visit_mut_pass;

pub use super::util::Config as InnerConfig;
use crate::{
    module_transform::{ModuleConfig, ModuleTransform, TransformMode},
    path::Resolver,
};

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub module_id: Option<String>,

    #[serde(flatten, default)]
    pub config: InnerConfig,
}

#[derive(Default)]
pub struct FeatureFlag {
    pub support_block_scoping: bool,
    pub support_arrow: bool,
}

/// Create an AMD module transform
pub fn amd<C>(
    resolver: Resolver,
    unresolved_mark: Mark,
    config: Config,
    available_features: FeatureFlag,
    comments: Option<C>,
) -> impl Pass
where
    C: Comments,
{
    let Config { module_id, config } = config;

    let module_config = ModuleConfig {
        mode: TransformMode::Amd,
        strict_mode: config.strict_mode,
        allow_top_level_this: config.allow_top_level_this,
        import_interop: config.import_interop(),
        no_interop: config.no_interop,
        ignore_dynamic: config.ignore_dynamic,
        preserve_import_meta: config.preserve_import_meta,
        lazy: config.lazy,
        export_interop_annotation: false,
        module_id,
        umd_globals: Default::default(),
        source_map: None,
    };

    visit_mut_pass(ModuleTransform::new(
        module_config,
        resolver,
        unresolved_mark,
        comments,
        available_features.support_arrow,
        available_features.support_block_scoping,
    ))
}
