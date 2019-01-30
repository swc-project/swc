use crate::{helpers::Helpers, pass::Pass};
use ast::*;
use std::sync::Arc;
use swc_common::Fold;

#[cfg(test)]
mod tests;

pub fn umd() -> impl Pass + Clone {
    Umd
}

#[derive(Clone)]
struct Umd;
