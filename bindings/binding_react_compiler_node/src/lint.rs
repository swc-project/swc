use napi::bindgen_prelude::*;
use swc_core::ecma::parser::Syntax;

use crate::diagnostics::{diagnostic_from_message, Diagnostic};

/// Matches `swc_ecma_parser::Syntax`'s own `Default` impl
/// (`Es(EsSyntax::default())` — plain ECMAScript, no JSX/TSX/decorators) rather
/// than any particular consumer's build settings. This package is
/// general-purpose; it must not silently assume one caller's parser
/// configuration for everyone else.
fn default_syntax() -> Syntax {
    Syntax::default()
}

/// Pure JSON decode, no napi types involved — this is the only part of
/// syntax parsing that unit tests may call directly. A `napi::Error` has a
/// non-trivial `Drop`/`ToNapiValue` impl that references live N-API C
/// functions (`napi_throw`, `napi_create_error`, ...), which only exist once
/// this cdylib is `dlopen`'d by a running Node process. If ANY function that
/// tests call constructs a `napi::Error` anywhere in its body — even in a
/// branch that specific test never executes — the whole function's compiled
/// object code references those unresolved symbols, and a standalone
/// `cargo test` binary (never loaded by Node) fails to link. Keep this
/// function's signature free of `napi::Error`/`napi::Result` so tests can
/// call it safely.
fn decode_syntax(bytes: &[u8]) -> std::result::Result<Syntax, serde_json::Error> {
    serde_json::from_slice(bytes)
}

/// Thin napi-facing wrapper — not unit tested (see `decode_syntax`'s doc
/// comment), matching this crate's existing convention of only testing the
/// pure logic behind a `#[napi]` function, never the function itself (see
/// `support.rs`'s `is_react_compiler_required(_sync)`, which have no tests
/// at all).
fn parse_syntax_option(syntax: Option<Buffer>) -> napi::Result<Syntax> {
    match syntax {
        Some(buf) => decode_syntax(buf.as_ref()).map_err(|err| {
            napi::Error::new(napi::Status::InvalidArg, format!("invalid `syntax`: {err}"))
        }),
        None => Ok(default_syntax()),
    }
}

fn lint_inner(code: &str, syntax: Syntax) -> Vec<Diagnostic> {
    let result = swc_ecma_react_compiler::lint_source(
        code,
        syntax,
        swc_ecma_react_compiler::default_plugin_options(),
    );

    result
        .diagnostics
        .iter()
        .map(|d| diagnostic_from_message(code, d))
        .collect()
}

struct LintTask {
    code: String,
    syntax: Syntax,
}

#[napi]
impl Task for LintTask {
    type JsValue = Vec<Diagnostic>;
    type Output = Vec<Diagnostic>;

    fn compute(&mut self) -> napi::Result<Self::Output> {
        Ok(lint_inner(&self.code, self.syntax))
    }

    fn resolve(&mut self, _env: napi::Env, output: Self::Output) -> napi::Result<Self::JsValue> {
        Ok(output)
    }
}

#[napi]
fn lint(
    code: String,
    syntax: Option<Buffer>,
    signal: Option<AbortSignal>,
) -> napi::Result<AsyncTask<LintTask>> {
    let syntax = parse_syntax_option(syntax)?;

    Ok(AsyncTask::with_optional_signal(
        LintTask { code, syntax },
        signal,
    ))
}

#[napi]
pub fn lint_sync(code: String, syntax: Option<Buffer>) -> napi::Result<Vec<Diagnostic>> {
    let syntax = parse_syntax_option(syntax)?;

    Ok(lint_inner(&code, syntax))
}

#[cfg(test)]
mod tests {
    use swc_core::ecma::parser::{EsSyntax, Syntax, TsSyntax};

    use super::{decode_syntax, default_syntax, lint_inner};

    /// Several documented React Compiler lint rules
    /// (https://react.dev/reference/eslint-plugin-react-hooks) only surface
    /// on JSX-bearing source, which `default_syntax()` (plain ECMAScript, no
    /// JSX) can't parse. Tests exercising those rules use this instead.
    fn tsx_syntax() -> Syntax {
        Syntax::Typescript(TsSyntax {
            tsx: true,
            decorators: true,
            ..Default::default()
        })
    }

    #[test]
    fn reports_ref_access_error_with_default_syntax() {
        let source = r#"
            import { useRef } from 'react';

            function App() {
                const ref = useRef(1);
                return ref.current;
            }
        "#;

        let diagnostics = lint_inner(source, default_syntax());

        assert_eq!(diagnostics.len(), 1);
        assert_eq!(diagnostics[0].severity, "error");
        assert_eq!(diagnostics[0].rule_id.as_deref(), Some("refs"));
        assert_eq!(diagnostics[0].category.as_deref(), Some("Refs"));
    }

    #[test]
    fn returns_empty_for_non_react_code() {
        let diagnostics = lint_inner("const x = 1;", default_syntax());

        assert!(diagnostics.is_empty());
    }

    /// One test per documented React Compiler lint rule
    /// (https://react.dev/reference/eslint-plugin-react-hooks) that a
    /// hand-written source snippet can reliably trigger. Every trigger
    /// condition here was verified empirically against the actual compiled
    /// binary before being written as a test — not guessed. Rules not
    /// covered below either require configuration this crate deliberately
    /// doesn't expose (`config`, `gating`: need explicit gating directives;
    /// `purity`: `validate_no_impure_functions_in_render` defaults to
    /// `false` upstream) or need more investigation to find a reliable
    /// trigger (`error-boundaries`, `static-components`,
    /// `set-state-in-effect`, `incompatible-library`).
    mod documented_rule_coverage {
        use super::{lint_inner, tsx_syntax};

        fn assert_fires(source: &str, expected_rule_id: &str) {
            let diagnostics = lint_inner(source, tsx_syntax());

            assert!(
                diagnostics
                    .iter()
                    .any(|d| d.rule_id.as_deref() == Some(expected_rule_id)),
                "expected a `{expected_rule_id}` diagnostic, got: {diagnostics:#?}"
            );
        }

        #[test]
        fn globals() {
            assert_fires(
                r#"
                let count = 0;
                function App() {
                    const [x] = useState(0);
                    count = count + 1;
                    return <div>{count}{x}</div>;
                }
                "#,
                "globals",
            );
        }

        #[test]
        fn immutability() {
            assert_fires(
                r#"
                function App(props) {
                    const [x, setX] = useState(0);
                    props.value = 1;
                    return <div onClick={() => setX(x + 1)}>{x}</div>;
                }
                "#,
                "immutability",
            );
        }

        #[test]
        fn use_memo() {
            assert_fires(
                r#"
                function App() {
                    const value = useMemo((extra) => extra, [1]);
                    return <div>{value}</div>;
                }
                "#,
                "use-memo",
            );
        }

        #[test]
        fn set_state_in_render() {
            assert_fires(
                r#"
                function App() {
                    const [state, setState] = useState(0);
                    setState(state + 1);
                    return <div>{state}</div>;
                }
                "#,
                "set-state-in-render",
            );
        }

        #[test]
        fn unsupported_syntax() {
            assert_fires(
                r#"
                function App() {
                    eval('1');
                    return <div />;
                }
                "#,
                "unsupported-syntax",
            );
        }
    }

    #[test]
    fn decode_syntax_decodes_ecmascript_json() {
        let syntax = decode_syntax(br#"{"syntax":"ecmascript","jsx":true}"#)
            .expect("valid ecmascript syntax JSON should decode");

        assert_eq!(
            syntax,
            Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            })
        );
    }

    #[test]
    fn decode_syntax_rejects_invalid_json() {
        let result = decode_syntax(b"not json");

        assert!(result.is_err());
    }
}
