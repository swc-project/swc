use swc_common::Span;

pub trait TokenAndSpan<Token> {
    fn token(&self) -> &Token;
    fn take_token(self) -> Token;
    fn span(&self) -> Span;
    fn had_line_break(&self) -> bool;
    fn new(token: Token, span: Span, had_line_break: bool) -> Self;
}
