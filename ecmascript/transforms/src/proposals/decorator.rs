use swc_common::Fold;
use ast::*;

pub fn decorators() -> impl Fold<Module> {
    Decorators
}

struct Decorators;
