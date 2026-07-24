use std::sync::Arc;

#[cfg(feature = "module")]
use swc_common::FileName;
use swc_common::{comments::SingleThreadedComments, Mark, SourceFile};
use swc_ecma_ast::{EsVersion, Program};
use swc_ecma_parser::Syntax;
#[cfg(feature = "module")]
use swc_ecma_transforms_module::path::ImportResolver;

/// Context values exposed at each hook boundary.
#[derive(Clone, Copy)]
pub(super) struct PipelineContextData {
    pub(super) syntax: Syntax,
    pub(super) target: EsVersion,
    pub(super) unresolved_mark: Mark,
    pub(super) top_level_mark: Mark,
}

#[cfg(feature = "module")]
pub(super) type ModuleResolver = Option<(FileName, Arc<dyn ImportResolver>)>;

#[cfg(not(feature = "module"))]
pub(super) type ModuleResolver = ();

/// The program and associated source state for one compilation.
pub(super) struct CompilationUnit {
    pub(super) source_file: Arc<SourceFile>,
    pub(super) program: Program,
    pub(super) comments: SingleThreadedComments,
    pub(super) flow_strip_script_like_module: bool,
}
