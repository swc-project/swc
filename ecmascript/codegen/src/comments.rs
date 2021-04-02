use super::*;
use swc_common::comments::CommentKind;

macro_rules! write_comments {
    ($e:expr, $prefix_space:expr, $cmts:expr) => {{
        let cmts = match $cmts {
            Some(v) => v,
            None => return Ok(()),
        };

        for cmt in cmts.iter() {
            match cmt.kind {
                CommentKind::Line => {
                    if $prefix_space {
                        $e.wr.write_comment(cmt.span, " ")?;
                    }
                    $e.wr.write_comment(cmt.span, "//")?;
                    $e.wr.write_comment(cmt.span, &cmt.text)?;
                    $e.wr.write_line()?;
                }
                CommentKind::Block => {
                    if $prefix_space {
                        $e.wr.write_comment(cmt.span, " ")?;
                    }
                    $e.wr.write_comment(cmt.span, "/*")?;
                    $e.wr.write_lit(cmt.span, &cmt.text)?;
                    $e.wr.write_comment(cmt.span, "*/")?;
                    $e.wr.write_space()?;
                }
            }
        }

        return Ok(());
    }};
}

impl<'a> Emitter<'a> {
    pub(super) fn emit_trailing_comments_of_pos(
        &mut self,
        pos: BytePos,
        prefix_space: bool,
        _is_hi: bool,
    ) -> Result {
        if pos == BytePos(0) {
            return Ok(());
        }

        let comments = match self.comments {
            Some(ref comments) => comments,
            None => return Ok(()),
        };

        let cmts = comments.take_trailing(pos);

        write_comments!(self, prefix_space, &cmts)
    }

    pub(super) fn emit_leading_comments_of_pos(&mut self, mut pos: BytePos, is_hi: bool) -> Result {
        if pos == BytePos(0) {
            return Ok(());
        }

        if is_hi {
            pos = pos - BytePos(1)
        }

        let comments = match self.comments {
            Some(ref comments) => comments,
            None => return Ok(()),
        };

        write_comments!(self, false, comments.take_leading(pos))
    }
}
