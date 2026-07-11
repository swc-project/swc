//! Static byte dispatch tables.
//!
//! OXC uses a table per lexer configuration so the hottest dispatch has no
//! config indirection. The handlers here form the initial JavaScript lexical
//! layer; specialized keyword and punctuation handlers can replace category
//! handlers without changing the lexer cursor.

use super::{
    config::{Config, NoTokens, WithTokens},
    core::Lexer,
};
use crate::lexer::Token as Kind;

pub(super) type ByteHandler<C> = fn(&mut Lexer<'_, C>) -> Kind;
pub(super) type ByteHandlers<C> = [ByteHandler<C>; 256];

pub(super) static NO_TOKENS: ByteHandlers<NoTokens> = handlers();
pub(super) static WITH_TOKENS: ByteHandlers<WithTokens> = handlers();

const fn handlers<C: Config>() -> ByteHandlers<C> {
    let mut handlers = [punctuation::<C> as ByteHandler<C>; 256];

    let mut byte = b'A' as usize;
    while byte <= b'Z' as usize {
        handlers[byte] = identifier::<C>;
        byte += 1;
    }
    byte = b'a' as usize;
    while byte <= b'z' as usize {
        handlers[byte] = identifier::<C>;
        byte += 1;
    }
    handlers[b'_' as usize] = identifier::<C>;
    handlers[b'$' as usize] = identifier::<C>;
    handlers[b'\\' as usize] = identifier::<C>;

    byte = b'0' as usize;
    while byte <= b'9' as usize {
        handlers[byte] = number::<C>;
        byte += 1;
    }

    handlers[b'\'' as usize] = string::<C>;
    handlers[b'"' as usize] = string::<C>;
    handlers[b'`' as usize] = template::<C>;

    byte = 128;
    while byte < 256 {
        handlers[byte] = identifier::<C>;
        byte += 1;
    }

    handlers
}

fn identifier<C: Config>(lexer: &mut Lexer<'_, C>) -> Kind {
    lexer.read_identifier()
}

fn number<C: Config>(lexer: &mut Lexer<'_, C>) -> Kind {
    lexer.read_number()
}

fn string<C: Config>(lexer: &mut Lexer<'_, C>) -> Kind {
    lexer.read_string()
}

fn template<C: Config>(lexer: &mut Lexer<'_, C>) -> Kind {
    lexer.read_template()
}

fn punctuation<C: Config>(lexer: &mut Lexer<'_, C>) -> Kind {
    lexer.read_punctuation()
}
