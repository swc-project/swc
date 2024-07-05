#![deny(clippy::all)]
#![allow(clippy::vec_box)]

use serde::{Deserialize, Serialize};

pub use self::{
    decorators::decorators, export_default_from::export_default_from,
    import_assertions::import_assertions,
};

#[derive(Debug, Default, Clone, Copy, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub enum DecoratorVersion {
    #[default]
    #[serde(rename = "2021-12")]
    V202112,

    #[serde(rename = "2022-03")]
    V202203,
}

pub mod decorator_2022_03;
pub mod decorators;
pub mod explicit_resource_management;
mod export_default_from;
mod import_assertions;
