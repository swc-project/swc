use crate::pass::Pass;
use ast::*;
use swc_common::Fold;

#[cfg(test)]
mod tests;

pub fn class_properties() -> impl Pass + Clone {
    ClassProperties
}

#[derive(Clone, Copy)]
struct ClassProperties;
