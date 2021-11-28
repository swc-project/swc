use anyhow::{anyhow, Error};
use std::{
    env, fs,
    path::{Path, PathBuf},
    process::{Command, Stdio},
};
use swc_common::FileName;
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::{lexer::Lexer, EsConfig, Parser, StringInput, Syntax};

/// Returns the path to the built plugin
fn build_plugin(dir: &Path) -> Result<PathBuf, Error> {
    {
        let mut cmd = Command::new("cargo");
        cmd.current_dir(dir);
        cmd.arg("build").stderr(Stdio::inherit());
        cmd.output()?;
    }

    for entry in fs::read_dir(&dir.join("target").join("debug"))? {
        let entry = entry?;

        let s = entry.file_name().to_string_lossy().into_owned();
        if (s.starts_with("libswc_internal") && (s.ends_with(".so") || s.ends_with(".dylib")))
            || s.ends_with(".dll")
        {
            return Ok(entry.path());
        }
    }

    Err(anyhow!("Could not find built plugin"))
}

#[test]
fn internal() -> Result<(), Error> {
    let path = build_plugin(
        &PathBuf::from(env::var("CARGO_MANIFEST_DIR")?)
            .join("..")
            .join("..")
            .join("tests")
            .join("rust-plugins")
            .join("swc_internal_plugin"),
    )?;

    testing::run_test(false, |cm, _handler| {
        let fm = cm.new_source_file(FileName::Anon, "console.log(foo)".into());

        let lexer = Lexer::new(
            Syntax::Es(EsConfig {
                ..Default::default()
            }),
            EsVersion::latest(),
            StringInput::from(&*fm),
            None,
        );
        let mut parser = Parser::new_from(lexer);

        let program = parser.parse_program().unwrap();

        let _program =
            swc_plugin_runner::apply_js_plugin("internal-test", &path, "{}", program).unwrap();

        Ok(())
    })
    .unwrap();

    Ok(())
}
