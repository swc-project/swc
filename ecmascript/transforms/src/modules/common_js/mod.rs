use crate::{helpers::Helpers, pass::Pass};
use ast::*;
use std::sync::Arc;
use swc_common::Fold;

#[cfg(test)]
mod tests;

pub fn common_js() -> impl Pass + Clone {
    CommonJs
}

#[derive(Clone)]
struct CommonJs;
