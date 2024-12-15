use swc_allocator::arena::Allocator;
use swc_common::{comments::Comments, input::SourceFileInput, SourceFile};
use swc_ecma_ast::{arena::*, EsVersion};

use crate::{error::Error, lexer::Lexer, PResult, Syntax};

pub mod parser;
pub use parser::Parser;

pub fn with_file_parser<'a, T>(
    allocator: &'a Allocator,
    fm: &SourceFile,
    syntax: Syntax,
    target: EsVersion,
    comments: Option<&dyn Comments>,
    recovered_errors: &mut Vec<Error>,
    op: impl FnOnce(&mut Parser<'a, Lexer>) -> PResult<T>,
) -> PResult<T> {
    let lexer = Lexer::new(syntax, target, SourceFileInput::from(fm), comments);
    let mut p = Parser::new_from(allocator, lexer);
    let ret = op(&mut p);

    recovered_errors.append(&mut p.take_errors());

    ret
}

macro_rules! expose {
    (
        $name:ident,
        $T:ty,
        $($t:tt)*
    ) => {
        /// Note: This is recommended way to parse a file.
        ///
        /// This is an alias for [Parser], [Lexer] and [SourceFileInput], but
        /// instantiation of generics occur in `swc_ecma_parser` crate.
        pub fn $name<'a>(
            allocator: &'a Allocator,
            fm: &SourceFile,
            syntax: Syntax,
            target: EsVersion,
            comments: Option<&dyn Comments>,
            recovered_errors: &mut Vec<Error>,
        ) -> PResult<$T> {
            with_file_parser(allocator, fm, syntax, target, comments, recovered_errors, $($t)*)
        }
    };
}

expose!(parse_file_as_expr, Expr<'a>, |p| {
    // This allow to parse `import.meta`
    p.input().ctx.can_be_module = true;
    p.parse_expr()
});
expose!(parse_file_as_module, Module<'a>, |p| { p.parse_module() });
expose!(parse_file_as_script, Script<'a>, |p| { p.parse_script() });
expose!(parse_file_as_program, Program<'a>, |p| {
    p.parse_program()
});
