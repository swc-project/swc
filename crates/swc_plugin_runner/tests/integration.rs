use anyhow::{anyhow, Error};
use std::{
    env, fs,
    path::{Path, PathBuf},
    process::{Command, Stdio},
};
use swc_common::FileName;
use swc_ecma_ast::{CallExpr, Callee, EsVersion, Expr, Lit, MemberExpr, Str};
use swc_ecma_parser::{lexer::Lexer, EsConfig, Parser, StringInput, Syntax};
use swc_ecma_visit::{Visit, VisitWith};

/// Returns the path to the built plugin
fn build_plugin(dir: &Path) -> Result<PathBuf, Error> {
    {
        let mut cmd = if cfg!(windows) {
            let mut c = Command::new("cmd");
            c.args(&["/C", "build.cmd"]);
            c
        } else {
            let mut c = Command::new("sh");
            c.args(&["-c", "./build.sh"]);
            c
        };

        cmd.current_dir(dir);
        cmd.stderr(Stdio::inherit()).output()?;
    }

    for entry in fs::read_dir(
        &dir.join("target")
            .join("wasm32-unknown-unknown")
            .join("debug"),
    )? {
        let entry = entry?;

        let s = entry.file_name().to_string_lossy().into_owned();
        if s.eq_ignore_ascii_case("swc_internal_plugin.wasm") {
            return Ok(entry.path());
        }
    }

    Err(anyhow!("Could not find built plugin"))
}

struct TestVisitor {
    pub plugin_transform_found: bool,
}

impl Visit for TestVisitor {
    fn visit_call_expr(&mut self, call: &CallExpr) {
        if let Callee::Expr(expr) = &call.callee {
            if let Expr::Member(MemberExpr { obj, .. }) = &**expr {
                if let Expr::Ident(ident) = &**obj {
                    if ident.sym == *"console" {
                        let args = &*(call.args[0].expr);
                        if let Expr::Lit(Lit::Str(Str { value, .. })) = args {
                            self.plugin_transform_found = value == "changed_via_plugin";
                        }
                    }
                }
            }
        }
    }
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

        let program =
            swc_plugin_runner::apply_js_plugin("internal-test", &path, &mut None, "{}", program)
                .expect("Plugin should apply transform");

        let mut visitor = TestVisitor {
            plugin_transform_found: false,
        };
        program.visit_with(&mut visitor);

        visitor
            .plugin_transform_found
            .then(|| visitor.plugin_transform_found)
            .ok_or(())
    })
    .unwrap();

    Ok(())
}
