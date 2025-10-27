use swc_common::{sync::Lrc, Mark, SourceMap};
use swc_ecma_ast::Pass;
use swc_ecma_visit::visit_mut_pass;

pub use self::config::Config;
use crate::{
    module_transform::{ModuleConfig, ModuleTransform, TransformMode},
    path::Resolver,
};

pub mod config;

#[derive(Default)]
pub struct FeatureFlag {
    pub support_block_scoping: bool,
}

/// Create a UMD module transform
pub fn umd(
    cm: Lrc<SourceMap>,
    resolver: Resolver,
    unresolved_mark: Mark,
    config: Config,
    available_features: FeatureFlag,
) -> impl Pass {
    let built_config = config.build(cm.clone());

    let module_config = ModuleConfig {
        mode: TransformMode::Umd,
        strict_mode: built_config.config.strict_mode,
        allow_top_level_this: built_config.config.allow_top_level_this,
        import_interop: built_config.config.import_interop(),
        no_interop: built_config.config.no_interop,
        ignore_dynamic: built_config.config.ignore_dynamic,
        preserve_import_meta: built_config.config.preserve_import_meta,
        lazy: built_config.config.lazy,
        export_interop_annotation: false,
        module_id: None,
        source_map: Some(cm),
    };

    visit_mut_pass(ModuleTransform::new(
        module_config,
        resolver,
        unresolved_mark,
        None::<swc_common::comments::NoopComments>,
        false, // UMD doesn't use arrow functions
        available_features.support_block_scoping,
    ))
}
