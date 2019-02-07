use super::*;
use swc_common::comments::CommentKind;

macro_rules! write_comments {
    ($e:expr, $cmts:expr) => {{
        let cmts = match $cmts {
            Some(v) => v,
            None => return Ok(()),
        };

        for cmt in cmts {
            match cmt.kind {
                CommentKind::Line => {
                    $e.wr.write_comment(cmt.span, "//")?;
                    $e.wr.write_comment(cmt.span, &cmt.text)?;
                }
                CommentKind::Block => {
                    $e.wr.write_comment(cmt.span, "/*")?;
                    $e.wr.write_comment(cmt.span, &cmt.text)?;
                    $e.wr.write_comment(cmt.span, "*/")?;
                    $e.wr.write_line()?;
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
    ) -> Result {
        if pos == BytePos(0) {
            return Ok(());
        }

        let comments = match self.comments {
            Some(ref comments) => comments,
            None => return Ok(()),
        };

        let cmts = comments.trailing_comments(pos);

        write_comments!(self, &cmts)
    }

    pub(super) fn emit_leading_comments_of_pos(&mut self, pos: BytePos) -> Result {
        if pos == BytePos(0) {
            return Ok(());
        }

        let comments = match self.comments {
            Some(ref comments) => comments,
            None => return Ok(()),
        };

        if self.pos_of_leading_comments.contains(&pos) {
            return Ok(());
        }
        self.pos_of_leading_comments.insert(pos);

        write_comments!(self, comments.leading_comments(pos))
    }
}
