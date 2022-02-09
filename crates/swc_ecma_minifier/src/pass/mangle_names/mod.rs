use super::compute_char_freq::CharFreqInfo;
use crate::{marks::Marks, option::MangleOptions};
use swc_common::chain;
use swc_ecma_visit::VisitMut;

mod analyzer;
mod preserver;
mod private_name;
mod real_impl;

pub(crate) fn name_mangler(
    options: MangleOptions,
    char_freq_info: CharFreqInfo,
    marks: Marks,
) -> impl VisitMut {
    chain!(
        self::private_name::private_name_mangler(options.keep_private_props),
        self::real_impl::name_mangler(options, char_freq_info, marks)
    )
}
