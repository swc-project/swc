use std::{fmt, mem::transmute, panic::AssertUnwindSafe};

use miette::{GraphicalReportHandler, Severity, SourceOffset, SourceSpan};
use swc_common::{
    errors::{Diagnostic, DiagnosticId, Level, SubDiagnostic},
    BytePos, FileName, SourceMap, Span,
};

pub struct PrettyDiagnostic<'a> {
    source_code: PrettySourceCode<'a>,
    d: &'a Diagnostic,

    children: Vec<PrettySubDiagnostic<'a>>,
}

impl<'a> PrettyDiagnostic<'a> {
    pub fn new(d: &'a Diagnostic, cm: &'a SourceMap, skip_filename: bool) -> Self {
        let source_code = PrettySourceCode { cm, skip_filename };

        let children = d
            .children
            .iter()
            .filter(|d| !matches!(d.level, Level::Help))
            .map(|d| PrettySubDiagnostic { source_code, d })
            .collect();
        Self {
            source_code,
            d,
            children,
        }
    }
}

impl miette::Diagnostic for PrettyDiagnostic<'_> {
    fn code<'a>(&'a self) -> Option<Box<dyn std::fmt::Display + 'a>> {
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

    fn help<'a>(&'a self) -> Option<Box<dyn std::fmt::Display + 'a>> {
        self.d
            .children
            .iter()
            .filter(|s| s.level == Level::Help)
            .map(|s| Box::new(&s.message[0].0) as Box<_>)
            .next()
    }

    fn source_code(&self) -> Option<&dyn miette::SourceCode> {
        if let Some(span) = self.d.span.primary_span() {
            if span.lo.is_dummy() || span.hi.is_dummy() {
                return None;
            }
        } else {
            return None;
        }

        Some(&self.source_code as &dyn miette::SourceCode)
    }

    fn labels(&self) -> Option<Box<dyn Iterator<Item = miette::LabeledSpan> + '_>> {
        let iter = self.d.span.span_labels().into_iter().map(|span_label| {
            miette::LabeledSpan::new_with_span(span_label.label, convert_span(span_label.span))
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

impl<'a> PrettyDiagnostic<'a> {
    pub fn to_pretty_string(&self, handler: &'a GraphicalReportHandler) -> String {
        let mut wr = String::new();
        // Note: miette's GraphicalReportHandler can panic when rendering errors on
        // very long lines (>65535 characters) due to Rust's format! width
        // parameter limit. We catch this panic and fall back to a simple
        // display format. See: https://github.com/swc-project/swc/issues/10518
        let result =
            std::panic::catch_unwind(AssertUnwindSafe(|| handler.render_report(&mut wr, self)));
        match result {
            Ok(Ok(())) => wr,
            Ok(Err(_)) | Err(_) => {
                // Fallback to simple display format if miette panics or errors
                format!("{}: {}", self.severity_str(), self)
            }
        }
    }

    fn severity_str(&self) -> &'static str {
        match self.d.level {
            Level::Bug | Level::Fatal | Level::PhaseFatal | Level::Error => "error",
            Level::Warning => "warning",
            Level::Note => "note",
            Level::Help => "help",
            Level::FailureNote => "failure-note",
            Level::Cancelled => "cancelled",
        }
    }
}

impl std::error::Error for PrettyDiagnostic<'_> {}

/// Delegates to `Diagnostics`
impl fmt::Debug for PrettyDiagnostic<'_> {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        fmt::Debug::fmt(&self.d, f)
    }
}

impl fmt::Display for PrettyDiagnostic<'_> {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        self.d.message[0].0.fmt(f)
    }
}

#[derive(Clone, Copy)]
pub struct PrettySourceCode<'a> {
    cm: &'a SourceMap,
    skip_filename: bool,
}

impl miette::SourceCode for PrettySourceCode<'_> {
    fn read_span<'a>(
        &'a self,
        span: &SourceSpan,
        context_lines_before: usize,
        context_lines_after: usize,
    ) -> Result<Box<dyn miette::SpanContents<'a> + 'a>, miette::MietteError> {
        let lo = span.offset();
        let hi = lo + span.len();

        let mut span = Span::new(BytePos(lo as _), BytePos(hi as _));

        span = self
            .cm
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
            .cm
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
            .cm
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
            .cm
            .with_snippet_of_span(span, |s| unsafe { transmute::<&str, &str>(s) })
            .unwrap_or(" ");

        if span.lo == span.hi {
            src = " ";
        }

        let loc = self.cm.lookup_char_pos(span.lo());
        let line_count = loc.file.analyze().lines.len();

        let name = if self.skip_filename {
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
            _cm: self.cm,
            data: src,
            span: convert_span(span),
            line: loc.line.saturating_sub(1),
            column: loc.col_display,
            line_count,
            name,
        }))
    }
}

pub fn to_pretty_source_code(cm: &SourceMap, skip_filename: bool) -> PrettySourceCode<'_> {
    PrettySourceCode { cm, skip_filename }
}
struct PrettySubDiagnostic<'a> {
    source_code: PrettySourceCode<'a>,
    d: &'a SubDiagnostic,
}

impl std::error::Error for PrettySubDiagnostic<'_> {}

/// Delegates to `Diagnostics`
impl fmt::Debug for PrettySubDiagnostic<'_> {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        fmt::Debug::fmt(&self.d, f)
    }
}

impl fmt::Display for PrettySubDiagnostic<'_> {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        fmt::Display::fmt(&self.d.message[0].0, f)
    }
}

impl miette::Diagnostic for PrettySubDiagnostic<'_> {
    fn severity(&self) -> Option<Severity> {
        level_to_severity(self.d.level)
    }

    fn source_code(&self) -> Option<&dyn miette::SourceCode> {
        Some(&self.source_code)
    }

    fn labels(&self) -> Option<Box<dyn Iterator<Item = miette::LabeledSpan> + '_>> {
        let iter = self.d.span.span_labels().into_iter().map(|span_label| {
            miette::LabeledSpan::new_with_span(span_label.label, convert_span(span_label.span))
        });

        Some(Box::new(iter))
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

impl<'a> miette::SpanContents<'a> for SpanContentsImpl<'a> {
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

pub fn convert_span(span: Span) -> SourceSpan {
    let len = span.hi - span.lo;
    let start = SourceOffset::from(span.lo.0 as usize);
    SourceSpan::new(start, len.0 as usize)
}

pub trait ToPrettyDiagnostic {
    fn to_pretty_diagnostic<'a>(
        &'a self,
        cm: &'a SourceMap,
        skip_filename: bool,
    ) -> PrettyDiagnostic<'a>;

    fn to_pretty_string<'a>(
        &self,
        cm: &'a SourceMap,
        skip_filename: bool,
        handler: &'a GraphicalReportHandler,
    ) -> String;
}

// For readable diagnostic, then render by miette
impl ToPrettyDiagnostic for Diagnostic {
    /// Returns a pretty-printed of the diagnostic.
    fn to_pretty_diagnostic<'a>(
        &'a self,
        cm: &'a SourceMap,
        skip_filename: bool,
    ) -> PrettyDiagnostic<'a> {
        PrettyDiagnostic::new(self, cm, skip_filename)
    }

    /// Converts the diagnostic into a pretty-printed string, suitable for
    /// display.
    ///
    /// This method is used to generate a human-readable string representation
    /// of the diagnostic. It utilizes the `PrettyDiagnostic` struct to
    /// format the diagnostic information.
    ///
    /// # Parameters
    ///
    /// - `cm`: A reference to the `SourceMap` used for mapping source code
    ///   locations.
    /// - `skip_filename`: A boolean indicating whether to skip including
    ///   filenames in the output.
    /// - `handler`: A reference to the `GraphicalReportHandler` used for
    ///   handling graphical reports.
    ///
    /// # Returns
    ///
    /// A `String` containing the pretty-printed diagnostic information.
    fn to_pretty_string<'a>(
        &self,
        cm: &'a SourceMap,
        skip_filename: bool,
        handler: &'a GraphicalReportHandler,
    ) -> String {
        let pretty_diagnostic = PrettyDiagnostic::new(self, cm, skip_filename);
        pretty_diagnostic.to_pretty_string(handler)
    }
}
