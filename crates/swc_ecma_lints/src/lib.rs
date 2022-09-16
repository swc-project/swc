#![cfg_attr(feature = "non_critical_lints", deny(unused))]
#![cfg_attr(feature = "non_critical_lints", deny(clippy::all))]
#![feature(box_patterns)]

pub mod config;
pub mod rule;
pub mod rules;
