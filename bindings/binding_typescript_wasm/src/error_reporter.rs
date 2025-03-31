use std::fmt::{self, Write};

use miette::{
    diagnostic_chain::{DiagnosticChain, ErrorKind},
    handlers::theme::*,
    highlighters::{Highlighter, MietteHighlighter},
    protocol::{Diagnostic, Severity},
    GraphicalTheme, LabeledSpan, ReportHandler, SourceCode, SourceSpan, SpanContents,
};
use owo_colors::{OwoColorize, Style, StyledList};
use unicode_width::{UnicodeWidthChar, UnicodeWidthStr};

/**
A [`ReportHandler`] that displays a given [`Report`](crate::Report) in a
quasi-graphical way, using terminal colors, unicode drawing characters, and
other such things.

This is the default reporter bundled with `miette`.

This printer can be customized by using [`new_themed()`](GraphicalReportHandler::new_themed) and handing it a
[`GraphicalTheme`] of your own creation (or using one of its own defaults!)

See [`set_hook()`](crate::set_hook) for more details on customizing your global
printer.
*/
#[derive(Debug, Clone)]
pub struct GraphicalReportHandler {
    pub(crate) links: LinkStyle,
    pub(crate) termwidth: usize,
    pub(crate) theme: GraphicalTheme,
    pub(crate) footer: Option<String>,
    pub(crate) context_lines: usize,
    pub(crate) tab_width: usize,
    pub(crate) with_cause_chain: bool,
    pub(crate) wrap_lines: bool,
    pub(crate) break_words: bool,
    pub(crate) word_separator: Option<textwrap::WordSeparator>,
    pub(crate) word_splitter: Option<textwrap::WordSplitter>,
    pub(crate) highlighter: MietteHighlighter,
    pub(crate) link_display_text: Option<String>,
    pub(crate) show_related_as_nested: bool,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum LinkStyle {
    None,
    Link,
    Text,
}

impl GraphicalReportHandler {
    /// Create a new `GraphicalReportHandler` with the default
    /// [`GraphicalTheme`]. This will use both unicode characters and colors.
    pub fn new() -> Self {
        Self {
            links: LinkStyle::Link,
            termwidth: 200,
            theme: GraphicalTheme::default(),
            footer: None,
            context_lines: 1,
            tab_width: 4,
            with_cause_chain: true,
            wrap_lines: true,
            break_words: true,
            word_separator: None,
            word_splitter: None,
            highlighter: MietteHighlighter::default(),
            link_display_text: None,
            show_related_as_nested: false,
        }
    }

    ///Create a new `GraphicalReportHandler` with a given [`GraphicalTheme`].
    pub fn new_themed(theme: GraphicalTheme) -> Self {
        Self {
            links: LinkStyle::Link,
            termwidth: 200,
            theme,
            footer: None,
            context_lines: 1,
            tab_width: 4,
            wrap_lines: true,
            with_cause_chain: true,
            break_words: true,
            word_separator: None,
            word_splitter: None,
            highlighter: MietteHighlighter::default(),
            link_display_text: None,
            show_related_as_nested: false,
        }
    }

    /// Set the displayed tab width in spaces.
    pub fn tab_width(mut self, width: usize) -> Self {
        self.tab_width = width;
        self
    }

    /// Whether to enable error code linkification using [`Diagnostic::url()`].
    pub fn with_links(mut self, links: bool) -> Self {
        self.links = if links {
            LinkStyle::Link
        } else {
            LinkStyle::Text
        };
        self
    }

    /// Include the cause chain of the top-level error in the graphical output,
    /// if available.
    pub fn with_cause_chain(mut self) -> Self {
        self.with_cause_chain = true;
        self
    }

    /// Do not include the cause chain of the top-level error in the graphical
    /// output.
    pub fn without_cause_chain(mut self) -> Self {
        self.with_cause_chain = false;
        self
    }

    /// Whether to include [`Diagnostic::url()`] in the output.
    ///
    /// Disabling this is not recommended, but can be useful for more easily
    /// reproducible tests, as `url(docsrs)` links are version-dependent.
    pub fn with_urls(mut self, urls: bool) -> Self {
        self.links = match (self.links, urls) {
            (_, false) => LinkStyle::None,
            (LinkStyle::None, true) => LinkStyle::Link,
            (links, true) => links,
        };
        self
    }

    /// Set a theme for this handler.
    pub fn with_theme(mut self, theme: GraphicalTheme) -> Self {
        self.theme = theme;
        self
    }

    /// Sets the width to wrap the report at.
    pub fn with_width(mut self, width: usize) -> Self {
        self.termwidth = width;
        self
    }

    /// Enables or disables wrapping of lines to fit the width.
    pub fn with_wrap_lines(mut self, wrap_lines: bool) -> Self {
        self.wrap_lines = wrap_lines;
        self
    }

    /// Enables or disables breaking of words during wrapping.
    pub fn with_break_words(mut self, break_words: bool) -> Self {
        self.break_words = break_words;
        self
    }

    /// Sets the word separator to use when wrapping.
    pub fn with_word_separator(mut self, word_separator: textwrap::WordSeparator) -> Self {
        self.word_separator = Some(word_separator);
        self
    }

    /// Sets the word splitter to use when wrapping.
    pub fn with_word_splitter(mut self, word_splitter: textwrap::WordSplitter) -> Self {
        self.word_splitter = Some(word_splitter);
        self
    }

    /// Sets the 'global' footer for this handler.
    pub fn with_footer(mut self, footer: String) -> Self {
        self.footer = Some(footer);
        self
    }

    /// Sets the number of lines of context to show around each error.
    pub fn with_context_lines(mut self, lines: usize) -> Self {
        self.context_lines = lines;
        self
    }

    /// Sets whether to render related errors as nested errors.
    pub fn with_show_related_as_nested(mut self, show_related_as_nested: bool) -> Self {
        self.show_related_as_nested = show_related_as_nested;
        self
    }

    /// Enable syntax highlighting for source code snippets, using the given
    /// [`Highlighter`]. See the [highlighters](crate::highlighters) crate
    /// for more details.
    pub fn with_syntax_highlighting(
        mut self,
        highlighter: impl Highlighter + Send + Sync + 'static,
    ) -> Self {
        self.highlighter = MietteHighlighter::from(highlighter);
        self
    }

    /// Disable syntax highlighting. This uses the
    /// [`crate::highlighters::BlankHighlighter`] as a no-op highlighter.
    pub fn without_syntax_highlighting(mut self) -> Self {
        self.highlighter = MietteHighlighter::nocolor();
        self
    }

    /// Sets the display text for links.
    /// Miette displays `(link)` if this option is not set.
    pub fn with_link_display_text(mut self, text: impl Into<String>) -> Self {
        self.link_display_text = Some(text.into());
        self
    }
}

impl Default for GraphicalReportHandler {
    fn default() -> Self {
        Self::new()
    }
}

impl GraphicalReportHandler {
    /// Render a [`Diagnostic`]. This function is mostly internal and meant to
    /// be called by the toplevel [`ReportHandler`] handler, but is made public
    /// to make it easier (possible) to test in isolation from global state.
    pub fn render_report(
        &self,
        f: &mut impl fmt::Write,
        diagnostic: &(dyn Diagnostic),
    ) -> fmt::Result {
        self.render_report_inner(f, diagnostic, diagnostic.source_code())
    }

    fn render_report_inner(
        &self,
        f: &mut impl fmt::Write,
        diagnostic: &(dyn Diagnostic),
        parent_src: Option<&dyn SourceCode>,
    ) -> fmt::Result {
        let src = diagnostic.source_code().or(parent_src);
        self.render_header(f, diagnostic, false)?;
        self.render_causes(f, diagnostic, src)?;
        self.render_snippets(f, diagnostic, src)?;
        self.render_footer(f, diagnostic)?;
        self.render_related(f, diagnostic, src)?;
        if let Some(footer) = &self.footer {
            writeln!(f)?;
            let width = self.termwidth.saturating_sub(2);
            let mut opts = textwrap::Options::new(width)
                .initial_indent("  ")
                .subsequent_indent("  ")
                .break_words(self.break_words);
            if let Some(word_separator) = self.word_separator {
                opts = opts.word_separator(word_separator);
            }
            if let Some(word_splitter) = self.word_splitter.clone() {
                opts = opts.word_splitter(word_splitter);
            }

            writeln!(f, "{}", self.wrap(footer, opts))?;
        }
        Ok(())
    }

    fn render_header(
        &self,
        f: &mut impl fmt::Write,
        diagnostic: &(dyn Diagnostic),
        is_nested: bool,
    ) -> fmt::Result {
        let severity_style = match diagnostic.severity() {
            Some(Severity::Error) | None => self.theme.styles.error,
            Some(Severity::Warning) => self.theme.styles.warning,
            Some(Severity::Advice) => self.theme.styles.advice,
        };
        let mut header = String::new();
        let mut need_newline = is_nested;
        if self.links == LinkStyle::Link && diagnostic.url().is_some() {
            let url = diagnostic.url().unwrap(); // safe
            let code = if let Some(code) = diagnostic.code() {
                format!("{} ", code)
            } else {
                "".to_string()
            };
            let display_text = self.link_display_text.as_deref().unwrap_or("(link)");
            let link = format!(
                "\u{1b}]8;;{}\u{1b}\\{}{}\u{1b}]8;;\u{1b}\\",
                url,
                code.style(severity_style),
                display_text.style(self.theme.styles.link)
            );
            write!(header, "{}", link)?;
            writeln!(f, "{}", header)?;
            need_newline = true;
        } else if let Some(code) = diagnostic.code() {
            write!(header, "{}", code.style(severity_style),)?;
            if self.links == LinkStyle::Text && diagnostic.url().is_some() {
                let url = diagnostic.url().unwrap(); // safe
                write!(header, " ({})", url.style(self.theme.styles.link))?;
            }
            writeln!(f, "{}", header)?;
            need_newline = true;
        }
        if need_newline {
            writeln!(f)?;
        }
        Ok(())
    }

    fn render_causes(
        &self,
        f: &mut impl fmt::Write,
        diagnostic: &(dyn Diagnostic),
        parent_src: Option<&dyn SourceCode>,
    ) -> fmt::Result {
        let src = diagnostic.source_code().or(parent_src);

        let (severity_style, severity_icon) = match diagnostic.severity() {
            Some(Severity::Error) | None => (self.theme.styles.error, &self.theme.characters.error),
            Some(Severity::Warning) => (self.theme.styles.warning, &self.theme.characters.warning),
            Some(Severity::Advice) => (self.theme.styles.advice, &self.theme.characters.advice),
        };

        let initial_indent = format!("  {} ", severity_icon.style(severity_style));
        let rest_indent = format!("  {} ", self.theme.characters.vbar.style(severity_style));
        let width = self.termwidth.saturating_sub(2);
        let mut opts = textwrap::Options::new(width)
            .initial_indent(&initial_indent)
            .subsequent_indent(&rest_indent)
            .break_words(self.break_words);
        if let Some(word_separator) = self.word_separator {
            opts = opts.word_separator(word_separator);
        }
        if let Some(word_splitter) = self.word_splitter.clone() {
            opts = opts.word_splitter(word_splitter);
        }

        writeln!(f, "{}", self.wrap(&diagnostic.to_string(), opts))?;

        if !self.with_cause_chain {
            return Ok(());
        }

        if let Some(mut cause_iter) = diagnostic
            .diagnostic_source()
            .map(DiagnosticChain::from_diagnostic)
            .or_else(|| diagnostic.source().map(DiagnosticChain::from_stderror))
            .map(|it| it.peekable())
        {
            while let Some(error) = cause_iter.next() {
                let is_last = cause_iter.peek().is_none();
                let char = if !is_last {
                    self.theme.characters.lcross
                } else {
                    self.theme.characters.lbot
                };
                let initial_indent = format!(
                    "  {}{}{} ",
                    char, self.theme.characters.hbar, self.theme.characters.rarrow
                )
                .style(severity_style)
                .to_string();
                let rest_indent = format!(
                    "  {}   ",
                    if is_last {
                        ' '
                    } else {
                        self.theme.characters.vbar
                    }
                )
                .style(severity_style)
                .to_string();
                let mut opts = textwrap::Options::new(width)
                    .initial_indent(&initial_indent)
                    .subsequent_indent(&rest_indent)
                    .break_words(self.break_words);
                if let Some(word_separator) = self.word_separator {
                    opts = opts.word_separator(word_separator);
                }
                if let Some(word_splitter) = self.word_splitter.clone() {
                    opts = opts.word_splitter(word_splitter);
                }

                match error {
                    ErrorKind::Diagnostic(diag) => {
                        let mut inner = String::new();

                        let mut inner_renderer = self.clone();
                        // Don't print footer for inner errors
                        inner_renderer.footer = None;
                        // Cause chains are already flattened, so don't double-print the nested
                        // error
                        inner_renderer.with_cause_chain = false;
                        // Since everything from here on is indented, shrink the virtual terminal
                        inner_renderer.termwidth -= rest_indent.width();
                        inner_renderer.render_report_inner(&mut inner, diag, src)?;

                        // If there was no header, remove the leading newline
                        let inner = inner.trim_start_matches('\n');
                        writeln!(f, "{}", self.wrap(inner, opts))?;
                    }
                    ErrorKind::StdError(err) => {
                        writeln!(f, "{}", self.wrap(&err.to_string(), opts))?;
                    }
                }
            }
        }

        Ok(())
    }

    fn render_footer(&self, f: &mut impl fmt::Write, diagnostic: &(dyn Diagnostic)) -> fmt::Result {
        if let Some(help) = diagnostic.help() {
            let width = self.termwidth.saturating_sub(2);
            let initial_indent = "  help: ".style(self.theme.styles.help).to_string();
            let mut opts = textwrap::Options::new(width)
                .initial_indent(&initial_indent)
                .subsequent_indent("        ")
                .break_words(self.break_words);
            if let Some(word_separator) = self.word_separator {
                opts = opts.word_separator(word_separator);
            }
            if let Some(word_splitter) = self.word_splitter.clone() {
                opts = opts.word_splitter(word_splitter);
            }

            writeln!(f, "{}", self.wrap(&help.to_string(), opts))?;
        }
        Ok(())
    }

    fn render_related(
        &self,
        f: &mut impl fmt::Write,
        diagnostic: &(dyn Diagnostic),
        parent_src: Option<&dyn SourceCode>,
    ) -> fmt::Result {
        let src = diagnostic.source_code().or(parent_src);

        if let Some(related) = diagnostic.related() {
            let severity_style = match diagnostic.severity() {
                Some(Severity::Error) | None => self.theme.styles.error,
                Some(Severity::Warning) => self.theme.styles.warning,
                Some(Severity::Advice) => self.theme.styles.advice,
            };

            let mut inner_renderer = self.clone();
            // Re-enable the printing of nested cause chains for related errors
            inner_renderer.with_cause_chain = true;
            if self.show_related_as_nested {
                let width = self.termwidth.saturating_sub(2);
                let mut related = related.peekable();
                while let Some(rel) = related.next() {
                    let is_last = related.peek().is_none();
                    let char = if !is_last {
                        self.theme.characters.lcross
                    } else {
                        self.theme.characters.lbot
                    };
                    let initial_indent = format!(
                        "  {}{}{} ",
                        char, self.theme.characters.hbar, self.theme.characters.rarrow
                    )
                    .style(severity_style)
                    .to_string();
                    let rest_indent = format!(
                        "  {}   ",
                        if is_last {
                            ' '
                        } else {
                            self.theme.characters.vbar
                        }
                    )
                    .style(severity_style)
                    .to_string();

                    let mut opts = textwrap::Options::new(width)
                        .initial_indent(&initial_indent)
                        .subsequent_indent(&rest_indent)
                        .break_words(self.break_words);
                    if let Some(word_separator) = self.word_separator {
                        opts = opts.word_separator(word_separator);
                    }
                    if let Some(word_splitter) = self.word_splitter.clone() {
                        opts = opts.word_splitter(word_splitter);
                    }

                    let mut inner = String::new();

                    let mut inner_renderer = self.clone();
                    inner_renderer.footer = None;
                    inner_renderer.with_cause_chain = false;
                    inner_renderer.termwidth -= rest_indent.width();
                    inner_renderer.render_report_inner(&mut inner, rel, src)?;

                    // If there was no header, remove the leading newline
                    let inner = inner.trim_matches('\n');
                    writeln!(f, "{}", self.wrap(inner, opts))?;
                }
            } else {
                for rel in related {
                    writeln!(f)?;
                    match rel.severity() {
                        Some(Severity::Error) | None => write!(f, "Error: ")?,
                        Some(Severity::Warning) => write!(f, "Warning: ")?,
                        Some(Severity::Advice) => write!(f, "Advice: ")?,
                    };
                    inner_renderer.render_header(f, rel, true)?;
                    let src = rel.source_code().or(parent_src);
                    inner_renderer.render_causes(f, rel, src)?;
                    inner_renderer.render_snippets(f, rel, src)?;
                    inner_renderer.render_footer(f, rel)?;
                    inner_renderer.render_related(f, rel, src)?;
                }
            }
        }
        Ok(())
    }

    fn render_snippets(
        &self,
        f: &mut impl fmt::Write,
        diagnostic: &(dyn Diagnostic),
        opt_source: Option<&dyn SourceCode>,
    ) -> fmt::Result {
        let source = match opt_source {
            Some(source) => source,
            None => return Ok(()),
        };
        let labels = match diagnostic.labels() {
            Some(labels) => labels,
            None => return Ok(()),
        };

        let mut labels = labels.collect::<Vec<_>>();
        labels.sort_unstable_by_key(|l| l.inner().offset());

        let mut contexts = Vec::with_capacity(labels.len());
        for right in labels.iter().cloned() {
            let right_conts =
                match source.read_span(right.inner(), self.context_lines, self.context_lines) {
                    Ok(cont) => cont,
                    Err(err) => {
                        writeln!(
                            f,
                            "  [{} `{}` (offset: {}, length: {}): {:?}]",
                            "Failed to read contents for label".style(self.theme.styles.error),
                            right
                                .label()
                                .unwrap_or("<none>")
                                .style(self.theme.styles.link),
                            right.offset().style(self.theme.styles.link),
                            right.len().style(self.theme.styles.link),
                            err.style(self.theme.styles.warning)
                        )?;
                        return Ok(());
                    }
                };

            if contexts.is_empty() {
                contexts.push((right, right_conts));
                continue;
            }

            let (left, left_conts) = contexts.last().unwrap();
            if left_conts.line() + left_conts.line_count() >= right_conts.line() {
                // The snippets will overlap, so we create one Big Chunky Boi
                let left_end = left.offset() + left.len();
                let right_end = right.offset() + right.len();
                let new_end = std::cmp::max(left_end, right_end);

                let new_span = LabeledSpan::new(
                    left.label().map(String::from),
                    left.offset(),
                    new_end - left.offset(),
                );
                // Check that the two contexts can be combined
                if let Ok(new_conts) =
                    source.read_span(new_span.inner(), self.context_lines, self.context_lines)
                {
                    contexts.pop();
                    // We'll throw the contents away later
                    contexts.push((new_span, new_conts));
                    continue;
                }
            }

            contexts.push((right, right_conts));
        }
        for (ctx, _) in contexts {
            self.render_context(f, source, &ctx, &labels[..])?;
        }

        Ok(())
    }

    fn render_context(
        &self,
        f: &mut impl fmt::Write,
        source: &dyn SourceCode,
        context: &LabeledSpan,
        labels: &[LabeledSpan],
    ) -> fmt::Result {
        let (contents, lines) = self.get_lines(source, context.inner())?;

        // only consider labels from the context as primary label
        let ctx_labels = labels.iter().filter(|l| {
            context.inner().offset() <= l.inner().offset()
                && l.inner().offset() + l.inner().len()
                    <= context.inner().offset() + context.inner().len()
        });
        let primary_label = ctx_labels
            .clone()
            .find(|label| label.primary())
            .or_else(|| ctx_labels.clone().next());

        // sorting is your friend
        let labels = labels
            .iter()
            .zip(self.theme.styles.highlights.iter().cloned().cycle())
            .map(|(label, st)| FancySpan::new(label.label().map(String::from), *label.inner(), st))
            .collect::<Vec<_>>();

        let mut highlighter_state = self.highlighter.start_highlighter_state(&*contents);

        // The max number of gutter-lines that will be active at any given
        // point. We need this to figure out indentation, so we do one loop
        // over the lines to see what the damage is gonna be.
        let mut max_gutter = 0usize;
        for line in &lines {
            let mut num_highlights = 0;
            for hl in &labels {
                if !line.span_line_only(hl) && line.span_applies_gutter(hl) {
                    num_highlights += 1;
                }
            }
            max_gutter = std::cmp::max(max_gutter, num_highlights);
        }

        // Oh and one more thing: We need to figure out how much room our line
        // numbers need!
        let linum_width = lines[..]
            .last()
            .map(|line| line.line_number)
            // It's possible for the source to be an empty string.
            .unwrap_or(0)
            .to_string()
            .len();

        // Header
        write!(
            f,
            "{}{}{}",
            " ".repeat(linum_width + 2),
            self.theme.characters.ltop,
            self.theme.characters.hbar,
        )?;

        // If there is a primary label, then use its span
        // as the reference point for line/column information.
        let primary_contents = match primary_label {
            Some(label) => source
                .read_span(label.inner(), 0, 0)
                .map_err(|_| fmt::Error)?,
            None => contents,
        };

        if let Some(source_name) = primary_contents.name() {
            writeln!(
                f,
                "[{}]",
                format_args!(
                    "{}:{}:{}",
                    source_name,
                    primary_contents.line() + 1,
                    primary_contents.column() + 1
                )
                .style(self.theme.styles.link)
            )?;
        } else if lines.len() <= 1 {
            writeln!(f, "{}", self.theme.characters.hbar.to_string().repeat(3))?;
        } else {
            writeln!(
                f,
                "[{}:{}]",
                primary_contents.line() + 1,
                primary_contents.column() + 1
            )?;
        }

        // Now it's time for the fun part--actually rendering everything!
        for line in &lines {
            // Line number, appropriately padded.
            self.write_linum(f, linum_width, line.line_number)?;

            // Then, we need to print the gutter, along with any fly-bys We
            // have separate gutters depending on whether we're on the actual
            // line, or on one of the "highlight lines" below it.
            self.render_line_gutter(f, max_gutter, line, &labels)?;

            // And _now_ we can print out the line text itself!
            let styled_text =
                StyledList::from(highlighter_state.highlight_line(&line.text)).to_string();
            self.render_line_text(f, &styled_text)?;

            // Next, we write all the highlights that apply to this particular line.
            let (single_line, multi_line): (Vec<_>, Vec<_>) = labels
                .iter()
                .filter(|hl| line.span_applies(hl))
                .partition(|hl| line.span_line_only(hl));
            if !single_line.is_empty() {
                // no line number!
                self.write_no_linum(f, linum_width)?;
                // gutter _again_
                self.render_highlight_gutter(
                    f,
                    max_gutter,
                    line,
                    &labels,
                    LabelRenderMode::SingleLine,
                )?;
                self.render_single_line_highlights(
                    f,
                    line,
                    linum_width,
                    max_gutter,
                    &single_line,
                    &labels,
                )?;
            }
            for hl in multi_line {
                if hl.label().is_some() && line.span_ends(hl) && !line.span_starts(hl) {
                    self.render_multi_line_end(f, &labels, max_gutter, linum_width, line, hl)?;
                }
            }
        }
        writeln!(
            f,
            "{}{}{}",
            " ".repeat(linum_width + 2),
            self.theme.characters.lbot,
            self.theme.characters.hbar.to_string().repeat(4),
        )?;
        Ok(())
    }

    fn render_multi_line_end(
        &self,
        f: &mut impl fmt::Write,
        labels: &[FancySpan],
        max_gutter: usize,
        linum_width: usize,
        line: &Line,
        label: &FancySpan,
    ) -> fmt::Result {
        // no line number!
        self.write_no_linum(f, linum_width)?;

        if let Some(label_parts) = label.label_parts() {
            // if it has a label, how long is it?
            let (first, rest) = label_parts.split_first().expect(
                "cannot crash because rest would have been None, see docs on the `label` field of \
                 FancySpan",
            );

            if rest.is_empty() {
                // gutter _again_
                self.render_highlight_gutter(
                    f,
                    max_gutter,
                    line,
                    labels,
                    LabelRenderMode::SingleLine,
                )?;

                self.render_multi_line_end_single(
                    f,
                    first,
                    label.style,
                    LabelRenderMode::SingleLine,
                )?;
            } else {
                // gutter _again_
                self.render_highlight_gutter(
                    f,
                    max_gutter,
                    line,
                    labels,
                    LabelRenderMode::MultiLineFirst,
                )?;

                self.render_multi_line_end_single(
                    f,
                    first,
                    label.style,
                    LabelRenderMode::MultiLineFirst,
                )?;
                for label_line in rest {
                    // no line number!
                    self.write_no_linum(f, linum_width)?;
                    // gutter _again_
                    self.render_highlight_gutter(
                        f,
                        max_gutter,
                        line,
                        labels,
                        LabelRenderMode::MultiLineRest,
                    )?;
                    self.render_multi_line_end_single(
                        f,
                        label_line,
                        label.style,
                        LabelRenderMode::MultiLineRest,
                    )?;
                }
            }
        } else {
            // gutter _again_
            self.render_highlight_gutter(f, max_gutter, line, labels, LabelRenderMode::SingleLine)?;
            // has no label
            writeln!(f, "{}", self.theme.characters.hbar.style(label.style))?;
        }

        Ok(())
    }

    fn render_line_gutter(
        &self,
        f: &mut impl fmt::Write,
        max_gutter: usize,
        line: &Line,
        highlights: &[FancySpan],
    ) -> fmt::Result {
        if max_gutter == 0 {
            return Ok(());
        }
        let chars = &self.theme.characters;
        let mut gutter = String::new();
        let applicable = highlights.iter().filter(|hl| line.span_applies_gutter(hl));
        let mut arrow = false;
        for (i, hl) in applicable.enumerate() {
            if line.span_starts(hl) {
                gutter.push_str(&chars.ltop.style(hl.style).to_string());
                gutter.push_str(
                    &chars
                        .hbar
                        .to_string()
                        .repeat(max_gutter.saturating_sub(i))
                        .style(hl.style)
                        .to_string(),
                );
                gutter.push_str(&chars.rarrow.style(hl.style).to_string());
                arrow = true;
                break;
            } else if line.span_ends(hl) {
                if hl.label().is_some() {
                    gutter.push_str(&chars.lcross.style(hl.style).to_string());
                } else {
                    gutter.push_str(&chars.lbot.style(hl.style).to_string());
                }
                gutter.push_str(
                    &chars
                        .hbar
                        .to_string()
                        .repeat(max_gutter.saturating_sub(i))
                        .style(hl.style)
                        .to_string(),
                );
                gutter.push_str(&chars.rarrow.style(hl.style).to_string());
                arrow = true;
                break;
            } else if line.span_flyby(hl) {
                gutter.push_str(&chars.vbar.style(hl.style).to_string());
            } else {
                gutter.push(' ');
            }
        }
        write!(
            f,
            "{}{}",
            gutter,
            " ".repeat(
                if arrow { 1 } else { 3 } + max_gutter.saturating_sub(gutter.chars().count())
            )
        )?;
        Ok(())
    }

    fn render_highlight_gutter(
        &self,
        f: &mut impl fmt::Write,
        max_gutter: usize,
        line: &Line,
        highlights: &[FancySpan],
        render_mode: LabelRenderMode,
    ) -> fmt::Result {
        if max_gutter == 0 {
            return Ok(());
        }

        // keeps track of how many columns wide the gutter is
        // important for ansi since simply measuring the size of the final string
        // gives the wrong result when the string contains ansi codes.
        let mut gutter_cols = 0;

        let chars = &self.theme.characters;
        let mut gutter = String::new();
        let applicable = highlights.iter().filter(|hl| line.span_applies_gutter(hl));
        for (i, hl) in applicable.enumerate() {
            if !line.span_line_only(hl) && line.span_ends(hl) {
                if render_mode == LabelRenderMode::MultiLineRest {
                    // this is to make multiline labels work. We want to make the right amount
                    // of horizontal space for them, but not actually draw the lines
                    let horizontal_space = max_gutter.saturating_sub(i) + 2;
                    for _ in 0..horizontal_space {
                        gutter.push(' ');
                    }
                    // account for one more horizontal space, since in multiline mode
                    // we also add in the vertical line before the label like this:
                    // 2 │ ╭─▶   text
                    // 3 │ ├─▶     here
                    //   · ╰──┤ these two lines
                    //   ·    │ are the problem
                    //        ^this
                    gutter_cols += horizontal_space + 1;
                } else {
                    let num_repeat = max_gutter.saturating_sub(i) + 2;

                    gutter.push_str(&chars.lbot.style(hl.style).to_string());

                    gutter.push_str(
                        &chars
                            .hbar
                            .to_string()
                            .repeat(
                                num_repeat
                                    // if we are rendering a multiline label, then leave a bit of space for the
                                    // rcross character
                                    - if render_mode == LabelRenderMode::MultiLineFirst {
                                        1
                                    } else {
                                        0
                                    },
                            )
                            .style(hl.style)
                            .to_string(),
                    );

                    // we count 1 for the lbot char, and then a few more, the same number
                    // as we just repeated for. For each repeat we only add 1, even though
                    // due to ansi escape codes the number of bytes in the string could grow
                    // a lot each time.
                    gutter_cols += num_repeat + 1;
                }
                break;
            } else {
                gutter.push_str(&chars.vbar.style(hl.style).to_string());

                // we may push many bytes for the ansi escape codes style adds,
                // but we still only add a single character-width to the string in a terminal
                gutter_cols += 1;
            }
        }

        // now calculate how many spaces to add based on how many columns we just
        // created. it's the max width of the gutter, minus how many
        // character-widths we just generated capped at 0 (though this should
        // never go below in reality), and then we add 3 to account for
        // arrowheads when a gutter line ends
        let num_spaces = (max_gutter + 3).saturating_sub(gutter_cols);
        // we then write the gutter and as many spaces as we need
        write!(f, "{}{:width$}", gutter, "", width = num_spaces)?;
        Ok(())
    }

    fn wrap(&self, text: &str, opts: textwrap::Options<'_>) -> String {
        if self.wrap_lines {
            textwrap::fill(text, opts)
        } else {
            // Format without wrapping, but retain the indentation options
            // Implementation based on `textwrap::indent`
            let mut result = String::with_capacity(2 * text.len());
            let trimmed_indent = opts.subsequent_indent.trim_end();
            for (idx, line) in text.split_terminator('\n').enumerate() {
                if idx > 0 {
                    result.push('\n');
                }
                if idx == 0 {
                    if line.trim().is_empty() {
                        result.push_str(opts.initial_indent.trim_end());
                    } else {
                        result.push_str(opts.initial_indent);
                    }
                } else if line.trim().is_empty() {
                    result.push_str(trimmed_indent);
                } else {
                    result.push_str(opts.subsequent_indent);
                }
                result.push_str(line);
            }
            if text.ends_with('\n') {
                // split_terminator will have eaten the final '\n'.
                result.push('\n');
            }
            result
        }
    }

    fn write_linum(&self, f: &mut impl fmt::Write, width: usize, linum: usize) -> fmt::Result {
        write!(
            f,
            " {:width$} {} ",
            linum.style(self.theme.styles.linum),
            self.theme.characters.vbar,
            width = width
        )?;
        Ok(())
    }

    fn write_no_linum(&self, f: &mut impl fmt::Write, width: usize) -> fmt::Result {
        write!(
            f,
            " {:width$} {} ",
            "",
            self.theme.characters.vbar_break,
            width = width
        )?;
        Ok(())
    }

    /// Returns an iterator over the visual width of each character in a line.
    fn line_visual_char_width<'a>(&self, text: &'a str) -> impl Iterator<Item = usize> + 'a {
        let mut column = 0;
        let mut escaped = false;
        let tab_width = self.tab_width;
        text.chars().map(move |c| {
            let width = match (escaped, c) {
                // Round up to the next multiple of tab_width
                (false, '\t') => tab_width - column % tab_width,
                // start of ANSI escape
                (false, '\x1b') => {
                    escaped = true;
                    0
                }
                // use Unicode width for all other characters
                (false, c) => c.width().unwrap_or(0),
                // end of ANSI escape
                (true, 'm') => {
                    escaped = false;
                    0
                }
                // characters are zero width within escape sequence
                (true, _) => 0,
            };
            column += width;
            width
        })
    }

    /// Returns the visual column position of a byte offset on a specific line.
    ///
    /// If the offset occurs in the middle of a character, the returned column
    /// corresponds to that character's first column in `start` is true, or its
    /// last column if `start` is false.
    fn visual_offset(&self, line: &Line, offset: usize, start: bool) -> usize {
        let line_range = line.offset..=(line.offset + line.length);
        assert!(line_range.contains(&offset));

        let mut text_index = offset - line.offset;
        while text_index <= line.text.len() && !line.text.is_char_boundary(text_index) {
            if start {
                text_index -= 1;
            } else {
                text_index += 1;
            }
        }
        let text = &line.text[..text_index.min(line.text.len())];
        let text_width = self.line_visual_char_width(text).sum();
        if text_index > line.text.len() {
            // Spans extending past the end of the line are always rendered as
            // one column past the end of the visible line.
            //
            // This doesn't necessarily correspond to a specific byte-offset,
            // since a span extending past the end of the line could contain:
            //  - an actual \n character (1 byte)
            //  - a CRLF (2 bytes)
            //  - EOF (0 bytes)
            text_width + 1
        } else {
            text_width
        }
    }

    /// Renders a line to the output formatter, replacing tabs with spaces.
    fn render_line_text(&self, f: &mut impl fmt::Write, text: &str) -> fmt::Result {
        for (c, width) in text.chars().zip(self.line_visual_char_width(text)) {
            if c == '\t' {
                for _ in 0..width {
                    f.write_char(' ')?;
                }
            } else {
                f.write_char(c)?;
            }
        }
        f.write_char('\n')?;
        Ok(())
    }

    fn render_single_line_highlights(
        &self,
        f: &mut impl fmt::Write,
        line: &Line,
        linum_width: usize,
        max_gutter: usize,
        single_liners: &[&FancySpan],
        all_highlights: &[FancySpan],
    ) -> fmt::Result {
        let mut underlines = String::new();
        let mut highest = 0;

        let chars = &self.theme.characters;
        let vbar_offsets: Vec<_> = single_liners
            .iter()
            .map(|hl| {
                let byte_start = hl.offset();
                let byte_end = hl.offset() + hl.len();
                let start = self.visual_offset(line, byte_start, true).max(highest);
                let end = if hl.len() == 0 {
                    start + 1
                } else {
                    self.visual_offset(line, byte_end, false).max(start + 1)
                };

                let vbar_offset = (start + end) / 2;
                let num_left = vbar_offset - start;
                let num_right = end - vbar_offset - 1;
                underlines.push_str(
                    &format!(
                        "{:width$}{}{}{}",
                        "",
                        chars.underline.to_string().repeat(num_left),
                        if hl.len() == 0 {
                            chars.uarrow
                        } else if hl.label().is_some() {
                            chars.underbar
                        } else {
                            chars.underline
                        },
                        chars.underline.to_string().repeat(num_right),
                        width = start.saturating_sub(highest),
                    )
                    .style(hl.style)
                    .to_string(),
                );
                highest = std::cmp::max(highest, end);

                (hl, vbar_offset)
            })
            .collect();
        writeln!(f, "{}", underlines)?;

        for hl in single_liners.iter().rev() {
            if let Some(label) = hl.label_parts() {
                if label.len() == 1 {
                    self.write_label_text(
                        f,
                        line,
                        linum_width,
                        max_gutter,
                        all_highlights,
                        chars,
                        &vbar_offsets,
                        hl,
                        &label[0],
                        LabelRenderMode::SingleLine,
                    )?;
                } else {
                    let mut first = true;
                    for label_line in &label {
                        self.write_label_text(
                            f,
                            line,
                            linum_width,
                            max_gutter,
                            all_highlights,
                            chars,
                            &vbar_offsets,
                            hl,
                            label_line,
                            if first {
                                LabelRenderMode::MultiLineFirst
                            } else {
                                LabelRenderMode::MultiLineRest
                            },
                        )?;
                        first = false;
                    }
                }
            }
        }
        Ok(())
    }

    // I know it's not good practice, but making this a function makes a lot of
    // sense and making a struct for this does not...
    #[allow(clippy::too_many_arguments)]
    fn write_label_text(
        &self,
        f: &mut impl fmt::Write,
        line: &Line,
        linum_width: usize,
        max_gutter: usize,
        all_highlights: &[FancySpan],
        chars: &ThemeCharacters,
        vbar_offsets: &[(&&FancySpan, usize)],
        hl: &&FancySpan,
        label: &str,
        render_mode: LabelRenderMode,
    ) -> fmt::Result {
        self.write_no_linum(f, linum_width)?;
        self.render_highlight_gutter(
            f,
            max_gutter,
            line,
            all_highlights,
            LabelRenderMode::SingleLine,
        )?;
        let mut curr_offset = 1usize;
        for (offset_hl, vbar_offset) in vbar_offsets {
            while curr_offset < *vbar_offset + 1 {
                write!(f, " ")?;
                curr_offset += 1;
            }
            if *offset_hl != hl {
                write!(f, "{}", chars.vbar.to_string().style(offset_hl.style))?;
                curr_offset += 1;
            } else {
                let lines = match render_mode {
                    LabelRenderMode::SingleLine => format!(
                        "{}{} {}",
                        chars.lbot,
                        chars.hbar.to_string().repeat(2),
                        label,
                    ),
                    LabelRenderMode::MultiLineFirst => {
                        format!("{}{}{} {}", chars.lbot, chars.hbar, chars.rcross, label,)
                    }
                    LabelRenderMode::MultiLineRest => {
                        format!("  {} {}", chars.vbar, label,)
                    }
                };
                writeln!(f, "{}", lines.style(hl.style))?;
                break;
            }
        }
        Ok(())
    }

    fn render_multi_line_end_single(
        &self,
        f: &mut impl fmt::Write,
        label: &str,
        style: Style,
        render_mode: LabelRenderMode,
    ) -> fmt::Result {
        match render_mode {
            LabelRenderMode::SingleLine => {
                writeln!(f, "{} {}", self.theme.characters.hbar.style(style), label)?;
            }
            LabelRenderMode::MultiLineFirst => {
                writeln!(f, "{} {}", self.theme.characters.rcross.style(style), label)?;
            }
            LabelRenderMode::MultiLineRest => {
                writeln!(f, "{} {}", self.theme.characters.vbar.style(style), label)?;
            }
        }

        Ok(())
    }

    fn get_lines<'a>(
        &'a self,
        source: &'a dyn SourceCode,
        context_span: &'a SourceSpan,
    ) -> Result<(Box<dyn SpanContents<'a> + 'a>, Vec<Line>), fmt::Error> {
        let context_data = source
            .read_span(context_span, self.context_lines, self.context_lines)
            .map_err(|_| fmt::Error)?;
        let context = String::from_utf8_lossy(context_data.data());
        let mut line = context_data.line();
        let mut column = context_data.column();
        let mut offset = context_data.span().offset();
        let mut line_offset = offset;
        let mut line_str = String::with_capacity(context.len());
        let mut lines = Vec::with_capacity(1);
        let mut iter = context.chars().peekable();
        while let Some(char) = iter.next() {
            offset += char.len_utf8();
            let mut at_end_of_file = false;
            match char {
                '\r' => {
                    if iter.next_if_eq(&'\n').is_some() {
                        offset += 1;
                        line += 1;
                        column = 0;
                    } else {
                        line_str.push(char);
                        column += 1;
                    }
                    at_end_of_file = iter.peek().is_none();
                }
                '\n' => {
                    at_end_of_file = iter.peek().is_none();
                    line += 1;
                    column = 0;
                }
                _ => {
                    line_str.push(char);
                    column += 1;
                }
            }

            if iter.peek().is_none() && !at_end_of_file {
                line += 1;
            }

            if column == 0 || iter.peek().is_none() {
                lines.push(Line {
                    line_number: line,
                    offset: line_offset,
                    length: offset - line_offset,
                    text: line_str.clone(),
                });
                line_str.clear();
                line_offset = offset;
            }
        }
        Ok((context_data, lines))
    }
}

impl ReportHandler for GraphicalReportHandler {
    fn debug(&self, diagnostic: &(dyn Diagnostic), f: &mut fmt::Formatter<'_>) -> fmt::Result {
        if f.alternate() {
            return fmt::Debug::fmt(diagnostic, f);
        }

        self.render_report(f, diagnostic)
    }
}

/*
Support types
*/

#[derive(PartialEq, Debug)]
enum LabelRenderMode {
    /// we're rendering a single line label (or not rendering in any special
    /// way)
    SingleLine,
    /// we're rendering a multiline label
    MultiLineFirst,
    /// we're rendering the rest of a multiline label
    MultiLineRest,
}

#[derive(Debug)]
struct Line {
    line_number: usize,
    offset: usize,
    length: usize,
    text: String,
}

impl Line {
    fn span_line_only(&self, span: &FancySpan) -> bool {
        span.offset() >= self.offset && span.offset() + span.len() <= self.offset + self.length
    }

    /// Returns whether `span` should be visible on this line, either in the
    /// gutter or under the text on this line
    fn span_applies(&self, span: &FancySpan) -> bool {
        let spanlen = if span.len() == 0 { 1 } else { span.len() };
        // Span starts in this line

        (span.offset() >= self.offset && span.offset() < self.offset + self.length)
            // Span passes through this line
            || (span.offset() < self.offset && span.offset() + spanlen > self.offset + self.length) //todo
            // Span ends on this line
            || (span.offset() + spanlen > self.offset && span.offset() + spanlen <= self.offset + self.length)
    }

    /// Returns whether `span` should be visible on this line in the gutter (so
    /// this excludes spans that are only visible on this line and do not
    /// span multiple lines)
    fn span_applies_gutter(&self, span: &FancySpan) -> bool {
        let spanlen = if span.len() == 0 { 1 } else { span.len() };
        // Span starts in this line
        self.span_applies(span)
            && !(
                // as long as it doesn't start *and* end on this line
                (span.offset() >= self.offset && span.offset() < self.offset + self.length)
                    && (span.offset() + spanlen > self.offset
                        && span.offset() + spanlen <= self.offset + self.length)
            )
    }

    // A 'flyby' is a multi-line span that technically covers this line, but
    // does not begin or end within the line itself. This method is used to
    // calculate gutters.
    fn span_flyby(&self, span: &FancySpan) -> bool {
        // The span itself starts before this line's starting offset (so, in a
        // prev line).
        span.offset() < self.offset
            // ...and it stops after this line's end.
            && span.offset() + span.len() > self.offset + self.length
    }

    // Does this line contain the *beginning* of this multiline span?
    // This assumes self.span_applies() is true already.
    fn span_starts(&self, span: &FancySpan) -> bool {
        span.offset() >= self.offset
    }

    // Does this line contain the *end* of this multiline span?
    // This assumes self.span_applies() is true already.
    fn span_ends(&self, span: &FancySpan) -> bool {
        span.offset() + span.len() >= self.offset
            && span.offset() + span.len() <= self.offset + self.length
    }
}

#[derive(Debug, Clone)]
struct FancySpan {
    /// this is deliberately an option of a vec because I wanted to be very
    /// explicit that there can also be *no* label. If there is a label, it
    /// can have multiple lines which is what the vec is for.
    label: Option<Vec<String>>,
    span: SourceSpan,
    style: Style,
}

impl PartialEq for FancySpan {
    fn eq(&self, other: &Self) -> bool {
        self.label == other.label && self.span == other.span
    }
}

fn split_label(v: String) -> Vec<String> {
    v.split('\n').map(|i| i.to_string()).collect()
}

impl FancySpan {
    fn new(label: Option<String>, span: SourceSpan, style: Style) -> Self {
        FancySpan {
            label: label.map(split_label),
            span,
            style,
        }
    }

    fn style(&self) -> Style {
        self.style
    }

    fn label(&self) -> Option<String> {
        self.label
            .as_ref()
            .map(|l| l.join("\n").style(self.style()).to_string())
    }

    fn label_parts(&self) -> Option<Vec<String>> {
        self.label.as_ref().map(|l| {
            l.iter()
                .map(|i| i.style(self.style()).to_string())
                .collect()
        })
    }

    fn offset(&self) -> usize {
        self.span.offset()
    }

    fn len(&self) -> usize {
        self.span.len()
    }
}
