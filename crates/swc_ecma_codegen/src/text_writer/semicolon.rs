use swc_common::{BytePos, Span, DUMMY_SP};

use super::{BindingStorage, Result, ScopeKind, WriteJs};

pub fn omit_trailing_semi<W: WriteJs>(w: W) -> impl WriteJs {
    OmitTrailingSemi {
        inner: w,
        pending_semi: None,
        pending_srcmap: None,
    }
}

#[derive(Debug, Clone)]
struct OmitTrailingSemi<W: WriteJs> {
    inner: W,
    pending_semi: Option<Span>,
    pending_srcmap: Option<BytePos>,
}

impl<W: WriteJs> OmitTrailingSemi<W> {
    #[inline]
    fn commit_pending_srcmap(&mut self) -> Result {
        if let Some(pos) = self.pending_srcmap.take() {
            self.inner.add_srcmap(pos)?;
        }

        Ok(())
    }
}

macro_rules! with_semi {
    (
        $fn_name:ident
        (
            $(
                $arg_name:ident
                :
                $arg_ty:ty
            ),*
        )
    ) => {
        fn $fn_name(&mut self, $($arg_name: $arg_ty),* ) -> Result {
            self.commit_pending_semi()?;

            self.inner.$fn_name( $($arg_name),* )
        }
    };
}

impl<W: WriteJs> WriteJs for OmitTrailingSemi<W> {
    with_semi!(increase_indent());

    with_semi!(decrease_indent());

    with_semi!(write_space());

    with_semi!(write_comment(s: &str));

    with_semi!(write_keyword(span: Option<Span>, s: &'static str));

    with_semi!(write_operator(span: Option<Span>, s: &str));

    with_semi!(write_param(s: &str));

    with_semi!(write_property(s: &str));

    with_semi!(write_line());

    with_semi!(write_lit(span: Span, s: &str));

    with_semi!(write_str_lit(span: Span, s: &str));

    with_semi!(write_str(s: &str));

    with_semi!(write_symbol(span: Span, s: &str));

    fn write_semi(&mut self, span: Option<Span>) -> Result {
        self.pending_semi = Some(span.unwrap_or(DUMMY_SP));
        Ok(())
    }

    fn write_punct(
        &mut self,
        span: Option<Span>,
        s: &'static str,
        commit_pending_semi: bool,
    ) -> Result {
        if commit_pending_semi {
            self.commit_pending_semi()?;
        } else {
            self.pending_semi = None;
            self.commit_pending_srcmap()?;
        }
        self.inner.write_punct(span, s, commit_pending_semi)
    }

    #[inline]
    fn care_about_srcmap(&self) -> bool {
        self.inner.care_about_srcmap()
    }

    #[inline]
    fn will_add_srcmap(&self, pos: BytePos) -> bool {
        let Some(pending) = self.pending_srcmap else {
            return self.inner.will_add_srcmap(pos);
        };

        // A new mapping replaces the deferred transition, so predict from its
        // effective mapped state instead of the inner writer's stale state.
        if pos.is_dummy() {
            false
        } else if pos == BytePos::SYNTHESIZED {
            pending != BytePos::SYNTHESIZED
        } else {
            true
        }
    }

    #[inline]
    fn add_srcmap(&mut self, pos: BytePos) -> Result {
        if self.pending_srcmap.is_some()
            || (self.pending_semi.is_some() && self.inner.will_add_srcmap(pos))
        {
            // Keep the transition immediately before the next output token.
            // A closing delimiter may discard the pending semicolon first,
            // while any other token commits it before changing mappings.
            self.pending_srcmap = Some(pos);
            return Ok(());
        }

        self.inner.add_srcmap(pos)
    }

    fn commit_pending_semi(&mut self) -> Result {
        if let Some(span) = self.pending_semi {
            self.inner.write_semi(Some(span))?;
            self.pending_semi = None;
        }

        self.commit_pending_srcmap()?;
        Ok(())
    }

    #[inline(always)]
    fn can_ignore_invalid_unicodes(&mut self) -> bool {
        self.inner.can_ignore_invalid_unicodes()
    }

    #[inline(always)]
    fn has_scope_tracking(&self) -> bool {
        self.inner.has_scope_tracking()
    }

    #[inline]
    fn start_scope(
        &mut self,
        name: Option<&str>,
        kind: ScopeKind,
        is_stack_frame: bool,
        is_hidden: bool,
        original_span: Option<Span>,
    ) -> Result {
        self.inner
            .start_scope(name, kind, is_stack_frame, is_hidden, original_span)
    }

    #[inline]
    fn end_scope(&mut self) -> Result {
        self.inner.end_scope()
    }

    #[inline]
    fn add_scope_variable(
        &mut self,
        name: &str,
        expression: Option<&str>,
        storage: BindingStorage,
    ) -> Result {
        self.inner.add_scope_variable(name, expression, storage)
    }
}

#[cfg(test)]
mod tests {
    use std::sync::Arc;

    use swc_common::{BytePos, LineCol, SourceMap, Span};

    use crate::text_writer::{basic_impl::JsWriter, BindingStorage, ScopeKind, WriteJs};

    #[test]
    fn forwards_scope_operations() {
        let source_map = Arc::new(SourceMap::default());
        let mut out = vec![];
        let mut scopes = vec![];
        {
            let writer =
                JsWriter::new_with_scopes(source_map, "\n", &mut out, None, Some(&mut scopes));
            let mut writer = super::omit_trailing_semi(writer);

            writer
                .start_scope(None, ScopeKind::Function, true, false, None)
                .unwrap();
            writer
                .add_scope_variable("x", Some("x"), BindingStorage::Lexical)
                .unwrap();
            writer.end_scope().unwrap();
        }

        assert_eq!(scopes.len(), 1);
        assert_eq!(scopes[0].bindings.len(), 1);
        assert_eq!(scopes[0].bindings[0].name, "x");
    }

    #[test]
    fn flushes_pending_semi_before_unmapped_boundary() {
        let source_map = Arc::new(SourceMap::default());
        let mut out = vec![];
        let mut mappings = vec![];
        {
            let writer = JsWriter::new(source_map, "\n", &mut out, Some(&mut mappings));
            let mut writer = super::omit_trailing_semi(writer);

            writer.write_str("before()").unwrap();
            writer.add_srcmap(BytePos(1)).unwrap();
            writer.write_semi(None).unwrap();
            writer.add_srcmap(BytePos::SYNTHESIZED).unwrap();
            writer.write_str("after").unwrap();
        }

        assert_eq!(out, b"before();after");
        assert_eq!(
            mappings,
            vec![
                (BytePos(1), LineCol { line: 0, col: 8 }),
                (BytePos::SYNTHESIZED, LineCol { line: 0, col: 9 }),
            ]
        );
    }

    #[test]
    fn defers_unmapped_boundary_until_discarding_punct() {
        let source_map = Arc::new(SourceMap::default());
        let mut out = vec![];
        let mut mappings = vec![];
        {
            let writer = JsWriter::new(source_map, "\n", &mut out, Some(&mut mappings));
            let mut writer = super::omit_trailing_semi(writer);

            writer.write_punct(None, "{", false).unwrap();
            writer.add_srcmap(BytePos(1)).unwrap();
            writer.write_str("foo()").unwrap();
            writer.write_semi(None).unwrap();
            writer.add_srcmap(BytePos::SYNTHESIZED).unwrap();
            writer.write_punct(None, "}", false).unwrap();
        }

        assert_eq!(out, b"{foo()}");
        assert_eq!(
            mappings,
            vec![
                (BytePos(1), LineCol { line: 0, col: 1 }),
                (BytePos::SYNTHESIZED, LineCol { line: 0, col: 6 }),
            ]
        );
    }

    #[test]
    fn restores_owner_mapping_after_deferred_unmapped_boundary() {
        let source_map = Arc::new(SourceMap::default());
        let mut out = vec![];
        let mut mappings = vec![];
        {
            let writer = JsWriter::new(source_map, "\n", &mut out, Some(&mut mappings));
            let mut writer = super::omit_trailing_semi(writer);

            writer.write_punct(None, "{", false).unwrap();
            writer.add_srcmap(BytePos(1)).unwrap();
            writer.write_str("foo()").unwrap();
            writer.write_semi(None).unwrap();
            writer.add_srcmap(BytePos::SYNTHESIZED).unwrap();
            writer
                .add_srcmap_for_owner(Span::new(BytePos(1), BytePos(7)), false)
                .unwrap();
            writer.write_punct(None, "}", false).unwrap();
        }

        assert_eq!(out, b"{foo()}");
        assert_eq!(
            mappings,
            vec![
                (BytePos(1), LineCol { line: 0, col: 1 }),
                (BytePos(1), LineCol { line: 0, col: 6 }),
            ]
        );
    }

    #[test]
    fn preserves_pending_semi_before_redundant_unmapped_boundary() {
        let source_map = Arc::new(SourceMap::default());
        let mut out = vec![];
        let mut mappings = vec![];
        {
            let writer = JsWriter::new(source_map, "\n", &mut out, Some(&mut mappings));
            let mut writer = super::omit_trailing_semi(writer);

            writer.write_punct(None, "{", false).unwrap();
            writer.write_str("foo()").unwrap();
            writer.write_semi(None).unwrap();
            writer.add_srcmap(BytePos::SYNTHESIZED).unwrap();
            writer.write_punct(None, "}", false).unwrap();
        }

        assert_eq!(out, b"{foo()}");
        assert!(mappings.is_empty());
    }
}
