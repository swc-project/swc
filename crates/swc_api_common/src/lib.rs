//! Version-neutral implementation shared by the JavaScript API bindings.
//!
//! Public npm API versions must not require copies of the compiler pipeline.
//! This crate owns state restoration and the direct wire codecs used at the
//! native boundary. Version-specific configuration and AST changes belong in
//! the corresponding codec implementation.

use anyhow::{bail, Context, Error};
use serde::{Deserialize, Serialize};
use swc_common::{sync::Lrc, BytePos, FileName, SourceFile, SourceMap, Span, DUMMY_SP};
use swc_ecma_ast::Program;
use swc_ecma_visit::{VisitMut, VisitMutWith};
use swc_nodejs_common::deserialize_json;

/// Wire format selected by a JavaScript API binding.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum WireVersion {
    /// The stable `@swc/core@1` wire format.
    V1,
    /// The independently evolving `@swc/core@2` wire format.
    V2,
}

/// Source information needed to preserve meaningful spans across the JavaScript
/// boundary.
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
struct ProgramEnvelope {
    program: Program,
    source_context: Option<ProgramSourceContext>,
}

/// Program received from a JavaScript caller.
#[derive(Debug)]
pub enum ProgramInput {
    /// A legacy raw AST without source context.
    Raw(Program),
    /// An AST accompanied by the source information used to create its spans.
    WithContext {
        /// The deserialized compiler AST.
        program: Program,
        /// Original source information for restoring spans.
        source_context: ProgramSourceContext,
    },
}

/// Serializes an internal AST directly into the selected public wire format.
pub fn serialize_program(
    version: WireVersion,
    program: Program,
    fm: &SourceFile,
) -> Result<String, serde_json::Error> {
    match version {
        WireVersion::V1 => v1::serialize(program, fm),
        WireVersion::V2 => v2::serialize(program, fm),
    }
}

/// Deserializes the selected public wire format directly into the internal AST.
pub fn deserialize_program_input(
    version: WireVersion,
    json: &str,
) -> Result<ProgramInput, serde_json::Error> {
    match version {
        WireVersion::V1 => v1::deserialize(json),
        WireVersion::V2 => v2::deserialize(json),
    }
}

/// Restores source-map state before an AST is passed back to the shared
/// compiler engine.
pub fn prepare_program_with_context(
    cm: &Lrc<SourceMap>,
    mut program: Program,
    source_context: ProgramSourceContext,
) -> Result<(Lrc<SourceFile>, Program), Error> {
    let fm = cm.new_source_file(
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

fn source_context_from_file(fm: &SourceFile) -> ProgramSourceContext {
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

fn serialize_envelope(program: Program, fm: &SourceFile) -> Result<String, serde_json::Error> {
    serde_json::to_string(&ProgramEnvelope {
        program,
        source_context: Some(source_context_from_file(fm)),
    })
}

fn deserialize_envelope(json: &str) -> Result<ProgramInput, serde_json::Error> {
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

mod v1 {
    use super::*;

    pub(super) fn serialize(
        program: Program,
        fm: &SourceFile,
    ) -> Result<String, serde_json::Error> {
        serialize_envelope(program, fm)
    }

    pub(super) fn deserialize(json: &str) -> Result<ProgramInput, serde_json::Error> {
        deserialize_envelope(json)
    }
}

mod v2 {
    use super::*;

    // Keep this codec separate even while the initial v2 schema matches v1.
    // Upcoming AST cleanup must be implemented here so v1 never has to
    // deserialize or round-trip through a v2 DTO.
    pub(super) fn serialize(
        program: Program,
        fm: &SourceFile,
    ) -> Result<String, serde_json::Error> {
        serialize_envelope(program, fm)
    }

    pub(super) fn deserialize(json: &str) -> Result<ProgramInput, serde_json::Error> {
        deserialize_envelope(json)
    }
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
