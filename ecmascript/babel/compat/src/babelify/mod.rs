use rayon::prelude::*;
use serde::{de::DeserializeOwned, Serialize};
use std::sync::Arc;
use swc::SwcComments;
use swc_babel_ast::{BaseComment, BaseNode, Comment, LineCol, Loc};
use swc_common::{
    comments::{CommentKind, Comments},
    sync::Lrc,
    BytePos, SourceFile, SourceMap, Span,
};
use swc_ecma_ast::Class;

mod class;
mod decl;
mod expr;
mod function;
mod ident;
mod jsx;
mod lit;
mod module;
mod module_decl;
pub mod normalize;
mod operators;
mod pat;
mod prop;
mod stmt;
mod typescript;

#[derive(Clone)]
pub struct Context {
    pub fm: Arc<SourceFile>,
    pub cm: Lrc<SourceMap>,
    pub comments: SwcComments,
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
        let loc = self.cm.lookup_char_pos_with(self.fm.clone(), pos);

        Some(LineCol {
            line: loc.line,
            column: loc.col_display,
        })
    }

    fn loc(&self, span: Span) -> Option<Loc> {
        if span.is_dummy() {
            return None;
        }

        let start = self.line_col(span.lo)?;
        let end = self.line_col(span.hi)?;

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
            .take_trailing(span.hi)
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
            /* TODO(kdy1): Use this field.
             * extra: Default::default(), */
        }
    }
}

pub trait Babelify: Send + Sync {
    type Output: Serialize + DeserializeOwned + Send + Sync;

    fn parallel(_cnt: usize) -> bool {
        false
    }

    fn babelify(self, ctx: &Context) -> Self::Output;
}

impl<T> Babelify for Vec<T>
where
    T: Babelify,
{
    type Output = Vec<T::Output>;

    fn babelify(self, ctx: &Context) -> Self::Output {
        if T::parallel(self.len()) {
            self.into_par_iter().map(|v| v.babelify(ctx)).collect()
        } else {
            self.into_iter().map(|v| v.babelify(ctx)).collect()
        }
    }
}

impl<T> Babelify for Option<T>
where
    T: Babelify,
{
    type Output = Option<T::Output>;

    fn babelify(self, ctx: &Context) -> Self::Output {
        self.map(|v| v.babelify(ctx))
    }
}

fn extract_class_body_span(class: &Class, ctx: &Context) -> Span {
    let sp = ctx.cm.span_take_while(class.span, |ch| *ch != '{');
    class.span.with_lo(sp.hi())
}
