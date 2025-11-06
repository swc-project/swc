use std::fmt::{self};

use miette::{
    Diagnostic, GraphicalTheme, LabeledSpan, ReportHandler, SourceCode, SourceSpan, ThemeCharacters,
};
use owo_colors::{OwoColorize, Style};
use unicode_width::UnicodeWidthChar;

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
pub struct SwcReportHandler {
    pub(crate) theme: GraphicalTheme,
    pub(crate) context_lines: usize,
    pub(crate) tab_width: usize,
}

impl SwcReportHandler {
    /// Create a new `GraphicalReportHandler` with the default
    /// [`GraphicalTheme`]. This will use both unicode characters and colors.
    pub fn new() -> Self {
        Self {
            theme: GraphicalTheme::default(),
            context_lines: 1,
            tab_width: 4,
        }
    }

    /// Set a theme for this handler.
    pub fn with_theme(mut self, theme: GraphicalTheme) -> Self {
        self.theme = theme;
        self
    }
}

impl Default for SwcReportHandler {
    fn default() -> Self {
        Self::new()
    }
}

impl SwcReportHandler {
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
        self.render_snippets(f, diagnostic, src)?;

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
        let lines = self.get_lines(source, context.inner())?;

        // sorting is your friend
        let labels = labels
            .iter()
            .zip(self.theme.styles.highlights.iter().cloned().cycle())
            .map(|(label, st)| FancySpan::new(label.label().map(String::from), *label.inner(), st))
            .collect::<Vec<_>>();

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

        // Now it's time for the fun part--actually rendering everything!
        for line in &lines {
            // Then, we need to print the gutter, along with any fly-bys We
            // have separate gutters depending on whether we're on the actual
            // line, or on one of the "highlight lines" below it.
            self.render_line_gutter(f, max_gutter, line, &labels)?;

            // And _now_ we can print out the line text itself!
            self.render_line_text(f, &line.text)?;

            // Next, we write all the highlights that apply to this particular line.
            let (single_line, multi_line): (Vec<_>, Vec<_>) = labels
                .iter()
                .filter(|hl| line.span_applies(hl))
                .partition(|hl| line.span_line_only(hl));
            if !single_line.is_empty() {
                // gutter _again_
                self.render_highlight_gutter(
                    f,
                    max_gutter,
                    line,
                    &labels,
                    LabelRenderMode::SingleLine,
                )?;
                self.render_single_line_highlights(f, line, max_gutter, &single_line, &labels)?;
            }
            for hl in multi_line {
                if hl.label().is_some() && line.span_ends(hl) && !line.span_starts(hl) {
                    self.render_multi_line_end(f, &labels, max_gutter, line, hl)?;
                }
            }
        }

        Ok(())
    }

    fn render_multi_line_end(
        &self,
        f: &mut impl fmt::Write,
        labels: &[FancySpan],
        max_gutter: usize,
        line: &Line,
        label: &FancySpan,
    ) -> fmt::Result {
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
        writeln!(f, "{underlines}")?;

        for hl in single_liners.iter().rev() {
            if let Some(label) = hl.label_parts() {
                if label.len() == 1 {
                    self.write_label_text(
                        f,
                        line,
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
        max_gutter: usize,
        all_highlights: &[FancySpan],
        chars: &ThemeCharacters,
        vbar_offsets: &[(&&FancySpan, usize)],
        hl: &&FancySpan,
        label: &str,
        render_mode: LabelRenderMode,
    ) -> fmt::Result {
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
    ) -> Result<Vec<Line>, fmt::Error> {
        let context_data = source
            .read_span(context_span, self.context_lines, self.context_lines)
            .map_err(|_| fmt::Error)?;
        let context = String::from_utf8_lossy(context_data.data());
        let mut column = context_data.column();
        let mut offset = context_data.span().offset();
        let mut line_offset = offset;
        let mut line_str = String::with_capacity(context.len());
        let mut lines = Vec::with_capacity(1);
        let mut iter = context.chars().peekable();
        while let Some(ch) = iter.next() {
            offset += ch.len_utf8();
            match ch {
                '\r' => {
                    if iter.next_if_eq(&'\n').is_some() {
                        offset += 1;
                        column = 0;
                    } else {
                        line_str.push(ch);
                        column += 1;
                    }
                }
                '\n' => {
                    column = 0;
                }
                _ => {
                    line_str.push(ch);
                    column += 1;
                }
            }

            if column == 0 || iter.peek().is_none() {
                lines.push(Line {
                    offset: line_offset,
                    length: offset - line_offset,
                    text: line_str.clone(),
                });
                line_str.clear();
                line_offset = offset;
            }
        }
        Ok(lines)
    }
}

impl ReportHandler for SwcReportHandler {
    fn debug(&self, diagnostic: &dyn Diagnostic, f: &mut fmt::Formatter<'_>) -> fmt::Result {
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
