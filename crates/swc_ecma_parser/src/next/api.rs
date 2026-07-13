//! Public OXC-style parser API used while the parser internals are migrated.
//!
//! The API deliberately has a small surface: source classification and parser
//! options are supplied up front, and parsing returns the AST and all side
//! products together. This lets the lexer and parser share one cursor without
//! exposing their implementation details.
//!
//! The organization is derived from OXC `oxc_parser` at commit
//! `b6d2a29e47358a288dbfb2a635550243511ec497`. See `OXC_LICENSE` in this
//! crate for the upstream MIT license.

use swc_common::{
    comments::{Comment, Comments},
    BytePos, Span, Spanned,
};
use swc_ecma_ast::{EsVersion, Module, ModuleItem, Program, Script};

use super::{
    lexer::{
        config::{Config, NoTokens, WithTokens},
        core::{CommentKind as LexCommentKind, Lexer},
        PackedToken,
    },
    parser::{context::Context, cursor::Parser as ParserImpl},
};
use crate::{
    error::{Error, SyntaxError},
    Syntax,
};

/// Source language accepted by the parser.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Language {
    /// JavaScript or JSX.
    JavaScript,
    /// TypeScript or TSX.
    #[cfg(feature = "typescript")]
    TypeScript,
    /// TypeScript declaration source.
    #[cfg(feature = "typescript")]
    TypeScriptDefinition,
    /// Flow source.
    #[cfg(feature = "flow")]
    Flow,
}

/// Module interpretation for a source file.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum ModuleKind {
    /// ECMAScript script.
    Script,
    /// ECMAScript module.
    Module,
    /// Detect module syntax while parsing.
    Unambiguous,
    /// CommonJS source, which is parsed in a function-like context.
    CommonJs,
}

/// Optional language extension for the source.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum LanguageVariant {
    /// Standard source without JSX.
    Standard,
    /// JSX or TSX source.
    Jsx,
}

/// Complete source classification used by [`Parser`].
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct SourceType {
    language: Language,
    module_kind: ModuleKind,
    variant: LanguageVariant,
}

impl Default for SourceType {
    fn default() -> Self {
        Self::module()
    }
}

impl SourceType {
    /// JavaScript module source.
    pub const fn module() -> Self {
        Self {
            language: Language::JavaScript,
            module_kind: ModuleKind::Module,
            variant: LanguageVariant::Standard,
        }
    }

    /// JavaScript script source.
    pub const fn script() -> Self {
        Self {
            language: Language::JavaScript,
            module_kind: ModuleKind::Script,
            variant: LanguageVariant::Standard,
        }
    }

    /// JavaScript source whose module kind is detected while parsing.
    pub const fn unambiguous() -> Self {
        Self {
            language: Language::JavaScript,
            module_kind: ModuleKind::Unambiguous,
            variant: LanguageVariant::Standard,
        }
    }

    /// CommonJS source.
    pub const fn common_js() -> Self {
        Self {
            language: Language::JavaScript,
            module_kind: ModuleKind::CommonJs,
            variant: LanguageVariant::Standard,
        }
    }

    /// JavaScript module with JSX enabled.
    pub const fn jsx() -> Self {
        Self::module().with_jsx(true)
    }

    /// TypeScript source whose module kind is detected while parsing.
    #[cfg(feature = "typescript")]
    pub const fn typescript() -> Self {
        Self {
            language: Language::TypeScript,
            module_kind: ModuleKind::Unambiguous,
            variant: LanguageVariant::Standard,
        }
    }

    /// TypeScript source with JSX enabled.
    #[cfg(feature = "typescript")]
    pub const fn tsx() -> Self {
        Self::typescript().with_jsx(true)
    }

    /// TypeScript declaration source.
    #[cfg(feature = "typescript")]
    pub const fn type_definition() -> Self {
        Self {
            language: Language::TypeScriptDefinition,
            module_kind: ModuleKind::Module,
            variant: LanguageVariant::Standard,
        }
    }

    /// Flow source whose module kind is detected while parsing.
    #[cfg(feature = "flow")]
    pub const fn flow() -> Self {
        Self {
            language: Language::Flow,
            module_kind: ModuleKind::Unambiguous,
            variant: LanguageVariant::Standard,
        }
    }

    /// Return a copy with the requested module kind.
    #[must_use]
    pub const fn with_module_kind(mut self, module_kind: ModuleKind) -> Self {
        self.module_kind = module_kind;
        self
    }

    /// Return a copy with JSX enabled or disabled.
    #[must_use]
    pub const fn with_jsx(mut self, yes: bool) -> Self {
        self.variant = if yes {
            LanguageVariant::Jsx
        } else {
            LanguageVariant::Standard
        };
        self
    }

    /// Source language.
    pub const fn language(self) -> Language {
        self.language
    }

    /// Module interpretation.
    pub const fn module_kind(self) -> ModuleKind {
        self.module_kind
    }

    /// Whether JSX or TSX is enabled.
    pub const fn is_jsx(self) -> bool {
        matches!(self.variant, LanguageVariant::Jsx)
    }

    /// Convert the legacy configuration while workspace consumers migrate.
    #[doc(hidden)]
    pub fn from_legacy(
        syntax: Syntax,
        module_kind: ModuleKind,
        target: EsVersion,
    ) -> (Self, ParseOptions) {
        match syntax {
            Syntax::Es(syntax) => (
                Self {
                    language: Language::JavaScript,
                    module_kind,
                    variant: if syntax.jsx {
                        LanguageVariant::Jsx
                    } else {
                        LanguageVariant::Standard
                    },
                },
                ParseOptions {
                    target,
                    decorators: syntax.decorators,
                    decorators_before_export: syntax.decorators_before_export,
                    function_bind: syntax.fn_bind,
                    export_default_from: syntax.export_default_from,
                    import_attributes: syntax.import_attributes,
                    allow_super_outside_method: syntax.allow_super_outside_method,
                    allow_return_outside_function: syntax.allow_return_outside_function,
                    auto_accessors: syntax.auto_accessors,
                    explicit_resource_management: syntax.explicit_resource_management,
                    ..ParseOptions::default()
                },
            ),
            #[cfg(feature = "typescript")]
            Syntax::Typescript(syntax) => (
                Self {
                    language: if syntax.dts {
                        Language::TypeScriptDefinition
                    } else {
                        Language::TypeScript
                    },
                    module_kind,
                    variant: if syntax.tsx {
                        LanguageVariant::Jsx
                    } else {
                        LanguageVariant::Standard
                    },
                },
                ParseOptions {
                    target,
                    decorators: syntax.decorators,
                    no_early_errors: syntax.no_early_errors,
                    disallow_ambiguous_jsx_like: syntax.disallow_ambiguous_jsx_like,
                    ..ParseOptions::default()
                },
            ),
            #[cfg(feature = "flow")]
            Syntax::Flow(syntax) => (
                Self {
                    language: Language::Flow,
                    module_kind,
                    variant: if syntax.jsx {
                        LanguageVariant::Jsx
                    } else {
                        LanguageVariant::Standard
                    },
                },
                ParseOptions {
                    target,
                    flow: FlowOptions {
                        all: syntax.all,
                        require_directive: syntax.require_directive,
                        enums: syntax.enums,
                        decorators: syntax.decorators,
                        components: syntax.components,
                        pattern_matching: syntax.pattern_matching,
                    },
                    ..ParseOptions::default()
                },
            ),
        }
    }
}

/// Flow-specific parser switches.
#[derive(Debug, Default, Clone, Copy, PartialEq, Eq)]
pub struct FlowOptions {
    /// Parse all files as Flow without requiring a pragma.
    pub all: bool,
    /// Require a Flow pragma before enabling Flow types.
    pub require_directive: bool,
    /// Enable Flow enums.
    pub enums: bool,
    /// Enable Flow decorators.
    pub decorators: bool,
    /// Enable Flow component and hook syntax.
    pub components: bool,
    /// Enable Flow pattern matching syntax.
    pub pattern_matching: bool,
}

/// Parser behavior independent of source classification.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ParseOptions {
    /// ECMAScript target used for syntax validation.
    pub target: EsVersion,
    /// Enable decorators.
    pub decorators: bool,
    /// Allow decorators before exports.
    pub decorators_before_export: bool,
    /// Enable function-bind syntax.
    pub function_bind: bool,
    /// Enable export-default-from syntax.
    pub export_default_from: bool,
    /// Enable import attributes.
    pub import_attributes: bool,
    /// Allow `super` outside a method.
    pub allow_super_outside_method: bool,
    /// Allow top-level return statements.
    pub allow_return_outside_function: bool,
    /// Enable auto-accessors.
    pub auto_accessors: bool,
    /// Enable explicit resource management.
    pub explicit_resource_management: bool,
    /// Skip early errors where supported.
    pub no_early_errors: bool,
    /// Reject TypeScript syntax ambiguous with JSX.
    pub disallow_ambiguous_jsx_like: bool,
    /// Flow-specific switches.
    pub flow: FlowOptions,
}

impl Default for ParseOptions {
    fn default() -> Self {
        Self {
            target: EsVersion::latest(),
            decorators: false,
            decorators_before_export: false,
            function_bind: false,
            export_default_from: false,
            import_attributes: true,
            allow_super_outside_method: false,
            allow_return_outside_function: false,
            auto_accessors: false,
            explicit_resource_management: false,
            no_early_errors: false,
            disallow_ambiguous_jsx_like: false,
            flow: FlowOptions::default(),
        }
    }
}

/// One-byte token category used by [`Token`].
pub type TokenKind = super::lexer::TokenKind;

/// Packed token emitted in source order when collection is enabled.
pub type Token = PackedToken;

/// Result of parsing a source file.
pub struct ParserReturn {
    /// Parsed SWC AST. This is empty when parsing terminated fatally.
    pub program: Program,
    /// Recovered diagnostics followed by a fatal diagnostic, if any.
    pub diagnostics: Vec<Error>,
    /// Comments sorted by source position. Attachment compatibility is not
    /// guaranteed.
    pub comments: Vec<Comment>,
    /// Tokens in source order, populated only after [`Parser::with_tokens`].
    pub tokens: Vec<Token>,
    /// Whether parsing terminated on an unrecoverable error.
    pub panicked: bool,
}

/// OXC-style parser facade.
pub struct Parser<'a> {
    source: &'a str,
    source_type: SourceType,
    options: ParseOptions,
    start_pos: BytePos,
    collect_tokens: bool,
}

impl<'a> Parser<'a> {
    /// Create a parser for `source`.
    pub fn new(source: &'a str, source_type: SourceType) -> Self {
        Self {
            source,
            source_type,
            options: ParseOptions::default(),
            // BytePos(0) is reserved for synthesized nodes.
            start_pos: BytePos(1),
            collect_tokens: false,
        }
    }

    /// Replace parser options.
    #[must_use]
    pub fn with_options(mut self, options: ParseOptions) -> Self {
        self.options = options;
        self
    }

    /// Set the absolute byte position assigned to the first source byte.
    #[must_use]
    pub fn with_start_pos(mut self, start_pos: BytePos) -> Self {
        self.start_pos = start_pos;
        self
    }

    /// Collect tokens in [`ParserReturn`].
    #[must_use]
    pub fn with_tokens(mut self) -> Self {
        self.collect_tokens = true;
        self
    }

    /// Parse the complete source.
    pub fn parse(self) -> ParserReturn {
        let Some(source_len) = u32::try_from(self.source.len()).ok() else {
            return self.overlong_source();
        };
        let Some(end_pos) = self.start_pos.0.checked_add(source_len).map(BytePos) else {
            return self.overlong_source();
        };

        let context = self.context();
        let mut parsed = if self.collect_tokens {
            let lexer = Lexer::new(
                self.source,
                self.start_pos,
                WithTokens::with_capacity(estimated_token_capacity(self.source.len())),
            );
            let Some(lexer) = lexer else {
                return self.overlong_source();
            };
            finish_independent_parse(
                ParserImpl::new(lexer, context),
                self.source_type.module_kind,
                Span::new_with_checked(self.start_pos, end_pos),
                self.options.target,
            )
        } else {
            let Some(lexer) = Lexer::new(self.source, self.start_pos, NoTokens) else {
                return self.overlong_source();
            };
            finish_independent_parse(
                ParserImpl::new(lexer, context),
                self.source_type.module_kind,
                Span::new_with_checked(self.start_pos, end_pos),
                self.options.target,
            )
        };
        if context.contains(Context::MODULE) && self.source.trim_start().starts_with("<!--") {
            parsed.diagnostics.push(Error::new(
                Span::new_with_checked(self.start_pos, end_pos),
                SyntaxError::Unexpected {
                    got: "HTML comment".into(),
                    expected: "module source",
                },
            ));
        }
        if context.contains(Context::FLOW) && has_malformed_flow_comment_syntax(self.source) {
            parsed.diagnostics.push(Error::new(
                Span::new_with_checked(self.start_pos, end_pos),
                SyntaxError::Unexpected {
                    got: "malformed Flow comment syntax".into(),
                    expected: "complete Flow comment annotation",
                },
            ));
        }
        parsed
    }

    fn context(&self) -> Context {
        let mut context = Context::default();
        match self.source_type.language {
            Language::JavaScript => {}
            #[cfg(feature = "typescript")]
            Language::TypeScript | Language::TypeScriptDefinition => {
                context.insert(Context::TYPESCRIPT);
            }
            #[cfg(feature = "flow")]
            Language::Flow => {
                if !self.options.flow.require_directive || self.source.contains("@flow") {
                    context.insert(Context::TYPESCRIPT | Context::FLOW);
                    if self.options.flow.enums {
                        context.insert(Context::FLOW_ENUMS);
                    }
                    if self.options.flow.components {
                        context.insert(Context::FLOW_COMPONENTS);
                    }
                    if self.options.flow.pattern_matching {
                        context.insert(Context::FLOW_PATTERN_MATCHING);
                    }
                    if self.options.flow.decorators {
                        context.insert(Context::FLOW_DECORATORS);
                    }
                }
            }
        }
        if self.source_type.is_jsx() {
            context.insert(Context::TSX);
        }
        if self.options.disallow_ambiguous_jsx_like {
            context.insert(Context::DISALLOW_AMBIGUOUS_JSX_LIKE);
        }
        match self.source_type.module_kind {
            ModuleKind::Module | ModuleKind::Unambiguous => {
                context.insert(Context::MODULE | Context::AWAIT | Context::ALLOW_USING);
            }
            ModuleKind::CommonJs => {
                context.insert(Context::RETURN | Context::NEW_TARGET | Context::ALLOW_USING);
            }
            ModuleKind::Script => {}
        }
        context
    }

    #[cold]
    fn overlong_source(&self) -> ParserReturn {
        let span = Span::new_with_checked(self.start_pos, self.start_pos);
        ParserReturn {
            program: empty_program(self.source_type.module_kind, span),
            diagnostics: vec![Error::new(
                span,
                SyntaxError::Unexpected {
                    got: "source larger than the parser byte-position range".into(),
                    expected: "source shorter than 4 GiB",
                },
            )],
            comments: Vec::new(),
            tokens: Vec::new(),
            panicked: true,
        }
    }
}

fn has_malformed_flow_comment_syntax(source: &str) -> bool {
    let source = source.trim();
    if let Some(body) = source.strip_prefix("/*::") {
        let Some(body) = body.strip_suffix("*/") else {
            return true;
        };
        return body.contains("/*") && !body.contains("*-/");
    }
    if let Some(body) = source.strip_prefix("/*:") {
        let Some(body) = body.strip_suffix("*/") else {
            return true;
        };
        return body.trim().is_empty();
    }
    false
}

fn parse_independent_program<C: Config>(
    parser: &mut ParserImpl<'_, C>,
    module_kind: ModuleKind,
) -> Result<Program, Error> {
    match module_kind {
        ModuleKind::Script => parser.parse_script().map(Program::Script),
        ModuleKind::Module => parser.parse_module().map(Program::Module),
        ModuleKind::CommonJs => parser.parse_script().map(Program::Script),
        ModuleKind::Unambiguous => parser.parse_module().map(|module| {
            if module
                .body
                .iter()
                .any(|item| matches!(item, ModuleItem::ModuleDecl(_)))
                || parser.saw_top_level_await()
                || parser.saw_module_syntax()
            {
                Program::Module(module)
            } else {
                Program::Script(Script {
                    span: module.span,
                    body: module
                        .body
                        .into_iter()
                        .map(|item| match item {
                            ModuleItem::Stmt(statement) => statement,
                            ModuleItem::ModuleDecl(_) => unreachable!(),
                        })
                        .collect(),
                    shebang: module.shebang,
                })
            }
        }),
    }
}

fn finish_independent_parse<C: Config>(
    mut parser: ParserImpl<'_, C>,
    module_kind: ModuleKind,
    span: Span,
    target: EsVersion,
) -> ParserReturn {
    let result = parse_independent_program(&mut parser, module_kind);
    let mut diagnostics = parser.diagnostics().to_vec();
    diagnostics.extend_from_slice(parser.lexer_diagnostics());
    if module_kind == ModuleKind::Module {
        diagnostics.extend(
            parser
                .legacy_comments()
                .iter()
                .copied()
                .map(|span| Error::new(span, SyntaxError::LegacyCommentInModule)),
        );
    }
    if module_kind == ModuleKind::Module
        && target < EsVersion::Es2022
        && parser.saw_top_level_await()
    {
        diagnostics.push(Error::new(
            span,
            SyntaxError::Unexpected {
                got: "top-level await".into(),
                expected: "ES2022 or newer target",
            },
        ));
    }
    let comments = parser
        .comments()
        .iter()
        .copied()
        .map(|comment| Comment {
            kind: match comment.kind {
                LexCommentKind::Line => swc_common::comments::CommentKind::Line,
                LexCommentKind::Block => swc_common::comments::CommentKind::Block,
            },
            span: comment.span,
            text: parser.comment_text(comment).into(),
        })
        .collect();
    let tokens = parser.into_tokens();
    match result {
        Ok(program) => ParserReturn {
            program,
            diagnostics,
            comments,
            tokens,
            panicked: false,
        },
        Err(error) => {
            diagnostics.push(error);
            ParserReturn {
                program: empty_program(module_kind, span),
                diagnostics,
                comments,
                tokens,
                panicked: true,
            }
        }
    }
}

fn empty_program(module_kind: ModuleKind, span: Span) -> Program {
    match module_kind {
        ModuleKind::Module => Program::Module(Module {
            span,
            body: Vec::new(),
            shebang: None,
        }),
        ModuleKind::Script | ModuleKind::Unambiguous | ModuleKind::CommonJs => {
            Program::Script(Script {
                span,
                body: Vec::new(),
                shebang: None,
            })
        }
    }
}

#[inline]
fn estimated_token_capacity(source_len: usize) -> usize {
    // Real-world JS/TS averages several bytes per significant token. A
    // conservative divisor limits reallocations without retaining a buffer
    // proportional to source size for whitespace-heavy files.
    source_len / 6
}

/// Attach flat parser comments to SWC's legacy comment store.
///
/// A comment following a token on the same line is trailing. All other
/// comments are leading comments of the following token, or trailing comments
/// of the final token when no following token exists.
#[doc(hidden)]
pub fn attach_comments(
    source: &str,
    start_pos: BytePos,
    destination: &dyn Comments,
    comments: Vec<Comment>,
    tokens: &[Token],
    program: &Program,
) {
    let mut token_index = 0;
    for comment in comments {
        while token_index < tokens.len() && tokens[token_index].span().hi <= comment.span.lo {
            token_index += 1;
        }

        let previous = token_index.checked_sub(1).map(|index| tokens[index]);
        let next = tokens[token_index..]
            .iter()
            .copied()
            .find(|token| token.span().lo >= comment.span.hi);

        if let Some(previous) = previous {
            if !contains_line_break(source, start_pos, previous.span().hi, comment.span.lo) {
                destination.add_trailing(previous.span().hi, comment);
                continue;
            }
        }

        if let Some(next) = next {
            destination.add_leading(next.span().lo, comment);
        } else if let Some(previous) = previous {
            destination.add_trailing(previous.span().hi, comment);
        } else {
            destination.add_leading(program.span().lo, comment);
        }
    }
}

fn contains_line_break(source: &str, start_pos: BytePos, start: BytePos, end: BytePos) -> bool {
    debug_assert!(start_pos <= start && start <= end);
    let start = (start - start_pos).0 as usize;
    let end = (end - start_pos).0 as usize;
    source[start..end]
        .chars()
        .any(|character| matches!(character, '\n' | '\r' | '\u{2028}' | '\u{2029}'))
}
