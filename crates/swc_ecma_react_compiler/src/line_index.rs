//! Mapping between SWC byte positions and Babel-style `loc` positions.
//!
//! The forward converter emits a Babel `loc` for every node, and the React
//! Compiler copies those locations onto the nodes it generates. Codegen
//! frequently drops `start`/`end` (and sometimes `loc.index`), keeping only
//! line/column, so the reverse converter needs the same line table to recover
//! an SWC span. Both directions live here so they stay exact inverses.

use react_compiler_ast::common::Position;

/// Line start table for one source file.
///
/// SWC `BytePos` values are 1-based byte offsets. Babel positions use 1-based
/// lines, 0-based columns, and 0-based indices.
///
/// Assumption: the React Compiler does not receive the original source text
/// from this bridge, so UTF-8 byte offsets are enough for `column` and
/// `index`. If that changes, switch these offsets to UTF-16 code units.
#[derive(Debug, Clone, Default)]
pub struct LineIndex {
    /// 0-based byte offset of the first byte of each line.
    line_starts: Vec<u32>,
    /// Source length in bytes.
    len: u32,
}

impl LineIndex {
    pub fn new(source_text: &str) -> Self {
        let mut line_starts = vec![0u32];
        line_starts.extend(
            source_text
                .bytes()
                .enumerate()
                .filter(|&(_, byte)| byte == b'\n')
                .map(|(i, _)| i as u32 + 1),
        );
        Self {
            line_starts,
            len: source_text.len() as u32,
        }
    }

    /// Converts a 1-based SWC byte position to a Babel position.
    pub fn position(&self, pos: u32) -> Position {
        let offset = pos.saturating_sub(1).min(self.len);
        let line_idx = match self.line_starts.binary_search(&offset) {
            Ok(idx) => idx,
            Err(idx) => idx.saturating_sub(1),
        };
        let line_start = self.line_starts[line_idx];
        Position {
            line: line_idx as u32 + 1,
            column: offset - line_start,
            index: Some(offset),
        }
    }

    /// Converts a Babel position back to a 1-based SWC byte position.
    ///
    /// Prefers `index` and falls back to `line`/`column`, which is all the
    /// React Compiler keeps for locations it propagates from HIR
    /// instructions. Returns `None` for positions outside this file.
    pub fn byte_pos(&self, position: &Position) -> Option<u32> {
        let offset = match position.index {
            Some(index) => index,
            None => {
                let line_start = *self
                    .line_starts
                    .get((position.line as usize).checked_sub(1)?)?;
                line_start.checked_add(position.column)?
            }
        };
        (offset <= self.len).then_some(offset + 1)
    }
}
