//! ECMAScript lexer.

use std::{cell::RefCell, char, iter::FusedIterator, rc::Rc};

use smallvec::{smallvec, SmallVec};
use swc_atoms::{Atom, AtomStoreCell};
use swc_common::{comments::Comments, input::StringInput, BytePos, Span};
use swc_ecma_ast::{AssignOp, EsVersion};
use swc_ecma_raw_lexer::{RawBuffer, RawToken};

use self::{comments_buffer::CommentsBuffer, state::State, util::CharExt};
pub use self::{
    input::Input,
    state::{TokenContext, TokenContexts},
};
use crate::{
    error::{Error, SyntaxError},
    token::{BinOpToken, IdentLike, Keyword, KnownIdent, Token, Word},
    Context, Syntax,
};

mod comments_buffer;
#[deprecated = "Directly use swc_common::input instead"]
pub mod input;
mod jsx;
mod number;
mod state;
#[cfg(test)]
mod tests;
pub mod util;

pub(crate) type LexResult<T> = Result<T, Error>;

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub(crate) struct Char(u32);

impl From<char> for Char {
    fn from(c: char) -> Self {
        Char(c as u32)
    }
}

impl From<u32> for Char {
    fn from(c: u32) -> Self {
        Char(c)
    }
}

pub(crate) struct CharIter(SmallVec<[char; 7]>);

/// Ported from https://github.com/web-infra-dev/oxc/blob/99a4816ce7b6132b2667257984f9d92ae3768f03/crates/oxc_parser/src/lexer/mod.rs#L1349-L1374
impl IntoIterator for Char {
    type IntoIter = CharIter;
    type Item = char;

    #[allow(unsafe_code)]
    fn into_iter(self) -> Self::IntoIter {
        //        // TODO: Check if this is correct
        //        fn to_char(v: u8) -> char {
        //            char::from_digit(v as _, 16).unwrap_or('0')
        //        }

        CharIter(match char::from_u32(self.0) {
            Some(c) => smallvec![c],
            None => {
                let mut buf = smallvec![];

                let high = self.0 & 0xffff0000 >> 16;

                let low = self.0 & 0x0000ffff;

                // The second code unit of a surrogate pair is always in the range from 0xDC00
                // to 0xDFFF, and is called a low surrogate or a trail surrogate.
                if !(0xdc00..=0xdfff).contains(&low) {
                    buf.push('\\');
                    buf.push('u');
                    buf.extend(format!("{high:x}").chars());
                    buf.push('\\');
                    buf.push('u');
                    buf.extend(format!("{low:x}").chars());
                } else {
                    // `https://tc39.es/ecma262/#sec-utf16decodesurrogatepair`
                    let astral_code_point = (high - 0xd800) * 0x400 + low - 0xdc00 + 0x10000;

                    buf.push('\\');
                    buf.push('u');
                    buf.extend(format!("{astral_code_point:x}").chars());
                }

                buf
            }
        })
    }
}

impl Iterator for CharIter {
    type Item = char;

    fn next(&mut self) -> Option<Self::Item> {
        if self.0.is_empty() {
            None
        } else {
            Some(self.0.remove(0))
        }
    }
}

impl FusedIterator for CharIter {}

#[derive(Clone)]
pub struct Lexer<'a> {
    comments: Option<&'a dyn Comments>,
    /// [Some] if comment comment parsing is enabled. Otherwise [None]
    comments_buffer: Option<CommentsBuffer>,

    pub(crate) ctx: Context,
    input: RawBuffer<'a>,
    start_pos: BytePos,

    state: State,
    pub(crate) syntax: Syntax,
    pub(crate) target: EsVersion,

    errors: Rc<RefCell<Vec<Error>>>,
    module_errors: Rc<RefCell<Vec<Error>>>,

    buf: Rc<RefCell<String>>,

    atoms: Rc<AtomStoreCell>,
}

impl FusedIterator for Lexer<'_> {}

impl<'a> Lexer<'a> {
    pub fn new(
        syntax: Syntax,
        target: EsVersion,
        input: StringInput<'a>,
        comments: Option<&'a dyn Comments>,
    ) -> Self {
        let start_pos = input.last_pos();

        Lexer {
            comments,
            comments_buffer: comments.is_some().then(CommentsBuffer::new),
            ctx: Default::default(),
            input: RawBuffer::new(input),
            start_pos,
            state: State::new(syntax, start_pos),
            syntax,
            target,
            errors: Default::default(),
            module_errors: Default::default(),
            buf: Rc::new(RefCell::new(String::with_capacity(256))),
            atoms: Default::default(),
        }
    }

    /// Utility method to reuse buffer.
    fn with_buf<F, Ret>(&mut self, op: F) -> LexResult<Ret>
    where
        F: for<'any> FnOnce(&mut Lexer<'any>, &mut String) -> LexResult<Ret>,
    {
        let b = self.buf.clone();
        let mut buf = b.borrow_mut();
        buf.clear();

        op(self, &mut buf)
    }

    /// babel: `getTokenFromCode`
    fn read_token(&mut self) -> LexResult<Option<Token>> {
        let start = self.input.cur_pos();
        let cur = match self.input.cur()? {
            Some(cur) => cur,
            None => return Ok(None),
        };

        dbg!(&cur, start, self.input.cur_slice());

        let token = match cur {
            RawToken::LegacyCommentOpen | RawToken::LegacyCommentClose => {
                // XML style comment. `<!--`
                self.input.next().transpose()?;
                self.skip_space::<true>()?;
                self.emit_module_mode_error(start, SyntaxError::LegacyCommentInModule);

                return self.read_token();
            }

            RawToken::LConflictMarker | RawToken::RConflictMarker
                if self.had_line_break_before_last() =>
            {
                let start = self.input.cur_pos();

                // All conflict markers consist of the same character repeated seven times.
                // If it is a <<<<<<< or >>>>>>> marker then it is also followed by a space.
                // <<<<<<<
                //   ^
                // >>>>>>>
                //    ^

                self.emit_error_span(fixed_len_span(start, 7), SyntaxError::TS1185);
                // self.skip_line_comment(5);
                // self.skip_space::<true>();
                return self.read_token();
            }
            RawToken::Arrow => Token::Arrow,
            RawToken::Hash => Token::Hash,
            RawToken::At => Token::At,
            RawToken::Dot => Token::Dot,
            RawToken::DotDotDot => Token::DotDotDot,
            RawToken::Bang => Token::Bang,
            RawToken::LParen => Token::LParen,
            RawToken::RParen => Token::RParen,
            RawToken::LBracket => Token::LBracket,
            RawToken::RBracket => Token::RBracket,
            RawToken::LBrace => Token::LBrace,
            RawToken::RBrace => Token::RBrace,
            RawToken::Semi => Token::Semi,
            RawToken::Comma => Token::Comma,
            RawToken::Colon => Token::Colon,
            RawToken::BackQuote => Token::BackQuote,
            RawToken::DollarLBrace => Token::DollarLBrace,
            RawToken::QuestionMark => Token::QuestionMark,
            RawToken::PlusPlus => Token::PlusPlus,
            RawToken::MinusMinus => Token::MinusMinus,
            RawToken::Tilde => Token::Tilde,
            RawToken::Str => Token::Str {
                value: self.atoms.atom(self.input.cur_slice()),
                raw: self.atoms.atom(self.input.cur_slice()),
            },
            RawToken::Num => {
                let s = self.input.cur_slice();
                let value = if let Some(s) = s.strip_prefix("0x").or_else(|| s.strip_prefix("0X")) {
                    usize::from_str_radix(s, 16).unwrap() as f64
                } else if let Some(s) = s.strip_prefix("0o").or_else(|| s.strip_prefix("0O")) {
                    usize::from_str_radix(s, 8).unwrap() as f64
                } else if let Some(s) = s.strip_prefix("0b").or_else(|| s.strip_prefix("0B")) {
                    usize::from_str_radix(s, 2).unwrap() as f64
                } else {
                    s.parse::<f64>().unwrap_or_else(|_| {
                        panic!("failed to parse number: {}", s);
                    })
                };

                Token::Num {
                    value,
                    raw: self.atoms.atom(self.input.cur_slice()),
                }
            }
            RawToken::LegacyOctalNum => {
                let s = self.input.cur_slice();
                let value = usize::from_str_radix(s, 8).unwrap() as f64;

                Token::Num {
                    value,
                    raw: self.atoms.atom(s),
                }
            }
            RawToken::BigInt => Token::BigInt {
                value: {
                    let s = self.input.cur_slice();
                    let s = s.strip_suffix("n").unwrap_or(s);

                    s.parse().map(Box::new).unwrap()
                },
                raw: self.atoms.atom(self.input.cur_slice()),
            },

            RawToken::Shebang => {
                self.emit_error(start, SyntaxError::UnexpectedToken);
                self.input.next().transpose()?;
                return self.read_token();
            }

            RawToken::Null => Token::Word(Word::Null),
            RawToken::True => Token::Word(Word::True),
            RawToken::False => Token::Word(Word::False),
            RawToken::EqEqOp => Token::BinOp(BinOpToken::EqEq),
            RawToken::NotEqOp => Token::BinOp(BinOpToken::NotEq),
            RawToken::EqEqEqOp => Token::BinOp(BinOpToken::EqEqEq),
            RawToken::NotEqEqOp => Token::BinOp(BinOpToken::NotEqEq),
            RawToken::LtOp => Token::BinOp(BinOpToken::Lt),
            RawToken::LtEqOp => Token::BinOp(BinOpToken::LtEq),
            RawToken::GtOp => Token::BinOp(BinOpToken::Gt),
            RawToken::GtEqOp => Token::BinOp(BinOpToken::GtEq),
            RawToken::LShiftOp => Token::BinOp(BinOpToken::LShift),
            RawToken::RShiftOp => Token::BinOp(BinOpToken::RShift),
            RawToken::ZeroFillRShiftOp => Token::BinOp(BinOpToken::ZeroFillRShift),
            RawToken::AddOp => Token::BinOp(BinOpToken::Add),
            RawToken::SubOp => Token::BinOp(BinOpToken::Sub),
            RawToken::MulOp => Token::BinOp(BinOpToken::Mul),
            RawToken::DivOp => Token::BinOp(BinOpToken::Div),
            RawToken::ModOp => Token::BinOp(BinOpToken::Mod),
            RawToken::BitOrOp => Token::BinOp(BinOpToken::BitOr),
            RawToken::BitXorOp => Token::BinOp(BinOpToken::BitXor),
            RawToken::BitAndOp => Token::BinOp(BinOpToken::BitAnd),
            RawToken::ExpOp => Token::BinOp(BinOpToken::Exp),
            RawToken::LogicalOrOp => Token::BinOp(BinOpToken::LogicalOr),
            RawToken::LogicalAndOp => Token::BinOp(BinOpToken::LogicalAnd),
            RawToken::NullishCoalescingOp => Token::BinOp(BinOpToken::NullishCoalescing),
            RawToken::AssignOp => Token::AssignOp(AssignOp::Assign),
            RawToken::AddAssignOp => Token::AssignOp(AssignOp::AddAssign),
            RawToken::SubAssignOp => Token::AssignOp(AssignOp::SubAssign),
            RawToken::MulAssignOp => Token::AssignOp(AssignOp::MulAssign),
            RawToken::DivAssignOp => Token::AssignOp(AssignOp::DivAssign),
            RawToken::ModAssignOp => Token::AssignOp(AssignOp::ModAssign),
            RawToken::LShiftAssignOp => Token::AssignOp(AssignOp::LShiftAssign),
            RawToken::RShiftAssignOp => Token::AssignOp(AssignOp::RShiftAssign),
            RawToken::ZeroFillRShiftAssignOp => Token::AssignOp(AssignOp::ZeroFillRShiftAssign),
            RawToken::BitOrAssignOp => Token::AssignOp(AssignOp::BitOrAssign),
            RawToken::BitXorAssignOp => Token::AssignOp(AssignOp::BitXorAssign),
            RawToken::BitAndAssignOp => Token::AssignOp(AssignOp::BitAndAssign),
            RawToken::ExpAssignOp => Token::AssignOp(AssignOp::ExpAssign),
            RawToken::AndAssignOp => Token::AssignOp(AssignOp::AndAssign),
            RawToken::OrAssignOp => Token::AssignOp(AssignOp::OrAssign),
            RawToken::NullishAssignOp => Token::AssignOp(AssignOp::NullishAssign),
            RawToken::Ident => Token::Word(Word::Ident(IdentLike::Other({
                self.atoms.atom(self.input.cur_slice())
            }))),
            RawToken::NewLine | RawToken::Whitespace => {
                self.input.next().transpose()?;
                // self.skip_space::<true>();
                return self.read_token();
            }
            RawToken::LineComment
            | RawToken::BlockComment
            | RawToken::LConflictMarker
            | RawToken::RConflictMarker => {
                self.input.next().transpose()?;
                self.skip_space::<true>()?;
                return self.read_token();
            }
            RawToken::Await => Token::Word(Word::Keyword(Keyword::Await)),
            RawToken::Break => Token::Word(Word::Keyword(Keyword::Break)),
            RawToken::Case => Token::Word(Word::Keyword(Keyword::Case)),
            RawToken::Catch => Token::Word(Word::Keyword(Keyword::Catch)),
            RawToken::Continue => Token::Word(Word::Keyword(Keyword::Continue)),
            RawToken::Debugger => Token::Word(Word::Keyword(Keyword::Debugger)),
            RawToken::Default_ => Token::Word(Word::Keyword(Keyword::Default_)),
            RawToken::Do => Token::Word(Word::Keyword(Keyword::Do)),
            RawToken::Else => Token::Word(Word::Keyword(Keyword::Else)),
            RawToken::Finally => Token::Word(Word::Keyword(Keyword::Finally)),
            RawToken::For => Token::Word(Word::Keyword(Keyword::For)),
            RawToken::Function => Token::Word(Word::Keyword(Keyword::Function)),
            RawToken::If => Token::Word(Word::Keyword(Keyword::If)),
            RawToken::Return => Token::Word(Word::Keyword(Keyword::Return)),
            RawToken::Switch => Token::Word(Word::Keyword(Keyword::Switch)),
            RawToken::Throw => Token::Word(Word::Keyword(Keyword::Throw)),
            RawToken::Try => Token::Word(Word::Keyword(Keyword::Try)),
            RawToken::Var => Token::Word(Word::Keyword(Keyword::Var)),
            RawToken::Let => Token::Word(Word::Keyword(Keyword::Let)),
            RawToken::Const => Token::Word(Word::Keyword(Keyword::Const)),
            RawToken::While => Token::Word(Word::Keyword(Keyword::While)),
            RawToken::With => Token::Word(Word::Keyword(Keyword::With)),
            RawToken::New => Token::Word(Word::Keyword(Keyword::New)),
            RawToken::This => Token::Word(Word::Keyword(Keyword::This)),
            RawToken::Super => Token::Word(Word::Keyword(Keyword::Super)),
            RawToken::Class => Token::Word(Word::Keyword(Keyword::Class)),
            RawToken::Extends => Token::Word(Word::Keyword(Keyword::Extends)),
            RawToken::Export => Token::Word(Word::Keyword(Keyword::Export)),
            RawToken::Import => Token::Word(Word::Keyword(Keyword::Import)),
            RawToken::Yield => Token::Word(Word::Keyword(Keyword::Yield)),
            RawToken::In => Token::Word(Word::Keyword(Keyword::In)),
            RawToken::InstanceOf => Token::Word(Word::Keyword(Keyword::InstanceOf)),
            RawToken::TypeOf => Token::Word(Word::Keyword(Keyword::TypeOf)),
            RawToken::Void => Token::Word(Word::Keyword(Keyword::Void)),
            RawToken::Delete => Token::Word(Word::Keyword(Keyword::Delete)),
            RawToken::Abstract => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Abstract))),
            RawToken::As => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::As))),
            RawToken::Async => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Async))),
            RawToken::From => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::From))),
            RawToken::Of => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Of))),
            RawToken::Type => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Type))),
            RawToken::Global => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Global))),
            RawToken::Static => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Static))),
            RawToken::Using => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Using))),
            RawToken::Readonly => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Readonly))),
            RawToken::Unique => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Unique))),
            RawToken::Keyof => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Keyof))),
            RawToken::Declare => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Declare))),
            RawToken::Enum => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Enum))),
            RawToken::Is => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Is))),
            RawToken::Infer => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Infer))),
            RawToken::Symbol => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Symbol))),
            RawToken::Undefined => {
                Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Undefined)))
            }
            RawToken::Interface => {
                Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Interface)))
            }
            RawToken::Implements => {
                Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Implements)))
            }
            RawToken::Asserts => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Asserts))),
            RawToken::Require => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Require))),
            RawToken::Get => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Get))),
            RawToken::Set => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Set))),
            RawToken::Any => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Any))),
            RawToken::Intrinsic => {
                Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Intrinsic)))
            }
            RawToken::Unknown => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Unknown))),
            RawToken::String => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::String))),
            RawToken::Object => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Object))),
            RawToken::Number => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Number))),
            RawToken::Bigint => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Bigint))),
            RawToken::Boolean => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Boolean))),
            RawToken::Never => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Never))),
            RawToken::Assert => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Assert))),
            RawToken::Namespace => {
                Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Namespace)))
            }
            RawToken::Accessor => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Accessor))),
            RawToken::Meta => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Meta))),
            RawToken::Target => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Target))),
            RawToken::Satisfies => {
                Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Satisfies)))
            }
            RawToken::Package => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Package))),
            RawToken::Protected => {
                Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Protected)))
            }
            RawToken::Private => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Private))),
            RawToken::Public => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Public))),
        };

        self.input.next().transpose()?;

        Ok(Some(token))
    }

    /// Read an escaped character for string literal.
    ///
    /// In template literal, we should preserve raw string.
    fn read_escaped_char(&mut self, in_template: bool) -> LexResult<Option<Vec<Char>>> {
        debug_assert_eq!(self.input.cur_char(), Some('\\'));

        let start = self.input.cur_pos();

        self.bump(); // '\'

        let c = match self.input.cur_char() {
            Some(c) => c,
            None => self.error_span(pos_span(start), SyntaxError::InvalidStrEscape)?,
        };

        macro_rules! push_c_and_ret {
            ($c:expr) => {{
                $c
            }};
        }

        let c = match c {
            '\\' => push_c_and_ret!('\\'),
            'n' => push_c_and_ret!('\n'),
            'r' => push_c_and_ret!('\r'),
            't' => push_c_and_ret!('\t'),
            'b' => push_c_and_ret!('\u{0008}'),
            'v' => push_c_and_ret!('\u{000b}'),
            'f' => push_c_and_ret!('\u{000c}'),
            '\r' => {
                self.bump(); // remove '\r'

                self.input.eat(RawToken::NewLine);

                return Ok(None);
            }
            '\n' | '\u{2028}' | '\u{2029}' => {
                self.bump();

                return Ok(None);
            }

            // read hexadecimal escape sequences
            'x' => {
                self.bump(); // 'x'

                match self.read_int_u32::<16>(2)? {
                    Some(val) => return Ok(Some(vec![Char::from(val)])),
                    None => self.error(
                        start,
                        SyntaxError::BadCharacterEscapeSequence {
                            expected: "2 hex characters",
                        },
                    )?,
                }
            }

            // read unicode escape sequences
            'u' => match self.read_unicode_escape() {
                Ok(chars) => return Ok(Some(chars)),
                Err(err) => self.error(start, err.into_kind())?,
            },

            // octal escape sequences
            '0'..='7' => {
                self.bump();

                let first_c = if c == '0' {
                    match self.input.cur_char() {
                        Some(next) if next.is_digit(8) => c,
                        // \0 is not an octal literal nor decimal literal.
                        _ => return Ok(Some(vec!['\u{0000}'.into()])),
                    }
                } else {
                    c
                };

                // TODO: Show template instead of strict mode
                if in_template {
                    self.error(start, SyntaxError::LegacyOctal)?
                }

                self.emit_strict_mode_error(start, SyntaxError::LegacyOctal);

                let mut value: u8 = first_c.to_digit(8).unwrap() as u8;

                macro_rules! one {
                    ($check:expr) => {{
                        let cur = self.input.cur_char();

                        match cur.and_then(|c| c.to_digit(8)) {
                            Some(v) => {
                                value = if $check {
                                    let new_val = value
                                        .checked_mul(8)
                                        .and_then(|value| value.checked_add(v as u8));
                                    match new_val {
                                        Some(val) => val,
                                        None => return Ok(Some(vec![Char::from(value as char)])),
                                    }
                                } else {
                                    value * 8 + v as u8
                                };

                                self.bump();
                            }
                            _ => return Ok(Some(vec![Char::from(value as u32)])),
                        }
                    }};
                }

                one!(false);
                one!(true);

                return Ok(Some(vec![Char::from(value as char)]));
            }
            _ => c,
        };

        unsafe {
            // Safety: cur() is Some(c) if this method is called.
            self.input.bump(1);
        }

        Ok(Some(vec![c.into()]))
    }
}

impl Lexer<'_> {
    fn read_unicode_escape(&mut self) -> LexResult<Vec<Char>> {
        debug_assert_eq!(self.input.cur_char(), Some('u'));

        let mut chars = Vec::new();
        let mut is_curly = false;

        self.bump(); // 'u'

        if self.input.eat_ascii(b'{') {
            is_curly = true;
        }

        let state = self.input.cur_pos();
        let c = match self.read_int_u32::<16>(if is_curly { 0 } else { 4 }) {
            Ok(Some(val)) => {
                if 0x0010_ffff >= val {
                    char::from_u32(val)
                } else {
                    let start = self.input.cur_pos();

                    self.error(
                        start,
                        SyntaxError::BadCharacterEscapeSequence {
                            expected: if is_curly {
                                "1-6 hex characters in the range 0 to 10FFFF."
                            } else {
                                "4 hex characters"
                            },
                        },
                    )?
                }
            }
            _ => {
                let start = self.input.cur_pos();

                self.error(
                    start,
                    SyntaxError::BadCharacterEscapeSequence {
                        expected: if is_curly {
                            "1-6 hex characters"
                        } else {
                            "4 hex characters"
                        },
                    },
                )?
            }
        };

        match c {
            Some(c) => {
                chars.push(c.into());
            }
            _ => {
                unsafe {
                    // Safety: state is valid position because we got it from cur_pos()
                    self.input.reset_to(state);
                }

                chars.push(Char::from('\\'));
                chars.push(Char::from('u'));

                if is_curly {
                    chars.push(Char::from('{'));

                    for _ in 0..6 {
                        if let Some(c) = self.input.cur_char() {
                            if c == '}' {
                                break;
                            }

                            self.bump();

                            chars.push(Char::from(c));
                        } else {
                            break;
                        }
                    }

                    chars.push(Char::from('}'));
                } else {
                    for _ in 0..4 {
                        if let Some(c) = self.input.cur_char() {
                            self.bump();

                            chars.push(Char::from(c));
                        }
                    }
                }
            }
        }

        if is_curly && !self.input.eat_ascii(b'}') {
            self.error(state, SyntaxError::InvalidUnicodeEscape)?
        }

        Ok(chars)
    }

    /// Expects current char to be '/'
    fn read_regexp(&mut self, start: BytePos) -> LexResult<Token> {
        unsafe {
            // Safety: start is valid position, and cur() is Some('/')
            self.input.reset_to(start);
        }

        debug_assert_eq!(self.input.cur_char(), Some('/'));

        let start = self.input.cur_pos();

        self.bump();

        let (mut escaped, mut in_class) = (false, false);

        let content = self.with_buf(|l, buf| {
            while let Some(c) = l.input.cur_char() {
                // This is ported from babel.
                // Seems like regexp literal cannot contain linebreak.
                if c.is_line_terminator() {
                    let span = l.span(start);

                    return Err(Error::new(span, SyntaxError::UnterminatedRegExp));
                }

                if escaped {
                    escaped = false;
                } else {
                    match c {
                        '[' => in_class = true,
                        ']' if in_class => in_class = false,
                        // Terminates content part of regex literal
                        '/' if !in_class => break,
                        _ => {}
                    }

                    escaped = c == '\\';
                }

                l.bump();
                buf.push(c);
            }

            Ok(l.atoms.atom(&**buf))
        })?;

        // input is terminated without following `/`
        if !self.input.is_ascii(b'/') {
            let span = self.span(start);

            return Err(Error::new(span, SyntaxError::UnterminatedRegExp));
        }

        self.bump(); // '/'

        // Spec says "It is a Syntax Error if IdentifierPart contains a Unicode escape
        // sequence." TODO: check for escape

        // Need to use `read_word` because '\uXXXX' sequences are allowed
        // here (don't ask).
        // let flags_start = self.input.cur_pos();
        let flags = {
            if self.input.cur()? == Some(RawToken::Ident) {
                let s = self.atoms.atom(self.input.cur_slice());
                self.input.next().transpose()?;
                Some(s)
            } else {
                None
            }
        }
        .unwrap_or_default();

        Ok(Token::Regex(content, flags))
    }

    #[cold]
    fn read_shebang(&mut self) -> LexResult<Option<Atom>> {
        if !self.input.eat(RawToken::Shebang)? {
            return Ok(None);
        }

        Ok(Some(self.atoms.atom(self.input.cur_slice())))
    }

    fn read_tmpl_token(&mut self, start_of_tpl: BytePos) -> LexResult<Token> {
        let start = self.input.cur_pos();

        let mut cooked = Ok(String::new());
        let mut cooked_slice_start = start;
        let raw_slice_start = start;

        macro_rules! consume_cooked {
            () => {{
                if let Ok(cooked) = &mut cooked {
                    let last_pos = self.input.cur_pos();
                    cooked.push_str(unsafe {
                        // Safety: Both of start and last_pos are valid position because we got them
                        // from `self.input`
                        self.input.slice(cooked_slice_start, last_pos)
                    });
                }
            }};
        }

        while let Some(c) = self.input.cur_char() {
            if c == '`' || (c == '$' && self.input.peek_char() == Some('{')) {
                if start == self.input.cur_pos() && self.state.last_was_tpl_element() {
                    if c == '$' {
                        self.bump();
                        self.bump();
                        return Ok(tok!("${"));
                    } else {
                        self.bump();
                        return Ok(tok!('`'));
                    }
                }

                // If we don't have any escape
                let cooked = if cooked_slice_start == raw_slice_start {
                    let last_pos = self.input.cur_pos();
                    let s = unsafe {
                        // Safety: Both of start and last_pos are valid position because we got them
                        // from `self.input`
                        self.input.slice(cooked_slice_start, last_pos)
                    };

                    Ok(self.atoms.atom(s))
                } else {
                    consume_cooked!();

                    cooked.map(|s| self.atoms.atom(s))
                };

                // TODO: Handle error
                let end = self.input.cur_pos();
                let raw = unsafe {
                    // Safety: Both of start and last_pos are valid position because we got them
                    // from `self.input`
                    self.input.slice(raw_slice_start, end)
                };
                return Ok(Token::Template {
                    cooked,
                    raw: self.atoms.atom(raw),
                });
            }

            if c == '\\' {
                consume_cooked!();

                match self.read_escaped_char(true) {
                    Ok(Some(chars)) => {
                        if let Ok(ref mut cooked) = cooked {
                            for c in chars {
                                cooked.extend(c);
                            }
                        }
                    }
                    Ok(None) => {}
                    Err(error) => {
                        cooked = Err(error);
                    }
                }

                cooked_slice_start = self.input.cur_pos();
            } else if c.is_line_terminator() {
                self.state.had_line_break = true;

                consume_cooked!();

                let c = if c == '\r' && self.input.peek_char() == Some('\n') {
                    self.bump(); // '\r'
                    '\n'
                } else {
                    match c {
                        '\n' => '\n',
                        '\r' => '\n',
                        '\u{2028}' => '\u{2028}',
                        '\u{2029}' => '\u{2029}',
                        _ => unreachable!(),
                    }
                };

                self.bump();

                if let Ok(ref mut cooked) = cooked {
                    cooked.push(c);
                }
                cooked_slice_start = self.input.cur_pos();
            } else {
                self.bump();
            }
        }

        self.error(start_of_tpl, SyntaxError::UnterminatedTpl)?
    }

    #[inline]
    #[allow(clippy::misnamed_getters)]
    pub fn had_line_break_before_last(&self) -> bool {
        self.state.had_line_break
    }

    #[inline]
    pub fn set_expr_allowed(&mut self, allow: bool) {
        self.state.is_expr_allowed = allow;
    }

    #[inline]
    pub fn set_next_regexp(&mut self, start: Option<BytePos>) {
        self.state.next_regexp = start;
    }
}

fn pos_span(p: BytePos) -> Span {
    Span::new(p, p)
}

fn fixed_len_span(p: BytePos, len: u32) -> Span {
    Span::new(p, p + BytePos(len))
}
