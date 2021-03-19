use crate::ast::comment::BaseComment;
use crate::ast::comment::Comment;
use crate::ast::common::BaseNode;
use crate::ast::common::LineCol;
use crate::ast::common::Loc;
use serde::de::DeserializeOwned;
use serde::Serialize;
use std::sync::Arc;
use swc_common::comments::CommentKind;
use swc_common::comments::Comments;
use swc_common::BytePos;
use swc_common::SourceFile;
use swc_common::SourceMap;
use swc_common::Span;

mod lit;
mod operators;

#[derive(Clone)]
pub struct Context {
    pub fm: Arc<SourceFile>,
    pub cm: Arc<SourceMap>,
    pub comments: Arc<dyn Comments>,
}

impl Context {
    /// Byte offset starting from the 0. (counted separately for each file)
    fn offset(&self, span: Span) -> (Option<usize>, Option<usize>) {
        // We rename this to feel more comfortable while doing math.
        let start_offset = self.fm.start_pos;

        if span.is_dummy() {
            (None, None)
        } else {
            (
                Some((span.lo.0 - start_offset.0) as _),
                Some((span.hi.0 - start_offset.0) as _),
            )
        }
    }

    fn line_col(&self, pos: BytePos) -> Option<LineCol> {
        let loc = self.cm.lookup_char_pos(pos);

        Some(LineCol {
            line: loc.line,
            // TODO(kdy1): Check if `+ 1` is correct.
            column: loc.col_display + 1,
        })
    }

    fn loc(&self, span: Span) -> Option<Loc> {
        if span.is_dummy() {
            return None;
        }

        let start = self.line_col(span.lo)?;
        let end = self.line_col(span.lo)?;

        Some(Loc { start, end })
    }

    fn convert_comments(&self, comments: Vec<swc_common::comments::Comment>) -> Vec<Comment> {
        comments
            .into_iter()
            .map(|c| {
                let (start, end) = self.offset(c.span);
                let loc = self.loc(c.span).unwrap_or_else(Loc::dummy);

                let comment = BaseComment {
                    value: c.text,
                    start: start.unwrap_or_default(),
                    end: end.unwrap_or_default(),
                    loc,
                };
                match c.kind {
                    CommentKind::Line => Comment::Line(comment),
                    CommentKind::Block => Comment::Block(comment),
                }
            })
            .collect()
    }

    /// Creates a [BaseNode] from `span`.
    ///
    /// Note that we removes comment from the comment map because `.babelify`
    /// takes `self`. (not reference)
    fn base(&self, span: Span) -> BaseNode {
        let leading_comments = self
            .comments
            .take_leading(span.lo)
            .map(|v| self.convert_comments(v))
            .unwrap_or_default();
        let trailing_comments = self
            .comments
            .take_trailing(span.lo)
            .map(|v| self.convert_comments(v))
            .unwrap_or_default();

        let (start, end) = self.offset(span);

        let loc = self.loc(span);

        BaseNode {
            leading_comments,
            // TODO(kdy1): Use this field.
            inner_comments: Default::default(),
            trailing_comments,
            start,
            end,
            loc,
            // TODO(kdy1): Use this field.
            extra: Default::default(),
        }
    }
}

pub trait Babelify {
    type Output: Serialize + DeserializeOwned;

    fn babelify(self, ctx: &Context) -> Self::Output;
}

