use std::fmt::{self, Write};

use miette::{
    GraphicalReportHandler, LabeledSpan, MietteError, MietteSpanContents, Severity, SourceCode,
    SourceOffset, SourceSpan, SpanContents,
};
use swc_common::{
    errors::{DiagnosticBuilder, DiagnosticId, Emitter, Level},
    source_map::SpanLabel,
    sync::Lrc,
    BytePos, SourceMap, Span,
};

pub struct PrettyEmitter {
    cm: Lrc<SourceMap>,

    wr: WriterWrapper,

    reporter: GraphicalReportHandler,
}

impl PrettyEmitter {
    pub fn new(cm: Lrc<SourceMap>, wr: Box<dyn Write + Send + Sync>) -> Self {
        Self {
            cm,
            wr: WriterWrapper(wr),
            reporter: GraphicalReportHandler::new(),
        }
    }
}

struct WriterWrapper(Box<dyn Write + Send + Sync>);

impl Write for WriterWrapper {
    fn write_str(&mut self, s: &str) -> fmt::Result {
        self.0.write_str(s)
    }

    fn write_char(&mut self, c: char) -> fmt::Result {
        self.0.write_char(c)
    }

    fn write_fmt(mut self: &mut Self, args: fmt::Arguments<'_>) -> fmt::Result {
        self.0.write_fmt(args)
    }
}

struct MietteSourceCode<'a>(&'a SourceMap);

impl SourceCode for MietteSourceCode<'_> {
    fn read_span<'a>(
        &'a self,
        src_span: &SourceSpan,
        context_lines_before: usize,
        context_lines_after: usize,
    ) -> Result<Box<dyn SpanContents<'a> + 'a>, MietteError> {
        let lo = src_span.offset();
        let hi = lo + src_span.len();

        let span = Span::new(BytePos(lo as _), BytePos(hi as _), Default::default());

        let loc = self.0.lookup_char_pos(span.lo());
        let line_count = loc.file.lines.len();

        let src = self
            .0
            .span_to_snippet(span)
            .map_err(|_| MietteError::OutOfBounds)?;

        Ok(Box::new(SwcSpanContents {
            data: src,
            span: src_span.clone(),
            line: loc.line,
            column: loc.col_display,
            line_count,
            name: None,
        }))
    }
}

impl Emitter for PrettyEmitter {
    fn emit(&mut self, db: &DiagnosticBuilder) {
        let source_code = MietteSourceCode(&self.cm);
        let diagnostic = MietteDiagnostic {
            source_code,
            d: &**db,
        };

        self.reporter
            .render_report(&mut self.wr, &diagnostic)
            .unwrap();
    }
}

struct MietteDiagnostic<'a> {
    source_code: MietteSourceCode<'a>,
    d: &'a swc_common::errors::Diagnostic,
}

impl miette::Diagnostic for MietteDiagnostic<'_> {
    fn code<'a>(&'a self) -> Option<Box<dyn fmt::Display + 'a>> {
        self.d
            .code
            .as_ref()
            .map(|v| match v {
                DiagnosticId::Error(v) => v,
                DiagnosticId::Lint(v) => v,
            })
            .map(|code| Box::new(code) as Box<dyn fmt::Display>)
    }

    fn severity(&self) -> Option<Severity> {
        match self.d.level {
            Level::FailureNote | Level::Bug | Level::Fatal | Level::PhaseFatal | Level::Error => {
                Some(Severity::Error)
            }
            Level::Warning => Some(Severity::Warning),
            Level::Note | Level::Help => Some(Severity::Advice),
            Level::Cancelled => None,
        }
    }

    fn help<'a>(&'a self) -> Option<Box<dyn fmt::Display + 'a>> {
        self.d
            .children
            .iter()
            .filter(|s| s.level == Level::Help)
            .find_map(|s| Some(Box::new(&s.message[0].0) as Box<_>))
    }

    fn url<'a>(&'a self) -> Option<Box<dyn fmt::Display + 'a>> {
        None
    }

    fn source_code(&self) -> Option<&dyn SourceCode> {
        Some(&self.source_code as &dyn SourceCode)
    }

    fn labels(&self) -> Option<Box<dyn Iterator<Item = miette::LabeledSpan> + '_>> {
        let iter = self.d.span.span_labels().into_iter().map(|span_label| {
            LabeledSpan::new_with_span(span_label.label, convert_span(span_label.span))
        });

        Some(Box::new(iter))
    }

    fn related<'a>(&'a self) -> Option<Box<dyn Iterator<Item = &'a dyn miette::Diagnostic> + 'a>> {
        todo!()
    }
}

impl std::error::Error for MietteDiagnostic<'_> {}

/// Delegates to `Diagnostics`
impl fmt::Debug for MietteDiagnostic<'_> {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        fmt::Debug::fmt(&self.d, f)
    }
}

impl fmt::Display for MietteDiagnostic<'_> {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        fmt::Display::fmt(&self.d.message[0].0, f)
    }
}

fn convert_span(span: Span) -> SourceSpan {
    let len = span.hi - span.lo;
    let start = SourceOffset::from(span.lo.0 as usize);
    SourceSpan::new(start, SourceOffset::from(len.0 as usize))
}

struct SwcSpanContents {
    // Data from a [`SourceCode`], in bytes.
    data: String,
    // span actually covered by this SpanContents.
    span: SourceSpan,
    // The 0-indexed line where the associated [`SourceSpan`] _starts_.
    line: usize,
    // The 0-indexed column where the associated [`SourceSpan`] _starts_.
    column: usize,
    // Number of line in this snippet.
    line_count: usize,
    // Optional filename
    name: Option<String>,
}

impl<'a> SpanContents<'a> for SwcSpanContents {
    fn data(&self) -> &'a [u8] {
        self.data.as_bytes().to_vec().leak()
        // self.data.as_bytes()
    }

    fn span(&self) -> &SourceSpan {
        &self.span
    }

    fn line(&self) -> usize {
        self.line
    }

    fn column(&self) -> usize {
        self.column
    }

    fn line_count(&self) -> usize {
        self.line_count
    }

    fn name(&self) -> Option<&str> {
        self.name.as_deref()
    }
}
