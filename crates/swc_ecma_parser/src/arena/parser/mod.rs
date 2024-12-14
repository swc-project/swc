#![allow(clippy::let_unit_value)]
#![deny(non_snake_case)]

use input::Buffer;
use swc_allocator::arena::{Allocator, Box, Vec as AllocVec};
use swc_atoms::{Atom, JsWord};
use swc_common::{collections::AHashMap, comments::Comments, input::StringInput, BytePos, Span};
use swc_ecma_ast::arena::*;

use crate::{
    error::SyntaxError,
    lexer::Lexer,
    token::{Token, Word},
    Context, EsVersion, PResult, Syntax, Tokens, TsSyntax,
};
#[cfg(test)]
extern crate test;
#[cfg(test)]
use test::Bencher;

use crate::error::Error;

#[macro_use]
mod macros;
mod class_and_fn;
mod expr;
mod ident;
pub mod input;
mod jsx;
mod object;
mod pat;
mod stmt;
#[cfg(test)]
mod tests;
#[cfg(feature = "typescript")]
mod typescript;
mod util;

/// EcmaScript parser.
#[derive(Clone)]
pub struct Parser<'a, I: Tokens> {
    alloc: &'a Allocator,
    state: State,
    input: Buffer<I>,
}

#[derive(Clone, Default)]
struct State {
    labels: Vec<JsWord>,
    /// Start position of an assignment expression.
    potential_arrow_start: Option<BytePos>,

    found_module_item: bool,
    /// Start position of an AST node and the span of its trailing comma.
    trailing_commas: AHashMap<BytePos, Span>,
}

impl<'a> Parser<'a, Lexer<'a>> {
    pub fn new(
        allocator: &'a Allocator,
        syntax: Syntax,
        input: StringInput<'a>,
        comments: Option<&'a dyn Comments>,
    ) -> Self {
        Self::new_from(
            allocator,
            Lexer::new(syntax, Default::default(), input, comments),
        )
    }
}

impl<'a, I: Tokens> Parser<'a, I> {
    pub fn new_from(allocator: &'a Allocator, mut input: I) -> Self {
        #[cfg(feature = "typescript")]
        let in_declare = matches!(
            input.syntax(),
            Syntax::Typescript(TsSyntax { dts: true, .. })
        );
        #[cfg(not(feature = "typescript"))]
        let in_declare = false;
        let ctx = Context {
            in_declare,
            ..input.ctx()
        };
        input.set_ctx(ctx);

        Parser {
            alloc: allocator,
            state: Default::default(),
            input: Buffer::new(input),
        }
    }

    pub fn take_errors(&mut self) -> Vec<Error> {
        self.input().take_errors()
    }

    pub fn take_script_module_errors(&mut self) -> Vec<Error> {
        self.input().take_script_module_errors()
    }

    pub fn parse_script(&mut self) -> PResult<Script<'a>> {
        trace_cur!(self, parse_script);

        let ctx = Context {
            module: false,
            ..self.ctx()
        };
        self.set_ctx(ctx);

        let start = cur_pos!(self);

        let shebang = self.parse_shebang()?;

        self.parse_block_body(true, true, None).map(|body| Script {
            span: span!(self, start),
            body,
            shebang,
        })
    }

    pub fn parse_typescript_module(&mut self) -> PResult<Module<'a>> {
        trace_cur!(self, parse_typescript_module);

        debug_assert!(self.syntax().typescript());

        //TODO: parse() -> PResult<Program>
        let ctx = Context {
            module: true,
            strict: false,
            ..self.ctx()
        };
        // Module code is always in strict mode
        self.set_ctx(ctx);

        let start = cur_pos!(self);
        let shebang = self.parse_shebang()?;

        self.parse_block_body(true, true, None).map(|body| Module {
            span: span!(self, start),
            body,
            shebang,
        })
    }

    /// Returns [Module] if it's a module and returns [Script] if it's not a
    /// module.
    ///
    /// Note: This is not perfect yet. It means, some strict mode violations may
    /// not be reported even if the method returns [Module].
    pub fn parse_program(&mut self) -> PResult<Program<'a>> {
        let start = cur_pos!(self);
        let shebang = self.parse_shebang()?;
        let ctx = Context {
            can_be_module: true,
            ..self.ctx()
        };

        let body: AllocVec<ModuleItem> = self.with_ctx(ctx).parse_block_body(true, true, None)?;
        let has_module_item = self.state.found_module_item
            || body
                .iter()
                .any(|item| matches!(item, ModuleItem::ModuleDecl(..)));
        if has_module_item && !self.ctx().module {
            let ctx = Context {
                module: true,
                can_be_module: true,
                strict: true,
                ..self.ctx()
            };
            // Emit buffered strict mode / module code violations
            self.input.set_ctx(ctx);
        }

        Ok(if has_module_item {
            Program::Module(self.ast(Module {
                span: span!(self, start),
                body,
                shebang,
            }))
        } else {
            let body = AllocVec::from_iter_in(
                body.into_iter().map(|item| match item {
                    ModuleItem::ModuleDecl(_) => unreachable!("Module is handled above"),
                    ModuleItem::Stmt(stmt) => stmt,
                }),
                self.alloc,
            );
            Program::Script(self.ast(Script {
                span: span!(self, start),
                body,
                shebang,
            }))
        })
    }

    pub fn parse_module(&mut self) -> PResult<Module<'a>> {
        let ctx = Context {
            module: true,
            can_be_module: true,
            strict: true,
            ..self.ctx()
        };
        // Module code is always in strict mode
        self.set_ctx(ctx);

        let start = cur_pos!(self);
        let shebang = self.parse_shebang()?;

        self.parse_block_body(true, true, None).map(|body| Module {
            span: span!(self, start),
            body,
            shebang,
        })
    }

    fn parse_shebang(&mut self) -> PResult<Option<Atom>> {
        match cur!(self, false) {
            Ok(&Token::Shebang(..)) => match bump!(self) {
                Token::Shebang(v) => Ok(Some(v)),
                _ => unreachable!(),
            },
            _ => Ok(None),
        }
    }

    fn ctx(&self) -> Context {
        self.input.get_ctx()
    }

    #[cold]
    fn emit_err(&mut self, span: Span, error: SyntaxError) {
        if self.ctx().ignore_error || !self.syntax().early_errors() {
            return;
        }

        self.emit_error(Error::new(span, error))
    }

    #[cold]
    fn emit_error(&mut self, error: Error) {
        if self.ctx().ignore_error || !self.syntax().early_errors() {
            return;
        }

        if matches!(self.input.cur(), Some(Token::Error(..))) {
            let err = self.input.bump();
            match err {
                Token::Error(err) => {
                    self.input_ref().add_error(err);
                }
                _ => unreachable!(),
            }
        }

        self.input_ref().add_error(error);
    }

    #[cold]
    fn emit_strict_mode_err(&self, span: Span, error: SyntaxError) {
        if self.ctx().ignore_error {
            return;
        }
        let error = Error::new(span, error);
        self.input_ref().add_module_mode_error(error);
    }

    pub(crate) fn ast<T>(&self, value: T) -> Box<'a, T> {
        Box::new_in(value, self.alloc)
    }
}

#[cfg(test)]
pub fn test_parser<F, Ret>(s: &'static str, syntax: Syntax, f: F) -> Ret
where
    F: for<'a> FnOnce(&mut Parser<'a, Lexer>) -> Result<Ret, Error>,
{
    crate::with_test_sess(s, |handler, input| {
        let allocator = Allocator::default();
        let lexer = Lexer::new(syntax, EsVersion::Es2019, input, None);
        let mut p = Parser::new_from(&allocator, lexer);
        let ret = f(&mut p);
        let mut error = false;

        for err in p.take_errors() {
            error = true;
            err.into_diagnostic(handler).emit();
        }

        let res = ret.map_err(|err| err.into_diagnostic(handler).emit())?;

        if error {
            return Err(());
        }

        Ok(res)
    })
    .unwrap_or_else(|output| panic!("test_parser(): failed to parse \n{}\n{}", s, output))
}

#[cfg(test)]
pub fn test_parser_comment<F, Ret>(c: &dyn Comments, s: &'static str, syntax: Syntax, f: F) -> Ret
where
    F: FnOnce(&mut Parser<Lexer>) -> Result<Ret, Error>,
{
    crate::with_test_sess(s, |handler, input| {
        let allocator = Allocator::default();
        let lexer = Lexer::new(syntax, EsVersion::Es2019, input, Some(&c));
        let mut p = Parser::new_from(&allocator, lexer);
        let ret = f(&mut p);

        for err in p.take_errors() {
            err.into_diagnostic(handler).emit();
        }

        ret.map_err(|err| err.into_diagnostic(handler).emit())
    })
    .unwrap_or_else(|output| panic!("test_parser(): failed to parse \n{}\n{}", s, output))
}

#[cfg(test)]
pub fn bench_parser<F>(b: &mut Bencher, s: &'static str, syntax: Syntax, mut f: F)
where
    F: for<'a> FnMut(&'a mut Parser<Lexer<'a>>) -> PResult<()>,
{
    b.bytes = s.len() as u64;

    let _ = crate::with_test_sess(s, |handler, input| {
        b.iter(|| {
            let allocator = Allocator::default();
            let lexer = Lexer::new(syntax, Default::default(), input.clone(), None);
            let _ = f(&mut Parser::new_from(&allocator, lexer))
                .map_err(|err| err.into_diagnostic(handler).emit());
        });

        Ok(())
    });
}
