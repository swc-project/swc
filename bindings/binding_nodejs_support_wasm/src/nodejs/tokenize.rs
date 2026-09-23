use serde::Serialize;
use swc_common::{comments::SingleThreadedComments, BytePos, Spanned};
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::{
    unstable::{Capturing, Token as ParserToken},
    Lexer, Parser, StringInput, Syntax,
};

use super::{es_syntax, position::SourcePosition, span_range};

/// The compact token categories consumed by Node's REPL highlighter.
#[derive(Clone, Copy, Debug, Serialize)]
#[serde(rename_all = "lowercase")]
pub enum TokenKind {
    Keyword,
    Identifier,
    Number,
    Bigint,
    String,
    Template,
    Regexp,
    Comment,
    Punctuator,
}

/// A half-open range in the original JavaScript string, measured in UTF-16.
#[derive(Debug, Serialize)]
pub struct Token {
    pub kind: TokenKind,
    pub start: usize,
    pub end: usize,
}

/// Tokenizes a JavaScript REPL input, retaining the captured prefix on errors.
/// The parser drives lexing so regex literals and template substitutions are
/// rescanned with their grammatical context; a bare lexer cannot distinguish
/// these from division operators and ordinary closing braces.
pub fn tokenize(code: &str) -> Vec<Token> {
    let comments = SingleThreadedComments::default();
    let lexer = Capturing::new(Lexer::new(
        Syntax::Es(es_syntax()),
        EsVersion::latest(),
        StringInput::new(code, BytePos(1), BytePos(code.len() as u32 + 1)),
        Some(&comments),
    ));
    let mut parser = Parser::new_from(lexer);
    let result = parser.parse_program();
    let end_of_prefix = result
        .err()
        .into_iter()
        .chain(parser.take_errors())
        .filter_map(|error| span_range(error.span()).map(|(start, _)| start))
        .min()
        .unwrap_or(code.len());
    let captured = parser.input_mut().iter_mut().take();
    let mut tokens = Vec::with_capacity(captured.len());

    for token in captured {
        let Some((start, end)) = span_range(token.span) else {
            continue;
        };
        // Error tokens have no public category. Do not color their contents as
        // punctuation or include any speculative tokens beyond that point.
        if token.token == ParserToken::Error || start >= end_of_prefix {
            break;
        }
        let kind = match token.token {
            ParserToken::Eof => continue,
            ParserToken::Str => TokenKind::String,
            ParserToken::Num => TokenKind::Number,
            ParserToken::BigInt => TokenKind::Bigint,
            ParserToken::Regex => TokenKind::Regexp,
            ParserToken::Shebang => TokenKind::Comment,
            ParserToken::TemplateHead | ParserToken::TemplateMiddle | ParserToken::TemplateTail => {
                // Head/middle tokens include `${`; the closing `}` has its
                // own captured token and is excluded from the rescan's span.
                if token.token == ParserToken::TemplateTail {
                    push_token(&mut tokens, TokenKind::Template, start, end);
                } else {
                    push_token(&mut tokens, TokenKind::Template, start, end - 2);
                    push_token(&mut tokens, TokenKind::Punctuator, end - 2, end);
                }
                continue;
            }
            ParserToken::NoSubstitutionTemplateLiteral
            | ParserToken::Template
            | ParserToken::BackQuote => TokenKind::Template,
            token if token.is_keyword() => TokenKind::Keyword,
            token if token == ParserToken::Ident || token.is_known_ident() => TokenKind::Identifier,
            _ => TokenKind::Punctuator,
        };
        push_token(&mut tokens, kind, start, end);
    }

    let (leading, trailing) = comments.take_all();
    for map in [leading, trailing] {
        for comment in map.borrow().values().flatten() {
            if let Some((start, end)) = span_range(comment.span) {
                if end <= end_of_prefix {
                    push_token(&mut tokens, TokenKind::Comment, start, end);
                }
            }
        }
    }
    tokens.sort_unstable_by_key(|token| (token.start, token.end));
    tokens.dedup_by_key(|token| (token.start, token.end));

    let mut position = SourcePosition::new(code);
    for token in &mut tokens {
        position.advance_to(token.start);
        token.start = position.offset;
        position.advance_to(token.end);
        token.end = position.offset;
    }
    tokens
}

fn push_token(tokens: &mut Vec<Token>, kind: TokenKind, start: usize, end: usize) {
    if start < end {
        tokens.push(Token { kind, start, end });
    }
}
