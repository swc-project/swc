//! New-generation javascript to old-javascript compiler.
#![deny(clippy::all)]
#![allow(clippy::vec_box)]
#![allow(clippy::match_like_matches_macro)]

pub use self::{
    bugfixes::bugfixes, es2015::es2015, es2016::es2016, es2017::es2017, es2018::es2018,
    es2019::es2019, es2020::es2020, es2021::es2021, es2022::es2022, es3::es3,
};

#[macro_use]
mod macros;
pub mod bugfixes;
pub mod es2015;
pub mod es2016;
pub mod es2017;
pub mod es2018;
pub mod es2019;
pub mod es2020;
pub mod es2021;
pub mod es2022;
pub mod es3;
pub mod regexp;
pub mod reserved_words;
