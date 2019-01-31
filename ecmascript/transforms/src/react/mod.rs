pub use self::{
    display_name::display_name,
    jsx::{jsx, Options},
    jsx_self::jsx_self,
    jsx_src::jsx_src,
};
use crate::{helpers::Helpers, pass::Pass};
use std::sync::Arc;
use swc_common::{sync::Lrc, SourceMap};

mod display_name;
mod jsx;
mod jsx_self;
mod jsx_src;

/// `@babel/preset-react`
///
/// Preset for all React plugins.
pub fn react(cm: Lrc<SourceMap>, options: Options, helpers: Arc<Helpers>) -> impl Pass + Clone {
    let Options { development, .. } = options;

    chain!(
        jsx(cm.clone(), options, helpers),
        display_name(),
        jsx_src(development, cm),
        jsx_self(development)
    )
}
