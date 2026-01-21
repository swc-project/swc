//! Source Map Scopes
//!
//! This module implements scope and variable binding encoding for source maps
//! according to the ECMA-426 specification.
//!
//! See: https://tc39.es/ecma426/ and
//! https://github.com/nicolo-ribaudo/nicolo-nicolo-nicolo/blob/main/proposals/scopes.md

use std::borrow::Cow;

/// Represents a scope in the original (authored) source code.
///
/// Original scopes form a tree structure that describes the lexical scope
/// hierarchy of the source code. Each scope can contain variables and
/// nested child scopes.
#[derive(Debug, Clone, Default)]
pub struct OriginalScope<'a> {
    /// The source file index (into the source map's sources array).
    pub source_idx: u32,
    /// Start position (0-indexed line, 0-indexed UTF-16 column).
    pub start: ScopePosition,
    /// End position (0-indexed line, 0-indexed UTF-16 column).
    pub end: ScopePosition,
    /// Optional name of this scope (e.g., function name).
    pub name: Option<Cow<'a, str>>,
    /// Optional kind of this scope (e.g., "function", "class", "block").
    pub kind: Option<ScopeKind>,
    /// Whether this scope represents a stack frame in debugger.
    /// True for function scopes that should appear in stack traces.
    pub is_stack_frame: bool,
    /// Variable names defined in this scope.
    pub variables: Vec<Cow<'a, str>>,
    /// Child scopes nested within this scope.
    pub children: Vec<OriginalScope<'a>>,
}

/// Position within a source file.
#[derive(Debug, Clone, Copy, Default, PartialEq, Eq)]
pub struct ScopePosition {
    /// 0-indexed line number.
    pub line: u32,
    /// 0-indexed UTF-16 column number.
    pub column: u32,
}

impl ScopePosition {
    /// Creates a new scope position.
    #[inline]
    pub fn new(line: u32, column: u32) -> Self {
        Self { line, column }
    }
}

/// The kind of scope.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ScopeKind {
    /// Global scope.
    Global,
    /// Function scope.
    Function,
    /// Class scope.
    Class,
    /// Block scope (let/const).
    Block,
    /// Module scope.
    Module,
}

impl ScopeKind {
    /// Returns the string representation of the scope kind.
    pub fn as_str(&self) -> &'static str {
        match self {
            ScopeKind::Global => "global",
            ScopeKind::Function => "function",
            ScopeKind::Class => "class",
            ScopeKind::Block => "block",
            ScopeKind::Module => "module",
        }
    }
}

/// Represents a range in the generated (compiled/minified) code that
/// corresponds to an original scope.
///
/// Generated ranges form a tree structure that maps regions of the compiled
/// output back to original scopes. Each range can include bindings that
/// specify how to evaluate variable values.
#[derive(Debug, Clone, Default)]
pub struct GeneratedRange<'a> {
    /// Start position in generated code (0-indexed line, 0-indexed UTF-16
    /// column).
    pub start: ScopePosition,
    /// End position in generated code (0-indexed line, 0-indexed UTF-16
    /// column).
    pub end: ScopePosition,
    /// Whether this range represents a stack frame in debugger.
    pub is_stack_frame: bool,
    /// Whether this range should be hidden from stack traces.
    pub is_hidden: bool,
    /// Index into the original scopes array that this range corresponds to.
    /// `None` means this range doesn't correspond to any original scope.
    pub original_scope: Option<u32>,
    /// For inlined functions, the original call site location.
    pub callsite: Option<Callsite>,
    /// Bindings that specify how to evaluate variables in this range.
    /// Each binding corresponds to a variable in the original scope.
    /// `None` means the variable is unavailable at this location.
    pub bindings: Vec<Option<Cow<'a, str>>>,
    /// Child ranges nested within this range.
    pub children: Vec<GeneratedRange<'a>>,
}

/// Information about the original call site for inlined functions.
#[derive(Debug, Clone, Copy, Default)]
pub struct Callsite {
    /// Source file index.
    pub source_idx: u32,
    /// 0-indexed line number.
    pub line: u32,
    /// 0-indexed UTF-16 column number.
    pub column: u32,
}

/// Builder for collecting scope information during code generation.
#[derive(Debug, Default)]
pub struct ScopeBuilder<'a> {
    /// All original scopes indexed by their definition order.
    original_scopes: Vec<OriginalScope<'a>>,
    /// All generated ranges indexed by their definition order.
    generated_ranges: Vec<GeneratedRange<'a>>,
    /// Names used for scopes and variables.
    names: Vec<Cow<'a, str>>,
    /// Stack of scope indices currently being built.
    original_scope_stack: Vec<usize>,
    /// Stack of range indices currently being built.
    generated_range_stack: Vec<usize>,
}

impl<'a> ScopeBuilder<'a> {
    /// Creates a new scope builder.
    pub fn new() -> Self {
        Self::default()
    }

    /// Starts a new original scope.
    pub fn start_original_scope(
        &mut self,
        source_idx: u32,
        start: ScopePosition,
        name: Option<Cow<'a, str>>,
        kind: Option<ScopeKind>,
        is_stack_frame: bool,
    ) -> usize {
        let idx = self.original_scopes.len();
        let scope = OriginalScope {
            source_idx,
            start,
            end: ScopePosition::default(),
            name,
            kind,
            is_stack_frame,
            variables: Vec::new(),
            children: Vec::new(),
        };

        self.original_scopes.push(scope);
        self.original_scope_stack.push(idx);
        idx
    }

    /// Adds a variable to the current original scope.
    pub fn add_variable(&mut self, name: Cow<'a, str>) {
        if let Some(&idx) = self.original_scope_stack.last() {
            self.original_scopes[idx].variables.push(name);
        }
    }

    /// Ends the current original scope.
    pub fn end_original_scope(&mut self, end: ScopePosition) {
        if let Some(idx) = self.original_scope_stack.pop() {
            self.original_scopes[idx].end = end;
        }
    }

    /// Starts a new generated range.
    pub fn start_generated_range(
        &mut self,
        start: ScopePosition,
        is_stack_frame: bool,
        is_hidden: bool,
        original_scope: Option<u32>,
        callsite: Option<Callsite>,
    ) -> usize {
        let idx = self.generated_ranges.len();
        let range = GeneratedRange {
            start,
            end: ScopePosition::default(),
            is_stack_frame,
            is_hidden,
            original_scope,
            callsite,
            bindings: Vec::new(),
            children: Vec::new(),
        };

        self.generated_ranges.push(range);
        self.generated_range_stack.push(idx);
        idx
    }

    /// Adds a binding to the current generated range.
    pub fn add_binding(&mut self, expression: Option<Cow<'a, str>>) {
        if let Some(&idx) = self.generated_range_stack.last() {
            self.generated_ranges[idx].bindings.push(expression);
        }
    }

    /// Ends the current generated range.
    pub fn end_generated_range(&mut self, end: ScopePosition) {
        if let Some(idx) = self.generated_range_stack.pop() {
            self.generated_ranges[idx].end = end;
        }
    }

    /// Adds a name to the names list and returns its index.
    pub fn add_name(&mut self, name: Cow<'a, str>) -> u32 {
        // Check if name already exists
        for (i, n) in self.names.iter().enumerate() {
            if n == &name {
                return i as u32;
            }
        }
        let idx = self.names.len() as u32;
        self.names.push(name);
        idx
    }

    /// Returns the collected original scopes.
    pub fn original_scopes(&self) -> &[OriginalScope<'a>] {
        &self.original_scopes
    }

    /// Returns the collected generated ranges.
    pub fn generated_ranges(&self) -> &[GeneratedRange<'a>] {
        &self.generated_ranges
    }

    /// Returns the collected names.
    pub fn names(&self) -> &[Cow<'a, str>] {
        &self.names
    }

    /// Encodes all scopes into the VLQ format for the "scopes" field.
    pub fn encode(&self) -> String {
        let mut encoder = ScopeEncoder::new();
        encoder.encode_scopes(&self.original_scopes, &self.generated_ranges, &self.names)
    }
}

/// Encoder for scope information into VLQ format.
struct ScopeEncoder {
    output: String,
    prev_orig_line: i64,
    prev_orig_col: i64,
    prev_gen_line: i64,
    prev_gen_col: i64,
    prev_source_idx: i64,
    prev_name_idx: i64,
}

impl ScopeEncoder {
    fn new() -> Self {
        Self {
            output: String::new(),
            prev_orig_line: 0,
            prev_orig_col: 0,
            prev_gen_line: 0,
            prev_gen_col: 0,
            prev_source_idx: 0,
            prev_name_idx: 0,
        }
    }

    fn encode_scopes(
        &mut self,
        original_scopes: &[OriginalScope<'_>],
        generated_ranges: &[GeneratedRange<'_>],
        names: &[Cow<'_, str>],
    ) -> String {
        // Encode original scopes
        for scope in original_scopes {
            self.encode_original_scope(scope, names);
        }

        // Add separator between original scopes and generated ranges
        if !original_scopes.is_empty() && !generated_ranges.is_empty() {
            self.output.push(',');
        }

        // Encode generated ranges
        for range in generated_ranges {
            self.encode_generated_range(range, names);
        }

        std::mem::take(&mut self.output)
    }

    fn encode_original_scope(&mut self, scope: &OriginalScope<'_>, names: &[Cow<'_, str>]) {
        // Encode scope start: B tag
        if !self.output.is_empty() {
            self.output.push(',');
        }
        self.output.push('B');

        // Flags
        let mut flags: u32 = 0;
        if scope.name.is_some() {
            flags |= 0x1;
        }
        if scope.kind.is_some() {
            flags |= 0x2;
        }
        if scope.is_stack_frame {
            flags |= 0x4;
        }
        self.output.push_str(&encode_vlq(flags as i64));

        // Line (relative)
        let line_delta = scope.start.line as i64 - self.prev_orig_line;
        self.output.push_str(&encode_vlq(line_delta));
        self.prev_orig_line = scope.start.line as i64;

        // Column (relative if same line, absolute if new line)
        if line_delta == 0 {
            let col_delta = scope.start.column as i64 - self.prev_orig_col;
            self.output.push_str(&encode_vlq(col_delta));
        } else {
            self.output.push_str(&encode_vlq(scope.start.column as i64));
        }
        self.prev_orig_col = scope.start.column as i64;

        // Name index (if present)
        if let Some(ref name) = scope.name {
            if let Some(idx) = names.iter().position(|n| n == name) {
                let name_delta = idx as i64 - self.prev_name_idx;
                self.output.push_str(&encode_vlq(name_delta));
                self.prev_name_idx = idx as i64;
            }
        }

        // Kind index (if present)
        if let Some(kind) = scope.kind {
            if let Some(idx) = names.iter().position(|n| n.as_ref() == kind.as_str()) {
                let kind_delta = idx as i64 - self.prev_name_idx;
                self.output.push_str(&encode_vlq(kind_delta));
                self.prev_name_idx = idx as i64;
            }
        }

        // Encode variables: D tag
        if !scope.variables.is_empty() {
            self.output.push(',');
            self.output.push('D');
            for var in &scope.variables {
                if let Some(idx) = names.iter().position(|n| n == var) {
                    let var_delta = idx as i64 - self.prev_name_idx;
                    self.output.push_str(&encode_vlq(var_delta));
                    self.prev_name_idx = idx as i64;
                }
            }
        }

        // Encode children recursively
        for child in &scope.children {
            self.encode_original_scope(child, names);
        }

        // Encode scope end: C tag
        self.output.push(',');
        self.output.push('C');

        // End line (relative)
        let end_line_delta = scope.end.line as i64 - self.prev_orig_line;
        self.output.push_str(&encode_vlq(end_line_delta));
        self.prev_orig_line = scope.end.line as i64;

        // End column (relative if same line, absolute if new line)
        if end_line_delta == 0 {
            let col_delta = scope.end.column as i64 - self.prev_orig_col;
            self.output.push_str(&encode_vlq(col_delta));
        } else {
            self.output.push_str(&encode_vlq(scope.end.column as i64));
        }
        self.prev_orig_col = scope.end.column as i64;
    }

    fn encode_generated_range(&mut self, range: &GeneratedRange<'_>, names: &[Cow<'_, str>]) {
        // Encode range start: E tag
        if !self.output.is_empty() {
            self.output.push(',');
        }
        self.output.push('E');

        // Flags
        let mut flags: u32 = 0;
        let line_delta = range.start.line as i64 - self.prev_gen_line;
        if line_delta != 0 {
            flags |= 0x1;
        }
        if range.original_scope.is_some() {
            flags |= 0x2;
        }
        if range.is_stack_frame {
            flags |= 0x4;
        }
        if range.is_hidden {
            flags |= 0x8;
        }
        self.output.push_str(&encode_vlq(flags as i64));

        // Line (if present in flags)
        if flags & 0x1 != 0 {
            self.output.push_str(&encode_vlq(line_delta));
            self.prev_gen_line = range.start.line as i64;
            // Column is absolute when line changes
            self.output.push_str(&encode_vlq(range.start.column as i64));
        } else {
            // Column is relative when on same line
            let col_delta = range.start.column as i64 - self.prev_gen_col;
            self.output.push_str(&encode_vlq(col_delta));
        }
        self.prev_gen_col = range.start.column as i64;

        // Definition index (if present)
        if let Some(def_idx) = range.original_scope {
            self.output.push_str(&encode_vlq(def_idx as i64));
        }

        // Encode callsite if present: I tag
        if let Some(callsite) = range.callsite {
            self.output.push(',');
            self.output.push('I');

            let source_delta = callsite.source_idx as i64 - self.prev_source_idx;
            self.output.push_str(&encode_vlq(source_delta));
            self.prev_source_idx = callsite.source_idx as i64;

            self.output.push_str(&encode_vlq(callsite.line as i64));
            self.output.push_str(&encode_vlq(callsite.column as i64));
        }

        // Encode bindings if present: G tag
        if !range.bindings.is_empty() {
            self.output.push(',');
            self.output.push('G');
            for binding in &range.bindings {
                match binding {
                    Some(expr) => {
                        if let Some(idx) = names.iter().position(|n| n == expr) {
                            let binding_delta = idx as i64 - self.prev_name_idx;
                            self.output.push_str(&encode_vlq(binding_delta));
                            self.prev_name_idx = idx as i64;
                        }
                    }
                    None => {
                        // Unavailable variable - encode as special marker
                        self.output.push_str(&encode_vlq(-1));
                    }
                }
            }
        }

        // Encode children recursively
        for child in &range.children {
            self.encode_generated_range(child, names);
        }

        // Encode range end: F tag
        self.output.push(',');
        self.output.push('F');

        // End line (relative, optional)
        let end_line_delta = range.end.line as i64 - self.prev_gen_line;
        if end_line_delta != 0 {
            self.output.push_str(&encode_vlq(end_line_delta));
            self.prev_gen_line = range.end.line as i64;
            // Column is absolute when line changes
            self.output.push_str(&encode_vlq(range.end.column as i64));
        } else {
            // Column is relative when on same line
            let col_delta = range.end.column as i64 - self.prev_gen_col;
            self.output.push_str(&encode_vlq(col_delta));
        }
        self.prev_gen_col = range.end.column as i64;
    }
}

/// Encodes an integer into VLQ base64 format.
fn encode_vlq(value: i64) -> String {
    const BASE64_CHARS: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    const VLQ_BASE_SHIFT: i64 = 5;
    const VLQ_BASE: i64 = 1 << VLQ_BASE_SHIFT;
    const VLQ_BASE_MASK: i64 = VLQ_BASE - 1;
    const VLQ_CONTINUATION_BIT: i64 = VLQ_BASE;

    let mut encoded = String::new();

    // Convert to VLQ signed representation
    let mut vlq = if value < 0 {
        ((-value) << 1) + 1
    } else {
        value << 1
    };

    loop {
        let mut digit = vlq & VLQ_BASE_MASK;
        vlq >>= VLQ_BASE_SHIFT;
        if vlq > 0 {
            digit |= VLQ_CONTINUATION_BIT;
        }
        encoded.push(BASE64_CHARS[digit as usize] as char);
        if vlq == 0 {
            break;
        }
    }

    encoded
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_encode_vlq() {
        // Test basic VLQ encoding
        assert_eq!(encode_vlq(0), "A");
        assert_eq!(encode_vlq(1), "C");
        assert_eq!(encode_vlq(-1), "D");
        assert_eq!(encode_vlq(15), "e");
        assert_eq!(encode_vlq(16), "gB");
    }

    #[test]
    fn test_scope_position() {
        let pos = ScopePosition::new(10, 5);
        assert_eq!(pos.line, 10);
        assert_eq!(pos.column, 5);
    }

    #[test]
    fn test_scope_kind() {
        assert_eq!(ScopeKind::Function.as_str(), "function");
        assert_eq!(ScopeKind::Block.as_str(), "block");
        assert_eq!(ScopeKind::Global.as_str(), "global");
    }

    #[test]
    fn test_scope_builder_basic() {
        let mut builder = ScopeBuilder::new();

        // Add a simple function scope
        builder.start_original_scope(
            0,
            ScopePosition::new(0, 0),
            Some("foo".into()),
            Some(ScopeKind::Function),
            true,
        );
        builder.add_variable("x".into());
        builder.add_variable("y".into());
        builder.end_original_scope(ScopePosition::new(10, 1));

        // Add a generated range
        builder.start_generated_range(ScopePosition::new(0, 0), true, false, Some(0), None);
        builder.add_binding(Some("a".into()));
        builder.add_binding(Some("b".into()));
        builder.end_generated_range(ScopePosition::new(5, 20));

        let scopes = builder.original_scopes();
        assert_eq!(scopes.len(), 1);
        assert_eq!(scopes[0].name.as_deref(), Some("foo"));
        assert_eq!(scopes[0].variables.len(), 2);

        let ranges = builder.generated_ranges();
        assert_eq!(ranges.len(), 1);
        assert_eq!(ranges[0].bindings.len(), 2);
    }

    #[test]
    fn test_encode_simple_scope() {
        let mut builder = ScopeBuilder::new();

        // Add names first
        builder.add_name("foo".into());
        builder.add_name("function".into());
        builder.add_name("x".into());

        // Create a simple scope
        builder.start_original_scope(
            0,
            ScopePosition::new(0, 0),
            Some("foo".into()),
            Some(ScopeKind::Function),
            true,
        );
        builder.add_variable("x".into());
        builder.end_original_scope(ScopePosition::new(5, 0));

        let encoded = builder.encode();
        // The encoded string should not be empty
        assert!(!encoded.is_empty());
        // Should contain B (scope start), D (variables), and C (scope end) tags
        assert!(encoded.contains('B'));
        assert!(encoded.contains('C'));
    }
}
