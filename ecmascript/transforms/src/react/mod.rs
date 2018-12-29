pub use self::{
    display_name::display_name,
    jsx::{jsx, Options},
    jsx_self::jsx_self,
    jsx_src::jsx_src,
};
use ast::Module;
use swc_common::{sync::Lrc, Fold, SourceMap};

mod display_name;
mod jsx;
mod jsx_self;
mod jsx_src;

/// `@babel/preset-react`
///
/// Preset for all React plugins.
pub fn react(cm: Lrc<SourceMap>, options: Options) -> impl Fold<Module> {
    let Options { development, .. } = options;

    chain!(
        jsx(cm.clone(), options),
        display_name(),
        jsx_src(development, cm),
        jsx_self(development)
    )
}
