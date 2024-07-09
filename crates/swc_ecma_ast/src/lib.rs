#![cfg_attr(docsrs, feature(doc_cfg))]
#![deny(unreachable_patterns)]
#![deny(missing_copy_implementations)]
#![deny(trivial_casts)]
#![deny(trivial_numeric_casts)]
#![deny(unreachable_pub)]
#![deny(clippy::all)]
#![allow(clippy::enum_variant_names)]
#![allow(clippy::clone_on_copy)]
#![recursion_limit = "1024"]

#[cfg(feature = "serde")]
use serde::{Deserialize, Serialize};
use swc_common::{ast_node, util::take::Take, EqIgnoreSpan, Span};

pub use self::{
    class::*, decl::*, expr::*, function::*, ident::*, jsx::*, list::*, lit::*, module::*,
    module_decl::*, operators::*, pat::*, prop::*, source_map::*, stmt::*, typescript::*,
};

#[macro_use]
mod macros;
mod class;
mod decl;
mod expr;
mod function;
mod ident;
mod jsx;
mod list;
mod lit;
mod module;
mod module_decl;
mod operators;
mod pat;
mod prop;
mod source_map;
mod stmt;
mod typescript;

/// Represents a invalid node.
#[ast_node("Invalid")]
#[derive(Eq, Default, Hash, Copy, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct Invalid {
    pub span: Span,
}

impl Take for Invalid {
    fn dummy() -> Self {
        Invalid::default()
    }
}

/// Note: This type implements `Serailize` and `Deserialize` if `serde` is
/// enabled, instead of requiring `serde-impl` feature.
#[derive(Debug, Default, Clone, Copy, PartialOrd, Ord, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(Serialize, Deserialize))]
pub enum EsVersion {
    #[cfg_attr(feature = "serde", serde(rename = "es3", alias = "ES3"))]
    Es3,
    #[cfg_attr(feature = "serde", serde(rename = "es5", alias = "ES5"))]
    #[default]
    Es5,
    #[cfg_attr(
        feature = "serde",
        serde(rename = "es2015", alias = "ES2015", alias = "ES6", alias = "es6")
    )]
    Es2015,
    #[cfg_attr(feature = "serde", serde(rename = "es2016", alias = "ES2016"))]
    Es2016,
    #[cfg_attr(feature = "serde", serde(rename = "es2017", alias = "ES2017"))]
    Es2017,
    #[cfg_attr(feature = "serde", serde(rename = "es2018", alias = "ES2018"))]
    Es2018,
    #[cfg_attr(feature = "serde", serde(rename = "es2019", alias = "ES2019"))]
    Es2019,
    #[cfg_attr(feature = "serde", serde(rename = "es2020", alias = "ES2020"))]
    Es2020,
    #[cfg_attr(feature = "serde", serde(rename = "es2021", alias = "ES2021"))]
    Es2021,
    #[cfg_attr(feature = "serde", serde(rename = "es2022", alias = "ES2022"))]
    Es2022,
    #[cfg_attr(feature = "serde", serde(rename = "esnext", alias = "EsNext"))]
    EsNext,
}

impl EsVersion {
    pub const fn latest() -> Self {
        EsVersion::EsNext
    }
}
