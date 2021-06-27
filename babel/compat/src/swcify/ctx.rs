use std::sync::Arc;
use swc::SwcComments;
use swc_babel_ast::BaseNode;
use swc_babel_ast::LineCol;
use swc_babel_ast::Loc;
use swc_common::BytePos;
use swc_common::FileName;
use swc_common::SourceFile;
use swc_common::SourceMap;
use swc_common::Span;
use swc_common::SyntaxContext;
use swc_common::DUMMY_SP;

pub struct Context {
    #[allow(unused)]
    pub(crate) cm: Arc<SourceMap>,
    pub(crate) fm: Arc<SourceFile>,
    #[allow(unused)]
    pub(crate) comments: SwcComments,
}

impl Context {
    fn locate_line_col(&self, loc: LineCol) -> BytePos {
        if let Some(&line_start) = self.fm.lines.get(loc.line) {
            line_start + BytePos(loc.column as _)
        } else {
            BytePos(0)
        }
    }

    fn locate_loc(&self, loc: Option<Loc>) -> Span {
        let loc = match loc {
            Some(v) => v,
            None => return DUMMY_SP,
        };

        let start = self.locate_line_col(loc.start);
        let end = self.locate_line_col(loc.end);

        Span::new(start, end, SyntaxContext::empty())
    }

    pub(crate) fn span(&self, node: &BaseNode) -> Span {
        let span = self.locate_loc(node.loc);

        if !span.is_dummy() {
            return span;
        }

        let start = node
            .start
            .map(|offset| self.fm.start_pos + BytePos(offset as _))
            .unwrap_or(BytePos(0));

        let end = node
            .end
            .map(|offset| self.fm.start_pos + BytePos(offset as _))
            .unwrap_or(BytePos(0));

        Span::new(start, end, SyntaxContext::empty())
    }

    /// This accepts source string because the spans of an ast node of swc are
    /// stored as interned.
    ///
    /// This method allocate a new [SourceFile] in the given `cm`.
    pub fn new(cm: Arc<SourceMap>, comments: SwcComments, filename: FileName, src: String) -> Self {
        let fm = cm.new_source_file(filename, src);
        Self::new_without_alloc(cm, comments, fm)
    }

    pub fn new_without_alloc(
        cm: Arc<SourceMap>,
        comments: SwcComments,
        fm: Arc<SourceFile>,
    ) -> Self {
        Self { cm, comments, fm }
    }
}
