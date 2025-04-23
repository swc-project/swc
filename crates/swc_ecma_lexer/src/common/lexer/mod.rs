pub mod comments_buffer;
pub mod whitespace;

pub type LexResult<T> = Result<T, crate::error::Error>;
