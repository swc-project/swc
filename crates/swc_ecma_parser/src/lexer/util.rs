//! Ported from [babylon/util/identifier.js][]
//!
//!
//! [babylon/util/identifier.js]:https://github.com/babel/babel/blob/master/packages/babylon/src/util/identifier.js

use swc_common::{
    comments::{Comment, CommentKind},
    input::Input,
    Span,
};
use swc_ecma_lexer::common::lexer::{
    comments_buffer::{BufferedComment, BufferedCommentKind},
    state::State,
};

use super::{Lexer, LexerTrait};
use crate::error::SyntaxError;

impl Lexer<'_> {
    /// Expects current char to be '/' and next char to be '*'.
    #[inline(never)]
    pub(super) fn skip_block_comment(&mut self) {
        let start = self.cur_pos();

        debug_assert_eq!(self.cur(), Some('/'));
        debug_assert_eq!(self.peek(), Some('*'));

        self.input.bump_bytes(2);

        // jsdoc
        let slice_start = self.cur_pos();

        // Check if there's an asterisk at the beginning (JSDoc style)
        let mut was_star = if self.input.is_byte(b'*') {
            self.bump();
            true
        } else {
            false
        };

        let mut is_for_next = self.state.had_line_break || !self.state.can_have_trailing_comment();

        // Optimization for finding block comment end position
        let input_str = self.input.as_str();
        let bytes = input_str.as_bytes();
        let mut pos = 0;
        let len = bytes.len();

        // Byte-based scanning for faster search
        while pos < len {
            let b = bytes[pos];

            if was_star && b == b'/' {
                // Found comment end: "*/"
                self.input.bump_bytes(pos + 1); // 종료 '/' 포함해서 이동

                let end = self.cur_pos();

                self.skip_space::<false>();

                // Check if this is a comment before semicolon
                if !self.state.had_line_break && self.input.is_byte(b';') {
                    is_for_next = false;
                }

                if let Some(comments) = self.comments_buffer.as_mut() {
                    let src = unsafe {
                        // Safety: We got slice_start and end from self.input so those are valid.
                        self.input.slice(slice_start, end)
                    };
                    let s = &src[..src.len() - 2];
                    let cmt = Comment {
                        kind: CommentKind::Block,
                        span: Span::new(start, end),
                        text: self.atoms.atom(s),
                    };

                    let _ = self.input.peek();
                    if is_for_next {
                        comments.push_pending_leading(cmt);
                    } else {
                        comments.push(BufferedComment {
                            kind: BufferedCommentKind::Trailing,
                            pos: self.state.prev_hi,
                            comment: cmt,
                        });
                    }
                }

                return;
            }

            // Check for line break characters - ASCII case
            if b == b'\r' || b == b'\n' {
                self.state.had_line_break = true;
            }
            // Check for Unicode line breaks (rare case)
            else if b > 127 {
                let remaining = &input_str[pos..];
                if let Some(c) = remaining.chars().next() {
                    if c == '\u{2028}' || c == '\u{2029}' {
                        self.state.had_line_break = true;
                    }
                    // Skip multibyte characters
                    pos += c.len_utf8() - 1; // `-1` will incrumented below
                }
            }

            was_star = b == b'*';
            pos += 1;
        }

        // If we reached here, it's an unterminated block comment
        self.input.bump_bytes(len); // skip remaining
        let end = self.input.end_pos();
        let span = Span::new(end, end);
        self.emit_error_span(span, SyntaxError::UnterminatedBlockComment)
    }
}
