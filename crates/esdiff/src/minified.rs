use crate::util::{parse, print_js};
use anyhow::{bail, Context, Result};
use std::{
    path::PathBuf,
    process::{Command, Stdio},
    sync::Arc,
};
use structopt::StructOpt;
use swc_common::{FileName, Mark, SourceMap};
use swc_ecma_diff::Diff;
use swc_ecma_minifier::option::{ExtraOptions, MinifyOptions};
use swc_ecma_transforms_base::resolver::resolver_with_mark;
use swc_ecma_visit::VisitMutWith;

/// Diff the output of swc minifier and terser.
#[derive(Debug, StructOpt)]
pub(crate) struct DiffMinifiedCommand {
    input: PathBuf,

    #[structopt(long)]
    no_mangle: bool,
}

impl DiffMinifiedCommand {
    pub fn run(self, cm: Arc<SourceMap>) -> Result<()> {
        let terser_output = self
            .get_output_from_terser()
            .context("failed to get output from terser")?;

        let fm = cm
            .load_file(&self.input)
            .context("failed to load input file")?;

        let top_level_mark = Mark::fresh(Mark::root());

        let mut swc_module = {
            let mut m = parse(&fm).context("failed to parse input file using swc")?;

            m.visit_mut_with(&mut resolver_with_mark(top_level_mark));

            m = swc_ecma_minifier::optimize(
                m,
                cm.clone(),
                None,
                None,
                &MinifyOptions {
                    compress: Some(Default::default()),
                    mangle: if self.no_mangle {
                        None
                    } else {
                        Some(Default::default())
                    },
                    ..Default::default()
                },
                &ExtraOptions { top_level_mark },
            );

            m
        };

        let terser_fm = cm.new_source_file(FileName::Anon, terser_output);
        let mut terser_module = parse(&terser_fm)?;

        {
            // Diff

            terser_module.visit_mut_with(&mut resolver_with_mark(top_level_mark));

            let config = swc_ecma_diff::Config { ignore_span: true };
            let mut ctx = swc_ecma_diff::Ctx::new(config);
            let diff_res = swc_module.diff(&mut terser_module, &mut ctx);

            eprintln!("Diff: \n{}", diff_res);
        }

        let swc_output = print_js(cm.clone(), &swc_module).context("failed to print js")?;
        let terser_output = print_js(cm.clone(), &terser_module).context("failed to print js")?;

        pretty_assertions::assert_eq!(swc_output, terser_output);

        Ok(())
    }

    /// Invoke `terser`
    fn get_output_from_terser(&self) -> Result<String> {
        let mut c = Command::new("terser");

        c.arg("--compress");

        if !self.no_mangle {
            c.arg("--mangle");
        }

        let output = c
            .arg("--")
            .arg(&self.input)
            .stderr(Stdio::inherit())
            .output()
            .context("failed to run terser")?;

        if !output.status.success() {
            bail!("terser failed with status code {}", output.status);
        }

        let src = String::from_utf8(output.stdout).context("failed to parse terser output")?;
        Ok(src)
    }
}
