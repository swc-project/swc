use swc_common::BytePos;

use self::{
    context::Context,
    lexer::{Lexer, Token},
};
use crate::diagnostics::Diagnostic;

mod context;
mod cursor;
pub mod lexer;
mod modifiers;

/// Maximum length of source which can be parsed (in bytes).
/// ~4 GiB on 64-bit systems, ~2 GiB on 32-bit systems.
// Length is constrained by 2 factors:
// 1. `Span`'s `start` and `end` are `u32`s, which limits length to `u32::MAX`
//    bytes.
// 2. Rust's allocator APIs limit allocations to `isize::MAX`.
// https://doc.rust-lang.org/std/alloc/struct.Layout.html#method.from_size_align
pub const MAX_LEN: usize = if std::mem::size_of::<usize>() >= 8 {
    // 64-bit systems
    u32::MAX as usize
} else {
    // 32-bit or 16-bit systems
    isize::MAX as usize
};

pub type Result<T> = std::result::Result<T, Diagnostic>;

/// Implementation of parser.
/// `Parser` is just a public wrapper, the guts of the implementation is in this
/// type.
struct ParserImpl<'a> {
    lexer: Lexer<'a>,

    /// SourceType: JavaScript or TypeScript, Script or Module, jsx support?
    source_type: SourceType,

    /// Source Code
    source_text: &'a str,

    /// All syntax errors from parser and lexer
    /// Note: favor adding to `Diagnostics` instead of raising Err
    errors: Vec<Diagnostic>,

    /// The current parsing token
    token: Token,

    /// The end range of the previous token
    prev_token_end: BytePos,

    /// Parser state
    state: ParserState<'a>,

    /// Parsing context
    ctx: Context,

    /// Ast builder for creating AST spans
    ast: AstBuilder<'a>,

    /// Emit `ParenthesizedExpression` in AST.
    /// Default: `true`
    preserve_parens: bool,
}

impl<'a> ParserImpl<'a> {
    /// Create a new `ParserImpl`.
    ///
    /// Requiring a `UniquePromise` to be provided guarantees only 1
    /// `ParserImpl` can exist on a single thread at one time.
    #[inline]
    pub fn new(
        allocator: &'a Allocator,
        source_text: &'a str,
        source_type: SourceType,
        options: ParserOptions,
        unique: UniquePromise,
    ) -> Self {
        Self {
            lexer: Lexer::new(allocator, source_text, source_type, unique),
            source_type,
            source_text,
            errors: vec![],
            token: Token::default(),
            prev_token_end: 0,
            state: ParserState::default(),
            ctx: Self::default_context(source_type, options),
            ast: AstBuilder::new(allocator),
            preserve_parens: options.preserve_parens,
        }
    }

    /// Main entry point
    ///
    /// Returns an empty `Program` on unrecoverable error,
    /// Recoverable errors are stored inside `errors`.
    #[inline]
    pub fn parse(mut self) -> ParserReturn<'a> {
        let (program, panicked) = match self.parse_program() {
            Ok(program) => (program, false),
            Err(error) => {
                self.error(
                    self.flow_error()
                        .unwrap_or_else(|| self.overlong_error().unwrap_or(error)),
                );
                let program = self.ast.program(
                    Span::default(),
                    self.source_type,
                    None,
                    self.ast.vec(),
                    self.ast.vec(),
                );
                (program, true)
            }
        };
        let errors = self.lexer.errors.into_iter().chain(self.errors).collect();
        let trivias = self.lexer.trivia_builder.build();
        ParserReturn {
            program,
            errors,
            trivias,
            panicked,
        }
    }

    pub fn parse_expression(mut self) -> std::result::Result<Expression<'a>, Vec<OxcDiagnostic>> {
        // initialize cur_token and prev_token by moving onto the first token
        self.bump_any();
        let expr = self.parse_expr().map_err(|diagnostic| vec![diagnostic])?;
        let errors = self
            .lexer
            .errors
            .into_iter()
            .chain(self.errors)
            .collect::<Vec<_>>();
        if !errors.is_empty() {
            return Err(errors);
        }
        Ok(expr)
    }

    #[allow(clippy::cast_possible_truncation)]
    fn parse_program(&mut self) -> Result<Program<'a>> {
        // initialize cur_token and prev_token by moving onto the first token
        self.bump_any();

        let hashbang = self.parse_hashbang();
        let (directives, statements) =
            self.parse_directives_and_statements(/* is_top_level */ true)?;

        let span = Span::new(0, self.source_text.len() as u32);
        Ok(self
            .ast
            .program(span, self.source_type, hashbang, directives, statements))
    }

    fn default_context(source_type: SourceType, options: ParserOptions) -> Context {
        let mut ctx = Context::default().and_ambient(source_type.is_typescript_definition());
        if source_type.module_kind() == ModuleKind::Module {
            // for [top-level-await](https://tc39.es/proposal-top-level-await/)
            ctx = ctx.and_await(true);
        }
        if options.allow_return_outside_function {
            ctx = ctx.and_return(true);
        }
        ctx
    }

    /// Check for Flow declaration if the file cannot be parsed.
    /// The declaration must be [on the first line before any code](https://flow.org/en/docs/usage/#toc-prepare-your-code-for-flow)
    fn flow_error(&self) -> Option<OxcDiagnostic> {
        if self.source_type.is_javascript()
            && (self.source_text.starts_with("// @flow")
                || self.source_text.starts_with("/* @flow */"))
        {
            return Some(diagnostics::flow(Span::new(0, 8)));
        }
        None
    }

    /// Check if source length exceeds MAX_LEN, if the file cannot be parsed.
    /// Original parsing error is not real - `Lexer::new` substituted "\0" as
    /// the source text.
    fn overlong_error(&self) -> Option<OxcDiagnostic> {
        if self.source_text.len() > MAX_LEN {
            return Some(diagnostics::overlong_source());
        }
        None
    }

    /// Return error info at current token
    /// # Panics
    ///   * The lexer did not push a diagnostic when `Kind::Undetermined` is
    ///     returned
    fn unexpected(&mut self) -> OxcDiagnostic {
        // The lexer should have reported a more meaningful diagnostic
        // when it is a undetermined kind.
        if self.cur_kind() == Kind::Undetermined {
            if let Some(error) = self.lexer.errors.pop() {
                return error;
            }
        }
        diagnostics::unexpected_token(self.cur_token().span())
    }

    /// Push a Syntax Error
    fn error(&mut self, error: OxcDiagnostic) {
        self.errors.push(error);
    }

    fn errors_count(&self) -> usize {
        self.errors.len() + self.lexer.errors.len()
    }

    fn ts_enabled(&self) -> bool {
        self.source_type.is_typescript()
    }
}

#[cfg(test)]
mod test {
    use std::path::Path;

    use oxc_ast::{ast::Expression, CommentKind};

    use super::*;

    #[test]
    fn parse_program_smoke_test() {
        let allocator = Allocator::default();
        let source_type = SourceType::default();
        let source = "";
        let ret = Parser::new(&allocator, source, source_type).parse();
        assert!(ret.program.is_empty());
        assert!(ret.errors.is_empty());
    }

    #[test]
    fn parse_expression_smoke_test() {
        let allocator = Allocator::default();
        let source_type = SourceType::default();
        let source = "a";
        let expr = Parser::new(&allocator, source, source_type)
            .parse_expression()
            .unwrap();
        assert!(matches!(expr, Expression::Identifier(_)));
    }

    #[test]
    fn flow_error() {
        let allocator = Allocator::default();
        let source_type = SourceType::default();
        let source = "// @flow\nasdf adsf";
        let ret = Parser::new(&allocator, source, source_type).parse();
        assert!(ret.program.is_empty());
        assert_eq!(
            ret.errors.first().unwrap().to_string(),
            "Flow is not supported"
        );

        let source = "/* @flow */\n asdf asdf";
        let ret = Parser::new(&allocator, source, source_type).parse();
        assert!(ret.program.is_empty());
        assert_eq!(
            ret.errors.first().unwrap().to_string(),
            "Flow is not supported"
        );
    }

    #[test]
    fn ts_module_declaration() {
        let allocator = Allocator::default();
        let source_type = SourceType::from_path(Path::new("module.ts")).unwrap();
        let source = "declare module 'test'\n";
        let ret = Parser::new(&allocator, source, source_type).parse();
        assert_eq!(ret.errors.len(), 0);
    }

    #[test]
    fn directives() {
        let allocator = Allocator::default();
        let source_type = SourceType::default();
        let sources = [
            ("import x from 'foo'; 'use strict';", 2),
            ("export {x} from 'foo'; 'use strict';", 2),
            (";'use strict';", 2),
        ];
        for (source, body_length) in sources {
            let ret = Parser::new(&allocator, source, source_type).parse();
            assert!(ret.program.directives.is_empty(), "{source}");
            assert_eq!(ret.program.body.len(), body_length, "{source}");
        }
    }

    #[test]
    fn comments() {
        let allocator = Allocator::default();
        let source_type = SourceType::default().with_typescript(true);
        let sources = [
            ("// line comment", CommentKind::SingleLine),
            ("/* line comment */", CommentKind::MultiLine),
            (
                "type Foo = ( /* Require properties which are not generated automatically. */ \
                 'bar')",
                CommentKind::MultiLine,
            ),
        ];
        for (source, kind) in sources {
            let ret = Parser::new(&allocator, source, source_type).parse();
            let comments = ret.trivias.comments().collect::<Vec<_>>();
            assert_eq!(comments.len(), 1, "{source}");
            assert_eq!(comments.first().unwrap().kind, kind, "{source}");
        }
    }

    #[test]
    fn memory_leak() {
        let allocator = Allocator::default();
        let source_type = SourceType::default();
        let sources = ["2n", ";'1234567890123456789012345678901234567890'"];
        for source in sources {
            let ret = Parser::new(&allocator, source, source_type).parse();
            assert!(!ret.program.body.is_empty());
        }
    }

    // Source with length MAX_LEN + 1 fails to parse.
    // Skip this test on 32-bit systems as impossible to allocate a string longer
    // than `isize::MAX`.
    #[cfg(target_pointer_width = "64")]
    #[test]
    fn overlong_source() {
        // Build string in 16 KiB chunks for speed
        let mut source = String::with_capacity(MAX_LEN + 1);
        let line = "var x = 123456;\n";
        let chunk = line.repeat(1024);
        while source.len() < MAX_LEN + 1 - chunk.len() {
            source.push_str(&chunk);
        }
        while source.len() < MAX_LEN + 1 - line.len() {
            source.push_str(line);
        }
        while source.len() < MAX_LEN + 1 {
            source.push('\n');
        }
        assert_eq!(source.len(), MAX_LEN + 1);

        let allocator = Allocator::default();
        let ret = Parser::new(&allocator, &source, SourceType::default()).parse();
        assert!(ret.program.is_empty());
        assert!(ret.panicked);
        assert_eq!(ret.errors.len(), 1);
        assert_eq!(
            ret.errors.first().unwrap().to_string(),
            "Source length exceeds 4 GiB limit"
        );
    }

    // Source with length MAX_LEN parses OK.
    // This test takes over 1 minute on an M1 Macbook Pro unless compiled in release
    // mode. `not(debug_assertions)` is a proxy for detecting release mode.
    #[cfg(not(debug_assertions))]
    #[test]
    fn legal_length_source() {
        // Build a string MAX_LEN bytes long which doesn't take too long to parse
        let head = "const x = 1;\n/*";
        let foot = "*/\nconst y = 2;\n";
        let mut source = "x".repeat(MAX_LEN);
        source.replace_range(..head.len(), head);
        source.replace_range(MAX_LEN - foot.len().., foot);
        assert_eq!(source.len(), MAX_LEN);

        let allocator = Allocator::default();
        let ret = Parser::new(&allocator, &source, SourceType::default()).parse();
        assert!(!ret.panicked);
        assert!(ret.errors.is_empty());
        assert_eq!(ret.program.body.len(), 2);
    }
}
