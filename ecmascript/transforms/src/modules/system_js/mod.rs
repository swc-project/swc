use crate::{helpers::Helpers, pass::Pass};
use ast::*;
use std::sync::Arc;
use swc_common::Fold;

#[cfg(test)]
mod tests;

pub fn system_js() -> impl Pass + Clone {
    SystemJs
}

#[derive(Clone)]
struct SystemJs;
