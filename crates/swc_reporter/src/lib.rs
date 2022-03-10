use std::fmt::{self, Write};

use miette::{GraphicalReportHandler, MietteError, Severity, SourceCode, SpanContents};
use swc_common::{
    errors::{DiagnosticBuilder, Emitter, Level},
    sync::Lrc,
    SourceMap,
};

pub struct PrettyEmitter {
    cm: Lrc<SourceMap>,

    wr: WriterWrapper,

    reporter: GraphicalReportHandler,
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
        span: &miette::SourceSpan,
        context_lines_before: usize,
        context_lines_after: usize,
    ) -> Result<Box<dyn SpanContents<'a> + 'a>, MietteError> {
        todo!()
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
                swc_common::errors::DiagnosticId::Error(v) => v.clone(),
                swc_common::errors::DiagnosticId::Lint(v) => v.clone(),
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
        None
    }

    fn url<'a>(&'a self) -> Option<Box<dyn fmt::Display + 'a>> {
        None
    }

    fn source_code(&self) -> Option<&dyn SourceCode> {
        Some(&self.source_code as &dyn SourceCode)
    }

    fn labels(&self) -> Option<Box<dyn Iterator<Item = miette::LabeledSpan> + '_>> {
        None
    }

    fn related<'a>(&'a self) -> Option<Box<dyn Iterator<Item = &'a dyn miette::Diagnostic> + 'a>> {
        None
    }
}

impl std::error::Error for MietteDiagnostic<'_> {}

impl fmt::Debug for MietteDiagnostic<'_> {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        todo!()
    }
}

impl fmt::Display for MietteDiagnostic<'_> {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        todo!()
    }
}
