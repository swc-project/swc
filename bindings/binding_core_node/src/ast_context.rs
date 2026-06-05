use anyhow::{bail, Context, Error};
use serde::{Deserialize, Serialize};
use swc_core::{
    base::Compiler,
    common::{BytePos, FileName, SourceFile, Span, DUMMY_SP},
    ecma::{
        ast::Program,
        visit::{VisitMut, VisitMutWith},
    },
    node::deserialize_json,
};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProgramSourceContext {
    real_filename: Option<String>,
    source: String,
    start_pos: u32,
    end_pos: u32,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProgramEnvelope {
    program: Program,
    source_context: Option<ProgramSourceContext>,
}

#[derive(Debug)]
pub enum ProgramInput {
    Raw(Program),
    WithContext {
        program: Program,
        source_context: ProgramSourceContext,
    },
}

pub fn source_context_from_file(fm: &SourceFile) -> ProgramSourceContext {
    ProgramSourceContext {
        real_filename: match &*fm.name {
            FileName::Real(path) => Some(path.display().to_string()),
            _ => None,
        },
        source: fm.src.as_str().to_owned(),
        start_pos: fm.start_pos.0,
        end_pos: fm.end_pos.0,
    }
}

pub fn serialize_program(program: Program, fm: &SourceFile) -> Result<String, serde_json::Error> {
    serde_json::to_string(&ProgramEnvelope {
        program,
        source_context: Some(source_context_from_file(fm)),
    })
}

pub fn deserialize_program_input(json: &str) -> Result<ProgramInput, serde_json::Error> {
    if let Ok(envelope) = deserialize_json::<ProgramEnvelope>(json) {
        if let Some(source_context) = envelope.source_context {
            return Ok(ProgramInput::WithContext {
                program: envelope.program,
                source_context,
            });
        }

        return Ok(ProgramInput::Raw(envelope.program));
    }

    deserialize_json(json).map(ProgramInput::Raw)
}

pub fn prepare_program_with_context(
    c: &Compiler,
    mut program: Program,
    source_context: ProgramSourceContext,
) -> Result<(swc_core::common::sync::Lrc<SourceFile>, Program), Error> {
    let fm = c.cm.new_source_file(
        source_context.file_name().into(),
        source_context.source.clone(),
    );

    let expected_len = source_context
        .end_pos
        .checked_sub(source_context.start_pos)
        .context("invalid source context byte range")?;

    if fm.byte_length() != expected_len {
        bail!(
            "failed to restore source context because the source length changed while passing AST \
             between JavaScript and native code"
        );
    }

    rebase_program_spans(&mut program, &source_context, &fm)
        .context("failed to rebase AST spans to restored source context")?;

    Ok((fm, program))
}

fn rebase_program_spans(
    program: &mut Program,
    source_context: &ProgramSourceContext,
    fm: &SourceFile,
) -> Result<(), Error> {
    let old_start = source_context.start_pos;
    let old_end = source_context.end_pos;
    let new_start = fm.start_pos.0;
    let new_end = fm.end_pos.0;

    if old_start > old_end {
        bail!("invalid source context byte range: {old_start}..{old_end}");
    }

    program.visit_mut_with(&mut SpanRebaser {
        old_start,
        old_end,
        new_start,
        new_end,
    });

    Ok(())
}

impl ProgramSourceContext {
    fn file_name(&self) -> FileName {
        match &self.real_filename {
            Some(filename) => FileName::Real(filename.into()),
            None => FileName::Anon,
        }
    }
}

struct SpanRebaser {
    old_start: u32,
    old_end: u32,
    new_start: u32,
    new_end: u32,
}

impl SpanRebaser {
    fn rebase_pos(&self, pos: BytePos) -> Option<BytePos> {
        if pos.is_dummy() || pos.is_reserved_for_comments() || pos == BytePos::SYNTHESIZED {
            return Some(pos);
        }

        if pos.0 < self.old_start || pos.0 > self.old_end {
            return None;
        }

        let rebased = self.new_start.checked_add(pos.0 - self.old_start)?;
        if rebased > self.new_end {
            return None;
        }

        Some(BytePos(rebased))
    }

    fn rebase_span(&self, span: Span) -> Span {
        if span.is_dummy() {
            return span;
        }

        let Some(lo) = self.rebase_pos(span.lo) else {
            return DUMMY_SP;
        };
        let Some(hi) = self.rebase_pos(span.hi) else {
            return DUMMY_SP;
        };

        if lo.is_dummy() || hi.is_dummy() {
            return DUMMY_SP;
        }

        Span::new_with_checked(lo, hi)
    }
}

impl VisitMut for SpanRebaser {
    fn visit_mut_span(&mut self, span: &mut Span) {
        *span = self.rebase_span(*span);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn rebase_span_into_new_source_range() {
        let rebaser = SpanRebaser {
            old_start: 100,
            old_end: 140,
            new_start: 1,
            new_end: 41,
        };

        let span = rebaser.rebase_span(Span::new(BytePos(110), BytePos(125)));

        assert_eq!(span.lo, BytePos(11));
        assert_eq!(span.hi, BytePos(26));
    }

    #[test]
    fn drops_out_of_range_span() {
        let rebaser = SpanRebaser {
            old_start: 100,
            old_end: 140,
            new_start: 1,
            new_end: 41,
        };

        assert_eq!(
            rebaser.rebase_span(Span::new(BytePos(90), BytePos(125))),
            DUMMY_SP
        );
    }

    #[test]
    fn preserves_dummy_and_reserved_spans() {
        let rebaser = SpanRebaser {
            old_start: 100,
            old_end: 140,
            new_start: 1,
            new_end: 41,
        };

        assert_eq!(rebaser.rebase_span(DUMMY_SP), DUMMY_SP);
        assert_eq!(
            rebaser.rebase_span(Span::new(BytePos::PURE, BytePos::PURE)),
            Span::new(BytePos::PURE, BytePos::PURE)
        );
    }
}
