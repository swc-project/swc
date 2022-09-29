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
#![allow(clippy::blocks_in_if_conditions)]
#![allow(clippy::collapsible_else_if)]
#![allow(clippy::collapsible_if)]
#![allow(clippy::ptr_arg)]
#![allow(clippy::vec_box)]
#![allow(clippy::overly_complex_bool_expr)]
#![allow(clippy::only_used_in_recursion)]
#![allow(unstable_name_collisions)]
#![allow(clippy::match_like_matches_macro)]

use once_cell::sync::Lazy;
use swc_common::{
    comments::Comments,
    pass::{Repeat, Repeated},
    sync::Lrc,
    SourceMap, SyntaxContext,
};
use swc_ecma_ast::*;
use swc_ecma_transforms_optimization::debug_assert_valid;
use swc_ecma_visit::VisitMutWith;
use swc_timer::timer;

pub use crate::pass::unique_scope::unique_scope;
use crate::{
    analyzer::ModuleInfo,
    compress::{compressor, pure_optimizer, PureOptimizerConfig},
    marks::Marks,
    metadata::info_marker,
    mode::{Minification, Mode},
    option::{CompressOptions, ExtraOptions, MinifyOptions},
    pass::{
        expand_names::name_expander,
        global_defs,
        mangle_names::{idents_to_preserve, name_mangler},
        mangle_props::mangle_properties,
        merge_exports::merge_exports,
        postcompress::postcompress_optimizer,
        precompress::precompress_optimizer,
    },
    timing::Timings,
    util::base54::CharFreq,
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

    let module_info = match &m {
        Program::Script(_) => ModuleInfo::default(),
        Program::Module(m) => ModuleInfo {
            blackbox_imports: m
                .body
                .iter()
                .filter_map(|v| v.as_module_decl())
                .filter_map(|v| match v {
                    ModuleDecl::Import(i) => Some(i),
                    _ => None,
                })
                .filter(|i| !i.src.value.starts_with("@swc/helpers"))
                .flat_map(|v| v.specifiers.iter())
                .map(|v| match v {
                    ImportSpecifier::Named(v) => v.local.to_id(),
                    ImportSpecifier::Default(v) => v.local.to_id(),
                    ImportSpecifier::Namespace(v) => v.local.to_id(),
                })
                .collect(),
            // exports: m
            //     .body
            //     .iter()
            //     .filter_map(|v| v.as_module_decl())
            //     .filter_map(|v| match v {
            //         ModuleDecl::ExportNamed(i) if i.src.is_none() => Some(i),
            //         _ => None,
            //     })
            //     .flat_map(|v| v.specifiers.iter())
            //     .filter_map(|v| match v {
            //         ExportSpecifier::Named(v) => Some(v),
            //         _ => None,
            //     })
            //     .filter_map(|v| match &v.orig {
            //         ModuleExportName::Ident(i) => Some(i.to_id()),
            //         ModuleExportName::Str(_) => None,
            //     })
            //     .collect(),
        },
    };

    if let Some(_options) = &options.compress {
        let _timer = timer!("precompress");

        m.visit_mut_with(&mut precompress_optimizer());
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
    if let Some(ref mut t) = timings {
        t.section("compress");
    }
    if let Some(options) = &options.compress {
        if options.unused {
            perform_dce(&mut m, options, extra)
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
        m.visit_mut_with(&mut name_expander());
    }

    if let Some(ref mut t) = timings {
        t.section("compress");
    }
    if let Some(options) = &options.compress {
        {
            let _timer = timer!("compress ast");

            m.visit_mut_with(&mut compressor(&module_info, marks, options, &Minification))
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

        let preserved = idents_to_preserve(mangle.clone(), &m);

        let chars = CharFreq::compute(
            &m,
            &preserved,
            SyntaxContext::empty().apply_mark(marks.unresolved_mark),
        )
        .compile();

        m.visit_mut_with(&mut name_mangler(mangle.clone(), preserved, chars));

        if let Some(property_mangle_options) = &mangle.props {
            mangle_properties(&mut m, &module_info, property_mangle_options.clone(), chars);
        }
    }

    m.visit_mut_with(&mut merge_exports());

    if let Some(ref mut t) = timings {
        t.section("hygiene");
        t.end_section();
    }

    m
}

fn perform_dce(m: &mut Program, options: &CompressOptions, extra: &ExtraOptions) {
    let _timer = timer!("remove dead code");

    let mut visitor = swc_ecma_transforms_optimization::simplify::dce::dce(
        swc_ecma_transforms_optimization::simplify::dce::Config {
            module_mark: None,
            top_level: options.top_level(),
            top_retain: options.top_retain.clone(),
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
