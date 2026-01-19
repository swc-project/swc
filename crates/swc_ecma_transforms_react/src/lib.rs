//! React transforms for SWC.
//!
//! This crate provides transforms for React/JSX code, including:
//!
//! - JSX transform (classic and automatic runtime)
//! - JSX self transform (`__self` attribute)
//! - JSX source transform (`__source` attribute)
//! - Display name transform
//! - Pure annotations transform
//! - React Fast Refresh transform
//!
//! # Example
//!
//! ```ignore
//! use swc_common::{sync::Lrc, SourceMap, Mark};
//! use swc_ecma_transforms_react::{react, Options};
//!
//! let cm = Lrc::new(SourceMap::default());
//! let options = Options::default();
//! let pass = react(cm, None::<NoopComments>, options, Mark::new(), Mark::new());
//! ```

#![deny(clippy::all)]
#![allow(clippy::mutable_key_type)]
#![allow(clippy::arc_with_non_send_sync)]
#![allow(rustc::untranslatable_diagnostic_trivial)]
#![cfg_attr(not(feature = "concurrent"), allow(unused))]

use swc_common::{comments::Comments, sync::Lrc, Mark, SourceMap};
use swc_ecma_ast::Pass;
use swc_ecma_hooks::{CompositeHook, VisitMutHook, VisitMutWithHook};
use swc_ecma_visit::visit_mut_pass;

mod display_name;
mod jsx;
mod jsx_self;
mod jsx_src;
mod options;
mod pragma;
mod pure_annotations;
mod refresh;

pub use self::{
    options::{default_pragma, default_pragma_frag, Options, RefreshOptions, Runtime},
    pragma::{parse_expr_for_jsx, JsxDirectives},
};

/// Alias for `react` - JSX transform.
///
/// This is provided for backward compatibility.
pub fn jsx<C>(
    cm: Lrc<SourceMap>,
    comments: Option<C>,
    options: Options,
    top_level_mark: Mark,
    unresolved_mark: Mark,
) -> impl Pass
where
    C: Comments + Clone,
{
    react(cm, comments, options, top_level_mark, unresolved_mark)
}

/// `@babel/preset-react`
///
/// Preset for all React plugins.
///
/// `top_level_mark` should be [Mark] passed to
/// [swc_ecma_transforms_base::resolver::resolver_with_mark].
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
    let development = options.development.unwrap_or(false);
    let refresh_options = options.refresh.take();

    // Compose hooks in order:
    // 1. jsx_src - adds __source attribute (must run BEFORE jsx transform)
    // 2. jsx_self - adds __self attribute (must run BEFORE jsx transform)
    // 3. refresh - React Fast Refresh (runs on JSX before transform)
    // 4. jsx - main JSX transform (converts JSX to function calls)
    // 5. display_name - adds displayName to createClass calls
    // 6. pure_annotations - adds PURE comments

    let jsx_src_hook = jsx_src::hook(development, cm.clone());
    let jsx_self_hook = jsx_self::hook(development);
    let refresh_hook = refresh::hook(
        development,
        refresh_options,
        cm.clone(),
        comments.clone(),
        top_level_mark,
    );
    let jsx_hook = jsx::hook(
        cm.clone(),
        comments.clone(),
        options,
        top_level_mark,
        unresolved_mark,
    );
    let display_name_hook = display_name::hook();
    let pure_annotations_hook = pure_annotations::hook(comments);

    // Chain hooks using CompositeHook
    let hook = CompositeHook {
        first: jsx_src_hook,
        second: CompositeHook {
            first: jsx_self_hook,
            second: CompositeHook {
                first: refresh_hook,
                second: CompositeHook {
                    first: jsx_hook,
                    second: CompositeHook {
                        first: display_name_hook,
                        second: pure_annotations_hook,
                    },
                },
            },
        },
    };

    visit_mut_pass(VisitMutWithHook { hook, context: () })
}

/// Adds `displayName` property to React.createClass calls.
///
/// ```js
/// var Foo = React.createClass({});
/// ```
/// becomes:
/// ```js
/// var Foo = React.createClass({ displayName: "Foo" });
/// ```
pub fn display_name() -> impl Pass {
    let hook = display_name::hook();
    visit_mut_pass(VisitMutWithHook { hook, context: () })
}

/// Adds `__self={this}` attribute to JSX elements in development mode.
///
/// This helps React provide better error messages.
pub fn jsx_self(dev: bool) -> impl Pass {
    let hook = jsx_self::hook(dev);
    visit_mut_pass(VisitMutWithHook { hook, context: () })
}

/// Adds `__source={{ fileName, lineNumber, columnNumber }}` attribute to JSX
/// elements in development mode.
///
/// This helps React provide better error messages with source location.
pub fn jsx_src(dev: bool, cm: Lrc<SourceMap>) -> impl Pass {
    let hook = jsx_src::hook(dev, cm);
    visit_mut_pass(VisitMutWithHook { hook, context: () })
}

/// Adds `/*#__PURE__*/` comments to React function calls for tree-shaking.
///
/// This helps bundlers identify side-effect free function calls
/// that can be removed during dead code elimination.
pub fn pure_annotations<C>(comments: Option<C>) -> impl Pass
where
    C: Comments,
{
    let hook = pure_annotations::hook(comments);
    visit_mut_pass(VisitMutWithHook { hook, context: () })
}

/// React Fast Refresh transform.
///
/// Adds registration and signature tracking for React components
/// to enable Hot Module Replacement (HMR).
pub fn refresh<C: Comments>(
    dev: bool,
    options: Option<RefreshOptions>,
    cm: Lrc<SourceMap>,
    comments: Option<C>,
    global_mark: Mark,
) -> impl Pass {
    let hook = refresh::hook(dev, options, cm, comments, global_mark);
    visit_mut_pass(VisitMutWithHook { hook, context: () })
}
