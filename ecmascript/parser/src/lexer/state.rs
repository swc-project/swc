use super::{Input, Lexer};
use slog::Logger;
use swc_common::BytePos;
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

impl<'a, I: Input> Iterator for Lexer<'a, I> {
    type Item = TokenAndSpan;
    fn next(&mut self) -> Option<Self::Item> {
        self.state.had_line_break = self.state.is_first;
        self.state.is_first = false;

        // skip spaces before getting next character, if we are allowed to.
        if self.state.can_skip_space() {
            let start = self.cur_pos();

            match self.skip_space() {
                Err(err) => {
                    return Some(Token::Error(err)).map(|token| {
                        // Attatch span to token.
                        TokenAndSpan {
                            token,
                            had_line_break: self.had_line_break_before_last(),
                            span: self.span(start),
                        }
                    });
                }
                _ => {}
            }
        };

        let start = self.cur_pos();

        let res = if let Some(Type::Tpl {
            start: start_pos_of_tpl,
        }) = self.state.context.current()
        {
            self.read_tmpl_token(start_pos_of_tpl).map(Some)
        } else {
            self.read_token()
        };

        let token = match res.map_err(Token::Error).map_err(Some) {
            Ok(t) => t,
            Err(e) => e,
        };

        if let Some(ref token) = token {
            self.state.update(&self.session.logger, start, &token)
        }

        token.map(|token| {
            // Attatch span to token.
            TokenAndSpan {
                token,
                had_line_break: self.had_line_break_before_last(),
                span: self.span(start),
            }
        })
    }
}

impl Default for State {
    fn default() -> Self {
        State {
            is_expr_allowed: true,
            octal_pos: None,
            is_first: true,
            had_line_break: false,
            context: Context(vec![Type::BraceStmt]),
            token_type: None,
        }
    }
}

impl State {
    pub fn can_skip_space(&self) -> bool {
        !self.context
            .current()
            .map(|t| t.preserve_space())
            .unwrap_or(false)
    }

    pub fn last_was_tpl_element(&self) -> bool {
        match self.token_type {
            Some(Template(..)) => true,
            _ => false,
        }
    }

    fn update(&mut self, logger: &Logger, start: BytePos, next: &Token) {
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
            start,
            next,
            self.had_line_break,
            self.is_expr_allowed,
        );
    }

    /// `is_expr_allowed`: previous value.
    /// `start`: start of newly produced token.
    fn is_expr_allowed_on_next(
        logger: &Logger,
        context: &mut Context,
        prev: Option<Token>,
        start: BytePos,
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
                    if let Some(Type::Tpl { .. }) = context.current() {
                        context.pop(logger);
                    } else {
                        context.push(logger, Type::Tpl { start });
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
    #[kind(is_expr)]
    BraceExpr,
    #[kind(is_expr)]
    TplQuasi,
    ParenStmt {
        /// Is this `for` loop?
        is_for_loop: bool,
    },
    #[kind(is_expr)]
    ParenExpr,
    #[kind(is_expr, preserve_space)]
    Tpl {
        /// Start of a template literal.
        start: BytePos,
    },
    #[kind(is_expr)]
    FnExpr,
}
