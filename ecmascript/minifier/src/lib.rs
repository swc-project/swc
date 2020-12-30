//! Javascript minifier implemented in rust.
//!
//! Note: Passes should be visited only with [Module] and it's an error to feed
//! them something other. Don't call methods like `visit_mut_script` nor
//! `visit_mut_module_items`.

use crate::option::Options;
use crate::pass::compress::compressor;
use crate::pass::compute_char_freq::compute_char_freq;
use crate::pass::expand_names::name_expander;
use crate::pass::mangle_names::name_mangler;
use crate::pass::mangle_props::property_mangler;
use swc_ecma_ast::Module;
use swc_ecma_visit::VisitMutWith;
use timing::Timings;

mod id;
pub mod option;
pub mod pass;
pub mod timing;
mod util;

#[inline]
pub fn optimize(m: &mut Module, timings: &mut Option<Timings>, options: &Options) {
    // TODO: reserve_quoted_keys
    // if (quoted_props && options.mangle.properties.keep_quoted !== "strict") {
    //     reserve_quoted_keys(toplevel, quoted_props);
    // }

    if options.wrap {
        // TODO: wrap_common_js
        // toplevel = toplevel.wrap_commonjs(options.wrap);
    }

    if options.enclose {
        // TODO: enclose
        // toplevel = toplevel.wrap_enclose(options.enclose);
    }

    // We don't need validation.

    if let Some(_t) = timings {
        // TODO: store `rename`
    }

    // Noop.
    // https://github.com/mishoo/UglifyJS2/issues/2794
    if options.rename && false {
        // toplevel.figure_out_scope(options.mangle);
        // TODO: Pass `options.mangle` to name expander.
        m.visit_mut_with(&mut name_expander());
    }

    if let Some(_t) = timings {
        // TODO: store `compress`
    }
    if options.compress {
        m.visit_mut_with(&mut compressor());
        // Again, we don't need to validate ast
    }

    if let Some(_t) = timings {
        // TODO: store `scope`
    }
    if options.mangle.is_some() {
        // toplevel.figure_out_scope(options.mangle);
    }

    if let Some(_t) = timings {
        // TODO: store `mangle`
    }

    if options.mangle.is_some() {
        // TODO: base54.reset();

        let char_freq_info = compute_char_freq(&m);
        m.visit_mut_with(&mut name_mangler(char_freq_info));
    }

    if let Some(_t) = timings {
        // TODO: store `properties`
    }

    if options
        .mangle
        .as_ref()
        .map(|o| o.properties)
        .unwrap_or(false)
    {
        m.visit_mut_with(&mut property_mangler());
    }
}
