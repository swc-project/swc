use swc_common::Span;

pub trait TokenAndSpan {
    type Token;
    fn new(token: Self::Token, span: Span, had_line_break: bool) -> Self;
    fn token(&self) -> &Self::Token;
    fn take_token(self) -> Self::Token;
    fn span(&self) -> Span;
    fn had_line_break(&self) -> bool;
}
