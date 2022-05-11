#![deny(clippy::all)]

use swc_common::{chain, comments::Comments, sync::Lrc, Mark, SourceMap};
use swc_ecma_visit::Fold;

pub use self::{
    display_name::display_name,
    jsx::{jsx, parse_expr_for_jsx, JsxDirectives, Options, Runtime},
    jsx_self::jsx_self,
    jsx_src::jsx_src,
    pure_annotations::pure_annotations,
    refresh::{options::RefreshOptions, refresh},
};

mod display_name;
mod jsx;
mod jsx_self;
mod jsx_src;
mod pure_annotations;
mod refresh;

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
) -> impl Fold
where
    C: Comments + Clone,
{
    let Options { development, .. } = options;
    let development = development.unwrap_or(false);

    let refresh_options = options.refresh.take();

    chain!(
        jsx_src(development, cm.clone()),
        jsx_self(development),
        refresh(development, refresh_options, cm.clone(), comments.clone()),
        jsx(cm, comments.clone(), options, top_level_mark),
        display_name(),
        pure_annotations(comments),
    )
}
