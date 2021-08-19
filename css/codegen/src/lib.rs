pub use self::emit::*;
pub use std::fmt::Result;
use std::fmt::Write;
use swc_css_ast::*;
use swc_css_codegen_macros::emitter;

#[macro_use]
mod macros;
mod emit;

#[derive(Debug, Clone, Copy)]
pub struct CodegenConfig {
    pub minify: bool,
}
#[derive(Debug)]
pub struct CodeGenerator<W>
where
    W: Write,
{
    wr: W,
    config: CodegenConfig,
}

impl<W> CodeGenerator<W>
where
    W: Write,
{
    pub fn new(wr: W, config: CodegenConfig) -> Self {
        CodeGenerator { wr, config }
    }

    #[emitter]
    fn emit_rule(&mut self, n: &Rule) -> Result {
        match n {
            Rule::Style(n) => emit!(n),
            Rule::AtRule(n) => emit!(n),
        }
    }
}
