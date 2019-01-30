use crate::{helpers::Helpers, pass::Pass};
use ast::*;
use std::sync::Arc;
use swc_common::Fold;

#[cfg(test)]
mod tests;

pub fn amd() -> impl Pass + Clone {
    Amd
}

#[derive(Clone)]
struct Amd;
