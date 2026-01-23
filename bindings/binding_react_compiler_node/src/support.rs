use napi::bindgen_prelude::*;
use swc_core::{
    common::{sync::Lrc, FileName, SourceMap},
    ecma::{ast::EsVersion, parser::Syntax},
};

struct IsReactCompilerRequiredTask {
    code: String,
}

#[napi]
impl Task for IsReactCompilerRequiredTask {
    type JsValue = bool;
    type Output = bool;

    fn compute(&mut self) -> napi::Result<Self::Output> {
        Ok(is_react_compiler_required_inner(&self.code))
    }

    fn resolve(&mut self, _env: napi::Env, output: Self::Output) -> napi::Result<Self::JsValue> {
        Ok(output)
    }
}

fn is_react_compiler_required_inner(code: &str) -> bool {
    let cm = Lrc::new(SourceMap::default());
    let fm = cm.new_source_file(FileName::Anon.into(), code.to_string());

    let program = swc_core::ecma::parser::parse_file_as_program(
        &fm,
        Syntax::Typescript(swc_core::ecma::parser::TsSyntax {
            decorators: true,
            tsx: true,
            ..Default::default()
        }),
        EsVersion::latest(),
        None,
        &mut vec![],
    );

    let Ok(program) = program else {
        return false;
    };

    swc_ecma_react_compiler::fast_check::is_required(&program)
}

#[napi]
fn is_react_compiler_required(
    code: Buffer,
    signal: Option<AbortSignal>,
) -> AsyncTask<IsReactCompilerRequiredTask> {
    let code = String::from_utf8_lossy(code.as_ref()).into_owned();

    let task = IsReactCompilerRequiredTask { code };

    AsyncTask::with_optional_signal(task, signal)
}

#[napi]
pub fn is_react_compiler_required_sync(code: Buffer) -> napi::Result<bool> {
    let code = String::from_utf8_lossy(code.as_ref()).into_owned();

    Ok(is_react_compiler_required_inner(&code))
}
