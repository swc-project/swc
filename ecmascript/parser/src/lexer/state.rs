use super::{Input, Lexer};
use parser_macros::parser;
use slog::Logger;
use swc_common::{BytePos, Span};
use token::*;

/// State of lexer.
///
/// Ported from babylon.
#[derive(Debug)]
pub(super) struct State {
    pub is_expr_allowed: bool,
    pub octal_pos: Option<BytePos>,
    /// if line break exists between previous token and new token?
    pub had_line_break: bool,
    /// TODO: Remove this field.
    is_first: bool,

    context: Context,

    // TODO: Create a new enum `TokenType` instead of cloning token.
    token_type: Option<Token>,
}

#[parser]
impl<'a, I: Input> Iterator for Lexer<'a, I> {
    type Item = TokenAndSpan;
    fn next(&mut self) -> Option<Self::Item> {
        self.state.had_line_break = self.state.is_first;
        self.state.is_first = false;

        // skip spaces before getting next character, if we are allowed to.
        if self.state.can_skip_space() {
            self.skip_space()
        };

        let start = cur_pos!();
        if self.state.is_in_template() {
            let token = self.read_tmpl_token()
                .unwrap_or_else(|err| unimplemented!("error handling: {:?}", err));
            self.state.update(&self.logger, &token);
            return Some(TokenAndSpan {
                token,
                span: span!(start),
            });
        }

        if let Some(token) = self.read_token()
            .unwrap_or_else(|err| unimplemented!("error handling: {:?}", err))
        {
            self.state.update(&self.logger, &token);
            return Some(TokenAndSpan {
                token,
                span: span!(start),
            });
        }

        None
    }
}

impl State {
    pub fn new() -> Self {
        State {
            is_expr_allowed: true,
            octal_pos: None,
            is_first: true,
            had_line_break: false,
            context: Context(vec![Type::BraceStmt]),
            token_type: None,
        }
    }

    pub fn can_skip_space(&self) -> bool {
        !self.context
            .current()
            .map(|t| t.preserve_space())
            .unwrap_or(false)
    }

    fn is_in_template(&self) -> bool {
        self.context.current() == Some(Type::Tpl)
    }

    pub fn last_was_tpl_element(&self) -> bool {
        match self.token_type {
            Some(Template(..)) => true,
            _ => false,
        }
    }

    fn update(&mut self, logger: &Logger, next: &Token) {
        trace!(
            logger,
            "updating state: next={:?}, had_line_break={} ",
            next,
            self.had_line_break
        );
        let prev = self.token_type.take();
        self.token_type = Some(next.clone());

        self.is_expr_allowed = Self::is_expr_allowed_on_next(
            logger,
            &mut self.context,
            prev,
            next,
            self.had_line_break,
            self.is_expr_allowed,
        );
    }

    /// `is_expr_allowed`: previous value.
    fn is_expr_allowed_on_next(
        logger: &Logger,
        context: &mut Context,
        prev: Option<Token>,
        next: &Token,
        had_line_break: bool,
        is_expr_allowed: bool,
    ) -> bool {
        let is_next_keyword = match next {
            &Word(Keyword(..)) => true,
            _ => false,
        };

        if is_next_keyword && prev == Some(Token::Dot) {
            return false;
        } else {
            // ported updateContext
            match *next {
                tok!(')') | tok!('}') => {
                    // TODO: Verify
                    if context.len() == 1 {
                        return true;
                    }

                    let out = context.pop(logger).unwrap();

                    // let a = function(){}
                    if out == Type::BraceStmt && context.current() == Some(Type::FnExpr) {
                        context.pop(logger);
                        return false;
                    }

                    // ${} in template
                    if out == Type::TplQuasi {
                        return true;
                    }

                    // expression cannot follow expression
                    return !out.is_expr();
                }

                tok!("function") => {
                    // This is required to lex
                    // `x = function(){}/42/i`
                    if is_expr_allowed
                        && !context.is_brace_block(prev, had_line_break, is_expr_allowed)
                    {
                        context.push(logger, Type::FnExpr);
                    }
                    return false;
                }

                // for (a of b) {}
                tok!("of") if Some(Type::ParenStmt { is_for_loop: true }) == context.current() => {
                    // e.g. for (a of _) => true
                    !prev.expect("context.current() if ParenStmt, so prev token cannot be None")
                        .before_expr()
                }

                Word(Ident(ref ident)) => {
                    // variable declaration
                    return match prev {
                        Some(prev) => match prev {
                            // handle automatic semicolon insertion.
                            Word(Keyword(Let)) | Word(Keyword(Const)) | Word(Keyword(Var))
                                if had_line_break =>
                            {
                                true
                            }
                            _ => false,
                        },
                        _ => false,
                    };
                }

                tok!('{') => {
                    let next_ctxt = if context.is_brace_block(prev, had_line_break, is_expr_allowed)
                    {
                        Type::BraceStmt
                    } else {
                        Type::BraceExpr
                    };
                    context.push(logger, next_ctxt);
                    true
                }

                tok!("${") => {
                    context.push(logger, Type::TplQuasi);
                    return true;
                }

                tok!('(') => {
                    // if, for, with, while is statement

                    context.push(
                        logger,
                        match prev {
                            Some(Word(Keyword(k))) => match k {
                                If | With | While => Type::ParenStmt { is_for_loop: false },
                                For => Type::ParenStmt { is_for_loop: true },
                                _ => Type::ParenExpr,
                            },
                            _ => Type::ParenExpr,
                        },
                    );
                    return true;
                }

                // remains unchanged.
                tok!("++") | tok!("--") => is_expr_allowed,

                tok!('`') => {
                    // If we are in template, ` terminates template.
                    if context.current() == Some(Type::Tpl) {
                        context.pop(logger);
                    } else {
                        context.push(logger, Type::Tpl);
                    }
                    return false;
                }

                _ => {
                    return next.before_expr();
                }
            }
        }
    }
}

#[derive(Debug, Default)]
struct Context(Vec<Type>);
impl Context {
    /// Returns true if following `LBrace` token is `block statement` according to
    ///  `ctx`, `prev`, `is_expr_allowed`.
    fn is_brace_block(
        &self,
        prev: Option<Token>,
        had_line_break: bool,
        is_expr_allowed: bool,
    ) -> bool {
        match prev {
            Some(tok!(':')) => match self.current() {
                Some(Type::BraceStmt) => return true,
                // `{ a: {} }`
                //     ^ ^
                Some(Type::BraceExpr) => return false,
                _ => {}
            },
            _ => {}
        }

        match prev {
            //  function a() {
            //      return { a: "" };
            //  }
            //  function a() {
            //      return
            //      {
            //          function b(){}
            //      };
            //  }
            Some(tok!("return")) | Some(tok!("yield")) => {
                return had_line_break;
            }

            Some(tok!("else")) | Some(Semi) | None | Some(tok!(')')) => return true,

            // If previous token was `{`
            Some(tok!('{')) => return self.current() == Some(Type::BraceStmt),

            // `class C<T> { ... }`
            Some(tok!('<')) | Some(tok!('>')) => return true,
            _ => {}
        }

        return !is_expr_allowed;
    }

    fn len(&self) -> usize {
        self.0.len()
    }
    fn pop(&mut self, logger: &Logger) -> Option<Type> {
        let opt = self.0.pop();
        trace!(logger, "context.pop({:?})", opt);
        opt
    }
    fn current(&self) -> Option<Type> {
        self.0.last().cloned()
    }
    fn push(&mut self, logger: &Logger, t: Type) {
        trace!(logger, "context.push({:?})", t);
        self.0.push(t)
    }
}

/// The algorithm used to determine whether a regexp can appear at a
/// given point in the program is loosely based on sweet.js' approach.
/// See https://github.com/mozilla/sweet.js/wiki/design
///
#[derive(Debug, Clone, Copy, PartialEq, Eq, Kind)]
#[kind(fucntion(is_expr = "bool", preserve_space = "bool"))]
enum Type {
    BraceStmt,
    #[kind(is_expr)] BraceExpr,
    #[kind(is_expr)] TplQuasi,
    ParenStmt {
        /// Is this `for` loop?
        is_for_loop: bool,
    },
    #[kind(is_expr)] ParenExpr,
    #[kind(is_expr, preserve_space)] Tpl,
    #[kind(is_expr)] FnExpr,
}
