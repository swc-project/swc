//! JavaScript minifier implemented in rust.
//!
//! # Assumptions
//!
//! Like other minification tools, swc minifier assumes some things about the
//! input code.
//!
//!  - TDZ violation does not exist.
//!
//! In other words, TDZ violation will be ignored.
//!
//!  - Acesssing top-level identifiers do not have side effects.
//!
//! If you declare a variable on `globalThis` using a getter with side-effects,
//! swc minifier will break it.
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
#![allow(clippy::blocks_in_conditions)]
#![allow(clippy::collapsible_else_if)]
#![allow(clippy::collapsible_if)]
#![allow(clippy::ptr_arg)]
#![allow(clippy::vec_box)]
#![allow(clippy::overly_complex_bool_expr)]
#![allow(clippy::mutable_key_type)]
#![allow(clippy::only_used_in_recursion)]
#![allow(unstable_name_collisions)]
#![allow(clippy::match_like_matches_macro)]

use once_cell::sync::Lazy;
use pass::mangle_names::mangle_names;
use swc_common::{comments::Comments, pass::Repeated, sync::Lrc, SourceMap, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_transforms_optimization::debug_assert_valid;
use swc_ecma_usage_analyzer::marks::Marks;
use swc_ecma_utils::ExprCtx;
use swc_ecma_visit::VisitMutWith;
use swc_timer::timer;

pub use crate::pass::global_defs::globals_defs;
use crate::{
    compress::{compressor, pure_optimizer, PureOptimizerConfig},
    metadata::info_marker,
    mode::{Minification, Mode},
    option::{CompressOptions, ExtraOptions, MinifyOptions},
    pass::{
        global_defs, mangle_names::idents_to_preserve, mangle_props::mangle_properties,
        merge_exports::merge_exports, postcompress::postcompress_optimizer,
        precompress::precompress_optimizer,
    },
    // program_data::ModuleInfo,
    timing::Timings,
    util::base54::CharFreq,
};

#[macro_use]
mod macros;
mod compress;
mod debug;
pub mod eval;
#[doc(hidden)]
pub mod js;
mod metadata;
mod mode;
pub mod option;
mod pass;
mod program_data;
mod size_hint;
pub mod timing;
mod util;

pub mod marks {
    pub use swc_ecma_usage_analyzer::marks::Marks;
}

const DISABLE_BUGGY_PASSES: bool = true;

pub(crate) static CPU_COUNT: Lazy<usize> = Lazy::new(num_cpus::get);
pub(crate) static HEAVY_TASK_PARALLELS: Lazy<usize> = Lazy::new(|| *CPU_COUNT * 8);
pub(crate) static LIGHT_TASK_PARALLELS: Lazy<usize> = Lazy::new(|| *CPU_COUNT * 100);

pub fn optimize(
    mut n: Program,
    _cm: Lrc<SourceMap>,
    comments: Option<&dyn Comments>,
    mut timings: Option<&mut Timings>,
    options: &MinifyOptions,
    extra: &ExtraOptions,
) -> Program {
    let _timer = timer!("minify");

    let mut marks = Marks::new();
    marks.top_level_ctxt = SyntaxContext::empty().apply_mark(extra.top_level_mark);
    marks.unresolved_mark = extra.unresolved_mark;

    debug_assert_valid(&n);

    if let Some(defs) = options.compress.as_ref().map(|c| &c.global_defs) {
        let _timer = timer!("inline global defs");
        // Apply global defs.
        //
        // As terser treats `CONFIG['VALUE']` and `CONFIG.VALUE` differently, we don't
        // have to see if optimized code matches global definition and we can run
        // this at startup.

        if !defs.is_empty() {
            let defs = defs.iter().map(|(k, v)| (k.clone(), v.clone())).collect();
            n.visit_mut_with(&mut global_defs::globals_defs(
                defs,
                extra.unresolved_mark,
                extra.top_level_mark,
            ));
        }
    }

    if let Some(_options) = &options.compress {
        let _timer = timer!("precompress");

        n.visit_mut_with(&mut precompress_optimizer(ExprCtx {
            unresolved_ctxt: SyntaxContext::empty().apply_mark(marks.unresolved_mark),
            is_unresolved_ref_safe: false,
            in_strict: false,
        }));
        debug_assert_valid(&n);
    }

    if options.compress.is_some() {
        n.visit_mut_with(&mut info_marker(
            options.compress.as_ref(),
            comments,
            marks,
            // extra.unresolved_mark,
        ));
        debug_assert_valid(&n);
    }

    if options.wrap {
        // TODO: wrap_common_js
        // toplevel = toplevel.wrap_commonjs(options.wrap);
    }

    if options.enclose {
        // TODO: enclose
        // toplevel = toplevel.wrap_enclose(options.enclose);
    }
    if let Some(ref mut t) = timings {
        t.section("compress");
    }
    if let Some(options) = &options.compress {
        if options.unused {
            perform_dce(&mut n, options, extra);
            debug_assert_valid(&n);
        }
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
        // n.visit_mut_with(&mut name_expander());
    }

    if let Some(ref mut t) = timings {
        t.section("compress");
    }
    if let Some(c) = &options.compress {
        {
            let _timer = timer!("compress ast");

            n.visit_mut_with(&mut compressor(
                marks,
                c,
                options.mangle.as_ref(),
                &Minification,
            ))
        }

        // Again, we don't need to validate ast

        let _timer = timer!("postcompress");

        n.visit_mut_with(&mut postcompress_optimizer(c));

        let mut pass = 0;
        loop {
            pass += 1;

            let mut v = pure_optimizer(
                c,
                marks,
                PureOptimizerConfig {
                    force_str_for_tpl: Minification.force_str_for_tpl(),
                    enable_join_vars: true,
                    #[cfg(feature = "debug")]
                    debug_infinite_loop: false,
                },
            );
            n.visit_mut_with(&mut v);
            if !v.changed() || c.passes <= pass {
                break;
            }
        }
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

        let preserved = idents_to_preserve(mangle, marks, &n);

        let chars = CharFreq::compute(
            &n,
            &preserved,
            SyntaxContext::empty().apply_mark(marks.unresolved_mark),
        )
        .compile();

        mangle_names(
            &mut n,
            mangle,
            preserved,
            chars,
            extra.top_level_mark,
            extra.mangle_name_cache.clone(),
        );

        if let Some(property_mangle_options) = &mangle.props {
            mangle_properties(&mut n, property_mangle_options.clone(), chars);
        }
    }

    n.visit_mut_with(&mut merge_exports());

    if let Some(ref mut t) = timings {
        t.section("hygiene");
        t.end_section();
    }

    n
}

fn perform_dce(m: &mut Program, options: &CompressOptions, extra: &ExtraOptions) {
    let _timer = timer!("remove dead code");

    let mut visitor = swc_ecma_transforms_optimization::simplify::dce::dce(
        swc_ecma_transforms_optimization::simplify::dce::Config {
            module_mark: None,
            top_level: options.top_level(),
            top_retain: options.top_retain.clone(),
            preserve_imports_with_side_effects: true,
        },
        extra.unresolved_mark,
    );

    loop {
        #[cfg(feature = "debug")]
        let start = crate::debug::dump(&*m, false);

        m.visit_mut_with(&mut visitor);

        #[cfg(feature = "debug")]
        if visitor.changed() {
            let src = crate::debug::dump(&*m, false);
            tracing::debug!(
                "===== Before DCE =====\n{}\n===== After DCE =====\n{}",
                start,
                src
            );
        }

        if !visitor.changed() {
            break;
        }

        visitor.reset();
    }

    debug_assert_valid(&*m);
}
