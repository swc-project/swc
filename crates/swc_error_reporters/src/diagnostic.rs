use std::{fmt, mem::transmute};

use miette::{GraphicalReportHandler, Severity, SourceOffset, SourceSpan};
use swc_common::{
    errors::{Diagnostic, DiagnosticId, Level, SubDiagnostic},
    BytePos, FileName, MultiSpan, SourceMap, Span,
};

use crate::snippet_window::snippet_window;

pub struct PrettyDiagnostic<'a> {
    source_code: PrettySourceCode<'a>,
    d: &'a Diagnostic,

    children: Vec<PrettySubDiagnostic<'a>>,
}

impl<'a> PrettyDiagnostic<'a> {
    pub fn new(d: &'a Diagnostic, cm: &'a SourceMap, skip_filename: bool) -> Self {
        let source_code = PrettySourceCode {
            cm,
            skip_filename,
            labels: KnownLabels::MultiSpan(&d.span),
        };

        let children = d
            .children
            .iter()
            .filter(|d| !matches!(d.level, Level::Help))
            .map(|d| PrettySubDiagnostic {
                source_code: PrettySourceCode {
                    labels: KnownLabels::MultiSpan(&d.span),
                    ..source_code
                },
                d,
            })
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
        let span = self.d.span.primary_span()?;

        if !self.source_code.is_valid_span(span) {
            return None;
        }

        Some(&self.source_code as &dyn miette::SourceCode)
    }

    fn labels(&self) -> Option<Box<dyn Iterator<Item = miette::LabeledSpan> + '_>> {
        let iter = self
            .d
            .span
            .span_labels()
            .into_iter()
            .filter_map(|span_label| {
                if !self.source_code.is_valid_span(span_label.span) {
                    return None;
                }

                Some(miette::LabeledSpan::new_with_span(
                    span_label.label,
                    convert_span(span_label.span),
                ))
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
        handler.render_report(&mut wr, self).unwrap();
        wr
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
    /// The labels that miette renders with this source.
    labels: KnownLabels<'a>,
}

/// The labels of the diagnostic that a [PrettySourceCode] is used for.
///
/// `read_span` uses them to check whether a snippet that contains a very wide
/// line can be rendered (see [crate::snippet_window]).
#[derive(Clone, Copy)]
enum KnownLabels<'a> {
    /// The labels are not known, so a very wide line in a span is not shown.
    Unknown,
    /// The labels are the span labels of this [MultiSpan].
    MultiSpan(&'a MultiSpan),
    /// The labels have these spans.
    Spans(&'a [Span]),
}

impl<'a> PrettySourceCode<'a> {
    /// Returns a source that renders the labels with the given spans.
    ///
    /// Pass the spans of all labels of the diagnostic that is rendered with
    /// this source. With them, the source can show a label that covers a line
    /// that is wider than `u16::MAX` columns. Without them, the source shows
    /// such a label only as a short note, because it cannot check that miette
    /// can render the line without a panic.
    pub fn with_labels<'b>(self, labels: &'b [Span]) -> PrettySourceCode<'b>
    where
        'a: 'b,
    {
        PrettySourceCode {
            cm: self.cm,
            skip_filename: self.skip_filename,
            labels: KnownLabels::Spans(labels),
        }
    }

    #[inline]
    fn is_valid_span(&self, span: Span) -> bool {
        !span.is_dummy() && self.cm.with_snippet_of_span(span, |_| ()).is_ok()
    }

    /// Returns the byte ranges of the labels in the source file that starts at
    /// `file_start` and ends at `file_end`, relative to `file_start`.
    fn label_ranges(&self, file_start: BytePos, file_end: BytePos) -> Option<Vec<(usize, usize)>> {
        let to_range = |span: Span| {
            // Skip a malformed span, as `is_valid_span` does for miette.
            (span.lo <= span.hi && span.lo >= file_start && span.hi <= file_end && !span.is_dummy())
                .then(|| {
                    (
                        (span.lo.0 - file_start.0) as usize,
                        (span.hi.0 - file_start.0) as usize,
                    )
                })
        };

        match self.labels {
            KnownLabels::Unknown => None,
            KnownLabels::MultiSpan(span) => Some(
                span.span_labels()
                    .into_iter()
                    .filter_map(|label| to_range(label.span))
                    .collect(),
            ),
            KnownLabels::Spans(spans) => Some(spans.iter().copied().filter_map(to_range).collect()),
        }
    }
}

impl miette::SourceCode for PrettySourceCode<'_> {
    fn read_span<'a>(
        &'a self,
        span: &SourceSpan,
        context_lines_before: usize,
        context_lines_after: usize,
    ) -> Result<Box<dyn miette::SpanContents<'a> + 'a>, miette::MietteError> {
        let lo = span.offset();
        let hi = lo
            .checked_add(span.len())
            .ok_or(miette::MietteError::OutOfBounds)?;

        let lo = u32::try_from(lo).map_err(|_| miette::MietteError::OutOfBounds)?;
        let hi = u32::try_from(hi).map_err(|_| miette::MietteError::OutOfBounds)?;

        let span = Span::new(BytePos(lo), BytePos(hi));

        if !self.is_valid_span(span) {
            return Err(miette::MietteError::OutOfBounds);
        }

        let file = self
            .cm
            .try_lookup_byte_offset(span.lo)
            .map_err(|_| miette::MietteError::OutOfBounds)?
            .sf;
        // SAFETY: The source map keeps every source file alive while it is
        // alive and never changes the text of a source file, and `'a` does not
        // outlive `self.cm`.
        let file_src = unsafe { transmute::<&str, &'a str>(&file.src) };

        let base = file.start_pos.0;
        let lo = (span.lo.0 - base) as usize;
        let hi = (span.hi.0 - base) as usize;

        // Selects the lines to show, and crops the lines that are too wide for
        // miette to render without a panic.
        let labels = self.label_ranges(file.start_pos, file.end_pos);
        let (start, end) = snippet_window(
            file_src,
            lo,
            hi,
            context_lines_before,
            context_lines_after,
            labels.as_deref(),
        )
        .ok_or(miette::MietteError::OutOfBounds)?;

        let span = Span::new(BytePos(base + start as u32), BytePos(base + end as u32));
        let src = if start == end {
            " "
        } else {
            &file_src[start..end]
        };

        let loc = self
            .cm
            .try_lookup_char_pos(span.lo())
            .map_err(|_| miette::MietteError::OutOfBounds)?;
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

/// Returns a source that does not know the labels of the diagnostic. Use
/// [PrettySourceCode::with_labels] to pass them.
pub fn to_pretty_source_code(cm: &SourceMap, skip_filename: bool) -> PrettySourceCode<'_> {
    PrettySourceCode {
        cm,
        skip_filename,
        labels: KnownLabels::Unknown,
    }
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
        let iter = self
            .d
            .span
            .span_labels()
            .into_iter()
            .filter_map(|span_label| {
                if !self.source_code.is_valid_span(span_label.span) {
                    return None;
                }

                Some(miette::LabeledSpan::new_with_span(
                    span_label.label,
                    convert_span(span_label.span),
                ))
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
    let start = span.lo.0 as usize;
    let end = span.hi.0 as usize;

    SourceSpan::new(SourceOffset::from(start), end.saturating_sub(start))
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
