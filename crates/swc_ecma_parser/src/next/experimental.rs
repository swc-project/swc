//! Temporary entry point for parity testing the independent parser.

use swc_common::{
    comments::{Comment, CommentKind},
    BytePos, Span,
};
use swc_ecma_ast::{Module, Script};

use super::{
    lexer::{
        config::{NoTokens, WithTokens},
        core::{CommentKind as LexCommentKind, Lexer},
        PackedToken,
    },
    parser::{context::Context, cursor::Parser as ParserImpl},
};
use crate::error::{Error, SyntaxError};

/// Independent OXC-derived parser under development.
///
/// This type is exposed under `unstable::next` only while grammar production
/// parity is being established. It does not call the reference parser.
pub struct Parser<'a> {
    source: &'a str,
    start_pos: BytePos,
}

/// Side products returned by the independent token-collecting path.
pub struct ParserDetails {
    /// Parsed script.
    pub script: Script,
    /// Flat comments in source order.
    pub comments: Vec<Comment>,
    /// Packed tokens moved directly from the lexer.
    pub tokens: Vec<PackedToken>,
}

impl<'a> Parser<'a> {
    /// Create an independent parser for JavaScript source.
    pub fn new(source: &'a str) -> Self {
        Self {
            source,
            start_pos: BytePos(1),
        }
    }

    /// Set the absolute position of the first source byte.
    #[must_use]
    pub fn with_start_pos(mut self, start_pos: BytePos) -> Self {
        self.start_pos = start_pos;
        self
    }

    /// Parse a JavaScript script using only the new engine.
    pub fn parse_script(self) -> Result<Script, Error> {
        let lexer = Lexer::new(self.source, self.start_pos, NoTokens).ok_or_else(|| {
            Error::new(
                Span::new_with_checked(self.start_pos, self.start_pos),
                SyntaxError::Eof,
            )
        })?;
        let mut parser = ParserImpl::new(lexer, Context::default());
        parser.parse_script()
    }

    /// Parse a JavaScript module using only the new engine.
    pub fn parse_module(self) -> Result<Module, Error> {
        let lexer = Lexer::new(self.source, self.start_pos, NoTokens).ok_or_else(|| {
            Error::new(
                Span::new_with_checked(self.start_pos, self.start_pos),
                SyntaxError::Eof,
            )
        })?;
        let mut parser =
            ParserImpl::new(lexer, Context::default() | Context::MODULE | Context::AWAIT);
        parser.parse_module()
    }

    /// Parse a TypeScript script using only the new engine.
    #[cfg(feature = "typescript")]
    pub fn parse_typescript_script(self) -> Result<Script, Error> {
        let lexer = Lexer::new(self.source, self.start_pos, NoTokens).ok_or_else(|| {
            Error::new(
                Span::new_with_checked(self.start_pos, self.start_pos),
                SyntaxError::Eof,
            )
        })?;
        let mut parser = ParserImpl::new(lexer, Context::default() | Context::TYPESCRIPT);
        parser.parse_script()
    }

    /// Parse a TypeScript module using only the new engine.
    #[cfg(feature = "typescript")]
    pub fn parse_typescript_module(self) -> Result<Module, Error> {
        let lexer = Lexer::new(self.source, self.start_pos, NoTokens).ok_or_else(|| {
            Error::new(
                Span::new_with_checked(self.start_pos, self.start_pos),
                SyntaxError::Eof,
            )
        })?;
        let mut parser = ParserImpl::new(
            lexer,
            Context::default() | Context::TYPESCRIPT | Context::MODULE | Context::AWAIT,
        );
        parser.parse_module()
    }

    /// Parse a TSX script using only the new engine.
    #[cfg(feature = "typescript")]
    pub fn parse_typescript_tsx_script(self) -> Result<Script, Error> {
        let lexer = Lexer::new(self.source, self.start_pos, NoTokens).ok_or_else(|| {
            Error::new(
                Span::new_with_checked(self.start_pos, self.start_pos),
                SyntaxError::Eof,
            )
        })?;
        let mut parser = ParserImpl::new(
            lexer,
            Context::default() | Context::TYPESCRIPT | Context::TSX,
        );
        parser.parse_script()
    }

    /// Parse a TSX module using only the new engine.
    #[cfg(feature = "typescript")]
    pub fn parse_typescript_tsx_module(self) -> Result<Module, Error> {
        let lexer = Lexer::new(self.source, self.start_pos, NoTokens).ok_or_else(|| {
            Error::new(
                Span::new_with_checked(self.start_pos, self.start_pos),
                SyntaxError::Eof,
            )
        })?;
        let mut parser = ParserImpl::new(
            lexer,
            Context::default()
                | Context::TYPESCRIPT
                | Context::TSX
                | Context::MODULE
                | Context::AWAIT,
        );
        parser.parse_module()
    }

    /// Parse Flow syntax with the independent cursor. Flow shares the common
    /// typed grammar core with TypeScript and adds its own productions on top.
    #[cfg(feature = "flow")]
    pub fn parse_flow_script(self, jsx: bool) -> Result<Script, Error> {
        let lexer = Lexer::new(self.source, self.start_pos, NoTokens).ok_or_else(|| {
            Error::new(
                Span::new_with_checked(self.start_pos, self.start_pos),
                SyntaxError::Eof,
            )
        })?;
        let mut context = Context::default() | Context::TYPESCRIPT | Context::FLOW;
        if jsx {
            context.insert(Context::TSX);
        }
        let mut parser = ParserImpl::new(lexer, context);
        parser.parse_script()
    }

    /// Parse a Flow module with the independent cursor.
    #[cfg(feature = "flow")]
    pub fn parse_flow_module(self, jsx: bool) -> Result<Module, Error> {
        let lexer = Lexer::new(self.source, self.start_pos, NoTokens).ok_or_else(|| {
            Error::new(
                Span::new_with_checked(self.start_pos, self.start_pos),
                SyntaxError::Eof,
            )
        })?;
        let mut context = Context::default()
            | Context::TYPESCRIPT
            | Context::FLOW
            | Context::MODULE
            | Context::AWAIT;
        if jsx {
            context.insert(Context::TSX);
        }
        let mut parser = ParserImpl::new(lexer, context);
        parser.parse_module()
    }

    /// Parse a script with statically enabled packed-token collection.
    pub fn parse_script_with_tokens(self) -> Result<ParserDetails, Error> {
        let lexer = Lexer::new(
            self.source,
            self.start_pos,
            WithTokens::with_capacity(self.source.len() / 6),
        )
        .ok_or_else(|| {
            Error::new(
                Span::new_with_checked(self.start_pos, self.start_pos),
                SyntaxError::Eof,
            )
        })?;
        let mut parser = ParserImpl::new(lexer, Context::default());
        let script = parser.parse_script()?;
        let comments = parser
            .comments()
            .iter()
            .copied()
            .map(|comment| Comment {
                kind: match comment.kind {
                    LexCommentKind::Line => CommentKind::Line,
                    LexCommentKind::Block => CommentKind::Block,
                },
                span: comment.span,
                text: parser.comment_text(comment).into(),
            })
            .collect();
        let tokens = parser.into_tokens();
        Ok(ParserDetails {
            script,
            comments,
            tokens,
        })
    }
}

#[cfg(test)]
mod tests {
    use std::fmt::Write;

    use serde::Serialize;
    use serde_json::Value;
    use swc_common::{BytePos, EqIgnoreSpan};
    use swc_ecma_ast::{Decl, Stmt};

    use super::Parser;
    #[cfg(feature = "typescript")]
    use crate::TsSyntax;
    use crate::{lexer::Lexer, EsSyntax, LegacyParser, StringInput, Syntax};

    fn assert_script_parity(source: &str) {
        let next = Parser::new(source).parse_script().unwrap_or_else(|error| {
            panic!(
                "independent parser failed with {error:?} for source starting with {:?}",
                source.get(..source.len().min(120)).unwrap_or(source)
            )
        });
        let start = BytePos(1);
        let end = start + BytePos(source.len() as u32);
        let lexer = Lexer::new(
            Syntax::Es(EsSyntax {
                jsx: true,
                ..EsSyntax::default()
            }),
            Default::default(),
            StringInput::new(source, start, end),
            None,
        );
        let mut legacy = LegacyParser::new_from(lexer);
        let legacy = legacy.parse_script().unwrap();
        let difference = if next.eq_ignore_span(&legacy) {
            None
        } else {
            first_ast_difference(&next, &legacy)
        };
        assert!(
            difference.is_none(),
            "independent AST differs from reference AST at {} for source starting with {:?}",
            difference.unwrap_or_default(),
            source.get(..source.len().min(120)).unwrap_or(source),
        );
    }

    fn first_ast_difference<T: Serialize>(left: &T, right: &T) -> Option<String> {
        let mut left = serde_json::to_value(left).expect("AST must serialize");
        let mut right = serde_json::to_value(right).expect("AST must serialize");
        remove_ast_metadata(&mut left);
        remove_ast_metadata(&mut right);
        first_value_difference(&left, &right, "$".into())
    }

    fn remove_ast_metadata(value: &mut Value) {
        match value {
            Value::Array(values) => values.iter_mut().for_each(remove_ast_metadata),
            Value::Object(values) => {
                values.remove("span");
                values.remove("ctxt");
                values.values_mut().for_each(remove_ast_metadata);
            }
            _ => {}
        }
    }

    fn first_value_difference(left: &Value, right: &Value, path: String) -> Option<String> {
        match (left, right) {
            (Value::Array(left), Value::Array(right)) => {
                if left.len() != right.len() {
                    return Some(format!("{path}.len ({} != {})", left.len(), right.len()));
                }
                left.iter()
                    .zip(right)
                    .enumerate()
                    .find_map(|(index, (left, right))| {
                        first_value_difference(left, right, format!("{path}[{index}]"))
                    })
            }
            (Value::Object(left), Value::Object(right)) => {
                for (key, left) in left {
                    let Some(right) = right.get(key) else {
                        return Some(format!("{path}.{key} missing on right"));
                    };
                    if let Some(difference) =
                        first_value_difference(left, right, format!("{path}.{key}"))
                    {
                        return Some(difference);
                    }
                }
                right
                    .keys()
                    .find(|key| !left.contains_key(*key))
                    .map(|key| {
                        format!(
                            "{path}.{key} missing on left (left={}; right={})",
                            Value::Object(left.clone()),
                            Value::Object(right.clone())
                        )
                    })
            }
            _ if left == right => None,
            _ => {
                let mut difference = path;
                let _ = write!(difference, " ({left} != {right})");
                Some(difference)
            }
        }
    }

    #[cfg(feature = "typescript")]
    fn assert_typescript_script_parity(source: &str) {
        let next = Parser::new(source).parse_typescript_script().unwrap();
        let start = BytePos(1);
        let end = start + BytePos(source.len() as u32);
        let lexer = Lexer::new(
            Syntax::Typescript(TsSyntax::default()),
            Default::default(),
            StringInput::new(source, start, end),
            None,
        );
        let mut legacy = LegacyParser::new_from(lexer);
        let legacy = legacy.parse_script().unwrap();
        assert!(
            next.eq_ignore_span(&legacy),
            "independent TypeScript AST differs from reference AST for {source}"
        );
    }

    fn assert_module_parity(source: &str) {
        let next = Parser::new(source).parse_module().unwrap_or_else(|error| {
            panic!(
                "independent module parser failed with {error:?} for source starting with {:?}",
                source.get(..source.len().min(120)).unwrap_or(source)
            )
        });
        let start = BytePos(1);
        let end = start + BytePos(source.len() as u32);
        let lexer = Lexer::new(
            Syntax::Es(EsSyntax {
                jsx: true,
                ..EsSyntax::default()
            }),
            Default::default(),
            StringInput::new(source, start, end),
            None,
        );
        let mut legacy = LegacyParser::new_from(lexer);
        let legacy = legacy.parse_module().unwrap();
        let difference = if next.eq_ignore_span(&legacy) {
            None
        } else {
            first_ast_difference(&next, &legacy)
        };
        assert!(
            difference.is_none(),
            "independent module AST differs from reference AST at {} for source starting with {:?}",
            difference.unwrap_or_default(),
            source.get(..source.len().min(120)).unwrap_or(source),
        );
    }

    #[test]
    fn parses_without_reference_engine() {
        let script = Parser::new("const answer = 40 + 2;")
            .with_start_pos(BytePos(17))
            .parse_script()
            .unwrap();

        assert_eq!(script.span.lo, BytePos(17));
        assert!(matches!(script.body[0], Stmt::Decl(Decl::Var(_))));
    }

    #[test]
    fn parses_module_without_reference_engine() {
        let module = Parser::new("export const answer = 42;")
            .parse_module()
            .unwrap();
        assert!(module.body[0].is_module_decl());
    }

    #[test]
    fn supported_javascript_ast_matches_reference_engine() {
        assert_script_parity(
            "const { value: [first = 1, ...rest] } = source; function* values(input) { yield* \
             input; }",
        );
        assert_script_parity(
            "class Counter extends Base { static initial = 1; constructor(value) { this.value = \
             value; } get current() { return this.value; } }",
        );
        assert_script_parity(
            "const object = { plain, 'string': 2, 3: value, 4n: bigint, [key]: computed, \
             method(value = 1, ...rest) { return value; }, *iterate() { yield 1; }, async load() \
             { return await task; }, async *stream() { yield await task; }, get value() { return \
             this._value; }, set value(next) { this._value = next; } };",
        );
        assert_script_parity(
            "const first = source?.value.deep?.[key]?.(argument).tail; const second = \
             callback?.(); const third = source?.method();",
        );
        assert_script_parity(
            "const load = async source => await source.read(); const combine = async (left, right \
             = 1) => { return await left + right; };",
        );
    }

    #[test]
    fn benchmark_javascript_ast_matches_reference_engine() {
        for source in [
            include_str!("../../benches/files/colors.js"),
            include_str!("../../benches/files/angular-1.2.5.js"),
            include_str!("../../benches/files/backbone-1.1.0.js"),
            include_str!("../../benches/files/jquery-1.9.1.js"),
            include_str!("../../benches/files/jquery.mobile-1.4.2.js"),
            include_str!("../../benches/files/mootools-1.4.5.js"),
            include_str!("../../benches/files/underscore-1.5.2.js"),
            include_str!("../../benches/files/three-0.138.3.js"),
            include_str!("../../benches/files/yui-3.12.0.js"),
        ] {
            assert_script_parity(source);
        }
        assert_module_parity(include_str!(
            "../../../swc/tests/tsc-references/fixSignatureCaching.2.minified.js"
        ));
    }

    #[test]
    fn supported_jsx_ast_matches_reference_engine() {
        assert_script_parity(
            "const view = <App enabled value={answer}><Child /> text {item}</App>;",
        );
    }

    #[test]
    #[cfg(feature = "typescript")]
    fn supported_typescript_ast_matches_reference_engine() {
        assert_typescript_script_parity(
            "type Primitive = string | number; type Values = Primitive[] | null; type Nested = \
             Promise<Result<string | 1>>; type Flag = true | false; type Both = Left & Right; \
             const value: Primitive = source; let values: Array<number>; const { item }: Result = \
             input;",
        );
        assert_typescript_script_parity(
            "function convert(value: string | number): Result<string> { return value; } const map \
             = (value: Input): Output => value; const load = async (source: Source): \
             Promise<Result> => await source.read();",
        );
        assert_typescript_script_parity(
            "const first = input as Result<string>; const second = { value: 1 } satisfies Shape; \
             const third = value as const; const fourth = left + right as number;",
        );
        assert_typescript_script_parity(
            "type Result<out T extends Value, E = Error> = Success<T> | Failure<E>; type \
             Pair<const T, in U> = Container<T, U>;",
        );
        assert_typescript_script_parity(
            "enum Direction { Up, Down = 2, Label = 'label', Computed = base + 1 } const enum \
             State { Ready = 1, Done }",
        );
        assert_typescript_script_parity(
            "interface Box<T> { readonly value: T; label?: string; nested: Result<T>; } type \
             Point = { x: number; y?: number; 'name': string };",
        );
    }

    #[test]
    fn moves_packed_tokens_and_materializes_comments_on_demand() {
        let result = Parser::new("// first\nconst value = 1; /* last */")
            .parse_script_with_tokens()
            .unwrap();
        assert!(!result.tokens.is_empty());
        assert_eq!(result.comments.len(), 2);
        assert_eq!(result.comments[0].text, " first");
        assert_eq!(result.comments[1].text, " last ");
    }
}
