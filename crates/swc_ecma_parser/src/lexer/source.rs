use swc_common::{
    input::{Input, StringInput},
    BytePos,
};

/// Thin wrapper around `StringInput` that exposes a byte-position checkpoint
/// API compatible with the parser/lexer backtracking paths.
#[derive(Clone)]
pub(crate) struct Source<'a> {
    input: StringInput<'a>,
}

impl<'a> Source<'a> {
    #[inline(always)]
    pub(crate) fn new(input: StringInput<'a>) -> Self {
        Self { input }
    }

    #[inline(always)]
    pub(crate) fn checkpoint_save(&self) -> BytePos {
        self.input.last_pos()
    }

    #[inline(always)]
    pub(crate) unsafe fn checkpoint_load(&mut self, checkpoint: BytePos) {
        self.input.reset_to(checkpoint);
    }

    #[inline(always)]
    pub(crate) fn as_str(&self) -> &str {
        self.input.as_str()
    }

    #[inline(always)]
    pub(crate) fn start_pos(&self) -> BytePos {
        self.input.start_pos()
    }

    #[inline(always)]
    pub(crate) fn end_pos(&self) -> BytePos {
        self.input.end_pos()
    }

    #[inline(always)]
    pub(crate) fn last_pos(&self) -> BytePos {
        self.input.last_pos()
    }

    #[inline(always)]
    pub(crate) unsafe fn slice_str(&self, start: BytePos, end: BytePos) -> &'a str {
        self.input.slice_str(start, end)
    }
}

impl<'a> Input<'a> for Source<'a> {
    #[inline(always)]
    fn cur(&self) -> Option<u8> {
        self.input.cur()
    }

    #[inline(always)]
    fn peek(&self) -> Option<u8> {
        self.input.peek()
    }

    #[inline(always)]
    fn peek_ahead(&self) -> Option<u8> {
        self.input.peek_ahead()
    }

    #[inline(always)]
    unsafe fn bump_bytes(&mut self, n: usize) {
        self.input.bump_bytes(n);
    }

    #[inline(always)]
    fn cur_as_ascii(&self) -> Option<u8> {
        self.input.cur_as_ascii()
    }

    #[inline(always)]
    fn cur_as_char(&self) -> Option<char> {
        self.input.cur_as_char()
    }

    #[inline(always)]
    fn is_at_start(&self) -> bool {
        self.input.is_at_start()
    }

    #[inline(always)]
    fn cur_pos(&self) -> BytePos {
        self.input.cur_pos()
    }

    #[inline(always)]
    fn last_pos(&self) -> BytePos {
        self.input.last_pos()
    }

    #[inline(always)]
    unsafe fn slice(&mut self, start: BytePos, end: BytePos) -> &'a str {
        self.input.slice(start, end)
    }

    #[inline(always)]
    fn uncons_while<F>(&mut self, pred: F) -> &'a str
    where
        F: FnMut(char) -> bool,
    {
        self.input.uncons_while(pred)
    }

    #[inline(always)]
    unsafe fn reset_to(&mut self, to: BytePos) {
        self.input.reset_to(to);
    }

    #[inline(always)]
    fn is_byte(&self, c: u8) -> bool {
        self.input.is_byte(c)
    }

    #[inline(always)]
    fn is_str(&self, s: &str) -> bool {
        self.input.is_str(s)
    }

    #[inline(always)]
    unsafe fn eat_byte(&mut self, c: u8) -> bool {
        self.input.eat_byte(c)
    }
}
