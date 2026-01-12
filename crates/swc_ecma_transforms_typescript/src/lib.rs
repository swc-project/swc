#![deny(clippy::all)]
#![allow(clippy::vec_box)]
#![allow(clippy::mutable_key_type)]

// Re-export the main functions, but be explicit about which `hook` to use
pub use self::{
    config::{ImportsNotUsedAsValues, TsImportExportAssignConfig},
    strip_type::{strip_type, StripTypeHook},
    typescript::{hook, hook_with_id_usage, strip, tsx, typescript, Config, TsxConfig},
};
pub mod config;
mod macros;
pub mod strip_import_export;
pub mod strip_type;
pub mod transform;
mod ts_enum;
pub mod typescript;
mod utils;
