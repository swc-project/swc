use swc_common::{LineCol, Span};

pub use self::{basic_impl::JsWriter, semicolon::omit_trailing_semi};
use super::*;

mod basic_impl;
mod semicolon;

/// TODO
pub type Symbol = Str;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ScopeKind {
    Global,
    Module,
    Function,
    Block,
    Catch,
}

impl ScopeKind {
    #[inline]
    pub const fn is_hoist_target(self) -> bool {
        matches!(self, Self::Global | Self::Module | Self::Function)
    }

    #[inline]
    pub const fn as_str(self) -> &'static str {
        match self {
            ScopeKind::Global => "global",
            ScopeKind::Module => "module",
            ScopeKind::Function => "function",
            ScopeKind::Block => "block",
            ScopeKind::Catch => "catch",
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum BindingStorage {
    Hoisted,
    Lexical,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ScopeBindingRecord {
    pub name: String,
    pub expression: Option<String>,
    pub storage: BindingStorage,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ScopeRecord {
    pub parent: Option<u32>,
    pub generated_start: LineCol,
    pub generated_end: Option<LineCol>,
    pub original_span: Option<Span>,
    pub kind: ScopeKind,
    pub is_stack_frame: bool,
    pub is_hidden: bool,
    pub name: Option<String>,
    pub bindings: Vec<ScopeBindingRecord>,
}

/// Ecmascript writer.
///
/// Ported from `EmitWriteJs`.
pub trait WriteJs {
    fn increase_indent(&mut self) -> Result;
    fn decrease_indent(&mut self) -> Result;

    /// This *may* write semicolon.
    fn write_semi(&mut self, span: Option<Span>) -> Result;

    fn write_space(&mut self) -> Result;
    fn write_keyword(&mut self, span: Option<Span>, s: &'static str) -> Result;
    fn write_operator(&mut self, span: Option<Span>, s: &str) -> Result;
    fn write_param(&mut self, s: &str) -> Result;
    fn write_property(&mut self, s: &str) -> Result;

    fn write_line(&mut self) -> Result;

    fn write_lit(&mut self, span: Span, s: &str) -> Result;
    fn write_comment(&mut self, s: &str) -> Result;

    fn write_str_lit(&mut self, span: Span, s: &str) -> Result;
    fn write_str(&mut self, s: &str) -> Result;

    fn write_symbol(&mut self, span: Span, s: &str) -> Result;

    /// `commit_pending_semi` should be `true` if the punctuation requires a
    /// preceding semicolon to be committed before writing. This is typically
    /// needed for punctuation like `"`, `'`, `[`, `!`, `/`, `{`, `(`, `~`,
    /// `-`, `+`, `#`, `` ` ``, `*` where ASI (Automatic Semicolon Insertion)
    /// could cause issues.
    fn write_punct(
        &mut self,
        span: Option<Span>,
        s: &'static str,
        commit_pending_semi: bool,
    ) -> Result;

    fn care_about_srcmap(&self) -> bool;

    /// Returns whether adding `pos` would record a source-map transition.
    ///
    /// Writers that do not track their current mapping state conservatively
    /// report whether they collect source maps at all.
    fn will_add_srcmap(&self, _pos: BytePos) -> bool {
        self.care_about_srcmap()
    }

    fn add_srcmap(&mut self, pos: BytePos) -> Result;

    /// Records the mapping of a token owned by `owner_span` that is emitted
    /// after one of the owner's children.
    ///
    /// A synthesized owner keeps the token source-less, while a real owner
    /// resumes its own mapping once the child, or one of its descendants,
    /// cleared it. `child_is_dummy` reports whether the preceding child was
    /// itself synthesized.
    ///
    /// This is a single entry point on purpose: it is called for most tokens
    /// that follow a child node, and going through the writer once keeps the
    /// cost of a `dyn WriteJs` emitter down.
    fn add_srcmap_for_owner(&mut self, owner_span: Span, child_is_dummy: bool) -> Result {
        if !self.care_about_srcmap() {
            return Ok(());
        }

        if owner_span.is_dummy() {
            self.add_srcmap(BytePos::SYNTHESIZED)
        } else if child_is_dummy || !self.will_add_srcmap(BytePos::SYNTHESIZED) {
            self.add_srcmap(owner_span.lo())
        } else {
            Ok(())
        }
    }

    fn commit_pending_semi(&mut self) -> Result;

    /// If true, the code generator will skip **modification** of invalid
    /// unicode characters.
    ///
    /// Defaults to `false``
    fn can_ignore_invalid_unicodes(&mut self) -> bool {
        false
    }

    /// Returns true if scope tracking hooks should be emitted.
    ///
    /// This is used to avoid scope-tracking overhead on the hot codegen path
    /// when source map scopes are disabled.
    fn has_scope_tracking(&self) -> bool {
        false
    }

    /// Starts a new scope in the generated output.
    ///
    /// This is used for source map scope tracking (ECMA-426).
    fn start_scope(
        &mut self,
        _name: Option<&str>,
        _kind: ScopeKind,
        _is_stack_frame: bool,
        _is_hidden: bool,
        _original_span: Option<Span>,
    ) -> Result {
        Ok(())
    }

    /// Ends the current scope.
    ///
    /// This is used for source map scope tracking (ECMA-426).
    fn end_scope(&mut self) -> Result {
        Ok(())
    }

    /// Adds a variable binding to the current scope or its hoist target.
    ///
    /// This is used for source map scope tracking (ECMA-426).
    fn add_scope_variable(
        &mut self,
        _name: &str,
        _expression: Option<&str>,
        _storage: BindingStorage,
    ) -> Result {
        Ok(())
    }
}

impl<W> WriteJs for Box<W>
where
    W: ?Sized + WriteJs,
{
    #[inline]
    fn increase_indent(&mut self) -> Result {
        (**self).increase_indent()
    }

    #[inline]
    fn decrease_indent(&mut self) -> Result {
        (**self).decrease_indent()
    }

    #[inline]
    fn write_semi(&mut self, span: Option<Span>) -> Result {
        (**self).write_semi(span)
    }

    #[inline]
    fn write_space(&mut self) -> Result {
        (**self).write_space()
    }

    #[inline]
    fn write_keyword(&mut self, span: Option<Span>, s: &'static str) -> Result {
        (**self).write_keyword(span, s)
    }

    #[inline]
    fn write_operator(&mut self, span: Option<Span>, s: &str) -> Result {
        (**self).write_operator(span, s)
    }

    #[inline]
    fn write_param(&mut self, s: &str) -> Result {
        (**self).write_param(s)
    }

    #[inline]
    fn write_property(&mut self, s: &str) -> Result {
        (**self).write_property(s)
    }

    #[inline]
    fn write_line(&mut self) -> Result {
        (**self).write_line()
    }

    #[inline]
    fn write_lit(&mut self, span: Span, s: &str) -> Result {
        (**self).write_lit(span, s)
    }

    #[inline]
    fn write_comment(&mut self, s: &str) -> Result {
        (**self).write_comment(s)
    }

    #[inline]
    fn write_str_lit(&mut self, span: Span, s: &str) -> Result {
        (**self).write_str_lit(span, s)
    }

    #[inline]
    fn write_str(&mut self, s: &str) -> Result {
        (**self).write_str(s)
    }

    #[inline]
    fn write_symbol(&mut self, span: Span, s: &str) -> Result {
        (**self).write_symbol(span, s)
    }

    #[inline]
    fn write_punct(
        &mut self,
        span: Option<Span>,
        s: &'static str,
        commit_pending_semi: bool,
    ) -> Result {
        (**self).write_punct(span, s, commit_pending_semi)
    }

    #[inline]
    fn care_about_srcmap(&self) -> bool {
        (**self).care_about_srcmap()
    }

    #[inline]
    fn will_add_srcmap(&self, pos: BytePos) -> bool {
        (**self).will_add_srcmap(pos)
    }

    #[inline]
    fn add_srcmap(&mut self, pos: BytePos) -> Result {
        (**self).add_srcmap(pos)
    }

    #[inline]
    fn add_srcmap_for_owner(&mut self, owner_span: Span, child_is_dummy: bool) -> Result {
        (**self).add_srcmap_for_owner(owner_span, child_is_dummy)
    }

    fn commit_pending_semi(&mut self) -> Result {
        (**self).commit_pending_semi()
    }

    #[inline(always)]
    fn can_ignore_invalid_unicodes(&mut self) -> bool {
        (**self).can_ignore_invalid_unicodes()
    }

    #[inline(always)]
    fn has_scope_tracking(&self) -> bool {
        (**self).has_scope_tracking()
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
        (**self).start_scope(name, kind, is_stack_frame, is_hidden, original_span)
    }

    #[inline]
    fn end_scope(&mut self) -> Result {
        (**self).end_scope()
    }

    #[inline]
    fn add_scope_variable(
        &mut self,
        name: &str,
        expression: Option<&str>,
        storage: BindingStorage,
    ) -> Result {
        (**self).add_scope_variable(name, expression, storage)
    }
}

impl<W> WriteJs for &'_ mut W
where
    W: ?Sized + WriteJs,
{
    #[inline]
    fn increase_indent(&mut self) -> Result {
        (**self).increase_indent()
    }

    #[inline]
    fn decrease_indent(&mut self) -> Result {
        (**self).decrease_indent()
    }

    #[inline]
    fn write_semi(&mut self, span: Option<Span>) -> Result {
        (**self).write_semi(span)
    }

    #[inline]
    fn write_space(&mut self) -> Result {
        (**self).write_space()
    }

    #[inline]
    fn write_keyword(&mut self, span: Option<Span>, s: &'static str) -> Result {
        (**self).write_keyword(span, s)
    }

    #[inline]
    fn write_operator(&mut self, span: Option<Span>, s: &str) -> Result {
        (**self).write_operator(span, s)
    }

    #[inline]
    fn write_param(&mut self, s: &str) -> Result {
        (**self).write_param(s)
    }

    #[inline]
    fn write_property(&mut self, s: &str) -> Result {
        (**self).write_property(s)
    }

    #[inline]
    fn write_line(&mut self) -> Result {
        (**self).write_line()
    }

    #[inline]
    fn write_lit(&mut self, span: Span, s: &str) -> Result {
        (**self).write_lit(span, s)
    }

    #[inline]
    fn write_comment(&mut self, s: &str) -> Result {
        (**self).write_comment(s)
    }

    #[inline]
    fn write_str_lit(&mut self, span: Span, s: &str) -> Result {
        (**self).write_str_lit(span, s)
    }

    #[inline]
    fn write_str(&mut self, s: &str) -> Result {
        (**self).write_str(s)
    }

    #[inline]
    fn write_symbol(&mut self, span: Span, s: &str) -> Result {
        (**self).write_symbol(span, s)
    }

    #[inline]
    fn write_punct(
        &mut self,
        span: Option<Span>,
        s: &'static str,
        commit_pending_semi: bool,
    ) -> Result {
        (**self).write_punct(span, s, commit_pending_semi)
    }

    #[inline]
    fn care_about_srcmap(&self) -> bool {
        (**self).care_about_srcmap()
    }

    #[inline]
    fn will_add_srcmap(&self, pos: BytePos) -> bool {
        (**self).will_add_srcmap(pos)
    }

    #[inline]
    fn add_srcmap(&mut self, pos: BytePos) -> Result {
        (**self).add_srcmap(pos)
    }

    #[inline]
    fn add_srcmap_for_owner(&mut self, owner_span: Span, child_is_dummy: bool) -> Result {
        (**self).add_srcmap_for_owner(owner_span, child_is_dummy)
    }

    #[inline(always)]
    fn commit_pending_semi(&mut self) -> Result {
        (**self).commit_pending_semi()
    }

    #[inline(always)]
    fn can_ignore_invalid_unicodes(&mut self) -> bool {
        (**self).can_ignore_invalid_unicodes()
    }

    #[inline(always)]
    fn has_scope_tracking(&self) -> bool {
        (**self).has_scope_tracking()
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
        (**self).start_scope(name, kind, is_stack_frame, is_hidden, original_span)
    }

    #[inline]
    fn end_scope(&mut self) -> Result {
        (**self).end_scope()
    }

    #[inline]
    fn add_scope_variable(
        &mut self,
        name: &str,
        expression: Option<&str>,
        storage: BindingStorage,
    ) -> Result {
        (**self).add_scope_variable(name, expression, storage)
    }
}
