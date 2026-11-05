use std::fmt::Display;

use anyhow::Context;
use serde::{Deserialize, Serialize};
use swc_common::{
    comments::{Comments, SingleThreadedComments},
    errors::{DiagnosticId, Handler, HANDLER},
    source_map::DefaultSourceMapGenConfig,
    sync::Lrc,
    BytePos, FileName, Mark, SourceMap, Span, Spanned,
};
use swc_ecma_ast::{Decl, EsVersion, ModuleDecl, Program, Stmt, TsModuleDecl};
use swc_ecma_parser::{
    lexer::Lexer,
    unstable::{Capturing, Token, TokenAndSpan},
    Parser, StringInput, Syntax, TsSyntax,
};
use swc_ecma_transforms_base::{
    fixer::fixer,
    helpers::{inject_helpers, Helpers, HELPERS},
    hygiene::hygiene,
    resolver,
};
use swc_ecma_transforms_typescript::typescript;
use swc_ecma_visit::{Visit, VisitWith};
#[cfg(feature = "wasm-bindgen")]
use wasm_bindgen::prelude::*;

mod edit;
mod erase;
mod token_cursor;

#[derive(Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Options {
    #[serde(default)]
    pub module: Option<bool>,
    #[serde(default)]
    pub filename: Option<String>,

    #[serde(default = "default_ts_syntax")]
    pub parser: TsSyntax,

    #[serde(default)]
    pub mode: Mode,

    #[serde(default)]
    pub transform: Option<TransformConfig>,

    #[serde(default)]
    pub deprecated_ts_module_as_error: Option<bool>,

    #[serde(default)]
    pub source_map: bool,
}

#[derive(Debug, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TransformConfig {
    #[cfg(feature = "nightly")]
    #[serde(default)]
    pub jsx: Option<JsxConfig>,

    #[serde(flatten)]
    pub typescript: typescript::Config,
}

#[cfg(feature = "nightly")]
#[derive(Debug, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct JsxConfig {
    #[serde(default)]
    pub transform: Option<JsxTransform>,

    #[serde(default)]
    pub import_source: Option<swc_atoms::Atom>,
}

#[cfg(feature = "nightly")]
#[derive(Debug, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum JsxTransform {
    #[default]
    #[serde(rename = "react-jsx")]
    ReactJsx,
    #[serde(rename = "react-jsxdev")]
    ReactJsxDev,
}

#[cfg(feature = "wasm-bindgen")]
#[wasm_bindgen(typescript_custom_section)]
const Type_Options: &'static str = r#"
interface Options {
    module?: boolean;
    filename?: string;
    mode?: Mode;
    transform?: TransformConfig;
    deprecatedTsModuleAsError?: boolean;
    sourceMap?: boolean;
}

interface TransformConfig {
    /**
     * @see https://www.typescriptlang.org/tsconfig#verbatimModuleSyntax
     */
    verbatimModuleSyntax?: boolean;
    /**
     * Native class properties support
     */
    nativeClassProperties?: boolean;
    importNotUsedAsValues?: "remove" | "preserve";
    /**
     * Don't create `export {}`.
     * By default, strip creates `export {}` for modules to preserve module
     * context.
     *
     * @see https://github.com/swc-project/swc/issues/1698
     */
    noEmptyExport?: boolean;
    importExportAssignConfig?: "Classic" | "Preserve" | "NodeNext" | "EsNext";
    /**
     * Disables an optimization that inlines TS enum member values
     * within the same module that assumes the enum member values
     * are never modified.
     *
     * Defaults to false.
     */
    tsEnumIsMutable?: boolean;

    /**
     * Available only on nightly builds.
     */
    jsx?: JsxConfig;
}

interface JsxConfig {
    /**
     * How to transform JSX.
     *
     * @default "react-jsx"
     */
    transform?: "react-jsx" | "react-jsxdev";
}
"#;

#[derive(Debug, Default, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum Mode {
    #[default]
    StripOnly,
    Transform,
}

#[cfg(feature = "wasm-bindgen")]
#[wasm_bindgen(typescript_custom_section)]
const Type_Mode: &'static str = r#"
type Mode = "strip-only" | "transform";
"#;

fn default_ts_syntax() -> TsSyntax {
    TsSyntax {
        decorators: true,
        ..Default::default()
    }
}

#[derive(Debug, Serialize)]
pub struct TransformOutput {
    pub code: String,
    pub map: Option<String>,
}

#[cfg(feature = "wasm-bindgen")]
#[wasm_bindgen(typescript_custom_section)]
const Type_TransformOutput: &'static str = r#"
interface TransformOutput {
    code: string;
    map?: string;
}
"#;

#[derive(Debug, Serialize)]
pub struct TsError {
    pub message: String,
    pub code: ErrorCode,
}

impl std::fmt::Display for TsError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "[{}] {}", self.code, self.message)
    }
}

impl std::error::Error for TsError {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        None
    }
}

#[non_exhaustive]
#[derive(Debug, Clone, Copy, Serialize)]
pub enum ErrorCode {
    InvalidSyntax,
    UnsupportedSyntax,
    Unknown,
}

impl Display for ErrorCode {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{self:?}")
    }
}

impl From<anyhow::Error> for TsError {
    fn from(err: anyhow::Error) -> Self {
        TsError {
            message: err.to_string(),
            code: ErrorCode::Unknown,
        }
    }
}

pub fn operate(
    cm: &Lrc<SourceMap>,
    handler: &Handler,
    input: String,
    options: Options,
) -> Result<TransformOutput, TsError> {
    let deprecated_ts_module_as_error = options.deprecated_ts_module_as_error.unwrap_or_default();
    // Token capture is only needed for strip-only and deprecated `module`
    // diagnostics.
    let should_capture_tokens =
        matches!(&options.mode, Mode::StripOnly) || deprecated_ts_module_as_error;

    let filename = options
        .filename
        .map_or(FileName::Anon, |f| FileName::Real(f.into()));

    let source_len = input.len();
    let fm = cm.new_source_file(filename.into(), input);

    let syntax = Syntax::Typescript(options.parser);
    let target = EsVersion::latest();

    let comments = matches!(&options.mode, Mode::Transform).then(SingleThreadedComments::default);
    let lexer_comments = comments.as_ref().map(|comments| comments as &dyn Comments);

    let (program, errors, tokens) = if should_capture_tokens {
        let lexer = Capturing::new(Lexer::new(
            syntax,
            target,
            StringInput::from(&*fm),
            lexer_comments,
        ));
        let mut parser = Parser::new_from(lexer);

        let program = match options.module {
            Some(true) => parser.parse_module().map(Program::Module),
            Some(false) => parser.parse_script().map(Program::Script),
            None => parser.parse_program(),
        };
        let errors = parser.take_errors();
        let tokens = parser.input_mut().iter_mut().take();

        (program, errors, tokens)
    } else {
        let lexer = Lexer::new(syntax, target, StringInput::from(&*fm), lexer_comments);
        let mut parser = Parser::new_from(lexer);

        let program = match options.module {
            Some(true) => parser.parse_module().map(Program::Module),
            Some(false) => parser.parse_script().map(Program::Script),
            None => parser.parse_program(),
        };
        let errors = parser.take_errors();

        (program, errors, Vec::new())
    };
    debug_assert!(
        tokens
            .windows(2)
            .all(|tokens| tokens[0].span.lo < tokens[1].span.lo),
        "captured tokens must be ordered by source position"
    );

    let mut program = match program {
        Ok(program) => program,
        Err(err) => {
            err.into_diagnostic(handler)
                .code(DiagnosticId::Error("InvalidSyntax".into()))
                .emit();

            for e in errors {
                e.into_diagnostic(handler)
                    .code(DiagnosticId::Error("InvalidSyntax".into()))
                    .emit();
            }

            return Err(TsError {
                message: "Syntax error".to_string(),
                code: ErrorCode::InvalidSyntax,
            });
        }
    };

    if !errors.is_empty() {
        for e in errors {
            e.into_diagnostic(handler)
                .code(DiagnosticId::Error("InvalidSyntax".into()))
                .emit();
        }

        return Err(TsError {
            message: "Syntax error".to_string(),
            code: ErrorCode::InvalidSyntax,
        });
    }

    match options.mode {
        Mode::StripOnly => {
            if deprecated_ts_module_as_error {
                program.visit_with(&mut ErrorOnTsModule {
                    src: &fm.src,
                    source_start: fm.start_pos,
                    tokens: &tokens,
                });
                if handler.has_errors() {
                    return Err(TsError {
                        message: "Unsupported syntax".to_string(),
                        code: ErrorCode::UnsupportedSyntax,
                    });
                }
            }

            let code = erase::strip(&program, &fm.src, fm.start_pos, &tokens)
                .map_err(|errors| {
                    for error in errors {
                        error.emit(handler);
                    }
                    TsError {
                        message: "Unsupported syntax".to_string(),
                        code: ErrorCode::UnsupportedSyntax,
                    }
                })?
                .into_owned();
            Ok(TransformOutput { code, map: None })
        }

        Mode::Transform => {
            let comments = comments.expect("transform mode must collect comments");
            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();

            HELPERS.set(&Helpers::new(false), || {
                program.mutate(&mut resolver(unresolved_mark, top_level_mark, true));

                if deprecated_ts_module_as_error {
                    program.visit_with(&mut ErrorOnTsModule {
                        src: &fm.src,
                        source_start: fm.start_pos,
                        tokens: &tokens,
                    });
                    if handler.has_errors() {
                        return Err(TsError {
                            message: "Unsupported syntax".to_string(),
                            code: ErrorCode::UnsupportedSyntax,
                        });
                    }
                }

                let transform = options.transform.unwrap_or_default();

                program.mutate(&mut typescript::typescript(
                    transform.typescript,
                    unresolved_mark,
                    top_level_mark,
                ));

                #[cfg(feature = "nightly")]
                program.mutate(&mut swc_ecma_transforms_react::jsx(
                    cm.clone(),
                    Some(comments.clone()),
                    swc_ecma_transforms_react::Options {
                        next: Some(true),
                        runtime: Some(swc_ecma_transforms_react::Runtime::Automatic),
                        import_source: transform
                            .jsx
                            .as_ref()
                            .and_then(|jsx| jsx.import_source.clone()),
                        development: match transform.jsx {
                            Some(JsxConfig {
                                transform: Some(transform),
                                ..
                            }) => Some(matches!(transform, JsxTransform::ReactJsxDev)),
                            _ => None,
                        },
                        refresh: None,
                        ..Default::default()
                    },
                    top_level_mark,
                    unresolved_mark,
                ));

                program.mutate(&mut inject_helpers(unresolved_mark));

                program.mutate(&mut hygiene());

                program.mutate(&mut fixer(Some(&comments)));

                Ok(())
            })?;

            let mut src = std::vec::Vec::with_capacity(source_len);
            let mut src_map_buf = if options.source_map {
                Some(Vec::new())
            } else {
                None
            };

            {
                let mut emitter = swc_ecma_codegen::Emitter {
                    cfg: swc_ecma_codegen::Config::default(),
                    comments: if options.source_map {
                        Some(&comments)
                    } else {
                        None
                    },
                    cm: cm.clone(),
                    wr: swc_ecma_codegen::text_writer::JsWriter::new(
                        cm.clone(),
                        "\n",
                        &mut src,
                        src_map_buf.as_mut(),
                    ),
                };

                emitter.emit_program(&program).unwrap();

                let map = src_map_buf
                    .map(|map| {
                        let map = cm.build_source_map(&map, None, DefaultSourceMapGenConfig);

                        let mut s = std::vec::Vec::new();
                        map.to_writer(&mut s)
                            .context("failed to write source map")?;

                        String::from_utf8(s).context("source map was not utf8")
                    })
                    .transpose()?;

                Ok(TransformOutput {
                    code: String::from_utf8(src).context("generated code was not utf-8")?,
                    map,
                })
            }
        }
    }
}

struct ErrorOnTsModule<'a> {
    src: &'a str,
    source_start: BytePos,
    tokens: &'a [TokenAndSpan],
}

// All namespaces or modules are either at the top level or nested within
// another namespace or module.
impl Visit for ErrorOnTsModule<'_> {
    fn visit_stmt(&mut self, n: &Stmt) {
        if n.is_decl() {
            n.visit_children_with(self);
        }
    }

    fn visit_decl(&mut self, n: &Decl) {
        if n.is_ts_module() {
            n.visit_children_with(self);
        }
    }

    fn visit_module_decl(&mut self, n: &ModuleDecl) {
        if n.is_export_decl() {
            n.visit_children_with(self);
        }
    }

    fn visit_ts_module_decl(&mut self, n: &TsModuleDecl) {
        n.visit_children_with(self);

        if n.global || n.id.is_str() {
            return;
        }

        let mut pos = n.span.lo;

        if n.declare {
            let declare_index = self
                .tokens
                .binary_search_by_key(&pos, |t| t.span.lo)
                .unwrap();

            debug_assert_eq!(self.tokens[declare_index].token, Token::Declare);

            let TokenAndSpan { token, span, .. } = &self.tokens[declare_index + 1];
            // declare global
            // declare module
            // declare namespace
            if matches!(token, Token::Namespace) {
                return;
            }

            pos = span.lo;
        } else {
            let offset = (pos.0 - self.source_start.0) as usize;
            if self.src.as_bytes()[offset] != b'm' {
                return;
            }
        }

        if HANDLER.is_set() {
            HANDLER.with(|handler| {
                handler
                    .struct_span_err(
                        span(pos, n.id.span().hi),
                        "`module` keyword is not supported. Use `namespace` instead.",
                    )
                    .code(DiagnosticId::Error("UnsupportedSyntax".into()))
                    .emit();
            });
        }
    }
}

fn span(lo: BytePos, hi: BytePos) -> Span {
    Span::new(lo, hi)
}
