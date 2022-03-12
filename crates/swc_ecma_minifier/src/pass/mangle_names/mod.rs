use swc_common::{chain, SyntaxContext};
use swc_ecma_visit::VisitMut;

use crate::{marks::Marks, option::MangleOptions};

mod analyzer;
mod preserver;
mod private_name;
mod real_impl;
mod rename_map;

pub(crate) fn name_mangler(
    options: MangleOptions,
    marks: Marks,
    top_level_ctxt: SyntaxContext,
) -> impl VisitMut {
    chain!(
        self::private_name::private_name_mangler(options.keep_private_props),
        self::real_impl::name_mangler(options, marks, top_level_ctxt)
    )
}
