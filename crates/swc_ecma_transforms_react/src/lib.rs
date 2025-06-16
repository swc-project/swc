#![deny(clippy::all)]
#![allow(clippy::mutable_key_type)]
#![allow(clippy::arc_with_non_send_sync)]
#![allow(rustc::untranslatable_diagnostic_trivial)]
#![cfg_attr(not(feature = "concurrent"), allow(unused))]

use std::mem;

use swc_common::{comments::Comments, sync::Lrc, Mark, SourceMap};
use swc_ecma_ast::Pass;

pub use self::{
    display_name::display_name,
    jsx::*,
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
    options: Options,
    top_level_mark: Mark,
    unresolved_mark: Mark,
) -> impl Pass
where
    C: Comments + Clone,
{
    let development = options.common.development.into_bool();

    let (auto_config, classic_config) = match parse_directives(options.runtime, comments.clone()) {
        Runtime::Automatic(ref mut config) => (Some(mem::take(config)), None),
        Runtime::Classic(ref mut config) => (None, Some(mem::take(config))),
        Runtime::Preserve => unreachable!(),
    };

    let refresh_options = options.refresh;

    (
        jsx_src(development, cm.clone()),
        jsx_self(development),
        refresh(
            development,
            refresh_options,
            cm.clone(),
            comments.clone(),
            top_level_mark,
        ),
        auto_config.map(|config| automatic(config, options.common, unresolved_mark)),
        classic_config.map(|config| classic(config, options.common, top_level_mark, cm.clone())),
        display_name(),
        pure_annotations(comments.clone()),
    )
}
