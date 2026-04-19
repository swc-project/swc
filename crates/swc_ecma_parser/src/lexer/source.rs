use swc_common::{
    input::{Input, StringInput},
    BytePos,
};

#[derive(Clone)]
pub(crate) struct FastSource<'a> {
    inner: StringInput<'a>,
}

#[derive(Clone, Copy)]
pub(crate) struct FastSourceCheckpoint {
    cursor: BytePos,
}

impl<'a> FastSource<'a> {
    #[inline(always)]
    pub(crate) fn new(input: StringInput<'a>) -> Self {
        Self { inner: input }
    }

    #[inline(always)]
    pub(crate) fn as_str(&self) -> &str {
        self.inner.as_str()
    }

    #[inline(always)]
    pub(crate) fn checkpoint_save(&self) -> FastSourceCheckpoint {
        FastSourceCheckpoint {
            cursor: self.inner.last_pos(),
        }
    }

    #[inline(always)]
    pub(crate) fn checkpoint_load(&mut self, checkpoint: FastSourceCheckpoint) {
        // Safety: checkpoints are created from this source instance, so the
        // stored cursor always points into the same underlying input range.
        unsafe {
            self.inner.reset_to(checkpoint.cursor);
        }
    }

    #[inline(always)]
    pub(crate) fn start_pos(&self) -> BytePos {
        self.inner.start_pos()
    }

    #[inline(always)]
    pub(crate) fn end_pos(&self) -> BytePos {
        self.inner.end_pos()
    }

    #[inline(always)]
    pub(crate) unsafe fn slice_str(&self, start: BytePos, end: BytePos) -> &'a str {
        unsafe { self.inner.slice_str(start, end) }
    }
}

impl<'a> Input<'a> for FastSource<'a> {
    #[inline(always)]
    fn cur(&self) -> Option<u8> {
        self.inner.cur()
    }

    #[inline(always)]
    fn peek(&self) -> Option<u8> {
        self.inner.peek()
    }

    #[inline(always)]
    fn peek_ahead(&self) -> Option<u8> {
        self.inner.peek_ahead()
    }

    #[inline(always)]
    unsafe fn bump_bytes(&mut self, n: usize) {
        unsafe {
            self.inner.bump_bytes(n);
        }
    }

    #[inline(always)]
    fn cur_as_ascii(&self) -> Option<u8> {
        self.inner.cur_as_ascii()
    }

    #[inline(always)]
    fn cur_as_char(&self) -> Option<char> {
        self.inner.cur_as_char()
    }

    #[inline(always)]
    fn is_at_start(&self) -> bool {
        self.inner.is_at_start()
    }

    #[inline(always)]
    fn cur_pos(&self) -> BytePos {
        self.inner.cur_pos()
    }

    #[inline(always)]
    fn last_pos(&self) -> BytePos {
        self.inner.last_pos()
    }

    #[inline(always)]
    unsafe fn slice(&mut self, start: BytePos, end: BytePos) -> &'a str {
        unsafe { self.inner.slice(start, end) }
    }

    #[inline(always)]
    fn uncons_while<F>(&mut self, f: F) -> &'a str
    where
        F: FnMut(char) -> bool,
    {
        self.inner.uncons_while(f)
    }

    #[inline(always)]
    unsafe fn reset_to(&mut self, to: BytePos) {
        unsafe {
            self.inner.reset_to(to);
        }
    }

    #[inline(always)]
    fn is_byte(&self, c: u8) -> bool {
        self.inner.is_byte(c)
    }

    #[inline(always)]
    fn is_str(&self, s: &str) -> bool {
        self.inner.is_str(s)
    }

    #[inline(always)]
    unsafe fn eat_byte(&mut self, c: u8) -> bool {
        unsafe { self.inner.eat_byte(c) }
    }
}

#[cfg(test)]
mod tests {
    use swc_common::{input::Input, BytePos};

    use super::FastSource;

    #[test]
    fn checkpoint_restores_cursor() {
        let mut source = FastSource::new(swc_common::input::StringInput::new(
            "alpha beta",
            BytePos(10),
            BytePos(20),
        ));

        assert_eq!(source.cur_pos(), BytePos(10));

        let checkpoint = source.checkpoint_save();

        unsafe {
            source.bump_bytes(6);
        }
        assert_eq!(source.cur_pos(), BytePos(16));

        source.checkpoint_load(checkpoint);
        assert_eq!(source.cur_pos(), BytePos(10));
        assert_eq!(source.cur(), Some(b'a'));
    }
}
