use super::Lexer;
use super::input::Input;
use swc_common::BytePos;
use token::*;

/// State of lexer.
///
/// Ported from babylon.
#[derive(Debug)]
pub(super) struct State {
    pub is_expr_allowed: bool,
    pub octal_pos: Option<BytePos>,

    context: Context,

    // TODO: Create a new enum `TokenType` instead of cloning token.
    token_type: Option<Token>,
}

impl State {
    pub fn new() -> Self {
        State {
            is_expr_allowed: true,
            octal_pos: None,
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

    /// `had_newline`: if line break exists between privous token and new token?
    pub fn update(&mut self, next: &Token, had_line_break: bool) {
        trace!(
            "updating state: next={:?}, had_line_break={} ",
            next,
            had_line_break
        );
        let prev = self.token_type.take();
        self.token_type = Some(next.clone());

        self.is_expr_allowed = Self::is_expr_allowed_on_next(
            &mut self.context,
            prev,
            next,
            had_line_break,
            self.is_expr_allowed,
        );
    }

    /// `is_expr_allowed`: previous value.
    fn is_expr_allowed_on_next(
        context: &mut Context,
        prev: Option<Token>,
        next: &Token,
        had_line_break: bool,
        is_expr_allowed: bool,
    ) -> bool {
        let is_next_keyword = match next {
            &Keyword(..) => true,
            _ => false,
        };

        if is_next_keyword && prev == Some(Token::Dot) {
            return false;
        } else {
            // ported updateContext
            match *next {
                RParen | RBrace => {
                    // TODO: Verify
                    if context.len() == 1 {
                        return true;
                    }

                    let out = context.pop().unwrap();

                    // function(){}
                    if out == Type::BraceStmt && context.current() == Some(Type::FnExpr) {
                        context.pop();
                        return false;
                    }

                    // ${} in template
                    if out == Type::TplQuasi {
                        return true;
                    }

                    // expression cannot follow expression
                    return !out.is_expr();
                }

                Ident(ref ident) => {
                    // for (a of b) {}
                    let for_loop = Type::ParenStmt { is_for_loop: true };
                    if ident == "of" && context.current() == Some(for_loop) {
                        // e.g. for (a of _) => true
                        return !prev.expect("TODO:").before_expr();
                    }

                    // variable declaration
                    return match prev {
                        Some(prev) => match prev {
                            // handle automatic semicolon insertion.
                            Keyword(Keyword::Let)
                            | Keyword(Keyword::Const)
                            | Keyword(Keyword::Var) if had_line_break =>
                            {
                                true
                            }
                            _ => false,
                        },
                        _ => false,
                    };
                }

                // `{`
                LBrace => {
                    let next_ctxt =
                        if is_brace_block(context, prev, had_line_break, is_expr_allowed) {
                            Type::BraceStmt
                        } else {
                            Type::BraceExpr
                        };
                    context.push(next_ctxt);
                    true
                }

                // `${`
                DollarLBrace => {
                    context.push(Type::TplQuasi);
                    return true;
                }

                // `(`
                LParen => {
                    // if, for, with, while is statement

                    context.push(match prev {
                        Some(Keyword(k)) => match k {
                            Keyword::If | Keyword::With | Keyword::While => {
                                Type::ParenStmt { is_for_loop: false }
                            }
                            Keyword::For => Type::ParenStmt { is_for_loop: true },
                            _ => Type::ParenExpr,
                        },
                        _ => Type::ParenExpr,
                    });
                    return true;
                }

                // remains unchanged.
                PlusPlus | MinusMinus => is_expr_allowed,

                Keyword(Keyword::Function) => {
                    // This is required to lex
                    /// `x = function(){}/42/i`
                    let is_always_expr = match prev {
                        Some(AssignOp(..)) | Some(BinOp(..)) => true,
                        _ => false,
                    };
                    if context.current() != Some(Type::BraceStmt) || is_always_expr {
                        context.push(Type::FnExpr);
                    }
                    return false;
                }

                BackQuote => {
                    // If we are in template, ` terminates template.
                    if context.current() == Some(Type::Tpl) {
                        context.pop();
                    } else {
                        context.push(Type::Tpl);
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

/// Returns true if following `LBrace` token is `block statement` according to
///  `ctx`, `prev`, `is_expr_allowed`.
fn is_brace_block(
    ctx: &Context,
    prev: Option<Token>,
    had_line_break: bool,
    is_expr_allowed: bool,
) -> bool {
    match prev {
        Some(Colon) => match ctx.current() {
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
        Some(Keyword(Keyword::Return)) | Some(Keyword(Keyword::Yield)) => {
            return had_line_break;
        }

        Some(Keyword(Keyword::Else)) | Some(Semi) | None | Some(RParen) => return true,

        // If previous token was `{`
        Some(LBrace) => return ctx.current() == Some(Type::BraceStmt),

        // `class C<T> { ... }`
        Some(BinOp(Gt)) | Some(BinOp(Lt)) => return true,
        _ => {}
    }

    return !is_expr_allowed;
}

#[derive(Debug, Default)]
struct Context(Vec<Type>);
impl Context {
    fn len(&self) -> usize {
        self.0.len()
    }
    fn pop(&mut self) -> Option<Type> {
        let opt = self.0.pop();
        trace!("context.pop({:?})", opt);
        opt
    }
    fn current(&self) -> Option<Type> {
        self.0.last().cloned()
    }
    fn push(&mut self, t: Type) {
        trace!("context.push({:?})", t);
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
