use std::io::Write;

use rustc_hash::FxBuildHasher;
use swc_allocator::api::global::HashSet;
use swc_common::{sync::Lrc, BytePos, LineCol, SourceMap, Span};

use super::{BindingStorage, Result, ScopeBindingRecord, ScopeRecord, WriteJs};

///
/// -----
///
/// Ported from `createTextWriter` of the typescript compiler.
///
/// https://github.com/Microsoft/TypeScript/blob/45eaf42006/src/compiler/utilities.ts#L2548
pub struct JsWriter<'a, W: Write> {
    indent: usize,
    indent_str: &'static str,
    line_start: bool,
    line_count: usize,
    line_pos: usize,
    new_line: &'a str,
    srcmap: Option<&'a mut Vec<(BytePos, LineCol)>>,
    srcmap_done: HashSet<(BytePos, u32, u32), FxBuildHasher>,
    /// Used to avoid including whitespaces created by indention.
    pending_srcmap: Option<BytePos>,
    wr: W,
    scopes: Option<&'a mut Vec<ScopeRecord>>,
    scope_stack: Vec<u32>,
}

impl<'a, W: Write> JsWriter<'a, W> {
    pub fn new(
        cm: Lrc<SourceMap>,
        new_line: &'a str,
        wr: W,
        srcmap: Option<&'a mut Vec<(BytePos, LineCol)>>,
    ) -> Self {
        Self::new_with_scopes(cm, new_line, wr, srcmap, None)
    }

    pub fn new_with_scopes(
        _: Lrc<SourceMap>,
        new_line: &'a str,
        wr: W,
        srcmap: Option<&'a mut Vec<(BytePos, LineCol)>>,
        scopes: Option<&'a mut Vec<ScopeRecord>>,
    ) -> Self {
        JsWriter {
            indent: Default::default(),
            indent_str: "    ",
            line_start: true,
            line_count: 0,
            line_pos: Default::default(),
            new_line,
            srcmap,
            wr,
            pending_srcmap: Default::default(),
            srcmap_done: Default::default(),
            scopes,
            scope_stack: Default::default(),
        }
    }

    pub fn preamble(&mut self, s: &str) -> Result {
        self.raw_write(s)?;
        self.update_pos(s);

        Ok(())
    }

    /// Sets the indentation string. Defaults to four spaces.
    pub fn set_indent_str(&mut self, indent_str: &'static str) {
        self.indent_str = indent_str;
    }

    #[inline]
    fn write_indent_string(&mut self) -> Result {
        for _ in 0..self.indent {
            self.raw_write(self.indent_str)?;
        }
        if self.srcmap.is_some() {
            self.line_pos += self.indent_str.len() * self.indent;
        }

        Ok(())
    }

    #[inline]
    fn raw_write(&mut self, data: &str) -> Result {
        self.wr.write_all(data.as_bytes())?;

        Ok(())
    }

    #[inline(always)]
    fn write(&mut self, span: Option<Span>, data: &str) -> Result {
        if !data.is_empty() {
            if self.line_start {
                self.write_indent_string()?;
                self.line_start = false;

                if let Some(pending) = self.pending_srcmap.take() {
                    self.srcmap(pending);
                }
            }

            if let Some(span) = span {
                self.srcmap(span.lo());
            }

            self.raw_write(data)?;
            self.update_pos(data);

            if let Some(span) = span {
                self.srcmap(span.hi());
            }
        }

        Ok(())
    }

    #[inline]
    fn update_pos(&mut self, s: &str) {
        if self.srcmap.is_some() {
            let line_start_of_s = compute_line_starts(s);
            self.line_count += line_start_of_s.line_count;

            let chars = s[line_start_of_s.byte_pos..].encode_utf16().count();
            if line_start_of_s.line_count > 0 {
                self.line_pos = chars;
            } else {
                self.line_pos += chars;
            }
        }
    }

    #[inline]
    fn srcmap(&mut self, byte_pos: BytePos) {
        if byte_pos.is_dummy() && byte_pos != BytePos(u32::MAX) {
            return;
        }

        if let Some(ref mut srcmap) = self.srcmap {
            if self
                .srcmap_done
                .insert((byte_pos, self.line_count as _, self.line_pos as _))
            {
                let loc = LineCol {
                    line: self.line_count as _,
                    col: self.line_pos as _,
                };

                srcmap.push((byte_pos, loc));
            }
        }
    }

    #[inline]
    fn generated_pos(&self) -> LineCol {
        LineCol {
            line: self.line_count as u32,
            col: self.line_pos as u32,
        }
    }
}

impl<W: Write> WriteJs for JsWriter<'_, W> {
    #[inline]
    fn increase_indent(&mut self) -> Result {
        self.indent += 1;
        Ok(())
    }

    #[inline]
    fn decrease_indent(&mut self) -> Result {
        self.indent -= 1;
        Ok(())
    }

    #[inline]
    fn write_semi(&mut self, span: Option<Span>) -> Result {
        self.write(span, ";")?;
        Ok(())
    }

    #[inline]
    fn write_space(&mut self) -> Result {
        self.write(None, " ")?;
        Ok(())
    }

    #[inline]
    fn write_keyword(&mut self, span: Option<Span>, s: &'static str) -> Result {
        self.write(span, s)?;
        Ok(())
    }

    #[inline]
    fn write_operator(&mut self, span: Option<Span>, s: &str) -> Result {
        self.write(span, s)?;
        Ok(())
    }

    #[inline]
    fn write_param(&mut self, s: &str) -> Result {
        self.write(None, s)?;
        Ok(())
    }

    #[inline]
    fn write_property(&mut self, s: &str) -> Result {
        self.write(None, s)?;
        Ok(())
    }

    #[inline]
    fn write_line(&mut self) -> Result {
        let pending = self.pending_srcmap.take();
        if !self.line_start {
            self.raw_write(self.new_line)?;
            if self.srcmap.is_some() {
                self.line_count += 1;
                self.line_pos = 0;
            }
            self.line_start = true;

            if let Some(pending) = pending {
                self.srcmap(pending)
            }
        }

        Ok(())
    }

    #[inline]
    fn write_lit(&mut self, span: Span, s: &str) -> Result {
        if !s.is_empty() {
            self.srcmap(span.lo());
            self.write(None, s)?;
            self.srcmap(span.hi());
        }

        Ok(())
    }

    #[inline]
    fn write_comment(&mut self, s: &str) -> Result {
        self.write(None, s)?;
        Ok(())
    }

    #[inline]
    fn write_str_lit(&mut self, span: Span, s: &str) -> Result {
        if !s.is_empty() {
            self.srcmap(span.lo());
            self.write(None, s)?;
            self.srcmap(span.hi());
        }

        Ok(())
    }

    #[inline]
    fn write_str(&mut self, s: &str) -> Result {
        self.write(None, s)?;
        Ok(())
    }

    #[inline]
    fn write_symbol(&mut self, span: Span, s: &str) -> Result {
        self.write(Some(span), s)?;
        Ok(())
    }

    #[inline]
    fn write_punct(
        &mut self,
        span: Option<Span>,
        s: &'static str,
        _commit_pending_semi: bool,
    ) -> Result {
        self.write(span, s)?;
        Ok(())
    }

    #[inline]
    fn care_about_srcmap(&self) -> bool {
        self.srcmap.is_some()
    }

    #[inline]
    fn add_srcmap(&mut self, pos: BytePos) -> Result {
        if self.srcmap.is_some() {
            if self.line_start {
                self.pending_srcmap = Some(pos);
            } else {
                self.srcmap(pos);
            }
        }
        Ok(())
    }

    #[inline]
    fn commit_pending_semi(&mut self) -> Result {
        Ok(())
    }

    #[inline(always)]
    fn can_ignore_invalid_unicodes(&mut self) -> bool {
        false
    }

    #[inline(always)]
    fn has_scope_tracking(&self) -> bool {
        self.scopes.is_some()
    }

    #[inline]
    fn start_scope(
        &mut self,
        name: Option<&str>,
        kind: super::ScopeKind,
        is_stack_frame: bool,
        is_hidden: bool,
        original_span: Option<Span>,
    ) -> Result {
        let start = self.generated_pos();
        let Some(scopes) = self.scopes.as_deref_mut() else {
            return Ok(());
        };

        let idx = scopes.len() as u32;
        let parent = self.scope_stack.last().copied();
        scopes.push(ScopeRecord {
            parent,
            generated_start: start,
            generated_end: None,
            original_span,
            kind,
            is_stack_frame,
            is_hidden,
            name: name.map(str::to_owned),
            bindings: vec![],
        });
        self.scope_stack.push(idx);

        Ok(())
    }

    #[inline]
    fn end_scope(&mut self) -> Result {
        let Some(idx) = self.scope_stack.pop() else {
            return Ok(());
        };

        let end = self.generated_pos();
        if let Some(scopes) = self.scopes.as_deref_mut() {
            if let Some(scope) = scopes.get_mut(idx as usize) {
                scope.generated_end = Some(end);
            }
        }

        Ok(())
    }

    #[inline]
    fn add_scope_variable(
        &mut self,
        name: &str,
        expression: Option<&str>,
        storage: BindingStorage,
    ) -> Result {
        let Some(scopes) = self.scopes.as_deref() else {
            return Ok(());
        };

        let target_scope = match storage {
            BindingStorage::Hoisted => self
                .scope_stack
                .iter()
                .rev()
                .copied()
                .find(|idx| scopes[*idx as usize].kind.is_hoist_target())
                .or_else(|| self.scope_stack.last().copied()),
            BindingStorage::Lexical => self.scope_stack.last().copied(),
        };

        let Some(target_scope) = target_scope else {
            return Ok(());
        };

        let Some(scopes) = self.scopes.as_deref_mut() else {
            return Ok(());
        };
        let scope = &mut scopes[target_scope as usize];
        if scope.bindings.iter().any(|binding| binding.name == name) {
            return Ok(());
        }

        scope.bindings.push(ScopeBindingRecord {
            name: name.to_string(),
            expression: expression.map(str::to_owned),
            storage,
        });

        Ok(())
    }
}

#[derive(Debug)]
struct LineStart {
    line_count: usize,
    byte_pos: usize,
}
fn compute_line_starts(s: &str) -> LineStart {
    let mut count = 0;
    let mut line_start = 0;

    let mut chars = s.as_bytes().iter().enumerate().peekable();

    while let Some((pos, c)) = chars.next() {
        match c {
            b'\r' => {
                count += 1;
                if let Some(&(_, b'\n')) = chars.peek() {
                    let _ = chars.next();
                    line_start = pos + 2
                } else {
                    line_start = pos + 1
                }
            }

            b'\n' => {
                count += 1;
                line_start = pos + 1;
            }

            _ => {}
        }
    }

    LineStart {
        line_count: count,
        byte_pos: line_start,
    }
}

#[cfg(test)]
mod test {
    use std::sync::Arc;

    use swc_common::SourceMap;

    use super::JsWriter;
    use crate::text_writer::{BindingStorage, ScopeKind, WriteJs};

    #[test]
    fn changes_indent_str() {
        let source_map = Arc::new(SourceMap::default());
        let mut output = Vec::new();
        let mut writer = JsWriter::new(source_map, "\n", &mut output, None);
        writer.set_indent_str("\t");
        writer.increase_indent().unwrap();
        writer.write_indent_string().unwrap();
        writer.increase_indent().unwrap();
        writer.write_indent_string().unwrap();
        assert_eq!(output, "\t\t\t".as_bytes());
    }

    #[test]
    fn collects_scopes_and_bindings() {
        let source_map = Arc::new(SourceMap::default());
        let mut output = Vec::new();
        let mut scopes = vec![];
        let mut writer =
            JsWriter::new_with_scopes(source_map, "\n", &mut output, None, Some(&mut scopes));

        writer
            .start_scope(Some("global"), ScopeKind::Global, false, false, None)
            .unwrap();
        writer
            .add_scope_variable("g", Some("g"), BindingStorage::Hoisted)
            .unwrap();

        writer
            .start_scope(Some("f"), ScopeKind::Function, true, false, None)
            .unwrap();
        writer
            .add_scope_variable("p", Some("p"), BindingStorage::Lexical)
            .unwrap();
        writer
            .start_scope(None, ScopeKind::Block, false, false, None)
            .unwrap();
        writer
            .add_scope_variable("v", Some("v"), BindingStorage::Hoisted)
            .unwrap();

        writer.end_scope().unwrap();
        writer.end_scope().unwrap();
        writer.end_scope().unwrap();

        assert_eq!(scopes.len(), 3);
        assert_eq!(scopes[0].name.as_deref(), Some("global"));
        assert_eq!(scopes[1].name.as_deref(), Some("f"));
        assert_eq!(scopes[1].bindings.len(), 2);
        assert_eq!(scopes[1].bindings[0].name, "p");
        assert_eq!(scopes[1].bindings[1].name, "v");
        assert_eq!(scopes[2].bindings.len(), 0);
    }

    #[test]
    fn hoisted_binding_targets_nearest_hoist_scope() {
        let source_map = Arc::new(SourceMap::default());
        let mut output = Vec::new();
        let mut scopes = vec![];
        let mut writer =
            JsWriter::new_with_scopes(source_map, "\n", &mut output, None, Some(&mut scopes));

        writer
            .start_scope(Some("global"), ScopeKind::Global, false, false, None)
            .unwrap();
        writer
            .start_scope(Some("fn"), ScopeKind::Function, true, false, None)
            .unwrap();
        writer
            .start_scope(None, ScopeKind::Block, false, false, None)
            .unwrap();

        writer
            .add_scope_variable("h", Some("h"), BindingStorage::Hoisted)
            .unwrap();
        writer
            .add_scope_variable("l", Some("l"), BindingStorage::Lexical)
            .unwrap();

        writer.end_scope().unwrap();
        writer.end_scope().unwrap();
        writer.end_scope().unwrap();

        assert_eq!(scopes.len(), 3);
        assert_eq!(scopes[1].bindings.len(), 1);
        assert_eq!(scopes[1].bindings[0].name, "h");
        assert_eq!(scopes[2].bindings.len(), 1);
        assert_eq!(scopes[2].bindings[0].name, "l");
    }

    #[test]
    fn deduplicates_scope_variables_by_name() {
        let source_map = Arc::new(SourceMap::default());
        let mut output = Vec::new();
        let mut scopes = vec![];
        let mut writer =
            JsWriter::new_with_scopes(source_map, "\n", &mut output, None, Some(&mut scopes));

        writer
            .start_scope(Some("global"), ScopeKind::Global, false, false, None)
            .unwrap();
        writer
            .add_scope_variable("dup", Some("first"), BindingStorage::Lexical)
            .unwrap();
        writer
            .add_scope_variable("dup", Some("second"), BindingStorage::Lexical)
            .unwrap();
        writer.end_scope().unwrap();

        assert_eq!(scopes.len(), 1);
        assert_eq!(scopes[0].bindings.len(), 1);
        assert_eq!(scopes[0].bindings[0].name, "dup");
        assert_eq!(scopes[0].bindings[0].expression.as_deref(), Some("first"));
    }
}
