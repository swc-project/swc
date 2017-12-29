use {BytePos, Span};

pub trait SpannedToken {
    type Token;

    fn into_triple(self) -> (BytePos, Self::Token, BytePos);
    fn from_triple(start: BytePos, t: Self::Token, end: BytePos) -> Self;
}
