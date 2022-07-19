use std::{
    env, fs,
    path::{Path, PathBuf},
    process::{Command, Stdio},
};

use anyhow::{anyhow, Error};
use swc_common::{
    errors::HANDLER,
    plugin::{PluginSerializedBytes, VersionedSerializable},
    sync::Lazy,
    FileName, Mark,
};
use swc_ecma_ast_latest::{CallExpr, Callee, EsVersion, Expr, Lit, MemberExpr, Program, Str};
use swc_ecma_parser::{parse_file_as_program, EsConfig, Syntax};
use swc_ecma_visit::{Visit, VisitWith};
use swc_plugin_runner::cache::PluginModuleCache;

/// Returns the path to the built plugin
fn build_plugin(dir: &Path) -> Result<PathBuf, Error> {
    {
        let mut cmd = Command::new("cargo");
        cmd.current_dir(dir);
        cmd.args(["build", "--target=wasm32-wasi"])
            .stderr(Stdio::inherit());
        cmd.output()?;

        if !cmd
            .status()
            .expect("Exit code should be available")
            .success()
        {
            return Err(anyhow!("Failed to build plugin"));
        }
    }

    for entry in fs::read_dir(&dir.join("target").join("wasm32-wasi").join("debug"))? {
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
            .join("tests")
            .join("fixture")
            .join("swc_internal_plugin"),
    )?;

    // run single plugin
    testing::run_test(false, |cm, _handler| {
        let fm = cm.new_source_file(FileName::Anon, "console.log(foo)".into());

        let program = parse_file_as_program(
            &fm,
            Syntax::Es(EsConfig {
                ..Default::default()
            }),
            EsVersion::latest(),
            None,
            &mut vec![],
        )
        .unwrap();

        let program = PluginSerializedBytes::try_serialize(&VersionedSerializable::new(program))
            .expect("Should serializable");
        let config =
            PluginSerializedBytes::try_serialize(&VersionedSerializable::new("{}".to_string()))
                .expect("Should serializable");
        let context = PluginSerializedBytes::try_serialize(&VersionedSerializable::new(
            "{sourceFileName: 'single_plugin_test'}".to_string(),
        ))
        .expect("Should serializable");

        let cache: Lazy<PluginModuleCache> = Lazy::new(PluginModuleCache::new);
        let mut plugin_transform_executor =
            swc_plugin_runner::create_plugin_transform_executor(&path, &cache, &cm)
                .expect("Should load plugin");

        let program_bytes = plugin_transform_executor
            .transform(&program, &config, &context, Mark::new(), false)
            .expect("Plugin should apply transform");

        let program: Program = program_bytes
            .deserialize()
            .expect("Should able to deserialize")
            .into_inner();
        let mut visitor = TestVisitor {
            plugin_transform_found: false,
        };
        program.visit_with(&mut visitor);

        visitor
            .plugin_transform_found
            .then(|| visitor.plugin_transform_found)
            .ok_or(())
    })
    .expect("Should able to run single plugin transform");

    // run single plugin with handler
    testing::run_test2(false, |cm, handler| {
        let fm = cm.new_source_file(FileName::Anon, "console.log(foo)".into());

        let program = parse_file_as_program(
            &fm,
            Syntax::Es(EsConfig {
                ..Default::default()
            }),
            EsVersion::latest(),
            None,
            &mut vec![],
        )
        .unwrap();

        let program = PluginSerializedBytes::try_serialize(&VersionedSerializable::new(program))
            .expect("Should serializable");
        let config =
            PluginSerializedBytes::try_serialize(&VersionedSerializable::new("{}".to_string()))
                .expect("Should serializable");
        let context = PluginSerializedBytes::try_serialize(&VersionedSerializable::new(
            "{sourceFileName: 'single_plugin_handler_test'}".to_string(),
        ))
        .expect("Should serializable");

        let cache: Lazy<PluginModuleCache> = Lazy::new(PluginModuleCache::new);

        let _res = HANDLER.set(&handler, || {
            let mut plugin_transform_executor =
                swc_plugin_runner::create_plugin_transform_executor(&path, &cache, &cm)
                    .expect("Should load plugin");

            plugin_transform_executor
                .transform(&program, &config, &context, Mark::new(), false)
                .expect("Plugin should apply transform")
        });

        Ok(())
    })
    .expect("Should able to run single plugin transform with handler");

    // Run multiple plugins.
    testing::run_test(false, |cm, _handler| {
        let fm = cm.new_source_file(FileName::Anon, "console.log(foo)".into());

        let program = parse_file_as_program(
            &fm,
            Syntax::Es(EsConfig {
                ..Default::default()
            }),
            EsVersion::latest(),
            None,
            &mut vec![],
        )
        .unwrap();

        let mut serialized_program =
            PluginSerializedBytes::try_serialize(&VersionedSerializable::new(program))
                .expect("Should serializable");
        let cache: Lazy<PluginModuleCache> = Lazy::new(PluginModuleCache::new);

        let mut plugin_transform_executor =
            swc_plugin_runner::create_plugin_transform_executor(&path, &cache, &cm)
                .expect("Should load plugin");

        serialized_program = plugin_transform_executor
            .transform(
                &serialized_program,
                &PluginSerializedBytes::try_serialize(&VersionedSerializable::new(
                    "{}".to_string(),
                ))
                .expect("Should serializable"),
                &PluginSerializedBytes::try_serialize(&VersionedSerializable::new(
                    "{sourceFileName: 'multiple_plugin_test'}".to_string(),
                ))
                .expect("Should serializable"),
                Mark::new(),
                false,
            )
            .expect("Plugin should apply transform");

        // TODO: we'll need to apply 2 different plugins
        let mut plugin_transform_executor =
            swc_plugin_runner::create_plugin_transform_executor(&path, &cache, &cm)
                .expect("Should load plugin");

        serialized_program = plugin_transform_executor
            .transform(
                &serialized_program,
                &PluginSerializedBytes::try_serialize(&VersionedSerializable::new(
                    "{}".to_string(),
                ))
                .expect("Should serializable"),
                &PluginSerializedBytes::try_serialize(&VersionedSerializable::new(
                    "{sourceFileName: 'multiple_plugin_test2'}".to_string(),
                ))
                .expect("Should serializable"),
                Mark::new(),
                false,
            )
            .expect("Plugin should apply transform");

        let program: Program = serialized_program
            .deserialize()
            .expect("Should able to deserialize")
            .into_inner();
        let mut visitor = TestVisitor {
            plugin_transform_found: false,
        };
        program.visit_with(&mut visitor);

        visitor
            .plugin_transform_found
            .then(|| visitor.plugin_transform_found)
            .ok_or(())
    })
    .expect("Should able to run multiple plugins transform");

    Ok(())
}
