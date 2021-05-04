pub use self::jsx::Runtime;
pub use self::refresh::options::RefreshOptions;
pub use self::{
    display_name::display_name,
    jsx::{jsx, Options},
    jsx_self::jsx_self,
    jsx_src::jsx_src,
    pure_annotations::pure_annotations,
    refresh::refresh,
};
use std::mem;
use swc_common::{chain, comments::Comments, sync::Lrc, SourceMap};
use swc_ecma_visit::Fold;

mod display_name;
mod jsx;
mod jsx_self;
mod jsx_src;
mod pure_annotations;
mod refresh;

/// `@babel/preset-react`
///
/// Preset for all React plugins.
pub fn react<C>(cm: Lrc<SourceMap>, comments: Option<C>, mut options: Options) -> impl Fold
where
    C: Comments + Clone,
{
    let Options { development, .. } = options;

    let refresh_options = mem::replace(&mut options.refresh, None);

    chain!(
        jsx_src(development, cm.clone()),
        jsx_self(development),
        refresh(development, refresh_options, cm.clone(), comments.clone()),
        jsx(cm.clone(), comments.clone(), options),
        display_name(),
        pure_annotations(comments),
    )
}
