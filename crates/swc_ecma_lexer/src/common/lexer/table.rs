// use swc_common::input::Input;

// use super::{pos_span, LexResult};

// pub trait ByteHandler<'a, Token, TokenAndSpan, Lexer: super::Lexer<'a,
// TokenAndSpan, Token = Token>> {
//     fn handler(lexer: &mut Lexer) -> LexResult<Option<Token>>;
// }

// // Define a struct that implements ByteHandler
// pub struct ErrorHandler;
// impl<'a, Token, TokenAndSpan, Lexer: super::Lexer<'a, TokenAndSpan, Token =
// Token>>     ByteHandler<'a, Token, TokenAndSpan, Lexer> for ErrorHandler
// {
//     fn handler(lexer: &mut Lexer) -> LexResult<Option<Token>> {
//         let start = lexer.cur_pos();
//         let c = unsafe {
//             // Safety: Byte handler is only called for non-last chracters
//             lexer.input().cur().unwrap_unchecked()
//         };
//         lexer.input_mut().bump_bytes(1);
//         lexer.error_span(
//             pos_span(start),
//             crate::error::SyntaxError::UnexpectedChar { c },
//         )
//     }
// }

// pub struct EOFHandler;
// impl<'a, Token, TokenAndSpan, Lexer: super::Lexer<'a, TokenAndSpan, Token =
// Token>>     ByteHandler<'a, Token, TokenAndSpan, Lexer> for EOFHandler
// {
//     fn handler(lexer: &mut Lexer) -> LexResult<Option<Token>> {
//         lexer.input_mut().bump_bytes(1);
//         Ok(None)
//     }
// }

// pub struct IdentHandler;
// impl<'a, Token, TokenAndSpan, Lexer: super::Lexer<'a, TokenAndSpan, Token =
// Token>>     ByteHandler<'a, Token, TokenAndSpan, Lexer> for IdentHandler
// {
//     fn handler(_lexer: &mut Lexer) -> LexResult<Option<Token>> {
//         // lexer.read_ident
//         Ok(None)
//     }
// }
