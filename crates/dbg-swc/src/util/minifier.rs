use std::{
    path::Path,
    process::{Command, Stdio},
    sync::Arc,
};

use anyhow::{bail, Context, Result};
use swc_common::{FileName, SourceMap};
use swc_ecma_ast::*;
use swc_ecma_minifier::option::{CompressOptions, MangleOptions, MinifyOptions};
use swc_ecma_transforms_base::fixer::fixer;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use super::{parse_js, print_js, wrap_task, ModuleRecord};

pub fn get_minified(
    cm: Arc<SourceMap>,
    file: &Path,
    compress: bool,
    mangle: bool,
) -> Result<ModuleRecord> {
    get_minified_with_opts(
        cm,
        file,
        if compress {
            Some(Default::default())
        } else {
            None
        },
        if mangle {
            Some(Default::default())
        } else {
            None
        },
    )
}

pub fn get_minified_with_opts(
    cm: Arc<SourceMap>,
    file: &Path,
    compress: Option<CompressOptions>,
    mangle: Option<MangleOptions>,
) -> Result<ModuleRecord> {
    let fm = cm.load_file(file)?;

    let m = parse_js(fm)?;

    let mut module = {
        swc_ecma_minifier::optimize(
            m.module.into(),
            cm,
            Some(&m.comments),
            None,
            &MinifyOptions {
                compress,
                mangle,
                ..Default::default()
            },
            &swc_ecma_minifier::option::ExtraOptions {
                unresolved_mark: m.unresolved_mark,
                top_level_mark: m.top_level_mark,
                mangle_name_cache: None,
            },
        )
        .expect_module()
    };

    module.visit_mut_with(&mut Normalizer {});
    module.visit_mut_with(&mut fixer(None));

    Ok(ModuleRecord { module, ..m })
}

pub fn get_terser_output(file: &Path, compress: bool, mangle: bool) -> Result<String> {
    wrap_task(|| {
        let mut cmd = Command::new("npx");
        cmd.arg("terser");
        cmd.stderr(Stdio::inherit());

        if compress {
            cmd.arg("--compress");
        }
        if mangle {
            cmd.arg("--mangle");
        }
        cmd.args(["--comments", "false"]);
        cmd.arg("--");
        cmd.arg(file);

        let output = cmd.output().context("failed to get output")?;

        if !output.status.success() {
            bail!("failed to run terser");
        }

        let output = String::from_utf8(output.stdout).context("terser emitted non-utf8 string")?;

        // Drop comments
        let cm = Arc::new(SourceMap::default());
        let fm = cm.new_source_file(FileName::Anon.into(), output);
        let m = parse_js(fm)?;

        let code = print_js(cm, &m.module, true)?;

        Ok(code)
    })
    .with_context(|| format!("failed to get output of {} from terser", file.display()))
}

pub fn get_esbuild_output(file: &Path, mangle: bool) -> Result<String> {
    wrap_task(|| {
        let mut cmd = Command::new("esbuild");
        cmd.stderr(Stdio::inherit());

        cmd.arg(file);

        if mangle {
            cmd.arg("--minify");
        } else {
            cmd.arg("--minify-syntax").arg("--minify-whitespace");
        }

        let output = cmd.output().context("failed to get output")?;

        if !output.status.success() {
            bail!("failed to run esbuild");
        }

        String::from_utf8(output.stdout).context("esbuild emitted non-utf8 string")
    })
    .with_context(|| format!("failed to get output of {} from esbuild", file.display()))
}

/// We target es5 while esbuild does not support it.
///
/// Due to the difference, reducer generates something useless
struct Normalizer {}

impl VisitMut for Normalizer {
    noop_visit_mut_type!(fail);

    fn visit_mut_prop(&mut self, p: &mut Prop) {
        p.visit_mut_children_with(self);

        // if let Prop::KeyValue(kv) = p {
        //     if let PropName::Ident(k) = &kv.key {
        //         match &*kv.value {
        //             Expr::Ident(value) if k.sym == value.sym => {
        //                 *p = Prop::Shorthand(k.clone());
        //             }
        //             _ => {}
        //         }
        //     }
        // }
    }
}
