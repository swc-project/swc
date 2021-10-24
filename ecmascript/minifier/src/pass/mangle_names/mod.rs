use super::compute_char_freq::CharFreqInfo;
use crate::{marks::Marks, option::MangleOptions};
use swc_common::{
    chain,
    collections::{AHashMap, AHashSet},
};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

mod analyzer;
mod preserver;
mod private_name;
mod v2;

pub(crate) fn name_mangler(
    options: MangleOptions,
    char_freq_info: CharFreqInfo,
    marks: Marks,
) -> impl VisitMut {
    chain!(
        self::private_name::private_name_mangler(options.keep_private_props),
        self::v2::name_mangler(options, char_freq_info, marks)
    )
}
