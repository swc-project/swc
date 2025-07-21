use swc_ecma_ast::Pass;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

pub use crate::features::Features;

mod features;

#[derive(Debug)]
pub struct Compiler {
    config: Config,
}

impl Compiler {
    pub fn new(config: Config) -> Self {
        Self { config }
    }
}

#[derive(Debug)]
pub struct Config {
    /// Always compile these syntaxes.
    pub includes: Features,
    /// Always preserve these syntaxes.
    pub excludes: Features,
}

impl Pass for Compiler {
    fn process(&mut self, program: &mut swc_ecma_ast::Program) {
        program.visit_mut_with(&mut CompilerImpl::new(&self.config));
    }
}

struct CompilerImpl<'a> {
    #[allow(unused)]
    config: &'a Config,
}

impl<'a> CompilerImpl<'a> {
    fn new(config: &'a Config) -> Self {
        Self { config }
    }
}

impl<'a> VisitMut for CompilerImpl<'a> {
    noop_visit_mut_type!(fail);
}
