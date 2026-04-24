use std::{fs::File, io::Read, path::PathBuf};

use swc_common::{errors::Handler, sync::Lrc, FileName, Mark, SourceFile, SourceMap};
use swc_ecma_ast::EsVersion;
use swc_ecma_codegen::to_code_default;
use swc_ecma_parser::{parse_file_as_program, EsSyntax, FlowSyntax, Syntax};
use swc_ecma_transforms_base::{fixer::fixer, resolver};
use swc_ecma_transforms_typescript::typescript;

#[testing::fixture("../swc_ecma_parser/tests/flow/**/*.js")]
fn flow_strip_reparses_as_javascript(input: PathBuf) {
    let is_jsx = input.extension().is_some_and(|ext| ext == "jsx");
    let config_path = input.parent().unwrap().join("config.json");
    let flow_syntax = load_flow_syntax(config_path, is_jsx);

    ::testing::run_test(false, |cm, handler| -> Result<(), ()> {
        let fm = cm.load_file(&input).expect("failed to load flow fixture");
        let output = strip_flow_program(cm.clone(), handler, fm, flow_syntax)?;

        assert!(
            !output.contains("__flow_"),
            "flow synthetic symbols leaked into emitted output for {}",
            input.display()
        );

        assert_reparses_as_javascript(cm.clone(), handler, output, flow_syntax)?;

        Ok(())
    })
    .expect("failed to run flow strip correctness test");
}

#[test]
fn issue_11808_does_not_restore_empty_export_for_flow_type_only_module() {
    ::testing::run_test(false, |cm, handler| -> Result<(), ()> {
        let flow_syntax = FlowSyntax {
            require_directive: true,
            ..Default::default()
        };
        let fm = cm.new_source_file(
            FileName::Custom("issue-11808.js".into()).into(),
            "/** @flow strict */\nglobal.ErrorUtils = {};\nexport type ErrorUtilsT = typeof \
             global.ErrorUtils;\n",
        );

        let output = strip_flow_program(cm.clone(), handler, fm, flow_syntax)?;

        assert!(
            output.contains("global.ErrorUtils = {};"),
            "expected runtime assignment to remain in stripped output, got: {output}"
        );
        assert!(
            !output.contains("export {"),
            "expected Flow type-only export to be removed without restoring `export {{}}`, got: \
             {output}"
        );

        assert_reparses_as_javascript(cm.clone(), handler, output, flow_syntax)?;

        Ok(())
    })
    .expect("failed to run flow strip issue-11808 test");
}

fn strip_flow_program(
    cm: Lrc<SourceMap>,
    handler: &Handler,
    fm: Lrc<SourceFile>,
    flow_syntax: FlowSyntax,
) -> Result<String, ()> {
    let mut recovered_errors = Vec::new();

    let program = parse_file_as_program(
        &fm,
        Syntax::Flow(flow_syntax),
        EsVersion::latest(),
        None,
        &mut recovered_errors,
    )
    .map_err(|err| err.into_diagnostic(handler).emit())?;

    if !recovered_errors.is_empty() {
        for recovered in recovered_errors {
            recovered.into_diagnostic(handler).emit();
        }
        return Err(());
    }

    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    let program = program
        .apply(resolver(unresolved_mark, top_level_mark, false))
        .apply(typescript::typescript(
            typescript::Config {
                flow_syntax: true,
                ..Default::default()
            },
            unresolved_mark,
            top_level_mark,
        ))
        .apply(fixer(None));

    Ok(to_code_default(cm, None, &program))
}

fn assert_reparses_as_javascript(
    cm: Lrc<SourceMap>,
    handler: &Handler,
    output: String,
    flow_syntax: FlowSyntax,
) -> Result<(), ()> {
    let output_fm = cm.new_source_file(FileName::Anon.into(), output);
    let mut js_errors = Vec::new();

    parse_file_as_program(
        &output_fm,
        Syntax::Es(EsSyntax {
            jsx: flow_syntax.jsx,
            decorators: true,
            decorators_before_export: true,
            export_default_from: true,
            import_attributes: true,
            allow_super_outside_method: true,
            auto_accessors: true,
            explicit_resource_management: true,
            ..Default::default()
        }),
        EsVersion::latest(),
        None,
        &mut js_errors,
    )
    .map_err(|err| err.into_diagnostic(handler).emit())?;

    if !js_errors.is_empty() {
        for recovered in js_errors {
            recovered.into_diagnostic(handler).emit();
        }
        return Err(());
    }

    Ok(())
}

fn load_flow_syntax(config_path: PathBuf, is_jsx: bool) -> FlowSyntax {
    let mut flow_syntax = FlowSyntax {
        jsx: is_jsx,
        ..Default::default()
    };

    let mut config = String::new();
    if File::open(config_path)
        .ok()
        .and_then(|mut file| file.read_to_string(&mut config).ok())
        .is_some()
    {
        if let Ok(mut parsed) = serde_json::from_str::<FlowSyntax>(&config) {
            parsed.jsx |= is_jsx;
            flow_syntax = parsed;
        }
    }

    flow_syntax
}
