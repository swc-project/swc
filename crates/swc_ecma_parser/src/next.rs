//! OXC-style parser API used while the parser internals are migrated.
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
    input::StringInput,
    BytePos, Span, Spanned,
};
use swc_ecma_ast::{EsVersion, Module, Program, Script};

use crate::{
    error::{Error, SyntaxError},
    input::Tokens,
    lexer::{
        capturing::Capturing,
        comments_buffer::{BufferedCommentKind, CommentAttachment, CommentData},
        Lexer,
    },
    parser::{PResult, Parser as ParserEngine},
    EsSyntax, Syntax, TsSyntax,
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

/// Compact token kind returned by token-collecting parses.
pub use crate::lexer::Token as TokenKind;
/// Token emitted in source order when token collection is enabled.
///
/// The parser and public API share this representation so enabling token
/// collection does not require a second allocation and conversion pass.
pub use crate::lexer::TokenAndSpan as Token;

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
    comment_attachments: Vec<CommentAttachment>,
}

impl ParserReturn {
    /// Attach parser comments using positions recorded by the lexer.
    ///
    /// This consumes [`Self::comments`] without collecting or rescanning the
    /// complete token stream.
    #[doc(hidden)]
    pub fn attach_comments_to(&mut self, destination: &dyn Comments) {
        let comments = std::mem::take(&mut self.comments);
        let attachments = std::mem::take(&mut self.comment_attachments);
        debug_assert_eq!(comments.len(), attachments.len());

        for (comment, attachment) in comments.into_iter().zip(attachments) {
            match attachment.kind {
                BufferedCommentKind::Leading => {
                    destination.add_leading(attachment.pos, comment);
                }
                BufferedCommentKind::Trailing => {
                    destination.add_trailing(attachment.pos, comment);
                }
            }
        }
    }
}

/// OXC-style parser entry point.
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

        let syntax = self.syntax();
        let input = StringInput::new(self.source, self.start_pos, end_pos);
        let lexer = Lexer::new_with_comments(syntax, self.options.target, input);

        let (result, diagnostics, comment_data, tokens) = if self.collect_tokens {
            let lexer =
                Capturing::with_capacity(lexer, estimated_token_capacity(self.source.len()));
            let mut parser = ParserEngine::new_from(lexer);
            let result = parse_program(&mut parser, self.source_type.module_kind);
            let diagnostics = parser.take_errors();
            let comment_data = parser.input_mut().iter.take_comments();
            let tokens = parser.input_mut().iter.take();
            (result, diagnostics, comment_data, tokens)
        } else {
            let mut parser = ParserEngine::new_from(lexer);
            let result = parse_program(&mut parser, self.source_type.module_kind);
            let diagnostics = parser.take_errors();
            let comment_data = parser.input_mut().iter.take_comments();
            (result, diagnostics, comment_data, Vec::new())
        };

        finish_parse(
            result,
            diagnostics,
            comment_data,
            tokens,
            self.source_type.module_kind,
            Span::new_with_checked(self.start_pos, end_pos),
        )
    }

    fn syntax(&self) -> Syntax {
        match self.source_type.language {
            Language::JavaScript => Syntax::Es(EsSyntax {
                jsx: self.source_type.is_jsx(),
                fn_bind: self.options.function_bind,
                decorators: self.options.decorators,
                decorators_before_export: self.options.decorators_before_export,
                export_default_from: self.options.export_default_from,
                import_attributes: self.options.import_attributes,
                allow_super_outside_method: self.options.allow_super_outside_method,
                allow_return_outside_function: self.options.allow_return_outside_function,
                auto_accessors: self.options.auto_accessors,
                explicit_resource_management: self.options.explicit_resource_management,
            }),
            #[cfg(feature = "typescript")]
            Language::TypeScript | Language::TypeScriptDefinition => Syntax::Typescript(TsSyntax {
                tsx: self.source_type.is_jsx(),
                decorators: self.options.decorators,
                dts: matches!(self.source_type.language, Language::TypeScriptDefinition),
                no_early_errors: self.options.no_early_errors,
                disallow_ambiguous_jsx_like: self.options.disallow_ambiguous_jsx_like,
            }),
            #[cfg(feature = "flow")]
            Language::Flow => Syntax::Flow(crate::FlowSyntax {
                jsx: self.source_type.is_jsx(),
                all: self.options.flow.all,
                require_directive: self.options.flow.require_directive,
                enums: self.options.flow.enums,
                decorators: self.options.flow.decorators,
                components: self.options.flow.components,
                pattern_matching: self.options.flow.pattern_matching,
            }),
        }
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
            comment_attachments: Vec::new(),
        }
    }
}

fn parse_program<I: Tokens>(
    parser: &mut ParserEngine<I>,
    module_kind: ModuleKind,
) -> PResult<Program> {
    match module_kind {
        ModuleKind::Script => parser.parse_script().map(Program::Script),
        ModuleKind::Module => parser.parse_module().map(Program::Module),
        ModuleKind::Unambiguous => parser.parse_program(),
        ModuleKind::CommonJs => parser.parse_commonjs().map(Program::Script),
    }
}

fn finish_parse(
    result: PResult<Program>,
    mut diagnostics: Vec<Error>,
    comment_data: CommentData,
    tokens: Vec<Token>,
    module_kind: ModuleKind,
    span: Span,
) -> ParserReturn {
    let CommentData {
        comments,
        attachments: comment_attachments,
    } = comment_data;
    match result {
        Ok(program) => ParserReturn {
            program,
            diagnostics,
            comments,
            tokens,
            panicked: false,
            comment_attachments,
        },
        Err(error) => {
            diagnostics.push(error);
            ParserReturn {
                program: empty_program(module_kind, span),
                diagnostics,
                comments,
                tokens,
                panicked: true,
                comment_attachments,
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
        while token_index < tokens.len() && tokens[token_index].span.hi <= comment.span.lo {
            token_index += 1;
        }

        let previous = token_index.checked_sub(1).map(|index| tokens[index]);
        let next = tokens[token_index..]
            .iter()
            .copied()
            .find(|token| token.span.lo >= comment.span.hi);

        if let Some(previous) = previous {
            if !contains_line_break(source, start_pos, previous.span.hi, comment.span.lo) {
                destination.add_trailing(previous.span.hi, comment);
                continue;
            }
        }

        if let Some(next) = next {
            destination.add_leading(next.span.lo, comment);
        } else if let Some(previous) = previous {
            destination.add_trailing(previous.span.hi, comment);
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
