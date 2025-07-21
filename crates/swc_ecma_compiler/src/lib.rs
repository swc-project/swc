use swc_ecma_ast::Pass;

pub use crate::features::Features;

mod features;

#[derive(Debug)]
pub struct Compiler {
    #[allow(unused)]
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
    fn process(&mut self, _program: &mut swc_ecma_ast::Program) {}
}
