//! Public module resolver types and constructors.

use std::path::PathBuf;

use rustc_hash::FxHashMap;
use swc_ecma_loader::{
    resolvers::{lru::CachingResolver, node::NodeModulesResolver, tsc::TsConfigResolver},
    TargetEnv,
};

use crate::config::CompiledPaths;

pub type NodeResolver = CachingResolver<NodeModulesResolver>;

pub fn paths_resolver(
    target_env: TargetEnv,
    alias: FxHashMap<String, String>,
    base_url: PathBuf,
    paths: CompiledPaths,
    preserve_symlinks: bool,
) -> CachingResolver<TsConfigResolver<NodeModulesResolver>> {
    let r = TsConfigResolver::new(
        NodeModulesResolver::without_node_modules(target_env, alias, preserve_symlinks),
        base_url,
        paths,
    );
    CachingResolver::new(40, r)
}

pub fn environment_resolver(
    target_env: TargetEnv,
    alias: FxHashMap<String, String>,
    preserve_symlinks: bool,
) -> NodeResolver {
    CachingResolver::new(
        40,
        NodeModulesResolver::new(target_env, alias, preserve_symlinks),
    )
}
