//! Javascript minifier implemented in rust.
//!
//! # Debugging
//!
//! In debug build, if you set an environment variable `SWC_CHECK` to `1`, the
//! minifier will check the validity of the syntax using `node --check`
//!
//! # Cargo features
//!
//! ## `debug`
//!
//! If you enable this cargo feature and set the environment variable named
//! `SWC_RUN` to `1`, the minifier will validate the code using node before each
//! step.
#![deny(clippy::all)]
#![deny(unused)]
#![allow(clippy::blocks_in_if_conditions)]
#![allow(clippy::collapsible_else_if)]
#![allow(clippy::collapsible_if)]
#![allow(clippy::ptr_arg)]
#![allow(clippy::vec_box)]
#![allow(clippy::logic_bug)]
#![allow(unstable_name_collisions)]

use compress::{pure_optimizer, PureOptimizerConfig};
use mode::Mode;
use once_cell::sync::Lazy;
use swc_common::{comments::Comments, pass::Repeat, sync::Lrc, SourceMap, GLOBALS};
use swc_ecma_ast::Program;
use swc_ecma_visit::{FoldWith, VisitMutWith};
use swc_timer::timer;
use timing::Timings;

pub use self::analyzer::dump_snapshot;
pub use crate::pass::unique_scope::unique_scope;
use crate::{
    compress::compressor,
    marks::Marks,
    metadata::info_marker,
    mode::Minification,
    option::{ExtraOptions, MinifyOptions},
    pass::{
        expand_names::name_expander, global_defs, mangle_names::name_mangler,
        mangle_props::mangle_properties, merge_exports::merge_exports,
        postcompress::postcompress_optimizer, precompress::precompress_optimizer,
    },
};

#[macro_use]
mod macros;
mod alias;
mod analyzer;
mod compress;
mod debug;
pub mod eval;
pub mod marks;
mod metadata;
mod mode;
pub mod option;
mod pass;
pub mod timing;
mod util;

const DISABLE_BUGGY_PASSES: bool = true;
const MAX_PAR_DEPTH: u8 = 3;

pub(crate) static CPU_COUNT: Lazy<usize> = Lazy::new(num_cpus::get);
pub(crate) static HEAVY_TASK_PARALLELS: Lazy<usize> = Lazy::new(|| *CPU_COUNT * 8);
pub(crate) static LIGHT_TASK_PARALLELS: Lazy<usize> = Lazy::new(|| *CPU_COUNT * 100);

pub fn optimize(
    mut m: Program,
    _cm: Lrc<SourceMap>,
    comments: Option<&dyn Comments>,
    mut timings: Option<&mut Timings>,
    options: &MinifyOptions,
    extra: &ExtraOptions,
) -> Program {
    let _timer = timer!("minify");

    let mut marks = Marks::new();
    marks.unresolved_mark = extra.unresolved_mark;

    if let Some(defs) = options.compress.as_ref().map(|c| &c.global_defs) {
        let _timer = timer!("inline global defs");
        // Apply global defs.
        //
        // As terser treats `CONFIG['VALUE']` and `CONFIG.VALUE` differently, we don't
        // have to see if optimized code matches global definition and we can run
        // this at startup.

        if !defs.is_empty() {
            let defs = defs.iter().map(|(k, v)| (k.clone(), v.clone())).collect();
            m.visit_mut_with(&mut global_defs::globals_defs(
                defs,
                extra.unresolved_mark,
                extra.top_level_mark,
            ));
        }
    }

    if let Some(options) = &options.compress {
        let _timer = timer!("precompress");

        m.visit_mut_with(&mut precompress_optimizer(options, marks));
    }

    if options.compress.is_some() {
        m.visit_mut_with(&mut info_marker(
            options.compress.as_ref(),
            comments,
            marks,
            extra.unresolved_mark,
        ));
    }
    m.visit_mut_with(&mut unique_scope());

    if options.wrap {
        // TODO: wrap_common_js
        // toplevel = toplevel.wrap_commonjs(options.wrap);
    }

    if options.enclose {
        // TODO: enclose
        // toplevel = toplevel.wrap_enclose(options.enclose);
    }

    // We don't need validation.

    if let Some(ref mut _t) = timings {
        // TODO: store `rename`
    }

    // Noop.
    // https://github.com/mishoo/UglifyJS2/issues/2794
    if options.rename && DISABLE_BUGGY_PASSES {
        // toplevel.figure_out_scope(options.mangle);
        // TODO: Pass `options.mangle` to name expander.
        m.visit_mut_with(&mut name_expander());
    }

    if let Some(ref mut t) = timings {
        t.section("compress");
    }
    if let Some(options) = &options.compress {
        {
            let _timer = timer!("compress ast");

            m = GLOBALS.with(|globals| {
                m.fold_with(&mut compressor(globals, marks, options, &Minification))
            });
        }

        // Again, we don't need to validate ast

        let _timer = timer!("postcompress");

        m.visit_mut_with(&mut postcompress_optimizer(options));
        m.visit_mut_with(&mut Repeat::new(pure_optimizer(
            options,
            None,
            marks,
            PureOptimizerConfig {
                force_str_for_tpl: Minification::force_str_for_tpl(),
                enable_join_vars: true,
                #[cfg(feature = "debug")]
                debug_infinite_loop: false,
            },
        )));
    }

    if let Some(ref mut _t) = timings {
        // TODO: store `scope`
    }
    if options.mangle.is_some() {
        // toplevel.figure_out_scope(options.mangle);
    }

    if let Some(ref mut t) = timings {
        t.section("mangle");
    }

    if let Some(mangle) = &options.mangle {
        let _timer = timer!("mangle names");
        // TODO: base54.reset();

        m.visit_mut_with(&mut name_mangler(mangle.clone(), marks));
    }

    if let Some(property_mangle_options) = options.mangle.as_ref().and_then(|o| o.props.as_ref()) {
        mangle_properties(&mut m, property_mangle_options.clone());
    }

    m.visit_mut_with(&mut merge_exports());

    if let Some(ref mut t) = timings {
        t.section("hygiene");
        t.end_section();
    }

    m
}
