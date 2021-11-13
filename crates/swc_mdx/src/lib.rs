use crate::{error::Error, parser::Parser};
use swc_common::{input::Input, SourceFile};
use swc_ecma_ast::Module;
use swc_ecma_parser::StringInput;

pub mod ast;
pub mod error;
pub mod parser;
pub mod processing;

/// TODO: Migrate logic to customizable processors.
pub fn compile<I>(input: I) -> Result<Module, Error>
where
    I: Input,
{
    let mut items = vec![];

    let mut parser = Parser::new(input);
    let res = parser.parse()?;

    Ok(Module {
        span: Default::default(),
        body: items,
        shebang: Default::default(),
    })
}

pub fn compile_file(fm: &SourceFile) -> Result<Module, Error> {
    compile(StringInput::from(&*fm))
}
