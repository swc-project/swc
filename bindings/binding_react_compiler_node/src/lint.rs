use napi::bindgen_prelude::*;
use swc_core::ecma::parser::{Syntax, TsSyntax};

use crate::diagnostics::Diagnostic;

fn lint_inner(code: &str) -> Vec<Diagnostic> {
    let syntax = Syntax::Typescript(TsSyntax {
        decorators: true,
        tsx: true,
        ..Default::default()
    });

    let result = swc_ecma_react_compiler::lint_source(
        code,
        syntax,
        swc_ecma_react_compiler::default_plugin_options(),
    );

    result.diagnostics.iter().map(Into::into).collect()
}

struct LintTask {
    code: String,
}

#[napi]
impl Task for LintTask {
    type JsValue = Vec<Diagnostic>;
    type Output = Vec<Diagnostic>;

    fn compute(&mut self) -> napi::Result<Self::Output> {
        Ok(lint_inner(&self.code))
    }

    fn resolve(&mut self, _env: napi::Env, output: Self::Output) -> napi::Result<Self::JsValue> {
        Ok(output)
    }
}

#[napi]
fn lint(code: Buffer, signal: Option<AbortSignal>) -> AsyncTask<LintTask> {
    let code = String::from_utf8_lossy(code.as_ref()).into_owned();

    AsyncTask::with_optional_signal(LintTask { code }, signal)
}

#[napi]
pub fn lint_sync(code: Buffer) -> napi::Result<Vec<Diagnostic>> {
    let code = String::from_utf8_lossy(code.as_ref()).into_owned();

    Ok(lint_inner(&code))
}

#[cfg(test)]
mod tests {
    use super::lint_inner;

    #[test]
    fn reports_ref_access_error() {
        let source = r#"
            import { useRef } from 'react';

            function App() {
                const ref = useRef(1);
                return ref.current;
            }
        "#;

        let diagnostics = lint_inner(source);

        assert_eq!(diagnostics.len(), 1);
        assert_eq!(diagnostics[0].severity, "error");
        assert_eq!(diagnostics[0].rule_id.as_deref(), Some("refs"));
        assert_eq!(diagnostics[0].category.as_deref(), Some("Refs"));
    }

    #[test]
    fn returns_empty_for_non_react_code() {
        let diagnostics = lint_inner("const x = 1;");

        assert!(diagnostics.is_empty());
    }
}
