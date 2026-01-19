#![deny(clippy::all)]
#![allow(clippy::mutable_key_type)]
#![allow(clippy::arc_with_non_send_sync)]
#![allow(rustc::untranslatable_diagnostic_trivial)]
#![cfg_attr(not(feature = "concurrent"), allow(unused))]

use swc_common::{comments::Comments, sync::Lrc, Mark, SourceMap};
use swc_ecma_ast::Pass;

// Re-export old function names for compatibility
pub fn display_name() -> impl Pass {}

pub fn jsx_self(dev: bool) -> impl Pass {}

pub fn jsx_src(dev: bool, cm: Lrc<SourceMap>) -> impl Pass {}

pub fn pure_annotations<C>(comments: Option<C>) -> impl Pass
where
    C: Comments,
{
}

pub fn refresh<C: Comments>(
    dev: bool,
    options: Option<RefreshOptions>,
    cm: Lrc<SourceMap>,
    comments: Option<C>,
    global_mark: Mark,
) -> impl Pass {
}

/// `@babel/preset-react`
///
/// Preset for all React plugins.
///
///
/// `top_level_mark` should be [Mark] passed to
/// [swc_ecma_transforms_base::resolver::resolver_with_mark].
///
///
///
/// # Note
///
/// This pass uses [swc_ecma_utils::HANDLER].
pub fn react<C>(
    cm: Lrc<SourceMap>,
    comments: Option<C>,
    mut options: Options,
    top_level_mark: Mark,
    unresolved_mark: Mark,
) -> impl Pass
where
    C: Comments + Clone,
{
}
