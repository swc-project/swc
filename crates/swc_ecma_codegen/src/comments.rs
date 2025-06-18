use swc_atoms::atom;
use swc_common::comments::Comment;

use super::*;

macro_rules! write_comments {
    ($e:expr, $prefix_space:expr, $cmts:expr) => {{
        let cmts = $cmts;

        for cmt in cmts.iter() {
            match cmt.kind {
                CommentKind::Line => {
                    if $prefix_space && !$e.cfg.minify {
                        $e.wr.write_comment(" ")?;
                    }

                    srcmap!($e, cmt, true);

                    $e.wr.write_comment("//")?;
                    $e.wr.write_comment(&cmt.text)?;

                    srcmap!($e, cmt, false);

                    $e.wr.write_line()?;
                }
                CommentKind::Block => {
                    if $prefix_space && !$e.cfg.minify {
                        $e.wr.write_comment(" ")?;
                    }

                    srcmap!($e, cmt, true);

                    $e.wr.write_comment("/*")?;
                    $e.wr.write_comment(&cmt.text)?;

                    {
                        let hi = cmt.span_hi();
                        if !hi.is_dummy() && hi.0 > 2 {
                            $e.wr.add_srcmap(hi - swc_common::BytePos(2))?;
                        }
                    }
                    $e.wr.write_comment("*/")?;

                    if !$e.cfg.minify {
                        $e.wr.write_space()?;
                    }
                }
            }
        }

        return Ok(());
    }};
}

impl<W, S: SourceMapper> Emitter<'_, W, S>
where
    W: WriteJs,
    S: SourceMapperExt,
{
    pub(super) fn emit_trailing_comments_of_pos(
        &mut self,
        pos: BytePos,
        prefix_space: bool,
        _is_hi: bool,
    ) -> Result {
        let cmts = self.take_trailing_comments_of_pos(pos);

        write_comments!(self, prefix_space, cmts)
    }

    pub(super) fn emit_trailing_comments_of_pos_with(
        &mut self,
        pos: BytePos,
        prefix_space: bool,
        callback: impl FnOnce(&mut Self) -> Result,
    ) -> Result {
        let cmts = self.take_trailing_comments_of_pos(pos);

        callback(self)?;

        write_comments!(self, prefix_space, cmts)
    }

    fn take_trailing_comments_of_pos(&mut self, pos: BytePos) -> Vec<Comment> {
        if pos.is_dummy() {
            return Vec::new();
        }

        let comments = match self.comments {
            Some(ref comments) => comments,
            None => return Vec::new(),
        };

        comments.take_trailing(pos)
    }

    pub(super) fn emit_leading_comments(&mut self, mut pos: BytePos, is_hi: bool) -> Result {
        if pos.is_dummy() {
            return Ok(());
        }

        if pos.is_pure() {
            write_comments!(
                self,
                false,
                vec![Comment {
                    kind: CommentKind::Block,
                    span: DUMMY_SP,
                    text: "#__PURE__".into(),
                }]

            );
        }

        let comments = match self.comments {
            Some(ref comments) => comments,
            None => return Ok(()),
        };

        if is_hi {
            pos = pos - BytePos(1)
        }

        write_comments!(self, false, comments.take_leading(pos))
    }

    #[inline(always)]
    pub(super) fn emit_leading_comments_of_span(&mut self, span: Span, is_hi: bool) -> Result {
        let pos = if is_hi { span.hi } else { span.lo };
        self.emit_leading_comments(pos, is_hi)
    }
}
