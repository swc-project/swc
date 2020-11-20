#![cfg(feature = "react")]

pub use self::{
    display_name::display_name,
    jsx::{jsx, Options, Runtime},
    jsx_self::jsx_self,
    jsx_src::jsx_src,
};
use swc_common::{chain, comments::Comments, sync::Lrc, SourceMap};
use swc_ecma_visit::Fold;

mod display_name;
mod jsx;
mod jsx_self;
mod jsx_src;

/// `@babel/preset-react`
///
/// Preset for all React plugins.
pub fn react<C>(cm: Lrc<SourceMap>, comments: Option<C>, options: Options) -> impl Fold
where
    C: Comments,
{
    let Options { development, .. } = options;

    chain!(
        jsx(cm.clone(), comments, options),
        display_name(),
        jsx_src(development, cm),
        jsx_self(development)
    )
}
