use ast::*;
use swc_common::{Fold, FoldWith};

#[cfg(test)]
mod tests;

pub fn parameters() -> impl Fold<Module> {
    Params
}

struct Params;
