use swc_common::chain;
use swc_ecma_visit::VisitMut;

use crate::{marks::Marks, option::MangleOptions};

mod analyzer;
mod preserver;
mod private_name;
mod real_impl;

pub(crate) fn name_mangler(options: MangleOptions, marks: Marks) -> impl VisitMut {
    chain!(
        self::private_name::private_name_mangler(options.keep_private_props),
        self::real_impl::name_mangler(options, marks,)
    )
}
