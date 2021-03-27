use std::rc::Rc;
use std::sync::Arc;

use swc_common::errors::Diagnostic;
use swc_common::FileName;
use swc_ecma_ast::Module;

pub mod tsc;

pub trait Loader {
    fn load(&self, file: &FileName) -> Result<Module, Diagnostic>;
}

impl<L> Loader for &'_ L {}

impl<L> Loader for Box<L> {}

impl<L> Loader for Rc<L> {}

impl<L> Loader for Arc<L> {}

pub trait Resolver {
    fn resolve(&self, base: &FileName, target: &str) -> Result<FileName, Diagnostic>;
}

impl<R> Resolver for &'_ R {}

impl<R> Resolver for Box<R> {}

impl<R> Resolver for Rc<R> {}

impl<R> Resolver for Arc<R> {}
