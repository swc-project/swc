use swc_common::Mark;
use swc_ecma_ast::Pass;
use swc_ecma_visit::visit_mut_pass;

pub use super::util::Config;
use crate::{
    module_transform::{ModuleConfig, ModuleTransform, TransformMode},
    path::Resolver,
};

#[derive(Default)]
pub struct FeatureFlag {
    pub support_block_scoping: bool,
    pub support_arrow: bool,
}

/// Create a CommonJS module transform
pub fn common_js(
    resolver: Resolver,
    unresolved_mark: Mark,
    config: Config,
    available_features: FeatureFlag,
) -> impl Pass {
    let import_interop = config.import_interop();
    let export_interop_annotation = config.export_interop_annotation();

    let module_config = ModuleConfig {
        mode: TransformMode::CommonJs,
        strict_mode: config.strict_mode,
        allow_top_level_this: config.allow_top_level_this,
        import_interop,
        no_interop: config.no_interop,
        ignore_dynamic: config.ignore_dynamic,
        preserve_import_meta: config.preserve_import_meta,
        lazy: config.lazy,
        export_interop_annotation,
        module_id: None,
        umd_globals: Default::default(),
        source_map: None,
    };

    visit_mut_pass(ModuleTransform::new(
        module_config,
        resolver,
        unresolved_mark,
        None::<swc_common::comments::NoopComments>,
        available_features.support_arrow,
        available_features.support_block_scoping,
    ))
}
