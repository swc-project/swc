//! New-generation javascript to old-javascript compiler.
#![deny(clippy::all)]
#![allow(clippy::vec_box)]
#![allow(clippy::boxed_local)]
#![allow(clippy::mutable_key_type)]
#![allow(clippy::match_like_matches_macro)]

pub use swc_ecma_compat_bugfixes as bugfixes;
pub use swc_ecma_compat_common::regexp;
pub use swc_ecma_compat_es2015 as es2015;
pub use swc_ecma_compat_es2016 as es2016;
pub use swc_ecma_compat_es2017 as es2017;
pub use swc_ecma_compat_es2018 as es2018;
pub use swc_ecma_compat_es2019 as es2019;
pub use swc_ecma_compat_es2020 as es2020;
pub use swc_ecma_compat_es2021 as es2021;
pub use swc_ecma_compat_es2022 as es2022;
pub use swc_ecma_compat_es3 as es3;

pub use self::{
    bugfixes::bugfixes, es2015::es2015, es2016::es2016, es2017::es2017, es2018::es2018,
    es2019::es2019, es2020::es2020, es2021::es2021, es2022::es2022, es3::es3,
};
pub mod class_fields_use_set;
pub mod reserved_words;
