#![cfg_attr(feature = "non_critical_lints", deny(unused))]
#![cfg_attr(feature = "non_critical_lints", deny(clippy::all))]
#![allow(rustc::untranslatable_diagnostic_trivial)]
#![allow(dead_code)]

pub mod config;
pub mod rule;
pub mod rules;
