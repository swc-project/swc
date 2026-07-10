#![cfg(feature = "suite-codegen")]

//! Code generation, fixer, and source-map conformance pipelines.

use std::{
    panic::{catch_unwind, AssertUnwindSafe},
    path::Path,
};

use rayon::prelude::*;
use sha2::{Digest, Sha256};
use swc_common::{
    source_map::SourceMapGenConfig, sync::Lrc, FileName, Globals, SourceMap, GLOBALS,
};
use swc_ecma_ast::{
    BigInt, ClassMember, EsVersion, Expr, NewExpr, Number, ParenExpr, Pat, Program, PropName,
    SeqExpr, SimpleAssignTarget, Str,
};
use swc_ecma_codegen::{
    text_writer::{omit_trailing_semi, JsWriter, WriteJs},
    Config, Emitter,
};
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput};
use swc_ecma_transforms_base::fixer::fixer;
use swc_ecma_utils::DropSpan;
use swc_ecma_visit::{Fold, FoldWith, VisitMutWith};
use swc_sourcemap::{RawToken, SourceMap as DecodedSourceMap};

#[cfg(feature = "suite-runtime")]
use crate::model::{HarnessMode, Metadata};
use crate::{
    model::{Failure, FailureKind, ParseGoal, Pipeline, Strictness, Suite, TestCase, TestVariant},
    syntax,
};

/// Runs either the code-generation or source-map suite.
///
/// Both suites share parsing and fixer behavior, but are kept as separate
/// entry points at the dispatch boundary so their totals and baselines remain
/// independent.
pub fn run(cases: &[&TestCase], suite: Suite) -> Vec<Failure> {
    let mut failures = match suite {
        Suite::Codegen => cases
            .par_iter()
            .flat_map_iter(|case| run_case(case, Suite::Codegen))
            .collect::<Vec<_>>(),
        Suite::SourceMap => cases
            .par_iter()
            .flat_map_iter(|case| run_case(case, Suite::SourceMap))
            .collect::<Vec<_>>(),
        _ => panic!("codegen suite cannot run `{suite}`"),
    };

    failures.sort_by(|left, right| left.comparison_key().cmp(&right.comparison_key()));
    failures
}

/// Parses, fixes, and emits one already-materialized runtime variant.
///
/// Runtime owns strict-mode injection and module-graph construction. Accepting
/// final source here ensures every module in that graph uses the same codegen
/// pipeline as the conformance suite.
#[cfg(feature = "suite-runtime")]
pub(crate) fn emit_for_runtime(
    path: &str,
    source: String,
    goal: ParseGoal,
    metadata: &Metadata,
) -> Result<String, String> {
    if GLOBALS.is_set() {
        return emit_for_runtime_inner(path, source, goal, metadata);
    }

    GLOBALS.set(&Globals::new(), || {
        emit_for_runtime_inner(path, source, goal, metadata)
    })
}

#[cfg(feature = "suite-runtime")]
fn emit_for_runtime_inner(
    path: &str,
    source: String,
    goal: ParseGoal,
    metadata: &Metadata,
) -> Result<String, String> {
    let case = TestCase {
        path: path.into(),
        code: source.clone(),
        metadata: metadata.clone(),
    };
    let variant = TestVariant {
        goal,
        strictness: if goal == ParseGoal::Module {
            Strictness::Inherent
        } else {
            Strictness::Unmodified
        },
        harness: HarnessMode::Raw,
    };
    let cm: Lrc<SourceMap> = Default::default();
    let mut program = parse_program(&cm, &case.path, source, &case, variant)?;
    program.mutate(fixer(None));
    emit_program(&program, cm, false, false).map(|emitted| emitted.code)
}

fn run_case(case: &TestCase, suite: Suite) -> Vec<Failure> {
    if case
        .metadata
        .negative
        .as_ref()
        .is_some_and(|negative| negative.phase.expects_parse_error())
    {
        return Vec::new();
    }

    case.variants()
        .into_iter()
        .flat_map(|variant| run_variant(case, variant, suite))
        .collect()
}

fn run_variant(case: &TestCase, variant: TestVariant, suite: Suite) -> Vec<Failure> {
    let result = catch_unwind(AssertUnwindSafe(|| {
        GLOBALS.set(&Globals::new(), || match suite {
            Suite::Codegen => run_codegen_variant(case, variant),
            Suite::SourceMap => run_source_map_variant(case, variant),
            _ => unreachable!(),
        })
    }));

    match result {
        Ok(failures) => failures,
        Err(payload) => {
            let summary = panic_message(payload);
            match suite {
                Suite::Codegen => [Pipeline::Codegen, Pipeline::CodegenMinified]
                    .into_iter()
                    .map(|pipeline| {
                        failure(
                            case,
                            variant,
                            suite,
                            pipeline,
                            FailureKind::Panic,
                            summary.clone(),
                        )
                    })
                    .collect(),
                Suite::SourceMap => [Pipeline::SourceMap, Pipeline::SourceMapMinified]
                    .into_iter()
                    .map(|pipeline| {
                        failure(
                            case,
                            variant,
                            suite,
                            pipeline,
                            FailureKind::Panic,
                            summary.clone(),
                        )
                    })
                    .collect(),
                _ => unreachable!(),
            }
        }
    }
}

fn run_codegen_variant(case: &TestCase, variant: TestVariant) -> Vec<Failure> {
    let source = source_for_variant(case, variant);
    let cm: Lrc<SourceMap> = Default::default();
    let mut program = match parse_program(&cm, &case.path, source.clone(), case, variant) {
        Ok(program) => program,
        Err(summary) => {
            return vec![
                failure(
                    case,
                    variant,
                    Suite::Codegen,
                    Pipeline::Codegen,
                    FailureKind::UnexpectedParseError,
                    summary.clone(),
                ),
                failure(
                    case,
                    variant,
                    Suite::Codegen,
                    Pipeline::CodegenMinified,
                    FailureKind::UnexpectedParseError,
                    summary,
                ),
            ];
        }
    };
    program.mutate(fixer(None));

    [
        (Pipeline::Codegen, false),
        (Pipeline::CodegenMinified, true),
    ]
    .into_iter()
    .filter_map(|(pipeline, minify)| {
        run_pipeline_catching_panics(case, variant, Suite::Codegen, pipeline, || {
            check_codegen_pipeline(case, variant, &program, cm.clone(), minify)
        })
    })
    .collect()
}

fn check_codegen_pipeline(
    case: &TestCase,
    variant: TestVariant,
    program: &Program,
    cm: Lrc<SourceMap>,
    minify: bool,
) -> Result<(), (FailureKind, String)> {
    let first = emit_program(program, cm, minify, false)
        .map_err(|summary| (FailureKind::OutputMismatch, summary))?
        .code;

    let reparsed_cm: Lrc<SourceMap> = Default::default();
    let mut reparsed = parse_program(&reparsed_cm, &case.path, first.clone(), case, variant)
        .map_err(|summary| (FailureKind::UnexpectedParseError, summary))?;
    reparsed.mutate(fixer(None));

    let expected = normalize_program(program.clone());
    let actual = normalize_program(reparsed.clone());
    if expected != actual {
        return Err((
            FailureKind::AstMismatch,
            ast_mismatch_diagnostic(&expected, &actual)
                .map_err(|summary| (FailureKind::AstSerialization, summary))?,
        ));
    }

    let second = emit_program(&reparsed, reparsed_cm, minify, false)
        .map_err(|summary| (FailureKind::OutputMismatch, summary))?
        .code;
    if first != second {
        return Err((
            FailureKind::OutputMismatch,
            format!("code generation is not idempotent\nfirst:\n{first}\nsecond:\n{second}"),
        ));
    }

    Ok(())
}

fn run_source_map_variant(case: &TestCase, variant: TestVariant) -> Vec<Failure> {
    let source = source_for_variant(case, variant);
    let cm: Lrc<SourceMap> = Default::default();
    let mut program = match parse_program(&cm, &case.path, source.clone(), case, variant) {
        Ok(program) => program,
        Err(summary) => {
            return [Pipeline::SourceMap, Pipeline::SourceMapMinified]
                .into_iter()
                .map(|pipeline| {
                    failure(
                        case,
                        variant,
                        Suite::SourceMap,
                        pipeline,
                        FailureKind::UnexpectedParseError,
                        summary.clone(),
                    )
                })
                .collect();
        }
    };
    program.mutate(fixer(None));

    [
        (Pipeline::SourceMap, false),
        (Pipeline::SourceMapMinified, true),
    ]
    .into_iter()
    .filter_map(|(pipeline, minify)| {
        run_pipeline_catching_panics(case, variant, Suite::SourceMap, pipeline, || {
            emit_program(&program, cm.clone(), minify, true)
                .map_err(|summary| (FailureKind::SourceMapMismatch, summary))
                .and_then(|emitted| {
                    let source_map =
                        cm.build_source_map(&emitted.mappings, None, InlineSourceMapConfig);
                    validate_source_map(&source_map, &emitted.code, &source)
                })
        })
    })
    .collect()
}

fn run_pipeline_catching_panics<F>(
    case: &TestCase,
    variant: TestVariant,
    suite: Suite,
    pipeline: Pipeline,
    operation: F,
) -> Option<Failure>
where
    F: FnOnce() -> Result<(), (FailureKind, String)>,
{
    match catch_unwind(AssertUnwindSafe(operation)) {
        Ok(Ok(())) => None,
        Ok(Err((kind, summary))) => Some(failure(case, variant, suite, pipeline, kind, summary)),
        Err(payload) => Some(failure(
            case,
            variant,
            suite,
            pipeline,
            FailureKind::Panic,
            panic_message(payload),
        )),
    }
}

fn ast_mismatch_diagnostic(expected: &Program, actual: &Program) -> Result<String, String> {
    let expected = serde_json::to_string(expected)
        .map_err(|error| format!("failed to serialize expected normalized AST: {error}"))?;
    let actual = serde_json::to_string(actual)
        .map_err(|error| format!("failed to serialize actual normalized AST: {error}"))?;
    let offset = expected
        .bytes()
        .zip(actual.bytes())
        .position(|(expected, actual)| expected != actual)
        .unwrap_or_else(|| expected.len().min(actual.len()));

    Ok(format!(
        "AST changed after fixer, code generation, and reparse\nexpected-sha256: \
         {}\nactual-sha256: {}\nfirst-difference-byte: {offset}\nexpected-context: \
         {:?}\nactual-context: {:?}",
        sha256(&expected),
        sha256(&actual),
        context_around(&expected, offset),
        context_around(&actual, offset),
    ))
}

fn sha256(value: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(value.as_bytes());
    format!("{:x}", hasher.finalize())
}

fn context_around(value: &str, offset: usize) -> &str {
    const RADIUS: usize = 120;

    let mut start = offset.saturating_sub(RADIUS).min(value.len());
    while !value.is_char_boundary(start) {
        start += 1;
    }
    let mut end = offset.saturating_add(RADIUS).min(value.len());
    while !value.is_char_boundary(end) {
        end -= 1;
    }
    &value[start..end]
}

fn source_for_variant(case: &TestCase, variant: TestVariant) -> String {
    if variant.strictness == Strictness::Strict {
        format!("\"use strict\";\n{}", case.code)
    } else {
        case.code.clone()
    }
}

fn parse_program(
    cm: &Lrc<SourceMap>,
    path: &Path,
    source: String,
    case: &TestCase,
    variant: TestVariant,
) -> Result<Program, String> {
    let fm = cm.new_source_file(FileName::Custom(path.display().to_string()).into(), source);
    let lexer = Lexer::new(
        syntax::for_metadata(&case.metadata),
        EsVersion::latest(),
        StringInput::from(&*fm),
        None,
    );
    let mut parser = Parser::new_from(lexer);
    let parsed = match variant.goal {
        ParseGoal::Script => parser.parse_script().map(Program::Script),
        ParseGoal::Module => parser.parse_module().map(Program::Module),
    };
    let recovered = parser.take_errors();

    match parsed {
        Ok(program) if recovered.is_empty() => Ok(program),
        Ok(_) => Err(recovered
            .into_iter()
            .map(|error| format!("{error:?}"))
            .collect::<Vec<_>>()
            .join("\n")),
        Err(error) => {
            let mut diagnostics = vec![format!("{error:?}")];
            diagnostics.extend(recovered.into_iter().map(|error| format!("{error:?}")));
            Err(diagnostics.join("\n"))
        }
    }
}

struct Emitted {
    code: String,
    mappings: Vec<(swc_common::BytePos, swc_common::LineCol)>,
}

fn emit_program(
    program: &Program,
    cm: Lrc<SourceMap>,
    minify: bool,
    source_map: bool,
) -> Result<Emitted, String> {
    let mut code = Vec::new();
    let mut mappings = Vec::new();
    {
        let writer = JsWriter::new(
            cm.clone(),
            "\n",
            &mut code,
            source_map.then_some(&mut mappings),
        );
        let writer: Box<dyn WriteJs> = if minify {
            Box::new(omit_trailing_semi(writer))
        } else {
            Box::new(writer)
        };
        let config = Config::default()
            .with_target(EsVersion::latest())
            .with_minify(minify);
        let mut emitter = Emitter {
            cfg: config,
            cm,
            comments: None,
            wr: writer,
        };
        emitter
            .emit_program(program)
            .map_err(|error| format!("code generation failed: {error}"))?;
    }

    let code = String::from_utf8(code)
        .map_err(|error| format!("code generator emitted invalid UTF-8: {error}"))?;
    Ok(Emitted { code, mappings })
}

/// Canonicalizes only representation details that code generation does not
/// promise to preserve. Every rule is exercised by the tests below.
fn normalize_program(mut program: Program) -> Program {
    program = program.fold_with(&mut AstNormalizer);
    program.visit_mut_with(&mut DropSpan);
    program
}

struct AstNormalizer;

impl Fold for AstNormalizer {
    fn fold_class_members(&mut self, members: Vec<ClassMember>) -> Vec<ClassMember> {
        let mut members = members.fold_children_with(self);
        // Empty class elements are semicolon separators and have no runtime
        // meaning. The emitter is free to omit them.
        members.retain(|member| !matches!(member, ClassMember::Empty(..)));
        members
    }

    fn fold_expr(&mut self, expression: Expr) -> Expr {
        let expression = expression.fold_children_with(self);
        match expression {
            // Parentheses are reconstructed by the fixer and emitter from
            // precedence, rather than preserved as source syntax.
            Expr::Paren(ParenExpr { expr, .. }) => *expr,
            Expr::New(expression @ NewExpr { args: None, .. }) => NewExpr {
                args: Some(Vec::new()),
                ..expression
            }
            .into(),
            // Parentheses can create nested sequence nodes, while emitted
            // comma expressions parse back into a flat sequence.
            Expr::Seq(SeqExpr { span, exprs }) => {
                let mut flattened = Vec::with_capacity(exprs.len());
                for expression in exprs {
                    match *expression {
                        Expr::Seq(SeqExpr { exprs, .. }) => flattened.extend(exprs),
                        expression => flattened.push(Box::new(expression)),
                    }
                }
                SeqExpr {
                    span,
                    exprs: flattened,
                }
                .into()
            }
            expression => expression,
        }
    }

    fn fold_number(&mut self, number: Number) -> Number {
        Number {
            raw: None,
            ..number.fold_children_with(self)
        }
    }

    fn fold_big_int(&mut self, bigint: BigInt) -> BigInt {
        BigInt {
            raw: None,
            ..bigint.fold_children_with(self)
        }
    }

    fn fold_str(&mut self, string: Str) -> Str {
        Str {
            raw: None,
            ..string.fold_children_with(self)
        }
    }

    fn fold_pat(&mut self, pattern: Pat) -> Pat {
        let pattern = pattern.fold_children_with(self);
        match pattern {
            Pat::Expr(expression) => match *expression {
                Expr::Ident(identifier) => identifier.into(),
                expression => Box::new(expression).into(),
            },
            pattern => pattern,
        }
    }

    fn fold_prop_name(&mut self, name: PropName) -> PropName {
        let name = name.fold_children_with(self);
        match name {
            PropName::Ident(identifier) => PropName::Str(Str {
                span: identifier.span,
                value: identifier.sym.into(),
                raw: None,
            }),
            PropName::Num(number) => PropName::Str(Str {
                span: number.span,
                value: number.to_string().into(),
                raw: None,
            }),
            name => name,
        }
    }

    fn fold_simple_assign_target(&mut self, target: SimpleAssignTarget) -> SimpleAssignTarget {
        let target = target.fold_children_with(self);
        match target {
            SimpleAssignTarget::Paren(ParenExpr { mut expr, .. }) => {
                while let Expr::Paren(ParenExpr { expr: inner, .. }) = *expr {
                    expr = inner;
                }
                SimpleAssignTarget::try_from(expr)
                    .expect("parenthesized assignment target must remain an assignment target")
            }
            target => target,
        }
    }
}

struct InlineSourceMapConfig;

impl SourceMapGenConfig for InlineSourceMapConfig {
    fn file_name_to_source(&self, file_name: &FileName) -> String {
        file_name.to_string()
    }

    fn inline_sources_content(&self, _: &FileName) -> bool {
        true
    }
}

fn validate_source_map(
    source_map: &DecodedSourceMap,
    generated: &str,
    source: &str,
) -> Result<(), (FailureKind, String)> {
    let mut encoded = Vec::new();
    source_map.to_writer(&mut encoded).map_err(|error| {
        (
            FailureKind::SourceMapMismatch,
            format!("source-map encoding failed: {error}"),
        )
    })?;
    let decoded = DecodedSourceMap::from_slice(&encoded).map_err(|error| {
        (
            FailureKind::SourceMapMismatch,
            format!("source-map decoding failed: {error}"),
        )
    })?;
    let before = SourceMapSnapshot::from(source_map);
    let after = SourceMapSnapshot::from(&decoded);
    if before != after {
        return Err((
            FailureKind::SourceMapMismatch,
            format!(
                "source map changed after encode/decode round-trip\nbefore: {before:?}\nafter: \
                 {after:?}"
            ),
        ));
    }

    let generated_lines = utf16_line_lengths(generated);
    let source_lines = utf16_line_lengths(source);
    for (index, token) in source_map.tokens().enumerate() {
        validate_position(
            "generated",
            index,
            token.get_dst_line(),
            token.get_dst_col(),
            &generated_lines,
        )?;

        if token.has_source() {
            let source_id = token.get_src_id();
            let contents = source_map.get_source_contents(source_id).ok_or_else(|| {
                (
                    FailureKind::SourceMapMismatch,
                    format!("mapped source {source_id} has no sourcesContent"),
                )
            })?;
            if &**contents != source {
                return Err((
                    FailureKind::SourceMapMismatch,
                    format!("sourcesContent for source {source_id} differs from input"),
                ));
            }
            validate_position(
                "original",
                index,
                token.get_src_line(),
                token.get_src_col(),
                &source_lines,
            )?;
        }
    }

    // A non-empty generated file should expose its input even if a particular
    // emitter change happens to produce no mapped token.
    if !generated.is_empty() && source_map.get_source_count() == 0 {
        return Err((
            FailureKind::SourceMapMismatch,
            "non-empty output has no source-map source".into(),
        ));
    }
    for source_id in 0..source_map.get_source_count() {
        let contents = source_map.get_source_contents(source_id).ok_or_else(|| {
            (
                FailureKind::SourceMapMismatch,
                format!("source {source_id} has no sourcesContent"),
            )
        })?;
        if &**contents != source {
            return Err((
                FailureKind::SourceMapMismatch,
                format!("sourcesContent for source {source_id} differs from input"),
            ));
        }
    }

    Ok(())
}

fn validate_position(
    label: &str,
    token_index: usize,
    line: u32,
    column: u32,
    line_lengths: &[u32],
) -> Result<(), (FailureKind, String)> {
    let Some(line_length) = line_lengths.get(line as usize) else {
        return Err((
            FailureKind::SourceMapMismatch,
            format!("{label} position for token {token_index} uses invalid line {line}"),
        ));
    };
    if column > *line_length {
        return Err((
            FailureKind::SourceMapMismatch,
            format!(
                "{label} position for token {token_index} uses column {column}, but line {line} \
                 has UTF-16 length {line_length}"
            ),
        ));
    }
    Ok(())
}

fn utf16_line_lengths(text: &str) -> Vec<u32> {
    let mut lengths = Vec::new();
    let mut current = 0u32;
    let mut chars = text.chars().peekable();
    while let Some(character) = chars.next() {
        match character {
            '\r' => {
                lengths.push(current);
                current = 0;
                if chars.peek() == Some(&'\n') {
                    chars.next();
                }
            }
            '\n' | '\u{2028}' | '\u{2029}' => {
                lengths.push(current);
                current = 0;
            }
            character => current += character.len_utf16() as u32,
        }
    }
    lengths.push(current);
    lengths
}

#[derive(Debug, PartialEq, Eq)]
struct SourceMapSnapshot {
    file: Option<String>,
    source_root: Option<String>,
    sources: Vec<String>,
    sources_content: Vec<Option<String>>,
    names: Vec<String>,
    tokens: Vec<RawToken>,
    ignored_sources: Vec<u32>,
}

impl From<&DecodedSourceMap> for SourceMapSnapshot {
    fn from(source_map: &DecodedSourceMap) -> Self {
        Self {
            file: source_map.get_file().map(ToString::to_string),
            source_root: source_map.get_source_root().map(ToString::to_string),
            sources: source_map.sources().map(ToString::to_string).collect(),
            sources_content: source_map
                .source_contents()
                .map(|content| content.map(ToString::to_string))
                .collect(),
            names: source_map.names().map(ToString::to_string).collect(),
            tokens: source_map
                .tokens()
                .map(|token| token.get_raw_token())
                .collect(),
            ignored_sources: source_map.ignore_list().copied().collect(),
        }
    }
}

fn failure(
    case: &TestCase,
    variant: TestVariant,
    suite: Suite,
    pipeline: Pipeline,
    kind: FailureKind,
    summary: String,
) -> Failure {
    Failure::from_diagnostic(
        suite,
        pipeline,
        case.path.clone(),
        variant.name(),
        kind,
        summary,
    )
}

fn panic_message(payload: Box<dyn std::any::Any + Send>) -> String {
    payload
        .downcast_ref::<&str>()
        .map(|message| (*message).to_owned())
        .or_else(|| payload.downcast_ref::<String>().cloned())
        .unwrap_or_else(|| "pipeline panicked with a non-string payload".into())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::model::Metadata;

    fn parse(source: &str) -> Program {
        let case = TestCase {
            path: "normalization.js".into(),
            code: source.into(),
            metadata: Metadata::default(),
        };
        let variant = TestVariant {
            goal: ParseGoal::Script,
            strictness: Strictness::Sloppy,
            harness: crate::model::HarnessMode::Standard,
        };
        let cm: Lrc<SourceMap> = Default::default();
        GLOBALS.set(&Globals::new(), || {
            parse_program(&cm, &case.path, source.into(), &case, variant).unwrap()
        })
    }

    fn drop_spans(mut program: Program) -> Program {
        program.visit_mut_with(&mut DropSpan);
        program
    }

    fn assert_same_normalized_shape(source: &str, emitted_shape: &str) {
        let source = parse(source);
        let emitted_shape = parse(emitted_shape);

        assert_ne!(
            drop_spans(source.clone()),
            drop_spans(emitted_shape.clone()),
            "fixture must construct distinct AST representations"
        );
        assert_eq!(normalize_program(source), normalize_program(emitted_shape));
    }

    #[test]
    fn normalization_removes_empty_class_members() {
        assert_same_normalized_shape(
            "class Container { ;;; method() {} ; }",
            "class Container { method() {} }",
        );
    }

    #[test]
    fn normalization_removes_parentheses_and_canonicalizes_new_arguments() {
        assert_same_normalized_shape("(value);", "value;");
        assert_same_normalized_shape("new Target;", "new Target();");
    }

    #[test]
    fn normalization_flattens_nested_sequence_expressions() {
        assert_same_normalized_shape("(first, (second, third));", "first, second, third;");
    }

    #[test]
    fn normalization_removes_number_bigint_and_string_raw_syntax() {
        assert_same_normalized_shape("0x10;", "16;");
        assert_same_normalized_shape("0x10n;", "16n;");
        assert_same_normalized_shape("'value';", "\"value\";");
    }

    #[test]
    fn normalization_converts_expression_identifier_patterns() {
        assert_same_normalized_shape("for ((target) of values) {}", "for (target of values) {}");
    }

    #[test]
    fn normalization_canonicalizes_identifier_and_numeric_property_names() {
        assert_same_normalized_shape("({ key: value });", "({ \"key\": value });");
        assert_same_normalized_shape("({ 16: value });", "({ \"16\": value });");
    }

    #[test]
    fn normalization_removes_parenthesized_simple_assignment_targets() {
        assert_same_normalized_shape("((target)) = value;", "target = value;");
    }

    #[test]
    fn normalization_preserves_semantic_differences() {
        assert_ne!(
            normalize_program(parse("left + right;")),
            normalize_program(parse("left * right;"))
        );
    }

    #[test]
    fn ast_mismatch_diagnostic_is_compact_and_content_addressed() {
        let expected = normalize_program(parse("left + right;"));
        let actual = normalize_program(parse("left * right;"));
        let diagnostic = ast_mismatch_diagnostic(&expected, &actual).unwrap();

        assert!(diagnostic.contains("expected-sha256:"));
        assert!(diagnostic.contains("actual-sha256:"));
        assert!(diagnostic.contains("first-difference-byte:"));
        assert!(diagnostic.len() < 1_000);
        assert_ne!(
            diagnostic,
            ast_mismatch_diagnostic(&expected, &normalize_program(parse("left - right;"))).unwrap()
        );
    }

    #[test]
    fn line_boundaries_use_utf16_and_all_javascript_terminators() {
        assert_eq!(
            utf16_line_lengths("a😀\r\nb\u{2028}c\u{2029}"),
            vec![3, 1, 1, 0]
        );
    }

    #[test]
    fn codegen_pipeline_is_idempotent_for_script_and_module() {
        for (source, goal) in [
            ("const value = (1 + 2) * 3;", ParseGoal::Script),
            ("export const value = (1 + 2) * 3;", ParseGoal::Module),
        ] {
            let case = TestCase {
                path: "idempotence.js".into(),
                code: source.into(),
                metadata: Metadata::default(),
            };
            let variant = TestVariant {
                goal,
                strictness: if goal == ParseGoal::Module {
                    Strictness::Inherent
                } else {
                    Strictness::Sloppy
                },
                harness: crate::model::HarnessMode::Standard,
            };
            let failures = GLOBALS.set(&Globals::new(), || run_codegen_variant(&case, variant));
            assert!(failures.is_empty(), "{failures:#?}");
        }
    }

    #[test]
    fn source_map_roundtrips_and_embeds_exact_utf8_input() {
        let source = "const emoji = '\u{1f600}';\nemoji;";
        let case = TestCase {
            path: "source-map.js".into(),
            code: source.into(),
            metadata: Metadata::default(),
        };
        let variant = TestVariant {
            goal: ParseGoal::Script,
            strictness: Strictness::Sloppy,
            harness: crate::model::HarnessMode::Standard,
        };

        GLOBALS.set(&Globals::new(), || {
            let cm: Lrc<SourceMap> = Default::default();
            let mut program =
                parse_program(&cm, &case.path, source.into(), &case, variant).unwrap();
            program.mutate(fixer(None));
            for minify in [false, true] {
                let emitted = emit_program(&program, cm.clone(), minify, true).unwrap();
                let source_map =
                    cm.build_source_map(&emitted.mappings, None, InlineSourceMapConfig);

                validate_source_map(&source_map, &emitted.code, source).unwrap();
            }
        });
    }

    #[test]
    fn panic_is_attributed_to_only_the_pipeline_that_panicked() {
        let case = TestCase {
            path: "pipeline-panic.js".into(),
            code: "value;".into(),
            metadata: Metadata::default(),
        };
        let variant = TestVariant {
            goal: ParseGoal::Script,
            strictness: Strictness::Sloppy,
            harness: crate::model::HarnessMode::Standard,
        };

        let panic = run_pipeline_catching_panics(
            &case,
            variant,
            Suite::Codegen,
            Pipeline::CodegenMinified,
            || panic!("synthetic pipeline panic"),
        )
        .unwrap();
        assert_eq!(panic.pipeline, Pipeline::CodegenMinified);
        assert_eq!(panic.kind, FailureKind::Panic);

        let successful =
            run_pipeline_catching_panics(&case, variant, Suite::Codegen, Pipeline::Codegen, || {
                Ok(())
            });
        assert!(successful.is_none());
    }
}
