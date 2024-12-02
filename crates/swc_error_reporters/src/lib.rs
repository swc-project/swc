use std::{
    fmt::{self, Write},
    intrinsics::transmute,
};

pub use miette::{GraphicalReportHandler, GraphicalTheme};
use miette::{
    LabeledSpan, MietteError, Severity, SourceCode, SourceOffset, SourceSpan, SpanContents,
};
use swc_common::{
    errors::{DiagnosticBuilder, DiagnosticId, Emitter, Level, SubDiagnostic},
    sync::Lrc,
    BytePos, FileName, SourceMap, Span,
};

pub mod handler;

pub struct PrettyEmitter {
    cm: Lrc<SourceMap>,

    wr: WriterWrapper,

    reporter: GraphicalReportHandler,

    config: PrettyEmitterConfig,
}

#[derive(Debug, Clone, Default)]
pub struct PrettyEmitterConfig {
    pub skip_filename: bool,
}

impl PrettyEmitter {
    pub fn new(
        cm: Lrc<SourceMap>,
        wr: Box<dyn Write + Send + Sync>,
        reporter: GraphicalReportHandler,
        config: PrettyEmitterConfig,
    ) -> Self {
        Self {
            cm,
            wr: WriterWrapper(wr),
            reporter,
            config,
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

    fn write_fmt(&mut self, args: fmt::Arguments<'_>) -> fmt::Result {
        self.0.write_fmt(args)
    }
}

#[derive(Clone, Copy)]
struct MietteSourceCode<'a>(&'a SourceMap, &'a PrettyEmitterConfig);

impl SourceCode for MietteSourceCode<'_> {
    fn read_span<'a>(
        &'a self,
        span: &SourceSpan,
        context_lines_before: usize,
        context_lines_after: usize,
    ) -> Result<Box<dyn SpanContents<'a> + 'a>, MietteError> {
        let lo = span.offset();
        let hi = lo + span.len();

        let mut span = Span::new(BytePos(lo as _), BytePos(hi as _));

        span = self
            .0
            .with_span_to_prev_source(span, |src| {
                let len = src
                    .rsplit('\n')
                    .take(context_lines_before + 1)
                    .map(|s| s.len() + 1)
                    .sum::<usize>();

                span.lo.0 -= (len as u32) - 1;
                span
            })
            .unwrap_or(span);

        span = self
            .0
            .with_span_to_next_source(span, |src| {
                let len = src
                    .split('\n')
                    .take(context_lines_after + 1)
                    .map(|s| s.len() + 1)
                    .sum::<usize>();

                span.hi.0 += (len as u32) - 1;
                span
            })
            .unwrap_or(span);

        span = self
            .0
            .with_snippet_of_span(span, |src| {
                if src.lines().next().is_some() {
                    return span;
                }
                let lo = src.len() - src.trim_start().len();
                let hi = src.len() - src.trim_end().len();

                span.lo.0 += lo as u32;
                span.hi.0 -= hi as u32;

                span
            })
            .unwrap_or(span);

        let mut src = self
            .0
            .with_snippet_of_span(span, |s| unsafe { transmute::<&str, &str>(s) })
            .unwrap_or(" ");

        if span.lo == span.hi {
            src = " ";
        }

        let loc = self.0.lookup_char_pos(span.lo());
        let line_count = loc.file.analyze().lines.len();

        let name = if self.1.skip_filename {
            None
        } else {
            match &*loc.file.name {
                FileName::Real(ref path) => Some(path.to_string_lossy().into_owned()),
                FileName::Custom(ref name) => Some(name.clone()),
                FileName::Anon => None,
                _ => Some(loc.file.name.to_string()),
            }
        };

        Ok(Box::new(SpanContentsImpl {
            _cm: self.0,
            data: src,
            span: convert_span(span),
            line: loc.line.saturating_sub(1),
            column: loc.col_display,
            line_count,
            name,
        }))
    }
}

impl Emitter for PrettyEmitter {
    fn emit(&mut self, db: &DiagnosticBuilder) {
        let d = &**db;

        let source_code = MietteSourceCode(&self.cm, &self.config);

        let children = d
            .children
            .iter()
            .filter(|d| !matches!(d.level, Level::Help))
            .map(|d| MietteSubdiagnostic { source_code, d })
            .collect::<Vec<_>>();

        let diagnostic = MietteDiagnostic {
            source_code,
            d,
            children,
        };

        self.reporter
            .render_report(&mut self.wr, &diagnostic)
            .unwrap();
    }
}

struct MietteDiagnostic<'a> {
    source_code: MietteSourceCode<'a>,
    d: &'a swc_common::errors::Diagnostic,

    children: Vec<MietteSubdiagnostic<'a>>,
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
        level_to_severity(self.d.level)
    }

    fn help<'a>(&'a self) -> Option<Box<dyn fmt::Display + 'a>> {
        self.d
            .children
            .iter()
            .filter(|s| s.level == Level::Help)
            .map(|s| Box::new(&s.message[0].0) as Box<_>)
            .next()
    }

    fn url<'a>(&'a self) -> Option<Box<dyn fmt::Display + 'a>> {
        None
    }

    fn source_code(&self) -> Option<&dyn SourceCode> {
        // empty file
        if let Some(span) = self.d.span.primary_span() {
            if span.lo.is_dummy() || span.hi.is_dummy() {
                return None;
            }
        } else {
            return None;
        }

        Some(&self.source_code as &dyn SourceCode)
    }

    fn labels(&self) -> Option<Box<dyn Iterator<Item = miette::LabeledSpan> + '_>> {
        let iter = self.d.span.span_labels().into_iter().map(|span_label| {
            LabeledSpan::new_with_span(span_label.label, convert_span(span_label.span))
        });

        Some(Box::new(iter))
    }

    fn related<'a>(&'a self) -> Option<Box<dyn Iterator<Item = &'a dyn miette::Diagnostic> + 'a>> {
        if self.children.is_empty() {
            None
        } else {
            Some(Box::new(
                self.children.iter().map(|d| d as &dyn miette::Diagnostic),
            ))
        }
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
    SourceSpan::new(start, len.0 as usize)
}

struct MietteSubdiagnostic<'a> {
    source_code: MietteSourceCode<'a>,
    d: &'a SubDiagnostic,
}

impl miette::Diagnostic for MietteSubdiagnostic<'_> {
    fn code<'a>(&'a self) -> Option<Box<dyn fmt::Display + 'a>> {
        None
    }

    fn severity(&self) -> Option<Severity> {
        level_to_severity(self.d.level)
    }

    fn help<'a>(&'a self) -> Option<Box<dyn fmt::Display + 'a>> {
        None
    }

    fn url<'a>(&'a self) -> Option<Box<dyn fmt::Display + 'a>> {
        None
    }

    fn source_code(&self) -> Option<&dyn SourceCode> {
        Some(&self.source_code)
    }

    fn labels(&self) -> Option<Box<dyn Iterator<Item = LabeledSpan> + '_>> {
        let iter = self.d.span.span_labels().into_iter().map(|span_label| {
            LabeledSpan::new_with_span(span_label.label, convert_span(span_label.span))
        });

        Some(Box::new(iter))
    }

    fn related<'a>(&'a self) -> Option<Box<dyn Iterator<Item = &'a dyn miette::Diagnostic> + 'a>> {
        None
    }
}

impl std::error::Error for MietteSubdiagnostic<'_> {}

/// Delegates to `Diagnostics`
impl fmt::Debug for MietteSubdiagnostic<'_> {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        fmt::Debug::fmt(&self.d, f)
    }
}

impl fmt::Display for MietteSubdiagnostic<'_> {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        fmt::Display::fmt(&self.d.message[0].0, f)
    }
}

struct SpanContentsImpl<'a> {
    /// This ensures that the underlying sourcemap is not dropped.
    _cm: &'a SourceMap,

    // Data from a [`SourceCode`], in bytes.
    data: &'a str,
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

impl<'a> SpanContents<'a> for SpanContentsImpl<'a> {
    fn data(&self) -> &'a [u8] {
        self.data.as_bytes()
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

fn level_to_severity(level: Level) -> Option<Severity> {
    match level {
        Level::FailureNote | Level::Bug | Level::Fatal | Level::PhaseFatal | Level::Error => {
            Some(Severity::Error)
        }
        Level::Warning => Some(Severity::Warning),
        Level::Note | Level::Help => Some(Severity::Advice),
        Level::Cancelled => None,
    }
}
