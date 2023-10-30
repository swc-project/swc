use serde::Deserialize;
use swc_common::Mark;
use swc_ecma_compat_es2022::optional_chaining_impl::optional_chaining_impl;
use swc_ecma_visit::{as_folder, Fold, VisitMut};

pub fn optional_chaining(c: Config, unresolved_mark: Mark) -> impl Fold + VisitMut {
    as_folder(optional_chaining_impl(
        swc_ecma_compat_es2022::optional_chaining_impl::Config {
            no_document_all: c.no_document_all,
            pure_getter: c.pure_getter,
        },
        unresolved_mark,
    ))
}

#[derive(Debug, Clone, Copy, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub no_document_all: bool,
    #[serde(default)]
    pub pure_getter: bool,
}
