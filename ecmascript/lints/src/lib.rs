#![feature(specialization)]

extern crate swc_common;
extern crate swc_ecma_ast;

mod with;

use swc_common::{errors::Handler, VisitWith};
use swc_ecma_ast::*;

pub fn lint_all(handler: &Handler, module: &Module) {
    module.visit_with(&mut with::With { handler });
}
