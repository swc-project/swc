use std::path::Path;

use swc::{
    config::{Config, IsModule, JscConfig, Options, TransformConfig},
    Compiler,
};
use swc_common::{errors::Handler, sync::Lrc, FileName, SourceMap};
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::{parse_file_as_program, EsSyntax, FlowSyntax, Syntax};
use swc_ecma_transforms::react::{Options as ReactOptions, Runtime as ReactRuntime};

pub(crate) fn compile_and_reparse_flow_file(
    compiler: &Compiler,
    cm: Lrc<SourceMap>,
    handler: &Handler,
    path: &Path,
    label: &str,
    flow_syntax: FlowSyntax,
) -> Result<(), ()> {
    let fm = cm
        .load_file(path)
        .unwrap_or_else(|err| panic!("failed to load {}: {err}", path.display()));

    let output = match compiler.process_js_file(fm, handler, &flow_strip_options(flow_syntax)) {
        Ok(v) => v,
        Err(err) => panic!("failed to compile {label}: {err:?}"),
    };

    if handler.has_errors() {
        return Err(());
    }

    assert!(
        !output.code.contains("__flow_"),
        "flow synthetic symbols leaked in emitted output for {label}",
    );

    let output_fm = cm.new_source_file(FileName::Anon.into(), output.code);
    let mut recovered_errors = Vec::new();
    let reparse_result = parse_file_as_program(
        &output_fm,
        Syntax::Es(es_reparse_syntax(flow_syntax.jsx)),
        EsVersion::latest(),
        None,
        &mut recovered_errors,
    );

    if let Err(err) = reparse_result {
        err.into_diagnostic(handler).emit();
        for recovered in recovered_errors {
            recovered.into_diagnostic(handler).emit();
        }
        return Err(());
    }

    if !recovered_errors.is_empty() {
        for recovered in recovered_errors {
            recovered.into_diagnostic(handler).emit();
        }
        return Err(());
    }

    Ok(())
}

pub(crate) fn es_reparse_syntax(jsx: bool) -> EsSyntax {
    EsSyntax {
        jsx,
        decorators: true,
        decorators_before_export: true,
        export_default_from: true,
        import_attributes: true,
        allow_super_outside_method: true,
        auto_accessors: true,
        explicit_resource_management: true,
        ..Default::default()
    }
}

fn flow_strip_options(flow_syntax: FlowSyntax) -> Options {
    Options {
        swcrc: false,
        config: Config {
            is_module: Some(IsModule::Unknown),
            jsc: JscConfig {
                syntax: Some(Syntax::Flow(flow_syntax)),
                transform: Some(TransformConfig {
                    react: ReactOptions {
                        runtime: Some(ReactRuntime::Preserve),
                        throw_if_namespace: Some(false),
                        ..Default::default()
                    },
                    ..Default::default()
                })
                .into(),
                external_helpers: true.into(),
                ..Default::default()
            },
            ..Default::default()
        },
        ..Default::default()
    }
}
