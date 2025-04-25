use swc_common::{
    input::{Input, StringInput},
    BytePos, Span,
};

pub mod char;
pub mod comments_buffer;
pub mod state;
pub mod whitespace;

pub type LexResult<T> = Result<T, crate::error::Error>;

pub trait Lexer<'a> {
    fn input(&self) -> &StringInput<'a>;
    fn input_mut(&mut self) -> &mut StringInput<'a>;

    fn span(&self, start: BytePos) -> Span {
        let end = self.last_pos();
        if cfg!(debug_assertions) && start > end {
            unreachable!(
                "assertion failed: (span.start <= span.end).
 start = {}, end = {}",
                start.0, end.0
            )
        }
        Span { lo: start, hi: end }
    }

    #[inline(always)]
    fn bump(&mut self) {
        unsafe {
            // Safety: Actually this is not safe but this is an internal method.
            self.input_mut().bump()
        }
    }

    #[inline(always)]
    fn is(&self, c: u8) -> bool {
        self.input().is_byte(c)
    }

    #[inline(always)]
    fn is_str(&self, s: &str) -> bool {
        self.input().is_str(s)
    }

    #[inline(always)]
    fn eat(&mut self, c: u8) -> bool {
        self.input_mut().eat_byte(c)
    }

    #[inline(always)]
    fn cur(&self) -> Option<char> {
        self.input().cur()
    }

    #[inline(always)]
    fn peek(&self) -> Option<char> {
        self.input().peek()
    }

    #[inline(always)]
    fn peek_ahead(&self) -> Option<char> {
        self.input().peek_ahead()
    }

    #[inline(always)]
    fn cur_pos(&self) -> BytePos {
        self.input().cur_pos()
    }

    #[inline(always)]
    fn last_pos(&self) -> BytePos {
        self.input().last_pos()
    }
}
