use crate::option::Options;
use crate::pass::compress::compressor;
use crate::pass::compute_char_freq::compute_char_freq;
use crate::pass::mangle_names::mangle_names;
use swc_ecma_ast::Module;
use swc_ecma_visit::VisitMutWith;
use timing::Timings;

mod id;
pub mod option;
pub mod pass;
pub mod timing;

#[inline]
pub fn optimize(m: &mut Module, timings: &mut Option<Timings>, options: &Options) {
    // TODO: reserve_quoted_keys
    // TODO: enclose
    // TODO: wrap

    // We don't need validation.

    if let Some(_t) = timings {
        // TODO: store `rename`
    }

    if options.rename {
        // toplevel.figure_out_scope(options.mangle);
        // toplevel.expand_names(options.mangle);
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
        let char_freq_info = compute_char_freq(&m);
        m.visit_mut_with(&mut mangle_names(char_freq_info));
    }

    if let Some(_t) = timings {
        // TODO: store `properties`
    }

    if options.mangle.map(|o| o.properties).unwrap_or(false) {
        m.visit_mut_with(&mut mangle_properties());
    }
}
